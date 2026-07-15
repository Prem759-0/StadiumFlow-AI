// ============================================================
// StadiumFlow AI - Cloud Functions Simulation Layer
// Simulates Google Cloud Functions for serverless background
// AI processing, crowd predictions, and queue management
// ============================================================

import { useStaffStore } from "./store";
import { vertexAI, type VertexAIZoneContext, type VertexAIQueueContext } from "./vertex-ai";
import { publish, subscribe, PUBSUB_TOPICS } from "./pubsub";
import { writePredictionsToFirestore, writeAlertToFirestore } from "./firebase";
import { generateId, getCongestionLevel } from "./utils";

// ---- Active timers for scheduled functions ----
let predictionTimer: any = null;
let safetyTimer: any = null;
let queueTimer: any = null;

/**
 * Handler: scheduledCrowdPrediction.
 * Analyzes live stadium data and generates AI forecasts.
 */
export async function scheduledCrowdPrediction(): Promise<void> {
  console.info(`[Cloud Function] scheduledCrowdPrediction execution started`);
  const store = useStaffStore.getState();

  const zoneContext: VertexAIZoneContext[] = store.zones.map((z) => ({
    id: z.id,
    name: z.name,
    occupancy: z.currentOccupancy,
    capacity: z.capacity,
    congestionLevel: getCongestionLevel(Math.round((z.currentOccupancy / z.capacity) * 100)),
    safetyScore: Math.max(0, 100 - (z.currentOccupancy / z.capacity) * 100),
  }));

  const queueContext: VertexAIQueueContext[] = store.queues.map((q) => ({
    name: q.name,
    currentQueue: q.currentQueue,
    estimatedWait: q.estimatedWait,
    trend: q.arrivalRate > q.maxServiceRate ? "increasing" : "stable",
    serviceRate: q.maxServiceRate,
  }));

  try {
    const predictions = await vertexAI.predictCrowdFlow(zoneContext, queueContext);
    const predictionTexts = predictions.map((p) => p.prediction);

    store.setAIPredictions(predictionTexts);
    await writePredictionsToFirestore(predictionTexts);

    await publish(PUBSUB_TOPICS.AI_PREDICTIONS, {
      predictions: predictionTexts,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[Cloud Function] scheduledCrowdPrediction failed:", err);
  }
}

/**
 * Handler: onAlertCreated.
 */
export async function onAlertCreated(alert: any): Promise<void> {
  console.info(`[Cloud Function] onAlertCreated (trigger: firestore.alerts.onCreate)`);
  
  if (isFirebaseConfigured()) {
    await writeAlertToFirestore({ ...alert, status: "pending" });
  }

  await publish(PUBSUB_TOPICS.STAFF_DISPATCH, {
    alertId: alert.id,
    location: alert.location,
    priority: alert.priority,
  });

  if (alert.priority === "critical") {
    await publish(PUBSUB_TOPICS.CROWD_ALERTS, {
      message: `CRITICAL: ${alert.message}`,
      zoneId: alert.zoneId,
    });
  }
}

/**
 * Handler: analyzeSafetyThresholds.
 */
export async function analyzeSafetyThresholds(): Promise<void> {
  const store = useStaffStore.getState();
  const dangerousZones = store.zones.filter((z) => z.currentOccupancy / z.capacity > 0.9);

  for (const zone of dangerousZones) {
    const alert = {
      id: `safety-${generateId()}`,
      type: "crowd" as const,
      message: `⚠️ SAFETY: ${zone.name} is at capacity`,
      location: zone.name,
      zoneId: zone.id,
      priority: "critical" as const,
    };
    await onAlertCreated(alert);
    store.addAlert({ ...alert, timestamp: new Date(), status: "pending" });
  }
}

/**
 * Start all scheduled simulators.
 */
export function startCloudFunctions(): void {
  console.info("[Cloud Functions] Initializing serverless runtimes...");

  if (!predictionTimer) {
    predictionTimer = setInterval(scheduledCrowdPrediction, 30000);
  }

  if (!safetyTimer) {
    safetyTimer = setInterval(analyzeSafetyThresholds, 60000);
  }
}

/**
 * Stop all scheduled Cloud Functions.
 */
export function stopCloudFunctions(): void {
  if (predictionTimer) {
    clearInterval(predictionTimer);
    predictionTimer = null;
  }
  if (safetyTimer) {
    clearInterval(safetyTimer);
    safetyTimer = null;
  }
}

function isFirebaseConfigured() {
  return !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
}

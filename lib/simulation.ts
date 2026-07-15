// ============================================================
// StadiumFlow AI - Real-time Simulation Engine
// Simulates crowd movement, queue changes, and events
// Updates every 4-6 seconds with smooth randomized transitions
// ============================================================

import { useStaffStore } from "./store";
import type { StadiumZone, QueuePoint, Alert } from "./mock-data";
import { generateId } from "./utils";

/** Apply random fluctuation within bounds */
function fluctuate(value: number, min: number, max: number, volatility: number = 0.08): number {
  const change = (Math.random() - 0.5) * 2 * volatility * value;
  return Math.max(min, Math.min(max, Math.round(value + change)));
}

/** Simulate zone occupancy changes */
function simulateZones(zones: StadiumZone[]): StadiumZone[] {
  return zones.map((zone) => ({
    ...zone,
    currentOccupancy: fluctuate(zone.currentOccupancy, 0, zone.capacity, 0.05),
  }));
}

/** Simulate queue changes */
function simulateQueues(queues: QueuePoint[]): QueuePoint[] {
  return queues.map((queue) => {
    const newQueue = fluctuate(queue.currentQueue, 0, 500, 0.1);
    const newArrivalRate = fluctuate(queue.arrivalRate, 1, 30, 0.15);
    const effectiveRate = Math.max(1, queue.maxServiceRate - newArrivalRate);
    const estimatedWait = Math.round(newQueue / effectiveRate);

    return {
      ...queue,
      currentQueue: newQueue,
      arrivalRate: newArrivalRate,
      estimatedWait: Math.max(1, estimatedWait),
    };
  });
}

/** Maybe generate a random alert */
function maybeGenerateAlert(): Alert | null {
  if (Math.random() > 0.08) return null; // ~8% chance per tick

  const alertTypes: Alert["type"][] = ["lost", "medical", "security", "maintenance", "crowd"];
  const priorities: Alert["priority"][] = ["low", "medium", "high"];
  const locations = [
    { location: "North Concourse East", zoneId: "conc-n2" },
    { location: "Gate B Entry", zoneId: "gate-b" },
    { location: "South Food Court", zoneId: "food-s" },
    { location: "Section E2 Upper", zoneId: "sec-e2" },
    { location: "West Concourse", zoneId: "conc-w1" },
    { location: "Parking Lot A", zoneId: "park-n" },
  ];

  const messages = {
    lost: [
      "Elderly person requesting assistance",
      "Child separated from parents",
      "Visitor unable to find their seat",
    ],
    medical: [
      "Person feeling dizzy due to heat",
      "Minor injury reported - first aid needed",
    ],
    security: [
      "Unauthorized person in restricted area",
      "Suspicious bag reported",
    ],
    maintenance: [
      "Spill in concourse needs cleaning",
      "Water fountain malfunction",
      "Escalator needs service",
    ],
    crowd: [
      "Crowd density exceeding safe threshold",
      "Bottleneck forming at concourse junction",
      "Slow movement detected in exit lane",
    ],
  };

  const type = alertTypes[Math.floor(Math.random() * alertTypes.length)];
  const loc = locations[Math.floor(Math.random() * locations.length)];
  const msgs = messages[type];

  return {
    id: `alert-${generateId()}`,
    type,
    message: msgs[Math.floor(Math.random() * msgs.length)],
    location: loc.location,
    zoneId: loc.zoneId,
    timestamp: new Date(),
    status: "pending",
    priority: priorities[Math.floor(Math.random() * priorities.length)],
  };
}

/** Update dashboard metrics based on current state */
function updateMetrics(zones: StadiumZone[], queues: QueuePoint[]) {
  const totalAttendees = zones.reduce((sum, z) => sum + z.currentOccupancy, 0);
  const avgWaitTime =
    queues.reduce((sum, q) => sum + q.estimatedWait, 0) / queues.length;
  const congestionHotspots = zones.filter(
    (z) => z.currentOccupancy / z.capacity > 0.8
  ).length;

  return {
    totalAttendees,
    avgWaitTime: Math.round(avgWaitTime * 10) / 10,
    congestionHotspots,
    // Performance metrics showing AI impact
    waitTimeReduction: fluctuate(32, 25, 40, 0.05),
    throughputIncrease: fluctuate(28, 20, 35, 0.05),
    crowdFlowScore: fluctuate(87, 80, 95, 0.03),
  };
}

let simulationInterval: ReturnType<typeof setInterval> | null = null;

/** Start the real-time simulation */
export function startSimulation() {
  if (simulationInterval) return;

  const tick = () => {
    const store = useStaffStore.getState();
    if (!store.isSimulationRunning) return;

    const newZones = simulateZones(store.zones);
    const newQueues = simulateQueues(store.queues);
    const newMetrics = updateMetrics(newZones, newQueues);
    const newAlert = maybeGenerateAlert();

    store.updateZones(newZones);
    store.updateQueues(newQueues);
    store.updateMetrics(newMetrics);

    if (newAlert) {
      store.addAlert(newAlert);
      store.updateMetrics({
        alertsActive: store.alerts.filter((a) => a.status === "pending").length + 1,
      });
    }
  };

  // Random interval between 4-6 seconds
  const scheduleNext = () => {
    const delay = 4000 + Math.random() * 2000;
    simulationInterval = setTimeout(() => {
      tick();
      scheduleNext();
    }, delay);
  };

  scheduleNext();
}

/** Stop the simulation */
export function stopSimulation() {
  if (simulationInterval) {
    clearTimeout(simulationInterval);
    simulationInterval = null;
  }
}

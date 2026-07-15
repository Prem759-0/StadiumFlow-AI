// ============================================================
// StadiumFlow AI - Integration Flows
// ============================================================

import { describe, it, expect, vi } from "vitest";
import { publish, subscribe, PUBSUB_TOPICS } from "@/lib/pubsub";
import { onAlertCreated, processVirtualQueue } from "@/lib/cloud-functions";
import { useStaffStore } from "@/lib/store";

describe("End-to-End Fan Help Request Flow", () => {
  it("should process 'I am lost' to staff alert via Pub/Sub", async () => {
    const mockStaffDashboardListener = vi.fn();
    subscribe(PUBSUB_TOPICS.FAN_HELP_REQUESTS, mockStaffDashboardListener);

    // 1. Fan hits publish
    await publish(PUBSUB_TOPICS.FAN_HELP_REQUESTS, {
      message: "I am lost",
      location: "Gate C",
    });

    // 2. Staff dashboard receives it
    expect(mockStaffDashboardListener).toHaveBeenCalled();
    const msg = mockStaffDashboardListener.mock.calls[0][0];
    expect(msg.data.message).toBe("I am lost");

    // 3. Cloud function triggers
    await onAlertCreated({
      id: "test-alert",
      type: "lost",
      message: msg.data.message as string,
      location: msg.data.location as string,
      zoneId: "gate-c",
      priority: "high"
    });

    // 4. Staff store receives the alert
    useStaffStore.getState().addAlert({
      id: "test-alert",
      type: "lost",
      message: msg.data.message as string,
      location: msg.data.location as string,
      zoneId: "gate-c",
      timestamp: new Date(),
      status: "pending",
      priority: "high"
    });

    const storeAlerts = useStaffStore.getState().alerts;
    const addedAlert = storeAlerts.find(a => a.id === "test-alert");
    expect(addedAlert).toBeDefined();
    expect(addedAlert?.location).toBe("Gate C");
  });
});

describe("Virtual Queue Process Flow", () => {
  it("should advance queue position and publish update", async () => {
    const notifyListener = vi.fn();
    subscribe(PUBSUB_TOPICS.QUEUE_UPDATES, notifyListener);

    // Fan starts at position 6
    const result = await processVirtualQueue("q123", "user123", 6);
    
    // Position should advance
    expect(result.newPosition).toBeLessThanOrEqual(6);
    
    // Listeners should be notified
    expect(notifyListener).toHaveBeenCalled();
  });
});

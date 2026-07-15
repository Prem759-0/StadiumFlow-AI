// ============================================================
// StadiumFlow AI - Firebase & PubSub Tests
// ============================================================

import { describe, it, expect, vi, beforeEach } from "vitest";
import { getMockUserProfile, COLLECTIONS } from "@/lib/firebase";
import { publish, subscribe, getMessageHistory, clearAllSubscriptions, PUBSUB_TOPICS } from "@/lib/pubsub";

describe("Firebase Auth (Mock Mode)", () => {
  it("should return valid mock fan profile", () => {
    const profile = getMockUserProfile("fan");
    expect(profile.role).toBe("fan");
    expect(profile.uid).toBeDefined();
    expect(profile.points).toBeGreaterThan(0);
  });

  it("should return valid mock staff profile", () => {
    const profile = getMockUserProfile("staff");
    expect(profile.role).toBe("staff");
    expect(profile.displayName).toBe("Staff Admin");
  });
});

describe("Cloud Pub/Sub Simulation", () => {
  beforeEach(() => {
    clearAllSubscriptions();
  });

  it("should publish and receive messages", () => {
    const callback = vi.fn();
    subscribe(PUBSUB_TOPICS.FAN_HELP_REQUESTS, callback);

    publish(PUBSUB_TOPICS.FAN_HELP_REQUESTS, { message: "Lost fan" });
    
    expect(callback).toHaveBeenCalledTimes(1);
    const receivedMsg = callback.mock.calls[0][0];
    expect(receivedMsg.topic).toBe(PUBSUB_TOPICS.FAN_HELP_REQUESTS);
    expect(receivedMsg.data.message).toBe("Lost fan");
  });

  it("should maintain message history", async () => {
    await publish(PUBSUB_TOPICS.QUEUE_UPDATES, { position: 5 });
    await publish(PUBSUB_TOPICS.QUEUE_UPDATES, { position: 4 });

    const history = getMessageHistory(PUBSUB_TOPICS.QUEUE_UPDATES);
    expect(history.length).toBeGreaterThanOrEqual(2);
    expect(history[history.length - 1].data.position).toBe(4);
  });

  it("should handle unsubscribe correctly", () => {
    const callback = vi.fn();
    const unsub = subscribe(PUBSUB_TOPICS.CROWD_ALERTS, callback);
    
    unsub();
    publish(PUBSUB_TOPICS.CROWD_ALERTS, { danger: true });
    
    expect(callback).not.toHaveBeenCalled();
  });
});

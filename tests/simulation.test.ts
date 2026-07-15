// ============================================================
// StadiumFlow AI - Simulation Engine Tests
// ============================================================

import { describe, it, expect } from "vitest";
import { useStaffStore } from "@/lib/store";

describe("Staff Store Simulation Integrity", () => {
  it("should initialize with 25 stadium zones", () => {
    const state = useStaffStore.getState();
    expect(state.zones.length).toBe(25);
  });

  it("should compute correct metrics structure", () => {
    const metrics = useStaffStore.getState().metrics;
    expect(metrics).toHaveProperty("totalAttendees");
    expect(metrics).toHaveProperty("avgWaitTime");
    expect(metrics).toHaveProperty("congestionHotspots");
    expect(metrics).toHaveProperty("crowdFlowScore");
  });

  it("should allow toggling simulation state", () => {
    const store = useStaffStore.getState();
    const initialState = store.isSimulationRunning;
    
    store.toggleSimulation();
    expect(useStaffStore.getState().isSimulationRunning).toBe(!initialState);
    
    store.toggleSimulation();
    expect(useStaffStore.getState().isSimulationRunning).toBe(initialState);
  });

  it("should allow adding alerts", () => {
    const store = useStaffStore.getState();
    const initialAlertCount = store.alerts.length;
    
    store.addAlert({
      id: "test-alert",
      type: "medical",
      message: "Test alert",
      location: "Gate C",
      zoneId: "gate-c",
      timestamp: new Date(),
      status: "pending",
      priority: "high"
    });
    
    expect(useStaffStore.getState().alerts.length).toBe(initialAlertCount + 1);
  });
});

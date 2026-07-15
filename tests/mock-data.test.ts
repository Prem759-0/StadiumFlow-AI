// ============================================================
// StadiumFlow AI - Mock Data Tests
// Validates data integrity and structure
// ============================================================

import { describe, it, expect } from "vitest";
import {
  stadiumZones,
  queuePoints,
  foodVendors,
  routeNodes,
  defaultAttendee,
  matchInfo,
} from "@/lib/mock-data";

describe("Stadium Zones", () => {
  it("should have valid zone data", () => {
    expect(stadiumZones.length).toBeGreaterThan(10);
    stadiumZones.forEach((zone) => {
      expect(zone.id).toBeTruthy();
      expect(zone.name).toBeTruthy();
      expect(zone.capacity).toBeGreaterThan(0);
      expect(zone.currentOccupancy).toBeLessThanOrEqual(zone.capacity);
      expect(zone.position.x).toBeGreaterThanOrEqual(0);
      expect(zone.position.y).toBeGreaterThanOrEqual(0);
    });
  });

  it("should have unique zone IDs", () => {
    const ids = stadiumZones.map((z) => z.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("should have at least 4 gates", () => {
    const gates = stadiumZones.filter((z) => z.type === "gate");
    expect(gates.length).toBeGreaterThanOrEqual(4);
  });
});

describe("Queue Points", () => {
  it("should have valid queue data", () => {
    expect(queuePoints.length).toBeGreaterThan(5);
    queuePoints.forEach((queue) => {
      expect(queue.id).toBeTruthy();
      expect(queue.maxServiceRate).toBeGreaterThan(0);
      expect(queue.estimatedWait).toBeGreaterThanOrEqual(0);
    });
  });

  it("should have entry queues for all gates", () => {
    const entryQueues = queuePoints.filter((q) => q.type === "entry");
    expect(entryQueues.length).toBeGreaterThanOrEqual(4);
  });
});

describe("Food Vendors", () => {
  it("should have menus with items", () => {
    foodVendors.forEach((vendor) => {
      expect(vendor.menu.length).toBeGreaterThan(0);
      vendor.menu.forEach((item) => {
        expect(item.price).toBeGreaterThan(0);
        expect(item.prepTime).toBeGreaterThan(0);
      });
    });
  });
});

describe("Route Network", () => {
  it("should have connected nodes", () => {
    routeNodes.forEach((node) => {
      expect(node.connections.length).toBeGreaterThan(0);
      expect(node.congestion).toBeGreaterThanOrEqual(0);
      expect(node.congestion).toBeLessThanOrEqual(1);
    });
  });
});

describe("Default Attendee", () => {
  it("should have valid profile", () => {
    expect(defaultAttendee.name).toBeTruthy();
    expect(defaultAttendee.seatSection).toBeTruthy();
    expect(["general", "premium", "vip"]).toContain(defaultAttendee.ticketType);
  });
});

describe("Match Info", () => {
  it("should have valid match data", () => {
    expect(matchInfo.title).toBeTruthy();
    expect(matchInfo.capacity).toBe(132000);
    expect(matchInfo.attendance).toBeLessThanOrEqual(matchInfo.capacity);
  });
});

// ============================================================
// StadiumFlow AI - Utils Tests
// Tests for utility functions
// ============================================================

import { describe, it, expect } from "vitest";
import {
  formatWaitTime,
  getCongestionLevel,
  getCongestionColor,
  sanitizeInput,
  calculateRouteTime,
  routeScore,
  predictQueueWait,
} from "@/lib/utils";

describe("formatWaitTime", () => {
  it("should format less than 1 minute", () => {
    expect(formatWaitTime(0.5)).toBe("< 1 min");
  });

  it("should format minutes correctly", () => {
    expect(formatWaitTime(5)).toBe("5 min");
    expect(formatWaitTime(30)).toBe("30 min");
  });

  it("should format hours and minutes", () => {
    expect(formatWaitTime(90)).toBe("1h 30m");
    expect(formatWaitTime(125)).toBe("2h 5m");
  });
});

describe("getCongestionLevel", () => {
  it("should return low for density < 40", () => {
    expect(getCongestionLevel(20)).toBe("low");
    expect(getCongestionLevel(39)).toBe("low");
  });

  it("should return medium for density 40-69", () => {
    expect(getCongestionLevel(40)).toBe("medium");
    expect(getCongestionLevel(65)).toBe("medium");
  });

  it("should return high for density >= 70", () => {
    expect(getCongestionLevel(70)).toBe("high");
    expect(getCongestionLevel(100)).toBe("high");
  });
});

describe("getCongestionColor", () => {
  it("should return correct colors", () => {
    expect(getCongestionColor("low")).toBe("#22c55e");
    expect(getCongestionColor("medium")).toBe("#eab308");
    expect(getCongestionColor("high")).toBe("#ef4444");
  });
});

describe("sanitizeInput", () => {
  it("should escape HTML entities", () => {
    expect(sanitizeInput("<script>alert('xss')</script>")).toBe(
      "&lt;script&gt;alert(&#039;xss&#039;)&lt;/script&gt;"
    );
  });

  it("should trim whitespace", () => {
    expect(sanitizeInput("  hello  ")).toBe("hello");
  });

  it("should limit length to 500 chars", () => {
    const longInput = "a".repeat(600);
    expect(sanitizeInput(longInput).length).toBe(500);
  });

  it("should escape quotes", () => {
    expect(sanitizeInput('"test"')).toBe("&quot;test&quot;");
  });
});

describe("calculateRouteTime", () => {
  it("should calculate time based on distance and congestion", () => {
    const time = calculateRouteTime(100, 0);
    expect(time).toBeGreaterThan(0);
    expect(time).toBeLessThan(5);
  });

  it("should take longer with high congestion", () => {
    const lowCongestion = calculateRouteTime(200, 0.1);
    const highCongestion = calculateRouteTime(200, 0.8);
    expect(highCongestion).toBeGreaterThan(lowCongestion);
  });
});

describe("routeScore", () => {
  it("should calculate score based on distance and congestion", () => {
    const score1 = routeScore(100, 0.2);
    const score2 = routeScore(100, 0.8);
    expect(score2).toBeGreaterThan(score1);
  });

  it("should include elevation penalty", () => {
    const flat = routeScore(100, 0.5, 0);
    const elevated = routeScore(100, 0.5, 2);
    expect(elevated).toBeGreaterThan(flat);
  });
});

describe("predictQueueWait", () => {
  it("should predict wait time based on queue and service rate", () => {
    const wait = predictQueueWait(20, 5, 3);
    expect(wait).toBe(10); // 20 / (5-3) = 10
  });

  it("should handle zero service rate", () => {
    expect(predictQueueWait(20, 0, 5)).toBe(999);
  });

  it("should handle arrival rate exceeding service rate", () => {
    const wait = predictQueueWait(20, 5, 8);
    expect(wait).toBe(4); // Falls back to currentQueue / serviceRate
  });
});

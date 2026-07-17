// ============================================================
// StadiumFlow AI - Gemini & Vertex AI Tests
// ============================================================

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { chatWithGemini, getOptimizedRoute } from "@/lib/gemini";
import { vertexAI } from "@/lib/vertex-ai";

describe("Gemini Chat Fallbacks", () => {
  it("should return food recommendations for food keywords", async () => {
    const response = await chatWithGemini("I am hungry, where is food?");
    expect(response.toLowerCase()).toContain("food court");
  });

  it("should return restroom directions", async () => {
    const response = await chatWithGemini("Where is the toilet?");
    expect(response.toLowerCase()).toContain("restroom");
  });

  it("should trigger help response for lost keyword", async () => {
    const response = await chatWithGemini("I am lost and need help");
    expect(response.toLowerCase()).toContain("don't worry");
    expect(response.toLowerCase()).toContain("staff");
  });
});

describe("Gemini Route Optimization Fallbacks", () => {
  it("should return valid route structure", async () => {
    const route = await getOptimizedRoute({
      from: "Gate A",
      to: "Section N1",
      currentCongestion: {},
      needsAccessibility: false,
    });
    
    expect(route.path.length).toBeGreaterThan(0);
    expect(route.estimatedTime).toBeGreaterThan(0);
    expect(route.instructions.length).toBeGreaterThan(0);
  });
});

describe("Vertex AI Wrapper", () => {
  let originalFetch: typeof global.fetch;

  beforeEach(() => {
    originalFetch = global.fetch;
    global.fetch = vi.fn().mockImplementation((url: RequestInfo | URL) => {
      const urlStr = url.toString();
      if (urlStr.includes("route-optimize")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            path: [{ x: 1, y: 1 }],
            estimatedTime: 10,
            instructions: ["Turn left"],
            googleMapsUrl: "https://maps/dir/Narendra%20Modi%20Stadium",
          }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          { prediction: "Crowd surge", severity: "warning", confidence: 0.9, suggestedAction: "Open gate" }
        ]),
      });
    });
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("should categorize prediction severity correctly", async () => {
    const predictions = await vertexAI.predictCrowdFlow([], []);
    expect(predictions).toBeInstanceOf(Array);
    
    if (predictions.length > 0) {
      const pred = predictions[0];
      expect(pred).toHaveProperty("prediction");
      expect(pred).toHaveProperty("severity");
      expect(["info", "warning", "critical"]).toContain(pred.severity);
    }
  });

  it("should generate Google Maps deep links", async () => {
    const route = await vertexAI.generateRouteOptimization("Gate A", "Section N1", []);
    expect(route.googleMapsUrl).toContain("maps/dir");
    expect(route.googleMapsUrl).toContain("Narendra%20Modi%20Stadium");
  });
});

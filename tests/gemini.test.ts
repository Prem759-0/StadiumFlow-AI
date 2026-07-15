// ============================================================
// StadiumFlow AI - Gemini & Vertex AI Tests
// ============================================================

import { describe, it, expect } from "vitest";
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

// ============================================================
// StadiumFlow AI - Security & Validation Tests
// ============================================================

import { describe, it, expect } from "vitest";
import { sanitizeInput, rateLimit, validateEmail, validateApiKey } from "@/lib/utils";

describe("Input Sanitization (XSS Prevention)", () => {
  it("should escape basic HTML tags", () => {
    expect(sanitizeInput("<b>Test</b>")).toBe("&lt;b&gt;Test&lt;/b&gt;");
  });

  it("should escape script tags with payloads", () => {
    expect(sanitizeInput("<script>alert('hack')</script>"))
      .toBe("&lt;script&gt;alert(&#039;hack&#039;)&lt;/script&gt;");
  });

  it("should escape injection characters", () => {
    expect(sanitizeInput("O'Neill & Sons \"Inc\"")).toBe("O&#039;Neill &amp; Sons &quot;Inc&quot;");
  });

  it("should trim and truncate excessively long inputs", () => {
    const hugeInput = "A".repeat(1000);
    const sanitized = sanitizeInput(hugeInput);
    expect(sanitized.length).toBe(500); // Max length limit
  });
});

describe("Validation Helpers", () => {
  it("should validate standard email addresses", () => {
    expect(validateEmail("user@example.com")).toBe(true);
    expect(validateEmail("admin.test@stadiumflow.ai")).toBe(true);
  });

  it("should reject invalid email addresses", () => {
    expect(validateEmail("userexample.com")).toBe(false);
    expect(validateEmail("user@example")).toBe(false);
    expect(validateEmail("")).toBe(false);
  });

  it("should validate basic API key formats", () => {
    expect(validateApiKey("AIzaSyB2JZpuxe9shC3pi8Aro")).toBe(true);
    expect(validateApiKey("gsk_Glfv8HsiWweFBJEQ")).toBe(true);
  });

  it("should reject invalid API keys", () => {
    expect(validateApiKey("short")).toBe(false); // Too short
    expect(validateApiKey("key with space")).toBe(false); // Contains space
    expect(validateApiKey("")).toBe(false);
  });
});

describe("Rate Limiting Engine", () => {
  it("should allow requests under the limit", () => {
    const key = "ip-127.0.0.1";
    // First 5 requests should pass
    for (let i = 0; i < 5; i++) {
      expect(rateLimit(key, 5, 10000)).toBe(true);
    }
  });

  it("should block requests over the limit", () => {
    const key = "ip-10.0.0.1";
    // Allow 2 requests
    rateLimit(key, 2, 10000);
    rateLimit(key, 2, 10000);
    // Block the 3rd request
    expect(rateLimit(key, 2, 10000)).toBe(false);
  });
});

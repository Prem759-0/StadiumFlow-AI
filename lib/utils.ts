import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes intelligently.
 * Uses clsx for conditional classes and tailwind-merge for deduplication.
 *
 * @param inputs - Class values to merge (strings, objects, arrays)
 * @returns Merged class string with Tailwind conflicts resolved
 *
 * @example
 * cn("px-4 py-2", isActive && "bg-blue-500", "px-6") // "py-2 px-6 bg-blue-500"
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format wait time in minutes to a human-readable string.
 *
 * @param minutes - Wait time in minutes
 * @returns Formatted string (e.g., "5 min", "1h 30m", "< 1 min")
 */
export function formatWaitTime(minutes: number): string {
  if (minutes < 1) return "< 1 min";
  if (minutes < 60) return `${Math.round(minutes)} min`;
  const hrs = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return `${hrs}h ${mins}m`;
}

/**
 * Get congestion level category from density percentage.
 *
 * @param density - Zone occupancy as percentage (0-100)
 * @returns Congestion level: "low" (<40%), "medium" (40-69%), "high" (>=70%)
 */
export function getCongestionLevel(density: number): "low" | "medium" | "high" {
  if (density < 40) return "low";
  if (density < 70) return "medium";
  return "high";
}

/**
 * Get hex color for a congestion level.
 *
 * @param level - Congestion level
 * @returns Hex color string (#22c55e for low, #eab308 for medium, #ef4444 for high)
 */
export function getCongestionColor(level: "low" | "medium" | "high"): string {
  const colors = {
    low: "#22c55e",
    medium: "#eab308",
    high: "#ef4444",
  };
  return colors[level];
}

/**
 * Sanitize user input to prevent XSS attacks.
 * Escapes HTML entities, trims whitespace, and limits length.
 *
 * @param input - Raw user input string
 * @returns Sanitized string safe for rendering
 *
 * @example
 * sanitizeInput('<script>alert("xss")</script>') // "&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;"
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .trim()
    .slice(0, 500); // Limit input length
}

/**
 * Calculate estimated walking route time based on distance and congestion.
 *
 * @param distanceMeters - Distance in meters
 * @param congestionFactor - Congestion factor (0-1, where 1 = maximum congestion)
 * @returns Estimated time in minutes
 */
export function calculateRouteTime(
  distanceMeters: number,
  congestionFactor: number
): number {
  const baseSpeed = 1.2; // m/s walking speed
  const adjustedSpeed = baseSpeed * (1 - congestionFactor * 0.5);
  return Math.round(distanceMeters / adjustedSpeed / 60); // minutes
}

/**
 * Generate a random alphanumeric ID.
 *
 * @returns 9-character random string (a-z, 0-9)
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

/**
 * Format a number with locale-specific thousand separators.
 *
 * @param n - Number to format
 * @returns Formatted string (e.g., "98,500")
 */
export function formatNumber(n: number): string {
  return n.toLocaleString();
}

/**
 * Calculate optimal route score (lower is better).
 * Considers distance, congestion, and elevation penalty.
 *
 * @param distance - Route distance in meters
 * @param congestion - Congestion factor (0-1)
 * @param elevation - Elevation change in floors (default: 0)
 * @returns Weighted route score
 */
export function routeScore(
  distance: number,
  congestion: number,
  elevation: number = 0
): number {
  return distance * (1 + congestion) + elevation * 10;
}

/**
 * Predict queue wait time using Little's Law approximation.
 *
 * @param currentQueue - Number of people currently in queue
 * @param serviceRatePerMin - People served per minute
 * @param arrivalRatePerMin - New arrivals per minute
 * @returns Estimated wait time in minutes
 */
export function predictQueueWait(
  currentQueue: number,
  serviceRatePerMin: number,
  arrivalRatePerMin: number
): number {
  if (serviceRatePerMin <= 0) return 999;
  const effectiveRate = serviceRatePerMin - arrivalRatePerMin;
  if (effectiveRate <= 0) return currentQueue / serviceRatePerMin;
  return currentQueue / effectiveRate;
}

/**
 * Get relative time string from a Date.
 *
 * @param date - Date to compare against now
 * @returns Human-readable relative time (e.g., "5m ago", "2h ago")
 */
export function timeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  if (diffSecs < 60) return `${diffSecs}s ago`;
  const diffMins = Math.floor(diffSecs / 60);
  if (diffMins < 60) return `${diffMins}m ago`;
  return `${Math.floor(diffMins / 60)}h ago`;
}

/**
 * Simple in-memory rate limiter.
 * Tracks request counts per key within a time window.
 *
 * @param key - Unique identifier (e.g., IP address, user ID)
 * @param maxRequests - Maximum requests allowed per window
 * @param windowMs - Time window in milliseconds
 * @returns true if request is allowed, false if rate limited
 */
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(
  key: string,
  maxRequests: number = 30,
  windowMs: number = 60000
): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (entry.count >= maxRequests) return false;
  entry.count++;
  return true;
}

/**
 * Validate email address format.
 *
 * @param email - Email string to validate
 * @returns true if email format is valid
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate API key format (basic check).
 *
 * @param key - API key string
 * @returns true if key meets minimum length and pattern requirements
 */
export function validateApiKey(key: string): boolean {
  return typeof key === "string" && key.length >= 10 && !/\s/.test(key);
}

/**
 * Debounce a function call.
 * Delays execution until after the specified wait time has elapsed
 * since the last invocation.
 *
 * @param fn - Function to debounce
 * @param waitMs - Delay in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  waitMs: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), waitMs);
  };
}

/**
 * Throttle a function call.
 * Ensures the function is called at most once per specified interval.
 *
 * @param fn - Function to throttle
 * @param intervalMs - Minimum interval between calls in milliseconds
 * @returns Throttled function
 */
export function throttle<T extends (...args: unknown[]) => void>(
  fn: T,
  intervalMs: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= intervalMs) {
      lastCall = now;
      fn(...args);
    }
  };
}

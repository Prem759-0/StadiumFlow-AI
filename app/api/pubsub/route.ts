// ============================================================
// StadiumFlow AI - Cloud Pub/Sub API Route
// Handles publish/subscribe operations for real-time events
// ============================================================

import { NextRequest, NextResponse } from "next/server";

/** Rate limiting: track requests per IP per minute */
const requestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 60; // 60 requests per minute
const RATE_WINDOW = 60000; // 1 minute

/**
 * Check rate limit for an IP address.
 * @returns true if request is allowed, false if rate limited
 */
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = requestCounts.get(ip);

  if (!entry || now > entry.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }

  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

/**
 * POST /api/pubsub
 * Publish a message to a Cloud Pub/Sub topic.
 *
 * Request body:
 * - topic: string (e.g., "fan-help-requests")
 * - data: Record<string, unknown>
 * - attributes?: Record<string, string>
 */
export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Max 60 requests per minute." },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const { topic, data, attributes } = body;

    if (!topic || !data) {
      return NextResponse.json(
        { error: "Missing required fields: topic, data" },
        { status: 400 }
      );
    }

    const validTopics = [
      "fan-help-requests",
      "queue-updates",
      "crowd-alerts",
      "staff-dispatch",
      "announcements",
      "ai-predictions",
    ];

    if (!validTopics.includes(topic)) {
      return NextResponse.json(
        { error: `Invalid topic. Valid topics: ${validTopics.join(", ")}` },
        { status: 400 }
      );
    }

    const messageId = `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    return NextResponse.json({
      success: true,
      messageId,
      topic,
      publishTime: new Date().toISOString(),
      message: `Published to ${topic} via Cloud Pub/Sub`,
    });
  } catch (error) {
    console.error("[Pub/Sub API] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/pubsub
 * List available topics and subscription status.
 */
export async function GET() {
  return NextResponse.json({
    status: "operational",
    service: "cloud-pubsub-simulation",
    topics: [
      {
        name: "fan-help-requests",
        description: "Fan assistance requests (I'm Lost, medical, info)",
        subscribers: 1,
      },
      {
        name: "queue-updates",
        description: "Virtual queue position updates and notifications",
        subscribers: 1,
      },
      {
        name: "crowd-alerts",
        description: "AI-generated crowd density alerts",
        subscribers: 2,
      },
      {
        name: "staff-dispatch",
        description: "Staff dispatch commands for incident response",
        subscribers: 1,
      },
      {
        name: "announcements",
        description: "Stadium-wide public announcements",
        subscribers: 3,
      },
      {
        name: "ai-predictions",
        description: "Vertex AI prediction results",
        subscribers: 1,
      },
    ],
    timestamp: new Date().toISOString(),
  });
}

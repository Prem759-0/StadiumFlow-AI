// ============================================================
// StadiumFlow AI - Gemini API Client
// Handles AI-powered chat, route optimization, and predictions
// Falls back to mock responses when no API key is configured
// ============================================================

import { sanitizeInput } from "./utils";

const GEMINI_SYSTEM_PROMPT = `You are StadiumFlow AI, an intelligent assistant for the Narendra Modi Stadium (132,000 capacity) during a live India vs Australia ODI cricket match. Current attendance: ~98,500.

Your role:
- Help fans navigate the stadium efficiently
- Provide real-time queue and congestion information
- Recommend the best routes avoiding crowded areas
- Suggest food, beverages, and merchandise
- Answer questions about the venue, match, and amenities

Key context:
- The stadium has 4 main gates (A-North, B-East, C-South, D-West)
- Food courts at North, East, South, and West concourses
- Restrooms at N1, E1, S1, W1 locations
- VIP boxes at North and South
- Medical Station near West concourse

Current conditions:
- Gate D (West) is most congested (85% capacity)
- South Section S1 is nearly full (97%)
- East Food Court has shortest queues (~2 min wait)
- Restroom W1 has shortest queue (~2 min wait)

Be concise, helpful, and proactive. Use emoji sparingly for clarity. Always prioritize safety.`;

interface GeminiChatMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

interface RouteOptimizationRequest {
  from: string;
  to: string;
  currentCongestion: Record<string, number>;
  needsAccessibility: boolean;
  userContext?: string;
}

interface PredictionRequest {
  zoneData: { id: string; name: string; occupancy: number; capacity: number }[];
  queueData: { name: string; currentQueue: number; trend: string }[];
  timeContext: string;
}

/** Check if any AI API is available (Groq or Gemini) */
export function isGeminiAvailable(): boolean {
  return !!(process.env.GEMINI_API_KEY || process.env.GROQ_API_KEY);
}

/** Chat with Gemini AI assistant */
export async function chatWithGemini(
  userMessage: string,
  history: GeminiChatMessage[] = []
): Promise<string> {
  const sanitized = sanitizeInput(userMessage);

  try {
    const response = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "chat",
        message: sanitized,
        history,
      }),
    });

    if (!response.ok) throw new Error("API request failed");
    const data = await response.json();
    return data.response || getFallbackChatResponse(sanitized);
  } catch {
    return getFallbackChatResponse(sanitized);
  }
}

/** Get AI-optimized route */
export async function getOptimizedRoute(
  request: RouteOptimizationRequest
): Promise<{
  path: string[];
  estimatedTime: number;
  instructions: string[];
  congestionLevel: string;
}> {
  try {
    const response = await fetch("/api/gemini/route-optimize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    if (!response.ok) throw new Error("API request failed");
    return await response.json();
  } catch {
    return getFallbackRoute(request);
  }
}

/** Get AI predictions for staff dashboard */
export async function getAIPredictions(
  request: PredictionRequest
): Promise<{ predictions: string[] }> {
  try {
    const response = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "predict",
        ...request,
      }),
    });

    if (!response.ok) throw new Error("API request failed");
    return await response.json();
  } catch {
    return { predictions: getFallbackPredictions() };
  }
}

// ---- Fallback Mock Responses ----

function getFallbackChatResponse(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes("beer") || lower.includes("drink")) {
    return "🍺 The shortest line for beverages is at the **East Food Court** (Thirst Quencher) with only ~2 min wait! Head through the East Concourse South. The North Food Court also has drinks but with a 4-min wait.";
  }
  if (lower.includes("food") || lower.includes("eat") || lower.includes("hungry")) {
    return "🍽️ Best options right now:\n1. **East Food Court** - 2 min wait (Sweet Spot desserts, great ice cream!)\n2. **West Food Court** - 3 min wait (good variety)\n3. **North Food Court** - 4 min wait (Stadium Bites has amazing Chicken Tikka Wraps!)\n\n⚠️ Avoid South Food Court - 7 min wait currently.";
  }
  if (lower.includes("restroom") || lower.includes("bathroom") || lower.includes("toilet")) {
    return "🚻 Nearest restrooms with shortest wait:\n1. **Restroom W1** (West) - ~2 min wait ✅\n2. **Restroom E1** (East) - ~3 min wait\n3. **Restroom N1** (North) - ~2 min wait\n\n⚠️ Avoid Restroom S1 (South) - very crowded (~4 min wait).";
  }
  if (lower.includes("seat") || lower.includes("route") || lower.includes("navigate") || lower.includes("way")) {
    return "🗺️ From your current location, I recommend:\n1. Take the **North Concourse West** path\n2. Follow signs to **Section N1**\n3. Enter through **Aisle 4** (less crowded)\n\nEstimated walk time: **4 minutes**. The main concourse is moderately busy but moving well.";
  }
  if (lower.includes("score") || lower.includes("match")) {
    return "🏏 **Live Score**: India 287/4 vs Australia 142/3 (28.4 overs)\n\nIndia looking strong! Australia needs 146 runs from 128 balls. Great atmosphere in the stadium!";
  }
  if (lower.includes("lost") || lower.includes("help")) {
    return "🆘 Don't worry! I've noted your location. Here's what to do:\n1. Look for the nearest **yellow direction signs**\n2. Staff members in **orange vests** can help you\n3. I've also sent an alert to the nearest staff member\n\nStay where you are - help is on the way! 🏃";
  }
  if (lower.includes("park") || lower.includes("exit") || lower.includes("leave")) {
    return "🚗 Current parking exit status:\n- **Parking A (North)** - 9 min wait (congested)\n- **Parking B (South)** - 4 min wait ✅ Recommended!\n\nTip: If you leave 10 mins before the match ends, wait times drop by ~60%.";
  }

  return "👋 I'm StadiumFlow AI! I can help you with:\n- 🗺️ **Navigation** - Best routes to seats, gates, food\n- ⏱️ **Queue Info** - Wait times for food, restrooms, gates\n- 🍽️ **Food Orders** - Pre-order & skip the line\n- 🏏 **Match Info** - Live scores & updates\n- 🆘 **Help** - If you're lost or need assistance\n\nWhat can I help you with?";
}

function getFallbackRoute(request: RouteOptimizationRequest) {
  const paths: Record<string, string[]> = {
    default: ["Current Location", "Main Concourse", "Section Entry", "Your Seat"],
    food: ["Current Location", "North Concourse", "Food Court North"],
    gate: ["Current Location", "Main Concourse", "Gate A"],
    restroom: ["Current Location", "West Concourse", "Restroom W1"],
  };

  let pathKey = "default";
  const toLower = request.to.toLowerCase();
  if (toLower.includes("food") || toLower.includes("concession")) pathKey = "food";
  if (toLower.includes("gate") || toLower.includes("exit")) pathKey = "gate";
  if (toLower.includes("restroom") || toLower.includes("bathroom")) pathKey = "restroom";

  return {
    path: paths[pathKey],
    estimatedTime: Math.floor(Math.random() * 5) + 3,
    instructions: [
      `Head towards the ${paths[pathKey][1]}`,
      `Continue straight for approximately 100 meters`,
      `Turn right at the ${paths[pathKey][2]}`,
      `Your destination is ahead on the left`,
    ],
    congestionLevel: "medium",
  };
}

function getFallbackPredictions(): string[] {
  return [
    "⚠️ Gate D (West) will experience a surge of ~12 min wait in the next 15 minutes as the innings break approaches",
    "📈 South Food Court queue is trending up - expected 10+ min wait in 8 minutes",
    "✅ East Concourse will clear up in ~6 minutes as fans return to seats",
    "🅿️ Parking Lot A exit congestion expected to peak at match end - recommend directing fans to Lot B",
    "🏥 Medical station utilization is low (27%) - no concerns",
    "📊 Overall crowd density is 74.6% - within safe operational limits",
  ];
}

export { GEMINI_SYSTEM_PROMPT };
export type { GeminiChatMessage, RouteOptimizationRequest, PredictionRequest };

// ============================================================
// StadiumFlow AI - Route Optimization API
// Supports Groq + Gemini with fallback mock routes
// ============================================================

import { NextRequest, NextResponse } from "next/server";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

let genAI: import("@google/generative-ai").GoogleGenerativeAI | null = null;
if (GEMINI_API_KEY && !GROQ_API_KEY) {
  const { GoogleGenerativeAI } = require("@google/generative-ai");
  genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
}

function buildRoutePrompt(from: string, to: string, needsAccessibility: boolean, userContext: string, currentCongestion: Record<string, number>) {
  return `You are a stadium navigation AI for MetLife Stadium (82,500 capacity FIFA World Cup football stadium).
Your job is to read the real-time zone congestion data and give the fan the BEST route to their destination. 
A fan needs to go from "${from}" to "${to}".
${needsAccessibility ? "The fan needs wheelchair-accessible routes." : ""}
${userContext ? `User context: ${userContext}` : ""}

Current congestion data (0-1 scale, 1 = most congested):
${JSON.stringify(currentCongestion || {}, null, 2)}

The stadium has:
- 4 gates (A-North, B-East, C-South, D-West)
- Concourses connecting all sections
- Food courts at N, E, S, W
- Restrooms at N1, E1, S1, W1
- Medical station near West concourse

Provide the optimal route avoiding congested areas. Return ONLY a valid JSON object (no markdown fences) with this exact structure:
{
  "path": ["Step 1 name", "Step 2 name", ...],
  "estimatedTime": <minutes as number>,
  "instructions": ["Detailed instruction 1", "Detailed instruction 2", ...],
  "congestionLevel": "low" or "medium" or "high"
}`;
}

export async function POST(request: NextRequest) {
  try {
    const { from, to, currentCongestion, needsAccessibility, userContext } =
      await request.json();

    if (!from || !to) {
      return NextResponse.json(
        { error: "Missing 'from' or 'to' fields" },
        { status: 400 }
      );
    }

    const prompt = buildRoutePrompt(from, to, needsAccessibility, userContext || "", currentCongestion);

    // ---- Groq path ----
    if (GROQ_API_KEY) {
      try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${GROQ_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
              { role: "system", content: "You are a stadium navigation AI. Respond ONLY with valid JSON, no markdown code fences." },
              { role: "user", content: prompt },
            ],
            max_tokens: 512,
            temperature: 0.5,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const text = data.choices?.[0]?.message?.content || "";
          const jsonMatch = text.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return NextResponse.json(parsed);
          }
        }
      } catch (e) {
        /* log removed */
      }
      // Fall through to fallback
    }

    // ---- Gemini path ----
    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return NextResponse.json(parsed);
        }
      } catch (e) {
        /* log removed */
      }
    }

    // ---- Fallback ----
    return NextResponse.json(getFallbackRoute(from, to, needsAccessibility));
  } catch (error) {
    /* log removed */
    return NextResponse.json(getFallbackRoute("Current Location", "Destination", false));
  }
}

function getFallbackRoute(from: string, to: string, accessible: boolean) {
  const toLower = to.toLowerCase();
  let path: string[];
  let instructions: string[];

  if (toLower.includes("food") || toLower.includes("concession")) {
    path = [from, "Main Concourse", "Food Court Area", to];
    instructions = [
      `Exit from ${from} towards the main concourse`,
      "Follow the concourse path, staying to the right",
      "Look for the food court signs ahead",
      `Arrive at ${to} - current wait ~3 min`,
    ];
  } else if (toLower.includes("restroom") || toLower.includes("bathroom")) {
    path = [from, "Nearest Concourse", to];
    instructions = [
      `Head towards the nearest concourse from ${from}`,
      `Follow signs to ${to}`,
      `${accessible ? "Use the accessible entrance on the right" : "Enter through the main door"}`,
    ];
  } else if (toLower.includes("gate") || toLower.includes("exit")) {
    path = [from, "Stadium Ring Road", "Exit Corridor", to];
    instructions = [
      "Make your way to the main concourse",
      "Follow the exit signs along the stadium ring road",
      "Continue through the exit corridor",
      `Arrive at ${to}`,
    ];
  } else {
    path = [from, "Concourse Junction", "Section Entrance", to];
    instructions = [
      `Leave ${from} and head to the concourse`,
      "Follow the section markers on the walls",
      `Enter through the ${accessible ? "accessible ramp" : "nearest aisle"}`,
      `Find your way to ${to}`,
    ];
  }

  return {
    path,
    estimatedTime: Math.floor(Math.random() * 5) + 3,
    instructions,
    congestionLevel: "medium",
  };
}

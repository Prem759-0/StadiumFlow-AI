// ============================================================
// StadiumFlow AI - AI API Proxy Route
// Supports both Google Gemini and Groq APIs with fallback
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { GEMINI_SYSTEM_PROMPT } from "@/lib/gemini";

// Detect which AI provider is available
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

let genAI: import("@google/generative-ai").GoogleGenerativeAI | null = null;

// Only initialize Gemini if we have a Gemini key (not Groq)
if (GEMINI_API_KEY && !GROQ_API_KEY) {
  const { GoogleGenerativeAI } = require("@google/generative-ai");
  genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
}

/** Call Groq API (OpenAI-compatible) */
async function callGroq(messages: { role: string; content: string }[]): Promise<string> {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages,
      max_tokens: 1024,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    if (response.status === 429) {
      console.warn("Groq rate limit reached, using fallback.");
      return "RATE_LIMIT_ERROR";
    }
    throw new Error(`Groq API error: ${response.status} - ${errText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "Sorry, I could not generate a response.";
}

/** Get fallback mock predictions */
function getMockPredictions() {
  return [
    "⚠️ Gate D will experience a surge in 15 minutes",
    "📈 South Food Court queue trending upward",
    "✅ East Concourse clearing up",
    "🅿️ Parking A exit congestion expected at match end",
    "📊 Overall crowd density at 74.6% - within safe limits",
  ];
}

/** Get fallback mock chat response */
function getMockChat() {
  return "StadiumFlow AI is running in demo mode. Add your GROQ_API_KEY or GEMINI_API_KEY to .env.local for full AI features!";
}

export async function POST(request: NextRequest) {
  let reqType = "chat";

  try {
    const body = await request.json();
    const { type, message, history, zoneData, queueData, timeContext } = body;
    if (type) reqType = type;

    // Input validation
    if (!type || typeof type !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'type' field" },
        { status: 400 }
      );
    }

    // ---- No AI provider configured → return mock data ----
    if (!GROQ_API_KEY && !genAI) {
      if (type === "predict") {
        return NextResponse.json({ predictions: getMockPredictions() });
      }
      return NextResponse.json({ response: getMockChat() });
    }

    // ====== GROQ PATH (preferred if key exists) ======
    if (GROQ_API_KEY) {
      if (type === "chat") {
        if (!message || typeof message !== "string") {
          return NextResponse.json({ error: "Missing message" }, { status: 400 });
        }

        const chatHistory: { role: string; content: string }[] = [
          { role: "system", content: GEMINI_SYSTEM_PROMPT },
        ];

        // Add past conversation history (last 10 messages)
        if (Array.isArray(history)) {
          history.slice(-10).forEach((msg: { role: string; parts: { text: string }[] }) => {
            chatHistory.push({
              role: msg.role === "model" ? "assistant" : "user",
              content: msg.parts?.[0]?.text || "",
            });
          });
        }

        chatHistory.push({ role: "user", content: message.slice(0, 500) });
        const response = await callGroq(chatHistory);
        if (response === "RATE_LIMIT_ERROR") {
          return NextResponse.json({ response: getMockChat() });
        }
        return NextResponse.json({ response });
      }

      if (type === "predict") {
        const prompt = `You are an AI crowd management system for a FIFA World Cup football stadium with 82,500 capacity.

Current zone data:
${JSON.stringify(zoneData?.slice?.(0, 10) || [], null, 2)}

Current queue data:
${JSON.stringify(queueData?.slice?.(0, 8) || [], null, 2)}

Time context: ${timeContext || "Match in progress"}

Provide exactly 6 short predictions (one per line) about:
1. Which areas will become congested soon and when
2. Which queues will get longer/shorter
3. Safety concerns if any
4. Recommended proactive actions for staff

Start each prediction with an emoji (⚠️ for warnings, 📈 for trends, ✅ for positive, 🅿️ for parking, 🏥 for medical, 📊 for analytics).
Be specific with time estimates and numbers. One prediction per line, no numbering.`;

        const text = await callGroq([
          { role: "system", content: "You are a stadium crowd management AI. Be concise and specific." },
          { role: "user", content: prompt },
        ]);

        if (text === "RATE_LIMIT_ERROR") {
          return NextResponse.json({ predictions: getMockPredictions() });
        }

        const predictions = text
          .split("\n")
          .filter((line) => line.trim().length > 0)
          .slice(0, 6);

        return NextResponse.json({ predictions });
      }

      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    // ====== GEMINI PATH ======
    if (genAI) {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      if (type === "chat") {
        if (!message || typeof message !== "string") {
          return NextResponse.json({ error: "Missing message" }, { status: 400 });
        }

        const sanitizedMessage = message.slice(0, 500);
        const chat = model.startChat({
          history: [
            { role: "user", parts: [{ text: "System context: " + GEMINI_SYSTEM_PROMPT }] },
            {
              role: "model",
              parts: [{
                text: "Understood. I'm StadiumFlow AI, ready to help fans navigate MetLife Stadium during the FIFA World Cup 2026 match.",
              }],
            },
            ...(Array.isArray(history) ? history.slice(-10) : []),
          ],
        });

        const result = await chat.sendMessage(sanitizedMessage);
        const response = result.response.text();
        return NextResponse.json({ response });
      }

      if (type === "predict") {
        const prompt = `You are an AI crowd management system for a FIFA World Cup football stadium with 82,500 capacity.

Current zone data:
${JSON.stringify(zoneData?.slice?.(0, 10) || [], null, 2)}

Current queue data:
${JSON.stringify(queueData?.slice?.(0, 8) || [], null, 2)}

Time context: ${timeContext || "Match in progress"}

Provide exactly 6 short predictions with emoji prefixes. One per line.`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const predictions = text
          .split("\n")
          .filter((line: string) => line.trim().length > 0)
          .slice(0, 6);

        return NextResponse.json({ predictions });
      }
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (error) {
    console.error("AI API error:", error);
    // Graceful fallback on errors
    if (reqType === "predict") {
      return NextResponse.json({ predictions: getMockPredictions() });
    }
    return NextResponse.json({
      response: "I'm having trouble connecting to the AI service right now. Let me help you with what I know! Try asking about food, restrooms, gates, or the match score.",
    });
  }
}

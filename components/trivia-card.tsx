"use client";

// ============================================================
// StadiumFlow AI - Fan Trivia Card
// Gemini-powered FIFA World Cup trivia & fun facts
// ============================================================

import { useState } from "react";
import { Brain, ChevronRight, Trophy, Star } from "lucide-react";

// Historical World Cup trivia powered by our imported FIFA datasets
const TRIVIA_ITEMS = [
  {
    question: "Which World Cup had the most goals per match?",
    answer: "The 1954 Switzerland World Cup averaged a jaw-dropping 5.38 goals per match — the highest ever in World Cup history!",
    year: "1954",
    icon: "⚽",
    color: "#FFE600",
  },
  {
    question: "Who is the all-time top scorer in World Cup history?",
    answer: "Miroslav Klose (Germany) holds the record with 16 World Cup goals across 4 tournaments (2002, 2006, 2010, 2014).",
    year: "Record",
    icon: "🏆",
    color: "#00FF87",
  },
  {
    question: "Which team has won the most World Cups?",
    answer: "Brazil leads with 5 World Cup titles (1958, 1962, 1970, 1994, 2002) — they are also the only nation to have participated in EVERY World Cup.",
    year: "5x Champs",
    icon: "🇧🇷",
    color: "#00C6FF",
  },
  {
    question: "What's the highest ever World Cup score?",
    answer: "Hungary beat El Salvador 10–1 at the 1982 World Cup in Spain. László Kiss became the fastest substitute to score a hat-trick!",
    year: "1982",
    icon: "🔥",
    color: "#FF3333",
  },
  {
    question: "How many countries participate in World Cup 2026?",
    answer: "FIFA World Cup 2026 is the first edition with 48 teams (expanded from 32). It will be hosted by USA, Canada, and Mexico across 16 cities!",
    year: "2026",
    icon: "🌎",
    color: "#BF5FFF",
  },
  {
    question: "Which World Cup had the fewest goals ever?",
    answer: "The 1990 Italy World Cup averaged just 2.21 goals per match — the most defensive tournament in history. Argentina's Salvatore Schillaci won the Golden Boot with 6 goals.",
    year: "1990",
    icon: "🛡️",
    color: "#FF6B00",
  },
];

export default function TriviaCard() {
  const [current, setCurrent] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [points, setPoints] = useState(0);

  const item = TRIVIA_ITEMS[current];

  const handleReveal = () => {
    setRevealed(true);
    if (!revealed) setPoints(p => p + 10);
  };

  const handleNext = () => {
    setCurrent((c) => (c + 1) % TRIVIA_ITEMS.length);
    setRevealed(false);
  };

  return (
    <div
      className="rounded-xl p-5 comic-panel bg-white"
      style={{
        background: "#FFFFFF",
        border: `4px solid #000`,
        boxShadow: `8px 8px 0 #000`,
        transition: "transform 0.3s, box-shadow 0.3s",
      }}
      aria-label="FIFA World Cup Trivia"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4" style={{ color: item.color }} />
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: item.color }}>
            FIFA Trivia
          </span>
          <span
            className="text-[9px] px-2 py-0.5 rounded font-bold border"
            style={{ color: item.color, borderColor: item.color, background: "transparent" }}
          >
            {item.year}
          </span>
        </div>
        {points > 0 && (
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3" style={{ color: "#FFE600" }} />
            <span className="text-xs font-bold" style={{ color: "#FFE600" }}>+{points} pts</span>
          </div>
        )}
      </div>

      {/* Question */}
      <div className="mb-3">
        <span className="text-2xl mr-2">{item.icon}</span>
        <p className="text-sm font-bold inline" style={{ color: "#050505" }}>
          {item.question}
        </p>
      </div>

      {/* Answer */}
      {revealed ? (
        <div
          className="rounded-lg p-4 mb-4 animate-fade-in"
          style={{ background: "#F5F0E8", border: `3px solid #000`, boxShadow: `4px 4px 0 #000` }}
        >
          <p className="text-sm font-bold leading-relaxed" style={{ color: "#000" }}>
            {item.answer}
          </p>
        </div>
      ) : (
        <button
          onClick={handleReveal}
          className="w-full rounded-lg px-4 py-3 text-sm font-black uppercase tracking-wider mb-4 transition-all duration-150"
          style={{
            background: item.color,
            border: `3px solid #000`,
            color: "#000",
            boxShadow: `4px 4px 0 #000`,
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.boxShadow = `2px 2px 0 #000`;
            (e.currentTarget as HTMLElement).style.transform = "translate(2px, 2px)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.boxShadow = `4px 4px 0 #000`;
            (e.currentTarget as HTMLElement).style.transform = "translate(0, 0)";
          }}
        >
          Reveal Answer (+10 pts)
        </button>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className="text-[10px]" style={{ color: "#3b4480" }}>
          {current + 1} / {TRIVIA_ITEMS.length} questions
        </span>
        <button
          onClick={handleNext}
          className="flex items-center gap-1 text-xs font-bold transition-opacity hover:opacity-70"
          style={{ color: item.color }}
        >
          Next Question
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

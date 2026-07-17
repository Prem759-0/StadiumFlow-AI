"use client";

// ============================================================
// StadiumFlow AI - Enhanced Score Ticker (Redesign)
// Live FIFA match scores with bold, static Neo-Brutalist styling
// ============================================================

import { Trophy, Radio, Clock } from "lucide-react";

interface Match {
  id: string;
  home: string;
  away: string;
  homeScore: string;
  awayScore: string;
  status: "live" | "upcoming" | "completed";
  time?: string;
  venue: string;
}

const FIFA_MATCHES: Match[] = [
  { id: "m1", home: "BRA", away: "ARG", homeScore: "2", awayScore: "1", status: "live", time: "72'", venue: "MetLife Stadium" },
  { id: "m2", home: "FRA", away: "GER", homeScore: "1", awayScore: "1", status: "live", time: "45+2'", venue: "AT&T Stadium" },
  { id: "m3", home: "ESP", away: "POR", homeScore: "0", awayScore: "0", status: "upcoming", time: "18:00", venue: "SoFi Stadium" },
];

interface ScoreTickerProps {
  status?: "live" | "upcoming" | "completed";
}

export default function ScoreTicker({ status = "live" }: ScoreTickerProps) {
  const liveMatch = FIFA_MATCHES.find(m => m.status === "live") || FIFA_MATCHES[0];
  const nextMatch = FIFA_MATCHES.find(m => m.status === "upcoming");

  return (
    <div className="space-y-3 animate-fade-in">
      {/* ── Featured Match Card ── */}
      <div
        className="rounded-2xl p-5 relative overflow-hidden hover-tilt transition-all duration-300"
        style={{ background: "#FFE600", border: "4px solid #000", boxShadow: "8px 8px 0 #000" }}
        role="region"
        aria-label="Featured Match"
      >
        {/* Animated Marquee Background Tape */}
        <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center transform -rotate-12 scale-150 z-0">
          <div className="marquee-tape">
            {Array(10).fill("GOAL ").map((txt, i) => (
              <span key={i} className="text-9xl font-black">{txt}</span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white border-2 border-black flex items-center justify-center">
              <Trophy className="w-4 h-4 text-black" aria-hidden="true" />
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-black">World Cup 2026</span>
          </div>
          <div className="flex items-center gap-2 bg-[#FF3333] px-3 py-1 rounded-xl border-2 border-black" style={{ boxShadow: "2px 2px 0 #000" }}>
            <Radio className="w-3.5 h-3.5 animate-pulse text-white" aria-hidden="true" />
            <span className="text-xs font-black uppercase tracking-widest text-white">
              LIVE NOW
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-2">
          {/* Home Team */}
          <div className="text-center">
            <p className="text-5xl font-black text-black tracking-tighter" style={{ textShadow: "3px 3px 0 #FFF" }}>{liveMatch.home}</p>
          </div>

          {/* Score & Time */}
          <div className="flex flex-col items-center relative z-10">
            <div className="text-5xl font-black text-black px-4 py-2 bg-white rounded-2xl border-4 border-black transition-transform duration-300 hover:scale-110" style={{ boxShadow: "4px 4px 0 #000" }}>
              {liveMatch.homeScore} - {liveMatch.awayScore}
            </div>
            <div className="mt-3 bg-black text-[#00FF87] px-3 py-1 rounded-xl text-sm font-black tracking-widest uppercase border-2 border-black animate-pulse">
              {liveMatch.time}
            </div>
          </div>

          {/* Away Team */}
          <div className="text-center relative z-10">
            <p className="text-5xl font-black text-black tracking-tighter" style={{ textShadow: "3px 3px 0 #FFF" }}>{liveMatch.away}</p>
          </div>
        </div>
      </div>

    </div>
  );
}

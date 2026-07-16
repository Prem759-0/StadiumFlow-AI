"use client";

// ============================================================
// StadiumFlow AI - Enhanced Score Ticker
// Live FIFA match scores with Neo-Brutalist styling
// ============================================================

import { useState, useEffect } from "react";
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
  { id: "m4", home: "ENG", away: "USA", homeScore: "3", awayScore: "0", status: "completed", venue: "Levi's Stadium" },
  { id: "m5", home: "MEX", away: "CAN", homeScore: "1", awayScore: "2", status: "live", time: "88'", venue: "Estadio Azteca" },
];

interface ScoreTickerProps {
  matchTitle?: string;
  venue?: string;
  homeScore?: string;
  awayScore?: string;
  overs?: string;
  status?: "live" | "upcoming" | "completed";
}

export default function ScoreTicker({ status = "live" }: ScoreTickerProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const liveMatches = FIFA_MATCHES.filter(m => m.status === "live");
  const upcomingMatches = FIFA_MATCHES.filter(m => m.status === "upcoming");

  // Auto-cycle through live matches
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx(prev => (prev + 1) % FIFA_MATCHES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-2 animate-fade-in">
      {/* Main live match card */}
      <div
        className="rounded-xl p-4 comic-panel bg-white overflow-hidden"
        style={{ background: "#FFFFFF", border: "2px solid #FF3333", boxShadow: "4px 4px 0 #FF3333" }}
        role="region"
        aria-label="Live FIFA match scores"
        aria-live="polite"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4" style={{ color: "#FFE600" }} aria-hidden="true" />
            <span className="comic-label">FIFA World Cup 2026</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full"
            style={{ background: "rgba(255,51,51,0.15)", border: "1px solid rgba(255,51,51,0.3)" }}>
            <Radio className="w-3 h-3 animate-pulse" style={{ color: "#FF3333" }} aria-hidden="true" />
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#FF3333" }}>
              {liveMatches.length} Live
            </span>
          </div>
        </div>

        {/* Scrolling ticker */}
        <div className="ticker-wrapper rounded-lg px-2 py-1.5"
          style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="ticker-content flex items-center gap-8">
            {[...FIFA_MATCHES, ...FIFA_MATCHES].map((match, i) => (
              <span key={`${match.id}-${i}`} className="inline-flex items-center gap-3 tabular-nums">
                {match.status === "live" && (
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse inline-block" />
                )}
                <span className="font-bold text-sm" style={{ color: "#050505" }}>{match.home}</span>
                <span className="font-black text-base" style={{
                  color: match.status === "live" ? "#00FF87" : match.status === "completed" ? "#5c6bc0" : "#FFE600"
                }}>
                  {match.status === "upcoming" ? "vs" : `${match.homeScore} – ${match.awayScore}`}
                </span>
                <span className="font-bold text-sm" style={{ color: "#050505" }}>{match.away}</span>
                {match.time && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-mono"
                    style={{ background: match.status === "live" ? "rgba(255,51,51,0.2)" : "rgba(255,255,255,0.06)", color: match.status === "live" ? "#FF3333" : "#5c6bc0" }}>
                    {match.time}
                  </span>
                )}
                <span className="text-[10px]" style={{ color: "#3b4480" }}>{match.venue}</span>
                <span style={{ color: "#333" }}>|</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Quick upcoming match */}
      {upcomingMatches.length > 0 && (
        <div className="rounded-lg px-3 py-2 flex items-center gap-2"
          style={{ background: "#FFFFFF", border: "2px solid #FFE600", boxShadow: "3px 3px 0 #FFE600" }}>
          <Clock className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#FFE600" }} />
          <span className="text-xs font-bold" style={{ color: "#FFE600" }}>Next:</span>
          <span className="text-xs font-semibold" style={{ color: "#050505" }}>
            {upcomingMatches[0].home} vs {upcomingMatches[0].away}
          </span>
          <span className="text-[10px]" style={{ color: "#555555" }}>
            {upcomingMatches[0].time} · {upcomingMatches[0].venue}
          </span>
        </div>
      )}
    </div>
  );
}

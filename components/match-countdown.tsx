"use client";

// ============================================================
// StadiumFlow AI - Match Countdown Timer
// Full Neo-Brutalist countdown to next FIFA match
// ============================================================

import { useState, useEffect } from "react";
import { Trophy, Zap } from "lucide-react";

// Next match: set to ~24h from "now" for demo
const NEXT_MATCH = {
  title: "Brazil vs Argentina",
  venue: "MetLife Stadium",
  city: "New York / New Jersey",
  // Demo: target time = now + 23h 45m
  target: new Date(Date.now() + 23 * 3600000 + 45 * 60000),
};

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function MatchCountdown() {
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, NEXT_MATCH.target.getTime() - Date.now());
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft({ d, h, m, s });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="rounded-xl p-4 comic-panel"
      style={{ background: "#111", border: "2px solid #00C6FF", boxShadow: "4px 4px 0 #00C6FF" }}
      aria-label="Countdown to next match"
    >
      <div className="flex items-center gap-2 mb-3">
        <Trophy className="w-4 h-4" style={{ color: "#00C6FF" }} />
        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "#00C6FF" }}>
          Next Match
        </span>
        <span className="comic-label ml-auto">KICKOFF</span>
      </div>

      <p className="text-sm font-extrabold mb-1" style={{ color: "#F5F0E8" }}>{NEXT_MATCH.title}</p>
      <p className="text-[10px] mb-3" style={{ color: "#5c6bc0" }}>
        {NEXT_MATCH.venue} · {NEXT_MATCH.city}
      </p>

      <div className="grid grid-cols-4 gap-2">
        {[
          { value: timeLeft.d, label: "Days" },
          { value: timeLeft.h, label: "Hrs" },
          { value: timeLeft.m, label: "Min" },
          { value: timeLeft.s, label: "Sec" },
        ].map(({ value, label }) => (
          <div
            key={label}
            className="rounded-lg p-2 text-center"
            style={{
              background: "#0A0A0A",
              border: "2px solid rgba(0,198,255,0.3)",
            }}
          >
            <p className="text-2xl font-black tabular-nums" style={{ color: "#00C6FF" }}>
              {pad(value)}
            </p>
            <p className="text-[9px] font-bold uppercase tracking-widest mt-0.5" style={{ color: "#3b4480" }}>
              {label}
            </p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-1.5 mt-3">
        <Zap className="w-3 h-3" style={{ color: "#00FF87" }} />
        <span className="text-[10px]" style={{ color: "#5c6bc0" }}>
          Powered by StadiumFlow AI real-time updates
        </span>
      </div>
    </div>
  );
}

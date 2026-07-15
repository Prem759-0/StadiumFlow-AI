"use client";

// ============================================================
// StadiumFlow AI - Fan Leaderboard
// Points, badges, fan rankings and rewards
// ============================================================

import { useState } from "react";
import { Star, Trophy, Medal, Zap, Gift, Crown, TrendingUp } from "lucide-react";
import { useAttendeeStore } from "@/lib/store";

const MOCK_LEADERBOARD = [
  { rank: 1, name: "Rohit S.", country: "🇮🇳", points: 1250, badge: "🏆", title: "Stadium Legend" },
  { rank: 2, name: "Carlos M.", country: "🇧🇷", points: 1100, badge: "🥈", title: "Goal Machine" },
  { rank: 3, name: "Sophie F.", country: "🇫🇷", points: 980, badge: "🥉", title: "Crowd Surfer" },
  { rank: 4, name: "Hamid A.", country: "🇸🇦", points: 875, badge: "⭐", title: "Super Fan" },
  { rank: 5, name: "Yuki T.", country: "🇯🇵", points: 740, badge: "⭐", title: "Die Hard" },
  { rank: 6, name: "Emma W.", country: "🇬🇧", points: 690, badge: "⭐", title: "Fan Rep" },
  { rank: 7, name: "Pedro L.", country: "🇵🇹", points: 580, badge: "⭐", title: "Match Expert" },
  { rank: 8, name: "Liu W.", country: "🇨🇳", points: 510, badge: "⭐", title: "Newcomer" },
];

const BADGES = [
  { icon: "🎯", label: "First Route", desc: "Used AI navigation", earned: true },
  { icon: "🗳️", label: "Poll Voter", desc: "Cast your prediction", earned: true },
  { icon: "🆘", label: "Safety Scout", desc: "Sent an SOS alert", earned: false },
  { icon: "🌍", label: "Polyglot", desc: "Switched language 3x", earned: false },
  { icon: "🍕", label: "Food Court Pro", desc: "Pre-ordered 3 items", earned: false },
  { icon: "🧠", label: "Trivia Master", desc: "Answered 5 trivia Qs", earned: true },
];

export default function LeaderboardPage() {
  const { profile, points } = useAttendeeStore();
  const [tab, setTab] = useState<"leaderboard" | "badges">("leaderboard");

  // Insert the user into leaderboard
  const userRank = MOCK_LEADERBOARD.findIndex(e => e.points < points) + 1 || 9;

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: "#FFE600", border: "2px solid #000", boxShadow: "3px 3px 0 #000" }}>
          <Trophy className="w-5 h-5 text-black" />
        </div>
        <div>
          <h1 className="text-lg font-extrabold" style={{ color: "#F5F0E8" }}>Fan Leaderboard</h1>
          <p className="text-xs" style={{ color: "#5c6bc0" }}>Earn points by engaging with StadiumFlow AI</p>
        </div>
      </div>

      {/* My Score Card */}
      <div className="rounded-xl p-4 comic-panel" style={{ background: "#111", border: "2px solid #FFE600", boxShadow: "4px 4px 0 #FFE600" }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#5c6bc0" }}>Your Score</p>
            <p className="text-4xl font-black tabular-nums" style={{ color: "#FFE600" }}>{points}</p>
            <p className="text-xs mt-1" style={{ color: "#9fa8da" }}>pts · Rank #{userRank}</p>
          </div>
          <div className="text-right">
            <div className="w-16 h-16 rounded-xl flex items-center justify-center font-black text-2xl"
              style={{ background: "rgba(255,230,0,0.15)", border: "2px solid rgba(255,230,0,0.4)" }}>
              ⭐
            </div>
            <p className="text-[10px] mt-1 font-bold" style={{ color: "#FFE600" }}>Fan Rep</p>
          </div>
        </div>
        <div className="mt-3 h-2 rounded-full" style={{ background: "#222" }}>
          <div className="h-full rounded-full transition-all duration-700"
            style={{ width: `${Math.min(100, (points / 1250) * 100)}%`, background: "linear-gradient(90deg, #CCBA00, #FFE600)" }} />
        </div>
        <p className="text-[10px] mt-1" style={{ color: "#3b4480" }}>{1250 - points} pts to #1</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {(["leaderboard", "badges"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="flex-1 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all"
            style={{
              background: tab === t ? "#FFE600" : "#111",
              color: tab === t ? "#0A0A0A" : "#5c6bc0",
              border: `2px solid ${tab === t ? "#000" : "rgba(255,255,255,0.1)"}`,
              boxShadow: tab === t ? "3px 3px 0 #000" : "none",
            }}
          >
            {t === "leaderboard" ? "🏆 Rankings" : "🎖️ My Badges"}
          </button>
        ))}
      </div>

      {tab === "leaderboard" ? (
        <div className="space-y-2">
          {MOCK_LEADERBOARD.map((entry) => (
            <div
              key={entry.rank}
              className="rounded-xl px-4 py-3 flex items-center gap-3"
              style={{
                background: entry.rank <= 3 ? `rgba(${entry.rank === 1 ? "255,230,0" : entry.rank === 2 ? "192,192,192" : "205,127,50"},0.08)` : "#111",
                border: `2px solid ${entry.rank === 1 ? "#FFE600" : entry.rank === 2 ? "#C0C0C0" : entry.rank === 3 ? "#CD7F32" : "rgba(255,255,255,0.08)"}`,
                boxShadow: entry.rank <= 3 ? `3px 3px 0 ${entry.rank === 1 ? "#FFE600" : entry.rank === 2 ? "#C0C0C0" : "#CD7F32"}` : "none",
              }}
            >
              <span className="text-lg w-6 text-center">{entry.badge}</span>
              <span className="font-black text-sm w-5 tabular-nums" style={{ color: "#5c6bc0" }}>#{entry.rank}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate" style={{ color: "#F5F0E8" }}>
                  {entry.country} {entry.name}
                </p>
                <p className="text-[10px]" style={{ color: "#3b4480" }}>{entry.title}</p>
              </div>
              <p className="text-sm font-black tabular-nums" style={{ color: "#FFE600" }}>{entry.points}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {BADGES.map((badge) => (
            <div
              key={badge.label}
              className="rounded-xl p-3 text-center"
              style={{
                background: badge.earned ? "#111" : "#0A0A0A",
                border: `2px solid ${badge.earned ? "#FFE600" : "rgba(255,255,255,0.06)"}`,
                boxShadow: badge.earned ? "3px 3px 0 #FFE600" : "none",
                opacity: badge.earned ? 1 : 0.4,
              }}
            >
              <p className="text-3xl mb-1">{badge.icon}</p>
              <p className="text-[10px] font-bold" style={{ color: badge.earned ? "#FFE600" : "#5c6bc0" }}>{badge.label}</p>
              <p className="text-[9px] mt-0.5" style={{ color: "#3b4480" }}>{badge.desc}</p>
              {badge.earned && <p className="text-[9px] mt-1 font-bold" style={{ color: "#00FF87" }}>✓ Earned</p>}
            </div>
          ))}
        </div>
      )}

      {/* How to Earn */}
      <div className="rounded-xl p-4" style={{ background: "#111", border: "2px solid rgba(255,255,255,0.08)" }}>
        <h2 className="text-xs font-black uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: "#F5F0E8" }}>
          <TrendingUp className="w-4 h-4" style={{ color: "#00FF87" }} />
          How To Earn Points
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {[
            { action: "Vote in a poll", pts: "+25 pts" },
            { action: "Answer trivia", pts: "+10 pts" },
            { action: "Use AI Route", pts: "+15 pts" },
            { action: "Pre-order food", pts: "+20 pts" },
            { action: "Join virtual queue", pts: "+10 pts" },
            { action: "Share feedback", pts: "+30 pts" },
          ].map(({ action, pts }) => (
            <div key={action} className="flex items-center justify-between px-3 py-2 rounded-lg"
              style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <span className="text-[11px]" style={{ color: "#9fa8da" }}>{action}</span>
              <span className="text-[11px] font-black" style={{ color: "#00FF87" }}>{pts}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

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
          <h1 className="text-lg font-extrabold" style={{ color: "#050505" }}>Fan Leaderboard</h1>
          <p className="text-xs" style={{ color: "#555555" }}>Earn points by engaging with StadiumFlow AI</p>
        </div>
      </div>

      {/* My Score Card */}
      <div className="rounded-xl p-4 comic-panel bg-white" style={{ background: "#FFFFFF", border: "2px solid #FFE600", boxShadow: "4px 4px 0 #FFE600" }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#555555" }}>Your Score</p>
            <p className="text-4xl font-black tabular-nums" style={{ color: "#FFE600" }}>{points}</p>
            <p className="text-xs mt-1" style={{ color: "#555555" }}>pts · Rank #{userRank}</p>
          </div>
          <div className="text-right">
            <div className="w-16 h-16 rounded-xl flex items-center justify-center font-black text-2xl"
              style={{ background: "rgba(255,230,0,0.15)", border: "2px solid rgba(255,230,0,0.4)" }}>
              ⭐
            </div>
            <p className="text-[10px] mt-1 font-bold" style={{ color: "#FFE600" }}>Fan Rep</p>
          </div>
        </div>
        <div className="mt-3 h-2 rounded-full" style={{ background: "#FFFFFF" }}>
          <div className="h-full rounded-full transition-all duration-700"
            style={{ width: `${Math.min(100, (points / 1250) * 100)}%`, background: "linear-gradient(90deg, #CCBA00, #FFE600)" }} />
        </div>
        <p className="text-[10px] mt-1" style={{ color: "#3b4480" }}>{1250 - points} pts to #1</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4">
        {(["leaderboard", "badges"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="flex-1 py-3 rounded-xl text-sm font-black uppercase tracking-wider transition-all"
            style={{
              background: tab === t ? "#FFE600" : "#FFFFFF",
              color: "#000",
              border: "3px solid #000",
              boxShadow: tab === t ? "4px 4px 0 #000" : "none",
              transform: tab === t ? "translate(-2px, -2px)" : "none",
            }}
          >
            {t === "leaderboard" ? "🏆 Rankings" : "🎖️ My Badges"}
          </button>
        ))}
      </div>

      {tab === "leaderboard" ? (
        <div className="space-y-4">
          {MOCK_LEADERBOARD.map((entry) => (
            <div
              key={entry.rank}
              className="rounded-xl px-4 py-4 flex items-center gap-4 comic-panel bg-white transition-transform hover:-translate-y-1"
              style={{
                border: `3px solid ${entry.rank === 1 ? "#FFE600" : entry.rank === 2 ? "#C0C0C0" : entry.rank === 3 ? "#CD7F32" : "#000000"}`,
                boxShadow: `4px 4px 0 ${entry.rank === 1 ? "#FFE600" : entry.rank === 2 ? "#C0C0C0" : entry.rank === 3 ? "#CD7F32" : "#000000"}`,
              }}
            >
              <span className="text-2xl w-8 text-center">{entry.badge}</span>
              <span className="font-black text-lg w-8 tabular-nums text-black">#{entry.rank}</span>
              <div className="flex-1 min-w-0">
                <p className="text-lg font-black truncate text-black uppercase tracking-wide">
                  {entry.country} {entry.name}
                </p>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{entry.title}</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-black tabular-nums text-black">{entry.points}</p>
                <p className="text-[10px] font-bold text-gray-500 uppercase">PTS</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {BADGES.map((badge) => (
            <div
              key={badge.label}
              className="rounded-xl p-4 text-center comic-panel bg-white flex flex-col items-center justify-center"
              style={{
                border: `3px solid ${badge.earned ? "#FFE600" : "#E5E7EB"}`,
                boxShadow: badge.earned ? "4px 4px 0 #FFE600" : "none",
                opacity: badge.earned ? 1 : 0.6,
                filter: badge.earned ? "none" : "grayscale(100%)",
              }}
            >
              <p className="text-4xl mb-2">{badge.icon}</p>
              <p className="text-xs font-black uppercase tracking-wider text-black">{badge.label}</p>
              <p className="text-[10px] mt-1 font-bold text-gray-500 leading-tight">{badge.desc}</p>
              {badge.earned && <p className="text-[10px] mt-2 font-black px-2 py-1 bg-[#FFE600] text-black border-2 border-black rounded shadow-[1px_1px_0_#000]">✓ EARNED</p>}
            </div>
          ))}
        </div>
      )}

      {/* How to Earn */}
      <div className="rounded-xl p-6 comic-panel bg-white" style={{ border: "4px solid #000", boxShadow: "8px 8px 0 #000" }}>
        <h2 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2 text-black">
          <TrendingUp className="w-5 h-5 text-[#00FF87]" />
          How To Earn Points
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { action: "Vote in a poll", pts: "+25 pts", color: "#00C6FF" },
            { action: "Answer trivia", pts: "+10 pts", color: "#BF5FFF" },
            { action: "Use AI Route", pts: "+15 pts", color: "#00FF87" },
            { action: "Pre-order food", pts: "+20 pts", color: "#FF3333" },
            { action: "Join virtual queue", pts: "+10 pts", color: "#FFE600" },
            { action: "Share feedback", pts: "+30 pts", color: "#00C6FF" },
          ].map(({ action, pts, color }) => (
            <div key={action} className="flex items-center justify-between px-4 py-3 rounded-lg comic-panel bg-white transition-transform hover:-translate-y-1"
              style={{ border: "2px solid #000", boxShadow: `3px 3px 0 ${color}` }}>
              <span className="text-xs font-bold uppercase tracking-wider text-black">{action}</span>
              <span className="text-sm font-black px-2 py-0.5 rounded border-2 border-black" style={{ backgroundColor: color, color: "#000" }}>{pts}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

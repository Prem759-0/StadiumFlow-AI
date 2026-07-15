"use client";

// ============================================================
// StadiumFlow AI — Landing Page (Neo-Brutalist × Comic)
// FIFA World Cup 2026 — The Ultimate Stadium AI
// ============================================================

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  MapPin, LayoutDashboard, Zap, Users, Clock, Route, Bot, Shield,
  Globe, TrendingUp, Trophy, Cpu, Radio, Flame, ChevronRight,
  Star, ArrowRight, Activity,
} from "lucide-react";

const FEATURES = [
  {
    icon: Route,
    label: "AI Navigation",
    desc: "Gemini 2.0 powered smart routing for 132K fans",
    color: "#00FF87",
    emoji: "🗺️",
    detail: "Avoid congestion in real-time",
  },
  {
    icon: Clock,
    label: "Live Queues",
    desc: "Predicted wait times across all venues",
    color: "#00C6FF",
    emoji: "⏱️",
    detail: "Virtual queue join — skip the line",
  },
  {
    icon: Flame,
    label: "Crowd Heatmap",
    desc: "Live density maps updated every 5s",
    color: "#FFE600",
    emoji: "🔥",
    detail: "Zone-by-zone occupancy tracking",
  },
  {
    icon: Bot,
    label: "AI Assistant",
    desc: "Multilingual Gemini chatbot on-demand",
    color: "#BF5FFF",
    emoji: "🤖",
    detail: "20+ languages, zero wait time",
  },
  {
    icon: Shield,
    label: "SOS Response",
    desc: "One-tap emergency alerts to staff",
    color: "#FF3333",
    emoji: "🆘",
    detail: "Under 90-second response time",
  },
  {
    icon: Globe,
    label: "20+ Languages",
    desc: "Accessibility for every World Cup fan",
    color: "#FF6B00",
    emoji: "🌍",
    detail: "Auto-detect & translate instantly",
  },
  {
    icon: Trophy,
    label: "Fan Leaderboard",
    desc: "Points, badges & match predictions",
    color: "#FF3399",
    emoji: "🏆",
    detail: "Compete with fans worldwide",
  },
  {
    icon: Radio,
    label: "Live Broadcast",
    desc: "Staff push real-time announcements",
    color: "#00C6FF",
    emoji: "📡",
    detail: "Section-targeted messaging",
  },
  {
    icon: Cpu,
    label: "AI Predictions",
    desc: "Proactive crowd surge forecasting",
    color: "#BF5FFF",
    emoji: "🧠",
    detail: "Gemini analyses historical patterns",
  },
];

const STATS = [
  { value: "132K",  label: "Fan Capacity",    color: "#00FF87" },
  { value: "2.0",   label: "Gemini Flash",    color: "#00C6FF" },
  { value: "<90s",  label: "SOS Response",    color: "#FF3333" },
  { value: "20+",   label: "Languages",       color: "#FFE600" },
  { value: "98%",   label: "Crowd Accuracy",  color: "#BF5FFF" },
  { value: "48+",   label: "Teams in 2026",   color: "#FF6B00" },
];

const WORKFLOW = [
  { n: "01", title: "Scan Your Ticket",  desc: "Authenticate with QR or NFC on your phone.",               icon: "🎫", color: "#FFE600" },
  { n: "02", title: "Get AI-Routed",     desc: "Gemini calculates the fastest, least-crowded path.",        icon: "🗺️", color: "#00FF87" },
  { n: "03", title: "Skip Queues",       desc: "Join virtual queues & order food before you arrive.",       icon: "⚡", color: "#00C6FF" },
  { n: "04", title: "Enjoy the Match",   desc: "Real-time score, trivia, polls & seat info at your fingertips.", icon: "⚽", color: "#FF3333" },
];

export default function HomePage() {
  const [tick, setTick] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center overflow-x-hidden">

      {/* ── Rainbow top bar ── (done via body::before in CSS) */}

      {/* ═══════════════════════════════════════ HERO ═══ */}
      <section className="w-full min-h-screen flex flex-col items-center justify-center px-4 py-20 relative speed-lines">

        {/* Glowing blobs */}
        <div className="absolute top-10 left-0 w-72 h-72 rounded-full blur-3xl opacity-8 pointer-events-none"
          style={{ background: "radial-gradient(circle, #00FF87, transparent)" }} />
        <div className="absolute bottom-20 right-0 w-80 h-80 rounded-full blur-3xl opacity-8 pointer-events-none"
          style={{ background: "radial-gradient(circle, #00C6FF, transparent)" }} />
        <div className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full blur-3xl opacity-5 pointer-events-none"
          style={{ background: "radial-gradient(circle, #BF5FFF, transparent)" }} />

        <div className="text-center max-w-5xl relative z-10 animate-fade-in">

          {/* Top badge row */}
          <div className="flex items-center justify-center gap-3 mb-8 flex-wrap">
            <div className="inline-flex items-center gap-2 px-4 py-1.5"
              style={{ background:"#111", border:"2px solid #FFE600", boxShadow:"3px 3px 0 #FFE600" }}>
              <Zap className="w-3.5 h-3.5" style={{ color:"#FFE600" }} />
              <span className="text-[10px] font-black tracking-widest uppercase" style={{ color:"#FFE600" }}>
                Powered by Google Gemini 2.0 Flash
              </span>
            </div>
            <div className="comic-label">FIFA WC 2026</div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1"
              style={{ background:"#111", border:"2px solid #00FF87", boxShadow:"2px 2px 0 #00FF87" }}>
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background:"#00FF87" }} />
              <span className="text-[10px] font-black uppercase tracking-wider" style={{ color:"#00FF87" }}>Live Now</span>
            </div>
          </div>

          {/* Main title */}
          <h1 className="leading-none tracking-tight mb-6">
            <span className="block text-[clamp(3rem,12vw,9rem)] font-black" style={{ color:"#F5F0E8", WebkitTextStroke:"2px rgba(255,255,255,0.1)" }}>
              Stadium
              <span className="gradient-text">Flow</span>
            </span>
            <span className="block text-[clamp(2rem,8vw,6rem)] font-black gradient-text-fifa">AI</span>
          </h1>

          {/* Comic sub-headline box */}
          <div className="inline-block mb-6 px-6 py-3 comic-panel"
            style={{ background:"rgba(255,255,255,0.04)", border:"2px solid rgba(255,255,255,0.15)", boxShadow:"4px 4px 0 rgba(255,255,255,0.06)" }}>
            <p className="text-lg md:text-xl font-bold" style={{ color:"#9fa8da" }}>
              Smart Stadium Ops for&nbsp;
              <span className="gradient-text-fifa font-black">FIFA World Cup 2026</span>
            </p>
          </div>

          <p className="text-sm md:text-base max-w-2xl mx-auto mb-10" style={{ color:"#5c6bc0" }}>
            AI navigation · real-time crowd management · multilingual assistance ·<br />
            emergency response · live heatmaps · leaderboards for&nbsp;
            <span className="neon-green font-bold">132,000 fans</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-5 justify-center mb-14">
            <Link href="/fan" id="fan-view-cta"
              className="nb-btn nb-btn-green rounded-xl px-10 py-5 text-sm"
              aria-label="Open Fan View">
              <MapPin className="w-5 h-5" />
              Fan View
              <span className="text-[10px] font-normal opacity-70 capitalize normal-case tracking-normal">— Attendee PWA</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/dashboard" id="staff-dashboard-cta"
              className="nb-btn nb-btn-blue rounded-xl px-10 py-5 text-sm"
              aria-label="Open Staff Dashboard">
              <LayoutDashboard className="w-5 h-5" />
              Staff Dashboard
              <span className="text-[10px] font-normal opacity-70 capitalize normal-case tracking-normal">— Secure Admin</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 max-w-3xl mx-auto">
            {STATS.map(({ value, label, color }) => (
              <div key={label}
                className="rounded-xl p-3 text-center transition-all duration-150"
                style={{
                  background:"#111",
                  border:`2px solid ${color}`,
                  boxShadow:`3px 3px 0 ${color}`,
                }}>
                <p className="text-2xl font-black tabular-nums" style={{ color }}>{value}</p>
                <p className="text-[9px] font-bold uppercase tracking-wider mt-1" style={{ color:"#5c6bc0" }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section divider */}
      <div className="section-divider w-full" />

      {/* ═══════════════════════════════════ FEATURES ═══ */}
      <section className="w-full max-w-6xl px-4 py-20">
        <div className="text-center mb-12">
          <div className="comic-label mb-4">Feature Arsenal</div>
          <h2 className="text-4xl md:text-6xl font-black" style={{ color:"#F5F0E8" }}>
            Every Tool a Fan<br />
            <span className="gradient-text">Could Need</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(({ icon: Icon, label, desc, color, emoji, detail }, i) => (
            <div
              key={label}
              className="rounded-xl p-5 cursor-default transition-all duration-150 comic-panel"
              style={{
                background:"#111",
                border:`2px solid ${hovered === i ? color : "rgba(255,255,255,0.07)"}`,
                boxShadow: hovered === i ? `6px 6px 0 ${color}` : "4px 4px 0 rgba(0,0,0,0.5)",
                transform: hovered === i ? "translate(-2px,-2px)" : "none",
              }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="flex items-start gap-4 mb-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background:`${color}18`, border:`2px solid ${color}`, boxShadow:`2px 2px 0 ${color}` }}>
                  {emoji}
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wide" style={{ color:"#F5F0E8" }}>{label}</h3>
                  <p className="text-xs mt-0.5" style={{ color:"#5c6bc0" }}>{desc}</p>
                </div>
              </div>
              <div className="mt-3 pt-3 flex items-center gap-2"
                style={{ borderTop:`1px solid ${color}20` }}>
                <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color }} />
                <p className="text-[11px] font-semibold" style={{ color }}>{detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="section-divider w-full" />

      {/* ═══════════════════════════════════ WORKFLOW ═══ */}
      <section className="w-full max-w-5xl px-4 py-20">
        <div className="text-center mb-12">
          <div className="comic-label mb-4">How It Works</div>
          <h2 className="text-4xl md:text-5xl font-black" style={{ color:"#F5F0E8" }}>
            From Gate to Seat —<br />
            <span className="gradient-text-fifa">In 4 Steps</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {WORKFLOW.map(({ n, title, desc, icon, color }) => (
            <div key={n} className="rounded-xl p-5 relative"
              style={{ background:"#111", border:`2px solid ${color}`, boxShadow:`5px 5px 0 ${color}` }}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl font-black tabular-nums" style={{ color, opacity:0.25 }}>{n}</span>
                <span className="text-3xl">{icon}</span>
              </div>
              <h3 className="text-sm font-black uppercase tracking-wide mb-1.5" style={{ color:"#F5F0E8" }}>{title}</h3>
              <p className="text-xs leading-relaxed" style={{ color:"#5c6bc0" }}>{desc}</p>
              <div className="absolute top-4 right-4">
                <ChevronRight className="w-4 h-4" style={{ color:`${color}50` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="section-divider w-full" />

      {/* ═══════════════════════════════════ AI SECTION ═══ */}
      <section className="w-full max-w-5xl px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="comic-label mb-4" style={{ background:"#BF5FFF", borderColor:"#000" }}>Gemini AI Core</div>
            <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ color:"#F5F0E8" }}>
              Intelligent Stadium<br />
              <span className="gradient-text-purple">Operations</span>
            </h2>
            <p className="text-sm leading-relaxed mb-6" style={{ color:"#5c6bc0" }}>
              StadiumFlow AI runs Google Gemini 2.0 Flash as its reasoning engine — analyzing crowd density,
              historical event data, real-time queue metrics and safety signals to make split-second
              decisions for 132,000 attendees simultaneously.
            </p>
            <div className="space-y-3">
              {[
                { label: "Crowd Flow Prediction", pct: 98, color: "#00FF87" },
                { label: "Route Optimization",   pct: 96, color: "#00C6FF" },
                { label: "Queue Wait Accuracy",  pct: 94, color: "#BF5FFF" },
              ].map(({ label, pct, color }) => (
                <div key={label}>
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span style={{ color:"#9fa8da" }}>{label}</span>
                    <span style={{ color }}>{pct}%</span>
                  </div>
                  <div className="nb-progress">
                    <div className="nb-progress-fill" style={{ width:`${pct}%`, background:color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {[
              { icon: Activity, label:"Real-time crowd analysis", val:"5s updates", color:"#00FF87" },
              { icon: Bot,      label:"Multilingual AI chat",     val:"20+ langs",  color:"#00C6FF" },
              { icon: Shield,   label:"Emergency SOS system",     val:"<90s resp",  color:"#FF3333" },
              { icon: Trophy,   label:"Gamified fan experience",  val:"∞ points",   color:"#FFE600" },
            ].map(({ icon: Icon, label, val, color }) => (
              <div key={label} className="rounded-xl p-4 flex items-center gap-4"
                style={{ background:"#111", border:`2px solid ${color}25`, boxShadow:`3px 3px 0 ${color}30` }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background:`${color}15`, border:`1px solid ${color}40` }}>
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <p className="text-sm font-bold flex-1" style={{ color:"#F5F0E8" }}>{label}</p>
                <span className="text-xs font-black px-2 py-0.5 rounded"
                  style={{ background:`${color}22`, color, border:`1px solid ${color}` }}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider w-full" />

      {/* ═══════════════════════════════════ CTA BOTTOM ═══ */}
      <section className="w-full max-w-4xl px-4 py-20 text-center">
        <div className="rounded-2xl p-10 comic-panel relative overflow-hidden"
          style={{ background:"#111", border:"3px solid #00FF87", boxShadow:"8px 8px 0 #00FF87" }}>
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl opacity-10 pointer-events-none"
            style={{ background:"radial-gradient(circle, #00FF87, transparent)" }} />
          <div className="comic-label mb-4">Join Now</div>
          <h2 className="text-4xl md:text-6xl font-black mb-4" style={{ color:"#F5F0E8" }}>
            Ready to Experience<br />
            <span className="gradient-text">World Cup 2026?</span>
          </h2>
          <p className="text-sm mb-8" style={{ color:"#5c6bc0" }}>
            Choose your role and dive into the most intelligent stadium experience ever built.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/fan" className="nb-btn nb-btn-green rounded-xl px-10 py-5 text-sm">
              <MapPin className="w-5 h-5" />
              I'm a Fan
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/dashboard" className="nb-btn nb-btn-blue rounded-xl px-10 py-5 text-sm">
              <LayoutDashboard className="w-5 h-5" />
              I'm Staff / Organizer
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Challenge tag */}
        <div className="mt-10 inline-flex items-center gap-3 px-5 py-2.5 rounded-lg"
          style={{ background:"#111", border:"2px solid rgba(255,255,255,0.08)", boxShadow:"3px 3px 0 rgba(0,0,0,0.5)" }}>
          <TrendingUp className="w-4 h-4" style={{ color:"#00FF87" }} />
          <span className="text-xs font-semibold" style={{ color:"#5c6bc0" }}>
            Challenge 4 · Smart Stadiums &amp; Tournament Operations
          </span>
          <span className="comic-label">PromptWars</span>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full px-4 py-6 text-center" style={{ borderTop:"2px solid rgba(255,255,255,0.06)" }}>
        <p className="text-xs" style={{ color:"#3b4480" }}>
          Hack2Skill × Google for Developers · Built with Next.js 15 + Gemini 2.0 Flash + Firebase
        </p>
        <div className="flex justify-center gap-3 mt-3">
          {["#00FF87","#00C6FF","#BF5FFF","#FF3333","#FFE600"].map(c => (
            <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background:c, boxShadow:`0 0 8px ${c}` }} />
          ))}
        </div>
      </footer>
    </main>
  );
}

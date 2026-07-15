"use client";

import Link from "next/link";
import {
  MapPin,
  LayoutDashboard,
  Zap,
  Users,
  Clock,
  Route,
  Bot,
  Shield,
  Globe,
  TrendingUp,
} from "lucide-react";

const FEATURES = [
  { icon: Route, label: "AI Routes", desc: "Gemini-powered smart navigation", color: "#00FF87", shadow: "#00FF87" },
  { icon: Clock, label: "Live Queues", desc: "Real-time wait times", color: "#00C6FF", shadow: "#00C6FF" },
  { icon: Users, label: "Crowd Intel", desc: "Density heatmaps & alerts", color: "#FFE600", shadow: "#FFE600" },
  { icon: Bot, label: "AI Chat", desc: "Multilingual stadium assistant", color: "#BF5FFF", shadow: "#BF5FFF" },
  { icon: Shield, label: "SOS Help", desc: "Instant staff notification", color: "#FF3333", shadow: "#FF3333" },
  { icon: Globe, label: "20+ Languages", desc: "For every World Cup fan", color: "#FF6B00", shadow: "#FF6B00" },
];

const STATS = [
  { value: "132K", label: "Fan Capacity" },
  { value: "2.0", label: "Gemini Flash" },
  { value: "<1s", label: "Alert Speed" },
  { value: "20+", label: "Languages" },
];

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">

      {/* Background decorative blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-5 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #00FF87, transparent)" }} />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-5 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #00C6FF, transparent)" }} />
      <div className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full opacity-3 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #FF3333, transparent)" }} />

      {/* ─── Hero ─────────────────────────────────── */}
      <div className="text-center mb-10 animate-fade-in max-w-4xl">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 border-2 border-neon-yellow"
          style={{ background: "#111", boxShadow: "3px 3px 0 #FFE600" }}>
          <Zap className="w-4 h-4" style={{ color: "#FFE600" }} aria-hidden="true" />
          <span className="text-xs font-bold tracking-widest uppercase" style={{ color: "#FFE600" }}>
            Powered by Google Gemini 2.0 Flash
          </span>
        </div>

        {/* Title */}
        <h1 className="text-6xl md:text-8xl font-extrabold mb-4 leading-none tracking-tight">
          <span className="gradient-text">Stadium</span>
          <span className="gradient-text">Flow</span>
          <br />
          <span style={{ color: "#F5F0E8" }}>AI</span>
        </h1>

        {/* Sub-headline */}
        <div className="inline-block mb-4 px-4 py-2 border-2 border-white/20 comic-panel"
          style={{ background: "rgba(255,255,255,0.04)" }}>
          <p className="text-lg md:text-xl font-semibold" style={{ color: "#9fa8da" }}>
            Smart Stadium Operations for{" "}
            <span className="gradient-text-fifa font-extrabold">FIFA World Cup 2026</span>
          </p>
        </div>

        <p className="text-sm md:text-base max-w-2xl mx-auto" style={{ color: "#5c6bc0" }}>
          AI-powered navigation · Real-time crowd management · Multilingual assistance ·
          Emergency response · Live heatmaps for 132,000 fans
        </p>
      </div>

      {/* ─── Stats Row ────────────────────────────── */}
      <div className="grid grid-cols-4 gap-3 mb-10 max-w-xl w-full animate-slide-up">
        {STATS.map(({ value, label }) => (
          <div key={label} className="nb-card rounded-lg p-3 text-center">
            <p className="text-2xl md:text-3xl font-extrabold gradient-text tabular-nums">{value}</p>
            <p className="text-[10px] font-semibold tracking-wider uppercase mt-1" style={{ color: "#5c6bc0" }}>
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* ─── Feature Grid ─────────────────────────── */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-10 max-w-3xl w-full animate-slide-up">
        {FEATURES.map(({ icon: Icon, label, desc, color, shadow }) => (
          <div
            key={label}
            className="rounded-xl p-3 text-center cursor-default transition-all duration-200"
            style={{
              background: "#111",
              border: `2px solid ${color}`,
              boxShadow: `4px 4px 0 ${color}`,
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.boxShadow = `2px 2px 0 ${shadow}`;
              (e.currentTarget as HTMLElement).style.transform = "translate(2px, 2px)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.boxShadow = `4px 4px 0 ${shadow}`;
              (e.currentTarget as HTMLElement).style.transform = "translate(0, 0)";
            }}
          >
            <Icon className="w-6 h-6 mx-auto mb-1.5" style={{ color }} aria-hidden="true" />
            <p className="text-xs font-bold" style={{ color: "#F5F0E8" }}>{label}</p>
            <p className="text-[9px] mt-0.5" style={{ color: "#5c6bc0" }}>{desc}</p>
          </div>
        ))}
      </div>

      {/* ─── CTA Buttons ──────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-slide-up">
        <Link
          href="/fan"
          id="fan-view-cta"
          className="nb-btn nb-btn-green rounded-xl px-8 py-4 text-base"
          aria-label="Open Fan View - Mobile attendee experience"
        >
          <MapPin className="w-5 h-5" aria-hidden="true" />
          Fan View
          <span className="text-xs font-normal opacity-70">— Attendee PWA</span>
        </Link>

        <Link
          href="/dashboard"
          id="staff-dashboard-cta"
          className="nb-btn nb-btn-blue rounded-xl px-8 py-4 text-base"
          aria-label="Open Staff Dashboard - Venue management"
        >
          <LayoutDashboard className="w-5 h-5" aria-hidden="true" />
          Staff Dashboard
          <span className="text-xs font-normal opacity-70">— Secure Admin</span>
        </Link>
      </div>

      {/* ─── Challenge Tag ────────────────────────── */}
      <div className="animate-fade-in text-center">
        <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-lg border-2 border-white/10"
          style={{ background: "#111", boxShadow: "3px 3px 0 rgba(255,255,255,0.1)" }}>
          <TrendingUp className="w-4 h-4" style={{ color: "#00FF87" }} />
          <span className="text-xs font-semibold" style={{ color: "#5c6bc0" }}>
            Challenge 4 · Smart Stadiums & Tournament Operations
          </span>
          <span className="comic-label">PromptWars</span>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-10 text-center text-xs" style={{ color: "#3b4480" }}>
        <p>Hack2Skill × Google for Developers · Built with Next.js 15 + Gemini 2.0</p>
      </footer>
    </main>
  );
}

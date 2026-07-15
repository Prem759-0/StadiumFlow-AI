"use client";

// ============================================================
// StadiumFlow AI - Staff Dashboard Overview (Neo-Brutalist)
// Real-time metrics, heatmap, and performance indicators
// ============================================================

import { useEffect, useState } from "react";
import {
  Users, Clock, AlertTriangle, TrendingDown, TrendingUp,
  Activity, Gauge, Zap, BarChart3, Pause, Play, Wifi,
  ThermometerSun, Shield, Radio,
} from "lucide-react";
import StadiumMap from "@/components/stadium-map";
import { useStaffStore } from "@/lib/store";
import { formatNumber } from "@/lib/utils";

const NB_COLORS = [
  { border: "#00C6FF", shadow: "#00C6FF", text: "#00C6FF" },
  { border: "#FFE600", shadow: "#FFE600", text: "#FFE600" },
  { border: "#FF3333", shadow: "#FF3333", text: "#FF3333" },
  { border: "#00FF87", shadow: "#00FF87", text: "#00FF87" },
];

export default function DashboardPage() {
  const { zones, queues, metrics, alerts, isSimulationRunning, toggleSimulation } = useStaffStore();
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 5000);
    return () => clearInterval(interval);
  }, []);

  const pendingAlerts = alerts.filter((a) => a.status === "pending").length;
  const criticalAlerts = alerts.filter((a) => a.priority === "critical" && a.status !== "resolved").length;

  const metricCards = [
    {
      label: "Total Attendees",
      value: formatNumber(metrics.totalAttendees),
      icon: Users,
      subtext: `${Math.round((metrics.totalAttendees / 132000) * 100)}% capacity`,
      colorIdx: 0,
    },
    {
      label: "Avg Wait Time",
      value: `${metrics.avgWaitTime}m`,
      icon: Clock,
      subtext: `↓ ${metrics.waitTimeReduction}% from baseline`,
      colorIdx: 1,
    },
    {
      label: "Congestion Hotspots",
      value: metrics.congestionHotspots.toString(),
      icon: AlertTriangle,
      subtext: `${pendingAlerts} alerts pending`,
      colorIdx: 2,
    },
    {
      label: "Crowd Flow Score",
      value: `${metrics.crowdFlowScore}/100`,
      icon: Gauge,
      subtext: `${metrics.throughputIncrease}% throughput↑`,
      colorIdx: 3,
    },
  ];

  return (
    <div className="space-y-5 animate-fade-in max-w-7xl">

      {/* ── Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="comic-label">FIFA WC 2026</span>
            <span className="text-[10px] pulse-dot" style={{ color: "#5c6bc0" }}>
              &nbsp;&nbsp;LIVE MONITORING
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold" style={{ color: "#F5F0E8" }}>
            Operations Overview
          </h1>
          <p className="text-xs mt-1" style={{ color: "#5c6bc0" }}>
            MetLife Stadium · East Rutherford, NJ · 82,500 capacity
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSimulation}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all"
            style={{
              background: isSimulationRunning ? "rgba(0,255,135,0.1)" : "rgba(255,255,255,0.04)",
              border: `2px solid ${isSimulationRunning ? "#00FF87" : "rgba(255,255,255,0.1)"}`,
              color: isSimulationRunning ? "#00FF87" : "#5c6bc0",
              boxShadow: isSimulationRunning ? "3px 3px 0 #00FF87" : "none",
            }}
            aria-label={isSimulationRunning ? "Pause simulation" : "Resume simulation"}
          >
            {isSimulationRunning ? <><Pause className="w-4 h-4" /> Live</> : <><Play className="w-4 h-4" /> Paused</>}
          </button>

          {criticalAlerts > 0 && (
            <div
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-black"
              style={{ background: "rgba(255,51,51,0.15)", border: "2px solid #FF3333", color: "#FF3333", boxShadow: "3px 3px 0 #FF3333", animation: "sos-pulse 1.5s ease-in-out infinite" }}
            >
              <AlertTriangle className="w-4 h-4" />
              {criticalAlerts} CRITICAL
            </div>
          )}
        </div>
      </div>

      {/* ── Metric Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((card, i) => {
          const Icon = card.icon;
          const c = NB_COLORS[card.colorIdx];
          return (
            <div
              key={card.label}
              className="rounded-xl p-4"
              style={{ background: "#111", border: `2px solid ${c.border}`, boxShadow: `4px 4px 0 ${c.shadow}` }}
              aria-label={`${card.label}: ${card.value}`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#5c6bc0" }}>{card.label}</span>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: `${c.border}18`, border: `1px solid ${c.border}40` }}>
                  <Icon className="w-4 h-4" style={{ color: c.text }} aria-hidden="true" />
                </div>
              </div>
              <p className="text-3xl font-black tabular-nums" style={{ color: c.text }}>{card.value}</p>
              <p className="text-[10px] mt-1" style={{ color: "#3b4480" }}>{card.subtext}</p>
            </div>
          );
        })}
      </div>

      {/* ── AI Performance Bars ── */}
      <div
        className="rounded-xl p-5 comic-panel"
        style={{ background: "#111", border: "2px solid rgba(255,255,255,0.08)", boxShadow: "4px 4px 0 rgba(0,0,0,0.5)" }}
      >
        <h2 className="text-sm font-bold flex items-center gap-2 mb-4" style={{ color: "#F5F0E8" }}>
          <Zap className="w-4 h-4" style={{ color: "#00FF87" }} />
          AI Performance Impact
          <span className="comic-label ml-auto">GEMINI 2.0</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "Wait Time Reduction", value: metrics.waitTimeReduction, icon: TrendingDown, color: "#00FF87", gradient: "linear-gradient(90deg, #00CC6A, #00FF87)" },
            { label: "Throughput Increase", value: metrics.throughputIncrease, icon: TrendingUp, color: "#00C6FF", gradient: "linear-gradient(90deg, #0099CC, #00C6FF)" },
            { label: "Crowd Flow Score", value: metrics.crowdFlowScore, icon: Activity, color: "#BF5FFF", gradient: "linear-gradient(90deg, #8b35cc, #BF5FFF)" },
          ].map(({ label, value, icon: Icon, color, gradient }) => (
            <div key={label} className="rounded-lg p-4" style={{ background: "rgba(0,0,0,0.4)", border: `1px solid ${color}25` }}>
              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-4 h-4" style={{ color }} />
                <span className="text-xs" style={{ color: "#9fa8da" }}>{label}</span>
              </div>
              <p className="text-3xl font-black tabular-nums mb-2" style={{ color }}>{value}{label.includes("Score") ? "" : "%"}</p>
              <div className="h-2 rounded-full" style={{ background: "#222" }}>
                <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${value}%`, background: gradient }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Live Heatmap + Zone List ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="rounded-xl p-5" style={{ background: "#111", border: "2px solid #FFE600", boxShadow: "4px 4px 0 #FFE600" }}>
          <h2 className="text-sm font-bold flex items-center gap-2 mb-4" style={{ color: "#FFE600" }}>
            <BarChart3 className="w-4 h-4" />
            Live Stadium Heatmap
            <span className="text-[10px] pulse-dot ml-3" style={{ color: "#5c6bc0" }}>&nbsp;&nbsp;Real-time</span>
          </h2>
          <StadiumMap zones={zones} selectedZone={selectedZone} onZoneClick={setSelectedZone} className="aspect-square" />
        </div>

        <div className="rounded-xl p-5" style={{ background: "#111", border: "2px solid rgba(255,255,255,0.1)", boxShadow: "4px 4px 0 rgba(0,0,0,0.5)" }}>
          <h2 className="text-sm font-bold mb-4" style={{ color: "#F5F0E8" }}>Zone Occupancy</h2>
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {zones
              .sort((a, b) => b.currentOccupancy / b.capacity - a.currentOccupancy / a.capacity)
              .map((zone) => {
                const pct = Math.round((zone.currentOccupancy / zone.capacity) * 100);
                const color = pct > 80 ? "#FF3333" : pct > 60 ? "#FFE600" : "#00FF87";
                return (
                  <button
                    key={zone.id}
                    onClick={() => setSelectedZone(zone.id)}
                    className="w-full text-left p-3 rounded-lg transition-all"
                    style={{
                      background: selectedZone === zone.id ? "rgba(255,255,255,0.06)" : "transparent",
                      border: `1px solid ${selectedZone === zone.id ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.04)"}`,
                    }}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold truncate" style={{ color: "#F5F0E8" }}>{zone.name}</span>
                      <span className="text-sm font-black tabular-nums" style={{ color }}>{pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ background: "#222" }}>
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
                    </div>
                    <p className="text-[10px] mt-1" style={{ color: "#3b4480" }}>
                      {zone.currentOccupancy.toLocaleString()} / {zone.capacity.toLocaleString()}
                    </p>
                  </button>
                );
              })}
          </div>
        </div>
      </div>

      {/* ── Live Status Footer ── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Wifi, label: "Firebase", status: "Connected", color: "#00FF87" },
          { icon: Radio, label: "Pub/Sub", status: "Streaming", color: "#00C6FF" },
          { icon: Shield, label: "Auth Guard", status: "Active", color: "#BF5FFF" },
        ].map(({ icon: Icon, label, status, color }) => (
          <div key={label} className="rounded-lg p-3 flex items-center gap-2"
            style={{ background: "#111", border: `1px solid ${color}30` }}>
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: color }} />
            <Icon className="w-3.5 h-3.5" style={{ color }} />
            <div>
              <p className="text-[10px] font-bold" style={{ color: "#F5F0E8" }}>{label}</p>
              <p className="text-[9px]" style={{ color }}>{status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

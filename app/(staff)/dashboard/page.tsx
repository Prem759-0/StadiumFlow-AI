"use client";

// ============================================================
// StadiumFlow AI - Staff Dashboard Overview (Neo-Brutalist)
// Real-time metrics, heatmap, and performance indicators
// ============================================================

import { useEffect, useState } from "react";
import {
  Users, Clock, AlertTriangle, TrendingDown, TrendingUp,
  Activity, Gauge, Zap, BarChart3, Pause, Play, Wifi,
  ThermometerSun, Shield, Radio, Bot, Sparkles, Loader2, Send
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
  const { zones, queues, metrics, alerts, isSimulationRunning, toggleSimulation, addAlert } = useStaffStore();
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const [simStatus, setSimStatus] = useState<"idle" | "loading" | "complete">("idle");
  const [simResult, setSimResult] = useState("");

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 5000);
    return () => clearInterval(interval);
  }, []);

  const runSimulation = (scenario: string) => {
    setSimStatus("loading");
    setTimeout(() => {
      setSimResult(`[SIMULATION ALERT] ${scenario} triggers a 40% overflow to adjacent zones within 3 minutes. Gate A load will exceed safe capacity (115%). Recommendation: Redirect South sector attendees to Gate C immediately.`);
      setSimStatus("complete");
    }, 2000);
  };

  const pushMassAlert = () => {
    addAlert({
      id: `alert-${Date.now()}`,
      title: "CROWD REDIRECT",
      message: simResult,
      zoneId: "stadium-wide",
      priority: "critical",
      status: "pending",
      timestamp: new Date(),
    });
    setSimStatus("idle");
    setSimResult("");
  };

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
          <div className="flex items-center gap-2 mb-2">
            <span className="comic-label bg-black text-white px-2 py-0.5">FIFA WC 2026</span>
          <div className="flex items-center gap-1.5 bg-[#FF3333] px-2 py-0.5 rounded-xl border-2 border-black" style={{ boxShadow: "2px 2px 0 #000" }}>
            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="text-[10px] font-black text-white uppercase tracking-wider">
              LIVE MONITORING
            </span>
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-black" style={{ textShadow: "2px 2px 0 #00FF87" }}>
          Operations Overview
        </h1>
        <p className="text-xs mt-1 font-bold text-gray-700 uppercase tracking-widest">
          MetLife Stadium · East Rutherford, NJ · 82,500 capacity
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSimulation}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black uppercase tracking-wider transition-all hover:-translate-y-1 active:translate-y-1"
          style={{
            background: isSimulationRunning ? "#00FF87" : "#F5F0E8",
            border: "3px solid #000",
            color: "#000",
            boxShadow: "4px 4px 0 #000",
          }}
          aria-label={isSimulationRunning ? "Pause simulation" : "Resume simulation"}
        >
          {isSimulationRunning ? <><Pause className="w-4 h-4" /> Live</> : <><Play className="w-4 h-4" /> Paused</>}
        </button>

        {criticalAlerts > 0 && (
          <div
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-black uppercase tracking-widest"
            style={{ background: "#FF3333", border: "3px solid #000", color: "#FFF", boxShadow: "4px 4px 0 #000", animation: "sos-pulse 1.5s ease-in-out infinite" }}
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
            className="rounded-2xl p-4 transition-transform hover:-translate-y-1"
            style={{ background: "#FFFFFF", border: `3px solid ${c.border}`, boxShadow: `4px 4px 0 ${c.shadow}` }}
            aria-label={`${card.label}: ${card.value}`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#555555" }}>{card.label}</span>
              <div className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: `${c.border}18`, border: `2px solid ${c.border}40` }}>
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
      className="rounded-2xl p-5 comic-panel bg-white mt-6"
      style={{ border: "4px solid #000", boxShadow: "6px 6px 0 #000" }}
    >
      <h2 className="text-sm font-black flex items-center gap-2 mb-4 uppercase tracking-widest text-black">
        <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center">
          <Zap className="w-4 h-4 text-[#00FF87]" />
        </div>
        AI Performance Impact
        <span className="comic-label rounded-xl ml-auto bg-[#BF5FFF] text-white border-2 border-black">GEMINI 2.0</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Wait Time Reduction", value: metrics.waitTimeReduction, icon: TrendingDown, color: "#00FF87" },
          { label: "Throughput Increase", value: metrics.throughputIncrease, icon: TrendingUp, color: "#00C6FF" },
          { label: "Crowd Flow Score", value: metrics.crowdFlowScore, icon: Activity, color: "#FFE600" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-2xl p-4" style={{ background: color, border: "3px solid #000", boxShadow: "3px 3px 0 #000" }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-white border-2 border-black flex items-center justify-center">
                <Icon className="w-3.5 h-3.5 text-black" />
              </div>
              <span className="text-xs font-black uppercase tracking-wider text-black">{label}</span>
            </div>
            <p className="text-3xl font-black tabular-nums mb-2 text-black">{value}{label.includes("Score") ? "" : "%"}</p>
            <div className="h-3 rounded-full border-2 border-black bg-white overflow-hidden">
              <div className="h-full rounded-r-full bg-black transition-all duration-1000" style={{ width: `${value}%` }} />
            </div>
          </div>
        ))}
        </div>
      </div>

      {/* ── Live Heatmap + Zone List ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="rounded-2xl p-5" style={{ background: "#FFFFFF", border: "2px solid #FFE600", boxShadow: "4px 4px 0 #FFE600" }}>
          <h2 className="text-sm font-bold flex items-center gap-2 mb-4" style={{ color: "#FFE600" }}>
            <BarChart3 className="w-4 h-4" />
            Live Stadium Heatmap
            <span className="text-[10px] pulse-dot ml-3" style={{ color: "#555555" }}>&nbsp;&nbsp;Real-time</span>
          </h2>
          <StadiumMap zones={zones} selectedZone={selectedZone} onZoneClick={setSelectedZone} className="aspect-square" />
        </div>

        <div className="rounded-2xl p-5" style={{ background: "#F5F0E8", border: "4px solid #000", boxShadow: "6px 6px 0 #000" }}>
          <h2 className="text-sm font-black mb-4 uppercase tracking-widest text-black">Zone Occupancy</h2>
          <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
            {zones
              .sort((a, b) => b.currentOccupancy / b.capacity - a.currentOccupancy / a.capacity)
              .map((zone) => {
                const pct = Math.round((zone.currentOccupancy / zone.capacity) * 100);
                const color = pct > 80 ? "#FF3333" : pct > 60 ? "#FFE600" : "#00FF87";
                const isSelected = selectedZone === zone.id;
                
                return (
                  <div key={zone.id} className="w-full">
                    <button
                      onClick={() => setSelectedZone(zone.id)}
                      className={`w-full text-left p-3 ${isSelected ? "rounded-t-xl" : "rounded-xl"} transition-all hover:-translate-y-0.5 active:translate-y-0.5`}
                      style={{
                        background: zone.isLockedDown ? "#FF3333" : "#FFFFFF",
                        border: "3px solid #000",
                        boxShadow: isSelected ? "none" : "3px 3px 0 #000",
                        transform: isSelected ? "translate(3px, 3px)" : "none",
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs font-black uppercase tracking-wider truncate ${zone.isLockedDown ? "text-white" : "text-black"}`}>
                          {zone.isLockedDown ? "🚨 " : ""}{zone.name}
                        </span>
                        <span className="text-sm font-black tabular-nums px-2 py-0.5 rounded-lg border-2 border-black" style={{ background: color, color: "#000" }}>{pct}%</span>
                      </div>
                      <div className="h-2.5 rounded-full border-2 border-black bg-white overflow-hidden">
                        <div className="h-full rounded-r-full transition-all duration-700 border-r-2 border-black" style={{ width: `${pct}%`, background: color }} />
                      </div>
                      <p className={`text-[10px] mt-2 font-bold uppercase tracking-wider ${zone.isLockedDown ? "text-white" : "text-gray-700"}`}>
                        {zone.currentOccupancy.toLocaleString()} / {zone.capacity.toLocaleString()} Fans
                      </p>
                    </button>
                    
                    {/* God Mode Lockdown Control */}
                    {isSelected && (
                      <div className="p-3 border-x-4 border-b-4 border-black bg-black animate-slide-up rounded-b-xl" style={{ marginTop: "-3px" }}>
                        <button
                          onClick={() => useStaffStore.getState().toggleZoneLockdown(zone.id)}
                          className={`w-full py-2 rounded-xl border-4 border-black font-black uppercase tracking-widest text-xs transition-colors ${
                            zone.isLockedDown 
                              ? "bg-[#00FF87] text-black hover:bg-white" 
                              : "bg-[#FF3333] text-white hover:bg-[#FFE600] hover:text-black animate-pulse"
                          }`}
                        >
                          {zone.isLockedDown ? "LIFT LOCKDOWN" : "INITIATE LOCKDOWN"}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* ── AI Crisis Simulator ── */}
      <div className="rounded-2xl p-5 comic-panel relative overflow-hidden" style={{ background: "#FF3333", border: "4px solid #000", boxShadow: "6px 6px 0 #000" }}>
        <div className="absolute -right-4 -top-4 opacity-20 pointer-events-none">
          <Bot className="w-32 h-32 text-black" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#FFE600] border-2 border-black shadow-[2px_2px_0_#000] flex items-center justify-center">
              <Bot className="w-5 h-5 text-black" />
            </div>
            <div>
              <h2 className="text-sm font-black uppercase tracking-widest text-black flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Gemini Crisis Simulator
              </h2>
              <p className="text-xs font-bold text-black/80">Predict crowd flow & mass redirect fans instantly</p>
            </div>
          </div>

          {simStatus === "idle" && (
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: "Simulate Gate B Closure", icon: AlertTriangle },
                { name: "Simulate Heavy Rain", icon: ThermometerSun },
              ].map(({ name, icon: Icon }) => (
                <button
                  key={name}
                  onClick={() => runSimulation(name)}
                  className="flex items-center gap-2 p-3 rounded-xl bg-white border-2 border-black text-black font-black text-[10px] uppercase tracking-wider shadow-[3px_3px_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_#000] transition-all"
                >
                  <Icon className="w-4 h-4 text-[#FF3333]" />
                  {name}
                </button>
              ))}
            </div>
          )}

          {simStatus === "loading" && (
            <div className="flex items-center gap-3 p-4 bg-white rounded-lg border-2 border-black shadow-[3px_3px_0_#000]">
              <Loader2 className="w-5 h-5 text-[#FF3333] animate-spin" />
              <p className="text-xs font-black text-black uppercase tracking-wider">Gemini is analyzing scenario impact...</p>
            </div>
          )}

          {simStatus === "complete" && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 bg-white rounded-lg border-2 border-black shadow-[3px_3px_0_#000]">
                <p className="text-xs font-bold text-[#555] leading-relaxed font-mono">{simResult}</p>
              </div>
              <button
                onClick={pushMassAlert}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#00FF87] border-4 border-black text-black font-black text-sm uppercase tracking-wider shadow-[4px_4px_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#000] transition-all"
              >
                <Send className="w-5 h-5" /> Push Mass Redirect Alert
              </button>
            </div>
          )}
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
            style={{ background: "#FFFFFF", border: `1px solid ${color}30` }}>
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: color }} />
            <Icon className="w-3.5 h-3.5" style={{ color }} />
            <div>
              <p className="text-[10px] font-bold" style={{ color: "#050505" }}>{label}</p>
              <p className="text-[9px]" style={{ color }}>{status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

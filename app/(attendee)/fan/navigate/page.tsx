"use client";

// ============================================================
// StadiumFlow AI - AI Route Optimizer (Neo-Brutalist Redesign)
// ============================================================

import { useState } from "react";
import {
  Navigation, MapPin, ArrowDown, Clock, AlertTriangle,
  Route, Loader2, Footprints, Accessibility, ChevronDown, Zap, CheckCircle2,
} from "lucide-react";
import { getOptimizedRoute } from "@/lib/gemini";
import { routeNodes } from "@/lib/mock-data";
import { useAttendeeStore, useStaffStore } from "@/lib/store";
import StadiumMap from "@/components/stadium-map";

const LOCATIONS = [
  { id: "gate-a-node", name: "Gate A (North)", type: "gate", emoji: "🚪" },
  { id: "gate-b-node", name: "Gate B (East)", type: "gate", emoji: "🚪" },
  { id: "gate-c-node", name: "Gate C (South)", type: "gate", emoji: "🚪" },
  { id: "gate-d-node", name: "Gate D (West)", type: "gate", emoji: "🚪" },
  { id: "sec-n1-node", name: "Section N1 (Your Seat)", type: "seat", emoji: "💺" },
  { id: "sec-e1-node", name: "Section E1", type: "seat", emoji: "💺" },
  { id: "sec-s1-node", name: "Section S1", type: "seat", emoji: "💺" },
  { id: "sec-w1-node", name: "Section W1", type: "seat", emoji: "💺" },
  { id: "food-n-node", name: "North Food Court", type: "food", emoji: "🍕" },
  { id: "food-e-node", name: "East Food Court", type: "food", emoji: "🌮" },
  { id: "food-s-node", name: "South Food Court", type: "food", emoji: "🍔" },
  { id: "food-w-node", name: "West Food Court", type: "food", emoji: "🥤" },
  { id: "rest-n1-node", name: "Restroom N1", type: "restroom", emoji: "🚻" },
  { id: "rest-s1-node", name: "Restroom S1", type: "restroom", emoji: "🚻" },
  { id: "rest-w1-node", name: "Restroom W1", type: "restroom", emoji: "🚻" },
  { id: "med-1-node", name: "Medical Station", type: "medical", emoji: "🏥" },
];

const SELECT_STYLE = {
  background: "#FFFFFF",
  border: "2px solid #000000",
  color: "#050505",
  borderRadius: "12px",
  padding: "10px 40px 10px 16px",
  width: "100%",
  fontSize: "14px",
  fontWeight: "600",
  appearance: "none" as const,
  cursor: "pointer",
};

export default function NavigatePage() {
  const [from, setFrom] = useState("gate-a-node");
  const [to, setTo] = useState("sec-n1-node");
  const [isLoading, setIsLoading] = useState(false);
  const [route, setRoute] = useState<{
    path: string[];
    estimatedTime: number;
    instructions: string[];
    congestionLevel: string;
  } | null>(null);
  const { profile } = useAttendeeStore();
  const { zones } = useStaffStore();

  const handleOptimize = async () => {
    setIsLoading(true);
    setRoute(null);
    const congestionMap: Record<string, number> = {};
    routeNodes.forEach((node) => { congestionMap[node.id] = node.congestion; });
    const result = await getOptimizedRoute({
      from: LOCATIONS.find((l) => l.id === from)?.name || from,
      to: LOCATIONS.find((l) => l.id === to)?.name || to,
      currentCongestion: congestionMap,
      needsAccessibility: profile.needsAccessibility,
      userContext: `${profile.ticketType} ticket holder, seat ${profile.seatSection} Row ${profile.seatRow}`,
    });
    setRoute(result);
    setIsLoading(false);
  };

  const congestionConfig: Record<string, { color: string; label: string; bg: string }> = {
    low: { color: "#00FF87", label: "LOW CONGESTION", bg: "rgba(0,255,135,0.12)" },
    medium: { color: "#FFE600", label: "MODERATE", bg: "rgba(255,230,0,0.12)" },
    high: { color: "#FF3333", label: "HIGH CONGESTION", bg: "rgba(255,51,51,0.12)" },
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm"
          style={{ background: "#00FF87", color: "#0A0A0A", border: "2px solid #000", boxShadow: "3px 3px 0 #000" }}>
          <Navigation className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-lg font-extrabold" style={{ color: "#050505" }}>AI Route Optimizer</h1>
          <p className="text-xs" style={{ color: "#555555" }}>Gemini-powered smart navigation</p>
        </div>
        <span className="comic-label ml-auto">GEMINI AI</span>
      </div>

      {/* Map Preview */}
      <div className="rounded-xl p-2" style={{ background: "#FFFFFF", border: "2px solid #000", boxShadow: "4px 4px 0 rgba(0,0,0,0.5)" }}>
        <StadiumMap zones={zones} className="aspect-[4/3] rounded-lg" compact showLabels={false} />
      </div>

      {/* Route Selection Card */}
      <div className="rounded-xl p-4 space-y-3" style={{ background: "#FFFFFF", border: "2px solid #00FF87", boxShadow: "4px 4px 0 #00FF87" }}>
        <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: "#00FF87" }}>Plan Your Route</h2>

        {/* FROM */}
        <div>
          <label htmlFor="from" className="text-[11px] font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1" style={{ color: "#555555" }}>
            <MapPin className="w-3 h-3" /> From (Your Location)
          </label>
          <div className="relative">
            <select id="from" value={from} onChange={(e) => setFrom(e.target.value)} style={SELECT_STYLE} aria-label="Starting location">
              {LOCATIONS.map((loc) => (
                <option key={loc.id} value={loc.id}>{loc.emoji} {loc.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "#555555" }} />
          </div>
        </div>

        {/* Arrow */}
        <div className="flex justify-center">
          <div className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: "#FFFFFF", border: "2px solid #000" }}>
            <ArrowDown className="w-4 h-4" style={{ color: "#555555" }} />
          </div>
        </div>

        {/* TO */}
        <div>
          <label htmlFor="to" className="text-[11px] font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1" style={{ color: "#555555" }}>
            <Navigation className="w-3 h-3" /> To (Destination)
          </label>
          <div className="relative">
            <select id="to" value={to} onChange={(e) => setTo(e.target.value)} style={SELECT_STYLE} aria-label="Destination">
              {LOCATIONS.map((loc) => (
                <option key={loc.id} value={loc.id}>{loc.emoji} {loc.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "#555555" }} />
          </div>
        </div>

        {/* Accessibility badge */}
        {profile.needsAccessibility && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: "rgba(0,198,255,0.1)", border: "1px solid rgba(0,198,255,0.3)" }}>
            <Accessibility className="w-4 h-4" style={{ color: "#00C6FF" }} />
            <span className="text-xs font-semibold" style={{ color: "#00C6FF" }}>Accessibility-optimized route enabled</span>
          </div>
        )}

        {/* Optimize Button */}
        <button
          onClick={handleOptimize}
          disabled={isLoading || from === to}
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-black text-sm uppercase tracking-wider transition-all"
          style={{
            background: isLoading || from === to ? "#222" : "#00FF87",
            color: isLoading || from === to ? "#5c6bc0" : "#0A0A0A",
            border: `2px solid ${isLoading || from === to ? "#000000" : "#000"}`,
            boxShadow: isLoading || from === to ? "none" : "4px 4px 0 #000",
            cursor: isLoading || from === to ? "not-allowed" : "pointer",
          }}
          aria-label="Get optimized route"
        >
          {isLoading ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Optimizing with Gemini...</>
          ) : (
            <><Zap className="w-5 h-5" /> Get AI Route</>
          )}
        </button>
      </div>

      {/* Route Results */}
      {route && (() => {
        const cfg = congestionConfig[route.congestionLevel] || congestionConfig.medium;
        return (
          <div className="rounded-xl p-4 space-y-4 animate-slide-up" style={{ background: "#FFFFFF", border: `2px solid ${cfg.color}`, boxShadow: `4px 4px 0 ${cfg.color}` }}>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold flex items-center gap-2" style={{ color: "#050505" }}>
                <Route className="w-4 h-4" style={{ color: cfg.color }} />
                Best Route Found
              </h2>
              <span className="text-xs font-black px-2.5 py-1 rounded-lg" style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}` }}>
                {cfg.label}
              </span>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg p-3 text-center" style={{ background: "#FFFFFF", border: "1px solid #000000" }}>
                <Clock className="w-5 h-5 mx-auto mb-1" style={{ color: "#00C6FF" }} />
                <p className="text-2xl font-black tabular-nums" style={{ color: "#050505" }}>{route.estimatedTime}<span className="text-sm font-normal"> min</span></p>
                <p className="text-[10px]" style={{ color: "#3b4480" }}>Est. time</p>
              </div>
              <div className="rounded-lg p-3 text-center" style={{ background: "#FFFFFF", border: "1px solid #000000" }}>
                <Footprints className="w-5 h-5 mx-auto mb-1" style={{ color: "#BF5FFF" }} />
                <p className="text-2xl font-black tabular-nums" style={{ color: "#050505" }}>{route.estimatedTime * 75}<span className="text-sm font-normal"> m</span></p>
                <p className="text-[10px]" style={{ color: "#3b4480" }}>Distance</p>
              </div>
            </div>

            {/* Route Path */}
            <div className="space-y-0">
              {route.path.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{
                      background: i === 0 ? "#00FF87" : i === route.path.length - 1 ? "#00C6FF" : "#222",
                      border: `2px solid ${i === 0 ? "#00FF87" : i === route.path.length - 1 ? "#00C6FF" : "#444"}`,
                    }}>
                      {(i === 0 || i === route.path.length - 1) && <CheckCircle2 className="w-3 h-3 text-black" />}
                    </div>
                    {i < route.path.length - 1 && <div className="w-0.5 h-8" style={{ background: "rgba(255,255,255,0.1)" }} />}
                  </div>
                  <div className="pb-5">
                    <p className="text-sm font-bold" style={{ color: "#050505" }}>{step}</p>
                    {route.instructions[i] && (
                      <p className="text-xs mt-0.5" style={{ color: "#555555" }}>{route.instructions[i]}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* High congestion warning */}
            {route.congestionLevel === "high" && (
              <div className="flex items-start gap-2 p-3 rounded-lg" style={{ background: "rgba(255,51,51,0.1)", border: "2px solid rgba(255,51,51,0.4)" }}>
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#FF3333" }} />
                <p className="text-xs" style={{ color: "#FF3333" }}>
                  High congestion detected. Consider waiting 5–10 minutes or ask the AI chat for an alternative.
                </p>
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
}

"use client";

// ============================================================
// StadiumFlow AI - AI Predictions Panel (Neo-Brutalist)
// ============================================================

import { useState, useEffect } from "react";
import {
  Brain, RefreshCw, TrendingUp, AlertTriangle, CheckCircle, Loader2, Sparkles, BarChart
} from "lucide-react";
import { useStaffStore } from "@/lib/store";
import { getAIPredictions } from "@/lib/gemini";

export default function PredictionsPage() {
  const { aiPredictions, setAIPredictions, zones, queues } = useStaffStore();
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const refreshPredictions = async () => {
    setIsLoading(true);
    const zoneData = zones.map((z) => ({
      id: z.id,
      name: z.name,
      occupancy: z.currentOccupancy,
      capacity: z.capacity,
    }));
    const queueData = queues.map((q) => ({
      name: q.name,
      currentQueue: q.currentQueue,
      trend: q.arrivalRate > q.maxServiceRate ? "increasing" : "decreasing",
    }));

    const result = await getAIPredictions({
      zoneData,
      queueData,
      timeContext: `Match in progress - ${new Date().toLocaleTimeString()}`,
    });

    setAIPredictions(result.predictions);
    setLastUpdated(new Date());
    setIsLoading(false);
  };

  useEffect(() => {
    const interval = setInterval(refreshPredictions, 30000);
    return () => clearInterval(interval);
  }, []);

  const getPredictionIcon = (text: string) => {
    if (text.includes("⚠️") || text.includes("surge") || text.includes("peak"))
      return { icon: AlertTriangle, color: "#FFE600", bg: "rgba(255,230,0,0.1)", border: "#FFE600" };
    if (text.includes("📈") || text.includes("trending") || text.includes("expected"))
      return { icon: TrendingUp, color: "#FF3333", bg: "rgba(255,51,51,0.1)", border: "#FF3333" };
    if (text.includes("✅") || text.includes("clear") || text.includes("low"))
      return { icon: CheckCircle, color: "#00FF87", bg: "rgba(0,255,135,0.1)", border: "#00FF87" };
    return { icon: BarChart, color: "#00C6FF", bg: "rgba(0,198,255,0.1)", border: "#00C6FF" };
  };

  return (
    <div className="space-y-5 animate-fade-in max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="comic-label bg-black text-white px-2 py-0.5">AI PANEL</span>
            <div className="flex items-center gap-1.5 bg-[#BF5FFF] px-2 py-0.5 border-2 border-black" style={{ boxShadow: "2px 2px 0 #000" }}>
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="text-[10px] font-black text-white uppercase tracking-wider">
                GEMINI INSIGHTS
              </span>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-black" style={{ textShadow: "2px 2px 0 #BF5FFF" }}>AI Predictions</h1>
          <p className="text-xs mt-1 font-bold text-gray-700 uppercase tracking-widest">
            Real-time predictive analytics for proactive crowd coordination
          </p>
        </div>
        <button
          onClick={refreshPredictions}
          disabled={isLoading}
          className="nb-btn nb-btn-green px-4 py-2 rounded-lg text-xs"
          aria-label="Refresh predictions"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          Refresh
        </button>
      </div>

      {/* Gemini Banner */}
      <div className="rounded-xl p-4 flex items-center gap-3"
        style={{ background: "#FFFFFF", border: "2px solid #BF5FFF", boxShadow: "4px 4px 0 #BF5FFF" }}>
        <Sparkles className="w-6 h-6 flex-shrink-0" style={{ color: "#BF5FFF" }} />
        <div>
          <p className="text-sm font-bold" style={{ color: "#050505" }}>Powered by Google Gemini 2.0 Flash</p>
          <p className="text-xs mt-0.5" style={{ color: "#555555" }}>
            The reasoning engine evaluates live crowd flows, queue patterns, and historical event logs to generate real-time forecasts.
          </p>
        </div>
      </div>

      {/* Predictions list */}
      <div className="space-y-3">
        {aiPredictions.map((prediction, index) => {
          const { icon: Icon, color, bg, border } = getPredictionIcon(prediction);
          return (
            <div
              key={index}
              className="rounded-xl p-4 flex items-start gap-3 animate-slide-up"
              style={{
                background: "#FFFFFF",
                border: `2px solid ${border}`,
                boxShadow: "3px 3px 0 rgba(0,0,0,0.5)",
                animationDelay: `${index * 80}ms`,
              }}
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: bg, border: `1px solid ${border}20` }}>
                <Icon className="w-4 h-4" style={{ color }} aria-hidden="true" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold leading-relaxed" style={{ color: "#050505" }}>{prediction}</p>
              </div>
              <span className="comic-label flex-shrink-0">#{index + 1}</span>
            </div>
          );
        })}
      </div>

      {/* Last Updated */}
      <p className="text-xs text-center" style={{ color: "#3b4480" }}>
        Last updated: {lastUpdated.toLocaleTimeString()} · Auto-refreshes every 30 seconds
      </p>

      {/* Quick Insights Grid */}
      <div className="rounded-xl p-5" style={{ background: "#FFFFFF", border: "2px solid #000", boxShadow: "4px 4px 0 rgba(0,0,0,0.5)" }}>
        <h2 className="text-sm font-bold mb-4" style={{ color: "#050505" }}>Operational Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            {
              label: "Highest Risk Zone",
              value: (() => {
                const worst = zones.reduce((max, z) =>
                  z.currentOccupancy / z.capacity > max.currentOccupancy / max.capacity ? z : max
                );
                return `${worst.name} (${Math.round((worst.currentOccupancy / worst.capacity) * 100)}%)`;
              })(),
              color: "#FF3333",
            },
            {
              label: "Longest Queue",
              value: (() => {
                const worst = queues.reduce((max, q) => q.estimatedWait > max.estimatedWait ? q : max);
                return `${worst.name} (${worst.estimatedWait} min)`;
              })(),
              color: "#FFE600",
            },
            {
              label: "Best Gate to Direct Fans",
              value: (() => {
                const best = queues
                  .filter((q) => q.type === "entry")
                  .reduce((min, q) => q.estimatedWait < min.estimatedWait ? q : min);
                return `${best.name} (${best.estimatedWait} min)`;
              })(),
              color: "#00FF87",
            },
            {
              label: "Quietest Food Court",
              value: (() => {
                const best = queues
                  .filter((q) => q.type === "concession")
                  .reduce((min, q) => q.estimatedWait < min.estimatedWait ? q : min);
                return `${best.name} (${best.estimatedWait} min)`;
              })(),
              color: "#00C6FF",
            },
          ].map((insight) => (
            <div key={insight.label} className="p-3.5 rounded-lg" style={{ background: "#FFFFFF", border: "1px solid rgba(255,255,255,0.06)" }}>
              <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#555555" }}>{insight.label}</p>
              <p className="text-sm font-extrabold mt-1" style={{ color: insight.color }}>{insight.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

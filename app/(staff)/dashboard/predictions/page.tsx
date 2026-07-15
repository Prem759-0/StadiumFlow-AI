"use client";

// ============================================================
// StadiumFlow AI - AI Predictions Panel
// Gemini-powered predictive analytics for staff
// ============================================================

import { useState, useEffect } from "react";
import {
  Brain,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Sparkles,
  BarChart,
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

  // Auto-refresh predictions every 30 seconds
  useEffect(() => {
    const interval = setInterval(refreshPredictions, 30000);
    return () => clearInterval(interval);
  }, []);

  const getPredictionIcon = (text: string) => {
    if (text.includes("⚠️") || text.includes("surge") || text.includes("peak"))
      return { icon: AlertTriangle, color: "text-accent-amber" };
    if (text.includes("📈") || text.includes("trending") || text.includes("expected"))
      return { icon: TrendingUp, color: "text-accent-red" };
    if (text.includes("✅") || text.includes("clear") || text.includes("low"))
      return { icon: CheckCircle, color: "text-electric-400" };
    return { icon: BarChart, color: "text-accent-cyan" };
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Brain className="w-5 h-5 text-accent-purple" />
            AI Predictions
          </h1>
          <p className="text-sm text-navy-400 mt-1">
            Gemini-powered predictive analytics for proactive crowd management
          </p>
        </div>
        <button
          onClick={refreshPredictions}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-purple/15 text-accent-purple text-sm font-medium border border-accent-purple/20 hover:bg-accent-purple/25 transition-all disabled:opacity-50"
          aria-label="Refresh predictions"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          Refresh
        </button>
      </div>

      {/* Gemini Badge */}
      <div className="glass rounded-xl p-4 flex items-center gap-3 border-accent-purple/20 bg-accent-purple/5">
        <Sparkles className="w-6 h-6 text-accent-purple flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-white">
            Powered by Google Gemini
          </p>
          <p className="text-xs text-navy-400">
            AI analyzes crowd patterns, queue trends, and historical data to predict
            upcoming congestion points and suggest proactive measures.
          </p>
        </div>
      </div>

      {/* Prediction Cards */}
      <div className="space-y-3">
        {aiPredictions.map((prediction, index) => {
          const { icon: Icon, color } = getPredictionIcon(prediction);

          return (
            <div
              key={index}
              className="glass rounded-xl p-4 flex items-start gap-3 card-hover animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`w-8 h-8 rounded-lg bg-navy-800 flex items-center justify-center flex-shrink-0 mt-0.5`}>
                <Icon className={`w-4 h-4 ${color}`} aria-hidden="true" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-navy-100 leading-relaxed">
                  {prediction}
                </p>
              </div>
              <span className="text-[10px] text-navy-500 flex-shrink-0">
                #{index + 1}
              </span>
            </div>
          );
        })}
      </div>

      {/* Last Updated */}
      <p className="text-xs text-navy-500 text-center">
        Last updated: {lastUpdated.toLocaleTimeString()} •{" "}
        Auto-refreshes every 30 seconds
      </p>

      {/* Insights Summary */}
      <div className="glass rounded-xl p-5">
        <h2 className="text-sm font-bold text-white mb-3">Quick Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            {
              label: "Highest Risk Zone",
              value: (() => {
                const worst = zones.reduce((max, z) =>
                  z.currentOccupancy / z.capacity >
                  max.currentOccupancy / max.capacity
                    ? z
                    : max
                );
                return `${worst.name} (${Math.round(
                  (worst.currentOccupancy / worst.capacity) * 100
                )}%)`;
              })(),
              color: "text-accent-red",
            },
            {
              label: "Longest Queue",
              value: (() => {
                const worst = queues.reduce((max, q) =>
                  q.estimatedWait > max.estimatedWait ? q : max
                );
                return `${worst.name} (${worst.estimatedWait} min)`;
              })(),
              color: "text-accent-amber",
            },
            {
              label: "Best Gate to Direct Fans",
              value: (() => {
                const best = queues
                  .filter((q) => q.type === "entry")
                  .reduce((min, q) =>
                    q.estimatedWait < min.estimatedWait ? q : min
                  );
                return `${best.name} (${best.estimatedWait} min)`;
              })(),
              color: "text-electric-400",
            },
            {
              label: "Quietest Food Court",
              value: (() => {
                const best = queues
                  .filter((q) => q.type === "concession")
                  .reduce((min, q) =>
                    q.estimatedWait < min.estimatedWait ? q : min
                  );
                return `${best.name} (${best.estimatedWait} min)`;
              })(),
              color: "text-accent-cyan",
            },
          ].map((insight) => (
            <div key={insight.label} className="p-3 rounded-lg bg-navy-800/50">
              <p className="text-xs text-navy-400">{insight.label}</p>
              <p className={`text-sm font-semibold ${insight.color} mt-1`}>
                {insight.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

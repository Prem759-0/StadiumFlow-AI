"use client";

// ============================================================
// StadiumFlow AI - Alert Feed & Dispatch (Neo-Brutalist Redesign)
// ============================================================

import { useEffect, useState } from "react";
import {
  AlertTriangle, MapPin, Clock, Send, Check, XCircle, Filter, Users, Wrench, Shield, Heart
} from "lucide-react";
import { useStaffStore } from "@/lib/store";
import { timeAgo } from "@/lib/utils";

const TYPE_CONFIG: Record<string, { icon: any; color: string; bg: string; border: string }> = {
  lost: { icon: Users, color: "#FFE600", bg: "rgba(255,230,0,0.1)", border: "#FFE600" },
  medical: { icon: Heart, color: "#FF3333", bg: "rgba(255,51,51,0.1)", border: "#FF3333" },
  security: { icon: Shield, color: "#BF5FFF", bg: "rgba(191,95,255,0.1)", border: "#BF5FFF" },
  maintenance: { icon: Wrench, color: "#00C6FF", bg: "rgba(0,198,255,0.1)", border: "#00C6FF" },
  crowd: { icon: AlertTriangle, color: "#FF6B00", bg: "rgba(255,107,0,0.1)", border: "#FF6B00" },
};

const PRIORITY_COLORS: Record<string, { border: string; bg: string; color: string }> = {
  low: { border: "rgba(255,255,255,0.2)", bg: "#1A1A1A", color: "#555555" },
  medium: { border: "#FFE600", bg: "rgba(255,230,0,0.12)", color: "#FFE600" },
  high: { border: "#FF3333", bg: "rgba(255,51,51,0.12)", color: "#FF3333" },
  critical: { border: "#FF3333", bg: "rgba(255,51,51,0.2)", color: "#FF3333" },
};

export default function AlertsPage() {
  const { alerts, updateAlertStatus } = useStaffStore();
  const [filter, setFilter] = useState<string>("all");
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredAlerts =
    filter === "all"
      ? alerts
      : filter === "pending"
      ? alerts.filter((a) => a.status === "pending")
      : alerts.filter((a) => a.type === filter);

  return (
    <div className="space-y-5 animate-fade-in max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="comic-label bg-black text-white px-2 py-0.5">ALERTS</span>
            <div className="flex items-center gap-1.5 bg-[#FF3333] px-2 py-0.5 border-2 border-black" style={{ boxShadow: "2px 2px 0 #000" }}>
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="text-[10px] font-black text-white uppercase tracking-wider">
                REAL-TIME STATUS
              </span>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-black" style={{ textShadow: "2px 2px 0 #FF3333" }}>Alert Feed & Dispatch</h1>
          <p className="text-xs mt-1 font-bold text-gray-700 uppercase tracking-widest">
            {alerts.filter((a) => a.status === "pending").length} pending ·{" "}
            {alerts.filter((a) => a.status === "dispatched").length} dispatched ·{" "}
            {alerts.filter((a) => a.status === "resolved").length} resolved
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1" role="tablist">
        {[
          { id: "all", label: "All Alerts", border: "rgba(255,255,255,0.1)" },
          { id: "pending", label: "Pending Only", border: "#FFE600" },
          { id: "lost", label: "Lost Assistance", border: "#FFE600" },
          { id: "medical", label: "Medical Aid", border: "#FF3333" },
          { id: "crowd", label: "Crowd Flow", border: "#FF6B00" },
          { id: "security", label: "Security Guard", border: "#BF5FFF" },
          { id: "maintenance", label: "Maintenance", border: "#00C6FF" },
        ].map(({ id, label, border }) => (
          <button
            key={id}
            onClick={() => setFilter(id)}
            role="tab"
            aria-selected={filter === id}
            className="px-3.5 py-2 rounded-lg text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all duration-150"
            style={{
              background: filter === id ? "#FFE600" : "#111",
              color: filter === id ? "#0A0A0A" : "#5c6bc0",
              border: `2px solid ${filter === id ? "#000" : "rgba(255,255,255,0.06)"}`,
              boxShadow: filter === id ? "2px 2px 0 #000" : "none",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Alert List */}
      <div className="space-y-4" role="list" aria-label="Alerts">
        {filteredAlerts.map((alert) => {
          const config = TYPE_CONFIG[alert.type] || TYPE_CONFIG.crowd;
          const Icon = config.icon;
          const pri = PRIORITY_COLORS[alert.priority] || PRIORITY_COLORS.medium;
          const isCritical = alert.priority === "critical";

          return (
            <div
              key={alert.id}
              className={`rounded-xl p-4 transition-all duration-300 ${alert.status === "resolved" ? "opacity-60" : ""}`}
              style={{
                background: "#FFFFFF",
                border: isCritical && alert.status === "pending" ? "2px solid #FF3333" : `2px solid ${config.border}`,
                boxShadow: isCritical && alert.status === "pending" ? "4px 4px 0 #FF3333" : `4px 4px 0 rgba(0,0,0,0.5)`,
              }}
              role="listitem"
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: config.bg, border: `1px solid ${config.border}30` }}
                >
                  <Icon className="w-5 h-5" style={{ color: config.color }} aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded"
                      style={{ background: config.bg, color: config.color, border: `1px solid ${config.border}40` }}>
                      {alert.type}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-lg text-[9px] font-black border"
                      style={{ background: pri.bg, borderColor: pri.border, color: pri.color }}>
                      {alert.priority.toUpperCase()}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-lg text-[9px] font-black border"
                      style={{
                        background: alert.status === "pending" ? "rgba(255,230,0,0.12)" : alert.status === "dispatched" ? "rgba(0,198,255,0.12)" : "rgba(0,255,135,0.12)",
                        borderColor: alert.status === "pending" ? "#FFE600" : alert.status === "dispatched" ? "#00C6FF" : "#00FF87",
                        color: alert.status === "pending" ? "#FFE600" : alert.status === "dispatched" ? "#00C6FF" : "#00FF87",
                      }}>
                      {alert.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm font-bold mt-1" style={{ color: "#050505" }}>{alert.message}</p>
                  <div className="flex items-center gap-3 mt-2.5 text-xs" style={{ color: "#555555" }}>
                    <span className="flex items-center gap-1 font-semibold">
                      <MapPin className="w-3.5 h-3.5" style={{ color: "#CD7F32" }} /> {alert.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {timeAgo(new Date(alert.timestamp))}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                {alert.status === "pending" && (
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => updateAlertStatus(alert.id, "dispatched")}
                      className="nb-btn nb-btn-blue px-3 py-1.5 rounded-lg text-xs"
                      aria-label={`Dispatch staff for: ${alert.message}`}
                    >
                      <Send className="w-3.5 h-3.5" />
                      Dispatch
                    </button>
                    <button
                      onClick={() => updateAlertStatus(alert.id, "resolved")}
                      className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                      style={{ border: "1px solid rgba(255,255,255,0.06)" }}
                      aria-label="Mark as resolved"
                    >
                      <Check className="w-4 h-4" style={{ color: "#00FF87" }} />
                    </button>
                  </div>
                )}
                {alert.status === "dispatched" && (
                  <button
                    onClick={() => updateAlertStatus(alert.id, "resolved")}
                    className="nb-btn nb-btn-green px-3 py-1.5 rounded-lg text-xs flex-shrink-0"
                    aria-label="Mark as resolved"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Resolve
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {filteredAlerts.length === 0 && (
          <div className="rounded-xl p-8 text-center" style={{ background: "#FFFFFF", border: "2px dashed rgba(255,255,255,0.06)", color: "#3b4480" }}>
            <Check className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm font-bold">No active alerts matching this filter</p>
          </div>
        )}
      </div>
    </div>
  );
}

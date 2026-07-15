"use client";

// ============================================================
// StadiumFlow AI - Alert Feed & Dispatch
// Shows incoming alerts with one-click dispatch actions
// ============================================================

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  MapPin,
  Clock,
  Send,
  Check,
  XCircle,
  Filter,
  Users,
  Wrench,
  Shield,
  Heart,
} from "lucide-react";
import { useStaffStore } from "@/lib/store";
import { timeAgo } from "@/lib/utils";

const TYPE_CONFIG: Record<string, { icon: typeof AlertTriangle; color: string; bg: string }> = {
  lost: { icon: Users, color: "text-accent-amber", bg: "bg-accent-amber/10" },
  medical: { icon: Heart, color: "text-accent-red", bg: "bg-accent-red/10" },
  security: { icon: Shield, color: "text-accent-purple", bg: "bg-accent-purple/10" },
  maintenance: { icon: Wrench, color: "text-accent-cyan", bg: "bg-accent-cyan/10" },
  crowd: { icon: AlertTriangle, color: "text-accent-amber", bg: "bg-accent-amber/10" },
};

const PRIORITY_COLORS: Record<string, string> = {
  low: "bg-navy-700 text-navy-300",
  medium: "bg-accent-amber/20 text-accent-amber",
  high: "bg-accent-red/20 text-accent-red",
  critical: "bg-accent-red/30 text-accent-red animate-pulse",
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
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-accent-amber" />
          Alert Feed
        </h1>
        <p className="text-sm text-navy-400 mt-1">
          {alerts.filter((a) => a.status === "pending").length} pending •{" "}
          {alerts.filter((a) => a.status === "dispatched").length} dispatched •{" "}
          {alerts.filter((a) => a.status === "resolved").length} resolved
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1" role="tablist">
        {[
          { id: "all", label: "All" },
          { id: "pending", label: "Pending" },
          { id: "lost", label: "Lost" },
          { id: "medical", label: "Medical" },
          { id: "crowd", label: "Crowd" },
          { id: "security", label: "Security" },
          { id: "maintenance", label: "Maintenance" },
        ].map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setFilter(id)}
            role="tab"
            aria-selected={filter === id}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              filter === id
                ? "bg-accent-blue/15 text-accent-blue border border-accent-blue/30"
                : "bg-navy-800 text-navy-400 border border-white/5 hover:text-white"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Alert List */}
      <div className="space-y-3" role="list" aria-label="Alerts">
        {filteredAlerts.map((alert) => {
          const config = TYPE_CONFIG[alert.type] || TYPE_CONFIG.crowd;
          const Icon = config.icon;

          return (
            <div
              key={alert.id}
              className={`glass rounded-xl p-4 transition-all duration-300 ${
                alert.status === "resolved" ? "opacity-60" : ""
              } ${
                alert.priority === "critical" && alert.status === "pending"
                  ? "border-accent-red/40 bg-accent-red/5"
                  : ""
              }`}
              role="listitem"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-9 h-9 rounded-lg ${config.bg} flex items-center justify-center flex-shrink-0`}
                >
                  <Icon className={`w-5 h-5 ${config.color}`} aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-white uppercase">
                      {alert.type}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        PRIORITY_COLORS[alert.priority]
                      }`}
                    >
                      {alert.priority.toUpperCase()}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        alert.status === "pending"
                          ? "bg-accent-amber/20 text-accent-amber"
                          : alert.status === "dispatched"
                          ? "bg-accent-blue/20 text-accent-blue"
                          : "bg-electric-500/20 text-electric-400"
                      }`}
                    >
                      {alert.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-navy-100 mt-1">{alert.message}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-navy-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {alert.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {timeAgo(new Date(alert.timestamp))}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                {alert.status === "pending" && (
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => updateAlertStatus(alert.id, "dispatched")}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent-blue/15 text-accent-blue text-xs font-medium hover:bg-accent-blue/25 transition-colors"
                      aria-label={`Dispatch staff for: ${alert.message}`}
                    >
                      <Send className="w-3 h-3" />
                      Dispatch
                    </button>
                    <button
                      onClick={() => updateAlertStatus(alert.id, "resolved")}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-navy-400 hover:text-electric-400 transition-colors"
                      aria-label="Mark as resolved"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                )}
                {alert.status === "dispatched" && (
                  <button
                    onClick={() => updateAlertStatus(alert.id, "resolved")}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-electric-500/15 text-electric-400 text-xs font-medium hover:bg-electric-500/25 transition-colors flex-shrink-0"
                    aria-label="Mark as resolved"
                  >
                    <Check className="w-3 h-3" />
                    Resolve
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {filteredAlerts.length === 0 && (
          <div className="glass rounded-xl p-8 text-center text-navy-400">
            <Check className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p>No alerts matching this filter</p>
          </div>
        )}
      </div>
    </div>
  );
}

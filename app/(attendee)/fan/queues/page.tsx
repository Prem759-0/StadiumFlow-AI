"use client";

// ============================================================
// StadiumFlow AI - Queues & Virtual Queue Page (Neo-Brutalist)
// ============================================================

import { useState } from "react";
import {
  Clock, DoorOpen, UtensilsCrossed, Bath, Car, ShoppingBag, Ticket, X, Zap
} from "lucide-react";
import QueueDisplay from "@/components/queue-display";
import { useStaffStore, useAttendeeStore } from "@/lib/store";
import { formatWaitTime } from "@/lib/utils";

type FilterType = "all" | "entry" | "concession" | "restroom" | "parking" | "merchandise";

const FILTERS: { id: FilterType; label: string; icon: any }[] = [
  { id: "all", label: "All", icon: Clock },
  { id: "entry", label: "Entry Gates", icon: DoorOpen },
  { id: "concession", label: "Food Courts", icon: UtensilsCrossed },
  { id: "restroom", label: "Restrooms", icon: Bath },
  { id: "parking", label: "Parking Zones", icon: Car },
  { id: "merchandise", label: "Merch Stands", icon: ShoppingBag },
];

export default function QueuesPage() {
  const [filter, setFilter] = useState<FilterType>("all");
  const { queues } = useStaffStore();
  const { virtualQueueTickets, removeVirtualQueueTicket } = useAttendeeStore();

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: "#00C6FF", border: "2px solid #000", boxShadow: "3px 3px 0 #000" }}>
          <Clock className="w-5 h-5 text-black" />
        </div>
        <div>
          <h1 className="text-lg font-extrabold" style={{ color: "#050505" }}>Live Queue Predictor</h1>
          <p className="text-xs" style={{ color: "#555555" }}>Real-time wait times & virtual queues</p>
        </div>
        <span className="comic-label ml-auto">LIVE</span>
      </div>

      {/* Virtual Queue Tickets */}
      {virtualQueueTickets.length > 0 && (
        <section aria-labelledby="tickets-title" className="space-y-2">
          <h2 id="tickets-title" className="text-xs font-black uppercase tracking-wider flex items-center gap-2" style={{ color: "#BF5FFF" }}>
            <Ticket className="w-4 h-4" />
            Your Virtual Queue Tickets
          </h2>
          <div className="space-y-2">
            {virtualQueueTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="rounded-xl p-3 flex items-center justify-between animate-bounce-in"
                style={{ background: "#FFFFFF", border: "2px solid #BF5FFF", boxShadow: "3px 3px 0 #BF5FFF" }}
              >
                <div>
                  <p className="text-sm font-extrabold" style={{ color: "#050505" }}>{ticket.queueName}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#555555" }}>
                    Position #{ticket.position} ·{" "}
                    {ticket.status === "waiting"
                      ? `Ready in ~${formatWaitTime(
                          Math.max(
                            1,
                            Math.round((ticket.estimatedReady.getTime() - Date.now()) / 60000)
                          )
                        )}`
                      : "Ready now!"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="px-2.5 py-0.5 rounded-lg text-[10px] font-black border"
                    style={{
                      background: ticket.status === "waiting" ? "rgba(255,230,0,0.12)" : "rgba(0,255,135,0.12)",
                      borderColor: ticket.status === "waiting" ? "#FFE600" : "#00FF87",
                      color: ticket.status === "waiting" ? "#FFE600" : "#00FF87",
                    }}
                  >
                    {ticket.status.toUpperCase()}
                  </span>
                  <button
                    onClick={() => removeVirtualQueueTicket(ticket.id)}
                    className="p-1 rounded-lg hover:bg-white/5 transition-colors"
                    style={{ border: "1px solid rgba(255,255,255,0.06)" }}
                    aria-label={`Leave virtual queue for ${ticket.queueName}`}
                  >
                    <X className="w-4 h-4" style={{ color: "#FF3333" }} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none" role="tablist" aria-label="Queue filter">
        {FILTERS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setFilter(id)}
            role="tab"
            aria-selected={filter === id}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all duration-150"
            style={{
              background: filter === id ? "#00C6FF" : "#111",
              color: filter === id ? "#0A0A0A" : "#5c6bc0",
              border: `2px solid ${filter === id ? "#000" : "rgba(255,255,255,0.06)"}`,
              boxShadow: filter === id ? "2px 2px 0 #000" : "none",
            }}
          >
            <Icon className="w-3.5 h-3.5" aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>

      {/* Queue List */}
      <QueueDisplay
        queues={queues}
        filterType={filter === "all" ? undefined : filter}
        showVirtualQueue={true}
      />
    </div>
  );
}

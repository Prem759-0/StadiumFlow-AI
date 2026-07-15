"use client";

// ============================================================
// StadiumFlow AI - Queues & Virtual Queue Page
// Live queue predictor with filtering and virtual queue join
// ============================================================

import { useState } from "react";
import {
  Clock,
  DoorOpen,
  UtensilsCrossed,
  Bath,
  Car,
  ShoppingBag,
  Ticket,
  X,
} from "lucide-react";
import QueueDisplay from "@/components/queue-display";
import { useStaffStore, useAttendeeStore } from "@/lib/store";
import { formatWaitTime } from "@/lib/utils";

type FilterType = "all" | "entry" | "concession" | "restroom" | "parking" | "merchandise";

const FILTERS: { id: FilterType; label: string; icon: typeof Clock }[] = [
  { id: "all", label: "All", icon: Clock },
  { id: "entry", label: "Entry", icon: DoorOpen },
  { id: "concession", label: "Food", icon: UtensilsCrossed },
  { id: "restroom", label: "Restroom", icon: Bath },
  { id: "parking", label: "Parking", icon: Car },
  { id: "merchandise", label: "Merch", icon: ShoppingBag },
];

export default function QueuesPage() {
  const [filter, setFilter] = useState<FilterType>("all");
  const { queues } = useStaffStore();
  const { virtualQueueTickets, removeVirtualQueueTicket } = useAttendeeStore();

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-accent-cyan/20 flex items-center justify-center">
          <Clock className="w-5 h-5 text-accent-cyan" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white">Live Queue Predictor</h1>
          <p className="text-xs text-navy-400">
            Real-time wait times • Join virtual queues
          </p>
        </div>
      </div>

      {/* Virtual Queue Tickets */}
      {virtualQueueTickets.length > 0 && (
        <section aria-labelledby="tickets-title">
          <h2 id="tickets-title" className="text-sm font-bold text-white mb-2 flex items-center gap-2">
            <Ticket className="w-4 h-4 text-accent-purple" />
            Your Virtual Queue Tickets
          </h2>
          <div className="space-y-2">
            {virtualQueueTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="glass rounded-xl p-3 flex items-center justify-between border-accent-cyan/20 bg-accent-cyan/5"
              >
                <div>
                  <p className="text-sm font-semibold text-white">
                    {ticket.queueName}
                  </p>
                  <p className="text-xs text-navy-300">
                    Position #{ticket.position} •{" "}
                    {ticket.status === "waiting"
                      ? `Ready in ~${formatWaitTime(
                          Math.max(
                            1,
                            Math.round(
                              (ticket.estimatedReady.getTime() - Date.now()) / 60000
                            )
                          )
                        )}`
                      : "Ready now!"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                      ticket.status === "waiting"
                        ? "bg-accent-amber/20 text-accent-amber"
                        : "bg-electric-500/20 text-electric-400"
                    }`}
                  >
                    {ticket.status.toUpperCase()}
                  </span>
                  <button
                    onClick={() => removeVirtualQueueTicket(ticket.id)}
                    className="p-1 rounded hover:bg-white/10"
                    aria-label={`Leave virtual queue for ${ticket.queueName}`}
                  >
                    <X className="w-4 h-4 text-navy-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Queue filter">
        {FILTERS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setFilter(id)}
            role="tab"
            aria-selected={filter === id}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              filter === id
                ? "bg-electric-500/20 text-electric-400 border border-electric-500/30"
                : "bg-navy-800 text-navy-400 border border-white/5 hover:text-white hover:bg-navy-700"
            }`}
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

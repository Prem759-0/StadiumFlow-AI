"use client";

// ============================================================
// StadiumFlow AI - Live Queue Display & Virtual Queue
// Shows real-time wait times with virtual queue join option
// ============================================================

import { useState } from "react";
import {
  Clock,
  Users,
  TrendingUp,
  TrendingDown,
  Minus,
  Ticket,
  Check,
  AlertCircle,
} from "lucide-react";
import { useAttendeeStore } from "@/lib/store";
import { formatWaitTime, getCongestionLevel, generateId } from "@/lib/utils";
import type { QueuePoint } from "@/lib/mock-data";

interface QueueDisplayProps {
  queues: QueuePoint[];
  filterType?: QueuePoint["type"];
  showVirtualQueue?: boolean;
}

export default function QueueDisplay({
  queues,
  filterType,
  showVirtualQueue = true,
}: QueueDisplayProps) {
  const [joinedQueue, setJoinedQueue] = useState<string | null>(null);
  const { addVirtualQueueTicket, virtualQueueTickets, addNotification, addPoints } =
    useAttendeeStore();

  const filteredQueues = filterType
    ? queues.filter((q) => q.type === filterType)
    : queues;

  const sortedQueues = [...filteredQueues].sort(
    (a, b) => a.estimatedWait - b.estimatedWait
  );

  const handleJoinVirtualQueue = (queue: QueuePoint) => {
    const ticket = {
      id: generateId(),
      queueName: queue.name,
      queueType: queue.type,
      position: Math.floor(Math.random() * 10) + 5,
      estimatedReady: new Date(Date.now() + queue.estimatedWait * 60000),
      status: "waiting" as const,
    };

    addVirtualQueueTicket(ticket);
    setJoinedQueue(queue.id);
    addPoints(10);
    addNotification({
      id: generateId(),
      title: "Virtual Queue Joined! 🎫",
      message: `You're #${ticket.position} in line at ${queue.name}. We'll notify you when it's your turn.`,
      type: "info",
      timestamp: new Date(),
      read: false,
    });

    setTimeout(() => setJoinedQueue(null), 3000);
  };

  const getTrend = (queue: QueuePoint) => {
    const diff = queue.arrivalRate - queue.maxServiceRate;
    if (diff > 2) return { icon: TrendingUp, label: "Getting longer", color: "text-accent-red" };
    if (diff < -2) return { icon: TrendingDown, label: "Getting shorter", color: "text-electric-400" };
    return { icon: Minus, label: "Stable", color: "text-navy-300" };
  };

  return (
    <div className="space-y-3" role="list" aria-label="Queue wait times">
      {sortedQueues.map((queue, index) => {
        const trend = getTrend(queue);
        const TrendIcon = trend.icon;
        const congestion = getCongestionLevel(
          (queue.estimatedWait / 20) * 100
        );
        const isJoined =
          joinedQueue === queue.id ||
          virtualQueueTickets.some((t) => t.queueName === queue.name);
        const isBest = index === 0 && sortedQueues.length > 1;

        return (
          <div
            key={queue.id}
            className={`glass rounded-xl p-4 transition-all duration-300 ${
              isBest ? "border-electric-500/30 bg-electric-500/5" : ""
            } ${isJoined ? "border-accent-cyan/30" : ""}`}
            role="listitem"
            aria-label={`${queue.name}: ${formatWaitTime(queue.estimatedWait)} wait, ${queue.currentQueue} people in line`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm text-white truncate">
                    {queue.name}
                  </h3>
                  {isBest && (
                    <span className="flex-shrink-0 px-2 py-0.5 rounded-full bg-electric-500/20 text-electric-400 text-[10px] font-bold">
                      SHORTEST
                    </span>
                  )}
                  {!queue.isOpen && (
                    <span className="flex-shrink-0 px-2 py-0.5 rounded-full bg-accent-red/20 text-accent-red text-[10px] font-bold">
                      CLOSED
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 mt-1.5 text-xs text-navy-300">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" aria-hidden="true" />
                    {queue.currentQueue} in line
                  </span>
                  <span className={`flex items-center gap-1 ${trend.color}`}>
                    <TrendIcon className="w-3 h-3" aria-hidden="true" />
                    {trend.label}
                  </span>
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <div
                  className={`text-lg font-bold tabular-nums ${
                    congestion === "low"
                      ? "text-electric-400"
                      : congestion === "medium"
                      ? "text-accent-amber"
                      : "text-accent-red"
                  }`}
                >
                  <Clock className="w-4 h-4 inline mr-1" aria-hidden="true" />
                  {formatWaitTime(queue.estimatedWait)}
                </div>
              </div>
            </div>

            {/* Wait time bar */}
            <div className="mt-3 h-1.5 rounded-full bg-navy-800 overflow-hidden" aria-hidden="true">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  congestion === "low"
                    ? "bg-electric-500"
                    : congestion === "medium"
                    ? "bg-accent-amber"
                    : "bg-accent-red"
                }`}
                style={{ width: `${Math.min(100, (queue.estimatedWait / 20) * 100)}%` }}
              />
            </div>

            {/* Virtual Queue Button */}
            {showVirtualQueue && queue.isOpen && (
              <div className="mt-3">
                {isJoined ? (
                  <div className="flex items-center gap-2 text-sm text-accent-cyan">
                    <Check className="w-4 h-4" aria-hidden="true" />
                    Virtual queue joined! We&apos;ll notify you.
                  </div>
                ) : (
                  <button
                    onClick={() => handleJoinVirtualQueue(queue)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan text-sm font-medium hover:bg-accent-cyan/20 transition-colors w-full justify-center"
                    aria-label={`Join virtual queue for ${queue.name}`}
                  >
                    <Ticket className="w-4 h-4" aria-hidden="true" />
                    Join Virtual Queue
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}

      {sortedQueues.length === 0 && (
        <div className="glass rounded-xl p-6 text-center text-navy-400">
          <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" aria-hidden="true" />
          <p>No active queues in this category</p>
        </div>
      )}
    </div>
  );
}

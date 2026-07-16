"use client";

// ============================================================
// StadiumFlow AI - Live Queue Display & Virtual Queue
// Neo-Brutalist styling for the wait times
// ============================================================

import { useState } from "react";
import {
  Clock, Users, TrendingUp, TrendingDown, Minus, Ticket, Check, AlertCircle, Zap
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
    if (diff > 2) return { icon: TrendingUp, label: "Getting longer", color: "#FF3333" };
    if (diff < -2) return { icon: TrendingDown, label: "Getting shorter", color: "#00FF87" };
    return { icon: Minus, label: "Stable", color: "#555555" };
  };

  return (
    <div className="space-y-4" role="list" aria-label="Queue wait times">
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

        // Choose Neo-Brutalist color board
        const borderStyle = isJoined 
          ? "2px solid #00C6FF" 
          : isBest 
            ? "2px solid #00FF87" 
            : "2px solid rgba(255,255,255,0.1)";
        
        const shadowColor = isJoined 
          ? "#00C6FF" 
          : isBest 
            ? "#00FF87" 
            : "rgba(0,0,0,0.5)";

        const waitColor = congestion === "low" 
          ? "#00FF87" 
          : congestion === "medium" 
            ? "#FFE600" 
            : "#FF3333";

        return (
          <div
            key={queue.id}
            className="rounded-xl p-4 transition-all duration-150"
            style={{
              background: "#FFFFFF",
              border: borderStyle,
              boxShadow: `4px 4px 0 ${shadowColor}`,
            }}
            role="listitem"
            aria-label={`${queue.name}: ${formatWaitTime(queue.estimatedWait)} wait, ${queue.currentQueue} people in line`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm truncate" style={{ color: "#050505" }}>
                    {queue.name}
                  </h3>
                  {isBest && <span className="comic-label">SHORTEST</span>}
                  {!queue.isOpen && <span className="comic-label" style={{ background: "#FF3333", color: "#fff" }}>CLOSED</span>}
                </div>
                <div className="flex items-center gap-4 mt-2 text-xs" style={{ color: "#555555" }}>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" aria-hidden="true" />
                    {queue.currentQueue} in line
                  </span>
                  <span className="flex items-center gap-1" style={{ color: trend.color }}>
                    <TrendIcon className="w-3.5 h-3.5" aria-hidden="true" />
                    {trend.label}
                  </span>
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <div className="text-sm font-black tabular-nums flex items-center gap-1" style={{ color: waitColor }}>
                  <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                  {formatWaitTime(queue.estimatedWait)}
                </div>
              </div>
            </div>

            {/* Wait time bar */}
            <div className="mt-3.5 h-1.5 rounded-full overflow-hidden" style={{ background: "#FFFFFF" }} aria-hidden="true">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${Math.min(100, (queue.estimatedWait / 20) * 100)}%`,
                  background: waitColor,
                }}
              />
            </div>

            {/* Virtual Queue Button */}
            {showVirtualQueue && queue.isOpen && (
              <div className="mt-3.5">
                {isJoined ? (
                  <div className="flex items-center gap-2 text-xs font-bold" style={{ color: "#00C6FF" }}>
                    <Check className="w-4 h-4" aria-hidden="true" />
                    Virtual queue joined! We will alert you.
                  </div>
                ) : (
                  <button
                    onClick={() => handleJoinVirtualQueue(queue)}
                    className="w-full nb-btn nb-btn-blue py-1.5 rounded-lg text-xs"
                    aria-label={`Join virtual queue for ${queue.name}`}
                  >
                    <Ticket className="w-3.5 h-3.5" aria-hidden="true" />
                    Join Virtual Queue
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}

      {sortedQueues.length === 0 && (
        <div className="rounded-xl p-8 text-center" style={{ background: "#FFFFFF", border: "2px dashed rgba(255,255,255,0.06)", color: "#3b4480" }}>
          <AlertCircle className="w-10 h-10 mx-auto mb-2 opacity-50" aria-hidden="true" />
          <p className="text-sm font-bold">No active queues in this category</p>
        </div>
      )}
    </div>
  );
}

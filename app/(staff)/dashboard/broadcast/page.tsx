"use client";

// ============================================================
// StadiumFlow AI - Broadcast Announcements
// Send announcements to all fans or specific sections
// ============================================================

import { useState } from "react";
import {
  Megaphone,
  Send,
  Users,
  MapPin,
  Clock,
  Check,
} from "lucide-react";
import { useStaffStore } from "@/lib/store";
import { generateId, timeAgo } from "@/lib/utils";

export default function BroadcastPage() {
  const { announcements, addAnnouncement } = useStaffStore();
  const [message, setMessage] = useState("");
  const [target, setTarget] = useState<"all" | "section" | "staff">("all");
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!message.trim()) return;

    addAnnouncement({
      id: generateId(),
      message: message.trim(),
      target,
      timestamp: new Date(),
      sentBy: "Admin",
    });

    setMessage("");
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-accent-cyan" />
          Broadcast Announcements
        </h1>
        <p className="text-sm text-navy-400 mt-1">
          Send real-time announcements to fans and staff
        </p>
      </div>

      {/* Compose */}
      <div className="glass rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-bold text-white">New Announcement</h2>

        {/* Target */}
        <div>
          <label className="text-xs text-navy-400 mb-2 block">Target Audience</label>
          <div className="flex gap-2">
            {[
              { id: "all" as const, label: "All Fans", icon: Users },
              { id: "section" as const, label: "Specific Section", icon: MapPin },
              { id: "staff" as const, label: "Staff Only", icon: Megaphone },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTarget(id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                  target === id
                    ? "bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/30"
                    : "bg-navy-800 text-navy-400 border border-white/5 hover:text-white"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Message */}
        <div>
          <label htmlFor="broadcast-msg" className="text-xs text-navy-400 mb-1 block">
            Message
          </label>
          <textarea
            id="broadcast-msg"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your announcement..."
            rows={3}
            maxLength={280}
            className="w-full px-4 py-3 rounded-lg bg-navy-800 text-white text-sm border border-white/10 focus:border-accent-cyan/50 focus:outline-none resize-none placeholder-navy-500"
            aria-label="Announcement message"
          />
          <p className="text-[10px] text-navy-500 text-right mt-1">
            {message.length}/280
          </p>
        </div>

        {/* Send */}
        <div className="flex items-center justify-between">
          {sent && (
            <span className="text-sm text-electric-400 flex items-center gap-1 animate-fade-in">
              <Check className="w-4 h-4" /> Announcement sent!
            </span>
          )}
          <div className="flex-1" />
          <button
            onClick={handleSend}
            disabled={!message.trim()}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-accent-cyan text-navy-950 font-bold text-sm transition-all hover:bg-accent-cyan/80 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            Broadcast
          </button>
        </div>
      </div>

      {/* History */}
      <div>
        <h2 className="text-sm font-bold text-white mb-3">
          Recent Announcements
        </h2>
        {announcements.length === 0 ? (
          <div className="glass rounded-xl p-6 text-center text-navy-400 text-sm">
            No announcements sent yet
          </div>
        ) : (
          <div className="space-y-2">
            {announcements.map((ann) => (
              <div key={ann.id} className="glass rounded-xl p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-white">{ann.message}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-navy-400">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />{" "}
                        {ann.target === "all"
                          ? "All Fans"
                          : ann.target === "section"
                          ? "Section"
                          : "Staff"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />{" "}
                        {timeAgo(new Date(ann.timestamp))}
                      </span>
                      <span>by {ann.sentBy}</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-electric-500/20 text-electric-400 text-[10px] font-bold flex-shrink-0">
                    SENT
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

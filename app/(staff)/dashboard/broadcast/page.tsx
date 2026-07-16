"use client";

// ============================================================
// StadiumFlow AI - Broadcast Announcements (Neo-Brutalist)
// Send announcements to all fans or specific sections
// ============================================================

import { useState } from "react";
import { Megaphone, Send, Users, MapPin, Clock, Check } from "lucide-react";
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
    <div className="space-y-5 animate-fade-in max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: "#00C6FF", border: "2px solid #000", boxShadow: "3px 3px 0 #000" }}>
          <Megaphone className="w-5 h-5 text-black" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-black" style={{ color: "#050505" }}>Broadcast Announcements</h1>
          <p className="text-xs" style={{ color: "#555555" }}>Push live real-time announcements to attendees and personnel</p>
        </div>
        <span className="comic-label ml-auto" style={{ background: "#FF3333", color: "#fff" }}>PUSH</span>
      </div>

      {/* Compose */}
      <div className="rounded-xl p-5 space-y-4"
        style={{ background: "#FFFFFF", border: "2px solid #00C6FF", boxShadow: "4px 4px 0 #00C6FF" }}>
        <h2 className="text-xs font-black uppercase tracking-wider" style={{ color: "#00C6FF" }}>New Announcement</h2>

        {/* Target Audience */}
        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider mb-2 block" style={{ color: "#555555" }}>Target Audience</label>
          <div className="flex gap-2">
            {[
              { id: "all" as const, label: "All Fans", icon: Users },
              { id: "section" as const, label: "Specific Section", icon: MapPin },
              { id: "staff" as const, label: "Staff Only", icon: Megaphone },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTarget(id)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-150"
                style={{
                  background: target === id ? "#00C6FF" : "#0A0A0A",
                  color: target === id ? "#0A0A0A" : "#5c6bc0",
                  border: `2px solid ${target === id ? "#000" : "rgba(255,255,255,0.06)"}`,
                  boxShadow: target === id ? "2px 2px 0 #000" : "none",
                }}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Message */}
        <div>
          <label htmlFor="broadcast-msg" className="text-[11px] font-bold uppercase tracking-wider mb-1 block" style={{ color: "#555555" }}>
            Message Content
          </label>
          <textarea
            id="broadcast-msg"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your announcement..."
            rows={3}
            maxLength={280}
            className="w-full px-4 py-3 rounded-lg text-sm border-2 placeholder-gray-600 focus:outline-none"
            style={{
              background: "#FFFFFF",
              borderColor: "rgba(255,255,255,0.1)",
              color: "#050505",
            }}
            aria-label="Announcement message"
          />
          <p className="text-[10px] text-right mt-1 font-mono" style={{ color: "#3b4480" }}>
            {message.length}/280
          </p>
        </div>

        {/* Action Row */}
        <div className="flex items-center justify-between">
          {sent && (
            <span className="text-xs font-bold flex items-center gap-1 text-green-400 animate-fade-in">
              <Check className="w-4 h-4" /> Announcement sent!
            </span>
          )}
          <div className="flex-1" />
          <button
            onClick={handleSend}
            disabled={!message.trim()}
            className="nb-btn nb-btn-blue px-6 py-2.5 rounded-lg text-xs"
          >
            <Send className="w-4 h-4" />
            Broadcast
          </button>
        </div>
      </div>

      {/* History */}
      <div>
        <h2 className="text-sm font-black uppercase tracking-wider mb-3" style={{ color: "#050505" }}>Recent Announcements</h2>
        {announcements.length === 0 ? (
          <div className="rounded-xl p-8 text-center" style={{ background: "#FFFFFF", border: "2px dashed rgba(255,255,255,0.06)", color: "#3b4480" }}>
            No announcements sent yet
          </div>
        ) : (
          <div className="space-y-3">
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className="rounded-xl p-4 transition-all"
                style={{ background: "#FFFFFF", border: "2px solid #000", boxShadow: "3px 3px 0 rgba(0,0,0,0.5)" }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold" style={{ color: "#050505" }}>{ann.message}</p>
                    <div className="flex items-center gap-3 mt-2.5 text-xs" style={{ color: "#555555" }}>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {ann.target === "all" ? "All Fans" : ann.target === "section" ? "Section" : "Staff"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {timeAgo(new Date(ann.timestamp))}
                      </span>
                      <span>by {ann.sentBy}</span>
                    </div>
                  </div>
                  <span className="comic-label" style={{ background: "#00FF87", color: "#000" }}>SENT</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

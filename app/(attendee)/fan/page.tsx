"use client";

// ============================================================
// StadiumFlow AI - Fan Home Page (Neo-Brutalist Redesign)
// Main attendee dashboard with heatmap, trivia, SOS, countdown
// ============================================================

import { useState, useEffect } from "react";
import {
  Navigation,
  Clock,
  ShoppingBag,
  AlertTriangle,
  ChevronRight,
  Flame,
  Vote,
  Gift,
  MapPin,
  Siren,
  Zap,
} from "lucide-react";
import Link from "next/link";
import StadiumMap from "@/components/stadium-map";
import ScoreTicker from "@/components/score-ticker";
import QueueDisplay from "@/components/queue-display";
import MatchCountdown from "@/components/match-countdown";
import TriviaCard from "@/components/trivia-card";
import { useStaffStore, useAttendeeStore } from "@/lib/store";
import { matchInfo, promotionalOffers } from "@/lib/mock-data";
import { generateId } from "@/lib/utils";

const POLL_OPTIONS = [
  { id: "opt1", label: "Brazil wins!" },
  { id: "opt2", label: "Argentina FTW" },
  { id: "opt3", label: "Draw & Extra Time" },
  { id: "opt4", label: "Penalty Shootout" },
];

const QUICK_ACTIONS = [
  { href: "/fan/navigate", icon: Navigation, label: "AI Route", desc: "Smart paths", color: "#00FF87", border: "#00FF87" },
  { href: "/fan/queues", icon: Clock, label: "Live Queues", desc: "Wait times", color: "#00C6FF", border: "#00C6FF" },
  { href: "/fan/preorder", icon: ShoppingBag, label: "Pre-Order", desc: "Skip the line", color: "#BF5FFF", border: "#BF5FFF" },
];

export default function FanHomePage() {
  const { zones, queues } = useStaffStore();
  const { profile, addNotification, addPoints, pollVote, setPollVote } = useAttendeeStore();
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [helpSent, setHelpSent] = useState(false);
  const [sosShaking, setSosShaking] = useState(false);
  const [activePromo, setActivePromo] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActivePromo((prev) => (prev + 1) % promotionalOffers.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const handleHelp = () => {
    setSosShaking(true);
    setTimeout(() => setSosShaking(false), 500);
    setHelpSent(true);
    const { addAlert } = useStaffStore.getState();
    addAlert({
      id: `alert-${generateId()}`,
      type: "lost",
      message: `SOS: ${profile.name} needs help — ${profile.seatSection} Row ${profile.seatRow} Seat ${profile.seatNumber}`,
      location: profile.seatSection,
      zoneId: "sec-n1",
      timestamp: new Date(),
      status: "pending",
      priority: "high",
    });
    addNotification({
      id: generateId(),
      title: "Help Request Sent!",
      message: "A staff member has been notified and is on their way to your seat.",
      type: "alert",
      timestamp: new Date(),
      read: false,
    });
    setTimeout(() => setHelpSent(false), 5000);
  };

  const handleVote = (option: string) => {
    setPollVote(option);
    addPoints(25);
    addNotification({
      id: generateId(),
      title: "Vote Submitted!",
      message: "+25 points earned for participating!",
      type: "reward",
      timestamp: new Date(),
      read: false,
    });
  };

  const promo = promotionalOffers[activePromo];
  const topQueues = [...queues].sort((a, b) => a.estimatedWait - b.estimatedWait).slice(0, 3);

  return (
    <div className="space-y-4 animate-fade-in">

      {/* ── Live Score Ticker ── */}
      <ScoreTicker />

      {/* ── Match Countdown ── */}
      <MatchCountdown />

      {/* ── Promo Banner ── */}
      <div
        className="rounded-xl p-3 flex items-center gap-3"
        style={{ background: "#FFFFFF", border: "2px solid #FFE600", boxShadow: "3px 3px 0 #FFE600" }}
      >
        <Gift className="w-5 h-5 flex-shrink-0" style={{ color: "#FFE600" }} aria-hidden="true" />
        <div className="min-w-0">
          <p className="text-sm font-bold" style={{ color: "#FFE600" }}>{promo.title}</p>
          <p className="text-xs" style={{ color: "#555555" }}>{promo.description}</p>
        </div>
        <span className="comic-label ml-auto flex-shrink-0">OFFER</span>
      </div>

      {/* ── Stadium Heatmap ── */}
      <section aria-labelledby="heatmap-title">
        <div className="flex items-center justify-between mb-2">
          <h2 id="heatmap-title" className="text-sm font-bold flex items-center gap-2" style={{ color: "#050505" }}>
            <Flame className="w-4 h-4" style={{ color: "#FF3333" }} aria-hidden="true" />
            Live Crowd Heatmap
          </h2>
          <span className="text-[10px] pulse-dot" style={{ color: "#555555" }}>
            &nbsp;&nbsp;Updated live
          </span>
        </div>
        <div
          className="rounded-xl p-2 aspect-square max-h-80 comic-panel bg-white"
          style={{ background: "#FFFFFF", border: "2px solid #000", boxShadow: "4px 4px 0 rgba(0,0,0,0.5)" }}
        >
          <StadiumMap
            zones={zones}
            selectedZone={selectedZone}
            onZoneClick={setSelectedZone}
            className="w-full h-full"
          />
        </div>
        {selectedZone && (
          <div
            className="mt-2 rounded-lg p-3 animate-fade-in"
            style={{ background: "#FFFFFF", border: "2px solid #00C6FF", boxShadow: "3px 3px 0 #00C6FF" }}
          >
            {(() => {
              const zone = zones.find((z) => z.id === selectedZone);
              if (!zone) return null;
              const pct = Math.round((zone.currentOccupancy / zone.capacity) * 100);
              const color = pct < 40 ? "#00FF87" : pct < 70 ? "#FFE600" : "#FF3333";
              return (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold" style={{ color: "#050505" }}>{zone.name}</p>
                    <p className="text-xs" style={{ color: "#555555" }}>
                      {zone.currentOccupancy.toLocaleString()} / {zone.capacity.toLocaleString()} fans
                    </p>
                  </div>
                  <div className="text-3xl font-black tabular-nums" style={{ color }}>{pct}%</div>
                </div>
              );
            })()}
          </div>
        )}
      </section>

      {/* ── Quick Actions Grid ── */}
      <section aria-labelledby="actions-title">
        <h2 id="actions-title" className="text-sm font-bold mb-2" style={{ color: "#050505" }}>
          Quick Actions
        </h2>
        <div className="grid grid-cols-3 gap-2 mb-2">
          {QUICK_ACTIONS.map(({ href, icon: Icon, label, desc, color, border }) => (
            <Link
              key={href}
              href={href}
              className="rounded-xl p-3 flex flex-col items-center gap-1.5 text-center transition-all duration-150"
              style={{
                background: "#FFFFFF",
                border: `2px solid ${border}`,
                boxShadow: `4px 4px 0 ${border}`,
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = `2px 2px 0 ${border}`;
                (e.currentTarget as HTMLElement).style.transform = "translate(2px, 2px)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = `4px 4px 0 ${border}`;
                (e.currentTarget as HTMLElement).style.transform = "translate(0,0)";
              }}
            >
              <Icon className="w-6 h-6" style={{ color }} aria-hidden="true" />
              <span className="text-xs font-bold" style={{ color: "#050505" }}>{label}</span>
              <span className="text-[9px]" style={{ color: "#555555" }}>{desc}</span>
            </Link>
          ))}
        </div>

        {/* SOS Button — full width */}
        <button
          id="sos-help-button"
          onClick={handleHelp}
          disabled={helpSent}
          className={`w-full rounded-xl p-4 flex items-center justify-center gap-3 font-black text-sm uppercase tracking-widest transition-all duration-150 ${sosShaking ? "animate-shake" : ""}`}
          style={{
            background: helpSent ? "#0A2A0A" : "#FF3333",
            border: `3px solid ${helpSent ? "#00FF87" : "#000"}`,
            boxShadow: helpSent ? `4px 4px 0 #00FF87` : `4px 4px 0 #000`,
            color: helpSent ? "#00FF87" : "#F5F0E8",
            ...(helpSent ? {} : { animation: "sos-pulse 1.5s ease-in-out infinite" }),
          }}
          aria-label={helpSent ? "Help sent, staff is on the way" : "Send SOS help request to staff"}
        >
          {helpSent ? (
            <>
              <Zap className="w-5 h-5" />
              Help Sent! Staff On The Way
            </>
          ) : (
            <>
              <Siren className="w-5 h-5" />
              SOS — I Need Help
              <span className="text-xs font-normal opacity-70 capitalize">Seat {profile.seatSection}-{profile.seatRow}-{profile.seatNumber}</span>
            </>
          )}
        </button>
      </section>

      {/* ── FIFA Trivia ── */}
      <TriviaCard />

      {/* ── Shortest Queues ── */}
      <section aria-labelledby="queues-title">
        <div className="flex items-center justify-between mb-2">
          <h2 id="queues-title" className="text-sm font-bold" style={{ color: "#050505" }}>
            Shortest Queues Now
          </h2>
          <Link href="/fan/queues" className="flex items-center gap-1 text-xs font-bold hover:opacity-70 transition-opacity" style={{ color: "#00FF87" }}>
            View All <ChevronRight className="w-3 h-3" aria-hidden="true" />
          </Link>
        </div>
        <QueueDisplay queues={topQueues} showVirtualQueue={false} />
      </section>

      {/* ── Fan Poll ── */}
      <section
        aria-labelledby="poll-title"
        className="rounded-xl p-4 comic-panel bg-white"
        style={{ background: "#FFFFFF", border: "2px solid #BF5FFF", boxShadow: "4px 4px 0 #BF5FFF" }}
      >
        <h2 id="poll-title" className="text-sm font-bold flex items-center gap-2 mb-3" style={{ color: "#BF5FFF" }}>
          <Vote className="w-4 h-4" aria-hidden="true" />
          Match Prediction Poll
          <span className="comic-label ml-auto">+25 PTS</span>
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {POLL_OPTIONS.map((option) => (
            <button
              key={option.id}
              onClick={() => handleVote(option.id)}
              disabled={!!pollVote}
              className="px-3 py-2.5 rounded-lg text-xs font-bold border-2 transition-all duration-150"
              style={{
                background: pollVote === option.id ? "rgba(191,95,255,0.2)" : pollVote ? "rgba(255,255,255,0.03)" : "#0A0A0A",
                borderColor: pollVote === option.id ? "#BF5FFF" : "rgba(255,255,255,0.1)",
                color: pollVote === option.id ? "#BF5FFF" : pollVote ? "#3b4480" : "#F5F0E8",
                boxShadow: pollVote === option.id ? "2px 2px 0 #BF5FFF" : "none",
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
        {pollVote && (
          <p className="text-[10px] text-center mt-2 font-bold" style={{ color: "#BF5FFF" }}>
            Voted! Results revealed after the match.
          </p>
        )}
      </section>

      {/* ── Seat Info ── */}
      <section
        className="rounded-xl p-4"
        style={{ background: "#FFFFFF", border: "2px solid #000", boxShadow: "3px 3px 0 rgba(0,0,0,0.5)" }}
      >
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4" style={{ color: "#00FF87" }} aria-hidden="true" />
          <span style={{ color: "#555555" }}>Your Seat:</span>
          <span className="font-extrabold" style={{ color: "#050505" }}>
            {profile.seatSection}, Row {profile.seatRow}, Seat {profile.seatNumber}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs mt-1" style={{ color: "#3b4480" }}>
          <span>🎫 {profile.ticketType.toUpperCase()}</span>
          <span>•</span>
          <span>🚪 {profile.entryGate}</span>
        </div>
      </section>
    </div>
  );
}

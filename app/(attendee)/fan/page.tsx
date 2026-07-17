"use client";

// ============================================================
// StadiumFlow AI - Fan Home Page (Neo-Brutalist Redesign)
// Main attendee dashboard with heatmap, trivia, SOS, countdown
// ============================================================

import { useState, useEffect, useRef } from "react";
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
  Volume2,
  Activity,
  Camera,
  X,
  Scan,
  Trophy
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
  { href: "/fan/navigate", icon: Navigation, label: "AI Route", desc: "Smart paths", bg: "#00FF87" },
  { href: "/fan/queues", icon: Clock, label: "Live Queues", desc: "Wait times", bg: "#00C6FF" },
  { href: "/fan/preorder", icon: ShoppingBag, label: "Pre-Order", desc: "Skip the line", bg: "#BF5FFF" },
  { href: "#", icon: Scan, label: "AR Hunt", desc: "Scan for merch", bg: "#FFE600", onClick: true },
];

export default function FanHomePage() {
  const { zones, queues } = useStaffStore();
  const { profile, addNotification, addPoints, pollVote, setPollVote } = useAttendeeStore();
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [helpSent, setHelpSent] = useState(false);
  const [sosShaking, setSosShaking] = useState(false);
  const [activePromo, setActivePromo] = useState(0);
  
  // Hype Meter state
  const [hypeLevel, setHypeLevel] = useState(85);
  const [isGoal, setIsGoal] = useState(false);

  // Fan Cam state
  const [showFanCam, setShowFanCam] = useState(false);
  const [fanCamVibe, setFanCamVibe] = useState("");
  const [cameraError, setCameraError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    
    if (showFanCam) {
      setCameraError(false);
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({ video: { facingMode: "user" } })
          .then((s) => {
            stream = s;
            if (videoRef.current) {
              videoRef.current.srcObject = s;
              videoRef.current.play();
            }
          })
          .catch((err) => {
            /* log removed */
            setCameraError(true);
          });
      } else {
        /* log removed */
        setCameraError(true);
      }
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [showFanCam]);

  // AR Scavenger Hunt state
  const [showArHunt, setShowArHunt] = useState(false);
  const [arResult, setArResult] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setActivePromo((prev) => (prev + 1) % promotionalOffers.length);
    }, 8000);
    
    // Simulate live decibel tracking
    const hypeInterval = setInterval(() => {
      setHypeLevel(prev => {
        // Fluctuate between 80 and 115
        const newLevel = Math.max(80, Math.min(115, prev + (Math.random() * 12 - 6)));
        if (newLevel > 110 && !isGoal) {
          setIsGoal(true);
          setTimeout(() => setIsGoal(false), 3000);
        }
        return newLevel;
      });
    }, 1200);

    return () => {
      clearInterval(timer);
      clearInterval(hypeInterval);
    };
  }, [isGoal]);

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
        className="rounded-xl p-3 flex items-center gap-3 comic-panel bg-[#FFE600] transition-transform hover:-translate-y-1 hover:shadow-[6px_6px_0_#000]"
        style={{ border: "3px solid #000", boxShadow: "4px 4px 0 #000" }}
      >
        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0" style={{ border: "2px solid #000" }}>
          <Gift className="w-4 h-4 text-black" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-black text-black">{promo.title}</p>
          <p className="text-[10px] font-bold text-black uppercase tracking-wider">{promo.description}</p>
        </div>
        <span className="comic-label ml-auto flex-shrink-0 bg-white text-black">OFFER</span>
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
            className="mt-2 rounded-xl p-3 animate-fade-in"
            style={{ background: "#FFFFFF", border: "3px solid #000", boxShadow: "4px 4px 0 #000" }}
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
        <div className="grid grid-cols-2 gap-2 mb-2">
          {QUICK_ACTIONS.map(({ href, icon: Icon, label, desc, bg, onClick }) => {
            const inner = (
              <div
                className="w-full rounded-xl p-3 flex flex-col items-center gap-1.5 text-center transition-all duration-150 active:translate-y-1 hover:-translate-y-1 cursor-pointer"
                style={{
                  background: bg,
                  border: `3px solid #000`,
                  boxShadow: `4px 4px 0 #000`,
                }}
              >
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border-2 border-black">
                  <Icon className="w-4 h-4 text-black" aria-hidden="true" />
                </div>
                <span className="text-xs font-black text-black leading-tight uppercase tracking-wider">{label}</span>
                <span className="text-[9px] font-bold text-black/70">{desc}</span>
              </div>
            );

            if (onClick) {
              return (
                <button
                  key={href}
                  onClick={(e) => {
                    e.preventDefault();
                    setShowArHunt(true);
                    setArResult("");
                    setTimeout(() => {
                      setArResult("RARE MERCH DROP FOUND! +500 PTS");
                    }, 3000);
                  }}
                  className="w-full text-left"
                >
                  {inner}
                </button>
              );
            }

            return (
              <Link key={href} href={href} className="w-full">
                {inner}
              </Link>
            );
          })}
        </div>

        {/* Fan Cam Button */}
        <button
          onClick={() => {
            setShowFanCam(true);
            setFanCamVibe("");
            setTimeout(() => {
              setFanCamVibe("100% HYPED! ⚡");
            }, 2000);
          }}
          className="w-full rounded-xl p-4 flex items-center justify-center gap-3 font-black text-sm uppercase tracking-widest transition-transform hover:-translate-y-1 mb-2"
          style={{ background: "#FFE600", border: "4px solid #000", boxShadow: "6px 6px 0 #000", color: "#000" }}
        >
          <Camera className="w-6 h-6 animate-pulse text-[#FF3333]" />
          Open Jumbotron Fan Cam
        </button>

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

      {/* ── Live Hype Meter ── */}
      <section 
        className={`rounded-xl p-4 comic-panel relative overflow-hidden transition-all duration-300 ${isGoal ? 'animate-shake' : ''}`}
        style={{ 
          background: isGoal ? "#FFE600" : "#FFFFFF",
          border: "4px solid #000", 
          boxShadow: "6px 6px 0 #000" 
        }}
      >
        {isGoal && (
          <div className="absolute inset-0 bg-[#FF3333] opacity-20 animate-pulse pointer-events-none" />
        )}
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2" style={{ color: "#000" }}>
              <Volume2 className={`w-5 h-5 ${isGoal ? 'animate-bounce text-[#FF3333]' : ''}`} />
              Live Match Hype
            </h2>
            <span className="text-xl font-black tabular-nums" style={{ color: isGoal ? "#FF3333" : "#000" }}>
              {Math.round(hypeLevel)}<span className="text-[10px] uppercase ml-1">dB</span>
            </span>
          </div>

          <div className="h-6 w-full border-2 border-black rounded-full bg-[#F5F0E8] overflow-hidden relative">
            <div 
              className="h-full transition-all duration-500 ease-out border-r-2 border-black"
              style={{ 
                width: `${Math.min(100, ((hypeLevel - 80) / 40) * 100)}%`,
                background: isGoal 
                  ? "repeating-linear-gradient(45deg, #FF3333, #FF3333 10px, #FFE600 10px, #FFE600 20px)"
                  : "linear-gradient(90deg, #00FF87, #FFE600, #FF3333)"
              }}
            />
          </div>
          
          <div className="flex justify-between mt-1 px-1">
            <span className="text-[9px] font-bold uppercase" style={{ color: "#555" }}>Normal</span>
            <span className="text-[9px] font-bold uppercase" style={{ color: "#FF3333" }}>GOAL!</span>
          </div>
        </div>
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
        style={{ border: "3px solid #000", boxShadow: "6px 6px 0 #000" }}
      >
        <h2 id="poll-title" className="text-sm font-black flex items-center gap-2 mb-3 text-black">
          <Vote className="w-4 h-4" aria-hidden="true" />
          Match Prediction Poll
          <span className="comic-label ml-auto bg-[#BF5FFF] text-white">+25 PTS</span>
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {POLL_OPTIONS.map((option) => (
            <button
              key={option.id}
              onClick={() => handleVote(option.id)}
              disabled={!!pollVote}
              className="px-3 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-150"
              style={{
                background: pollVote === option.id ? "#BF5FFF" : pollVote ? "#f0f0f0" : "#FFFFFF",
                borderColor: "#000",
                borderWidth: "3px",
                color: pollVote === option.id ? "#fff" : pollVote ? "#a0a0a0" : "#000",
                boxShadow: pollVote === option.id ? "none" : pollVote ? "none" : "3px 3px 0 #000",
                transform: pollVote === option.id ? "translate(3px, 3px)" : "none"
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
        style={{ background: "#FFFFFF", border: "3px solid #000", boxShadow: "6px 6px 0 #000" }}
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

      {/* Fan Cam Modal */}
      {showFanCam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-white border-8 border-black shadow-[12px_12px_0_#FFE600] overflow-hidden relative comic-panel animate-bounce-in flex flex-col">
            {/* Header */}
            <div className="p-3 bg-[#00FF87] border-b-8 border-black flex justify-between items-center z-10">
              <h3 className="font-black text-black uppercase tracking-widest text-lg flex items-center gap-2">
                <Camera className="w-5 h-5" /> Live Fan Cam
              </h3>
              <button 
                onClick={() => setShowFanCam(false)}
                className="w-8 h-8 bg-[#FF3333] border-4 border-black flex items-center justify-center hover:bg-black hover:text-[#FF3333] transition-colors"
              >
                <X className="w-4 h-4 font-black" />
              </button>
            </div>
            
            {/* Camera Viewport */}
            <div className="aspect-[3/4] bg-black relative flex items-center justify-center overflow-hidden border-b-8 border-black">
              {/* Real Camera Feed */}
              <video 
                ref={videoRef} 
                className="absolute inset-0 w-full h-full object-cover" 
                playsInline 
                muted 
              />
              
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at center, #ffffff 0%, transparent 100%)" }} />
              
              {cameraError ? (
                <div className="text-center z-10 bg-[#FF3333] border-4 border-black p-4 m-4 rotate-2 shadow-[8px_8px_0_#000]">
                  <Siren className="w-12 h-12 text-black mx-auto mb-2 animate-pulse" />
                  <p className="text-black font-black uppercase tracking-widest text-lg">Camera Access Denied</p>
                  <p className="text-white font-bold text-xs mt-2 uppercase">Please allow camera permissions or use a secure HTTPS connection.</p>
                </div>
              ) : !fanCamVibe ? (
                <div className="text-center z-10">
                  <div className="w-16 h-16 border-4 border-dashed border-[#FFE600] rounded-full mx-auto animate-[spin_3s_linear_infinite]" />
                  <p className="mt-4 text-[#FFE600] font-black uppercase tracking-widest text-sm animate-pulse">Gemini Analyzing Vibe...</p>
                </div>
              ) : (
                <div className="z-10 text-center animate-bounce-in w-full h-full flex flex-col justify-end p-6">
                  {/* Comic Stickers */}
                  <div className="absolute top-6 left-4 text-4xl -rotate-12 drop-shadow-[2px_2px_0_#000]">🔥</div>
                  <div className="absolute top-12 right-6 text-5xl rotate-12 drop-shadow-[2px_2px_0_#000]">⚡</div>
                  <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-48 h-48 border-[6px] border-[#FFE600] rounded-full opacity-50 shadow-[0_0_20px_#FFE600]" />
                  
                  {/* Vibe Check Banner */}
                  <div className="bg-[#FF3333] border-4 border-black p-3 -rotate-3 shadow-[8px_8px_0_#000]">
                    <p className="text-white font-black text-2xl uppercase italic tracking-tighter">Gemini Says:</p>
                    <p className="text-[#FFE600] font-black text-3xl uppercase tracking-widest drop-shadow-[2px_2px_0_#000]">{fanCamVibe}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* AR Scavenger Hunt Modal */}
      {showArHunt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-transparent border-4 border-dashed border-[#FFE600] relative flex flex-col justify-between h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="p-4 flex justify-between items-center z-10 bg-black/50 backdrop-blur-sm">
              <h3 className="font-black text-[#FFE600] uppercase tracking-widest text-lg flex items-center gap-2">
                <Scan className="w-5 h-5 animate-pulse text-[#00FF87]" /> AR Hunt
              </h3>
              <button 
                onClick={() => setShowArHunt(false)}
                className="w-8 h-8 bg-white border-2 border-black flex items-center justify-center hover:bg-[#FF3333] transition-colors"
              >
                <X className="w-4 h-4 font-black text-black" />
              </button>
            </div>
            
            {/* Scanner Viewport */}
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
              <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMSIgZmlsbD0iI0ZGRTYwMCIvPjwvc3ZnPg==')] animate-[pan_10s_linear_infinite]" />
              
              {!arResult ? (
                <div className="text-center z-10 flex flex-col items-center">
                  <div className="w-48 h-48 border-[8px] border-[#00FF87] opacity-50 relative animate-[spin_4s_linear_infinite]">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white -translate-x-2 -translate-y-2" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white translate-x-2 -translate-y-2" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white -translate-x-2 translate-y-2" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white translate-x-2 translate-y-2" />
                  </div>
                  <div className="mt-8 bg-black border-2 border-[#00FF87] p-2">
                    <p className="text-[#00FF87] font-black uppercase tracking-widest text-sm animate-pulse">Scanning Stadium...</p>
                  </div>
                </div>
              ) : (
                <div className="z-10 text-center animate-bounce-in flex flex-col items-center justify-center h-full p-6">
                  {/* Loot Box Glow */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#BF5FFF] rounded-full blur-[60px] opacity-60 animate-pulse" />
                  
                  {/* Found Item */}
                  <div className="relative mb-8">
                    <Trophy className="w-32 h-32 text-[#FFE600] drop-shadow-[0_0_15px_#FFE600] animate-bounce" />
                    <div className="absolute -top-4 -right-4 text-4xl animate-[spin_3s_linear_infinite]">✨</div>
                  </div>
                  
                  {/* Reward Banner */}
                  <div className="bg-[#BF5FFF] border-4 border-black p-4 shadow-[8px_8px_0_#000] rotate-2">
                    <p className="text-white font-black text-2xl uppercase tracking-tighter mb-1">LOOT FOUND!</p>
                    <p className="text-[#FFE600] font-black text-xl uppercase tracking-widest drop-shadow-[2px_2px_0_#000]">{arResult}</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="p-4 z-10 bg-black/50 backdrop-blur-sm text-center">
              <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest">Move camera around to find hidden drops</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

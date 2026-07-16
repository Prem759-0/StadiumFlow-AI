"use client";

// ============================================================
// StadiumFlow AI - Staff Admin Dashboard Layout (Neo-Brutalist)
// ============================================================

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, AlertTriangle, Brain, Megaphone, ArrowLeft, Activity
} from "lucide-react";
import { startSimulation, stopSimulation } from "@/lib/simulation";
import { initializeFirebase, listenToAllRealTimeServices } from "@/lib/firebase";
import { subscribe, PUBSUB_TOPICS, type PubSubMessage } from "@/lib/pubsub";
import { startCloudFunctions, stopCloudFunctions } from "@/lib/cloud-functions";
import { useStaffStore } from "@/lib/store";
import AuthGuard from "@/components/auth-guard";
import { ErrorBoundary } from "@/components/error-boundary";
import UserAuthButton from "@/components/user-auth-button";
import { StadiumZone, QueuePoint, Alert } from "@/lib/mock-data";

const SIDEBAR_ITEMS = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/dashboard/alerts", icon: AlertTriangle, label: "Alerts" },
  { href: "/dashboard/predictions", icon: Brain, label: "AI Predictions" },
  { href: "/dashboard/broadcast", icon: Megaphone, label: "Broadcast" },
];

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const { addAlert, updateZones, updateQueues } = useStaffStore();

  useEffect(() => {
    setMounted(true);
    startSimulation();

    // Initialize Firebase
    initializeFirebase();

    // Start Cloud Functions (scheduled crowd predictions + safety analysis)
    startCloudFunctions();

    // Initialize real-time listeners for staff dashboard
    const unsubAll = listenToAllRealTimeServices(
      (zones) => updateZones(zones as any[] as StadiumZone[]),
      (queues) => updateQueues(queues as any[] as QueuePoint[]),
      (alerts) => {
        alerts.forEach((a) => {
          const exists = useStaffStore.getState().alerts.some((sa) => sa.id === a.id);
          if (!exists) addAlert(a as any as Alert);
        });
      }
    );

    // Subscribe to Pub/Sub fan help requests for instant staff alerts
    const unsubHelp = subscribe(PUBSUB_TOPICS.FAN_HELP_REQUESTS, (msg: PubSubMessage) => {
      addAlert({
        id: `help-${Date.now()}`,
        type: "lost",
        message: (msg.data.message as string) || "Fan requesting assistance",
        location: (msg.data.location as string) || "Unknown",
        zoneId: (msg.data.zoneId as string) || "unknown",
        timestamp: new Date(),
        status: "pending",
        priority: "high",
      });
    });

    // Subscribe to crowd alerts from Cloud Functions
    const unsubCrowd = subscribe(PUBSUB_TOPICS.CROWD_ALERTS, (msg: PubSubMessage) => {
      addAlert({
        id: `crowd-${Date.now()}`,
        type: "crowd",
        message: (msg.data.message as string) || "Crowd alert",
        location: (msg.data.zoneId as string) || "Unknown Zone",
        zoneId: (msg.data.zoneId as string) || "unknown",
        timestamp: new Date(),
        status: "pending",
        priority: "critical",
      });
    });

    // Register service worker correctly (allowed on https or localhost)
    const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    if ("serviceWorker" in navigator && (window.location.protocol === "https:" || isLocalhost)) {
      navigator.serviceWorker.register("/sw.js").catch((err) => {
        console.warn("[SW] Registration failed:", err);
      });
    }

    return () => {
      stopSimulation();
      stopCloudFunctions();
      unsubHelp();
      unsubCrowd();
      unsubAll();
    };
  }, [addAlert, updateZones, updateQueues]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <AuthGuard requiredRole="staff">
      <div className="min-h-screen flex">
        {/* Sidebar — Neo-Brutalist */}
        <aside
          className="w-64 flex flex-col hidden md:flex flex-shrink-0"
          style={{
            background: "#FFFFFF",
            borderRight: "2px solid rgba(255,255,255,0.1)",
          }}
          role="navigation"
          aria-label="Staff navigation"
        >
          <div className="p-4" style={{ borderBottom: "2px solid rgba(255,255,255,0.06)" }}>
            <div className="flex items-center gap-2">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center font-black"
                style={{ background: "#00C6FF", color: "#0A0A0A", border: "2px solid #000", boxShadow: "2px 2px 0 #000" }}
              >
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-sm font-extrabold" style={{ color: "#050505" }}>Staff Dashboard</h1>
                <p className="text-[10px] uppercase font-bold" style={{ color: "#00C6FF" }}>StadiumFlow AI</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-3 space-y-2">
            {SIDEBAR_ITEMS.map(({ href, icon: Icon, label }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-black uppercase tracking-wider transition-all duration-150"
                  style={{
                    background: isActive ? "rgba(0,198,255,0.08)" : "transparent",
                    color: isActive ? "#00C6FF" : "#5c6bc0",
                    border: `2px solid ${isActive ? "#00C6FF" : "transparent"}`,
                  }}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="p-3 space-y-2" style={{ borderTop: "2px solid rgba(255,255,255,0.06)" }}>
            <div className="px-3 py-1">
              <UserAuthButton mode="staff" />
            </div>
            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors hover:text-black"
              style={{ color: "#555555" }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </aside>

        {/* Mobile Header — Neo-Brutalist */}
        <div
          className="md:hidden fixed top-0 left-0 right-0 z-40 px-4 py-3 flex-shrink-0"
          style={{
            background: "#FFFFFF",
            borderBottom: "2px solid #00C6FF",
            boxShadow: "0 4px 0 rgba(0,198,255,0.12)",
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center font-black"
                style={{ background: "#00C6FF", color: "#0A0A0A", border: "2px solid #000", boxShadow: "1px 1px 0 #000" }}
              >
                <Activity className="w-4 h-4" />
              </div>
              <span className="text-sm font-extrabold" style={{ color: "#050505" }}>Staff Dashboard</span>
            </div>
            <Link href="/" className="text-xs font-bold uppercase tracking-widest text-red-400 hover:text-black">
              ← Exit
            </Link>
          </div>
          {/* Mobile nav tabs */}
          <div className="flex gap-1.5 mt-3 overflow-x-auto scrollbar-none pb-0.5">
            {SIDEBAR_ITEMS.map(({ href, icon: Icon, label }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-all"
                  style={{
                    background: isActive ? "rgba(0,198,255,0.12)" : "transparent",
                    color: isActive ? "#00C6FF" : "#5c6bc0",
                    border: `1.5px solid ${isActive ? "#00C6FF" : "transparent"}`,
                  }}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <main id="main-content" className="flex-1 p-4 md:p-6 overflow-y-auto mt-24 md:mt-0" role="main">
          <ErrorBoundary sectionName="Staff Dashboard">
            {children}
          </ErrorBoundary>
        </main>
      </div>
    </AuthGuard>
  );
}

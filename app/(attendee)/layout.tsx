"use client";

// ============================================================
// StadiumFlow AI - Attendee Layout
// Mobile-first layout with bottom navigation
// Integrates Firebase Auth, real-time Firestore listeners,
// and Cloud Pub/Sub for fan coordination
// ============================================================

import { useEffect, useState, lazy, Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import {
  Home,
  MapPin,
  Clock,
  Navigation,
  Accessibility,
  Globe,
  Trophy,
  CloudSun,
} from "lucide-react";
import { useAttendeeStore, useStaffStore } from "@/lib/store";
import { startSimulation, stopSimulation } from "@/lib/simulation";
import { initializeFirebase, listenToAllRealTimeServices } from "@/lib/firebase";
import { subscribe, PUBSUB_TOPICS, type PubSubMessage } from "@/lib/pubsub";
import AuthGuard from "@/components/auth-guard";
import { ErrorBoundary } from "@/components/error-boundary";
import LanguageSwitcher from "@/components/language-switcher";
import { StadiumZone, QueuePoint, Alert } from "@/lib/mock-data";

/** Dynamic import for ChatAssistant to optimize bundle size */
const ChatAssistant = lazy(() => import("@/components/chat-assistant"));

const NAV_ITEMS = [
  { href: "/fan", icon: Home, labelKey: "dashboard", defaultLabel: "Home" },
  { href: "/fan/navigate", icon: Navigation, labelKey: "navigation", defaultLabel: "Navigate" },
  { href: "/fan/queues", icon: Clock, labelKey: "crowd", defaultLabel: "Queues" },
  { href: "/fan/leaderboard", icon: Trophy, labelKey: "fanExperience", defaultLabel: "Ranks" },
  { href: "/fan/weather", icon: CloudSun, labelKey: "sustainability", defaultLabel: "Weather" },
];

export default function AttendeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { t } = useTranslation();
  const { profile, isAccessibilityMode, toggleAccessibility, notifications, addNotification } =
    useAttendeeStore();
  const { updateZones, updateQueues, addAlert } = useStaffStore();
  const unreadCount = notifications.filter((n) => !n.read).length;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    startSimulation();

    // Initialize Firebase
    initializeFirebase();

    // Initialize real-time listeners to keep global store synced with Firestore
    const unsubAll = listenToAllRealTimeServices(
      (zones) => updateZones(zones as any[] as StadiumZone[]),
      (queues) => updateQueues(queues as any[] as QueuePoint[]),
      (alerts) => {
        alerts.forEach((a) => {
          // Only add alert if it doesn't exist in store to avoid duplicates
          const exists = useStaffStore.getState().alerts.some((sa) => sa.id === a.id);
          if (!exists) addAlert(a as any as Alert);
        });
      }
    );

    // Subscribe to Pub/Sub queue updates for instant notifications
    const unsubQueue = subscribe(PUBSUB_TOPICS.QUEUE_UPDATES, (msg: PubSubMessage) => {
      if (msg.data.type === "almost-ready") {
        addNotification({
          id: `q-${Date.now()}`,
          title: "Queue Update 🎉",
          message: msg.data.message as string,
          type: "info",
          timestamp: new Date(),
          read: false,
        });
      }
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
      unsubQueue();
      unsubAll();
    };
  }, [addNotification, updateZones, updateQueues, addAlert]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-electric-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen pb-20 ${isAccessibilityMode ? "high-contrast" : ""}`}>
      {/* Top Bar — Neo-Brutalist */}
      <header
        className="sticky top-0 z-40 px-4 py-3 flex items-center justify-between"
        style={{
          background: "#FFFFFF",
          borderBottom: "4px solid #000000",
        }}
      >
        <div className="flex items-center gap-2">
          {/* Logo mark */}
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center font-extrabold text-xs"
            style={{ background: "#00FF87", color: "#0A0A0A", border: "2px solid #000", boxShadow: "2px 2px 0 #000" }}
          >
            SF
          </div>
          <div>
            <h1 className="text-sm font-extrabold" style={{ color: "#050505" }}>StadiumFlow AI</h1>
            <p className="text-[10px]" style={{ color: "#555555" }}>
              {profile.seatSection} · Row {profile.seatRow} · Seat {profile.seatNumber}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Staff Dashboard Toggle */}
          <Link
            href="/dashboard"
            className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:-translate-y-1 active:translate-y-1"
            style={{
              background: "#00C6FF",
              color: "#000",
              border: "2px solid #000",
              boxShadow: "3px 3px 0 #000"
            }}
          >
            {t('nav.admin', 'Staff Mode')}
          </Link>
          {/* Language Switcher */}
          <LanguageSwitcher />
          {/* Accessibility toggle */}
          <button
            onClick={toggleAccessibility}
            className="p-2 rounded-xl transition-colors hover:-translate-y-1 hover:shadow-[4px_4px_0_#000]"
            style={{
              background: isAccessibilityMode ? "#00FF87" : "#FFFFFF",
              border: "3px solid #000000",
              color: isAccessibilityMode ? "#0A0A0A" : "#050505",
              boxShadow: isAccessibilityMode ? "4px 4px 0 #000" : "none",
            }}
            aria-label={`Accessibility mode: ${isAccessibilityMode ? "On" : "Off"}`}
            aria-pressed={isAccessibilityMode}
          >
            <Accessibility className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Page Content */}
      <main id="main-content" className="px-4 py-4" role="main">
        <ErrorBoundary sectionName="Fan Dashboard">
          {children}
        </ErrorBoundary>
      </main>

      {/* Chat FAB - lazy loaded for efficiency */}
      <Suspense fallback={null}>
        <ErrorBoundary sectionName="Chat Assistant">
          <ChatAssistant />
        </ErrorBoundary>
      </Suspense>

      {/* Bottom Navigation — Neo-Brutalist */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40"
        style={{
          background: "#FFFFFF",
          borderTop: "4px solid #000000",
        }}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-around px-2 py-2 max-w-lg mx-auto">
          {NAV_ITEMS.map(({ href, icon: Icon, labelKey, defaultLabel }) => {
            const isActive = pathname === href;
            const translatedLabel = t(`nav.${labelKey}`, defaultLabel);
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 ${isActive ? 'scale-110' : 'hover:-translate-y-1'}`}
                style={{
                  color: isActive ? "#000" : "#555555",
                  background: isActive ? "#00FF87" : "transparent",
                  border: isActive ? "3px solid #000" : "3px solid transparent",
                  boxShadow: isActive ? "4px 4px 0 #000" : "none",
                }}
                aria-current={isActive ? "page" : undefined}
                aria-label={translatedLabel}
              >
                <Icon className="w-5 h-5" aria-hidden="true" />
                <span className="text-[10px] font-bold">{translatedLabel}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

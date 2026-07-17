// ============================================================
// StadiumFlow AI - Zustand State Management
// Global state for attendee and staff views
// ============================================================

import { create } from "zustand";
import {
  type StadiumZone,
  type QueuePoint,
  type Alert,
  type AttendeeProfile,
  stadiumZones,
  queuePoints,
  defaultAttendee,
  matchInfo as initialMatchInfo,
} from "./mock-data";
import type { GeminiChatMessage } from "./gemini";

/**
 * Represents the global state for an Attendee (Fan) user.
 * Manages chat history, navigation, queue tickets, and general UI toggles.
 */
interface AttendeeState {
  profile: AttendeeProfile;
  currentLocation: string;
  chatHistory: GeminiChatMessage[];
  isAccessibilityMode: boolean;
  isChatOpen: boolean;
  virtualQueueTickets: VirtualQueueTicket[];
  preOrders: PreOrder[];
  notifications: AppNotification[];
  pollVote: string | null;
  // Actions
  setCurrentLocation: (location: string) => void;
  addChatMessage: (msg: GeminiChatMessage) => void;
  toggleAccessibility: () => void;
  toggleChat: () => void;
  addVirtualQueueTicket: (ticket: VirtualQueueTicket) => void;
  removeVirtualQueueTicket: (id: string) => void;
  addPreOrder: (order: PreOrder) => void;
  addNotification: (notification: AppNotification) => void;
  dismissNotification: (id: string) => void;
  addPoints: (points: number) => void;
  setPollVote: (option: string) => void;
}

interface VirtualQueueTicket {
  id: string;
  queueName: string;
  queueType: string;
  position: number;
  estimatedReady: Date;
  status: "waiting" | "ready" | "expired";
}

interface PreOrder {
  id: string;
  vendorName: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  pickupTime: Date;
  status: "preparing" | "ready" | "picked_up";
}

interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: "info" | "promo" | "alert" | "reward";
  timestamp: Date;
  read: boolean;
}

export const useAttendeeStore = create<AttendeeState>((set) => ({
  profile: defaultAttendee,
  currentLocation: "gate-a-node",
  chatHistory: [],
  isAccessibilityMode: false,
  isChatOpen: false,
  virtualQueueTickets: [],
  preOrders: [],
  notifications: [
    {
      id: "n-welcome",
      title: "Welcome to the Stadium! 🏟️",
      message: "India vs Australia ODI is live! Use StadiumFlow AI to navigate, skip queues, and enjoy the match.",
      type: "info",
      timestamp: new Date(),
      read: false,
    },
  ],
  pollVote: null,

  setCurrentLocation: (location) => set({ currentLocation: location }),
  addChatMessage: (msg) =>
    set((state) => ({ chatHistory: [...state.chatHistory, msg] })),
  toggleAccessibility: () =>
    set((state) => ({ isAccessibilityMode: !state.isAccessibilityMode })),
  toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),
  addVirtualQueueTicket: (ticket) =>
    set((state) => ({
      virtualQueueTickets: [...state.virtualQueueTickets, ticket],
    })),
  removeVirtualQueueTicket: (id) =>
    set((state) => ({
      virtualQueueTickets: state.virtualQueueTickets.filter((t) => t.id !== id),
    })),
  addPreOrder: (order) =>
    set((state) => ({ preOrders: [...state.preOrders, order] })),
  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
    })),
  dismissNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
  addPoints: (points) =>
    set((state) => ({
      profile: { ...state.profile, points: state.profile.points + points },
    })),
  setPollVote: (option) => set({ pollVote: option }),
}));

// ---- Staff Store ----
/**
 * Represents the global state for a Staff member.
 * Manages AI predictions, active crowds/zones, and real-time alerts.
 */
interface StaffState {
  zones: StadiumZone[];
  queues: QueuePoint[];
  alerts: Alert[];
  announcements: Announcement[];
  matchInfo: typeof initialMatchInfo;
  aiPredictions: string[];
  metrics: DashboardMetrics;
  isSimulationRunning: boolean;
  // Actions
  updateZones: (zones: StadiumZone[]) => void;
  updateQueues: (queues: QueuePoint[]) => void;
  addAlert: (alert: Alert) => void;
  updateAlertStatus: (id: string, status: Alert["status"]) => void;
  addAnnouncement: (announcement: Announcement) => void;
  setAIPredictions: (predictions: string[]) => void;
  updateMetrics: (metrics: Partial<DashboardMetrics>) => void;
  toggleSimulation: () => void;
  toggleZoneLockdown: (zoneId: string) => void;
}

interface Announcement {
  id: string;
  message: string;
  target: "all" | "section" | "staff";
  timestamp: Date;
  sentBy: string;
}

interface DashboardMetrics {
  totalAttendees: number;
  avgWaitTime: number;
  congestionHotspots: number;
  alertsActive: number;
  waitTimeReduction: number;
  throughputIncrease: number;
  crowdFlowScore: number;
}

export const useStaffStore = create<StaffState>((set) => ({
  zones: stadiumZones,
  queues: queuePoints,
  alerts: [
    {
      id: "alert-1",
      type: "lost",
      message: "Family with children lost near South Concourse",
      location: "South Concourse West",
      zoneId: "conc-s1",
      timestamp: new Date(Date.now() - 120000),
      status: "pending",
      priority: "high",
    },
    {
      id: "alert-2",
      type: "crowd",
      message: "Gate D approaching capacity limit",
      location: "Gate D (West)",
      zoneId: "gate-d",
      timestamp: new Date(Date.now() - 300000),
      status: "dispatched",
      priority: "critical",
    },
    {
      id: "alert-3",
      type: "maintenance",
      message: "Restroom S1 needs cleaning supplies refill",
      location: "Restroom S1",
      zoneId: "rest-s1",
      timestamp: new Date(Date.now() - 600000),
      status: "pending",
      priority: "low",
    },
  ],
  announcements: [],
  matchInfo: initialMatchInfo,
  aiPredictions: [
    "⚠️ Gate D will experience 12-min surge in 15 minutes",
    "📈 South Food Court queue trending upward - expect 10+ min wait",
    "✅ East Concourse clearing up - crowds returning to seats",
    "🅿️ Parking A exit congestion will peak at match end",
  ],
  metrics: {
    totalAttendees: 98500,
    avgWaitTime: 6.2,
    congestionHotspots: 3,
    alertsActive: 2,
    waitTimeReduction: 32,
    throughputIncrease: 28,
    crowdFlowScore: 87,
  },
  isSimulationRunning: true,

  updateZones: (zones) => set({ zones }),
  updateQueues: (queues) => set({ queues }),
  addAlert: (alert) => set((state) => ({ alerts: [alert, ...state.alerts] })),
  updateAlertStatus: (id, status) =>
    set((state) => ({
      alerts: state.alerts.map((a) => (a.id === id ? { ...a, status } : a)),
    })),
  addAnnouncement: (announcement) =>
    set((state) => ({
      announcements: [announcement, ...state.announcements],
    })),
  setAIPredictions: (predictions) => set({ aiPredictions: predictions }),
  updateMetrics: (metrics) =>
    set((state) => ({
      metrics: { ...state.metrics, ...metrics },
    })),
  toggleSimulation: () =>
    set((state) => ({ isSimulationRunning: !state.isSimulationRunning })),
  toggleZoneLockdown: (zoneId: string) =>
    set((state) => ({
      zones: state.zones.map((z) =>
        z.id === zoneId ? { ...z, isLockedDown: !z.isLockedDown } : z
      ),
    })),
}));

export type {
  VirtualQueueTicket,
  PreOrder,
  AppNotification,
  Announcement,
  DashboardMetrics,
};

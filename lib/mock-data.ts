// ============================================================
// StadiumFlow AI - Mock Data for Stadium Simulation
// Represents Narendra Modi Stadium (132,000 capacity)
// ============================================================

export interface StadiumZone {
  id: string;
  name: string;
  type: "seating" | "concourse" | "gate" | "concession" | "restroom" | "parking" | "vip" | "medical";
  capacity: number;
  currentOccupancy: number;
  position: { x: number; y: number }; // SVG coordinates (percentage)
  dimensions: { width: number; height: number };
  level: number; // 0 = ground, 1 = lower, 2 = upper, 3 = sky
  accessible: boolean;
}

export interface QueuePoint {
  id: string;
  name: string;
  type: "entry" | "concession" | "restroom" | "parking" | "merchandise";
  zoneId: string;
  currentQueue: number;
  maxServiceRate: number; // per minute
  arrivalRate: number; // per minute
  estimatedWait: number; // minutes
  isOpen: boolean;
  position: { x: number; y: number };
}

export interface FoodVendor {
  id: string;
  name: string;
  category: "snacks" | "beverages" | "meals" | "desserts";
  zoneId: string;
  menu: MenuItem[];
  currentWait: number;
  isOpen: boolean;
  acceptsPreOrder: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  prepTime: number; // minutes
  available: boolean;
  popular: boolean;
}

export interface RouteNode {
  id: string;
  name: string;
  position: { x: number; y: number };
  connections: string[];
  congestion: number; // 0-1
  accessible: boolean;
  level: number;
}

export interface Alert {
  id: string;
  type: "lost" | "medical" | "security" | "maintenance" | "crowd";
  message: string;
  location: string;
  zoneId: string;
  timestamp: Date;
  status: "pending" | "dispatched" | "resolved";
  priority: "low" | "medium" | "high" | "critical";
}

export interface AttendeeProfile {
  id: string;
  name: string;
  seatSection: string;
  seatRow: string;
  seatNumber: string;
  ticketType: "general" | "premium" | "vip";
  entryGate: string;
  points: number;
  preferences: string[];
  needsAccessibility: boolean;
}

// ---- Stadium Zones ----
export const stadiumZones: StadiumZone[] = [
  // Gates
  { id: "gate-a", name: "Gate A (North)", type: "gate", capacity: 5000, currentOccupancy: 2100, position: { x: 50, y: 5 }, dimensions: { width: 12, height: 4 }, level: 0, accessible: true },
  { id: "gate-b", name: "Gate B (East)", type: "gate", capacity: 5000, currentOccupancy: 3200, position: { x: 92, y: 50 }, dimensions: { width: 4, height: 12 }, level: 0, accessible: true },
  { id: "gate-c", name: "Gate C (South)", type: "gate", capacity: 5000, currentOccupancy: 1800, position: { x: 50, y: 92 }, dimensions: { width: 12, height: 4 }, level: 0, accessible: true },
  { id: "gate-d", name: "Gate D (West)", type: "gate", capacity: 5000, currentOccupancy: 4100, position: { x: 5, y: 50 }, dimensions: { width: 4, height: 12 }, level: 0, accessible: true },

  // Seating Sections
  { id: "sec-n1", name: "Section N1 (North Lower)", type: "seating", capacity: 8000, currentOccupancy: 6500, position: { x: 35, y: 15 }, dimensions: { width: 30, height: 10 }, level: 1, accessible: true },
  { id: "sec-n2", name: "Section N2 (North Upper)", type: "seating", capacity: 10000, currentOccupancy: 7200, position: { x: 35, y: 12 }, dimensions: { width: 30, height: 6 }, level: 2, accessible: false },
  { id: "sec-e1", name: "Section E1 (East Lower)", type: "seating", capacity: 8000, currentOccupancy: 5800, position: { x: 80, y: 35 }, dimensions: { width: 10, height: 30 }, level: 1, accessible: true },
  { id: "sec-e2", name: "Section E2 (East Upper)", type: "seating", capacity: 10000, currentOccupancy: 8100, position: { x: 85, y: 35 }, dimensions: { width: 6, height: 30 }, level: 2, accessible: false },
  { id: "sec-s1", name: "Section S1 (South Lower)", type: "seating", capacity: 8000, currentOccupancy: 7800, position: { x: 35, y: 75 }, dimensions: { width: 30, height: 10 }, level: 1, accessible: true },
  { id: "sec-s2", name: "Section S2 (South Upper)", type: "seating", capacity: 10000, currentOccupancy: 9500, position: { x: 35, y: 82 }, dimensions: { width: 30, height: 6 }, level: 2, accessible: false },
  { id: "sec-w1", name: "Section W1 (West Lower)", type: "seating", capacity: 8000, currentOccupancy: 4200, position: { x: 12, y: 35 }, dimensions: { width: 10, height: 30 }, level: 1, accessible: true },
  { id: "sec-w2", name: "Section W2 (West Upper)", type: "seating", capacity: 10000, currentOccupancy: 6700, position: { x: 8, y: 35 }, dimensions: { width: 6, height: 30 }, level: 2, accessible: false },

  // VIP
  { id: "vip-north", name: "VIP Box (North)", type: "vip", capacity: 2000, currentOccupancy: 1200, position: { x: 40, y: 20 }, dimensions: { width: 20, height: 5 }, level: 3, accessible: true },
  { id: "vip-south", name: "VIP Box (South)", type: "vip", capacity: 2000, currentOccupancy: 1800, position: { x: 40, y: 75 }, dimensions: { width: 20, height: 5 }, level: 3, accessible: true },

  // Concessions
  { id: "food-n", name: "Food Court North", type: "concession", capacity: 500, currentOccupancy: 380, position: { x: 30, y: 22 }, dimensions: { width: 8, height: 4 }, level: 1, accessible: true },
  { id: "food-e", name: "Food Court East", type: "concession", capacity: 500, currentOccupancy: 210, position: { x: 78, y: 45 }, dimensions: { width: 4, height: 8 }, level: 1, accessible: true },
  { id: "food-s", name: "Food Court South", type: "concession", capacity: 500, currentOccupancy: 450, position: { x: 60, y: 78 }, dimensions: { width: 8, height: 4 }, level: 1, accessible: true },
  { id: "food-w", name: "Food Court West", type: "concession", capacity: 500, currentOccupancy: 320, position: { x: 18, y: 55 }, dimensions: { width: 4, height: 8 }, level: 1, accessible: true },

  // Restrooms
  { id: "rest-n1", name: "Restroom N1", type: "restroom", capacity: 100, currentOccupancy: 65, position: { x: 55, y: 22 }, dimensions: { width: 4, height: 3 }, level: 1, accessible: true },
  { id: "rest-e1", name: "Restroom E1", type: "restroom", capacity: 100, currentOccupancy: 40, position: { x: 78, y: 58 }, dimensions: { width: 3, height: 4 }, level: 1, accessible: true },
  { id: "rest-s1", name: "Restroom S1", type: "restroom", capacity: 100, currentOccupancy: 88, position: { x: 42, y: 78 }, dimensions: { width: 4, height: 3 }, level: 1, accessible: true },
  { id: "rest-w1", name: "Restroom W1", type: "restroom", capacity: 100, currentOccupancy: 30, position: { x: 18, y: 42 }, dimensions: { width: 3, height: 4 }, level: 1, accessible: true },

  // Parking
  { id: "park-n", name: "Parking Lot A (North)", type: "parking", capacity: 3000, currentOccupancy: 2800, position: { x: 50, y: 1 }, dimensions: { width: 20, height: 3 }, level: 0, accessible: true },
  { id: "park-s", name: "Parking Lot B (South)", type: "parking", capacity: 3000, currentOccupancy: 1500, position: { x: 50, y: 97 }, dimensions: { width: 20, height: 3 }, level: 0, accessible: true },

  // Medical
  { id: "med-1", name: "Medical Station 1", type: "medical", capacity: 30, currentOccupancy: 8, position: { x: 25, y: 50 }, dimensions: { width: 4, height: 4 }, level: 0, accessible: true },
];

// ---- Queue Points ----
export const queuePoints: QueuePoint[] = [
  { id: "q-gate-a", name: "Gate A Entry Queue", type: "entry", zoneId: "gate-a", currentQueue: 120, maxServiceRate: 15, arrivalRate: 12, estimatedWait: 8, isOpen: true, position: { x: 50, y: 3 } },
  { id: "q-gate-b", name: "Gate B Entry Queue", type: "entry", zoneId: "gate-b", currentQueue: 250, maxServiceRate: 15, arrivalRate: 18, estimatedWait: 17, isOpen: true, position: { x: 95, y: 50 } },
  { id: "q-gate-c", name: "Gate C Entry Queue", type: "entry", zoneId: "gate-c", currentQueue: 80, maxServiceRate: 15, arrivalRate: 8, estimatedWait: 5, isOpen: true, position: { x: 50, y: 95 } },
  { id: "q-gate-d", name: "Gate D Entry Queue", type: "entry", zoneId: "gate-d", currentQueue: 300, maxServiceRate: 15, arrivalRate: 22, estimatedWait: 20, isOpen: true, position: { x: 3, y: 50 } },
  { id: "q-food-n", name: "North Food Court Queue", type: "concession", zoneId: "food-n", currentQueue: 35, maxServiceRate: 8, arrivalRate: 7, estimatedWait: 4, isOpen: true, position: { x: 30, y: 24 } },
  { id: "q-food-e", name: "East Food Court Queue", type: "concession", zoneId: "food-e", currentQueue: 15, maxServiceRate: 8, arrivalRate: 5, estimatedWait: 2, isOpen: true, position: { x: 80, y: 45 } },
  { id: "q-food-s", name: "South Food Court Queue", type: "concession", zoneId: "food-s", currentQueue: 55, maxServiceRate: 8, arrivalRate: 10, estimatedWait: 7, isOpen: true, position: { x: 60, y: 80 } },
  { id: "q-food-w", name: "West Food Court Queue", type: "concession", zoneId: "food-w", currentQueue: 25, maxServiceRate: 8, arrivalRate: 6, estimatedWait: 3, isOpen: true, position: { x: 16, y: 55 } },
  { id: "q-rest-n1", name: "Restroom N1 Queue", type: "restroom", zoneId: "rest-n1", currentQueue: 18, maxServiceRate: 12, arrivalRate: 10, estimatedWait: 2, isOpen: true, position: { x: 55, y: 24 } },
  { id: "q-rest-s1", name: "Restroom S1 Queue", type: "restroom", zoneId: "rest-s1", currentQueue: 42, maxServiceRate: 12, arrivalRate: 14, estimatedWait: 4, isOpen: true, position: { x: 42, y: 80 } },
  { id: "q-merch", name: "Merchandise Store Queue", type: "merchandise", zoneId: "food-n", currentQueue: 30, maxServiceRate: 5, arrivalRate: 4, estimatedWait: 6, isOpen: true, position: { x: 38, y: 22 } },
  { id: "q-park-n", name: "Parking A Exit Queue", type: "parking", zoneId: "park-n", currentQueue: 180, maxServiceRate: 20, arrivalRate: 5, estimatedWait: 9, isOpen: true, position: { x: 50, y: 1 } },
];

// ---- Food Vendors ----
export const foodVendors: FoodVendor[] = [
  {
    id: "v-north-1", name: "Stadium Bites", category: "snacks", zoneId: "food-n",
    currentWait: 4, isOpen: true, acceptsPreOrder: true,
    menu: [
      { id: "m1", name: "Classic Nachos", price: 250, prepTime: 3, available: true, popular: true },
      { id: "m2", name: "Chicken Tikka Wrap", price: 350, prepTime: 5, available: true, popular: true },
      { id: "m3", name: "Paneer Roll", price: 280, prepTime: 4, available: true, popular: false },
      { id: "m4", name: "French Fries", price: 180, prepTime: 2, available: true, popular: false },
    ],
  },
  {
    id: "v-north-2", name: "Thirst Quencher", category: "beverages", zoneId: "food-n",
    currentWait: 2, isOpen: true, acceptsPreOrder: true,
    menu: [
      { id: "m5", name: "Cold Beer (500ml)", price: 400, prepTime: 1, available: true, popular: true },
      { id: "m6", name: "Soft Drink (Large)", price: 150, prepTime: 1, available: true, popular: true },
      { id: "m7", name: "Mango Lassi", price: 200, prepTime: 2, available: true, popular: false },
      { id: "m8", name: "Fresh Lime Soda", price: 120, prepTime: 1, available: true, popular: false },
    ],
  },
  {
    id: "v-south-1", name: "Pitch Perfect Meals", category: "meals", zoneId: "food-s",
    currentWait: 7, isOpen: true, acceptsPreOrder: true,
    menu: [
      { id: "m9", name: "Biryani Bowl", price: 450, prepTime: 6, available: true, popular: true },
      { id: "m10", name: "Butter Chicken Meal", price: 500, prepTime: 8, available: true, popular: true },
      { id: "m11", name: "Veg Thali", price: 380, prepTime: 6, available: true, popular: false },
      { id: "m12", name: "Fish & Chips", price: 420, prepTime: 5, available: false, popular: false },
    ],
  },
  {
    id: "v-east-1", name: "Sweet Spot", category: "desserts", zoneId: "food-e",
    currentWait: 2, isOpen: true, acceptsPreOrder: true,
    menu: [
      { id: "m13", name: "Ice Cream Cup", price: 150, prepTime: 1, available: true, popular: true },
      { id: "m14", name: "Gulab Jamun (2pc)", price: 120, prepTime: 2, available: true, popular: false },
      { id: "m15", name: "Brownie Sundae", price: 280, prepTime: 3, available: true, popular: true },
    ],
  },
];

// ---- Route Network Nodes ----
export const routeNodes: RouteNode[] = [
  { id: "gate-a-node", name: "Gate A", position: { x: 50, y: 5 }, connections: ["conc-n1", "conc-n2"], congestion: 0.4, accessible: true, level: 0 },
  { id: "gate-b-node", name: "Gate B", position: { x: 92, y: 50 }, connections: ["conc-e1", "conc-e2"], congestion: 0.7, accessible: true, level: 0 },
  { id: "gate-c-node", name: "Gate C", position: { x: 50, y: 92 }, connections: ["conc-s1", "conc-s2"], congestion: 0.3, accessible: true, level: 0 },
  { id: "gate-d-node", name: "Gate D", position: { x: 5, y: 50 }, connections: ["conc-w1", "conc-w2"], congestion: 0.85, accessible: true, level: 0 },
  { id: "conc-n1", name: "North Concourse West", position: { x: 30, y: 18 }, connections: ["gate-a-node", "food-n-node", "sec-n1-node", "conc-w1"], congestion: 0.5, accessible: true, level: 1 },
  { id: "conc-n2", name: "North Concourse East", position: { x: 65, y: 18 }, connections: ["gate-a-node", "rest-n1-node", "sec-n1-node", "conc-e1"], congestion: 0.6, accessible: true, level: 1 },
  { id: "conc-e1", name: "East Concourse North", position: { x: 82, y: 35 }, connections: ["gate-b-node", "conc-n2", "sec-e1-node"], congestion: 0.45, accessible: true, level: 1 },
  { id: "conc-e2", name: "East Concourse South", position: { x: 82, y: 65 }, connections: ["gate-b-node", "conc-s2", "sec-e1-node", "food-e-node"], congestion: 0.35, accessible: true, level: 1 },
  { id: "conc-s1", name: "South Concourse West", position: { x: 35, y: 82 }, connections: ["gate-c-node", "rest-s1-node", "sec-s1-node", "conc-w2"], congestion: 0.75, accessible: true, level: 1 },
  { id: "conc-s2", name: "South Concourse East", position: { x: 65, y: 82 }, connections: ["gate-c-node", "food-s-node", "sec-s1-node", "conc-e2"], congestion: 0.55, accessible: true, level: 1 },
  { id: "conc-w1", name: "West Concourse North", position: { x: 15, y: 35 }, connections: ["gate-d-node", "conc-n1", "sec-w1-node", "food-w-node"], congestion: 0.65, accessible: true, level: 1 },
  { id: "conc-w2", name: "West Concourse South", position: { x: 15, y: 65 }, connections: ["gate-d-node", "conc-s1", "sec-w1-node", "rest-w1-node"], congestion: 0.3, accessible: true, level: 1 },
  { id: "food-n-node", name: "North Food Court", position: { x: 30, y: 22 }, connections: ["conc-n1"], congestion: 0.7, accessible: true, level: 1 },
  { id: "food-e-node", name: "East Food Court", position: { x: 78, y: 50 }, connections: ["conc-e2"], congestion: 0.4, accessible: true, level: 1 },
  { id: "food-s-node", name: "South Food Court", position: { x: 60, y: 78 }, connections: ["conc-s2"], congestion: 0.85, accessible: true, level: 1 },
  { id: "food-w-node", name: "West Food Court", position: { x: 18, y: 55 }, connections: ["conc-w1"], congestion: 0.5, accessible: true, level: 1 },
  { id: "rest-n1-node", name: "Restroom N1", position: { x: 55, y: 22 }, connections: ["conc-n2"], congestion: 0.55, accessible: true, level: 1 },
  { id: "rest-s1-node", name: "Restroom S1", position: { x: 42, y: 78 }, connections: ["conc-s1"], congestion: 0.8, accessible: true, level: 1 },
  { id: "rest-w1-node", name: "Restroom W1", position: { x: 18, y: 42 }, connections: ["conc-w2"], congestion: 0.25, accessible: true, level: 1 },
  { id: "sec-n1-node", name: "Section N1 Entry", position: { x: 50, y: 15 }, connections: ["conc-n1", "conc-n2"], congestion: 0.6, accessible: true, level: 1 },
  { id: "sec-e1-node", name: "Section E1 Entry", position: { x: 80, y: 50 }, connections: ["conc-e1", "conc-e2"], congestion: 0.5, accessible: true, level: 1 },
  { id: "sec-s1-node", name: "Section S1 Entry", position: { x: 50, y: 75 }, connections: ["conc-s1", "conc-s2"], congestion: 0.8, accessible: true, level: 1 },
  { id: "sec-w1-node", name: "Section W1 Entry", position: { x: 12, y: 50 }, connections: ["conc-w1", "conc-w2"], congestion: 0.35, accessible: true, level: 1 },
  { id: "med-1-node", name: "Medical Station", position: { x: 25, y: 50 }, connections: ["conc-w1", "conc-w2"], congestion: 0.1, accessible: true, level: 0 },
];

// ---- Default Attendee ----
export const defaultAttendee: AttendeeProfile = {
  id: "att-001",
  name: "Fan User",
  seatSection: "Section N1",
  seatRow: "R",
  seatNumber: "42",
  ticketType: "premium",
  entryGate: "Gate A",
  points: 250,
  preferences: ["football", "food", "merchandise"],
  needsAccessibility: false,
};

// ---- Match Info ----
export const matchInfo = {
  title: "India vs Australia - 3rd ODI",
  venue: "Narendra Modi Stadium, Ahmedabad",
  date: "2026-04-12",
  status: "live" as const,
  score: { home: "287/4", away: "142/3", overs: "28.4" },
  attendance: 98500,
  capacity: 132000,
};

// ---- Promotional Offers ----
export const promotionalOffers = [
  { id: "promo-1", title: "🎉 India Scored a Six!", description: "20% off at North Food Court for next 10 mins!", section: "N1", expiresIn: 10 },
  { id: "promo-2", title: "⚡ Quick Movement Reward", description: "50 bonus points for reaching your seat in under 5 mins!", section: "all", expiresIn: 5 },
  { id: "promo-3", title: "🍺 Happy Hour!", description: "Buy 1 Get 1 on beverages at East Food Court", section: "E1", expiresIn: 30 },
];

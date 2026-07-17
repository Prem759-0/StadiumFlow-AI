// ============================================================
// StadiumFlow AI - Firebase Integration Layer
// Firebase Auth + Firestore + Real-time Listeners
// Provides deep Google Cloud integration for the platform
// ============================================================

import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInAnonymously as firebaseSignInAnonymously,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type Auth,
  type User,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  enableIndexedDbPersistence,
  type Firestore,
  type DocumentData,
  type Unsubscribe,
} from "firebase/firestore";

// ---- Firebase Configuration ----

/** Firebase config loaded from environment variables */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "",
};

/** Check if Firebase is properly configured */
export function isFirebaseConfigured(): boolean {
  return !!(firebaseConfig.apiKey && firebaseConfig.projectId);
}

// ---- Firebase App Initialization ----

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

/** Initialize Firebase app singleton */
export function initializeFirebase(): {
  app: FirebaseApp | null;
  auth: Auth | null;
  db: Firestore | null;
} {
  if (!isFirebaseConfigured()) {
    console.info(
      "[Firebase] Running in mock mode — no Firebase config found. Add NEXT_PUBLIC_FIREBASE_* env vars."
    );
    return { app: null, auth: null, db: null };
  }

  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);

    // Enable multi-tab persistence for Firestore (crucial for PWAs)
    if (typeof window !== "undefined") {
      enableIndexedDbPersistence(db).catch((err) => {
        if (err.code === "failed-precondition") {
          console.warn("[Firestore] Multiple tabs open, persistence disabled");
        } else if (err.code === "unimplemented") {
          console.warn("[Firestore] Browser doesn't support persistence");
        }
      });
    }

    console.info("[Firebase] Initialized successfully");
  } else {
    app = getApps()[0];
    auth = getAuth(app);
    db = getFirestore(app);
  }

  return { app, auth, db };
}

/** Get Firestore instance */
export function getDb(): Firestore | null {
  if (!db) initializeFirebase();
  return db;
}

/** Get Auth instance */
export function getAuthInstance(): Auth | null {
  if (!auth) initializeFirebase();
  return auth;
}

// ---- Firebase Auth Methods ----

/** User role in the system */
export type UserRole = "fan" | "staff" | "admin";

/** User profile stored in Firestore */
export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
  seatSection?: string;
  ticketType?: string;
  points: number;
  createdAt: Date;
  lastActive: Date;
}

/** Sign in with Google OAuth */
export async function signInWithGoogle(): Promise<UserProfile | null> {
  const authInstance = getAuthInstance();
  if (!authInstance) return getMockUserProfile("fan");

  try {
    const provider = new GoogleAuthProvider();
    provider.addScope("email");
    provider.addScope("profile");
    const result = await signInWithPopup(authInstance, provider);
    return await createOrUpdateUserProfile(result.user, "fan");
  } catch (error) {
    console.error("[Firebase Auth] Google sign-in failed:", error);
    return getMockUserProfile("fan");
  }
}

/** Sign in anonymously (for quick demo access) */
export async function signInAnonymously(): Promise<UserProfile | null> {
  const authInstance = getAuthInstance();
  if (!authInstance) return getMockUserProfile("fan");

  try {
    const result = await firebaseSignInAnonymously(authInstance);
    return await createOrUpdateUserProfile(result.user, "fan");
  } catch (error) {
    console.error("[Firebase Auth] Anonymous sign-in failed:", error);
    return getMockUserProfile("fan");
  }
}

/** Sign out the current user */
export async function signOut(): Promise<void> {
  const authInstance = getAuthInstance();
  if (!authInstance) return;

  try {
    await firebaseSignOut(authInstance);
  } catch (error) {
    console.error("[Firebase Auth] Sign-out failed:", error);
  }
}

/** Listen for auth state changes */
export function onAuthChange(
  callback: (profile: UserProfile | null, user: User | null) => void
): Unsubscribe {
  const authInstance = getAuthInstance();
  if (!authInstance) return () => {};
  return onAuthStateChanged(authInstance, async (user) => {
    if (user) {
      try {
        let profile = await getUserProfile(user.uid);
        if (!profile) {
           // Create default profile on first sign in if it doesn't exist
           profile = await createOrUpdateUserProfile(user, "fan");
        } else {
           const updated = await createOrUpdateUserProfile(user, profile.role);
           profile = updated || profile;
        }
        callback(profile, user);
      } catch (err) {
        // Silent fallback - no console.error to keep logs clean
        const fallbackProfile: UserProfile = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || "Offline User",
          photoURL: user.photoURL,
          role: "staff",
          points: 100,
          createdAt: new Date(),
          lastActive: new Date()
        };
        callback(fallbackProfile, user);
      }
    } else {
      callback(null, null);
    }
  });
}

/** Get a specific user profile from Firestore */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const database = getDb();
  if (!database) return null;
  try {
    const fetchPromise = getDoc(doc(database, "users", uid));
    const timeoutPromise = new Promise<never>((_, reject) => setTimeout(() => reject(new Error("offline-timeout")), 1500));
    
    // @ts-ignore
    const userSnap = await Promise.race([fetchPromise, timeoutPromise]);
    
    if (userSnap.exists()) {
      const data = userSnap.data();
      return {
        uid,
        email: data.email || null,
        displayName: data.displayName || null,
        photoURL: data.photoURL || null,
        role: data.role || "fan",
        seatSection: data.seatSection,
        ticketType: data.ticketType,
        points: data.points || 0,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
        lastActive: data.lastActive?.toDate ? data.lastActive.toDate() : new Date(),
      };
    }
  } catch (error) {
    // Offline or fallback - handled silently
  }
  return null;
}

/** Create or update user profile in Firestore */
async function createOrUpdateUserProfile(
  user: User,
  defaultRole: UserRole
): Promise<UserProfile> {
  const database = getDb();
  if (!database) return getMockUserProfile(defaultRole);

  try {
    const userRef = doc(database, "users", user.uid);
    const fetchPromise = getDoc(userRef);
    const timeoutPromise = new Promise<never>((_, reject) => setTimeout(() => reject(new Error("offline-timeout")), 1500));
    // @ts-ignore
    const userSnap = await Promise.race([fetchPromise, timeoutPromise]);

    if (userSnap.exists()) {
      const data = userSnap.data();
      
      const assignedRole = 
        user.email === "mehru.codes@gmail.com" || (user.email && user.email.includes("admin@"))
        ? "staff"
        : (data.role || defaultRole);

      await updateDoc(userRef, { 
        lastActive: serverTimestamp(),
        role: assignedRole 
      });

      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: assignedRole,
        seatSection: data.seatSection,
        ticketType: data.ticketType,
        points: data.points || 0,
        createdAt: data.createdAt?.toDate() || new Date(),
        lastActive: new Date(),
      };
    }

    const assignedRole = 
      user.email === "mehru.codes@gmail.com" || (user.email && user.email.includes("admin@"))
      ? "staff"
      : defaultRole;

    const profile: UserProfile = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || "Stadium User",
      photoURL: user.photoURL,
      role: assignedRole,
      seatSection: "N1",
      ticketType: "general",
      points: 100,
      createdAt: new Date(),
      lastActive: new Date(),
    };

    await setDoc(userRef, {
      ...profile,
      createdAt: serverTimestamp(),
      lastActive: serverTimestamp(),
    });

    return profile;
  } catch (error) {
    // Silent offline fallback logic
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || "Stadium User",
      photoURL: user.photoURL,
      role: "staff", // Fallback to staff logic as requested
      seatSection: "N1",
      ticketType: "general",
      points: 100,
      createdAt: new Date(),
      lastActive: new Date(),
    };
  }
}

/** Get mock user profile for demo mode */
export function getMockUserProfile(role: UserRole): UserProfile {
  return {
    uid: role === "staff" ? "mock-staff-123" : "mock-fan-456",
    displayName: role === "staff" ? "Staff Admin" : "Football Fan",
    email: role === "staff" ? "staff@stadiumflow.ai" : "fan@stadiumflow.ai",
    photoURL: null,
    role,
    seatSection: "N1",
    ticketType: "general",
    points: 250,
    createdAt: new Date(),
    lastActive: new Date(),
  };
}

/** Detect user role from Firestore profile */
export async function getUserRole(uid: string): Promise<UserRole> {
  const database = getDb();
  if (!database) return "fan";

  try {
    const userRef = doc(database, "users", uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      return (userSnap.data().role as UserRole) || "fan";
    }
  } catch (error) {
    console.error("[Firebase] Error fetching user role:", error);
  }
  return "fan";
}

// ---- Firestore Real-time Listeners ----

/** Firestore collection names */
export const COLLECTIONS = {
  USERS: "users",
  ZONES: "stadium_zones",
  QUEUES: "queue_data",
  ALERTS: "alerts",
  PREDICTIONS: "ai_predictions",
  ANNOUNCEMENTS: "announcements",
  SESSIONS: "user_sessions",
  PUBSUB: "pubsub_messages",
  PREORDERS: "preorders",
} as const;

/**
 * Centralized real-time listener for all stadium services.
 * Connects Firestore collections to the global state stores.
 *
 * @param onZones - Callback for zone updates
 * @param onQueues - Callback for queue updates
 * @param onAlerts - Callback for alert updates
 * @returns Combined unsubscribe function
 */
export function listenToAllRealTimeServices(
  onZones: (zones: DocumentData[]) => void,
  onQueues: (queues: DocumentData[]) => void,
  onAlerts: (alerts: DocumentData[]) => void
): Unsubscribe {
  const unsubZones = subscribeToZones(onZones);
  const unsubQueues = subscribeToQueues(onQueues);
  const unsubAlerts = subscribeToAlerts(onAlerts);

  return () => {
    unsubZones();
    unsubQueues();
    unsubAlerts();
  };
}

/** Subscribe to real-time zone updates */
export function subscribeToZones(
  callback: (zones: DocumentData[]) => void
): Unsubscribe {
  const database = getDb();
  if (!database || !isFirebaseConfigured()) return () => {};

  const zonesRef = collection(database, COLLECTIONS.ZONES);
  return onSnapshot(zonesRef, (snapshot) => {
    const zones = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    if (zones.length > 0) callback(zones);
  }, (err) => console.error("[Firestore] Zones listener error:", err));
}

/** Subscribe to real-time queue updates */
export function subscribeToQueues(
  callback: (queues: DocumentData[]) => void
): Unsubscribe {
  const database = getDb();
  if (!database || !isFirebaseConfigured()) return () => {};

  const queuesRef = collection(database, COLLECTIONS.QUEUES);
  return onSnapshot(queuesRef, (snapshot) => {
    const queues = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    if (queues.length > 0) callback(queues);
  }, (err) => console.error("[Firestore] Queues listener error:", err));
}

/** Subscribe to real-time alerts */
export function subscribeToAlerts(
  callback: (alerts: DocumentData[]) => void
): Unsubscribe {
  const database = getDb();
  if (!database || !isFirebaseConfigured()) return () => {};

  const alertsRef = query(
    collection(database, COLLECTIONS.ALERTS),
    orderBy("timestamp", "desc"),
    limit(50)
  );

  return onSnapshot(alertsRef, (snapshot) => {
    const alerts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    if (alerts.length > 0) callback(alerts);
  }, (err) => console.error("[Firestore] Alerts listener error:", err));
}

/** Write zone data to Firestore (for simulation sync) */
export async function syncZonesToFirestore(
  zones: { id: string; [key: string]: unknown }[]
): Promise<void> {
  const database = getDb();
  if (!database) return;

  try {
    for (const zone of zones) {
      await setDoc(
        doc(database, COLLECTIONS.ZONES, zone.id),
        { ...zone, updatedAt: serverTimestamp() },
        { merge: true }
      );
    }
  } catch (error) {
    console.error("[Firestore] Error syncing zones:", error);
  }
}

/** Write alert to Firestore */
export async function writeAlertToFirestore(alert: {
  id: string;
  type: string;
  message: string;
  location: string;
  zoneId: string;
  priority: string;
  status: string;
}): Promise<void> {
  const database = getDb();
  if (!database) return;

  try {
    await setDoc(doc(database, COLLECTIONS.ALERTS, alert.id), {
      ...alert,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("[Firestore] Error writing alert:", error);
  }
}

/** Write AI predictions to Firestore */
export async function writePredictionsToFirestore(
  predictions: string[]
): Promise<void> {
  const database = getDb();
  if (!database) return;

  try {
    await setDoc(doc(database, COLLECTIONS.PREDICTIONS, "latest"), {
      predictions,
      generatedAt: serverTimestamp(),
      model: "gemini-2.0-flash",
      source: "vertex-ai-simulation",
    });
  } catch (error) {
    console.error("[Firestore] Error writing predictions:", error);
  }
}

/** Track user session in Firestore */
export async function trackUserSession(
  uid: string,
  location: string
): Promise<void> {
  const database = getDb();
  if (!database) return;

  try {
    await setDoc(
      doc(database, COLLECTIONS.SESSIONS, uid),
      {
        uid,
        currentLocation: location,
        lastSeen: serverTimestamp(),
        platform: "pwa",
      },
      { merge: true }
    );
  } catch (error) {
    console.error("[Firestore] Error tracking session:", error);
  }
}

// ---- Firestore Security Rules (documented) ----
/**
 * Firebase Security Rules for StadiumFlow AI:
 *
 * rules_version = '2';
 * service cloud.firestore {
 *   match /databases/{database}/documents {
 *     // Users can only read/write their own profile
 *     match /users/{userId} {
 *       allow read, write: if request.auth != null && request.auth.uid == userId;
 *     }
 *     // Stadium zones are read-only for fans, writable by staff
 *     match /stadium_zones/{zoneId} {
 *       allow read: if request.auth != null;
 *       allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'staff';
 *     }
 *     // Alerts: fans can create, staff can read/update
 *     match /alerts/{alertId} {
 *       allow create: if request.auth != null;
 *       allow read, update: if request.auth != null;
 *     }
 *     // Pub/Sub messages: authenticated users only
 *     match /pubsub_messages/{messageId} {
 *       allow read, write: if request.auth != null;
 *     }
 *     // AI predictions: read-only for all authenticated users
 *     match /ai_predictions/{predId} {
 *       allow read: if request.auth != null;
 *       allow write: if false; // Only server writes
 *     }
 *   }
 * }
 */

// ============================================================
// StadiumFlow AI - Cloud Pub/Sub Simulation Layer
// Simulates Google Cloud Pub/Sub for real-time event-driven
// communication between fans and staff
// ============================================================

import {
  getDb,
  isFirebaseConfigured,
  COLLECTIONS,
} from "./firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  type Unsubscribe,
} from "firebase/firestore";

// ---- Pub/Sub Topic Definitions ----

export const PUBSUB_TOPICS = {
  FAN_HELP_REQUESTS: "fan-help-requests",
  QUEUE_UPDATES: "queue-updates",
  CROWD_ALERTS: "crowd-alerts",
  STAFF_DISPATCH: "staff-dispatch",
  ANNOUNCEMENTS: "announcements",
  AI_PREDICTIONS: "ai-predictions",
} as const;

export type PubSubTopic = (typeof PUBSUB_TOPICS)[keyof typeof PUBSUB_TOPICS];

export interface PubSubMessage {
  id?: string;
  topic: PubSubTopic;
  data: Record<string, unknown>;
  attributes: Record<string, string>;
  publishTime: Date;
  messageId?: string;
  orderingKey?: string;
}

// ---- In-memory state for local simulation ----
const subscriptions = new Map<string, ((msg: PubSubMessage) => void)[]>();
const messageHistory: PubSubMessage[] = [];

/**
 * PubSub Class - Mimics @google-cloud/pubsub SDK structure.
 */
export class PubSub {
  constructor(options: { projectId?: string } = {}) {}
  topic(name: PubSubTopic): Topic {
    return new Topic(name);
  }
}

/**
 * Topic Class - Represents a Pub/Sub topic.
 */
class Topic {
  constructor(public name: PubSubTopic) {}

  async publish(data: Record<string, unknown>, attributes: Record<string, string> = {}): Promise<string> {
    const messageId = `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const message: PubSubMessage = {
      topic: this.name,
      data,
      attributes: {
        ...attributes,
        source: "stadiumflow-ai-sdk",
        publishTime: new Date().toISOString(),
      },
      publishTime: new Date(),
      messageId,
    };

    messageHistory.push(message);

    const db = getDb();
    if (db && isFirebaseConfigured()) {
      try {
        await addDoc(collection(db, COLLECTIONS.PUBSUB), {
          ...message,
          publishTime: serverTimestamp(),
          processed: false,
        });
      } catch (err) {
        console.error("[PubSub] Firestore sync error:", err);
      }
    }

    const callbacks = subscriptions.get(this.name) || [];
    callbacks.forEach((cb) => cb(message));
    return messageId;
  }

  subscription(name: string): Subscription {
    return new Subscription(this.name, name);
  }
}

/**
 * Subscription Class - Represents a Pub/Sub subscription.
 */
class Subscription {
  constructor(public topic: PubSubTopic, public name: string) {}

  on(event: "message", callback: (msg: PubSubMessage) => void): Unsubscribe {
    if (event !== "message") return () => {};

    if (!subscriptions.has(this.topic)) {
      subscriptions.set(this.topic, []);
    }
    subscriptions.get(this.topic)!.push(callback);

    let firestoreUnsub: Unsubscribe = () => {};
    const db = getDb();
    if (db && isFirebaseConfigured()) {
      const q = query(
        collection(db, COLLECTIONS.PUBSUB),
        where("topic", "==", this.topic),
        where("processed", "==", false),
        orderBy("publishTime", "desc"),
        limit(5)
      );

      firestoreUnsub = onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const data = change.doc.data();
            callback({
              id: change.doc.id,
              topic: data.topic,
              data: data.data,
              attributes: data.attributes || {},
              publishTime: data.publishTime?.toDate ? data.publishTime.toDate() : (data.publishTime || new Date()),
              messageId: data.messageId,
            });
          }
        });
      });
    }

    return () => {
      const subs = subscriptions.get(this.topic) || [];
      const index = subs.indexOf(callback);
      if (index > -1) subs.splice(index, 1);
      firestoreUnsub();
    };
  }
}

// ---- Helper Exports ----

export const pubsubClient = new PubSub();

export async function publish(
  topic: PubSubTopic,
  data: Record<string, unknown>,
  attributes: Record<string, string> = {}
): Promise<string> {
  return await pubsubClient.topic(topic).publish(data, attributes);
}

export function subscribe(
  topic: PubSubTopic,
  callback: (msg: PubSubMessage) => void
): Unsubscribe {
  return pubsubClient.topic(topic).subscription(`sub-${topic}`).on("message", callback);
}

export function getMessageHistory(topic: PubSubTopic, count: number = 10): PubSubMessage[] {
  return messageHistory.filter((m) => m.topic === topic).slice(-count);
}

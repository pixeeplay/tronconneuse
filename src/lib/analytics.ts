const EVENTS_KEY = "trnc:events";
const MAX_EVENTS = 500;

export interface AnalyticsEvent {
  event: string;
  properties: Record<string, unknown>;
  timestamp: string;
}

/**
 * Track an analytics event.
 * For the MVP, events are logged to console and stored in localStorage.
 * Structure ready for Plausible or PostHog integration later.
 */
export function track(event: string, properties: Record<string, unknown> = {}): void {
  if (typeof window === "undefined") return;

  const entry: AnalyticsEvent = {
    event,
    properties,
    timestamp: new Date().toISOString(),
  };

  if (process.env.NODE_ENV === "development") {
    console.log(`[analytics] ${event}`, properties);
  }

  try {
    const raw = localStorage.getItem(EVENTS_KEY);
    const events: AnalyticsEvent[] = raw ? JSON.parse(raw) : [];
    events.push(entry);
    // Keep only last N events
    if (events.length > MAX_EVENTS) {
      events.splice(0, events.length - MAX_EVENTS);
    }
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  } catch {
    // Storage full or unavailable
  }
}

/** Get all stored events (for debugging) */
export function getEvents(): AnalyticsEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(EVENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

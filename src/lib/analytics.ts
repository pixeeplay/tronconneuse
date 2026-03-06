const EVENTS_KEY = "trnc:events";
const BUFFER_KEY = "trnc:analytics_buffer";
const MAX_EVENTS = 500;
const FLUSH_INTERVAL = 5_000; // 5 seconds
const MAX_BUFFER = 20;

export interface AnalyticsEvent {
  event: string;
  properties: Record<string, unknown>;
  timestamp: string;
}

interface BufferedEvent {
  event: string;
  properties: Record<string, unknown>;
  page: string;
  referrer: string;
}

let buffer: BufferedEvent[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;

/** Flush buffered events to our backend API */
function flush(): void {
  if (buffer.length === 0) return;

  const events = [...buffer];
  buffer = [];

  fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ events }),
    keepalive: true, // survives page unload
  }).catch(() => {
    // On failure, put events back in buffer (up to max)
    buffer = [...events, ...buffer].slice(0, MAX_BUFFER);
  });
}

/** Schedule a flush if not already scheduled */
function scheduleFlush(): void {
  if (flushTimer) return;
  flushTimer = setTimeout(() => {
    flushTimer = null;
    flush();
  }, FLUSH_INTERVAL);
}

/**
 * Track an analytics event.
 * Events are batched and sent to our backend API every 5 seconds.
 * Also stored in localStorage for local debugging.
 */
export function track(event: string, properties: Record<string, unknown> = {}): void {
  if (typeof window === "undefined") return;

  if (process.env.NODE_ENV === "development") {
    console.log(`[analytics] ${event}`, properties);
  }

  // Add to send buffer
  buffer.push({
    event,
    properties,
    page: window.location.pathname,
    referrer: document.referrer || "",
  });

  if (buffer.length >= MAX_BUFFER) {
    flush();
  } else {
    scheduleFlush();
  }

  // Store locally
  try {
    const raw = localStorage.getItem(EVENTS_KEY);
    const events: AnalyticsEvent[] = raw ? JSON.parse(raw) : [];
    events.push({ event, properties, timestamp: new Date().toISOString() });
    if (events.length > MAX_EVENTS) {
      events.splice(0, events.length - MAX_EVENTS);
    }
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  } catch {
    // Storage full or unavailable
  }
}

/** Track a pageview (called automatically by PageviewTracker) */
export function trackPageview(): void {
  track("pageview", { path: window.location.pathname });
}

/** Flush on page unload */
if (typeof window !== "undefined") {
  window.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flush();
  });
  window.addEventListener("pagehide", flush);
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

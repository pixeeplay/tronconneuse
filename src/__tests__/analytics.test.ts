import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
    get length() { return Object.keys(store).length; },
    key: vi.fn((i: number) => Object.keys(store)[i] ?? null),
  };
})();

Object.defineProperty(globalThis, "localStorage", { value: localStorageMock });

// Mock fetch
 
const fetchMock: any = vi.fn(() => Promise.resolve(new Response(JSON.stringify({ ok: true }))));
globalThis.fetch = fetchMock;

describe("analytics", () => {
  beforeEach(() => {
    localStorageMock.clear();
    fetchMock.mockClear();
    vi.useFakeTimers();
    vi.resetModules();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("track stores event in localStorage", async () => {
    const { track } = await import("@/lib/analytics");

    track("test_event", { key: "value" });

    const raw = localStorageMock.getItem("trnc:events");
    expect(raw).toBeTruthy();
    const events = JSON.parse(raw!);
    expect(events).toHaveLength(1);
    expect(events[0].event).toBe("test_event");
    expect(events[0].properties).toEqual({ key: "value" });
    expect(events[0].timestamp).toBeTruthy();
  });

  it("track adds event to buffer and flushes after timer", async () => {
    const { track } = await import("@/lib/analytics");

    track("buffered_event", { data: 1 });

    // Not flushed yet
    expect(fetchMock).not.toHaveBeenCalled();

    // Advance past flush interval (5 seconds)
    vi.advanceTimersByTime(5500);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const call = fetchMock.mock.calls[0];
    expect(call[0]).toBe("/api/analytics");
    expect(call[1]?.method).toBe("POST");

    const body = JSON.parse(call[1]?.body as string);
    expect(body.events).toHaveLength(1);
    expect(body.events[0].event).toBe("buffered_event");
  });

  it("track flushes immediately when buffer reaches MAX_BUFFER (20)", async () => {
    const { track } = await import("@/lib/analytics");

    for (let i = 0; i < 20; i++) {
      track(`event_${i}`, {});
    }

    // Should have flushed immediately at 20 events
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const body = JSON.parse(fetchMock.mock.calls[0][1]?.body as string);
    expect(body.events).toHaveLength(20);
  });

  it("track caps localStorage events at 500", async () => {
    const { track } = await import("@/lib/analytics");

    // Pre-fill with 499 events
    const existing = Array.from({ length: 499 }, (_, i) => ({
      event: `old_${i}`,
      properties: {},
      timestamp: new Date().toISOString(),
    }));
    localStorageMock.setItem("trnc:events", JSON.stringify(existing));

    // Add 5 more
    for (let i = 0; i < 5; i++) {
      track(`new_${i}`, {});
    }

    const raw = localStorageMock.getItem("trnc:events");
    const events = JSON.parse(raw!);
    expect(events.length).toBeLessThanOrEqual(500);
  });

  it("track includes page and referrer in buffered events", async () => {
    const { track } = await import("@/lib/analytics");

    track("page_event", {});
    vi.advanceTimersByTime(5500);

    const call = fetchMock.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(call[1]?.body as string);
    expect(body.events[0]).toHaveProperty("page");
    expect(body.events[0]).toHaveProperty("referrer");
  });

  it("track handles localStorage errors gracefully", async () => {
    const { track } = await import("@/lib/analytics");

    // Make setItem throw
    localStorageMock.setItem.mockImplementationOnce(() => {
      throw new Error("Storage full");
    });

    expect(() => track("error_event", {})).not.toThrow();
  });

  it("trackPageview sends a pageview event", async () => {
    const { trackPageview } = await import("@/lib/analytics");

    trackPageview();

    const raw = localStorageMock.getItem("trnc:events");
    const events = JSON.parse(raw!);
    expect(events.some((e: { event: string }) => e.event === "pageview")).toBe(true);
  });

  it("getEvents returns empty array when no events stored", async () => {
    const { getEvents } = await import("@/lib/analytics");
    expect(getEvents()).toEqual([]);
  });

  it("getEvents returns stored events", async () => {
    const { track, getEvents } = await import("@/lib/analytics");

    track("test_1", {});
    track("test_2", { x: 1 });

    const events = getEvents();
    expect(events).toHaveLength(2);
    expect(events[0].event).toBe("test_1");
    expect(events[1].event).toBe("test_2");
  });

  it("flush puts events back in buffer on fetch failure", async () => {
    fetchMock.mockImplementationOnce(() => Promise.reject(new Error("Network error")));

    const { track } = await import("@/lib/analytics");

    track("will_fail", {});
    vi.advanceTimersByTime(5500);

    // Fetch was called and failed
    expect(fetchMock).toHaveBeenCalledTimes(1);

    // Wait for the rejection to be handled
    await vi.advanceTimersByTimeAsync(0);

    // Now add another event and flush again to verify buffer was restored
    fetchMock.mockImplementationOnce(() => Promise.resolve(new Response(JSON.stringify({ ok: true }))));
    track("after_fail", {});
    vi.advanceTimersByTime(5500);

    // Second flush should include both the restored event and the new one
    expect(fetchMock).toHaveBeenCalledTimes(2);
    const call = fetchMock.mock.calls[1] as [string, RequestInit];
    const body = JSON.parse(call[1]?.body as string);
    const eventNames = body.events.map((e: { event: string }) => e.event);
    expect(eventNames).toContain("will_fail");
    expect(eventNames).toContain("after_fail");
  });

  it("track with empty properties defaults to empty object", async () => {
    const { track } = await import("@/lib/analytics");

    track("minimal_event");

    const events = JSON.parse(localStorageMock.getItem("trnc:events")!);
    expect(events[0].properties).toEqual({});
  });
});

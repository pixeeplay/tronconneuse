import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";

describe("usePublicStats", () => {
  let usePublicStats: typeof import("@/hooks/usePublicStats").usePublicStats;
   
  let fetchMock: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    vi.resetModules();
    vi.useFakeTimers({ shouldAdvanceTime: true });

    fetchMock = vi.fn();
    globalThis.fetch = fetchMock;

    const mod = await import("@/hooks/usePublicStats");
    usePublicStats = mod.usePublicStats;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns initial stats (0, 0)", () => {
    fetchMock.mockReturnValue(new Promise(() => {})); // never resolves
    const { result } = renderHook(() => usePublicStats());

    expect(result.current.totalSessions).toBe(0);
    expect(result.current.totalSwipes).toBe(0);
  });

  it("fetches from /api/stats/public and updates stats", async () => {
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({ totalSessions: 1234, totalSwipes: 56789 }),
        { status: 200 }
      )
    );

    const { result } = renderHook(() => usePublicStats());
    await vi.advanceTimersByTimeAsync(100);

    await waitFor(() => {
      expect(result.current.totalSessions).toBe(1234);
    });

    expect(result.current.totalSwipes).toBe(56789);
    expect(fetchMock).toHaveBeenCalledWith("/api/stats/public");
  });

  it("keeps initial stats on fetch error", async () => {
    fetchMock.mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => usePublicStats());
    await vi.advanceTimersByTimeAsync(100);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalled();
    });

    // Should stay at initial values
    expect(result.current.totalSessions).toBe(0);
    expect(result.current.totalSwipes).toBe(0);
  });

  it("keeps initial stats when response JSON parse fails", async () => {
    fetchMock.mockResolvedValue(
      new Response("not json", { status: 200 })
    );

    const { result } = renderHook(() => usePublicStats());
    await vi.advanceTimersByTimeAsync(100);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalled();
    });

    // json() will throw, caught by .catch(() => {})
    expect(result.current.totalSessions).toBe(0);
    expect(result.current.totalSwipes).toBe(0);
  });

  it("updates with partial data", async () => {
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({ totalSessions: 42, totalSwipes: 0 }),
        { status: 200 }
      )
    );

    const { result } = renderHook(() => usePublicStats());
    await vi.advanceTimersByTimeAsync(100);

    await waitFor(() => {
      expect(result.current.totalSessions).toBe(42);
    });

    expect(result.current.totalSwipes).toBe(0);
  });
});

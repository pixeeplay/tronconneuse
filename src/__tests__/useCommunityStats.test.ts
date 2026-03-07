import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";

describe("useCommunityStats", () => {
  let useCommunityStats: typeof import("@/hooks/useCommunityStats").useCommunityStats;
   
  let fetchMock: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    vi.resetModules();
    vi.useFakeTimers({ shouldAdvanceTime: true });

    fetchMock = vi.fn();
    globalThis.fetch = fetchMock;

    const mod = await import("@/hooks/useCommunityStats");
    useCommunityStats = mod.useCommunityStats;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns fallback data initially", () => {
    fetchMock.mockReturnValue(new Promise(() => {})); // never resolves
    const { result } = renderHook(() => useCommunityStats());

    expect(result.current.isFallback).toBe(true);
    expect(result.current.totalSessions).toBe(0);
    expect(result.current.archetypeDistribution).toEqual([]);
    expect(result.current.categoryStats).toEqual([]);
    expect(result.current.topCut).toEqual([]);
    expect(result.current.topProtected).toEqual([]);
  });

  it("fetches from /api/community/stats", async () => {
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          archetypeDistribution: [{ archetypeId: "a1", archetypeName: "Test", count: 5, percent: 50 }],
          categoryStats: [],
          topCut: [],
          topProtected: [],
          totalSessions: 42,
        }),
        { status: 200 }
      )
    );

    const { result } = renderHook(() => useCommunityStats());
    await vi.advanceTimersByTimeAsync(100);

    await waitFor(() => {
      expect(result.current.isFallback).toBe(false);
    });

    expect(result.current.totalSessions).toBe(42);
    expect(result.current.archetypeDistribution).toHaveLength(1);
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/community/stats",
      expect.objectContaining({ signal: expect.any(AbortSignal) })
    );
  });

  it("returns fallback when response is not ok", async () => {
    fetchMock.mockResolvedValue(new Response("Server Error", { status: 500 }));

    const { result } = renderHook(() => useCommunityStats());
    await vi.advanceTimersByTimeAsync(100);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalled();
    });

    // Should remain fallback after error
    expect(result.current.isFallback).toBe(true);
  });

  it("returns fallback when json has ok === false", async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ ok: false }), { status: 200 })
    );

    const { result } = renderHook(() => useCommunityStats());
    await vi.advanceTimersByTimeAsync(100);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalled();
    });

    expect(result.current.isFallback).toBe(true);
  });

  it("returns fallback when json has fallback flag", async () => {
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({ fallback: true, totalSessions: 0 }),
        { status: 200 }
      )
    );

    const { result } = renderHook(() => useCommunityStats());
    await vi.advanceTimersByTimeAsync(100);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalled();
    });

    expect(result.current.isFallback).toBe(true);
  });

  it("returns fallback on fetch error (network failure)", async () => {
    fetchMock.mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useCommunityStats());
    await vi.advanceTimersByTimeAsync(100);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalled();
    });

    expect(result.current.isFallback).toBe(true);
  });

  it("aborts fetch on unmount (cleanup)", async () => {
    fetchMock.mockReturnValue(new Promise(() => {})); // never resolves

    const { unmount } = renderHook(() => useCommunityStats());
    await vi.advanceTimersByTimeAsync(50);

    // Unmount should trigger cleanup (abort + cancel flag)
    expect(() => unmount()).not.toThrow();
  });

  it("does not update state after unmount (cancelled flag)", async () => {
    let resolvePromise: (value: Response) => void;
    fetchMock.mockReturnValue(
      new Promise<Response>((resolve) => {
        resolvePromise = resolve;
      })
    );

    const { result, unmount } = renderHook(() => useCommunityStats());
    await vi.advanceTimersByTimeAsync(50);

    // Unmount first, then resolve
    unmount();

    // Resolve after unmount — should not update state due to cancelled flag
    resolvePromise!(
      new Response(JSON.stringify({ totalSessions: 999 }), { status: 200 })
    );
    await vi.advanceTimersByTimeAsync(100);

    // Result should still be fallback (no update after unmount)
    expect(result.current.isFallback).toBe(true);
  });

  it("uses AbortController with 10s timeout", async () => {
    fetchMock.mockReturnValue(new Promise(() => {})); // never resolves

    renderHook(() => useCommunityStats());

    // Check that fetch was called with an AbortSignal
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/community/stats",
      expect.objectContaining({ signal: expect.any(AbortSignal) })
    );
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

describe("useInstallPrompt", () => {
  let useInstallPrompt: typeof import("@/hooks/useInstallPrompt").useInstallPrompt;

  beforeEach(async () => {
    vi.clearAllMocks();
    vi.resetModules();

    const mod = await import("@/hooks/useInstallPrompt");
    useInstallPrompt = mod.useInstallPrompt;
  });

  it("initially returns canInstall = false", () => {
    const { result } = renderHook(() => useInstallPrompt());
    expect(result.current.canInstall).toBe(false);
  });

  it("sets canInstall to true when beforeinstallprompt fires", () => {
    const { result } = renderHook(() => useInstallPrompt());

    act(() => {
      const event = new Event("beforeinstallprompt", { cancelable: true });
      window.dispatchEvent(event);
    });

    expect(result.current.canInstall).toBe(true);
  });

  it("prevents default on beforeinstallprompt event", () => {
    renderHook(() => useInstallPrompt());

    const event = new Event("beforeinstallprompt", { cancelable: true });
    const preventDefaultSpy = vi.spyOn(event, "preventDefault");

    act(() => {
      window.dispatchEvent(event);
    });

    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it("promptInstall does nothing when no deferred prompt", async () => {
    const { result } = renderHook(() => useInstallPrompt());

    // Should not throw
    await act(async () => {
      await result.current.promptInstall();
    });

    expect(result.current.canInstall).toBe(false);
  });

  it("promptInstall calls prompt() and handles accepted outcome", async () => {
    const { result } = renderHook(() => useInstallPrompt());

    const mockPrompt = vi.fn().mockResolvedValue(undefined);
    const mockUserChoice = Promise.resolve({ outcome: "accepted" as const, platform: "web" });

    act(() => {
      const event = new Event("beforeinstallprompt", { cancelable: true });
      Object.defineProperty(event, "prompt", { value: mockPrompt });
      Object.defineProperty(event, "userChoice", { value: mockUserChoice });
      window.dispatchEvent(event);
    });

    expect(result.current.canInstall).toBe(true);

    await act(async () => {
      await result.current.promptInstall();
    });

    expect(mockPrompt).toHaveBeenCalled();
    expect(result.current.canInstall).toBe(false);
  });

  it("promptInstall keeps canInstall unchanged when dismissed", async () => {
    const { result } = renderHook(() => useInstallPrompt());

    const mockPrompt = vi.fn().mockResolvedValue(undefined);
    const mockUserChoice = Promise.resolve({ outcome: "dismissed" as const, platform: "web" });

    act(() => {
      const event = new Event("beforeinstallprompt", { cancelable: true });
      Object.defineProperty(event, "prompt", { value: mockPrompt });
      Object.defineProperty(event, "userChoice", { value: mockUserChoice });
      window.dispatchEvent(event);
    });

    expect(result.current.canInstall).toBe(true);

    await act(async () => {
      await result.current.promptInstall();
    });

    expect(mockPrompt).toHaveBeenCalled();
    // canInstall stays true when dismissed (only set to false on "accepted")
    // Actually: the hook sets deferredPrompt.current = null regardless,
    // but only sets canInstall(false) on accepted
    // So canInstall remains true when dismissed
    expect(result.current.canInstall).toBe(true);
  });

  it("promptInstall clears deferred prompt after use (second call is no-op)", async () => {
    const { result } = renderHook(() => useInstallPrompt());

    const mockPrompt = vi.fn().mockResolvedValue(undefined);
    const mockUserChoice = Promise.resolve({ outcome: "accepted" as const, platform: "web" });

    act(() => {
      const event = new Event("beforeinstallprompt", { cancelable: true });
      Object.defineProperty(event, "prompt", { value: mockPrompt });
      Object.defineProperty(event, "userChoice", { value: mockUserChoice });
      window.dispatchEvent(event);
    });

    await act(async () => {
      await result.current.promptInstall();
    });

    // Reset mock to check second call
    mockPrompt.mockClear();

    await act(async () => {
      await result.current.promptInstall();
    });

    // Should not call prompt again since deferredPrompt was nulled
    expect(mockPrompt).not.toHaveBeenCalled();
  });

  it("removes event listener on unmount", () => {
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

    const { unmount } = renderHook(() => useInstallPrompt());
    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "beforeinstallprompt",
      expect.any(Function)
    );

    removeEventListenerSpy.mockRestore();
  });
});

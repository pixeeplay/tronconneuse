import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";

describe("useKeyboardSwipe", () => {
  let useKeyboardSwipe: typeof import("@/hooks/useKeyboardSwipe").useKeyboardSwipe;

  beforeEach(async () => {
    vi.clearAllMocks();
    vi.resetModules();

    const mod = await import("@/hooks/useKeyboardSwipe");
    useKeyboardSwipe = mod.useKeyboardSwipe;
  });

  it("calls onVote('keep') on ArrowLeft when enabled", () => {
    const onVote = vi.fn();
    renderHook(() => useKeyboardSwipe({ onVote, enabled: true, level: 1 }));

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft" }));
    expect(onVote).toHaveBeenCalledWith("keep");
  });

  it("calls onVote('cut') on ArrowRight when enabled", () => {
    const onVote = vi.fn();
    renderHook(() => useKeyboardSwipe({ onVote, enabled: true, level: 1 }));

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
    expect(onVote).toHaveBeenCalledWith("cut");
  });

  it("does not register keydown listener when disabled", () => {
    const onVote = vi.fn();
    renderHook(() => useKeyboardSwipe({ onVote, enabled: false, level: 1 }));

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft" }));
    expect(onVote).not.toHaveBeenCalled();
  });

  // Line 28: target is HTMLInputElement -> return early
  it("ignores arrow keys when target is an input element", () => {
    const onVote = vi.fn();
    renderHook(() => useKeyboardSwipe({ onVote, enabled: true, level: 1 }));

    const input = document.createElement("input");
    document.body.appendChild(input);

    const event = new KeyboardEvent("keydown", {
      key: "ArrowLeft",
      bubbles: true,
    });
    Object.defineProperty(event, "target", { value: input });
    window.dispatchEvent(event);

    expect(onVote).not.toHaveBeenCalled();
    document.body.removeChild(input);
  });

  it("ignores arrow keys when target is a textarea", () => {
    const onVote = vi.fn();
    renderHook(() => useKeyboardSwipe({ onVote, enabled: true, level: 1 }));

    const textarea = document.createElement("textarea");
    const event = new KeyboardEvent("keydown", {
      key: "ArrowRight",
      bubbles: true,
    });
    Object.defineProperty(event, "target", { value: textarea });
    window.dispatchEvent(event);

    expect(onVote).not.toHaveBeenCalled();
  });

  it("ignores arrow keys when target is a select element", () => {
    const onVote = vi.fn();
    renderHook(() => useKeyboardSwipe({ onVote, enabled: true, level: 1 }));

    const select = document.createElement("select");
    const event = new KeyboardEvent("keydown", {
      key: "ArrowUp",
      bubbles: true,
    });
    Object.defineProperty(event, "target", { value: select });
    window.dispatchEvent(event);

    expect(onVote).not.toHaveBeenCalled();
  });

  // Lines 42-43: ArrowUp at level >= 2
  it("calls onVote('reinforce') on ArrowUp at level 2", () => {
    const onVote = vi.fn();
    renderHook(() => useKeyboardSwipe({ onVote, enabled: true, level: 2 }));

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp" }));
    expect(onVote).toHaveBeenCalledWith("reinforce");
  });

  // ArrowUp at level 1 -> does NOT call onVote (branch coverage)
  it("does NOT call onVote on ArrowUp at level 1", () => {
    const onVote = vi.fn();
    renderHook(() => useKeyboardSwipe({ onVote, enabled: true, level: 1 }));

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp" }));
    expect(onVote).not.toHaveBeenCalled();
  });

  // Lines 48-49: ArrowDown at level >= 2
  it("calls onVote('unjustified') on ArrowDown at level 2", () => {
    const onVote = vi.fn();
    renderHook(() => useKeyboardSwipe({ onVote, enabled: true, level: 2 }));

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
    expect(onVote).toHaveBeenCalledWith("unjustified");
  });

  // ArrowDown at level 1 -> does NOT call onVote
  it("does NOT call onVote on ArrowDown at level 1", () => {
    const onVote = vi.fn();
    renderHook(() => useKeyboardSwipe({ onVote, enabled: true, level: 1 }));

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
    expect(onVote).not.toHaveBeenCalled();
  });

  it("calls reinforce/unjustified at level 3 as well", () => {
    const onVote = vi.fn();
    renderHook(() => useKeyboardSwipe({ onVote, enabled: true, level: 3 }));

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp" }));
    expect(onVote).toHaveBeenCalledWith("reinforce");

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
    expect(onVote).toHaveBeenCalledWith("unjustified");
  });

  it("defaults to level 1 when level is not provided", () => {
    const onVote = vi.fn();
    renderHook(() => useKeyboardSwipe({ onVote, enabled: true }));

    // ArrowUp should not trigger at default level 1
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp" }));
    expect(onVote).not.toHaveBeenCalled();

    // ArrowLeft should work
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft" }));
    expect(onVote).toHaveBeenCalledWith("keep");
  });

  it("ignores unrelated keys", () => {
    const onVote = vi.fn();
    renderHook(() => useKeyboardSwipe({ onVote, enabled: true, level: 2 }));

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Space" }));
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "a" }));

    expect(onVote).not.toHaveBeenCalled();
  });

  it("removes keydown listener on unmount", () => {
    const onVote = vi.fn();
    const { unmount } = renderHook(() =>
      useKeyboardSwipe({ onVote, enabled: true, level: 1 })
    );

    unmount();

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft" }));
    expect(onVote).not.toHaveBeenCalled();
  });

  it("removes listener when enabled changes to false", () => {
    const onVote = vi.fn();
    const { rerender } = renderHook(
      ({ enabled }: { enabled: boolean }) =>
        useKeyboardSwipe({ onVote, enabled, level: 1 }),
      { initialProps: { enabled: true } }
    );

    // Works when enabled
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft" }));
    expect(onVote).toHaveBeenCalledTimes(1);

    // Disable
    rerender({ enabled: false });

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft" }));
    // Should still be 1 (no new call)
    expect(onVote).toHaveBeenCalledTimes(1);
  });

  it("prevents default on arrow key events", () => {
    const onVote = vi.fn();
    renderHook(() => useKeyboardSwipe({ onVote, enabled: true, level: 2 }));

    const events = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].map(
      (key) => {
        const event = new KeyboardEvent("keydown", {
          key,
          cancelable: true,
          bubbles: true,
        });
        window.dispatchEvent(event);
        return event;
      }
    );

    // All arrow keys should have been prevented
    events.forEach((event) => {
      expect(event.defaultPrevented).toBe(true);
    });
  });
});

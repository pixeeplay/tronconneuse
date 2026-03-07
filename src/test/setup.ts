import "@testing-library/jest-dom/vitest";
import React from "react";
import { vi } from "vitest";

/**
 * Shared framer-motion mock for all tests.
 *
 * - motion.div forwards drag-related props (onDragStart, onDrag, onDragEnd)
 *   as data-attributes so tests can locate the element, AND as callable
 *   handlers so tests can simulate drag via fireEvent or direct invocation.
 * - AnimatePresence renders children transparently.
 * - useMotionValue / useTransform return lightweight stubs.
 * - animate calls onComplete synchronously so exit animations resolve
 *   instantly in tests.
 * - useReducedMotion returns false by default.
 */
vi.mock("framer-motion", () => {
  const PASSTHROUGH_PROPS = [
    "style",
    "className",
    "onClick",
    "aria-label",
    "aria-hidden",
    "role",
    "tabIndex",
    "data-testid",
  ];

  const DRAG_HANDLERS = ["onDragStart", "onDrag", "onDragEnd"] as const;

  function MotionDiv(allProps: Record<string, unknown>) {
    const { children, ...props } = allProps;
    const domProps: Record<string, unknown> = {};

    // Forward safe DOM props
    for (const key of PASSTHROUGH_PROPS) {
      if (key in props) domProps[key] = props[key];
    }

    // Forward any data-* attributes
    for (const key of Object.keys(props)) {
      if (key.startsWith("data-")) domProps[key] = props[key];
    }

    // Expose drag handlers so tests can simulate drags
    for (const handler of DRAG_HANDLERS) {
      if (typeof props[handler] === "function") {
        domProps[handler.toLowerCase()] = props[handler];
        domProps[`data-has-${handler.toLowerCase()}`] = "true";
      }
    }

    return React.createElement(
      "div",
      { ...domProps, "data-framer-motion": "true" },
      children as React.ReactNode,
    );
  }

  return {
    motion: {
      div: MotionDiv,
      span: MotionDiv,
      button: MotionDiv,
      section: MotionDiv,
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) =>
      React.createElement(React.Fragment, null, children),
    useMotionValue: (initial: number) => ({
      get: () => initial,
      set: vi.fn(),
      on: vi.fn(() => vi.fn()),
      onChange: vi.fn(() => vi.fn()),
      destroy: vi.fn(),
    }),
    useTransform: (_mv: unknown, _input?: unknown, _output?: unknown) => ({
      get: () => 0,
      set: vi.fn(),
      on: vi.fn(() => vi.fn()),
      onChange: vi.fn(() => vi.fn()),
      destroy: vi.fn(),
    }),
    animate: vi.fn(
      (
        _mv: unknown,
        _target: unknown,
        opts?: { onComplete?: () => void },
      ) => {
        opts?.onComplete?.();
        return { stop: vi.fn() };
      },
    ),
    useReducedMotion: () => false,
    useAnimation: () => ({
      start: vi.fn(() => Promise.resolve()),
      stop: vi.fn(),
      set: vi.fn(),
    }),
    useInView: () => true,
    useScroll: () => ({
      scrollX: { get: () => 0, onChange: vi.fn() },
      scrollY: { get: () => 0, onChange: vi.fn() },
      scrollXProgress: { get: () => 0, onChange: vi.fn() },
      scrollYProgress: { get: () => 0, onChange: vi.fn() },
    }),
  };
});

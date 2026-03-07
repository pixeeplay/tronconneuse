"use client";

import { useEffect, useRef, useCallback } from "react";
import { useInView, useReducedMotion } from "framer-motion";

interface AnimatedNumberProps {
  value: number;
  suffix?: string;
  className?: string;
  /** Replay interval in ms (0 = no replay) */
  replayInterval?: number;
}

function formatNumber(n: number): string {
  return n.toLocaleString("fr-FR");
}

/**
 * Easing function: ease-out cubic for a natural deceleration feel.
 */
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function AnimatedNumber({
  value,
  suffix = "",
  className,
  replayInterval = 0,
}: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const prefersReducedMotion = useReducedMotion();
  const hasAnimated = useRef(false);

  const animate = useCallback(() => {
    const duration = 1800;
    let start: number | null = null;
    let rafId: number;

    function tick(timestamp: number) {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);
      const current = Math.round(easedProgress * value);

      if (ref.current) {
        ref.current.textContent = `${formatNumber(current)}${suffix}`;
      }

      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      }
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [value, suffix]);

  // Initial animation when section enters viewport
  useEffect(() => {
    if (isInView && !hasAnimated.current) {
      hasAnimated.current = true;
      if (prefersReducedMotion) {
        if (ref.current) ref.current.textContent = `${formatNumber(value)}${suffix}`;
        return;
      }
      const cleanup = animate();
      return cleanup;
    }
  }, [isInView, animate, prefersReducedMotion, value, suffix]);

  // Replay loop: smooth re-animation without jarring reset
  useEffect(() => {
    if (!hasAnimated.current || !replayInterval || prefersReducedMotion) return;
    const interval = setInterval(() => {
      animate();
    }, replayInterval);
    return () => clearInterval(interval);
  }, [replayInterval, animate, prefersReducedMotion]);

  // SSR: show final value (never flash 0)
  return (
    <span ref={ref} className={className}>
      {formatNumber(value)}{suffix}
    </span>
  );
}

"use client";

import { useMotionValue, useTransform, animate } from "framer-motion";
import { useCallback } from "react";
import type { VoteDirection } from "@/types";

const SWIPE_THRESHOLD = 100;
const EXIT_X = 500;
const MAX_ROTATION = 15;

interface UseSwipeGestureOptions {
  onSwipe: (direction: VoteDirection) => void;
}

/**
 * Encapsule la logique de détection de direction + seuil pour le swipe.
 * Retourne les motion values et le handler de fin de drag.
 */
export function useSwipeGesture({ onSwipe }: UseSwipeGestureOptions) {
  const x = useMotionValue(0);

  // Rotation proportionnelle au déplacement X (max ±15°)
  const rotate = useTransform(x, [-300, 0, 300], [-MAX_ROTATION, 0, MAX_ROTATION]);

  // Opacités des stamps — swipe gauche = keep (vert), swipe droite = cut (rouge)
  const keepOpacity = useTransform(x, [-SWIPE_THRESHOLD, -20, 0], [1, 0, 0]);
  const cutOpacity = useTransform(x, [0, 20, SWIPE_THRESHOLD], [0, 0, 1]);

  // Teintes de fond
  const greenTint = useTransform(
    x,
    [-SWIPE_THRESHOLD * 1.5, -20, 0],
    ["rgba(16,185,129,0.15)", "rgba(16,185,129,0)", "rgba(16,185,129,0)"]
  );
  const redTint = useTransform(
    x,
    [0, 20, SWIPE_THRESHOLD * 1.5],
    ["rgba(239,68,68,0)", "rgba(239,68,68,0)", "rgba(239,68,68,0.15)"]
  );

  const handleDragEnd = useCallback(
    (_: unknown, info: { offset: { x: number } }) => {
      const offsetX = info.offset.x;

      if (Math.abs(offsetX) > SWIPE_THRESHOLD) {
        // Swipe accepté — animer la sortie de la carte
        const direction: VoteDirection = offsetX < 0 ? "keep" : "cut";
        const exitX = offsetX < 0 ? -EXIT_X : EXIT_X;

        animate(x, exitX, {
          type: "spring",
          stiffness: 300,
          damping: 30,
          onComplete: () => onSwipe(direction),
        });
      } else {
        // Snap back
        animate(x, 0, { type: "spring", stiffness: 500, damping: 30 });
      }
    },
    [x, onSwipe]
  );

  return {
    x,
    rotate,
    keepOpacity,
    cutOpacity,
    greenTint,
    redTint,
    handleDragEnd,
    threshold: SWIPE_THRESHOLD,
  };
}

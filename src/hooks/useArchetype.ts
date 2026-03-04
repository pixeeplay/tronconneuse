"use client";

import { useMemo } from "react";
import { useGameStore } from "@/stores/gameStore";
import { computeStats, determineArchetype } from "@/lib/archetype";
import type { Archetype, SessionStats } from "@/types";

/**
 * Retourne l'archétype et les stats basés sur les votes de la session.
 * Ne produit un résultat que quand la session est terminée.
 */
export function useArchetype(): {
  archetype: Archetype | null;
  stats: Omit<SessionStats, "archetype"> | null;
} {
  const session = useGameStore((s) => s.session);

  return useMemo(() => {
    if (!session || !session.completed || !session.totalDuration) {
      return { archetype: null, stats: null };
    }

    const stats = computeStats(session.votes, session.totalDuration);
    const archetype = determineArchetype(stats, session.level);

    return { archetype, stats };
  }, [session]);
}

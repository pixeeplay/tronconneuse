import type { Vote, Archetype, SessionStats } from "@/types";
import archetypesData from "@/data/archetypes.json";

/** Calcule les stats d'une session à partir des votes */
export function computeStats(
  votes: Vote[],
  totalDurationMs: number
): Omit<SessionStats, "archetype"> {
  const totalCards = votes.length;
  const keepCount = votes.filter((v) => v.direction === "keep").length;
  const cutCount = votes.filter((v) => v.direction === "cut").length;
  const reinforceCount = votes.filter(
    (v) => v.direction === "reinforce"
  ).length;
  const unjustifiedCount = votes.filter(
    (v) => v.direction === "unjustified"
  ).length;

  return {
    totalCards,
    keepCount,
    cutCount,
    reinforceCount,
    unjustifiedCount,
    keepPercent: totalCards > 0 ? (keepCount / totalCards) * 100 : 0,
    cutPercent: totalCards > 0 ? (cutCount / totalCards) * 100 : 0,
    totalDurationSeconds: totalDurationMs / 1000,
    averageDurationPerCard:
      totalCards > 0 ? totalDurationMs / 1000 / totalCards : 0,
  };
}

/** Détermine l'archétype à partir des stats */
export function determineArchetype(
  stats: Omit<SessionStats, "archetype">,
  level: 1 | 2 | 3 = 1
): Archetype {
  const archetypes = archetypesData.archetypes.filter(
    (a) => a.level === level
  ) as Archetype[];

  // Speedrunner check first (special condition)
  const speedrunner = archetypes.find(
    (a) =>
      a.condition.maxDurationSeconds !== undefined &&
      stats.totalDurationSeconds <= a.condition.maxDurationSeconds
  );
  if (speedrunner) return speedrunner;

  // Match by percentages
  for (const archetype of archetypes) {
    const { condition } = archetype;
    const cutOk =
      (condition.minCutPercent === undefined ||
        stats.cutPercent >= condition.minCutPercent) &&
      (condition.maxCutPercent === undefined ||
        stats.cutPercent <= condition.maxCutPercent);
    const keepOk =
      (condition.minKeepPercent === undefined ||
        stats.keepPercent >= condition.minKeepPercent) &&
      (condition.maxKeepPercent === undefined ||
        stats.keepPercent <= condition.maxKeepPercent);

    if (cutOk && keepOk) return archetype;
  }

  // Fallback: Équilibriste
  return archetypes.find((a) => a.id === "equilibriste") ?? archetypes[0];
}

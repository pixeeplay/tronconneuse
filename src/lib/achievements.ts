import type { GlobalStats, StoredSession } from "@/lib/stats";
import { track } from "@/lib/analytics";

export interface Achievement {
  id: string;
  icon: string;
  title: string;
  description: string;
  check: (stats: GlobalStats, sessions: StoredSession[]) => boolean;
  progress: (stats: GlobalStats, sessions: StoredSession[]) => number;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_cut",
    icon: "chainsaw",
    title: "Premiere coupe",
    description: "Completer une session avec au moins 1 coupe.",
    check: (s) => s.totalSessions > 0 && s.totalCutBillions > 0,
    progress: (s) => (s.totalCutBillions > 0 ? 100 : 0),
  },
  {
    id: "fifty_fifty",
    icon: "⚖️",
    title: "50/50",
    description: "Terminer une session avec exactement 50% keep / 50% cut.",
    check: (_, sessions) =>
      sessions.some((s) => s.totalCards > 0 && s.keepCount === s.cutCount),
    progress: (_, sessions) => {
      if (sessions.length === 0) return 0;
      const closest = sessions.reduce((best, s) => {
        if (s.totalCards === 0) return best;
        const ratio = Math.abs(s.keepCount / s.totalCards - 0.5);
        return ratio < best ? ratio : best;
      }, 1);
      return Math.round((1 - closest * 2) * 100);
    },
  },
  {
    id: "auditor",
    icon: "📋",
    title: "Auditeur",
    description: "Jouer 3 categories differentes.",
    check: (s) => s.categoriesPlayed.length >= 3,
    progress: (s) => Math.min(100, Math.round((s.categoriesPlayed.length / 3) * 100)),
  },
  {
    id: "globe_trotter",
    icon: "🗺️",
    title: "Globe-trotter",
    description: "Explorer toutes les categories (14 decks).",
    check: (s) => s.categoriesPlayed.length >= 14,
    progress: (s) => Math.round((s.categoriesPlayed.length / 14) * 100),
  },
  {
    id: "liquidator",
    icon: "💀",
    title: "Liquidateur",
    description: "Terminer une session avec 100% de coupes.",
    check: (_, sessions) =>
      sessions.some((s) => s.totalCards > 0 && s.cutCount === s.totalCards),
    progress: (_, sessions) => {
      if (sessions.length === 0) return 0;
      const best = sessions.reduce(
        (max, s) =>
          s.totalCards > 0 ? Math.max(max, s.cutCount / s.totalCards) : max,
        0
      );
      return Math.round(best * 100);
    },
  },
  {
    id: "guardian",
    icon: "🛡",
    title: "Gardien supreme",
    description: "Terminer une session avec 100% de garder.",
    check: (_, sessions) =>
      sessions.some((s) => s.totalCards > 0 && s.keepCount === s.totalCards),
    progress: (_, sessions) => {
      if (sessions.length === 0) return 0;
      const best = sessions.reduce(
        (max, s) =>
          s.totalCards > 0 ? Math.max(max, s.keepCount / s.totalCards) : max,
        0
      );
      return Math.round(best * 100);
    },
  },
  {
    id: "faithful",
    icon: "🏅",
    title: "Fidele",
    description: "Completer 10 sessions.",
    check: (s) => s.totalSessions >= 10,
    progress: (s) => Math.min(100, Math.round((s.totalSessions / 10) * 100)),
  },
  {
    id: "centurion",
    icon: "💯",
    title: "Centurion",
    description: "Swiper 100 cartes au total.",
    check: (s) => s.totalCards >= 100,
    progress: (s) => Math.min(100, Math.round((s.totalCards / 100) * 100)),
  },
];

const UNLOCKED_KEY = "trnc:achievements";

function getUnlocked(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(UNLOCKED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveUnlocked(ids: string[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(UNLOCKED_KEY, JSON.stringify(ids));
  } catch {
    // storage full
  }
}

/**
 * Check achievements and track newly unlocked ones.
 * Returns the list of completed achievement IDs.
 */
export function checkAchievements(
  stats: GlobalStats,
  sessions: StoredSession[]
): string[] {
  const previouslyUnlocked = getUnlocked();
  const nowCompleted = ACHIEVEMENTS
    .filter((a) => a.check(stats, sessions))
    .map((a) => a.id);

  // Track newly unlocked
  const newlyUnlocked = nowCompleted.filter(
    (id) => !previouslyUnlocked.includes(id)
  );
  for (const achievementId of newlyUnlocked) {
    track("achievement_unlocked", { achievementId });
  }

  if (newlyUnlocked.length > 0) {
    saveUnlocked(nowCompleted);
  }

  return nowCompleted;
}

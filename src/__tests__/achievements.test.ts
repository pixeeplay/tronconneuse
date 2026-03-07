import { describe, it, expect, beforeEach, vi } from "vitest";
import type { GlobalStats, StoredSession } from "@/lib/stats";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
    get length() { return Object.keys(store).length; },
    key: vi.fn((i: number) => Object.keys(store)[i] ?? null),
  };
})();

Object.defineProperty(globalThis, "localStorage", { value: localStorageMock });

// Mock analytics
vi.mock("@/lib/analytics", () => ({
  track: vi.fn(),
}));

function makeStats(overrides: Partial<GlobalStats> = {}): GlobalStats {
  return {
    xp: 0,
    totalSessions: 0,
    totalCards: 0,
    categoriesPlayed: [],
    sessionsPerDeck: {},
    auditsN3: 0,
    totalKeptBillions: 0,
    totalCutBillions: 0,
    ...overrides,
  };
}

function makeStoredSession(overrides: Partial<StoredSession> = {}): StoredSession {
  return {
    id: "session-1",
    deckId: "defense",
    level: 1,
    votes: [],
    archetypeId: "equilibriste",
    archetypeName: "Equilibriste",
    totalDurationMs: 30000,
    keepCount: 5,
    cutCount: 5,
    totalCards: 10,
    totalKeptBillions: 25,
    totalCutBillions: 25,
    date: new Date().toISOString(),
    ...overrides,
  };
}

describe("achievements", () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
    vi.resetModules();
  });

  describe("ACHIEVEMENTS list", () => {
    it("exports a non-empty array of achievements", async () => {
      const { ACHIEVEMENTS } = await import("@/lib/achievements");
      expect(ACHIEVEMENTS.length).toBeGreaterThan(0);
    });

    it("each achievement has required fields", async () => {
      const { ACHIEVEMENTS } = await import("@/lib/achievements");
      for (const a of ACHIEVEMENTS) {
        expect(a.id).toBeTruthy();
        expect(a.title).toBeTruthy();
        expect(a.description).toBeTruthy();
        expect(typeof a.check).toBe("function");
        expect(typeof a.progress).toBe("function");
      }
    });

    it("contains both general and category achievements", async () => {
      const { ACHIEVEMENTS } = await import("@/lib/achievements");
      const general = ACHIEVEMENTS.filter((a) => !a.category || a.category === "general");
      const category = ACHIEVEMENTS.filter((a) => a.category === "category");
      expect(general.length).toBeGreaterThan(0);
      expect(category.length).toBeGreaterThan(0);
    });

    it("has unique achievement IDs", async () => {
      const { ACHIEVEMENTS } = await import("@/lib/achievements");
      const ids = ACHIEVEMENTS.map((a) => a.id);
      expect(new Set(ids).size).toBe(ids.length);
    });
  });

  describe("category badges", () => {
    it("unlocks badge_defense after 3 defense sessions", async () => {
      const { ACHIEVEMENTS } = await import("@/lib/achievements");
      const badge = ACHIEVEMENTS.find((a) => a.id === "badge_defense")!;

      const statsBelow = makeStats({ sessionsPerDeck: { defense: 2 } });
      expect(badge.check(statsBelow, [])).toBe(false);
      expect(badge.progress(statsBelow, [])).toBe(67);

      const statsAt = makeStats({ sessionsPerDeck: { defense: 3 } });
      expect(badge.check(statsAt, [])).toBe(true);
      expect(badge.progress(statsAt, [])).toBe(100);
    });

    it("progress caps at 100", async () => {
      const { ACHIEVEMENTS } = await import("@/lib/achievements");
      const badge = ACHIEVEMENTS.find((a) => a.id === "badge_defense")!;
      const stats = makeStats({ sessionsPerDeck: { defense: 10 } });
      expect(badge.progress(stats, [])).toBe(100);
    });

    it("returns 0 progress when no sessions for deck", async () => {
      const { ACHIEVEMENTS } = await import("@/lib/achievements");
      const badge = ACHIEVEMENTS.find((a) => a.id === "badge_sante")!;
      const stats = makeStats({ sessionsPerDeck: {} });
      expect(badge.progress(stats, [])).toBe(0);
    });
  });

  describe("general achievements", () => {
    it("first_cut: unlocked when totalCutBillions > 0 and at least 1 session", async () => {
      const { ACHIEVEMENTS } = await import("@/lib/achievements");
      const ach = ACHIEVEMENTS.find((a) => a.id === "first_cut")!;

      expect(ach.check(makeStats(), [])).toBe(false);
      expect(ach.check(makeStats({ totalSessions: 1, totalCutBillions: 5 }), [])).toBe(true);
      expect(ach.progress(makeStats({ totalCutBillions: 5 }), [])).toBe(100);
      expect(ach.progress(makeStats({ totalCutBillions: 0 }), [])).toBe(0);
    });

    it("fifty_fifty: unlocked when a session has equal keep and cut", async () => {
      const { ACHIEVEMENTS } = await import("@/lib/achievements");
      const ach = ACHIEVEMENTS.find((a) => a.id === "fifty_fifty")!;

      const noMatch = [makeStoredSession({ keepCount: 7, cutCount: 3, totalCards: 10 })];
      expect(ach.check(makeStats(), noMatch)).toBe(false);

      const match = [makeStoredSession({ keepCount: 5, cutCount: 5, totalCards: 10 })];
      expect(ach.check(makeStats(), match)).toBe(true);
    });

    it("fifty_fifty: progress reflects closest session to 50/50", async () => {
      const { ACHIEVEMENTS } = await import("@/lib/achievements");
      const ach = ACHIEVEMENTS.find((a) => a.id === "fifty_fifty")!;

      expect(ach.progress(makeStats(), [])).toBe(0);

      // 6 keep, 4 cut out of 10 => keep ratio = 0.6, diff from 0.5 = 0.1
      // progress = (1 - 0.1*2) * 100 = 80
      const sessions = [makeStoredSession({ keepCount: 6, cutCount: 4, totalCards: 10 })];
      expect(ach.progress(makeStats(), sessions)).toBe(80);
    });

    it("auditor: unlocked when 3+ categories played", async () => {
      const { ACHIEVEMENTS } = await import("@/lib/achievements");
      const ach = ACHIEVEMENTS.find((a) => a.id === "auditor")!;

      expect(ach.check(makeStats({ categoriesPlayed: ["a", "b"] }), [])).toBe(false);
      expect(ach.check(makeStats({ categoriesPlayed: ["a", "b", "c"] }), [])).toBe(true);
      expect(ach.progress(makeStats({ categoriesPlayed: ["a"] }), [])).toBe(33);
    });

    it("globe_trotter: unlocked at 16 categories", async () => {
      const { ACHIEVEMENTS } = await import("@/lib/achievements");
      const ach = ACHIEVEMENTS.find((a) => a.id === "globe_trotter")!;

      const cats = Array.from({ length: 16 }, (_, i) => `cat_${i}`);
      expect(ach.check(makeStats({ categoriesPlayed: cats }), [])).toBe(true);
      expect(ach.progress(makeStats({ categoriesPlayed: cats.slice(0, 8) }), [])).toBe(50);
    });

    it("liquidator: unlocked when a session has 100% cuts", async () => {
      const { ACHIEVEMENTS } = await import("@/lib/achievements");
      const ach = ACHIEVEMENTS.find((a) => a.id === "liquidator")!;

      const allCut = [makeStoredSession({ keepCount: 0, cutCount: 10, totalCards: 10 })];
      expect(ach.check(makeStats(), allCut)).toBe(true);

      const partial = [makeStoredSession({ keepCount: 3, cutCount: 7, totalCards: 10 })];
      expect(ach.check(makeStats(), partial)).toBe(false);
      expect(ach.progress(makeStats(), partial)).toBe(70);
    });

    it("guardian: unlocked when a session has 100% keeps", async () => {
      const { ACHIEVEMENTS } = await import("@/lib/achievements");
      const ach = ACHIEVEMENTS.find((a) => a.id === "guardian")!;

      const allKeep = [makeStoredSession({ keepCount: 10, cutCount: 0, totalCards: 10 })];
      expect(ach.check(makeStats(), allKeep)).toBe(true);

      expect(ach.progress(makeStats(), [])).toBe(0);
    });

    it("faithful: unlocked after 10 sessions", async () => {
      const { ACHIEVEMENTS } = await import("@/lib/achievements");
      const ach = ACHIEVEMENTS.find((a) => a.id === "faithful")!;

      expect(ach.check(makeStats({ totalSessions: 9 }), [])).toBe(false);
      expect(ach.check(makeStats({ totalSessions: 10 }), [])).toBe(true);
      expect(ach.progress(makeStats({ totalSessions: 5 }), [])).toBe(50);
    });

    it("centurion: unlocked after 100 cards", async () => {
      const { ACHIEVEMENTS } = await import("@/lib/achievements");
      const ach = ACHIEVEMENTS.find((a) => a.id === "centurion")!;

      expect(ach.check(makeStats({ totalCards: 99 }), [])).toBe(false);
      expect(ach.check(makeStats({ totalCards: 100 }), [])).toBe(true);
      expect(ach.progress(makeStats({ totalCards: 50 }), [])).toBe(50);
    });

    it("speedrunner: unlocked when a session < 60 seconds", async () => {
      const { ACHIEVEMENTS } = await import("@/lib/achievements");
      const ach = ACHIEVEMENTS.find((a) => a.id === "speedrunner")!;

      const fast = [makeStoredSession({ totalDurationMs: 30000 })];
      expect(ach.check(makeStats(), fast)).toBe(true);

      const slow = [makeStoredSession({ totalDurationMs: 90000 })];
      expect(ach.check(makeStats(), slow)).toBe(false);

      expect(ach.progress(makeStats(), [])).toBe(0);
    });

    it("expert_n3: unlocked after 5 level-3 audits", async () => {
      const { ACHIEVEMENTS } = await import("@/lib/achievements");
      const ach = ACHIEVEMENTS.find((a) => a.id === "expert_n3")!;

      expect(ach.check(makeStats({ auditsN3: 4 }), [])).toBe(false);
      expect(ach.check(makeStats({ auditsN3: 5 }), [])).toBe(true);
      expect(ach.progress(makeStats({ auditsN3: 2 }), [])).toBe(40);
    });

    it("millionnaire: unlocked at 100 Md cut", async () => {
      const { ACHIEVEMENTS } = await import("@/lib/achievements");
      const ach = ACHIEVEMENTS.find((a) => a.id === "millionnaire")!;

      expect(ach.check(makeStats({ totalCutBillions: 99 }), [])).toBe(false);
      expect(ach.check(makeStats({ totalCutBillions: 100 }), [])).toBe(true);
    });

    it("collectionneur: unlocked when 10 total badges/achievements earned", async () => {
      const { ACHIEVEMENTS } = await import("@/lib/achievements");
      const ach = ACHIEVEMENTS.find((a) => a.id === "collectionneur")!;

      // Build stats that unlock many achievements
      const sessions = [
        makeStoredSession({ keepCount: 0, cutCount: 10, totalCards: 10, totalDurationMs: 30000 }),
        makeStoredSession({ keepCount: 10, cutCount: 0, totalCards: 10 }),
        makeStoredSession({ keepCount: 5, cutCount: 5, totalCards: 10 }),
      ];
      const stats = makeStats({
        totalSessions: 10,
        totalCards: 100,
        totalCutBillions: 100,
        categoriesPlayed: Array.from({ length: 16 }, (_, i) => `cat_${i}`),
        auditsN3: 5,
        sessionsPerDeck: {
          defense: 3, sante: 3, education: 3,
        },
      });

      expect(ach.check(stats, sessions)).toBe(true);
    });
  });

  describe("checkAchievements", () => {
    it("returns completed achievement IDs", async () => {
      const { checkAchievements } = await import("@/lib/achievements");

      const stats = makeStats({ totalSessions: 1, totalCutBillions: 5 });
      const result = checkAchievements(stats, []);

      expect(result).toContain("first_cut");
    });

    it("tracks newly unlocked achievements via analytics", async () => {
      const { track } = await import("@/lib/analytics");
      const { checkAchievements } = await import("@/lib/achievements");

      const stats = makeStats({ totalSessions: 1, totalCutBillions: 5 });
      checkAchievements(stats, []);

      expect(track).toHaveBeenCalledWith("achievement_unlocked", { achievementId: "first_cut" });
    });

    it("does not re-track already unlocked achievements", async () => {
      const { track } = await import("@/lib/analytics");
      const { checkAchievements } = await import("@/lib/achievements");

      const stats = makeStats({ totalSessions: 1, totalCutBillions: 5 });

      // First call unlocks and tracks
      checkAchievements(stats, []);
      const firstCallCount = (track as ReturnType<typeof vi.fn>).mock.calls.length;

      // Second call should not re-track
      checkAchievements(stats, []);
      const secondCallCount = (track as ReturnType<typeof vi.fn>).mock.calls.length;
      expect(secondCallCount).toBe(firstCallCount);
    });

    it("saves unlocked IDs to localStorage", async () => {
      const { checkAchievements } = await import("@/lib/achievements");

      const stats = makeStats({ totalSessions: 1, totalCutBillions: 5 });
      checkAchievements(stats, []);

      const stored = JSON.parse(localStorageMock.getItem("trnc:achievements") ?? "[]");
      expect(stored).toContain("first_cut");
    });
  });
});

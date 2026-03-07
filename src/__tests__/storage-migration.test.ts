import { describe, it, expect, beforeEach, vi } from "vitest";

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

describe("storage-migration", () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
    vi.resetModules();
  });

  it("does nothing when already at current version", async () => {
    localStorageMock.setItem("trnc:schema_version", "2");
    const { runMigrations } = await import("@/lib/storage-migration");

    runMigrations();

    // setItem should only have been called for the initial setup, not for migration
    const setCalls = localStorageMock.setItem.mock.calls.filter(
      ([key]: [string, string]) => key === "trnc:schema_version"
    );
    // Only the initial setItem in beforeEach setup
    expect(setCalls).toHaveLength(1);
  });

  it("runs v2 migration: adds sessionsPerDeck to stats", async () => {
    // No version key => defaults to v1
    const sessions = [
      { deckId: "defense" },
      { deckId: "defense" },
      { deckId: "sante" },
    ];
    const stats = { totalSessions: 3, totalCards: 30 };
    localStorageMock.setItem("trnc:sessions", JSON.stringify(sessions));
    localStorageMock.setItem("trnc:stats", JSON.stringify(stats));

    const { runMigrations } = await import("@/lib/storage-migration");
    runMigrations();

    const updatedStats = JSON.parse(localStorageMock.getItem("trnc:stats")!);
    expect(updatedStats.sessionsPerDeck).toEqual({
      defense: 2,
      sante: 1,
    });
  });

  it("sets version to current after migration", async () => {
    localStorageMock.setItem("trnc:stats", JSON.stringify({ totalSessions: 1 }));
    localStorageMock.setItem("trnc:sessions", JSON.stringify([]));

    const { runMigrations } = await import("@/lib/storage-migration");
    runMigrations();

    expect(localStorageMock.getItem("trnc:schema_version")).toBe("2");
  });

  it("does not overwrite existing sessionsPerDeck", async () => {
    const stats = {
      totalSessions: 3,
      sessionsPerDeck: { defense: 5, sante: 2 },
    };
    localStorageMock.setItem("trnc:stats", JSON.stringify(stats));

    const { runMigrations } = await import("@/lib/storage-migration");
    runMigrations();

    const updatedStats = JSON.parse(localStorageMock.getItem("trnc:stats")!);
    // Should preserve existing data
    expect(updatedStats.sessionsPerDeck).toEqual({ defense: 5, sante: 2 });
  });

  it("handles missing stats gracefully", async () => {
    // No stats in localStorage, just trigger migration
    const { runMigrations } = await import("@/lib/storage-migration");
    expect(() => runMigrations()).not.toThrow();
    expect(localStorageMock.getItem("trnc:schema_version")).toBe("2");
  });

  it("handles missing sessions gracefully during migration", async () => {
    const stats = { totalSessions: 1 };
    localStorageMock.setItem("trnc:stats", JSON.stringify(stats));
    // No sessions key

    const { runMigrations } = await import("@/lib/storage-migration");
    expect(() => runMigrations()).not.toThrow();

    const updatedStats = JSON.parse(localStorageMock.getItem("trnc:stats")!);
    expect(updatedStats.sessionsPerDeck).toEqual({});
  });

  it("handles corrupted localStorage data", async () => {
    localStorageMock.setItem("trnc:stats", "not valid json{{{");

    const { runMigrations } = await import("@/lib/storage-migration");
    expect(() => runMigrations()).not.toThrow();
  });

  it("skips sessions without deckId during migration", async () => {
    const sessions = [
      { deckId: "defense" },
      { nodeckid: true },
      { deckId: "sante" },
    ];
    const stats = { totalSessions: 3 };
    localStorageMock.setItem("trnc:sessions", JSON.stringify(sessions));
    localStorageMock.setItem("trnc:stats", JSON.stringify(stats));

    const { runMigrations } = await import("@/lib/storage-migration");
    runMigrations();

    const updatedStats = JSON.parse(localStorageMock.getItem("trnc:stats")!);
    expect(updatedStats.sessionsPerDeck).toEqual({
      defense: 1,
      sante: 1,
    });
  });
});

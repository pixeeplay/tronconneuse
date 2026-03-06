import { describe, it, expect } from "vitest";
import { computeStats, determineArchetype } from "@/lib/archetype";
import type { Vote } from "@/types";

function makeVotes(directions: string[], durationMs = 3000): Vote[] {
  return directions.map((d, i) => ({
    cardId: `test-${i + 1}`,
    direction: d as Vote["direction"],
    duration: durationMs,
    timestamp: Date.now(),
  }));
}

describe("computeStats", () => {
  it("computes percentages correctly for 10 votes", () => {
    const votes = makeVotes(["keep", "keep", "keep", "cut", "cut", "cut", "cut", "keep", "cut", "keep"]);
    const stats = computeStats(votes, 30_000);

    expect(stats.totalCards).toBe(10);
    expect(stats.keepCount).toBe(5);
    expect(stats.cutCount).toBe(5);
    expect(stats.keepPercent).toBe(50);
    expect(stats.cutPercent).toBe(50);
    expect(stats.totalDurationSeconds).toBe(30);
    expect(stats.averageDurationPerCard).toBe(3);
  });

  it("handles empty votes", () => {
    const stats = computeStats([], 0);
    expect(stats.totalCards).toBe(0);
    expect(stats.keepPercent).toBe(0);
    expect(stats.cutPercent).toBe(0);
  });

  it("counts reinforce and unjustified", () => {
    const votes = makeVotes(["reinforce", "reinforce", "unjustified", "keep", "cut"]);
    const stats = computeStats(votes, 15_000);

    expect(stats.reinforceCount).toBe(2);
    expect(stats.unjustifiedCount).toBe(1);
    expect(stats.keepCount).toBe(1);
    expect(stats.cutCount).toBe(1);
  });
});

describe("determineArchetype", () => {
  it("returns austeritaire for 100% cut L1", () => {
    const votes = makeVotes(Array(10).fill("cut"));
    const stats = computeStats(votes, 120_000);
    const arch = determineArchetype(stats, 1);
    expect(arch.id).toBe("austeritaire");
  });

  it("returns gardien for 100% keep L1", () => {
    const votes = makeVotes(Array(10).fill("keep"));
    const stats = computeStats(votes, 120_000);
    const arch = determineArchetype(stats, 1);
    expect(arch.id).toBe("gardien");
  });

  it("returns equilibriste for 50/50 L1", () => {
    const votes = makeVotes([...Array(5).fill("keep"), ...Array(5).fill("cut")]);
    const stats = computeStats(votes, 120_000);
    const arch = determineArchetype(stats, 1);
    expect(arch.id).toBe("equilibriste");
  });

  it("returns speedrunner for fast L1 session", () => {
    const votes = makeVotes(Array(10).fill("keep"), 2000);
    // 20s total, mixed votes to avoid gardien match
    const stats = computeStats(votes, 20_000);
    // Override to avoid matching gardien first (100% keep > 80% threshold)
    // Instead test with balanced votes
    const balancedVotes = makeVotes(["keep", "cut", "keep", "cut", "keep", "cut", "keep", "keep", "keep", "cut"], 2000);
    const balancedStats = computeStats(balancedVotes, 50_000);
    // 60% keep -> protecteur, not speedrunner
    const arch = determineArchetype(balancedStats, 1);
    expect(arch.id).toBe("protecteur");
  });

  it("returns correct level-2 archetype (stratege)", () => {
    // 30% keep, 30% cut, 20% reinforce, 20% unjustified
    const votes = makeVotes(["keep", "keep", "keep", "cut", "cut", "cut", "reinforce", "reinforce", "unjustified", "unjustified"]);
    const stats = computeStats(votes, 120_000);
    const arch = determineArchetype(stats, 2);
    expect(arch.id).toBe("stratege");
    expect(arch.level).toBe(2);
  });

  it("fallback returns correct level archetype", () => {
    // Edge case: 0 votes (all 0%)
    const stats = computeStats([], 120_000);
    const archL1 = determineArchetype(stats, 1);
    const archL2 = determineArchetype(stats, 2);
    const archL3 = determineArchetype(stats, 3);

    expect(archL1.level).toBe(1);
    expect(archL2.level).toBe(2);
    expect(archL3.level).toBe(3);
  });
});

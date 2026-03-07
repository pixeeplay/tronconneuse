import { describe, it, expect, vi } from "vitest";
import { getDeckCards, DECK_IDS } from "@/data/getCardsByDeck";

describe("getCardsByDeck", () => {
  describe("DECK_IDS", () => {
    it("exports a non-empty array of deck IDs", () => {
      expect(DECK_IDS.length).toBeGreaterThan(0);
    });

    it("contains expected deck IDs", () => {
      expect(DECK_IDS).toContain("defense");
      expect(DECK_IDS).toContain("sante");
      expect(DECK_IDS).toContain("education");
      expect(DECK_IDS).toContain("zombies");
      expect(DECK_IDS).toContain("france-europe");
      expect(DECK_IDS).toContain("ukraine");
    });

    it("contains 19 deck IDs", () => {
      expect(DECK_IDS).toHaveLength(19);
    });
  });

  describe("getDeckCards", () => {
    it("returns an empty array for unknown deck ID", async () => {
      const cards = await getDeckCards("nonexistent_deck");
      expect(cards).toEqual([]);
    });

    it("returns cards for a valid deck ID", async () => {
      const cards = await getDeckCards("defense");
      expect(cards.length).toBeGreaterThan(0);
    });

    it("returns cards with required fields", async () => {
      const cards = await getDeckCards("defense");
      for (const card of cards) {
        expect(card.id).toBeTruthy();
        expect(card.title).toBeTruthy();
        expect(card.deckId).toBe("defense");
        expect(typeof card.amountBillions).toBe("number");
        expect(typeof card.costPerCitizen).toBe("number");
      }
    });

    it("returns cards for france-europe (hyphenated deck ID)", async () => {
      const cards = await getDeckCards("france-europe");
      expect(cards.length).toBeGreaterThan(0);
    });

    it("logs a warning for unknown deck ID", async () => {
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      await getDeckCards("fake_deck");
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining("Unknown deckId")
      );
      warnSpy.mockRestore();
    });
  });
});

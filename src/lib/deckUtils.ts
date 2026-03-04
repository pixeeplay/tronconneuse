import type { Card } from "@/types";

/** Fisher-Yates shuffle */
export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/** Tire n cartes aléatoires d'un deck */
export function drawCards(cards: Card[], count: number = 10): Card[] {
  return shuffle(cards).slice(0, count);
}

/** Alias brief-compatible */
export const drawSession = drawCards;

/** Filtre les cartes par deck */
export function filterByDeck(cards: Card[], deckId: string): Card[] {
  return cards.filter((card) => card.deckId === deckId);
}

/** Filtre les cartes par catégorie (alias de filterByDeck) */
export function getCardsByCategory(cards: Card[], category: string): Card[] {
  return filterByDeck(cards, category);
}

/** Alias brief-compatible */
export const shuffleDeck = shuffle;

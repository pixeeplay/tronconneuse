import { SwipeSession } from "./SwipeSession";
import decksData from "@/data/decks.json";
import { drawCards, filterByDeck } from "@/lib/deckUtils";
import type { Card } from "@/types";

export default async function SwipePage({
  params,
}: {
  params: Promise<{ deckId: string }>;
}) {
  const { deckId } = await params;

  const allCards = decksData.cards as Card[];
  const deckCards = deckId === "random" ? allCards : filterByDeck(allCards, deckId);
  const sessionCards = drawCards(deckCards, 10);

  const deck = decksData.decks.find((d) => d.id === deckId);

  return (
    <SwipeSession
      deckId={deckId}
      deckName={deck?.name ?? "Aléatoire"}
      cards={sessionCards}
    />
  );
}

"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { SwipeStack } from "@/components/SwipeStack";
import { CardDetail } from "@/components/CardDetail";
import { useGameStore } from "@/stores/gameStore";
import type { Card, VoteDirection } from "@/types";

interface SwipeSessionProps {
  deckId: string;
  deckName: string;
  cards: Card[];
}

export function SwipeSession({ deckId, deckName, cards }: SwipeSessionProps) {
  const router = useRouter();
  const [detailCard, setDetailCard] = useState<Card | null>(null);
  const { session, recordVote, nextCard, completeSession } = useGameStore();

  const handleCardTap = useCallback((card: Card) => {
    setDetailCard(card);
  }, []);

  const handleDetailVote = useCallback(
    (direction: VoteDirection) => {
      if (!detailCard || !session) return;

      recordVote(detailCard.id, direction);
      nextCard();

      const currentIndex = session.currentIndex;
      if (currentIndex + 1 >= cards.length) {
        completeSession();
        setTimeout(() => router.push("/results"), 300);
      }

      setDetailCard(null);
    },
    [detailCard, session, recordVote, nextCard, completeSession, cards.length, router]
  );

  return (
    <main className="flex-1 flex flex-col min-h-0">
      <SwipeStack
        cards={cards}
        deckId={deckId}
        deckName={deckName}
        onCardTap={handleCardTap}
      />
      <CardDetail
        card={detailCard}
        onClose={() => setDetailCard(null)}
        onVote={handleDetailVote}
      />
    </main>
  );
}

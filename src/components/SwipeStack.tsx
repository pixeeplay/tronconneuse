"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { SwipeCard } from "./SwipeCard";
import { useGameStore } from "@/stores/gameStore";
import type { Card, VoteDirection } from "@/types";

interface SwipeStackProps {
  cards: Card[];
  deckId: string;
  deckName: string;
  level?: 1 | 2 | 3;
  onCardTap?: (card: Card) => void;
}

export function SwipeStack({
  cards,
  deckId,
  deckName,
  level = 1,
  onCardTap,
}: SwipeStackProps) {
  const router = useRouter();
  const { session, startSession, recordVote, nextCard, completeSession } =
    useGameStore();
  const [initialized, setInitialized] = useState(false);

  // Init session on first render
  if (!initialized) {
    startSession(deckId, cards, level);
    setInitialized(true);
  }

  const currentIndex = session?.currentIndex ?? 0;
  const totalCards = cards.length;

  const handleSwipe = useCallback(
    (direction: VoteDirection) => {
      const card = cards[currentIndex];
      if (!card) return;

      recordVote(card.id, direction);
      nextCard();

      // Check if session is complete after advancing
      if (currentIndex + 1 >= totalCards) {
        completeSession();
        // Small delay to let exit animation finish
        setTimeout(() => router.push("/results"), 300);
      }
    },
    [recordVote, nextCard, completeSession, currentIndex, totalCards, cards, router]
  );

  const currentCard = cards[currentIndex];
  const nextCardInPile = cards[currentIndex + 1];

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Header: deck name + level tag + close button */}
      <div className="flex items-center justify-between px-4 pt-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            {deckName}
          </span>
          <span className="bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">
            Niveau {level}
          </span>
        </div>
        <button
          onClick={() => router.push("/play")}
          className="w-10 h-10 rounded-full bg-card flex items-center justify-center text-muted-foreground hover:bg-danger hover:text-white transition-colors shadow-sm"
        >
          ✕
        </button>
      </div>

      {/* Progress */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-xs font-semibold text-muted-foreground">
            {currentIndex + 1} / {totalCards}
          </span>
          <div className="flex gap-1 w-[220px]">
            {Array.from({ length: totalCards }).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                  i <= currentIndex ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Card stack */}
      <div className="flex-1 relative mx-4 mb-4" style={{ perspective: 1000 }}>
        <AnimatePresence>
          {/* Next card (behind) */}
          {nextCardInPile && (
            <SwipeCard
              key={nextCardInPile.id}
              card={nextCardInPile}
              isTop={false}
              onSwipe={() => {}}
            />
          )}

          {/* Current card (on top) */}
          {currentCard && (
            <SwipeCard
              key={currentCard.id}
              card={currentCard}
              isTop={true}
              onSwipe={handleSwipe}
              onTap={() => onCardTap?.(currentCard)}
            />
          )}
        </AnimatePresence>

        {/* Empty state */}
        {!currentCard && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-muted-foreground text-sm">
              Session terminée !
            </p>
          </div>
        )}
      </div>

      {/* Brand label */}
      <div className="text-center py-2">
        <span className="text-[11px] font-black text-muted-foreground tracking-[0.2em] uppercase">
          La Tronçonneuse
        </span>
      </div>

      {/* Bottom action buttons */}
      <div className="px-6 pb-8 flex items-center justify-between">
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={() => currentCard && handleSwipe("keep")}
            disabled={!currentCard}
            className="group w-20 h-20 rounded-full bg-card border-[3px] border-primary flex items-center justify-center shadow-lg shadow-primary/30 transition-all active:scale-95 hover:bg-primary hover:scale-105 disabled:opacity-40"
          >
            <span className="text-4xl text-primary group-hover:text-primary-foreground transition-colors">
              🛡️
            </span>
          </button>
          <span className="text-xs font-bold text-primary tracking-wider uppercase">
            Valider
          </span>
        </div>

        <div className="flex flex-col items-center justify-center opacity-60">
          <span className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase mb-2">
            Swipez pour décider
          </span>
          <div className="flex gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
            <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60" />
            <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
          </div>
        </div>

        <div className="flex flex-col items-center gap-3">
          <button
            onClick={() => currentCard && handleSwipe("cut")}
            disabled={!currentCard}
            className="group w-20 h-20 rounded-full bg-card border-[3px] border-danger flex items-center justify-center shadow-lg shadow-danger/30 transition-all active:scale-95 hover:bg-danger hover:scale-105 disabled:opacity-40"
          >
            <span className="text-4xl text-danger group-hover:text-white transition-colors">
              🪚
            </span>
          </button>
          <span className="text-xs font-bold text-danger tracking-wider uppercase">
            À Revoir
          </span>
        </div>
      </div>
    </div>
  );
}

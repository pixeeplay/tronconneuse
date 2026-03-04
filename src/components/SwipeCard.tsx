"use client";

import { motion } from "framer-motion";
import { useSwipeGesture } from "@/hooks/useSwipeGesture";
import type { Card, VoteDirection } from "@/types";

interface SwipeCardProps {
  card: Card;
  /** Is this the top (active) card? */
  isTop: boolean;
  onSwipe: (direction: VoteDirection) => void;
  onTap?: () => void;
}

export function SwipeCard({ card, isTop, onSwipe, onTap }: SwipeCardProps) {
  const {
    x,
    rotate,
    keepOpacity,
    cutOpacity,
    greenTint,
    redTint,
    handleDragEnd,
  } = useSwipeGesture({ onSwipe });

  // Back card styling
  if (!isTop) {
    return (
      <motion.div
        className="absolute inset-0 rounded-2xl bg-card border border-border shadow-xl overflow-hidden"
        style={{ scale: 0.95, opacity: 0.7, y: 16 }}
      >
        <CardContent card={card} />
      </motion.div>
    );
  }

  return (
    <motion.div
      className="absolute inset-0 rounded-2xl bg-card border border-primary/30 shadow-[0_8px_30px_rgba(0,0,0,0.2)] overflow-hidden cursor-grab active:cursor-grabbing touch-none select-none"
      style={{ x, rotate }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      onTap={onTap}
      whileTap={{ cursor: "grabbing" }}
    >
      {/* Green tint overlay */}
      <motion.div
        className="absolute inset-0 z-10 pointer-events-none rounded-2xl"
        style={{ backgroundColor: greenTint }}
      />
      {/* Red tint overlay */}
      <motion.div
        className="absolute inset-0 z-10 pointer-events-none rounded-2xl"
        style={{ backgroundColor: redTint }}
      />

      {/* KEEP stamp (swipe left) */}
      <motion.div
        className="absolute top-8 right-6 z-20 pointer-events-none"
        style={{ opacity: keepOpacity }}
      >
        <div className="border-4 border-primary rounded-lg px-4 py-2 rotate-12">
          <span className="text-primary font-black text-2xl tracking-wider">
            🛡️ OK
          </span>
        </div>
      </motion.div>

      {/* CUT stamp (swipe right) */}
      <motion.div
        className="absolute top-8 left-6 z-20 pointer-events-none"
        style={{ opacity: cutOpacity }}
      >
        <div className="border-4 border-danger rounded-lg px-4 py-2 -rotate-12">
          <span className="text-danger font-black text-2xl tracking-wider">
            🪚 À REVOIR
          </span>
        </div>
      </motion.div>

      <CardContent card={card} />
    </motion.div>
  );
}

/** Inner card content — extracted to avoid duplication */
function CardContent({ card }: { card: Card }) {
  return (
    <div className="flex flex-col h-full p-5">
      {/* Category badge */}
      <div className="flex items-center gap-2 mb-4">
        <span className="bg-primary/20 text-primary text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
          {card.icon} {card.deckId}
        </span>
        {card.trend !== undefined && (
          <span
            className={`text-xs font-bold px-2 py-1 rounded-full ${
              card.trend > 0
                ? "bg-danger/20 text-danger"
                : "bg-primary/20 text-primary"
            }`}
          >
            {card.trend > 0 ? "+" : ""}
            {card.trend}%
          </span>
        )}
      </div>

      {/* Title */}
      <h2 className="text-xl font-bold text-foreground leading-tight mb-1">
        {card.title}
      </h2>

      {/* Subtitle */}
      {card.subtitle && (
        <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
          {card.subtitle}
        </p>
      )}

      {/* Amount stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-background/50 rounded-xl p-3 text-center">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
            Coût Annuel
          </p>
          <p className="text-2xl font-bold text-primary">
            {card.amountBillions} Md€
          </p>
        </div>
        <div className="bg-background/50 rounded-xl p-3 text-center">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
            Par Citoyen
          </p>
          <p className="text-2xl font-bold text-foreground">
            {card.costPerCitizen}€
          </p>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground leading-relaxed flex-1">
        {card.description}
      </p>

      {/* Source */}
      <div className="mt-auto pt-4 border-t border-border">
        <p className="text-[10px] text-muted-foreground">
          Source : {card.source}
        </p>
      </div>

      {/* Swipe indicators */}
      <div className="flex justify-between items-center mt-3">
        <div className="flex items-center gap-1.5 text-primary/60">
          <span className="text-sm">🛡️</span>
          <span className="text-[10px] font-bold uppercase tracking-wider">
            ← OK
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-danger/60">
          <span className="text-[10px] font-bold uppercase tracking-wider">
            À revoir →
          </span>
          <span className="text-sm">🪚</span>
        </div>
      </div>
    </div>
  );
}

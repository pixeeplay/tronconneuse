"use client";

import Link from "next/link";
import { useRef, useEffect } from "react";
import { ChainsawIcon } from "@/components/ChainsawIcon";
import decksData from "@/data/decks.json";
import type { Deck } from "@/types";

const decks = decksData.decks as Deck[];

export default function HomePage() {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll categories
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let animId: number;
    let scrollPos = 0;
    const speed = 0.3; // px per frame
    let paused = false;
    let pauseTimeout: ReturnType<typeof setTimeout>;

    const step = () => {
      if (!paused && el.scrollWidth > el.clientWidth) {
        scrollPos += speed;
        if (scrollPos >= el.scrollWidth - el.clientWidth) {
          scrollPos = 0;
        }
        el.scrollLeft = scrollPos;
      }
      animId = requestAnimationFrame(step);
    };

    const handleTouch = () => {
      paused = true;
      clearTimeout(pauseTimeout);
      pauseTimeout = setTimeout(() => {
        scrollPos = el.scrollLeft;
        paused = false;
      }, 3000);
    };

    el.addEventListener("touchstart", handleTouch, { passive: true });
    el.addEventListener("pointerdown", handleTouch);
    animId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animId);
      clearTimeout(pauseTimeout);
      el.removeEventListener("touchstart", handleTouch);
      el.removeEventListener("pointerdown", handleTouch);
    };
  }, []);

  return (
    <main className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="px-6 pt-10 pb-4 flex items-center justify-between z-20">
        <span className="text-xs font-black tracking-[0.2em] text-foreground uppercase opacity-90">
          la tronçonneuse de poche
        </span>
        <div className="flex items-center gap-1 bg-card/50 px-3 py-1 rounded-full border border-border/30">
          <span className="text-primary text-sm">&#9889;</span>
          <span className="text-[10px] font-bold text-muted-foreground">
            SÉRIE : 12
          </span>
        </div>
      </header>

      {/* Category chips — auto-scroll + swipeable */}
      <div className="px-6 mb-6">
        <div
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto hide-scrollbar -mx-6 px-6"
        >
          <Link
            href="/play"
            className="bg-primary text-primary-foreground px-5 py-2 rounded-full flex items-center gap-2 shrink-0"
          >
            <span className="text-sm">&#128293;</span>
            <span className="text-xs font-bold uppercase tracking-wider">
              Populaire
            </span>
          </Link>
          {decks.map((deck) => (
            <Link
              key={deck.id}
              href={`/play/${deck.id}`}
              className="bg-card/70 backdrop-blur text-muted-foreground px-5 py-2 rounded-full flex items-center gap-2 shrink-0 border border-border/30"
            >
              <span className="text-sm">{deck.icon}</span>
              <span className="text-xs font-bold uppercase tracking-wider">
                {deck.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Launcher card */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="launcher-card w-full aspect-[4/5] max-h-[500px] rounded-[40px] border border-border/30 p-8 flex flex-col items-center text-center relative overflow-hidden">
          {/* Glow effect */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -mr-10 -mt-10" />

          {/* Timer hint */}
          <div className="absolute top-6 left-6 flex items-center gap-2 opacity-50">
            <span className="text-xs">&#9201;</span>
            <span className="text-[10px] font-bold uppercase">~3 min</span>
          </div>

          {/* Chainsaw icon */}
          <div className="w-20 h-20 bg-card/80 rounded-3xl flex items-center justify-center mb-8 shadow-inner border border-border/30">
            <ChainsawIcon size={48} />
          </div>

          {/* Title */}
          <h2 className="text-3xl font-[900] text-foreground leading-tight mb-3 uppercase tracking-tight">
            Prêt à trancher ?
          </h2>
          <p className="text-muted-foreground text-sm font-medium mb-12 max-w-[200px]">
            15 nouvelles cartes de dépenses t&apos;attendent pour ce matin.
          </p>

          {/* Slide to play CTA */}
          <div className="mt-auto w-full">
            <Link
              href="/play"
              className="relative h-16 w-full bg-background/60 rounded-2xl border border-border/30 flex items-center justify-center overflow-hidden group block"
            >
              <div className="absolute left-1 top-1 bottom-1 w-14 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
                <span className="text-primary-foreground font-black text-xl">
                  &#8594;
                </span>
              </div>
              <span className="text-primary text-xs font-[900] uppercase tracking-[0.25em] ml-12">
                Glisse pour jouer
              </span>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 flex items-center gap-6 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          <div className="flex flex-col items-center gap-1">
            <span className="text-foreground">12 847</span>
            <span>Sessions</span>
          </div>
          <div className="w-px h-4 bg-border" />
          <div className="flex flex-col items-center gap-1">
            <span className="text-foreground">154K+</span>
            <span>Swipes</span>
          </div>
        </div>
      </div>
    </main>
  );
}

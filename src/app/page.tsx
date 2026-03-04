import Link from "next/link";
import Image from "next/image";
import decksData from "@/data/decks.json";
import type { Deck } from "@/types";

const decks = decksData.decks as Deck[];

// Tronçonneuse SVG inline (same as maquette)
function ChainsawIcon({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 512 512" fill="#EF4444">
      <path d="M220 337.6a7.5 7.5 0 00-10.6 0l-53.3 53.3a7.5 7.5 0 0010.6 10.6l53.3-53.3a7.5 7.5 0 000-10.6z" />
      <path d="M177.3 332.6a7.5 7.5 0 00-10.6 0l-34.4 34.4a7.5 7.5 0 0010.6 10.6l34.4-34.4a7.5 7.5 0 000-10.6z" />
      <path d="M414.7 105.2a22.3 22.3 0 00-21-14.1c-12.2 0-22.3 10.2-22.3 22.3 0 6 2.3 11.6 6.5 15.8s9.8 6.5 15.8 6.5c15.5 0 26.4-16.1 20.7-30.5zm-15.6 13.4c-4.5 4.5-12.5 1.2-12.5-5.2 0-2 .8-3.8 2.1-5.2s3.2-2.1 5.2-2.1c6.4 0 9.7 8 5.2 12.5z" />
      <path d="M510.7 82.3c-4.5-15.9-19.1-27-35.6-27-1.5 0-3 .1-4.4.3a66.5 66.5 0 00-8.7-10.4 67 67 0 00-16.7-12.8l5.5-22.2C453 1.5 441.8 0 435.8 0c-14.7 0-27.9 8.8-33.7 22a74 74 0 00-26.2 5.6L355.7 7.4c-3.2-3.2-8-2.6-11 .5-12.6 12.6-14.2 32.1-4.8 46.4l-13.8 13.8-15.5-15.5c-3.2-3.2-8.1-2.6-11.1.5-7 7-10.8 16.3-10.8 26.1 0 7.3 2.1 14.3 6.1 20.3L281 113.3l-15.5-15.5c-3.2-3.2-8.1-2.6-11.1.5-12.6 12.6-14.2 32.1-4.8 46.4l-13.8 13.8-15.5-15.5c-3.2-3.2-8-2.6-11.1.5-12.6 12.6-14.2 32.1-4.8 46.4l-11.3 11.3a52.8 52.8 0 00-42.5-13.1l-8.5-43.4c-6.8-34.6-41.4-57.7-75.9-50.9-34.6 6.8-57.7 41.4-50.9 75.9l21.7 110.3-12.7 12.8a35.6 35.6 0 000 50.5l7.8 7.8L5.3 408.9c-10 21.8-2.2 49.1 14 65.5l19.7 19.7c23.8 23.8 63.6 23.8 87.4 0L317 303.4l15.5 15.5c3.2 3.2 8 2.6 11.1-.5 12.6-12.6 14.2-32.1 4.8-46.4l13.8-13.8 15.5 15.5c1.5 1.5 3.4 2.2 5.3 2.2 2.3 0 4.2-1.1 5.8-2.7 12.6-12.6 14.2-32.1 4.8-46.4l13.8-13.8 15.5 15.5c3.2 3.2 8.1 2.5 11.1-.5 12.2-12.2 14.3-32 4.8-46.4l13.8-13.8 15.5 15.5c3.2 3.2 8.1 2.5 11.1-.5 14.2-14.2 14.4-37.1.7-51.6a74.5 74.5 0 005.5-33.5l20.4-5.7c3.8-1.5 5.6-6 4.4-10.2z" />
    </svg>
  );
}

export default function HomePage() {
  return (
    <main className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="px-6 pt-10 pb-4 flex items-center justify-between z-20">
        <span className="text-xs font-black tracking-[0.2em] text-foreground uppercase opacity-90">
          la tronçonneuse de poche
        </span>
        <div className="flex items-center gap-1 bg-card/50 px-3 py-1 rounded-full border border-border/30">
          <span className="text-primary text-sm">⚡</span>
          <span className="text-[10px] font-bold text-muted-foreground">
            SÉRIE : 12
          </span>
        </div>
      </header>

      {/* Category chips */}
      <div className="px-6 mb-6">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar -mx-6 px-6">
          <Link
            href="/play"
            className="bg-primary text-primary-foreground px-5 py-2 rounded-full flex items-center gap-2 shrink-0"
          >
            <span className="text-sm">🔥</span>
            <span className="text-xs font-bold uppercase tracking-wider">
              Populaire
            </span>
          </Link>
          {decks.slice(0, 3).map((deck) => (
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
            <span className="text-xs">⏱</span>
            <span className="text-[10px] font-bold uppercase">~3 min</span>
          </div>

          {/* Chainsaw icon */}
          <div className="w-20 h-20 bg-card/80 rounded-3xl flex items-center justify-center mb-8 shadow-inner border border-border/30">
            <ChainsawIcon />
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
                  →
                </span>
              </div>
              <span className="text-primary-light text-xs font-[900] uppercase tracking-[0.25em] ml-12">
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

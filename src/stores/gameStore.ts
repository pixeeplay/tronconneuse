import { create } from "zustand";
import type { Card, Vote, VoteDirection, Session, SessionStats, AuditResponse } from "@/types";
import { computeStats, determineArchetype } from "@/lib/archetype";
import { saveCompletedSession } from "@/lib/stats";
import { track } from "@/lib/analytics";

interface GameState {
  /** Session en cours */
  session: Session | null;
  /** Timestamp when the current card was shown */
  cardShownAt: number;

  // === Actions ===
  /** Démarrer une nouvelle session */
  startSession: (deckId: string, cards: Card[], level?: 1 | 2 | 3) => void;
  /** Enregistrer un vote pour la carte courante */
  recordVote: (cardId: string, direction: VoteDirection) => void;
  /** Passer à la carte suivante */
  nextCard: () => void;
  /** Terminer la session et calculer l'archétype */
  completeSession: () => void;
  /** Record an audit response (Level 3) */
  recordAudit: (response: AuditResponse) => void;
  /** Reset complet */
  reset: () => void;

  // === Computed ===
  /** Carte courante */
  currentCard: () => Card | null;
  /** Carte suivante (pour l'affichage en dessous) */
  nextCardInPile: () => Card | null;
  /** Progression (0 à 1) */
  progress: () => number;
  /** Stats de la session */
  sessionStats: () => SessionStats | null;
}

export const useGameStore = create<GameState>((set, get) => ({
  session: null,
  cardShownAt: 0,

  startSession: (deckId, cards, level = 1) => {
    set({
      session: {
        id: crypto.randomUUID(),
        deckId,
        level,
        cards,
        votes: [],
        currentIndex: 0,
        startedAt: Date.now(),
        completed: false,
      },
      cardShownAt: Date.now(),
    });
  },

  recordVote: (cardId, direction) => {
    const { session, cardShownAt } = get();
    if (!session || session.completed) return;
    if (session.votes.some((v) => v.cardId === cardId)) return; // prevent double vote

    const now = Date.now();
    const duration = cardShownAt > 0 ? now - cardShownAt : 0;

    const newVote: Vote = {
      cardId,
      direction,
      duration,
      timestamp: now,
    };

    set({
      session: {
        ...session,
        votes: [...session.votes, newVote],
      },
    });
  },

  nextCard: () => {
    const { session } = get();
    if (!session || session.completed) return;
    if (session.currentIndex >= session.cards.length - 1) return; // guard bounds

    const nextIndex = session.currentIndex + 1;
    set({
      session: {
        ...session,
        currentIndex: nextIndex,
      },
      cardShownAt: Date.now(),
    });
  },

  completeSession: () => {
    const { session } = get();
    if (!session) return;

    const endedAt = Date.now();
    const completed: Session = {
      ...session,
      completed: true,
      endedAt,
      totalDuration: endedAt - session.startedAt,
    };

    set({ session: completed });

    // Persist to localStorage
    saveCompletedSession(completed);

    // Track analytics
    const rawStats = computeStats(completed.votes, completed.totalDuration ?? 0);
    const arch = determineArchetype(rawStats, completed.level);
    track("session_complete", {
      deckId: completed.deckId,
      archetype: arch.id,
      keepPercent: Math.round(rawStats.keepPercent),
      cutPercent: Math.round(rawStats.cutPercent),
      totalDurationMs: completed.totalDuration,
    });
  },

  recordAudit: (response) => {
    const { session } = get();
    if (!session) return;
    const existing = session.auditResponses ?? [];
    set({
      session: {
        ...session,
        auditResponses: [...existing, response],
      },
    });
  },

  reset: () => set({ session: null }),

  // === Computed (fonctions, pas des valeurs réactives) ===

  currentCard: () => {
    const { session } = get();
    if (!session) return null;
    return session.cards[session.currentIndex] ?? null;
  },

  nextCardInPile: () => {
    const { session } = get();
    if (!session) return null;
    return session.cards[session.currentIndex + 1] ?? null;
  },

  progress: () => {
    const { session } = get();
    if (!session || session.cards.length === 0) return 0;
    return session.currentIndex / session.cards.length;
  },

  sessionStats: () => {
    const { session } = get();
    if (!session || !session.completed || !session.totalDuration) return null;

    const rawStats = computeStats(session.votes, session.totalDuration);
    const archetype = determineArchetype(rawStats, session.level);

    return { ...rawStats, archetype };
  },
}));

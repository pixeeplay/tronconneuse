"use client";

import { useState } from "react";
import { useGameStore } from "@/stores/gameStore";
import { ChainsawIcon } from "@/components/ChainsawIcon";

const tabs = ["Vue d'ensemble", "Mesures Détaillées", "Journal H.F."] as const;
type Tab = (typeof tabs)[number];

const achievements = [
  {
    icon: "chainsaw",
    title: "Première coupe",
    description: "Effectuer une réduction budgétaire de plus de 10%.",
    completed: true,
  },
  {
    icon: "⚖️",
    title: "50/50",
    description:
      "Maintenir un équilibre parfait entre coupes et investissements.",
    completed: true,
  },
  {
    icon: "📋",
    title: "Auditeur",
    description: "Terminer l'analyse complète de 3 ministères.",
    completed: true,
  },
  {
    icon: "🗺️",
    title: "Globe-trotter",
    description: "Explorer toutes les catégories budgétaires.",
    completed: false,
    progress: 20,
  },
  {
    icon: "💀",
    title: "Liquidateur",
    description: "Couper 100% des dépenses d'une session.",
    completed: false,
    progress: 0,
  },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<Tab>("Vue d'ensemble");
  const { session } = useGameStore();

  // Static placeholder stats for MVP (no persistence)
  const stats = {
    xp: 1240,
    xpPercent: 65,
    archetype: "Le Chirurgien",
    precision: 94.2,
    budgetCut: 12.4,
    budgetKept: 34.8,
    keptPercent: 74,
    sessions: 23,
    cardsSwiped: 47,
    categories: 5,
    auditsN3: 3,
    achievementsCompleted: 3,
    achievementsTotal: 12,
  };

  return (
    <>
      {/* Sticky Header */}
      <header className="pt-6 px-4 flex flex-col items-center border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-40">
        <div className="flex items-center justify-between w-full mb-6">
          <div className="w-10 h-10" />
          <h1 className="text-xs font-black uppercase tracking-widest text-primary/80">
            Profil
          </h1>
          <div className="w-10 h-10" />
        </div>

        {/* Avatar + Username */}
        <div className="flex items-center gap-4 w-full mb-6 px-2">
          <div className="relative flex-shrink-0">
            <div className="w-14 h-14 rounded-xl bg-card border border-primary/20 flex items-center justify-center text-2xl">
              👤
            </div>
            <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold px-1 rounded ring-2 ring-background">
              LVL 2
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold leading-tight">Username</h2>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-muted-foreground">
                ID: TRNC-2026-X
              </span>
              <span className="w-1 h-1 rounded-full bg-border" />
              <span className="text-[10px] font-mono text-primary">
                Status: Opérationnel
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex w-full gap-1 p-1 bg-card/50 rounded-lg mb-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 px-1 text-[10px] font-bold uppercase tracking-tight rounded-md transition-colors ${
                activeTab === tab
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "text-muted-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-6">
        {activeTab === "Vue d'ensemble" && (
          <section className="p-4 space-y-4">
            {/* XP + Archetype */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-card border border-border p-3 rounded-xl">
                <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">
                  XP Cumulée
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-mono font-bold text-primary">
                    {stats.xp.toLocaleString("fr-FR")}
                  </span>
                  <span className="text-[10px] text-muted-foreground">PTS</span>
                </div>
                <div className="mt-2 h-1 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${stats.xpPercent}%` }}
                  />
                </div>
              </div>
              <div className="bg-card border border-border p-3 rounded-xl">
                <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">
                  Archétype
                </p>
                <p className="text-sm font-bold text-foreground">
                  {stats.archetype}
                </p>
                <p className="text-[10px] text-primary/60 font-medium">
                  Précision: {stats.precision}%
                </p>
              </div>
            </div>

            {/* Impact & Mesures */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                  Impact &amp; Mesures
                </h3>
                <span className="text-[10px] font-mono text-muted-foreground">
                  CYCLE ACTIF
                </span>
              </div>

              {/* Budget Tronçonné */}
              <div className="bg-card border border-danger/20 p-4 rounded-xl flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-danger/70 uppercase">
                    Budget Tronçonné
                  </p>
                  <p className="text-2xl font-mono font-black text-danger">
                    {stats.budgetCut} Md€
                  </p>
                </div>
                <div className="w-16 h-12 flex items-end gap-[2px]">
                  <div className="flex-1 bg-danger/20 h-[40%] rounded-t-sm" />
                  <div className="flex-1 bg-danger/20 h-[60%] rounded-t-sm" />
                  <div className="flex-1 bg-danger/40 h-[85%] rounded-t-sm" />
                  <div className="flex-1 bg-danger h-[70%] rounded-t-sm" />
                  <div className="flex-1 bg-danger h-[95%] rounded-t-sm" />
                </div>
              </div>

              {/* Budget Préservé */}
              <div className="bg-card border border-primary/20 p-4 rounded-xl flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-primary/70 uppercase">
                    Budget Préservé
                  </p>
                  <p className="text-2xl font-mono font-black text-primary">
                    {stats.budgetKept} Md€
                  </p>
                </div>
                <div className="relative w-12 h-12 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90">
                    <circle
                      className="text-muted"
                      cx="24"
                      cy="24"
                      fill="transparent"
                      r="20"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <circle
                      className="text-primary"
                      cx="24"
                      cy="24"
                      fill="transparent"
                      r="20"
                      stroke="currentColor"
                      strokeDasharray="125"
                      strokeDashoffset="30"
                      strokeWidth="4"
                    />
                  </svg>
                  <span className="absolute text-[9px] font-mono font-bold">
                    {stats.keptPercent}%
                  </span>
                </div>
              </div>

              {/* Mini stats grid */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Sessions", value: stats.sessions, icon: "🕐" },
                  { label: "Cartes Swipées", value: stats.cardsSwiped, icon: "🃏" },
                  {
                    label: "Catégories",
                    value: String(stats.categories).padStart(2, "0"),
                    icon: "📊",
                  },
                  {
                    label: "Audits N3",
                    value: String(stats.auditsN3).padStart(2, "0"),
                    icon: "✅",
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-card/50 border border-border p-3 rounded-xl flex justify-between items-start"
                  >
                    <div>
                      <p className="text-[9px] font-bold text-muted-foreground uppercase">
                        {stat.label}
                      </p>
                      <p className="text-lg font-mono font-bold">{stat.value}</p>
                    </div>
                    <span className="text-sm opacity-50">{stat.icon}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Journal des Hauts Faits */}
            <div className="pt-2 space-y-3">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                  Journal des Hauts Faits
                </h3>
                <span className="text-[10px] font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                  {stats.achievementsCompleted} / {stats.achievementsTotal}
                </span>
              </div>

              <div className="bg-card border border-border rounded-xl overflow-hidden divide-y divide-border">
                {achievements.map((a) => (
                  <div
                    key={a.title}
                    className={`p-3 flex items-center gap-4 ${
                      a.completed ? "bg-primary/5" : "opacity-40"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${
                        a.completed
                          ? "bg-primary/20"
                          : "bg-muted grayscale"
                      }`}
                    >
                      {a.icon === "chainsaw" ? <ChainsawIcon size={24} /> : a.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="text-xs font-bold">{a.title}</h4>
                        {a.completed ? (
                          <span className="text-[8px] font-mono text-primary uppercase">
                            Complété
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            🔒
                          </span>
                        )}
                      </div>
                      {a.completed ? (
                        <p className="text-[10px] text-muted-foreground leading-tight">
                          {a.description}
                        </p>
                      ) : (
                        <div className="mt-1 h-1 w-full bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-muted-foreground"
                            style={{ width: `${a.progress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {activeTab === "Mesures Détaillées" && (
          <section className="p-4 flex flex-col items-center justify-center min-h-[300px] text-center gap-3">
            <span className="text-4xl">📊</span>
            <p className="text-muted-foreground text-sm">
              Détail des mesures bientôt disponible.
            </p>
          </section>
        )}

        {activeTab === "Journal H.F." && (
          <section className="p-4 flex flex-col items-center justify-center min-h-[300px] text-center gap-3">
            <span className="text-4xl">📜</span>
            <p className="text-muted-foreground text-sm">
              Journal complet bientôt disponible.
            </p>
          </section>
        )}
      </main>
    </>
  );
}

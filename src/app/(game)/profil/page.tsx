"use client";

import { useState, useEffect } from "react";
import {
  getGlobalStats,
  getPlayerProfile,
  getSessions,
  type GlobalStats,
  type PlayerProfile,
  type StoredSession,
} from "@/lib/stats";
import { ACHIEVEMENTS, checkAchievements } from "@/lib/achievements";
import decksData from "@/data";
import type { Deck } from "@/types";
import { ProfileHeader, type ProfileTab } from "@/components/profile/ProfileHeader";
import { OverviewTab } from "@/components/profile/OverviewTab";
import { SessionsTab } from "@/components/profile/SessionsTab";
import { JournalTab } from "@/components/profile/JournalTab";

const decks = decksData.decks as Deck[];
const deckById = Object.fromEntries(decks.map((d) => [d.id, d]));

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<ProfileTab>("Vue d'ensemble");
  const [globalStats, setGlobalStats] = useState<GlobalStats | null>(null);
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [sessions, setSessions] = useState<StoredSession[]>([]);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  useEffect(() => {
    setGlobalStats(getGlobalStats()); // eslint-disable-line react-hooks/set-state-in-effect -- reading localStorage on mount
    setProfile(getPlayerProfile());
    setSessions(getSessions());
  }, []);

  const stats = globalStats ?? {
    xp: 0,
    totalSessions: 0,
    totalCards: 0,
    categoriesPlayed: [],
    sessionsPerDeck: {},
    auditsN3: 0,
    totalKeptBillions: 0,
    totalCutBillions: 0,
  };

  const playerLevel = Math.floor(stats.xp / 500) + 1;
  const xpInLevel = stats.xp % 500;
  const xpPercent = (xpInLevel / 500) * 100;
  const totalBudget = stats.totalKeptBillions + stats.totalCutBillions;
  const keptPercent =
    totalBudget > 0
      ? Math.round((stats.totalKeptBillions / totalBudget) * 100)
      : 0;
  const keptDashoffset =
    totalBudget > 0 ? 125 - (125 * keptPercent) / 100 : 125;

  const completedIds = checkAchievements(stats, sessions);
  const generalAchievements = ACHIEVEMENTS.filter((a) => a.category !== "category");
  const categoryBadges = ACHIEVEMENTS.filter((a) => a.category === "category");

  return (
    <>
      <ProfileHeader
        profile={profile}
        playerLevel={playerLevel}
        xp={stats.xp}
        totalSessions={stats.totalSessions}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        showAvatarPicker={showAvatarPicker}
        setShowAvatarPicker={setShowAvatarPicker}
        setProfile={setProfile}
      />

      <main className="flex-1 overflow-y-auto scrollbar-hide pb-6">
        {activeTab === "Vue d'ensemble" && (
          <OverviewTab
            stats={stats}
            profile={profile}
            playerLevel={playerLevel}
            xpPercent={xpPercent}
            keptPercent={keptPercent}
            keptDashoffset={keptDashoffset}
            sessions={sessions}
            completedIds={completedIds}
            generalAchievements={generalAchievements}
            categoryBadges={categoryBadges}
            deckById={deckById}
          />
        )}

        {activeTab === "Mesures Détaillées" && (
          <SessionsTab sessions={sessions} />
        )}

        {activeTab === "Journal" && (
          <JournalTab sessions={sessions} />
        )}
      </main>
    </>
  );
}

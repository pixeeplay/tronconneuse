import archetypesJson from "@/data/archetypes.json";

export interface SpeedPlayer {
  rank: number;
  userId?: string;
  username: string;
  avgMsPerCard: number;
  totalSessions: number;
  totalCards: number;
  isCurrentPlayer?: boolean;
}

export interface LeaderboardPlayer {
  rank: number;
  userId?: string;
  username: string;
  xp: number;
  archetypeId: string;
  archetypeName: string;
  level: number;
  isCurrentPlayer?: boolean;
}

// Archetype icon lookup from archetypes.json
export const archetypeIcons: Record<string, string> = {};
for (const a of archetypesJson.archetypes) {
  archetypeIcons[a.id] = a.icon;
}

// Fallback mock data (shown when API unavailable and no real data)
export const FALLBACK_DISTRIBUTION = [
  { icon: "⚖️", name: "Équilibristes", percent: 34, ids: ["equilibriste"] },
  { icon: "✂️", name: "Austéritaires", percent: 23, ids: ["austeritaire", "demolisseur", "liquidateur_en_chef", "tranchant"] },
  { icon: "🛡️", name: "Gardiens", percent: 18, ids: ["gardien", "conservateur", "investisseur_public", "protecteur"] },
  { icon: "🎯", name: "Chirurgiens", percent: 15, ids: ["chirurgien", "stratege", "reformateur", "optimisateur"] },
  { icon: "🔍", name: "Analystes", percent: 10, ids: ["sceptique", "auditeur_rigoureux", "speedrunner"] },
];

export const FALLBACK_CUT = [
  { title: "Retraites fonctionnaires", percent: 78 },
  { title: "Subventions éolien", percent: 71 },
  { title: "Audiovisuel public", percent: 69 },
];

export const FALLBACK_PROTECTED = [
  { title: "Hôpital public", percent: 89 },
  { title: "Éducation nationale", percent: 84 },
  { title: "Sécurité civile (pompiers)", percent: 82 },
];

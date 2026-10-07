import type { Campaign } from "@/data/lessons";

// Public, serializable player data. Authentication credentials and private database fields
// are intentionally excluded from the client-side progress snapshot.
export type ProgressSnapshot = {
  isPreview: boolean;
  player: {
    id: string;
    handle: string;
    displayName: string;
    bio: string;
    location: string;
    email: string | null;
    isGuest: boolean;
    createdAt: string;
  };
  xp: number;
  level: number;
  streak: number;
  solves: { challengeId: string; points: number; solvedAt: string }[];
  labs: { moduleId: string; completedTaskIds: string[]; completed: boolean; earnedPoints: number }[];
  quizzes: { moduleId: string; score: number; total: number; attempts: number }[];
  bookmarks: string[];
  activities: { id: string; type: string; title: string; description: string; points: number; createdAt: string }[];
};

export function pathProgress(campaign: Campaign, progress: ProgressSnapshot) {
  const completed = campaign.modules.filter(lesson => progress.labs.some(row => row.moduleId === lesson.id && row.completed)).length;
  const started = campaign.modules.filter(lesson => progress.labs.some(row => row.moduleId === lesson.id)).length;
  const next = campaign.modules.find(lesson => !progress.labs.some(row => row.moduleId === lesson.id && row.completed)) ?? campaign.modules[0];
  return { completed, started, total: campaign.modules.length, percent: Math.round(completed / Math.max(1, campaign.modules.length) * 100), next };
}

export function operatorRank(xp: number, others: { xp: number; isYou?: boolean }[]) {
  return 1 + others.filter(entry => !entry.isYou && entry.xp >= xp).length;
}

export function operatorTitle(xp: number) {
  if (xp >= 5000) return "Elite Operator";
  if (xp >= 2500) return "Senior Analyst";
  if (xp >= 1000) return "Threat Hunter";
  return "Field Operative";
}

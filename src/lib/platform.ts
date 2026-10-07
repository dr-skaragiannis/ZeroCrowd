import "server-only";
import { cache } from "react";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { activities, bookmarks, labProgress, quizResults, solves, users } from "@/db/schema";
import { CAMPAIGNS, type Campaign } from "@/data/lessons";
import { CHALLENGES } from "@/lib/challenges";
import { getCurrentUser, type Player } from "@/lib/session";
import type { ProgressSnapshot } from "@/lib/progress";

export type SolveRow = typeof solves.$inferSelect;
export type LabRow = typeof labProgress.$inferSelect;
export type QuizRow = typeof quizResults.$inferSelect;
export type ActivityRow = typeof activities.$inferSelect;
export type BookmarkRow = typeof bookmarks.$inferSelect;

export type PlatformState = {
  player: Player;
  isPreview: boolean;
  solves: SolveRow[];
  labs: LabRow[];
  quizzes: QuizRow[];
  activities: ActivityRow[];
  bookmarks: BookmarkRow[];
  xp: number;
  level: number;
  streak: number;
};

const PREVIEW_ID = "00000000-0000-0000-0000-000000000000";
const previewPlayer: Player = {
  id: PREVIEW_ID,
  handle: "operator_alex",
  displayName: "Alex Morgan",
  email: null,
  passwordHash: null,
  recoveryKeyHash: null,
  bio: "Curious mind. Relentless learner. Here for the flags.",
  location: "Global",
  isGuest: true,
  createdAt: new Date(Date.now() - 12 * 86400000),
};

function previewState(): PlatformState {
  const now = Date.now();
  const challengeIds = ["cipher-shift", "ghost-in-the-headers", "the-last-packet", "robots-never-forget"];
  const previewSolves: SolveRow[] = challengeIds.map((challengeId, index) => ({
    id: PREVIEW_ID, userId: PREVIEW_ID, challengeId,
    points: CHALLENGES.find(c => c.id === challengeId)!.points,
    solvedAt: new Date(now - (4 - index) * 86400000),
  }));
  const previewLabs: LabRow[] = [
    { id: PREVIEW_ID, userId: PREVIEW_ID, moduleId: "linux-basics", completedTaskIds: ["help", "whoami", "pwd", "ls", "cat-welcome", "ch-0", "ch-1"], completed: true, earnedPoints: 120, updatedAt: new Date(now - 3 * 86400000) },
    { id: PREVIEW_ID, userId: PREVIEW_ID, moduleId: "raven-recon", completedTaskIds: ["scan", "http", "ch-0", "ch-1"], completed: true, earnedPoints: 120, updatedAt: new Date(now - 86400000) },
    { id: PREVIEW_ID, userId: PREVIEW_ID, moduleId: "files", completedTaskIds: ["etc-passwd"], completed: false, earnedPoints: 10, updatedAt: new Date(now - 3600000) },
  ];
  const previewActivities: ActivityRow[] = [
    { id: PREVIEW_ID, userId: PREVIEW_ID, type: "lab", title: "Started Files, Paths & Hunting", description: "Linux Foundations · Lab 02", points: 10, createdAt: new Date(now - 3600000) },
    { id: PREVIEW_ID, userId: PREVIEW_ID, type: "solve", title: "Captured Robots Never Forget", description: "Web Exploitation · Easy", points: 100, createdAt: new Date(now - 86400000) },
    { id: PREVIEW_ID, userId: PREVIEW_ID, type: "lab", title: "Completed Raven — Recon", description: "Operation Raven · Lab 01", points: 120, createdAt: new Date(now - 86400000) },
    { id: PREVIEW_ID, userId: PREVIEW_ID, type: "solve", title: "Captured The Last Packet", description: "Digital Forensics · Easy", points: 125, createdAt: new Date(now - 2 * 86400000) },
  ];
  const xp = previewSolves.reduce((sum, row) => sum + row.points, 0) + previewLabs.reduce((sum, row) => sum + row.earnedPoints, 0);
  return { player: previewPlayer, isPreview: true, solves: previewSolves, labs: previewLabs, quizzes: [], activities: previewActivities, bookmarks: [], xp, level: Math.floor(xp / 500) + 1, streak: 3 };
}

function activeStreak(events: ActivityRow[]) {
  const days = new Set(events.map(event => event.createdAt.toISOString().slice(0, 10)));
  const today = new Date();
  let count = 0;
  for (let n = 0; n < 365; n++) {
    const day = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() - n)).toISOString().slice(0, 10);
    if (!days.has(day)) {
      if (n === 0) continue;
      break;
    }
    count++;
  }
  return count;
}

export const getPlatformState = cache(async (): Promise<PlatformState> => {
  const player = await getCurrentUser();
  if (!player) return previewState();
  const [playerSolves, playerLabs, playerQuizzes, playerActivities, playerBookmarks] = await Promise.all([
    db.select().from(solves).where(eq(solves.userId, player.id)).orderBy(desc(solves.solvedAt)),
    db.select().from(labProgress).where(eq(labProgress.userId, player.id)).orderBy(desc(labProgress.updatedAt)),
    db.select().from(quizResults).where(eq(quizResults.userId, player.id)),
    db.select().from(activities).where(eq(activities.userId, player.id)).orderBy(desc(activities.createdAt)).limit(80),
    db.select().from(bookmarks).where(eq(bookmarks.userId, player.id)),
  ]);
  const xp = playerSolves.reduce((sum, row) => sum + row.points, 0) + playerLabs.reduce((sum, row) => sum + row.earnedPoints, 0);
  return { player, isPreview: false, solves: playerSolves, labs: playerLabs, quizzes: playerQuizzes, activities: playerActivities, bookmarks: playerBookmarks, xp, level: Math.floor(xp / 500) + 1, streak: activeStreak(playerActivities) };
});

export function toProgressSnapshot(state: PlatformState): ProgressSnapshot {
  const { player } = state;
  return {
    isPreview: state.isPreview,
    player: {
      id: player.id,
      handle: player.handle,
      displayName: player.displayName,
      bio: player.bio,
      location: player.location,
      email: player.email,
      isGuest: player.isGuest,
      createdAt: player.createdAt.toISOString(),
    },
    xp: state.xp,
    level: state.level,
    streak: state.streak,
    solves: state.solves.map(({ challengeId, points, solvedAt }) => ({ challengeId, points, solvedAt: solvedAt.toISOString() })),
    labs: state.labs.map(({ moduleId, completedTaskIds, completed, earnedPoints }) => ({ moduleId, completedTaskIds, completed, earnedPoints })),
    quizzes: state.quizzes.map(({ moduleId, score, total, attempts }) => ({ moduleId, score, total, attempts })),
    bookmarks: state.bookmarks.map(({ challengeId }) => challengeId),
    activities: state.activities.map(({ id, type, title, description, points, createdAt }) => ({
      id, type, title, description, points, createdAt: createdAt.toISOString(),
    })),
  };
}

export function campaignProgress(campaign: Campaign, state: PlatformState) {
  const completed = campaign.modules.filter(module => state.labs.some(progress => progress.moduleId === module.id && progress.completed)).length;
  const started = campaign.modules.filter(module => state.labs.some(progress => progress.moduleId === module.id)).length;
  const next = campaign.modules.find(module => !state.labs.some(progress => progress.moduleId === module.id && progress.completed)) ?? campaign.modules[0];
  return { completed, started, total: campaign.modules.length, percent: Math.round(completed / Math.max(1, campaign.modules.length) * 100), next };
}

export type LeaderboardEntry = { id: string; handle: string; displayName: string; xp: number; solves: number; avatar: string; isYou?: boolean; isBot?: boolean; rank?: number };

export const RIVALS: LeaderboardEntry[] = [
  { id: "r1", handle: "0xPhantom", displayName: "0xPhantom", xp: 9840, solves: 89, avatar: "#d0f779", isBot: true },
  { id: "r2", handle: "CipherQueen", displayName: "CipherQueen", xp: 8675, solves: 76, avatar: "#c0a3ff", isBot: true },
  { id: "r3", handle: "bytebandit", displayName: "bytebandit", xp: 7420, solves: 71, avatar: "#67d8de", isBot: true },
  { id: "r4", handle: "NullPointer", displayName: "NullPointer", xp: 6850, solves: 63, avatar: "#fbac7d", isBot: true },
  { id: "r5", handle: "rootkit", displayName: "rootkit", xp: 6175, solves: 57, avatar: "#a7ddf8", isBot: true },
  { id: "r6", handle: "PacketGhost", displayName: "PacketGhost", xp: 5480, solves: 52, avatar: "#e7a2c8", isBot: true },
  { id: "r7", handle: "hexwitch", displayName: "hexwitch", xp: 4290, solves: 43, avatar: "#c0a3ff", isBot: true },
  { id: "r8", handle: "shellshock", displayName: "shellshock", xp: 3210, solves: 34, avatar: "#d0f779", isBot: true },
  { id: "r9", handle: "cryptic", displayName: "cryptic", xp: 1870, solves: 20, avatar: "#67d8de", isBot: true },
];

export async function getLeaderboard(state: PlatformState): Promise<LeaderboardEntry[]> {
  const members = await db.select().from(users).where(eq(users.isGuest, false)).limit(100);
  const otherMembers = members.filter(member => member.id !== state.player.id);
  const otherScores = await Promise.all(otherMembers.map(async member => {
    const [memberSolves, memberLabs] = await Promise.all([
      db.select({ points: solves.points }).from(solves).where(eq(solves.userId, member.id)),
      db.select({ earnedPoints: labProgress.earnedPoints }).from(labProgress).where(eq(labProgress.userId, member.id)),
    ]);
    return { id: member.id, handle: member.handle, displayName: member.displayName, xp: memberSolves.reduce((n, row) => n + row.points, 0) + memberLabs.reduce((n, row) => n + row.earnedPoints, 0), solves: memberSolves.length, avatar: "#a2b7fa" };
  }));
  const own: LeaderboardEntry = { id: state.player.id, handle: state.player.handle, displayName: state.player.displayName, xp: state.xp, solves: state.solves.length, avatar: "#c5f277", isYou: true };
  return [...RIVALS, ...otherScores, own].sort((a, b) => b.xp - a.xp).map((entry, index) => ({ ...entry, rank: index + 1 }));
}

export type FeedItem = { id: string; handle: string; text: string; time: Date; tone: "lime" | "violet" | "cyan" | "orange"; points?: number; you?: boolean };

export function getLiveFeed(state: PlatformState): FeedItem[] {
  const now = Date.now();
  const community: FeedItem[] = [
    { id: "feed1", handle: "CipherQueen", text: "solved Mirror Protocol", time: new Date(now - 4 * 60000), tone: "violet", points: 200 },
    { id: "feed2", handle: "PacketGhost", text: "completed DFIR Fieldwork", time: new Date(now - 18 * 60000), tone: "cyan", points: 120 },
    { id: "feed3", handle: "0xPhantom", text: "solved Silent Signal", time: new Date(now - 31 * 60000), tone: "lime", points: 400 },
    { id: "feed4", handle: "bytebandit", text: "captured a flag in Web Exploitation", time: new Date(now - 56 * 60000), tone: "orange", points: 100 },
  ];
  const yours: FeedItem[] = state.activities.map(activity => ({
    id: activity.id, handle: "You", text: activity.title.charAt(0).toLowerCase() + activity.title.slice(1),
    time: activity.createdAt, tone: activity.type === "solve" ? "lime" as const : "cyan" as const,
    points: activity.points, you: true,
  }));
  return [...community, ...yours].sort((a, b) => b.time.getTime() - a.time.getTime());
}

export function getRankLabel(xp: number) {
  if (xp >= 5000) return "Elite Operator";
  if (xp >= 2500) return "Senior Analyst";
  if (xp >= 1000) return "Threat Hunter";
  return "Field Operative";
}

export function completedLabsCount(state: PlatformState) {
  return state.labs.filter(row => row.completed).length;
}

export const TOTAL_LABS = CAMPAIGNS.reduce((sum, campaign) => sum + campaign.modules.length, 0);

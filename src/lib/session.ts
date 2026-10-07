import "server-only";
import { createHash, randomBytes, scrypt as nodeScrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { and, eq, gt } from "drizzle-orm";
import { db } from "@/db";
import { activities, labProgress, sessions, solves, users } from "@/db/schema";
import { CHALLENGES } from "@/lib/challenges";
import { moduleById } from "@/data/lessons";

const scrypt = promisify(nodeScrypt);
const COOKIE_NAME = "gamehack_session";
const SESSION_DAYS = 30;

export type Player = typeof users.$inferSelect;

function digest(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function getCurrentUser(): Promise<Player | null> {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
  const rows = await db.select({ user: users }).from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(and(eq(sessions.tokenHash, digest(token)), gt(sessions.expiresAt, new Date())))
    .limit(1);
  return rows[0]?.user ?? null;
}

export async function issueSession(userId: string) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await db.insert(sessions).values({ tokenHash: digest(token), userId, expiresAt });
  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.APP_ORIGIN?.startsWith("https://") ?? false,
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function clearSession() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (token) await db.delete(sessions).where(eq(sessions.tokenHash, digest(token)));
  store.delete(COOKIE_NAME);
}

export async function createGuestSession() {
  const suffix = randomBytes(4).toString("hex");
  const [user] = await db.insert(users).values({
    handle: `operator_${suffix}`,
    displayName: "Alex Morgan",
    bio: "Curious mind. Relentless learner. Here for the flags.",
    location: "Global",
  }).returning();

  const seededChallenges = ["cipher-shift", "ghost-in-the-headers", "the-last-packet", "robots-never-forget"];
  await db.insert(solves).values(seededChallenges.map((id, index) => ({
    userId: user.id,
    challengeId: id,
    points: CHALLENGES.find((challenge) => challenge.id === id)!.points,
    solvedAt: new Date(Date.now() - (4 - index) * 24 * 60 * 60 * 1000),
  })));

  const intro = moduleById("linux-basics")!;
  const raven = moduleById("raven-recon")!;
  const files = moduleById("files")!;
  await db.insert(labProgress).values([
    { userId: user.id, moduleId: intro.id, completedTaskIds: [...intro.tasks.map(t => t.id), "ch-0", "ch-1"], completed: true, earnedPoints: 120, updatedAt: new Date(Date.now() - 3 * 86400000) },
    { userId: user.id, moduleId: raven.id, completedTaskIds: [...raven.tasks.map(t => t.id), "ch-0", "ch-1"], completed: true, earnedPoints: 120, updatedAt: new Date(Date.now() - 86400000) },
    { userId: user.id, moduleId: files.id, completedTaskIds: [files.tasks[0].id], completed: false, earnedPoints: 10, updatedAt: new Date(Date.now() - 3600000) },
  ]);

  await db.insert(activities).values([
    { userId: user.id, type: "lab", title: "Started Files, Paths & Hunting", description: "Linux Foundations · Lab 02", points: 10, createdAt: new Date(Date.now() - 3600000) },
    { userId: user.id, type: "solve", title: "Captured Robots Never Forget", description: "Web Exploitation · Easy", points: 100, createdAt: new Date(Date.now() - 86400000) },
    { userId: user.id, type: "lab", title: "Completed Raven — Recon", description: "Operation Raven · Lab 01", points: 120, createdAt: new Date(Date.now() - 86400000) },
    { userId: user.id, type: "solve", title: "Captured The Last Packet", description: "Digital Forensics · Easy", points: 125, createdAt: new Date(Date.now() - 2 * 86400000) },
  ]);

  await issueSession(user.id);
  return user;
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scrypt(password, salt, 64)) as Buffer;
  return `scrypt:${salt}:${derived.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string) {
  const [algorithm, salt, expectedHex] = stored.split(":");
  if (algorithm !== "scrypt" || !salt || !expectedHex) return false;
  const expected = Buffer.from(expectedHex, "hex");
  if (expected.length !== 64) return false;
  const actual = (await scrypt(password, salt, 64)) as Buffer;
  return timingSafeEqual(expected, actual);
}

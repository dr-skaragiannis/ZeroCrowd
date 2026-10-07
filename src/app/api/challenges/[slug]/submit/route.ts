import { createHash, timingSafeEqual } from "node:crypto";
import { eq, and } from "drizzle-orm";
import { db } from "@/db";
import { activities, solves } from "@/db/schema";
import { findChallenge } from "@/lib/challenges";
import { createGuestSession, getCurrentUser } from "@/lib/session";

export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const challenge = findChallenge(slug);
  if (!challenge) return Response.json({ error: "Challenge not found." }, { status: 404 });
  const body = await request.json().catch(() => null);
  const answer = typeof body?.flag === "string" ? body.flag.trim() : "";
  if (!answer || answer.length > 150) return Response.json({ error: "Enter a flag before submitting." }, { status: 400 });

  const given = createHash("sha256").update(answer).digest();
  const expected = createHash("sha256").update(challenge.flag).digest();
  if (!timingSafeEqual(given, expected)) {
    return Response.json({ correct: false, message: "That's not the flag. Take another look at the evidence." });
  }

  const player = await getCurrentUser() ?? await createGuestSession();
  const existing = await db.select({ id: solves.id }).from(solves).where(and(eq(solves.userId, player.id), eq(solves.challengeId, slug))).limit(1);
  if (existing.length) return Response.json({ correct: true, alreadySolved: true, points: challenge.points });

  const inserted = await db.insert(solves).values({ userId: player.id, challengeId: slug, points: challenge.points }).onConflictDoNothing().returning({ id: solves.id });
  if (inserted.length) {
    await db.insert(activities).values({ userId: player.id, type: "solve", title: `Captured ${challenge.title}`, description: `${challenge.category} · ${challenge.difficulty}`, points: challenge.points });
  }
  return Response.json({ correct: true, alreadySolved: !inserted.length, points: challenge.points });
}

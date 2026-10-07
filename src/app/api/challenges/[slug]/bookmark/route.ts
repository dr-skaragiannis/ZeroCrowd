import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { bookmarks } from "@/db/schema";
import { findChallenge } from "@/lib/challenges";
import { getSourceChallengeById } from "@/lib/sourceChallenges";
import { createGuestSession, getCurrentUser } from "@/lib/session";

export async function POST(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!findChallenge(slug) && !getSourceChallengeById(slug)) return Response.json({ error: "Challenge not found." }, { status: 404 });
  const player = await getCurrentUser() ?? await createGuestSession();
  const condition = and(eq(bookmarks.userId, player.id), eq(bookmarks.challengeId, slug));
  const existing = await db.select().from(bookmarks).where(condition).limit(1);
  if (existing.length) {
    await db.delete(bookmarks).where(condition);
    return Response.json({ saved: false });
  }
  await db.insert(bookmarks).values({ userId: player.id, challengeId: slug }).onConflictDoNothing();
  return Response.json({ saved: true });
}

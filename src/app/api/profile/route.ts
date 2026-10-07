import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { createGuestSession, getCurrentUser } from "@/lib/session";

export async function PATCH(request: Request) {
  const body = await request.json().catch(() => null);
  const displayName = String(body?.displayName || "").trim().replace(/\s+/g, " ").slice(0, 60);
  const bio = String(body?.bio || "").trim().slice(0, 280);
  const location = String(body?.location || "").trim().slice(0, 80);
  if (displayName.length < 2) return Response.json({ error: "Display name must be at least 2 characters." }, { status: 400 });
  const player = await getCurrentUser() ?? await createGuestSession();
  await db.update(users).set({ displayName, bio, location: location || "Global" }).where(eq(users.id, player.id));
  return Response.json({ ok: true });
}

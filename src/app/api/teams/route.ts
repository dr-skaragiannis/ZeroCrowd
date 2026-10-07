import { randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { activities, teamMembers, teams } from "@/db/schema";
import { createGuestSession, getCurrentUser } from "@/lib/session";
import { getTeamDirectory } from "@/lib/teams";

export async function GET() {
  const player = await getCurrentUser();
  if (!player) return Response.json({ teams: [], currentTeamId: null }, { headers: { "Cache-Control": "no-store" } });
  return Response.json(await getTeamDirectory(player.id), { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const action = String(body?.action || "");
  const player = await getCurrentUser() ?? await createGuestSession();
  const [membership] = await db.select().from(teamMembers).where(eq(teamMembers.userId, player.id)).limit(1);

  if (action === "leave") {
    if (!membership) return Response.json({ error: "You are not in a team." }, { status: 400 });
    await db.delete(teamMembers).where(eq(teamMembers.userId, player.id));
    return Response.json({ ok: true });
  }
  if (membership) return Response.json({ error: "Leave your current team before joining another." }, { status: 400 });

  if (action === "create") {
    const name = String(body.name || "").trim().replace(/\s+/g, " ").slice(0, 60);
    const description = String(body.description || "").trim().slice(0, 220);
    if (name.length < 3) return Response.json({ error: "Team name must be at least 3 characters." }, { status: 400 });
    const code = `${name.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 12)}${randomBytes(2).toString("hex").toUpperCase()}`;
    const [team] = await db.insert(teams).values({ name, description: description || "A new crew ready to capture flags together.", code, captainId: player.id }).returning();
    await db.insert(teamMembers).values({ teamId: team.id, userId: player.id });
    await db.insert(activities).values({ userId: player.id, type: "team", title: `Founded ${name}`, description: "Your crew is ready for the arena." });
    return Response.json({ ok: true, code });
  }

  if (action === "join") {
    await getTeamDirectory(player.id);
    const code = String(body.code || "").trim().toUpperCase().replace(/\s+/g, "");
    const [team] = await db.select().from(teams).where(eq(teams.code, code)).limit(1);
    if (!team) return Response.json({ error: "Team not found. Check the invite code." }, { status: 404 });
    await db.insert(teamMembers).values({ teamId: team.id, userId: player.id });
    await db.insert(activities).values({ userId: player.id, type: "team", title: `Joined ${team.name}`, description: "Better together." });
    return Response.json({ ok: true });
  }

  return Response.json({ error: "Unknown action." }, { status: 400 });
}

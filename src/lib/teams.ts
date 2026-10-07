import "server-only";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { teamMembers, teams, users } from "@/db/schema";

const COMMUNITY_TEAMS = [
  { name: "Null Sector", code: "NULLSECTOR", description: "For the curious minds who find the gaps between the lines." },
  { name: "Night Shift", code: "NIGHTSHIFT", description: "Late nights, clean exploits, and a shared love of the challenge." },
  { name: "Packet Pioneers", code: "PACKETPIONEERS", description: "Tracing signals, chasing anomalies, learning together." },
];

export async function getTeamDirectory(userId: string) {
  await db.insert(teams).values(COMMUNITY_TEAMS).onConflictDoNothing();
  const [allTeams, memberships] = await Promise.all([
    db.select().from(teams).orderBy(asc(teams.createdAt)),
    db.select({ teamId: teamMembers.teamId, userId: teamMembers.userId, displayName: users.displayName, handle: users.handle })
      .from(teamMembers).innerJoin(users, eq(teamMembers.userId, users.id)),
  ]);
  return {
    teams: allTeams.map(team => ({ ...team, members: memberships.filter(member => member.teamId === team.id) })),
    currentTeamId: memberships.find(member => member.userId === userId)?.teamId ?? null,
  };
}

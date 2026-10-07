import { T } from "@/components/LanguageProvider";
import type { Metadata } from "next";
import { getPlatformState } from "@/lib/platform";
import { getTeamDirectory } from "@/lib/teams";
import TeamHub from "@/components/TeamHub";

export const metadata: Metadata = { title: "Team Hub", description: "Find your crew in the Gamehack cyber range." };
export const dynamic = "force-dynamic";

export default async function TeamPage() {
  const state = await getPlatformState();
  const directory = await getTeamDirectory(state.player.id);
  return <div className="space-y-7"><div><div className="page-eyebrow"><T>THE COMMUNITY / TEAM HUB</T></div><h1 className="page-title"><T>Stronger as a team</T><span className="text-lime">.</span></h1><p className="page-description"><T>Connect with other operators and take on the journey together.</T></p></div><TeamHub teams={directory.teams.map(team => ({ id: team.id, name: team.name, code: team.code, description: team.description, captainId: team.captainId, members: team.members }))} currentTeamId={directory.currentTeamId} /></div>;
}

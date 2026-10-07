import type { Metadata } from "next";
import ProfileView from "@/components/ProfileView";
import { CHALLENGES, publicChallenge } from "@/lib/challenges";
import { getLeaderboard, getPlatformState } from "@/lib/platform";

export const metadata: Metadata = { title: "My Profile", description: "Your Gamehack operator profile, achievements, and progress." };
export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const state = await getPlatformState();
  const leaderboard = await getLeaderboard(state);
  return <ProfileView initialLeaderboard={leaderboard} challenges={CHALLENGES.map(publicChallenge)} />;
}

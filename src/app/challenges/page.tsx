import type { Metadata } from "next";
import { CHALLENGES, publicChallenge } from "@/lib/challenges";
import { SOURCE_CHALLENGES } from "@/lib/sourceChallenges";
import { T } from "@/components/LanguageProvider";
import ChallengeExplorer, { ChallengeProgressBadge } from "@/components/ChallengeExplorer";

export const metadata: Metadata = { title: "Challenges", description: "Find your next flag in the Gamehack CTF arena." };
export const dynamic = "force-dynamic";

export default function ChallengesPage() {
  return <div><div className="mb-7 flex flex-wrap items-end justify-between gap-4"><div><div className="page-eyebrow"><T>THE ARENA / CHALLENGES</T></div><h1 className="page-title"><T>Every flag tells a story</T><span className="text-lime">.</span></h1><p className="page-description"><T>Think critically. Dig deeper. Learn something new with every solve.</T></p></div><ChallengeProgressBadge total={CHALLENGES.length + SOURCE_CHALLENGES.length} /></div><ChallengeExplorer challenges={CHALLENGES.map(publicChallenge)} sourceChallenges={SOURCE_CHALLENGES} /></div>;
}

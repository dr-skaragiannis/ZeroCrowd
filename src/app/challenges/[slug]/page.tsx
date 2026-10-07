import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { findChallenge, publicChallenge } from "@/lib/challenges";
import ChallengeWorkspace from "@/components/ChallengeWorkspace";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const challenge = findChallenge(slug);
  return { title: challenge?.title ?? "Challenge", description: challenge?.summary };
}

export default async function ChallengePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const challenge = findChallenge(slug);
  if (!challenge) notFound();
  return <ChallengeWorkspace challenge={publicChallenge(challenge)} />;
}

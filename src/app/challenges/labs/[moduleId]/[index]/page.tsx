import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { campaignById } from "@/data/lessons";
import { getSourceChallenge } from "@/lib/sourceChallenges";
import SourceChallengeWorkspace from "@/components/SourceChallengeWorkspace";

export const dynamic = "force-dynamic";
type RouteParams = { params: Promise<{ moduleId: string; index: string }> };

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { moduleId, index } = await params;
  const challenge = getSourceChallenge(moduleId, Number(index));
  return { title: challenge?.title.en ?? "Lab Challenge", description: challenge?.brief.en };
}

export default async function LabChallengePage({ params }: RouteParams) {
  const { moduleId, index: rawIndex } = await params;
  const index = Number(rawIndex);
  if (!Number.isInteger(index) || index < 0 || index > 1) notFound();
  const challenge = getSourceChallenge(moduleId, index);
  if (!challenge) notFound();
  const campaign = campaignById(challenge.campaignId)!;
  const stage = campaign.modules.findIndex(lesson => lesson.id === moduleId);
  const lesson = campaign.modules[stage];
  const previous = stage > 0 ? { id: campaign.modules[stage - 1].id, title: campaign.modules[stage - 1].title } : null;
  return <SourceChallengeWorkspace challenge={challenge} previous={previous}
    preparation={lesson.tasks.slice(0, 4).map(task => ({ id: task.id, instruction: task.instruction, explain: task.explain }))}
    theory={lesson.theory.slice(0, 2).map(section => ({ heading: section.heading, body: section.body, tip: section.tip }))}
    references={lesson.cheats.slice(0, 5)} />;
}

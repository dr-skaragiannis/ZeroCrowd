"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, LockKeyhole } from "lucide-react";
import { campaignById } from "@/data/lessons";
import { COURSE_META } from "@/lib/courseMeta";
import { hasPassedAssessment } from "@/lib/assessment";
import { useProgress } from "@/components/ProgressProvider";
import LabWorkspace from "@/components/LabWorkspace";

const EMPTY_COMPLETED_IDS: string[] = [];

export default function LabGate({ campaignId, moduleId }: { campaignId: string; moduleId: string }) {
  const progress = useProgress();
  const campaign = campaignById(campaignId)!;
  const index = campaign.modules.findIndex(lesson => lesson.id === moduleId);
  const previous = index > 0 ? campaign.modules[index - 1] : null;

  // The terminal is a local simulation, so guest-account setup must never block
  // the sandbox. In preview mode, let learners practice while persistence starts.
  if (!progress.isPreview && previous && !progress.labs.some(row => row.moduleId === previous.id && row.completed)) {
    return <div className="mx-auto max-w-2xl py-16 text-center"><span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-[#465449] bg-[#263329] text-lime"><LockKeyhole size={28} /></span><div className="page-eyebrow mt-7 justify-center">LAB LOCKED</div><h1 className="page-title mt-3">One step at a time<span className="text-lime">.</span></h1><p className="page-description mx-auto mt-3 max-w-md">Complete the previous lab in {COURSE_META[campaignId].title} to unlock this mission.</p><Link href={`/academy/${campaignId}/${previous.id}`} className="btn-primary mt-7">Go to {previous.title.en} <ArrowRight size={14} /></Link><div className="mt-5"><Link href={`/academy/${campaignId}`} className="inline-flex items-center gap-1 text-[11px] text-[#96a6ac] hover:text-lime"><ArrowLeft size={12} /> View path overview</Link></div></div>;
  }

  const saved = progress.isPreview ? undefined : progress.labs.find(row => row.moduleId === moduleId);
  const assessment = progress.isPreview ? undefined : progress.quizzes.find(row => row.moduleId === moduleId);
  const initialAssessmentPassed = Boolean(saved?.completed || (assessment && hasPassedAssessment(assessment.score, assessment.total)));

  return <LabWorkspace
    key={moduleId}
    campaignId={campaignId}
    moduleId={moduleId}
    playerId={progress.player.id}
    initialCompletedIds={saved?.completedTaskIds ?? EMPTY_COMPLETED_IDS}
    initiallyCompleted={saved?.completed ?? false}
    initialAssessmentPassed={initialAssessmentPassed}
    offlinePreview={progress.isPreview}
  />;
}

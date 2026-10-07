"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, LockKeyhole, TerminalSquare } from "lucide-react";
import { campaignById } from "@/data/lessons";
import { COURSE_META } from "@/lib/courseMeta";
import { useProgress } from "@/components/ProgressProvider";
import LabWorkspace from "@/components/LabWorkspace";

export default function LabGate({ campaignId, moduleId }: { campaignId: string; moduleId: string }) {
  const progress = useProgress();
  const campaign = campaignById(campaignId)!;
  const index = campaign.modules.findIndex(lesson => lesson.id === moduleId);
  const previous = index > 0 ? campaign.modules[index - 1] : null;

  if (progress.isPreview) {
    return <div className="mx-auto grid min-h-[50vh] max-w-lg place-content-center text-center" role="status">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-xl border border-[#4a6648] bg-[#273b2a] text-lime"><TerminalSquare size={26} /></span>
      <h1 className="display-font mt-5 text-[20px] font-bold">Preparing your sandbox...</h1>
      <p className="mt-2 text-[11px] text-[#91a4ad]">Your training space will be ready in a moment.</p>
    </div>;
  }

  if (previous && !progress.labs.some(row => row.moduleId === previous.id && row.completed)) {
    return <div className="mx-auto max-w-2xl py-16 text-center"><span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-[#465449] bg-[#263329] text-lime"><LockKeyhole size={28} /></span><div className="page-eyebrow mt-7 justify-center">LAB LOCKED</div><h1 className="page-title mt-3">One step at a time<span className="text-lime">.</span></h1><p className="page-description mx-auto mt-3 max-w-md">Complete the previous lab in {COURSE_META[campaignId].title} to unlock this mission.</p><Link href={`/academy/${campaignId}/${previous.id}`} className="btn-primary mt-7">Go to {previous.title.en} <ArrowRight size={14} /></Link><div className="mt-5"><Link href={`/academy/${campaignId}`} className="inline-flex items-center gap-1 text-[11px] text-[#96a6ac] hover:text-lime"><ArrowLeft size={12} /> View path overview</Link></div></div>;
  }

  const saved = progress.labs.find(row => row.moduleId === moduleId);
  return <LabWorkspace key={`${progress.player.id}:${moduleId}`} campaignId={campaignId} moduleId={moduleId} playerId={progress.player.id} initialCompletedIds={saved?.completedTaskIds ?? []} initiallyCompleted={saved?.completed ?? false} />;
}

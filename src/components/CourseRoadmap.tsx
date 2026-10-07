"use client";


import { T } from "@/components/LanguageProvider";
import Link from "next/link";
import { ArrowRight, BookOpen, Check, ChevronRight, Flag, LockKeyhole, ShieldCheck, Trophy, Zap } from "lucide-react";
import { campaignById } from "@/data/lessons";
import { COURSE_META } from "@/lib/courseMeta";
import { pathProgress } from "@/lib/progress";
import { useProgress } from "@/components/ProgressProvider";
import { ProgressBar } from "@/components/ui";

export function CourseStartLink({ campaignId }: { campaignId: string }) {
  const progress = useProgress();
  const campaign = campaignById(campaignId)!;
  const journey = pathProgress(campaign, progress);
  return <Link href={`/academy/${campaignId}/${journey.next.id}`} className="btn-primary mt-7">{journey.started ? "Continue learning" : "Start learning"}<ArrowRight size={14} /></Link>;
}

export default function CourseRoadmap({ campaignId }: { campaignId: string }) {
  const progress = useProgress();
  const campaign = campaignById(campaignId)!;
  const meta = COURSE_META[campaignId];
  const journey = pathProgress(campaign, progress);
  return <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.78fr)_minmax(290px,1fr)]"><div><div className="mb-5"><h2 className="display-font text-[21px] font-bold tracking-[-.04em]"><T>Your mission roadmap</T></h2><p className="mt-1 text-[11px] text-[#8e9da8]"><T>Work through each lab to unlock the next stage.</T></p></div><div className="space-y-3">{campaign.modules.map((lesson, index) => {
    const saved = progress.labs.find(item => item.moduleId === lesson.id);
    const unlocked = index === 0 || progress.labs.some(item => item.moduleId === campaign.modules[index - 1].id && item.completed);
    const complete = !!saved?.completed;
    const started = !!saved && !complete;
    const content = <div className={`panel group relative flex gap-4 p-4 transition-all md:p-5 ${unlocked ? "hover:border-[#607457]" : "opacity-60"}`}><div className="flex w-11 shrink-0 flex-col items-center"><span className={`grid h-10 w-10 place-items-center rounded-lg border text-[12px] font-bold ${complete ? "border-[#597b52] bg-[#263e2d] text-lime" : unlocked ? "border-[#61764d] bg-[#30402e] text-lime" : "border-[#3d4853] bg-[#26303a] text-[#8493a0]"}`}>{complete ? <Check size={18} /> : unlocked ? String(index + 1).padStart(2, "0") : <LockKeyhole size={15} />}</span>{index < campaign.modules.length - 1 && <span className="absolute top-[61px] bottom-[-13px] ml-[-1px] w-px bg-[#33413d]" />}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className="text-[9px] font-bold tracking-[.14em] text-[#91a39d]"><T>LAB</T> {String(index + 1).padStart(2, "0")}</span>{complete && <span className="rounded bg-[#2b442d] px-1.5 py-0.5 text-[9px] font-bold text-lime"><T>COMPLETE</T></span>}{started && <span className="rounded bg-[#3c382b] px-1.5 py-0.5 text-[9px] font-bold text-[#ecc58a]"><T>IN PROGRESS</T></span>}</div><h3 className="display-font mt-1.5 text-[15px] font-bold tracking-[-.03em] group-hover:text-lime">{lesson.title.en}</h3><p className="mt-1 text-[10px] leading-relaxed text-[#90a0ab]">{lesson.subtitle.en}</p><div className="mt-3 flex flex-wrap items-center gap-3 text-[10px] text-[#81929e]"><span className="inline-flex items-center gap-1"><Flag size={11} />{lesson.tasks.length + 2} <T>objectives</T></span><span className="inline-flex items-center gap-1"><Zap size={11} />{(lesson.tasks.length * 10) + 80} XP</span><span>{lesson.difficulty <= 2 ? "Beginner" : lesson.difficulty <= 3 ? "Intermediate" : "Advanced"}</span></div></div><span className={`self-center ${unlocked ? "text-lime" : "text-[#748592]"}`}>{unlocked ? <ChevronRight size={17} /> : <LockKeyhole size={15} />}</span></div>;
    return unlocked ? <Link key={lesson.id} href={`/academy/${campaign.id}/${lesson.id}`} className="block">{content}</Link> : <div key={lesson.id}>{content}</div>;
  })}</div></div>
    <div className="space-y-5 xl:sticky xl:top-[92px]"><section className="panel p-5"><div className="flex items-center gap-4"><div className="progress-ring" style={{ "--progress": `${journey.percent}%` } as React.CSSProperties}><span>{journey.percent}%</span></div><div><span className="text-[10px] font-bold tracking-[.1em] text-lime uppercase"><T>Your progress</T></span><h3 className="display-font mt-1 text-[18px] font-bold">{journey.completed} <T>of</T> {journey.total} <T>labs</T></h3><p className="mt-1 text-[10px] text-[#889ba4]">{journey.completed ? "Keep the momentum going." : "Your journey starts here."}</p></div></div><div className="mt-5"><ProgressBar percent={journey.percent} tone={meta.tone === "violet" ? "violet" : meta.tone === "cyan" ? "cyan" : "lime"} /></div><Link href={`/academy/${campaign.id}/${journey.next.id}`} className="btn-primary mt-5 w-full">{journey.started ? "Resume next lab" : "Begin first lab"} <ArrowRight size={14} /></Link></section><section className="panel p-5"><h3 className="display-font flex items-center gap-2 text-[15px] font-bold"><Trophy size={16} className="text-lime" /> <T>Skills you&apos;ll build</T></h3><div className="mt-4 flex flex-wrap gap-2">{meta.skills.map(skill => <span className="tag" key={skill}>{skill}</span>)}</div><p className="mt-4 text-[11px] leading-relaxed text-[#8d9ca6]"><T>Complete objectives and challenges to earn XP and advance your operator rank.</T></p></section><section className="panel flex gap-3 p-4"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#253d33] text-lime"><ShieldCheck size={17} /></span><div><strong className="text-[11px]"><T>A safe place to experiment</T></strong><p className="mt-1 text-[10px] leading-relaxed text-[#91a1a9]"><T>Every command runs in a fictional local simulation. No live targets or host systems are affected.</T></p></div></section></div>
  </div>;
}

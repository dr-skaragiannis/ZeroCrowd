"use client";


import { T } from "@/components/LanguageProvider";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, BookOpen, Clock3, Network, TerminalSquare } from "lucide-react";
import { CAMPAIGNS } from "@/data/lessons";
import { COURSE_META } from "@/lib/courseMeta";
import { pathProgress } from "@/lib/progress";
import { useProgress } from "@/components/ProgressProvider";
import { ProgressBar } from "@/components/ui";

export function AcademySummary() {
  const { labs } = useProgress();
  const completed = labs.filter(item => item.completed).length;
  const total = CAMPAIGNS.reduce((sum, campaign) => sum + campaign.modules.length, 0);
  return <div className="hidden gap-4 rounded-lg border border-[#314036] bg-[#1b2821] px-4 py-3 sm:flex"><div><strong className="display-font block text-[17px] leading-none text-lime">{completed}</strong><span className="text-[9px] text-[#98aa9e]"><T>Labs cleared</T></span></div><div className="w-px bg-[#435346]" /><div><strong className="display-font block text-[17px] leading-none text-[#eef4ee]">{total}</strong><span className="text-[9px] text-[#98aa9e]"><T>Labs available</T></span></div></div>;
}

export function AcademyCards() {
  const progress = useProgress();
  return <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">{CAMPAIGNS.map(campaign => {
    const meta = COURSE_META[campaign.id];
    const journey = pathProgress(campaign, progress);
    const color = meta.tone === "violet" ? "#bdaeff" : meta.tone === "cyan" ? "#8de5e9" : meta.tone === "orange" ? "#f1bc92" : "#c5f47b";
    return <Link href={`/academy/${campaign.id}`} key={campaign.id} className="panel panel-hover group overflow-hidden"><div className="relative h-[147px] overflow-hidden bg-cover bg-center" style={{ backgroundImage: meta.image ? `linear-gradient(0deg,rgba(19,25,31,.62),rgba(19,25,31,.03)),url('${meta.image}')` : meta.gradient }}><div className="absolute inset-0 opacity-25" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.13) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.13) 1px,transparent 1px)", backgroundSize: "28px 28px", maskImage: "linear-gradient(to right,transparent,black)" }} />{!meta.image && <div className="absolute right-10 top-8 grid h-[90px] w-[90px] place-items-center rounded-[18px] border border-white/15 bg-white/5 shadow-[0_0_0_20px_rgba(255,255,255,.035),0_0_0_42px_rgba(255,255,255,.02)]" style={{ color }}>{campaign.id.includes("linux") || campaign.id === "forge" || campaign.id === "sudorun" ? <TerminalSquare size={48} strokeWidth={1} /> : <Network size={48} strokeWidth={1} />}</div>}<span className="absolute left-4 top-4 rounded border border-white/15 bg-[#111a20]/70 px-2 py-1 text-[9px] font-bold tracking-[.1em] text-white/85"><T>PATH</T> {String(campaign.pathNumber).padStart(2, "0")}</span><span className="absolute bottom-4 left-4 text-[9px] font-bold tracking-[.14em]" style={{ color }}>{meta.category}</span></div><div className="p-5"><div className="flex items-start justify-between gap-3"><div><h3 className="display-font text-[19px] font-bold tracking-[-.045em] group-hover:text-lime transition-colors">{meta.title}</h3><p className="mt-1 text-[11px] leading-relaxed text-[#96a5b0]">{meta.short}</p></div><ArrowUpRight size={16} className="shrink-0 text-[#92a4a9]" /></div><div className="mt-5 flex flex-wrap gap-2 text-[10px] text-[#a6b2ba]"><span className="inline-flex items-center gap-1.5"><BookOpen size={12} />{campaign.modules.length} <T>labs</T></span><span className="text-[#53616d]">·</span><span className="inline-flex items-center gap-1.5"><Clock3 size={12} />{meta.duration}</span><span className="text-[#53616d]">·</span><span>{meta.level}</span></div><div className="mt-5 flex justify-between text-[10px]"><span className="text-[#8999a3]">{journey.completed} / {journey.total} <T>completed</T></span><span className="font-bold" style={{ color }}>{journey.percent}%</span></div><div className="mt-2"><ProgressBar percent={journey.percent} tone={meta.tone === "violet" ? "violet" : meta.tone === "cyan" ? "cyan" : "lime"} /></div><div className="mt-5 flex items-center justify-between border-t border-[#2c3640] pt-4"><span className="text-[11px] font-bold text-lime">{journey.started ? "Continue path" : "Start path"}</span><ArrowRight size={15} className="text-lime transition-transform group-hover:translate-x-1" /></div></div></Link>;
  })}</div>;
}

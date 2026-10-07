import { T } from "@/components/LanguageProvider";
import type { Metadata } from "next";
import { Map, ShieldCheck, TerminalSquare } from "lucide-react";
import { CAMPAIGNS } from "@/data/lessons";
import { TOTAL_LABS } from "@/lib/platform";
import { AcademyCards, AcademySummary } from "@/components/AcademyLive";

export const metadata: Metadata = { title: "Learning Paths", description: "Train with hands-on Gamehack cyber range labs." };
export const dynamic = "force-dynamic";

export default function AcademyPage() {
  return <div className="space-y-7"><div className="flex flex-wrap items-end justify-between gap-4"><div><div className="page-eyebrow"><T>THE ACADEMY / LEARNING PATHS</T></div><h1 className="page-title"><T>Build skills that stick</T><span className="text-lime">.</span></h1><p className="page-description"><T>A guided journey from your first terminal command to complex security operations.</T></p></div><AcademySummary /></div>
    <section className="panel relative overflow-hidden p-6 md:p-8" style={{ background: "radial-gradient(circle at 80% 50%,rgba(105,158,103,.22),transparent 35%),linear-gradient(110deg,#1d2924,#182128 65%,#1b2427)" }}><div className="relative z-10 max-w-[620px]"><span className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[.15em] text-lime"><span className="status-dot" /> <T>HANDS-ON CYBER TRAINING</T></span><h2 className="display-font mt-3 text-[26px] font-bold leading-tight tracking-[-.05em] md:text-[33px]"><T>Don&apos;t just read about security.</T><br /><span className="text-lime"><T>Get your hands on it.</T></span></h2><p className="mt-3 text-[11px] leading-relaxed text-[#aabbb1]"><T>Every path is made of interactive labs with a persistent, simulated Linux environment. Practice the process, not just the answer. No real systems are touched.</T></p><div className="mt-5 flex flex-wrap gap-4 text-[10px] font-semibold text-[#c6d9cb]"><span className="flex items-center gap-1.5"><Map size={14} className="text-lime" /> {CAMPAIGNS.length} <T>guided paths</T></span><span className="flex items-center gap-1.5"><TerminalSquare size={14} className="text-lime" /> {TOTAL_LABS} <T>interactive labs</T></span><span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-lime" /> <T>Safe sandbox</T></span></div></div><div className="absolute -right-10 -top-16 hidden h-72 w-72 rounded-full border border-[#8fb37e]/15 shadow-[0_0_0_32px_rgba(162,207,132,.04),0_0_0_74px_rgba(162,207,132,.025),0_0_0_122px_rgba(162,207,132,.015)] md:block"><TerminalSquare size={84} strokeWidth={.7} className="absolute left-[80px] top-[125px] text-lime/45" /></div></section>
    <div className="flex flex-wrap items-end justify-between gap-3"><div><h2 className="display-font text-[21px] font-bold tracking-[-.04em]"><T>Choose your path</T></h2><p className="mt-1 text-[11px] text-[#8d9ca7]"><T>Start anywhere. Progress at your own pace.</T></p></div><span className="text-[10px] font-semibold text-[#82939f]">{CAMPAIGNS.length} <T>paths available</T></span></div>
    <AcademyCards />
  </div>;
}

import { T } from "@/components/LanguageProvider";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Trophy } from "lucide-react";
import { getLeaderboard, getPlatformState } from "@/lib/platform";
import LeaderboardView from "@/components/LeaderboardView";

export const metadata: Metadata = { title: "Leaderboard", description: "The top operators of the Gamehack cyber range." };
export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
  const state = await getPlatformState();
  const entries = await getLeaderboard(state);
  return <div className="space-y-7"><div className="flex flex-wrap items-end justify-between gap-4"><div><div className="page-eyebrow"><T>THE COMMUNITY / RANKINGS</T></div><h1 className="page-title"><T>The operator leaderboard</T><span className="text-lime">.</span></h1><p className="page-description"><T>Every flag matters. Every lab counts. Earn your place among the best.</T></p></div><div className="inline-flex items-center gap-2 rounded-md border border-[#4a6245] bg-[#213027] px-3 py-2 text-[10px] font-bold tracking-[.1em] text-lime"><span className="status-dot" /> <T>ALL-TIME RANKINGS</T></div></div>
    <div className="panel relative overflow-hidden p-6 md:p-7" style={{ background: "radial-gradient(circle at 83% 50%,rgba(171,148,244,.14),transparent 34%),linear-gradient(105deg,#1b2525,#1a202c)" }}><div className="relative z-10 flex flex-wrap items-center gap-5"><div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl border border-[#5e6c47] bg-[#31402b] text-lime"><Trophy size={27} /></div><div className="flex-1"><span className="text-[10px] font-bold tracking-[.13em] text-lime"><T>THE RACE NEVER STOPS</T></span><h2 className="display-font mt-1 text-[22px] font-bold tracking-[-.045em]"><T>Greatness is earned, not given.</T></h2><p className="mt-1 text-[11px] text-[#9babb2]"><T>Solve challenges, complete labs, and push past yesterday&apos;s version of yourself.</T></p></div><Link href="/challenges" className="btn-primary"><T>Earn more XP</T> <ArrowRight size={14} /></Link></div></div>
    <LeaderboardView initialEntries={entries} />
  </div>;
}

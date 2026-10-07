import { T } from "@/components/LanguageProvider";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Flag, Zap } from "lucide-react";
import { getLiveFeed, getPlatformState } from "@/lib/platform";
import ActivityTimeline, { ActivitySummary } from "@/components/ActivityTimeline";

export const metadata: Metadata = { title: "Activity Feed", description: "See what is happening across the Gamehack arena." };
export const dynamic = "force-dynamic";

export default async function ActivityPage() {
  const state = await getPlatformState();
  const community = getLiveFeed(state).filter(item => !item.you).map(item => ({ ...item, time: item.time.toISOString() }));
  return <div className="space-y-7"><div className="flex flex-wrap items-end justify-between gap-4"><div><div className="page-eyebrow"><T>THE COMMUNITY / LIVE FEED</T></div><h1 className="page-title"><T>The arena is alive</T><span className="text-lime">.</span></h1><p className="page-description"><T>Every solved puzzle and completed lab is another step forward.</T></p></div><span className="inline-flex items-center gap-2 rounded-md border border-[#465a46] bg-[#203027] px-3 py-2 text-[10px] font-bold tracking-widest text-lime"><span className="status-dot" /> <T>LIVE ACTIVITY</T></span></div>
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(290px,1fr)]"><div><div className="mb-4"><h2 className="display-font text-[20px] font-bold"><T>Recent activity</T></h2><p className="mt-1 text-[11px] text-[#8b9ba6]"><T>Filter the feed to see your own milestones or the wider community.</T></p></div><ActivityTimeline events={community} /></div><div className="space-y-5"><div className="panel p-5"><span className="grid h-10 w-10 place-items-center rounded-lg bg-[#2d422d] text-lime"><Zap size={19} /></span><h3 className="display-font mt-4 text-[18px] font-bold"><T>Your momentum</T></h3><p className="mt-1 text-[11px] leading-relaxed text-[#91a1a9]"><T>The best operators never stop learning. Here&apos;s the ground you&apos;ve covered.</T></p><ActivitySummary /><Link href="/profile" className="mt-5 inline-flex items-center gap-1 text-[11px] font-bold text-lime"><T>View your profile</T> <ArrowRight size={13} /></Link></div><div className="panel p-5"><span className="text-[10px] font-bold tracking-widest text-violet"><T>UP NEXT</T></span><h3 className="display-font mt-2 text-[16px] font-bold"><T>Write the next story.</T></h3><p className="mt-1 text-[11px] leading-relaxed text-[#8f9fa9]"><T>Pick a challenge, follow your curiosity, and put your name in the feed.</T></p><Link href="/challenges" className="btn-secondary mt-4 w-full"><T>Explore challenges</T> <ArrowRight size={13} /></Link></div></div></div>
  </div>;
}

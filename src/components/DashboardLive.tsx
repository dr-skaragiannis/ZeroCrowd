"use client";


import { T } from "@/components/LanguageProvider";
import Link from "next/link";
import { Activity, ArrowRight, ArrowUpRight, Flame, Flag, Play, ShieldCheck, Sparkles, Target, TerminalSquare, Trophy, Users, Zap } from "lucide-react";
import { CAMPAIGNS } from "@/data/lessons";
import { useProgress } from "@/components/ProgressProvider";
import { Avatar, ChallengeCard, ProgressBar, StatCard, timeAgo } from "@/components/ui";
import type { PublicChallenge } from "@/lib/challenges";
import type { LeaderboardEntry } from "@/lib/platform";
import { operatorRank, pathProgress } from "@/lib/progress";

type CommunityEvent = {
  id: string;
  handle: string;
  text: string;
  time: string;
  tone: "lime" | "violet" | "cyan" | "orange";
  points?: number;
};

export function DashboardWelcome() {
  const { player } = useProgress();
  return <><T>Welcome back,</T> {player.displayName.split(" ")[0]}<span className="text-lime">.</span></>;
}

export function DashboardResume() {
  const progress = useProgress();
  const raven = CAMPAIGNS.find(path => path.id === "raven")!;
  return <Link className="btn-secondary" href={`/academy/raven/${pathProgress(raven, progress).next.id}`}><Play size={14} fill="currentColor" /> <T>Resume training</T></Link>;
}

export function DashboardStats({ ranking }: { ranking: LeaderboardEntry[] }) {
  const progress = useProgress();
  return <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
    <StatCard label="Total experience" value={progress.xp.toLocaleString()} foot="XP earned in the arena" icon={<Zap size={17} />} color="lime" />
    <StatCard label="Global rank" value={`#${String(operatorRank(progress.xp, ranking)).padStart(2, "0")}`} foot="Among active operators" icon={<Trophy size={17} />} color="violet" />
    <StatCard label="Flags captured" value={String(progress.solves.length).padStart(2, "0")} foot="Across all categories" icon={<Flag size={17} />} color="cyan" />
    <StatCard label="Training streak" value={`${progress.streak} days`} foot={`${progress.labs.filter(row => row.completed).length} labs completed`} icon={<Flame size={17} />} color="orange" />
  </div>;
}

export function DashboardJourney() {
  const progress = useProgress();
  const raven = CAMPAIGNS.find(path => path.id === "raven")!;
  const journey = pathProgress(raven, progress);
  return <div className="panel overflow-hidden md:flex"><div className="relative min-h-[190px] w-full shrink-0 bg-[#1c2030] md:w-[38%]" style={{ backgroundImage: "linear-gradient(90deg,rgba(22,25,38,.05),rgba(22,25,38,.25)),url('/images/operation-raven.png')", backgroundSize: "cover", backgroundPosition: "center" }}><div className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-md border border-[#a99cff]/30 bg-[#221c33]/85 px-2.5 py-1.5 text-[9px] font-bold tracking-[.08em] text-[#c5b9ff]"><ShieldCheck size={12} /> <T>FEATURED OPERATION</T></div></div><div className="flex flex-1 flex-col justify-center p-5 md:p-6"><div className="mb-2 flex items-center justify-between gap-2"><span className="text-[10px] font-bold tracking-[.12em] text-[#b9a8ff] uppercase"><T>Learning path 06 / 07</T></span><span className="text-[11px] font-bold text-[#d4ecc0]">{journey.percent}<T>% complete</T></span></div><h3 className="display-font text-[20px] font-bold tracking-[-.04em]"><T>Operation Raven</T></h3><p className="mt-1 text-[11px] leading-relaxed text-[#91a0ac]"><T>A boot2root CTF box. Follow the trail from reconnaissance to root.</T></p><div className="mt-5"><ProgressBar percent={journey.percent} tone="violet" /><div className="mt-2 flex justify-between text-[10px] text-[#83929f]"><span>{journey.completed} <T>of</T> {journey.total} <T>labs completed</T></span><span><T>Next:</T> {journey.next.title.en.replace("Raven — ", "")}</span></div></div><Link href={`/academy/raven/${journey.next.id}`} className="mt-5 inline-flex w-fit items-center gap-1.5 text-[11px] font-bold text-lime hover:gap-2.5 transition-all"><T>Continue operation</T> <ArrowRight size={14} /></Link></div></div>;
}

export function DashboardRecommendations({ recommendations }: { recommendations: PublicChallenge[] }) {
  const { solves } = useProgress();
  return <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{recommendations.map(challenge => <ChallengeCard key={challenge.id} challenge={challenge} compact solved={solves.some(row => row.challengeId === challenge.id)} />)}</div>;
}

export function DashboardPaths() {
  const progress = useProgress();
  const forge = CAMPAIGNS.find(path => path.id === "forge")!;
  const dfir = CAMPAIGNS.find(path => path.id === "dfir-fieldwork")!;
  const foundation = pathProgress(forge, progress);
  const fieldwork = pathProgress(dfir, progress);
  return <div className="grid gap-3 md:grid-cols-2">
    <Link href="/academy/forge" className="panel panel-hover overflow-hidden"><div className="relative h-[95px] overflow-hidden bg-[radial-gradient(circle_at_75%_50%,#42634c,#202f2a_46%,#1c2524)]"><TerminalSquare size={57} strokeWidth={1} className="absolute right-9 top-4 text-[#afec91]/70" /><span className="absolute bottom-3 left-4 text-[9px] font-bold tracking-[.13em] text-[#caf4b3]"><T>PATH 01 / FOUNDATIONS</T></span></div><div className="p-4"><div className="flex items-start justify-between gap-2"><div><h3 className="display-font text-[15px] font-bold"><T>Linux Foundations</T></h3><p className="mt-1 text-[10px] text-[#8d9da7]"><T>The essential skills every operator needs.</T></p></div><ArrowUpRight size={15} className="text-[#aab8bc]" /></div><div className="mt-4 flex items-center justify-between text-[10px] text-[#91a1a8]"><span>{forge.modules.length} <T>labs · Beginner</T></span><strong className="text-lime">{foundation.percent}%</strong></div><div className="mt-2"><ProgressBar percent={foundation.percent} /></div></div></Link>
    <Link href="/academy/dfir-fieldwork" className="panel panel-hover overflow-hidden"><div className="relative h-[95px] bg-cover bg-center" style={{ backgroundImage: "linear-gradient(90deg,rgba(17,34,43,.26),rgba(17,34,43,.1)),url('/images/dfir-fieldwork.png')" }}><span className="absolute bottom-3 left-4 text-[9px] font-bold tracking-[.13em] text-[#9feaf0]"><T>PATH 07 / BLUE TEAM</T></span></div><div className="p-4"><div className="flex items-start justify-between gap-2"><div><h3 className="display-font text-[15px] font-bold"><T>DFIR Fieldwork</T></h3><p className="mt-1 text-[10px] text-[#8d9da7]"><T>Follow the evidence. Find the truth.</T></p></div><ArrowUpRight size={15} className="text-[#aab8bc]" /></div><div className="mt-4 flex items-center justify-between text-[10px] text-[#91a1a8]"><span>{dfir.modules.length} <T>labs · Intermediate</T></span><strong className="text-cyan">{fieldwork.percent}%</strong></div><div className="mt-2"><ProgressBar percent={fieldwork.percent} tone="cyan" /></div></div></Link>
  </div>;
}

export function DashboardDailyObjective() {
  const { solves } = useProgress();
  const today = new Date().toDateString();
  const solvedToday = solves.some(row => new Date(row.solvedAt).toDateString() === today);
  return <div className="panel relative overflow-hidden p-5" style={{ background: "radial-gradient(circle at 100% 0%,rgba(197,244,123,.1),transparent 55%),#151d22" }}><div className="flex items-start justify-between"><span className="grid h-10 w-10 place-items-center rounded-lg bg-[#30432c] text-lime"><Target size={21} /></span><span className="rounded border border-[#536842] bg-[#273b2a] px-2 py-1 text-[9px] font-bold tracking-[.1em] text-lime"><T>+100 XP GOAL</T></span></div><h3 className="display-font mt-5 text-[17px] font-bold"><T>One flag a day.</T></h3><p className="mt-1 text-[11px] leading-relaxed text-[#96a7a5]"><T>Small wins build serious skills. Capture one flag today to keep the momentum.</T></p><div className="mt-5 flex items-center justify-between text-[10px]"><span className="text-[#97a9a1]"><T>Today&apos;s progress</T></span><strong className="text-lime">{solvedToday ? "1 / 1" : "0 / 1"}</strong></div><div className="mt-2"><ProgressBar percent={solvedToday ? 100 : 0} /></div><Link href="/challenges" className="mt-5 inline-flex items-center gap-1.5 text-[11px] font-bold text-lime">{solvedToday ? "Explore more challenges" : "Find a challenge"} <ArrowRight size={13} /></Link></div>;
}

export function DashboardTopOperators({ ranking }: { ranking: LeaderboardEntry[] }) {
  const progress = useProgress();
  const currentRank = operatorRank(progress.xp, ranking);
  const leaders = ranking.filter(entry => !entry.isYou).slice(0, 3);
  return <div className="panel overflow-hidden"><div className="flex items-center justify-between border-b border-[#29343e] px-4 py-3 text-[9px] font-bold tracking-[.13em] text-[#758694]"><span><T>OPERATOR</T></span><span><T>TOTAL XP</T></span></div>{leaders.map((entry, index) => <div key={entry.id} className="flex items-center gap-2.5 border-b border-[#28323c] px-4 py-3 last:border-0"><span className={`w-5 text-center display-font text-[13px] font-bold ${index === 0 ? "text-[#e6cb89]" : index === 1 ? "text-[#bbc9d1]" : "text-[#bd9980]"}`}>{String(index + 1).padStart(2, "0")}</span><Avatar name={entry.displayName} color={entry.avatar} size="sm" /><div className="min-w-0 flex-1"><strong className="block truncate text-[11px] font-semibold">{entry.displayName}</strong><span className="text-[9px] text-[#778896]"><T>Elite operator</T></span></div><strong className="mono text-[11px] font-bold text-[#d9e8dd]">{entry.xp.toLocaleString()}</strong></div>)}<div className="m-2 flex items-center gap-2.5 rounded-lg border border-[#415a3e] bg-[#253428] px-2 py-2.5"><span className="w-5 text-center display-font text-[12px] font-bold text-lime">{String(currentRank).padStart(2, "0")}</span><Avatar name={progress.player.displayName} size="sm" /><div className="min-w-0 flex-1"><strong className="block truncate text-[11px] font-bold text-lime"><T>You</T> <span className="font-normal text-[#94a49a]">· {progress.player.handle}</span></strong><span className="text-[9px] text-[#96ab96]"><T>Field operative</T></span></div><strong className="mono text-[11px] font-bold text-lime">{progress.xp.toLocaleString()}</strong></div></div>;
}

export function DashboardActivity({ community }: { community: CommunityEvent[] }) {
  const { activities } = useProgress();
  const yours = activities.map(item => ({ id: item.id, handle: "You", text: item.title.charAt(0).toLowerCase() + item.title.slice(1), time: item.createdAt, tone: item.type === "solve" ? "lime" as const : "cyan" as const, points: item.points }));
  const feed = [...community, ...yours].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 4);
  return <div className="panel px-4">{feed.map((item, index) => <div key={item.id} className={`flex gap-3 py-3.5 ${index !== feed.length - 1 ? "border-b border-[#2b3540]" : ""}`}><span className={`mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-[7px] ${item.tone === "violet" ? "bg-[#352d4a] text-violet" : item.tone === "cyan" ? "bg-[#223d42] text-cyan" : "bg-[#2c3d2c] text-lime"}`}>{item.tone === "violet" ? <Sparkles size={13} /> : item.tone === "cyan" ? <Activity size={13} /> : <Flag size={13} />}</span><div className="min-w-0 flex-1"><p className="text-[11px] leading-[1.45] text-[#a9b8bc]"><strong className="text-[#edf2eb]">{item.handle}</strong> {item.text}</p><span className="mt-1 block text-[9px] text-[#71828e]">{timeAgo(item.time)}</span></div>{item.points ? <span className="shrink-0 text-[10px] font-bold text-lime">+{item.points} XP</span> : null}</div>)}</div>;
}

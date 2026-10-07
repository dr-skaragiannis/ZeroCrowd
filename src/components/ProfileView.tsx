"use client";


import { T } from "@/components/LanguageProvider";
import Link from "next/link";
import { ArrowRight, Award, BookOpen, CalendarDays, Check, ChevronRight, Fingerprint, Flag, Flame, LockKeyhole, MapPin, Settings2, ShieldCheck, Sparkles, TerminalSquare, Trophy, Zap } from "lucide-react";
import { Avatar, ProgressBar, SectionTitle, StatCard, timeAgo } from "@/components/ui";
import ProfileEditor from "@/components/ProfileEditor";
import AccountSecurity from "@/components/AccountSecurity";
import { useProgress } from "@/components/ProgressProvider";
import type { ChallengeCategory, PublicChallenge } from "@/lib/challenges";
import { operatorRank, operatorTitle } from "@/lib/progress";
import type { LeaderboardEntry } from "@/lib/platform";

const skills: { name: ChallengeCategory; tone: "lime" | "violet" | "cyan" }[] = [
  { name: "Web Exploitation", tone: "lime" },
  { name: "Cryptography", tone: "violet" },
  { name: "Digital Forensics", tone: "cyan" },
  { name: "OSINT", tone: "lime" },
  { name: "Network Security", tone: "cyan" },
];

export default function ProfileView({ initialLeaderboard, challenges }: { initialLeaderboard: LeaderboardEntry[]; challenges: PublicChallenge[] }) {
  const progress = useProgress();
  const { player, xp, level, streak, solves, labs, bookmarks, activities } = progress;
  const rank = operatorRank(xp, initialLeaderboard);
  const completedLabs = labs.filter(row => row.completed).length;
  const solvedIds = new Set(solves.map(row => row.challengeId));
  const saved = challenges.filter(challenge => bookmarks.includes(challenge.id));
  const achievements = [
    { name: "First Blood", description: "Capture your first flag", icon: Flag, unlocked: solves.length >= 1, tone: "lime" },
    { name: "Shell Initiate", description: "Complete your first lab", icon: TerminalSquare, unlocked: completedLabs >= 1, tone: "cyan" },
    { name: "On a Roll", description: "Train for 3 days in a row", icon: Flame, unlocked: streak >= 3, tone: "orange" },
    { name: "Rising Star", description: "Earn 500 total XP", icon: Sparkles, unlocked: xp >= 500, tone: "violet" },
    { name: "Codebreaker", description: "Solve a crypto challenge", icon: LockKeyhole, unlocked: solves.some(row => challenges.find(c => c.id === row.challengeId)?.category === "Cryptography"), tone: "violet" },
    { name: "The Investigator", description: "Solve a forensics case", icon: Fingerprint, unlocked: solves.some(row => challenges.find(c => c.id === row.challengeId)?.category === "Digital Forensics"), tone: "cyan" },
  ];

  return <div className="space-y-7">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><div className="page-eyebrow"><T>YOUR ACCOUNT / PROFILE</T></div><h1 className="page-title"><T>Your operator file</T><span className="text-lime">.</span></h1><p className="page-description"><T>A record of where you&apos;ve been and how far you&apos;ve come.</T></p></div><Link href="/settings" className="btn-secondary"><Settings2 size={14} /> <T>Account settings</T></Link></div>

    <section className="panel overflow-hidden"><div className="relative h-[110px] overflow-hidden" style={{ background: "radial-gradient(circle at 78% 0%,rgba(197,244,123,.19),transparent 34%),linear-gradient(110deg,#253728,#1c2d30 58%,#1b252e)" }}><div className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.12) 1px,transparent 1px)", backgroundSize: "26px 26px" }} /><span className="absolute right-6 top-5 mono text-[10px] tracking-widest text-[#829d91]"><T>OPERATOR // GAMEHACK</T></span></div>
      <div className="relative flex flex-wrap items-end justify-between gap-4 px-6 pb-6 md:px-8"><div className="flex flex-wrap items-end gap-4"><div className="-mt-8 rounded-2xl border-4 border-[#141a23]"><Avatar name={player.displayName} size="lg" /></div><div className="pb-1"><div className="flex flex-wrap items-center gap-2"><h2 className="display-font text-[24px] font-bold tracking-[-.045em]">{player.displayName}</h2><span className="rounded border border-[#526843] bg-[#29392b] px-2 py-1 text-[9px] font-bold text-lime"><T>LEVEL</T> {level}</span></div><p className="mt-1 text-[11px] text-[#91a2ab]">@{player.handle} <span className="mx-1 text-[#52616a]">·</span> {operatorTitle(xp)}</p></div></div><div className="mb-1"><ProfileEditor /></div>
        <div className="w-full border-t border-[#2c3740] pt-4"><p className="text-[11px] text-[#acb9b8]">{player.bio}</p><div className="mt-3 flex flex-wrap gap-4 text-[10px] text-[#82959e]"><span className="inline-flex items-center gap-1.5"><MapPin size={12} />{player.location}</span><span className="inline-flex items-center gap-1.5"><CalendarDays size={12} /><T>Joined</T> {new Date(player.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span><span className="inline-flex items-center gap-1.5"><ShieldCheck size={12} />{player.isGuest ? "Guest operator" : "Verified operator"}</span></div></div></div>
    </section>

    <div id="account-security"><AccountSecurity /></div>

    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4"><StatCard label="Total XP" value={xp.toLocaleString()} foot="Keep earning" icon={<Zap size={17} />} /><StatCard label="Global rank" value={`#${String(rank).padStart(2, "0")}`} foot="Among operators" icon={<Trophy size={17} />} color="violet" /><StatCard label="Flags captured" value={String(solves.length).padStart(2, "0")} foot="Challenges solved" icon={<Flag size={17} />} color="cyan" /><StatCard label="Labs completed" value={String(completedLabs).padStart(2, "0")} foot="Skills sharpened" icon={<TerminalSquare size={17} />} color="orange" /></div>

    <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(290px,1fr)]"><div className="space-y-7">
      <section><SectionTitle title="Achievements" subtitle={`${achievements.filter(item => item.unlocked).length} of ${achievements.length} badges earned`} /><div className="grid gap-3 sm:grid-cols-2">{achievements.map(item => { const Icon = item.icon; return <div key={item.name} className={`panel flex items-center gap-3 p-4 ${!item.unlocked ? "opacity-50" : ""}`}><span className={`grid h-11 w-11 shrink-0 place-items-center rounded-lg border ${item.unlocked ? item.tone === "violet" ? "border-[#655785] bg-[#322b43] text-violet" : item.tone === "cyan" ? "border-[#456f75] bg-[#254047] text-cyan" : item.tone === "orange" ? "border-[#755b45] bg-[#403228] text-[#eebf8a]" : "border-[#607c4b] bg-[#30412a] text-lime" : "border-[#404c54] bg-[#252d36] text-[#7f8b93]"}`}><Icon size={20} /></span><div><h3 className="text-[11px] font-bold">{item.name}</h3><p className="mt-1 text-[10px] text-[#8b9aa5]">{item.description}</p></div>{item.unlocked && <Check size={13} className="ml-auto shrink-0 text-lime" />}</div>; })}</div></section>
      <section><SectionTitle title="Skill map" subtitle="A closer look at the disciplines you&apos;re exploring." href="/challenges" action="Find a challenge" /><div className="panel space-y-5 p-5 md:p-6">{skills.map(skill => { const categoryChallenges = challenges.filter(challenge => challenge.category === skill.name); const count = categoryChallenges.filter(challenge => solvedIds.has(challenge.id)).length; return <div key={skill.name}><div className="mb-2 flex justify-between text-[11px]"><span className="font-semibold text-[#c8d4d4]">{skill.name}</span><span className="text-[#92a2ac]">{count} / {categoryChallenges.length} <T>challenges</T></span></div><ProgressBar percent={Math.round(count / categoryChallenges.length * 100)} tone={skill.tone} /></div>; })}</div></section>
      <section><SectionTitle title="Recent milestones" subtitle="The latest chapters of your story." href="/activity" action="View activity" /><div className="panel divide-y divide-[#2b3540] px-5">{activities.slice(0, 4).map(item => <div key={item.id} className="flex items-center gap-3 py-4"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#27392b] text-lime">{item.type === "solve" ? <Flag size={15} /> : <BookOpen size={15} />}</span><div className="min-w-0 flex-1"><strong className="block truncate text-[11px]">{item.title}</strong><span className="mt-1 block text-[10px] text-[#81929e]">{item.description} · {timeAgo(item.createdAt)}</span></div><span className="shrink-0 text-[10px] font-bold text-lime">+{item.points} XP</span></div>)}</div></section>
    </div><div className="space-y-5">
      <section className="panel p-5"><div className="flex items-center justify-between"><span className="text-[10px] font-bold tracking-widest text-lime"><T>OPERATOR LEVEL</T></span><span className="rounded bg-[#2b3e2b] px-2 py-1 text-[10px] font-bold text-lime"><T>LVL</T> {level}</span></div><h3 className="display-font mt-3 text-[19px] font-bold">{operatorTitle(xp)}</h3><p className="mt-1 text-[11px] text-[#8fa0a9]"><T>Every flag brings you closer to your next level.</T></p><div className="mt-5 flex justify-between text-[10px]"><span className="text-[#8d9da7]"><T>Level</T> {level}</span><strong className="text-lime">{xp % 500} / 500 XP</strong><span className="text-[#8d9da7]"><T>Level</T> {level + 1}</span></div><div className="mt-2"><ProgressBar percent={Math.round((xp % 500) / 500 * 100)} /></div></section>
      <section><SectionTitle title="Saved missions" subtitle="Your watchlist of challenges." /><div className="panel overflow-hidden">{saved.length ? saved.map(item => <Link key={item.id} href={`/challenges/${item.id}`} className="flex items-center gap-3 border-b border-[#2c3540] p-4 last:border-0 hover:bg-[#202a32]"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-[#2a3d2d] text-lime"><Flag size={14} /></span><span className="min-w-0 flex-1"><strong className="block truncate text-[11px]">{item.title}</strong><span className="text-[10px] text-[#8b9ba6]">{item.category} · {item.points} XP</span></span><ChevronRight size={14} className="text-[#81909b]" /></Link>) : <div className="p-5 text-center"><Flag size={20} className="mx-auto text-[#7d9780]" /><p className="mt-3 text-[11px] leading-relaxed text-[#8798a2]"><T>Save a challenge to keep it within reach.</T></p><Link href="/challenges" className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold text-lime"><T>Explore challenges</T> <ArrowRight size={12} /></Link></div>}</div></section>
      <div className="panel border-[#465a43] bg-[#1c2b21] p-5"><Award size={21} className="text-lime" /><h3 className="display-font mt-3 text-[16px] font-bold"><T>Keep growing.</T></h3><p className="mt-1 text-[11px] leading-relaxed text-[#9aaf9a]"><T>The next skill is one lab away. Your future self will thank you.</T></p><Link href="/academy" className="mt-4 inline-flex items-center gap-1 text-[11px] font-bold text-lime"><T>Explore the academy</T> <ArrowRight size={13} /></Link></div>
    </div></div>
  </div>;
}

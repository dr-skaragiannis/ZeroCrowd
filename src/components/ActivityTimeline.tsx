"use client";


import { T } from "@/components/LanguageProvider";
import { useState } from "react";
import { Activity, CheckCircle2, Flag, ShieldCheck, Sparkles, UsersRound, Zap } from "lucide-react";
import { timeAgo } from "@/components/ui";
import { useProgress } from "@/components/ProgressProvider";

type Event = { id: string; handle: string; text: string; time: string; tone: "lime" | "violet" | "cyan" | "orange"; points?: number; you?: boolean };

export function ActivitySummary() {
  const { solves, labs } = useProgress();
  return <div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-lg border border-[#324337] bg-[#202f27] p-3"><strong className="display-font block text-[22px] font-bold text-lime">{solves.length}</strong><span className="text-[10px] text-[#a0b1a4]"><T>Flags captured</T></span></div><div className="rounded-lg border border-[#324337] bg-[#202f27] p-3"><strong className="display-font block text-[22px] font-bold text-lime">{labs.filter(item => item.completed).length}</strong><span className="text-[10px] text-[#a0b1a4]"><T>Labs completed</T></span></div></div>;
}

export default function ActivityTimeline({ events }: { events: Event[] }) {
  const { activities } = useProgress();
  const [filter, setFilter] = useState<"All activity" | "My activity" | "Community">("All activity");
  const mine: Event[] = activities.map(item => ({
    id: item.id, handle: "You", text: item.title.charAt(0).toLowerCase() + item.title.slice(1),
    time: item.createdAt, tone: item.type === "solve" ? "lime" : "cyan", points: item.points, you: true,
  }));
  const combined = [...events.filter(item => !item.you), ...mine].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
  const shown = combined.filter(item => filter === "All activity" || (filter === "My activity" ? item.you : !item.you));
  return <div><div className="mb-4 flex flex-wrap gap-2">{(["All activity", "My activity", "Community"] as const).map(item => <button key={item} onClick={() => setFilter(item)} className={`rounded-md border px-3 py-2 text-[11px] font-bold transition-colors ${filter === item ? "border-[#729552] bg-[#2a3d2b] text-lime" : "border-[#34404b] bg-[#1a222b] text-[#93a4ae] hover:text-white"}`}>{item}</button>)}</div><div className="panel overflow-hidden">{shown.length ? shown.map((item, index) => <div key={item.id} className={`flex gap-3 p-4 sm:p-5 ${index !== shown.length - 1 ? "border-b border-[#2b3540]" : ""}`}><div className="flex flex-col items-center"><span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${item.tone === "violet" ? "bg-[#3a3150] text-violet" : item.tone === "cyan" ? "bg-[#244049] text-cyan" : item.tone === "orange" ? "bg-[#4b3629] text-[#edbc87]" : "bg-[#2c442e] text-lime"}`}>{item.you ? <CheckCircle2 size={17} /> : item.tone === "cyan" ? <ShieldCheck size={17} /> : <Flag size={17} />}</span>{index < shown.length - 1 && <div className="mt-2 h-full min-h-6 w-px bg-[#33403f]" />}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-start justify-between gap-2"><p className="text-[12px] leading-relaxed text-[#aab8bb]"><strong className={item.you ? "text-lime" : "text-[#ecf2ed]"}>{item.handle}</strong> {item.text}</p>{item.points ? <span className="shrink-0 rounded border border-[#3c5b3c] bg-[#253a29] px-2 py-1 text-[10px] font-bold text-lime">+{item.points} XP</span> : null}</div><span className="mt-1.5 block text-[10px] text-[#7c8e99]">{timeAgo(item.time)} · {item.you ? "Your activity" : "Community"}</span></div></div>) : <div className="p-12 text-center"><Activity size={24} className="mx-auto text-[#789085]" /><p className="mt-3 text-[12px] text-[#9aabb1]"><T>Nothing here yet. Your next flag will change that.</T></p></div>}</div></div>;
}

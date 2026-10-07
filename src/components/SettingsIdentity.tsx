"use client";


import { T } from "@/components/LanguageProvider";
import Link from "next/link";
import { ArrowRight, UserRound } from "lucide-react";
import { useProgress } from "@/components/ProgressProvider";

export default function SettingsIdentity() {
  const { player } = useProgress();
  return <section className="panel p-5 md:p-6"><div className="flex items-center gap-2"><UserRound size={17} className="text-lime" /><h2 className="display-font text-[17px] font-bold"><T>Your public identity</T></h2></div><p className="mt-2 text-[11px] leading-relaxed text-[#92a3ab]"><T>Choose how other operators see you in the arena. Your profile is yours to shape.</T></p><div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-[#35433c] bg-[#1d2a27] p-4"><div><strong className="block text-[12px]">{player.displayName}</strong><span className="mt-1 block text-[10px] text-[#8ea09e]">@{player.handle}</span></div><Link href="/profile" className="btn-secondary !min-h-[33px] !text-[10px]"><T>Edit profile</T> <ArrowRight size={12} /></Link></div></section>;
}

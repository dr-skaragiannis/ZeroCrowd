"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, KeyRound, LogOut, ShieldCheck, UserRound } from "lucide-react";
import { T } from "@/components/LanguageProvider";
import { useProgress } from "@/components/ProgressProvider";

export default function AccountPanel() {
  const router = useRouter();
  const { player } = useProgress();
  const [busy, setBusy] = useState(false);

  const signOut = async () => {
    setBusy(true);
    try {
      await fetch("/api/auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "logout" }) });
      router.push("/");
    } finally { setBusy(false); }
  };

  if (player.isGuest) {
    return <section className="panel overflow-hidden"><div className="border-b border-[#344336] bg-[#1f3024] p-5 md:p-6"><span className="grid h-10 w-10 place-items-center rounded-lg bg-[#34502f] text-lime"><ShieldCheck size={20} /></span><h2 className="display-font mt-4 text-[20px] font-bold"><T>Your progress is on this device.</T></h2><p className="mt-1 text-[11px] leading-relaxed text-[#a5bfa5]"><T>Create an account to keep your progress, or sign in to an existing account.</T></p></div><div className="flex flex-wrap gap-2 p-5 md:p-6"><Link href="/register" className="btn-primary"><T>Create an account</T><ArrowRight size={14} /></Link><Link href="/login" className="btn-secondary"><T>Sign in</T></Link></div></section>;
  }

  return <section className="panel overflow-hidden"><div className="border-b border-[#344336] bg-[#1f3024] p-5 md:p-6"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-lg bg-[#34502f] text-lime"><ShieldCheck size={20} /></span><div><h2 className="display-font text-[17px] font-bold"><T>Your account is secured.</T></h2><p className="mt-1 text-[11px] text-[#a5bfa5]"><T>Signed in with your Gamehack handle. No email is required.</T></p></div></div></div><div className="p-5 md:p-6"><div className="flex items-center gap-3 rounded-lg border border-[#364547] bg-[#1b252b] px-3 py-3 text-[12px]"><UserRound size={15} className="text-[#91a4a8]" /><span>@{player.handle}</span></div><div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#2c3940] pt-5"><Link href="/profile#account-security" className="inline-flex items-center gap-2 text-[11px] font-semibold text-lime hover:text-white"><KeyRound size={14} /><T>Password and recovery-key settings</T></Link><button onClick={signOut} disabled={busy} className="btn-secondary"><LogOut size={14} /> <T>Sign out</T></button></div></div></section>;
}

"use client";


import { T } from "@/components/LanguageProvider";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, LockKeyhole, LogOut, Mail, ShieldCheck, UserRound } from "lucide-react";
import { ACCOUNT_SIGN_IN_ENABLED } from "@/lib/features";
import { useProgress, useProgressActions } from "@/components/ProgressProvider";

export default function AccountPanel() {
  const router = useRouter();
  const { player } = useProgress();
  const { isGuest, email, displayName } = player;
  const { ensureSession, refresh: refreshProgress } = useProgressActions();
  const [mode, setMode] = useState<"register" | "login">("register");
  const [name, setName] = useState(displayName);
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setBusy(true); setMessage(null);
    try {
      await ensureSession();
      const response = await fetch("/api/auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: mode, email: address, password, displayName: name }) });
      const result = await response.json();
      if (!response.ok) { setMessage({ type: "error", text: result.error || "Could not complete this request." }); return; }
      setPassword(""); setMessage({ type: "success", text: mode === "register" ? "Account created. Your progress is now linked to your email." : "Welcome back! Your saved profile is ready." });
      await refreshProgress();
      if (mode === "login") router.push("/");
    } catch { setMessage({ type: "error", text: "Connection error. Please try again." }); }
    finally { setBusy(false); }
  };
  const logout = async () => {
    setBusy(true);
    try {
      await fetch("/api/auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "logout" }) });
      await fetch("/api/session", { method: "POST" });
      await refreshProgress();
      router.push("/");
    } finally { setBusy(false); }
  };

  if (!ACCOUNT_SIGN_IN_ENABLED && isGuest) {
    return <section className="panel overflow-hidden"><div className="border-b border-[#344336] bg-[#1f3024] p-5 md:p-6"><span className="grid h-10 w-10 place-items-center rounded-lg bg-[#34502f] text-lime"><ShieldCheck size={20} /></span><h2 className="display-font mt-4 text-[20px] font-bold"><T>Jump straight into the arena.</T></h2><p className="mt-1 text-[11px] leading-relaxed text-[#a5bfa5]"><T>Login and registration are temporarily disabled. No account is needed to explore challenges, practice in labs, or join a team.</T></p></div><div className="p-5 md:p-6"><div className="flex items-center gap-3 rounded-lg border border-[#425b40] bg-[#233629] p-4"><span className="status-dot" /><div><strong className="block text-[11px] text-[#d5f0cb]"><T>Guest access is active</T></strong><p className="mt-1 text-[10px] leading-relaxed text-[#a6bca7]"><T>Your progress is saved automatically to this browser session. Keep your browser data to retain access to it.</T></p></div></div><Link href="/" className="btn-primary mt-5"><T>Go to dashboard</T> <ArrowRight size={14} /></Link></div></section>;
  }

  if (!isGuest) return <div className="panel overflow-hidden"><div className="border-b border-[#344336] bg-[#1f3024] p-5 md:p-6"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-lg bg-[#34502f] text-lime"><ShieldCheck size={20} /></span><div><h2 className="display-font text-[17px] font-bold"><T>Your account is secured.</T></h2><p className="mt-1 text-[11px] text-[#a5bfa5]"><T>Your progress is linked to your email address.</T></p></div></div></div><div className="p-5 md:p-6"><span className="field-label"><T>Email address</T></span><div className="flex items-center gap-2 rounded-lg border border-[#364547] bg-[#1b252b] px-3 py-3 text-[12px]"><Mail size={15} className="text-[#91a4a8]" />{email}</div><div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#2c3940] pt-5"><p className="text-[11px] text-[#8c9ca5]"><T>Signed in as</T> {displayName}</p><button onClick={logout} disabled={busy} className="btn-secondary"><LogOut size={14} /> <T>Sign out</T></button></div></div></div>;

  return <div className="panel overflow-hidden"><div className="border-b border-[#303d38] bg-[#1c2b24] p-5 md:p-6"><span className="grid h-10 w-10 place-items-center rounded-lg bg-[#344b31] text-lime"><LockKeyhole size={20} /></span><h2 className="display-font mt-4 text-[20px] font-bold"><T>Make your progress yours.</T></h2><p className="mt-1 text-[11px] leading-relaxed text-[#9eb0a6]"><T>You&apos;re exploring as a guest. Create an account to keep your flags, XP and lab progress linked to you.</T></p></div><div className="p-5 md:p-6"><div className="mb-6 flex gap-1 rounded-lg border border-[#35414a] bg-[#111920] p-1"><button onClick={() => { setMode("register"); setMessage(null); }} className={`flex-1 rounded-md px-3 py-2.5 text-[11px] font-bold ${mode === "register" ? "bg-[#30442d] text-lime" : "text-[#91a0aa] hover:text-white"}`}><T>Create account</T></button><button onClick={() => { setMode("login"); setMessage(null); }} className={`flex-1 rounded-md px-3 py-2.5 text-[11px] font-bold ${mode === "login" ? "bg-[#30442d] text-lime" : "text-[#91a0aa] hover:text-white"}`}><T>Sign in</T></button></div><form className="space-y-4" onSubmit={submit}>{mode === "register" && <div><label className="field-label" htmlFor="account-name"><T>Display name</T></label><div className="relative"><UserRound size={15} className="absolute left-3 top-3.5 text-[#84979e]" /><input id="account-name" className="field !pl-9" value={name} onChange={event => setName(event.target.value)} minLength={2} maxLength={60} required /></div></div>}<div><label className="field-label" htmlFor="account-email"><T>Email address</T></label><div className="relative"><Mail size={15} className="absolute left-3 top-3.5 text-[#84979e]" /><input id="account-email" type="email" className="field !pl-9" value={address} onChange={event => setAddress(event.target.value)} placeholder="you@example.com" autoComplete="email" required /></div></div><div><label className="field-label" htmlFor="account-password"><T>Password</T></label><div className="relative"><LockKeyhole size={15} className="absolute left-3 top-3.5 text-[#84979e]" /><input id="account-password" type="password" className="field !pl-9" value={password} onChange={event => setPassword(event.target.value)} placeholder="At least 8 characters" minLength={8} autoComplete={mode === "register" ? "new-password" : "current-password"} required /></div></div>{message && <div className={message.type === "error" ? "alert-error" : "alert-success"} role="status">{message.text}</div>}<button disabled={busy} type="submit" className="btn-primary w-full">{busy ? "Please wait..." : mode === "register" ? "Create account & save progress" : "Sign in to Gamehack"}<ArrowRight size={14} /></button></form><p className="mt-4 text-center text-[10px] leading-relaxed text-[#7e919a]"><T>Your password is securely hashed. Your lab activity stays in a safe simulation.</T></p></div></div>;
}

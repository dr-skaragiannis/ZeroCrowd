"use client";


import { T } from "@/components/LanguageProvider";
import { useState } from "react";
import { ArrowRight, Check, ChevronRight, Clipboard, Crown, Plus, ShieldCheck, UsersRound, X } from "lucide-react";
import { Avatar } from "@/components/ui";
import { useProgressActions } from "@/components/ProgressProvider";

type Member = { teamId: string; userId: string; displayName: string; handle: string };
type Team = { id: string; name: string; code: string; description: string; captainId: string | null; members: Member[] };
const colors = ["#c5f47b", "#b5a7ff", "#82dce5"];

export default function TeamHub({ teams: initialTeams, currentTeamId: initialTeamId }: { teams: Team[]; currentTeamId: string | null }) {
  const { ensureSession, refresh: refreshProgress } = useProgressActions();
  const [directory, setDirectory] = useState({ teams: initialTeams, currentTeamId: initialTeamId });
  const { teams, currentTeamId } = directory;
  const [inviteCode, setInviteCode] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const current = teams.find(team => team.id === currentTeamId);

  const action = async (payload: Record<string, string>) => {
    setLoading(true); setError("");
    try {
      await ensureSession();
      const response = await fetch("/api/teams", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const result = await response.json();
      if (!response.ok) { setError(result.error || "Something went wrong. Please try again."); return; }
      const directoryResponse = await fetch("/api/teams", { cache: "no-store" });
      if (!directoryResponse.ok) throw new Error("Unable to load the updated team directory.");
      setDirectory(await directoryResponse.json());
      setInviteCode(""); setName(""); setDescription(""); setShowCreate(false);
      await refreshProgress().catch(() => {});
    } catch { setError("Could not update your team. Please try again."); }
    finally { setLoading(false); }
  };
  const copyCode = async () => { if (!current) return; await navigator.clipboard.writeText(current.code); setCopied(true); setTimeout(() => setCopied(false), 1800); };

  return <div className="space-y-6"><section className="panel relative overflow-hidden p-7 md:p-9" style={{ background: "radial-gradient(circle at 78% 45%,rgba(105,145,110,.2),transparent 35%),linear-gradient(105deg,#1a2926,#1b202b)" }}><div className="relative z-10 max-w-[590px]"><span className="text-[10px] font-bold tracking-[.16em] text-lime"><T>BETTER TOGETHER</T></span><h2 className="display-font mt-3 text-[27px] font-bold tracking-[-.05em] md:text-[34px]"><T>Find your people.</T><br /><span className="text-lime"><T>Capture more together.</T></span></h2><p className="mt-3 text-[11px] leading-relaxed text-[#a9b9b1]"><T>Join a crew of curious minds, share the journey, and tackle the arena side by side. The best breakthroughs rarely happen alone.</T></p><div className="mt-5 flex items-center gap-4 text-[10px] font-semibold text-[#b4c9b8]"><span className="inline-flex items-center gap-1.5"><UsersRound size={13} className="text-lime" /> <T>Community crews</T></span><span className="inline-flex items-center gap-1.5"><ShieldCheck size={13} className="text-lime" /> <T>Ethical practice</T></span></div></div><div className="absolute right-[7%] top-[22%] hidden h-36 w-36 items-center justify-center rounded-full border border-[#b5e49d]/15 shadow-[0_0_0_30px_rgba(197,244,123,.035),0_0_0_67px_rgba(197,244,123,.02)] lg:flex"><UsersRound size={65} strokeWidth={1} className="text-lime/50" /></div></section>

    {error && <div className="alert-error" role="alert">{error}</div>}
    {current ? <section className="panel overflow-hidden border-[#516d48]"><div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#334638] bg-[#1d2b22] p-5 md:p-6"><div><span className="text-[10px] font-bold tracking-[.12em] text-lime"><T>YOUR CREW</T></span><h2 className="display-font mt-2 text-[23px] font-bold">{current.name}</h2><p className="mt-1 text-[11px] text-[#a3b8a8]">{current.description}</p></div><span className="grid h-12 w-12 place-items-center rounded-xl border border-[#5a764a] bg-[#30402b] text-lime"><Crown size={22} /></span></div><div className="grid gap-5 p-5 md:grid-cols-2 md:p-6"><div><span className="text-[10px] font-bold tracking-widest text-[#8c9da4]"><T>INVITE CODE</T></span><button onClick={copyCode} className="mt-2 flex w-full items-center justify-between rounded-lg border border-[#425747] bg-[#213127] px-4 py-3 mono text-[12px] font-bold tracking-[.08em] text-lime hover:border-[#80a86e]"><span>{current.code}</span>{copied ? <Check size={15} /> : <Clipboard size={15} />}</button><p className="mt-2 text-[10px] text-[#8b9da1]"><T>Share this code with friends so they can find your crew.</T></p></div><div><span className="text-[10px] font-bold tracking-widest text-[#8c9da4]">CREW MEMBERS · {current.members.length}</span><div className="mt-2 flex flex-wrap gap-2">{current.members.map((member, index) => <div key={member.userId} className="flex items-center gap-2 rounded-lg border border-[#35433e] bg-[#1b2925] px-2.5 py-2"><Avatar name={member.displayName} size="sm" color={colors[index % colors.length]} /><span className="text-[10px] font-semibold">{member.displayName}</span></div>)}</div></div></div><div className="border-t border-[#344439] px-5 py-3"><button disabled={loading} onClick={() => { if (window.confirm("Leave this crew? You can join another one at any time.")) void action({ action: "leave" }); }} className="text-[10px] font-semibold text-[#c5a2a2] hover:text-[#f5b9b9]"><T>Leave team</T></button></div></section> : <div className="grid gap-5 lg:grid-cols-2"><section className="panel p-5 md:p-6"><span className="grid h-9 w-9 place-items-center rounded-lg bg-[#293e2d] text-lime"><UsersRound size={18} /></span><h2 className="display-font mt-4 text-[18px] font-bold"><T>Have an invite code?</T></h2><p className="mt-1 text-[11px] text-[#91a0a9]"><T>Enter your crew&apos;s code and join them in the arena.</T></p><form className="mt-5 flex gap-2" onSubmit={event => { event.preventDefault(); void action({ action: "join", code: inviteCode }); }}><input className="field mono uppercase" value={inviteCode} onChange={event => setInviteCode(event.target.value)} placeholder="ENTER TEAM CODE" required /><button disabled={loading || !inviteCode.trim()} className="btn-primary !min-h-[42px]"><T>Join</T> <ArrowRight size={13} /></button></form></section><section className="panel p-5 md:p-6"><span className="grid h-9 w-9 place-items-center rounded-lg bg-[#342f49] text-violet"><Plus size={19} /></span><h2 className="display-font mt-4 text-[18px] font-bold"><T>Build your own crew.</T></h2><p className="mt-1 text-[11px] text-[#91a0a9]"><T>Start a team, get a unique invite code, and bring people together.</T></p>{!showCreate ? <button onClick={() => setShowCreate(true)} className="btn-secondary mt-5"><Plus size={14} /> <T>Create a team</T></button> : <form className="mt-4 space-y-3" onSubmit={event => { event.preventDefault(); void action({ action: "create", name, description }); }}><div><label className="field-label"><T>Team name</T></label><input className="field" value={name} onChange={event => setName(event.target.value)} placeholder="The Night Owls" minLength={3} maxLength={60} required /></div><div><label className="field-label"><T>What&apos;s your crew about?</T></label><input className="field" value={description} onChange={event => setDescription(event.target.value)} placeholder="A crew of curious minds..." maxLength={220} /></div><div className="flex gap-2"><button className="btn-primary" disabled={loading}><T>Create crew</T> <ArrowRight size={13} /></button><button type="button" className="btn-quiet" onClick={() => setShowCreate(false)}><X size={14} /> <T>Cancel</T></button></div></form>}</section></div>}

    <section><div className="mb-4 flex items-end justify-between"><div><h2 className="display-font text-[21px] font-bold"><T>Community crews</T></h2><p className="mt-1 text-[11px] text-[#8c9ca7]"><T>Find a team that feels like yours.</T></p></div><span className="text-[10px] text-[#82939d]">{teams.length} <T>crews</T></span></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{teams.map((team, index) => <div className="panel panel-hover flex flex-col p-5" key={team.id}><div className="flex items-start justify-between"><span className="grid h-11 w-11 place-items-center rounded-lg border" style={{ borderColor: `${colors[index % colors.length]}55`, color: colors[index % colors.length], background: `${colors[index % colors.length]}1c` }}><ShieldCheck size={22} /></span>{current?.id === team.id && <span className="rounded bg-[#30462f] px-2 py-1 text-[9px] font-bold text-lime"><T>YOUR TEAM</T></span>}</div><h3 className="display-font mt-5 text-[18px] font-bold">{team.name}</h3><p className="mt-1 min-h-[36px] text-[11px] leading-relaxed text-[#94a4ac]">{team.description}</p><div className="mt-5 flex items-center justify-between border-t border-[#2d3942] pt-4"><span className="inline-flex items-center gap-1.5 text-[10px] text-[#899aa3]"><UsersRound size={13} />{team.members.length} <T>member</T>{team.members.length === 1 ? "" : "s"}</span>{!current ? <button disabled={loading} onClick={() => void action({ action: "join", code: team.code })} className="inline-flex items-center gap-1 text-[11px] font-bold text-lime hover:gap-2"><T>Join crew</T> <ArrowRight size={13} /></button> : <span className="text-[10px] text-[#778990]">{current.id === team.id ? "You are here" : "In another crew"}</span>}</div></div>)}</div></section>
  </div>;
}

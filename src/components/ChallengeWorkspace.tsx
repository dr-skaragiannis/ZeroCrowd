"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Bookmark, BookmarkCheck, Check, CheckCircle2, ChevronDown, Clipboard, Clock3, Download, FileCode2, Flag, HelpCircle, Lightbulb, Send, ShieldCheck, Target, TerminalSquare, Users } from "lucide-react";
import type { PublicChallenge } from "@/lib/challenges";
import { CHALLENGE_LEARNING, challengeCopy } from "@/data/challengeEducation";
import { CategoryIcon, CategoryVisual, DifficultyBadge, InfoChip } from "@/components/ui";
import { useProgress, useProgressActions } from "@/components/ProgressProvider";
import { useLanguage, T } from "@/components/LanguageProvider";

export default function ChallengeWorkspace({ challenge }: { challenge: PublicChallenge }) {
  const progress = useProgress();
  const { lang, t, b } = useLanguage();
  const copy = challengeCopy(challenge, lang);
  const education = CHALLENGE_LEARNING[challenge.id];
  const { ensureSession, refresh: refreshProgress } = useProgressActions();
  const [flag, setFlag] = useState("");
  const [solvedLocally, setSolvedLocally] = useState(false);
  const [savedLocally, setSavedLocally] = useState<boolean | null>(null);
  const solved = solvedLocally || progress.solves.some(item => item.challengeId === challenge.id);
  const saved = savedLocally ?? progress.bookmarks.includes(challenge.id);
  const [hintCount, setHintCount] = useState(0);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [copyLabel, setCopyLabel] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!flag.trim()) { setMessage({ type: "error", text: lang === "el" ? "Γράψε ένα flag πριν το υποβάλεις." : "Enter a flag before submitting." }); return; }
    setLoading(true); setMessage(null);
    try {
      await ensureSession();
      const response = await fetch(`/api/challenges/${challenge.id}/submit`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ flag }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Submission failed.");
      if (data.correct) {
        setSolvedLocally(true);
        setMessage({ type: "success", text: data.alreadySolved ? (lang === "el" ? "Έχεις ήδη βρει αυτό το flag. Μπράβο!" : "You already captured this flag. Nicely done!") : (lang === "el" ? `Βρήκες το flag! +${challenge.points} XP προστέθηκαν στο προφίλ σου.` : `Flag captured! +${challenge.points} XP added to your profile.`) });
        setFlag(""); await refreshProgress().catch(() => {});
      } else setMessage({ type: "error", text: lang === "el" ? "Λάθος flag. Ξανακοίτα τα στοιχεία." : "That's not the flag. Take another look at the evidence." });
    } catch { setMessage({ type: "error", text: lang === "el" ? "Δεν ήταν δυνατή η σύνδεση. Δοκίμασε ξανά." : "Connection error. Please try again." }); }
    finally { setLoading(false); }
  };
  const toggleSaved = async () => {
    try {
      await ensureSession();
      const response = await fetch(`/api/challenges/${challenge.id}/bookmark`, { method: "POST" });
      const data = await response.json();
      if (response.ok && typeof data.saved === "boolean") {
        setSavedLocally(data.saved);
        try { await refreshProgress(); setSavedLocally(null); } catch { /* Keep confirmed state until next sync. */ }
      }
    } catch { /* Keep saved state on network failure. */ }
  };
  const copyArtifact = async () => { await navigator.clipboard.writeText(challenge.artifact); setCopyLabel(true); setTimeout(() => setCopyLabel(false), 1800); };
  const downloadArtifact = () => { const blob = new Blob([challenge.artifact], { type: "text/plain" }); const url = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = url; anchor.download = challenge.artifactName; anchor.click(); URL.revokeObjectURL(url); };

  return <div className="space-y-6"><Link href="/challenges" className="inline-flex items-center gap-2 text-[11px] font-semibold text-[#99a9b2] transition-colors hover:text-lime"><ArrowLeft size={14} /> <T>Back to challenges</T></Link>
    <section className="panel overflow-hidden"><div className="relative h-[155px] md:h-[195px] [&_.category-art]:!h-full"><CategoryVisual category={challenge.category} tone={challenge.tone} /><div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#151b24] to-transparent" /><span className="absolute left-6 top-5 inline-flex items-center gap-2 rounded-md border border-white/15 bg-[#121923]/75 px-3 py-1.5 text-[10px] font-bold tracking-[.12em] text-white/75">MISSION FILE // {challenge.id.toUpperCase().replaceAll("-", "_")}</span></div><div className="relative -mt-3 px-6 pb-6 md:px-7"><div className="mb-3 flex flex-wrap items-center gap-2"><span className="text-[10px] font-extrabold tracking-[.12em] text-lime uppercase">{t(challenge.category)}</span><span className="text-[#53616c]">/</span><DifficultyBadge difficulty={challenge.difficulty} />{solved && <span className="inline-flex items-center gap-1.5 rounded-md border border-[#6f995c]/50 bg-[#263d2a] px-2 py-1 text-[10px] font-bold text-lime"><Check size={12} /> {t("SOLVED")}</span>}</div><div className="flex flex-wrap items-start justify-between gap-3"><div><h1 className="display-font text-[30px] font-bold tracking-[-.055em] md:text-[37px]">{copy.title}</h1><p className="mt-1 text-[12px] text-[#a2afb9]">{copy.summary}</p></div><button type="button" onClick={() => void toggleSaved()} className={`btn-secondary !min-h-[36px] ${saved ? "!border-[#668c54] !text-lime" : ""}`} aria-label={saved ? (lang === "el" ? "Αφαίρεση από τα αποθηκευμένα" : "Remove bookmark") : (lang === "el" ? "Αποθήκευση πρόκλησης" : "Save challenge")}>{saved ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}{t(saved ? "Saved" : "Save")}</button></div><div className="mt-5 flex flex-wrap gap-2"><InfoChip icon={<Flag size={12} className="text-lime" />}>{challenge.points} XP</InfoChip><InfoChip icon={<Clock3 size={12} />}>{challenge.time}</InfoChip><InfoChip icon={<Users size={12} />}>{challenge.solves.toLocaleString()} {t("solves")}</InfoChip>{challenge.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}</div></div></section>

    <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.75fr)_minmax(285px,1fr)]"><div className="space-y-5">
      <section className="panel p-5 md:p-6"><div className="flex items-center gap-2 text-lime"><Target size={17} /><span className="text-[10px] font-bold tracking-[.13em] uppercase"><T>Mission briefing</T></span></div><h2 className="display-font mt-4 text-[19px] font-bold"><T>The situation</T></h2><p className="mt-2 text-[12px] leading-[1.8] text-[#a9b7bd]">{copy.description}</p><div className="mt-5 rounded-lg border border-[#465743] bg-[#202d27] p-4"><strong className="flex items-center gap-2 text-[11px] font-bold text-[#d8f2c6]"><Target size={14} /> <T>Your objective</T></strong><p className="mt-1.5 text-[11px] leading-relaxed text-[#b2c4b2]">{copy.objective}</p></div></section>
      {education && <section className="panel overflow-hidden"><div className="border-b border-[#354940] bg-[#203029] px-5 py-4"><span className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-lime"><BookOpenIcon />{lang === "el" ? "ΕΚΠΑΙΔΕΥΤΙΚΟΣ ΟΔΗΓΟΣ" : "ANALYST PLAYBOOK"}</span><h2 className="display-font mt-2 text-[18px] font-bold">{lang === "el" ? "Κατανόησε τη μέθοδο, όχι μόνο το flag." : "Understand the method, not just the flag."}</h2></div><div className="grid gap-3 p-4 md:grid-cols-3 md:p-5">{([ ["Concept", education.concept, "text-lime", "bg-[#23382b]"], ["What to look for", education.investigate, "text-cyan", "bg-[#22343b]"], ["Defender's view", education.defend, "text-violet", "bg-[#2e2a3b]"] ] as const).map(([label, value, color, bg]) => <div key={label} className={`rounded-lg border border-[#35464b] ${bg} p-4`}><span className={`text-[9px] font-bold tracking-widest uppercase ${color}`}>{t(label)}</span><p className="mt-2 text-[11px] leading-[1.7] text-[#bcccca]">{b(value)}</p></div>)}</div></section>}
      <section className="panel overflow-hidden" id="evidence"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2b3540] px-5 py-4"><div><h2 className="display-font flex items-center gap-2 text-[17px] font-bold"><FileCode2 size={17} className="text-cyan" /> <T>Evidence locker</T></h2><p className="mt-1 text-[10px] text-[#8899a4]"><T>Inspect the supplied artifact. Everything you need is here.</T></p></div><div className="flex gap-2"><button type="button" onClick={() => void copyArtifact()} className="btn-quiet !min-h-[30px] !px-2.5 !text-[10px]"><Clipboard size={12} /> {t(copyLabel ? "Copied!" : "Copy")}</button><button type="button" onClick={downloadArtifact} className="btn-quiet !min-h-[30px] !px-2.5 !text-[10px]"><Download size={12} /> <T>Download</T></button></div></div><div className="flex items-center gap-2 border-b border-[#27333b] bg-[#182029] px-5 py-2.5"><span className="text-cyan"><FileCode2 size={13} /></span><span className="mono text-[10px] text-[#c1d1d4]">{challenge.artifactName}</span><span className="ml-auto rounded bg-[#23372f] px-2 py-1 mono text-[9px] text-[#a4c69e]"><T>READ ONLY</T></span></div><pre className="max-h-[480px] min-h-[165px] overflow-auto whitespace-pre-wrap break-all bg-[#0c1319] p-5 mono text-[11px] leading-[1.8] text-[#b9d1cb]">{challenge.artifact}</pre><div className="flex items-center gap-2 border-t border-[#27333b] px-5 py-3 text-[10px] text-[#7e929d]"><ShieldCheck size={13} className="text-lime" /> <T>Safe, fictional training artifact · No external systems involved</T></div></section>
      <section className="panel p-5 md:p-6" id="hints"><div className="flex items-center gap-2"><Lightbulb size={17} className="text-[#e9c985]" /><h2 className="display-font text-[17px] font-bold"><T>Need a nudge?</T></h2></div><p className="mt-2 text-[11px] text-[#91a0ab]"><T>Hints are here when you need them. Try finding your own way first.</T></p>{hintCount > 0 && <div className="mt-4 space-y-2">{copy.hints.slice(0, hintCount).map((hint, index) => <div key={index} className="rounded-lg border border-[#4b4937] bg-[#27261f] p-3.5"><span className="text-[9px] font-bold tracking-widest text-[#e6ca84]">{t("Hint").toUpperCase()} {String(index + 1).padStart(2, "0")}</span><p className="mt-1 text-[11px] leading-relaxed text-[#d1c9ad]">{hint}</p></div>)}</div>}{hintCount < challenge.hints.length && <button type="button" onClick={() => setHintCount(hintCount + 1)} className="btn-secondary mt-4 !min-h-[34px] !text-[11px]"><HelpCircle size={13} /> {t("Reveal hint")} {hintCount + 1} <ChevronDown size={12} /></button>}</section>
    </div><div className="space-y-5 xl:sticky xl:top-[92px]"><section className="panel overflow-hidden"><div className="border-b border-[#303b40] bg-[#1b2723] p-5"><span className="grid h-10 w-10 place-items-center rounded-lg bg-[#30472b] text-lime"><Flag size={20} /></span><h2 className="display-font mt-4 text-[18px] font-bold"><T>Capture the flag</T></h2><p className="mt-1 text-[11px] leading-relaxed text-[#9bad9e]"><T>Got the answer? Submit it to claim your points and mark this mission complete.</T></p></div><form onSubmit={submit} className="p-5"><label htmlFor="flag-input" className="field-label"><T>Flag submission</T></label><div className="relative"><TerminalSquare size={15} className="absolute left-3 top-3.5 text-[#879b9b]" /><input id="flag-input" value={flag} onChange={event => setFlag(event.target.value)} className="field mono !pl-9" placeholder="GAMEHACK{...}" autoComplete="off" spellCheck={false} /></div><p className="mt-2 text-[10px] text-[#71848e]"><T>Flags are case-sensitive. Include the curly braces.</T></p><button disabled={loading} className="btn-primary mt-5 w-full" type="submit"><Send size={14} />{t(loading ? "Checking flag..." : solved ? "Submit another answer" : "Submit flag")}<ArrowRight size={13} /></button>{message && <div className={`mt-4 ${message.type === "success" ? "alert-success" : "alert-error"}`} role="status">{message.type === "success" ? <CheckCircle2 size={15} className="mr-1.5 inline" /> : null}{message.text}</div>}{solved && !message && <div className="alert-success mt-4"><CheckCircle2 size={15} className="mr-1.5 inline" /><T>You&apos;ve already captured this flag.</T></div>}</form></section><section className="panel p-5"><h3 className="text-[11px] font-bold"><T>Mission intel</T></h3><div className="mt-4 space-y-3 text-[11px]"><div className="flex justify-between"><span className="text-[#8c9ba6]"><T>Category</T></span><span className="flex items-center gap-1.5 font-semibold"><CategoryIcon category={challenge.category} size={13} />{t(challenge.category)}</span></div><div className="flex justify-between"><span className="text-[#8c9ba6]"><T>Difficulty</T></span><DifficultyBadge difficulty={challenge.difficulty} /></div><div className="flex justify-between"><span className="text-[#8c9ba6]"><T>Reward</T></span><span className="font-bold text-lime">+{challenge.points} XP</span></div><div className="flex justify-between"><span className="text-[#8c9ba6]"><T>Estimated time</T></span><span>{challenge.time}</span></div></div></section><Link href="/challenges" className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#a8b8be] hover:text-lime"><T>Explore more challenges</T> <ArrowRight size={13} /></Link></div></div>
  </div>;
}

function BookOpenIcon() { return <Target size={15} />; }

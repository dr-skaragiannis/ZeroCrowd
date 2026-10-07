"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, Bookmark, BookmarkCheck, CheckCircle2, ChevronRight, Flag, Lightbulb, LockKeyhole, ShieldCheck, TerminalSquare, Target, Zap } from "lucide-react";
import type { Bi } from "@/data/lessons";
import type { SourceChallenge } from "@/lib/sourceChallenges";
import { useLanguage, T } from "@/components/LanguageProvider";
import { useProgress, useProgressActions } from "@/components/ProgressProvider";
import { CategoryVisual, DifficultyBadge, InfoChip } from "@/components/ui";

type Prep = { id: string; instruction: Bi; explain: Bi };
type Theory = { heading: Bi; body: Bi; tip?: Bi };

export default function SourceChallengeWorkspace({ challenge, previous, preparation, theory, references }: {
  challenge: SourceChallenge;
  previous: { id: string; title: Bi } | null;
  preparation: Prep[];
  theory: Theory[];
  references: { cmd: string; desc: Bi }[];
}) {
  const { lang, t, b } = useLanguage();
  const progress = useProgress();
  const { ensureSession, refresh: refreshProgress } = useProgressActions();
  const [savedLocally, setSavedLocally] = useState<boolean | null>(null);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");
  const done = progress.labs.find(row => row.moduleId === challenge.moduleId)?.completedTaskIds ?? [];
  const solved = done.includes(`ch-${challenge.challengeIndex}`);
  const locked = !!previous && !progress.labs.some(row => row.moduleId === previous.id && row.completed);
  const saved = savedLocally ?? progress.bookmarks.includes(challenge.id);
  const toggleBookmark = async () => {
    setWorking(true); setError("");
    try {
      await ensureSession();
      const response = await fetch(`/api/challenges/${encodeURIComponent(challenge.id)}/bookmark`, { method: "POST" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not save the challenge.");
      setSavedLocally(result.saved);
      await refreshProgress();
      setSavedLocally(null);
    } catch { setError(lang === "el" ? "Δεν ήταν δυνατή η αποθήκευση της πρόκλησης. Δοκίμασε ξανά." : "Could not save the challenge. Please try again."); }
    finally { setWorking(false); }
  };

  return <div className="space-y-6"><Link href="/challenges" className="inline-flex items-center gap-2 text-[11px] font-semibold text-[#99a9b2] hover:text-lime"><ArrowLeft size={14} /><T>Back to challenges</T></Link>
    <section className="panel overflow-hidden"><div className="relative h-[145px] [&_.category-art]:!h-full md:h-[190px]"><CategoryVisual category={challenge.category} tone={challenge.tone} /><div className="absolute inset-0 bg-gradient-to-t from-[#151b24] to-transparent" /><span className="absolute left-6 top-5 rounded-md border border-white/20 bg-[#111a20]/80 px-2.5 py-1.5 text-[10px] font-bold tracking-[.1em] text-white/80">{t("Source challenge").toUpperCase()} · {String(challenge.pathNumber).padStart(2, "0")}/{String(challenge.moduleOrder).padStart(2, "0")}/{challenge.challengeIndex + 1}</span></div>
      <div className="relative -mt-2 px-6 pb-6 md:px-8"><div className="mb-3 flex flex-wrap items-center gap-2"><span className="text-[10px] font-extrabold tracking-wider text-lime">{t(challenge.category).toUpperCase()}</span><span className="text-[#53616c]">/</span><DifficultyBadge difficulty={challenge.difficulty} />{solved && <span className="difficulty easy"><CheckCircle2 size={11} />{t("Completed")}</span>}{locked && !solved && <span className="difficulty medium"><LockKeyhole size={11} />{t("Locked")}</span>}</div><div className="flex flex-wrap items-start justify-between gap-3"><div><h1 className="display-font text-[30px] font-bold tracking-[-.055em] md:text-[38px]">{b(challenge.title)}</h1><p className="mt-1 text-[12px] text-[#a8b9be]">{b(challenge.campaignTitle)} <span className="mx-1 text-[#61717b]">/</span> {b(challenge.moduleTitle)}</p></div><button type="button" disabled={working} onClick={() => void toggleBookmark()} className={`btn-secondary !min-h-[36px] ${saved ? "!border-[#668c54] !text-lime" : ""}`}>{saved ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}{t(saved ? "Saved" : "Save")}</button></div><div className="mt-5 flex flex-wrap gap-2"><InfoChip icon={<TerminalSquare size={12} />}>{t("Lab objective")}</InfoChip><InfoChip icon={<Flag size={12} className="text-lime" />}>20 XP</InfoChip><InfoChip icon={<BookOpen size={12} />}>{challenge.objectiveCount} {t("objectives")}</InfoChip></div></div>
    </section>
    {error && <p className="alert-error" role="alert">{error}</p>}
    <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(280px,1fr)]"><div className="space-y-5"><section className="panel p-5 md:p-6"><span className="flex items-center gap-2 text-[10px] font-extrabold tracking-widest text-lime"><Target size={16} /><T>Mission briefing</T></span><h2 className="display-font mt-4 text-[19px] font-bold"><T>Your objective</T></h2><p className="mt-2 whitespace-pre-wrap text-[12px] leading-[1.8] text-[#c1cfd0]">{b(challenge.brief)}</p><div className="mt-5 flex gap-2 rounded-lg border border-[#4c6348] bg-[#25352a] p-3 text-[11px] leading-relaxed text-[#c1dac0]"><ShieldCheck size={15} className="mt-0.5 shrink-0 text-lime" /><span>{lang === "el" ? "Πρόκειται για πρόκληση από ένα από τα εργαστήρια της πλατφόρμας. Εκτέλεσε εντολές στον ασφαλή προσομοιωτή· η ολοκλήρωση ελέγχεται από τους στόχους του εργαστηρίου, όχι με υποβολή flag." : "This is an original challenge from the source lab. Run commands in the safe simulator; completion is checked by the original lab logic, not a fabricated flag."}</span></div>{solved && <div className="alert-success mt-4"><CheckCircle2 size={15} className="mr-2 inline" />{b(challenge.success)}</div>}</section>
      <section className="panel p-5 md:p-6"><h2 className="display-font flex items-center gap-2 text-[18px] font-bold"><BookOpen size={17} className="text-cyan" />{lang === "el" ? "Πριν ξεκινήσεις" : "Before you begin"}</h2><p className="mt-2 text-[11px] leading-relaxed text-[#9badb2]">{lang === "el" ? "Διάβασε το πλαίσιο και δοκίμασε να λύσεις την πρόκληση στον προσομοιωτή." : "Understand the context, then investigate the simulated environment yourself."}</p><div className="mt-4 space-y-3">{theory.map((section, index) => <div key={index} className="rounded-lg border border-[#34464c] bg-[#1b292d] p-4"><span className="mono text-[9px] font-bold text-cyan">0{index + 1} / {t("Concept").toUpperCase()}</span><h3 className="display-font mt-1 text-[14px] font-bold">{b(section.heading)}</h3><p className="mt-2 whitespace-pre-wrap text-[11px] leading-relaxed text-[#a5b9ba]">{b(section.body)}</p>{section.tip && <div className="mt-3 flex items-start gap-2 text-[10px] leading-relaxed text-[#c4d8ae]"><Lightbulb size={13} className="mt-0.5 shrink-0 text-lime" />{b(section.tip)}</div>}</div>)}</div></section>
      <section className="panel p-5 md:p-6"><h2 className="display-font flex items-center gap-2 text-[18px] font-bold"><Zap size={17} className="text-lime" />{lang === "el" ? "Προετοιμασία" : "Practice roadmap"}</h2><p className="mt-1 text-[11px] text-[#8fa1ab]">{lang === "el" ? "Ολοκλήρωσε αυτούς τους στόχους πριν ξεκινήσεις την πρόκληση." : "The core objectives that prepare you for this challenge."}</p><ol className="mt-4 space-y-2">{preparation.map((task, index) => <li key={task.id} className="flex gap-3 rounded-lg border border-[#344139] bg-[#1c2925] p-3"><span className="mono grid h-6 w-6 shrink-0 place-items-center rounded bg-[#304330] text-[10px] text-lime">{index + 1}</span><span className="text-[11px] leading-relaxed text-[#b2c5b6]">{b(task.instruction)}</span></li>)}</ol></section>
    </div><aside className="space-y-5 xl:sticky xl:top-[92px]"><div className="panel p-5"><span className="grid h-10 w-10 place-items-center rounded-lg bg-[#2b432c] text-lime"><Flag size={19} /></span><h2 className="display-font mt-4 text-[17px] font-bold">{locked ? (lang === "el" ? "Ξεκλείδωσε την αποστολή" : "Unlock this mission") : solved ? (lang === "el" ? "Αποστολή ολοκληρωμένη" : "Mission accomplished") : (lang === "el" ? "Έτοιμος να ξεκινήσεις;" : "Ready to investigate?")}</h2><p className="mt-2 text-[11px] leading-relaxed text-[#9aacb0]">{locked ? (lang === "el" ? "Ολοκλήρωσε πρώτα το προηγούμενο εργαστήριο. Οι προκλήσεις αυτής της διαδρομής ξεκλειδώνουν με τη σειρά." : "Complete the previous lab first. Original source missions follow a sequenced path.") : (lang === "el" ? "Άνοιξε το εργαστήριο, εξερεύνησε το εικονικό περιβάλλον και ολοκλήρωσε τον στόχο χρησιμοποιώντας εντολές." : "Open the lab, inspect the fictional environment, and complete the objective with commands.")}</p>{locked && previous ? <Link href={`/academy/${challenge.campaignId}/${previous.id}`} className="btn-primary mt-5 w-full">{lang === "el" ? "Προηγούμενο εργαστήριο" : "Complete previous lab"} <ArrowRight size={14} /></Link> : <Link href={challenge.labHref} className="btn-primary mt-5 w-full"><TerminalSquare size={14} />{t("Open lab")}<ArrowRight size={14} /></Link>}<div className="mt-4 text-center text-[10px] text-[#8e9eaa]">{lang === "el" ? "Η πρόοδος αποθηκεύεται αυτόματα." : "Progress is saved automatically."}</div></div>
      <div className="panel p-5"><h3 className="display-font text-[15px] font-bold"><T>Command guide</T></h3><p className="mt-1 text-[10px] text-[#96a7ae]">{lang === "el" ? "Χρήσιμες εντολές από το εργαστήριο." : "Useful commands from the original lesson."}</p><div className="mt-4 space-y-2">{references.map((item, index) => <div key={index} className="rounded-md border border-[#33463b] bg-[#1e2c24] px-3 py-2"><code className="mono text-[10px] font-bold text-lime">{item.cmd}</code><p className="mt-1 text-[10px] text-[#9caea8]">{b(item.desc)}</p></div>)}</div></div><Link href={`/academy/${challenge.campaignId}`} className="panel flex items-center justify-between p-4 text-[11px] font-bold text-[#c2d1c9] hover:border-[#66825a]">{lang === "el" ? "Δες την εκπαιδευτική διαδρομή" : "View learning path"}<ChevronRight size={15} className="text-lime" /></Link>
    </aside></div>
  </div>;
}

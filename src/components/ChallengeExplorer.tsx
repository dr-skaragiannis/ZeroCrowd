"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Filter, Flag, Search, SlidersHorizontal, Sparkles, X } from "lucide-react";
import { CAMPAIGNS } from "@/data/lessons";
import { challengeCopy } from "@/data/challengeEducation";
import type { ChallengeCategory, ChallengeDifficulty, PublicChallenge } from "@/lib/challenges";
import type { SourceChallenge } from "@/lib/sourceChallenges";
import { ChallengeCard, EmptyState, SourceChallengeCard } from "@/components/ui";
import { useProgress } from "@/components/ProgressProvider";
import { useLanguage } from "@/components/LanguageProvider";

const categories = ["All challenges", "Web Exploitation", "Cryptography", "Digital Forensics", "OSINT", "Reverse Engineering", "Linux", "Network Security"] as const;
type ArenaEntry = { kind: "standalone"; challenge: PublicChallenge } | { kind: "source"; challenge: SourceChallenge };

export function ChallengeProgressBadge({ total }: { total: number }) {
  const { solves, labs } = useProgress();
  const { t } = useLanguage();
  const sourceCleared = labs.reduce((count, lab) => count + lab.completedTaskIds.filter(id => id === "ch-0" || id === "ch-1").length, 0);
  return <div className="rounded-lg border border-[#34443b] bg-[#19261f] px-4 py-2.5 text-center"><strong className="display-font block text-[17px] leading-none text-lime">{solves.length + sourceCleared}<span className="text-[#8fa88d]">/{total}</span></strong><span className="mt-1 block text-[9px] font-bold tracking-widest text-[#9eafa3]">{t("missions cleared").toUpperCase()}</span></div>;
}

export default function ChallengeExplorer({ challenges, sourceChallenges }: { challenges: PublicChallenge[]; sourceChallenges: SourceChallenge[] }) {
  const progress = useProgress();
  const { lang, t, b } = useLanguage();
  const [source, setSource] = useState<"all" | "source" | "standalone">("all");
  const [category, setCategory] = useState<(typeof categories)[number]>("All challenges");
  const [difficulty, setDifficulty] = useState<"All levels" | ChallengeDifficulty>("All levels");
  const [path, setPath] = useState("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("recommended");
  const [onlySaved, setOnlySaved] = useState(false);
  const [onlyOpen, setOnlyOpen] = useState(false);
  const [visible, setVisible] = useState(15);
  const solvedIds = new Set(progress.solves.map(row => row.challengeId));
  const clearedSource = new Set(sourceChallenges.filter(item => progress.labs.find(row => row.moduleId === item.moduleId)?.completedTaskIds.includes(`ch-${item.challengeIndex}`)).map(item => item.id));
  const savedIds = new Set(progress.bookmarks);
  const isSolved = (entry: ArenaEntry) => entry.kind === "source" ? clearedSource.has(entry.challenge.id) : solvedIds.has(entry.challenge.id);
  const featured = challenges.find(challenge => challenge.id === "silent-signal")!;
  const featuredCopy = challengeCopy(featured, lang);

  const filtered: ArenaEntry[] = (() => {
    const original: ArenaEntry[] = sourceChallenges.map(challenge => ({ kind: "source", challenge }));
    const newMissions: ArenaEntry[] = challenges.map(challenge => ({ kind: "standalone", challenge }));
    let list: ArenaEntry[] = source === "source" ? original : source === "standalone" ? newMissions : [...newMissions.slice(0, 3), ...original, ...newMissions.slice(3)];
    const search = query.trim().toLocaleLowerCase();
    list = list.filter(entry => {
      const item = entry.challenge;
      if (category !== "All challenges" && item.category !== category) return false;
      if (difficulty !== "All levels" && item.difficulty !== difficulty) return false;
      if (path !== "all" && (!("campaignId" in item) || item.campaignId !== path)) return false;
      if (onlySaved && !savedIds.has(item.id)) return false;
      if (onlyOpen && isSolved(entry)) return false;
      if (!search) return true;
      const searchable = "campaignId" in item
        ? `${item.title.en} ${item.title.el} ${item.brief.en} ${item.brief.el} ${item.moduleTitle.en} ${item.moduleTitle.el} ${item.campaignTitle.en} ${item.campaignTitle.el} ${item.category}`
        : `${item.title} ${challengeCopy(item, "el").title} ${item.summary} ${challengeCopy(item, "el").summary} ${item.tags.join(" ")} ${item.category}`;
      return searchable.toLocaleLowerCase().includes(search);
    });
    const points = (entry: ArenaEntry) => entry.kind === "source" ? 20 : entry.challenge.points;
    if (sort === "points-high") list = [...list].sort((a, b) => points(b) - points(a));
    if (sort === "points-low") list = [...list].sort((a, b) => points(a) - points(b));
    if (sort === "most-solved") list = [...list].sort((a, b) => (b.kind === "standalone" ? b.challenge.solves : 0) - (a.kind === "standalone" ? a.challenge.solves : 0));
    return list;
  })();

  const resetPage = () => setVisible(15);
  const clear = () => { setSource("all"); setCategory("All challenges"); setDifficulty("All levels"); setPath("all"); setQuery(""); setOnlySaved(false); setOnlyOpen(false); setSort("recommended"); resetPage(); };

  return <div className="space-y-7">
    <section className="panel relative min-h-[206px] overflow-hidden md:flex" style={{ background: "radial-gradient(circle at 76% 50%,rgba(128,100,215,.22),transparent 42%),linear-gradient(110deg,#1d2030,#171d2a)" }}><div className="relative z-10 flex-1 p-6 md:p-7"><span className="inline-flex items-center gap-1.5 text-[9px] font-extrabold tracking-[.16em] text-[#c7b7ff]"><Sparkles size={12} /> {t("FEATURED CHALLENGE")}</span><h2 className="display-font mt-3 text-[24px] font-bold tracking-[-.045em]">{featuredCopy.title}</h2><p className="mt-2 max-w-[430px] text-[11px] leading-relaxed text-[#a4afbf]">{featuredCopy.summary} {t("Follow the clues, decode the evidence, and claim your place on the board.")}</p><div className="mt-5 flex flex-wrap items-center gap-3"><Link href={`/challenges/${featured.id}`} className="btn-primary !min-h-[35px]">{t("Accept challenge")} <ArrowRight size={13} /></Link><span className="text-[10px] font-bold text-[#bcb0ec]">{t("Hard").toUpperCase()} · {featured.points} XP</span></div></div><div className="relative hidden w-[35%] place-items-center overflow-hidden text-[#b8a1ff] md:grid"><div className="absolute h-48 w-48 rounded-full border border-[#9a82ed]/20 shadow-[0_0_0_35px_rgba(154,130,237,.04),0_0_0_72px_rgba(154,130,237,.025)]" /><Flag size={86} strokeWidth={.9} className="relative drop-shadow-[0_0_35px_rgba(167,145,255,.65)]" /><span className="absolute bottom-4 right-5 mono text-[9px] tracking-widest text-[#746f9f]">GH // 0012</span></div></section>

    <section><div className="flex flex-wrap items-end justify-between gap-4"><div><h2 className="display-font text-[21px] font-bold tracking-[-.04em]">{t("Explore challenges")}</h2><p className="mt-1 text-[11px] text-[#8999a6]">{lang === "el" ? `${sourceChallenges.length} πρωτότυπες προκλήσεις εργαστηρίου από το αποθετήριο · ${challenges.length} νέες αυτόνομες CTF.` : `${sourceChallenges.length} original lab challenges from the repository · ${challenges.length} new standalone CTF missions.`}</p></div><span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#8e9da6]"><Flag size={13} className="text-lime" /> {solvedIds.size + clearedSource.size}/{sourceChallenges.length + challenges.length} {t("missions cleared")}</span></div>
      <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label={lang === "el" ? "Πηγή πρόκλησης" : "Challenge source"}>{([ ["all", lang === "el" ? "Όλες οι αποστολές" : "All missions", sourceChallenges.length + challenges.length], ["source", "Source labs", sourceChallenges.length], ["standalone", "Standalone CTF", challenges.length] ] as const).map(([value, label, count]) => <button key={value} type="button" onClick={() => { setSource(value); setPath("all"); resetPage(); }} aria-pressed={source === value} className={`rounded-[7px] border px-3 py-2 text-[11px] font-bold transition-colors ${source === value ? "border-[#759e55] bg-[#273a29] text-[#d0f3aa]" : "border-[#303a46] bg-[#171e27] text-[#9aa9b3] hover:text-white"}`}>{t(label)} <span className="ml-1 opacity-65">{count}</span></button>)}</div>
      <div className="mt-4 flex gap-2 overflow-x-auto pb-2">{categories.map(item => <button key={item} type="button" onClick={() => { setCategory(item); resetPage(); }} className={`shrink-0 rounded-[7px] border px-3 py-2 text-[11px] font-semibold transition-colors ${category === item ? "border-[#759e55] bg-[#273a29] text-[#d0f3aa]" : "border-[#303a46] bg-[#171e27] text-[#9aa9b3] hover:border-[#556459] hover:text-white"}`}>{t(item)}</button>)}</div>
      <div className="mt-4 flex flex-wrap items-center gap-3"><label className="relative min-w-[190px] flex-1"><Search size={15} className="absolute left-3 top-[13px] text-[#788997]" /><input value={query} onChange={event => { setQuery(event.target.value); resetPage(); }} className="field !pl-9" placeholder={t("Search by name, skill, or topic...")} aria-label={t("Search by name, skill, or topic...")} />{query && <button type="button" className="absolute right-3 top-[13px] text-[#8a9ba5]" onClick={() => { setQuery(""); resetPage(); }} aria-label={lang === "el" ? "Καθαρισμός αναζήτησης" : "Clear search"}><X size={14} /></button>}</label>
        <select className="field !w-auto min-w-[125px]" value={difficulty} onChange={event => { setDifficulty(event.target.value as typeof difficulty); resetPage(); }} aria-label={t("Difficulty")}><option value="All levels">{t("All levels")}</option>{(["Beginner", "Easy", "Medium", "Hard"] as const).map(item => <option value={item} key={item}>{t(item)}</option>)}</select>
        {source !== "standalone" && <select className="field !w-auto min-w-[145px]" value={path} onChange={event => { setPath(event.target.value); resetPage(); }} aria-label={t("Learning Paths")}><option value="all">{t("All learning paths")}</option>{CAMPAIGNS.map(campaign => <option value={campaign.id} key={campaign.id}>{b(campaign.title)}</option>)}</select>}
        <select className="field !w-auto min-w-[143px]" value={sort} onChange={event => { setSort(event.target.value); resetPage(); }} aria-label={lang === "el" ? "Ταξινόμηση" : "Sort challenges"}><option value="recommended">{t("Recommended")}</option><option value="points-high">{t("Highest XP")}</option><option value="points-low">{t("Lowest XP")}</option><option value="most-solved">{t("Most solved")}</option></select>
        <button type="button" onClick={() => { setOnlyOpen(!onlyOpen); resetPage(); }} className={`btn-secondary !min-h-[42px] ${onlyOpen ? "!border-[#759e55] !bg-[#273a29] !text-lime" : ""}`}><Filter size={14} /> {t("Unsolved")}</button><button type="button" onClick={() => { setOnlySaved(!onlySaved); resetPage(); }} className={`btn-secondary !min-h-[42px] ${onlySaved ? "!border-[#759e55] !bg-[#273a29] !text-lime" : ""}`}><Check size={14} /> {t("Saved")}</button>
      </div>
      <div className="mt-5 flex items-center justify-between border-b border-[#2a3440] pb-3 text-[10px] text-[#8898a5]"><span>{t("Showing")} <strong className="text-[#e7efea]">{Math.min(visible, filtered.length)}</strong> / {filtered.length}</span><span className="inline-flex items-center gap-1.5"><SlidersHorizontal size={12} /> {t("Curated for ethical practice")}</span></div>
      {filtered.length ? <><div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{filtered.slice(0, visible).map(entry => entry.kind === "source" ? <SourceChallengeCard key={entry.challenge.id} challenge={entry.challenge} solved={clearedSource.has(entry.challenge.id)} locked={(() => { const campaign = CAMPAIGNS.find(path => path.id === entry.challenge.campaignId)!; const index = campaign.modules.findIndex(lesson => lesson.id === entry.challenge.moduleId); return index > 0 && !progress.labs.some(row => row.moduleId === campaign.modules[index - 1].id && row.completed); })()} /> : <ChallengeCard key={entry.challenge.id} challenge={entry.challenge} solved={solvedIds.has(entry.challenge.id)} />)}</div>{visible < filtered.length && <div className="mt-7 text-center"><button type="button" className="btn-secondary" onClick={() => setVisible(count => count + 15)}>{lang === "el" ? "Εμφάνιση περισσότερων" : "Load more challenges"} <ArrowRight size={14} /></button></div>}</> : <div className="mt-4"><EmptyState title="No challenges found" description="Try a different search or clear a filter to uncover more missions." icon={<Search size={24} />} /><button type="button" className="mx-auto mt-4 block text-xs font-bold text-lime" onClick={clear}>{t("Clear all filters")}</button></div>}
    </section>
  </div>;
}

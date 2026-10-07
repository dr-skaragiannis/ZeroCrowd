"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, BookOpenCheck, Check, CheckCircle2, ChevronDown, CircleHelp, Code2, Copy, Flag, Lightbulb, ListChecks, RotateCcw, ShieldCheck, Sparkles, TerminalSquare, Zap } from "lucide-react";
import { campaignById, moduleById } from "@/data/lessons";
import { explainCommandResult, studyItemsForModule } from "@/data/commandGuide";
import { COURSE_META } from "@/lib/courseMeta";
import { activateTerminalForModule, createPlayerTerminal, loadPlayerTerminal, savePlayerTerminal } from "@/lib/playerTerminal";
import { prompt, runCommand, type TermLine, type Terminal } from "@/lib/terminal";
import { useLanguage, T } from "@/components/LanguageProvider";
import { useProgressActions } from "@/components/ProgressProvider";
import { ProgressBar } from "@/components/ui";
import LessonVisual from "@/components/LessonVisual";
import QuizPanel from "@/components/QuizPanel";

type Tab = "workspace" | "briefing" | "reference" | "quiz";

export default function LabWorkspace({ campaignId, moduleId, playerId, initialCompletedIds, initiallyCompleted }: { campaignId: string; moduleId: string; playerId: string; initialCompletedIds: string[]; initiallyCompleted: boolean }) {
  const { lang, t, b } = useLanguage();
  const { ensureSession, refresh: refreshProgress } = useProgressActions();
  const campaign = campaignById(campaignId)!;
  const lesson = moduleById(moduleId)!;
  const meta = COURSE_META[campaignId];
  const order = campaign.modules.findIndex(item => item.id === moduleId);
  const nextModule = campaign.modules[order + 1];
  const studyItems = useMemo(() => studyItemsForModule(lesson), [lesson]);
  const [tab, setTab] = useState<Tab>("workspace");
  const [term, setTerm] = useState<Terminal | null>(null);
  const [input, setInput] = useState("");
  const [completedIds, setCompletedIds] = useState(initialCompletedIds);
  const [completed, setCompleted] = useState(initiallyCompleted);
  const [hintFor, setHintFor] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<{ command: string; output: TermLine[] } | null>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const termRef = useRef<Terminal | null>(null);
  const commandHistory = useRef<string[]>([]);
  const historyPos = useRef(-1);
  const latestRequest = useRef(0);
  const syncQueue = useRef<Promise<void>>(Promise.resolve());
  const key = `gamehack.lab.commands:${playerId}:${moduleId}`;

  useEffect(() => {
    const loaded = activateTerminalForModule(loadPlayerTerminal(playerId), moduleId, lesson.scenario || campaign.scenario);
    termRef.current = loaded;
    setTerm({ ...loaded, lines: [...loaded.lines] });
    try {
      const stored: unknown = JSON.parse(localStorage.getItem(key) || "[]");
      commandHistory.current = Array.isArray(stored) ? stored.filter((item): item is string => typeof item === "string").slice(-300) : [];
    } catch { commandHistory.current = []; }
    savePlayerTerminal(playerId, loaded);
    if (window.location.hash.startsWith("#source-challenge-")) {
      const timer = setTimeout(() => document.getElementById(window.location.hash.slice(1))?.scrollIntoView({ behavior: "smooth", block: "center" }), 350);
      return () => clearTimeout(timer);
    }
  }, [playerId, moduleId, lesson.scenario, campaign.scenario, key]);

  useEffect(() => { if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight; }, [term?.lines.length, tab]);
  useEffect(() => { if (!notice) return; const timer = setTimeout(() => setNotice(null), 5000); return () => clearTimeout(timer); }, [notice]);

  const objectiveIds = [...lesson.tasks.map(task => task.id), "ch-0", "ch-1"];
  const locallyDone = term ? [
    ...lesson.tasks.filter(task => task.check(term)).map(task => task.id),
    ...lesson.challenges.flatMap((challenge, index) => challenge.check(term) ? [`ch-${index}`] : []),
  ] : [];
  const done = new Set([...completedIds, ...locallyDone]);
  const doneCount = objectiveIds.filter(id => done.has(id)).length;
  const percent = Math.round(doneCount / objectiveIds.length * 100);
  const insight = lastResult && term ? explainCommandResult(lastResult.command, lastResult.output, term, lang) : null;

  const execute = (raw?: string) => {
    const command = (raw ?? input).trim();
    const current = termRef.current;
    if (!command || !current) return;
    const output = runCommand(current, command);
    current.lines.push(...output);
    current.lines = current.lines.slice(-350);
    savePlayerTerminal(playerId, current);
    setTerm({ ...current, lines: [...current.lines] });
    setLastResult({ command, output });
    setInput(""); historyPos.current = -1;
    inputRef.current?.focus();
    const nextCommands = [...commandHistory.current, command].slice(-300);
    commandHistory.current = nextCommands;
    try { localStorage.setItem(key, JSON.stringify(nextCommands)); } catch { /* Commands remain available for this session. */ }

    const requestId = ++latestRequest.current;
    setSyncing(true);
    syncQueue.current = syncQueue.current.catch(() => {}).then(async () => {
      if (requestId !== latestRequest.current) return;
      try {
        await ensureSession();
        const response = await fetch("/api/labs/progress", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ moduleId, commands: nextCommands }) });
        const data = await response.json();
        if (requestId !== latestRequest.current) return;
        if (!response.ok) { setNotice(data.error || "Could not sync lab progress."); return; }
        setCompletedIds(data.completedTaskIds);
        setCompleted(data.completed);
        if (data.gained > 0) {
          setNotice(data.completed ? `Lab complete! +${data.gained} XP earned.` : `Objective verified. +${data.gained} XP earned.`);
          await refreshProgress().catch(() => {});
        }
      } catch {
        if (requestId === latestRequest.current) setNotice("Working offline. Your terminal is still available; try another command to sync.");
      } finally {
        if (requestId === latestRequest.current) setSyncing(false);
      }
    });
  };

  const reset = () => {
    if (!window.confirm(lang === "el" ? "Επαναφορά προσομοιωμένου τερματικού; Τα XP και οι ολοκληρωμένοι στόχοι παραμένουν αποθηκευμένοι." : "Reset this simulated terminal and its command history? Saved XP and completed objectives will stay on your account.")) return;
    const fresh = activateTerminalForModule(createPlayerTerminal(), moduleId, lesson.scenario || campaign.scenario);
    termRef.current = fresh;
    savePlayerTerminal(playerId, fresh); setTerm({ ...fresh, lines: [...fresh.lines] });
    commandHistory.current = []; setInput(""); setLastResult(null);
    try { localStorage.removeItem(key); } catch { /* Browser storage may be unavailable. */ }
    setNotice(lang === "el" ? "Η προσομοίωση επανήλθε. Η πρόοδός σου είναι ασφαλής." : "Sandbox reset. Your earned progress is safe.");
  };
  const copyCommand = async (command: string) => {
    await navigator.clipboard.writeText(command);
    setCopied(command);
    setTimeout(() => setCopied(null), 1600);
  };
  const keyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") { event.preventDefault(); execute(); }
    if (event.key === "ArrowUp" && commandHistory.current.length) { event.preventDefault(); historyPos.current = Math.min(historyPos.current + 1, commandHistory.current.length - 1); setInput(commandHistory.current[commandHistory.current.length - 1 - historyPos.current]); }
    if (event.key === "ArrowDown" && historyPos.current >= 0) { event.preventDefault(); historyPos.current = Math.max(-1, historyPos.current - 1); setInput(historyPos.current < 0 ? "" : commandHistory.current[commandHistory.current.length - 1 - historyPos.current]); }
  };

  return <div className="space-y-6">
    <Link href={`/academy/${campaignId}`} className="inline-flex items-center gap-2 text-[11px] font-semibold text-[#9aaab4] hover:text-lime"><ArrowLeft size={14} /><T>Back to</T> {lang === "el" ? campaign.title.el : meta.title}</Link>
    <div className="flex flex-wrap items-end justify-between gap-4"><div><div className="page-eyebrow">{t(meta.category)} / <T>Lab</T> {String(order + 1).padStart(2, "0")}</div><h1 className="page-title">{b(lesson.title)}<span className="text-lime">.</span></h1><p className="page-description">{b(lesson.subtitle)}</p></div><div className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-[10px] font-bold tracking-[.08em] ${completed ? "border-[#5c8553] bg-[#233729] text-lime" : "border-[#4e6147] bg-[#213027] text-[#bce7ab]"}`}><span className="status-dot" />{t(completed ? "LAB COMPLETED" : "SIMULATED LAB ACTIVE")}</div></div>

    <div className="panel flex flex-wrap items-center justify-between gap-5 px-5 py-4"><div className="flex items-center gap-4"><span className="grid h-10 w-10 place-items-center rounded-lg bg-[#2a3e2b] text-lime"><TerminalSquare size={19} /></span><div><strong className="text-[12px]"><T>Your mission progress</T></strong><p className="mt-0.5 text-[10px] text-[#899aa3]"><T>Complete objectives in the terminal to earn XP.</T></p></div></div><div className="min-w-[180px] max-w-[320px] flex-1"><div className="mb-2 flex items-center justify-between text-[10px]"><span className="text-[#96a5ac]">{doneCount} / {objectiveIds.length} <T>objectives</T></span><strong className="text-lime">{percent}%</strong></div><ProgressBar percent={percent} /></div><span className="rounded-md border border-[#40513f] bg-[#263629] px-2.5 py-1.5 text-[10px] font-bold text-lime"><Zap size={11} className="mr-1 inline" />{lesson.tasks.length * 10 + 80} <T>XP AVAILABLE</T></span></div>

    <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(310px,1fr)]"><div className="space-y-5">
      <div className="flex gap-1 overflow-x-auto rounded-lg border border-[#2d3742] bg-[#151c25] p-1">{([ ["workspace", "Lab workspace", TerminalSquare], ["briefing", "Briefing", BookOpen], ["reference", "Command guide", Code2], ["quiz", "Knowledge check", BookOpenCheck] ] as const).map(([name, label, Icon]) => <button key={name} onClick={() => setTab(name)} className={`flex min-w-fit flex-1 items-center justify-center gap-2 rounded-md px-3 py-2.5 text-[11px] font-bold transition-colors ${tab === name ? "bg-[#2e402d] text-lime" : "text-[#93a2ad] hover:bg-[#222d35] hover:text-white"}`}><Icon size={14} />{t(label)}</button>)}</div>

      {tab === "workspace" && <>
        <div className="terminal-window"><div className="terminal-bar"><span className="terminal-dot !bg-[#eb807e]" /><span className="terminal-dot !bg-[#e8c477]" /><span className="terminal-dot !bg-[#a8df8b]" /><span className="ml-3 flex-1 truncate">{term ? `${term.user}@${term.host}:${term.cwd}` : t("Initializing sandbox...")}</span><span className="hidden text-[#6f8a79] sm:inline">GAMEHACK LAB // SAFE MODE</span><button className="ml-2 text-[#9ab3a2] hover:text-lime" onClick={reset} title={t("Reset sandbox")} aria-label={t("Reset sandbox")}><RotateCcw size={13} /></button></div><div className="terminal-body" ref={outputRef} onClick={() => inputRef.current?.focus()}>{term ? term.lines.length ? term.lines.map((line, index) => <div key={index} className={`terminal-line ${line.kind}`}>{line.text || "\u00a0"}</div>) : <div className="terminal-line sys"><T>Terminal cleared. Type help to get started.</T></div> : <div className="terminal-line sys"><T>Booting isolated training environment...</T></div>}</div><div className="terminal-input-wrap"><span className="shrink-0">{term ? prompt(term) : "operator@kali:~$"}</span><input ref={inputRef} className="terminal-input" value={input} onChange={event => setInput(event.target.value)} onKeyDown={keyDown} placeholder={t("Type a command...")} autoComplete="off" autoCorrect="off" spellCheck={false} disabled={!term} aria-label={t("Type a command...")} /><button onClick={() => execute()} disabled={!term || !input.trim()} aria-label={lang === "el" ? "Εκτέλεση εντολής" : "Run command"} className="text-lime disabled:opacity-30"><ArrowRight size={17} /></button></div></div>
        <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-[10px] text-[#7e929b]"><span className="inline-flex items-center gap-1.5"><ShieldCheck size={12} className="text-lime" /><T>Virtual filesystem · No real commands are executed</T></span><span>{t(syncing ? "Syncing progress..." : "Progress synced")}</span></div>
        {insight && <section className="panel overflow-hidden border-[#3b5847]"><div className="flex items-center gap-2 border-b border-[#34453e] bg-[#202e27] px-5 py-3"><Sparkles size={15} className="text-lime" /><strong className="display-font text-[13px]">{b(insight.lesson.title)}</strong><code className="ml-auto truncate mono text-[10px] text-[#abd898]">$ {insight.command}</code></div><div className="grid gap-4 p-5 sm:grid-cols-2"><div><span className="text-[9px] font-bold tracking-widest text-lime"><T>Purpose</T></span><p className="mt-1 text-[11px] leading-relaxed text-[#b6c8bf]">{b(insight.lesson.purpose)}</p></div><div><span className="text-[9px] font-bold tracking-widest text-cyan"><T>How it works</T></span><p className="mt-1 text-[11px] leading-relaxed text-[#b6c8bf]">{b(insight.lesson.mechanics)}</p></div><div className="sm:col-span-2"><span className="text-[9px] font-bold tracking-widest text-[#e8c789]"><T>Reading the output</T></span><p className="mt-1 text-[11px] leading-relaxed text-[#b6c8bf]">{insight.reading}</p></div>{insight.lesson.caution && <div className="sm:col-span-2 rounded-md border border-[#62513c] bg-[#342c25] p-3 text-[11px] text-[#e5caa4]">{b(insight.lesson.caution)}</div>}</div></section>}
        <div className="panel p-4"><div className="flex flex-wrap items-center justify-between gap-2"><strong className="text-[11px]"><T>Quick start</T></strong><span className="text-[10px] text-[#82929e]"><T>Click a command to run it</T></span></div><div className="mt-3 flex flex-wrap gap-2">{["help", "whoami", "pwd", "ls -la"].map(command => <button key={command} onClick={() => execute(command)} className="rounded-md border border-[#3a4b40] bg-[#1c2924] px-3 py-1.5 mono text-[10px] text-[#b6e2b2] hover:border-[#80a968]">$ {command}</button>)}</div></div>
      </>}

      {tab === "briefing" && <div className="space-y-4"><section className="panel p-5 md:p-6"><span className="text-[10px] font-bold tracking-widest text-lime"><T>MISSION CONTEXT</T></span><h2 className="display-font mt-2 text-[20px] font-bold"><T>Before you begin</T></h2><p className="mt-2 text-[12px] leading-relaxed text-[#a7b7bd]"><T en="Review the concept, inspect the evidence, then run the command yourself." /></p><div className="mt-4 flex flex-wrap gap-2">{["Concept", "Evidence", "Practice"].map((step, i) => <span key={step} className="rounded-md border border-[#415347] bg-[#22322a] px-2.5 py-1.5 text-[10px] font-bold text-[#c1deb8]">{i + 1}. {t(step)}</span>)}</div></section>{lesson.theory.map((section, index) => <section key={index} className="panel p-5 md:p-6"><span className="mono text-[10px] text-lime">{`// ${String(index + 1).padStart(2, "0")}`}</span><h3 className="display-font mt-2 text-[17px] font-bold">{b(section.heading)}</h3><p className="mt-3 whitespace-pre-wrap text-[11px] leading-[1.85] text-[#abb9bf]">{b(section.body)}</p>{section.tip && <div className="mt-4 flex gap-2 rounded-lg border border-[#546044] bg-[#273026] p-3 text-[11px] leading-relaxed text-[#c6d6b2]"><Lightbulb size={14} className="mt-0.5 shrink-0 text-lime" />{b(section.tip)}</div>}{section.visual && <LessonVisual visual={section.visual} />}{section.shots?.map((shot, shotIndex) => <div key={shotIndex} className="mt-3 rounded-lg border border-[#34433c] bg-[#101b1b] p-3 mono text-[10px] leading-relaxed text-[#b9d7be]">{shot.cmd && <div className="mb-2 text-lime">$ {shot.cmd}</div>}{shot.lines.join("\n")}{shot.caption && <div className="mt-2 text-[#88ab9d]">{b(shot.caption)}</div>}</div>)}</section>)}</div>}

      {tab === "reference" && <div className="panel overflow-hidden"><div className="border-b border-[#2d3742] p-5"><span className="text-[10px] font-bold tracking-widest text-lime"><T>FIELD REFERENCE</T></span><h2 className="display-font mt-2 text-[19px] font-bold"><T>Commands worth knowing</T></h2><p className="mt-1 text-[11px] text-[#91a3ab]"><T>Study the syntax, then try it for yourself in the workspace.</T></p></div><div className="divide-y divide-[#2d3742]">{studyItems.map((item, index) => <details key={`${item.cmd}-${index}`} className="group px-5 py-4 open:bg-[#1b2a29]"><summary className="flex cursor-pointer list-none items-start gap-3"><span className="mt-0.5 text-lime"><TerminalSquare size={14} /></span><div className="min-w-0 flex-1"><code className="mono break-all text-[11px] font-bold text-[#c6f2ad]">{item.cmd}</code><p className="mt-1 text-[11px] leading-relaxed text-[#8c9ca6]">{b(item.desc)}</p></div><button onClick={event => { event.preventDefault(); void copyCommand(item.cmd); }} className="text-[#8da19d] hover:text-lime" aria-label={`${t("Copy")} ${item.cmd}`}>{copied === item.cmd ? <Check size={14} /> : <Copy size={14} />}</button><ChevronDown size={14} className="text-[#8da19d] transition-transform group-open:rotate-180" /></summary>{item.guide && <div className="mt-4 space-y-3 border-t border-[#324a42] pt-4 pl-6"><div><span className="text-[9px] font-bold tracking-widest text-lime"><T>Purpose</T></span><p className="mt-1 text-[11px] leading-relaxed text-[#b4c5c0]">{b(item.guide.purpose)}</p></div><div><span className="text-[9px] font-bold tracking-widest text-cyan"><T>How it works</T></span><p className="mt-1 text-[11px] leading-relaxed text-[#b4c5c0]">{b(item.guide.mechanics)}</p></div><div><span className="text-[9px] font-bold tracking-widest text-[#e3c78a]"><T>Reading the output</T></span><p className="mt-1 text-[11px] leading-relaxed text-[#b4c5c0]">{b(item.guide.output)}</p></div><div className="flex flex-wrap gap-2"><code className="rounded bg-[#11231e] px-2 py-1.5 mono text-[10px] text-lime">{t("Syntax")}: {item.guide.syntax}</code><code className="rounded bg-[#11231e] px-2 py-1.5 mono text-[10px] text-cyan">{t("Example")}: {item.guide.example}</code></div>{item.guide.caution && <p className="rounded border border-[#63523b] bg-[#352b23] p-3 text-[11px] text-[#e9cba0]">{b(item.guide.caution)}</p>}</div>}</details>)}</div></div>}

      {tab === "quiz" && <QuizPanel moduleId={moduleId} />}
      {notice && <div className={`flex items-center gap-2 ${notice.includes("error") || notice.includes("Could not") ? "alert-error" : "alert-success"}`} role="status"><Sparkles size={15} />{notice}</div>}
    </div>

    <div className="space-y-5 xl:sticky xl:top-[92px]"><section className="panel overflow-hidden"><div className="flex items-center justify-between border-b border-[#2d3841] px-5 py-4"><div><h2 className="display-font flex items-center gap-2 text-[17px] font-bold"><ListChecks size={17} className="text-lime" /> <T>Mission objectives</T></h2><p className="mt-1 text-[10px] text-[#8496a0]"><T>Complete these in the terminal.</T></p></div><span className="rounded bg-[#27382b] px-2 py-1 text-[10px] font-bold text-lime">{doneCount}/{objectiveIds.length}</span></div><div className="max-h-[570px] divide-y divide-[#29353c] overflow-y-auto">{lesson.tasks.map((task, index) => { const isDone = done.has(task.id); return <div key={task.id} className="p-4"><div className="flex items-start gap-3"><span className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md border text-[10px] font-bold ${isDone ? "border-[#648c59] bg-[#2c482e] text-lime" : "border-[#46534b] bg-[#202b2a] text-[#879f8c]"}`}>{isDone ? <Check size={14} /> : index + 1}</span><div className="min-w-0 flex-1"><p className={`text-[11px] leading-relaxed ${isDone ? "text-[#b8cbb7]" : "text-[#e0e9e0]"}`}>{b(task.instruction)}</p><button onClick={() => setHintFor(hintFor === task.id ? null : task.id)} className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-[#d5bf84] hover:text-[#f3d998]"><Lightbulb size={12} />{t(hintFor === task.id ? "Hide hint" : "Show hint")}<ChevronDown size={11} className={hintFor === task.id ? "rotate-180" : ""} /></button>{hintFor === task.id && <div className="mt-2 rounded-md border border-[#514f39] bg-[#2a2a21] p-3"><code className="mono block break-all text-[10px] text-[#f4d998]">{b(task.hint)}</code><p className="mt-2 text-[10px] leading-relaxed text-[#a8a997]">{b(task.explain)}</p></div>}</div></div></div>; })}{lesson.challenges.map((challenge, index) => { const isDone = done.has(`ch-${index}`); return <div key={index} id={`source-challenge-${index}`} className="scroll-mt-28 p-4"><div className="flex items-start gap-3"><span className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md border ${isDone ? "border-[#648c59] bg-[#2c482e] text-lime" : "border-[#6e6344] bg-[#373128] text-[#e5c781]"}`}>{isDone ? <Check size={14} /> : <Flag size={12} />}</span><div className="min-w-0 flex-1"><span className="text-[9px] font-bold tracking-widest text-[#c5b076]">{t("BONUS CHALLENGE")} {index + 1}</span><h4 className="mt-1 text-[11px] font-bold">{b(challenge.title)}</h4><p className="mt-1 text-[10px] leading-relaxed text-[#91a0a8]">{b(challenge.brief)}</p><Link href={`/challenges/labs/${lesson.id}/${index}`} className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-lime">{lang === "el" ? "Πλήρης ενημέρωση" : "Full briefing"} <ArrowRight size={11} /></Link></div></div></div>; })}</div><div className="border-t border-[#303e3a] bg-[#1a2721] px-5 py-3 text-[10px] text-[#a3c09d]"><ShieldCheck size={12} className="mr-1.5 inline text-lime" /><T>Objectives are verified against your simulated lab activity.</T></div></section>
      {completed && <div className="panel border-[#5a784d] bg-[#1d2d22] p-5"><CheckCircle2 size={24} className="text-lime" /><h3 className="display-font mt-3 text-[17px] font-bold"><T>Mission complete.</T></h3><p className="mt-1 text-[11px] leading-relaxed text-[#afc5ad]"><T>You&apos;ve mastered this stage. Your XP and progress are saved.</T></p>{nextModule ? <Link href={`/academy/${campaignId}/${nextModule.id}`} className="btn-primary mt-4 w-full"><T>Next lab</T> <ArrowRight size={14} /></Link> : <Link href={`/academy/${campaignId}`} className="btn-primary mt-4 w-full"><T>View path</T> <ArrowRight size={14} /></Link>}</div>}
      <div className="panel p-4"><div className="flex gap-3"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#283c31] text-lime"><CircleHelp size={16} /></span><div><strong className="text-[11px]"><T>Stuck on a command?</T></strong><p className="mt-1 text-[10px] leading-relaxed text-[#91a0a9]">{lang === "el" ? "Άνοιξε τον οδηγό εντολών ή γράψε" : "Open the command guide or type"} <code className="mono text-lime">help</code> {lang === "el" ? "στο τερματικό." : "in the terminal."}</p><button onClick={() => setTab("reference")} className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-lime"><T>Open command guide</T> <ArrowRight size={12} /></button></div></div></div>
    </div></div>
  </div>;
}

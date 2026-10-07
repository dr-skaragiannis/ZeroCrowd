"use client";

import { useEffect, useState } from "react";
import { ArrowRight, BookOpenCheck, Check, CheckCircle2, CircleHelp, RotateCcw, X, Zap } from "lucide-react";
import type { Bi } from "@/data/lessons";
import { useLanguage, T } from "@/components/LanguageProvider";
import { useProgressActions } from "@/components/ProgressProvider";

type Question = { q: Bi; choices: Bi[] };
type Feedback = { correct: boolean; why: Bi; correctChoice: Bi };
type Result = { score: number; total: number; feedback: Feedback[]; best: { score: number; total: number; attempts: number } };

export default function QuizPanel({ moduleId }: { moduleId: string }) {
  const { lang, b } = useLanguage();
  const { ensureSession, refresh: refreshProgress } = useProgressActions();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [best, setBest] = useState<{ score: number; total: number; attempts: number } | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/quizzes/${moduleId}`, { cache: "no-store", signal: controller.signal })
      .then(async response => { if (!response.ok) throw new Error("Quiz unavailable"); return response.json(); })
      .then(data => { setQuestions(data.questions); setAnswers(Array(data.questions.length).fill(null)); setBest(data.best); setLoading(false); })
      .catch(() => { if (!controller.signal.aborted) { setError("quiz-load"); setLoading(false); } });
    return () => controller.abort();
  }, [moduleId]);

  const submit = async () => {
    if (answers.some(answer => answer === null)) { setError(lang === "el" ? "Απάντησε σε όλες τις ερωτήσεις πριν υποβάλεις το κουίζ." : "Answer every question before submitting."); return; }
    setBusy(true); setError("");
    try {
      await ensureSession();
      const response = await fetch(`/api/quizzes/${moduleId}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ answers }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not submit your answers.");
      setResult(data); setBest(data.best);
      void refreshProgress().catch(() => {});
    } catch (caught) { setError(caught instanceof Error ? caught.message : (lang === "el" ? "Κάτι πήγε στραβά." : "Something went wrong.")); }
    finally { setBusy(false); }
  };

  if (loading) return <div className="panel p-10 text-center text-[12px] text-soft" role="status">{lang === "el" ? "Φόρτωση κουίζ..." : "Loading questions..."}</div>;
  return <div className="space-y-4"><section className="panel overflow-hidden"><div className="border-b border-[#334036] bg-[radial-gradient(circle_at_90%_0%,rgba(197,244,123,.12),transparent_45%),#1b2922] p-5 md:p-6"><span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#30472d] text-lime"><BookOpenCheck size={20} /></span><h2 className="display-font mt-3 text-[20px] font-bold"><T>Knowledge check</T></h2><p className="mt-1 text-[11px] leading-relaxed text-[#a6b9aa]"><T>Learn the concepts first, then test your understanding with three quick questions.</T></p><p className="mt-2 text-[10px] text-[#90a49b]"><T>All answers are checked on the server. Your best result is saved.</T></p>{best && <div className="mt-4 inline-flex items-center gap-2 rounded-md border border-[#5a794d] bg-[#283e2a] px-3 py-1.5 text-[11px] font-bold text-lime"><CheckCircle2 size={13} /><T>Your best score</T>: {best.score}/{best.total} · {best.attempts} {lang === "el" ? "προσπάθειες" : "attempts"}</div>}</div>
      <div className="divide-y divide-[#2d3940]">{questions.map((question, index) => {
        const feedback = result?.feedback[index];
        return <div key={index} className="p-5 md:p-6"><div className="flex items-start gap-3"><span className={`mono grid h-7 w-7 shrink-0 place-items-center rounded-md text-[11px] font-bold ${feedback ? feedback.correct ? "bg-[#2c4a31] text-lime" : "bg-[#513334] text-[#ffa9ad]" : "bg-[#303f33] text-lime"}`}>{feedback ? feedback.correct ? <Check size={15} /> : <X size={15} /> : String(index + 1).padStart(2, "0")}</span><div className="flex-1"><span className="text-[10px] font-bold tracking-widest text-[#93a99d]"><T>Checkpoint</T> {String(index + 1).padStart(2, "0")}</span><h3 className="display-font mt-1 text-[15px] font-bold leading-snug">{b(question.q)}</h3></div></div><div className="mt-4 grid gap-2 sm:grid-cols-2">{question.choices.map((choice, choiceIndex) => {
          const selected = answers[index] === choiceIndex;
          return <button key={choiceIndex} type="button" disabled={!!result} onClick={() => { setAnswers(current => current.map((value, i) => i === index ? choiceIndex : value)); setError(""); }} className={`flex min-h-[42px] items-center gap-2.5 rounded-lg border px-3 py-2 text-left text-[11px] leading-snug transition-colors ${selected ? feedback && !feedback.correct ? "border-[#b27172] bg-[#3d2c30] text-[#ffb7b8]" : "border-[#8da961] bg-[#293d2c] text-[#d5f6b7]" : "border-[#35424a] bg-[#1c2630] text-[#acbac2] hover:border-[#647b60]"}`}><span className={`mono grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[9px] ${selected ? "border-current bg-[#adc98a]/15" : "border-[#556670]"}`}>{String.fromCharCode(65 + choiceIndex)}</span>{b(choice)}</button>;
        })}</div>{feedback && <div className={`mt-3 rounded-lg border p-3 text-[11px] leading-relaxed ${feedback.correct ? "border-[#55734d] bg-[#233629] text-[#cbe5b9]" : "border-[#755453] bg-[#34262a] text-[#ebc5bd]"}`}><strong>{feedback.correct ? (lang === "el" ? "Σωστά!" : "Correct!") : (lang === "el" ? "Σωστή απάντηση:" : "Correct answer:") + " " + b(feedback.correctChoice)}</strong><p className="mt-1">{b(feedback.why)}</p></div>}</div>;
      })}</div></section>
    {error && <div className="alert-error" role="alert">{error === "quiz-load" ? (lang === "el" ? "Δεν ήταν δυνατή η φόρτωση του κουίζ." : "Could not load the quiz.") : error}</div>}
    <div className="flex flex-wrap items-center gap-3">{result ? <><div className={`rounded-lg border px-4 py-3 text-[12px] font-bold ${result.score === result.total ? "border-[#739657] bg-[#293f2e] text-lime" : "border-[#675f41] bg-[#343022] text-[#e9cb88]"}`}>{result.score === result.total ? <T>Excellent work!</T> : <T>Keep practicing</T>} · {result.score}/{result.total}</div><button className="btn-secondary" onClick={() => { setAnswers(Array(questions.length).fill(null)); setResult(null); setError(""); }}><RotateCcw size={14} /><T>Try again</T></button><p className="text-[10px] text-[#91a1a9]"><T>Review the explanations below, then try again.</T></p></> : <button className="btn-primary" onClick={() => void submit()} disabled={busy || questions.length === 0}>{busy ? (lang === "el" ? "Υποβολή..." : "Checking...") : <T>Submit answers</T>} <ArrowRight size={14} /></button>}</div>
  </div>;
}

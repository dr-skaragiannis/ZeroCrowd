import { and, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { quizResults } from "@/db/schema";
import { moduleById } from "@/data/lessons";
import { QUIZZES } from "@/data/quizzes";
import { createGuestSession, getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

function getQuiz(moduleId: string) {
  return moduleById(moduleId) ? QUIZZES[moduleId] : undefined;
}

export async function GET(_request: Request, { params }: { params: Promise<{ moduleId: string }> }) {
  const { moduleId } = await params;
  const questions = getQuiz(moduleId);
  if (!questions) return Response.json({ error: "Quiz not found." }, { status: 404 });
  const player = await getCurrentUser();
  const [best] = player ? await db.select({ score: quizResults.score, total: quizResults.total, attempts: quizResults.attempts })
    .from(quizResults).where(and(eq(quizResults.userId, player.id), eq(quizResults.moduleId, moduleId))).limit(1) : [];
  return Response.json({ questions: questions.map(({ q, choices }) => ({ q, choices })), best: best ?? null }, { headers: { "Cache-Control": "private, no-store" } });
}

export async function POST(request: Request, { params }: { params: Promise<{ moduleId: string }> }) {
  const { moduleId } = await params;
  const questions = getQuiz(moduleId);
  if (!questions) return Response.json({ error: "Quiz not found." }, { status: 404 });
  const body = await request.json().catch(() => null);
  const answers: unknown = body?.answers;
  if (!Array.isArray(answers) || answers.length !== questions.length || answers.some((answer, i) => !Number.isInteger(answer) || answer < 0 || answer >= questions[i].choices.length)) {
    return Response.json({ error: "Answer every question before submitting." }, { status: 400 });
  }
  const selected = answers as number[];
  const feedback = questions.map((question, i) => ({
    correct: selected[i] === question.answer,
    why: question.why,
    correctChoice: question.choices[question.answer],
  }));
  const score = feedback.filter(item => item.correct).length;
  const player = await getCurrentUser() ?? await createGuestSession();
  const [best] = await db.insert(quizResults).values({ userId: player.id, moduleId, score, total: questions.length, attempts: 1 })
    .onConflictDoUpdate({
      target: [quizResults.userId, quizResults.moduleId],
      set: { score: sql`greatest(${quizResults.score}, ${score})`, total: questions.length, attempts: sql`${quizResults.attempts} + 1`, updatedAt: new Date() },
    }).returning({ score: quizResults.score, total: quizResults.total, attempts: quizResults.attempts });
  return Response.json({ score, total: questions.length, best, feedback }, { headers: { "Cache-Control": "private, no-store" } });
}

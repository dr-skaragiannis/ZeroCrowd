import { and, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { activities, labProgress, quizResults } from "@/db/schema";
import { campaignForModule, moduleById } from "@/data/lessons";
import { QUIZZES } from "@/data/quizzes";
import { assessmentPassMark, hasPassedAssessment } from "@/lib/assessment";
import { createGuestSession, getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

function getQuiz(moduleId: string) {
  return moduleById(moduleId) ? QUIZZES[moduleId] : undefined;
}

export async function GET(_request: Request, { params }: { params: Promise<{ moduleId: string }> }) {
  const { moduleId } = await params;
  const questions = getQuiz(moduleId);
  if (!questions) return Response.json({ error: "Assessment not found." }, { status: 404 });

  const player = await getCurrentUser();
  const [best] = player ? await db.select({ score: quizResults.score, total: quizResults.total, attempts: quizResults.attempts })
    .from(quizResults).where(and(eq(quizResults.userId, player.id), eq(quizResults.moduleId, moduleId))).limit(1) : [];

  return Response.json({
    questions: questions.map(({ q, choices }) => ({ q, choices })),
    best: best ? { ...best, passed: hasPassedAssessment(best.score, best.total) } : null,
    passMark: assessmentPassMark(questions.length),
  }, { headers: { "Cache-Control": "private, no-store" } });
}

export async function POST(request: Request, { params }: { params: Promise<{ moduleId: string }> }) {
  const { moduleId } = await params;
  const questions = getQuiz(moduleId);
  const lesson = moduleById(moduleId);
  const campaign = campaignForModule(moduleId);
  if (!questions || !lesson || !campaign) return Response.json({ error: "Assessment not found." }, { status: 404 });

  const body = await request.json().catch(() => null);
  const answers: unknown = body?.answers;
  if (!Array.isArray(answers) || answers.length !== questions.length || answers.some((answer, index) =>
    !Number.isInteger(answer) || answer < 0 || answer >= questions[index].choices.length
  )) {
    return Response.json({ error: "Answer every question before submitting." }, { status: 400 });
  }

  const selected = answers as number[];
  const feedback = questions.map((question, index) => ({
    correct: selected[index] === question.answer,
    why: question.why,
    correctChoice: question.choices[question.answer],
  }));
  const score = feedback.filter(item => item.correct).length;
  const passed = hasPassedAssessment(score, questions.length);
  const player = await getCurrentUser() ?? await createGuestSession();

  const completion = await db.transaction(async tx => {
    const [best] = await tx.insert(quizResults).values({ userId: player.id, moduleId, score, total: questions.length, attempts: 1 })
      .onConflictDoUpdate({
        target: [quizResults.userId, quizResults.moduleId],
        set: {
          score: sql`greatest(${quizResults.score}, ${score})`,
          total: questions.length,
          attempts: sql`${quizResults.attempts} + 1`,
          updatedAt: new Date(),
        },
      }).returning({ score: quizResults.score, total: quizResults.total, attempts: quizResults.attempts });

    const assessmentPassed = hasPassedAssessment(best.score, best.total);
    const requiredObjectiveIds = [...lesson.tasks.map(task => task.id), ...lesson.challenges.map((_, index) => `ch-${index}`)];
    const [lab] = await tx.select().from(labProgress)
      .where(and(eq(labProgress.userId, player.id), eq(labProgress.moduleId, moduleId)))
      .for("update")
      .limit(1);
    const objectivesComplete = !!lab && requiredObjectiveIds.every(id => lab.completedTaskIds.includes(id));
    const completesLab = assessmentPassed && objectivesComplete && !lab.completed;

    if (completesLab && lab) {
      const earnedPoints = lab.earnedPoints + 40;
      await tx.update(labProgress).set({ completed: true, earnedPoints, updatedAt: new Date() }).where(eq(labProgress.id, lab.id));
      await tx.insert(activities).values({
        userId: player.id,
        type: "lab",
        title: `Completed ${lesson.title.en}`,
        description: `${campaign.title.en} · assessment passed`,
        points: 40,
      });
    }

    return {
      best: { ...best, passed: assessmentPassed },
      assessmentPassed,
      completed: Boolean(lab?.completed || completesLab),
      gained: completesLab ? 40 : 0,
    };
  });

  return Response.json({
    score,
    total: questions.length,
    passed,
    assessmentPassed: completion.assessmentPassed,
    completed: completion.completed,
    gained: completion.gained,
    best: completion.best,
    feedback,
  }, { headers: { "Cache-Control": "private, no-store" } });
}

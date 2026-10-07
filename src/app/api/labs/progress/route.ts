import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { activities, labProgress, quizResults } from "@/db/schema";
import { campaignForModule, moduleById } from "@/data/lessons";
import { activateTerminalForModule, createPlayerTerminal } from "@/lib/playerTerminal";
import { hasPassedAssessment } from "@/lib/assessment";
import { runCommand } from "@/lib/terminal";
import { createGuestSession, getCurrentUser } from "@/lib/session";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const moduleId = typeof body?.moduleId === "string" ? body.moduleId : "";
  const lesson = moduleById(moduleId);
  const campaign = campaignForModule(moduleId);
  if (!lesson || !campaign) return Response.json({ error: "Lab not found." }, { status: 404 });

  const commands = body?.commands;
  if (!Array.isArray(commands) || commands.length > 300 || commands.some(command => typeof command !== "string" || command.length > 400)) {
    return Response.json({ error: "Invalid lab command history." }, { status: 400 });
  }

  const player = await getCurrentUser() ?? await createGuestSession();
  const index = campaign.modules.findIndex(item => item.id === moduleId);
  if (index > 0) {
    const previous = campaign.modules[index - 1];
    const [previousProgress] = await db.select().from(labProgress)
      .where(and(eq(labProgress.userId, player.id), eq(labProgress.moduleId, previous.id))).limit(1);
    if (!previousProgress?.completed) return Response.json({ error: "Complete the previous lab to unlock this one." }, { status: 403 });
  }

  const terminal = activateTerminalForModule(createPlayerTerminal(), moduleId, lesson.scenario || campaign.scenario);
  for (const command of commands) {
    if (command.trim()) runCommand(terminal, command);
  }
  const verified = [
    ...lesson.tasks.filter(task => task.check(terminal)).map(task => task.id),
    ...lesson.challenges.flatMap((challenge, index) => challenge.check(terminal) ? [`ch-${index}`] : []),
  ];
  const [existing] = await db.select().from(labProgress)
    .where(and(eq(labProgress.userId, player.id), eq(labProgress.moduleId, moduleId))).limit(1);
  const previousIds = existing?.completedTaskIds ?? [];
  const newIds = verified.filter(id => !previousIds.includes(id));
  const completedTaskIds = [...new Set([...previousIds, ...verified])];
  const requiredObjectiveIds = [...lesson.tasks.map(task => task.id), ...lesson.challenges.map((_, i) => `ch-${i}`)];
  const objectivesComplete = requiredObjectiveIds.every(id => completedTaskIds.includes(id));
  const [assessment] = await db.select({ score: quizResults.score, total: quizResults.total })
    .from(quizResults).where(and(eq(quizResults.userId, player.id), eq(quizResults.moduleId, moduleId))).limit(1);
  const assessmentPassed = assessment ? hasPassedAssessment(assessment.score, assessment.total) : false;
  const completed = objectivesComplete && assessmentPassed;
  const completedNow = completed && !existing?.completed;
  const gained = newIds.reduce((sum, id) => sum + (id.startsWith("ch-") ? 20 : 10), 0) + (completedNow ? 40 : 0);
  const earnedPoints = (existing?.earnedPoints ?? 0) + gained;

  if (!existing) {
    await db.insert(labProgress).values({ userId: player.id, moduleId, completedTaskIds, completed, earnedPoints }).onConflictDoNothing();
  } else if (newIds.length || completedNow) {
    await db.update(labProgress).set({ completedTaskIds, completed, earnedPoints, updatedAt: new Date() }).where(eq(labProgress.id, existing.id));
  }
  if (gained) {
    await db.insert(activities).values({
      userId: player.id,
      type: "lab",
      title: completedNow ? `Completed ${lesson.title.en}` : `Progressed in ${lesson.title.en}`,
      description: `${campaign.title.en} · ${newIds.length} objective${newIds.length === 1 ? "" : "s"}`,
      points: gained,
    });
  }

  return Response.json({ completedTaskIds, completed, assessmentPassed, earnedPoints, gained, total: requiredObjectiveIds.length });
}

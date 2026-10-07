import { CAMPAIGNS, type Bi } from "@/data/lessons";
import type { ChallengeCategory, ChallengeDifficulty, ChallengeTone } from "@/lib/challenges";

export type SourceChallenge = {
  id: string;
  campaignId: string;
  moduleId: string;
  challengeIndex: number;
  title: Bi;
  brief: Bi;
  success: Bi;
  moduleTitle: Bi;
  campaignTitle: Bi;
  difficulty: ChallengeDifficulty;
  category: ChallengeCategory;
  tone: ChallengeTone;
  href: string;
  labHref: string;
  objectiveCount: number;
  pathNumber: number;
  moduleOrder: number;
};

function difficulty(level: number): ChallengeDifficulty {
  if (level <= 1) return "Beginner";
  if (level === 2) return "Easy";
  if (level === 3) return "Medium";
  return "Hard";
}
function categoryFor(campaignId: string, moduleId: string): ChallengeCategory {
  if (campaignId === "dfir-fieldwork") return "Digital Forensics";
  if (campaignId === "wirewalk" || /network|recon|scan|ssh|sweep/.test(moduleId)) return "Network Security";
  if (/sql|web|curl|http|brute|credential/.test(moduleId)) return "Web Exploitation";
  return "Linux";
}
function toneFor(campaignId: string): ChallengeTone {
  if (campaignId === "dfir-fieldwork" || campaignId === "wirewalk") return "cyan";
  if (campaignId === "raven") return "violet";
  if (campaignId === "sudorun" || campaignId === "linux-beginners-3") return "orange";
  return "lime";
}

// All original challenge checks remain in the imported lesson engine. These are
// catalog entries only; a solve is awarded exclusively by /api/labs/progress.
export const SOURCE_CHALLENGES: SourceChallenge[] = CAMPAIGNS.flatMap(campaign =>
  campaign.modules.flatMap(lesson => lesson.challenges.map((challenge, index) => ({
    id: `lab:${lesson.id}:${index}`,
    campaignId: campaign.id,
    moduleId: lesson.id,
    challengeIndex: index,
    title: challenge.title,
    brief: challenge.brief,
    success: challenge.success,
    moduleTitle: lesson.title,
    campaignTitle: campaign.title,
    difficulty: difficulty(lesson.difficulty),
    category: categoryFor(campaign.id, lesson.id),
    tone: toneFor(campaign.id),
    href: `/challenges/labs/${lesson.id}/${index}`,
    labHref: `/academy/${campaign.id}/${lesson.id}#source-challenge-${index}`,
    objectiveCount: lesson.tasks.length + 2,
    pathNumber: campaign.pathNumber,
    moduleOrder: lesson.order,
  })))
);

export function getSourceChallenge(moduleId: string, index: number): SourceChallenge | undefined {
  return SOURCE_CHALLENGES.find(challenge => challenge.moduleId === moduleId && challenge.challengeIndex === index);
}

export function getSourceChallengeById(id: string): SourceChallenge | undefined {
  return SOURCE_CHALLENGES.find(challenge => challenge.id === id);
}

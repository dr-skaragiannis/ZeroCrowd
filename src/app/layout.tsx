import type { Metadata } from "next";
import type { ReactNode } from "react";
import { cookies } from "next/headers";
import PlatformShell from "@/components/PlatformShell";
import { ProgressProvider } from "@/components/ProgressProvider";
import { LanguageProvider } from "@/components/LanguageProvider";
import { LANGUAGE_COOKIE, type Lang } from "@/lib/language";
import { CAMPAIGNS } from "@/data/lessons";
import { CHALLENGES } from "@/lib/challenges";
import { challengeCopy } from "@/data/challengeEducation";
import { SOURCE_CHALLENGES } from "@/lib/sourceChallenges";
import { getPlatformState, toProgressSnapshot } from "@/lib/platform";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Gamehack — Cyber Range", template: "%s | Gamehack" },
  description: "Gamehack is the hands-on cyber range for curious minds. Capture flags, sharpen your skills, and rise through the ranks.",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const preferred = (await cookies()).get(LANGUAGE_COOKIE)?.value;
  const lang: Lang = preferred === "el" ? "el" : "en";
  const state = await getPlatformState();
  const searchItems = [
    { title: "Dashboard", titleEl: "Αρχική", subtitle: "Your command center", subtitleEl: "Το κέντρο ελέγχου σου", href: "/", type: "Page" },
    { title: "Challenges", titleEl: "Προκλήσεις", subtitle: "Capture your next flag", subtitleEl: "Βρες την επόμενη σημαία", href: "/challenges", type: "Page" },
    { title: "Leaderboard", titleEl: "Κατάταξη", subtitle: "Meet the top operators", subtitleEl: "Γνώρισε τους κορυφαίους παίκτες", href: "/leaderboard", type: "Page" },
    ...CHALLENGES.map(challenge => ({ title: challenge.title, titleEl: challengeCopy(challenge, "el").title, subtitle: `${challenge.category} · ${challenge.points} XP`, subtitleEl: `${challengeCopy(challenge, "el").summary} · ${challenge.points} XP`, href: `/challenges/${challenge.id}`, type: "Challenge" })),
    ...CAMPAIGNS.map(campaign => ({ title: campaign.title.en, titleEl: campaign.title.el, subtitle: `${campaign.modules.length} hands-on labs`, subtitleEl: `${campaign.modules.length} πρακτικά εργαστήρια`, href: `/academy/${campaign.id}`, type: "Learning path" })),
    ...SOURCE_CHALLENGES.map(challenge => ({ title: challenge.title.en, titleEl: challenge.title.el, subtitle: `${challenge.campaignTitle.en} · ${challenge.moduleTitle.en}`, subtitleEl: `${challenge.campaignTitle.el} · ${challenge.moduleTitle.el}`, href: challenge.href, type: "Lab challenge" })),
  ];
  return <html lang={lang}><body><LanguageProvider initial={lang}><ProgressProvider initial={toProgressSnapshot(state)}><PlatformShell searchItems={searchItems} challengeCount={CHALLENGES.length + SOURCE_CHALLENGES.length}>{children}</PlatformShell></ProgressProvider></LanguageProvider></body></html>;
}

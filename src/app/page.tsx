import { T } from "@/components/LanguageProvider";
import Link from "next/link";
import { ArrowRight, BookOpen, ChevronRight, Crosshair } from "lucide-react";
import { CHALLENGES, publicChallenge } from "@/lib/challenges";
import { getLeaderboard, getLiveFeed, getPlatformState } from "@/lib/platform";
import { SectionTitle } from "@/components/ui";
import { DashboardActivity, DashboardDailyObjective, DashboardJourney, DashboardPaths, DashboardRecommendations, DashboardResume, DashboardStats, DashboardTopOperators, DashboardWelcome } from "@/components/DashboardLive";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const state = await getPlatformState();
  const ranking = await getLeaderboard(state);
  const community = getLiveFeed(state).filter(item => !item.you).map(item => ({
    id: item.id, handle: item.handle, text: item.text, time: item.time.toISOString(), tone: item.tone, points: item.points,
  }));
  const recommendations = ["cookie-crumbs", "mirror-protocol", "cold-storage"].map(id => publicChallenge(CHALLENGES.find(challenge => challenge.id === id)!));

  return <div className="space-y-7">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><div className="page-eyebrow"><T>COMMAND CENTER / OVERVIEW</T></div><h1 className="page-title"><DashboardWelcome /></h1><p className="page-description"><T>Your arena is ready. Pick up where you left off, or take on something new.</T></p></div><div className="hidden items-center gap-2 rounded-md border border-[#33453d] bg-[#19271f] px-3 py-2 text-[10px] font-bold tracking-[.08em] text-[#b8ec98] lg:flex"><span className="status-dot" /> <T>OPERATOR ONLINE</T></div></div>

    <section className="hero-panel" aria-label="Explore Gamehack cyber range"><div className="hero-content"><div className="hero-kicker"><i /> <T>THE ARENA IS YOURS</T></div><h2 className="hero-title"><T>Think like a hacker.</T><br /><em><T>Train like a pro.</T></em></h2><p className="hero-copy"><T>Solve real-world inspired challenges, master new skills in a safe lab, and climb the ranks. Your next breakthrough starts here.</T></p><div className="hero-actions"><Link className="btn-primary" href="/challenges"><Crosshair size={15} /> <T>Explore challenges</T> <ArrowRight size={14} /></Link><DashboardResume /></div></div><span className="hero-corner"><T>GAMEHACK // SECURE TRAINING ENVIRONMENT</T></span></section>

    <DashboardStats ranking={ranking} />

    <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.75fr)_minmax(300px,1fr)]"><div className="space-y-8">
      <section><SectionTitle title="Continue your journey" subtitle="Get back into the lab and keep your momentum going." href="/academy" action="All learning paths" /><DashboardJourney /></section>
      <section><SectionTitle title="Recommended challenges" subtitle="Handpicked missions to push your skills further." href="/challenges" action="Browse all challenges" /><DashboardRecommendations recommendations={recommendations} /></section>
      <section><SectionTitle title="Explore learning paths" subtitle="Structured training, from the first command to advanced defense." href="/academy" action="View academy" /><DashboardPaths /></section>
    </div><div className="space-y-6">
      <section><SectionTitle title="Daily objective" subtitle="A little progress, every single day." /><DashboardDailyObjective /></section>
      <section><SectionTitle title="Top operators" subtitle="The minds making moves this season." href="/leaderboard" action="Full rankings" /><DashboardTopOperators ranking={ranking} /></section>
      <section><SectionTitle title="Live activity" subtitle="What&apos;s happening across the arena." href="/activity" action="View feed" /><DashboardActivity community={community} /></section>
      <Link href="/help" className="panel flex items-center gap-3 p-4 transition-colors hover:border-[#586b55]"><span className="grid h-9 w-9 place-items-center rounded-lg bg-[#263529] text-lime"><BookOpen size={17} /></span><span className="flex-1"><strong className="block text-[11px]"><T>New to the arena?</T></strong><span className="text-[10px] text-[#8d9ba5]"><T>Learn how Gamehack works</T></span></span><ChevronRight size={16} className="text-[#8d9ba5]" /></Link>
    </div></div>
  </div>;
}

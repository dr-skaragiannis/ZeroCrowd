import { BiText, T } from "@/components/LanguageProvider";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen, Clock3, ShieldCheck } from "lucide-react";
import { campaignById } from "@/data/lessons";
import { COURSE_META } from "@/lib/courseMeta";
import CourseRoadmap, { CourseStartLink } from "@/components/CourseRoadmap";

export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: { params: Promise<{ campaignId: string }> }): Promise<Metadata> {
  const { campaignId } = await params;
  return { title: COURSE_META[campaignId]?.title ?? "Learning Path" };
}

export default async function CoursePage({ params }: { params: Promise<{ campaignId: string }> }) {
  const { campaignId } = await params;
  const campaign = campaignById(campaignId);
  if (!campaign) notFound();
  const meta = COURSE_META[campaignId];
  const accent = meta.tone === "violet" ? "#bdaeff" : meta.tone === "cyan" ? "#8de5e9" : meta.tone === "orange" ? "#f1bc92" : "#c5f47b";

  return <div className="space-y-6"><Link href="/academy" className="inline-flex items-center gap-2 text-[11px] font-semibold text-[#9aaab4] hover:text-lime"><ArrowLeft size={14} /> <T>All learning paths</T></Link>
    <section className="panel relative overflow-hidden" style={{ backgroundImage: meta.image ? `linear-gradient(90deg,#1b222c 2%,rgba(27,34,44,.94) 42%,rgba(27,34,44,.42) 100%),url('${meta.image}')` : `linear-gradient(90deg,rgba(19,25,30,.75),rgba(19,25,30,.18)),${meta.gradient}`, backgroundSize: "cover", backgroundPosition: "center" }}><div className="relative z-10 max-w-[700px] p-7 md:p-10"><span className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[.16em]" style={{ color: accent }}><T>PATH</T> {String(campaign.pathNumber).padStart(2, "0")} / <T en={meta.category} /></span><h1 className="display-font mt-4 text-[34px] font-bold leading-[1.08] tracking-[-.055em] md:text-[45px]"><T en={meta.title} /><span style={{ color: accent }}>.</span></h1><p className="mt-3 max-w-[480px] text-[12px] leading-relaxed text-[#b7c6c4]"><BiText text={campaign.blurb} /></p><div className="mt-5 flex flex-wrap gap-4 text-[10px] font-semibold text-[#c2cece]"><span className="inline-flex items-center gap-1.5"><BookOpen size={13} />{campaign.modules.length} <T>hands-on labs</T></span><span className="inline-flex items-center gap-1.5"><Clock3 size={13} />{meta.duration}</span><span className="inline-flex items-center gap-1.5"><ShieldCheck size={13} />{meta.level}</span></div><CourseStartLink campaignId={campaignId} /></div></section>
    <CourseRoadmap campaignId={campaignId} />
  </div>;
}

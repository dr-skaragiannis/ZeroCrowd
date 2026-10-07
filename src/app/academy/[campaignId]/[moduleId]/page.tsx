import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { campaignById } from "@/data/lessons";
import LabGate from "@/components/LabGate";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ campaignId: string; moduleId: string }> }): Promise<Metadata> {
  const { campaignId, moduleId } = await params;
  const lesson = campaignById(campaignId)?.modules.find(item => item.id === moduleId);
  return { title: lesson?.title.en ?? "Lab" };
}

export default async function LabPage({ params }: { params: Promise<{ campaignId: string; moduleId: string }> }) {
  const { campaignId, moduleId } = await params;
  const campaign = campaignById(campaignId);
  if (!campaign?.modules.some(lesson => lesson.id === moduleId)) notFound();
  return <LabGate campaignId={campaignId} moduleId={moduleId} />;
}

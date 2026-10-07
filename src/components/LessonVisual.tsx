"use client";

import { Activity, ArrowRight, Fingerprint, GitBranch, Layers3, Network, ScanSearch } from "lucide-react";
import type { SectionVisual } from "@/data/lessons";
import { useLanguage } from "@/components/LanguageProvider";

export default function LessonVisual({ visual }: { visual: SectionVisual }) {
  const { b } = useLanguage();
  const Icon = visual.kind === "network" ? Network : visual.kind === "timeline" ? Activity : visual.kind === "tree" || visual.kind === "chain" ? GitBranch : visual.kind === "hash" || visual.kind === "hex" ? Fingerprint : visual.kind === "layers" ? Layers3 : ScanSearch;
  return <figure className="mt-5 overflow-hidden rounded-xl border border-[#36534c] bg-[#101b20]">
    <figcaption className="flex items-start gap-3 border-b border-[#2c4442] bg-[linear-gradient(110deg,#1e3330,#15252a)] p-4"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-[#4d7867] bg-[#28453e] text-cyan"><Icon size={17} /></span><div><strong className="display-font block text-[13px] text-[#d5f1e7]">{b(visual.title)}</strong>{visual.caption && <p className="mt-1 text-[10px] leading-relaxed text-[#92b3ac]">{b(visual.caption)}</p>}</div></figcaption>
    <div className={`grid gap-2 p-3 sm:p-4 ${visual.kind === "table" || visual.kind === "network" || visual.kind === "layers" ? "sm:grid-cols-2" : "grid-cols-1"}`}>
      {visual.items.map((item, index) => <div key={`${index}-${item.label.en}`} className={`relative rounded-lg border px-3.5 py-3 ${item.tone === "hot" ? "border-[#79534e] bg-[#322522]" : item.tone === "good" ? "border-[#4a7658] bg-[#1d352d]" : item.tone === "cool" ? "border-[#416a75] bg-[#1b343d]" : "border-[#344a52] bg-[#1b2930]"}`} style={visual.kind === "tree" ? { marginLeft: `${Math.min(item.depth ?? 0, 3) * 14}px` } : undefined}><div className="flex items-center gap-2"><span className="mono shrink-0 text-[9px] font-bold text-[#78d9e6]">{String(index + 1).padStart(2, "0")}</span><strong className="text-[11px] text-[#e4f1ed]">{b(item.label)}</strong></div>{item.value && <p className="mt-2 break-words mono text-[11px] text-[#bce6d3]">{b(item.value)}</p>}{item.detail && <p className="mt-1 text-[10px] leading-relaxed text-[#9cafb1]">{b(item.detail)}</p>}</div>)}
    </div>
  </figure>;
}

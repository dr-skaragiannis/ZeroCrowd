"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, Binary, BookOpen, Check, Clock3, Compass, Fingerprint, Flag, Globe2, LockKeyhole, Network, TerminalSquare, Users } from "lucide-react";
import type { ChallengeCategory, ChallengeDifficulty, ChallengeTone, PublicChallenge } from "@/lib/challenges";
import type { SourceChallenge } from "@/lib/sourceChallenges";
import { challengeCopy } from "@/data/challengeEducation";
import { useLanguage } from "@/components/LanguageProvider";

export function Avatar({ name, color = "#c5f47b", size = "normal" }: { name: string; color?: string; size?: "sm" | "normal" | "lg" }) {
  const initials = name.replace(/^0x/i, "").split(/[\s_-]+/).filter(Boolean).slice(0, 2).map(part => part[0]).join("").toUpperCase() || "G";
  return <span className={`avatar ${size === "normal" ? "" : size}`} style={{ background: color }} aria-hidden="true">{initials}</span>;
}

export function DifficultyBadge({ difficulty }: { difficulty: ChallengeDifficulty }) {
  const { t } = useLanguage();
  return <span className={`difficulty ${difficulty.toLowerCase()}`}><span className="h-1 w-1 rounded-full bg-current" />{t(difficulty)}</span>;
}

const CATEGORY_ICONS: Record<ChallengeCategory, typeof Globe2> = {
  "Web Exploitation": Globe2,
  "Cryptography": LockKeyhole,
  "Digital Forensics": Fingerprint,
  "OSINT": Compass,
  "Reverse Engineering": Binary,
  "Linux": TerminalSquare,
  "Network Security": Network,
};

export function CategoryIcon({ category, size = 20 }: { category: ChallengeCategory; size?: number }) {
  const Icon = CATEGORY_ICONS[category];
  return <Icon size={size} strokeWidth={1.7} />;
}

export function CategoryVisual({ category, tone, compact = false }: { category: ChallengeCategory; tone: ChallengeTone; compact?: boolean }) {
  const Icon = CATEGORY_ICONS[category];
  return <div className={`category-art ${tone} ${compact ? "!h-[80px]" : ""}`}><Icon size={compact ? 35 : 45} strokeWidth={1.2} /></div>;
}

export function SectionTitle({ title, subtitle, href, action = "View all" }: { title: string; subtitle?: string; href?: string; action?: string }) {
  const { t } = useLanguage();
  return <div className="section-heading"><div><h2>{t(title)}</h2>{subtitle && <p>{t(subtitle)}</p>}</div>{href && <Link href={href} className="section-link">{t(action)}<ArrowRight size={14} /></Link>}</div>;
}

export function StatCard({ label, value, foot, icon, color = "lime" }: { label: string; value: string | number; foot: string; icon: ReactNode; color?: "lime" | "violet" | "cyan" | "orange" }) {
  const { t } = useLanguage();
  const styles: React.CSSProperties & Record<"--stat-color" | "--stat-bg" | "--stat-glow", string> = {
    lime: { "--stat-color": "#c5f47b", "--stat-bg": "rgba(197,244,123,.1)", "--stat-glow": "rgba(197,244,123,.13)" },
    violet: { "--stat-color": "#b8a5ff", "--stat-bg": "rgba(184,165,255,.1)", "--stat-glow": "rgba(184,165,255,.13)" },
    cyan: { "--stat-color": "#78d9e6", "--stat-bg": "rgba(120,217,230,.1)", "--stat-glow": "rgba(120,217,230,.13)" },
    orange: { "--stat-color": "#f2bc8b", "--stat-bg": "rgba(242,188,139,.1)", "--stat-glow": "rgba(242,188,139,.13)" },
  }[color];
  return <div className="stat-card" style={styles}><div><span className="stat-label">{t(label)}</span><strong className="stat-value">{value}</strong><span className="stat-foot">{t(foot)}</span></div><span className="stat-icon">{icon}</span></div>;
}

export function ChallengeCard({ challenge, solved = false, compact = false }: { challenge: PublicChallenge; solved?: boolean; compact?: boolean }) {
  const { lang, t } = useLanguage();
  const copy = challengeCopy(challenge, lang);
  return <Link href={`/challenges/${challenge.id}`} className="panel panel-hover challenge-card group min-w-0">
    <div className="relative"><CategoryVisual category={challenge.category} tone={challenge.tone} compact={compact} />
      {solved && <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-md border border-[#b4ea90]/30 bg-[#1c3329]/90 px-2 py-1 text-[9px] font-bold text-[#cef8a6]"><Check size={11} /> {t("SOLVED")}</span>}
    </div>
    <div className="challenge-card-body">
      <div className="flex items-center justify-between gap-2"><span className="truncate text-[10px] font-bold tracking-[.08em] text-[#a5b4bc] uppercase">{t(challenge.category)}</span><DifficultyBadge difficulty={challenge.difficulty} /></div>
      <h3>{copy.title}</h3>
      <p className="min-h-[34px]">{copy.summary}</p>
      <div className="challenge-card-footer"><span className="inline-flex items-center gap-1.5"><Users size={12} />{challenge.solves.toLocaleString()} {t("solves")}</span><span className="challenge-points"><Flag size={12} />{challenge.points} XP</span></div>
    </div>
  </Link>;
}

export function SourceChallengeCard({ challenge, solved = false, locked = false }: { challenge: SourceChallenge; solved?: boolean; locked?: boolean }) {
  const { b, t } = useLanguage();
  return <Link href={challenge.href} className="panel panel-hover challenge-card group min-w-0">
    <div className="relative"><CategoryVisual category={challenge.category} tone={challenge.tone} compact />
      <span className="absolute left-3 top-3 rounded-md border border-white/15 bg-[#111a20]/85 px-2 py-1 text-[9px] font-bold tracking-wide text-[#dcf0dc]">{t("Source challenge")}</span>
      {(solved || locked) && <span className={`absolute right-3 top-3 inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[9px] font-bold ${solved ? "border-[#b4ea90]/30 bg-[#1c3329]/90 text-[#cef8a6]" : "border-[#586371] bg-[#202b38]/90 text-[#b3c1cf]"}`}>{solved ? <Check size={11} /> : <LockKeyhole size={11} />}{t(solved ? "Completed" : "Locked")}</span>}
    </div>
    <div className="challenge-card-body"><div className="flex items-center justify-between gap-2"><span className="truncate text-[10px] font-bold tracking-[.08em] text-[#a5b4bc] uppercase">{t(challenge.category)}</span><DifficultyBadge difficulty={challenge.difficulty} /></div>
      <h3>{b(challenge.title)}</h3><p className="min-h-[34px] line-clamp-2">{b(challenge.brief)}</p><div className="mt-3 truncate text-[10px] text-[#b1c0c1]">{b(challenge.campaignTitle)} · {b(challenge.moduleTitle)}</div>
      <div className="challenge-card-footer"><span className="inline-flex items-center gap-1.5"><TerminalSquare size={12} />{t("Open lab")}</span><span className="challenge-points"><Flag size={12} />20 XP</span></div>
    </div>
  </Link>;
}

export function ProgressBar({ percent, tone = "lime" }: { percent: number; tone?: "lime" | "violet" | "cyan" }) {
  return <div className={`progress-track ${tone}`} role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}><span style={{ width: `${Math.max(0, Math.min(100, percent))}%` }} /></div>;
}

export function timeAgo(date: Date | string) {
  const ms = Math.max(0, Date.now() - new Date(date).getTime());
  const minutes = Math.floor(ms / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function InfoChip({ children, icon }: { children: ReactNode; icon?: ReactNode }) {
  return <span className="inline-flex items-center gap-1.5 rounded-md border border-[#35404b] bg-[#202832] px-2.5 py-1.5 text-[10px] font-semibold text-[#aab8c3]">{icon}{children}</span>;
}

export function EmptyState({ title, description, icon = <BookOpen size={24} /> }: { title: string; description: string; icon?: ReactNode }) {
  const { t } = useLanguage();
  return <div className="empty-state"><span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-[#26322b] text-lime">{icon}</span><h3>{t(title)}</h3><p className="mx-auto max-w-sm text-xs leading-relaxed">{t(description)}</p></div>;
}

export function TinyMeta({ time }: { time: string }) {
  return <span className="inline-flex items-center gap-1.5 text-[#8999a3] text-[10px]"><Clock3 size={12} />{time}</span>;
}

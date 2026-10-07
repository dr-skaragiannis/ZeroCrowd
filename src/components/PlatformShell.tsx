"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Activity, ArrowRight, Bell, BookOpen, ChevronDown, ChevronRight, CircleHelp, Command, Flag, LayoutDashboard, LogOut, Map, Menu, Search, Settings2, ShieldCheck, Trophy, UserRound, UsersRound, Zap } from "lucide-react";
import { ACCOUNT_SIGN_IN_ENABLED } from "@/lib/features";
import { useProgress, useProgressActions } from "@/components/ProgressProvider";
import { LanguageToggle, useLanguage } from "@/components/LanguageProvider";

type SearchItem = { title: string; subtitle: string; href: string; type: string; titleEl?: string; subtitleEl?: string };
const nav = [
  { label: "COMMAND CENTER", items: [
    { title: "Dashboard", href: "/", icon: LayoutDashboard },
    { title: "Challenges", href: "/challenges", icon: Flag },
    { title: "Learning Paths", href: "/academy", icon: Map },
    { title: "Leaderboard", href: "/leaderboard", icon: Trophy },
  ] },
  { label: "COMMUNITY", items: [
    { title: "Team Hub", href: "/team", icon: UsersRound },
    { title: "Activity Feed", href: "/activity", icon: Activity },
  ] },
  { label: "YOUR ACCOUNT", items: [
    { title: "My Profile", href: "/profile", icon: UserRound },
    { title: "Settings", href: "/settings", icon: Settings2 },
    { title: "Help & Support", href: "/help", icon: CircleHelp },
  ] },
];

export default function PlatformShell({ children, searchItems, challengeCount }: { children: ReactNode; searchItems: SearchItem[]; challengeCount: number }) {
  const pathname = usePathname();
  const router = useRouter();
  const { lang, t } = useLanguage();
  const progress = useProgress();
  const { refresh } = useProgressActions();
  const player = { ...progress.player, xp: progress.xp, level: progress.level };
  const notices = progress.activities.slice(0, 3).map(activity => ({
    title: activity.title,
    description: activity.description,
    time: new Date(activity.createdAt).toLocaleDateString(lang === "el" ? "el-GR" : "en-US", { month: "short", day: "numeric" }),
  }));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const [popover, setPopover] = useState<"notifications" | "user" | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") || (event.key === "/" && !["INPUT", "TEXTAREA"].includes(target.tagName))) {
        event.preventDefault(); setSearchOpen(true); setPopover(null);
      }
      if (event.key === "Escape") { setSearchOpen(false); setPopover(null); setMobileOpen(false); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  useEffect(() => { if (searchOpen) searchRef.current?.focus(); }, [searchOpen]);

  const matches = searchItems.filter(item => `${item.title} ${item.titleEl ?? ""} ${item.subtitle} ${item.subtitleEl ?? ""} ${item.type}`.toLocaleLowerCase().includes(query.toLocaleLowerCase())).slice(0, 9);
  const section = nav.flatMap(group => group.items).find(item => item.href !== "/" && pathname.startsWith(item.href))?.title || "Dashboard";
  const navigate = (href: string) => { setSearchOpen(false); setMobileOpen(false); router.push(href); };
  const signOut = async () => {
    await fetch("/api/auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "logout" }) });
    await fetch("/api/session", { method: "POST" });
    await refresh();
    setPopover(null);
    router.push("/");
  };

  return <div className="app-shell">
    <div className={`sidebar-overlay ${mobileOpen ? "open" : ""}`} onClick={() => setMobileOpen(false)} />
    <aside className={`sidebar ${mobileOpen ? "open" : ""}`} aria-label={lang === "el" ? "Κύρια πλοήγηση" : "Main navigation"}>
      <div className="sidebar-top"><Link href="/" className="brand" onClick={() => setMobileOpen(false)}><span className="brand-mark"><Zap size={22} strokeWidth={2.9} fill="currentColor" /></span><span><span className="brand-name">GAME<span>HACK</span></span><span className="brand-sub">{t("CYBER RANGE PLATFORM")}</span></span></Link></div>
      <nav className="sidebar-nav">{nav.map(group => <div className="nav-group" key={group.label}><p className="nav-label">{t(group.label)}</p>{group.items.map(item => { const Icon = item.icon; const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href); return <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className={`nav-item ${active ? "active" : ""}`} aria-current={active ? "page" : undefined}><Icon size={17} strokeWidth={active ? 2.2 : 1.8} /><span>{t(item.title)}</span>{item.href === "/challenges" && <span className="nav-count">{challengeCount}</span>}</Link>; })}</div>)}</nav>
      <div className="sidebar-bottom"><div className="sidebar-promo"><strong>{t("Level up your skills.")}</strong><p>{t("Real challenges. Real progress. A safe place to become exceptional.")}</p><Link href="/academy">{t("Explore the academy")} <ArrowRight size={12} /></Link></div><div className="sidebar-status"><span className="status-dot" />{t("ALL SYSTEMS OPERATIONAL")}</div></div>
    </aside>

    <div className="main-shell"><header className="topbar"><button className="icon-button mobile-menu" onClick={() => setMobileOpen(true)} aria-label={lang === "el" ? "Άνοιγμα μενού" : "Open menu"}><Menu size={20} /></button><div className="breadcrumb"><span>{t("Workspace")}</span><ChevronRight size={13} /><strong>{t(section)}</strong></div><div className="topbar-actions"><button className="search-trigger" onClick={() => setSearchOpen(true)} aria-label={lang === "el" ? "Αναζήτηση στην πλατφόρμα" : "Search platform"}><span className="inline-flex items-center gap-2"><Search size={14} /> {t("Search anything...")}</span><span className="search-key">⌘ K</span></button><div className="topbar-divider" /><LanguageToggle /><div className="relative"><button className="icon-button" onClick={() => setPopover(popover === "notifications" ? null : "notifications")} aria-label={t("Notifications")} aria-expanded={popover === "notifications"}><Bell size={18} /><i className="notice-dot" /></button>{popover === "notifications" && <div className="popover"><div className="popover-title flex items-center justify-between">{t("Notifications")} <span className="text-[10px] font-normal text-[#8ea08f]">{t("Recent activity")}</span></div>{notices.length ? notices.map((notice, index) => <div className="popover-note" key={index}><strong>{notice.title}</strong><span>{notice.description} · {notice.time}</span></div>) : <p className="px-3 py-4 text-[11px] text-[#82969d]">{lang === "el" ? "Καμία νέα ειδοποίηση." : "No new notifications."}</p>}<Link href="/activity" className="popover-item justify-between" onClick={() => setPopover(null)}>{t("View all activity")} <ArrowRight size={14} /></Link></div>}</div><div className="relative"><button className="user-trigger" onClick={() => setPopover(popover === "user" ? null : "user")} aria-expanded={popover === "user"} aria-label={lang === "el" ? "Μενού λογαριασμού" : "Account menu"}><span className="avatar sm">{player.displayName.split(" ").map(part => part[0]).slice(0, 2).join("").toUpperCase()}</span><span className="user-copy"><span className="user-name">{player.displayName}</span><span className="user-role">{lang === "el" ? "Επίπεδο" : "Level"} {player.level} {lang === "el" ? "Χειριστής" : "Operator"}</span></span><ChevronDown size={13} className="text-[#81909b]" /></button>{popover === "user" && <div className="popover !w-[230px]"><div className="border-b border-[#313b46] px-3 py-3"><strong className="block text-xs">{player.displayName}</strong><span className="text-[10px] text-[#91a1a9]">@{player.handle} · {player.xp.toLocaleString()} XP</span></div><Link className="popover-item" href="/profile" onClick={() => setPopover(null)}><UserRound size={15} /> {t("My Profile")}</Link><Link className="popover-item" href="/settings" onClick={() => setPopover(null)}><Settings2 size={15} /> {t("Account settings")}</Link>{player.isGuest ? ACCOUNT_SIGN_IN_ENABLED ? <Link className="popover-item text-lime" href="/settings" onClick={() => setPopover(null)}><ShieldCheck size={15} /> {t("Save your progress")}</Link> : <span className="popover-item text-lime"><ShieldCheck size={15} /> {t("Guest access active")}</span> : <button className="popover-item" onClick={() => void signOut()}><LogOut size={15} /> {t("Sign out")}</button>}</div>}</div></div></header>
      <main className="content-wrap">{children}</main>
      <footer className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-3 px-[38px] pb-7 text-[10px] text-[#6c7c89]"><span>© {new Date().getFullYear()} GAMEHACK · {t("Train ethically. Think differently.")}</span><span className="flex items-center gap-2"><span className="status-dot !h-[5px] !w-[5px]" /> {t("Sandbox environment · No real systems exposed")}</span></footer>
    </div>

    {searchOpen && <div className="modal-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) setSearchOpen(false); }}><div className="command-modal" role="dialog" aria-modal="true" aria-label={lang === "el" ? "Αναζήτηση στην πλατφόρμα" : "Search platform"}><div className="flex items-center gap-3 px-4"><Search size={19} className="text-lime" /><input ref={searchRef} className="command-input !px-0" value={query} onChange={event => { setQuery(event.target.value); setSelected(0); }} onKeyDown={event => { if (event.key === "ArrowDown") { event.preventDefault(); setSelected(Math.min(selected + 1, matches.length - 1)); } if (event.key === "ArrowUp") { event.preventDefault(); setSelected(Math.max(selected - 1, 0)); } if (event.key === "Enter" && matches[selected]) navigate(matches[selected].href); }} placeholder={t("Search challenges, paths, or pages...")} /><button className="rounded border border-[#45505b] px-1.5 py-1 text-[10px] text-[#8fa0a9]" onClick={() => setSearchOpen(false)}>ESC</button></div><div className="max-h-[390px] overflow-y-auto pb-2"><div className="command-group">{t(query ? "Search results" : "Quick access")}</div>{matches.length ? matches.map((item, index) => <button key={`${item.type}-${item.href}`} className={`command-result ${index === selected ? "selected" : ""}`} onClick={() => navigate(item.href)}><span className="grid h-8 w-8 place-items-center rounded-md bg-[#314033] text-lime">{item.type === "Challenge" || item.type === "Lab challenge" ? <Flag size={16} /> : item.type === "Learning path" ? <BookOpen size={16} /> : <Command size={16} />}</span><span className="flex-1"><strong className="block font-semibold">{lang === "el" ? item.titleEl ?? t(item.title) : item.title}</strong><span className="text-[10px] text-[#81919c]">{lang === "el" ? item.subtitleEl ?? t(item.subtitle) : item.subtitle}</span></span><span className="text-[9px] text-[#83938f]">{t(item.type === "Lab challenge" ? "Lab objective" : item.type)}</span></button>) : <p className="px-5 py-8 text-center text-xs text-[#8697a2]">{t("No results found. Try another search.")}</p>}</div><div className="flex items-center gap-4 border-t border-[#34404a] px-4 py-3 text-[10px] text-[#7d8d99]"><span>↑ ↓ {t("to navigate")}</span><span>↵ {t("to open")}</span><span>esc {t("to close")}</span></div></div></div>}
  </div>;
}

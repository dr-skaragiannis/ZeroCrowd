"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Bi } from "@/data/lessons";
import { bi, LANGUAGE_COOKIE, translate, type Lang } from "@/lib/language";

type LanguageContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (text: string) => string;
  b: (text: Bi | string | undefined) => string;
};
const LanguageContext = createContext<LanguageContextValue>({ lang: "en", setLang: () => {}, t: text => text, b: text => bi(text, "en") });

export function LanguageProvider({ initial, children }: { initial: Lang; children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(initial);
  useEffect(() => {
    document.documentElement.lang = lang;
    document.cookie = `${LANGUAGE_COOKIE}=${lang}; Path=/; Max-Age=31536000; SameSite=Lax`;
  }, [lang]);
  const value = useMemo<LanguageContextValue>(() => ({ lang, setLang, t: text => translate(text, lang), b: text => bi(text, lang) }), [lang]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() { return useContext(LanguageContext); }
export function T({ children, en, el }: { children?: string; en?: string; el?: string }) {
  const { lang, t } = useLanguage();
  const text = en ?? children ?? "";
  return <>{lang === "el" && el ? el : t(text)}</>;
}
export function BiText({ text }: { text: Bi | string | undefined }) {
  const { b } = useLanguage();
  return <>{b(text)}</>;
}
export function LanguageToggle({ compact = false }: { compact?: boolean }) {
  const { lang, setLang } = useLanguage();
  return <div className={`inline-flex items-center gap-0.5 rounded-lg border border-[#3a4b43] bg-[#17231e] p-0.5 ${compact ? "" : "shrink-0"}`} role="group" aria-label="Language / Γλώσσα">
    {(["en", "el"] as const).map(option => <button key={option} type="button" onClick={() => setLang(option)} aria-label={option === "en" ? "Switch to English" : "Αλλαγή στα Ελληνικά"} aria-pressed={lang === option} className={`rounded-md px-2 py-1.5 text-[10px] font-extrabold tracking-wide transition-colors ${lang === option ? "bg-[#c5f47b] text-[#172319]" : "text-[#9cafaa] hover:text-white"}`}>{option === "en" ? "EN" : "ΕΛ"}</button>)}
  </div>;
}

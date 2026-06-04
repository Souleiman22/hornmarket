"use client";
import { createContext, useContext, useState } from "react";
import { translations, Lang, TKey } from "@/lib/i18n";

type T = Record<TKey, string>;
type LangContext = { lang: Lang; setLang: (l: Lang) => void; t: T };
const Ctx = createContext<LangContext>({ lang: "fr", setLang: () => {}, t: translations.fr });

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("lang", l);
  };

  return <Ctx.Provider value={{ lang, setLang, t: translations[lang] }}>{children}</Ctx.Provider>;
}

export const useLang = () => useContext(Ctx);

import { useEffect, useState } from "react";

export type Language = "en" | "fr" | "ar";
const STORAGE_KEY = "sc_lang";

export function useLanguage() {
  const [lang, setLang] = useState<Language>(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Language | null;
    return stored ?? "en";
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang);
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    }
  }, [lang]);

  return { lang, setLang } as const;
}

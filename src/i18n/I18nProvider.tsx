import React, { createContext, useContext, useMemo } from "react";
import en from "./locales/en.json";
import fr from "./locales/fr.json";
import ar from "./locales/ar.json";
import { useLanguage } from "@/hooks/useLanguage";

// Types
type Locale = typeof en;

type I18nContextType = {
  lang: "en" | "fr" | "ar";
  t: (key: string) => string;
  setLang: (l: "en" | "fr" | "ar") => void;
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const resources: Record<"en" | "fr" | "ar", Locale> = { en, fr, ar } as const;

function getByPath(obj: any, path: string): string | undefined {
  return path.split(".").reduce<any>((acc, part) => (acc && acc[part] != null ? acc[part] : undefined), obj);
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const { lang, setLang } = useLanguage();

  const value = useMemo<I18nContextType>(() => {
    const dict = resources[lang] || resources.en;
    const t = (key: string) => {
      const val = getByPath(dict, key);
      if (typeof val === "string") return val;
      // Fallback: return key's last segment made human-friendly
      const last = key.split(".").pop() || key;
      return last.replace(/[-_]/g, " ");
    };
    return { lang, t, setLang };
  }, [lang, setLang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

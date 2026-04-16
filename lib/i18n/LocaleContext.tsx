"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import en from "./en.json";
import mr from "./mr.json";

type Locale = "en" | "mr";
type Translations = typeof en;

const translations: Record<Locale, Translations> = { en, mr };

interface LocaleContextType {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
  tGrade: (grade: string) => string;
  tSection: (section: string) => string;
  tSubject: (subject: string) => string;
  tDay: (day: string) => string;
  tGender: (gender: string) => string;
  tStatus: (key: string, status: string) => string;
  isMarathi: boolean;
}

const LocaleContext = createContext<LocaleContextType>({
  locale: "en",
  setLocale: () => {},
  t: (k) => k,
  tGrade: (g) => `Class ${g}`,
  tSection: (s) => s,
  tSubject: (s) => s,
  tDay: (d) => d,
  tGender: (g) => g,
  tStatus: (_, s) => s,
  isMarathi: false,
});

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const saved = localStorage.getItem("digischool_locale") as Locale | null;
    if (saved && translations[saved]) {
      setLocaleState(saved);
      document.documentElement.setAttribute("data-locale", saved);
    }
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("digischool_locale", l);
    document.documentElement.setAttribute("data-locale", l);
  }, []);

  const t = useCallback(
    (key: string): string => {
      const parts = key.split(".");
      let result: unknown = translations[locale];
      for (const p of parts) {
        if (result && typeof result === "object" && p in result) {
          result = (result as Record<string, unknown>)[p];
        } else {
          return key;
        }
      }
      return typeof result === "string" ? result : key;
    },
    [locale]
  );

  const tGrade = useCallback(
    (grade: string): string => {
      const key = `grades.${grade}`;
      const val = t(key);
      return val !== key ? val : `Class ${grade}`;
    },
    [t]
  );

  const tSection = useCallback(
    (section: string): string => {
      const key = `sections.${section}`;
      const val = t(key);
      return val !== key ? val : section;
    },
    [t]
  );

  const tSubject = useCallback(
    (subject: string): string => {
      const normalized = subject.replace(/\s+/g, "");
      const key = `subjects.${normalized}`;
      const val = t(key);
      if (val !== key) return val;
      const directKey = `subjects.${subject}`;
      const directVal = t(directKey);
      return directVal !== directKey ? directVal : subject;
    },
    [t]
  );

  const tDay = useCallback(
    (day: string): string => {
      const key = `days.${day}`;
      const val = t(key);
      return val !== key ? val : day;
    },
    [t]
  );

  const tGender = useCallback(
    (gender: string): string => {
      const key = `gender.${gender}`;
      const val = t(key);
      return val !== key ? val : gender;
    },
    [t]
  );

  const tStatus = useCallback(
    (category: string, status: string): string => {
      const key = `${category}.${status}`;
      const val = t(key);
      return val !== key ? val : status;
    },
    [t]
  );

  return (
    <LocaleContext.Provider
      value={{
        locale,
        setLocale,
        t,
        tGrade,
        tSection,
        tSubject,
        tDay,
        tGender,
        tStatus,
        isMarathi: locale === "mr",
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}

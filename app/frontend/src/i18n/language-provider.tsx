"use client";

import { createContext, useContext, useEffect, useSyncExternalStore, type ReactNode } from "react";
import { messages, type Locale, type Messages } from "@/i18n/messages";

type LanguageContextValue = { locale: Locale; setLocale: (locale: Locale) => void; t: Messages };
const LanguageContext = createContext<LanguageContextValue | null>(null);
const listeners = new Set<() => void>();
let inMemoryLocale: Locale = "en";

function readLocale(): Locale {
  try {
    const saved = window.localStorage.getItem("aerohealth-locale");
    inMemoryLocale = saved === "fr" ? "fr" : "en";
    return inMemoryLocale;
  } catch {
    return inMemoryLocale;
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const syncFromAnotherTab = () => listeners.forEach((notify) => notify());
  window.addEventListener("storage", syncFromAnotherTab);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", syncFromAnotherTab);
  };
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore<Locale>(subscribe, readLocale, () => "en");

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  function setLocale(next: Locale) {
    inMemoryLocale = next;
    try { window.localStorage.setItem("aerohealth-locale", next); } catch { /* The current view still changes if storage is unavailable. */ }
    listeners.forEach((notify) => notify());
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t: messages[locale] }}>
      <div lang={locale}>{children}</div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider");
  return context;
}

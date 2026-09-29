"use client";

import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "@/i18n/language-provider";
import type { Locale } from "@/i18n/messages";

const links = [
  { href: "#machine", key: "platform" as const },
  { href: "#research", key: "research" as const },
  { href: "#model", key: "methodology" as const },
  { href: "#researchers", key: "researchers" as const },
  { href: "#explore", key: "explore" as const },
];

export function SiteHeader() {
  const { locale, setLocale, t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <Link className="brand" href="#top" aria-label="Aerohealth home">
        <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
        <span>AEROHEALTH</span>
      </Link>
      <nav className={`main-nav ${menuOpen ? "is-open" : ""}`} aria-label="Main navigation">
        {links.map((link) => <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>{t.nav[link.key]}</Link>)}
      </nav>
      <div className="header-controls">
        <div className="language-switch" role="group" aria-label="Language / Langue">
          {(["en", "fr"] as Locale[]).map((language, index) => (
            <span className="language-option" key={language}>
              {index > 0 && <span className="language-divider" aria-hidden="true">/</span>}
              <button type="button" aria-pressed={locale === language} onClick={() => setLocale(language)}>{language.toUpperCase()}</button>
            </span>
          ))}
        </div>
        <button className="menu-toggle" type="button" aria-label={menuOpen ? t.nav.close : t.nav.open} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
          <span /><span />
        </button>
      </div>
    </header>
  );
}

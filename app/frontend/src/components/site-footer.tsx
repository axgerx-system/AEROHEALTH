"use client";

import Link from "next/link";
import { useLanguage } from "@/i18n/language-provider";

export function SiteFooter() {
  const { t } = useLanguage();
  return <footer className="site-footer"><Link className="brand" href="#top"><span className="brand-mark" aria-hidden="true"><i /><i /><i /></span><span>AEROHEALTH</span></Link><p>{t.footer.line}</p><span className="mono footer-note">{t.footer.note}</span><Link className="back-top mono" href="#top">{t.footer.top} ↑</Link></footer>;
}

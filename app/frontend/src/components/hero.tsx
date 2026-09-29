"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/i18n/language-provider";

export function Hero() {
  const { t } = useLanguage();

  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero-visual" aria-hidden="true">
        <Image className="hero-engine-image" src="/images/aerohealth-turbofan.png" alt="" fill priority sizes="(max-width: 760px) 100vw, 74vw" />
        <div className="hero-image-wash" />
        <div className="hero-grid" />
      </div>
      <div className="hero-copy">
        <p className="eyebrow"><span className="signal-light" />{t.hero.eyebrow}</p>
        <h1 id="hero-title">{t.hero.title}<br /><em>{t.hero.titleAccent}</em></h1>
        <p className="hero-description">{t.hero.description}</p>
        <Link className="text-link" href="#machine"><span>{t.hero.action}</span><span aria-hidden="true">↘</span></Link>
      </div>
      <div className="annotation annotation-fan" aria-label={`${t.hero.engineLabel}. ${t.hero.annotationBody}`}>
        <span className="annotation-point" /><span className="annotation-rule" />
        <span className="annotation-copy"><b className="mono">{t.hero.annotation}</b><small>{t.hero.annotationBody}</small></span>
      </div>
      <div className="hero-index mono">01 <span>/</span> 07</div>
      <div className="hero-caption mono"><span>{t.hero.engineLabel}</span><span>{t.hero.engineSub}</span></div>
      <div className="hero-status mono"><span className="status-pip" />{t.hero.status}</div>
    </section>
  );
}

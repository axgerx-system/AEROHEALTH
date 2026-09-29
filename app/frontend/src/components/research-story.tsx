"use client";

import Link from "next/link";
import Image from "next/image";
import { Fragment } from "react";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import { useLanguage } from "@/i18n/language-provider";
import { Reveal } from "@/components/reveal";
import { researchers } from "@/i18n/researchers";
import { useEffect, useState } from "react";
import { useAerohealthData } from "@/lib/use-aerohealth-data";
import type { Engine, Methodology, Prediction, ResearchSummary, Resource, Trajectory } from "@/lib/api";

function SectionLabel({ number, label }: { number: string; label: string }) {
  return <div className="section-label"><span className="mono cyan">{number}</span><span className="section-rule" /><span className="mono">{label}</span></div>;
}

function shortProfileUrl(url: string) {
  const parsed = new URL(url);
  return `${parsed.hostname.replace(/^www\./, "")}${parsed.pathname.replace(/\/$/, "")}`;
}

const storySectionIds = ["machine", "signal", "model", "prediction", "research", "researchers", "explore"] as const;

function StoryNavigation() {
  const { t } = useLanguage();
  const [activeStep, setActiveStep] = useState("machine");
  const items = [["#machine", t.flow.machine], ["#signal", t.flow.signal], ["#model", t.flow.model], ["#prediction", t.flow.prediction], ["#research", t.flow.research], ["#researchers", t.flow.researchers], ["#explore", t.flow.explore]];
  useEffect(() => {
    const targets = storySectionIds.map((id) => document.getElementById(id)).filter((target): target is HTMLElement => Boolean(target));
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActiveStep(visible.target.id);
    }, { rootMargin: "-22% 0px -58% 0px", threshold: [0, .2, .5, .8] });
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);
  const activeIndex = storySectionIds.indexOf(activeStep as (typeof storySectionIds)[number]);
  return <nav className="story-path" aria-label="Research story">
    {items.map(([href, label], index) => <span className="story-path-item" key={href}><Link href={href} aria-current={activeStep === href.slice(1) ? "location" : undefined}><small className="mono">0{index + 1}</small>{label}</Link>{index < items.length - 1 && <i aria-hidden="true" />}</span>)}
    <span className="story-progress" role="progressbar" aria-label={t.flow.progress} aria-valuemin={1} aria-valuemax={storySectionIds.length} aria-valuenow={activeIndex + 1}><i style={{ width: `${((activeIndex + 1) / storySectionIds.length) * 100}%` }} /></span>
  </nav>;
}

function ApiFeedback<T>({ resource, retry }: { resource: Resource<T>; retry: () => void }) {
  const { t } = useLanguage();
  if (resource.status === "loading") return <p className="api-feedback mono" role="status">{t.data.loading}</p>;
  if (resource.status === "error") return <div className="api-feedback api-error" role="alert"><span>{t.data.error}</span><button type="button" onClick={retry}>{t.data.retry}</button></div>;
  if (resource.status === "empty") return <p className="api-feedback" role="status">{t.data.empty}</p>;
  return null;
}

function formatValue(value: number, locale: "en" | "fr", digits = 2) {
  return new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value);
}

function trajectoryPath(points: { cycle: number; value: number }[]) {
  if (!points.length) return "";
  const values = points.map((point) => point.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  return points.map((point, index) => {
    const x = points.length === 1 ? 450 : ((point.cycle - points[0].cycle) / (points[points.length - 1].cycle - points[0].cycle || 1)) * 900;
    const y = 205 - ((point.value - min) / span) * 175;
    return `${index ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ");
}

function trajectoryLatestY(points: { cycle: number; value: number }[]) {
  if (!points.length) return 30;
  const values = points.map((point) => point.value);
  const min = Math.min(...values);
  const span = Math.max(...values) - min || 1;
  return 205 - ((points[points.length - 1].value - min) / span) * 175;
}

function moveHardwareImage(event: ReactPointerEvent<HTMLElement>) {
  if (event.pointerType !== "mouse") return;
  const bounds = event.currentTarget.getBoundingClientRect();
  const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 4;
  const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 4;
  event.currentTarget.style.setProperty("--pointer-x", `${x}px`);
  event.currentTarget.style.setProperty("--pointer-y", `${y}px`);
}

function resetHardwareImage(event: ReactPointerEvent<HTMLElement>) {
  event.currentTarget.style.setProperty("--pointer-x", "0px");
  event.currentTarget.style.setProperty("--pointer-y", "0px");
}

function MachineSection({ sensor, onSensorChange, availableSensors, health }: { sensor: string; onSensorChange: (channel: string) => void; availableSensors: string[]; health: Resource<{ status: string; model_loaded: boolean }> & { retry: () => void } }) {
  const { t } = useLanguage();
  const facts = [[t.machine.factA, t.machine.valueA], [t.machine.factB, t.machine.valueB], [t.machine.factC, t.machine.valueC], [t.machine.factD, t.machine.valueD]];
  const selectedIndex = Math.max(0, availableSensors.indexOf(sensor));
  const schematicSensors = availableSensors.length > 3 ? [0, 1, 2].map((offset) => availableSensors[(selectedIndex + offset) % availableSensors.length]) : availableSensors;
  return <section className="content-section machine-section" id="machine">
    <SectionLabel number={t.machine.number} label={t.machine.label} />
    <div className="section-intro">
      <Reveal><div><p className="eyebrow">{t.machine.kicker}</p><h2>{t.machine.title}</h2></div></Reveal>
      <Reveal delay={100}><p className="body-copy">{t.machine.body}</p></Reveal>
    </div>
    <div className="fact-strip">{facts.map(([label, value], index) => <Reveal key={label} delay={index * 70}><div className="fact-cell"><span className="mono">{label}</span><b>{value}</b></div></Reveal>)}</div>
    <Reveal className="engine-detail-reveal"><div className="engine-detail">
      <div className="engine-detail-visuals">
        <figure className="engine-detail-image" onPointerMove={moveHardwareImage} onPointerLeave={resetHardwareImage}>
          <Image src="/images/compressor-detail.png" alt={t.machine.detailAlt} fill sizes="(max-width: 760px) 50vw, 30vw" />
          <div className="engine-detail-wash" />
          {schematicSensors.map((channel, index) => <button key={channel} type="button" className={`engine-hotspot hotspot-${index + 1} ${sensor === channel ? "is-selected" : ""}`} aria-label={`${t.machine.sensor} ${channel.replace("sensor_", "")}, ${t.machine.schematic}`} aria-pressed={sensor === channel} onClick={() => onSensorChange(channel)}><span>{channel.replace("sensor_", "")}</span></button>)}
          <figcaption className="engine-image-tag mono">{t.machine.compressorCaption}</figcaption>
        </figure>
        <figure className="engine-detail-image" onPointerMove={moveHardwareImage} onPointerLeave={resetHardwareImage}>
          <Image src="/images/turbine-detail.png" alt={t.machine.turbineAlt} fill sizes="(max-width: 760px) 50vw, 30vw" />
          <div className="engine-detail-wash" />
          <figcaption className="engine-image-tag mono">{t.machine.turbineCaption}</figcaption>
        </figure>
      </div>
      <div className="engine-detail-copy"><p className="eyebrow">{t.machine.detailKicker}</p><h3>{t.machine.detailTitle}</h3><p className="body-copy">{t.machine.detailBody}</p>
        <div className="channel-state"><span className="mono">{t.machine.selectedChannel}</span><b className="mono">{sensor.toUpperCase()}</b><small>{t.machine.schematic}</small></div>
        <div className={`api-health health-${health.data?.status || health.status}`} role="status"><i />{health.status === "success" ? (health.data?.model_loaded ? t.data.apiReady : t.data.apiPartial) : health.status === "error" ? t.data.apiUnavailable : t.data.loading}</div><ApiFeedback resource={health} retry={health.retry} />
        <div className="component-flow mono"><span>{t.machine.flowEngine}</span><i>→</i><span>{t.machine.flowSignal}</span><i>→</i><span>{t.machine.flowFeatures}</span></div>
      </div>
    </div></Reveal>
  </section>;
}

function SignalSection({ sensor, onSensorChange, availableSensors, trajectory }: { sensor: string; onSensorChange: (channel: string) => void; availableSensors: string[]; trajectory: Resource<Trajectory> & { retry: () => void } }) {
  const { t, locale } = useLanguage();
  return <section className="signal-section" id="signal">
    <SectionLabel number={t.signal.number} label={t.signal.label} />
    <div className="signal-layout">
      <Reveal><div><p className="eyebrow">{t.signal.kicker}</p><h2>{t.signal.title}</h2><p className="body-copy">{t.signal.body}</p></div></Reveal>
      <Reveal delay={120}><div className="signal-figure">
        <div className="figure-heading mono"><span>{t.signal.traceLabel}</span><span>{trajectory.data ? `${trajectory.data.dataset} · ${trajectory.data.points.length} ${t.data.samples}` : t.signal.traceNote}</span></div>
        <div className="sensor-controls" role="group" aria-label={t.signal.selectSensor}>{availableSensors.map((name) => <button type="button" key={name} aria-pressed={sensor === name} onClick={() => onSensorChange(name)}>{name.toUpperCase()}</button>)}</div>
        <ApiFeedback resource={trajectory} retry={trajectory.retry} />
        {trajectory.data && <>
          <svg className="sensor-chart" viewBox="0 0 900 230" role="img" aria-label={`${sensor.toUpperCase()} ${t.signal.traceLabel}`} preserveAspectRatio="none">
            <defs><linearGradient id="trace-area" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#36d9ff" stopOpacity=".15" /><stop offset="1" stopColor="#36d9ff" stopOpacity="0" /></linearGradient></defs>
            <path className="trace-fill" d={`${trajectoryPath(trajectory.data.points)} L900 230 L0 230Z`} />
            <path className="trace-line" d={trajectoryPath(trajectory.data.points)} />
            <path className="trace-grid" d="M0 65H900 M0 115H900 M0 165H900" />
            {trajectory.data.points.length > 0 && <circle className="trace-point" cx="900" cy={trajectoryLatestY(trajectory.data.points)} r="4" />}
          </svg>
          <div className="chart-annotation"><span className="annotation-point" /><span className="annotation-rule" /><span><b className="mono">{sensor.toUpperCase()} · {t.signal.callout}</b><small>{t.data.latestReading} {formatValue(trajectory.data.points.at(-1)?.value ?? 0, locale, 4)} · {t.data.engineCycle} {trajectory.data.current_cycle} · {trajectory.data.points.length} {t.data.samples}</small></span></div>
          <div className="chart-axis mono"><span>{t.data.cycle} {trajectory.data.points[0]?.cycle}</span><span>{t.data.cycle} {trajectory.data.points.at(-1)?.cycle} →</span></div>
        </>}
        <div className="signal-feature-map" aria-live="polite"><span className="mono">{t.signal.featureMap}</span><div>{[sensor, `${sensor}_rollmean_5`, `${sensor}_rollstd_5`, `${sensor}_diff_1`, `${sensor}_trend_10`].map((feature) => <code key={feature}>{feature}</code>)}</div><b className="mono">{t.signal.modelInput} → LIGHTGBM</b></div>
      </div></Reveal>
    </div>
  </section>;
}

function ModelSection({ methodology }: { methodology: Resource<Methodology> & { retry: () => void } }) {
  const { t } = useLanguage();
  const { locale } = useLanguage();
  const method = methodology.data;
  const targetValue = method ? (locale === "fr" ? "RUL = cycle final − cycle actuel" : "RUL = final cycle − current cycle") : t.model.targetValue;
  const modelValue = method ? `${method.model.model_type} ${method.model.objective} · α ${formatValue(method.model.alpha, locale, 2)}` : t.model.modelValue;
  const splitValue = method ? (locale === "fr" ? `${method.split.train_engines} / ${method.split.validation_engines} moteurs · graine ${method.split.random_state}` : `${method.split.train_engines} / ${method.split.validation_engines} engines · seed ${method.split.random_state}`) : t.model.splitValue;
  const specs = [[t.model.targetLabel, targetValue], [t.model.modelLabel, modelValue], [t.model.splitLabel, splitValue]];
  const familyLabels = [t.model.familyA, t.model.familyB, t.model.familyC, t.model.familyD, t.model.familyE, t.model.familyF, t.model.familyG];
  const families = methodology.data?.feature_families.map((family, index) => [String(family.count).padStart(2, "0"), familyLabels[index] || family.name]) || [];
  return <section className="content-section model-section" id="model">
    <SectionLabel number={t.model.number} label={t.model.label} />
    <div className="model-layout">
      <Reveal><div><p className="eyebrow">{t.model.kicker}</p><h2>{t.model.title}</h2><p className="body-copy">{t.model.body}</p></div></Reveal>
      <Reveal delay={100}><div className="feature-instrument"><div className="feature-count"><span className="mono">{t.model.featureLabel}</span><strong>{methodology.data?.feature_count ?? "··"}</strong><small className="mono">{t.data.modelFeatures}</small></div><ApiFeedback resource={methodology} retry={methodology.retry} /><div className="feature-families">{families.map(([count, label], index) => <div className="feature-family" key={label} style={{ "--family-index": index } as CSSProperties}><b className="mono">{count}</b><span>{label}</span></div>)}</div><div className="method-specs">{methodology.data && <div className="method-spec"><span className="mono">{t.data.excludedInputs}</span><b>{methodology.data.excluded_features.join(", ")}</b></div>}{specs.map(([label, value]) => <div className="method-spec" key={label}><span className="mono">{label}</span><b>{value}</b></div>)}</div></div></Reveal>
    </div>
  </section>;
}

function PredictionSection({ engines, selectedEngine, onEngineChange, prediction, engine }: { engines: Resource<{ count: number; engines: Engine[] }> & { retry: () => void }; selectedEngine: number; onEngineChange: (id: number) => void; prediction: Resource<Prediction> & { retry: () => void }; engine: Resource<{ current_cycle: number }> & { retry: () => void } }) {
  const { t, locale } = useLanguage();
  return <section className="prediction-section" id="prediction">
    <Reveal className="prediction-visual-wrap"><div className="prediction-path" aria-label={`${t.prediction.pathInput} → ${t.prediction.pathModel} → ${t.prediction.pathOutput}`}><div className="prediction-path-heading mono">{t.data.inferencePath}</div><div className="prediction-step"><span className="path-node mono">01</span><div><b className="mono">{t.prediction.pathInput}</b><small>{t.prediction.pathInputDetail}</small></div></div><span className="path-connector" aria-hidden="true" /><div className="prediction-step"><span className="path-node mono">02</span><div><b className="mono">{t.prediction.pathModel}</b><small>{t.prediction.pathModelDetail}</small></div></div><span className="path-connector" aria-hidden="true" /><div className="prediction-step output-step"><span className="path-node mono">03</span><div><b className="mono">{t.prediction.pathOutput}</b><small>{t.prediction.pathOutputDetail}</small></div></div></div></Reveal>
    <Reveal delay={100}><div className="prediction-copy"><SectionLabel number={t.prediction.number} label={t.prediction.label} /><p className="eyebrow">{t.prediction.kicker}</p><h2>{t.prediction.title}</h2><p className="body-copy">{t.prediction.body}</p><div className="prediction-metrics"><span className="mono">{t.data.liveEstimate}</span><label className="engine-select-label mono">{t.data.selectEngine}<select value={selectedEngine} onChange={(event) => onEngineChange(Number(event.target.value))} disabled={!engines.data?.engines.length}>{engines.data?.engines.map((item) => <option key={item.engine_id} value={item.engine_id}>{t.data.engine} {String(item.engine_id).padStart(3, "0")}</option>)}</select></label><ApiFeedback resource={engines} retry={engines.retry} /><ApiFeedback resource={engine} retry={engine.retry} /><ApiFeedback resource={prediction} retry={prediction.retry} />{prediction.data && <><div className="prediction-metric live-prediction"><b>{t.prediction.pathOutput} <strong>{formatValue(prediction.data.estimated_rul, locale, 2)} {t.prediction.cycles}</strong></b><small>{t.data.engine} {String(prediction.data.engine_id).padStart(3, "0")} · {t.data.engineCycle} {prediction.data.current_cycle}</small><small>{prediction.data.model.model_type} · {prediction.data.model.objective} · α {formatValue(prediction.data.model.alpha, locale, 2)}</small></div><p className="prediction-caveat">{t.data.estimateCaveat}</p></>}<Link href="#research">{t.prediction.viewResearch}<span aria-hidden="true"> ↗</span></Link></div></div></Reveal>
  </section>;
}

function ResearchSection({ summary }: { summary: Resource<ResearchSummary> & { retry: () => void } }) {
  const { t, locale } = useLanguage();
  const metrics = summary.data ? {
    validation: [["MAE", formatValue(summary.data.validation.mae, locale, 2)], ["RMSE", formatValue(summary.data.validation.rmse, locale, 2)], ["PHM08", formatValue(summary.data.validation.phm08, locale, 2)]],
    official: [["MAE", formatValue(summary.data.official_test.mae, locale, 2)], ["RMSE", formatValue(summary.data.official_test.rmse, locale, 2)], ["PHM08", formatValue(summary.data.official_test.phm08, locale, 2)]],
  } : { validation: [], official: [] };
  return <section className="content-section research-section" id="research">
    <SectionLabel number={t.research.number} label={t.research.label} />
    <div className="section-intro research-intro"><Reveal><div><p className="eyebrow">{t.research.kicker}</p><h2>{t.research.title}</h2></div></Reveal><Reveal delay={100}><p className="body-copy">{t.research.body}</p></Reveal></div>
    <ApiFeedback resource={summary} retry={summary.retry} />
    {summary.data && <div className="evidence-grid">
      {[[t.research.validationTitle, metrics.validation], [t.research.officialTitle, metrics.official]].map(([heading, rows], groupIndex) => <Reveal key={heading as string} delay={groupIndex * 100}><div className="evidence-card"><span className="mono evidence-label">{groupIndex === 0 ? t.data.validationContext : t.data.officialContext}</span><h3>{heading as string}</h3><div className="metric-row">{(rows as string[][]).map(([label, value]) => <div className="metric-cell" key={label}><span className="mono">{label}</span><b>{value}</b></div>)}</div></div></Reveal>)}
    </div>}
    <div className="evidence-footnote"><p>{t.research.note}</p><div className="research-boundary"><span className="mono">{t.research.limitsTitle}</span><p>{t.research.limits}</p></div></div>
  </section>;
}

function ResearchersSection() {
  const { t, locale } = useLanguage();
  return <section className="content-section researchers-section" id="researchers">
    <SectionLabel number={t.researchers.number} label={t.researchers.label} />
    <div className="section-intro research-intro"><Reveal><div><p className="eyebrow">{t.researchers.kicker}</p><h2>{t.researchers.title}</h2></div></Reveal><Reveal delay={100}><p className="body-copy">{t.researchers.body}</p></Reveal></div>
    <div className="researcher-grid">{researchers.map((profile, index) => {
      return <Reveal key={profile.id}><article className="researcher-card">
      <div className="researcher-portrait"><Image src={profile.portrait} alt={profile.portraitAlt[locale]} fill sizes="(max-width: 980px) 38vw, 18vw" /><b className="mono">0{index + 1} / 02</b></div>
      <div className="researcher-info"><span className="mono evidence-label">{t.researchers.profile} 0{index + 1}</span><h3>{profile.name}</h3>
        <dl><div><dt>{t.researchers.role}</dt><dd>{profile.role[locale]}</dd></div><div><dt>{t.researchers.institution}</dt><dd>{profile.institution}</dd></div><div><dt>{t.researchers.focus}</dt><dd>{profile.focus[locale]}</dd></div><div><dt>{t.researchers.contribution}</dt><dd>{profile.contribution[locale]}</dd></div></dl>
        {profile.contactLinks.email && <div className="researcher-contacts" aria-label={t.researchers.contact}>
          <div className="researcher-contact-row"><span className="mono researcher-contact-label">{t.researchers.email}</span><span className="researcher-email-list">{profile.contactLinks.email.map((email, emailIndex) => <Fragment key={email}>{emailIndex > 0 && <span className="researcher-contact-separator" aria-hidden="true"> / </span>}<a href={`mailto:${email}`}>{email}</a></Fragment>)}</span></div>
          {profile.contactLinks.linkedin && <a className="researcher-contact-row researcher-linkedin" href={profile.contactLinks.linkedin} target="_blank" rel="noreferrer"><span className="mono researcher-contact-label">{t.researchers.linkedin}</span><span className="researcher-linkedin-url">{shortProfileUrl(profile.contactLinks.linkedin)}</span></a>}
        </div>}
      </div>
    </article></Reveal>;
    })}</div>
  </section>;
}

function ExploreSection({ methodology }: { methodology: Resource<Methodology> & { retry: () => void } }) {
  const { t } = useLanguage();
  return <section className="explore-section" id="explore">
    <div className="explore-layout"><Reveal><div><SectionLabel number={t.explore.number} label={t.explore.label} /><p className="eyebrow">{t.explore.kicker}</p><h2>{t.explore.title}</h2><p className="body-copy">{t.explore.body}</p><Link className="text-link" href="#model"><span>{t.explore.action}</span><span aria-hidden="true">↘</span></Link><ApiFeedback resource={methodology} retry={methodology.retry} />{methodology.data && <div className="explore-method"><span className="mono">{t.data.testProtocol}</span><p>{methodology.data.official_test_protocol}</p><span className="mono">{t.data.scopeLimitations}</span><p>{methodology.data.limitations.slice(0, 3).join(" · ")}</p></div>}</div></Reveal>
    </div>
  </section>;
}

export function ResearchStory() {
  const data = useAerohealthData();
  const sensors = data.engine.data?.available_sensors || data.methodology.data?.variable_sensors || [];
  const visibleSensors = sensors.length ? sensors : ["sensor_2", "sensor_3", "sensor_4"];
  return <><StoryNavigation /><MachineSection sensor={data.selectedSensor} onSensorChange={data.setSelectedSensor} availableSensors={visibleSensors} health={data.health} /><SignalSection sensor={data.selectedSensor} onSensorChange={data.setSelectedSensor} availableSensors={visibleSensors} trajectory={data.trajectory} /><ModelSection methodology={data.methodology} /><PredictionSection engines={data.engines} selectedEngine={data.selectedEngine} onEngineChange={data.setSelectedEngine} prediction={data.prediction} engine={data.engine} /><ResearchSection summary={data.summary} /><ResearchersSection /><ExploreSection methodology={data.methodology} /></>;
}

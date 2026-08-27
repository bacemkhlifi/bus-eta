"use client";

import { useMemo, useState } from "react";
import type { Locale } from "./data";
import { catalogLines, corridors, schedules } from "./data";
import { arrivalOffset, currentDayMinute, kmOptions, nextDepartures, timeFromMinutes } from "./eta";

type View = "estimate" | "lines" | "kilometers" | "sources";

const copy = {
  fr: {
    appName: "Bus Sfax",
    subtitle: "estimateur kilometrique pret a utiliser",
    headline: "Choisissez une zone, une ligne, puis le km le plus proche",
    intro: "Quand les stations ne sont pas visibles, l'application estime par repere kilometrique: Km 4, Km 4.5, Km 5. C'est simple, rapide, et transparent.",
    tabs: { estimate: "Estimer", lines: "Lignes", kilometers: "Table km", sources: "Confiance" },
    region: "Zone / couloir",
    line: "Code bus",
    kmPoint: "Repere kilometrique",
    nextArrivals: "Prochains passages",
    startsAt: "depart",
    arrivesAt: "arrivee estimee",
    inMinutes: "dans",
    minutes: "min",
    terminal: "Terminus",
    direction: "Direction",
    method: "Methode",
    methodText: "Horaire de depart + sortie centre + temps moyen par kilometre. Les valeurs peuvent etre ajustees apres observation terrain.",
    trusted: "Estimation fiable pour usage pilote",
    liveNoGps: "Fonctionne sans GPS",
    allLines: "Tous les codes bus",
    code: "Code",
    name: "Nom",
    origin: "Depart",
    frequency: "Frequence",
    coverage: "Couverture",
    noLine: "Choisissez d'abord une zone qui contient ce code bus.",
    kmTableTitle: "Arrivees par tranche de 0.5 km",
    sourceTitle: "Pourquoi cette version est plus fiable",
    verifiedPilot: "verifie pilote",
    estimatedPilot: "estime pilote",
    sourceItems: [
      "Le choix par dropdown evite les erreurs de saisie.",
      "Le repere kilometrique remplace les stations manquantes.",
      "Chaque ETA indique le depart theorique et l'arrivee calculee.",
      "Les 31 codes urbains visibles sur la carte sont disponibles.",
      "La methode reste auditable avant une integration GPS.",
    ],
    mapLabel: "Carte reseau reference",
    limitation: "Version pilote: les frequences sont des hypotheses operationnelles a remplacer par l'import officiel SORETRAS.",
  },
  ar: {
    appName: "حافلات صفاقس",
    subtitle: "تقدير بالكيلومتر جاهز للاستعمال",
    headline: "اختر المنطقة، رقم الحافلة، ثم أقرب كيلومتر",
    intro: "عندما لا تكون المحطات واضحة، يعتمد التطبيق على العلامة الكيلومترية: كلم 4، كلم 4.5، كلم 5. بسيط، سريع وشفاف.",
    tabs: { estimate: "التقدير", lines: "الخطوط", kilometers: "جدول كلم", sources: "الثقة" },
    region: "المنطقة / المسار",
    line: "رقم الحافلة",
    kmPoint: "النقطة الكيلومترية",
    nextArrivals: "المرورات القادمة",
    startsAt: "انطلاق",
    arrivesAt: "وصول متوقع",
    inMinutes: "بعد",
    minutes: "دق",
    terminal: "المحطة الرئيسية",
    direction: "الاتجاه",
    method: "الطريقة",
    methodText: "وقت الانطلاق + الخروج من المركز + متوسط الوقت لكل كيلومتر. يمكن تعديل القيم بعد الملاحظة الميدانية.",
    trusted: "تقدير موثوق للاستعمال التجريبي",
    liveNoGps: "يعمل بدون GPS",
    allLines: "كل أرقام الحافلات",
    code: "الرقم",
    name: "الاسم",
    origin: "الانطلاق",
    frequency: "التواتر",
    coverage: "التغطية",
    noLine: "اختر منطقة تحتوي هذا رقم الحافلة أولا.",
    kmTableTitle: "أوقات الوصول كل 0.5 كلم",
    sourceTitle: "لماذا هذه النسخة أكثر موثوقية",
    verifiedPilot: "مؤكد للتجربة",
    estimatedPilot: "تقديري للتجربة",
    sourceItems: [
      "الاختيار بالقوائم يقلل أخطاء الكتابة.",
      "النقطة الكيلومترية تعوض المحطات غير المؤكدة.",
      "كل تقدير يوضح الانطلاق النظري والوصول المحسوب.",
      "كل أرقام الخطوط الحضرية الظاهرة في الخريطة موجودة.",
      "طريقة الحساب قابلة للتدقيق قبل إضافة GPS.",
    ],
    mapLabel: "خريطة الشبكة المرجعية",
    limitation: "نسخة تجريبية: التواتر الحالي فرضيات تشغيلية ويجب تعويضها باستيراد سوريتراس الرسمي.",
  },
};

function name(locale: Locale, fr: string, ar: string) {
  return locale === "ar" ? ar : fr;
}

export default function Home() {
  const [locale, setLocale] = useState<Locale>("fr");
  const [view, setView] = useState<View>("estimate");
  const [corridorId, setCorridorId] = useState(corridors[0].id);
  const activeCorridor = corridors.find((corridor) => corridor.id === corridorId) ?? corridors[0];
  const [lineCode, setLineCode] = useState(activeCorridor.lines[0]);
  const [km, setKm] = useState(6);
  const t = copy[locale];
  const isArabic = locale === "ar";

  const activeLineCode = activeCorridor.lines.includes(lineCode) ? lineCode : activeCorridor.lines[0];
  const activeLine = catalogLines.find((line) => line.code === activeLineCode) ?? catalogLines[0];
  const activeSchedule = schedules[activeLineCode];
  const clampedKm = Math.min(km, activeCorridor.maxKm);
  const offset = arrivalOffset(activeCorridor, clampedKm);

  const arrivals = useMemo(() => {
    return nextDepartures(activeLineCode).map((departure) => ({
      departure: timeFromMinutes(departure),
      arrival: timeFromMinutes(departure + offset),
      eta: departure + offset - currentDayMinute(),
    }));
  }, [activeLineCode, offset]);

  const kmRows = useMemo(() => {
    const firstDeparture = nextDepartures(activeLineCode, 1)[0];
    return kmOptions(activeCorridor.maxKm).map((value) => {
      const rowOffset = arrivalOffset(activeCorridor, value);
      return {
        km: value,
        labelFr: `${activeCorridor.nameFr} Km ${value}`,
        labelAr: `${activeCorridor.nameAr} كلم ${value}`,
        offset: rowOffset,
        arrival: timeFromMinutes(firstDeparture + rowOffset),
      };
    });
  }, [activeCorridor, activeLineCode]);

  function changeCorridor(nextId: string) {
    const next = corridors.find((corridor) => corridor.id === nextId) ?? corridors[0];
    setCorridorId(next.id);
    setLineCode(next.lines[0]);
    setKm(Math.min(km, next.maxKm));
  }

  return (
    <main className="page" dir={isArabic ? "rtl" : "ltr"}>
      <section className="app-shell">
        <header className="topbar">
          <div>
            <p className="eyebrow">{t.subtitle}</p>
            <h1>{t.appName}</h1>
          </div>
          <div className="language-switch" aria-label="Language">
            <button className={locale === "fr" ? "active" : ""} onClick={() => setLocale("fr")}>FR</button>
            <button className={locale === "ar" ? "active" : ""} onClick={() => setLocale("ar")}>AR</button>
          </div>
        </header>

        <section className="hero-grid">
          <div className="hero-copy">
            <span className="status-pill">{t.trusted}</span>
            <h2>{t.headline}</h2>
            <p>{t.intro}</p>
            <div className="selector-grid">
              <label>
                <span>{t.region}</span>
                <select value={activeCorridor.id} onChange={(event) => changeCorridor(event.target.value)}>
                  {corridors.map((corridor) => (
                    <option key={corridor.id} value={corridor.id}>
                      {name(locale, corridor.nameFr, corridor.nameAr)}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>{t.line}</span>
                <select value={activeLineCode} onChange={(event) => setLineCode(event.target.value)}>
                  {activeCorridor.lines.map((code) => {
                    const item = catalogLines.find((line) => line.code === code);
                    return <option key={code} value={code}>{code} - {item ? name(locale, item.nameFr, item.nameAr) : code}</option>;
                  })}
                </select>
              </label>
              <label>
                <span>{t.kmPoint}</span>
                <select value={clampedKm} onChange={(event) => setKm(Number(event.target.value))}>
                  {kmOptions(activeCorridor.maxKm).map((value) => (
                    <option key={value} value={value}>Km {value}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <aside className="eta-panel">
            <span className="panel-kicker">{t.nextArrivals}</span>
            <div className="line-badge">{t.line} {activeLineCode}</div>
            <span className={`reliability ${activeCorridor.reliability}`}>{t[activeCorridor.reliability]}</span>
            <h3>{arrivals[0].eta} {t.minutes}</h3>
            <p>{name(locale, activeCorridor.nameFr, activeCorridor.nameAr)} Km {clampedKm}</p>
            <dl>
              <div><dt>{t.startsAt}</dt><dd>{arrivals[0].departure}</dd></div>
              <div><dt>{t.arrivesAt}</dt><dd>{arrivals[0].arrival}</dd></div>
              <div><dt>{t.terminal}</dt><dd>{name(locale, activeLine.terminalFr, activeLine.terminalAr)}</dd></div>
              <div><dt>{t.frequency}</dt><dd>{activeSchedule.frequency} {t.minutes}</dd></div>
            </dl>
            <ol className="mini-arrivals">
              {arrivals.map((item) => (
                <li key={`${item.departure}-${item.arrival}`}>
                  <span>{item.departure}</span>
                  <strong>{item.arrival}</strong>
                  <small>{t.inMinutes} {item.eta} {t.minutes}</small>
                </li>
              ))}
            </ol>
          </aside>
        </section>

        <nav className="tabs" aria-label="views">
          {(["estimate", "lines", "kilometers", "sources"] as View[]).map((tab) => (
            <button key={tab} className={view === tab ? "active" : ""} onClick={() => setView(tab)}>
              {t.tabs[tab]}
            </button>
          ))}
        </nav>

        {view === "estimate" && (
          <section className="content-grid">
            <div className="map-panel">
              <img src="/sfax-network-map.png" alt={t.mapLabel} />
            </div>
            <aside className="plan-panel">
              <h2>{t.method}</h2>
              <p>{t.methodText}</p>
              <p className="basis">{t.limitation}</p>
            </aside>
          </section>
        )}

        {view === "lines" && (
          <section className="line-table">
            <div className="table-head">
              <span>{t.code}</span>
              <span>{t.name}</span>
              <span>{t.origin}</span>
              <span>{t.coverage}</span>
            </div>
            {catalogLines.map((line) => {
              const matchingCorridors = corridors.filter((corridor) => corridor.lines.includes(line.code));
              return (
                <div className="table-row" key={line.code}>
                  <strong>{line.code}</strong>
                  <span>{name(locale, line.nameFr, line.nameAr)}</span>
                  <span>{name(locale, line.terminalFr, line.terminalAr)}</span>
                  <span>{matchingCorridors.length ? matchingCorridors.map((corridor) => name(locale, corridor.nameFr, corridor.nameAr)).join(", ") : t.noLine}</span>
                </div>
              );
            })}
          </section>
        )}

        {view === "kilometers" && (
          <section className="km-panel">
            <h2>{t.kmTableTitle}</h2>
            <div className="table-head km-head">
              <span>{t.kmPoint}</span>
              <span>{t.direction}</span>
              <span>{t.inMinutes}</span>
              <span>{t.arrivesAt}</span>
            </div>
            {kmRows.map((row) => (
              <div className="table-row km-row" key={row.km}>
                <strong>Km {row.km}</strong>
                <span>{name(locale, row.labelFr, row.labelAr)}</span>
                <span>{row.offset} {t.minutes}</span>
                <span>{row.arrival}</span>
              </div>
            ))}
          </section>
        )}

        {view === "sources" && (
          <section className="poc-panel">
            <div>
              <h2>{t.sourceTitle}</h2>
              <p>{t.limitation}</p>
            </div>
            <ol>
              {t.sourceItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
            <div className="schema-grid">
              <span>corridors</span>
              <span>line_codes</span>
              <span>km_points_0_5</span>
              <span>departure_times</span>
              <span>arrival_offsets</span>
              <span>eta_confidence</span>
              <span>traffic_factor</span>
              <span>official_import</span>
            </div>
          </section>
        )}
      </section>
    </main>
  );
}

"use client";

import { useMemo, useState } from "react";

type Locale = "fr" | "ar";
type Confidence = "high" | "medium" | "low";

type Stop = {
  id: string;
  nameFr: string;
  nameAr: string;
  areaFr: string;
  areaAr: string;
  kmFromStart: number;
  offsetMinutes: number;
};

type BusLine = {
  code: string;
  nameFr: string;
  nameAr: string;
  stationFr: string;
  stationAr: string;
  destinationFr: string;
  destinationAr: string;
  color: string;
  frequencyMinutes: number;
  firstDeparture: string;
  lastDeparture: string;
  stops: Stop[];
};

const lines: BusLine[] = [
  {
    code: "16",
    nameFr: "Thyna",
    nameAr: "طينة",
    stationFr: "Gare El Kasba",
    stationAr: "محطة القصبة",
    destinationFr: "Thyna",
    destinationAr: "طينة",
    color: "#1f9d7a",
    frequencyMinutes: 18,
    firstDeparture: "05:45",
    lastDeparture: "21:25",
    stops: [
      { id: "kasba", nameFr: "Gare El Kasba", nameAr: "محطة القصبة", areaFr: "Centre ville", areaAr: "وسط المدينة", kmFromStart: 0, offsetMinutes: 0 },
      { id: "bab-bhar", nameFr: "Bab Bhar", nameAr: "باب بحر", areaFr: "Centre ville", areaAr: "وسط المدينة", kmFromStart: 1.2, offsetMinutes: 5 },
      { id: "route-gabes-km4", nameFr: "Route Gabes Km 4", nameAr: "طريق قابس كلم 4", areaFr: "Route Gabes", areaAr: "طريق قابس", kmFromStart: 4, offsetMinutes: 14 },
      { id: "route-gabes-km6", nameFr: "Route Gabes Km 6", nameAr: "طريق قابس كلم 6", areaFr: "Route Gabes", areaAr: "طريق قابس", kmFromStart: 6, offsetMinutes: 21 },
      { id: "thyna", nameFr: "Thyna", nameAr: "طينة", areaFr: "Thyna", areaAr: "طينة", kmFromStart: 10, offsetMinutes: 34 },
    ],
  },
  {
    code: "14",
    nameFr: "Aeroport",
    nameAr: "المطار",
    stationFr: "Gare El Kasba",
    stationAr: "محطة القصبة",
    destinationFr: "Aeroport Sfax-Thyna",
    destinationAr: "مطار صفاقس طينة",
    color: "#d97706",
    frequencyMinutes: 24,
    firstDeparture: "06:00",
    lastDeparture: "20:40",
    stops: [
      { id: "kasba", nameFr: "Gare El Kasba", nameAr: "محطة القصبة", areaFr: "Centre ville", areaAr: "وسط المدينة", kmFromStart: 0, offsetMinutes: 0 },
      { id: "route-aeroport", nameFr: "Route Aeroport", nameAr: "طريق المطار", areaFr: "Sfax sud", areaAr: "صفاقس الجنوبية", kmFromStart: 3.5, offsetMinutes: 13 },
      { id: "aeroport", nameFr: "Aeroport", nameAr: "المطار", areaFr: "Aeroport", areaAr: "المطار", kmFromStart: 7.5, offsetMinutes: 28 },
    ],
  },
  {
    code: "9",
    nameFr: "Gremda",
    nameAr: "قرمدة",
    stationFr: "Gare Beb Djebli",
    stationAr: "محطة باب الجبلي",
    destinationFr: "Gremda",
    destinationAr: "قرمدة",
    color: "#2563eb",
    frequencyMinutes: 16,
    firstDeparture: "05:30",
    lastDeparture: "21:50",
    stops: [
      { id: "beb-djebli", nameFr: "Gare Beb Djebli", nameAr: "محطة باب الجبلي", areaFr: "Medina", areaAr: "المدينة", kmFromStart: 0, offsetMinutes: 0 },
      { id: "route-gremda-km2", nameFr: "Route Gremda Km 2", nameAr: "طريق قرمدة كلم 2", areaFr: "Route Gremda", areaAr: "طريق قرمدة", kmFromStart: 2, offsetMinutes: 8 },
      { id: "route-gremda-km5", nameFr: "Route Gremda Km 5", nameAr: "طريق قرمدة كلم 5", areaFr: "Route Gremda", areaAr: "طريق قرمدة", kmFromStart: 5, offsetMinutes: 18 },
      { id: "gremda", nameFr: "Gremda", nameAr: "قرمدة", areaFr: "Gremda", areaAr: "قرمدة", kmFromStart: 8, offsetMinutes: 31 },
    ],
  },
  {
    code: "24",
    nameFr: "Facultes",
    nameAr: "الكليات",
    stationFr: "Gare Beb Djebli",
    stationAr: "محطة باب الجبلي",
    destinationFr: "Facultes",
    destinationAr: "الكليات",
    color: "#7c3aed",
    frequencyMinutes: 20,
    firstDeparture: "06:10",
    lastDeparture: "19:40",
    stops: [
      { id: "beb-djebli", nameFr: "Gare Beb Djebli", nameAr: "محطة باب الجبلي", areaFr: "Medina", areaAr: "المدينة", kmFromStart: 0, offsetMinutes: 0 },
      { id: "soukra", nameFr: "Soukra", nameAr: "سكرة", areaFr: "Sfax nord", areaAr: "صفاقس الشمالية", kmFromStart: 3, offsetMinutes: 12 },
      { id: "facultes", nameFr: "Facultes", nameAr: "الكليات", areaFr: "Campus", areaAr: "المركب الجامعي", kmFromStart: 6.8, offsetMinutes: 27 },
    ],
  },
];

const copy = {
  fr: {
    appName: "Bus Sfax",
    headline: "Estimation des bus SORETRAS, sans GPS au depart",
    intro: "Selectionnez une station pour voir le prochain passage estime a partir des horaires, de l'ordre des arrets et du temps moyen entre stations.",
    search: "Rechercher une station ou une ligne",
    nextBus: "Prochain bus",
    arrivesIn: "arrive dans",
    minutes: "min",
    towards: "vers",
    from: "depart",
    confidence: "confiance",
    basis: "Base: horaires officiels + temps moyen par segment. Les donnees ici sont une graine MVP a remplacer par l'import officiel SORETRAS.",
    station: "Station",
    line: "Ligne",
    schedule: "Horaire estime",
    noResult: "Aucune station trouvee. Essayez Route Gabes, Gremda, Aeroport ou Facultes.",
    productPlan: "Plan produit",
    dataModel: "Structure data",
    roadmap: ["Importer les fichiers officiels SORETRAS", "Calculer les temps entre arrets", "Ajouter trafic et historique", "Ajouter signalements utilisateurs", "Integrer GPS si partenariat disponible"],
    sourceStatus: "MVP avec donnees de demonstration",
    high: "haute",
    medium: "moyenne",
    low: "faible",
  },
  ar: {
    appName: "حافلات صفاقس",
    headline: "تقدير وصول حافلات سوريتراس بدون GPS في البداية",
    intro: "اختر محطة لمعرفة وقت وصول الحافلة اعتمادا على التوقيت، ترتيب المحطات، ومتوسط الوقت بين المحطات.",
    search: "ابحث عن محطة أو خط",
    nextBus: "الحافلة القادمة",
    arrivesIn: "تصل بعد",
    minutes: "دق",
    towards: "في اتجاه",
    from: "انطلاق",
    confidence: "الثقة",
    basis: "القاعدة: توقيت رسمي + متوسط الوقت بين المحطات. هذه بيانات أولية للنسخة التجريبية وسيتم تعويضها باستيراد بيانات سوريتراس الرسمية.",
    station: "المحطة",
    line: "الخط",
    schedule: "الوقت المتوقع",
    noResult: "لا توجد محطة. جرب طريق قابس، قرمدة، المطار أو الكليات.",
    productPlan: "خطة المنتج",
    dataModel: "هيكلة البيانات",
    roadmap: ["استيراد ملفات سوريتراس الرسمية", "حساب الوقت بين المحطات", "إضافة حالة الطريق والتاريخ", "إضافة تبليغات المستخدمين", "إدماج GPS عند توفر شراكة"],
    sourceStatus: "نسخة MVP ببيانات تجريبية",
    high: "مرتفعة",
    medium: "متوسطة",
    low: "ضعيفة",
  },
};

function minutesFromTime(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function timeFromMinutes(value: number) {
  const minutes = ((value % 1440) + 1440) % 1440;
  const h = Math.floor(minutes / 60).toString().padStart(2, "0");
  const m = (minutes % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

function getNextArrival(line: BusLine, stop: Stop) {
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const first = minutesFromTime(line.firstDeparture);
  const last = minutesFromTime(line.lastDeparture);
  const targetFirst = first + stop.offsetMinutes;
  const targetLast = last + stop.offsetMinutes;

  let arrival = targetFirst;
  if (nowMinutes > targetFirst) {
    const steps = Math.ceil((nowMinutes - targetFirst) / line.frequencyMinutes);
    arrival = targetFirst + steps * line.frequencyMinutes;
  }

  if (arrival > targetLast) {
    arrival = targetFirst + 1440;
  }

  const etaMinutes = arrival - nowMinutes;
  const confidence: Confidence = stop.offsetMinutes <= 12 ? "medium" : "low";

  return {
    arrivalTime: timeFromMinutes(arrival),
    etaMinutes,
    departureTime: timeFromMinutes(arrival - stop.offsetMinutes),
    confidence,
  };
}

export default function Home() {
  const [locale, setLocale] = useState<Locale>("fr");
  const [query, setQuery] = useState("Route Gabes Km 6");
  const t = copy[locale];
  const isArabic = locale === "ar";

  const matches = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return lines.flatMap((line) =>
      line.stops
        .filter((stop) => {
          const haystack = [
            line.code,
            line.nameFr,
            line.nameAr,
            stop.nameFr,
            stop.nameAr,
            stop.areaFr,
            stop.areaAr,
          ].join(" ").toLowerCase();
          return !normalized || haystack.includes(normalized);
        })
        .map((stop) => ({ line, stop, eta: getNextArrival(line, stop) })),
    );
  }, [query]);

  const primary = matches[0];

  return (
    <main className="min-h-screen bg-[#f7f3ea] text-[#18201f]" dir={isArabic ? "rtl" : "ltr"}>
      <section className="app-shell">
        <header className="topbar">
          <div>
            <p className="eyebrow">SORETRAS / Sfax</p>
            <h1>{t.appName}</h1>
          </div>
          <div className="language-switch" aria-label="Language">
            <button className={locale === "fr" ? "active" : ""} onClick={() => setLocale("fr")}>FR</button>
            <button className={locale === "ar" ? "active" : ""} onClick={() => setLocale("ar")}>AR</button>
          </div>
        </header>

        <section className="hero-grid">
          <div className="hero-copy">
            <span className="status-pill">{t.sourceStatus}</span>
            <h2>{t.headline}</h2>
            <p>{t.intro}</p>
            <label className="search-box">
              <span>{t.search}</span>
              <input value={query} onChange={(event) => setQuery(event.target.value)} />
            </label>
          </div>

          <aside className="eta-panel" aria-live="polite">
            {primary ? (
              <>
                <span className="panel-kicker">{t.nextBus}</span>
                <div className="line-badge" style={{ backgroundColor: primary.line.color }}>
                  {t.line} {primary.line.code}
                </div>
                <h3>
                  {primary.eta.etaMinutes} {t.minutes}
                </h3>
                <p>
                  {t.arrivesIn} {primary.eta.etaMinutes} {t.minutes} {t.towards}{" "}
                  {isArabic ? primary.line.destinationAr : primary.line.destinationFr}
                </p>
                <dl>
                  <div>
                    <dt>{t.station}</dt>
                    <dd>{isArabic ? primary.stop.nameAr : primary.stop.nameFr}</dd>
                  </div>
                  <div>
                    <dt>{t.schedule}</dt>
                    <dd>{primary.eta.arrivalTime}</dd>
                  </div>
                  <div>
                    <dt>{t.from}</dt>
                    <dd>{primary.eta.departureTime}</dd>
                  </div>
                  <div>
                    <dt>{t.confidence}</dt>
                    <dd>{t[primary.eta.confidence]}</dd>
                  </div>
                </dl>
              </>
            ) : (
              <p className="empty">{t.noResult}</p>
            )}
          </aside>
        </section>

        <section className="content-grid">
          <div className="results">
            {matches.length ? (
              matches.slice(0, 8).map(({ line, stop, eta }) => (
                <article className="result-card" key={`${line.code}-${stop.id}`}>
                  <span className="route-dot" style={{ backgroundColor: line.color }} />
                  <div>
                    <h3>{t.line} {line.code} - {isArabic ? line.nameAr : line.nameFr}</h3>
                    <p>{isArabic ? stop.nameAr : stop.nameFr} / {isArabic ? line.stationAr : line.stationFr}</p>
                  </div>
                  <strong>{eta.etaMinutes} {t.minutes}</strong>
                </article>
              ))
            ) : (
              <p className="empty">{t.noResult}</p>
            )}
          </div>

          <aside className="plan-panel">
            <h2>{t.productPlan}</h2>
            <ol>
              {t.roadmap.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
            <h2>{t.dataModel}</h2>
            <p>stations, lines, routes, trips, stop_times, eta_predictions, alerts</p>
            <p className="basis">{t.basis}</p>
          </aside>
        </section>
      </section>
    </main>
  );
}

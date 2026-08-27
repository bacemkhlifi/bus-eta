"use client";

import { useMemo, useState } from "react";

type Locale = "fr" | "ar";
type View = "arrival" | "lines" | "stations" | "poc";
type Confidence = "high" | "medium" | "low";
type DataQuality = "seed" | "catalog" | "pending";
type StationStatus = "available" | "needs_coordinates" | "planned";

type Stop = {
  id: string;
  nameFr: string;
  nameAr: string;
  areaFr: string;
  areaAr: string;
  kmFromStart: number;
  offsetMinutes: number;
  status: StationStatus;
  coordinates?: [number, number];
  amenities: string[];
  lines: string[];
};

type DetailedLine = {
  code: string;
  nameFr: string;
  nameAr: string;
  stationFr: string;
  stationAr: string;
  destinationFr: string;
  destinationAr: string;
  corridorFr: string;
  corridorAr: string;
  color: string;
  frequencyMinutes: number;
  firstDeparture: string;
  lastDeparture: string;
  quality: DataQuality;
  stops: Stop[];
};

type CatalogLine = {
  code: string;
  nameFr: string;
  nameAr: string;
  stationFr: string;
  stationAr: string;
  status: DataQuality;
};

const catalogLines: CatalogLine[] = [
  ["1", "El Bousten", "البوستن", "Gare El Kasba", "محطة القصبة"],
  ["2", "Hached", "هاشد", "Gare El Kasba", "محطة القصبة"],
  ["3", "Sidi Mansour", "سيدي منصور", "Gare El Karia", "محطة القارية"],
  ["4", "Saltnia", "سلطنية", "Gare El Karia", "محطة القارية"],
  ["5", "Sakiet Eddayer", "ساقية الدائر", "Gare El Karia", "محطة القارية"],
  ["5A", "Rached", "راشد", "Gare El Karia", "محطة القارية"],
  ["6", "Sakiet Ezzit", "ساقية الزيت", "Gare El Karia", "محطة القارية"],
  ["6A", "El Wed", "الواد", "Gare El Karia", "محطة القارية"],
  ["7", "Teniour", "التنيور", "Gare Beb Djebli", "محطة باب الجبلي"],
  ["8", "Kaid M'hammad", "قايد محمد", "Gare Beb Djebli", "محطة باب الجبلي"],
  ["9", "Gremda", "قرمدة", "Gare Beb Djebli", "محطة باب الجبلي"],
  ["10", "El Afrane", "الأفران", "Gare Beb Djebli", "محطة باب الجبلي"],
  ["11", "Kassasat", "قصاصات", "Gare Beb Djebli", "محطة باب الجبلي"],
  ["12", "El Ain", "العين", "Gare Beb Djebli", "محطة باب الجبلي"],
  ["13", "Chaker", "شاكر", "Gare El Kasba", "محطة القصبة"],
  ["13A", "Boumarra", "بومرة", "Gare El Kasba", "محطة القصبة"],
  ["14", "Aeroport", "المطار", "Gare El Kasba", "محطة القصبة"],
  ["14A", "Hajeb", "الحاجب", "Gare El Kasba", "محطة القصبة"],
  ["14B", "Essghar", "الصغار", "Gare El Kasba", "محطة القصبة"],
  ["15", "Soukra", "سكرة", "Gare El Kasba", "محطة القصبة"],
  ["16", "Thyna", "طينة", "Gare El Kasba", "محطة القصبة"],
  ["16A", "Prison Civile", "السجن المدني", "Gare El Kasba", "محطة القصبة"],
  ["16D", "Sidi Salem", "سيدي سالم", "Gare El Kasba", "محطة القصبة"],
  ["17", "Port de peche", "ميناء الصيد", "Gare Beb Djebli", "محطة باب الجبلي"],
  ["18", "M'harza", "المحرزة", "Gare El Kasba", "محطة القصبة"],
  ["20", "Ziadi", "الزيادي", "Gare El Karia", "محطة القارية"],
  ["22", "Bouali", "البوعلي", "Gare El Karia", "محطة القارية"],
  ["23", "Bouzaien", "البوزيان", "Gare El Kasba", "محطة القصبة"],
  ["24", "Facultes", "الكليات", "Gare Beb Djebli", "محطة باب الجبلي"],
  ["25", "Technopole", "التكنوبول", "Gare El Karia", "محطة القارية"],
  ["30", "Monji Slim", "المنجي سليم", "Gare El Karia", "محطة القارية"],
].map(([code, nameFr, nameAr, stationFr, stationAr]) => ({
  code,
  nameFr,
  nameAr,
  stationFr,
  stationAr,
  status: ["9", "14", "16", "24"].includes(code) ? "seed" : "catalog",
}));

const detailedLines: DetailedLine[] = [
  {
    code: "16",
    nameFr: "Thyna",
    nameAr: "طينة",
    stationFr: "Gare El Kasba",
    stationAr: "محطة القصبة",
    destinationFr: "Thyna",
    destinationAr: "طينة",
    corridorFr: "Route Gabes",
    corridorAr: "طريق قابس",
    color: "#118568",
    frequencyMinutes: 18,
    firstDeparture: "05:45",
    lastDeparture: "21:25",
    quality: "seed",
    stops: [
      stop("kasba", "Gare El Kasba", "محطة القصبة", "Centre ville", "وسط المدينة", 0, 0, "available", [34.7398, 10.7602], ["guichet", "correspondance"], ["1", "2", "13", "14", "16"]),
      stop("bab-bhar", "Bab Bhar", "باب بحر", "Centre ville", "وسط المدينة", 1.2, 5, "available", [34.7371, 10.7659], ["abri"], ["16", "14"]),
      stop("route-gabes-km4", "Route Gabes Km 4", "طريق قابس كلم 4", "Route Gabes", "طريق قابس", 4, 14, "needs_coordinates", undefined, ["arret simple"], ["16"]),
      stop("route-gabes-km6", "Route Gabes Km 6", "طريق قابس كلم 6", "Route Gabes", "طريق قابس", 6, 21, "needs_coordinates", undefined, ["arret simple"], ["16"]),
      stop("thyna", "Thyna", "طينة", "Thyna", "طينة", 10, 34, "available", [34.6704, 10.7099], ["terminus"], ["16"]),
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
    corridorFr: "Route Aeroport",
    corridorAr: "طريق المطار",
    color: "#c26418",
    frequencyMinutes: 24,
    firstDeparture: "06:00",
    lastDeparture: "20:40",
    quality: "seed",
    stops: [
      stop("kasba", "Gare El Kasba", "محطة القصبة", "Centre ville", "وسط المدينة", 0, 0, "available", [34.7398, 10.7602], ["guichet", "correspondance"], ["14", "16"]),
      stop("route-aeroport", "Route Aeroport", "طريق المطار", "Sfax sud", "صفاقس الجنوبية", 3.5, 13, "needs_coordinates", undefined, ["arret simple"], ["14"]),
      stop("aeroport", "Aeroport Sfax-Thyna", "مطار صفاقس طينة", "Aeroport", "المطار", 7.5, 28, "available", [34.718, 10.6905], ["terminus"], ["14"]),
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
    corridorFr: "Route Gremda",
    corridorAr: "طريق قرمدة",
    color: "#2368b8",
    frequencyMinutes: 16,
    firstDeparture: "05:30",
    lastDeparture: "21:50",
    quality: "seed",
    stops: [
      stop("beb-djebli", "Gare Beb Djebli", "محطة باب الجبلي", "Medina", "المدينة", 0, 0, "available", [34.7421, 10.7591], ["guichet", "correspondance"], ["7", "8", "9", "10", "11", "12", "17", "24"]),
      stop("route-gremda-km2", "Route Gremda Km 2", "طريق قرمدة كلم 2", "Route Gremda", "طريق قرمدة", 2, 8, "needs_coordinates", undefined, ["arret simple"], ["9"]),
      stop("route-gremda-km5", "Route Gremda Km 5", "طريق قرمدة كلم 5", "Route Gremda", "طريق قرمدة", 5, 18, "needs_coordinates", undefined, ["arret simple"], ["9"]),
      stop("gremda", "Gremda", "قرمدة", "Gremda", "قرمدة", 8, 31, "available", [34.7528, 10.8538], ["terminus"], ["9"]),
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
    corridorFr: "Campus universitaire",
    corridorAr: "المركب الجامعي",
    color: "#5f4bb6",
    frequencyMinutes: 20,
    firstDeparture: "06:10",
    lastDeparture: "19:40",
    quality: "seed",
    stops: [
      stop("beb-djebli", "Gare Beb Djebli", "محطة باب الجبلي", "Medina", "المدينة", 0, 0, "available", [34.7421, 10.7591], ["guichet", "correspondance"], ["24", "9"]),
      stop("soukra", "Soukra", "سكرة", "Sfax nord", "صفاقس الشمالية", 3, 12, "available", [34.774, 10.759], ["abri"], ["15", "24"]),
      stop("facultes", "Facultes", "الكليات", "Campus", "المركب الجامعي", 6.8, 27, "available", [34.809, 10.748], ["terminus", "zone etudiante"], ["24"]),
    ],
  },
];

const stationDirectory = uniqueStops(detailedLines);

const copy = {
  fr: {
    appName: "Bus Sfax ETA",
    strapline: "POC transport urbain SORETRAS",
    headline: "Arrivees estimees, lignes et stations dans une seule interface",
    intro: "Cette version POC montre comment l'application peut fonctionner avant GPS: horaires, arrets ordonnes, temps moyens et transparence sur la qualite des donnees.",
    search: "Rechercher station, ligne, zone",
    tabs: { arrival: "Arrivees", lines: "Lignes", stations: "Stations", poc: "POC" },
    nextBus: "Prochain passage",
    arrivesIn: "arrive dans",
    minutes: "min",
    towards: "vers",
    from: "depart",
    confidence: "confiance",
    station: "Station",
    line: "Ligne",
    schedule: "Horaire estime",
    frequency: "Frequence",
    firstLast: "Premier / dernier",
    origin: "Origine",
    corridor: "Couloir",
    dataQuality: "Donnees",
    noResult: "Aucun resultat. Essayez Route Gabes, Gremda, Aeroport, Facultes ou un code comme 16.",
    available: "Disponible",
    needs_coordinates: "Coordonnees a verifier",
    planned: "Planifie",
    high: "haute",
    medium: "moyenne",
    low: "faible",
    seed: "detail POC",
    catalog: "catalogue officiel",
    pending: "a importer",
    stats: ["31 lignes urbaines referencees", "3 gares principales", "11 stations detaillees", "4 lignes ETA pretes"],
    pocTitle: "Ce qu'il faut pour une POC credible",
    pocItems: [
      "Importer les fichiers SORETRAS: lignes, itineraires, horaires et coordonnees stations.",
      "Normaliser les noms en francais et arabe avec identifiants stables.",
      "Construire stop_times pour connaitre l'heure theorique a chaque station.",
      "Precalculer les temps entre arrets et les recalculer par periode de jour.",
      "Afficher un niveau de confiance pour eviter de promettre du temps reel sans GPS.",
      "Ajouter une console admin pour corriger les stations, lignes et alertes.",
    ],
    formula: "ETA = depart planifie + decalage station + retard estime",
    disclaimer: "Les 31 codes sont listes. Les horaires detailles affiches sont une graine POC et doivent etre remplaces par l'import officiel avant test public.",
  },
  ar: {
    appName: "حافلات صفاقس ETA",
    strapline: "نسخة إثبات مفهوم للنقل الحضري سوريتراس",
    headline: "أوقات وصول تقديرية، خطوط ومحطات في واجهة واحدة",
    intro: "هذه نسخة POC توضّح طريقة العمل قبل GPS: توقيت، ترتيب محطات، متوسط وقت، ووضوح حول جودة البيانات.",
    search: "ابحث عن محطة، خط أو منطقة",
    tabs: { arrival: "الوصول", lines: "الخطوط", stations: "المحطات", poc: "POC" },
    nextBus: "الحافلة القادمة",
    arrivesIn: "تصل بعد",
    minutes: "دق",
    towards: "في اتجاه",
    from: "انطلاق",
    confidence: "الثقة",
    station: "المحطة",
    line: "الخط",
    schedule: "الوقت المتوقع",
    frequency: "التواتر",
    firstLast: "أول / آخر رحلة",
    origin: "الانطلاق",
    corridor: "المسار",
    dataQuality: "البيانات",
    noResult: "لا توجد نتيجة. جرب طريق قابس، قرمدة، المطار، الكليات أو رقم خط مثل 16.",
    available: "متوفرة",
    needs_coordinates: "الإحداثيات تحتاج تثبت",
    planned: "مبرمجة",
    high: "مرتفعة",
    medium: "متوسطة",
    low: "ضعيفة",
    seed: "تفاصيل POC",
    catalog: "كتالوج رسمي",
    pending: "في انتظار الاستيراد",
    stats: ["31 خط حضري مرجع", "3 محطات رئيسية", "11 محطة مفصلة", "4 خطوط ETA جاهزة"],
    pocTitle: "ما يلزم لنسخة POC مقنعة",
    pocItems: [
      "استيراد ملفات سوريتراس: الخطوط، المسارات، التوقيت وإحداثيات المحطات.",
      "توحيد أسماء المحطات بالعربية والفرنسية مع معرفات ثابتة.",
      "بناء stop_times لمعرفة الوقت النظري في كل محطة.",
      "حساب الوقت بين المحطات وإعادة تقديره حسب فترات اليوم.",
      "إظهار مستوى الثقة حتى لا نقدم وقتا حقيقيا بدون GPS.",
      "إضافة لوحة إدارة لتصحيح المحطات والخطوط والتنبيهات.",
    ],
    formula: "ETA = وقت الانطلاق + فرق المحطة + التأخير المتوقع",
    disclaimer: "تم إدراج 31 رقم خط. التوقيت التفصيلي المعروض هو بيانات POC ويجب تعويضه بالاستيراد الرسمي قبل اختبار عمومي.",
  },
};

function stop(
  id: string,
  nameFr: string,
  nameAr: string,
  areaFr: string,
  areaAr: string,
  kmFromStart: number,
  offsetMinutes: number,
  status: StationStatus,
  coordinates: [number, number] | undefined,
  amenities: string[],
  lineCodes: string[],
): Stop {
  return { id, nameFr, nameAr, areaFr, areaAr, kmFromStart, offsetMinutes, status, coordinates, amenities, lines: lineCodes };
}

function uniqueStops(source: DetailedLine[]) {
  const map = new Map<string, Stop>();
  for (const line of source) {
    for (const current of line.stops) {
      const existing = map.get(current.id);
      if (!existing) {
        map.set(current.id, current);
        continue;
      }
      map.set(current.id, {
        ...existing,
        lines: Array.from(new Set([...existing.lines, ...current.lines, line.code])).sort(),
      });
    }
  }
  return Array.from(map.values()).sort((a, b) => a.nameFr.localeCompare(b.nameFr));
}

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

function getNextArrival(line: DetailedLine, stopItem: Stop) {
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const first = minutesFromTime(line.firstDeparture);
  const last = minutesFromTime(line.lastDeparture);
  const targetFirst = first + stopItem.offsetMinutes;
  const targetLast = last + stopItem.offsetMinutes;

  let arrival = targetFirst;
  if (nowMinutes > targetFirst) {
    const steps = Math.ceil((nowMinutes - targetFirst) / line.frequencyMinutes);
    arrival = targetFirst + steps * line.frequencyMinutes;
  }

  if (arrival > targetLast) {
    arrival = targetFirst + 1440;
  }

  const etaMinutes = arrival - nowMinutes;
  const confidence: Confidence = stopItem.status === "available" && line.quality === "seed" ? "medium" : "low";

  return {
    arrivalTime: timeFromMinutes(arrival),
    etaMinutes,
    departureTime: timeFromMinutes(arrival - stopItem.offsetMinutes),
    confidence,
  };
}

function localName(locale: Locale, fr: string, ar: string) {
  return locale === "ar" ? ar : fr;
}

export default function Home() {
  const [locale, setLocale] = useState<Locale>("fr");
  const [view, setView] = useState<View>("arrival");
  const [query, setQuery] = useState("Route Gabes Km 6");
  const [selectedLine, setSelectedLine] = useState("16");
  const t = copy[locale];
  const isArabic = locale === "ar";

  const normalizedQuery = query.trim().toLowerCase();

  const arrivals = useMemo(() => {
    return detailedLines
      .flatMap((lineItem) =>
        lineItem.stops.map((stationItem) => ({
          line: lineItem,
          station: stationItem,
          eta: getNextArrival(lineItem, stationItem),
        })),
      )
      .filter(({ line, station }) => {
        const haystack = [
          line.code,
          line.nameFr,
          line.nameAr,
          line.stationFr,
          line.stationAr,
          line.corridorFr,
          line.corridorAr,
          station.nameFr,
          station.nameAr,
          station.areaFr,
          station.areaAr,
        ].join(" ").toLowerCase();
        return !normalizedQuery || haystack.includes(normalizedQuery);
      })
      .sort((a, b) => a.eta.etaMinutes - b.eta.etaMinutes);
  }, [normalizedQuery]);

  const filteredCatalog = useMemo(() => {
    return catalogLines.filter((lineItem) => {
      const haystack = [lineItem.code, lineItem.nameFr, lineItem.nameAr, lineItem.stationFr, lineItem.stationAr].join(" ").toLowerCase();
      return !normalizedQuery || haystack.includes(normalizedQuery);
    });
  }, [normalizedQuery]);

  const filteredStations = useMemo(() => {
    return stationDirectory.filter((stationItem) => {
      const haystack = [stationItem.nameFr, stationItem.nameAr, stationItem.areaFr, stationItem.areaAr, stationItem.lines.join(" ")].join(" ").toLowerCase();
      return !normalizedQuery || haystack.includes(normalizedQuery);
    });
  }, [normalizedQuery]);

  const activeLine = detailedLines.find((lineItem) => lineItem.code === selectedLine) ?? detailedLines[0];
  const primary = arrivals[0];

  return (
    <main className="page" dir={isArabic ? "rtl" : "ltr"}>
      <section className="app-shell">
        <header className="topbar">
          <div>
            <p className="eyebrow">{t.strapline}</p>
            <h1>{t.appName}</h1>
          </div>
          <div className="language-switch" aria-label="Language">
            <button className={locale === "fr" ? "active" : ""} onClick={() => setLocale("fr")}>FR</button>
            <button className={locale === "ar" ? "active" : ""} onClick={() => setLocale("ar")}>AR</button>
          </div>
        </header>

        <section className="hero-grid">
          <div className="hero-copy">
            <span className="status-pill">POC ready</span>
            <h2>{t.headline}</h2>
            <p>{t.intro}</p>
            <div className="stats-grid">
              {t.stats.map((stat) => (
                <span key={stat}>{stat}</span>
              ))}
            </div>
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
                <h3>{primary.eta.etaMinutes} {t.minutes}</h3>
                <p>
                  {t.arrivesIn} {primary.eta.etaMinutes} {t.minutes} {t.towards}{" "}
                  {localName(locale, primary.line.destinationFr, primary.line.destinationAr)}
                </p>
                <dl>
                  <div><dt>{t.station}</dt><dd>{localName(locale, primary.station.nameFr, primary.station.nameAr)}</dd></div>
                  <div><dt>{t.schedule}</dt><dd>{primary.eta.arrivalTime}</dd></div>
                  <div><dt>{t.from}</dt><dd>{primary.eta.departureTime}</dd></div>
                  <div><dt>{t.confidence}</dt><dd>{t[primary.eta.confidence]}</dd></div>
                </dl>
              </>
            ) : (
              <p className="empty">{t.noResult}</p>
            )}
          </aside>
        </section>

        <nav className="tabs" aria-label="POC views">
          {(["arrival", "lines", "stations", "poc"] as View[]).map((tab) => (
            <button key={tab} className={view === tab ? "active" : ""} onClick={() => setView(tab)}>
              {t.tabs[tab]}
            </button>
          ))}
        </nav>

        {view === "arrival" && (
          <section className="content-grid">
            <div className="results">
              {arrivals.length ? arrivals.slice(0, 12).map(({ line, station, eta }) => (
                <article className="result-card" key={`${line.code}-${station.id}`}>
                  <span className="route-dot" style={{ backgroundColor: line.color }} />
                  <div>
                    <h3>{t.line} {line.code} - {localName(locale, line.nameFr, line.nameAr)}</h3>
                    <p>{localName(locale, station.nameFr, station.nameAr)} / {localName(locale, line.stationFr, line.stationAr)}</p>
                  </div>
                  <strong>{eta.etaMinutes} {t.minutes}</strong>
                </article>
              )) : <p className="empty">{t.noResult}</p>}
            </div>

            <aside className="plan-panel">
              <h2>{t.formula}</h2>
              <p className="basis">{t.disclaimer}</p>
              <div className="quality-list">
                <span>{t.medium}: horaires + station detaillee</span>
                <span>{t.low}: catalogue ou coordonnees a verifier</span>
              </div>
            </aside>
          </section>
        )}

        {view === "lines" && (
          <section className="line-layout">
            <div className="line-catalog">
              {filteredCatalog.map((lineItem) => (
                <button
                  key={lineItem.code}
                  className={selectedLine === lineItem.code ? "line-row active" : "line-row"}
                  onClick={() => setSelectedLine(lineItem.code)}
                >
                  <strong>{lineItem.code}</strong>
                  <span>{localName(locale, lineItem.nameFr, lineItem.nameAr)}</span>
                  <small>{localName(locale, lineItem.stationFr, lineItem.stationAr)} - {t[lineItem.status]}</small>
                </button>
              ))}
            </div>

            <aside className="line-detail">
              <span className="line-badge" style={{ backgroundColor: activeLine.color }}>{t.line} {activeLine.code}</span>
              <h2>{localName(locale, activeLine.nameFr, activeLine.nameAr)}</h2>
              <dl>
                <div><dt>{t.origin}</dt><dd>{localName(locale, activeLine.stationFr, activeLine.stationAr)}</dd></div>
                <div><dt>{t.corridor}</dt><dd>{localName(locale, activeLine.corridorFr, activeLine.corridorAr)}</dd></div>
                <div><dt>{t.frequency}</dt><dd>{activeLine.frequencyMinutes} {t.minutes}</dd></div>
                <div><dt>{t.firstLast}</dt><dd>{activeLine.firstDeparture} / {activeLine.lastDeparture}</dd></div>
                <div><dt>{t.dataQuality}</dt><dd>{t[activeLine.quality]}</dd></div>
              </dl>
              <ol className="stop-timeline">
                {activeLine.stops.map((stationItem) => (
                  <li key={stationItem.id}>
                    <span>{localName(locale, stationItem.nameFr, stationItem.nameAr)}</span>
                    <small>+{stationItem.offsetMinutes} {t.minutes}</small>
                  </li>
                ))}
              </ol>
            </aside>
          </section>
        )}

        {view === "stations" && (
          <section className="station-grid">
            {filteredStations.map((stationItem) => (
              <article className="station-card" key={stationItem.id}>
                <div>
                  <span className={`station-status ${stationItem.status}`}>{t[stationItem.status]}</span>
                  <h3>{localName(locale, stationItem.nameFr, stationItem.nameAr)}</h3>
                  <p>{localName(locale, stationItem.areaFr, stationItem.areaAr)}</p>
                </div>
                <div className="station-meta">
                  <span>{t.line}: {stationItem.lines.join(", ")}</span>
                  <span>{stationItem.coordinates ? stationItem.coordinates.join(", ") : "GPS pending"}</span>
                  <span>{stationItem.amenities.join(", ")}</span>
                </div>
              </article>
            ))}
          </section>
        )}

        {view === "poc" && (
          <section className="poc-panel">
            <div>
              <h2>{t.pocTitle}</h2>
              <p>{t.disclaimer}</p>
            </div>
            <ol>
              {t.pocItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
            <div className="schema-grid">
              {["stations", "lines", "routes", "trips", "stop_times", "segment_times", "eta_predictions", "alerts"].map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </section>
        )}
      </section>
    </main>
  );
}

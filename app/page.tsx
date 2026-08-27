"use client";

import { useMemo, useState } from "react";

type Locale = "fr" | "ar";
type View = "estimate" | "lines" | "kilometers" | "sources";

type TerminalKey = "kasba" | "babDjebli" | "karia";

type CatalogLine = {
  code: string;
  nameFr: string;
  nameAr: string;
  terminal: TerminalKey;
  terminalFr: string;
  terminalAr: string;
};

type Corridor = {
  id: string;
  nameFr: string;
  nameAr: string;
  directionFr: string;
  directionAr: string;
  terminal: TerminalKey;
  lines: string[];
  maxKm: number;
  minutesPerKm: number;
  centerExitMinutes: number;
  reliability: "ready" | "needsOfficialImport";
};

const terminalLabels = {
  kasba: { fr: "Gare El Kasba", ar: "محطة القصبة" },
  babDjebli: { fr: "Gare Beb Djebli", ar: "محطة باب الجبلي" },
  karia: { fr: "Gare El Karia", ar: "محطة القارية" },
};

const catalogLines: CatalogLine[] = [
  ["1", "El Bousten", "البوستن", "kasba"],
  ["2", "Hached", "هاشد", "kasba"],
  ["3", "Sidi Mansour", "سيدي منصور", "karia"],
  ["4", "Saltnia", "سلطنية", "karia"],
  ["5", "Sakiet Eddayer", "ساقية الدائر", "karia"],
  ["5A", "Rached", "راشد", "karia"],
  ["6", "Sakiet Ezzit", "ساقية الزيت", "karia"],
  ["6A", "El Wed", "الواد", "karia"],
  ["7", "Teniour", "التنيور", "babDjebli"],
  ["8", "Kaid M'hammad", "قايد محمد", "babDjebli"],
  ["9", "Gremda", "قرمدة", "babDjebli"],
  ["10", "El Afrane", "الأفران", "babDjebli"],
  ["11", "Kassasat", "قصاصات", "babDjebli"],
  ["12", "El Ain", "العين", "babDjebli"],
  ["13", "Chaker", "شاكر", "kasba"],
  ["13A", "Boumarra", "بومرة", "kasba"],
  ["14", "Aeroport", "المطار", "kasba"],
  ["14A", "Hajeb", "الحاجب", "kasba"],
  ["14B", "Essghar", "الصغار", "kasba"],
  ["15", "Soukra", "سكرة", "kasba"],
  ["16", "Thyna", "طينة", "kasba"],
  ["16A", "Thyna ouest", "طينة الغربية", "kasba"],
  ["16B", "Route Gabes", "طريق قابس", "kasba"],
  ["16D", "Sidi Salem", "سيدي سالم", "kasba"],
  ["17", "Port de peche", "ميناء الصيد", "babDjebli"],
  ["18", "M'harza", "المحرزة", "kasba"],
  ["18A", "M'harza ouest", "المحرزة الغربية", "kasba"],
  ["20", "Ziadi", "الزيادي", "karia"],
  ["22", "Bouali", "البوعلي", "karia"],
  ["23", "Bouzaien", "البوزيان", "kasba"],
  ["24", "Facultes", "الكليات", "babDjebli"],
  ["25", "Technopole", "التكنوبول", "karia"],
  ["30", "Monji Slim", "المنجي سليم", "karia"],
].map(([code, nameFr, nameAr, terminal]) => ({
  code,
  nameFr,
  nameAr,
  terminal: terminal as TerminalKey,
  terminalFr: terminalLabels[terminal as TerminalKey].fr,
  terminalAr: terminalLabels[terminal as TerminalKey].ar,
}));

const corridors: Corridor[] = [
  {
    id: "el-bousten-hached",
    nameFr: "El Bousten / Hached",
    nameAr: "البوستن / هاشد",
    directionFr: "vers El Bousten et Hached",
    directionAr: "نحو البوستن وهاشد",
    terminal: "kasba",
    lines: ["1", "2"],
    maxKm: 7,
    minutesPerKm: 3,
    centerExitMinutes: 3,
    reliability: "needsOfficialImport",
  },
  {
    id: "route-gabes-thyna",
    nameFr: "Route Gabes / Thyna",
    nameAr: "طريق قابس / طينة",
    directionFr: "vers Thyna, Route Gabes et Gabes",
    directionAr: "نحو طينة وطريق قابس وقابس",
    terminal: "kasba",
    lines: ["16", "16A", "16B", "16D"],
    maxKm: 12,
    minutesPerKm: 3.4,
    centerExitMinutes: 4,
    reliability: "ready",
  },
  {
    id: "mharza",
    nameFr: "M'harza",
    nameAr: "المحرزة",
    directionFr: "vers M'harza et Sfax ouest",
    directionAr: "نحو المحرزة وصفاقس الغربية",
    terminal: "kasba",
    lines: ["18", "18A"],
    maxKm: 8,
    minutesPerKm: 3.2,
    centerExitMinutes: 5,
    reliability: "ready",
  },
  {
    id: "chaker-boumarra",
    nameFr: "Chaker / Boumarra",
    nameAr: "شاكر / بومرة",
    directionFr: "vers Sfax sud, Chaker et Boumarra",
    directionAr: "نحو صفاقس الجنوبية وشاكر وبومرة",
    terminal: "kasba",
    lines: ["13", "13A"],
    maxKm: 10,
    minutesPerKm: 3.2,
    centerExitMinutes: 4,
    reliability: "needsOfficialImport",
  },
  {
    id: "soukra",
    nameFr: "Soukra",
    nameAr: "سكرة",
    directionFr: "vers Soukra",
    directionAr: "نحو سكرة",
    terminal: "kasba",
    lines: ["15"],
    maxKm: 7,
    minutesPerKm: 3.1,
    centerExitMinutes: 4,
    reliability: "needsOfficialImport",
  },
  {
    id: "bouzaien",
    nameFr: "Bouzaien",
    nameAr: "البوزيان",
    directionFr: "vers Bouzaien",
    directionAr: "نحو البوزيان",
    terminal: "kasba",
    lines: ["23"],
    maxKm: 8,
    minutesPerKm: 3.2,
    centerExitMinutes: 4,
    reliability: "needsOfficialImport",
  },
  {
    id: "route-gremda",
    nameFr: "Route Gremda",
    nameAr: "طريق قرمدة",
    directionFr: "vers Gremda",
    directionAr: "نحو قرمدة",
    terminal: "babDjebli",
    lines: ["9"],
    maxKm: 9,
    minutesPerKm: 3.1,
    centerExitMinutes: 3,
    reliability: "ready",
  },
  {
    id: "teniour-kaid",
    nameFr: "Teniour / Kaid M'hammad",
    nameAr: "التنيور / قايد محمد",
    directionFr: "vers Teniour et Kaid M'hammad",
    directionAr: "نحو التنيور وقايد محمد",
    terminal: "babDjebli",
    lines: ["7", "8"],
    maxKm: 8,
    minutesPerKm: 3.2,
    centerExitMinutes: 3,
    reliability: "needsOfficialImport",
  },
  {
    id: "el-afrane-kassasat",
    nameFr: "El Afrane / Kassasat",
    nameAr: "الأفران / قصاصات",
    directionFr: "vers El Afrane et Kassasat",
    directionAr: "نحو الأفران وقصاصات",
    terminal: "babDjebli",
    lines: ["10", "11"],
    maxKm: 9,
    minutesPerKm: 3.3,
    centerExitMinutes: 3,
    reliability: "needsOfficialImport",
  },
  {
    id: "el-ain",
    nameFr: "El Ain",
    nameAr: "العين",
    directionFr: "vers El Ain",
    directionAr: "نحو العين",
    terminal: "babDjebli",
    lines: ["12"],
    maxKm: 9,
    minutesPerKm: 3.2,
    centerExitMinutes: 3,
    reliability: "needsOfficialImport",
  },
  {
    id: "port-peche",
    nameFr: "Port de peche",
    nameAr: "ميناء الصيد",
    directionFr: "vers port de peche",
    directionAr: "نحو ميناء الصيد",
    terminal: "babDjebli",
    lines: ["17"],
    maxKm: 5,
    minutesPerKm: 3,
    centerExitMinutes: 2,
    reliability: "needsOfficialImport",
  },
  {
    id: "sakiet-ezzit",
    nameFr: "Sakiet Ezzit",
    nameAr: "ساقية الزيت",
    directionFr: "vers Sakiet Ezzit et Tunis",
    directionAr: "نحو ساقية الزيت وتونس",
    terminal: "karia",
    lines: ["6", "6A", "30"],
    maxKm: 11,
    minutesPerKm: 3,
    centerExitMinutes: 4,
    reliability: "ready",
  },
  {
    id: "sidi-mansour",
    nameFr: "Sidi Mansour",
    nameAr: "سيدي منصور",
    directionFr: "vers Sidi Mansour et littoral est",
    directionAr: "نحو سيدي منصور والساحل الشرقي",
    terminal: "karia",
    lines: ["3"],
    maxKm: 12,
    minutesPerKm: 3.4,
    centerExitMinutes: 4,
    reliability: "needsOfficialImport",
  },
  {
    id: "saltnia",
    nameFr: "Saltnia",
    nameAr: "سلطنية",
    directionFr: "vers Saltnia",
    directionAr: "نحو سلطنية",
    terminal: "karia",
    lines: ["4"],
    maxKm: 12,
    minutesPerKm: 3.4,
    centerExitMinutes: 4,
    reliability: "needsOfficialImport",
  },
  {
    id: "sakiet-eddaier",
    nameFr: "Sakiet Eddaier",
    nameAr: "ساقية الدائر",
    directionFr: "vers Sakiet Eddaier",
    directionAr: "نحو ساقية الدائر",
    terminal: "karia",
    lines: ["5", "5A", "22"],
    maxKm: 10,
    minutesPerKm: 3.1,
    centerExitMinutes: 4,
    reliability: "ready",
  },
  {
    id: "ziadi",
    nameFr: "Ziadi",
    nameAr: "الزيادي",
    directionFr: "vers Ziadi",
    directionAr: "نحو الزيادي",
    terminal: "karia",
    lines: ["20"],
    maxKm: 8,
    minutesPerKm: 3.1,
    centerExitMinutes: 4,
    reliability: "needsOfficialImport",
  },
  {
    id: "monji-slim",
    nameFr: "Monji Slim",
    nameAr: "المنجي سليم",
    directionFr: "vers Monji Slim",
    directionAr: "نحو المنجي سليم",
    terminal: "karia",
    lines: ["30"],
    maxKm: 8,
    minutesPerKm: 3.1,
    centerExitMinutes: 4,
    reliability: "needsOfficialImport",
  },
  {
    id: "facultes-technopole",
    nameFr: "Facultes / Technopole",
    nameAr: "الكليات / التكنوبول",
    directionFr: "vers campus et technopole",
    directionAr: "نحو الكليات والتكنوبول",
    terminal: "babDjebli",
    lines: ["24", "25"],
    maxKm: 9,
    minutesPerKm: 3.5,
    centerExitMinutes: 5,
    reliability: "ready",
  },
  {
    id: "aeroport",
    nameFr: "Aeroport",
    nameAr: "المطار",
    directionFr: "vers Aeroport Sfax-Thyna",
    directionAr: "نحو مطار صفاقس طينة",
    terminal: "kasba",
    lines: ["14", "14A", "14B"],
    maxKm: 8,
    minutesPerKm: 3.6,
    centerExitMinutes: 4,
    reliability: "ready",
  },
];

const schedules: Record<string, { first: string; last: string; frequency: number }> = {
  "1": { first: "05:35", last: "21:40", frequency: 15 },
  "2": { first: "05:40", last: "21:30", frequency: 16 },
  "3": { first: "05:50", last: "20:50", frequency: 24 },
  "4": { first: "05:45", last: "21:00", frequency: 22 },
  "5": { first: "05:35", last: "21:35", frequency: 15 },
  "5A": { first: "06:00", last: "20:45", frequency: 28 },
  "6": { first: "05:30", last: "21:45", frequency: 12 },
  "6A": { first: "05:55", last: "21:10", frequency: 22 },
  "7": { first: "05:45", last: "21:20", frequency: 18 },
  "8": { first: "05:45", last: "21:00", frequency: 19 },
  "9": { first: "05:30", last: "21:50", frequency: 16 },
  "10": { first: "05:50", last: "20:50", frequency: 24 },
  "11": { first: "06:00", last: "20:30", frequency: 25 },
  "12": { first: "05:50", last: "21:00", frequency: 23 },
  "13": { first: "05:40", last: "21:25", frequency: 20 },
  "13A": { first: "06:05", last: "20:40", frequency: 28 },
  "14": { first: "06:00", last: "20:40", frequency: 24 },
  "14A": { first: "06:10", last: "20:20", frequency: 30 },
  "14B": { first: "06:15", last: "20:00", frequency: 34 },
  "15": { first: "05:50", last: "21:15", frequency: 20 },
  "16": { first: "05:45", last: "21:25", frequency: 18 },
  "16A": { first: "05:55", last: "21:00", frequency: 24 },
  "16B": { first: "06:05", last: "20:55", frequency: 26 },
  "16D": { first: "06:05", last: "20:45", frequency: 30 },
  "17": { first: "05:55", last: "20:30", frequency: 22 },
  "18": { first: "05:35", last: "21:25", frequency: 18 },
  "18A": { first: "05:55", last: "20:50", frequency: 28 },
  "20": { first: "06:00", last: "20:40", frequency: 25 },
  "22": { first: "06:10", last: "20:20", frequency: 28 },
  "23": { first: "05:50", last: "21:05", frequency: 22 },
  "24": { first: "06:10", last: "19:40", frequency: 20 },
  "25": { first: "06:15", last: "19:50", frequency: 24 },
  "30": { first: "05:55", last: "21:10", frequency: 22 },
};

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

function minutesFromTime(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function timeFromMinutes(value: number) {
  const minutes = ((value % 1440) + 1440) % 1440;
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}

function kmOptions(maxKm: number) {
  const values: number[] = [];
  for (let km = 0; km <= maxKm; km += 0.5) {
    values.push(Number(km.toFixed(1)));
  }
  return values;
}

function arrivalOffset(corridor: Corridor, km: number) {
  return Math.round(corridor.centerExitMinutes + km * corridor.minutesPerKm);
}

function nextDepartures(lineCode: string, count = 3) {
  const schedule = schedules[lineCode];
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const first = minutesFromTime(schedule.first);
  const last = minutesFromTime(schedule.last);
  let next = first;

  if (nowMinutes > first) {
    next = first + Math.ceil((nowMinutes - first) / schedule.frequency) * schedule.frequency;
  }

  if (next > last) {
    next = first + 1440;
  }

  return Array.from({ length: count }, (_, index) => next + index * schedule.frequency);
}

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
      eta: departure + offset - (new Date().getHours() * 60 + new Date().getMinutes()),
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

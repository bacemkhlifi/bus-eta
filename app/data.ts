export type Locale = "fr" | "ar";
export type TerminalKey = "kasba" | "babDjebli" | "karia";
export type Reliability = "verifiedPilot" | "estimatedPilot";

export type CatalogLine = {
  code: string;
  nameFr: string;
  nameAr: string;
  terminal: TerminalKey;
  terminalFr: string;
  terminalAr: string;
};

export type Corridor = {
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
  reliability: Reliability;
};

export type LineSchedule = {
  first: string;
  last: string;
  frequency: number;
};

export const terminalLabels: Record<TerminalKey, { fr: string; ar: string }> = {
  kasba: { fr: "Gare El Kasba", ar: "محطة القصبة" },
  babDjebli: { fr: "Gare Beb Djebli", ar: "محطة باب الجبلي" },
  karia: { fr: "Gare El Karia", ar: "محطة القارية" },
};

export const catalogLines: CatalogLine[] = [
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

export const corridors: Corridor[] = [
  corridor("el-bousten-hached", "El Bousten / Hached", "البوستن / هاشد", "vers El Bousten et Hached", "نحو البوستن وهاشد", "kasba", ["1", "2"], 7, 3, 3, "estimatedPilot"),
  corridor("route-gabes-thyna", "Route Gabes / Thyna", "طريق قابس / طينة", "vers Thyna, Route Gabes et Gabes", "نحو طينة وطريق قابس وقابس", "kasba", ["16", "16A", "16B", "16D"], 12, 3.4, 4, "verifiedPilot"),
  corridor("mharza", "M'harza", "المحرزة", "vers M'harza et Sfax ouest", "نحو المحرزة وصفاقس الغربية", "kasba", ["18", "18A"], 8, 3.2, 5, "verifiedPilot"),
  corridor("chaker-boumarra", "Chaker / Boumarra", "شاكر / بومرة", "vers Sfax sud, Chaker et Boumarra", "نحو صفاقس الجنوبية وشاكر وبومرة", "kasba", ["13", "13A"], 10, 3.2, 4, "estimatedPilot"),
  corridor("soukra", "Soukra", "سكرة", "vers Soukra", "نحو سكرة", "kasba", ["15"], 7, 3.1, 4, "estimatedPilot"),
  corridor("bouzaien", "Bouzaien", "البوزيان", "vers Bouzaien", "نحو البوزيان", "kasba", ["23"], 8, 3.2, 4, "estimatedPilot"),
  corridor("route-gremda", "Route Gremda", "طريق قرمدة", "vers Gremda", "نحو قرمدة", "babDjebli", ["9"], 9, 3.1, 3, "verifiedPilot"),
  corridor("teniour-kaid", "Teniour / Kaid M'hammad", "التنيور / قايد محمد", "vers Teniour et Kaid M'hammad", "نحو التنيور وقايد محمد", "babDjebli", ["7", "8"], 8, 3.2, 3, "estimatedPilot"),
  corridor("el-afrane-kassasat", "El Afrane / Kassasat", "الأفران / قصاصات", "vers El Afrane et Kassasat", "نحو الأفران وقصاصات", "babDjebli", ["10", "11"], 9, 3.3, 3, "estimatedPilot"),
  corridor("el-ain", "El Ain", "العين", "vers El Ain", "نحو العين", "babDjebli", ["12"], 9, 3.2, 3, "estimatedPilot"),
  corridor("port-peche", "Port de peche", "ميناء الصيد", "vers port de peche", "نحو ميناء الصيد", "babDjebli", ["17"], 5, 3, 2, "estimatedPilot"),
  corridor("sakiet-ezzit", "Sakiet Ezzit", "ساقية الزيت", "vers Sakiet Ezzit et Tunis", "نحو ساقية الزيت وتونس", "karia", ["6", "6A", "30"], 11, 3, 4, "verifiedPilot"),
  corridor("sidi-mansour", "Sidi Mansour", "سيدي منصور", "vers Sidi Mansour et littoral est", "نحو سيدي منصور والساحل الشرقي", "karia", ["3"], 12, 3.4, 4, "estimatedPilot"),
  corridor("saltnia", "Saltnia", "سلطنية", "vers Saltnia", "نحو سلطنية", "karia", ["4"], 12, 3.4, 4, "estimatedPilot"),
  corridor("sakiet-eddaier", "Sakiet Eddaier", "ساقية الدائر", "vers Sakiet Eddaier", "نحو ساقية الدائر", "karia", ["5", "5A", "22"], 10, 3.1, 4, "verifiedPilot"),
  corridor("ziadi", "Ziadi", "الزيادي", "vers Ziadi", "نحو الزيادي", "karia", ["20"], 8, 3.1, 4, "estimatedPilot"),
  corridor("monji-slim", "Monji Slim", "المنجي سليم", "vers Monji Slim", "نحو المنجي سليم", "karia", ["30"], 8, 3.1, 4, "estimatedPilot"),
  corridor("facultes-technopole", "Facultes / Technopole", "الكليات / التكنوبول", "vers campus et technopole", "نحو الكليات والتكنوبول", "babDjebli", ["24", "25"], 9, 3.5, 5, "verifiedPilot"),
  corridor("aeroport", "Aeroport", "المطار", "vers Aeroport Sfax-Thyna", "نحو مطار صفاقس طينة", "kasba", ["14", "14A", "14B"], 8, 3.6, 4, "verifiedPilot"),
];

export const schedules: Record<string, LineSchedule> = {
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

function corridor(
  id: string,
  nameFr: string,
  nameAr: string,
  directionFr: string,
  directionAr: string,
  terminal: TerminalKey,
  lines: string[],
  maxKm: number,
  minutesPerKm: number,
  centerExitMinutes: number,
  reliability: Reliability,
): Corridor {
  return { id, nameFr, nameAr, directionFr, directionAr, terminal, lines, maxKm, minutesPerKm, centerExitMinutes, reliability };
}

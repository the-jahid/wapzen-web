// Which Google Translate language(s) a visitor's country gets. The first one is
// the default; the others are offered when the browser already lists one of them.
// A country that isn't here, or that starts with "en", stays in English.

const oneLanguage: Record<string, string> = {
  am: "ET", ar: "AE BH DZ EG IQ JO KW LB LY MA MR OM PS QA SA SD SY TN YE",
  az: "AZ", bg: "BG", bn: "BD", bs: "BA", cs: "CZ", da: "DK", de: "AT DE LI",
  dv: "MV", el: "GR", es: "AR BO CL CO CR CU DO EC ES GQ GT HN MX NI PA PE PR PY SV UY VE",
  et: "EE", fa: "IR", fi: "FI", fr: "BF BI BJ CD CF CG CI DJ FR GA GN KM MC ML NE SN TD TG",
  hr: "HR", ht: "HT", hu: "HU", hy: "AM", id: "ID", is: "IS", it: "IT SM VA",
  ja: "JP", ka: "GE", km: "KH", ko: "KP KR", lo: "LA", lt: "LT", lv: "LV", mg: "MG",
  mk: "MK", mn: "MN", ms: "BN MY", mt: "MT", my: "MM", ne: "NP", nl: "NL SR", no: "NO",
  pl: "PL", pt: "AO BR CV GW MZ PT ST TL", ro: "MD RO", ru: "BY RU", rw: "RW", sk: "SK",
  sl: "SI", so: "SO", sq: "AL XK", sr: "ME RS", sv: "SE", sw: "TZ", tg: "TJ", th: "TH",
  tk: "TM", tl: "PH", tr: "TR", uk: "UA", ur: "PK", uz: "UZ", vi: "VN", "zh-CN": "CN",
  "zh-TW": "HK MO TW",
};

const severalLanguages: Record<string, string[]> = {
  AF: ["fa", "ps"],
  BE: ["nl", "fr", "de"],
  CA: ["en", "fr"],
  CH: ["de", "fr", "it"],
  CY: ["el", "tr"],
  IL: ["iw", "ar"],
  IN: ["hi", "bn", "ta", "te", "mr", "gu", "kn", "ml", "pa", "ur"],
  KE: ["en", "sw"],
  KG: ["ky", "ru"],
  KZ: ["kk", "ru"],
  LK: ["si", "ta"],
  LU: ["fr", "de"],
  NG: ["en", "ha", "yo", "ig"],
  SG: ["en", "zh-CN", "ms", "ta"],
  ZA: ["en", "af", "zu", "xh"],
};

export function languagesForCountry(country: string): string[] {
  if (severalLanguages[country]) return severalLanguages[country];
  for (const [language, countries] of Object.entries(oneLanguage)) {
    if (countries.split(" ").includes(country)) return [language];
  }
  return [];
}

// Google's codes for Hebrew and Filipino are older than the browser's.
const browserCode: Record<string, string> = { iw: "he", tl: "fil" };

function sameLanguage(browserLanguage: string, language: string): boolean {
  const browser = browserLanguage.toLowerCase();
  const code = (browserCode[language] ?? language).toLowerCase();
  if (code.startsWith("zh-")) return browser === code;
  return browser.split("-")[0] === code;
}

// Inside the country's languages the browser's own preference wins, so a
// French browser in Belgium gets French rather than the default Dutch.
export function pickLanguage(languages: string[], browserLanguages: readonly string[]): string | undefined {
  for (const browser of browserLanguages) {
    const match = languages.find((language) => sameLanguage(browser, language));
    if (match) return match;
  }
  return languages[0];
}

// A language's name in that language: "বাংলা" for bn, "Deutsch" for de.
export function languageName(language: string): string {
  const code = browserCode[language] ?? language;
  try {
    const name = new Intl.DisplayNames([code], { type: "language" }).of(code) ?? language;
    return name.charAt(0).toLocaleUpperCase(code) + name.slice(1);
  } catch {
    return language;
  }
}

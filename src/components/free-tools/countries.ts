import { getCountries, getCountryCallingCode, getExampleNumber } from "libphonenumber-js/max";
import examples from "libphonenumber-js/mobile/examples";

// Server-side country table for the country code finder. Built from
// libphonenumber's metadata so codes, shared codes (+1, +7, +44) and example
// mobile numbers stay correct; only the finished strings reach the client.

export type CountryInfo = {
  iso: string;
  name: string;
  /** Calling code without "+", e.g. "880". */
  code: string;
  /** Example mobile number as dialled locally, e.g. "01812-345678". */
  local: string;
  /** The same number in international format, e.g. "+880 1812 345678". */
  intl: string;
  /** Extra search terms: common short names and alternative spellings. */
  aliases: string;
};

const aliases: Record<string, string> = {
  US: "usa america united states",
  GB: "uk england britain great britain scotland wales northern ireland",
  AE: "uae emirates dubai abu dhabi",
  SA: "ksa saudi",
  CD: "drc congo kinshasa",
  CG: "congo brazzaville",
  CI: "ivory coast cote divoire",
  KR: "korea south korea",
  KP: "korea north korea",
  MM: "burma myanmar",
  CZ: "czech republic czechia",
  NL: "holland netherlands",
  RU: "russia russian federation",
  TR: "turkey turkiye",
  PS: "palestine",
  VA: "vatican holy see",
};

export function listCountries(): CountryInfo[] {
  const names = new Intl.DisplayNames(["en"], { type: "region" });
  return getCountries()
    .map((iso) => {
      const example = getExampleNumber(iso, examples);
      return {
        iso,
        name: names.of(iso) ?? iso,
        code: getCountryCallingCode(iso),
        local: example?.formatNational() ?? "",
        intl: example?.formatInternational() ?? "",
        aliases: aliases[iso] ?? "",
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name, "en"));
}

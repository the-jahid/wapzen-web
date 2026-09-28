import { parsePhoneNumberFromString, validatePhoneNumberLength, type CountryCode, type NumberType } from "libphonenumber-js/max";
import type { CountryInfo } from "./countries";

// Shared by the free tools that take a number as dialled locally (country code
// finder, send without saving): turns it into the international form WhatsApp needs.

export type Analysis =
  | { state: "empty" }
  | { state: "error"; message: string }
  | { state: "ok"; country?: CountryInfo; detected: boolean; callingCode: string; intl: string; digits: string; valid: boolean; type?: NumberType };

export const typeLabels: Partial<Record<NonNullable<NumberType>, string>> = {
  MOBILE: "Mobile number",
  FIXED_LINE_OR_MOBILE: "Mobile or landline number",
  FIXED_LINE: "Landline number",
  VOIP: "Internet (VoIP) number",
  TOLL_FREE: "Toll-free number",
};

/** Works out the WhatsApp (international) form of what was typed, local or international. */
export function analysePhone(raw: string, iso: string, byIso: Map<string, CountryInfo>): Analysis {
  const value = raw.trim();
  if (!value) return { state: "empty" };
  if (/[^\d\s()+.\-]/.test(value)) return { state: "error", message: "Use digits only. Spaces, dashes, brackets and + are fine." };

  const international = value.startsWith("+") || value.startsWith("00");
  const text = value.startsWith("00") ? `+${value.slice(2)}` : value;
  if (!international && !iso) return { state: "error", message: "Choose the country above, or type the number starting with + and its country code." };

  const selected = international ? undefined : byIso.get(iso);
  const place = selected ? `a ${selected.name} number` : "an international number";
  switch (validatePhoneNumberLength(text, international ? undefined : (iso as CountryCode))) {
    case "NOT_A_NUMBER": return { state: "error", message: "That doesn't look like a phone number yet. Keep typing." };
    case "INVALID_COUNTRY": return { state: "error", message: "No country uses that code. Check the digits right after the +." };
    case "TOO_SHORT": return { state: "error", message: `That's too short for ${place}. Check you have all the digits.` };
    case "TOO_LONG": return { state: "error", message: `That's too long for ${place}. Check for extra digits.` };
    case "INVALID_LENGTH": return { state: "error", message: `That's the wrong number of digits for ${place}.` };
  }

  const phone = parsePhoneNumberFromString(text, international ? undefined : (iso as CountryCode));
  if (!phone) return { state: "error", message: "That doesn't look like a phone number. Check the digits." };
  return {
    state: "ok",
    country: phone.country ? byIso.get(phone.country) : undefined,
    detected: international,
    callingCode: phone.countryCallingCode,
    intl: phone.formatInternational(),
    digits: phone.number.slice(1),
    valid: phone.isValid(),
    type: phone.getType(),
  };
}

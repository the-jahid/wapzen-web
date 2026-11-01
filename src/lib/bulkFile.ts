import { parsePhoneNumberFromString, type CountryCode } from "libphonenumber-js/min";
import { variableKey } from "./bulkMessages";

// Reads the contact list a bulk message goes to. Everything happens in the
// browser: the server only receives numbers and column values, never the file.
// Excel (.xlsx/.xls), OpenDocument (.ods), CSV and plain text all go through
// SheetJS, which is loaded only when somebody picks a file.

export const ACCEPTED_FILES = ".xlsx,.xls,.ods,.csv,.tsv,.txt";

export type SheetData = {
  fileName: string;
  headers: string[];
  rows: string[][];
  // Whether row one held column names. Without them the columns are named
  // "Column 1", "Column 2", ….
  hadHeader: boolean;
};

export type Recipient = { phone: string; variables: Record<string, string> };

export type RecipientList = {
  recipients: Recipient[];
  invalid: { row: number; value: string }[];
  duplicates: number;
};

const PHONE_HEADER = /phone|mobile|whats ?app|number|cell|contact|tel|msisdn|n[uú]mero|telefone|tel[eé]fono|celular|handy/i;

function cellText(value: unknown): string {
  if (value === null || value === undefined) return "";
  // A number stored as a number (no leading zero, no "+") reads back exactly
  // up to 15 digits, which covers every phone number.
  if (typeof value === "number") return String(value);
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).trim();
}

export async function readSheet(file: File): Promise<SheetData> {
  const XLSX = await import("xlsx");
  const buffer = await file.arrayBuffer();
  const isText = /\.(csv|tsv|txt)$/i.test(file.name);
  // Text files are read as UTF-8 so names in any script survive; SheetJS
  // would otherwise guess a legacy code page.
  const workbook = isText
    ? XLSX.read(new TextDecoder("utf-8").decode(buffer), { type: "string", raw: true })
    : XLSX.read(buffer, { type: "array", cellDates: true });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  if (!sheet) throw new Error("The file has no sheets.");
  const grid = XLSX.utils
    .sheet_to_json<unknown[]>(sheet, { header: 1, raw: true, defval: "", blankrows: false })
    .map((row) => row.map(cellText))
    .filter((row) => row.some((cell) => cell !== ""));
  if (!grid.length) throw new Error("The file is empty.");

  const width = Math.max(...grid.map((row) => row.length));
  const padded = grid.map((row) => Array.from({ length: width }, (_, i) => row[i] ?? ""));
  // Row one is a header unless it already holds a phone number.
  const hadHeader = !padded[0].some((cell) => looksLikePhone(cell));
  const headers = hadHeader
    ? uniqueHeaders(padded[0].map((cell, i) => cell || `Column ${i + 1}`))
    : padded[0].map((_, i) => `Column ${i + 1}`);
  return { fileName: file.name, headers, rows: hadHeader ? padded.slice(1) : padded, hadHeader };
}

function uniqueHeaders(headers: string[]) {
  const seen = new Map<string, number>();
  return headers.map((header) => {
    const key = variableKey(header);
    const count = (seen.get(key) ?? 0) + 1;
    seen.set(key, count);
    return count === 1 ? header : `${header} ${count}`;
  });
}

function looksLikePhone(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15 && /^[+\d\s().-]+$/.test(value);
}

// The column most likely to hold the numbers: one whose name says so, else
// the one with the most phone-shaped values.
export function guessPhoneColumn(sheet: SheetData): number {
  const named = sheet.headers.findIndex((header) => PHONE_HEADER.test(header));
  if (sheet.hadHeader && named >= 0) return named;
  const sample = sheet.rows.slice(0, 50);
  let best = 0;
  let bestScore = -1;
  sheet.headers.forEach((_, column) => {
    const score = sample.filter((row) => looksLikePhone(row[column])).length;
    if (score > bestScore) {
      best = column;
      bestScore = score;
    }
  });
  return best;
}

// A number as WhatsApp needs it (E.164), or null. Numbers written without a
// country code are read as numbers of `country`; a long number with no "+"
// that doesn't fit there is tried as already carrying its country code, which
// is how most exported contact lists write them.
export function toE164(raw: string, country?: CountryCode): string | null {
  let value = raw.trim().replace(/[^\d+]/g, "");
  if (value.startsWith("00")) value = `+${value.slice(2)}`;
  if (!value.replace("+", "")) return null;
  if (value.startsWith("+")) return possible(value);
  if (country) {
    const local = parsePhoneNumberFromString(value, country);
    if (local?.isPossible()) return local.number;
  }
  return value.length >= 10 ? possible(`+${value}`) : null;
}

function possible(value: string) {
  const parsed = parsePhoneNumberFromString(value);
  return parsed?.isPossible() ? parsed.number : null;
}

export function buildRecipients(sheet: SheetData, phoneColumn: number, country?: CountryCode): RecipientList {
  const recipients: Recipient[] = [];
  const invalid: RecipientList["invalid"] = [];
  const seen = new Set<string>();
  let duplicates = 0;
  sheet.rows.forEach((row, index) => {
    const raw = row[phoneColumn] ?? "";
    const phone = toE164(raw, country);
    if (!phone) {
      // The spreadsheet's own row number, counting the header.
      invalid.push({ row: index + (sheet.hadHeader ? 2 : 1), value: raw });
      return;
    }
    if (seen.has(phone)) {
      duplicates++;
      return;
    }
    seen.add(phone);
    const variables: Record<string, string> = {};
    sheet.headers.forEach((header, column) => {
      if (column !== phoneColumn) variables[variableKey(header)] = row[column] ?? "";
    });
    recipients.push({ phone, variables });
  });
  return { recipients, invalid, duplicates };
}

// The country of an E.164 number, for reading local numbers in a file the
// same way as the number they're sent from.
export function countryOf(e164?: string | null): CountryCode | undefined {
  return e164 ? parsePhoneNumberFromString(e164)?.country : undefined;
}

export function sampleCsv() {
  return "phone,name,city\n+8801711000000,Ayesha,Dhaka\n+5511912345678,Lucas,São Paulo\n";
}

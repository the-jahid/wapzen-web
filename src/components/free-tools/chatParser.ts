// Parses a WhatsApp "Export chat" file and works out the analyzer's stats.
// Everything runs in the browser; the chat never leaves the visitor's device.
//
// Export formats seen in the wild (the separators and order follow the
// phone's locale, so all of them vary):
//   Android: 12/31/23, 9:15 PM - Ana: text        31.12.23, 21:15 - Ana: text
//   iPhone:  [31/12/2023, 21:15:42] Ana: text      [12/31/23, 9:15:42 PM] Ana: text
// Lines without a date continue the message above. Lines with a date but no
// "Name: " are system notices (encryption notice, "Ana added Ben") and skipped.

export type Message = { at: Date; author: string; text: string };

const LINE = /^\[?(\d{1,4})[/.\-](\d{1,2})[/.\-](\d{1,4}),?\s+(\d{1,2})[:.](\d{2})(?:[:.](\d{2}))?\s*([ap]\.?\s?m\.?)?\]?\s*(?:[-–]\s+)?(.*)$/i;

type Raw = { a: number; b: number; c: number; h: number; m: number; s: number; ampm: string; rest: string };

function clean(line: string) {
  return line.replace(/[‎‏‪-‮]/g, "").replace(/[  ]/g, " ");
}

/** Which of the three date numbers are day, month and year. */
function dateOrder(rows: Raw[]): "dmy" | "mdy" | "ymd" {
  if (rows.some((r) => r.a > 31)) return "ymd";
  if (rows.some((r) => r.a > 12)) return "dmy";
  if (rows.some((r) => r.b > 12)) return "mdy";
  // Never decided by the data: US phones (12-hour clock) export month first.
  return rows.some((r) => r.ampm) ? "mdy" : "dmy";
}

export function parseChat(content: string): Message[] {
  const rows: Raw[] = [];
  let last: Raw | null = null;
  for (const rawLine of content.split(/\r?\n/)) {
    const line = clean(rawLine);
    const m = LINE.exec(line);
    if (m && m[8] !== undefined) {
      last = { a: +m[1], b: +m[2], c: +m[3], h: +m[4], m: +m[5], s: m[6] ? +m[6] : 0, ampm: (m[7] ?? "").replace(/[.\s]/g, "").toLowerCase(), rest: m[8] };
      rows.push(last);
    } else if (last) {
      last.rest += `\n${line}`;
    }
  }
  const order = dateOrder(rows);
  const messages: Message[] = [];
  for (const r of rows) {
    const colon = r.rest.indexOf(": ");
    // A notice has no "Name: ", and a name is never this long.
    if (colon <= 0 || colon > 60) continue;
    const author = r.rest.slice(0, colon).trim();
    const text = r.rest.slice(colon + 2);
    const [day, month, year] = order === "dmy" ? [r.a, r.b, r.c] : order === "mdy" ? [r.b, r.a, r.c] : [r.c, r.b, r.a];
    let hour = r.h;
    if (r.ampm === "pm" && hour < 12) hour += 12;
    if (r.ampm === "am" && hour === 12) hour = 0;
    const at = new Date(year < 100 ? 2000 + year : year, month - 1, day, hour, r.m, r.s);
    if (Number.isNaN(at.getTime()) || month < 1 || month > 12 || day < 1 || day > 31) continue;
    messages.push({ at, author, text });
  }
  return messages;
}

const MEDIA = /^<?\s*(?:media omitted|<?attached:|image omitted|video omitted|audio omitted|sticker omitted|gif omitted|document omitted|contact card omitted|.+\.(?:jpg|jpeg|png|webp|mp4|opus|pdf) \(file attached\))/i;
const DELETED = /^(?:this message was deleted|you deleted this message)\.?$/i;
const EDITED = /\s*<this message was edited>\s*$/i;
const LINK = /https?:\/\/\S+/gi;
const EMOJI = /\p{Extended_Pictographic}/gu;
const WORD = /[\p{L}\p{N}'’]+/gu;

// Common English words that would otherwise fill the top-words list.
const STOP = new Set("the and for you that this with are was have not but all can just what your will get from out one they there about how when like its it's i'm im our who has had more would been were them then than also into only know see well yes yeah ok okay haha hahaha lol ill i'll dont don't did can't cant too got here very much now some any she her him his hey sure going want need yes thanks thank please good will".split(" "));

export type PersonStats = { name: string; messages: number; words: number; media: number; emojis: number; links: number; starts: number; replyMinutes: number | null };

export type ChatStats = {
  messages: number;
  words: number;
  media: number;
  links: number;
  emojis: number;
  deleted: number;
  first: Date;
  last: Date;
  activeDays: number;
  longestStreak: number;
  busiestDay: { date: Date; messages: number };
  people: PersonStats[];
  hours: number[];
  weekdays: number[];
  months: Array<{ key: string; label: string; messages: number }>;
  topWords: Array<{ word: string; count: number }>;
  topEmojis: Array<{ emoji: string; count: number }>;
};

// A message after this much silence starts a new conversation.
const NEW_CONVERSATION_MS = 6 * 60 * 60 * 1000;
// Longer gaps aren't replies, just the next time someone wrote.
const MAX_REPLY_MS = 12 * 60 * 60 * 1000;

const dayKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

function median(values: number[]) {
  if (!values.length) return null;
  const sorted = [...values].sort((x, y) => x - y);
  const mid = sorted.length >> 1;
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function top<T extends string>(counts: Map<T, number>, n: number) {
  return [...counts.entries()].sort((x, y) => y[1] - x[1]).slice(0, n);
}

export function chatStats(messages: Message[]): ChatStats | null {
  if (!messages.length) return null;
  const people = new Map<string, PersonStats & { replies: number[] }>();
  const hours = Array<number>(24).fill(0);
  const weekdays = Array<number>(7).fill(0);
  const months = new Map<string, number>();
  const days = new Map<string, number>();
  const words = new Map<string, number>();
  const emojis = new Map<string, number>();
  let totalWords = 0, media = 0, links = 0, emojiCount = 0, deleted = 0;

  messages.forEach((msg, i) => {
    const person = people.get(msg.author) ?? { name: msg.author, messages: 0, words: 0, media: 0, emojis: 0, links: 0, starts: 0, replyMinutes: null, replies: [] };
    people.set(msg.author, person);
    person.messages += 1;
    const prev = messages[i - 1];
    const gap = prev ? msg.at.getTime() - prev.at.getTime() : Infinity;
    if (gap > NEW_CONVERSATION_MS) person.starts += 1;
    else if (prev && prev.author !== msg.author && gap >= 0 && gap <= MAX_REPLY_MS) person.replies.push(gap / 60_000);

    hours[msg.at.getHours()] += 1;
    weekdays[(msg.at.getDay() + 6) % 7] += 1;
    const month = `${msg.at.getFullYear()}-${String(msg.at.getMonth() + 1).padStart(2, "0")}`;
    months.set(month, (months.get(month) ?? 0) + 1);
    const day = dayKey(msg.at);
    days.set(day, (days.get(day) ?? 0) + 1);

    const text = msg.text.replace(EDITED, "").trim();
    if (MEDIA.test(text)) { media += 1; person.media += 1; return; }
    if (DELETED.test(text)) { deleted += 1; return; }
    const linkCount = text.match(LINK)?.length ?? 0;
    links += linkCount;
    person.links += linkCount;
    const withoutLinks = text.replace(LINK, " ");
    for (const e of withoutLinks.match(EMOJI) ?? []) {
      emojis.set(e, (emojis.get(e) ?? 0) + 1);
      emojiCount += 1;
      person.emojis += 1;
    }
    const found = withoutLinks.match(WORD) ?? [];
    totalWords += found.length;
    person.words += found.length;
    for (const w of found) {
      const word = w.toLowerCase().replace(/’/g, "'");
      if (word.length < 3 || STOP.has(word) || /^\d+$/.test(word)) continue;
      words.set(word, (words.get(word) ?? 0) + 1);
    }
  });

  const sortedDays = [...days.keys()].sort();
  let longestStreak = 0, streak = 0, prevDay: Date | null = null;
  for (const key of sortedDays) {
    const [y, m, d] = key.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    streak = prevDay && Math.round((date.getTime() - prevDay.getTime()) / 86_400_000) === 1 ? streak + 1 : 1;
    longestStreak = Math.max(longestStreak, streak);
    prevDay = date;
  }
  const [busyKey, busyCount] = top(days, 1)[0];
  const [by, bm, bd] = busyKey.split("-").map(Number);

  const monthFormat = new Intl.DateTimeFormat(undefined, { month: "short", year: "2-digit" });
  const monthKeys = [...months.keys()].sort();
  // Every month from the first to the last, so quiet months show as gaps.
  const allMonths: ChatStats["months"] = [];
  if (monthKeys.length) {
    const [fy, fm] = monthKeys[0].split("-").map(Number);
    const [ly, lm] = monthKeys[monthKeys.length - 1].split("-").map(Number);
    for (let y = fy, m = fm; y < ly || (y === ly && m <= lm); m === 12 ? (y++, m = 1) : m++) {
      const key = `${y}-${String(m).padStart(2, "0")}`;
      allMonths.push({ key, label: monthFormat.format(new Date(y, m - 1, 1)), messages: months.get(key) ?? 0 });
    }
  }

  return {
    messages: messages.length,
    words: totalWords,
    media,
    links,
    emojis: emojiCount,
    deleted,
    first: messages[0].at,
    last: messages[messages.length - 1].at,
    activeDays: days.size,
    longestStreak,
    busiestDay: { date: new Date(by, bm - 1, bd), messages: busyCount },
    people: [...people.values()].map(({ replies, ...p }) => ({ ...p, replyMinutes: median(replies) })).sort((x, y) => y.messages - x.messages),
    hours,
    weekdays,
    months: allMonths,
    topWords: top(words, 20).map(([word, count]) => ({ word, count })),
    topEmojis: top(emojis, 12).map(([emoji, count]) => ({ emoji, count })),
  };
}

/** Reads the chat text out of an iPhone export .zip (or any zip holding one .txt). */
export async function textFromZip(buffer: ArrayBuffer): Promise<string> {
  const view = new DataView(buffer);
  // End of central directory: the last 0x06054b50 within the final 64 KB.
  let eocd = -1;
  for (let i = buffer.byteLength - 22; i >= Math.max(0, buffer.byteLength - 65_557); i--) {
    if (view.getUint32(i, true) === 0x06054b50) { eocd = i; break; }
  }
  if (eocd < 0) throw new Error("This isn't a valid .zip file.");
  const entries = view.getUint16(eocd + 10, true);
  let p = view.getUint32(eocd + 16, true);
  type Entry = { name: string; method: number; size: number; offset: number };
  const files: Entry[] = [];
  for (let i = 0; i < entries && view.getUint32(p, true) === 0x02014b50; i++) {
    const nameLen = view.getUint16(p + 28, true);
    const extraLen = view.getUint16(p + 30, true);
    const commentLen = view.getUint16(p + 32, true);
    files.push({
      name: new TextDecoder().decode(new Uint8Array(buffer, p + 46, nameLen)),
      method: view.getUint16(p + 10, true),
      size: view.getUint32(p + 20, true),
      offset: view.getUint32(p + 42, true),
    });
    p += 46 + nameLen + extraLen + commentLen;
  }
  const txt = files.filter((f) => /\.txt$/i.test(f.name) && !f.name.startsWith("__MACOSX"));
  const file = txt.find((f) => /_chat\.txt$/i.test(f.name)) ?? txt[0];
  if (!file) throw new Error("No chat .txt file inside this .zip.");
  const local = file.offset;
  const start = local + 30 + view.getUint16(local + 26, true) + view.getUint16(local + 28, true);
  const data = new Uint8Array(buffer, start, file.size);
  if (file.method === 0) return new TextDecoder().decode(data);
  if (file.method !== 8) throw new Error("This .zip uses a compression this tool can't read. Unzip it and pick the .txt file.");
  const stream = new Blob([data]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
  return new Response(stream).text();
}

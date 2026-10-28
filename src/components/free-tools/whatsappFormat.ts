// WhatsApp's formatting markers and Unicode "fancy fonts", for the text
// formatter tool. The parser mirrors what WhatsApp renders, so the preview
// shows what the recipient will see; the editing helpers return the new text
// and selection for the textarea.

export type InlineMark = "bold" | "italic" | "strike" | "code" | "mono";
export type Inline = string | { mark: InlineMark; children: Inline[] };
export type LineKind = "text" | "quote" | "bullet" | "number";
export type Line = { kind: LineKind; marker: string; content: Inline[] };

/** Characters the tool accepts; long enough for any message, short enough to keep every keystroke instant. */
export const MAX_TEXT = 5000;

export const wrapMarkers = { bold: "*", italic: "_", strike: "~", code: "`", mono: "```" } as const;
export type WrapMark = keyof typeof wrapMarkers;

// WhatsApp formats only when a marker touches the text it wraps and doesn't
// touch a letter or digit outside it: "*sale*" is bold, "* sale *" and
// "2*3*4" aren't. Bold, italic and strikethrough stay within a line; three
// backticks can span lines. Earlier rules win a tie at the same position.
const rules: Array<[InlineMark, RegExp]> = [
  ["mono", /```([\s\S]+?)```/gu],
  ["code", /`([^`\n]+)`/gu],
  ["bold", /(?<![\p{L}\p{N}*])\*(?!\s)([^*\n]+?)(?<!\s)\*(?![\p{L}\p{N}*])/gu],
  ["italic", /(?<![\p{L}\p{N}_])_(?!\s)([^_\n]+?)(?<!\s)_(?![\p{L}\p{N}_])/gu],
  ["strike", /(?<![\p{L}\p{N}~])~(?!\s)([^~\n]+?)(?<!\s)~(?![\p{L}\p{N}~])/gu],
];

/** Splits text into plain strings and formatted runs; marks other than code nest. */
export function parseInline(text: string): Inline[] {
  const out: Inline[] = [];
  let pos = 0;
  while (pos < text.length) {
    let best: [InlineMark, RegExpExecArray] | undefined;
    for (const [mark, re] of rules) {
      // lastIndex rather than slicing, so the lookbehinds still see the character before pos.
      re.lastIndex = pos;
      const match = re.exec(text);
      if (match && (!best || match.index < best[1].index)) best = [mark, match];
    }
    if (!best) break;
    const [mark, match] = best;
    if (match.index > pos) out.push(text.slice(pos, match.index));
    out.push({ mark, children: mark === "code" || mark === "mono" ? [match[1]] : parseInline(match[1]) });
    pos = match.index + match[0].length;
  }
  if (pos < text.length) out.push(text.slice(pos));
  return out;
}

const linePrefixes: Array<[Exclude<LineKind, "text">, RegExp]> = [
  ["quote", /^> /],
  ["bullet", /^[-*] /],
  ["number", /^\d+\. /],
];

const fenceCount = (text: string) => text.split("```").length - 1;

/** The message as WhatsApp lays it out: one entry per line, with a monospace block that spans lines kept whole. */
export function parseMessage(text: string): Line[] {
  const raw = text.split("\n");
  const lines: Line[] = [];
  for (let i = 0; i < raw.length; i++) {
    let chunk = raw[i];
    if (fenceCount(chunk) % 2 === 1) {
      const close = raw.findIndex((line, j) => j > i && fenceCount(line) % 2 === 1);
      if (close !== -1) {
        chunk = raw.slice(i, close + 1).join("\n");
        i = close;
      }
    }
    const prefix = linePrefixes.find(([, re]) => re.test(chunk));
    const marker = prefix ? chunk.match(prefix[1])![0] : "";
    lines.push({ kind: prefix?.[0] ?? "text", marker, content: parseInline(chunk.slice(marker.length)) });
  }
  return lines;
}

const plain = (nodes: Inline[]): string => nodes.map((node) => (typeof node === "string" ? node : plain(node.children))).join("");

/** Removes the markers WhatsApp would render; lists and quotes stay. */
export function stripFormatting(text: string): string {
  return parseMessage(text).map((line) => line.marker + plain(line.content)).join("\n");
}

export type Edit = { value: string; start: number; end: number };

/**
 * Wraps the selection in a marker, or removes it if every selected line is
 * already wrapped. Each line is wrapped on its own (bold doesn't cross lines)
 * and spaces stay outside the markers; monospace wraps the whole selection.
 * With nothing selected, it inserts a pair of markers with the caret between.
 */
export function toggleWrap(value: string, start: number, end: number, mark: WrapMark): Edit {
  const marker = wrapMarkers[mark];
  if (start === end) return { value: value.slice(0, start) + marker + marker + value.slice(end), start: start + marker.length, end: start + marker.length };
  const selected = value.slice(start, end);
  const parts = mark === "mono" ? [selected] : selected.split("\n");
  const cores = parts.map((part) => part.match(/^(\s*)([\s\S]*?)(\s*)$/)!);
  const filled = cores.filter((core) => core[2]);
  const unwrap = filled.length > 0 && filled.every((core) => core[2].length > marker.length * 2 && core[2].startsWith(marker) && core[2].endsWith(marker));
  const replaced = cores.map(([, lead, core, trail]) => {
    if (!core) return lead + trail;
    return lead + (unwrap ? core.slice(marker.length, -marker.length) : marker + core + marker) + trail;
  }).join("\n");
  return { value: value.slice(0, start) + replaced + value.slice(end), start, end: start + replaced.length };
}

/** Turns the selected lines into a quote, bulleted or numbered list, or back to plain lines. */
export function toggleLines(value: string, start: number, end: number, kind: Exclude<LineKind, "text">): Edit {
  const from = value.lastIndexOf("\n", start - 1) + 1;
  const newline = value.indexOf("\n", end > start && value[end - 1] === "\n" ? end - 1 : end);
  const to = newline === -1 ? value.length : newline;
  const lines = value.slice(from, to).split("\n");
  const own = linePrefixes.find(([k]) => k === kind)![1];
  const filled = lines.filter((line) => line.trim());
  const remove = filled.length > 0 && filled.every((line) => own.test(line));
  let n = 0;
  const replaced = lines.map((line) => {
    if (!line.trim()) return line;
    const bare = linePrefixes.reduce((text, [, re]) => text.replace(re, ""), line);
    if (remove) return bare;
    return (kind === "quote" ? "> " : kind === "bullet" ? "- " : `${++n}. `) + bare;
  }).join("\n");
  return { value: value.slice(0, from) + replaced + value.slice(to), start: from, end: from + replaced.length };
}

// Unicode "fonts" are separate characters, mostly from the Mathematical
// Alphanumeric Symbols block. A few letters were encoded earlier in
// Letterlike Symbols, so the gaps in those ranges are filled from there.
function alphabet(upper: number, lower: number, digits?: number, exceptions: Record<string, number> = {}) {
  return (text: string) => Array.from(text, (ch) => {
    if (exceptions[ch]) return String.fromCodePoint(exceptions[ch]);
    const code = ch.codePointAt(0)!;
    if (code >= 65 && code <= 90) return String.fromCodePoint(upper + code - 65);
    if (code >= 97 && code <= 122) return String.fromCodePoint(lower + code - 97);
    if (digits !== undefined && code >= 48 && code <= 57) return String.fromCodePoint(digits + code - 48);
    return ch;
  }).join("");
}

/** Adds a combining mark after every visible character, e.g. a line through it. */
const combining = (mark: string) => (text: string) => Array.from(text, (ch) => (/\s/.test(ch) ? ch : ch + mark)).join("");

const circledDigits = Object.fromEntries([["0", 0x24ea], ...Array.from({ length: 9 }, (_, i) => [String(i + 1), 0x2460 + i])]);

export const fancyFonts: Array<{ name: string; convert: (text: string) => string }> = [
  { name: "Bold", convert: alphabet(0x1d5d4, 0x1d5ee, 0x1d7ec) },
  { name: "Italic", convert: alphabet(0x1d608, 0x1d622) },
  { name: "Bold italic", convert: alphabet(0x1d63c, 0x1d656) },
  { name: "Serif bold", convert: alphabet(0x1d400, 0x1d41a, 0x1d7ce) },
  { name: "Serif italic", convert: alphabet(0x1d434, 0x1d44e, undefined, { h: 0x210e }) },
  { name: "Script", convert: alphabet(0x1d49c, 0x1d4b6, undefined, { B: 0x212c, E: 0x2130, F: 0x2131, H: 0x210b, I: 0x2110, L: 0x2112, M: 0x2133, R: 0x211b, e: 0x212f, g: 0x210a, o: 0x2134 }) },
  { name: "Bold script", convert: alphabet(0x1d4d0, 0x1d4ea) },
  { name: "Gothic", convert: alphabet(0x1d504, 0x1d51e, undefined, { C: 0x212d, H: 0x210c, I: 0x2111, R: 0x211c, Z: 0x2128 }) },
  { name: "Double-struck", convert: alphabet(0x1d538, 0x1d552, 0x1d7d8, { C: 0x2102, H: 0x210d, N: 0x2115, P: 0x2119, Q: 0x211a, R: 0x211d, Z: 0x2124 }) },
  { name: "Typewriter", convert: alphabet(0x1d670, 0x1d68a, 0x1d7f6) },
  { name: "Circled", convert: alphabet(0x24b6, 0x24d0, undefined, circledDigits) },
  { name: "Struck through", convert: combining("̶") },
  { name: "Underlined", convert: combining("̲") },
];

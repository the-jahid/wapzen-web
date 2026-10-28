"use client";

import { Fragment, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Bold, Check, Code, Copy, Eraser, ExternalLink, Italic, List, ListOrdered, SquareCode, Strikethrough, TextQuote, Type, type LucideIcon } from "lucide-react";
import { CopyButton } from "./CopyButton";
import { fancyFonts, MAX_TEXT, parseMessage, stripFormatting, toggleLines, toggleWrap, type Edit, type Inline, type Line, type LineKind, type WrapMark } from "./whatsappFormat";
import styles from "./FreeTools.module.css";

type Action = { label: string; icon: LucideIcon; run: (value: string, start: number, end: number) => Edit };

const wrap = (mark: WrapMark) => (value: string, start: number, end: number) => toggleWrap(value, start, end, mark);
const lines = (kind: Exclude<LineKind, "text">) => (value: string, start: number, end: number) => toggleLines(value, start, end, kind);

// Grouped as WhatsApp's own menu groups them: text styles, code, then blocks.
const toolbar: Action[][] = [
  [
    { label: "Bold (*text*)", icon: Bold, run: wrap("bold") },
    { label: "Italic (_text_)", icon: Italic, run: wrap("italic") },
    { label: "Strikethrough (~text~)", icon: Strikethrough, run: wrap("strike") },
  ],
  [
    { label: "Monospace (```text```)", icon: SquareCode, run: wrap("mono") },
    { label: "Inline code (`text`)", icon: Code, run: wrap("code") },
  ],
  [
    { label: "Bulleted list (- )", icon: List, run: lines("bullet") },
    { label: "Numbered list (1. )", icon: ListOrdered, run: lines("number") },
    { label: "Quote (> )", icon: TextQuote, run: lines("quote") },
  ],
];

const samples = [
  {
    name: "Order update",
    text: "Hi Priya, your order *#1042* is confirmed ✅\n\n1. Vitamin C serum × 1\n2. Sunscreen SPF 50 × 2\n\nTotal: *₹1,350* (cash on delivery)\nDelivery: _Thursday, 2–6 pm_\n\n> Need to change the address? Just reply here.",
  },
  {
    name: "Price list",
    text: "*Haircut & styling* 💇\n\n- Men's cut: ~$30~ *$25*\n- Women's cut: *$45*\n- Blow-dry: *$35*\n\nUse code `WEEKEND10` for 10% off on Saturdays.",
  },
  {
    name: "Opening hours",
    text: "*Opening hours* 🕘\n\n- Mon–Fri: 9 am – 7 pm\n- Saturday: 10 am – 4 pm\n- Sunday: _closed_\n\n> Public holiday hours may differ.",
  },
];

function Inlines({ nodes }: { nodes: Inline[] }) {
  return nodes.map((node, i) => {
    if (typeof node === "string") return <Fragment key={i}>{node}</Fragment>;
    const children = <Inlines nodes={node.children} />;
    if (node.mark === "bold") return <strong key={i}>{children}</strong>;
    if (node.mark === "italic") return <em key={i}>{children}</em>;
    if (node.mark === "strike") return <s key={i}>{children}</s>;
    return <code key={i} className={node.mark === "code" ? styles.waCode : styles.waMono}>{children}</code>;
  });
}

function PreviewLine({ line }: { line: Line }) {
  const content: ReactNode = line.content.length ? <Inlines nodes={line.content} /> : "​";
  if (line.kind === "quote") return <span className={`${styles.waLine} ${styles.waQuote}`}>{content}</span>;
  if (line.kind === "text") return <span className={styles.waLine}>{content}</span>;
  return <span className={`${styles.waLine} ${styles.waItem}`}><span aria-hidden="true">{line.kind === "bullet" ? "•" : line.marker.trim()}</span><span>{content}</span></span>;
}

export function WhatsAppTextFormatter() {
  const id = useId();
  const editor = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = useState("");
  const [view, setView] = useState<"preview" | "fonts">("preview");
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<number | undefined>(undefined);

  function apply(run: Action["run"]) {
    const el = editor.current;
    if (!el) return;
    const edit = run(text, el.selectionStart, el.selectionEnd);
    if (edit.value.length > MAX_TEXT) return;
    setText(edit.value);
    // The new value renders first; restore focus and the selection after it.
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(edit.start, edit.end);
    });
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (!(event.ctrlKey || event.metaKey) || event.altKey) return;
    const key = event.key.toLowerCase();
    const mark: WrapMark | undefined = key === "b" ? "bold" : key === "i" ? "italic" : event.shiftKey && key === "x" ? "strike" : undefined;
    if (!mark) return;
    event.preventDefault();
    apply(wrap(mark));
  }

  async function copyText() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // No clipboard access: select the text so Ctrl/Cmd+C works.
      editor.current?.select();
      return;
    }
    setCopied(true);
    window.clearTimeout(copyTimer.current);
    copyTimer.current = window.setTimeout(() => setCopied(false), 2000);
  }

  const hasText = text.trim().length > 0;

  return <div className={styles.toolCard}>
    <form className={styles.form} onSubmit={(event) => event.preventDefault()} noValidate>
      <div className={styles.field}>
        <div className={styles.labelRow}><label htmlFor={`${id}-text`}>Your message</label><span className={styles.counter}>{text.length}/{MAX_TEXT}</span></div>
        <div>
          <div className={styles.toolbar} role="toolbar" aria-label="Formatting" aria-controls={`${id}-text`}>
            {toolbar.map((group, i) => <Fragment key={i}>
              {i > 0 && <span className={styles.toolbarDivider} aria-hidden="true" />}
              {group.map((action) => <button key={action.label} type="button" aria-label={action.label} title={action.label} onMouseDown={(event) => event.preventDefault()} onClick={() => apply(action.run)}><action.icon size={17} /></button>)}
            </Fragment>)}
            <span className={styles.toolbarDivider} aria-hidden="true" />
            <button type="button" aria-label="Remove formatting" title="Remove formatting" disabled={!hasText} onClick={() => setText(stripFormatting(text))}><Eraser size={17} /></button>
          </div>
          <textarea
            ref={editor}
            id={`${id}-text`}
            className={`${styles.input} ${styles.textarea} ${styles.editor}`}
            rows={9}
            maxLength={MAX_TEXT}
            placeholder={"Type or paste your message, select some words, then pick a format above.\n\n*bold*  _italic_  ~strikethrough~"}
            value={text}
            onChange={(event) => setText(event.target.value)}
            onKeyDown={onKeyDown}
            aria-describedby={`${id}-hint`}
          />
        </div>
        <p id={`${id}-hint`} className={styles.hint}>Select text and click a button, or press Ctrl+B or Ctrl+I (⌘ on a Mac). Click a button again to undo it.</p>
      </div>

      <div className={styles.field}>
        <span className={styles.fieldLabel}>Start from an example</span>
        <div className={styles.chips} role="group" aria-label="Example messages">
          {samples.map((sample) => <button key={sample.name} type="button" className={styles.chip} aria-pressed={text === sample.text} onClick={() => setText(sample.text)}>{sample.name}</button>)}
        </div>
      </div>
    </form>

    <section className={styles.result} aria-labelledby={`${id}-result`}>
      <h2 id={`${id}-result`} className={styles.srOnly}>Result</h2>
      <div className={styles.segmented} role="radiogroup" aria-label="Show">
        <button type="button" role="radio" aria-checked={view === "preview"} onClick={() => setView("preview")}>WhatsApp preview</button>
        <button type="button" role="radio" aria-checked={view === "fonts"} onClick={() => setView("fonts")}>Fancy fonts</button>
      </div>

      {view === "preview" ? <>
        <div className={styles.chatPreview}>
          {hasText
            ? <div className={styles.chatBubble}>{parseMessage(text).map((line, i) => <PreviewLine key={i} line={line} />)}</div>
            : <div className={styles.empty}><Type size={34} strokeWidth={1.4} /><p>Start typing, and your message appears here exactly as WhatsApp shows it.</p></div>}
        </div>
        <div className={styles.actions}>
          <button type="button" className={`${styles.btn} ${styles.btnPrimary}`} onClick={copyText} disabled={!hasText}>{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? "Copied!" : "Copy text"}</button>
          {hasText
            ? <a className={`${styles.btn} ${styles.btnSecondary}`} href={`https://wa.me/?text=${encodeURIComponent(text)}`} target="_blank" rel="noopener noreferrer"><ExternalLink size={16} />Send in WhatsApp</a>
            : <button type="button" className={`${styles.btn} ${styles.btnSecondary}`} disabled><ExternalLink size={16} />Send in WhatsApp</button>}
        </div>
        <p className={styles.hint}>Paste the copied text into any WhatsApp chat. The symbols turn into formatting when it&rsquo;s sent. &ldquo;Send in WhatsApp&rdquo; lets you pick the chat.</p>
        <p className={styles.srOnly} aria-live="polite">{copied ? "Message copied to clipboard" : ""}</p>
      </> : hasText ? <>
        <ul className={styles.fontList}>
          {fancyFonts.map((font) => {
            const value = font.convert(text);
            return <li key={font.name} className={styles.fontRow}>
              <div><small>{font.name}</small><p>{value}</p></div>
              <CopyButton value={value} label={`Copy ${font.name.toLowerCase()} text`} />
            </li>;
          })}
        </ul>
        <p className={styles.hint}>These are look-alike Unicode letters, not a font setting. Screen readers may skip them or read them letter by letter, so use them for a name or heading, not a whole message.</p>
      </> : <div className={styles.empty}><Type size={34} strokeWidth={1.4} /><p>Type your text, and it appears here in {fancyFonts.length} fancy fonts to copy.</p></div>}
    </section>
  </div>;
}

"use client";

import { useId, useRef, useState, type ReactNode } from "react";
import { ExternalLink, LoaderCircle, RefreshCw, Sparkles, TriangleAlert } from "lucide-react";
import { CopyButton } from "./CopyButton";
import { WhatsAppMessage } from "./WhatsAppMessage";
import styles from "./FreeTools.module.css";

// Shared by the two AI tools (reply generator, business message generator).
// Both post to /api/free-tools/ai, which forwards to the API. The tones and
// languages must match whiskey's src/free-tools/free-tools-prompts.ts.

export const tones = [
  { value: "friendly", label: "Friendly" },
  { value: "professional", label: "Professional" },
  { value: "short", label: "Short & casual" },
  { value: "apologetic", label: "Apologetic" },
  { value: "persuasive", label: "Persuasive" },
  { value: "formal", label: "Formal" },
] as const;
export type Tone = (typeof tones)[number]["value"];

export const languages = ["English", "Spanish", "Portuguese", "French", "German", "Italian", "Hindi", "Hinglish", "Bengali", "Urdu", "Arabic", "Indonesian", "Turkish", "Russian", "Swahili", "Tagalog"] as const;
export type Language = "auto" | (typeof languages)[number];

export type AiOption = { label: string; text: string };
type State = { status: "idle" | "loading" | "done" | "error"; options: AiOption[]; error?: string };

/** Sends one request at a time; a newer request replaces the older one's answer. */
export function useAiTool() {
  const [state, setState] = useState<State>({ status: "idle", options: [] });
  const latest = useRef(0);

  async function generate(body: Record<string, string>) {
    const call = ++latest.current;
    setState((s) => ({ status: "loading", options: s.options }));
    let next: State;
    try {
      const res = await fetch("/api/free-tools/ai", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json().catch(() => null) as { message?: string; data?: { options?: AiOption[] } } | null;
      const options = data?.data?.options ?? [];
      next = res.ok && options.length
        ? { status: "done", options }
        : { status: "error", options: [], error: data?.message && res.status !== 400 ? data.message : "Something went wrong. Please check your text and try again." };
    } catch {
      next = { status: "error", options: [], error: "Couldn't reach the AI. Check your connection and try again." };
    }
    if (call === latest.current) setState(next);
  }

  return { ...state, generate };
}

export function ToneField({ value, onChange }: { value: Tone; onChange: (tone: Tone) => void }) {
  const id = useId();
  return <div className={styles.field}>
    <span className={styles.fieldLabel} id={id}>Tone</span>
    <div className={styles.chips} role="radiogroup" aria-labelledby={id}>
      {tones.map((tone) => <button key={tone.value} type="button" role="radio" className={styles.chip} aria-checked={value === tone.value} onClick={() => onChange(tone.value)}>{tone.label}</button>)}
    </div>
  </div>;
}

export function LanguageField({ value, onChange, autoLabel }: { value: Language; onChange: (language: Language) => void; autoLabel: string }) {
  const id = useId();
  return <div className={styles.field}>
    <label htmlFor={id}>Language</label>
    <select id={id} className={`${styles.input} ${styles.select}`} value={value} onChange={(event) => onChange(event.target.value as Language)}>
      <option value="auto">{autoLabel}</option>
      {languages.map((language) => <option key={language} value={language}>{language}</option>)}
    </select>
  </div>;
}

export function GenerateButton({ loading, disabled, children }: { loading: boolean; disabled?: boolean; children: ReactNode }) {
  return <button type="submit" className={`${styles.btn} ${styles.btnPrimary} ${styles.btnLarge}`} disabled={loading || disabled}>
    {loading ? <LoaderCircle size={18} className={styles.spin} /> : <Sparkles size={18} />}{loading ? "Writing…" : children}
  </button>;
}

type ResultsProps = {
  state: ReturnType<typeof useAiTool>;
  onRegenerate: () => void;
  emptyIcon: ReactNode;
  emptyText: string;
  /** Shown under each option, e.g. a character limit. */
  note?: (text: string) => ReactNode;
};

/** The generated options, each in a WhatsApp bubble with Copy and Send buttons. */
export function AiResults({ state, onRegenerate, emptyIcon, emptyText, note }: ResultsProps) {
  const id = useId();
  const { status, options, error } = state;
  return <section className={styles.result} aria-labelledby={`${id}-title`} aria-busy={status === "loading"}>
    <div className={styles.labelRow}>
      <h2 id={`${id}-title`} className={styles.resultTitle}>{options.length ? `${options.length} options` : "Your messages"}</h2>
      {options.length > 0 && <button type="button" className={styles.textButton} onClick={onRegenerate} disabled={status === "loading"}><RefreshCw size={12} /> Write new ones</button>}
    </div>

    {status === "error" && <p className={styles.warning} role="alert"><TriangleAlert size={15} />{error}</p>}

    {options.length > 0 ? <ul className={`${styles.aiList} ${status === "loading" ? styles.aiLoading : ""}`}>
      {options.map((option, i) => <li key={`${i}-${option.label}`} className={styles.aiOption}>
        <span className={styles.badge}>{option.label || `Option ${i + 1}`}</span>
        <div className={styles.aiBubbleWrap}><div className={styles.chatBubble}><WhatsAppMessage text={option.text} /></div></div>
        {note?.(option.text)}
        <div className={styles.aiActions}>
          <CopyButton value={option.text} label={`Copy ${option.label || `option ${i + 1}`}`} copiedText="Copied">Copy</CopyButton>
          <a className={styles.copyButton} href={`https://wa.me/?text=${encodeURIComponent(option.text)}`} target="_blank" rel="noopener noreferrer"><ExternalLink size={14} /><span>Send in WhatsApp</span></a>
        </div>
      </li>)}
    </ul> : <div className={styles.empty}>
      {status === "loading" ? <LoaderCircle size={34} strokeWidth={1.4} className={styles.spin} /> : emptyIcon}
      <p>{status === "loading" ? "Writing your messages. This takes a few seconds." : emptyText}</p>
    </div>}

    {options.length > 0 && <p className={styles.hint}>AI can make mistakes. Read each message before you send it, and fill in anything in [square brackets].</p>}
    <p className={styles.srOnly} aria-live="polite">{status === "done" ? `${options.length} messages ready` : status === "loading" ? "Writing messages" : ""}</p>
  </section>;
}

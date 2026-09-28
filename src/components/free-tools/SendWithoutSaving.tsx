"use client";

import { useId, useMemo, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { AlertTriangle, CheckCircle2, ClipboardPaste, History, MessageCircle, Monitor, Send, X } from "lucide-react";
import { CopyButton } from "./CopyButton";
import { Flag } from "./Flag";
import { analysePhone, typeLabels } from "./phoneNumber";
import { MAX_MESSAGE, waLink } from "./whatsapp";
import type { CountryInfo } from "./countries";
import styles from "./FreeTools.module.css";

// Recently messaged numbers, kept in this browser only so people can reopen a
// chat without retyping. Module-level cache keeps the snapshot stable for
// useSyncExternalStore; the storage event syncs other tabs.
type Recent = { digits: string; intl: string; iso?: string };
const RECENT_KEY = "wapzen:send-without-saving:recent";
const MAX_RECENT = 6;
const noRecents: Recent[] = [];
const listeners = new Set<() => void>();
let recents: Recent[] | null = null;

function readRecents(): Recent[] {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(RECENT_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((r): r is Recent => typeof r?.digits === "string" && typeof r?.intl === "string").slice(0, MAX_RECENT) : [];
  } catch {
    return [];
  }
}

function subscribeRecents(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key !== RECENT_KEY) return;
    recents = readRecents();
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function getRecents() {
  recents ??= readRecents();
  return recents;
}

function writeRecents(next: Recent[]) {
  recents = next;
  try {
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    // Private mode or storage blocked: the list still works for this visit.
  }
  listeners.forEach((notify) => notify());
}

/** The visitor's country from their browser language (en-GB → GB), used as the default. */
function localeRegion() {
  try {
    return new Intl.Locale(navigator.language).maximize().region ?? "";
  } catch {
    return "";
  }
}

const noSubscribe = () => () => {};

/** WhatsApp Web's own send URL; wa.me would bounce desktop visitors through a landing page first. */
function webLink(digits: string, message: string) {
  return `https://web.whatsapp.com/send?phone=${digits}${message.trim() ? `&text=${encodeURIComponent(message)}` : ""}`;
}

export function SendWithoutSaving({ countries }: { countries: CountryInfo[] }) {
  const id = useId();
  const byIso = useMemo(() => new Map(countries.map((country) => [country.iso, country])), [countries]);
  const guessed = useSyncExternalStore(noSubscribe, localeRegion, () => "");
  const [picked, setPicked] = useState<string | null>(null);
  const iso = picked ?? (byIso.has(guessed) ? guessed : "");
  const selected = byIso.get(iso);

  const [number, setNumber] = useState("");
  const [message, setMessage] = useState("");
  const [pasteFailed, setPasteFailed] = useState(false);
  const numberInput = useRef<HTMLInputElement>(null);
  const recentList = useSyncExternalStore(subscribeRecents, getRecents, () => noRecents);

  const result = analysePhone(number, iso, byIso);
  const ok = result.state === "ok" ? result : null;

  function remember() {
    if (!ok) return;
    const entry: Recent = { digits: ok.digits, intl: ok.intl, iso: ok.country?.iso };
    writeRecents([entry, ...getRecents().filter((r) => r.digits !== ok.digits)].slice(0, MAX_RECENT));
  }

  function openChat(event: FormEvent) {
    event.preventDefault();
    if (!ok) {
      numberInput.current?.focus();
      return;
    }
    remember();
    window.open(waLink(ok.digits, message), "_blank", "noopener,noreferrer");
  }

  async function paste() {
    try {
      const text = await navigator.clipboard.readText();
      setNumber(text.trim());
      setPasteFailed(false);
    } catch {
      // Firefox and some mobile browsers don't allow reading the clipboard.
      setPasteFailed(true);
    }
    numberInput.current?.focus();
  }

  function pickRecent(recent: Recent) {
    setNumber(recent.intl);
    numberInput.current?.focus();
  }

  const numberHint = result.state === "error"
    ? result.message
    : pasteFailed
      ? "Your browser blocked pasting. Press Ctrl+V (or long-press and Paste) in the box instead."
      : "Type it the way you'd dial it locally, or paste a full number starting with +.";

  return <div className={styles.toolCard}>
    <form id={`${id}-form`} className={styles.form} onSubmit={openChat} noValidate>
      <div className={styles.field}>
        <label htmlFor={`${id}-country`}>Country</label>
        <div className={styles.selectWrap}>
          {selected && <Flag iso={selected.iso} />}
          <select id={`${id}-country`} className={`${styles.input} ${styles.select} ${selected ? styles.selectWithFlag : ""}`} value={iso} onChange={(event) => setPicked(event.target.value)}>
            <option value="">Choose a country…</option>
            {countries.map((country) => <option key={country.iso} value={country.iso}>{country.name} (+{country.code})</option>)}
          </select>
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor={`${id}-number`}>Phone number</label>
        <div className={styles.inputRow}>
          <input
            ref={numberInput}
            id={`${id}-number`}
            className={`${styles.input} ${result.state === "error" ? styles.invalid : ""}`}
            type="tel"
            inputMode="tel"
            autoComplete="off"
            placeholder={selected?.local || "+44 7400 123456"}
            value={number}
            onChange={(event) => { setNumber(event.target.value); setPasteFailed(false); }}
            aria-invalid={result.state === "error"}
            aria-describedby={`${id}-number-hint`}
          />
          <button type="button" className={`${styles.btn} ${styles.btnSecondary}`} onClick={paste}><ClipboardPaste size={16} />Paste</button>
        </div>
        <p id={`${id}-number-hint`} className={result.state === "error" ? styles.error : styles.hint}>{numberHint}</p>
      </div>

      <div className={styles.field}>
        <div className={styles.labelRow}><label htmlFor={`${id}-message`}>Message <span>(optional)</span></label><span className={styles.counter}>{message.length}/{MAX_MESSAGE}</span></div>
        <textarea
          id={`${id}-message`}
          className={`${styles.input} ${styles.textarea}`}
          rows={4}
          maxLength={MAX_MESSAGE}
          placeholder="Hi! Got your number from…"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
        <p className={styles.hint}>It&apos;s typed into the chat for you. Nothing is sent until you press send in WhatsApp.</p>
      </div>

      {recentList.length > 0 && <div className={styles.field}>
        <div className={styles.labelRow}>
          <span className={styles.fieldLabel}>Recent numbers</span>
          <button type="button" className={styles.textButton} onClick={() => writeRecents([])}>Clear</button>
        </div>
        <ul className={styles.recentList}>
          {recentList.map((recent) => <li key={recent.digits}>
            <button type="button" className={styles.recentChip} onClick={() => pickRecent(recent)}>
              {recent.iso ? <Flag iso={recent.iso} /> : <History size={14} />}{recent.intl}
            </button>
            <button type="button" className={styles.recentRemove} onClick={() => writeRecents(recentList.filter((r) => r.digits !== recent.digits))} aria-label={`Remove ${recent.intl} from recent numbers`}><X size={13} /></button>
          </li>)}
        </ul>
        <p className={styles.hint}>Saved in this browser only, never on our servers.</p>
      </div>}
    </form>

    <section className={styles.result} aria-labelledby={`${id}-result`}>
      <h2 id={`${id}-result`} className={styles.resultTitle}>Start the chat</h2>
      {ok ? <>
        <div className={styles.numberHero}>
          <span className={styles.numberCountry}>{ok.country && <Flag iso={ok.country.iso} />}{ok.country ? ok.country.name : "International number"} · +{ok.callingCode}{ok.detected && ok.country && <em>detected from the number</em>}</span>
          <strong>{ok.intl}</strong>
        </div>
        {ok.valid
          ? <p className={styles.okNote}><CheckCircle2 size={15} />{(ok.type && typeLabels[ok.type]) || "Valid number"}{ok.type === "FIXED_LINE" && ". Landlines only work if the number is registered with WhatsApp Business."}</p>
          : <p className={styles.warning}><AlertTriangle size={15} />The length looks right, but this isn&apos;t a number range in use{ok.country ? ` in ${ok.country.name}` : ""}. Double-check the digits.</p>}
        <div className={styles.sendActions}>
          <button type="submit" form={`${id}-form`} className={`${styles.btn} ${styles.btnPrimary} ${styles.btnLarge}`}><Send size={17} />Open chat in WhatsApp</button>
          <a className={`${styles.btn} ${styles.btnSecondary}`} href={webLink(ok.digits, message)} target="_blank" rel="noopener noreferrer" onClick={remember}><Monitor size={16} />Use WhatsApp Web</a>
        </div>
        <dl className={styles.facts}>
          <div><dt>Chat link for this number</dt><dd><code>{waLink(ok.digits, message)}</code><CopyButton value={waLink(ok.digits, message)} label="Copy chat link" /></dd></div>
        </dl>
        <p className={styles.hint}>The number isn&apos;t added to your contacts. The chat stays in your WhatsApp chat list like any other.</p>
      </> : <div className={styles.empty}>
        <MessageCircle size={34} strokeWidth={1.4} />
        <p>Enter any WhatsApp number to open a chat with it, no contact needed.</p>
      </div>}
    </section>
  </div>;
}

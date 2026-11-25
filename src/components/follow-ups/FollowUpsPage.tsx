"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useAuth } from "@clerk/nextjs";
import { Bot, ChevronDown, ChevronRight, Clock, Play } from "lucide-react";
import Link from "next/link";
import { DashboardSidebar } from "@/components/nav/DashboardSidebar";
import { WhatsAppGlyph } from "@/components/nav/supportWhatsApp";
import { getChatConversation, type ApiChatConversation } from "@/lib/chatConversations";
import { getFollowUps, reviewFollowUps, saveFollowUps, type FollowUpResult, type FollowUpState } from "@/lib/followUps";
import { useCachedState } from "@/lib/pageCache";
import { listPhoneNumbers, type ApiPhoneNumber } from "@/lib/phoneNumbers";
import styles from "./FollowUpsPage.module.css";

const DEFAULT_INTERVAL = "12";
const examples = [
  { label: "Product inquiries", prompt: "Follow up on unanswered product inquiries after 24 hours. Offer help with delivery and keep it brief." },
  { label: "Appointments", prompt: "Follow up on unconfirmed appointments after 12 hours. Thank the customer and ask what time works best." },
  { label: "Order reminders", prompt: "Follow up on orders waiting for a pickup or delivery choice after 24 hours. Ask which option the customer prefers." },
];
const statusLabels = { draft: "Draft", sent: "Sent", skipped: "Skipped", failed: "Failed", sending: "Delivery pending" };

function contactName(result: FollowUpResult) {
  return result.peer_name || result.peer_phone || "WhatsApp contact";
}

function formatTime(value: string) {
  return new Date(value).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

function errorText(reason: unknown) {
  return reason instanceof Error ? reason.message : "Could not load follow-ups.";
}

export default function FollowUpsPage() {
  const { getToken, isSignedIn } = useAuth();
  const [phoneNumbers, setPhoneNumbers, hasPhoneNumbers] = useCachedState<ApiPhoneNumber[]>("phone-numbers:chat", []);
  const [numberId, setNumberId] = useState("");
  const [state, setState] = useState<FollowUpState | null>(null);
  const [page, setPage] = useState(1);
  const [prompt, setPrompt] = useState("");
  const [interval, setIntervalHours] = useState(DEFAULT_INTERVAL);
  const [enabled, setEnabled] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [thread, setThread] = useState<{ id: string; data?: ApiChatConversation; error?: string } | null>(null);
  const [notice, setNotice] = useState<{ text: string; error?: boolean } | null>(null);
  const [busy, setBusy] = useState(false);
  const [numberError, setNumberError] = useState(false);
  const [numberReload, setNumberReload] = useState(0);
  const [settingsReload, setSettingsReload] = useState(0);
  const numbers = phoneNumbers.filter((item) => item.phone_number);
  const number = numbers.find((item) => item.id === numberId);
  const selectedNumberId = number?.id;
  const result = state?.results.find((item) => item.conversation_id === selectedId) ?? state?.results[0];
  const resultId = result?.conversation_id;
  const config = state?.config;
  const reviewing = Boolean(config?.running || config?.queued);
  const hours = Number(interval);
  const valid = Boolean(prompt.trim()) && Number.isInteger(hours) && hours >= 1 && hours <= 8760;
  const dirty = !config || prompt.trim() !== config.prompt || hours !== config.interval_hours || enabled !== config.enabled;
  const pages = state ? Math.max(1, Math.ceil(state.total / state.page_size)) : 1;
  const failed = (state?.counts.failed ?? 0) + (state?.counts.sending ?? 0);

  useEffect(() => {
    if (!isSignedIn) return;
    let current = true;
    void listPhoneNumbers(getToken, "chat").then((rows) => {
      if (!current) return;
      setPhoneNumbers(rows);
      setNumberId((selected) => rows.some((item) => item.id === selected && item.phone_number) ? selected : "");
      setNumberError(false);
    }).catch(() => {
      if (current) setNumberError(true);
    });
    return () => { current = false; };
  }, [getToken, isSignedIn, numberReload, setPhoneNumbers]);

  useEffect(() => {
    if (!selectedNumberId || !isSignedIn) return;
    let current = true;
    void getFollowUps(selectedNumberId, getToken).then((next) => {
      if (!current) return;
      setState(next);
      setPrompt(next.config?.prompt ?? "");
      setIntervalHours(String(next.config?.interval_hours ?? DEFAULT_INTERVAL));
      setEnabled(next.config?.enabled ?? false);
    }).catch((error: unknown) => {
      if (current) setNotice({ text: errorText(error), error: true });
    });
    return () => { current = false; };
  }, [getToken, isSignedIn, selectedNumberId, settingsReload]);

  useEffect(() => {
    if (!selectedNumberId || !isSignedIn || busy || (!reviewing && !config?.enabled)) return;
    let current = true;
    let timer: ReturnType<typeof setTimeout>;
    const refresh = async () => {
      try {
        const next = await getFollowUps(selectedNumberId, getToken, page);
        if (current) setState(next);
      } catch {
        // Keep the current results visible while the server reconnects.
      } finally {
        if (current) timer = setTimeout(() => { void refresh(); }, reviewing ? 3000 : 15000);
      }
    };
    timer = setTimeout(() => { void refresh(); }, reviewing ? 3000 : 15000);
    return () => { current = false; clearTimeout(timer); };
  }, [busy, config?.enabled, getToken, isSignedIn, selectedNumberId, page, reviewing]);

  useEffect(() => {
    if (!resultId || !isSignedIn) return;
    let current = true;
    void getChatConversation(resultId, getToken).then((data) => {
      if (current) setThread({ id: resultId, data });
    }).catch((error: unknown) => {
      if (current) setThread({ id: resultId, error: errorText(error) });
    });
    return () => { current = false; };
  }, [config?.last_run_at, getToken, isSignedIn, resultId]);

  function selectNumber(id: string) {
    setNumberId(id);
    setState(null);
    setPage(1);
    setSelectedId(null);
    setNotice(null);
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || !numberId || !valid) return;
    setBusy(true);
    setNotice(null);
    try {
      const next = await saveFollowUps(numberId, { prompt: prompt.trim(), interval_hours: hours, enabled }, getToken);
      setPage(1);
      setState(next);
      setNotice({ text: "Follow-up settings saved." });
    } catch (error) {
      setNotice({ text: errorText(error), error: true });
    } finally {
      setBusy(false);
    }
  }

  async function runReview() {
    if (busy || dirty || reviewing || !numberId) return;
    setBusy(true);
    setNotice(null);
    try {
      const next = await reviewFollowUps(numberId, getToken);
      setPage(1);
      setSelectedId(null);
      setState(next);
    } catch (error) {
      setNotice({ text: errorText(error), error: true });
    } finally {
      setBusy(false);
    }
  }

  async function showPage(nextPage: number) {
    if (busy || !numberId) return;
    setBusy(true);
    try {
      const next = await getFollowUps(numberId, getToken, nextPage);
      setPage(nextPage);
      setSelectedId(null);
      setState(next);
    } catch (error) {
      setNotice({ text: errorText(error), error: true });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={`${styles.shell} app-accent-green`}>
      <DashboardSidebar activeLabel="Follow-ups" stackBelow={900} />
      <main className={styles.main}>
        <div className={styles.content}>
          <header className={styles.pageHeader}>
            <div>
              <div className={styles.titleRow}><h1>Follow-ups</h1></div>
              <p>Tell your AI agent when to follow up on WhatsApp and what to say.</p>
            </div>
          </header>

          <section className={`${styles.card} ${styles.numberPicker}`} aria-labelledby="follow-up-number-label">
            <label className={styles.settingField}>
              <span id="follow-up-number-label">WhatsApp number</span>
              <span className={styles.numberSelect}>
                <select disabled={busy || numbers.length === 0} value={selectedNumberId ?? ""} onChange={(event) => selectNumber(event.target.value)}>
                  <option value="" disabled>{numbers.length ? "Choose a linked number" : numberError || hasPhoneNumbers ? "No numbers available" : "Loading WhatsApp numbers…"}</option>
                  {numbers.map((item) => <option key={item.id} value={item.id}>{item.phone_number}{item.label ? ` · ${item.label}` : ""}</option>)}
                </select>
                <ChevronDown size={16} aria-hidden="true" />
              </span>
            </label>
            {numberError || (hasPhoneNumbers && numbers.length === 0) ? <div className={styles.numberActions}>
              {numberError ? <p role="status">Could not refresh linked WhatsApp numbers.</p> : <p>Link a WhatsApp number to set up follow-ups.</p>}
              {numberError ? <button className={styles.secondaryButton} type="button" onClick={() => { setNumberError(false); setNumberReload((value) => value + 1); }}>Retry</button> : null}
              <Link className={styles.secondaryButton} href="/dashboard/phone-numbers">Phone Numbers</Link>
            </div> : null}
          </section>

          {number && notice ? <p className={notice.error ? styles.errorNotice : styles.notice} role={notice.error ? "alert" : "status"}>{notice.text}</p> : null}
          {number && notice?.error && !state ? <button className={styles.secondaryButton} type="button" onClick={() => { setNotice(null); setSettingsReload((value) => value + 1); }}>Retry settings</button> : null}

          {number ? <div className={styles.workspace}>
            <form className={styles.card} aria-labelledby="follow-up-instructions" onSubmit={save}>
              <div className={styles.cardHeader}>
                <span className={`${styles.cardIcon} ${styles.accentIcon}`}><Bot size={20} aria-hidden="true" /></span>
                <h2 id="follow-up-instructions">AI follow-up agent</h2>
              </div>
              <label className={`${styles.settingField} ${styles.intervalField}`}>
                  Recheck interval (hours)
                  <input disabled={!state || busy} min={1} max={8760} step={1} required type="number" value={interval} onChange={(event) => setIntervalHours(event.target.value)} />
              </label>
              <div className={styles.promptField}>
                <label htmlFor="follow-up-prompt">Follow-up instructions</label>
                <textarea disabled={!state || busy} id="follow-up-prompt" maxLength={8000} rows={5} value={state ? prompt : ""} onChange={(event) => setPrompt(event.target.value)} />
              </div>
              <div className={styles.examples}>
                <span>Try an example</span>
                <div className={styles.exampleButtons}>
                  {examples.map((example) => (
                    <button disabled={!state || busy} key={example.label} onClick={() => setPrompt(example.prompt)} type="button">{example.label}</button>
                  ))}
                </div>
              </div>
              <label className={styles.automationSetting}>
                <input checked={Boolean(state && enabled)} disabled={!state || busy} onChange={(event) => setEnabled(event.target.checked)} type="checkbox" />
                <span><strong>Send automatic follow-ups</strong><span>Saving with this enabled lets the agent send WhatsApp messages on schedule.</span></span>
              </label>
              <div className={styles.reviewAction}>
                <button className={styles.secondaryButton} disabled={!state || busy || reviewing || dirty} onClick={() => { void runReview(); }} type="button">
                  <Play size={15} aria-hidden="true" /> Preview follow-ups
                </button>
                <button className={styles.primaryButton} disabled={!state || !valid || !dirty || busy} type="submit">Save settings</button>
              </div>
            </form>

            <section className={styles.card} aria-labelledby="follow-up-review">
              <div className={styles.cardHeader}>
                <span className={`${styles.cardIcon} ${styles.accentIcon}`}><WhatsAppGlyph size={19} /></span>
                <div className={styles.reviewHeading}>
                  <h2 id="follow-up-review">WhatsApp review</h2>
                  <p>{number.label ? `${number.label} · ` : ""}{number.phone_number}</p>
                </div>
              </div>
              {config?.next_run_at ? <div className={styles.recheck}>
                <div className={styles.recheckTime}><Clock size={16} aria-hidden="true" /><p>Next recheck {formatTime(config.next_run_at)}</p></div>
              </div> : null}
              {config?.last_error && !reviewing ? <p className={styles.errorNotice} role="alert">{config.last_error}</p> : null}
              <div className={styles.reviewList}>
                <p className={styles.reviewSummary} role="status">
                  {reviewing ? `Review ${config?.running ? "in progress" : "queued"} · ${state?.total ?? 0} checked` :
                    config?.last_run_at ? `${state?.total ?? 0} checked · ${state?.counts.draft ?? 0} drafts · ${state?.counts.sent ?? 0} sent · ${state?.counts.skipped ?? 0} skipped${failed ? ` · ${failed} need attention` : ""}` :
                      state ? "Save your instructions and run a preview to see what the agent would send." : notice?.error ? "Review unavailable." : "Loading follow-up settings…"}
                </p>
                {state?.results.length ? <ul className={styles.conversations} aria-label="Reviewed conversations">
                  {state.results.map((item) => <li key={item.conversation_id}>
                    <button aria-pressed={resultId === item.conversation_id} className={styles.conversation} onClick={() => setSelectedId(item.conversation_id)} type="button">
                      <span className={styles.avatar} aria-hidden="true">{contactName(item).split(/\s+/).slice(0, 2).map((word) => word[0]).join("").toUpperCase()}</span>
                      <span className={styles.contactText}><strong>{contactName(item)}</strong>{item.peer_name && item.peer_phone ? <span>{item.peer_phone}</span> : null}</span>
                      <span className={styles.decisionBadge} data-drafted={item.status === "draft" || item.status === "sent" || undefined}>{statusLabels[item.status]}</span>
                      <ChevronRight size={15} aria-hidden="true" />
                    </button>
                  </li>)}
                </ul> : null}
                {pages > 1 || page > 1 ? <div className={styles.reviewAction}>
                  <button className={styles.secondaryButton} disabled={busy || page <= 1} onClick={() => { void showPage(page - 1); }} type="button">Previous</button>
                  <button className={styles.secondaryButton} disabled={busy || page >= pages} onClick={() => { void showPage(page + 1); }} type="button">Next</button>
                </div> : null}
              </div>
              {result ? <section aria-label={`WhatsApp preview for ${contactName(result)}`} className={styles.preview}>
                <div className={styles.previewHeader}><h3>Chat with {contactName(result)}</h3><p>{result.reason}</p></div>
                <div className={styles.messages}>
                  {thread?.id !== resultId ? <p role="status">Loading conversation…</p> : thread?.error ? <p className={styles.errorNotice}>{thread.error}</p> : null}
                  {thread?.id === resultId ? thread?.data?.messages?.slice(-8).map((message) => (
                    <ChatBubble key={message.seq} label={message.role === "user" ? contactName(result) : "Business"} message={message.content} outgoing={message.role === "assistant"} />
                  )) : null}
                  {result.message && result.status !== "sent" ? <ChatBubble label={result.status === "draft" ? "AI follow-up draft" : "Follow-up message"} message={result.message} outgoing draft /> : null}
                </div>
              </section> : null}
            </section>
          </div> : null}
        </div>
      </main>
    </div>
  );
}

function ChatBubble({ label, message, outgoing = false, draft = false }: { label: string; message: string; outgoing?: boolean; draft?: boolean }) {
  return (
    <div className={styles.bubble} data-outgoing={outgoing || undefined} data-draft={draft || undefined}>
      <span>{label}</span><p>{message}</p>
    </div>
  );
}

"use client";

import { useId, useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { FileText, LoaderCircle, LockKeyhole, TriangleAlert, Upload, X } from "lucide-react";
import { chatStats, parseChat, textFromZip, type ChatStats } from "./chatParser";
import styles from "./FreeTools.module.css";

const MAX_FILE_MB = 60;
const weekdayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MAX_PEOPLE_BARS = 10;

// A made-up chat between a shop and a customer, so people can see the report
// before exporting their own.
function sampleChat() {
  let seed = 7;
  const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const lines: string[] = ["01/09/2026, 09:00 - Messages and calls are end-to-end encrypted. Only people in this chat can read, listen to, or share them."];
  const shop = ["Good morning! Your order is packed 📦", "Yes, we have it in medium and large", "Delivery is tomorrow between 2 and 6 pm", "Thank you so much! 🙏", "Here's the link: https://example.com/catalog", "We're open until 8 pm today", "Sure, I'll keep one aside for you", "<Media omitted>", "The blue one is back in stock 😍", "Great choice! 👍"];
  const customer = ["Hi! Is the blue dress still available?", "Can I get it in medium?", "How much is delivery?", "Perfect, I'll take it 😊", "Do you have it in red too?", "<Media omitted>", "Thanks!! ❤️", "What time do you close today?", "Can you send the catalog?", "Haha great 😂"];
  const start = new Date(2026, 8, 1, 9, 0);
  for (let day = 0; day < 85; day++) {
    if (rand() < 0.35) continue;
    let t = new Date(start.getTime() + day * 86_400_000 + (9 + Math.floor(rand() * 11)) * 3_600_000);
    const turns = 2 + Math.floor(rand() * 8);
    for (let i = 0; i < turns; i++) {
      const isShop = i % 2 === 1;
      const pool = isShop ? shop : customer;
      const d = `${String(t.getDate()).padStart(2, "0")}/${String(t.getMonth() + 1).padStart(2, "0")}/${t.getFullYear()}, ${String(t.getHours()).padStart(2, "0")}:${String(t.getMinutes()).padStart(2, "0")}`;
      lines.push(`${d} - ${isShop ? "Bella Boutique" : "Maria"}: ${pool[Math.floor(rand() * pool.length)]}`);
      t = new Date(t.getTime() + (1 + Math.floor(rand() * (isShop ? 25 : 12))) * 60_000);
    }
  }
  return lines.join("\n");
}

const number = (n: number) => n.toLocaleString();
const dateText = (d: Date) => d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });

function replyText(minutes: number | null) {
  if (minutes === null) return "–";
  if (minutes < 1) return "under 1 min";
  if (minutes < 60) return `${Math.round(minutes)} min`;
  const hours = minutes / 60;
  return `${hours < 10 ? hours.toFixed(1) : Math.round(hours)} h`;
}

function hourLabel(h: number) {
  return new Date(2000, 0, 1, h).toLocaleTimeString(undefined, { hour: "numeric" });
}

/** Vertical bars with a value on hover and the busiest one labelled. */
function Columns({ title, data, label }: { title: string; data: Array<{ key: string; label: string; value: number }>; label: (i: number) => string | null }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  const peak = data.findIndex((d) => d.value === max);
  return <figure className={styles.panel}>
    <figcaption className={styles.panelTitle}>{title}{data[peak]?.value > 0 && <span>Busiest: {data[peak].label}</span>}</figcaption>
    <div className={styles.columns} role="list">
      {data.map((d, i) => <div key={d.key} className={styles.column} role="listitem" title={`${d.label}: ${number(d.value)} messages`} aria-label={`${d.label}: ${number(d.value)} messages`}>
        <span className={styles.columnBar} style={{ height: `${(d.value / max) * 100}%` }} data-peak={i === peak || undefined} />
        <small aria-hidden="true">{label(i) ?? ""}</small>
      </div>)}
    </div>
  </figure>;
}

function Report({ stats, fileName, onClear }: { stats: ChatStats; fileName: string; onClear: () => void }) {
  const spanDays = Math.max(1, Math.round((stats.last.getTime() - stats.first.getTime()) / 86_400_000) + 1);
  const shown = stats.people.slice(0, MAX_PEOPLE_BARS);
  const others = stats.people.slice(MAX_PEOPLE_BARS).reduce((n, p) => n + p.messages, 0);
  const maxPerson = Math.max(1, shown[0]?.messages ?? 1, others);
  const tiles = [
    { label: "Messages", value: number(stats.messages), note: `${(stats.messages / stats.activeDays).toFixed(1)} per active day` },
    { label: "Words", value: number(stats.words), note: `${(stats.words / Math.max(1, stats.messages - stats.media)).toFixed(1)} per message` },
    { label: "Days active", value: number(stats.activeDays), note: `of ${number(spanDays)} days (${Math.round((stats.activeDays / spanDays) * 100)}%)` },
    { label: "Longest streak", value: `${number(stats.longestStreak)} day${stats.longestStreak === 1 ? "" : "s"}`, note: "in a row with messages" },
    { label: "Busiest day", value: number(stats.busiestDay.messages), note: dateText(stats.busiestDay.date) },
    { label: "Media, links, emojis", value: `${number(stats.media)} · ${number(stats.links)} · ${number(stats.emojis)}`, note: stats.deleted ? `${number(stats.deleted)} deleted messages` : "photos, videos, voice notes, files" },
  ];

  return <section className={styles.report} aria-labelledby="report-title">
    <div className={styles.reportHead}>
      <div>
        <h2 id="report-title" className={styles.resultTitle}>Chat report</h2>
        <p className={styles.hint}>{fileName} · {stats.people.length} {stats.people.length === 1 ? "person" : "people"} · {dateText(stats.first)} – {dateText(stats.last)}</p>
      </div>
      <button type="button" className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSmall}`} onClick={onClear}><X size={14} />Analyze another chat</button>
    </div>

    <div className={styles.statGrid}>
      {tiles.map((tile) => <div key={tile.label} className={styles.statTile}><small>{tile.label}</small><strong>{tile.value}</strong><span>{tile.note}</span></div>)}
    </div>

    <figure className={styles.panel}>
      <figcaption className={styles.panelTitle}>Who sends the most messages</figcaption>
      <ul className={styles.hbars}>
        {shown.map((p) => <li key={p.name} title={`${p.name}: ${number(p.messages)} messages`}>
          <span className={styles.hbarName}>{p.name}</span>
          <span className={styles.hbarTrack}><span style={{ width: `${(p.messages / maxPerson) * 100}%` }} /></span>
          <span className={styles.hbarValue}>{number(p.messages)} <em>{Math.round((p.messages / stats.messages) * 100)}%</em></span>
        </li>)}
        {others > 0 && <li><span className={styles.hbarName}>{stats.people.length - MAX_PEOPLE_BARS} others</span><span className={styles.hbarTrack}><span style={{ width: `${(others / maxPerson) * 100}%` }} /></span><span className={styles.hbarValue}>{number(others)} <em>{Math.round((others / stats.messages) * 100)}%</em></span></li>}
      </ul>
    </figure>

    <div className={styles.panel}>
      <p className={styles.panelTitle}>Per person</p>
      <div className={styles.tableWrap}>
        <table className={styles.codeTable}>
          <thead><tr><th scope="col">Name</th><th scope="col">Messages</th><th scope="col">Words / msg</th><th scope="col">Media</th><th scope="col">Emojis</th><th scope="col">Chats started</th><th scope="col">Typical reply</th></tr></thead>
          <tbody>{stats.people.map((p) => <tr key={p.name}>
            <th scope="row">{p.name}</th>
            <td>{number(p.messages)}</td>
            <td>{(p.words / Math.max(1, p.messages - p.media)).toFixed(1)}</td>
            <td>{number(p.media)}</td>
            <td>{number(p.emojis)}</td>
            <td>{number(p.starts)}</td>
            <td>{replyText(p.replyMinutes)}</td>
          </tr>)}</tbody>
        </table>
      </div>
      <p className={styles.hint}>A chat counts as started after 6 hours of silence. Typical reply is the median time to answer someone else, ignoring gaps over 12 hours.</p>
    </div>

    <div className={styles.panelGrid}>
      <Columns title="Messages by hour of day" data={stats.hours.map((value, h) => ({ key: String(h), label: hourLabel(h), value }))} label={(i) => (i % 6 === 0 ? hourLabel(i) : null)} />
      <Columns title="Messages by day of week" data={stats.weekdays.map((value, i) => ({ key: weekdayNames[i], label: weekdayNames[i], value }))} label={(i) => weekdayNames[i]} />
    </div>

    {stats.months.length > 1 && <Columns title="Messages per month" data={stats.months.map((m) => ({ key: m.key, label: m.label, value: m.messages }))} label={(i) => {
      const step = Math.ceil(stats.months.length / 12);
      return i % step === 0 ? stats.months[i].label : null;
    }} />}

    <div className={styles.panelGrid}>
      <div className={styles.panel}>
        <p className={styles.panelTitle}>Most used words</p>
        {stats.topWords.length ? <ol className={styles.tagList}>{stats.topWords.map((w) => <li key={w.word}>{w.word}<span>{number(w.count)}</span></li>)}</ol> : <p className={styles.hint}>No words to show.</p>}
      </div>
      <div className={styles.panel}>
        <p className={styles.panelTitle}>Most used emojis</p>
        {stats.topEmojis.length ? <ol className={`${styles.tagList} ${styles.emojiList}`}>{stats.topEmojis.map((e) => <li key={e.emoji}>{e.emoji}<span>{number(e.count)}</span></li>)}</ol> : <p className={styles.hint}>No emojis in this chat.</p>}
      </div>
    </div>
  </section>;
}

export function WhatsAppChatAnalyzer() {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [stats, setStats] = useState<ChatStats | null>(null);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);

  function analyze(text: string, name: string) {
    const result = chatStats(parseChat(text));
    if (!result) {
      setError("No messages found in this file. Export the chat from WhatsApp (More › Export chat) and pick the .txt or .zip it creates.");
      return;
    }
    setError("");
    setFileName(name);
    setStats(result);
    requestAnimationFrame(() => document.getElementById(`${id}-report`)?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  async function read(file: File) {
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      setError(`That file is over ${MAX_FILE_MB} MB. Export the chat "Without media" and try again.`);
      return;
    }
    setBusy(true);
    try {
      const isZip = /\.zip$/i.test(file.name) || file.type.includes("zip");
      analyze(isZip ? await textFromZip(await file.arrayBuffer()) : await file.text(), file.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't read that file.");
    } finally {
      setBusy(false);
    }
  }

  function onPick(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (file) void read(file);
  }

  function onDrop(event: DragEvent) {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) void read(file);
  }

  return <>
    <div className={styles.toolCard}>
      <div className={styles.form}>
        <div
          className={`${styles.dropZone} ${dragging ? styles.dropActive : ""}`}
          onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
        >
          {busy ? <LoaderCircle size={34} strokeWidth={1.4} className={styles.spin} /> : <Upload size={34} strokeWidth={1.4} />}
          <p><strong>Drop your exported chat here</strong><br />the .txt file from Android, or the .zip from iPhone</p>
          <input ref={input} id={`${id}-file`} type="file" accept=".txt,.zip,text/plain,application/zip" className={styles.srOnly} onChange={onPick} />
          <div className={styles.dropActions}>
            <button type="button" className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => input.current?.click()} disabled={busy}><FileText size={16} />Choose file</button>
            <button type="button" className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => analyze(sampleChat(), "Sample chat")} disabled={busy}>Try a sample chat</button>
          </div>
        </div>
        {error && <p className={styles.warning} role="alert"><TriangleAlert size={15} />{error}</p>}
        <p className={styles.okNote}><LockKeyhole size={14} />Your chat is read inside your browser. It is never uploaded to or stored on our servers.</p>
      </div>
      <div className={styles.result}>
        <h2 className={styles.resultTitle}>How to export a WhatsApp chat</h2>
        <ol className={styles.exportSteps}>
          <li><strong>Open the chat</strong> on your phone (a person or a group).</li>
          <li><strong>Android:</strong> tap ⋮ › More › Export chat. <strong>iPhone:</strong> tap the contact or group name › Export chat.</li>
          <li>Choose <strong>Without media</strong>. It&rsquo;s faster, and photos aren&rsquo;t needed for the stats.</li>
          <li>Save or send the file to yourself, then open it here.</li>
        </ol>
      </div>
    </div>
    <div id={`${id}-report`} className={styles.scrollTarget}>
      {stats && <Report stats={stats} fileName={fileName} onClear={() => { setStats(null); setError(""); window.scrollTo({ top: 0, behavior: "smooth" }); }} />}
    </div>
  </>;
}

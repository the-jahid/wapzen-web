"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Globe } from "lucide-react";
import { Flag } from "@/components/free-tools/Flag";
import { fetchVisitorStats, type VisitorStats } from "@/lib/siteVisits";
import styles from "./StatusBoard.module.css";

// How often today's numbers refresh while the tab is visible.
const REFRESH_MS = 60_000;

const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
const countryName = (iso: string | null) => {
  if (!iso) return "Unknown";
  try {
    return regionNames.of(iso) ?? iso;
  } catch {
    return iso;
  }
};

// Dates arrive as YYYY-MM-DD Bangladesh days; format them without moving them
// into the viewer's own time zone.
const asUtc = (date: string) => new Date(`${date}T00:00:00Z`);
const longDate = (date: string) => asUtc(date).toLocaleDateString("en-GB", { timeZone: "UTC", weekday: "long", day: "numeric", month: "long", year: "numeric" });
const shortDate = (date: string) => asUtc(date).toLocaleDateString("en-GB", { timeZone: "UTC", day: "numeric", month: "short" });
const number = new Intl.NumberFormat("en");

export function StatusBoard() {
  // null = today, whatever day that is when the request lands.
  const [date, setDate] = useState<string | null>(null);
  const [stats, setStats] = useState<VisitorStats | null>(null);
  const [failed, setFailed] = useState(false);

  const load = useCallback((signal?: AbortSignal) => {
    fetchVisitorStats(date ?? undefined, signal)
      .then((next) => { setStats(next); setFailed(false); })
      .catch((error: unknown) => {
        if (signal?.aborted) return;
        console.warn(error);
        setFailed(true);
      });
  }, [date]);

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    if (date !== null) return () => controller.abort();
    const timer = window.setInterval(() => { if (document.visibilityState === "visible") load(); }, REFRESH_MS);
    return () => { controller.abort(); window.clearInterval(timer); };
  }, [date, load]);

  if (!stats) {
    return <section className={styles.board} aria-busy={!failed}>
      <div className={styles.empty}>{failed ? "Visitor numbers can't be loaded right now. Try again in a minute." : "Loading visitor numbers…"}</div>
    </section>;
  }

  const days = stats.days;
  const index = days.findIndex((day) => day.date === stats.date);
  const isToday = stats.date === stats.today;
  const monthTotal = days.reduce((sum, day) => sum + day.visitors, 0);
  const peak = Math.max(1, ...days.map((day) => day.visitors));
  const topCount = stats.countries[0]?.visitors || 1;
  const known = stats.countries.filter((row) => row.country).length;
  const pick = (next: string) => setDate(next === stats.today ? null : next);

  return <section className={styles.board} aria-labelledby="status-day">
    <div className={styles.dayBar}>
      <button type="button" className={styles.iconButton} aria-label="Previous day" disabled={index <= 0} onClick={() => pick(days[index - 1].date)}><ChevronLeft size={18} /></button>
      <h2 id="status-day" className={styles.dayTitle}>
        {isToday ? "Today" : longDate(stats.date)}
        {isToday && <span className={styles.dayNote}>{longDate(stats.date)}</span>}
      </h2>
      <button type="button" className={styles.iconButton} aria-label="Next day" disabled={isToday || index < 0} onClick={() => pick(days[index + 1].date)}><ChevronRight size={18} /></button>
      {isToday
        ? <span className={styles.live}><span aria-hidden="true" />Updates every minute</span>
        : <button type="button" className={styles.todayButton} onClick={() => setDate(null)}>Back to today</button>}
    </div>
    {failed && <p className={styles.warning} role="status">Couldn&apos;t refresh. Showing the last numbers loaded.</p>}

    <div className={styles.tiles}>
      <div className={styles.tile}><span className={styles.tileLabel}>Visitors</span><strong className={styles.tileValue}>{number.format(stats.total)}</strong><span className={styles.tileHint}>{isToday ? "so far today" : "that day"}</span></div>
      <div className={styles.tile}><span className={styles.tileLabel}>Countries</span><strong className={styles.tileValue}>{number.format(known)}</strong><span className={styles.tileHint}>visitors came from</span></div>
      <div className={styles.tile}><span className={styles.tileLabel}>Last 30 days</span><strong className={styles.tileValue}>{number.format(monthTotal)}</strong><span className={styles.tileHint}>daily visitors added up</span></div>
    </div>

    <div className={styles.grid}>
      <div className={styles.card}>
        <div className={styles.cardHead}><h3>By country</h3><span>{isToday ? "today" : shortDate(stats.date)}</span></div>
        {stats.countries.length === 0
          ? <p className={styles.emptyRow}>No visitors counted yet for this day.</p>
          : <table className={styles.countries}>
            <thead><tr><th scope="col">Country</th><th scope="col"><span className={styles.srOnly}>Share</span></th><th scope="col">Visitors</th></tr></thead>
            <tbody>{stats.countries.map((row) => {
              const share = stats.total ? Math.round((row.visitors / stats.total) * 100) : 0;
              return <tr key={row.country ?? "unknown"}>
                <th scope="row"><span className={styles.country}>{row.country ? <Flag iso={row.country} /> : <Globe size={16} className={styles.globe} aria-hidden="true" />}{countryName(row.country)}</span></th>
                <td className={styles.shareCell}><span className={styles.track}><span className={styles.fill} style={{ width: `${(row.visitors / topCount) * 100}%` }} /></span><span className={styles.percent}>{share}%</span></td>
                <td className={styles.count}>{number.format(row.visitors)}</td>
              </tr>;
            })}</tbody>
          </table>}
      </div>

      <div className={styles.card}>
        <div className={styles.cardHead}><h3>Daily visitors</h3><span>last 30 days · tap a day</span></div>
        <div className={styles.chart}>
          <span className={styles.peak}>{number.format(peak)}</span>
          <div className={styles.bars}>
            {days.map((day) => {
              const selected = day.date === stats.date;
              return <button
                key={day.date}
                type="button"
                className={styles.barSlot}
                data-selected={selected || undefined}
                aria-pressed={selected}
                aria-label={`${longDate(day.date)}: ${number.format(day.visitors)} visitors`}
                onClick={() => pick(day.date)}
              >
                <span className={styles.bar} style={{ height: `${Math.max(day.visitors ? 3 : 0, (day.visitors / peak) * 100)}%` }} />
                <span className={styles.tip} aria-hidden="true">{shortDate(day.date)}<strong>{number.format(day.visitors)}</strong></span>
              </button>;
            })}
          </div>
          <div className={styles.axis} aria-hidden="true"><span>{days[0] && shortDate(days[0].date)}</span><span>Today</span></div>
        </div>
      </div>
    </div>
  </section>;
}

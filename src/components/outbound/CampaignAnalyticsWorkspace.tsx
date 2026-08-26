"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import {
  analyticsRanges,
  getCampaignAnalytics,
  type AnalyticsRange,
  type CampaignAnalytics,
  type CampaignDailyActivity,
} from "@/lib/campaignAnalytics";

// Chart palette. Two marks carry data: the accent for answered calls, and one
// de-emphasis gray for the rest of the calls placed — the emphasis form, since
// "how many were answered" is the point and the remainder is context. Both were
// checked against this card's surface (#101116): lightness band and contrast
// pass, and they separate by ΔE 21 under deuteranopia. Everything else on the
// chart (grid, axes, labels) is chrome and wears text tokens, never a data hue.
const accent = "#7d75ff";
const muted = "#5f6274";

// Plot padding in CSS pixels. The plot itself is drawn at the container's
// measured size, one SVG unit per pixel: a viewBox that scaled to fit would
// scale the axis text with it, leaving the labels tiny on a narrow card and
// oversized on a wide one. The bottom padding is the x-axis band, so the axis
// labels are inside the drawing rather than cropped by it.
const plot = { left: 36, right: 10, top: 14, bottom: 30 };
const minPlotHeight = 180;
const maxBarWidth = 18;

const dateFormatter = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });
const percentFormatter = new Intl.NumberFormat("en-US", { style: "percent", maximumFractionDigits: 1 });

type LeadKey = "pending" | "calling" | "contacted" | "failed" | "opted_out";
type CallKey = "received" | "answered" | "ended" | "declined" | "failed";

const leadRows: { key: LeadKey; label: string }[] = [
  { key: "pending", label: "Pending" },
  { key: "calling", label: "Calling" },
  { key: "contacted", label: "Contacted" },
  { key: "failed", label: "Call unsuccessful" },
  { key: "opted_out", label: "Opted out" },
];

const callRows: { key: CallKey; label: string }[] = [
  { key: "received", label: "Ringing" },
  { key: "answered", label: "In progress" },
  { key: "ended", label: "Completed" },
  { key: "declined", label: "Declined" },
  { key: "failed", label: "Failed" },
];

export default function CampaignAnalyticsWorkspace({ campaignId }: { campaignId: string }) {
  const { getToken } = useAuth();
  const [analytics, setAnalytics] = useState<CampaignAnalytics | null>(null);
  const [range, setRange] = useState<AnalyticsRange>(14);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [asTable, setAsTable] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const result = await getCampaignAnalytics(campaignId, range, getToken);
        if (cancelled) return;
        setAnalytics(result);
        setLoading(false);
      } catch (loadError) {
        if (cancelled) return;
        setError(loadError instanceof Error ? loadError.message : "Failed to load campaign analytics");
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [campaignId, getToken, range]);

  if (loading && !analytics) return <div className="ca-card ca-message">Loading analytics…</div>;
  if (error && !analytics) return <div className="ca-card ca-message ca-error">{error}</div>;
  if (!analytics) return null;

  const { calls, leads, talk_time: talk } = analytics;
  const hasCalls = calls.total > 0;

  return <section className="ca-workspace">
    <style dangerouslySetInnerHTML={{ __html: workspaceCSS }} />

    {/* One filter row above everything it scopes. It scopes the daily chart
        only, so every other card states its own "All time" scope rather than
        letting the reader assume the range applies to it. */}
    <div className="ca-filter-row">
      <span className="ca-filter-label">Daily activity range</span>
      <div className="ca-range" role="group" aria-label="Daily activity range">
        {analyticsRanges.map((days) => <button aria-pressed={range === days} className={range === days ? "is-active" : ""} key={days} onClick={() => setRange(days)} type="button">{days}d</button>)}
      </div>
      {error ? <span className="ca-inline-error">{error}</span> : null}
    </div>

    <div className={`ca-grid${loading ? " is-refreshing" : ""}`}>
      <div className="ca-kpi-row">
        <StatTile label="Calls connected" value={formatCount(calls.connected)} note={`${formatPercent(analytics.pickup_rate)} of ${formatCount(calls.total)} placed`} />
        <StatTile label="Conversations completed" value={formatCount(calls.successful)} note={`${formatPercent(analytics.success_rate)} of calls placed`} />
        <StatTile label="Leads reached" value={formatCount(leads.contacted)} note={`${formatPercent(analytics.reach_rate)} of ${formatCount(leads.total)} leads`} />
        <StatTile label="Talk time" value={formatDuration(talk.total_seconds)} note={`avg ${formatDuration(talk.average_seconds)} · longest ${formatDuration(talk.longest_seconds)}`} />
      </div>

      <div className="ca-card ca-chart-card">
        <div className="ca-card-head">
          <div>
            <h3>Calls per day</h3>
            <p>Calls placed and how many were answered, over the last {range} days.</p>
          </div>
          <button className="ca-ghost-button" onClick={() => setAsTable((current) => !current)} type="button">{asTable ? "Chart" : "Table"}</button>
        </div>
        {/* The legend belongs to the marks; in the table view the columns are
            already named, so a key to colours nothing would be noise. */}
        {asTable ? null : <div className="ca-legend">
          <span><i style={{ background: accent }} />Answered</span>
          <span><i style={{ background: muted }} />Not answered</span>
        </div>}
        {asTable ? <DailyTable daily={analytics.daily} /> : <DailyChart daily={analytics.daily} />}
      </div>

      <div className="ca-card ca-outcomes-calls">
        <div className="ca-card-head"><div><h3>Call outcomes</h3><p>Where this campaign&rsquo;s calls stand. All time.</p></div></div>
        {hasCalls
          ? <BreakdownList rows={callRows.map((row) => ({ key: row.key, label: row.label, chip: `ca-call-${row.key}`, value: calls[row.key] }))} total={calls.total} />
          : <p className="ca-empty">No calls yet. Add a lead in the Leads tab and this campaign calls it right away.</p>}
      </div>

      <div className="ca-card ca-outcomes-leads">
        <div className="ca-card-head"><div><h3>Lead outcomes</h3><p>Where this campaign&rsquo;s contacts stand. All time.</p></div></div>
        {leads.total > 0
          ? <BreakdownList rows={leadRows.map((row) => ({ key: row.key, label: row.label, chip: `ca-lead-${row.key}`, value: leads[row.key] }))} total={leads.total} />
          : <p className="ca-empty">No leads yet.</p>}
      </div>

      <div className="ca-card ca-wide">
        <div className="ca-card-head"><div><h3>How calls ended</h3><p>The reasons this campaign&rsquo;s calls hung up, most frequent first. All time.</p></div></div>
        {analytics.end_reasons.length > 0
          ? <table className="ca-table"><thead><tr><th>Reason</th><th className="ca-numeric">Calls</th><th className="ca-numeric">Share</th></tr></thead><tbody>{analytics.end_reasons.map((reason) => <tr key={reason.reason}><td>{reason.reason}</td><td className="ca-numeric">{formatCount(reason.count)}</td><td className="ca-numeric">{calls.total > 0 ? formatPercent(reason.count / calls.total) : "—"}</td></tr>)}</tbody></table>
          : <p className="ca-empty">No hangup reasons recorded yet.</p>}
        <p className="ca-footnote">{analytics.first_call_at ? `First call ${formatDateTime(analytics.first_call_at)} · latest ${formatDateTime(analytics.last_call_at)}` : "This campaign has not placed a call yet."}</p>
      </div>
    </div>
  </section>;
}

// DailyChart is a stacked column per day: answered at the baseline, the rest of
// the calls placed above it, so the column height is calls placed and the accent
// segment is the part that connected. A day with no calls is an empty slot, not
// a missing one — a gap in calling is itself worth seeing.
function DailyChart({ daily }: { daily: CampaignDailyActivity[] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [{ width, height }, containerRef] = useMeasuredSize();

  const busiest = daily.reduce((most, day) => Math.max(most, day.calls), 0);
  const { max: axisMax, ticks } = axisScale(busiest);
  const plotWidth = width - plot.left - plot.right;
  const plotHeight = height - plot.top - plot.bottom;
  const band = daily.length > 0 ? plotWidth / daily.length : plotWidth;
  const barWidth = Math.min(maxBarWidth, Math.max(4, band - 8));
  const baseline = plot.top + plotHeight;
  const scale = (value: number) => (axisMax === 0 ? 0 : (value / axisMax) * plotHeight);
  const bandCenter = (index: number) => plot.left + index * band + band / 2;

  if (busiest === 0) {
    return <div className="ca-chart" ref={containerRef}><p className="ca-empty">No calls in this window. Try a longer range, or add a lead to start calling.</p></div>;
  }

  const active = hovered != null ? daily[hovered] : null;

  return <div aria-label={`Calls per day for the last ${daily.length} days`} className="ca-chart" ref={containerRef} role="group">
    <svg height={height} viewBox={`0 0 ${width} ${height}`} width={width}>
      {/* Gridlines and axis: solid hairlines, one shade off the surface. */}
      {ticks.map((tick) => {
        const y = baseline - scale(tick);
        return <g key={tick}>
          <line className="ca-grid-line" x1={plot.left} x2={width - plot.right} y1={y} y2={y} />
          <text className="ca-axis-text" dominantBaseline="middle" textAnchor="end" x={plot.left - 8} y={y}>{tick}</text>
        </g>;
      })}

      {daily.map((day, index) => {
        const answeredHeight = scale(day.answered);
        const restHeight = scale(Math.max(0, day.calls - day.answered));
        const x = bandCenter(index) - barWidth / 2;
        // A 2px gap in the surface colour separates the two segments — never a
        // stroke around them. Only the column's top is a data-end and gets the
        // 4px round; every other corner stays square, including where the
        // accent segment meets the baseline.
        const gap = restHeight > 0 && answeredHeight > 0 ? 2 : 0;
        const answeredY = baseline - answeredHeight;
        const restY = answeredY - gap - restHeight;
        const isHovered = hovered === index;
        return <g key={day.date} opacity={hovered == null || isHovered ? 1 : 0.55}>
          {restHeight > 0 ? <path d={topRoundedColumn(x, restY, barWidth, restHeight)} fill={muted} /> : null}
          {answeredHeight > 0 ? (restHeight > 0
            ? <rect fill={accent} height={answeredHeight} width={barWidth} x={x} y={answeredY} />
            : <path d={topRoundedColumn(x, answeredY, barWidth, answeredHeight)} fill={accent} />) : null}
        </g>;
      })}

      <line className="ca-axis" x1={plot.left} x2={width - plot.right} y1={baseline} y2={baseline} />

      {daily.map((day, index) => showTick(index, daily.length)
        ? <text className="ca-axis-text" key={`label-${day.date}`} textAnchor="middle" x={bandCenter(index)} y={baseline + 18}>{formatDay(day.date)}</text>
        : null)}

      {/* Full-height hit bands, so the hover target is the whole column slot
          rather than the few pixels the bar occupies. */}
      {daily.map((day, index) => <rect
        aria-label={`${formatDay(day.date)}: ${day.calls} placed, ${day.answered} answered`}
        fill="transparent"
        height={plotHeight + plot.top}
        key={`hit-${day.date}`}
        onBlur={() => setHovered(null)}
        onFocus={() => setHovered(index)}
        onMouseEnter={() => setHovered(index)}
        onMouseLeave={() => setHovered(null)}
        role="img"
        tabIndex={0}
        width={band}
        x={plot.left + index * band}
        y={0}
      />)}
    </svg>

    {active ? <div className="ca-tooltip" style={{ left: `${tooltipOffset(bandCenter(hovered ?? 0), width)}%` }}>
      <strong>{formatDay(active.date)}</strong>
      <span><i style={{ background: accent }} />Answered<b>{active.answered}</b></span>
      <span><i style={{ background: muted }} />Not answered<b>{active.calls - active.answered}</b></span>
      <span className="ca-tooltip-total">Placed<b>{active.calls}</b></span>
    </div> : null}
  </div>;
}

// DailyTable is the chart's table-view twin: the same numbers, reachable
// without reading a mark.
function DailyTable({ daily }: { daily: CampaignDailyActivity[] }) {
  return <div className="ca-table-wrap"><table className="ca-table"><thead><tr><th>Day</th><th className="ca-numeric">Placed</th><th className="ca-numeric">Answered</th><th className="ca-numeric">Not answered</th></tr></thead><tbody>{daily.map((day) => <tr key={day.date}><td>{formatDay(day.date)}</td><td className="ca-numeric">{day.calls}</td><td className="ca-numeric">{day.answered}</td><td className="ca-numeric">{day.calls - day.answered}</td></tr>)}</tbody></table></div>;
}

// BreakdownList is one bar per category, all in a single hue: colouring each bar
// differently would only re-encode the length the chart already shows. Identity
// comes from the status chip beside it, which carries both its colour and its
// label, so nothing here is colour-alone. Bars are scaled to the largest
// category so the small ones stay visible; the share of the whole is the number
// printed beside each.
function BreakdownList({ rows, total }: { rows: { key: string; label: string; chip: string; value: number }[]; total: number }) {
  const largest = rows.reduce((most, row) => Math.max(most, row.value), 0);
  return <ul className="ca-breakdown">
    {rows.map((row) => <li key={row.key}>
      <span className={`ca-chip ${row.chip}`}><i />{row.label}</span>
      <span className="ca-bar-track"><span className="ca-bar" style={{ width: `${largest > 0 ? (row.value / largest) * 100 : 0}%` }} /></span>
      <span className="ca-bar-value">{formatCount(row.value)}<small>{total > 0 ? formatPercent(row.value / total) : "—"}</small></span>
    </li>)}
  </ul>;
}

function StatTile({ label, note, value }: { label: string; note: string; value: string }) {
  return <div className="ca-card ca-stat"><span>{label}</span><strong>{value}</strong><small>{note}</small></div>;
}

// useMeasuredSize reports the rendered size of the element it is attached to, so
// the chart can be drawn at one SVG unit per pixel at whatever size its card
// gives it. The container takes its height from the grid row rather than from
// its contents, so sizing the drawing to the measurement cannot feed back into
// it. It starts at a sensible size so the first paint is already close.
type Size = { width: number; height: number };

function useMeasuredSize(): [Size, (node: HTMLDivElement | null) => void] {
  const [size, setSize] = useState<Size>({ width: 640, height: 240 });
  const observed = useRef<HTMLDivElement | null>(null);

  const read = (node: HTMLDivElement) => ({
    width: Math.round(node.clientWidth) || 640,
    height: Math.max(minPlotHeight, Math.round(node.clientHeight) || 240),
  });

  useEffect(() => {
    const node = observed.current;
    if (!node || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => {
      const next = read(node);
      setSize((current) => (current.width === next.width && current.height === next.height ? current : next));
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return [size, (node) => {
    observed.current = node;
    if (node) {
      const next = read(node);
      setSize((current) => (current.width === next.width && current.height === next.height ? current : next));
    }
  }];
}

// topRoundedColumn draws a column with a 4px rounded data-end and a square foot.
// The radius is capped by the column's own width and height so a one-call day
// renders as a short bar rather than a lozenge.
function topRoundedColumn(x: number, y: number, width: number, height: number) {
  const radius = Math.min(4, width / 2, height);
  return `M${x},${y + height} L${x},${y + radius} Q${x},${y} ${x + radius},${y} L${x + width - radius},${y} Q${x + width},${y} ${x + width},${y + radius} L${x + width},${y + height} Z`;
}

// tooltipOffset keeps the tooltip inside the card when the hovered column is at
// either end, where centring it on the column would push it past the edge.
function tooltipOffset(centerX: number, width: number) {
  return Math.min(86, Math.max(14, (centerX / width) * 100));
}

// axisScale picks the axis top and its ticks from a ladder of round steps, so
// the labels always read 0 / 5 / 10 / 15 rather than 0 / 3.5 / 7. Every tick is
// a whole number because the values are counts — a tick at 2.5 calls would be
// nonsense — and the top is the first round step at or above the busiest day.
function axisScale(busiest: number) {
  if (busiest <= 0) return { max: 0, ticks: [0] };
  const steps = [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000];
  // Aim for three or four intervals; the first step that gets there wins.
  const step = steps.find((candidate) => busiest / candidate <= 4) ?? steps[steps.length - 1];
  const max = Math.ceil(busiest / step) * step;
  const ticks: number[] = [];
  for (let tick = 0; tick <= max; tick += step) ticks.push(tick);
  return { max, ticks };
}

// showTick thins the x-axis labels so 30 days of dates cannot collide: always
// the first and last, then an even spread of about six in between.
function showTick(index: number, count: number) {
  if (count <= 1) return true;
  if (index === 0 || index === count - 1) return true;
  const step = Math.ceil(count / 6);
  return index % step === 0 && index < count - Math.ceil(step / 2);
}

function formatDay(value: string) {
  // The wire date is a plain YYYY-MM-DD calendar day; parsing it as UTC and
  // formatting in UTC keeps it the day the server meant, whatever the reader's
  // timezone would otherwise shift it to.
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? value : dateFormatter.format(date);
}
function formatDateTime(value: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(date);
}
function formatCount(value: number) { return new Intl.NumberFormat("en-US").format(value); }
function formatPercent(value: number) { return percentFormatter.format(value); }
function formatDuration(seconds: number) {
  if (!seconds) return "0s";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours) return `${hours}h ${minutes}m`;
  if (minutes) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}

const workspaceCSS = `
.ca-workspace{display:grid;gap:14px}
.ca-filter-row{align-items:center;display:flex;flex-wrap:wrap;gap:10px}.ca-filter-label{color:var(--faint);font-size:10.5px;font-weight:800;letter-spacing:.7px;text-transform:uppercase}.ca-range{background:var(--app-surface-2);border:1px solid var(--app-line);border-radius:9px;display:inline-flex;gap:2px;padding:2px}.ca-range button{background:transparent;border:0;border-radius:7px;color:var(--app-nav);cursor:pointer;font:inherit;font-size:11.5px;font-weight:750;padding:5px 11px}.ca-range button:hover{color:var(--app-text-strong)}.ca-range button.is-active{background:var(--app-primary-soft);box-shadow:inset 0 0 0 1px var(--app-primary-border);color:var(--app-primary-text)}.ca-inline-error{color:var(--app-rose-text);font-size:11.5px}
/* The chart sits beside the two breakdown cards rather than above them: at half
   width its 14 columns land at a readable bar-to-gap ratio, and the two stacked
   cards fill the height it needs instead of leaving a hole. */
.ca-grid{align-items:start;display:grid;gap:14px;grid-template-columns:minmax(0,1fr) minmax(0,1fr)}.ca-grid.is-refreshing{opacity:.6}.ca-kpi-row{display:grid;gap:14px;grid-column:1/-1;grid-template-columns:repeat(4,minmax(0,1fr))}.ca-chart-card{align-self:stretch;display:flex;flex-direction:column;grid-column:1;grid-row:2/span 2}.ca-outcomes-calls{grid-column:2;grid-row:2}.ca-outcomes-leads{grid-column:2;grid-row:3}.ca-wide{grid-column:1/-1}
.ca-card{background:var(--app-surface);border:1px solid var(--border);border-radius:16px;padding:16px}.ca-message{color:var(--muted);font-size:12.5px;padding:40px;text-align:center}.ca-error{color:var(--app-rose-text)}
.ca-stat{display:grid;gap:5px;padding:15px}.ca-stat>span{color:var(--faint);font-size:10.5px;font-weight:800;letter-spacing:.7px;text-transform:uppercase}.ca-stat>strong{font-size:25px;letter-spacing:-.5px}.ca-stat>small{color:var(--muted);font-size:11px}
.ca-card-head{align-items:flex-start;display:flex;gap:12px;justify-content:space-between;margin-bottom:12px}.ca-card-head h3{font-size:13.5px;margin:0}.ca-card-head p{color:var(--muted);font-size:11.5px;margin:4px 0 0}.ca-ghost-button{background:var(--app-elevated);border:1px solid var(--app-line);border-radius:8px;color:var(--app-text-soft);cursor:pointer;font:inherit;font-size:11px;font-weight:750;padding:5px 10px;white-space:nowrap}.ca-ghost-button:hover{background:var(--app-line-soft);color:var(--app-text-strong)}
.ca-legend{color:var(--muted);display:flex;font-size:11px;gap:14px;margin-bottom:6px}.ca-legend span{align-items:center;display:inline-flex;gap:6px}.ca-legend i,.ca-tooltip i{border-radius:3px;display:inline-block;height:9px;width:9px}
.ca-chart{flex:1 1 0;min-height:${minPlotHeight}px;position:relative}.ca-chart svg{display:block;overflow:visible}.ca-grid-line{stroke:var(--app-panel-hover);stroke-width:1}.ca-axis{stroke:var(--app-line-strong);stroke-width:1}.ca-axis-text{fill:var(--app-muted);font-family:inherit;font-size:10px;font-variant-numeric:tabular-nums}.ca-chart rect[tabindex]:focus-visible{outline:2px solid var(--app-primary-2);outline-offset:-2px}
.ca-tooltip{background:var(--app-elevated);border:1px solid var(--app-line-strong);border-radius:10px;box-shadow:0 12px 30px var(--app-shadow-color);display:grid;gap:5px;font-size:11px;min-width:150px;padding:9px 11px;pointer-events:none;position:absolute;top:2px;transform:translateX(-50%);z-index:5}.ca-tooltip strong{font-size:11.5px}.ca-tooltip span{align-items:center;color:var(--muted);display:flex;gap:6px}.ca-tooltip b{color:var(--app-text-strong);font-variant-numeric:tabular-nums;margin-left:auto}.ca-tooltip-total{border-top:1px solid var(--app-line);padding-top:5px}
.ca-breakdown{display:grid;gap:9px;list-style:none;margin:0;padding:0}.ca-breakdown li{align-items:center;display:grid;gap:10px;grid-template-columns:132px minmax(0,1fr) 74px}.ca-chip{align-items:center;border-radius:999px;display:inline-flex;font-size:10px;font-weight:750;gap:5px;justify-self:start;padding:3px 8px;white-space:nowrap}.ca-chip i{background:currentColor;border-radius:50%;height:5px;width:5px}
/* Status chips, matching the colour each status already wears in the Leads and
   Calls tabs — a status that changed hue between tabs would read as a different
   thing. Every chip carries its label, so none of them is colour alone. */
.ca-lead-pending{background:var(--app-amber-soft);color:var(--app-amber)}.ca-lead-calling,.ca-call-received{background:var(--app-blue-soft);color:var(--app-blue)}.ca-lead-contacted,.ca-call-answered{background:var(--app-green-soft);color:var(--app-green)}.ca-lead-failed,.ca-call-failed{background:var(--app-pink-soft);color:var(--app-pink)}.ca-lead-opted_out,.ca-call-ended{background:var(--app-slate-soft);color:var(--app-slate)}.ca-call-declined{background:var(--app-amber-soft);color:var(--app-amber)}
.ca-bar-track{background:var(--app-panel-hover);border-radius:4px;height:8px;overflow:hidden}.ca-bar{background:var(--app-primary-2);border-radius:0 4px 4px 0;display:block;height:100%;min-width:0}.ca-bar-value{color:var(--app-text-soft);display:flex;font-size:12px;font-variant-numeric:tabular-nums;font-weight:750;gap:6px;justify-content:flex-end}.ca-bar-value small{color:var(--faint);font-size:10.5px;font-weight:600}
.ca-table-wrap{max-height:280px;overflow:auto}.ca-chart-card .ca-table-wrap{flex:1 1 0;max-height:none;min-height:0}.ca-table{border-collapse:collapse;width:100%}.ca-table th{border-bottom:1px solid var(--border);color:var(--app-muted);font-size:10.5px;font-weight:650;padding:8px 8px;text-align:left;white-space:nowrap}.ca-table td{border-bottom:1px solid var(--app-line);color:var(--app-text-soft);font-size:11.5px;padding:8px}.ca-numeric{font-variant-numeric:tabular-nums;text-align:right}
.ca-empty{color:var(--muted);font-size:11.5px;line-height:1.6;margin:0;padding:22px 0;text-align:center}.ca-footnote{color:var(--faint);font-size:10.5px;margin:12px 0 0}
@media(max-width:1050px){.ca-kpi-row{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:820px){.ca-grid{grid-template-columns:1fr}.ca-chart-card,.ca-outcomes-calls,.ca-outcomes-leads{grid-column:1;grid-row:auto}.ca-chart-card{align-self:auto}.ca-chart{min-height:220px}.ca-breakdown li{grid-template-columns:118px minmax(0,1fr) 68px}}
@media(max-width:560px){.ca-kpi-row{grid-template-columns:1fr}.ca-breakdown li{grid-template-columns:1fr auto;row-gap:4px}.ca-bar-track{grid-column:1/-1}}
`;

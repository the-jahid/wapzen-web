"use client";

import { useEffect, useState } from "react";

// How many threads one page of an inbox holds. The server allows up to 200; 20
// keeps a page quick to load and short enough to scan.
export const CONVERSATION_PAGE_SIZE = 20;

// The search box filters on the server now, so a keystroke must not cost a
// request: the query follows the box only once typing pauses.
export function useDebouncedValue<T>(value: T, delayMs = 300): T {
  const [settled, setSettled] = useState(value);
  useEffect(() => {
    const timer = window.setTimeout(() => setSettled(value), delayMs);
    return () => window.clearTimeout(timer);
  }, [value, delayMs]);
  return settled;
}

// Page buttons to show: every page when there are few, otherwise the first, the
// last and the neighbours of the current one, with gaps marked "gap".
export function pageSlots(page: number, totalPages: number): Array<number | "gap"> {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1);
  if (page <= 4) return [1, 2, 3, 4, 5, "gap", totalPages];
  if (page >= totalPages - 3)
    return [1, "gap", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  return [1, "gap", page - 1, page, page + 1, "gap", totalPages];
}

// The footer under a conversation list: which threads are showing, and buttons
// to move between server pages.
export default function ConversationPager({
  page,
  totalPages,
  total,
  pageSize = CONVERSATION_PAGE_SIZE,
  busy = false,
  label = "Pages",
  onPage,
}: {
  page: number;
  totalPages: number;
  total: number;
  pageSize?: number;
  busy?: boolean;
  label?: string;
  onPage: (page: number) => void;
}) {
  if (total <= 0) return null;
  const current = Math.min(Math.max(page, 1), Math.max(totalPages, 1));
  const from = (current - 1) * pageSize + 1;
  const to = Math.min(current * pageSize, total);
  const go = (next: number) => {
    if (next < 1 || next > totalPages || next === current) return;
    onPage(next);
  };

  return (
    <nav aria-label={label} className={`cpg${busy ? " is-busy" : ""}`}>
      <style dangerouslySetInnerHTML={{ __html: pagerCSS }} />
      <span className="cpg-range">
        {from}–{to} of {total}
      </span>
      <span className="cpg-buttons">
        <button
          aria-label="Previous page"
          className="cpg-button cpg-arrow"
          disabled={current <= 1}
          onClick={() => go(current - 1)}
          type="button"
        >
          <ArrowIcon flip />
        </button>
        {pageSlots(current, totalPages).map((slot, index) =>
          slot === "gap" ? (
            <span aria-hidden="true" className="cpg-gap" key={`gap-${index}`}>
              …
            </span>
          ) : (
            <button
              aria-current={slot === current ? "page" : undefined}
              aria-label={`Page ${slot}`}
              className={`cpg-button${slot === current ? " is-current" : ""}`}
              key={slot}
              onClick={() => go(slot)}
              type="button"
            >
              {slot}
            </button>
          )
        )}
        <button
          aria-label="Next page"
          className="cpg-button cpg-arrow"
          disabled={current >= totalPages}
          onClick={() => go(current + 1)}
          type="button"
        >
          <ArrowIcon />
        </button>
      </span>
    </nav>
  );
}

function ArrowIcon({ flip = false }: { flip?: boolean }) {
  return (
    <svg aria-hidden="true" fill="none" height="14" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="14">
      <path d={flip ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} />
    </svg>
  );
}

const pagerCSS = `
.cpg{align-items:center;border-top:1px solid var(--app-border);display:flex;flex:0 0 auto;flex-wrap:wrap;gap:8px 10px;justify-content:space-between;padding-top:12px;transition:opacity .16s ease}
.cpg.is-busy{opacity:.6}
.cpg-range{color:var(--app-subtle);font-size:11.5px;font-variant-numeric:tabular-nums;white-space:nowrap}
.cpg-buttons{align-items:center;display:flex;gap:3px;margin-left:auto}
.cpg-button{align-items:center;background:transparent;border:1px solid transparent;border-radius:7px;color:var(--app-muted);cursor:pointer;display:inline-flex;font:inherit;font-size:12px;font-variant-numeric:tabular-nums;height:28px;justify-content:center;min-width:28px;padding:0 6px;transition:background .16s ease,color .16s ease,border-color .16s ease}
.cpg-button:hover:not(:disabled):not(.is-current){background:var(--app-hover);color:var(--app-text)}
.cpg-button:focus-visible{border-color:var(--app-primary);outline:none}
.cpg-button.is-current{background:var(--app-primary-soft);border-color:var(--app-primary);color:var(--app-primary-text);cursor:default;font-weight:700}
.cpg-arrow{border-color:var(--app-border-strong)}
.cpg-button:disabled{cursor:not-allowed;opacity:.35}
.cpg-gap{color:var(--app-faint);font-size:12px;min-width:16px;text-align:center}
@media(max-width:900px){
  .cpg-button{height:34px;min-width:34px}
}
`;

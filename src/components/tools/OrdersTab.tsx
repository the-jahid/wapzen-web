"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  MessageSquare,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Trash2,
} from "lucide-react";
import { listDashboardChatAgents } from "@/lib/chatAgents";
import {
  deleteOrder,
  exportOrders,
  getOrdersVersion,
  listOrders,
  orderStatuses,
  updateOrder,
  type ApiOrder,
  type OrderStatus,
} from "@/lib/orders";
import { useCachedState } from "@/lib/pageCache";
import { startRefreshing } from "@/lib/polling";

// Every order the account's agents have taken. An order arrives whenever a
// customer confirms one, so the list re-reads itself on the same slow timer as
// the Conversations inbox; the server has nothing to push it with.
const refreshMs = 15000;
// The list is read after this many turns even if it seems unchanged, for the few
// things that don't touch an order's row, such as its agent being renamed.
const listAtLeastEvery = 20;
const pageSize = 50;
const searchDelayMs = 300;

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

type Notify = (kind: "success" | "error", text: string) => void;
type AgentOption = { id: string; name: string };
type OrderPage = { items: ApiOrder[]; total: number };

function statusMeta(status: OrderStatus) {
  return orderStatuses.find((item) => item.id === status) ?? orderStatuses[0];
}

// The agent may leave the description out, so the list falls back on what was
// collected instead: the details the order instructions asked for.
function orderSummary(order: ApiOrder) {
  return (
    order.description ||
    order.items.map((item) => item.name).join(", ") ||
    (order.custom_fields ?? []).map((field) => `${field.label}: ${field.value}`).join(", ")
  );
}

export default function OrdersTab({
  onNewCount,
  onNotice,
}: {
  // The tab's badge lives on the page above, which reads this from every fetch.
  onNewCount: (count: number) => void;
  onNotice: Notify;
}) {
  const { getToken } = useAuth();
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<OrderStatus | "">("");
  const [agentId, setAgentId] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [agents, setAgents] = useCachedState<AgentOption[]>("conversations:agent-options", []);

  const filters = useMemo(
    () => ({ search, status, agentId, dateFrom, dateTo }),
    [agentId, dateFrom, dateTo, search, status]
  );
  const hasFilters = Boolean(search || status || agentId || dateFrom || dateTo);
  // On phones and tablets the status, agent and date filters fold behind a
  // Filters button; the count says how many are on while they are hidden.
  const [filtersOpen, setFiltersOpen] = useState(false);
  const activeFilterCount = [status, agentId, dateFrom, dateTo].filter(Boolean).length;
  // Cached per filter set, so going back to one shows its rows at once.
  const [orderPage, setOrderPage, hasCachedPage] = useCachedState<OrderPage>(
    `orders:${JSON.stringify(filters)}:${pageNumber}`,
    { items: [], total: 0 }
  );
  const { items: orders, total } = orderPage;
  // Retell-style master-detail: the newest order is open until another is
  // picked; selectedId is only the explicit pick (on phones it swaps the list
  // pane for the detail pane).
  const selected = orders.find((order) => order.id === selectedId) ?? orders[0] ?? null;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(query.trim());
      setPageNumber(1);
    }, searchDelayMs);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const result = await listOrders(getToken, { ...filters, page: pageNumber, limit: pageSize });
        if (cancelled) return;
        setOrderPage({ items: result.items, total: result.total });
        onNewCount(result.newOrders);
        setError("");
      } catch (loadError) {
        if (cancelled) return;
        setError(loadError instanceof Error ? loadError.message : "Could not load orders");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [filters, getToken, onNewCount, pageNumber, reloadKey, setOrderPage]);

  // Each turn asks whether any order changed, and only then downloads the page
  // again. The answer carries the badge count, so that stays current either way.
  // If the question can't be answered, the page is read anyway, as it would be
  // without it.
  useEffect(() => {
    let cancelled = false;
    let knownVersion: string | null = null;
    let turnsSinceList = 0;
    const stopRefreshing = startRefreshing(async () => {
      const state = await getOrdersVersion(getToken).catch(() => null);
      if (cancelled) return;
      turnsSinceList += 1;
      if (state) onNewCount(state.newOrders);
      if (state !== null && state.version === knownVersion && turnsSinceList < listAtLeastEvery) return;
      knownVersion = state?.version ?? null;
      turnsSinceList = 0;
      setReloadKey((key) => key + 1);
    }, refreshMs);
    return () => {
      cancelled = true;
      stopRefreshing();
    };
  }, [getToken, onNewCount]);

  // The agent list only fills the filter, so failing to load it costs the
  // filter and nothing else.
  useEffect(() => {
    let cancelled = false;
    listDashboardChatAgents(getToken)
      .then((list) => {
        if (!cancelled) setAgents(list.map((agent) => ({ id: agent.id, name: agent.agent.name })));
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [getToken, setAgents]);

  function replaceOrder(saved: ApiOrder) {
    setOrderPage((current) => ({
      ...current,
      items: current.items.map((order) => (order.id === saved.id ? saved : order)),
    }));
    setReloadKey((key) => key + 1);
  }

  function dropOrder(id: string) {
    setOrderPage((current) => ({
      items: current.items.filter((order) => order.id !== id),
      total: Math.max(0, current.total - 1),
    }));
    setSelectedId("");
    setReloadKey((key) => key + 1);
  }

  async function downloadCsv() {
    if (isExporting) return;
    setIsExporting(true);
    try {
      const blob = await exportOrders(filters, getToken);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (exportError) {
      onNotice("error", exportError instanceof Error ? exportError.message : "Could not export orders");
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <div className={`tools-split${selectedId ? " has-selection" : ""}`}>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <aside aria-label="Orders" className="tools-pane-list orders-pane-list">
        <div className="tools-pane-head">
          <ShoppingBag size={17} strokeWidth={1.8} />
          <h1 className="tools-pane-title">Orders</h1>
          <button
            aria-label="Export CSV"
            className="orders-pane-icon orders-export-btn"
            disabled={isExporting || total === 0}
            onClick={downloadCsv}
            title={isExporting ? "Exporting…" : "Export CSV"}
            type="button"
          >
            <Download size={15} />
            <span className="orders-export-label">{isExporting ? "Exporting…" : "Export"}</span>
          </button>
        </div>

        <div className="orders-pane-filters">
          <div className="orders-search-row">
            <label className="orders-pane-search">
              <Search size={14} />
              <input
                aria-label="Search orders"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Name, phone, email or order #"
                value={query}
              />
            </label>
            <button
              aria-controls="orders-more-filters"
              aria-expanded={filtersOpen}
              className={`orders-filters-btn${activeFilterCount > 0 ? " is-on" : ""}`}
              onClick={() => setFiltersOpen((open) => !open)}
              type="button"
            >
              <SlidersHorizontal size={15} />
              <span>Filters</span>
              {activeFilterCount > 0 ? <span className="orders-filters-count">{activeFilterCount}</span> : null}
            </button>
          </div>
          <div className="orders-more-filters" data-open={filtersOpen || undefined} id="orders-more-filters">
          <div className="orders-pane-row">
            <select
              aria-label="Filter by status"
              className="orders-pane-select"
              onChange={(event) => {
                setStatus(event.target.value as OrderStatus | "");
                setPageNumber(1);
              }}
              value={status}
            >
              <option value="">All statuses</option>
              {orderStatuses.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
            <select
              aria-label="Filter by agent"
              className="orders-pane-select"
              onChange={(event) => {
                setAgentId(event.target.value);
                setPageNumber(1);
              }}
              value={agentId}
            >
              <option value="">All agents</option>
              {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name}
                </option>
              ))}
            </select>
          </div>
          <div className="orders-pane-row">
            <label className="orders-date-field">
              <span className="orders-date-label">From</span>
              <input
                aria-label="From date"
                className="orders-pane-select"
                max={dateTo || undefined}
                onChange={(event) => {
                  setDateFrom(event.target.value);
                  setPageNumber(1);
                }}
                type="date"
                value={dateFrom}
              />
            </label>
            <label className="orders-date-field">
              <span className="orders-date-label">To</span>
              <input
                aria-label="To date"
                className="orders-pane-select"
                min={dateFrom || undefined}
                onChange={(event) => {
                  setDateTo(event.target.value);
                  setPageNumber(1);
                }}
                type="date"
                value={dateTo}
              />
            </label>
          </div>
          </div>
        </div>

        <nav className="tools-pane-items">
          {error && orders.length === 0 ? (
            <p className="tools-pane-note">{error}</p>
          ) : loading && !hasCachedPage ? (
            <p className="tools-pane-note">Loading orders…</p>
          ) : orders.length === 0 ? (
            <>
              <p className="tools-pane-note orders-empty-note">
                {hasFilters ? "No orders match these filters." : "No orders yet."}
              </p>
              {/* Phones and tablets have no detail pane beside the list, so the
                  list itself explains where orders come from. */}
              <div className="orders-list-empty">
                <span className="orders-list-empty-icon">
                  <ShoppingBag size={24} strokeWidth={1.7} />
                </span>
                <p className="orders-list-empty-title">
                  {hasFilters ? "No orders match these filters" : "No orders yet"}
                </p>
                <p className="orders-list-empty-copy">
                  {hasFilters
                    ? "Try another status, agent or date range."
                    : "Orders show up here when an agent with Take Order on confirms one in a chat."}
                </p>
                {hasFilters ? null : (
                  <Link className="tools-dark-btn orders-empty-link" href="/dashboard/chat">
                    Open chat agents
                  </Link>
                )}
              </div>
            </>
          ) : (
            orders.map((order) => {
              const isActive = selected?.id === order.id;
              return (
                <button
                  aria-current={isActive ? "true" : undefined}
                  className={`orders-pane-item${isActive ? " is-active" : ""}`}
                  key={order.id}
                  onClick={() => setSelectedId(order.id)}
                  type="button"
                >
                  <span className="orders-pane-item-body">
                    <span className="orders-pane-item-top">
                      <span className="orders-pane-item-name notranslate">
                        #{order.order_number} · {order.customer_name || "No name"}
                      </span>
                      <span className="orders-pane-item-time">{dateFormatter.format(new Date(order.created_at))}</span>
                    </span>
                    <span className="orders-pane-item-sub notranslate">{orderSummary(order) || order.phone || "—"}</span>
                  </span>
                  <span
                    className={`orders-pane-dot tools-accent-${statusMeta(order.status).accent}`}
                    title={statusMeta(order.status).label}
                  />
                </button>
              );
            })
          )}
        </nav>

        {pageCount > 1 ? (
          <div className="orders-pager">
            <button
              aria-label="Previous page"
              className="orders-pane-icon"
              disabled={pageNumber <= 1}
              onClick={() => setPageNumber((current) => current - 1)}
              type="button"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="tools-pane-note">
              Page {pageNumber} of {pageCount}
            </span>
            <button
              aria-label="Next page"
              className="orders-pane-icon"
              disabled={pageNumber >= pageCount}
              onClick={() => setPageNumber((current) => current + 1)}
              type="button"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        ) : null}
      </aside>

      <section className="tools-pane-detail">
        <button className="orders-pane-back" onClick={() => setSelectedId("")} type="button">
          <ArrowLeft size={15} />
          Orders
        </button>
        {selected ? (
          <OrderDetail
            key={selected.id}
            onDeleted={dropOrder}
            onNotice={onNotice}
            onSaved={replaceOrder}
            order={selected}
          />
        ) : !loading && !error && orders.length === 0 && !hasFilters ? (
          <section className="tools-empty">
            <span className="tools-empty-icon">
              <ShoppingBag size={32} strokeWidth={1.6} />
            </span>
            <h2 className="tools-empty-title">No orders yet</h2>
            <p className="tools-empty-copy">Enable &apos;Take Order&apos; on an agent to start receiving orders.</p>
            <Link className="tools-dark-btn orders-empty-link" href="/dashboard/chat">
              Open chat agents
            </Link>
          </section>
        ) : null}
      </section>
    </div>
  );
}

// OrderDetail shows one order in full in the right pane. The status saves as
// soon as it is picked; the note holds a draft until Save, so a re-read of the
// list can't overwrite what is being typed. The parent keys this on the order id.
function OrderDetail({
  order,
  onDeleted,
  onNotice,
  onSaved,
}: {
  order: ApiOrder;
  onDeleted: (id: string) => void;
  onNotice: Notify;
  onSaved: (order: ApiOrder) => void;
}) {
  const { getToken } = useAuth();
  const [note, setNote] = useState(order.internal_note ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const noteChanged = note.trim() !== (order.internal_note ?? "");
  const meta = statusMeta(order.status);

  async function save(update: { status?: OrderStatus; internal_note?: string | null }) {
    setIsSaving(true);
    try {
      onSaved(await updateOrder(order.id, update, getToken));
      onNotice("success", `Order #${order.order_number} saved.`);
    } catch (saveError) {
      onNotice("error", saveError instanceof Error ? saveError.message : "Could not save the order");
    } finally {
      setIsSaving(false);
    }
  }

  async function remove() {
    setIsSaving(true);
    try {
      await deleteOrder(order.id, getToken);
      onDeleted(order.id);
      onNotice("success", `Order #${order.order_number} deleted.`);
    } catch (deleteError) {
      onNotice("error", deleteError instanceof Error ? deleteError.message : "Could not delete the order");
      setIsSaving(false);
    }
  }

  async function copy(label: string, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      onNotice("success", `${label} copied.`);
    } catch {
      onNotice("error", `Could not copy the ${label.toLowerCase()}.`);
    }
  }

  return (
    <div className="tools-detail orders-detail">
      <header className="tools-rt-head">
        <div style={{ minWidth: 0 }}>
          <h2 className="tools-rt-title">Order #{order.order_number}</h2>
          <div className="tools-rt-line">
            <span className={`orders-status-line tools-accent-${meta.accent}`}>
              <span className="orders-pane-dot" />
              {meta.label}
            </span>
            <span className="tools-rt-dot" />
            <span>{dateFormatter.format(new Date(order.created_at))}</span>
            <span className="tools-rt-dot" />
            <span>{order.channel === "voice" ? "Voice" : "Chat"}</span>
            <span className="tools-rt-dot" />
            <span>{order.agent_name ?? "Deleted agent"}</span>
          </div>
        </div>
        <div className="tools-rt-buttons">
          {confirmingDelete ? (
            <>
              <span className="orders-confirm">Delete this order for good?</span>
              <button className="orders-outline-btn" onClick={() => setConfirmingDelete(false)} type="button">
                Keep
              </button>
              <button className="orders-outline-btn is-danger" disabled={isSaving} onClick={remove} type="button">
                Delete
              </button>
            </>
          ) : (
            <>
              {order.conversation_id ? (
                <Link
                  className="tools-dark-btn"
                  href={`/dashboard/conversations/${encodeURIComponent(order.conversation_id)}`}
                >
                  <MessageSquare size={15} />
                  Conversation
                </Link>
              ) : null}
              <button
                aria-label="Delete order"
                className="tools-outline-icon"
                onClick={() => setConfirmingDelete(true)}
                title="Delete order"
                type="button"
              >
                <Trash2 size={16} />
              </button>
            </>
          )}
        </div>
      </header>

      <div className="orders-detail-body">
        <label className="tools-field orders-status-field">
          <span className="tools-field-label">Status</span>
          <select
            className="tools-select"
            disabled={isSaving}
            onChange={(event) => save({ status: event.target.value as OrderStatus })}
            value={order.status}
          >
            {orderStatuses.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>

        <dl className="orders-facts">
          <Fact label="Customer">{order.customer_name || "Not given"}</Fact>
          <Fact label="Phone">
            {order.phone ? (
              <span className="orders-copyable">
                <span className="tools-mono">{order.phone}</span>
                <CopyButton label="Phone" onCopy={() => copy("Phone", order.phone)} />
              </span>
            ) : (
              "Not given"
            )}
          </Fact>
          <Fact label="Email">
            {order.email ? (
              <span className="orders-copyable">
                <span>{order.email}</span>
                <CopyButton label="Email" onCopy={() => copy("Email", order.email ?? "")} />
              </span>
            ) : (
              "Not given"
            )}
          </Fact>
          <Fact label="Delivery address">{order.delivery_address ?? "Not given"}</Fact>
          {(order.custom_fields ?? []).map((field) => (
            <Fact key={field.key} label={field.label}>
              {field.value}
            </Fact>
          ))}
        </dl>

        {order.description ? (
          <div className="tools-field">
            <span className="tools-field-label">Description</span>
            <p className="orders-text notranslate">{order.description}</p>
          </div>
        ) : null}

        {order.items.length > 0 ? (
          <div className="tools-field">
            <span className="tools-field-label">Items</span>
            <ul className="orders-items notranslate">
              {order.items.map((item, index) => (
                <li key={`${item.name}-${index}`}>
                  <span className="orders-strong">
                    {item.quantity !== undefined ? `${item.quantity} × ` : ""}
                    {item.name}
                  </span>
                  {item.note ? <span className="tools-field-hint">{item.note}</span> : null}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <label className="tools-field">
          <span className="tools-field-label">Internal note</span>
          <textarea
            className="tools-textarea"
            maxLength={2000}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Only you can see this. The customer never does."
            value={note}
          />
        </label>
        <div>
          <button
            className="tools-dark-btn"
            disabled={!noteChanged || isSaving}
            onClick={() => save({ internal_note: note.trim() || null })}
            type="button"
          >
            Save note
          </button>
        </div>
      </div>
    </div>
  );
}

function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="orders-fact">
      <dt className="tools-field-label">{label}</dt>
      {/* Customer details: kept as typed, and out of what the page sends to Google. */}
      <dd className="notranslate">{children}</dd>
    </div>
  );
}

function CopyButton({ label, onCopy }: { label: string; onCopy: () => void }) {
  return (
    <button aria-label={`Copy ${label.toLowerCase()}`} className="orders-copy" onClick={onCopy} title="Copy" type="button">
      <Copy size={13} />
    </button>
  );
}

const css = `
/* Orders use the Tools master-detail classes (tools-split / tools-pane-*);
   these are the orders-only pieces. */
.orders-pane-list { flex-basis: 320px; }
.orders-pane-icon { align-items: center; background: transparent; border: 1px solid var(--app-border-strong); border-radius: 8px; color: var(--app-muted); cursor: pointer; display: inline-flex; height: 32px; justify-content: center; width: 32px; }
.orders-pane-icon:hover:not(:disabled) { background: var(--app-hover); color: var(--app-text); }
.orders-pane-icon:disabled { cursor: not-allowed; opacity: .4; }
.orders-pane-filters { display: grid; gap: 8px; padding-top: 12px; }
.orders-pane-search { align-items: center; background: var(--app-surface); border: 1px solid var(--app-border-strong); border-radius: 8px; color: var(--app-subtle); display: flex; gap: 7px; height: 34px; padding: 0 10px; transition: border-color .16s ease; }
.orders-pane-search:focus-within { border-color: var(--app-primary); }
.orders-pane-search input { background: transparent; border: 0; color: var(--app-text); font-size: 13px; min-width: 0; outline: none; width: 100%; }
.orders-pane-search input::placeholder { color: var(--app-subtle); }
.orders-pane-row { display: grid; gap: 8px; grid-template-columns: repeat(2, minmax(0, 1fr)); }
.orders-pane-select { background-color: var(--app-surface); border: 1px solid var(--app-border-strong); border-radius: 8px; color: var(--app-text); font: inherit; font-size: 13px; height: 34px; min-width: 0; outline: none; padding: 0 10px; transition: border-color .16s ease; width: 100%; }
.orders-pane-select:hover { border-color: var(--app-muted); }
.orders-pane-select:focus { border-color: var(--app-primary); }
/* Selects get one quiet chevron instead of each browser's own arrow. */
select.orders-pane-select { appearance: none; -webkit-appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E"); background-position: right 10px center; background-repeat: no-repeat; cursor: pointer; overflow: hidden; padding-right: 28px; text-overflow: ellipsis; white-space: nowrap; }
input[type="date"].orders-pane-select { cursor: text; padding-right: 6px; }
input[type="date"].orders-pane-select::-webkit-calendar-picker-indicator { cursor: pointer; opacity: .55; }
input[type="date"].orders-pane-select::-webkit-calendar-picker-indicator:hover { opacity: 1; }
.orders-pane-select option { background: var(--app-surface); }
.orders-pane-item { align-items: center; background: transparent; border: 0; border-radius: 8px; color: var(--app-muted); cursor: pointer; display: flex; gap: 10px; min-height: 50px; padding: 6px 10px; text-align: left; transition: background .16s ease, color .16s ease; width: 100%; }
.orders-pane-item:hover { background: var(--app-hover); color: var(--app-text); }
.orders-pane-item.is-active { background: var(--app-hover-2); color: var(--app-text); }
.orders-pane-item-body { display: grid; flex: 1; gap: 2px; min-width: 0; }
.orders-pane-item-top { align-items: baseline; display: flex; gap: 8px; min-width: 0; }
.orders-pane-item-name { color: var(--app-text); flex: 1; font-size: 14px; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.orders-pane-item-time { color: var(--app-faint); flex: 0 0 auto; font-size: 11px; white-space: nowrap; }
.orders-pane-item-sub { color: var(--app-subtle); font-size: 11.5px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
/* The accent classes paint a soft background; a dot wants the solid colour. */
.orders-pane-dot { background: currentColor !important; border: 0; border-radius: 50%; flex-shrink: 0; height: 7px; width: 7px; }
.orders-pager { align-items: center; border-top: 1px solid var(--app-border); display: flex; gap: 8px; justify-content: space-between; margin-top: auto; padding-top: 10px; }
.orders-pane-back { display: none; }
.orders-status-line { align-items: center; background: none !important; border: 0; display: inline-flex; font-weight: 600; gap: 5px; }
.orders-detail-body { display: flex; flex-direction: column; gap: 18px; max-width: 760px; }
.orders-status-field { max-width: 260px; }
.orders-confirm { align-self: center; color: var(--app-rose-text); font-size: 12.5px; font-weight: 600; }
.orders-outline-btn { align-items: center; background: transparent; border: 1px solid var(--app-border-strong); border-radius: 8px; color: var(--app-text); cursor: pointer; display: inline-flex; font-size: 13px; font-weight: 600; height: 36px; padding: 0 12px; }
.orders-outline-btn:hover:not(:disabled) { background: var(--app-hover); }
.orders-outline-btn.is-danger { border-color: var(--app-rose-border); color: var(--app-rose-text); }
.orders-outline-btn.is-danger:hover:not(:disabled) { background: var(--app-rose-soft); }
.orders-outline-btn:disabled { cursor: not-allowed; opacity: .5; }
.orders-detail .tools-dark-btn { text-decoration: none; }
.orders-strong { color: var(--text); font-weight: 750; }
.orders-empty-link { margin-top: 18px; text-decoration: none; }
.orders-facts { display: grid; gap: 14px; grid-template-columns: repeat(2, minmax(0, 1fr)); margin: 0; }
.orders-fact { display: grid; gap: 4px; min-width: 0; }
.orders-fact dd { font-size: 13px; margin: 0; overflow-wrap: anywhere; }
.orders-copyable { align-items: center; display: inline-flex; gap: 6px; max-width: 100%; }
.orders-copyable > span { min-width: 0; overflow: hidden; text-overflow: ellipsis; }
.orders-copy { align-items: center; background: var(--panel); border: 1px solid var(--app-border); border-radius: 7px; color: var(--subtle); cursor: pointer; display: inline-flex; flex-shrink: 0; height: 24px; justify-content: center; width: 24px; }
.orders-copy:hover { border-color: var(--border-strong); color: var(--text); }
.orders-text { font-size: 13px; line-height: 1.55; margin: 0; overflow-wrap: anywhere; white-space: pre-wrap; }
.orders-items { display: grid; gap: 8px; list-style: none; margin: 0; padding: 0; }
.orders-items li { background: var(--panel); border: 1px solid var(--border); border-radius: 10px; display: grid; font-size: 13px; gap: 2px; padding: 8px 11px; }
.orders-export-btn { font-size: 12.5px; font-weight: 600; gap: 6px; padding: 0 10px; width: auto; }
.orders-search-row { display: flex; gap: 8px; min-width: 0; }
.orders-search-row .orders-pane-search { flex: 1 1 auto; min-width: 0; }
/* The narrow list pane keeps only search in view; status, agent and dates
   open under the Filters button, same as on phones. */
.orders-filters-btn { align-items: center; background: var(--app-surface); border: 1px solid var(--app-border-strong); border-radius: 8px; color: var(--app-muted); cursor: pointer; display: inline-flex; flex: 0 0 auto; font: inherit; font-size: 13px; font-weight: 600; gap: 6px; height: 34px; padding: 0 10px; transition: background .16s ease, border-color .16s ease, color .16s ease; }
.orders-filters-btn:hover { background: var(--app-hover); color: var(--app-text); }
.orders-filters-btn[aria-expanded="true"], .orders-filters-btn.is-on { border-color: var(--app-primary); color: var(--app-text); }
.orders-filters-count { background: var(--app-primary); border-radius: 999px; color: var(--app-on-accent, #fff); font-size: 10.5px; font-weight: 700; line-height: 1; min-width: 17px; padding: 3px 5px; text-align: center; }
.orders-more-filters { display: grid; gap: 10px; }
.orders-more-filters:not([data-open]) { display: none; }
.orders-date-field { display: grid; gap: 5px; min-width: 0; }
.orders-date-label { color: var(--app-subtle); font-size: 12px; font-weight: 500; }
.orders-list-empty { display: none; }
@media (max-width: 900px) {
  .orders-pane-back { align-items: center; background: none; border: 0; color: var(--app-subtle); cursor: pointer; display: inline-flex; font-size: 13px; font-weight: 600; gap: 6px; margin-bottom: 12px; padding: 0; }
  .orders-pane-search input, .orders-pane-select { font-size: 16px; }
  /* A page title like "All Agents", with a labelled Export button. */
  .orders-pane-list .tools-pane-head { border-bottom: 0; padding-bottom: 4px; }
  .orders-pane-list .tools-pane-head > svg { display: none; }
  .orders-pane-list .tools-pane-title { font-size: 20px; font-weight: 600; letter-spacing: -.2px; }
  .orders-export-btn { border-radius: 10px; font-size: 13.5px; height: 38px; padding: 0 12px; }
  /* Every control the same 40px height and look. */
  .orders-pane-search, .orders-pane-select { background: var(--app-surface); border-radius: 10px; height: 40px; }
  .orders-pane-search { padding: 0 12px; }
  .orders-pane-select { padding: 0 10px; }
  .orders-filters-btn { border-radius: 10px; color: var(--app-text); font-size: 14px; height: 40px; padding: 0 12px; }
  .orders-filters-count { font-size: 11px; min-width: 18px; padding: 3px 6px; }
  .orders-more-filters { padding-top: 2px; }
  /* Empty list: a centred message instead of a line in the corner. */
  .orders-empty-note { display: none; }
  .orders-list-empty { align-items: center; display: flex; flex-direction: column; padding: 56px 20px 32px; text-align: center; }
  .orders-list-empty-icon { align-items: center; background: var(--app-hover-2); border: 1px solid var(--app-border); border-radius: 14px; color: var(--app-primary-light, var(--app-text)); display: inline-flex; height: 52px; justify-content: center; margin-bottom: 14px; width: 52px; }
  .orders-list-empty-title { color: var(--app-text); font-size: 16px; font-weight: 700; margin: 0 0 6px; }
  .orders-list-empty-copy { color: var(--app-subtle); font-size: 13.5px; line-height: 1.5; margin: 0; max-width: 300px; }
  .orders-list-empty .orders-empty-link { background: var(--app-primary); color: var(--app-on-accent, #fff); height: 40px; }
}
@media (max-width: 640px) {
  .orders-facts { grid-template-columns: minmax(0, 1fr); }
}
`;

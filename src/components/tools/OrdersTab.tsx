"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  LayoutGrid,
  List,
  MessageSquare,
  Search,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";
import { listDashboardChatAgents } from "@/lib/chatAgents";
import {
  deleteOrder,
  exportOrders,
  listOrders,
  orderStatuses,
  updateOrder,
  type ApiOrder,
  type OrderStatus,
} from "@/lib/orders";
import { useCachedState } from "@/lib/pageCache";

// Every order the account's agents have taken. An order arrives whenever a
// customer confirms one, so the list re-reads itself on the same slow timer as
// the Conversations inbox; the server has nothing to push it with.
const refreshMs = 15000;
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

function StatusBadge({ status }: { status: OrderStatus }) {
  const meta = statusMeta(status);
  return <span className={`orders-status tools-accent-${meta.accent}`}>{meta.label}</span>;
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
  const [view, setView] = useState<"list" | "grid">("list");
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
  // Cached per filter set, so going back to one shows its rows at once.
  const [orderPage, setOrderPage, hasCachedPage] = useCachedState<OrderPage>(
    `orders:${JSON.stringify(filters)}:${pageNumber}`,
    { items: [], total: 0 }
  );
  const { items: orders, total } = orderPage;
  const selected = orders.find((order) => order.id === selectedId) ?? null;
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

  useEffect(() => {
    const timer = window.setInterval(() => setReloadKey((key) => key + 1), refreshMs);
    return () => window.clearInterval(timer);
  }, []);

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
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="tools-toolbar">
        <div className="tools-search-wrap">
          <span className="tools-search-icon">
            <Search size={15} />
          </span>
          <input
            aria-label="Search orders"
            className="tools-input tools-search-input"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name, phone, email or order #"
            value={query}
          />
        </div>
        <div aria-label="View" className="tools-view-toggle" role="group">
          <button
            aria-label="List view"
            aria-pressed={view === "list"}
            className={`tools-view-btn${view === "list" ? " is-active" : ""}`}
            onClick={() => setView("list")}
            title="List view"
            type="button"
          >
            <List size={16} />
          </button>
          <button
            aria-label="Grid view"
            aria-pressed={view === "grid"}
            className={`tools-view-btn${view === "grid" ? " is-active" : ""}`}
            onClick={() => setView("grid")}
            title="Grid view"
            type="button"
          >
            <LayoutGrid size={16} />
          </button>
        </div>
        <span className="tools-count">
          {total} order{total === 1 ? "" : "s"}
        </span>
        <button
          className="tools-btn tools-btn-secondary"
          disabled={isExporting || total === 0}
          onClick={downloadCsv}
          type="button"
        >
          <Download size={15} />
          {isExporting ? "Exporting…" : "Export CSV"}
        </button>
      </div>

      <div className="orders-filters">
        <label className="tools-field">
          <span className="tools-field-label">Status</span>
          <select
            className="tools-select"
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
        </label>
        <label className="tools-field">
          <span className="tools-field-label">Agent</span>
          <select
            className="tools-select"
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
        </label>
        <label className="tools-field">
          <span className="tools-field-label">From</span>
          <input
            className="tools-input"
            max={dateTo || undefined}
            onChange={(event) => {
              setDateFrom(event.target.value);
              setPageNumber(1);
            }}
            type="date"
            value={dateFrom}
          />
        </label>
        <label className="tools-field">
          <span className="tools-field-label">To</span>
          <input
            className="tools-input"
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

      {error && orders.length === 0 ? (
        <div className="tools-list-empty">
          <strong>Could not load orders</strong>
          <span>{error}</span>
        </div>
      ) : loading && !hasCachedPage ? (
        <div className="tools-list-empty">
          <strong>Loading orders…</strong>
        </div>
      ) : orders.length === 0 ? (
        hasFilters ? (
          <div className="tools-list-empty">
            <strong>No orders found</strong>
            <span>Try another search or filter.</span>
          </div>
        ) : (
          <section className="tools-empty">
            <span className="tools-empty-icon">
              <ShoppingBag size={32} strokeWidth={1.6} />
            </span>
            <h2 className="tools-empty-title">No orders yet</h2>
            <p className="tools-empty-copy">
              Enable &apos;Take Order&apos; on an agent to start receiving orders.
            </p>
            <Link className="tools-btn tools-btn-primary orders-empty-link" href="/dashboard/chat">
              Open chat agents
            </Link>
          </section>
        )
      ) : view === "list" ? (
        <div className="orders-table-wrap">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Description</th>
                <th>Agent</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} onClick={() => setSelectedId(order.id)}>
                  <td>
                    <button
                      className="orders-number"
                      onClick={(event) => {
                        event.stopPropagation();
                        setSelectedId(order.id);
                      }}
                      type="button"
                    >
                      #{order.order_number}
                    </button>
                  </td>
                  <td className="orders-strong">{order.customer_name}</td>
                  <td className="tools-mono">{order.phone}</td>
                  <td>{order.email ?? "—"}</td>
                  <td className="orders-truncate" title={order.description}>
                    {order.description}
                  </td>
                  <td>{order.agent_name ?? "Deleted agent"}</td>
                  <td>
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="orders-date">{dateFormatter.format(new Date(order.created_at))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="tools-grid">
          {orders.map((order) => (
            <button
              className="tools-card-item orders-card"
              key={order.id}
              onClick={() => setSelectedId(order.id)}
              type="button"
            >
              <span className="tools-card-top">
                <span className="tools-card-name">#{order.order_number}</span>
                <StatusBadge status={order.status} />
              </span>
              <span className="orders-strong">{order.customer_name}</span>
              <span className="tools-card-desc">{order.description}</span>
              <span className="tools-card-foot">
                <span className="tools-chip-line tools-mono">{order.phone}</span>
                <span className="tools-chip-tail">{dateFormatter.format(new Date(order.created_at))}</span>
              </span>
            </button>
          ))}
        </div>
      )}

      {pageCount > 1 ? (
        <div className="orders-pager">
          <button
            className="tools-btn tools-btn-secondary tools-btn-sm"
            disabled={pageNumber <= 1}
            onClick={() => setPageNumber((current) => current - 1)}
            type="button"
          >
            <ChevronLeft size={14} />
            Previous
          </button>
          <span className="tools-count">
            Page {pageNumber} of {pageCount}
          </span>
          <button
            className="tools-btn tools-btn-secondary tools-btn-sm"
            disabled={pageNumber >= pageCount}
            onClick={() => setPageNumber((current) => current + 1)}
            type="button"
          >
            Next
            <ChevronRight size={14} />
          </button>
        </div>
      ) : null}

      {selected ? (
        <OrderDrawer
          key={selected.id}
          onClose={() => setSelectedId("")}
          onDeleted={dropOrder}
          onNotice={onNotice}
          onSaved={replaceOrder}
          order={selected}
        />
      ) : null}
    </>
  );
}

// OrderDrawer shows one order in full. The status saves as soon as it is picked;
// the note holds a draft until Save, so a re-read of the list can't overwrite
// what is being typed. The parent keys this on the order id.
function OrderDrawer({
  order,
  onClose,
  onDeleted,
  onNotice,
  onSaved,
}: {
  order: ApiOrder;
  onClose: () => void;
  onDeleted: (id: string) => void;
  onNotice: Notify;
  onSaved: (order: ApiOrder) => void;
}) {
  const { getToken } = useAuth();
  const [note, setNote] = useState(order.internal_note ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const noteChanged = note.trim() !== (order.internal_note ?? "");

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

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
    <div
      className="orders-drawer-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <aside aria-label={`Order #${order.order_number}`} aria-modal="true" className="orders-drawer" role="dialog">
        <header className="orders-drawer-head">
          <div>
            <h2 className="tools-detail-name">Order #{order.order_number}</h2>
            <div className="tools-detail-sub">
              <StatusBadge status={order.status} />
              <span className="tools-field-hint">{dateFormatter.format(new Date(order.created_at))}</span>
            </div>
          </div>
          <button aria-label="Close" className="tools-icon-button" onClick={onClose} type="button">
            <X size={16} />
          </button>
        </header>

        <div className="orders-drawer-body">
          <label className="tools-field">
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
            <Fact label="Customer">{order.customer_name}</Fact>
            <Fact label="Phone">
              <span className="orders-copyable">
                <span className="tools-mono">{order.phone}</span>
                <CopyButton label="Phone" onCopy={() => copy("Phone", order.phone)} />
              </span>
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
            <Fact label="Agent">{order.agent_name ?? "Deleted agent"}</Fact>
            <Fact label="Channel">{order.channel === "voice" ? "Voice" : "Chat"}</Fact>
          </dl>

          <div className="tools-field">
            <span className="tools-field-label">Description</span>
            <p className="orders-text">{order.description}</p>
          </div>

          {order.items.length > 0 ? (
            <div className="tools-field">
              <span className="tools-field-label">Items</span>
              <ul className="orders-items">
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

          {order.conversation_id ? (
            <Link
              className="tools-btn tools-btn-secondary"
              href={`/dashboard/conversations?conversation=${encodeURIComponent(order.conversation_id)}`}
            >
              <MessageSquare size={15} />
              View conversation
            </Link>
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
          <button
            className="tools-btn tools-btn-primary"
            disabled={!noteChanged || isSaving}
            onClick={() => save({ internal_note: note.trim() || null })}
            type="button"
          >
            Save note
          </button>
        </div>

        <footer className="orders-drawer-foot">
          {confirmingDelete ? (
            <>
              <span className="tools-field-hint">Delete this order for good?</span>
              <button
                className="tools-btn tools-btn-secondary tools-btn-sm"
                onClick={() => setConfirmingDelete(false)}
                type="button"
              >
                Keep
              </button>
              <button
                className="tools-btn tools-btn-destructive tools-btn-sm"
                disabled={isSaving}
                onClick={remove}
                type="button"
              >
                Delete
              </button>
            </>
          ) : (
            <button
              className="tools-btn tools-btn-secondary tools-btn-sm"
              onClick={() => setConfirmingDelete(true)}
              type="button"
            >
              <Trash2 size={14} />
              Delete order
            </button>
          )}
        </footer>
      </aside>
    </div>
  );
}

function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="orders-fact">
      <dt className="tools-field-label">{label}</dt>
      <dd>{children}</dd>
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
.orders-filters { display: grid; gap: 12px; grid-template-columns: repeat(4, minmax(0, 1fr)); }
.orders-table-wrap { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; overflow-x: auto; }
.orders-table { border-collapse: collapse; font-size: 12.5px; min-width: 920px; width: 100%; }
.orders-table th { border-bottom: 1px solid var(--border); color: var(--faint); font-size: 10.5px; font-weight: 850; letter-spacing: .8px; padding: 11px 14px; text-align: left; text-transform: uppercase; white-space: nowrap; }
.orders-table td { border-bottom: 1px solid var(--border); color: var(--muted); padding: 11px 14px; vertical-align: middle; white-space: nowrap; }
.orders-table tbody tr { cursor: pointer; transition: background .18s ease; }
.orders-table tbody tr:hover { background: var(--panel-hover); }
.orders-table tbody tr:last-child td { border-bottom: 0; }
.orders-number { background: none; border: 0; color: var(--app-primary-text); cursor: pointer; font-weight: 850; padding: 0; }
.orders-number:focus-visible { border-radius: 4px; box-shadow: 0 0 0 3px var(--app-primary-ring); outline: none; }
.orders-strong { color: var(--text); font-weight: 750; }
.orders-truncate { max-width: 260px; overflow: hidden; text-overflow: ellipsis; }
.orders-date { color: var(--subtle); }
.orders-status { border: 1px solid; border-radius: 999px; display: inline-flex; font-size: 11px; font-weight: 800; line-height: 1; padding: 5px 8px; white-space: nowrap; }
.orders-card { min-height: 170px; }
.orders-empty-link { margin-top: 18px; text-decoration: none; }
.orders-pager { align-items: center; display: flex; gap: 10px; justify-content: center; }
.orders-drawer-overlay { animation: tools-fade-in .16s ease; background: var(--app-overlay); inset: 0; position: fixed; z-index: 120; }
.orders-drawer { animation: orders-drawer-in .2s ease; background: var(--surface-2); border-left: 1px solid var(--border-strong); bottom: 0; box-shadow: -20px 0 60px var(--app-shadow-color); display: flex; flex-direction: column; max-width: 460px; position: absolute; right: 0; top: 0; width: 100%; }
.orders-drawer-head { align-items: flex-start; border-bottom: 1px solid var(--border); display: flex; gap: 12px; justify-content: space-between; padding: 16px 18px; }
.orders-drawer-body { display: flex; flex: 1 1 auto; flex-direction: column; gap: 16px; min-height: 0; overflow-y: auto; padding: 18px; }
.orders-drawer-foot { align-items: center; border-top: 1px solid var(--border); display: flex; flex-wrap: wrap; gap: 8px; justify-content: flex-end; padding: 12px 18px calc(12px + env(safe-area-inset-bottom)); }
.orders-drawer-foot .tools-field-hint { margin-right: auto; }
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
@keyframes orders-drawer-in { from { transform: translateX(24px); opacity: 0; } to { transform: none; opacity: 1; } }
@media (max-width: 900px) {
  .orders-filters { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 640px) {
  .orders-drawer { border-left: 0; max-width: none; }
  .orders-facts { grid-template-columns: minmax(0, 1fr); }
}
`;

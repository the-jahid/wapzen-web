"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent, type DragEvent, type ReactNode } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { getCountries, type CountryCode } from "libphonenumber-js/min";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Download,
  FileSpreadsheet,
  FileText,
  Pause,
  Pencil,
  Play,
  Plus,
  Send,
  Trash2,
  Upload,
  X,
  XCircle,
} from "lucide-react";
import { DashboardSidebar } from "@/components/nav/DashboardSidebar";
import { useCachedState } from "@/lib/pageCache";
import { listPhoneNumbers, type ApiPhoneNumber } from "@/lib/phoneNumbers";
import {
  ACCEPTED_FILES,
  buildRecipients,
  countryOf,
  guessPhoneColumn,
  readSheet,
  sampleCsv,
  type SheetData,
} from "@/lib/bulkFile";
import {
  changeBulkMessage,
  createBulkMessage,
  DEFAULT_INTERVAL_SECONDS,
  deleteBulkMessage,
  deleteMessageTemplate,
  listBulkMessages,
  listBulkRecipients,
  listMessageTemplates,
  MAX_INTERVAL_SECONDS,
  MAX_RECIPIENTS,
  MIN_INTERVAL_SECONDS,
  renderMessage,
  saveMessageTemplate,
  type ApiBulkMessage,
  type ApiBulkRecipient,
  type ApiMessageTemplate,
  type BulkStatus,
  type RecipientStatus,
  variableKey,
} from "@/lib/bulkMessages";

// Bulk messages: one message, filled in per person from a spreadsheet, sent
// from one of the account's WhatsApp numbers to everyone on the list. The
// server sends them one at a time, a set number of seconds apart (30 unless
// the owner picks otherwise), so a send keeps going with this page closed.
// The page watches it by re-reading the list: quickly while something is
// sending, slowly otherwise.

const fastRefreshMs = 5000;
const slowRefreshMs = 20000;
const recipientPageSize = 50;

type Notice = { kind: "success" | "error"; text: string };
type Tab = "sends" | "templates";

const statusMeta: Record<BulkStatus, { label: string; accent: string }> = {
  running: { label: "Sending", accent: "green" },
  paused: { label: "Paused", accent: "amber" },
  completed: { label: "Completed", accent: "primary" },
  cancelled: { label: "Cancelled", accent: "rose" },
};

const recipientMeta: Record<RecipientStatus, { label: string; accent: string }> = {
  pending: { label: "Waiting", accent: "muted" },
  sending: { label: "Sending", accent: "sky" },
  sent: { label: "Sent", accent: "green" },
  failed: { label: "Failed", accent: "rose" },
  skipped: { label: "Skipped", accent: "muted" },
};

// Ready-made messages to start from; picking one copies it into the editor.
const starterTemplates = [
  {
    name: "Promotion",
    body: "Hi {{name}}! 🎉 This week only: 20% off everything in store. Reply YES and we'll send you the details.",
  },
  {
    name: "Appointment reminder",
    body: "Hello {{name}}, this is a reminder of your appointment on {{date}}. Reply 1 to confirm or 2 to reschedule.",
  },
  {
    name: "Follow-up",
    body: "Hi {{name}}, thanks for your interest! Do you have any questions I can help with?",
  },
];

const dateFormatter = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

function describeError(error: unknown, fallback: string) {
  return error instanceof Error && error.message ? error.message : fallback;
}

function formatDuration(totalSeconds: number) {
  if (totalSeconds < 60) return `${Math.max(0, Math.round(totalSeconds))} s`;
  const minutes = Math.round(totalSeconds / 60);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours < 24) return rest ? `${hours} h ${rest} min` : `${hours} h`;
  const days = Math.floor(hours / 24);
  return `${days} d ${hours % 24} h`;
}

function numberLabel(number: Pick<ApiPhoneNumber, "phone_number" | "label">) {
  const phone = number.phone_number ?? "Unknown number";
  return number.label ? `${number.label} (${phone})` : phone;
}

export default function BulkMessagesPage() {
  const { getToken } = useAuth();
  const [tab, setTab] = useState<Tab>("sends");
  const [composing, setComposing] = useState(false);
  const [sends, setSends, hasCachedSends] = useCachedState<ApiBulkMessage[]>("bulk-messages", []);
  const [templates, setTemplates] = useCachedState<ApiMessageTemplate[]>("message-templates", []);
  const [numbers, setNumbers] = useCachedState<ApiPhoneNumber[]>("bulk-messages:numbers", []);
  const [loading, setLoading] = useState(!hasCachedSends);
  const [loadError, setLoadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [now, setNow] = useState(() => Date.now());

  const anyRunning = sends.some((send) => send.status === "running");

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 4200);
    return () => window.clearTimeout(timer);
  }, [notice]);

  // The countdown to each running send's next message.
  useEffect(() => {
    if (!anyRunning) return;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [anyRunning]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await listBulkMessages(getToken);
        if (cancelled) return;
        setSends(list);
        setLoadError("");
      } catch (error) {
        if (!cancelled) setLoadError(describeError(error, "Could not load bulk messages"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [getToken, reloadKey, setSends]);

  useEffect(() => {
    const timer = window.setTimeout(() => setReloadKey((key) => key + 1), anyRunning ? fastRefreshMs : slowRefreshMs);
    return () => window.clearTimeout(timer);
  }, [anyRunning, reloadKey]);

  // Templates and numbers only feed the editor, so failing to load them shows
  // up there rather than blanking the page.
  useEffect(() => {
    let cancelled = false;
    listMessageTemplates(getToken)
      .then((list) => !cancelled && setTemplates(list))
      .catch(() => undefined);
    listPhoneNumbers(getToken)
      .then((list) => !cancelled && setNumbers(list.filter((number) => number.phone_number)))
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [getToken, setNumbers, setTemplates]);

  const replaceSend = useCallback(
    (saved: ApiBulkMessage) => setSends((current) => current.map((send) => (send.id === saved.id ? saved : send))),
    [setSends]
  );

  return (
    <div className="bulk-shell app-accent-green">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <DashboardSidebar activeLabel="Bulk Messages" stackBelow={900} />

      <main className="bulk-main">
        <div className="bulk-content">
          {composing ? (
            <Composer
              numbers={numbers}
              onCancel={() => setComposing(false)}
              onNotice={setNotice}
              onStarted={(created) => {
                setSends((current) => [created, ...current.filter((send) => send.id !== created.id)]);
                setComposing(false);
                setTab("sends");
                setNotice({ kind: "success", text: `"${created.name}" started. The first message goes out now.` });
              }}
              onTemplateSaved={(saved) => setTemplates((current) => [saved, ...current])}
              templates={templates}
            />
          ) : (
            <div className="bulk-browse">
              <header className="bulk-head">
                <div>
                  <h1 className="bulk-title">Bulk Messages</h1>
                  <p className="bulk-subtitle">
                    Send one message to a whole contact list from your WhatsApp number, one person at a time.
                  </p>
                </div>
                <button className="bulk-btn bulk-btn-primary" onClick={() => setComposing(true)} type="button">
                  <Plus size={16} strokeWidth={2.4} />
                  <span>New bulk message</span>
                </button>
              </header>

              <div aria-label="Bulk message sections" className="bulk-tabs" role="tablist">
                <button
                  aria-selected={tab === "sends"}
                  className={`bulk-tab${tab === "sends" ? " is-active" : ""}`}
                  onClick={() => setTab("sends")}
                  role="tab"
                  type="button"
                >
                  Sends
                  {anyRunning ? <span className="bulk-tab-dot" aria-label="sending now" /> : null}
                </button>
                <button
                  aria-selected={tab === "templates"}
                  className={`bulk-tab${tab === "templates" ? " is-active" : ""}`}
                  onClick={() => setTab("templates")}
                  role="tab"
                  type="button"
                >
                  Templates
                  {templates.length ? <span className="bulk-count">{templates.length}</span> : null}
                </button>
              </div>

              {tab === "sends" ? (
                <SendsList
                  error={loadError}
                  loading={loading && !sends.length}
                  now={now}
                  onChanged={replaceSend}
                  onDeleted={(id) => setSends((current) => current.filter((send) => send.id !== id))}
                  onNew={() => setComposing(true)}
                  onNotice={setNotice}
                  sends={sends}
                />
              ) : (
                <TemplatesTab onNotice={setNotice} setTemplates={setTemplates} templates={templates} />
              )}
            </div>
          )}
        </div>
      </main>

      {notice ? (
        <div className={`bulk-toast ${notice.kind === "error" ? "bulk-toast-error" : "bulk-toast-success"}`} role="status">
          {notice.text}
        </div>
      ) : null}
    </div>
  );
}

/* ───────────────────────────── Sends ───────────────────────────── */

function SendsList({
  error,
  loading,
  now,
  onChanged,
  onDeleted,
  onNew,
  onNotice,
  sends,
}: {
  error: string;
  loading: boolean;
  now: number;
  onChanged: (send: ApiBulkMessage) => void;
  onDeleted: (id: string) => void;
  onNew: () => void;
  onNotice: (notice: Notice) => void;
  sends: ApiBulkMessage[];
}) {
  const [openId, setOpenId] = useState("");

  if (loading) return <div className="bulk-empty-line">Loading bulk messages…</div>;
  if (error && !sends.length) {
    return (
      <div className="bulk-empty-line">
        <strong>Could not load bulk messages</strong>
        <span>{error}</span>
      </div>
    );
  }
  if (!sends.length) {
    return (
      <section className="bulk-empty">
        <span className="bulk-empty-icon">
          <Send size={30} strokeWidth={1.6} />
        </span>
        <h2 className="bulk-empty-title">No bulk messages yet</h2>
        <p className="bulk-empty-copy">
          Upload an Excel or CSV file of contacts, write your message, and Wapzen sends it to each person from your
          WhatsApp number — one message every {DEFAULT_INTERVAL_SECONDS} seconds by default.
        </p>
        <button className="bulk-btn bulk-btn-primary" onClick={onNew} type="button">
          <Plus size={16} strokeWidth={2.4} />
          New bulk message
        </button>
      </section>
    );
  }

  return (
    <div className="bulk-list">
      {error ? <div className="bulk-warning">{error}</div> : null}
      {sends.map((send) => (
        <SendCard
          key={send.id}
          now={now}
          onChanged={onChanged}
          onDeleted={onDeleted}
          onNotice={onNotice}
          onToggle={() => setOpenId((current) => (current === send.id ? "" : send.id))}
          open={openId === send.id}
          send={send}
        />
      ))}
    </div>
  );
}

function SendCard({
  now,
  onChanged,
  onDeleted,
  onNotice,
  onToggle,
  open,
  send,
}: {
  now: number;
  onChanged: (send: ApiBulkMessage) => void;
  onDeleted: (id: string) => void;
  onNotice: (notice: Notice) => void;
  onToggle: () => void;
  open: boolean;
  send: ApiBulkMessage;
}) {
  const { getToken } = useAuth();
  const [busy, setBusy] = useState(false);
  const [confirm, setConfirm] = useState<"cancel" | "delete" | null>(null);
  const meta = statusMeta[send.status];
  const done = send.sent_count + send.failed_count;
  const percent = send.total_count ? Math.round((done / send.total_count) * 100) : 0;
  const remaining = send.status === "running" || send.status === "paused" ? send.pending_count : 0;
  const nextIn = send.next_send_at ? Math.max(0, Math.ceil((Date.parse(send.next_send_at) - now) / 1000)) : null;

  async function act(action: "pause" | "resume" | "cancel") {
    if (busy) return;
    setBusy(true);
    try {
      onChanged(await changeBulkMessage(send.id, action, getToken));
      setConfirm(null);
    } catch (error) {
      onNotice({ kind: "error", text: describeError(error, `Could not ${action} the send.`) });
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (busy) return;
    setBusy(true);
    try {
      await deleteBulkMessage(send.id, getToken);
      onDeleted(send.id);
      onNotice({ kind: "success", text: `"${send.name}" deleted.` });
    } catch (error) {
      onNotice({ kind: "error", text: describeError(error, "Could not delete the send.") });
      setBusy(false);
    }
  }

  return (
    <article className="bulk-card" data-open={open || undefined}>
      <div className="bulk-card-main">
        <button aria-expanded={open} className="bulk-card-toggle" onClick={onToggle} type="button">
          <span className="bulk-card-chevron">{open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}</span>
          <span className="bulk-card-identity">
            <span className="bulk-card-name">{send.name}</span>
            <span className="bulk-card-meta">
              From {send.phone_number ?? "a removed number"} · every {send.interval_seconds}s · {dateFormatter.format(new Date(send.created_at))}
            </span>
          </span>
        </button>
        <span className={`bulk-status bulk-accent-${meta.accent}`}>
          {send.status === "running" ? <span className="bulk-pulse" /> : null}
          {meta.label}
        </span>
        <div className="bulk-card-actions">
          {send.status === "running" ? (
            <button className="bulk-btn bulk-btn-secondary bulk-btn-sm" disabled={busy} onClick={() => act("pause")} type="button">
              <Pause size={14} /> Pause
            </button>
          ) : null}
          {send.status === "paused" ? (
            <button className="bulk-btn bulk-btn-primary bulk-btn-sm" disabled={busy} onClick={() => act("resume")} type="button">
              <Play size={14} /> Resume
            </button>
          ) : null}
          {send.status === "running" || send.status === "paused" ? (
            <button className="bulk-btn bulk-btn-secondary bulk-btn-sm" disabled={busy} onClick={() => setConfirm("cancel")} type="button">
              <X size={14} /> Stop
            </button>
          ) : null}
          <button
            aria-label={`Delete ${send.name}`}
            className="bulk-icon-btn"
            disabled={busy}
            onClick={() => setConfirm("delete")}
            title="Delete"
            type="button"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <div className="bulk-progress" aria-label={`${percent}% done`}>
        <div className="bulk-progress-track">
          <span className="bulk-progress-sent" style={{ width: `${send.total_count ? (send.sent_count / send.total_count) * 100 : 0}%` }} />
          <span className="bulk-progress-failed" style={{ width: `${send.total_count ? (send.failed_count / send.total_count) * 100 : 0}%` }} />
        </div>
        <div className="bulk-progress-stats">
          <span><CheckCircle2 size={13} /> {send.sent_count} sent</span>
          {send.failed_count ? <span className="bulk-text-rose"><XCircle size={13} /> {send.failed_count} failed</span> : null}
          {remaining ? <span><Clock size={13} /> {remaining} left</span> : null}
          <span className="bulk-progress-total">{done} of {send.total_count}</span>
          {send.status === "running" && remaining ? (
            <span className="bulk-progress-eta">
              {nextIn ? `Next in ${nextIn}s` : "Sending now"} · done in about {formatDuration(Math.max(0, remaining - 1) * send.interval_seconds + (nextIn ?? 0))}
            </span>
          ) : null}
        </div>
      </div>

      {send.last_error && (send.status === "running" || send.status === "paused") ? (
        <div className="bulk-warning">
          <AlertTriangle size={14} />
          <span>{send.last_error}</span>
          {send.last_error.includes("reconnect") ? <Link href="/dashboard/phone-numbers">Phone Numbers</Link> : null}
        </div>
      ) : null}

      {open ? <RecipientsPanel send={send} /> : null}

      {confirm ? (
        <ConfirmDialog
          busy={busy}
          confirmLabel={confirm === "delete" ? "Delete" : "Stop sending"}
          onCancel={() => setConfirm(null)}
          onConfirm={() => (confirm === "delete" ? remove() : act("cancel"))}
          title={confirm === "delete" ? `Delete "${send.name}"?` : `Stop "${send.name}"?`}
        >
          {confirm === "delete"
            ? send.status === "running"
              ? "It stops sending and its delivery list is removed. Messages already sent stay in Conversations."
              : "Its delivery list is removed. Messages already sent stay in Conversations."
            : `The ${send.pending_count} people not reached yet won't get the message. This can't be undone; pause instead if you may want to continue.`}
        </ConfirmDialog>
      ) : null}
    </article>
  );
}

function RecipientsPanel({ send }: { send: ApiBulkMessage }) {
  const { getToken } = useAuth();
  const [status, setStatus] = useState<RecipientStatus | "">("");
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<{ items: ApiBulkRecipient[]; total: number } | null>(null);
  const [error, setError] = useState("");
  // Re-read as the send moves on, so statuses keep up with the counts above.
  const progress = send.sent_count + send.failed_count;

  useEffect(() => {
    let cancelled = false;
    listBulkRecipients(send.id, getToken, { page, limit: recipientPageSize, status })
      .then((next) => {
        if (cancelled) return;
        setResult(next);
        setError("");
      })
      .catch((loadError) => !cancelled && setError(describeError(loadError, "Could not load the list")));
    return () => {
      cancelled = true;
    };
  }, [getToken, page, progress, send.id, send.status, status]);

  const pages = Math.max(1, Math.ceil((result?.total ?? 0) / recipientPageSize));

  return (
    <div className="bulk-recipients">
      <div className="bulk-message-preview">
        <span className="bulk-label">Message</span>
        <p>{send.message}</p>
      </div>
      <div className="bulk-recipients-head">
        <span className="bulk-label">Delivery</span>
        <select
          aria-label="Filter by status"
          className="bulk-select bulk-select-sm"
          onChange={(event) => {
            setStatus(event.target.value as RecipientStatus | "");
            setPage(1);
          }}
          value={status}
        >
          <option value="">Everyone</option>
          {(Object.keys(recipientMeta) as RecipientStatus[]).map((key) => (
            <option key={key} value={key}>
              {recipientMeta[key].label}
            </option>
          ))}
        </select>
      </div>
      {error ? <div className="bulk-warning">{error}</div> : null}
      {!result ? (
        <div className="bulk-empty-line">Loading…</div>
      ) : result.items.length === 0 ? (
        <div className="bulk-empty-line">Nobody here.</div>
      ) : (
        <div className="bulk-table-wrap">
          <table className="bulk-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Phone</th>
                <th>Name</th>
                <th>Status</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {result.items.map((recipient) => {
                const meta = recipientMeta[recipient.status];
                return (
                  <tr key={recipient.id}>
                    <td className="bulk-cell-muted">{recipient.position + 1}</td>
                    <td className="bulk-mono">{recipient.phone}</td>
                    <td>{recipient.variables.name || <span className="bulk-cell-muted">—</span>}</td>
                    <td>
                      <span className={`bulk-chip bulk-accent-${meta.accent}`}>{meta.label}</span>
                    </td>
                    <td className="bulk-cell-muted">
                      {recipient.error ?? (recipient.sent_at ? dateFormatter.format(new Date(recipient.sent_at)) : "")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {pages > 1 ? (
        <div className="bulk-pager">
          <button className="bulk-btn bulk-btn-secondary bulk-btn-sm" disabled={page <= 1} onClick={() => setPage(page - 1)} type="button">
            Previous
          </button>
          <span>
            Page {page} of {pages}
          </span>
          <button className="bulk-btn bulk-btn-secondary bulk-btn-sm" disabled={page >= pages} onClick={() => setPage(page + 1)} type="button">
            Next
          </button>
        </div>
      ) : null}
    </div>
  );
}

/* ─────────────────────────── Templates ─────────────────────────── */

function TemplatesTab({
  onNotice,
  setTemplates,
  templates,
}: {
  onNotice: (notice: Notice) => void;
  setTemplates: (update: (current: ApiMessageTemplate[]) => ApiMessageTemplate[]) => void;
  templates: ApiMessageTemplate[];
}) {
  const { getToken } = useAuth();
  const [editing, setEditing] = useState<{ id?: string; name: string; body: string } | null>(null);
  const [deleting, setDeleting] = useState<ApiMessageTemplate | null>(null);
  const [busy, setBusy] = useState(false);

  async function remove(template: ApiMessageTemplate) {
    setBusy(true);
    try {
      await deleteMessageTemplate(template.id, getToken);
      setTemplates((current) => current.filter((item) => item.id !== template.id));
      setDeleting(null);
      onNotice({ kind: "success", text: `Template "${template.name}" deleted.` });
    } catch (error) {
      onNotice({ kind: "error", text: describeError(error, "Could not delete the template.") });
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <p className="bulk-hint">
        Write <code>{"{{name}}"}</code> or any other column of your file in double braces, and each person gets their own
        value. <code>{"{{phone}}"}</code> is always their number.
      </p>
      <div className="bulk-template-grid">
        <button className="bulk-add-card" onClick={() => setEditing({ name: "", body: "" })} type="button">
          <span className="bulk-add-icon">
            <Plus size={18} />
          </span>
          <span className="bulk-add-label">New template</span>
        </button>
        {templates.map((template) => (
          <article className="bulk-template-card" key={template.id}>
            <div className="bulk-template-top">
              <span className="bulk-template-name">{template.name}</span>
              <span className="bulk-template-actions">
                <button
                  aria-label={`Edit ${template.name}`}
                  className="bulk-icon-btn"
                  onClick={() => setEditing({ id: template.id, name: template.name, body: template.body })}
                  type="button"
                >
                  <Pencil size={14} />
                </button>
                <button aria-label={`Delete ${template.name}`} className="bulk-icon-btn" onClick={() => setDeleting(template)} type="button">
                  <Trash2 size={14} />
                </button>
              </span>
            </div>
            <p className="bulk-template-body">{template.body}</p>
          </article>
        ))}
        {templates.length === 0
          ? starterTemplates.map((starter) => (
              <article className="bulk-template-card bulk-template-starter" key={starter.name}>
                <div className="bulk-template-top">
                  <span className="bulk-template-name">{starter.name}</span>
                  <span className="bulk-chip bulk-accent-muted">Starter</span>
                </div>
                <p className="bulk-template-body">{starter.body}</p>
                <button className="bulk-btn bulk-btn-secondary bulk-btn-sm" onClick={() => setEditing({ ...starter })} type="button">
                  Use as template
                </button>
              </article>
            ))
          : null}
      </div>

      {editing ? (
        <TemplateDialog
          initial={editing}
          onClose={() => setEditing(null)}
          onSaved={(saved) => {
            setTemplates((current) =>
              editing.id ? current.map((item) => (item.id === saved.id ? saved : item)) : [saved, ...current]
            );
            setEditing(null);
            onNotice({ kind: "success", text: `Template "${saved.name}" saved.` });
          }}
        />
      ) : null}
      {deleting ? (
        <ConfirmDialog
          busy={busy}
          confirmLabel="Delete"
          onCancel={() => setDeleting(null)}
          onConfirm={() => remove(deleting)}
          title={`Delete "${deleting.name}"?`}
        >
          Sends that already used it keep their message.
        </ConfirmDialog>
      ) : null}
    </>
  );
}

function TemplateDialog({
  initial,
  onClose,
  onSaved,
}: {
  initial: { id?: string; name: string; body: string };
  onClose: () => void;
  onSaved: (template: ApiMessageTemplate) => void;
}) {
  const { getToken } = useAuth();
  const [name, setName] = useState(initial.name);
  const [body, setBody] = useState(initial.body);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!name.trim() || !body.trim()) {
      setError("Give the template a name and a message.");
      return;
    }
    setSaving(true);
    try {
      onSaved(await saveMessageTemplate({ name: name.trim(), body: body.trim() }, getToken, initial.id));
    } catch (saveError) {
      setError(describeError(saveError, "Could not save the template."));
      setSaving(false);
    }
  }

  return (
    <Modal labelledBy="template-dialog-title" onClose={onClose}>
      <h2 className="bulk-modal-title" id="template-dialog-title">
        {initial.id ? "Edit template" : "New template"}
      </h2>
      <div className="bulk-field">
        <label className="bulk-label" htmlFor="template-name">Name</label>
        <input className="bulk-input" id="template-name" maxLength={120} onChange={(event) => setName(event.target.value)} value={name} />
      </div>
      <div className="bulk-field">
        <label className="bulk-label" htmlFor="template-body">Message</label>
        <textarea
          className="bulk-textarea"
          id="template-body"
          maxLength={4096}
          onChange={(event) => setBody(event.target.value)}
          placeholder="Hi {{name}}, …"
          rows={6}
          value={body}
        />
      </div>
      {error ? <div className="bulk-error">{error}</div> : null}
      <div className="bulk-modal-actions">
        <button className="bulk-btn bulk-btn-secondary" onClick={onClose} type="button">Cancel</button>
        <button className="bulk-btn bulk-btn-primary" disabled={saving} onClick={save} type="button">
          {saving ? "Saving…" : "Save template"}
        </button>
      </div>
    </Modal>
  );
}

/* ──────────────────────────── Composer ─────────────────────────── */

const countryNames = typeof Intl.DisplayNames === "function" ? new Intl.DisplayNames(["en"], { type: "region" }) : null;
const countryOptions = getCountries()
  .map((iso) => ({ iso, name: countryNames?.of(iso) ?? iso }))
  .sort((a, b) => a.name.localeCompare(b.name, "en"));

// Re-reading every number in the file is the slow part of the editor, so it
// only runs again when the file, the column or the country changes, not on
// every keystroke in the message.
function useRecipientList(sheet: SheetData | null, phoneColumn: number, country: CountryCode | "") {
  return useMemo(
    () => (sheet ? buildRecipients(sheet, phoneColumn, country || undefined) : null),
    [country, phoneColumn, sheet]
  );
}

function Composer({
  numbers,
  onCancel,
  onNotice,
  onStarted,
  onTemplateSaved,
  templates,
}: {
  numbers: ApiPhoneNumber[];
  onCancel: () => void;
  onNotice: (notice: Notice) => void;
  onStarted: (send: ApiBulkMessage) => void;
  onTemplateSaved: (template: ApiMessageTemplate) => void;
  templates: ApiMessageTemplate[];
}) {
  const { getToken } = useAuth();
  const fileInput = useRef<HTMLInputElement>(null);
  const messageInput = useRef<HTMLTextAreaElement>(null);
  const [sheet, setSheet] = useState<SheetData | null>(null);
  const [fileError, setFileError] = useState("");
  const [reading, setReading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [phoneColumn, setPhoneColumn] = useState(0);
  const [countryOverride, setCountryOverride] = useState<CountryCode | "" | null>(null);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [numberChoice, setNumberChoice] = useState("");
  const [gapText, setGapText] = useState(String(DEFAULT_INTERVAL_SECONDS));
  const [showInvalid, setShowInvalid] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [starting, setStarting] = useState(false);
  const [savingTemplate, setSavingTemplate] = useState<{ name: string } | null>(null);

  // The first connected number, until the owner picks one.
  const numberId = numberChoice || (numbers.find((n) => n.status === "connected") ?? numbers[0])?.id || "";
  const number = numbers.find((n) => n.id === numberId);
  // Local numbers in the file are read as numbers of the sending number's
  // country unless the owner says otherwise.
  const country = countryOverride === null ? countryOf(number?.phone_number) ?? "" : countryOverride;
  const list = useRecipientList(sheet, phoneColumn, country);
  const variables = useMemo(
    () => (sheet ? sheet.headers.filter((_, column) => column !== phoneColumn) : []),
    [phoneColumn, sheet]
  );
  const intervalSeconds = Number.parseInt(gapText, 10);
  const intervalValid =
    Number.isInteger(intervalSeconds) && intervalSeconds >= MIN_INTERVAL_SECONDS && intervalSeconds <= MAX_INTERVAL_SECONDS;
  const count = list?.recipients.length ?? 0;
  const first = list?.recipients[0];
  const preview = first ? renderMessage(message, first.phone, first.variables) : message.trim();
  const unknownPlaceholders = useMemo(() => {
    const known = new Set(["phone", ...variables.map(variableKey)]);
    return [...message.matchAll(/\{\{\s*([^{}]+?)\s*\}\}/g)]
      .map((match) => match[1])
      .filter((key) => !known.has(variableKey(key)));
  }, [message, variables]);

  const problems = [
    !sheet && "Upload your contact list.",
    sheet && count === 0 && "No valid phone numbers in the file.",
    count > MAX_RECIPIENTS && `One send can reach at most ${MAX_RECIPIENTS.toLocaleString()} people; split the file.`,
    !message.trim() && "Write the message.",
    !numberId && "Connect a WhatsApp number first.",
    !intervalValid && `The gap must be ${MIN_INTERVAL_SECONDS}–${MAX_INTERVAL_SECONDS} seconds.`,
  ].filter(Boolean) as string[];

  async function loadFile(file: File | undefined) {
    if (!file) return;
    setReading(true);
    setFileError("");
    try {
      const next = await readSheet(file);
      setSheet(next);
      setPhoneColumn(guessPhoneColumn(next));
      setName((current) => current || file.name.replace(/\.[^.]+$/, ""));
      setShowInvalid(false);
    } catch (error) {
      setSheet(null);
      setFileError(describeError(error, "Could not read that file."));
    } finally {
      setReading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    void loadFile(event.dataTransfer.files?.[0]);
  }

  function insertVariable(header: string) {
    const token = `{{${header}}}`;
    const input = messageInput.current;
    if (!input) {
      setMessage((current) => current + token);
      return;
    }
    const start = input.selectionStart ?? message.length;
    const end = input.selectionEnd ?? message.length;
    const next = message.slice(0, start) + token + message.slice(end);
    setMessage(next);
    requestAnimationFrame(() => {
      input.focus();
      input.setSelectionRange(start + token.length, start + token.length);
    });
  }

  function downloadSample() {
    const url = URL.createObjectURL(new Blob([sampleCsv()], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "bulk-message-contacts.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  async function saveTemplate(templateName: string) {
    try {
      const saved = await saveMessageTemplate({ name: templateName.trim(), body: message.trim() }, getToken);
      onTemplateSaved(saved);
      setSavingTemplate(null);
      onNotice({ kind: "success", text: `Saved as template "${saved.name}".` });
    } catch (error) {
      onNotice({ kind: "error", text: describeError(error, "Could not save the template.") });
    }
  }

  async function start() {
    if (!list || problems.length || starting) return;
    setStarting(true);
    try {
      const created = await createBulkMessage(
        {
          name: name.trim() || "Bulk message",
          phone_number_id: numberId,
          message: message.trim(),
          interval_seconds: intervalSeconds,
          recipients: list.recipients,
        },
        getToken
      );
      onStarted(created);
    } catch (error) {
      onNotice({ kind: "error", text: describeError(error, "Could not start the send.") });
      setStarting(false);
      setConfirming(false);
    }
  }

  return (
    <div className="bulk-compose">
      <div className="bulk-compose-head">
        <button className="bulk-btn bulk-btn-secondary bulk-btn-sm" onClick={onCancel} type="button">
          <ArrowLeft size={14} /> Back
        </button>
        <h1 className="bulk-title">New bulk message</h1>
      </div>

      <div className="bulk-compose-grid">
        <div className="bulk-compose-steps">
          {/* 1. Contacts */}
          <section className="bulk-step">
            <div className="bulk-step-head">
              <span className="bulk-step-num">1</span>
              <div>
                <h2 className="bulk-step-title">Contacts</h2>
                <p className="bulk-step-copy">Excel (.xlsx, .xls), CSV, OpenDocument or a text file with one number per line.</p>
              </div>
              <button className="bulk-link-btn" onClick={downloadSample} type="button">
                <Download size={13} /> Sample file
              </button>
            </div>

            <div
              className="bulk-drop"
              data-dragging={dragging || undefined}
              onDragLeave={() => setDragging(false)}
              onDragOver={(event) => {
                event.preventDefault();
                setDragging(true);
              }}
              onDrop={onDrop}
            >
              <input
                accept={ACCEPTED_FILES}
                className="bulk-file-input"
                id="bulk-file"
                onChange={(event: ChangeEvent<HTMLInputElement>) => void loadFile(event.target.files?.[0])}
                ref={fileInput}
                type="file"
              />
              {sheet ? (
                <div className="bulk-file-row">
                  <span className="bulk-file-icon">
                    {/\.(csv|tsv|txt)$/i.test(sheet.fileName) ? <FileText size={20} /> : <FileSpreadsheet size={20} />}
                  </span>
                  <span className="bulk-file-text">
                    <strong>{sheet.fileName}</strong>
                    <span>
                      {sheet.rows.length.toLocaleString()} row{sheet.rows.length === 1 ? "" : "s"} · {sheet.headers.length} column
                      {sheet.headers.length === 1 ? "" : "s"}
                    </span>
                  </span>
                  <label className="bulk-btn bulk-btn-secondary bulk-btn-sm" htmlFor="bulk-file">
                    Replace
                  </label>
                </div>
              ) : (
                <label className="bulk-drop-label" htmlFor="bulk-file">
                  <Upload size={22} />
                  <strong>{reading ? "Reading…" : "Drop your file here or click to upload"}</strong>
                  <span>The file stays in your browser; only the numbers and columns are sent.</span>
                </label>
              )}
            </div>
            {fileError ? <div className="bulk-error">{fileError}</div> : null}

            {sheet && list ? (
              <>
                <div className="bulk-grid-2">
                  <div className="bulk-field">
                    <label className="bulk-label" htmlFor="bulk-phone-column">Phone number column</label>
                    <select
                      className="bulk-select"
                      id="bulk-phone-column"
                      onChange={(event) => setPhoneColumn(Number(event.target.value))}
                      value={phoneColumn}
                    >
                      {sheet.headers.map((header, column) => (
                        <option key={`${header}-${column}`} value={column}>
                          {header}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="bulk-field">
                    <label className="bulk-label" htmlFor="bulk-country">Numbers without a country code are from</label>
                    <select
                      className="bulk-select"
                      id="bulk-country"
                      onChange={(event) => setCountryOverride(event.target.value as CountryCode | "")}
                      value={country}
                    >
                      <option value="">— every number has its code —</option>
                      {countryOptions.map((option) => (
                        <option key={option.iso} value={option.iso}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="bulk-stats">
                  <span className="bulk-chip bulk-accent-green">{count.toLocaleString()} will get the message</span>
                  {list.invalid.length ? (
                    <button className="bulk-chip bulk-accent-rose bulk-chip-btn" onClick={() => setShowInvalid((v) => !v)} type="button">
                      {list.invalid.length} invalid {showInvalid ? "▴" : "▾"}
                    </button>
                  ) : null}
                  {list.duplicates ? <span className="bulk-chip bulk-accent-muted">{list.duplicates} duplicates removed</span> : null}
                </div>
                {showInvalid && list.invalid.length ? (
                  <ul className="bulk-invalid">
                    {list.invalid.slice(0, 100).map((row) => (
                      <li key={row.row}>
                        Row {row.row}: <span className="bulk-mono">{row.value || "(empty)"}</span>
                      </li>
                    ))}
                    {list.invalid.length > 100 ? <li>…and {list.invalid.length - 100} more</li> : null}
                  </ul>
                ) : null}

                {count ? (
                  <div className="bulk-table-wrap">
                    <table className="bulk-table">
                      <thead>
                        <tr>
                          <th>Phone</th>
                          {variables.slice(0, 4).map((header) => (
                            <th key={header}>{header}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {list.recipients.slice(0, 5).map((recipient) => (
                          <tr key={recipient.phone}>
                            <td className="bulk-mono">{recipient.phone}</td>
                            {variables.slice(0, 4).map((header) => (
                              <td key={header}>{recipient.variables[variableKey(header)]}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {count > 5 ? <div className="bulk-table-more">+ {(count - 5).toLocaleString()} more</div> : null}
                  </div>
                ) : null}
              </>
            ) : null}
          </section>

          {/* 2. Message */}
          <section className="bulk-step">
            <div className="bulk-step-head">
              <span className="bulk-step-num">2</span>
              <div>
                <h2 className="bulk-step-title">Message</h2>
                <p className="bulk-step-copy">Start from a template or write your own. Click a column to personalise.</p>
              </div>
            </div>

            <div className="bulk-field">
              <label className="bulk-label" htmlFor="bulk-template">Template</label>
              <select
                className="bulk-select"
                id="bulk-template"
                onChange={(event) => {
                  const value = event.target.value;
                  const picked =
                    templates.find((template) => template.id === value)?.body ??
                    starterTemplates.find((starter) => `starter:${starter.name}` === value)?.body;
                  if (picked !== undefined) setMessage(picked);
                }}
                value=""
              >
                <option value="">Choose a template…</option>
                {templates.length ? (
                  <optgroup label="Your templates">
                    {templates.map((template) => (
                      <option key={template.id} value={template.id}>
                        {template.name}
                      </option>
                    ))}
                  </optgroup>
                ) : null}
                <optgroup label="Starters">
                  {starterTemplates.map((starter) => (
                    <option key={starter.name} value={`starter:${starter.name}`}>
                      {starter.name}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            <div className="bulk-field">
              <label className="bulk-label" htmlFor="bulk-message">Message</label>
              <textarea
                className="bulk-textarea"
                id="bulk-message"
                maxLength={4096}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Hi {{name}}, …"
                ref={messageInput}
                rows={7}
                value={message}
              />
              <div className="bulk-field-foot">
                <div className="bulk-vars">
                  {[...variables, "phone"].map((header) => (
                    <button className="bulk-var" key={header} onClick={() => insertVariable(header)} type="button">
                      {`{{${header}}}`}
                    </button>
                  ))}
                </div>
                <span className="bulk-counter">{message.length}/4096</span>
              </div>
              {unknownPlaceholders.length && sheet ? (
                <div className="bulk-warning">
                  <AlertTriangle size={14} />
                  <span>
                    {unknownPlaceholders.map((key) => `{{${key}}}`).join(", ")} {unknownPlaceholders.length === 1 ? "isn't a column" : "aren't columns"} in your
                    file, so {unknownPlaceholders.length === 1 ? "it" : "they"} will be left empty.
                  </span>
                </div>
              ) : null}
              {message.trim() ? (
                savingTemplate ? (
                  <div className="bulk-inline-form">
                    <input
                      autoFocus
                      className="bulk-input"
                      maxLength={120}
                      onChange={(event) => setSavingTemplate({ name: event.target.value })}
                      onKeyDown={(event) => event.key === "Enter" && savingTemplate.name.trim() && void saveTemplate(savingTemplate.name)}
                      placeholder="Template name"
                      value={savingTemplate.name}
                    />
                    <button
                      className="bulk-btn bulk-btn-primary bulk-btn-sm"
                      disabled={!savingTemplate.name.trim()}
                      onClick={() => saveTemplate(savingTemplate.name)}
                      type="button"
                    >
                      Save
                    </button>
                    <button className="bulk-btn bulk-btn-secondary bulk-btn-sm" onClick={() => setSavingTemplate(null)} type="button">
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button className="bulk-link-btn" onClick={() => setSavingTemplate({ name: "" })} type="button">
                    <Plus size={13} /> Save as template
                  </button>
                )
              ) : null}
            </div>
          </section>

          {/* 3. Sending */}
          <section className="bulk-step">
            <div className="bulk-step-head">
              <span className="bulk-step-num">3</span>
              <div>
                <h2 className="bulk-step-title">Sending</h2>
                <p className="bulk-step-copy">Messages go out one at a time so your number looks like a person, not a robot.</p>
              </div>
            </div>
            <div className="bulk-grid-2">
              <div className="bulk-field">
                <label className="bulk-label" htmlFor="bulk-name">Name</label>
                <input
                  className="bulk-input"
                  id="bulk-name"
                  maxLength={120}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="e.g. Eid offer"
                  value={name}
                />
              </div>
              <div className="bulk-field">
                <label className="bulk-label" htmlFor="bulk-number">Send from</label>
                {numbers.length ? (
                  <select className="bulk-select" id="bulk-number" onChange={(event) => setNumberChoice(event.target.value)} value={numberId}>
                    {numbers.map((option) => (
                      <option key={option.id} value={option.id}>
                        {numberLabel(option)}
                        {option.status === "connected" ? "" : " — offline"}
                      </option>
                    ))}
                  </select>
                ) : (
                  <Link className="bulk-btn bulk-btn-secondary" href="/dashboard/phone-numbers">
                    Connect a WhatsApp number
                  </Link>
                )}
              </div>
              <div className="bulk-field">
                <label className="bulk-label" htmlFor="bulk-interval">Seconds between messages</label>
                <input
                  className="bulk-input"
                  id="bulk-interval"
                  inputMode="numeric"
                  max={MAX_INTERVAL_SECONDS}
                  min={MIN_INTERVAL_SECONDS}
                  onChange={(event) => setGapText(event.target.value.replace(/\D/g, ""))}
                  type="number"
                  value={gapText}
                />
                <span className="bulk-field-note">
                  Default {DEFAULT_INTERVAL_SECONDS}s. Shorter gaps raise the chance WhatsApp blocks the number.
                </span>
              </div>
            </div>
            {number && number.status !== "connected" ? (
              <div className="bulk-warning">
                <AlertTriangle size={14} />
                <span>This number is offline. The send will wait until it reconnects.</span>
              </div>
            ) : null}
          </section>
        </div>

        {/* Preview */}
        <aside className="bulk-preview">
          <div className="bulk-preview-card">
            <span className="bulk-label">Preview{first ? ` — ${first.phone}` : ""}</span>
            <div className="bulk-phone">
              {preview ? (
                <div className="bulk-bubble">
                  {preview}
                  <span className="bulk-bubble-time">now ✓✓</span>
                </div>
              ) : (
                <div className="bulk-phone-empty">Your message appears here as the first person will see it.</div>
              )}
            </div>
            <dl className="bulk-summary">
              <div>
                <dt>People</dt>
                <dd>{count.toLocaleString()}</dd>
              </div>
              <div>
                <dt>Gap</dt>
                <dd>{intervalValid ? `${intervalSeconds}s` : "—"}</dd>
              </div>
              <div>
                <dt>Takes about</dt>
                <dd>{count && intervalValid ? formatDuration((count - 1) * intervalSeconds) : "—"}</dd>
              </div>
            </dl>
            {problems.length ? (
              <ul className="bulk-problems">
                {problems.map((problem) => (
                  <li key={problem}>{problem}</li>
                ))}
              </ul>
            ) : null}
            <button
              className="bulk-btn bulk-btn-primary bulk-btn-block"
              disabled={problems.length > 0}
              onClick={() => setConfirming(true)}
              type="button"
            >
              <Send size={15} /> Start sending
            </button>
            <p className="bulk-fineprint">
              Only message people who expect to hear from you. Numbers that get reported for spam can be banned by WhatsApp.
            </p>
          </div>
        </aside>
      </div>

      {confirming && number ? (
        <ConfirmDialog
          busy={starting}
          confirmLabel={starting ? "Starting…" : "Start sending"}
          onCancel={() => setConfirming(false)}
          onConfirm={start}
          primary
          title={`Send to ${count.toLocaleString()} ${count === 1 ? "person" : "people"}?`}
        >
          From <strong>{numberLabel(number)}</strong>, one message every {intervalSeconds} seconds
          {count > 1 ? `, finishing in about ${formatDuration((count - 1) * intervalSeconds)}` : ""}. It keeps going if you close
          this page, and you can pause it at any time.
        </ConfirmDialog>
      ) : null}
    </div>
  );
}

/* ──────────────────────────── Dialogs ──────────────────────────── */

function Modal({ children, labelledBy, onClose, small }: { children: ReactNode; labelledBy: string; onClose: () => void; small?: boolean }) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className="bulk-modal-overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div aria-labelledby={labelledBy} aria-modal="true" className={`bulk-modal${small ? " bulk-modal-sm" : ""}`} role="dialog">
        {children}
      </div>
    </div>
  );
}

function ConfirmDialog({
  busy,
  children,
  confirmLabel,
  onCancel,
  onConfirm,
  primary,
  title,
}: {
  busy: boolean;
  children: ReactNode;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
  primary?: boolean;
  title: string;
}) {
  return (
    <Modal labelledBy="bulk-confirm-title" onClose={onCancel} small>
      <h2 className="bulk-modal-title" id="bulk-confirm-title">
        {title}
      </h2>
      <p className="bulk-modal-copy">{children}</p>
      <div className="bulk-modal-actions">
        <button className="bulk-btn bulk-btn-secondary" disabled={busy} onClick={onCancel} type="button">
          Cancel
        </button>
        <button
          className={`bulk-btn ${primary ? "bulk-btn-primary" : "bulk-btn-destructive"}`}
          disabled={busy}
          onClick={onConfirm}
          type="button"
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}

const css = `
.bulk-shell {
  --bg: var(--app-bg);
  --surface: var(--app-surface);
  --surface-2: var(--app-surface-2);
  --panel: var(--app-panel);
  --panel-hover: var(--app-panel-hover);
  --border: var(--app-border);
  --border-strong: var(--app-border-strong);
  --text: var(--app-text);
  --muted: var(--app-muted);
  --subtle: var(--app-subtle);
  --faint: var(--app-faint);
  --primary: var(--app-primary);
  --primary-2: var(--app-primary-2);
  --primary-soft: var(--app-primary-soft);
  --primary-light: var(--app-primary-light);
  background: var(--bg);
  color: var(--text);
  display: flex;
  font-family: var(--font-manrope), system-ui, sans-serif;
  font-size: 14px;
  height: 100vh;
  line-height: 1.5;
  max-height: 100vh;
  max-width: 100vw;
  overflow: hidden;
  width: 100vw;
}
.bulk-shell * { box-sizing: border-box; }
.bulk-shell button, .bulk-shell input, .bulk-shell select, .bulk-shell textarea { font: inherit; }
/* Small buttons keep their own size over the inherit above. */
.bulk-shell .bulk-chip-btn { font-size: 11px; font-weight: 800; }
.bulk-shell .bulk-var { font-family: var(--font-geist-mono), monospace; font-size: 11.5px; }
.bulk-shell .bulk-link-btn { font-size: 12.5px; font-weight: 800; }
.bulk-shell ::-webkit-scrollbar { height: 9px; width: 9px; }
.bulk-shell ::-webkit-scrollbar-thumb { background: var(--app-border-strong); border-radius: 9px; }
.bulk-shell ::-webkit-scrollbar-track { background: transparent; }
.bulk-main { display: flex; flex: 1; flex-direction: column; height: 100vh; min-width: 0; overflow: hidden; }
.bulk-content { flex: 1 1 auto; min-height: 0; overflow-y: auto; padding: 24px 32px 32px; }
.bulk-browse, .bulk-compose { display: flex; flex-direction: column; gap: 16px; margin: 0 auto; max-width: 1320px; width: 100%; }
.bulk-head { align-items: flex-end; display: flex; flex-wrap: wrap; gap: 12px 20px; justify-content: space-between; }
.bulk-title { font-size: 22px; font-weight: 850; letter-spacing: -.4px; margin: 0; }
.bulk-subtitle { color: var(--muted); font-size: 13px; margin: 4px 0 0; max-width: 560px; }
.bulk-tabs { border-bottom: 1px solid var(--border); display: flex; gap: 4px; }
.bulk-tab { align-items: center; background: none; border: 0; border-bottom: 2px solid transparent; color: var(--subtle); cursor: pointer; display: inline-flex; font-size: 13px; font-weight: 800; gap: 7px; margin-bottom: -1px; padding: 8px 12px 10px; transition: border-color .18s ease, color .18s ease; }
.bulk-tab:hover { color: var(--text); }
.bulk-tab.is-active { border-bottom-color: var(--primary); color: var(--text); }
.bulk-tab:focus-visible { border-radius: 8px; box-shadow: 0 0 0 3px var(--app-primary-ring); outline: none; }
.bulk-tab-dot { animation: bulk-pulse 1.6s ease-in-out infinite; background: var(--app-green); border-radius: 50%; height: 7px; width: 7px; }
.bulk-count { background: var(--app-hover-2); border: 1px solid var(--border-strong); border-radius: 999px; color: var(--subtle); font-size: 11px; font-weight: 800; line-height: 1; padding: 3px 7px; }
.bulk-btn { align-items: center; border: 1px solid var(--app-border-strong); border-radius: 11px; color: var(--text); cursor: pointer; display: inline-flex; font-weight: 800; gap: 8px; justify-content: center; min-height: 40px; padding: 0 14px; text-decoration: none; transition: background .18s ease, border-color .18s ease, filter .18s ease, transform .18s ease; white-space: nowrap; }
.bulk-btn:hover { transform: translateY(-1px); }
.bulk-btn:disabled { cursor: not-allowed; filter: grayscale(.35); opacity: .45; transform: none; }
.bulk-btn-primary { background: linear-gradient(140deg,var(--primary-2),var(--primary)); border-color: transparent; box-shadow: 0 4px 14px var(--app-primary-glow); color: var(--app-on-accent); }
.bulk-btn-secondary { background: var(--panel-hover); color: var(--text); }
.bulk-btn-secondary:hover { background: var(--app-hover-3); }
.bulk-btn-destructive { background: var(--app-rose-soft-2); border-color: var(--app-rose-border-strong); color: var(--app-rose-text); }
.bulk-btn-sm { border-radius: 9px; font-size: 12px; gap: 6px; min-height: 32px; padding: 0 11px; }
.bulk-btn-block { width: 100%; }
.bulk-icon-btn { align-items: center; background: transparent; border: 1px solid transparent; border-radius: 9px; color: var(--subtle); cursor: pointer; display: inline-flex; height: 32px; justify-content: center; transition: background .18s ease, color .18s ease; width: 32px; }
.bulk-icon-btn:hover { background: var(--app-hover-2); color: var(--text); }
.bulk-icon-btn:disabled { cursor: not-allowed; opacity: .45; }
.bulk-link-btn { align-items: center; background: none; border: 0; color: var(--app-primary-text, var(--primary-light)); cursor: pointer; display: inline-flex; font-size: 12.5px; font-weight: 800; gap: 5px; padding: 4px 0; }
.bulk-link-btn:hover { text-decoration: underline; }
.bulk-input, .bulk-select, .bulk-textarea { background: var(--panel); border: 1px solid var(--app-border); border-radius: 11px; color: var(--text); outline: none; transition: background .18s ease, border-color .18s ease, box-shadow .18s ease; width: 100%; }
.bulk-input { height: 40px; padding: 0 12px; }
.bulk-input::placeholder, .bulk-textarea::placeholder { color: var(--faint); }
.bulk-input:focus, .bulk-select:focus, .bulk-textarea:focus { background: var(--app-input-focus); border-color: var(--app-primary-ring-strong); box-shadow: 0 0 0 4px var(--app-primary-ring); }
.bulk-select { appearance: none; background-image: linear-gradient(45deg, transparent 50%, var(--app-muted) 50%), linear-gradient(135deg, var(--app-muted) 50%, transparent 50%); background-position: calc(100% - 17px) 50%, calc(100% - 12px) 50%; background-repeat: no-repeat; background-size: 5px 5px, 5px 5px; height: 40px; padding: 0 34px 0 12px; }
.bulk-select-sm { height: 32px; width: auto; }
.bulk-select option, .bulk-select optgroup { background: var(--surface); color: var(--text); }
.bulk-textarea { line-height: 1.55; min-height: 120px; padding: 10px 12px; resize: vertical; }
.bulk-mono { font-family: var(--font-geist-mono), monospace; font-size: 12.5px; }
.bulk-label { color: var(--subtle); display: block; font-size: 11.5px; font-weight: 800; letter-spacing: .3px; text-transform: uppercase; }
.bulk-field { display: grid; gap: 6px; min-width: 0; }
.bulk-field-foot { align-items: flex-start; display: flex; gap: 10px; justify-content: space-between; }
.bulk-field-note { color: var(--faint); font-size: 11.5px; }
.bulk-counter { color: var(--faint); flex-shrink: 0; font-size: 11px; font-weight: 700; padding-top: 3px; }
.bulk-grid-2 { display: grid; gap: 14px; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
.bulk-hint { color: var(--muted); font-size: 12.5px; margin: 0; }
.bulk-hint code { background: var(--app-hover-2); border-radius: 6px; font-family: var(--font-geist-mono), monospace; font-size: 11.5px; padding: 1px 5px; }
.bulk-warning { align-items: center; background: var(--app-amber-soft); border: 1px solid var(--app-amber-border); border-radius: 10px; color: var(--app-amber-text, var(--app-amber)); display: flex; flex-wrap: wrap; font-size: 12px; gap: 8px; padding: 9px 11px; }
.bulk-warning a { color: inherit; font-weight: 800; }
.bulk-error { background: var(--app-rose-soft); border: 1px solid var(--app-rose-border); border-radius: 10px; color: var(--app-rose-text); font-size: 12.5px; padding: 9px 11px; }
.bulk-text-rose { color: var(--app-rose); }
.bulk-accent-primary { background: var(--app-primary-soft); border-color: var(--app-primary-ring); color: var(--primary-light); }
.bulk-accent-sky { background: var(--app-sky-soft); border-color: var(--app-sky-border); color: var(--app-sky); }
.bulk-accent-rose { background: var(--app-rose-soft); border-color: var(--app-rose-border); color: var(--app-rose); }
.bulk-accent-green { background: var(--app-green-soft); border-color: var(--app-green-border); color: var(--app-green); }
.bulk-accent-amber { background: var(--app-amber-soft); border-color: var(--app-amber-border); color: var(--app-amber); }
.bulk-accent-muted { background: var(--app-hover-2); border-color: var(--border-strong); color: var(--subtle); }
.bulk-status, .bulk-chip { align-items: center; border: 1px solid; border-radius: 999px; display: inline-flex; font-size: 11.5px; font-weight: 800; gap: 6px; line-height: 1; padding: 5px 9px; white-space: nowrap; }
.bulk-chip { font-size: 11px; padding: 4px 8px; }
.bulk-chip-btn { cursor: pointer; font-family: inherit; }
.bulk-pulse { animation: bulk-pulse 1.6s ease-in-out infinite; background: currentColor; border-radius: 50%; height: 6px; width: 6px; }
@keyframes bulk-pulse { 0%, 100% { opacity: 1; } 50% { opacity: .3; } }
.bulk-empty-line { align-items: center; border: 1px dashed var(--border-strong); border-radius: 14px; color: var(--subtle); display: flex; flex-direction: column; font-size: 12.5px; gap: 4px; padding: 28px 16px; text-align: center; }
.bulk-empty { align-items: center; border: 1px dashed var(--border-strong); border-radius: 18px; display: flex; flex-direction: column; padding: 48px 20px; text-align: center; }
.bulk-empty-icon { align-items: center; background: var(--app-primary-soft); border: 1px solid var(--app-primary-ring); border-radius: 20px; color: var(--primary-light); display: flex; height: 64px; justify-content: center; width: 64px; }
.bulk-empty-title { font-size: 17px; font-weight: 850; margin: 16px 0 0; }
.bulk-empty-copy { color: var(--muted); font-size: 13px; line-height: 1.6; margin: 8px 0 18px; max-width: 440px; }
.bulk-list { display: flex; flex-direction: column; gap: 12px; }
.bulk-card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; box-shadow: 0 1px 2px var(--app-shadow-soft); display: flex; flex-direction: column; gap: 12px; padding: 14px 16px; }
.bulk-card[data-open] { border-color: var(--app-primary-ring); }
.bulk-card-main { align-items: center; display: flex; flex-wrap: wrap; gap: 10px 14px; }
.bulk-card-toggle { align-items: center; background: none; border: 0; color: inherit; cursor: pointer; display: flex; flex: 1 1 260px; gap: 8px; min-width: 0; padding: 0; text-align: left; }
.bulk-card-chevron { color: var(--faint); display: inline-flex; }
.bulk-card-identity { display: grid; gap: 2px; min-width: 0; }
.bulk-card-name { font-size: 14.5px; font-weight: 850; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.bulk-card-meta { color: var(--subtle); font-size: 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.bulk-card-actions { align-items: center; display: flex; gap: 6px; margin-left: auto; }
.bulk-progress { display: grid; gap: 7px; }
.bulk-progress-track { background: var(--app-hover-2); border-radius: 999px; display: flex; height: 7px; overflow: hidden; }
.bulk-progress-sent { background: var(--app-green); transition: width .4s ease; }
.bulk-progress-failed { background: var(--app-rose); transition: width .4s ease; }
.bulk-progress-stats { align-items: center; color: var(--subtle); display: flex; flex-wrap: wrap; font-size: 12px; font-weight: 700; gap: 6px 14px; }
.bulk-progress-stats span { align-items: center; display: inline-flex; gap: 5px; }
.bulk-progress-total { color: var(--faint); }
.bulk-progress-eta { color: var(--app-green); margin-left: auto; }
.bulk-recipients { border-top: 1px solid var(--border); display: grid; gap: 12px; padding-top: 12px; }
.bulk-message-preview p { background: var(--panel); border: 1px solid var(--border); border-radius: 11px; font-size: 13px; margin: 6px 0 0; padding: 10px 12px; white-space: pre-wrap; word-break: break-word; }
.bulk-recipients-head { align-items: center; display: flex; gap: 10px; justify-content: space-between; }
.bulk-table-wrap { border: 1px solid var(--border); border-radius: 12px; overflow-x: auto; }
.bulk-table { border-collapse: collapse; font-size: 12.5px; min-width: 100%; }
.bulk-table th { background: var(--panel); color: var(--subtle); font-size: 11px; font-weight: 800; letter-spacing: .3px; padding: 8px 12px; text-align: left; text-transform: uppercase; white-space: nowrap; }
.bulk-table td { border-top: 1px solid var(--border); max-width: 280px; overflow: hidden; padding: 8px 12px; text-overflow: ellipsis; white-space: nowrap; }
.bulk-cell-muted { color: var(--subtle); }
.bulk-table-more { border-top: 1px solid var(--border); color: var(--faint); font-size: 11.5px; padding: 7px 12px; }
.bulk-pager { align-items: center; color: var(--subtle); display: flex; font-size: 12px; gap: 10px; justify-content: flex-end; }
.bulk-template-grid { display: grid; gap: 14px; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); }
.bulk-template-card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; display: flex; flex-direction: column; gap: 10px; min-height: 170px; padding: 16px; }
.bulk-template-starter { border-style: dashed; }
.bulk-template-starter .bulk-btn { align-self: flex-start; margin-top: auto; }
.bulk-template-top { align-items: center; display: flex; gap: 8px; justify-content: space-between; }
.bulk-template-name { font-size: 14.5px; font-weight: 850; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.bulk-template-actions { display: flex; gap: 2px; }
.bulk-template-body { -webkit-box-orient: vertical; -webkit-line-clamp: 5; color: var(--muted); display: -webkit-box; font-size: 12.5px; line-height: 1.55; margin: 0; overflow: hidden; white-space: pre-wrap; }
.bulk-add-card { align-items: center; background: transparent; border: 1px dashed var(--border-strong); border-radius: 16px; color: var(--subtle); cursor: pointer; display: flex; flex-direction: column; gap: 8px; justify-content: center; min-height: 170px; transition: background .18s ease, border-color .18s ease, color .18s ease; }
.bulk-add-card:hover { background: var(--app-hover); border-color: var(--app-primary-border); color: var(--text); }
.bulk-add-icon { align-items: center; border: 1px solid var(--border-strong); border-radius: 12px; display: flex; height: 40px; justify-content: center; width: 40px; }
.bulk-add-label { font-size: 13.5px; font-weight: 800; }
.bulk-compose-head { align-items: center; display: flex; gap: 14px; }
.bulk-compose-grid { align-items: start; display: grid; gap: 20px; grid-template-columns: minmax(0, 1fr) 340px; }
.bulk-compose-steps { display: flex; flex-direction: column; gap: 16px; min-width: 0; }
.bulk-step { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; display: grid; gap: 14px; padding: 18px; }
.bulk-step-head { align-items: flex-start; display: flex; gap: 12px; }
.bulk-step-head > div { flex: 1; }
.bulk-step-num { align-items: center; background: var(--app-primary-soft); border: 1px solid var(--app-primary-ring); border-radius: 9px; color: var(--primary-light); display: flex; flex-shrink: 0; font-size: 13px; font-weight: 850; height: 28px; justify-content: center; width: 28px; }
.bulk-step-title { font-size: 15px; font-weight: 850; margin: 0; }
.bulk-step-copy { color: var(--muted); font-size: 12.5px; margin: 2px 0 0; }
.bulk-drop { background: var(--panel); border: 1.5px dashed var(--border-strong); border-radius: 14px; transition: background .18s ease, border-color .18s ease; }
.bulk-drop[data-dragging] { background: var(--app-primary-soft); border-color: var(--primary); }
.bulk-file-input { height: 1px; opacity: 0; position: absolute; width: 1px; }
.bulk-drop-label { align-items: center; color: var(--subtle); cursor: pointer; display: flex; flex-direction: column; font-size: 12px; gap: 6px; padding: 28px 16px; text-align: center; }
.bulk-drop-label strong { color: var(--text); font-size: 13.5px; }
.bulk-file-input:focus-visible + .bulk-drop-label { border-radius: 14px; box-shadow: 0 0 0 4px var(--app-primary-ring); }
.bulk-file-row { align-items: center; display: flex; gap: 12px; padding: 12px 14px; }
.bulk-file-icon { align-items: center; background: var(--app-green-soft); border: 1px solid var(--app-green-border); border-radius: 10px; color: var(--app-green); display: flex; flex-shrink: 0; height: 40px; justify-content: center; width: 40px; }
.bulk-file-text { display: grid; flex: 1; gap: 1px; min-width: 0; }
.bulk-file-text strong { font-size: 13.5px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.bulk-file-text span { color: var(--subtle); font-size: 12px; }
.bulk-stats { display: flex; flex-wrap: wrap; gap: 8px; }
.bulk-invalid { background: var(--panel); border: 1px solid var(--border); border-radius: 11px; color: var(--muted); font-size: 12px; margin: 0; max-height: 160px; overflow-y: auto; padding: 8px 12px 8px 28px; }
.bulk-vars { display: flex; flex-wrap: wrap; gap: 6px; }
.bulk-var { background: var(--app-hover-2); border: 1px solid var(--border-strong); border-radius: 7px; color: var(--text); cursor: pointer; padding: 3px 7px; transition: background .18s ease, border-color .18s ease; }
.bulk-var:hover { background: var(--app-primary-soft); border-color: var(--app-primary-ring); }
.bulk-inline-form { align-items: center; display: flex; gap: 8px; }
.bulk-inline-form .bulk-input { height: 32px; max-width: 260px; }
.bulk-preview { position: sticky; top: 0; }
.bulk-preview-card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; display: grid; gap: 14px; padding: 16px; }
.bulk-phone { background: var(--app-panel); background-image: radial-gradient(var(--app-hover-2) 1px, transparent 1px); background-size: 14px 14px; border: 1px solid var(--border); border-radius: 14px; min-height: 160px; padding: 16px 12px; }
.bulk-bubble { background: var(--app-green-soft); border: 1px solid var(--app-green-border); border-radius: 12px 12px 4px 12px; font-size: 13px; line-height: 1.5; margin-left: auto; max-width: 92%; padding: 8px 10px 6px; white-space: pre-wrap; width: fit-content; word-break: break-word; }
.bulk-bubble-time { color: var(--faint); display: block; font-size: 10.5px; margin-top: 4px; text-align: right; }
.bulk-phone-empty { color: var(--faint); font-size: 12.5px; padding: 40px 10px; text-align: center; }
.bulk-summary { display: grid; gap: 8px; grid-template-columns: repeat(3, 1fr); margin: 0; }
.bulk-summary div { background: var(--panel); border: 1px solid var(--border); border-radius: 10px; padding: 8px 10px; }
.bulk-summary dt { color: var(--faint); font-size: 10.5px; font-weight: 800; letter-spacing: .3px; text-transform: uppercase; }
.bulk-summary dd { font-size: 14px; font-weight: 850; margin: 2px 0 0; }
.bulk-problems { color: var(--subtle); font-size: 12px; margin: 0; padding-left: 18px; }
.bulk-fineprint { color: var(--faint); font-size: 11.5px; line-height: 1.5; margin: 0; }
.bulk-modal-overlay { align-items: center; backdrop-filter: blur(3px); background: var(--app-overlay); display: flex; inset: 0; justify-content: center; padding: 24px; position: fixed; z-index: 120; }
.bulk-modal { background: var(--surface-2); border: 1px solid var(--border-strong); border-radius: 18px; box-shadow: 0 30px 80px var(--app-shadow-color-strong); display: grid; gap: 14px; max-height: calc(100vh - 48px); max-width: 560px; overflow-y: auto; padding: 22px; width: 100%; }
.bulk-modal-sm { max-width: 440px; }
.bulk-modal-title { font-size: 17px; font-weight: 850; letter-spacing: -.2px; margin: 0; }
.bulk-modal-copy { color: var(--muted); font-size: 13px; line-height: 1.55; margin: 0; }
.bulk-modal-copy strong { color: var(--text); }
.bulk-modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 6px; }
.bulk-toast { border-radius: 12px; bottom: 24px; box-shadow: 0 18px 50px var(--app-shadow-color); font-size: 13px; font-weight: 750; left: 50%; max-width: min(480px, calc(100vw - 48px)); padding: 12px 18px; position: fixed; transform: translateX(-50%); z-index: 130; }
.bulk-toast-success { background: var(--app-toast-success-bg); border: 1px solid var(--app-green-border); color: var(--app-toast-success-text); }
.bulk-toast-error { background: var(--app-toast-error-bg); border: 1px solid var(--app-rose-border-strong); color: var(--app-rose-text); }
@media (min-width: 1680px) {
  .bulk-content { padding: 28px 40px 36px; }
}
@media (max-width: 1100px) {
  .bulk-content { padding: 20px 20px 28px; }
  .bulk-compose-grid { grid-template-columns: minmax(0, 1fr); }
  .bulk-preview { position: static; }
}
/* Tablets and phones: the sidebar becomes a drawer behind a top bar, and the
   page scrolls as a whole. */
@media (max-width: 900px) {
  .bulk-shell { display: block; height: auto; max-height: none; max-width: 100%; min-height: 100dvh; overflow: visible; width: 100%; }
  .bulk-main { height: auto; overflow: visible; }
  .bulk-content { overflow: visible; padding: 16px; }
}
@media (max-width: 640px) {
  .bulk-content { padding: 12px 12px calc(16px + env(safe-area-inset-bottom)); }
  .bulk-shell input, .bulk-shell select, .bulk-shell textarea { font-size: 16px; } /* stops iOS zooming on focus */
  .bulk-head .bulk-btn { width: 100%; }
  .bulk-card-actions { margin-left: 0; width: 100%; }
  .bulk-progress-eta { margin-left: 0; }
  .bulk-step { padding: 14px; }
  .bulk-template-grid { grid-template-columns: 1fr; }
  .bulk-modal-overlay { align-items: flex-end; padding: 0; }
  .bulk-modal { border-radius: 18px 18px 0 0; max-height: 90dvh; padding: 18px 16px calc(18px + env(safe-area-inset-bottom)); }
  .bulk-toast { bottom: calc(16px + env(safe-area-inset-bottom)); max-width: calc(100vw - 24px); width: max-content; }
}
`;

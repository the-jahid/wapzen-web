"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { AlertTriangle, Phone, RefreshCw, Search, Users } from "lucide-react";
import { DashboardSidebar } from "@/components/nav/DashboardSidebar";
import { useCachedState } from "@/lib/pageCache";
import { listPhoneNumbers, type ApiPhoneNumber } from "@/lib/phoneNumbers";
import { listWhatsAppGroups, setGroupAi, type ApiGroupList, type ApiWhatsAppGroup } from "@/lib/whatsappGroups";

// Groups: pick one of the account's WhatsApp numbers, see the groups it is in,
// and switch the AI on group by group. Every group starts off. The list comes
// live from WhatsApp, so only a connected number has one.

type Notice = { kind: "success" | "error"; text: string };

function describeError(error: unknown, fallback: string) {
  return error instanceof Error && error.message ? error.message : fallback;
}

export default function GroupsPage() {
  const { getToken } = useAuth();
  const [numbers, setNumbers, hasCachedNumbers] = useCachedState<ApiPhoneNumber[]>("phone-numbers", []);
  const [loading, setLoading] = useState(!hasCachedNumbers);
  const [loadError, setLoadError] = useState("");
  const [numberId, setNumberId] = useState("");
  const [notice, setNotice] = useState<Notice | null>(null);

  useEffect(() => {
    let cancelled = false;
    listPhoneNumbers(getToken)
      .then((list) => {
        if (cancelled) return;
        setNumbers(list);
        setLoadError("");
      })
      .catch((error) => !cancelled && setLoadError(describeError(error, "Could not load your numbers")))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [getToken, setNumbers]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 4200);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const linked = numbers.filter((number) => number.phone_number);
  const selected = linked.find((number) => number.id === numberId && number.status === "connected");

  return (
    <div className="grp-shell app-accent-green">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <DashboardSidebar activeLabel="Groups" stackBelow={900} />

      <main className="grp-main">
        <div className="grp-content">
          <div className="grp-page">
            <header>
              <h1 className="grp-title">Groups</h1>
              <p className="grp-subtitle">
                Choose a number to see its WhatsApp groups, then switch the AI on in the ones you want it to answer.
              </p>
            </header>

            <section aria-label="Choose a number" className="grp-section">
              <h2 className="grp-label">Number</h2>
              {loading && !linked.length ? (
                <div className="grp-empty-line">Loading your numbers…</div>
              ) : loadError && !linked.length ? (
                <div className="grp-empty-line">
                  <strong>Could not load your numbers</strong>
                  <span>{loadError}</span>
                </div>
              ) : !linked.length ? (
                <div className="grp-empty">
                  <span className="grp-empty-icon">
                    <Phone size={28} strokeWidth={1.6} />
                  </span>
                  <h3 className="grp-empty-title">No WhatsApp number yet</h3>
                  <p className="grp-empty-copy">Connect a number first. Its groups will show up here.</p>
                  <Link className="grp-btn grp-btn-primary" href="/dashboard/phone-numbers">
                    Go to Phone Numbers
                  </Link>
                </div>
              ) : (
                <div className="grp-numbers">
                  {linked.map((number) => {
                    const online = number.status === "connected";
                    return (
                      <button
                        aria-pressed={selected?.id === number.id}
                        className={`grp-number${selected?.id === number.id ? " is-active" : ""}`}
                        disabled={!online}
                        key={number.id}
                        onClick={() => setNumberId(number.id)}
                        title={online ? undefined : "Reconnect this number on the Phone Numbers page to see its groups"}
                        type="button"
                      >
                        <span className={`grp-dot${online ? " is-online" : ""}`} />
                        <span className="grp-number-text">
                          <strong>{number.label || number.phone_number}</strong>
                          <span>{online ? (number.label ? number.phone_number : "Connected") : "Offline"}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </section>

            {selected ? (
              <GroupsPanel key={selected.id} number={selected} onNotice={setNotice} />
            ) : linked.length ? (
              <div className="grp-empty-line">Choose a number above to see its groups.</div>
            ) : null}
          </div>
        </div>
      </main>

      {notice ? (
        <div className={`grp-toast ${notice.kind === "error" ? "grp-toast-error" : "grp-toast-success"}`} role="status">
          {notice.text}
        </div>
      ) : null}
    </div>
  );
}

function GroupsPanel({ number, onNotice }: { number: ApiPhoneNumber; onNotice: (notice: Notice) => void }) {
  const { getToken } = useAuth();
  const [list, setList] = useState<ApiGroupList | null>(null);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState<string[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let cancelled = false;
    listWhatsAppGroups(number.id, getToken)
      .then((next) => {
        if (cancelled) return;
        setList(next);
        setError("");
      })
      .catch((loadError) => !cancelled && setError(describeError(loadError, "Could not load the groups")))
      .finally(() => !cancelled && setRefreshing(false));
    return () => {
      cancelled = true;
    };
  }, [getToken, number.id, reloadKey]);

  function reload() {
    setRefreshing(true);
    setReloadKey((key) => key + 1);
  }

  async function toggle(group: ApiWhatsAppGroup) {
    if (saving.includes(group.jid)) return;
    const on = !group.ai_enabled;
    setSaving((current) => [...current, group.jid]);
    try {
      await setGroupAi(number.id, group.jid, on, getToken);
      setList(
        (current) =>
          current && {
            ...current,
            groups: current.groups.map((item) => (item.jid === group.jid ? { ...item, ai_enabled: on } : item)),
          }
      );
      onNotice({ kind: "success", text: `AI switched ${on ? "on" : "off"} in "${group.name}".` });
    } catch (saveError) {
      onNotice({ kind: "error", text: describeError(saveError, "Could not change the group.") });
    } finally {
      setSaving((current) => current.filter((jid) => jid !== group.jid));
    }
  }

  if (!list) {
    if (error) {
      return (
        <div className="grp-empty-line">
          <strong>Could not load the groups</strong>
          <span>{error}</span>
          <button className="grp-btn grp-btn-secondary grp-btn-sm" disabled={refreshing} onClick={reload} type="button">
            Try again
          </button>
        </div>
      );
    }
    return <div className="grp-empty-line">Asking WhatsApp for this number&apos;s groups…</div>;
  }

  const agentActive = list.chat_agent?.status === "active";
  const onCount = list.groups.filter((group) => group.ai_enabled).length;
  const search = query.trim().toLowerCase();
  const shown = search ? list.groups.filter((group) => group.name.toLowerCase().includes(search)) : list.groups;

  return (
    <section aria-label="Groups" className="grp-section">
      <div className="grp-list-head">
        <h2 className="grp-label">
          {list.groups.length} group{list.groups.length === 1 ? "" : "s"} · AI on in {onCount}
        </h2>
        <button className="grp-btn grp-btn-secondary grp-btn-sm" disabled={refreshing} onClick={reload} type="button">
          <RefreshCw size={13} /> {refreshing ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      <div className="grp-info">
        <strong>The AI stays off in every group until you switch it on.</strong>{" "}
        Once on, it answers only when someone tags this number or replies to one of its messages. Nothing else said in the
        group is answered or saved. Messages sent from this number&apos;s own phone don&apos;t count, so test it from another
        phone.
      </div>

      {!agentActive ? (
        <div className="grp-warning">
          <AlertTriangle size={14} />
          <span>
            {list.chat_agent
              ? `Your agent "${list.chat_agent.name}" is inactive, so the AI can't answer in any group yet.`
              : "No chat agent is using this number, so the AI can't answer in any group yet."}
          </span>
          <Link href="/dashboard/chat">Chat Agents</Link>
        </div>
      ) : null}

      {error ? <div className="grp-warning">{error}</div> : null}

      {list.groups.length === 0 ? (
        <div className="grp-empty">
          <span className="grp-empty-icon">
            <Users size={28} strokeWidth={1.6} />
          </span>
          <h3 className="grp-empty-title">This number isn&apos;t in any groups</h3>
          <p className="grp-empty-copy">Add it to a group on WhatsApp, then refresh this page.</p>
        </div>
      ) : (
        <>
          {list.groups.length > 6 ? (
            <label className="grp-search">
              <Search size={15} />
              <input
                aria-label="Search groups"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search groups"
                type="search"
                value={query}
              />
            </label>
          ) : null}
          {shown.length === 0 ? (
            <div className="grp-empty-line">No group matches &quot;{query.trim()}&quot;.</div>
          ) : (
            <ul className="grp-list">
              {shown.map((group) => (
                <GroupRow busy={saving.includes(group.jid)} group={group} key={group.jid} onToggle={() => void toggle(group)} />
              ))}
            </ul>
          )}
          <p className="grp-fineprint">
            Replies in groups count towards the agent&apos;s hourly reply limit. Group members didn&apos;t sign up to talk to an
            AI, so let them know it answers for this number.
          </p>
        </>
      )}
    </section>
  );
}

function GroupRow({ busy, group, onToggle }: { busy: boolean; group: ApiWhatsAppGroup; onToggle: () => void }) {
  const on = group.ai_enabled;
  // A group that went admins-only while on can still be switched off.
  const locked = !group.can_send && !on;

  return (
    <li className={`grp-row${on ? " is-on" : ""}`}>
      <span className="grp-avatar">
        <Users size={18} strokeWidth={1.8} />
      </span>
      <span className="grp-row-text">
        <strong>{group.name}</strong>
        <span>
          {group.member_count} member{group.member_count === 1 ? "" : "s"}
          {group.can_send ? "" : " · Only admins can post, and this number isn't one"}
        </span>
      </span>
      <button
        aria-checked={on}
        aria-label={`AI in ${group.name}`}
        className={`grp-switch${on ? " is-on" : ""}`}
        disabled={busy || locked}
        onClick={onToggle}
        role="switch"
        title={locked ? "The AI couldn't reply here" : undefined}
        type="button"
      >
        <span className="grp-switch-track">
          <span className="grp-switch-knob" />
        </span>
        <span className="grp-switch-label">{on ? "AI on" : "AI off"}</span>
      </button>
    </li>
  );
}

const css = `
.grp-shell { background: var(--app-bg); color: var(--app-text); display: flex; font-family: var(--font-manrope), system-ui, sans-serif; font-size: 14px; height: 100vh; line-height: 1.5; max-height: 100vh; max-width: 100vw; overflow: hidden; width: 100vw; }
.grp-shell * { box-sizing: border-box; }
.grp-shell button, .grp-shell input { font: inherit; }
.grp-shell ::-webkit-scrollbar { height: 9px; width: 9px; }
.grp-shell ::-webkit-scrollbar-thumb { background: var(--app-border-strong); border-radius: 9px; }
.grp-shell ::-webkit-scrollbar-track { background: transparent; }
.grp-main { display: flex; flex: 1; flex-direction: column; height: 100vh; min-width: 0; overflow: hidden; }
.grp-content { flex: 1 1 auto; min-height: 0; overflow-y: auto; padding: 24px 32px 32px; }
.grp-page { display: flex; flex-direction: column; gap: 20px; margin: 0 auto; max-width: 880px; width: 100%; }
.grp-title { font-size: 22px; font-weight: 850; letter-spacing: -.4px; margin: 0; }
.grp-subtitle { color: var(--app-muted); font-size: 13px; margin: 4px 0 0; max-width: 560px; }
.grp-section { display: flex; flex-direction: column; gap: 12px; }
.grp-label { color: var(--app-subtle); font-size: 11.5px; font-weight: 800; letter-spacing: .3px; margin: 0; text-transform: uppercase; }
.grp-numbers { display: grid; gap: 10px; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); }
.grp-number { align-items: center; background: var(--app-surface); border: 1px solid var(--app-border); border-radius: 13px; color: var(--app-text); cursor: pointer; display: flex; gap: 11px; min-width: 0; padding: 12px 14px; text-align: left; transition: background .18s ease, border-color .18s ease, box-shadow .18s ease; }
.grp-number:hover:not(:disabled) { background: var(--app-panel-hover); border-color: var(--app-border-strong); }
.grp-number:focus-visible { box-shadow: 0 0 0 3px var(--app-primary-ring); outline: none; }
.grp-number:disabled { cursor: not-allowed; opacity: .55; }
.grp-number.is-active { background: var(--app-primary-soft); border-color: var(--app-primary); }
.grp-number-text { display: grid; gap: 1px; min-width: 0; }
.grp-number-text strong { font-size: 13.5px; font-weight: 800; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.grp-number-text span { color: var(--app-subtle); font-size: 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.grp-dot { background: var(--app-faint); border-radius: 50%; flex-shrink: 0; height: 8px; width: 8px; }
.grp-dot.is-online { background: var(--app-green); }
.grp-list-head { align-items: center; display: flex; flex-wrap: wrap; gap: 8px 12px; justify-content: space-between; }
.grp-info { background: var(--app-panel); border: 1px solid var(--app-border); border-radius: 12px; color: var(--app-muted); font-size: 12.5px; line-height: 1.6; padding: 11px 13px; }
.grp-info strong { color: var(--app-text); font-weight: 800; }
.grp-warning { align-items: center; background: var(--app-amber-soft); border: 1px solid var(--app-amber-border); border-radius: 10px; color: var(--app-amber-text, var(--app-amber)); display: flex; flex-wrap: wrap; font-size: 12.5px; gap: 8px; padding: 9px 11px; }
.grp-warning a { color: inherit; font-weight: 800; }
.grp-search { align-items: center; background: var(--app-panel); border: 1px solid var(--app-border); border-radius: 11px; color: var(--app-faint); display: flex; gap: 8px; height: 40px; padding: 0 12px; transition: border-color .18s ease, box-shadow .18s ease; }
.grp-search:focus-within { border-color: var(--app-primary-ring-strong); box-shadow: 0 0 0 4px var(--app-primary-ring); }
.grp-search input { background: transparent; border: 0; color: var(--app-text); flex: 1; min-width: 0; outline: none; }
.grp-search input::placeholder { color: var(--app-faint); }
.grp-list { display: flex; flex-direction: column; gap: 8px; list-style: none; margin: 0; padding: 0; }
.grp-row { align-items: center; background: var(--app-surface); border: 1px solid var(--app-border); border-radius: 13px; display: flex; gap: 12px; padding: 11px 14px; transition: border-color .18s ease; }
.grp-row.is-on { border-color: var(--app-green-border); }
.grp-avatar { align-items: center; background: var(--app-hover-2); border-radius: 11px; color: var(--app-subtle); display: flex; flex-shrink: 0; height: 38px; justify-content: center; width: 38px; }
.grp-row.is-on .grp-avatar { background: var(--app-green-soft); color: var(--app-green); }
.grp-row-text { display: grid; flex: 1; gap: 1px; min-width: 0; }
.grp-row-text strong { font-size: 14px; font-weight: 800; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.grp-row-text span { color: var(--app-subtle); font-size: 12px; }
.grp-switch { align-items: center; background: none; border: 0; color: var(--app-subtle); cursor: pointer; display: inline-flex; flex-shrink: 0; font-size: 12px; font-weight: 800; gap: 8px; padding: 6px 2px; }
.grp-switch:disabled { cursor: not-allowed; opacity: .5; }
.grp-switch:focus-visible { border-radius: 8px; box-shadow: 0 0 0 3px var(--app-primary-ring); outline: none; }
.grp-switch.is-on { color: var(--app-green); }
.grp-switch-track { background: var(--app-border-strong); border-radius: 999px; display: inline-block; height: 20px; position: relative; transition: background .18s ease; width: 36px; }
.grp-switch.is-on .grp-switch-track { background: var(--app-green); }
.grp-switch-knob { background: #fff; border-radius: 50%; box-shadow: 0 1px 2px rgba(0,0,0,.3); height: 16px; left: 2px; position: absolute; top: 2px; transition: transform .18s ease; width: 16px; }
.grp-switch.is-on .grp-switch-knob { transform: translateX(16px); }
.grp-switch-label { min-width: 38px; text-align: left; }
.grp-fineprint { color: var(--app-faint); font-size: 11.5px; line-height: 1.5; margin: 0; }
.grp-btn { align-items: center; border: 1px solid var(--app-border-strong); border-radius: 11px; color: var(--app-text); cursor: pointer; display: inline-flex; font-weight: 800; gap: 8px; justify-content: center; min-height: 40px; padding: 0 14px; text-decoration: none; transition: background .18s ease, transform .18s ease; white-space: nowrap; }
.grp-btn:hover:not(:disabled) { transform: translateY(-1px); }
.grp-btn:disabled { cursor: not-allowed; opacity: .5; }
.grp-btn-primary { background: linear-gradient(140deg,var(--app-primary-2),var(--app-primary)); border-color: transparent; box-shadow: 0 4px 14px var(--app-primary-glow); color: var(--app-on-accent); }
.grp-btn-secondary { background: var(--app-panel-hover); }
.grp-btn-sm { border-radius: 9px; font-size: 12px; gap: 6px; min-height: 32px; padding: 0 11px; }
.grp-empty-line { align-items: center; border: 1px dashed var(--app-border-strong); border-radius: 14px; color: var(--app-subtle); display: flex; flex-direction: column; font-size: 12.5px; gap: 6px; padding: 28px 16px; text-align: center; }
.grp-empty-line strong { color: var(--app-text); }
.grp-empty { align-items: center; border: 1px dashed var(--app-border-strong); border-radius: 18px; display: flex; flex-direction: column; padding: 40px 20px; text-align: center; }
.grp-empty-icon { align-items: center; background: var(--app-primary-soft); border: 1px solid var(--app-primary-ring); border-radius: 18px; color: var(--app-primary-light); display: flex; height: 58px; justify-content: center; width: 58px; }
.grp-empty-title { font-size: 16px; font-weight: 850; margin: 14px 0 0; }
.grp-empty-copy { color: var(--app-muted); font-size: 13px; line-height: 1.6; margin: 6px 0 16px; max-width: 420px; }
.grp-empty-copy:last-child { margin-bottom: 0; }
.grp-toast { border-radius: 12px; bottom: 24px; box-shadow: 0 18px 50px var(--app-shadow-color); font-size: 13px; font-weight: 750; left: 50%; max-width: min(480px, calc(100vw - 48px)); padding: 12px 18px; position: fixed; transform: translateX(-50%); z-index: 130; }
.grp-toast-success { background: var(--app-toast-success-bg); border: 1px solid var(--app-green-border); color: var(--app-toast-success-text); }
.grp-toast-error { background: var(--app-toast-error-bg); border: 1px solid var(--app-rose-border-strong); color: var(--app-rose-text); }
@media (max-width: 1100px) {
  .grp-content { padding: 20px 20px 28px; }
}
/* Tablets and phones: the sidebar becomes a drawer behind a top bar, and the
   page scrolls as a whole. */
@media (max-width: 900px) {
  .grp-shell { display: block; height: auto; max-height: none; max-width: 100%; min-height: 100dvh; overflow: visible; width: 100%; }
  .grp-main { height: auto; overflow: visible; }
  .grp-content { overflow: visible; padding: 16px; }
}
@media (max-width: 640px) {
  .grp-content { padding: 12px 12px calc(16px + env(safe-area-inset-bottom)); }
  .grp-shell input { font-size: 16px; } /* stops iOS zooming on focus */
  .grp-numbers { grid-template-columns: 1fr; }
  .grp-row { padding: 10px 12px; }
  .grp-switch-label { display: none; }
  .grp-toast { bottom: calc(16px + env(safe-area-inset-bottom)); max-width: calc(100vw - 24px); width: max-content; }
}
`;

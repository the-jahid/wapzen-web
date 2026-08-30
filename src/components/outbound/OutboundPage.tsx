"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { useAuth, useUser, UserButton } from "@clerk/nextjs";
import ExpandableCardDemoStandard from "@/components/expandable-card-demo-standard";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import {
  navItemsForMode,
  useWorkspaceMode,
  WorkspaceModeToggle,
} from "@/components/nav/workspaceMode";
import { useTheme } from "@/components/theme/ThemeProvider";
import { clerkAppearance } from "@/components/theme/clerkAppearance";
import {
  createOutboundCampaign as apiCreateCampaign,
  deleteOutboundCampaign as apiDeleteCampaign,
  getOutboundCampaign as apiGetCampaign,
  listOutboundCampaigns as apiListCampaigns,
  updateOutboundCampaign as apiUpdateCampaign,
  type CreateOutboundCampaignPayload,
  type OutboundCampaign,
  type OutboundCampaignStatus,
  type UpdateOutboundCampaignPayload,
} from "@/lib/outboundCampaigns";
import { listDashboardAgents } from "@/lib/agents";
import { listPhoneNumbers } from "@/lib/phoneNumbers";
import CampaignLeadsWorkspace from "@/components/outbound/CampaignLeadsWorkspace";
import CampaignCallsWorkspace from "@/components/outbound/CampaignCallsWorkspace";
import CampaignAnalyticsWorkspace from "@/components/outbound/CampaignAnalyticsWorkspace";

type IconName = "grid" | "agents" | "phone" | "phoneOut" | "demo" | "chat" | "message" | "calendar" | "chart" | "settings" | "spark" | "key" | "book" | "wrench" | "target" | "plus" | "edit" | "trash" | "refresh" | "search" | "list" | "chevron" | "x";
type Notice = { kind: "success" | "error"; text: string };
type LoadState = "loading" | "ready" | "error";
type CampaignTab = "overview" | "calls" | "leads" | "analytics";
type ViewMode = "list" | "grid";

// AgentOption is one pickable agent. A campaign is pointed at an agent, never at
// a phone number: the agent carries the number it speaks on, so the number is
// shown beside the name to say which line the campaign will dial from. An agent
// with no number assigned cannot dial, so phoneNumberId is what makes an option
// selectable, and phoneLabel is only how it reads.
type AgentOption = { id: string; name: string; phoneNumberId: string | null; phoneLabel: string | null };

const campaignTabs: { id: CampaignTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "calls", label: "Calls" },
  { id: "leads", label: "Leads" },
  { id: "analytics", label: "Analytics" },
];

const statusLabels: Record<OutboundCampaignStatus, string> = {
  draft: "Draft",
  running: "Running",
  paused: "Paused",
  completed: "Completed",
  failed: "Failed",
};

const numberFormatter = new Intl.NumberFormat("en-US");
const moneyFormatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 });
const dateFormatter = new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

function iconPaths(name: IconName): ReactNode {
  switch (name) {
    case "grid": return <><rect height="9" rx="1.5" width="7" x="3" y="3" /><rect height="5" rx="1.5" width="7" x="14" y="3" /><rect height="9" rx="1.5" width="7" x="14" y="12" /><rect height="5" rx="1.5" width="7" x="3" y="16" /></>;
    case "agents": return <><circle cx="12" cy="8" r="4" /><path d="M4 21v-1a6 6 0 0112 0v1M19 8v4M21 10h-4" /></>;
    case "phone": return <path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3-8.6A2 2 0 014.1 2h3a2 2 0 012 1.7c.1.9.3 1.8.7 2.7a2 2 0 01-.5 2.1L8.1 9.9a16 16 0 006 6l1.4-1.2a2 2 0 012.1-.4c.9.3 1.8.6 2.7.7a2 2 0 011.7 2z" />;
    case "phoneOut": return <><path d="M16 8l5-5M21 3h-4M21 3v4" /><path d="M21 16.5v3a2 2 0 01-2.2 2 19.5 19.5 0 01-8.5-3 19.2 19.2 0 01-6-6 19.5 19.5 0 01-3-8.5A2 2 0 013.5 2h3a2 2 0 012 1.7c.1.9.3 1.8.6 2.6a2 2 0 01-.4 2.1L9.5 11.5a16 16 0 006 6l1.1-1.2a2 2 0 012.1-.4c.8.3 1.7.5 2.6.6a2 2 0 011.6 2z" /></>;
    case "demo": return <><circle cx="12" cy="12" r="9" /><path d="M10.2 8.6l5.6 3.4-5.6 3.4z" /></>;
    case "chat": return <><path d="M20.5 12.5a7.5 7.5 0 01-7.5 7.5H8l-4.5 2.5V12.5A7.5 7.5 0 0111 5h2a7.5 7.5 0 017.5 7.5z" /><path d="M8.5 12h7M8.5 15.5h4" /></>;
    case "message": return <path d="M21 15a4 4 0 01-4 4H8l-5 3V7a4 4 0 014-4h10a4 4 0 014 4z" />;
    case "calendar": return <><rect height="18" rx="2" width="18" x="3" y="4" /><path d="M16 2v4M8 2v4M3 10h18" /></>;
    case "chart": return <path d="M4 19V5M8 19v-6M12 19V9M16 19v-8M20 19V7" />;
    case "settings": return <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.6 1.6 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.6 1.6 0 00-1.8-.3 1.6 1.6 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.6 1.6 0 00-1-1.5 1.6 1.6 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.6 1.6 0 00.3-1.8 1.6 1.6 0 00-1.5-1H3a2 2 0 110-4h.1a1.6 1.6 0 001.5-1 1.6 1.6 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.6 1.6 0 001.8.3H9a1.6 1.6 0 001-1.5V3a2 2 0 114 0v.1a1.6 1.6 0 001 1.5 1.6 1.6 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.6 1.6 0 00-.3 1.8V9a1.6 1.6 0 001.5 1H21a2 2 0 110 4h-.1a1.6 1.6 0 00-1.5 1z" /></>;
    case "spark": return <path d="M12 4l1.7 4.6L18 10l-4.3 1.4L12 16l-1.7-4.6L6 10l4.3-1.4L12 4z" />;
    case "key": return <><circle cx="7.5" cy="14.5" r="3.5" /><path d="M10 12l8-8M14 8l2 2M16 6l2 2" /></>;
    case "book": return <><path d="M4 4.5A2.5 2.5 0 016.5 2H20v15H6.5A2.5 2.5 0 004 19.5z" /><path d="M4 19.5A2.5 2.5 0 016.5 17H20v5H6.5A2.5 2.5 0 014 19.5z" /></>;
    case "wrench": return <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.8-3.8a6 6 0 01-7.9 7.9l-6.9 6.9a2.1 2.1 0 01-3-3l6.9-6.9a6 6 0 017.9-7.9l-3.8 3.8z" />;
    case "target": return <><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r="1" /></>;
    case "plus": return <path d="M12 5v14M5 12h14" />;
    case "edit": return <><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 013 3L8 18l-4 1 1-4z" /></>;
    case "trash": return <path d="M3 6h18M8 6V4h8v2M6 6l1 15h10l1-15M10 11v6M14 11v6" />;
    case "refresh": return <><path d="M4 4v6h6M20 20v-6h-6" /><path d="M20 9a8 8 0 00-13.5-3L4 10M4 15a8 8 0 0013.5 3L20 14" /></>;
    case "search": return <><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></>;
    case "list": return <><path d="M9 6h11M9 12h11M9 18h11" /><path d="M4 6h.01M4 12h.01M4 18h.01" /></>;
    case "chevron": return <path d="M9 6l6 6-6 6" />;
    case "x": return <path d="M18 6L6 18M6 6l12 12" />;
  }
}

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  return <svg aria-hidden="true" fill="none" height={size} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24" width={size}>{iconPaths(name)}</svg>;
}
function StatusChip({ status }: { status: OutboundCampaignStatus }) { return <span className={`ob-status ob-status-${status}`}><span className="ob-status-dot" />{statusLabels[status]}</span>; }
function formatNumber(value: number) { return numberFormatter.format(value); }
function formatMoney(value: number | null) { return value == null ? "No budget" : moneyFormatter.format(value); }
function formatPercent(value: number) { return `${(value * 100).toFixed(1)}%`; }
function formatDate(value: string | null) { if (!value) return "—"; const date = new Date(value); return Number.isNaN(date.getTime()) ? "—" : dateFormatter.format(date); }
function formatDuration(seconds: number) { const hours = Math.floor(seconds / 3600); const minutes = Math.floor((seconds % 3600) / 60); const remainder = seconds % 60; if (hours) return `${hours}h ${minutes}m`; if (minutes) return `${minutes}m ${remainder}s`; return `${remainder}s`; }
function allowedStatuses(status: OutboundCampaignStatus): OutboundCampaignStatus[] {
  switch (status) {
    case "draft": return ["draft", "running", "failed"];
    case "running": return ["running", "paused", "completed", "failed"];
    case "paused": return ["paused", "running", "completed", "failed"];
    case "completed": return ["completed"];
    case "failed": return ["failed"];
  }
}

function Sidebar({ campaignCount }: { campaignCount: number }) {
  const { user } = useUser();
  const { resolvedTheme } = useTheme();
  const { mode } = useWorkspaceMode();
  const displayName = user?.fullName || user?.firstName || "Account";
  const email = user?.primaryEmailAddress?.emailAddress || "";
  return <aside className="ob-sidebar">
    <div className="ob-logo"><span className="ob-logo-mark"><Icon name="spark" size={18} /></span><div><div className="ob-logo-name">Voca</div><div className="ob-logo-sub">AI Voice Agents</div></div></div>
    <div className="ob-nav-kicker">Menu</div>
    <nav className="ob-nav">{navItemsForMode(mode).map((item) => {
      const content = <><Icon name={item.icon} size={18} /><span>{item.label}</span>{item.label === "Outbound" && campaignCount > 0 ? <span className="ob-nav-badge">{campaignCount}</span> : item.badge ? <span className="ob-nav-badge">{item.badge}</span> : null}</>;
      return item.href ? <Link className={`ob-nav-item${item.label === "Outbound" ? " is-active" : ""}`} href={item.href} key={item.label}>{content}</Link> : <span className="ob-nav-item" key={item.label}>{content}</span>;
    })}</nav>
    <div className="ob-sidebar-footer"><WorkspaceModeToggle /><ThemeToggle /><div className="ob-user-card"><UserButton appearance={clerkAppearance(resolvedTheme)} /><div className="ob-user-copy"><div className="ob-user-name">{displayName}</div><div className="ob-user-email">{email}</div></div></div></div>
  </aside>;
}

export default function OutboundPage() {
  const { user, isLoaded: isUserLoaded, isSignedIn: isUserSignedIn } = useUser();
  const { getToken, isLoaded: isAuthLoaded, isSignedIn: isAuthSignedIn } = useAuth();
  const [campaigns, setCampaigns] = useState<OutboundCampaign[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<OutboundCampaign | null>(null);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [loadError, setLoadError] = useState("");
  const [detailState, setDetailState] = useState<LoadState>("loading");
  const [detailError, setDetailError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<CampaignTab>("overview");
  const [agentOptions, setAgentOptions] = useState<AgentOption[]>([]);
  // Bumped whenever a call this campaign placed starts or changes state. The
  // campaign's counters move with its calls, so the detail is re-read rather
  // than left showing the totals from before the call.
  const [progressKey, setProgressKey] = useState(0);
  const [query, setQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  const isAuthenticated = Boolean(isUserLoaded && isAuthLoaded && isUserSignedIn && isAuthSignedIn && user);
  const authError = !isUserLoaded || !isAuthLoaded ? null : !isAuthenticated ? "Sign in to view outbound campaigns." : null;
  // Nothing is selected until a campaign is opened: the page browses the list
  // first and shows one campaign in an expandable card only once it is picked.
  const selectedListCampaign = useMemo(() => (selectedId ? campaigns.find((campaign) => campaign.campaign_id === selectedId) ?? null : null), [campaigns, selectedId]);
  const selectedCampaignId = selectedListCampaign?.campaign_id ?? null;
  const selected = detail?.campaign_id === selectedCampaignId ? detail : selectedListCampaign;
  const filteredCampaigns = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return campaigns;
    return campaigns.filter((campaign) => [campaign.campaign_name, campaign.campaign_id, campaign.status, campaign.agent_name ?? "", campaign.phone_number ?? ""].some((value) => value.toLowerCase().includes(normalized)));
  }, [campaigns, query]);

  useEffect(() => {
    if (!isUserLoaded || !isAuthLoaded || !isAuthenticated) return;
    let cancelled = false;
    (async () => {
      setLoadState("loading"); setLoadError("");
      try {
        const rows = await apiListCampaigns(getToken);
        if (cancelled) return;
        setCampaigns(rows);
        setSelectedId((current) => current && rows.some((campaign) => campaign.campaign_id === current) ? current : null);
        setLoadState("ready");
      } catch (error) { if (!cancelled) { setLoadState("error"); setLoadError(error instanceof Error ? error.message : "Failed to load outbound campaigns"); } }
    })();
    return () => { cancelled = true; };
  }, [getToken, isAuthenticated, isUserLoaded, isAuthLoaded, reloadKey]);

  useEffect(() => {
    if (!isAuthenticated || !selectedCampaignId) return;
    let cancelled = false;
    (async () => {
      setDetailState("loading"); setDetailError("");
      try { const campaign = await apiGetCampaign(selectedCampaignId, getToken); if (!cancelled) { setDetail(campaign); setCampaigns((current) => current.map((item) => item.campaign_id === campaign.campaign_id ? campaign : item)); setDetailState("ready"); } }
      catch (error) { if (!cancelled) { setDetailState("error"); setDetailError(error instanceof Error ? error.message : "Failed to load the campaign"); } }
    })();
    return () => { cancelled = true; };
  }, [getToken, isAuthenticated, selectedCampaignId, progressKey]);

  // The agent picker needs both collections: the agents to choose from, and the
  // phone numbers only to render the line each agent answers on. A failure here
  // is left silent — the campaign list is still usable, the picker just comes up
  // empty and says so.
  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;
    (async () => {
      try {
        const [agents, numbers] = await Promise.all([listDashboardAgents(getToken), listPhoneNumbers(getToken)]);
        if (cancelled) return;
        const labelById = new Map(numbers.map((number) => [number.id, number.phone_number || number.label || null]));
        setAgentOptions(agents.map((agent) => {
          const phoneNumberId = agent.agent?.phone_number_id ?? null;
          return { id: agent.id, name: agent.agent?.name || "Untitled agent", phoneNumberId, phoneLabel: phoneNumberId ? labelById.get(phoneNumberId) ?? null : null };
        }));
      } catch { if (!cancelled) setAgentOptions([]); }
    })();
    return () => { cancelled = true; };
  }, [getToken, isAuthenticated, reloadKey]);

  useEffect(() => { if (!notice) return; const timer = setTimeout(() => setNotice(null), 4000); return () => clearTimeout(timer); }, [notice]);

  async function createCampaign(payload: CreateOutboundCampaignPayload) {
    const created = await apiCreateCampaign(payload, getToken);
    setCampaigns((current) => [created, ...current]); setSelectedId(created.campaign_id); setDetail(created); setCreateOpen(false);
    setNotice({ kind: "success", text: "Outbound campaign created" });
  }
  async function updateCampaign(payload: UpdateOutboundCampaignPayload) {
    if (!selected) return;
    const updated = await apiUpdateCampaign(selected.campaign_id, payload, getToken);
    setCampaigns((current) => current.map((campaign) => campaign.campaign_id === updated.campaign_id ? updated : campaign)); setDetail(updated); setEditOpen(false);
    setNotice({ kind: "success", text: "Outbound campaign updated" });
  }
  async function deleteCampaign(campaign: OutboundCampaign) {
    if (deletingId || !window.confirm(`Delete “${campaign.campaign_name}”? This cannot be undone.`)) return;
    setDeletingId(campaign.campaign_id);
    try {
      await apiDeleteCampaign(campaign.campaign_id, getToken);
      const remaining = campaigns.filter((item) => item.campaign_id !== campaign.campaign_id);
      setCampaigns(remaining); setSelectedId(null); setDetail(null); setNotice({ kind: "success", text: "Outbound campaign deleted" });
    } catch (error) { setNotice({ kind: "error", text: error instanceof Error ? error.message : "Failed to delete the campaign" }); }
    finally { setDeletingId(null); }
  }

  const effectiveLoadState: LoadState = !isUserLoaded || !isAuthLoaded ? "loading" : authError ? "error" : loadState;
  const effectiveLoadError = authError ?? loadError;
  const updateSelectedLeadCount = useCallback((count: number) => {
    if (!selectedCampaignId) return;
    setCampaigns((current) => current.map((campaign) => campaign.campaign_id === selectedCampaignId ? { ...campaign, leads_count: count } : campaign));
    setDetail((current) => current?.campaign_id === selectedCampaignId ? { ...current, leads_count: count } : current);
  }, [selectedCampaignId]);
  const noteCampaignProgress = useCallback(() => setProgressKey((key) => key + 1), []);

  return <div className="ob-shell">
    <style dangerouslySetInnerHTML={{ __html: css }} />
    <Sidebar campaignCount={campaigns.length} />
    <main className="ob-main">
      <header className="ob-topbar">
        <div className="ob-topbar-heading">
          <h1 className="ob-topbar-title">Outbound</h1>
          <p className="ob-topbar-copy">Create and manage outbound campaigns — pick an agent, load leads, and watch the calls land.</p>
        </div>
      </header>
      <div className="ob-content">
        {selected ? (
          <ExpandableCardDemoStandard
            className="ob-expandable-card"
            dismissDisabled={isEditOpen || Boolean(deletingId)}
            layoutId={`campaign-${selected.campaign_id}`}
            onClose={() => setSelectedId(null)}
            open
          >
            <div className="ob-detail">
              <div className="ob-expandable-topline">
                <span className="ob-expandable-label">Campaign details</span>
                <button aria-label="Close campaign details" className="ob-expandable-close" onClick={() => setSelectedId(null)} type="button"><Icon name="x" size={16} /></button>
              </div>
              <div className="ob-card ob-detail-head"><div className="ob-detail-title"><span className="ob-detail-icon"><Icon name="target" size={22} /></span><div style={{ minWidth: 0 }}><div className="ob-name-row"><h2>{selected.campaign_name}</h2><StatusChip status={selected.status} /></div><p className="ob-id">{selected.campaign_id}</p></div></div><div className="ob-actions"><button className="ob-secondary-btn" onClick={() => setEditOpen(true)} type="button"><Icon name="edit" size={15} />Edit</button><button className="ob-danger-btn" disabled={selected.status === "running" || deletingId === selected.campaign_id} onClick={() => deleteCampaign(selected)} title={selected.status === "running" ? "Pause the campaign before deleting it" : undefined} type="button"><Icon name="trash" size={15} />{deletingId === selected.campaign_id ? "Deleting…" : "Delete"}</button></div></div>
              <div aria-label="Campaign sections" className="ob-card ob-tabs" role="tablist">{campaignTabs.map((tab) => <button aria-controls={`campaign-${tab.id}-panel`} aria-selected={activeTab === tab.id} className={activeTab === tab.id ? "is-active" : ""} id={`campaign-${tab.id}-tab`} key={tab.id} onClick={() => setActiveTab(tab.id)} role="tab" type="button">{tab.label}{tab.id === "leads" && selected.leads_count > 0 ? <span>{selected.leads_count}</span> : null}{tab.id === "calls" && selected.calls_placed > 0 ? <span>{selected.calls_placed}</span> : null}</button>)}</div>
              {detailState === "error" ? <div className="ob-card ob-inline-error">{detailError}</div> : null}
              {activeTab === "overview" ? <div aria-labelledby="campaign-overview-tab" className="ob-tab-panel" id="campaign-overview-panel" role="tabpanel"><div className="ob-stat-grid"><StatCard label="Leads" value={formatNumber(selected.leads_count)} /><StatCard label="Calls placed" value={formatNumber(selected.calls_placed)} /><StatCard label="Pickup rate" note={`${formatNumber(selected.answered_calls)} answered`} value={formatPercent(selected.pickup_rate)} /><StatCard label="Success rate" note={`${formatNumber(selected.successful_calls)} successful`} value={formatPercent(selected.success_rate)} /></div><div className="ob-card ob-details-card"><h3>Campaign details</h3><div className="ob-detail-grid"><DetailItem label="Status" value={statusLabels[selected.status]} /><DetailItem label="Agent" value={selected.agent_name ?? "No agent"} /><DetailItem label="Calls from" value={selected.phone_number ?? (selected.agent_id ? "Agent has no number" : "—")} /><DetailItem label="Budget" value={formatMoney(selected.budget_usd)} /><DetailItem label="Answered calls" value={formatNumber(selected.answered_calls)} /><DetailItem label="Successful calls" value={formatNumber(selected.successful_calls)} /><DetailItem label="Calls today" value={formatNumber(selected.today_calls)} /><DetailItem label="Today calls date" value={selected.today_calls_date ?? "—"} /><DetailItem label="Total usage" value={formatDuration(selected.total_usage_seconds)} /><DetailItem label="Started" value={formatDate(selected.started_at)} /><DetailItem label="Completed" value={formatDate(selected.completed_at)} /><DetailItem label="Created" value={formatDate(selected.created_at)} /><DetailItem label="Updated" value={formatDate(selected.updated_at)} /></div></div></div> : null}
              {activeTab === "leads" ? <div aria-labelledby="campaign-leads-tab" id="campaign-leads-panel" role="tabpanel"><CampaignLeadsWorkspace campaignId={selected.campaign_id} key={selected.campaign_id} onCallPlaced={noteCampaignProgress} onCountChange={updateSelectedLeadCount} /></div> : null}
              {activeTab === "calls" ? <div aria-labelledby="campaign-calls-tab" id="campaign-calls-panel" role="tabpanel"><CampaignCallsWorkspace campaignId={selected.campaign_id} key={selected.campaign_id} onProgress={noteCampaignProgress} /></div> : null}
              {activeTab === "analytics" ? <div aria-labelledby="campaign-analytics-tab" id="campaign-analytics-panel" role="tabpanel"><CampaignAnalyticsWorkspace campaignId={selected.campaign_id} key={`${selected.campaign_id}-${progressKey}`} /></div> : null}
            </div>
          </ExpandableCardDemoStandard>
        ) : (
          <div className="ob-browse">
            <div className="ob-toolbar">
              <div className="ob-toolbar-search">
                <span className="ob-search-icon"><Icon name="search" size={16} /></span>
                <input aria-label="Search campaigns" className="ob-search" onChange={(event) => setQuery(event.target.value)} placeholder="Search by name, agent, status..." type="search" value={query} />
              </div>
              <div aria-label="View" className="ob-view-toggle" role="group">
                <button aria-label="List view" aria-pressed={viewMode === "list"} className={`ob-view-btn${viewMode === "list" ? " is-active" : ""}`} onClick={() => setViewMode("list")} title="List view" type="button"><Icon name="list" size={16} /></button>
                <button aria-label="Grid view" aria-pressed={viewMode === "grid"} className={`ob-view-btn${viewMode === "grid" ? " is-active" : ""}`} onClick={() => setViewMode("grid")} title="Grid view" type="button"><Icon name="grid" size={16} /></button>
              </div>
              <span className="ob-count">{query.trim() ? `${filteredCampaigns.length} of ${campaigns.length}` : `${campaigns.length} ${campaigns.length === 1 ? "campaign" : "campaigns"}`}</span>
              <button aria-label="Refresh campaigns" className="ob-icon-btn" disabled={!isAuthenticated || loadState === "loading"} onClick={() => setReloadKey((key) => key + 1)} title="Refresh" type="button"><Icon name="refresh" size={16} /></button>
              <button className="ob-primary-btn" disabled={!isAuthenticated} onClick={() => setCreateOpen(true)} type="button"><Icon name="plus" size={15} />New campaign</button>
            </div>

            {effectiveLoadState === "loading" ? (
              <div className="ob-list-message"><p>Loading campaigns…</p></div>
            ) : effectiveLoadState === "error" ? (
              <div className="ob-list-message error">
                <p>{effectiveLoadError}</p>
                {authError ? null : <button className="ob-secondary-btn" onClick={() => setReloadKey((key) => key + 1)} type="button"><Icon name="refresh" size={15} />Try again</button>}
              </div>
            ) : campaigns.length === 0 ? (
              <div className="ob-list-message">
                <Icon name="target" size={30} />
                <h2>No campaigns yet</h2>
                <p>Create a campaign to pick an agent, add leads, and start dialling.</p>
                <button className="ob-primary-btn" onClick={() => setCreateOpen(true)} type="button"><Icon name="plus" size={15} />New campaign</button>
              </div>
            ) : filteredCampaigns.length === 0 ? (
              <div className="ob-list-message"><p>No campaigns match your search.</p></div>
            ) : viewMode === "grid" ? (
              <div className="ob-grid">
                {filteredCampaigns.map((campaign) => (
                  <motion.button className="ob-card-item" key={campaign.campaign_id} layoutId={`campaign-${campaign.campaign_id}`} onClick={() => setSelectedId(campaign.campaign_id)} type="button">
                    <span className="ob-card-top">
                      <span className="ob-target"><Icon name="target" size={18} /></span>
                      <StatusChip status={campaign.status} />
                    </span>
                    <span className="ob-card-identity">
                      <span className="ob-row-name">{campaign.campaign_name}</span>
                      <span className="ob-row-id">{campaign.campaign_id}</span>
                    </span>
                    <span className="ob-card-meta">
                      <span className="ob-card-tile"><span className="ob-row-label">Leads</span><span>{formatNumber(campaign.leads_count)}</span></span>
                      <span className="ob-card-tile"><span className="ob-row-label">Calls</span><span>{formatNumber(campaign.calls_placed)}</span></span>
                    </span>
                    <span className="ob-card-foot">
                      <span>{campaign.agent_name ? `${campaign.agent_name}${campaign.phone_number ? ` · ${campaign.phone_number}` : ""}` : "No agent"}</span>
                      <span>{formatMoney(campaign.budget_usd)}</span>
                    </span>
                  </motion.button>
                ))}
              </div>
            ) : (
              <div className="ob-list">
                {filteredCampaigns.map((campaign) => (
                  <motion.button className="ob-row" key={campaign.campaign_id} layoutId={`campaign-${campaign.campaign_id}`} onClick={() => setSelectedId(campaign.campaign_id)} type="button">
                    <span className="ob-target"><Icon name="target" size={17} /></span>
                    <span className="ob-row-identity">
                      <span className="ob-row-name">{campaign.campaign_name}</span>
                      <span className="ob-row-id">{campaign.campaign_id}</span>
                    </span>
                    <span className="ob-row-field ob-row-leads"><span className="ob-row-label">Leads</span><span>{formatNumber(campaign.leads_count)}</span></span>
                    <span className="ob-row-field ob-row-calls"><span className="ob-row-label">Calls</span><span>{formatNumber(campaign.calls_placed)}</span></span>
                    <span className="ob-row-field"><span className="ob-row-label">Agent</span><span>{campaign.agent_name ? `${campaign.agent_name}${campaign.phone_number ? ` · ${campaign.phone_number}` : ""}` : "No agent"}</span></span>
                    <StatusChip status={campaign.status} />
                    <span className="ob-row-chevron"><Icon name="chevron" size={17} /></span>
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
    {notice ? <div className={`ob-toast ${notice.kind}`} role="status">{notice.text}</div> : null}
    {isCreateOpen ? <CreateCampaignModal agents={agentOptions} onClose={() => setCreateOpen(false)} onSubmit={createCampaign} /> : null}
    {isEditOpen && selected ? <EditCampaignModal agents={agentOptions} campaign={selected} onClose={() => setEditOpen(false)} onSubmit={updateCampaign} /> : null}
  </div>;
}

function StatCard({ label, note, value }: { label: string; note?: string; value: string }) { return <div className="ob-card ob-stat"><span>{label}</span><strong>{value}</strong>{note ? <small>{note}</small> : null}</div>; }
function DetailItem({ label, value }: { label: string; value: string }) { return <div className="ob-detail-item"><span>{label}</span><strong>{value}</strong></div>; }

function CreateCampaignModal({ agents, onClose, onSubmit }: { agents: AgentOption[]; onClose: () => void; onSubmit: (payload: CreateOutboundCampaignPayload) => Promise<void> }) {
  const [name, setName] = useState(""); const [budget, setBudget] = useState(""); const [agentId, setAgentId] = useState(""); const [error, setError] = useState(""); const [submitting, setSubmitting] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const campaignName = name.trim();
    if (!campaignName) return setError("Campaign name is required."); if (campaignName.length > 80) return setError("Campaign name must be at most 80 characters.");
    const parsedBudget = budget.trim() === "" ? null : Number(budget); if (parsedBudget != null && (!Number.isFinite(parsedBudget) || parsedBudget < 0)) return setError("Budget must be zero or greater.");
    setSubmitting(true); setError("");
    try { await onSubmit({ campaign_name: campaignName, ...(parsedBudget == null ? {} : { budget_usd: parsedBudget }), ...(agentId ? { agent_id: agentId } : {}) }); } catch (submitError) { setError(submitError instanceof Error ? submitError.message : "Failed to create the campaign"); setSubmitting(false); }
  }
  return <Modal title="New campaign" onClose={onClose}><form onSubmit={submit}><div className="ob-modal-body"><Field label="Campaign name"><input autoFocus className="ob-input" maxLength={80} onChange={(event) => setName(event.target.value)} value={name} /></Field><AgentField agents={agents} onChange={setAgentId} value={agentId} /><Field hint="Optional" label="Budget (USD)"><input className="ob-input" inputMode="decimal" min="0" onChange={(event) => setBudget(event.target.value)} placeholder="No budget" step="0.01" type="number" value={budget} /></Field>{error ? <div className="ob-form-error">{error}</div> : null}</div><div className="ob-modal-actions"><button className="ob-secondary-btn" disabled={submitting} onClick={onClose} type="button">Cancel</button><button className="ob-primary-btn" disabled={submitting} type="submit">{submitting ? "Creating…" : "Create campaign"}</button></div></form></Modal>;
}

function EditCampaignModal({ agents, campaign, onClose, onSubmit }: { agents: AgentOption[]; campaign: OutboundCampaign; onClose: () => void; onSubmit: (payload: UpdateOutboundCampaignPayload) => Promise<void> }) {
  const [name, setName] = useState(campaign.campaign_name); const [budget, setBudget] = useState(campaign.budget_usd == null ? "" : String(campaign.budget_usd)); const [status, setStatus] = useState<OutboundCampaignStatus>(campaign.status); const [agentId, setAgentId] = useState(campaign.agent_id ?? ""); const [error, setError] = useState(""); const [submitting, setSubmitting] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const campaignName = name.trim();
    if (!campaignName) return setError("Campaign name is required."); if (campaignName.length > 80) return setError("Campaign name must be at most 80 characters.");
    const parsedBudget = budget.trim() === "" ? null : Number(budget); if (parsedBudget != null && (!Number.isFinite(parsedBudget) || parsedBudget < 0)) return setError("Budget must be zero or greater.");
    // The server enforces this too; saying it here saves a round trip and
    // points at the field that has to change.
    if (status === "running" && !agentId) return setError("A running campaign needs an agent to dial with.");
    const payload: UpdateOutboundCampaignPayload = {}; if (campaignName !== campaign.campaign_name) payload.campaign_name = campaignName; if (parsedBudget !== campaign.budget_usd) payload.budget_usd = parsedBudget; if (status !== campaign.status) payload.status = status; if (agentId !== (campaign.agent_id ?? "")) payload.agent_id = agentId || null;
    if (!Object.keys(payload).length) return setError("Nothing to update."); setSubmitting(true); setError("");
    try { await onSubmit(payload); } catch (submitError) { setError(submitError instanceof Error ? submitError.message : "Failed to update the campaign"); setSubmitting(false); }
  }
  return <Modal title="Edit campaign" onClose={onClose}><form onSubmit={submit}><div className="ob-modal-body"><Field label="Campaign name"><input autoFocus className="ob-input" maxLength={80} onChange={(event) => setName(event.target.value)} value={name} /></Field><AgentField agents={agents} onChange={setAgentId} value={agentId} /><Field hint="Blank removes the budget" label="Budget (USD)"><input className="ob-input" inputMode="decimal" min="0" onChange={(event) => setBudget(event.target.value)} placeholder="No budget" step="0.01" type="number" value={budget} /></Field><Field label="Status"><select className="ob-input" onChange={(event) => setStatus(event.target.value as OutboundCampaignStatus)} value={status}>{allowedStatuses(campaign.status).map((value) => <option key={value} value={value}>{statusLabels[value]}</option>)}</select></Field>{error ? <div className="ob-form-error">{error}</div> : null}</div><div className="ob-modal-actions"><button className="ob-secondary-btn" disabled={submitting} onClick={onClose} type="button">Cancel</button><button className="ob-primary-btn" disabled={submitting} type="submit">{submitting ? "Saving…" : "Save changes"}</button></div></form></Modal>;
}
// AgentField is the campaign's one pairing control. There is no phone-number
// control beside it on purpose: an agent is only selectable once it has a
// number, and that number is the one the campaign dials from, so offering the
// number separately would let the two be set to disagree.
function AgentField({ agents, onChange, value }: { agents: AgentOption[]; onChange: (agentId: string) => void; value: string }) {
  const usable = agents.filter((agent) => agent.phoneNumberId);
  // A stored agent that has since lost its number would otherwise vanish from
  // the picker and read as "No agent", so it is kept as a selected option.
  const missing = value && !usable.some((agent) => agent.id === value) ? agents.find((agent) => agent.id === value) ?? null : null;
  const hint = agents.length === 0 ? "No agents yet" : usable.length === 0 ? "No agent has a phone number yet" : "Its phone number is the one the campaign calls from";
  return <Field hint={hint} label="Agent">
    <select className="ob-input" onChange={(event) => onChange(event.target.value)} value={value}>
      <option value="">No agent — draft only</option>
      {missing ? <option value={missing.id}>{missing.name} — no phone number</option> : null}
      {usable.map((agent) => <option key={agent.id} value={agent.id}>{agent.name} — {agent.phoneLabel ?? "number assigned"}</option>)}
    </select>
  </Field>;
}

function Field({ children, hint, label }: { children: ReactNode; hint?: string; label: string }) { return <label className="ob-field"><span>{label}{hint ? <small>{hint}</small> : null}</span>{children}</label>; }
function Modal({ children, onClose, title }: { children: ReactNode; onClose: () => void; title: string }) { return <div className="ob-modal-overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()} role="presentation"><div aria-modal="true" className="ob-modal" role="dialog"><div className="ob-modal-head"><h2>{title}</h2><button aria-label="Close" className="ob-icon-btn" onClick={onClose} type="button"><Icon name="x" size={18} /></button></div>{children}</div></div>; }

const css = `
.ob-shell {
  --bg: var(--app-bg);
  --sidebar: var(--app-sidebar);
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
  height: 100vh;
  max-height: 100vh;
  width: 100vw;
  max-width: 100vw;
  overflow: hidden;
  font-family: var(--font-manrope), system-ui, sans-serif;
  font-size: 14px;
  line-height: 1.5;
}
.ob-shell * { box-sizing: border-box; }
.ob-shell button, .ob-shell input, .ob-shell select, .ob-shell textarea { font: inherit; }
.ob-shell ::-webkit-scrollbar { height: 9px; width: 9px; }
.ob-shell ::-webkit-scrollbar-thumb { background: var(--app-border-strong); border-radius: 9px; }
.ob-shell ::-webkit-scrollbar-track { background: transparent; }
.ob-sidebar {
  background: var(--sidebar);
  border-right: 1px solid var(--border);
  display: flex;
  flex: 0 0 248px;
  flex-direction: column;
  height: 100vh;
  overflow-y: auto;
  padding: 22px 16px;
  position: sticky;
  top: 0;
}
.ob-logo { align-items: center; display: flex; gap: 11px; padding: 4px 8px 26px; }
.ob-logo-mark {
  align-items: center;
  background: linear-gradient(140deg,var(--primary-2),var(--primary));
  border-radius: 10px;
  box-shadow: 0 4px 14px var(--app-primary-glow);
  color: var(--app-on-accent);
  display: flex;
  height: 34px;
  justify-content: center;
  width: 34px;
}
.ob-logo-name { font-size: 16px; font-weight: 800; letter-spacing: -.3px; }
.ob-logo-sub { color: var(--subtle); font-size: 11px; font-weight: 500; margin-top: -1px; }
.ob-nav-kicker { color: var(--faint); font-size: 10.5px; font-weight: 700; letter-spacing: .9px; padding: 4px 10px 8px; text-transform: uppercase; }
.ob-nav { display: flex; flex-direction: column; gap: 3px; }
.ob-nav-item {
  align-items: center;
  border-radius: 10px;
  color: var(--app-nav);
  display: flex;
  font-size: 13.5px;
  font-weight: 600;
  gap: 11px;
  padding: 9px 10px;
  text-decoration: none;
  transition: background .18s ease, color .18s ease;
}
.ob-nav-item:hover { background: var(--app-hover); color: var(--app-text-soft); }
.ob-nav-item.is-active { background: var(--primary-soft); box-shadow: inset 0 0 0 1px var(--app-primary-ring); color: var(--app-primary-text); font-weight: 700; }
.ob-nav-badge { background: var(--primary); border-radius: 20px; color: var(--app-on-accent); font-size: 10.5px; font-weight: 700; margin-left: auto; padding: 1px 7px; }
.ob-sidebar-footer { display: flex; flex-direction: column; gap: 14px; margin-top: auto; padding-top: 18px; }
.ob-user-card { align-items: center; background: var(--surface); border: 1px solid var(--border); border-radius: 14px; display: flex; gap: 10px; padding: 10px 13px; }
.ob-user-copy { min-width: 0; }
.ob-user-name { font-size: 12.5px; font-weight: 700; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ob-user-email { color: var(--subtle); font-size: 11.5px; margin-top: 1px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ob-main { display: flex; flex: 1; flex-direction: column; height: 100vh; min-width: 0; overflow: hidden; }
.ob-topbar {
  align-items: center;
  background: var(--app-topbar);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border);
  display: flex;
  flex: 0 0 auto;
  gap: 16px;
  padding: 20px 32px;
}
.ob-topbar-heading { flex: 1; min-width: 0; }
.ob-topbar-title { font-size: 21px; font-weight: 800; letter-spacing: -.4px; line-height: 1.15; margin: 0; }
.ob-topbar-copy { color: var(--subtle); font-size: 12.5px; margin: 3px 0 0; }
.ob-content { flex: 1 1 auto; min-height: 0; overflow-y: auto; padding: 20px 32px 32px; }
.ob-browse { display: flex; flex-direction: column; gap: 16px; margin: 0 auto; max-width: 1320px; width: 100%; }
.ob-toolbar { align-items: center; display: flex; flex-wrap: wrap; gap: 12px; }
.ob-toolbar-search { flex: 1 1 240px; max-width: 420px; position: relative; }
.ob-search-icon { color: var(--subtle); display: flex; left: 12px; pointer-events: none; position: absolute; top: 50%; transform: translateY(-50%); }
.ob-search {
  background: var(--panel);
  border: 1px solid var(--app-border);
  border-radius: 11px;
  color: var(--text);
  height: 40px;
  outline: none;
  padding: 0 12px 0 38px;
  transition: background .18s ease, border-color .18s ease, box-shadow .18s ease;
  width: 100%;
}
.ob-search::placeholder { color: var(--faint); }
.ob-search:focus { background: var(--app-input-focus); border-color: var(--app-primary-ring-strong); box-shadow: 0 0 0 4px var(--app-primary-ring); }
.ob-view-toggle {
  background: var(--panel);
  border: 1px solid var(--app-border);
  border-radius: 11px;
  display: inline-flex;
  flex-shrink: 0;
  gap: 2px;
  padding: 3px;
}
.ob-view-btn {
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: 8px;
  color: var(--subtle);
  cursor: pointer;
  display: inline-flex;
  height: 30px;
  justify-content: center;
  transition: background .18s ease, box-shadow .18s ease, color .18s ease;
  width: 34px;
}
.ob-view-btn:hover { color: var(--text); }
.ob-view-btn.is-active { background: var(--primary-soft); box-shadow: inset 0 0 0 1px var(--app-primary-ring); color: var(--app-primary-text); }
.ob-count {
  background: var(--app-hover-2);
  border: 1px solid var(--border-strong);
  border-radius: 999px;
  color: var(--subtle);
  font-size: 11px;
  font-weight: 800;
  line-height: 1;
  margin-left: auto;
  padding: 6px 10px;
  white-space: nowrap;
}
.ob-primary-btn, .ob-secondary-btn, .ob-danger-btn {
  align-items: center;
  border-radius: 11px;
  cursor: pointer;
  display: inline-flex;
  font-size: 13px;
  font-weight: 800;
  gap: 8px;
  justify-content: center;
  min-height: 40px;
  padding: 0 14px;
  transition: background .18s ease, border-color .18s ease, filter .18s ease, transform .18s ease;
  white-space: nowrap;
}
.ob-primary-btn:hover, .ob-secondary-btn:hover, .ob-danger-btn:hover { transform: translateY(-1px); }
.ob-primary-btn { background: linear-gradient(140deg,var(--primary-2),var(--primary)); border: 1px solid transparent; box-shadow: 0 4px 14px var(--app-primary-glow); color: var(--app-on-accent); }
.ob-secondary-btn { background: var(--panel-hover); border: 1px solid var(--app-border-strong); color: var(--text); }
.ob-danger-btn { background: var(--app-rose-soft-2); border: 1px solid var(--app-rose-border-strong); color: var(--app-rose-text); }
.ob-danger-btn:hover { background: var(--app-rose-border); }
.ob-primary-btn:disabled, .ob-secondary-btn:disabled, .ob-danger-btn:disabled, .ob-icon-btn:disabled {
  cursor: not-allowed;
  filter: grayscale(.35);
  opacity: .45;
  transform: none;
}
.ob-icon-btn {
  align-items: center;
  background: var(--panel);
  border: 1px solid var(--app-border);
  border-radius: 11px;
  color: var(--subtle);
  cursor: pointer;
  display: inline-flex;
  flex-shrink: 0;
  height: 40px;
  justify-content: center;
  transition: background .18s ease, border-color .18s ease, color .18s ease;
  width: 40px;
}
.ob-icon-btn:hover { background: var(--app-hover-2); border-color: var(--app-border-strong); color: var(--app-text-strong); }
.ob-list { display: flex; flex-direction: column; gap: 10px; }
.ob-grid { display: grid; gap: 14px; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); }
.ob-list-message {
  align-items: center;
  border: 1px dashed var(--border-strong);
  border-radius: 16px;
  color: var(--muted);
  display: flex;
  flex-direction: column;
  font-size: 13.5px;
  font-weight: 650;
  gap: 14px;
  justify-content: center;
  min-height: 260px;
  padding: 40px;
  text-align: center;
}
.ob-list-message p { margin: 0; max-width: 440px; }
.ob-list-message h2 { color: var(--text); font-size: 17px; margin: 0; }
.ob-list-message.error { color: var(--app-rose-text); }
.ob-row {
  align-items: center;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  color: inherit;
  cursor: pointer;
  display: grid;
  gap: 16px;
  grid-template-columns: 38px minmax(170px, 1.2fr) minmax(90px, .5fr) minmax(90px, .5fr) minmax(160px, 1fr) auto 18px;
  padding: 13px 16px;
  text-align: left;
  transition: background .18s ease, border-color .18s ease, box-shadow .18s ease, transform .18s ease;
  width: 100%;
}
.ob-row:hover { background: var(--panel-hover); border-color: var(--app-primary-ring); box-shadow: 0 6px 18px var(--app-shadow-soft); transform: translateY(-1px); }
.ob-row:focus-visible { border-color: var(--app-primary-ring-strong); box-shadow: 0 0 0 4px var(--app-primary-ring); outline: none; }
.ob-target {
  align-items: center;
  background: var(--primary-soft);
  border: 1px solid var(--app-primary-ring);
  border-radius: 11px;
  color: var(--primary-light);
  display: inline-flex;
  flex: 0 0 auto;
  height: 38px;
  justify-content: center;
  width: 38px;
}
.ob-row-identity, .ob-row-field { display: block; min-width: 0; }
.ob-row-field > span { display: block; font-size: 12.5px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ob-row-label { color: var(--faint); display: block; font-size: 9.5px; font-weight: 850; letter-spacing: .7px; margin-bottom: 3px; text-transform: uppercase; }
.ob-row-name { display: block; font-size: 14px; font-weight: 850; letter-spacing: -.2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ob-row-id { color: var(--faint); display: block; font-family: var(--font-geist-mono), ui-monospace, monospace; font-size: 11px; margin-top: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ob-row-chevron { color: var(--faint); display: inline-flex; transition: color .18s ease, transform .18s ease; }
.ob-row:hover .ob-row-chevron { color: var(--primary-light); transform: translateX(2px); }
.ob-card-item {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: 0 1px 2px var(--app-shadow-soft);
  color: inherit;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 190px;
  padding: 16px;
  text-align: left;
  transition: background .18s ease, border-color .18s ease, box-shadow .18s ease, transform .18s ease;
  width: 100%;
}
.ob-card-item:hover {
  background: var(--panel-hover);
  border-color: var(--app-primary-border);
  box-shadow: 0 12px 30px var(--app-shadow-soft);
  transform: translateY(-2px);
}
.ob-card-item:focus-visible { border-color: var(--app-primary-ring-strong); box-shadow: 0 0 0 4px var(--app-primary-ring); outline: none; }
.ob-card-top { align-items: center; display: flex; gap: 10px; justify-content: space-between; }
.ob-card-identity { min-width: 0; }
.ob-card-meta { display: grid; gap: 10px; grid-template-columns: 1fr 1fr; margin-top: auto; }
.ob-card-tile { background: var(--panel); border: 1px solid var(--app-border); border-radius: 11px; min-width: 0; padding: 9px 10px; }
.ob-card-tile > span { display: block; font-size: 12.5px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ob-card-foot { align-items: center; color: var(--subtle); display: flex; font-size: 11.5px; gap: 8px; justify-content: space-between; }
.ob-card-foot span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ob-status {
  align-items: center;
  border-radius: 999px;
  display: inline-flex;
  flex-shrink: 0;
  font-size: 11px;
  font-weight: 800;
  gap: 5px;
  line-height: 1;
  padding: 5px 9px;
  text-transform: capitalize;
}
.ob-status-dot { background: currentColor; border-radius: 50%; height: 5px; width: 5px; }
.ob-status-draft { background: var(--app-slate-soft); color: var(--app-slate); }
.ob-status-running { background: var(--app-green-soft); color: var(--app-green); }
.ob-status-paused { background: var(--app-amber-soft); color: var(--app-amber); }
.ob-status-completed { background: var(--app-primary-soft); color: var(--app-primary-text); }
.ob-status-failed { background: var(--app-rose-soft); color: var(--app-rose); }
.expandable-card-backdrop { background: var(--app-overlay); backdrop-filter: blur(6px); inset: 0; position: fixed; z-index: 80; }
.expandable-card-stage { align-items: center; display: flex; inset: 0; justify-content: center; padding: 24px; pointer-events: none; position: fixed; z-index: 90; }
.expandable-card-panel { pointer-events: auto; }
.ob-expandable-card {
  background: var(--bg);
  border: 1px solid var(--border-strong);
  border-radius: 20px;
  box-shadow: 0 30px 90px var(--app-shadow-color), 0 0 0 1px var(--app-primary-ring);
  max-height: min(860px, calc(100vh - 48px));
  max-width: 1120px;
  overflow: auto;
  padding: 16px;
  width: 100%;
}
.ob-expandable-topline { align-items: center; display: flex; gap: 10px; justify-content: space-between; }
.ob-expandable-label { color: var(--subtle); font-size: 11px; font-weight: 850; letter-spacing: .7px; text-transform: uppercase; }
.ob-expandable-close {
  align-items: center;
  background: var(--panel);
  border: 1px solid var(--app-border);
  border-radius: 10px;
  color: var(--subtle);
  cursor: pointer;
  display: inline-flex;
  height: 32px;
  justify-content: center;
  transition: background .18s ease, color .18s ease;
  width: 32px;
}
.ob-expandable-close:hover { background: var(--panel-hover); color: var(--text); }
.ob-detail { display: grid; gap: 16px; min-width: 0; }
.ob-card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; box-shadow: 0 1px 2px var(--app-shadow-soft); }
.ob-detail-head { align-items: center; display: flex; flex-wrap: wrap; gap: 18px; justify-content: space-between; padding: 18px; }
.ob-detail-title { align-items: center; display: flex; gap: 13px; min-width: 0; }
.ob-detail-icon {
  align-items: center;
  background: var(--primary-soft);
  border: 1px solid var(--app-primary-ring);
  border-radius: 12px;
  color: var(--primary-light);
  display: flex;
  flex-shrink: 0;
  height: 46px;
  justify-content: center;
  width: 46px;
}
.ob-name-row { align-items: center; display: flex; flex-wrap: wrap; gap: 10px; }
.ob-name-row h2 { font-size: 20px; font-weight: 850; letter-spacing: -.35px; margin: 0; }
.ob-id { color: var(--faint); font-family: var(--font-geist-mono), ui-monospace, monospace; font-size: 11px; margin: 5px 0 0; overflow: hidden; text-overflow: ellipsis; }
.ob-actions { display: flex; flex-wrap: wrap; gap: 8px; }
.ob-tabs { align-items: stretch; display: flex; gap: 24px; overflow-x: auto; padding: 0 18px; }
.ob-tabs button {
  align-items: center;
  background: transparent;
  border: 0;
  border-bottom: 2px solid transparent;
  color: var(--subtle);
  cursor: pointer;
  display: flex;
  font-size: 12.5px;
  font-weight: 750;
  gap: 7px;
  min-height: 48px;
  padding: 0 2px;
  white-space: nowrap;
}
.ob-tabs button:hover { color: var(--app-text-soft); }
.ob-tabs button.is-active { border-bottom-color: var(--primary-2); color: var(--app-text-strong); }
.ob-tabs button span { background: var(--primary-soft); border-radius: 999px; color: var(--app-primary-text); font-size: 9.5px; min-width: 19px; padding: 2px 6px; }
.ob-tab-panel { display: grid; gap: 16px; }
.ob-stat-grid { display: grid; gap: 12px; grid-template-columns: repeat(4, minmax(0, 1fr)); }
.ob-stat { display: grid; gap: 5px; min-height: 98px; padding: 15px; }
.ob-stat > span { color: var(--faint); font-size: 10.5px; font-weight: 850; letter-spacing: .7px; text-transform: uppercase; }
.ob-stat > strong { font-size: 25px; font-weight: 850; letter-spacing: -.5px; }
.ob-stat > small { color: var(--subtle); font-size: 11px; }
.ob-details-card { padding: 18px; }
.ob-details-card h3 { font-size: 14px; font-weight: 850; margin: 0 0 16px; }
.ob-detail-grid { display: grid; gap: 12px; grid-template-columns: repeat(3, minmax(0, 1fr)); }
.ob-detail-item { background: var(--panel); border: 1px solid var(--app-border); border-radius: 12px; display: grid; gap: 5px; min-width: 0; padding: 12px 14px; }
.ob-detail-item span { color: var(--faint); font-size: 10.5px; font-weight: 800; letter-spacing: .8px; text-transform: uppercase; }
.ob-detail-item strong { font-size: 13px; font-weight: 800; overflow-wrap: anywhere; }
.ob-inline-error { color: var(--app-rose-text); font-size: 13px; padding: 13px 16px; }
.ob-modal-overlay {
  align-items: center;
  background: var(--app-overlay);
  backdrop-filter: blur(3px);
  display: flex;
  inset: 0;
  justify-content: center;
  padding: 20px;
  position: fixed;
  z-index: 120;
}
.ob-modal {
  background: var(--app-elevated);
  border: 1px solid var(--border-strong);
  border-radius: 18px;
  box-shadow: 0 28px 80px var(--app-shadow-color-strong);
  max-width: 470px;
  overflow: hidden;
  width: 100%;
}
.ob-modal-head { align-items: center; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; padding: 16px 18px; }
.ob-modal-head h2 { font-size: 17px; font-weight: 850; letter-spacing: -.2px; margin: 0; }
.ob-modal-body { display: grid; gap: 16px; padding: 18px; }
.ob-field { display: grid; gap: 7px; }
.ob-field > span { font-size: 12px; font-weight: 800; }
.ob-field small { color: var(--subtle); font-size: 10.5px; font-weight: 500; margin-left: 7px; }
.ob-input {
  background: var(--panel);
  border: 1px solid var(--app-border);
  border-radius: 11px;
  color: var(--text);
  min-height: 42px;
  outline: none;
  padding: 9px 11px;
  transition: background .18s ease, border-color .18s ease, box-shadow .18s ease;
  width: 100%;
}
.ob-input::placeholder { color: var(--faint); }
.ob-input:focus { background: var(--app-input-focus); border-color: var(--app-primary-ring-strong); box-shadow: 0 0 0 4px var(--app-primary-ring); }
.ob-input option { background: var(--app-elevated); }
.ob-form-error { background: var(--app-rose-soft); border: 1px solid var(--app-rose-border); border-radius: 10px; color: var(--app-rose-text); font-size: 12px; padding: 9px 11px; }
.ob-modal-actions { border-top: 1px solid var(--border); display: flex; gap: 9px; justify-content: flex-end; padding: 14px 18px; }
.ob-toast {
  border-radius: 12px;
  bottom: 24px;
  box-shadow: 0 18px 50px var(--app-shadow-color);
  font-size: 13px;
  font-weight: 750;
  left: 50%;
  max-width: min(480px, calc(100vw - 48px));
  padding: 12px 18px;
  position: fixed;
  transform: translateX(-50%);
  z-index: 140;
}
.ob-toast.success { background: var(--app-toast-success-bg); border: 1px solid var(--app-green-border); color: var(--app-toast-success-text); }
.ob-toast.error { background: var(--app-toast-error-bg); border: 1px solid var(--app-rose-border-strong); color: var(--app-rose-text); }
@media (max-width: 1180px) {
  .ob-stat-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .ob-detail-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .ob-row { grid-template-columns: 38px minmax(160px, 1.2fr) minmax(90px, .5fr) minmax(150px, 1fr) auto 18px; }
  .ob-row-calls { display: none; }
}
@media (max-width: 980px) {
  .ob-shell { display: block; height: auto; max-height: none; overflow: visible; }
  .ob-main { height: auto; overflow: visible; }
  .ob-content { overflow: visible; padding: 20px; }
  .ob-sidebar { height: auto; overflow: visible; position: static; width: 100%; }
  .ob-sidebar-footer { margin-top: 18px; }
  .ob-user-card { display: none; }
  .ob-nav { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .ob-topbar { padding: 18px 20px; }
  .ob-detail-head { align-items: flex-start; flex-direction: column; }
  .ob-row { grid-template-columns: 38px minmax(150px, 1fr) minmax(150px, .9fr) auto 18px; }
  .ob-row-leads { display: none; }
}
@media (max-width: 640px) {
  .ob-nav { grid-template-columns: 1fr 1fr; }
  .ob-topbar, .ob-content { padding: 16px 14px; }
  .ob-stat-grid, .ob-detail-grid { grid-template-columns: 1fr; }
  .ob-toolbar-search { max-width: none; min-width: 100%; }
  .ob-count { margin-left: 0; }
  .ob-row { gap: 10px; grid-template-columns: 38px minmax(0, 1fr) auto; padding: 11px; }
  .ob-row-field, .ob-row-chevron { display: none; }
  .ob-actions { width: 100%; }
  .ob-actions button { flex: 1; }
  .expandable-card-stage { align-items: stretch; padding: 0; }
  .ob-expandable-card { border-radius: 0; max-height: 100vh; max-width: none; padding: 12px; }
}
`;

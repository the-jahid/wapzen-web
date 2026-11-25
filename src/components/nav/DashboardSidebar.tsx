"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import {
  BarChart3,
  BookOpen,
  Bot,
  CalendarDays,
  ChevronRight,
  Clock,
  KeyRound,
  LayoutGrid,
  Menu,
  MessageSquare,
  MessagesSquare,
  Phone,
  PlayCircle,
  ShoppingBag,
  Settings,
  Target,
  Users,
  Wrench,
  X,
  type LucideProps,
} from "lucide-react";
import { BrandMark } from "@/components/brand/BrandMark";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useTheme } from "@/components/theme/ThemeProvider";
import { clerkAppearance } from "@/components/theme/clerkAppearance";
import {
  navGroups,
  navItemsForMode,
  useWorkspaceMode,
  WorkspaceSwitchButton,
  type NavIconName,
  type WorkspaceMode,
} from "@/components/nav/workspaceMode";
import { SUPPORT_WHATSAPP_URL, WhatsAppGlyph } from "@/components/nav/supportWhatsApp";
import { useNewOrders } from "@/components/nav/useNewOrders";
import { UsageButton } from "@/components/nav/UsageButton";
import { LanguageSwitch } from "@/components/translate/AutoTranslate";
import styles from "./DashboardSidebar.module.css";

export const navIcons: Record<NavIconName, ComponentType<LucideProps>> = {
  grid: LayoutGrid,
  agents: Bot,
  phone: Phone,
  book: BookOpen,
  wrench: Wrench,
  key: KeyRound,
  target: Target,
  demo: PlayCircle,
  chat: MessageSquare,
  message: MessagesSquare,
  groups: Users,
  calendar: CalendarDays,
  chart: BarChart3,
  orders: ShoppingBag,
  "follow-ups": Clock,
  settings: Settings,
};

type DashboardSidebarProps = {
  /** Label of the nav item for the current page. */
  activeLabel: string;
  /** Counts shown beside nav items, keyed by label; zero or missing hides it. */
  badges?: Partial<Record<string, number>>;
  /**
   * The width at which the page's own shell stops laying the sidebar beside
   * the content and stacks instead. Below it the sidebar becomes a top bar with
   * a slide-in drawer, so it has to switch at the same point as the page.
   */
  stackBelow: 900 | 980;
};

/**
 * The dashboard's navigation: on desktop an always-open sidebar beside the
 * page, laid out like Retell's (workspace card, grouped menu, account at the
 * foot); on small screens a top bar whose menu button slides the same sidebar
 * in from the left.
 */
export function DashboardSidebar({ activeLabel, badges, stackBelow }: DashboardSidebarProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const newOrders = useNewOrders();

  useEffect(() => {
    if (!drawerOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDrawerOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [drawerOpen]);

  return (
    <div className={styles.root} data-stack={stackBelow}>
      <aside aria-label="Dashboard" className={styles.rail}>
        <div className={styles.panel}>
          <SidebarBody activeLabel={activeLabel} badges={badges} newOrders={newOrders} />
        </div>
      </aside>

      <header className={styles.topbar}>
        <span className={styles.topbarStart}>
          <Link aria-label="Wapzen home" className={styles.topbarLogo} href="/">
            <span className={styles.logoMark}><BrandMark /></span>
            <span className={`${styles.topbarName} notranslate`}>Wapzen</span>
          </Link>
          <WorkspaceSwitchButton className={`${styles.iconButton} ${styles.modeSwitchButton}`} />
        </span>
        <span className={styles.topbarActions}>
          <a
            aria-label="Need help? Chat with support on WhatsApp"
            className={`${styles.iconButton} ${styles.supportIconButton}`}
            href={SUPPORT_WHATSAPP_URL}
            rel="noopener noreferrer"
            target="_blank"
          >
            <WhatsAppGlyph size={18} />
          </a>
          <button
            aria-controls="dashboard-drawer"
            aria-expanded={drawerOpen}
            aria-label={
              drawerOpen
                ? "Close menu"
                : newOrders > 0
                  ? `Open menu, ${newOrders} new order${newOrders === 1 ? "" : "s"}`
                  : "Open menu"
            }
            className={`${styles.iconButton} ${styles.menuButton}`}
            onClick={() => setDrawerOpen((open) => !open)}
            type="button"
          >
            {drawerOpen ? <X size={18} /> : <Menu size={18} />}
            {newOrders > 0 && !drawerOpen ? <span className={styles.menuDot} /> : null}
          </button>
        </span>
      </header>
      <div
        aria-hidden="true"
        className={styles.backdrop}
        data-open={drawerOpen || undefined}
        onClick={() => setDrawerOpen(false)}
      />
      <aside
        aria-label="Dashboard"
        className={styles.drawer}
        data-open={drawerOpen || undefined}
        id="dashboard-drawer"
        inert={!drawerOpen}
      >
        <button
          aria-label="Close menu"
          className={`${styles.iconButton} ${styles.drawerClose}`}
          onClick={() => setDrawerOpen(false)}
          type="button"
        >
          <X size={18} />
        </button>
        <div className={styles.panel}>
          <SidebarBody
            activeLabel={activeLabel}
            badges={badges}
            newOrders={newOrders}
            onNavigate={() => setDrawerOpen(false)}
          />
        </div>
      </aside>
      <BottomTabs activeLabel={activeLabel} newOrders={newOrders} />
    </div>
  );
}

// Phone-width names for the bottom bar, where each tab is only ~50-60px wide.
const shortTabLabels: Partial<Record<string, string>> = {
  "Chat Agents": "Agents",
  "WhatsApp Voice Agents": "Agents",
  Conversations: "Chats",
  "Phone Numbers": "Phone",
  "Call History": "Calls",
  "Knowledge Base": "KB",
  "Follow-ups": "Follow",
};

/**
 * The menu's pages as one row of tabs pinned to the bottom of the screen, like
 * an app's tab bar. It only shows while the sidebar is folded into the drawer
 * (the same breakpoint as the top bar), so desktop is unchanged.
 */
function BottomTabs({ activeLabel, newOrders }: { activeLabel: string; newOrders: number }) {
  const { mode } = useWorkspaceMode();
  const scrollerRef = useRef<HTMLDivElement>(null);
  // Whether the tabs overflow, and whether the row is scrolled to its end: the
  // arrow only shows on overflow and points back to the start at the end.
  const [overflow, setOverflow] = useState(false);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const measure = () => {
      const more = scroller.scrollWidth - scroller.clientWidth;
      setOverflow(more > 2);
      setAtEnd(scroller.scrollLeft >= more - 2);
    };
    measure();
    scroller.addEventListener("scroll", measure, { passive: true });
    const observer = new ResizeObserver(measure);
    observer.observe(scroller);
    return () => {
      scroller.removeEventListener("scroll", measure);
      observer.disconnect();
    };
  }, [mode]);

  // Keep the current page's tab in view when the page loads.
  useEffect(() => {
    scrollerRef.current
      ?.querySelector<HTMLElement>("[data-active]")
      ?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [activeLabel, mode]);

  const scrollTabs = () => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    if (atEnd) scroller.scrollTo({ left: 0, behavior: "smooth" });
    else scroller.scrollBy({ left: scroller.clientWidth * 0.7, behavior: "smooth" });
  };

  return (
    <nav aria-label="Pages" className={styles.tabbar}>
      <div className={styles.tabScroller} ref={scrollerRef}>
      {navItemsForMode(mode).map((item) => {
        const Icon = navIcons[item.icon];
        const active = item.label === activeLabel;
        const short = shortTabLabels[item.label];
        const ordersWaiting = item.label === "Orders" && newOrders > 0;
        return (
          <Link
            aria-current={active ? "page" : undefined}
            aria-label={ordersWaiting ? `${item.label}, ${newOrders} new` : item.label}
            className={styles.tab}
            data-active={active || undefined}
            href={item.href ?? "#"}
            key={item.label}
          >
            <span className={styles.tabIcon}>
              <Icon aria-hidden="true" size={19} strokeWidth={1.9} />
              {ordersWaiting ? <span className={styles.tabDot} /> : null}
            </span>
            <span aria-hidden="true" className={styles.tabLabel}>
              <span className={short ? styles.tabLabelFull : undefined}>{item.label}</span>
              {short ? <span className={styles.tabLabelShort}>{short}</span> : null}
            </span>
          </Link>
        );
      })}
        <UsageButton variant="tab" />
      </div>
      {overflow ? (
        <button
          aria-label={atEnd ? "Scroll tabs back to the start" : "Scroll tabs to see more"}
          className={styles.tabScrollButton}
          data-end={atEnd || undefined}
          onClick={scrollTabs}
          type="button"
        >
          <ChevronRight aria-hidden="true" size={18} />
        </button>
      ) : null}
    </nav>
  );
}

function SidebarBody({
  activeLabel,
  badges,
  newOrders,
  onNavigate,
}: {
  activeLabel: string;
  badges?: Partial<Record<string, number>>;
  newOrders: number;
  onNavigate?: () => void;
}) {
  const { user } = useUser();
  const { resolvedTheme } = useTheme();
  const { mode } = useWorkspaceMode();
  const items = navItemsForMode(mode);

  return (
    <>
      <Link aria-label="Wapzen home" className={styles.logo} href="/" onClick={onNavigate}>
        <span className={styles.logoMark}><BrandMark /></span>
        <span className={`${styles.logoName} notranslate`}>Wapzen</span>
      </Link>

      <WorkspaceCard onNavigate={onNavigate} />

      <nav aria-label="Dashboard navigation" className={styles.nav}>
        {navGroups.map((group) => {
          const groupItems = items.filter((item) => item.group === group);
          if (groupItems.length === 0) return null;
          return (
            <div className={styles.navGroup} key={group}>
              <div className={styles.kicker}>{group}</div>
              {groupItems.map((item) => {
                const Icon = navIcons[item.icon];
                const count = badges?.[item.label];
                const active = item.label === activeLabel;
                const ordersWaiting = item.label === "Orders" && newOrders > 0;
                return (
                  <Link
                    aria-current={active ? "page" : undefined}
                    className={styles.navItem}
                    data-active={active || undefined}
                    href={item.href ?? "#"}
                    key={item.label}
                    onClick={onNavigate}
                  >
                    <span className={styles.navIcon}>
                      <Icon size={16} strokeWidth={1.8} />
                    </span>
                    <span className={styles.navLabel}>{item.label}</span>
                    {ordersWaiting ? (
                      <span className={styles.badge}>{newOrders} new</span>
                    ) : count ? (
                      <span className={styles.badge}>{count}</span>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>

      <div className={styles.footer}>
        <UsageButton onOpen={onNavigate} />
        <a
          className={styles.supportCard}
          href={SUPPORT_WHATSAPP_URL}
          rel="noopener noreferrer"
          target="_blank"
        >
          <span className={styles.supportIcon}><WhatsAppGlyph size={13} /></span>
          <span className={styles.supportTitle}>Trouble connecting?</span>
        </a>
        <div className={styles.userCard}>
          <UserButton appearance={clerkAppearance(resolvedTheme)} />
          <span className={`${styles.userEmail} notranslate`}>
            {user?.primaryEmailAddress?.emailAddress || user?.fullName || user?.username || "Account"}
          </span>
        </div>
        <div className={styles.footerRow}>
          <LanguageSwitch />
          <ThemeToggle className={styles.themeToggle} />
        </div>
      </div>
    </>
  );
}

const workspaceNames: Record<WorkspaceMode, string> = {
  chat: "Chat",
  voice: "Voice",
};

/**
 * Two-way toggle between the chat and voice workspaces. Picking one swaps the
 * menu (and the page, when the current page only exists in the other one).
 */
function WorkspaceCard({ onNavigate }: { onNavigate?: () => void }) {
  const { mode, setMode } = useWorkspaceMode();

  return (
    <div aria-label="Workspace" className={styles.workspace} role="radiogroup">
      {(["chat", "voice"] as const).map((option) => (
        <button
          aria-checked={option === mode}
          className={`${styles.workspaceOption}${option === mode ? ` ${styles.workspaceOptionActive}` : ""}`}
          key={option}
          onClick={() => {
            if (option === mode) return;
            setMode(option);
            onNavigate?.();
          }}
          role="radio"
          type="button"
        >
          {option === "chat" ? <MessageSquare size={15} /> : <Phone size={15} />}
          <span>{workspaceNames[option]}</span>
        </button>
      ))}
    </div>
  );
}

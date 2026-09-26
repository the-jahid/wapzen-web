"use client";

import { useEffect, useState, type ComponentType, type FocusEvent } from "react";
import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import {
  BarChart3,
  BookOpen,
  Bot,
  CalendarDays,
  KeyRound,
  LayoutGrid,
  Menu,
  MessageSquare,
  MessagesSquare,
  Mic,
  Phone,
  PlayCircle,
  Settings,
  Target,
  Wrench,
  X,
  type LucideProps,
} from "lucide-react";
import { BrandMark } from "@/components/brand/BrandMark";
import { ThemeToggle, ThemeToggleButton } from "@/components/theme/ThemeToggle";
import { useTheme } from "@/components/theme/ThemeProvider";
import { clerkAppearance } from "@/components/theme/clerkAppearance";
import {
  navItemsForMode,
  useWorkspaceMode,
  WorkspaceModeToggle,
  type NavIconName,
} from "@/components/nav/workspaceMode";
import styles from "./DashboardSidebar.module.css";

const navIcons: Record<NavIconName, ComponentType<LucideProps>> = {
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
  calendar: CalendarDays,
  chart: BarChart3,
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
 * The dashboard's navigation, after Aceternity's sidebar: on desktop a slim
 * icon rail that widens on hover or keyboard focus to show labels, sliding
 * over the page rather than pushing it; on small screens a top bar whose menu
 * button slides the full sidebar in from the left.
 */
export function DashboardSidebar({ activeLabel, badges, stackBelow }: DashboardSidebarProps) {
  const [hovered, setHovered] = useState(false);
  const [linkFocused, setLinkFocused] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const railOpen = hovered || linkFocused;

  useEffect(() => {
    if (!drawerOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDrawerOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [drawerOpen]);

  // Tabbing onto the logo or a nav link opens the rail so its label shows. Only
  // keyboard focus counts, so a mouse click on the current page's link does
  // not leave the rail stuck open. The footer controls deliberately don't open
  // it: the collapsed rail has icon-sized versions of them, and opening would
  // hide the very button that just took focus.
  function handleFocus(event: FocusEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement;
    setLinkFocused(target.matches(":focus-visible") && target.closest("[data-rail-link]") !== null);
  }

  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setLinkFocused(false);
  }

  return (
    <div className={styles.root} data-stack={stackBelow}>
      <aside aria-label="Dashboard" className={styles.rail}>
        <div
          className={styles.panel}
          data-open={railOpen || undefined}
          onBlur={handleBlur}
          onFocus={handleFocus}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <SidebarBody activeLabel={activeLabel} badges={badges} compact />
        </div>
      </aside>

      <header className={styles.topbar}>
        <Link aria-label="Wapzen home" className={styles.topbarLogo} href="/">
          <span className={styles.logoMark}><BrandMark /></span>
          <span className={styles.topbarName}>Wapzen</span>
        </Link>
        <button
          aria-controls="dashboard-drawer"
          aria-expanded={drawerOpen}
          aria-label={drawerOpen ? "Close menu" : "Open menu"}
          className={styles.iconButton}
          onClick={() => setDrawerOpen((open) => !open)}
          type="button"
        >
          {drawerOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
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
        <div className={styles.panel} data-open>
          <SidebarBody activeLabel={activeLabel} badges={badges} onNavigate={() => setDrawerOpen(false)} />
        </div>
      </aside>
    </div>
  );
}

function SidebarBody({
  activeLabel,
  badges,
  compact = false,
  onNavigate,
}: {
  activeLabel: string;
  badges?: Partial<Record<string, number>>;
  /** Renders the icon-only footer controls for the collapsed rail as well. */
  compact?: boolean;
  onNavigate?: () => void;
}) {
  const { user } = useUser();
  const { resolvedTheme } = useTheme();
  const { mode, setMode } = useWorkspaceMode();
  const otherMode = mode === "chat" ? "voice" : "chat";

  return (
    <>
      <Link aria-label="Wapzen home" className={styles.logo} data-rail-link href="/" onClick={onNavigate}>
        <span className={styles.logoMark}><BrandMark /></span>
        <span className={styles.reveal}>
          <span className={styles.logoName}>Wapzen</span>
          <span className={styles.logoTagline}>AI Voice Agents</span>
        </span>
      </Link>

      <div className={`${styles.kicker} ${styles.reveal}`}>Menu</div>
      <nav aria-label="Dashboard navigation" className={styles.nav}>
        {navItemsForMode(mode).map((item) => {
          const Icon = navIcons[item.icon];
          const count = badges?.[item.label];
          const active = item.label === activeLabel;
          return (
            <Link
              aria-current={active ? "page" : undefined}
              className={styles.navItem}
              data-active={active || undefined}
              data-rail-link
              href={item.href ?? "#"}
              key={item.label}
              onClick={onNavigate}
            >
              <span className={styles.navIcon}>
                <Icon size={18} strokeWidth={1.9} />
                {count ? <span aria-hidden="true" className={styles.navDot} /> : null}
              </span>
              <span className={`${styles.navLabel} ${styles.reveal}`}>{item.label}</span>
              {count ? <span className={`${styles.badge} ${styles.reveal}`}>{count}</span> : null}
            </Link>
          );
        })}
      </nav>

      <div className={styles.footer}>
        {/* Each row swaps a full control (open) for an icon-sized one (collapsed). */}
        <div className={styles.swapRow}>
          <div className={styles.full}><WorkspaceModeToggle /></div>
          {compact ? (
            <button
              aria-label={`Switch to ${otherMode} workspace`}
              className={`${styles.iconButton} ${styles.mini}`}
              onClick={() => setMode(otherMode)}
              title={`Switch to ${otherMode} workspace`}
              type="button"
            >
              {mode === "chat" ? <MessageSquare size={16} /> : <Mic size={16} />}
            </button>
          ) : null}
        </div>
        <div className={styles.swapRow}>
          <div className={styles.full}><ThemeToggle /></div>
          {compact ? <ThemeToggleButton className={styles.mini} /> : null}
        </div>
        <div className={styles.userCard}>
          <UserButton appearance={clerkAppearance(resolvedTheme)} />
          <span className={`${styles.userText} ${styles.reveal}`}>
            <span className={styles.userName}>{user?.fullName || user?.username || "Account"}</span>
            <span className={styles.userEmail}>{user?.primaryEmailAddress?.emailAddress ?? ""}</span>
          </span>
        </div>
      </div>
    </>
  );
}

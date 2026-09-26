"use client";

import { useEffect, useState, type ComponentType } from "react";
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
  Phone,
  PlayCircle,
  Settings,
  Target,
  Wrench,
  X,
  type LucideProps,
} from "lucide-react";
import { BrandMark } from "@/components/brand/BrandMark";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
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
 * The dashboard's navigation: on desktop an always-open sidebar beside the
 * page; on small screens a top bar whose menu button slides the same sidebar
 * in from the left.
 */
export function DashboardSidebar({ activeLabel, badges, stackBelow }: DashboardSidebarProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

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
          <SidebarBody activeLabel={activeLabel} badges={badges} />
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
        <div className={styles.panel}>
          <SidebarBody activeLabel={activeLabel} badges={badges} onNavigate={() => setDrawerOpen(false)} />
        </div>
      </aside>
    </div>
  );
}

function SidebarBody({
  activeLabel,
  badges,
  onNavigate,
}: {
  activeLabel: string;
  badges?: Partial<Record<string, number>>;
  onNavigate?: () => void;
}) {
  const { user } = useUser();
  const { resolvedTheme } = useTheme();
  const { mode } = useWorkspaceMode();

  return (
    <>
      <Link aria-label="Wapzen home" className={styles.logo} href="/" onClick={onNavigate}>
        <span className={styles.logoMark}><BrandMark /></span>
        <span className={styles.logoText}>
          <span className={styles.logoName}>Wapzen</span>
          <span className={styles.logoTagline}>AI Voice Agents</span>
        </span>
      </Link>

      <div className={styles.kicker}>Menu</div>
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
              href={item.href ?? "#"}
              key={item.label}
              onClick={onNavigate}
            >
              <span className={styles.navIcon}>
                <Icon size={18} strokeWidth={1.9} />
              </span>
              <span className={styles.navLabel}>{item.label}</span>
              {count ? <span className={styles.badge}>{count}</span> : null}
            </Link>
          );
        })}
      </nav>

      <div className={styles.footer}>
        <WorkspaceModeToggle />
        <ThemeToggle />
        <div className={styles.userCard}>
          <UserButton appearance={clerkAppearance(resolvedTheme)} />
          <span className={styles.userText}>
            <span className={styles.userName}>{user?.fullName || user?.username || "Account"}</span>
            <span className={styles.userEmail}>{user?.primaryEmailAddress?.emailAddress ?? ""}</span>
          </span>
        </div>
      </div>
    </>
  );
}

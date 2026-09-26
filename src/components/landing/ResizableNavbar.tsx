"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

type NavLink = { href: string; label: string };

type ResizableNavbarProps = {
  /** Logo link, rendered at the start of the bar. */
  brand: ReactNode;
  /** Right-hand controls (theme toggle, auth); stay visible at every width. */
  actions: ReactNode;
  links: NavLink[];
};

// Past this many pixels of scroll the bar tucks into a compact floating pill.
const SCROLL_THRESHOLD = 80;
const spring = { type: "spring", stiffness: 220, damping: 32 } as const;

/**
 * The landing page's primary navigation, after Aceternity's resizable navbar:
 * full width at the top of the page, shrinking into a narrower floating pill
 * once the page scrolls, with a sliding hover highlight on desktop and an
 * animated dropdown menu on small screens.
 */
export function ResizableNavbar({ brand, actions, links }: ResizableNavbarProps) {
  const { scrollY } = useScroll();
  const [compact, setCompact] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => setCompact(y > SCROLL_THRESHOLD));

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 min-[375px]:px-4">
      {/* The wrapper carries the size animation; the blurred bar and the menu
          are siblings so the menu's own backdrop blur isn't clipped by the bar's. */}
      <motion.div
        animate={{
          maxWidth: compact ? 880 : 1152,
          width: compact ? "calc(100% - 12px)" : "100%",
          y: compact ? 8 : 0,
        }}
        className="relative mx-auto mt-3 min-[375px]:mt-4"
        initial={false}
        transition={spring}
      >
        <motion.nav
          animate={{ borderRadius: compact ? 28 : 16 }}
          aria-label="Primary"
          className={cn(
            "flex h-14 items-center justify-between gap-2 border bg-site-nav px-3 backdrop-blur-xl transition-[border-color,box-shadow] duration-300 sm:px-4",
            compact
              ? "border-site-border-strong shadow-[0_18px_50px_-12px_rgba(0,0,0,0.35)]"
              : "border-site-border shadow-[0_8px_30px_rgba(0,0,0,0.12)]",
          )}
          initial={false}
          transition={spring}
        >
          {brand}

          <div
            className="hidden items-center text-sm font-medium text-site-text-muted md:flex"
            onMouseLeave={() => setHovered(null)}
          >
            {links.map((link) => (
              <a
                className="relative rounded-full px-3.5 py-2 transition-colors hover:text-site-text focus-visible:text-site-text focus-visible:outline-none"
                href={link.href}
                key={link.href}
                onBlur={() => setHovered(null)}
                onFocus={() => setHovered(link.href)}
                onMouseEnter={() => setHovered(link.href)}
              >
                {hovered === link.href && (
                  <motion.span
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full bg-site-fill-2"
                    layoutId="primary-nav-hover"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative">{link.label}</span>
              </a>
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {actions}
            <button
              aria-controls="primary-nav-menu"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="inline-flex size-9 items-center justify-center rounded-full border border-site-border bg-site-fill text-site-text-soft transition hover:bg-site-fill-2 hover:text-site-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-bright md:hidden"
              onClick={() => setMenuOpen((open) => !open)}
              type="button"
            >
              {menuOpen ? <X size={17} /> : <Menu size={17} />}
            </button>
          </div>
        </motion.nav>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="absolute inset-x-0 top-full mt-2 origin-top rounded-2xl border border-site-border bg-site-nav p-2 shadow-[0_18px_50px_-12px_rgba(0,0,0,0.35)] backdrop-blur-xl md:hidden"
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              id="primary-nav-menu"
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              {links.map((link, index) => (
                <motion.a
                  animate={{ opacity: 1, x: 0 }}
                  className="block rounded-xl px-4 py-3 text-sm font-medium text-site-text-muted transition-colors hover:bg-site-fill hover:text-site-text"
                  href={link.href}
                  initial={{ opacity: 0, x: -8 }}
                  key={link.href}
                  onClick={() => setMenuOpen(false)}
                  transition={{ delay: 0.04 * index, duration: 0.2 }}
                >
                  {link.label}
                </motion.a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </header>
  );
}

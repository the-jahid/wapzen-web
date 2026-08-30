"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useOutsideClick } from "@/hooks/use-outside-click";

type ExpandableCardProps = {
  children: ReactNode;
  className?: string;
  dismissDisabled?: boolean;
  layoutId: string;
  onClose: () => void;
  open: boolean;
};

// Adapted from Aceternity's expandable-card-demo-standard. The registry demo
// ships with hard-coded music data; this shell keeps its shared-layout motion
// and dismissal behaviour while allowing product-specific content.
export default function ExpandableCardDemoStandard({
  children,
  className = "",
  dismissDisabled = false,
  layoutId,
  onClose,
  open,
}: ExpandableCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  useOutsideClick(ref, (event) => {
    if (dismissDisabled) return;
    const target = event.target;
    if (target instanceof Element && target.closest("[data-expandable-card-ignore]")) return;
    onClose();
  });

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !dismissDisabled) onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [dismissDisabled, onClose, open]);

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            animate={{ opacity: 1 }}
            className="expandable-card-backdrop"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
          />
          <div className="expandable-card-stage" role="presentation">
            <motion.div
              aria-modal="true"
              className={`expandable-card-panel ${className}`.trim()}
              layoutId={layoutId}
              ref={ref}
              role="dialog"
            >
              {children}
            </motion.div>
          </div>
        </>
      ) : null}
    </AnimatePresence>
  );
}

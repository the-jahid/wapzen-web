"use client";

import { useEffect, useRef, type ComponentPropsWithoutRef } from "react";

/**
 * A <section> that marks each `[data-reveal]` descendant with `data-shown`
 * the first time it scrolls into view. The motion itself lives in CSS, so the
 * content stays visible when scripting or motion is unavailable.
 */
export function RevealSection(props: ComponentPropsWithoutRef<"section">) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const targets = root.querySelectorAll<HTMLElement>("[data-reveal]");

    if (!("IntersectionObserver" in window)) {
      targets.forEach((target) => { target.dataset.shown = ""; });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.shown = "";
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.15 },
    );
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  return <section ref={ref} {...props} />;
}

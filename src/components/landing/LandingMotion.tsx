"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { MotionConfig, motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import styles from "./CoreLanding.module.css";

/** Content is visible in server HTML; only offscreen elements are armed for reveal. */
export function LandingMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const targets = root.current?.querySelectorAll<HTMLElement>("[data-enter]");
    if (!targets || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.removeAttribute("data-pending");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08 });
    const configure = () => {
      observer.disconnect();
      targets.forEach((target) => {
        target.removeAttribute("data-pending");
        if (!media.matches && target.getBoundingClientRect().top > window.innerHeight) {
          target.setAttribute("data-pending", "");
          observer.observe(target);
        }
      });
    };
    configure();
    media.addEventListener("change", configure);
    return () => { observer.disconnect(); media.removeEventListener("change", configure); };
  }, []);

  return <MotionConfig reducedMotion="user"><div ref={root} className={styles.page}>{children}</div></MotionConfig>;
}

export function HeroNetwork({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 65]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  return <motion.div ref={ref} className={styles.network} style={reduced ? undefined : { y, scale }}>{children}</motion.div>;
}

/**
 * Scroll runway for the portrait stage. It only feeds `--p` (0 as the runway
 * enters, 1 at its end) to CSS; the stage's layout and every card's timing are
 * derived from that in CoreLanding.module.css. CSS defaults `--p` to 1, so the
 * finished layout shows before hydration and under reduced motion.
 */
export function PeopleStage({ anchorId, children }: { anchorId: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 180, damping: 34, restDelta: 0.0005 });

  // Written after mount rather than through a motion `style`, which would put
  // `--p: 0` into the server HTML and hide the stage until (or without) hydration.
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    const apply = (value: number) => el.style.setProperty("--p", String(value));
    apply(progress.get());
    const unsubscribe = progress.on("change", apply);
    return () => { unsubscribe(); el.style.removeProperty("--p"); };
  }, [progress, reduced]);

  return <div ref={ref} className={styles.people}>
    {/* In-page links land here: late enough in the runway that the heading and chips have already appeared. */}
    <span id={anchorId} className={styles.peopleAnchor} />
    <div className={styles.peopleStage}>{children}</div>
  </div>;
}

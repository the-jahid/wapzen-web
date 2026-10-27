"use client";
import React, { useEffect, useId, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { cn } from "@/lib/utils";

// Aceternity's tracing beam, adapted: the rail tracks the content's height as it
// changes (images loading, <details> opening), the head follows the middle of
// the viewport, and the colours come from CSS variables so it takes the page's
// accent. Position the rail with railClassName.

/** Length of the glowing tail behind the beam's head, and of the fade past it, in px. */
const TAIL = 260;
const FADE = 40;
// The gradient pads past its ends with the end stops' colours, so both ends must be transparent.
const HEAD_STOP = TAIL / (TAIL + FADE);

export const TracingBeam = ({
  children,
  className,
  railClassName,
}: {
  children: React.ReactNode;
  className?: string;
  railClassName?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const gradientId = `tracing-beam-${useId().replace(/:/g, "")}`;
  // Head of the beam sits at the viewport's centre line.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"],
  });

  const [svgHeight, setSvgHeight] = useState(0);
  const height = useMotionValue(0);
  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;
    const observer = new ResizeObserver(() => {
      setSvgHeight(content.offsetHeight);
      height.set(content.offsetHeight);
    });
    observer.observe(content);
    return () => observer.disconnect();
  }, [height]);

  const spring = { stiffness: 500, damping: 90 };
  const head = useSpring(
    useTransform(() => scrollYProgress.get() * height.get()),
    spring,
  );
  const y1 = useTransform(head, (y) => y - TAIL);
  const y2 = useTransform(head, (y) => y + FADE);

  const [started, setStarted] = useState(false);
  useMotionValueEvent(scrollYProgress, "change", (p) => setStarted(p > 0));

  const path = `M 1 0V -36 l 18 24 V ${svgHeight * 0.8} l -18 24V ${svgHeight}`;

  return (
    <div ref={ref} className={cn("relative", className)}>
      <div
        className={cn("pointer-events-none absolute top-3 -left-4 md:-left-20", railClassName)}
        aria-hidden="true"
      >
        <motion.div
          transition={{ duration: 0.2, delay: 0.5 }}
          animate={{ boxShadow: started ? "none" : "rgba(0, 0, 0, 0.24) 0px 3px 8px" }}
          className="ml-6.75 flex h-4 w-4 items-center justify-center rounded-full border border-(--site-border-strong,#d4d4d4) bg-(--site-bg,#fff)"
        >
          <motion.div
            transition={{ duration: 0.2, delay: 0.5 }}
            animate={{ opacity: started ? 0.35 : 1, scale: started ? 0.75 : 1 }}
            className="h-2 w-2 rounded-full bg-(--beam-color,#10b981)"
          />
        </motion.div>
        <svg viewBox={`0 0 20 ${svgHeight}`} width="20" height={svgHeight} className="ml-4 block">
          <path d={path} fill="none" stroke="var(--beam-track, #9091A0)" strokeOpacity="0.16" />
          <path d={path} fill="none" stroke={`url(#${gradientId})`} strokeWidth="1.5" className="motion-reduce:hidden" />
          <defs>
            <motion.linearGradient id={gradientId} gradientUnits="userSpaceOnUse" x1="0" x2="0" y1={y1} y2={y2}>
              <stop style={{ stopColor: "var(--beam-color, #10b981)" }} stopOpacity="0" />
              <stop offset={HEAD_STOP * 0.75} style={{ stopColor: "var(--beam-color, #10b981)" }} />
              <stop offset={HEAD_STOP} style={{ stopColor: "var(--beam-head, #34d399)" }} />
              <stop offset="1" style={{ stopColor: "var(--beam-head, #34d399)" }} stopOpacity="0" />
            </motion.linearGradient>
          </defs>
        </svg>
      </div>
      <div ref={contentRef}>{children}</div>
    </div>
  );
};

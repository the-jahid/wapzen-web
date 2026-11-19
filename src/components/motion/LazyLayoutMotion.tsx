"use client";

import { LazyMotion } from "motion/react";
import type { ReactNode } from "react";

const loadLayoutFeatures = () => import("./layoutFeatures").then((module) => module.default);

/**
 * LazyLayoutMotion lets `m` elements (from "motion/react-m") inside it animate
 * as `motion` ones would, with motion's animation engine fetched after the page
 * has rendered rather than before. The page paints and responds without
 * waiting for it, and the grid ↔ list morph and layout animations start
 * working as soon as it arrives (a moment later, and at once on later visits).
 */
export function LazyLayoutMotion({ children }: { children: ReactNode }) {
  return <LazyMotion features={loadLayoutFeatures}>{children}</LazyMotion>;
}

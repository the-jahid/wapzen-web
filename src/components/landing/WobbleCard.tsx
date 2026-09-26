"use client";

import type { ComponentPropsWithoutRef, MouseEvent } from "react";

type WobbleCardProps = ComponentPropsWithoutRef<"article"> & {
  innerClassName?: string;
};

/**
 * An <article> that drifts toward the cursor while its content drifts the
 * other way, after Aceternity's wobble card. The pointer offset is written to
 * CSS variables rather than state so moving the mouse never re-renders; the
 * CSS decides whether (and how far) to actually move.
 */
export function WobbleCard({ children, innerClassName, onMouseMove, onMouseLeave, ...props }: WobbleCardProps) {
  function handleMouseMove(event: MouseEvent<HTMLElement>) {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--wobble-x", `${(event.clientX - (rect.left + rect.width / 2)) / 20}px`);
    card.style.setProperty("--wobble-y", `${(event.clientY - (rect.top + rect.height / 2)) / 20}px`);
    onMouseMove?.(event);
  }

  function handleMouseLeave(event: MouseEvent<HTMLElement>) {
    event.currentTarget.style.removeProperty("--wobble-x");
    event.currentTarget.style.removeProperty("--wobble-y");
    onMouseLeave?.(event);
  }

  return (
    <article {...props} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      <div className={innerClassName}>{children}</div>
    </article>
  );
}

"use client";

import { useSyncExternalStore } from "react";

// How many chat agents the signed-in account has, as the server last said.
// An account with none is held on the setup page (link a number, name the
// agent) until it has one, so every dashboard page needs to know the count.
// The chat agents page reports it whenever its list changes; other pages ask
// the server once (FirstAgentGate). It belongs to one Clerk user: a different
// user reads "unknown" until their own count arrives.
//
// "Go to dashboard" on the setup page lets the user out without an agent. That
// choice lasts for the browser tab (a reload keeps it), so the next sign-in in
// a new tab starts on the setup page again.

type CountState = { owner: string | null; count: number | null; skipped: string[] };

const SKIP_KEY = "wapzen.setup-skipped";

let state: CountState = { owner: null, count: null, skipped: readSkipped() };
const listeners = new Set<() => void>();

function readSkipped(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.sessionStorage.getItem(SKIP_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function emit() {
  listeners.forEach((notify) => notify());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function reportChatAgentCount(owner: string, count: number) {
  if (state.owner === owner && state.count === count) return;
  state = { ...state, owner, count };
  emit();
}

/** Lets this user use the whole dashboard without an agent, for this tab. */
export function skipFirstAgentSetup(owner: string) {
  if (state.skipped.includes(owner)) return;
  state = { ...state, skipped: [...state.skipped, owner] };
  try {
    window.sessionStorage.setItem(SKIP_KEY, JSON.stringify(state.skipped));
  } catch {
    // Storage blocked: the choice still holds until the page reloads.
  }
  emit();
}

/** The account's chat agent count, or null while it is not known yet. */
export function useChatAgentCount(owner: string | null | undefined): number | null {
  const snapshot = useSyncExternalStore(subscribe, () => state, () => null);
  if (!snapshot || !owner || snapshot.owner !== owner) return null;
  return snapshot.count;
}

/** Whether this user chose "Go to dashboard" on the setup page in this tab. */
export function useFirstAgentSetupSkipped(owner: string | null | undefined): boolean {
  const snapshot = useSyncExternalStore(subscribe, () => state, () => null);
  return Boolean(snapshot && owner && snapshot.skipped.includes(owner));
}

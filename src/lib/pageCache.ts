"use client";

import { useAuth } from "@clerk/nextjs";
import {
  useCallback,
  useEffect,
  useState,
  useSyncExternalStore,
  type Dispatch,
  type SetStateAction,
} from "react";

// Dashboard lists come from the Go API in the browser, with the user's Clerk
// token, so Next's server-side data cache never sees them. This is the client
// half instead: stale-while-revalidate. A page shows what it last loaded the
// moment it opens — after a navigation or a reload — while its usual fetch
// runs behind it, and a refetch that comes back unchanged keeps the old value
// so nothing on screen re-renders.
//
// Entries live in memory and in sessionStorage: they survive a reload, but not
// the tab, and they belong to one Clerk user. A different user (or a sign-out)
// in the same tab wipes them before anything else can be read.

const STORAGE_KEY = "wapzen.page-cache.v1";
const PERSIST_DELAY_MS = 400;
const MAX_PERSISTED_ENTRY_CHARS = 200_000;

type CacheStore = { owner: string | null; entries: Record<string, unknown> };

let store: CacheStore | null = null;
let persistTimer: ReturnType<typeof setTimeout> | null = null;
const listeners = new Set<() => void>();

function readStore(): CacheStore {
  if (store) return store;
  store = { owner: null, entries: {} };
  if (typeof window === "undefined") return store;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as Partial<CacheStore>) : null;
    if (parsed && typeof parsed.entries === "object" && parsed.entries) {
      store = { owner: parsed.owner ?? null, entries: parsed.entries };
    }
  } catch {
    // Unreadable or blocked storage: start empty; memory still works.
  }
  return store;
}

function flush() {
  if (persistTimer) {
    clearTimeout(persistTimer);
    persistTimer = null;
  }
  const current = readStore();
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    return;
  } catch {
    // Over quota, most likely from long transcripts; retry with the small
    // entries only, so the lists every page opens on still survive a reload.
  }
  try {
    const small = Object.fromEntries(
      Object.entries(current.entries).filter(
        ([, value]) => (JSON.stringify(value) ?? "").length < MAX_PERSISTED_ENTRY_CHARS
      )
    );
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ owner: current.owner, entries: small }));
  } catch {
    // Still failing or blocked: memory keeps serving navigations in this tab.
  }
}

// Writes are batched: an editor that updates its list on every keystroke
// should not serialize the whole cache each time.
function schedulePersist() {
  if (typeof window === "undefined") return;
  if (persistTimer) clearTimeout(persistTimer);
  persistTimer = setTimeout(flush, PERSIST_DELAY_MS);
}

if (typeof window !== "undefined") {
  window.addEventListener("pagehide", () => {
    if (persistTimer) flush();
  });
}

function emit() {
  listeners.forEach((notify) => notify());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// claimCache hands the cache to the signed-in user, dropping whatever another
// account (or a signed-out visit) left in it.
function claimCache(owner: string | null) {
  const current = readStore();
  if (current.owner === owner) return;
  const hadEntries = Object.keys(current.entries).length > 0;
  store = { owner, entries: owner && !current.owner && !hadEntries ? current.entries : {} };
  schedulePersist();
  if (hadEntries) emit();
}

function sameValue(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  try {
    return JSON.stringify(a) === JSON.stringify(b);
  } catch {
    return false;
  }
}

/**
 * useCachedState is useState whose value is shared under `key` and kept across
 * navigations and reloads. The third value says whether the value came from
 * the cache (or has been set since), which is what lets a page skip its
 * loading skeleton and show the last list while it refetches.
 */
export function useCachedState<T>(
  key: string,
  fallback: T
): [T, Dispatch<SetStateAction<T>>, boolean] {
  const { isLoaded, userId } = useAuth();
  // Held once, so a literal like `[]` does not hand callers a new array on
  // every render while nothing is cached.
  const [initial] = useState(fallback);

  useEffect(() => {
    if (isLoaded) claimCache(userId ?? null);
  }, [isLoaded, userId]);

  const cached = useSyncExternalStore(
    subscribe,
    () => readStore().entries[key] as T | undefined,
    // The server has no cache, so hydration renders the empty state and the
    // cached value follows in the very next render.
    () => undefined
  );

  const setValue = useCallback<Dispatch<SetStateAction<T>>>(
    (next) => {
      const current = readStore();
      const previous = (key in current.entries ? current.entries[key] : initial) as T;
      const value =
        typeof next === "function" ? (next as (prev: T) => T)(previous) : next;
      if (sameValue(previous, value) && key in current.entries) return;
      current.entries = { ...current.entries, [key]: value };
      schedulePersist();
      emit();
    },
    [initial, key]
  );

  return [cached === undefined ? initial : cached, setValue, cached !== undefined];
}

"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import type { AuthTokenGetter } from "@/lib/api";
import { getOrdersVersion, listOrders } from "@/lib/orders";
import { useCachedState } from "@/lib/pageCache";
import { startRefreshing } from "@/lib/polling";

// Shared with the Orders tab, whose own fetches keep this current too.
export const newOrdersCacheKey = "orders:new-count";

// An order arrives whenever a customer confirms one, and the server has nothing
// to push it with, so the sidebar asks on the same timer as the Orders tab.
const refreshMs = 15000;

// Every dashboard page renders its own sidebar, so moving between pages
// unmounts one and mounts the next. The timer lives out here instead, so a page
// change neither asks again nor restarts the 15 seconds: while any sidebar is
// mounted one timer runs, and it stops a moment after the last one goes.
let mountedSidebars = 0;
let stopTimer: (() => void) | null = null;
let stopSoon: ReturnType<typeof setTimeout> | undefined;
// The newest mounted sidebar's way to ask and to show the answer.
let asker: { userId: string; getToken: AuthTokenGetter; setCount: (count: number) => void } | null = null;
// Whose count the timer has been asking for: another account signing in to
// this tab is asked at once rather than on the next tick.
let askedFor: string | null = null;

// The count comes from the version route, a fraction of the size of the list
// this used to read for it. A server without that route is asked the old way.
// A tab in the background doesn't ask, so an open dashboard costs nothing idle.
function askNewOrders() {
  const current = asker;
  if (!current || document.hidden) return;
  getOrdersVersion(current.getToken)
    .then(async (state) => state?.newOrders ?? (await listOrders(current.getToken, { limit: 1 })).newOrders)
    .then((newOrders) => {
      // An answer that lands after a page change still counts; one for an
      // account that has since signed out of this tab doesn't.
      if (asker?.userId === current.userId) asker.setCount(newOrders);
    })
    .catch(() => undefined); // A missed count is retried on the next tick.
}

// useNewOrders is how many orders are still marked new, on any dashboard page.
export function useNewOrders(): number {
  const { getToken, isSignedIn, userId } = useAuth();
  const [count, setCount] = useCachedState<number>(newOrdersCacheKey, 0);

  useEffect(() => {
    if (!isSignedIn || !userId) return;
    asker = { userId, getToken, setCount };
    mountedSidebars += 1;
    clearTimeout(stopSoon);
    if (!stopTimer) {
      stopTimer = startRefreshing(askNewOrders, refreshMs);
      askedFor = null;
    }
    if (askedFor !== userId) {
      askedFor = userId;
      askNewOrders();
    }
    return () => {
      mountedSidebars -= 1;
      if (mountedSidebars > 0) return;
      // The next page's sidebar mounts right after this one unmounts; only a
      // dashboard with no sidebar left lets the timer go.
      stopSoon = setTimeout(() => {
        if (mountedSidebars > 0) return;
        stopTimer?.();
        stopTimer = null;
        asker = null;
        askedFor = null;
      }, 1000);
    };
  }, [getToken, isSignedIn, setCount, userId]);

  return count;
}

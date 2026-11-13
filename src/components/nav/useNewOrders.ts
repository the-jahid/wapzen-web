"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { getOrdersVersion, listOrders } from "@/lib/orders";
import { useCachedState } from "@/lib/pageCache";
import { startRefreshing } from "@/lib/polling";

// Shared with the Orders tab, whose own fetches keep this current too.
export const newOrdersCacheKey = "orders:new-count";

// An order arrives whenever a customer confirms one, and the server has nothing
// to push it with, so the sidebar asks on the same timer as the Orders tab.
const refreshMs = 15000;

// useNewOrders is how many orders are still marked new, on any dashboard page.
// A tab in the background doesn't ask, so an open dashboard costs nothing idle.
export function useNewOrders(): number {
  const { getToken, isSignedIn } = useAuth();
  const [count, setCount] = useCachedState<number>(newOrdersCacheKey, 0);

  useEffect(() => {
    if (!isSignedIn) return;
    let cancelled = false;
    // The count comes from the version route, a fraction of the size of the
    // list this used to read for it. A server without that route is asked the
    // old way.
    const refresh = () => {
      if (document.hidden) return;
      getOrdersVersion(getToken)
        .then(async (state) => state?.newOrders ?? (await listOrders(getToken, { limit: 1 })).newOrders)
        .then((newOrders) => {
          if (!cancelled) setCount(newOrders);
        })
        .catch(() => undefined); // A missed count is retried on the next tick.
    };
    refresh();
    const stopRefreshing = startRefreshing(refresh, refreshMs);
    return () => {
      cancelled = true;
      stopRefreshing();
    };
  }, [getToken, isSignedIn, setCount]);

  return count;
}

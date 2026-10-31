"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { listOrders } from "@/lib/orders";
import { useCachedState } from "@/lib/pageCache";

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
    const refresh = () => {
      if (document.hidden) return;
      listOrders(getToken, { limit: 1 })
        .then((result) => {
          if (!cancelled) setCount(result.newOrders);
        })
        .catch(() => undefined); // A missed count is retried on the next tick.
    };
    refresh();
    const timer = window.setInterval(refresh, refreshMs);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [getToken, isSignedIn, setCount]);

  return count;
}

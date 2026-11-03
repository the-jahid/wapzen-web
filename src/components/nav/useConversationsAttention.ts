"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { countChatConversationsNeedingAttention } from "@/lib/chatConversations";
import { useCachedState } from "@/lib/pageCache";

const cacheKey = "conversations:attention-count";
const refreshMs = 15000;

// Sent by the conversations page after anything that can change the count
// (marking done, the AI switch, a reply), so the badge doesn't wait a tick.
export const conversationsAttentionEvent = "wapzen:conversations-attention";

export function refreshConversationsAttention() {
  window.dispatchEvent(new Event(conversationsAttentionEvent));
}

// useConversationsAttention is how many conversations are red: the AI went off
// for the contact and nobody has marked it done yet. Like useNewOrders, a tab
// in the background doesn't ask.
export function useConversationsAttention(): number {
  const { getToken, isSignedIn } = useAuth();
  const [count, setCount] = useCachedState<number>(cacheKey, 0);

  useEffect(() => {
    if (!isSignedIn) return;
    let cancelled = false;
    const refresh = () => {
      if (document.hidden) return;
      countChatConversationsNeedingAttention(getToken)
        .then((total) => {
          if (!cancelled) setCount(total);
        })
        .catch(() => undefined); // A missed count is retried on the next tick.
    };
    refresh();
    const timer = window.setInterval(refresh, refreshMs);
    window.addEventListener(conversationsAttentionEvent, refresh);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
      window.removeEventListener(conversationsAttentionEvent, refresh);
    };
  }, [getToken, isSignedIn, setCount]);

  return count;
}

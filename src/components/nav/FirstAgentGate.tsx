"use client";

import { useAuth } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { listChatAgentLiveStates } from "@/lib/chatAgents";
import {
  reportChatAgentCount,
  useChatAgentCount,
  useFirstAgentSetupSkipped,
} from "@/lib/chatAgentCount";

// The one page an account with no chat agent may use. It shows nothing but
// linking a WhatsApp number and naming the agent.
export const FIRST_AGENT_SETUP_PATH = "/dashboard/chat";

/**
 * FirstAgentGate keeps an account with no chat agent on the setup page: every
 * other dashboard page sends it there, and shows nothing while it goes, unless
 * the user pressed "Go to dashboard" in this tab. Until
 * the count is known pages render as usual, so accounts that do have an agent
 * never wait on this check.
 */
export function FirstAgentGate({ children }: { children: React.ReactNode }) {
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const count = useChatAgentCount(userId);
  const skipped = useFirstAgentSetupSkipped(userId);
  const onSetupPage = pathname === FIRST_AGENT_SETUP_PATH;
  // The chat agents pages load the full list and report the count themselves,
  // so only the other pages ask the server.
  const pageReportsCount = pathname?.startsWith(FIRST_AGENT_SETUP_PATH) ?? false;

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !userId || count !== null || pageReportsCount) return;
    let cancelled = false;
    listChatAgentLiveStates(getToken)
      .then((agents) => {
        if (!cancelled) reportChatAgentCount(userId, agents.length);
      })
      .catch(() => {
        // Unknown stays unknown: the page is shown rather than locked on a guess.
      });
    return () => {
      cancelled = true;
    };
  }, [count, getToken, isLoaded, isSignedIn, pageReportsCount, userId]);

  const locked = count === 0 && !skipped && !onSetupPage;

  useEffect(() => {
    if (locked) router.replace(FIRST_AGENT_SETUP_PATH);
  }, [locked, router]);

  if (locked) return null;
  return <>{children}</>;
}

"use client";

import { usePathname } from "next/navigation";

import { DashboardSidebar } from "@/components/nav/DashboardSidebar";
import { VoiceUpdateNote } from "@/components/nav/VoiceUpdateNote";
import { navItemsForMode, useWorkspaceMode } from "@/components/nav/workspaceMode";
import styles from "./VoiceComingSoonGate.module.css";

// Pages that exist only for voice. They always show the note.
const voiceOnlyPaths = [
  "/dashboard/agents",
  "/dashboard/calls",
  "/dashboard/outbound",
  "/dashboard/demo-call",
  "/dashboard/api-keys",
];

function matches(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Voice agents are not served while the next update is built, so every page of
 * the voice workspace shows the "coming in our next update" note in place of
 * its content. Shared pages (Phone Numbers, Knowledge Base, Tools, Orders) still
 * work normally in chat mode.
 */
export function VoiceComingSoonGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const { mode } = useWorkspaceMode();

  const voiceItem = navItemsForMode("voice").find(
    (item) => item.href && matches(pathname, item.href)
  );
  const isVoicePage =
    voiceOnlyPaths.some((path) => matches(pathname, path)) || (mode === "voice" && !!voiceItem);

  if (!isVoicePage) return <>{children}</>;

  return (
    <div className={styles.shell}>
      <DashboardSidebar activeLabel={voiceItem?.label ?? ""} stackBelow={980} />
      <main className={styles.main}>
        <div className={styles.card}>
          <VoiceUpdateNote />
        </div>
      </main>
    </div>
  );
}

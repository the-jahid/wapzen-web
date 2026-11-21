"use client";

import { usePathname } from "next/navigation";

import { DashboardSidebar } from "@/components/nav/DashboardSidebar";
import { VoiceUpdateNote } from "@/components/nav/VoiceUpdateNote";
import styles from "./VoiceComingSoonGate.module.css";

// The voice workspace (WhatsApp voice agents, phone numbers, knowledge bases,
// tools, calls, outbound) talks to the Go server and is open. Only the demo call
// page, which is not in the menu, still shows the "coming in our next update"
// note in place of its content.
const gatedVoicePaths = ["/dashboard/voice/demo-call"];

function matches(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function VoiceComingSoonGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  if (!gatedVoicePaths.some((path) => matches(pathname, path))) return <>{children}</>;

  return (
    <div className={styles.shell}>
      <DashboardSidebar activeLabel="" stackBelow={980} />
      <main className={styles.main}>
        <div className={styles.card}>
          <VoiceUpdateNote />
        </div>
      </main>
    </div>
  );
}

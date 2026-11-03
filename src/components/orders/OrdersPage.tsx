"use client";

import { useCallback, useEffect, useState } from "react";
import { DashboardSidebar } from "@/components/nav/DashboardSidebar";
import { newOrdersCacheKey } from "@/components/nav/useNewOrders";
import { useWorkspaceMode } from "@/components/nav/workspaceMode";
import OrdersTab from "@/components/tools/OrdersTab";
import { toolsCss } from "@/components/tools/ToolsPage";
import { useCachedState } from "@/lib/pageCache";

type Notice = { kind: "success" | "error"; text: string };

// The orders agents have placed. They used to be a tab of Tools, so the page
// keeps that shell and its styles.
export default function OrdersPage() {
  const { mode } = useWorkspaceMode();
  // The sidebar keeps this count current on every page.
  const [, setNewOrders] = useCachedState<number>(newOrdersCacheKey, 0);
  const [notice, setNotice] = useState<Notice | null>(null);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 3500);
    return () => clearTimeout(timer);
  }, [notice]);

  const showNotice = useCallback((kind: Notice["kind"], text: string) => {
    setNotice({ kind, text });
  }, []);

  return (
    <div className={`tools-shell${mode === "chat" ? " app-accent-green" : ""}`}>
      <style dangerouslySetInnerHTML={{ __html: toolsCss }} />
      <DashboardSidebar activeLabel="Orders" stackBelow={900} />

      <main className="tools-main">
        <div className="tools-content">
          <div className="tools-browse">
            <h1 className="tools-page-title">Orders</h1>
            <OrdersTab onNewCount={setNewOrders} onNotice={showNotice} />
          </div>
        </div>
      </main>

      {notice ? (
        <div
          className={`tools-toast ${notice.kind === "error" ? "tools-toast-error" : "tools-toast-success"}`}
          role="status"
        >
          {notice.text}
        </div>
      ) : null}
    </div>
  );
}

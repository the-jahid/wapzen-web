"use client";

import { useEffect } from "react";
import { visitDay } from "@/lib/siteVisits";

const SENT_KEY = "wz-visit-day";

// Tells /api/visit about this visitor once per Bangladesh day, for /status.
// The server dedupes too; remembering the day here only saves the request on
// every later page view.
export function VisitBeacon() {
  useEffect(() => {
    if (navigator.webdriver) return;
    const today = visitDay();
    try {
      if (localStorage.getItem(SENT_KEY) === today) return;
    } catch {
      // Storage blocked: send anyway, the server dedupes.
    }
    fetch("/api/visit", { method: "POST", keepalive: true })
      .then((response) => {
        if (!response.ok) return;
        try {
          localStorage.setItem(SENT_KEY, today);
        } catch {}
      })
      .catch(() => {});
  }, []);
  return null;
}

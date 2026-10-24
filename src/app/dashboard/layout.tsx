import type { Metadata } from "next";
import { preconnect } from "react-dom";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

function apiOrigin(): string | null {
  try {
    return new URL(process.env.NEXT_PUBLIC_BASE_SERVER_URL ?? "").origin;
  } catch {
    return null;
  }
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Every dashboard page loads its lists from the Go API, which is another
  // origin, so the browser can open that connection (DNS, TCP, TLS) while the
  // page is still booting rather than when the first list is requested. The
  // API is fetched without credentials, so the warmed connection is the
  // anonymous kind those requests (and their CORS preflights) use.
  const origin = apiOrigin();
  if (origin) preconnect(origin, { crossOrigin: "anonymous" });
  return children;
}

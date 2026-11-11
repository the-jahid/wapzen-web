"use client";

import type { ReactNode } from "react";
import { useAuth } from "@clerk/nextjs";

// Picks the signed-in or signed-out controls in the browser. The public pages
// are built once and served from the CDN, so the server can't know who is
// visiting: Clerk's server-side <Show> reads the session cookie, which made
// every public page render on each request (slow first byte, no caching).
// Visitors get the signed-out controls until Clerk has loaded and says
// otherwise, so the HTML search engines read is the signed-out page.
export function AuthSwitch({ signedOut, signedIn }: { signedOut: ReactNode; signedIn: ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();
  return <>{isLoaded && isSignedIn ? signedIn : signedOut}</>;
}

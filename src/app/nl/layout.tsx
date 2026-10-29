import type { ReactNode } from "react";
import { PublicShell } from "@/components/landing/PublicShell";

// Dutch: the blog only. Register each post in lib/blogPosts.ts with locale
// "nl" and, where there is one, the English post it covers (alternateOf).
// The footer lists the English solution pages (locales fallback).
export default function Layout({ children }: { children: ReactNode }) {
  return <PublicShell locale="nl">{children}</PublicShell>;
}

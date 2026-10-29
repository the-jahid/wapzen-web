import type { ReactNode } from "react";
import { PublicShell } from "@/components/landing/PublicShell";

// French: the blog only. Register each post in lib/blogPosts.ts with locale
// "fr" and, where there is one, the English post it covers (alternateOf).
// The footer lists the English solution pages (locales fallback).
export default function Layout({ children }: { children: ReactNode }) {
  return <PublicShell locale="fr">{children}</PublicShell>;
}

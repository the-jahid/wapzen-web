import type { ReactNode } from "react";
import { PublicShell } from "@/components/landing/PublicShell";

// Mexico (Mexican Spanish): the blog only. Register each post in lib/blogPosts.ts
// with locale "es-MX" and, where there is one, the English post it covers
// (alternateOf). The footer lists Spain's Spanish pages (locales fallback).
export default function Layout({ children }: { children: ReactNode }) {
  return <PublicShell locale="es-MX">{children}</PublicShell>;
}

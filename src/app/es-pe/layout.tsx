import type { ReactNode } from "react";
import { PublicShell } from "@/components/landing/PublicShell";

// Peru (Peruvian Spanish): the blog only. Register each post in lib/blogPosts.ts
// with locale "es-PE". The footer lists Spain's Spanish pages (locales fallback).
export default function Layout({ children }: { children: ReactNode }) {
  return <PublicShell locale="es-PE">{children}</PublicShell>;
}

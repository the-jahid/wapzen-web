import type { ReactNode } from "react";
import { PublicShell } from "@/components/landing/PublicShell";

// Colombia (Colombian Spanish): the blog only. Register each post in lib/blogPosts.ts
// with locale "es-CO". The footer lists Spain's Spanish pages (locales fallback).
export default function Layout({ children }: { children: ReactNode }) {
  return <PublicShell locale="es-CO">{children}</PublicShell>;
}

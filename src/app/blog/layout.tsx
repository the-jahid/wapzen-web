import type { ReactNode } from "react";
import { PublicShell } from "@/components/landing/PublicShell";

// Blog index and posts (lib/blogPosts.ts), in English only.
export default function BlogLayout({ children }: { children: ReactNode }) {
  return <PublicShell>{children}</PublicShell>;
}

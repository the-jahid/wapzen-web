import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: "WhatsCall",
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#050f0c",
    theme_color: "#06120f",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const alt =
  "Wapzen — build WhatsApp AI chat agents and voice agents for messages and calls";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  // The white lockup reads on the dark card; process.cwd() is the project root.
  const logo = await readFile(join(process.cwd(), "public/brand/wapzen-logo-white.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          backgroundColor: "#050f0c",
          backgroundImage:
            "radial-gradient(600px 400px at 15% 0%, rgba(31,199,122,0.35), transparent), radial-gradient(600px 400px at 100% 100%, rgba(56,205,240,0.18), transparent)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain <img> only */}
          <img alt={siteConfig.name} height={86} src={logoSrc} width={319} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 68,
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              maxWidth: 950,
            }}
          >
            Build WhatsApp AI chat and voice agents
          </div>
          <div
            style={{
              fontSize: 30,
              lineHeight: 1.4,
              color: "rgba(255,255,255,0.7)",
              maxWidth: 900,
            }}
          >
            Reply to messages, handle inbound and outbound calls, and review
            conversations in one dashboard.
          </div>
        </div>

        <div style={{ display: "flex", gap: 16 }}>
          {["AI chat", "AI voice", "Outbound campaigns"].map((tag) => (
            <div
              key={tag}
              style={{
                display: "flex",
                padding: "12px 26px",
                borderRadius: 999,
                border: "1px solid rgba(70,224,154,0.45)",
                backgroundColor: "rgba(31,199,122,0.12)",
                color: "#8af0c0",
                fontSize: 24,
                fontWeight: 600,
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}

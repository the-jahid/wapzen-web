"use client";

import dynamic from "next/dynamic";

// The voice workspace's own pages, loaded only when one is actually rendered.
// While VoiceComingSoonGate shows its note in their place, nothing renders them,
// so their code (the agents editor alone is ~100 KB, plus the animation library)
// is never downloaded, not even when a sidebar link prefetches the route. Once
// the gate lets a page through, it loads and server-renders as before.
export const AgentsPage = dynamic(() => import("@/components/agents/AgentsPage"));
export const ApiKeysPage = dynamic(() => import("@/components/api-keys/ApiKeysPage"));
export const CallsPage = dynamic(() => import("@/components/calls/CallsPage"));
export const DemoCallPage = dynamic(() => import("@/components/demo-call/DemoCallPage"));
export const OutboundPage = dynamic(() => import("@/components/outbound/OutboundPage"));

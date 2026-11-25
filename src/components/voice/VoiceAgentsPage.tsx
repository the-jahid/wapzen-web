"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import SetupVideoButton from "@/components/chat/SetupVideoButton";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import { DashboardSidebar } from "@/components/nav/DashboardSidebar";
import { SUPPORT_WHATSAPP_URL, VOICE_MINUTES_WHATSAPP_URL, WhatsAppGlyph } from "@/components/nav/supportWhatsApp";
import type { AgentPayload, ApiAgentResource, ApiAgentSection } from "@/lib/agents";
import type { ApiCall } from "@/lib/calls";
import {
  addKnowledgeBaseFileSources,
  createKnowledgeBase,
  deleteKnowledgeBase,
  describeUnreadableFile,
  knowledgeBaseFileExtensions,
  knowledgeBaseNameLimit,
  sourceTitleFromFilename,
  type ApiKnowledgeBase,
} from "@/lib/knowledgeBases";
import type { ApiPhoneNumber } from "@/lib/phoneNumbers";
import type { ApiTool } from "@/lib/tools";
import { useCachedState } from "@/lib/pageCache";
import {
  createVoiceAgent,
  deleteVoiceAgent,
  getVoiceCall,
  getVoicePhoneNumber,
  getVoiceUsage,
  VoiceApiError,
  type ApiVoiceUsage,
  hangupVoiceCall,
  listVoiceAgents,
  listVoiceCalls,
  listVoiceKnowledgeBases,
  listVoicePhoneNumbers,
  listVoiceTools,
  placeVoiceCall,
  startVoiceNumberCodeLogin,
  startVoiceNumberLogin,
  updateVoiceAgent,
} from "@/lib/voiceAgents";
import { useIsPhone, usePhoneNumberLib } from "@/components/phone-numbers/WhatsAppLinkHelp";
import { baseCss } from "./voiceAgentsCss";

// The voice agents page: the chat agents page's layout (a list of cards, and
// each agent on its own page with the prompt on the left and a flat settings
// rail on the right), filled with what a voice agent has in the Go server's
// `agents` table — language, Realtime voice and model, the
// call opening — and its own numbers, knowledge bases, tools and calls.

// The editor edits the agent section field by field, so none of it is required.
type VoiceAgent = Omit<ApiAgentResource, "agent"> & { agent?: Partial<ApiAgentSection> | null };
type AuthGetter = ReturnType<typeof useAuth>["getToken"];

type IconName =
  | "agents"
  | "phone"
  | "mic"
  | "globe"
  | "book"
  | "wrench"
  | "play"
  | "plus"
  | "trash"
  | "search"
  | "chevron"
  | "check"
  | "back"
  | "qr"
  | "refresh"
  | "x";

type ConfigSectionId =
  | "phone-number"
  | "language"
  | "voice"
  | "call-opening"
  | "knowledge-base"
  | "tools";

type EditorTab = "agent" | "calls" | "configuration";

const editorTabs: { id: EditorTab; label: string }[] = [
  { id: "agent", label: "Agent" },
  { id: "calls", label: "Calls" },
  { id: "configuration", label: "Configuration" },
];

// Keep in step with the "@media (min-width: 1180px)" blocks in the css.
const DESKTOP_QUERY = "(min-width: 1180px)";

function subscribeDesktopQuery(onChange: () => void) {
  const query = window.matchMedia(DESKTOP_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function useIsDesktop() {
  return useSyncExternalStore(subscribeDesktopQuery, () => window.matchMedia(DESKTOP_QUERY).matches, () => false);
}

type Option = { id: string; label: string; hint?: string };

// Values the agents table accepts (its CHECK constraints), with the labels the
// editor shows for them.
const beginModeOptions: Option[] = [
  { id: "agent_speaks_first", label: "Agent speaks first", hint: "Says the welcome message word for word." },
  {
    id: "agent_speaks_first_with_model_generated_message",
    label: "Agent speaks first, own words",
    hint: "Opens the call with a greeting it writes from the prompt.",
  },
  { id: "agent_waits_for_user", label: "Caller speaks first", hint: "Stays quiet until the other side talks." },
];

const realtimeModels: Option[] = [
  { id: "gpt-realtime-2.1-mini", label: "GPT Realtime 2.1 Mini" },
  { id: "gpt-realtime-2.1", label: "GPT Realtime 2.1" },
  { id: "gpt-realtime-2", label: "GPT Realtime 2" },
  { id: "gpt-realtime-1.5", label: "GPT Realtime 1.5" },
  { id: "gpt-realtime-mini", label: "GPT Realtime Mini" },
  { id: "gpt-realtime", label: "GPT Realtime" },
];

// Google Gemini Live models. The server runs any "gemini-*" model on Gemini
// Live and everything else on OpenAI Realtime, so the model is the engine.
const geminiModels: Option[] = [
  { id: "gemini-3.8-live", label: "Gemini 3.8 Live" },
  { id: "gemini-3.1-flash-live-preview", label: "Gemini 3.1 Flash Live" },
  { id: "gemini-2.5-flash-native-audio-latest", label: "Gemini 2.5 Flash Native Audio" },
];

const allRealtimeModels: Option[] = [...realtimeModels, ...geminiModels];

type VoiceEngine = "openai" | "gemini";

const voiceEngines: Option[] = [
  { id: "gemini", label: "Google Gemini Live" },
  { id: "openai", label: "OpenAI Realtime" },
];

function engineOf(model: string | undefined | null): VoiceEngine {
  return model?.trim().toLowerCase().startsWith("gemini") ? "gemini" : "openai";
}

// The voices Gemini Live speaks.
const geminiVoices: Option[] = [
  { id: "puck", label: "Puck · male, upbeat" },
  { id: "charon", label: "Charon · male, informative" },
  { id: "kore", label: "Kore · female, firm" },
  { id: "fenrir", label: "Fenrir · male, excitable" },
  { id: "aoede", label: "Aoede · female, breezy" },
  { id: "leda", label: "Leda · female, youthful" },
  { id: "orus", label: "Orus · male, firm" },
  { id: "zephyr", label: "Zephyr · female, bright" },
];

// What switching engine starts an agent on.
const engineDefaults: Record<VoiceEngine, { model: string; voiceId: string; voiceName: string }> = {
  openai: { model: "gpt-realtime-2.1-mini", voiceId: "echo", voiceName: "Echo" },
  gemini: { model: "gemini-3.8-live", voiceId: "zephyr", voiceName: "Zephyr" },
};

// Every new voice agent starts on Google Gemini Live, Gemini 3.8 Live, Zephyr;
// also what the editor shows when an agent has nothing saved. Keep in step with
// the agents table defaults (whiskey migration 20261122000001) and the Go
// voicecall defaults.
const DEFAULT_ENGINE: VoiceEngine = "gemini";
const DEFAULT_REALTIME_MODEL = engineDefaults[DEFAULT_ENGINE].model;

// The voices the Realtime models speak.
const realtimeVoices: Option[] = [
  { id: "alloy", label: "Alloy · neutral" },
  { id: "ash", label: "Ash · male, deep" },
  { id: "ballad", label: "Ballad · neutral, warm" },
  { id: "coral", label: "Coral · female, bright" },
  { id: "echo", label: "Echo · male" },
  { id: "sage", label: "Sage · neutral, calm" },
  { id: "shimmer", label: "Shimmer · female" },
  { id: "verse", label: "Verse · male, expressive" },
  { id: "marin", label: "Marin · female, natural" },
  { id: "cedar", label: "Cedar · male, natural" },
];

// New voice agents start on Zephyr (Gemini); also shown when none is saved.
const DEFAULT_VOICE_ID = engineDefaults[DEFAULT_ENGINE].voiceId;
const DEFAULT_VOICE_NAME = engineDefaults[DEFAULT_ENGINE].voiceName;

// OpenAI's supported speech languages (Whisper / Realtime list) plus the
// regional variants and Bengali we already offered. "multi" = no language
// lock: the agent answers in whatever language the caller speaks. Keep the
// codes in step with languageNames in server/internal/whatsapplogin/manager.go.
const languages: Option[] = [
  { id: "multi", label: "Multilingual (auto-detect)" },
  { id: "af-ZA", label: "Afrikaans" },
  { id: "ar-SA", label: "Arabic" },
  { id: "hy-AM", label: "Armenian" },
  { id: "az-AZ", label: "Azerbaijani" },
  { id: "be-BY", label: "Belarusian" },
  { id: "bn-BD", label: "Bengali (Bangladesh)" },
  { id: "bs-BA", label: "Bosnian" },
  { id: "bg-BG", label: "Bulgarian" },
  { id: "ca-ES", label: "Catalan" },
  { id: "zh-CN", label: "Chinese (Simplified)" },
  { id: "zh-TW", label: "Chinese (Traditional)" },
  { id: "hr-HR", label: "Croatian" },
  { id: "cs-CZ", label: "Czech" },
  { id: "da-DK", label: "Danish" },
  { id: "nl-NL", label: "Dutch" },
  { id: "en-AU", label: "English (Australia)" },
  { id: "en-CA", label: "English (Canada)" },
  { id: "en-IN", label: "English (India)" },
  { id: "en-GB", label: "English (UK)" },
  { id: "en-US", label: "English (US)" },
  { id: "et-EE", label: "Estonian" },
  { id: "fil-PH", label: "Filipino (Tagalog)" },
  { id: "fi-FI", label: "Finnish" },
  { id: "fr-CA", label: "French (Canada)" },
  { id: "fr-FR", label: "French (France)" },
  { id: "gl-ES", label: "Galician" },
  { id: "de-DE", label: "German" },
  { id: "el-GR", label: "Greek" },
  { id: "he-IL", label: "Hebrew" },
  { id: "hi-IN", label: "Hindi" },
  { id: "hu-HU", label: "Hungarian" },
  { id: "is-IS", label: "Icelandic" },
  { id: "id-ID", label: "Indonesian" },
  { id: "it-IT", label: "Italian" },
  { id: "ja-JP", label: "Japanese" },
  { id: "kn-IN", label: "Kannada" },
  { id: "kk-KZ", label: "Kazakh" },
  { id: "ko-KR", label: "Korean" },
  { id: "lv-LV", label: "Latvian" },
  { id: "lt-LT", label: "Lithuanian" },
  { id: "mk-MK", label: "Macedonian" },
  { id: "ms-MY", label: "Malay" },
  { id: "mi-NZ", label: "Maori" },
  { id: "mr-IN", label: "Marathi" },
  { id: "ne-NP", label: "Nepali" },
  { id: "no-NO", label: "Norwegian" },
  { id: "fa-IR", label: "Persian" },
  { id: "pl-PL", label: "Polish" },
  { id: "pt-BR", label: "Portuguese (Brazil)" },
  { id: "pt-PT", label: "Portuguese (Portugal)" },
  { id: "ro-RO", label: "Romanian" },
  { id: "ru-RU", label: "Russian" },
  { id: "sr-RS", label: "Serbian" },
  { id: "sk-SK", label: "Slovak" },
  { id: "sl-SI", label: "Slovenian" },
  { id: "es-MX", label: "Spanish (Mexico)" },
  { id: "es-ES", label: "Spanish (Spain)" },
  { id: "es-US", label: "Spanish (US)" },
  { id: "sw-KE", label: "Swahili" },
  { id: "sv-SE", label: "Swedish" },
  { id: "ta-IN", label: "Tamil" },
  { id: "th-TH", label: "Thai" },
  { id: "tr-TR", label: "Turkish" },
  { id: "uk-UA", label: "Ukrainian" },
  { id: "ur-PK", label: "Urdu" },
  { id: "vi-VN", label: "Vietnamese" },
  { id: "cy-GB", label: "Welsh" },
];

const SYSTEM_PROMPT_MAX_CHARS = 8000;

function optionLabel(options: Option[], id: string | undefined | null): string {
  if (!id) return "";
  return options.find((option) => option.id === id)?.label ?? id;
}

// withCurrent keeps a stored value selectable even when it is not one of the
// listed options (an older agent, or one set through the API).
function withCurrent(options: Option[], current: string | undefined | null): Option[] {
  if (!current || options.some((option) => option.id === current)) return options;
  return [{ id: current, label: current }, ...options];
}

function iconPaths(name: IconName): ReactNode {
  switch (name) {
    case "agents":
      return (
        <>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21v-1a6 6 0 0112 0v1" />
          <path d="M19 8v4M21 10h-4" />
        </>
      );
    case "phone":
      return <path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3-8.6A2 2 0 014.1 2h3a2 2 0 012 1.7c.1.9.3 1.8.7 2.7a2 2 0 01-.5 2.1L8.1 9.9a16 16 0 006 6l1.4-1.2a2 2 0 012.1-.4c.9.3 1.8.6 2.7.7a2 2 0 011.7 2z" />;
    case "mic":
      return (
        <>
          <rect height="12" rx="3" width="6" x="9" y="2" />
          <path d="M5 10a7 7 0 0014 0M12 17v5M8 22h8" />
        </>
      );
    case "globe":
      return (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18" />
          <path d="M12 3a14 14 0 010 18M12 3a14 14 0 000 18" />
        </>
      );
    case "book":
      return (
        <>
          <path d="M4 4.5A2.5 2.5 0 016.5 2H20v15H6.5A2.5 2.5 0 004 19.5z" />
          <path d="M4 19.5A2.5 2.5 0 016.5 17H20v5H6.5A2.5 2.5 0 014 19.5z" />
        </>
      );
    case "wrench":
      return <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.8-3.8a6 6 0 01-7.9 7.9l-6.9 6.9a2.1 2.1 0 01-3-3l6.9-6.9a6 6 0 017.9-7.9l-3.8 3.8z" />;
    case "play":
      return (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M10.2 8.6l5.6 3.4-5.6 3.4z" />
        </>
      );
    case "plus":
      return <path d="M12 5v14M5 12h14" />;
    case "trash":
      return (
        <>
          <path d="M4 7h16" />
          <path d="M9 7V4h6v3" />
          <path d="M10 11v6M14 11v6" />
          <path d="M6 7l1 13a1 1 0 001 1h8a1 1 0 001-1l1-13" />
        </>
      );
    case "search":
      return (
        <>
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </>
      );
    case "chevron":
      return <path d="M6 9l6 6 6-6" />;
    case "check":
      return <path d="M5 12.5l4 4 10-10" />;
    case "back":
      return <path d="M15 18l-6-6 6-6" />;
    case "qr":
      return <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 14h2M14 18v2M18 18h2v2" />;
    case "refresh":
      return (
        <>
          <path d="M4 4v6h6" />
          <path d="M20 20v-6h-6" />
          <path d="M20 9a8 8 0 00-13.5-3L4 10M4 15a8 8 0 0013.5 3L20 14" />
        </>
      );
    case "x":
      return <path d="M6 6l12 12M18 6L6 18" />;
  }
}

function Icon({ name, size = 18, stroke = "currentColor", sw = 2 }: { name: IconName; size?: number; stroke?: string; sw?: number }) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      stroke={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={sw}
      viewBox="0 0 24 24"
      width={size}
    >
      {iconPaths(name)}
    </svg>
  );
}

const css = `${baseCss}
/* Retell-style agent list: title on the left, search and buttons on the right,
   then a full-width table with a shaded header row and a pager under it. */
.va-agent-browser { display: flex; flex-direction: column; height: 100%; margin: 0; max-width: none; min-height: 0; width: 100%; }
.va-list-head { align-items: center; display: flex; flex: 0 0 auto; gap: 16px; justify-content: space-between; margin-bottom: 16px; }
.va-list-title { font-size: 20px; font-weight: 600; letter-spacing: -.2px; line-height: 1.3; margin: 0; white-space: nowrap; }
.va-list-actions { align-items: center; display: flex; flex: 0 1 auto; gap: 8px; min-width: 0; }
.va-search-head { flex: 0 1 300px; margin: 0; max-width: none; min-width: 0; width: 300px; }
.va-search-head .va-input { border-radius: 8px; height: 36px; }
.va-list-actions .va-btn { border-radius: 8px; min-height: 36px; }
.va-table-wrap { flex: 1 1 auto; min-height: 0; overflow: auto; }
.va-table { border-collapse: separate; border-spacing: 0; font-size: 14px; width: 100%; }
.va-table thead th { background: var(--app-hover); color: var(--muted); font-weight: 500; padding: 14px 16px; position: sticky; text-align: left; top: 0; white-space: nowrap; z-index: 2; }
.va-table thead th:first-child { border-radius: 10px 0 0 10px; }
.va-table thead th:last-child { border-radius: 0 10px 10px 0; }
.va-table td { border-bottom: 1px solid var(--border); padding: 11px 16px; vertical-align: middle; }
.va-table-row { position: relative; }
.va-table-row:hover td, .va-table-row:has(.va-list-link:focus-visible) td { background: var(--panel-hover); }
.va-table-name { align-items: center; display: inline-flex; gap: 12px; max-width: 100%; min-width: 0; }
.va-table-icon { align-items: center; border: 1px solid var(--border); border-radius: 8px; color: var(--primary-light); display: inline-flex; flex: 0 0 auto; height: 32px; justify-content: center; width: 32px; }
.va-table .va-list-link { color: var(--text); font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.va-table .va-list-link::after { border-radius: 0; }
.va-table-muted { color: var(--muted); white-space: nowrap; }
.va-table-resources { align-items: center; display: inline-flex; gap: 10px; }
.va-col-actions { text-align: right; width: 56px; }
.va-table .va-list-delete { opacity: .6; }
.va-table-row:hover .va-list-delete, .va-table .va-list-delete:focus-visible { opacity: 1; }
.va-pager { align-items: center; display: flex; flex: 0 0 auto; gap: 10px; justify-content: center; padding: 14px 0 4px; }
.va-pager-btn { align-items: center; background: none; border: 0; border-radius: 6px; color: var(--muted); cursor: pointer; display: inline-flex; height: 28px; justify-content: center; width: 28px; }
.va-pager-btn:disabled { cursor: default; opacity: .35; }
.va-pager-btn:not(:disabled):hover { background: var(--app-hover); color: var(--text); }
.va-pager-btn svg { transform: rotate(-90deg); }
.va-pager-prev svg { transform: rotate(90deg); }
.va-pager-num { align-items: center; background: var(--app-hover-3); border-radius: 6px; display: inline-flex; font-size: 13px; font-weight: 600; height: 28px; justify-content: center; min-width: 28px; }
@media (max-width: 1100px) {
  .va-col-edited { display: none; }
}
.va-table-text { display: flex; flex-direction: column; min-width: 0; }
.va-table-sub { color: var(--muted); display: none; font-size: 12.5px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
@media (max-width: 900px) {
  .va-workspace { grid-template-columns: minmax(0, 1fr); }
  /* The agent list fills the screen between the top bar (58px) and the bottom
     tab bar (62px), so the pager sits at the foot of the screen, not right
     under the last row - same as the chat agents list. */
  .va-main:has(> .va-content > .va-workspace) { min-height: calc(100dvh - 120px - env(safe-area-inset-bottom)); }
  .va-content:has(> .va-workspace) { flex: 1 1 auto; }
  .va-workspace .va-agent-browser { flex: 1 1 auto; height: auto; }
  .va-workspace .va-table-wrap { flex: 0 0 auto; overflow: visible; }
  .va-workspace .va-pager { margin-top: auto; padding-top: 16px; }
}
@media (max-width: 640px) {
  .va-list-head { align-items: stretch; flex-direction: column; gap: 12px; }
  .va-list-actions { flex-wrap: wrap; width: 100%; }
  .va-search-head { flex: 1 1 100%; width: auto; }
  .va-list-actions .va-btn { flex: 1 1 0; justify-content: center; }
  /* Phones: each agent is its own card - name with its number underneath,
     then the status and delete - like the chat agents list. */
  .va-table thead { display: none; }
  .va-table, .va-table tbody { display: block; }
  .va-table tbody tr {
    align-items: center;
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: 14px;
    display: flex;
    gap: 10px;
    margin-bottom: 8px;
    padding: 12px;
    transition: background .15s ease, border-color .15s ease;
  }
  .va-table td { background: none !important; border: 0; display: block; flex: 0 0 auto; padding: 0; width: auto; }
  .va-table td:first-child { flex: 1 1 auto; min-width: 0; overflow: hidden; }
  .va-table td:first-child .va-table-name { display: flex; }
  .va-table td.va-col-voice, .va-table td.va-col-phone, .va-table td.va-col-resources, .va-table td.va-col-edited { display: none; }
  .va-table-row:hover { background: var(--panel-hover); border-color: var(--app-border-strong); }
  .va-table-row:has(.va-list-link:focus-visible) { border-color: var(--app-primary-ring-strong); box-shadow: 0 0 0 3px var(--app-primary-ring); }
  .va-table .va-list-link::after { border-radius: 14px; }
  .va-table-icon { border-radius: 10px; height: 38px; width: 38px; }
  .va-table .va-list-link { font-size: 15px; font-weight: 600; }
  .va-table-sub { display: block; }
  .va-table .va-list-delete { opacity: 1; }
}
@media (max-width: 480px) {
  .va-col-phone { display: none; }
}
/* The base styles shorten these labels on narrow phones; the new ones are already short. */
@media (max-width: 420px) {
  .va-list-head .va-btn .va-btn-label { display: inline; }
}
.va-seg { display: grid; gap: 6px; grid-template-columns: repeat(3, minmax(0, 1fr)); }
.va-seg-btn { background: var(--panel); border: 1px solid var(--app-border); border-radius: 10px; color: var(--muted); cursor: pointer; font-size: 12px; font-weight: 750; min-height: 34px; padding: 0 8px; }
.va-seg-btn:hover { color: var(--text); }
.va-seg-btn.is-on { background: var(--primary-soft); border-color: var(--app-primary-border); color: var(--app-primary-text); }
.va-number-code { color: var(--text); font-size: 26px; font-variant-numeric: tabular-nums; font-weight: 850; letter-spacing: 3px; text-align: center; }
.va-call-list { display: grid; gap: 8px; list-style: none; margin: 0; padding: 0; }
.va-call { background: var(--panel); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; }
.va-call-row { align-items: center; background: transparent; border: 0; color: var(--text); cursor: pointer; display: grid; gap: 10px; grid-template-columns: minmax(0, 1fr) auto auto 16px; padding: 10px 12px; text-align: left; width: 100%; }
.va-call-row:hover { background: var(--panel-hover); }
.va-call-peer { display: block; font-size: 13px; font-weight: 750; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.va-call-meta { display: block; color: var(--subtle); font-size: 11.5px; }
.va-call-when { color: var(--subtle); font-size: 11.5px; white-space: nowrap; }
.va-call.is-open .va-accordion-chevron { transform: rotate(180deg); }
.va-transcript { border-top: 1px solid var(--border); display: grid; gap: 8px; max-height: 360px; overflow-y: auto; padding: 12px; }
.va-line { border-radius: 10px; font-size: 12.5px; line-height: 1.5; max-width: 85%; padding: 7px 10px; white-space: pre-wrap; }
.va-line.is-agent { background: var(--primary-soft); justify-self: end; }
.va-line.is-user { background: var(--panel-hover); justify-self: start; }
.va-line-role { color: var(--subtle); display: block; font-size: 10.5px; font-weight: 800; letter-spacing: .4px; text-transform: uppercase; }
.va-call-form { align-items: end; display: grid; gap: 8px; grid-template-columns: minmax(0, 1fr) auto; margin-bottom: 14px; }
.va-pill-status { border-radius: 20px; font-size: 10.5px; font-weight: 800; letter-spacing: .2px; padding: 3px 8px; text-transform: uppercase; white-space: nowrap; }
.va-pill-status.is-ended, .va-pill-status.is-answered { background: var(--app-green-soft); color: var(--green); }
.va-pill-status.is-received { background: var(--app-amber-soft); color: var(--app-amber-text); }
.va-pill-status.is-failed, .va-pill-status.is-declined { background: var(--app-rose-soft); color: var(--app-rose-text); }
.va-test-call { flex: none; }
.va-test-call .va-call-form { margin-bottom: 0; }
.va-input.is-invalid { border-color: var(--app-rose-text); }
.va-test-hint { color: var(--faint); font-size: 11.5px; grid-column: 1 / -1; line-height: 1.45; }
.va-test-hint.is-valid { color: var(--green); font-weight: 700; }
.va-test-hint.is-invalid { color: var(--app-rose-text); }
.va-test-hint.is-unsure { color: var(--app-amber-text); }
.va-test-result { color: var(--text); font-size: 12.5px; margin: 10px 0 0; }
.va-test-result.is-error { color: var(--app-rose-text); }
.va-card-calls { display: flex; flex: 1 1 auto; flex-direction: column; min-height: 0; }
.va-card-calls > .va-calls-scroll { flex: 1 1 auto; min-height: 0; overflow-y: auto; }
@media (min-width: 1180px) {
  .va-card-calls { flex: 1 1 0; }
}
@media (max-width: 640px) {
  .va-seg { grid-template-columns: 1fr; }
  .va-call-form { grid-template-columns: 1fr; }
}
/* Voice minutes: a slim meter while minutes are left, the amber alert with the
   WhatsApp button once they are used up. */
.va-usage { align-items: center; display: flex; flex: 0 0 auto; flex-wrap: wrap; gap: 8px 16px; margin-bottom: 16px; padding: 12px 16px; }
.va-usage-label { color: var(--text); font-size: 13px; font-weight: 700; white-space: nowrap; }
.va-usage-bar { background: var(--app-hover-3); border-radius: 999px; flex: 1 1 160px; height: 6px; min-width: 120px; overflow: hidden; }
.va-usage-fill { background: var(--primary); border-radius: 999px; height: 100%; transition: width .3s ease; }
.va-usage.is-low .va-usage-fill { background: var(--app-amber); }
.va-usage-numbers { color: var(--muted); font-size: 12.5px; font-variant-numeric: tabular-nums; white-space: nowrap; }
.va-usage-numbers strong { color: var(--text); font-weight: 700; }
.va-usage.is-low .va-usage-numbers strong { color: var(--app-amber-text); }
.va-usage-alert { flex: 0 0 auto; margin-bottom: 16px; }
.va-test-minutes { color: var(--subtle); font-size: 11.5px; font-variant-numeric: tabular-nums; margin: 8px 0 0; }
`;

// formatMinutes shows seconds of talk time as m:ss (10:00, 4:05).
function formatMinutes(seconds: number): string {
  const total = Math.max(0, Math.floor(seconds));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

const VOICE_USAGE_KEY = "voice-usage";
const VOICE_USAGE_POLL_MS = 30_000;
// Under two minutes left the meter turns amber.
const VOICE_USAGE_LOW_SECONDS = 120;

// useVoiceUsage is the account's voice minutes, shared by every component on
// the page through the page cache. Only the page passes `poll`, so one timer
// keeps it fresh (every 30 s while the tab is visible); anyone can refresh.
function useVoiceUsage(getToken: AuthGetter, poll = false) {
  const [usage, setUsage] = useCachedState<ApiVoiceUsage | null>(VOICE_USAGE_KEY, null);
  const refresh = useCallback(async () => {
    try {
      setUsage(await getVoiceUsage(getToken));
    } catch {
      // Keep what we had; the next poll tries again.
    }
  }, [getToken, setUsage]);

  useEffect(() => {
    if (!poll) return;
    void refresh();
    const timer = setInterval(() => {
      if (document.visibilityState === "visible") void refresh();
    }, VOICE_USAGE_POLL_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [poll, refresh]);

  return { usage, refresh };
}

// VoiceMinutesUsedUpCard is the only notice once the minutes are gone: the
// agents stop answering and calling until more minutes are bought.
function VoiceMinutesUsedUpCard({ usage }: { usage: ApiVoiceUsage }) {
  const free = usage.limit_seconds <= 600;
  return (
    <div className="va-card va-runtime-alert va-limit-card va-usage-alert" role="alert">
      <span className="va-runtime-alert-icon">!</span>
      <div className="va-limit-card-text">
        <p className="va-runtime-alert-title">
          {free
            ? `You have used your ${Math.round(usage.limit_seconds / 60)} free voice minutes`
            : "You have used all your voice minutes"}
        </p>
        <p className="va-runtime-alert-copy">
          Your WhatsApp voice agents will not answer or make calls until you <strong>buy more minutes</strong>. To buy
          minutes, message us on WhatsApp at <strong className="notranslate">+880 1701-750469</strong> and we&apos;ll add
          them to your account.
        </p>
      </div>
      <a
        className="va-btn va-upgrade-whatsapp"
        href={VOICE_MINUTES_WHATSAPP_URL}
        rel="noopener noreferrer"
        target="_blank"
      >
        <WhatsAppGlyph size={16} />
        Buy minutes on WhatsApp
      </a>
    </div>
  );
}

// VoiceUsageCard shows how much of the account's call time is used. With
// `compact` it renders nothing until the minutes run out (the agent editor).
function VoiceUsageCard({ usage, compact = false }: { usage: ApiVoiceUsage | null; compact?: boolean }) {
  if (!usage) return null;
  if (usage.exhausted) return <VoiceMinutesUsedUpCard usage={usage} />;
  if (compact) return null;
  const limit = Math.max(usage.limit_seconds, 1);
  const percent = Math.min(100, Math.round((usage.used_seconds / limit) * 100));
  const low = usage.remaining_seconds <= VOICE_USAGE_LOW_SECONDS;
  return (
    <div className={`va-card va-usage${low ? " is-low" : ""}`}>
      <span className="va-usage-label">Voice minutes</span>
      <div
        aria-label="Voice minutes used"
        aria-valuemax={usage.limit_seconds}
        aria-valuemin={0}
        aria-valuenow={Math.min(usage.used_seconds, usage.limit_seconds)}
        aria-valuetext={`${formatMinutes(usage.used_seconds)} of ${formatMinutes(usage.limit_seconds)} minutes used`}
        className="va-usage-bar"
        role="progressbar"
      >
        <div className="va-usage-fill" style={{ width: `${percent}%` }} />
      </div>
      <span className="va-usage-numbers">
        {formatMinutes(usage.used_seconds)} of {formatMinutes(usage.limit_seconds)} used ·{" "}
        <strong>{formatMinutes(usage.remaining_seconds)} left</strong>
      </span>
    </div>
  );
}

const avatarColors = ["#52525b", "#3f3f46", "#63636b", "#4a4a52", "#5a5a63", "#44444c"];

function avatarColor(id: string): string {
  let total = 0;
  for (const char of id) total += char.charCodeAt(0);
  return avatarColors[total % avatarColors.length];
}

function agentName(agent: VoiceAgent): string {
  return agent.agent?.name?.trim() || "Untitled agent";
}

function isLive(agent: VoiceAgent): boolean {
  // Live means it can take calls: switched on AND holding a number. A stored
  // "active" with no number (the number was removed or never linked) is not.
  return agent.agent?.status === "active" && Boolean(agent.agent?.phone_number_id);
}

const LIST_PAGE_SIZE = 20;

// "11/21/2026 · 14:52" in the viewer's own time zone, as Retell's Edited column.
function formatEdited(value: string | undefined): string {
  const date = new Date(value ?? "");
  if (Number.isNaN(date.getTime())) return "-";
  const day = date.toLocaleDateString("en-US", { day: "2-digit", month: "2-digit", year: "numeric" });
  const time = date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  return `${day} · ${time}`;
}

function phoneNumberLabel(pn: ApiPhoneNumber): string {
  const number = pn.phone_number?.trim();
  const label = pn.label?.trim();
  if (label && number) return `${label} · ${number}`;
  return label || number || pn.wa_jid?.split("@")[0]?.split(":")[0] || "Unnamed number";
}

function voiceSummary(agent: VoiceAgent): string {
  const id = agent.voice?.openai?.voice_id;
  return id ? id.charAt(0).toUpperCase() + id.slice(1) : "Voice";
}

function brainSummary(agent: VoiceAgent): string {
  return optionLabel(allRealtimeModels, agent.voice?.openai?.realtime_model || DEFAULT_REALTIME_MODEL);
}

function nonEmpty(value: string | undefined | null): string | undefined {
  return value && value.trim() ? value : undefined;
}

// toPayload turns the editor's copy of an agent back into a PATCH body. Every
// section is sent so a save always carries the whole agent, but a value the
// table would refuse (an empty enum, a temperature of 0 that only means "not
// set") is left out instead, which keeps the stored one.
function toPayload(agent: VoiceAgent): AgentPayload {
  const openai = agent.voice?.openai;
  return {
    agent: {
      name: agentName(agent),
      language: nonEmpty(agent.agent?.language),
      timezone: agent.agent?.timezone ?? null,
      phone_number_id: agent.agent?.phone_number_id ?? null,
      status: nonEmpty(agent.agent?.status),
    },
    prompt: {
      begin_message_mode: nonEmpty(agent.prompt?.begin_message_mode),
      begin_message: agent.prompt?.begin_message ?? "",
      begin_message_delay_ms: agent.prompt?.begin_message_delay_ms ?? 0,
      system_prompt: agent.prompt?.system_prompt ?? "",
    },
    voice: {
      openai: {
        voice_id: nonEmpty(openai?.voice_id),
        voice_name: nonEmpty(openai?.voice_name),
        realtime_model: nonEmpty(openai?.realtime_model),
        ...(typeof openai?.speed === "number" && openai.speed >= 0.25 ? { speed: openai.speed } : {}),
        ...(typeof openai?.volume === "number" ? { volume: openai.volume } : {}),
      },
    },
    knowledge_base: { knowledge_base_ids: [...(agent.knowledge_base?.knowledge_base_ids ?? [])] },
    tools: { tool_ids: [...(agent.tools?.tool_ids ?? [])] },
  };
}

type Patch = (patch: (agent: VoiceAgent) => VoiceAgent) => void;

// The list lives at /dashboard/voice/agents and each agent on its own page at
// /dashboard/voice/agents/<agentId>; both are this component.
export default function VoiceAgentsPage({ agentId = "" }: { agentId?: string }) {
  const router = useRouter();
  const { user, isLoaded: isUserLoaded, isSignedIn: isUserSignedIn } = useUser();
  const { getToken, isLoaded: isAuthLoaded, isSignedIn: isAuthSignedIn } = useAuth();

  const [agents, setAgents, hasCachedAgents] = useCachedState<VoiceAgent[]>("voice-agents", []);
  const [phoneNumbers, setPhoneNumbers] = useCachedState<ApiPhoneNumber[]>("voice-phone-numbers", []);
  const [knowledgeBases, setKnowledgeBases] = useCachedState<ApiKnowledgeBase[]>("voice-knowledge-bases", []);
  const [tools, setTools] = useCachedState<ApiTool[]>("voice-tools", []);
  const [editorTab, setEditorTab] = useCachedState<EditorTab>(`voice-editor-tab:${agentId}`, "agent");
  const isDesktop = useIsDesktop();
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const showSkeleton = isLoading && !hasCachedAgents;
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState<{ kind: "success" | "error"; text: string } | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const closeCreate = useCallback(() => setCreateOpen(false), []);
  const [deleteTargetId, setDeleteTargetId] = useState("");
  const deleteTarget = agents.find((agent) => agent.id === deleteTargetId) ?? null;
  const [isDeleting, setIsDeleting] = useState(false);

  // Debounced saves, one chain per agent so two PATCHes of the same agent never
  // overlap, and an edit revision so a late answer never overwrites newer typing.
  const saveTimers = useRef<Map<string, { timer: ReturnType<typeof setTimeout>; run: () => void }>>(new Map());
  const saveChains = useRef<Map<string, Promise<void>>>(new Map());
  const saveTickets = useRef<Map<string, number>>(new Map());
  const editRevisions = useRef<Map<string, number>>(new Map());

  const isAuthenticated = Boolean(isUserLoaded && isAuthLoaded && isUserSignedIn && isAuthSignedIn && user);
  const { usage: voiceUsage } = useVoiceUsage(getToken, isAuthenticated);

  const reloadAgents = useCallback(async () => {
    const list = await listVoiceAgents(getToken);
    setAgents(list);
    return list;
  }, [getToken, setAgents]);

  const reloadNumbers = useCallback(async () => {
    const list = await listVoicePhoneNumbers(getToken);
    setPhoneNumbers(list);
    return list;
  }, [getToken, setPhoneNumbers]);

  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;
    listVoiceAgents(getToken)
      .then((list) => {
        if (cancelled) return;
        setAgents(list);
        setLoadError("");
      })
      .catch((error) => {
        if (cancelled) return;
        setLoadError(error instanceof Error ? error.message : "Could not load WhatsApp voice agents");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    listVoicePhoneNumbers(getToken)
      .then((list) => !cancelled && setPhoneNumbers(list))
      .catch(() => undefined);
    listVoiceKnowledgeBases(getToken)
      .then((list) => !cancelled && setKnowledgeBases(list))
      .catch(() => undefined);
    listVoiceTools(getToken)
      .then((list) => !cancelled && setTools(list))
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [agentId, getToken, isAuthenticated, setAgents, setKnowledgeBases, setPhoneNumbers, setTools]);

  // Leaving the page sends an edit still waiting out its debounce.
  useEffect(() => {
    const pending = saveTimers.current;
    return () => {
      for (const { timer, run } of [...pending.values()]) {
        clearTimeout(timer);
        run();
      }
    };
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 4000);
    return () => clearTimeout(timer);
  }, [notice]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return agents;
    return agents.filter((agent) => agentName(agent).toLowerCase().includes(normalized));
  }, [agents, query]);

  // The list is a table of LIST_PAGE_SIZE rows a page, like Retell's.
  const [listPage, setListPage] = useState(0);
  const listPageCount = Math.max(1, Math.ceil(filtered.length / LIST_PAGE_SIZE));
  const currentListPage = Math.min(listPage, listPageCount - 1);
  const pagedAgents = filtered.slice(currentListPage * LIST_PAGE_SIZE, (currentListPage + 1) * LIST_PAGE_SIZE);

  const selected = useMemo(
    () => (agentId ? agents.find((agent) => agent.id === agentId) ?? null : null),
    [agents, agentId]
  );

  const queueSave = useCallback(
    (agent: VoiceAgent, delay = 500) => {
      const previous = saveTimers.current.get(agent.id);
      if (previous) clearTimeout(previous.timer);
      const revision = editRevisions.current.get(agent.id) ?? 0;
      const send = async () => {
        try {
          const saved = await updateVoiceAgent(agent.id, toPayload(agent), getToken);
          if (agent.agent?.status === "active" && saved.agent?.status !== "active") {
            setNotice({ kind: "error", text: "The server kept this agent paused." });
          }
          if ((editRevisions.current.get(agent.id) ?? 0) !== revision) return;
          setAgents((current) => current.map((item) => (item.id === saved.id ? saved : item)));
        } catch (error) {
          setNotice({ kind: "error", text: error instanceof Error ? error.message : "Could not save WhatsApp voice agent" });
        }
      };
      const run = async () => {
        saveTimers.current.delete(agent.id);
        const ticket = (saveTickets.current.get(agent.id) ?? 0) + 1;
        saveTickets.current.set(agent.id, ticket);
        const prior = saveChains.current.get(agent.id) ?? Promise.resolve();
        const chain = prior.then(() => (saveTickets.current.get(agent.id) === ticket ? send() : undefined));
        saveChains.current.set(agent.id, chain);
        await chain;
        if (saveChains.current.get(agent.id) === chain) saveChains.current.delete(agent.id);
      };
      saveTimers.current.set(agent.id, { timer: setTimeout(run, delay), run });
    },
    [getToken, setAgents]
  );

  const patchSelected = useCallback<Patch>(
    (patch) => {
      if (!selected) return;
      const updated = { ...patch(selected), updated_at: new Date().toISOString() };
      editRevisions.current.set(selected.id, (editRevisions.current.get(selected.id) ?? 0) + 1);
      setAgents((current) => current.map((agent) => (agent.id === selected.id ? updated : agent)));
      // Switches and pickers save at once; typing waits for a pause.
      const typed =
        updated.prompt?.system_prompt !== selected.prompt?.system_prompt ||
        updated.prompt?.begin_message !== selected.prompt?.begin_message;
      queueSave(updated, typed ? 600 : 0);
    },
    [queueSave, selected, setAgents]
  );

  // A number linked from the editor is handed to the agent (and the agent made
  // live) by the server, but only once WhatsApp's follow-up connection lands —
  // measured at 13s after the login read "connected" (2026-11-21). So the lists
  // are read again until the agent shows its number, for up to a minute.
  //
  // If the server still hasn't, the page hands over the number itself. The
  // login's own id can't find it: a number linked before is relinked onto its
  // existing row, which has a different id. So the number is the one the scan
  // just connected — same WhatsApp account, or else the only connected number
  // no agent holds that connected in the last few minutes.
  const patchSelectedRef = useRef(patchSelected);
  useEffect(() => {
    patchSelectedRef.current = patchSelected;
  }, [patchSelected]);
  const onNumberLinked = useCallback(
    async (agentId: string, linked: ApiPhoneNumber | null) => {
      const linkedAt = Date.now();
      const account = (jid: string | null | undefined) => (jid ? jid.split("@")[0].split(":")[0] : "");
      const sameAccount = (pn: ApiPhoneNumber) =>
        Boolean(linked) &&
        (pn.id === linked?.id ||
          (Boolean(account(linked?.wa_jid)) && account(pn.wa_jid) === account(linked?.wa_jid)) ||
          (Boolean(linked?.phone_number) && pn.phone_number === linked?.phone_number));
      const justConnected = (pn: ApiPhoneNumber) => {
        const at = Date.parse(pn.last_connected_at || pn.updated_at || "");
        return Number.isFinite(at) && at >= linkedAt - 3 * 60_000;
      };

      for (let attempt = 0; attempt < 60; attempt += 1) {
        try {
          const [numbers, list] = await Promise.all([reloadNumbers(), reloadAgents()]);
          if (list.find((item) => item.id === agentId)?.agent?.phone_number_id) {
            setNotice({ kind: "success", text: "Number linked. This agent is live." });
            return;
          }
          const held = new Set(list.map((item) => item.agent?.phone_number_id).filter(Boolean));
          const free = numbers.filter((pn) => pn.status === "connected" && !held.has(pn.id));
          const fresh = free.filter(justConnected);
          const exact = free.find(sameAccount);
          const match = exact ?? (fresh.length === 1 ? fresh[0] : undefined);
          // Like the chat agent page, the page hands the number over itself the
          // moment the scan connects, instead of waiting ~13s for the server to
          // (the server still does it too; whichever lands first wins). A
          // number found only as "the one that just connected" waits a few
          // rounds first, in case the login's own row is still being written.
          if (match && (exact || attempt >= 3)) {
            patchSelectedRef.current((current) =>
              current.id === agentId
                ? { ...current, agent: { ...current.agent, phone_number_id: match.id, status: "active" } }
                : current
            );
            setNotice({ kind: "success", text: "Number linked. This agent is live." });
            return;
          }
        } catch {
          // A failed read is tried again on the next round.
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      setNotice({
        kind: "error",
        text: "The number connected, but it could not be linked. Pick it under Or use a linked number.",
      });
    },
    [reloadAgents, reloadNumbers]
  );

  const deleteAgent = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteVoiceAgent(deleteTarget.id, getToken);
      setAgents((current) => current.filter((agent) => agent.id !== deleteTarget.id));
      setDeleteTargetId("");
      setNotice({ kind: "success", text: "WhatsApp voice agent deleted." });
      if (agentId === deleteTarget.id) router.push("/dashboard/voice/agents");
    } catch (error) {
      setNotice({ kind: "error", text: error instanceof Error ? error.message : "Could not delete WhatsApp voice agent" });
    } finally {
      setIsDeleting(false);
    }
  };

  // Creating an agent starts with its number, as on the chat agents page: once
  // one is linked (or picked) the agent is made on it, live, and opened. A number
  // an agent already holds (a rescan of it) opens that agent instead. Names are
  // unique per account, so the default is the first one free.
  const createForNumber = useCallback(
    async (phoneNumberId: string) => {
      const list = await listVoiceAgents(getToken);
      let agent = list.find((item) => item.agent?.phone_number_id === phoneNumberId);
      if (!agent) {
        const taken = new Set(list.map((item) => item.agent?.name?.trim()));
        let index = list.length + 1;
        while (taken.has(`WhatsApp voice agent ${index}`)) index += 1;
        agent = await createVoiceAgent(
          {
            agent: {
              name: `WhatsApp voice agent ${index}`,
              phone_number_id: phoneNumberId,
              status: "active",
              language: "multi",
            },
            prompt: {
              system_prompt: "You are a friendly phone assistant. Keep every reply short and natural to say out loud.",
              begin_message_mode: DEFAULT_BEGIN_MODE,
            },
            voice: {
              openai: { voice_id: DEFAULT_VOICE_ID, voice_name: DEFAULT_VOICE_NAME, realtime_model: DEFAULT_REALTIME_MODEL },
            },
          },
          getToken
        );
        list.unshift(agent);
      }
      setAgents(list);
      setCreateOpen(false);
      router.push(`/dashboard/voice/agents/${agent.id}`);
    },
    [getToken, router, setAgents]
  );

  return (
    <div className="va-shell app-accent-green">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <DashboardSidebar activeLabel="WhatsApp Voice Agents" stackBelow={900} />

      <main className="va-main">
        <div className="va-content">
          {agentId ? (
            <section aria-label="WhatsApp voice agent" className="va-agent-page">
              {selected ? (
                <>
                  <AgentHeader
                    agent={selected}
                    onDelete={() => setDeleteTargetId(selected.id)}
                    onPatch={patchSelected}
                    tabs={
                      isDesktop && selected.agent?.phone_number_id ? (
                        <EditorTabs isDesktop onSelect={setEditorTab} tab={editorTab} />
                      ) : null
                    }
                  />
                  <VoiceUsageCard compact usage={voiceUsage} />
                  {!selected.agent?.phone_number_id ? (
                    // No number yet: the page is only the way to connect one.
                    // The prompt and settings open once a number is linked.
                    <div className="va-connect-page">
                      <div className="va-connect-inner">
                        <div className="va-connect-head">
                          <h2 className="va-connect-title">Connect your WhatsApp number</h2>
                          <p className="va-connect-copy">
                            Link the number this agent will call and answer on. Its prompt and settings open as soon
                            as it connects.
                          </p>
                        </div>
                        <NumberSetup
                          agentId={selected.id}
                          getToken={getToken}
                          key={`connect-${selected.id}`}
                          onLinked={onNumberLinked}
                          onUseNumber={(id) =>
                            patchSelected((current) => ({
                              ...current,
                              agent: { ...current.agent, phone_number_id: id, status: "active" },
                            }))
                          }
                          phoneNumbers={phoneNumbers}
                        />
                      </div>
                    </div>
                  ) : (
                  <div className="va-agent-expanded-grid">
                    <Editor
                      agent={selected}
                      getToken={getToken}
                      knowledgeBases={knowledgeBases}
                      onKnowledgeBaseAdded={(kb) => setKnowledgeBases((current) => [kb, ...current])}
                      onNumberLinked={onNumberLinked}
                      onPatch={patchSelected}
                      onSelectTab={setEditorTab}
                      phoneNumbers={phoneNumbers}
                      tab={editorTab}
                      tools={tools}
                    />
                  </div>
                  )}
                </>
              ) : (
                <div className="va-agent-page-empty">
                  {isLoading ? (
                    <span aria-busy="true">Loading WhatsApp voice agent...</span>
                  ) : (
                    <>
                      <span>{loadError || "This WhatsApp voice agent does not exist or was deleted."}</span>
                      <Link className="va-btn va-btn-secondary va-btn-sm" href="/dashboard/voice/agents">
                        Back to WhatsApp voice agents
                      </Link>
                    </>
                  )}
                </div>
              )}
            </section>
          ) : (
            <section aria-label="WhatsApp voice agents workspace" className="va-workspace">
              <div className="va-agent-browser">
                <div className="va-list-head">
                  <h1 className="va-list-title">All Agents</h1>
                  <div className="va-list-actions">
                    <div className="va-search va-search-head">
                      <span className="va-search-icon">
                        <Icon name="search" size={14} sw={2.2} />
                      </span>
                      <input
                        aria-label="Search agents"
                        className="va-input"
                        onChange={(event) => {
                          setQuery(event.target.value);
                          setListPage(0);
                        }}
                        placeholder="Search agents"
                        value={query}
                      />
                    </div>
                    <a
                      aria-label="Trouble connecting? Chat with us on WhatsApp"
                      className="va-btn va-btn-secondary va-btn-sm"
                      href={SUPPORT_WHATSAPP_URL}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <WhatsAppGlyph size={14} />
                      <span className="va-btn-label">Need help?</span>
                    </a>
                    <button
                      aria-label="New WhatsApp voice agent"
                      className="va-btn va-btn-primary va-btn-sm"
                      onClick={() => setCreateOpen(true)}
                      type="button"
                    >
                      <Icon name="plus" size={14} stroke="#fff" sw={2.4} />
                      <span className="va-btn-label">Create</span>
                    </button>
                  </div>
                </div>

                <VoiceUsageCard compact usage={voiceUsage} />

                <div className="va-table-wrap">
                  <table aria-busy={showSkeleton || undefined} className="va-table">
                    <thead>
                      <tr>
                        <th scope="col">Agent Name</th>
                        <th scope="col">Status</th>
                        <th className="va-col-voice" scope="col">Voice</th>
                        <th className="va-col-phone" scope="col">Phone</th>
                        <th className="va-col-resources" scope="col">Knowledge &amp; Tools</th>
                        <th className="va-col-edited" scope="col">Edited</th>
                        <th aria-label="Actions" className="va-col-actions" scope="col" />
                      </tr>
                    </thead>
                    <tbody>
                      {showSkeleton
                        ? [0, 1, 2].map((row) => (
                            <tr aria-hidden="true" key={row}>
                              <td><span className="va-skel" style={{ width: 180 }} /></td>
                              <td><span className="va-skel" style={{ width: 56 }} /></td>
                              <td className="va-col-voice"><span className="va-skel" style={{ width: 70 }} /></td>
                              <td className="va-col-phone"><span className="va-skel" style={{ width: 120 }} /></td>
                              <td className="va-col-resources"><span className="va-skel" style={{ width: 96 }} /></td>
                              <td className="va-col-edited"><span className="va-skel" style={{ width: 110 }} /></td>
                              <td className="va-col-actions" />
                            </tr>
                          ))
                        : pagedAgents.map((agent) => {
                            const phone = phoneNumbers.find((item) => item.id === agent.agent?.phone_number_id);
                            const knowledgeCount = agent.knowledge_base?.knowledge_base_ids?.length ?? 0;
                            const toolCount = agent.tools?.tool_ids?.length ?? 0;
                            return (
                              <tr className="va-table-row" key={agent.id}>
                                <td>
                                  <span className="va-table-name">
                                    <span className="va-table-icon">
                                      <Icon name="mic" size={15} />
                                    </span>
                                    <span className="va-table-text">
                                      <Link className="va-list-link" href={`/dashboard/voice/agents/${agent.id}`}>
                                        {agentName(agent)}
                                      </Link>
                                      <span className="va-table-sub">
                                        {phone ? phoneNumberLabel(phone) : agent.agent?.phone_number_id ? "Linked number" : "No number linked"}
                                      </span>
                                    </span>
                                  </span>
                                </td>
                                <td><StatusPill agent={agent} /></td>
                                <td className="va-col-voice va-table-muted">{voiceSummary(agent)}</td>
                                <td className="va-col-phone va-table-muted">
                                  {phone ? phoneNumberLabel(phone) : agent.agent?.phone_number_id ? "Linked number" : "-"}
                                </td>
                                <td className="va-col-resources va-table-muted">
                                  <span className="va-table-resources">
                                    <span>{knowledgeCount} KB</span>
                                    <span>{toolCount} tools</span>
                                  </span>
                                </td>
                                <td className="va-col-edited va-table-muted">{formatEdited(agent.updated_at)}</td>
                                <td className="va-col-actions">
                                  <button
                                    aria-label={`Delete ${agentName(agent)}`}
                                    className="va-icon-btn va-list-delete"
                                    onClick={() => setDeleteTargetId(agent.id)}
                                    title="Delete agent"
                                    type="button"
                                  >
                                    <Icon name="trash" size={15} sw={2.2} />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                    </tbody>
                  </table>
                  {!showSkeleton && agents.length === 0 ? (
                    <div className="va-empty-list va-empty-start">
                      <span>{loadError || "No WhatsApp voice agents yet."}</span>
                      <button className="va-btn va-btn-primary" onClick={() => setCreateOpen(true)} type="button">
                        <Icon name="plus" size={14} stroke="#fff" sw={2.4} />
                        New WhatsApp voice agent
                      </button>
                    </div>
                  ) : !showSkeleton && filtered.length === 0 ? (
                    <div className="va-empty-list">No agent matches that search.</div>
                  ) : null}
                </div>

                {!showSkeleton && filtered.length > 0 ? (
                  <nav aria-label="Agent pages" className="va-pager">
                    <button
                      aria-label="Previous page"
                      className="va-pager-btn va-pager-prev"
                      disabled={currentListPage === 0}
                      onClick={() => setListPage(currentListPage - 1)}
                      type="button"
                    >
                      <Icon name="chevron" size={15} sw={2.2} />
                    </button>
                    <span aria-current="page" className="va-pager-num">{currentListPage + 1}</span>
                    <button
                      aria-label="Next page"
                      className="va-pager-btn"
                      disabled={currentListPage >= listPageCount - 1}
                      onClick={() => setListPage(currentListPage + 1)}
                      type="button"
                    >
                      <Icon name="chevron" size={15} sw={2.2} />
                    </button>
                  </nav>
                ) : null}
              </div>
            </section>
          )}
        </div>
      </main>

      {deleteTarget ? (
        <div
          className="va-confirm-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !isDeleting) setDeleteTargetId("");
          }}
        >
          <div aria-labelledby="va-delete-title" aria-modal="true" className="va-confirm" role="alertdialog">
            <div className="va-confirm-icon">
              <Icon name="trash" size={18} sw={2.2} />
            </div>
            <h2 className="va-confirm-title" id="va-delete-title">
              Delete WhatsApp voice agent
            </h2>
            <p className="va-confirm-copy">
              <strong>{agentName(deleteTarget)}</strong> will be deleted and will stop taking and placing calls. This
              cannot be undone.
            </p>
            <div className="va-confirm-actions">
              <button
                autoFocus
                className="va-btn va-btn-secondary"
                disabled={isDeleting}
                onClick={() => setDeleteTargetId("")}
                type="button"
              >
                Cancel
              </button>
              <button className="va-btn va-confirm-danger" disabled={isDeleting} onClick={() => void deleteAgent()} type="button">
                {isDeleting ? "Deleting…" : "Delete agent"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {createOpen ? (
        <CreateVoiceAgentModal
          agents={agents}
          getToken={getToken}
          onCancel={closeCreate}
          onCreate={createForNumber}
          phoneNumbers={phoneNumbers}
        />
      ) : null}

      {notice ? (
        <div className={`va-toast ${notice.kind === "error" ? "va-toast-error" : "va-toast-success"}`} role="status">
          {notice.text}
        </div>
      ) : null}
    </div>
  );
}

// "Create" opens this: the WhatsApp number is linked first, by QR code or pairing
// code, and the agent is created on it the moment it connects.
function CreateVoiceAgentModal({
  agents,
  getToken,
  onCancel,
  onCreate,
  phoneNumbers,
}: {
  agents: VoiceAgent[];
  getToken: AuthGetter;
  onCancel: () => void;
  onCreate: (phoneNumberId: string) => Promise<void>;
  phoneNumbers: ApiPhoneNumber[];
}) {
  // The number the agent is being made on; kept after a failure to try again.
  const [numberId, setNumberId] = useState("");
  const [error, setError] = useState("");
  const busy = useRef(false);
  const isCreating = Boolean(numberId) && !error;
  const held = new Set(agents.map((agent) => agent.agent?.phone_number_id).filter(Boolean));
  const freeNumbers = phoneNumbers.filter((pn) => !held.has(pn.id));

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isCreating) onCancel();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isCreating, onCancel]);

  const create = useCallback(
    async (phoneNumberId: string) => {
      if (busy.current) return;
      busy.current = true;
      setNumberId(phoneNumberId);
      setError("");
      try {
        await onCreate(phoneNumberId);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not create WhatsApp voice agent");
      } finally {
        busy.current = false;
      }
    },
    [onCreate]
  );
  const onLinked = useCallback((_agentId: string, linked: ApiPhoneNumber) => create(linked.id), [create]);

  return (
    // A stray click must not end a login someone is halfway through on their
    // phone, so the backdrop doesn't close this.
    <div className="va-modal-backdrop">
      <div aria-labelledby="va-create-title" aria-modal="true" className="va-modal-card is-pairing" role="dialog">
        <div className="va-modal-head">
          <div>
            <h2 className="va-modal-title" id="va-create-title">
              Connect your WhatsApp
            </h2>
            <div className="va-modal-subtitle">
              Scan the QR code or use a pairing code to link the number your agent will call and answer on. Your agent
              is ready the moment it connects.
            </div>
          </div>
          <button aria-label="Close" className="va-icon-btn" disabled={isCreating} onClick={onCancel} type="button">
            <Icon name="x" size={15} sw={2.4} />
          </button>
        </div>
        <div className="va-modal-body">
          {error ? <div className="va-modal-error">{error}</div> : null}
          {numberId ? (
            <div className="va-number-status" role="status">
              {error ? "Your number is linked, but the agent could not be created." : "Number connected. Creating your agent…"}
            </div>
          ) : (
            <NumberSetup
              agentId=""
              getToken={getToken}
              onLinked={onLinked}
              onUseNumber={(id) => void create(id)}
              phoneNumbers={freeNumbers}
            />
          )}
        </div>
        <div className="va-modal-footer">
          <button className="va-btn va-btn-secondary" disabled={isCreating} onClick={onCancel} type="button">
            Cancel
          </button>
          {error ? (
            <button className="va-btn va-btn-primary" onClick={() => void create(numberId)} type="button">
              Try again
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function AgentHeader({
  agent,
  onDelete,
  onPatch,
  tabs,
}: {
  agent: VoiceAgent;
  onDelete: () => void;
  onPatch: Patch;
  tabs: ReactNode;
}) {
  const live = isLive(agent);
  // Going live needs a number to call from; pausing never does. The server
  // enforces the same rule.
  const activationBlocked = !live && !agent.agent?.phone_number_id;
  const [rename, setRename] = useState<{ agentId: string; name: string } | null>(null);
  const draftName = rename?.agentId === agent.id ? rename.name : null;
  const cancelledRename = useRef(false);
  const setDraftName = (name: string | null) => setRename(name === null ? null : { agentId: agent.id, name });

  const commitName = () => {
    const next = (draftName ?? "").trim();
    setDraftName(null);
    if (!next || next === agent.agent?.name) return;
    onPatch((current) => ({ ...current, agent: { ...current.agent, name: next } }));
  };

  return (
    <div className="va-agent-expanded-topline">
      <Link aria-label="Back to WhatsApp voice agents" className="va-agent-back" href="/dashboard/voice/agents">
        <Icon name="back" size={16} sw={2.4} />
      </Link>
      <div className="va-detail-head">
        <div className="va-identity">
          <span className="va-avatar va-avatar-lg" style={{ background: avatarColor(agent.id) }}>
            {agentName(agent).slice(0, 1).toUpperCase()}
          </span>
          <div style={{ minWidth: 0 }}>
            <div className="va-heading-row">
              <h2 className="va-heading">
                {draftName === null ? (
                  <button
                    className="va-heading-edit"
                    onClick={() => setDraftName(agentName(agent))}
                    title="Rename agent"
                    type="button"
                  >
                    {agentName(agent)}
                  </button>
                ) : (
                  <input
                    aria-label="Agent name"
                    autoFocus
                    className="va-heading-edit va-heading-input"
                    maxLength={80}
                    onBlur={() => {
                      if (cancelledRename.current) {
                        cancelledRename.current = false;
                        setDraftName(null);
                        return;
                      }
                      commitName();
                    }}
                    onChange={(event) => setDraftName(event.target.value)}
                    onFocus={(event) => event.target.select()}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        event.currentTarget.blur();
                      } else if (event.key === "Escape") {
                        cancelledRename.current = true;
                        event.currentTarget.blur();
                      }
                    }}
                    value={draftName}
                  />
                )}
              </h2>
              <span className="va-tag">WhatsApp Voice Agent</span>
              <StatusPill agent={agent} />
            </div>
          </div>
        </div>
        {tabs}
        <div className="va-editor-actions">
          <button
            className="va-btn va-btn-secondary"
            disabled={activationBlocked}
            onClick={() =>
              onPatch((current) => ({
                ...current,
                agent: { ...current.agent, status: isLive(current) ? "inactive" : "active" },
              }))
            }
            title={activationBlocked ? "Link a phone number before activating this WhatsApp voice agent" : undefined}
            type="button"
          >
            <Icon name="play" size={16} sw={2.2} />
            {live ? "Pause" : "Activate"}
          </button>
          <button className="va-btn va-btn-danger" onClick={onDelete} type="button">
            <Icon name="trash" size={15} sw={2.2} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function shownEditorTab(tab: EditorTab, isDesktop: boolean): EditorTab {
  return isDesktop && tab === "configuration" ? "agent" : tab;
}

function EditorTabs({ isDesktop, onSelect, tab }: { isDesktop: boolean; onSelect: (tab: EditorTab) => void; tab: EditorTab }) {
  const shownTab = shownEditorTab(tab, isDesktop);
  return (
    <div className="va-tabs" role="tablist">
      {editorTabs
        .filter((entry) => !(isDesktop && entry.id === "configuration"))
        .map((entry) => (
          <button
            aria-selected={shownTab === entry.id}
            className={`va-tab${shownTab === entry.id ? " is-active" : ""}`}
            key={entry.id}
            onClick={() => onSelect(entry.id)}
            role="tab"
            type="button"
          >
            {entry.label}
          </button>
        ))}
    </div>
  );
}

function Editor({
  agent,
  getToken,
  knowledgeBases,
  onKnowledgeBaseAdded,
  onNumberLinked,
  onPatch,
  onSelectTab,
  phoneNumbers,
  tab,
  tools,
}: {
  agent: VoiceAgent;
  getToken: AuthGetter;
  knowledgeBases: ApiKnowledgeBase[];
  onKnowledgeBaseAdded: (kb: ApiKnowledgeBase) => void;
  onNumberLinked: (agentId: string, linked: ApiPhoneNumber | null) => Promise<void>;
  onPatch: Patch;
  onSelectTab: (tab: EditorTab) => void;
  phoneNumbers: ApiPhoneNumber[];
  tab: EditorTab;
  tools: ApiTool[];
}) {
  const isDesktop = useIsDesktop();
  const shownTab = shownEditorTab(tab, isDesktop);
  const hasNumber = Boolean(agent.agent?.phone_number_id);

  const numberSetup = (
    <NumberSetup
      agentId={agent.id}
      getToken={getToken}
      key={`setup-${agent.id}`}
      onLinked={onNumberLinked}
      onUseNumber={(id) =>
        onPatch((current) => ({ ...current, agent: { ...current.agent, phone_number_id: id, status: "active" } }))
      }
      phoneNumbers={phoneNumbers}
    />
  );

  const promptCard = (className: string) => (
    <div className={`va-card ${className}`}>
      <div className="va-card-head">
        <h3 className="va-card-title">System Prompt</h3>
        <PromptCounter value={agent.prompt?.system_prompt ?? ""} />
      </div>
      <textarea
        aria-label="System prompt"
        className="va-textarea"
        maxLength={SYSTEM_PROMPT_MAX_CHARS}
        onChange={(event) =>
          onPatch((current) => ({ ...current, prompt: { ...current.prompt, system_prompt: event.target.value } }))
        }
        placeholder="Who the agent is, what it knows, and how it should talk on the phone."
        style={{ minHeight: 185 }}
        value={agent.prompt?.system_prompt ?? ""}
      />
    </div>
  );

  return (
    <div className="va-editor">
      {isDesktop ? null : <EditorTabs isDesktop={false} onSelect={onSelectTab} tab={tab} />}

      {shownTab === "calls" ? (
        <CallsCard agent={agent} getToken={getToken} key={`calls-${agent.id}`} />
      ) : isDesktop ? (
        <div className="va-editor-columns">
          <div className="va-editor-main">
            {promptCard("va-prompt-card")}
            <TestCallCard agent={agent} getToken={getToken} key={`test-${agent.id}`} />
          </div>
          <ConfigPanel
            agent={agent}
            getToken={getToken}
            knowledgeBases={knowledgeBases}
            numberSetup={hasNumber ? null : numberSetup}
            onKnowledgeBaseAdded={onKnowledgeBaseAdded}
            onPatch={onPatch}
            phoneNumbers={phoneNumbers}
            rail
            tools={tools}
          />
        </div>
      ) : shownTab === "configuration" ? (
        <ConfigPanel
          agent={agent}
          getToken={getToken}
          knowledgeBases={knowledgeBases}
          numberSetup={null}
          onKnowledgeBaseAdded={onKnowledgeBaseAdded}
          onPatch={onPatch}
          phoneNumbers={phoneNumbers}
          tools={tools}
        />
      ) : (
        <>
          {hasNumber ? null : <div className="va-card va-number-setup">{numberSetup}</div>}
          {promptCard("va-card-grow")}
          <TestCallCard agent={agent} getToken={getToken} key={`test-${agent.id}`} />
        </>
      )}
    </div>
  );
}

function PromptCounter({ value }: { value: string }) {
  const count = Array.from(value).length;
  const state = count > SYSTEM_PROMPT_MAX_CHARS ? "over" : count >= SYSTEM_PROMPT_MAX_CHARS * 0.9 ? "near" : "";
  return (
    <span aria-live="polite" className={`va-char-count ${state}`}>
      {count.toLocaleString()} / {SYSTEM_PROMPT_MAX_CHARS.toLocaleString()}
    </span>
  );
}

// New voice agents start with the caller speaking first.
const DEFAULT_BEGIN_MODE = "agent_waits_for_user";

// CallOpeningSettings is how a call opens: who speaks first, the words, and the
// pause before them (prompt.begin_message_*). Lives in the Call Opening section
// of the config sidebar.
function CallOpeningSettings({ agent, onPatch }: { agent: VoiceAgent; onPatch: Patch }) {
  const mode = agent.prompt?.begin_message_mode || DEFAULT_BEGIN_MODE;
  const delay = agent.prompt?.begin_message_delay_ms ?? 0;
  return (
    <div className="va-fields">
      <label className="va-field">
        <span className="va-field-label">Who speaks first</span>
        <select
          className="va-select"
          onChange={(event) =>
            onPatch((current) => ({ ...current, prompt: { ...current.prompt, begin_message_mode: event.target.value } }))
          }
          value={mode}
        >
          {withCurrent(beginModeOptions, mode).map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
        <span className="va-field-hint">{beginModeOptions.find((option) => option.id === mode)?.hint}</span>
      </label>
      {mode === "agent_speaks_first" ? (
        <label className="va-field">
          <span className="va-field-label">Welcome message</span>
          <textarea
            className="va-textarea"
            maxLength={1000}
            onChange={(event) =>
              onPatch((current) => ({ ...current, prompt: { ...current.prompt, begin_message: event.target.value } }))
            }
            placeholder="Hi, thanks for calling! How can I help?"
            style={{ minHeight: 72 }}
            value={agent.prompt?.begin_message ?? ""}
          />
        </label>
      ) : null}
      {mode !== "agent_waits_for_user" ? (
        <label className="va-field">
          <span className="va-range-head">
            <span className="va-field-label">Pause before speaking</span>
            <span className="va-range-value">{(delay / 1000).toFixed(1)}s</span>
          </span>
          <input
            className="va-range"
            max={5000}
            min={0}
            onChange={(event) =>
              onPatch((current) => ({
                ...current,
                prompt: { ...current.prompt, begin_message_delay_ms: Number(event.target.value) },
              }))
            }
            step={100}
            type="range"
            value={delay}
          />
        </label>
      ) : null}
    </div>
  );
}

function NumberSelect({ agent, onPatch, phoneNumbers }: { agent: VoiceAgent; onPatch: Patch; phoneNumbers: ApiPhoneNumber[] }) {
  const current = agent.agent?.phone_number_id ?? "";
  const listed = phoneNumbers.filter((pn) => pn.status === "connected" || pn.id === current);
  return (
    <select
      aria-label="Phone number"
      className="va-select"
      onChange={(event) =>
        onPatch((agentNow) => ({
          ...agentNow,
          agent: {
            ...agentNow.agent,
            phone_number_id: event.target.value || null,
            // An agent with no number has nothing to call from, so it pauses.
            status: !event.target.value
              ? "inactive"
              : event.target.value !== agentNow.agent?.phone_number_id
                ? "active"
                : agentNow.agent?.status,
          },
        }))
      }
      value={current}
    >
      <option value="">No number</option>
      {listed.map((pn) => (
        <option key={pn.id} value={pn.id}>
          {phoneNumberLabel(pn)}
          {pn.status !== "connected" ? " (disconnected)" : ""}
        </option>
      ))}
    </select>
  );
}

// How many times in a row the QR view replaces a code that ran out unscanned
// before it stops and offers "New QR code" instead.
const maxQrReissues = 10;

function formatQrCountdown(ms: number) {
  const seconds = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

// NumberSetup links a WhatsApp number for calling straight from the editor: a QR
// code to scan, or a pairing code for a number typed in. The login carries the
// agent's id, so the server hands the number to this agent once WhatsApp
// connects it. A number already linked on the account can be picked instead.
// The create modal passes no agent id: its agent is made once the number is in.
function NumberSetup({
  agentId,
  getToken,
  onLinked,
  onUseNumber,
  phoneNumbers,
}: {
  agentId: string;
  getToken: AuthGetter;
  onLinked: (agentId: string, linked: ApiPhoneNumber) => Promise<void>;
  onUseNumber: (phoneNumberId: string) => void;
  phoneNumbers: ApiPhoneNumber[];
}) {
  const [login, setLogin] = useState<ApiPhoneNumber | null>(null);
  const [error, setError] = useState("");
  const [isStarting, setIsStarting] = useState(false);
  const [codePhone, setCodePhone] = useState("");
  const connected = phoneNumbers.filter((pn) => pn.status === "connected");
  const loginId = login?.id;
  const pending = login?.status === "pending_qr";

  useEffect(() => {
    if (!loginId || !pending) return;
    let cancelled = false;
    const timer = setInterval(async () => {
      try {
        const fresh = await getVoicePhoneNumber(loginId, getToken);
        if (cancelled) return;
        setLogin(fresh);
        if (fresh.status === "connected") {
          clearInterval(timer);
          await onLinked(agentId, fresh);
        } else if (fresh.status !== "pending_qr") {
          clearInterval(timer);
          setError("That login ended before it was finished. Start again.");
        }
      } catch {
        // Tried again on the next tick.
      }
    }, 1500);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [agentId, getToken, loginId, onLinked, pending]);

  const start = useCallback(
    async (byCode: boolean) => {
      setError("");
      setIsStarting(true);
      try {
        const phone = codePhone.replace(/[^\d+]/g, "");
        const forAgent = agentId ? { agent_id: agentId } : {};
        const started = byCode
          ? await startVoiceNumberCodeLogin(
              { phone_number: phone.startsWith("+") ? phone : `+${phone}`, ...forAgent },
              getToken
            )
          : await startVoiceNumberLogin(forAgent, getToken);
        setLogin(started);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not start linking a number");
      } finally {
        setIsStarting(false);
      }
    },
    [agentId, codePhone, getToken]
  );

  // A screen that can be scanned (desktop, tablet) leads with the QR code,
  // already on screen, and "Link with phone number" swaps in the code form. A
  // phone can't scan its own screen, so it keeps the code form first.
  const isPhone = useIsPhone();
  const [codeChosen, setCodeChosen] = useState(false);
  const showsPairing = pending && Boolean(login?.pairing_code);
  const qrFirst = !isPhone && !codeChosen && !showsPairing;
  // A phone keeps the code form first, with a QR code already showing under
  // it for scanning from a second phone, as on the chat agent page.
  const phoneQr = isPhone && !showsPairing;
  const autoQr = qrFirst || phoneQr;

  // The QR view starts its login itself, once per time it is shown. A login
  // creates no number until it is scanned. A failed or ended one is not
  // retried here; the "New QR code" button is.
  const autoStarted = useRef(false);
  useEffect(() => {
    if (!autoQr) {
      autoStarted.current = false;
      return;
    }
    if (autoStarted.current || login || isStarting || error) return;
    autoStarted.current = true;
    void start(false);
  }, [autoQr, error, isStarting, login, start]);

  // The QR code's countdown, re-anchored to each poll's reading.
  const qrCode = pending && !login?.pairing_code ? login?.qr_code ?? null : null;
  const qrExpiresIn = qrCode ? login?.qr_expires_in_ms ?? null : null;
  const [qrLeft, setQrLeft] = useState<number | null>(null);
  useEffect(() => {
    if (qrExpiresIn === null) return;
    const deadline = Date.now() + qrExpiresIn;
    const tick = () => setQrLeft(Math.max(0, deadline - Date.now()));
    const interval = window.setInterval(tick, 250);
    tick();
    return () => window.clearInterval(interval);
  }, [qrCode, qrExpiresIn]);

  const qrStopped = Boolean(login) && login?.status !== "connected" && !pending && !isStarting;

  // A QR login that runs out unscanned is replaced on its own, so the screen
  // always has a code to scan, as on the chat agent page. A page left open all
  // day stops after maxQrReissues; "New QR code" then starts it again.
  const qrReissues = useRef(0);
  const [reissueStopped, setReissueStopped] = useState(false);
  useEffect(() => {
    if (!autoQr || !qrStopped || reissueStopped) return;
    if (qrReissues.current >= maxQrReissues) {
      setReissueStopped(true);
      return;
    }
    qrReissues.current += 1;
    setLogin(null);
    setError("");
    autoStarted.current = true;
    void start(false);
  }, [autoQr, qrStopped, reissueStopped, start]);
  const restartQr = () => {
    qrReissues.current = 0;
    setReissueStopped(false);
    setLogin(null);
    autoStarted.current = true;
    void start(false);
  };
  // While codes are being reissued the ended login is not an error to show.
  const shownError = autoQr && qrStopped && !reissueStopped ? "" : error;
  const qrTimer = login?.status === "connected"
    ? agentId
      ? "Connected. Linking it to this agent…"
      : "Connected. Creating your agent…"
    : isStarting
    ? "Getting a QR code…"
    : qrCode && qrExpiresIn !== null && qrLeft !== null
      ? qrLeft > 0
        ? `QR code will reload in ${formatQrCountdown(qrLeft)}`
        : "Loading a new QR code…"
      : qrCode
        ? "Scan with WhatsApp. The code refreshes by itself."
        : qrStopped && reissueStopped
          ? "This QR code ran out before it was scanned."
          : !login && error
            ? "Could not get a QR code."
            : "Getting a QR code…";
  // The button only shows once codes stop coming on their own.
  const needsRestart = (qrStopped && reissueStopped) || (!login && Boolean(error) && !isStarting);

  // Back from the code form to a scan: a running QR login is shown as is,
  // anything else gets a fresh one.
  const backToQr = () => {
    setCodeChosen(false);
    if (!(pending && !login?.pairing_code)) {
      setLogin(null);
      autoStarted.current = true;
      void start(false);
    }
  };

  return (
    <div className="va-number-grid is-single">
      <div className="va-number-pane">
        <div className="va-number-pane-head">
          <span className="va-number-pane-title">Link a WhatsApp number</span>
          <span className="va-number-video">
            <SetupVideoButton />
            <SetupVideoButton vertical />
          </span>
        </div>
        {qrFirst ? (
          <div className="va-qr-connect">
            <div className="va-qr-connect-code">
              <div className="va-qr-connect-timer" role="timer">{qrTimer}</div>
              <div className="va-qr-frame">
                {qrCode ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img alt="WhatsApp login QR code" className="va-qr-image" src={qrCode} />
                ) : (
                  <div className="va-qr-placeholder">
                    {needsRestart ? "Get a new QR code to scan" : "The QR code appears here in a moment"}
                  </div>
                )}
              </div>
              {needsRestart ? (
                <button className="va-btn va-btn-primary" onClick={restartQr} type="button">
                  <Icon name="qr" size={15} stroke="#fff" sw={2.2} />
                  New QR code
                </button>
              ) : null}
              <button className="va-qr-connect-alt" onClick={() => setCodeChosen(true)} type="button">
                Link with phone number
              </button>
            </div>
            <div className="va-qr-connect-help">
              <div className="va-qr-connect-title">Please scan the QR code</div>
              <ol className="va-qr-connect-steps">
                <li>
                  Open <b>WhatsApp</b> on your phone
                </li>
                <li>
                  Tap <b>Menu</b> or <b>Settings</b> and select <b>Linked devices</b>
                </li>
                <li>
                  Tap <b>Link a device</b>
                </li>
                <li>
                  Point your phone at this screen to read the <b>QR code</b>
                </li>
              </ol>
              <p className="va-qr-connect-note">
                {agentId ? "The number is linked to this agent" : "Your agent is ready"} the moment it connects — keep
                this page open.
              </p>
            </div>
          </div>
        ) : (
        <>
        <p className="va-number-copy" style={{ margin: 0 }}>
          The agent places and answers WhatsApp calls on this number. On your phone open WhatsApp › Linked devices ›
          Link a device.
        </p>
        {showsPairing ? (
          <>
            <div className="va-number-code notranslate">{login?.pairing_code}</div>
            <span className="va-number-status">Type this code in WhatsApp › Link with phone number instead.</span>
          </>
        ) : (
          <>
            <div className="va-alert-row">
              <input
                aria-label="WhatsApp number with country code"
                className="va-input"
                inputMode="tel"
                onChange={(event) => setCodePhone(event.target.value)}
                placeholder="+8801XXXXXXXXX"
                value={codePhone}
              />
              <button
                className="va-btn va-btn-secondary"
                disabled={isStarting || codePhone.replace(/\D/g, "").length < 8}
                onClick={() => void start(true)}
                type="button"
              >
                Get code
              </button>
            </div>
            {isPhone ? (
              <div className="va-phone-qr">
                <div className="va-qr-reveal-or">or scan from another phone</div>
                <div className="va-qr-connect-timer" role="timer">{qrTimer}</div>
                <div className="va-qr-frame">
                  {qrCode ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img alt="WhatsApp login QR code" className="va-qr-image" src={qrCode} />
                  ) : (
                    <div className="va-qr-placeholder">
                      {needsRestart ? "Get a new QR code to scan" : "The QR code appears here in a moment"}
                    </div>
                  )}
                </div>
                {needsRestart ? (
                  <button className="va-btn va-btn-primary" onClick={restartQr} type="button">
                    <Icon name="qr" size={15} stroke="#fff" sw={2.2} />
                    New QR code
                  </button>
                ) : null}
              </div>
            ) : null}
          </>
        )}
        {isPhone ? null : (
          <button className="va-qr-connect-alt" disabled={isStarting} onClick={backToQr} type="button">
            Scan QR code instead
          </button>
        )}
        </>
        )}
        {shownError ? <span className="va-number-error">{shownError}</span> : null}
      </div>
      {connected.length ? (
        <div className="va-number-pane">
          <div className="va-number-pane-head">
            <span className="va-number-pane-title">Or use a linked number</span>
          </div>
          <ul className="va-number-list">
            {connected.map((pn) => (
              <li key={pn.id}>
                <button
                  className="va-number-row"
                  onClick={() => onUseNumber(pn.id)}
                  type="button"
                >
                  <span className="va-number-icon">
                    <Icon name="phone" size={14} />
                  </span>
                  <span className="va-number-body">
                    <span className="va-number-name">{pn.label?.trim() || pn.phone_number || "WhatsApp number"}</span>
                    <span className="va-number-detail">{pn.phone_number || pn.wa_jid?.split("@")[0]}</span>
                  </span>
                  <span className="va-number-hint">Use</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

// knowledgeBaseNameForFile names a knowledge base after the uploaded file
// (extension dropped), kept under the server's name limit and made unique
// among the user's existing ones, since the server refuses a duplicate name.
function knowledgeBaseNameForFile(filename: string, existing: ApiKnowledgeBase[]): string {
  const base =
    filename.replace(/\.[^.]+$/, "").replace(/\s+/g, " ").trim().slice(0, knowledgeBaseNameLimit).trim() || "Document";
  const taken = new Set(existing.map((kb) => kb.knowledge_base_name.trim().toLowerCase()));
  if (!taken.has(base.toLowerCase())) return base;
  for (let n = 2; ; n += 1) {
    const suffix = ` ${n}`;
    const name = `${base.slice(0, knowledgeBaseNameLimit - suffix.length).trim()}${suffix}`;
    if (!taken.has(name.toLowerCase())) return name;
  }
}

// KnowledgeBaseFileAdd uploads one document as a new voice knowledge base and
// hands it back so the agent can attach it. The create and the upload are two
// calls; if the upload fails the empty knowledge base is deleted again, so a
// failed upload leaves nothing behind.
function KnowledgeBaseFileAdd({
  getToken,
  knowledgeBases,
  onAdded,
}: {
  getToken: AuthGetter;
  knowledgeBases: ApiKnowledgeBase[];
  onAdded: (kb: ApiKnowledgeBase) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busyName, setBusyName] = useState("");
  const [error, setError] = useState("");

  const upload = async (file: File) => {
    const problem = describeUnreadableFile(file);
    if (problem) {
      setError(problem);
      return;
    }
    setError("");
    setBusyName(file.name);
    let createdId = "";
    try {
      const created = await createKnowledgeBase(
        { knowledge_base_name: knowledgeBaseNameForFile(file.name, knowledgeBases) },
        getToken,
        "voice"
      );
      createdId = created.knowledge_base_id;
      const title = sourceTitleFromFilename(file.name) || "Document";
      const indexed = await addKnowledgeBaseFileSources(createdId, [{ file, title }], getToken, "voice");
      createdId = "";
      onAdded(indexed);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add the file.");
      if (createdId) {
        await deleteKnowledgeBase(createdId, getToken, "voice").catch(() => undefined);
      }
    } finally {
      setBusyName("");
    }
  };

  return (
    <div className="va-kb-add">
      <input
        accept={knowledgeBaseFileExtensions.join(",")}
        hidden
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (file) void upload(file);
        }}
        ref={inputRef}
        type="file"
      />
      <button
        className="va-btn va-btn-secondary va-btn-sm"
        disabled={Boolean(busyName)}
        onClick={() => inputRef.current?.click()}
        type="button"
      >
        <Icon name="plus" size={14} />
        <span>{busyName ? "Adding file…" : "Add file"}</span>
      </button>
      <span className="va-field-hint">
        {busyName ? `Reading ${busyName}…` : "PDF, Word, TXT, CSV and more, up to 10 MB. The agent answers calls from it."}
      </span>
      {error ? <span className="va-kb-add-error">{error}</span> : null}
    </div>
  );
}

// ConfigPanel is the settings column on desktop (rail) and the Configuration
// tab below it: one collapsible section per part of a voice agent.
function ConfigPanel({
  agent,
  getToken,
  knowledgeBases,
  numberSetup,
  onKnowledgeBaseAdded,
  onPatch,
  phoneNumbers,
  rail = false,
  tools,
}: {
  agent: VoiceAgent;
  getToken: AuthGetter;
  knowledgeBases: ApiKnowledgeBase[];
  numberSetup: ReactNode;
  onKnowledgeBaseAdded: (kb: ApiKnowledgeBase) => void;
  onPatch: Patch;
  phoneNumbers: ApiPhoneNumber[];
  rail?: boolean;
  tools: ApiTool[];
}) {
  const [openSection, setOpenSection] = useState<ConfigSectionId | null>(
    numberSetup ? "phone-number" : rail ? "voice" : "language"
  );
  const attachedKbs = agent.knowledge_base?.knowledge_base_ids ?? [];
  const attachedTools = agent.tools?.tool_ids ?? [];
  const attachedNumber = phoneNumbers.find((pn) => pn.id === agent.agent?.phone_number_id);
  const toggleId = (list: string[], id: string) => (list.includes(id) ? list.filter((item) => item !== id) : [...list, id]);

  return (
    <div className={`va-panel va-config-panel${rail ? " is-rail" : ""}`}>
      {rail ? null : (
        <div className="va-panel-head va-config-head">
          <div>
            <h2 className="va-panel-title">WhatsApp voice agent configuration</h2>
            <div className="va-panel-copy">How it calls, how it sounds, and what it can reach.</div>
          </div>
        </div>
      )}
      <div className="va-panel-body">
        {rail ? null : (
          <div className="va-config-fields">
            <label className="va-field">
              <span className="va-control-label">Name</span>
              <input
                className="va-input"
                maxLength={80}
                onChange={(event) => onPatch((current) => ({ ...current, agent: { ...current.agent, name: event.target.value } }))}
                value={agent.agent?.name ?? ""}
              />
            </label>
            <label className="va-field">
              <span className="va-control-label">Phone number</span>
              <NumberSelect agent={agent} onPatch={onPatch} phoneNumbers={phoneNumbers} />
            </label>
          </div>
        )}

        <div className="va-accordion-list">
          {rail ? (
            <ConfigSection
              icon="phone"
              id="phone-number"
              isOpen={openSection === "phone-number"}
              meta={
                numberSetup ? (
                  <span className="va-number-flag">Required to call</span>
                ) : attachedNumber ? (
                  attachedNumber.phone_number || phoneNumberLabel(attachedNumber)
                ) : (
                  ""
                )
              }
              onToggle={setOpenSection}
              title="Phone Number"
            >
              {numberSetup ?? <NumberSelect agent={agent} onPatch={onPatch} phoneNumbers={phoneNumbers} />}
            </ConfigSection>
          ) : null}

          <ConfigSection
            icon="globe"
            id="language"
            isOpen={openSection === "language"}
            meta={optionLabel(languages, agent.agent?.language)}
            onToggle={setOpenSection}
            title="Language"
          >
            <label className="va-field">
              <select
                aria-label="Language"
                className="va-select"
                onChange={(event) => onPatch((current) => ({ ...current, agent: { ...current.agent, language: event.target.value } }))}
                value={agent.agent?.language || "multi"}
              >
                {withCurrent(languages, agent.agent?.language).map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
              <span className="va-field-hint">The language the agent speaks on calls.</span>
            </label>
          </ConfigSection>

          <ConfigSection
            icon="mic"
            id="voice"
            isOpen={openSection === "voice"}
            meta={`${voiceSummary(agent)} · ${brainSummary(agent)}`}
            onToggle={setOpenSection}
            title="Voice"
          >
            <VoiceSettings agent={agent} onPatch={onPatch} />
          </ConfigSection>

          <ConfigSection
            icon="play"
            id="call-opening"
            isOpen={openSection === "call-opening"}
            meta={optionLabel(beginModeOptions, agent.prompt?.begin_message_mode || DEFAULT_BEGIN_MODE)}
            onToggle={setOpenSection}
            title="Call Opening"
          >
            <CallOpeningSettings agent={agent} onPatch={onPatch} />
          </ConfigSection>

          <ConfigSection
            icon="book"
            id="knowledge-base"
            isOpen={openSection === "knowledge-base"}
            meta={attachedKbs.length ? `${attachedKbs.length} attached` : "None"}
            onToggle={setOpenSection}
            title="Knowledge Base"
          >
            <KnowledgeBaseFileAdd
              getToken={getToken}
              knowledgeBases={knowledgeBases}
              onAdded={(kb) => {
                onKnowledgeBaseAdded(kb);
                onPatch((current) => ({
                  ...current,
                  knowledge_base: {
                    knowledge_base_ids: [...(current.knowledge_base?.knowledge_base_ids ?? []), kb.knowledge_base_id],
                  },
                }));
              }}
            />
            {knowledgeBases.length === 0 ? (
              <div className="va-chips-empty">No voice knowledge bases yet.</div>
            ) : (
              <div className="va-chips">
                {knowledgeBases.map((kb) => {
                  const on = attachedKbs.includes(kb.knowledge_base_id);
                  return (
                    <button
                      aria-pressed={on}
                      className={`va-chip${on ? " is-on" : ""}`}
                      key={kb.knowledge_base_id}
                      onClick={() =>
                        onPatch((current) => ({
                          ...current,
                          knowledge_base: {
                            knowledge_base_ids: toggleId(current.knowledge_base?.knowledge_base_ids ?? [], kb.knowledge_base_id),
                          },
                        }))
                      }
                      type="button"
                    >
                      {on ? <Icon name="check" size={13} sw={2.6} /> : <Icon name="book" size={13} />}
                      <span>{kb.knowledge_base_name}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </ConfigSection>

          <ConfigSection
            icon="wrench"
            id="tools"
            isOpen={openSection === "tools"}
            meta={attachedTools.length ? `${attachedTools.length} attached` : "None"}
            onToggle={setOpenSection}
            title="Tools"
          >
            {tools.length === 0 ? (
              <div className="va-chips-empty">No voice tools yet.</div>
            ) : (
              <div className="va-chips">
                {tools.map((tool) => {
                  const on = attachedTools.includes(tool.id);
                  return (
                    <button
                      aria-pressed={on}
                      className={`va-chip${on ? " is-on" : ""}`}
                      key={tool.id}
                      onClick={() =>
                        onPatch((current) => ({
                          ...current,
                          tools: { tool_ids: toggleId(current.tools?.tool_ids ?? [], tool.id) },
                        }))
                      }
                      title={tool.description}
                      type="button"
                    >
                      {on ? <Icon name="check" size={13} sw={2.6} /> : <Icon name="wrench" size={13} />}
                      <span>{tool.name}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </ConfigSection>
        </div>
      </div>
    </div>
  );
}

function SelectField({
  label,
  onChange,
  options,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  options: Option[];
  value: string;
}) {
  return (
    <label className="va-field">
      <span className="va-field-label">{label}</span>
      <select className="va-select" onChange={(event) => onChange(event.target.value)} value={value}>
        {withCurrent(options, value).map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

// Every call runs on one speech-to-speech session — OpenAI Realtime or Google
// Gemini Live — so the voice is all there is to pick: the engine, its model and
// the voice it speaks in. The engine follows the model (gemini-* = Gemini), so
// switching engine moves the agent onto that engine's default model and voice;
// each engine only speaks its own voices.
function VoiceSettings({ agent, onPatch }: { agent: VoiceAgent; onPatch: Patch }) {
  const openai = agent.voice?.openai ?? {};
  const model = openai.realtime_model || DEFAULT_REALTIME_MODEL;
  const engine = engineOf(model);
  const models = engine === "gemini" ? geminiModels : realtimeModels;
  const voices = engine === "gemini" ? geminiVoices : realtimeVoices;
  const savedVoice = openai.voice_id || DEFAULT_VOICE_ID;
  const voice = voices.some((option) => option.id === savedVoice) ? savedVoice : engineDefaults[engine].voiceId;
  const patchOpenAI = (fields: Partial<NonNullable<NonNullable<VoiceAgent["voice"]>["openai"]>>) =>
    onPatch((current) => ({
      ...current,
      voice: { ...current.voice, openai: { ...current.voice?.openai, ...fields } },
    }));

  return (
    <div className="va-fields">
      <span className="va-field-hint">
        {engine === "gemini"
          ? "Google Gemini Live: one speech-to-speech model hears, thinks and speaks."
          : "OpenAI Realtime: one speech-to-speech model hears, thinks and speaks."}
      </span>
      <SelectField
        label="Engine"
        onChange={(value) => {
          const next = value === "gemini" ? "gemini" : "openai";
          if (next === engine) return;
          const defaults = engineDefaults[next];
          patchOpenAI({ realtime_model: defaults.model, voice_id: defaults.voiceId, voice_name: defaults.voiceName });
        }}
        options={voiceEngines}
        value={engine}
      />
      <SelectField
        label="Realtime model"
        onChange={(value) => patchOpenAI({ realtime_model: value })}
        options={models}
        value={model}
      />
      <SelectField
        label="Voice"
        onChange={(value) =>
          patchOpenAI({
            voice_id: value,
            voice_name: voices.find((option) => option.id === value)?.label.split(" · ")[0] ?? value,
          })
        }
        options={voices}
        value={voice}
      />
    </div>
  );
}

function formatDuration(seconds: number | null | undefined): string {
  if (!seconds || seconds < 1) return "";
  const minutes = Math.floor(seconds / 60);
  const rest = Math.round(seconds % 60);
  return minutes ? `${minutes}m ${rest}s` : `${rest}s`;
}

function callPeer(call: ApiCall): string {
  const raw = call.peer?.split("@")[0]?.split(":")[0] ?? "";
  return /^\d+$/.test(raw) ? `+${raw}` : raw || "Unknown";
}

type TestNumberCheck =
  | { state: "empty" }
  | { state: "invalid"; message: string }
  | { state: "unsure"; phone: string; message: string }
  | { state: "valid"; phone: string; message: string };

const regionNames = (() => {
  try {
    return new Intl.DisplayNames(["en"], { type: "region" });
  } catch {
    return null;
  }
})();

// checkTestNumber says, as the number is typed, whether it can be called. A
// number libphonenumber can't confirm but whose length fits its country is let
// through with a warning: the small metadata calls a few real numbers invalid.
function checkTestNumber(value: string, lib: ReturnType<typeof usePhoneNumberLib>): TestNumberCheck {
  const compact = value.replace(/[\s().-]/g, "");
  if (!compact) return { state: "empty" };
  const digits = compact.startsWith("+") ? compact.slice(1) : compact.replace(/^00/, "");
  if (!/^\d+$/.test(digits)) return { state: "invalid", message: "Use digits only, starting with the country code." };
  if (digits.startsWith("0")) return { state: "invalid", message: "Add the country code first, for example +880 or +1." };
  if (digits.length < 7) return { state: "invalid", message: "That number is too short." };
  if (digits.length > 15) return { state: "invalid", message: "That number is too long." };
  if (!lib) return { state: "unsure", phone: `+${digits}`, message: "Checking the number…" };
  try {
    const parsed = lib.parsePhoneNumberFromString(`+${digits}`);
    if (!parsed) return { state: "invalid", message: "That is not a valid phone number." };
    const country = parsed.country ? regionNames?.of(parsed.country) ?? parsed.country : "";
    if (parsed.isValid()) {
      return { state: "valid", phone: parsed.number, message: `Valid number${country ? ` · ${country}` : ""}` };
    }
    if (parsed.isPossible()) {
      return {
        state: "unsure",
        phone: parsed.number,
        message: `Could not confirm this number${country ? ` for ${country}` : ""}. Check it before calling.`,
      };
    }
    return { state: "invalid", message: "That is not a valid phone number." };
  } catch {
    return { state: "invalid", message: "That is not a valid phone number." };
  }
}

const TEST_CALL_POLL_MS = 2000;
const TEST_CALL_MAX_WATCH_MS = 10 * 60 * 1000;

// Matches dashboardHangupReason in server/internal/handlers/call_handler.go.
const DASHBOARD_HANGUP_REASON = "hung up from dashboard";

function isCallInProgress(call: ApiCall | null): boolean {
  return call?.status === "received" || call?.status === "answered";
}

function testCallStatusText(call: ApiCall): string {
  if (call.end_reason === DASHBOARD_HANGUP_REASON && !isCallInProgress(call)) {
    const duration = formatDuration(call.duration_seconds);
    return call.status === "ended" && duration ? `You hung up · ${duration}.` : "Call cancelled.";
  }
  switch (call.status) {
    case "received":
      return `Ringing ${callPeer(call)}…`;
    case "answered":
      return "Connected — the agent is talking.";
    case "ended": {
      const duration = formatDuration(call.duration_seconds);
      return `Call ended${duration ? ` · ${duration}` : ""}. The transcript is in the Calls tab.`;
    }
    case "declined":
      return "The call was declined.";
    case "failed":
      return `The call failed${call.end_reason ? `: ${call.end_reason}` : "."}`;
    default:
      return call.status;
  }
}

// TestCallCard rings a number from the agent's line so the owner can hear the
// agent. The number is checked as it is typed and the button stays off until it
// can be called; after that the card follows the call until it ends.
function TestCallCard({ agent, getToken }: { agent: VoiceAgent; getToken: AuthGetter }) {
  const phoneNumberId = agent.agent?.phone_number_id ?? "";
  const lib = usePhoneNumberLib(Boolean(phoneNumberId));
  const [to, setTo] = useState("");
  const [isCalling, setIsCalling] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [call, setCall] = useState<ApiCall | null>(null);
  // The request that is placing a call, and whether Cancel was pressed while it
  // ran: a call the server hands back after that is hung up straight away.
  const placingRef = useRef<{ controller: AbortController; cancelled: boolean } | null>(null);
  const check = checkTestNumber(to, lib);
  const inCall = isCallInProgress(call);
  const { usage, refresh: refreshUsage } = useVoiceUsage(getToken);
  const minutesUsedUp = Boolean(usage?.exhausted);
  const canCall =
    Boolean(phoneNumberId) &&
    !minutesUsedUp &&
    !isCalling &&
    !isCancelling &&
    !inCall &&
    (check.state === "valid" || (check.state === "unsure" && Boolean(lib)));

  useEffect(() => () => placingRef.current?.controller.abort(), []);

  // A finished call has just used minutes: show the new balance right away.
  const callStatus = call?.status ?? "";
  useEffect(() => {
    if (callStatus === "ended") void refreshUsage();
  }, [callStatus, refreshUsage]);

  const callId = call?.id ?? "";
  useEffect(() => {
    if (!callId || !inCall) return;
    let cancelled = false;
    const startedAt = Date.now();
    let timer: ReturnType<typeof setTimeout> | null = null;
    const tick = async () => {
      try {
        const fresh = await getVoiceCall(callId, getToken);
        if (cancelled) return;
        setCall(fresh);
        if (fresh.status !== "received" && fresh.status !== "answered") return;
      } catch {
        // A blip; the next read tries again.
      }
      if (cancelled || Date.now() - startedAt > TEST_CALL_MAX_WATCH_MS) return;
      timer = setTimeout(tick, TEST_CALL_POLL_MS);
    };
    timer = setTimeout(tick, TEST_CALL_POLL_MS);
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [callId, getToken, inCall]);

  const hangUp = async (target: ApiCall) => {
    const ended = await hangupVoiceCall(target.id, getToken);
    setCall(ended);
    return ended;
  };

  // A call cancelled before the server answered the request may still have
  // reached the phone (the offer goes out before the call is handed back), so
  // look for this agent's call to that number for a few seconds and hang it up.
  const hangUpStray = async (phone: string) => {
    const digits = phone.replace(/\D/g, "");
    for (const waitMs of [0, 1500, 3000]) {
      if (waitMs) await new Promise((resolve) => setTimeout(resolve, waitMs));
      try {
        const list = await listVoiceCalls(getToken);
        const stray = list.filter(
          (item) =>
            item.agent_id === agent.id &&
            item.call_type === "outbound" &&
            isCallInProgress(item) &&
            callPeer(item).replace(/\D/g, "") === digits
        );
        if (stray.length) {
          await Promise.all(stray.map((item) => hangupVoiceCall(item.id, getToken).catch(() => undefined)));
          return;
        }
      } catch {
        // Try again on the next pass.
      }
    }
  };

  const place = async () => {
    if (!canCall || (check.state !== "valid" && check.state !== "unsure")) return;
    const placing = { controller: new AbortController(), cancelled: false };
    placingRef.current = placing;
    setIsCalling(true);
    setError("");
    setNotice("");
    setCall(null);
    try {
      const placed = await placeVoiceCall(
        { phone_number_id: phoneNumberId, to: check.phone, agent_id: agent.id },
        getToken,
        placing.controller.signal
      );
      if (placing.cancelled) {
        await hangUp(placed).catch(() => setCall(placed));
      } else {
        setCall(placed);
      }
    } catch (err) {
      if (!placing.cancelled) setError(err instanceof Error ? err.message : "Could not place the call");
      // 402 = minutes used up: refresh so the "buy minutes" card appears.
      if (err instanceof VoiceApiError && err.status === 402) void refreshUsage();
    } finally {
      if (placingRef.current === placing) placingRef.current = null;
      setIsCalling(false);
    }
  };

  const cancel = async () => {
    setError("");
    setIsCancelling(true);
    try {
      const placing = placingRef.current;
      if (placing) {
        placing.cancelled = true;
        placing.controller.abort();
        setNotice("Call cancelled.");
        if (check.state === "valid" || check.state === "unsure") await hangUpStray(check.phone);
      } else if (call && isCallInProgress(call)) {
        await hangUp(call);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not hang up the call");
    } finally {
      setIsCancelling(false);
    }
  };

  const busy = isCalling || inCall;

  return (
    <div className="va-card va-test-call">
      <div className="va-card-head">
        <h3 className="va-card-title">Test call</h3>
        {call ? <span className={`va-pill-status is-${call.status}`}>{call.status}</span> : null}
      </div>
      {phoneNumberId ? (
        <form
          className="va-call-form"
          onSubmit={(event) => {
            event.preventDefault();
            void place();
          }}
        >
          <label className="va-field">
            <span className="va-field-label">Phone number to call</span>
            <input
              aria-invalid={check.state === "invalid"}
              className={`va-input${check.state === "invalid" ? " is-invalid" : ""}`}
              inputMode="tel"
              onChange={(event) => {
                setTo(event.target.value);
                setError("");
              }}
              placeholder="+8801XXXXXXXXX"
              value={to}
            />
          </label>
          {busy ? (
            <button className="va-btn va-btn-danger" disabled={isCancelling} onClick={() => void cancel()} type="button">
              <Icon name="phone" size={14} sw={2.2} />
              {isCancelling ? "Cancelling…" : isCalling ? "Cancel" : call?.status === "answered" ? "Hang up" : "Cancel call"}
            </button>
          ) : (
            <button className="va-btn va-btn-primary" disabled={!canCall} type="submit">
              <Icon name="phone" size={14} stroke="#fff" sw={2.2} />
              {call || notice ? "Call again" : "Test"}
            </button>
          )}
          <span className={`va-test-hint is-${check.state}`}>
            {check.state === "empty" ? "Enter a WhatsApp number with its country code." : check.message}
          </span>
        </form>
      ) : (
        <p className="va-field-hint">Link a phone number to this agent to place a test call.</p>
      )}
      {usage && phoneNumberId ? (
        <p className="va-test-minutes">
          {minutesUsedUp
            ? "Voice minutes used up. Buy more minutes to call again."
            : `${formatMinutes(usage.remaining_seconds)} voice minutes left`}
        </p>
      ) : null}
      {error ? <p className="va-test-result is-error">{error}</p> : null}
      {isCalling ? (
        <p className="va-test-result">Placing the call…</p>
      ) : call ? (
        <p className="va-test-result">{testCallStatusText(call)}</p>
      ) : notice ? (
        <p className="va-test-result">{notice}</p>
      ) : null}
    </div>
  );
}

// CallsCard is the agent's call history from the calls table, newest first,
// each call opening on its transcript; and, once the agent has a number, a form
// to ring a number from the agent's line.
function CallsCard({ agent, getToken }: { agent: VoiceAgent; getToken: AuthGetter }) {
  const [calls, setCalls] = useState<ApiCall[] | null>(null);
  const [error, setError] = useState("");
  const [openId, setOpenId] = useState("");
  const [transcripts, setTranscripts] = useState<Record<string, ApiCall>>({});
  const [to, setTo] = useState("");
  const [isCalling, setIsCalling] = useState(false);
  const [callNotice, setCallNotice] = useState("");
  const canPlace = Boolean(agent.agent?.phone_number_id);

  const load = useCallback(async () => {
    try {
      const list = await listVoiceCalls(getToken);
      setCalls(list.filter((call) => call.agent_id === agent.id));
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load calls");
      setCalls((current) => current ?? []);
    }
  }, [agent.id, getToken]);

  useEffect(() => {
    let cancelled = false;
    const run = () => {
      if (!cancelled) void load();
    };
    run();
    const timer = setInterval(run, 10000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [load]);

  const toggle = async (call: ApiCall) => {
    const next = openId === call.id ? "" : call.id;
    setOpenId(next);
    if (!next || transcripts[call.id]) return;
    try {
      const full = await getVoiceCall(call.id, getToken);
      setTranscripts((current) => ({ ...current, [call.id]: full }));
    } catch {
      setTranscripts((current) => ({ ...current, [call.id]: { ...call, messages: [] } }));
    }
  };

  const place = async () => {
    const phoneNumberId = agent.agent?.phone_number_id;
    if (!phoneNumberId) return;
    const digits = to.replace(/[^\d+]/g, "");
    setIsCalling(true);
    setCallNotice("");
    try {
      await placeVoiceCall(
        { phone_number_id: phoneNumberId, to: digits.startsWith("+") ? digits : `+${digits}`, agent_id: agent.id },
        getToken
      );
      setCallNotice("Ringing…");
      setTo("");
      await load();
    } catch (err) {
      setCallNotice(err instanceof Error ? err.message : "Could not place the call");
    } finally {
      setIsCalling(false);
    }
  };

  return (
    <div className="va-card va-card-calls">
      <div className="va-card-head">
        <h3 className="va-card-title">Calls</h3>
        <button aria-label="Refresh calls" className="va-number-refresh" onClick={() => void load()} type="button">
          <Icon name="refresh" size={12} sw={2.2} />
          Refresh
        </button>
      </div>
      {canPlace ? (
        <form
          className="va-call-form"
          onSubmit={(event) => {
            event.preventDefault();
            void place();
          }}
        >
          <label className="va-field">
            <span className="va-field-label">Call a number</span>
            <input
              className="va-input"
              inputMode="tel"
              onChange={(event) => setTo(event.target.value)}
              placeholder="+8801XXXXXXXXX"
              value={to}
            />
          </label>
          <button className="va-btn va-btn-primary" disabled={isCalling || to.replace(/\D/g, "").length < 8} type="submit">
            <Icon name="phone" size={14} stroke="#fff" sw={2.2} />
            {isCalling ? "Calling…" : "Call"}
          </button>
          {callNotice ? (
            <span className="va-field-hint" style={{ gridColumn: "1 / -1" }}>
              {callNotice}
            </span>
          ) : null}
        </form>
      ) : null}
      <div className="va-calls-scroll">
        {calls === null ? (
          <div className="va-empty-list">Loading calls…</div>
        ) : calls.length === 0 ? (
          <div className="va-empty-list">{error || "No calls yet."}</div>
        ) : (
          <ul className="va-call-list">
            {calls.map((call) => {
              const isOpen = openId === call.id;
              const full = transcripts[call.id];
              return (
                <li className={`va-call${isOpen ? " is-open" : ""}`} key={call.id}>
                  <button aria-expanded={isOpen} className="va-call-row" onClick={() => void toggle(call)} type="button">
                    <span style={{ minWidth: 0 }}>
                      <span className="va-call-peer notranslate">{callPeer(call)}</span>
                      <span className="va-call-meta">
                        {call.call_type === "inbound" ? "Inbound" : "Outbound"}
                        {formatDuration(call.duration_seconds) ? ` · ${formatDuration(call.duration_seconds)}` : ""}
                        {call.end_reason ? ` · ${call.end_reason}` : ""}
                      </span>
                    </span>
                    <span className={`va-pill-status is-${call.status}`}>{call.status}</span>
                    <span className="va-call-when">
                      {new Date(call.created_at).toLocaleString([], {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </span>
                    <span className="va-accordion-chevron">
                      <Icon name="chevron" size={15} sw={2.4} />
                    </span>
                  </button>
                  {isOpen ? (
                    <div className="va-transcript">
                      {!full ? (
                        <span className="va-call-meta">Loading transcript…</span>
                      ) : (full.messages ?? []).length === 0 ? (
                        <span className="va-call-meta">No transcript for this call.</span>
                      ) : (
                        (full.messages ?? []).map((message, index) => {
                          const fromAgent = message.role === "assistant" || message.role === "agent";
                          return (
                            <div className={`va-line ${fromAgent ? "is-agent" : "is-user"}`} key={index}>
                              <span className="va-line-role">{fromAgent ? "Agent" : "Caller"}</span>
                              {message.content}
                            </div>
                          );
                        })
                      )}
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

function ConfigSection({
  children,
  icon,
  id,
  isOpen,
  meta,
  onToggle,
  title,
}: {
  children: ReactNode;
  icon: IconName;
  id: ConfigSectionId;
  isOpen: boolean;
  meta: ReactNode;
  onToggle: (next: ConfigSectionId | null) => void;
  title: string;
}) {
  return (
    <div className={`va-accordion-item${isOpen ? " is-open" : ""}`}>
      <button aria-expanded={isOpen} className="va-accordion-button" onClick={() => onToggle(isOpen ? null : id)} type="button">
        <span className="va-accordion-icon">
          <Icon name={icon} size={16} />
        </span>
        <span className="va-accordion-title">{title}</span>
        <span className="va-accordion-meta">{meta}</span>
        <span className="va-accordion-chevron">
          <Icon name="chevron" size={16} sw={2.4} />
        </span>
      </button>
      {isOpen ? <div className="va-accordion-body">{children}</div> : null}
    </div>
  );
}

function StatusPill({ agent }: { agent: VoiceAgent }) {
  const live = isLive(agent);
  return (
    <span className={`va-pill ${live ? "is-active" : "is-inactive"}`}>
      <span className="va-dot" />
      {live ? "Live" : "Paused"}
    </span>
  );
}

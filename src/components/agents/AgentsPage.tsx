"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { createPortal } from "react-dom";
import { useAuth, useUser, UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useTheme } from "@/components/theme/ThemeProvider";
import { clerkAppearance } from "@/components/theme/clerkAppearance";
import {
  createDashboardAgent as apiCreateAgent,
  deleteDashboardAgent as apiDeleteAgent,
  listDashboardAgents as apiListAgents,
  updateDashboardAgent as apiUpdateAgent,
  type AgentPayload,
  type ApiAgentResource,
  type ApiVoiceSection,
} from "@/lib/agents";
import { type AuthTokenGetter } from "@/lib/api";
import { listApiKeys as apiListApiKeys } from "@/lib/apiKeys";
import {
  addKnowledgeBaseFileSources as apiAddKnowledgeBaseFileSources,
  addKnowledgeBaseSources as apiAddKnowledgeBaseSources,
  createKnowledgeBase as apiCreateKnowledgeBase,
  listKnowledgeBases as apiListKnowledgeBases,
  describeInvalidSourceTitle,
  describeUnreadableFile,
  knowledgeBaseFileExtensions,
  knowledgeBaseNameLimit,
  knowledgeBaseSourceBounds,
  knowledgeBaseStatusLabels,
  sourceTitleFromFilename,
  KnowledgeBaseError,
  type ApiKnowledgeBase,
  type FieldError,
} from "@/lib/knowledgeBases";
import {
  createTool as apiCreateTool,
  listTools as apiListTools,
  emptyApiRequestConfig,
  httpMethods,
  isValidToolName,
  suggestToolName,
  toolBounds,
  toolSummary,
  ToolError,
  type ApiTool,
  type CreateToolPayload,
  type HttpMethod,
  type ToolType,
} from "@/lib/tools";
import {
  addLibraryVoice as apiAddLibraryVoice,
  listLibraryVoices as apiListLibraryVoices,
  listWorkspaceVoices as apiListWorkspaceVoices,
  type LibraryVoice,
  type VoicePage,
} from "@/lib/voices";
import {
  getPhoneNumber as apiGetPhoneNumber,
  listPhoneNumbers as apiListPhoneNumbers,
  restartPhoneNumberLogin as apiRestartPhoneNumberLogin,
  startPhoneNumberLogin as apiStartPhoneNumberLogin,
  type ApiPhoneNumber,
  type PhoneNumberStatus,
} from "@/lib/phoneNumbers";

type Option<T extends string = string> = {
  id: T;
  label: string;
  disabled?: boolean;
  status?: "available" | "selected";
};
// The backend persists active/inactive; the UI presents them as Live/Paused.
type AgentStatus = "live" | "paused";
type CallDirection = "inbound" | "outbound" | "both";
type LlmProvider = "openai" | "anthropic";
type ModelSectionProvider = LlmProvider | "openai_realtime";
type LlmModel =
  | "gpt-5.6-terra"
  | "gpt-5.6-luna"
  | "gpt-5.5"
  | "gpt-5.4"
  | "gpt-5.4-mini"
  | "gpt-5.4-nano"
  | "gpt-5.2"
  | "gpt-5.1"
  | "gpt-5-pro"
  | "gpt-5"
  | "gpt-5-mini"
  | "gpt-5-nano"
  | "gpt-5-chat-latest"
  | "gpt-4.1"
  | "gpt-4.1-mini"
  | "gpt-4.1-nano"
  | "gpt-4o"
  | "gpt-4o-mini"
  | "gpt-4-turbo"
  | "gpt-4"
  | "gpt-3.5-turbo"
  | "o3"
  | "o4-mini"
  | "o3-mini"
  | "o1-pro"
  | "o1"
  | "o1-mini"
  | "o1-preview"
  | "claude-sonnet-5"
  | "claude-sonnet-4-6"
  | "claude-sonnet-4-5-20250929"
  | "claude-sonnet-4-20250514"
  | "claude-haiku-4-5-20251001"
  | "claude-opus-4-8"
  | "claude-opus-4-7"
  | "claude-opus-4-6"
  | "claude-opus-4-5-20251101"
  | "claude-opus-4-1"
  | "claude-opus-4-20250514"
  | "claude-fable-5";
type CallProvider = "openai_realtime" | "openai" | "11labs";
type OpenAIRealtimeModel =
  | "gpt-realtime"
  | "gpt-realtime-1.5"
  | "gpt-realtime-mini"
  | "gpt-realtime-2"
  | "gpt-realtime-2.1"
  | "gpt-realtime-2.1-mini";
// ElevenLabs voices are no longer an enum: they are picked from the live
// ElevenLabs catalogue and stored as a raw voice id (see VoiceConfig below).
type VoiceId =
  | "openai-Alloy"
  | "openai-Ash"
  | "openai-Ballad"
  | "openai-Coral"
  | "openai-Echo"
  | "openai-Sage"
  | "openai-Shimmer"
  | "openai-Verse"
  | "openai-Marin"
  | "openai-Cedar"
  | "openai-Fable"
  | "openai-Nova"
  | "openai-Onyx";
type VoiceModel =
  | "eleven_multilingual_v2"
  | "eleven_turbo_v2"
  | "eleven_turbo_v2_5"
  | "eleven_flash_v2"
  | "eleven_flash_v2_5"
  | "eleven_v3"
  | "tts-1"
  | "tts-1-hd"
  | "gpt-4o-mini-tts";
type TranscriberProvider = "openai" | "11labs";
type TranscriberModel =
  | "gpt-4o-transcribe"
  | "gpt-4o-mini-transcribe"
  | "gpt-4o-transcribe-diarize"
  | "whisper-1"
  | "scribe_v1"
  | "scribe_v2"
  | "scribe_v2_realtime";
type TranscriberLanguage = "en" | "bn" | "es" | "fr" | "de";
type BeginMessageMode =
  | "agent_speaks_first"
  | "agent_waits_for_user"
  | "agent_speaks_first_with_model_generated_message";
type ConfigSectionId =
  | "model"
  | "transcriber"
  | "voice"
  | "knowledge-base"
  | "tools";

type LlmConfig = {
  provider: LlmProvider;
  model: LlmModel;
  temperature: number;
};

type VoiceConfig = {
  provider: CallProvider;
  voice: VoiceId;
  // ElevenLabs selection, chosen from the live catalogue. The id is whatever
  // ElevenLabs returns, so it is never validated against a local list; the name
  // is kept alongside it purely so the UI can label a saved voice without
  // re-fetching the catalogue.
  eleven_voice_id: string;
  eleven_voice_name: string;
  model: VoiceModel;
  realtime_model: OpenAIRealtimeModel;
  speed: number;
  volume: number;
  stability: number;
  similarity_boost: number;
  style: number;
  speaker_boost: boolean;
  openai_instructions: string;
  response_format: "mp3";
};

type TranscriberConfig = {
  provider: TranscriberProvider;
  language: TranscriberLanguage;
  model: TranscriberModel;
};

type Agent = {
  id: string;
  name: string;
  role: string;
  status: AgentStatus;
  language: string;
  timezone: string;
  phone_number_id: string | null;
  call_direction: CallDirection;
  begin_message_mode: BeginMessageMode;
  welcome_message: string;
  welcome_delay_ms: number;
  system_prompt: string;
  llm: LlmConfig;
  voice: VoiceConfig;
  transcriber: TranscriberConfig;
  // Ids of the knowledge bases this agent may quote from. The catalogue itself
  // lives in the Knowledge Base workspace; the agent only holds the attachments.
  knowledge_base_ids: string[];
  // Ids of the tools this agent may call mid-call. The tools themselves live in
  // the Tools workspace; the agent only holds the attachments.
  tool_ids: string[];
};

type CreateForm = {
  name: string;
  language: string;
  timezone: string;
  phone_number_id: string;
  call_direction: CallDirection;
  llm_provider: LlmProvider;
  llm_model: LlmModel;
  llm_temperature: number;
  begin_message_mode: BeginMessageMode;
  welcome_message: string;
  system_prompt: string;
  voice_provider: CallProvider;
  voice: VoiceId;
  eleven_voice_id: string;
  eleven_voice_name: string;
  voice_model: VoiceModel;
  realtime_model: OpenAIRealtimeModel;
  voice_speed: number;
  transcriber_provider: TranscriberProvider;
  transcriber_language: TranscriberLanguage;
  transcriber_model: TranscriberModel;
};

type IconName =
  | "grid"
  | "agents"
  | "phone"
  | "phoneOut"
  | "calendar"
  | "chart"
  | "settings"
  | "key"
  | "book"
  | "file"
  | "wrench"
  | "plus"
  | "search"
  | "play"
  | "pause"
  | "upload"
  | "speaker"
  | "trash"
  | "chevron"
  | "cube"
  | "mic"
  | "message"
  | "refresh"
  | "hash"
  | "check"
  | "spark"
  | "target"
  | "globe"
  | "transfer"
  | "phoneOff"
  | "x";

const languages: Option[] = [
  { id: "af-ZA", label: "Afrikaans" },
  { id: "sq-AL", label: "Albanian" },
  { id: "am-ET", label: "Amharic" },
  { id: "ar-SA", label: "Arabic" },
  { id: "hy-AM", label: "Armenian" },
  { id: "az-AZ", label: "Azerbaijani" },
  { id: "eu-ES", label: "Basque" },
  { id: "be-BY", label: "Belarusian" },
  { id: "bn-BD", label: "Bengali (Bangladesh)" },
  { id: "bs-BA", label: "Bosnian" },
  { id: "bg-BG", label: "Bulgarian" },
  { id: "my-MM", label: "Burmese" },
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
  { id: "fil-PH", label: "Filipino" },
  { id: "fi-FI", label: "Finnish" },
  { id: "fr-CA", label: "French (Canada)" },
  { id: "fr-FR", label: "French (France)" },
  { id: "gl-ES", label: "Galician" },
  { id: "ka-GE", label: "Georgian" },
  { id: "de-AT", label: "German (Austria)" },
  { id: "de-DE", label: "German (Germany)" },
  { id: "de-CH", label: "German (Switzerland)" },
  { id: "el-GR", label: "Greek" },
  { id: "gu-IN", label: "Gujarati" },
  { id: "he-IL", label: "Hebrew" },
  { id: "hi-IN", label: "Hindi" },
  { id: "hu-HU", label: "Hungarian" },
  { id: "is-IS", label: "Icelandic" },
  { id: "id-ID", label: "Indonesian" },
  { id: "ga-IE", label: "Irish" },
  { id: "it-IT", label: "Italian" },
  { id: "ja-JP", label: "Japanese" },
  { id: "jv-ID", label: "Javanese" },
  { id: "kn-IN", label: "Kannada" },
  { id: "kk-KZ", label: "Kazakh" },
  { id: "km-KH", label: "Khmer" },
  { id: "ko-KR", label: "Korean" },
  { id: "lo-LA", label: "Lao" },
  { id: "lv-LV", label: "Latvian" },
  { id: "lt-LT", label: "Lithuanian" },
  { id: "mk-MK", label: "Macedonian" },
  { id: "ms-MY", label: "Malay" },
  { id: "ml-IN", label: "Malayalam" },
  { id: "mr-IN", label: "Marathi" },
  { id: "mn-MN", label: "Mongolian" },
  { id: "ne-NP", label: "Nepali" },
  { id: "no-NO", label: "Norwegian" },
  { id: "fa-IR", label: "Persian" },
  { id: "pl-PL", label: "Polish" },
  { id: "pt-BR", label: "Portuguese (Brazil)" },
  { id: "pt-PT", label: "Portuguese (Portugal)" },
  { id: "pa-IN", label: "Punjabi" },
  { id: "ro-RO", label: "Romanian" },
  { id: "ru-RU", label: "Russian" },
  { id: "sr-RS", label: "Serbian" },
  { id: "si-LK", label: "Sinhala" },
  { id: "sk-SK", label: "Slovak" },
  { id: "sl-SI", label: "Slovenian" },
  { id: "es-MX", label: "Spanish (Mexico)" },
  { id: "es-ES", label: "Spanish (Spain)" },
  { id: "es-US", label: "Spanish (US)" },
  { id: "sw-KE", label: "Swahili" },
  { id: "sv-SE", label: "Swedish" },
  { id: "ta-IN", label: "Tamil" },
  { id: "te-IN", label: "Telugu" },
  { id: "th-TH", label: "Thai" },
  { id: "tr-TR", label: "Turkish" },
  { id: "uk-UA", label: "Ukrainian" },
  { id: "ur-PK", label: "Urdu" },
  { id: "uz-UZ", label: "Uzbek" },
  { id: "vi-VN", label: "Vietnamese" },
  { id: "cy-GB", label: "Welsh" },
  { id: "zu-ZA", label: "Zulu" },
];


// elevenLabsV25Languages are the languages ElevenLabs Flash v2.5 and Turbo v2.5
// can be told to speak. They are the only TTS models that take a language at
// all — every other one infers it from the reply text — and they take nothing
// outside this set. Kept in step with elevenLabsV25TTSLanguages in
// server/internal/voicecall/elevenlabs.go.
const elevenLabsV25Languages = new Set([
  "ar", "bg", "cs", "da", "de", "el", "en", "es", "fi", "fil", "fr", "hi",
  "hr", "hu", "id", "it", "ja", "ko", "ms", "nl", "no", "pl", "pt", "ro",
  "ru", "sk", "sv", "ta", "tr", "uk", "vi", "zh",
]);

// elevenLabsSpeaksLanguage reports whether the ElevenLabs voice model can speak
// the agent's language at all. Mirrors elevenLabsSpeaksLanguage in
// server/internal/voicecall/elevenlabs.go.
function elevenLabsSpeaksLanguage(model: VoiceModel, language: string): boolean {
  const code = language.trim().toLowerCase().split(/[-_]/)[0];
  if (!code) return true;
  switch (model) {
    case "eleven_flash_v2_5":
    case "eleven_turbo_v2_5":
      return elevenLabsV25Languages.has(code);
    case "eleven_turbo_v2":
    case "eleven_flash_v2":
      return code === "en";
    case "eleven_multilingual_v2":
      // Multilingual v2 speaks the v2.5 set apart from the three v2.5 added.
      return code !== "hu" && code !== "no" && code !== "vi" && elevenLabsV25Languages.has(code);
    default:
      // v3 covers 70+ languages; assume a model we do not track speaks it.
      return true;
  }
}

function languageLabel(code: string): string {
  return languages.find((option) => option.id === code)?.label ?? code;
}

const timezoneOptions: Option[] = [
  { id: "Asia/Dhaka", label: "Asia/Dhaka" },
  { id: "America/New_York", label: "America/New_York" },
  { id: "America/Los_Angeles", label: "America/Los_Angeles" },
  { id: "America/Chicago", label: "America/Chicago" },
  { id: "Europe/London", label: "Europe/London" },
  { id: "Europe/Berlin", label: "Europe/Berlin" },
  { id: "Asia/Kolkata", label: "Asia/Kolkata" },
];

const llmProviders: Option<LlmProvider>[] = [
  { id: "openai", label: "ChatGPT" },
  { id: "anthropic", label: "Claude" },
];

const modelSectionProviders: Option<ModelSectionProvider>[] = [
  { id: "openai_realtime", label: "ChatGPT Realtime" },
  ...llmProviders,
];

const llmModels: Record<LlmProvider, Option<LlmModel>[]> = {
  openai: [
    { id: "gpt-5.6-terra", label: "GPT 5.6 Terra" },
    { id: "gpt-5.6-luna", label: "GPT 5.6 Luna" },
    { id: "gpt-5.5", label: "GPT 5.5" },
    { id: "gpt-5.4", label: "GPT 5.4" },
    { id: "gpt-5.4-mini", label: "GPT 5.4 Mini" },
    { id: "gpt-5.4-nano", label: "GPT 5.4 Nano" },
    { id: "gpt-5.2", label: "GPT 5.2" },
    { id: "gpt-5.1", label: "GPT 5.1" },
    { id: "gpt-5-pro", label: "GPT 5 Pro" },
    { id: "gpt-5", label: "GPT 5" },
    { id: "gpt-5-mini", label: "GPT 5 Mini" },
    { id: "gpt-5-nano", label: "GPT 5 Nano" },
    { id: "gpt-5-chat-latest", label: "GPT 5 Chat Latest" },
    { id: "gpt-4.1", label: "GPT 4.1" },
    { id: "gpt-4.1-mini", label: "GPT 4.1 Mini" },
    { id: "gpt-4.1-nano", label: "GPT 4.1 Nano" },
    { id: "gpt-4o", label: "GPT-4o" },
    { id: "gpt-4o-mini", label: "GPT-4o Mini" },
    { id: "gpt-4-turbo", label: "GPT-4 Turbo" },
    { id: "gpt-4", label: "GPT-4" },
    { id: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
    { id: "o3", label: "o3" },
    { id: "o4-mini", label: "o4 Mini" },
    { id: "o3-mini", label: "o3 Mini" },
    { id: "o1-pro", label: "o1 Pro" },
    { id: "o1", label: "o1" },
    { id: "o1-mini", label: "o1 Mini" },
    { id: "o1-preview", label: "o1 Preview" },
  ],
  anthropic: [
    {
      id: "claude-sonnet-5",
      label: "Claude Sonnet 5 — 1180ms · $0.013/min · 40 Intelligence",
    },
    {
      id: "claude-sonnet-4-6",
      label: "Claude Sonnet 4.6 — 1160ms · $0.013/min · 36 Intelligence",
    },
    {
      id: "claude-sonnet-4-5-20250929",
      label: "Claude Sonnet 4.5 — 1360ms · $0.013/min · 29 Intelligence",
    },
    {
      id: "claude-sonnet-4-20250514",
      label: "Claude Sonnet 4 — 1140ms · $0.013/min · 26 Intelligence",
    },
    {
      id: "claude-haiku-4-5-20251001",
      label: "Claude Haiku 4.5 — 690ms · $0.010/min · 24 Intelligence",
    },
    {
      id: "claude-opus-4-8",
      label: "Claude Opus 4.8 — 1960ms · $0.022/min · 44 Intelligence",
    },
    {
      id: "claude-opus-4-7",
      label: "Claude Opus 4.7 — 1900ms · $0.022/min · 41 Intelligence",
    },
    {
      id: "claude-opus-4-6",
      label: "Claude Opus 4.6 — 1840ms · $0.022/min · 38 Intelligence",
    },
    {
      id: "claude-opus-4-5-20251101",
      label: "Claude Opus 4.5 — 1640ms · $0.022/min · 35 Intelligence",
    },
    {
      id: "claude-opus-4-1",
      label: "Claude Opus 4.1 — 1910ms · $0.065/min · 28 Intelligence",
    },
    {
      id: "claude-opus-4-20250514",
      label: "Claude Opus 4 — 1970ms · $0.065/min · 26 Intelligence",
    },
    {
      id: "claude-fable-5",
      label: "Claude Fable 5 — 2400ms · $0.043/min · 48 Intelligence",
    },
  ],
};

const openAIVoiceOptions: Option<VoiceId>[] = [
  { id: "openai-Alloy", label: "Alloy - neutral" },
  { id: "openai-Ash", label: "Ash - male, deep" },
  { id: "openai-Ballad", label: "Ballad - neutral, warm" },
  { id: "openai-Coral", label: "Coral - female, bright" },
  { id: "openai-Echo", label: "Echo - male" },
  { id: "openai-Sage", label: "Sage - neutral, calm" },
  { id: "openai-Shimmer", label: "Shimmer - female" },
  { id: "openai-Verse", label: "Verse - male, expressive" },
  { id: "openai-Marin", label: "Marin - female, natural" },
  { id: "openai-Cedar", label: "Cedar - male, natural" },
  { id: "openai-Fable", label: "Fable - expressive" },
  { id: "openai-Nova", label: "Nova - warm" },
  { id: "openai-Onyx", label: "Onyx - deep" },
];


const elevenLabsVoiceModels: Option<VoiceModel>[] = [
  { id: "eleven_flash_v2_5", label: "Eleven Flash v2.5 - fastest" },
  { id: "eleven_turbo_v2_5", label: "Eleven Turbo v2.5" },
  { id: "eleven_multilingual_v2", label: "Eleven Multilingual v2" },
];

const openAIVoiceModels: Option<VoiceModel>[] = [
  { id: "gpt-4o-mini-tts", label: "GPT-4o Mini TTS" },
  { id: "tts-1", label: "TTS-1" },
  { id: "tts-1-hd", label: "TTS-1 HD" },
];

const openAIRealtimeModels: Option<OpenAIRealtimeModel>[] = [
  { id: "gpt-realtime-2.1-mini", label: "GPT Realtime 2.1 Mini" },
  { id: "gpt-realtime-2.1", label: "GPT Realtime 2.1" },
  { id: "gpt-realtime-2", label: "GPT Realtime 2" },
  { id: "gpt-realtime-1.5", label: "GPT Realtime 1.5" },
  { id: "gpt-realtime-mini", label: "GPT Realtime Mini" },
  { id: "gpt-realtime", label: "GPT Realtime" },
];
const defaultOpenAIRealtimeModel: OpenAIRealtimeModel = "gpt-realtime-2.1-mini";
const openAIRealtimeVoiceIds = new Set<VoiceId>([
  "openai-Alloy",
  "openai-Ash",
  "openai-Ballad",
  "openai-Coral",
  "openai-Echo",
  "openai-Sage",
  "openai-Shimmer",
  "openai-Verse",
  "openai-Marin",
  "openai-Cedar",
]);
const openAIRealtimeVoiceOptions = openAIVoiceOptions.filter((option) =>
  openAIRealtimeVoiceIds.has(option.id)
);

function normalizeOpenAIRealtimeVoice(voice: VoiceId): VoiceId {
  if (openAIRealtimeVoiceIds.has(voice)) return voice;
  if (voice === "openai-Fable") return "openai-Ballad";
  if (voice === "openai-Nova") return "openai-Shimmer";
  if (voice === "openai-Onyx") return "openai-Ash";
  return "openai-Alloy";
}

function usesOpenAIRealtime(agent: Pick<Agent, "voice">): boolean {
  return agent.voice.provider === "openai_realtime";
}

const legacyOpenAIVoiceIds = new Set<VoiceId>([
  "openai-Alloy",
  "openai-Ash",
  "openai-Coral",
  "openai-Echo",
  "openai-Fable",
  "openai-Nova",
  "openai-Onyx",
  "openai-Sage",
  "openai-Shimmer",
]);

// voiceSearchTerms feeds the agent list search. ElevenLabs voices are matched
// on the saved name and id since there is no local option list for them.
function voiceSearchTerms(voice: VoiceConfig): string[] {
  if (voice.provider === "11labs") {
    return [voice.eleven_voice_name, voice.eleven_voice_id];
  }
  return [voice.voice, optionLabel(openAIVoiceOptions, voice.voice)];
}

function openAIVoicesForModel(model: VoiceModel): Option<VoiceId>[] {
  return model === "tts-1" || model === "tts-1-hd"
    ? openAIVoiceOptions.filter((option) => legacyOpenAIVoiceIds.has(option.id))
    : openAIVoiceOptions;
}

// ElevenLabs voices come from the live catalogue (see VoiceLibraryModal). These
// premade ids are only the starting point and the offline fallback shown when
// the catalogue cannot be reached; Lauren mirrors the database default.
const defaultElevenLabsVoice = { voice_id: "DODLEQrClDo8wCz460ld", voice_name: "Lauren" };

const elevenLabsPresetVoices: LibraryVoice[] = [
  { voice_id: "DODLEQrClDo8wCz460ld", name: "Lauren", description: "Warm, friendly", owned: true },
  { voice_id: "pNInz6obpgDQGcFmaJgB", name: "Adam", description: "Dominant, firm", owned: true },
  { voice_id: "Xb7hH8MSUJpSbSDYk0k2", name: "Alice", description: "Clear, engaging", owned: true },
  { voice_id: "EXAVITQu4vr4xnSDxMaL", name: "Bella", description: "Professional, bright", owned: true },
  { voice_id: "pqHfZKP75CvOlQylNhV4", name: "Bill", description: "Wise, mature, balanced", owned: true },
  { voice_id: "nPczCjzI2devNBz1zQrb", name: "Brian", description: "Deep, resonant", owned: true },
];

const voiceProviders: Option<CallProvider>[] = [
  { id: "openai_realtime", label: "OpenAI Realtime" },
  { id: "openai", label: "OpenAI (Standard)" },
  { id: "11labs", label: "ElevenLabs" },
];

const transcriberProviderOptions: Option<TranscriberProvider>[] = [
  { id: "openai", label: "OpenAI" },
  { id: "11labs", label: "ElevenLabs" },
];

const transcriberModels: Record<TranscriberProvider, Option<TranscriberModel>[]> = {
  openai: [
    { id: "gpt-4o-transcribe", label: "GPT-4o Transcribe" },
    { id: "gpt-4o-mini-transcribe", label: "GPT-4o Mini Transcribe" },
    { id: "gpt-4o-transcribe-diarize", label: "GPT-4o Transcribe Diarize" },
    { id: "whisper-1", label: "Whisper" },
  ],
  "11labs": [
    { id: "scribe_v1", label: "Scribe v1 — 420ms · 3.0% WER · $0.013/min" },
    { id: "scribe_v2", label: "Scribe v2 (Beta) — 570ms · 2.4% WER · $0.013/min" },
    { id: "scribe_v2_realtime", label: "Scribe v2 Realtime (Beta) — 460ms · 2.8% WER · $0.013/min" },
  ],
};

const transcriberLanguageOptions: Option<TranscriberLanguage>[] = [
  { id: "en", label: "English" },
  { id: "bn", label: "Bangla" },
  { id: "es", label: "Spanish" },
  { id: "fr", label: "French" },
  { id: "de", label: "German" },
];

const callDirectionOptions: Option<CallDirection>[] = [
  { id: "inbound", label: "Inbound" },
  { id: "outbound", label: "Outbound" },
  { id: "both", label: "Both" },
];

const phoneStatusLabels: Record<PhoneNumberStatus, string> = {
  pending_qr: "Pending QR",
  connected: "Connected",
  disconnected: "Disconnected",
  failed: "Failed",
  expired: "Expired",
};

// A login session stops producing new QR codes once it reaches one of these,
// so polling stops there too.
const terminalLoginStatuses = new Set<PhoneNumberStatus>(["connected", "failed", "expired"]);

const beginModeOptions: Option<BeginMessageMode>[] = [
  { id: "agent_speaks_first", label: "Agent speaks first" },
  { id: "agent_waits_for_user", label: "Agent waits for user" },
  {
    id: "agent_speaks_first_with_model_generated_message",
    label: "Agent speaks first (model-generated)",
  },
];

const configSections: { id: ConfigSectionId; label: string; icon: IconName }[] = [
  { id: "model", label: "Model", icon: "cube" },
  { id: "transcriber", label: "Transcriber", icon: "mic" },
  { id: "voice", label: "Voice & Live Audio", icon: "speaker" },
  { id: "knowledge-base", label: "Knowledge Base", icon: "book" },
  { id: "tools", label: "Tools", icon: "wrench" },
];

const navItems: { label: string; badge?: string; icon: IconName; href?: string }[] = [
  { label: "Dashboard", icon: "grid", href: "/dashboard" },
  { label: "Agents", badge: "6", icon: "agents", href: "/dashboard/agents" },
  { label: "Phone Numbers", icon: "phone", href: "/dashboard/phone-numbers" },
  { label: "Knowledge Base", icon: "book", href: "/dashboard/knowledge-base" },
  { label: "Tools", icon: "wrench", href: "/dashboard/tools" },
  { label: "API Keys", icon: "key", href: "/dashboard/api-keys" },
  { label: "Calls", icon: "phone", href: "/dashboard/calls" },
  { label: "Outbound", icon: "target", href: "/dashboard/outbound" },
  { label: "Demo Call", icon: "phoneOut", href: "/dashboard/demo-call" },
  { label: "Appointments", badge: "12", icon: "calendar" },
  { label: "Analytics", icon: "chart" },
  { label: "Settings", icon: "settings" },
];

// defaultVoice mirrors the schema's voice defaults (OpenAI). Speed and volume
// are persisted and applied to live calls; the ElevenLabs knobs
// (stability/similarity_boost/style/speaker_boost) and response_format are
// still client-side only — the backend does not persist them.
const defaultVoice: VoiceConfig = {
  provider: "openai",
  voice: "openai-Alloy",
  eleven_voice_id: defaultElevenLabsVoice.voice_id,
  eleven_voice_name: defaultElevenLabsVoice.voice_name,
  model: "tts-1",
  realtime_model: defaultOpenAIRealtimeModel,
  speed: 1,
  volume: 1,
  stability: 0.5,
  similarity_boost: 0.8,
  style: 0,
  speaker_boost: false,
  openai_instructions: "Speak in a calm, empathetic tone.",
  response_format: "mp3",
};

// ── API ⇄ UI mapping ──
// The server groups agent config into sections (agent/model/prompt/voice/
// transcriber); the editor state is the flatter Agent shape above.

function pickOption<T extends string>(
  options: Option<T>[],
  value: string | null | undefined,
  fallback: T
): T {
  return options.some((option) => option.id === value) ? (value as T) : fallback;
}

function firstEnabledOption<T extends string>(options: Option<T>[]): T {
  return (options.find((option) => !option.disabled) ?? options[0]).id;
}

function statusFromApi(status: string | undefined): AgentStatus {
  return status === "inactive" ? "paused" : "live";
}

function statusToApi(status: AgentStatus): "active" | "inactive" {
  return status === "paused" ? "inactive" : "active";
}

// The backend has no role field; derive the list-row subtitle from the call
// direction instead.
function roleLabel(direction: CallDirection): string {
  if (direction === "inbound") return "Inbound Calls";
  if (direction === "outbound") return "Outbound Calls";
  return "Inbound & Outbound";
}

function voiceConfigFromApi(voice: ApiVoiceSection | null | undefined): VoiceConfig {
  const rawProvider = voice?.provider?.trim().toLowerCase();
  const hasSavedElevenLabsVoice = Boolean(voice?.elevenlabs?.voice_id) && !voice?.openai?.voice_id;
  const provider: CallProvider =
    rawProvider === "11labs" || rawProvider === "elevenlabs" || rawProvider === "eleven_labs" || (!rawProvider && hasSavedElevenLabsVoice)
      ? "11labs"
      : rawProvider === "openai_realtime" || rawProvider === "openai-realtime" || rawProvider === "realtime"
        ? "openai_realtime"
        : "openai";
  if (provider === "11labs") {
    // Any ElevenLabs voice id is valid here — the catalogue is remote, so a
    // saved id is trusted as-is and only falls back when the agent has none.
    const elevenVoiceID = voice?.elevenlabs?.voice_id?.trim();
    const elevenVoiceName = voice?.elevenlabs?.voice_name?.trim();
    return {
      ...defaultVoice,
      provider,
      eleven_voice_id: elevenVoiceID || defaultElevenLabsVoice.voice_id,
      eleven_voice_name:
        elevenVoiceName ||
        elevenLabsPresetVoices.find((preset) => preset.voice_id === elevenVoiceID)?.name ||
        (elevenVoiceID ? "Custom voice" : defaultElevenLabsVoice.voice_name),
      model: pickOption(elevenLabsVoiceModels, voice?.elevenlabs?.voice_model, "eleven_flash_v2_5"),
      openai_instructions: voice?.openai?.instructions ?? defaultVoice.openai_instructions,
      speed: voice?.openai?.speed ?? defaultVoice.speed,
      volume: voice?.openai?.volume ?? defaultVoice.volume,
    };
  }

  const rawId = (voice?.openai?.voice_id ?? "alloy").toLowerCase();
  const openAIModel = pickOption(openAIVoiceModels, voice?.openai?.voice_model, "tts-1");
  return {
    ...defaultVoice,
    provider,
    voice: pickOption(openAIVoicesForModel(openAIModel), `openai-${capitalize(rawId)}`, "openai-Alloy"),
    model: openAIModel,
    realtime_model: pickOption(
      openAIRealtimeModels,
      voice?.openai?.realtime_model,
      defaultOpenAIRealtimeModel
    ),
    openai_instructions: voice?.openai?.instructions ?? defaultVoice.openai_instructions,
    speed: voice?.openai?.speed ?? defaultVoice.speed,
    volume: voice?.openai?.volume ?? defaultVoice.volume,
  };
}

function voicePayload(voice: VoiceConfig): ApiVoiceSection {
  if (voice.provider !== "11labs") {
    const rawId = voice.voice.replace(/^openai-/, "").toLowerCase();
    return {
      provider: voice.provider,
      openai: {
        voice_id: rawId,
        voice_name: capitalize(rawId),
        voice_model: voice.model,
        realtime_model: voice.realtime_model,
        instructions: voice.openai_instructions || null,
        speed: voice.speed,
        volume: voice.volume,
      },
    };
  }

  const voiceID = voice.eleven_voice_id.trim() || defaultElevenLabsVoice.voice_id;
  const voiceName = voice.eleven_voice_name.trim() || defaultElevenLabsVoice.voice_name;
  return {
    provider: "11labs",
    // These columns predate ElevenLabs realtime but now back the shared speed,
    // volume, and speaking-style controls for either live provider.
    openai: {
      instructions: voice.openai_instructions || null,
      speed: voice.speed,
      volume: voice.volume,
    },
    elevenlabs: {
      voice_id: voiceID,
      voice_name: voiceName,
      voice_model: voice.model,
    },
  };
}

function agentFromApi(res: ApiAgentResource): Agent {
  const agent = res.agent;
  const model = res.model;
  const prompt = res.prompt;
  const transcriber = res.transcriber;

  const callDirection = pickOption(callDirectionOptions, agent?.call_direction, "both");
  const llmProvider = pickOption(llmProviders, model?.provider, "openai");
  let voiceConfig = voiceConfigFromApi(res.voice);
  if (voiceConfig.provider === "openai_realtime") {
    voiceConfig = { ...voiceConfig, voice: normalizeOpenAIRealtimeVoice(voiceConfig.voice) };
  }
  // Live audio is one provider-owned pipeline. Normalize legacy mismatches
  // (for example OpenAI voice + saved Scribe) so the editor reflects what the
  // server will actually run.
  const transcriberProvider: TranscriberProvider = voiceConfig.provider === "11labs" ? "11labs" : "openai";

  return {
    id: res.id,
    name: agent?.name ?? "Agent",
    role: roleLabel(callDirection),
    status: statusFromApi(agent?.status),
    language: agent?.language || "en-US",
    timezone: agent?.timezone ?? "",
    phone_number_id: agent?.phone_number_id ?? null,
    call_direction: callDirection,
    begin_message_mode: pickOption(
      beginModeOptions,
      prompt?.begin_message_mode,
      "agent_speaks_first"
    ),
    welcome_message: prompt?.begin_message ?? "",
    welcome_delay_ms: prompt?.begin_message_delay_ms ?? 1000,
    system_prompt: prompt?.system_prompt ?? "",
    llm: {
      provider: llmProvider,
      model: pickOption(llmModels[llmProvider], model?.name, firstEnabledOption(llmModels[llmProvider])),
      temperature: model?.temperature || 0.3,
    },
    voice: voiceConfig,
    transcriber: {
      provider: transcriberProvider,
      language: pickOption(transcriberLanguageOptions, transcriber?.language, "en"),
      model: pickOption(
        transcriberModels[transcriberProvider],
        transcriberProvider === "openai"
          ? transcriber?.openai?.model
          : transcriber?.elevenlabs?.model,
        transcriberModels[transcriberProvider][0].id
      ),
    },
    knowledge_base_ids: res.knowledge_base?.knowledge_base_ids ?? [],
    tool_ids: res.tools?.tool_ids ?? [],
  };
}

// agentToPayload serializes the full editor state for PATCH. The backend
// replaces knowledge_base_ids and tool_ids wholesale when the keys are present,
// so publishing always syncs the complete configuration.
function agentToPayload(agent: Agent): AgentPayload {
  return {
    agent: {
      name: agent.name,
      language: agent.language,
      timezone: agent.timezone || null,
      phone_number_id: agent.phone_number_id || null,
      call_direction: agent.call_direction,
      status: statusToApi(agent.status),
    },
    model: {
      provider: agent.llm.provider,
      name: agent.llm.model,
      temperature: agent.llm.temperature,
    },
    prompt: {
      begin_message_mode: agent.begin_message_mode,
      begin_message: agent.welcome_message,
      begin_message_delay_ms: agent.welcome_delay_ms,
      system_prompt: agent.system_prompt,
    },
    voice: voicePayload(agent.voice),
    transcriber: {
      provider: agent.transcriber.provider,
      language: agent.transcriber.language,
      ...(agent.transcriber.provider === "openai"
        ? { openai: { model: agent.transcriber.model } }
        : { elevenlabs: { model: agent.transcriber.model } }),
    },
    tools: {
      tool_ids: agent.tool_ids,
    },
    knowledge_base: {
      knowledge_base_ids: agent.knowledge_base_ids,
    },
  };
}

function createFormToPayload(form: CreateForm): AgentPayload {
  return {
    agent: {
      name: form.name.trim(),
      language: form.language,
      timezone: form.timezone,
      phone_number_id: form.phone_number_id || null,
      call_direction: form.call_direction,
    },
    model: {
      provider: form.llm_provider,
      name: form.llm_model,
      temperature: form.llm_temperature,
    },
    prompt: {
      begin_message_mode: form.begin_message_mode,
      begin_message: form.welcome_message,
      system_prompt: form.system_prompt,
    },
    voice: voicePayload({
      ...defaultVoice,
      provider: form.voice_provider,
      voice: form.voice,
      eleven_voice_id: form.eleven_voice_id,
      eleven_voice_name: form.eleven_voice_name,
      model: form.voice_model,
      realtime_model: form.realtime_model,
      speed: form.voice_speed,
    }),
    transcriber: {
      provider: form.transcriber_provider,
      language: form.transcriber_language,
      ...(form.transcriber_provider === "openai"
        ? { openai: { model: form.transcriber_model } }
        : { elevenlabs: { model: form.transcriber_model } }),
    },
  };
}

// directionBlocks reports whether an existing agent's use of a number blocks a
// new assignment with call direction `want`. A "both" selection may take any
// number and then clears that number from other agents on save/create.
function directionBlocks(want: CallDirection, held: CallDirection): boolean {
  if (want === "both") return false;
  return held === "both" || held === want;
}

// phoneNumberTakenByOther marks numbers already held by a different agent for
// an overlapping direction. Those numbers stay visible but cannot be selected.
function phoneNumberTakenByOther(
  agents: Agent[],
  direction: CallDirection,
  selfId: string | null,
  phoneNumberId: string
): boolean {
  return agents.some(
    (agent) =>
      agent.id !== selfId &&
      agent.phone_number_id === phoneNumberId &&
      directionBlocks(direction, agent.call_direction)
  );
}

function phoneNumberSelectedByOther(
  agents: Agent[],
  direction: CallDirection,
  selfId: string | null,
  phoneNumberId: string
): boolean {
  return agents.some(
    (agent) =>
      agent.id !== selfId &&
      agent.phone_number_id === phoneNumberId &&
      (direction === "both" || directionBlocks(direction, agent.call_direction))
  );
}

// unassignStolenNumber mirrors the server's "both" steal: when `claimer` carries
// a phone number for both call directions, that number is exclusive, so the
// server just unassigned it from every other agent. Drop it locally too.
function unassignStolenNumber(agents: Agent[], claimer: Agent): Agent[] {
  if (claimer.call_direction !== "both" || !claimer.phone_number_id) return agents;
  return agents.map((agent) =>
    agent.id !== claimer.id && agent.phone_number_id === claimer.phone_number_id
      ? { ...agent, phone_number_id: null }
      : agent
  );
}

// assignPhoneNumber puts a number on one agent and leaves the rest alone. A
// number the agent already carries wins, so a QR scan that finishes after the
// user picked something else never overwrites that pick — the same rule the
// server applies when it assigns the scanned number. This only mirrors that
// server-side assignment into the editor, which is already saved by the time
// the poll sees the number connected.
function assignPhoneNumber(agents: Agent[], agentId: string, phoneNumberId: string): Agent[] {
  return agents.map((agent) =>
    agent.id === agentId && !agent.phone_number_id
      ? { ...agent, phone_number_id: phoneNumberId }
      : agent
  );
}

// withClientOnly re-applies the knobs the backend does not persist after a
// saved agent comes back from the API, so local tweaks survive a publish.
function withClientOnly(previous: Agent, next: Agent): Agent {
  return {
    ...next,
    voice: {
      ...next.voice,
      // speed and volume are persisted now, so they come back from the API and
      // must not be overwritten with the pre-save local values.
      stability: previous.voice.stability,
      similarity_boost: previous.voice.similarity_boost,
      style: previous.voice.style,
      speaker_boost: previous.voice.speaker_boost,
    },
  };
}

function iconPaths(name: IconName): ReactNode {
  switch (name) {
    case "grid":
      return (
        <>
          <rect height="9" rx="1.5" width="7" x="3" y="3" />
          <rect height="5" rx="1.5" width="7" x="14" y="3" />
          <rect height="9" rx="1.5" width="7" x="14" y="12" />
          <rect height="5" rx="1.5" width="7" x="3" y="16" />
        </>
      );
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
    case "phoneOut":
      return (
        <>
          <path d="M16 8l5-5" />
          <path d="M21 3h-4M21 3v4" />
          <path d="M21 16.5v3a2 2 0 01-2.2 2 19.5 19.5 0 01-8.5-3 19.2 19.2 0 01-6-6 19.5 19.5 0 01-3-8.5A2 2 0 013.5 2h3a2 2 0 012 1.7c.1.9.3 1.8.6 2.6a2 2 0 01-.4 2.1L9.5 11.5a16 16 0 006 6l1.1-1.2a2 2 0 012.1-.4c.8.3 1.7.5 2.6.6a2 2 0 011.6 2z" />
        </>
      );
    case "calendar":
      return (
        <>
          <rect height="18" rx="2" width="18" x="3" y="4" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </>
      );
    case "chart":
      return (
        <>
          <path d="M4 19V5" />
          <path d="M8 19v-6M12 19V9M16 19v-8M20 19V7" />
        </>
      );
    case "settings":
      return (
        <>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.6 1.6 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.6 1.6 0 00-1.8-.3 1.6 1.6 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.6 1.6 0 00-1-1.5 1.6 1.6 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.6 1.6 0 00.3-1.8 1.6 1.6 0 00-1.5-1H3a2 2 0 110-4h.1a1.6 1.6 0 001.5-1 1.6 1.6 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.6 1.6 0 001.8.3H9a1.6 1.6 0 001-1.5V3a2 2 0 114 0v.1a1.6 1.6 0 001 1.5 1.6 1.6 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.6 1.6 0 00-.3 1.8V9a1.6 1.6 0 001.5 1H21a2 2 0 110 4h-.1a1.6 1.6 0 00-1.5 1z" />
        </>
      );
    case "key":
      return (
        <>
          <circle cx="7.5" cy="14.5" r="3.5" />
          <path d="M10 12l8-8" />
          <path d="M14 8l2 2" />
          <path d="M16 6l2 2" />
        </>
      );
    case "book":
      return (
        <>
          <path d="M4 4.5A2.5 2.5 0 016.5 2H20v15H6.5A2.5 2.5 0 004 19.5z" />
          <path d="M4 19.5A2.5 2.5 0 016.5 17H20v5H6.5A2.5 2.5 0 014 19.5z" />
        </>
      );
    case "file":
      return (
        <>
          <path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z" />
          <path d="M14 3v5h5" />
        </>
      );
    case "globe":
      return (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18" />
          <path d="M12 3a15 15 0 010 18 15 15 0 010-18z" />
        </>
      );
    case "transfer":
      return (
        <>
          <path d="M4 8h13" />
          <path d="M14 5l3 3-3 3" />
          <path d="M20 16H7" />
          <path d="M10 13l-3 3 3 3" />
        </>
      );
    case "phoneOff":
      return (
        <>
          <path d="M10.7 5.1A16 16 0 0112 5a2 2 0 012 1.7c.1.9.3 1.8.7 2.7a2 2 0 01-.5 2.1l-.8.8" />
          <path d="M6.6 6.6a19.8 19.8 0 002.9 8 19.5 19.5 0 006 6c1.3.6 2.6 1 4 1.2A2 2 0 0021.5 20v-2.6a2 2 0 00-1.7-2 12 12 0 01-2.7-.7" />
          <path d="M3 3l18 18" />
        </>
      );
    case "wrench":
      return <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.8-3.8a6 6 0 01-7.9 7.9l-6.9 6.9a2.1 2.1 0 01-3-3l6.9-6.9a6 6 0 017.9-7.9l-3.8 3.8z" />;
    case "plus":
      return <path d="M12 5v14M5 12h14" />;
    case "search":
      return (
        <>
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </>
      );
    case "play":
      return <path d="M8 5v14l11-7z" />;
    case "pause":
      return <path d="M9 5v14M15 5v14" />;
    case "upload":
      return (
        <>
          <path d="M12 3v12" />
          <path d="M7 8l5-5 5 5" />
          <path d="M5 21h14" />
        </>
      );
    case "speaker":
      return (
        <>
          <path d="M4 12h3l4-5v10l-4-5H4z" />
          <path d="M15 9a4 4 0 010 6M18 6a8 8 0 010 12" />
        </>
      );
    case "trash":
      return (
        <>
          <path d="M3 6h18" />
          <path d="M8 6V4h8v2" />
          <path d="M6 6l1 15h10l1-15" />
          <path d="M10 11v6M14 11v6" />
        </>
      );
    case "chevron":
      return <path d="M6 9l6 6 6-6" />;
    case "cube":
      return (
        <>
          <path d="M12 3l7 4v10l-7 4-7-4V7l7-4z" />
          <path d="M12 8v8M8.5 10l7 4M15.5 10l-7 4" />
        </>
      );
    case "mic":
      return (
        <>
          <path d="M12 3a3 3 0 00-3 3v5a3 3 0 006 0V6a3 3 0 00-3-3z" />
          <path d="M5 10a7 7 0 0014 0M12 17v4M8 21h8" />
        </>
      );
    case "message":
      return (
        <>
          <path d="M4.5 7.5A2.5 2.5 0 017 5h10a2.5 2.5 0 012.5 2.5v5A2.5 2.5 0 0117 15h-4l-4 4v-4H7a2.5 2.5 0 01-2.5-2.5z" />
          <path d="M8.5 9h7M8.5 12h4" />
        </>
      );
    case "refresh":
      return (
        <>
          <path d="M4 4v6h6" />
          <path d="M20 20v-6h-6" />
          <path d="M20 9a8 8 0 00-13.5-3L4 10M4 15a8 8 0 0013.5 3L20 14" />
        </>
      );
    case "hash":
      return (
        <>
          <path d="M7 8h10M7 16h10" />
          <path d="M9 4L7 20M17 4l-2 16" />
        </>
      );
    case "check":
      return <path d="M5 12.5l4.2 4.2L19 7" />;
    case "spark":
      return <path d="M12 4l1.7 4.6L18 10l-4.3 1.4L12 16l-1.7-4.6L6 10l4.3-1.4L12 4z" />;
    case "target":
      return (
        <>
          <circle cx="12" cy="12" r="8.5" />
          <circle cx="12" cy="12" r="4.5" />
          <circle cx="12" cy="12" r="1" />
        </>
      );
    case "x":
      return <path d="M6 6l12 12M18 6L6 18" />;
  }
}

function Icon({
  name,
  className,
  size = 18,
  stroke = "currentColor",
  sw = 2,
  fill = "none",
}: {
  name: IconName;
  className?: string;
  size?: number;
  stroke?: string;
  sw?: number;
  fill?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill={fill}
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

const css = `
.agents-shell {
  --bg: var(--app-bg);
  --sidebar: var(--app-sidebar);
  --surface: var(--app-surface);
  --surface-2: var(--app-surface-2);
  --panel: var(--app-panel);
  --panel-hover: var(--app-panel-hover);
  --border: var(--app-border);
  --border-strong: var(--app-border-strong);
  --text: var(--app-text);
  --muted: var(--app-muted);
  --subtle: var(--app-subtle);
  --faint: var(--app-faint);
  --primary: var(--app-primary);
  --primary-2: var(--app-primary-2);
  --primary-soft: var(--app-primary-soft);
  --primary-light: var(--app-primary-light);
  --green: var(--app-green);
  --yellow: var(--app-amber);
  --rose: var(--app-rose);
  background: var(--bg);
  color: var(--text);
  display: flex;
  height: 100vh;
  max-height: 100vh;
  width: 100vw;
  max-width: 100vw;
  overflow: hidden;
  font-family: var(--font-manrope), system-ui, sans-serif;
  font-size: 14px;
  line-height: 1.5;
}
.agents-shell * { box-sizing: border-box; }
.agents-shell button, .agents-shell input, .agents-shell select, .agents-shell textarea { font: inherit; }
.agents-shell ::-webkit-scrollbar { height: 9px; width: 9px; }
.agents-shell ::-webkit-scrollbar-thumb { background: var(--app-border-strong); border-radius: 9px; }
.agents-shell ::-webkit-scrollbar-track { background: transparent; }
.agents-sidebar {
  background: var(--sidebar);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  height: 100vh;
  padding: 22px 16px;
  position: sticky;
  top: 0;
  width: 248px;
}
.agents-logo { align-items: center; display: flex; gap: 11px; padding: 4px 8px 26px; }
.agents-logo-mark {
  align-items: center;
  background: linear-gradient(140deg,var(--primary-2),var(--primary));
  border-radius: 10px;
  box-shadow: 0 4px 14px var(--app-primary-glow);
  display: flex;
  height: 34px;
  justify-content: center;
  width: 34px;
}
.agents-nav-kicker { color: var(--faint); font-size: 10.5px; font-weight: 700; letter-spacing: .9px; padding: 4px 10px 8px; text-transform: uppercase; }
.agents-nav { display: flex; flex-direction: column; gap: 3px; }
.agents-nav-item {
  align-items: center;
  border-radius: 10px;
  color: var(--app-nav);
  display: flex;
  font-size: 13.5px;
  font-weight: 600;
  gap: 11px;
  padding: 9px 10px;
  text-decoration: none;
  transition: background .18s ease, color .18s ease;
}
.agents-nav-item:hover { background: var(--app-hover); color: var(--app-text-soft); }
.agents-nav-item.is-active { background: var(--primary-soft); box-shadow: inset 0 0 0 1px var(--app-primary-ring); color: var(--app-primary-text); font-weight: 700; }
.agents-nav-badge { background: var(--primary); border-radius: 20px; color: var(--app-on-accent); font-size: 10.5px; font-weight: 700; margin-left: auto; padding: 1px 7px; }
.agents-sidebar-footer { display: flex; flex-direction: column; gap: 14px; margin-top: auto; }
.agents-link-card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 13px; }
.agents-user-card { align-items: center; background: var(--surface); border: 1px solid var(--border); border-radius: 14px; display: flex; gap: 10px; padding: 10px 13px; }
.agents-user-name { font-size: 12.5px; font-weight: 700; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.agents-user-email { color: var(--app-subtle); font-size: 11.5px; margin-top: 1px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.agents-main { display: flex; flex: 1; flex-direction: column; min-width: 0; height: 100vh; overflow: hidden; }
.agents-topbar {
  align-items: center;
  background: var(--app-topbar);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border);
  display: flex;
  flex: 0 0 auto;
  gap: 16px;
  padding: 20px 32px;
  position: sticky;
  top: 0;
  z-index: 5;
}
.agents-title-wrap { flex: 1; min-width: 0; }
.agents-title { font-size: 21px; font-weight: 800; letter-spacing: -.4px; line-height: 1.15; margin: 0; }
.agents-subtitle { color: var(--subtle); font-size: 12.5px; margin-top: 3px; }
.agents-content { padding: 20px 32px; flex: 1 1 auto; min-height: 0; overflow: hidden; }
.agents-workspace {
  align-items: stretch;
  display: grid;
  gap: 16px;
  grid-template-columns: minmax(250px, 285px) minmax(470px, 1fr) minmax(330px, 370px);
  width: 100%;
  height: 100%;
  min-height: 0;
}
.agents-workspace > * { min-height: 0; max-height: 100%; }
.agents-panel, .agents-card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; box-shadow: 0 1px 2px var(--app-shadow-soft); }
.agents-panel { overflow: hidden; display: flex; flex-direction: column; }
.agents-panel-pad { padding: 16px; flex: 1 1 auto; min-height: 0; overflow-y: auto; }
.agents-column-head { border-bottom: 1px solid var(--border); padding: 16px 16px 14px; flex: 0 0 auto; }
.agents-column-title { font-size: 13px; font-weight: 800; letter-spacing: -.1px; margin: 0; }
.agents-column-copy { color: var(--subtle); font-size: 12px; margin-top: 2px; }
.agents-column-head-split { align-items: center; display: flex; gap: 12px; justify-content: space-between; }
.agents-btn-sm { border-radius: 9px; font-size: 12px; gap: 6px; min-height: 32px; padding: 0 11px; }
.agents-input, .agents-select, .agents-textarea {
  background: var(--panel);
  border: 1px solid var(--app-border);
  border-radius: 11px;
  color: var(--text);
  outline: none;
  transition: border-color .18s ease, box-shadow .18s ease, background .18s ease;
  width: 100%;
}
.agents-input { height: 40px; padding: 0 12px; }
.agents-input::placeholder, .agents-textarea::placeholder { color: var(--faint); }
.agents-input:focus, .agents-select:focus, .agents-textarea:focus {
  background: var(--app-input-focus);
  border-color: var(--app-primary-ring-strong);
  box-shadow: 0 0 0 4px var(--app-primary-ring);
}
.agents-select {
  appearance: none;
  background-image: linear-gradient(45deg, transparent 50%, var(--app-muted) 50%), linear-gradient(135deg, var(--app-muted) 50%, transparent 50%);
  background-position: calc(100% - 17px) 50%, calc(100% - 12px) 50%;
  background-repeat: no-repeat;
  background-size: 5px 5px, 5px 5px;
  height: 40px;
  padding: 0 34px 0 12px;
}
.agents-select option { background: var(--surface); color: var(--text); }
.agents-textarea { line-height: 1.55; min-height: 106px; padding: 12px; resize: vertical; }
.control-label { color: var(--faint); display: block; font-size: 10.5px; font-weight: 800; letter-spacing: .8px; margin-bottom: 7px; text-transform: uppercase; }
.field-row { display: grid; gap: 7px; }
.field-label { color: var(--subtle); font-size: 11.5px; font-weight: 700; }
.field-hint { color: var(--faint); font-size: 11.5px; line-height: 1.5; margin-top: -4px; }
.field-row-disabled { cursor: not-allowed; }
.field-row-disabled .field-label, .field-row-disabled .range-value { color: var(--faint); }
.agents-range:disabled { cursor: not-allowed; opacity: .45; }
.agents-select:disabled {
  background-image: none;
  color: var(--subtle);
  cursor: not-allowed;
  opacity: .55;
}
.search-wrap { margin-bottom: 12px; position: relative; }
.search-icon { color: var(--subtle); left: 12px; position: absolute; top: 50%; transform: translateY(-50%); }
.search-input { padding-left: 38px; }
.agents-list { display: flex; flex-direction: column; gap: 8px; }
.agent-row {
  align-items: center;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 13px;
  color: inherit;
  cursor: pointer;
  display: grid;
  gap: 10px;
  grid-template-columns: 38px minmax(0, 1fr) auto;
  padding: 10px;
  text-align: left;
  transition: background .18s ease, border-color .18s ease;
  width: 100%;
}
.agent-row:hover { background: var(--app-hover); }
.agent-row.is-selected { background: var(--primary-soft); border-color: var(--app-primary-border); box-shadow: inset 0 0 0 1px var(--app-primary-ring); }
.agent-avatar {
  align-items: center;
  border: 1px solid var(--app-border-strong);
  border-radius: 50%;
  color: var(--app-on-accent);
  display: flex;
  flex-shrink: 0;
  font-size: 13px;
  font-weight: 800;
  height: 38px;
  justify-content: center;
  width: 38px;
}
.agent-avatar-large { font-size: 16px; height: 46px; width: 46px; }
.agent-name, .agent-role { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.agent-name { font-size: 13.5px; font-weight: 800; }
.agent-role { color: var(--subtle); font-size: 11.5px; font-weight: 500; }
.status-pill {
  align-items: center;
  border-radius: 20px;
  display: inline-flex;
  font-size: 11.5px;
  font-weight: 800;
  gap: 6px;
  line-height: 1;
  padding: 5px 8px;
  white-space: nowrap;
}
.status-dot { border-radius: 50%; height: 6px; width: 6px; }
.agents-editor { display: flex; flex-direction: column; gap: 16px; min-width: 0; overflow-y: auto; padding-right: 4px; }
.agent-detail-head { align-items: center; display: grid; gap: 16px; grid-template-columns: minmax(0, 1fr) auto; padding: 18px; }
.agent-identity { align-items: center; display: grid; gap: 13px; grid-template-columns: 46px minmax(0, 1fr); min-width: 0; }
.agent-heading-row { align-items: center; display: flex; flex-wrap: wrap; gap: 8px; }
.agent-heading { font-size: 20px; font-weight: 850; letter-spacing: -.35px; line-height: 1.1; margin: 0; }
.tag-badge, .config-badge {
  background: var(--app-border);
  border: 1px solid var(--app-border-strong);
  border-radius: 999px;
  color: var(--app-text-soft);
  display: inline-flex;
  font-size: 11.5px;
  font-weight: 800;
  line-height: 1;
  padding: 5px 8px;
  white-space: nowrap;
}
.model-tag { background: var(--primary-soft); border-color: var(--app-primary-ring); color: var(--primary-light); }
.model-picker { position: relative; display: inline-flex; min-width: 0; }
.model-picker-trigger {
  align-items: center;
  background: var(--primary-soft);
  border: 1px solid var(--app-primary-ring);
  color: var(--primary-light);
  cursor: pointer;
  display: inline-flex;
  gap: 6px;
  min-height: 40px;
}
.model-picker-trigger:hover { border-color: var(--app-primary-ring-strong); }
.model-picker-trigger .chevron { color: var(--primary-light); transition: transform .18s ease; }
.model-picker-trigger .chevron.is-open { transform: rotate(180deg); }
.model-picker-icon-openai { color: var(--app-muted); }
.model-picker-icon-anthropic { color: #e07b39; }
.model-picker-panel {
  background: var(--surface, var(--app-panel));
  border: 1px solid var(--app-border-strong);
  border-radius: 14px;
  box-shadow: 0 20px 48px var(--app-shadow-color);
  left: 0;
  max-height: 420px;
  overflow-y: auto;
  padding: 6px;
  position: absolute;
  top: calc(100% + 8px);
  width: 320px;
  z-index: 40;
}
.model-picker-section + .model-picker-section { border-top: 1px solid var(--app-border); margin-top: 4px; padding-top: 4px; }
.model-picker-section-head {
  align-items: center;
  background: none;
  border: none;
  color: var(--subtle);
  cursor: pointer;
  display: flex;
  font-size: 11px;
  font-weight: 800;
  justify-content: space-between;
  letter-spacing: .2px;
  padding: 8px 10px;
  width: 100%;
}
.model-picker-section-head .chevron { transition: transform .18s ease; }
.model-picker-section-head .chevron.is-open { transform: rotate(180deg); }
.model-picker-list { display: flex; flex-direction: column; }
.model-picker-row {
  align-items: center;
  background: none;
  border: none;
  border-radius: 9px;
  color: var(--text);
  cursor: pointer;
  display: flex;
  gap: 9px;
  padding: 8px 10px;
  text-align: left;
  width: 100%;
}
.model-picker-row:hover { background: var(--app-border); }
.model-picker-row.is-selected { background: var(--app-primary-soft); }
.model-picker-row-label { flex: 1; font-size: 13px; font-weight: 650; min-width: 0; }
.model-picker-suggested {
  background: var(--app-border-strong);
  border-radius: 999px;
  color: var(--subtle);
  font-size: 10.5px;
  font-weight: 700;
  padding: 3px 8px;
  white-space: nowrap;
}
.model-picker-price { color: var(--subtle); font-size: 12px; font-weight: 600; white-space: nowrap; }
.model-control { min-width: 0; }
.model-control .model-picker { display: flex; width: 100%; }
.model-control .model-picker-trigger {
  border-radius: 11px;
  justify-content: space-between;
  padding: 0 12px;
  width: 100%;
}
.model-control .model-picker-trigger .model-picker-icon { flex-shrink: 0; }
.model-control .model-picker-panel { width: min(360px, calc(100vw - 48px)); }
.agent-meta { color: var(--subtle); font-size: 12.5px; margin-top: 4px; }
.agent-actions { display: flex; flex-wrap: wrap; gap: 8px; justify-content: flex-end; }
.agents-btn {
  align-items: center;
  border: 1px solid var(--app-border-strong);
  border-radius: 11px;
  cursor: pointer;
  display: inline-flex;
  font-weight: 800;
  gap: 8px;
  min-height: 40px;
  justify-content: center;
  padding: 0 14px;
  transition: filter .18s ease, background .18s ease, border-color .18s ease, transform .18s ease;
  white-space: nowrap;
}
.agents-btn:hover { transform: translateY(-1px); }
.agents-btn:disabled { cursor: not-allowed; filter: grayscale(.35); opacity: .45; transform: none; }
.agents-btn-primary { background: linear-gradient(140deg,var(--primary-2),var(--primary)); border-color: transparent; box-shadow: 0 4px 14px var(--app-primary-glow); color: var(--app-on-accent); }
.agents-btn-primary:hover { filter: brightness(1.08); }
.agents-btn-secondary { background: var(--panel-hover); color: var(--text); }
.agents-btn-secondary:hover { background: var(--app-panel-hover); }
.dot-select { position: relative; }
.dot-select::before { background: var(--green); border-radius: 50%; content: ""; height: 6px; left: 12px; position: absolute; top: 50%; transform: translateY(-50%); width: 6px; z-index: 1; }
.dot-select .agents-select { padding-left: 28px; }
.editor-card { padding: 16px; }
.editor-card-grow { min-height: 245px; }
.editor-card-head { align-items: center; display: flex; gap: 12px; justify-content: space-between; margin-bottom: 12px; }
.editor-card-title { font-size: 13.5px; font-weight: 850; letter-spacing: -.1px; margin: 0; }
.mini-select { max-width: 190px; }
.helper-line { color: var(--subtle); font-size: 12px; margin-top: 9px; }
.config-notice {
  background: var(--app-primary-soft);
  border: 1px solid var(--app-primary-ring);
  border-radius: 12px;
  color: var(--subtle);
  display: grid;
  font-size: 12px;
  gap: 8px;
  line-height: 1.5;
  margin-bottom: 12px;
  padding: 11px 12px;
}
.config-notice strong { color: var(--text); font-size: 12px; }
.config-notice code { color: var(--primary-light); font-family: var(--font-geist-mono), monospace; font-size: 11px; }
.config-notice-live { background: var(--app-green-soft); border-color: var(--app-green-soft-2); }
.config-notice-warning { background: var(--app-amber-soft); border-color: var(--app-amber-border); color: var(--app-amber-text); }
.config-notice-warning strong { color: var(--app-amber); }
.config-notice-action {
  background: var(--app-primary-soft);
  border: 1px solid var(--app-primary-border);
  border-radius: 9px;
  color: var(--text);
  font-size: 12.5px;
  font-weight: 800;
  letter-spacing: -.1px;
  padding: 9px 11px;
}
.config-notice-action em { color: var(--primary-light); font-style: normal; font-weight: 900; }
.number-setup { border-color: var(--app-primary-ring); }
.number-setup-flag {
  background: var(--app-amber-soft);
  border: 1px solid var(--app-amber-border);
  border-radius: 20px;
  color: var(--yellow);
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: .4px;
  padding: 3px 9px;
  text-transform: uppercase;
}
.number-setup-copy { color: var(--subtle); font-size: 12.5px; line-height: 1.55; margin: 0 0 14px; }
.number-setup-grid { align-items: start; display: grid; gap: 14px; grid-template-columns: minmax(230px, 300px) minmax(0, 1fr); }
.number-setup-pane {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 13px;
  display: grid;
  gap: 10px;
  padding: 13px;
}
.number-setup-pane-head { align-items: baseline; display: flex; gap: 10px; justify-content: space-between; }
.number-setup-pane-title { font-size: 12.5px; font-weight: 800; letter-spacing: -.1px; }
.number-setup-pane-note { color: var(--faint); font-size: 11px; white-space: nowrap; }
.number-qr-frame {
  align-items: center;
  aspect-ratio: 1;
  background: #fff;
  border: 1px solid var(--border-strong);
  border-radius: 12px;
  display: flex;
  justify-content: center;
  overflow: hidden;
  padding: 8px;
}
.number-qr-image { height: 100%; object-fit: contain; width: 100%; }
/* Nothing to scan yet: drop the white square down to a hint-sized panel. */
.number-qr-frame:has(.number-qr-placeholder) { aspect-ratio: auto; background: var(--surface-2); min-height: 148px; }
.number-qr-placeholder {
  align-items: center;
  color: var(--faint);
  display: grid;
  font-size: 12px;
  gap: 8px;
  justify-items: center;
  padding: 12px;
  text-align: center;
}
.number-setup-status { color: var(--subtle); font-size: 11.5px; line-height: 1.5; }
.number-setup-error { color: var(--rose); font-size: 11.5px; line-height: 1.5; }
.number-pick-list { display: grid; gap: 8px; list-style: none; margin: 0; max-height: 268px; overflow-y: auto; padding: 0; }
.number-pick-row {
  align-items: center;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 11px;
  color: var(--text);
  cursor: pointer;
  display: grid;
  gap: 10px;
  grid-template-columns: 30px minmax(0, 1fr) auto;
  padding: 9px 11px;
  text-align: left;
  transition: background .18s ease, border-color .18s ease;
  width: 100%;
}
.number-pick-row:hover:not(:disabled) { background: var(--panel-hover); border-color: var(--app-primary-border); }
.number-pick-row:disabled { cursor: not-allowed; opacity: .5; }
.number-pick-icon {
  align-items: center;
  background: var(--primary-soft);
  border-radius: 9px;
  color: var(--primary-light);
  display: inline-flex;
  height: 30px;
  justify-content: center;
  width: 30px;
}
.number-pick-body { display: grid; gap: 2px; min-width: 0; }
.number-pick-name, .number-pick-detail { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.number-pick-name { font-size: 12.5px; font-weight: 700; }
.number-pick-detail { color: var(--subtle); font-size: 11.5px; }
.number-pick-hint { color: var(--green); font-size: 11px; font-weight: 700; white-space: nowrap; }
.number-pick-hint.is-blocked { color: var(--faint); }
.number-pick-empty { color: var(--subtle); font-size: 12px; line-height: 1.55; }
.number-pick-empty a { color: var(--primary-light); font-weight: 700; }
.icon-button {
  align-items: center;
  background: var(--panel);
  border: 1px solid var(--app-border);
  border-radius: 10px;
  color: var(--subtle);
  cursor: pointer;
  display: inline-flex;
  height: 36px;
  justify-content: center;
  transition: background .18s ease, border-color .18s ease, color .18s ease;
  width: 36px;
}
.icon-button:hover { background: var(--app-rose-soft); border-color: var(--app-rose-border); color: var(--rose); }
.config-panel { min-height: 0; }
.config-fields {
  border-bottom: 1px solid var(--border);
  display: grid;
  gap: 12px;
  margin-bottom: 14px;
  padding-bottom: 14px;
}
.accordion-list { display: flex; flex-direction: column; gap: 8px; }
.accordion-item { background: var(--panel); border: 1px solid var(--app-border); border-radius: 13px; overflow: hidden; }
.accordion-button {
  align-items: center;
  background: transparent;
  border: 0;
  color: var(--text);
  cursor: pointer;
  display: grid;
  gap: 10px;
  grid-template-columns: 30px minmax(0, 1fr) auto 18px;
  padding: 12px;
  text-align: left;
  width: 100%;
}
.accordion-icon { align-items: center; background: var(--app-hover-2); border: 1px solid var(--app-border); border-radius: 9px; color: var(--primary-light); display: inline-flex; height: 30px; justify-content: center; width: 30px; }
.accordion-title { font-size: 13px; font-weight: 800; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.chevron { color: var(--subtle); transition: transform .18s ease; }
.divider-label { align-items: center; color: var(--subtle); display: flex; font-size: 11px; font-weight: 800; gap: 8px; letter-spacing: .7px; margin-top: 2px; text-transform: uppercase; }
.divider-label::after { background: var(--border-strong); content: ""; flex: 1; height: 1px; }
.range-row { display: grid; gap: 8px; }
.range-head { align-items: center; display: flex; justify-content: space-between; }
.range-value { color: var(--primary-light); font-size: 12px; font-weight: 800; }
.agents-range { accent-color: var(--primary-2); width: 100%; }
.read-only-row {
  align-items: center;
  background: var(--app-hover);
  border: 1px solid var(--app-border);
  border-radius: 11px;
  display: flex;
  justify-content: space-between;
  min-height: 40px;
  padding: 8px 10px;
}
.read-only-row code { color: var(--primary-light); font-family: var(--font-geist-mono), monospace; font-size: 12px; }
.empty-list { color: var(--subtle); font-size: 12.5px; padding: 12px 2px; }
.select-field { display: grid; gap: 7px; min-width: 0; position: relative; }
.select-field-trigger {
  align-items: center;
  background:
    linear-gradient(180deg, var(--app-hover), transparent),
    var(--panel);
  border: 1px solid var(--app-border-strong);
  border-radius: 11px;
  color: var(--text);
  cursor: pointer;
  display: grid;
  gap: 10px;
  grid-template-columns: minmax(0, 1fr) 18px;
  min-height: 40px;
  padding: 0 11px 0 12px;
  text-align: left;
  transition: border-color .18s ease, box-shadow .18s ease, background .18s ease;
  width: 100%;
}
.select-field-trigger:hover { background: var(--app-panel-hover); border-color: var(--app-border-strong); }
.select-field-trigger:focus-visible,
.select-field.is-open .select-field-trigger {
  background: var(--app-input-focus);
  border-color: var(--app-primary-ring-strong);
  box-shadow: 0 0 0 4px var(--app-primary-ring);
}
.select-field-trigger:disabled {
  color: var(--subtle);
  cursor: not-allowed;
  opacity: .55;
}
.select-field-value { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.select-field-chevron {
  color: var(--subtle);
  transition: color .18s ease, transform .18s ease;
}
.select-field.is-open .select-field-chevron { color: var(--primary-light); transform: rotate(180deg); }
.select-field-popover {
  --text: var(--app-text);
  --subtle: var(--app-muted);
  --primary-light: var(--app-primary-text);
  --rose: var(--app-rose);
  background: linear-gradient(180deg, var(--app-panel-hover), var(--app-elevated));
  border: 1px solid var(--app-border-strong);
  color: var(--text);
  border-radius: 12px;
  box-shadow: 0 22px 58px var(--app-shadow-color), 0 0 0 1px var(--app-primary-ring);
  max-height: 248px;
  overflow: auto;
  padding: 6px;
  position: fixed;
  z-index: 100;
}
.select-field-option {
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: 9px;
  color: var(--text);
  cursor: pointer;
  display: grid;
  gap: 10px;
  grid-template-columns: minmax(0, 1fr) 18px;
  min-height: 36px;
  padding: 8px 9px 8px 10px;
  text-align: left;
  width: 100%;
}
.select-field-option:hover { background: var(--app-border); }
.select-field-option.is-selected {
  background: var(--app-primary-soft-2);
  color: var(--app-primary-text);
}
.select-field-option:disabled {
  color: var(--rose);
  cursor: not-allowed;
  opacity: .75;
}
.select-field-option-label { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.select-field-option-check {
  align-items: center;
  background: var(--app-primary-soft);
  border: 1px solid var(--app-primary-ring);
  border-radius: 50%;
  color: var(--primary-light);
  display: inline-flex;
  height: 18px;
  justify-content: center;
  width: 18px;
}
.search-select { position: relative; }
.search-select-trigger {
  align-items: center;
  background: var(--panel);
  border: 1px solid var(--app-border);
  border-radius: 11px;
  color: var(--text);
  cursor: pointer;
  display: grid;
  gap: 8px;
  grid-template-columns: minmax(0, 1fr) 16px;
  min-height: 40px;
  padding: 0 12px;
  text-align: left;
  width: 100%;
}
.search-select-value { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.search-select-popover {
  background: var(--app-surface-2);
  border: 1px solid var(--app-border-strong);
  border-radius: 12px;
  box-shadow: 0 24px 60px var(--app-shadow-color);
  left: 0;
  max-height: 280px;
  overflow: hidden;
  padding: 8px;
  position: absolute;
  right: 0;
  top: calc(100% + 6px);
  z-index: 30;
}
.search-select-list { display: grid; gap: 3px; max-height: 212px; overflow: auto; padding-top: 6px; }
.search-select-option {
  background: transparent;
  border: 0;
  border-radius: 8px;
  color: var(--text);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  padding: 8px 9px;
  text-align: left;
}
.search-select-option:hover, .search-select-option.is-selected { background: var(--primary-soft); }
.search-select-option.is-disabled {
  color: var(--rose);
  cursor: not-allowed;
  opacity: .9;
}
.search-select-option.is-disabled:hover { background: var(--app-rose-soft); }
.search-select-option.is-disabled .search-select-id { color: var(--app-rose-border-strong); }
.search-select-meta { align-items: center; display: flex; gap: 7px; margin-top: 1px; min-width: 0; }
.search-select-id { color: var(--subtle); font-size: 11px; margin-top: 1px; }
.search-select-status {
  font-size: 10.5px;
  font-weight: 850;
  line-height: 1;
  text-transform: lowercase;
}
.search-select-status.is-available { color: var(--green); }
.search-select-status.is-selected { color: var(--rose); }
.modal-backdrop {
  align-items: center;
  background: var(--app-overlay);
  display: flex;
  inset: 0;
  justify-content: center;
  padding: 24px;
  position: fixed;
  z-index: 50;
}
.modal-card {
  background: var(--surface);
  border: 1px solid var(--app-border-strong);
  border-radius: 18px;
  box-shadow: 0 30px 90px var(--app-shadow-color);
  display: flex;
  flex-direction: column;
  max-height: min(860px, calc(100vh - 48px));
  max-width: 820px;
  overflow: hidden;
  width: 100%;
}
.modal-head { align-items: start; border-bottom: 1px solid var(--border); display: flex; gap: 16px; justify-content: space-between; padding: 18px 20px; }
.modal-title { font-size: 18px; font-weight: 850; letter-spacing: -.2px; margin: 0; }
.modal-subtitle { color: var(--subtle); font-size: 12.5px; margin-top: 3px; }
.modal-body { display: grid; gap: 16px; overflow: auto; padding: 18px 20px; }
.modal-section {
  background: var(--app-border-soft);
  border: 1px solid var(--app-border);
  border-radius: 14px;
  display: grid;
  gap: 12px;
  padding: 14px;
}
.modal-section-title { font-size: 13px; font-weight: 850; margin: 0; }
.modal-grid { display: grid; gap: 12px; grid-template-columns: repeat(2, minmax(0, 1fr)); }
.model-settings-grid { align-items: start; display: grid; gap: 16px; grid-template-columns: repeat(2, minmax(0, 1fr)); }
.model-settings-notice { grid-column: 1 / -1; margin-bottom: 0; }
.model-settings-temperature { display: grid; gap: 6px; grid-column: 1 / -1; }
.modal-footer { border-top: 1px solid var(--border); display: flex; gap: 10px; justify-content: flex-end; padding: 14px 20px; }
.config-modal-card { max-width: 620px; }
.config-modal-card-wide {
  max-width: 960px;
  max-height: min(900px, calc(100vh - 40px));
}
.config-modal-card-wide .modal-head { padding: 22px 24px; }
.config-modal-card-wide .modal-body { gap: 20px; padding: 24px; }
.config-modal-card-wide .modal-footer { padding: 16px 24px; }
.voice-settings-grid {
  align-items: start;
  display: grid;
  gap: 14px;
  grid-template-columns: minmax(260px, .9fr) minmax(360px, 1.3fr);
}
.voice-settings-panel {
  background:
    linear-gradient(180deg, var(--app-hover), var(--app-border-soft)),
    var(--app-border-soft);
  border: 1px solid var(--app-border);
  border-radius: 14px;
  display: grid;
  gap: 12px;
  min-width: 0;
  padding: 14px;
}
.voice-settings-panel-primary {
  border-color: var(--app-primary-ring);
}
.voice-settings-panel-wide {
  grid-column: 1 / -1;
}
.voice-settings-panel-title {
  color: var(--subtle);
  font-size: 10.5px;
  font-weight: 850;
  letter-spacing: .08em;
  line-height: 1;
  text-transform: uppercase;
}
.voice-settings-stack {
  display: grid;
  gap: 12px;
}
.voice-settings-controls {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.voice-settings-controls .range-row {
  min-width: 0;
}
.selected-provider-pill {
  align-items: center;
  align-self: flex-start;
  background: var(--app-primary-soft);
  border: 1px solid var(--app-primary-border);
  border-radius: 10px;
  color: var(--text);
  display: inline-flex;
  gap: 8px;
  min-height: 36px;
  padding: 6px 11px;
}
.selected-provider-pill-icon {
  align-items: center;
  background: var(--primary);
  border-radius: 6px;
  color: var(--app-on-accent);
  display: inline-flex;
  height: 22px;
  justify-content: center;
  width: 22px;
}
.selected-provider-pill-label { color: var(--subtle); font-size: 12px; }
.selected-provider-pill strong { font-size: 13px; }
.config-notice-provider { margin-top: 0; }
.agents-btn-danger { background: linear-gradient(140deg,var(--app-rose),#be123c); border-color: transparent; box-shadow: 0 4px 14px var(--app-rose-border); color: var(--app-on-accent); }
.agents-btn-danger:hover { filter: brightness(1.08); }
.agents-btn-danger:disabled { cursor: default; filter: none; opacity: .6; }
.confirm-modal-card { max-width: 440px; }
.confirm-modal-body { display: flex; flex-direction: column; gap: 10px; padding: 26px 24px 20px; text-align: center; align-items: center; }
.confirm-danger-icon {
  align-items: center;
  background: var(--app-rose-soft);
  border: 1px solid var(--app-rose-border);
  border-radius: 50%;
  display: inline-flex;
  height: 52px;
  justify-content: center;
  margin-bottom: 4px;
  width: 52px;
}
.confirm-modal-copy { color: var(--muted); font-size: 13px; line-height: 1.55; margin: 0; max-width: 340px; }
.confirm-agent-chip {
  align-items: center;
  background: var(--app-hover);
  border: 1px solid var(--app-border-strong);
  border-radius: 12px;
  display: grid;
  gap: 10px;
  grid-template-columns: auto minmax(0, 1fr) auto;
  margin-top: 8px;
  padding: 10px 12px;
  text-align: left;
  width: 100%;
}
.confirm-modal-footer { justify-content: stretch; }
.confirm-modal-footer .agents-btn { flex: 1; justify-content: center; }
.config-modal-heading { align-items: center; display: flex; gap: 12px; min-width: 0; }
.config-modal-icon { flex-shrink: 0; height: 38px; width: 38px; }
.config-modal-title-row { align-items: center; display: flex; flex-wrap: wrap; gap: 8px; }
.config-provider-badge {
  background: var(--primary-soft);
  border: 1px solid var(--app-primary-border);
  border-radius: 999px;
  color: var(--app-primary-text);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: .02em;
  padding: 4px 8px;
  white-space: nowrap;
}
.config-launcher { transition: background .15s ease; }
.config-launcher:hover { background: var(--app-hover); }
.config-launcher .chevron { transform: rotate(-90deg); }
.config-launcher:hover .chevron { color: var(--text); }
.config-launcher.is-unavailable,
.config-launcher.is-unavailable:disabled { cursor: not-allowed; opacity: .48; }
.config-launcher.is-unavailable:hover,
.config-launcher.is-unavailable:disabled:hover { background: transparent; }
.config-launcher.is-unavailable .chevron { display: none; }
.config-badge.config-badge-disabled { color: var(--app-muted); }
.kb-attach-list { display: grid; gap: 8px; }
.kb-attach-row {
  align-items: center;
  background: var(--panel);
  border: 1px solid var(--app-border);
  border-radius: 13px;
  color: var(--text);
  cursor: pointer;
  display: flex;
  gap: 12px;
  padding: 12px 14px;
  text-align: left;
  transition: background .16s ease, border-color .16s ease;
  width: 100%;
}
.kb-attach-row:hover { background: var(--app-hover); border-color: var(--app-border-strong); }
.kb-attach-row.is-attached { background: var(--app-primary-ring); border-color: var(--app-primary-border); }
.kb-attach-check {
  align-items: center;
  border: 1.5px solid var(--app-border-strong);
  border-radius: 7px;
  color: var(--app-on-accent);
  display: inline-flex;
  flex-shrink: 0;
  height: 20px;
  justify-content: center;
  transition: background .16s ease, border-color .16s ease;
  width: 20px;
}
.kb-attach-check.is-on { background: var(--primary); border-color: var(--primary); }
.kb-attach-body { display: grid; gap: 3px; min-width: 0; }
.kb-attach-name { font-size: 13.5px; font-weight: 800; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.kb-attach-meta { align-items: center; color: var(--subtle); display: flex; flex-wrap: wrap; font-size: 11.5px; gap: 8px; }
.kb-attach-status { border-radius: 999px; font-size: 10.5px; font-weight: 850; padding: 3px 7px; }
.kb-attach-status.is-complete { background: var(--app-green-soft); color: var(--app-green-text); }
.kb-attach-status.is-in_progress { background: var(--app-amber-soft); color: var(--app-amber-text); }
.kb-attach-status.is-refreshing_in_progress { background: var(--app-sky-soft); color: var(--app-sky-text); }
.kb-attach-status.is-error { background: var(--app-rose-soft-2); color: var(--app-rose-text); }
.kb-attach-action { color: var(--subtle); font-size: 11.5px; font-weight: 850; margin-left: auto; white-space: nowrap; }
.kb-attach-row.is-attached .kb-attach-action { color: var(--primary-light); }
.kb-attach-link { color: var(--primary-light); font-weight: 800; }
.kb-up { border-top: 1px solid var(--border); display: grid; gap: 12px; margin-top: 14px; padding-top: 14px; }
.kb-up-head { align-items: center; display: flex; gap: 12px; justify-content: space-between; }
.kb-up-title { font-size: 13px; font-weight: 850; }
.kb-up-sub { color: var(--subtle); font-size: 11.5px; line-height: 1.5; margin-top: 2px; }
.kb-up-panel { display: grid; gap: 12px; }
.kb-up-tabs { background: var(--panel); border: 1px solid var(--app-border); border-radius: 12px; display: grid; gap: 4px; grid-template-columns: repeat(2, minmax(0, 1fr)); padding: 4px; }
.kb-up-tab { align-items: center; background: transparent; border: 0; border-radius: 9px; color: var(--subtle); cursor: pointer; display: flex; font-size: 12.5px; font-weight: 800; gap: 7px; justify-content: center; min-height: 34px; }
.kb-up-tab:hover:not(:disabled) { color: var(--text); }
.kb-up-tab.is-active { background: var(--primary-soft); color: var(--app-primary-text); }
.kb-up-tab:disabled { cursor: not-allowed; opacity: .5; }
.kb-up-index { color: var(--faint); font-size: 10.5px; font-weight: 800; letter-spacing: .7px; text-transform: uppercase; }
.kb-up-target { display: grid; gap: 10px; grid-template-columns: repeat(2, minmax(0, 1fr)); }
.kb-up-input { display: none; }
.kb-up-drop {
  background: var(--panel);
  border: 1px dashed var(--app-border-strong);
  border-radius: 14px;
  color: var(--subtle);
  cursor: pointer;
  display: grid;
  gap: 5px;
  justify-items: center;
  padding: 22px 16px;
  text-align: center;
  transition: background .16s ease, border-color .16s ease;
  width: 100%;
}
.kb-up-drop:hover:not(:disabled), .kb-up-drop.is-dragging { background: var(--app-input-focus); border-color: var(--app-primary-ring-strong); color: var(--text); }
.kb-up-drop:disabled { cursor: not-allowed; opacity: .55; }
.kb-up-drop-title { color: var(--text); font-size: 12.5px; font-weight: 800; }
.kb-up-drop-hint { font-size: 11px; line-height: 1.5; }
.kb-up-file { background: var(--panel); border: 1px solid var(--app-border); border-radius: 13px; display: grid; gap: 9px; padding: 12px; }
.kb-up-file.is-invalid { border-color: var(--app-rose-border); }
.kb-up-file-head { align-items: center; display: flex; gap: 10px; }
.kb-up-file-body { min-width: 0; }
.kb-up-file-name { font-size: 12.5px; font-weight: 800; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.kb-up-file-meta { color: var(--faint); font-size: 11px; margin-top: 2px; }
.kb-up-file-spacer { flex: 1; }
.kb-up-file-error { color: var(--app-rose-text); font-size: 11.5px; font-weight: 700; line-height: 1.45; }
.kb-up-footer { align-items: center; display: flex; flex-wrap: wrap; gap: 10px; justify-content: space-between; }
.kb-up-count { color: var(--faint); font-size: 11.5px; }
.kb-up-note {
  background: var(--app-green-soft);
  border: 1px solid var(--app-green-soft-2);
  border-radius: 11px;
  color: var(--app-green-text);
  font-size: 12px;
  font-weight: 700;
  line-height: 1.5;
  padding: 10px 12px;
}
.tool-new-types { display: grid; gap: 8px; grid-template-columns: repeat(2, minmax(0, 1fr)); }
.tool-new-type {
  align-items: flex-start;
  background: var(--panel);
  border: 1px solid var(--app-border);
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  gap: 9px;
  padding: 10px 11px;
  text-align: left;
}
.tool-new-type:hover:not(:disabled) { background: var(--app-hover); border-color: var(--app-border-strong); }
.tool-new-type.is-active { background: var(--app-primary-ring); border-color: var(--app-primary-border); }
.tool-new-type:disabled { cursor: not-allowed; opacity: .55; }
.tool-new-type-icon {
  align-items: center;
  background: var(--app-hover-2);
  border-radius: 8px;
  color: var(--subtle);
  display: flex;
  flex: none;
  height: 26px;
  justify-content: center;
  width: 26px;
}
.tool-new-type.is-active .tool-new-type-icon { color: var(--primary-light); }
.tool-new-type-label { color: var(--text); display: block; font-size: 12.5px; font-weight: 800; }
.tool-new-type-blurb { color: var(--subtle); display: block; font-size: 11px; line-height: 1.45; margin-top: 2px; }
.tool-new-grid { display: grid; gap: 10px; grid-template-columns: repeat(2, minmax(0, 1fr)); }
.tool-new-grid.is-single { grid-template-columns: minmax(0, 1fr); }
.tool-new-suggest {
  align-items: center;
  color: var(--subtle);
  display: flex;
  flex-wrap: wrap;
  font-size: 11.5px;
  gap: 10px;
  justify-content: space-between;
  margin-top: -2px;
}
.segmented { background: var(--panel); border: 1px solid var(--app-border); border-radius: 12px; display: grid; gap: 4px; grid-template-columns: repeat(3, minmax(0, 1fr)); padding: 4px; }
.segment-btn { align-items: center; background: transparent; border: 0; border-radius: 9px; color: var(--subtle); cursor: pointer; display: flex; font-size: 12.5px; font-weight: 800; gap: 7px; justify-content: center; min-height: 34px; }
.segment-btn.is-active { background: var(--primary-soft); color: var(--app-primary-text); }
.workspace-message {
  align-items: center;
  border: 1px dashed var(--border-strong);
  border-radius: 16px;
  color: var(--muted);
  display: flex;
  flex-direction: column;
  font-size: 13.5px;
  font-weight: 600;
  gap: 16px;
  justify-content: center;
  min-height: 340px;
  padding: 40px;
  text-align: center;
}
.workspace-message p { margin: 0; max-width: 440px; }
.agent-key-form {
  display: grid;
  gap: 10px;
  grid-template-columns: minmax(0, 1fr) auto;
  max-width: 620px;
  width: 100%;
}
.agent-key-form .agents-input { font-family: var(--font-geist-mono), monospace; }
.agent-key-actions { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; }
.agent-key-summary { color: var(--subtle); font-family: var(--font-geist-mono), monospace; font-size: 12px; }
.toast {
  border-radius: 12px;
  bottom: 24px;
  box-shadow: 0 18px 50px var(--app-shadow-color);
  font-size: 13px;
  font-weight: 700;
  left: 50%;
  max-width: min(480px, calc(100vw - 48px));
  padding: 12px 18px;
  position: fixed;
  transform: translateX(-50%);
  z-index: 60;
}
.toast-success { background: var(--app-toast-success-bg); border: 1px solid var(--app-green-border); color: var(--app-green-text); }
.toast-error { background: var(--app-toast-error-bg); border: 1px solid var(--app-rose-border-strong); color: var(--app-rose-text); }
.form-error {
  background: var(--app-rose-soft);
  border: 1px solid var(--app-rose-border);
  border-radius: 11px;
  color: var(--app-rose-text);
  flex: 1;
  font-size: 12.5px;
  font-weight: 600;
  padding: 10px 12px;
  text-align: left;
}
.voice-card-button {
  align-items: center;
  background: var(--panel);
  border: 1px solid var(--app-border);
  border-radius: 12px;
  color: var(--text);
  cursor: pointer;
  display: grid;
  gap: 11px;
  grid-template-columns: auto minmax(0, 1fr) auto;
  min-height: 56px;
  padding: 9px 11px;
  text-align: left;
  transition: background .18s ease, border-color .18s ease;
  width: 100%;
}
.voice-card-button:hover { background: var(--panel-hover); border-color: var(--app-primary-border); }
.voice-card-button:disabled { cursor: not-allowed; opacity: .55; }
.voice-card-text { display: grid; gap: 2px; min-width: 0; }
.voice-card-name {
  font-size: 13.5px;
  font-weight: 800;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.voice-card-id {
  color: var(--faint);
  font-family: var(--font-geist-mono), monospace;
  font-size: 11px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.voice-card-action {
  align-items: center;
  background: var(--primary-soft);
  border: 1px solid var(--app-primary-border);
  border-radius: 9px;
  color: var(--app-primary-text);
  display: inline-flex;
  font-size: 11.5px;
  font-weight: 800;
  gap: 6px;
  padding: 6px 10px;
  white-space: nowrap;
}
.voice-avatar {
  align-items: center;
  border-radius: 50%;
  color: var(--app-on-accent);
  display: inline-flex;
  flex-shrink: 0;
  font-size: 14px;
  font-weight: 850;
  height: 38px;
  justify-content: center;
  width: 38px;
}
/* The picker is portalled to document.body, outside .agents-shell, so it has to
   restate the palette and typography the rest of the page inherits. */
.voice-library-backdrop {
  --surface: var(--app-surface);
  --panel: var(--app-panel);
  --panel-hover: var(--app-panel-hover);
  --border: var(--app-border);
  --border-strong: var(--app-border-strong);
  --text: var(--app-text);
  --muted: var(--app-muted);
  --subtle: var(--app-subtle);
  --faint: var(--app-faint);
  --primary: var(--app-primary);
  --primary-soft: var(--app-primary-soft);
  --primary-light: var(--app-primary-light);
  --green: var(--app-green);
  --rose: var(--app-rose);
  color: var(--text);
  font-family: var(--font-manrope), system-ui, sans-serif;
  font-size: 14px;
  line-height: 1.5;
  z-index: 60;
}
.voice-library-backdrop * { box-sizing: border-box; }
.voice-library-backdrop button, .voice-library-backdrop input { font: inherit; }
.voice-library-backdrop ::-webkit-scrollbar { height: 9px; width: 9px; }
.voice-library-backdrop ::-webkit-scrollbar-thumb { background: var(--app-border-strong); border-radius: 9px; }
.voice-library-backdrop ::-webkit-scrollbar-track { background: transparent; }
.voice-library-card { max-height: min(880px, calc(100vh - 48px)); max-width: 1040px; }
.voice-library-toolbar {
  align-items: center;
  border-bottom: 1px solid var(--border);
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 14px 20px;
}
.voice-tabs { background: var(--panel); border: 1px solid var(--app-border); border-radius: 11px; display: flex; gap: 4px; padding: 4px; }
.voice-tab {
  background: transparent;
  border: 0;
  border-radius: 8px;
  color: var(--subtle);
  cursor: pointer;
  font-size: 12.5px;
  font-weight: 800;
  min-height: 32px;
  padding: 0 14px;
}
.voice-tab.is-active { background: var(--primary-soft); color: var(--app-primary-text); }
.voice-search { flex: 1; min-width: 200px; position: relative; }
.voice-search-icon { color: var(--subtle); left: 12px; position: absolute; top: 50%; transform: translateY(-50%); }
.voice-search-input { padding-left: 36px; }
.voice-filter-toggle { min-height: 40px; }
.voice-filter-toggle.is-active { border-color: var(--app-primary-ring-strong); color: var(--app-primary-text); }
.voice-filter-count {
  background: var(--primary);
  border-radius: 999px;
  color: var(--app-on-accent);
  font-size: 10.5px;
  font-weight: 850;
  min-width: 18px;
  padding: 1px 5px;
  text-align: center;
}
.voice-usecase-row {
  border-bottom: 1px solid var(--border);
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  padding: 12px 20px;
}
.voice-chip {
  background: var(--panel);
  border: 1px solid var(--app-border);
  border-radius: 999px;
  color: var(--muted);
  cursor: pointer;
  font-size: 12px;
  font-weight: 700;
  min-height: 30px;
  padding: 0 13px;
  transition: background .18s ease, border-color .18s ease, color .18s ease;
}
.voice-chip:hover { background: var(--panel-hover); color: var(--text); }
.voice-chip.is-active { background: var(--primary-soft); border-color: var(--app-primary-border); color: var(--app-primary-text); }
.voice-filter-panel {
  background: var(--app-border-soft);
  border-bottom: 1px solid var(--border);
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  padding: 14px 20px;
}
.voice-filter-clear { align-self: end; }
.voice-library-body { display: grid; gap: 14px; overflow: auto; padding: 16px 20px 20px; }
.voice-library-error { align-items: center; display: flex; gap: 12px; justify-content: space-between; }
.voice-library-status { padding: 40px 0; text-align: center; }
.voice-grid { align-content: start; display: grid; gap: 12px; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); }
.voice-result {
  background: var(--panel);
  border: 1px solid var(--app-border);
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 13px;
  transition: border-color .18s ease, background .18s ease;
}
.voice-result:hover { background: var(--panel-hover); }
.voice-result.is-selected { border-color: var(--app-primary-ring-strong); box-shadow: 0 0 0 1px var(--app-primary-ring) inset; }
.voice-result-head { align-items: center; display: grid; gap: 11px; grid-template-columns: auto minmax(0, 1fr); }
.voice-preview-button {
  background: transparent;
  border: 0;
  cursor: pointer;
  display: block;
  padding: 0;
  position: relative;
}
.voice-preview-button:disabled { cursor: default; opacity: .6; }
.voice-preview-overlay {
  align-items: center;
  background: rgba(0,0,0,.55);
  border-radius: 50%;
  color: #fff;
  display: flex;
  inset: 0;
  justify-content: center;
  opacity: 0;
  position: absolute;
  transition: opacity .18s ease;
}
.voice-preview-button:hover .voice-preview-overlay,
.voice-preview-button:focus-visible .voice-preview-overlay { opacity: 1; }
.voice-preview-button:disabled:hover .voice-preview-overlay { opacity: 0; }
.voice-result-heading { display: grid; gap: 2px; min-width: 0; }
.voice-result-name {
  font-size: 13.5px;
  font-weight: 800;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.voice-result-traits {
  color: var(--subtle);
  font-size: 11.5px;
  overflow: hidden;
  text-overflow: ellipsis;
  text-transform: capitalize;
  white-space: nowrap;
}
.voice-result-description {
  color: var(--muted);
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  font-size: 12px;
  line-height: 1.5;
  margin: 0;
  overflow: hidden;
}
.voice-result-foot { align-items: center; display: flex; gap: 10px; justify-content: space-between; margin-top: auto; }
.voice-tag-row { display: flex; flex-wrap: wrap; gap: 5px; min-width: 0; }
.voice-tag {
  background: var(--app-hover-2);
  border-radius: 999px;
  color: var(--subtle);
  font-size: 10.5px;
  font-weight: 800;
  padding: 3px 8px;
  white-space: nowrap;
}
.voice-tag.is-owned { background: var(--app-green-soft); color: var(--green); }
.voice-use-button { min-height: 32px; padding: 0 12px; font-size: 12px; }
.voice-load-more { justify-self: center; }
@media (max-width: 1500px) {
  .agents-content { overflow-y: auto; }
  .agents-workspace { grid-template-columns: minmax(240px, 280px) minmax(470px, 1fr); height: auto; }
  .agents-workspace > * { max-height: none; }
  .agents-panel, .agents-editor, .agents-panel-pad { overflow: visible; }
  .config-panel { grid-column: 1 / -1; position: static; }
}
@media (max-width: 980px) {
  .agents-shell { display: block; height: auto; max-height: none; overflow: visible; }
  .agents-main { height: auto; overflow: visible; }
  .agents-content { overflow: visible; }
  .agents-workspace { height: auto; }
  .agents-editor, .agents-panel-pad { overflow: visible; }
  .agents-sidebar { height: auto; position: static; width: 100%; }
  .agents-nav { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .agents-sidebar-footer { margin-top: 18px; }
  .agents-user-card { display: none; }
  .agents-topbar { align-items: flex-start; flex-direction: column; padding: 18px 20px; position: static; }
  .agents-content { padding: 20px; }
  .agents-workspace, .modal-grid, .two-col { grid-template-columns: 1fr; }
  .number-setup-grid { grid-template-columns: 1fr; }
  .number-qr-frame { justify-self: center; max-width: 260px; width: 100%; }
  .voice-settings-grid, .voice-settings-controls { grid-template-columns: 1fr; }
  .voice-settings-panel-wide { grid-column: auto; }
  .config-modal-card-wide { max-width: 100%; }
  .voice-library-card { max-width: 100%; }
  .voice-search { min-width: 100%; order: 3; }
  .voice-grid { grid-template-columns: 1fr; }
  .agent-detail-head { grid-template-columns: 1fr; }
  .agent-actions { justify-content: flex-start; }
}
@media (max-width: 560px) {
  .agents-nav { grid-template-columns: 1fr 1fr; }
  .agents-content, .modal-backdrop { padding: 14px; }
  .agent-key-form { grid-template-columns: 1fr; }
  .agent-row { grid-template-columns: 36px minmax(0, 1fr); }
  .agent-row .status-pill { grid-column: 2; justify-self: start; }
  .agent-heading-row { align-items: flex-start; flex-direction: column; }
  .agent-actions, .agents-btn { width: 100%; }
  .modal-footer { flex-direction: column-reverse; }
  .segmented { grid-template-columns: 1fr; }
  .model-settings-grid { grid-template-columns: 1fr; }
}
`;

const statusStyles: Record<AgentStatus, { color: string; bg: string; dot: string }> = {
  live: { color: "var(--app-green)", bg: "var(--app-green-soft)", dot: "var(--app-green)" },
  paused: { color: "var(--app-amber)", bg: "var(--app-amber-soft)", dot: "var(--app-amber)" },
};

const avatarColors = ["#4f46e5", "#0d9488", "#b45309", "#9333ea", "#be123c", "#0369a1"];

const defaultCreateForm: CreateForm = {
  name: "",
  language: "en-US",
  timezone: "Asia/Dhaka",
  phone_number_id: "",
  call_direction: "both",
  llm_provider: "openai",
  llm_model: "gpt-4.1-mini",
  llm_temperature: 0.3,
  begin_message_mode: "agent_speaks_first",
  welcome_message: "Hi, thanks for calling Acme Health. How can I help you today?",
  system_prompt:
    "You are a customer support agent for Acme Health handling product inquiries. Be concise, friendly, and helpful.",
  voice_provider: "openai_realtime",
  voice: "openai-Alloy",
  eleven_voice_id: defaultElevenLabsVoice.voice_id,
  eleven_voice_name: defaultElevenLabsVoice.voice_name,
  voice_model: "tts-1",
  realtime_model: defaultOpenAIRealtimeModel,
  voice_speed: 1,
  transcriber_provider: "openai",
  transcriber_language: "en",
  transcriber_model: "gpt-4o-transcribe",
};

function optionLabel(options: Option[], id: string) {
  return options.find((option) => option.id === id)?.label ?? id;
}

// phoneNumberLabel renders a linked WhatsApp number for the assignment dropdown,
// preferring the user's label but always keeping the number visible.
function phoneNumberLabel(pn: ApiPhoneNumber): string {
  const number = pn.phone_number?.trim();
  const label = pn.label?.trim();
  if (label && number) return `${label} · ${number}`;
  return label || number || "Unnamed number";
}

// phoneNumberSelectOptions prepends an explicit "no assignment" entry so the
// dropdown can clear a phone number (mapped to null in the payload). clearLabel
// lets callers phrase that entry as an action ("Remove phone number") when a
// number is currently assigned, versus the neutral "No phone number" default.
function phoneNumberSelectOptions(
  phoneNumbers: ApiPhoneNumber[],
  agents: Agent[] = [],
  direction?: CallDirection,
  selfId: string | null = null,
  clearLabel = "No phone number"
): Option[] {
  return [
    { id: "", label: clearLabel },
    ...phoneNumbers.map((pn) => {
      const disabled =
        direction !== undefined && phoneNumberTakenByOther(agents, direction, selfId, pn.id);
      const selected =
        direction !== undefined && phoneNumberSelectedByOther(agents, direction, selfId, pn.id);
      const status: Option["status"] =
        pn.status === "connected" ? (selected ? "selected" : "available") : undefined;
      return {
        id: pn.id,
        label: phoneNumberLabel(pn),
        disabled,
        status,
      };
    }),
  ];
}

// upsertPhoneNumber keeps the catalogue in sync with a polled login session
// without reloading the whole page state.
function upsertPhoneNumber(current: ApiPhoneNumber[], updated: ApiPhoneNumber): ApiPhoneNumber[] {
  const index = current.findIndex((pn) => pn.id === updated.id);
  if (index === -1) return [updated, ...current];
  return current.map((pn) => (pn.id === updated.id ? updated : pn));
}

// AssignableNumber is a connected number as the setup card lists it: what it is
// called, and whether another agent's claim rules it out.
type AssignableNumber = {
  id: string;
  name: string;
  detail: string;
  disabled: boolean;
  hint: string;
};

function phoneNumberName(pn: ApiPhoneNumber): string {
  return pn.label?.trim() || pn.phone_number?.trim() || "Unnamed number";
}

function phoneNumberDetail(pn: ApiPhoneNumber): string {
  return pn.phone_number?.trim() || pn.wa_jid?.trim()?.split("@")[0] || "Number pending";
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function avatarColor(id: string) {
  const total = id.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return avatarColors[total % avatarColors.length];
}

function StatusPill({ status }: { status: AgentStatus }) {
  const style = statusStyles[status];
  return (
    <span className="status-pill" style={{ background: style.bg, color: style.color }}>
      <span className="status-dot" style={{ background: style.dot }} />
      {capitalize(status)}
    </span>
  );
}

function AgentAvatar({ agent, large = false }: { agent: Pick<Agent, "id" | "name">; large?: boolean }) {
  return (
    <span
      className={`agent-avatar${large ? " agent-avatar-large" : ""}`}
      style={{ background: `linear-gradient(135deg, ${avatarColor(agent.id)}, #26262f)` }}
    >
      {agent.name.slice(0, 1).toUpperCase()}
    </span>
  );
}

function SearchableSelect({
  label,
  onChange,
  options,
  value,
}: {
  label?: string;
  onChange: (value: string) => void;
  options: Option[];
  value: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((option) => option.id === value) ?? options[0];
  const filteredOptions = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return options;
    return options.filter(
      (option) =>
        option.id.toLowerCase().includes(normalized) ||
        option.label.toLowerCase().includes(normalized)
    );
  }, [options, query]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  return (
    <div className="search-select" ref={ref}>
      {label ? <span className="control-label">{label}</span> : null}
      <button
        className="search-select-trigger"
        onClick={() => {
          setOpen((current) => !current);
          setQuery("");
        }}
        type="button"
      >
        <span className="search-select-value">{selected?.label ?? "Select"}</span>
        <Icon className="chevron" name="chevron" size={16} sw={2.4} />
      </button>
      {open ? (
        <div className="search-select-popover">
          <div className="search-wrap" style={{ marginBottom: 0 }}>
            <span className="search-icon">
              <Icon name="search" size={16} sw={2.2} />
            </span>
            <input
              autoFocus
              className="agents-input search-input"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search..."
              value={query}
            />
          </div>
          <div className="search-select-list">
            {filteredOptions.length ? (
              filteredOptions.map((option) => (
                <button
                  className={`search-select-option${option.id === value ? " is-selected" : ""}${
                    option.disabled ? " is-disabled" : ""
                  }`}
                  disabled={option.disabled}
                  key={option.id}
                  onClick={() => {
                    if (option.disabled) return;
                    onChange(option.id);
                    setOpen(false);
                    setQuery("");
                  }}
                  type="button"
                >
                  <span>{option.label}</span>
                  {option.id || option.status ? (
                    <span className="search-select-meta">
                      {option.id ? <span className="search-select-id">{option.id}</span> : null}
                      {option.status ? (
                        <span className={`search-select-status is-${option.status}`}>
                          {option.status}
                        </span>
                      ) : null}
                    </span>
                  ) : null}
                </button>
              ))
            ) : (
              <div className="empty-list">No options found</div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function SelectField<T extends string>({
  disabled,
  label,
  onChange,
  options,
  value,
}: {
  disabled?: boolean;
  label: string;
  onChange: (value: T) => void;
  options: Option<T>[];
  value: T;
}) {
  const [open, setOpen] = useState(false);
  const [popoverStyle, setPopoverStyle] = useState<React.CSSProperties | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const selected = options.find((option) => option.id === value) ?? options[0];

  useEffect(() => {
    if (!open) return;

    function updatePopoverStyle() {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;

      const viewportPadding = 16;
      const gap = 6;
      const maxHeight = 248;
      const availableBelow = window.innerHeight - rect.bottom - viewportPadding;
      const availableAbove = rect.top - viewportPadding;
      const openUp = availableBelow < 180 && availableAbove > availableBelow;
      const availableHeight = Math.max(96, Math.min(maxHeight, openUp ? availableAbove - gap : availableBelow - gap));

      setPopoverStyle({
        left: rect.left,
        top: openUp ? undefined : rect.bottom + gap,
        bottom: openUp ? window.innerHeight - rect.top + gap : undefined,
        width: rect.width,
        maxHeight: availableHeight,
      });
    }

    updatePopoverStyle();
    window.addEventListener("resize", updatePopoverStyle);
    window.addEventListener("scroll", updatePopoverStyle, true);
    return () => {
      window.removeEventListener("resize", updatePopoverStyle);
      window.removeEventListener("scroll", updatePopoverStyle, true);
    };
  }, [open]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (!ref.current?.contains(target) && !popoverRef.current?.contains(target)) setOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div
      className={`select-field${open ? " is-open" : ""}${disabled ? " field-row-disabled" : ""}`}
      ref={ref}
    >
      <span className="field-label">{label}</span>
      <button
        aria-expanded={open}
        className="select-field-trigger"
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <span className="select-field-value">{selected?.label ?? "Select"}</span>
        <Icon className="select-field-chevron" name="chevron" size={16} sw={2.4} />
      </button>
      {open && !disabled && popoverStyle ? createPortal(
        <div className="select-field-popover" ref={popoverRef} role="listbox" style={popoverStyle}>
          {options.map((option) => {
            const isSelected = option.id === value;
            return (
              <button
                aria-selected={isSelected}
                className={`select-field-option${isSelected ? " is-selected" : ""}`}
                disabled={option.disabled}
                key={option.id}
                onClick={() => {
                  if (option.disabled) return;
                  onChange(option.id);
                  setOpen(false);
                }}
                role="option"
                title={option.label}
                type="button"
              >
                <span className="select-field-option-label">{option.label}</span>
                {isSelected ? (
                  <span className="select-field-option-check">
                    <Icon name="check" size={12} sw={2.5} />
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>,
        document.body
      ) : null}
    </div>
  );
}

function RangeField({
  disabled,
  label,
  max,
  min,
  onChange,
  step,
  value,
}: {
  disabled?: boolean;
  label: string;
  max: number;
  min: number;
  onChange: (value: number) => void;
  step: number;
  value: number;
}) {
  return (
    <label className={`range-row${disabled ? " field-row-disabled" : ""}`}>
      <span className="range-head">
        <span className="field-label">{label}</span>
        <span className="range-value">{value}</span>
      </span>
      <input
        className="agents-range"
        disabled={disabled}
        max={max}
        min={min}
        onChange={(event) => onChange(Number(event.target.value))}
        step={step}
        type="range"
        value={value}
      />
    </label>
  );
}

// ── ElevenLabs voice picker ──
// ElevenLabs hosts thousands of voices, so the voice is chosen from the live
// catalogue instead of a hardcoded list: "Explore" is the public voice library
// and "My voices" is the workspace's own. Both are proxied by the server, which
// holds the ElevenLabs key.

type VoiceSelection = { voice_id: string; voice_name: string };
type VoiceLibraryTab = "library" | "workspace";
type VoiceFilters = {
  use_case: string;
  gender: string;
  age: string;
  language: string;
  accent: string;
  category: string;
};
// Library pagination is by page index, workspace pagination by opaque token.
type VoiceCursor = { page?: number; token?: string };

const emptyVoiceFilters: VoiceFilters = {
  use_case: "",
  gender: "",
  age: "",
  language: "",
  accent: "",
  category: "",
};

const voicePageSize = 24;

// The ids below are ElevenLabs filter values; anything else returns no results.
const voiceUseCaseOptions: Option[] = [
  { id: "", label: "All use cases" },
  { id: "conversational", label: "Conversational" },
  { id: "narrative_story", label: "Narration" },
  { id: "characters_animation", label: "Characters" },
  { id: "social_media", label: "Social media" },
  { id: "informative_educational", label: "Educational" },
  { id: "advertisement", label: "Advertisement" },
  { id: "entertainment_tv", label: "Entertainment & TV" },
];

const voiceGenderOptions: Option[] = [
  { id: "", label: "Any gender" },
  { id: "male", label: "Male" },
  { id: "female", label: "Female" },
  { id: "neutral", label: "Neutral" },
];

const voiceAgeOptions: Option[] = [
  { id: "", label: "Any age" },
  { id: "young", label: "Young" },
  { id: "middle_aged", label: "Middle aged" },
  { id: "old", label: "Old" },
];

const voiceLanguageOptions: Option[] = [
  { id: "", label: "Any language" },
  { id: "en", label: "English" },
  { id: "es", label: "Spanish" },
  { id: "fr", label: "French" },
  { id: "de", label: "German" },
  { id: "it", label: "Italian" },
  { id: "pt", label: "Portuguese" },
  { id: "nl", label: "Dutch" },
  { id: "pl", label: "Polish" },
  { id: "sv", label: "Swedish" },
  { id: "tr", label: "Turkish" },
  { id: "ru", label: "Russian" },
  { id: "ar", label: "Arabic" },
  { id: "hi", label: "Hindi" },
  { id: "bn", label: "Bengali" },
  { id: "ta", label: "Tamil" },
  { id: "id", label: "Indonesian" },
  { id: "ja", label: "Japanese" },
  { id: "ko", label: "Korean" },
  { id: "zh", label: "Chinese" },
];

const voiceAccentOptions: Option[] = [
  { id: "", label: "Any accent" },
  { id: "american", label: "American" },
  { id: "british", label: "British" },
  { id: "australian", label: "Australian" },
  { id: "canadian", label: "Canadian" },
  { id: "irish", label: "Irish" },
  { id: "scottish", label: "Scottish" },
  { id: "indian", label: "Indian" },
  { id: "african", label: "African" },
  { id: "jamaican", label: "Jamaican" },
];

const voiceCategoryOptions: Option[] = [
  { id: "", label: "Any quality" },
  { id: "high_quality", label: "High quality" },
  { id: "professional", label: "Professional" },
  { id: "famous", label: "Famous" },
];

const voiceSortOptions: Option[] = [
  { id: "trending", label: "Trending" },
  { id: "created_date", label: "Newest" },
  { id: "cloned_by_count", label: "Most used" },
  { id: "usage_character_count_1y", label: "Most spoken" },
];

function voiceOptionLabel(options: Option[], id: string | undefined): string {
  if (!id) return "";
  return options.find((option) => option.id === id)?.label ?? id.replace(/_/g, " ");
}

function libraryVoiceQuery(
  search: string,
  sort: string,
  filters: VoiceFilters,
  page: number
) {
  return {
    search: search || undefined,
    sort,
    page,
    page_size: voicePageSize,
    use_cases: filters.use_case ? [filters.use_case] : undefined,
    gender: filters.gender || undefined,
    age: filters.age || undefined,
    language: filters.language || undefined,
    accent: filters.accent || undefined,
    category: filters.category || undefined,
  };
}

function fetchVoicePage(params: {
  cursor: VoiceCursor | null;
  filters: VoiceFilters;
  getToken: AuthTokenGetter;
  search: string;
  sort: string;
  tab: VoiceLibraryTab;
}): Promise<VoicePage> {
  const { cursor, filters, getToken, search, sort, tab } = params;
  if (tab === "workspace") {
    return apiListWorkspaceVoices(
      {
        search: search || undefined,
        page_size: voicePageSize,
        next_page_token: cursor?.token,
      },
      getToken
    );
  }
  return apiListLibraryVoices(libraryVoiceQuery(search, sort, filters, cursor?.page ?? 0), getToken);
}

// nextVoiceCursor turns a page response into the cursor for the page after it,
// or null when the list is exhausted.
function nextVoiceCursor(page: VoicePage, tab: VoiceLibraryTab): VoiceCursor | null {
  if (!page.has_more) return null;
  if (tab === "workspace") {
    return page.next_page_token ? { token: page.next_page_token } : null;
  }
  return typeof page.next_page === "number" ? { page: page.next_page } : null;
}

function ElevenLabsVoiceField({
  disabled,
  onChange,
  value,
}: {
  disabled?: boolean;
  onChange: (selection: VoiceSelection) => void;
  value: VoiceSelection;
}) {
  const [isPickerOpen, setPickerOpen] = useState(false);

  return (
    <div className={`field-row${disabled ? " field-row-disabled" : ""}`}>
      <span className="field-label">ElevenLabs voice</span>
      <button
        className="voice-card-button"
        disabled={disabled}
        onClick={() => setPickerOpen(true)}
        type="button"
      >
        <VoiceAvatar name={value.voice_name} voiceID={value.voice_id} />
        <span className="voice-card-text">
          <span className="voice-card-name">{value.voice_name || "Select a voice"}</span>
          <span className="voice-card-id">{value.voice_id || "No voice selected"}</span>
        </span>
        <span className="voice-card-action">
          <Icon name="search" size={13} sw={2.2} />
          Browse voices
        </span>
      </button>
      {isPickerOpen ? (
        <VoiceLibraryModal
          onClose={() => setPickerOpen(false)}
          onSelect={(selection) => {
            onChange(selection);
            setPickerOpen(false);
          }}
          selectedVoiceID={value.voice_id}
        />
      ) : null}
    </div>
  );
}

function VoiceAvatar({ name, voiceID }: { name: string; voiceID: string }) {
  return (
    <span className="voice-avatar" style={{ background: avatarColor(voiceID || name) }}>
      {(name || "?").trim().charAt(0).toUpperCase()}
    </span>
  );
}

function VoiceLibraryModal({
  onClose,
  onSelect,
  selectedVoiceID,
}: {
  onClose: () => void;
  onSelect: (selection: VoiceSelection) => void;
  selectedVoiceID: string;
}) {
  const { getToken } = useAuth();
  const [tab, setTab] = useState<VoiceLibraryTab>("library");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("trending");
  const [filters, setFilters] = useState<VoiceFilters>(emptyVoiceFilters);
  const [areFiltersOpen, setFiltersOpen] = useState(false);
  const [voices, setVoices] = useState<LibraryVoice[]>([]);
  const [cursor, setCursor] = useState<VoiceCursor | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState("");
  const [isLoadingMore, setLoadingMore] = useState(false);
  const [pendingVoiceID, setPendingVoiceID] = useState<string | null>(null);
  const [preview, setPreview] = useState<{ voiceID: string; audio: HTMLAudioElement } | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput.trim()), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Escape is captured before it reaches the modal underneath, so closing the
  // picker does not also close the agent settings modal that opened it.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      event.stopPropagation();
      onClose();
    }
    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [onClose]);

  // Preview playback is an external system: this effect drives the audio
  // element for the current selection and stops it when the selection changes
  // or the picker closes.
  useEffect(() => {
    if (!preview) return;

    const { audio } = preview;
    function stop() {
      setPreview(null);
    }

    audio.addEventListener("ended", stop);
    audio.play().catch(stop);

    return () => {
      audio.removeEventListener("ended", stop);
      audio.pause();
    };
  }, [preview]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setStatus("loading");
      setError("");
      try {
        const page = await fetchVoicePage({ cursor: null, filters, getToken, search, sort, tab });
        if (cancelled) return;
        setVoices(page.voices);
        setCursor(nextVoiceCursor(page, tab));
        setStatus("ready");
      } catch (loadError) {
        if (cancelled) return;
        setVoices([]);
        setCursor(null);
        setError(loadError instanceof Error ? loadError.message : "Failed to load voices");
        setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [filters, getToken, reloadKey, search, sort, tab]);

  async function loadMore() {
    if (!cursor || isLoadingMore) return;
    setLoadingMore(true);
    try {
      const page = await fetchVoicePage({ cursor, filters, getToken, search, sort, tab });
      setVoices((current) => [...current, ...page.voices]);
      setCursor(nextVoiceCursor(page, tab));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load more voices");
    } finally {
      setLoadingMore(false);
    }
  }

  function togglePreview(voice: LibraryVoice) {
    if (preview?.voiceID === voice.voice_id) {
      setPreview(null);
      return;
    }
    if (!voice.preview_url) return;
    setPreview({ voiceID: voice.voice_id, audio: new Audio(voice.preview_url) });
  }

  // Library voices cannot be spoken until they live in the workspace, so a
  // library pick is copied over first and the resulting id is what gets saved.
  async function selectVoice(voice: LibraryVoice) {
    if (voice.owned || !voice.public_owner_id) {
      onSelect({ voice_id: voice.voice_id, voice_name: voice.name });
      return;
    }

    setPendingVoiceID(voice.voice_id);
    setError("");
    try {
      const added = await apiAddLibraryVoice(
        { publicOwnerId: voice.public_owner_id, voiceId: voice.voice_id, name: voice.name },
        getToken
      );
      onSelect({ voice_id: added.voice_id, voice_name: added.name || voice.name });
    } catch (addError) {
      setError(
        addError instanceof Error
          ? addError.message
          : "Could not add this voice to your ElevenLabs workspace"
      );
      setPendingVoiceID(null);
    }
  }

  function patchFilters(patch: Partial<VoiceFilters>) {
    setFilters((current) => ({ ...current, ...patch }));
  }

  const activeFilterCount = Object.values(filters).filter(Boolean).length;
  // The premade voices stay reachable when the catalogue cannot be loaded, so a
  // failed request never blocks configuring an agent.
  const visibleVoices = status === "error" ? elevenLabsPresetVoices : voices;

  return createPortal(
    <div
      className="modal-backdrop voice-library-backdrop"
      onMouseDown={(event) => event.currentTarget === event.target && onClose()}
    >
      <div className="modal-card voice-library-card" role="dialog" aria-modal="true">
        <div className="modal-head">
          <div className="config-modal-heading">
            <span className="accordion-icon config-modal-icon">
              <Icon name="speaker" size={18} />
            </span>
            <div style={{ minWidth: 0 }}>
              <div className="config-modal-title-row">
                <h2 className="modal-title">Voices</h2>
                <span className="config-provider-badge">ElevenLabs</span>
              </div>
              <div className="modal-subtitle">
                Browse the ElevenLabs voice library and preview a voice before assigning it.
              </div>
            </div>
          </div>
          <button aria-label="Close voice library" className="icon-button" onClick={onClose} type="button">
            <Icon name="x" size={16} />
          </button>
        </div>

        <div className="voice-library-toolbar">
          <div className="voice-tabs">
            {([
              { id: "library", label: "Explore" },
              { id: "workspace", label: "My voices" },
            ] as { id: VoiceLibraryTab; label: string }[]).map((option) => (
              <button
                className={`voice-tab${tab === option.id ? " is-active" : ""}`}
                key={option.id}
                onClick={() => {
                  if (tab === option.id) return;
                  setTab(option.id);
                  setVoices([]);
                }}
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>
          <div className="voice-search">
            <Icon className="voice-search-icon" name="search" size={15} />
            <input
              className="agents-input voice-search-input"
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder={tab === "library" ? "Search library voices…" : "Search your voices…"}
              value={searchInput}
            />
          </div>
          {tab === "library" ? (
            <button
              className={`agents-btn agents-btn-secondary voice-filter-toggle${areFiltersOpen ? " is-active" : ""}`}
              onClick={() => setFiltersOpen((current) => !current)}
              type="button"
            >
              <Icon name="settings" size={14} />
              Filters
              {activeFilterCount ? <span className="voice-filter-count">{activeFilterCount}</span> : null}
            </button>
          ) : null}
        </div>

        {tab === "library" ? (
          <div className="voice-usecase-row">
            {voiceUseCaseOptions.map((option) => (
              <button
                className={`voice-chip${filters.use_case === option.id ? " is-active" : ""}`}
                key={option.id || "all"}
                onClick={() => patchFilters({ use_case: option.id })}
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>
        ) : null}

        {tab === "library" && areFiltersOpen ? (
          <div className="voice-filter-panel">
            <SelectField
              label="Language"
              onChange={(language: string) => patchFilters({ language })}
              options={voiceLanguageOptions}
              value={filters.language}
            />
            <SelectField
              label="Accent"
              onChange={(accent: string) => patchFilters({ accent })}
              options={voiceAccentOptions}
              value={filters.accent}
            />
            <SelectField
              label="Gender"
              onChange={(gender: string) => patchFilters({ gender })}
              options={voiceGenderOptions}
              value={filters.gender}
            />
            <SelectField
              label="Age"
              onChange={(age: string) => patchFilters({ age })}
              options={voiceAgeOptions}
              value={filters.age}
            />
            <SelectField
              label="Quality"
              onChange={(category: string) => patchFilters({ category })}
              options={voiceCategoryOptions}
              value={filters.category}
            />
            <SelectField
              label="Sort by"
              onChange={(value: string) => setSort(value)}
              options={voiceSortOptions}
              value={sort}
            />
            <button
              className="agents-btn agents-btn-secondary voice-filter-clear"
              disabled={!activeFilterCount}
              onClick={() => setFilters(emptyVoiceFilters)}
              type="button"
            >
              <Icon name="x" size={13} />
              Clear all filters
            </button>
          </div>
        ) : null}

        <div className="voice-library-body">
          {error ? (
            <div className="form-error voice-library-error">
              <span>{error}</span>
              <button
                className="agents-btn agents-btn-secondary"
                onClick={() => setReloadKey((key) => key + 1)}
                type="button"
              >
                <Icon name="refresh" size={13} />
                Retry
              </button>
            </div>
          ) : null}

          {status === "loading" ? (
            <div className="empty-list voice-library-status">Loading voices…</div>
          ) : visibleVoices.length ? (
            <>
              {status === "error" ? (
                <div className="divider-label">Premade voices</div>
              ) : null}
              <div className="voice-grid">
                {visibleVoices.map((voice) => (
                  <VoiceResultCard
                    isPending={pendingVoiceID === voice.voice_id}
                    isPlaying={preview?.voiceID === voice.voice_id}
                    isSelected={selectedVoiceID === voice.voice_id}
                    key={`${voice.public_owner_id ?? "workspace"}-${voice.voice_id}`}
                    onPreview={() => togglePreview(voice)}
                    onSelect={() => selectVoice(voice)}
                    voice={voice}
                  />
                ))}
              </div>
              {cursor && status === "ready" ? (
                <button
                  className="agents-btn agents-btn-secondary voice-load-more"
                  disabled={isLoadingMore}
                  onClick={loadMore}
                  type="button"
                >
                  {isLoadingMore ? "Loading…" : "Load more voices"}
                </button>
              ) : null}
            </>
          ) : (
            <div className="empty-list voice-library-status">
              {tab === "workspace"
                ? "No voices in your ElevenLabs workspace yet."
                : "No voices match these filters."}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

function VoiceResultCard({
  isPending,
  isPlaying,
  isSelected,
  onPreview,
  onSelect,
  voice,
}: {
  isPending: boolean;
  isPlaying: boolean;
  isSelected: boolean;
  onPreview: () => void;
  onSelect: () => void;
  voice: LibraryVoice;
}) {
  const traits = [
    voiceOptionLabel(voiceUseCaseOptions, voice.use_case),
    voice.descriptive,
    voiceOptionLabel(voiceAccentOptions, voice.accent),
    voiceOptionLabel(voiceGenderOptions, voice.gender),
    voiceOptionLabel(voiceAgeOptions, voice.age),
  ].filter(Boolean);
  const languages = voice.languages?.length
    ? voice.languages
    : voice.language
      ? [voice.language]
      : [];

  return (
    <div className={`voice-result${isSelected ? " is-selected" : ""}`}>
      <div className="voice-result-head">
        <button
          aria-label={`${isPlaying ? "Stop" : "Play"} ${voice.name} preview`}
          className="voice-preview-button"
          disabled={!voice.preview_url}
          onClick={onPreview}
          type="button"
        >
          <VoiceAvatar name={voice.name} voiceID={voice.voice_id} />
          <span className="voice-preview-overlay">
            <Icon name={isPlaying ? "pause" : "play"} fill={isPlaying ? "none" : "currentColor"} size={14} />
          </span>
        </button>
        <div className="voice-result-heading">
          <span className="voice-result-name" title={voice.name}>
            {voice.name}
          </span>
          <span className="voice-result-traits">{traits.join(" · ") || "ElevenLabs voice"}</span>
        </div>
      </div>
      {voice.description ? <p className="voice-result-description">{voice.description}</p> : null}
      <div className="voice-result-foot">
        <div className="voice-tag-row">
          {languages.slice(0, 3).map((language) => (
            <span className="voice-tag" key={language}>
              {voiceOptionLabel(voiceLanguageOptions, language)}
            </span>
          ))}
          {languages.length > 3 ? <span className="voice-tag">+{languages.length - 3}</span> : null}
          {voice.owned ? <span className="voice-tag is-owned">In workspace</span> : null}
        </div>
        <button
          className={`agents-btn ${isSelected ? "agents-btn-secondary" : "agents-btn-primary"} voice-use-button`}
          disabled={isPending || isSelected}
          onClick={onSelect}
          type="button"
        >
          {isSelected ? (
            <>
              <Icon name="check" size={13} sw={2.4} />
              Selected
            </>
          ) : isPending ? (
            "Adding…"
          ) : (
            "Use voice"
          )}
        </button>
      </div>
    </div>
  );
}

export default function AgentsPage() {
  const { user, isLoaded: isUserLoaded, isSignedIn: isUserSignedIn } = useUser();
  const { getToken, isLoaded: isAuthLoaded, isSignedIn: isAuthSignedIn } = useAuth();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">("loading");
  const [loadError, setLoadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [phoneNumbers, setPhoneNumbers] = useState<ApiPhoneNumber[]>([]);
  const [query, setQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState<CreateForm>(defaultCreateForm);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [notice, setNotice] = useState<{ kind: "success" | "error"; text: string } | null>(null);
  const [configModalSection, setConfigModalSection] = useState<ConfigSectionId | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  // The knowledge base catalogue backs the attach list. It is loaded alongside
  // the agents (the attachments themselves ride on the agent resource) and a
  // failure here only costs the names, not the agents, so it falls back to an
  // empty catalogue the same way the phone numbers do.
  const [knowledgeBases, setKnowledgeBases] = useState<ApiKnowledgeBase[]>([]);
  // A WhatsApp QR login started from the agent editor. It is tracked per agent
  // so switching agents mid-scan never assigns the number to the wrong one.
  const [numberLogin, setNumberLogin] = useState<{ agentId: string; phone: ApiPhoneNumber } | null>(null);
  const [numberLoginLabel, setNumberLoginLabel] = useState("");
  const [numberLoginError, setNumberLoginError] = useState("");
  const [isStartingLogin, setIsStartingLogin] = useState(false);

  const isAuthenticated = Boolean(
    isUserLoaded && isAuthLoaded && isUserSignedIn && isAuthSignedIn && user
  );
  const authError =
    !isUserLoaded || !isAuthLoaded
      ? null
      : !isUserSignedIn || !isAuthSignedIn || !user
        ? "Sign in to access agents."
        : null;

  // Dashboard access uses the user's default API key metadata for selection,
  // while requests are authenticated with the current Clerk session.
  useEffect(() => {
    if (!isUserLoaded || !isAuthLoaded) return;

    if (!isAuthenticated) return;

    let cancelled = false;
    (async () => {
      setLoadState("loading");
      setLoadError("");
      try {
        const keys = await apiListApiKeys(getToken);
        if (cancelled) return;

        const selectedKey = keys.find((key) => key.isDefault) ?? keys[0] ?? null;
        if (!selectedKey) {
          setAgents([]);
          setSelectedId(null);
          setLoadState("error");
          setLoadError("No active API key found. Create an API key to access agents.");
          return;
        }

        const [resources, numbers, bases] = await Promise.all([
          apiListAgents(getToken),
          // Phone numbers feed the assignment dropdown; a failure here should not
          // block agents from loading, so fall back to an empty list.
          apiListPhoneNumbers(getToken).catch(() => [] as ApiPhoneNumber[]),
          // Knowledge bases feed the attach list, for the same reason.
          apiListKnowledgeBases(getToken).catch(() => [] as ApiKnowledgeBase[]),
        ]);
        if (cancelled) return;
        setPhoneNumbers(numbers);
        setKnowledgeBases(bases);
        const loaded = resources.map(agentFromApi);
        setAgents(loaded);
        setSelectedId((current) =>
          current && loaded.some((agent) => agent.id === current) ? current : loaded[0]?.id ?? null
        );
        setLoadState("ready");
      } catch (error) {
        if (cancelled) return;
        setAgents([]);
        setSelectedId(null);
        setLoadState("error");
        setLoadError(error instanceof Error ? error.message : "Failed to load agents");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    authError,
    getToken,
    isAuthenticated,
    isUserLoaded,
    isAuthLoaded,
    reloadKey,
  ]);

  const effectiveLoadState = !isUserLoaded || !isAuthLoaded ? "loading" : authError ? "error" : loadState;
  const effectiveLoadError = authError ?? loadError;

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 4000);
    return () => clearTimeout(timer);
  }, [notice]);

  const selectedAgent = agents.find((agent) => agent.id === selectedId) ?? agents[0] ?? null;

  // Only connected numbers can carry calls, so connected numbers are the
  // selectable pool. Conflicts stay visible as disabled options.
  const connectedPhoneNumbers = useMemo(
    () => phoneNumbers.filter((pn) => pn.status === "connected"),
    [phoneNumbers]
  );
  // A new agent sees every connected number for the chosen direction, with
  // overlapping assignments disabled instead of hidden.
  const createPhoneNumberOptions = useMemo(
    () =>
      phoneNumberSelectOptions(
        connectedPhoneNumbers,
        agents,
        createForm.call_direction,
        null
      ),
    [connectedPhoneNumbers, agents, createForm.call_direction]
  );

  // The editor shows every connected number for the selected direction, marks
  // overlapping assignments disabled, and keeps the selected agent's own
  // disconnected assignment visible so opening an agent never silently clears it.
  const editorPhoneNumberOptions = useMemo(() => {
    if (!selectedAgent) return phoneNumberSelectOptions([]);
    let visiblePhoneNumbers = connectedPhoneNumbers;
    const assignedId = selectedAgent.phone_number_id;
    if (assignedId && !connectedPhoneNumbers.some((pn) => pn.id === assignedId)) {
      const assigned = phoneNumbers.find((pn) => pn.id === assignedId);
      if (assigned) visiblePhoneNumbers = [...visiblePhoneNumbers, assigned];
    }
    return phoneNumberSelectOptions(
      visiblePhoneNumbers,
      agents,
      selectedAgent.call_direction,
      selectedAgent.id,
      selectedAgent.phone_number_id ? "Remove phone number" : "No phone number"
    );
  }, [connectedPhoneNumbers, agents, phoneNumbers, selectedAgent]);

  // The pick-a-number half of the setup card. Numbers held by another agent for
  // an overlapping direction stay listed, but say who holds them and cannot be
  // picked — the same rule the assignment dropdown enforces.
  const assignableNumbers = useMemo<AssignableNumber[]>(() => {
    if (!selectedAgent) return [];
    return connectedPhoneNumbers.map((pn) => {
      const holder = agents.find(
        (agent) => agent.id !== selectedAgent.id && agent.phone_number_id === pn.id
      );
      const blocked = Boolean(holder && directionBlocks(selectedAgent.call_direction, holder.call_direction));
      return {
        id: pn.id,
        name: phoneNumberName(pn),
        detail: phoneNumberDetail(pn),
        disabled: blocked,
        hint: holder
          ? `${blocked ? "In use by" : "Shared with"} ${holder.name} · ${optionLabel(callDirectionOptions, holder.call_direction)}`
          : "Available",
      };
    });
  }, [agents, connectedPhoneNumbers, selectedAgent]);

  const filteredAgents = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return agents;
    return agents.filter((agent) =>
      [agent.name, agent.role, agent.voice.model, agent.llm.model, ...voiceSearchTerms(agent.voice)].some(
        (value) => value.toLowerCase().includes(normalized)
      )
    );
  }, [agents, query]);

  function updateSelected(updater: (agent: Agent) => Agent) {
    if (!selectedAgent) return;
    setAgents((current) =>
      current.map((agent) => (agent.id === selectedAgent.id ? updater(agent) : agent))
    );
  }

  function patchSelected(patch: Partial<Agent>) {
    updateSelected((agent) => ({ ...agent, ...patch }));
  }

  // Changing the call direction re-derives what numbers are assignable. The
  // phone-number field updates live: keep the current number when it is still
  // valid (or merely disconnected), otherwise auto-select the first available
  // number, falling back to "No phone number" only when none are assignable.
  function changeSelectedDirection(direction: CallDirection) {
    if (!selectedAgent) return;
    const assignedId = selectedAgent.phone_number_id;
    const options = phoneNumberSelectOptions(connectedPhoneNumbers, agents, direction, selectedAgent.id);
    const assignedConnected = connectedPhoneNumbers.some((pn) => pn.id === assignedId);
    // A disconnected assignment can't conflict, so it is kept as-is.
    const assignedValid =
      Boolean(assignedId) &&
      (!assignedConnected || options.some((option) => option.id === assignedId && !option.disabled));
    const firstAvailable = options.find((option) => option.id !== "" && !option.disabled);
    patchSelected({
      call_direction: direction,
      phone_number_id: assignedValid ? assignedId : firstAvailable?.id ?? null,
    });
  }

  const numberLoginId = numberLogin?.phone.id;
  const numberLoginStatus = numberLogin?.phone.status;
  const numberLoginAgentId = numberLogin?.agentId;

  // Poll the QR session started from the editor until WhatsApp resolves it. The
  // server assigns the connected number to the agent that asked for it (the
  // login carried its id), so this only mirrors that into the catalogue and the
  // editor — the scan alone finishes the setup, page open or not.
  useEffect(() => {
    if (!numberLoginId || !numberLoginStatus || terminalLoginStatuses.has(numberLoginStatus)) return;

    let cancelled = false;
    const poll = async () => {
      try {
        const updated = await apiGetPhoneNumber(numberLoginId, getToken);
        if (cancelled) return;
        setNumberLoginError("");
        setNumberLogin((current) =>
          current && current.phone.id === updated.id ? { ...current, phone: updated } : current
        );
        setPhoneNumbers((current) => upsertPhoneNumber(current, updated));
        if (updated.status === "connected") {
          if (numberLoginAgentId) {
            setAgents((current) => assignPhoneNumber(current, numberLoginAgentId, updated.id));
          }
          setNotice({
            kind: "success",
            text: `${phoneNumberName(updated)} connected and assigned to this agent`,
          });
        } else if (terminalLoginStatuses.has(updated.status)) {
          setNumberLoginError(`WhatsApp login ${phoneStatusLabels[updated.status].toLowerCase()}.`);
        }
      } catch (error) {
        if (cancelled) return;
        setNumberLoginError(
          error instanceof Error ? error.message : "Failed to check the WhatsApp login status"
        );
      }
    };

    const interval = window.setInterval(poll, 2500);
    poll();

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [getToken, numberLoginAgentId, numberLoginId, numberLoginStatus]);

  // Starts a fresh WhatsApp login for the selected agent, or reissues a QR code
  // for the session it already has.
  async function startNumberLogin(restart: boolean) {
    if (!selectedAgent || isStartingLogin) return;
    const agentId = selectedAgent.id;
    const existingId = numberLogin?.agentId === agentId ? numberLogin.phone.id : null;

    setIsStartingLogin(true);
    setNumberLoginError("");
    try {
      const label = numberLoginLabel.trim();
      // agent_id is what makes the scan alone finish the setup: the server
      // assigns the number to this agent the moment WhatsApp connects it, with
      // no publish and no trip to the phone-numbers page.
      const started =
        restart && existingId
          ? await apiRestartPhoneNumberLogin(existingId, getToken, agentId)
          : await apiStartPhoneNumberLogin({ ...(label ? { label } : {}), agent_id: agentId }, getToken);
      setNumberLogin({ agentId, phone: started });
      setPhoneNumbers((current) => upsertPhoneNumber(current, started));
      setNumberLoginLabel("");
    } catch (error) {
      setNumberLoginError(
        error instanceof Error ? error.message : "Failed to start the WhatsApp login"
      );
    } finally {
      setIsStartingLogin(false);
    }
  }

  // upsertKnowledgeBase folds a knowledge base created or indexed from the
  // attach modal back into the catalogue, so its row shows the new source count
  // without reloading the page. The listing is newest first, which is where a
  // knowledge base that did not exist a moment ago belongs.
  function upsertKnowledgeBase(base: ApiKnowledgeBase) {
    setKnowledgeBases((current) => {
      const index = current.findIndex(
        (entry) => entry.knowledge_base_id === base.knowledge_base_id
      );
      if (index === -1) return [base, ...current];
      const next = [...current];
      next[index] = base;
      return next;
    });
  }

  function openCreateModal() {
    setCreateForm(defaultCreateForm);
    setCreateError("");
    setIsCreateOpen(true);
  }

  async function createAgent() {
    if (!createForm.name.trim() || isCreating) return;

    setIsCreating(true);
    setCreateError("");
    try {
      const created = agentFromApi(await apiCreateAgent(createFormToPayload(createForm), getToken));
      setAgents((current) => unassignStolenNumber([created, ...current], created));
      setSelectedId(created.id);
      setQuery("");
      setIsCreateOpen(false);
      setNotice({ kind: "success", text: `Agent "${created.name}" created` });
    } catch (error) {
      setCreateError(error instanceof Error ? error.message : "Failed to create agent");
    } finally {
      setIsCreating(false);
    }
  }

  async function saveAgent(agent: Agent, successMessage: (saved: Agent) => string) {
    if (isSaving) return false;
    setIsSaving(true);
    try {
      const payload = agentToPayload(agent);
      const saved = agentFromApi(await apiUpdateAgent(agent.id, payload, getToken));
      setAgents((current) =>
        unassignStolenNumber(
          current.map((currentAgent) =>
            currentAgent.id === saved.id ? withClientOnly(agent, saved) : currentAgent
          ),
          saved
        )
      );
      setNotice({ kind: "success", text: successMessage(saved) });
      return true;
    } catch (error) {
      setNotice({
        kind: "error",
        text: error instanceof Error ? error.message : "Failed to update agent",
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  }

  // Publish persists the full editor state via PATCH and marks the agent live.
  // Going live requires an assigned phone number — without one the agent has no
  // number to place or receive calls on, so publishing is blocked.
  async function publishSelected() {
    if (!selectedAgent) return false;
    if (!selectedAgent.phone_number_id) {
      setNotice({
        kind: "error",
        text: "Assign a phone number before taking this agent live.",
      });
      return false;
    }
    return saveAgent(
      { ...selectedAgent, status: "live" },
      (saved) => `Agent "${saved.name}" published`
    );
  }

  async function updateSelectedConfiguration(agent: Agent) {
    return saveAgent(agent, (saved) => `Agent "${saved.name}" updated`);
  }

  // Removing the assigned number persists immediately, because Publish (the only
  // other save path) requires a number and so can never save its absence. A live
  // agent has nothing to answer calls on once its number is gone, so the removal
  // also pauses it — the backend rejects an active agent with no phone number.
  async function unassignSelectedNumber() {
    if (!selectedAgent || isSaving) return;
    if (!selectedAgent.phone_number_id) {
      patchSelected({ phone_number_id: null });
      return;
    }
    const wasLive = selectedAgent.status === "live";
    await saveAgent(
      { ...selectedAgent, phone_number_id: null, status: "paused" },
      (saved) =>
        wasLive
          ? `Phone number removed — "${saved.name}" paused`
          : `Phone number removed from "${saved.name}"`
    );
  }

  // Pause/resume only patches the status so unsaved local edits stay local.
  async function toggleSelectedStatus() {
    if (!selectedAgent || isSaving) return;
    const nextStatus: AgentStatus = selectedAgent.status === "live" ? "paused" : "live";
    if (nextStatus === "live" && !selectedAgent.phone_number_id) {
      setNotice({
        kind: "error",
        text: "Assign a phone number before taking this agent live.",
      });
      return;
    }
    setIsSaving(true);
    try {
      const saved = agentFromApi(
        await apiUpdateAgent(selectedAgent.id, { agent: { status: statusToApi(nextStatus) } }, getToken)
      );
      setAgents((current) =>
        current.map((agent) => (agent.id === saved.id ? { ...agent, status: saved.status } : agent))
      );
      setNotice({
        kind: "success",
        text: nextStatus === "paused" ? `Agent "${saved.name}" paused` : `Agent "${saved.name}" is live`,
      });
    } catch (error) {
      setNotice({
        kind: "error",
        text: error instanceof Error ? error.message : "Failed to update agent status",
      });
    } finally {
      setIsSaving(false);
    }
  }

  function requestDeleteSelected() {
    if (!selectedAgent || isDeleting) return;
    setIsDeleteConfirmOpen(true);
  }

  async function deleteSelected() {
    if (!selectedAgent || isDeleting) return;

    setIsDeleting(true);
    try {
      await apiDeleteAgent(selectedAgent.id, getToken);
      const remaining = agents.filter((agent) => agent.id !== selectedAgent.id);
      setAgents(remaining);
      setSelectedId(remaining[0]?.id ?? null);
      setNotice({ kind: "success", text: `Agent "${selectedAgent.name}" deleted` });
      setIsDeleteConfirmOpen(false);
    } catch (error) {
      setNotice({
        kind: "error",
        text: error instanceof Error ? error.message : "Failed to delete agent",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="agents-shell">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <Sidebar agentCount={agents.length} />

      <main className="agents-main">
        <div className="agents-content">
          {effectiveLoadState === "loading" ? (
            <div className="workspace-message">Loading agents…</div>
          ) : effectiveLoadState === "error" ? (
            <div className="workspace-message">
              <p>{effectiveLoadError}</p>
              <div className="agent-key-actions">
                <button
                  className="agents-btn agents-btn-secondary"
                  onClick={() => {
                    setLoadState("loading");
                    setReloadKey((key) => key + 1);
                  }}
                  type="button"
                >
                  Try again
                </button>
                <Link className="agents-btn agents-btn-secondary" href="/dashboard/api-keys">
                  Manage API keys
                </Link>
              </div>
            </div>
          ) : !selectedAgent ? (
            <div className="workspace-message">
              <p>No voice agents yet. Create your first agent to get started.</p>
              <button className="agents-btn agents-btn-primary" onClick={openCreateModal} type="button">
                <Icon name="plus" size={16} stroke="#fff" sw={2.4} />
                New Agent
              </button>
            </div>
          ) : (
          <section className="agents-workspace" aria-label="AI Agents management workspace">
            <AgentList
              agents={agents}
              filteredAgents={filteredAgents}
              onCreate={openCreateModal}
              onQueryChange={setQuery}
              onSelect={setSelectedId}
              query={query}
              selectedId={selectedAgent.id}
            />

            <section className="agents-editor">
              <EditorHeader
                agent={selectedAgent}
                canGoLive={Boolean(selectedAgent.phone_number_id)}
                isDeleting={isDeleting}
                isSaving={isSaving}
                onDelete={requestDeleteSelected}
                onPublish={publishSelected}
                onToggleStatus={toggleSelectedStatus}
              />

              {!selectedAgent.phone_number_id ? (
                <PhoneNumberSetupCard
                  agentName={selectedAgent.name}
                  error={numberLoginError}
                  isStarting={isStartingLogin}
                  label={numberLoginLabel}
                  login={
                    // A resolved (connected) session has nothing left to show: its
                    // number is assigned, so the card is only back because that
                    // assignment was removed and a fresh scan is what's wanted.
                    numberLogin?.agentId === selectedAgent.id &&
                    numberLogin.phone.status !== "connected"
                      ? numberLogin.phone
                      : null
                  }
                  numbers={assignableNumbers}
                  onLabelChange={setNumberLoginLabel}
                  onSelectNumber={(phoneNumberId) => patchSelected({ phone_number_id: phoneNumberId })}
                  onStartLogin={startNumberLogin}
                />
              ) : null}

              <div className="agents-card editor-card">
                <div className="editor-card-head">
                  <h3 className="editor-card-title">Welcome Message</h3>
                  <select
                    className="agents-select mini-select"
                    onChange={(event) =>
                      patchSelected({ begin_message_mode: event.target.value as BeginMessageMode })
                    }
                    value={selectedAgent.begin_message_mode}
                  >
                    <option value="agent_speaks_first">Agent begins (exact message)</option>
                    <option value="agent_waits_for_user">User begins</option>
                    <option value="agent_speaks_first_with_model_generated_message">
                      Agent begins (AI-generated message)
                    </option>
                  </select>
                </div>
                <textarea
                  className="agents-textarea"
                  onChange={(event) => patchSelected({ welcome_message: event.target.value })}
                  value={selectedAgent.welcome_message}
                />
                <div className="helper-line">Starts after {selectedAgent.welcome_delay_ms} ms</div>
              </div>

              <div className="agents-card editor-card editor-card-grow">
                <div className="editor-card-head">
                  <h3 className="editor-card-title">General Prompt</h3>
                </div>
                <textarea
                  className="agents-textarea"
                  onChange={(event) => patchSelected({ system_prompt: event.target.value })}
                  style={{ minHeight: 185 }}
                  value={selectedAgent.system_prompt}
                />
              </div>

            </section>

            <aside className="agents-panel config-panel">
              <div className="agents-column-head">
                <h2 className="agents-column-title">Agent configuration</h2>
                <div className="agents-column-copy">
                  Configure how the agent routes calls, thinks, speaks, and captures outcomes.
                </div>
              </div>
              <div className="agents-panel-pad">
                {/* The per-agent basics live at the top of the configuration
                    panel: how it speaks, which directions it handles, and the
                    number it uses. */}
                <div className="config-fields">
                  <SearchableSelect
                    label="Language"
                    onChange={(value) => patchSelected({ language: value })}
                    options={languages}
                    value={selectedAgent.language}
                  />
                  <SearchableSelect
                    label="Timezone"
                    onChange={(value) => patchSelected({ timezone: value })}
                    options={timezoneOptions}
                    value={selectedAgent.timezone}
                  />
                  <label>
                    <span className="control-label">Call direction</span>
                    <span className="dot-select">
                      <select
                        className="agents-select"
                        onChange={(event) =>
                          changeSelectedDirection(event.target.value as CallDirection)
                        }
                        value={selectedAgent.call_direction}
                      >
                        {callDirectionOptions.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </span>
                  </label>
                  <SearchableSelect
                    label="Phone number"
                    onChange={(value) => {
                      if (value === "") {
                        void unassignSelectedNumber();
                      } else {
                        patchSelected({ phone_number_id: value });
                      }
                    }}
                    options={editorPhoneNumberOptions}
                    value={selectedAgent.phone_number_id ?? ""}
                  />
                </div>
                <div className="accordion-list">
                  {configSections.map((section) => (
                    <div className="accordion-item" key={section.id}>
                      <button
                        className="accordion-button config-launcher"
                        disabled={isSaving}
                        onClick={() => setConfigModalSection(section.id)}
                        type="button"
                      >
                        <span className="accordion-icon">
                          <Icon name={section.icon} size={16} />
                        </span>
                        <span className="accordion-title">{section.label}</span>
                        <ConfigMeta agent={selectedAgent} sectionId={section.id} />
                        <Icon className="chevron" name="chevron" size={16} sw={2.4} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </section>
          )}
        </div>
      </main>

      {notice ? (
        <div
          className={`toast ${notice.kind === "error" ? "toast-error" : "toast-success"}`}
          role="status"
        >
          {notice.text}
        </div>
      ) : null}

      {isCreateOpen ? (
        <CreateAgentModal
          error={createError}
          form={createForm}
          isSubmitting={isCreating}
          onCancel={() => setIsCreateOpen(false)}
          onCreate={createAgent}
          phoneNumberOptions={createPhoneNumberOptions}
          setForm={setCreateForm}
        />
      ) : null}

      {isDeleteConfirmOpen && selectedAgent ? (
        <DeleteAgentModal
          agent={selectedAgent}
          isDeleting={isDeleting}
          onCancel={() => setIsDeleteConfirmOpen(false)}
          onConfirm={deleteSelected}
        />
      ) : null}

      {configModalSection === "knowledge-base" && selectedAgent ? (
        <KnowledgeBaseSectionModal
          agent={selectedAgent}
          isSaving={isSaving}
          key={`${selectedAgent.id}:knowledge-base`}
          knowledgeBases={knowledgeBases}
          onClose={() => setConfigModalSection(null)}
          onIndexed={upsertKnowledgeBase}
          onSave={updateSelectedConfiguration}
        />
      ) : null}

      {configModalSection === "tools" && selectedAgent ? (
        <ToolsSectionModal
          agent={selectedAgent}
          isSaving={isSaving}
          key={`${selectedAgent.id}:tools`}
          onClose={() => setConfigModalSection(null)}
          onSave={updateSelectedConfiguration}
        />
      ) : null}

      {configModalSection &&
      configModalSection !== "knowledge-base" &&
      configModalSection !== "tools" &&
      selectedAgent ? (
        <ConfigSectionModal
          agent={selectedAgent}
          isSaving={isSaving}
          key={`${selectedAgent.id}:${configModalSection}`}
          onClose={() => setConfigModalSection(null)}
          onSave={updateSelectedConfiguration}
          sectionId={configModalSection}
        />
      ) : null}
    </div>
  );
}

function Sidebar({ agentCount }: { agentCount: number }) {
  const { user } = useUser();
  const { resolvedTheme } = useTheme();
  return (
    <aside className="agents-sidebar">
      <div className="agents-logo">
        <div className="agents-logo-mark">
          <Icon name="spark" size={18} stroke="#fff" sw={2.2} />
        </div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: "-.3px" }}>Voca</div>
          <div style={{ color: "var(--app-subtle)", fontSize: 11, fontWeight: 500, marginTop: -1 }}>
            AI Voice Agents
          </div>
        </div>
      </div>
      <div className="agents-nav-kicker">Menu</div>
      <nav className="agents-nav" aria-label="Dashboard navigation">
        {navItems.map((item) => {
          const content = (
            <>
              <span style={{ display: "flex", justifyContent: "center", width: 18 }}>
                <Icon name={item.icon} size={18} />
              </span>
              <span>{item.label}</span>
              {item.badge ? (
                <span className="agents-nav-badge">
                  {item.label === "Agents" ? agentCount : item.badge}
                </span>
              ) : null}
            </>
          );
          const className = `agents-nav-item${item.label === "Agents" ? " is-active" : ""}`;

          return item.href ? (
            <Link className={className} href={item.href} key={item.label}>
              {content}
            </Link>
          ) : (
            <a
              className={className}
              href="#"
              key={item.label}
              onClick={(event) => event.preventDefault()}
            >
              {content}
            </a>
          );
        })}
      </nav>
      <div className="agents-sidebar-footer">
        <ThemeToggle />
        <div className="agents-user-card">
          <UserButton appearance={clerkAppearance(resolvedTheme)} />
          <span style={{ minWidth: 0 }}>
            <div className="agents-user-name">{user?.fullName || user?.username || "Account"}</div>
            <div className="agents-user-email">
              {user?.primaryEmailAddress?.emailAddress ?? ""}
            </div>
          </span>
        </div>
      </div>
    </aside>
  );
}

function AgentList({
  agents,
  filteredAgents,
  onCreate,
  onQueryChange,
  onSelect,
  query,
  selectedId,
}: {
  agents: Agent[];
  filteredAgents: Agent[];
  onCreate: () => void;
  onQueryChange: (value: string) => void;
  onSelect: (id: string) => void;
  query: string;
  selectedId: string;
}) {
  return (
    <aside className="agents-panel">
      <div className="agents-column-head agents-column-head-split">
        <div>
          <h2 className="agents-column-title">Agents</h2>
          <div className="agents-column-copy">{agents.length} voice agents configured</div>
        </div>
        <button className="agents-btn agents-btn-primary agents-btn-sm" onClick={onCreate} type="button">
          <Icon name="plus" size={14} stroke="#fff" sw={2.4} />
          New Agent
        </button>
      </div>
      <div className="agents-panel-pad">
        <div className="search-wrap">
          <span className="search-icon">
            <Icon name="search" size={16} sw={2.2} />
          </span>
          <input
            className="agents-input search-input"
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search agents..."
            type="search"
            value={query}
          />
        </div>
        <div className="agents-list">
          {filteredAgents.length ? (
            filteredAgents.map((agent) => (
              <button
                className={`agent-row${agent.id === selectedId ? " is-selected" : ""}`}
                key={agent.id}
                onClick={() => onSelect(agent.id)}
                type="button"
              >
                <AgentAvatar agent={agent} />
                <span style={{ display: "block", minWidth: 0 }}>
                  <span className="agent-name">{agent.name}</span>
                  <span className="agent-role">{agent.role}</span>
                </span>
                <StatusPill status={agent.status} />
              </button>
            ))
          ) : (
            <div className="empty-list">No agents found</div>
          )}
        </div>
      </div>
    </aside>
  );
}

function EditorHeader({
  agent,
  canGoLive,
  isDeleting,
  isSaving,
  onDelete,
  onPublish,
  onToggleStatus,
}: {
  agent: Agent;
  canGoLive: boolean;
  isDeleting: boolean;
  isSaving: boolean;
  onDelete: () => void;
  onPublish: () => void;
  onToggleStatus: () => void;
}) {
  const isLive = agent.status === "live";
  // Going live needs a phone number; pausing an already-live agent never does.
  const goLiveBlocked = !isLive && !canGoLive;
  const needsNumberHint = "Assign a phone number to take this agent live";
  return (
    <div className="agents-card agent-detail-head">
      <div className="agent-identity">
        <AgentAvatar agent={agent} large />
        <div style={{ minWidth: 0 }}>
          <div className="agent-heading-row">
            <h2 className="agent-heading">{agent.name}</h2>
            <span className="tag-badge">Single Prompt</span>
            <StatusPill status={agent.status} />
          </div>
          <div className="agent-meta">
            {agent.timezone || "No timezone"} / {agent.call_direction} calls
          </div>
        </div>
      </div>
      <div className="agent-actions">
        <button className="agents-btn agents-btn-secondary" type="button">
          <Icon name="speaker" size={16} sw={2.2} />
          Test voice
        </button>
        <button
          className="agents-btn agents-btn-secondary"
          disabled={isSaving || goLiveBlocked}
          onClick={onToggleStatus}
          title={goLiveBlocked ? needsNumberHint : undefined}
          type="button"
        >
          <Icon name="play" size={16} sw={2.2} />
          {isLive ? "Pause" : "Go live"}
        </button>
        <button
          className="agents-btn agents-btn-primary"
          disabled={isSaving || !canGoLive}
          onClick={onPublish}
          title={!canGoLive ? needsNumberHint : undefined}
          type="button"
        >
          <Icon name="upload" size={16} stroke="#fff" sw={2.2} />
          {isSaving ? "Saving…" : "Publish"}
        </button>
        <button
          aria-label="Delete agent"
          className="icon-button"
          disabled={isDeleting}
          onClick={onDelete}
          style={{ height: 40, width: 40 }}
          type="button"
        >
          <Icon name="trash" size={16} />
        </button>
      </div>
    </div>
  );
}

// PhoneNumberSetupCard fills the gap left by an agent with no number. Both ways
// out are offered side by side: link a brand-new WhatsApp number by scanning a
// QR code, or claim one of the numbers already connected to the account.
function PhoneNumberSetupCard({
  agentName,
  error,
  isStarting,
  label,
  login,
  numbers,
  onLabelChange,
  onSelectNumber,
  onStartLogin,
}: {
  agentName: string;
  error: string;
  isStarting: boolean;
  label: string;
  login: ApiPhoneNumber | null;
  numbers: AssignableNumber[];
  onLabelChange: (value: string) => void;
  onSelectNumber: (phoneNumberId: string) => void;
  onStartLogin: (restart: boolean) => void;
}) {
  // `login` is the unfinished session for this agent; a connected one is never
  // passed down, because connecting assigns the number and closes this card.
  const isPending = login?.status === "pending_qr";
  const canRestart = Boolean(login);

  return (
    <div className="agents-card editor-card number-setup">
      <div className="editor-card-head">
        <h3 className="editor-card-title">Connect a phone number</h3>
        <span className="number-setup-flag">Required to go live</span>
      </div>
      <p className="number-setup-copy">
        &ldquo;{agentName}&rdquo; has no WhatsApp number. Scan a QR code to link a new one, or pick a
        number you have already connected — either way works.
      </p>

      <div className="number-setup-grid">
        <section className="number-setup-pane" aria-label="Link a new WhatsApp number">
          <div className="number-setup-pane-head">
            <span className="number-setup-pane-title">Scan a new number</span>
            <span className="number-setup-pane-note">WhatsApp › Linked devices</span>
          </div>

          <div className="number-qr-frame">
            {isPending && login?.qr_code ? (
              <Image
                alt="WhatsApp login QR code"
                className="number-qr-image"
                height={220}
                src={login.qr_code}
                unoptimized
                width={220}
              />
            ) : (
              <div className="number-qr-placeholder">
                <Icon name="phone" size={22} />
                <span>
                  {isPending
                    ? "Generating QR code…"
                    : login
                      ? phoneStatusLabels[login.status]
                      : "Start a login to get a QR code"}
                </span>
              </div>
            )}
          </div>

          <div className="number-setup-status">
            {isPending
              ? "Waiting for the scan. The number is assigned to this agent the moment it connects."
              : login
                ? `This login ${phoneStatusLabels[login.status].toLowerCase()}. Get a new QR code to try again.`
                : "The number is detected automatically after you scan."}
          </div>

          {!login ? (
            <input
              className="agents-input"
              maxLength={80}
              onChange={(event) => onLabelChange(event.target.value)}
              placeholder="Label (optional)"
              value={label}
            />
          ) : null}

          <button
            className="agents-btn agents-btn-primary agents-btn-sm"
            disabled={isStarting}
            onClick={() => onStartLogin(canRestart)}
            type="button"
          >
            <Icon name={canRestart ? "refresh" : "plus"} size={15} stroke="#fff" sw={2.2} />
            {isStarting ? "Starting…" : canRestart ? "New QR code" : "Start WhatsApp login"}
          </button>

          {error ? <div className="number-setup-error">{error}</div> : null}
        </section>

        <section className="number-setup-pane" aria-label="Use a connected number">
          <div className="number-setup-pane-head">
            <span className="number-setup-pane-title">Use a connected number</span>
            <span className="number-setup-pane-note">
              {numbers.length === 1 ? "1 number" : `${numbers.length} numbers`}
            </span>
          </div>

          {numbers.length === 0 ? (
            <div className="number-pick-empty">
              No connected numbers yet. Scan the QR code to link your first one, or manage numbers on the{" "}
              <Link href="/dashboard/phone-numbers">Phone Numbers</Link> page.
            </div>
          ) : (
            <ul className="number-pick-list">
              {numbers.map((number) => (
                <li key={number.id}>
                  <button
                    className="number-pick-row"
                    disabled={number.disabled}
                    onClick={() => onSelectNumber(number.id)}
                    title={number.disabled ? number.hint : undefined}
                    type="button"
                  >
                    <span className="number-pick-icon">
                      <Icon name="phone" size={15} />
                    </span>
                    <span className="number-pick-body">
                      <span className="number-pick-name">{number.name}</span>
                      <span className="number-pick-detail">{number.detail}</span>
                    </span>
                    <span
                      className={`number-pick-hint${number.disabled ? " is-blocked" : ""}`}
                    >
                      {number.hint}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

function DeleteAgentModal({
  agent,
  isDeleting,
  onCancel,
  onConfirm,
}: {
  agent: Agent;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !isDeleting) onCancel();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isDeleting, onCancel]);

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => event.currentTarget === event.target && !isDeleting && onCancel()}
    >
      <div className="modal-card confirm-modal-card" role="alertdialog" aria-modal="true">
        <div className="confirm-modal-body">
          <span className="confirm-danger-icon">
            <Icon name="trash" size={20} stroke="#fda4af" sw={2} />
          </span>
          <h2 className="modal-title">Delete “{agent.name}”?</h2>
          <p className="confirm-modal-copy">
            This permanently removes the agent, its prompt, and all of its configuration.
            This action cannot be undone.
          </p>
          <div className="confirm-agent-chip">
            <AgentAvatar agent={agent} />
            <span style={{ minWidth: 0 }}>
              <span className="agent-name">{agent.name}</span>
              <span className="agent-role">{agent.role}</span>
            </span>
            <StatusPill status={agent.status} />
          </div>
        </div>
        <div className="modal-footer confirm-modal-footer">
          <button
            className="agents-btn agents-btn-secondary"
            disabled={isDeleting}
            onClick={onCancel}
            type="button"
          >
            Cancel
          </button>
          <button
            className="agents-btn agents-btn-danger"
            disabled={isDeleting}
            onClick={onConfirm}
            type="button"
          >
            <Icon name="trash" size={15} stroke="#fff" sw={2.2} />
            {isDeleting ? "Deleting…" : "Delete agent"}
          </button>
        </div>
      </div>
    </div>
  );
}

const configSectionCopy: Record<ConfigSectionId, string> = {
  model: "Configure the LLM that powers the agent's reasoning and conversation.",
  transcriber: "Choose the speech-to-text engine used to transcribe the caller.",
  voice: "Configure the voice provider and delivery settings used during live calls.",
  "knowledge-base": "Attach knowledge bases the agent can quote from during calls.",
  tools: "Create the actions this agent can take during a call, and attach them.",
};

function ConfigSectionModal({
  agent,
  isSaving,
  onClose,
  onSave,
  sectionId,
}: {
  agent: Agent;
  isSaving: boolean;
  onClose: () => void;
  onSave: (agent: Agent) => Promise<boolean>;
  sectionId: ConfigSectionId;
}) {
  const [draftAgent, setDraftAgent] = useState(agent);
  // The draft is seeded from the agent, so it goes stale the moment the parent
  // replaces the agent object — which happens on every save. Re-seeding keeps the
  // form showing the agent it claims to edit instead of a pre-save snapshot. The
  // parent only produces a new object on save or an explicit patch, both of which
  // land outside an in-progress edit, so nothing typed here is lost.
  const [seededAgent, setSeededAgent] = useState(agent);
  if (seededAgent !== agent) {
    setSeededAgent(agent);
    setDraftAgent(agent);
  }
  const section = configSections.find((item) => item.id === sectionId);

  function updateDraft(updater: (agent: Agent) => Agent) {
    setDraftAgent(updater);
  }

  function updateVoice(patch: Partial<VoiceConfig>) {
    updateDraft((current) => ({ ...current, voice: { ...current.voice, ...patch } }));
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !isSaving) onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isSaving, onClose]);

  if (!section) return null;

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => event.currentTarget === event.target && !isSaving && onClose()}
    >
      <div className={`modal-card config-modal-card${sectionId === "voice" ? " config-modal-card-wide" : ""}`}>
        <div className="modal-head">
          <div className="config-modal-heading">
            <span className="accordion-icon config-modal-icon">
              <Icon name={section.icon} size={18} />
            </span>
            <div style={{ minWidth: 0 }}>
              <div className="config-modal-title-row">
                <h2 className="modal-title">{section.label}</h2>
                {sectionId === "voice" ? (
                  <span className="config-provider-badge">
                    {draftAgent.voice.provider === "11labs"
                      ? "ElevenLabs"
                      : usesOpenAIRealtime(draftAgent)
                        ? "OpenAI Realtime"
                        : "OpenAI (Standard)"}
                  </span>
                ) : null}
              </div>
              <div className="modal-subtitle">{configSectionCopy[sectionId]}</div>
            </div>
          </div>
          <button
            aria-label={`Close ${section.label} settings`}
            className="icon-button"
            disabled={isSaving}
            onClick={onClose}
            type="button"
          >
            <Icon name="x" size={16} />
          </button>
        </div>
        <div className="modal-body">
          {sectionId === "voice" ? (
            <div className="selected-provider-pill" aria-label="Selected voice provider">
              <span className="selected-provider-pill-icon"><Icon name="check" size={14} /></span>
              <span className="selected-provider-pill-label">Live-call provider</span>
              <strong>
                {draftAgent.voice.provider === "11labs"
                  ? "ElevenLabs"
                  : usesOpenAIRealtime(draftAgent)
                    ? "OpenAI Realtime"
                    : "OpenAI (Standard)"}
              </strong>
            </div>
          ) : null}
          <fieldset
            disabled={isSaving}
            style={{ border: 0, margin: 0, minInlineSize: 0, padding: 0 }}
          >
            <ConfigBody
              agent={draftAgent}
              onSelectedChange={updateDraft}
              onVoiceChange={updateVoice}
              sectionId={sectionId}
            />
          </fieldset>
        </div>
        <div className="modal-footer">
          <button
            className="agents-btn agents-btn-primary"
            disabled={isSaving}
            onClick={async () => {
              const saved = await onSave(draftAgent);
              if (saved) onClose();
            }}
            type="button"
          >
            {isSaving ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ConfigMeta({
  agent,
  sectionId,
}: {
  agent: Agent;
  sectionId: ConfigSectionId;
}) {
  let value: string | number | null = null;
  if (sectionId === "model") {
    value = usesOpenAIRealtime(agent)
      ? optionLabel(openAIRealtimeModels, agent.voice.realtime_model)
      : llmModels[agent.llm.provider].find((option) => option.id === agent.llm.model)?.label
        ?? agent.llm.model;
  }
  if (sectionId === "transcriber") {
    value = usesOpenAIRealtime(agent)
      ? "Realtime speech input"
      : transcriberModels[agent.transcriber.provider].find((option) => option.id === agent.transcriber.model)?.label ??
        (agent.transcriber.provider === "11labs" ? "Scribe" : "GPT-4o");
  }
  if (sectionId === "voice") {
    value = agent.voice.provider === "11labs"
      ? "ElevenLabs"
      : usesOpenAIRealtime(agent)
        ? "OpenAI Realtime"
        : "OpenAI (Standard)";
  }
  if (sectionId === "knowledge-base") value = agent.knowledge_base_ids.length;
  if (sectionId === "tools") value = agent.tool_ids.length;
  return value === null ? <span /> : <span className="config-badge">{value}</span>;
}

// One document queued for upload from the agent's Knowledge Base modal. The
// title is what the source is stored under; it is prefilled from the filename
// and stays editable, because the vector store uses it verbatim as a record id.
type KnowledgeBaseUploadFile = { key: number; file: File; title: string };

// One pasted text queued for indexing. A file and a text are the same thing by
// the time they are stored — a titled body of text — so they differ only in
// where the text comes from: the server extracts one, the user types the other.
type KnowledgeBaseTextDraft = { key: number; title: string; text: string };

// The "create one for these documents" entry of the target picker. It is not a
// knowledge base id, so it can never collide with one.
const newKnowledgeBaseTarget = "__new__";

// KnowledgeBaseSectionModal is the "Knowledge Base" row of the configuration
// panel. It attaches knowledge bases to the agent rather than editing agent
// fields, but the attachments are an agent field like any other, so it edits a
// draft and saves through the same onSave the other config sections use — one
// PATCH carrying the agent's complete configuration.
//
// It also uploads documents, so a document can reach an agent without a detour
// through the Knowledge Base workspace. That half is not part of the draft: a
// knowledge base and its sources are their own resources, so creating and
// indexing land immediately, and only the attachment waits for Update.
function KnowledgeBaseSectionModal({
  agent,
  isSaving,
  knowledgeBases,
  onClose,
  onIndexed,
  onSave,
}: {
  agent: Agent;
  isSaving: boolean;
  knowledgeBases: ApiKnowledgeBase[];
  onClose: () => void;
  onIndexed: (base: ApiKnowledgeBase) => void;
  onSave: (agent: Agent) => Promise<boolean>;
}) {
  const { getToken } = useAuth();
  const [attachedIds, setAttachedIds] = useState<string[]>(agent.knowledge_base_ids);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  // Uploads default to a knowledge base the agent already answers from, since
  // that is where a document dropped on an agent's own panel usually belongs.
  const [targetId, setTargetId] = useState<string>(
    () =>
      knowledgeBases.find((base) => agent.knowledge_base_ids.includes(base.knowledge_base_id))
        ?.knowledge_base_id ??
      knowledgeBases[0]?.knowledge_base_id ??
      newKnowledgeBaseTarget
  );
  const [newName, setNewName] = useState("");
  const [sourceMode, setSourceMode] = useState<"file" | "text">("file");
  const [files, setFiles] = useState<KnowledgeBaseUploadFile[]>([]);
  const [fileErrors, setFileErrors] = useState<Record<number, string>>({});
  const [texts, setTexts] = useState<KnowledgeBaseTextDraft[]>(() => [
    { key: 0, title: "", text: "" },
  ]);
  const [textErrors, setTextErrors] = useState<Record<number, string>>({});
  const [uploadError, setUploadError] = useState("");
  const [uploadNotice, setUploadNotice] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const filePicker = useRef<HTMLInputElement>(null);
  const nextKey = useRef(1);

  // Indexing runs inside the upload request, so the dialog stays put until it
  // answers: closing mid-upload would drop the result of work already done.
  const isBusy = isSaving || isUploading;
  const isCreatingTarget = targetId === newKnowledgeBaseTarget;
  const target = knowledgeBases.find((base) => base.knowledge_base_id === targetId) ?? null;
  // A draft the user added and never typed into says nothing about what they
  // meant to index, so it is dropped rather than reported — the endpoint would
  // reject the whole batch over it.
  const filledTexts = texts.filter((draft) => draft.title.trim() || draft.text.trim());
  const pendingCount = sourceMode === "file" ? files.length : filledTexts.length;

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !isBusy) onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isBusy, onClose]);

  function toggle(knowledgeBaseId: string) {
    setAttachedIds((current) =>
      current.includes(knowledgeBaseId)
        ? current.filter((id) => id !== knowledgeBaseId)
        : [...current, knowledgeBaseId]
    );
  }

  // addFiles takes what the picker or a drop handed over. The FileList is a live
  // view onto the input element, so it is copied out before any state is
  // touched — clearing the input empties it. Anything past the per-request limit
  // is left out and reported rather than silently failing the whole batch.
  function addFiles(picked: FileList | null) {
    const chosen = picked ? Array.from(picked) : [];
    if (chosen.length === 0) return;

    const room = knowledgeBaseSourceBounds.filesPerRequest - files.length;
    if (room <= 0) {
      setUploadError(
        `At most ${knowledgeBaseSourceBounds.filesPerRequest} files can be indexed in one request.`
      );
      return;
    }

    const accepted = chosen.slice(0, room);
    setUploadError(
      accepted.length < chosen.length
        ? `Only ${accepted.length} of ${chosen.length} files were added — at most ${knowledgeBaseSourceBounds.filesPerRequest} fit in one request.`
        : ""
    );
    setUploadNotice("");

    const added = accepted.map((file) => ({
      key: nextKey.current++,
      file,
      title: sourceTitleFromFilename(file.name),
    }));
    setFiles((current) => [...current, ...added]);
  }

  function updateFileTitle(key: number, title: string) {
    setFiles((current) =>
      current.map((entry) => (entry.key === key ? { ...entry, title } : entry))
    );
    // The message described the value that was just replaced, so it goes with it.
    setFileErrors((current) => {
      if (!(key in current)) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  function removeFile(key: number) {
    setFiles((current) => current.filter((entry) => entry.key !== key));
  }

  function updateTextDraft(key: number, patch: Partial<KnowledgeBaseTextDraft>) {
    setTexts((current) =>
      current.map((draft) => (draft.key === key ? { ...draft, ...patch } : draft))
    );
    setTextErrors((current) => {
      if (!(key in current)) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  function addTextDraft() {
    if (texts.length >= knowledgeBaseSourceBounds.textsPerRequest) return;
    setTexts((current) => [...current, { key: nextKey.current++, title: "", text: "" }]);
  }

  // The last draft is emptied rather than removed: the text tab with no card at
  // all offers nothing to type into.
  function removeTextDraft(key: number) {
    setTexts((current) =>
      current.length === 1
        ? [{ key: current[0].key, title: "", text: "" }]
        : current.filter((draft) => draft.key !== key)
    );
    setTextErrors((current) => {
      if (!(key in current)) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  // validateFiles mirrors what the endpoint enforces — a format the server can
  // read, a size it accepts, and a storable title unique to the target — so a
  // mistake reads as inline feedback instead of a 400 after the upload. Whether
  // a readable file holds any text is the server's answer to give.
  function validateFiles(entries: KnowledgeBaseUploadFile[]): Record<number, string> {
    const errors: Record<number, string> = {};
    const seen = new Set<string>();
    const existing = new Set((target?.knowledge_base_sources ?? []).map((source) => source.title));

    for (const entry of entries) {
      const title = entry.title.trim();
      const unreadable = describeUnreadableFile(entry.file);
      const titleError = describeInvalidSourceTitle(entry.title);

      if (unreadable) {
        errors[entry.key] = unreadable;
      } else if (titleError) {
        errors[entry.key] = titleError;
      } else if (existing.has(title)) {
        errors[entry.key] = "This knowledge base already has a source with this title.";
      } else if (seen.has(title)) {
        errors[entry.key] = "Another file already uses this title.";
      }

      seen.add(title);
    }

    return errors;
  }

  // validateTexts is validateFiles for a pasted text: the same title rules, with
  // the body standing in for the file the server would have read.
  function validateTexts(entries: KnowledgeBaseTextDraft[]): Record<number, string> {
    const errors: Record<number, string> = {};
    const seen = new Set<string>();
    const existing = new Set((target?.knowledge_base_sources ?? []).map((source) => source.title));

    for (const draft of entries) {
      const title = draft.title.trim();
      const titleError = describeInvalidSourceTitle(draft.title);

      if (titleError) {
        errors[draft.key] = titleError;
      } else if (!draft.text.trim()) {
        errors[draft.key] = "Text is required — this is the content that gets indexed.";
      } else if (existing.has(title)) {
        errors[draft.key] = "This knowledge base already has a source with this title.";
      } else if (seen.has(title)) {
        errors[draft.key] = "Another entry already uses this title.";
      }

      seen.add(title);
    }

    return errors;
  }

  // applySourceFieldErrors puts the server's per-entry errors back on the rows
  // they came from. The field name carries the index the entry was sent under,
  // which is what maps it back to a row; anything else is summarised instead.
  function applySourceFieldErrors<T extends { key: number }>(
    fieldErrors: FieldError[],
    sent: T[],
    pattern: RegExp,
    setPerEntry: (errors: Record<number, string>) => void
  ) {
    const perEntry: Record<number, string> = {};
    const rest: string[] = [];
    for (const fieldError of fieldErrors) {
      const index = Number(pattern.exec(fieldError.field)?.[1] ?? NaN);
      const entry = sent[index];
      if (entry) {
        perEntry[entry.key] = fieldError.message;
      } else {
        rest.push(`${fieldError.field}: ${fieldError.message}`);
      }
    }
    setPerEntry(perEntry);
    setUploadError(rest.join(" · ") || "Fix the highlighted entries before indexing.");
  }

  // indexSources creates the target knowledge base when one was asked for, then
  // sends it the documents or the texts — whichever tab is open; the endpoint is
  // the same one either way. The server extracts, chunks, embeds and upserts
  // inside the request, so this waits the whole indexing out and resolves with
  // the knowledge base already complete, which is why the dialog is disabled
  // while it runs. Indexing is all-or-nothing, so a failure can be retried as is.
  async function indexSources() {
    const isFileMode = sourceMode === "file";
    if (isUploading || pendingCount === 0) return;

    const name = newName.trim();
    if (isCreatingTarget) {
      if (!name) {
        setUploadError("Name the new knowledge base before indexing.");
        return;
      }
      if (name.length > knowledgeBaseNameLimit) {
        setUploadError(`Name must be at most ${knowledgeBaseNameLimit} characters.`);
        return;
      }
    }

    const errors = isFileMode ? validateFiles(files) : validateTexts(filledTexts);
    if (Object.keys(errors).length > 0) {
      if (isFileMode) setFileErrors(errors);
      else setTextErrors(errors);
      setUploadError(
        `Fix the highlighted ${isFileMode ? "files" : "entries"} before indexing.`
      );
      return;
    }

    setIsUploading(true);
    setFileErrors({});
    setTextErrors({});
    setUploadError("");
    setUploadNotice("");
    try {
      let baseId = targetId;
      if (isCreatingTarget) {
        const created = await apiCreateKnowledgeBase({ knowledge_base_name: name }, getToken);
        baseId = created.knowledge_base_id;
        // Published and selected before the sources go up: if indexing then
        // fails, the empty knowledge base exists, and a retry has to fill it
        // rather than create a second one under the same name.
        onIndexed(created);
        setTargetId(baseId);
        setNewName("");
      }

      const updated = isFileMode
        ? await apiAddKnowledgeBaseFileSources(
            baseId,
            files.map((entry) => ({ file: entry.file, title: entry.title })),
            getToken
          )
        : await apiAddKnowledgeBaseSources(
            baseId,
            filledTexts.map((draft) => ({ title: draft.title, text: draft.text })),
            getToken
          );
      onIndexed(updated);
      // A source added from an agent's own panel is meant for that agent, so its
      // knowledge base is ticked — the attachment still saves with Update like
      // any other configuration change.
      setAttachedIds((current) => (current.includes(baseId) ? current : [...current, baseId]));
      const noun = isFileMode ? "file" : "text";
      setUploadNotice(
        `${pendingCount} ${noun}${pendingCount === 1 ? "" : "s"} indexed into “${updated.knowledge_base_name}”. Press Update to save the attachment.`
      );
      if (isFileMode) setFiles([]);
      else setTexts([{ key: nextKey.current++, title: "", text: "" }]);
    } catch (err) {
      if (err instanceof KnowledgeBaseError && err.fieldErrors.length > 0) {
        if (isFileMode) {
          applySourceFieldErrors(err.fieldErrors, files, /^files\[(\d+)\]/, setFileErrors);
        } else {
          applySourceFieldErrors(
            err.fieldErrors,
            filledTexts,
            /^knowledge_base_texts\[(\d+)\]/,
            setTextErrors
          );
        }
      } else {
        setUploadError(
          err instanceof Error ? err.message : `Failed to add ${isFileMode ? "files" : "texts"}`
        );
      }
    } finally {
      setIsUploading(false);
    }
  }

  // An attachment can outlive the knowledge base it points at only until the
  // next load — the server cascades the row away — so the count comes from the
  // ids the catalogue can still account for, not from the raw list.
  const attachedCount = knowledgeBases.filter((base) =>
    attachedIds.includes(base.knowledge_base_id)
  ).length;

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => event.currentTarget === event.target && !isBusy && onClose()}
    >
      <div className="modal-card config-modal-card">
        <div className="modal-head">
          <div className="config-modal-heading">
            <span className="accordion-icon config-modal-icon">
              <Icon name="book" size={18} />
            </span>
            <div style={{ minWidth: 0 }}>
              <div className="config-modal-title-row">
                <h2 className="modal-title">Knowledge Base</h2>
              </div>
              <div className="modal-subtitle">{configSectionCopy["knowledge-base"]}</div>
            </div>
          </div>
          <button
            aria-label="Close Knowledge Base settings"
            className="icon-button"
            disabled={isBusy}
            onClick={onClose}
            type="button"
          >
            <Icon name="x" size={16} />
          </button>
        </div>
        <div className="modal-body">
          <div className="config-notice">
            <strong>
              {attachedCount === 0
                ? `${agent.name} answers from its prompt only`
                : `${attachedCount} knowledge base${attachedCount === 1 ? "" : "s"} attached`}
            </strong>
            <span>
              Attached knowledge bases are retrieved during the call and quoted when the caller
              asks something the prompt does not cover.
            </span>
          </div>

          {knowledgeBases.length === 0 ? (
            <div className="helper-line">
              No knowledge bases yet. Add sources below to create the first one, or build it in
              the{" "}
              <Link className="kb-attach-link" href="/dashboard/knowledge-base">
                Knowledge Base
              </Link>{" "}
              workspace.
            </div>
          ) : (
            <fieldset
              className="kb-attach-list"
              disabled={isBusy}
              style={{ border: 0, margin: 0, minInlineSize: 0, padding: 0 }}
            >
              {knowledgeBases.map((base) => {
                const isAttached = attachedIds.includes(base.knowledge_base_id);

                return (
                  <button
                    aria-pressed={isAttached}
                    className={`kb-attach-row${isAttached ? " is-attached" : ""}`}
                    key={base.knowledge_base_id}
                    onClick={() => toggle(base.knowledge_base_id)}
                    type="button"
                  >
                    <span className={`kb-attach-check${isAttached ? " is-on" : ""}`}>
                      {isAttached ? <Icon name="check" size={13} sw={3} /> : null}
                    </span>
                    <span className="kb-attach-body">
                      <span className="kb-attach-name">{base.knowledge_base_name}</span>
                      <span className="kb-attach-meta">
                        <span className={`kb-attach-status is-${base.status}`}>
                          {knowledgeBaseStatusLabels[base.status]}
                        </span>
                        <span>{describeSources(base)}</span>
                      </span>
                    </span>
                    <span className="kb-attach-action">{isAttached ? "Attached" : "Attach"}</span>
                  </button>
                );
              })}
            </fieldset>
          )}

          <div className="kb-up">
            <div className="kb-up-head">
              <div style={{ minWidth: 0 }}>
                <div className="kb-up-title">Add knowledge</div>
                <div className="kb-up-sub">
                  Upload a document or paste text into a knowledge base without leaving this agent.
                </div>
              </div>
              <button
                className="agents-btn agents-btn-secondary agents-btn-sm"
                disabled={isBusy}
                onClick={() => {
                  setIsUploadOpen((current) => !current);
                  setUploadError("");
                  setUploadNotice("");
                }}
                type="button"
              >
                <Icon name={isUploadOpen ? "x" : "upload"} size={14} />
                {isUploadOpen ? "Cancel" : "Add sources"}
              </button>
            </div>

            {uploadNotice ? (
              <div className="kb-up-note" role="status">
                {uploadNotice}
              </div>
            ) : null}

            {isUploadOpen ? (
              <div className="kb-up-panel">
                <div className="kb-up-tabs" role="tablist">
                  <button
                    aria-selected={sourceMode === "file"}
                    className={`kb-up-tab${sourceMode === "file" ? " is-active" : ""}`}
                    disabled={isBusy}
                    onClick={() => {
                      setSourceMode("file");
                      setUploadError("");
                    }}
                    role="tab"
                    type="button"
                  >
                    <Icon name="upload" size={14} />
                    Upload files
                  </button>
                  <button
                    aria-selected={sourceMode === "text"}
                    className={`kb-up-tab${sourceMode === "text" ? " is-active" : ""}`}
                    disabled={isBusy}
                    onClick={() => {
                      setSourceMode("text");
                      setUploadError("");
                    }}
                    role="tab"
                    type="button"
                  >
                    <Icon name="message" size={14} />
                    Paste text
                  </button>
                </div>

                <div className="kb-up-target">
                  <label className="field-row">
                    <span className="field-label">Add to</span>
                    <select
                      className="agents-select"
                      disabled={isBusy}
                      onChange={(event) => {
                        setTargetId(event.target.value);
                        // The messages described the previous target's sources.
                        setFileErrors({});
                        setTextErrors({});
                        setUploadError("");
                        setUploadNotice("");
                      }}
                      value={targetId}
                    >
                      {knowledgeBases.map((base) => (
                        <option key={base.knowledge_base_id} value={base.knowledge_base_id}>
                          {base.knowledge_base_name}
                        </option>
                      ))}
                      <option value={newKnowledgeBaseTarget}>+ New knowledge base</option>
                    </select>
                  </label>
                  {isCreatingTarget ? (
                    <label className="field-row">
                      <span className="field-label">Name</span>
                      <input
                        className="agents-input"
                        disabled={isBusy}
                        maxLength={knowledgeBaseNameLimit}
                        onChange={(event) => setNewName(event.target.value)}
                        placeholder={`${agent.name} documents`}
                        value={newName}
                      />
                    </label>
                  ) : (
                    <div className="field-row">
                      <span className="field-label">Chunking</span>
                      <div className="field-hint" style={{ marginTop: 0 }}>
                        {target
                          ? `Split into ${target.min_chunk_size}–${target.max_chunk_size} character chunks, embedded and indexed on the server.`
                          : "This knowledge base is no longer available."}
                      </div>
                    </div>
                  )}
                </div>

                {sourceMode === "file" ? (
                  <>
                  <input
                    accept={knowledgeBaseFileExtensions.join(",")}
                    className="kb-up-input"
                    disabled={isBusy}
                    multiple
                    onChange={(event) => {
                      addFiles(event.target.files);
                      // Cleared so picking the same file again still fires a change.
                      event.target.value = "";
                    }}
                    ref={filePicker}
                    type="file"
                  />
                  <button
                    className={`kb-up-drop${isDragging ? " is-dragging" : ""}`}
                    disabled={isBusy || files.length >= knowledgeBaseSourceBounds.filesPerRequest}
                    onClick={() => filePicker.current?.click()}
                    onDragLeave={() => setIsDragging(false)}
                    onDragOver={(event) => {
                      event.preventDefault();
                      if (!isBusy) setIsDragging(true);
                    }}
                    onDrop={(event) => {
                      event.preventDefault();
                      setIsDragging(false);
                      if (!isBusy) addFiles(event.dataTransfer.files);
                    }}
                    type="button"
                  >
                    <Icon name="upload" size={18} />
                    <span className="kb-up-drop-title">
                      {files.length >= knowledgeBaseSourceBounds.filesPerRequest
                        ? `${knowledgeBaseSourceBounds.filesPerRequest} files is the limit for one request`
                        : "Drop documents here, or click to choose"}
                    </span>
                    <span className="kb-up-drop-hint">
                      {knowledgeBaseFileExtensions.join(" · ")} — up to{" "}
                      {Math.round(knowledgeBaseSourceBounds.fileBytes / (1024 * 1024))} MB each,{" "}
                      {knowledgeBaseSourceBounds.filesPerRequest} per request. The text is extracted on
                      the server.
                    </span>
                  </button>

                  {files.map((entry) => {
                    const fileError = fileErrors[entry.key];

                    return (
                      <div className={`kb-up-file${fileError ? " is-invalid" : ""}`} key={entry.key}>
                        <div className="kb-up-file-head">
                          <span className="accordion-icon" style={{ height: 32, width: 32 }}>
                            <Icon name="file" size={15} />
                          </span>
                          <div className="kb-up-file-body">
                            <div className="kb-up-file-name">{entry.file.name}</div>
                            <div className="kb-up-file-meta">{formatFileSize(entry.file.size)}</div>
                          </div>
                          <span className="kb-up-file-spacer" />
                          <button
                            aria-label={`Remove ${entry.file.name}`}
                            className="icon-button"
                            disabled={isBusy}
                            onClick={() => removeFile(entry.key)}
                            type="button"
                          >
                            <Icon name="trash" size={15} />
                          </button>
                        </div>
                        <label className="field-row">
                          <span className="field-label">Title</span>
                          <input
                            className="agents-input"
                            disabled={isBusy}
                            maxLength={knowledgeBaseSourceBounds.titleLength}
                            onChange={(event) => updateFileTitle(entry.key, event.target.value)}
                            placeholder={entry.file.name}
                            value={entry.title}
                          />
                        </label>
                        {fileError ? (
                          <div className="kb-up-file-error" role="alert">
                            {fileError}
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                  </>
                ) : (
                  <>
                    {texts.map((draft, index) => {
                      const draftError = textErrors[draft.key];

                      return (
                        <div
                          className={`kb-up-file${draftError ? " is-invalid" : ""}`}
                          key={draft.key}
                        >
                          <div className="kb-up-file-head">
                            <span className="kb-up-index">Text {index + 1}</span>
                            <span className="kb-up-file-spacer" />
                            <button
                              aria-label={`Remove text ${index + 1}`}
                              className="icon-button"
                              disabled={isBusy}
                              onClick={() => removeTextDraft(draft.key)}
                              type="button"
                            >
                              <Icon name="trash" size={15} />
                            </button>
                          </div>
                          <label className="field-row">
                            <span className="field-label">Title</span>
                            <input
                              className="agents-input"
                              disabled={isBusy}
                              maxLength={knowledgeBaseSourceBounds.titleLength}
                              onChange={(event) =>
                                updateTextDraft(draft.key, { title: event.target.value })
                              }
                              placeholder="Refund policy"
                              value={draft.title}
                            />
                          </label>
                          <label className="field-row">
                            <span className="field-label">Text</span>
                            <textarea
                              className="agents-textarea"
                              disabled={isBusy}
                              onChange={(event) =>
                                updateTextDraft(draft.key, { text: event.target.value })
                              }
                              placeholder="Paste the policy, script or FAQ the agent should be able to quote."
                              value={draft.text}
                            />
                          </label>
                          {draftError ? (
                            <div className="kb-up-file-error" role="alert">
                              {draftError}
                            </div>
                          ) : null}
                        </div>
                      );
                    })}

                    <button
                      className="agents-btn agents-btn-secondary agents-btn-sm"
                      disabled={
                        isBusy || texts.length >= knowledgeBaseSourceBounds.textsPerRequest
                      }
                      onClick={addTextDraft}
                      type="button"
                    >
                      <Icon name="plus" size={14} />
                      Add another text
                    </button>
                  </>
                )}

                {uploadError ? (
                  <div className="form-error" role="alert">
                    {uploadError}
                  </div>
                ) : null}

                <div className="kb-up-footer">
                  <span className="kb-up-count">
                    {sourceMode === "file"
                      ? `${files.length}/${knowledgeBaseSourceBounds.filesPerRequest} files`
                      : `${filledTexts.length}/${knowledgeBaseSourceBounds.textsPerRequest} texts`}
                    {isUploading ? " — indexing runs while you wait" : ""}
                  </span>
                  <button
                    className="agents-btn agents-btn-primary agents-btn-sm"
                    disabled={isBusy || pendingCount === 0 || (!isCreatingTarget && !target)}
                    onClick={indexSources}
                    type="button"
                  >
                    {isUploading
                      ? "Indexing..."
                      : sourceMode === "file"
                        ? "Upload & index"
                        : "Index text"}
                  </button>
                </div>
              </div>
            ) : null}
          </div>

          <div className="helper-line">
            Sources, chunking and refreshes are managed in the{" "}
            <Link className="kb-attach-link" href="/dashboard/knowledge-base">
              Knowledge Base
            </Link>{" "}
            workspace.
          </div>
        </div>
        <div className="modal-footer">
          <button
            className="agents-btn agents-btn-primary"
            disabled={isBusy}
            onClick={async () => {
              const saved = await onSave({ ...agent, knowledge_base_ids: attachedIds });
              if (saved) onClose();
            }}
            type="button"
          >
            {isSaving ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}

// toolTypeLabels names each tool type in the attach list, so a row says what the
// tool would do without the reader having to decode the stored type string.
const toolTypeLabels: Record<ToolType, string> = {
  api_request: "API Request",
  transfer_call: "Transfer Call",
  end_call: "End Call",
  send_text: "Send Text",
};

// The four tool types with the one-line blurb the create panel shows, so the
// choice can be made here instead of opening the Tools workspace to find out
// what each one does. Mirrors the same list in components/tools/ToolsPage.tsx.
const toolTypeOptions: { id: ToolType; icon: IconName; blurb: string }[] = [
  {
    id: "api_request",
    icon: "globe",
    blurb: "Call an HTTP endpoint mid-call and speak the response back.",
  },
  {
    id: "transfer_call",
    icon: "transfer",
    blurb: "Announce a handover to another number, then release the caller.",
  },
  {
    id: "end_call",
    icon: "phoneOff",
    blurb: "Let the agent hang up once the conversation is finished.",
  },
  {
    id: "send_text",
    icon: "message",
    blurb: "Send the caller a WhatsApp message while the call is running.",
  },
];

// ToolDraft is the create panel's form state: every variant's fields on one
// object, so a field does not have to reach through an optional block. Only the
// ones belonging to `type` are ever sent (see draftToolPayload).
type ToolDraft = {
  type: ToolType;
  name: string;
  description: string;
  method: HttpMethod;
  url: string;
  destination: string;
  transferMessage: string;
  textBody: string;
  endMessage: string;
};

function emptyToolDraft(): ToolDraft {
  return {
    type: "api_request",
    name: "",
    description: "",
    method: emptyApiRequestConfig().method,
    url: "",
    destination: "",
    transferMessage: "Connecting you to a teammate now, one moment.",
    textBody: "",
    endMessage: "",
  };
}

// draftToolPayload renders the create body: the one configuration block the
// chosen type reads, and only that one — the server refuses a foreign block.
// send_text and end_call omit theirs when nothing was typed, which is what lets
// the model word the message itself.
function draftToolPayload(draft: ToolDraft): CreateToolPayload {
  const base = {
    type: draft.type,
    name: draft.name.trim(),
    description: draft.description.trim(),
  };

  switch (draft.type) {
    case "api_request":
      return {
        ...base,
        api_request: {
          ...emptyApiRequestConfig(),
          method: draft.method,
          url: draft.url.trim(),
        },
      };
    case "transfer_call":
      return {
        ...base,
        transfer_call: {
          destination: draft.destination.trim(),
          message: draft.transferMessage.trim(),
        },
      };
    case "send_text":
      return draft.textBody.trim() ? { ...base, send_text: { body: draft.textBody.trim() } } : base;
    case "end_call":
      return draft.endMessage.trim()
        ? { ...base, end_call: { message: draft.endMessage.trim() } }
        : base;
    default:
      return base;
  }
}

// describeToolError turns a failed create into one line. A 400 carrying
// per-field errors names the offending field, since that is almost always the
// one to fix.
function describeToolError(error: unknown, fallback: string): string {
  if (error instanceof ToolError) {
    const field = error.fieldErrors[0];
    if (field) return `${field.field}: ${field.message}`;
    return error.message;
  }
  return fallback;
}

// looksLikeE164 mirrors the destination check the server runs, so a mistyped
// number is caught before the round trip. It is deliberately permissive about
// which ranges exist: the point is to catch a name typed into a phone field.
function looksLikeE164(value: string): boolean {
  return /^\+\d{7,15}$/.test(value);
}

// ToolsSectionModal decides which tools this agent may reach for, and can author
// a new one in place: an agent with no tools yet would otherwise need a detour
// through the Tools workspace before it can do anything but talk.
//
// The two halves save differently, the same split the Knowledge Base section
// uses. A created tool is stored the moment Create is pressed — it is a row of
// its own, not part of this agent — while the attachment set is replaced
// wholesale on Update, so the list held here is the complete answer rather than
// a diff.
function ToolsSectionModal({
  agent,
  isSaving,
  onClose,
  onSave,
}: {
  agent: Agent;
  isSaving: boolean;
  onClose: () => void;
  onSave: (agent: Agent) => Promise<boolean>;
}) {
  const { getToken } = useAuth();
  const [tools, setTools] = useState<ApiTool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [attachedIds, setAttachedIds] = useState<string[]>(agent.tool_ids);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [draft, setDraft] = useState<ToolDraft>(emptyToolDraft);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [createNotice, setCreateNotice] = useState("");

  const isBusy = isSaving || isCreating;

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const stored = await apiListTools(getToken);
        if (!cancelled) setTools(stored);
      } catch {
        if (!cancelled) setLoadError("Could not load your tools.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [getToken]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !isBusy) onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isBusy, onClose]);

  function toggle(toolId: string) {
    setAttachedIds((current) =>
      current.includes(toolId) ? current.filter((id) => id !== toolId) : [...current, toolId]
    );
  }

  // patchDraft clears the error along with the edit: the message named a field,
  // and leaving it up while that field is being fixed reads as a live verdict.
  function patchDraft(patch: Partial<ToolDraft>) {
    setDraft((current) => ({ ...current, ...patch }));
    setCreateError("");
  }

  // createDraftTool stores the tool and attaches it. The checks below are ones
  // the server would fail the request on anyway; running them here spends no
  // round trip and can name the field that is wrong.
  async function createDraftTool() {
    if (isBusy) return;

    const name = draft.name.trim();
    if (!name) {
      setCreateError("Give the tool a name first.");
      return;
    }
    if (!isValidToolName(name)) {
      const suggestion = suggestToolName(name);
      setCreateError(
        suggestion
          ? `“${name}” is not a valid function name. Try “${suggestion}”.`
          : "Use lowercase letters, digits and underscores for the name."
      );
      return;
    }
    if (!draft.description.trim()) {
      setCreateError("Describe the tool — the description is what the model reads.");
      return;
    }
    if (draft.type === "api_request" && !draft.url.trim()) {
      setCreateError("An API request tool needs an endpoint URL.");
      return;
    }
    if (draft.type === "transfer_call" && !looksLikeE164(draft.destination.trim())) {
      setCreateError("Enter the destination in E.164 form, e.g. +8801639726992.");
      return;
    }

    setIsCreating(true);
    setCreateError("");
    try {
      const created = await apiCreateTool(draftToolPayload(draft), getToken);
      setTools((current) => [created, ...current]);
      setAttachedIds((current) =>
        current.includes(created.id) ? current : [...current, created.id]
      );
      setDraft(emptyToolDraft());
      setIsCreateOpen(false);
      setCreateNotice(
        `“${created.name}” created and attached. Press Update to save it to ${agent.name}.`
      );
    } catch (error) {
      setCreateError(describeToolError(error, "Could not create the tool."));
    } finally {
      setIsCreating(false);
    }
  }

  const attachedCount = attachedIds.length;
  const trimmedDraftName = draft.name.trim();
  // Only offered while the typed name would be rejected, so the button reads as
  // an answer to a problem rather than as a second name field.
  const nameSuggestion =
    trimmedDraftName && !isValidToolName(trimmedDraftName) ? suggestToolName(trimmedDraftName) : "";
  const hasSideField = draft.type === "api_request" || draft.type === "transfer_call";

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => event.currentTarget === event.target && !isBusy && onClose()}
    >
      <div className="modal-card config-modal-card">
        <div className="modal-head">
          <div className="config-modal-heading">
            <span className="accordion-icon config-modal-icon">
              <Icon name="wrench" size={18} />
            </span>
            <div style={{ minWidth: 0 }}>
              <div className="config-modal-title-row">
                <h2 className="modal-title">Tools</h2>
              </div>
              <div className="modal-subtitle">{configSectionCopy.tools}</div>
            </div>
          </div>
          <button
            aria-label="Close Tools settings"
            className="icon-button"
            disabled={isBusy}
            onClick={onClose}
            type="button"
          >
            <Icon name="x" size={16} />
          </button>
        </div>
        <div className="modal-body">
          <div className="config-notice">
            <strong>
              {attachedCount === 0
                ? `${agent.name} can only talk`
                : `${attachedCount} tool${attachedCount === 1 ? "" : "s"} attached`}
            </strong>
            <span>
              Attached tools are offered to the model on every call this agent answers or places,
              inbound and outbound alike. It decides when to use one from the tool&apos;s
              description.
            </span>
          </div>

          {isLoading ? (
            <div className="helper-line">Loading tools…</div>
          ) : loadError ? (
            <div className="helper-line">{loadError}</div>
          ) : tools.length === 0 ? (
            <div className="helper-line">
              No tools yet. Create the first one below, or build it in the{" "}
              <Link className="kb-attach-link" href="/dashboard/tools">
                Tools
              </Link>{" "}
              workspace.
            </div>
          ) : (
            <fieldset
              className="kb-attach-list"
              disabled={isBusy}
              style={{ border: 0, margin: 0, minInlineSize: 0, padding: 0 }}
            >
              {tools.map((tool) => {
                const isAttached = attachedIds.includes(tool.id);

                return (
                  <button
                    aria-pressed={isAttached}
                    className={`kb-attach-row${isAttached ? " is-attached" : ""}`}
                    key={tool.id}
                    onClick={() => toggle(tool.id)}
                    type="button"
                  >
                    <span className={`kb-attach-check${isAttached ? " is-on" : ""}`}>
                      {isAttached ? <Icon name="check" size={13} sw={3} /> : null}
                    </span>
                    <span className="kb-attach-body">
                      <span className="kb-attach-name">{tool.name}</span>
                      <span className="kb-attach-meta">
                        <span>{toolTypeLabels[tool.type]}</span>
                        <span>{toolSummary(tool)}</span>
                      </span>
                    </span>
                    <span className="kb-attach-action">{isAttached ? "Attached" : "Attach"}</span>
                  </button>
                );
              })}
            </fieldset>
          )}

          <div className="kb-up">
            <div className="kb-up-head">
              <div style={{ minWidth: 0 }}>
                <div className="kb-up-title">Add a tool</div>
                <div className="kb-up-sub">
                  Create an action without leaving this agent — it is attached as soon as it is
                  created.
                </div>
              </div>
              <button
                className="agents-btn agents-btn-secondary agents-btn-sm"
                disabled={isBusy}
                onClick={() => {
                  setIsCreateOpen((current) => !current);
                  setCreateError("");
                  setCreateNotice("");
                }}
                type="button"
              >
                <Icon name={isCreateOpen ? "x" : "plus"} size={14} />
                {isCreateOpen ? "Cancel" : "New tool"}
              </button>
            </div>

            {createNotice ? (
              <div className="kb-up-note" role="status">
                {createNotice}
              </div>
            ) : null}

            {isCreateOpen ? (
              <div className="kb-up-panel">
                <div aria-label="Tool type" className="tool-new-types" role="radiogroup">
                  {toolTypeOptions.map((option) => {
                    const isActive = draft.type === option.id;

                    return (
                      <button
                        aria-checked={isActive}
                        className={`tool-new-type${isActive ? " is-active" : ""}`}
                        disabled={isBusy}
                        key={option.id}
                        onClick={() => patchDraft({ type: option.id })}
                        role="radio"
                        type="button"
                      >
                        <span className="tool-new-type-icon">
                          <Icon name={option.icon} size={15} />
                        </span>
                        <span style={{ minWidth: 0 }}>
                          <span className="tool-new-type-label">{toolTypeLabels[option.id]}</span>
                          <span className="tool-new-type-blurb">{option.blurb}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className={`tool-new-grid${hasSideField ? "" : " is-single"}`}>
                  <label className="field-row">
                    <span className="field-label">Name</span>
                    <input
                      className="agents-input"
                      disabled={isBusy}
                      maxLength={toolBounds.nameLength}
                      onChange={(event) => patchDraft({ name: event.target.value })}
                      placeholder="check_order_status"
                      value={draft.name}
                    />
                  </label>

                  {draft.type === "api_request" ? (
                    <label className="field-row">
                      <span className="field-label">Method</span>
                      <select
                        className="agents-select"
                        disabled={isBusy}
                        onChange={(event) =>
                          patchDraft({ method: event.target.value as HttpMethod })
                        }
                        value={draft.method}
                      >
                        {httpMethods.map((method) => (
                          <option key={method} value={method}>
                            {method}
                          </option>
                        ))}
                      </select>
                    </label>
                  ) : null}

                  {draft.type === "transfer_call" ? (
                    <label className="field-row">
                      <span className="field-label">Destination</span>
                      <input
                        className="agents-input"
                        disabled={isBusy}
                        onChange={(event) => patchDraft({ destination: event.target.value })}
                        placeholder="+8801639726992"
                        value={draft.destination}
                      />
                    </label>
                  ) : null}
                </div>

                {nameSuggestion ? (
                  <div className="tool-new-suggest">
                    <span>A function name is lowercase letters, digits and underscores.</span>
                    <button
                      className="agents-btn agents-btn-secondary agents-btn-sm"
                      disabled={isBusy}
                      onClick={() => patchDraft({ name: nameSuggestion })}
                      type="button"
                    >
                      Use “{nameSuggestion}”
                    </button>
                  </div>
                ) : null}

                <label className="field-row">
                  <span className="field-label">Description</span>
                  <textarea
                    className="agents-textarea"
                    disabled={isBusy}
                    maxLength={toolBounds.descriptionLength}
                    onChange={(event) => patchDraft({ description: event.target.value })}
                    placeholder="Look up an order by its number and read back the delivery date."
                    style={{ minHeight: 78 }}
                    value={draft.description}
                  />
                  <div className="field-hint">
                    The model reads this to decide when to reach for the tool, so say when to use
                    it, not only what it does.
                  </div>
                </label>

                {draft.type === "api_request" ? (
                  <label className="field-row">
                    <span className="field-label">Endpoint URL</span>
                    <input
                      className="agents-input"
                      disabled={isBusy}
                      maxLength={toolBounds.urlLength}
                      onChange={(event) => patchDraft({ url: event.target.value })}
                      placeholder="https://api.example.com/orders/lookup"
                      value={draft.url}
                    />
                    <div className="field-hint">
                      Headers and the parameters the model fills in are added in the{" "}
                      <Link className="kb-attach-link" href="/dashboard/tools">
                        Tools
                      </Link>{" "}
                      workspace.
                    </div>
                  </label>
                ) : null}

                {draft.type === "transfer_call" ? (
                  <label className="field-row">
                    <span className="field-label">Handover message</span>
                    <textarea
                      className="agents-textarea"
                      disabled={isBusy}
                      maxLength={toolBounds.messageLength}
                      onChange={(event) => patchDraft({ transferMessage: event.target.value })}
                      placeholder="Connecting you to a teammate now, one moment."
                      style={{ minHeight: 70 }}
                      value={draft.transferMessage}
                    />
                    <div className="field-hint">
                      A WhatsApp call cannot be bridged onto a second leg: the agent says this,
                      records the destination against the call, then releases the caller.
                    </div>
                  </label>
                ) : null}

                {draft.type === "send_text" ? (
                  <label className="field-row">
                    <span className="field-label">Message</span>
                    <textarea
                      className="agents-textarea"
                      disabled={isBusy}
                      maxLength={toolBounds.messageLength}
                      onChange={(event) => patchDraft({ textBody: event.target.value })}
                      placeholder="Leave empty and the agent writes the message itself."
                      style={{ minHeight: 70 }}
                      value={draft.textBody}
                    />
                    <div className="field-hint">
                      Optional. A fixed body is sent verbatim; leave it empty to let the agent word
                      the message from the conversation.
                    </div>
                  </label>
                ) : null}

                {draft.type === "end_call" ? (
                  <label className="field-row">
                    <span className="field-label">Goodbye</span>
                    <input
                      className="agents-input"
                      disabled={isBusy}
                      maxLength={toolBounds.messageLength}
                      onChange={(event) => patchDraft({ endMessage: event.target.value })}
                      placeholder="Thanks for calling — goodbye!"
                      value={draft.endMessage}
                    />
                    <div className="field-hint">
                      Optional. The agent speaks its closing line and hangs up once it has finished
                      saying it, never mid-sentence.
                    </div>
                  </label>
                ) : null}

                {createError ? <div className="form-error">{createError}</div> : null}

                <div className="kb-up-footer">
                  <span className="kb-up-count">
                    Stored as a tool of your own — any agent can attach it.
                  </span>
                  <button
                    className="agents-btn agents-btn-primary agents-btn-sm"
                    disabled={isBusy}
                    onClick={createDraftTool}
                    type="button"
                  >
                    {isCreating ? "Creating…" : "Create and attach"}
                  </button>
                </div>
              </div>
            ) : null}
          </div>

          <div className="helper-line">
            What a tool does in full — its headers, parameters and timeout — is edited in the{" "}
            <Link className="kb-attach-link" href="/dashboard/tools">
              Tools
            </Link>{" "}
            workspace.
          </div>
        </div>
        <div className="modal-footer">
          <button
            className="agents-btn agents-btn-primary"
            disabled={isBusy}
            onClick={async () => {
              const saved = await onSave({ ...agent, tool_ids: attachedIds });
              if (saved) onClose();
            }}
            type="button"
          >
            {isSaving ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// describeSources summarises a knowledge base's sources the way the row needs
// it: "4 sources · 1 file, 3 texts". The server omits the list entirely for a
// knowledge base that has none.
function describeSources(base: ApiKnowledgeBase) {
  const sources = base.knowledge_base_sources ?? [];
  if (sources.length === 0) return "No sources yet";

  const counts = { file: 0, text: 0 };
  for (const source of sources) counts[source.type] += 1;

  const parts: string[] = [];
  if (counts.file) parts.push(`${counts.file} file${counts.file === 1 ? "" : "s"}`);
  if (counts.text) parts.push(`${counts.text} text${counts.text === 1 ? "" : "s"}`);
  return `${sources.length} source${sources.length === 1 ? "" : "s"} · ${parts.join(", ")}`;
}

// Switching the live-call provider has to move voice, TTS model and transcriber
// together — the server reads them as one pipeline. Kept in one place so the
// Voice and Transcriber sections can both offer the switch without drifting apart.
function withCallProvider(current: Agent, provider: CallProvider): Agent {
  const llm: LlmConfig = {
    ...current.llm,
    model: pickOption(
      llmModels[current.llm.provider],
      current.llm.model,
      firstEnabledOption(llmModels[current.llm.provider])
    ),
  };
  if (provider === "11labs") {
    return {
      ...current,
      llm,
      // The ElevenLabs voice already on the agent is kept; only an agent that
      // has never used ElevenLabs falls back to the default voice.
      voice: {
        ...current.voice,
        provider: "11labs",
        model: "eleven_flash_v2_5",
        eleven_voice_id: current.voice.eleven_voice_id || defaultElevenLabsVoice.voice_id,
        eleven_voice_name: current.voice.eleven_voice_name || defaultElevenLabsVoice.voice_name,
      },
      transcriber: {
        ...current.transcriber,
        provider: "11labs",
        model: transcriberModels["11labs"][0].id,
      },
    };
  }

  const voice = provider === "openai_realtime"
    ? normalizeOpenAIRealtimeVoice(current.voice.voice)
    : current.voice.voice;
  return {
    ...current,
    llm,
    voice: {
      ...current.voice,
      provider,
      model: pickOption(openAIVoiceModels, current.voice.model, "tts-1"),
      voice,
    },
    transcriber: {
      ...current.transcriber,
      provider: "openai",
      model: pickOption(transcriberModels.openai, current.transcriber.model, transcriberModels.openai[0].id),
    },
  };
}

function withModelSectionProvider(current: Agent, provider: ModelSectionProvider): Agent {
  if (provider === "openai_realtime") {
    return withCallProvider(current, "openai_realtime");
  }

  const next = usesOpenAIRealtime(current)
    ? withCallProvider(current, "openai")
    : current;

  return {
    ...next,
    llm: {
      ...next.llm,
      provider,
      model: firstEnabledOption(llmModels[provider]),
    },
  };
}

function createCallProviderPatch(form: CreateForm, provider: CallProvider): Partial<CreateForm> {
  if (provider === "11labs") {
    return {
      llm_provider: "openai",
      voice_provider: provider,
      voice_model: "eleven_flash_v2_5",
      transcriber_provider: "11labs",
      transcriber_model: transcriberModels["11labs"][0].id,
    };
  }
  return {
    llm_provider: "openai",
    voice_provider: provider,
    voice: provider === "openai_realtime" ? normalizeOpenAIRealtimeVoice(form.voice) : form.voice,
    voice_model: pickOption(openAIVoiceModels, form.voice_model, "tts-1"),
    transcriber_provider: "openai",
    transcriber_model: pickOption(transcriberModels.openai, form.transcriber_model, transcriberModels.openai[0].id),
  };
}

function ConfigBody({
  agent,
  onSelectedChange,
  onVoiceChange,
  sectionId,
}: {
  agent: Agent;
  onSelectedChange: (updater: (agent: Agent) => Agent) => void;
  onVoiceChange: (patch: Partial<VoiceConfig>) => void;
  sectionId: ConfigSectionId;
}) {
  if (sectionId === "model") {
    const isOpenAIRealtime = usesOpenAIRealtime(agent);
    return (
      <div className="model-settings-grid">
        <SelectField
          label="Provider"
          onChange={(provider: ModelSectionProvider) =>
            onSelectedChange((current) => withModelSectionProvider(current, provider))
          }
          options={modelSectionProviders}
          value={isOpenAIRealtime ? "openai_realtime" : agent.llm.provider}
        />
        {isOpenAIRealtime ? (
          <>
            <SelectField
              label="Live-call model"
              onChange={(realtime_model: OpenAIRealtimeModel) =>
                onVoiceChange({ realtime_model })
              }
              options={openAIRealtimeModels}
              value={agent.voice.realtime_model}
            />
            <div className="config-notice config-notice-live model-settings-notice">
              <strong>Low-latency speech-to-speech model</strong>
              <span>
                OpenAI Realtime handles listening, reasoning, and speech in one live session, so a separate text model and temperature are not used.
              </span>
            </div>
          </>
        ) : (
          <>
            <SelectField
              label="Model"
              onChange={(model: LlmModel) =>
                onSelectedChange((current) => ({
                  ...current,
                  llm: { ...current.llm, model },
                }))
              }
              options={llmModels[agent.llm.provider]}
              value={agent.llm.model}
            />
            <div className="model-settings-temperature">
              <RangeField
                label="Temperature"
                max={1}
                min={0}
                onChange={(temperature) =>
                  onSelectedChange((current) => ({
                    ...current,
                    llm: { ...current.llm, temperature },
                  }))
                }
                step={0.05}
                value={agent.llm.temperature}
              />
              <span className="field-hint">
                Lower values are more deterministic, higher values more creative.
              </span>
            </div>
          </>
        )}
      </div>
    );
  }

  if (sectionId === "transcriber") {
    if (usesOpenAIRealtime(agent)) {
      return (
        <div className="config-notice config-notice-live">
          <strong>Transcription is integrated into OpenAI Realtime</strong>
          <span>
            Caller audio streams directly into the live model. There is no separate transcription request or Scribe model on this route.
          </span>
          <div className="read-only-row">
            <span>Turn detection</span>
            <code>Server VAD · 250 ms</code>
          </div>
          <span className="config-notice-action">
            To pick a separate transcriber, change the model from the <em>Model</em> settings —
            Realtime is selected there.
          </span>
        </div>
      );
    }
    return (
      <div className="modal-grid">
        <SelectField
          label="Provider"
          onChange={(provider: TranscriberProvider) =>
            onSelectedChange((current) => withCallProvider(current, provider))
          }
          options={transcriberProviderOptions}
          value={agent.transcriber.provider}
        />
        <span className="field-hint">
          Speech-to-text and voice output run as one live pipeline, so choosing ElevenLabs Scribe
          also switches voice output to ElevenLabs (and OpenAI back to OpenAI).
        </span>
        <SelectField
          label="Transcriber model"
          onChange={(model: TranscriberModel) =>
            onSelectedChange((current) => ({
              ...current,
              transcriber: { ...current.transcriber, model },
            }))
          }
          options={transcriberModels[agent.transcriber.provider]}
          value={agent.transcriber.model}
        />
      </div>
    );
  }

  if (sectionId === "voice") {
    const isElevenLabs = agent.voice.provider === "11labs";
    const isOpenAIRealtime = usesOpenAIRealtime(agent);
    return (
      <div className="voice-settings-grid">
        {isOpenAIRealtime ? (
          <div className="config-notice config-notice-live voice-settings-panel-wide">
            <strong>OpenAI native Realtime audio</strong>
            <span>
              Speech understanding, response generation, and voice output share one persistent session for minimum latency.
            </span>
            <span className="config-notice-action">
              To leave Realtime and run a separate LLM, transcriber and voice, change the model from
              the <em>Model</em> settings.
            </span>
          </div>
        ) : null}
        <div className="voice-settings-panel">
          <span className="voice-settings-panel-title">Provider</span>
          <SelectField
            label="Provider"
            onChange={(provider: CallProvider) =>
              onSelectedChange((current) => withCallProvider(current, provider))
            }
            options={voiceProviders}
            value={agent.voice.provider}
          />
        </div>
        <div className="voice-settings-panel voice-settings-panel-primary">
          <span className="voice-settings-panel-title">Voice</span>
          <div className="voice-settings-stack">
            {isElevenLabs ? (
              <>
                <ElevenLabsVoiceField
                  onChange={(selection) =>
                    onVoiceChange({
                      eleven_voice_id: selection.voice_id,
                      eleven_voice_name: selection.voice_name,
                    })
                  }
                  value={{
                    voice_id: agent.voice.eleven_voice_id,
                    voice_name: agent.voice.eleven_voice_name,
                  }}
                />
                <SelectField
                  label="ElevenLabs model"
                  onChange={(model: VoiceModel) => onVoiceChange({ model })}
                  options={elevenLabsVoiceModels}
                  value={agent.voice.model}
                />
                {elevenLabsSpeaksLanguage(agent.voice.model, agent.language) ? null : (
                  <div className="config-notice config-notice-warning">
                    <strong>
                      This voice does not speak {languageLabel(agent.language)}
                    </strong>
                    <span>
                      The agent will write its replies in {languageLabel(agent.language)}, but this
                      model cannot say them. Eleven Flash v2.5 and Turbo v2.5 cover 32 languages
                      between them; for anything outside those, switch this agent’s voice provider
                      to OpenAI.
                    </span>
                  </div>
                )}
              </>
            ) : (
              <>
                {isOpenAIRealtime ? (
                  <SelectField
                    label="Realtime model"
                    onChange={(realtime_model: OpenAIRealtimeModel) =>
                      onVoiceChange({ realtime_model })
                    }
                    options={openAIRealtimeModels}
                    value={agent.voice.realtime_model}
                  />
                ) : (
                  <SelectField
                    label="OpenAI TTS model"
                    onChange={(model: VoiceModel) =>
                      onSelectedChange((current) => ({
                        ...current,
                        voice: {
                          ...current.voice,
                          model,
                          voice: openAIVoicesForModel(model).some((option) => option.id === current.voice.voice)
                            ? current.voice.voice
                            : "openai-Alloy",
                        },
                      }))
                    }
                    options={openAIVoiceModels}
                    value={agent.voice.model}
                  />
                )}
                <SelectField
                  label="OpenAI voice"
                  onChange={(voice: VoiceId) => onVoiceChange({ voice })}
                  options={isOpenAIRealtime ? openAIRealtimeVoiceOptions : openAIVoicesForModel(agent.voice.model)}
                  value={agent.voice.voice}
                />
              </>
            )}
          </div>
        </div>
        <div className="voice-settings-panel voice-settings-panel-wide">
          <span className="voice-settings-panel-title">Delivery</span>
          <div className="voice-settings-controls">
            <RangeField label="Voice speed" max={1.2} min={0.7} onChange={(speed) => onVoiceChange({ speed })} step={0.1} value={agent.voice.speed} />
            {/* Volume starts at 0.1, not 0: the server reads 0 as "not set" and
                leaves the gain untouched, so a 0 here would look like mute but
                change nothing on the call. */}
            <RangeField label="Volume" max={2} min={0.1} onChange={(volume) => onVoiceChange({ volume })} step={0.1} value={agent.voice.volume} />
          </div>
        </div>
        <div className="voice-settings-panel voice-settings-panel-wide">
          <span className="voice-settings-panel-title">Voice instructions</span>
          <label className="field-row">
            <span className="field-label">Speaking style</span>
            <textarea
              className="agents-textarea"
              onChange={(event) => onVoiceChange({ openai_instructions: event.target.value })}
              value={agent.voice.openai_instructions}
            />
          </label>
        </div>
      </div>
    );
  }

  return null;
}

function CreateAgentModal({
  error,
  form,
  isSubmitting,
  onCancel,
  onCreate,
  phoneNumberOptions,
  setForm,
}: {
  error: string;
  form: CreateForm;
  isSubmitting: boolean;
  onCancel: () => void;
  onCreate: () => void;
  phoneNumberOptions: Option[];
  setForm: React.Dispatch<React.SetStateAction<CreateForm>>;
}) {
  function patch(patchForm: Partial<CreateForm>) {
    setForm((current) => ({ ...current, ...patchForm }));
  }

  // The options are direction-aware: if changing the call direction disables the
  // selected number, re-point to the first still-available number
  // (options[0] is the "No phone number" entry), falling back to no assignment
  // only when none remain, so the form never submits a vanished number.
  useEffect(() => {
    if (
      phoneNumberOptions.some(
        (option) => option.id === form.phone_number_id && !option.disabled
      )
    ) {
      return;
    }
    const firstNumber = phoneNumberOptions.find((option) => option.id !== "" && !option.disabled);
    setForm((current) => ({ ...current, phone_number_id: firstNumber?.id ?? "" }));
  }, [phoneNumberOptions, form.phone_number_id, setForm]);

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.currentTarget === event.target && onCancel()}>
      <form
        className="modal-card"
        onSubmit={(event) => {
          event.preventDefault();
          onCreate();
        }}
      >
        <div className="modal-head">
          <div>
            <h2 className="modal-title">Create Agent</h2>
            <div className="modal-subtitle">Configure and save a new voice agent.</div>
          </div>
          <button aria-label="Close create agent modal" className="icon-button" onClick={onCancel} type="button">
            <Icon name="x" size={16} />
          </button>
        </div>

        <div className="modal-body">
          <div className="modal-section">
            <h3 className="modal-section-title">Identity</h3>
            <div className="modal-grid">
              <label className="field-row">
                <span className="field-label">Agent name</span>
                <input
                  className="agents-input"
                  onChange={(event) => patch({ name: event.target.value })}
                  placeholder="Jarvis"
                  value={form.name}
                />
              </label>
              <SearchableSelect
                label="Language"
                onChange={(language: string) => patch({ language })}
                options={languages}
                value={form.language}
              />
              <SelectField
                label="Timezone"
                onChange={(timezone: string) => patch({ timezone })}
                options={timezoneOptions.filter((option) =>
                  [
                    "Asia/Dhaka",
                    "America/New_York",
                    "America/Los_Angeles",
                    "Europe/London",
                    "Europe/Berlin",
                    "Asia/Kolkata",
                  ].includes(option.id)
                )}
                value={form.timezone}
              />
              <div className="field-row">
                <span className="field-label">Call direction</span>
                <div className="segmented">
                  {callDirectionOptions.map((option) => (
                    <button
                      className={`segment-btn${form.call_direction === option.id ? " is-active" : ""}`}
                      key={option.id}
                      onClick={() => patch({ call_direction: option.id })}
                      type="button"
                    >
                      <Icon name={option.id === "inbound" ? "phone" : option.id === "outbound" ? "upload" : "refresh"} size={14} />
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              <SearchableSelect
                label="Phone number"
                onChange={(phone_number_id: string) => patch({ phone_number_id })}
                options={phoneNumberOptions}
                value={form.phone_number_id}
              />
            </div>
          </div>

          <div className="modal-section">
            <h3 className="modal-section-title">Model</h3>
            <div className="modal-grid">
              <SelectField
                label="Provider"
                onChange={(provider: CallProvider) => patch(createCallProviderPatch(form, provider))}
                options={voiceProviders}
                value={form.voice_provider}
              />
              {form.voice_provider === "openai_realtime" ? (
                <SelectField
                  label="Live-call model"
                  onChange={(realtime_model: OpenAIRealtimeModel) => patch({ realtime_model })}
                  options={openAIRealtimeModels}
                  value={form.realtime_model}
                />
              ) : (
                <SelectField
                  label="Model"
                  onChange={(llm_model: LlmModel) => patch({ llm_model })}
                  options={llmModels.openai}
                  value={form.llm_model}
                />
              )}
            </div>
            {form.voice_provider === "openai_realtime" ? (
              <div className="config-notice config-notice-live">
                <strong>Low-latency OpenAI Realtime route</strong>
                <span>The live call uses one speech-to-speech session instead of separate transcription, text model, and TTS requests.</span>
              </div>
            ) : null}
          </div>

          <div className="modal-section">
            <h3 className="modal-section-title">Prompt & behavior</h3>
            <SelectField label="Begin message mode" onChange={(begin_message_mode: BeginMessageMode) => patch({ begin_message_mode })} options={beginModeOptions} value={form.begin_message_mode} />
            <label className="field-row">
              <span className="field-label">Welcome message</span>
              <textarea className="agents-textarea" onChange={(event) => patch({ welcome_message: event.target.value })} value={form.welcome_message} />
            </label>
            <label className="field-row">
              <span className="field-label">System prompt</span>
              <textarea className="agents-textarea" onChange={(event) => patch({ system_prompt: event.target.value })} value={form.system_prompt} />
            </label>
          </div>

          <div className="modal-section">
            <h3 className="modal-section-title">Voice & live audio</h3>
            <div className="config-notice config-notice-live">
              <strong>
                {form.voice_provider === "openai_realtime"
                  ? "OpenAI native Realtime audio"
                  : "Each agent chooses its own live-call provider"}
              </strong>
              <span>
                {form.voice_provider === "openai_realtime"
                  ? "Speech input and output stay on one persistent Realtime connection."
                  : "Inbound calls stream through the provider selected below."}
              </span>
            </div>
            <SelectField
              label="Live-call provider"
              onChange={(provider: CallProvider) => patch(createCallProviderPatch(form, provider))}
              options={voiceProviders}
              value={form.voice_provider}
            />
            <div className="modal-grid">
              {form.voice_provider === "11labs" ? (
                <>
                  <SelectField label="ElevenLabs model" onChange={(voice_model: VoiceModel) => patch({ voice_model })} options={elevenLabsVoiceModels} value={form.voice_model} />
                  <ElevenLabsVoiceField
                    onChange={(selection) =>
                      patch({
                        eleven_voice_id: selection.voice_id,
                        eleven_voice_name: selection.voice_name,
                      })
                    }
                    value={{ voice_id: form.eleven_voice_id, voice_name: form.eleven_voice_name }}
                  />
                </>
              ) : (
                <>
                  {form.voice_provider === "openai_realtime" ? (
                    <div className="read-only-row">
                      <span>Realtime model</span>
                      <code>{form.realtime_model}</code>
                    </div>
                  ) : (
                    <SelectField
                      label="OpenAI TTS model"
                      onChange={(voice_model: VoiceModel) => patch({
                        voice_model,
                        voice: openAIVoicesForModel(voice_model).some((option) => option.id === form.voice)
                          ? form.voice
                          : "openai-Alloy",
                      })}
                      options={openAIVoiceModels}
                      value={form.voice_model}
                    />
                  )}
                  <SelectField
                    label="OpenAI voice"
                    onChange={(voice: VoiceId) => patch({ voice })}
                    options={form.voice_provider === "openai_realtime" ? openAIRealtimeVoiceOptions : openAIVoicesForModel(form.voice_model)}
                    value={form.voice_provider === "openai_realtime" ? normalizeOpenAIRealtimeVoice(form.voice) : form.voice}
                  />
                </>
              )}
              {form.voice_provider === "openai_realtime" ? (
                <div className="read-only-row">
                  <span>Speech input</span>
                  <code>Realtime · Server VAD</code>
                </div>
              ) : (
                <>
                  <SelectField
                    label="Transcriber provider"
                    onChange={(provider: TranscriberProvider) =>
                      patch(createCallProviderPatch(form, provider))
                    }
                    options={transcriberProviderOptions}
                    value={form.transcriber_provider}
                  />
                  <SelectField
                    label="Transcriber model"
                    onChange={(transcriber_model: TranscriberModel) => patch({ transcriber_model })}
                    options={transcriberModels[form.transcriber_provider]}
                    value={form.transcriber_model}
                  />
                </>
              )}
            </div>
            <RangeField label="Voice speed" max={1.2} min={0.7} onChange={(voice_speed) => patch({ voice_speed })} step={0.05} value={form.voice_speed} />
          </div>
        </div>

        <div className="modal-footer">
          {error ? <div className="form-error">{error}</div> : null}
          <button className="agents-btn agents-btn-secondary" onClick={onCancel} type="button">
            Cancel
          </button>
          <button
            className="agents-btn agents-btn-primary"
            disabled={!form.name.trim() || isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Creating…" : "Create agent"}
          </button>
        </div>
      </form>
    </div>
  );
}

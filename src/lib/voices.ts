import { ApiError } from "./agents";
import { serverFetch, type AuthTokenGetter } from "./api";

// Voice discovery for the agent voice picker. The server proxies ElevenLabs
// with its workspace key and normalises both sources — the public library and
// the workspace's own voices — onto the LibraryVoice shape below.

export type LibraryVoice = {
  voice_id: string;
  // Only library voices carry an owner; it is required to copy the voice into
  // the workspace before it can be used on a call.
  public_owner_id?: string;
  name: string;
  description?: string;
  category?: string;
  gender?: string;
  age?: string;
  accent?: string;
  language?: string;
  use_case?: string;
  descriptive?: string;
  preview_url?: string;
  image_url?: string;
  languages?: string[];
  cloned_by_count?: number;
  featured?: boolean;
  // owned voices are already in the workspace and usable as-is.
  owned: boolean;
  added?: boolean;
};

export type VoicePage = {
  voices: LibraryVoice[];
  has_more: boolean;
  total_count?: number;
  next_page?: number | null;
  next_page_token?: string | null;
};

export type LibraryVoiceQuery = {
  search?: string;
  category?: string;
  gender?: string;
  age?: string;
  accent?: string;
  language?: string;
  use_cases?: string[];
  sort?: string;
  page?: number;
  page_size?: number;
};

export type WorkspaceVoiceQuery = {
  search?: string;
  category?: string;
  page_size?: number;
  next_page_token?: string;
};

type Envelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

async function request<T>(
  path: string,
  init: RequestInit | undefined,
  getToken: AuthTokenGetter
): Promise<T> {
  let response: Response;
  try {
    response = await serverFetch(path, init, getToken);
  } catch {
    throw new ApiError("Could not reach the server. Is the backend running?", 0);
  }

  let envelope: Envelope<T> | null = null;
  try {
    envelope = (await response.json()) as Envelope<T>;
  } catch {
    // Non-JSON body; fall through to the status-based error below.
  }

  if (!response.ok || !envelope?.success) {
    const message = envelope?.message || `Request failed (${response.status})`;
    throw new ApiError(message, response.status);
  }

  return envelope.data;
}

function queryString(params: Record<string, string | number | string[] | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue;
    const encoded = Array.isArray(value) ? value.join(",") : String(value);
    if (encoded.trim() === "") continue;
    search.set(key, encoded);
  }
  const encoded = search.toString();
  return encoded ? `?${encoded}` : "";
}

// listLibraryVoices browses the public ElevenLabs voice library ("Explore").
// Results are paginated by zero-based page index.
export function listLibraryVoices(
  query: LibraryVoiceQuery,
  getToken: AuthTokenGetter
): Promise<VoicePage> {
  return request<VoicePage>(
    `/v1/voices/elevenlabs/library${queryString({ ...query })}`,
    undefined,
    getToken
  );
}

// listWorkspaceVoices lists the voices already saved in the ElevenLabs
// workspace ("My Voices"), which are usable on a call immediately.
export function listWorkspaceVoices(
  query: WorkspaceVoiceQuery,
  getToken: AuthTokenGetter
): Promise<VoicePage> {
  return request<VoicePage>(
    `/v1/voices/elevenlabs${queryString({ ...query })}`,
    undefined,
    getToken
  );
}

// addLibraryVoice copies a library voice into the workspace and returns the id
// to persist on the agent. Library ids are not usable for speech directly, so
// this runs before a library selection is saved.
export function addLibraryVoice(
  voice: { publicOwnerId: string; voiceId: string; name: string },
  getToken: AuthTokenGetter
): Promise<{ voice_id: string; name: string }> {
  const path = `/v1/voices/elevenlabs/library/${encodeURIComponent(voice.publicOwnerId)}/${encodeURIComponent(voice.voiceId)}`;
  return request<{ voice_id: string; name: string }>(
    path,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: voice.name }),
    },
    getToken
  );
}

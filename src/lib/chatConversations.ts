import { serverFetch, type AuthTokenGetter } from "./api";

// Wire types for the saved WhatsApp threads a chat agent answered. The runtime
// writes them as it replies, so this client only reads a thread, closes one, or
// deletes one — there is nothing here that creates a conversation.

export type ChatConversationStatus = "open" | "closed";
export type ChatMessageRole = "user" | "assistant";

// One saved thread, as ChatConversation in the OpenAPI document. messages is
// present only on the single-conversation response; the listing omits it.
export type ApiChatConversation = {
  id: string;
  phone_number_id: string | null;
  chat_agent_id: string | null;
  peer_jid: string;
  peer_phone: string | null;
  peer_name: string | null;
  status: ChatConversationStatus;
  // Off: the agent stays quiet for this contact and a person answers.
  ai_reply_enabled: boolean;
  // Red "Human needed": the agent called a person (human intervention) and
  // turned the AI off. Cleared by switching the AI back on. Absent from older
  // servers.
  needs_attention?: boolean;
  message_count: number;
  last_message_role: ChatMessageRole | null;
  last_message_at: string | null;
  created_at: string;
  updated_at: string;
  messages?: ApiChatMessage[];
};

export type ApiChatMessage = {
  seq: number;
  role: ChatMessageRole;
  content: string;
  created_at: string;
};

type Envelope<T> = {
  success: boolean;
  message: string;
  data: T;
  meta?: { pagination?: { total_items?: number; total_pages?: number; page?: number } };
};

// One server page of threads. total counts every thread the filter matches, not
// just this page, and totalPages is at least 1 so a pager always has a page.
export type ChatConversationPage = {
  items: ApiChatConversation[];
  total: number;
  page: number;
  totalPages: number;
};

export type ChatConversationListOptions = {
  status?: ChatConversationStatus;
  search?: string;
  page?: number;
  limit?: number;
};

function listParams(options: ChatConversationListOptions | undefined, defaultLimit: number) {
  const params = new URLSearchParams({ limit: String(options?.limit ?? defaultLimit) });
  if (options?.page && options.page > 1) params.set("page", String(options.page));
  if (options?.status) params.set("status", options.status);
  if (options?.search) params.set("search", options.search);
  return params;
}

function toPage(envelope: Envelope<ApiChatConversation[]>, requestedPage: number): ChatConversationPage {
  const items = envelope.data ?? [];
  const pagination = envelope.meta?.pagination;
  return {
    items,
    total: pagination?.total_items ?? items.length,
    page: pagination?.page ?? requestedPage,
    totalPages: Math.max(1, pagination?.total_pages ?? 1),
  };
}

export class ChatConversationError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ChatConversationError";
    this.status = status;
  }
}

const dashboardPath = "/v1/dashboard/chat-conversations";

async function request<T>(
  path: string,
  init: RequestInit | undefined,
  getToken: AuthTokenGetter
): Promise<Envelope<T>> {
  let response: Response;
  try {
    response = await serverFetch(path, init, getToken);
  } catch {
    throw new ChatConversationError("Could not connect. Check your internet and try again.", 0);
  }

  let envelope: Envelope<T> | null = null;
  try {
    envelope = (await response.json()) as Envelope<T>;
  } catch {
    // The status fallback below covers an unexpected non-JSON response.
  }
  if (!response.ok || !envelope?.success) {
    throw new ChatConversationError(envelope?.message || `Request failed (${response.status})`, response.status);
  }
  return envelope;
}

// listChatAgentConversations reads one page of one agent's threads, most
// recently active first. The total comes from the response meta rather than the
// page length, so a paged listing still reports how many threads the agent has.
export async function listChatAgentConversations(
  chatAgentId: string,
  getToken: AuthTokenGetter,
  options?: ChatConversationListOptions
): Promise<ChatConversationPage> {
  const params = listParams(options, 100);
  const envelope = await request<ApiChatConversation[]>(
    `/v1/dashboard/chat-agents/${encodeURIComponent(chatAgentId)}/conversations?${params.toString()}`,
    undefined,
    getToken
  );
  return toPage(envelope, options?.page ?? 1);
}

// listChatConversations reads one page of every thread on the account, most
// recently active first — the Conversations page, where threads from all of the
// user's chat agents share one inbox. Status and search filter on the server, so
// they reach threads on every page, not only the one loaded.
export async function listChatConversations(
  getToken: AuthTokenGetter,
  options?: ChatConversationListOptions & { chatAgentId?: string }
): Promise<ChatConversationPage> {
  const params = listParams(options, 200);
  if (options?.chatAgentId) params.set("chat_agent_id", options.chatAgentId);
  const envelope = await request<ApiChatConversation[]>(`${dashboardPath}?${params.toString()}`, undefined, getToken);
  return toPage(envelope, options?.page ?? 1);
}

// getChatConversationsVersion is a short text that changes whenever the listing
// with the same filter would, so a page on a timer can tell whether its list is
// out of date without downloading it again.
export async function getChatConversationsVersion(
  getToken: AuthTokenGetter,
  options?: { chatAgentId?: string }
): Promise<string> {
  const params = new URLSearchParams();
  if (options?.chatAgentId) params.set("chat_agent_id", options.chatAgentId);
  const query = params.toString();
  const envelope = await request<{ version: string }>(
    `${dashboardPath}/version${query ? `?${query}` : ""}`,
    undefined,
    getToken
  );
  return envelope.data.version;
}

// getChatConversation loads one thread with its transcript: the listing carries
// no messages, so opening a thread is a second request. With afterSeq, only the
// messages after that one come back, for a page that already has the rest.
export async function getChatConversation(
  id: string,
  getToken: AuthTokenGetter,
  options?: { afterSeq?: number }
): Promise<ApiChatConversation> {
  const query = options?.afterSeq === undefined ? "" : `?after_seq=${options.afterSeq}`;
  const envelope = await request<ApiChatConversation>(
    `${dashboardPath}/${encodeURIComponent(id)}${query}`,
    undefined,
    getToken
  );
  return envelope.data;
}

// setChatConversationStatus closes or reopens a thread. It is bookkeeping for
// the inbox and does not stop the agent answering — pausing the agent does that.
export async function setChatConversationStatus(
  id: string,
  status: ChatConversationStatus,
  getToken: AuthTokenGetter
): Promise<ApiChatConversation> {
  const envelope = await request<ApiChatConversation>(
    `${dashboardPath}/${encodeURIComponent(id)}`,
    { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) },
    getToken
  );
  return envelope.data;
}

// setChatConversationAiReply switches the agent on or off for this one contact.
// Their messages are still saved while it is off; nobody answers but a person.
export async function setChatConversationAiReply(
  id: string,
  enabled: boolean,
  getToken: AuthTokenGetter
): Promise<ApiChatConversation> {
  const envelope = await request<ApiChatConversation>(
    `${dashboardPath}/${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ai_reply_enabled: enabled }),
    },
    getToken
  );
  return envelope.data;
}

// sendChatConversationMessage writes on the thread as the agent: the message
// goes out on the number the thread runs on and comes back as the turn it was
// saved as, so the transcript can be extended without re-reading it.
export async function sendChatConversationMessage(
  id: string,
  content: string,
  getToken: AuthTokenGetter
): Promise<ApiChatMessage> {
  const envelope = await request<ApiChatMessage>(
    `${dashboardPath}/${encodeURIComponent(id)}/messages`,
    { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content }) },
    getToken
  );
  return envelope.data;
}

export async function deleteChatConversation(
  id: string,
  getToken: AuthTokenGetter
): Promise<{ id: string; deleted: boolean }> {
  const envelope = await request<{ id: string; deleted: boolean }>(
    `${dashboardPath}/${encodeURIComponent(id)}`,
    { method: "DELETE" },
    getToken
  );
  return envelope.data;
}

// conversationTitle is how a thread is labelled in the list: the contact's
// WhatsApp name when it is known, otherwise their number, and only then the raw
// JID — a "…@lid" peer carries no number to show.
export function conversationTitle(conversation: ApiChatConversation): string {
  const name = conversation.peer_name?.trim();
  if (name) return name;
  return conversationPhone(conversation);
}

export function conversationPhone(conversation: ApiChatConversation): string {
  const phone = conversation.peer_phone?.trim();
  if (phone) return phone;
  const [user, server] = (conversation.peer_jid ?? "").split("@");
  if (!user) return conversation.peer_jid || "Unknown contact";
  return server === "s.whatsapp.net" ? `+${user}` : user;
}

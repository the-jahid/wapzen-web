import { serverFetch, type AuthTokenGetter } from "./api";

// Wire types mirroring the Go server's KnowledgeBase model (see
// server/internal/models/knowledge_base.go). Create, List, Get, Update, Delete
// and Add Sources exist on the server; refreshing and removing a single source
// arrive with their endpoints.

// The indexing lifecycle, as the status column persists it (migration 00031).
export type KnowledgeBaseStatus =
  | "in_progress"
  | "complete"
  | "error"
  | "refreshing_in_progress";

export const knowledgeBaseStatusLabels: Record<KnowledgeBaseStatus, string> = {
  in_progress: "Indexing",
  complete: "Ready",
  error: "Failed",
  refreshing_in_progress: "Refreshing",
};

// Bounds the server enforces on a knowledge base itself, mirrored here so a form
// can reject a value before spending a round trip on it.
export const knowledgeBaseNameLimit = 40;

export const knowledgeBaseChunkBounds = {
  maxLower: 600,
  maxUpper: 6000,
  minLower: 200,
  minUpper: 2000,
};

// KnowledgeBaseSource is one indexed source as the server returns it. A source
// is either a raw text or an uploaded file — the url variant arrives with its
// scraper — and the two carry the same fields, because a file is text by the
// time it is stored: the server extracts it on upload. The stored content is
// deliberately not on the wire: it exists to be re-chunked, not read back, so
// chunk_count (how many vectors the source produced) is what a listing shows.
export type KnowledgeBaseSource = {
  type: "text" | "file";
  source_id: string;
  title: string;
  chunk_count: number;
};

export type ApiKnowledgeBase = {
  knowledge_base_id: string;
  knowledge_base_name: string;
  status: KnowledgeBaseStatus;
  // Vector-store namespace the chunks are written to, assigned when the
  // knowledge base is created. Optional on the wire: the server omits it for
  // rows that predate automatic assignment.
  namespace_id?: string | null;
  // Omitted rather than sent empty when the knowledge base has no sources.
  knowledge_base_sources?: KnowledgeBaseSource[] | null;
  enable_auto_refresh: boolean;
  // Milliseconds since epoch; absent until a refresh has run.
  last_refreshed_timestamp?: number | null;
  max_chunk_size: number;
  min_chunk_size: number;
};

// KnowledgeBase is one knowledge base as this app renders it: the wire shape
// with the optional fields resolved, so a view never has to re-decide what an
// absent sources list or namespace means.
export type KnowledgeBase = Omit<
  ApiKnowledgeBase,
  "namespace_id" | "knowledge_base_sources" | "last_refreshed_timestamp"
> & {
  namespace_id: string | null;
  knowledge_base_sources: KnowledgeBaseSource[];
  last_refreshed_timestamp: number | null;
};

// CreateKnowledgeBasePayload is the POST /v1/dashboard/knowledge-base body.
// knowledge_base_name is the only required field; omitted settings fall back to
// the server defaults (2000 / 400 / auto refresh off). Sources are accepted by
// the endpoint but not indexed yet, so they are deliberately not sent here.
export type CreateKnowledgeBasePayload = {
  knowledge_base_name: string;
  enable_auto_refresh?: boolean;
  max_chunk_size?: number;
  min_chunk_size?: number;
};

// UpdateKnowledgeBasePayload is the PATCH body: a partial update where every
// field is optional but at least one must be present. Omitted fields keep their
// stored value, and the server validates a chunk size against the stored
// counterpart, so sending only one of the pair is safe.
export type UpdateKnowledgeBasePayload = {
  knowledge_base_name?: string;
  enable_auto_refresh?: boolean;
  max_chunk_size?: number;
  min_chunk_size?: number;
};

export type FieldError = { field: string; message: string };

type Envelope<T> = {
  success: boolean;
  message: string;
  data: T;
  // Present on 400 responses that failed per-field validation.
  errors?: FieldError[];
};

export class KnowledgeBaseError extends Error {
  readonly status: number;
  // Per-field validation failures, so a form can point at the offending input
  // instead of only showing the summary message.
  readonly fieldErrors: FieldError[];

  constructor(message: string, status: number, fieldErrors: FieldError[] = []) {
    super(message);
    this.name = "KnowledgeBaseError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

async function request<T>(
  path: string,
  init: RequestInit | undefined,
  getToken: AuthTokenGetter
): Promise<T> {
  let response: Response;
  try {
    response = await serverFetch(path, init, getToken);
  } catch {
    throw new KnowledgeBaseError("Could not reach the server. Is the backend running?", 0);
  }

  let envelope: Envelope<T> | null = null;
  try {
    envelope = (await response.json()) as Envelope<T>;
  } catch {
    // Non-JSON body; fall through to the status-based error below.
  }

  if (!response.ok || !envelope?.success) {
    const message = envelope?.message || `Request failed (${response.status})`;
    throw new KnowledgeBaseError(message, response.status, envelope?.errors ?? []);
  }

  return envelope.data;
}

// ListKnowledgeBasesOptions pages the collection. The server defaults to page 1
// with 20 items and rejects a limit above 100.
export type ListKnowledgeBasesOptions = {
  page?: number;
  limit?: number;
};

// Dashboard knowledge base routes use the signed-in user's Clerk session, the
// same split the agents and calls routes use to keep /v1/knowledge-base
// API-key-only for external callers.

// listKnowledgeBases returns one page of the signed-in user's knowledge bases,
// newest first. The response also carries pagination meta and links; only the
// rows are surfaced, since the dashboard asks for a single large page.
export function listKnowledgeBases(
  getToken: AuthTokenGetter,
  options: ListKnowledgeBasesOptions = {}
): Promise<ApiKnowledgeBase[]> {
  const query = new URLSearchParams({
    page: String(options.page ?? 1),
    limit: String(options.limit ?? 100),
  });
  return request<ApiKnowledgeBase[]>(
    `/v1/dashboard/knowledge-base?${query.toString()}`,
    undefined,
    getToken
  );
}

export function getKnowledgeBase(
  knowledgeBaseId: string,
  getToken: AuthTokenGetter
): Promise<ApiKnowledgeBase> {
  return request<ApiKnowledgeBase>(
    `/v1/dashboard/knowledge-base/${encodeURIComponent(knowledgeBaseId)}`,
    undefined,
    getToken
  );
}

export function createKnowledgeBase(
  payload: CreateKnowledgeBasePayload,
  getToken: AuthTokenGetter
): Promise<ApiKnowledgeBase> {
  return request<ApiKnowledgeBase>(
    "/v1/dashboard/knowledge-base",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
    getToken
  );
}

// deleteKnowledgeBase removes one knowledge base. The server answers with
// {id, deleted}; only the id is surfaced, since a non-deleting success is not a
// state the endpoint can return. A 404 means it was already gone.
export async function deleteKnowledgeBase(
  knowledgeBaseId: string,
  getToken: AuthTokenGetter
): Promise<string> {
  const data = await request<{ id: string; deleted: boolean }>(
    `/v1/dashboard/knowledge-base/${encodeURIComponent(knowledgeBaseId)}`,
    { method: "DELETE" },
    getToken
  );
  return data.id;
}

export function updateKnowledgeBase(
  knowledgeBaseId: string,
  payload: UpdateKnowledgeBasePayload,
  getToken: AuthTokenGetter
): Promise<ApiKnowledgeBase> {
  return request<ApiKnowledgeBase>(
    `/v1/dashboard/knowledge-base/${encodeURIComponent(knowledgeBaseId)}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
    getToken
  );
}

// NewKnowledgeBaseText is one raw text to index. The title is used verbatim as
// the vector-store record id, which is why it is bounded and restricted below
// rather than being a free-form label.
export type NewKnowledgeBaseText = {
  title: string;
  text: string;
};

// Bounds the add-sources endpoint enforces (see
// server/internal/models/knowledge_base.go). Checking them here turns a
// rejected request into inline form feedback instead of a round trip.
export const knowledgeBaseSourceBounds = {
  titleLength: 200,
  textsPerRequest: 25,
  filesPerRequest: 10,
  fileBytes: 10 * 1024 * 1024,
};

// The formats the server can extract text from (see
// server/internal/knowledgebases/extract.go). This list is what the file picker
// filters on and what an unsupported file is reported against; the server checks
// it again, since the extension a client accepts is not what decides anything.
export const knowledgeBaseFileExtensions = [
  ".csv",
  ".docx",
  ".htm",
  ".html",
  ".json",
  ".log",
  ".md",
  ".markdown",
  ".pdf",
  ".rst",
  ".text",
  ".tsv",
  ".txt",
  ".xml",
  ".yaml",
  ".yml",
] as const;

// sourceTitleFromFilename derives the title a file will be stored under, the
// same way the server derives it when a request supplies none (see
// sourceTitleFromFilename in server/internal/handlers/knowledge_base_sources.go).
// Prefilling it here rather than sending nothing is what makes an unusable
// filename — one with characters a vector-store record id cannot carry — visible
// and editable before the upload instead of after it.
//
// The extension is kept: it says what the source is, and it keeps an uploaded
// document from colliding with a pasted text of the same name.
export function sourceTitleFromFilename(filename: string): string {
  const name = filename.trim().split(/[\\/]/).pop() ?? "";
  return name
    .replace(/[^\x20-\x7e]|#/g, "-")
    .replace(/\s+/g, " ")
    .replace(/-{2,}/g, "-")
    .replace(/^[-\s]+|[-\s]+$/g, "")
    .slice(0, knowledgeBaseSourceBounds.titleLength);
}

// describeUnreadableFile returns why a file cannot be uploaded, or "" when it is
// fine. Only what is knowable without opening it is checked: the extension and
// the size. Whether the bytes hold any text is the server's answer to give — it
// is the one that reads them.
export function describeUnreadableFile(file: File): string {
  const dot = file.name.lastIndexOf(".");
  const extension = dot > 0 ? file.name.slice(dot).toLowerCase() : "";

  if (!(knowledgeBaseFileExtensions as readonly string[]).includes(extension)) {
    return `${extension || "This file type"} cannot be read. Supported: ${knowledgeBaseFileExtensions.join(", ")}.`;
  }
  if (file.size > knowledgeBaseSourceBounds.fileBytes) {
    return `Larger than the ${Math.round(knowledgeBaseSourceBounds.fileBytes / (1024 * 1024))} MB limit.`;
  }
  if (file.size === 0) {
    return "The file is empty.";
  }
  return "";
}

// The chunk id separator: a title containing it could collide with the id of
// another source's second chunk, so the server rejects it.
const chunkIdSeparator = "#";

// describeInvalidSourceTitle returns why a title cannot be used, or "" when it
// is fine. Uniqueness is not checked here — that is per knowledge base, so the
// caller compares against the sources it already has.
export function describeInvalidSourceTitle(title: string): string {
  const trimmed = title.trim();
  if (!trimmed) return "Title is required.";
  if (trimmed.length > knowledgeBaseSourceBounds.titleLength) {
    return `Title must be at most ${knowledgeBaseSourceBounds.titleLength} characters.`;
  }
  if (trimmed.includes(chunkIdSeparator)) {
    return `Title cannot contain “${chunkIdSeparator}” — it separates a title from its chunk number in the vector store.`;
  }
  // The vector store rejects non-ASCII record ids outright, so the server
  // requires printable ASCII rather than letting the write fail.
  if (!/^[\x20-\x7e]+$/.test(trimmed)) {
    return "Title must use printable ASCII characters only.";
  }
  return "";
}

// deleteKnowledgeBaseSource removes one source and every vector it wrote into
// the knowledge base's namespace. The knowledge base itself, its other sources
// and its chunking are untouched, so the caller can drop the row locally rather
// than reloading. The server removes the vectors first, so a failure here means
// the source is still fully indexed and the same call can be retried.
export async function deleteKnowledgeBaseSource(
  knowledgeBaseId: string,
  sourceId: string,
  getToken: AuthTokenGetter
): Promise<string> {
  const data = await request<{ id: string; knowledge_base_id: string; deleted: boolean }>(
    `/v1/dashboard/knowledge-base/${encodeURIComponent(knowledgeBaseId)}/sources/${encodeURIComponent(sourceId)}`,
    { method: "DELETE" },
    getToken
  );
  return data.id;
}

// addKnowledgeBaseSources indexes raw texts into an existing knowledge base.
// The server chunks, embeds and upserts them inside the request, so this
// resolves with the knowledge base already at status complete and carrying every
// source — there is nothing to poll. It is all-or-nothing: a failure leaves the
// knowledge base exactly as it was, so the caller can retry the same body.
export function addKnowledgeBaseSources(
  knowledgeBaseId: string,
  texts: NewKnowledgeBaseText[],
  getToken: AuthTokenGetter
): Promise<ApiKnowledgeBase> {
  return request<ApiKnowledgeBase>(
    `/v1/dashboard/knowledge-base/${encodeURIComponent(knowledgeBaseId)}/sources`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        knowledge_base_texts: texts.map((entry) => ({
          title: entry.title.trim(),
          text: entry.text.trim(),
        })),
      }),
    },
    getToken
  );
}

// NewKnowledgeBaseFile is one document to upload. Only the file itself and the
// name to store it under are sent — the file is not read here.
export type NewKnowledgeBaseFile = {
  file: File;
  title: string;
};

// addKnowledgeBaseFileSources uploads documents to the same endpoint the texts
// go to, as multipart/form-data.
//
// The browser does not open the files: it hands over the bytes, and the server
// extracts the text, chunks it and indexes it. That is deliberate — the indexed
// content is then what the server read out of the document, not what a client
// managed to parse, and a format the browser cannot handle (a PDF, a .docx) is
// no different here from a plain text file.
//
// Content-Type is left unset on purpose: fetch derives it from the FormData,
// including the multipart boundary, which cannot be written by hand.
export function addKnowledgeBaseFileSources(
  knowledgeBaseId: string,
  files: NewKnowledgeBaseFile[],
  getToken: AuthTokenGetter
): Promise<ApiKnowledgeBase> {
  const form = new FormData();
  // The nth title belongs to the nth file, so both are appended in order.
  for (const entry of files) {
    form.append("titles", entry.title.trim());
  }
  for (const entry of files) {
    form.append("files", entry.file, entry.file.name);
  }

  return request<ApiKnowledgeBase>(
    `/v1/dashboard/knowledge-base/${encodeURIComponent(knowledgeBaseId)}/sources`,
    { method: "POST", body: form },
    getToken
  );
}

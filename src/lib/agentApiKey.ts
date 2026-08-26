const storageKey = "voca.agentApiKey";
const keyPrefix = "wcai_";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function isAgentApiKey(value: string | null | undefined): value is string {
  return typeof value === "string" && value.trim().startsWith(keyPrefix);
}

export function getStoredAgentApiKey(): string {
  if (!canUseStorage()) return "";
  return window.localStorage.getItem(storageKey) ?? "";
}

export function setStoredAgentApiKey(value: string) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(storageKey, value.trim());
}

export function clearStoredAgentApiKey() {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(storageKey);
}

export function maskAgentApiKey(value: string) {
  const key = value.trim();
  if (key.length <= 16) return key;
  return `${key.slice(0, 12)}...${key.slice(-4)}`;
}

// The API answers every request from a blocked account with a 403 carrying
// X-Account-Blocked (and, when the account's number tells it, the language to
// show the notice in). serverFetch reports that here, and AccountBlockedScreen
// subscribes to it, so whichever request comes back first puts the notice up.

export type AccountBlockedState = { blocked: boolean; lang: string | null };

let state: AccountBlockedState = { blocked: false, lang: null };
const listeners = new Set<() => void>();

export function noteAccountBlocked(response: Response) {
  if (state.blocked || response.headers.get("X-Account-Blocked") !== "true") return;
  state = { blocked: true, lang: response.headers.get("X-Account-Blocked-Lang") };
  listeners.forEach((listener) => listener());
}

export function subscribeAccountBlocked(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getAccountBlocked(): AccountBlockedState {
  return state;
}

const notBlocked: AccountBlockedState = { blocked: false, lang: null };

export function getAccountBlockedOnServer(): AccountBlockedState {
  return notBlocked;
}

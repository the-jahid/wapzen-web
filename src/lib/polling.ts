// A request stuck for this long is given up on, so one that never comes back
// can't hide a login that has finished. It is left to end by itself.
const STUCK_AFTER_MS = 15_000;

// Runs poll now and then every intervalMs, skipping a turn while the last one is
// still going. A fixed timer on a weak connection piles up a request every turn;
// they all carry the token of the moment they were sent, and reach the server
// together after it has expired. Returns the function that stops polling.
export function startPolling(poll: () => Promise<void>, intervalMs: number): () => void {
  let runningSince: number | null = null;

  const run = () => {
    const now = Date.now();
    if (runningSince !== null && now - runningSince < STUCK_AFTER_MS) return;
    runningSince = now;
    void poll().finally(() => {
      if (runningSince === now) runningSince = null;
    });
  };

  const interval = window.setInterval(run, intervalMs);
  run();
  return () => window.clearInterval(interval);
}

// With no click, key press, touch or mouse movement for this long, nobody is
// actively using the page.
const IDLE_AFTER_MS = 5 * 60_000;
// A page nobody is using refreshes on one turn in this many.
const IDLE_REFRESH_EVERY = 4;
const ACTIVITY_EVENTS = ["pointermove", "pointerdown", "keydown", "wheel", "touchstart"];

// Calls refresh every intervalMs to keep a page up to date, without spending
// bandwidth on nobody. A tab in the background doesn't refresh at all and catches
// up the moment it is shown again, and an open page nobody is using refreshes a
// quarter as often. Returns the function that stops it.
export function startRefreshing(refresh: () => void, intervalMs: number): () => void {
  let lastActivity = Date.now();
  let turn = 0;
  let missedOne = false;

  const noteActivity = () => {
    lastActivity = Date.now();
  };

  const tick = () => {
    if (document.hidden) {
      missedOne = true;
      return;
    }
    turn += 1;
    const idle = Date.now() - lastActivity > IDLE_AFTER_MS;
    if (idle && turn % IDLE_REFRESH_EVERY !== 0) return;
    refresh();
  };

  const onVisibilityChange = () => {
    if (document.hidden) return;
    noteActivity();
    if (!missedOne) return;
    missedOne = false;
    refresh();
  };

  const interval = window.setInterval(tick, intervalMs);
  document.addEventListener("visibilitychange", onVisibilityChange);
  ACTIVITY_EVENTS.forEach((name) => window.addEventListener(name, noteActivity, { passive: true }));

  return () => {
    window.clearInterval(interval);
    document.removeEventListener("visibilitychange", onVisibilityChange);
    ACTIVITY_EVENTS.forEach((name) => window.removeEventListener(name, noteActivity));
  };
}

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

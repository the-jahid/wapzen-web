// Loading placeholders shared by the dashboard's list panes, detail panes and
// chat transcripts: grey pulsing blocks shaped like the content on its way,
// in place of a "Loading…" line. They carry their own CSS so any page can use
// them without touching its stylesheet.

const skeletonCSS = `
.sk-block{animation:sk-pulse 1.4s ease-in-out infinite;background:var(--app-hover-2,rgba(255,255,255,.08));border-radius:6px;display:block;height:12px}
.sk-sm{height:9px}
.sk-circle{border-radius:50%;flex:0 0 auto;height:32px;width:32px}
.sk-icon{border-radius:6px;flex:0 0 auto;height:16px;width:16px}
.sk-rows{display:flex;flex-direction:column;gap:2px}
.sk-row{align-items:center;display:flex;gap:10px;min-height:52px;padding:6px 10px}
.sk-row.is-compact{min-height:38px}
.sk-row-body{display:grid;flex:1;gap:7px;min-width:0}
.sk-detail{display:flex;flex-direction:column;gap:12px;padding:24px}
.sk-card{border:1px solid var(--app-border,rgba(255,255,255,.08));border-radius:14px;display:flex;flex-direction:column;gap:12px;margin-top:12px;padding:20px}
.sk-messages{display:flex;flex-direction:column;gap:14px;padding:16px 4px}
.sk-bubble{border-radius:14px;height:36px}
.sk-bubble.is-in{align-self:flex-start}
.sk-bubble.is-out{align-self:flex-end}
@keyframes sk-pulse{0%,100%{opacity:1}50%{opacity:.45}}
@media(prefers-reduced-motion:reduce){.sk-block{animation:none}}
`;

function SkeletonStyle() {
  return <style dangerouslySetInnerHTML={{ __html: skeletonCSS }} />;
}

// Varied widths so the rows read as names and numbers, not a striped bar.
const nameWidths = ["58%", "44%", "66%", "38%", "52%", "47%", "61%", "41%"];
const subWidths = ["36%", "48%", "30%", "42%", "34%", "45%", "28%", "39%"];

/** Placeholder rows for a list pane (contacts, tools, numbers, documents). */
export function PaneListSkeleton({
  rows = 6,
  variant = "avatar",
}: {
  rows?: number;
  /** avatar: round picture + two lines. icon: small icon + one line. */
  variant?: "avatar" | "icon";
}) {
  return (
    <div aria-busy="true" aria-label="Loading" className="sk-rows" role="status">
      <SkeletonStyle />
      {Array.from({ length: rows }, (_, index) => (
        <div className={`sk-row${variant === "icon" ? " is-compact" : ""}`} key={index}>
          <span className={`sk-block ${variant === "icon" ? "sk-icon" : "sk-circle"}`} />
          <span className="sk-row-body">
            <span className="sk-block" style={{ width: nameWidths[index % nameWidths.length] }} />
            {variant === "avatar" ? (
              <span className="sk-block sk-sm" style={{ width: subWidths[index % subWidths.length] }} />
            ) : null}
          </span>
        </div>
      ))}
    </div>
  );
}

/** Placeholder for a detail pane: a title, a subtitle line and a card. */
export function DetailSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading" className="sk-detail" role="status">
      <SkeletonStyle />
      <span className="sk-block" style={{ height: 20, width: 180 }} />
      <span className="sk-block sk-sm" style={{ width: 240 }} />
      <div className="sk-card">
        <span className="sk-block" style={{ width: 120 }} />
        <span className="sk-block sk-sm" style={{ width: "70%" }} />
        <span className="sk-block sk-sm" style={{ width: "85%" }} />
        <span className="sk-block" style={{ borderRadius: 8, height: 32, marginTop: 6, width: 128 }} />
      </div>
      <div className="sk-card">
        <span className="sk-block" style={{ width: 150 }} />
        <span className="sk-block sk-sm" style={{ width: "60%" }} />
        <span className="sk-block sk-sm" style={{ width: "75%" }} />
      </div>
    </div>
  );
}

/** Placeholder chat bubbles for a transcript that is still loading. */
export function MessagesSkeleton() {
  const bubbles: Array<["in" | "out", string]> = [
    ["in", "34%"],
    ["out", "52%"],
    ["in", "46%"],
    ["out", "38%"],
    ["in", "28%"],
    ["out", "56%"],
  ];
  return (
    <div aria-busy="true" aria-label="Loading messages" className="sk-messages" role="status">
      <SkeletonStyle />
      {bubbles.map(([side, width], index) => (
        <span className={`sk-block sk-bubble is-${side}`} key={index} style={{ width }} />
      ))}
    </div>
  );
}

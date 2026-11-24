// The voice agents page wears the chat agents page's look: this is that page's
// stylesheet with its chat- prefix swapped for va-, plus the voice-only parts
// at the end. Keep the 1180px blocks in step with DESKTOP_QUERY in
// VoiceAgentsPage.tsx.
export const baseCss = `
.va-shell {
  --bg: var(--app-bg);
  --sidebar: var(--app-sidebar);
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
  --primary-2: var(--app-primary-2);
  --primary-soft: var(--app-primary-soft);
  --primary-light: var(--app-primary-light);
  --green: var(--app-green);
  --amber: var(--app-amber);
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
.va-shell * { box-sizing: border-box; }
.va-shell button, .va-shell input, .va-shell select, .va-shell textarea { font: inherit; }
.va-shell ::-webkit-scrollbar { height: 9px; width: 9px; }
.va-shell ::-webkit-scrollbar-thumb { background: var(--app-border-strong); border-radius: 9px; }
.va-shell ::-webkit-scrollbar-track { background: transparent; }
.va-main { display: flex; flex: 1; flex-direction: column; min-width: 0; height: 100vh; overflow: hidden; }
.va-content { padding: 20px 32px; flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column; }
.va-workspace {
  display: grid;
  gap: 16px;
  grid-template-columns: minmax(0, 1fr);
  flex: 1 1 auto;
  min-height: 0;
}
.va-workspace > * { min-height: 0; max-height: 100%; }
.va-agent-browser { margin: 0 auto; max-width: 1320px; width: 100%; }
.va-agent-page {
  background: var(--bg);
  border: 1px solid var(--border-strong);
  border-radius: 20px;
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  margin: 0 auto;
  max-width: 1320px;
  min-height: 0;
  overflow: hidden;
  width: 100%;
}
.va-agent-page-empty {
  align-items: center;
  color: var(--muted);
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: 14px;
  justify-content: center;
  padding: 48px 16px;
  text-align: center;
}
.va-agent-expanded-topline {
  align-items: center;
  border-bottom: 1px solid var(--border);
  display: flex;
  flex: 0 0 auto;
  gap: 14px;
  padding: 14px 16px;
}
.va-agent-expanded-topline > .va-detail-head { flex: 1 1 auto; min-width: 0; }
.va-agent-back {
  flex: 0 0 auto;
  align-items: center;
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 999px;
  color: var(--subtle);
  cursor: pointer;
  display: inline-flex;
  height: 32px;
  justify-content: center;
  width: 32px;
}
.va-agent-back:hover { background: var(--panel-hover); color: var(--text); }
.va-agent-expanded-grid {
  display: grid;
  flex: 1 1 auto;
  gap: 16px;
  grid-template-columns: minmax(0, 1fr);
  min-height: 0;
  overflow: hidden;
  padding: 16px;
}
.va-panel {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: 0 1px 2px var(--app-shadow-soft);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.va-panel-head { align-items: center; border-bottom: 1px solid var(--border); display: flex; gap: 10px; justify-content: space-between; padding: 14px 16px; flex: 0 0 auto; }
.va-panel-title { align-items: center; display: flex; font-size: 13px; font-weight: 850; gap: 8px; letter-spacing: -.1px; margin: 0; }
.va-panel-title .va-panel-ic { color: var(--primary-light); display: inline-flex; }
.va-panel-copy { color: var(--subtle); font-size: 11.5px; }
.va-panel-body { flex: 1 1 auto; min-height: 0; overflow-y: auto; padding: 14px 16px; }
.va-search { margin-bottom: 10px; position: relative; }
.va-search-icon { color: var(--subtle); left: 11px; position: absolute; top: 50%; transform: translateY(-50%); }
.va-input, .va-select {
  background: var(--panel);
  border: 1px solid var(--app-border);
  border-radius: 11px;
  color: var(--text);
  height: 40px;
  outline: none;
  padding: 0 12px;
  transition: border-color .18s ease, box-shadow .18s ease, background .18s ease;
  width: 100%;
}
.va-input::placeholder, .va-textarea::placeholder { color: var(--faint); }
.va-input:focus, .va-select:focus, .va-textarea:focus { background: var(--app-input-focus); border-color: var(--app-primary-ring-strong); box-shadow: 0 0 0 4px var(--app-primary-ring); }
.va-input:disabled, .va-select:disabled, .va-textarea:disabled { color: var(--subtle); cursor: not-allowed; opacity: .55; }
.va-search .va-input { padding-left: 36px; }
.va-select {
  appearance: none;
  background-image: linear-gradient(45deg, transparent 50%, var(--app-muted) 50%), linear-gradient(135deg, var(--app-muted) 50%, transparent 50%);
  background-position: calc(100% - 17px) 50%, calc(100% - 12px) 50%;
  background-repeat: no-repeat;
  background-size: 5px 5px, 5px 5px;
  padding: 0 34px 0 12px;
}
.va-select option { background: var(--surface); color: var(--text); }
.va-textarea {
  background: var(--panel);
  border: 1px solid var(--app-border);
  border-radius: 11px;
  color: var(--text);
  line-height: 1.55;
  min-height: 96px;
  outline: none;
  padding: 11px 12px;
  resize: vertical;
  transition: border-color .18s ease, box-shadow .18s ease, background .18s ease;
  width: 100%;
}
.va-list { display: grid; gap: 12px; grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr)); }
.va-list-row {
  align-items: center;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  color: var(--text);
  cursor: pointer;
  display: grid;
  align-content: start;
  gap: 12px;
  grid-template-areas: "avatar identity status" "resources resources chevron";
  grid-template-columns: 36px minmax(0, 1fr) auto;
  padding: 16px;
  position: relative;
  text-align: left;
  transition: background .18s ease, border-color .18s ease, box-shadow .18s ease;
  width: 100%;
}
.va-list-row:hover { background: var(--panel-hover); border-color: var(--app-primary-ring); box-shadow: 0 6px 18px var(--app-shadow-soft); }
.va-list-row:has(.va-list-link:focus-visible) { border-color: var(--app-primary-ring-strong); box-shadow: 0 0 0 4px var(--app-primary-ring); }
.va-list-row.is-active { background: var(--primary-soft); border-color: var(--app-primary-border); }
/* The name's link stretches over the whole card, because the card also holds a
   delete button and a button can't sit inside a link. */
.va-list-link { color: inherit; text-decoration: none; }
.va-list-link:focus-visible { outline: none; }
.va-list-link::after { border-radius: 14px; content: ""; inset: 0; position: absolute; }
.va-list-row-end { align-items: center; display: inline-flex; gap: 6px; grid-area: chevron; justify-self: end; }
.va-list-delete { position: relative; z-index: 1; }
.va-icon-btn.va-list-delete:hover { background: var(--app-rose-soft); border-color: var(--app-rose-border); color: var(--app-rose-text); }
.va-list-row > .va-avatar { grid-area: avatar; }
.va-list-row > .va-pill { grid-area: status; }
/* Loading placeholders: the real row grid with pulsing blocks in place of each
   field, so the list does not jump when the agents arrive. */
.va-list-skeleton { cursor: default; }
.va-list-skeleton:hover { background: var(--surface); border-color: var(--border); box-shadow: none; }
.va-list-skeleton > .va-skel-avatar { grid-area: avatar; }
.va-list-skeleton > .va-skel-pill { grid-area: status; }
.va-skel {
  animation: va-skel-pulse 1.4s ease-in-out infinite;
  background: var(--panel-hover);
  border-radius: 6px;
  display: block;
  height: 12px;
  max-width: 100%;
}
.va-skel-sm { height: 9px; }
.va-skel-avatar { border-radius: 10px; height: 32px; width: 32px; }
.va-skel-pill { border-radius: 999px; height: 20px; width: 64px; }
@keyframes va-skel-pulse { 0%, 100% { opacity: 1; } 50% { opacity: .45; } }
@media (prefers-reduced-motion: reduce) { .va-skel { animation: none; } }
.va-avatar {
  align-items: center;
  border-radius: 10px;
  color: #fff;
  display: flex;
  font-size: 12.5px;
  font-weight: 800;
  height: 32px;
  justify-content: center;
  width: 32px;
}
.va-list-identity { display: grid; gap: 3px; grid-area: identity; min-width: 0; }
.va-list-name { font-size: 13.5px; font-weight: 800; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.va-list-phone { color: var(--subtle); font-size: 11.5px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.va-list-resources { align-items: center; border-top: 1px solid var(--border); color: var(--subtle); display: flex; flex-wrap: wrap; font-size: 11px; gap: 9px; grid-area: resources; padding-top: 12px; }
.va-list-resources > span { align-items: center; display: inline-flex; gap: 4px; white-space: nowrap; }
.va-list-chevron { color: var(--faint); display: inline-flex; grid-area: chevron; justify-self: end; transition: color .18s ease, transform .18s ease; }
.va-list-row:hover .va-list-chevron { color: var(--primary-light); transform: translateX(2px); }
.va-empty-list { color: var(--subtle); font-size: 12.5px; padding: 18px 4px; text-align: center; }
.va-panel-body-empty { display: flex; flex-direction: column; }
.va-empty-start { align-items: center; display: flex; flex: 1 0 auto; flex-direction: column; gap: 14px; justify-content: center; min-height: 280px; }
.va-pill {
  align-items: center;
  border-radius: 20px;
  display: inline-flex;
  font-size: 10.5px;
  font-weight: 800;
  gap: 5px;
  letter-spacing: .2px;
  line-height: 1;
  padding: 4px 8px;
  text-transform: uppercase;
}
.va-pill.is-active { background: var(--app-green-soft); color: var(--green); }
.va-pill.is-inactive { background: var(--app-border); color: var(--subtle); }
.va-pill-timer { color: var(--app-amber-text); font-variant-numeric: tabular-nums; }
.va-dot { background: currentColor; border-radius: 50%; height: 5px; width: 5px; }
.va-btn {
  align-items: center;
  border: 1px solid var(--app-border-strong);
  border-radius: 11px;
  cursor: pointer;
  display: inline-flex;
  font-weight: 800;
  gap: 8px;
  justify-content: center;
  min-height: 38px;
  padding: 0 13px;
  transition: background .18s ease, filter .18s ease;
  white-space: nowrap;
}
.va-btn-primary { background: linear-gradient(140deg,var(--primary-2),var(--primary)); border-color: transparent; box-shadow: 0 4px 14px var(--app-primary-glow); color: var(--app-on-accent); }
.va-btn-primary:hover { filter: brightness(1.08); }
.va-btn-secondary { background: var(--panel-hover); color: var(--text); }
.va-btn-secondary:hover { background: var(--app-panel-hover); }
.va-btn-danger { background: var(--app-rose-soft); border-color: var(--app-rose-border); color: var(--app-rose-text); }
.va-btn:disabled { cursor: not-allowed; filter: grayscale(.35); opacity: .45; }

/* Delete confirmation, above the expanded agent card. */
.va-confirm-overlay { align-items: center; animation: va-confirm-fade .16s ease; backdrop-filter: blur(3px); background: var(--app-overlay); display: flex; inset: 0; justify-content: center; padding: 24px; position: fixed; z-index: 120; }
.va-confirm { animation: va-confirm-in .18s ease; background: var(--app-surface); border: 1px solid var(--app-line); border-radius: 18px; box-shadow: 0 30px 80px var(--app-shadow-color-strong); max-width: 420px; padding: 22px; width: 100%; }
.va-confirm-icon { align-items: center; background: var(--app-rose-soft); border: 1px solid var(--app-rose-border); border-radius: 12px; color: var(--app-rose); display: inline-flex; height: 42px; justify-content: center; margin-bottom: 14px; width: 42px; }
.va-confirm-title { color: var(--app-text-strong); font-size: 17px; font-weight: 850; letter-spacing: -.2px; margin: 0; }
.va-confirm-copy { color: var(--app-muted); font-size: 13px; line-height: 1.55; margin: 8px 0 0; }
.va-confirm-copy strong { color: var(--app-text-strong); font-weight: 800; }
.va-confirm-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px; }
.va-confirm-danger { background: var(--app-rose); border-color: transparent; color: #fff; }
.va-confirm-danger:hover { filter: brightness(1.08); }
.va-upgrade-icon { background: rgba(37, 211, 102, .12); border-color: rgba(37, 211, 102, .35); color: #25d366; }
.va-upgrade-whatsapp { background: #25d366; border-color: transparent; color: #fff; gap: 8px; text-decoration: none; }
.va-upgrade-whatsapp:hover { filter: brightness(1.06); }
@keyframes va-confirm-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes va-confirm-in { from { opacity: 0; transform: translateY(8px) scale(.98); } to { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce) { .va-confirm-overlay, .va-confirm { animation: none; } }
@media (max-width: 760px) {
  .va-confirm-overlay { align-items: center; padding: 16px; }
  .va-confirm { border-radius: 18px; max-width: none; padding: 20px 18px; }
  .va-confirm-actions { flex-direction: column-reverse; }
  .va-confirm-actions .va-btn { width: 100%; }
}
/* Why a live agent is not answering, as the running server reports it. */
.va-runtime-alert { align-items: flex-start; background: var(--app-amber-soft); border-color: var(--app-amber-border); display: flex; gap: 12px; padding: 12px 14px; }
.va-runtime-alert-icon { align-items: center; background: var(--app-amber); border-radius: 999px; color: #fff; display: inline-flex; flex: none; font-size: 12px; font-weight: 900; height: 20px; justify-content: center; margin-top: 1px; width: 20px; }
.va-runtime-alert-title { color: var(--app-amber-text); font-size: 13px; font-weight: 800; margin: 0; }
.va-runtime-alert-time { color: var(--subtle); font-weight: 600; }
.va-runtime-alert-copy { color: var(--text); font-size: 12.5px; line-height: 1.5; margin: 4px 0 0; overflow-wrap: anywhere; }
/* An agent that has sent its replies for the hour, counting down to when it answers again. */
.va-limit-list { display: grid; gap: 10px; margin: 0 auto 16px; max-width: 1320px; width: 100%; }
.va-limit-card { align-items: center; flex-wrap: wrap; justify-content: space-between; }
.va-limit-card-text { flex: 1 1 240px; min-width: 0; }
.va-limit-timer { color: var(--app-amber-text); flex: none; text-align: right; }
.va-limit-timer-value { display: block; font-size: 24px; font-variant-numeric: tabular-nums; font-weight: 800; letter-spacing: -.01em; line-height: 1.1; }
.va-limit-timer-label { color: var(--subtle); display: block; font-size: 11.5px; font-weight: 600; margin-top: 2px; }
@media (max-width: 420px) { .va-limit-timer { text-align: left; } }
.va-btn-sm { font-size: 12px; min-height: 32px; padding: 0 10px; }
.va-section { border-top: 1px solid var(--border); padding-top: 14px; margin-top: 14px; }
.va-section:first-child { border-top: 0; margin-top: 0; padding-top: 0; }
.va-section-title { color: var(--faint); font-size: 10.5px; font-weight: 800; letter-spacing: .8px; margin: 0 0 10px; text-transform: uppercase; }
.va-fields { display: grid; gap: 12px; }
.va-fields-2 { display: grid; gap: 12px; grid-template-columns: repeat(2, minmax(0, 1fr)); }
.va-field { display: grid; gap: 6px; min-width: 0; }
.va-field-label { color: var(--subtle); font-size: 11.5px; font-weight: 700; }
.va-field-hint { color: var(--faint); font-size: 11.5px; line-height: 1.45; }
.va-alert-row { align-items: center; display: flex; gap: 8px; min-width: 0; }
.va-alert-row .va-input { flex: 1; min-width: 0; }
.va-alert-saved { align-items: center; display: flex; font-variant-numeric: tabular-nums; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.va-range-head { align-items: center; display: flex; justify-content: space-between; }
.va-range-value { color: var(--text); font-size: 12px; font-weight: 700; }
.va-range { accent-color: var(--primary); width: 100%; }
.va-chips { display: flex; flex-wrap: wrap; gap: 7px; }
.va-chip {
  align-items: center;
  background: var(--panel);
  border: 1px solid var(--app-border);
  border-radius: 20px;
  color: var(--text);
  cursor: pointer;
  display: inline-flex;
  font-size: 12px;
  font-weight: 650;
  gap: 6px;
  max-width: 100%;
  padding: 6px 11px;
  transition: background .18s ease, border-color .18s ease, color .18s ease;
}
.va-chip:hover { border-color: var(--app-border-strong); }
.va-chip.is-on { background: var(--primary-soft); border-color: var(--app-primary-border); color: var(--app-primary-text); }
.va-chip span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.va-chips-empty { color: var(--faint); font-size: 11.5px; }
.va-kb-add { align-items: flex-start; display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; }
.va-kb-add-error { color: var(--app-rose-text); font-size: 11.5px; line-height: 1.45; }
.va-default-badge { background: var(--app-hover-2); border: 1px solid var(--app-border-strong); border-radius: 999px; color: var(--subtle); font-size: 10px; font-weight: 800; line-height: 1; padding: 3px 6px; }
.va-orders-on { background: var(--app-green-soft); border: 1px solid var(--app-green-border); border-radius: 999px; color: var(--green); font-weight: 800; line-height: 1; padding: 3px 7px; }
.va-order-settings { display: grid; gap: 12px; margin-top: 12px; }
.va-order-toggle { align-items: center; background: none; border: 0; color: var(--text); cursor: pointer; display: flex; font-size: 12.5px; font-weight: 750; gap: 10px; padding: 0; text-align: left; }
.va-order-track { background: var(--app-hover-3); border: 1px solid var(--app-border-strong); border-radius: 999px; flex-shrink: 0; height: 24px; padding: 2px; transition: background .18s ease, border-color .18s ease; width: 44px; }
.va-order-knob { background: var(--app-invert-bg); border-radius: 50%; display: block; height: 18px; transition: transform .18s ease, background .18s ease; width: 18px; }
.va-order-toggle.is-on .va-order-track { background: var(--primary); border-color: transparent; }
.va-order-toggle.is-on .va-order-knob { background: var(--app-on-accent); transform: translateX(20px); }
.va-media-settings { display: grid; gap: 16px 24px; grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr)); }
.va-media-option { align-content: start; display: grid; gap: 6px; }
.va-media-option .va-field-hint { padding-left: 54px; }
.va-files { display: grid; gap: 12px; }
.va-website { display: grid; gap: 14px; max-width: 640px; }
.va-file-list { display: grid; gap: 8px; list-style: none; margin: 0; padding: 0; }
.va-file { align-items: start; background: var(--panel-hover); border: 1px solid var(--border); border-radius: 10px; display: grid; gap: 4px 8px; grid-template-columns: minmax(0, 1fr) auto; padding: 8px 8px 8px 10px; }
.va-file-name { color: var(--text); font-size: 12.5px; font-weight: 750; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.va-file-size { color: var(--faint); font-weight: 500; }
.va-file-description { color: var(--subtle); font-size: 11.5px; grid-column: 1 / -1; line-height: 1.45; overflow-wrap: anywhere; }
.va-file-edit { display: grid; gap: 8px; grid-column: 1 / -1; }
.va-file-form { display: grid; gap: 10px; }
.va-file-preview { border: 1px solid var(--border); border-radius: 10px; display: block; height: auto; max-height: 200px; max-width: 100%; width: auto; }
.va-file-picked { color: var(--text); font-size: 12.5px; font-weight: 750; overflow-wrap: anywhere; }
.va-file-actions { display: flex; flex-wrap: wrap; gap: 8px; }
.va-file-error { color: var(--app-rose-text); font-size: 11.5px; line-height: 1.45; }
.va-editor { display: flex; flex-direction: column; gap: 16px; min-width: 0; overflow-y: auto; padding-right: 4px; }
.va-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: 0 1px 2px var(--app-shadow-soft);
  flex: 0 0 auto;
  padding: 16px;
}
.va-card-grow { min-height: 245px; }
.va-card.va-order-shortcut {
  align-items: center;
  color: var(--text);
  cursor: pointer;
  display: grid;
  gap: 10px;
  grid-template-columns: 16px minmax(0, 1fr) auto 16px;
  min-height: 44px;
  padding: 8px 14px;
  text-align: left;
  width: 100%;
}
.va-order-shortcut > svg { color: var(--muted); }
.va-card.va-order-shortcut:hover { background: var(--panel-hover); }
.va-card.va-order-shortcut:focus-visible { box-shadow: 0 0 0 4px var(--app-primary-ring); outline: none; }
.va-order-shortcut-arrow { color: var(--subtle); display: inline-flex; transform: rotate(-90deg); }
.va-card-head { align-items: center; display: flex; gap: 12px; justify-content: space-between; margin-bottom: 12px; }
.va-card-title { font-size: 13.5px; font-weight: 850; letter-spacing: -.1px; margin: 0; }
.va-mini-select { height: 34px; max-width: 210px; width: auto; }
.va-helper-line { color: var(--subtle); font-size: 12px; margin-top: 9px; }
.va-char-count { color: var(--subtle); font-size: 12px; font-variant-numeric: tabular-nums; font-weight: 650; white-space: nowrap; }
.va-char-count.near { color: var(--amber); }
.va-char-count.over { color: var(--rose); }
.va-detail-head { align-items: center; display: grid; gap: 16px; grid-template-columns: minmax(0, 1fr) auto; }
.va-identity { align-items: center; display: grid; gap: 13px; grid-template-columns: 46px minmax(0, 1fr); min-width: 0; }
.va-avatar-lg { border-radius: 13px; font-size: 17px; height: 46px; width: 46px; }
.va-heading-row { align-items: center; display: flex; flex-wrap: wrap; gap: 8px; }
.va-heading { font-size: 20px; font-weight: 850; letter-spacing: -.35px; line-height: 1.1; margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
/* The heading is also the rename control, so it only wears a field on hover. */
.va-heading-edit {
  background: transparent;
  border: 1px solid transparent;
  border-radius: 9px;
  color: inherit;
  cursor: text;
  display: block;
  font: inherit;
  letter-spacing: inherit;
  margin: -4px -7px;
  overflow: hidden;
  padding: 3px 6px;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}
.va-heading-edit:hover { background: var(--app-hover); border-color: var(--app-border); }
.va-heading-edit:focus { background: var(--app-input-focus); border-color: var(--app-primary-ring-strong); box-shadow: 0 0 0 4px var(--app-primary-ring); outline: none; }
.va-heading-input { max-width: 100%; width: 320px; }
.va-tag {
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
.va-editor-actions { display: flex; flex-wrap: wrap; gap: 8px; justify-content: flex-end; }
.va-tabs { background: var(--panel); border: 1px solid var(--border); border-radius: 12px; display: flex; flex: 0 0 auto; gap: 4px; padding: 4px; }
.va-tab { background: transparent; border: 0; border-radius: 9px; color: var(--muted); cursor: pointer; font: inherit; font-size: 12px; font-weight: 750; min-height: 32px; padding: 0 14px; }
.va-tab:hover { color: var(--text); }
.va-tab.is-active { background: var(--primary-soft); box-shadow: inset 0 0 0 1px var(--app-primary-border); color: var(--app-primary-text); }
/* The conversations workspace scrolls its own two panes, so the card gives it a
   height to work inside instead of growing with the transcript. */
.va-card-conversations { display: flex; flex: 1 1 auto; flex-direction: column; height: min(640px, 72vh); min-height: 420px; }
.va-card-conversations > .va-card-head { flex: 0 0 auto; }
/* Its own height inside the scrolling editor, not squeezed to fit the tab. */
.va-config-panel { flex: 0 0 auto; }
.va-config-head { align-items: flex-start; }
/* The agent list carries its own create button, as the voice workspace does,
   so the page needs no separate header row above the columns. */
.va-list-head { align-items: center; }
.va-list-head > div { min-width: 0; }
.va-list-head .va-btn { flex: 0 0 auto; }
.va-list-actions { display: flex; flex: 0 0 auto; gap: 8px; }
.va-list-head > .va-list-titlebar { flex: 1 1 auto; }
.va-list-titlebar { align-items: center; display: flex; gap: 16px; min-width: 0; }
.va-list-titleblock { flex: 0 0 auto; min-width: 0; }
.va-search-head { flex: 1 1 auto; margin: 0 auto; max-width: 440px; min-width: 0; }
/* WhatsApp's own green, matching the sidebar's support card. */
.va-btn-whatsapp { background: #25d366; border-color: transparent; color: #fff; text-decoration: none; }
.va-btn-whatsapp:hover { background: #1fb956; }
.va-btn-whatsapp:focus-visible { outline: 2px solid var(--app-primary-light); outline-offset: 2px; }
/* Shown instead of the full label once the header is too narrow for it. */
.va-btn-label-short { display: none; }
.va-config-fields {
  border-bottom: 1px solid var(--border);
  display: grid;
  gap: 12px;
  margin-bottom: 14px;
  padding-bottom: 14px;
}
.va-control-label { color: var(--faint); display: block; font-size: 10.5px; font-weight: 800; letter-spacing: .8px; margin-bottom: 7px; text-transform: uppercase; }
.va-accordion-list { display: flex; flex-direction: column; gap: 8px; }
.va-accordion-item { background: var(--panel); border: 1px solid var(--app-border); border-radius: 13px; overflow: hidden; }
.va-accordion-item.is-open { border-color: var(--app-primary-border); }
.va-accordion-button {
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
.va-accordion-icon { align-items: center; background: var(--app-hover-2); border: 1px solid var(--app-border); border-radius: 9px; color: var(--muted); display: inline-flex; height: 30px; justify-content: center; transition: color 0.18s ease, background 0.18s ease, border-color 0.18s ease; width: 30px; }
.va-accordion-item.is-open .va-accordion-icon { background: var(--primary-soft); border-color: var(--app-primary-border); color: var(--primary-light); }
.va-accordion-title { font-size: 13px; font-weight: 800; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.va-accordion-meta { color: var(--subtle); font-size: 11.5px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.va-accordion-chevron { color: var(--subtle); display: inline-flex; transition: transform .18s ease; }
.va-accordion-item.is-open .va-accordion-chevron { color: var(--primary-light); transform: rotate(180deg); }
.va-accordion-body { border-top: 1px solid var(--app-border); padding: 14px 12px; }
.va-message { align-items: center; color: var(--subtle); display: flex; font-size: 13px; justify-content: center; height: 100%; padding: 30px; text-align: center; }
.va-modal-backdrop {
  align-items: center;
  background: var(--app-overlay);
  display: flex;
  inset: 0;
  justify-content: center;
  padding: 24px;
  position: fixed;
  z-index: 120;
}
.va-modal-card {
  background: var(--surface);
  border: 1px solid var(--app-border-strong);
  border-radius: 18px;
  box-shadow: 0 30px 90px var(--app-shadow-color);
  display: flex;
  flex-direction: column;
  max-height: min(820px, calc(100vh - 48px));
  max-width: 620px;
  overflow: hidden;
  width: 100%;
}
.va-modal-head { align-items: start; border-bottom: 1px solid var(--border); display: flex; gap: 16px; justify-content: space-between; padding: 18px 20px; flex: 0 0 auto; }
.va-modal-title { font-size: 18px; font-weight: 850; letter-spacing: -.2px; margin: 0; }
.va-modal-subtitle { color: var(--subtle); font-size: 12.5px; margin-top: 3px; }
.va-modal-body { display: grid; gap: 14px; overflow-y: auto; padding: 18px 20px; }
.va-modal-section {
  background: var(--app-border-soft);
  border: 1px solid var(--app-border);
  border-radius: 14px;
  display: grid;
  gap: 12px;
  padding: 14px;
}
.va-modal-section-title { font-size: 13px; font-weight: 850; margin: 0; }
.va-modal-grid { display: grid; gap: 12px; grid-template-columns: repeat(2, minmax(0, 1fr)); }
.va-modal-footer { border-top: 1px solid var(--border); display: flex; gap: 10px; justify-content: flex-end; padding: 14px 20px; flex: 0 0 auto; }
.va-modal-error { background: var(--app-toast-error-bg); border: 1px solid var(--app-rose-border-strong); border-radius: 11px; color: var(--app-rose-text); font-size: 12.5px; font-weight: 650; padding: 10px 12px; }
.va-modal-step { color: var(--app-primary-text); font-size: 11px; font-weight: 800; letter-spacing: .4px; margin-bottom: 4px; }
/* The first step holds a QR code and the pairing form side by side. */
.va-qr-reveal { display: grid; gap: 12px; margin-top: 4px; }
.va-qr-reveal-or { align-items: center; color: var(--faint); display: flex; font-size: 12px; font-weight: 700; gap: 12px; text-transform: uppercase; }
.va-qr-reveal-or::before, .va-qr-reveal-or::after { background: var(--border); content: ""; flex: 1 1 auto; height: 1px; }
.va-qr-reveal .va-btn { justify-content: center; width: 100%; }
/* The setup page's top bar holds the logo and three buttons, so it shortens
   their labels on tablets and phones, and on narrow phones the WhatsApp
   button keeps only its icon and the logo only its mark. */
@media (max-width: 680px) {
  .va-setup-top { padding: 10px 16px; }
  .va-setup-top .va-btn .va-btn-label { display: none; }
  .va-setup-top .va-btn .va-btn-label-short { display: inline; }
  .va-setup-actions { gap: 6px; }
}
@media (max-width: 460px) {
  .va-setup-top .va-btn-whatsapp .va-btn-label-short,
  .va-setup-brand > .notranslate { display: none; }
}
.va-setup-shell { flex-direction: column; overflow-y: auto; }
.va-setup-top {
  align-items: center;
  border-bottom: 1px solid var(--border);
  display: flex;
  flex: 0 0 auto;
  gap: 12px;
  justify-content: space-between;
  padding: 12px 24px;
}
.va-setup-brand { align-items: center; display: inline-flex; font-size: 16px; font-weight: 850; gap: 9px; letter-spacing: -.2px; }
.va-setup-mark { display: inline-block; width: 30px; }
.va-setup-actions { align-items: center; display: flex; gap: 8px; }
.va-setup-main { align-items: flex-start; display: flex; flex: 1 0 auto; justify-content: center; padding: 28px 16px 40px; }
.va-setup-card-wrap { align-items: flex-start; display: flex; justify-content: center; width: 100%; }
.va-setup-card-wrap .va-modal-card { border-radius: 18px; box-shadow: none; max-height: none; overflow: visible; }
.va-setup-card-wrap .va-modal-body { overflow: visible; }
.va-setup-loading { align-self: center; color: var(--muted); }
.va-modal-card.is-pairing { max-width: 760px; }
.va-modal-card.is-pairing .va-modal-body { grid-template-columns: minmax(0, 1fr); }
.va-modal-card .va-number-grid { grid-template-columns: minmax(0, 1fr); }
.va-number-row.va-number-linked { cursor: default; }
.va-number-row.va-number-linked:hover { background: var(--panel-hover); border-color: var(--border); }
.va-icon-btn {
  align-items: center;
  background: transparent;
  border: 1px solid var(--app-border);
  border-radius: 10px;
  color: var(--subtle);
  cursor: pointer;
  display: inline-flex;
  flex: 0 0 auto;
  height: 32px;
  justify-content: center;
  transition: background .18s ease, color .18s ease;
  width: 32px;
}
.va-icon-btn:hover { background: var(--app-hover); color: var(--text); }
.va-toast {
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
  z-index: 130;
}
.va-toast-success { background: var(--app-toast-success-bg); border: 1px solid var(--app-green-border); color: var(--app-green-text); }
.va-toast-error { background: var(--app-toast-error-bg); border: 1px solid var(--app-rose-border-strong); color: var(--app-rose-text); }
/* The no-number card: a QR login on the left, the numbers already connected on
   the right, so either route out of "this agent answers on nothing" is one click. */
.va-number-setup { border-color: var(--app-primary-ring); }
.va-number-flag {
  background: var(--app-amber-soft);
  border: 1px solid var(--app-amber-border);
  border-radius: 20px;
  color: var(--amber);
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: .4px;
  padding: 3px 9px;
  text-transform: uppercase;
}
.va-number-copy { color: var(--subtle); font-size: 12.5px; line-height: 1.55; margin: 0 0 14px; }
/* 260px floor keeps the QR's modules big enough for a phone camera at 1x DPR. */
.va-number-grid { align-items: start; display: grid; gap: 14px; grid-template-columns: minmax(260px, 300px) minmax(0, 1fr); }
.va-number-grid.is-single { grid-template-columns: minmax(0, 1fr); }
/* An agent with no number: the whole page is the connect screen. */
.va-connect-page { display: flex; flex: 1 1 auto; justify-content: center; min-height: 0; overflow-y: auto; padding: 28px 24px 32px; }
.va-connect-inner { align-content: start; display: grid; gap: 20px; max-width: 1040px; width: 100%; }
.va-connect-head { display: grid; gap: 6px; text-align: center; }
.va-connect-title { color: var(--text); font-size: 22px; font-weight: 700; letter-spacing: -.3px; margin: 0; }
.va-connect-copy { color: var(--muted); font-size: 13.5px; line-height: 1.5; margin: 0 auto; max-width: 520px; }
.va-connect-page .va-number-grid { gap: 16px; }
.va-connect-page .va-number-pane { gap: 14px; padding: 20px; }
/* QR-first linking: the code and its reload timer on the left, the steps on
   the right; stacked when the pane is too narrow for both side by side. */
.va-qr-connect { align-items: center; display: grid; gap: 18px 28px; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
.va-qr-connect-code { display: grid; gap: 10px; justify-items: center; }
.va-qr-connect-code .va-qr-frame { max-width: 240px; width: 100%; }
.va-qr-connect-timer { color: var(--app-primary-text); font-size: 13px; font-variant-numeric: tabular-nums; font-weight: 600; text-align: center; }
.va-qr-connect-alt {
  background: none;
  border: 0;
  color: var(--app-primary-text);
  cursor: pointer;
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  justify-self: center;
  padding: 2px 0;
  text-decoration: underline;
  text-underline-offset: 3px;
}
.va-qr-connect-alt:hover:not(:disabled) { color: var(--text); }
.va-qr-connect-alt:disabled { cursor: default; opacity: .6; }
.va-qr-connect-help { display: grid; gap: 14px; min-width: 0; }
.va-qr-connect-title { color: var(--text); font-size: 16px; font-weight: 700; text-align: center; }
.va-qr-connect-steps { color: var(--muted); display: grid; font-size: 13.5px; gap: 10px; line-height: 1.45; margin: 0; padding-left: 22px; }
.va-qr-connect-steps b { color: var(--text); font-weight: 700; }
.va-qr-connect-note { color: var(--subtle); font-size: 11.5px; line-height: 1.5; margin: 0; }
@media (max-width: 900px) {
  .va-connect-page { overflow: visible; padding: 16px 12px 24px; }
  .va-connect-page .va-number-pane { padding: 16px; }
  .va-connect-title { font-size: 19px; }
}
.va-number-pane {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 13px;
  display: grid;
  gap: 10px;
  padding: 13px;
}
.va-number-pane-head { align-items: center; display: flex; gap: 10px; justify-content: space-between; }
.va-number-video { align-items: center; display: flex; flex: none; }
/* Phones: the QR code under the code form, for scanning from a second phone. */
.va-phone-qr { align-items: center; display: flex; flex-direction: column; gap: 10px; }
.va-phone-qr .va-qr-reveal-or { align-self: stretch; }
.va-phone-qr .va-qr-frame { max-width: 240px; width: 100%; }
.va-number-pane-title { font-size: 12.5px; font-weight: 800; letter-spacing: -.1px; }
.va-number-pane-note { color: var(--faint); font-size: 11px; white-space: nowrap; }
.va-number-pane-actions { align-items: center; display: flex; gap: 8px; }
.va-number-refresh {
  align-items: center;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--subtle);
  cursor: pointer;
  display: inline-flex;
  font-family: inherit;
  font-size: 11px;
  font-weight: 700;
  gap: 5px;
  height: 28px;
  padding: 0 8px;
}
.va-number-refresh:hover:not(:disabled) { background: var(--app-hover); border-color: var(--app-primary-border); color: var(--text); }
.va-number-refresh:disabled { cursor: wait; opacity: .55; }
.va-number-refresh.is-refreshing svg { animation: va-number-spin .8s linear infinite; }
@keyframes va-number-spin { to { transform: rotate(360deg); } }
.va-qr-frame {
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
/* Scale the QR by repeating pixels: smoothing greys the module edges. */
.va-qr-image { height: 100%; image-rendering: pixelated; object-fit: contain; width: 100%; }
/* Nothing to scan yet: drop the white square down to a hint-sized panel. */
.va-qr-frame:has(.va-qr-placeholder) { aspect-ratio: auto; background: var(--panel-hover); min-height: 148px; }
.va-qr-placeholder {
  align-items: center;
  color: var(--faint);
  display: grid;
  font-size: 12px;
  gap: 8px;
  justify-items: center;
  padding: 12px;
  text-align: center;
}
.va-number-status { color: var(--subtle); font-size: 11.5px; line-height: 1.5; }
.va-number-error { color: var(--rose); font-size: 11.5px; line-height: 1.5; }
.va-number-list { display: grid; gap: 8px; list-style: none; margin: 0; max-height: 268px; overflow-y: auto; padding: 0; }
.va-number-row {
  align-items: center;
  background: var(--panel-hover);
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
.va-number-row:hover:not(:disabled) { background: var(--app-hover); border-color: var(--app-primary-border); }
.va-number-row:disabled { cursor: not-allowed; opacity: .5; }
.va-number-icon {
  align-items: center;
  background: var(--primary-soft);
  border-radius: 9px;
  color: var(--primary-light);
  display: inline-flex;
  height: 30px;
  justify-content: center;
  width: 30px;
}
.va-number-body { display: grid; gap: 2px; min-width: 0; }
.va-number-name, .va-number-detail { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.va-number-name { font-size: 12.5px; font-weight: 700; }
.va-number-detail { color: var(--subtle); font-size: 11.5px; }
.va-number-hint { color: var(--green); font-size: 11px; font-weight: 700; white-space: nowrap; }
.va-number-hint.is-blocked { color: var(--faint); }
/* "Use" on a linked number reads as a button, like the chat agent page. */
.va-number-row .va-number-hint:not(.is-blocked) {
  align-items: center;
  background: var(--app-primary);
  border-radius: 8px;
  color: var(--app-on-accent, #fff);
  display: inline-flex;
  font-size: 12.5px;
  height: 30px;
  padding: 0 14px;
}
/* Desktop editor: the agent page takes the whole width, with the prompt filling
   the left column and a flat list of settings on the right. Each column scrolls
   on its own. Colours are the same tokens the stacked layout uses. */
@media (min-width: 1180px) {
  .va-content:has(> .va-agent-page) { padding: 12px 16px; }
  .va-agent-page { max-width: none; }
  .va-agent-expanded-topline { padding: 9px 14px; }
  .va-agent-expanded-topline .va-avatar-lg { border-radius: 10px; font-size: 14px; height: 34px; width: 34px; }
  .va-agent-expanded-topline .va-identity { grid-template-columns: 34px minmax(0, 1fr); }
  .va-agent-expanded-topline .va-heading { font-size: 17px; }
  /* The button's -7px margins let it overhang its own width; without the extra
     14px a short name gets cut off with free space beside it. */
  .va-heading-edit:not(.va-heading-input) { width: calc(100% + 14px); }
  .va-agent-expanded-topline .va-btn { min-height: 34px; }
  .va-agent-expanded-grid { gap: 12px; grid-template-rows: minmax(0, 1fr); padding: 12px; }
  .va-editor { gap: 12px; padding-right: 0; }
  /* Equal outer columns keep the tabs centred whatever the name's length. The back
     button sits outside this grid, so the grid reaches back under it: the middle
     is then the middle of the whole bar, not of what is left after the button. */
  .va-agent-back { position: relative; z-index: 1; }
  .va-agent-expanded-topline > .va-detail-head { grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr); margin-left: -46px; }
  .va-agent-expanded-topline .va-identity { padding-left: 46px; }
  .va-agent-expanded-topline .va-heading-row { flex-wrap: nowrap; }
  .va-agent-expanded-topline .va-heading { min-width: 0; }
  .va-agent-expanded-topline .va-heading-row > :not(.va-heading) { flex: none; }
  .va-agent-expanded-topline .va-editor-actions { flex-wrap: nowrap; }
  .va-agent-expanded-topline .va-tab { min-height: 28px; }
  .va-card-conversations { flex: 1 1 0; height: auto; }
}
.va-editor-columns {
  display: grid;
  flex: 1 1 0;
  gap: 12px;
  grid-template-columns: minmax(0, 1fr) 380px;
  grid-template-rows: minmax(0, 1fr);
  min-height: 440px;
}
/* The prompt takes the top half of the left column, Images & Files the space under
   it. The column scrolls when a long file list needs more room than that. */
.va-editor-main { display: flex; flex-direction: column; gap: 12px; min-height: 0; min-width: 0; overflow-y: auto; }
.va-prompt-card { display: flex; flex: 0 0 50%; flex-direction: column; min-width: 0; padding: 14px; }
.va-card.va-files-card { padding: 0 14px; }
.va-card.va-files-card:empty { display: none; }
/* The cards under the prompt, as a grid on desktop: three across where they
   fit, fewer on a narrower window. Each keeps its own height when opened. */
.va-prompt-card > .va-card-head { flex: 0 0 auto; margin-bottom: 8px; }
.va-prompt-card > .va-textarea { flex: 1 1 0; min-height: 0 !important; resize: none; }
.va-config-panel.is-rail { flex: none; min-height: 0; }
.is-rail > .va-panel-body { padding: 4px 14px; }
.is-rail .va-accordion-list { gap: 0; }
.is-rail .va-accordion-item,
.is-rail .va-accordion-item.is-open { background: transparent; border: 0; border-bottom: 1px solid var(--border); border-radius: 0; overflow: visible; }
.is-rail .va-accordion-item:last-child { border-bottom: 0; }
.is-rail .va-accordion-button { grid-template-columns: 20px minmax(0, 1fr) auto 18px; padding: 14px 2px; }
.is-rail .va-accordion-icon,
.is-rail .va-accordion-item.is-open .va-accordion-icon { background: transparent; border: 0; height: 20px; width: 20px; }
.is-rail .va-accordion-body { border-top: 0; padding: 0 2px 16px; }
.is-rail .va-number-grid { grid-template-columns: minmax(0, 1fr); }
.is-rail .va-number-pane { background: transparent; border: 0; padding: 0; }
.is-rail .va-accordion-body > .va-order-settings { margin-top: 0; }
.va-order-toggle:disabled { cursor: not-allowed; opacity: .55; }
/* The top bar and drawer backdrop only exist below the tablet breakpoint. */
/* Large desktops: the list is capped at 1320px, so give the wide screen a
   little more breathing room rather than stretching the rows. */
@media (min-width: 1680px) {
  .va-content { padding: 28px 40px; }
}
/* Small laptops / landscape tablets: a slimmer sidebar keeps the list usable. */
@media (max-width: 1100px) {
  .va-content { padding: 18px 20px; }
}
/* Tablets and phones: the sidebar becomes a drawer behind a sticky top bar,
   and the page scrolls as a whole instead of each pane on its own. */
@media (max-width: 900px) {
  .va-shell { display: block; height: auto; max-height: none; min-height: 100dvh; overflow: visible; width: 100%; max-width: 100%; }
  .va-main { height: auto; overflow: visible; }
  .va-content { padding: 16px; }
  .va-workspace { grid-template-columns: 1fr; }
  .va-panel { max-height: none; }
  .va-agent-browser { overflow: visible; }
  .va-agent-browser > .va-panel-body { overflow: visible; }
  .va-number-grid { grid-template-columns: 1fr; }
  .va-qr-frame { justify-self: center; max-width: 260px; width: 100%; }
  .va-agent-page { overflow: visible; }
  .va-agent-expanded-grid { overflow: visible; }
  .va-agent-expanded-grid > .va-editor { overflow: visible; padding-right: 0; }
  /* Toasts rise above the sidebar's bottom tab bar. */
  .va-toast { bottom: calc(76px + env(safe-area-inset-bottom)); }
  /* Nothing on the list page may widen it past the screen. */
  .va-main, .va-content, .va-workspace, .va-agent-browser { min-width: 0; max-width: 100%; }
  .va-panel { min-width: 0; }
  /* Tablets: title + search on one row, the two buttons on the row below. */
  .va-list-head { align-items: stretch; flex-direction: column; gap: 12px; }
  .va-list-head > .va-list-titlebar { flex: 0 0 auto; }
  .va-list-actions { width: 100%; }
  .va-list-actions .va-btn { flex: 1 1 0; justify-content: center; min-width: 0; white-space: nowrap; }
  .va-list-actions .va-btn .va-btn-label { overflow: hidden; text-overflow: ellipsis; }
  /* Agent page: the Agent / Calls / Configuration tabs stay pinned under the
     top bar (58px) while the settings scroll beneath them. */
  .va-agent-page .va-tabs {
    box-shadow: 0 -12px 0 var(--bg), 0 10px 18px -14px rgba(0, 0, 0, .55);
    position: sticky;
    top: 66px;
    z-index: 6;
  }
}
/* Phones: one column everywhere, the agent editor goes full screen, and
   touch targets grow a little. */
@media (max-width: 640px) {
  .va-content { padding: 12px; }
  .va-panel-head { padding: 12px 14px; }
  .va-panel-body { padding: 12px 14px; }
  /* Phones: the title takes its own line and the two buttons share the row
     below at full width, instead of squeezing the title into two lines. */
  .va-list-head { align-items: stretch; flex-direction: column; gap: 12px; }
  .va-list-head .va-panel-title { white-space: nowrap; }
  .va-list-head .va-panel-copy { margin-top: 2px; }
  .va-list-actions { width: 100%; }
  .va-search-head { margin: 0; max-width: none; width: 100%; }
  /* Phones: title, then search, then the buttons, each at full width. */
  .va-list-titlebar { align-items: stretch; flex-direction: column; gap: 10px; }
  .va-fields-2 { grid-template-columns: 1fr; }
  .va-composer { grid-template-columns: 1fr; }
  .va-modal-grid { grid-template-columns: 1fr; }
  .va-modal-backdrop { align-items: flex-end; padding: 0; }
  .va-modal-card { border-radius: 18px 18px 0 0; max-height: calc(100dvh - 24px); }
  .va-modal-head, .va-modal-body { padding: 16px; }
  .va-modal-footer { flex-direction: column-reverse; padding: 12px 16px calc(12px + env(safe-area-inset-bottom)); }
  .va-modal-footer .va-btn { width: 100%; }
  .va-input, .va-select { font-size: 16px; } /* stops iOS zooming on focus */
  /* Agent page on phones, same as the chat agent page: no frame around the
     page, and a two-row header - back, avatar, name and status on top, then
     Pause and Delete side by side across the full width. */
  .va-content:has(> .va-agent-page) { padding: 0; }
  .va-agent-page { background: transparent; border: 0; border-radius: 0; }
  .va-agent-expanded-grid { gap: 12px; padding: 12px 12px calc(12px + env(safe-area-inset-bottom)); }
  .va-agent-expanded-topline {
    align-items: center;
    display: grid;
    gap: 12px 10px;
    grid-template-columns: auto minmax(0, 1fr);
    padding: 14px 12px 12px;
  }
  .va-agent-expanded-topline > .va-detail-head { display: contents; }
  .va-agent-expanded-topline .va-identity { gap: 10px; grid-template-columns: 40px minmax(0, 1fr); }
  .va-agent-expanded-topline .va-avatar-lg { border-radius: 11px; font-size: 15px; height: 40px; width: 40px; }
  .va-agent-expanded-topline .va-heading-row { flex-wrap: nowrap; gap: 8px; }
  .va-agent-expanded-topline .va-heading { flex: 0 1 auto; font-size: 17px; line-height: 1.2; min-width: 0; white-space: normal; }
  .va-agent-expanded-topline .va-heading-row > :not(.va-heading) { flex: none; }
  .va-agent-expanded-topline .va-tag { display: none; }
  /* The full name wraps onto a second line instead of being cut off. */
  .va-agent-expanded-topline .va-heading-edit:not(.va-heading-input) {
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    display: -webkit-box;
    overflow-wrap: anywhere;
    white-space: normal;
  }
  .va-editor-actions { gap: 8px; grid-column: 1 / -1; justify-content: stretch; }
  .va-editor-actions .va-btn { flex: 1 1 0; justify-content: center; min-height: 40px; }
  .va-agent-page .va-tabs { top: 58px; }
  .va-heading { font-size: 18px; }
  .va-heading-input { width: 100%; }
  .va-card { padding: 14px; }
  .va-card-head { flex-wrap: wrap; }
  .va-mini-select { max-width: 100%; width: 100%; }
  .va-tabs { width: 100%; }
  .va-tab { flex: 1 1 0; }
  .va-number-pane-head { flex-wrap: wrap; }
  .va-number-pane-note { white-space: normal; }
  .va-card-conversations { height: min(640px, calc(100dvh - 220px)); min-height: 380px; }
  .va-toast { bottom: calc(16px + env(safe-area-inset-bottom)); max-width: calc(100vw - 24px); width: max-content; }
}
/* Narrow phones: the WhatsApp help button switches to its short label so both
   buttons fit side by side with their text. */
@media (max-width: 420px) {
  .va-list-head .va-btn-whatsapp .va-btn-label { display: none; }
  .va-list-head .va-btn-whatsapp .va-btn-label-short { display: inline; }
  .va-list-head .va-btn-primary .va-btn-label { display: none; }
  .va-list-head .va-btn-primary .va-btn-label-short { display: inline; }
  .va-list-head .va-btn { min-height: 36px; padding: 0 11px; }
  .va-tab { padding: 0 6px; }
  .va-avatar { height: 30px; width: 30px; }
  .va-accordion-button { gap: 8px; grid-template-columns: 28px minmax(0, 1fr) minmax(0, auto) 18px; padding: 11px 10px; }
}
`;

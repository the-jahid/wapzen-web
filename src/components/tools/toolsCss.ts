// The Tools page stylesheet, in a module of its own so the Orders page can use
// it without downloading the whole Tools page (and the animation library it
// loads) just for its styles.
export const toolsCss = `
.tools-shell {
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
.tools-shell * { box-sizing: border-box; }
.tools-shell button, .tools-shell input, .tools-shell select, .tools-shell textarea { font: inherit; }
.tools-shell ::-webkit-scrollbar { height: 9px; width: 9px; }
.tools-shell ::-webkit-scrollbar-thumb { background: var(--app-border-strong); border-radius: 9px; }
.tools-shell ::-webkit-scrollbar-track { background: transparent; }
.tools-main { display: flex; flex: 1; flex-direction: column; height: 100vh; min-width: 0; overflow: hidden; }
.tools-demo-pill {
  background: var(--app-amber-soft);
  border: 1px solid var(--app-amber-border);
  border-radius: 999px;
  color: var(--app-amber-text);
  font-size: 11.5px;
  font-weight: 800;
  padding: 6px 11px;
  white-space: nowrap;
}
.tools-content { flex: 1 1 auto; min-height: 0; overflow-y: auto; padding: 24px 32px 32px; }
.tools-browse { display: flex; flex-direction: column; gap: 16px; width: 100%; }
.tools-page-title { color: var(--text); font-size: 22px; font-weight: 850; letter-spacing: -.4px; margin: 0; }
.tools-default-note { align-items: center; display: flex; flex-wrap: wrap; gap: 6px 10px; }
.tools-function-params { display: grid; gap: 8px; }
.tools-function-param { align-items: baseline; display: grid; gap: 10px; grid-template-columns: 150px minmax(0, 1fr); }
.tools-function-param span:last-child { color: var(--subtle); font-size: 12.5px; }
.expandable-card-backdrop { background: var(--app-overlay); inset: 0; position: fixed; z-index: 80; }
.expandable-card-stage { align-items: center; display: flex; inset: 0; justify-content: center; padding: 24px; pointer-events: none; position: fixed; z-index: 90; }
.expandable-card-panel { pointer-events: auto; }
.tools-expandable-card {
  background: var(--bg);
  border: 1px solid var(--border-strong);
  border-radius: 20px;
  box-shadow: 0 30px 90px var(--app-shadow-color), 0 0 0 1px var(--app-primary-ring);
  max-height: min(820px, calc(100vh - 48px));
  max-width: 1120px;
  overflow: auto;
  padding: 16px;
  width: 100%;
}
.tools-expandable-card .tools-detail { max-width: none; }
.tools-toolbar { align-items: center; display: flex; flex-wrap: wrap; gap: 12px; }
.tools-toolbar .tools-search-wrap { flex: 1 1 240px; max-width: 420px; }
/* Search in the Retell-style header, right of the title. */
.tools-browse .tools-search-wrap { flex: 0 1 300px; min-width: 0; width: 300px; }
@media (max-width: 640px) { .tools-browse .tools-search-wrap { flex: 1 1 100%; width: auto; } }
.tools-toolbar .tools-count { margin-left: auto; }
.tools-view-toggle {
  background: var(--panel);
  border: 1px solid var(--app-border);
  border-radius: 11px;
  display: inline-flex;
  flex-shrink: 0;
  gap: 2px;
  padding: 3px;
}
.tools-view-btn {
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: 8px;
  color: var(--subtle);
  cursor: pointer;
  display: inline-flex;
  height: 30px;
  justify-content: center;
  transition: background .18s ease, box-shadow .18s ease, color .18s ease;
  width: 34px;
}
.tools-view-btn:hover { color: var(--text); }
.tools-view-btn.is-active {
  background: var(--primary-soft);
  box-shadow: inset 0 0 0 1px var(--app-primary-ring);
  color: var(--app-primary-text);
}
.tools-panel-title-row { align-items: center; display: flex; gap: 8px; justify-content: space-between; }
.tools-count {
  background: var(--app-hover-2);
  border: 1px solid var(--border-strong);
  border-radius: 999px;
  color: var(--subtle);
  font-size: 11px;
  font-weight: 800;
  line-height: 1;
  padding: 4px 8px;
}
.tools-btn {
  align-items: center;
  border: 1px solid var(--app-border-strong);
  border-radius: 11px;
  cursor: pointer;
  display: inline-flex;
  font-weight: 800;
  gap: 8px;
  justify-content: center;
  min-height: 40px;
  padding: 0 14px;
  transition: background .18s ease, border-color .18s ease, filter .18s ease, transform .18s ease;
  white-space: nowrap;
}
.tools-btn:hover { transform: translateY(-1px); }
.tools-btn:disabled { cursor: not-allowed; filter: grayscale(.35); opacity: .45; transform: none; }
.tools-btn-primary { background: linear-gradient(140deg,var(--primary-2),var(--primary)); border-color: transparent; box-shadow: 0 4px 14px var(--app-primary-glow); color: var(--app-on-accent); }
.tools-btn-secondary { background: var(--panel-hover); color: var(--text); }
.tools-btn-secondary:hover { background: var(--app-hover-3); }
.tools-btn-destructive { background: var(--app-rose-soft-2); border-color: var(--app-rose-border-strong); color: var(--app-rose-text); }
.tools-btn-destructive:hover { background: var(--app-rose-border); }
.tools-btn-sm { border-radius: 9px; font-size: 12px; gap: 6px; min-height: 32px; padding: 0 11px; }
.tools-input, .tools-select, .tools-textarea {
  background: var(--panel);
  border: 1px solid var(--app-border);
  border-radius: 11px;
  color: var(--text);
  outline: none;
  transition: background .18s ease, border-color .18s ease, box-shadow .18s ease;
  width: 100%;
}
.tools-input { height: 40px; padding: 0 12px; }
.tools-input::placeholder, .tools-textarea::placeholder { color: var(--faint); }
.tools-input:focus, .tools-select:focus, .tools-textarea:focus {
  background: var(--app-input-focus);
  border-color: var(--app-primary-ring-strong);
  box-shadow: 0 0 0 4px var(--app-primary-ring);
}
.tools-select {
  appearance: none;
  background-image: linear-gradient(45deg, transparent 50%, var(--app-muted) 50%), linear-gradient(135deg, var(--app-muted) 50%, transparent 50%);
  background-position: calc(100% - 17px) 50%, calc(100% - 12px) 50%;
  background-repeat: no-repeat;
  background-size: 5px 5px, 5px 5px;
  height: 40px;
  padding: 0 34px 0 12px;
}
.tools-select option { background: var(--surface); color: var(--text); }
.tools-textarea { line-height: 1.55; min-height: 84px; padding: 10px 12px; resize: vertical; }
.tools-mono { font-family: var(--font-geist-mono), monospace; font-size: 12.5px; }
.tools-search-wrap { position: relative; }
.tools-search-icon { color: var(--subtle); left: 12px; position: absolute; top: 50%; transform: translateY(-50%); }
.tools-search-input { padding-left: 36px; }
.tools-grid { display: grid; gap: 14px; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); }
.tools-list { display: flex; flex-direction: column; gap: 10px; }
.tools-row {
  align-items: center;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  color: inherit;
  cursor: pointer;
  display: grid;
  gap: 16px;
  grid-template-areas: "avatar identity type summary tail chevron";
  grid-template-columns: 36px minmax(180px, 1.2fr) auto minmax(180px, 1fr) auto 18px;
  padding: 13px 16px;
  text-align: left;
  transition: background .18s ease, border-color .18s ease, box-shadow .18s ease;
  width: 100%;
}
.tools-row:hover { background: var(--panel-hover); border-color: var(--app-primary-ring); box-shadow: 0 6px 18px var(--app-shadow-soft); }
.tools-row:focus-visible { border-color: var(--app-primary-ring-strong); box-shadow: 0 0 0 4px var(--app-primary-ring); outline: none; }
.tools-row > .tools-tile { grid-area: avatar; }
.tools-row-type { grid-area: type; justify-self: start; }
.tools-row-identity { display: grid; gap: 3px; grid-area: identity; min-width: 0; }
.tools-row-name { font-size: 14px; font-weight: 850; letter-spacing: -.2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.tools-row-desc { color: var(--subtle); font-size: 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.tools-row-summary { align-items: center; display: flex; gap: 8px; grid-area: summary; min-width: 0; }
.tools-row-line { color: var(--subtle); font-size: 11.5px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.tools-row-tail { color: var(--faint); font-size: 11px; font-weight: 750; grid-area: tail; white-space: nowrap; }
.tools-row-chevron { color: var(--faint); display: inline-flex; grid-area: chevron; transition: color .18s ease, transform .18s ease; }
.tools-row:hover .tools-row-chevron { color: var(--primary-light); transform: translateX(2px); }
.tools-card-item {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: 0 1px 2px var(--app-shadow-soft);
  color: inherit;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 186px;
  padding: 16px;
  text-align: left;
  transition: background .18s ease, border-color .18s ease, box-shadow .18s ease, transform .18s ease;
}
.tools-card-item:hover {
  background: var(--panel-hover);
  border-color: var(--app-primary-border);
  box-shadow: 0 12px 30px var(--app-shadow-soft);
  transform: translateY(-2px);
}
.tools-card-item:focus-visible { border-color: var(--app-primary-ring-strong); box-shadow: 0 0 0 4px var(--app-primary-ring); outline: none; }
.tools-card-top { align-items: center; display: flex; gap: 10px; justify-content: space-between; }
.tools-card-name { font-size: 15px; font-weight: 850; letter-spacing: -.2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.tools-card-desc {
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  color: var(--muted);
  display: -webkit-box;
  font-size: 12.5px;
  line-height: 1.55;
  overflow: hidden;
}
.tools-card-foot {
  align-items: center;
  border-top: 1px solid var(--border);
  display: flex;
  gap: 8px;
  margin-top: auto;
  min-width: 0;
  padding-top: 12px;
}
.tools-chip-method {
  background: var(--app-hover-2);
  border: 1px solid var(--border-strong);
  border-radius: 7px;
  color: var(--subtle);
  flex-shrink: 0;
  font-size: 10.5px;
  font-weight: 850;
  letter-spacing: .5px;
  padding: 4px 7px;
}
.tools-chip-line { color: var(--subtle); font-size: 11.5px; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.tools-chip-tail { color: var(--faint); flex-shrink: 0; font-size: 11px; font-weight: 750; margin-left: auto; white-space: nowrap; }
.tools-add-card {
  align-items: center;
  background: transparent;
  border: 1px dashed var(--border-strong);
  border-radius: 16px;
  color: var(--subtle);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 6px;
  justify-content: center;
  min-height: 186px;
  padding: 16px;
  text-align: center;
  transition: background .18s ease, border-color .18s ease, color .18s ease;
}
.tools-add-card:hover { background: var(--app-hover); border-color: var(--app-primary-border); color: var(--text); }
.tools-add-icon {
  align-items: center;
  border: 1px solid var(--border-strong);
  border-radius: 12px;
  display: flex;
  height: 40px;
  justify-content: center;
  margin-bottom: 4px;
  width: 40px;
}
.tools-add-label { font-size: 13.5px; font-weight: 800; }
.tools-add-copy { color: var(--faint); font-size: 11.5px; max-width: 200px; }
.tools-tile {
  align-items: center;
  border: 1px solid var(--app-border-strong);
  border-radius: 10px;
  display: flex;
  flex-shrink: 0;
  height: 34px;
  justify-content: center;
  width: 34px;
}
.tools-tile-lg { border-radius: 13px; height: 44px; width: 44px; }
.tools-accent-primary { background: var(--app-primary-soft); border-color: var(--app-primary-ring); color: var(--primary-light); }
.tools-accent-sky { background: var(--app-sky-soft); border-color: var(--app-sky-border); color: var(--app-sky); }
.tools-accent-rose { background: var(--app-rose-soft); border-color: var(--app-rose-border); color: var(--rose); }
.tools-accent-green { background: var(--app-green-soft); border-color: var(--app-green-border); color: var(--green); }
.tools-accent-amber { background: var(--app-amber-soft); border-color: var(--app-amber-border); color: var(--app-amber); }
.tools-list-empty {
  align-items: center;
  border: 1px dashed var(--border-strong);
  border-radius: 14px;
  color: var(--subtle);
  display: flex;
  flex-direction: column;
  font-size: 12.5px;
  gap: 4px;
  justify-content: center;
  min-height: 140px;
  padding: 20px;
  text-align: center;
}
.tools-page-back { align-items: center; align-self: flex-start; color: var(--subtle); display: inline-flex; font-size: 13px; font-weight: 600; gap: 6px; text-decoration: none; }
.tools-page-back:hover { color: var(--text); }
.tools-detail { display: flex; flex-direction: column; gap: 14px; margin: 0 auto; max-width: 1120px; min-width: 0; width: 100%; }
.tools-back {
  align-items: center;
  background: none;
  border: 0;
  color: var(--subtle);
  cursor: pointer;
  display: inline-flex;
  font-size: 12.5px;
  font-weight: 800;
  gap: 8px;
  padding: 2px 0;
  transition: color .18s ease;
  width: fit-content;
}
.tools-back:hover { color: var(--text); }
.tools-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: 0 1px 2px var(--app-shadow-soft);
  flex: 0 0 auto;
}
.tools-detail-head {
  align-items: center;
  display: grid;
  gap: 14px;
  grid-template-columns: minmax(0, 1fr) auto;
  padding: 16px 18px;
}
.tools-identity { align-items: center; display: grid; gap: 13px; grid-template-columns: 44px minmax(0, 1fr); min-width: 0; }
.tools-detail-name { font-size: 19px; font-weight: 850; letter-spacing: -.35px; line-height: 1.15; margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.tools-detail-sub { align-items: center; display: flex; flex-wrap: wrap; gap: 8px; margin-top: 5px; }
.tools-badge {
  border-radius: 999px;
  display: inline-flex;
  font-size: 11.5px;
  font-weight: 800;
  line-height: 1;
  padding: 5px 8px;
  white-space: nowrap;
}
.tools-badge-neutral { background: var(--app-hover-2); border: 1px solid var(--border-strong); color: var(--subtle); }
.tools-badge-default { background: var(--primary-soft); border: 1px solid var(--app-primary-ring); color: var(--app-primary-text); }
.tools-card-head { border-bottom: 1px solid var(--border); padding: 14px 18px; }
.tools-card-title { font-size: 13px; font-weight: 850; margin: 0; }
.tools-card-copy { color: var(--subtle); font-size: 12px; margin-top: 2px; }
.tools-card-body { display: grid; gap: 14px; padding: 18px; }
.tools-field { display: grid; gap: 7px; min-width: 0; }
.tools-field-label { color: var(--subtle); font-size: 11.5px; font-weight: 800; }
.tools-field-hint { color: var(--faint); font-size: 11.5px; line-height: 1.5; }
.tools-grid-2 { display: grid; gap: 14px; grid-template-columns: 140px minmax(0, 1fr); }
.tools-kv-row { display: grid; gap: 10px; grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr) 36px; }
.tools-param-row { display: grid; gap: 10px; grid-template-columns: minmax(0, 1fr) 120px minmax(0, 1.5fr) auto 36px; }
.tools-body-row { display: grid; gap: 10px; grid-template-columns: minmax(0, 1fr) 110px minmax(0, 1.4fr) 36px; }
.tools-body-format { max-width: 280px; }
.tools-rows { display: grid; gap: 10px; }
.tools-row-head { color: var(--faint); font-size: 10.5px; font-weight: 850; letter-spacing: .8px; text-transform: uppercase; }
.tools-icon-button {
  align-items: center;
  background: var(--panel);
  border: 1px solid var(--app-border);
  border-radius: 10px;
  color: var(--subtle);
  cursor: pointer;
  display: inline-flex;
  height: 40px;
  justify-content: center;
  transition: background .18s ease, border-color .18s ease, color .18s ease;
  width: 36px;
}
.tools-icon-button:hover { background: var(--app-hover-2); border-color: var(--border-strong); color: var(--app-text-strong); }
.tools-toggle { align-items: center; background: none; border: 0; cursor: pointer; display: flex; gap: 10px; padding: 0; text-align: left; }
.tools-toggle-track {
  background: var(--app-hover-3);
  border: 1px solid var(--border-strong);
  border-radius: 999px;
  flex-shrink: 0;
  height: 24px;
  padding: 2px;
  transition: background .18s ease, border-color .18s ease;
  width: 44px;
}
.tools-toggle-knob {
  background: var(--app-invert-bg);
  border-radius: 50%;
  height: 18px;
  transition: transform .18s ease, background .18s ease;
  width: 18px;
}
.tools-toggle.is-on .tools-toggle-track { background: var(--primary); border-color: transparent; }
.tools-toggle.is-on .tools-toggle-knob { background: var(--app-on-accent); transform: translateX(20px); }
.tools-toggle-label { font-size: 12.5px; font-weight: 750; }
.tools-test-args { display: grid; gap: 14px; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); }
.tools-test-req { color: var(--rose); font-weight: 800; }
.tools-test-type { color: var(--faint); font-weight: 700; }
.tools-test-actions { align-items: center; display: flex; flex-wrap: wrap; gap: 10px 14px; }
.tools-test-result { border-top: 1px solid var(--border); display: grid; gap: 14px; padding-top: 14px; }
.tools-test-error { background: var(--app-rose-soft); border: 1px solid var(--app-rose-border); border-radius: 10px; color: var(--app-rose-text); font-size: 12.5px; font-weight: 700; padding: 10px 12px; }
.tools-test-pre {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 10px;
  font-family: var(--font-geist-mono), monospace;
  font-size: 12px;
  line-height: 1.55;
  margin: 0;
  max-height: 320px;
  overflow: auto;
  padding: 10px 12px;
  white-space: pre-wrap;
  word-break: break-word;
}
.tools-badge-ok { background: var(--app-green-soft); border: 1px solid var(--app-green-border); color: var(--green); }
.tools-badge-fail { background: var(--app-rose-soft); border: 1px solid var(--app-rose-border); color: var(--app-rose-text); }
.tools-required {
  align-items: center;
  color: var(--subtle);
  cursor: pointer;
  display: inline-flex;
  font-size: 12px;
  font-weight: 750;
  gap: 6px;
  white-space: nowrap;
}
.tools-empty {
  align-items: center;
  border: 1px dashed var(--border-strong);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 340px;
  padding: 40px;
  text-align: center;
}
.tools-empty-icon {
  align-items: center;
  background: var(--app-hover);
  border: 1px solid var(--border);
  border-radius: 22px;
  color: var(--subtle);
  display: flex;
  height: 72px;
  justify-content: center;
  width: 72px;
}
.tools-empty-title { font-size: 17px; font-weight: 850; letter-spacing: -.2px; margin: 18px 0 0; }
.tools-empty-copy { color: var(--muted); font-size: 13px; line-height: 1.6; margin: 8px 0 0; max-width: 380px; }
.tools-modal-overlay {
  align-items: center;
  animation: tools-fade-in .16s ease;
  backdrop-filter: blur(3px);
  background: var(--app-overlay);
  display: flex;
  inset: 0;
  justify-content: center;
  padding: 24px;
  position: fixed;
  z-index: 120;
}
.tools-modal {
  animation: tools-modal-in .18s ease;
  background: var(--surface-2);
  border: 1px solid var(--border-strong);
  border-radius: 18px;
  box-shadow: 0 30px 80px var(--app-shadow-color-strong);
  max-height: calc(100vh - 48px);
  max-width: 560px;
  overflow-y: auto;
  padding: 22px;
  width: 100%;
}
.tools-modal-sm { max-width: 420px; }
.tools-modal-lg { max-width: 760px; }
.tools-modal-title { font-size: 17px; font-weight: 850; letter-spacing: -.2px; margin: 0; }
.tools-modal-copy { color: var(--muted); font-size: 13px; line-height: 1.55; margin: 8px 0 0; }
.tools-modal-copy strong { color: var(--text); font-weight: 800; }
.tools-modal-section { display: grid; gap: 10px; margin-top: 18px; }
.tools-modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px; }
.tools-type-grid { display: grid; gap: 10px; grid-template-columns: 1fr 1fr; }
.tools-type-card {
  align-items: start;
  background: var(--panel);
  border: 1px solid var(--app-border);
  border-radius: 13px;
  color: inherit;
  cursor: pointer;
  display: grid;
  gap: 11px;
  grid-template-columns: 34px minmax(0, 1fr);
  padding: 12px;
  text-align: left;
  transition: background .18s ease, border-color .18s ease;
}
.tools-type-card:hover { background: var(--app-hover-2); border-color: var(--border-strong); }
.tools-type-card.is-selected { background: var(--primary-soft); border-color: var(--app-primary-border); box-shadow: inset 0 0 0 1px var(--app-primary-ring); }
.tools-type-name { display: block; font-size: 13px; font-weight: 800; }
.tools-type-blurb { color: var(--subtle); display: block; font-size: 11.5px; line-height: 1.45; margin-top: 3px; }
.tools-modal-icon {
  align-items: center;
  background: var(--app-rose-soft);
  border: 1px solid var(--app-rose-border);
  border-radius: 12px;
  color: var(--rose);
  display: inline-flex;
  height: 42px;
  justify-content: center;
  margin-bottom: 14px;
  width: 42px;
}
@keyframes tools-fade-in { from { opacity: 0; } to { opacity: 1; } }
@keyframes tools-modal-in {
  from { opacity: 0; transform: translateY(8px) scale(.98); }
  to { opacity: 1; transform: none; }
}
.tools-toast {
  border-radius: 12px;
  bottom: 24px;
  box-shadow: 0 18px 50px var(--app-shadow-color);
  font-size: 13px;
  font-weight: 750;
  left: 50%;
  max-width: min(480px, calc(100vw - 48px));
  padding: 12px 18px;
  position: fixed;
  transform: translateX(-50%);
  z-index: 130;
}
.tools-toast-success { background: var(--app-toast-success-bg); border: 1px solid var(--app-green-border); color: var(--app-toast-success-text); }
.tools-toast-error { background: var(--app-toast-error-bg); border: 1px solid var(--app-rose-border-strong); color: var(--app-rose-text); }
/* The mobile top bar and drawer backdrop only exist below the tablet breakpoint. */
/* Retell-style master-detail: a list pane of tools beside the open one. */
.tools-split { display: flex; flex: 1 1 auto; min-height: 0; min-width: 0; }
.tools-pane-list { border-right: 1px solid var(--app-border); display: flex; flex: 0 0 290px; flex-direction: column; min-height: 0; min-width: 0; padding: 16px; }
.tools-pane-head { align-items: center; border-bottom: 1px solid var(--app-border); color: var(--app-text); display: flex; gap: 10px; padding: 0 2px 14px; }
.tools-pane-title { flex: 1; font-size: 14.5px; font-weight: 600; margin: 0; }
.tools-pane-add { align-items: center; background: var(--app-text-strong, var(--app-text)); border: 0; border-radius: 8px; color: var(--app-bg); cursor: pointer; display: inline-flex; height: 32px; justify-content: center; transition: opacity .16s ease; width: 32px; }
.tools-pane-add:hover { opacity: .85; }
.tools-pane-items { display: flex; flex-direction: column; gap: 2px; min-height: 0; overflow-y: auto; padding-top: 12px; }
.tools-pane-item { align-items: center; border-radius: 8px; color: var(--app-muted); display: flex; font-size: 14px; gap: 10px; min-height: 36px; padding: 0 10px; text-decoration: none; transition: background .16s ease, color .16s ease; }
.tools-pane-item > svg { color: var(--app-text); flex-shrink: 0; }
.tools-pane-item:hover { background: var(--app-hover); color: var(--app-text); }
.tools-pane-item.is-active { background: var(--app-hover-2); color: var(--app-text); }
.tools-pane-item-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.tools-pane-item-tag { color: var(--app-subtle); flex-shrink: 0; font-size: 11px; }
.tools-pane-note { color: var(--app-subtle); font-size: 13px; margin: 0; padding: 6px 4px; }
.tools-pane-detail { display: flex; flex: 1; flex-direction: column; min-height: 0; min-width: 0; overflow-y: auto; padding: 24px 24px 32px; }
.tools-pane-detail .tools-detail { gap: 20px; margin: 0; max-width: none; }
.tools-pane-detail .tools-back { display: none; }
.tools-rt-head { align-items: flex-start; border-bottom: 1px solid var(--app-border); display: flex; gap: 16px; justify-content: space-between; padding-bottom: 16px; }
.tools-rt-title { font-family: var(--font-geist-mono), monospace; font-size: 18px; font-weight: 600; margin: 0; overflow-wrap: anywhere; }
.tools-rt-line { align-items: center; color: var(--app-subtle); display: flex; flex-wrap: wrap; font-size: 12px; gap: 6px; margin-top: 6px; }
.tools-rt-line .tools-badge { font-size: 11px; }
.tools-rt-copy { align-items: center; background: none; border: 0; border-radius: 5px; color: var(--app-subtle); cursor: pointer; display: inline-flex; height: 20px; justify-content: center; padding: 0; width: 20px; }
.tools-rt-copy:hover { background: var(--app-hover); color: var(--app-text); }
.tools-rt-dot { background: var(--app-text); border-radius: 50%; height: 4px; margin: 0 4px; width: 4px; }
.tools-rt-unsaved { color: var(--app-amber-text); font-weight: 600; }
.tools-rt-buttons { display: flex; flex-shrink: 0; gap: 8px; }
.tools-dark-btn { align-items: center; background: var(--app-text-strong, var(--app-text)); border: 0; border-radius: 8px; color: var(--app-bg); cursor: pointer; display: inline-flex; font: inherit; font-size: 14px; font-weight: 600; gap: 6px; height: 36px; padding: 0 14px; white-space: nowrap; }
.tools-dark-btn:hover:not(:disabled) { opacity: .85; }
.tools-dark-btn:disabled { cursor: not-allowed; opacity: .4; }
.tools-outline-icon { align-items: center; background: transparent; border: 1px solid var(--app-border-strong); border-radius: 8px; color: var(--app-text); cursor: pointer; display: inline-flex; height: 36px; justify-content: center; width: 36px; }
.tools-outline-icon:hover { background: var(--app-rose-soft); border-color: var(--app-rose-border); color: var(--app-rose-text); }
@media (max-width: 900px) {
  .tools-split { flex-direction: column; }
  .tools-pane-list { border-right: 0; flex: 1 1 auto; min-height: auto; }
  /* The page scrolls as a whole here, so the list grows with its content
     instead of shrinking into its own scroll box (which clipped the empty
     state mid-line with a second scrollbar). */
  .tools-pane-items { flex: 0 0 auto; min-height: auto; overflow: visible; }
  .tools-split:not(.has-selection) .tools-pane-detail { display: none; }
  .tools-split.has-selection .tools-pane-list { display: none; }
  .tools-pane-detail { overflow: visible; padding: 16px; }
  .tools-pane-detail .tools-back { display: inline-flex; }
}
@media (max-width: 640px) {
  .tools-rt-head { flex-direction: column; }
}
/* Wide screens: a little more room around the capped content. */
@media (min-width: 1680px) {
  .tools-content { padding: 28px 40px 36px; }
}
/* Laptops: the param count goes and the endpoint folds under the name. */
@media (max-width: 1240px) {
  .tools-row { gap: 8px 14px; grid-template-areas: "avatar identity type chevron" "avatar summary summary chevron"; grid-template-columns: 36px minmax(0, 1fr) auto 18px; }
  .tools-row-tail { display: none; }
}
@media (max-width: 1100px) {
  .tools-param-row { grid-template-columns: minmax(0, 1fr) 120px minmax(0, 1fr); }
  .tools-param-row .tools-required { grid-column: 1 / -1; }
  .tools-content { padding: 20px 20px 28px; }
  .expandable-card-stage { padding: 16px; }
  .tools-expandable-card { max-height: min(820px, calc(100dvh - 32px)); }
}
/* Tablets and phones: the sidebar becomes a drawer behind a sticky top bar,
   and the page scrolls as a whole. */
@media (max-width: 900px) {
  .tools-shell { display: block; height: auto; max-height: none; min-height: 100dvh; max-width: 100%; overflow: visible; width: 100%; }
  .tools-main { height: auto; overflow: visible; }
  .tools-content { overflow: visible; padding: 16px; }
  .tools-grid { grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); }
}
/* Phones: search on its own line, single-column forms, full-screen detail
   card and bottom-sheet dialogs. */
@media (max-width: 640px) {
  .tools-content { padding: 12px 12px calc(16px + env(safe-area-inset-bottom)); }
  .tools-toolbar { gap: 8px; }
  .tools-toolbar .tools-search-wrap { flex: 1 1 100%; max-width: none; }
  .tools-toolbar .tools-count { margin-left: 0; margin-right: auto; order: 2; }
  .tools-view-toggle { order: 3; }
  .tools-toolbar-new { order: 4; }
  .tools-shell input, .tools-shell select, .tools-shell textarea { font-size: 16px; } /* stops iOS zooming on focus */
  .tools-grid { grid-template-columns: 1fr; }
  .tools-card-item { min-height: 0; }
  .tools-card-item:hover { transform: none; }
  .tools-grid-2, .tools-kv-row, .tools-param-row, .tools-body-row, .tools-type-grid, .tools-function-param { grid-template-columns: minmax(0, 1fr); }
  .tools-detail-head { grid-template-columns: minmax(0, 1fr); }
  .tools-row { gap: 8px 10px; grid-template-areas: "avatar identity type" "avatar summary summary"; grid-template-columns: 36px minmax(0, 1fr) auto; padding: 12px; }
  .tools-row-chevron { display: none; }
  .expandable-card-stage { align-items: stretch; padding: 0; }
  .tools-expandable-card { border: 0; border-radius: 0; height: 100dvh; max-height: 100dvh; max-width: none; padding: 12px 12px calc(12px + env(safe-area-inset-bottom)); }
  .tools-modal-overlay { align-items: center; padding: 16px; }
  .tools-modal { border-radius: 18px; max-height: calc(100dvh - 32px); max-width: none; padding: 20px 16px; }
  .tools-modal-sm, .tools-modal-lg { max-width: none; }
  .tools-modal-actions { flex-direction: column-reverse; }
  .tools-modal-actions .tools-btn { width: 100%; }
  .tools-toast { bottom: calc(16px + env(safe-area-inset-bottom)); max-width: calc(100vw - 24px); width: max-content; }
}
/* Narrow phones: the create button keeps only its icon, and the type badge
   drops under the name. */
@media (max-width: 400px) {
  .tools-toolbar-new-label { display: none; }
  .tools-toolbar-new { padding: 0 11px; }
  .tools-row { grid-template-areas: "avatar identity" "avatar type" "avatar summary"; grid-template-columns: 32px minmax(0, 1fr); }
  .tools-row > .tools-tile { height: 32px; width: 32px; }
}
`;

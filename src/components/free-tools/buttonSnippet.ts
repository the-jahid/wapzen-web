// Builds the copy-paste HTML for the WhatsApp chat button generator. The tool's
// live preview runs this same string in an iframe, so what people see is what
// they paste. Class names carry a wzwa- prefix so they don't clash with the
// host site's CSS.

export const WHATSAPP_GLYPH = "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z";

export const TOOL_URL = "https://wapzen.io/tools/whatsapp-button-generator";

export type ButtonOptions = {
  link: string;
  shape: "round" | "label";
  label: string;
  side: "right" | "left";
  color: string;
  popup: boolean;
  popupName: string;
  popupStatus: string;
  popupMessage: string;
  popupButton: string;
  credit: boolean;
};

const escape = (value: string) => value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c);

/** White or near-black text, whichever reads better on `hex`. */
export function textOn(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [n >> 16, (n >> 8) & 255, n & 255].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  // WhatsApp green (#25D366) keeps white text, as WhatsApp's own buttons do.
  return lum > 0.5 ? "#111b21" : "#ffffff";
}

export function buttonSnippet(o: ButtonOptions) {
  const color = /^#[0-9a-f]{6}$/i.test(o.color) ? o.color : "#25D366";
  const ink = textOn(color);
  const side = o.side;
  const label = o.shape === "label" && o.label.trim() ? `<span>${escape(o.label.trim())}</span>` : "";
  const icon = `<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="${WHATSAPP_GLYPH}"/></svg>`;
  const href = escape(o.link);

  const css = [
    `.wzwa{position:fixed;bottom:20px;${side}:20px;z-index:2147483000;font-family:system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif}`,
    `.wzwa-btn{display:flex;align-items:center;justify-content:center;gap:10px;box-sizing:border-box;height:56px;min-width:56px;padding:0 ${label ? "20px 0 16px" : "14px"};border:0;border-radius:28px;background:${color};color:${ink};font-family:inherit;font-size:15px;font-weight:600;line-height:1;text-decoration:none;box-shadow:0 6px 20px rgba(0,0,0,.22);cursor:pointer;transition:transform .2s}`,
    `.wzwa-btn:hover{transform:scale(1.05)}`,
    `.wzwa-btn svg{width:28px;height:28px;flex:none}`,
  ];
  if (o.popup) {
    css.push(
      `.wzwa-pop{display:none;position:absolute;bottom:70px;${side}:0;width:300px;max-width:calc(100vw - 40px);overflow:hidden;border-radius:16px;background:#fff;box-shadow:0 12px 40px rgba(0,0,0,.25)}`,
      `.wzwa.wzwa-open .wzwa-pop{display:block}`,
      `.wzwa-head{position:relative;padding:16px 44px 16px 16px;background:${color};color:${ink}}`,
      `.wzwa-head b{display:block;font-size:16px}`,
      `.wzwa-head small{display:block;margin-top:3px;font-size:12px;opacity:.85}`,
      `.wzwa-x{position:absolute;top:10px;right:10px;width:28px;height:28px;border:0;border-radius:50%;background:transparent;color:inherit;font-size:22px;line-height:1;cursor:pointer}`,
      `.wzwa-body{padding:18px 16px;background:#efeae2}`,
      `.wzwa-msg{display:inline-block;max-width:90%;padding:9px 12px;border-radius:0 10px 10px 10px;background:#fff;color:#111b21;font-size:14px;line-height:1.45;white-space:pre-line;box-shadow:0 1px 1px rgba(0,0,0,.1)}`,
      `.wzwa-go{display:flex;align-items:center;justify-content:center;gap:8px;margin:12px 16px;padding:11px;border-radius:999px;background:${color};color:${ink};font-size:14px;font-weight:600;text-decoration:none}`,
      `.wzwa-go svg{width:18px;height:18px}`,
      `.wzwa-by{display:block;margin:-4px 0 10px;text-align:center;font-size:11px;color:#8696a0;text-decoration:none}`,
    );
  }

  const lines = [`<!-- WhatsApp chat button. Free from ${TOOL_URL} -->`, `<style>${css.join("")}</style>`];
  if (!o.popup) {
    lines.push(`<div class="wzwa"><a class="wzwa-btn" href="${href}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">${icon}${label}</a></div>`);
    return lines.join("\n");
  }
  const status = o.popupStatus.trim() ? `<small>${escape(o.popupStatus.trim())}</small>` : "";
  const credit = o.credit ? `<a class="wzwa-by" href="${TOOL_URL}" target="_blank" rel="noopener">Free WhatsApp button by Wapzen</a>` : "";
  lines.push(
    `<div class="wzwa" id="wzwa">`,
    `<div class="wzwa-pop" id="wzwa-pop" role="dialog" aria-label="Chat on WhatsApp">`,
    `<div class="wzwa-head"><b>${escape(o.popupName.trim() || "Chat with us")}</b>${status}<button class="wzwa-x" type="button" aria-label="Close">&times;</button></div>`,
    `<div class="wzwa-body"><div class="wzwa-msg">${escape(o.popupMessage.trim() || "Hi there 👋 How can we help you?")}</div></div>`,
    `<a class="wzwa-go" href="${href}" target="_blank" rel="noopener">${icon}${escape(o.popupButton.trim() || "Start chat")}</a>`,
    credit,
    `</div>`,
    `<button class="wzwa-btn" type="button" aria-label="Chat on WhatsApp" aria-expanded="false" aria-controls="wzwa-pop">${icon}${label}</button>`,
    `</div>`,
    `<script>(function(){var w=document.getElementById("wzwa"),b=w.querySelector(".wzwa-btn");function s(o){w.classList.toggle("wzwa-open",o);b.setAttribute("aria-expanded",o?"true":"false")}b.addEventListener("click",function(){s(!w.classList.contains("wzwa-open"))});w.querySelector(".wzwa-x").addEventListener("click",function(){s(false)})})();</script>`,
  );
  return lines.filter(Boolean).join("\n");
}

/** A plain page around the snippet for the live preview. */
export function previewDocument(snippet: string, dark: boolean) {
  const bg = dark ? "#111418" : "#f6f7f9";
  const bar = dark ? "#262b33" : "#e3e6ea";
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0;min-height:100vh;background:${bg};font-family:system-ui,sans-serif}.l{margin:22px;display:grid;gap:12px}.l i{display:block;height:12px;border-radius:6px;background:${bar}}.l i:nth-child(1){width:40%;height:22px}.l i:nth-child(3){width:85%}.l i:nth-child(4){width:70%}.l i:nth-child(5){width:30%;height:90px;border-radius:12px}</style></head><body><div class="l"><i></i><i></i><i></i><i></i><i></i></div>${snippet}</body></html>`;
}

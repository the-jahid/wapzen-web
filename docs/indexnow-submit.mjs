// Tells Bing and the other IndexNow engines which URLs changed. ChatGPT search is
// widely reported to draw on Bing, and in October 2026 Bing showed no wapzen.io
// result for the brand, the home title or a site: query, so don't wait for a crawl.
// Run after a deploy, once public/46fbc3dc2f52d4ff449e0a899ae3826f.txt is live:
//   node docs/indexnow-submit.mjs            every URL in the live sitemap
//   node docs/indexnow-submit.mjs /de /it    only URLs under those prefixes
// Only sends public URLs, and takes no account or token. Docs: https://www.indexnow.org/documentation
const host = "wapzen.io";
const key = "46fbc3dc2f52d4ff449e0a899ae3826f";

const prefixes = process.argv.slice(2);
const sitemap = await (await fetch(`https://${host}/sitemap.xml`)).text();
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]).filter((url) => prefixes.length === 0 || prefixes.some((prefix) => new URL(url).pathname.startsWith(prefix)));

const check = await fetch(`https://${host}/${key}.txt`);
if (!check.ok || (await check.text()).trim() !== key) throw new Error(`The key file isn't live at https://${host}/${key}.txt yet. Deploy first.`);

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host, key, keyLocation: `https://${host}/${key}.txt`, urlList: urls }),
});
console.log(`Submitted ${urls.length} URLs: HTTP ${res.status}`, await res.text());

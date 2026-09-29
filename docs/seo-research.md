# Landing page SEO research

Last researched September 29, 2026 (first pass September 27; free/pricing pass the same day). Scope: English-language searches that match what Wapzen actually does: WhatsApp AI chat, AI voice calls (inbound and outbound), knowledge bases, API tools, and outbound campaigns.

## Method

[`seo-keyword-research.mjs`](seo-keyword-research.mjs) queried 298 phrases (74 feature seeds, A–Z expansions of 8 core seeds, and "how to / can / best / what is / is" question forms) against five autocomplete sources: Google US, Google India, Google UK, Bing and YouTube. That produced 3,726 unique suggestions.

Autocomplete gives no search volumes. Each suggestion is scored by its position (the top suggestion scores 10, the tenth scores 1), with direct seeds weighted 1 and expansions 0.6, and scores add up across sources and seeds. **Sources** is how many of the five engines suggested the phrase. A high score on 4–5 sources is the best available proxy for real demand. Scores rank phrases against each other and are not monthly searches. Confirm volumes with Keyword Planner or Search Console before building dedicated pages.

A SERP check (Sept 29) found that every ranking WhatsApp *voice* agent page (Telnyx, Synthflow, respond.io, Autocalls, Chakra) is built on Meta's WhatsApp Business Calling API. QR-linked chatbots exist (Chat Data, BuildShip), but QR-linked AI *calling* is rare. "No Business API" plus "auto-answer WhatsApp calls" is Wapzen's clearest differentiator in search.

## Results

| Phrase | Score | Sources | Where it is targeted |
| --- | --- | --- | --- |
| whatsapp ai agent free | 324 | 5/5 | Home title/description ("Free WhatsApp AI …"), hero, FAQ "Is Wapzen free?" |
| whatsapp chatbot free | 250 | 5/5 | `/free-whatsapp-chatbot` |
| ai calling agent india | 246 | 5/5 | Not targeted (English/global page; Hindi and Bengali named in the language FAQ) |
| whatsapp chatbot for business | 240 | 5/5 | Title, JSON-LD keywords, FAQ |
| whatsapp auto reply message | 229 | 5/5 | Hero copy, auto-reply use case, FAQ |
| whatsapp chatbot pricing | 203 | 4/5 | `/pricing` |
| whatsapp auto reply bot | 189 | 5/5 | Use case, FAQ, keywords |
| ai calling agent for real estate | 183 | 5/5 | Industries section: Real estate |
| how to auto answer whatsapp call | 165 | 3/5 | FAQ "Can AI auto-answer my WhatsApp calls?", feature card 02 |
| ai voice agent builder | 145 | 4/5 | Supporting copy (no-code builder) |
| whatsapp ai chatbot | 138 | 5/5 | Title, H1, feature cards, FAQ |
| what is ai calling | 137 | 3/5 | FAQ "What is an AI calling agent?" |
| whatsapp auto reply personal account | 134 | 4/5 | FAQ "Can I use WhatsApp auto-reply on a personal account?", use case |
| whatsapp ai agent | 123 | 5/5 | Description, hero eyebrow, FAQ, use cases |
| ai voice agent for customer service | 122 | 4/5 | Use case "AI customer service on WhatsApp" |
| whatsapp ai voice agent | 115 | 4/5 | Feature card 02, voice agent card, footer |
| ai calling agent | 97 | 5/5 | Title, H1, industries heading, FAQ |
| whatsapp chatbot builder | 92 | 5/5 | Workflow section, keywords |
| whatsapp chatbot for real estate | 70 | 5/5 | Industries: Real estate |
| whatsapp ai sales agent | 65 | 4/5 | Use case "AI sales agent for leads" |
| whatsapp ai calling | 61 | 3/5 | Hero, keywords |
| whatsapp chatbot without api | 50 | 4/5 | FAQ "Can I build a WhatsApp chatbot without the Business API?", hero |
| whatsapp ai receptionist / ai receptionist | 50 | 4–5/5 | Use case, clinics industry, FAQ |
| chatgpt on whatsapp / claude whatsapp | 47–50 | 5/5 | FAQ "Does Wapzen use ChatGPT or Claude?" |
| whatsapp chatbot for ecommerce / restaurants / dental clinic | 30–47 | 3–4/5 | Industries section |
| whatsapp ai caller | 31 | 4/5 | Keyword only |

Other clusters seen: `n8n whatsapp ai agent` (people self-building; a "no n8n needed" comparison post could target it), `interakt / aisensy / wati alternative` (commercial comparison intent; needs honest comparison pages, not landing copy), and `whatsapp auto reply message sample / setting` (how-to intent; a good fit for a free tool or blog post).

## Free and pricing cluster (Sept 29, second harvest)

Wapzen is free right now: there is no billing code, no per-user limits, and the AI keys are the platform's, so users never bring their own. A second run of the script (235 queries seeded with free, price, cost and trial phrasing) produced 1,320 phrases. The strongest:

| Phrase | Score | Sources | Page |
| --- | --- | --- | --- |
| how to make whatsapp chatbot for free | 766 | 5/5 | `/free-whatsapp-chatbot` (H2 is this exact question, with 5 steps) |
| is whatsapp chatbot free | 575 | 3/5 | `/pricing` FAQ, `/free-whatsapp-chatbot` FAQ |
| create whatsapp chatbot free | 398 | 5/5 | `/free-whatsapp-chatbot` |
| free whatsapp chatbot builder | 279 | 5/5 | `/free-whatsapp-chatbot` title |
| free ai phone agent | 277 | 4/5 | `/free-ai-calling-agent` |
| free ai calling agent | 261 | 5/5 | `/free-ai-calling-agent` title and H1 |
| cost of whatsapp chatbot | 234 | 3/5 | `/pricing` "What a WhatsApp chatbot costs" section |
| free ai calling assistant | 189 | 4/5 | `/free-ai-calling-agent` |
| free ai voice agent | 168 | 4/5 | `/free-ai-calling-agent` title |
| how to make ai calling agent for free | 124 | 4/5 | `/free-ai-calling-agent` (H2 is this exact question) |
| whatsapp chatbot is free or paid | 116 | 3/5 | `/pricing` FAQ |
| free ai chatbot for whatsapp business | 107 | 3/5 | `/free-whatsapp-chatbot` |
| free whatsapp ai agent | 102 | 5/5 | Home |
| whatsapp chatbot free trial | 84 | 3/5 | `/pricing` FAQ (no trial needed) |
| whatsapp chatbot pricing per month / price in india | 72 | 3/5 | `/pricing` |
| ai calling agent price in india / cost | 63–67 | 3–4/5 | `/pricing` FAQ |

Each page owns a distinct intent so they don't compete: home targets the product ("free WhatsApp AI agent"), `/free-whatsapp-chatbot` the chat how-to, `/free-ai-calling-agent` the voice how-to, and `/pricing` cost questions. The calling page states plainly that calls are WhatsApp calls, not regular phone lines. That keeps free-phone-agent searchers from being misled and supports the "no phone line, no per-minute fees" angle.

## Solution pages (Sept 29, third harvest)

A third run (189 queries) checked the remaining clusters. Each page below owns one intent and is registered in `src/lib/marketingPages.ts`, which feeds the sitemap, the footer's SOLUTIONS column, and each page's two "keep exploring" links (`related` prop).

| Page | Strongest phrases (score) | Notes |
| --- | --- | --- |
| `/whatsapp-auto-reply` | whatsapp auto reply message 293, …sample 232, …setting 210, …bot 189, …personal account 164 | WhatsApp Business setup steps, 10 copyable samples, away message vs AI comparison |
| `/ai-calling-agent-india` | ai voice calling agent india 242, ai calling agent india 131, …with indian number 72, …price in india 58 | Languages match the agent language list; COD confirmation use case |
| `/ai-calling-agent-for-real-estate` | …for real estate india 88, real estate ai agent 50, whatsapp chatbot for real estate 50 | Copyable agent script; leads can arrive via the API (`POST /v1/outbound-campaigns/{id}/leads`) |
| `/ai-receptionist` | ai receptionist for small business 171, what is ai receptionist 45, …cost 40, auto answer whatsapp call 49–54 | Also carries the auto-answer questions (mostly consumer phone-setting intent, too weak for a page of its own) |
| `/whatsapp-business-api-alternative` | whatsapp business api free 89, what is… 87, is it free 65, pricing 59, unofficial whatsapp api 50 | States plainly that Wapzen is not an official Meta product and that the API suits broadcasts at scale |
| `/whatsapp-ai-customer-service` | ai voice agent for customer service 122, ai customer service agent 50, whatsapp ai customer service 40 | "whatsapp customer service number" (people looking for WhatsApp's own support) is deliberately not targeted |

The home page's use-case and industry cards link to the matching pages ("Learn more"), which passes internal link weight from the strongest page.

Candidates not built yet: a ChatGPT/Claude-for-WhatsApp page (search intent is mostly consumer), an n8n comparison (`n8n whatsapp ai agent`, builder intent), and country pages (UK, Australia and Canada show up strongly in "ai receptionist" suggestions).

## USA, Brazil, Spain and Italy (Sept 29, fourth harvest)

Localized autocomplete: Google and YouTube with local `hl`/`gl` and `ie=utf-8&oe=utf-8` (without it, accents come back mangled). Bing's osjson ignores `mkt`/`setlang`/`cc` and returns a global mix, so it was only used for the US. Scores are lower than the English runs because there are fewer sources, and A–Z expansions return little in these languages.

| Market | Strongest phrases | Pages |
| --- | --- | --- |
| USA | ai answering service for small business 168, …for business 152, …free 114, …for restaurants 106, ai receptionist for law firm 59, whatsapp in usa 30, spanish chatbot 20 | `/ai-answering-service`, `/whatsapp-for-business-usa` |
| Brazil | chatbot whatsapp com ia 45, atendimento whatsapp com ia 31, resposta automática whatsapp business 30, ia para whatsapp business 29, ligação com ia 26, secretária virtual ia 20, sdr ia 20 | `/pt-br/chatbot-whatsapp-com-ia`, `/pt-br/ligacao-com-ia`, `/pt-br/resposta-automatica-whatsapp` |
| Spain | chatbot whatsapp gratis 46, chatbot whatsapp con ia 31, llamadas con ia 31, respuesta automática whatsapp business 30, recepcionista ia 20, chatbot para inmobiliarias 20 | `/es/chatbot-whatsapp-gratis`, `/es/llamadas-con-ia`, `/es/respuesta-automatica-whatsapp` |
| Italy | chatbot whatsapp gratis 40, assistente virtuale ai 28, ai whatsapp business 26, centralino ai 20, agente vocale ai 20, risposta automatica whatsapp 20, …solo per alcuni contatti 17 | `/it/chatbot-whatsapp-gratis`, `/it/centralino-ai`, `/it/risposta-automatica-whatsapp` |

How the translations are wired:
- Translated pages live under `src/app/pt-br`, `src/app/es` and `src/app/it`. Each folder's layout passes its locale to `PublicShell`, which translates the nav and footer and wraps the page in `<div lang>`, because `<html lang>` stays "en" from the root layout.
- UI strings live in `src/lib/locales.ts`. Every translated page sets `locale` on `MarketingPage`, `Samples` and `pageMetadata`.
- hreflang: each translated entry in `src/lib/marketingPages.ts` names its English page in `alternateOf`. `hreflangLinks()` builds the cluster (English plus translations, with English as x-default) for page metadata and the sitemap's `xhtml:link` alternates. Clusters: chatbot (/free-whatsapp-chatbot), calling (/free-ai-calling-agent), auto reply (/whatsapp-auto-reply). They were verified reciprocal on all 12 pages.
- hreflang values are `pt-BR`, `es` and `it`. `es` is language-level on purpose: the copy is written for Spain (móvil, ordenador, tú, €), but no other Spanish page exists, so it should also serve Latin America and US Spanish speakers.
- The footer's bottom row links each language's entry page (`localeHome`). SOLUTIONS lists only the current language's pages.
- The US pages are English, live in `(marketing)`, and have no hreflang. Most US "answering service" searchers want their phone line answered, so both pages say plainly that Wapzen answers WhatsApp, not landlines.

Not localized: the dashboard, the Clerk sign-up modal, the /tools pages, and the OG image (English text).

## What the landing page now targets

- **Title:** `Free WhatsApp AI Chatbot & AI Calling Agent for Business | Wapzen` (65 chars; Google may cut the brand, and the keywords come first).
- **Description:** leads with "Free WhatsApp AI agent for business" and names auto-reply, answering and making WhatsApp calls, and "No code, no Business API". The hero checks read "Free to use · No credit card · No Business API", and the CTAs say "Start free".
- **H1:** "WhatsApp AI chatbot. AI calling agents, too." The hero eyebrow reads "No-code WhatsApp AI agent for business".
- **Use cases:** "AI auto-reply on any number" replaces the generic industry card and targets personal-account auto-reply.
- **Industries section (`#industries`):** real estate, clinics and dental, e-commerce, restaurants, education, and travel and local services, all with honest wording. Anything beyond answering questions says it needs a connected API tool.
- **FAQ (16 questions, starting with "Is Wapzen free?"; one array feeds both the visible FAQ and the FAQPage JSON-LD):** adds auto-answering WhatsApp calls, what an AI calling agent is, a chatbot without the Business API, auto-reply on a personal account, and ChatGPT or Claude.
- **Structured data:** `SoftwareApplication` carries `isAccessibleForFree` and `offers` ($0, from `freeOffer` in `src/lib/marketingPages.ts`). Update it together with `/pricing` if paid plans arrive.
- **New pages** in `src/app/(marketing)/`, registered in `src/lib/marketingPages.ts` (which feeds the sitemap, the footer and the cross-links): `/pricing`, `/free-whatsapp-chatbot`, `/free-ai-calling-agent`. Each has WebPage, BreadcrumbList and FAQPage JSON-LD via `MarketingPage`.
- **Social previews:** all public subpages now use `pageMetadata()` (`src/lib/pageMetadata.ts`). Setting `openGraph` or `twitter` on a page replaces the root object, which had silently dropped the OG image and large Twitter card on every `/tools` page.
- **`public/llms.txt`:** mirrors the above, including a Pricing section, and lists every public page.

## Gaps (business decisions, not copy)

1. **Free is a current fact, not a promise.** Copy says "currently free" / "free right now", and the pricing FAQ says any future paid plans will be listed on `/pricing`. It never says "free forever" or "unlimited". If pricing changes, update `/pricing`, `freeOffer`, the home FAQ, the hero checks, and `llms.txt` together.
2. **India demand is large** (`ai calling agent india`, `… price in india`, `… hindi`). A dedicated India or Hindi page is the next content candidate if that market matters.
3. **Comparison intent** (`wati alternative`, `whatsapp business api alternative`) needs separate, factual comparison pages.

## Guardrails

- Keep claims matched to real features. Do not claim "free forever", "unlimited", paid prices, reviews, customer counts, native CRM or Shopify integrations, or guaranteed availability. Booking, order lookup and CRM actions only work through configured API tools.
- Do not claim what Meta's own apps can or cannot do beyond the stable fact that personal WhatsApp has no built-in auto-reply.
- [FAQ rich results are limited to government and health sites](https://developers.google.com/search/blog/2023/08/howto-faq-changes). The FAQ JSON-LD is for answer engines and entity clarity, not for stars or dropdowns in results.
- Google ignores the meta keywords tag. `siteConfig.keywords` feeds only the descriptive schema `keywords` field.

## After deployment

1. Set `NEXT_PUBLIC_SITE_URL` to the production origin (default `https://wapzen.io`). Keep staging private or noindexed.
2. Add `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` and `NEXT_PUBLIC_BING_SITE_VERIFICATION`, then rebuild.
3. In Search Console: verify ownership, submit `/sitemap.xml`, and request indexing of `/` after this change.
4. Check the deployed canonical, robots file, social image and structured data with URL Inspection and the Schema.org Validator.
5. After 4–6 weeks, compare non-branded queries in Search Console against the table above, and re-run the script to spot new phrasing.

Google references: [title links](https://developers.google.com/search/docs/appearance/title-link), [supported meta tags](https://developers.google.com/search/docs/crawling-indexing/special-tags), [sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap), [organization data](https://developers.google.com/search/docs/appearance/structured-data/organization).

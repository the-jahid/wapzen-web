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

## Blog topics (Oct 27, fifth harvest)

[`seo-blog-topic-research.mjs`](seo-blog-topic-research.mjs) scores ten candidate blog clusters (8–12 seeds each, same five sources and rank weighting, no A–Z expansion) so they can be compared before writing. Shared phrases such as "what is whatsapp chatbot" show up in several clusters, so judge a cluster by its own phrases, not the printed total.

| Cluster | Strongest phrases (score, sources) | Post |
| --- | --- | --- |
| What a chatbot is | what is whatsapp chatbot 170 (4/5), how whatsapp chatbot works 102, how does whatsapp chatbot work 99, whatsapp chatbot examples 45 | `/blog/what-is-a-whatsapp-chatbot` (hub: links to every post) |
| API pricing | whatsapp business api pricing 104 (5/5), …pricing india 94 (5/5), …cost 56, …cost per message 51, …charges 47 | `/blog/whatsapp-business-api-pricing` |
| ChatGPT on WhatsApp | chatgpt whatsapp number 99 (5/5), how to use / add chatgpt on whatsapp 50, chatgpt whatsapp number 2026 46 | `/blog/chatgpt-on-whatsapp` |
| n8n | n8n whatsapp chatbot 96 (5/5), n8n whatsapp bot 80, whatsapp ai agent n8n workflow 51, n8n whatsapp ai agent 48 | `/blog/n8n-whatsapp-ai-agent` |
| App vs API | whatsapp business vs whatsapp business api 83 (5/5), difference between… 63, whatsapp business app vs api 47 | `/blog/whatsapp-business-app-vs-api` |
| Bans | how to avoid whatsapp ban 50 (5/5), whatsapp business account banned 47, …solution 46, whatsapp temporarily banned 38 | Not built. Strong trust topic for linked-device users |
| Industries | whatsapp ordering system 50 (5/5), whatsapp appointment booking 50 (5/5), whatsapp ordering system free 36 | Built Oct 28 (see below): `/blog/whatsapp-food-ordering-system`, `/blog/whatsapp-appointment-booking` |
| Prompts | ai agent system prompt 41, chatbot prompt examples 40, ai voice agent prompt generator 39, customer service chatbot prompt 30 | Not built. A copyable prompt-template post converts well |
| Leads | ai sdr 50, speed to lead 48, ai lead qualification 40 | Not built. Generic SaaS terms, crowded |
| Auto answer | auto answer whatsapp call iphone 51, whatsapp voicemail 50 | Skipped: phone-setting consumer intent; `/ai-receptionist` carries it |

Blog strategy these posts follow:
- **Funnel coverage.** Explainers catch the high-volume questions (what is, pricing, ChatGPT); comparisons and guides convert. Every explainer ends at a free setup, and its `InlineCta` (in `components/blog/BlogPost.tsx`) sits right after the section that makes the case, not only at the bottom.
- **Hub and spokes.** The "what is" post links to every other post, and each new post links back to it and to one sibling. A new post should add a link from the hub.
- **Facts age.** Meta changes rates on 1 January, April, July, and October. Recheck the pricing post's table and worked examples then. The ChatGPT post's region status is still moving (EU case open, Brazil case open). The 1 October 2026 change (service replies charged after 1,000 a month per number) made older "service conversations are free" copy wrong; `/pricing` and `/whatsapp-business-api-alternative` were corrected the same day.

## Blog posts and a tool (Oct 28, sixth harvest)

Search Console's first day (Oct 27) showed impressions on comparison posts, `/free-whatsapp-chatbot`, the calling pages and `/tools`, and the first clicks on the chatbot-without-API guide and the QR code generator. Free tools and specific how-to posts get picked up quickly, so this round adds more of both.

[`seo-blog-tool-research.mjs`](seo-blog-tool-research.mjs) scores 12 blog clusters and 8 free-tool clusters, with the same five sources and rank weighting. A SERP check then ruled out candidates whose results are held by large vendors.

| Cluster | Strongest phrases (score, sources) | Page |
| --- | --- | --- |
| Calling API | whatsapp business calling api 98 (5/5), …pricing 75, whatsapp business calling 45 (5/5), whatsapp calling api pricing 40 | `/blog/whatsapp-business-calling-api` |
| Meta's AI agent | whatsapp business ai agent 96 (5/5), meta ai whatsapp business 56 (5/5), meta business ai 50 (5/5), …ai agent turn off 48 | `/blog/whatsapp-business-ai-agent` |
| Food ordering | whatsapp food ordering system 105 (5/5), whatsapp ordering system free 76, whatsapp food ordering 71, how to take orders on whatsapp business 50 (5/5) | `/blog/whatsapp-food-ordering-system` |
| Booking | whatsapp appointment booking free 70, …bot 59, …system 51, whatsapp booking system / bot 50 (5/5), whatsapp appointment reminder 40 | `/blog/whatsapp-appointment-booking` |
| Greeting messages | whatsapp business greeting message example 76, …greeting message 68 (5/5), …welcome message example 56, …greeting message not working 54 | `/blog/whatsapp-business-greeting-message` |
| Text formatter (tool) | whatsapp text formatting 112 (5/5), …tricks 88 (5/5), whatsapp text formatter 74, whatsapp bold text 50 (5/5), whatsapp fancy text 47 (5/5), whatsapp font generator 40 | `/tools/whatsapp-text-formatter` |
| Marketing | whatsapp marketing strategy 109, whatsapp broadcast list 80 (5/5), whatsapp marketing tips 76 (5/5) | Not built: broadcasts need the API, and the SERP is crowded |
| Pricing calculator (tool) | whatsapp api pricing calculator 93, whatsapp message cost calculator 84 | Not built: respond.io, SleekFlow, Kommo and AiSensy own the SERP |
| Prompt generator (tool) | ai voice agent prompt generator 103, chatbot prompt generator 55, system prompt generator 50 (5/5) | Not built yet; a strong fit (users write agent prompts) for a later round |
| Widget (tool) | whatsapp chat widget for website free 60, add whatsapp to website 54 (5/5), whatsapp floating button 49 (5/5) | Not built yet |

Notes on these pages:
- **The formatter's SERP** is held by small vendor tool pages (whapi.cloud, flowgent, whautomate), the same tier as wapzen.io. The page covers the formatting cluster with the tool and the fancy-text cluster with Unicode fonts, and says plainly that Unicode letters are bad for screen readers.
- **The ordering and booking posts describe the product as it is:** chat agents don't see the customer's number (so the agent asks for one), aren't told today's date (so the availability API should return it), and get the first 3,000 characters of a tool's response. If any of that changes in the server, update both posts.
- **Meta Business Agent is moving fast.** The app's paid tiers weren't published, and the turn-off steps come from a third-party guide. Recheck both, and the Calling API's permission limits and country list, when Meta's quarterly changes land.

## Italian blog (Oct 28, seventh harvest)

[`seo-blog-it-research.mjs`](seo-blog-it-research.mjs) scores 11 Italian clusters against Google and YouTube (`hl=it&gl=it`, `ie/oe=utf-8`) and DuckDuckGo (`kl=it-it`). Bing is left out because it ignores the market. With three sources the scores run lower than in the English runs, so compare Italian clusters with each other, not with the English tables.

| Cluster | Strongest phrases (score, sources) | Post |
| --- | --- | --- |
| Costs | whatsapp business costo 30 (3/3), …costo italia 25, costo whatsapp business api 25, quanto costa whatsapp business api 20, whatsapp business è a pagamento 20 | `/it/blog/whatsapp-business-costo` (hreflang: API pricing post) |
| App vs normal | come usare whatsapp business 42, differenza tra whatsapp e whatsapp business 30 (3/3), whatsapp business vs whatsapp 30 (3/3), …a cosa serve 25, …o normale 20 | `/it/blog/differenza-whatsapp-whatsapp-business` (no English twin) |
| Chatbot | chatbot whatsapp business 56 (3/3), bot whatsapp 30 (3/3), chatbot whatsapp business gratis 29 (3/3), come creare un bot su whatsapp 20 | `/it/blog/chatbot-whatsapp-business` (hreflang: what-is post) |
| Automatic messages | messaggi automatici whatsapp business 39, programmare messaggi… 31, messaggio di benvenuto… 29, risposte rapide… 20, esempio messaggio di benvenuto… 19 | `/it/blog/messaggi-automatici-whatsapp-business` (hreflang: greeting post) |
| ChatGPT / Meta AI | chatgpt whatsapp numero 37, chatgpt whatsapp 30 (3/3), intelligenza artificiale whatsapp 30, meta ai whatsapp 30, come togliere meta ai da whatsapp 30 (3/3) | `/it/blog/chatgpt-whatsapp` (hreflang: ChatGPT post) |
| Competitors | spoki whatsapp 39 (3/3), spoki 30, callbell 30, wati whatsapp 30, spoki prezzi 28 | Not built. A Spoki/Callbell comparison is the next Italian candidate; check their price pages first |
| Bans | whatsapp bannato 30 (3/3), account whatsapp bloccato 29 (3/3), …per spam 20 | Not built |
| Broadcast | lista broadcast whatsapp 30 (3/3), …come funziona 27 (3/3), whatsapp marketing 30 | Not built: broadcasts need the API |

How the Italian blog is wired:
- Posts live in `src/app/it/blog/<slug>` and are registered in `src/lib/blogPosts.ts` with `locale: "it"`, plus `alternateOf` when an English post covers the same topic. `hreflangLinks()` now also reads blog posts and each language's blog index. The English twins list the Italian page automatically, and `/blog` and `/it/blog` are alternates.
- The fixed post text (byline, dates, FAQ heading, sources note, "keep reading", tags) comes from `ui.blog` in `src/lib/locales.ts`. A language gets a blog link in the nav and footer only when it has `ui.blog`. `/blog` shows English posts only (`postsIn("en")`). `/it/blog` is a plain grid, because five posts are too few for the bento.
- Facts that age:
  - Meta's EUR card for Italy changes every quarter. From 1 October 2026 it is €0.0658 for marketing and €0.0248 for utility, authentication and service. Two reprints agree; Meta's page wasn't readable as a table.
  - The ChatGPT timeline is still moving: Meta has appealed, and the EU case is open.
  - Italian outlets disagree on whether the +39 exemption kept ChatGPT working from January to July. The post says what the July coverage reported.

## Mexico and Brazil blogs (Oct 28, eighth harvest)

[`seo-blog-latam-research.mjs`](seo-blog-latam-research.mjs) `mx|br` scores 11 clusters per market. It uses Google and YouTube (`hl=es-419&gl=mx` or `hl=pt-BR&gl=br`, `ie/oe=utf-8`) and DuckDuckGo (`kl=mx-es`, `kl=br-pt`). The SERP check used DuckDuckGo's HTML results by region, but they rate-limit after about two queries, so the rest used web search. Topics whose results are held by big brands were dropped. That ruled out Brazil's "como vender pelo whatsapp", where Stone, SumUp, Mercado Pago and PagBank rank.

| Market | Cluster | Strongest phrases (score, sources) | Post |
| --- | --- | --- | --- |
| Mexico | Chatbot | chatbot para whatsapp business 34 (3/3), chatbot whatsapp business gratis 31, bot de whatsapp 30, chatbot con ia para whatsapp 30 | `/es-mx/blog/chatbot-para-whatsapp-business` (SERP: sendpulse, respond.io, kommo; no big sites) |
| Mexico | Selling | cómo vender por whatsapp business 44 (3/3), cómo vender por whatsapp 41, catálogo… 30, pedidos por whatsapp 30, tienda en whatsapp 30 | `/es-mx/blog/como-vender-por-whatsapp` |
| Mexico | Bookings | agendar citas por whatsapp 39 (3/3), …business 37, agenda whatsapp business 30, recordatorio de citas por whatsapp gratis 28 | `/es-mx/blog/agendar-citas-por-whatsapp` (SERP: small booking apps) |
| Mexico | Cost | whatsapp business es gratis 30 (3/3), …tiene costo 30, whatsapp business api costos 30, cuánto cuesta… 26 | `/es-mx/blog/whatsapp-business-precio` |
| Mexico | Messages | mensaje de bienvenida / de ausencia / respuestas rápidas / mensajes automáticos whatsapp business 30 each (3/3) | `/es-mx/blog/mensajes-automaticos-whatsapp-business` |
| Mexico | Not built | chatgpt en whatsapp gratis 30 (it doesn't work in Mexico since 15 Jan 2026), alternativas a manychat 30, leadsales precios 30, conmutador virtual 30 (a phone PBX, not ours) | |
| Brazil | Greeting | mensagem de saudação whatsapp business 47 (3/3), mensagem automática / de ausência… 30, respostas rápidas 29 | `/pt-br/blog/mensagem-de-saudacao-whatsapp-business` |
| Brazil | Is it paid | whatsapp business é pago ou gratuito 36 (3/3), …é pago 33, …pago 30, preço mensagem whatsapp api oficial 29 | `/pt-br/blog/whatsapp-business-e-pago` |
| Brazil | Bot | como criar um robô no whatsapp 30 (3/3), como fazer chatbot… 30, bot whatsapp 30, robô para whatsapp gratuito 29 | `/pt-br/blog/como-criar-robo-whatsapp` |
| Brazil | Scheduling | agendamento pelo whatsapp 30 (3/3), agenda whatsapp 30, agenda whatsapp business 26 | `/pt-br/blog/agendamento-pelo-whatsapp` (SERP: SleekFlow, WATI, AgendaPro) |
| Brazil | App vs normal | diferença entre whatsapp e whatsapp business 30, …ou normal 30, como usar… no pc 24, …em dois celulares 22 | `/pt-br/blog/diferenca-whatsapp-e-whatsapp-business` |
| Brazil | Not built | api whatsapp não oficial / z-api / evolution api 30 each (honesty risk: Wapzen is a linked device too), whatsapp banido 30, botconversa preço 27, disparo em massa 30 (broadcasts) | |

How these blogs are wired:
- Mexico is a new locale, `es-MX`, at `/es-mx`, with only a blog. Its footer lists Spain's Spanish pages through `locales["es-MX"].fallback` and `solutionsFor()`. Spain's label became "Español (España)".
- Brazil's blog is `/pt-br/blog`, beside the existing pt-BR marketing pages.
- `components/blog/LocaleBlogIndex.tsx` renders every non-English blog index (/it, /pt-br, /es-mx). The sitemap lists one index per locale that has `ui.blog`.
- hreflang clusters now span up to four languages, e.g. /blog/whatsapp-business-greeting-message ↔ it, es-MX and pt-BR.
- Mexican Spanish copy uses celular, lada, CLABE/SPEI, OXXO, 911 and "Configuración" for the iPhone settings tab. Brazil uses Pix, boleto, LGPD, SAMU 192 and "Ferramentas comerciais".
- Official-API provider lists name only vendors known to be official BSPs. Mexico: Kommo, ManyChat, Botmaker, Treble, WATI. Brazil: Blip, Zenvia, Umbler Talk. Leadsales, BotConversa and Digisac were left out because it is unclear whether they use the official API.

Facts that age:
- Meta's Mexico card from 1 Oct 2026 is published in USD and MXN. Marketing is US$0.0397 / MXN 0.7298, up from US$0.0305. Utility, authentication and service are US$0.0085 / MXN 0.1565.
- Brazil's BRL card: marketing R$ 0,3217; utility, authentication and service R$ 0,035.
- Brazil's paid "transmissão comercial" in the Business app costs R$ 0,3217 per delivered message. The free allowance isn't published. The common broadcast list (256 contacts, saved numbers only) is still free.
- Meta One launched 15 Sep 2026. Business plans: Essencial R$ 59, Avançado R$ 199, Expert R$ 599, Máximo R$ 1.999. These come from Meta's announcement.
- ChatGPT on WhatsApp: off in Mexico. In Brazil it is unclear (CADE dispute, Meta charges AI providers per message), so no Brazilian ChatGPT post was written.

## Industry blogs (Oct 30, ninth harvest)

[`seo-blog-industry-research.mjs`](seo-blog-industry-research.mjs) scores one cluster per industry (12–13 seeds each, same five sources and rank weighting as the English runs). Generic phrases such as "what is whatsapp chatbot" turn up in every cluster; judge each cluster by its own phrases. The SERPs are held by chatbot vendors' blogs (Gallabox, AiSensy, WATI, BotPenguin, QuickReply, Pabbly), the same tier as wapzen.io, plus freelancer listings.

| Cluster | Strongest phrases (score, sources) | Post |
| --- | --- | --- |
| Real estate | whatsapp chatbot for real estate 72 (5/5), whatsapp automation for real estate 71, ai chatbot for real estate 50 (5/5), real estate whatsapp marketing 40, real estate lead follow up system 39, …greeting message / …follow up schedule 24, …follow up scripts 21 | `/blog/whatsapp-chatbot-for-real-estate` (the how-to; `/ai-calling-agent-for-real-estate` stays the product page) |
| Clinics | ai receptionist for medical office 59, whatsapp chatbot for hospital 57, ai receptionist for dental office 55, …dental clinics 48, …clinics / whatsapp ai receptionist 40, whatsapp automation for clinics 37, ai front desk for medical office 24 | `/blog/whatsapp-ai-receptionist-for-clinics` |
| Ecommerce | whatsapp chatbot for ecommerce 71, whatsapp automation for ecommerce 67, whatsapp order status 55, woocommerce whatsapp order notification 47 (5/5), whatsapp order tracking 46, whatsapp abandoned cart shopify 40, abandoned cart whatsapp message 38, …template 34 | `/blog/whatsapp-chatbot-for-ecommerce` |
| Education | whatsapp chatbot for education 63, whatsapp for schools / for education 40, ai chatbot for school 39, whatsapp message for tuition classes 30, …sample 24, whatsapp chatbot for college 30, ai chatbot for school helpdesk 27 | `/blog/whatsapp-chatbot-for-education` |

What these posts commit to (keep them in step with the server):
- **"AI receptionist for medical office" is mostly phone-line intent.** The clinics post says plainly that Wapzen answers WhatsApp chats and calls, not a landline, and compares the two.
- **Wapzen can't start a chat by message.** Shipping notifications, cart reminders, fee reminders and announcements need Business API templates (or Channels and Communities for schools). The posts say so and quote Meta's categories: cart reminders are marketing even when requested, order and shipping updates are utility, and recalls that invite a new booking can be marketing.
- **Product limits the posts state:** the chat agent reads 1:1 text only (no voice notes, photos or groups) and has no per-chat takeover; the voice agent isn't told the lead's name or details; adding a lead dials at once; no redial; agents know today's date (since 2026-10-29); tool responses are cut at 3,000 characters.
- **Facts that age:** the HBR lead-response figures (2011 study), Baymard's 70.22% (50 studies, page updated 22 Sep 2025), and Meta's rates from the 1 Oct 2026 card, which the pricing post also uses.
- The same day, the English, Mexican and Brazilian booking posts were corrected: they said agents don't know today's date, which stopped being true on 2026-10-29.

## Playbook blogs (Oct 30, tenth harvest)

[`seo-blog-playbook-research.mjs`](seo-blog-playbook-research.mjs) scores five how-to clusters, with the same sources and weighting. The SERPs are vendor docs and blogs (Chatlayer, Kommunicate, Landbot, BotPenguin, Gallabox, WATI, Hyperleap), plus SaySimple, Rasayel and Qualimero for away messages. WhatsApp's own Help Center ranks for the away-message setup.

| Cluster | Strongest phrases (score, sources) | Post |
| --- | --- | --- |
| Handoff | whatsapp live chat support 44 (5/5), chatbot human handoff / chatbot to human handoff / live agent handoff / human takeover in chatbot / whatsapp live chat agent 30 | `/blog/whatsapp-chatbot-human-handoff` (the weakest cluster, but it's a trust topic) |
| Prompts | how to write a system prompt / ai agent instructions 50 (5/5), ai agent system prompt 48 (5/5), chatbot / system / ai agent prompt examples and ai receptionist prompt 40, ai agent instructions template 35 | `/blog/ai-agent-system-prompt-examples` |
| Knowledge base | chatbot knowledge base / ai knowledge base / rag chatbot / train ai on your own data 50 (5/5), knowledge base for chatbot / …examples / …best practices 40, faq chatbot 34 | `/blog/chatbot-knowledge-base` |
| Leads | whatsapp zoho crm integration 57, whatsapp crm integration / hubspot integration / lead qualification process / whatsapp lead generation 50 (5/5), whatsapp to google sheets 46 (5/5), lead qualification questions / bant questions 40 | `/blog/whatsapp-lead-qualification` |
| Away message | whatsapp business away message not working 105 (5/5), whatsapp away message example 73, whatsapp business away message 65 (5/5), whatsapp ai auto reply 50 (5/5), …not showing 42, whatsapp holiday message 40 | `/blog/whatsapp-away-message` (the strongest cluster this round) |

What these posts commit to (keep them in step with the server):
- **Handoff:** there is no per-chat pause. Closing a thread is bookkeeping, and pausing the agent stops it in every chat. A reply from the dashboard's Conversation tab joins the agent's history; a reply from the phone doesn't. `transfer_call` can't bridge a call. If a per-chat takeover ships, rewrite the post's "tools" table and Wapzen section.
- **Knowledge base:** the retrieval numbers come from `whatsapplogin/manager.go`: top 4 passages, 3,000 characters with titles, the query built from the message plus the last 4 messages. Chunks default to 2,000/400 characters. Files over 300,000 characters are refused, and there are no URL sources and no in-place edits.
- **Leads:** an `api_request` tool POSTs one flat JSON object of its parameters, so the post routes CRMs through a webhook automation. Don't name Zapier/Make action labels that weren't checked.
- **Away message:** setup and the internet-connection requirement come from WhatsApp's Help Center (the page renders client-side, so fetch tools see no text). Wapzen has no reply schedule. The title promises 30 examples.
- The same day, the hub's setup step stopped saying "pick a GPT or Claude model": chat agents have been locked to Claude Sonnet 4.6 since 2026-10-29. Other pages still say it (see the memory note on the model lock).

## European blogs (Oct 30, eleventh harvest)

One post per big European market, for businesses ready to buy. [`seo-blog-europe-research.mjs`](seo-blog-europe-research.mjs) takes a market (`uk|de|fr|es|nl`) and scores six buyer-intent clusters (prices, providers, GDPR, chatbots, AI phone answering, industries) against Google and YouTube (`hl/gl`, `ie/oe=utf-8`) and DuckDuckGo (`kl=`). Compare scores within a market, not across markets.

| Market | Strongest phrases (score, sources) | Post |
| --- | --- | --- |
| UK | ai receptionist for small business uk 45, ai receptionist uk 30 (3/3), ai phone answering service 27, virtual receptionist uk 20 | `/blog/ai-receptionist-uk` (English, no twin) |
| Germany | whatsapp business api kosten 37, …kostenpflichtig 36, whatsapp business kosten 30 (3/3), …api anbieter 20 | `/de/blog/whatsapp-business-api-kosten` (hreflang: API pricing post) |
| France | chatbot whatsapp business 55 (3/3), chatbot whatsapp gratuit 46 (3/3), bot whatsapp 30 (3/3), créer un chatbot whatsapp 18–24 | `/fr/blog/chatbot-whatsapp-business` (hreflang: what-is post) |
| Spain | recepcionista virtual 30 (3/3), agente de voz ia 30 (3/3), asistente telefónico ia 20, centralita virtual ia 20, secretaria virtual ia 19 | `/es/blog/recepcionista-virtual-ia` (no twin) |
| Netherlands | whatsapp business kosten 30 (3/3), whatsapp business api kosten 28, whatsapp zakelijk kosten 24, moet je betalen voor whatsapp business 10 | `/nl/blog/whatsapp-zakelijk-kosten` (hreflang: API pricing post) |

Not built, and why:
- **DE "ki telefonassistent"** (handwerk 48 3/3, arztpraxis 38, kosten 27): the biggest German buyer cluster, but searchers want their landline answered and Wapzen answers WhatsApp only. FR "agent vocal ia" / "standard téléphonique ia" has the same mismatch.
- **"whatsapp business dsgvo konform"** (42, 41, 34) and UK "is whatsapp gdpr compliant" (25, 20): strong, but an honest post needs Wapzen's own GDPR position (DPA/AVV, data location, AI subprocessors), which isn't documented. The pricing posts carry a short neutral GDPR note instead.
- **Spain chatbot cluster** (chatbot whatsapp business 55): `/es/chatbot-whatsapp-gratis` already targets it.

Wiring: de, fr and nl are new locales with a blog only (`fallback: "en"` puts the English solution pages in their footer; `LocaleBlogIndex` keeps English pages out of the index). Spain (`es`) gained `ui.blog` and `/es/blog`.

Facts that age (recheck each quarter, 1 Jan/Apr/Jul/Oct):
- Meta rates from 1 October 2026 (two reprints each): Germany €0.1131 marketing / €0.0456 utility, authentication and service; Netherlands €0.1323 / €0.0414; France €0.0712 / €0.0248; Spain €0.0585 / €0.0166; UK £0.0458 / £0.0159. Service is free for the first 1,000 a month per number.
- Providers, from their own pages on 30 Oct 2026: 360dialog €49/€99/€500 per number a month; Superchat Free €0, Basic €89, Professional €149, Advanced €299 a month (net, 12-month minimum); hellomateo on request (12-month minimum); Trengo Boost €299 (yearly) or €349 (monthly) for 10 users, Pro €499/€599; Landbot Professional WA €160 a month (yearly), 500 AI chats, then €0.10; Kanal €89, Scale with AI €149; IONOS AI Receptionist £9/£19/£29 + VAT; Moneypenny AI from £25; Connect Communications from £14.99 + VAT; Recepcionista.com €99/€199/€299 + IVA, €0.18 a minute extra. Secretaria.es (from €69) and Fonvirtual (from €150) come from Minute Call's comparison, not their own pages.
- UK National Living Wage £12.71 from April 2026 (GOV.UK). EU AI Act Article 50 (tell people they're talking to an AI) applies from 2 August 2026, untouched by the Digital Omnibus.
- Copy rule: chat agents have hidden reply caps, so these posts say "free to start" and "message us for high volume", and never list Wapzen at €0 a month as if it had no limits.

## European WhatsApp AI agent pages (Oct 31, twelfth harvest)

Goal: be found by ChatGPT and Claude in Italy, Germany and the rest of Europe for WhatsApp automation, chat and voice, without disturbing what already ranks. Everything here is additive: no existing URL, title, description or body text changed.

**What the research says about ChatGPT** (mostly vendor studies, so read the numbers as direction, not fact):

- [Peec AI](https://peec.ai/blog/chatgpt-searches-in-english-even-when-you-don-t), 10M+ searches: ChatGPT starts in the user's language, then adds English searches. 43% of fan-out queries for non-English prompts ran in English, and nearly 78% of those sessions added English research. So a country needs an English page as well as a native one. This is probably why the English India page travels.
- [Ahrefs](https://ahrefs.com/blog/why-chatgpt-cites-pages/), 1.4M prompts: titles matching the fan-out query are cited more (0.656 similarity for cited titles against 0.484 for non-cited), and natural-language URL slugs are cited more (89.78% against 81.11%). Hence plain slugs and titles that repeat the phrase.
- Third-party "best X" lists correlate with being recommended (r = +0.64 in one study of 95 brands). We can't write those ourselves.
- **Don't publish a "best X" list that ranks Wapzen first.** Sites doing this lost 29-49% of visibility in January and May 2026, sometimes across the whole domain ([Lily Ray](https://lilyraynyc.substack.com/p/why-calling-yourself-the-best-could)). Google hasn't confirmed an update aimed at it, but the risk lands on the pages that already rank. Use one-to-one comparisons that say where the rival wins. `/blog/wati-alternatives` is the old pattern: leave it alone, don't copy it.
- [OpenAI's crawler docs](https://developers.openai.com/api/docs/bots): OAI-SearchBot decides search inclusion, GPTBot doesn't. Both are allowed in `robots.ts`. The docs don't mention Bing; that ChatGPT draws on Bing is widely reported, not confirmed there.

**Demand** ([`seo-europe-ai-research.mjs`](seo-europe-ai-research.mjs), Google, YouTube and DuckDuckGo with hl/gl). "WhatsApp + agent" is the strongest phrase in every market, which is why it's the hub in each language. Compare scores within a market, not across markets.

| Market | Strongest phrases (score, 3/3 sources unless noted) | Page |
| --- | --- | --- |
| Germany | whatsapp business automatische antwort 39, whatsapp ki agent 35, whatsapp ki chatbot 34, whatsapp chatbot erstellen 30, ki voice agent 30, ki anrufe 30, whatsapp automatisierung 29, superchat alternative 20 (2/3), superchat kosten 20 (2/3) | `/de/whatsapp-ki-agent` and three more, `/de/blog/superchat-alternative` |
| Italy | chatbot ai whatsapp 30, centralino ai 30, agente ai whatsapp 29, chatbot ai whatsapp gratis 29 (2/3), spoki prezzi 28 (2/3), agente vocale ai 20 (2/3) | `/it/agente-ai-whatsapp`, `/it/blog/spoki-prezzi-alternative` |
| France | agent ia whatsapp 38, réponse automatique whatsapp business 38 (2/3), agent vocal ia 30, automatisation whatsapp 30, démarchage téléphonique ia 30 | `/fr/agent-ia-whatsapp` |
| Spain | agente de voz ia 40, agente ia whatsapp 39, agente ia whatsapp business 32, automatización whatsapp 30 | `/es/agente-ia-whatsapp` |
| Netherlands | whatsapp ai chatbot 51, whatsapp ai agent 50, ai voice agent 30, ai receptionist 30 | `/nl/whatsapp-ai-agent` |
| UK | whatsapp ai agent free 47, whatsapp automation 39, ai agent for whatsapp 39, best whatsapp automation tool 30, ai receptionist uk 30 | `/whatsapp-ai-agent-uk` |

**What was built:** a hub (`/whatsapp-ai-agent-europe`), six English country pages, five native agent pages paired to them by hreflang (new clusters, so existing heads didn't change), three more German pages twinned to `/free-whatsapp-chatbot`, `/free-ai-calling-agent` and `/whatsapp-auto-reply`, two comparisons, and `/de`, `/fr`, `/nl` and `/es` blogs holding the four posts restored from 9f3869c. Only the hub is in the English footer: the country pages carry `footer: false`, so the footers of the ranking pages grow by one link plus three languages.

**Doorway check:** each country page has its own Meta rates, vendors, sectors and calling law. Word 5-gram overlap between English country pages peaked at 30%, nearly all of it shared product facts. Keep it that way: a new country needs real local facts, or it isn't worth a page.

**Other changes:** `Content-Language` headers on translated paths, because the root `<html lang="en">` can't change per route and Bing is reported to weigh that signal above hreflang. `public/llms.txt` was only appended to. IndexNow: run `node docs/indexnow-submit.mjs` after a deploy.

**Bing, 31 Oct 2026:** scripted queries for `site:wapzen.io`, the brand and the exact home title returned no wapzen.io result in the US, India or Italy. Scripted results can differ from what people see, so check in Bing Webmaster Tools. No `msvalidate.01` tag is live. Brave's `site:` query returned none either.

**Facts that age** (recheck each quarter, 1 Jan/Apr/Jul/Oct, then bump `updated` on the page and in the registry):

- Meta from 1 October 2026, marketing / utility, authentication and paid service: DE €0.1131 / €0.0456; IT €0.0658 / €0.0248; FR €0.0712 / €0.0248; ES €0.0585 / €0.0166; NL €0.1323 / €0.0414; UK £0.0458 / £0.0159. The "5,000 replies" examples are 4,000 × the second rate: €182.40, €99.20, €99.20, €66.40, €165.60, £63.60.
- Vendors, own pages, 31 Oct 2026: Superchat Free, €89, €149, €299 net, 12-month minimum, 1 AI agent from Professional, 3 on Advanced, extra €49, EU servers, Frankfurt. Lime Connect (formerly Userlike) Free, Pro from €87 yearly or €105 monthly, 3 seats minimum, AI add-on from €99, official API via its FAQ. Spoki Free, Service/Marketing/Sales from €39/€79/€119 excl. VAT with 900 conversations (the same page also quotes lower entry prices), AI from prepaid credits, AI voice €0.030/min in and out, Meta Business Partner. Callbell €14/€18 per agent, bot builder add-on €59, ChatGPT on Enterprise, campaigns €0.02 per contact. Trengo Boost €299 yearly or €349 monthly, Pro €499 or €599, AI surcharge €0.25-0.30 per conversation, phone AI agent. Landbot Professional WA €160 yearly, 500 AI chats then €0.10. respond.io $79/$159/$279 yearly-billed ($99/$199/$349 monthly), AI from Growth. Wati $39/$79/$199 annual, Astra AI add-on.
- From the 30 Oct check, not rechecked: Kanal €89 and Scale €149, 360dialog €49/€99/€500, Recepcionista.com €99/€199/€299. Chatarmin's and ManyChat's pricing pages couldn't be read, so they aren't compared.
- Law, from the statute or regulator: § 7, § 7a (five years), § 20 UWG (€300,000 and €50,000); AI Act Art. 50(1) and 99(4), up to €15M or 3%, the lower for SMEs; Spain's Ley 11/2022 art. 66.1 a) and b); the ACM's telemarketing page, which also covers sole traders, VOFs and maatschappen; the Registro pubblico delle opposizioni and the Garante. The ICO's call guide says it's under review for the Data (Use and Access) Act, so no UK fine figure is quoted.
- France rests on agreeing secondary sources (Club des Juristes, Blog du Modérateur, Selectra) because economie.gouv.fr refused the fetcher. Check the exceptions in article L223-1 before relying on them. Spain's "atención personal directa" comes from Consumo Responde's summary of Ley 10/2025, not the law's text.
- Article 50(1) binds **providers**. Wapzen doesn't add an AI notice itself: the pages tell businesses to write it into the greeting.

**Unknown:** we can't see ChatGPT's own answers from here. Measure by asking it the page FAQs in each language, and check Search Console and Bing Webmaster Tools after 4-6 weeks. Off-site mentions are the part these pages can't supply: comparison sites, review sites and Reddit.

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

## WhatsApp QR code page (Oct 31)

Goal: make `/tools/whatsapp-qr-code-generator` the best page on the topic. Search Console had it at 41.5 for "whatsapp qr code logo" and 55.0 for "whatsapp qr generator", on 668 words. It's now about 4,000 words.

[`seo-qr-research.mjs`](seo-qr-research.mjs) scores 8 clusters with the same five sources and rank weighting as the other harvests:

| Phrase | Score | Sources | Section |
| --- | --- | --- | --- |
| qr code for whatsapp business | 204 | 5/5 | WhatsApp Business |
| whatsapp qr code generator with logo free | 203 | 4/5 | Title, H1, logo |
| whatsapp business qr code generator | 159 | 5/5 | WhatsApp Business |
| does whatsapp have qr code | 138 | 3/5 | Which code you need |
| whatsapp qr code generator with logo | 131 | 4/5 | Title, H1, logo |
| whatsapp qr code not working | 122 | 5/5 | Fix a code |
| whatsapp business qr code | 100 | 5/5 | WhatsApp Business |
| qr code generator with whatsapp logo | 92 | 4/5 | Logo: Meta's brand rules |
| add logo to qr code | 71 | 5/5 | Logo |
| whatsapp group qr code | 70 | 5/5 | Which code you need, FAQ |
| qr code minimum size for print | 59 | 4/5 | Print sizes |
| does whatsapp qr code expire | 57 | 3/5 | FAQ |

"does whatsapp have qr code" and "whatsapp qr code not working" weren't in the original brief. Both got sections because the scores justified them.

**Competitor check (5 pages reading 150 to 1,100 words):** all mention logos, but only one gives a number and none mentions error correction or the quiet zone. PNG and SVG are listed, never explained. None shows finished example codes, and none covers real troubleshooting or Meta's brand rules.

**Scan tests (Oct 31).** The generator's real builder, patched only to vary logo share, margin and error correction, rendered through sharp, then read by jsQR, ZXing (zxing-wasm) and ZBar (@undecaf/zbar-wasm). The harness lived in a session scratchpad and isn't in the repo. Rerun it before changing the numbers on the page.

- Matrix: 8 phone numbers × 3 message lengths × 2 dot styles × 4 copies (clean, blur, 11° tilt, skew) = 192 images per row. A pass means all three decoders read it.
- Logo width, level H: 15–24% 99.5%, 30% 99%, 35% 67%, 40% 32%, 45% 3%, 50% 0%. Level M: 15–20% 100%, 24% 64%, 30% 33%.
- Above 30% the result follows the message, not the logo size: at 35%, every no-message and short-message image passed and every long-message image failed.
- Logo style at 24% (2,688 images): solid shapes and the chat icon 99.5%, thin line art 79%, white line art on a solid circle 47%. jsQR and ZXing read everything; the whole drop is ZBar. The solid-circle fix was a guess and it made things worse.
- 48 images per check: #25D366 on white, jsQR 24; #075E54 on white, jsQR 48. Inverted: jsQR 48, ZXing 48, ZBar 0. No quiet zone on a dark flyer: ZXing 0, jsQR 7, ZBar 32.
- These are software decoders, not phones. The page says so.

**Example images** are served by `app/tools/whatsapp-qr-code-generator/examples/[file]/route.ts`, built from `components/free-tools/qrExamples.ts` by the generator itself, so they can't drift from its output. Each passing example read 63 of 63 times across 7 sizes and 3 copies; the 35% and 45% failure demos read 0 of 63. Examples use solid marks because the first line-art versions failed ZBar. Any new example has to be decoded the same way before the page's "all three decoders" line stays true.

**Not confirmed from a primary source:** the WhatsApp Business app's menu path comes from recent third-party guides, because the WhatsApp Help pages didn't load for the fetcher. Check it on a real phone, and check the live sample in the app. The link format for the Business app is left out of the page for the same reason.

**Internal links:** all 37 blog posts link here from the body text (22 English, 15 translated), with 17 anchor variations. Translated anchors are local-language and say the tool is in English. `updated` was left alone on those posts: only a link was added, and that date tells readers when the facts were checked.

## After deployment

1. Set `NEXT_PUBLIC_SITE_URL` to the production origin (default `https://wapzen.io`). Keep staging private or noindexed.
2. Add `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` and `NEXT_PUBLIC_BING_SITE_VERIFICATION`, then rebuild.
3. In Search Console: verify ownership, submit `/sitemap.xml`, and request indexing of `/` after this change.
4. Check the deployed canonical, robots file, social image and structured data with URL Inspection and the Schema.org Validator.
5. After 4–6 weeks, compare non-branded queries in Search Console against the table above, and re-run the script to spot new phrasing.

Google references: [title links](https://developers.google.com/search/docs/appearance/title-link), [supported meta tags](https://developers.google.com/search/docs/crawling-indexing/special-tags), [sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap), [organization data](https://developers.google.com/search/docs/appearance/structured-data/organization).

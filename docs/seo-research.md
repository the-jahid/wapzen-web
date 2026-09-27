# Landing page SEO research

Researched September 27, 2026. Scope: English-language business searches for Wapzen's existing chat, voice, knowledge-base, API-tool, and outbound-campaign features. No country-specific targeting was requested.

## Evidence and keyword priorities

Live Google autocomplete was checked with `client=firefox&hl=en` for the five seed queries below. Suggestions indicate search phrasing, not monthly volume, difficulty, or a reliable ranking of popularity. Location and time can change suggestions. We do not have Keyword Planner or Search Console volume data, so these are priorities by relevance and commercial intent, not claims about the most-searched keywords.

| Seed | Relevant suggestions observed | Page placement |
| --- | --- | --- |
| whatsapp chatbot | whatsapp chatbot for business; whatsapp chatbot ai; whatsapp chatbot automation; whatsapp chatbot builder | Title, main heading, setup section, feature copy |
| whatsapp ai chatbot | whatsapp ai chatbot; whatsapp ai chatbot for business | Primary topic in title, H1, description, chatbot section and FAQ |
| whatsapp automation | whatsapp automation tool; whatsapp automation for business | Hero eyebrow and features heading |
| whatsapp ai voice | whatsapp ai voice agent; whatsapp ai voice call; whatsapp ai voice bot | Secondary product topic in voice section, title, FAQs and footer |
| whatsapp auto reply | whatsapp auto reply bot; whatsapp auto reply ai; whatsapp auto reply chatbot | Chatbot explanation and auto-reply FAQ |

Autocomplete endpoints (repeatable, but results may change):

- [WhatsApp chatbot suggestions](https://suggestqueries.google.com/complete/search?client=firefox&hl=en&q=whatsapp%20chatbot)
- [WhatsApp AI chatbot suggestions](https://suggestqueries.google.com/complete/search?client=firefox&hl=en&q=whatsapp%20ai%20chatbot)
- [WhatsApp automation suggestions](https://suggestqueries.google.com/complete/search?client=firefox&hl=en&q=whatsapp%20automation)
- [WhatsApp AI voice suggestions](https://suggestqueries.google.com/complete/search?client=firefox&hl=en&q=whatsapp%20ai%20voice)
- [WhatsApp auto-reply suggestions](https://suggestqueries.google.com/complete/search?client=firefox&hl=en&q=whatsapp%20auto%20reply)

Search-result checks included `WhatsApp AI chatbot business automation`, `WhatsApp chatbot no code auto reply customer service`, and `WhatsApp AI voice agent inbound outbound business calls`. First-party pages such as [Matrix Weave's WhatsApp integration](https://www.matrixweave.com/integrations/whatsapp), [Chatyx's WhatsApp chatbot](https://chatyx.fr/chatbot-whatsapp), and [VoxLink's WhatsApp calling documentation](https://voxlink.ai/documentation/whatsapp/calling) corroborate the business chatbot and voice-call categories. They do not establish keyword volume or Wapzen's functionality.

Additional feature-led queries: no-code WhatsApp chatbot, WhatsApp AI receptionist, WhatsApp customer support automation, WhatsApp appointment booking, and outbound WhatsApp AI calls. These are useful supporting topics, not verified autocomplete matches from this sample.

Avoid targeting `free`, `pricing`, `GitHub`, chatbot phone numbers, voice changers, and voice translation on this page: some appeared in suggestions, but the current landing page does not satisfy that intent. Do not invent free plans, prices, reviews, customer counts, native CRM integrations, or guaranteed availability to target keywords.

## Implementation

- Make the main product phrase prominent in the visible H1, with natural supporting headings and useful explanations.
- Keep a concise title and description consistent across search and social metadata. Google may rewrite both; character counts do not guarantee display width.
- Preserve server-rendered content and one shared source for visible FAQs and FAQ JSON-LD.
- Link the Organization, WebSite, WebPage, SoftwareApplication and FAQ entities. No fabricated ratings or offers are included.
- Normalize the canonical origin across metadata, schema, sitemap and robots URLs.
- Keep only the public home page in the sitemap. Omit synthetic modification timestamps that change on unrelated builds.
- Add dashboard `noindex` metadata alongside the existing robots exclusion. Robots exclusion is not access control; blocked crawlers may not see `noindex`, and previously indexed URLs need separate removal handling.
- Retain the existing generated Open Graph image and social metadata. Remove the HTML meta-keywords field; Google ignores it. The short schema keyword list is descriptive only.

Google references: [title links](https://developers.google.com/search/docs/appearance/title-link), [supported meta tags](https://developers.google.com/search/docs/crawling-indexing/special-tags), [sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap), [organization data](https://developers.google.com/search/docs/appearance/structured-data/organization). [FAQ rich results are restricted to authoritative government and health sites](https://developers.google.com/search/blog/2023/08/howto-faq-changes); Wapzen should not expect an FAQ rich result. Software schema without real offers/reviews should not be presented as eligible for review stars.

## After deployment

1. Set `NEXT_PUBLIC_SITE_URL` to the actual public production origin (default: `https://wapzen.io`). Keep staging deployments private or noindexed through the hosting provider.
2. Add the owner's Google Search Console and Bing Webmaster verification values using the existing `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` and `NEXT_PUBLIC_BING_SITE_VERIFICATION` environment variables. Rebuild after changing public environment variables.
3. Verify ownership, submit `/sitemap.xml`, and inspect/request indexing of `/` in Search Console. These account actions were not performed as part of the code change.
4. Check the deployed canonical, HTTP status, robots file, social image, mobile layout, and structured data using Search Console URL Inspection and Schema.org Validator. Use real-user Core Web Vitals when enough data exists.
5. Measure non-branded impressions, queries, clicks, CTR and sign-ups after recrawling. Use country-specific Keyword Planner data to validate volume and Search Console to choose the next content pages. Ranking is not guaranteed by on-page changes.

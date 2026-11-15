import type { NextConfig } from "next";

// Blog posts removed on 2026-11-02 (duplicated another page's search, described
// features Wapzen doesn't have, or were in Irish for English searches) send
// visitors and search engines to the closest page that remains.
const removedPosts: Array<[string, string]> = [
  ["/blog/best-free-whatsapp-ai-chatbot-guide", "/free-whatsapp-chatbot"],
  ["/blog/whatsapp-order-tracking-bot", "/blog/whatsapp-order-taking-chatbot"],
  ["/blog/whatsapp-order-changes-cancellations", "/blog/whatsapp-order-taking-chatbot"],
  ["/blog/reduce-missed-whatsapp-orders", "/blog/whatsapp-order-taking-chatbot#missed-orders"],
  ["/blog/whatsapp-chatbot-ecommerce-ireland", "/whatsapp-ai-customer-service"],
  ["/blog/whatsapp-chatbot-travel-agencies-hotels-ireland", "/whatsapp-ai-customer-service"],
  ["/blog/whatsapp-booking-chatbot-salons-gyms-ireland", "/blog/whatsapp-appointment-booking"],
];

const nextConfig: NextConfig = {
  async redirects() {
    return removedPosts.map(([source, destination]) => ({ source, destination, permanent: true }));
  },
};

export default nextConfig;

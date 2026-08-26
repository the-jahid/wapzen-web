import { clerkMiddleware } from "@clerk/nextjs/server";

// Next.js 16 renamed the `middleware` file convention to `proxy`.
// Clerk v7 detects clerkMiddleware() from either file on Next 16+.
export default clerkMiddleware();

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

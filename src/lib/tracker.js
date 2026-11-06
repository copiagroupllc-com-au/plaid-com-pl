/**
 * tracker.js
 * Sends page + referrer to /api/track on every route change.
 * Deduplicates per page per session — one ping per page visit.
 */

const _sentPages = new Set();

export async function trackPageView(pathname) {
  if (_sentPages.has(pathname)) return;
  _sentPages.add(pathname);

  try {
    await fetch("/api/track", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        page:     pathname,
        referrer: document.referrer || "",
      }),
    });
  } catch {
    // never break the site over analytics
  }
}

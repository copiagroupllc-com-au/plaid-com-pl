/**
 * tracker.js
 * Collects standard browser/device information available from the
 * browser's own APIs and sends it to /api/track (Vercel serverless).
 * No fingerprinting, no canvas tricks, no invasive methods.
 */

// ── Browser detection ────────────────────────────────────────────────────────
function getBrowser() {
  const ua = navigator.userAgent;
  if (/Edg\//i.test(ua))         return "Edge";
  if (/OPR\/|Opera/i.test(ua))   return "Opera";
  if (/Chrome\//i.test(ua))      return "Chrome";
  if (/Firefox\//i.test(ua))     return "Firefox";
  if (/Safari\//i.test(ua))      return "Safari";
  return "Unknown";
}

// ── OS detection ─────────────────────────────────────────────────────────────
function getOS() {
  const ua = navigator.userAgent;
  if (/Windows NT 10\.0/i.test(ua)) return "Windows 10/11";
  if (/Windows/i.test(ua))          return "Windows";
  if (/iPhone|iPad|iPod/i.test(ua)) return "iOS";
  if (/Android/i.test(ua))          return "Android";
  if (/Mac OS X/i.test(ua))         return "macOS";
  if (/Linux/i.test(ua))            return "Linux";
  return "Unknown";
}

// ── Device type ───────────────────────────────────────────────────────────────
function getDevice() {
  const ua = navigator.userAgent;
  if (/Tablet|iPad/i.test(ua))                           return "Tablet";
  if (/Mobi|Android|iPhone|iPod|Windows Phone/i.test(ua)) return "Mobile";
  return "Desktop";
}

// ── Session ID ────────────────────────────────────────────────────────────────
function getSessionId() {
  let sid = sessionStorage.getItem("_plaid_sid");
  if (!sid) {
    sid = crypto.randomUUID();
    sessionStorage.setItem("_plaid_sid", sid);
  }
  return sid;
}

// ── Already sent this session? ────────────────────────────────────────────────
const _sentPages = new Set();

// ── Main export ───────────────────────────────────────────────────────────────
/**
 * Call this on every route change.
 * Sends one notification per unique page per browser session.
 */
export async function trackPageView(pathname) {
  // Deduplicate within the same session
  if (_sentPages.has(pathname)) return;
  _sentPages.add(pathname);

  const payload = {
    browser:  getBrowser(),
    os:       getOS(),
    device:   getDevice(),
    language: navigator.language || "Unknown",
    screen:   `${window.screen.width}×${window.screen.height}`,
    page:     pathname,
    referrer: document.referrer || "",
    session:  getSessionId(),
  };

  try {
    await fetch("/api/track", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(payload),
      // fire-and-forget — don't block the UI
    });
  } catch {
    // silently ignore — analytics should never break the site
  }
}

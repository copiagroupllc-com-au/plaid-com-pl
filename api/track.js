/**
 * POST /api/track
 * Receives visitor analytics from the frontend and sends a Telegram notification.
 * Runs as a Vercel serverless function — credentials never touch the browser.
 */

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID   = process.env.TELEGRAM_CHAT_ID;

// Simple in-memory rate limiter: max 1 notification per IP per 60 seconds
const seen = new Map();
const RATE_WINDOW_MS = 60_000;

function isRateLimited(ip) {
  const now = Date.now();
  const last = seen.get(ip) || 0;
  if (now - last < RATE_WINDOW_MS) return true;
  seen.set(ip, now);
  // Prevent unbounded growth
  if (seen.size > 5000) {
    const oldest = [...seen.entries()].sort((a, b) => a[1] - b[1]).slice(0, 1000);
    oldest.forEach(([k]) => seen.delete(k));
  }
  return false;
}

async function sendTelegram(text) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  const res  = await fetch(url, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id:    CHAT_ID,
      text,
      parse_mode: "HTML",
    }),
  });
  return res.ok;
}

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin",  "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")   return res.status(405).json({ error: "Method not allowed" });

  if (!BOT_TOKEN || !CHAT_ID) {
    return res.status(500).json({ error: "Telegram not configured" });
  }

  // Real IP (works behind Vercel's edge)
  const ip =
    (req.headers["x-forwarded-for"] || "").split(",")[0].trim() ||
    req.socket?.remoteAddress ||
    "Unknown";

  // Rate-limit by IP
  if (isRateLimited(ip)) {
    return res.status(429).json({ ok: false, reason: "rate_limited" });
  }

  const {
    browser  = "Unknown",
    os       = "Unknown",
    device   = "Unknown",
    language = "Unknown",
    page     = "/",
    referrer = "",
    screen   = "",
  } = req.body || {};

  // Geo lookup via ip-api.com (free, no key needed, non-commercial use)
  let country = "Unknown";
  let region  = "Unknown";
  let city    = "Unknown";
  try {
    const geo  = await fetch(`http://ip-api.com/json/${ip}?fields=country,regionName,city,status`, {
      signal: AbortSignal.timeout(3000),
    });
    const data = await geo.json();
    if (data.status === "success") {
      country = data.country   || "Unknown";
      region  = data.regionName || "Unknown";
      city    = data.city      || "Unknown";
    }
  } catch {
    // geo lookup failed — continue without it
  }

  const now = new Date().toUTCString();

  const message =
    `🌐 <b>NEW WEBSITE VISITOR</b>\n\n` +
    `🖥 <b>Browser:</b> ${browser}\n` +
    `💻 <b>OS:</b> ${os}\n` +
    `📱 <b>Device:</b> ${device}\n` +
    `🌍 <b>Country:</b> ${country}\n` +
    `📍 <b>Region:</b> ${region}\n` +
    `🏙 <b>City:</b> ${city}\n` +
    `🔗 <b>IP:</b> <code>${ip}</code>\n` +
    `📄 <b>Page:</b> ${page}\n` +
    (referrer ? `↩️ <b>Referrer:</b> ${referrer}\n` : "") +
    (screen   ? `🖥 <b>Screen:</b> ${screen}\n`     : "") +
    `🌐 <b>Language:</b> ${language}\n` +
    `⏰ <b>Time:</b> ${now}`;

  try {
    await sendTelegram(message);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Telegram send failed:", err.message);
    return res.status(500).json({ ok: false, error: err.message });
  }
}

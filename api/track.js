/**
 * POST /api/track
 * Visitor analytics → Telegram notification.
 * Vercel serverless function (CommonJS).
 */

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID   = process.env.TELEGRAM_CHAT_ID;

// In-memory rate limiter: 1 notification per IP per 60 s
const seen = new Map();
const RATE_MS = 60_000;

function isRateLimited(ip) {
  const now  = Date.now();
  const last = seen.get(ip) || 0;
  if (now - last < RATE_MS) return true;
  seen.set(ip, now);
  if (seen.size > 5000) {
    [...seen.entries()]
      .sort((a, b) => a[1] - b[1])
      .slice(0, 1000)
      .forEach(([k]) => seen.delete(k));
  }
  return false;
}

async function sendTelegram(text) {
  const res = await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
    {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: "HTML" }),
    }
  );
  const data = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(data));
  return data;
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin",  "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")   return res.status(405).json({ error: "Method not allowed" });

  if (!BOT_TOKEN || !CHAT_ID) {
    console.error("Telegram credentials missing");
    return res.status(500).json({ error: "Telegram not configured" });
  }

  const ip =
    (req.headers["x-forwarded-for"] || "").split(",")[0].trim() ||
    "Unknown";

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

  // Free geo lookup — no API key needed
  let country = "Unknown", region = "Unknown", city = "Unknown";
  try {
    const geo = await fetch(
      `http://ip-api.com/json/${ip}?fields=country,regionName,city,status`
    );
    const gd = await geo.json();
    if (gd.status === "success") {
      country = gd.country    || "Unknown";
      region  = gd.regionName || "Unknown";
      city    = gd.city       || "Unknown";
    }
  } catch (e) {
    console.warn("Geo lookup failed:", e.message);
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
};

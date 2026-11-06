/**
 * POST /api/track
 * Stores visit data in Upstash Redis + sends Telegram notification.
 * CommonJS — Vercel serverless.
 */

const { Redis } = require("@upstash/redis");

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID   = process.env.TELEGRAM_CHAT_ID;

const redis = new Redis({
  url:   process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Rate limiter: 1 Telegram notification per IP per 60s
const seen = new Map();
const RATE_MS = 60_000;
function isRateLimited(ip) {
  const now  = Date.now();
  const last = seen.get(ip) || 0;
  if (now - last < RATE_MS) return true;
  seen.set(ip, now);
  if (seen.size > 5000) {
    [...seen.entries()].sort((a, b) => a[1] - b[1]).slice(0, 1000).forEach(([k]) => seen.delete(k));
  }
  return false;
}

async function sendTelegram(text) {
  const res = await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
    {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: "HTML" }),
    }
  );
  const data = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(data));
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin",  "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")   return res.status(405).json({ error: "Method not allowed" });

  const ip =
    (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "Unknown";

  const { page = "/", referrer = "" } = req.body || {};

  // Geo lookup
  let country = "Unknown", region = "Unknown", city = "Unknown";
  let lat = null, lon = null;
  try {
    const geo = await fetch(
      `http://ip-api.com/json/${ip}?fields=country,regionName,city,lat,lon,status`
    );
    const gd = await geo.json();
    if (gd.status === "success") {
      country = gd.country    || "Unknown";
      region  = gd.regionName || "Unknown";
      city    = gd.city       || "Unknown";
      lat     = gd.lat;
      lon     = gd.lon;
    }
  } catch (e) {
    console.warn("Geo lookup failed:", e.message);
  }

  const now      = Date.now();
  const todayKey = new Date().toISOString().slice(0, 10);

  // Store in Redis
  try {
    const pipeline = redis.pipeline();
    pipeline.incr("stats:total");
    pipeline.incr(`stats:daily:${todayKey}`);
    pipeline.expire(`stats:daily:${todayKey}`, 60 * 60 * 24 * 90);
    pipeline.hincrby("stats:countries", country, 1);
    pipeline.hincrby("stats:pages", page, 1);
    if (lat && lon) {
      pipeline.lpush("stats:geo", JSON.stringify({ lat, lon, country, city, ts: now }));
      pipeline.ltrim("stats:geo", 0, 499);
    }
    await pipeline.exec();
  } catch (e) {
    console.error("Redis write failed:", e.message);
  }

  // Telegram notification
  if (!isRateLimited(ip) && BOT_TOKEN && CHAT_ID) {
    const message =
      `🌐 <b>NEW WEBSITE VISITOR</b>\n\n` +
      `🌍 <b>Country:</b> ${country}\n` +
      `📍 <b>Region:</b> ${region}\n` +
      `🏙 <b>City:</b> ${city}\n` +
      `🔗 <b>IP:</b> <code>${ip}</code>\n` +
      `📄 <b>Page:</b> ${page}\n` +
      (referrer ? `↩️ <b>Referrer:</b> ${referrer}\n` : "") +
      `⏰ <b>Time:</b> ${new Date(now).toUTCString()}`;
    try { await sendTelegram(message); } catch (e) {
      console.error("Telegram failed:", e.message);
    }
  }

  return res.status(200).json({ ok: true });
};

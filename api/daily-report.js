/**
 * GET /api/daily-report
 * Sends a daily statistics summary to Telegram.
 * Called automatically by Vercel Cron every day at 08:00 UTC.
 * Can also be triggered manually by calling the endpoint with the CRON_SECRET.
 * CommonJS — Vercel serverless.
 */

const { Redis } = require("@upstash/redis");

const BOT_TOKEN   = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID     = process.env.TELEGRAM_CHAT_ID;
const CRON_SECRET = process.env.CRON_SECRET;

const redis = new Redis({
  url:   process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

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
  return data;
}

module.exports = async function handler(req, res) {
  // Allow GET from Vercel Cron (which sends the CRON_SECRET as a header)
  // or manual trigger with ?secret=xxx
  const authHeader = req.headers["authorization"] || "";
  const secret     = req.query.secret || authHeader.replace("Bearer ", "").trim();

  if (CRON_SECRET && secret !== CRON_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!BOT_TOKEN || !CHAT_ID) {
    return res.status(500).json({ error: "Telegram not configured" });
  }

  try {
    const todayKey     = new Date().toISOString().slice(0, 10);
    const yesterdayKey = (() => {
      const d = new Date();
      d.setDate(d.getDate() - 1);
      return d.toISOString().slice(0, 10);
    })();

    // Pull all stats in one pipeline
    const pipeline = redis.pipeline();
    pipeline.get("stats:total");
    pipeline.get(`stats:daily:${todayKey}`);
    pipeline.get(`stats:daily:${yesterdayKey}`);
    pipeline.hgetall("stats:countries");
    pipeline.hgetall("stats:pages");

    // Last 7 days
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().slice(0, 10));
      pipeline.get(`stats:daily:${d.toISOString().slice(0, 10)}`);
    }

    const results = await pipeline.exec();
    const [total, today, yesterday, countries, pages, ...dailyRaw] = results;

    // Sort countries and pages
    const sortObj = (obj) =>
      Object.entries(obj || {})
        .map(([k, v]) => ({ name: k, count: parseInt(v, 10) }))
        .sort((a, b) => b.count - a.count);

    const topCountries = sortObj(countries).slice(0, 5);
    const topPages     = sortObj(pages).slice(0, 5);

    // Build 7-day chart as text bars
    const weekChart = days.map((date, i) => {
      const count = parseInt(dailyRaw[i] || 0, 10);
      const bars  = "█".repeat(Math.min(Math.round((count / (parseInt(today, 10) || 1)) * 10), 10)) || "░";
      return `  ${date.slice(5)}  ${bars}  ${count}`;
    }).join("\n");

    // Trend arrow
    const todayN     = parseInt(today     || 0, 10);
    const yesterdayN = parseInt(yesterday || 0, 10);
    const trend = todayN > yesterdayN ? "📈" : todayN < yesterdayN ? "📉" : "➡️";

    const topCountriesText = topCountries.length
      ? topCountries.map((c, i) => `  ${i + 1}. ${c.name} — ${c.count}`).join("\n")
      : "  No data yet";

    const topPagesText = topPages.length
      ? topPages.map((p, i) => `  ${i + 1}. ${p.name} — ${p.count}`).join("\n")
      : "  No data yet";

    const now = new Date().toUTCString();

    const message =
      `📊 <b>DAILY WEBSITE REPORT</b>\n` +
      `<i>${todayKey}</i>\n\n` +

      `<b>Overview</b>\n` +
      `🌐 Total visits (all time): <b>${parseInt(total || 0, 10).toLocaleString()}</b>\n` +
      `📅 Today: <b>${todayN}</b> ${trend}\n` +
      `📅 Yesterday: <b>${yesterdayN}</b>\n\n` +

      `<b>Last 7 Days</b>\n` +
      `<code>${weekChart}</code>\n\n` +

      `<b>Top Countries</b>\n` +
      `${topCountriesText}\n\n` +

      `<b>Top Pages</b>\n` +
      `${topPagesText}\n\n` +

      `⏰ <i>Generated: ${now}</i>`;

    await sendTelegram(message);

    return res.status(200).json({ ok: true, sent: now });
  } catch (e) {
    console.error("Daily report failed:", e.message);
    return res.status(500).json({ ok: false, error: e.message });
  }
};

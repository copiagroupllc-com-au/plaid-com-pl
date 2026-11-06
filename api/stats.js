/**
 * GET /api/stats
 * Returns analytics data for the admin dashboard.
 * Protected by ADMIN_TOKEN env var.
 * CommonJS — Vercel serverless.
 */

const { Redis } = require("@upstash/redis");

const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

const redis = new Redis({
  url:   process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin",  "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET")    return res.status(405).json({ error: "Method not allowed" });

  // Token auth
  const token =
    req.query.token ||
    (req.headers.authorization || "").replace("Bearer ", "").trim();
  if (ADMIN_TOKEN && token !== ADMIN_TOKEN) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const todayKey = new Date().toISOString().slice(0, 10);

    const pipeline = redis.pipeline();
    pipeline.get("stats:total");
    pipeline.get(`stats:daily:${todayKey}`);
    pipeline.hgetall("stats:countries");
    pipeline.hgetall("stats:pages");
    pipeline.lrange("stats:geo", 0, 499);

    // Last 30 days
    const days = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      days.push(key);
      pipeline.get(`stats:daily:${key}`);
    }

    const results = await pipeline.exec();
    const [total, todayCount, countries, pages, geoRaw, ...dailyRaw] = results;

    const geo = (geoRaw || []).map(r => {
      try { return typeof r === "string" ? JSON.parse(r) : r; }
      catch { return null; }
    }).filter(Boolean);

    const daily = days.map((date, i) => ({
      date,
      count: parseInt(dailyRaw[i] || 0, 10),
    }));

    const sortObj = (obj) =>
      Object.entries(obj || {})
        .map(([k, v]) => ({ name: k, count: parseInt(v, 10) }))
        .sort((a, b) => b.count - a.count);

    return res.status(200).json({
      total:     parseInt(total     || 0, 10),
      today:     parseInt(todayCount || 0, 10),
      countries: sortObj(countries),
      pages:     sortObj(pages),
      daily,
      geo,
      generated: new Date().toISOString(),
    });
  } catch (e) {
    console.error("Stats fetch failed:", e.message);
    return res.status(500).json({ error: e.message });
  }
};

/**
 * GET /api/stats
 * Returns aggregated analytics data for the admin dashboard.
 * Protected by a simple admin token.
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

  // Simple token auth — send as ?token=xxx or Authorization: Bearer xxx
  const token =
    req.query.token ||
    (req.headers.authorization || "").replace("Bearer ", "").trim();

  if (ADMIN_TOKEN && token !== ADMIN_TOKEN) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const todayKey = new Date().toISOString().slice(0, 10);

    // Fetch everything in one pipeline
    const pipeline = redis.pipeline();
    pipeline.get("stats:total");
    pipeline.get(`stats:daily:${todayKey}`);
    pipeline.hgetall("stats:browsers");
    pipeline.hgetall("stats:os");
    pipeline.hgetall("stats:devices");
    pipeline.hgetall("stats:countries");
    pipeline.hgetall("stats:pages");
    pipeline.lrange("stats:recent", 0, 49);  // last 50 visits
    pipeline.lrange("stats:geo",    0, 499); // last 500 geo points

    // Last 30 days counters
    const days = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      days.push(key);
      pipeline.get(`stats:daily:${key}`);
    }

    const results = await pipeline.exec();

    const [
      total, todayCount,
      browsers, os, devices, countries, pages,
      recentRaw, geoRaw,
      ...dailyRaw
    ] = results;

    // Parse recent visits
    const recent = recentRaw.map(r => {
      try { return typeof r === "string" ? JSON.parse(r) : r; }
      catch { return null; }
    }).filter(Boolean);

    // Parse geo points
    const geo = geoRaw.map(r => {
      try { return typeof r === "string" ? JSON.parse(r) : r; }
      catch { return null; }
    }).filter(Boolean);

    // Build daily chart data
    const daily = days.map((date, i) => ({
      date,
      count: parseInt(dailyRaw[i] || 0, 10),
    }));

    // Sort breakdowns by value desc
    const sortObj = (obj) =>
      Object.entries(obj || {})
        .map(([k, v]) => ({ name: k, count: parseInt(v, 10) }))
        .sort((a, b) => b.count - a.count);

    return res.status(200).json({
      total:     parseInt(total    || 0, 10),
      today:     parseInt(todayCount || 0, 10),
      browsers:  sortObj(browsers),
      os:        sortObj(os),
      devices:   sortObj(devices),
      countries: sortObj(countries),
      pages:     sortObj(pages),
      daily,
      recent,
      geo,
      generated: new Date().toISOString(),
    });
  } catch (e) {
    console.error("Stats fetch failed:", e.message);
    return res.status(500).json({ error: e.message });
  }
};

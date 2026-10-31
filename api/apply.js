/**
 * POST /api/apply
 * Job application → Telegram notification.
 * Vercel serverless function (CommonJS).
 */

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID   = process.env.TELEGRAM_CHAT_ID;

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

  const {
    firstName = "",
    lastName  = "",
    email     = "",
    phone     = "",
    linkedin  = "",
    role      = "General Application",
  } = req.body || {};

  if (!firstName || !email) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const now = new Date().toUTCString();

  const message =
    `📋 <b>NEW JOB APPLICATION</b>\n\n` +
    `👤 <b>Name:</b> ${firstName} ${lastName}\n` +
    `📧 <b>Email:</b> ${email}\n` +
    `📞 <b>Phone:</b> ${phone || "—"}\n` +
    `🔗 <b>LinkedIn:</b> ${linkedin || "—"}\n` +
    `💼 <b>Role:</b> ${role}\n` +
    `⏰ <b>Time:</b> ${now}`;

  try {
    await sendTelegram(message);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Telegram send failed:", err.message);
    return res.status(500).json({ ok: false, error: err.message });
  }
};

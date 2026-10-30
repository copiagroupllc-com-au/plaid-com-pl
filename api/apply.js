/**
 * POST /api/apply
 * Receives job application data and sends a Telegram notification.
 * Only fires with data the applicant explicitly typed and submitted.
 */

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID   = process.env.TELEGRAM_CHAT_ID;

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

  const {
    firstName = "",
    lastName  = "",
    email     = "",
    phone     = "",
    linkedin  = "",
    role      = "General Application",
  } = req.body || {};

  // Basic validation — all provided by the applicant voluntarily
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
}

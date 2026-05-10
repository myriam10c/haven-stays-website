/**
 * POST /api/lead
 *
 * Receives an estimation lead from /estimation.html, saves it to Supabase
 * (table public.hs_estimations), and fans out notifications:
 *   - Email primary  : hillal@medini-homes.com  (via Formsubmit)
 *   - Email cc       : admin@medini-homes.com   (via Formsubmit second hit)
 *   - Telegram       : CEO channel via bot token in env
 *
 * Env vars (set in Vercel project settings) :
 *   SUPABASE_URL                 (e.g. https://mtfhbxeaiqhveuernkfn.supabase.co)
 *   SUPABASE_ANON_KEY            (anon key, RLS allows anon insert)
 *   TELEGRAM_BOT_TOKEN           (BotFather token)
 *   TELEGRAM_CHAT_ID             (CEO channel id)
 *   FORMSUBMIT_PRIMARY_EMAIL     (default hillal@medini-homes.com)
 *   FORMSUBMIT_CC_EMAIL          (default admin@medini-homes.com)
 *
 * Returns 200 with { ok: true, id } on success. The widget is forgiving :
 * even if Telegram or one email channel fails, we still return ok if the
 * Supabase insert succeeded.
 */

const SUPABASE_URL = process.env.SUPABASE_URL || "https://mtfhbxeaiqhveuernkfn.supabase.co";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "";

const TG_BOT = process.env.TELEGRAM_BOT_TOKEN || "";
const TG_CHAT = process.env.TELEGRAM_CHAT_ID || "";

const EMAIL_PRIMARY = process.env.FORMSUBMIT_PRIMARY_EMAIL || "hillal@medini-homes.com";
const EMAIL_CC      = process.env.FORMSUBMIT_CC_EMAIL      || "admin@medini-homes.com";

const fmtMad = n => (Number(n) || 0).toLocaleString("fr-FR") + " MAD";

function sanitize(payload) {
  // Whitelist + basic length caps to prevent abuse
  const cap = (v, n) => (typeof v === "string" ? v.slice(0, n) : v);
  return {
    full_name:          cap(payload.full_name, 120),
    email:              cap(payload.email, 200),
    phone:              cap(payload.phone, 40),
    message:            cap(payload.message, 1000),
    zone:               cap(payload.zone, 40),
    property_type:      cap(payload.property_type, 20),
    bedrooms:           Number(payload.bedrooms) || null,
    amenities:          Array.isArray(payload.amenities) ? payload.amenities.slice(0, 30) : [],
    adr_base_mad:       Number(payload.adr_base_mad) || null,
    adr_effective_mad:  Number(payload.adr_effective_mad) || null,
    amenity_multiplier: Number(payload.amenity_multiplier) || null,
    nights_per_year:    Number(payload.nights_per_year) || null,
    low_annual_mad:     Number(payload.low_annual_mad) || null,
    med_annual_mad:     Number(payload.med_annual_mad) || null,
    high_annual_mad:    Number(payload.high_annual_mad) || null,
    charges_mo_mad:     Number(payload.charges_mo_mad) || null,
    loyer_mo_mad:       Number(payload.loyer_mo_mad) || null,
    prix_achat_mad:     Number(payload.prix_achat_mad) || null,
  };
}

async function insertSupabase(row, ua) {
  // Generate id client-side so we don't need SELECT permission to return it.
  const id = (typeof crypto !== "undefined" && crypto.randomUUID)
    ? crypto.randomUUID()
    : null;
  const body = { ...row, user_agent: ua };
  if (id) body.id = id;

  const r = await fetch(`${SUPABASE_URL}/rest/v1/hs_estimations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_ANON_KEY,
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
      "Prefer": "return=minimal",
    },
    body: JSON.stringify(body),
  });
  if (!r.ok) {
    const t = await r.text();
    throw new Error(`Supabase insert failed: ${r.status} ${t.slice(0, 200)}`);
  }
  return id;
}

function htmlEsc(s) {
  return String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

async function sendTelegram(row) {
  if (!TG_BOT || !TG_CHAT) return { ok: false, reason: "missing env vars" };
  const amen = (row.amenities || []).join(", ") || "—";
  // HTML mode — no underscore-as-italic issues with amenity keys like private_pool
  const txt = [
    "🏡 <b>Nouveau lead Havn Stays</b>",
    "",
    `<b>${htmlEsc(row.full_name || "(sans nom)")}</b>`,
    `📧 ${htmlEsc(row.email || "—")}`,
    `📱 ${htmlEsc(row.phone || "—")}`,
    "",
    `📍 <b>Zone:</b> ${htmlEsc(row.zone || "—")}`,
    `🛏 <b>Type:</b> ${htmlEsc(row.property_type || "—")} · ${row.bedrooms ?? "?"} ch`,
    `✨ <b>Amenities:</b> ${htmlEsc(amen)}`,
    "",
    `💰 <b>ADR effective:</b> ${fmtMad(row.adr_effective_mad)} / nuit`,
    `📊 <b>Estimation annuelle brut:</b>`,
    `   • LOW    : ${fmtMad(row.low_annual_mad)}`,
    `   • MEDIUM : ${fmtMad(row.med_annual_mad)}`,
    `   • HIGH   : ${fmtMad(row.high_annual_mad)}`,
    row.message ? "" : null,
    row.message ? `💬 <i>${htmlEsc(row.message)}</i>` : null,
  ].filter(s => s !== null).join("\n");

  try {
    const r = await fetch(`https://api.telegram.org/bot${TG_BOT}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TG_CHAT,
        text: txt,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });
    if (r.ok) return { ok: true };
    const errText = await r.text();
    return { ok: false, reason: `tg ${r.status}: ${errText.slice(0,180)}` };
  } catch (e) {
    return { ok: false, reason: "tg exception: " + String(e).slice(0,120) };
  }
}

function buildAutoresponse(row) {
  const name = (row.full_name || "").split(" ")[0] || "";
  const lines = [
    `Bonjour${name ? " " + name : ""},`,
    "",
    "Merci pour votre demande d'estimation. Voici votre projection annuelle :",
    "",
    `  • Bien            : ${row.property_type || "—"} · ${row.bedrooms ?? "?"} chambres · ${row.zone || "—"}`,
    `  • ADR effective   : ${fmtMad(row.adr_effective_mad)} / nuit`,
    `  • Revenue brut LOW    (conservateur) : ${fmtMad(row.low_annual_mad)} / an`,
    `  • Revenue brut MEDIUM (réaliste)     : ${fmtMad(row.med_annual_mad)} / an`,
    `  • Revenue brut HIGH   (optimiste)    : ${fmtMad(row.high_annual_mad)} / an`,
    "",
    "Cette estimation est basée sur 384 comparables Airbnb (mai 2026) et les amenities que vous avez indiquées.",
    "",
    "Un expert Havn Stays vous contacte sous 24h pour :",
    "  – affiner l'estimation avec votre adresse exacte et vos photos",
    "  – définir le calendrier optimal de tarification (saisonnalité, événements)",
    "  – présenter notre approche de gestion (commissions, services, garanties)",
    "",
    "Si vous avez besoin d'un retour plus rapide, écrivez-nous directement à hillal@medini-homes.com ou via WhatsApp.",
    "",
    "À très vite,",
    "L'équipe Havn Stays",
    "https://havn-stays.com",
  ];
  return lines.join("\n");
}

async function sendFormsubmit(row, recipient, subject, withAutoresponse = false) {
  // Formsubmit ajax endpoint accepts JSON payload
  const fields = {
    Nom:         row.full_name || "",
    Email:       row.email || "",
    Telephone:   row.phone || "",
    Zone:        row.zone || "",
    Type:        row.property_type || "",
    Chambres:    row.bedrooms || "",
    Amenities:   (row.amenities || []).join(", "),
    "ADR effective MAD/nuit": fmtMad(row.adr_effective_mad),
    "Estimation LOW":         fmtMad(row.low_annual_mad),
    "Estimation MEDIUM":      fmtMad(row.med_annual_mad),
    "Estimation HIGH":        fmtMad(row.high_annual_mad),
    Message:     row.message || "",
    _subject:    subject,
    _template:   "table",
    _replyto:    row.email || "",
  };
  // Autoresponse to the lead — only on the primary email to avoid double-sending
  if (withAutoresponse && row.email) {
    fields._autoresponse = buildAutoresponse(row);
  }
  try {
    const r = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(recipient)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Origin": "https://havn-stays.com",
        "Referer": "https://havn-stays.com/estimation",
      },
      body: JSON.stringify(fields),
    });
    if (r.ok) {
      const data = await r.json().catch(() => ({}));
      if (data.success === "true" || data.success === true) return { ok: true };
      return { ok: false, reason: `fs ${recipient}: ${JSON.stringify(data).slice(0,160)}` };
    }
    const errText = await r.text();
    return { ok: false, reason: `fs ${r.status} ${recipient}: ${errText.slice(0,160)}` };
  } catch (e) {
    return { ok: false, reason: "fs exception: " + String(e).slice(0,120) };
  }
}

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(204).end();
  }
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  // Allow same-origin only in prod, but keep CORS for local testing
  res.setHeader("Access-Control-Allow-Origin", "*");

  let payload;
  try {
    payload = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: "Invalid JSON" });
  }
  if (!payload || !payload.email) {
    return res.status(400).json({ error: "Missing email" });
  }
  // Honeypot — return success to bot but never persist
  if (payload.website_url) {
    return res.status(200).json({ ok: true, id: null, spam: true });
  }
  // Basic email format check
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    return res.status(400).json({ error: "Invalid email" });
  }

  const row = sanitize(payload);
  const ua = (req.headers["user-agent"] || "").slice(0, 200);

  let id = null;
  try {
    id = await insertSupabase(row, ua);
  } catch (e) {
    return res.status(500).json({ error: "DB insert failed", detail: String(e).slice(0, 300) });
  }

  // Telegram only (Formsubmit AJAX is blocked by Cloudflare from server-side ;
  // emails are sent from the frontend in browser context where it works).
  const tgRes = await sendTelegram(row);

  return res.status(200).json({
    ok: true,
    id,
    notif: { telegram: tgRes },
  });
}

// (Helpers above return objects {ok, reason?} — kept verbose during deploy debug.)

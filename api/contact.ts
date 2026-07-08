import type { VercelRequest, VercelResponse } from "@vercel/node";
import { put, list, get } from "@vercel/blob";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function isValidName(name: string): boolean {
  return name.trim().length >= 2;
}

function sanitize(val: string): string {
  return val.trim();
}

function parseName(fullName: string): { first_name: string; last_name: string } {
  const parts = sanitize(fullName).split(/\s+/);
  const first_name = parts[0] ?? "Unknown";
  const last_name = parts.slice(1).join(" ") || "Lead";
  return { first_name, last_name };
}

const DIAL_CODES: Record<string, string> = {
  CH: "41", GB: "44", US: "1", DE: "49", IN: "91",
  FR: "33", BE: "32", IT: "39", ES: "34", NL: "31",
  AT: "43", SE: "46", AE: "971", SA: "966", QA: "974",
  KW: "965", BH: "973", OM: "968", AU: "61", CA: "1",
  SG: "65", MY: "60", HK: "852", JP: "81", KR: "82",
  TR: "90", IL: "972", ZA: "27", NG: "234", KE: "254",
  EG: "20", GR: "30", PT: "351", IE: "353", DK: "45",
  NO: "47", FI: "358", PL: "48", LU: "352", MT: "356",
  CY: "357", BR: "55", MX: "52", AR: "54", CN: "86",
  PK: "92", BD: "880", TH: "66", ID: "62", PH: "63",
};

function formatPhoneForCRM(rawPhone: string, countryCode: string): string {
  let phone = (rawPhone ?? "").replace(/[^\d+]/g, "").trim();
  const code = DIAL_CODES[countryCode.toUpperCase()] ?? "41";

  if (!phone) return "0000000000";
  if (phone.startsWith("+")) return "00" + phone.slice(1);
  if (phone.startsWith("00")) return phone;
  if (phone.startsWith(code)) return "00" + phone;
  if (phone.startsWith("0")) return "00" + code + phone.slice(1);
  return "00" + code + phone;
}

const log = (msg: string, data?: object) => {
  console.log(
    `\n${"=".repeat(50)}\n[CONTACT] ${msg}`,
    data ? JSON.stringify(data, null, 2) : "",
    `\n${"=".repeat(50)}\n`
  );
};

function parseBody(req: VercelRequest): Record<string, string> {
  if (req.body && typeof req.body === "object") return req.body as Record<string, string>;
  try { return JSON.parse(String(req.body)); } catch { return {}; }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ success: false, message: "Method not allowed" });

  const body = parseBody(req);
  const name = sanitize(body.name ?? "");
  const email = sanitize(body.email ?? "");
  const phone = sanitize(body.phone ?? "");
  const message = sanitize(body.message ?? "");
  const countryCode = sanitize(body.countryCode ?? "GB").toUpperCase();

  log("REQUEST", { timestamp: new Date().toISOString(), name, email, phone, countryCode });

  if (!name || !isValidName(name)) return res.status(400).json({ success: false, message: "Please enter your full name.", errorCode: "INVALID_NAME" });
  if (!email || !isValidEmail(email)) return res.status(400).json({ success: false, message: "Please enter a valid email address.", errorCode: "INVALID_EMAIL" });

  const formattedPhone = formatPhoneForCRM(phone, countryCode);
  const { first_name, last_name } = parseName(name);

  const crmUrl = process.env.CRM_API_URL || "https://inwo.crmcore.me/api/lead_management/api/affiliates";
  const crmToken = process.env.CRM_AUTH_TOKEN ?? "";

  const payload = {
    country_name: countryCode.toLowerCase(),
    description: message,
    phone: formattedPhone,
    email: email.toLowerCase(),
    first_name,
    last_name,
    custom_fields: {
      Source_ID: "Website",
      How_Much_Invested: "0",
      Outline_Your_Case: message,
    },
  };

  log("CRM REQUEST", { url: crmUrl, payload });

  try {
    const crmRes = await fetch(crmUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${crmToken}`,
        "x-token": crmToken,
      },
      body: JSON.stringify(payload),
    });

    const text = await crmRes.text();
    log("CRM RESPONSE", { status: crmRes.status, body: text.slice(0, 300) });

    const alreadyExists = text.toLowerCase().includes("already exist");
    if (!crmRes.ok && !alreadyExists) {
      log("CRM FAILURE", { status: crmRes.status });
      return res.status(502).json({ success: false, message: "We couldn't submit your enquiry. Please try again.", errorCode: "CRM_ERROR" });
    }

    // Increment leads count in Blob
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
    if (blobToken) {
      await incrementLeadsCount(blobToken);
    } else {
      log("WARNING", { reason: "BLOB_READ_WRITE_TOKEN not set, skipping leads count increment" });
    }

    return res.status(200).json({
      success: true,
      message: "Thank you! Your enquiry has been received successfully. One of our specialists will contact you shortly.",
    });
  } catch (err: unknown) {
    log("NETWORK ERROR", { error: String(err) });
    return res.status(500).json({ success: false, message: "We couldn't submit your enquiry. Please try again.", errorCode: "NETWORK_ERROR" });
  }
}

async function incrementLeadsCount(token: string) {
  try {
    const BLOB_KEY = "leads-count.json";
    const { blobs } = await list({ prefix: BLOB_KEY, token });
    let count = 0;
    if (blobs.length > 0) {
      try {
        const blobResult = await get(blobs[0].url, { token });
        if (blobResult.body) {
          const json = await new Response(blobResult.body).json() as { count?: number };
          count = typeof json.count === "number" ? json.count : 0;
        }
      } catch (fetchErr) {
        console.warn("[leads-count] Could not fetch private count blob, starting fresh:", fetchErr);
      }
    }
    await put(BLOB_KEY, JSON.stringify({ count: count + 1 }), {
      access: "private",
      contentType: "application/json",
      addRandomSuffix: false,
      token,
    });
    log("LEADS COUNT", { newCount: count + 1 });
  } catch (err) {
    console.error("[leads-count] Failed to increment:", err);
  }
}

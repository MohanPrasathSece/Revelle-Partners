import { put } from "@vercel/blob";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, phone, country, countryCode, message } = req.body || {};

  // Server-side validation
  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return res.status(400).json({ error: "Name is required" });
  }
  if (!email || typeof email !== "string" || !email.includes("@")) {
    return res.status(400).json({ error: "A valid email address is required" });
  }
  if (!phone || typeof phone !== "string" || phone.trim().length < 7) {
    return res.status(400).json({ error: "A valid phone number is required" });
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanName = name.trim();
  const cleanPhone = phone.trim();
  const cleanMessage = typeof message === "string" ? message.trim() : "";

  // Split name into first and last name
  const nameParts = cleanName.split(/\s+/);
  const first_name = nameParts[0] || "";
  const last_name = nameParts.slice(1).join(" ") || "";

  const timestamp = new Date().toISOString();

  console.log("[enquiry] Received submission:", { name: cleanName, email: cleanEmail, phone: cleanPhone, message: cleanMessage });

  try {
    // 1. Submit to CRM
    const crmUrl =
      process.env.CRM_API_URL || "https://inwo.crmcore.me/api/lead_management/api/affiliates";
    const crmToken = process.env.CRM_AUTH_TOKEN || "AFF_1_92cbc1bc76284e19b711bab22587d75f";

    const crmPayload = {
      country_name: typeof country === "string" ? country.toLowerCase() : typeof countryCode === "string" ? countryCode.toLowerCase() : "cy",
      description: cleanMessage,
      phone: cleanPhone,
      email: cleanEmail,
      first_name,
      last_name,
      custom_fields: {
        Source_ID: "Website",
        Outline_Your_Case: cleanMessage,
      },
    };

    let crmSuccess = false;
    let crmErrorMsg = "";

    try {
      console.log("[enquiry] Submitting to CRM:", crmUrl);
      console.log("[enquiry] CRM Payload:", JSON.stringify(crmPayload, null, 2));
      const crmResponse = await fetch(crmUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${crmToken}`,
        },
        body: JSON.stringify(crmPayload),
      });

      if (crmResponse.ok) {
        crmSuccess = true;
        console.log("[enquiry] CRM submission successful.");
      } else {
        const errText = await crmResponse.text();
        crmErrorMsg = `CRM responded with status ${crmResponse.status}: ${errText}`;
        console.error("[enquiry] Full CRM Error Details:");
        console.error(crmErrorMsg);
      }
    } catch (e) {
      const err = e as Error;
      crmErrorMsg = `Failed to contact CRM: ${err.message}`;
      console.error("[enquiry]", crmErrorMsg);
    }

    // 2. Save enquiry to Vercel Blob (same pattern as signup: users/<email>.json)
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

    if (blobToken) {
      // Use a timestamped path so multiple enquiries from the same email are preserved
      const blobPath = `enquiries/${timestamp.replace(/[:.]/g, "-")}_${cleanEmail}.json`;
      const enquiryData = {
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        message: cleanMessage,
        submittedAt: timestamp,
        crmSubmitted: crmSuccess,
      };

      try {
        const blob = await put(blobPath, JSON.stringify(enquiryData), {
          access: "private",
          contentType: "application/json",
          token: blobToken,
        });
        console.log("[enquiry] Saved to Vercel Blob:", blob.url);
      } catch (blobErr) {
        console.error("[enquiry] Failed to save to Vercel Blob:", blobErr);
        // Do not fail the request if blob write fails — CRM is primary
      }
    } else {
      console.warn("[enquiry] BLOB_READ_WRITE_TOKEN is not set. Enquiry not persisted to Blob.");
    }

    // 3. Return success regardless of CRM status (blob is backup)
    return res.status(200).json({
      success: true,
      message: "Thank you! Your enquiry has been received successfully.",
      crmSubmitted: crmSuccess,
      crmError: crmSuccess ? null : crmErrorMsg,
    });
  } catch (error) {
    console.error("[enquiry] Unexpected error:", error);
    return res.status(500).json({
      error: "An error occurred during submission. Please try again.",
    });
  }
}

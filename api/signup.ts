import { put } from "@vercel/blob";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  console.log("[signup] Full request body received:", req.body);
  const { name, email, phone, country } = req.body || {};

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

  // Split name into first and last name
  const nameParts = cleanName.split(/\s+/);
  const first_name = nameParts[0] || "";
  const last_name = nameParts.slice(1).join(" ") || "";

  console.log("[signup] New registration attempt:", { name: cleanName, email: cleanEmail, phone: cleanPhone });

  try {
    // 1. Submit to CRM
    const crmUrl =
      process.env.CRM_API_URL || "https://inwo.crmcore.me/api/lead_management/api/affiliates";
    const crmToken = process.env.CRM_AUTH_TOKEN || "AFF_1_92cbc1bc76284e19b711bab22587d75f";

    const crmPayload = {
      country_name: typeof country === "string" ? country.toLowerCase() : "cy",
      description: "",
      phone: cleanPhone,
      email: cleanEmail,
      first_name,
      last_name,
      custom_fields: {
        Source_ID: "Website",
        Outline_Your_Case: "",
      },
    };

    let crmSuccess = false;
    let crmErrorMsg = "";

    try {
      console.log("[signup] Submitting to CRM:", crmUrl);
      console.log("[signup] CRM Payload:", JSON.stringify(crmPayload, null, 2));
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
        console.log("[signup] CRM submission successful.");
      } else {
        const errText = await crmResponse.text();
        crmErrorMsg = `CRM responded with status ${crmResponse.status}: ${errText}`;
        console.error("[signup] Full CRM Error Details:");
        console.error(crmErrorMsg);
      }
    } catch (e) {
      const err = e as Error;
      crmErrorMsg = `Failed to contact CRM: ${err.message}`;
      console.error("[signup]", crmErrorMsg);
    }

    // 2. Save user to Vercel Blob for authentication (same store as login reads from)
    //    Path: users/<email>.json  (matches what login.ts lists by prefix)
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

    if (blobToken) {
      const userData = {
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        registeredAt: new Date().toISOString(),
      };

      try {
        const blob = await put(
          `users/${cleanEmail}.json`,
          JSON.stringify(userData),
          {
            access: "private",
            contentType: "application/json",
            token: blobToken,
            // addRandomSuffix: false ensures login can always predict the path
            addRandomSuffix: false,
          },
        );
        console.log("[signup] User saved to Vercel Blob:", blob.url);
      } catch (blobErr) {
        console.error("[signup] Failed to save user to Vercel Blob:", blobErr);
        // Still return success since CRM was primary — user can retry or login will fail gracefully
      }
    } else {
      console.warn(
        "[signup] BLOB_READ_WRITE_TOKEN is not set. Signup authentication data not persisted to Blob.",
      );
    }

    // 3. Return success with full user profile (used by AuthContext to populate dashboard)
    return res.status(200).json({
      success: true,
      crmSubmitted: crmSuccess,
      crmError: crmSuccess ? null : crmErrorMsg,
      user: {
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
      },
    });
  } catch (error) {
    console.error("[signup] Unexpected error:", error);
    return res.status(500).json({
      error: "An error occurred during signup. Please try again.",
    });
  }
}

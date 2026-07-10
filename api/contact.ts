import type { IncomingMessage, ServerResponse } from "http";
import { submitToCRM } from "./_lib/crm.js";

// Simple middleware to parse JSON body
async function parseJsonBody(req: IncomingMessage & { body?: any }): Promise<Record<string, any>> {
  try {
    if (req.body !== undefined && req.body !== null) {
      return typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    }
  } catch (e) {
    console.warn("[API Contact] Pre-parsed body resolution failed, falling back:", e);
  }

  return new Promise((resolve) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        resolve({});
      }
    });
  });
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  // CORS Headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.statusCode = 200;
    res.end();
    return;
  }

  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Method not allowed" }));
    return;
  }

  try {
    const body = await parseJsonBody(req);
    const { name, email, phone, message, countryCode } = body;

    console.log(`[API Contact Request] Name: "${name}", Email: "${email}", Phone: "${phone}", CountryCode: "${countryCode || "CH"}", Message: "${message || ""}"`);

    // Validate inputs
    if (!name || !email || !phone) {
      console.warn(`[API Contact Warning] Rejection: Name, email, or phone is missing.`);
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Name, email, and phone are required" }));
      return;
    }

    // Submit to CRM
    console.log(`[API Contact] Submitting details to CRM...`);
    await submitToCRM({
      name,
      email,
      phone,
      description: "Revelle Partners",
      outlineYourCase: message || "",
      countryCode: countryCode || "CH",
    });
    console.log(`[API Contact Success] CRM submission completed for: "${email}"`);

    
    // Fire-and-forget: increment leads count
    try {
      const host = req.headers.host || "localhost:3000";
      const protocol = host.startsWith("localhost") ? "http" : "https";
      fetch(`${protocol}://${host}/api/leads-count`, { method: "POST" }).catch((err) =>
        console.warn("[leads-count] Failed to increment:", err)
      );
    } catch (e) {
      console.warn("[leads-count] Error triggering increment:", e);
    }

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ success: true, message: "Enquiry submitted successfully" }));
  } catch (error: unknown) {
    const err = error as Error;
    console.error("[API Contact Error] CRM submission failed:", err);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Internal server error", details: err.message }));
  }
}

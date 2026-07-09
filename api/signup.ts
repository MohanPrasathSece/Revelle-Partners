import type { IncomingMessage, ServerResponse } from "http";
import { submitToCRM } from "./_lib/crm.js";
import { getUsers, saveUsers, User } from "./_lib/blobDb.js";

async function parseJsonBody(req: IncomingMessage & { body?: any }): Promise<Record<string, any>> {
  try {
    if (req.body !== undefined && req.body !== null) {
      return typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    }
  } catch {
    // fall through to stream reading
  }
  return new Promise((resolve) => {
    let body = "";
    req.on("data", (chunk) => { body += chunk.toString(); });
    req.on("end", () => {
      try { resolve(body ? JSON.parse(body) : {}); }
      catch { resolve({}); }
    });
  });
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") { res.statusCode = 200; res.end(); return; }
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Method not allowed" }));
    return;
  }

  try {
    const body = await parseJsonBody(req);
    const { name, email, phone, countryCode } = body;

    console.log(`[API Signup Request] Name: "${name}", Email: "${email}", Phone: "${phone || "(none)"}", CountryCode: "${countryCode || "CH"}"`);

    // Validate required fields
    if (!email || !email.trim()) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Email is required" }));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Please enter a valid email address" }));
      return;
    }

    if (!name || !name.trim()) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Name is required" }));
      return;
    }

    // Submit to CRM (non-blocking if lead already exists)
    console.log("[API Signup] Submitting to CRM...");
    try {
      await submitToCRM({
        name: name.trim(),
        email: email.trim(),
        phone: phone || "",
        description: "Revelle Partners",
        outlineYourCase: "Signup Lead",
        countryCode: countryCode || "CH",
      });
      console.log("[API Signup] CRM submission succeeded.");
    } catch (crmError) {
      const errMsg = (crmError as Error).message || "";
      if (errMsg.toLowerCase().includes("already exist")) {
        console.warn("[API Signup Warning] CRM lead already exists, continuing:", crmError);
      } else {
        console.error("[API Signup Error] CRM Submission failed:", crmError);
        // Don't block signup if CRM fails — just log
      }
    }

    // Check duplicate by EMAIL ONLY
    console.log("[API Signup] Fetching current user list...");
    const users = await getUsers();
    const existingIndex = users.findIndex((u) => u.email.toLowerCase() === email.trim().toLowerCase());

    if (existingIndex >= 0) {
      console.log(`[API Signup] Account already exists for: "${email}"`);
      res.statusCode = 409;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "An account with this email already exists. Please sign in instead.", code: "ALREADY_EXISTS" }));
      return;
    }

    const updatedUser: User = {
      email: email.trim().toLowerCase(),
      name: name.trim(),
      phone: phone ? phone.trim() : "",
      createdAt: new Date().toISOString(),
    };

    users.push(updatedUser);
    await saveUsers(users);
    console.log(`[API Signup Success] Registered: "${email}"`);

    // Sync to dashboard
    try {
      const url = (typeof process !== 'undefined' && process.env && process.env.VITE_DASHBOARD_URL) || "https://autodigix-leads-dashboard.vercel.app/api/increment";
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ website: "Revelle Partners", type: "signup", name: name, email: email})
      }).catch(() => {});
    } catch(e){}
    // Sync to dashboard
    try {
      const url = (typeof process !== 'undefined' && process.env && process.env.VITE_DASHBOARD_URL) || "https://autodigix-leads-dashboard.vercel.app/api/increment";
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ website: "Revelle Partners", type: "signup", name: name, email: email})
      }).catch(() => {});
    } catch(e){}

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
    res.end(JSON.stringify({ success: true, user: updatedUser }));
  } catch (error: unknown) {
    const err = error as Error;
    console.error("[API Signup Error] Critical failure:", err);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: err.message || "Internal server error" }));
  }
}

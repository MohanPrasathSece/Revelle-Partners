import type { IncomingMessage, ServerResponse } from "http";
import { getUsers } from "./_lib/blobDb.js";

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
    const { email } = body;

    console.log(`[API Login Request] Email: "${email}"`);

    if (!email || !email.trim()) {
      console.warn("[API Login Warning] Email is required.");
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

    const users = await getUsers();
    const user = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());

    if (!user) {
      console.warn(`[API Login Warning] No account found for: "${email}"`);
      res.statusCode = 404;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "No account found with this email. Please sign up first." }));
      return;
    }

    console.log(`[API Login Success] Logged in: "${user.email}"`);
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ success: true, user }));
  } catch (error: unknown) {
    const err = error as Error;
    console.error("[API Login Error] Critical failure:", err);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Internal server error" }));
  }
}

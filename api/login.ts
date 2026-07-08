import { list, head, get } from "@vercel/blob";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  console.log("[login] Full request body received:", req.body);
  const { email } = req.body || {};

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return res.status(400).json({ error: "A valid email address is required" });
  }

  const cleanEmail = email.trim().toLowerCase();
  const token = process.env.BLOB_READ_WRITE_TOKEN;

  console.log("[login] Attempting login for:", cleanEmail);

  if (!token) {
    console.warn("[login] BLOB_READ_WRITE_TOKEN is not set – using mock login fallback.");
    return res.status(200).json({
      success: true,
      user: { email: cleanEmail, name: cleanEmail.split("@")[0], phone: "" },
    });
  }

  try {
    // 1. Find the user blob by prefix
    const { blobs } = await list({
      prefix: `users/${cleanEmail}.json`,
      token,
    });

    console.log(`[login] Blob list result for users/${cleanEmail}.json:`, blobs.length, "found");

    if (blobs.length === 0) {
      return res.status(401).json({
        error: "This email is not registered. Please sign up to create an account.",
      });
    }

    // 2. Fetch the actual JSON content to return full user profile
    let user: { name: string; email: string; phone: string } = {
      name: cleanEmail.split("@")[0],
      email: cleanEmail,
      phone: "",
    };

    try {
      const blobUrl = blobs[0].url;
      const blobResult = await get(blobUrl, { token });
      if (blobResult.body) {
        const data = await new Response(blobResult.body).json() as any;
        user = {
          name: data.name || user.name,
          email: data.email || cleanEmail,
          phone: data.phone || "",
        };
        console.log("[login] User profile fetched from blob:", user);
      }
    } catch (fetchErr) {
      console.warn("[login] Could not fetch user blob content, falling back to email:", fetchErr);
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("[login] Error:", error);
    return res.status(500).json({
      error: "Authentication service error. Please try again later.",
    });
  }
}

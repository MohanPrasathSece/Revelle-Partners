import { put, list } from "@vercel/blob";

const BLOB_KEY = "leads-count.json";

function getBlobCredentials() {
  const token = process.env.BLOB_READ_WRITE_TOKEN_NEW_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN;
  const storeId = process.env.BLOB_READ_WRITE_TOKEN_NEW_STORE_ID || process.env.BLOB_STORE_ID;
  return { token, storeId };
}

async function getCount(): Promise<number> {
  try {
    const { token, storeId } = getBlobCredentials();
    const { blobs } = await list({ prefix: BLOB_KEY, token, storeId });
    if (blobs.length === 0) return 0;

    const downloadUrl = blobs[0].downloadUrl || blobs[0].url;
    const res = await fetch(downloadUrl);
    if (!res.ok) return 0;
    const json = (await res.json()) as { count?: unknown };
    return typeof json.count === "number" ? json.count : 0;
  } catch (err) {
    console.error("[leads-count] getCount error:", err);
    return 0;
  }
}

async function setCount(count: number): Promise<void> {
  const { token, storeId } = getBlobCredentials();
  await put(BLOB_KEY, JSON.stringify({ count }), {
    access: "public",
    contentType: "application/json",
    allowOverwrite: true,
    token,
    storeId,
  });
}

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.statusCode = 200;
    res.end();
    return;
  }

  res.setHeader("Content-Type", "application/json");

  try {
    if (req.method === "GET") {
      const count = await getCount();
      res.statusCode = 200;
      res.end(JSON.stringify({ count }));
      return;
    }

    if (req.method === "POST") {
      const current = await getCount();
      const next = current + 1;
      await setCount(next);
      console.log(`[leads-count] incremented → ${next}`);
      res.statusCode = 200;
      res.end(JSON.stringify({ count: next }));
      return;
    }

    res.statusCode = 405;
    res.end(JSON.stringify({ error: "Method not allowed" }));
  } catch (err) {
    console.error("[leads-count] Error:", err);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: "Internal server error", details: String(err) }));
  }
}

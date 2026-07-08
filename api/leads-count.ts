import { put, list } from "@vercel/blob";

const BLOB_KEY = "leads-count.json";

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN || "vercel_blob_rw_CMm1ef4iy5DCgoNg_5TmGKy9J78h0c6mbxFqRxTE4JAnPAN";
const BLOB_STORE_ID = process.env.BLOB_STORE_ID || "store_CMm1ef4iy5DCgoNg";

async function getCount(): Promise<number> {
  try {
    const token = BLOB_TOKEN;
    const { blobs } = await list({ prefix: BLOB_KEY, token, storeId: BLOB_STORE_ID });
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
  await put(BLOB_KEY, JSON.stringify({ count }), {
    access: "private",
    contentType: "application/json",
    allowOverwrite: true,
    token: BLOB_TOKEN,
    storeId: BLOB_STORE_ID,
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

import { put, list } from "@vercel/blob";

export interface User {
  email: string;
  name: string;
  phone: string;
  createdAt: string;
}

async function getBlobUrl(): Promise<string | null> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token || token === "undefined" || token === "null" || token.trim() === "") {
    return null;
  }
  try {
    const { blobs } = await list({ token, storeId: process.env.BLOB_STORE_ID });
    const userBlob = blobs.find((b) => b.pathname === "users.json");
    // For private blobs, use downloadUrl (which includes a short-lived token)
    return userBlob ? (userBlob.downloadUrl || userBlob.url) : null;
  } catch (e) {
    console.error("Vercel Blob list error:", e);
    return null;
  }
}

export async function getUsers(): Promise<User[]> {
  try {
    const blobUrl = await getBlobUrl();
    if (!blobUrl) {
      return [];
    }

    const response = await fetch(blobUrl);
    if (!response.ok) {
      console.warn(`Fetch users from Blob failed with status ${response.status}.`);
      return [];
    }
    return (await response.json()) as User[];
  } catch (e) {
    console.error("Failed to fetch users from Vercel Blob:", e);
    return [];
  }
}

export async function saveUsers(users: User[]): Promise<void> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token || token === "undefined" || token === "null" || token.trim() === "") {
    console.error("BLOB_READ_WRITE_TOKEN not set in environment.");
    return;
  }

  try {
    await put("users.json", JSON.stringify(users, null, 2), {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControl: "no-store, no-cache, must-revalidate, max-age=0",
      token,
      storeId: process.env.BLOB_STORE_ID,
    });
  } catch (e) {
    console.error("Failed to put users to Vercel Blob:", e);
  }
}

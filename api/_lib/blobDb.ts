import { put, list } from "@vercel/blob";

export interface User {
  email: string;
  name: string;
  phone: string;
  createdAt: string;
}

function getBlobCredentials() {
  const token = process.env.BLOB_READ_WRITE_TOKEN_NEW_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN;
  const storeId = process.env.BLOB_READ_WRITE_TOKEN_NEW_STORE_ID || process.env.BLOB_STORE_ID;
  return { token, storeId };
}

async function getBlobUrl(): Promise<string | null> {
  const { token, storeId } = getBlobCredentials();
  if (!token || token === "undefined" || token === "null" || token.trim() === "") {
    return null;
  }
  try {
    const { blobs } = await list({ token, storeId });
    const userBlob = blobs.find((b) => b.pathname === "users.json");
    // For public/private blobs, use downloadUrl or url
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
  const { token, storeId } = getBlobCredentials();
  if (!token || token === "undefined" || token === "null" || token.trim() === "") {
    console.error("Vercel Blob token not set in environment.");
    return;
  }

  try {
    await put("users.json", JSON.stringify(users, null, 2), {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControl: "no-store, no-cache, must-revalidate, max-age=0",
      token,
      storeId,
    });
  } catch (e) {
    console.error("Failed to put users to Vercel Blob:", e);
  }
}

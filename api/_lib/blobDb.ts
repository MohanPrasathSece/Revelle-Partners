import { put, list } from "@vercel/blob";
import fs from "fs";
import path from "path";

const LOCAL_DB_PATH = path.resolve(process.cwd(), ".users.json");

export interface User {
  email: string;
  name: string;
  phone: string;
  createdAt: string;
}

// Memory cache of users for local testing
let localUsersCache: User[] = [];
if (fs.existsSync(LOCAL_DB_PATH)) {
  try {
    localUsersCache = JSON.parse(fs.readFileSync(LOCAL_DB_PATH, "utf-8"));
  } catch (e) {
    console.error("Failed to read local users db", e);
  }
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
      return localUsersCache;
    }

    const response = await fetch(blobUrl);
    if (!response.ok) {
      console.warn(`Fetch users from Blob failed with status ${response.status}. Falling back to local cache.`);
      return localUsersCache;
    }
    return (await response.json()) as User[];
  } catch (e) {
    console.error("Failed to fetch users from Vercel Blob, falling back to local cache:", e);
    return localUsersCache;
  }
}

export async function saveUsers(users: User[]): Promise<void> {
  // Update local cache & file
  localUsersCache = users;
  try {
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(users, null, 2), "utf-8");
  } catch (e) {
    console.error("Failed to write users to local file:", e);
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token || token === "undefined" || token === "null" || token.trim() === "") {
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

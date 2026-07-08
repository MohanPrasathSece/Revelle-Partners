import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";
import fs from "fs";

// Load environment variables from .env if it exists
try {
  const envPath = path.resolve(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf-8");
    envContent.split("\n").forEach((line) => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let val = match[2] || "";
        if (val.startsWith('"') && val.endsWith('"')) {
          val = val.substring(1, val.length - 1);
        }
        process.env[key] = val.trim();
      }
    });
  }
} catch (e) {
  console.error("Failed to load .env manually:", e);
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    tsconfigPaths(),
    {
      name: "api-routes",
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url && req.url.startsWith("/api/")) {
            const parsedUrl = new URL(req.url, "http://localhost");
            const pathname = parsedUrl.pathname;
            const endpoint = pathname.replace(/^\/api\//, ""); // e.g., 'contact', 'signup', 'login'

            // Clean up name (e.g. check for subfolders/extensions)
            const cleanEndpoint = endpoint.split("?")[0];

            // Paths to check
            const tsPath = path.resolve(process.cwd(), `api/${cleanEndpoint}.ts`);
            const jsPath = path.resolve(process.cwd(), `api/${cleanEndpoint}.js`);

            if (fs.existsSync(tsPath) || fs.existsSync(jsPath)) {
              try {
                // Dynamically compile & load TS module using Vite's ssrLoadModule
                const module = await server.ssrLoadModule(`./api/${cleanEndpoint}.ts`);
                if (module && typeof module.default === "function") {
                  await module.default(req, res);
                  return;
                }
              } catch (e: unknown) {
                const err = e as Error;
                console.error(`API execution error for /api/${cleanEndpoint}:`, err);
                res.statusCode = 500;
                res.setHeader("Content-Type", "application/json");
                res.end(
                  JSON.stringify({
                    error: "Internal server error in API middleware",
                    details: err.message,
                  }),
                );
                return;
              }
            }
          }
          next();
        });
      },
    },
  ],
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
    alias: {
      "@": path.resolve(process.cwd(), "./src"),
    },
  },
});

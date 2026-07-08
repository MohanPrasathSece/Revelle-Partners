/**
 * Local development API server — replaces `vercel dev` so no Vercel credentials are needed.
 * Reads .env automatically and maps /api/<name> → api/<name>.ts handler.
 * Runs on PORT 3000 (proxied by Vite in vite.config.ts).
 */
import "dotenv/config";
import express, { type Request, type Response } from "express";
import signupHandler from "./api/signup.js";
import loginHandler from "./api/login.js";
import contactHandler from "./api/contact.js";
import enquiryHandler from "./api/enquiry.js";

const app = express();
app.use(express.json());

// Adapts our VercelRequest/VercelResponse-style handlers to Express
function adapt(handler: (req: any, res: any) => Promise<any>) {
  return (req: Request, res: Response) => handler(req, res);
}

app.all("/api/signup", adapt(signupHandler));
app.all("/api/login", adapt(loginHandler));
app.all("/api/contact", adapt(contactHandler));
app.all("/api/enquiry", adapt(enquiryHandler));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`[api] Local dev server running at http://localhost:${PORT}`);
  console.log("[api] Routes: /api/signup  /api/login  /api/contact  /api/enquiry");
});

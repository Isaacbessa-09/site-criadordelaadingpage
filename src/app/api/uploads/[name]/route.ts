import { promises as fs } from "fs";
import path from "path";
import type { NextRequest } from "next/server";
import { UPLOADS, kvGet, usingRedis } from "@/lib/storage";

const TYPES: Record<string, string> = {
  jpg: "image/jpeg", png: "image/png", webp: "image/webp", gif: "image/gif", svg: "image/svg+xml", avif: "image/avif",
};
const CACHE = { "Cache-Control": "public, max-age=31536000, immutable" };

export async function GET(_req: NextRequest, ctx: RouteContext<"/api/uploads/[name]">) {
  const { name } = await ctx.params;
  const safe = path.basename(name);
  try {
    if (usingRedis()) {
      const img = await kvGet<{ type: string; data: string }>(`img:${safe}`);
      if (!img) return new Response("Not found", { status: 404 });
      return new Response(new Uint8Array(Buffer.from(img.data, "base64")), { headers: { "Content-Type": img.type, ...CACHE } });
    }
    const ext = safe.split(".").pop() ?? "";
    const buf = await fs.readFile(path.join(/*turbopackIgnore: true*/ UPLOADS, safe));
    return new Response(new Uint8Array(buf), { headers: { "Content-Type": TYPES[ext] ?? "application/octet-stream", ...CACHE } });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}

import { promises as fs } from "fs";
import path from "path";
import type { NextRequest } from "next/server";
import { UPLOADS } from "@/lib/storage";

const TYPES: Record<string, string> = {
  jpg: "image/jpeg", png: "image/png", webp: "image/webp", gif: "image/gif", svg: "image/svg+xml", avif: "image/avif",
};

export async function GET(_req: NextRequest, ctx: RouteContext<"/api/uploads/[name]">) {
  const { name } = await ctx.params;
  const safe = path.basename(name);
  const ext = safe.split(".").pop() ?? "";
  try {
    const buf = await fs.readFile(path.join(UPLOADS, safe));
    return new Response(new Uint8Array(buf), {
      headers: { "Content-Type": TYPES[ext] ?? "application/octet-stream", "Cache-Control": "public, max-age=31536000, immutable" },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}

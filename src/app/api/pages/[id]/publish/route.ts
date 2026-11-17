import type { NextRequest } from "next/server";
import { publishPage, unpublishPage } from "@/lib/storage";

export async function POST(req: NextRequest, ctx: RouteContext<"/api/pages/[id]/publish">) {
  const { id } = await ctx.params;
  const { slug } = await req.json();
  try {
    return Response.json(await publishPage(id, slug));
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, ctx: RouteContext<"/api/pages/[id]/publish">) {
  const { id } = await ctx.params;
  try {
    return Response.json(await unpublishPage(id));
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 400 });
  }
}

import type { NextRequest } from "next/server";
import { deletePage, getPage, savePage } from "@/lib/storage";
import type { PageDoc } from "@/lib/types";

export async function GET(_req: NextRequest, ctx: RouteContext<"/api/pages/[id]">) {
  const { id } = await ctx.params;
  const page = await getPage(id);
  if (!page) return Response.json({ error: "Não encontrada" }, { status: 404 });
  return Response.json(page);
}

export async function PUT(req: NextRequest, ctx: RouteContext<"/api/pages/[id]">) {
  const { id } = await ctx.params;
  const current = await getPage(id);
  if (!current) return Response.json({ error: "Não encontrada" }, { status: 404 });
  const body = (await req.json()) as PageDoc;
  // slug/published só mudam pela rota de publicação
  const saved = await savePage({ ...body, id, slug: current.slug, published: current.published, publishedAt: current.publishedAt });
  return Response.json(saved);
}

export async function DELETE(_req: NextRequest, ctx: RouteContext<"/api/pages/[id]">) {
  const { id } = await ctx.params;
  await deletePage(id);
  return Response.json({ ok: true });
}

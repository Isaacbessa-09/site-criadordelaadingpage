import type { NextRequest } from "next/server";
import { deletePage, getPage, savePage } from "@/lib/storage";
import type { PageDoc } from "@/lib/types";

const fail = (e: unknown) => Response.json({ error: (e as Error).message }, { status: 500 });

export async function GET(_req: NextRequest, ctx: RouteContext<"/api/pages/[id]">) {
  const { id } = await ctx.params;
  try {
    const page = await getPage(id);
    if (!page) return Response.json({ error: "Página não encontrada" }, { status: 404 });
    return Response.json(page);
  } catch (e) {
    return fail(e);
  }
}

export async function PUT(req: NextRequest, ctx: RouteContext<"/api/pages/[id]">) {
  const { id } = await ctx.params;
  try {
    const current = await getPage(id);
    if (!current) return Response.json({ error: "Página não encontrada" }, { status: 404 });
    const body = (await req.json()) as PageDoc;
    // slug/published só mudam pela rota de publicação
    const saved = await savePage({ ...body, id, slug: current.slug, published: current.published, publishedAt: current.publishedAt });
    return Response.json(saved);
  } catch (e) {
    return fail(e);
  }
}

export async function DELETE(_req: NextRequest, ctx: RouteContext<"/api/pages/[id]">) {
  const { id } = await ctx.params;
  try {
    await deletePage(id);
    return Response.json({ ok: true });
  } catch (e) {
    return fail(e);
  }
}

"use client";

import { useEffect, useState } from "react";
import { PageRenderer } from "@/components/site/PageRenderer";
import type { PageDoc } from "@/lib/types";

/** Página pública (ou rascunho). Com ?print=1 abre a janela de salvar em PDF. */
export function PageView({ page: initial, draftId }: { page?: PageDoc | null; draftId?: string }) {
  const [page, setPage] = useState<PageDoc | null | undefined>(initial);

  useEffect(() => {
    if (!draftId) return;
    fetch(`/api/pages/${draftId}`).then(async (r) => setPage(r.ok ? await r.json() : null));
  }, [draftId]);

  useEffect(() => {
    if (!page) return;
    document.title = page.seo?.title || page.brand.name;
    if (!new URLSearchParams(location.search).has("print")) return;
    // Mostra tudo (sem animação) e espera fontes e imagens antes de imprimir
    document.querySelectorAll(".rv").forEach((el) => el.classList.add("in"));
    const imgs = Array.from(document.images).map((im) => {
      im.loading = "eager";
      return im.complete ? Promise.resolve() : new Promise((r) => { im.onload = im.onerror = r; });
    });
    Promise.all([document.fonts.ready, ...imgs]).then(() => setTimeout(() => window.print(), 600));
  }, [page]);

  if (page === undefined) return <div className="grid min-h-screen place-items-center text-zinc-500">Carregando…</div>;
  if (page === null) return <div className="grid min-h-screen place-items-center text-zinc-500">Página não encontrada.</div>;
  return <PageRenderer page={page} />;
}

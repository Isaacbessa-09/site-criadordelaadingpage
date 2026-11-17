"use client";

import { use, useCallback, useEffect, useState } from "react";
import { PageRenderer } from "@/components/site/PageRenderer";
import type { PageDoc } from "@/lib/types";

/**
 * Renderizado dentro do iframe do editor. Recebe a página por postMessage
 * e devolve edições inline e cliques de seleção.
 */
export default function PreviewFrame({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [page, setPage] = useState<PageDoc | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  const post = useCallback((msg: object) => window.parent?.postMessage({ __ls: true, ...msg }, location.origin), []);

  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e.origin !== location.origin || !e.data?.__ls) return;
      if (e.data.type === "page") setPage(e.data.page);
      if (e.data.type === "select") {
        setSelected(e.data.id);
        if (e.data.scroll && e.data.id) {
          document.querySelector(`[data-sid="${e.data.id}"]`)?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    };
    window.addEventListener("message", onMsg);
    post({ type: "ready" });
    // fallback caso o editor ainda não tenha enviado
    fetch(`/api/pages/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setPage((p) => p ?? d));
    return () => window.removeEventListener("message", onMsg);
  }, [id, post]);

  if (!page) return <div className="grid min-h-screen place-items-center text-sm text-zinc-500">Carregando preview…</div>;

  return (
    <PageRenderer
      page={page}
      editable
      selectedId={selected}
      onSelect={(sid, path) => {
        setSelected(sid);
        post({ type: "select", id: sid, path });
      }}
      onEdit={(sid, path, value) => post({ type: "edit", id: sid, path, value })}
    />
  );
}

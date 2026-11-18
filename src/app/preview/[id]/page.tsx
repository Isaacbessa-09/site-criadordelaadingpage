"use client";

import { use, useCallback, useEffect, useRef, useState } from "react";
import { PageRenderer } from "@/components/site/PageRenderer";
import type { EditMode } from "@/components/site/primitives";
import type { ElState, PageDoc } from "@/lib/types";

type Sel = { sid: string; path: string } | null;

/**
 * Renderizado dentro do iframe do editor. Recebe a página por postMessage
 * e devolve edições inline, cliques de seleção e elementos movidos/excluídos.
 */
export default function PreviewFrame({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [page, setPage] = useState<PageDoc | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [mode, setMode] = useState<EditMode>("texto");
  const [sel, setSel] = useState<Sel>(null);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const pageRef = useRef<PageDoc | null>(null);
  useEffect(() => {
    pageRef.current = page;
  }, [page]);

  const post = useCallback((msg: object) => window.parent?.postMessage({ __ls: true, ...msg }, location.origin), []);

  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e.origin !== location.origin || !e.data?.__ls) return;
      if (e.data.type === "page") setPage(e.data.page);
      if (e.data.type === "mode") {
        setMode(e.data.mode);
        setSel(null);
      }
      if (e.data.type === "select") {
        setSelected(e.data.id);
        if (e.data.scroll && e.data.id) {
          document.querySelector(`[data-sid="${e.data.id}"]`)?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    };
    window.addEventListener("message", onMsg);
    post({ type: "ready" });
    fetch(`/api/pages/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setPage((p) => p ?? d));
    return () => window.removeEventListener("message", onMsg);
  }, [id, post]);

  const findEl = (s: Sel) =>
    s ? (document.querySelector(`[data-sid="${s.sid}"]`)?.querySelector(`[data-el="${CSS.escape(s.path)}"]`) as HTMLElement | null) : null;

  const mobile = () => window.innerWidth < 768;
  const current = (s: NonNullable<Sel>): ElState => pageRef.current?.sections.find((x) => x.id === s.sid)?.style.el?.[s.path] ?? {};
  const sendPatch = useCallback(
    (s: NonNullable<Sel>, patch: ElState) => post({ type: "el", id: s.sid, path: s.path, patch }),
    [post],
  );

  /* ---- arrastar ---- */
  useEffect(() => {
    if (mode !== "mover") return;
    let drag: { s: NonNullable<Sel>; el: HTMLElement; x0: number; y0: number; bx: number; by: number; moved: boolean } | null = null;

    const down = (e: PointerEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("[data-toolbar]")) return;
      const el = t.closest("[data-el]") as HTMLElement | null;
      e.preventDefault();
      if (!el) {
        setSel(null);
        return;
      }
      const sid = (el.closest("[data-sid]") as HTMLElement | null)?.dataset.sid;
      if (!sid) return;
      const s = { sid, path: el.dataset.el! };
      const st = current(s);
      const m = mobile();
      drag = { s, el, x0: e.clientX, y0: e.clientY, bx: (m ? st.mx : st.dx) ?? 0, by: (m ? st.my : st.dy) ?? 0, moved: false };
      setSel(s);
      setRect(el.getBoundingClientRect());
      post({ type: "selectSection", id: sid });
    };
    const move = (e: PointerEvent) => {
      if (!drag) return;
      const dx = e.clientX - drag.x0;
      const dy = e.clientY - drag.y0;
      if (!drag.moved && Math.abs(dx) + Math.abs(dy) < 3) return;
      drag.moved = true;
      const m = mobile();
      drag.el.classList.add("mv");
      drag.el.style.setProperty(m ? "--mx" : "--dx", `${Math.round(drag.bx + dx)}px`);
      drag.el.style.setProperty(m ? "--my" : "--dy", `${Math.round(drag.by + dy)}px`);
      setRect(drag.el.getBoundingClientRect());
    };
    const up = (e: PointerEvent) => {
      if (!drag) return;
      if (drag.moved) {
        const x = Math.round(drag.bx + e.clientX - drag.x0);
        const y = Math.round(drag.by + e.clientY - drag.y0);
        sendPatch(drag.s, mobile() ? { mx: x, my: y } : { dx: x, dy: y });
      }
      drag = null;
    };
    const click = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("[data-toolbar]")) return;
      e.preventDefault();
      e.stopPropagation();
    };
    document.addEventListener("pointerdown", down, true);
    document.addEventListener("pointermove", move, true);
    document.addEventListener("pointerup", up, true);
    document.addEventListener("click", click, true);
    return () => {
      document.removeEventListener("pointerdown", down, true);
      document.removeEventListener("pointermove", move, true);
      document.removeEventListener("pointerup", up, true);
      document.removeEventListener("click", click, true);
    };
  }, [mode, post, sendPatch]);

  /* ---- teclado: Delete exclui, setas ajustam ---- */
  useEffect(() => {
    if (mode !== "mover" || !sel) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        sendPatch(sel, { hidden: true });
        setSel(null);
        return;
      }
      const step = e.shiftKey ? 10 : 1;
      const d = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[e.key];
      if (!d) return;
      e.preventDefault();
      const st = current(sel);
      const m = mobile();
      sendPatch(sel, m ? { mx: (st.mx ?? 0) + d[0], my: (st.my ?? 0) + d[1] } : { dx: (st.dx ?? 0) + d[0], dy: (st.dy ?? 0) + d[1] });
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [mode, sel, sendPatch]);

  /* ---- manter a barrinha grudada no elemento ---- */
  useEffect(() => {
    if (!sel) return;
    const upd = () => {
      const el = findEl(sel);
      setRect(el ? el.getBoundingClientRect() : null);
    };
    upd();
    window.addEventListener("scroll", upd, true);
    window.addEventListener("resize", upd);
    return () => {
      window.removeEventListener("scroll", upd, true);
      window.removeEventListener("resize", upd);
    };
  }, [sel, page]);

  if (!page) return <div className="grid min-h-screen place-items-center text-sm text-zinc-500">Carregando preview…</div>;

  const selKey = sel ? `${sel.sid}:${sel.path}` : null;

  return (
    <>
      <PageRenderer
        page={page}
        editable
        mode={mode}
        selectedId={selected}
        selectedEl={mode === "mover" ? selKey : null}
        onSelect={(sid, path) => {
          setSelected(sid);
          post({ type: "select", id: sid, path });
        }}
        onEdit={(sid, path, value) => post({ type: "edit", id: sid, path, value })}
      />
      {mode === "mover" && sel && rect && (
        <div
          data-toolbar
          className="fixed z-[100] flex items-center gap-1 rounded-lg bg-zinc-900 p-1 text-xs font-medium text-white shadow-xl"
          style={{ left: Math.max(8, Math.min(rect.left, window.innerWidth - 260)), top: rect.top > 48 ? rect.top - 42 : rect.bottom + 8 }}
        >
          <span className="px-2 text-zinc-400">{mobile() ? "Celular" : "Computador"}</span>
          <button
            className="cursor-pointer rounded-md px-2.5 py-1.5 hover:bg-white/15"
            onClick={() => sendPatch(sel, mobile() ? { mx: 0, my: 0 } : { dx: 0, dy: 0 })}
          >
            Posição original
          </button>
          <button
            className="cursor-pointer rounded-md bg-red-500 px-2.5 py-1.5 hover:bg-red-600"
            onClick={() => {
              sendPatch(sel, { hidden: true });
              setSel(null);
            }}
          >
            Excluir
          </button>
        </div>
      )}
    </>
  );
}

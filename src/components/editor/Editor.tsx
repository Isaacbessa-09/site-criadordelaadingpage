"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, Check, Copy, ExternalLink, FileDown, Globe, Layers, Loader2, Monitor, Palette, PenLine, Redo2, Smartphone,
  Sparkles, Tablet, Undo2, X,
} from "lucide-react";
import type { PageDoc } from "@/lib/types";
import { AiPanel, ContentPanel, DesignPanel, SectionsPanel } from "./panels";
import { actions, useEditor } from "./store";
import { inputCls } from "./ui";

const DEVICES = {
  desktop: { w: "100%", icon: Monitor, label: "Computador" },
  tablet: { w: "820px", icon: Tablet, label: "Tablet" },
  mobile: { w: "390px", icon: Smartphone, label: "Celular" },
} as const;

const slugify = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);

export function Editor({ id }: { id: string }) {
  const page = useEditor((s) => s.page);
  const tab = useEditor((s) => s.tab);
  const setTab = useEditor((s) => s.setTab);
  const selectedId = useEditor((s) => s.selectedId);
  const canUndo = useEditor((s) => s.past.length > 0);
  const canRedo = useEditor((s) => s.future.length > 0);
  const [device, setDevice] = useState<keyof typeof DEVICES>("desktop");
  const [save, setSave] = useState<"saved" | "saving" | "error">("saved");
  const [pubOpen, setPubOpen] = useState(false);
  const [error, setError] = useState("");
  const frame = useRef<HTMLIFrameElement>(null);
  const loaded = useRef(false);

  /* carregar */
  useEffect(() => {
    fetch(`/api/pages/${id}`).then(async (r) => {
      if (!r.ok) return setError((await r.json().catch(() => null))?.error || "Página não encontrada.");
      useEditor.getState().load(await r.json());
      loaded.current = true;
    });
  }, [id]);

  /* enviar para o iframe */
  const send = useCallback((msg: object) => frame.current?.contentWindow?.postMessage({ __ls: true, ...msg }, location.origin), []);
  useEffect(() => {
    if (page) send({ type: "page", page });
  }, [page, send]);
  useEffect(() => {
    send({ type: "select", id: selectedId, scroll: true });
  }, [selectedId, send]);

  /* mensagens do iframe */
  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e.origin !== location.origin || !e.data?.__ls) return;
      const st = useEditor.getState();
      if (e.data.type === "ready" && st.page) {
        send({ type: "page", page: st.page });
        send({ type: "select", id: st.selectedId });
      }
      if (e.data.type === "select") {
        st.select(e.data.id, e.data.path ?? null);
        if (e.data.path || st.tab === "dobras") st.setTab("editar");
      }
      if (e.data.type === "edit") actions.prop(e.data.id, e.data.path, e.data.value);
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [send]);

  /* salvar automaticamente */
  const saveNow = useCallback(async (p: PageDoc) => {
    setSave("saving");
    try {
      const r = await fetch(`/api/pages/${p.id}`, { method: "PUT", body: JSON.stringify(p) });
      if (!r.ok) throw new Error();
      setSave("saved");
    } catch {
      setSave("error");
    }
  }, []);
  useEffect(() => {
    if (!page || !loaded.current) return;
    setSave("saving");
    const t = setTimeout(() => saveNow(page), 700);
    return () => clearTimeout(t);
  }, [page, saveNow]);

  /* atalhos */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest("input, textarea, select, [contenteditable]")) return;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) useEditor.getState().redo();
        else useEditor.getState().undo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
        e.preventDefault();
        useEditor.getState().redo();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (error) return <div className="grid min-h-screen place-items-center text-zinc-500">{error}</div>;
  if (!page) return <div className="grid min-h-screen place-items-center text-zinc-500"><Loader2 className="animate-spin" /></div>;

  const tabs = [
    { id: "dobras", label: "Dobras", icon: Layers },
    { id: "editar", label: "Editar", icon: PenLine },
    { id: "design", label: "Design", icon: Palette },
    { id: "ia", label: "IA", icon: Sparkles },
  ] as const;

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-zinc-100 text-zinc-900">
      {/* Barra superior */}
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-zinc-200 bg-white px-3">
        <Link href="/" className="grid size-9 place-items-center rounded-lg hover:bg-zinc-100" aria-label="Voltar">
          <ArrowLeft size={18} />
        </Link>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold">{page.name}</div>
          <div className="flex items-center gap-1 text-[11px] text-zinc-500">
            {save === "saving" ? <><Loader2 size={11} className="animate-spin" /> Salvando…</> : save === "error" ? <span className="text-red-600">Erro ao salvar</span> : <><Check size={11} /> Salvo</>}
            {page.published && page.slug && <span className="ml-2 inline-flex items-center gap-1 text-emerald-600"><Globe size={11} /> Publicada</span>}
          </div>
        </div>
        <div className="mx-auto flex items-center gap-1 rounded-lg bg-zinc-100 p-1">
          {(Object.keys(DEVICES) as (keyof typeof DEVICES)[]).map((k) => {
            const D = DEVICES[k];
            return (
              <button key={k} title={D.label} aria-label={D.label} onClick={() => setDevice(k)} className={`grid size-8 cursor-pointer place-items-center rounded-md ${device === k ? "bg-white shadow-sm" : "text-zinc-500 hover:text-zinc-900"}`}>
                <D.icon size={16} />
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-1">
          <button disabled={!canUndo} onClick={() => useEditor.getState().undo()} title="Desfazer (Ctrl+Z)" aria-label="Desfazer" className="grid size-9 cursor-pointer place-items-center rounded-lg hover:bg-zinc-100 disabled:opacity-30">
            <Undo2 size={17} />
          </button>
          <button disabled={!canRedo} onClick={() => useEditor.getState().redo()} title="Refazer (Ctrl+Shift+Z)" aria-label="Refazer" className="grid size-9 cursor-pointer place-items-center rounded-lg hover:bg-zinc-100 disabled:opacity-30">
            <Redo2 size={17} />
          </button>
          <button
            onClick={async () => {
              await saveNow(page);
              window.open(`/view/${page.id}?print=1`, "_blank");
            }}
            className="ml-2 hidden h-9 cursor-pointer items-center gap-2 rounded-lg border border-zinc-200 px-3 text-sm font-medium hover:bg-zinc-50 md:inline-flex"
          >
            <FileDown size={16} /> PDF
          </button>
          <button onClick={() => setPubOpen(true)} className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white hover:bg-indigo-500">
            <Globe size={16} /> Publicar
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* Painel esquerdo */}
        <aside className="flex w-[380px] shrink-0 flex-col border-r border-zinc-200 bg-white">
          <nav className="grid shrink-0 grid-cols-4 border-b border-zinc-200 p-1.5">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex cursor-pointer flex-col items-center gap-1 rounded-lg py-2 text-[11px] font-semibold transition ${tab === t.id ? "bg-indigo-50 text-indigo-700" : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"}`}
              >
                <t.icon size={17} /> {t.label}
              </button>
            ))}
          </nav>
          <div className="min-h-0 flex-1 overflow-y-auto">
            {tab === "dobras" && <SectionsPanel />}
            {tab === "editar" && <ContentPanel />}
            {tab === "design" && <DesignPanel />}
            {tab === "ia" && <AiPanel />}
          </div>
        </aside>

        {/* Preview */}
        <main className="min-w-0 flex-1 overflow-auto p-4">
          <div className="mx-auto h-full overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition-[width] duration-300" style={{ width: DEVICES[device].w, maxWidth: "100%" }}>
            <iframe ref={frame} src={`/preview/${page.id}`} title="Preview" className="h-full w-full" />
          </div>
        </main>
      </div>

      {pubOpen && <PublishDialog onClose={() => setPubOpen(false)} saveNow={saveNow} />}
    </div>
  );
}

function PublishDialog({ onClose, saveNow }: { onClose: () => void; saveNow: (p: PageDoc) => Promise<void> }) {
  const page = useEditor((s) => s.page)!;
  const [slug, setSlug] = useState(page.slug ?? slugify(page.brand.name || page.name));
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [copied, setCopied] = useState(false);
  const url = page.slug ? `${location.origin}/p/${page.slug}` : "";

  async function publish() {
    setBusy(true);
    setErr("");
    await saveNow(page);
    const r = await fetch(`/api/pages/${page.id}/publish`, { method: "POST", body: JSON.stringify({ slug }) });
    const d = await r.json();
    setBusy(false);
    if (!r.ok) return setErr(d.error);
    useEditor.getState().patchRaw({ slug: d.slug, published: true, publishedAt: d.publishedAt });
  }
  async function unpublish() {
    setBusy(true);
    const r = await fetch(`/api/pages/${page.id}/publish`, { method: "DELETE" });
    setBusy(false);
    if (r.ok) useEditor.getState().patchRaw({ published: false });
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-1 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Publicar página</h3>
          <button onClick={onClose} className="grid size-8 cursor-pointer place-items-center rounded-lg hover:bg-zinc-100" aria-label="Fechar"><X size={18} /></button>
        </div>
        <p className="mb-5 text-sm text-zinc-500">Escolha o endereço. Sempre que fizer alterações, clique em publicar de novo para atualizar o site.</p>
        <label className="text-xs font-semibold text-zinc-700">Endereço (slug)</label>
        <div className="mt-1.5 flex items-center overflow-hidden rounded-lg border border-zinc-200 focus-within:border-indigo-500">
          <span className="bg-zinc-50 px-3 py-2 text-sm text-zinc-500">/p/</span>
          <input className="min-w-0 flex-1 px-2 py-2 text-sm outline-none" value={slug} onChange={(e) => setSlug(slugify(e.target.value))} />
        </div>
        {err && <p className="mt-2 text-sm text-red-600">{err}</p>}
        <button disabled={busy || !slug} onClick={publish} className="mt-4 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60">
          {busy ? <Loader2 size={16} className="animate-spin" /> : <Globe size={16} />} {page.published ? "Atualizar publicação" : "Publicar agora"}
        </button>

        {page.published && url && (
          <div className="mt-5 rounded-xl bg-emerald-50 p-4">
            <div className="text-xs font-semibold text-emerald-800">No ar em:</div>
            <div className="mt-1 flex items-center gap-2">
              <input readOnly value={url} className={`${inputCls} bg-white text-xs`} />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(url);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                }}
                className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-lg bg-white hover:bg-zinc-50"
                aria-label="Copiar link"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
              <a href={url} target="_blank" className="grid size-9 shrink-0 place-items-center rounded-lg bg-white hover:bg-zinc-50" aria-label="Abrir">
                <ExternalLink size={16} />
              </a>
            </div>
            <div className="mt-3 flex justify-between text-xs">
              <a href={`/p/${page.slug}?print=1`} target="_blank" className="inline-flex items-center gap-1 font-medium text-emerald-800 hover:underline"><FileDown size={13} /> Baixar PDF</a>
              <button onClick={unpublish} className="cursor-pointer font-medium text-red-600 hover:underline">Tirar do ar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

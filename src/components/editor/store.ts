"use client";

import { create } from "zustand";
import { setIn, uid } from "@/lib/path";
import type { PageDoc, Section, SectionStyle, Theme } from "@/lib/types";

type Tab = "dobras" | "editar" | "design" | "ia";

interface EditorState {
  page: PageDoc | null;
  selectedId: string | null;
  focusPath: string | null;
  tab: Tab;
  past: PageDoc[];
  future: PageDoc[];
  lastTag: string | null;
  lastTime: number;
  load: (p: PageDoc) => void;
  /** Altera a página registrando histórico. "tag" agrupa alterações seguidas (ex: digitação). */
  set: (fn: (p: PageDoc) => PageDoc, tag?: string) => void;
  /** Altera sem histórico (ex: status de publicação). */
  patchRaw: (patch: Partial<PageDoc>) => void;
  undo: () => void;
  redo: () => void;
  select: (id: string | null, path?: string | null) => void;
  setTab: (t: Tab) => void;
}

export const useEditor = create<EditorState>((set, get) => ({
  page: null,
  selectedId: null,
  focusPath: null,
  tab: "dobras",
  past: [],
  future: [],
  lastTag: null,
  lastTime: 0,
  load: (page) => set({ page, past: [], future: [], selectedId: null }),
  set: (fn, tag) => {
    const { page, past, lastTag, lastTime } = get();
    if (!page) return;
    const next = fn(page);
    const now = Date.now();
    const coalesce = tag && tag === lastTag && now - lastTime < 1200;
    set({
      page: next,
      past: coalesce ? past : [...past.slice(-80), page],
      future: [],
      lastTag: tag ?? null,
      lastTime: now,
    });
  },
  patchRaw: (patch) => {
    const { page } = get();
    if (page) set({ page: { ...page, ...patch } });
  },
  undo: () => {
    const { past, page, future } = get();
    if (!past.length || !page) return;
    set({ page: past[past.length - 1], past: past.slice(0, -1), future: [page, ...future], lastTag: null });
  },
  redo: () => {
    const { past, page, future } = get();
    if (!future.length || !page) return;
    set({ page: future[0], future: future.slice(1), past: [...past, page], lastTag: null });
  },
  select: (id, path = null) => set({ selectedId: id, focusPath: path }),
  setTab: (tab) => set({ tab }),
}));

/* ---------- ações ---------- */
const E = () => useEditor.getState();

export const actions = {
  prop(id: string, path: string, value: unknown) {
    E().set((p) => ({ ...p, sections: p.sections.map((s) => (s.id === id ? { ...s, props: setIn(s.props, path, value) } : s)) }), `prop:${id}:${path}`);
  },
  style(id: string, patch: Partial<SectionStyle>) {
    E().set((p) => ({ ...p, sections: p.sections.map((s) => (s.id === id ? { ...s, style: { ...s.style, ...patch } } : s)) }));
  },
  theme(patch: Partial<Theme>, tag?: string) {
    E().set((p) => ({ ...p, theme: { ...p.theme, ...patch } }), tag);
  },
  color(key: keyof Theme["colors"], value: string) {
    E().set((p) => ({ ...p, theme: { ...p.theme, colors: { ...p.theme.colors, [key]: value } } }), `color:${key}`);
  },
  page(patch: Partial<PageDoc>, tag?: string) {
    E().set((p) => ({ ...p, ...patch }), tag);
  },
  replaceSection(section: Section) {
    E().set((p) => ({ ...p, sections: p.sections.map((s) => (s.id === section.id ? section : s)) }));
  },
  add(section: Section, afterId?: string | null) {
    E().set((p) => {
      const list = [...p.sections];
      let idx = afterId ? list.findIndex((s) => s.id === afterId) + 1 : -1;
      if (idx <= 0) {
        const footer = list.findIndex((s) => s.type === "footer");
        idx = footer >= 0 ? footer : list.length;
      }
      list.splice(idx, 0, section);
      return { ...p, sections: list };
    });
    E().select(section.id);
  },
  remove(id: string) {
    E().set((p) => ({ ...p, sections: p.sections.filter((s) => s.id !== id) }));
    if (E().selectedId === id) E().select(null);
  },
  duplicate(id: string) {
    const s = E().page?.sections.find((x) => x.id === id);
    if (s) actions.add({ ...structuredClone(s), id: uid(s.type) }, id);
  },
  move(from: number, to: number) {
    E().set((p) => {
      const list = [...p.sections];
      if (to < 0 || to >= list.length) return p;
      const [it] = list.splice(from, 1);
      list.splice(to, 0, it);
      return { ...p, sections: list };
    });
  },
};

/* ---------- utilidades ---------- */
/** Comprime fotos no navegador (máx. 2000px, WebP) antes de enviar. SVG e GIF vão como estão. */
async function compressImage(file: File, max = 2000): Promise<File> {
  if (!/^image\/(jpeg|png|webp|avif)$/.test(file.type)) return file;
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    await new Promise((r, j) => {
      img.onload = r;
      img.onerror = j;
      img.src = url;
    });
    const scale = Math.min(1, max / Math.max(img.width, img.height));
    const c = document.createElement("canvas");
    c.width = Math.round(img.width * scale);
    c.height = Math.round(img.height * scale);
    c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
    // PNG pode ter transparência (logo): WebP mantém
    const blob = await new Promise<Blob | null>((r) => c.toBlob(r, "image/webp", 0.85));
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], file.name.replace(/\.\w+$/, "") + ".webp", { type: "image/webp" });
  } catch {
    return file;
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function uploadFile(original: File): Promise<string> {
  const file = await compressImage(original);
  const fd = new FormData();
  fd.append("file", file);
  const r = await fetch("/api/upload", { method: "POST", body: fd });
  const d = await r.json();
  if (!r.ok) throw new Error(d.error || "Falha no upload");
  return d.url;
}

/** Reduz a imagem e devolve base64 (para enviar à IA). */
export async function fileToAiImage(file: File, max = 1200): Promise<{ media_type: string; data: string; preview: string }> {
  const url = URL.createObjectURL(file);
  const img = new Image();
  await new Promise((r, j) => {
    img.onload = r;
    img.onerror = j;
    img.src = url;
  });
  const scale = Math.min(1, max / Math.max(img.width, img.height));
  const c = document.createElement("canvas");
  c.width = Math.round(img.width * scale);
  c.height = Math.round(img.height * scale);
  c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
  URL.revokeObjectURL(url);
  const dataUrl = c.toDataURL("image/jpeg", 0.8);
  return { media_type: "image/jpeg", data: dataUrl.split(",")[1], preview: dataUrl };
}

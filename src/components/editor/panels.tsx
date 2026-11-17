"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import {
  AlignCenter, AlignLeft, AlignRight, ArrowDown, ArrowUp, ChevronDown, Copy, Eye, EyeOff, GripVertical, Loader2,
  Paperclip, Plus, Sparkles, Trash2, Wand2, X,
} from "lucide-react";
import { Icon } from "@/components/site/primitives";
import { FONTS } from "@/lib/fonts";
import { uid } from "@/lib/path";
import { ICONS, SECTION_MAP, SECTIONS, type Field } from "@/lib/registry";
import type { Anim, Padding, Section, Theme, Tone } from "@/lib/types";
import { actions, fileToAiImage, useEditor } from "./store";
import { ColorField, Group, ImageField, Label, Segmented, inputCls } from "./ui";

/* ===================== DOBRAS ===================== */
export function SectionsPanel() {
  const page = useEditor((s) => s.page)!;
  const selectedId = useEditor((s) => s.selectedId);
  const select = useEditor((s) => s.select);
  const setTab = useEditor((s) => s.setTab);
  const [lib, setLib] = useState(false);
  const drag = useRef<number | null>(null);
  const [over, setOver] = useState<number | null>(null);

  return (
    <div>
      <Group
        title={`Dobras (${page.sections.length})`}
        actions={
          <button onClick={() => setLib(true)} className="inline-flex cursor-pointer items-center gap-1 rounded-md bg-indigo-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500">
            <Plus size={14} /> Adicionar
          </button>
        }
      >
        <ul className="flex flex-col gap-1.5">
          {page.sections.map((s, i) => (
            <li
              key={s.id}
              draggable
              onDragStart={() => (drag.current = i)}
              onDragOver={(e) => {
                e.preventDefault();
                setOver(i);
              }}
              onDragLeave={() => setOver(null)}
              onDrop={() => {
                if (drag.current !== null && drag.current !== i) actions.move(drag.current, i);
                drag.current = null;
                setOver(null);
              }}
              onClick={() => select(s.id)}
              onDoubleClick={() => {
                select(s.id);
                setTab("editar");
              }}
              className={`group flex cursor-pointer items-center gap-2 rounded-lg border px-2 py-2 text-sm transition ${
                selectedId === s.id ? "border-indigo-500 bg-indigo-50" : "border-zinc-200 bg-white hover:border-zinc-300"
              } ${over === i ? "ring-2 ring-indigo-400" : ""} ${s.style.hidden ? "opacity-50" : ""}`}
            >
              <GripVertical size={15} className="shrink-0 cursor-grab text-zinc-400" />
              <span className="min-w-0 flex-1 truncate font-medium">{SECTION_MAP[s.type]?.label ?? s.type}</span>
              <div className="hidden items-center group-hover:flex">
                <IconBtn label="Subir" onClick={() => actions.move(i, i - 1)}><ArrowUp size={14} /></IconBtn>
                <IconBtn label="Descer" onClick={() => actions.move(i, i + 1)}><ArrowDown size={14} /></IconBtn>
                <IconBtn label={s.style.hidden ? "Mostrar" : "Ocultar"} onClick={() => actions.style(s.id, { hidden: !s.style.hidden })}>
                  {s.style.hidden ? <EyeOff size={14} /> : <Eye size={14} />}
                </IconBtn>
                <IconBtn label="Duplicar" onClick={() => actions.duplicate(s.id)}><Copy size={14} /></IconBtn>
                <IconBtn
                  label="Excluir"
                  danger
                  onClick={() => confirm(`Excluir a dobra "${SECTION_MAP[s.type]?.label}"? (dá para desfazer com Ctrl+Z)`) && actions.remove(s.id)}
                >
                  <Trash2 size={14} />
                </IconBtn>
              </div>
            </li>
          ))}
        </ul>
        <p className="text-xs leading-relaxed text-zinc-500">
          Arraste para reordenar. Clique em qualquer texto do preview para editar direto na página. Duplo clique numa dobra abre a edição.
        </p>
      </Group>

      {lib && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={() => setLib(false)}>
          <div className="max-h-[85vh] w-full max-w-2xl overflow-auto rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Adicionar dobra</h3>
              <IconBtn label="Fechar" onClick={() => setLib(false)}><X size={18} /></IconBtn>
            </div>
            <button
              onClick={() => {
                setLib(false);
                setTab("ia");
              }}
              className="mb-4 flex w-full cursor-pointer items-center gap-3 rounded-xl border border-indigo-200 bg-indigo-50 p-4 text-left hover:bg-indigo-100"
            >
              <Sparkles className="text-indigo-600" size={20} />
              <span>
                <span className="block font-semibold text-indigo-900">Descrever para a IA criar</span>
                <span className="text-sm text-indigo-700">Explique o que você quer na dobra e a IA monta com a copy pronta.</span>
              </span>
            </button>
            <div className="grid gap-2 sm:grid-cols-2">
              {SECTIONS.map((d) => (
                <button
                  key={d.type}
                  onClick={() => {
                    actions.add({ id: uid(d.type), type: d.type, props: structuredClone(d.defaults.props), style: { ...d.defaults.style } }, selectedId);
                    setLib(false);
                    setTab("editar");
                  }}
                  className="cursor-pointer rounded-xl border border-zinc-200 p-4 text-left transition hover:border-indigo-400 hover:bg-zinc-50"
                >
                  <span className="block text-sm font-semibold">{d.label}</span>
                  <span className="text-xs text-zinc-500">{d.description}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function IconBtn({ children, onClick, label, danger }: { children: React.ReactNode; onClick: () => void; label: string; danger?: boolean }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`grid size-7 cursor-pointer place-items-center rounded-md text-zinc-500 ${danger ? "hover:bg-red-50 hover:text-red-600" : "hover:bg-zinc-100 hover:text-zinc-900"}`}
    >
      {children}
    </button>
  );
}

/* ===================== EDITAR (seção selecionada) ===================== */
const TONES: { value: Tone; label: string; color: keyof Theme["colors"] }[] = [
  { value: "base", label: "Fundo", color: "bg" },
  { value: "surface", label: "Superfície", color: "surface" },
  { value: "primary", label: "Primária", color: "primary" },
  { value: "accent", label: "Acento", color: "accent" },
  { value: "dark", label: "Escura", color: "dark" },
];

const ANIMS: { value: Anim; label: string }[] = [
  { value: "subir", label: "Subir" },
  { value: "fade", label: "Aparecer" },
  { value: "zoom", label: "Zoom" },
  { value: "lateral", label: "Lateral" },
  { value: "nenhuma", label: "Nenhuma" },
];

export function ContentPanel() {
  const page = useEditor((s) => s.page)!;
  const selectedId = useEditor((s) => s.selectedId);
  const focusPath = useEditor((s) => s.focusPath);
  const s = page.sections.find((x) => x.id === selectedId);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!focusPath || !box.current) return;
    const el = box.current.querySelector(`[data-path="${focusPath}"]`) as HTMLElement | null;
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("ring-2", "ring-indigo-400");
      setTimeout(() => el.classList.remove("ring-2", "ring-indigo-400"), 1600);
    }
  }, [focusPath, selectedId]);

  if (!s) {
    return <p className="p-6 text-sm text-zinc-500">Selecione uma dobra na lista ou clique nela no preview para editar.</p>;
  }
  const def = SECTION_MAP[s.type];
  return (
    <div ref={box}>
      <div className="border-b border-zinc-200 bg-zinc-50 px-5 py-4">
        <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-500">Editando</div>
        <div className="text-lg font-semibold">{def?.label}</div>
      </div>

      <Group title="Layout e posição">
        {def?.variants && (
          <div>
            <Label>Modelo</Label>
            <select className={inputCls} value={s.style.variant} onChange={(e) => actions.style(s.id, { variant: e.target.value })}>
              {def.variants.map((v) => (
                <option key={v.value} value={v.value}>{v.label}</option>
              ))}
            </select>
          </div>
        )}
        <div>
          <Label>Posição do texto</Label>
          <Segmented
            value={s.style.align}
            onChange={(v) => actions.style(s.id, { align: v })}
            options={[
              { value: "left", label: <AlignLeft size={15} />, title: "Esquerda" },
              { value: "center", label: <AlignCenter size={15} />, title: "Centro" },
              { value: "right", label: <AlignRight size={15} />, title: "Direita" },
            ]}
          />
        </div>
        {s.type !== "navbar" && (
          <div>
            <Label>Cor de fundo</Label>
            <div className="grid grid-cols-5 gap-1.5">
              {TONES.map((t) => (
                <button
                  key={t.value}
                  title={t.label}
                  onClick={() => actions.style(s.id, { tone: t.value })}
                  className={`flex cursor-pointer flex-col items-center gap-1 rounded-lg border p-1.5 text-[10px] ${s.style.tone === t.value ? "border-indigo-500 ring-2 ring-indigo-500/20" : "border-zinc-200"}`}
                >
                  <span className="h-6 w-full rounded border border-black/10" style={{ background: page.theme.colors[t.color] }} />
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        )}
        {s.type !== "navbar" && s.type !== "hero" && (
          <div>
            <Label>Espaçamento</Label>
            <Segmented<Padding>
              value={s.style.padding}
              onChange={(v) => actions.style(s.id, { padding: v })}
              options={[{ value: "sm", label: "Pequeno" }, { value: "md", label: "Médio" }, { value: "lg", label: "Grande" }]}
            />
          </div>
        )}
        <div>
          <Label>Animação ao rolar</Label>
          <select className={inputCls} value={s.style.anim} onChange={(e) => actions.style(s.id, { anim: e.target.value as Anim })}>
            {ANIMS.map((a) => (
              <option key={a.value} value={a.value}>{a.label}</option>
            ))}
          </select>
        </div>
      </Group>

      <Group title="Conteúdo">
        {def?.fields.map((f) => (
          <FieldEditor key={f.key} field={f} path={f.key} value={s.props[f.key]} section={s} />
        ))}
      </Group>

      <AiSectionBox section={s} />
    </div>
  );
}

function FieldEditor({ field, path, value, section }: { field: Field; path: string; value: any; section: Section }) {
  const set = (v: any) => actions.prop(section.id, path, v);
  const [open, setOpen] = useState<number | null>(null);

  if (field.type === "list") {
    const items: any[] = Array.isArray(value) ? value : [];
    return (
      <div data-path={path} className="rounded-lg">
        <Label hint={`${items.length} itens`}>{field.label}</Label>
        <div className="flex flex-col gap-1.5">
          {items.map((it, i) => {
            const first = field.fields?.find((x) => x.type !== "image" && x.type !== "icon");
            const title = (first && it?.[first.key]) || `${field.itemLabel} ${i + 1}`;
            const isOpen = open === i;
            return (
              <div key={i} data-path={`${path}.${i}`} className="rounded-lg border border-zinc-200 bg-white transition">
                <div className="flex items-center gap-1 px-2 py-1.5">
                  <button onClick={() => setOpen(isOpen ? null : i)} className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 text-left text-sm">
                    <ChevronDown size={14} className={`shrink-0 transition ${isOpen ? "" : "-rotate-90"}`} />
                    <span className="truncate">{String(title)}</span>
                  </button>
                  <IconBtn label="Subir" onClick={() => i > 0 && set(swap(items, i, i - 1))}><ArrowUp size={13} /></IconBtn>
                  <IconBtn label="Descer" onClick={() => i < items.length - 1 && set(swap(items, i, i + 1))}><ArrowDown size={13} /></IconBtn>
                  <IconBtn label="Remover" danger onClick={() => set(items.filter((_, k) => k !== i))}><Trash2 size={13} /></IconBtn>
                </div>
                {(isOpen || items.length === 1) && (
                  <div className="flex flex-col gap-3 border-t border-zinc-100 p-3">
                    {field.fields?.map((sf) => (
                      <FieldEditor key={sf.key} field={sf} path={`${path}.${i}.${sf.key}`} value={it?.[sf.key]} section={section} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          <button
            onClick={() => {
              const base = items[items.length - 1] ?? Object.fromEntries((field.fields ?? []).map((x) => [x.key, ""]));
              set([...items, structuredClone(base)]);
              setOpen(items.length);
            }}
            className="inline-flex cursor-pointer items-center justify-center gap-1 rounded-lg border border-dashed border-zinc-300 py-2 text-xs font-medium text-zinc-600 hover:border-indigo-400 hover:text-indigo-600"
          >
            <Plus size={14} /> Adicionar {field.itemLabel?.toLowerCase()}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div data-path={path} className="rounded-lg">
      <Label>{field.label}</Label>
      {field.type === "image" ? (
        <ImageField value={value} onChange={set} compact={path.includes(".")} />
      ) : field.type === "textarea" ? (
        <textarea className={`${inputCls} min-h-[72px] resize-y`} rows={Math.min(6, Math.max(2, Math.ceil(String(value ?? "").length / 42)))} value={value ?? ""} onChange={(e) => set(e.target.value)} />
      ) : field.type === "icon" ? (
        <IconPicker value={value} onChange={set} />
      ) : (
        <input className={inputCls} value={value ?? ""} onChange={(e) => set(e.target.value)} />
      )}
    </div>
  );
}

const swap = (arr: any[], a: number, b: number) => {
  const c = [...arr];
  [c[a], c[b]] = [c[b], c[a]];
  return c;
};

function IconPicker({ value, onChange }: { value?: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setOpen(!open)} className={`${inputCls} flex cursor-pointer items-center gap-2`}>
        <Icon name={value} size={16} /> {value || "Escolher"} <ChevronDown size={14} className="ml-auto" />
      </button>
      {open && (
        <div className="mt-1.5 grid grid-cols-8 gap-1 rounded-lg border border-zinc-200 bg-white p-2">
          {ICONS.map((n) => (
            <button
              key={n}
              title={n}
              onClick={() => {
                onChange(n);
                setOpen(false);
              }}
              className={`grid aspect-square cursor-pointer place-items-center rounded-md hover:bg-zinc-100 ${value === n ? "bg-indigo-100 text-indigo-700" : ""}`}
            >
              <Icon name={n} size={16} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function AiSectionBox({ section }: { section: Section }) {
  const page = useEditor((s) => s.page)!;
  const [prompt, setPrompt] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  async function run() {
    setBusy(true);
    setErr("");
    try {
      const r = await fetch("/api/ai", { method: "POST", body: JSON.stringify({ mode: "rewrite-section", page, sectionId: section.id, prompt }) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      actions.replaceSection(d.section);
      setPrompt("");
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Group title="IA nesta dobra">
      <textarea
        className={`${inputCls} min-h-[64px]`}
        placeholder="Ex: deixe mais curto e urgente, foque em iniciantes…"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button
        disabled={busy}
        onClick={run}
        className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
      >
        {busy ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />} Reescrever esta dobra
      </button>
      {err && <p className="text-xs text-red-600">{err}</p>}
    </Group>
  );
}

/* ===================== DESIGN ===================== */
const COLOR_LABELS: { key: keyof Theme["colors"]; label: string }[] = [
  { key: "bg", label: "Fundo" },
  { key: "surface", label: "Superfície" },
  { key: "ink", label: "Texto" },
  { key: "muted", label: "Texto secundário" },
  { key: "primary", label: "Primária" },
  { key: "onPrimary", label: "Texto na primária" },
  { key: "accent", label: "Acento (botões)" },
  { key: "onAccent", label: "Texto no acento" },
  { key: "dark", label: "Escura" },
  { key: "onDark", label: "Texto na escura" },
];

export function DesignPanel() {
  const page = useEditor((s) => s.page)!;
  const t = page.theme;
  return (
    <div>
      <Group title="Marca">
        <div>
          <Label>Nome da marca</Label>
          <input className={inputCls} value={page.brand.name} onChange={(e) => actions.page({ brand: { ...page.brand, name: e.target.value } }, "brand-name")} />
        </div>
        <div>
          <Label hint="PNG ou SVG com fundo transparente">Logo</Label>
          <ImageField value={page.brand.logo} onChange={(v) => actions.page({ brand: { ...page.brand, logo: v } })} />
        </div>
      </Group>

      <Group title="Cores">
        <div className="grid grid-cols-2 gap-2">
          {COLOR_LABELS.map((c) => (
            <ColorField key={c.key} label={c.label} value={t.colors[c.key]} onChange={(v) => actions.color(c.key, v)} />
          ))}
        </div>
      </Group>

      <Group title="Tipografia">
        <div>
          <Label>Fonte dos títulos</Label>
          <FontSelect value={t.fontHeading} onChange={(v) => actions.theme({ fontHeading: v })} />
        </div>
        <div>
          <Label>Fonte dos textos</Label>
          <FontSelect value={t.fontBody} onChange={(v) => actions.theme({ fontBody: v })} />
        </div>
        <div>
          <Label>Peso dos títulos</Label>
          <Segmented
            value={String(t.headingWeight)}
            onChange={(v) => actions.theme({ headingWeight: Number(v) })}
            options={["400", "500", "600", "700", "800"].map((w) => ({ value: w, label: w }))}
          />
        </div>
        <div>
          <Label hint={`${t.headingTracking}em`}>Espaçamento entre letras (títulos)</Label>
          <input type="range" min={-0.06} max={0.06} step={0.005} value={t.headingTracking} onChange={(e) => actions.theme({ headingTracking: Number(e.target.value) }, "tracking")} className="w-full accent-indigo-600" />
        </div>
        <label className="flex cursor-pointer items-center justify-between text-sm">
          <span className="font-medium text-zinc-700">Títulos em MAIÚSCULAS</span>
          <input type="checkbox" checked={t.headingUppercase} onChange={(e) => actions.theme({ headingUppercase: e.target.checked })} className="size-4 accent-indigo-600" />
        </label>
      </Group>

      <Group title="Formas">
        <div>
          <Label hint={`${t.radius}px`}>Arredondamento</Label>
          <input type="range" min={0} max={40} value={t.radius} onChange={(e) => actions.theme({ radius: Number(e.target.value) }, "radius")} className="w-full accent-indigo-600" />
        </div>
      </Group>

      <Group title="Página">
        <div>
          <Label>Nome interno</Label>
          <input className={inputCls} value={page.name} onChange={(e) => actions.page({ name: e.target.value }, "name")} />
        </div>
        <div>
          <Label>Título no Google (SEO)</Label>
          <input className={inputCls} value={page.seo.title} onChange={(e) => actions.page({ seo: { ...page.seo, title: e.target.value } }, "seo-t")} />
        </div>
        <div>
          <Label>Descrição no Google (SEO)</Label>
          <textarea className={inputCls} rows={3} value={page.seo.description} onChange={(e) => actions.page({ seo: { ...page.seo, description: e.target.value } }, "seo-d")} />
        </div>
      </Group>
    </div>
  );
}

function FontSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const groups = { sans: "Sem serifa", serif: "Com serifa", display: "Display / impacto" } as const;
  return (
    <select className={inputCls} value={value} onChange={(e) => onChange(e.target.value)}>
      {(Object.keys(groups) as (keyof typeof groups)[]).map((g) => (
        <optgroup key={g} label={groups[g]}>
          {FONTS.filter((f) => f.kind === g).map((f) => (
            <option key={f.name} value={f.name}>{f.name}</option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}

/* ===================== IA ===================== */
type AiImg = { media_type: string; data: string; preview: string };

export function AiPanel() {
  const page = useEditor((s) => s.page)!;
  const selectedId = useEditor((s) => s.selectedId);
  const [images, setImages] = useState<AiImg[]>([]);
  const [extra, setExtra] = useState("");
  const [newPrompt, setNewPrompt] = useState("");
  const [themePrompt, setThemePrompt] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function call(mode: string, body: object) {
    setBusy(mode);
    setMsg(null);
    try {
      const r = await fetch("/api/ai", {
        method: "POST",
        body: JSON.stringify({ mode, page, images: images.map(({ media_type, data }) => ({ media_type, data })), ...body }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Erro na IA");
      return d;
    } catch (e) {
      setMsg({ ok: false, text: (e as Error).message });
      return null;
    } finally {
      setBusy(null);
    }
  }

  async function addImages(files: FileList | null) {
    if (!files) return;
    const list = await Promise.all(Array.from(files).slice(0, 8 - images.length).map((f) => fileToAiImage(f)));
    setImages((x) => [...x, ...list].slice(0, 8));
  }

  return (
    <div>
      <a href="/configuracoes" target="_blank" className="mx-5 mt-4 flex items-center gap-2 rounded-lg bg-zinc-50 px-3 py-2 text-xs text-zinc-600 hover:bg-zinc-100">
        <Sparkles size={13} /> Chave da IA (Gemini ou Claude): <span className="font-semibold text-indigo-600">Configurações</span>
      </a>
      <Group title="1. Tudo sobre o negócio">
        <p className="-mt-2 text-xs leading-relaxed text-zinc-500">
          Cole aqui tudo o que encontrar: bio do Instagram, textos do site antigo, avaliações do Google, produtos, preços, diferenciais, endereço, horários, público… Quanto mais, melhor.
        </p>
        <textarea
          className={`${inputCls} min-h-[200px] font-mono text-xs`}
          placeholder={"Ex:\nNome: Padel Point\nInstagram: @padelpoint — 'O maior centro de padel da zona sul'\n4 quadras cobertas, aulas a partir de R$ 90...\nAvaliações: 'Melhor estrutura da cidade' — João\nEndereço: ..."}
          value={page.aiInfo ?? ""}
          onChange={(e) => actions.page({ aiInfo: e.target.value }, "aiInfo")}
        />
        <div>
          <Label hint="até 8 imagens">Prints e fotos (Instagram, cardápio, site antigo…)</Label>
          <div className="flex flex-wrap gap-2">
            {images.map((im, i) => (
              <div key={i} className="relative size-14 overflow-hidden rounded-lg border border-zinc-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={im.preview} alt="" className="h-full w-full object-cover" />
                <button onClick={() => setImages(images.filter((_, k) => k !== i))} aria-label="Remover" className="absolute top-0.5 right-0.5 grid size-5 cursor-pointer place-items-center rounded-full bg-black/60 text-white">
                  <X size={11} />
                </button>
              </div>
            ))}
            {images.length < 8 && (
              <button onClick={() => fileRef.current?.click()} className="grid size-14 cursor-pointer place-items-center rounded-lg border border-dashed border-zinc-300 text-zinc-500 hover:border-indigo-400 hover:text-indigo-600" aria-label="Anexar imagens">
                <Paperclip size={18} />
              </button>
            )}
            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => addImages(e.target.files)} />
          </div>
        </div>
        <div>
          <Label>Instruções extras (opcional)</Label>
          <input className={inputCls} placeholder="Ex: tom descontraído, foco em aulas para iniciantes" value={extra} onChange={(e) => setExtra(e.target.value)} />
        </div>
        <button
          disabled={!!busy}
          onClick={async () => {
            if (!(page.aiInfo ?? "").trim() && images.length === 0) {
              setMsg({ ok: false, text: "Cole as informações do negócio ou anexe prints antes." });
              return;
            }
            const d = await call("rewrite-all", { prompt: extra });
            if (d?.page) {
              actions.page({ brand: d.page.brand, seo: d.page.seo, sections: d.page.sections });
              setMsg({ ok: true, text: "Copy reescrita! Use Ctrl+Z para desfazer se quiser." });
            }
          }}
          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-indigo-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
        >
          {busy === "rewrite-all" ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
          {busy === "rewrite-all" ? "Reescrevendo a página…" : "Reescrever toda a copy"}
        </button>
      </Group>

      <Group title="2. Nova dobra com IA">
        <textarea
          className={`${inputCls} min-h-[90px]`}
          placeholder="Ex: uma dobra com os 4 tipos de aula (iniciante, intermediário, kids e particular) com preço de cada uma."
          value={newPrompt}
          onChange={(e) => setNewPrompt(e.target.value)}
        />
        <button
          disabled={!!busy || !newPrompt.trim()}
          onClick={async () => {
            const d = await call("new-section", { prompt: newPrompt });
            if (d?.section) {
              actions.add(d.section, selectedId);
              useEditor.getState().setTab("editar");
              setNewPrompt("");
            }
          }}
          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-zinc-900 px-3 py-2.5 text-sm font-semibold text-white hover:bg-zinc-700 disabled:opacity-50"
        >
          {busy === "new-section" ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} Criar dobra
        </button>
        <p className="text-xs text-zinc-500">A dobra entra depois da dobra selecionada (ou antes do rodapé).</p>
      </Group>

      <Group title="3. Cores e fontes">
        <input className={inputCls} placeholder="Ex: use o verde e preto da logo, visual premium" value={themePrompt} onChange={(e) => setThemePrompt(e.target.value)} />
        <button
          disabled={!!busy}
          onClick={async () => {
            const d = await call("theme", { prompt: themePrompt });
            if (d?.theme) {
              actions.theme(d.theme);
              setMsg({ ok: true, text: "Novo visual aplicado! Ctrl+Z desfaz." });
            }
          }}
          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm font-semibold hover:bg-zinc-50 disabled:opacity-50"
        >
          {busy === "theme" ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />} Sugerir paleta e fontes
        </button>
      </Group>

      {msg && (
        <div className={`m-5 rounded-lg p-3 text-sm ${msg.ok ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"}`}>{msg.text}</div>
      )}
      <div className="h-6" />
    </div>
  );
}

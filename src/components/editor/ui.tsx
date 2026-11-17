"use client";

import { useRef, useState, type ReactNode } from "react";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { uploadFile } from "./store";

export const inputCls =
  "w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20";

export function Label({ children, hint }: { children: ReactNode; hint?: string }) {
  return (
    <div className="mb-1.5 flex items-baseline justify-between gap-2">
      <span className="text-xs font-semibold text-zinc-700">{children}</span>
      {hint && <span className="text-[11px] text-zinc-400">{hint}</span>}
    </div>
  );
}

export function Group({ title, children, actions }: { title: string; children: ReactNode; actions?: ReactNode }) {
  return (
    <div className="border-b border-zinc-200 px-5 py-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-500">{title}</h3>
        {actions}
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}

export function Segmented<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: ReactNode; title?: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex rounded-lg bg-zinc-100 p-1">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          title={o.title}
          onClick={() => onChange(o.value)}
          className={`flex flex-1 cursor-pointer items-center justify-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium transition ${
            value === o.value ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-800"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function ImageField({ value, onChange, compact }: { value?: string; onChange: (v: string) => void; compact?: boolean }) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  async function pick(f?: File) {
    if (!f) return;
    setBusy(true);
    setErr("");
    try {
      onChange(await uploadFile(f));
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="flex flex-col gap-2">
      <div
        className={`group relative flex items-center gap-3 rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-2 ${compact ? "" : ""}`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          pick(e.dataTransfer.files[0]);
        }}
      >
        <div className={`${compact ? "size-12" : "size-16"} shrink-0 overflow-hidden rounded-md bg-zinc-200`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {value && <img src={value} alt="" className="h-full w-full object-cover" />}
        </div>
        <div className="flex flex-1 flex-wrap gap-2">
          <button
            type="button"
            onClick={() => ref.current?.click()}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-700"
          >
            {busy ? <Loader2 size={14} className="animate-spin" /> : <ImagePlus size={14} />} {value ? "Trocar" : "Enviar"}
          </button>
          {value && (
            <button type="button" onClick={() => onChange("")} className="inline-flex cursor-pointer items-center gap-1 rounded-md px-2 py-1.5 text-xs text-zinc-500 hover:bg-zinc-200" aria-label="Remover imagem">
              <Trash2 size={14} />
            </button>
          )}
        </div>
        <input ref={ref} type="file" accept="image/*" className="hidden" onChange={(e) => pick(e.target.files?.[0])} />
      </div>
      {!compact && <input className={`${inputCls} text-xs`} placeholder="ou cole o link de uma imagem" value={value ?? ""} onChange={(e) => onChange(e.target.value)} />}
      {err && <p className="text-xs text-red-600">{err}</p>}
    </div>
  );
}

export function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="flex items-center gap-2.5 rounded-lg border border-zinc-200 bg-white p-1.5 pr-2">
      <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="size-8 shrink-0 cursor-pointer rounded-md border-0 bg-transparent p-0" />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-xs font-medium text-zinc-700">{label}</span>
        <span className="block font-mono text-[11px] uppercase text-zinc-400">{value}</span>
      </span>
    </label>
  );
}

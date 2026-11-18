"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ExternalLink, Globe, LayoutTemplate, Loader2, Pencil, Settings, Sparkles, Trash2 } from "lucide-react";
import { TEMPLATES } from "@/lib/templates";
import type { PageDoc } from "@/lib/types";

export default function Home() {
  const router = useRouter();
  const [pages, setPages] = useState<PageDoc[] | null>(null);
  const [creating, setCreating] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<{ storage: string; images: string; ai: boolean; password: boolean; onVercel: boolean } | null>(null);

  const load = () =>
    fetch("/api/pages")
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw new Error(d.error);
        setPages(d);
      })
      .catch((e) => {
        setPages([]);
        setError(e.message);
      });
  useEffect(() => {
    load();
    fetch("/api/status").then((r) => r.json()).then(setStatus).catch(() => {});
  }, []);

  async function create(templateId: string) {
    setCreating(templateId);
    setError("");
    try {
      const r = await fetch("/api/pages", { method: "POST", body: JSON.stringify({ templateId }) });
      const d = await r.json();
      if (!r.ok || !d.id) throw new Error(d.error || "Não foi possível criar a página.");
      router.push(`/editor/${d.id}`);
    } catch (e) {
      setError((e as Error).message);
      setCreating(null);
    }
  }

  const missing = status
    ? [
        status.storage === "ausente" && "Banco de dados (Storage > Upstash for Redis) — sem ele não dá para criar páginas",
        status.images === "ausente" && "Imagens (Storage > Blob) — sem ele não dá para enviar fotos e logo",
      ].filter(Boolean)
    : [];

  async function remove(p: PageDoc) {
    if (!confirm(`Excluir "${p.name}"? Isso também tira a página do ar e não pode ser desfeito.`)) return;
    await fetch(`/api/pages/${p.id}`, { method: "DELETE" });
    load();
  }

  return (
    <main className="mx-auto max-w-6xl px-5 py-12 md:px-8">
      <header className="mb-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-zinc-900 text-white">
            <LayoutTemplate size={20} />
          </span>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Landing Studio</h1>
            <p className="text-sm text-zinc-500">Templates + IA para criar landing pages</p>
          </div>
        </div>
        <Link href="/configuracoes" className="inline-flex h-10 items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 text-sm font-medium hover:bg-zinc-50">
          <Settings size={16} /> Configurações
        </Link>
      </header>

      {status && status.storage !== "ausente" && !status.ai && (
        <Link href="/configuracoes" className="mb-10 flex items-center gap-3 rounded-2xl border border-indigo-200 bg-indigo-50 p-5 text-sm text-indigo-900 hover:bg-indigo-100">
          <Sparkles size={18} className="shrink-0 text-indigo-600" />
          <span>
            <b>Ative a IA:</b> clique aqui e cole sua chave grátis do Google Gemini para a IA reescrever as páginas.
          </span>
        </Link>
      )}

      {missing.length > 0 && (
        <div className="mb-10 rounded-2xl border border-amber-300 bg-amber-50 p-5 text-sm text-amber-900">
          <div className="font-semibold">Falta configurar na Vercel:</div>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {missing.map((m) => (
              <li key={m as string}>{m}</li>
            ))}
          </ul>
          <p className="mt-3 text-amber-800">Depois de configurar, vá em Deployments e clique em Redeploy.</p>
        </div>
      )}
      {error && <div className="mb-10 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">{error}</div>}

      <section>
        <h2 className="text-3xl font-semibold tracking-tight">Escolha um template</h2>
        <p className="mt-2 text-zinc-500">Cada template serve para vários nichos. A IA reescreve a copy e você troca fotos, logo, cores e fontes.</p>
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => create(t.id)}
              disabled={!!creating}
              className="group cursor-pointer overflow-hidden rounded-3xl border border-zinc-200 bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl disabled:opacity-60"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={t.cover} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                <span className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold backdrop-blur">{t.name}</span>
              </div>
              <div className="flex flex-col gap-2 p-6">
                <div className="text-sm font-semibold text-indigo-600">{t.niche}</div>
                <p className="text-sm leading-relaxed text-zinc-600">{t.description}</p>
                <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold">
                  {creating === t.id ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} className="transition group-hover:translate-x-1" />}
                  Usar este template
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="mt-20">
        <h2 className="text-2xl font-semibold tracking-tight">Minhas páginas</h2>
        {pages === null ? (
          <p className="mt-6 text-zinc-500">Carregando…</p>
        ) : pages.length === 0 ? (
          <p className="mt-6 rounded-2xl border border-dashed border-zinc-300 p-8 text-center text-zinc-500">Nenhuma página ainda. Escolha um template acima para começar.</p>
        ) : (
          <ul className="mt-6 divide-y divide-zinc-200 overflow-hidden rounded-2xl border border-zinc-200 bg-white">
            {pages.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center gap-4 p-4 md:p-5">
                <span className="size-10 shrink-0 rounded-xl" style={{ background: `linear-gradient(135deg, ${p.theme.colors.primary}, ${p.theme.colors.accent})` }} />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-semibold">{p.name}</div>
                  <div className="text-sm text-zinc-500">
                    {p.published && p.slug ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600">
                        <Globe size={13} /> /p/{p.slug}
                      </span>
                    ) : (
                      "Rascunho"
                    )}{" "}
                    · editado {new Date(p.updatedAt).toLocaleString("pt-BR")}
                  </div>
                </div>
                <div className="flex gap-2">
                  {p.published && p.slug && (
                    <a href={`/p/${p.slug}`} target="_blank" className="inline-flex h-10 items-center gap-2 rounded-xl border border-zinc-200 px-3 text-sm font-medium hover:bg-zinc-50">
                      <ExternalLink size={15} /> Ver
                    </a>
                  )}
                  <a href={`/editor/${p.id}`} className="inline-flex h-10 items-center gap-2 rounded-xl bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-700">
                    <Pencil size={15} /> Editar
                  </a>
                  <button onClick={() => remove(p)} aria-label="Excluir" className="grid size-10 cursor-pointer place-items-center rounded-xl border border-zinc-200 text-zinc-500 hover:bg-red-50 hover:text-red-600">
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

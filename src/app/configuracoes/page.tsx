"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ExternalLink, KeyRound, Loader2 } from "lucide-react";

const input =
  "w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20";

export default function Settings() {
  const [provider, setProvider] = useState<"gemini" | "anthropic">("gemini");
  const [geminiKey, setGeminiKey] = useState("");
  const [anthropicKey, setAnthropicKey] = useState("");
  const [model, setModel] = useState("");
  const [models, setModels] = useState<{ id: string; label: string }[]>([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => {
        if (d.error) return setMsg({ ok: false, text: d.error });
        setProvider(d.provider);
        setGeminiKey(d.geminiKey);
        setAnthropicKey(d.anthropicKey);
        setModel(d.geminiModel);
        if (d.geminiModel) setModels([{ id: d.geminiModel, label: d.geminiModel }]);
      });
  }, []);

  async function save() {
    setBusy(true);
    setMsg(null);
    const r = await fetch("/api/settings", {
      method: "PUT",
      body: JSON.stringify({ provider, geminiKey, anthropicKey, geminiModel: model }),
    });
    const d = await r.json();
    setBusy(false);
    if (!r.ok) return setMsg({ ok: false, text: d.error });
    if (d.models?.length) setModels(d.models);
    if (d.geminiModel) setModel(d.geminiModel);
    setMsg({ ok: true, text: "Salvo! A IA já pode ser usada no editor." });
  }

  return (
    <main className="mx-auto max-w-2xl px-5 py-12">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900">
        <ArrowLeft size={16} /> Voltar
      </Link>
      <h1 className="mt-6 text-3xl font-semibold tracking-tight">Configurações</h1>
      <p className="mt-2 text-zinc-500">Escolha qual IA reescreve as suas páginas e cole a chave dela.</p>

      <div className="mt-8 flex flex-col gap-6 rounded-3xl border border-zinc-200 bg-white p-6 md:p-8">
        <div>
          <div className="mb-2 text-sm font-semibold">IA usada</div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { v: "gemini", t: "Google Gemini", s: "Tem plano gratuito" },
              { v: "anthropic", t: "Claude (Anthropic)", s: "Pago por uso" },
            ].map((o) => (
              <button
                key={o.v}
                onClick={() => setProvider(o.v as "gemini" | "anthropic")}
                className={`cursor-pointer rounded-xl border p-4 text-left transition ${provider === o.v ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-500/20" : "border-zinc-200 hover:border-zinc-300"}`}
              >
                <div className="font-semibold">{o.t}</div>
                <div className="text-xs text-zinc-500">{o.s}</div>
              </button>
            ))}
          </div>
        </div>

        {provider === "gemini" ? (
          <>
            <div>
              <label htmlFor="gk" className="mb-1.5 flex items-center gap-2 text-sm font-semibold">
                <KeyRound size={15} /> Chave da API do Gemini
              </label>
              <input id="gk" className={input} type="password" placeholder="Cole aqui (começa com AIza…)" value={geminiKey} onChange={(e) => setGeminiKey(e.target.value)} />
              <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-zinc-600">
                <li>
                  Abra{" "}
                  <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-medium text-indigo-600 hover:underline">
                    aistudio.google.com/apikey <ExternalLink size={12} />
                  </a>{" "}
                  e entre com sua conta Google.
                </li>
                <li>Clique em <b>Create API key</b> e copie a chave.</li>
                <li>Cole acima e clique em <b>Salvar</b>.</li>
              </ol>
            </div>
            {models.length > 0 && (
              <div>
                <label htmlFor="gm" className="mb-1.5 block text-sm font-semibold">Modelo</label>
                <select id="gm" className={input} value={model} onChange={(e) => setModel(e.target.value)}>
                  {models.map((m) => (
                    <option key={m.id} value={m.id}>{m.label}</option>
                  ))}
                </select>
                <p className="mt-1.5 text-xs text-zinc-500">Se der erro de limite, troque por um modelo &quot;flash&quot; ou &quot;flash-lite&quot;.</p>
              </div>
            )}
          </>
        ) : (
          <div>
            <label htmlFor="ak" className="mb-1.5 flex items-center gap-2 text-sm font-semibold">
              <KeyRound size={15} /> Chave da API da Anthropic
            </label>
            <input id="ak" className={input} type="password" placeholder="sk-ant-…" value={anthropicKey} onChange={(e) => setAnthropicKey(e.target.value)} />
            <p className="mt-2 text-sm text-zinc-600">
              Crie em{" "}
              <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noreferrer" className="font-medium text-indigo-600 hover:underline">console.anthropic.com</a>{" "}
              (precisa adicionar créditos).
            </p>
          </div>
        )}

        <button onClick={save} disabled={busy} className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-zinc-900 py-3 text-sm font-semibold text-white hover:bg-zinc-700 disabled:opacity-60">
          {busy && <Loader2 size={16} className="animate-spin" />} Salvar
        </button>
        {msg && (
          <div className={`flex items-start gap-2 rounded-lg p-3 text-sm ${msg.ok ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"}`}>
            {msg.ok && <CheckCircle2 size={16} className="mt-0.5 shrink-0" />} {msg.text}
          </div>
        )}
        <p className="text-xs text-zinc-400">A chave fica guardada no banco do seu site e nunca aparece inteira na tela.</p>
      </div>
    </main>
  );
}

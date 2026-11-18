"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ExternalLink, FlaskConical, KeyRound, Loader2, Save } from "lucide-react";
import { PRESETS } from "@/lib/ai-presets";

type Provider = "gemini" | "openai" | "anthropic";
type Model = { id: string; label: string };

const input =
  "w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20";

function KeyLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-medium text-indigo-600 hover:underline">
      {children} <ExternalLink size={12} />
    </a>
  );
}

export default function SettingsPage() {
  const [provider, setProvider] = useState<Provider>("gemini");
  const [geminiKey, setGeminiKey] = useState("");
  const [geminiModel, setGeminiModel] = useState("");
  const [anthropicKey, setAnthropicKey] = useState("");
  const [preset, setPreset] = useState("groq");
  const [baseUrl, setBaseUrl] = useState(PRESETS[0].baseUrl);
  const [oaKey, setOaKey] = useState("");
  const [oaModel, setOaModel] = useState("");
  const [models, setModels] = useState<Model[]>([]);
  const [busy, setBusy] = useState<"save" | "test" | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => {
        if (d.error) return setMsg({ ok: false, text: d.error });
        setProvider(d.provider);
        setGeminiKey(d.geminiKey);
        setGeminiModel(d.geminiModel);
        setAnthropicKey(d.anthropicKey);
        setPreset(d.openai.preset);
        setBaseUrl(d.openai.baseUrl);
        setOaKey(d.openai.key);
        setOaModel(d.openai.model);
        if (d.provider === "gemini") setModels((d.geminiModels as string[]).map((id) => ({ id, label: id })));
        if (d.provider === "openai" && d.openai.model) setModels([{ id: d.openai.model, label: d.openai.model }]);
      });
  }, []);

  function changeProvider(p: Provider) {
    setProvider(p);
    setModels([]);
    setMsg(null);
  }

  function choosePreset(id: string) {
    setPreset(id);
    const p = PRESETS.find((x) => x.id === id);
    if (p && p.baseUrl) setBaseUrl(p.baseUrl);
    if (id === "custom") setBaseUrl("");
    setOaModel("");
    setModels([]);
  }

  async function save(): Promise<boolean> {
    setBusy("save");
    setMsg(null);
    const r = await fetch("/api/settings", {
      method: "PUT",
      body: JSON.stringify({
        provider,
        geminiKey,
        geminiModel,
        anthropicKey,
        openai: { preset, baseUrl, key: oaKey, model: oaModel },
      }),
    });
    const d = await r.json();
    setBusy(null);
    if (!r.ok) {
      setMsg({ ok: false, text: d.error });
      return false;
    }
    if (d.models?.length) setModels(d.models);
    if (provider === "gemini" && d.model) setGeminiModel(d.model);
    if (provider === "openai" && d.model) setOaModel(d.model);
    setMsg({ ok: true, text: `Salvo! Modelo: ${d.model}. Clique em "Testar" para conferir se está respondendo.` });
    return true;
  }

  async function test() {
    if (!(await save())) return;
    setBusy("test");
    const r = await fetch("/api/settings/test", { method: "POST" });
    const d = await r.json();
    setBusy(null);
    if (!r.ok) return setMsg({ ok: false, text: d.error });
    if (provider === "gemini" && d.model) setGeminiModel(d.model);
    setMsg({ ok: true, text: `Funcionando! A IA respondeu usando o modelo ${d.model}.` });
  }

  const p = PRESETS.find((x) => x.id === preset);

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
          <div className="grid gap-2 sm:grid-cols-3">
            {[
              { v: "gemini", t: "Google Gemini", s: "Tem plano grátis" },
              { v: "openai", t: "Outra IA", s: "Groq, OpenRouter, DeepSeek…" },
              { v: "anthropic", t: "Claude", s: "Pago por uso" },
            ].map((o) => (
              <button
                key={o.v}
                onClick={() => changeProvider(o.v as Provider)}
                className={`cursor-pointer rounded-xl border p-4 text-left transition ${provider === o.v ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-500/20" : "border-zinc-200 hover:border-zinc-300"}`}
              >
                <div className="font-semibold">{o.t}</div>
                <div className="text-xs text-zinc-500">{o.s}</div>
              </button>
            ))}
          </div>
        </div>

        {provider === "gemini" && (
          <>
            <div>
              <label htmlFor="gk" className="mb-1.5 flex items-center gap-2 text-sm font-semibold">
                <KeyRound size={15} /> Chave da API do Gemini
              </label>
              <input id="gk" className={input} type="password" placeholder="Cole aqui (começa com AIza…)" value={geminiKey} onChange={(e) => setGeminiKey(e.target.value)} />
              <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-zinc-600">
                <li>Abra <KeyLink href="https://aistudio.google.com/apikey">aistudio.google.com/apikey</KeyLink> e entre com sua conta Google.</li>
                <li>Clique em <b>Create API key</b> e copie a chave.</li>
                <li>Cole acima e clique em <b>Testar</b>.</li>
              </ol>
            </div>
            {models.length > 0 && (
              <div>
                <label htmlFor="gm" className="mb-1.5 block text-sm font-semibold">Modelo</label>
                <select id="gm" className={input} value={geminiModel} onChange={(e) => setGeminiModel(e.target.value)}>
                  {models.map((m, i) => (
                    <option key={m.id} value={m.id}>
                      {m.label}
                      {i === 0 ? " — recomendado no grátis" : ""}
                    </option>
                  ))}
                </select>
                <p className="mt-1.5 text-xs text-zinc-500">
                  Os primeiros da lista (&quot;flash-lite&quot; e &quot;flash&quot;) são os liberados no plano grátis. Se um der limite, o site tenta o próximo sozinho.
                </p>
              </div>
            )}
          </>
        )}

        {provider === "openai" && (
          <>
            <div>
              <label htmlFor="pr" className="mb-1.5 block text-sm font-semibold">Serviço</label>
              <select id="pr" className={input} value={preset} onChange={(e) => choosePreset(e.target.value)}>
                {PRESETS.map((x) => (
                  <option key={x.id} value={x.id}>
                    {x.name} — {x.note}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="bu" className="mb-1.5 block text-sm font-semibold">Endereço da API</label>
              <input id="bu" className={`${input} font-mono text-xs`} placeholder="https://.../v1" value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} readOnly={preset !== "custom"} />
              {preset === "custom" && <p className="mt-1.5 text-xs text-zinc-500">Qualquer IA compatível com a API da OpenAI (termina normalmente em /v1).</p>}
            </div>
            <div>
              <label htmlFor="ok" className="mb-1.5 flex items-center gap-2 text-sm font-semibold">
                <KeyRound size={15} /> Chave da API
              </label>
              <input id="ok" className={input} type="password" placeholder="Cole a chave aqui" value={oaKey} onChange={(e) => setOaKey(e.target.value)} />
              {p?.keyUrl && (
                <p className="mt-2 text-sm text-zinc-600">
                  Crie sua chave em <KeyLink href={p.keyUrl}>{new URL(p.keyUrl).host}</KeyLink>, cole acima e clique em <b>Testar</b>.
                </p>
              )}
            </div>
            <div>
              <label htmlFor="om" className="mb-1.5 block text-sm font-semibold">Modelo</label>
              {models.length > 1 ? (
                <select id="om" className={input} value={oaModel} onChange={(e) => setOaModel(e.target.value)}>
                  {models.map((m) => (
                    <option key={m.id} value={m.id}>{m.label}</option>
                  ))}
                </select>
              ) : (
                <input id="om" className={input} placeholder="Clique em Salvar para carregar a lista (ou digite o nome)" value={oaModel} onChange={(e) => setOaModel(e.target.value)} />
              )}
              {preset === "groq" && <p className="mt-1.5 text-xs text-zinc-500">Recomendado no Groq: um modelo &quot;llama&quot; 70b (melhor texto em português).</p>}
            </div>
          </>
        )}

        {provider === "anthropic" && (
          <div>
            <label htmlFor="ak" className="mb-1.5 flex items-center gap-2 text-sm font-semibold">
              <KeyRound size={15} /> Chave da API da Anthropic
            </label>
            <input id="ak" className={input} type="password" placeholder="sk-ant-…" value={anthropicKey} onChange={(e) => setAnthropicKey(e.target.value)} />
            <p className="mt-2 text-sm text-zinc-600">
              Crie em <KeyLink href="https://console.anthropic.com/settings/keys">console.anthropic.com</KeyLink> (precisa adicionar créditos).
            </p>
          </div>
        )}

        <div className="grid gap-2 sm:grid-cols-2">
          <button onClick={save} disabled={!!busy} className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-white py-3 text-sm font-semibold hover:bg-zinc-50 disabled:opacity-60">
            {busy === "save" ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Salvar
          </button>
          <button onClick={test} disabled={!!busy} className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-zinc-900 py-3 text-sm font-semibold text-white hover:bg-zinc-700 disabled:opacity-60">
            {busy === "test" ? <Loader2 size={16} className="animate-spin" /> : <FlaskConical size={16} />} Salvar e testar
          </button>
        </div>
        {msg && (
          <div className={`flex items-start gap-2 rounded-lg p-3 text-sm whitespace-pre-line ${msg.ok ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"}`}>
            {msg.ok && <CheckCircle2 size={16} className="mt-0.5 shrink-0" />} {msg.text}
          </div>
        )}
        <p className="text-xs text-zinc-400">As chaves ficam guardadas no banco do seu site e nunca aparecem inteiras na tela.</p>
      </div>
    </main>
  );
}

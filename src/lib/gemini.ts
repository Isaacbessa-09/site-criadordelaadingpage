import "server-only";

// API do Google Gemini (REST). Chave grátis em https://aistudio.google.com/apikey
const BASE = "https://generativelanguage.googleapis.com/v1beta";

interface GeminiModel {
  name: string; // "models/gemini-..."
  displayName?: string;
  supportedGenerationMethods?: string[];
}

export class GeminiError extends Error {
  constructor(message: string, public status: number, public raw: string) {
    super(message);
  }
  /** Limite / cota (inclusive "limit: 0" = modelo não liberado no plano grátis) ou modelo indisponível. */
  get tryAnotherModel() {
    return this.status === 429 || this.status === 404 || (this.status === 400 && /not (found|supported)|unsupported/i.test(this.raw));
  }
}

async function gfetch(path: string, key: string, init?: RequestInit) {
  const r = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", "x-goog-api-key": key, ...(init?.headers ?? {}) },
  });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) {
    const raw: string = d?.error?.message || `HTTP ${r.status}`;
    if ((r.status === 400 || r.status === 403) && /api key|permission|API_KEY/i.test(raw)) {
      throw new GeminiError("Chave do Gemini inválida ou sem permissão. Confira em Configurações.", r.status, raw);
    }
    throw new GeminiError(`Gemini: ${raw}`, r.status, raw);
  }
  return d;
}

/** Modelos de texto disponíveis para a chave (os nomes mudam com o tempo, por isso buscamos ao vivo). */
export async function listGeminiModels(key: string): Promise<{ id: string; label: string }[]> {
  const out: { id: string; label: string }[] = [];
  let token = "";
  for (let i = 0; i < 5; i++) {
    const d = await gfetch(`/models?pageSize=100${token ? `&pageToken=${token}` : ""}`, key);
    for (const m of (d.models ?? []) as GeminiModel[]) {
      const id = m.name.replace(/^models\//, "");
      if (!m.supportedGenerationMethods?.includes("generateContent")) continue;
      if (/embedding|image|tts|audio|live|aqa|imagen|veo|robotics|computer|gemma|learnlm|thinking/i.test(id)) continue;
      out.push({ id, label: m.displayName ? `${m.displayName} (${id})` : id });
    }
    token = d.nextPageToken;
    if (!token) break;
  }
  return rankGeminiModels(out.map((m) => m.id)).map((id) => out.find((m) => m.id === id)!);
}

/**
 * Ordena do mais provável de funcionar no plano grátis para o menos:
 * flash-lite estável > flash estável > flash preview > outros > pro (pro costuma ter cota zero no grátis).
 */
export function rankGeminiModels(ids: string[]): string[] {
  const tier = (id: string) => {
    const preview = /preview|exp/.test(id);
    if (/flash-lite/.test(id)) return preview ? 3 : 0;
    if (/flash/.test(id)) return preview ? 4 : 1;
    if (/pro/.test(id)) return 6;
    return 5;
  };
  const version = (id: string) => parseFloat(id.match(/(\d+(\.\d+)?)/)?.[1] ?? "0");
  // "-latest" e alias sem número ficam logo depois dos numerados do mesmo tipo
  return [...new Set(ids)].sort((a, b) => tier(a) - tier(b) || version(b) - version(a) || a.localeCompare(b));
}

async function generateOnce(key: string, model: string, system: string, text: string, images: { media_type: string; data: string }[]) {
  const parts: object[] = images.map((im) => ({ inlineData: { mimeType: im.media_type, data: im.data } }));
  parts.push({ text });
  const d = await gfetch(`/models/${encodeURIComponent(model)}:generateContent`, key, {
    method: "POST",
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: [{ role: "user", parts }],
      generationConfig: { responseMimeType: "application/json", temperature: 0.8 },
    }),
  });
  if (d.promptFeedback?.blockReason) throw new Error(`O Gemini bloqueou o pedido (${d.promptFeedback.blockReason}). Tente reformular.`);
  const cand = d.candidates?.[0];
  const out = (cand?.content?.parts ?? []).map((p: { text?: string }) => p.text ?? "").join("");
  if (cand?.finishReason === "MAX_TOKENS") throw new Error("A resposta do Gemini ficou longa demais. Tente com menos informações.");
  if (!out) throw new Error(`O Gemini não retornou texto (${cand?.finishReason ?? "sem resposta"}).`);
  return out;
}

/**
 * Gera com o modelo escolhido; se ele estiver sem cota (comum no plano grátis) ou indisponível,
 * tenta automaticamente os próximos modelos da lista. Retorna o modelo que funcionou.
 */
export async function geminiGenerate(opts: {
  key: string;
  model: string;
  fallbacks?: string[];
  system: string;
  text: string;
  images?: { media_type: string; data: string }[];
}): Promise<{ text: string; model: string }> {
  const order = [opts.model, ...rankGeminiModels(opts.fallbacks ?? []).filter((m) => m !== opts.model)].slice(0, 6);
  const errors: string[] = [];
  for (const model of order) {
    try {
      return { text: await generateOnce(opts.key, model, opts.system, opts.text, opts.images ?? []), model };
    } catch (e) {
      if (e instanceof GeminiError && e.tryAnotherModel) {
        errors.push(`${model}: ${e.raw.split("\n")[0].slice(0, 160)}`);
        continue;
      }
      throw e;
    }
  }
  const allQuota = errors.length > 0 && errors.every((x) => /quota|exceeded|429|rate/i.test(x));
  throw new Error(
    (allQuota
      ? "O Google recusou por limite em todos os modelos testados. Se você acabou de criar a chave, espere 1-2 minutos e tente de novo; se continuar, o limite diário grátis acabou (volta amanhã) ou use outra IA em Configurações (ex: Groq, grátis)."
      : "Nenhum modelo do Gemini funcionou.") + `\n\nDetalhes: ${errors.join(" | ")}`,
  );
}

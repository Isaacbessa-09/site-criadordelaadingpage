import "server-only";

// API do Google Gemini (REST). Chave grátis em https://aistudio.google.com/apikey
const BASE = "https://generativelanguage.googleapis.com/v1beta";

interface GeminiModel {
  name: string; // "models/gemini-..."
  displayName?: string;
  description?: string;
  supportedGenerationMethods?: string[];
}

async function gfetch(path: string, key: string, init?: RequestInit) {
  const r = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", "x-goog-api-key": key, ...(init?.headers ?? {}) },
  });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) {
    const msg = d?.error?.message || `HTTP ${r.status}`;
    if (r.status === 400 && /api key/i.test(msg)) throw new Error("Chave do Gemini inválida. Confira em Configurações.");
    if (r.status === 429) throw new Error("Limite gratuito do Gemini atingido. Espere um pouco ou troque o modelo em Configurações.");
    throw new Error(`Gemini: ${msg}`);
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
      if (/embedding|image|tts|audio|live|aqa|imagen|veo|robotics|computer/i.test(id)) continue;
      out.push({ id, label: m.displayName ? `${m.displayName} (${id})` : id });
    }
    token = d.nextPageToken;
    if (!token) break;
  }
  return out;
}

/** Escolhe um padrão razoável: um "flash" estável (não preview), o mais novo. */
export function pickDefaultModel(models: { id: string }[]): string | undefined {
  const ids = models.map((m) => m.id);
  const stable = ids.filter((id) => /flash/.test(id) && !/preview|exp|lite/.test(id));
  const any = stable.length ? stable : ids.filter((id) => /flash/.test(id));
  return (any.length ? any : ids).sort((a, b) => b.localeCompare(a, undefined, { numeric: true }))[0];
}

export async function geminiGenerate(opts: {
  key: string;
  model: string;
  system: string;
  text: string;
  images?: { media_type: string; data: string }[];
}): Promise<string> {
  const parts: object[] = (opts.images ?? []).map((im) => ({ inlineData: { mimeType: im.media_type, data: im.data } }));
  parts.push({ text: opts.text });
  const d = await gfetch(`/models/${encodeURIComponent(opts.model)}:generateContent`, opts.key, {
    method: "POST",
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: opts.system }] },
      contents: [{ role: "user", parts }],
      generationConfig: { responseMimeType: "application/json", temperature: 0.8 },
    }),
  });
  if (d.promptFeedback?.blockReason) throw new Error(`O Gemini bloqueou o pedido (${d.promptFeedback.blockReason}). Tente reformular.`);
  const cand = d.candidates?.[0];
  const text = (cand?.content?.parts ?? []).map((p: { text?: string }) => p.text ?? "").join("");
  if (!text) throw new Error(`O Gemini não retornou texto (${cand?.finishReason ?? "sem resposta"}).`);
  if (cand?.finishReason === "MAX_TOKENS") throw new Error("A resposta do Gemini ficou longa demais. Tente com menos informações.");
  return text;
}

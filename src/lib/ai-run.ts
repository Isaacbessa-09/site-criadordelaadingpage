import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { geminiGenerate } from "./gemini";
import { openAIGenerate } from "./openai-compat";
import { getSettings, saveSettings, type Settings } from "./storage";

export type AiImage = { media_type: string; data: string };

const CLAUDE_MODEL = "claude-opus-5-5";

async function askClaude(apiKey: string, system: string, text: string, images: AiImage[]): Promise<string> {
  const client = new Anthropic({ apiKey });
  const content: Anthropic.Beta.Messages.BetaContentBlockParam[] = images.map((im) => ({
    type: "image",
    source: { type: "base64", media_type: im.media_type as "image/jpeg", data: im.data },
  }));
  content.push({ type: "text", text });
  try {
    const stream = client.beta.messages.stream({
      model: CLAUDE_MODEL,
      max_tokens: 32000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "medium" },
      system,
      messages: [{ role: "user", content }],
    });
    const msg = await stream.finalMessage();
    if (msg.stop_reason === "refusal") throw new Error("A IA recusou este pedido. Tente reformular as informações.");
    if (msg.stop_reason === "max_tokens") throw new Error("A resposta da IA ficou longa demais. Tente com menos informações.");
    return msg.content.map((b) => (b.type === "text" ? b.text : "")).join("");
  } catch (e) {
    if (e instanceof Anthropic.AuthenticationError) throw new Error("Chave da Anthropic inválida. Confira em Configurações.");
    if (e instanceof Anthropic.RateLimitError) throw new Error("Limite de uso da Anthropic atingido. Tente em instantes.");
    if (e instanceof Anthropic.APIError) throw new Error(`Anthropic: ${e.message}`);
    throw e;
  }
}

/** Chama a IA escolhida em Configurações e devolve o texto da resposta. */
export async function runAI(system: string, text: string, images: AiImage[] = [], settings?: Settings): Promise<string> {
  const s = settings ?? (await getSettings());
  const geminiKey = s.geminiKey || process.env.GEMINI_API_KEY;
  const anthropicKey = s.anthropicKey || process.env.ANTHROPIC_API_KEY;
  const provider = s.provider ?? (geminiKey ? "gemini" : s.openai?.key ? "openai" : "anthropic");

  if (provider === "gemini" && geminiKey) {
    if (!s.geminiModel) throw new Error("Escolha um modelo do Gemini em Configurações.");
    const r = await geminiGenerate({ key: geminiKey, model: s.geminiModel, fallbacks: s.geminiModels, system, text, images });
    // Guarda o modelo que funcionou para as próximas vezes
    if (r.model !== s.geminiModel) await saveSettings({ ...(await getSettings()), geminiModel: r.model }).catch(() => {});
    return r.text;
  }
  if (provider === "openai" && s.openai?.key) {
    if (!s.openai.model) throw new Error("Escolha o modelo da IA em Configurações.");
    return openAIGenerate({ baseUrl: s.openai.baseUrl ?? "", key: s.openai.key, model: s.openai.model, system, text, images });
  }
  if (provider === "anthropic" && anthropicKey) return askClaude(anthropicKey, system, text, images);
  throw new Error("Nenhuma chave de IA configurada. Abra Configurações (no topo da página inicial) e cole a chave da IA.");
}

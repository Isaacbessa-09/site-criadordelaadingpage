import { getSettings, saveSettings, type Settings } from "@/lib/storage";
import { listGeminiModels } from "@/lib/gemini";
import { listOpenAIModels } from "@/lib/openai-compat";
import { PRESETS } from "@/lib/ai-presets";

export const dynamic = "force-dynamic";

const mask = (k?: string) => (k ? `${k.slice(0, 4)}••••••${k.slice(-4)}` : "");
/** Campo de chave vindo da tela: mascarado = manter a atual; vazio = apagar; outro = nova chave. */
const keyField = (incoming: unknown, current?: string) =>
  typeof incoming !== "string" ? current : incoming.includes("•") ? current : incoming.trim() || undefined;

// Nunca devolve a chave inteira para o navegador.
export async function GET() {
  try {
    const s = await getSettings();
    return Response.json({
      provider: s.provider ?? (s.geminiKey ? "gemini" : s.openai?.key ? "openai" : s.anthropicKey ? "anthropic" : "gemini"),
      geminiKey: mask(s.geminiKey),
      geminiModel: s.geminiModel ?? "",
      geminiModels: s.geminiModels ?? [],
      anthropicKey: mask(s.anthropicKey),
      openai: {
        preset: s.openai?.preset ?? "groq",
        baseUrl: s.openai?.baseUrl ?? PRESETS[0].baseUrl,
        key: mask(s.openai?.key),
        model: s.openai?.model ?? "",
      },
    });
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 500 });
  }
}

/** Salva e valida a chave buscando os modelos disponíveis. */
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const cur = await getSettings();
    const next: Settings = {
      ...cur,
      provider: body.provider ?? cur.provider,
      geminiKey: keyField(body.geminiKey, cur.geminiKey),
      anthropicKey: keyField(body.anthropicKey, cur.anthropicKey),
    };
    if (typeof body.geminiModel === "string") next.geminiModel = body.geminiModel;
    if (body.openai) {
      next.openai = {
        preset: body.openai.preset ?? cur.openai?.preset,
        baseUrl: typeof body.openai.baseUrl === "string" ? body.openai.baseUrl.trim() : cur.openai?.baseUrl,
        key: keyField(body.openai.key, cur.openai?.key),
        model: typeof body.openai.model === "string" ? body.openai.model : cur.openai?.model,
      };
    }

    let models: { id: string; label: string }[] = [];
    if (next.provider === "gemini" && next.geminiKey) {
      models = await listGeminiModels(next.geminiKey); // já vem ordenado: os mais liberados no grátis primeiro
      if (!models.length) throw new Error("A chave funcionou, mas nenhum modelo de texto foi encontrado.");
      next.geminiModels = models.map((m) => m.id);
      if (!next.geminiModel || !next.geminiModels.includes(next.geminiModel) || body.resetModel) next.geminiModel = models[0].id;
    }
    if (next.provider === "openai" && next.openai?.key) {
      models = await listOpenAIModels(next.openai.baseUrl ?? "", next.openai.key);
      if (models.length && (!next.openai.model || !models.some((m) => m.id === next.openai!.model))) {
        const preferred = models.find((m) => /llama-3\.3-70b|llama.*70b|gpt-4o-mini|deepseek-chat|mistral-small|:free/i.test(m.id));
        next.openai.model = (preferred ?? models[0]).id;
      }
    }
    await saveSettings(next);
    return Response.json({
      ok: true,
      models,
      model: next.provider === "gemini" ? next.geminiModel : next.provider === "openai" ? next.openai?.model : "claude-opus-5-5",
    });
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 400 });
  }
}

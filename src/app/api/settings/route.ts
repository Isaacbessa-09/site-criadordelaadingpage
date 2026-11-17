import { getSettings, saveSettings, type Settings } from "@/lib/storage";
import { listGeminiModels, pickDefaultModel } from "@/lib/gemini";

export const dynamic = "force-dynamic";

const mask = (k?: string) => (k ? `${k.slice(0, 4)}••••••${k.slice(-4)}` : "");

// Nunca devolve a chave inteira para o navegador.
export async function GET() {
  try {
    const s = await getSettings();
    return Response.json({
      provider: s.provider ?? (s.geminiKey ? "gemini" : s.anthropicKey ? "anthropic" : "gemini"),
      geminiKey: mask(s.geminiKey),
      geminiModel: s.geminiModel ?? "",
      anthropicKey: mask(s.anthropicKey),
    });
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = (await req.json()) as Settings & { testOnly?: boolean };
    const current = await getSettings();
    const next: Settings = { ...current };
    if (body.provider) next.provider = body.provider;
    if (typeof body.geminiKey === "string" && body.geminiKey && !body.geminiKey.includes("•")) next.geminiKey = body.geminiKey.trim();
    if (body.geminiKey === "") delete next.geminiKey;
    if (typeof body.anthropicKey === "string" && body.anthropicKey && !body.anthropicKey.includes("•")) next.anthropicKey = body.anthropicKey.trim();
    if (body.anthropicKey === "") delete next.anthropicKey;
    if (typeof body.geminiModel === "string") next.geminiModel = body.geminiModel;

    // Valida a chave do Gemini buscando os modelos
    let models: { id: string; label: string }[] = [];
    if (next.geminiKey && (next.provider ?? "gemini") === "gemini") {
      models = await listGeminiModels(next.geminiKey);
      if (!models.length) throw new Error("A chave funcionou, mas nenhum modelo de texto foi encontrado.");
      if (!next.geminiModel || !models.some((m) => m.id === next.geminiModel)) next.geminiModel = pickDefaultModel(models);
    }
    await saveSettings(next);
    return Response.json({ ok: true, models, geminiModel: next.geminiModel ?? "" });
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 400 });
  }
}

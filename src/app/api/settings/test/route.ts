import { runAI } from "@/lib/ai-run";
import { getSettings } from "@/lib/storage";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/** Faz uma chamada curtinha para ver se a IA configurada responde. */
export async function POST() {
  try {
    const text = await runAI(
      "Responda somente com JSON válido.",
      'Responda exatamente com o JSON: {"ok": true, "mensagem": "IA funcionando"}',
    );
    const s = await getSettings();
    const model = s.provider === "openai" ? s.openai?.model : s.provider === "anthropic" ? "claude-opus-5-5" : s.geminiModel;
    return Response.json({ ok: true, model, reply: text.slice(0, 200) });
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 400 });
  }
}

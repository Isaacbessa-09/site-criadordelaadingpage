import "server-only";

/**
 * Qualquer IA que siga o formato da API da OpenAI (/models e /chat/completions):
 * Groq, OpenRouter, DeepSeek, OpenAI, Mistral, Together, etc.
 */


const clean = (u: string) => u.trim().replace(/\/+$/, "").replace(/\/chat\/completions$/, "");

async function ofetch(baseUrl: string, key: string, path: string, init?: RequestInit) {
  if (!baseUrl) throw new Error("Informe o endereço da API em Configurações.");
  const r = await fetch(`${clean(baseUrl)}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}`, ...(init?.headers ?? {}) },
  });
  const raw = await r.text();
  let d: { error?: { message?: string } | string } & Record<string, unknown> = {};
  try {
    d = JSON.parse(raw);
  } catch {
    /* resposta não-JSON */
  }
  if (!r.ok) {
    const msg = (typeof d.error === "string" ? d.error : d.error?.message) || raw.slice(0, 200) || `HTTP ${r.status}`;
    const err = new Error(r.status === 401 ? "Chave inválida. Confira em Configurações." : r.status === 429 ? `Limite atingido: ${msg}` : `IA: ${msg}`);
    (err as Error & { status?: number }).status = r.status;
    throw err;
  }
  return d;
}

export async function listOpenAIModels(baseUrl: string, key: string): Promise<{ id: string; label: string }[]> {
  const d = (await ofetch(baseUrl, key, "/models")) as { data?: { id: string }[] };
  return (d.data ?? [])
    .map((m) => m.id)
    .filter((id) => !/whisper|tts|embed|moderation|guard|dall-e|image|audio|transcribe|realtime|search/i.test(id))
    .sort()
    .map((id) => ({ id, label: id }));
}

export async function openAIGenerate(opts: {
  baseUrl: string;
  key: string;
  model: string;
  system: string;
  text: string;
  images?: { media_type: string; data: string }[];
}): Promise<string> {
  const call = (withImages: boolean, jsonMode: boolean) => {
    const content =
      withImages && opts.images?.length
        ? [
            { type: "text", text: opts.text },
            ...opts.images.map((im) => ({ type: "image_url", image_url: { url: `data:${im.media_type};base64,${im.data}` } })),
          ]
        : opts.text;
    return ofetch(opts.baseUrl, opts.key, "/chat/completions", {
      method: "POST",
      body: JSON.stringify({
        model: opts.model,
        temperature: 0.8,
        messages: [
          { role: "system", content: opts.system },
          { role: "user", content },
        ],
        ...(jsonMode ? { response_format: { type: "json_object" } } : {}),
      }),
    });
  };

  // Nem todo modelo aceita imagem ou modo JSON: tenta e vai simplificando se der erro 400.
  const attempts: [boolean, boolean][] = [
    [true, true],
    [false, true],
    [false, false],
  ];
  let last: unknown;
  for (const [img, json] of attempts) {
    if (img && !opts.images?.length) continue;
    try {
      const d = (await call(img, json)) as { choices?: { message?: { content?: string }; finish_reason?: string }[] };
      const c = d.choices?.[0];
      if (c?.finish_reason === "length") throw new Error("A resposta da IA ficou longa demais. Tente com menos informações.");
      const text = c?.message?.content ?? "";
      if (!text) throw new Error("A IA não retornou texto.");
      return text;
    } catch (e) {
      last = e;
      if ((e as { status?: number }).status !== 400) throw e;
    }
  }
  throw last;
}

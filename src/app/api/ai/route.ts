/* eslint-disable @typescript-eslint/no-explicit-any */
import Anthropic from "@anthropic-ai/sdk";
import { catalog, mergeProps, textProps } from "@/lib/ai-merge";
import { FONTS } from "@/lib/fonts";
import { ICONS, SECTION_MAP } from "@/lib/registry";
import { uid } from "@/lib/path";
import type { PageDoc, Section } from "@/lib/types";

export const maxDuration = 300;

let _client: Anthropic | null = null;
const getClient = () => (_client ??= new Anthropic());
const MODEL = "claude-opus-5-5";

const SYSTEM = `Você é um copywriter sênior especialista em landing pages de alta conversão para negócios brasileiros (lojas, clínicas, cafeterias, clubes esportivos, prestadores de serviço).

Regras de escrita:
- Português do Brasil, natural, direto, persuasivo e específico. Nada de clichês vazios.
- Títulos curtos e fortes (até ~9 palavras). Subtítulos com 1-2 frases. Benefício antes de característica.
- Use APENAS fatos presentes nas informações do negócio. Não invente preços, endereços, telefones, registros profissionais (CRO/CRM), números ou prêmios. Se um dado não foi informado, mantenha o texto atual daquele campo.
- Respeite o tamanho aproximado dos textos atuais para não quebrar o layout.
- Ícones permitidos: ${ICONS.join(", ")}.
- O campo "highlight" do hero deve ser um trecho que aparece literalmente dentro do "title".

Formato da resposta: responda SOMENTE com um objeto JSON válido, sem markdown, sem comentários, sem texto antes ou depois.`;

type Img = { media_type: string; data: string };

function userContent(text: string, images: Img[] = []): Anthropic.Beta.Messages.BetaContentBlockParam[] {
  const blocks: Anthropic.Beta.Messages.BetaContentBlockParam[] = images.slice(0, 8).map((im) => ({
    type: "image",
    source: { type: "base64", media_type: im.media_type as "image/jpeg", data: im.data },
  }));
  blocks.push({ type: "text", text });
  return blocks;
}

async function ask(content: Anthropic.Beta.Messages.BetaContentBlockParam[]): Promise<any> {
  const stream = getClient().beta.messages.stream({
    model: MODEL,
    max_tokens: 32000,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    output_config: { effort: "medium" },
    system: SYSTEM,
    messages: [{ role: "user", content }],
  });
  const msg = await stream.finalMessage();
  if (msg.stop_reason === "refusal") throw new Error("A IA recusou este pedido. Tente reformular as informações.");
  if (msg.stop_reason === "max_tokens") throw new Error("A resposta da IA ficou longa demais. Tente com menos informações.");
  const text = msg.content.map((b) => (b.type === "text" ? b.text : "")).join("");
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end < 0) throw new Error("A IA não retornou JSON.");
  return JSON.parse(text.slice(start, end + 1));
}

const info = (s?: string) => (s?.trim() ? `INFORMAÇÕES DO NEGÓCIO (tudo que o usuário encontrou):\n"""\n${s.trim()}\n"""` : "Nenhuma informação extra foi enviada.");

export async function POST(req: Request) {
  const body = await req.json();
  const { mode, page, sectionId, prompt, images } = body as { mode: string; page: PageDoc; sectionId?: string; prompt?: string; images?: Img[] };
  const visible = page.sections.filter((s) => !s.style.hidden);

  try {
    if (mode === "rewrite-all") {
      const current = visible.map((s) => ({ id: s.id, type: s.type, props: textProps(s) }));
      const out = await ask(
        userContent(
          `${info(page.aiInfo)}

${prompt ? `INSTRUÇÕES EXTRAS: ${prompt}\n` : ""}
As imagens anexadas (se houver) são prints/fotos do negócio: use-as para entender o estilo, produtos e informações.

Reescreva TODA a copy da landing page abaixo para este negócio. Mantenha exatamente os mesmos ids, tipos e chaves. Em listas você pode ajustar a quantidade de itens (entre 2 e 8) se fizer sentido.

PÁGINA ATUAL (JSON):
${JSON.stringify({ brandName: page.brand.name, seo: page.seo, sections: current })}

Responda no formato: {"brandName": string, "seo": {"title": string, "description": string}, "sections": [{"id": string, "props": {...}}]}`,
          images,
        ),
      );
      const byId = new Map<string, any>((out.sections ?? []).map((s: any) => [s.id, s.props]));
      const sections = page.sections.map((s) => (byId.has(s.id) ? { ...s, props: mergeProps(s.type, s.props, byId.get(s.id)) } : s));
      return Response.json({
        page: {
          ...page,
          brand: { ...page.brand, name: typeof out.brandName === "string" && out.brandName ? out.brandName : page.brand.name },
          seo: { ...page.seo, ...(out.seo ?? {}) },
          sections,
        },
      });
    }

    if (mode === "rewrite-section") {
      const s = page.sections.find((x) => x.id === sectionId);
      if (!s) throw new Error("Seção não encontrada");
      const out = await ask(
        userContent(
          `${info(page.aiInfo)}

Reescreva SOMENTE esta dobra (${SECTION_MAP[s.type]?.label}) da landing page de "${page.brand.name}".
Pedido do usuário: ${prompt || "melhore a copy, deixe mais persuasiva."}

DOBRA ATUAL: ${JSON.stringify(textProps(s))}

Mantenha as mesmas chaves. Responda no formato: {"props": {...}}`,
          images,
        ),
      );
      return Response.json({ section: { ...s, props: mergeProps(s.type, s.props, out.props ?? out) } });
    }

    if (mode === "new-section") {
      const out = await ask(
        userContent(
          `${info(page.aiInfo)}

O usuário quer ADICIONAR uma nova dobra na landing page de "${page.brand.name}".
Descrição do que ele quer: """${prompt}"""

Escolha o tipo de dobra mais adequado deste catálogo e escreva o conteúdo:
${catalog()}

Dobras que já existem na página: ${visible.map((x) => x.type).join(", ")}.
Tons de fundo possíveis: base, surface, primary, dark, accent. Alinhamentos: left, center, right.

Responda no formato: {"type": string, "variant": string opcional, "tone": string, "align": string, "props": {...}}`,
          images,
        ),
      );
      const def = SECTION_MAP[out.type];
      if (!def) throw new Error(`A IA escolheu um tipo inválido: ${out.type}`);
      const tones = ["base", "surface", "primary", "dark", "accent"];
      const aligns = ["left", "center", "right"];
      const section: Section = {
        id: uid(def.type),
        type: def.type,
        props: mergeProps(def.type, structuredClone(def.defaults.props), out.props ?? {}),
        style: {
          ...def.defaults.style,
          ...(tones.includes(out.tone) ? { tone: out.tone } : {}),
          ...(aligns.includes(out.align) ? { align: out.align } : {}),
          ...(def.variants?.some((v) => v.value === out.variant) ? { variant: out.variant } : {}),
        },
      };
      return Response.json({ section });
    }

    if (mode === "theme") {
      const out = await ask(
        userContent(
          `${info(page.aiInfo)}

Sugira uma identidade visual (cores e fontes) para a landing page de "${page.brand.name}". ${prompt ? `Pedido: ${prompt}` : ""}
As imagens anexadas (se houver) podem mostrar a identidade atual da marca: siga as cores dela.
Garanta contraste mínimo 4.5:1 entre ink/bg, onPrimary/primary, onAccent/accent e onDark/dark.
Fontes permitidas: ${FONTS.map((f) => f.name).join(", ")}.
Tema atual: ${JSON.stringify(page.theme)}

Responda no formato: {"colors": {"bg","surface","ink","muted","primary","onPrimary","accent","onAccent","dark","onDark"} (hex), "fontHeading": string, "fontBody": string, "radius": number (0-32), "headingUppercase": boolean, "headingWeight": number}`,
          images,
        ),
      );
      const names = FONTS.map((f) => f.name);
      const theme = {
        ...page.theme,
        colors: { ...page.theme.colors, ...(out.colors ?? {}) },
        fontHeading: names.includes(out.fontHeading) ? out.fontHeading : page.theme.fontHeading,
        fontBody: names.includes(out.fontBody) ? out.fontBody : page.theme.fontBody,
        radius: typeof out.radius === "number" ? Math.max(0, Math.min(40, out.radius)) : page.theme.radius,
        headingUppercase: typeof out.headingUppercase === "boolean" ? out.headingUppercase : page.theme.headingUppercase,
        headingWeight: [400, 500, 600, 700, 800].includes(out.headingWeight) ? out.headingWeight : page.theme.headingWeight,
      };
      return Response.json({ theme });
    }

    return Response.json({ error: "Modo inválido" }, { status: 400 });
  } catch (e) {
    if (e instanceof Anthropic.AuthenticationError) return Response.json({ error: "Chave da API inválida." }, { status: 401 });
    if (e instanceof Anthropic.RateLimitError) return Response.json({ error: "Limite de uso da API atingido. Tente em instantes." }, { status: 429 });
    if (e instanceof Anthropic.APIError) return Response.json({ error: `Erro da API: ${e.message}` }, { status: 502 });
    const msg = (e as Error).message ?? "";
    if (/api[_ ]?key|credential|auth/i.test(msg)) {
      return Response.json({ error: "Configure ANTHROPIC_API_KEY no arquivo .env.local e reinicie o servidor." }, { status: 400 });
    }
    return Response.json({ error: msg }, { status: 500 });
  }
}

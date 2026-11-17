/* eslint-disable @typescript-eslint/no-explicit-any */
import { SECTION_MAP, SECTIONS } from "./registry";
import type { Props, Section } from "./types";

/** Conteúdo de texto da seção (sem imagens) para enviar à IA. */
export function textProps(s: Section): Props {
  const def = SECTION_MAP[s.type];
  const out: Props = {};
  def?.fields.forEach((f) => {
    const v = s.props[f.key];
    if (f.type === "image") return;
    if (f.type === "list") {
      const textFields = (f.fields ?? []).filter((x) => x.type !== "image");
      if (!textFields.length) return;
      out[f.key] = (Array.isArray(v) ? v : []).map((it: any) => Object.fromEntries(textFields.map((x) => [x.key, it?.[x.key] ?? ""])));
      return;
    }
    out[f.key] = v ?? "";
  });
  return out;
}

/** Junta a resposta da IA com a seção original, preservando imagens. */
export function mergeProps(type: string, orig: Props, next: Props): Props {
  const def = SECTION_MAP[type];
  if (!def || !next || typeof next !== "object") return orig;
  const out: Props = { ...orig };
  def.fields.forEach((f) => {
    const nv = next[f.key];
    if (f.type === "image") return;
    if (f.type === "list") {
      if (!Array.isArray(nv) || nv.length === 0) return;
      const base: any[] = Array.isArray(orig[f.key]) ? orig[f.key] : [];
      out[f.key] = nv.map((it: any, i: number) => {
        const b = base[i] ?? base[i % Math.max(base.length, 1)] ?? {};
        const item: any = { ...b };
        (f.fields ?? []).forEach((x) => {
          if (x.type === "image") item[x.key] = b[x.key] ?? "";
          else if (typeof it?.[x.key] === "string") item[x.key] = it[x.key];
        });
        return item;
      });
      return;
    }
    if (typeof nv === "string") out[f.key] = nv;
  });
  return out;
}

/** Catálogo de seções em texto (para a IA criar novas dobras). */
export function catalog(): string {
  return SECTIONS.filter((s) => s.type !== "navbar" && s.type !== "footer")
    .map((s) => {
      const fields = s.fields
        .filter((f) => f.type !== "image")
        .map((f) =>
          f.type === "list"
            ? `${f.key}: lista de { ${(f.fields ?? []).filter((x) => x.type !== "image").map((x) => `${x.key}${x.type === "icon" ? " (ícone)" : ""}`).join(", ")} }`
            : `${f.key}`,
        )
        .join("; ");
      const variants = s.variants ? ` | variantes: ${s.variants.map((v) => v.value).join(", ")}` : "";
      return `- ${s.type}: ${s.description} Campos: ${fields}${variants}`;
    })
    .join("\n");
}

"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { MessageCircle } from "lucide-react";
import type { CSSProperties } from "react";
import { fontsHref } from "@/lib/fonts";
import { SECTION_MAP } from "@/lib/registry";
import type { PageDoc } from "@/lib/types";
import { SectionContext, SiteContext, type EditMode, type SiteCtx } from "./primitives";
import { SECTION_COMPONENTS } from "./sections";

const ANCHORS: Record<string, string> = {
  about: "sobre", services: "servicos", products: "cardapio", pricing: "planos", testimonials: "depoimentos",
  faq: "duvidas", contact: "contato", team: "equipe", gallery: "galeria", steps: "como-funciona", features: "diferenciais",
};

const PAD: Record<string, string> = {
  sm: "py-10 md:py-14",
  md: "py-20 md:py-28",
  lg: "py-24 md:py-36",
};

export function themeVars(page: PageDoc): CSSProperties {
  const t = page.theme;
  const c = t.colors;
  return {
    "--c-bg": c.bg, "--c-surface": c.surface, "--c-ink": c.ink, "--c-muted": c.muted,
    "--c-primary": c.primary, "--c-on-primary": c.onPrimary, "--c-accent": c.accent, "--c-on-accent": c.onAccent,
    "--c-dark": c.dark, "--c-on-dark": c.onDark,
    "--f-h": `"${t.fontHeading}"`, "--f-b": `"${t.fontBody}"`, "--f-s": t.fontScript ? `"${t.fontScript}"` : undefined,
    "--r": `${t.radius}px`,
    "--h-w": t.headingWeight, "--h-t": `${t.headingTracking}em`, "--h-tt": t.headingUppercase ? "uppercase" : "none",
  } as any;
}

export function PageRenderer({
  page,
  editable = false,
  selectedId,
  selectedEl,
  mode = "texto",
  onEdit,
  onSelect,
}: {
  page: PageDoc;
  editable?: boolean;
  selectedId?: string | null;
  selectedEl?: string | null;
  mode?: EditMode;
  onEdit?: SiteCtx["onEdit"];
  onSelect?: SiteCtx["onSelect"];
}) {
  const used = new Set<string>();
  const contact = page.sections.find((s) => s.type === "contact" && !s.style.hidden);
  const wa = String(contact?.props.whatsapp ?? "").replace(/\D/g, "");

  return (
    <SiteContext.Provider value={{ editable, mode, selectedEl, onEdit, onSelect, brand: page.brand }}>
      {/* React 19 coloca o <link> no <head> */}
      <link rel="stylesheet" href={fontsHref([page.theme.fontHeading, page.theme.fontBody, ...(page.theme.fontScript ? [page.theme.fontScript] : [])])} precedence="default" />
      <div
        className={`site min-h-screen ${editable ? `editing mode-${mode}` : ""} ${page.theme.fontScript ? "has-script" : ""} ${page.theme.highlightItalic ? "hl-italic" : ""}`}
        style={themeVars(page)}
      >
        {page.sections.map((s) => {
          if (s.style.hidden) return null;
          const Cmp = SECTION_COMPONENTS[s.type];
          if (!Cmp) return null;
          let anchor: string | undefined = ANCHORS[s.type];
          if (anchor && used.has(anchor)) anchor = undefined;
          if (anchor) used.add(anchor);
          const self = s.type === "navbar" || s.type === "hero";
          return (
            <SectionContext.Provider key={s.id} value={{ id: s.id, style: s.style }}>
              <section
                id={anchor}
                data-sid={s.id}
                className={`tone-${s.style.tone} ${self ? "" : PAD[s.style.padding]} ${selectedId === s.id ? "is-selected" : ""} relative scroll-mt-20`}
                onClickCapture={editable && mode !== "mover" ? () => onSelect?.(s.id) : undefined}
              >
                {editable && <span className="sec-label">{SECTION_MAP[s.type]?.label ?? s.type}</span>}
                <Cmp p={s.props} />
              </section>
            </SectionContext.Provider>
          );
        })}
        {wa && (
          <a
            href={`https://wa.me/${wa}`}
            target="_blank"
            rel="noreferrer"
            aria-label="Falar no WhatsApp"
            onClick={editable ? (e) => e.preventDefault() : undefined}
            className="no-print btn pulse-ring fixed right-5 bottom-5 z-40 grid size-14 place-items-center rounded-full bg-[#25D366] text-white shadow-xl"
            style={{ ["--c-accent" as any]: "#25D366" }}
          >
            <MessageCircle size={26} />
          </a>
        )}
      </div>
    </SiteContext.Provider>
  );
}

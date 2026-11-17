"use client";

import { createContext, useContext, useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from "react";
import * as Icons from "lucide-react";
import type { Anim, SectionStyle } from "@/lib/types";

/* ---------- Contextos ---------- */
export interface SiteCtx {
  editable: boolean;
  brand?: { name: string; logo: string };
  onEdit?: (sectionId: string, path: string, value: string) => void;
  onSelect?: (sectionId: string, path?: string) => void;
}
export const SiteContext = createContext<SiteCtx>({ editable: false });
export const SectionContext = createContext<{ id: string; style: SectionStyle } | null>(null);

export const useSite = () => useContext(SiteContext);
export const useSection = () => useContext(SectionContext)!;

/* ---------- Texto editável ---------- */
export function T({
  path,
  value,
  as: Tag = "span",
  className,
  style,
  render,
}: {
  path: string;
  value?: string;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  render?: (v: string) => ReactNode;
}) {
  const { editable, onEdit } = useSite();
  const sec = useSection();
  if (!editable) {
    if (!value) return null;
    return (
      <Tag className={className} style={style}>
        {render ? render(value) : value}
      </Tag>
    );
  }
  return (
    <Tag
      key={value ?? ""}
      className={className}
      style={style}
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      data-placeholder={value ? undefined : "…"}
      onClick={(e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onKeyDown={(e: React.KeyboardEvent<HTMLElement>) => {
        if (e.key === "Escape") (e.target as HTMLElement).blur();
      }}
      onBlur={(e: React.FocusEvent<HTMLElement>) => {
        const v = e.currentTarget.innerText.replace(/\n$/, "");
        if (v !== (value ?? "")) onEdit?.(sec.id, path, v);
      }}
    >
      {value ? (render ? render(value) : value) : ""}
    </Tag>
  );
}

/* ---------- Imagem ---------- */
export function Img({
  path,
  src,
  alt = "",
  className,
  imgClassName,
  eager,
}: {
  path: string;
  src?: string;
  alt?: string;
  className?: string;
  imgClassName?: string;
  eager?: boolean;
}) {
  const { editable, onSelect } = useSite();
  const sec = useSection();
  return (
    <div
      className={className}
      data-img={editable ? "1" : undefined}
      onClick={
        editable
          ? (e) => {
              e.preventDefault();
              e.stopPropagation();
              onSelect?.(sec.id, path);
            }
          : undefined
      }
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} loading={eager ? "eager" : "lazy"} decoding="async" className={imgClassName ?? "h-full w-full object-cover"} />
      ) : (
        <div className="grid h-full w-full place-items-center bg-[color-mix(in_srgb,var(--ink)_8%,transparent)] text-xs text-muted">
          sem imagem
        </div>
      )}
    </div>
  );
}

/* ---------- Ícone ---------- */
export function Icon({ name, className, size = 22 }: { name?: string; className?: string; size?: number }) {
  const Cmp = (Icons as unknown as Record<string, React.ComponentType<{ className?: string; size?: number; "aria-hidden"?: boolean }>>)[name || "Sparkles"] ?? Icons.Sparkles;
  return <Cmp className={className} size={size} aria-hidden />;
}

/* ---------- Botão ---------- */
export function Btn({
  labelPath,
  label,
  href,
  kind = "accent",
  arrow = true,
  className = "",
}: {
  labelPath: string;
  label?: string;
  href?: string;
  kind?: "accent" | "primary" | "outline" | "light" | "dark";
  arrow?: boolean;
  className?: string;
}) {
  const { editable } = useSite();
  if (!label && !editable) return null;
  const kinds: Record<string, string> = {
    accent: "bg-accent text-on-accent",
    primary: "bg-primary text-on-primary",
    outline: "border border-line text-ink hover:bg-[color-mix(in_srgb,var(--ink)_8%,transparent)]",
    light: "bg-white text-neutral-900",
    dark: "bg-dark text-on-dark",
  };
  const icoBg: Record<string, string> = {
    accent: "bg-on-accent text-accent",
    primary: "bg-on-primary text-primary",
    outline: "bg-ink text-bg",
    light: "bg-neutral-900 text-white",
    dark: "bg-on-dark text-dark",
  };
  return (
    <a
      href={href || "#"}
      onClick={editable ? (e) => e.preventDefault() : undefined}
      className={`btn group inline-flex min-h-12 cursor-pointer items-center gap-3 rounded-full py-2 pl-6 text-[15px] font-semibold ${arrow ? "pr-2" : "pr-6"} ${kinds[kind]} ${className}`}
    >
      <T path={labelPath} value={label} />
      {arrow && (
        <span className={`btn-ico grid size-9 place-items-center rounded-full ${icoBg[kind]}`}>
          <Icons.ArrowUpRight size={18} aria-hidden />
        </span>
      )}
    </a>
  );
}

/* ---------- Reveal (animação ao rolar) ---------- */
export function Reveal({
  children,
  i = 0,
  className = "",
  as: Tag = "div",
  anim,
  reverse,
  style,
}: {
  children: ReactNode;
  i?: number;
  className?: string;
  as?: ElementType;
  anim?: Anim;
  reverse?: boolean;
  style?: CSSProperties;
}) {
  const sec = useContext(SectionContext);
  const a = anim ?? sec?.style.anim ?? "subir";
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || a === "nenhuma") return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setInView(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [a]);
  if (a === "nenhuma") {
    return (
      <Tag className={className} style={style}>
        {children}
      </Tag>
    );
  }
  return (
    <Tag
      ref={ref}
      className={`rv rv-${a} ${reverse ? "rv-rev" : ""} ${inView ? "in" : ""} ${className}`}
      style={{ transitionDelay: `${Math.min(i, 8) * 90}ms`, ...style }}
    >
      {children}
    </Tag>
  );
}

/* ---------- Contador animado ---------- */
export function Counter({ value, path }: { value: string; path: string }) {
  const { editable } = useSite();
  const ref = useRef<HTMLSpanElement>(null);
  const target = parseFloat(String(value).replace(/\./g, "").replace(",", "."));
  const [n, setN] = useState(0);
  useEffect(() => {
    if (editable || isNaN(target)) return;
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      io.disconnect();
      if (reduce) return setN(target);
      const t0 = performance.now();
      const dur = 1600;
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        setN(target * eased);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => io.disconnect();
  }, [target, editable]);
  if (editable || isNaN(target)) return <T path={path} value={value} />;
  const dec = String(value).includes(",") ? 1 : 0;
  return <span ref={ref}>{n.toLocaleString("pt-BR", { minimumFractionDigits: dec, maximumFractionDigits: dec })}</span>;
}

/* ---------- Cabeçalho de seção ---------- */
export function SectionHead({
  p,
  className = "",
  titleClass = "text-4xl md:text-5xl",
}: {
  p: { eyebrow?: string; title?: string; subtitle?: string };
  className?: string;
  titleClass?: string;
}) {
  const { editable } = useSite();
  const { style } = useSection();
  const al = style.align === "center" ? "text-center items-center mx-auto" : style.align === "right" ? "text-right items-end ml-auto" : "text-left items-start";
  if (!editable && !p.eyebrow && !p.title && !p.subtitle) return null;
  return (
    <div className={`flex max-w-3xl flex-col gap-4 ${al} ${className}`}>
      {(p.eyebrow || editable) && (
        <Reveal i={0}>
          <span className="inline-flex items-center gap-2 rounded-full border border-line px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-ink">
            <span className="size-1.5 rounded-full bg-accent" />
            <T path="eyebrow" value={p.eyebrow} />
          </span>
        </Reveal>
      )}
      <Reveal i={1}>
        <T as="h2" path="title" value={p.title} className={`h block ${titleClass}`} />
      </Reveal>
      {(p.subtitle || editable) && (
        <Reveal i={2}>
          <T as="p" path="subtitle" value={p.subtitle} className="block max-w-2xl text-lg leading-relaxed text-muted" />
        </Reveal>
      )}
    </div>
  );
}

export const alignClass = (a: string) => (a === "center" ? "text-center" : a === "right" ? "text-right" : "text-left");
export const justifyClass = (a: string) => (a === "center" ? "justify-center" : a === "right" ? "justify-end" : "justify-start");

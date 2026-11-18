"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useId, useState, type ReactNode } from "react";
import { ArrowRight, Check, Mail, MapPin, Menu, MessageCircle, Phone, Plus, Quote, Star, X, Clock, AtSign, CalendarHeart } from "lucide-react";
import { Btn, Counter, El, Icon, Img, Reveal, SectionHead, T, alignClass, highlight, justifyClass, useSection, useSite } from "./primitives";
import type { Props } from "@/lib/types";

const C = "mx-auto w-full max-w-7xl px-5 md:px-8";
type P = { p: Props };

function Brand({ big = false }: { big?: boolean }) {
  const { brand } = useSite();
  if (brand?.logo) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={brand.logo} alt={brand.name} className={big ? "h-12 w-auto" : "h-9 w-auto max-w-[160px] object-contain"} />;
  }
  return <span className={`h ${big ? "text-3xl" : "text-xl"}`}>{brand?.name || "Sua Marca"}</span>;
}


/** Selo circular com texto girando (ex: "ATENDIMENTO EXCLUSIVO • BELEZA NATURAL •"). */
export function Seal({ text, center, className = "" }: { text: string; center?: ReactNode; className?: string }) {
  const id = useId().replace(/:/g, "");
  const { brand } = useSite();
  return (
    <div className={`relative grid aspect-square place-items-center ${className}`}>
      <svg viewBox="0 0 200 200" className="spin-slow absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <path id={`seal-${id}`} d="M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0" />
        </defs>
        <text fill="currentColor" style={{ fontSize: 13, letterSpacing: "0.3em", textTransform: "uppercase", fontFamily: "var(--f-b)" }}>
          <textPath href={`#seal-${id}`}>{text}</textPath>
        </text>
      </svg>
      <div className="relative grid place-items-center">{center ?? <span className="h text-4xl">{(brand?.name || "B").trim()[0]}</span>}</div>
    </div>
  );
}

/* ================= NAVBAR ================= */
export function Navbar({ p }: P) {
  const { style } = useSection();
  const { editable } = useSite();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const v = style.variant ?? "solid";
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  const transparent = v === "transparent" && !scrolled && !open;
  const links: any[] = p.links ?? [];
  return (
    <>
      <nav
        className={`nav-fixed fixed inset-x-0 top-0 z-50 transition-all duration-500 ${v === "pill" ? "px-3 pt-3" : ""}`}
        style={transparent ? ({ ["--ink" as any]: "#fff", ["--line" as any]: "rgb(255 255 255 / .3)" } as any) : undefined}
      >
        <div
          className={`${v === "pill" ? "mx-auto max-w-6xl rounded-full border border-line px-3 md:px-4" : ""} transition-all duration-500 ${
            transparent ? "bg-transparent" : "bg-[color-mix(in_srgb,var(--c-bg)_82%,transparent)] shadow-[0_8px_30px_-20px_rgb(0_0_0/.4)] backdrop-blur-xl"
          }`}
        >
          <div className={`${v === "pill" ? "" : C} flex h-[72px] items-center justify-between gap-6 text-ink`}>
            <a href="#" onClick={editable ? (e) => e.preventDefault() : undefined} className="shrink-0">
              <Brand />
            </a>
            <ul className="hidden items-center gap-8 text-[15px] font-medium md:flex">
              {links.map((l, i) => (
                <li key={i}>
                  <a href={l.href} onClick={editable ? (e) => e.preventDefault() : undefined} className="link-u opacity-90 hover:opacity-100">
                    <T path={`links.${i}.label`} value={l.label} />
                  </a>
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-2">
              <span className="hidden sm:block">
                <Btn labelPath="ctaLabel" label={p.ctaLabel} href={p.ctaHref} kind={transparent ? "light" : "accent"} className="!min-h-11" />
              </span>
              <button
                aria-label={open ? "Fechar menu" : "Abrir menu"}
                className="grid size-11 cursor-pointer place-items-center rounded-full border border-line md:hidden"
                onClick={() => setOpen(!open)}
              >
                {open ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
          {open && (
            <div className={`${C} flex flex-col gap-1 pb-6 md:hidden`}>
              {links.map((l, i) => (
                <a key={i} href={l.href} onClick={() => setOpen(false)} className="rounded-xl px-2 py-3 text-lg font-medium">
                  {l.label}
                </a>
              ))}
              <Btn labelPath="ctaLabel" label={p.ctaLabel} href={p.ctaHref} className="mt-2 self-start" />
            </div>
          )}
        </div>
      </nav>
      {v !== "transparent" && <div className="h-[72px]" />}
    </>
  );
}

/* ================= HERO ================= */
function Proof({ p, light }: { p: Props; light?: boolean }) {
  const { editable } = useSite();
  if (!p.proofValue && !editable) return null;
  return (
    <div className="flex items-center gap-3">
      <El path="avatars" className="flex -space-x-3">
        {(p.avatars ?? []).slice(0, 4).map((a: any, i: number) => (
          <Img key={i} path={`avatars.${i}.image`} src={a.image} className={`size-11 overflow-hidden rounded-full border-2 ${light ? "border-white/80" : "border-[var(--c-bg)]"}`} />
        ))}
      </El>
      <div className="leading-tight">
        <T as="div" path="proofValue" value={p.proofValue} className="h text-xl" />
        <T as="div" path="proofLabel" value={p.proofLabel} className="text-sm text-muted" />
      </div>
    </div>
  );
}

function Badge({ b, i, className = "" }: { b: any; i: number; className?: string }) {
  return (
    <El path={`badges.${i}`} className={`flex items-center gap-3 rounded-2xl border border-white/40 bg-white/85 p-3 pr-5 text-neutral-900 shadow-[0_20px_50px_-20px_rgb(0_0_0/.45)] backdrop-blur-md ${className}`}>
      <span className="grid size-11 place-items-center rounded-xl bg-accent text-on-accent">
        <Icon name={b.icon} size={20} />
      </span>
      <div className="leading-tight">
        <T as="div" path={`badges.${i}.title`} value={b.title} className="text-lg font-bold" />
        <T as="div" path={`badges.${i}.text`} value={b.text} className="text-xs text-neutral-600" />
      </div>
    </El>
  );
}

export function Hero({ p }: P) {
  const { style } = useSection();
  const v = style.variant ?? "split";
  const al = style.align;
  const badges: any[] = p.badges ?? [];

  if (v === "background") {
    return (
      <div
        className="relative isolate flex min-h-[94vh] items-end overflow-hidden pt-28 pb-14 md:pb-20"
        style={{ ["--ink" as any]: "#fff", ["--muted" as any]: "rgb(255 255 255 / .78)", ["--line" as any]: "rgb(255 255 255 / .3)", color: "#fff" } as any}
      >
        <Img path="image" src={p.image} eager className="absolute inset-0 -z-20" imgClassName="kenburns h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(0_0_0/.45)_0%,rgb(0_0_0/.1)_35%,color-mix(in_srgb,var(--c-dark)_88%,transparent)_100%)]" />
        <div className={`${C} grid items-end gap-10 lg:grid-cols-[1.5fr_1fr]`}>
          <div className={`hero-in flex flex-col gap-6 ${al === "center" ? "items-center text-center lg:col-span-2" : al === "right" ? "items-end text-right lg:col-start-2" : ""}`}>
            <Proof p={p} light />
            {p.eyebrow && (
              <span className="w-fit rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] backdrop-blur">
                <T path="eyebrow" value={p.eyebrow} />
              </span>
            )}
            <T as="h1" path="title" value={p.title} render={(t) => highlight(t, p.highlight)} className="h block text-[clamp(2.9rem,7.6vw,6.8rem)]" />
            <T as="p" path="subtitle" value={p.subtitle} className="block max-w-xl text-lg leading-relaxed text-muted md:text-xl" />
            <div className={`flex flex-wrap gap-3 ${al === "center" ? "justify-center" : ""}`}>
              <Btn labelPath="ctaLabel" label={p.ctaLabel} href={p.ctaHref} />
              <Btn labelPath="cta2Label" label={p.cta2Label} href={p.cta2Href} kind="outline" arrow={false} />
            </div>
          </div>
          {al !== "center" && al !== "right" && p.seal && (
            <El path="seal" className="hidden justify-self-end text-white/90 lg:block">
              <Seal text={p.seal} className="size-40" />
            </El>
          )}
          {al !== "center" && al !== "right" && !p.seal && badges.length > 0 && (
            <div className="hidden flex-col items-end gap-4 lg:flex">
              {badges.map((b, i) => (
                <Badge key={i} b={b} i={i} className={i % 2 ? "floaty-2 mr-10" : "floaty"} />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (v === "editorial") {
    return (
      <div className="relative isolate overflow-hidden">
        <div className={`${C} relative grid min-h-[86vh] items-center py-16 lg:grid-cols-2 lg:py-24`}>
          <div className={`hero-in relative z-10 flex flex-col gap-7 lg:pr-12 ${al === "center" ? "items-center text-center lg:col-span-2" : ""}`}>
            {p.eyebrow && <T path="eyebrow" value={p.eyebrow} className="text-xs font-medium uppercase tracking-[0.28em] text-muted" />}
            <T as="h1" path="title" value={p.title} render={(t) => highlight(t, p.highlight)} className="h block text-[clamp(3rem,6.4vw,6.2rem)] leading-[0.98]" />
            <El path="divider" className="h-px w-16 bg-accent" />
            <T as="p" path="subtitle" value={p.subtitle} className="block max-w-md text-lg leading-relaxed text-muted" />
            <div className={`flex flex-wrap gap-3 ${al === "center" ? "justify-center" : ""}`}>
              <Btn labelPath="ctaLabel" label={p.ctaLabel} href={p.ctaHref} />
              <Btn labelPath="cta2Label" label={p.cta2Label} href={p.cta2Href} kind="outline" arrow={false} />
            </div>
            <div className="pt-2">
              <Proof p={p} />
            </div>
          </div>
          {al !== "center" && (
            <div className="relative mt-12 h-[70vh] lg:absolute lg:inset-y-0 lg:right-0 lg:mt-0 lg:h-auto lg:w-1/2">
              <Img path="image" src={p.image} eager className="absolute inset-0 overflow-hidden r-lg lg:rounded-none" imgClassName="kenburns h-full w-full object-cover" />
              <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-40 bg-gradient-to-r from-[var(--c-bg)] to-transparent lg:block" />
              {p.seal && (
                <El path="seal" className="absolute bottom-8 left-6 text-white drop-shadow lg:bottom-16 lg:-left-20 lg:text-ink">
                  <Seal text={p.seal} className="size-32 rounded-full bg-[color-mix(in_srgb,var(--c-bg)_70%,transparent)] backdrop-blur-sm md:size-40" />
                </El>
              )}
              {badges[0] && <Badge b={badges[0]} i={0} className="floaty absolute top-10 right-6" />}
            </div>
          )}
        </div>
      </div>
    );
  }

  const reverse = al === "right";
  const text = (
    <div className={`hero-in flex flex-col gap-6 ${al === "center" ? "items-center text-center" : ""}`}>
      {p.eyebrow && (
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[color-mix(in_srgb,var(--c-accent)_14%,transparent)] px-4 py-1.5 text-sm font-semibold text-ink">
          <span className="pulse-ring size-2 rounded-full bg-accent" />
          <T path="eyebrow" value={p.eyebrow} />
        </span>
      )}
      <T as="h1" path="title" value={p.title} render={(t) => highlight(t, p.highlight)} className="h block text-[clamp(2.7rem,6vw,5.6rem)]" />
      <T as="p" path="subtitle" value={p.subtitle} className="block max-w-xl text-lg leading-relaxed text-muted md:text-xl" />
      <div className={`flex flex-wrap gap-3 ${al === "center" ? "justify-center" : ""}`}>
        <Btn labelPath="ctaLabel" label={p.ctaLabel} href={p.ctaHref} />
        <Btn labelPath="cta2Label" label={p.cta2Label} href={p.cta2Href} kind="outline" arrow={false} />
      </div>
      <div className="pt-2">
        <Proof p={p} />
      </div>
    </div>
  );

  if (v === "card") {
    return (
      <div className="relative overflow-hidden py-14 md:py-20">
        <div className="pointer-events-none absolute -top-40 right-[-10%] -z-0 size-[560px] rounded-full bg-[color-mix(in_srgb,var(--c-accent)_16%,transparent)] blur-3xl" />
        <div className={`${C} relative grid items-center gap-12 ${al === "center" ? "" : "lg:grid-cols-2"}`}>
          <div className={reverse ? "lg:order-2" : ""}>{text}</div>
          {al !== "center" && (
            <div className="relative mx-auto w-full max-w-xl">
              <div className="hero-in">
                <Img path="image" src={p.image} eager className="zoom-img aspect-[4/5] overflow-hidden r-lg shadow-[0_40px_80px_-40px_rgb(0_0_0/.5)]" />
              </div>
              {badges[0] && <Badge b={badges[0]} i={0} className="floaty absolute -left-4 bottom-16 md:-left-12" />}
              {badges[1] && <Badge b={badges[1]} i={1} className="floaty-2 absolute -right-3 top-10 md:-right-8" />}
              {badges[2] && <Badge b={badges[2]} i={2} className="floaty absolute -bottom-6 right-10" />}
            </div>
          )}
        </div>
      </div>
    );
  }

  // split (imagem redonda)
  return (
    <div className="relative overflow-hidden py-14 md:py-20">
      <div className={`${C} grid items-center gap-12 ${al === "center" ? "" : "lg:grid-cols-[1.1fr_1fr]"}`}>
        <div className={reverse ? "lg:order-2" : ""}>{text}</div>
        {al !== "center" && (
          <div className="relative mx-auto aspect-square w-full max-w-[560px]">
            <div className="spin-slow absolute inset-0 rounded-full border-2 border-dashed border-[color-mix(in_srgb,var(--c-accent)_55%,transparent)]" />
            <div className="absolute inset-[7%] rounded-full bg-[color-mix(in_srgb,var(--c-accent)_18%,transparent)]" />
            <div className="hero-in absolute inset-[11%]">
              <Img path="image" src={p.image} eager className="zoom-img h-full w-full overflow-hidden rounded-full shadow-[0_40px_80px_-30px_rgb(0_0_0/.55)]" />
            </div>
            <span className="floaty-2 absolute left-[4%] top-[12%] size-5 rounded-full bg-accent" />
            <span className="floaty absolute bottom-[8%] right-[10%] size-3 rounded-full bg-primary" />
            {badges[0] && <Badge b={badges[0]} i={0} className="floaty absolute -left-2 bottom-[14%] md:-left-8" />}
            {badges[1] && <Badge b={badges[1]} i={1} className="floaty-2 absolute -right-2 top-[16%]" />}
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= MARQUEE ================= */
export function Marquee({ p }: P) {
  const items: any[] = p.items ?? [];
  const { editable } = useSite();
  const { style } = useSection();
  if (style.variant === "elegant" && !editable) {
    const row = [...items, ...items];
    return (
      <div className="marquee overflow-hidden py-4" style={{ ["--marquee-speed" as any]: `${Math.max(30, items.length * 9)}s` } as any}>
        <div className="marquee-track flex w-max">
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0 items-center" aria-hidden={k === 1}>
              {row.map((it, i) => (
                <span key={i} className="flex items-center gap-10 pr-10 whitespace-nowrap">
                  <span className={`h text-[clamp(3rem,8vw,7.5rem)] leading-none italic ${i % 2 ? "outline-text" : ""}`}>{it.text}</span>
                  <span className="text-2xl text-accent">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (editable) {
    return (
      <div className={`${C} flex flex-wrap items-center gap-x-8 gap-y-2 py-1`}>
        {items.map((it, i) => (
          <span key={i} className="h flex items-center gap-8 text-2xl md:text-4xl">
            <T path={`items.${i}.text`} value={it.text} />
            <Icon name="Sparkles" size={22} />
          </span>
        ))}
      </div>
    );
  }
  const row = [...items, ...items, ...items];
  return (
    <div className="marquee overflow-hidden py-1" style={{ ["--marquee-speed" as any]: `${Math.max(18, items.length * 6)}s` } as any}>
      <div className="marquee-track flex w-max">
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0 items-center" aria-hidden={k === 1}>
            {row.map((it, i) => (
              <span key={i} className="h flex items-center gap-8 pr-8 text-2xl whitespace-nowrap md:text-4xl">
                {it.text}
                <Icon name="Sparkles" size={22} />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= STATS ================= */
export function Stats({ p }: P) {
  const items: any[] = p.items ?? [];
  const { style } = useSection();
  return (
    <div className={C}>
      <SectionHead p={p} className="mb-12" />
      <div className={`grid grid-cols-2 gap-y-10 ${["md:grid-cols-1", "md:grid-cols-1", "md:grid-cols-2", "md:grid-cols-3", "md:grid-cols-4"][Math.min(items.length, 4)]} ${alignClass(style.align)}`}>
        {items.map((it, i) => (
          <Reveal key={i} i={i} className={`flex flex-col gap-2 px-4 md:px-8 ${i > 0 ? "md:border-l md:border-line" : ""}`}>
            <div className="h text-4xl whitespace-nowrap sm:text-5xl md:text-6xl">
              <Counter value={it.value} path={`items.${i}.value`} />
              <T path={`items.${i}.suffix`} value={it.suffix} className="text-accent" />
            </div>
            <T as="div" path={`items.${i}.label`} value={it.label} className="text-base text-muted" />
          </Reveal>
        ))}
      </div>
    </div>
  );
}

/* ================= ABOUT ================= */
function AboutArch({ p }: P) {
  const { style } = useSection();
  const { editable } = useSite();
  return (
    <div className="relative">
      {(p.watermark || editable) && (
        <El path="watermark" className="pointer-events-none absolute inset-x-0 top-0 overflow-hidden text-center select-none">
          <span className="script block text-[clamp(5rem,15vw,13rem)] leading-none whitespace-nowrap text-accent opacity-[0.12]">{p.watermark}</span>
        </El>
      )}
      <div className={`${C} relative grid items-center gap-14 pt-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20`}>
        <Reveal anim={style.anim === "nenhuma" ? "nenhuma" : "zoom"} className="relative mx-auto w-full max-w-md">
          <div className="absolute -inset-4 rounded-t-full border border-[color-mix(in_srgb,var(--c-accent)_45%,transparent)]" />
          <Img path="image" src={p.image} className="zoom-img relative aspect-[3/4] overflow-hidden rounded-t-full rounded-b-[var(--r)]" />
          {(p.image2 || editable) && (
            <Img path="image2" src={p.image2} className="zoom-img absolute -right-6 -bottom-8 size-36 overflow-hidden rounded-full border-[6px] border-[var(--c-bg)] shadow-xl md:size-44" />
          )}
        </Reveal>
        <div>
          <SectionHead p={p} />
          {(p.text || editable) && (
            <Reveal i={3}>
              <T as="p" path="text" value={p.text} className={`mt-6 block text-lg leading-relaxed whitespace-pre-line text-muted ${alignClass(style.align)}`} />
            </Reveal>
          )}
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {(p.bullets ?? []).map((b: any, i: number) => (
              <Reveal as="li" key={i} i={i + 3} className="flex items-center gap-3 text-sm">
                <span className="text-accent">✦</span>
                <T path={`bullets.${i}.text`} value={b.text} />
              </Reveal>
            ))}
          </ul>
          <Reveal i={6} className={`mt-10 flex flex-wrap items-center gap-8 ${justifyClass(style.align)}`}>
            {(p.signature || editable) && <T path="signature" value={p.signature} className="script text-5xl text-accent" />}
            <Btn labelPath="ctaLabel" label={p.ctaLabel} href={p.ctaHref} />
          </Reveal>
        </div>
      </div>
    </div>
  );
}

export function About({ p }: P) {
  return useSection().style.variant === "arch" ? <AboutArch p={p} /> : <AboutDefault p={p} />;
}

function AboutDefault({ p }: P) {
  const { style, } = useSection();
  const { editable } = useSite();
  const left = style.variant === "image-left";
  return (
    <div className={`${C} grid items-center gap-14 lg:grid-cols-2 lg:gap-20`}>
      <div className={left ? "lg:order-2" : ""}>
        <SectionHead p={p} />
        {(p.text || editable) && (
          <Reveal i={3}>
            <T as="p" path="text" value={p.text} className={`mt-6 block text-lg leading-relaxed text-muted ${alignClass(style.align)}`} />
          </Reveal>
        )}
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {(p.bullets ?? []).map((b: any, i: number) => (
            <Reveal as="li" key={i} i={i + 3} className="flex items-center gap-3 font-medium">
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-accent text-on-accent">
                <Check size={15} strokeWidth={3} />
              </span>
              <T path={`bullets.${i}.text`} value={b.text} />
            </Reveal>
          ))}
        </ul>
        <Reveal i={6} className={`mt-10 flex ${justifyClass(style.align)}`}>
          <Btn labelPath="ctaLabel" label={p.ctaLabel} href={p.ctaHref} />
        </Reveal>
      </div>
      <Reveal anim={style.anim === "nenhuma" ? "nenhuma" : "zoom"} className="relative pb-10 pl-6 md:pl-10">
        <Img path="image" src={p.image} className="zoom-img aspect-[4/5] w-[86%] overflow-hidden r-lg" />
        {(p.image2 || editable) && (
          <Img path="image2" src={p.image2} className="zoom-img absolute right-0 bottom-0 aspect-square w-[46%] overflow-hidden r-lg border-[6px] border-[var(--c-bg)] shadow-xl" />
        )}
        {(p.badgeValue || editable) && (
          <El path="badge" className="floaty absolute top-8 left-0 grid size-32 place-items-center rounded-full bg-accent text-center text-on-accent shadow-xl md:size-36">
            <div className="leading-tight">
              <T as="div" path="badgeValue" value={p.badgeValue} className="h text-3xl md:text-4xl" />
              <T as="div" path="badgeLabel" value={p.badgeLabel} className="text-xs font-semibold uppercase tracking-wider" />
            </div>
          </El>
        )}
      </Reveal>
    </div>
  );
}

/* ================= FEATURES ================= */
export function Features({ p }: P) {
  const items: any[] = p.items ?? [];
  const { style } = useSection();
  if (style.variant === "bar") {
    return (
      <div className={C}>
        <SectionHead p={p} className="mb-8" />
        <div className={`grid grid-cols-2 gap-y-6 lg:flex lg:justify-between`}>
          {items.map((it, i) => (
            <Reveal key={i} i={i} className={`flex items-center gap-4 px-4 lg:flex-1 lg:justify-center ${i > 0 ? "lg:border-l lg:border-line" : ""}`}>
              <El path={`items.${i}.icon`} as="span" className="text-accent">
                <Icon name={it.icon} size={26} strokeWidth={1.25} />
              </El>
              <div className="leading-tight">
                <T as="div" path={`items.${i}.title`} value={it.title} className="text-xs font-semibold uppercase tracking-[0.16em]" />
                <T as="div" path={`items.${i}.text`} value={it.text} className="mt-0.5 text-xs text-muted" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    );
  }
  if (style.variant === "linhas") {
    return (
      <div className={C}>
        <SectionHead p={p} className="mb-16" />
        <div className={`grid gap-y-12 sm:grid-cols-2 ${items.length >= 5 ? "lg:grid-cols-5" : items.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
          {items.map((it, i) => (
            <Reveal key={i} i={i} className={`group flex flex-col items-center gap-4 px-6 text-center ${i > 0 ? "lg:border-l lg:border-line" : ""}`}>
              <El path={`items.${i}.icon`} as="span" className="grid size-16 place-items-center rounded-full border border-[color-mix(in_srgb,var(--c-accent)_55%,transparent)] text-accent transition duration-500 group-hover:bg-accent group-hover:text-on-accent">
                <Icon name={it.icon} size={24} strokeWidth={1.25} />
              </El>
              <T as="h3" path={`items.${i}.title`} value={it.title} className="h block text-xl" />
              <T as="p" path={`items.${i}.text`} value={it.text} className="block text-sm leading-relaxed text-muted" />
            </Reveal>
          ))}
        </div>
      </div>
    );
  }
  const cols = items.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3";
  return (
    <div className={C}>
      <SectionHead p={p} className="mb-14" />
      <div className={`grid gap-5 sm:grid-cols-2 ${cols}`}>
        {items.map((it, i) => (
          <Reveal key={i} i={i} className={`group lift flex flex-col gap-5 bg-card p-8 r-lg border border-line ${alignClass(style.align)} ${style.align === "center" ? "items-center" : ""}`}>
            <El path={`items.${i}.icon`} as="span" className="grid size-14 place-items-center rounded-2xl bg-accent text-on-accent transition-transform duration-500 group-hover:-rotate-12 group-hover:scale-110">
              <Icon name={it.icon} size={26} />
            </El>
            <T as="h3" path={`items.${i}.title`} value={it.title} className="h block text-2xl" />
            <T as="p" path={`items.${i}.text`} value={it.text} className="block leading-relaxed text-muted" />
          </Reveal>
        ))}
      </div>
    </div>
  );
}

/* ================= SERVICES ================= */
export function Services({ p }: P) {
  const items: any[] = p.items ?? [];
  const { editable } = useSite();
  const { style } = useSection();
  if (style.variant === "stacked") {
    return (
      <div className={C}>
        <SectionHead p={p} className="mb-14" />
        <div className={`grid gap-6 sm:grid-cols-2 ${items.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
          {items.map((it, i) => (
            <Reveal key={i} i={i} className="group lift flex flex-col overflow-hidden bg-card r">
              <Img path={`items.${i}.image`} src={it.image} className="zoom-img aspect-[4/3] overflow-hidden" />
              <div className="flex flex-1 gap-4 p-7">
                {it.icon && (
                  <El path={`items.${i}.icon`} as="span" className="mt-1 shrink-0 text-accent">
                    <Icon name={it.icon} size={26} strokeWidth={1.25} />
                  </El>
                )}
                <div className="flex flex-1 flex-col gap-2">
                  <T as="h3" path={`items.${i}.title`} value={it.title} className="h block text-2xl" />
                  <T as="p" path={`items.${i}.text`} value={it.text} className="block flex-1 text-sm leading-relaxed text-muted" />
                  {(p.ctaLabel || editable) && (
                    <a href={p.ctaHref || "#"} onClick={editable ? (e) => e.preventDefault() : undefined} className="mt-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-ink">
                      <T path="ctaLabel" value={p.ctaLabel} movable={false} />
                      <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </a>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className={C}>
      <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <SectionHead p={p} />
        <Reveal i={2} className="shrink-0">
          <Btn labelPath="ctaLabel" label={p.ctaLabel} href={p.ctaHref} kind="outline" />
        </Reveal>
      </div>
      <div className={`grid gap-5 sm:grid-cols-2 ${items.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
        {items.map((it, i) => (
          <Reveal key={i} i={i} className="group lift zoom-img relative isolate aspect-[4/5] overflow-hidden r-lg text-white">
            <Img path={`items.${i}.image`} src={it.image} className="absolute inset-0 -z-10" />
            <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
            <div className="flex h-full flex-col justify-between p-6">
              <div className="flex items-start justify-between">
                {(it.tag || editable) && (
                  <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur">
                    <T path={`items.${i}.tag`} value={it.tag} />
                  </span>
                )}
                <span className="grid size-10 place-items-center rounded-full bg-white text-neutral-900 transition-transform duration-500 group-hover:rotate-45">
                  <Icon name="ArrowUpRight" size={18} />
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <T as="h3" path={`items.${i}.title`} value={it.title} className="h block text-2xl" />
                <T as="p" path={`items.${i}.text`} value={it.text} className="block text-sm leading-relaxed text-white/80" />
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

/* ================= PRODUCTS ================= */
export function Products({ p }: P) {
  const items: any[] = p.items ?? [];
  const { editable } = useSite();
  const { style } = useSection();
  return (
    <div className={C}>
      <SectionHead p={p} className="mb-14" />
      <div className={`grid gap-6 sm:grid-cols-2 ${items.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
        {items.map((it, i) => (
          <Reveal key={i} i={i} className="group lift flex flex-col bg-card p-3 r-lg border border-line">
            <div className="relative">
              <Img path={`items.${i}.image`} src={it.image} className="zoom-img aspect-square overflow-hidden r" />
              {(it.tag || editable) && (
                <span className="absolute top-3 left-3 rounded-full bg-accent px-3 py-1 text-xs font-bold text-on-accent">
                  <T path={`items.${i}.tag`} value={it.tag} />
                </span>
              )}
            </div>
            <div className="flex flex-1 flex-col gap-2 p-4 text-left">
              <div className="flex items-start justify-between gap-3">
                <T as="h3" path={`items.${i}.title`} value={it.title} className="h block text-xl" />
                <T path={`items.${i}.price`} value={it.price} className="shrink-0 rounded-full bg-[color-mix(in_srgb,var(--c-accent)_14%,transparent)] px-3 py-1 text-sm font-bold text-ink" />
              </div>
              <T as="p" path={`items.${i}.text`} value={it.text} className="block text-sm leading-relaxed text-muted" />
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal className={`mt-12 flex ${justifyClass(style.align)}`}>
        <Btn labelPath="ctaLabel" label={p.ctaLabel} href={p.ctaHref} />
      </Reveal>
    </div>
  );
}

/* ================= STEPS ================= */
function StepsBooking({ p }: P) {
  const items: any[] = p.items ?? [];
  const { editable } = useSite();
  return (
    <div className={`${C} grid items-center gap-14 lg:grid-cols-2`}>
      <div>
        <SectionHead p={p} />
        <ol className="mt-10 flex flex-col gap-5">
          {items.map((it, i) => (
            <Reveal as="li" key={i} i={i + 2} className="flex items-start gap-4">
              <span className="grid size-9 shrink-0 place-items-center rounded-full border border-line text-sm text-muted">{i + 1}</span>
              <div className="pt-1.5">
                <T as="div" path={`items.${i}.title`} value={it.title} className="font-medium" />
                <T as="div" path={`items.${i}.text`} value={it.text} className="text-sm text-muted" />
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
      <Reveal anim="zoom" className="flex justify-center">
        <El path="seal" className="text-ink">
          <Seal
            text={p.seal || "agende já • faça seu agendamento • "}
            className="size-72 md:size-80"
            center={
              <a
                href={p.ctaHref || "#"}
                onClick={editable ? (e) => e.preventDefault() : undefined}
                className="btn pulse-ring grid size-40 place-items-center rounded-full bg-dark text-center text-on-dark shadow-2xl md:size-44"
              >
                <span className="flex flex-col items-center gap-2">
                  <CalendarHeart size={26} strokeWidth={1.4} />
                  <T path="ctaLabel" value={p.ctaLabel} movable={false} className="h text-2xl" />
                </span>
              </a>
            }
          />
        </El>
      </Reveal>
    </div>
  );
}

export function Steps({ p }: P) {
  return useSection().style.variant === "booking" ? <StepsBooking p={p} /> : <StepsDefault p={p} />;
}

function StepsDefault({ p }: P) {
  const items: any[] = p.items ?? [];
  return (
    <div className={`${C} grid items-center gap-14 lg:grid-cols-2 lg:gap-20`}>
      <div>
        <SectionHead p={p} />
        <ol className="mt-10 flex flex-col">
          {items.map((it, i) => (
            <Reveal as="li" key={i} i={i + 2} className="group flex gap-6 border-t border-line py-6 last:border-b">
              <span className="h text-sm text-muted transition-colors group-hover:text-accent">{String(i + 1).padStart(2, "0")}</span>
              <div className="flex flex-col gap-1.5">
                <T as="h3" path={`items.${i}.title`} value={it.title} className="h block text-2xl" />
                <T as="p" path={`items.${i}.text`} value={it.text} className="block leading-relaxed text-muted" />
              </div>
            </Reveal>
          ))}
        </ol>
        <Reveal i={6} className="mt-10">
          <Btn labelPath="ctaLabel" label={p.ctaLabel} href={p.ctaHref} />
        </Reveal>
      </div>
      <Reveal anim="zoom" className="relative">
        <Img path="image" src={p.image} className="zoom-img aspect-[4/5] overflow-hidden r-lg" />
        <El path="stepsBadge" className="floaty absolute -bottom-6 left-6 flex items-center gap-3 rounded-2xl bg-accent px-5 py-4 text-on-accent shadow-xl">
          <span className="h text-3xl">{items.length}</span>
          <span className="text-sm leading-tight font-semibold">passos<br />simples</span>
        </El>
      </Reveal>
    </div>
  );
}

/* ================= PRICING ================= */
export function Pricing({ p }: P) {
  const items: any[] = p.items ?? [];
  return (
    <div className={C}>
      <SectionHead p={p} className="mb-14" />
      <div className={`grid items-stretch gap-6 ${items.length >= 3 ? "lg:grid-cols-3" : "md:grid-cols-2"} mx-auto max-w-6xl`}>
        {items.map((it, i) => {
          const hl = String(it.highlight ?? "").toLowerCase().startsWith("s");
          return (
            <Reveal
              key={i}
              i={i}
              className={`lift relative flex flex-col gap-6 p-8 text-left r-lg border ${hl ? "border-transparent bg-dark text-on-dark lg:-translate-y-4" : "border-line bg-card"}`}
              style={hl ? ({ ["--ink" as any]: "var(--c-on-dark)", ["--muted" as any]: "color-mix(in srgb, var(--c-on-dark) 70%, transparent)", ["--line" as any]: "color-mix(in srgb, var(--c-on-dark) 16%, transparent)" } as any) : undefined}
            >
              {hl && <span className="absolute -top-3 right-6 rounded-full bg-accent px-3 py-1 text-xs font-bold text-on-accent">Mais escolhido</span>}
              <div>
                <T as="h3" path={`items.${i}.name`} value={it.name} className="h block text-2xl text-ink" />
                <T as="p" path={`items.${i}.description`} value={it.description} className="mt-1 block text-sm text-muted" />
              </div>
              <div className="flex items-end gap-1 text-ink">
                <T path={`items.${i}.price`} value={it.price} className="h text-5xl" />
                <T path={`items.${i}.period`} value={it.period} className="pb-1.5 text-muted" />
              </div>
              <ul className="flex flex-1 flex-col gap-3 border-t border-line pt-6">
                {String(it.features ?? "").split("\n").filter(Boolean).map((f: string, k: number) => (
                  <li key={k} className="flex items-start gap-3 text-sm text-ink">
                    <span className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full ${hl ? "bg-accent text-on-accent" : "bg-[color-mix(in_srgb,var(--c-accent)_20%,transparent)] text-ink"}`}>
                      <Check size={12} strokeWidth={3} />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <Btn labelPath={`items.${i}.ctaLabel`} label={it.ctaLabel} href={p.ctaHref} kind={hl ? "accent" : "dark"} className="justify-between" />
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}

/* ================= TESTIMONIALS ================= */
export function Testimonials({ p }: P) {
  const items: any[] = p.items ?? [];
  return (
    <div className={C}>
      <SectionHead p={p} className="mb-14" />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((it, i) => (
          <Reveal key={i} i={i} className="lift relative flex flex-col gap-6 bg-card p-8 r-lg border border-line">
            <Quote className="absolute top-6 right-6 text-accent opacity-60" size={36} />
            <div className="flex gap-1 text-[#F5B301]">
              {[0, 1, 2, 3, 4].map((k) => (
                <Star key={k} size={18} fill="currentColor" strokeWidth={0} />
              ))}
            </div>
            <T as="p" path={`items.${i}.quote`} value={it.quote} className="block flex-1 text-lg leading-relaxed" />
            <div className="flex items-center gap-3 border-t border-line pt-5">
              <Img path={`items.${i}.image`} src={it.image} className="size-12 shrink-0 overflow-hidden rounded-full" />
              <div className="leading-tight">
                <T as="div" path={`items.${i}.name`} value={it.name} className="font-bold" />
                <T as="div" path={`items.${i}.role`} value={it.role} className="text-sm text-muted" />
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

/* ================= TEAM ================= */
export function Team({ p }: P) {
  const items: any[] = p.items ?? [];
  return (
    <div className={C}>
      <SectionHead p={p} className="mb-14" />
      <div className={`grid gap-5 sm:grid-cols-2 ${items.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
        {items.map((it, i) => (
          <Reveal key={i} i={i} className="group zoom-img relative aspect-[3/4] overflow-hidden r-lg">
            <Img path={`items.${i}.image`} src={it.image} className="absolute inset-0" />
            <div className="absolute inset-x-3 bottom-3 flex items-center justify-between rounded-2xl bg-white/90 p-4 text-neutral-900 backdrop-blur transition-transform duration-500 group-hover:-translate-y-1">
              <div className="leading-tight">
                <T as="div" path={`items.${i}.name`} value={it.name} className="text-lg font-bold" />
                <T as="div" path={`items.${i}.role`} value={it.role} className="text-sm text-neutral-600" />
              </div>
              <span className="grid size-9 place-items-center rounded-full bg-accent text-on-accent">
                <Plus size={18} />
              </span>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

/* ================= GALLERY ================= */
export function Gallery({ p }: P) {
  const items: any[] = p.items ?? [];
  return (
    <div className={C}>
      <SectionHead p={p} className="mb-12" />
      <div className="grid grid-flow-row-dense auto-rows-[180px] grid-cols-2 gap-4 md:auto-rows-[220px] md:grid-cols-4">
        {items.map((it, i) => (
          <Reveal key={i} i={i} anim="zoom" className={`zoom-img overflow-hidden r ${i % 5 === 0 ? "row-span-2" : ""} ${i % 5 === 3 ? "md:col-span-2" : ""}`}>
            <Img path={`items.${i}.image`} src={it.image} className="h-full w-full" />
          </Reveal>
        ))}
      </div>
    </div>
  );
}

/* ================= FAQ ================= */
export function Faq({ p }: P) {
  const items: any[] = p.items ?? [];
  const { editable } = useSite();
  return (
    <div className={`${C} grid gap-12 lg:grid-cols-[1fr_1.4fr]`}>
      <div className="lg:sticky lg:top-28 lg:self-start">
        <SectionHead p={p} />
      </div>
      <div className="flex flex-col gap-3">
        {items.map((it, i) => (
          <Reveal key={i} i={i}>
            <details className="faq group bg-card r border border-line" open={editable || i === 0}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 p-6 text-lg font-semibold">
                <T path={`items.${i}.q`} value={it.q} />
                <span className="faq-ico grid size-9 shrink-0 place-items-center rounded-full bg-accent text-on-accent transition-transform duration-300">
                  <Plus size={18} />
                </span>
              </summary>
              <div className="faq-body px-6 pb-6">
                <T as="p" path={`items.${i}.a`} value={it.a} className="block leading-relaxed text-muted" />
              </div>
            </details>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

/* ================= CTA ================= */
export function Cta({ p }: P) {
  const { style } = useSection();
  const { editable } = useSite();
  return (
    <div className={C}>
      <Reveal anim="zoom" className="relative isolate overflow-hidden r-lg px-6 py-20 md:px-16 md:py-28">
        <Img path="image" src={p.image} className="absolute inset-0 -z-20" imgClassName="h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(120deg,color-mix(in_srgb,var(--c-dark)_92%,transparent),color-mix(in_srgb,var(--c-dark)_45%,transparent))]" />
        <div
          className={`flex max-w-3xl flex-col gap-6 ${style.align === "center" ? "mx-auto items-center text-center" : style.align === "right" ? "ml-auto items-end text-right" : ""}`}
          style={{ ["--ink" as any]: "#fff", ["--muted" as any]: "rgb(255 255 255 / .8)", color: "#fff" } as any}
        >
          {(p.eyebrow || editable) && <T path="eyebrow" value={p.eyebrow} className="text-sm font-semibold uppercase tracking-[0.16em] text-accent" />}
          <T as="h2" path="title" value={p.title} className="h block text-4xl md:text-6xl" />
          <T as="p" path="subtitle" value={p.subtitle} className="block max-w-xl text-lg text-white/80" />
          <div className="pt-2">
            <span className="pulse-ring inline-block rounded-full">
              <Btn labelPath="ctaLabel" label={p.ctaLabel} href={p.ctaHref} />
            </span>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

/* ================= CONTACT ================= */
export function Contact({ p }: P) {
  const { editable } = useSite();
  const wa = String(p.whatsapp ?? "").replace(/\D/g, "");
  const rows = [
    { icon: MapPin, path: "address", label: "Endereço", v: p.address },
    { icon: Phone, path: "phone", label: "Telefone", v: p.phone },
    { icon: Mail, path: "email", label: "E-mail", v: p.email },
    { icon: AtSign, path: "instagram", label: "Instagram", v: p.instagram },
  ];
  return (
    <div className={C}>
      <SectionHead p={p} className="mb-12" />
      <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        <Reveal className="flex flex-col gap-6 bg-card p-8 r-lg border border-line">
          {rows.map((r) =>
            r.v || editable ? (
              <div key={r.path} className="flex items-start gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent text-on-accent">
                  <r.icon size={20} />
                </span>
                <div className="leading-snug">
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted">{r.label}</div>
                  <T as="div" path={r.path} value={r.v} className="font-semibold" />
                </div>
              </div>
            ) : null,
          )}
          <div className="flex items-start gap-4 border-t border-line pt-6">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent text-on-accent">
              <Clock size={20} />
            </span>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted">Horários</div>
              <T as="div" path="hours" value={p.hours} className="font-semibold whitespace-pre-line" />
            </div>
          </div>
          {wa && (
            <a
              href={`https://wa.me/${wa}`}
              target="_blank"
              rel="noreferrer"
              onClick={editable ? (e) => e.preventDefault() : undefined}
              className="btn mt-2 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 font-semibold text-white"
            >
              <MessageCircle size={20} /> Chamar no WhatsApp
            </a>
          )}
        </Reveal>
        <Reveal i={1} anim="zoom" className="min-h-[360px] overflow-hidden r-lg border border-line">
          {p.mapQuery ? (
            <iframe
              title="Mapa"
              src={`https://www.google.com/maps?q=${encodeURIComponent(p.mapQuery)}&output=embed`}
              className={`h-full min-h-[360px] w-full ${editable ? "pointer-events-none" : ""}`}
              loading="lazy"
            />
          ) : (
            <div className="grid h-full place-items-center text-muted">Adicione o endereço do mapa</div>
          )}
        </Reveal>
      </div>
    </div>
  );
}

/* ================= FOOTER ================= */
export function Footer({ p }: P) {
  const { brand, editable } = useSite();
  return (
    <div className={`${C} pt-10`}>
      <div className="flex flex-col justify-between gap-10 border-b border-line pb-10 md:flex-row">
        <div className="flex max-w-sm flex-col gap-4">
          <Brand big />
          <T as="p" path="text" value={p.text} className="block text-muted" />
        </div>
        <ul className="flex flex-wrap gap-x-8 gap-y-3">
          {(p.links ?? []).map((l: any, i: number) => (
            <li key={i}>
              <a href={l.href} onClick={editable ? (e) => e.preventDefault() : undefined} className="link-u font-medium">
                <T path={`links.${i}.label`} value={l.label} />
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col justify-between gap-4 py-6 text-sm text-muted md:flex-row">
        <T path="copyright" value={p.copyright} />
        <span>Feito com carinho</span>
      </div>
      <Reveal anim="subir" className="pointer-events-none select-none overflow-hidden">
        <div className="h text-center text-[clamp(3rem,15vw,13rem)] leading-[0.8] opacity-[0.07]">{brand?.name}</div>
      </Reveal>
    </div>
  );
}

export const SECTION_COMPONENTS: Record<string, (props: P) => ReactNode> = {
  navbar: Navbar,
  hero: Hero,
  marquee: Marquee,
  stats: Stats,
  about: About,
  features: Features,
  services: Services,
  products: Products,
  steps: Steps,
  pricing: Pricing,
  testimonials: Testimonials,
  team: Team,
  gallery: Gallery,
  faq: Faq,
  cta: Cta,
  contact: Contact,
  footer: Footer,
};

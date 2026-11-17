// Fontes do Google disponíveis no editor. "w" = pesos disponíveis.
export const FONTS: { name: string; w: string; kind: "sans" | "serif" | "display" }[] = [
  { name: "Inter", w: "400;500;600;700;800", kind: "sans" },
  { name: "Inter Tight", w: "400;500;600;700;800", kind: "sans" },
  { name: "Manrope", w: "400;500;600;700;800", kind: "sans" },
  { name: "Plus Jakarta Sans", w: "400;500;600;700;800", kind: "sans" },
  { name: "Figtree", w: "400;500;600;700;800", kind: "sans" },
  { name: "DM Sans", w: "400;500;600;700;800", kind: "sans" },
  { name: "Poppins", w: "400;500;600;700;800", kind: "sans" },
  { name: "Montserrat", w: "400;500;600;700;800", kind: "sans" },
  { name: "Outfit", w: "400;500;600;700;800", kind: "sans" },
  { name: "Sora", w: "400;500;600;700;800", kind: "sans" },
  { name: "Space Grotesk", w: "400;500;600;700", kind: "sans" },
  { name: "Archivo", w: "400;500;600;700;800", kind: "sans" },
  { name: "Lexend", w: "400;500;600;700;800", kind: "sans" },
  { name: "Nunito", w: "400;500;600;700;800", kind: "sans" },
  { name: "Noto Sans", w: "400;500;600;700;800", kind: "sans" },
  { name: "Source Sans 3", w: "400;500;600;700;800", kind: "sans" },
  { name: "Syne", w: "400;500;600;700;800", kind: "display" },
  { name: "Unbounded", w: "400;500;600;700;800", kind: "display" },
  { name: "Fredoka", w: "400;500;600;700", kind: "display" },
  { name: "Bebas Neue", w: "400", kind: "display" },
  { name: "Anton", w: "400", kind: "display" },
  { name: "Oswald", w: "400;500;600;700", kind: "display" },
  { name: "Archivo Black", w: "400", kind: "display" },
  { name: "Fraunces", w: "400;500;600;700;800", kind: "serif" },
  { name: "Playfair Display", w: "400;500;600;700;800", kind: "serif" },
  { name: "DM Serif Display", w: "400", kind: "serif" },
  { name: "Instrument Serif", w: "400", kind: "serif" },
  { name: "Cormorant Garamond", w: "400;500;600;700", kind: "serif" },
  { name: "Lora", w: "400;500;600;700", kind: "serif" },
];

export function fontsHref(names: string[]): string {
  const uniq = [...new Set(names)];
  const fams = uniq
    .map((n) => {
      const f = FONTS.find((x) => x.name === n);
      const w = f?.w ?? "400;700";
      return `family=${n.replace(/ /g, "+")}:wght@${w}`;
    })
    .join("&");
  return `https://fonts.googleapis.com/css2?${fams}&display=swap`;
}

export type Tone = "base" | "surface" | "primary" | "dark" | "accent";
export type Anim = "subir" | "fade" | "zoom" | "lateral" | "nenhuma";
export type Align = "left" | "center" | "right";
export type Padding = "sm" | "md" | "lg";

export interface SectionStyle {
  tone: Tone;
  align: Align;
  padding: Padding;
  anim: Anim;
  variant?: string;
  hidden?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Props = Record<string, any>;

export interface Section {
  id: string;
  type: string;
  props: Props;
  style: SectionStyle;
}

export interface ThemeColors {
  bg: string;
  surface: string;
  ink: string;
  muted: string;
  primary: string;
  onPrimary: string;
  accent: string;
  onAccent: string;
  dark: string;
  onDark: string;
}

export interface Theme {
  colors: ThemeColors;
  fontHeading: string;
  fontBody: string;
  radius: number;
  headingWeight: number;
  headingUppercase: boolean;
  headingTracking: number; // em, ex: -0.02
}

export interface PageDoc {
  id: string;
  name: string;
  templateId: string;
  slug?: string;
  published?: boolean;
  publishedAt?: string;
  updatedAt: string;
  brand: { name: string; logo: string };
  seo: { title: string; description: string };
  theme: Theme;
  sections: Section[];
  aiInfo?: string;
}

export interface TemplateMeta {
  id: string;
  name: string;
  niche: string;
  description: string;
  cover: string;
}

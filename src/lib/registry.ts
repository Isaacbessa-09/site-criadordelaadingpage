import { GENERIC, PEOPLE } from "./images";
import type { Props, SectionStyle } from "./types";

export type FieldType = "text" | "textarea" | "image" | "url" | "icon" | "list";

export interface Field {
  key: string;
  label: string;
  type: FieldType;
  fields?: Field[]; // para listas
  itemLabel?: string;
}

export interface SectionDef {
  type: string;
  label: string;
  description: string;
  fields: Field[];
  variants?: { value: string; label: string }[];
  defaults: { props: Props; style: SectionStyle };
}

const st = (s: Partial<SectionStyle> = {}): SectionStyle => ({
  tone: "base",
  align: "left",
  padding: "md",
  anim: "subir",
  ...s,
});

const head: Field[] = [
  { key: "eyebrow", label: "Etiqueta (texto pequeno acima)", type: "text" },
  { key: "title", label: "Título", type: "textarea" },
  { key: "subtitle", label: "Subtítulo", type: "textarea" },
];

export const ICONS = [
  "Trophy", "Users", "Calendar", "Clock", "MapPin", "Star", "Heart", "ShieldCheck", "Sparkles",
  "Coffee", "Croissant", "Leaf", "Wifi", "Truck", "Gift", "Award", "Zap", "Target", "Dumbbell",
  "Smile", "Stethoscope", "HeartPulse", "Baby", "Syringe", "Microscope", "Phone", "MessageCircle",
  "CheckCircle", "ThumbsUp", "Sun", "Flame", "Wallet", "CreditCard", "Camera", "Music", "Utensils",
] as const;

export const SECTIONS: SectionDef[] = [
  {
    type: "navbar",
    label: "Menu (topo)",
    description: "Barra de navegação com logo, links e botão.",
    variants: [
      { value: "transparent", label: "Transparente sobre o hero" },
      { value: "solid", label: "Sólido" },
      { value: "pill", label: "Flutuante (pílula)" },
    ],
    fields: [
      { key: "links", label: "Links", type: "list", itemLabel: "Link", fields: [
        { key: "label", label: "Texto", type: "text" },
        { key: "href", label: "Link (ex: #planos)", type: "url" },
      ] },
      { key: "ctaLabel", label: "Texto do botão", type: "text" },
      { key: "ctaHref", label: "Link do botão", type: "url" },
    ],
    defaults: {
      props: {
        links: [
          { label: "Sobre", href: "#sobre" },
          { label: "Serviços", href: "#servicos" },
          { label: "Contato", href: "#contato" },
        ],
        ctaLabel: "Fale conosco",
        ctaHref: "#contato",
      },
      style: st({ variant: "solid", padding: "sm", anim: "fade" }),
    },
  },
  {
    type: "hero",
    label: "Hero (primeira dobra)",
    description: "Título principal, subtítulo, botões e imagem de destaque.",
    variants: [
      { value: "background", label: "Imagem de fundo" },
      { value: "split", label: "Texto + imagem redonda" },
      { value: "card", label: "Texto + imagem em card" },
    ],
    fields: [
      { key: "eyebrow", label: "Etiqueta", type: "text" },
      { key: "title", label: "Título", type: "textarea" },
      { key: "highlight", label: "Palavra em destaque (cor de acento)", type: "text" },
      { key: "subtitle", label: "Subtítulo", type: "textarea" },
      { key: "ctaLabel", label: "Botão principal", type: "text" },
      { key: "ctaHref", label: "Link do botão principal", type: "url" },
      { key: "cta2Label", label: "Botão secundário", type: "text" },
      { key: "cta2Href", label: "Link do botão secundário", type: "url" },
      { key: "image", label: "Imagem principal", type: "image" },
      { key: "proofValue", label: "Prova social (número)", type: "text" },
      { key: "proofLabel", label: "Prova social (texto)", type: "text" },
      { key: "avatars", label: "Fotos da prova social", type: "list", itemLabel: "Foto", fields: [
        { key: "image", label: "Foto", type: "image" },
      ] },
      { key: "badges", label: "Selos flutuantes", type: "list", itemLabel: "Selo", fields: [
        { key: "icon", label: "Ícone", type: "icon" },
        { key: "title", label: "Título", type: "text" },
        { key: "text", label: "Texto", type: "text" },
      ] },
    ],
    defaults: {
      props: {
        eyebrow: "Novidade",
        title: "Um título forte que vende o seu negócio",
        highlight: "vende",
        subtitle: "Explique em uma frase o que você faz, para quem e por que é a melhor escolha.",
        ctaLabel: "Quero conhecer",
        ctaHref: "#contato",
        cta2Label: "Saiba mais",
        cta2Href: "#sobre",
        image: GENERIC[0],
        proofValue: "1.200+",
        proofLabel: "clientes satisfeitos",
        avatars: PEOPLE.slice(0, 3).map((image) => ({ image })),
        badges: [{ icon: "Star", title: "4,9", text: "avaliação média" }],
      },
      style: st({ variant: "split", padding: "lg" }),
    },
  },
  {
    type: "marquee",
    label: "Faixa animada",
    description: "Faixa com frases curtas passando em loop.",
    fields: [
      { key: "items", label: "Frases", type: "list", itemLabel: "Frase", fields: [
        { key: "text", label: "Texto", type: "text" },
      ] },
    ],
    defaults: {
      props: { items: [{ text: "Qualidade" }, { text: "Atendimento" }, { text: "Confiança" }, { text: "Resultados" }] },
      style: st({ tone: "accent", padding: "sm", anim: "fade" }),
    },
  },
  {
    type: "stats",
    label: "Números",
    description: "Números de impacto com contagem animada.",
    fields: [
      ...head,
      { key: "items", label: "Números", type: "list", itemLabel: "Número", fields: [
        { key: "value", label: "Número", type: "text" },
        { key: "suffix", label: "Sufixo (+, %, k)", type: "text" },
        { key: "label", label: "Descrição", type: "text" },
      ] },
    ],
    defaults: {
      props: {
        eyebrow: "", title: "", subtitle: "",
        items: [
          { value: "10", suffix: "+", label: "anos de experiência" },
          { value: "2500", suffix: "+", label: "clientes atendidos" },
          { value: "98", suffix: "%", label: "de satisfação" },
        ],
      },
      style: st({ padding: "sm" }),
    },
  },
  {
    type: "about",
    label: "Sobre",
    description: "Texto sobre a empresa com imagens e lista de diferenciais.",
    variants: [
      { value: "image-right", label: "Imagem à direita" },
      { value: "image-left", label: "Imagem à esquerda" },
    ],
    fields: [
      ...head,
      { key: "text", label: "Texto", type: "textarea" },
      { key: "bullets", label: "Diferenciais", type: "list", itemLabel: "Item", fields: [
        { key: "text", label: "Texto", type: "text" },
      ] },
      { key: "image", label: "Imagem principal", type: "image" },
      { key: "image2", label: "Imagem secundária", type: "image" },
      { key: "badgeValue", label: "Selo (número)", type: "text" },
      { key: "badgeLabel", label: "Selo (texto)", type: "text" },
      { key: "ctaLabel", label: "Botão", type: "text" },
      { key: "ctaHref", label: "Link do botão", type: "url" },
    ],
    defaults: {
      props: {
        eyebrow: "Sobre nós",
        title: "Nossa história começa com uma paixão",
        subtitle: "",
        text: "Conte aqui a história do negócio, a missão e o que torna a experiência única.",
        bullets: [{ text: "Equipe especializada" }, { text: "Ambiente acolhedor" }, { text: "Atendimento personalizado" }],
        image: GENERIC[0], image2: GENERIC[2],
        badgeValue: "2015", badgeLabel: "fundada em",
        ctaLabel: "Conheça mais", ctaHref: "#contato",
      },
      style: st({ variant: "image-right" }),
    },
  },
  {
    type: "features",
    label: "Diferenciais (ícones)",
    description: "Grade de cards com ícone, título e texto.",
    fields: [
      ...head,
      { key: "items", label: "Cards", type: "list", itemLabel: "Card", fields: [
        { key: "icon", label: "Ícone", type: "icon" },
        { key: "title", label: "Título", type: "text" },
        { key: "text", label: "Texto", type: "textarea" },
      ] },
    ],
    defaults: {
      props: {
        eyebrow: "Diferenciais", title: "Por que escolher a gente", subtitle: "",
        items: [
          { icon: "Award", title: "Qualidade", text: "Explique o benefício em uma frase." },
          { icon: "Clock", title: "Agilidade", text: "Explique o benefício em uma frase." },
          { icon: "Heart", title: "Cuidado", text: "Explique o benefício em uma frase." },
        ],
      },
      style: st({ align: "center" }),
    },
  },
  {
    type: "services",
    label: "Serviços (cards com foto)",
    description: "Cards com imagem, etiqueta, título e texto.",
    fields: [
      ...head,
      { key: "items", label: "Serviços", type: "list", itemLabel: "Serviço", fields: [
        { key: "image", label: "Imagem", type: "image" },
        { key: "tag", label: "Etiqueta", type: "text" },
        { key: "title", label: "Título", type: "text" },
        { key: "text", label: "Texto", type: "textarea" },
      ] },
      { key: "ctaLabel", label: "Texto do link nos cards", type: "text" },
      { key: "ctaHref", label: "Link", type: "url" },
    ],
    defaults: {
      props: {
        eyebrow: "Serviços", title: "O que oferecemos", subtitle: "",
        items: GENERIC.map((image, i) => ({ image, tag: `0${i + 1}`, title: `Serviço ${i + 1}`, text: "Descreva o serviço em uma frase." })),
        ctaLabel: "Saiba mais", ctaHref: "#contato",
      },
      style: st(),
    },
  },
  {
    type: "products",
    label: "Produtos / Cardápio",
    description: "Lista de produtos com foto, descrição e preço.",
    fields: [
      ...head,
      { key: "items", label: "Produtos", type: "list", itemLabel: "Produto", fields: [
        { key: "image", label: "Imagem", type: "image" },
        { key: "tag", label: "Etiqueta", type: "text" },
        { key: "title", label: "Nome", type: "text" },
        { key: "text", label: "Descrição", type: "textarea" },
        { key: "price", label: "Preço", type: "text" },
      ] },
      { key: "ctaLabel", label: "Botão", type: "text" },
      { key: "ctaHref", label: "Link do botão", type: "url" },
    ],
    defaults: {
      props: {
        eyebrow: "Cardápio", title: "Os favoritos da casa", subtitle: "",
        items: GENERIC.map((image, i) => ({ image, tag: "", title: `Produto ${i + 1}`, text: "Descrição curta.", price: "R$ 19,90" })),
        ctaLabel: "Ver tudo", ctaHref: "#contato",
      },
      style: st({ align: "center" }),
    },
  },
  {
    type: "steps",
    label: "Passo a passo",
    description: "Como funciona, em etapas numeradas, com imagem.",
    fields: [
      ...head,
      { key: "image", label: "Imagem", type: "image" },
      { key: "items", label: "Etapas", type: "list", itemLabel: "Etapa", fields: [
        { key: "title", label: "Título", type: "text" },
        { key: "text", label: "Texto", type: "textarea" },
      ] },
      { key: "ctaLabel", label: "Botão", type: "text" },
      { key: "ctaHref", label: "Link do botão", type: "url" },
    ],
    defaults: {
      props: {
        eyebrow: "Como funciona", title: "Simples em 3 passos", subtitle: "", image: GENERIC[1],
        items: [
          { title: "Entre em contato", text: "Fale com a gente pelo WhatsApp." },
          { title: "Agende", text: "Escolha o melhor horário." },
          { title: "Aproveite", text: "Viva a experiência completa." },
        ],
        ctaLabel: "Começar agora", ctaHref: "#contato",
      },
      style: st({ tone: "surface" }),
    },
  },
  {
    type: "pricing",
    label: "Planos e preços",
    description: "Tabela de planos com destaque.",
    fields: [
      ...head,
      { key: "items", label: "Planos", type: "list", itemLabel: "Plano", fields: [
        { key: "name", label: "Nome", type: "text" },
        { key: "description", label: "Descrição", type: "text" },
        { key: "price", label: "Preço", type: "text" },
        { key: "period", label: "Período (/mês)", type: "text" },
        { key: "features", label: "Itens (um por linha)", type: "textarea" },
        { key: "ctaLabel", label: "Botão", type: "text" },
        { key: "highlight", label: "Destaque (escreva: sim)", type: "text" },
      ] },
      { key: "ctaHref", label: "Link dos botões", type: "url" },
    ],
    defaults: {
      props: {
        eyebrow: "Planos", title: "Escolha o seu plano", subtitle: "",
        items: [
          { name: "Básico", description: "Para começar", price: "R$ 99", period: "/mês", features: "Item 1\nItem 2\nItem 3", ctaLabel: "Assinar", highlight: "" },
          { name: "Pro", description: "O mais escolhido", price: "R$ 199", period: "/mês", features: "Tudo do Básico\nItem 4\nItem 5", ctaLabel: "Assinar", highlight: "sim" },
          { name: "Premium", description: "Experiência completa", price: "R$ 299", period: "/mês", features: "Tudo do Pro\nItem 6\nItem 7", ctaLabel: "Assinar", highlight: "" },
        ],
        ctaHref: "#contato",
      },
      style: st({ align: "center" }),
    },
  },
  {
    type: "testimonials",
    label: "Depoimentos",
    description: "Depoimentos de clientes com foto e nota.",
    fields: [
      ...head,
      { key: "items", label: "Depoimentos", type: "list", itemLabel: "Depoimento", fields: [
        { key: "quote", label: "Depoimento", type: "textarea" },
        { key: "name", label: "Nome", type: "text" },
        { key: "role", label: "Descrição", type: "text" },
        { key: "image", label: "Foto", type: "image" },
      ] },
    ],
    defaults: {
      props: {
        eyebrow: "Depoimentos", title: "Quem conhece, recomenda", subtitle: "",
        items: PEOPLE.slice(0, 3).map((image, i) => ({ quote: "Experiência incrível, atendimento impecável. Recomendo demais!", name: ["Ana Souza", "Carlos Lima", "Juliana Alves"][i], role: "Cliente", image })),
      },
      style: st(),
    },
  },
  {
    type: "team",
    label: "Equipe",
    description: "Fotos e cargos da equipe.",
    fields: [
      ...head,
      { key: "items", label: "Pessoas", type: "list", itemLabel: "Pessoa", fields: [
        { key: "image", label: "Foto", type: "image" },
        { key: "name", label: "Nome", type: "text" },
        { key: "role", label: "Cargo", type: "text" },
      ] },
    ],
    defaults: {
      props: {
        eyebrow: "Equipe", title: "Conheça nosso time", subtitle: "",
        items: PEOPLE.slice(3, 6).map((image, i) => ({ image, name: ["Marina Costa", "Pedro Rocha", "Lucas Melo"][i], role: "Especialista" })),
      },
      style: st(),
    },
  },
  {
    type: "gallery",
    label: "Galeria",
    description: "Grade de fotos em mosaico.",
    fields: [
      ...head,
      { key: "items", label: "Fotos", type: "list", itemLabel: "Foto", fields: [
        { key: "image", label: "Foto", type: "image" },
      ] },
    ],
    defaults: {
      props: { eyebrow: "Galeria", title: "Por dentro do nosso espaço", subtitle: "", items: [...GENERIC, ...GENERIC].map((image) => ({ image })) },
      style: st({ align: "center" }),
    },
  },
  {
    type: "faq",
    label: "Perguntas frequentes",
    description: "Perguntas e respostas em acordeão.",
    fields: [
      ...head,
      { key: "items", label: "Perguntas", type: "list", itemLabel: "Pergunta", fields: [
        { key: "q", label: "Pergunta", type: "text" },
        { key: "a", label: "Resposta", type: "textarea" },
      ] },
    ],
    defaults: {
      props: {
        eyebrow: "Dúvidas", title: "Perguntas frequentes", subtitle: "",
        items: [
          { q: "Como faço para agendar?", a: "Pelo WhatsApp ou pelo botão desta página." },
          { q: "Quais as formas de pagamento?", a: "Pix, cartão de crédito e débito." },
          { q: "Onde vocês ficam?", a: "Veja o mapa no fim da página." },
        ],
      },
      style: st(),
    },
  },
  {
    type: "cta",
    label: "Chamada final (CTA)",
    description: "Bloco de conversão com imagem de fundo e botão.",
    fields: [
      { key: "eyebrow", label: "Etiqueta", type: "text" },
      { key: "title", label: "Título", type: "textarea" },
      { key: "subtitle", label: "Subtítulo", type: "textarea" },
      { key: "ctaLabel", label: "Botão", type: "text" },
      { key: "ctaHref", label: "Link do botão", type: "url" },
      { key: "image", label: "Imagem de fundo", type: "image" },
    ],
    defaults: {
      props: { eyebrow: "", title: "Pronto para começar?", subtitle: "Fale com a gente agora mesmo.", ctaLabel: "Chamar no WhatsApp", ctaHref: "#contato", image: GENERIC[2] },
      style: st({ tone: "dark" }),
    },
  },
  {
    type: "contact",
    label: "Contato e localização",
    description: "Endereço, horários, WhatsApp e mapa.",
    fields: [
      ...head,
      { key: "address", label: "Endereço", type: "text" },
      { key: "phone", label: "Telefone", type: "text" },
      { key: "whatsapp", label: "WhatsApp (só números, com DDD)", type: "text" },
      { key: "email", label: "E-mail", type: "text" },
      { key: "instagram", label: "Instagram (@)", type: "text" },
      { key: "hours", label: "Horários (um por linha)", type: "textarea" },
      { key: "mapQuery", label: "Endereço para o mapa", type: "text" },
    ],
    defaults: {
      props: {
        eyebrow: "Contato", title: "Venha nos visitar", subtitle: "",
        address: "Rua Exemplo, 123 - Centro, São Paulo - SP", phone: "(11) 99999-9999", whatsapp: "5511999999999",
        email: "contato@seusite.com", instagram: "@seuperfil", hours: "Seg a Sex: 8h às 20h\nSáb: 8h às 14h",
        mapQuery: "Avenida Paulista, São Paulo",
      },
      style: st(),
    },
  },
  {
    type: "footer",
    label: "Rodapé",
    description: "Rodapé com marca, links e direitos.",
    fields: [
      { key: "text", label: "Texto curto", type: "textarea" },
      { key: "links", label: "Links", type: "list", itemLabel: "Link", fields: [
        { key: "label", label: "Texto", type: "text" },
        { key: "href", label: "Link", type: "url" },
      ] },
      { key: "copyright", label: "Direitos", type: "text" },
    ],
    defaults: {
      props: {
        text: "Uma frase curta sobre o negócio.",
        links: [{ label: "Sobre", href: "#sobre" }, { label: "Contato", href: "#contato" }],
        copyright: "© 2026 Todos os direitos reservados.",
      },
      style: st({ tone: "dark", padding: "sm", anim: "fade" }),
    },
  },
];

export const SECTION_MAP: Record<string, SectionDef> = Object.fromEntries(SECTIONS.map((s) => [s.type, s]));

/** Caminhos de campos de imagem de um tipo (para preservar na IA). */
export function imageKeys(type: string): { top: string[]; list: Record<string, string[]> } {
  const def = SECTION_MAP[type];
  const top: string[] = [];
  const list: Record<string, string[]> = {};
  def?.fields.forEach((f) => {
    if (f.type === "image") top.push(f.key);
    if (f.type === "list") list[f.key] = (f.fields ?? []).filter((x) => x.type === "image").map((x) => x.key);
  });
  return { top, list };
}

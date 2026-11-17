import { img, PEOPLE } from "./images";
import { SECTION_MAP } from "./registry";
import type { PageDoc, Props, Section, SectionStyle, TemplateMeta } from "./types";

let n = 0;
function sec(type: string, props: Props, style: Partial<SectionStyle> = {}): Section {
  const def = SECTION_MAP[type];
  return { id: `${type}_${++n}`, type, props: { ...def.defaults.props, ...props }, style: { ...def.defaults.style, ...style } };
}

type Tpl = Omit<PageDoc, "id" | "updatedAt" | "name">;

/* ============================================================
   1) ESPORTE â€” padel, tÃªnis, beach tennis, academias, quadras
   ============================================================ */
const esporte = (): Tpl => ({
  templateId: "esporte",
  brand: { name: "ARENA", logo: "" },
  seo: { title: "Arena â€” Padel & TÃªnis", description: "Quadras, aulas e comunidade para todos os nÃ­veis." },
  theme: {
    colors: {
      bg: "#F3F4EF", surface: "#FFFFFF", ink: "#0B1220", muted: "#556070",
      primary: "#0E2A52", onPrimary: "#FFFFFF", accent: "#C8F135", onAccent: "#0B1220",
      dark: "#0A1424", onDark: "#F3F4EF",
    },
    fontHeading: "Inter Tight", fontBody: "Inter", radius: 22, headingWeight: 600, headingUppercase: false, headingTracking: -0.035,
  },
  sections: [
    sec("navbar", {
      links: [
        { label: "Sobre", href: "#sobre" }, { label: "Quadras", href: "#servicos" },
        { label: "Planos", href: "#planos" }, { label: "Contato", href: "#contato" },
      ],
      ctaLabel: "Reservar quadra", ctaHref: "#planos",
    }, { variant: "transparent" }),
    sec("hero", {
      eyebrow: "Centro de padel & tÃªnis",
      title: "Seu jogo, seu estilo. Quadras para todos os nÃ­veis.",
      highlight: "seu estilo.",
      subtitle: "Quadras cobertas, aulas com professores certificados e uma comunidade que joga junto toda semana.",
      ctaLabel: "Entrar para o grupo", ctaHref: "#planos",
      cta2Label: "Ver quadras", cta2Href: "#servicos",
      image: img("1646649853703-7645147474ba", 2200),
      proofValue: "1.200+", proofLabel: "jogadores ativos",
      avatars: PEOPLE.slice(0, 4).map((image) => ({ image })),
      badges: [
        { icon: "Trophy", title: "Torneios", text: "todo mÃªs" },
        { icon: "Clock", title: "6h Ã s 23h", text: "aberto todos os dias" },
      ],
    }, { variant: "background", padding: "lg" }),
    sec("marquee", {
      items: [{ text: "Aulas para iniciantes" }, { text: "Quadras cobertas" }, { text: "Torneios mensais" }, { text: "Day use" }, { text: "Bar & lounge" }],
    }, { tone: "accent" }),
    sec("about", {
      eyebrow: "Sobre o clube",
      title: "Esporte e comunidade no mesmo lugar.",
      text: "Do primeiro saque ao torneio: aqui iniciantes e profissionais encontram o seu lugar. Estrutura completa para treinar, jogar com amigos e evoluir de verdade.",
      bullets: [{ text: "6 quadras cobertas" }, { text: "Professores certificados" }, { text: "Aluguel de raquetes" }, { text: "VestiÃ¡rios completos" }],
      image: img("1770230901556-4e1c0bacfb09"), image2: img("1658723826297-fe4d1b1e6600", 900),
      badgeValue: "2020", badgeLabel: "fundado em",
      ctaLabel: "Fale com a gente", ctaHref: "#contato",
    }),
    sec("stats", {
      items: [
        { value: "15", suffix: "+", label: "anos de experiÃªncia" },
        { value: "32", suffix: "k", label: "aulas realizadas" },
        { value: "90", suffix: "+", label: "torneios organizados" },
        { value: "6", suffix: "", label: "quadras cobertas" },
      ],
    }, { tone: "surface", padding: "sm" }),
    sec("services", {
      eyebrow: "Estrutura",
      title: "Explore nossa estrutura",
      subtitle: "Tudo o que vocÃª precisa para jogar, treinar e se divertir.",
      items: [
        { image: img("1767128890583-b3f8dc30bdbc", 1000), tag: "Quadras", title: "Quadras premium", text: "Piso profissional, iluminaÃ§Ã£o de LED e cobertura total." },
        { image: img("1767128890439-1af9ca2ff1ac", 1000), tag: "Aulas", title: "Aulas e clÃ­nicas", text: "Do iniciante ao avanÃ§ado, em grupo ou individual." },
        { image: img("1657704358775-ed705c7388d2", 1000), tag: "Aluguel", title: "Equipamentos", text: "Raquetes e bolas de alta performance para alugar." },
        { image: img("1646651105426-e8c8ee9badde", 1000), tag: "Eventos", title: "Torneios", text: "CompetiÃ§Ãµes amistosas e oficiais todo mÃªs." },
      ],
      ctaLabel: "Reservar agora", ctaHref: "#planos",
    }),
    sec("steps", {
      eyebrow: "Como entrar",
      title: "Comece a jogar em 4 passos",
      image: img("1767128890954-20ce481be8f0", 1200),
      items: [
        { title: "FaÃ§a seu cadastro", text: "Leva menos de 1 minuto pelo WhatsApp." },
        { title: "Entre no grupo da comunidade", text: "Partidas marcadas toda semana." },
        { title: "Reserve sua primeira aula", text: "A aula experimental Ã© por nossa conta." },
        { title: "Comece a jogar", text: "E evolua com acompanhamento." },
      ],
      ctaLabel: "Quero comeÃ§ar", ctaHref: "#contato",
    }, { tone: "base" }),
    sec("pricing", {
      eyebrow: "Planos",
      title: "Escolha o plano ideal para o seu jogo",
      subtitle: "Mensal, sem fidelidade. Cancele quando quiser.",
      items: [
        { name: "BÃ¡sico", description: "Para quem estÃ¡ comeÃ§ando", price: "R$ 189", period: "/mÃªs", features: "4 horas de quadra\nJogos da comunidade\nAula experimental grÃ¡tis\nDesconto no bar", ctaLabel: "Assinar BÃ¡sico", highlight: "" },
        { name: "Premium", description: "Para quem joga toda semana", price: "R$ 349", period: "/mÃªs", features: "Reserva com prioridade\n10 horas de quadra\n2 aulas em grupo/mÃªs\nEventos exclusivos\nAluguel de raquete grÃ¡tis", ctaLabel: "Assinar Premium", highlight: "sim" },
        { name: "Pro", description: "Para quem quer competir", price: "R$ 549", period: "/mÃªs", features: "Quadra ilimitada*\n4 aulas individuais/mÃªs\nTorneios inclusos\nAvaliaÃ§Ã£o tÃ©cnica", ctaLabel: "Assinar Pro", highlight: "" },
      ],
      ctaHref: "#contato",
    }, { tone: "accent", align: "center" }),
    sec("testimonials", {
      eyebrow: "Depoimentos",
      title: "O que nossos membros dizem",
      items: [
        { quote: "Entrar para o clube foi a melhor decisÃ£o do meu ano. O ambiente Ã© incrÃ­vel e toda partida Ã© uma diversÃ£o.", name: "Marina S.", role: "Membro hÃ¡ 2 anos", image: PEOPLE[0] },
        { quote: "Comecei sem saber segurar a raquete. Hoje jogo torneios com os amigos que fiz aqui.", name: "Rafael T.", role: "Membro Premium", image: PEOPLE[1] },
        { quote: "Estrutura impecÃ¡vel e professores que realmente se importam com sua evoluÃ§Ã£o.", name: "Juliana P.", role: "Aluna", image: PEOPLE[2] },
      ],
    }),
    sec("team", {
      eyebrow: "Professores",
      title: "ConheÃ§a nossos treinadores",
      items: [
        { image: img("1767128890439-1af9ca2ff1ac", 800), name: "Diego Martins", role: "Head coach" },
        { image: img("1767128890954-20ce481be8f0", 800), name: "Carla Nunes", role: "Treinadora" },
        { image: img("1646651105426-e8c8ee9badde", 800), name: "Bruno Alves", role: "Preparador fÃ­sico" },
      ],
    }, { tone: "dark" }),
    sec("faq", {
      eyebrow: "DÃºvidas",
      title: "Perguntas frequentes",
      items: [
        { q: "Preciso ter raquete?", a: "NÃ£o. Alugamos raquetes e bolas de alta performance na recepÃ§Ã£o." },
        { q: "Nunca joguei. Posso comeÃ§ar?", a: "Pode! A aula experimental Ã© gratuita e temos turmas sÃ³ para iniciantes." },
        { q: "Como reservo uma quadra?", a: "Pelo WhatsApp ou direto no app do clube, com atÃ© 7 dias de antecedÃªncia." },
        { q: "Tem estacionamento?", a: "Sim, estacionamento gratuito para membros e alunos." },
      ],
    }),
    sec("cta", {
      eyebrow: "Bora jogar?",
      title: "Pronto para entrar em quadra com a gente?",
      subtitle: "Partidas amistosas, treinos e uma comunidade que parece famÃ­lia.",
      ctaLabel: "Agendar aula grÃ¡tis", ctaHref: "#contato",
      image: img("1759355456246-6937354a395d", 2000),
    }, { tone: "base" }),
    sec("contact", {
      eyebrow: "Contato", title: "Venha conhecer o clube",
      address: "Av. dos Esportes, 1000 - Jardins, SÃ£o Paulo - SP", phone: "(11) 99999-0000", whatsapp: "5511999990000",
      email: "contato@arena.com.br", instagram: "@arenaclube", hours: "Seg a Sex: 6h Ã s 23h\nSÃ¡b e Dom: 7h Ã s 21h",
      mapQuery: "Parque Ibirapuera, SÃ£o Paulo",
    }, { tone: "surface" }),
    sec("footer", {
      text: "Padel, tÃªnis e comunidade. Jogue mais, jogue junto.",
      links: [{ label: "Sobre", href: "#sobre" }, { label: "Planos", href: "#planos" }, { label: "Contato", href: "#contato" }],
      copyright: "Â© 2026 Arena Clube. Todos os direitos reservados.",
    }),
  ],
});

/* ============================================================
   2) CAFETERIA â€” cafÃ©s, padarias, docerias, restaurantes
   ============================================================ */
const cafe = (): Tpl => ({
  templateId: "cafe",
  brand: { name: "GrÃ£o & Co.", logo: "" },
  seo: { title: "GrÃ£o & Co. â€” Cafeteria", description: "CafÃ©s especiais, doces artesanais e um cantinho para ficar." },
  theme: {
    colors: {
      bg: "#FBF6EF", surface: "#F3E9DC", ink: "#2A1A12", muted: "#6E5A4D",
      primary: "#3B2418", onPrimary: "#FBF6EF", accent: "#C8642B", onAccent: "#FFFFFF",
      dark: "#24150E", onDark: "#FBF6EF",
    },
    fontHeading: "Fraunces", fontBody: "DM Sans", radius: 26, headingWeight: 600, headingUppercase: false, headingTracking: -0.025,
  },
  sections: [
    sec("navbar", {
      links: [
        { label: "CardÃ¡pio", href: "#cardapio" }, { label: "Nossa histÃ³ria", href: "#sobre" },
        { label: "Depoimentos", href: "#depoimentos" }, { label: "Onde estamos", href: "#contato" },
      ],
      ctaLabel: "Pedir agora", ctaHref: "#contato",
    }, { variant: "pill" }),
    sec("hero", {
      eyebrow: "Torra prÃ³pria, feito com carinho",
      title: "O cafÃ© que faz o seu dia comeÃ§ar melhor.",
      highlight: "melhor.",
      subtitle: "GrÃ£os especiais torrados na casa, doces artesanais saindo do forno e aquele cantinho perfeito para ficar.",
      ctaLabel: "Ver cardÃ¡pio", ctaHref: "#cardapio",
      cta2Label: "Como chegar", cta2Href: "#contato",
      image: img("1509042239860-f550ce710b93", 1400),
      proofValue: "4,9 â˜…", proofLabel: "+2.300 avaliaÃ§Ãµes no Google",
      avatars: PEOPLE.slice(2, 5).map((image) => ({ image })),
      badges: [
        { icon: "Coffee", title: "100% arÃ¡bica", text: "grÃ£os especiais" },
        { icon: "Truck", title: "Delivery", text: "em atÃ© 30 min" },
      ],
    }, { variant: "split", padding: "lg" }),
    sec("marquee", {
      items: [{ text: "Espresso" }, { text: "Cappuccino" }, { text: "Cold brew" }, { text: "Croissant" }, { text: "PÃ£o de queijo" }, { text: "Bolo do dia" }],
    }, { tone: "primary" }),
    sec("features", {
      eyebrow: "Por que a gente",
      title: "Pequenos detalhes, grande diferenÃ§a",
      items: [
        { icon: "Leaf", title: "GrÃ£os especiais", text: "Direto de pequenos produtores do sul de Minas." },
        { icon: "Flame", title: "Torra prÃ³pria", text: "Torramos toda semana para garantir frescor." },
        { icon: "Croissant", title: "Feito na casa", text: "PÃ£es e doces artesanais, saindo do forno." },
        { icon: "Wifi", title: "Wi-fi e tomadas", text: "Um cantinho perfeito para trabalhar ou ler." },
      ],
    }, { align: "center" }),
    sec("products", {
      eyebrow: "CardÃ¡pio",
      title: "Os queridinhos da casa",
      subtitle: "Uma seleÃ§Ã£o dos mais pedidos. PeÃ§a no balcÃ£o ou pelo delivery.",
      items: [
        { image: img("1497636577773-f1231844b336", 800), tag: "Mais pedido", title: "Cappuccino", text: "Espresso, leite vaporizado e espuma cremosa.", price: "R$ 14" },
        { image: img("1760662018512-e881f06d0fe0", 800), tag: "Gelado", title: "Iced caramel", text: "Cold brew, leite e calda de caramelo salgado.", price: "R$ 18" },
        { image: img("1559001724-fbad036dbc9e", 800), tag: "", title: "Latte", text: "Suave e cremoso, com latte art.", price: "R$ 15" },
        { image: img("1542372147193-a7aca54189cd", 800), tag: "Combo", title: "Croissant + cafÃ©", text: "Croissant de manteiga e cafÃ© coado.", price: "R$ 22" },
      ],
      ctaLabel: "Ver cardÃ¡pio completo", ctaHref: "#contato",
    }, { align: "center", tone: "surface" }),
    sec("about", {
      eyebrow: "Nossa histÃ³ria",
      title: "Uma paixÃ£o que virou ponto de encontro.",
      text: "ComeÃ§amos em 2016 com uma mÃ¡quina de espresso e um sonho: servir o melhor cafÃ© do bairro. Hoje somos o cantinho favorito de quem ama cafÃ© de verdade.",
      bullets: [{ text: "Baristas premiados" }, { text: "Ambiente pet friendly" }, { text: "OpÃ§Ãµes veganas" }, { text: "Leites vegetais" }],
      image: img("1541167760496-1628856ab772", 1200), image2: img("1600093463592-8e36ae95ef56", 800),
      badgeValue: "2016", badgeLabel: "desde",
      ctaLabel: "Venha nos visitar", ctaHref: "#contato",
    }, { variant: "image-left" }),
    sec("cta", {
      eyebrow: "Oferta especial",
      title: "Ganhe 10% de desconto na primeira visita.",
      subtitle: "Mostre esta pÃ¡gina no balcÃ£o e aproveite. VÃ¡lido de segunda a sexta.",
      ctaLabel: "Quero meu desconto", ctaHref: "#contato",
      image: img("1447933601403-0c6688de566e", 2000),
    }, { align: "center", tone: "base" }),
    sec("gallery", {
      eyebrow: "Galeria", title: "Um pouco do nosso cantinho",
      items: [
        img("1567880905822-56f8e06fe630", 900), img("1512568400610-62da28bc8a13", 900), img("1769114474398-a7aef0625ef0", 900),
        img("1511920170033-f8396924c348", 900), img("1563311977-d285756282dc", 900), img("1529892485617-25f63cd7b1e9", 900),
        img("1495474472287-4d71bcdd2085", 900), img("1600093463592-8e36ae95ef56", 900),
      ].map((image) => ({ image })),
    }, { align: "center" }),
    sec("testimonials", {
      eyebrow: "Depoimentos",
      title: "Quem prova, volta",
      items: [
        { quote: "O melhor cappuccino da cidade, sem exagero. E o croissant Ã© de outro mundo.", name: "Beatriz M.", role: "Cliente fiel", image: PEOPLE[3] },
        { quote: "Meu escritÃ³rio oficial Ã s sextas. Wi-fi Ã³timo, cafÃ© perfeito e equipe super simpÃ¡tica.", name: "Lucas F.", role: "Designer", image: PEOPLE[4] },
        { quote: "Ambiente aconchegante e doces maravilhosos. Virou programa de famÃ­lia.", name: "Paula R.", role: "Cliente", image: PEOPLE[5] },
      ],
    }, { tone: "surface" }),
    sec("contact", {
      eyebrow: "Onde estamos", title: "Passa aqui pra um cafÃ©",
      address: "Rua das Flores, 245 - Vila Madalena, SÃ£o Paulo - SP", phone: "(11) 98888-0000", whatsapp: "5511988880000",
      email: "ola@graoeco.com.br", instagram: "@graoeco", hours: "Seg a Sex: 7h Ã s 20h\nSÃ¡b e Dom: 8h Ã s 18h",
      mapQuery: "Vila Madalena, SÃ£o Paulo",
    }),
    sec("footer", {
      text: "CafÃ©s especiais, doces artesanais e um cantinho pra ficar.",
      links: [{ label: "CardÃ¡pio", href: "#cardapio" }, { label: "HistÃ³ria", href: "#sobre" }, { label: "Contato", href: "#contato" }],
      copyright: "Â© 2026 GrÃ£o & Co. Todos os direitos reservados.",
    }),
  ],
});

/* ============================================================
   3) CLÃNICA / ESPECIALISTA â€” odonto, estÃ©tica, mÃ©dicos, fisio
   ============================================================ */
const clinica = (): Tpl => ({
  templateId: "clinica",
  brand: { name: "Vitta ClÃ­nica", logo: "" },
  seo: { title: "Vitta ClÃ­nica â€” Odontologia e EstÃ©tica", description: "Atendimento humanizado com tecnologia de ponta." },
  theme: {
    colors: {
      bg: "#FFFFFF", surface: "#EFF6F6", ink: "#0E2A33", muted: "#4E6670",
      primary: "#0E3B43", onPrimary: "#FFFFFF", accent: "#0B7A75", onAccent: "#FFFFFF",
      dark: "#0A2A30", onDark: "#F1F8F8",
    },
    fontHeading: "Figtree", fontBody: "Inter", radius: 20, headingWeight: 700, headingUppercase: false, headingTracking: -0.03,
  },
  sections: [
    sec("navbar", {
      links: [
        { label: "Tratamentos", href: "#diferenciais" }, { label: "Especialista", href: "#sobre" },
        { label: "Como funciona", href: "#como-funciona" }, { label: "Contato", href: "#contato" },
      ],
      ctaLabel: "Agendar consulta", ctaHref: "#contato",
    }, { variant: "solid" }),
    sec("hero", {
      eyebrow: "Agenda aberta esta semana",
      title: "Seu sorriso em boas mÃ£os, com cuidado de verdade.",
      highlight: "cuidado de verdade.",
      subtitle: "Odontologia completa com tecnologia de ponta e um atendimento humanizado, do primeiro contato ao pÃ³s-tratamento.",
      ctaLabel: "Agendar avaliaÃ§Ã£o", ctaHref: "#contato",
      cta2Label: "Ver tratamentos", cta2Href: "#diferenciais",
      image: img("1777331903190-341a3dd0441b", 1400),
      proofValue: "+5.000", proofLabel: "pacientes atendidos",
      avatars: PEOPLE.slice(0, 3).map((image) => ({ image })),
      badges: [
        { icon: "ShieldCheck", title: "CRO ativo", text: "profissionais registrados" },
        { icon: "Star", title: "5,0 no Google", text: "+800 avaliaÃ§Ãµes" },
        { icon: "Calendar", title: "Seg a SÃ¡b", text: "horÃ¡rios flexÃ­veis" },
      ],
    }, { variant: "card", padding: "lg" }),
    sec("stats", {
      items: [
        { value: "12", suffix: "+", label: "anos de experiÃªncia" },
        { value: "5000", suffix: "+", label: "pacientes atendidos" },
        { value: "98", suffix: "%", label: "recomendam a clÃ­nica" },
        { value: "8", suffix: "", label: "especialidades" },
      ],
    }, { tone: "primary", padding: "sm" }),
    sec("features", {
      eyebrow: "Tratamentos",
      title: "Cuidado completo em um sÃ³ lugar",
      subtitle: "Do check-up preventivo aos tratamentos estÃ©ticos mais modernos.",
      items: [
        { icon: "Smile", title: "Clareamento", text: "Dentes mais brancos com seguranÃ§a e sem sensibilidade." },
        { icon: "ShieldCheck", title: "Implantes", text: "Recupere a funÃ§Ã£o e a estÃ©tica com implantes de titÃ¢nio." },
        { icon: "Sparkles", title: "Lentes de contato", text: "Sorriso harmÃ´nico com facetas ultrafinas." },
        { icon: "HeartPulse", title: "PrevenÃ§Ã£o", text: "Limpeza, avaliaÃ§Ã£o e acompanhamento periÃ³dico." },
        { icon: "Baby", title: "Odontopediatria", text: "Atendimento lÃºdico e acolhedor para crianÃ§as." },
        { icon: "Microscope", title: "Tecnologia", text: "Escaneamento digital e radiografia de baixa dose." },
      ],
    }),
    sec("about", {
      eyebrow: "Especialista",
      title: "Dra. Helena Duarte",
      subtitle: "CirurgiÃ£-dentista Â· CRO-SP 00000",
      text: "Especialista em reabilitaÃ§Ã£o oral e estÃ©tica, com mais de 12 anos de experiÃªncia. Acredito que cada sorriso Ã© Ãºnico e merece um plano de tratamento pensado para vocÃª.",
      bullets: [{ text: "EspecializaÃ§Ã£o em Implantodontia" }, { text: "Mestre em EstÃ©tica" }, { text: "Membro da SBOE" }, { text: "Atendimento humanizado" }],
      image: img("1594824476967-48c8b964273f", 1200), image2: img("1629909613654-28e377c37b09", 800),
      badgeValue: "12+", badgeLabel: "anos",
      ctaLabel: "Agendar com a Dra.", ctaHref: "#contato",
    }, { tone: "surface", variant: "image-left" }),
    sec("steps", {
      eyebrow: "Como funciona",
      title: "Seu tratamento em 3 passos simples",
      image: img("1606811971618-4486d14f3f99", 1200),
      items: [
        { title: "Agende sua avaliaÃ§Ã£o", text: "Pelo WhatsApp, em menos de 2 minutos." },
        { title: "Receba seu plano", text: "DiagnÃ³stico completo e orÃ§amento transparente." },
        { title: "Comece o tratamento", text: "Com acompanhamento em todas as etapas." },
      ],
      ctaLabel: "Agendar avaliaÃ§Ã£o", ctaHref: "#contato",
    }),
    sec("testimonials", {
      eyebrow: "Depoimentos",
      title: "HistÃ³rias de quem voltou a sorrir",
      items: [
        { quote: "Tinha muito medo de dentista e fui tratada com uma paciÃªncia enorme. Hoje sorrio sem vergonha!", name: "Fernanda L.", role: "Lentes de contato", image: PEOPLE[0] },
        { quote: "Implante feito com todo o cuidado, sem dor nenhuma. Equipe nota 10.", name: "Roberto A.", role: "Implante", image: PEOPLE[6] },
        { quote: "Levo meus filhos desde pequenos. Eles amam ir Ã  clÃ­nica, acredita?", name: "Camila S.", role: "Odontopediatria", image: PEOPLE[3] },
      ],
    }, { tone: "surface" }),
    sec("faq", {
      eyebrow: "DÃºvidas",
      title: "Perguntas frequentes",
      items: [
        { q: "VocÃªs aceitam convÃªnio?", a: "Atendemos particular e emitimos nota para reembolso. Consulte os convÃªnios parceiros pelo WhatsApp." },
        { q: "A primeira avaliaÃ§Ã£o Ã© paga?", a: "A avaliaÃ§Ã£o inicial inclui exame clÃ­nico completo e plano de tratamento personalizado." },
        { q: "Posso parcelar o tratamento?", a: "Sim, em atÃ© 12x no cartÃ£o ou condiÃ§Ãµes especiais no boleto." },
        { q: "O tratamento dÃ³i?", a: "Utilizamos anestesia moderna e tÃ©cnicas minimamente invasivas para o seu conforto." },
      ],
    }),
    sec("cta", {
      eyebrow: "Agenda aberta",
      title: "DÃª o primeiro passo para o sorriso que vocÃª merece.",
      subtitle: "Agende sua avaliaÃ§Ã£o agora e receba um plano de tratamento completo.",
      ctaLabel: "Agendar pelo WhatsApp", ctaHref: "#contato",
      image: img("1629909613654-28e377c37b09", 2000),
    }, { align: "center", tone: "base" }),
    sec("contact", {
      eyebrow: "Contato", title: "Estamos esperando por vocÃª",
      address: "Rua da SaÃºde, 500 - sala 12 - Moema, SÃ£o Paulo - SP", phone: "(11) 3333-0000", whatsapp: "5511977770000",
      email: "contato@vittaclinica.com.br", instagram: "@vittaclinica", hours: "Seg a Sex: 8h Ã s 19h\nSÃ¡b: 8h Ã s 13h",
      mapQuery: "Moema, SÃ£o Paulo",
    }, { tone: "surface" }),
    sec("footer", {
      text: "Odontologia e estÃ©tica com atendimento humanizado. ResponsÃ¡vel tÃ©cnico: Dra. Helena Duarte Â· CRO-SP 00000.",
      links: [{ label: "Tratamentos", href: "#diferenciais" }, { label: "Especialista", href: "#sobre" }, { label: "Contato", href: "#contato" }],
      copyright: "Â© 2026 Vitta ClÃ­nica. Todos os direitos reservados.",
    }),
  ],
});

export const TEMPLATES: (TemplateMeta & { build: () => Tpl })[] = [
  {
    id: "esporte", name: "Arena", niche: "Esportes: padel, tÃªnis, beach tennis, academias",
    description: "Hero com foto em tela cheia, faixa animada, estrutura, planos e professores.",
    cover: img("1646649853703-7645147474ba", 900), build: esporte,
  },
  {
    id: "cafe", name: "GrÃ£o", niche: "Cafeteria, padaria, doceria, restaurante",
    description: "Visual acolhedor com imagem redonda, cardÃ¡pio com preÃ§os, galeria e oferta.",
    cover: img("1509042239860-f550ce710b93", 900), build: cafe,
  },
  {
    id: "clinica", name: "Vitta", niche: "ClÃ­nicas e especialistas: odonto, estÃ©tica, saÃºde",
    description: "Transmite confianÃ§a: selos, especialista, tratamentos, passo a passo e FAQ.",
    cover: img("1777331903190-341a3dd0441b", 900), build: clinica,
  },
];

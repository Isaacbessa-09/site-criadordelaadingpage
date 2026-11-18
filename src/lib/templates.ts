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
   1) ESPORTE — padel, tênis, beach tennis, academias, quadras
   ============================================================ */
const esporte = (): Tpl => ({
  templateId: "esporte",
  brand: { name: "ARENA", logo: "" },
  seo: { title: "Arena — Padel & Tênis", description: "Quadras, aulas e comunidade para todos os níveis." },
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
      eyebrow: "Centro de padel & tênis",
      title: "Seu jogo, seu estilo. Quadras para todos os níveis.",
      highlight: "seu estilo.",
      subtitle: "Quadras cobertas, aulas com professores certificados e uma comunidade que joga junto toda semana.",
      ctaLabel: "Entrar para o grupo", ctaHref: "#planos",
      cta2Label: "Ver quadras", cta2Href: "#servicos",
      image: img("1646649853703-7645147474ba", 2200),
      proofValue: "1.200+", proofLabel: "jogadores ativos",
      avatars: PEOPLE.slice(0, 4).map((image) => ({ image })),
      badges: [
        { icon: "Trophy", title: "Torneios", text: "todo mês" },
        { icon: "Clock", title: "6h às 23h", text: "aberto todos os dias" },
      ],
    }, { variant: "background", padding: "lg" }),
    sec("marquee", {
      items: [{ text: "Aulas para iniciantes" }, { text: "Quadras cobertas" }, { text: "Torneios mensais" }, { text: "Day use" }, { text: "Bar & lounge" }],
    }, { tone: "accent" }),
    sec("about", {
      eyebrow: "Sobre o clube",
      title: "Esporte e comunidade no mesmo lugar.",
      text: "Do primeiro saque ao torneio: aqui iniciantes e profissionais encontram o seu lugar. Estrutura completa para treinar, jogar com amigos e evoluir de verdade.",
      bullets: [{ text: "6 quadras cobertas" }, { text: "Professores certificados" }, { text: "Aluguel de raquetes" }, { text: "Vestiários completos" }],
      image: img("1770230901556-4e1c0bacfb09"), image2: img("1658723826297-fe4d1b1e6600", 900),
      badgeValue: "2020", badgeLabel: "fundado em",
      ctaLabel: "Fale com a gente", ctaHref: "#contato",
    }),
    sec("stats", {
      items: [
        { value: "15", suffix: "+", label: "anos de experiência" },
        { value: "32", suffix: "k", label: "aulas realizadas" },
        { value: "90", suffix: "+", label: "torneios organizados" },
        { value: "6", suffix: "", label: "quadras cobertas" },
      ],
    }, { tone: "surface", padding: "sm" }),
    sec("services", {
      eyebrow: "Estrutura",
      title: "Explore nossa estrutura",
      subtitle: "Tudo o que você precisa para jogar, treinar e se divertir.",
      items: [
        { image: img("1767128890583-b3f8dc30bdbc", 1000), tag: "Quadras", title: "Quadras premium", text: "Piso profissional, iluminação de LED e cobertura total." },
        { image: img("1767128890439-1af9ca2ff1ac", 1000), tag: "Aulas", title: "Aulas e clínicas", text: "Do iniciante ao avançado, em grupo ou individual." },
        { image: img("1657704358775-ed705c7388d2", 1000), tag: "Aluguel", title: "Equipamentos", text: "Raquetes e bolas de alta performance para alugar." },
        { image: img("1646651105426-e8c8ee9badde", 1000), tag: "Eventos", title: "Torneios", text: "Competições amistosas e oficiais todo mês." },
      ],
      ctaLabel: "Reservar agora", ctaHref: "#planos",
    }),
    sec("steps", {
      eyebrow: "Como entrar",
      title: "Comece a jogar em 4 passos",
      image: img("1767128890954-20ce481be8f0", 1200),
      items: [
        { title: "Faça seu cadastro", text: "Leva menos de 1 minuto pelo WhatsApp." },
        { title: "Entre no grupo da comunidade", text: "Partidas marcadas toda semana." },
        { title: "Reserve sua primeira aula", text: "A aula experimental é por nossa conta." },
        { title: "Comece a jogar", text: "E evolua com acompanhamento." },
      ],
      ctaLabel: "Quero começar", ctaHref: "#contato",
    }, { tone: "base" }),
    sec("pricing", {
      eyebrow: "Planos",
      title: "Escolha o plano ideal para o seu jogo",
      subtitle: "Mensal, sem fidelidade. Cancele quando quiser.",
      items: [
        { name: "Básico", description: "Para quem está começando", price: "R$ 189", period: "/mês", features: "4 horas de quadra\nJogos da comunidade\nAula experimental grátis\nDesconto no bar", ctaLabel: "Assinar Básico", highlight: "" },
        { name: "Premium", description: "Para quem joga toda semana", price: "R$ 349", period: "/mês", features: "Reserva com prioridade\n10 horas de quadra\n2 aulas em grupo/mês\nEventos exclusivos\nAluguel de raquete grátis", ctaLabel: "Assinar Premium", highlight: "sim" },
        { name: "Pro", description: "Para quem quer competir", price: "R$ 549", period: "/mês", features: "Quadra ilimitada*\n4 aulas individuais/mês\nTorneios inclusos\nAvaliação técnica", ctaLabel: "Assinar Pro", highlight: "" },
      ],
      ctaHref: "#contato",
    }, { tone: "accent", align: "center" }),
    sec("testimonials", {
      eyebrow: "Depoimentos",
      title: "O que nossos membros dizem",
      items: [
        { quote: "Entrar para o clube foi a melhor decisão do meu ano. O ambiente é incrível e toda partida é uma diversão.", name: "Marina S.", role: "Membro há 2 anos", image: PEOPLE[0] },
        { quote: "Comecei sem saber segurar a raquete. Hoje jogo torneios com os amigos que fiz aqui.", name: "Rafael T.", role: "Membro Premium", image: PEOPLE[1] },
        { quote: "Estrutura impecável e professores que realmente se importam com sua evolução.", name: "Juliana P.", role: "Aluna", image: PEOPLE[2] },
      ],
    }),
    sec("team", {
      eyebrow: "Professores",
      title: "Conheça nossos treinadores",
      items: [
        { image: img("1767128890439-1af9ca2ff1ac", 800), name: "Diego Martins", role: "Head coach" },
        { image: img("1767128890954-20ce481be8f0", 800), name: "Carla Nunes", role: "Treinadora" },
        { image: img("1646651105426-e8c8ee9badde", 800), name: "Bruno Alves", role: "Preparador físico" },
      ],
    }, { tone: "dark" }),
    sec("faq", {
      eyebrow: "Dúvidas",
      title: "Perguntas frequentes",
      items: [
        { q: "Preciso ter raquete?", a: "Não. Alugamos raquetes e bolas de alta performance na recepção." },
        { q: "Nunca joguei. Posso começar?", a: "Pode! A aula experimental é gratuita e temos turmas só para iniciantes." },
        { q: "Como reservo uma quadra?", a: "Pelo WhatsApp ou direto no app do clube, com até 7 dias de antecedência." },
        { q: "Tem estacionamento?", a: "Sim, estacionamento gratuito para membros e alunos." },
      ],
    }),
    sec("cta", {
      eyebrow: "Bora jogar?",
      title: "Pronto para entrar em quadra com a gente?",
      subtitle: "Partidas amistosas, treinos e uma comunidade que parece família.",
      ctaLabel: "Agendar aula grátis", ctaHref: "#contato",
      image: img("1759355456246-6937354a395d", 2000),
    }, { tone: "base" }),
    sec("contact", {
      eyebrow: "Contato", title: "Venha conhecer o clube",
      address: "Av. dos Esportes, 1000 - Jardins, São Paulo - SP", phone: "(11) 99999-0000", whatsapp: "5511999990000",
      email: "contato@arena.com.br", instagram: "@arenaclube", hours: "Seg a Sex: 6h às 23h\nSáb e Dom: 7h às 21h",
      mapQuery: "Parque Ibirapuera, São Paulo",
    }, { tone: "surface" }),
    sec("footer", {
      text: "Padel, tênis e comunidade. Jogue mais, jogue junto.",
      links: [{ label: "Sobre", href: "#sobre" }, { label: "Planos", href: "#planos" }, { label: "Contato", href: "#contato" }],
      copyright: "© 2026 Arena Clube. Todos os direitos reservados.",
    }),
  ],
});

/* ============================================================
   2) CAFETERIA — cafés, padarias, docerias, restaurantes
   ============================================================ */
const cafe = (): Tpl => ({
  templateId: "cafe",
  brand: { name: "Grão & Co.", logo: "" },
  seo: { title: "Grão & Co. — Cafeteria", description: "Cafés especiais, doces artesanais e um cantinho para ficar." },
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
        { label: "Cardápio", href: "#cardapio" }, { label: "Nossa história", href: "#sobre" },
        { label: "Depoimentos", href: "#depoimentos" }, { label: "Onde estamos", href: "#contato" },
      ],
      ctaLabel: "Pedir agora", ctaHref: "#contato",
    }, { variant: "pill" }),
    sec("hero", {
      eyebrow: "Torra própria, feito com carinho",
      title: "O café que faz o seu dia começar melhor.",
      highlight: "melhor.",
      subtitle: "Grãos especiais torrados na casa, doces artesanais saindo do forno e aquele cantinho perfeito para ficar.",
      ctaLabel: "Ver cardápio", ctaHref: "#cardapio",
      cta2Label: "Como chegar", cta2Href: "#contato",
      image: img("1509042239860-f550ce710b93", 1400),
      proofValue: "4,9 ★", proofLabel: "+2.300 avaliações no Google",
      avatars: PEOPLE.slice(2, 5).map((image) => ({ image })),
      badges: [
        { icon: "Coffee", title: "100% arábica", text: "grãos especiais" },
        { icon: "Truck", title: "Delivery", text: "em até 30 min" },
      ],
    }, { variant: "split", padding: "lg" }),
    sec("marquee", {
      items: [{ text: "Espresso" }, { text: "Cappuccino" }, { text: "Cold brew" }, { text: "Croissant" }, { text: "Pão de queijo" }, { text: "Bolo do dia" }],
    }, { tone: "primary" }),
    sec("features", {
      eyebrow: "Por que a gente",
      title: "Pequenos detalhes, grande diferença",
      items: [
        { icon: "Leaf", title: "Grãos especiais", text: "Direto de pequenos produtores do sul de Minas." },
        { icon: "Flame", title: "Torra própria", text: "Torramos toda semana para garantir frescor." },
        { icon: "Croissant", title: "Feito na casa", text: "Pães e doces artesanais, saindo do forno." },
        { icon: "Wifi", title: "Wi-fi e tomadas", text: "Um cantinho perfeito para trabalhar ou ler." },
      ],
    }, { align: "center" }),
    sec("products", {
      eyebrow: "Cardápio",
      title: "Os queridinhos da casa",
      subtitle: "Uma seleção dos mais pedidos. Peça no balcão ou pelo delivery.",
      items: [
        { image: img("1497636577773-f1231844b336", 800), tag: "Mais pedido", title: "Cappuccino", text: "Espresso, leite vaporizado e espuma cremosa.", price: "R$ 14" },
        { image: img("1760662018512-e881f06d0fe0", 800), tag: "Gelado", title: "Iced caramel", text: "Cold brew, leite e calda de caramelo salgado.", price: "R$ 18" },
        { image: img("1559001724-fbad036dbc9e", 800), tag: "", title: "Latte", text: "Suave e cremoso, com latte art.", price: "R$ 15" },
        { image: img("1542372147193-a7aca54189cd", 800), tag: "Combo", title: "Croissant + café", text: "Croissant de manteiga e café coado.", price: "R$ 22" },
      ],
      ctaLabel: "Ver cardápio completo", ctaHref: "#contato",
    }, { align: "center", tone: "surface" }),
    sec("about", {
      eyebrow: "Nossa história",
      title: "Uma paixão que virou ponto de encontro.",
      text: "Começamos em 2016 com uma máquina de espresso e um sonho: servir o melhor café do bairro. Hoje somos o cantinho favorito de quem ama café de verdade.",
      bullets: [{ text: "Baristas premiados" }, { text: "Ambiente pet friendly" }, { text: "Opções veganas" }, { text: "Leites vegetais" }],
      image: img("1541167760496-1628856ab772", 1200), image2: img("1600093463592-8e36ae95ef56", 800),
      badgeValue: "2016", badgeLabel: "desde",
      ctaLabel: "Venha nos visitar", ctaHref: "#contato",
    }, { variant: "image-left" }),
    sec("cta", {
      eyebrow: "Oferta especial",
      title: "Ganhe 10% de desconto na primeira visita.",
      subtitle: "Mostre esta página no balcão e aproveite. Válido de segunda a sexta.",
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
        { quote: "O melhor cappuccino da cidade, sem exagero. E o croissant é de outro mundo.", name: "Beatriz M.", role: "Cliente fiel", image: PEOPLE[3] },
        { quote: "Meu escritório oficial às sextas. Wi-fi ótimo, café perfeito e equipe super simpática.", name: "Lucas F.", role: "Designer", image: PEOPLE[4] },
        { quote: "Ambiente aconchegante e doces maravilhosos. Virou programa de família.", name: "Paula R.", role: "Cliente", image: PEOPLE[5] },
      ],
    }, { tone: "surface" }),
    sec("contact", {
      eyebrow: "Onde estamos", title: "Passa aqui pra um café",
      address: "Rua das Flores, 245 - Vila Madalena, São Paulo - SP", phone: "(11) 98888-0000", whatsapp: "5511988880000",
      email: "ola@graoeco.com.br", instagram: "@graoeco", hours: "Seg a Sex: 7h às 20h\nSáb e Dom: 8h às 18h",
      mapQuery: "Vila Madalena, São Paulo",
    }),
    sec("footer", {
      text: "Cafés especiais, doces artesanais e um cantinho pra ficar.",
      links: [{ label: "Cardápio", href: "#cardapio" }, { label: "História", href: "#sobre" }, { label: "Contato", href: "#contato" }],
      copyright: "© 2026 Grão & Co. Todos os direitos reservados.",
    }),
  ],
});

/* ============================================================
   3) CLÍNICA / ESPECIALISTA — odonto, estética, médicos, fisio
   ============================================================ */
const clinica = (): Tpl => ({
  templateId: "clinica",
  brand: { name: "Vitta Clínica", logo: "" },
  seo: { title: "Vitta Clínica — Odontologia e Estética", description: "Atendimento humanizado com tecnologia de ponta." },
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
      title: "Seu sorriso em boas mãos, com cuidado de verdade.",
      highlight: "cuidado de verdade.",
      subtitle: "Odontologia completa com tecnologia de ponta e um atendimento humanizado, do primeiro contato ao pós-tratamento.",
      ctaLabel: "Agendar avaliação", ctaHref: "#contato",
      cta2Label: "Ver tratamentos", cta2Href: "#diferenciais",
      image: img("1777331903190-341a3dd0441b", 1400),
      proofValue: "+5.000", proofLabel: "pacientes atendidos",
      avatars: PEOPLE.slice(0, 3).map((image) => ({ image })),
      badges: [
        { icon: "ShieldCheck", title: "CRO ativo", text: "profissionais registrados" },
        { icon: "Star", title: "5,0 no Google", text: "+800 avaliações" },
        { icon: "Calendar", title: "Seg a Sáb", text: "horários flexíveis" },
      ],
    }, { variant: "card", padding: "lg" }),
    sec("stats", {
      items: [
        { value: "12", suffix: "+", label: "anos de experiência" },
        { value: "5000", suffix: "+", label: "pacientes atendidos" },
        { value: "98", suffix: "%", label: "recomendam a clínica" },
        { value: "8", suffix: "", label: "especialidades" },
      ],
    }, { tone: "primary", padding: "sm" }),
    sec("features", {
      eyebrow: "Tratamentos",
      title: "Cuidado completo em um só lugar",
      subtitle: "Do check-up preventivo aos tratamentos estéticos mais modernos.",
      items: [
        { icon: "Smile", title: "Clareamento", text: "Dentes mais brancos com segurança e sem sensibilidade." },
        { icon: "ShieldCheck", title: "Implantes", text: "Recupere a função e a estética com implantes de titânio." },
        { icon: "Sparkles", title: "Lentes de contato", text: "Sorriso harmônico com facetas ultrafinas." },
        { icon: "HeartPulse", title: "Prevenção", text: "Limpeza, avaliação e acompanhamento periódico." },
        { icon: "Baby", title: "Odontopediatria", text: "Atendimento lúdico e acolhedor para crianças." },
        { icon: "Microscope", title: "Tecnologia", text: "Escaneamento digital e radiografia de baixa dose." },
      ],
    }),
    sec("about", {
      eyebrow: "Especialista",
      title: "Dra. Helena Duarte",
      subtitle: "Cirurgiã-dentista · CRO-SP 00000",
      text: "Especialista em reabilitação oral e estética, com mais de 12 anos de experiência. Acredito que cada sorriso é único e merece um plano de tratamento pensado para você.",
      bullets: [{ text: "Especialização em Implantodontia" }, { text: "Mestre em Estética" }, { text: "Membro da SBOE" }, { text: "Atendimento humanizado" }],
      image: img("1594824476967-48c8b964273f", 1200), image2: img("1629909613654-28e377c37b09", 800),
      badgeValue: "12+", badgeLabel: "anos",
      ctaLabel: "Agendar com a Dra.", ctaHref: "#contato",
    }, { tone: "surface", variant: "image-left" }),
    sec("steps", {
      eyebrow: "Como funciona",
      title: "Seu tratamento em 3 passos simples",
      image: img("1606811971618-4486d14f3f99", 1200),
      items: [
        { title: "Agende sua avaliação", text: "Pelo WhatsApp, em menos de 2 minutos." },
        { title: "Receba seu plano", text: "Diagnóstico completo e orçamento transparente." },
        { title: "Comece o tratamento", text: "Com acompanhamento em todas as etapas." },
      ],
      ctaLabel: "Agendar avaliação", ctaHref: "#contato",
    }),
    sec("testimonials", {
      eyebrow: "Depoimentos",
      title: "Histórias de quem voltou a sorrir",
      items: [
        { quote: "Tinha muito medo de dentista e fui tratada com uma paciência enorme. Hoje sorrio sem vergonha!", name: "Fernanda L.", role: "Lentes de contato", image: PEOPLE[0] },
        { quote: "Implante feito com todo o cuidado, sem dor nenhuma. Equipe nota 10.", name: "Roberto A.", role: "Implante", image: PEOPLE[6] },
        { quote: "Levo meus filhos desde pequenos. Eles amam ir à clínica, acredita?", name: "Camila S.", role: "Odontopediatria", image: PEOPLE[3] },
      ],
    }, { tone: "surface" }),
    sec("faq", {
      eyebrow: "Dúvidas",
      title: "Perguntas frequentes",
      items: [
        { q: "Vocês aceitam convênio?", a: "Atendemos particular e emitimos nota para reembolso. Consulte os convênios parceiros pelo WhatsApp." },
        { q: "A primeira avaliação é paga?", a: "A avaliação inicial inclui exame clínico completo e plano de tratamento personalizado." },
        { q: "Posso parcelar o tratamento?", a: "Sim, em até 12x no cartão ou condições especiais no boleto." },
        { q: "O tratamento dói?", a: "Utilizamos anestesia moderna e técnicas minimamente invasivas para o seu conforto." },
      ],
    }),
    sec("cta", {
      eyebrow: "Agenda aberta",
      title: "Dê o primeiro passo para o sorriso que você merece.",
      subtitle: "Agende sua avaliação agora e receba um plano de tratamento completo.",
      ctaLabel: "Agendar pelo WhatsApp", ctaHref: "#contato",
      image: img("1629909613654-28e377c37b09", 2000),
    }, { align: "center", tone: "base" }),
    sec("contact", {
      eyebrow: "Contato", title: "Estamos esperando por você",
      address: "Rua da Saúde, 500 - sala 12 - Moema, São Paulo - SP", phone: "(11) 3333-0000", whatsapp: "5511977770000",
      email: "contato@vittaclinica.com.br", instagram: "@vittaclinica", hours: "Seg a Sex: 8h às 19h\nSáb: 8h às 13h",
      mapQuery: "Moema, São Paulo",
    }, { tone: "surface" }),
    sec("footer", {
      text: "Odontologia e estética com atendimento humanizado. Responsável técnico: Dra. Helena Duarte · CRO-SP 00000.",
      links: [{ label: "Tratamentos", href: "#diferenciais" }, { label: "Especialista", href: "#sobre" }, { label: "Contato", href: "#contato" }],
      copyright: "© 2026 Vitta Clínica. Todos os direitos reservados.",
    }),
  ],
});

/* ============================================================
   4) BELEZA — lash designer, sobrancelhas, manicure, estética, salão
   ============================================================ */
const beleza = (): Tpl => ({
  templateId: "beleza",
  brand: { name: "Maison Belle", logo: "" },
  seo: { title: "Maison Belle — Beauty Studio", description: "Cílios, sobrancelhas, unhas e estética com atendimento exclusivo." },
  theme: {
    colors: {
      bg: "#FBF7F2", surface: "#F4ECE3", ink: "#241812", muted: "#7A5C4A",
      primary: "#4A3427", onPrimary: "#FBF7F2", accent: "#96694A", onAccent: "#FFFFFF",
      dark: "#241812", onDark: "#FBF7F2",
    },
    fontHeading: "Cormorant Garamond", fontBody: "Jost", fontScript: "Allura", highlightItalic: true,
    radius: 18, headingWeight: 500, headingUppercase: false, headingTracking: -0.01,
  },
  sections: [
    sec("navbar", {
      links: [
        { label: "Serviços", href: "#servicos" }, { label: "Sobre", href: "#sobre" },
        { label: "Resultados", href: "#galeria" }, { label: "Contato", href: "#contato" },
      ],
      ctaLabel: "Agendar horário", ctaHref: "#como-funciona",
    }, { variant: "solid" }),
    sec("hero", {
      eyebrow: "Estética avançada · Resultados naturais",
      title: "Realce a sua beleza natural.",
      highlight: "beleza natural.",
      subtitle: "Cílios, sobrancelhas, unhas e estética com técnicas personalizadas para valorizar o que você tem de mais bonito.",
      ctaLabel: "Agendar horário", ctaHref: "#como-funciona",
      cta2Label: "Conhecer serviços", cta2Href: "#servicos",
      image: img("1581182800629-7d90925ad072", 1600),
      seal: "cuidado exclusivo • beleza natural • ",
      proofValue: "4,9 ★", proofLabel: "+800 clientes atendidas",
      avatars: PEOPLE.slice(0, 4).map((image) => ({ image })),
      badges: [],
    }, { variant: "editorial", padding: "lg" }),
    sec("marquee", {
      items: [{ text: "Lash Design" }, { text: "Sobrancelhas" }, { text: "Manicure" }, { text: "Limpeza de Pele" }, { text: "Maquiagem" }, { text: "Cabelo" }],
    }, { variant: "elegant", tone: "base", anim: "fade" }),
    sec("services", {
      eyebrow: "nossos serviços",
      title: "Feito sob medida para você",
      highlight: "para você",
      subtitle: "Cada procedimento é pensado para o seu estilo, o seu rosto e o seu momento.",
      items: [
        { image: img("1589710751893-f9a6770ad71b", 900), icon: "Eye", tag: "", title: "Lash Design", text: "Extensão de cílios fio a fio, volume brasileiro, egípcio e mais." },
        { image: img("1632345031435-8727f6897d53", 900), icon: "Gem", tag: "", title: "Unhas", text: "Manicure, pedicure, alongamento em gel e nail art." },
        { image: img("1570172619644-dfd03ed5d881", 900), icon: "Flower2", tag: "", title: "Estética Facial", text: "Limpeza de pele, hidratação profunda e revitalização." },
        { image: img("1634449571010-02389ed0f9b0", 900), icon: "Scissors", tag: "", title: "Cabelo", text: "Corte, escova, coloração e tratamentos capilares." },
      ],
      ctaLabel: "Saiba mais", ctaHref: "#como-funciona",
    }, { variant: "stacked", align: "center" }),
    sec("about", {
      eyebrow: "sobre mim",
      title: "Beleza nos detalhes. Cuidado em cada atendimento.",
      highlight: "Cuidado em cada atendimento.",
      subtitle: "",
      text: "Prazer, eu sou a Ana Clara. Há mais de 8 anos transformo a autoestima das minhas clientes com técnicas atualizadas e um atendimento acolhedor.\n\nAqui cada detalhe é pensado para você se sentir única, do primeiro contato ao resultado final.",
      bullets: [{ text: "Certificações nacionais" }, { text: "Produtos premium" }, { text: "Ambiente acolhedor" }, { text: "Biossegurança total" }],
      image: img("1639531167411-2fbab09f57f6", 1000), image2: img("1674049406467-824ea37c7184", 600),
      watermark: "beauty studio", signature: "Ana Clara",
      badgeValue: "", badgeLabel: "",
      ctaLabel: "Agendar comigo", ctaHref: "#como-funciona",
    }, { variant: "arch" }),
    sec("features", {
      eyebrow: "por que escolher",
      title: "Cada detalhe pensado para você",
      highlight: "pensado para você",
      subtitle: "",
      items: [
        { icon: "Sparkles", title: "Personalização", text: "Cada procedimento pensado para o seu rosto e estilo." },
        { icon: "Feather", title: "Atenção aos detalhes", text: "Cuidado minucioso do início ao fim." },
        { icon: "Armchair", title: "Ambiente confortável", text: "Um espaço acolhedor para você relaxar." },
        { icon: "BadgeCheck", title: "Técnicas profissionais", text: "Aperfeiçoamento constante e segurança." },
        { icon: "Heart", title: "Experiência única", text: "Atendimento exclusivo, só com hora marcada." },
      ],
    }, { variant: "linhas", tone: "dark", align: "center" }),
    sec("gallery", {
      eyebrow: "galeria de resultados",
      title: "Resultados que falam por si",
      highlight: "falam por si",
      items: [
        img("1639629509821-c54cdd984227", 800), img("1610992015762-45dca7fa3a85", 800), img("1761718209835-c8586b7dcac0", 800),
        img("1773688189414-7637b9b138e1", 800), img("1519415387722-a1c3bbef716c", 800), img("1630843599725-32ead7671867", 800),
        img("1580618672591-eb180b1a973f", 800), img("1519014816548-bf5fe059798b", 800),
      ].map((image) => ({ image })),
    }, { align: "left" }),
    sec("testimonials", {
      eyebrow: "depoimentos",
      title: "O que dizem as clientes",
      highlight: "as clientes",
      items: [
        { quote: "Meus cílios ficaram perfeitos e super naturais. Atendimento impecável, me senti muito cuidada.", name: "Juliana M.", role: "Lash Design", image: PEOPLE[0] },
        { quote: "Melhor manicure que já fiz, durou semanas! O ambiente é lindo e muito confortável.", name: "Camila R.", role: "Unhas em gel", image: PEOPLE[2] },
        { quote: "A limpeza de pele mudou minha autoestima. Profissional atenciosa e super caprichosa.", name: "Fernanda S.", role: "Estética facial", image: PEOPLE[3] },
      ],
    }, { tone: "surface" }),
    sec("steps", {
      eyebrow: "agende já",
      title: "Seu momento de cuidado começa aqui.",
      highlight: "começa aqui.",
      subtitle: "Reserve seu horário e descubra uma experiência pensada especialmente para você.",
      image: "",
      seal: "agende já • faça seu agendamento • ",
      items: [
        { title: "Escolha o serviço", text: "Cílios, sobrancelhas, unhas, estética ou cabelo." },
        { title: "Diga o melhor dia e horário", text: "Atendimento somente com hora marcada." },
        { title: "Confirme pelo WhatsApp", text: "Você recebe a confirmação na hora." },
      ],
      ctaLabel: "Agendar", ctaHref: "#contato",
    }, { variant: "booking", tone: "surface" }),
    sec("faq", {
      eyebrow: "dúvidas",
      title: "Perguntas frequentes",
      items: [
        { q: "Quanto tempo dura a extensão de cílios?", a: "Com os cuidados certos, de 3 a 4 semanas. Indicamos manutenção a cada 15 a 20 dias." },
        { q: "Preciso ir sem maquiagem?", a: "Sim, para procedimentos nos olhos e no rosto venha com a pele limpa." },
        { q: "Quais as formas de pagamento?", a: "Pix, cartão de crédito em até 3x e débito." },
        { q: "Posso remarcar meu horário?", a: "Pode, avisando com pelo menos 24 horas de antecedência." },
      ],
    }),
    sec("cta", {
      eyebrow: "beleza · confiança · você",
      title: "A confiança começa com você.",
      subtitle: "Agende seu horário e viva uma experiência de cuidado de verdade.",
      ctaLabel: "Agendar meu horário", ctaHref: "#contato",
      image: img("1746723378067-83a345ff3160", 2000),
    }, { tone: "base", align: "left" }),
    sec("features", {
      eyebrow: "", title: "", subtitle: "",
      items: [
        { icon: "BadgeCheck", title: "Profissionais certificadas", text: "" },
        { icon: "Gem", title: "Produtos premium", text: "" },
        { icon: "Star", title: "Atendimento personalizado", text: "" },
        { icon: "Heart", title: "Resultados naturais", text: "" },
      ],
    }, { variant: "bar", tone: "surface", padding: "sm", anim: "fade" }),
    sec("contact", {
      eyebrow: "contato", title: "Venha se cuidar com a gente",
      address: "Rua das Flores, 120 - Jardins, São Paulo - SP", phone: "(11) 99999-1234", whatsapp: "5511999991234",
      email: "contato@maisonbelle.com.br", instagram: "@maisonbelle", hours: "Ter a Sex: 9h às 19h\nSáb: 9h às 15h",
      mapQuery: "Jardins, São Paulo",
    }),
    sec("footer", {
      text: "Beleza nos detalhes. Cuidado em cada atendimento.",
      links: [{ label: "Serviços", href: "#servicos" }, { label: "Sobre", href: "#sobre" }, { label: "Contato", href: "#contato" }],
      copyright: "© 2026 Maison Belle. Todos os direitos reservados.",
    }),
  ],
});

/* ============================================================
   5) LUXE NAILS — estúdio de unhas (escuro + rosé)
   ============================================================ */
const unhas = (): Tpl => ({
  templateId: "unhas",
  brand: { name: "Luxe Nail Studio", logo: "" },
  seo: { title: "Luxe Nail Studio — Unhas de luxo", description: "Manicure, alongamento em gel e nail art em um ambiente exclusivo." },
  theme: {
    colors: {
      bg: "#0F0B0B", surface: "#1B1414", ink: "#F7ECE8", muted: "#C2ABA5",
      primary: "#2B1E1E", onPrimary: "#F7ECE8", accent: "#D9A29B", onAccent: "#1A1010",
      dark: "#080606", onDark: "#F7ECE8",
    },
    fontHeading: "Bodoni Moda", fontBody: "Jost", fontScript: "Great Vibes", highlightScript: true,
    radius: 10, headingWeight: 500, headingUppercase: true, headingTracking: 0.01,
  },
  sections: [
    sec("navbar", {
      links: [
        { label: "Sobre", href: "#sobre" }, { label: "Serviços", href: "#servicos" },
        { label: "Valores", href: "#cardapio" }, { label: "Galeria", href: "#galeria" },
      ],
      ctaLabel: "Agendar horário", ctaHref: "#como-funciona",
    }, { variant: "transparent" }),
    sec("hero", {
      eyebrow: "Elegância na ponta dos dedos",
      title: "Unhas que empoderam.",
      highlight: "empoderam.",
      subtitle: "Manicure, alongamento e nail art com acabamento impecável, em um espaço pensado para você relaxar.",
      ctaLabel: "Agendar meu horário", ctaHref: "#como-funciona",
      cta2Label: "", cta2Href: "",
      image: img("1610992015762-45dca7fa3a85", 1800),
      seal: "experiência de luxo • luxe nail studio • ",
      proofValue: "", proofLabel: "", avatars: [],
      perks: [
        { icon: "Gem", title: "Produtos premium" },
        { icon: "ShieldCheck", title: "Higiene e segurança" },
        { icon: "Clock", title: "Profissionais experientes" },
      ],
      badges: [],
    }, { variant: "background", padding: "lg" }),
    sec("about", {
      eyebrow: "Bem-vinda ao Luxe",
      title: "Beleza. Cuidado. Confiança.",
      highlight: "Confiança.",
      subtitle: "",
      text: "No Luxe Nail Studio cada detalhe importa. Nossa missão é entregar unhas impecáveis em um ambiente relaxante e sofisticado, com materiais esterilizados e produtos de primeira linha.",
      bullets: [],
      image: img("1770980397103-c2522562e16f", 1800), image2: "",
      watermark: "", signature: "se cuide ♡",
      ctaLabel: "Conhecer o espaço", ctaHref: "#galeria",
    }, { variant: "fade", tone: "dark", padding: "lg" }),
    sec("services", {
      eyebrow: "Nossos serviços",
      title: "Serviços exclusivos",
      highlight: "exclusivos",
      subtitle: "",
      items: [
        { image: img("1612887390768-fb02affea7a6", 800), icon: "", tag: "Clássica", title: "Manicure", text: "" },
        { image: img("1772322586785-3a34772cbc61", 800), icon: "", tag: "Em gel", title: "Alongamento", text: "" },
        { image: img("1769687209448-025548dfca8b", 800), icon: "", tag: "Nail", title: "Art", text: "" },
        { image: img("1604654894610-df63bc536371", 800), icon: "", tag: "Premium", title: "Decoradas", text: "" },
      ],
      ctaLabel: "Ver todos", ctaHref: "#cardapio",
    }, { variant: "side", tone: "surface" }),
    sec("marquee", {
      items: [{ text: "Manicure" }, { text: "Alongamento em gel" }, { text: "Nail art" }, { text: "Pedicure" }, { text: "Spa dos pés" }],
    }, { variant: "elegant", tone: "base", anim: "fade" }),
    sec("products", {
      eyebrow: "Valores",
      title: "Escolha o seu cuidado",
      highlight: "cuidado",
      subtitle: "Preços de referência. Consulte promoções e pacotes pelo WhatsApp.",
      items: [
        { image: img("1643648854897-7b5845b4c04c", 700), tag: "", title: "Manicure", text: "Cutilagem, esmaltação e hidratação.", price: "R$ 45" },
        { image: img("1772322586754-34c9e6f5be6f", 700), tag: "Mais pedido", title: "Alongamento em gel", text: "Formato e tamanho sob medida.", price: "R$ 180" },
        { image: img("1777287216954-2b4b22bb6bf2", 700), tag: "", title: "Nail art", text: "Desenhos, pedrarias e efeitos.", price: "+ R$ 25" },
        { image: img("1633955726992-2b7c0d2d2a69", 700), tag: "", title: "Blindagem", text: "Proteção e brilho que duram semanas.", price: "R$ 90" },
      ],
      ctaLabel: "Agendar agora", ctaHref: "#como-funciona",
    }, { align: "center" }),
    sec("features", {
      eyebrow: "Por que o Luxe",
      title: "Cada detalhe pensado para você",
      highlight: "para você",
      subtitle: "",
      items: [
        { icon: "ShieldCheck", title: "Materiais esterilizados", text: "Autoclave e kits individuais." },
        { icon: "Gem", title: "Produtos premium", text: "Marcas importadas e de longa duração." },
        { icon: "Armchair", title: "Ambiente relaxante", text: "Poltronas confortáveis e café." },
        { icon: "BadgeCheck", title: "Equipe certificada", text: "Técnicas sempre atualizadas." },
      ],
    }, { variant: "linhas", tone: "dark", align: "center" }),
    sec("gallery", {
      eyebrow: "Galeria",
      title: "Trabalhos recentes",
      highlight: "recentes",
      items: [
        img("1610992015732-2449b76344bc", 800), img("1772322586634-9867476143b9", 800), img("1604654894611-6973b376cbde", 800),
        img("1698308233758-d55c98fd7444", 800), img("1650043155925-decbf940020b", 800), img("1612887390768-fb02affea7a6", 800),
        img("1522337660859-02fbefca4702", 800), img("1735264143075-9694eb02ad86", 800),
      ].map((image) => ({ image })),
    }, { align: "center" }),
    sec("testimonials", {
      eyebrow: "Depoimentos",
      title: "Quem faz, volta",
      highlight: "volta",
      items: [
        { quote: "Minhas unhas nunca duraram tanto! Atendimento impecável e o espaço é lindo demais.", name: "Larissa P.", role: "Alongamento em gel", image: PEOPLE[0] },
        { quote: "Capricho em cada detalhe. A nail art ficou exatamente como eu imaginei.", name: "Bianca M.", role: "Nail art", image: PEOPLE[3] },
        { quote: "Ambiente super limpo e aconchegante. Virou meu momento favorito da semana.", name: "Renata L.", role: "Manicure", image: PEOPLE[5] },
      ],
    }, { tone: "surface" }),
    sec("steps", {
      eyebrow: "Agende já",
      title: "Seu momento de luxo começa aqui.",
      highlight: "começa aqui.",
      subtitle: "Atendimento somente com hora marcada, para você não esperar.",
      image: "", seal: "agende já • luxe nail studio • ",
      items: [
        { title: "Escolha o serviço", text: "Manicure, alongamento, nail art ou pedicure." },
        { title: "Escolha o dia e o horário", text: "Pelo WhatsApp, em menos de 1 minuto." },
        { title: "Chegue e relaxe", text: "A gente cuida de todo o resto." },
      ],
      ctaLabel: "Agendar", ctaHref: "#contato",
    }, { variant: "booking", tone: "base" }),
    sec("cta", {
      eyebrow: "Pronta para brilhar?",
      title: "Agende seu horário hoje",
      subtitle: "Entre no luxo. Saia se sentindo linda.",
      ctaLabel: "Agendar agora", ctaHref: "#contato",
      image: img("1619352519321-170fb0e7f973", 2000),
    }, { tone: "base", align: "left" }),
    sec("contact", {
      eyebrow: "Contato", title: "Venha nos visitar",
      address: "Rua Oscar Freire, 900 - Jardins, São Paulo - SP", phone: "(11) 98888-4321", whatsapp: "5511988884321",
      email: "contato@luxenail.com.br", instagram: "@luxenailstudio", hours: "Ter a Sáb: 9h às 20h",
      mapQuery: "Rua Oscar Freire, São Paulo",
    }, { tone: "surface" }),
    sec("footer", {
      text: "Unhas de luxo em um espaço feito para você.",
      links: [{ label: "Serviços", href: "#servicos" }, { label: "Valores", href: "#cardapio" }, { label: "Contato", href: "#contato" }],
      copyright: "© 2026 Luxe Nail Studio. Todos os direitos reservados.",
    }, { tone: "dark" }),
  ],
});

/* ============================================================
   6) ROSÉ SPA — spa, estética facial e corporal (rosa claro)
   ============================================================ */
const spa = (): Tpl => ({
  templateId: "spa",
  brand: { name: "Rosé Spa", logo: "" },
  seo: { title: "Rosé Spa — Estética e bem-estar", description: "Tratamentos faciais, massagens e cuidados para a sua pele e o seu bem-estar." },
  theme: {
    colors: {
      bg: "#FCF6F3", surface: "#F6E7E2", ink: "#3A2420", muted: "#806059",
      primary: "#6E3F3A", onPrimary: "#FFFFFF", accent: "#A85D54", onAccent: "#FFFFFF",
      dark: "#3A2420", onDark: "#FCF6F3",
    },
    fontHeading: "Playfair Display", fontBody: "DM Sans", fontScript: "Parisienne",
    radius: 16, headingWeight: 500, headingUppercase: false, headingTracking: -0.02,
  },
  sections: [
    sec("navbar", {
      links: [
        { label: "Tratamentos", href: "#servicos" }, { label: "Resultados", href: "#resultados" },
        { label: "Depoimentos", href: "#depoimentos" }, { label: "Contato", href: "#contato" },
      ],
      ctaLabel: "Agendar", ctaHref: "#contato",
    }, { variant: "solid" }),
    sec("hero", {
      eyebrow: "Beleza natural · Equilíbrio",
      title: "Relaxe, renove e brilhe.",
      highlight: "",
      subtitle: "Tratamentos de spa pensados para renovar a sua pele, devolver o seu brilho e realçar a sua beleza natural.",
      ctaLabel: "Agendar meu dia de spa", ctaHref: "#contato",
      cta2Label: "", cta2Href: "",
      image: img("1728727217834-b190862837a3", 1600),
      seal: "", scriptNote: "Se cuidar fica lindo em você",
      proofValue: "", proofLabel: "", avatars: [],
      perks: [
        { icon: "Leaf", title: "Produtos orgânicos" },
        { icon: "Flower2", title: "Terapeutas experientes" },
        { icon: "Sparkles", title: "Cuidado personalizado" },
      ],
      badges: [],
    }, { variant: "editorial", padding: "lg" }),
    sec("services", {
      eyebrow: "Nossos tratamentos",
      title: "Beleza e bem-estar",
      highlight: "",
      subtitle: "De limpezas de pele revigorantes a massagens relaxantes: tratamentos para o seu bem-estar completo.",
      items: [
        { image: img("1570172619644-dfd03ed5d881", 800), icon: "", tag: "", title: "Tratamento facial", text: "Limpeza · Hidratação · Brilho" },
        { image: img("1741522509438-a120c0bb5e88", 800), icon: "", tag: "", title: "Massagem relaxante", text: "Relaxa · Restaura · Renova" },
        { image: img("1761718209835-c8586b7dcac0", 800), icon: "", tag: "", title: "Rejuvenescimento", text: "Firmeza · Viço · Renovação" },
        { image: img("1600334089648-b0d9d3028eb2", 800), icon: "", tag: "", title: "Pacotes de spa", text: "Spa · Beleza · Autocuidado" },
      ],
      ctaLabel: "Saiba mais", ctaHref: "#contato",
    }, { variant: "stacked" }),
    sec("beforeafter", {
      eyebrow: "Resultados reais",
      title: "Um brilho que você sente",
      highlight: "",
      subtitle: "Pele mais saudável, uniforme e luminosa com protocolos profissionais pensados para resultados duradouros.",
      before: img("1713207524097-596f3c17afc3", 1200), after: img("1675773051474-55c4b7d2cf53", 1200),
      beforeLabel: "Antes", afterLabel: "Depois",
      items: [
        { icon: "Sparkles", title: "Pele mais limpa" },
        { icon: "Sun", title: "Tom mais uniforme" },
        { icon: "Feather", title: "Textura mais suave" },
        { icon: "Gem", title: "Brilho saudável" },
      ],
      ctaLabel: "Ver mais transformações", ctaHref: "#contato",
    }, { tone: "surface" }),
    sec("marquee", {
      items: [{ text: "Limpeza de pele" }, { text: "Massagem" }, { text: "Drenagem" }, { text: "Peeling" }, { text: "Day spa" }],
    }, { variant: "elegant", tone: "base", anim: "fade" }),
    sec("testimonials", {
      eyebrow: "Depoimentos",
      title: "Histórias reais, brilho real",
      highlight: "",
      items: [
        { quote: "O tratamento facial foi incrível! Minha pele ficou leve e luminosa. Melhor experiência de spa.", name: "Mariana C.", role: "Cliente verificada", image: PEOPLE[0] },
        { quote: "Profissionais e super relaxante. Saí renovada, já marquei a próxima sessão!", name: "Sofia L.", role: "Cliente verificada", image: PEOPLE[2] },
        { quote: "Espaço lindo, equipe maravilhosa e resultado visível. Recomendo demais!", name: "Olívia B.", role: "Cliente verificada", image: PEOPLE[3] },
      ],
    }),
    sec("steps", {
      eyebrow: "Como funciona",
      title: "Seu dia de spa em 3 passos",
      highlight: "",
      subtitle: "",
      image: img("1706795033849-7ca391f007c5", 1200), seal: "",
      items: [
        { title: "Agende pelo WhatsApp", text: "Escolha o tratamento e o melhor horário." },
        { title: "Avaliação personalizada", text: "Entendemos sua pele e seus objetivos." },
        { title: "Relaxe e aproveite", text: "Saia renovada, com orientações para casa." },
      ],
      ctaLabel: "Agendar agora", ctaHref: "#contato",
    }, { variant: "image", tone: "surface" }),
    sec("faq", {
      eyebrow: "Dúvidas",
      title: "Perguntas frequentes",
      items: [
        { q: "Preciso fazer avaliação antes?", a: "Para tratamentos faciais fazemos uma avaliação rápida no início da sessão, sem custo extra." },
        { q: "Quanto tempo dura cada tratamento?", a: "Entre 50 e 90 minutos, dependendo do protocolo." },
        { q: "Vocês vendem vale-presente?", a: "Sim! Temos vales e pacotes especiais, ótimos para presentear." },
        { q: "Quais as formas de pagamento?", a: "Pix, cartão de crédito em até 6x e débito." },
      ],
    }),
    sec("cta", {
      eyebrow: "Seu momento de brilhar",
      title: "Se cuidar é uma escolha linda",
      subtitle: "Agende hoje e descubra uma versão mais radiante e confiante de você.",
      ctaLabel: "Agendar meu horário", ctaHref: "#contato",
      image: img("1706795033849-7ca391f007c5", 2000),
    }, { tone: "base", align: "left" }),
    sec("features", {
      eyebrow: "", title: "", subtitle: "",
      items: [
        { icon: "Calendar", title: "Agendamento fácil", text: "" },
        { icon: "Leaf", title: "Produtos premium", text: "" },
        { icon: "Heart", title: "Profissionais de confiança", text: "" },
      ],
    }, { variant: "bar", tone: "surface", padding: "sm", anim: "fade" }),
    sec("contact", {
      eyebrow: "Contato", title: "Venha relaxar com a gente",
      address: "Av. das Flores, 300 - Moema, São Paulo - SP", phone: "(11) 97777-1212", whatsapp: "5511977771212",
      email: "ola@rosespa.com.br", instagram: "@rosespa", hours: "Seg a Sex: 9h às 20h\nSáb: 9h às 17h",
      mapQuery: "Moema, São Paulo",
    }),
    sec("footer", {
      text: "Estética e bem-estar com carinho em cada detalhe.",
      links: [{ label: "Tratamentos", href: "#servicos" }, { label: "Resultados", href: "#resultados" }, { label: "Contato", href: "#contato" }],
      copyright: "© 2026 Rosé Spa. Todos os direitos reservados.",
    }),
  ],
});

export const TEMPLATES: (TemplateMeta & { build: () => Tpl })[] = [
  {
    id: "esporte", name: "Arena", niche: "Esportes: padel, tênis, beach tennis, academias",
    description: "Hero com foto em tela cheia, faixa animada, estrutura, planos e professores.",
    cover: img("1646649853703-7645147474ba", 900), build: esporte,
  },
  {
    id: "cafe", name: "Grão", niche: "Cafeteria, padaria, doceria, restaurante",
    description: "Visual acolhedor com imagem redonda, cardápio com preços, galeria e oferta.",
    cover: img("1509042239860-f550ce710b93", 900), build: cafe,
  },
  {
    id: "clinica", name: "Vitta", niche: "Clínicas e especialistas: odonto, estética, saúde",
    description: "Transmite confiança: selos, especialista, tratamentos, passo a passo e FAQ.",
    cover: img("1777331903190-341a3dd0441b", 900), build: clinica,
  },
  {
    id: "beleza", name: "Maison Belle", niche: "Beleza: lash, sobrancelhas, unhas, estética, salão",
    description: "Elegante e sofisticado: hero editorial com selo girando, foto em arco, assinatura e agendamento.",
    cover: img("1589710751893-f9a6770ad71b", 900), build: beleza,
  },
  {
    id: "unhas", name: "Luxe Nails", niche: "Unhas: manicure, alongamento, nail art",
    description: "Luxo escuro com rosé: palavra em letra cursiva, selo girando, foto dissolvendo e tabela de valores.",
    cover: img("1610992015762-45dca7fa3a85", 900), build: unhas,
  },
  {
    id: "spa", name: "Rosé Spa", niche: "Spa, estética facial e corporal, massagem",
    description: "Rosa claro e delicado: frase cursiva na foto, tratamentos, antes e depois que você arrasta.",
    cover: img("1728727217834-b190862837a3", 900), build: spa,
  },
];

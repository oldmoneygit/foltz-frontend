/**
 * DADOS DAS LIGAS - FOLTZ FANWEAR
 * Gerado automaticamente de leagues_summary.json
 */

export const leagues = [
  {
    id: "premier-league",
    name: "Premier League",
    slug: "premier-league",
    country: "Inglaterra",
    flag: "🏴󐁧󐁢󐁥󐁮󐁧󐁿",
    description: "Liga inglesa - a mais competitiva do mundo",
    color: "#3D195B",
    productCount: 42,
    imageCount: 328,
    featured: true,
    image: "/images/leagues/premier-league.jpg"
  },
  {
    id: "la-liga",
    name: "La Liga",
    slug: "la-liga",
    country: "Espanha",
    flag: "🇪🇸",
    description: "Liga espanhola - Real Madrid, Barcelona e mais",
    color: "#FF4747",
    productCount: 57,
    imageCount: 457,
    featured: true,
    image: "/images/leagues/la-liga.jpg"
  },
  {
    id: "serie-a",
    name: "Serie A",
    slug: "serie-a",
    country: "Itália",
    flag: "🇮🇹",
    description: "Liga italiana - Juventus, Milan, Inter e mais",
    color: "#008FD7",
    productCount: 27,
    imageCount: 208,
    featured: true,
    image: "/images/leagues/serie-a.jpg"
  },
  {
    id: "bundesliga",
    name: "Bundesliga",
    slug: "bundesliga",
    country: "Alemanha",
    flag: "🇩🇪",
    description: "Liga alemã de futebol - os melhores times da Alemanha",
    color: "#D20515",
    productCount: 22,
    imageCount: 161,
    featured: true,
    image: "/images/leagues/bundesliga.jpg"
  },
  {
    id: "ligue-1",
    name: "Ligue 1",
    slug: "ligue-1",
    country: "França",
    flag: "🇫🇷",
    description: "Liga francesa - PSG, Lyon, Marseille e mais",
    color: "#0055A4",
    productCount: 12,
    imageCount: 95,
    featured: false,
    image: "/images/leagues/ligue-1.jpg"
  },
  {
    id: "saf",
    name: "Sul-Americana",
    slug: "sul-americana",
    country: "América do Sul",
    flag: "🌎",
    description: "Ligas sul-americanas - Brasil, Argentina e mais",
    color: "#009B3A",
    productCount: 33,
    imageCount: 244,
    featured: true,
    image: "/images/leagues/saf.jpg"
  },
  {
    id: "liga-portugal",
    name: "Liga Portugal",
    slug: "liga-portugal",
    country: "Portugal",
    flag: "🇵🇹",
    description: "Campeonato português - Benfica, Porto, Sporting",
    color: "#006F3C",
    productCount: 13,
    imageCount: 105,
    featured: false,
    image: "/images/leagues/liga-portugal.jpg"
  },
  {
    id: "brasileirao",
    name: "Brasileirão",
    slug: "brasileirao",
    country: "Brasil",
    flag: "🇧🇷",
    description: "Campeonato Brasileiro Série A - os melhores times do Brasil",
    color: "#009B3A",
    productCount: 28,
    imageCount: 215,
    featured: true,
    image: "/images/leagues/brasileirao.jpg"
  },
  {
    id: "eredivisie",
    name: "Eredivisie",
    slug: "eredivisie",
    country: "Holanda",
    flag: "🇳🇱",
    description: "Campeonato holandês de futebol profissional",
    color: "#FF6C00",
    productCount: 5,
    imageCount: 36,
    featured: false,
    image: "/images/leagues/eredivisie.jpg"
  },
  {
    id: "liga-mx",
    name: "Liga MX",
    slug: "liga-mx",
    country: "México",
    flag: "🇲🇽",
    description: "Campeonato mexicano de futebol",
    color: "#006847",
    productCount: 12,
    imageCount: 76,
    featured: false,
    image: "/images/leagues/liga-mx.jpg"
  },
  {
    id: "mls",
    name: "MLS",
    slug: "mls",
    country: "Estados Unidos",
    flag: "🇺🇸",
    description: "Major League Soccer - futebol americano",
    color: "#C4122E",
    productCount: 5,
    imageCount: 29,
    featured: false,
    image: "/images/leagues/mls.jpg"
  },
  {
    id: "national-teams",
    name: "National Teams",
    slug: "national-teams",
    country: "Internacional",
    flag: "🌍",
    description: "Seleções nacionais de todo o mundo",
    color: "#0066CC",
    productCount: 35,
    imageCount: 280,
    featured: true,
    image: "/images/leagues/national-teams.jpg"
  },
  {
    id: "long-sleeve",
    name: "Manga Longa",
    slug: "manga-longa",
    country: "Internacional",
    flag: "🌍",
    description: "Camisas de manga longa de todas as ligas",
    color: "#1A1A1A",
    productCount: 43,
    imageCount: 344,
    featured: true,
    image: "/images/leagues/long-sleeve.jpg"
  }
];

// Ligas em destaque (exibir na homepage)
export const featuredLeagues = leagues.filter(league => league.featured);

// Estatísticas gerais
export const leagueStats = {
  totalLeagues: leagues.length,
  totalProducts: leagues.reduce((sum, l) => sum + l.productCount, 0),
  totalImages: leagues.reduce((sum, l) => sum + l.imageCount, 0)
};

// Helper para buscar liga por slug
export const getLeagueBySlug = (slug) => {
  return leagues.find(league => league.slug === slug);
};

// Helper para buscar liga por ID
export const getLeagueById = (id) => {
  return leagues.find(league => league.id === id);
};

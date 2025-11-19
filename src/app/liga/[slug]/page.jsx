import { getAllProducts } from '@/utils/shopifyData'
import LeagueContent from './LeagueContent'

// Revalidar a cada 1 hora
export const revalidate = 3600

// Mapeamento de ligas com suas informações
const leaguesData = {
  'premier-league': {
    name: 'Premier League',
    logo: '/images/collections/premier league.jpg',
    description: 'La liga de fútbol más competitiva del mundo',
    // Tags exatas do Shopify para match preciso
    exactTags: ['Premier League', 'premier-league'],
    // Keywords para busca em títulos (mais específicas)
    titleKeywords: ['manchester united', 'manchester city', 'liverpool', 'chelsea', 'arsenal', 'tottenham', 'aston villa', 'newcastle', 'west ham', 'brighton', 'everton', 'crystal palace', 'fulham', 'brentford', 'nottingham forest'],
    country: 'Inglaterra',
    flagCode: 'gb-eng'
  },
  'la-liga': {
    name: 'La Liga',
    logo: '/images/collections/la liga.jpg',
    description: 'El campeonato español con los mejores equipos del mundo',
    exactTags: ['La Liga', 'la-liga', 'LaLiga'],
    titleKeywords: ['real madrid', 'barcelona', 'atletico madrid', 'sevilla', 'real betis', 'real sociedad', 'villarreal', 'athletic bilbao', 'valencia'],
    country: 'España',
    flagCode: 'es'
  },
  'serie-a': {
    name: 'Serie A',
    logo: '/images/collections/serie A.jpg',
    description: 'El calcio italiano con historia y pasión',
    exactTags: ['Serie A', 'serie-a', 'SerieA'],
    // Keywords específicas para evitar confusão (ex: "Inter" sem "Miami")
    titleKeywords: ['ac milan', 'inter milan', 'inter de milan', 'juventus', 'as roma', 'napoli', 'lazio', 'atalanta', 'fiorentina', 'torino'],
    country: 'Italia',
    flagCode: 'it'
  },
  'bundesliga': {
    name: 'Bundesliga',
    logo: '/images/collections/bundesliga.jpg',
    description: 'El fútbol alemán con la mejor organización',
    exactTags: ['Bundesliga', 'bundesliga'],
    titleKeywords: ['bayern munich', 'bayern munchen', 'borussia dortmund', 'bayer leverkusen', 'rb leipzig', 'eintracht frankfurt', 'borussia monchengladbach', 'wolfsburg', 'hoffenheim'],
    country: 'Alemania',
    flagCode: 'de'
  },
  'ligue-1': {
    name: 'Ligue 1',
    logo: '/images/collections/Ligue 1.jpg',
    description: 'El campeonato francés lleno de talento',
    exactTags: ['Ligue 1', 'ligue-1', 'Ligue1'],
    titleKeywords: ['psg', 'paris saint-germain', 'paris saint germain', 'olympique marseille', 'olympique lyon', 'monaco', 'lille', 'nice'],
    country: 'Francia',
    flagCode: 'fr'
  },
  'liga-mx': {
    name: 'Liga MX',
    logo: '/images/leagues/liga-mx.jpeg',
    description: 'La pasión del fútbol mexicano',
    exactTags: ['Liga MX', 'liga-mx', 'LigaMX'],
    titleKeywords: ['club america', 'chivas', 'guadalajara', 'cruz azul', 'tigres uanl', 'monterrey', 'pumas', 'santos laguna', 'toluca'],
    country: 'México',
    flagCode: 'mx'
  },
  'eredivisie': {
    name: 'Eredivisie',
    logo: '/images/leagues/eredivisie.jpeg',
    description: 'El fútbol holandés con su estilo único',
    exactTags: ['Eredivisie', 'eredivisie'],
    titleKeywords: ['ajax', 'psv eindhoven', 'feyenoord', 'az alkmaar'],
    country: 'Países Bajos',
    flagCode: 'nl'
  },
  'primeira-liga': {
    name: 'Liga Portugal',
    logo: '/images/leagues/primeira-liga.jpeg',
    description: 'El campeonato portugués con grandes clubes',
    exactTags: ['Primeira Liga', 'primeira-liga', 'Liga Portugal'],
    titleKeywords: ['benfica', 'porto', 'sporting cp', 'sporting lisbon', 'braga'],
    country: 'Portugal',
    flagCode: 'pt'
  },
  'mls': {
    name: 'MLS',
    logo: '/images/leagues/mls.jpeg',
    description: 'Major League Soccer - El fútbol en Norteamérica',
    exactTags: ['MLS', 'mls', 'Major League Soccer'],
    titleKeywords: ['inter miami', 'la galaxy', 'atlanta united', 'seattle sounders', 'lafc', 'new york red bulls'],
    country: 'Estados Unidos',
    flagCode: 'us'
  },
  'argentina-legends': {
    name: 'Argentina Legends',
    logo: '/images/collections/argentina legends.jpg',
    description: 'Las mejores camisetas del fútbol argentino',
    exactTags: ['Argentina', 'argentina', 'Liga Argentina', 'Superliga Argentina'],
    titleKeywords: ['boca juniors', 'river plate', 'racing club', 'independiente', 'san lorenzo', 'velez sarsfield', 'estudiantes', 'newell\'s old boys', 'rosario central'],
    country: 'Argentina',
    flagCode: 'ar'
  },
  'national-teams': {
    name: 'Selecciones Nacionales',
    logo: '/images/collections/national teams.jpg',
    description: 'Camisetas de las selecciones nacionales del mundo',
    exactTags: ['National Team', 'Seleccion', 'national-team', 'seleccion', 'Selecciones', 'National Teams'],
    // Keywords mais abrangentes - incluindo nomes de países sem "seleccion"
    titleKeywords: [
      'seleccion argentina', 'argentina nacional', 'argentina retro',
      'seleccion brasil', 'brasil nacional', 'brasil retro',
      'seleccion france', 'seleccion francia', 'france national', 'francia nacional',
      'seleccion alemania', 'seleccion germany', 'germany national', 'alemania nacional',
      'seleccion españa', 'seleccion spain', 'spain national', 'españa nacional',
      'seleccion portugal', 'portugal national', 'portugal nacional',
      'seleccion england', 'seleccion inglaterra', 'england national', 'inglaterra nacional',
      'seleccion italia', 'seleccion italy', 'italy national', 'italia nacional',
      'seleccion uruguay', 'uruguay national', 'uruguay nacional',
      'seleccion mexico', 'mexico national', 'mexico nacional',
      'seleccion colombia', 'colombia national', 'colombia nacional',
      'seleccion holanda', 'seleccion netherlands', 'netherlands national', 'holanda nacional',
      'world cup', 'copa mundial', 'copa america', 'euro'
    ],
    country: 'Mundial',
    flagCode: 'un'
  }
}

export default async function LeaguePage({ params }) {
  const { slug } = await params

  // Buscar dados da liga
  const leagueData = leaguesData[slug] || {
    name: slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    logo: null,
    description: 'Colección de camisetas',
    exactTags: [slug.replace(/-/g, ' ')],
    titleKeywords: [slug.replace(/-/g, ' ')],
    country: 'Unknown',
    flag: '⚽'
  }

  // Buscar todos os produtos
  const allProducts = await getAllProducts()

  // Filtrar produtos por liga (priorizar tags exatas, depois títulos específicos)
  const leagueProducts = allProducts.filter(product => {
    const title = (product.title || product.name || '').toLowerCase()
    const tags = product.tags || []

    // 1. PRIORIDADE MÁXIMA: Verificar tags exatas do Shopify (case-insensitive)
    const hasExactTag = leagueData.exactTags.some(exactTag =>
      tags.some(tag => tag.toLowerCase() === exactTag.toLowerCase())
    )

    if (hasExactTag) {
      return true
    }

    // 2. FILTRO ESPECIAL PARA SELEÇÕES NACIONAIS
    if (slug === 'national-teams') {
      // Lista de países (em português, espanhol e inglês)
      const countries = [
        'argentina', 'brasil', 'brazil', 'france', 'francia',
        'germany', 'alemania', 'spain', 'españa', 'portugal',
        'england', 'inglaterra', 'italy', 'italia', 'uruguay',
        'mexico', 'colombia', 'chile', 'peru', 'ecuador',
        'netherlands', 'holanda', 'belgium', 'belgica',
        'croatia', 'croacia', 'denmark', 'dinamarca',
        'sweden', 'suecia', 'norway', 'noruega',
        'japan', 'japon', 'korea', 'corea',
        'usa', 'states', 'eeuu', 'estados unidos'
      ]

      // Lista de clubes para EXCLUIR (evitar falsos positivos)
      const clubKeywords = [
        'boca', 'river', 'racing', 'independiente', 'san lorenzo',
        'newells', 'rosario central', 'velez', 'estudiantes',
        'barcelona', 'real madrid', 'atletico', 'sevilla',
        'manchester', 'liverpool', 'chelsea', 'arsenal', 'tottenham',
        'milan', 'inter', 'juventus', 'napoli', 'roma',
        'bayern', 'dortmund', 'leipzig',
        'psg', 'marseille', 'lyon', 'monaco',
        'ajax', 'psv', 'feyenoord',
        'benfica', 'porto', 'sporting'
      ]

      // Verifica se tem nome de país no título
      const hasCountry = countries.some(country => title.includes(country))

      // Verifica se NÃO é de um clube
      const isNotClub = !clubKeywords.some(club => title.includes(club))

      // Se tem país E não é clube, provavelmente é seleção nacional
      if (hasCountry && isNotClub) {
        return true
      }
    }

    // 3. SEGUNDA PRIORIDADE: Verificar keywords específicas no título
    // (usa nomes completos de times para evitar falsos positivos)
    const hasSpecificKeyword = leagueData.titleKeywords.some(keyword =>
      title.includes(keyword.toLowerCase())
    )

    return hasSpecificKeyword
  })

  console.log(`⚽ Liga ${leagueData.name}: Encontrado ${leagueProducts.length} produtos`)

  return <LeagueContent league={leagueData} products={leagueProducts} slug={slug} />
}

// Generate static params for common leagues
export async function generateStaticParams() {
  return Object.keys(leaguesData).map(slug => ({ slug }))
}

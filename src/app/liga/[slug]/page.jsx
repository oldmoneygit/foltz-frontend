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
    keywords: ['premier league', 'england', 'manchester', 'liverpool', 'chelsea', 'arsenal', 'tottenham'],
    country: 'Inglaterra',
    flagCode: 'gb-eng'
  },
  'la-liga': {
    name: 'La Liga',
    logo: '/images/collections/la liga.jpg',
    description: 'El campeonato español con los mejores equipos del mundo',
    keywords: ['la liga', 'spain', 'real madrid', 'barcelona', 'atletico', 'sevilla'],
    country: 'España',
    flagCode: 'es'
  },
  'serie-a': {
    name: 'Serie A',
    logo: '/images/collections/serie A.jpg',
    description: 'El calcio italiano con historia y pasión',
    keywords: ['serie a', 'italy', 'milan', 'inter', 'juventus', 'roma', 'napoli'],
    country: 'Italia',
    flagCode: 'it'
  },
  'bundesliga': {
    name: 'Bundesliga',
    logo: '/images/collections/bundesliga.jpg',
    description: 'El fútbol alemán con la mejor organización',
    keywords: ['bundesliga', 'germany', 'bayern', 'dortmund', 'borussia'],
    country: 'Alemania',
    flagCode: 'de'
  },
  'ligue-1': {
    name: 'Ligue 1',
    logo: '/images/collections/Ligue 1.jpg',
    description: 'El campeonato francés lleno de talento',
    keywords: ['ligue 1', 'france', 'psg', 'paris', 'marseille', 'lyon'],
    country: 'Francia',
    flagCode: 'fr'
  },
  'liga-mx': {
    name: 'Liga MX',
    logo: '/images/leagues/liga-mx.jpeg',
    description: 'La pasión del fútbol mexicano',
    keywords: ['liga mx', 'mexico', 'america', 'chivas', 'cruz azul', 'tigres'],
    country: 'México',
    flagCode: 'mx'
  },
  'eredivisie': {
    name: 'Eredivisie',
    logo: '/images/leagues/eredivisie.jpeg',
    description: 'El fútbol holandés con su estilo único',
    keywords: ['eredivisie', 'netherlands', 'ajax', 'psv', 'feyenoord'],
    country: 'Países Bajos',
    flagCode: 'nl'
  },
  'primeira-liga': {
    name: 'Liga Portugal',
    logo: '/images/leagues/primeira-liga.jpeg',
    description: 'El campeonato portugués con grandes clubes',
    keywords: ['primeira liga', 'portugal', 'benfica', 'porto', 'sporting'],
    country: 'Portugal',
    flagCode: 'pt'
  },
  'mls': {
    name: 'MLS',
    logo: '/images/leagues/mls.jpeg',
    description: 'Major League Soccer - El fútbol en Norteamérica',
    keywords: ['mls', 'inter miami', 'miami', 'galaxy', 'atlanta'],
    country: 'Estados Unidos',
    flagCode: 'us'
  },
  'argentina-legends': {
    name: 'Argentina Legends',
    logo: '/images/collections/argentina legends.jpg',
    description: 'Las mejores camisetas del fútbol argentino',
    keywords: ['argentina', 'boca', 'river', 'racing', 'independiente', 'san lorenzo'],
    country: 'Argentina',
    flagCode: 'ar'
  },
  'national-teams': {
    name: 'Selecciones Nacionales',
    logo: '/images/collections/national teams.jpg',
    description: 'Camisetas de las selecciones nacionales del mundo',
    keywords: ['national', 'seleccion', 'world cup', 'copa'],
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
    keywords: [slug.replace(/-/g, ' ')],
    country: 'Unknown',
    flag: '⚽'
  }

  // Buscar todos os produtos
  const allProducts = await getAllProducts()

  // Filtrar produtos por liga (buscar nas keywords)
  const leagueProducts = allProducts.filter(product => {
    const title = (product.title || product.name || '').toLowerCase()
    const tags = (product.tags || []).join(' ').toLowerCase()
    const productType = (product.productType || '').toLowerCase()
    const searchText = `${title} ${tags} ${productType}`

    // Verificar se o produto contém alguma das keywords
    return leagueData.keywords.some(keyword => searchText.includes(keyword.toLowerCase()))
  })

  console.log(`⚽ Liga ${leagueData.name}: Encontrado ${leagueProducts.length} produtos`)

  return <LeagueContent league={leagueData} products={leagueProducts} slug={slug} />
}

// Generate static params for common leagues
export async function generateStaticParams() {
  return Object.keys(leaguesData).map(slug => ({ slug }))
}

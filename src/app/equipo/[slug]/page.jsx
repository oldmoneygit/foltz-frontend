import { getAllProducts } from '@/utils/shopifyData'
import TeamPageContent from './TeamPageContent'

// Revalidar a cada 1 hora
export const revalidate = 3600

// Mapeamento de times com suas informações
const teamsData = {
  'boca-juniors': {
    name: 'Boca Juniors',
    logo: '/images/collections/boca-juniors-logo.png',
    description: 'El club más popular de Argentina',
    keywords: ['boca', 'boca juniors'],
    league: 'Argentina'
  },
  'river-plate': {
    name: 'River Plate',
    logo: '/images/collections/river-plate-logo.png',
    description: 'El millonario de Argentina',
    keywords: ['river', 'river plate'],
    league: 'Argentina'
  },
  'racing-club': {
    name: 'Racing Club',
    logo: '/images/collections/racing-club.png',
    description: 'La Academia',
    keywords: ['racing', 'racing club'],
    league: 'Argentina'
  },
  'independiente': {
    name: 'Independiente',
    logo: '/images/collections/Independiente.png',
    description: 'El Rey de Copas',
    keywords: ['independiente'],
    league: 'Argentina'
  },
  'san-lorenzo': {
    name: 'San Lorenzo',
    logo: '/images/collections/San-Lorenzo.png',
    description: 'El Ciclón de Boedo',
    keywords: ['san lorenzo'],
    league: 'Argentina'
  },
  'newells-old-boys': {
    name: "Newell's Old Boys",
    logo: "/images/collections/Newell's_Old_Boys.png",
    description: 'La Lepra de Rosario',
    keywords: ['newells', "newell's", 'old boys'],
    league: 'Argentina'
  },
  'rosario-central': {
    name: 'Rosario Central',
    logo: '/images/collections/Rosário-Central.png',
    description: 'El Canalla de Rosario',
    keywords: ['rosario central', 'central'],
    league: 'Argentina'
  },
  'seleccion-argentina': {
    name: 'Selección Argentina',
    logo: '/images/collections/argentina-logo.png',
    description: 'La Albiceleste - Campeones del Mundo',
    keywords: ['argentina'],
    league: 'National Teams',
    excludeKeywords: ['boca', 'river', 'racing', 'independiente', 'san lorenzo', 'newells', 'rosario central', 'velez', 'estudiantes', 'talleres', 'colon', 'union', 'banfield', 'lanus', 'defensa', 'tigre', 'argentinos juniors', 'huracan', 'gimnasia', 'central cordoba']
  },
  'real-madrid': {
    name: 'Real Madrid',
    logo: '/images/collections/Real_Madrid.png',
    description: 'El club más laureado del mundo',
    keywords: ['real madrid', 'madrid'],
    league: 'La Liga'
  },
  'barcelona': {
    name: 'FC Barcelona',
    logo: '/images/collections/FCBarcelona.svg.png',
    description: 'Més que un club',
    keywords: ['barcelona', 'barca', 'barça'],
    league: 'La Liga'
  },
  'manchester-united': {
    name: 'Manchester United',
    logo: '/images/collections/Manchester_United_FC.png',
    description: 'The Red Devils',
    keywords: ['manchester united', 'man united', 'man utd'],
    league: 'Premier League'
  },
  'manchester-city': {
    name: 'Manchester City',
    logo: '/images/collections/Manchester_City.png',
    description: 'The Citizens',
    keywords: ['manchester city', 'man city'],
    league: 'Premier League'
  },
  'liverpool': {
    name: 'Liverpool FC',
    logo: '/images/collections/liverpool.png',
    description: 'You\'ll Never Walk Alone',
    keywords: ['liverpool'],
    league: 'Premier League'
  },
  'chelsea': {
    name: 'Chelsea FC',
    logo: '/images/collections/Chelsea.png',
    description: 'The Blues',
    keywords: ['chelsea'],
    league: 'Premier League'
  },
  'arsenal': {
    name: 'Arsenal FC',
    logo: '/images/collections/Arsenal.png',
    description: 'The Gunners',
    keywords: ['arsenal'],
    league: 'Premier League'
  },
  'psg': {
    name: 'Paris Saint-Germain',
    logo: '/images/collections/PSG.png',
    description: 'Ici c\'est Paris',
    keywords: ['psg', 'paris saint-germain', 'paris saint germain'],
    league: 'Ligue 1'
  },
  'ac-milan': {
    name: 'AC Milan',
    logo: '/images/collections/milan.png',
    description: 'I Rossoneri',
    keywords: ['ac milan'],
    league: 'Serie A',
    // Evita confusão com Inter Milan
    excludeKeywords: ['inter milan', 'inter de milan']
  },
  'inter-miami': {
    name: 'Inter Miami',
    logo: '/images/collections/Inter-miami.png',
    description: 'The Herons',
    keywords: ['inter miami'],
    league: 'MLS'
  }
}

export default async function TeamPage({ params }) {
  const { slug } = await params

  // Buscar dados do time
  const teamData = teamsData[slug] || {
    name: slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    logo: null,
    description: 'Colección de camisetas',
    keywords: [slug.replace(/-/g, ' ')],
    league: 'Unknown'
  }

  // Buscar todos os produtos
  const allProducts = await getAllProducts()

  // Filtrar produtos por time (priorizar tags exatas, depois títulos)
  const teamProducts = allProducts.filter(product => {
    const title = (product.title || product.name || '').toLowerCase()
    const tags = product.tags || []

    // 1. PRIORIDADE MÁXIMA: Verificar tags exatas do Shopify (case-insensitive)
    const hasExactTag = teamData.keywords.some(keyword => {
      // Para keywords compostas (ex: "boca juniors"), verificar tag exata
      if (keyword.includes(' ')) {
        return tags.some(tag => tag.toLowerCase() === keyword.toLowerCase())
      }
      // Para keywords simples, também verificar tag exata
      return tags.some(tag => tag.toLowerCase() === keyword.toLowerCase())
    })

    // 2. SEGUNDA PRIORIDADE: Verificar keywords no título
    // Para evitar falsos positivos, usar busca mais específica
    const hasKeywordInTitle = teamData.keywords.some(keyword => {
      // Keywords com múltiplas palavras devem corresponder exatamente
      if (keyword.includes(' ')) {
        return title.includes(keyword.toLowerCase())
      }
      // Keywords simples: verificar se é palavra completa (evita "river" em "driver")
      const regex = new RegExp(`\\b${keyword.toLowerCase()}\\b`, 'i')
      return regex.test(title)
    })

    const hasMatch = hasExactTag || hasKeywordInTitle

    // Se tiver excludeKeywords, verificar se o produto NÃO contém nenhuma delas
    if (hasMatch && teamData.excludeKeywords) {
      const hasExcludedKeyword = teamData.excludeKeywords.some(excludeWord => {
        const excludeRegex = new RegExp(`\\b${excludeWord.toLowerCase()}\\b`, 'i')
        return excludeRegex.test(title)
      })
      return !hasExcludedKeyword
    }

    return hasMatch
  })

  console.log(`🏟️ Equipo ${teamData.name}: Encontrado ${teamProducts.length} produtos`)

  return <TeamPageContent team={teamData} products={teamProducts} slug={slug} />
}

// Generate static params for common teams
export async function generateStaticParams() {
  return Object.keys(teamsData).map(slug => ({ slug }))
}

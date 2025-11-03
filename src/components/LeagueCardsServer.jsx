import { getAllLeagues } from '@/utils/shopifyData'
import LeagueCardsClient from './LeagueCardsClient'

/**
 * Server Component that fetches leagues from Shopify products
 */
export default async function LeagueCards() {
  // Fetch all unique leagues from Shopify
  const shopifyLeagues = await getAllLeagues()

  // Define league order by popularity (exclude Champions League, Libertadores)
  const leagueOrder = [
    'Premier League',
    'La Liga',
    'Serie A',
    'Ligue 1',
    'Bundesliga',
    'Eredivisie',
    'Primeira Liga',
    'Liga MX',
    'MLS',
    'Sul-Americana',
    'Brasileirão',
    'National Teams'
  ]

  // Filter out campeonatos (Champions League, Libertadores) and Manga Longa
  const filteredLeagues = shopifyLeagues.filter(league => {
    const excludedLeagues = ['Champions League', 'Libertadores', 'Manga Longa', 'CONMEBOL Libertadores']
    return !excludedLeagues.includes(league.name)
  })

  // Add manual leagues (not in Shopify productType)
  const manualLeagues = [
    {
      id: 'national-teams',
      name: 'National Teams',
      slug: 'national-teams'
    },
    {
      id: 'brasileirao',
      name: 'Brasileirão',
      slug: 'brasileirao'
    }
  ]

  // Filter out manual leagues that already exist in filteredLeagues to avoid duplicates
  const existingLeagueNames = filteredLeagues.map(l => l.name)
  const uniqueManualLeagues = manualLeagues.filter(ml => !existingLeagueNames.includes(ml.name))

  const allLeagues = [...filteredLeagues, ...uniqueManualLeagues]

  // Sort leagues by popularity order
  const sortedLeagues = allLeagues.sort((a, b) => {
    const indexA = leagueOrder.indexOf(a.name)
    const indexB = leagueOrder.indexOf(b.name)

    // If not in order list, put at end
    if (indexA === -1) return 1
    if (indexB === -1) return -1

    return indexA - indexB
  })

  // Map league images (all leagues now have correct images)
  const leagueImageMap = {
    'Premier League': '/images/premier league.jpeg',
    'La Liga': '/images/la liga.jpeg',
    'Serie A': '/images/serie a.jpeg',
    'Ligue 1': '/images/ligue 1.jpeg',
    'Bundesliga': '/images/bundesliga.jpeg',
    'Eredivisie': '/images/eredivisie.jpeg',
    'Primeira Liga': '/images/liga portugal.jpeg',
    'Liga MX': '/images/liga mx.jpeg',
    'MLS': '/images/mls.jpeg',
    'Sul-Americana': '/images/liga SAF.jpeg',
    'Brasileirão': '/images/brasileirao.jpeg',
    'National Teams': '/images/national teams.jpeg',
  }

  // Map leagues with gradients and styling
  const leaguesWithStyling = sortedLeagues
    .filter(league => {
      // Only show leagues that are in the leagueOrder array
      // This prevents unexpected leagues from appearing
      return (league.slug || league.id) && league.name && leagueOrder.includes(league.name)
    })
    .map((league, index) => {
      // Define gradients for each league
      const gradientMap = {
        'Serie A': { gradient: 'from-blue-400 via-cyan-500 to-blue-600', glow: 'group-hover:shadow-cyan-500/50' },
        'La Liga': { gradient: 'from-orange-500 via-red-600 to-orange-700', glow: 'group-hover:shadow-orange-500/50' },
        'Premier League': { gradient: 'from-purple-600 via-pink-600 to-purple-900', glow: 'group-hover:shadow-purple-500/50' },
        'Bundesliga': { gradient: 'from-red-600 via-black to-red-800', glow: 'group-hover:shadow-red-500/50' },
        'Ligue 1': { gradient: 'from-blue-600 via-blue-700 to-blue-900', glow: 'group-hover:shadow-blue-500/50' },
        'Sul-Americana': { gradient: 'from-cyan-400 via-purple-500 to-purple-700', glow: 'group-hover:shadow-purple-500/50' },
        'Liga MX': { gradient: 'from-green-500 via-green-600 to-red-600', glow: 'group-hover:shadow-green-500/50' },
        'Eredivisie': { gradient: 'from-orange-600 via-blue-600 to-orange-700', glow: 'group-hover:shadow-orange-500/50' },
        'Primeira Liga': { gradient: 'from-red-600 via-green-600 to-red-700', glow: 'group-hover:shadow-green-500/50' },
        'MLS': { gradient: 'from-red-600 via-blue-600 to-red-700', glow: 'group-hover:shadow-red-500/50' },
        'Brasileirão': { gradient: 'from-green-500 via-yellow-500 to-blue-600', glow: 'group-hover:shadow-green-500/50' },
        'National Teams': { gradient: 'from-blue-500 via-cyan-500 to-blue-700', glow: 'group-hover:shadow-blue-500/50' },
      }

      const styling = gradientMap[league.name] || {
        gradient: 'from-gray-600 via-gray-700 to-gray-900',
        glow: 'group-hover:shadow-gray-500/50'
      }

      return {
        ...league,
        ...styling,
        image: leagueImageMap[league.name] || null
      }
    })

  return <LeagueCardsClient leagues={leaguesWithStyling} />
}

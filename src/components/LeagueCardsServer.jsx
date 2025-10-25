import { getAllLeagues } from '@/utils/shopifyData'
import LeagueCardsClient from './LeagueCardsClient'

/**
 * Server Component that fetches leagues from Shopify products
 */
export default async function LeagueCards() {
  // Fetch all unique leagues from Shopify
  const shopifyLeagues = await getAllLeagues()

  // Map leagues with gradients and styling
  const leaguesWithStyling = shopifyLeagues.map((league, index) => {
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
      'Manga Longa': { gradient: 'from-zinc-700 via-zinc-800 to-zinc-900', glow: 'group-hover:shadow-zinc-500/50' },
    }

    const styling = gradientMap[league.name] || {
      gradient: 'from-gray-600 via-gray-700 to-gray-900',
      glow: 'group-hover:shadow-gray-500/50'
    }

    return {
      ...league,
      ...styling
    }
  })

  return <LeagueCardsClient leagues={leaguesWithStyling} />
}

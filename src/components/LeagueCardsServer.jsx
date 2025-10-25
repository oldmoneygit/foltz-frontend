import { getAllLeagues } from '@/utils/shopifyData'
import LeagueCardsClient from './LeagueCardsClient'

/**
 * Server Component that fetches leagues from Shopify products
 */
export default async function LeagueCards() {
  // Fetch all unique leagues from Shopify
  const shopifyLeagues = await getAllLeagues()

  // Map league images
  const leagueImageMap = {
    'Serie A': '/images/leagues/replicate-prediction-21q4zb6bx1rm80ct304tg0gpyc.jpeg',
    'La Liga': '/images/leagues/replicate-prediction-3gmhza452srma0ct31n9g8w1w8.jpeg',
    'Premier League': '/images/leagues/replicate-prediction-6f1fa3n909rme0ct30st4pfk5r.jpeg',
    'Bundesliga': '/images/leagues/replicate-prediction-8ep34ktvnnrma0ct30nb3pwn14.jpeg',
    'Ligue 1': '/images/leagues/replicate-prediction-9d0ac73d99rme0ct308as6raz8.jpeg',
    'Eredivisie': '/images/leagues/replicate-prediction-fhg8t7vzesrme0ct30japhna94.jpeg',
    'Primeira Liga': '/images/leagues/replicate-prediction-g3kvswhvhnrmc0ct30h833c67r.jpeg',
    'Liga MX': '/images/leagues/replicate-prediction-ht9wfsvbb5rm80ct30vtxbdm7m.jpeg',
    'Sul-Americana': '/images/leagues/replicate-prediction-mn3m7q1jh9rma0ct30ebpv1wvc.jpeg',
    'MLS': '/images/leagues/replicate-prediction-mtawn898asrmc0ct30ct2mxgkc.jpeg',
    'Manga Longa': '/images/leagues/replicate-prediction-ne6kdck271rm80ct30m8cj9jac.jpeg',
  }

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
      ...styling,
      image: leagueImageMap[league.name] || null
    }
  })

  return <LeagueCardsClient leagues={leaguesWithStyling} />
}

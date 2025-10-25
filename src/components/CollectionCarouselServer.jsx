import { getProductsByLeague } from '@/utils/shopifyData'
import CollectionCarouselClient from './CollectionCarouselClient'

/**
 * Server Component that fetches products for a league/collection from Shopify
 */
export default async function CollectionCarousel({ title, emoji, subtitle, collectionSlug }) {
  // Map collection slugs to league names in Shopify
  const leagueNameMap = {
    'premier-league': 'Premier League',
    'la-liga': 'La Liga',
    'serie-a': 'Serie A',
    'bundesliga': 'Bundesliga',
    'ligue-1': 'Ligue 1',
    'liga-mx': 'Liga MX',
    'sul-americana': 'Sul-Americana',
    'primeira-liga': 'Primeira Liga',
    'eredivisie': 'Eredivisie',
    'mls': 'MLS',
    'manga-longa': 'Manga Longa'
  }

  // Get the actual league name from the map
  const leagueName = leagueNameMap[collectionSlug] || title

  // Fetch products for this league from Shopify
  const products = await getProductsByLeague(leagueName, 12)

  // Don't render if no products
  if (!products || products.length === 0) {
    return null
  }

  return (
    <CollectionCarouselClient
      title={title}
      emoji={emoji}
      subtitle={subtitle}
      collectionSlug={collectionSlug}
      products={products}
    />
  )
}

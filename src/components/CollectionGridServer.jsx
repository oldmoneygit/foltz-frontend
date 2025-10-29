import { getProductsByLeague } from '@/utils/shopifyData'
import CollectionGridClient from './CollectionGridClient'

/**
 * Server Component that fetches products for a league/collection from Shopify
 * Displays products in a grid layout with league image on the side
 */
export default async function CollectionGrid({ collectionSlug, collectionImage }) {
  // Map collection slugs to multiple search terms (tries all variations)
  const leagueSearchTerms = {
    'premier-league': ['Premier League', 'liga:premier-league', 'premier', 'england'],
    'la-liga': ['La Liga', 'liga:la-liga', 'laliga', 'spain', 'españa'],
    'serie-a': ['Serie A', 'liga:serie-a', 'seriea', 'italy', 'italia'],
    'bundesliga': ['Bundesliga', 'liga:bundesliga', 'germany', 'alemanha'],
    'ligue-1': ['Ligue 1', 'liga:ligue-1', 'ligue1', 'france', 'frança'],
    'liga-mx': ['Liga MX', 'liga:liga-mx', 'ligamx', 'mexico', 'méxico'],
    'sul-americana': ['Sul-Americana', 'liga:sul-americana', 'sulamericana', 'south-america'],
    'primeira-liga': ['Primeira Liga', 'liga:primeira-liga', 'portugal'],
    'eredivisie': ['Eredivisie', 'liga:eredivisie', 'netherlands', 'holanda'],
    'mls': ['MLS', 'liga:mls', 'usa'],
    'national-teams': ['National Teams', 'liga:national-teams', 'selecciones', 'seleções', 'international'],
    'argentina-legends': ['Argentina', 'Argentina Legends', 'argentina-legends', 'ArgentinaLegends', 'argentina legends', 'legends', 'lendas'],
    'manga-longa': ['Manga Longa', 'long-sleeve', 'longa']
  }

  // Get search terms for this collection
  const searchTerms = leagueSearchTerms[collectionSlug] || [collectionSlug]

  // Try each search term until we find products
  let products = []
  console.log(`🔍 Searching for ${collectionSlug} with terms:`, searchTerms)

  for (const term of searchTerms) {
    console.log(`  ⏳ Trying term: "${term}"`)
    products = await getProductsByLeague(term, 12)

    if (products && products.length > 0) {
      console.log(`  ✅ Found ${products.length} products for ${collectionSlug} using term: "${term}"`)
      break
    } else {
      console.log(`  ❌ No products found with term: "${term}"`)
    }
  }

  // Don't render if no products found
  if (!products || products.length === 0) {
    console.warn(`⚠️ FINAL: No products found for ${collectionSlug} after trying all search terms:`, searchTerms)
    return null
  }

  console.log(`✨ Rendering ${collectionSlug} with ${products.length} products`)

  return (
    <CollectionGridClient
      collectionSlug={collectionSlug}
      collectionImage={collectionImage}
      products={products}
    />
  )
}

import { getCachedProducts } from '@/lib/productCache'
import CollectionGridClient from './CollectionGridClient'

/**
 * Server Component that fetches products for a league/collection from Shopify
 * Displays products in a grid layout with league image on the side
 * Now uses cached products to avoid multiple API calls
 */
export default async function CollectionGrid({ collectionSlug, collectionImage }) {
  // Map collection slugs to multiple search terms (tries all variations)
  const leagueSearchTerms = {
    'premier-league': ['premier league', 'premier'],
    'la-liga': ['la liga', 'laliga'],
    'serie-a': ['serie a', 'seriea'],
    'bundesliga': ['bundesliga'],
    'ligue-1': ['ligue 1', 'ligue1'],
    'liga-mx': ['liga mx', 'ligamx'],
    'sul-americana': ['sul-americana', 'sulamericana'],
    'primeira-liga': ['primeira liga', 'portugal'],
    'eredivisie': ['eredivisie'],
    'mls': ['mls'],
    'national-teams': ['national teams', 'selecciones'],
    'argentina-legends': ['argentina'],
    'manga-longa': ['long sleeve', 'manga longa']
  }

  // Get search terms for this collection
  const searchTerms = leagueSearchTerms[collectionSlug] || [collectionSlug]

  // Get all products from cache (shared across all components)
  const allProducts = await getCachedProducts()

  // Filter products locally instead of making API calls
  let products = []

  for (const term of searchTerms) {
    products = allProducts.filter(product => {
      const productType = (product.productType || '').toLowerCase()
      const tags = (product.tags || []).join(' ').toLowerCase()
      const title = (product.name || '').toLowerCase()
      const searchText = `${productType} ${tags} ${title}`

      return searchText.includes(term.toLowerCase())
    }).slice(0, 12)

    if (products.length > 0) {
      break
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

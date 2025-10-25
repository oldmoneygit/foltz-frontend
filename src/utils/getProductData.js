import leaguesData from '../../public/leagues_data.json'

/**
 * Get all products from all leagues
 */
export function getAllProducts() {
  const allProducts = []

  Object.keys(leaguesData).forEach((leagueId) => {
    const league = leaguesData[leagueId]
    if (league.products && Array.isArray(league.products)) {
      league.products.forEach((product) => {
        allProducts.push({
          ...product,
          league: {
            id: league.id,
            name: league.name,
            country: league.country,
            color: league.color,
          },
          // Add default values
          price: 82713.38, // Preço padrão
          regularPrice: 115798.73, // Preço regular
          stock: 'available',
          tags: [leagueId],
        })
      })
    }
  })

  return allProducts
}

/**
 * Get product by slug (id)
 */
export function getProductBySlug(slug) {
  const allProducts = getAllProducts()
  return allProducts.find((product) => product.id === slug) || null
}

/**
 * Get all product slugs (for static generation)
 */
export function getAllProductSlugs() {
  const allProducts = getAllProducts()
  return allProducts.map((product) => ({ slug: product.id }))
}

/**
 * Get related products (same league)
 */
export function getRelatedProducts(currentSlug, leagueId, limit = 8) {
  const allProducts = getAllProducts()
  return allProducts
    .filter((product) => product.id !== currentSlug && product.league.id === leagueId)
    .slice(0, limit)
}

/**
 * Parse sizes string to array
 * Example: "Size S-XXL" => ["S", "M", "L", "XL", "XXL"]
 */
export function parseSizes(sizesString) {
  if (!sizesString) return []

  // Extract size range from string like "Size S-XXL" or "Size S-4XL"
  const match = sizesString.match(/Size\s+([A-Z0-9]+)-([A-Z0-9]+)/i)
  if (!match) return []

  const [, start, end] = match

  // Standard size order
  const sizeOrder = ['S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL']

  const startIndex = sizeOrder.indexOf(start)
  const endIndex = sizeOrder.indexOf(end)

  if (startIndex === -1 || endIndex === -1) return []

  return sizeOrder.slice(startIndex, endIndex + 1)
}

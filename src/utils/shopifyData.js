import {
  getAllProducts as shopifyGetAllProducts,
  getProduct as shopifyGetProduct,
  getProductsByTag,
  getAllLeagues as shopifyGetAllLeagues,
  getLeagueFromProduct
} from '@/lib/shopify'

/**
 * Transform Shopify product to match our app's format
 * This allows us to maintain compatibility with existing components
 */
function transformShopifyProduct(shopifyProduct) {
  const node = shopifyProduct.node || shopifyProduct

  // Extract first image
  const firstImage = node.images?.edges?.[0]?.node

  // Extract all images
  const allImages = node.images?.edges?.map(edge => edge.node.url) || []

  // Get price data
  const price = parseFloat(node.priceRange?.minVariantPrice?.amount || 0)
  const compareAtPrice = parseFloat(node.compareAtPriceRange?.minVariantPrice?.amount || 0)

  // Get league info
  const league = getLeagueFromProduct(node)

  // Extract sizes from variants
  const sizes = node.variants?.edges?.map(({ node: variant }) => {
    return variant.title
  }) || []

  return {
    id: node.handle,
    slug: node.handle, // Add slug field for product links
    name: node.title,
    handle: node.handle,
    description: node.description,
    main_image: firstImage?.url || '',
    images: allImages,
    image_count: allImages.length,
    price: price,
    regularPrice: compareAtPrice || price * 1.4, // Fallback if no compareAt price
    stock: 'available',
    sizes: sizes.join(', ') || 'Size M-XL',
    tags: node.tags || [],
    league: {
      id: league.name.toLowerCase().replace(/\s+/g, '-'),
      name: league.name,
      country: league.country,
      color: league.color,
    },
    // Shopify specific data (useful for checkout)
    shopifyId: node.id,
    variants: node.variants?.edges || [],
    productType: node.productType
  }
}

/**
 * Get all products from Shopify
 * @returns {Promise<Array>} Array of transformed products
 */
export async function getAllProducts() {
  try {
    const response = await shopifyGetAllProducts(250)

    if (!response || !response.edges) {
      console.warn('No products found in Shopify')
      return []
    }

    return response.edges.map(transformShopifyProduct)
  } catch (error) {
    console.error('Error fetching all products:', error)
    return []
  }
}

/**
 * Get product by slug/handle
 * @param {string} slug - Product handle
 * @returns {Promise<Object|null>} Transformed product or null
 */
export async function getProductBySlug(slug) {
  try {
    const product = await shopifyGetProduct(slug)

    if (!product) {
      return null
    }

    return transformShopifyProduct(product)
  } catch (error) {
    console.error(`Error fetching product ${slug}:`, error)
    return null
  }
}

/**
 * Get all product slugs for static generation
 * @returns {Promise<Array>} Array of {slug: string}
 */
export async function getAllProductSlugs() {
  try {
    const products = await getAllProducts()
    return products.map(product => ({ slug: product.handle }))
  } catch (error) {
    console.error('Error fetching product slugs:', error)
    return []
  }
}

/**
 * Get related products (same league)
 * @param {string} currentSlug - Current product slug
 * @param {string} leagueName - League name from productType
 * @param {number} limit - Number of products to return
 * @returns {Promise<Array>} Array of transformed products
 */
export async function getRelatedProducts(currentSlug, leagueName, limit = 8) {
  try {
    // Get all products from the same league
    const response = await getProductsByTag(leagueName, limit + 10)

    if (!response || response.length === 0) {
      return []
    }

    // Filter out current product and limit results
    return response
      .map(transformShopifyProduct)
      .filter(product => product.handle !== currentSlug)
      .slice(0, limit)
  } catch (error) {
    console.error('Error fetching related products:', error)
    return []
  }
}

/**
 * Get products by league
 * @param {string} leagueName - League name (e.g., "Premier League")
 * @param {number} limit - Number of products to fetch
 * @returns {Promise<Array>} Array of transformed products
 */
export async function getProductsByLeague(leagueName, limit = 100) {
  try {
    const response = await getProductsByTag(leagueName, limit)

    if (!response || response.length === 0) {
      return []
    }

    return response.map(transformShopifyProduct)
  } catch (error) {
    console.error(`Error fetching products for league ${leagueName}:`, error)
    return []
  }
}

/**
 * Get all leagues
 * @returns {Promise<Array>} Array of league objects
 */
export async function getAllLeagues() {
  try {
    return await shopifyGetAllLeagues()
  } catch (error) {
    console.error('Error fetching leagues:', error)
    return []
  }
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

/**
 * Get league by slug
 * @param {string} slug - League slug (e.g., "premier-league")
 * @returns {Promise<Object|null>} League object or null
 */
export async function getLeagueBySlug(slug) {
  try {
    const leagues = await getAllLeagues()
    return leagues.find(league => league.id === slug) || null
  } catch (error) {
    console.error(`Error fetching league ${slug}:`, error)
    return null
  }
}

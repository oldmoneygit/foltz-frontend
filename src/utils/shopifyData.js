import {
  getAllProducts as shopifyGetAllProducts,
  getProduct as shopifyGetProduct,
  getProductsByTag,
  getProductsByTypeOrTag,
  getAllLeagues as shopifyGetAllLeagues,
  getLeagueFromProduct
} from '@/lib/shopify'

/**
 * Transform Shopify product to match our app's format
 */
function transformShopifyProduct(shopifyProduct) {
  const node = shopifyProduct.node || shopifyProduct

  const firstImage = node.images?.edges?.[0]?.node
  const allImages = node.images?.edges?.map(edge => edge.node.url) || []
  const price = parseFloat(node.priceRange?.minVariantPrice?.amount || 0)
  const compareAtPrice = parseFloat(node.compareAtPriceRange?.minVariantPrice?.amount || 0)
  const league = getLeagueFromProduct(node)
  const sizeOption = node.options?.find(option => option.name === 'Size')
  const sizes = sizeOption?.values || []

  return {
    id: node.handle,
    slug: node.handle,
    name: node.title,
    handle: node.handle,
    description: node.description,
    main_image: firstImage?.url || '',
    images: allImages,
    image_count: allImages.length,
    price: price,
    regularPrice: compareAtPrice > 0 ? compareAtPrice : null,
    stock: 'available',
    sizes: sizes,
    tags: node.tags || [],
    league: {
      id: league.name.toLowerCase().replace(/\s+/g, '-'),
      name: league.name,
      country: league.country,
      color: league.color,
    },
    shopifyId: node.id,
    variants: node.variants?.edges || [],
    productType: node.productType
  }
}

/**
 * Get all products from Shopify (with pagination)
 */
export async function getAllProducts() {
  try {
    const allProducts = []
    let hasNextPage = true
    let cursor = null
    let pageCount = 0

    while (hasNextPage) {
      pageCount++
      const response = await shopifyGetAllProducts(250, cursor)

      if (!response || !response.edges) break

      const pageProducts = response.edges
        .map(transformShopifyProduct)
        .filter(product => {
          const title = (product.name || '').toLowerCase()
          const tags = (product.tags || []).join(' ').toLowerCase()
          const productType = (product.productType || '').toLowerCase()

          const isMysterybox = title.includes('mysterybox') ||
                              title.includes('mystery box') ||
                              tags.includes('mysterybox') ||
                              productType.includes('mysterybox')

          return !isMysterybox
        })
      allProducts.push(...pageProducts)

      hasNextPage = response.pageInfo?.hasNextPage || false
      cursor = response.pageInfo?.endCursor || null

      if (pageCount >= 10) break
    }

    return allProducts
  } catch (error) {
    console.error('Error fetching all products:', error)
    return []
  }
}

/**
 * Get product by slug/handle
 */
export async function getProductBySlug(slug) {
  try {
    const product = await shopifyGetProduct(slug)
    if (!product) return null
    return transformShopifyProduct(product)
  } catch (error) {
    console.error(`Error fetching product ${slug}:`, error)
    return null
  }
}

/**
 * Get all product slugs for static generation
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
 */
export async function getRelatedProducts(currentSlug, leagueName, limit = 8) {
  try {
    const response = await getProductsByTag(leagueName, limit + 10)
    if (!response || response.length === 0) return []

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
 */
export async function getProductsByLeague(leagueName, limit = 100) {
  try {
    if (leagueName === 'National Teams') {
      const allProducts = await getAllProducts()

      const allowedNationalTeams = [
        'argentina', 'brazil', 'brasil', 'germany', 'alemanha', 'england', 'inglaterra',
        'france', 'frança', 'netherlands', 'holanda', 'holland', 'italy', 'italia',
        'spain', 'españa', 'espanha', 'portugal', 'mexico', 'méxico', 'usa', 'united states',
        'japan', 'japão', 'cameroon', 'camarões', 'colombia', 'greece', 'grecia', 'grécia',
        'iceland', 'islandia', 'islândia', 'ireland', 'irlanda', 'jamaica', 'norway',
        'noruega', 'panama', 'panamá', 'poland', 'polonia', 'polônia', 'scotland',
        'escocia', 'escócia', 'south africa', 'africa do sul', 'venezuela', 'wales',
        'gales', 'yugoslavia', 'iugoslávia'
      ]

      const clubsToExclude = [
        'hamburger sv', 'köln', 'koln', 'cologne', 'manchester united', 'southampton',
        'barcelona', 'real madrid', 'atletico', 'sevilla', 'valencia', 'betis',
        'manchester city', 'liverpool', 'chelsea', 'arsenal', 'tottenham',
        'bayern', 'borussia', 'dortmund', 'leipzig', 'leverkusen',
        'juventus', 'milan', 'inter', 'napoli', 'roma', 'lazio', 'atalanta',
        'psg', 'marseille', 'lyon', 'monaco', 'lille',
        'ajax', 'psv', 'feyenoord', 'benfica', 'porto', 'sporting',
        'boca', 'river', 'racing', 'independiente', 'san lorenzo',
        'flamengo', 'palmeiras', 'santos', 'corinthians', 'sao paulo'
      ]

      const filtered = allProducts.filter(p => {
        const title = (p.title || p.name || '').toLowerCase()
        const tags = (p.tags || []).map(t => t.toLowerCase()).join(' ')
        const productType = (p.productType || '').toLowerCase()
        const searchText = `${title} ${tags} ${productType}`

        const hasNationalTeam = allowedNationalTeams.some(team => searchText.includes(team))
        const hasClub = clubsToExclude.some(club => searchText.includes(club))

        return hasNationalTeam && !hasClub
      })

      return filtered.slice(0, limit)
    }

    if (leagueName === 'Argentina Legends') {
      const allProducts = await getAllProducts()
      const filtered = allProducts.filter(p => {
        const title = (p.title || p.name || '').toLowerCase()
        const tags = (p.tags || []).map(t => t.toLowerCase()).join(' ')
        const productType = (p.productType || '').toLowerCase()
        const searchText = `${title} ${tags} ${productType}`

        return searchText.includes('argentina') || searchText.includes('albiceleste')
      })
      return filtered.slice(0, limit)
    }

    if (leagueName === 'Retro Collection') {
      const allProducts = await getAllProducts()
      const filtered = allProducts.filter(p => {
        const title = (p.title || p.name || '').toLowerCase()
        const tags = (p.tags || []).map(t => t.toLowerCase()).join(' ')
        const searchText = `${title} ${tags}`

        const hasRetroYear = /19[7-9]\d|20[0-1]\d/.test(title)
        const hasRetroKeyword = searchText.includes('retro') ||
                               searchText.includes('vintage') ||
                               searchText.includes('classic') ||
                               searchText.includes('throwback') ||
                               searchText.includes('legends')

        return hasRetroYear || hasRetroKeyword
      })
      return filtered.slice(0, limit)
    }

    const response = await getProductsByTypeOrTag(leagueName, limit)
    if (!response || response.length === 0) return []

    return response.map(transformShopifyProduct)
  } catch (error) {
    console.error(`Error fetching products for league ${leagueName}:`, error)
    return []
  }
}

/**
 * Get all leagues
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
 * Parse sizes - handles both arrays and strings
 */
export function parseSizes(sizes) {
  if (Array.isArray(sizes)) return sizes
  if (!sizes || typeof sizes !== 'string') return []

  const match = sizes.match(/Size\s+([A-Z0-9]+)-([A-Z0-9]+)/i)
  if (!match) return []

  const [, start, end] = match
  const sizeOrder = ['S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL']

  const startIndex = sizeOrder.indexOf(start)
  const endIndex = sizeOrder.indexOf(end)

  if (startIndex === -1 || endIndex === -1) return []

  return sizeOrder.slice(startIndex, endIndex + 1)
}

/**
 * Get league by slug
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

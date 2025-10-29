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

  // Extract sizes from options (Size option)
  const sizeOption = node.options?.find(option => option.name === 'Size')
  const sizes = sizeOption?.values || []

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
    regularPrice: compareAtPrice > 0 ? compareAtPrice : null, // Usar compareAtPrice da Shopify (atualizado)
    stock: 'available',
    sizes: sizes, // Now returns array directly: ['S', 'M', 'L', 'XL', 'XXL']
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
    console.log('🔍 getProductsByLeague chamado com:', leagueName)
    
    // Lógica especial para coleções customizadas
    if (leagueName === 'National Teams') {
      console.log('✅ Usando filtro especial para National Teams (baseado em lista específica)')
      // Buscar APENAS seleções nacionais - lista específica da pasta
      const allProducts = await getAllProducts()
      
      // Lista exata de seleções permitidas (baseada na pasta do usuário)
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
      
      // EXCLUIR clubes (lista completa de todos os clubes mencionados)
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
        
        // Deve ter pelo menos uma seleção permitida
        const hasNationalTeam = allowedNationalTeams.some(team => searchText.includes(team))
        
        // NÃO deve ter NENHUM clube
        const hasClub = clubsToExclude.some(club => searchText.includes(club))
        
        return hasNationalTeam && !hasClub
      })
      
      console.log('✅ National Teams encontrados:', filtered.length)
      return filtered.slice(0, limit)
    }
    
    if (leagueName === 'Argentina Legends') {
      console.log('✅ Usando filtro especial para Argentina Legends')
      // Buscar TODAS as camisas da Argentina disponíveis
      const allProducts = await getAllProducts()
      const filtered = allProducts.filter(p => {
        const title = (p.title || p.name || '').toLowerCase()
        const tags = (p.tags || []).map(t => t.toLowerCase()).join(' ')
        const productType = (p.productType || '').toLowerCase()
        const searchText = `${title} ${tags} ${productType}`
        
        // Qualquer produto que tenha Argentina
        return searchText.includes('argentina') || searchText.includes('albiceleste')
      })
      console.log('✅ Argentina Legends encontrados:', filtered.length)
      return filtered.slice(0, limit)
    }
    
    if (leagueName === 'Retro Collection') {
      console.log('✅ Usando filtro especial para Retro Collection')
      // Buscar produtos retro/vintage de qualquer time
      const allProducts = await getAllProducts()
      const filtered = allProducts.filter(p => {
        const title = (p.title || p.name || '').toLowerCase()
        const tags = (p.tags || []).map(t => t.toLowerCase()).join(' ')
        const searchText = `${title} ${tags}`
        
        // Anos retro ou keywords retro
        const hasRetroYear = /19[7-9]\d|20[0-1]\d/.test(title) // 1970-2019
        const hasRetroKeyword = searchText.includes('retro') ||
                               searchText.includes('vintage') ||
                               searchText.includes('classic') ||
                               searchText.includes('throwback') ||
                               searchText.includes('legends')
        
        return hasRetroYear || hasRetroKeyword
      })
      console.log('✅ Retro Collection encontrados:', filtered.length)
      return filtered.slice(0, limit)
    }

    // Busca normal para outras ligas
    console.log('➡️ Usando busca normal (productType/tag)')
    const response = await getProductsByTypeOrTag(leagueName, limit)

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
 * Parse sizes - now handles both arrays and strings for backward compatibility
 * If array is passed: returns it directly
 * If string is passed: parses "Size S-XXL" => ["S", "M", "L", "XL", "XXL"]
 */
export function parseSizes(sizes) {
  // If already an array, return it
  if (Array.isArray(sizes)) return sizes

  // If not a string, return empty array
  if (!sizes || typeof sizes !== 'string') return []

  // Extract size range from string like "Size S-XXL" or "Size S-4XL"
  const match = sizes.match(/Size\s+([A-Z0-9]+)-([A-Z0-9]+)/i)
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

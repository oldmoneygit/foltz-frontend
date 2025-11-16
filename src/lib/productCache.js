import { cache } from 'react'
import { getAllProducts as fetchAllProducts } from '@/utils/shopifyData'

/**
 * Cached version of getAllProducts using React cache
 * This ensures that multiple components calling this function
 * during the same request will share the same data
 */
export const getCachedProducts = cache(async () => {
  console.log('🚀 Fetching ALL products from Shopify (cached)')
  const products = await fetchAllProducts()
  console.log(`✅ Loaded ${products.length} products into cache`)
  return products
})

/**
 * Get products filtered by league from cached data
 */
export const getCachedProductsByLeague = cache(async (leagueName, limit = 12) => {
  const allProducts = await getCachedProducts()

  const filtered = allProducts.filter(product => {
    const productType = (product.productType || '').toLowerCase()
    const tags = (product.tags || []).join(' ').toLowerCase()
    const searchText = `${productType} ${tags}`

    return searchText.includes(leagueName.toLowerCase())
  })

  return filtered.slice(0, limit)
})

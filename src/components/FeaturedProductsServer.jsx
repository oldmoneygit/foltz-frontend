import { getAllProducts } from '@/utils/shopifyData'
import FeaturedProductsClient from './FeaturedProductsClient'

/**
 * Server Component that fetches featured products from Shopify
 */
export default async function FeaturedProducts() {
  // Fetch all products from Shopify
  const allProducts = await getAllProducts()

  // Select random 8 products as featured
  const featuredProducts = allProducts
    .sort(() => Math.random() - 0.5)
    .slice(0, 8)

  return <FeaturedProductsClient products={featuredProducts} />
}

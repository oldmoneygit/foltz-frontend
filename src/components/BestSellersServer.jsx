import { getAllProducts } from '@/utils/shopifyData'
import BestSellersClient from './BestSellersClient'

/**
 * Server Component that fetches best sellers from Shopify
 * and passes them to the Client Component for interactivity
 */
export default async function BestSellers() {
  // Fetch all products from Shopify
  const allProducts = await getAllProducts()

  // Select random 8 products as best sellers
  const bestSellers = allProducts
    .sort(() => Math.random() - 0.5)
    .slice(0, 8)
    .map(product => ({
      ...product,
      slug: product.handle,
      badge: 'Best Seller'
    }))

  return <BestSellersClient products={bestSellers} />
}

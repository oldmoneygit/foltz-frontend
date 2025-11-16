import { getCachedProducts } from '@/lib/productCache'
import FeaturedProductsClient from './FeaturedProductsClient'

/**
 * Server Component that fetches featured products from Shopify
 * Uses cached products to avoid redundant API calls
 */
export default async function FeaturedProducts() {
  // Fetch all products from Shopify (cached - shared with other components)
  const allProducts = await getCachedProducts()

  // Lista dos 30 produtos mais vendidos na ordem exata
  const bestSellerTitles = [
    'Argentina Retro',
    'Real Madrid 17/18 Retro Away Long Sleeve',
    'Inglaterra Retro',
    'Barcelona Retro',
    'Alemania 2010 Retro Away',
    'Inter de Milán 97/98 Retro Third Long Sleeve',
    'Inter de Milán 97/98 Retro Home Long Sleeve',
    'Inter de Milán 10/11 Retro Away',
    'Santos 12/13 Retro Away Long Sleeve',
    'Santos 11/12 Retro Home',
    'River Plate 13/14 Retro',
    'Real Madrid Retro',
    'Real Madrid 16/17 Retro Away',
    'Real Madrid 02/03 Retro Home Champions League',
    'Real Madrid 02/03 Retro Away Champions League',
    'PSG 18/19 Retro Away Long Sleeve',
    'Portugal Retro Away Long Sleeve',
    'Portugal Retro Away',
    'Portugal 2026 Retro Home',
    'Portugal 2006 Retro Away',
    'Manchester United 13/14 Retro Long Sleeve',
    'Manchester United 07/08 Retro Long Sleeve',
    'Italia 2026 Retro Away',
    'Inter Miami 25/26 Retro Home',
    'Holanda Retro Away',
    'Chelsea 10/11 Retro Away',
    'Barcelona 05/06 Retro Home Champions League',
    'Argentina 2025 Retro Chaqueta',
    'Alemania 2026 Retro Away',
    'AC Milan 11/12 Retro Away Long Sleeve'
  ]

  // Buscar os produtos na ordem exata especificada
  const featuredProducts = bestSellerTitles
    .map(title => allProducts.find(p => p.name === title || p.title === title))
    .filter(Boolean) // Remove undefined se algum produto não for encontrado

  console.log(`✅ Featured products found: ${featuredProducts.length} of ${bestSellerTitles.length}`)

  return <FeaturedProductsClient products={featuredProducts} />
}

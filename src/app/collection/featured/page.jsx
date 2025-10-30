import { getAllProducts } from '@/utils/shopifyData'
import FeaturedContent from './FeaturedContent'

export const metadata = {
  title: 'Featured Collection - Foltz Fanwear',
  description: 'Nuestra selección especial de jerseys destacados. Productos únicos y ediciones limitadas cuidadosamente seleccionados para ti.',
}

/**
 * Server Component that fetches all featured products
 */
export default async function FeaturedPage() {
  // Fetch all products from Shopify
  const allProducts = await getAllProducts()

  // Featured criteria: Recent releases (2023-2026), special editions, home jerseys
  const featuredKeywords = [
    '25-26', // Current season
    '24-25', // Last season
    'special edition',
    'edición especial',
    'limited',
    'limitada',
    'icon',
    'authentic'
  ]

  // Priority teams for featured collection
  const featuredTeams = [
    'Real Madrid',
    'Barcelona',
    'PSG',
    'Paris Saint-Germain',
    'Manchester City',
    'Bayern Munich',
    'Bayern München',
    'Liverpool',
    'Arsenal',
    'Inter Milan',
    'Juventus',
    'AC Milan',
    'Boca Juniors',
    'River Plate',
    'Argentina',
    'Brasil',
    'Brazil',
    'España',
    'Espanha'
  ]

  // Filter featured products
  const featuredProducts = allProducts.filter(product => {
    const productName = product.name.toLowerCase()

    // Check if it's from a featured team
    const isFeaturedTeam = featuredTeams.some(team =>
      productName.includes(team.toLowerCase())
    )

    // Check if has featured keywords
    const hasFeaturedKeyword = featuredKeywords.some(keyword =>
      productName.includes(keyword.toLowerCase())
    )

    // Check if it's a home or special edition
    const isHomeOrSpecial = productName.includes('home') ||
                           productName.includes('local') ||
                           productName.includes('special') ||
                           productName.includes('edición especial')

    return isFeaturedTeam && (hasFeaturedKeyword || isHomeOrSpecial)
  }).map(product => ({
    ...product,
    slug: product.handle,
    badge: 'Featured'
  }))

  // If we have few featured products, add some bestsellers
  if (featuredProducts.length < 12) {
    const additionalProducts = allProducts
      .filter(p => !featuredProducts.find(fp => fp.id === p.id))
      .filter(p => featuredTeams.some(team => p.name.toLowerCase().includes(team.toLowerCase())))
      .slice(0, 12 - featuredProducts.length)
      .map(product => ({
        ...product,
        slug: product.handle,
        badge: 'Featured'
      }))

    featuredProducts.push(...additionalProducts)
  }

  // Shuffle for variety
  const shuffledFeatured = featuredProducts.sort(() => Math.random() - 0.5)

  return <FeaturedContent products={shuffledFeatured} />
}

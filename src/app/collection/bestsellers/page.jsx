import { getAllProducts } from '@/utils/shopifyData'
import BestsellersContent from './BestsellersContent'

export const metadata = {
  title: 'Best Sellers - Foltz Fanwear',
  description: 'Los jerseys más vendidos de los equipos más famosos del mundo. Encuentra las camisetas de Real Madrid, PSG, Barcelona, Manchester City y más.',
}

/**
 * Server Component that fetches all bestseller products
 */
export default async function BestsellersPage() {
  // Fetch all products from Shopify
  const allProducts = await getAllProducts()

  // Priority teams - these will have more products in the bestsellers
  const priorityTeams = [
    'Real Madrid',
    'PSG',
    'Paris Saint-Germain',
    'Barcelona',
    'Manchester City',
  ]

  // Secondary popular teams
  const secondaryTeams = [
    'Liverpool',
    'Manchester United',
    'Bayern Munich',
    'Bayern München',
    'Chelsea',
    'Arsenal',
    'Juventus',
    'Inter Milan',
    'AC Milan',
    'Tottenham',
    'Boca Juniors',
    'Argentina',
    'España',
    'Espanha',
    'Brasil',
    'Brazil',
    'México',
    'Mexico',
    'England',
    'Inglaterra',
    'Portugal',
    'France',
    'França',
  ]

  // Years to exclude (retro/vintage jerseys)
  const retroYears = [
    '1970', '1971', '1972', '1973', '1974', '1975', '1976', '1977', '1978', '1979',
    '1980', '1981', '1982', '1983', '1984', '1985', '1986', '1987', '1988', '1989',
    '1990', '1991', '1992', '1993', '1994', '1995', '1996', '1997', '1998', '1999',
    '2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009',
    '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019',
    '2020', '2021', '2022'
  ]

  // Filter recent products only (exclude retro jerseys)
  const isRecentProduct = (product) => {
    const productName = product.name.toLowerCase()
    const productTitle = product.name

    // Check if product contains any retro year
    const hasRetroYear = retroYears.some(year => productTitle.includes(year))

    // Check for retro keywords
    const retroKeywords = ['retro', 'vintage', 'classic', 'throwback', 'legends']
    const hasRetroKeyword = retroKeywords.some(keyword => productName.includes(keyword))

    return !hasRetroYear && !hasRetroKeyword
  }

  // Filter priority team products
  const priorityProducts = allProducts.filter(product => {
    if (!isRecentProduct(product)) return false

    const productName = product.name.toLowerCase()
    return priorityTeams.some(team => productName.includes(team.toLowerCase()))
  })

  // Filter secondary team products
  const secondaryProducts = allProducts.filter(product => {
    if (!isRecentProduct(product)) return false

    const productName = product.name.toLowerCase()
    // Check if it's not already in priority
    const isPriority = priorityTeams.some(team => productName.includes(team.toLowerCase()))
    if (isPriority) return false

    return secondaryTeams.some(team => productName.includes(team.toLowerCase()))
  })

  // Combine all bestseller products
  const allBestsellers = [
    ...priorityProducts,
    ...secondaryProducts
  ].map(product => ({
    ...product,
    slug: product.handle,
    badge: 'Best Seller'
  }))

  // Shuffle for variety
  const shuffledBestsellers = allBestsellers.sort(() => Math.random() - 0.5)

  return <BestsellersContent products={shuffledBestsellers} />
}

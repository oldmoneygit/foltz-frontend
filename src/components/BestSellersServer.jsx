import { getAllProducts } from '@/utils/shopifyData'
import BestSellersClient from './BestSellersClient'

/**
 * Server Component that fetches best sellers from Shopify
 * and passes them to the Client Component for interactivity
 * Prioritizes recent jerseys from top teams
 */
export default async function BestSellers() {
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

  // BUSCAR PRODUTOS ESPECÍFICOS - LISTA EXATA DO USUÁRIO
  const findSpecificProduct = (allProds, keywords, debugName = '') => {
    const found = allProds.find(p => {
      const title = (p.title || p.name || '').toLowerCase()
      const tags = (p.tags || []).map(t => t.toLowerCase()).join(' ')
      const searchText = `${title} ${tags}`
      
      return keywords.every(keyword => searchText.includes(keyword.toLowerCase()))
    })
    
    if (found) {
      console.log(`  ✅ Encontrado: ${debugName} → ${found.title || found.name}`)
    } else {
      console.log(`  ❌ NÃO encontrado: ${debugName} (keywords: ${keywords.join(', ')})`)
    }
    
    return found
  }

  console.log('🔍 === BUSCANDO PRODUTOS ESPECÍFICOS === 🔍')

  // LISTA EXATA - APENAS ESTES 20 PRODUTOS
  const specificProducts = [
    // 1. Barcelona 25/26 Away (creme)
    findSpecificProduct(allProducts, ['barcelona', '25', 'away'], 'Barcelona 25/26 Away'),
    
    // 2. Barcelona 11/12 Away (preta)
    findSpecificProduct(allProducts, ['barcelona', '11', 'away'], 'Barcelona 11/12 Away'),
    
    // 3. Barcelona 13/14 Away (listras amarelo/vermelho)
    findSpecificProduct(allProducts, ['barcelona', '13', 'away'], 'Barcelona 13/14 Away'),
    
    // 4. Paris Saint Germain 18/19 v2
    findSpecificProduct(allProducts, ['psg', '18', '19'], 'PSG 18/19 v2')
    || findSpecificProduct(allProducts, ['paris', '18', '19'], 'Paris 18/19 v2'),
    
    // 5. AC Milan 07/08 Away (branca)
    findSpecificProduct(allProducts, ['milan', '07', 'away'], 'Milan 07/08 Away'),
    
    // 6. AC Milan 09/10 Home Long Sleeve
    findSpecificProduct(allProducts, ['milan', '09', 'home', 'long'], 'Milan 09/10 Home Long'),
    
    // 7. AC Milan 11/12 Away Long Sleeve
    findSpecificProduct(allProducts, ['milan', '11', 'away', 'long'], 'Milan 11/12 Away Long'),
    
    // 8. Barcelona 12/13 Home (gradient azul/vermelho)
    findSpecificProduct(allProducts, ['barcelona', '12', 'home'], 'Barcelona 12/13 Home'),
    
    // 9. AC Milan 06/07 Home Long Sleeve
    findSpecificProduct(allProducts, ['milan', '06', 'home', 'long'], 'Milan 06/07 Home Long'),
    
    // 10. Bayern Munich 25/26 Home
    findSpecificProduct(allProducts, ['bayern', '25', 'home'], 'Bayern 25/26 Home'),
    
    // 11. Barcelona 12/13 Home Long Sleeve
    findSpecificProduct(allProducts, ['barcelona', '12', 'home', 'long'], 'Barcelona 12/13 Home Long'),
    
    // 12. AC Milan 13/14 Home Long Sleeve
    findSpecificProduct(allProducts, ['milan', '13', 'home', 'long'], 'Milan 13/14 Home Long'),
    
    // 13. Barcelona 09/10 Home Long Sleeve
    findSpecificProduct(allProducts, ['barcelona', '09', 'home', 'long'], 'Barcelona 09/10 Home Long'),
    
    // 14. Real Madrid 25/26 Home
    findSpecificProduct(allProducts, ['real madrid', '25', 'home'], 'Real Madrid 25/26 Home')
    || findSpecificProduct(allProducts, ['madrid', '25', 'home'], 'Madrid 25/26 Home')
    || findSpecificProduct(allProducts, ['real madrid', '2025'], 'Real Madrid 2025'),
    
    // 15. Real Madrid Long Sleeve (qualquer modelo)
    findSpecificProduct(allProducts, ['real madrid', 'long sleeve'], 'Real Madrid Long Sleeve')
    || findSpecificProduct(allProducts, ['real madrid', 'manga longa'], 'Real Madrid Manga Longa')
    || findSpecificProduct(allProducts, ['madrid', 'long'], 'Madrid Long'),
    
    // 16. Argentina 1986 (copa do mundo)
    findSpecificProduct(allProducts, ['argentina', '1986'], 'Argentina 1986'),
    
    // 17. Argentina 2023 Away (preta)
    findSpecificProduct(allProducts, ['argentina', '2023', 'away'], 'Argentina 2023 Away'),
    
    // 18. PSG 17/18 Jordan (branca)
    findSpecificProduct(allProducts, ['psg', '17', 'jordan'], 'PSG 17/18 Jordan'),
    
    // 19. Arsenal Baseball 25/26 Home
    findSpecificProduct(allProducts, ['arsenal', 'baseball', '25'], 'Arsenal Baseball 25/26'),
    
    // 20. Manchester City 25/26 (modelo preto - alternativo)
    findSpecificProduct(allProducts, ['manchester city', '25', 'black'], 'Man City 25/26 Black')
    || findSpecificProduct(allProducts, ['manchester city', '25', 'away'], 'Man City 25/26 Away'),
    
  ].filter(Boolean) // Remove undefined

  console.log('\n🏆 === RESULTADO FINAL === 🏆')
  console.log('✅ Total encontrado:', specificProducts.length, 'de 20 solicitados')
  console.log('\n📋 Produtos selecionados:')
  specificProducts.forEach((p, i) => {
    console.log(`  ${i + 1}. ${p.title || p.name}`)
  })

  // IMPORTANTE: Retornar APENAS os produtos específicos (SEM preencher com outros)
  const finalBestSellers = specificProducts

  return <BestSellersClient products={finalBestSellers} />
}

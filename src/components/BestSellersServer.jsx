import { getCachedProducts } from '@/lib/productCache'
import BestSellersClient from './BestSellersClient'

/**
 * Server Component that fetches best sellers from Shopify
 * Busca produtos específicos da coleção "más vendidos" do Retrobox
 */
export default async function BestSellers() {
  // Buscar todos os produtos (com cache compartilhado)
  const allProducts = await getCachedProducts()

  // Função para buscar produto específico
  const findProduct = (keywords, debugName = '') => {
    const found = allProducts.find(p => {
      const title = (p.title || p.name || '').toLowerCase()
      return keywords.every(keyword => title.includes(keyword.toLowerCase()))
    })

    if (found) {
      console.log(`  ✅ ${debugName} → ${found.title || found.name}`)
    } else {
      console.log(`  ❌ NÃO encontrado: ${debugName}`)
    }

    return found
  }

  console.log('🔥 === BUSCANDO PRODUTOS MÁS VENDIDOS (RETROBOX) === 🔥')

  // Lista EXATA dos produtos da coleção "más vendidos" do Retrobox (em ordem)
  const bestSellersProducts = [
    // 1. AC Milan 11/12 Retro Away Long Sleeve
    findProduct(['milan', '11/12', 'away', 'long'], 'AC Milan 11/12 Away Long'),

    // 2. Argentina 1986 Retro Home Long Sleeve
    findProduct(['argentina', '1986', 'home', 'long'], 'Argentina 1986 Home Long')
    || findProduct(['argentina', '1986', 'long'], 'Argentina 1986 Long'),

    // 3. Real Madrid 17/18 Retro Away Long Sleeve
    findProduct(['real madrid', '17/18', 'away', 'long'], 'Real Madrid 17/18 Away Long')
    || findProduct(['madrid', '17/18', 'away', 'long'], 'Madrid 17/18 Away Long'),

    // 4. Argentina 2022 Retro Away Copa del Mundo
    findProduct(['argentina', '2022', 'away', 'copa'], 'Argentina 2022 Away Copa')
    || findProduct(['argentina', '2022', 'away'], 'Argentina 2022 Away'),

    // 5. PSG 18/19 Retro Away Long Sleeve
    findProduct(['psg', '18/19', 'away', 'long'], 'PSG 18/19 Away Long')
    || findProduct(['paris', '18/19', 'away', 'long'], 'Paris 18/19 Away Long'),

    // 6. Real Madrid 17/18 Retro Home Long Sleeve
    findProduct(['real madrid', '17/18', 'home', 'long'], 'Real Madrid 17/18 Home Long')
    || findProduct(['madrid', '17/18', 'home', 'long'], 'Madrid 17/18 Home Long'),

    // 7. Manchester United 2010 Retro Home Long Sleeve
    findProduct(['manchester united', '2010', 'home', 'long'], 'Man United 2010 Home Long')
    || findProduct(['manchester', '2010', 'home', 'long'], 'Manchester 2010 Home Long'),

    // 8. Real Madrid 14/15 Retro Away Long Sleeve
    findProduct(['real madrid', '14/15', 'away', 'long'], 'Real Madrid 14/15 Away Long')
    || findProduct(['madrid', '14/15', 'away', 'long'], 'Madrid 14/15 Away Long'),

    // 9. Portugal Retro Away Long Sleeve
    findProduct(['portugal', 'away', 'long'], 'Portugal Away Long'),

    // 10. Manchester United 07/08 Retro Long Sleeve
    findProduct(['manchester united', '07/08', 'long'], 'Man United 07/08 Long')
    || findProduct(['manchester', '07/08', 'long'], 'Manchester 07/08 Long'),

    // 11. Inter de Milán 97/98 Retro Third Long Sleeve
    findProduct(['inter', '97/98', 'long'], 'Inter 97/98 Long')
    || findProduct(['inter', 'milan', '97', 'long'], 'Inter Milan 97 Long'),

    // 12. Chelsea 25/26 Retro Third Long Sleeve
    findProduct(['chelsea', '25/26', 'third', 'long'], 'Chelsea 25/26 Third Long')
    || findProduct(['chelsea', '25', 'third', 'long'], 'Chelsea 25 Third Long'),

    // 13. Chelsea 11/12 Retro Home Long Sleeve Champions League
    findProduct(['chelsea', '11/12', 'home', 'long'], 'Chelsea 11/12 Home Long')
    || findProduct(['chelsea', '11/12', 'long'], 'Chelsea 11/12 Long'),

    // 14. Barcelona 10/11 Retro Home Long Sleeve Champions League
    findProduct(['barcelona', '10/11', 'home', 'long'], 'Barcelona 10/11 Home Long')
    || findProduct(['barcelona', '10/11', 'long'], 'Barcelona 10/11 Long'),

    // 15. Barcelona 05/06 Retro Home Long Sleeve
    findProduct(['barcelona', '05/06', 'home', 'long'], 'Barcelona 05/06 Home Long')
    || findProduct(['barcelona', '05/06', 'long'], 'Barcelona 05/06 Long'),

  ].filter(Boolean) // Remove undefined

  console.log(`\n✅ Total encontrado: ${bestSellersProducts.length} de 15 produtos`)

  // Se não encontrou todos, completar com outros produtos manga longa
  if (bestSellersProducts.length < 15) {
    console.log('\n📦 Completando com outros produtos manga longa...')

    const longSleeveProducts = allProducts.filter(p => {
      const title = (p.title || p.name || '').toLowerCase()
      const alreadyIncluded = bestSellersProducts.some(bp => bp.id === p.id)
      return !alreadyIncluded && (title.includes('long sleeve') || title.includes('manga longa'))
    })

    const remaining = 15 - bestSellersProducts.length
    bestSellersProducts.push(...longSleeveProducts.slice(0, remaining))
  }

  console.log('\n📋 Produtos finais para o carrossel:')
  bestSellersProducts.forEach((p, i) => {
    console.log(`  ${i + 1}. ${p.title || p.name}`)
  })

  return <BestSellersClient products={bestSellersProducts} />
}

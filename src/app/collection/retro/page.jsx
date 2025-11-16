import { getAllProducts } from '@/utils/shopifyData'
import RetroContent from './RetroContent'

export const metadata = {
  title: 'Retro Collection - Jerseys Vintage | Foltz Fanwear',
  description: 'Camisetas retro y vintage de los mejores equipos. Ediciones clásicas de los 70s, 80s, 90s y 2000s.',
}

export default async function RetroPage() {
  // Buscar todos os produtos
  const allProducts = await getAllProducts()
  
  // Filtrar produtos retro
  const retroProducts = allProducts.filter(p => {
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

  console.log('📼 Retro Collection: encontrados', retroProducts.length, 'produtos')

  return <RetroContent products={retroProducts} />
}









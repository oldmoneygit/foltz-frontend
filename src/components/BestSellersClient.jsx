'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import ProductCard from './ProductCard'

const BestSellers = ({ products = [] }) => {
  // Show loading or fallback if no products
  if (!products || products.length === 0) {
    return null
  }

  console.log('🎯 Best Sellers Client recebeu:', products.length, 'produtos')

  // Mostrar produtos na ordem recebida (já vêm ordenados do Server)
  const displayProducts = products.slice(0, 20) // Limite 20 produtos

  // Função antiga removida - agora apenas mostra na ordem recebida
  const organizeProducts_OLD = (allProducts) => {
    console.log('🔍 Total produtos recebidos:', allProducts.length)
    
    // Identificar produtos por time/tipo (usando TITLE)
    const argentineProducts = allProducts.filter(p => {
      const title = (p.title || p.name || '').toLowerCase()
      const tags = p.tags?.map(t => t.toLowerCase()).join(' ') || ''
      const league = p.league?.name?.toLowerCase() || ''
      const searchText = `${title} ${tags} ${league}`
      return searchText.includes('argentina') || searchText.includes('albiceleste')
    })
    
    const realMadridProducts = allProducts.filter(p => {
      const title = (p.title || p.name || '').toLowerCase()
      const tags = p.tags?.map(t => t.toLowerCase()).join(' ') || ''
      const searchText = `${title} ${tags}`
      return searchText.includes('real madrid') || (searchText.includes('madrid') && !searchText.includes('atletico'))
    })
    
    const bocaProducts = allProducts.filter(p => {
      const title = (p.title || p.name || '').toLowerCase()
      const tags = p.tags?.map(t => t.toLowerCase()).join(' ') || ''
      const searchText = `${title} ${tags}`
      return searchText.includes('boca')
    })
    
    console.log('🇦🇷 Argentina encontrados:', argentineProducts.length, argentineProducts.map(p => p.title || p.name))
    console.log('⚪ Real Madrid encontrados:', realMadridProducts.length, realMadridProducts.map(p => p.title || p.name))
    console.log('💙 Boca encontrados:', bocaProducts.length, bocaProducts.map(p => p.title || p.name))
    
    const otherProducts = allProducts.filter(p => {
      const title = (p.title || p.name || '').toLowerCase()
      const tags = p.tags?.map(t => t.toLowerCase()).join(' ') || ''
      const text = `${title} ${tags}`
      return !text.includes('argentina') && 
             !text.includes('real madrid') && 
             !text.includes('boca')
    })
    
    // Função para separar jersey normal vs manga longa
    const separateByType = (prods) => {
      const jerseys = prods.filter(p => {
        const title = (p.title || p.name || '').toLowerCase()
        const tags = p.tags?.map(t => t.toLowerCase()).join(' ') || ''
        return !title.includes('manga') && !tags.includes('manga longa') && !tags.includes('long sleeve')
      })
      
      const longSleeve = prods.filter(p => {
        const title = (p.title || p.name || '').toLowerCase()
        const tags = p.tags?.map(t => t.toLowerCase()).join(' ') || ''
        return title.includes('manga') || tags.includes('manga longa') || tags.includes('long sleeve')
      })
      
      return { jerseys, longSleeve }
    }
    
    // Separar cada grupo
    const argentina = separateByType(argentineProducts)
    const realMadrid = separateByType(realMadridProducts)
    const boca = separateByType(bocaProducts)
    const others = separateByType(otherProducts)
    
    console.log('🔄 Separados por tipo:')
    console.log('  🇦🇷 Argentina jerseys:', argentina.jerseys.length, '| manga longa:', argentina.longSleeve.length)
    console.log('  ⚪ Real Madrid jerseys:', realMadrid.jerseys.length, '| manga longa:', realMadrid.longSleeve.length)
    console.log('  💙 Boca jerseys:', boca.jerseys.length, '| manga longa:', boca.longSleeve.length)
    
    // Montar array final alternando jersey e manga longa
    const finalProducts = []
    
    // Adicionar Argentina (2 jerseys, 2 manga longa se tiver)
    if (argentina.jerseys[0]) finalProducts.push(argentina.jerseys[0])
    if (argentina.longSleeve[0]) finalProducts.push(argentina.longSleeve[0])
    if (argentina.jerseys[1]) finalProducts.push(argentina.jerseys[1])
    if (argentina.longSleeve[1]) finalProducts.push(argentina.longSleeve[1])
    
    // Adicionar Real Madrid (2 jerseys, 2 manga longa se tiver)
    if (realMadrid.jerseys[0]) finalProducts.push(realMadrid.jerseys[0])
    if (realMadrid.longSleeve[0]) finalProducts.push(realMadrid.longSleeve[0])
    if (realMadrid.jerseys[1]) finalProducts.push(realMadrid.jerseys[1])
    if (realMadrid.longSleeve[1]) finalProducts.push(realMadrid.longSleeve[1])
    
    // Adicionar Boca (2 jerseys, 2 manga longa se tiver)
    if (boca.jerseys[0]) finalProducts.push(boca.jerseys[0])
    if (boca.longSleeve[0]) finalProducts.push(boca.longSleeve[0])
    if (boca.jerseys[1]) finalProducts.push(boca.jerseys[1])
    if (boca.longSleeve[1]) finalProducts.push(boca.longSleeve[1])
    
    // Preencher restante alternando jersey e manga longa de outros times
    let jerseyIndex = 0
    let longSleeveIndex = 0
    let useJersey = true
    
    while (finalProducts.length < 15) {
      if (useJersey && jerseyIndex < others.jerseys.length) {
        finalProducts.push(others.jerseys[jerseyIndex])
        jerseyIndex++
      } else if (!useJersey && longSleeveIndex < others.longSleeve.length) {
        finalProducts.push(others.longSleeve[longSleeveIndex])
        longSleeveIndex++
      } else if (jerseyIndex < others.jerseys.length) {
        finalProducts.push(others.jerseys[jerseyIndex])
        jerseyIndex++
      } else if (longSleeveIndex < others.longSleeve.length) {
        finalProducts.push(others.longSleeve[longSleeveIndex])
        longSleeveIndex++
      } else {
        break // Não tem mais produtos
      }
      useJersey = !useJersey
    }
    
    const result = finalProducts.slice(0, 15)
    
    console.log('✅ === ORDEM FINAL (15 produtos) === ✅')
    result.forEach((p, i) => {
      const type = (p.title || p.name || '').includes('manga') || (p.title || p.name || '').toLowerCase().includes('long') ? '📏 Manga Longa' : '👕 Jersey'
      console.log(`${i + 1}. ${type}: ${p.title || p.name}`)
    })
    
    return result
  }
  
  // displayProducts já definido acima (linha 16)

  return (
    <section id="bestsellers" className="py-20 bg-gradient-to-b from-black via-zinc-950 to-black relative">
      {/* Subtle radial gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900/10 via-transparent to-transparent pointer-events-none" />
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -100px 0px" }}
          transition={{ duration: 0.3 }}
          className="text-center mb-12"
        >
          <span className="text-brand-yellow text-sm font-black uppercase tracking-[0.3em] mb-2 block">
            Lo Más Vendido
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            NUESTROS <span className="text-brand-yellow">BEST SELLERS</span>
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Los jerseys favoritos de nuestros clientes. Réplicas 1:1 Premium y envío rápido.
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
          {displayProducts.map((product, index) => (
            <motion.div
              key={product.id || product.handle}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -100px 0px" }}
              transition={{ duration: 0.2, delay: Math.min(index * 0.02, 0.3) }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "0px 0px -100px 0px" }}
          transition={{ duration: 0.3 }}
          className="text-center mt-12"
        >
          <Link
            href="/collection/bestsellers"
            className="inline-block px-8 py-4 bg-brand-yellow text-brand-navy font-black uppercase tracking-wide text-sm rounded-full hover:bg-brand-navy hover:text-brand-yellow transition-colors duration-300"
          >
            Ver Todos los Best Sellers
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default BestSellers

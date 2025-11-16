const { getAllProducts } = require('../src/lib/shopify.js')

async function checkArgentinaTags() {
  console.log('🔍 Buscando produtos com "Argentina" nas tags...\n')

  try {
    const response = await getAllProducts(250)

    if (!response || !response.edges) {
      console.log('❌ Nenhum produto encontrado')
      return
    }

    const argentinaProducts = response.edges.filter(edge => {
      const product = edge.node
      const title = product.title?.toLowerCase() || ''
      const tags = product.tags || []
      const productType = product.productType?.toLowerCase() || ''

      return title.includes('argentina') ||
             tags.some(tag => tag.toLowerCase().includes('argentina')) ||
             tags.some(tag => tag.toLowerCase().includes('legend')) ||
             productType.includes('argentina')
    })

    console.log(`✅ Encontrados ${argentinaProducts.length} produtos relacionados a Argentina:\n`)

    argentinaProducts.forEach(edge => {
      const product = edge.node
      console.log(`📦 ${product.title}`)
      console.log(`   Handle: ${product.handle}`)
      console.log(`   Product Type: ${product.productType || 'N/A'}`)
      console.log(`   Tags: ${product.tags.join(', ') || 'N/A'}`)
      console.log('')
    })

    // Mostrar todas as tags únicas
    const allTags = new Set()
    argentinaProducts.forEach(edge => {
      edge.node.tags.forEach(tag => allTags.add(tag))
    })

    console.log('📋 Tags únicas encontradas:')
    Array.from(allTags).sort().forEach(tag => {
      console.log(`   - ${tag}`)
    })

  } catch (error) {
    console.error('❌ Erro ao buscar produtos:', error)
  }
}

checkArgentinaTags()

const {
  getProductByHandle,
  updateProductPrice,
  bulkUpdatePrices,
  buildGid
} = require('../src/lib/shopifyAdmin.js')

async function main() {
  const args = process.argv.slice(2)

  if (args.length === 0) {
    console.log('\n🛍️  FOLTZ - Atualizar Preços\n')
    console.log('Uso:')
    console.log('  npm run update-price <handle> <novo-preço> [preço-comparativo]\n')
    console.log('Exemplo:')
    console.log('  npm run update-price barcelona-09-10-home-size-s-xxl 85000 120000\n')
    console.log('Atualização em massa:')
    console.log('  npm run update-price bulk <novo-preço> [preço-comparativo]')
    console.log('  (Atualiza TODOS os produtos com o mesmo preço)\n')
    process.exit(0)
  }

  try {
    if (args[0] === 'bulk') {
      // Atualização em massa
      const newPrice = parseFloat(args[1])
      const newCompareAt = args[2] ? parseFloat(args[2]) : null

      if (isNaN(newPrice)) {
        console.error('❌ Erro: Preço inválido!')
        process.exit(1)
      }

      console.log('\n⚠️  ATENÇÃO: Você está prestes a atualizar o preço de TODOS os produtos!')
      console.log(`   Novo preço: ARS ${newPrice.toFixed(2)}`)
      if (newCompareAt) {
        console.log(`   Preço comparativo: ARS ${newCompareAt.toFixed(2)}`)
      }
      console.log('\n⏳ Buscando produtos...\n')

      const { listAllProducts } = require('../src/lib/shopifyAdmin.js')
      const products = await listAllProducts()

      const updates = products.map(product => ({
        productId: product.id,
        price: newPrice,
        compareAtPrice: newCompareAt
      }))

      console.log(`📦 ${products.length} produtos encontrados`)
      console.log('⏳ Atualizando preços...\n')

      await bulkUpdatePrices(updates)

      console.log(`✅ Preços de ${products.length} produtos atualizados com sucesso!`)

    } else {
      // Atualização individual
      const handle = args[0]
      const newPrice = parseFloat(args[1])
      const newCompareAt = args[2] ? parseFloat(args[2]) : null

      if (isNaN(newPrice)) {
        console.error('❌ Erro: Preço inválido!')
        process.exit(1)
      }

      console.log('\n⏳ Buscando produto...')
      const product = await getProductByHandle(handle)

      if (!product) {
        console.error(`❌ Erro: Produto "${handle}" não encontrado!`)
        process.exit(1)
      }

      console.log(`✅ Produto encontrado: ${product.title}`)
      console.log('⏳ Atualizando preço...\n')

      await updateProductPrice(product.id, newPrice, newCompareAt)

      console.log('✅ Preço atualizado com sucesso!')
      console.log(`   Produto: ${product.title}`)
      console.log(`   Novo preço: ARS ${newPrice.toFixed(2)}`)
      if (newCompareAt) {
        console.log(`   Preço comparativo: ARS ${newCompareAt.toFixed(2)}`)
      }
    }

  } catch (error) {
    console.error('\n❌ Erro:', error.message)
    if (error.message.includes('Shopify API Error')) {
      console.error('\n💡 Dica: Verifique se o SHOPIFY_ADMIN_ACCESS_TOKEN está configurado corretamente no .env.local')
    }
    process.exit(1)
  }
}

main()

/**
 * Script para atualizar preços comparados no Shopify
 * Atualiza todos os produtos para terem preço comparado = preço * 1.5
 * 
 * Uso:
 *   node scripts/update-compare-prices-shopify.js
 */

const { listAllProducts, updateProductPrice } = require('../src/lib/shopifyAdmin.js')

async function updateAllComparePrices() {
  console.log('\n' + '='.repeat(70))
  console.log('🏷️  ATUALIZAÇÃO DE PREÇOS COMPARADOS NO SHOPIFY')
  console.log('='.repeat(70))
  console.log('\n📌 Nova regra: Preço Comparado = Preço Promocional × 1.5')
  console.log('   (50% mais caro que o preço promocional)\n')

  try {
    console.log('⏳ Buscando produtos no Shopify...\n')
    const products = await listAllProducts()

    if (!products || products.length === 0) {
      console.log('⚠️  Nenhum produto encontrado no Shopify.')
      return
    }

    console.log(`✅ ${products.length} produtos encontrados\n`)
    console.log('─'.repeat(70))

    let updatedCount = 0
    let skippedCount = 0
    let errorCount = 0

    for (const product of products) {
      try {
        // Pegar o preço da primeira variante
        if (!product.variants || product.variants.length === 0) {
          console.log(`⚠️  Produto ${product.title}: sem variantes, pulando...`)
          skippedCount++
          continue
        }

        const firstVariant = product.variants[0]
        const currentPrice = parseFloat(firstVariant.price)

        if (isNaN(currentPrice)) {
          console.log(`⚠️  Produto ${product.title}: preço inválido, pulando...`)
          skippedCount++
          continue
        }

        // Calcular novo preço comparado (50% mais caro)
        const newCompareAtPrice = currentPrice * 1.5

        // Mostrar apenas os primeiros 5 para não poluir o log
        if (updatedCount < 5) {
          console.log(`\n📦 Produto: ${product.title}`)
          console.log(`   Preço atual: ARS ${currentPrice.toFixed(2)}`)
          console.log(`   Novo preço comparado: ARS ${newCompareAtPrice.toFixed(2)}`)
        }

        // Atualizar o produto
        await updateProductPrice(product.id, currentPrice, newCompareAtPrice)
        updatedCount++

        // Mostrar progresso a cada 10 produtos
        if (updatedCount % 10 === 0) {
          console.log(`\n⏳ Progresso: ${updatedCount}/${products.length} produtos atualizados...`)
        }

        // Aguardar um pouco para não sobrecarregar a API do Shopify
        await new Promise(resolve => setTimeout(resolve, 500))

      } catch (error) {
        console.error(`\n❌ Erro ao atualizar ${product.title}:`, error.message)
        errorCount++
      }
    }

    console.log('\n' + '='.repeat(70))
    console.log('✨ ATUALIZAÇÃO CONCLUÍDA!')
    console.log('='.repeat(70))
    console.log(`\n📊 Estatísticas:`)
    console.log(`   ✅ Produtos atualizados: ${updatedCount}`)
    console.log(`   ⚠️  Produtos pulados: ${skippedCount}`)
    console.log(`   ❌ Erros: ${errorCount}`)
    console.log(`   📦 Total processado: ${products.length}`)
    console.log()

    if (updatedCount > 0) {
      console.log('🎉 Os preços comparados foram atualizados com sucesso!')
      console.log('💡 Verifique alguns produtos no Shopify Admin para confirmar.')
    }

  } catch (error) {
    console.error('\n❌ Erro ao buscar produtos:', error.message)
    
    if (error.message.includes('Shopify API Error') || 
        error.message.includes('SHOPIFY_ADMIN_ACCESS_TOKEN')) {
      console.error('\n💡 Dica: Verifique se o SHOPIFY_ADMIN_ACCESS_TOKEN está')
      console.error('   configurado corretamente no arquivo .env.local')
      console.error('\n   O token deve ter as seguintes permissões:')
      console.error('   - read_products')
      console.error('   - write_products')
    }
    
    process.exit(1)
  }
}

// Confirmar antes de executar
console.log('\n⚠️  ATENÇÃO: Este script irá atualizar TODOS os produtos no Shopify!')
console.log('\n   Esta operação irá:')
console.log('   1. Buscar todos os produtos da loja')
console.log('   2. Calcular preço comparado = preço atual × 1.5')
console.log('   3. Atualizar cada produto via API do Shopify')
console.log('\n   Certifique-se de que:')
console.log('   - O arquivo .env.local está configurado')
console.log('   - O token tem permissões read_products e write_products')
console.log('   - Você tem um backup dos dados (recomendado)')

if (process.argv.includes('--confirm')) {
  updateAllComparePrices()
} else {
  console.log('\n❓ Para executar, use:')
  console.log('   node scripts/update-compare-prices-shopify.js --confirm')
  console.log()
}


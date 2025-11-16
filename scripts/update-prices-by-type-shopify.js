/**
 * Script para atualizar preços no Shopify por tipo de produto
 * - Jerseys normais: ARS 35.900 (comparado: ARS 53.850)
 * - Manga longa: ARS 39.900 (comparado: ARS 59.850)
 * 
 * Uso:
 *   node scripts/update-prices-by-type-shopify.js --confirm
 */

const { listAllProducts, updateProductPrice } = require('../src/lib/shopifyAdmin.js')

// Novos preços
const JERSEY_PRICE = 35900.00
const JERSEY_COMPARE_PRICE = JERSEY_PRICE * 1.5 // 53850.00

const LONG_SLEEVE_PRICE = 39900.00
const LONG_SLEEVE_COMPARE_PRICE = LONG_SLEEVE_PRICE * 1.5 // 59850.00

function isLongSleeveProduct(product) {
  // Verificar se é manga longa pelo tipo ou título
  const productType = product.productType || ''
  const title = product.title || ''
  
  return productType.toLowerCase().includes('manga longa') ||
         productType.toLowerCase().includes('long sleeve') ||
         title.toLowerCase().includes('long sleeve')
}

async function updateAllPricesByType() {
  console.log('\n' + '='.repeat(70))
  console.log('🏷️  ATUALIZAÇÃO DE PREÇOS NO SHOPIFY POR TIPO')
  console.log('='.repeat(70))
  console.log('\n📌 Novos preços:')
  console.log(`   👕 Jerseys: ARS ${JERSEY_PRICE.toLocaleString('pt-BR')}`)
  console.log(`      Comparado: ARS ${JERSEY_COMPARE_PRICE.toLocaleString('pt-BR')}`)
  console.log(`   👔 Manga Longa: ARS ${LONG_SLEEVE_PRICE.toLocaleString('pt-BR')}`)
  console.log(`      Comparado: ARS ${LONG_SLEEVE_COMPARE_PRICE.toLocaleString('pt-BR')}\n`)

  try {
    console.log('⏳ Buscando produtos no Shopify...\n')
    const products = await listAllProducts()

    if (!products || products.length === 0) {
      console.log('⚠️  Nenhum produto encontrado no Shopify.')
      return
    }

    console.log(`✅ ${products.length} produtos encontrados\n`)
    console.log('─'.repeat(70))

    let jerseyCount = 0
    let longSleeveCount = 0
    let skippedCount = 0
    let errorCount = 0

    for (const product of products) {
      try {
        // Verificar se tem variantes
        if (!product.variants || product.variants.length === 0) {
          console.log(`⚠️  Produto ${product.title}: sem variantes, pulando...`)
          skippedCount++
          continue
        }

        // Determinar tipo e preço apropriado
        const isLongSleeve = isLongSleeveProduct(product)
        const newPrice = isLongSleeve ? LONG_SLEEVE_PRICE : JERSEY_PRICE
        const newCompareAtPrice = isLongSleeve ? LONG_SLEEVE_COMPARE_PRICE : JERSEY_COMPARE_PRICE

        // Mostrar apenas os primeiros de cada tipo
        if (isLongSleeve && longSleeveCount < 3) {
          console.log(`\n👔 Manga Longa: ${product.title}`)
          console.log(`   Novo preço: ARS ${newPrice.toLocaleString('pt-BR')}`)
          console.log(`   Novo comparado: ARS ${newCompareAtPrice.toLocaleString('pt-BR')}`)
        } else if (!isLongSleeve && jerseyCount < 3) {
          console.log(`\n👕 Jersey: ${product.title}`)
          console.log(`   Novo preço: ARS ${newPrice.toLocaleString('pt-BR')}`)
          console.log(`   Novo comparado: ARS ${newCompareAtPrice.toLocaleString('pt-BR')}`)
        }

        // Atualizar o produto
        await updateProductPrice(product.id, newPrice, newCompareAtPrice)
        
        if (isLongSleeve) {
          longSleeveCount++
        } else {
          jerseyCount++
        }

        // Mostrar progresso a cada 10 produtos
        const totalUpdated = jerseyCount + longSleeveCount
        if (totalUpdated % 10 === 0) {
          console.log(`\n⏳ Progresso: ${totalUpdated}/${products.length} produtos atualizados...`)
          console.log(`   (👕 ${jerseyCount} jerseys, 👔 ${longSleeveCount} manga longa)`)
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
    console.log(`   👕 Jerseys atualizados: ${jerseyCount}`)
    console.log(`   👔 Manga longa atualizados: ${longSleeveCount}`)
    console.log(`   ⚠️  Produtos pulados: ${skippedCount}`)
    console.log(`   ❌ Erros: ${errorCount}`)
    console.log(`   📦 Total processado: ${products.length}`)
    console.log()

    console.log('💰 Resumo dos preços:')
    console.log(`   👕 Jerseys: ARS ${JERSEY_PRICE.toLocaleString('pt-BR')} → comparado: ARS ${JERSEY_COMPARE_PRICE.toLocaleString('pt-BR')}`)
    console.log(`   👔 Manga Longa: ARS ${LONG_SLEEVE_PRICE.toLocaleString('pt-BR')} → comparado: ARS ${LONG_SLEEVE_COMPARE_PRICE.toLocaleString('pt-BR')}`)
    console.log()

    if (jerseyCount + longSleeveCount > 0) {
      console.log('🎉 Os preços foram atualizados com sucesso!')
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
console.log('   2. Identificar jerseys vs manga longa')
console.log('   3. Aplicar preços diferenciados:')
console.log(`      - Jerseys: ARS ${JERSEY_PRICE.toLocaleString('pt-BR')}`)
console.log(`      - Manga Longa: ARS ${LONG_SLEEVE_PRICE.toLocaleString('pt-BR')}`)
console.log('   4. Atualizar cada produto via API do Shopify')
console.log('\n   Certifique-se de que:')
console.log('   - O arquivo .env.local está configurado')
console.log('   - O token tem permissões read_products e write_products')
console.log('   - Você tem um backup dos dados (recomendado)')

if (process.argv.includes('--confirm')) {
  updateAllPricesByType()
} else {
  console.log('\n❓ Para executar, use:')
  console.log('   node scripts/update-prices-by-type-shopify.js --confirm')
  console.log('\n   Ou use o comando NPM:')
  console.log('   npm run update-prices-by-type -- --confirm')
  console.log()
}


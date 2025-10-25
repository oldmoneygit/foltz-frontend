import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import {
  getProductByHandle,
  addProductImage
} from '../src/lib/shopifyAdmin.js'

// Obter __dirname em ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Ler dados das ligas
const leaguesData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../leagues_data.json'), 'utf-8')
)

console.log('📸 SHOPIFY IMAGE UPLOADER - COMPLETO\n')
console.log('Este script faz upload de TODAS as imagens para TODOS os produtos.\n')

async function uploadImages() {
  let successCount = 0
  let errorCount = 0
  let totalProducts = 0
  let processedProducts = 0

  console.log('🔍 Contando produtos...')

  // Contar total de produtos
  for (const leagueId of Object.keys(leaguesData)) {
    const league = leaguesData[leagueId]
    if (league.products) {
      totalProducts += league.products.length
    }
  }

  console.log(`✅ Total de produtos a processar: ${totalProducts}\n`)
  console.log('⚠️  Este processo pode demorar 2-3 horas.')
  console.log('💡 Você pode deixar rodando em background.\n')

  const startTime = Date.now()

  // Processar cada liga
  for (const leagueId of Object.keys(leaguesData)) {
    const league = leaguesData[leagueId]

    if (!league.products || !Array.isArray(league.products)) continue

    console.log(`\n📁 Liga: ${league.name} (${league.products.length} produtos)`)
    console.log('─'.repeat(60))

    for (const product of league.products) {
      processedProducts++
      const progress = `[${processedProducts}/${totalProducts}]`

      console.log(`\n${progress} 📦 ${product.name}`)
      console.log(`   Handle: ${product.id}`)

      try {
        // Buscar produto na Shopify
        console.log('   🔍 Buscando na Shopify...')
        const shopifyProduct = await getProductByHandle(product.id)

        if (!shopifyProduct) {
          console.log('   ⚠️  Produto não encontrado - pulando')
          errorCount++
          continue
        }

        console.log(`   ✅ Encontrado!`)

        const images = product.images || []
        console.log(`   📸 Imagens: ${images.length}`)

        if (images.length === 0) {
          console.log('   ⚠️  Sem imagens - pulando')
          continue
        }

        // Fazer upload de cada imagem
        for (let i = 0; i < images.length; i++) {
          const imagePath = images[i]
          const fullPath = path.resolve(__dirname, '..', imagePath)

          // Verificar se imagem existe
          if (!fs.existsSync(fullPath)) {
            console.log(`   ⚠️  ${i + 1}/${images.length}: Não encontrada - ${path.basename(imagePath)}`)
            continue
          }

          console.log(`   ⏳ ${i + 1}/${images.length}: ${path.basename(imagePath)}`)

          try {
            // Ler imagem como base64
            const imageBuffer = fs.readFileSync(fullPath)
            const base64Image = imageBuffer.toString('base64')
            const mimeType = imagePath.endsWith('.png') ? 'image/png' :
                            imagePath.endsWith('.webp') ? 'image/webp' : 'image/jpeg'

            // Criar data URI
            const imageDataUri = `data:${mimeType};base64,${base64Image}`

            // Fazer upload via Admin API
            const result = await addProductImage(
              shopifyProduct.id,
              imageDataUri,
              `${product.name} - ${i + 1}`
            )

            if (result.userErrors && result.userErrors.length > 0) {
              console.log(`   ❌ Erro:`, result.userErrors[0].message)
              errorCount++
            } else {
              successCount++
            }

            // Aguardar 500ms entre uploads (rate limit da Shopify)
            await new Promise(resolve => setTimeout(resolve, 500))

          } catch (imgError) {
            console.log(`   ❌ Erro no upload: ${imgError.message}`)
            errorCount++
          }
        }

        console.log(`   ✅ Produto concluído!`)

        // Mostrar tempo estimado restante
        const elapsed = Date.now() - startTime
        const avgTimePerProduct = elapsed / processedProducts
        const remaining = totalProducts - processedProducts
        const estimatedRemaining = (avgTimePerProduct * remaining) / 1000 / 60 // minutos

        if (processedProducts % 10 === 0) {
          console.log(`\n⏱️  Progresso: ${processedProducts}/${totalProducts} produtos`)
          console.log(`   Tempo estimado restante: ${Math.ceil(estimatedRemaining)} minutos`)
        }

      } catch (error) {
        console.log(`   ❌ Erro: ${error.message}`)
        errorCount++
      }
    }
  }

  const totalTime = ((Date.now() - startTime) / 1000 / 60).toFixed(1)

  console.log('\n' + '='.repeat(60))
  console.log('📊 RESUMO FINAL')
  console.log('='.repeat(60))
  console.log(`✅ Imagens enviadas com sucesso: ${successCount}`)
  console.log(`❌ Erros: ${errorCount}`)
  console.log(`📦 Produtos processados: ${processedProducts}/${totalProducts}`)
  console.log(`⏱️  Tempo total: ${totalTime} minutos`)
  console.log('='.repeat(60))

  if (successCount > 0) {
    console.log('\n🎉 Upload concluído!')
    console.log('🌐 Todas as imagens estão no Shopify CDN')
    console.log('📱 Acesse Shopify Admin para verificar')
  }

  if (errorCount > 0) {
    console.log(`\n⚠️  ${errorCount} uploads falharam`)
    console.log('💡 Você pode rodar o script novamente para tentar os que falharam')
  }
}

// Executar
uploadImages().catch(error => {
  console.error('\n❌ Erro fatal:', error.message)
  process.exit(1)
})

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { getProductByHandle, addProductImage } from '../src/lib/shopifyAdmin.js'

// Obter __dirname em ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log('🔄 RETRY - UPLOAD DE IMAGENS FALTANDO\n')

// Verificar se existe o arquivo de imagens faltando
const missingImagesPath = path.join(__dirname, 'missing-images.json')

if (!fs.existsSync(missingImagesPath)) {
  console.log('❌ Arquivo missing-images.json não encontrado!')
  console.log('💡 Execute primeiro: npm run check-missing-images')
  process.exit(1)
}

const productsWithMissingImages = JSON.parse(
  fs.readFileSync(missingImagesPath, 'utf-8')
)

console.log(`📦 Produtos com imagens faltando: ${productsWithMissingImages.length}\n`)

async function retryFailedImages() {
  let successCount = 0
  let errorCount = 0
  let processedProducts = 0
  const totalProducts = productsWithMissingImages.length

  const startTime = Date.now()

  for (const productData of productsWithMissingImages) {
    processedProducts++
    const progress = `[${processedProducts}/${totalProducts}]`

    console.log(`\n${progress} 📦 ${productData.name}`)
    console.log(`   Handle: ${productData.handle}`)
    console.log(`   Imagens faltando: ${productData.missing}`)

    try {
      // Buscar produto na Shopify
      console.log('   🔍 Buscando na Shopify...')
      const shopifyProduct = await getProductByHandle(productData.handle)

      if (!shopifyProduct) {
        console.log('   ⚠️  Produto não encontrado - pulando')
        errorCount++
        continue
      }

      console.log(`   ✅ Encontrado!`)

      // Obter imagens que já existem
      const existingImagesCount = shopifyProduct.images ? shopifyProduct.images.length : 0
      console.log(`   📸 Imagens atuais: ${existingImagesCount}`)

      // Fazer upload apenas das imagens que faltam
      const images = productData.images || []
      const imagesToUpload = images.slice(existingImagesCount)

      console.log(`   📤 Fazendo upload de ${imagesToUpload.length} imagens...`)

      for (let i = 0; i < imagesToUpload.length; i++) {
        const imagePath = imagesToUpload[i]
        const fullPath = path.resolve(__dirname, '..', imagePath)

        // Verificar se imagem existe
        if (!fs.existsSync(fullPath)) {
          console.log(`   ⚠️  ${i + 1}/${imagesToUpload.length}: Arquivo não encontrado - ${path.basename(imagePath)}`)
          errorCount++
          continue
        }

        console.log(`   ⏳ ${i + 1}/${imagesToUpload.length}: ${path.basename(imagePath)}`)

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
            `${productData.name} - ${existingImagesCount + i + 1}`
          )

          if (result.userErrors && result.userErrors.length > 0) {
            console.log(`   ❌ Erro:`, result.userErrors[0].message)
            errorCount++
          } else {
            console.log(`   ✅ Sucesso!`)
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

    } catch (error) {
      console.log(`   ❌ Erro: ${error.message}`)
      errorCount++
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

  if (errorCount === 0) {
    console.log('\n🎉 Todas as imagens foram enviadas com sucesso!')
    console.log('💡 Você pode deletar o arquivo missing-images.json')
  } else {
    console.log(`\n⚠️  ${errorCount} uploads ainda falharam`)
    console.log('💡 Execute npm run check-missing-images para verificar novamente')
  }
}

// Executar
retryFailedImages().catch(error => {
  console.error('\n❌ Erro fatal:', error.message)
  process.exit(1)
})

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

console.log('📸 SHOPIFY IMAGE UPLOADER - TESTE (5 produtos)\n')
console.log('Este script faz upload das imagens para os produtos já importados na Shopify.\n')

const TEST_PRODUCTS = [
  'bayern-07-08-home-size-s-xxl',
  'bayern-munich-14-15-home-size-s-xxl',
  'bayern-munich-17-18-home-size-s-xxl',
  'bayern-munich-25-26-away-size-s-4xl',
  'bayern-munich-25-26-home-size-s-4xl'
]

async function uploadImages() {
  let successCount = 0
  let errorCount = 0

  console.log('🔍 Buscando produtos no leagues_data.json...\n')

  // Encontrar produtos no JSON
  const productsToUpload = []

  for (const leagueId of Object.keys(leaguesData)) {
    const league = leaguesData[leagueId]
    if (!league.products) continue

    for (const product of league.products) {
      if (TEST_PRODUCTS.includes(product.id)) {
        productsToUpload.push({
          handle: product.id,
          name: product.name,
          images: product.images || []
        })
      }
    }
  }

  console.log(`✅ Encontrados ${productsToUpload.length} produtos para upload\n`)

  for (const productData of productsToUpload) {
    console.log(`📦 Processando: ${productData.name}`)
    console.log(`   Handle: ${productData.handle}`)

    try {
      // Buscar produto na Shopify
      console.log('   🔍 Buscando produto na Shopify...')
      const shopifyProduct = await getProductByHandle(productData.handle)

      if (!shopifyProduct) {
        console.log('   ❌ Produto não encontrado na Shopify!')
        console.log('   💡 Certifique-se de importar o CSV primeiro\n')
        errorCount++
        continue
      }

      console.log(`   ✅ Produto encontrado! ID: ${shopifyProduct.id}`)
      console.log(`   📸 Imagens a fazer upload: ${productData.images.length}`)

      // Fazer upload de cada imagem
      for (let i = 0; i < productData.images.length; i++) {
        const imagePath = productData.images[i]
        const fullPath = path.resolve(__dirname, '..', imagePath)

        // Verificar se imagem existe
        if (!fs.existsSync(fullPath)) {
          console.log(`   ⚠️  Imagem ${i + 1}/${productData.images.length} não encontrada: ${path.basename(imagePath)}`)
          continue
        }

        console.log(`   ⏳ Uploading ${i + 1}/${productData.images.length}: ${path.basename(imagePath)}`)

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
          `${productData.name} - ${i + 1}`
        )

        if (result.userErrors && result.userErrors.length > 0) {
          console.log(`   ❌ Erro ao fazer upload:`)
          result.userErrors.forEach(err => {
            console.log(`      - ${err.message}`)
          })
          errorCount++
        } else {
          console.log(`   ✅ Upload concluído!`)
          successCount++
        }

        // Aguardar 500ms entre uploads para não sobrecarregar API
        await new Promise(resolve => setTimeout(resolve, 500))
      }

      console.log(`   ✅ Produto concluído!\n`)

    } catch (error) {
      console.log(`   ❌ Erro: ${error.message}\n`)
      errorCount++
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log('📊 RESUMO DO UPLOAD')
  console.log('='.repeat(60))
  console.log(`✅ Imagens enviadas com sucesso: ${successCount}`)
  console.log(`❌ Erros: ${errorCount}`)
  console.log('='.repeat(60))

  if (successCount > 0) {
    console.log('\n🎉 Imagens foram enviadas para Shopify CDN!')
    console.log('🌐 Acesse Shopify Admin para ver os produtos com imagens')
  }

  if (errorCount > 0) {
    console.log('\n⚠️  Alguns uploads falharam. Verifique:')
    console.log('   - Token SHOPIFY_ADMIN_ACCESS_TOKEN está configurado em .env.local?')
    console.log('   - Token tem permissão write_products?')
    console.log('   - As imagens existem na pasta Leagues/?')
  }
}

// Executar
uploadImages().catch(error => {
  console.error('\n❌ Erro fatal:', error.message)
  process.exit(1)
})

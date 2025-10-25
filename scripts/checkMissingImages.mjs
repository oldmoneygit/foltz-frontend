import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { getProductByHandle } from '../src/lib/shopifyAdmin.js'

// Obter __dirname em ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Ler dados das ligas
const leaguesData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../leagues_data.json'), 'utf-8')
)

console.log('🔍 VERIFICADOR DE IMAGENS FALTANDO\n')

async function checkMissingImages() {
  const productsWithMissingImages = []
  let totalProducts = 0
  let processedProducts = 0

  // Contar total de produtos
  for (const leagueId of Object.keys(leaguesData)) {
    const league = leaguesData[leagueId]
    if (league.products) {
      totalProducts += league.products.length
    }
  }

  console.log(`📊 Verificando ${totalProducts} produtos...\n`)

  // Processar cada produto
  for (const leagueId of Object.keys(leaguesData)) {
    const league = leaguesData[leagueId]

    if (!league.products || !Array.isArray(league.products)) continue

    for (const product of league.products) {
      processedProducts++
      const progress = `[${processedProducts}/${totalProducts}]`

      try {
        // Buscar produto na Shopify
        const shopifyProduct = await getProductByHandle(product.id)

        if (!shopifyProduct) {
          console.log(`${progress} ⚠️  ${product.name} - Não encontrado na Shopify`)
          continue
        }

        const expectedImages = product.images ? product.images.length : 0
        const actualImages = shopifyProduct.images ? shopifyProduct.images.length : 0

        if (actualImages < expectedImages) {
          const missing = expectedImages - actualImages
          console.log(`${progress} ❌ ${product.name}`)
          console.log(`   Esperado: ${expectedImages} | Atual: ${actualImages} | Faltando: ${missing}`)

          productsWithMissingImages.push({
            handle: product.id,
            name: product.name,
            league: league.name,
            expected: expectedImages,
            actual: actualImages,
            missing: missing,
            images: product.images
          })
        } else {
          console.log(`${progress} ✅ ${product.name} (${actualImages}/${expectedImages})`)
        }

        // Pequeno delay para não sobrecarregar a API
        await new Promise(resolve => setTimeout(resolve, 250))

      } catch (error) {
        console.log(`${progress} ❌ Erro ao verificar ${product.name}: ${error.message}`)
      }
    }
  }

  // Salvar lista de produtos com imagens faltando
  if (productsWithMissingImages.length > 0) {
    const outputPath = path.join(__dirname, 'missing-images.json')
    fs.writeFileSync(outputPath, JSON.stringify(productsWithMissingImages, null, 2), 'utf-8')

    console.log('\n' + '='.repeat(60))
    console.log('📊 RESUMO')
    console.log('='.repeat(60))
    console.log(`❌ Produtos com imagens faltando: ${productsWithMissingImages.length}`)
    console.log(`📁 Lista salva em: missing-images.json`)
    console.log('\n💡 Execute: npm run retry-failed-images')
    console.log('='.repeat(60))

    // Mostrar detalhes
    console.log('\n📋 DETALHES:')
    productsWithMissingImages.forEach((p, i) => {
      console.log(`\n${i + 1}. ${p.name} (${p.league})`)
      console.log(`   Handle: ${p.handle}`)
      console.log(`   Faltando: ${p.missing} imagens (${p.actual}/${p.expected})`)
    })

  } else {
    console.log('\n✅ Todos os produtos têm todas as imagens!')
  }
}

// Executar
checkMissingImages().catch(error => {
  console.error('\n❌ Erro:', error.message)
  process.exit(1)
})

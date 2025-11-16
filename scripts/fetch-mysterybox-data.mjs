import 'dotenv/config'

const SHOPIFY_STORE = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN

const MYSTERY_BOX_HANDLES = [
  'mystery-box-premier-league',
  'mystery-box-la-liga',
  'mystery-box-serie-a',
  'mystery-box-bundesliga',
  'mystery-box-ligue-1',
  'mystery-box-argentina',
  'mystery-box-world-cup'
]

async function getProductByHandle(handle) {
  const url = `https://${SHOPIFY_STORE}/admin/api/2024-01/products.json?handle=${handle}`

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN
      }
    })

    if (!response.ok) {
      throw new Error(`Erro ao buscar produto: ${response.statusText}`)
    }

    const data = await response.json()
    return data.products && data.products.length > 0 ? data.products[0] : null
  } catch (error) {
    console.error(`❌ Erro ao buscar produto ${handle}:`, error.message)
    return null
  }
}

async function main() {
  console.log('🔍 Buscando dados dos Mystery Boxes na Shopify...\n')

  if (!SHOPIFY_STORE || !SHOPIFY_ACCESS_TOKEN) {
    console.error('❌ Erro: Variáveis de ambiente SHOPIFY não configuradas')
    process.exit(1)
  }

  const mysteryBoxesData = []

  for (const handle of MYSTERY_BOX_HANDLES) {
    console.log(`\n📦 Buscando: ${handle}`)

    const product = await getProductByHandle(handle)

    if (!product) {
      console.log(`   ⚠️  Produto não encontrado`)
      continue
    }

    console.log(`   ✓ Produto encontrado (ID: ${product.id})`)
    console.log(`   ✓ Título: ${product.title}`)
    console.log(`   ✓ Handle: ${product.handle}`)
    console.log(`   ✓ Variantes: ${product.variants.length}`)

    // Mapear dados para formato do código
    const mappedData = {
      handle: product.handle,
      shopifyId: product.id,
      title: product.title,
      variants: product.variants.map(v => ({
        id: v.id,
        title: v.title,
        available: v.inventory_quantity > 0
      }))
    }

    mysteryBoxesData.push(mappedData)

    // Log das variantes
    product.variants.forEach(variant => {
      console.log(`      - ${variant.title}: ID ${variant.id}`)
    })

    // Aguardar 500ms entre requisições
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  // Gerar código JavaScript para copiar
  console.log('\n' + '='.repeat(80))
  console.log('📋 DADOS PARA COPIAR NO CÓDIGO:')
  console.log('='.repeat(80))
  console.log('\nconst MYSTERY_BOX_SHOPIFY_DATA = {')

  mysteryBoxesData.forEach((box, index) => {
    const isLast = index === mysteryBoxesData.length - 1
    console.log(`  '${box.handle}': {`)
    console.log(`    shopifyId: '${box.shopifyId}',`)
    console.log(`    handle: '${box.handle}',`)
    console.log(`    title: '${box.title}',`)
    console.log(`    variants: [`)
    box.variants.forEach((variant, vIndex) => {
      const isLastVariant = vIndex === box.variants.length - 1
      console.log(`      { id: '${variant.id}', title: '${variant.title}', available: ${variant.available} }${isLastVariant ? '' : ','}`)
    })
    console.log(`    ]`)
    console.log(`  }${isLast ? '' : ','}`)
  })

  console.log('}')
  console.log('\n' + '='.repeat(80))
  console.log(`✅ Total de Mystery Boxes encontrados: ${mysteryBoxesData.length}`)
  console.log('='.repeat(80))
}

main().catch(error => {
  console.error('❌ Erro fatal:', error)
  process.exit(1)
})

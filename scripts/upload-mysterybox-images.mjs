import 'dotenv/config'
import { readFileSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const SHOPIFY_STORE = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN

const MYSTERY_BOX_PRODUCTS = [
  {
    handle: 'mystery-box-premier-league',
    imagePath: join(__dirname, '../public/images/mysterybox/premierleague.png')
  },
  {
    handle: 'mystery-box-la-liga',
    imagePath: join(__dirname, '../public/images/mysterybox/laliga.png')
  },
  {
    handle: 'mystery-box-serie-a',
    imagePath: join(__dirname, '../public/images/mysterybox/seriea.png')
  },
  {
    handle: 'mystery-box-bundesliga',
    imagePath: join(__dirname, '../public/images/mysterybox/bundesliga.png')
  },
  {
    handle: 'mystery-box-ligue-1',
    imagePath: join(__dirname, '../public/images/mysterybox/ligue1.png')
  },
  {
    handle: 'mystery-box-argentina',
    imagePath: join(__dirname, '../public/images/mysterybox/argentina.png')
  },
  {
    handle: 'mystery-box-world-cup',
    imagePath: join(__dirname, '../public/images/mysterybox/fifa.png')
  }
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

async function uploadImage(productId, imagePath) {
  const url = `https://${SHOPIFY_STORE}/admin/api/2024-01/products/${productId}/images.json`

  try {
    // Ler o arquivo de imagem
    const imageBuffer = readFileSync(imagePath)
    const base64Image = imageBuffer.toString('base64')

    const payload = {
      image: {
        attachment: base64Image
      }
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Erro HTTP: ${error}`)
    }

    const data = await response.json()
    console.log(`   📸 Imagem adicionada com sucesso`)
    return data.image
  } catch (error) {
    console.error(`   ❌ Erro ao fazer upload da imagem:`, error.message)
    return null
  }
}

async function main() {
  console.log('🚀 Iniciando upload de imagens dos Mystery Boxes...\n')

  if (!SHOPIFY_STORE || !SHOPIFY_ACCESS_TOKEN) {
    console.error('❌ Erro: Variáveis de ambiente SHOPIFY não configuradas')
    process.exit(1)
  }

  let successCount = 0
  let errorCount = 0

  for (const box of MYSTERY_BOX_PRODUCTS) {
    try {
      console.log(`\n📦 Processando: ${box.handle}`)

      // Buscar produto pelo handle
      const product = await getProductByHandle(box.handle)

      if (!product) {
        console.log(`   ⚠️  Produto não encontrado`)
        errorCount++
        continue
      }

      console.log(`   ✓ Produto encontrado (ID: ${product.id})`)

      // Fazer upload da imagem
      const image = await uploadImage(product.id, box.imagePath)

      if (image) {
        successCount++
      } else {
        errorCount++
      }

      // Aguardar 1 segundo entre requisições
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      console.error(`❌ Erro ao processar ${box.handle}:`, error.message)
      errorCount++
    }
  }

  console.log('\n' + '='.repeat(50))
  console.log(`✅ Imagens enviadas com sucesso: ${successCount}`)
  console.log(`❌ Erros: ${errorCount}`)
  console.log('='.repeat(50))
}

main().catch(error => {
  console.error('❌ Erro fatal:', error)
  process.exit(1)
})

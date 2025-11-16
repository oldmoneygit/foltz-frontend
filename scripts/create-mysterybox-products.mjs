import 'dotenv/config'

const SHOPIFY_STORE = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN

const MYSTERY_BOXES = [
  {
    title: 'Mystery Box Premier League',
    handle: 'mystery-box-premier-league',
    description: 'Recibí 1 camiseta sorpresa de un jugador icónico de la Premier League. Calidad 1:1 garantizada.',
    productType: 'Mystery Box',
    vendor: 'Foltz Fanwear',
    tags: ['mystery-box', 'premier-league', 'england', 'sorpresa'],
    price: 34900, // Precio normal sin descuento
    images: ['/images/mysterybox/premierleague.png']
  },
  {
    title: 'Mystery Box La Liga',
    handle: 'mystery-box-la-liga',
    description: 'Recibí 1 camiseta sorpresa de un jugador icónico de La Liga. Calidad 1:1 garantizada.',
    productType: 'Mystery Box',
    vendor: 'Foltz Fanwear',
    tags: ['mystery-box', 'la-liga', 'spain', 'españa', 'sorpresa'],
    price: 34900,
    images: ['/images/mysterybox/laliga.png']
  },
  {
    title: 'Mystery Box Serie A',
    handle: 'mystery-box-serie-a',
    description: 'Recibí 1 camiseta sorpresa de un jugador icónico de la Serie A. Calidad 1:1 garantizada.',
    productType: 'Mystery Box',
    vendor: 'Foltz Fanwear',
    tags: ['mystery-box', 'serie-a', 'italy', 'italia', 'sorpresa'],
    price: 34900,
    images: ['/images/mysterybox/seriea.png']
  },
  {
    title: 'Mystery Box Bundesliga',
    handle: 'mystery-box-bundesliga',
    description: 'Recibí 1 camiseta sorpresa de un jugador icónico de la Bundesliga. Calidad 1:1 garantizada.',
    productType: 'Mystery Box',
    vendor: 'Foltz Fanwear',
    tags: ['mystery-box', 'bundesliga', 'germany', 'alemania', 'sorpresa'],
    price: 34900,
    images: ['/images/mysterybox/bundesliga.png']
  },
  {
    title: 'Mystery Box Ligue 1',
    handle: 'mystery-box-ligue-1',
    description: 'Recibí 1 camiseta sorpresa de un jugador icónico de la Ligue 1. Calidad 1:1 garantizada.',
    productType: 'Mystery Box',
    vendor: 'Foltz Fanwear',
    tags: ['mystery-box', 'ligue-1', 'france', 'francia', 'sorpresa'],
    price: 34900,
    images: ['/images/mysterybox/ligue1.png']
  },
  {
    title: 'Mystery Box Argentina',
    handle: 'mystery-box-argentina',
    description: 'Recibí 1 camiseta sorpresa de la selección Argentina o clubes argentinos. Calidad 1:1 garantizada.',
    productType: 'Mystery Box',
    vendor: 'Foltz Fanwear',
    tags: ['mystery-box', 'argentina', 'seleccion', 'sorpresa'],
    price: 34900,
    images: ['/images/mysterybox/argentina.png']
  },
  {
    title: 'Mystery Box FIFA World Cup',
    handle: 'mystery-box-world-cup',
    description: 'Recibí 1 camiseta sorpresa de la Copa del Mundo FIFA. Calidad 1:1 garantizada.',
    productType: 'Mystery Box',
    vendor: 'Foltz Fanwear',
    tags: ['mystery-box', 'fifa', 'world-cup', 'mundial', 'sorpresa'],
    price: 34900,
    images: ['/images/mysterybox/fifa.png']
  }
]

async function createProduct(productData) {
  const url = `https://${SHOPIFY_STORE}/admin/api/2024-01/products.json`

  const payload = {
    product: {
      title: productData.title,
      body_html: productData.description,
      vendor: productData.vendor,
      product_type: productData.productType,
      handle: productData.handle,
      tags: productData.tags.join(', '),
      variants: [
        {
          price: (productData.price / 100).toFixed(2),
          option1: 'S',
          inventory_management: null,
          inventory_policy: 'continue'
        },
        {
          price: (productData.price / 100).toFixed(2),
          option1: 'M',
          inventory_management: null,
          inventory_policy: 'continue'
        },
        {
          price: (productData.price / 100).toFixed(2),
          option1: 'L',
          inventory_management: null,
          inventory_policy: 'continue'
        },
        {
          price: (productData.price / 100).toFixed(2),
          option1: 'XL',
          inventory_management: null,
          inventory_policy: 'continue'
        },
        {
          price: (productData.price / 100).toFixed(2),
          option1: 'XXL',
          inventory_management: null,
          inventory_policy: 'continue'
        },
        {
          price: (productData.price / 100).toFixed(2),
          option1: '3XL',
          inventory_management: null,
          inventory_policy: 'continue'
        }
      ],
      options: [
        {
          name: 'Size',
          values: ['S', 'M', 'L', 'XL', 'XXL', '3XL']
        }
      ],
      status: 'active'
    }
  }

  try {
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
      throw new Error(`Erro ao criar produto: ${error}`)
    }

    const data = await response.json()
    console.log(`✅ Produto criado: ${productData.title} (ID: ${data.product.id})`)
    return data.product
  } catch (error) {
    console.error(`❌ Erro ao criar ${productData.title}:`, error.message)
    throw error
  }
}

async function uploadProductImage(productId, imageUrl) {
  const url = `https://${SHOPIFY_STORE}/admin/api/2024-01/products/${productId}/images.json`

  // Converter caminho local para URL pública (você precisará fazer upload manual das imagens)
  const publicImageUrl = `https://foltz-fanwear.vercel.app${imageUrl}`

  const payload = {
    image: {
      src: publicImageUrl
    }
  }

  try {
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
      console.log(`⚠️  Aviso: Não foi possível adicionar imagem para produto ${productId}. Adicione manualmente.`)
      return null
    }

    const data = await response.json()
    console.log(`   📸 Imagem adicionada ao produto ${productId}`)
    return data.image
  } catch (error) {
    console.log(`⚠️  Aviso: Erro ao adicionar imagem - ${error.message}`)
    return null
  }
}

async function main() {
  console.log('🚀 Iniciando criação de produtos Mystery Box...\n')

  if (!SHOPIFY_STORE || !SHOPIFY_ACCESS_TOKEN) {
    console.error('❌ Erro: Variáveis de ambiente SHOPIFY não configuradas')
    console.error('Configure NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN e SHOPIFY_ADMIN_ACCESS_TOKEN no arquivo .env.local')
    process.exit(1)
  }

  let successCount = 0
  let errorCount = 0

  for (const boxData of MYSTERY_BOXES) {
    try {
      console.log(`\n📦 Criando: ${boxData.title}`)
      const product = await createProduct(boxData)

      // Tentar adicionar imagem (opcional)
      if (boxData.images && boxData.images.length > 0) {
        await uploadProductImage(product.id, boxData.images[0])
      }

      successCount++

      // Aguardar 1 segundo entre requisições para evitar rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      errorCount++
      console.error(`❌ Erro ao processar ${boxData.title}`)
    }
  }

  console.log('\n' + '='.repeat(50))
  console.log(`✅ Produtos criados com sucesso: ${successCount}`)
  console.log(`❌ Erros: ${errorCount}`)
  console.log('='.repeat(50))
  console.log('\n📝 Próximos passos:')
  console.log('1. Fazer upload manual das imagens dos Mystery Boxes na Shopify')
  console.log('2. Verificar os produtos criados no painel da Shopify')
  console.log('3. Ajustar descrições e imagens se necessário')
}

main().catch(error => {
  console.error('❌ Erro fatal:', error)
  process.exit(1)
})

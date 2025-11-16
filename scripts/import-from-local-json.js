/**
 * Script para importar produtos do arquivo products.json local para a nova loja Shopify
 *
 * Como usar:
 * 1. Certifique-se que o .env.local está configurado com NEW_SHOPIFY_* vars
 * 2. Execute: node scripts/import-from-local-json.js
 */

import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Carregar .env.local
dotenv.config({ path: path.join(__dirname, '../.env.local') })

// Configuração da nova loja (destino)
const NEW_STORE = {
  domain: process.env.NEW_SHOPIFY_STORE_DOMAIN,
  storefrontToken: process.env.NEW_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
  adminToken: process.env.NEW_SHOPIFY_ADMIN_ACCESS_TOKEN
}

const API_VERSION = '2024-10'

// Validar configuração
if (!NEW_STORE.domain || NEW_STORE.domain === 'YOUR_NEW_STORE.myshopify.com') {
  console.error('❌ Erro: NEW_SHOPIFY_STORE_DOMAIN não configurado no .env.local')
  process.exit(1)
}

if (!NEW_STORE.adminToken || NEW_STORE.adminToken === 'YOUR_ADMIN_TOKEN_HERE') {
  console.error('❌ Erro: NEW_SHOPIFY_ADMIN_ACCESS_TOKEN não configurado no .env.local')
  process.exit(1)
}

console.log('🔧 Configuração:')
console.log(`  Nova Loja: ${NEW_STORE.domain}`)
console.log('')

/**
 * Faz requisição para Admin API
 */
async function adminRequest(query, variables = {}) {
  const url = `https://${NEW_STORE.domain}/admin/api/${API_VERSION}/graphql.json`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': NEW_STORE.adminToken,
    },
    body: JSON.stringify({ query, variables }),
  })

  const data = await response.json()

  if (data.errors) {
    throw new Error(`Admin API Error: ${JSON.stringify(data.errors)}`)
  }

  return data
}

/**
 * Carrega produtos do arquivo JSON local
 */
function loadProductsFromFile() {
  console.log('📂 Carregando produtos do arquivo local...')

  const productsPath = path.join(__dirname, '../inspiration/SNKHOUSE_SHOWROOM/data/products.json')

  if (!fs.existsSync(productsPath)) {
    throw new Error(`Arquivo não encontrado: ${productsPath}`)
  }

  const fileContent = fs.readFileSync(productsPath, 'utf-8')
  const data = JSON.parse(fileContent)

  console.log(`✅ ${data.products.length} produtos carregados do arquivo`)
  return data.products
}

/**
 * Converte produto local para formato Shopify
 */
function convertToShopifyFormat(localProduct) {
  // Criar variantes (tamanhos)
  const variants = (localProduct.sizes || []).map(sizeInfo => ({
    price: String(localProduct.price),
    compareAtPrice: localProduct.regularPrice ? String(localProduct.regularPrice) : null,
    sku: `${localProduct.slug}-${sizeInfo.size}`,
    inventoryPolicy: 'DENY',
    inventoryManagement: 'SHOPIFY',
    options: [String(sizeInfo.size)]
  }))

  // Se não tiver tamanhos, criar uma variante padrão
  if (variants.length === 0) {
    variants.push({
      price: String(localProduct.price),
      compareAtPrice: localProduct.regularPrice ? String(localProduct.regularPrice) : null,
      sku: localProduct.slug,
      options: ['Default']
    })
  }

  // Preparar imagens (galeria + imagem principal)
  const images = []

  // Adicionar galeria primeiro
  if (localProduct.gallery && localProduct.gallery.length > 0) {
    localProduct.gallery.forEach(url => {
      if (url && !url.startsWith('/images/')) {
        images.push({ src: url })
      }
    })
  }

  // Se não tiver galeria, usar imagem principal
  if (images.length === 0 && localProduct.image && !localProduct.image.startsWith('/images/')) {
    images.push({ src: localProduct.image })
  }

  // Limpar descrição HTML
  let description = localProduct.description || ''
  if (description && typeof description === 'string') {
    // Remover classes e estilos desnecessários, mas manter a estrutura HTML
    description = description.replace(/class="[^"]*"/g, '')
    description = description.replace(/style="[^"]*"/g, '')
  }

  // Tags
  const tags = [
    ...(localProduct.tags || []),
    localProduct.category,
    localProduct.featured ? 'featured' : null,
    localProduct.bestSeller ? 'bestseller' : null,
    localProduct.stock,
  ].filter(Boolean)

  return {
    title: localProduct.name,
    handle: localProduct.slug,
    descriptionHtml: description,
    productType: localProduct.category || '',
    vendor: 'FOLTZ',
    tags: tags,
    status: 'ACTIVE',
    options: variants.length > 1 ? ['Size'] : ['Title'],
    variants: variants,
    images: images
  }
}

/**
 * Cria um produto na nova loja
 */
async function createProductInNewStore(productData) {
  const mutation = `
    mutation createProduct($input: ProductInput!) {
      productCreate(input: $input) {
        product {
          id
          title
          handle
          status
          variants(first: 100) {
            edges {
              node {
                id
                title
                price
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `

  try {
    const response = await adminRequest(mutation, { input: productData })

    if (response.data.productCreate.userErrors.length > 0) {
      return {
        success: false,
        product: productData.title,
        errors: response.data.productCreate.userErrors
      }
    }

    return {
      success: true,
      product: productData.title,
      newProduct: response.data.productCreate.product
    }
  } catch (error) {
    return {
      success: false,
      product: productData.title,
      error: error.message
    }
  }
}

/**
 * Aguarda um tempo (rate limiting)
 */
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Função principal
 */
async function main() {
  console.log('🚀 Iniciando importação de produtos...\n')

  try {
    // 1. Carregar produtos do arquivo local
    const localProducts = loadProductsFromFile()

    console.log('\n📝 Resumo dos produtos:')
    console.log(`  Total: ${localProducts.length}`)
    console.log(`  Com galeria: ${localProducts.filter(p => p.gallery && p.gallery.length > 0).length}`)
    console.log(`  Com tamanhos: ${localProducts.filter(p => p.sizes && p.sizes.length > 0).length}`)
    console.log(`  Featured: ${localProducts.filter(p => p.featured).length}`)
    console.log(`  Best Sellers: ${localProducts.filter(p => p.bestSeller).length}`)
    console.log('')

    // 2. Confirmar importação
    console.log('⚠️  Tem certeza que deseja importar todos os produtos?')
    console.log('   Pressione Ctrl+C para cancelar ou aguarde 5 segundos...')
    await wait(5000)

    // 3. Criar produtos na nova loja
    console.log('\n📤 Criando produtos na nova loja...\n')

    const results = []
    let successCount = 0
    let errorCount = 0

    for (let i = 0; i < localProducts.length; i++) {
      const localProduct = localProducts[i]
      console.log(`\n[${i + 1}/${localProducts.length}] Processando: ${localProduct.name}`)

      try {
        // Converter para formato Shopify
        const shopifyProduct = convertToShopifyFormat(localProduct)

        console.log(`  📋 ${shopifyProduct.variants.length} variantes, ${shopifyProduct.images.length} imagens`)

        // Criar produto
        const result = await createProductInNewStore(shopifyProduct)
        results.push(result)

        if (result.success) {
          successCount++
          console.log(`  ✅ Criado com sucesso!`)
        } else {
          errorCount++
          console.log(`  ❌ Erro:`, result.errors || result.error)
        }
      } catch (error) {
        errorCount++
        console.log(`  ❌ Erro ao processar:`, error.message)
        results.push({
          success: false,
          product: localProduct.name,
          error: error.message
        })
      }

      // Rate limiting: aguardar 500ms entre requisições
      if (i < localProducts.length - 1) {
        await wait(500)
      }
    }

    // 4. Salvar relatório
    const report = {
      timestamp: new Date().toISOString(),
      sourceFile: 'products.json',
      newStore: NEW_STORE.domain,
      total: localProducts.length,
      success: successCount,
      errors: errorCount,
      results: results
    }

    const reportPath = path.join(__dirname, `../import-report-${Date.now()}.json`)
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))

    // 5. Resumo final
    console.log('\n' + '='.repeat(60))
    console.log('✅ IMPORTAÇÃO CONCLUÍDA!')
    console.log('='.repeat(60))
    console.log(`📊 Total de produtos: ${localProducts.length}`)
    console.log(`✅ Sucesso: ${successCount}`)
    console.log(`❌ Erros: ${errorCount}`)
    console.log(`📄 Relatório salvo em: ${reportPath}`)
    console.log('='.repeat(60))

    // Listar erros se houver
    if (errorCount > 0) {
      console.log('\n⚠️  Produtos com erro:')
      results.filter(r => !r.success).forEach(r => {
        console.log(`  - ${r.product}`)
        if (r.errors) console.log(`    ${JSON.stringify(r.errors)}`)
        if (r.error) console.log(`    ${r.error}`)
      })
    }

  } catch (error) {
    console.error('\n❌ Erro fatal:', error)
    process.exit(1)
  }
}

// Executar
main()

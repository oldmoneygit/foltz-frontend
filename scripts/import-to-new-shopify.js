/**
 * Script para importar produtos da loja antiga para a nova loja Shopify
 *
 * Como usar:
 * 1. Preencha as variáveis de ambiente no .env.local:
 *    - NEW_SHOPIFY_STORE_DOMAIN
 *    - NEW_SHOPIFY_STOREFRONT_ACCESS_TOKEN (já preenchido)
 *    - NEW_SHOPIFY_ADMIN_ACCESS_TOKEN
 * 2. Execute: node scripts/import-to-new-shopify.js
 */

import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Carregar .env.local
dotenv.config({ path: path.join(__dirname, '../.env.local') })

// Configuração da loja antiga (origem)
const OLD_STORE = {
  domain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN,
  storefrontToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
  adminToken: process.env.SHOPIFY_ADMIN_ACCESS_TOKEN
}

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
console.log(`  Loja Antiga: ${OLD_STORE.domain}`)
console.log(`  Nova Loja: ${NEW_STORE.domain}`)
console.log('')

/**
 * Faz requisição para Storefront API
 */
async function storefrontRequest(store, query, variables = {}) {
  const url = `https://${store.domain}/api/${API_VERSION}/graphql.json`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': store.storefrontToken,
    },
    body: JSON.stringify({ query, variables }),
  })

  const data = await response.json()

  if (data.errors) {
    throw new Error(`Storefront API Error: ${JSON.stringify(data.errors)}`)
  }

  return data
}

/**
 * Faz requisição para Admin API
 */
async function adminRequest(store, query, variables = {}) {
  const url = `https://${store.domain}/admin/api/${API_VERSION}/graphql.json`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': store.adminToken,
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
 * Busca todos os produtos da loja antiga
 */
async function fetchAllProductsFromOldStore() {
  console.log('📥 Buscando produtos da loja antiga...')

  const query = `
    query getProducts($first: Int!, $after: String) {
      products(first: $first, after: $after) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            id
            title
            handle
            description
            descriptionHtml
            productType
            vendor
            tags
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            compareAtPriceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 20) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            options {
              name
              values
            }
            variants(first: 100) {
              edges {
                node {
                  id
                  title
                  sku
                  price {
                    amount
                    currencyCode
                  }
                  compareAtPrice {
                    amount
                    currencyCode
                  }
                  selectedOptions {
                    name
                    value
                  }
                  availableForSale
                }
              }
            }
          }
        }
      }
    }
  `

  let allProducts = []
  let hasNextPage = true
  let after = null

  while (hasNextPage) {
    const response = await storefrontRequest(OLD_STORE, query, {
      first: 250,
      after
    })

    const products = response.data.products.edges.map(edge => edge.node)
    allProducts = [...allProducts, ...products]

    hasNextPage = response.data.products.pageInfo.hasNextPage
    after = response.data.products.pageInfo.endCursor

    console.log(`  ✓ Buscados ${allProducts.length} produtos...`)
  }

  console.log(`✅ Total de produtos encontrados: ${allProducts.length}`)
  return allProducts
}

/**
 * Cria um produto na nova loja
 */
async function createProductInNewStore(product) {
  console.log(`📤 Criando produto: ${product.title}`)

  // Preparar variantes
  const variants = product.variants.edges.map(({ node }) => ({
    price: node.price.amount,
    compareAtPrice: node.compareAtPrice?.amount || null,
    sku: node.sku || '',
    options: node.selectedOptions.map(opt => opt.value)
  }))

  // Preparar imagens
  const images = product.images.edges.map(({ node }) => ({
    src: node.url,
    altText: node.altText || ''
  }))

  // Preparar opções (Size, Color, etc)
  const options = product.options.map(opt => opt.name)

  const mutation = `
    mutation createProduct($input: ProductInput!) {
      productCreate(input: $input) {
        product {
          id
          title
          handle
          variants(first: 100) {
            edges {
              node {
                id
                title
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

  const input = {
    title: product.title,
    handle: product.handle,
    descriptionHtml: product.descriptionHtml || product.description || '',
    productType: product.productType || '',
    vendor: product.vendor || '',
    tags: product.tags,
    options: options,
    variants: variants,
    images: images
  }

  try {
    const response = await adminRequest(NEW_STORE, mutation, { input })

    if (response.data.productCreate.userErrors.length > 0) {
      console.error(`  ❌ Erro ao criar ${product.title}:`, response.data.productCreate.userErrors)
      return { success: false, product: product.title, errors: response.data.productCreate.userErrors }
    }

    console.log(`  ✅ Produto criado: ${product.title}`)
    return {
      success: true,
      product: product.title,
      newProduct: response.data.productCreate.product
    }
  } catch (error) {
    console.error(`  ❌ Erro ao criar ${product.title}:`, error.message)
    return { success: false, product: product.title, error: error.message }
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
    // 1. Buscar produtos da loja antiga
    const products = await fetchAllProductsFromOldStore()

    console.log('\n📝 Resumo dos produtos:')
    console.log(`  Total: ${products.length}`)
    console.log(`  Com imagens: ${products.filter(p => p.images.edges.length > 0).length}`)
    console.log(`  Com variantes: ${products.filter(p => p.variants.edges.length > 1).length}`)
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

    for (let i = 0; i < products.length; i++) {
      const product = products[i]
      console.log(`\n[${i + 1}/${products.length}] Processando: ${product.title}`)

      const result = await createProductInNewStore(product)
      results.push(result)

      if (result.success) {
        successCount++
      } else {
        errorCount++
      }

      // Rate limiting: aguardar 500ms entre requisições
      if (i < products.length - 1) {
        await wait(500)
      }
    }

    // 4. Salvar relatório
    const report = {
      timestamp: new Date().toISOString(),
      oldStore: OLD_STORE.domain,
      newStore: NEW_STORE.domain,
      total: products.length,
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
    console.log(`📊 Total de produtos: ${products.length}`)
    console.log(`✅ Sucesso: ${successCount}`)
    console.log(`❌ Erros: ${errorCount}`)
    console.log(`📄 Relatório salvo em: ${reportPath}`)
    console.log('='.repeat(60))

  } catch (error) {
    console.error('\n❌ Erro fatal:', error)
    process.exit(1)
  }
}

// Executar
main()

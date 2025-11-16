/**
 * Script para buscar Variant IDs da NOVA loja Shopify
 *
 * Pré-requisito: Produtos já importados manualmente na nova loja Shopify
 *
 * Como usar:
 * 1. Importe os produtos manualmente no Shopify Admin
 * 2. Execute: node scripts/fetch-new-shopify-variants.js
 *
 * Irá gerar: new-shopify-variant-mapping.json
 */

import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Carregar .env.local
dotenv.config({ path: path.join(__dirname, '../.env.local') })

// Configuração da NOVA loja
const NEW_STORE = {
  domain: process.env.NEW_SHOPIFY_STORE_DOMAIN,
  storefrontToken: process.env.NEW_SHOPIFY_STOREFRONT_ACCESS_TOKEN
}

const API_VERSION = '2024-10'

// Validar configuração
if (!NEW_STORE.domain) {
  console.error('❌ Erro: NEW_SHOPIFY_STORE_DOMAIN não configurado no .env.local')
  process.exit(1)
}

if (!NEW_STORE.storefrontToken) {
  console.error('❌ Erro: NEW_SHOPIFY_STOREFRONT_ACCESS_TOKEN não configurado no .env.local')
  process.exit(1)
}

console.log(`🔗 Conectando à NOVA loja Shopify: ${NEW_STORE.domain}\n`)

/**
 * Função para fazer request GraphQL
 */
async function shopifyGraphQL(query, variables = {}) {
  const url = `https://${NEW_STORE.domain}/api/${API_VERSION}/graphql.json`

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': NEW_STORE.storefrontToken,
      },
      body: JSON.stringify({ query, variables }),
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const json = await response.json()

    if (json.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(json.errors, null, 2)}`)
    }

    return json.data
  } catch (error) {
    console.error('❌ Erro na requisição GraphQL:', error.message)
    throw error
  }
}

/**
 * Buscar todos os produtos (com paginação)
 */
async function fetchAllProducts() {
  console.log('🔍 Buscando produtos da nova loja Shopify...\n')

  const allProducts = []
  let hasNextPage = true
  let cursor = null
  let pageCount = 0

  while (hasNextPage) {
    pageCount++
    console.log(`   Página ${pageCount}...`)

    const query = `
      query getProducts($cursor: String) {
        products(first: 50, after: $cursor) {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            cursor
            node {
              id
              title
              handle
              productType
              tags
              variants(first: 100) {
                edges {
                  node {
                    id
                    title
                    sku
                    selectedOptions {
                      name
                      value
                    }
                    price {
                      amount
                      currencyCode
                    }
                    compareAtPrice {
                      amount
                      currencyCode
                    }
                    availableForSale
                    quantityAvailable
                  }
                }
              }
            }
          }
        }
      }
    `

    const data = await shopifyGraphQL(query, { cursor })

    const products = data.products.edges.map(edge => edge.node)
    allProducts.push(...products)

    hasNextPage = data.products.pageInfo.hasNextPage
    cursor = data.products.pageInfo.endCursor

    // Delay para não bater rate limit
    if (hasNextPage) {
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  }

  console.log(`\n✅ Total de produtos encontrados: ${allProducts.length}\n`)
  return allProducts
}

/**
 * Parse CSV para obter produtos locais (referência)
 */
function parseCSVProducts() {
  const csvPath = path.join(__dirname, '../shopify-theme-foltz/products-import.csv')

  if (!fs.existsSync(csvPath)) {
    console.warn('⚠️  Arquivo products-import.csv não encontrado')
    return []
  }

  const content = fs.readFileSync(csvPath, 'utf-8')
  const lines = content.split('\n').filter(line => line.trim())

  // Skip header
  const dataLines = lines.slice(1)

  // Group by handle
  const productsMap = new Map()

  dataLines.forEach(line => {
    const values = line.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g)?.map(v => v.replace(/^"|"$/g, '').trim())
    if (!values || values.length < 2) return

    const [handle, title, body, vendor, type, tags] = values

    if (!productsMap.has(handle)) {
      productsMap.set(handle, {
        handle,
        title: title || handle,
        type: type || 'Camiseta',
        tags: tags ? tags.split(',').map(t => t.trim()) : []
      })
    }
  })

  return Array.from(productsMap.values())
}

/**
 * Função principal
 */
async function main() {
  try {
    // Buscar produtos do Shopify
    const shopifyProducts = await fetchAllProducts()

    if (shopifyProducts.length === 0) {
      console.error('⚠️  Nenhum produto encontrado na nova loja Shopify!')
      console.error('Certifique-se de que você já importou os produtos manualmente.')
      process.exit(1)
    }

    // Carregar produtos locais do CSV (para referência)
    console.log('📂 Carregando produtos de referência do CSV...')
    const localProducts = parseCSVProducts()
    console.log(`   ${localProducts.length} produtos de referência carregados\n`)

    // Criar mapeamento
    console.log('🔗 Criando mapeamento de Variant IDs...\n')

    const mapping = {}
    let totalVariants = 0
    let matchedProducts = 0
    let unmatchedProducts = []

    shopifyProducts.forEach((shopifyProduct) => {
      const handle = shopifyProduct.handle

      // Tentar encontrar produto local correspondente
      const localProduct = localProducts.find(p => p.handle === handle)

      // Criar entrada no mapeamento
      const productKey = handle // Usar handle como chave

      mapping[productKey] = {
        handle: handle,
        title: shopifyProduct.title,
        shopifyProductId: shopifyProduct.id,
        productType: shopifyProduct.productType,
        tags: shopifyProduct.tags,
        matchedLocal: !!localProduct,
        variants: {},
      }

      if (localProduct) {
        matchedProducts++
      } else {
        unmatchedProducts.push(handle)
      }

      // Mapear cada variante
      shopifyProduct.variants.edges.forEach((edge) => {
        const variant = edge.node

        // Encontrar opção de tamanho
        const sizeOption = variant.selectedOptions.find(
          opt => opt.name.toLowerCase() === 'size' ||
                 opt.name.toLowerCase() === 'tamanho' ||
                 opt.name.toLowerCase() === 'title'
        )

        const size = sizeOption ? sizeOption.value : 'Default'

        mapping[productKey].variants[size] = {
          shopifyVariantId: variant.id,
          title: variant.title,
          sku: variant.sku,
          price: variant.price.amount,
          compareAtPrice: variant.compareAtPrice?.amount || null,
          currency: variant.price.currencyCode,
          availableForSale: variant.availableForSale,
          quantityAvailable: variant.quantityAvailable,
        }

        totalVariants++
      })

      console.log(`   ✓ ${shopifyProduct.title} (${shopifyProduct.variants.edges.length} variantes)`)
    })

    // Salvar mapeamento
    const mappingPath = path.join(__dirname, '../new-shopify-variant-mapping.json')
    fs.writeFileSync(mappingPath, JSON.stringify(mapping, null, 2), 'utf8')

    // Resumo
    console.log('\n' + '='.repeat(60))
    console.log('✅ MAPEAMENTO CRIADO COM SUCESSO!')
    console.log('='.repeat(60))
    console.log(`📁 Arquivo: new-shopify-variant-mapping.json`)
    console.log(`📊 Produtos mapeados: ${Object.keys(mapping).length}`)
    console.log(`🔢 Total de variantes: ${totalVariants}`)
    console.log(`✓ Produtos com match local: ${matchedProducts}`)

    if (unmatchedProducts.length > 0) {
      console.log(`\n⚠️  Produtos sem match no CSV local (${unmatchedProducts.length}):`)
      unmatchedProducts.slice(0, 5).forEach(handle => {
        console.log(`   - ${handle}`)
      })
      if (unmatchedProducts.length > 5) {
        console.log(`   ... e mais ${unmatchedProducts.length - 5}`)
      }
    }

    console.log('\n📝 Como usar este mapeamento:')
    console.log('   1. Use o handle do produto para buscar no mapping')
    console.log('   2. Use o size (S, M, L, XL, XXL) para pegar o variant ID')
    console.log('   3. Use o variant ID para criar checkout na Shopify')
    console.log('')
    console.log('📖 Exemplo:')
    console.log('   const mapping = require("./new-shopify-variant-mapping.json")')
    console.log('   const variantId = mapping["brazil-1988-brazil-home"].variants["M"].shopifyVariantId')
    console.log('   // Criar checkout com esse variantId')
    console.log('')
    console.log('='.repeat(60))

  } catch (error) {
    console.error('\n❌ Erro:', error.message)
    console.error(error.stack)
    process.exit(1)
  }
}

// Executar
main()

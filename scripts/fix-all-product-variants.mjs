#!/usr/bin/env node
/**
 * Script para corrigir TODAS as variantes de produtos no Shopify
 * - Adiciona tamanhos faltantes (S, M, L, XL, XXL, 3XL)
 * - Garante que todos os produtos tenham todas as variantes
 */

import 'dotenv/config'

const shopifyDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || process.env.SHOPIFY_STORE_DOMAIN
const adminToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN
const storefrontToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN

const SHOPIFY_API_VERSION = '2024-10'
const REQUIRED_SIZES = ['S', 'M', 'L', 'XL', 'XXL', '3XL']

if (!shopifyDomain || !adminToken) {
  console.error('❌ Missing Shopify credentials')
  console.error('Domain:', shopifyDomain)
  console.error('Admin Token:', adminToken ? '✓' : '✗')
  process.exit(1)
}

// Admin API Query
async function adminQuery(query, variables = {}) {
  const url = `https://${shopifyDomain}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': adminToken,
    },
    body: JSON.stringify({ query, variables }),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`HTTP error! status: ${response.status} - ${text}`)
  }

  const data = await response.json()
  if (data.errors) {
    console.error('GraphQL errors:', JSON.stringify(data.errors, null, 2))
    throw new Error('GraphQL query failed')
  }

  return data.data
}

// Storefront API Query
async function storefrontQuery(query, variables = {}) {
  const url = `https://${shopifyDomain}/api/${SHOPIFY_API_VERSION}/graphql.json`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': storefrontToken,
    },
    body: JSON.stringify({ query, variables }),
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const data = await response.json()
  if (data.errors) {
    console.error('GraphQL errors:', data.errors)
    throw new Error('GraphQL query failed')
  }

  return data.data
}

// Get all products with variants
async function getAllProductsWithVariants() {
  const products = []
  let hasNextPage = true
  let cursor = null

  console.log('🔄 Buscando TODOS os produtos do Shopify...\n')

  while (hasNextPage) {
    const query = `
      query getAllProducts($first: Int!, $cursor: String) {
        products(first: $first, after: $cursor) {
          edges {
            node {
              id
              handle
              title
              variants(first: 100) {
                edges {
                  node {
                    id
                    title
                    price {
                      amount
                    }
                    selectedOptions {
                      name
                      value
                    }
                  }
                }
              }
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `

    const data = await storefrontQuery(query, { first: 250, cursor })

    if (!data.products) break

    products.push(...data.products.edges.map(e => e.node))

    hasNextPage = data.products.pageInfo.hasNextPage
    cursor = data.products.pageInfo.endCursor

    console.log(`📦 Carregado: ${products.length} produtos...`)
  }

  console.log(`\n✅ Total de produtos carregados: ${products.length}\n`)
  return products
}

// Analyze which sizes are missing
function analyzeMissingSizes(product) {
  const existingSizes = []

  product.variants.edges.forEach(({ node: variant }) => {
    const sizeOption = variant.selectedOptions?.find(opt => opt.name === 'Size')
    if (sizeOption) {
      existingSizes.push(sizeOption.value)
    } else {
      // If no Size option, assume single variant
      existingSizes.push(variant.title)
    }
  })

  const missingSizes = REQUIRED_SIZES.filter(size => !existingSizes.includes(size))
  const price = product.variants.edges[0]?.node.price.amount || '32900'

  return {
    productId: product.id,
    handle: product.handle,
    title: product.title,
    existingSizes,
    missingSizes,
    price
  }
}

// Add missing variants to a product using Admin API
async function addMissingVariants(productAnalysis) {
  if (productAnalysis.missingSizes.length === 0) {
    return { success: true, added: 0 }
  }

  console.log(`\n🔧 Corrigindo: ${productAnalysis.title}`)
  console.log(`   Tamanhos existentes: ${productAnalysis.existingSizes.join(', ')}`)
  console.log(`   Tamanhos faltando: ${productAnalysis.missingSizes.join(', ')}`)

  // Convert Storefront API ID to Admin API ID
  // gid://shopify/Product/123456789 stays the same format
  const productGid = productAnalysis.productId

  let addedCount = 0

  for (const size of productAnalysis.missingSizes) {
    try {
      const mutation = `
        mutation productVariantCreate($input: ProductVariantInput!) {
          productVariantCreate(input: $input) {
            productVariant {
              id
              title
            }
            userErrors {
              field
              message
            }
          }
        }
      `

      const variables = {
        input: {
          productId: productGid,
          price: productAnalysis.price,
          options: [size],
          inventoryPolicy: 'CONTINUE',
          inventoryQuantities: {
            availableQuantity: 100,
            locationId: 'gid://shopify/Location/82187083051' // Default location
          }
        }
      }

      const result = await adminQuery(mutation, variables)

      if (result.productVariantCreate?.userErrors?.length > 0) {
        console.error(`   ❌ Erro ao adicionar ${size}:`, result.productVariantCreate.userErrors)
      } else if (result.productVariantCreate?.productVariant) {
        console.log(`   ✅ Adicionado: ${size}`)
        addedCount++
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100))

    } catch (error) {
      console.error(`   ❌ Erro ao adicionar ${size}:`, error.message)
    }
  }

  return { success: addedCount > 0, added: addedCount }
}

// Get location ID first
async function getLocationId() {
  const query = `
    query {
      locations(first: 1) {
        edges {
          node {
            id
            name
          }
        }
      }
    }
  `

  const data = await adminQuery(query)
  if (data.locations?.edges?.length > 0) {
    return data.locations.edges[0].node.id
  }
  return null
}

// Main function
async function main() {
  console.log('='.repeat(60))
  console.log('🔧 CORREÇÃO DE VARIANTES - FOLTZ FANWEAR')
  console.log('='.repeat(60))
  console.log('')

  // Get location ID
  console.log('📍 Buscando Location ID...')
  const locationId = await getLocationId()
  console.log(`   Location: ${locationId}\n`)

  // Get all products
  const products = await getAllProductsWithVariants()

  // Filter out mysterybox products
  const activeProducts = products.filter(p => {
    const title = p.title.toLowerCase()
    return !title.includes('mysterybox')
  })

  console.log(`📊 Produtos ativos: ${activeProducts.length}\n`)

  // Analyze all products
  const analysisResults = []
  const productsToFix = []

  for (const product of activeProducts) {
    const analysis = analyzeMissingSizes(product)
    analysisResults.push(analysis)

    if (analysis.missingSizes.length > 0) {
      productsToFix.push(analysis)
    }
  }

  console.log('='.repeat(60))
  console.log('📋 ANÁLISE DE VARIANTES FALTANTES')
  console.log('='.repeat(60))
  console.log(`Total de produtos: ${activeProducts.length}`)
  console.log(`Produtos completos: ${activeProducts.length - productsToFix.length}`)
  console.log(`Produtos para corrigir: ${productsToFix.length}`)
  console.log('')

  if (productsToFix.length === 0) {
    console.log('✅ Todos os produtos já têm todas as variantes necessárias!')
    return
  }

  // Show products to fix
  console.log('Produtos que precisam de correção:')
  productsToFix.forEach((p, i) => {
    console.log(`${i + 1}. ${p.title}`)
    console.log(`   Faltando: ${p.missingSizes.join(', ')}`)
  })
  console.log('')

  // Ask for confirmation (in automated mode, proceed)
  console.log('='.repeat(60))
  console.log('🚀 INICIANDO CORREÇÃO DE VARIANTES')
  console.log('='.repeat(60))

  const report = {
    total: productsToFix.length,
    fixed: 0,
    failed: 0,
    variantsAdded: 0,
    errors: []
  }

  // Fix each product
  for (let i = 0; i < productsToFix.length; i++) {
    const product = productsToFix[i]
    console.log(`\n[${i + 1}/${productsToFix.length}] Processando...`)

    try {
      // Update location ID in the mutation
      const result = await addMissingVariantsWithLocation(product, locationId)

      if (result.success) {
        report.fixed++
        report.variantsAdded += result.added
      } else {
        report.failed++
        report.errors.push({ product: product.title, error: 'No variants added' })
      }
    } catch (error) {
      report.failed++
      report.errors.push({ product: product.title, error: error.message })
      console.error(`   ❌ Erro: ${error.message}`)
    }

    // Delay between products
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  // Final report
  console.log('\n' + '='.repeat(60))
  console.log('📊 RELATÓRIO FINAL')
  console.log('='.repeat(60))
  console.log(`✅ Produtos corrigidos: ${report.fixed}/${report.total}`)
  console.log(`❌ Falhas: ${report.failed}`)
  console.log(`📦 Variantes adicionadas: ${report.variantsAdded}`)

  if (report.errors.length > 0) {
    console.log('\nErros encontrados:')
    report.errors.forEach(err => {
      console.log(`  - ${err.product}: ${err.error}`)
    })
  }

  // Save report
  const fs = await import('fs')
  fs.writeFileSync('VARIANT-FIX-REPORT.json', JSON.stringify(report, null, 2))
  console.log('\n📄 Relatório salvo em: VARIANT-FIX-REPORT.json')

  console.log('\n✅ Processo concluído! Execute validate-product-variants.mjs novamente para verificar.')
}

// Add missing variants with correct location
async function addMissingVariantsWithLocation(productAnalysis, locationId) {
  if (productAnalysis.missingSizes.length === 0) {
    return { success: true, added: 0 }
  }

  console.log(`🔧 Corrigindo: ${productAnalysis.title}`)
  console.log(`   Tamanhos existentes: ${productAnalysis.existingSizes.join(', ')}`)
  console.log(`   Tamanhos faltando: ${productAnalysis.missingSizes.join(', ')}`)

  const productGid = productAnalysis.productId
  let addedCount = 0

  for (const size of productAnalysis.missingSizes) {
    try {
      const mutation = `
        mutation productVariantCreate($input: ProductVariantInput!) {
          productVariantCreate(input: $input) {
            productVariant {
              id
              title
            }
            userErrors {
              field
              message
            }
          }
        }
      `

      const input = {
        productId: productGid,
        price: productAnalysis.price,
        options: [size],
        inventoryPolicy: 'CONTINUE'
      }

      // Add inventory if we have location
      if (locationId) {
        input.inventoryQuantities = {
          availableQuantity: 100,
          locationId: locationId
        }
      }

      const variables = { input }

      const result = await adminQuery(mutation, variables)

      if (result.productVariantCreate?.userErrors?.length > 0) {
        const errors = result.productVariantCreate.userErrors
        console.error(`   ❌ Erro ao adicionar ${size}:`, errors.map(e => e.message).join(', '))
      } else if (result.productVariantCreate?.productVariant) {
        console.log(`   ✅ Adicionado: ${size}`)
        addedCount++
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 200))

    } catch (error) {
      console.error(`   ❌ Erro ao adicionar ${size}:`, error.message)
    }
  }

  return { success: addedCount > 0, added: addedCount }
}

main().catch(console.error)

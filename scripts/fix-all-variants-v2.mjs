#!/usr/bin/env node
/**
 * Script para corrigir TODAS as variantes de produtos no Shopify
 * Usa a API correta (productVariantsBulkCreate)
 */

import 'dotenv/config'

const shopifyDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || process.env.SHOPIFY_STORE_DOMAIN
const adminToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN
const storefrontToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN

const SHOPIFY_API_VERSION = '2024-10'
const REQUIRED_SIZES = ['S', 'M', 'L', 'XL', 'XXL', '3XL']

console.log('='.repeat(60))
console.log('🔧 CORREÇÃO DE VARIANTES v2 - FOLTZ FANWEAR')
console.log('='.repeat(60))

if (!shopifyDomain || !adminToken || !storefrontToken) {
  console.error('❌ Missing credentials')
  process.exit(1)
}

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

  return response.json()
}

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

  return response.json()
}

// Get products with missing sizes from Admin API (to get option IDs)
async function getProductsWithMissingSizes() {
  const products = []
  let hasNextPage = true
  let cursor = null

  console.log('\n🔄 Buscando produtos que precisam de correção...\n')

  while (hasNextPage) {
    const query = `
      query getAllProducts($first: Int!, $cursor: String) {
        products(first: $first, after: $cursor, query: "status:ACTIVE") {
          edges {
            node {
              id
              handle
              title
              options {
                id
                name
                values
              }
              variants(first: 100) {
                edges {
                  node {
                    id
                    title
                    price
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

    const data = await adminQuery(query, { first: 100, cursor })

    if (data.errors) {
      console.error('GraphQL errors:', data.errors)
      break
    }

    if (!data.data?.products) break

    // Filter products that need fixing
    for (const edge of data.data.products.edges) {
      const product = edge.node

      // Skip mysterybox
      if (product.title.toLowerCase().includes('mysterybox')) continue

      // Check if has Size option
      const sizeOption = product.options.find(o => o.name === 'Size')
      if (!sizeOption) continue

      // Get existing sizes
      const existingSizes = product.variants.edges.map(v => {
        const sizeOpt = v.node.selectedOptions?.find(o => o.name === 'Size')
        return sizeOpt?.value || v.node.title
      })

      // Find missing sizes
      const missingSizes = REQUIRED_SIZES.filter(s => !existingSizes.includes(s))

      if (missingSizes.length > 0) {
        products.push({
          id: product.id,
          handle: product.handle,
          title: product.title,
          existingSizes,
          missingSizes,
          price: product.variants.edges[0]?.node.price || '32900'
        })
      }
    }

    hasNextPage = data.data.products.pageInfo.hasNextPage
    cursor = data.data.products.pageInfo.endCursor

    process.stdout.write(`\r📦 Analisado: ${products.length} produtos precisam correção...`)
  }

  console.log(`\n\n✅ Total de produtos para corrigir: ${products.length}`)
  return products
}

// Add missing variants to a product
async function addMissingVariants(product) {
  if (product.missingSizes.length === 0) return { success: true, added: 0 }

  const variantsToCreate = product.missingSizes.map(size => ({
    price: product.price,
    optionValues: [{
      optionName: "Size",
      name: size
    }]
  }))

  const mutation = `
    mutation productVariantsBulkCreate($productId: ID!, $strategy: ProductVariantsBulkCreateStrategy!, $variants: [ProductVariantsBulkInput!]!) {
      productVariantsBulkCreate(productId: $productId, strategy: $strategy, variants: $variants) {
        productVariants {
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
    productId: product.id,
    strategy: "REMOVE_STANDALONE_VARIANT",
    variants: variantsToCreate
  }

  try {
    const result = await adminQuery(mutation, variables)

    if (result.errors) {
      console.error(`   ❌ GraphQL errors:`, result.errors.map(e => e.message).join(', '))
      return { success: false, added: 0, error: result.errors[0]?.message }
    }

    if (result.data?.productVariantsBulkCreate?.userErrors?.length > 0) {
      const errors = result.data.productVariantsBulkCreate.userErrors
      console.error(`   ❌ User errors:`, errors.map(e => e.message).join(', '))
      return { success: false, added: 0, error: errors[0]?.message }
    }

    const addedCount = result.data?.productVariantsBulkCreate?.productVariants?.length || 0
    if (addedCount > 0) {
      console.log(`   ✅ Adicionado ${addedCount} variantes: ${product.missingSizes.join(', ')}`)
    }

    return { success: true, added: addedCount }
  } catch (error) {
    console.error(`   ❌ Exception:`, error.message)
    return { success: false, added: 0, error: error.message }
  }
}

async function main() {
  const startTime = Date.now()

  // Get products needing fixes
  const productsToFix = await getProductsWithMissingSizes()

  if (productsToFix.length === 0) {
    console.log('\n✅ Todos os produtos já têm todas as variantes!')
    return
  }

  // Show summary
  console.log('\n' + '='.repeat(60))
  console.log('📋 RESUMO DOS PRODUTOS PARA CORRIGIR')
  console.log('='.repeat(60))

  // Group by missing sizes
  const sizeSummary = {}
  productsToFix.forEach(p => {
    const key = p.missingSizes.sort().join(', ')
    sizeSummary[key] = (sizeSummary[key] || 0) + 1
  })

  Object.entries(sizeSummary).forEach(([sizes, count]) => {
    console.log(`  ${count} produtos faltando: ${sizes}`)
  })

  // Show first 10 products
  console.log('\nPrimeiros 10 produtos:')
  productsToFix.slice(0, 10).forEach((p, i) => {
    console.log(`${i + 1}. ${p.title} - faltando: ${p.missingSizes.join(', ')}`)
  })

  if (productsToFix.length > 10) {
    console.log(`... e mais ${productsToFix.length - 10} produtos`)
  }

  // Start fixing
  console.log('\n' + '='.repeat(60))
  console.log('🚀 INICIANDO CORREÇÃO')
  console.log('='.repeat(60))

  const report = {
    total: productsToFix.length,
    fixed: 0,
    failed: 0,
    variantsAdded: 0,
    errors: []
  }

  for (let i = 0; i < productsToFix.length; i++) {
    const product = productsToFix[i]

    // Progress indicator
    if (i % 10 === 0 || i === productsToFix.length - 1) {
      const percent = Math.round(((i + 1) / productsToFix.length) * 100)
      console.log(`\n[${i + 1}/${productsToFix.length}] ${percent}% - ${product.title}`)
    } else {
      process.stdout.write('.')
    }

    const result = await addMissingVariants(product)

    if (result.success && result.added > 0) {
      report.fixed++
      report.variantsAdded += result.added
    } else if (!result.success) {
      report.failed++
      report.errors.push({ product: product.title, error: result.error })
    }

    // Rate limiting - 200ms between requests
    await new Promise(resolve => setTimeout(resolve, 200))
  }

  // Final report
  const duration = Math.round((Date.now() - startTime) / 1000)

  console.log('\n\n' + '='.repeat(60))
  console.log('📊 RELATÓRIO FINAL')
  console.log('='.repeat(60))
  console.log(`⏱️  Tempo de execução: ${duration} segundos`)
  console.log(`✅ Produtos corrigidos: ${report.fixed}/${report.total}`)
  console.log(`❌ Falhas: ${report.failed}`)
  console.log(`📦 Total de variantes adicionadas: ${report.variantsAdded}`)

  if (report.errors.length > 0 && report.errors.length <= 10) {
    console.log('\nErros encontrados:')
    report.errors.forEach(err => {
      console.log(`  - ${err.product}: ${err.error}`)
    })
  }

  // Save report
  const fs = await import('fs')
  fs.writeFileSync('VARIANT-FIX-REPORT-V2.json', JSON.stringify(report, null, 2))
  console.log('\n📄 Relatório salvo em: VARIANT-FIX-REPORT-V2.json')

  if (report.failed === 0) {
    console.log('\n🎉 SUCESSO TOTAL! Todas as variantes foram adicionadas!')
    console.log('Execute validate-product-variants.mjs para confirmar.')
  } else {
    console.log('\n⚠️ Algumas correções falharam. Verifique o relatório.')
  }
}

main().catch(console.error)

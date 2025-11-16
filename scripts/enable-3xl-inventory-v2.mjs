#!/usr/bin/env node
/**
 * Script para habilitar inventário de TODAS as variantes 3XL
 * Usa productVariantsBulkUpdate para definir inventoryPolicy como CONTINUE
 */

import 'dotenv/config'

const shopifyDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || process.env.SHOPIFY_STORE_DOMAIN
const adminToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN

const SHOPIFY_API_VERSION = '2024-10'

console.log('='.repeat(60))
console.log('🔧 HABILITANDO INVENTÁRIO PARA VARIANTES 3XL')
console.log('='.repeat(60))

if (!shopifyDomain || !adminToken) {
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

// Get all products with 3XL variants that have DENY policy
async function getProductsWith3XLDeny() {
  const products = []
  let hasNextPage = true
  let cursor = null

  console.log('\n🔄 Buscando produtos com variantes 3XL que precisam de atualização...\n')

  while (hasNextPage) {
    const query = `
      query getAllProducts($first: Int!, $cursor: String) {
        products(first: $first, after: $cursor, query: "status:ACTIVE") {
          edges {
            node {
              id
              title
              variants(first: 100) {
                edges {
                  node {
                    id
                    title
                    inventoryPolicy
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

    // Find products with 3XL variants that have DENY policy
    for (const edge of data.data.products.edges) {
      const product = edge.node

      // Find 3XL variants with DENY policy
      const variantsToUpdate = product.variants.edges
        .filter(v => {
          const sizeOpt = v.node.selectedOptions?.find(o => o.name === 'Size')
          const is3XL = sizeOpt?.value === '3XL' || v.node.title === '3XL'
          return is3XL && v.node.inventoryPolicy === 'DENY'
        })
        .map(v => v.node.id)

      if (variantsToUpdate.length > 0) {
        products.push({
          id: product.id,
          title: product.title,
          variantIds: variantsToUpdate
        })
      }
    }

    hasNextPage = data.data.products.pageInfo.hasNextPage
    cursor = data.data.products.pageInfo.endCursor

    process.stdout.write(`\r📦 Analisados produtos... ${products.length} precisam atualização`)
  }

  console.log(`\n\n✅ Total de produtos para atualizar: ${products.length}`)
  return products
}

// Update variant inventory policies
async function updateProductVariants(product) {
  const mutation = `
    mutation productVariantsBulkUpdate($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
      productVariantsBulkUpdate(productId: $productId, variants: $variants) {
        productVariants {
          id
          inventoryPolicy
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
    variants: product.variantIds.map(variantId => ({
      id: variantId,
      inventoryPolicy: "CONTINUE"
    }))
  }

  try {
    const result = await adminQuery(mutation, variables)

    if (result.errors) {
      return { success: false, error: result.errors[0]?.message }
    }

    if (result.data?.productVariantsBulkUpdate?.userErrors?.length > 0) {
      const errors = result.data.productVariantsBulkUpdate.userErrors
      return { success: false, error: errors[0]?.message }
    }

    const updatedCount = result.data?.productVariantsBulkUpdate?.productVariants?.length || 0
    return { success: true, updated: updatedCount }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

async function main() {
  const startTime = Date.now()

  // Get products needing updates
  const productsToUpdate = await getProductsWith3XLDeny()

  if (productsToUpdate.length === 0) {
    console.log('\n✅ Todas as variantes 3XL já estão habilitadas!')
    return
  }

  // Show summary
  console.log('\n' + '='.repeat(60))
  console.log('📋 RESUMO')
  console.log('='.repeat(60))

  const totalVariants = productsToUpdate.reduce((sum, p) => sum + p.variantIds.length, 0)
  console.log(`Produtos: ${productsToUpdate.length}`)
  console.log(`Variantes 3XL para habilitar: ${totalVariants}`)

  // Start updating
  console.log('\n' + '='.repeat(60))
  console.log('🚀 INICIANDO ATUALIZAÇÃO')
  console.log('='.repeat(60))

  const report = {
    total: productsToUpdate.length,
    success: 0,
    failed: 0,
    variantsUpdated: 0,
    errors: []
  }

  for (let i = 0; i < productsToUpdate.length; i++) {
    const product = productsToUpdate[i]

    // Progress indicator every 20 products
    if (i % 20 === 0) {
      const percent = Math.round(((i + 1) / productsToUpdate.length) * 100)
      console.log(`\n[${i + 1}/${productsToUpdate.length}] ${percent}%`)
    }

    const result = await updateProductVariants(product)

    if (result.success) {
      report.success++
      report.variantsUpdated += result.updated
      process.stdout.write('✓')
    } else {
      report.failed++
      report.errors.push({ product: product.title, error: result.error })
      process.stdout.write('✗')
    }

    // Rate limiting - 150ms between requests
    await new Promise(resolve => setTimeout(resolve, 150))
  }

  // Final report
  const duration = Math.round((Date.now() - startTime) / 1000)

  console.log('\n\n' + '='.repeat(60))
  console.log('📊 RELATÓRIO FINAL')
  console.log('='.repeat(60))
  console.log(`⏱️  Tempo de execução: ${duration} segundos`)
  console.log(`✅ Produtos atualizados: ${report.success}/${report.total}`)
  console.log(`❌ Falhas: ${report.failed}`)
  console.log(`📦 Total de variantes habilitadas: ${report.variantsUpdated}`)

  if (report.errors.length > 0 && report.errors.length <= 10) {
    console.log('\nErros encontrados:')
    report.errors.forEach(err => {
      console.log(`  - ${err.product}: ${err.error}`)
    })
  }

  // Save report
  const fs = await import('fs')
  fs.writeFileSync('3XL-INVENTORY-UPDATE-REPORT.json', JSON.stringify(report, null, 2))
  console.log('\n📄 Relatório salvo em: 3XL-INVENTORY-UPDATE-REPORT.json')

  if (report.failed === 0) {
    console.log('\n🎉 SUCESSO TOTAL! Todas as variantes 3XL agora estão disponíveis para venda!')
    console.log('Execute validate-product-variants.mjs para confirmar 0 warnings.')
  } else {
    console.log('\n⚠️ Algumas atualizações falharam. Verifique o relatório.')
  }
}

main().catch(console.error)

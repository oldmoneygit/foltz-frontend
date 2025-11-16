#!/usr/bin/env node
/**
 * Script para habilitar inventário das variantes 3XL
 * Define todas as variantes 3XL como "Continue selling when out of stock"
 */

import 'dotenv/config'

const shopifyDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || process.env.SHOPIFY_STORE_DOMAIN
const adminToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN

const SHOPIFY_API_VERSION = '2024-10'

console.log('='.repeat(60))
console.log('🔧 HABILITANDO INVENTÁRIO DAS VARIANTES 3XL')
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

// Get all 3XL variants that need updating
async function get3XLVariants() {
  const variants = []
  let hasNextPage = true
  let cursor = null

  console.log('\n🔄 Buscando variantes 3XL...\n')

  while (hasNextPage) {
    const query = `
      query getVariants($first: Int!, $cursor: String) {
        productVariants(first: $first, after: $cursor, query: "option1:3XL OR title:3XL") {
          edges {
            node {
              id
              title
              displayName
              inventoryPolicy
              product {
                title
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

    const data = await adminQuery(query, { first: 250, cursor })

    if (data.errors) {
      console.error('GraphQL errors:', data.errors)
      break
    }

    if (!data.data?.productVariants) break

    variants.push(...data.data.productVariants.edges.map(e => e.node))

    hasNextPage = data.data.productVariants.pageInfo.hasNextPage
    cursor = data.data.productVariants.pageInfo.endCursor

    process.stdout.write(`\r📦 Encontrado: ${variants.length} variantes 3XL...`)
  }

  console.log(`\n\n✅ Total de variantes 3XL encontradas: ${variants.length}`)
  return variants
}

// Update variant to allow selling when out of stock
async function updateVariantInventoryPolicy(variantId) {
  const mutation = `
    mutation productVariantUpdate($input: ProductVariantInput!) {
      productVariantUpdate(input: $input) {
        productVariant {
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
    input: {
      id: variantId,
      inventoryPolicy: "CONTINUE"
    }
  }

  const result = await adminQuery(mutation, variables)

  if (result.errors) {
    return { success: false, error: result.errors[0]?.message }
  }

  if (result.data?.productVariantUpdate?.userErrors?.length > 0) {
    return { success: false, error: result.data.productVariantUpdate.userErrors[0]?.message }
  }

  return { success: true }
}

async function main() {
  const startTime = Date.now()

  // Get all 3XL variants
  const variants = await get3XLVariants()

  if (variants.length === 0) {
    console.log('Nenhuma variante 3XL encontrada.')
    return
  }

  // Filter variants that need updating (inventoryPolicy != CONTINUE)
  const variantsToUpdate = variants.filter(v => v.inventoryPolicy !== 'CONTINUE')

  console.log(`\n📊 Variantes que precisam atualização: ${variantsToUpdate.length}`)

  if (variantsToUpdate.length === 0) {
    console.log('✅ Todas as variantes já estão configuradas corretamente!')
    return
  }

  // Update each variant
  console.log('\n' + '='.repeat(60))
  console.log('🚀 ATUALIZANDO INVENTÁRIO')
  console.log('='.repeat(60))

  const report = {
    total: variantsToUpdate.length,
    updated: 0,
    failed: 0,
    errors: []
  }

  for (let i = 0; i < variantsToUpdate.length; i++) {
    const variant = variantsToUpdate[i]

    if (i % 20 === 0 || i === variantsToUpdate.length - 1) {
      const percent = Math.round(((i + 1) / variantsToUpdate.length) * 100)
      console.log(`\n[${i + 1}/${variantsToUpdate.length}] ${percent}% - ${variant.product.title} / ${variant.title}`)
    } else {
      process.stdout.write('.')
    }

    const result = await updateVariantInventoryPolicy(variant.id)

    if (result.success) {
      report.updated++
    } else {
      report.failed++
      report.errors.push({ variant: variant.displayName, error: result.error })
    }

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  // Final report
  const duration = Math.round((Date.now() - startTime) / 1000)

  console.log('\n\n' + '='.repeat(60))
  console.log('📊 RELATÓRIO FINAL')
  console.log('='.repeat(60))
  console.log(`⏱️  Tempo: ${duration} segundos`)
  console.log(`✅ Atualizadas: ${report.updated}/${report.total}`)
  console.log(`❌ Falhas: ${report.failed}`)

  if (report.errors.length > 0 && report.errors.length <= 10) {
    console.log('\nErros:')
    report.errors.forEach(err => {
      console.log(`  - ${err.variant}: ${err.error}`)
    })
  }

  // Save report
  const fs = await import('fs')
  fs.writeFileSync('3XL-INVENTORY-UPDATE-REPORT.json', JSON.stringify(report, null, 2))
  console.log('\n📄 Relatório salvo em: 3XL-INVENTORY-UPDATE-REPORT.json')

  if (report.failed === 0) {
    console.log('\n🎉 SUCESSO! Todas as variantes 3XL agora estão disponíveis para venda!')
  }
}

main().catch(console.error)

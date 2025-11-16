#!/usr/bin/env node
/**
 * Fix ALL issues:
 * 1. Set inventory policy to CONTINUE for all variants
 * 2. Update all prices to $36,900
 */

import 'dotenv/config'

const shopifyDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
const adminToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN
const TARGET_PRICE = '36900.00'

console.log('='.repeat(60))
console.log('CORREÇÃO COMPLETA DE PRODUTOS')
console.log('='.repeat(60))

async function adminQuery(query, variables = {}) {
  const url = `https://${shopifyDomain}/admin/api/2024-10/graphql.json`
  const r = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': adminToken,
    },
    body: JSON.stringify({ query, variables })
  })
  return r.json()
}

async function getAllProductsWithIssues() {
  const productsToFix = []
  let hasNextPage = true
  let cursor = null
  let pageCount = 0

  console.log('\n🔍 Buscando produtos com problemas...')

  while (hasNextPage) {
    pageCount++
    const query = `
      query getProducts($first: Int!, $cursor: String) {
        products(first: $first, after: $cursor, query: "status:ACTIVE") {
          edges {
            node {
              id
              title
              variants(first: 10) {
                edges {
                  node {
                    id
                    title
                    price
                    inventoryPolicy
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

    const data = await adminQuery(query, { first: 250, cursor })

    if (!data.data?.products) break

    for (const edge of data.data.products.edges) {
      const product = edge.node
      const variantsToFix = []

      for (const variant of product.variants.edges) {
        const needsPriceFix = variant.node.price !== TARGET_PRICE
        const needsInventoryFix = variant.node.inventoryPolicy === 'DENY'

        if (needsPriceFix || needsInventoryFix) {
          variantsToFix.push({
            id: variant.node.id,
            price: TARGET_PRICE,
            inventoryPolicy: 'CONTINUE'
          })
        }
      }

      if (variantsToFix.length > 0) {
        productsToFix.push({
          id: product.id,
          title: product.title,
          variants: variantsToFix
        })
      }
    }

    hasNextPage = data.data.products.pageInfo.hasNextPage
    cursor = data.data.products.pageInfo.endCursor

    process.stdout.write(`\r📦 Páginas analisadas: ${pageCount}`)
  }

  console.log(`\n✅ ${productsToFix.length} produtos precisam de correção`)
  return productsToFix
}

async function fixProduct(product) {
  const mutation = `
    mutation productVariantsBulkUpdate($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
      productVariantsBulkUpdate(productId: $productId, variants: $variants) {
        productVariants {
          id
          price
          inventoryPolicy
        }
        userErrors {
          field
          message
        }
      }
    }
  `

  const result = await adminQuery(mutation, {
    productId: product.id,
    variants: product.variants
  })

  if (result.errors) {
    return { success: false, error: result.errors[0]?.message }
  }

  if (result.data?.productVariantsBulkUpdate?.userErrors?.length > 0) {
    return { success: false, error: result.data.productVariantsBulkUpdate.userErrors[0]?.message }
  }

  return {
    success: true,
    updated: result.data?.productVariantsBulkUpdate?.productVariants?.length || 0
  }
}

async function main() {
  const startTime = Date.now()

  const productsToFix = await getAllProductsWithIssues()

  if (productsToFix.length === 0) {
    console.log('\n✅ Nenhum produto precisa de correção!')
    return
  }

  const totalVariants = productsToFix.reduce((sum, p) => sum + p.variants.length, 0)
  console.log(`\n📊 Total de variantes para corrigir: ${totalVariants}`)

  console.log('\n🚀 Iniciando correções...')

  const report = {
    success: 0,
    failed: 0,
    variantsFixed: 0,
    errors: []
  }

  for (let i = 0; i < productsToFix.length; i++) {
    const product = productsToFix[i]

    if (i % 50 === 0) {
      const percent = Math.round(((i + 1) / productsToFix.length) * 100)
      console.log(`\n[${i + 1}/${productsToFix.length}] ${percent}%`)
    }

    const result = await fixProduct(product)

    if (result.success) {
      report.success++
      report.variantsFixed += result.updated
      process.stdout.write('✓')
    } else {
      report.failed++
      report.errors.push({ product: product.title, error: result.error })
      process.stdout.write('✗')
    }

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  const duration = Math.round((Date.now() - startTime) / 1000)

  console.log('\n\n' + '='.repeat(60))
  console.log('📊 RELATÓRIO FINAL')
  console.log('='.repeat(60))
  console.log(`⏱️  Tempo: ${duration} segundos`)
  console.log(`✅ Produtos corrigidos: ${report.success}/${productsToFix.length}`)
  console.log(`❌ Falhas: ${report.failed}`)
  console.log(`📦 Variantes atualizadas: ${report.variantsFixed}`)

  if (report.errors.length > 0) {
    console.log('\nErros:')
    report.errors.slice(0, 10).forEach(err => {
      console.log(`  - ${err.product}: ${err.error}`)
    })
  }

  if (report.failed === 0) {
    console.log('\n🎉 SUCESSO TOTAL!')
    console.log('✅ Todos os preços atualizados para $36,900')
    console.log('✅ Todas as políticas de inventário definidas como CONTINUE')
  }
}

main().catch(console.error)

#!/usr/bin/env node
/**
 * Verify all products: prices, variants, and checkout mapping
 */

import 'dotenv/config'

const shopifyDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
const adminToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN
const EXPECTED_PRICE = 36900

console.log('='.repeat(60))
console.log('VERIFICAÇÃO COMPLETA DE PRODUTOS')
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

async function getAllProducts() {
  const products = []
  let hasNextPage = true
  let cursor = null

  while (hasNextPage) {
    const query = `
      query getProducts($first: Int!, $cursor: String) {
        products(first: $first, after: $cursor, query: "status:ACTIVE") {
          edges {
            node {
              id
              title
              handle
              productType
              tags
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

    products.push(...data.data.products.edges.map(e => e.node))
    hasNextPage = data.data.products.pageInfo.hasNextPage
    cursor = data.data.products.pageInfo.endCursor
  }

  return products
}

async function main() {
  const products = await getAllProducts()

  console.log(`\nTotal de produtos ativos: ${products.length}\n`)

  // 1. Check prices
  console.log('1. VERIFICAÇÃO DE PREÇOS')
  console.log('-'.repeat(60))

  const priceIssues = []
  const priceDistribution = {}

  for (const product of products) {
    for (const variant of product.variants.edges) {
      const price = parseFloat(variant.node.price)
      priceDistribution[price] = (priceDistribution[price] || 0) + 1

      if (price !== EXPECTED_PRICE) {
        priceIssues.push({
          product: product.title,
          variant: variant.node.title,
          price: price
        })
      }
    }
  }

  console.log('Distribuição de preços:')
  Object.entries(priceDistribution)
    .sort((a, b) => b[1] - a[1])
    .forEach(([price, count]) => {
      const status = parseFloat(price) === EXPECTED_PRICE ? '✅' : '⚠️'
      console.log(`  ${status} $${price}: ${count} variantes`)
    })

  if (priceIssues.length > 0) {
    console.log(`\n⚠️ ${priceIssues.length} variantes com preço diferente de $${EXPECTED_PRICE}:`)
    priceIssues.slice(0, 10).forEach(issue => {
      console.log(`  - ${issue.product} (${issue.variant}): $${issue.price}`)
    })
    if (priceIssues.length > 10) {
      console.log(`  ... e mais ${priceIssues.length - 10}`)
    }
  } else {
    console.log(`\n✅ TODOS os produtos têm preço correto de $${EXPECTED_PRICE}`)
  }

  // 2. Check variants (should have S, M, L, XL, XXL, 3XL)
  console.log('\n2. VERIFICAÇÃO DE VARIANTES')
  console.log('-'.repeat(60))

  const expectedSizes = ['S', 'M', 'L', 'XL', 'XXL', '3XL']
  const variantIssues = []

  for (const product of products) {
    const variantTitles = product.variants.edges.map(v => v.node.title)
    const missingSizes = expectedSizes.filter(size => !variantTitles.includes(size))

    if (missingSizes.length > 0) {
      variantIssues.push({
        product: product.title,
        has: variantTitles,
        missing: missingSizes
      })
    }
  }

  if (variantIssues.length > 0) {
    console.log(`⚠️ ${variantIssues.length} produtos com tamanhos faltando:`)
    variantIssues.slice(0, 10).forEach(issue => {
      console.log(`  - ${issue.product}`)
      console.log(`    Tem: ${issue.has.join(', ')}`)
      console.log(`    Falta: ${issue.missing.join(', ')}`)
    })
  } else {
    console.log(`✅ TODOS os produtos têm todas as variantes: ${expectedSizes.join(', ')}`)
  }

  // 3. Check inventory policy
  console.log('\n3. VERIFICAÇÃO DE POLÍTICA DE INVENTÁRIO')
  console.log('-'.repeat(60))

  let denyCount = 0
  let continueCount = 0

  for (const product of products) {
    for (const variant of product.variants.edges) {
      if (variant.node.inventoryPolicy === 'DENY') {
        denyCount++
      } else {
        continueCount++
      }
    }
  }

  console.log(`  CONTINUE (permite venda): ${continueCount} variantes`)
  console.log(`  DENY (bloqueia venda): ${denyCount} variantes`)

  if (denyCount > 0) {
    console.log(`\n⚠️ ${denyCount} variantes ainda com política DENY (pode bloquear vendas)`)
  } else {
    console.log(`\n✅ TODAS as variantes permitem venda (CONTINUE)`)
  }

  // 4. Check Mystery Box products
  console.log('\n4. VERIFICAÇÃO DE MYSTERY BOX')
  console.log('-'.repeat(60))

  const mysteryBoxProducts = products.filter(p => {
    const title = p.title.toLowerCase()
    const tags = p.tags.map(t => t.toLowerCase()).join(' ')
    return title.includes('mysterybox') || title.includes('mystery box') || tags.includes('mysterybox')
  })

  if (mysteryBoxProducts.length === 0) {
    console.log('❌ Nenhum produto Mystery Box encontrado')
  } else {
    console.log(`✅ ${mysteryBoxProducts.length} produtos Mystery Box encontrados:`)
    mysteryBoxProducts.forEach(p => {
      console.log(`  - ${p.title}`)
      console.log(`    Handle: ${p.handle}`)
      console.log(`    Variantes: ${p.variants.edges.map(v => `${v.node.title}=$${v.node.price}`).join(', ')}`)
    })
  }

  // 5. Summary
  console.log('\n' + '='.repeat(60))
  console.log('RESUMO FINAL')
  console.log('='.repeat(60))

  const allPricesCorrect = priceIssues.length === 0
  const allVariantsCorrect = variantIssues.length === 0
  const allInventoryCorrect = denyCount === 0
  const hasMysteryBox = mysteryBoxProducts.length > 0

  console.log(`✅ Total de produtos: ${products.length}`)
  console.log(`${allPricesCorrect ? '✅' : '❌'} Preços ($${EXPECTED_PRICE}): ${allPricesCorrect ? 'OK' : `${priceIssues.length} com problema`}`)
  console.log(`${allVariantsCorrect ? '✅' : '❌'} Variantes (S-3XL): ${allVariantsCorrect ? 'OK' : `${variantIssues.length} incompletos`}`)
  console.log(`${allInventoryCorrect ? '✅' : '❌'} Inventário (CONTINUE): ${allInventoryCorrect ? 'OK' : `${denyCount} com DENY`}`)
  console.log(`${hasMysteryBox ? '✅' : '❌'} Mystery Box: ${hasMysteryBox ? `${mysteryBoxProducts.length} produtos` : 'NÃO ENCONTRADO'}`)

  if (allPricesCorrect && allVariantsCorrect && allInventoryCorrect) {
    console.log('\n🎉 TUDO PERFEITO! Produtos prontos para produção.')
  } else {
    console.log('\n⚠️ Alguns problemas encontrados. Verifique acima.')
  }
}

main().catch(console.error)

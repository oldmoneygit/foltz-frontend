#!/usr/bin/env node
/**
 * Script para validar que TODOS os produtos do Shopify têm variantes corretas
 * para garantir que o checkout funcione sem erros
 */

import 'dotenv/config'
// Using native fetch (Node.js 18+)

const shopifyDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || process.env.SHOPIFY_STORE_DOMAIN
const accessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN

const SHOPIFY_API_VERSION = '2024-10'

if (!shopifyDomain || !accessToken) {
  console.error('❌ Missing Shopify credentials')
  process.exit(1)
}

// Query GraphQL do Shopify
async function shopifyQuery(query, variables = {}) {
  const url = `https://${shopifyDomain}/api/${SHOPIFY_API_VERSION}/graphql.json`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': accessToken,
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

// Buscar TODOS os produtos com paginação
async function getAllProductsWithVariants() {
  const products = []
  let hasNextPage = true
  let cursor = null

  console.log('🔄 Buscando TODOS os produtos do Shopify com variantes...\n')

  while (hasNextPage) {
    const query = `
      query getAllProducts($first: Int!, $cursor: String) {
        products(first: $first, after: $cursor) {
          edges {
            node {
              id
              handle
              title
              productType
              tags
              options {
                name
                values
              }
              variants(first: 100) {
                edges {
                  node {
                    id
                    title
                    availableForSale
                    price {
                      amount
                      currencyCode
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

    const data = await shopifyQuery(query, { first: 250, cursor })

    if (!data.products) break

    products.push(...data.products.edges.map(e => e.node))

    hasNextPage = data.products.pageInfo.hasNextPage
    cursor = data.products.pageInfo.endCursor

    console.log(`📦 Carregado: ${products.length} produtos...`)
  }

  console.log(`\n✅ Total de produtos carregados: ${products.length}\n`)
  return products
}

// Validar produto
function validateProduct(product) {
  const issues = []
  const warnings = []

  // 1. Verificar se tem variantes
  if (!product.variants || !product.variants.edges || product.variants.edges.length === 0) {
    issues.push('❌ SEM VARIANTES - Checkout impossível')
    return { issues, warnings, sizes: [] }
  }

  // 2. Extrair tamanhos disponíveis
  const sizes = []
  const variantMap = {}

  product.variants.edges.forEach(({ node: variant }) => {
    const sizeOption = variant.selectedOptions?.find(opt => opt.name === 'Size')
    const size = sizeOption?.value || variant.title

    sizes.push(size)
    variantMap[size] = {
      id: variant.id,
      availableForSale: variant.availableForSale,
      price: variant.price.amount
    }
  })

  // 3. Verificar tamanhos padrão
  const standardSizes = ['S', 'M', 'L', 'XL', 'XXL']
  const missingSizes = standardSizes.filter(s => !sizes.includes(s))

  if (missingSizes.length > 0) {
    warnings.push(`⚠️ Tamanhos faltando: ${missingSizes.join(', ')}`)
  }

  // 4. Verificar se variantes estão disponíveis para venda
  const unavailableSizes = []
  product.variants.edges.forEach(({ node: variant }) => {
    if (!variant.availableForSale) {
      const size = variant.selectedOptions?.find(opt => opt.name === 'Size')?.value || variant.title
      unavailableSizes.push(size)
    }
  })

  if (unavailableSizes.length > 0) {
    warnings.push(`⚠️ Tamanhos não disponíveis: ${unavailableSizes.join(', ')}`)
  }

  // 5. Verificar IDs das variantes (formato correto do Shopify)
  const invalidVariants = []
  product.variants.edges.forEach(({ node: variant }) => {
    if (!variant.id.includes('gid://shopify/ProductVariant/')) {
      invalidVariants.push(variant.title)
    }
  })

  if (invalidVariants.length > 0) {
    issues.push(`❌ IDs de variantes inválidos: ${invalidVariants.join(', ')}`)
  }

  return { issues, warnings, sizes, variantMap }
}

// Função principal
async function main() {
  console.log('=' .repeat(60))
  console.log('🔍 VALIDAÇÃO DE VARIANTES DE PRODUTOS - FOLTZ FANWEAR')
  console.log('=' .repeat(60))
  console.log('')

  const products = await getAllProductsWithVariants()

  // Filtrar productos mysterybox
  const activeProducts = products.filter(p => {
    const title = p.title.toLowerCase()
    const tags = (p.tags || []).join(' ').toLowerCase()
    return !title.includes('mysterybox') && !tags.includes('mysterybox')
  })

  console.log(`📊 Produtos ativos (excluindo mysterybox): ${activeProducts.length}\n`)

  const report = {
    total: activeProducts.length,
    valid: 0,
    withIssues: [],
    withWarnings: [],
    sizeDistribution: {}
  }

  // Validar cada produto
  for (const product of activeProducts) {
    const { issues, warnings, sizes, variantMap } = validateProduct(product)

    if (issues.length > 0) {
      report.withIssues.push({
        handle: product.handle,
        title: product.title,
        id: product.id,
        issues,
        warnings
      })
    } else if (warnings.length > 0) {
      report.withWarnings.push({
        handle: product.handle,
        title: product.title,
        id: product.id,
        warnings,
        sizes
      })
      report.valid++
    } else {
      report.valid++
    }

    // Distribuição de tamanhos
    sizes.forEach(size => {
      report.sizeDistribution[size] = (report.sizeDistribution[size] || 0) + 1
    })
  }

  // Relatório final
  console.log('=' .repeat(60))
  console.log('📋 RELATÓRIO DE VALIDAÇÃO')
  console.log('=' .repeat(60))
  console.log('')

  console.log(`✅ Produtos válidos para checkout: ${report.valid}/${report.total}`)
  console.log(`❌ Produtos com problemas críticos: ${report.withIssues.length}`)
  console.log(`⚠️ Produtos com avisos: ${report.withWarnings.length}`)
  console.log('')

  // Mostrar problemas críticos
  if (report.withIssues.length > 0) {
    console.log('=' .repeat(60))
    console.log('❌ PRODUTOS COM PROBLEMAS CRÍTICOS (Checkout vai falhar)')
    console.log('=' .repeat(60))
    report.withIssues.forEach((p, i) => {
      console.log(`\n${i + 1}. ${p.title}`)
      console.log(`   Handle: ${p.handle}`)
      console.log(`   ID: ${p.id}`)
      p.issues.forEach(issue => console.log(`   ${issue}`))
    })
    console.log('')
  }

  // Mostrar avisos (opcional - muitos podem existir)
  if (report.withWarnings.length > 0 && report.withWarnings.length <= 20) {
    console.log('=' .repeat(60))
    console.log('⚠️ PRODUTOS COM AVISOS (Checkout funciona, mas incompleto)')
    console.log('=' .repeat(60))
    report.withWarnings.slice(0, 10).forEach((p, i) => {
      console.log(`\n${i + 1}. ${p.title}`)
      console.log(`   Tamanhos disponíveis: ${p.sizes.join(', ')}`)
      p.warnings.forEach(w => console.log(`   ${w}`))
    })
    if (report.withWarnings.length > 10) {
      console.log(`\n... e mais ${report.withWarnings.length - 10} produtos com avisos`)
    }
    console.log('')
  }

  // Distribuição de tamanhos
  console.log('=' .repeat(60))
  console.log('📊 DISTRIBUIÇÃO DE TAMANHOS')
  console.log('=' .repeat(60))
  const sortedSizes = ['S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL']
  sortedSizes.forEach(size => {
    if (report.sizeDistribution[size]) {
      console.log(`${size}: ${report.sizeDistribution[size]} produtos`)
    }
  })
  console.log('')

  // Resultado final
  console.log('=' .repeat(60))
  console.log('🎯 RESULTADO FINAL')
  console.log('=' .repeat(60))

  if (report.withIssues.length === 0) {
    console.log('✅ SUCESSO! Todos os produtos têm variantes válidas para checkout!')
    console.log('✅ O checkout funcionará corretamente para TODOS os produtos.')
  } else {
    console.log(`❌ ATENÇÃO! ${report.withIssues.length} produtos não poderão ser comprados!`)
    console.log('❌ É necessário corrigir esses produtos no Shopify antes do checkout.')
  }
  console.log('')

  // Salvar relatório
  const fs = await import('fs')
  const reportFile = 'VARIANT-VALIDATION-REPORT.json'
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2))
  console.log(`📄 Relatório completo salvo em: ${reportFile}`)
}

main().catch(console.error)

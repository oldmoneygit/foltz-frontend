#!/usr/bin/env node
/**
 * Script para testar a criação de variantes usando a Admin API
 */

import 'dotenv/config'

const shopifyDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || process.env.SHOPIFY_STORE_DOMAIN
const adminToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN

const SHOPIFY_API_VERSION = '2024-10'

console.log('🔧 Testando criação de variantes')
console.log('Domain:', shopifyDomain)
console.log('')

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

  const data = await response.json()
  return data
}

async function main() {
  // 1. Get product that only has M size (e.g., Everton)
  console.log('📦 Buscando produto com tamanho faltante...')

  const searchQuery = `
    query {
      products(first: 10, query: "status:ACTIVE") {
        edges {
          node {
            id
            title
            options {
              name
              values
            }
            variants(first: 20) {
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
      }
    }
  `

  const searchData = await adminQuery(searchQuery)

  if (searchData.errors) {
    console.error('❌ Erro na busca:', searchData.errors)
    return
  }

  // Find a product missing 3XL
  let targetProduct = null
  for (const edge of searchData.data.products.edges) {
    const product = edge.node
    const sizes = product.variants.edges.map(v => {
      const sizeOpt = v.node.selectedOptions?.find(o => o.name === 'Size')
      return sizeOpt?.value || v.node.title
    })

    if (!sizes.includes('3XL') && sizes.length > 0) {
      targetProduct = product
      console.log(`✅ Produto encontrado: ${product.title}`)
      console.log(`   Tamanhos existentes: ${sizes.join(', ')}`)
      console.log(`   Product ID: ${product.id}`)
      console.log(`   Options: ${JSON.stringify(product.options)}`)
      break
    }
  }

  if (!targetProduct) {
    console.log('❌ Nenhum produto encontrado que precise de 3XL')
    return
  }

  // 2. Try to create the variant
  console.log('\n🔧 Tentando adicionar variante 3XL...')

  const price = targetProduct.variants.edges[0].node.price

  const mutation = `
    mutation productVariantCreate($input: ProductVariantInput!) {
      productVariantCreate(input: $input) {
        productVariant {
          id
          title
          price
          selectedOptions {
            name
            value
          }
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
      productId: targetProduct.id,
      price: price,
      options: ["3XL"]
    }
  }

  console.log('Input:', JSON.stringify(variables, null, 2))

  const mutationResult = await adminQuery(mutation, variables)

  console.log('\n📊 Resultado da mutação:')
  console.log(JSON.stringify(mutationResult, null, 2))

  if (mutationResult.data?.productVariantCreate?.userErrors?.length > 0) {
    console.log('\n❌ Erros encontrados:')
    mutationResult.data.productVariantCreate.userErrors.forEach(err => {
      console.log(`  - ${err.field}: ${err.message}`)
    })
  } else if (mutationResult.data?.productVariantCreate?.productVariant) {
    console.log('\n✅ Variante criada com sucesso!')
    console.log('   ID:', mutationResult.data.productVariantCreate.productVariant.id)
    console.log('   Title:', mutationResult.data.productVariantCreate.productVariant.title)
  } else if (mutationResult.errors) {
    console.log('\n❌ Erros GraphQL:')
    mutationResult.errors.forEach(err => {
      console.log(`  - ${err.message}`)
    })
  }
}

main().catch(console.error)

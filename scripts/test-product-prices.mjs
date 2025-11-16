#!/usr/bin/env node
/**
 * Script para testar se os preços comparados estão sendo buscados corretamente
 */

import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '../.env.local') })

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN
const SHOPIFY_API_VERSION = '2024-10'

async function storefrontRequest(query, variables = {}) {
  const url = `https://${domain}/api/${SHOPIFY_API_VERSION}/graphql.json`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  })

  const data = await response.json()

  if (data.errors) {
    throw new Error(`Shopify API Error: ${JSON.stringify(data.errors)}`)
  }

  return data
}

async function testProductPrices() {
  const query = `
    query getProducts {
      products(first: 5) {
        edges {
          node {
            title
            handle
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
            variants(first: 1) {
              edges {
                node {
                  price {
                    amount
                    currencyCode
                  }
                  compareAtPrice {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
    }
  `

  const response = await storefrontRequest(query)
  return response.data.products.edges
}

async function main() {
  console.log('\n🔍 TESTE DE PREÇOS COMPARADOS\n')
  console.log('='.repeat(70))

  try {
    const products = await testProductPrices()

    console.log('\n📦 Primeiros 5 produtos:\n')

    products.forEach(({ node: product }, index) => {
      const price = parseFloat(product.priceRange.minVariantPrice.amount)
      const compareAtPrice = product.compareAtPriceRange?.minVariantPrice?.amount
        ? parseFloat(product.compareAtPriceRange.minVariantPrice.amount)
        : null

      const variant = product.variants.edges[0]?.node
      const variantPrice = variant ? parseFloat(variant.price.amount) : null
      const variantCompare = variant?.compareAtPrice?.amount
        ? parseFloat(variant.compareAtPrice.amount)
        : null

      console.log(`${index + 1}. ${product.title}`)
      console.log(`   Handle: ${product.handle}`)
      console.log(`   💰 Preço (priceRange): ${price.toFixed(2)}`)
      console.log(`   🏷️  Comparado (compareAtPriceRange): ${compareAtPrice ? compareAtPrice.toFixed(2) : 'NULO'}`)
      console.log(`   💰 Preço (variant): ${variantPrice ? variantPrice.toFixed(2) : 'N/A'}`)
      console.log(`   🏷️  Comparado (variant): ${variantCompare ? variantCompare.toFixed(2) : 'NULO'}`)

      // Calcular diferença percentual
      if (compareAtPrice && compareAtPrice > price) {
        const diff = ((compareAtPrice - price) / price * 100).toFixed(1)
        console.log(`   📊 Diferença: +${diff}% (${compareAtPrice > 0 ? '✅ OK' : '❌ PROBLEMA'})`)
      } else {
        console.log(`   ⚠️  SEM PREÇO COMPARADO!`)
      }
      console.log()
    })

    console.log('='.repeat(70))
    console.log('\n✅ Teste concluído!\n')

  } catch (error) {
    console.error('\n❌ Erro:', error.message)
    process.exit(1)
  }
}

main()

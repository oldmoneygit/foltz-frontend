#!/usr/bin/env node
/**
 * Add missing M size to 7 specific products
 */

import 'dotenv/config'

const shopifyDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || process.env.SHOPIFY_STORE_DOMAIN
const adminToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN
const SHOPIFY_API_VERSION = '2024-10'

const PRODUCTS_MISSING_M = [
  'Everton 25/26 Home',
  'Boca Juniors 2001 Retro Home',
  'Boca Juniors 2005 Retro Home',
  'Inter Milan',
  'Villarreal 25/26 Away',
  'Sporting Lisbon Size   Black 25/26 Goalkeeper',
  'Sporting Lisbon Size   Green 25/26 Goalkeeper'
]

console.log('🔧 Adding M size to products missing it...\n')

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

async function main() {
  // Find products
  for (const title of PRODUCTS_MISSING_M) {
    console.log(`\n📦 Processing: ${title}`)

    const searchQuery = `
      query {
        products(first: 10, query: "title:${title.replace(/"/g, '\\"')}") {
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
      console.error('Error:', searchData.errors)
      continue
    }

    const product = searchData.data?.products?.edges?.find(
      e => e.node.title === title || e.node.title.includes(title.split(' ')[0])
    )?.node

    if (!product) {
      console.log(`  ❌ Product not found`)
      continue
    }

    console.log(`  Found: ${product.title} (${product.id})`)

    // Check if already has M
    const hasM = product.variants.edges.some(v => {
      const sizeOpt = v.node.selectedOptions?.find(o => o.name === 'Size')
      return sizeOpt?.value === 'M' || v.node.title === 'M'
    })

    if (hasM) {
      console.log(`  ✅ Already has M size`)
      continue
    }

    // Add M variant
    const price = product.variants.edges[0]?.node.price || '32900'

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
      variants: [{
        price: price,
        optionValues: [{ optionName: "Size", name: "M" }]
      }]
    }

    const result = await adminQuery(mutation, variables)

    if (result.errors) {
      console.log(`  ❌ Error:`, result.errors[0]?.message)
    } else if (result.data?.productVariantsBulkCreate?.userErrors?.length > 0) {
      console.log(`  ❌ User error:`, result.data.productVariantsBulkCreate.userErrors[0]?.message)
    } else if (result.data?.productVariantsBulkCreate?.productVariants?.length > 0) {
      console.log(`  ✅ Added M size successfully`)
    }

    await new Promise(r => setTimeout(r, 200))
  }

  console.log('\n✅ Done!')
}

main().catch(console.error)

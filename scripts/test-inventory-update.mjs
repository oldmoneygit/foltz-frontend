#!/usr/bin/env node
/**
 * Test inventory policy update
 */

import 'dotenv/config'

const shopifyDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || process.env.SHOPIFY_STORE_DOMAIN
const adminToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN
const SHOPIFY_API_VERSION = '2024-10'

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
  // 1. Get a 3XL variant
  console.log('🔍 Buscando uma variante 3XL...')

  const query = `
    query {
      productVariants(first: 1, query: "title:3XL") {
        edges {
          node {
            id
            title
            displayName
            inventoryPolicy
            inventoryItem {
              id
            }
          }
        }
      }
    }
  `

  const data = await adminQuery(query)

  if (data.errors) {
    console.error('Erro:', data.errors)
    return
  }

  const variant = data.data.productVariants.edges[0]?.node
  if (!variant) {
    console.log('Nenhuma variante encontrada')
    return
  }

  console.log('Variante:', variant.displayName)
  console.log('ID:', variant.id)
  console.log('Inventory Policy:', variant.inventoryPolicy)
  console.log('Inventory Item ID:', variant.inventoryItem?.id)

  // 2. Test using productVariantsBulkUpdate
  console.log('\n🔧 Testando productVariantsBulkUpdate...')

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

  // First get the product ID
  const productQuery = `
    query getVariant($id: ID!) {
      productVariant(id: $id) {
        id
        product {
          id
        }
      }
    }
  `

  const productData = await adminQuery(productQuery, { id: variant.id })
  const productId = productData.data?.productVariant?.product?.id

  console.log('Product ID:', productId)

  const variables = {
    productId: productId,
    variants: [{
      id: variant.id,
      inventoryPolicy: "CONTINUE"
    }]
  }

  console.log('Variables:', JSON.stringify(variables, null, 2))

  const result = await adminQuery(mutation, variables)
  console.log('\nResultado:', JSON.stringify(result, null, 2))
}

main().catch(console.error)

#!/usr/bin/env node
/**
 * Fix inventory for 7 specific products (enable CONTINUE policy)
 */

import 'dotenv/config'

const shopifyDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
const adminToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN

const PRODUCT_IDS = [
  'gid://shopify/Product/15673664635260', // Everton
  'gid://shopify/Product/15673671025020', // Boca 2001
  'gid://shopify/Product/15673671287164', // Boca 2005
  'gid://shopify/Product/15673675809148', // Inter Milan
  'gid://shopify/Product/15673767231868', // Villarreal
  'gid://shopify/Product/15673780076924', // Sporting Black
  'gid://shopify/Product/15673780371836'  // Sporting Green
]

console.log('🔧 Fixing inventory for 7 products...\n')

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

async function main() {
  for (const productId of PRODUCT_IDS) {
    // Get product variants
    const query = `
      query getProduct($id: ID!) {
        product(id: $id) {
          id
          title
          variants(first: 20) {
            edges {
              node {
                id
                title
                inventoryPolicy
              }
            }
          }
        }
      }
    `

    const data = await adminQuery(query, { id: productId })
    const product = data.data?.product

    if (!product) {
      console.log(`❌ Product not found: ${productId}`)
      continue
    }

    console.log(`📦 ${product.title}`)

    // Get variants with DENY policy
    const variantsToUpdate = product.variants.edges
      .filter(e => e.node.inventoryPolicy === 'DENY')
      .map(e => ({ id: e.node.id, inventoryPolicy: 'CONTINUE' }))

    if (variantsToUpdate.length === 0) {
      console.log(`  ✅ All variants already have CONTINUE policy`)
      continue
    }

    console.log(`  Updating ${variantsToUpdate.length} variants...`)

    // Update all variants
    const mutation = `
      mutation productVariantsBulkUpdate($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
        productVariantsBulkUpdate(productId: $productId, variants: $variants) {
          productVariants {
            id
            inventoryPolicy
          }
          userErrors {
            message
          }
        }
      }
    `

    const result = await adminQuery(mutation, {
      productId: productId,
      variants: variantsToUpdate
    })

    if (result.errors) {
      console.log(`  ❌ Error:`, result.errors[0]?.message)
    } else if (result.data?.productVariantsBulkUpdate?.userErrors?.length > 0) {
      console.log(`  ❌ User error:`, result.data.productVariantsBulkUpdate.userErrors[0]?.message)
    } else {
      const updated = result.data?.productVariantsBulkUpdate?.productVariants?.length || 0
      console.log(`  ✅ Updated ${updated} variants to CONTINUE policy`)
    }

    await new Promise(r => setTimeout(r, 200))
  }

  console.log('\n✅ Done!')
}

main().catch(console.error)

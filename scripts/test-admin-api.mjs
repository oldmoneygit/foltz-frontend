#!/usr/bin/env node
/**
 * Script de teste para verificar a Admin API do Shopify
 */

import 'dotenv/config'

const shopifyDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || process.env.SHOPIFY_STORE_DOMAIN
const adminToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN

const SHOPIFY_API_VERSION = '2024-10'

console.log('🔍 Testando Admin API do Shopify')
console.log('Domain:', shopifyDomain)
console.log('Token:', adminToken ? '✓ Presente' : '✗ Ausente')
console.log('')

// Test Admin API
async function testAdminAPI() {
  const url = `https://${shopifyDomain}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`

  console.log('URL:', url)
  console.log('')

  // Simple query to get shop info
  const query = `
    query {
      shop {
        name
        id
      }
    }
  `

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': adminToken,
      },
      body: JSON.stringify({ query }),
    })

    console.log('Response status:', response.status)

    const text = await response.text()
    console.log('Response:', text)

    if (!response.ok) {
      console.error('❌ Admin API request failed')
      return
    }

    const data = JSON.parse(text)
    if (data.errors) {
      console.error('❌ GraphQL errors:', JSON.stringify(data.errors, null, 2))
    } else if (data.data?.shop) {
      console.log('✅ Admin API working!')
      console.log('Shop:', data.data.shop.name)
    }
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

// Test getting a product
async function testGetProduct() {
  const url = `https://${shopifyDomain}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`

  const query = `
    query {
      products(first: 1) {
        edges {
          node {
            id
            title
            variants(first: 10) {
              edges {
                node {
                  id
                  title
                }
              }
            }
          }
        }
      }
    }
  `

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': adminToken,
      },
      body: JSON.stringify({ query }),
    })

    const text = await response.text()
    console.log('\n📦 Test getting product:')
    console.log('Response status:', response.status)

    if (!response.ok) {
      console.error('Response:', text)
      return
    }

    const data = JSON.parse(text)
    if (data.errors) {
      console.error('GraphQL errors:', JSON.stringify(data.errors, null, 2))
    } else if (data.data?.products) {
      const product = data.data.products.edges[0]?.node
      console.log('✅ Product:', product.title)
      console.log('   ID:', product.id)
      console.log('   Variants:', product.variants.edges.map(e => e.node.title).join(', '))
    }
  } catch (error) {
    console.error('Error:', error.message)
  }
}

// Test creating a variant (dry run - just check the mutation structure)
async function testCreateVariantQuery() {
  const url = `https://${shopifyDomain}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`

  // First get a product ID
  const getProductQuery = `
    query {
      products(first: 1, query: "title:Everton") {
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

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': adminToken,
      },
      body: JSON.stringify({ query: getProductQuery }),
    })

    const data = await response.json()

    console.log('\n🎯 Test finding product with missing variants:')

    if (data.data?.products?.edges?.length > 0) {
      const product = data.data.products.edges[0].node
      console.log('Product:', product.title)
      console.log('ID:', product.id)
      console.log('Current variants:')
      product.variants.edges.forEach(({ node }) => {
        console.log(`  - ${node.title} (${node.id})`)
        if (node.selectedOptions) {
          node.selectedOptions.forEach(opt => {
            console.log(`    ${opt.name}: ${opt.value}`)
          })
        }
      })

      // Now try to add a variant
      console.log('\n🔧 Attempting to add 3XL variant...')

      const mutation = `
        mutation productVariantCreate($input: ProductVariantInput!) {
          productVariantCreate(input: $input) {
            productVariant {
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
        input: {
          productId: product.id,
          price: "32900",
          options: ["3XL"]
        }
      }

      const mutationResponse = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': adminToken,
        },
        body: JSON.stringify({ query: mutation, variables }),
      })

      const mutationData = await mutationResponse.json()
      console.log('Mutation response:', JSON.stringify(mutationData, null, 2))

      if (mutationData.data?.productVariantCreate?.userErrors?.length > 0) {
        console.log('❌ User errors:', mutationData.data.productVariantCreate.userErrors)
      } else if (mutationData.data?.productVariantCreate?.productVariant) {
        console.log('✅ Variant created:', mutationData.data.productVariantCreate.productVariant)
      } else if (mutationData.errors) {
        console.log('❌ GraphQL errors:', mutationData.errors)
      }
    }
  } catch (error) {
    console.error('Error:', error.message)
  }
}

async function main() {
  await testAdminAPI()
  await testGetProduct()
  await testCreateVariantQuery()
}

main().catch(console.error)

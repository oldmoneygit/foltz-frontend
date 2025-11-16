#!/usr/bin/env node
/**
 * Script de teste do checkout Shopify
 * Testa a criação de um checkout com produtos de teste
 *
 * Uso:
 *   node scripts/test-checkout.mjs
 */

import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Carregar .env.local
dotenv.config({ path: path.join(__dirname, '../.env.local') })

const shopifyDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN
const SHOPIFY_API_VERSION = '2024-10'

/**
 * Fazer requisição à Storefront API
 */
async function storefrontRequest(query, variables = {}) {
  const url = `https://${shopifyDomain}/api/${SHOPIFY_API_VERSION}/graphql.json`

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

/**
 * Buscar um produto de teste
 */
async function getTestProduct() {
  const query = `
    query getProduct {
      products(first: 1) {
        edges {
          node {
            id
            title
            handle
            variants(first: 5) {
              edges {
                node {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  availableForSale
                }
              }
            }
          }
        }
      }
    }
  `

  const response = await storefrontRequest(query)
  return response.data.products.edges[0]?.node
}

/**
 * Criar checkout de teste (usando nova Cart API)
 */
async function createTestCheckout(lineItems) {
  const query = `
    mutation cartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart {
          id
          checkoutUrl
          lines(first: 50) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    product {
                      title
                    }
                  }
                }
              }
            }
          }
          cost {
            subtotalAmount {
              amount
              currencyCode
            }
            totalAmount {
              amount
              currencyCode
            }
          }
        }
        userErrors {
          message
          field
        }
      }
    }
  `

  const response = await storefrontRequest(query, {
    input: {
      lines: lineItems.map(item => ({
        merchandiseId: item.variantId,
        quantity: item.quantity
      }))
    }
  })

  if (response.data.cartCreate.userErrors.length > 0) {
    throw new Error(response.data.cartCreate.userErrors[0].message)
  }

  // Adaptar resposta para formato legível
  const cart = response.data.cartCreate.cart
  return {
    id: cart.id,
    webUrl: cart.checkoutUrl,
    lineItems: cart.lines,
    subtotalPrice: cart.cost.subtotalAmount,
    totalPrice: cart.cost.totalAmount
  }
}

/**
 * Função principal
 */
async function main() {
  console.log('\n' + '='.repeat(70))
  console.log('🧪 TESTE DO SISTEMA DE CHECKOUT SHOPIFY')
  console.log('='.repeat(70))

  // Verificar configuração
  if (!shopifyDomain || !storefrontAccessToken) {
    console.error('\n❌ Erro: Configuração incompleta!')
    console.error('\n📝 Verifique se o .env.local contém:')
    console.error('\nNEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=sua-loja.myshopify.com')
    console.error('NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=xxxxxxxxxxxxx')
    process.exit(1)
  }

  console.log(`\n✅ Conectando à loja: ${shopifyDomain}`)

  try {
    // 1. Buscar produto de teste
    console.log('\n📦 Buscando produto de teste...')
    const product = await getTestProduct()

    if (!product) {
      console.log('❌ Nenhum produto encontrado na loja')
      return
    }

    console.log(`\n✅ Produto encontrado:`)
    console.log(`   Nome: ${product.title}`)
    console.log(`   Handle: ${product.handle}`)
    console.log(`   ID: ${product.id}`)

    // 2. Selecionar variante de teste
    const variant = product.variants.edges[0]?.node

    if (!variant) {
      console.log('❌ Produto sem variantes')
      return
    }

    console.log(`\n✅ Variante selecionada:`)
    console.log(`   Tamanho: ${variant.title}`)
    console.log(`   Preço: ${variant.price.currencyCode} ${variant.price.amount}`)
    console.log(`   Disponível: ${variant.availableForSale ? 'Sim' : 'Não'}`)
    console.log(`   ID: ${variant.id}`)

    // 3. Criar checkout de teste
    console.log(`\n🛒 Criando checkout de teste...`)

    const lineItems = [
      {
        variantId: variant.id,
        quantity: 1
      }
    ]

    const checkout = await createTestCheckout(lineItems)

    console.log(`\n✅ Checkout criado com sucesso!`)
    console.log(`\n📋 Detalhes do Checkout:`)
    console.log(`   ID: ${checkout.id}`)
    console.log(`   URL: ${checkout.webUrl}`)
    console.log(`\n💰 Valores:`)
    console.log(`   Subtotal: ${checkout.subtotalPrice.currencyCode} ${checkout.subtotalPrice.amount}`)
    console.log(`   Total: ${checkout.totalPrice.currencyCode} ${checkout.totalPrice.amount}`)

    console.log(`\n📦 Itens no carrinho:`)
    checkout.lineItems.edges.forEach(({ node: item }, index) => {
      console.log(`   ${index + 1}. ${item.merchandise.product.title}`)
      console.log(`      Quantidade: ${item.quantity}`)
      console.log(`      Tamanho: ${item.merchandise.title}`)
      console.log(`      Preço: ${item.merchandise.price.currencyCode} ${item.merchandise.price.amount}`)
    })

    console.log('\n' + '='.repeat(70))
    console.log('✨ TESTE CONCLUÍDO COM SUCESSO!')
    console.log('='.repeat(70))

    console.log('\n💡 Para testar o checkout completo:')
    console.log(`   1. Abra o link: ${checkout.webUrl}`)
    console.log(`   2. Complete os dados de envio e pagamento`)
    console.log(`   3. Finalize a compra de teste`)

    console.log('\n🎯 O sistema de checkout está funcionando corretamente!')
    console.log('✅ Integração com Storefront API: OK')
    console.log('✅ Criação de checkout: OK')
    console.log('✅ Mapeamento de produtos/variantes: OK\n')

  } catch (error) {
    console.error('\n❌ Erro no teste:', error.message)

    if (error.message.includes('Shopify API Error')) {
      console.error('\n💡 Possíveis problemas:')
      console.error('   - Token Storefront inválido ou expirado')
      console.error('   - Domínio da loja incorreto')
      console.error('   - Produto/variante não disponível para venda')
    }

    process.exit(1)
  }
}

// Executar
main().catch(console.error)

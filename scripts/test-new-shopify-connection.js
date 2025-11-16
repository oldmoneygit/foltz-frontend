/**
 * Script para testar conexão com a NOVA loja Shopify
 *
 * Executa:
 * node scripts/test-new-shopify-connection.js
 */

import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Carregar .env.local
dotenv.config({ path: path.join(__dirname, '../.env.local') })

const STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
const STOREFRONT_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN
const API_VERSION = '2024-10'

console.log('🔍 Testando conexão com a Nova Loja Shopify...\n')
console.log('📋 Configuração:')
console.log(`   Domínio: ${STORE_DOMAIN}`)
console.log(`   Token: ${STOREFRONT_TOKEN?.substring(0, 10)}...`)
console.log(`   API Version: ${API_VERSION}`)
console.log('')

async function testConnection() {
  const query = `
    query {
      shop {
        name
        primaryDomain {
          url
        }
      }
      products(first: 5) {
        edges {
          node {
            id
            title
            handle
            productType
            tags
          }
        }
      }
    }
  `

  const url = `https://${STORE_DOMAIN}/api/${API_VERSION}/graphql.json`

  try {
    console.log('🔄 Fazendo requisição para Shopify...\n')

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN,
      },
      body: JSON.stringify({ query }),
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()

    if (data.errors) {
      console.error('❌ Erros da API Shopify:')
      console.error(JSON.stringify(data.errors, null, 2))
      return
    }

    // Mostrar informações da loja
    console.log('✅ CONEXÃO BEM-SUCEDIDA!\n')
    console.log('🏪 Informações da Loja:')
    console.log(`   Nome: ${data.data.shop.name}`)
    console.log(`   URL: ${data.data.shop.primaryDomain.url}`)
    console.log('')

    // Mostrar produtos
    const products = data.data.products.edges
    console.log(`📦 Produtos encontrados: ${products.length}`)

    if (products.length === 0) {
      console.log('\n⚠️  Nenhum produto encontrado na loja.')
      console.log('   Isso é normal se você ainda está importando os produtos.')
    } else {
      console.log('\n📋 Primeiros produtos:')
      products.forEach((edge, index) => {
        const product = edge.node
        console.log(`\n   ${index + 1}. ${product.title}`)
        console.log(`      Handle: ${product.handle}`)
        console.log(`      Tipo: ${product.productType || 'N/A'}`)
        console.log(`      Tags: ${product.tags.length > 0 ? product.tags.join(', ') : 'Nenhuma'}`)
      })
    }

    console.log('\n' + '='.repeat(60))
    console.log('✅ Teste concluído com sucesso!')
    console.log('   Sua aplicação está configurada para usar a NOVA loja.')
    console.log('='.repeat(60))

  } catch (error) {
    console.error('\n❌ ERRO ao conectar com Shopify:')
    console.error(`   ${error.message}`)
    console.error('\n📋 Verifique:')
    console.error('   1. O domínio está correto no .env.local')
    console.error('   2. O Storefront Access Token está válido')
    console.error('   3. A loja está ativa (não em manutenção)')
    process.exit(1)
  }
}

// Executar teste
testConnection()

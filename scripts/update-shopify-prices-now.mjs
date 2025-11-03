#!/usr/bin/env node
/**
 * Script para atualizar preços no Shopify AGORA
 * Atualiza produtos já publicados via API
 * 
 * Uso:
 *   node scripts/update-shopify-prices-now.mjs
 */

import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Carregar .env.local
dotenv.config({ path: path.join(__dirname, '../.env.local') })

const shopifyDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || process.env.SHOPIFY_STORE_DOMAIN
const adminAccessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN

// Novos preços - BLACK FRIDAY COMBO 3x
// TODOS os produtos: ARS 32.900,00 (jerseys normais e manga longa)
const JERSEY_PRICE = 32900.00
const JERSEY_COMPARE_PRICE = 53850.00 // Preço "de" para mostrar desconto

const LONG_SLEEVE_PRICE = 32900.00 // MESMO PREÇO que jerseys normais
const LONG_SLEEVE_COMPARE_PRICE = 59850.00 // Preço "de" para manga longa

const SHOPIFY_API_VERSION = '2024-10'

// Função para fazer requisições à API do Shopify
async function shopifyAdminRequest(query, variables = {}) {
  const url = `https://${shopifyDomain}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': adminAccessToken,
    },
    body: JSON.stringify({ query, variables }),
  })

  const data = await response.json()

  if (data.errors) {
    throw new Error(`Shopify API Error: ${JSON.stringify(data.errors)}`)
  }

  return data
}

// Listar todos os produtos
async function listAllProducts() {
  let allProducts = []
  let hasNextPage = true
  let cursor = null

  while (hasNextPage) {
    const query = `
      query getProducts($cursor: String) {
        products(first: 50, after: $cursor) {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node {
              id
              title
              handle
              productType
              status
              variants(first: 50) {
                edges {
                  node {
                    id
                    title
                    price
                    compareAtPrice
                  }
                }
              }
            }
          }
        }
      }
    `

    const response = await shopifyAdminRequest(query, { cursor })
    const productsData = response.data.products

    allProducts = allProducts.concat(productsData.edges.map(edge => edge.node))
    
    hasNextPage = productsData.pageInfo.hasNextPage
    cursor = productsData.pageInfo.endCursor

    console.log(`   Carregados: ${allProducts.length} produtos...`)
  }

  return allProducts
}

// Atualizar preço de uma variante usando REST API com retry automático
async function updateVariantPrice(variantId, newPrice, newCompareAtPrice, retryCount = 0) {
  const maxRetries = 3
  const baseDelay = 3000 // 3 segundos base (mais conservador)

  // Extrair ID numérico do GID
  const numericId = variantId.split('/').pop()

  const url = `https://${shopifyDomain}/admin/api/${SHOPIFY_API_VERSION}/variants/${numericId}.json`

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': adminAccessToken,
      },
      body: JSON.stringify({
        variant: {
          id: numericId,
          price: String(newPrice),
          compare_at_price: String(newCompareAtPrice)
        }
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()

      // Se for erro 429 (rate limit) e ainda temos tentativas, fazer retry
      if (response.status === 429 && retryCount < maxRetries) {
        const waitTime = baseDelay * Math.pow(2, retryCount) // Backoff exponencial: 3s, 6s, 12s
        console.log(`   ⏳ Rate limit (tentativa ${retryCount + 1}/${maxRetries}), aguardando ${waitTime/1000}s...`)
        await new Promise(resolve => setTimeout(resolve, waitTime))
        return updateVariantPrice(variantId, newPrice, newCompareAtPrice, retryCount + 1)
      }

      throw new Error(`REST API Error: ${response.status} - ${errorText}`)
    }

    return await response.json()
  } catch (error) {
    // Se for erro de rede e ainda temos tentativas, fazer retry
    if (retryCount < maxRetries && error.message.includes('fetch')) {
      const waitTime = baseDelay * Math.pow(2, retryCount)
      console.log(`   ⏳ Erro de conexão (tentativa ${retryCount + 1}/${maxRetries}), aguardando ${waitTime/1000}s...`)
      await new Promise(resolve => setTimeout(resolve, waitTime))
      return updateVariantPrice(variantId, newPrice, newCompareAtPrice, retryCount + 1)
    }
    throw error
  }
}

// Verificar se é produto de manga longa
function isLongSleeveProduct(product) {
  const productType = product.productType || ''
  const title = product.title || ''
  
  return productType.toLowerCase().includes('manga longa') ||
         productType.toLowerCase().includes('long sleeve') ||
         title.toLowerCase().includes('long sleeve')
}

// Função principal
async function main() {
  console.log('\n' + '='.repeat(70))
  console.log('🏷️  ATUALIZAÇÃO DE PREÇOS NO SHOPIFY')
  console.log('='.repeat(70))
  console.log('\n📌 Novos preços:')
  console.log(`   👕 Jerseys: ARS ${JERSEY_PRICE.toLocaleString('pt-BR')}`)
  console.log(`      Comparado: ARS ${JERSEY_COMPARE_PRICE.toLocaleString('pt-BR')}`)
  console.log(`   👔 Manga Longa: ARS ${LONG_SLEEVE_PRICE.toLocaleString('pt-BR')}`)
  console.log(`      Comparado: ARS ${LONG_SLEEVE_COMPARE_PRICE.toLocaleString('pt-BR')}\n`)

  // Verificar configuração
  if (!shopifyDomain || !adminAccessToken) {
    console.error('❌ Erro: Configuração incompleta!')
    console.error('\n📝 Você precisa criar um arquivo .env.local na raiz do projeto com:')
    console.error('\nSHOPIFY_STORE_DOMAIN=sua-loja.myshopify.com')
    console.error('SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_xxxxxxxxxxxxx')
    console.error('\n💡 Como obter as credenciais:')
    console.error('   1. Acesse: Shopify Admin > Settings > Apps and sales channels')
    console.error('   2. Clique em "Develop apps"')
    console.error('   3. Crie ou selecione um app')
    console.error('   4. Configure os scopes: read_products, write_products')
    console.error('   5. Instale o app e copie o token\n')
    process.exit(1)
  }

  console.log(`✅ Conectando à loja: ${shopifyDomain}`)

  try {
    console.log('\n⏳ Buscando produtos publicados no Shopify...\n')
    const products = await listAllProducts()

    if (!products || products.length === 0) {
      console.log('⚠️  Nenhum produto encontrado no Shopify.')
      return
    }

    console.log(`\n✅ ${products.length} produtos encontrados`)
    console.log('─'.repeat(70))

    let jerseyCount = 0
    let longSleeveCount = 0
    let variantCount = 0
    let errorCount = 0
    let skippedCount = 0

    for (const product of products) {
      try {
        // Pular produtos não publicados
        if (product.status !== 'ACTIVE') {
          skippedCount++
          continue
        }

        // Verificar se tem variantes
        if (!product.variants || product.variants.edges.length === 0) {
          console.log(`⚠️  ${product.title}: sem variantes, pulando...`)
          skippedCount++
          continue
        }

        // Determinar tipo e preço apropriado
        const isLongSleeve = isLongSleeveProduct(product)
        const newPrice = isLongSleeve ? LONG_SLEEVE_PRICE : JERSEY_PRICE
        const newCompareAtPrice = isLongSleeve ? LONG_SLEEVE_COMPARE_PRICE : JERSEY_COMPARE_PRICE

        // Mostrar exemplo dos primeiros de cada tipo
        if (isLongSleeve && longSleeveCount < 2) {
          console.log(`\n👔 Manga Longa: ${product.title}`)
          console.log(`   Variantes: ${product.variants.edges.length}`)
          console.log(`   Novo preço: ARS ${newPrice.toLocaleString('pt-BR')}`)
        } else if (!isLongSleeve && jerseyCount < 2) {
          console.log(`\n👕 Jersey: ${product.title}`)
          console.log(`   Variantes: ${product.variants.edges.length}`)
          console.log(`   Novo preço: ARS ${newPrice.toLocaleString('pt-BR')}`)
        }

        // Atualizar cada variante
        for (const variantEdge of product.variants.edges) {
          const variant = variantEdge.node

          try {
            await updateVariantPrice(variant.id, newPrice, newCompareAtPrice)
            variantCount++

            // Delay de 1.5 segundos entre variantes (mais conservador)
            await new Promise(resolve => setTimeout(resolve, 1500))
          } catch (error) {
            console.error(`   ❌ Erro na variante ${variant.title}:`, error.message)
            errorCount++

            // Delay maior em caso de erro para não agravar rate limiting
            await new Promise(resolve => setTimeout(resolve, 3000))
          }
        }

        if (isLongSleeve) {
          longSleeveCount++
        } else {
          jerseyCount++
        }

        // Mostrar progresso a cada 10 produtos
        const totalUpdated = jerseyCount + longSleeveCount
        if (totalUpdated % 10 === 0) {
          console.log(`\n⏳ Progresso: ${totalUpdated}/${products.length} produtos processados...`)
          console.log(`   👕 ${jerseyCount} jerseys | 👔 ${longSleeveCount} manga longa`)
          console.log(`   📦 ${variantCount} variantes atualizadas`)
        }

      } catch (error) {
        console.error(`\n❌ Erro ao processar ${product.title}:`, error.message)
        errorCount++
      }
    }

    console.log('\n' + '='.repeat(70))
    console.log('✨ ATUALIZAÇÃO CONCLUÍDA!')
    console.log('='.repeat(70))
    console.log(`\n📊 Estatísticas:`)
    console.log(`   👕 Jerseys atualizados: ${jerseyCount} produtos`)
    console.log(`   👔 Manga longa atualizados: ${longSleeveCount} produtos`)
    console.log(`   📦 Variantes atualizadas: ${variantCount}`)
    console.log(`   ⚠️  Produtos pulados: ${skippedCount}`)
    console.log(`   ❌ Erros: ${errorCount}`)
    console.log(`   📦 Total processado: ${products.length} produtos`)
    console.log()

    console.log('💰 Resumo dos preços aplicados:')
    console.log(`   👕 Jerseys: ARS ${JERSEY_PRICE.toLocaleString('pt-BR')}`)
    console.log(`      Comparado: ARS ${JERSEY_COMPARE_PRICE.toLocaleString('pt-BR')}`)
    console.log(`   👔 Manga Longa: ARS ${LONG_SLEEVE_PRICE.toLocaleString('pt-BR')}`)
    console.log(`      Comparado: ARS ${LONG_SLEEVE_COMPARE_PRICE.toLocaleString('pt-BR')}`)
    console.log()

    if (variantCount > 0) {
      console.log('🎉 Os preços foram atualizados com sucesso no Shopify!')
      console.log('💡 Verifique alguns produtos na sua loja para confirmar.')
      console.log(`\n🔗 https://${shopifyDomain.replace('.myshopify.com', '')}.myshopify.com/admin/products`)
    }

  } catch (error) {
    console.error('\n❌ Erro ao buscar produtos:', error.message)
    
    if (error.message.includes('Shopify API Error')) {
      console.error('\n💡 Possíveis problemas:')
      console.error('   - Token inválido ou expirado')
      console.error('   - Permissões insuficientes (precisa: read_products, write_products)')
      console.error('   - Domínio da loja incorreto')
    }
    
    process.exit(1)
  }
}

// Executar
console.log('\n⚠️  Este script irá atualizar os preços de TODOS os produtos no Shopify!')
console.log('\n   Produtos com imagens e dados já publicados serão mantidos.')
console.log('   Apenas os PREÇOS serão atualizados.')
console.log('\n   Pressione Ctrl+C nos próximos 3 segundos para cancelar...')

setTimeout(() => {
  main().catch(console.error)
}, 3000)


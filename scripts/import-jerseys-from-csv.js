/**
 * Script para importar camisas de time do CSV para a nova loja Shopify
 * Usa REST API para facilitar criação de produtos com múltiplas variantes
 *
 * Como usar:
 * 1. Certifique-se que o .env.local está configurado
 * 2. Execute: node scripts/import-jerseys-from-csv.js
 */

import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Carregar .env.local
dotenv.config({ path: path.join(__dirname, '../.env.local') })

// Configuração da nova loja
const NEW_STORE = {
  domain: process.env.NEW_SHOPIFY_STORE_DOMAIN,
  adminToken: process.env.NEW_SHOPIFY_ADMIN_ACCESS_TOKEN
}

const API_VERSION = '2024-10'

// Validar configuração
if (!NEW_STORE.domain) {
  console.error('❌ Erro: NEW_SHOPIFY_STORE_DOMAIN não configurado no .env.local')
  process.exit(1)
}

if (!NEW_STORE.adminToken) {
  console.error('❌ Erro: NEW_SHOPIFY_ADMIN_ACCESS_TOKEN não configurado no .env.local')
  process.exit(1)
}

console.log('🔧 Configuração:')
console.log(`  Nova Loja: ${NEW_STORE.domain}`)
console.log('')

/**
 * Parse CSV file
 */
function parseCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8')
  const lines = content.split('\n').filter(line => line.trim())

  // Skip header
  const dataLines = lines.slice(1)

  // Group by handle
  const productsMap = new Map()

  dataLines.forEach(line => {
    // Parse CSV line (handle commas in quoted fields)
    const values = line.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g).map(v => v.replace(/^"|"$/g, '').trim())

    const [
      handle, title, body, vendor, type, tags, published,
      option1Name, option1Value, variantSKU, variantQty,
      variantPrice, variantComparePrice, imageSrc, status
    ] = values

    if (!productsMap.has(handle)) {
      productsMap.set(handle, {
        handle,
        title: title || null,
        body_html: body || '',
        vendor: vendor || 'Foltz Fanwear',
        product_type: type || 'Camiseta',
        tags: tags ? tags.split(',').map(t => t.trim()).join(', ') : '',
        published: published === 'TRUE',
        status: status || 'active',
        variants: [],
        images: []
      })
    }

    const product = productsMap.get(handle)

    // Add variant
    if (option1Value) {
      product.variants.push({
        option1: option1Value,
        sku: variantSKU || '',
        price: variantPrice || '0',
        compare_at_price: variantComparePrice || null,
        inventory_quantity: parseInt(variantQty) || 0,
        inventory_management: 'shopify'
      })
    }

    // Add image if exists and not added yet
    if (imageSrc && !product.images.some(img => img.src === imageSrc)) {
      product.images.push({ src: imageSrc })
    }

    // Set options
    if (option1Name && !product.options) {
      product.options = [{ name: option1Name }]
    }
  })

  return Array.from(productsMap.values())
}

/**
 * Create product using REST API
 */
async function createProductREST(productData) {
  const url = `https://${NEW_STORE.domain}/admin/api/${API_VERSION}/products.json`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': NEW_STORE.adminToken,
    },
    body: JSON.stringify({ product: productData }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`REST API Error ${response.status}: ${errorText}`)
  }

  const data = await response.json()
  return data.product
}

/**
 * Aguarda um tempo (rate limiting)
 */
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Função principal
 */
async function main() {
  console.log('🚀 Iniciando importação de camisas de time...\n')

  try {
    // 1. Carregar produtos do CSV
    const csvPath = path.join(__dirname, '../shopify-theme-foltz/products-import.csv')

    if (!fs.existsSync(csvPath)) {
      throw new Error(`Arquivo não encontrado: ${csvPath}`)
    }

    console.log('📂 Carregando produtos do CSV...')
    const products = parseCSV(csvPath)

    console.log(`✅ ${products.length} produtos carregados do CSV`)

    console.log('\n📝 Resumo dos produtos:')
    console.log(`  Total de produtos: ${products.length}`)
    console.log(`  Total de variantes: ${products.reduce((sum, p) => sum + p.variants.length, 0)}`)
    console.log(`  Com imagens: ${products.filter(p => p.images.length > 0).length}`)

    // Mostrar alguns exemplos
    console.log('\n📋 Exemplos de produtos:')
    products.slice(0, 3).forEach(p => {
      console.log(`  - ${p.title} (${p.variants.length} variantes)`)
    })
    console.log('')

    // 2. Confirmar importação
    console.log('⚠️  Tem certeza que deseja importar todos os produtos?')
    console.log('   Pressione Ctrl+C para cancelar ou aguarde 5 segundos...')
    await wait(5000)

    // 3. Criar produtos na nova loja
    console.log('\n📤 Criando produtos na nova loja...\n')

    const results = []
    let successCount = 0
    let errorCount = 0

    for (let i = 0; i < products.length; i++) {
      const product = products[i]
      console.log(`\n[${i + 1}/${products.length}] Processando: ${product.title}`)
      console.log(`  📋 ${product.variants.length} variantes`)

      try {
        const createdProduct = await createProductREST(product)

        successCount++
        console.log(`  ✅ Criado com sucesso! ID: ${createdProduct.id}`)

        results.push({
          success: true,
          product: product.title,
          shopifyId: createdProduct.id,
          variantsCreated: createdProduct.variants.length
        })
      } catch (error) {
        errorCount++
        console.log(`  ❌ Erro:`, error.message)

        results.push({
          success: false,
          product: product.title,
          error: error.message
        })
      }

      // Rate limiting: aguardar 500ms entre requisições
      if (i < products.length - 1) {
        await wait(500)
      }
    }

    // 4. Salvar relatório
    const report = {
      timestamp: new Date().toISOString(),
      sourceFile: 'products-import.csv',
      newStore: NEW_STORE.domain,
      total: products.length,
      success: successCount,
      errors: errorCount,
      results: results
    }

    const reportPath = path.join(__dirname, `../jerseys-import-report-${Date.now()}.json`)
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))

    // 5. Resumo final
    console.log('\n' + '='.repeat(60))
    console.log('✅ IMPORTAÇÃO CONCLUÍDA!')
    console.log('='.repeat(60))
    console.log(`📊 Total de produtos: ${products.length}`)
    console.log(`✅ Sucesso: ${successCount}`)
    console.log(`❌ Erros: ${errorCount}`)
    console.log(`📄 Relatório salvo em: ${reportPath}`)
    console.log('='.repeat(60))

    // Listar erros se houver
    if (errorCount > 0) {
      console.log('\n⚠️  Produtos com erro:')
      results.filter(r => !r.success).forEach(r => {
        console.log(`  - ${r.product}`)
        console.log(`    ${r.error}`)
      })
    }

  } catch (error) {
    console.error('\n❌ Erro fatal:', error)
    console.error(error.stack)
    process.exit(1)
  }
}

// Executar
main()

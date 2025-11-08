# 📚 Guia Completo: Importação de Produtos para Shopify

> **Propósito:** Documentação detalhada de TODO o processo de importação de produtos para Shopify, desde a geração de CSV até o mapeamento completo de variants para checkout. Use este guia para replicar em novos projetos (ex: RetroBox Argentina).

---

## 📋 Índice

1. [Visão Geral do Processo](#visão-geral-do-processo)
2. [Estrutura de Dados](#estrutura-de-dados)
3. [Passo 1: Geração de CSV](#passo-1-geração-de-csv)
4. [Passo 2: Importação Manual na Shopify](#passo-2-importação-manual-na-shopify)
5. [Passo 3: Upload Automático de Imagens](#passo-3-upload-automático-de-imagens)
6. [Passo 4: Mapeamento de Variant IDs](#passo-4-mapeamento-de-variant-ids)
7. [Passo 5: Integração com Checkout](#passo-5-integração-com-checkout)
8. [Scripts Completos](#scripts-completos)
9. [Troubleshooting](#troubleshooting)
10. [Checklist Final](#checklist-final)

---

## 🎯 Visão Geral do Processo

### Fluxo Completo

```
📊 Dados Locais (JSON)
        ↓
[1] 🔧 Gerar CSV Shopify
        ↓
[2] 📤 Importar na Shopify (manual, SEM imagens)
        ↓
[3] 📸 Upload Automático de Imagens (via API)
        ↓
[4] 🗺️ Gerar Mapeamento Variant IDs
        ↓
[5] 🛒 Integrar Checkout com Storefront API
        ↓
✅ LOJA FUNCIONANDO
```

### Por Que Este Processo?

**Problema:** Shopify não aceita upload de centenas de imagens via CSV (limite de tamanho, timeout).

**Solução:** Importar produtos SEM imagens primeiro, depois fazer upload das imagens via Admin API.

**Benefício:**
- ✅ Importação rápida e confiável
- ✅ Imagens hospedadas no CDN da Shopify
- ✅ URLs permanentes e otimizadas
- ✅ Controle total sobre o processo

### Tempo Estimado

| Etapa | Tempo |
|-------|-------|
| 1. Gerar CSV | 5-10 segundos |
| 2. Importar CSV | 10-15 minutos |
| 3. Upload Imagens | 2-3 horas* |
| 4. Gerar Mapeamento | 1-2 minutos |
| 5. Integrar Checkout | 30 minutos |
| **TOTAL** | **~3-4 horas** |

*Depende do número de produtos e imagens

---

## 📊 Estrutura de Dados

### Estrutura do JSON Local

**Arquivo:** `leagues_data.json` (ou similar)

```json
{
  "premier-league": {
    "id": "premier-league",
    "name": "Premier League",
    "country": "Inglaterra",
    "products": [
      {
        "id": "manchester-united-08-09-home",
        "name": "Manchester United 08/09 Home",
        "sizes": "Size S-XXL",
        "price": 35900,
        "regularPrice": 53850,
        "images": [
          "Leagues/Premier League/Manchester United 08-09 Home/001.jpg",
          "Leagues/Premier League/Manchester United 08-09 Home/002.jpg",
          "Leagues/Premier League/Manchester United 08-09 Home/003.jpg"
        ],
        "description": "Camiseta oficial Manchester United temporada 2008/2009"
      }
    ]
  }
}
```

### Campos Importantes

| Campo | Descrição | Obrigatório |
|-------|-----------|-------------|
| `id` | Handle único do produto (URL slug) | ✅ |
| `name` | Nome do produto | ✅ |
| `sizes` | Range de tamanhos (ex: "Size S-XXL") | ✅ |
| `price` | Preço em centavos | ✅ |
| `regularPrice` | Preço comparativo (de/por) | ⚪ |
| `images` | Array de caminhos das imagens | ✅ |
| `description` | Descrição do produto | ⚪ |

---

## 🔧 Passo 1: Geração de CSV

### Estrutura do CSV da Shopify

A Shopify requer um CSV com formato específico. Veja os campos obrigatórios:

```csv
Handle,Title,Body (HTML),Vendor,Type,Tags,Published,Option1 Name,Option1 Value,...
```

### Script de Geração

**Arquivo:** `scripts/generateShopifyCSV.js`

```javascript
const fs = require('fs')
const path = require('path')

// Ler dados locais
const leaguesData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../leagues_data.json'), 'utf-8')
)

console.log('📦 SHOPIFY CSV GENERATOR\n')

// Parse sizes: "Size S-XXL" -> ['S', 'M', 'L', 'XL', 'XXL']
function parseSizes(sizesString) {
  if (!sizesString) return ['M']

  const sizeOrder = ['S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL']

  const match = sizesString.match(/Size\s*([A-Z0-9]+)-([A-Z0-9]+)/i)
  if (!match) return ['M']

  const [, startSize, endSize] = match
  const startIdx = sizeOrder.indexOf(startSize.toUpperCase())
  const endIdx = sizeOrder.indexOf(endSize.toUpperCase())

  if (startIdx === -1 || endIdx === -1) return ['M']

  return sizeOrder.slice(startIdx, endIdx + 1)
}

// Headers completos da Shopify (45 colunas)
const headers = [
  'Handle',
  'Title',
  'Body (HTML)',
  'Vendor',
  'Type',
  'Tags',
  'Published',
  'Option1 Name',
  'Option1 Value',
  'Option2 Name',
  'Option2 Value',
  'Option3 Name',
  'Option3 Value',
  'Variant SKU',
  'Variant Grams',
  'Variant Inventory Tracker',
  'Variant Inventory Qty',
  'Variant Inventory Policy',
  'Variant Fulfillment Service',
  'Variant Price',
  'Variant Compare At Price',
  'Variant Requires Shipping',
  'Variant Taxable',
  'Variant Barcode',
  'Image Src',
  'Image Position',
  'Image Alt Text',
  'Gift Card',
  'SEO Title',
  'SEO Description',
  'Google Shopping / Google Product Category',
  'Google Shopping / Gender',
  'Google Shopping / Age Group',
  'Google Shopping / MPN',
  'Google Shopping / AdWords Grouping',
  'Google Shopping / AdWords Labels',
  'Google Shopping / Condition',
  'Google Shopping / Custom Product',
  'Google Shopping / Custom Label 0',
  'Google Shopping / Custom Label 1',
  'Google Shopping / Custom Label 2',
  'Google Shopping / Custom Label 3',
  'Google Shopping / Custom Label 4',
  'Variant Image',
  'Variant Weight Unit',
  'Variant Tax Code',
  'Cost per item',
  'Status'
]

const rows = []
let productCount = 0

// Processar cada liga/categoria
Object.keys(leaguesData).forEach(leagueId => {
  const league = leaguesData[leagueId]

  if (!league.products || !Array.isArray(league.products)) return

  league.products.forEach(product => {
    productCount++
    const handle = product.id
    const title = product.name
    const vendor = 'Sua Marca'
    const productType = league.name
    const tags = [league.country, league.name, 'Jersey', 'Futebol'].join(', ')

    // Parse sizes
    const sizes = parseSizes(product.sizes)

    // Preços (converter de centavos para formato Shopify)
    const price = (product.price / 100).toFixed(2)
    const compareAtPrice = product.regularPrice
      ? (product.regularPrice / 100).toFixed(2)
      : null

    // Descrição HTML
    const bodyHTML = product.description || `<p>${title}</p>`

    // Criar uma linha para cada variante (tamanho)
    sizes.forEach((size, sizeIndex) => {
      const isFirstRow = sizeIndex === 0

      const row = [
        handle,                              // Handle
        isFirstRow ? title : '',             // Title (só primeira linha)
        isFirstRow ? bodyHTML : '',          // Body HTML
        isFirstRow ? vendor : '',            // Vendor
        isFirstRow ? productType : '',       // Type
        isFirstRow ? tags : '',              // Tags
        isFirstRow ? 'TRUE' : '',            // Published
        isFirstRow ? 'Size' : '',            // Option1 Name
        size,                                // Option1 Value (tamanho)
        '', '', '', '',                      // Options 2 e 3 (vazias)
        `${handle}-${size}`,                 // Variant SKU
        '400',                               // Variant Grams (peso)
        '',                                  // Inventory Tracker
        '100',                               // Inventory Qty
        'deny',                              // Inventory Policy
        'manual',                            // Fulfillment Service
        price,                               // Variant Price
        compareAtPrice || '',                // Compare At Price
        'TRUE',                              // Requires Shipping
        'TRUE',                              // Taxable
        '',                                  // Barcode
        '',                                  // Image Src (VAZIO - add depois)
        '',                                  // Image Position
        '',                                  // Image Alt Text
        'FALSE',                             // Gift Card
        isFirstRow ? title : '',             // SEO Title
        isFirstRow ? `${title} - ${league.name}` : '', // SEO Description
        'Apparel & Accessories > Clothing > Activewear > Jerseys', // Google Category
        'Unisex',                            // Gender
        'Adult',                             // Age Group
        '', '', '', 'New', '',               // Google Shopping campos
        league.name,                         // Custom Label 0
        league.country,                      // Custom Label 1
        '', '', '',                          // Custom Labels 2-4
        '',                                  // Variant Image
        'kg',                                // Weight Unit
        '',                                  // Tax Code
        '',                                  // Cost per item
        'active'                             // Status
      ]

      rows.push(row)
    })

    console.log(`📦 Produto ${productCount}: ${title} (${sizes.length} variantes)`)
  })
})

// Gerar CSV com escape correto
const csvContent = [
  headers.join(','),
  ...rows.map(row =>
    row.map(cell => {
      const cellStr = String(cell || '')
      // Escapar células com vírgulas, aspas ou quebras de linha
      if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
        return `"${cellStr.replace(/"/g, '""')}"`
      }
      return cellStr
    }).join(',')
  )
].join('\n')

// Salvar arquivo
const outputPath = path.join(__dirname, '../shopify-products-import.csv')
fs.writeFileSync(outputPath, csvContent, 'utf-8')

console.log('\n✅ CSV gerado com sucesso!')
console.log(`📁 Arquivo: ${outputPath}`)
console.log(`📊 Produtos: ${productCount}`)
console.log(`📋 Total de linhas (com variantes): ${rows.length}`)
console.log('\n🎯 Próximo passo:')
console.log('   1. Acesse Shopify Admin > Products > Import')
console.log('   2. Faça upload do arquivo shopify-products-import.csv')
console.log('   3. NÃO marque "Upload images from your computer"')
console.log('   4. Aguarde a importação (10-15 minutos)')
```

### Como Executar

```bash
node scripts/generateShopifyCSV.js
```

### Saída Esperada

```
📦 SHOPIFY CSV GENERATOR

📦 Produto 1: Manchester United 08/09 Home (5 variantes)
📦 Produto 2: Liverpool 05/06 Home (5 variantes)
📦 Produto 3: Chelsea 11/12 Home (5 variantes)
...

✅ CSV gerado com sucesso!
📁 Arquivo: /path/to/shopify-products-import.csv
📊 Produtos: 270
📋 Total de linhas (com variantes): 1850
```

### Customização para Outros Projetos

```javascript
// ALTERAR CONFORME SEU PROJETO:

// 1. Vendor (marca)
const vendor = 'RetroBox'  // Trocar aqui

// 2. Categoria de produto
const productType = 'Camiseta Retro'  // Trocar aqui

// 3. Tags
const tags = ['Retro', 'Vintage', league.country, product.team].join(', ')

// 4. Preços (se sua estrutura for diferente)
const price = product.precoCombo || product.price  // Ajustar conforme necessário
```

---

## 📤 Passo 2: Importação Manual na Shopify

### Processo Detalhado

#### 1. Acessar Shopify Admin

```
https://SUA-LOJA.myshopify.com/admin/products
```

#### 2. Clicar em "Import" (canto superior direito)

#### 3. Upload do CSV

**IMPORTANTE:**
- ✅ Selecione o arquivo `shopify-products-import.csv`
- ❌ **NÃO MARQUE** "Upload images from your computer"
- ❌ **NÃO ENVIE** imagens agora

**Por quê?**
- CSV com imagens é muito grande (timeout)
- Imagens serão adicionadas via API (mais rápido e confiável)

#### 4. Opções de Importação

Marque:
- ✅ **Overwrite existing products that have the same handle**
  - Permite reimportar sem duplicar

NÃO marque:
- ❌ **Upload images from your computer**

#### 5. Upload and Continue

Clique e aguarde o preview carregar.

#### 6. Revisar Preview

Verifique:
- ✅ Número de produtos correto
- ✅ Variantes (tamanhos) aparecem
- ✅ Preços corretos
- ✅ Sem imagens (normal)

#### 7. Import Products

Clique para iniciar a importação.

#### 8. Aguardar Conclusão

- ⏱️ **Tempo:** 10-15 minutos para ~270 produtos
- 📧 **Notificação:** Você receberá email quando terminar
- ✅ **Pode fechar** a janela e continuar trabalhando

### Verificação Pós-Importação

Após receber o email de conclusão:

1. **Acesse:** Products no Admin
2. **Verifique:**
   - ✅ Todos os produtos estão listados
   - ✅ Cada produto tem variantes de tamanho
   - ✅ Preços estão corretos
   - ⚠️ Produtos **SEM imagens** (normal - será corrigido no Passo 3)

### Troubleshooting Importação

**❌ Erro: "Invalid CSV format"**
- Verifique se o CSV tem todas as 45 colunas
- Certifique-se que células com vírgulas estão entre aspas

**❌ Erro: "Handle already exists"**
- Normal se reimportando
- Marque "Overwrite existing products"

**❌ Importação travou**
- Aguarde 30 minutos
- Se não resolver, tente em lotes menores (50 produtos por vez)

---

## 📸 Passo 3: Upload Automático de Imagens

### Por Que Usar API ao Invés de CSV?

| CSV | API |
|-----|-----|
| ❌ Limite de tamanho | ✅ Sem limite |
| ❌ Timeout frequente | ✅ Retry automático |
| ❌ Imagens locais | ✅ Direto para CDN |
| ❌ Lento (>1h) | ✅ Mais rápido |

### Script de Upload

**Arquivo:** `scripts/uploadProductImages-ALL.mjs`

```javascript
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import {
  getProductByHandle,
  addProductImage
} from '../src/lib/shopifyAdmin.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Ler dados locais
const leaguesData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../leagues_data.json'), 'utf-8')
)

console.log('📸 SHOPIFY IMAGE UPLOADER - COMPLETO\n')

async function uploadImages() {
  let successCount = 0
  let errorCount = 0
  let totalProducts = 0
  let processedProducts = 0

  // Contar total
  for (const leagueId of Object.keys(leaguesData)) {
    const league = leaguesData[leagueId]
    if (league.products) {
      totalProducts += league.products.length
    }
  }

  console.log(`✅ Total de produtos a processar: ${totalProducts}\n`)
  console.log('⚠️  Este processo pode demorar 2-3 horas.')
  console.log('💡 Você pode deixar rodando em background.\n')

  const startTime = Date.now()

  // Processar cada liga
  for (const leagueId of Object.keys(leaguesData)) {
    const league = leaguesData[leagueId]

    if (!league.products || !Array.isArray(league.products)) continue

    console.log(`\n📁 Liga: ${league.name} (${league.products.length} produtos)`)
    console.log('─'.repeat(60))

    for (const product of league.products) {
      processedProducts++
      const progress = `[${processedProducts}/${totalProducts}]`

      console.log(`\n${progress} 📦 ${product.name}`)
      console.log(`   Handle: ${product.id}`)

      try {
        // 1. Buscar produto na Shopify
        console.log('   🔍 Buscando na Shopify...')
        const shopifyProduct = await getProductByHandle(product.id)

        if (!shopifyProduct) {
          console.log('   ⚠️  Produto não encontrado - pulando')
          errorCount++
          continue
        }

        console.log(`   ✅ Encontrado!`)

        const images = product.images || []
        console.log(`   📸 Imagens: ${images.length}`)

        if (images.length === 0) {
          console.log('   ⚠️  Sem imagens - pulando')
          continue
        }

        // 2. Fazer upload de cada imagem
        for (let i = 0; i < images.length; i++) {
          const imagePath = images[i]
          const fullPath = path.resolve(__dirname, '..', imagePath)

          // Verificar se existe
          if (!fs.existsSync(fullPath)) {
            console.log(`   ⚠️  ${i + 1}/${images.length}: Não encontrada - ${path.basename(imagePath)}`)
            continue
          }

          console.log(`   ⏳ ${i + 1}/${images.length}: ${path.basename(imagePath)}`)

          try {
            // Ler imagem como base64
            const imageBuffer = fs.readFileSync(fullPath)
            const base64Image = imageBuffer.toString('base64')

            // Detectar MIME type
            const mimeType = imagePath.endsWith('.png') ? 'image/png' :
                            imagePath.endsWith('.webp') ? 'image/webp' :
                            'image/jpeg'

            // Criar data URI
            const imageDataUri = `data:${mimeType};base64,${base64Image}`

            // Upload via Admin API
            const result = await addProductImage(
              shopifyProduct.id,
              imageDataUri,
              `${product.name} - ${i + 1}`
            )

            if (result.userErrors && result.userErrors.length > 0) {
              console.log(`   ❌ Erro:`, result.userErrors[0].message)
              errorCount++
            } else {
              console.log(`   ✅ Enviada!`)
              successCount++
            }

            // Rate limit: aguardar 500ms entre uploads
            await new Promise(resolve => setTimeout(resolve, 500))

          } catch (imgError) {
            console.log(`   ❌ Erro no upload: ${imgError.message}`)
            errorCount++
          }
        }

        console.log(`   ✅ Produto concluído!`)

        // Progresso a cada 10 produtos
        if (processedProducts % 10 === 0) {
          const elapsed = Date.now() - startTime
          const avgTimePerProduct = elapsed / processedProducts
          const remaining = totalProducts - processedProducts
          const estimatedRemaining = (avgTimePerProduct * remaining) / 1000 / 60

          console.log(`\n⏱️  Progresso: ${processedProducts}/${totalProducts} produtos`)
          console.log(`   Tempo estimado restante: ${Math.ceil(estimatedRemaining)} minutos`)
        }

      } catch (error) {
        console.log(`   ❌ Erro: ${error.message}`)
        errorCount++
      }
    }
  }

  // Resumo final
  const totalTime = ((Date.now() - startTime) / 1000 / 60).toFixed(1)

  console.log('\n' + '='.repeat(60))
  console.log('📊 RESUMO FINAL')
  console.log('='.repeat(60))
  console.log(`✅ Imagens enviadas com sucesso: ${successCount}`)
  console.log(`❌ Erros: ${errorCount}`)
  console.log(`📦 Produtos processados: ${processedProducts}/${totalProducts}`)
  console.log(`⏱️  Tempo total: ${totalTime} minutos`)
  console.log('='.repeat(60))

  if (successCount > 0) {
    console.log('\n🎉 Upload concluído!')
    console.log('🌐 Todas as imagens estão no Shopify CDN')
    console.log('📱 Acesse Shopify Admin para verificar')
  }

  if (errorCount > 0) {
    console.log(`\n⚠️  ${errorCount} uploads falharam`)
    console.log('💡 Você pode rodar o script novamente para tentar os que falharam')
  }
}

// Executar
uploadImages().catch(error => {
  console.error('\n❌ Erro fatal:', error.message)
  process.exit(1)
})
```

### Funções Helper (shopifyAdmin.js)

```javascript
// src/lib/shopifyAdmin.js

const SHOPIFY_ADMIN_API = `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2024-10/graphql.json`
const ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN

/**
 * Buscar produto por handle
 */
export async function getProductByHandle(handle) {
  const query = `
    query getProduct($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
        handle
        images(first: 20) {
          edges {
            node {
              id
              url
            }
          }
        }
      }
    }
  `

  const response = await fetch(SHOPIFY_ADMIN_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': ADMIN_TOKEN,
    },
    body: JSON.stringify({
      query,
      variables: { handle }
    })
  })

  const data = await response.json()
  return data.data?.productByHandle || null
}

/**
 * Adicionar imagem ao produto
 */
export async function addProductImage(productId, imageDataUri, altText = '') {
  const mutation = `
    mutation productImageCreate($productId: ID!, $image: ImageInput!) {
      productImageCreate(productId: $productId, image: $image) {
        image {
          id
          url
        }
        userErrors {
          field
          message
        }
      }
    }
  `

  const response = await fetch(SHOPIFY_ADMIN_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': ADMIN_TOKEN,
    },
    body: JSON.stringify({
      query: mutation,
      variables: {
        productId,
        image: {
          src: imageDataUri,
          altText
        }
      }
    })
  })

  const data = await response.json()
  return data.data?.productImageCreate || { userErrors: [{ message: 'Unknown error' }] }
}
```

### Executar Upload

```bash
node scripts/uploadProductImages-ALL.mjs
```

### Saída Durante Execução

```
📸 SHOPIFY IMAGE UPLOADER - COMPLETO

✅ Total de produtos a processar: 271
⚠️  Este processo pode demorar 2-3 horas.
💡 Você pode deixar rodando em background.

📁 Liga: Premier League (38 produtos)
────────────────────────────────────────────────────────────

[1/271] 📦 Manchester United 08/09 Home
   Handle: manchester-united-08-09-home
   🔍 Buscando na Shopify...
   ✅ Encontrado!
   📸 Imagens: 8
   ⏳ 1/8: 001.jpg
   ✅ Enviada!
   ⏳ 2/8: 002.jpg
   ✅ Enviada!
   ...
   ✅ Produto concluído!

⏱️  Progresso: 10/271 produtos
   Tempo estimado restante: 142 minutos

...

============================================================
📊 RESUMO FINAL
============================================================
✅ Imagens enviadas com sucesso: 2145
❌ Erros: 15
📦 Produtos processados: 271/271
⏱️  Tempo total: 158.3 minutos
============================================================

🎉 Upload concluído!
🌐 Todas as imagens estão no Shopify CDN
📱 Acesse Shopify Admin para verificar
```

### Dicas Importantes

- ✅ **Pode deixar rodando em background** e fazer outras coisas
- ✅ **Não feche o terminal** durante a execução
- ✅ **Se der erro de conexão**, pode rodar novamente (pula duplicadas)
- ✅ **Aguarda 500ms** entre cada imagem (respeita rate limit da Shopify)
- ✅ **Imagens vão para CDN** automaticamente com URLs otimizadas

---

## 🗺️ Passo 4: Mapeamento de Variant IDs

### Por Que Fazer Mapeamento?

Quando você adiciona um produto ao carrinho, precisa do **Shopify Variant ID** (não o handle).

**Problema:** Seu frontend usa `handle + size`, mas o checkout precisa de `variantId`.

**Solução:** Criar um arquivo JSON que mapeia `handle + size` → `variantId`.

### Script de Mapeamento

**Arquivo:** `scripts/fetch-new-shopify-variants.js`

```javascript
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '../.env.local') })

const SHOPIFY_STORE = {
  domain: process.env.SHOPIFY_STORE_DOMAIN,
  storefrontToken: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN
}

const API_VERSION = '2024-10'

console.log(`🔗 Conectando à loja Shopify: ${SHOPIFY_STORE.domain}\n`)

/**
 * GraphQL request helper
 */
async function shopifyGraphQL(query, variables = {}) {
  const url = `https://${SHOPIFY_STORE.domain}/api/${API_VERSION}/graphql.json`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_STORE.storefrontToken,
    },
    body: JSON.stringify({ query, variables }),
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }

  const json = await response.json()

  if (json.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`)
  }

  return json.data
}

/**
 * Buscar todos os produtos com paginação
 */
async function fetchAllProducts() {
  console.log('🔍 Buscando produtos da Shopify...\n')

  const allProducts = []
  let hasNextPage = true
  let cursor = null
  let pageCount = 0

  while (hasNextPage) {
    pageCount++
    console.log(`   Página ${pageCount}...`)

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
              tags
              variants(first: 100) {
                edges {
                  node {
                    id
                    title
                    sku
                    selectedOptions {
                      name
                      value
                    }
                    price {
                      amount
                      currencyCode
                    }
                    compareAtPrice {
                      amount
                      currencyCode
                    }
                    availableForSale
                    quantityAvailable
                  }
                }
              }
            }
          }
        }
      }
    `

    const data = await shopifyGraphQL(query, { cursor })

    const products = data.products.edges.map(edge => edge.node)
    allProducts.push(...products)

    hasNextPage = data.products.pageInfo.hasNextPage
    cursor = data.products.pageInfo.endCursor

    // Delay para rate limit
    if (hasNextPage) {
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  }

  console.log(`\n✅ Total de produtos encontrados: ${allProducts.length}\n`)
  return allProducts
}

/**
 * Criar mapeamento
 */
async function main() {
  try {
    const shopifyProducts = await fetchAllProducts()

    if (shopifyProducts.length === 0) {
      console.error('⚠️  Nenhum produto encontrado!')
      process.exit(1)
    }

    console.log('🔗 Criando mapeamento de Variant IDs...\n')

    const mapping = {}
    let totalVariants = 0

    shopifyProducts.forEach((product) => {
      const handle = product.handle

      mapping[handle] = {
        handle: handle,
        title: product.title,
        shopifyProductId: product.id,
        productType: product.productType,
        tags: product.tags,
        variants: {},
      }

      // Mapear cada variante
      product.variants.edges.forEach((edge) => {
        const variant = edge.node

        // Encontrar opção de tamanho
        const sizeOption = variant.selectedOptions.find(
          opt => opt.name.toLowerCase() === 'size' ||
                 opt.name.toLowerCase() === 'tamanho'
        )

        const size = sizeOption ? sizeOption.value : 'Default'

        mapping[handle].variants[size] = {
          shopifyVariantId: variant.id,
          title: variant.title,
          sku: variant.sku,
          price: variant.price.amount,
          compareAtPrice: variant.compareAtPrice?.amount || null,
          currency: variant.price.currencyCode,
          availableForSale: variant.availableForSale,
          quantityAvailable: variant.quantityAvailable,
        }

        totalVariants++
      })

      console.log(`   ✓ ${product.title} (${product.variants.edges.length} variantes)`)
    })

    // Salvar mapeamento
    const mappingPath = path.join(__dirname, '../shopify-variant-mapping.json')
    fs.writeFileSync(mappingPath, JSON.stringify(mapping, null, 2), 'utf8')

    // Resumo
    console.log('\n' + '='.repeat(60))
    console.log('✅ MAPEAMENTO CRIADO COM SUCESSO!')
    console.log('='.repeat(60))
    console.log(`📁 Arquivo: shopify-variant-mapping.json`)
    console.log(`📊 Produtos mapeados: ${Object.keys(mapping).length}`)
    console.log(`🔢 Total de variantes: ${totalVariants}`)
    console.log('\n📖 Exemplo de uso:')
    console.log('   const mapping = require("./shopify-variant-mapping.json")')
    console.log('   const variantId = mapping["produto-handle"].variants["M"].shopifyVariantId')
    console.log('='.repeat(60))

  } catch (error) {
    console.error('\n❌ Erro:', error.message)
    process.exit(1)
  }
}

main()
```

### Executar Mapeamento

```bash
node scripts/fetch-new-shopify-variants.js
```

### Estrutura do Mapeamento Gerado

**Arquivo:** `shopify-variant-mapping.json`

```json
{
  "manchester-united-08-09-home": {
    "handle": "manchester-united-08-09-home",
    "title": "Manchester United 08/09 Home",
    "shopifyProductId": "gid://shopify/Product/1234567890",
    "productType": "Premier League",
    "tags": ["Inglaterra", "Premier League", "Jersey"],
    "variants": {
      "S": {
        "shopifyVariantId": "gid://shopify/ProductVariant/11111111",
        "title": "S",
        "sku": "manchester-united-08-09-home-S",
        "price": "359.00",
        "compareAtPrice": "538.50",
        "currency": "ARS",
        "availableForSale": true,
        "quantityAvailable": 100
      },
      "M": {
        "shopifyVariantId": "gid://shopify/ProductVariant/22222222",
        "title": "M",
        "sku": "manchester-united-08-09-home-M",
        "price": "359.00",
        "compareAtPrice": "538.50",
        "currency": "ARS",
        "availableForSale": true,
        "quantityAvailable": 100
      }
      // ... outros tamanhos
    }
  }
  // ... outros produtos
}
```

---

## 🛒 Passo 5: Integração com Checkout

### Como Usar o Mapeamento

**Arquivo:** `src/utils/getVariantId.js`

```javascript
import variantMapping from '../../shopify-variant-mapping.json'

/**
 * Buscar Variant ID do Shopify
 * @param {string} handle - Handle do produto (ex: "manchester-united-08-09-home")
 * @param {string} size - Tamanho (ex: "M")
 * @returns {string|null} - Shopify Variant ID
 */
export function getVariantId(handle, size) {
  const product = variantMapping[handle]

  if (!product) {
    console.error(`Produto não encontrado: ${handle}`)
    return null
  }

  const variant = product.variants[size]

  if (!variant) {
    console.error(`Tamanho não disponível: ${size} para ${handle}`)
    return null
  }

  return variant.shopifyVariantId
}

/**
 * Buscar informações completas da variante
 */
export function getVariantInfo(handle, size) {
  const product = variantMapping[handle]
  if (!product) return null

  const variant = product.variants[size]
  if (!variant) return null

  return {
    ...variant,
    productTitle: product.title,
    productHandle: product.handle,
  }
}
```

### Integração com Carrinho

**Arquivo:** `src/components/cart/CartSummary.jsx`

```javascript
import { getVariantId } from '@/utils/getVariantId'

export default function CartSummary({ cartItems }) {

  const handleCheckout = async () => {
    // Preparar line items para Shopify
    const lineItems = cartItems.map(item => {
      const variantId = getVariantId(item.handle, item.size)

      if (!variantId) {
        throw new Error(`Variant não encontrado: ${item.handle} - ${item.size}`)
      }

      return {
        variantId: variantId,
        quantity: item.quantity
      }
    })

    // Criar checkout na Shopify
    const checkoutUrl = await createShopifyCheckout(lineItems)

    // Redirecionar para checkout
    window.location.href = checkoutUrl
  }

  return (
    <div>
      {/* Resumo do carrinho */}
      <button onClick={handleCheckout}>
        Finalizar Compra
      </button>
    </div>
  )
}
```

### Criar Checkout via Storefront API

**Arquivo:** `src/lib/shopifyCheckout.js`

```javascript
const SHOPIFY_STOREFRONT_API = `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/api/2024-10/graphql.json`
const STOREFRONT_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN

/**
 * Criar checkout na Shopify
 * @param {Array} lineItems - [{variantId, quantity}, ...]
 * @returns {string} - URL do checkout
 */
export async function createShopifyCheckout(lineItems) {
  const mutation = `
    mutation checkoutCreate($input: CheckoutCreateInput!) {
      checkoutCreate(input: $input) {
        checkout {
          id
          webUrl
        }
        checkoutUserErrors {
          field
          message
        }
      }
    }
  `

  const response = await fetch(SHOPIFY_STOREFRONT_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN,
    },
    body: JSON.stringify({
      query: mutation,
      variables: {
        input: {
          lineItems: lineItems
        }
      }
    })
  })

  const data = await response.json()

  if (data.data?.checkoutCreate?.checkoutUserErrors?.length > 0) {
    throw new Error(data.data.checkoutCreate.checkoutUserErrors[0].message)
  }

  return data.data.checkoutCreate.checkout.webUrl
}
```

### Fluxo Completo do Usuário

```
1. Usuário navega na loja (seu frontend)
        ↓
2. Seleciona produto + tamanho
        ↓
3. Adiciona ao carrinho
   - Armazena: { handle: "produto-x", size: "M", quantity: 1 }
        ↓
4. Clica em "Finalizar Compra"
        ↓
5. Frontend busca variantId no mapeamento
   - Input: handle="produto-x", size="M"
   - Output: variantId="gid://shopify/ProductVariant/12345"
        ↓
6. Cria checkout na Shopify via API
   - POST /graphql com mutation checkoutCreate
        ↓
7. Shopify retorna URL do checkout
        ↓
8. Redireciona usuário para checkout da Shopify
        ↓
9. Usuário completa pagamento
        ↓
10. Shopify processa pedido
        ↓
11. Email de confirmação enviado
```

---

## 📝 Scripts Completos

### package.json

Adicione esses scripts:

```json
{
  "scripts": {
    "generate-csv": "node scripts/generateShopifyCSV.js",
    "upload-images": "node scripts/uploadProductImages-ALL.mjs",
    "fetch-variants": "node scripts/fetch-new-shopify-variants.js",
    "import-all": "node scripts/import-to-new-shopify.js"
  }
}
```

### .env.local

Configure as variáveis de ambiente:

```env
# Shopify Store
SHOPIFY_STORE_DOMAIN=sua-loja.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=seu_token_storefront
SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_seu_token_admin

# Next.js Public (para frontend)
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=sua-loja.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=seu_token_storefront
```

### Como Obter Tokens

#### Storefront API Token

1. Acesse: **Settings** → **Apps and sales channels**
2. Clique em **Develop apps**
3. Crie um novo app ou use existente
4. Em **Configuration**, ative permissões:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_write_checkouts`
5. Copie o **Storefront API access token**

#### Admin API Token

1. No mesmo app, vá em **API credentials**
2. Em **Admin API**, ative permissões:
   - `read_products`
   - `write_products`
   - `read_product_listings`
3. Clique em **Install app**
4. Copie o **Admin API access token** (shpat_...)

---

## 🐛 Troubleshooting

### Erro: "Product not found"

**Causa:** Handle no mapeamento não corresponde ao handle na Shopify

**Solução:**
1. Verifique o handle no Shopify Admin
2. Compare com `leagues_data.json`
3. Certifique-se que são idênticos (case-sensitive)

### Erro: "Invalid variant ID"

**Causa:** Variant ID está em formato errado

**Solução:**
- Variant ID deve ser: `gid://shopify/ProductVariant/NUMERO`
- Re-execute o script de mapeamento

### Upload de imagens falha

**Causa:** Rate limiting ou arquivo muito grande

**Solução:**
- Aguarde e tente novamente
- Imagens devem ter menos de 20MB
- Script já tem delay de 500ms entre uploads

### Checkout creation failed

**Causa:** Storefront API token inválido ou sem permissões

**Solução:**
1. Verifique o token no .env.local
2. Certifique-se que o app tem permissões corretas
3. Token deve ter `unauthenticated_write_checkouts`

---

## ✅ Checklist Final

Use esta checklist para garantir que tudo foi feito:

### Pré-requisitos
- [ ] JSON com dados dos produtos criado
- [ ] Imagens organizadas em pastas locais
- [ ] Shopify Admin Access Token obtido
- [ ] Storefront API Token obtido
- [ ] .env.local configurado

### Passo 1: CSV
- [ ] Script generateShopifyCSV.js criado
- [ ] CSV gerado com sucesso
- [ ] CSV revisado (produtos, preços, variantes)

### Passo 2: Importação
- [ ] CSV importado na Shopify Admin
- [ ] Email de confirmação recebido
- [ ] Produtos aparecem no Admin (sem imagens)
- [ ] Variantes de tamanho corretas

### Passo 3: Imagens
- [ ] shopifyAdmin.js com funções helper criado
- [ ] Script uploadProductImages-ALL.mjs criado
- [ ] Upload executado e concluído
- [ ] Imagens aparecem nos produtos

### Passo 4: Mapeamento
- [ ] Script fetch-new-shopify-variants.js criado
- [ ] Mapeamento gerado (shopify-variant-mapping.json)
- [ ] Arquivo revisado (variant IDs corretos)

### Passo 5: Checkout
- [ ] getVariantId.js criado
- [ ] shopifyCheckout.js criado
- [ ] Integração com carrinho implementada
- [ ] Checkout testado e funcionando

### Verificação Final
- [ ] Todos os produtos visíveis no site
- [ ] Imagens carregam rápido (CDN)
- [ ] Adicionar ao carrinho funciona
- [ ] Checkout redireciona corretamente
- [ ] Pagamento pode ser completado

---

## 📊 Estatísticas Esperadas

Para um projeto com ~270 produtos:

| Métrica | Valor |
|---------|-------|
| Produtos no JSON | ~270 |
| Variantes (tamanhos) | ~1.850 |
| Imagens totais | ~2.160 |
| Tamanho CSV | ~2-3 MB |
| **Tempo total** | **~3-4 horas** |

---

## 🎯 Próximos Passos

Após importação completa:

1. **Deletar pasta de imagens locais**
   - Libera ~2-3GB de espaço
   - Imagens agora estão no CDN da Shopify

2. **Migrar para API Shopify**
   - Usar Storefront API para buscar produtos
   - Remover dependência de JSON local

3. **Deploy na Vercel**
   - Build mais rápido (sem imagens locais)
   - Site usa CDN da Shopify

4. **Configurar pagamentos**
   - Ativar gateway de pagamento na Shopify
   - Testar checkout completo

---

## 📚 Referências

- [Shopify CSV Import Format](https://help.shopify.com/en/manual/products/import-export/using-csv)
- [Shopify Admin API](https://shopify.dev/docs/api/admin-graphql)
- [Shopify Storefront API](https://shopify.dev/docs/api/storefront)
- [Product Images API](https://shopify.dev/docs/api/admin-graphql/latest/mutations/productImageCreate)

---

**Última atualização:** 2025-11-04
**Versão:** 1.0
**Autor:** Claude (Anthropic)

---

✅ **Este guia cobre TODO o processo de A a Z. Use como referência para importar produtos em qualquer projeto Shopify!**

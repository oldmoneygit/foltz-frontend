const fs = require('fs')
const path = require('path')

// Ler dados das ligas
const leaguesData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../leagues_data.json'), 'utf-8')
)

console.log('📦 SHOPIFY CSV GENERATOR - TODOS OS PRODUTOS\n')

// Parse sizes: "Size S-XXL" -> ['S', 'M', 'L', 'XL', 'XXL']
function parseSizes(sizesString) {
  if (!sizesString) return ['M']

  const sizeOrder = ['S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL']

  // Extract size range, e.g., "Size S-4XL" or "S-XXL"
  const match = sizesString.match(/Size\s*([A-Z0-9]+)-([A-Z0-9]+)/i) ||
                sizesString.match(/([A-Z0-9]+)-([A-Z0-9]+)/i)

  if (!match) return ['M']

  const [, startSize, endSize] = match
  const startIdx = sizeOrder.indexOf(startSize.toUpperCase())
  const endIdx = sizeOrder.indexOf(endSize.toUpperCase())

  if (startIdx === -1 || endIdx === -1) return ['M']

  return sizeOrder.slice(startIdx, endIdx + 1)
}

// Headers do CSV da Shopify
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

// Processar cada liga
Object.keys(leaguesData).forEach(leagueId => {
  const league = leaguesData[leagueId]

  if (!league.products || !Array.isArray(league.products)) return

  league.products.forEach(product => {
    productCount++
    const handle = product.id
    const title = product.name
    const vendor = 'Foltz Fanwear'
    const productType = league.name
    const tags = [league.country, league.name, 'Jersey', 'Futebol', 'COMPRA 1 LLEVA 2'].join(', ')

    // Parse sizes
    const sizes = parseSizes(product.sizes)

    // Preços (converter para formato Shopify)
    const price = '82713.38' // Preço padrão
    const compareAtPrice = '115798.73' // Preço original

    // Descrição HTML
    const bodyHTML = `<p>Foltz Fanwear</p>`

    // Se não tem tamanhos, criar apenas 1 variante padrão
    if (sizes.length === 0) {
      sizes.push('M') // Tamanho padrão
    }

    // Criar uma linha para cada variante (tamanho)
    sizes.forEach((size, sizeIndex) => {
      const isFirstRow = sizeIndex === 0

      const row = [
        handle, // Handle
        isFirstRow ? title : '', // Title (só primeira linha)
        isFirstRow ? bodyHTML : '', // Body HTML (só primeira linha)
        isFirstRow ? vendor : '', // Vendor
        isFirstRow ? productType : '', // Type
        isFirstRow ? tags : '', // Tags
        isFirstRow ? 'TRUE' : '', // Published
        isFirstRow ? 'Size' : '', // Option1 Name
        size, // Option1 Value (tamanho)
        '', // Option2 Name
        '', // Option2 Value
        '', // Option3 Name
        '', // Option3 Value
        `${handle}-${size}`, // Variant SKU
        '400', // Variant Grams (peso padrão)
        '', // Variant Inventory Tracker
        '100', // Variant Inventory Qty
        'deny', // Variant Inventory Policy
        'manual', // Variant Fulfillment Service
        price, // Variant Price
        compareAtPrice, // Variant Compare At Price
        'TRUE', // Variant Requires Shipping
        'TRUE', // Variant Taxable
        '', // Variant Barcode
        '', // Image Src (vazio - adicionar depois via API)
        '', // Image Position
        '', // Image Alt Text
        'FALSE', // Gift Card
        isFirstRow ? title : '', // SEO Title
        isFirstRow ? `Camisa ${title} - ${league.name}. Compra 1 Lleva 2!` : '', // SEO Description
        'Apparel & Accessories > Clothing > Activewear > Jerseys', // Google Product Category
        'Unisex', // Gender
        'Adult', // Age Group
        '', // MPN
        '', // AdWords Grouping
        '', // AdWords Labels
        'New', // Condition
        '', // Custom Product
        league.name, // Custom Label 0 (Liga)
        league.country, // Custom Label 1 (País)
        'COMPRA 1 LLEVA 2', // Custom Label 2 (Promoção)
        '', // Custom Label 3
        '', // Custom Label 4
        '', // Variant Image
        'kg', // Variant Weight Unit
        '', // Variant Tax Code
        '', // Cost per item
        'active' // Status
      ]

      rows.push(row)
    })

    console.log(`📦 Produto ${productCount}: ${title} (${sizes.length} variantes)`)
  })
})

// Gerar CSV
const csvContent = [
  headers.join(','),
  ...rows.map(row =>
    row.map(cell => {
      // Escapar células que contêm vírgulas, aspas ou quebras de linha
      const cellStr = String(cell || '')
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
console.log('   3. Aguarde a importação')
console.log('   4. Execute: npm run upload-images-all (para upload das imagens via API)')
console.log('\n✨ As imagens serão adicionadas via API após a importação CSV!')

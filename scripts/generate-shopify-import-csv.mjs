import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load list of products to import
const importList = JSON.parse(fs.readFileSync(
  path.join(__dirname, '..', 'FINAL-IMPORT-LIST.json'),
  'utf-8'
));

const productsToImport = new Set(importList.allUniqueProducts);
console.log(`📋 ${productsToImport.size} produtos para importar\n`);

// Read original Retrobox CSV
const csvPath = 'C:\\Users\\PC\\Documents\\Retrobox\\produtos\\retrobox_camisas_shopify.csv';
const csvContent = fs.readFileSync(csvPath, 'utf-8');
const lines = csvContent.split('\n');

// Get header
const header = lines[0];
console.log('📄 Header CSV:', header.substring(0, 100) + '...\n');

// Process lines and extract products to import
const outputLines = [header];
let currentHandle = null;
let currentTitle = null;
let includeProduct = false;
let includedProducts = 0;
let includedVariants = 0;

for (let i = 1; i < lines.length; i++) {
  const line = lines[i];
  if (!line.trim()) continue;

  // Extract handle from line
  const handleMatch = line.match(/^([a-z0-9-]+),/);
  if (!handleMatch) continue;

  const handle = handleMatch[1];

  // Check if this is a new product (has title after handle)
  const afterHandle = line.substring(handle.length + 1);
  const titleMatch = afterHandle.match(/^"?([^",]+)/);

  if (titleMatch && titleMatch[1] && titleMatch[1].trim() && !titleMatch[1].startsWith(',')) {
    // New product line
    let title = titleMatch[1].trim();
    if (title.startsWith('"')) title = title.substring(1);

    currentHandle = handle;
    currentTitle = title;
    includeProduct = productsToImport.has(title);

    if (includeProduct) {
      includedProducts++;
      outputLines.push(line);
      includedVariants++;
    }
  } else if (handle === currentHandle && includeProduct) {
    // Variant line for included product
    outputLines.push(line);
    includedVariants++;
  }
}

console.log(`✅ Produtos incluídos: ${includedProducts}`);
console.log(`✅ Total de linhas (com variantes): ${includedVariants}`);

// Save output CSV
const outputPath = path.join(__dirname, '..', 'SHOPIFY-IMPORT-394-PRODUCTS.csv');
fs.writeFileSync(outputPath, outputLines.join('\n'), 'utf-8');

console.log(`\n📁 CSV salvo em: SHOPIFY-IMPORT-394-PRODUCTS.csv`);
console.log(`📊 Tamanho do arquivo: ${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB`);

// Verify some products
console.log('\n🔍 Verificação - Primeiros 10 produtos no CSV:');
let count = 0;
for (let i = 1; i < outputLines.length && count < 10; i++) {
  const line = outputLines[i];
  const titleMatch = line.match(/^[a-z0-9-]+,"?([^",]+)/);
  if (titleMatch && titleMatch[1]) {
    count++;
    console.log(`  ${count}. ${titleMatch[1]}`);
  }
}

// Check for missing products
console.log('\n⚠️ Verificando produtos não encontrados no CSV...');
const foundProducts = new Set();

for (const line of outputLines.slice(1)) {
  const titleMatch = line.match(/^[a-z0-9-]+,"?([^",]+)/);
  if (titleMatch && titleMatch[1]) {
    foundProducts.add(titleMatch[1].trim());
  }
}

const missing = [];
for (const title of productsToImport) {
  if (!foundProducts.has(title)) {
    missing.push(title);
  }
}

if (missing.length > 0) {
  console.log(`\n❌ ${missing.length} produtos não encontrados no CSV original:`);
  missing.slice(0, 20).forEach(p => console.log(`  - ${p}`));
  if (missing.length > 20) console.log(`  ... e mais ${missing.length - 20}`);
} else {
  console.log('✅ Todos os produtos foram encontrados!');
}

console.log('\n🎉 CSV pronto para importação na Shopify!');

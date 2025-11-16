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

// Filter out products with v2, v3, v4, etc. (duplicates)
const allProducts = importList.allUniqueProducts.filter(title => {
  // Exclude products with v2, v3, v4, etc. in title
  return !/\bv\d+\b/i.test(title);
});

const productsToImport = new Set(allProducts);
console.log(`📋 ${productsToImport.size} produtos para importar (excluídos v2, v3, v4, etc.)\n`);

// Read original Retrobox CSV
const csvPath = 'C:\\Users\\PC\\Documents\\Retrobox\\produtos\\retrobox_camisas_shopify.csv';
const csvContent = fs.readFileSync(csvPath, 'utf-8');

// Parse CSV properly handling multiline fields
// This parser keeps fields exactly as they appear in the CSV (including quotes)
function parseCSVWithMultiline(content) {
  const records = [];
  let currentRecord = [];
  let currentField = '';
  let inQuotes = false;
  let i = 0;

  while (i < content.length) {
    const char = content[i];

    if (char === '"') {
      if (!inQuotes) {
        // Starting a quoted field
        inQuotes = true;
        currentField += char;
        i++;
      } else if (content[i + 1] === '"') {
        // Escaped quote inside quoted field
        currentField += '""';
        i += 2;
      } else {
        // Ending a quoted field
        inQuotes = false;
        currentField += char;
        i++;
      }
    } else if (char === ',' && !inQuotes) {
      // Field separator
      currentRecord.push(currentField);
      currentField = '';
      i++;
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      // Record separator (only when not in quotes)
      if (char === '\r' && content[i + 1] === '\n') {
        i++; // Skip \r in \r\n
      }
      currentRecord.push(currentField);
      if (currentRecord.length > 1 || currentRecord[0] !== '') {
        records.push(currentRecord);
      }
      currentRecord = [];
      currentField = '';
      i++;
    } else {
      currentField += char;
      i++;
    }
  }

  // Don't forget last field/record
  if (currentField || currentRecord.length > 0) {
    currentRecord.push(currentField);
    if (currentRecord.length > 1 || currentRecord[0] !== '') {
      records.push(currentRecord);
    }
  }

  return records;
}

// Rebuild CSV line from fields
function recordToCSVLine(fields) {
  return fields.map(field => {
    // If field contains comma, quote, or newline, it needs to be properly quoted
    if (field.includes(',') || field.includes('"') || field.includes('\n') || field.includes('\r')) {
      // Check if already wrapped in quotes
      if (field.startsWith('"') && field.endsWith('"')) {
        return field; // Already properly formatted
      }
      // Escape internal quotes and wrap in quotes
      const escaped = field.replace(/"/g, '""');
      return `"${escaped}"`;
    }
    return field;
  }).join(',');
}

console.log('📄 Parseando CSV com campos multilinha...\n');
const records = parseCSVWithMultiline(csvContent);
console.log(`📊 Total de registros parseados: ${records.length}\n`);

// Header is first record
const header = records[0];
console.log('📄 Colunas:', header.length);

// Find column indices
const handleIdx = 0; // Handle is always first
const titleIdx = 1;  // Title is second
const tagsIdx = header.findIndex(col => col === 'Tags');

// Add inventory quantity column to header (after Variant Inventory Policy)
const inventoryPolicyIdx = header.findIndex(col => col === 'Variant Inventory Policy');
console.log(`📍 Tags column index: ${tagsIdx}`);
console.log(`📍 Variant Inventory Policy index: ${inventoryPolicyIdx}`);

// Insert "Variant Inventory Qty" column after Variant Inventory Policy
const inventoryQtyIdx = inventoryPolicyIdx + 1;
header.splice(inventoryQtyIdx, 0, 'Variant Inventory Qty');
console.log(`📍 Added 'Variant Inventory Qty' at index: ${inventoryQtyIdx}`);

// Default stock quantity
const DEFAULT_STOCK_QTY = 100;
console.log(`📦 Stock quantity per variant: ${DEFAULT_STOCK_QTY}\n`);

// Process records
const outputRecords = [header]; // Start with modified header (with new column)
let currentHandle = null;
let includeProduct = false;
let includedProducts = 0;
let includedVariants = 0;

// Helper to add Retro tag to a field (handles quoted fields)
function addRetroTag(tagsField) {
  if (!tagsField) return 'Retro';

  let tags = tagsField;
  let hasQuotes = false;

  // Check if field is wrapped in quotes
  if (tags.startsWith('"') && tags.endsWith('"')) {
    hasQuotes = true;
    tags = tags.slice(1, -1); // Remove outer quotes
  }

  // Check if Retro already exists
  if (tags.toLowerCase().includes('retro')) {
    return tagsField; // Return unchanged
  }

  // Add Retro tag
  const newTags = tags ? `Retro, ${tags}` : 'Retro';

  // Re-wrap in quotes if needed
  if (hasQuotes || newTags.includes(',')) {
    return `"${newTags}"`;
  }
  return newTags;
}

for (let i = 1; i < records.length; i++) {
  const record = records[i];
  if (record.length < 2) continue;

  const handle = record[handleIdx];
  let title = record[titleIdx];

  // Remove quotes from title for comparison
  if (title && title.startsWith('"') && title.endsWith('"')) {
    title = title.slice(1, -1);
  }

  // Check if this is a new product (has a title)
  if (title && title.trim()) {
    currentHandle = handle;
    includeProduct = productsToImport.has(title.trim());

    if (includeProduct) {
      includedProducts++;
      // Add Retro tag
      if (tagsIdx >= 0 && record[tagsIdx] !== undefined) {
        record[tagsIdx] = addRetroTag(record[tagsIdx]);
      }
      // Insert inventory quantity at the new column position
      record.splice(inventoryQtyIdx, 0, String(DEFAULT_STOCK_QTY));
      outputRecords.push(record);
      includedVariants++;
    }
  } else if (handle === currentHandle && includeProduct) {
    // Variant line for included product
    // Add Retro tag to variant too
    if (tagsIdx >= 0 && record[tagsIdx] !== undefined) {
      record[tagsIdx] = addRetroTag(record[tagsIdx]);
    }
    // Insert inventory quantity at the new column position
    record.splice(inventoryQtyIdx, 0, String(DEFAULT_STOCK_QTY));
    outputRecords.push(record);
    includedVariants++;
  }
}

console.log(`✅ Produtos incluídos: ${includedProducts}`);
console.log(`✅ Total de registros (com variantes): ${includedVariants}`);

// Convert back to CSV string (use \r\n for better compatibility)
const outputCSV = outputRecords.map(record => recordToCSVLine(record)).join('\r\n');

// Save output CSV with UTF-8 BOM for better compatibility
const outputPath = path.join(__dirname, '..', 'SHOPIFY-IMPORT-394-RETRO-FIXED.csv');
const BOM = '\uFEFF'; // UTF-8 BOM
fs.writeFileSync(outputPath, BOM + outputCSV, 'utf-8');

console.log(`\n📁 CSV salvo em: SHOPIFY-IMPORT-394-RETRO-FIXED.csv`);
console.log(`📊 Tamanho do arquivo: ${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB`);

// Verify some products
console.log('\n🔍 Verificação - Primeiros 10 produtos:');
let count = 0;
for (let i = 1; i < outputRecords.length && count < 10; i++) {
  const record = outputRecords[i];
  let title = record[titleIdx];
  if (title && title.startsWith('"') && title.endsWith('"')) {
    title = title.slice(1, -1);
  }
  if (title && title.trim()) {
    count++;
    console.log(`  ${count}. ${title} [Tags: ${record[tagsIdx] || 'N/A'}]`);
  }
}

// Check for missing products
console.log('\n⚠️ Verificando produtos não encontrados...');
const foundProducts = new Set();

for (let i = 1; i < outputRecords.length; i++) {
  let title = outputRecords[i][titleIdx];
  if (title && title.startsWith('"') && title.endsWith('"')) {
    title = title.slice(1, -1);
  }
  if (title && title.trim()) {
    foundProducts.add(title.trim());
  }
}

const missing = [];
for (const title of productsToImport) {
  if (!foundProducts.has(title)) {
    missing.push(title);
  }
}

if (missing.length > 0) {
  console.log(`\n❌ ${missing.length} produtos não encontrados:`);
  missing.slice(0, 20).forEach(p => console.log(`  - ${p}`));
  if (missing.length > 20) console.log(`  ... e mais ${missing.length - 20}`);
} else {
  console.log('✅ Todos os produtos foram encontrados!');
}

console.log('\n🎉 CSV corrigido e pronto para importação na Shopify!');

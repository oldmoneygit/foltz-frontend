import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const SHOPIFY_STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const SHOPIFY_ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

console.log('=== Adicionando Tag RETRO ===\n');

// PARTE 1: Atualizar CSV de importação
console.log('📄 PARTE 1: Atualizando CSV de importação...\n');

const csvPath = path.join(__dirname, '..', 'SHOPIFY-IMPORT-394-PRODUCTS.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');
const lines = csvContent.split('\n');

const header = lines[0];
const headerColumns = header.split(',');

// Find Tags column index
const tagsIndex = headerColumns.findIndex(col => col.includes('Tags'));
console.log(`📍 Coluna Tags encontrada no índice: ${tagsIndex}`);

// Process each line
const updatedLines = [header];
let updatedCount = 0;

for (let i = 1; i < lines.length; i++) {
  const line = lines[i];
  if (!line.trim()) continue;

  // Parse CSV line respecting quotes
  const values = parseCSVLine(line);

  // Check if this line has Tags field
  if (values[tagsIndex] !== undefined) {
    let tags = values[tagsIndex];

    // Add Retro tag if not present
    if (!tags.toLowerCase().includes('retro')) {
      if (tags) {
        tags = `Retro, ${tags}`;
      } else {
        tags = 'Retro';
      }
      values[tagsIndex] = tags;
      updatedCount++;
    }

    // Rebuild line
    updatedLines.push(rebuildCSVLine(values));
  } else {
    updatedLines.push(line);
  }
}

// Save updated CSV
const outputPath = path.join(__dirname, '..', 'SHOPIFY-IMPORT-394-RETRO.csv');
fs.writeFileSync(outputPath, updatedLines.join('\n'), 'utf-8');

console.log(`✅ CSV atualizado com tag Retro: ${updatedCount} linhas`);
console.log(`📁 Salvo em: SHOPIFY-IMPORT-394-RETRO.csv\n`);

// PARTE 2: Listar produtos existentes para atualizar
console.log('📄 PARTE 2: Buscando produtos existentes na Shopify (anos < 2015)...\n');

const getAllProductsQuery = `
  query getAllProducts($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      edges {
        node {
          id
          handle
          title
          tags
        }
        cursor
      }
      pageInfo {
        hasNextPage
      }
    }
  }
`;

async function fetchProducts() {
  const allProducts = [];
  let hasNextPage = true;
  let cursor = null;

  while (hasNextPage) {
    const response = await fetch(`https://${SHOPIFY_STORE_DOMAIN}/api/2024-10/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({
        query: getAllProductsQuery,
        variables: { first: 250, after: cursor }
      })
    });

    const json = await response.json();
    if (json.errors) break;

    const products = json.data.products;
    allProducts.push(...products.edges.map(e => e.node));

    hasNextPage = products.pageInfo.hasNextPage;
    if (hasNextPage && products.edges.length > 0) {
      cursor = products.edges[products.edges.length - 1].cursor;
    }
  }

  return allProducts;
}

// Extract year from title
function extractYear(title) {
  // Match patterns like "07/08", "2006", "1998"
  const seasonMatch = title.match(/(\d{2})\/(\d{2})/);
  if (seasonMatch) {
    const year = parseInt(seasonMatch[1]);
    return year > 50 ? 1900 + year : 2000 + year;
  }

  const yearMatch = title.match(/\b(19\d{2}|20\d{2})\b/);
  if (yearMatch) {
    return parseInt(yearMatch[1]);
  }

  return null;
}

// Check if needs Retro tag/title
function needsRetroUpdate(product) {
  const year = extractYear(product.title);
  const hasRetroInTitle = product.title.toLowerCase().includes('retro');
  const hasRetroTag = product.tags.some(t => t.toLowerCase() === 'retro');

  // Needs update if year < 2015 AND (missing retro in title OR missing retro tag)
  if (year && year < 2015) {
    return {
      needsUpdate: !hasRetroInTitle || !hasRetroTag,
      year,
      hasRetroInTitle,
      hasRetroTag
    };
  }

  return { needsUpdate: false };
}

const products = await fetchProducts();
console.log(`📦 Total de produtos na Shopify: ${products.length}\n`);

const productsToUpdate = [];

products.forEach(product => {
  const check = needsRetroUpdate(product);
  if (check.needsUpdate) {
    productsToUpdate.push({
      id: product.id,
      handle: product.handle,
      currentTitle: product.title,
      currentTags: product.tags,
      year: check.year,
      hasRetroInTitle: check.hasRetroInTitle,
      hasRetroTag: check.hasRetroTag,
      newTitle: check.hasRetroInTitle ? product.title : addRetroToTitle(product.title),
      newTags: check.hasRetroTag ? product.tags : [...product.tags, 'Retro']
    });
  }
});

console.log(`🔄 Produtos para atualizar (ano < 2015, sem Retro): ${productsToUpdate.length}\n`);

if (productsToUpdate.length > 0) {
  console.log('Lista de produtos a atualizar:');
  productsToUpdate.forEach((p, i) => {
    console.log(`\n${i + 1}. ${p.currentTitle}`);
    console.log(`   Ano: ${p.year}`);
    console.log(`   Tem Retro no título: ${p.hasRetroInTitle ? 'SIM' : 'NÃO'}`);
    console.log(`   Tem tag Retro: ${p.hasRetroTag ? 'SIM' : 'NÃO'}`);
    if (!p.hasRetroInTitle) {
      console.log(`   Novo título: ${p.newTitle}`);
    }
  });

  // Save list for reference
  const updateListPath = path.join(__dirname, '..', 'PRODUCTS-TO-ADD-RETRO.json');
  fs.writeFileSync(updateListPath, JSON.stringify(productsToUpdate, null, 2));
  console.log(`\n✅ Lista salva em: PRODUCTS-TO-ADD-RETRO.json`);
}

console.log('\n' + '='.repeat(60));
console.log('📋 RESUMO:');
console.log(`  - CSV de importação atualizado com tag Retro`);
console.log(`  - ${productsToUpdate.length} produtos existentes precisam de atualização`);
console.log('='.repeat(60));

// Helper functions
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

function rebuildCSVLine(values) {
  return values.map(val => {
    if (val.includes(',') || val.includes('"') || val.includes('\n')) {
      return `"${val.replace(/"/g, '""')}"`;
    }
    return val;
  }).join(',');
}

function addRetroToTitle(title) {
  // Add "Retro" after team name and year, before "Home/Away/Third"
  const patterns = [
    /(.*\d{2}\/\d{2})\s+(Home|Away|Third)/i,
    /(.*\d{4})\s+(Home|Away|Third)/i,
    /(.*\d{2}\/\d{2})/,
    /(.*\d{4})/
  ];

  for (const pattern of patterns) {
    const match = title.match(pattern);
    if (match) {
      if (match[2]) {
        return `${match[1]} Retro ${match[2]}${title.substring(match[0].length)}`;
      } else {
        return `${match[1]} Retro${title.substring(match[0].length)}`;
      }
    }
  }

  // Fallback: add at the end
  return `${title} Retro`;
}

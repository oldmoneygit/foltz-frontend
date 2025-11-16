import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const SHOPIFY_STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const SHOPIFY_ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const SHOPIFY_STOREFRONT_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

console.log('=== Verificando Produtos com Retro Incorreto (ano >= 2015) ===\n');

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
        'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN,
      },
      body: JSON.stringify({
        query: getAllProductsQuery,
        variables: { first: 250, after: cursor }
      })
    });

    const json = await response.json();
    if (json.errors) {
      console.error('Erro:', json.errors);
      break;
    }

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
  // Match patterns like "07/08", "2006", "1998", "25/26"
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

// Remove "Retro" from title
function removeRetroFromTitle(title) {
  // Remove "Retro" from the title (preserving spaces)
  return title
    .replace(/\s+Retro\s+/gi, ' ')  // Retro in middle
    .replace(/\s+Retro$/gi, '')     // Retro at end
    .replace(/^Retro\s+/gi, '')     // Retro at start
    .replace(/\s+/g, ' ')           // Clean up double spaces
    .trim();
}

// Remove "Retro" from tags array
function removeRetroFromTags(tags) {
  return tags.filter(tag => tag.toLowerCase() !== 'retro');
}

const products = await fetchProducts();
console.log(`📦 Total de produtos na Shopify: ${products.length}\n`);

// Find products with Retro in title but year >= 2015
const productsToFix = [];

products.forEach(product => {
  const hasRetroInTitle = product.title.toLowerCase().includes('retro');
  const year = extractYear(product.title);

  // If has Retro and year >= 2015, needs to be fixed
  if (hasRetroInTitle && year && year >= 2015) {
    productsToFix.push({
      id: product.id,
      handle: product.handle,
      currentTitle: product.title,
      currentTags: product.tags,
      year: year,
      newTitle: removeRetroFromTitle(product.title),
      newTags: removeRetroFromTags(product.tags)
    });
  }
});

console.log(`🔄 Produtos para corrigir (Retro no título mas ano >= 2015): ${productsToFix.length}\n`);

if (productsToFix.length > 0) {
  console.log('Lista de produtos a corrigir:');
  productsToFix.forEach((p, i) => {
    console.log(`\n${i + 1}. ${p.currentTitle}`);
    console.log(`   Ano: ${p.year}`);
    console.log(`   Novo título: ${p.newTitle}`);
  });

  // Save list
  const fixListPath = path.join(__dirname, '..', 'PRODUCTS-TO-REMOVE-RETRO.json');
  fs.writeFileSync(fixListPath, JSON.stringify(productsToFix, null, 2));
  console.log(`\n✅ Lista salva em: PRODUCTS-TO-REMOVE-RETRO.json`);
} else {
  console.log('✅ Nenhum produto precisa ser corrigido!');
}

console.log('\n' + '='.repeat(60));
console.log('📋 RESUMO:');
console.log(`  - Total de produtos: ${products.length}`);
console.log(`  - Produtos com Retro incorreto (ano >= 2015): ${productsToFix.length}`);
console.log('='.repeat(60));

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

console.log('=== Buscando Produtos Duplicados (v2, v3, v4, etc.) ===\n');
console.log(`Store: ${SHOPIFY_STORE_DOMAIN}\n`);

const getAllProductsQuery = `
  query getAllProducts($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      edges {
        node {
          id
          handle
          title
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

const products = await fetchProducts();
console.log(`📦 Total de produtos na Shopify: ${products.length}\n`);

// Find products with v2, v3, v4, etc.
const duplicateProducts = products.filter(p => /\bv\d+\b/i.test(p.title));

console.log(`🔍 Produtos duplicados encontrados (v2, v3, v4, etc.): ${duplicateProducts.length}\n`);

if (duplicateProducts.length > 0) {
  console.log('Lista de produtos a excluir:');
  duplicateProducts.forEach((p, i) => {
    console.log(`  ${i + 1}. ${p.title}`);
  });

  // Save list for reference
  const listPath = path.join(__dirname, '..', 'PRODUCTS-TO-DELETE.json');
  fs.writeFileSync(listPath, JSON.stringify(duplicateProducts, null, 2));
  console.log(`\n✅ Lista salva em: PRODUCTS-TO-DELETE.json`);
  console.log(`\n⚠️  Total de ${duplicateProducts.length} produtos serão excluídos!`);
} else {
  console.log('✅ Nenhum produto duplicado encontrado!');
}

// Ask for confirmation before deleting
console.log('\n' + '='.repeat(60));
console.log('📋 RESUMO:');
console.log(`  - Total de produtos na Shopify: ${products.length}`);
console.log(`  - Produtos duplicados (v2, v3, etc.): ${duplicateProducts.length}`);
console.log('='.repeat(60));

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const SHOPIFY_STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const SHOPIFY_ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

console.log('=== Removendo Retro de Produtos (ano >= 2015) ===\n');
console.log(`Store: ${SHOPIFY_STORE_DOMAIN}`);
console.log(`Admin Token: ${SHOPIFY_ADMIN_TOKEN?.substring(0, 15)}...\n`);

// Load products to fix
const productsToFix = JSON.parse(fs.readFileSync(
  path.join(__dirname, '..', 'PRODUCTS-TO-REMOVE-RETRO.json'),
  'utf-8'
));

console.log(`📋 ${productsToFix.length} produtos para corrigir\n`);

// Admin API mutation
const updateProductMutation = `
  mutation productUpdate($input: ProductInput!) {
    productUpdate(input: $input) {
      product {
        id
        title
        tags
      }
      userErrors {
        field
        message
      }
    }
  }
`;

async function updateProduct(product) {
  const input = {
    id: product.id,
    title: product.newTitle,
    tags: product.newTags
  };

  try {
    const response = await fetch(`https://${SHOPIFY_STORE_DOMAIN}/admin/api/2024-10/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ADMIN_TOKEN,
      },
      body: JSON.stringify({
        query: updateProductMutation,
        variables: { input }
      })
    });

    const json = await response.json();

    if (json.errors) {
      console.error(`❌ Error updating ${product.currentTitle}:`, json.errors);
      return { success: false, error: json.errors };
    }

    if (json.data?.productUpdate?.userErrors?.length > 0) {
      console.error(`❌ User errors for ${product.currentTitle}:`, json.data.productUpdate.userErrors);
      return { success: false, error: json.data.productUpdate.userErrors };
    }

    return { success: true, product: json.data.productUpdate.product };
  } catch (error) {
    console.error(`❌ Exception updating ${product.currentTitle}:`, error.message);
    return { success: false, error: error.message };
  }
}

// Process updates in batches
async function processUpdates() {
  const results = {
    success: [],
    failed: []
  };

  const batchSize = 5;
  const delay = 500;

  for (let i = 0; i < productsToFix.length; i += batchSize) {
    const batch = productsToFix.slice(i, i + batchSize);
    console.log(`\n📦 Processando batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(productsToFix.length / batchSize)}...`);

    const promises = batch.map(async (product) => {
      const result = await updateProduct(product);
      if (result.success) {
        console.log(`  ✅ ${product.currentTitle} → ${product.newTitle}`);
        results.success.push(product);
      } else {
        console.log(`  ❌ ${product.currentTitle} - FALHOU`);
        results.failed.push({ product, error: result.error });
      }
    });

    await Promise.all(promises);

    if (i + batchSize < productsToFix.length) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  return results;
}

// Main execution
const results = await processUpdates();

console.log('\n' + '='.repeat(60));
console.log('📊 RESULTADO FINAL:');
console.log(`  ✅ Corrigidos com sucesso: ${results.success.length}`);
console.log(`  ❌ Falharam: ${results.failed.length}`);
console.log('='.repeat(60));

// Save results
const resultsPath = path.join(__dirname, '..', 'RETRO-REMOVAL-RESULTS.json');
fs.writeFileSync(resultsPath, JSON.stringify({
  timestamp: new Date().toISOString(),
  totalProcessed: productsToFix.length,
  successCount: results.success.length,
  failedCount: results.failed.length,
  success: results.success.map(p => ({ old: p.currentTitle, new: p.newTitle })),
  failed: results.failed
}, null, 2));

console.log(`\n✅ Resultados salvos em: RETRO-REMOVAL-RESULTS.json`);

if (results.failed.length > 0) {
  console.log('\n⚠️ Produtos que falharam:');
  results.failed.forEach(f => {
    console.log(`  - ${f.product.currentTitle}`);
  });
}

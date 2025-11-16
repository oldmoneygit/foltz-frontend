import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const SHOPIFY_STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const SHOPIFY_ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

console.log('=== Excluindo Produtos Duplicados (v2, v3, v4, etc.) ===\n');
console.log(`Store: ${SHOPIFY_STORE_DOMAIN}`);
console.log(`Admin Token: ${SHOPIFY_ADMIN_TOKEN?.substring(0, 15)}...\n`);

// Load products to delete
const productsToDelete = JSON.parse(fs.readFileSync(
  path.join(__dirname, '..', 'PRODUCTS-TO-DELETE.json'),
  'utf-8'
));

console.log(`🗑️  ${productsToDelete.length} produtos para excluir\n`);

// Admin API mutation for deleting product
const deleteProductMutation = `
  mutation productDelete($input: ProductDeleteInput!) {
    productDelete(input: $input) {
      deletedProductId
      userErrors {
        field
        message
      }
    }
  }
`;

async function deleteProduct(product) {
  const input = {
    id: product.id
  };

  try {
    const response = await fetch(`https://${SHOPIFY_STORE_DOMAIN}/admin/api/2024-10/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ADMIN_TOKEN,
      },
      body: JSON.stringify({
        query: deleteProductMutation,
        variables: { input }
      })
    });

    const json = await response.json();

    if (json.errors) {
      console.error(`❌ Error deleting ${product.title}:`, json.errors);
      return { success: false, error: json.errors };
    }

    if (json.data?.productDelete?.userErrors?.length > 0) {
      console.error(`❌ User errors for ${product.title}:`, json.data.productDelete.userErrors);
      return { success: false, error: json.data.productDelete.userErrors };
    }

    return { success: true, deletedId: json.data.productDelete.deletedProductId };
  } catch (error) {
    console.error(`❌ Exception deleting ${product.title}:`, error.message);
    return { success: false, error: error.message };
  }
}

// Process deletions
async function processDeletions() {
  const results = {
    success: [],
    failed: []
  };

  for (let i = 0; i < productsToDelete.length; i++) {
    const product = productsToDelete[i];
    console.log(`🗑️  Excluindo ${i + 1}/${productsToDelete.length}: ${product.title}...`);

    const result = await deleteProduct(product);
    if (result.success) {
      console.log(`   ✅ Excluído com sucesso`);
      results.success.push(product);
    } else {
      console.log(`   ❌ Falhou ao excluir`);
      results.failed.push({ product, error: result.error });
    }

    // Small delay to avoid rate limiting
    if (i < productsToDelete.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  }

  return results;
}

// Main execution
const results = await processDeletions();

console.log('\n' + '='.repeat(60));
console.log('📊 RESULTADO FINAL:');
console.log(`  ✅ Excluídos com sucesso: ${results.success.length}`);
console.log(`  ❌ Falharam: ${results.failed.length}`);
console.log('='.repeat(60));

// Save results
const resultsPath = path.join(__dirname, '..', 'DELETE-DUPLICATES-RESULTS.json');
fs.writeFileSync(resultsPath, JSON.stringify({
  timestamp: new Date().toISOString(),
  totalProcessed: productsToDelete.length,
  successCount: results.success.length,
  failedCount: results.failed.length,
  deleted: results.success.map(p => p.title),
  failed: results.failed
}, null, 2));

console.log(`\n✅ Resultados salvos em: DELETE-DUPLICATES-RESULTS.json`);

if (results.failed.length > 0) {
  console.log('\n⚠️ Produtos que falharam:');
  results.failed.forEach(f => {
    console.log(`  - ${f.product.title}`);
  });
}

console.log(`\n🎉 ${results.success.length} produtos duplicados foram removidos da Shopify!`);

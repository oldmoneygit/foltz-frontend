import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

async function testProductSizes() {
  console.log('\n🔍 Testando tamanhos dos produtos...\n');

  const query = `
    query getProduct($handle: String!) {
      product(handle: $handle) {
        id
        title
        handle
        variants(first: 25) {
          edges {
            node {
              id
              title
              availableForSale
            }
          }
        }
        options {
          id
          name
          values
        }
      }
    }
  `;

  const response = await fetch(
    `https://${domain}/api/2024-10/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
      },
      body: JSON.stringify({
        query,
        variables: { handle: 'bayern-07-08-home-size-s-xxl' }
      }),
    }
  );

  const { data } = await response.json();

  if (data.product) {
    console.log(`📦 Produto: ${data.product.title}\n`);

    console.log('📋 Options:');
    data.product.options.forEach(option => {
      console.log(`  - ${option.name}: [${option.values.join(', ')}]`);
    });

    console.log('\n📋 Variants (primeiros 10):');
    data.product.variants.edges.slice(0, 10).forEach(({ node }, index) => {
      console.log(`  ${index + 1}. ${node.title} (Disponível: ${node.availableForSale})`);
    });

    console.log(`\n✅ Total de variantes: ${data.product.variants.edges.length}`);
  } else {
    console.log('❌ Produto não encontrado');
  }
}

testProductSizes();

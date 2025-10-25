import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

async function testProductSlug() {
  console.log('\n🔍 Testando busca de produtos por slug...\n');

  // Primeiro, vamos buscar alguns produtos e seus handles
  const queryAll = `
    query getAllProducts {
      products(first: 5) {
        edges {
          node {
            id
            title
            handle
          }
        }
      }
    }
  `;

  const responseAll = await fetch(
    `https://${domain}/api/2024-10/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
      },
      body: JSON.stringify({ query: queryAll }),
    }
  );

  const { data: dataAll } = await responseAll.json();

  console.log('📋 Primeiros 5 produtos encontrados:\n');
  dataAll.products.edges.forEach(({ node }, index) => {
    console.log(`${index + 1}. ${node.title}`);
    console.log(`   Handle: ${node.handle}`);
    console.log(`   ID: ${node.id}\n`);
  });

  // Agora vamos tentar buscar o primeiro produto pelo handle
  const firstProduct = dataAll.products.edges[0].node;
  const testHandle = firstProduct.handle;

  console.log(`🔍 Testando busca do produto: "${firstProduct.title}"`);
  console.log(`   Handle: ${testHandle}\n`);

  const queryByHandle = `
    query getProduct($handle: String!) {
      product(handle: $handle) {
        id
        title
        handle
        description
        productType
        images(first: 5) {
          edges {
            node {
              url
              altText
            }
          }
        }
      }
    }
  `;

  const responseByHandle = await fetch(
    `https://${domain}/api/2024-10/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
      },
      body: JSON.stringify({
        query: queryByHandle,
        variables: { handle: testHandle }
      }),
    }
  );

  const { data: dataByHandle } = await responseByHandle.json();

  if (dataByHandle.product) {
    console.log('✅ Produto encontrado com sucesso!\n');
    console.log(`   Título: ${dataByHandle.product.title}`);
    console.log(`   Handle: ${dataByHandle.product.handle}`);
    console.log(`   Tipo: ${dataByHandle.product.productType}`);
    console.log(`   Imagens: ${dataByHandle.product.images.edges.length}`);
  } else {
    console.log('❌ Produto NÃO encontrado! Há um problema na busca por slug.');
  }
}

testProductSlug();

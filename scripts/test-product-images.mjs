import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

async function testProductImages() {
  console.log('\n🔍 Testando imagens dos produtos na Shopify...\n');
  console.log(`Domain: ${domain}`);
  console.log(`Token: ${storefrontAccessToken ? '✓ Configurado' : '✗ Não encontrado'}\n`);

  const query = `
    query getProducts {
      products(first: 10) {
        edges {
          node {
            id
            title
            handle
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
      }
    }
  `;

  try {
    const response = await fetch(
      `https://${domain}/api/2024-10/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
        },
        body: JSON.stringify({ query }),
      }
    );

    const { data, errors } = await response.json();

    if (errors) {
      console.error('❌ Erros da API:', errors);
      return;
    }

    if (!data || !data.products) {
      console.error('❌ Nenhum dado retornado');
      return;
    }

    console.log(`✅ Encontrados ${data.products.edges.length} produtos\n`);

    let totalProducts = 0;
    let productsWithImages = 0;
    let productsWithoutImages = 0;

    data.products.edges.forEach(({ node }) => {
      totalProducts++;
      const imageCount = node.images.edges.length;

      if (imageCount > 0) {
        productsWithImages++;
        console.log(`✅ ${node.title}`);
        console.log(`   Handle: ${node.handle}`);
        console.log(`   Imagens: ${imageCount}`);
        node.images.edges.forEach(({ node: img }, idx) => {
          console.log(`   ${idx + 1}. ${img.url}`);
        });
      } else {
        productsWithoutImages++;
        console.log(`❌ ${node.title}`);
        console.log(`   Handle: ${node.handle}`);
        console.log(`   Imagens: 0 (SEM IMAGEM!)`);
      }
      console.log('');
    });

    console.log('\n📊 RESUMO:');
    console.log(`Total de produtos testados: ${totalProducts}`);
    console.log(`Produtos COM imagens: ${productsWithImages}`);
    console.log(`Produtos SEM imagens: ${productsWithoutImages}`);
    console.log('');

    if (productsWithoutImages > 0) {
      console.log('⚠️  PROBLEMA ENCONTRADO:');
      console.log('Alguns produtos não têm imagens na Shopify!');
      console.log('Você precisa fazer upload das imagens para esses produtos.\n');
    }

  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

testProductImages();

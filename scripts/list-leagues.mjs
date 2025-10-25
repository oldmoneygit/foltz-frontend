import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

async function listLeagues() {
  console.log('\n🔍 Listando todas as ligas (productType) da Shopify...\n');

  const query = `
    query getAllProducts {
      products(first: 250) {
        edges {
          node {
            id
            title
            productType
          }
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
      body: JSON.stringify({ query }),
    }
  );

  const { data } = await response.json();

  const leagues = new Set();

  data.products.edges.forEach(({ node }) => {
    if (node.productType) {
      leagues.add(node.productType);
    }
  });

  const sortedLeagues = Array.from(leagues).sort();

  console.log('📋 Ligas encontradas na Shopify:\n');
  sortedLeagues.forEach((league, index) => {
    console.log(`${index + 1}. ${league}`);
  });

  console.log(`\n✅ Total: ${sortedLeagues.length} ligas`);
}

listLeagues();

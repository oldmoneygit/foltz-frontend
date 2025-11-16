import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Shopify credentials from .env.local
const SHOPIFY_STORE_DOMAIN = 'wz7q3b-4h.myshopify.com';
const SHOPIFY_STOREFRONT_TOKEN = 'db05ddf2fb15eec6e0e9e38c2cc2d20d';

// GraphQL query to fetch all products
const getAllProductsQuery = `
  query getAllProducts($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      edges {
        node {
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

async function fetchFoltzProducts() {
  console.log('📡 Buscando produtos do Foltz (Shopify)...');

  const allProducts = [];
  let hasNextPage = true;
  let cursor = null;

  while (hasNextPage) {
    const variables = {
      first: 250,
      after: cursor
    };

    const response = await fetch(`https://${SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN,
      },
      body: JSON.stringify({
        query: getAllProductsQuery,
        variables
      })
    });

    const json = await response.json();

    if (json.errors) {
      console.error('GraphQL errors:', json.errors);
      break;
    }

    const products = json.data.products;
    allProducts.push(...products.edges.map(e => ({
      handle: e.node.handle,
      title: e.node.title,
      tags: e.node.tags
    })));

    hasNextPage = products.pageInfo.hasNextPage;
    if (hasNextPage && products.edges.length > 0) {
      cursor = products.edges[products.edges.length - 1].cursor;
    }
  }

  console.log(`✅ ${allProducts.length} produtos encontrados no Foltz`);
  return allProducts;
}

// Normalize product name for comparison
function normalizeTitle(title) {
  return title
    .toLowerCase()
    .replace(/retro/gi, '')
    .replace(/home/gi, '')
    .replace(/away/gi, '')
    .replace(/third/gi, '')
    .replace(/long sleeve/gi, '')
    .replace(/manga longa/gi, '')
    .replace(/size s-xxl/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Extract key info from title
function extractKey(title) {
  const normalized = title.toLowerCase();

  // Extract team name
  const teamPatterns = [
    'argentina', 'boca juniors', 'river plate', 'racing', 'independiente', 'san lorenzo',
    'brasil', 'brazil', 'flamengo', 'palmeiras', 'corinthians', 'santos',
    'real madrid', 'barcelona', 'manchester united', 'manchester city', 'liverpool',
    'chelsea', 'arsenal', 'tottenham', 'bayern', 'juventus', 'ac milan', 'inter',
    'psg', 'napoli', 'alemania', 'germany', 'francia', 'france', 'españa', 'spain',
    'italia', 'italy', 'portugal', 'holanda', 'netherlands', 'inglaterra', 'england'
  ];

  let team = null;
  for (const t of teamPatterns) {
    if (normalized.includes(t)) {
      team = t;
      break;
    }
  }

  // Extract year/season
  const yearMatch = normalized.match(/(\d{2})[-/](\d{2})|(\d{4})/);
  const year = yearMatch ? yearMatch[0] : null;

  // Is long sleeve?
  const isLongSleeve = normalized.includes('long sleeve') || normalized.includes('manga longa');

  // Type
  let type = 'home';
  if (normalized.includes('away')) type = 'away';
  else if (normalized.includes('third')) type = 'third';
  else if (normalized.includes('training')) type = 'training';

  return `${team}|${year}|${type}|${isLongSleeve}`;
}

async function main() {
  console.log('=== Comparação Foltz vs Retrobox ===\n');

  // 1. Fetch Foltz products
  const foltzProducts = await fetchFoltzProducts();

  // 2. Load Retrobox products
  const retroboxData = JSON.parse(fs.readFileSync(
    path.join(__dirname, '..', 'retrobox-all-products.json'),
    'utf-8'
  ));

  console.log(`\n📦 Retrobox: ${retroboxData.total} produtos`);
  console.log(`📦 Foltz: ${foltzProducts.length} produtos`);

  // 3. Create sets for comparison
  const foltzKeys = new Set(foltzProducts.map(p => extractKey(p.title)));
  const foltzTitlesNorm = new Set(foltzProducts.map(p => normalizeTitle(p.title)));

  console.log('\n🔍 Comparando produtos...\n');

  // 4. Identify duplicates and unique products
  const duplicates = [];
  const unique = [];
  const possibleDuplicates = [];

  retroboxData.allProducts.forEach(product => {
    const key = extractKey(product.title);
    const normTitle = normalizeTitle(product.title);

    if (foltzKeys.has(key)) {
      duplicates.push(product);
    } else if (foltzTitlesNorm.has(normTitle)) {
      possibleDuplicates.push(product);
    } else {
      unique.push(product);
    }
  });

  console.log('📊 Resultado da Comparação:');
  console.log(`  ✅ Produtos ÚNICOS (não existem no Foltz): ${unique.length}`);
  console.log(`  ⚠️ Possíveis duplicatas (similar): ${possibleDuplicates.length}`);
  console.log(`  ❌ Duplicatas confirmadas: ${duplicates.length}`);

  // 5. Categorize unique products
  const uniqueCategories = {
    mysteryBox: [],
    argentina: [],
    brazil: [],
    europe: [],
    national: [],
    other: []
  };

  unique.forEach(p => {
    const titleLower = p.title.toLowerCase();
    if (titleLower.includes('mystery box')) {
      uniqueCategories.mysteryBox.push(p);
    } else if (titleLower.includes('argentina') || titleLower.includes('boca') || titleLower.includes('river') ||
               titleLower.includes('racing') || titleLower.includes('independiente') || titleLower.includes('san lorenzo')) {
      uniqueCategories.argentina.push(p);
    } else if (titleLower.includes('brasil') || titleLower.includes('brazil') || titleLower.includes('flamengo') ||
               titleLower.includes('palmeiras') || titleLower.includes('corinthians') || titleLower.includes('santos')) {
      uniqueCategories.brazil.push(p);
    } else if (titleLower.includes('alemania') || titleLower.includes('francia') || titleLower.includes('españa') ||
               titleLower.includes('holanda') || titleLower.includes('italia') || titleLower.includes('portugal') ||
               titleLower.includes('inglaterra') || titleLower.includes('dinamarca') || titleLower.includes('japon')) {
      uniqueCategories.national.push(p);
    } else if (titleLower.includes('real madrid') || titleLower.includes('barcelona') || titleLower.includes('manchester') ||
               titleLower.includes('liverpool') || titleLower.includes('chelsea') || titleLower.includes('arsenal') ||
               titleLower.includes('bayern') || titleLower.includes('juventus') || titleLower.includes('milan') ||
               titleLower.includes('psg') || titleLower.includes('inter') || titleLower.includes('roma') ||
               titleLower.includes('napoli') || titleLower.includes('atlético') || titleLower.includes('atletico')) {
      uniqueCategories.europe.push(p);
    } else {
      uniqueCategories.other.push(p);
    }
  });

  console.log('\n=== PRODUTOS ÚNICOS PARA IMPORTAR ===\n');

  console.log(`📦 Mystery Boxes (${uniqueCategories.mysteryBox.length}):`);
  uniqueCategories.mysteryBox.forEach(p => console.log(`  ✓ ${p.title}`));

  console.log(`\n🇦🇷 Argentina (${uniqueCategories.argentina.length}):`);
  uniqueCategories.argentina.slice(0, 20).forEach(p => console.log(`  ✓ ${p.title}`));
  if (uniqueCategories.argentina.length > 20) console.log(`  ... e mais ${uniqueCategories.argentina.length - 20}`);

  console.log(`\n🇧🇷 Brasil (${uniqueCategories.brazil.length}):`);
  uniqueCategories.brazil.slice(0, 20).forEach(p => console.log(`  ✓ ${p.title}`));
  if (uniqueCategories.brazil.length > 20) console.log(`  ... e mais ${uniqueCategories.brazil.length - 20}`);

  console.log(`\n🌍 Seleções Nacionais (${uniqueCategories.national.length}):`);
  uniqueCategories.national.slice(0, 20).forEach(p => console.log(`  ✓ ${p.title}`));
  if (uniqueCategories.national.length > 20) console.log(`  ... e mais ${uniqueCategories.national.length - 20}`);

  console.log(`\n⚽ Europa - Clubes (${uniqueCategories.europe.length}):`);
  uniqueCategories.europe.slice(0, 30).forEach(p => console.log(`  ✓ ${p.title}`));
  if (uniqueCategories.europe.length > 30) console.log(`  ... e mais ${uniqueCategories.europe.length - 30}`);

  console.log(`\n❓ Outros (${uniqueCategories.other.length}):`);
  uniqueCategories.other.slice(0, 20).forEach(p => console.log(`  ✓ ${p.title}`));
  if (uniqueCategories.other.length > 20) console.log(`  ... e mais ${uniqueCategories.other.length - 20}`);

  // 6. Save results
  const resultsPath = path.join(__dirname, '..', 'retrobox-unique-products.json');
  fs.writeFileSync(resultsPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    summary: {
      totalRetrobox: retroboxData.total,
      totalFoltz: foltzProducts.length,
      uniqueProducts: unique.length,
      possibleDuplicates: possibleDuplicates.length,
      confirmedDuplicates: duplicates.length
    },
    uniqueProducts: unique,
    uniqueByCategory: uniqueCategories,
    possibleDuplicates: possibleDuplicates,
    duplicates: duplicates
  }, null, 2));

  console.log(`\n✅ Resultados salvos em: retrobox-unique-products.json`);
  console.log(`\n🎯 TOTAL DE PRODUTOS ÚNICOS PARA IMPORTAR: ${unique.length}`);
}

main().catch(console.error);

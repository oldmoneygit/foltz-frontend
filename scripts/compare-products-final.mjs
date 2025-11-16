import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env.local
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const SHOPIFY_STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const SHOPIFY_STOREFRONT_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

console.log('Using Shopify domain:', SHOPIFY_STORE_DOMAIN);
console.log('Token (first 10 chars):', SHOPIFY_STOREFRONT_TOKEN?.substring(0, 10) + '...');

// GraphQL query
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
  console.log('\n📡 Buscando produtos do Foltz...');

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

// Extract key for comparison
function extractKey(title) {
  const normalized = title.toLowerCase()
    .replace(/retro/g, '')
    .replace(/size s-xxl/g, '')
    .replace(/size s-4xl/g, '')
    .trim();

  // Extract year/season pattern
  const yearMatch = normalized.match(/(\d{2})[-\/](\d{2})|(\d{4})/);
  const year = yearMatch ? yearMatch[0].replace('/', '-') : '';

  // Extract type
  let type = 'home';
  if (normalized.includes('away')) type = 'away';
  else if (normalized.includes('third')) type = 'third';

  // Is long sleeve?
  const isLong = normalized.includes('long sleeve') || normalized.includes('manga longa') ? 'long' : 'short';

  // Get base name (first part)
  const parts = normalized.split(/\s+/);
  const team = parts.slice(0, Math.min(3, parts.length)).join(' ')
    .replace(/\d+/g, '')
    .replace(/[-\/]/g, '')
    .trim();

  return `${team}|${year}|${type}|${isLong}`;
}

async function main() {
  console.log('=== Comparação Foltz vs Retrobox ===');

  // 1. Fetch Foltz products
  const foltzProducts = await fetchFoltzProducts();

  // 2. Load Retrobox products
  const retroboxData = JSON.parse(fs.readFileSync(
    path.join(__dirname, '..', 'retrobox-all-products.json'),
    'utf-8'
  ));

  console.log(`\n📦 Retrobox: ${retroboxData.total} produtos`);
  console.log(`📦 Foltz: ${foltzProducts.length} produtos`);

  // 3. Create comparison maps
  const foltzKeys = new Set();
  const foltzTitlesNorm = new Map();

  foltzProducts.forEach(p => {
    const key = extractKey(p.title);
    foltzKeys.add(key);

    const normTitle = p.title.toLowerCase()
      .replace(/retro/gi, '')
      .replace(/size s-xxl/gi, '')
      .replace(/\s+/g, ' ')
      .trim();
    foltzTitlesNorm.set(normTitle, p);
  });

  console.log('\n🔍 Analisando...\n');

  // 4. Compare
  const duplicates = [];
  const unique = [];
  const similarMatches = [];

  retroboxData.allProducts.forEach(rp => {
    const rpKey = extractKey(rp.title);
    const rpNorm = rp.title.toLowerCase()
      .replace(/retro/gi, '')
      .replace(/\s+/g, ' ')
      .trim();

    // Check if key matches
    if (foltzKeys.has(rpKey)) {
      duplicates.push(rp);
    } else if (foltzTitlesNorm.has(rpNorm)) {
      similarMatches.push({ retrobox: rp, foltz: foltzTitlesNorm.get(rpNorm) });
    } else {
      unique.push(rp);
    }
  });

  console.log('📊 RESULTADO:');
  console.log(`  ✅ Únicos para importar: ${unique.length}`);
  console.log(`  ⚠️ Similares (verificar): ${similarMatches.length}`);
  console.log(`  ❌ Duplicatas: ${duplicates.length}`);

  // 5. Show samples of each category
  if (duplicates.length > 0) {
    console.log('\n❌ DUPLICATAS (já existem no Foltz):');
    duplicates.slice(0, 10).forEach(d => console.log(`  - ${d.title}`));
    if (duplicates.length > 10) console.log(`  ... e mais ${duplicates.length - 10}`);
  }

  if (similarMatches.length > 0) {
    console.log('\n⚠️ SIMILARES (verificar manualmente):');
    similarMatches.slice(0, 10).forEach(s => {
      console.log(`  - Retrobox: ${s.retrobox.title}`);
      console.log(`    Foltz: ${s.foltz.title}`);
    });
  }

  // 6. Categorize unique products
  const uniqueCats = {
    mysteryBox: unique.filter(p => p.title.toLowerCase().includes('mystery box')),
    argentina: unique.filter(p => {
      const t = p.title.toLowerCase();
      return t.includes('argentina') || t.includes('boca') || t.includes('river') ||
             t.includes('racing') || t.includes('independiente') || t.includes('san lorenzo');
    }),
    brasil: unique.filter(p => {
      const t = p.title.toLowerCase();
      return t.includes('brasil') || t.includes('brazil') || t.includes('flamengo') ||
             t.includes('palmeiras') || t.includes('corinthians') || t.includes('santos');
    }),
    europa: unique.filter(p => {
      const t = p.title.toLowerCase();
      return t.includes('real madrid') || t.includes('barcelona') || t.includes('manchester') ||
             t.includes('liverpool') || t.includes('chelsea') || t.includes('arsenal') ||
             t.includes('bayern') || t.includes('juventus') || t.includes('milan') ||
             t.includes('inter') || t.includes('psg') || t.includes('roma') || t.includes('napoli') ||
             t.includes('atletico') || t.includes('atlético');
    })
  };

  uniqueCats.other = unique.filter(p =>
    !uniqueCats.mysteryBox.includes(p) &&
    !uniqueCats.argentina.includes(p) &&
    !uniqueCats.brasil.includes(p) &&
    !uniqueCats.europa.includes(p)
  );

  console.log('\n=== PRODUTOS ÚNICOS PARA IMPORTAR ===');
  console.log(`\n📦 Mystery Boxes: ${uniqueCats.mysteryBox.length}`);
  uniqueCats.mysteryBox.forEach(p => console.log(`  ✓ ${p.title}`));

  console.log(`\n🇦🇷 Argentina: ${uniqueCats.argentina.length}`);
  uniqueCats.argentina.slice(0, 15).forEach(p => console.log(`  ✓ ${p.title}`));
  if (uniqueCats.argentina.length > 15) console.log(`  ... e mais ${uniqueCats.argentina.length - 15}`);

  console.log(`\n🇧🇷 Brasil: ${uniqueCats.brasil.length}`);
  uniqueCats.brasil.slice(0, 15).forEach(p => console.log(`  ✓ ${p.title}`));
  if (uniqueCats.brasil.length > 15) console.log(`  ... e mais ${uniqueCats.brasil.length - 15}`);

  console.log(`\n⚽ Europa: ${uniqueCats.europa.length}`);
  uniqueCats.europa.slice(0, 20).forEach(p => console.log(`  ✓ ${p.title}`));
  if (uniqueCats.europa.length > 20) console.log(`  ... e mais ${uniqueCats.europa.length - 20}`);

  console.log(`\n🌍 Outros: ${uniqueCats.other.length}`);
  uniqueCats.other.slice(0, 20).forEach(p => console.log(`  ✓ ${p.title}`));
  if (uniqueCats.other.length > 20) console.log(`  ... e mais ${uniqueCats.other.length - 20}`);

  // 7. Save final report
  const reportPath = path.join(__dirname, '..', 'RETROBOX-IMPORT-REPORT.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    summary: {
      totalRetrobox: retroboxData.total,
      totalFoltz: foltzProducts.length,
      toImport: unique.length,
      similarToVerify: similarMatches.length,
      duplicates: duplicates.length
    },
    toImport: {
      mysteryBoxes: uniqueCats.mysteryBox.map(p => p.title),
      argentina: uniqueCats.argentina.map(p => p.title),
      brasil: uniqueCats.brasil.map(p => p.title),
      europa: uniqueCats.europa.map(p => p.title),
      other: uniqueCats.other.map(p => p.title)
    },
    similarToVerify: similarMatches,
    duplicates: duplicates.map(p => p.title)
  }, null, 2));

  console.log(`\n✅ Relatório salvo em: RETROBOX-IMPORT-REPORT.json`);
  console.log(`\n🎯 TOTAL PARA IMPORTAR: ${unique.length} produtos únicos`);
}

main().catch(console.error);

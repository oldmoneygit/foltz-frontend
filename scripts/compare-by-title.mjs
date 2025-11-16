import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const SHOPIFY_STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const SHOPIFY_STOREFRONT_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

const getAllProductsQuery = `
  query getAllProducts($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      edges {
        node {
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

async function fetchFoltzProducts() {
  console.log('📡 Buscando produtos do Foltz...');
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
    if (json.errors) break;

    const products = json.data.products;
    allProducts.push(...products.edges.map(e => ({
      handle: e.node.handle,
      title: e.node.title
    })));

    hasNextPage = products.pageInfo.hasNextPage;
    if (hasNextPage && products.edges.length > 0) {
      cursor = products.edges[products.edges.length - 1].cursor;
    }
  }

  console.log(`✅ ${allProducts.length} produtos no Foltz\n`);
  return allProducts;
}

// Normaliza título para comparação
function normalizeTitle(title) {
  return title
    .toLowerCase()
    .replace(/size\s*s\s*-?\s*xxl/gi, '')
    .replace(/size\s*s\s*-?\s*4xl/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Gera variações do título para matching
function getTitleVariations(title) {
  const base = normalizeTitle(title);
  const variations = [base];

  // Sem "Retro"
  variations.push(base.replace(/\bretro\b/gi, '').trim());

  // Converter formatos de ano
  // "06/07" -> "2006-07" ou "2006/07"
  const withYear = base.replace(/(\d{2})\/(\d{2})/g, (match, y1, y2) => {
    const fullYear = parseInt(y1) > 50 ? `19${y1}` : `20${y1}`;
    return `${fullYear}-${y2}`;
  });
  variations.push(withYear);

  // Normaliza espaços
  variations.push(base.replace(/\s+/g, ''));

  return variations;
}

async function main() {
  console.log('=== Análise por TÍTULO (mais precisa) ===\n');

  const foltzProducts = await fetchFoltzProducts();
  const retroboxData = JSON.parse(fs.readFileSync(
    path.join(__dirname, '..', 'retrobox-all-products.json'),
    'utf-8'
  ));

  console.log(`📦 Retrobox: ${retroboxData.total} produtos`);
  console.log(`📦 Foltz: ${foltzProducts.length} produtos\n`);

  // Criar mapa de títulos normalizados do Foltz
  const foltzTitlesMap = new Map();
  foltzProducts.forEach(p => {
    const normTitle = normalizeTitle(p.title);
    foltzTitlesMap.set(normTitle, p);

    // Adicionar variações
    getTitleVariations(p.title).forEach(v => {
      if (!foltzTitlesMap.has(v)) {
        foltzTitlesMap.set(v, p);
      }
    });
  });

  // Comparar
  const duplicates = [];
  const unique = [];
  const similar = [];

  retroboxData.allProducts.forEach(rp => {
    const rpNorm = normalizeTitle(rp.title);
    const rpVariations = getTitleVariations(rp.title);

    let foundMatch = null;

    // Buscar match exato ou por variação
    for (const variation of rpVariations) {
      if (foltzTitlesMap.has(variation)) {
        foundMatch = foltzTitlesMap.get(variation);
        break;
      }
    }

    if (foundMatch) {
      duplicates.push({
        retrobox: rp.title,
        foltz: foundMatch.title,
        matchType: rpNorm === normalizeTitle(foundMatch.title) ? 'exact' : 'variation'
      });
    } else {
      // Verificar similaridade parcial
      let mostSimilar = null;
      let highestScore = 0;

      for (const [foltzNorm, foltzProd] of foltzTitlesMap) {
        const score = calculateSimilarity(rpNorm, foltzNorm);
        if (score > highestScore && score > 0.8) {
          highestScore = score;
          mostSimilar = { foltz: foltzProd, score };
        }
      }

      if (mostSimilar) {
        similar.push({
          retrobox: rp.title,
          foltz: mostSimilar.foltz.title,
          similarity: (mostSimilar.score * 100).toFixed(1) + '%'
        });
      } else {
        unique.push(rp);
      }
    }
  });

  console.log('📊 RESULTADO DA ANÁLISE:\n');
  console.log(`  ❌ DUPLICATAS (mesmo produto): ${duplicates.length}`);
  console.log(`  ⚠️ SIMILARES (verificar): ${similar.length}`);
  console.log(`  ✅ ÚNICOS (importar): ${unique.length}`);

  // Mostrar duplicatas
  console.log('\n' + '='.repeat(60));
  console.log('❌ DUPLICATAS ENCONTRADAS (já existem no Foltz):');
  console.log('='.repeat(60));

  duplicates.forEach((d, i) => {
    console.log(`\n${i + 1}. RETROBOX: ${d.retrobox}`);
    console.log(`   FOLTZ:    ${d.foltz}`);
    console.log(`   Match: ${d.matchType}`);
  });

  // Mostrar similares
  if (similar.length > 0) {
    console.log('\n' + '='.repeat(60));
    console.log('⚠️ SIMILARES (verificar manualmente):');
    console.log('='.repeat(60));

    similar.forEach((s, i) => {
      console.log(`\n${i + 1}. RETROBOX: ${s.retrobox}`);
      console.log(`   FOLTZ:    ${s.foltz}`);
      console.log(`   Similaridade: ${s.similarity}`);
    });
  }

  // Mostrar únicos
  console.log('\n' + '='.repeat(60));
  console.log(`✅ PRODUTOS ÚNICOS PARA IMPORTAR (${unique.length}):`);
  console.log('='.repeat(60));

  unique.forEach((u, i) => {
    console.log(`${i + 1}. ${u.title}`);
  });

  // Salvar relatório
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalRetrobox: retroboxData.total,
      totalFoltz: foltzProducts.length,
      duplicates: duplicates.length,
      similar: similar.length,
      unique: unique.length
    },
    duplicates,
    similar,
    unique: unique.map(u => u.title)
  };

  fs.writeFileSync(
    path.join(__dirname, '..', 'COMPARISON-BY-TITLE.json'),
    JSON.stringify(report, null, 2)
  );

  console.log('\n✅ Relatório salvo em: COMPARISON-BY-TITLE.json');
}

// Calcula similaridade entre duas strings (0-1)
function calculateSimilarity(str1, str2) {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;

  if (longer.length === 0) return 1.0;

  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

function levenshteinDistance(str1, str2) {
  const matrix = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}

main().catch(console.error);

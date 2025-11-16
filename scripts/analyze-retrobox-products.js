const fs = require('fs');
const path = require('path');

// Parse CSV file
function parseCSV(content) {
  const lines = content.split('\n');
  const headers = parseCSVLine(lines[0]);
  const products = {};

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;

    const values = parseCSVLine(lines[i]);
    const row = {};
    headers.forEach((header, idx) => {
      row[header] = values[idx] || '';
    });

    const handle = row['Handle'];
    if (!handle) continue;

    // Group by handle (product)
    if (!products[handle]) {
      products[handle] = {
        handle: handle,
        title: row['Title'],
        type: row['Type'],
        tags: row['Tags'],
        vendor: row['Vendor'],
        price: row['Variant Price'],
        image: row['Image Src'],
        variants: []
      };
    }

    // Add variant if it has size info
    if (row['Option1 Value']) {
      products[handle].variants.push(row['Option1 Value']);
    }
  }

  return Object.values(products);
}

// Parse single CSV line (handles quoted fields with commas)
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

// Normalize product name for comparison
function normalizeProductName(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    // Remove common suffixes
    .replace(/\s*size\s*s?\s*-?\s*xxl.*$/i, '')
    .replace(/\s*tamanho\s*s?\s*-?\s*xxl.*$/i, '')
    .replace(/\s*\d{2}\s*-?\s*\d{2}\s*$/, '') // Remove year patterns at end
    .trim();
}

// Extract key info from product name
function extractProductInfo(name) {
  const normalized = name.toLowerCase();

  // Extract team
  const teams = [
    'argentina', 'brazil', 'brasil', 'boca juniors', 'boca', 'river plate', 'river',
    'real madrid', 'barcelona', 'manchester united', 'manchester city', 'liverpool',
    'chelsea', 'arsenal', 'tottenham', 'bayern', 'borussia dortmund', 'juventus',
    'milan', 'inter', 'psg', 'napoli', 'atletico madrid', 'sevilla', 'valencia',
    'racing', 'independiente', 'san lorenzo', 'rosario central', 'newells'
  ];

  let team = null;
  for (const t of teams) {
    if (normalized.includes(t)) {
      team = t;
      break;
    }
  }

  // Extract year/season
  const yearMatch = normalized.match(/(\d{2})\s*[-\/]\s*(\d{2})/);
  const year = yearMatch ? `${yearMatch[1]}-${yearMatch[2]}` : null;

  // Extract type (home/away/third)
  let type = 'unknown';
  if (normalized.includes('home')) type = 'home';
  else if (normalized.includes('away')) type = 'away';
  else if (normalized.includes('third')) type = 'third';
  else if (normalized.includes('training')) type = 'training';
  else if (normalized.includes('goalkeeper') || normalized.includes('gk')) type = 'goalkeeper';

  // Is long sleeve?
  const isLongSleeve = normalized.includes('manga longa') ||
                       normalized.includes('long sleeve') ||
                       normalized.includes('ml');

  return { team, year, type, isLongSleeve };
}

async function main() {
  console.log('=== Análise de Produtos Retrobox vs Foltz ===\n');

  // 1. Read Retrobox CSV
  const csvPath = 'C:\\Users\\PC\\Documents\\Retrobox\\produtos\\retrobox_camisas_shopify.csv';
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const retroboxProducts = parseCSV(csvContent);

  console.log(`📦 Retrobox: ${retroboxProducts.length} produtos encontrados\n`);

  // 2. Categorize Retrobox products
  const categories = {
    mysteryBox: [],
    jerseys: [],
    other: []
  };

  retroboxProducts.forEach(product => {
    const title = product.title.toLowerCase();
    if (title.includes('mystery box')) {
      categories.mysteryBox.push(product);
    } else if (product.type === 'Jersey' || title.includes('jersey') || title.includes('camiseta')) {
      categories.jerseys.push(product);
    } else {
      categories.other.push(product);
    }
  });

  console.log('📊 Categorização Retrobox:');
  console.log(`  - Mystery Boxes: ${categories.mysteryBox.length}`);
  console.log(`  - Jerseys: ${categories.jerseys.length}`);
  console.log(`  - Outros: ${categories.other.length}`);
  console.log('');

  // 3. List unique teams in Retrobox
  const retroboxTeams = new Set();
  categories.jerseys.forEach(product => {
    const info = extractProductInfo(product.title);
    if (info.team) retroboxTeams.add(info.team);
  });

  console.log('⚽ Times no Retrobox:', Array.from(retroboxTeams).sort().join(', '));
  console.log('');

  // 4. Save analysis
  const analysisFile = path.join(__dirname, '..', 'retrobox-products-analysis.json');
  const analysis = {
    timestamp: new Date().toISOString(),
    totalProducts: retroboxProducts.length,
    categories: {
      mysteryBoxes: categories.mysteryBox.map(p => ({
        handle: p.handle,
        title: p.title,
        price: p.price
      })),
      jerseys: categories.jerseys.map(p => ({
        handle: p.handle,
        title: p.title,
        price: p.price,
        info: extractProductInfo(p.title)
      }))
    },
    uniqueTeams: Array.from(retroboxTeams).sort()
  };

  fs.writeFileSync(analysisFile, JSON.stringify(analysis, null, 2));
  console.log(`✅ Análise salva em: retrobox-products-analysis.json\n`);

  // 5. Show sample jerseys
  console.log('🔍 Amostra de Jerseys do Retrobox (primeiros 20):');
  categories.jerseys.slice(0, 20).forEach((p, i) => {
    console.log(`  ${i + 1}. ${p.title} (ARS ${p.price})`);
  });

  if (categories.jerseys.length > 20) {
    console.log(`  ... e mais ${categories.jerseys.length - 20} jerseys`);
  }

  console.log('\n--- FIM DA ANÁLISE ---');
}

main().catch(console.error);

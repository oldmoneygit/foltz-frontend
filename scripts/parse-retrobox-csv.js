const fs = require('fs');
const path = require('path');

// Read CSV and extract products based on handles
const csvPath = 'C:\\Users\\PC\\Documents\\Retrobox\\produtos\\retrobox_camisas_shopify.csv';
const content = fs.readFileSync(csvPath, 'utf-8');

// Split by lines, accounting for newlines within quoted fields
const lines = content.split('\n');

const products = new Map();
let currentHandle = null;

lines.forEach((line, lineNum) => {
  if (lineNum === 0) return; // Skip header

  // Extract handle from the beginning of line
  const handleMatch = line.match(/^([a-z0-9-]+),/);

  if (handleMatch) {
    const handle = handleMatch[1];

    // Check if this line has actual product data (Title field after first comma)
    const afterHandle = line.substring(handle.length + 1);
    const hasTitle = afterHandle.match(/^([^,]+),/);

    if (hasTitle && hasTitle[1] && hasTitle[1].trim() && !hasTitle[1].trim().startsWith(',')) {
      // This is a main product line with title
      let title = hasTitle[1].trim();

      // Remove quotes if present
      if (title.startsWith('"') && title.endsWith('"')) {
        title = title.slice(1, -1);
      }

      // Skip if title is empty or just quotes
      if (title && title !== '""' && title.length > 2) {
        if (!products.has(handle)) {
          products.set(handle, {
            handle,
            title,
            lineNumber: lineNum
          });
        }
      }
    }
  }
});

console.log(`Total produtos únicos: ${products.size}\n`);

// List all products
const productList = Array.from(products.values()).sort((a, b) => a.title.localeCompare(b.title));

console.log('=== LISTA DE PRODUTOS RETROBOX ===\n');

// Categorize
const categories = {
  mysteryBox: [],
  argentina: [],
  brazil: [],
  europe: [],
  other: []
};

productList.forEach(p => {
  const titleLower = p.title.toLowerCase();
  const handleLower = p.handle.toLowerCase();

  if (titleLower.includes('mystery box') || handleLower.includes('mystery-box')) {
    categories.mysteryBox.push(p);
  } else if (titleLower.includes('argentina') || titleLower.includes('boca') || titleLower.includes('river') ||
             titleLower.includes('racing') || titleLower.includes('independiente') || titleLower.includes('san lorenzo')) {
    categories.argentina.push(p);
  } else if (titleLower.includes('brazil') || titleLower.includes('brasil') || titleLower.includes('flamengo') ||
             titleLower.includes('palmeiras') || titleLower.includes('corinthians') || titleLower.includes('santos')) {
    categories.brazil.push(p);
  } else if (titleLower.includes('real madrid') || titleLower.includes('barcelona') || titleLower.includes('manchester') ||
             titleLower.includes('liverpool') || titleLower.includes('chelsea') || titleLower.includes('arsenal') ||
             titleLower.includes('bayern') || titleLower.includes('juventus') || titleLower.includes('milan') ||
             titleLower.includes('psg') || titleLower.includes('inter')) {
    categories.europe.push(p);
  } else {
    categories.other.push(p);
  }
});

console.log(`📦 Mystery Boxes: ${categories.mysteryBox.length}`);
categories.mysteryBox.forEach(p => console.log(`  - ${p.title}`));

console.log(`\n🇦🇷 Argentina/Primera División: ${categories.argentina.length}`);
categories.argentina.slice(0, 30).forEach(p => console.log(`  - ${p.title}`));
if (categories.argentina.length > 30) console.log(`  ... e mais ${categories.argentina.length - 30}`);

console.log(`\n🇧🇷 Brasil: ${categories.brazil.length}`);
categories.brazil.slice(0, 20).forEach(p => console.log(`  - ${p.title}`));
if (categories.brazil.length > 20) console.log(`  ... e mais ${categories.brazil.length - 20}`);

console.log(`\n⚽ Europa: ${categories.europe.length}`);
categories.europe.slice(0, 20).forEach(p => console.log(`  - ${p.title}`));
if (categories.europe.length > 20) console.log(`  ... e mais ${categories.europe.length - 20}`);

console.log(`\n❓ Outros: ${categories.other.length}`);
categories.other.slice(0, 30).forEach(p => console.log(`  - ${p.title}`));
if (categories.other.length > 30) console.log(`  ... e mais ${categories.other.length - 30}`);

// Save full list to JSON
const outputPath = path.join(__dirname, '..', 'retrobox-all-products.json');
fs.writeFileSync(outputPath, JSON.stringify({
  total: products.size,
  categories: {
    mysteryBox: categories.mysteryBox.map(p => p.title),
    argentina: categories.argentina.map(p => p.title),
    brazil: categories.brazil.map(p => p.title),
    europe: categories.europe.map(p => p.title),
    other: categories.other.map(p => p.title)
  },
  allProducts: productList.map(p => ({ handle: p.handle, title: p.title }))
}, null, 2));

console.log(`\n✅ Lista completa salva em: retrobox-all-products.json`);

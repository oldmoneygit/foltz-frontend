import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load comparison data
const comparisonData = JSON.parse(fs.readFileSync(
  path.join(__dirname, '..', 'COMPARISON-BY-TITLE.json'),
  'utf-8'
));

console.log('=== RELATÓRIO FINAL - Produtos para Importar ===\n');

// Total duplicates = exact + similar
const totalDuplicates = comparisonData.duplicates.length + comparisonData.similar.length;
const uniqueProducts = comparisonData.unique;

console.log(`📊 RESUMO:`);
console.log(`  - Total Retrobox: ${comparisonData.summary.totalRetrobox}`);
console.log(`  - Total Foltz: ${comparisonData.summary.totalFoltz}`);
console.log(`  - Duplicatas (exatas + similares): ${totalDuplicates}`);
console.log(`  - ✅ ÚNICOS PARA IMPORTAR: ${uniqueProducts.length}`);

// Categorize unique products
const categories = {
  mysteryBox: [],
  argentina: [],
  brasil: [],
  europa: [],
  selecoesNacionais: [],
  outros: []
};

uniqueProducts.forEach(title => {
  const t = title.toLowerCase();

  if (t.includes('mystery box')) {
    categories.mysteryBox.push(title);
  } else if (t.includes('argentina') || t.includes('boca') || t.includes('river') ||
             t.includes('racing') || t.includes('independiente') || t.includes('san lorenzo') ||
             t.includes('instituto')) {
    categories.argentina.push(title);
  } else if (t.includes('brasil') || t.includes('brazil') || t.includes('flamengo') ||
             t.includes('palmeiras') || t.includes('corinthians') || t.includes('santos') ||
             t.includes('vasco') || t.includes('grêmio') || t.includes('gremio')) {
    categories.brasil.push(title);
  } else if (t.includes('alemania') || t.includes('francia') || t.includes('españa') ||
             t.includes('holanda') || t.includes('italia') || t.includes('portugal') ||
             t.includes('inglaterra') || t.includes('dinamarca') || t.includes('japón') ||
             t.includes('japon') || t.includes('mexico') || t.includes('croacia') ||
             t.includes('colombia') || t.includes('camerún') || t.includes('usa')) {
    categories.selecoesNacionais.push(title);
  } else if (t.includes('real madrid') || t.includes('barcelona') || t.includes('manchester') ||
             t.includes('liverpool') || t.includes('chelsea') || t.includes('arsenal') ||
             t.includes('bayern') || t.includes('juventus') || t.includes('milan') ||
             t.includes('inter') || t.includes('psg') || t.includes('roma') || t.includes('napoli') ||
             t.includes('atletico') || t.includes('atlético') || t.includes('tottenham') ||
             t.includes('borussia') || t.includes('leverkusen') || t.includes('fenerbahçe') ||
             t.includes('ajax') || t.includes('porto')) {
    categories.europa.push(title);
  } else {
    categories.outros.push(title);
  }
});

console.log('\n=== PRODUTOS POR CATEGORIA ===\n');

console.log(`📦 MYSTERY BOXES (${categories.mysteryBox.length}):`);
categories.mysteryBox.forEach(p => console.log(`  - ${p}`));

console.log(`\n🇦🇷 ARGENTINA (${categories.argentina.length}):`);
categories.argentina.forEach((p, i) => console.log(`  ${i+1}. ${p}`));

console.log(`\n🇧🇷 BRASIL (${categories.brasil.length}):`);
categories.brasil.forEach((p, i) => console.log(`  ${i+1}. ${p}`));

console.log(`\n🌍 SELEÇÕES NACIONAIS (${categories.selecoesNacionais.length}):`);
categories.selecoesNacionais.forEach((p, i) => console.log(`  ${i+1}. ${p}`));

console.log(`\n⚽ CLUBES EUROPEUS (${categories.europa.length}):`);
categories.europa.forEach((p, i) => console.log(`  ${i+1}. ${p}`));

console.log(`\n❓ OUTROS (${categories.outros.length}):`);
categories.outros.forEach((p, i) => console.log(`  ${i+1}. ${p}`));

// Save final report
const finalReport = {
  timestamp: new Date().toISOString(),
  summary: {
    totalRetrobox: comparisonData.summary.totalRetrobox,
    totalFoltz: comparisonData.summary.totalFoltz,
    totalDuplicates: totalDuplicates,
    totalUnique: uniqueProducts.length,
    breakdown: {
      mysteryBoxes: categories.mysteryBox.length,
      argentina: categories.argentina.length,
      brasil: categories.brasil.length,
      selecoesNacionais: categories.selecoesNacionais.length,
      clubesEuropeus: categories.europa.length,
      outros: categories.outros.length
    }
  },
  productsToImport: {
    mysteryBoxes: categories.mysteryBox,
    argentina: categories.argentina,
    brasil: categories.brasil,
    selecoesNacionais: categories.selecoesNacionais,
    clubesEuropeus: categories.europa,
    outros: categories.outros
  },
  allUniqueProducts: uniqueProducts,
  duplicatesExcluded: [
    ...comparisonData.duplicates.map(d => d.retrobox),
    ...comparisonData.similar.map(s => s.retrobox)
  ]
};

fs.writeFileSync(
  path.join(__dirname, '..', 'FINAL-IMPORT-LIST.json'),
  JSON.stringify(finalReport, null, 2)
);

console.log('\n' + '='.repeat(60));
console.log(`✅ RELATÓRIO FINAL SALVO: FINAL-IMPORT-LIST.json`);
console.log('='.repeat(60));
console.log(`\n🎯 TOTAL DE PRODUTOS ÚNICOS: ${uniqueProducts.length}`);
console.log(`❌ EXCLUÍDOS (duplicatas): ${totalDuplicates}`);

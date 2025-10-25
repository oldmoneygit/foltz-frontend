const fs = require('fs')
const path = require('path')

// Ler leagues_data.json
const leaguesData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../leagues_data.json'), 'utf-8')
)

let totalImages = 0
let totalProducts = 0
const leagueBreakdown = []

// Contar imagens por liga
for (const leagueId of Object.keys(leaguesData)) {
  const league = leaguesData[leagueId]

  if (!league.products || !Array.isArray(league.products)) continue

  let leagueImages = 0

  for (const product of league.products) {
    const imageCount = product.images ? product.images.length : 0
    leagueImages += imageCount
    totalImages += imageCount
  }

  totalProducts += league.products.length

  leagueBreakdown.push({
    name: league.name,
    products: league.products.length,
    images: leagueImages,
    avgPerProduct: (leagueImages / league.products.length).toFixed(1)
  })
}

// Mostrar resultados
console.log('\n📊 CONTAGEM TOTAL DE IMAGENS\n')
console.log('═'.repeat(60))

leagueBreakdown.forEach(league => {
  console.log(`\n📁 ${league.name}`)
  console.log(`   Produtos: ${league.products}`)
  console.log(`   Imagens: ${league.images}`)
  console.log(`   Média por produto: ${league.avgPerProduct}`)
})

console.log('\n' + '═'.repeat(60))
console.log('\n🎯 TOTAIS GERAIS:')
console.log(`   📦 Total de produtos: ${totalProducts}`)
console.log(`   📸 Total de imagens: ${totalImages}`)
console.log(`   📊 Média por produto: ${(totalImages / totalProducts).toFixed(1)}`)
console.log('\n' + '═'.repeat(60))

console.log('\n⏱️  ESTIMATIVAS DE TEMPO:')
console.log(`   Upload (500ms por imagem): ${Math.ceil(totalImages * 0.5 / 60)} minutos`)
console.log(`   Com margem de segurança: ${Math.ceil(totalImages * 0.5 / 60 * 1.5)} minutos (~${Math.ceil(totalImages * 0.5 / 60 / 60 * 1.5)} horas)`)
console.log('\n')

import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log('🔍 DIAGNÓSTICO DE CONEXÃO SHOPIFY\n')

// Carregar .env.local
const envPath = path.join(__dirname, '..', '.env.local')
console.log('📁 Procurando arquivo: .env.local')
console.log(`   Caminho: ${envPath}`)

if (!fs.existsSync(envPath)) {
  console.log('   ❌ Arquivo .env.local NÃO EXISTE!')
  console.log('\n💡 Solução:')
  console.log('   1. Crie o arquivo .env.local na raiz do projeto')
  console.log('   2. Adicione as seguintes variáveis:\n')
  console.log('   NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=sua-loja.myshopify.com')
  console.log('   NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=seu-storefront-token')
  console.log('   SHOPIFY_ADMIN_ACCESS_TOKEN=seu-admin-token')
  process.exit(1)
}

console.log('   ✅ Arquivo encontrado!\n')

// Carregar variáveis
dotenv.config({ path: envPath })

console.log('🔐 Verificando variáveis de ambiente:\n')

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
const storefrontToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN
const adminToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN

console.log('1. NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN:')
if (!domain) {
  console.log('   ❌ NÃO configurado!')
} else {
  console.log(`   ✅ ${domain}`)
}

console.log('\n2. NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN:')
if (!storefrontToken) {
  console.log('   ❌ NÃO configurado!')
} else {
  console.log(`   ✅ ${storefrontToken.substring(0, 20)}...`)
}

console.log('\n3. SHOPIFY_ADMIN_ACCESS_TOKEN:')
if (!adminToken) {
  console.log('   ❌ NÃO configurado!')
} else {
  console.log(`   ✅ ${adminToken.substring(0, 20)}...`)
}

if (!domain || !adminToken) {
  console.log('\n❌ Variáveis essenciais faltando!')
  console.log('\n💡 O que você precisa fazer:')
  console.log('   1. Abra o arquivo .env.local')
  console.log('   2. Adicione as variáveis que estão faltando')
  console.log('   3. Rode este script novamente para verificar')
  process.exit(1)
}

console.log('\n✅ Todas as variáveis configuradas!\n')

// Testar conexão
console.log('🌐 Testando conexão com Shopify Admin API...\n')

const shopifyDomain = domain
const apiUrl = `https://${shopifyDomain}/admin/api/2024-01/graphql.json`

console.log(`   URL: ${apiUrl}`)

const query = `
  {
    shop {
      name
      email
      currencyCode
    }
  }
`

try {
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': adminToken,
    },
    body: JSON.stringify({ query }),
  })

  console.log(`   Status: ${response.status} ${response.statusText}`)

  if (!response.ok) {
    const text = await response.text()
    console.log('\n❌ Erro na requisição!')
    console.log(`   Resposta: ${text}\n`)

    if (response.status === 401) {
      console.log('💡 Token inválido ou sem permissões!')
      console.log('   Verifique:')
      console.log('   - Token está correto?')
      console.log('   - Token tem permissão "read_products" e "write_products"?')
      console.log('   - App está instalado na Shopify?')
    }

    if (response.status === 404) {
      console.log('💡 Loja não encontrada!')
      console.log('   Verifique:')
      console.log('   - Domínio está correto?')
      console.log('   - Exemplo: minhaloja.myshopify.com')
    }

    process.exit(1)
  }

  const data = await response.json()

  if (data.errors) {
    console.log('\n❌ Erros da API:')
    console.log(JSON.stringify(data.errors, null, 2))
    process.exit(1)
  }

  console.log('\n✅ CONEXÃO ESTABELECIDA COM SUCESSO!\n')
  console.log('📊 Informações da loja:')
  console.log(`   Nome: ${data.data.shop.name}`)
  console.log(`   Email: ${data.data.shop.email}`)
  console.log(`   Moeda: ${data.data.shop.currencyCode}`)

  console.log('\n🎉 Tudo configurado corretamente!')
  console.log('   Agora você pode rodar: npm run upload-images-test')

} catch (error) {
  console.log('\n❌ Erro de rede:')
  console.log(`   ${error.message}\n`)

  console.log('💡 Possíveis causas:')
  console.log('   - Sem conexão com internet')
  console.log('   - Firewall bloqueando')
  console.log('   - Domínio da Shopify incorreto')

  process.exit(1)
}

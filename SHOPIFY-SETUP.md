# 🛍️ Guia de Configuração da Shopify

Este guia explica como migrar os produtos para a Shopify e conectar a API.

## 📋 Passo 1: Gerar CSV dos Produtos

Execute o script para converter `leagues_data.json` para o formato CSV da Shopify:

```bash
node scripts/generateShopifyCSV.js
```

Isso irá gerar o arquivo `shopify-products-import.csv` na raiz do projeto.

## 🏪 Passo 2: Importar Produtos na Shopify

1. **Acesse seu Shopify Admin**: `https://sua-loja.myshopify.com/admin`

2. **Vá para Products**:
   - Menu lateral > Products
   - Clique em "Import" no canto superior direito

3. **Faça Upload do CSV**:
   - Selecione o arquivo `shopify-products-import.csv`
   - Clique em "Upload and continue"
   - Revise o mapeamento de colunas
   - Clique em "Import products"

4. **Aguarde a Importação**:
   - Pode levar alguns minutos dependendo da quantidade de produtos
   - Você receberá um email quando concluir

## 🖼️ Passo 3: Upload das Imagens

### Opção A: URLs Públicas (Recomendado)
Se suas imagens já estiverem hospedadas publicamente (ex: Vercel, Cloudflare), o CSV já inclui as URLs. As imagens serão baixadas automaticamente pela Shopify.

### Opção B: Upload Manual
1. Acesse cada produto na Shopify
2. Vá para a seção "Media"
3. Faça upload das imagens da pasta `public/Leagues/[nome-da-liga]/[produto]/`

### Opção C: Bulk Upload via App
Use um app da Shopify como "Matrixify" ou "Excelify" para fazer upload em massa das imagens.

## 🔑 Passo 4: Obter Credenciais da API

1. **Acesse Shopify Admin** > Settings > Apps and sales channels

2. **Develop apps**:
   - Clique em "Develop apps"
   - Clique em "Create an app"
   - Nome: "Foltz Fanwear Storefront"

3. **Configure API Access**:
   - Clique em "Configure Storefront API scopes"
   - Marque as seguintes permissões:
     - ✅ `unauthenticated_read_product_listings`
     - ✅ `unauthenticated_read_product_inventory`
     - ✅ `unauthenticated_read_collection_listings`
     - ✅ `unauthenticated_read_checkouts`
     - ✅ `unauthenticated_write_checkouts`
   - Clique em "Save"

4. **Gerar Access Token**:
   - Clique na aba "API credentials"
   - Em "Storefront API access token", clique em "Install app"
   - Copie o **Storefront API access token** gerado

## ⚙️ Passo 5: Configurar Variáveis de Ambiente

1. **Crie o arquivo `.env.local`** na raiz do projeto:

```bash
cp .env.example .env.local
```

2. **Edite `.env.local`** com suas credenciais:

```env
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=sua-loja.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=seu-token-aqui
```

⚠️ **Importante**:
- Use apenas o domínio (ex: `foltz-fanwear.myshopify.com`)
- NÃO inclua `https://` no domínio
- O arquivo `.env.local` NÃO deve ser commitado (já está no `.gitignore`)

## 🧪 Passo 6: Testar a Integração

1. **Reinicie o servidor de desenvolvimento**:
```bash
npm run dev
```

2. **Acesse**: `http://localhost:3000`

3. **Verifique**:
   - Os produtos devem carregar da Shopify
   - As imagens devem vir do CDN da Shopify
   - As URLs das imagens terão formato: `cdn.shopify.com/...`

## 📊 Estrutura de Dados

### Produtos no CSV
Cada produto inclui:
- **Handle**: ID único (slug)
- **Title**: Nome do produto
- **Variants**: Tamanhos (S, M, L, XL, XXL)
- **Price**: Preço de venda (ARS 82.713,38)
- **Compare At Price**: Preço original (ARS 115.798,73)
- **Tags**: País, Liga, "COMPRA 1 LLEVA 2"
- **Collections**: Categoria (Liga)
- **Images**: Até 5 imagens por produto

### Dados Retornados pela API
```javascript
{
  id: "gid://shopify/Product/123456789",
  title: "Barcelona 09-10 Home",
  handle: "barcelona-09-10-home-size-s-xxl",
  images: [
    { url: "https://cdn.shopify.com/...", altText: "..." }
  ],
  variants: [
    {
      id: "gid://shopify/ProductVariant/987654321",
      title: "S",
      price: { amount: "82713.38", currencyCode: "ARS" }
    }
  ]
}
```

## 🔄 Atualizar Produtos

Sempre que fizer mudanças nos produtos:

1. Atualize `public/leagues_data.json`
2. Execute novamente: `node scripts/generateShopifyCSV.js`
3. Na Shopify, delete os produtos antigos
4. Reimporte o CSV atualizado

**Ou** edite diretamente na Shopify Admin (recomendado para pequenas mudanças).

## ❓ Problemas Comuns

### Produtos não aparecem
- Verifique se os produtos estão "Published" na Shopify
- Confirme que o Storefront API tem permissões corretas
- Verifique o token e domínio no `.env.local`

### Imagens não carregam
- Certifique-se que as URLs das imagens são públicas e acessíveis
- Verifique se fez upload manual das imagens na Shopify
- As imagens devem estar no CDN da Shopify após a importação

### Erro de CORS
- Use apenas Storefront API (não Admin API)
- Verifique se instalou o app corretamente
- Confirme que as permissões estão configuradas

## 📚 Recursos

- [Shopify Product CSV Format](https://help.shopify.com/en/manual/products/import-export/using-csv)
- [Storefront API Docs](https://shopify.dev/api/storefront)
- [Next.js + Shopify Guide](https://vercel.com/guides/shopify-next-js)

---

✅ Após completar todos os passos, seu site estará conectado à Shopify e as imagens carregarão muito mais rápido do CDN!

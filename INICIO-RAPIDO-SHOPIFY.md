# 🚀 Início Rápido - Migração para Shopify

## ✅ O que já foi feito:

1. ✅ Criado serviço de conexão com Shopify API (`src/lib/shopify.js`)
2. ✅ Criadas funções helper para formatar dados (`src/utils/shopifyHelpers.js`)
3. ✅ Criado script para gerar CSV (`scripts/generateShopifyCSV.js`)
4. ✅ Criado arquivo de exemplo `.env.example`
5. ✅ Adicionado comando `npm run generate-csv` no package.json

## 🎯 Próximos Passos:

### 1️⃣ Gerar o CSV dos Produtos

```bash
npm run generate-csv
```

Isso vai criar o arquivo `shopify-products-import.csv` na raiz do projeto.

### 2️⃣ Criar/Configurar sua Loja Shopify

Se ainda não tem:
1. Acesse https://www.shopify.com/br
2. Crie uma conta (tem trial gratuito de 14 dias)
3. Configure sua loja básica

### 3️⃣ Importar Produtos na Shopify

1. **Acesse Shopify Admin**: `https://sua-loja.myshopify.com/admin`

2. **Products > Import**:
   - Clique em "Import" (canto superior direito)
   - Selecione `shopify-products-import.csv`
   - Clique em "Upload and continue"

3. **Aguarde**:
   - A importação pode demorar alguns minutos
   - Você receberá email quando concluir

### 4️⃣ Upload das Imagens

**⚠️ IMPORTANTE**: As imagens precisam estar publicamente acessíveis!

#### Opção A: Deploy no Vercel (RECOMENDADO)
```bash
# Faça deploy do projeto no Vercel
vercel --prod
```

Depois ajuste as URLs no script `generateShopifyCSV.js`:
```javascript
const imageUrl = `https://seu-site.vercel.app/${imagePath}`
```

E gere o CSV novamente:
```bash
npm run generate-csv
```

#### Opção B: Upload Manual
1. Vá em cada produto na Shopify
2. Faça upload das imagens da pasta `public/Leagues/`

### 5️⃣ Obter Credenciais da Shopify API

1. **Shopify Admin** > Settings > Apps and sales channels

2. **Develop apps** > Create an app:
   - Nome: "Foltz Fanwear Storefront"

3. **Configure Storefront API**:
   Marque essas permissões:
   - ✅ `unauthenticated_read_product_listings`
   - ✅ `unauthenticated_read_collection_listings`
   - ✅ `unauthenticated_read_checkouts`
   - ✅ `unauthenticated_write_checkouts`

4. **Install app** e copie o **Storefront API access token**

### 6️⃣ Configurar Variáveis de Ambiente

Crie o arquivo `.env.local`:

```env
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=sua-loja.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=seu-token-aqui
```

**Exemplo**:
```env
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=foltz-fanwear.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=abc123def456...
```

### 7️⃣ Testar a Integração

```bash
npm run dev
```

Acesse `http://localhost:3000` e verifique:
- ✅ Produtos carregam da Shopify
- ✅ Imagens vêm do CDN da Shopify (`cdn.shopify.com`)
- ✅ Tudo está muito mais rápido!

## 📝 Estrutura de Arquivos Criados

```
Foltz/
├── src/
│   ├── lib/
│   │   └── shopify.js              # Conexão com Shopify API
│   ├── utils/
│   │   └── shopifyHelpers.js       # Helpers para formatar dados
│   └── components/
│       └── ProductCardSkeleton.jsx # Loading state
├── scripts/
│   └── generateShopifyCSV.js       # Gera CSV para importação
├── .env.example                     # Exemplo de variáveis
├── SHOPIFY-SETUP.md                # Guia completo
└── shopify-products-import.csv     # CSV gerado (após rodar script)
```

## 🔄 Atualizações Futuras

### Adicionar novos produtos:
1. Adicione diretamente na Shopify Admin (recomendado)
2. **OU** atualize `leagues_data.json` e regere o CSV

### Atualizar preços:
- Faça na Shopify Admin (muito mais fácil!)

### Gerenciar estoque:
- Use o painel da Shopify para controle de inventário

## ❓ Troubleshooting

### "Module not found: shopify"
Execute: `npm install`

### "Products not fetched"
- Verifique se `.env.local` está configurado
- Confirme que o token e domínio estão corretos
- Verifique se os produtos estão "Published" na Shopify

### Imagens não aparecem
- Certifique-se que fez o deploy no Vercel (ou outro hosting)
- As imagens precisam estar em URLs públicas
- Ou faça upload manual das imagens na Shopify

## 📚 Recursos

- [SHOPIFY-SETUP.md](./SHOPIFY-SETUP.md) - Guia detalhado completo
- [Shopify Docs](https://shopify.dev/docs)
- [Vercel Deployment](https://vercel.com/docs)

---

🎉 **Pronto!** Após seguir esses passos, seu site estará conectado à Shopify com imagens super rápidas do CDN!

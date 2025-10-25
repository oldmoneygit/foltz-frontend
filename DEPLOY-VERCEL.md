# 🚀 Guia de Deploy na Vercel - Foltz Fanwear

Este guia explica como preparar o projeto para deploy na Vercel, incluindo otimização de imagens e integração com Shopify.

---

## 📊 Situação Atual do Projeto

### Análise de Imagens:

**✅ Imagens em `/public/images`: ~52MB**
- Logo, hero sections, categorias
- **Ação**: Manter no projeto (OK para Vercel)

**⚠️ Imagens em `/Leagues`: Milhares de imagens de produtos**
- Imagens de todos os produtos
- **Problema**: Aumenta drasticamente o tamanho do build
- **Solução**: Migrar para Shopify CDN (obrigatório)

---

## 🎯 Estratégia de Deploy

### Opção 1: Deploy Rápido (Desenvolvimento) ⚡

Se você quiser testar o site rapidamente SEM produtos da Shopify:

1. **Adicione a pasta Leagues ao .gitignore**:
   ```bash
   echo "Leagues/" >> .gitignore
   ```

2. **Deploy na Vercel**:
   - O site vai funcionar, mas sem imagens de produtos
   - Produtos vão aparecer sem imagem ou com erro
   - **Use apenas para testes de desenvolvimento**

### Opção 2: Deploy Completo (Produção) ⭐ **RECOMENDADO**

Deploy profissional com todas as imagens otimizadas via Shopify CDN:

#### Pré-requisitos:
- ✅ Conta Shopify criada
- ✅ Produtos importados via CSV
- ✅ Imagens adicionadas aos produtos na Shopify
- ✅ API Tokens configurados

---

## 📝 Passo a Passo - Deploy Completo

### Etapa 1: Importar Produtos para Shopify

1. **Gerar CSV dos produtos**:
   ```bash
   npm run generate-csv
   ```

2. **Importar na Shopify**:
   - Acesse: Shopify Admin > Products > Import
   - Faça upload do `shopify-products-import.csv`
   - Aguarde a importação

3. **Adicionar imagens dos produtos**:

   **Opção A - Manual** (mais rápido para poucos produtos):
   - Entre em cada produto no Shopify Admin
   - Faça upload das imagens da pasta `/Leagues`
   - Adicione 2-3 imagens por produto

   **Opção B - Via API** (automatizado, para muitos produtos):
   ```bash
   # Criar script de upload em massa
   npm run upload-images-bulk
   ```
   *(Você pode pedir para eu criar esse script se precisar)*

### Etapa 2: Configurar Environment Variables

1. **Obter credenciais da Shopify**:
   - Storefront API Token (para leitura)
   - Admin API Token (para gerenciamento)
   - [Veja SHOPIFY-SETUP.md para instruções detalhadas](./SHOPIFY-SETUP.md)

2. **Criar arquivo `.env.local`**:
   ```env
   NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=sua-loja.myshopify.com
   NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=seu-storefront-token
   SHOPIFY_ADMIN_ACCESS_TOKEN=seu-admin-token
   ```

3. **Testar localmente**:
   ```bash
   npm run dev
   ```
   - Acesse http://localhost:3000
   - Verifique se os produtos aparecem com imagens da Shopify

### Etapa 3: Atualizar Componentes para Usar Shopify

Precisamos atualizar os componentes que atualmente usam `leagues_data.json`:

**Arquivos que precisam ser atualizados**:
- [ ] `src/app/page.jsx` - Homepage
- [ ] `src/components/BestSellers.jsx` - Usar `getProductsInCollection()`
- [ ] `src/components/CollectionCarousel.jsx` - Usar `getProductsInCollection()`
- [ ] `src/components/FeaturedProducts.jsx` - Usar `getProductsInCollection()`
- [ ] `src/app/liga/[slug]/page.jsx` - Usar `getProduct(handle)`

**Exemplo de migração**:

```javascript
// ANTES (usando JSON local):
import productsData from '@/data/leagues_data.json'

// DEPOIS (usando Shopify):
import { getProductsInCollection } from '@/lib/shopify'

export default async function BestSellers() {
  const shopifyProducts = await getProductsInCollection()
  const products = shopifyProducts.map(formatShopifyProduct)

  return (
    // Renderizar produtos
  )
}
```

*(Posso fazer essas atualizações para você se quiser)*

### Etapa 4: Limpar Projeto

1. **Remover pasta Leagues**:
   ```bash
   # ATENÇÃO: Faça backup antes!
   # Só faça isso DEPOIS de ter certeza que as imagens estão na Shopify

   # No Windows:
   cmd.exe /c "rd /s /q Leagues"

   # Ou adicione ao .gitignore:
   echo "Leagues/" >> .gitignore
   ```

2. **Verificar tamanho do projeto**:
   ```bash
   du -sh .
   ```
   - Deve estar < 100MB para deploy rápido

### Etapa 5: Deploy na Vercel

1. **Instalar Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Fazer login**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Configurar Environment Variables na Vercel**:
   - Acesse: Vercel Dashboard > Seu Projeto > Settings > Environment Variables
   - Adicione:
     - `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN`
     - `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN`
     - `SHOPIFY_ADMIN_ACCESS_TOKEN`
   - Salve e faça redeploy:
     ```bash
     vercel --prod
     ```

---

## ⚙️ Otimizações no next.config.js

O arquivo já está otimizado para Vercel:

```javascript
// ✅ Já configurado:
{
  images: {
    // Permite imagens da Shopify
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.shopify.com' }
    ],

    // Formatos otimizados (AVIF, WebP)
    formats: ['image/avif', 'image/webp'],

    // Cache de 1 ano
    minimumCacheTTL: 31536000,

    // Otimização habilitada
    unoptimized: false,
  },

  // Compressão ativada
  compress: true,

  // Minificação com SWC
  swcMinify: true,

  // Remove console.log em produção
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  }
}
```

---

## ✅ Checklist Final

Antes de fazer o deploy em produção, confirme:

- [ ] Produtos importados para Shopify
- [ ] Imagens adicionadas aos produtos na Shopify
- [ ] Credenciais Shopify (Storefront + Admin API) obtidas
- [ ] Arquivo `.env.local` criado e testado localmente
- [ ] Site funcionando localmente com dados da Shopify
- [ ] Componentes atualizados para usar API Shopify
- [ ] Pasta `/Leagues` removida ou ignorada
- [ ] Environment variables configuradas na Vercel
- [ ] Build testado: `npm run build`
- [ ] Deploy realizado: `vercel --prod`

---

## 🐛 Problemas Comuns

### Build falha com "Image Optimization error"

**Causa**: Imagens muito grandes ou não otimizadas.

**Solução**:
```javascript
// Temporariamente em next.config.js:
images: {
  unoptimized: true, // Use apenas para debug!
}
```

### "Module not found" durante build

**Causa**: Alguma importação de arquivo local que não existe.

**Solução**:
- Verifique imports de `leagues_data.json`
- Certifique-se que todos os componentes usam Shopify API

### Imagens da Shopify não carregam

**Causa**: Domain não autorizado em `remotePatterns`.

**Solução**:
```javascript
// next.config.js
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'cdn.shopify.com',
    },
    {
      protocol: 'https',
      hostname: '**.shopify.com', // Permite subdomínios
    },
  ],
}
```

### Build muito lento

**Causa**: Muitas imagens sendo otimizadas durante build.

**Solução**:
- As imagens da Shopify já vêm otimizadas do CDN
- Reduza imagens em `/public/images` se necessário
- Use `quality={75}` nas imagens

---

## 📚 Próximos Passos

Depois do deploy bem-sucedido:

1. **Configurar domínio customizado** na Vercel
2. **Ativar Analytics** para monitorar performance
3. **Configurar Shopify Checkout** para vendas
4. **Adicionar Google Analytics**
5. **Testar performance** com Lighthouse

---

## 💡 Dicas de Performance

1. **Use o CDN da Shopify para TODAS as imagens de produtos**
   - Nunca armazene imagens de produtos no repositório

2. **Lazy loading**:
   ```jsx
   <Image loading="lazy" />
   ```

3. **Blur placeholder**:
   ```jsx
   <Image
     placeholder="blur"
     blurDataURL="data:image/jpeg;base64,..."
   />
   ```

4. **Quality ajustado**:
   ```jsx
   <Image quality={75} /> // Produtos
   <Image quality={90} /> // Hero/Landing
   ```

---

## 🔗 Recursos Úteis

- [Vercel Deployment Docs](https://vercel.com/docs/deployments/overview)
- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Shopify CDN Docs](https://shopify.dev/docs/api/admin-graphql/latest/objects/Image)
- [SHOPIFY-SETUP.md](./SHOPIFY-SETUP.md) - Setup da integração Shopify
- [PRODUCT-MANAGEMENT.md](./PRODUCT-MANAGEMENT.md) - Gerenciamento de produtos

---

✅ **Quando estiver pronto, me avise que eu atualizo os componentes para usar Shopify e te ajudo com o deploy!**

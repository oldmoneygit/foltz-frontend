# 🚀 Guia de Deploy na Vercel - Foltz Fanwear

✅ **ATUALIZADO**: Projeto já migrado para Shopify API! Pronto para deploy.

Este guia explica como fazer o deploy do projeto na Vercel agora que a migração para Shopify está completa.

---

## ✅ Status do Projeto

### O que já está pronto:

- ✅ **Integração com Shopify Storefront API v2024-10** completa
- ✅ **271 produtos** importados na Shopify
- ✅ **2,083 imagens** hospedadas no Shopify CDN
- ✅ **Todos os componentes migrados** para usar Shopify API:
  - BestSellers (Server + Client Components)
  - FeaturedProducts (Server + Client Components)
  - CollectionCarousel (Server + Client Components)
  - LeagueCards (Server + Client Components)
- ✅ **Páginas de produtos e ligas** usando Shopify
- ✅ **Build de produção testado** (255 páginas geradas)
- ✅ **Código no GitHub**: https://github.com/oldmoneygit/foltz-frontend.git
- ✅ **/Leagues excluído do Git** (2-3GB economizados)

---

## 🎯 Deploy na Vercel - Passo a Passo

### Etapa 1: Configurar Projeto na Vercel

1. **Acesse** [vercel.com](https://vercel.com) e faça login com GitHub

2. **Importe o repositório**:
   - Clique em "Add New..." > "Project"
   - Selecione: `oldmoneygit/foltz-frontend`
   - Clique em "Import"

3. **Configure o projeto**:
   - **Framework Preset**: Next.js (detectado automaticamente)
   - **Root Directory**: `./` (padrão)
   - **Build Command**: `npm run build` (padrão)
   - **Output Directory**: `.next` (padrão)

### Etapa 2: Adicionar Environment Variables

Na seção "Environment Variables" da Vercel, adicione:

```env
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
```
**Value**: `sua-loja.myshopify.com`

```env
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN
```
**Value**: `seu-storefront-access-token`

**Importante**:
- Use os mesmos valores do seu arquivo `.env.local`
- Marque "Production", "Preview", e "Development"

### Etapa 3: Deploy

1. **Clique em "Deploy"**
   - A Vercel vai:
     - Clonar o repositório
     - Instalar dependências
     - Executar `npm run build`
     - Gerar 255 páginas estáticas
     - Fazer deploy

2. **Aguarde o build** (5-10 minutos na primeira vez)

3. **Acesse seu site**:
   - URL provisória: `foltz-frontend.vercel.app`
   - Será fornecida após o deploy

---

## ⚙️ Configurações Já Otimizadas

### next.config.js

O arquivo já está otimizado para Vercel:

```javascript
{
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,
  },
  compress: true,
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  }
}
```

### .gitignore

Já configurado para excluir:
- `/Leagues` (2-3GB de imagens locais)
- `node_modules`
- `.next`
- `.env.local`
- Arquivos CSV de importação

---

## 📊 O que esperar do Build

### Estatísticas do Build:

```
✓ Generating static pages (255/255)
✓ Finalizing page optimization

Route (app)                    Size      First Load JS
┌ ○ /                         43.2 kB    184 kB
├ ƒ /liga/[slug]              2.52 kB    139 kB
├ ○ /ligas                    2.45 kB    134 kB
└ ● /product/[slug]           5.13 kB    149 kB
    └ [+250 paths]

+ First Load JS shared         87.2 kB
```

### Páginas geradas:
- **1** homepage
- **1** página de ligas
- **250** páginas de produtos (SSG - Static Site Generation)
- **~3** páginas dinâmicas de liga

---

## 🔧 Deployments Futuros

### Deploy Automático

Cada push para `master` vai automaticamente:
1. Triggerar novo build na Vercel
2. Gerar preview deployment
3. Fazer deploy em produção (se bem-sucedido)

### Deploy Manual via CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy preview
vercel

# Deploy produção
vercel --prod
```

---

## 🐛 Troubleshooting

### Build falha com erro de Environment Variables

**Causa**: Variables não configuradas na Vercel.

**Solução**:
1. Vá em: Settings > Environment Variables
2. Adicione `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN`
3. Adicione `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN`
4. Clique em "Redeploy" no último deployment

### Imagens da Shopify não carregam

**Causa**: Domain não autorizado em `remotePatterns`.

**Solução**: Já está configurado! Se persistir:
```javascript
// next.config.js - adicionar fallback
remotePatterns: [
  {
    protocol: 'https',
    hostname: 'cdn.shopify.com',
  },
  {
    protocol: 'https',
    hostname: '**.shopify.com', // Wildcard para subdomínios
  },
]
```

### "Module not found" durante build

**Causa**: Importação de arquivo local inexistente.

**Solução**: Todos os componentes já foram atualizados para usar Shopify API. Se ocorrer:
1. Verifique imports de `leagues_data.json`
2. Certifique-se que está na branch correta
3. Execute `git pull` para pegar últimas mudanças

### Build muito lento

**Causa**: Muitas páginas sendo geradas.

**Solução**:
- Normal na primeira vez (255 páginas)
- Builds incrementais serão mais rápidos
- Shopify CDN já otimiza imagens

---

## 📈 Próximos Passos (Opcional)

### 1. Domínio Customizado

Na Vercel:
1. Settings > Domains
2. Adicionar: `www.foltzfanwear.com`
3. Seguir instruções de DNS

### 2. Analytics

Na Vercel:
1. Analytics > Enable
2. Monitorar:
   - Page views
   - Performance (Core Web Vitals)
   - Top pages

### 3. Performance Monitoring

```bash
# Testar localmente com Lighthouse
npm run build
npm start
# Abrir DevTools > Lighthouse > Run
```

### 4. Shopify Checkout

Configurar Buy Button ou Checkout completo:
1. Shopify Admin > Sales Channels
2. Adicionar "Buy Button"
3. Integrar no site

---

## ✅ Checklist de Deploy

Antes de fazer deploy em produção:

- [x] Produtos importados para Shopify (271 produtos)
- [x] Imagens adicionadas aos produtos (2,083 imagens)
- [x] Credenciais Shopify obtidas
- [x] Site funcionando localmente com Shopify
- [x] Componentes atualizados para usar Shopify API
- [x] Pasta `/Leagues` excluída do Git
- [x] Build testado: `npm run build` ✓
- [x] Código no GitHub ✓
- [ ] Environment variables configuradas na Vercel
- [ ] Deploy realizado: primeiro deployment
- [ ] Site testado em produção

---

## 💡 Dicas Finais

### Performance

1. **Imagens já otimizadas** pelo Shopify CDN
2. **SSG (Static Site Generation)** para produtos = ultra rápido
3. **Edge Functions** da Vercel para páginas dinâmicas
4. **CDN global** da Vercel = baixa latência mundial

### Segurança

1. **Environment variables** nunca expostas no código
2. **HTTPS** automático pela Vercel
3. **Storefront API** (read-only) segura para frontend

### Monitoramento

1. **Vercel Dashboard** para métricas de deploy
2. **Shopify Analytics** para vendas
3. **Console da Vercel** para logs de erro

---

## 🔗 Links Úteis

- **Repositório**: https://github.com/oldmoneygit/foltz-frontend.git
- **Vercel Docs**: https://vercel.com/docs
- **Next.js Image**: https://nextjs.org/docs/app/building-your-application/optimizing/images
- **Shopify API**: https://shopify.dev/docs/api/storefront

---

## 🎉 Pronto para Deploy!

Seu projeto está **100% pronto** para deploy na Vercel. Todos os componentes foram migrados para Shopify API e o build de produção foi testado com sucesso.

**Próximo passo**: Importar o repositório na Vercel e adicionar as environment variables!

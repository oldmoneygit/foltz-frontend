# 🧪 Teste de Importação Shopify - CORRIGIDO ✅

## ❌ Problema Anterior:
```
Line 2-6: Validation failed: File URL is invalid
```

A Shopify **não aceita caminhos locais** do Windows no CSV:
```
C:\Users\PC\Desktop\... ❌ INVÁLIDO
```

---

## ✅ Nova Solução: Importação em 2 Etapas

Igual ao **SNKHOUSE**: produtos primeiro, imagens depois.

### **Etapa 1:** Importar produtos (dados básicos) via CSV
### **Etapa 2:** Fazer upload das imagens via API

---

# 📝 Passo a Passo COMPLETO

## Etapa 1: Importar Produtos via CSV

### 1.1 - Gerar CSV de Teste (SEM imagens)

```bash
npm run generate-csv-test
```

**Resultado:**
- ✅ Arquivo `shopify-products-TEST.csv` gerado
- ✅ 5 produtos da Bundesliga
- ✅ SEM imagens (serão adicionadas depois)

---

### 1.2 - Importar na Shopify

1. **Acesse:** https://sua-loja.myshopify.com/admin/products

2. **Clique em:** Import (canto superior direito)

3. **Upload do arquivo:**
   - Selecione: `shopify-products-TEST.csv`
   - **NÃO marque** "Upload images from your computer" (não tem imagens no CSV)

4. **Import products**

5. **Aguarde:** 1-2 minutos

---

### 1.3 - Verificar Importação

1. Vá em **Products** no Shopify Admin

2. Você deve ver **5 produtos**:
   - ✅ Bayern 07-08 Home
   - ✅ Bayern Munich 14-15 Home
   - ✅ Bayern Munich 17-18 Home
   - ✅ Bayern Munich 25-26 Away
   - ✅ Bayern Munich 25-26 Home

3. **Clique em um produto** e verifique:
   - ✅ Título correto
   - ⚠️ **SEM imagem** (ainda)
   - ✅ Preço: ARS 82.713,38
   - ✅ Variantes de tamanho corretas

---

## Etapa 2: Adicionar Imagens via API 📸

Agora vamos fazer upload das imagens para os produtos que foram importados.

### 2.1 - Configurar Admin API Token

**Você precisa do Admin API token** (diferente do Storefront token).

1. **Acesse:** Shopify Admin > Settings > Apps and sales channels

2. **Clique em:** Develop apps

3. **Selecione seu app** (ou crie um novo se não tiver)

4. **Vá em:** Admin API

5. **Configure permissões:**
   - ✅ `write_products`
   - ✅ `read_products`

6. **Instale o app** (se ainda não instalou)

7. **Copie o Admin API access token**

---

### 2.2 - Adicionar Token no .env.local

Crie ou edite o arquivo `.env.local` na raiz do projeto:

```env
# Shopify Storefront API (Frontend)
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=sua-loja.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=seu-storefront-token

# Shopify Admin API (Scripts de gerenciamento)
SHOPIFY_ADMIN_ACCESS_TOKEN=seu-admin-token-aqui
```

**⚠️ IMPORTANTE:** O Admin token é **secreto** - nunca faça commit dele!

---

### 2.3 - Fazer Upload das Imagens

```bash
npm run upload-images-test
```

**O que vai acontecer:**

1. Script lê os 5 produtos do `leagues_data.json`
2. Busca cada produto na Shopify pelo handle
3. Faz upload de cada imagem (001.jpg, 002.jpg, 003.jpg, etc.)
4. Shopify hospeda as imagens no CDN
5. Imagens ficam linkadas aos produtos

**Tempo estimado:** 2-3 minutos

**Saída esperada:**
```
📸 SHOPIFY IMAGE UPLOADER - TESTE (5 produtos)

📦 Processando: Bayern 07-08 Home
   Handle: bayern-07-08-home-size-s-xxl
   🔍 Buscando produto na Shopify...
   ✅ Produto encontrado! ID: gid://shopify/Product/123456
   📸 Imagens a fazer upload: 8
   ⏳ Uploading 1/8: 001.jpg
   ✅ Upload concluído!
   ⏳ Uploading 2/8: 002.jpg
   ✅ Upload concluído!
   ...
   ✅ Produto concluído!

📦 Processando: Bayern Munich 14-15 Home
   ...

========================================
📊 RESUMO DO UPLOAD
========================================
✅ Imagens enviadas com sucesso: 40
❌ Erros: 0
========================================

🎉 Imagens foram enviadas para Shopify CDN!
```

---

### 2.4 - Verificar Imagens no Shopify

1. **Volte para:** Shopify Admin > Products

2. **Clique em um dos produtos**

3. **Você deve ver:**
   - ✅ Todas as imagens (001.jpg, 002.jpg, 003.jpg, etc.)
   - ✅ Hospedadas no CDN da Shopify
   - ✅ URLs: `https://cdn.shopify.com/s/files/...`

4. **Abra a imagem** e veja se carrega rápido (CDN global)

---

## ✅ Checklist Final

Após completar as 2 etapas:

- [ ] 5 produtos foram criados na Shopify
- [ ] Cada produto tem título, preço e variantes corretas
- [ ] Todas as imagens foram enviadas via script
- [ ] Imagens aparecem no Shopify Admin
- [ ] URLs das imagens são da Shopify CDN (`cdn.shopify.com`)
- [ ] Script rodou sem erros

---

## 🎯 Se o Teste Funcionou

### Próximo Passo: Importar TODOS os produtos

#### 1. Atualizar script principal:

Vou atualizar o `generateShopifyCSV.js` para também gerar SEM imagens.

#### 2. Gerar CSV completo:

```bash
npm run generate-csv  # ~270 produtos
```

#### 3. Importar na Shopify:

Mesmo processo da Etapa 1, mas com todos os produtos.

#### 4. Upload de todas as imagens:

Vou criar script `uploadProductImages-ALL.js` para fazer upload de **todas as imagens**.

```bash
npm run upload-images-all  # ~2-3 horas
```

---

## 🐛 Troubleshooting

### Erro: "Product not found in Shopify"

**Causa:** Produto não foi importado ainda ou handle está diferente.

**Solução:**
1. Verifique se o produto existe no Shopify Admin
2. Compare o handle no Shopify com o que está no script
3. Certifique-se de ter importado o CSV primeiro

---

### Erro: "Token is invalid" ou "Unauthorized"

**Causa:** Admin API token não configurado ou sem permissões.

**Solução:**
1. Verifique se `SHOPIFY_ADMIN_ACCESS_TOKEN` está em `.env.local`
2. Certifique-se que o token tem permissão `write_products`
3. Verifique se instalou o app na Shopify

---

### Erro: "Image upload failed"

**Causa:** Imagem muito grande ou formato inválido.

**Solução:**
1. Shopify aceita: JPG, PNG, WebP
2. Tamanho máximo: 20MB por imagem
3. Verifique se a imagem existe na pasta `/Leagues`

---

### Upload muito lento

**Causa:** API da Shopify tem rate limit (2 requisições/segundo).

**Solução:**
- É normal! O script já aguarda 500ms entre uploads
- Deixe rodando em background
- Para 270 produtos × 8 imagens = ~2-3 horas é normal

---

## 📊 Comparação com SNKHOUSE

| Aspecto | SNKHOUSE | FOLTZ (antes) | FOLTZ (agora) |
|---------|----------|---------------|---------------|
| Produtos | CSV | CSV | CSV ✅ |
| Imagens principais | WordPress URLs | Caminhos locais ❌ | API Upload ✅ |
| Imagens detalhes | WordPress URLs | Caminhos locais ❌ | API Upload ✅ |
| CDN | WordPress | Local ❌ | Shopify ✅ |
| Velocidade | Rápido | Lento ❌ | Rápido ✅ |

**Resultado final:** Exatamente como SNKHOUSE! Todas as imagens em CDN.

---

## 🚀 Resumo dos Comandos

```bash
# 1. Gerar CSV de teste (5 produtos, sem imagens)
npm run generate-csv-test

# 2. Importar CSV na Shopify manualmente
# (Shopify Admin > Products > Import)

# 3. Configurar .env.local com SHOPIFY_ADMIN_ACCESS_TOKEN

# 4. Fazer upload das imagens via API
npm run upload-images-test

# 5. Verificar no Shopify Admin se funcionou

# 6. Se funcionou, repetir para todos os produtos:
npm run generate-csv          # CSV completo
npm run upload-images-all     # Todas as imagens
```

---

✅ **Agora sim! Tenta de novo e me avisa se funcionou!** 🎉

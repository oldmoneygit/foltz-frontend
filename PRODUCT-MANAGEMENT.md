# 🛍️ Gerenciamento de Produtos via CLI

Este guia mostra como gerenciar seus produtos da Shopify diretamente pelo terminal, sem precisar acessar o Shopify Admin.

## 📋 Pré-requisitos

Antes de usar os comandos, você precisa:

1. **Configurar Admin API Access Token**:
   - Acesse seu Shopify Admin
   - Vá em **Settings > Apps and sales channels**
   - Clique em **Develop apps**
   - Selecione seu app (ou crie um novo)
   - Vá na aba **Admin API**
   - Configure as seguintes permissões:
     - ✅ `write_products`
     - ✅ `read_products`
     - ✅ `write_inventory`
   - Salve e clique em **Install app**
   - Copie o **Admin API access token**

2. **Adicionar token no .env.local**:
   ```env
   SHOPIFY_ADMIN_ACCESS_TOKEN=seu-admin-token-aqui
   ```

⚠️ **IMPORTANTE**: Nunca commit o arquivo `.env.local` nem compartilhe o Admin API token publicamente!

---

## 🎯 Comandos Disponíveis

### 1. Gerenciador Interativo de Produtos

O comando mais completo, com menu interativo para gerenciar todos os aspectos de um produto.

```bash
npm run update-product
```

**Funcionalidades:**
- Listar todos os produtos
- Atualizar preço
- Atualizar título
- Atualizar descrição
- Adicionar imagens
- Remover imagens

**Exemplo de uso:**
```bash
npm run update-product

# Saída:
# 📦 Carregando produtos...
#
# Produtos disponíveis:
# 1. Barcelona 09-10 Home (barcelona-09-10-home-size-s-xxl) - ARS 82713.38
# 2. Real Madrid 10-11 Away (real-madrid-10-11-away-size-s-xxl) - ARS 82713.38
# ...
#
# Digite o número do produto que deseja editar: 1
#
# O que você deseja fazer?
# 1. Atualizar preço
# 2. Atualizar título
# 3. Atualizar descrição
# 4. Adicionar imagem
# 5. Remover imagem
# 0. Sair
```

---

### 2. Atualizar Preços Rapidamente

Comando rápido para atualizar preços sem interação.

#### Atualizar produto individual

```bash
npm run update-price <handle> <novo-preço> [preço-comparativo]
```

**Exemplo:**
```bash
# Atualizar apenas o preço de venda
npm run update-price barcelona-09-10-home-size-s-xxl 85000

# Atualizar preço de venda E preço comparativo
npm run update-price barcelona-09-10-home-size-s-xxl 85000 120000
```

#### Atualizar TODOS os produtos em massa

```bash
npm run update-price bulk <novo-preço> [preço-comparativo]
```

**Exemplo:**
```bash
# Atualizar todos os produtos para ARS 90.000
npm run update-price bulk 90000 130000
```

⚠️ **CUIDADO**: O comando `bulk` atualiza TODOS os produtos de uma vez!

---

### 3. Gerenciar Imagens

Adicione, remova ou liste imagens dos produtos.

#### Listar imagens de um produto

```bash
npm run upload-image list <handle>
```

**Exemplo:**
```bash
npm run upload-image list barcelona-09-10-home-size-s-xxl

# Saída:
# 📷 Imagens do produto:
#
# 1. ID: gid://shopify/ProductImage/123456789
#    URL: https://cdn.shopify.com/s/files/1/0123/4567/products/img1.jpg
#    Alt: Barcelona Home
#
# 2. ID: gid://shopify/ProductImage/987654321
#    URL: https://cdn.shopify.com/s/files/1/0123/4567/products/img2.jpg
#    Alt: Barcelona Home - Detalhe
```

#### Adicionar uma imagem

```bash
npm run upload-image add <handle> <url-da-imagem> [texto-alt]
```

**Exemplo:**
```bash
npm run upload-image add barcelona-09-10-home-size-s-xxl "https://exemplo.com/img.jpg" "Barcelona Home - Frente"
```

**Notas:**
- A URL da imagem deve ser pública e acessível
- O texto alternativo (alt) é opcional
- A Shopify irá baixar e hospedar a imagem no seu CDN

#### Remover uma imagem

```bash
npm run upload-image remove <handle> <image-id>
```

**Exemplo:**
```bash
# Primeiro, liste as imagens para obter o ID
npm run upload-image list barcelona-09-10-home-size-s-xxl

# Depois, remova usando o ID
npm run upload-image remove barcelona-09-10-home-size-s-xxl gid://shopify/ProductImage/123456789
```

---

## 📖 Exemplos de Casos de Uso

### Caso 1: Atualizar preços de uma promoção

Você quer fazer uma promoção e reduzir todos os produtos de ARS 82.713 para ARS 75.000:

```bash
npm run update-price bulk 75000 82713
```

Isso irá:
- Atualizar o preço de venda para ARS 75.000
- Manter o preço comparativo em ARS 82.713 (mostrando o desconto)

---

### Caso 2: Adicionar novas imagens a um produto

Você tem fotos novas de um produto e quer adicioná-las:

```bash
npm run upload-image add barcelona-09-10-home-size-s-xxl "https://exemplo.com/frente.jpg" "Frente"
npm run upload-image add barcelona-09-10-home-size-s-xxl "https://exemplo.com/costas.jpg" "Costas"
npm run upload-image add barcelona-09-10-home-size-s-xxl "https://exemplo.com/detalhe.jpg" "Detalhe do emblema"
```

---

### Caso 3: Corrigir título de um produto

Você quer alterar o título de um produto usando o gerenciador interativo:

```bash
npm run update-product

# Selecione o produto
# Digite: 1

# Escolha a opção 2 (Atualizar título)
# Digite o novo título: "Barcelona 09-10 Home - Messi #10"
```

---

### Caso 4: Atualizar apenas um produto específico

```bash
# Atualizar preço do Barcelona para ARS 95.000 (preço normal ARS 130.000)
npm run update-price barcelona-09-10-home-size-s-xxl 95000 130000
```

---

## 🔍 Como Encontrar o Handle de um Produto

O **handle** é o identificador único do produto na URL. Você pode encontrá-lo de 3 formas:

### 1. Na URL do produto na Shopify
```
https://sua-loja.myshopify.com/admin/products/123456789
↓ clique em "View" no site
https://sua-loja.myshopify.com/products/barcelona-09-10-home-size-s-xxl
                                         ↑ Este é o handle
```

### 2. No arquivo `shopify-products-import.csv`
A primeira coluna do CSV contém todos os handles.

### 3. Usando o gerenciador interativo
Execute `npm run update-product` e veja a lista de todos os produtos com seus handles.

---

## ❓ Problemas Comuns

### Erro: "Shopify API Error"

**Causa**: Token da Admin API não está configurado ou está incorreto.

**Solução**:
1. Verifique se adicionou `SHOPIFY_ADMIN_ACCESS_TOKEN` no arquivo `.env.local`
2. Certifique-se que o token tem as permissões necessárias
3. Tente gerar um novo token se o atual expirou

---

### Erro: "Produto não encontrado"

**Causa**: O handle fornecido está incorreto ou o produto não existe.

**Solução**:
1. Verifique se digitou o handle corretamente
2. Use `npm run update-product` para ver a lista de handles válidos
3. Certifique-se que o produto foi importado para a Shopify

---

### Erro ao adicionar imagem: "URL inválida"

**Causa**: A URL da imagem não é acessível publicamente.

**Solução**:
1. Certifique-se que a URL começa com `https://`
2. Teste a URL no navegador para ver se a imagem carrega
3. Não use URLs de arquivos locais (ex: `file:///` ou `C:\`)
4. A imagem deve estar hospedada em um servidor público (Vercel, Cloudflare, etc.)

---

## 🚀 Próximos Passos

Depois de configurar o gerenciamento de produtos:

1. **Importe seus produtos**: Use `npm run generate-csv` e importe na Shopify
2. **Configure as credenciais**: Adicione os tokens no `.env.local`
3. **Teste os comandos**: Experimente atualizar um produto de teste
4. **Automatize**: Crie scripts personalizados para suas necessidades específicas

---

## 📚 Recursos Adicionais

- [Shopify Admin API Docs](https://shopify.dev/api/admin-graphql)
- [Product Management Guide](https://help.shopify.com/en/manual/products)
- [SHOPIFY-SETUP.md](./SHOPIFY-SETUP.md) - Setup completo da integração
- [INICIO-RAPIDO-SHOPIFY.md](./INICIO-RAPIDO-SHOPIFY.md) - Guia de início rápido

---

✅ Agora você pode gerenciar seus produtos diretamente pelo terminal sem precisar acessar o Shopify Admin!

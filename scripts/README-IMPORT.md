# Importação de Produtos para Nova Loja Shopify

Este guia explica como usar o script `import-to-new-shopify.js` para importar todos os produtos da loja antiga para a nova loja Shopify.

## Pré-requisitos

1. **Admin API Access Token** da nova loja Shopify
   - Acesse: Admin → Settings → Apps and sales channels → Develop apps
   - Crie um novo app ou use um existente
   - Em "Configuration", ative estas permissões:
     - `write_products`
     - `read_products`
     - `write_product_listings`
     - `read_product_listings`
   - Copie o **Admin API access token**

2. **Storefront API Access Token** (já fornecido)
   - Token: `5324393493a2dd3e024c5f593058fdc2`

3. **Domínio da nova loja**
   - Formato: `sua-loja.myshopify.com`

## Configuração

### 1. Editar o arquivo `.env.local`

Abra o arquivo `.env.local` na raiz do projeto e preencha:

```env
# Nova Loja
NEW_SHOPIFY_STORE_DOMAIN=sua-loja.myshopify.com
NEW_SHOPIFY_STOREFRONT_ACCESS_TOKEN=5324393493a2dd3e024c5f593058fdc2
NEW_SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_xxxxxxxxxxxxx
```

Substitua:
- `sua-loja.myshopify.com` pelo domínio da nova loja
- `shpat_xxxxxxxxxxxxx` pelo Admin Access Token

### 2. Instalar dependências

```bash
npm install
```

## Como Usar

### Executar o script

```bash
node scripts/import-to-new-shopify.js
```

### O que o script faz

1. **Busca todos os produtos** da loja antiga usando Storefront API
2. **Mostra um resumo** dos produtos encontrados
3. **Aguarda 5 segundos** para você cancelar (Ctrl+C) se necessário
4. **Cria cada produto** na nova loja usando Admin API
5. **Gera um relatório** em JSON com o resultado da importação

### Dados importados

Para cada produto, o script importa:

- ✅ Título
- ✅ Handle (slug/URL)
- ✅ Descrição (HTML)
- ✅ Tipo de produto
- ✅ Vendor/Fabricante
- ✅ Tags
- ✅ Imagens (até 20 por produto)
- ✅ Opções (Size, Color, etc)
- ✅ Variantes com:
  - Preço
  - Preço comparativo (de/por)
  - SKU
  - Opções selecionadas

## Exemplo de Saída

```
🔧 Configuração:
  Loja Antiga: djjrjm-0p.myshopify.com
  Nova Loja: sua-loja.myshopify.com

📥 Buscando produtos da loja antiga...
  ✓ Buscados 50 produtos...
  ✓ Buscados 100 produtos...
✅ Total de produtos encontrados: 150

📝 Resumo dos produtos:
  Total: 150
  Com imagens: 148
  Com variantes: 145

⚠️  Tem certeza que deseja importar todos os produtos?
   Pressione Ctrl+C para cancelar ou aguarde 5 segundos...

📤 Criando produtos na nova loja...

[1/150] Processando: Nike Air Jordan 1 Retro High
  ✅ Produto criado: Nike Air Jordan 1 Retro High

[2/150] Processando: Adidas Yeezy Boost 350
  ✅ Produto criado: Adidas Yeezy Boost 350

...

============================================================
✅ IMPORTAÇÃO CONCLUÍDA!
============================================================
📊 Total de produtos: 150
✅ Sucesso: 148
❌ Erros: 2
📄 Relatório salvo em: import-report-1234567890.json
============================================================
```

## Relatório de Importação

O script gera um arquivo JSON com detalhes da importação:

```json
{
  "timestamp": "2025-01-15T10:30:00.000Z",
  "oldStore": "djjrjm-0p.myshopify.com",
  "newStore": "sua-loja.myshopify.com",
  "total": 150,
  "success": 148,
  "errors": 2,
  "results": [
    {
      "success": true,
      "product": "Nike Air Jordan 1 Retro High",
      "newProduct": { "id": "gid://shopify/Product/..." }
    },
    {
      "success": false,
      "product": "Produto com Erro",
      "errors": [...]
    }
  ]
}
```

## Limitações e Observações

- ⚠️ **Rate Limiting**: O script aguarda 500ms entre cada produto para evitar ultrapassar limites da API
- ⚠️ **Duplicação**: Se executar o script novamente, produtos serão duplicados (Shopify não verifica duplicatas automaticamente)
- ⚠️ **Estoque**: O script **NÃO** importa quantidades de estoque (precisa ser configurado manualmente)
- ⚠️ **Metafields**: Metafields personalizados não são importados
- ⚠️ **Coleções**: Produtos não são adicionados a coleções automaticamente

## Solução de Problemas

### Erro: "NEW_SHOPIFY_STORE_DOMAIN não configurado"

Verifique se você editou corretamente o arquivo `.env.local`.

### Erro: "Admin API Error: Unauthorized"

Verifique se:
1. O Admin Access Token está correto
2. As permissões do app incluem `write_products`

### Erro: "Rate limit exceeded"

Aumente o tempo de espera no código (linha com `await wait(500)`).

### Produtos duplicados

Se executou o script múltiplas vezes, você pode deletar produtos duplicados manualmente no Admin da Shopify.

## Próximos Passos

Após a importação:

1. ✅ Verificar produtos no Admin da nova loja
2. ✅ Configurar estoque manualmente
3. ✅ Adicionar produtos às coleções
4. ✅ Verificar preços e preços comparativos
5. ✅ Testar checkout e carrinho

## Suporte

Se encontrar problemas, verifique:
- Logs do console para erros específicos
- Relatório JSON gerado
- Documentação da Shopify Admin API

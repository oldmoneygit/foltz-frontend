# 🧪 Teste de Importação Shopify - 5 Produtos

Este guia te ajuda a fazer um teste de importação com apenas 5 produtos antes de importar todos.

---

## ✅ O que foi gerado:

**Arquivo:** `shopify-products-TEST.csv`

**Produtos incluídos (5):**
1. Bayern 07-08 Home (5 variantes: S, M, L, XL, XXL)
2. Bayern Munich 14-15 Home (5 variantes: S, M, L, XL, XXL)
3. Bayern Munich 17-18 Home (5 variantes: S, M, L, XL, XXL)
4. Bayern Munich 25-26 Away (7 variantes: S, M, L, XL, XXL, 3XL, 4XL)
5. Bayern Munich 25-26 Home (7 variantes: S, M, L, XL, XXL, 3XL, 4XL)

**Total de variantes:** 29 linhas no CSV

**Imagens:** ✅ Cada produto tem a imagem principal (001.jpg) incluída

---

## 📋 Passo a Passo - Importação na Shopify

### 1. Acessar Shopify Admin

```
https://sua-loja.myshopify.com/admin
```

Faça login na sua conta Shopify.

---

### 2. Ir para Produtos > Import

1. No menu lateral esquerdo, clique em **Products**
2. No canto superior direito, clique em **Import**
3. Você verá a tela de importação

---

### 3. Fazer Upload do CSV de Teste

1. Clique em **Add file** ou arraste o arquivo
2. Selecione o arquivo: `shopify-products-TEST.csv`
3. **IMPORTANTE**: Selecione estas opções:
   - ✅ **Upload images from your computer** (para importar as imagens locais)
   - ✅ **Overwrite existing products** (se você já tiver produtos com mesmo handle)

---

### 4. Iniciar Importação

1. Clique em **Upload and continue**
2. A Shopify vai processar o arquivo
3. Você verá um preview dos produtos que serão importados
4. Clique em **Import products**

---

### 5. Aguardar Processamento

- A importação pode levar **2-5 minutos** para 5 produtos
- Você receberá uma notificação quando terminar
- Pode fechar a janela e continuar trabalhando

---

### 6. Verificar Produtos Importados

1. Vá em **Products** no menu lateral
2. Você deve ver os 5 produtos da Bundesliga:
   - Bayern 07-08 Home
   - Bayern Munich 14-15 Home
   - Bayern Munich 17-18 Home
   - Bayern Munich 25-26 Away
   - Bayern Munich 25-26 Home

3. **Clique em um produto** para verificar:
   - ✅ Título correto
   - ✅ Imagem principal aparecendo
   - ✅ Preço: ARS 82.713,38
   - ✅ Preço comparativo: ARS 115.798,73
   - ✅ Variantes de tamanho corretas
   - ✅ Descrição HTML formatada
   - ✅ Tags: Alemanha, Bundesliga, Jersey, Futebol, COMPRA 1 LLEVA 2

---

## ✅ Checklist de Verificação

Após a importação, verifique:

- [ ] Os 5 produtos foram criados com sucesso
- [ ] Cada produto tem a imagem principal aparecendo
- [ ] Os preços estão corretos (82.713,38 e 115.798,73)
- [ ] As variantes de tamanho estão corretas
- [ ] A descrição está formatada (com bullet points)
- [ ] As tags foram importadas
- [ ] O tipo de produto está como "Bundesliga"
- [ ] O vendor está como "Foltz Fanwear"

---

## 🎯 Próximos Passos

### Se o teste funcionou ✅

**Opção A - Importar todos os produtos (recomendado):**
```bash
npm run generate-csv
```

Isso vai gerar `shopify-products-import.csv` com **TODOS os ~270 produtos**.

Depois, repita o processo de importação na Shopify com o arquivo completo.

**Opção B - Importar mais algumas ligas específicas:**

Se quiser testar com produtos específicos antes de importar tudo, me avise que eu crio um script customizado.

---

### Se o teste teve problemas ❌

**Problema 1: Imagens não apareceram**

**Causa possível:**
- Shopify não conseguiu fazer upload das imagens locais
- Caminho da imagem está incorreto

**Solução:**
1. Verificar se as imagens existem em `Leagues/Albums belong to Bundesliga/`
2. Tentar importar novamente com opção "Upload images from your computer" marcada
3. Se não funcionar, podemos usar outro método (upload via API depois)

---

**Problema 2: Produtos não foram criados**

**Causa possível:**
- Erro no formato do CSV
- Problema com caracteres especiais

**Solução:**
1. Verificar mensagem de erro na Shopify
2. Abrir `shopify-products-TEST.csv` e verificar se está bem formatado
3. Me avisar o erro que apareceu

---

**Problema 3: Preços estão errados**

**Causa possível:**
- Formato de moeda diferente (vírgula vs ponto)

**Solução:**
- Posso ajustar o script para usar vírgula: `82.713,38` em vez de `82713.38`

---

## 📸 Como as Imagens Funcionam

### No CSV de Teste:

Cada produto tem a **imagem principal** incluída:
```
Image Src: C:\Users\PC\Desktop\Foltz\Leagues\Albums belong to Bundesliga\Bayern 07-08 Home (Size S-XXL)\001.jpg
```

### Depois da Importação:

A Shopify faz upload da imagem para o CDN deles:
```
https://cdn.shopify.com/s/files/1/[sua-loja]/products/bayern-07-08-home-001.jpg
```

### Outras Imagens (002.jpg, 003.jpg, etc.):

**Método 1 - Manual:**
- Entre em cada produto no Shopify Admin
- Adicione as outras imagens manualmente

**Método 2 - Automatizado (recomendado):**
- Depois que a importação funcionar, vou criar um script que faz upload automático das outras imagens via API
- Comando: `npm run upload-all-images`

---

## 💡 Dicas

1. **Fazer backup antes:**
   - Se já tem produtos na Shopify, exporte eles antes
   - Products > Export > Download CSV

2. **Teste em ambiente Staging:**
   - Se tiver uma loja de testes, faça lá primeiro

3. **Deletar produtos de teste:**
   - Depois de verificar, você pode deletar os 5 produtos de teste
   - Ou deixar e importar os outros produtos normalmente

---

## 📞 Precisa de Ajuda?

Se algo der errado ou tiver dúvidas:

1. **Tire print do erro** que apareceu na Shopify
2. **Me mostre** e eu te ajudo a resolver
3. Podemos ajustar o script conforme necessário

---

✅ **Boa sorte com o teste! Me avisa como foi!** 🚀

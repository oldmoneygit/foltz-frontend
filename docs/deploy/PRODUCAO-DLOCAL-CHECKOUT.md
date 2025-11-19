# Guia de Deploy - dlocal Go Checkout em Produção

## ✅ Pré-requisitos

Antes de ativar o checkout dlocal Go em produção, certifique-se de que:

- [ ] Sistema testado em ambiente de desenvolvimento
- [ ] Webhooks configurados e testados
- [ ] Meta Pixel validado no Facebook Events Manager
- [ ] Shopify Admin API configurada corretamente
- [ ] Credenciais dlocal de **PRODUÇÃO** obtidas

---

## 🔧 1. Variáveis de Ambiente (Vercel)

Acesse o painel da Vercel → Settings → Environment Variables e atualize:

### **Variáveis que DEVEM ser atualizadas:**

```env
# Base URL do site (PRODUÇÃO)
NEXT_PUBLIC_BASE_URL=https://foltzoficial.com

# dlocal - Credenciais de PRODUÇÃO
DLOCAL_API_KEY=sua_api_key_producao_aqui
DLOCAL_X_LOGIN=seu_x_login_producao_aqui
DLOCAL_SECRET_KEY=sua_secret_key_producao_aqui

# dlocal - URL do Webhook (PRODUÇÃO)
DLOCAL_WEBHOOK_URL=https://foltzoficial.com/api/dlocal/webhook

# Meta Pixel - ID de PRODUÇÃO
NEXT_PUBLIC_META_PIXEL_ID=seu_pixel_id_producao

# Meta Conversions API - Token de PRODUÇÃO
META_CONVERSIONS_API_TOKEN=seu_token_producao_aqui

# Feature Flag - ATIVAR em produção
NEXT_PUBLIC_ENABLE_DLOCAL_CHECKOUT=true
```

### **Variáveis que podem permanecer iguais:**

```env
# Shopify (mesmas credenciais dev/prod)
SHOPIFY_STORE_DOMAIN=foltz.myshopify.com
SHOPIFY_ACCESS_TOKEN=shpat_xxxxx
SHOPIFY_STOREFRONT_ACCESS_TOKEN=xxxxx

# Firebase (mesmas credenciais dev/prod)
NEXT_PUBLIC_FIREBASE_API_KEY=xxxxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxxxx
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxxxx
```

⚠️ **IMPORTANTE**: Após atualizar as variáveis, faça **Redeploy** no Vercel.

---

## 🔗 2. Configurar Webhook no Dashboard dlocal

1. Acesse: https://merchant.dlocal.com/settings/webhooks
2. Crie um novo webhook:
   - **URL**: `https://foltzoficial.com/api/dlocal/webhook`
   - **Eventos**: Selecione `PAID`, `CANCELLED`, `REJECTED`, `PENDING`
   - **Método**: `POST`
   - **Formato**: `JSON`
3. Copie a **Webhook Secret Key** e adicione como variável de ambiente:
   ```env
   DLOCAL_WEBHOOK_SECRET=webhook_secret_key_aqui
   ```
4. Salve e teste o webhook enviando um evento de teste

---

## 📊 3. Validar Meta Pixel

1. Acesse: https://business.facebook.com/events_manager
2. Selecione seu Pixel de Produção
3. Verifique os eventos:
   - **PageView** - Deve aparecer em todas as páginas
   - **ViewContent** - Páginas de produto
   - **AddToCart** - Ao adicionar ao carrinho
   - **InitiateCheckout** - Ao clicar no botão azul
   - **AddPaymentInfo** - Ao selecionar método de envio
   - **Purchase** - Após pagamento confirmado

4. Verifique **Advanced Matching**:
   - Em Events Manager → Data Sources → seu Pixel → Settings
   - Confirme que está recebendo: `em`, `fn`, `ln`, `ph`, `ct`, `st`, `zp`

5. Verifique **Conversions API**:
   - Em Events Manager → Overview → Event Match Quality
   - Deve mostrar eventos duplicados com `event_id` matching

---

## 🛒 4. Testar Fluxo Completo em Produção

### **Teste 1: Pack Foltz (4 camisas)**

1. Adicione 4 camisas diferentes ao carrinho
2. Verifique que o desconto foi aplicado:
   - Subtotal original: ~AR$ 147,600
   - **Total com desconto: AR$ 59,900**
3. Clique em "Pagar com tarjeta, transferencia o efectivo"
4. Preencha dados de envio e selecione método
5. Clique em "Ir para o pagamento"
6. Complete o pagamento com cartão de teste dlocal:
   - **Cartão**: 4111 1111 1111 1111
   - **CVV**: 123
   - **Validade**: Qualquer data futura
7. Aguarde redirecionamento para `/success`
8. Verifique no Shopify Admin:
   - Pedido criado corretamente
   - **Preços com desconto aplicado** (~AR$ 14,975 por item)
   - `note_attributes` com todos os parâmetros de tracking (40+)
   - Tags: `dlocal_go`, `pack_foltz`

### **Teste 2: Compra Normal (sem Pack)**

1. Adicione 1 ou 2 camisas ao carrinho
2. Verifique que **não há desconto Pack**
3. Complete o fluxo de checkout
4. Verifique no Shopify:
   - Preços normais (AR$ 36,900 por item)
   - `note_attributes` corretos
   - Tag: `dlocal_go` (sem `pack_foltz`)

### **Teste 3: Meta Pixel Events**

1. Abra Facebook Events Manager → Test Events
2. Navegue pelo site e execute ações:
   - Visualizar produto
   - Adicionar ao carrinho
   - Iniciar checkout
   - Selecionar método de envio
   - Completar pagamento
3. Verifique que TODOS os eventos aparecem em tempo real
4. Confirme que `event_id` está presente (deduplicação)

---

## 📋 5. Checklist Pós-Deploy

Após o deploy, verifique:

- [ ] Variáveis de ambiente atualizadas no Vercel
- [ ] Redeploy realizado com sucesso
- [ ] Webhook configurado no dlocal dashboard
- [ ] Teste de pagamento completo realizado
- [ ] Pedido criado corretamente no Shopify
- [ ] Preços com desconto aplicados corretamente
- [ ] Meta Pixel rastreando todos os eventos
- [ ] Conversions API enviando eventos duplicados
- [ ] Advanced Matching funcionando (Event Match Quality > 6.0)
- [ ] Todos os `note_attributes` salvos no Shopify (40+ parâmetros)
- [ ] Emails de confirmação sendo enviados
- [ ] Página `/success` funcionando corretamente

---

## 🔍 6. Monitoramento

### **Logs do Sistema**

Monitore os logs no Vercel:
```bash
vercel logs foltz-production --follow
```

Procure por:
- `[DLOCAL-BTN]` - Logs do botão de checkout
- `[SHOPIFY-ADMIN]` - Logs de criação de pedidos
- `[WEBHOOK]` - Logs de webhooks recebidos

### **Shopify Admin**

1. Acesse: https://foltz.myshopify.com/admin/orders
2. Filtre por tag `dlocal_go`
3. Verifique os pedidos:
   - Preços corretos
   - `note_attributes` completos
   - Status do pagamento

### **Meta Events Manager**

1. Acesse: https://business.facebook.com/events_manager
2. Monitore eventos em tempo real
3. Verifique Event Match Quality (deve ser > 6.0)
4. Analise funil de conversão:
   - PageView → ViewContent → AddToCart → InitiateCheckout → Purchase

---

## 🚨 7. Troubleshooting

### **Problema: Webhook não está sendo recebido**

**Solução**:
1. Verifique se o URL está correto: `https://foltzoficial.com/api/dlocal/webhook`
2. Verifique se a variável `DLOCAL_WEBHOOK_SECRET` está configurada
3. Teste manualmente com cURL:
   ```bash
   curl -X POST https://foltzoficial.com/api/dlocal/webhook \
     -H "Content-Type: application/json" \
     -d '{"event_type": "PAID", "payment_id": "test-123"}'
   ```
4. Verifique logs no Vercel

### **Problema: Preços errados no Shopify**

**Solução**:
1. Verifique se o `totalArs` está correto no console do navegador
2. Verifique logs `[DLOCAL-BTN] 💰 Price calculation`
3. Confirme que `discountRatio` está sendo aplicado
4. Verifique se o último item está sendo ajustado corretamente

### **Problema: Meta Pixel não rastreia eventos**

**Solução**:
1. Verifique se `NEXT_PUBLIC_META_PIXEL_ID` está correto
2. Abra DevTools → Console e procure por erros do `fbq`
3. Instale extensão "Facebook Pixel Helper" no Chrome
4. Verifique se o script do Pixel está carregando em `_document.js`

### **Problema: Advanced Matching não funciona**

**Solução**:
1. Verifique se os dados do usuário estão sendo hasheados corretamente
2. Abra DevTools → Network → Filtre por `fbevents`
3. Verifique o payload do evento, deve conter: `em`, `fn`, `ln`, `ph`
4. Verifique Event Match Quality no Events Manager

---

## 📈 8. Métricas de Sucesso

Após 1 semana em produção, analise:

1. **Conversão**:
   - Taxa de conversão do checkout dlocal vs Shopify
   - Ticket médio de cada método

2. **Meta Ads**:
   - ROAS (Return on Ad Spend)
   - CPA (Cost Per Acquisition)
   - Event Match Quality Score

3. **Shopify**:
   - Volume de pedidos dlocal vs Shopify
   - Taxa de abandono de carrinho
   - Pedidos com Pack Foltz

4. **Tracking**:
   - Número de pedidos com UTM parameters
   - Origens de tráfego (Facebook, Google, etc.)
   - Parâmetros mais comuns em `note_attributes`

---

## ✅ Próximos Passos

1. **Ativar feature flag**: `NEXT_PUBLIC_ENABLE_DLOCAL_CHECKOUT=true`
2. **Fazer redeploy** no Vercel
3. **Testar fluxo completo** em produção
4. **Monitorar primeiros pedidos** de perto
5. **Ajustar campanhas do Meta Ads** com base nos dados de tracking
6. **Analisar métricas** após 1 semana

---

## 🎉 Sistema Pronto!

O checkout dlocal Go está 100% integrado com:
- ✅ Meta Pixel & Conversions API (tracking completo)
- ✅ Advanced Matching (melhor atribuição)
- ✅ 40+ parâmetros de tracking salvos no Shopify
- ✅ Desconto Pack Foltz aplicado corretamente
- ✅ Webhooks configurados
- ✅ Dual checkout (Shopify + dlocal)

**Boa sorte com o lançamento! 🚀**

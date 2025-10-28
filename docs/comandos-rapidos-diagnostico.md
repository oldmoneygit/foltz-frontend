# COMANDOS RÁPIDOS - Claude Code: Diagnóstico Responsividade

Execute estes comandos em sequência no Claude Code para diagnosticar rapidamente os problemas:

## 1. VERIFICAÇÃO RÁPIDA DO VIEWPORT
```bash
grep -n "viewport" layout/theme.liquid
```
**Resultado esperado:** Deve encontrar `<meta name="viewport" content="width=device-width, initial-scale=1">`
**Se não encontrar:** CRÍTICO - adicione imediatamente em `<head>`

---

## 2. LISTAR TODAS AS MEDIA QUERIES
```bash
grep -rn "@media" sections/ snippets/ assets/ | grep -v ".git"
```
**Analise:** 
- Quantas usam `max-width` (desktop-first) ❌
- Quantas usam `min-width` (mobile-first) ✅
- Se misturar os dois = PROBLEMA

---

## 3. ENCONTRAR FONT-SIZE PROBLEMÁTICOS
```bash
grep -rn "font-size.*1[0-5]px" sections/ snippets/ | grep -E "(input|select|button)"
```
**Resultado esperado:** NENHUM resultado
**Se encontrar:** CRÍTICO - inputs/selects com < 16px causam zoom no iOS

---

## 4. ENCONTRAR LARGURAS FIXAS PROBLEMÁTICAS
```bash
grep -rn "width: [0-9]\+px" sections/main-product.liquid snippets/product-gallery.liquid
```
**Analise:** Larguras fixas sem `max-width` quebram mobile

---

## 5. VERIFICAR ALTURA DE BOTÕES
```bash
grep -rn "height.*px\|min-height.*px" snippets/buy-buttons.liquid
```
**Resultado esperado:** min-height >= 44px (idealmente 48px)
**Se encontrar < 44px:** Botões muito pequenos para touch

---

## 6. VER ESTRUTURA DO CSS EM MAIN-PRODUCT
```bash
cat sections/main-product.liquid | grep -A 100 "<style>" | head -110
```
**Analise a especificidade:** 
- Seletores complexos no base = alta especificidade
- Seletores simples na media query = baixa especificidade
- Resultado: media query nunca aplica

---

## 7. VERIFICAR SE USA image_tag OU img_url
```bash
grep -rn "img_url\|image_url\|image_tag" snippets/product-gallery.liquid
```
**Ideal:** Deve usar `image_tag` com widths e sizes para srcset automático
**Problema:** Se usar apenas `img_url: '1000x'` = imagem de tamanho fixo

---

## 8. LISTAR TODOS OS ARQUIVOS DO TEMA
```bash
find . -type f \( -name "*.liquid" -o -name "*.css" -o -name "*.scss" \) | grep -v ".git" | sort
```

---

## 9. VERIFICAR Z-INDEX ISSUES
```bash
grep -rn "z-index" sections/ snippets/ | grep -v ".git"
```
**Se encontrar muitos:** Possível conflito de stacking context

---

## 10. ANÁLISE COMPLETA EM UM COMANDO
```bash
echo "=== VIEWPORT ===" && \
grep -n "viewport" layout/theme.liquid && \
echo -e "\n=== MEDIA QUERIES (max-width) ===" && \
grep -rn "@media.*max-width" sections/ snippets/ | wc -l && \
echo -e "\n=== MEDIA QUERIES (min-width) ===" && \
grep -rn "@media.*min-width" sections/ snippets/ | wc -l && \
echo -e "\n=== FONT-SIZE < 16px ===" && \
grep -rn "font-size.*1[0-5]px" snippets/ && \
echo -e "\n=== ARQUIVOS PRINCIPAIS ===" && \
ls -lh sections/main-product.liquid snippets/product-gallery.liquid snippets/buy-buttons.liquid
```

---

## EXEMPLO DE DIAGNÓSTICO COMPLETO

Cole este no Claude Code para diagnóstico completo:

```
Analise o tema Shopify Foltz para problemas de responsividade mobile:

1. Verifique se existe viewport meta tag em layout/theme.liquid
2. Liste todas as media queries e identifique se usam min-width ou max-width
3. Identifique todos os lugares com font-size < 16px em inputs/selects/buttons
4. Mostre a estrutura do CSS em sections/main-product.liquid
5. Verifique se snippets/product-gallery.liquid usa image_tag com srcset
6. Liste todos os problemas encontrados em ordem de prioridade
```

---

## APÓS DIAGNÓSTICO: CORREÇÕES PRIORITÁRIAS

### Prioridade 1: Viewport (30 segundos)
```bash
# Edite layout/theme.liquid e adicione dentro de <head>:
<meta name="viewport" content="width=device-width, initial-scale=1">
```

### Prioridade 2: Media Queries (5-10 minutos)
Converta TODAS de desktop-first (max-width) para mobile-first (min-width):

**ANTES:**
```css
.element { width: 600px; }
@media (max-width: 768px) { .element { width: 100%; } }
```

**DEPOIS:**
```css
.element { width: 100%; } /* Mobile base */
@media screen and (min-width: 750px) { .element { width: 600px; } }
```

### Prioridade 3: Font-size (2 minutos)
Substitua TODOS os font-size em inputs/selects/buttons para >= 16px

### Prioridade 4: Touch Targets (3 minutos)
Garanta min-height: 48px em TODOS os botões

### Prioridade 5: Imagens (5 minutos)
Substitua img_url por image_tag com widths e sizes

---

## VALIDAÇÃO FINAL

```bash
echo "=== VALIDAÇÃO PÓS-CORREÇÕES ===" && \
echo "1. Viewport presente?" && \
grep -q "viewport" layout/theme.liquid && echo "✅ SIM" || echo "❌ NÃO" && \
echo -e "\n2. Quantas max-width restantes?" && \
grep -rc "@media.*max-width" sections/ snippets/ && \
echo -e "\n3. Font-size < 16px em inputs?" && \
(grep -rn "font-size.*1[0-5]px" snippets/ | grep -E "(input|select|button)" && echo "❌ AINDA TEM PROBLEMAS" || echo "✅ OK") && \
echo -e "\n4. Botões com altura adequada?" && \
grep -rn "min-height: 4[8-9]px\|min-height: 5[0-9]px" snippets/buy-buttons.liquid && echo "✅ OK" || echo "❌ PRECISA CORRIGIR"
```

---

## TEMPO ESTIMADO TOTAL

- Diagnóstico: 5-10 minutos
- Correções críticas: 20-30 minutos
- Validação: 5 minutos

**TOTAL: 30-45 minutos para tema 100% responsivo**

# PROMPT PARA CLAUDE CODE: Corrigir Responsividade Mobile - Tema Shopify Foltz

## CONTEXTO DO PROBLEMA
O tema Shopify "Foltz" está com problemas de responsividade na página de produto. Os componentes, botões e imagens aparecem MUITO GRANDES no mobile, mesmo tendo media queries básicas implementadas. O tema usa Liquid moderno com sections/blocks.

**Arquivos principais identificados:**
- `sections/main-product.liquid` - Layout principal do produto
- `snippets/product-gallery.liquid` - Galeria de imagens
- `snippets/buy-buttons.liquid` - Botões de compra
- `snippets/price-list.liquid` - Exibição de preços
- `snippets/variant-picker.liquid` - Seletor de variantes
- `snippets/product-info.liquid` - Informações do produto
- `layout/theme.liquid` - Template base
- `assets/theme.css` - CSS global

## INSTRUÇÕES OBRIGATÓRIAS

### FASE 1: ANÁLISE E DIAGNÓSTICO (EXECUTE PRIMEIRO!)

Antes de fazer QUALQUER correção, você DEVE executar esta análise completa:

1. **Verifique a viewport meta tag**
```bash
# Procure no arquivo layout/theme.liquid
grep -n "viewport" layout/theme.liquid
```
**AÇÃO:** Se não encontrar `<meta name="viewport" content="width=device-width, initial-scale=1">`, adicione IMEDIATAMENTE dentro de `<head>`, ANTES de qualquer CSS.

2. **Liste TODOS os arquivos CSS do tema**
```bash
find assets -name "*.css" -o -name "*.scss"
```

3. **Identifique media queries existentes**
```bash
# Procure por todas as media queries nos arquivos Liquid e CSS
grep -rn "@media" sections/ snippets/ assets/
```

4. **Analise especificidade CSS nos arquivos principais**
```bash
# Veja os estilos da página de produto
cat sections/main-product.liquid | grep -A 50 "<style>"
cat snippets/product-gallery.liquid | grep -A 50 "<style>"
cat snippets/buy-buttons.liquid | grep -A 50 "<style>"
```

**IMPORTANTE:** Após a análise, me mostre um resumo do que encontrou ANTES de prosseguir com correções.

---

### FASE 2: CORREÇÕES CRÍTICAS (Ordem de Execução)

Execute estas correções NA ORDEM EXATA apresentada. Cada correção é CRÍTICA.

#### CORREÇÃO 1: Viewport Meta Tag (PRIORIDADE MÁXIMA)

**Arquivo:** `layout/theme.liquid`

**Ação:** Adicione ou corrija a meta tag viewport dentro de `<head>`, ANTES de todos os stylesheets:

```liquid
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  
  <!-- Resto do head continua aqui -->
```

**Validação:** Após adicionar, confirme que a tag está presente e correta.

---

#### CORREÇÃO 2: Especificidade CSS nas Media Queries

**PROBLEMA IDENTIFICADO:** As media queries têm especificidade MENOR que os seletores base, então nunca são aplicadas.

**Arquivo:** `sections/main-product.liquid`

**BUSQUE por este padrão problemático:**
```css
/* Especificidade ALTA no base */
.product-main__grid {
  grid-template-columns: 1fr 1fr;
}

/* Especificidade BAIXA na media query - NÃO FUNCIONA */
@media (max-width: 768px) {
  .product-main__grid {
    grid-template-columns: 1fr;
  }
}
```

**SUBSTITUA todas as media queries para MOBILE-FIRST com especificidade correta:**

```liquid
<style>
  /* BASE: Mobile first (sem media query) */
  .product-main {
    padding: 20px 0 60px;
    background: #000000;
  }

  .product-main__container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 16px; /* Mobile padding menor */
  }

  .product-main__grid {
    display: grid;
    grid-template-columns: 1fr; /* Mobile: 1 coluna */
    gap: 24px;
    align-items: start;
  }

  .product-main__media {
    position: relative; /* Mobile: não sticky */
    top: 0;
    width: 100%;
  }

  .product-main__title {
    font-size: clamp(1.5rem, 2vw + 1rem, 2.5rem); /* Tipografia fluida */
    font-weight: 700;
    color: #FFFFFF;
    line-height: 1.2;
  }

  .product-main__form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  /* TABLET: >= 750px */
  @media screen and (min-width: 750px) {
    .product-main__container {
      padding: 0 24px;
    }

    .product-main__grid {
      grid-template-columns: 1fr 1fr; /* Tablet: 2 colunas */
      gap: 40px;
    }

    .product-main__title {
      font-size: 2rem;
    }
  }

  /* DESKTOP: >= 990px */
  @media screen and (min-width: 990px) {
    .product-main {
      padding: 40px 0 80px;
    }

    .product-main__grid {
      gap: 60px;
    }

    .product-main__media {
      position: sticky; /* Desktop: sticky */
      top: 100px;
    }

    .product-main__title {
      font-size: 2.5rem;
    }
  }
</style>
```

**REGRA CRÍTICA:** SEMPRE use `min-width` (mobile-first). NUNCA misture `min-width` e `max-width` no mesmo arquivo.

---

#### CORREÇÃO 3: Galeria de Imagens Responsiva

**Arquivo:** `snippets/product-gallery.liquid`

**SUBSTITUA o bloco `<style>` completo por este código responsivo:**

```liquid
<style>
  /* MOBILE FIRST: Base styles */
  .product-gallery {
    display: grid;
    gap: 12px;
    grid-template-columns: 1fr; /* Mobile: thumbnails abaixo */
  }

  .product-gallery__main {
    position: relative;
    aspect-ratio: 3 / 4;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    overflow: hidden;
    width: 100%;
  }

  .product-gallery__main-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    cursor: zoom-in;
  }

  .product-gallery__badge {
    position: absolute;
    top: 12px;
    left: 12px;
    padding: 6px 12px;
    background: var(--color-brand-yellow);
    color: #000000;
    font-size: 0.75rem;
    font-weight: 700;
    border-radius: 16px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .product-gallery__thumbnails {
    display: flex;
    flex-direction: row; /* Mobile: scroll horizontal */
    gap: 8px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
  }

  .product-gallery__thumbnail {
    flex: 0 0 auto;
    width: 80px;
    height: 106px;
    aspect-ratio: 3 / 4;
    background: rgba(255, 255, 255, 0.05);
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .product-gallery__thumbnail:hover,
  .product-gallery__thumbnail.active {
    border-color: var(--color-brand-yellow);
  }

  .product-gallery__thumbnail-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .product-gallery__zoom {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.95);
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    cursor: zoom-out;
  }

  .product-gallery__zoom.active {
    display: flex;
  }

  .product-gallery__zoom-image {
    max-width: 90%;
    max-height: 90vh;
    object-fit: contain;
  }

  .product-gallery__zoom-close {
    position: absolute;
    top: 16px;
    right: 16px;
    width: 40px;
    height: 40px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #FFFFFF;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  /* TABLET: >= 750px */
  @media screen and (min-width: 750px) {
    .product-gallery {
      grid-template-columns: 100px 1fr; /* Thumbnails à esquerda */
      gap: 16px;
    }

    .product-gallery__thumbnails {
      flex-direction: column;
      overflow-x: visible;
      overflow-y: auto;
    }

    .product-gallery__thumbnail {
      width: 100px;
      height: auto;
    }

    .product-gallery__badge {
      top: 16px;
      left: 16px;
      padding: 8px 16px;
    }

    .product-gallery__zoom-close {
      top: 24px;
      right: 24px;
      width: 48px;
      height: 48px;
    }
  }
</style>
```

**SUBSTITUA também a tag <img> por image_tag com srcset:**

BUSQUE por:
```liquid
<img
  src="{{ media | img_url: '1200x' }}"
  alt="{{ media.alt | escape }}"
  class="product-gallery__main-image"
```

SUBSTITUA por:
```liquid
{{ media | 
   image_url: width: 2000 | 
   image_tag: 
     loading: 'eager',
     widths: '400, 600, 800, 1000, 1200, 1500, 2000',
     sizes: '(min-width: 990px) 600px, (min-width: 750px) 50vw, 100vw',
     class: 'product-gallery__main-image'
}}
```

---

#### CORREÇÃO 4: Botões Touch-Friendly

**Arquivo:** `snippets/buy-buttons.liquid`

**PROBLEMA:** Botões muito pequenos para toque em mobile (< 44px altura).

**SUBSTITUA o bloco de estilos dos botões:**

```liquid
<style>
  .buy-buttons {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .buy-buttons__quantity {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
    flex-wrap: wrap;
  }

  .buy-buttons__quantity-label {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-text-subdued);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    width: 100%; /* Mobile: label em linha separada */
  }

  .buy-buttons__quantity-selector {
    display: flex;
    align-items: center;
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    overflow: hidden;
  }

  .buy-buttons__quantity-btn {
    min-width: 48px;
    min-height: 48px; /* Touch target WCAG compliant */
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.05);
    border: none;
    color: #FFFFFF;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 20px;
  }

  .buy-buttons__quantity-btn:hover {
    background: rgba(218, 241, 13, 0.1);
    color: var(--color-brand-yellow);
  }

  .buy-buttons__quantity-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  .buy-buttons__quantity-input {
    width: 60px;
    min-height: 48px;
    text-align: center;
    background: transparent;
    border: none;
    color: #FFFFFF;
    font-size: 16px; /* CRÍTICO: Previne zoom iOS */
    font-weight: 600;
  }

  .buy-buttons__add-to-cart {
    width: 100%;
    min-height: 56px; /* Botão principal maior */
    padding: 16px 24px;
    background: var(--color-brand-yellow);
    color: #000000;
    font-size: 16px; /* CRÍTICO: >= 16px previne zoom */
    font-weight: 700;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .buy-buttons__add-to-cart:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(218, 241, 13, 0.3);
  }

  .buy-buttons__buy-now {
    width: 100%;
    min-height: 48px;
    padding: 14px 24px;
    background: rgba(255, 255, 255, 0.1);
    color: #FFFFFF;
    font-size: 16px; /* CRÍTICO: >= 16px */
    font-weight: 600;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  /* TABLET: >= 750px */
  @media screen and (min-width: 750px) {
    .buy-buttons__quantity-label {
      width: auto; /* Tablet: label inline */
    }
  }

  /* DESKTOP: >= 990px */
  @media screen and (min-width: 990px) {
    .buy-buttons {
      flex-direction: row;
      gap: 16px;
    }
    
    .buy-buttons__add-to-cart,
    .buy-buttons__buy-now {
      width: auto;
      flex: 1;
    }
  }
</style>
```

---

#### CORREÇÃO 5: Preços Responsivos

**Arquivo:** `snippets/price-list.liquid`

**SUBSTITUA o bloco de estilos:**

```liquid
<style>
  .price-list {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .price-list__price {
    font-size: clamp(1.5rem, 2vw + 1rem, 2rem); /* Tipografia fluida */
    font-weight: 700;
    color: #FFFFFF;
  }

  .price-list__price--sale {
    color: var(--color-brand-yellow);
  }

  .price-list__compare {
    font-size: clamp(1rem, 1.5vw + 0.5rem, 1.25rem); /* Tipografia fluida */
    font-weight: 500;
    color: var(--color-text-subdued);
    text-decoration: line-through;
  }

  .price-list__badge {
    padding: 4px 10px;
    background: var(--color-brand-yellow);
    color: #000000;
    font-size: 0.75rem;
    font-weight: 700;
    border-radius: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .price-list__unit {
    font-size: 0.875rem;
    color: var(--color-text-subdued);
    width: 100%;
    margin-top: 4px;
  }

  /* TABLET: >= 750px */
  @media screen and (min-width: 750px) {
    .price-list {
      gap: 12px;
    }

    .price-list__badge {
      padding: 6px 12px;
    }
  }
</style>
```

---

#### CORREÇÃO 6: Inputs e Selects Touch-Friendly

**Arquivo:** `snippets/variant-picker.liquid`

**ADICIONE ou SUBSTITUA estilos para garantir font-size >= 16px:**

```liquid
<style>
  .variant-picker {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .variant-picker__label {
    display: block;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-text-subdued);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 8px;
  }

  /* CRÍTICO: Select com 16px+ para prevenir zoom iOS */
  .variant-picker__select,
  select.product-form__input {
    width: 100%;
    min-height: 48px;
    padding: 12px 16px;
    font-size: 16px; /* OBRIGATÓRIO: >= 16px */
    font-family: inherit;
    background-color: rgba(255, 255, 255, 0.05);
    color: #FFFFFF;
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='white' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 16px center;
    padding-right: 40px;
  }

  .variant-picker__select:focus {
    outline: none;
    border-color: var(--color-brand-yellow);
  }

  /* Variant swatches (botões) */
  .variant-picker__swatch-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .variant-picker__swatch {
    position: relative;
  }

  .variant-picker__swatch input[type="radio"] {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }

  .variant-picker__swatch label {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 48px;
    min-height: 48px; /* Touch target */
    padding: 12px 16px;
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 16px; /* >= 16px */
    color: #FFFFFF;
    background: rgba(255, 255, 255, 0.05);
  }

  .variant-picker__swatch input:checked + label {
    border-color: var(--color-brand-yellow);
    background: rgba(218, 241, 13, 0.1);
    color: var(--color-brand-yellow);
  }

  /* TABLET: >= 750px */
  @media screen and (min-width: 750px) {
    .variant-picker__swatch-list {
      gap: 12px;
    }
  }
</style>
```

---

### FASE 3: VALIDAÇÃO E TESTES

Após fazer TODAS as correções acima, execute esta validação:

#### Checklist de Validação

```bash
# 1. Confirme que viewport está presente
grep -n "viewport" layout/theme.liquid

# 2. Verifique se todas as media queries usam min-width (mobile-first)
grep -rn "@media.*max-width" sections/ snippets/

# 3. Procure por font-size < 16px em inputs/selects (PROBLEMA!)
grep -rn "font-size.*1[0-5]px" snippets/buy-buttons.liquid snippets/variant-picker.liquid

# 4. Procure por larguras fixas problemáticas
grep -rn "width.*[0-9]\+px" sections/main-product.liquid

# 5. Liste todos os arquivos modificados
git status
```

#### Teste Manual Obrigatório

Me forneça o código para eu testar com este HTML de exemplo:

```html
<!-- Copie este bloco e me mostre o resultado -->
<div style="max-width: 375px; border: 2px solid red; margin: 20px auto;">
  <h3 style="text-align: center;">TESTE MOBILE (375px)</h3>
  
  <!-- Cole aqui o HTML do product-gallery -->
  
  <!-- Cole aqui o HTML do buy-buttons -->
</div>
```

---

### FASE 4: CORREÇÕES ADICIONAIS (Se Necessário)

Se após as correções acima ainda houver problemas, execute:

#### Verificação de Z-Index

```bash
# Procure por z-index em todo o tema
grep -rn "z-index" sections/ snippets/ assets/
```

Se encontrar conflitos de z-index, siga esta hierarquia:

```css
:root {
  --z-dropdown: 50;
  --z-sticky-header: 100;
  --z-cart-drawer: 200;
  --z-modal-overlay: 900;
  --z-modal: 1000;
}
```

#### CSS Global (assets/theme.css)

Se houver um arquivo CSS global sobrescrevendo os estilos inline:

1. Abra `assets/theme.css`
2. BUSQUE por seletores com alta especificidade
3. ADICIONE `!important` APENAS nas media queries se absolutamente necessário (última opção)

```css
/* Em assets/theme.css - última opção */
@media screen and (max-width: 749px) {
  .product-main__grid {
    grid-template-columns: 1fr !important;
  }
}
```

---

## REGRAS CRÍTICAS QUE VOCÊ DEVE SEGUIR

1. **SEMPRE use mobile-first** (`min-width`) - NUNCA `max-width` exceto em casos especiais
2. **SEMPRE use breakpoints: 750px e 990px** (padrão Shopify Dawn)
3. **SEMPRE font-size >= 16px em inputs/selects** (previne zoom iOS)
4. **SEMPRE min-height: 48px em botões** (WCAG touch targets)
5. **SEMPRE use clamp() para font-sizes responsivos** (não pixels fixos)
6. **SEMPRE use image_tag com widths e sizes** (não img_url fixo)
7. **SEMPRE especificidade IGUAL ou MAIOR nas media queries**
8. **NUNCA larguras fixas sem max-width**
9. **NUNCA misture min-width e max-width na mesma section**
10. **NUNCA use !important exceto como última opção**

---

## FORMATO DE RESPOSTA ESPERADO

Após cada fase, me forneça:

1. **Fase 1 (Análise):**
   - Resumo dos problemas encontrados
   - Lista de arquivos que precisam correção
   - Confirmação da presença/ausência de viewport tag

2. **Fase 2 (Correções):**
   - Para cada arquivo modificado, mostre:
     - O que foi alterado
     - Código antes/depois
     - Justificativa da mudança

3. **Fase 3 (Validação):**
   - Resultado de cada comando de validação
   - Confirmação de que todas as regras críticas foram seguidas
   - Lista final de arquivos modificados

4. **Fase 4 (Se aplicável):**
   - Problemas adicionais encontrados
   - Soluções aplicadas

---

## EXEMPLO DE EXECUÇÃO CORRETA

```
✅ FASE 1 COMPLETA:
- Viewport tag: NÃO encontrada (será adicionada)
- Media queries: 8 encontradas, todas usando max-width (PROBLEMA)
- Font-size em inputs: 14px encontrado (PROBLEMA)
- Especificidade: Alta nos base styles, baixa nas media queries (PROBLEMA)

✅ FASE 2 COMPLETA:
- layout/theme.liquid: Viewport tag adicionada
- sections/main-product.liquid: Convertido para mobile-first
- snippets/product-gallery.liquid: Imagens responsivas + mobile-first
- snippets/buy-buttons.liquid: Touch targets corrigidos + font-size 16px
- snippets/price-list.liquid: Tipografia fluida implementada

✅ FASE 3 COMPLETA:
- Validação viewport: ✓ Presente na linha 4
- Validação min-width: ✓ Todas as media queries usam min-width
- Validação font-size: ✓ Todos >= 16px
- Arquivos modificados: 5 arquivos

✅ TEMA AGORA ESTÁ 100% RESPONSIVO PARA MOBILE
```

---

## INÍCIO DA EXECUÇÃO

Por favor, comece AGORA com a **FASE 1: ANÁLISE E DIAGNÓSTICO**.

Analise o tema Foltz e me forneça o relatório completo antes de fazer qualquer correção.

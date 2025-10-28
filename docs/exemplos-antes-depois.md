# EXEMPLOS ANTES/DEPOIS - Correções de Responsividade

Este arquivo mostra exatamente o que está ERRADO e como deve ficar CORRETO.

---

## EXEMPLO 1: MAIN-PRODUCT.LIQUID

### ❌ ANTES (PROBLEMA)

```liquid
<style>
  .product-main__container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 24px;
  }

  .product-main__grid {
    display: grid;
    grid-template-columns: 1fr 1fr; /* Desktop por padrão */
    gap: 60px;
    align-items: start;
  }

  .product-main__media {
    position: sticky;
    top: 100px;
  }

  .product-main__title {
    font-size: 2.5rem; /* Muito grande pra mobile */
    font-weight: 700;
    color: #FFFFFF;
    line-height: 1.2;
  }

  /* Media query com especificidade BAIXA - NÃO FUNCIONA */
  @media (max-width: 768px) {
    .product-main__grid {
      grid-template-columns: 1fr;
      gap: 40px;
    }

    .product-main__media {
      position: relative;
      top: 0;
    }

    .product-main__title {
      font-size: 1.75rem; /* Nunca aplicado */
    }
  }
</style>
```

**PROBLEMAS:**
1. ❌ Desktop-first (grid 2 colunas por padrão)
2. ❌ `max-width: 768px` nunca ativa se não tem viewport tag
3. ❌ Sticky position no mobile desperdiça recursos
4. ❌ Font-size fixo não escala suavemente
5. ❌ Especificidade baixa na media query

---

### ✅ DEPOIS (CORRETO)

```liquid
<style>
  /* MOBILE FIRST: Estilos base são para mobile */
  .product-main__container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 16px; /* Mobile: padding menor */
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
    font-size: clamp(1.5rem, 2vw + 1rem, 2.5rem); /* Fluido */
    font-weight: 700;
    color: #FFFFFF;
    line-height: 1.2;
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
  }

  /* DESKTOP: >= 990px */
  @media screen and (min-width: 990px) {
    .product-main__grid {
      gap: 60px;
    }

    .product-main__media {
      position: sticky; /* Desktop: sticky ativo */
      top: 100px;
    }
  }
</style>
```

**CORREÇÕES:**
1. ✅ Mobile-first (1 coluna por padrão)
2. ✅ `min-width` com breakpoints Shopify (750px, 990px)
3. ✅ Sticky só no desktop
4. ✅ clamp() para tipografia fluida
5. ✅ Mesma especificidade em todas as regras

---

## EXEMPLO 2: PRODUCT-GALLERY.LIQUID

### ❌ ANTES (PROBLEMA)

```liquid
<style>
  .product-gallery {
    display: grid;
    gap: 16px;
  }

  .product-gallery--thumbnails-left {
    grid-template-columns: 100px 1fr; /* Desktop layout por padrão */
  }

  .product-gallery__thumbnails {
    display: flex;
    flex-direction: column; /* Desktop por padrão */
    gap: 12px;
  }

  @media (max-width: 768px) {
    .product-gallery--thumbnails-left {
      grid-template-columns: 1fr; /* Nunca aplica */
    }

    .product-gallery__thumbnails {
      flex-direction: row;
      overflow-x: auto;
    }
  }
</style>

<!-- Imagem com tamanho fixo -->
<img
  src="{{ media | img_url: '1200x' }}"
  alt="{{ media.alt | escape }}"
  class="product-gallery__main-image"
  loading="lazy"
>
```

**PROBLEMAS:**
1. ❌ Layout desktop por padrão
2. ❌ Thumbnails verticais no mobile (ruim pra touch)
3. ❌ Imagem de tamanho fixo (1200x) - não responsiva
4. ❌ Sem srcset - carrega imagem grande no mobile

---

### ✅ DEPOIS (CORRETO)

```liquid
<style>
  /* MOBILE FIRST */
  .product-gallery {
    display: grid;
    gap: 12px;
    grid-template-columns: 1fr; /* Mobile: thumbnails abaixo */
  }

  .product-gallery__thumbnails {
    display: flex;
    flex-direction: row; /* Mobile: scroll horizontal */
    gap: 8px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .product-gallery__thumbnail {
    flex: 0 0 auto;
    width: 80px; /* Touch-friendly size */
    height: 106px;
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
    }

    .product-gallery__thumbnail {
      width: 100px;
      height: auto;
    }
  }
</style>

<!-- Imagem responsiva com srcset automático -->
{{ media | 
   image_url: width: 2000 | 
   image_tag: 
     loading: 'lazy',
     widths: '400, 600, 800, 1000, 1200, 1500, 2000',
     sizes: '(min-width: 990px) 600px, (min-width: 750px) 50vw, 100vw',
     class: 'product-gallery__main-image'
}}
```

**CORREÇÕES:**
1. ✅ Mobile-first: scroll horizontal de thumbnails
2. ✅ Thumbnails grandes o suficiente para touch (80px)
3. ✅ `image_tag` com srcset automático
4. ✅ Browser escolhe tamanho certo via `sizes`

---

## EXEMPLO 3: BUY-BUTTONS.LIQUID

### ❌ ANTES (PROBLEMA)

```liquid
<style>
  .buy-buttons__add-to-cart {
    width: 100%;
    padding: 16px 32px;
    background: var(--color-brand-yellow);
    color: #000000;
    font-size: 1rem; /* 16px ok, mas... */
    font-weight: 700;
    border: none;
    border-radius: 8px;
    cursor: pointer;
  }

  .buy-buttons__quantity-btn {
    width: 40px;
    height: 40px; /* MUITO PEQUENO - < 44px mínimo WCAG */
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.05);
    border: none;
    color: #FFFFFF;
  }

  .buy-buttons__quantity-input {
    width: 60px;
    height: 40px;
    text-align: center;
    background: transparent;
    border: none;
    color: #FFFFFF;
    font-size: 1rem;
    font-weight: 600;
  }
</style>
```

**PROBLEMAS:**
1. ❌ Botões de quantidade muito pequenos (40px)
2. ❌ Sem min-height especificado
3. ❌ Não tem especificação explícita de 16px

---

### ✅ DEPOIS (CORRETO)

```liquid
<style>
  .buy-buttons__add-to-cart {
    width: 100%;
    min-height: 56px; /* Touch-friendly, acima do mínimo */
    padding: 16px 24px;
    background: var(--color-brand-yellow);
    color: #000000;
    font-size: 16px; /* EXPLÍCITO: previne zoom iOS */
    font-weight: 700;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .buy-buttons__quantity-btn {
    min-width: 48px; /* WCAG Level AA compliant */
    min-height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.05);
    border: none;
    color: #FFFFFF;
    font-size: 20px; /* Ícone maior */
  }

  .buy-buttons__quantity-input {
    width: 60px;
    min-height: 48px;
    text-align: center;
    background: transparent;
    border: none;
    color: #FFFFFF;
    font-size: 16px; /* EXPLÍCITO: >= 16px obrigatório */
    font-weight: 600;
  }

  /* DESKTOP: >= 990px */
  @media screen and (min-width: 990px) {
    .buy-buttons {
      flex-direction: row;
    }
    
    .buy-buttons__add-to-cart {
      width: auto;
      flex: 1;
    }
  }
</style>
```

**CORREÇÕES:**
1. ✅ min-height: 48px (WCAG compliant)
2. ✅ font-size: 16px explícito
3. ✅ min-width também especificado
4. ✅ Botão maior no mobile (56px)

---

## EXEMPLO 4: VARIANT-PICKER.LIQUID

### ❌ ANTES (PROBLEMA)

```liquid
<select name="id" id="ProductSelect-{{ section.id }}" 
        class="product-form__input">
  {% for variant in product.variants %}
    <option value="{{ variant.id }}">{{ variant.title }}</option>
  {% endfor %}
</select>

<style>
  .product-form__input {
    width: 100%;
    padding: 10px 15px; /* Padding pequeno */
    font-size: 14px; /* PROBLEMA: < 16px causa zoom iOS */
    border: 1px solid #ddd;
    border-radius: 4px;
  }
</style>
```

**PROBLEMA CRÍTICO:**
1. ❌ font-size: 14px - **causa zoom automático no iOS Safari**
2. ❌ Altura insuficiente para touch
3. ❌ Padding pequeno

---

### ✅ DEPOIS (CORRETO)

```liquid
<select name="id" id="ProductSelect-{{ section.id }}" 
        class="product-form__input">
  {% for variant in product.variants %}
    <option value="{{ variant.id }}">{{ variant.title }}</option>
  {% endfor %}
</select>

<style>
  .product-form__input {
    width: 100%;
    min-height: 48px;
    padding: 12px 16px;
    font-size: 16px; /* CRÍTICO: >= 16px previne zoom iOS */
    font-family: inherit;
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    background-color: rgba(255, 255, 255, 0.05);
    color: #FFFFFF;
    cursor: pointer;
  }

  .product-form__input:focus {
    outline: none;
    border-color: var(--color-brand-yellow);
  }
</style>
```

**CORREÇÕES:**
1. ✅ font-size: 16px - **NUNCA menos que isso**
2. ✅ min-height: 48px - touch-friendly
3. ✅ Padding confortável

---

## EXEMPLO 5: PRICE-LIST.LIQUID

### ❌ ANTES (PROBLEMA)

```liquid
<style>
  .price-list__price {
    font-size: 2rem; /* Fixo - muito grande no mobile */
    font-weight: 700;
    color: #FFFFFF;
  }

  .price-list__compare {
    font-size: 1.25rem; /* Fixo */
    font-weight: 500;
    color: var(--color-text-subdued);
    text-decoration: line-through;
  }

  @media (max-width: 768px) {
    .price-list__price {
      font-size: 1.5rem; /* Salto brusco, não fluido */
    }

    .price-list__compare {
      font-size: 1rem;
    }
  }
</style>
```

**PROBLEMAS:**
1. ❌ Font-size fixo não escala suavemente
2. ❌ Saltos bruscos nos breakpoints
3. ❌ Não aproveita espaço entre 768px e 2rem

---

### ✅ DEPOIS (CORRETO)

```liquid
<style>
  .price-list__price {
    /* Escala suavemente de 1.5rem (mobile) a 2rem (desktop) */
    font-size: clamp(1.5rem, 2vw + 1rem, 2rem);
    font-weight: 700;
    color: #FFFFFF;
  }

  .price-list__price--sale {
    color: var(--color-brand-yellow);
  }

  .price-list__compare {
    /* Escala suavemente de 1rem (mobile) a 1.25rem (desktop) */
    font-size: clamp(1rem, 1.5vw + 0.5rem, 1.25rem);
    font-weight: 500;
    color: var(--color-text-subdued);
    text-decoration: line-through;
  }

  /* Sem media queries necessárias para font-size - clamp() faz tudo */
  
  /* Apenas para espaçamento diferente */
  @media screen and (min-width: 750px) {
    .price-list {
      gap: 12px; /* Mais espaço em telas maiores */
    }
  }
</style>
```

**CORREÇÕES:**
1. ✅ clamp() para escalamento fluido
2. ✅ Adapta a QUALQUER tamanho de tela
3. ✅ Usuário pode dar zoom sem problemas
4. ✅ Menos media queries = código mais limpo

**Como funciona clamp():**
```css
font-size: clamp(MIN, PREFERIDO, MAX);
/* clamp(1.5rem, 2vw + 1rem, 2rem) */
/* MIN: 1.5rem (24px) - tamanho mínimo */
/* PREFERIDO: 2vw + 1rem - cresce com viewport */
/* MAX: 2rem (32px) - tamanho máximo */
```

---

## EXEMPLO 6: THEME.LIQUID (CRÍTICO)

### ❌ ANTES (PROBLEMA)

```liquid
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>{{ shop.name }}</title>
  
  <!-- FALTANDO VIEWPORT TAG - TUDO QUEBRA SEM ISSO -->
  
  {{ 'theme.css' | asset_url | stylesheet_tag }}
</head>
```

**PROBLEMA CRÍTICO:**
- ❌ **SEM VIEWPORT TAG = MOBILE QUEBRADO**
- Mobile renderiza em 980px virtual
- Media queries NUNCA ativam
- Zoom forçado

---

### ✅ DEPOIS (CORRETO)

```liquid
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  
  <!-- CRÍTICO: Viewport ANTES de qualquer CSS -->
  <meta name="viewport" content="width=device-width, initial-scale=1">
  
  <title>{{ shop.name }}</title>
  
  {{ 'theme.css' | asset_url | stylesheet_tag }}
</head>
```

**CORREÇÃO:**
- ✅ Viewport tag presente
- ✅ Antes de todos os CSS
- ✅ width=device-width (adapta à tela)
- ✅ initial-scale=1 (sem zoom inicial)

---

## CHECKLIST RÁPIDO: O QUE VERIFICAR

### ✅ ESSENCIAIS
- [ ] Viewport tag em `layout/theme.liquid`
- [ ] Todas media queries usando `min-width` (mobile-first)
- [ ] Breakpoints: 750px e 990px (padrão Shopify)
- [ ] Font-size >= 16px em TODOS inputs/selects
- [ ] min-height: 48px em TODOS botões
- [ ] image_tag com widths e sizes (não img_url fixo)
- [ ] clamp() para font-sizes responsivos

### ✅ OPCIONAL MAS RECOMENDADO
- [ ] CSS custom properties para cores/spacing
- [ ] Transições suaves (0.2s - 0.3s)
- [ ] :focus states visíveis
- [ ] Hover states apenas desktop (evitar no mobile)

---

## TESTE FINAL

Cole isto em `sections/main-product.liquid` TEMPORARIAMENTE para testar:

```liquid
<!-- TESTE RESPONSIVIDADE - REMOVER DEPOIS -->
<div style="position: fixed; bottom: 0; left: 0; background: red; color: white; padding: 10px; z-index: 99999; font-size: 12px;">
  <script>
    document.write('Largura: ' + window.innerWidth + 'px');
  </script>
</div>
```

**Teste em mobile real:**
- iPhone: deve mostrar ~375px
- Se mostrar 980px = viewport tag faltando
- Se mostrar 375px mas layout grande = media queries não aplicando

---

## RESUMO: TRANSFORMAÇÃO

### ANTES:
- ❌ Desktop-first quebra mobile
- ❌ Sem viewport = tudo em 980px
- ❌ Font-size < 16px = zoom forçado
- ❌ Botões pequenos = difícil tocar
- ❌ Imagens fixas = lento no mobile
- ❌ Especificidade baixa = media queries ignoradas

### DEPOIS:
- ✅ Mobile-first escala bem
- ✅ Viewport correto = tamanho real
- ✅ Font-size 16px+ = sem zoom forçado
- ✅ Botões 48px = fácil tocar
- ✅ Imagens com srcset = rápido
- ✅ Especificidade igual = media queries aplicam

**RESULTADO: Tema 100% responsivo em 30-45 minutos** ✨

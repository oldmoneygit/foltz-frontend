# CHEAT SHEET: Responsividade Shopify - 1 Página

## 🚨 PROBLEMAS MAIS COMUNS (99% dos casos)

1. **SEM VIEWPORT TAG** → Mobile renderiza em 980px virtual
2. **ESPECIFICIDADE CSS BAIXA** → Media queries nunca aplicam  
3. **FONT-SIZE < 16px** → iOS faz zoom automático
4. **DESKTOP-FIRST** → Código base para desktop quebra mobile

---

## ✅ CORREÇÃO RÁPIDA (5 PASSOS)

### 1️⃣ VIEWPORT TAG (30 segundos)
```liquid
<!-- layout/theme.liquid, DENTRO de <head>, ANTES de CSS -->
<meta name="viewport" content="width=device-width, initial-scale=1">
```

### 2️⃣ MOBILE-FIRST (Padrão correto)
```css
/* ✅ CORRETO: Mobile primeiro */
.element { width: 100%; }                            /* Mobile base */
@media (min-width: 750px) { .element { width: 50%; } }  /* Tablet+ */
@media (min-width: 990px) { .element { width: 33%; } }  /* Desktop+ */

/* ❌ ERRADO: Desktop primeiro */
.element { width: 33%; }                             /* Desktop base */
@media (max-width: 768px) { .element { width: 100%; } } /* Nunca aplica */
```

### 3️⃣ ESPECIFICIDADE IGUAL
```css
/* ❌ ERRADO: Especificidade diferente */
.wrapper .product button { padding: 20px; }          /* Especificidade: 21 */
@media (min-width: 750px) {
  button { padding: 10px; }                          /* Especificidade: 1 - PERDE */
}

/* ✅ CORRETO: Especificidade igual */
.wrapper .product button { padding: 20px; }          /* Especificidade: 21 */
@media (min-width: 750px) {
  .wrapper .product button { padding: 10px; }        /* Especificidade: 21 - GANHA */
}
```

### 4️⃣ FONT-SIZE >= 16px (OBRIGATÓRIO)
```css
/* ❌ ERRADO: Causa zoom iOS */
input, select, button { font-size: 14px; }

/* ✅ CORRETO: Sem zoom */
input, select, button { font-size: 16px; }
```

### 5️⃣ TOUCH TARGETS 48px
```css
/* ❌ ERRADO: Muito pequeno */
button { height: 30px; }

/* ✅ CORRETO: Touch-friendly */
button { min-height: 48px; }
```

---

## 📐 BREAKPOINTS SHOPIFY (SEMPRE USAR)

```css
/* Mobile: < 750px */
/* Base styles sem media query */

/* Tablet: >= 750px */
@media screen and (min-width: 750px) { }

/* Desktop: >= 990px */
@media screen and (min-width: 990px) { }
```

**NUNCA use:** 768px, 1024px, 1200px (não são padrão Shopify)

---

## 🖼️ IMAGENS RESPONSIVAS

```liquid
<!-- ❌ ERRADO: Tamanho fixo -->
<img src="{{ product.image | img_url: '1000x' }}">

<!-- ✅ CORRETO: Srcset automático -->
{{ product.image | 
   image_url: width: 2000 | 
   image_tag: 
     widths: '400,600,800,1000,1200,1500,2000',
     sizes: '(min-width: 990px) 600px, (min-width: 750px) 50vw, 100vw'
}}
```

---

## 📝 TIPOGRAFIA FLUIDA

```css
/* ❌ ERRADO: Pixels fixos */
h1 { font-size: 48px; }
@media (max-width: 768px) { h1 { font-size: 24px; } }

/* ✅ CORRETO: clamp() fluido */
h1 { font-size: clamp(1.5rem, 2vw + 1rem, 3rem); }
/* MIN: 1.5rem (24px), MAX: 3rem (48px), FLUIDO entre eles */
```

---

## 🎯 GRID RESPONSIVO

```css
/* ❌ ERRADO: Colunas fixas */
.grid { 
  display: grid;
  grid-template-columns: 1fr 1fr;
}
@media (max-width: 768px) {
  .grid { grid-template-columns: 1fr; }
}

/* ✅ CORRETO: Mobile-first */
.grid { 
  display: grid;
  grid-template-columns: 1fr;          /* Mobile: 1 col */
  gap: 1rem;
}
@media (min-width: 750px) {
  .grid { 
    grid-template-columns: 1fr 1fr;    /* Tablet: 2 cols */
    gap: 2rem;
  }
}
@media (min-width: 990px) {
  .grid { 
    grid-template-columns: repeat(4, 1fr); /* Desktop: 4 cols */
  }
}
```

---

## 🔍 DIAGNÓSTICO RÁPIDO

```bash
# 1. Tem viewport?
grep "viewport" layout/theme.liquid

# 2. Usa max-width (ruim)?
grep -r "@media.*max-width" sections/ snippets/

# 3. Tem font-size < 16px?
grep -r "font-size.*1[0-5]px" snippets/

# 4. Botões muito pequenos?
grep -r "height.*[0-3][0-9]px" snippets/buy-buttons.liquid
```

---

## ⚡ TEMPLATE COMPLETO: SECTION RESPONSIVA

```liquid
<!-- sections/exemplo.liquid -->
<section class="my-section">
  <div class="my-section__container">
    <h2 class="my-section__title">{{ section.settings.title }}</h2>
    <div class="my-section__grid">
      <!-- Conteúdo -->
    </div>
  </div>
</section>

{% schema %}
{
  "name": "Exemplo",
  "settings": [
    { "type": "text", "id": "title", "label": "Title" }
  ]
}
{% endschema %}

{% stylesheet %}
  /* MOBILE BASE */
  .my-section {
    padding: 2rem 1rem;
  }

  .my-section__container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .my-section__title {
    font-size: clamp(1.5rem, 2vw + 1rem, 2.5rem);
    margin-bottom: 1.5rem;
  }

  .my-section__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  /* TABLET: >= 750px */
  @media screen and (min-width: 750px) {
    .my-section {
      padding: 3rem 2rem;
    }

    .my-section__grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 2rem;
    }
  }

  /* DESKTOP: >= 990px */
  @media screen and (min-width: 990px) {
    .my-section {
      padding: 4rem 2rem;
    }

    .my-section__grid {
      grid-template-columns: repeat(3, 1fr);
      gap: 3rem;
    }
  }
{% endstylesheet %}
```

---

## 🚀 ORDEM DE EXECUÇÃO

1. ✅ Adicionar viewport tag
2. ✅ Converter max-width → min-width  
3. ✅ Igualar especificidade nas media queries
4. ✅ Corrigir font-size < 16px
5. ✅ Ajustar min-height botões (48px)
6. ✅ Trocar img_url → image_tag
7. ✅ Implementar clamp() em font-sizes
8. ✅ Testar em mobile real

**TEMPO TOTAL: 30-45 minutos**

---

## 🎨 CSS CUSTOM PROPERTIES (RECOMENDADO)

```css
:root {
  --spacing-xs: 0.5rem;
  --spacing-sm: 1rem;
  --spacing-md: 1.5rem;
  --spacing-lg: 2rem;
  --spacing-xl: 3rem;
  
  --font-size-sm: clamp(0.875rem, 1vw, 1rem);
  --font-size-base: clamp(1rem, 1.2vw, 1.125rem);
  --font-size-lg: clamp(1.25rem, 1.5vw, 1.5rem);
  --font-size-xl: clamp(1.5rem, 2vw, 2rem);
  
  --border-radius: 8px;
  --transition: all 0.3s ease;
}

.element {
  padding: var(--spacing-md);
  font-size: var(--font-size-base);
  border-radius: var(--border-radius);
  transition: var(--transition);
}
```

---

## 🐛 PROBLEMAS ESPECÍFICOS

### Problema: Botão de compra quebrado no iPhone
**Causa:** font-size < 16px  
**Solução:** `font-size: 16px;`

### Problema: Layout em 2 colunas no mobile
**Causa:** Desktop-first (grid 2 colunas base)  
**Solução:** `grid-template-columns: 1fr;` base + media query para 2 colunas

### Problema: Media query não aplica
**Causa:** Especificidade baixa  
**Solução:** Copiar seletor completo da regra base para dentro da media query

### Problema: Imagem enorme no mobile
**Causa:** `img_url: '1000x'` fixo  
**Solução:** `image_tag` com widths e sizes

### Problema: Texto muito grande no mobile
**Causa:** font-size fixo em pixels  
**Solução:** `clamp(1rem, 2vw, 2rem)`

---

## 📱 TESTE FINAL

1. **iPhone SE (320px)** - menor comum
2. **iPhone 12 (390px)** - mais popular
3. **iPad (768px)** - tablet
4. **Desktop (1366px)** - laptop comum

**Checklist:**
- [ ] Sem scroll horizontal
- [ ] Botões fáceis de tocar
- [ ] Inputs não causam zoom
- [ ] Imagens carregam rápido
- [ ] Layout adaptado para cada tamanho

---

## 💾 SALVAR ESTE CHEAT SHEET

Mantenha este arquivo aberto enquanto corrige o tema. Consulte sempre que tiver dúvida!

**Boa sorte! 🚀**

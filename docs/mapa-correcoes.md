# 🗺️ MAPA DE CORREÇÕES - Estrutura do Tema Foltz

Este arquivo mostra EXATAMENTE onde cada correção deve ser aplicada no tema.

---

## 📁 ESTRUTURA DO TEMA

```
shopify-theme-foltz/
├── layout/
│   └── theme.liquid          ← 🔴 CORREÇÃO #1: Viewport Tag
│
├── sections/
│   ├── main-product.liquid   ← 🔴 CORREÇÃO #2: Layout Responsivo
│   ├── header.liquid
│   ├── footer.liquid
│   └── ...
│
├── snippets/
│   ├── product-gallery.liquid  ← 🔴 CORREÇÃO #3: Imagens Responsivas
│   ├── buy-buttons.liquid      ← 🔴 CORREÇÃO #4: Botões Touch-Friendly
│   ├── price-list.liquid       ← 🔴 CORREÇÃO #5: Preços Fluidos
│   ├── variant-picker.liquid   ← 🔴 CORREÇÃO #6: Inputs >= 16px
│   ├── product-info.liquid
│   └── ...
│
├── assets/
│   ├── theme.css              ← ⚠️ Verificar conflitos
│   └── ...
│
└── config/
    └── settings_schema.json
```

---

## 🎯 CORREÇÃO #1: VIEWPORT TAG

### 📍 ARQUIVO: `layout/theme.liquid`

### 📌 LOCALIZAÇÃO EXATA:
```liquid
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  
  ⬇️ ADICIONAR AQUI (linha ~5-7) ⬇️
  
  <title>{{ shop.name }}</title>
```

### ✅ CÓDIGO A ADICIONAR:
```liquid
  <meta name="viewport" content="width=device-width, initial-scale=1">
```

### 🎯 PRIORIDADE: **CRÍTICA** ⭐⭐⭐⭐⭐
**Sem isso, NADA funciona no mobile!**

---

## 🎯 CORREÇÃO #2: LAYOUT RESPONSIVO

### 📍 ARQUIVO: `sections/main-product.liquid`

### 📌 LOCALIZAÇÃO EXATA:
```liquid
<!-- Procure pelo bloco <style> no início do arquivo -->
<style>
  .product-main {
    padding: 40px 0 80px;  ← Mudar aqui
    background: #000000;
  }

  .product-main__grid {
    display: grid;
    grid-template-columns: 1fr 1fr;  ← Mudar aqui
    gap: 60px;
  }

  .product-main__title {
    font-size: 2.5rem;  ← Mudar aqui
    ...
  }
```

### ✅ SUBSTITUIR TODO O <style> POR:
```liquid
<style>
  /* MOBILE BASE */
  .product-main {
    padding: 20px 0 60px;
    background: #000000;
  }

  .product-main__container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 16px;
  }

  .product-main__grid {
    display: grid;
    grid-template-columns: 1fr;  /* Mobile: 1 coluna */
    gap: 24px;
    align-items: start;
  }

  .product-main__media {
    position: relative;
    top: 0;
    width: 100%;
  }

  .product-main__title {
    font-size: clamp(1.5rem, 2vw + 1rem, 2.5rem);
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
      grid-template-columns: 1fr 1fr;
      gap: 40px;
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
      position: sticky;
      top: 100px;
    }
  }
</style>
```

### 🎯 PRIORIDADE: **ALTA** ⭐⭐⭐⭐

---

## 🎯 CORREÇÃO #3: IMAGENS RESPONSIVAS

### 📍 ARQUIVO: `snippets/product-gallery.liquid`

### 📌 LOCALIZAÇÃO EXATA - PARTE 1 (CSS):
```liquid
<style>
  .product-gallery {
    display: grid;
    gap: 16px;
  }

  .product-gallery--thumbnails-left {
    grid-template-columns: 100px 1fr;  ← Mudar
  }

  .product-gallery__thumbnails {
    display: flex;
    flex-direction: column;  ← Mudar
    gap: 12px;
  }
```

### ✅ SUBSTITUIR CSS POR:
```liquid
<style>
  /* MOBILE BASE */
  .product-gallery {
    display: grid;
    gap: 12px;
    grid-template-columns: 1fr;
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

  .product-gallery__thumbnails {
    display: flex;
    flex-direction: row;  /* Mobile: horizontal */
    gap: 8px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .product-gallery__thumbnail {
    flex: 0 0 auto;
    width: 80px;
    height: 106px;
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    cursor: pointer;
  }

  /* TABLET: >= 750px */
  @media screen and (min-width: 750px) {
    .product-gallery {
      grid-template-columns: 100px 1fr;
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
```

### 📌 LOCALIZAÇÃO EXATA - PARTE 2 (HTML):
```liquid
<!-- Procure por esta linha no HTML -->
<img
  src="{{ media | img_url: '1200x' }}"  ← Substituir esta linha
  alt="{{ media.alt | escape }}"
  class="product-gallery__main-image"
  loading="eager"
>
```

### ✅ SUBSTITUIR TAG <img> POR:
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

### 🎯 PRIORIDADE: **ALTA** ⭐⭐⭐⭐

---

## 🎯 CORREÇÃO #4: BOTÕES TOUCH-FRIENDLY

### 📍 ARQUIVO: `snippets/buy-buttons.liquid`

### 📌 LOCALIZAÇÃO EXATA:
```liquid
<style>
  .buy-buttons__quantity-btn {
    width: 40px;   ← Mudar
    height: 40px;  ← Mudar
    ...
  }

  .buy-buttons__add-to-cart {
    width: 100%;
    padding: 16px 32px;
    font-size: 1rem;  ← Especificar explicitamente
    ...
  }

  .buy-buttons__quantity-input {
    width: 60px;
    height: 40px;      ← Mudar
    font-size: 1rem;   ← Especificar
    ...
  }
</style>
```

### ✅ CORRIGIR PARA:
```liquid
<style>
  .buy-buttons__quantity-btn {
    min-width: 48px;   /* WCAG compliant */
    min-height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.05);
    border: none;
    color: #FFFFFF;
    cursor: pointer;
    font-size: 20px;
  }

  .buy-buttons__add-to-cart {
    width: 100%;
    min-height: 56px;
    padding: 16px 24px;
    background: var(--color-brand-yellow);
    color: #000000;
    font-size: 16px;  /* EXPLÍCITO: >= 16px */
    font-weight: 700;
    border: none;
    border-radius: 8px;
    cursor: pointer;
  }

  .buy-buttons__quantity-input {
    width: 60px;
    min-height: 48px;
    text-align: center;
    background: transparent;
    border: none;
    color: #FFFFFF;
    font-size: 16px;  /* EXPLÍCITO: >= 16px */
    font-weight: 600;
  }
</style>
```

### 🎯 PRIORIDADE: **CRÍTICA** ⭐⭐⭐⭐⭐

---

## 🎯 CORREÇÃO #5: PREÇOS FLUIDOS

### 📍 ARQUIVO: `snippets/price-list.liquid`

### 📌 LOCALIZAÇÃO EXATA:
```liquid
<style>
  .price-list__price {
    font-size: 2rem;  ← Mudar para clamp()
    font-weight: 700;
    color: #FFFFFF;
  }

  .price-list__compare {
    font-size: 1.25rem;  ← Mudar para clamp()
    font-weight: 500;
    ...
  }

  @media (max-width: 768px) {  ← Remover ou converter
    .price-list__price {
      font-size: 1.5rem;
    }
    ...
  }
</style>
```

### ✅ SUBSTITUIR POR:
```liquid
<style>
  .price-list {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .price-list__price {
    font-size: clamp(1.5rem, 2vw + 1rem, 2rem);
    font-weight: 700;
    color: #FFFFFF;
  }

  .price-list__price--sale {
    color: var(--color-brand-yellow);
  }

  .price-list__compare {
    font-size: clamp(1rem, 1.5vw + 0.5rem, 1.25rem);
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
  }

  @media screen and (min-width: 750px) {
    .price-list {
      gap: 12px;
    }
  }
</style>
```

### 🎯 PRIORIDADE: **MÉDIA** ⭐⭐⭐

---

## 🎯 CORREÇÃO #6: INPUTS >= 16PX

### 📍 ARQUIVO: `snippets/variant-picker.liquid`

### 📌 LOCALIZAÇÃO EXATA:
```liquid
<!-- Procure por selects ou inputs -->
<select ... class="product-form__input">
  ...
</select>

<style>
  .product-form__input {
    width: 100%;
    padding: 10px 15px;
    font-size: 14px;  ← PROBLEMA: < 16px
    ...
  }
</style>
```

### ✅ CORRIGIR PARA:
```liquid
<style>
  .variant-picker__select,
  .product-form__input {
    width: 100%;
    min-height: 48px;
    padding: 12px 16px;
    font-size: 16px;  /* CRÍTICO: >= 16px previne zoom iOS */
    font-family: inherit;
    background-color: rgba(255, 255, 255, 0.05);
    color: #FFFFFF;
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    cursor: pointer;
  }

  .variant-picker__select:focus,
  .product-form__input:focus {
    outline: none;
    border-color: var(--color-brand-yellow);
  }

  /* Variant buttons (tamanhos, cores) */
  .variant-picker__swatch label {
    min-width: 48px;
    min-height: 48px;
    padding: 12px 16px;
    font-size: 16px;  /* >= 16px */
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    cursor: pointer;
  }
</style>
```

### 🎯 PRIORIDADE: **CRÍTICA** ⭐⭐⭐⭐⭐

---

## ⚠️ VERIFICAÇÃO ADICIONAL: CSS GLOBAL

### 📍 ARQUIVO: `assets/theme.css`

### 🔍 O QUE VERIFICAR:

1. **Conflitos de especificidade**
```css
/* Se houver regras muito específicas tipo: */
.wrapper .container .product .button { }

/* Elas podem sobrescrever as media queries */
```

**AÇÃO:** Se encontrar, adicione `!important` nas media queries ou aumente especificidade.

2. **Media queries desktop-first**
```css
/* Se houver: */
@media (max-width: 768px) { }
```

**AÇÃO:** Converter para mobile-first ou remover se já corrigido nos sections/snippets.

---

## 📋 CHECKLIST DE CORREÇÕES

Use esta lista para garantir que aplicou todas as correções:

### CRÍTICAS (Fazer PRIMEIRO):
- [ ] ✅ Viewport tag em `layout/theme.liquid`
- [ ] ✅ Botões 48px+ em `snippets/buy-buttons.liquid`
- [ ] ✅ Inputs 16px+ em `snippets/variant-picker.liquid`

### ALTAS (Fazer em seguida):
- [ ] ✅ Layout mobile-first em `sections/main-product.liquid`
- [ ] ✅ Imagens responsivas em `snippets/product-gallery.liquid`

### MÉDIAS (Melhorias):
- [ ] ✅ Preços fluidos em `snippets/price-list.liquid`
- [ ] ✅ Verificar CSS global em `assets/theme.css`

---

## 🧪 TESTE RÁPIDO POR ARQUIVO

### Após corrigir `layout/theme.liquid`:
```bash
grep -n "viewport" layout/theme.liquid
# Deve mostrar a linha com viewport tag
```

### Após corrigir `sections/main-product.liquid`:
```bash
grep -n "min-width" sections/main-product.liquid
# Deve mostrar media queries mobile-first
```

### Após corrigir `snippets/buy-buttons.liquid`:
```bash
grep -n "min-height.*48px" snippets/buy-buttons.liquid
# Deve mostrar botões com altura adequada
```

### Após corrigir `snippets/variant-picker.liquid`:
```bash
grep -n "font-size.*16px" snippets/variant-picker.liquid
# Deve mostrar inputs com 16px+
```

### Após corrigir `snippets/product-gallery.liquid`:
```bash
grep -n "image_tag" snippets/product-gallery.liquid
# Deve mostrar uso de image_tag
```

---

## 🎯 ORDEM DE EXECUÇÃO RECOMENDADA

1. **CRÍTICO** → `layout/theme.liquid` (viewport)
2. **CRÍTICO** → `snippets/buy-buttons.liquid` (botões)
3. **CRÍTICO** → `snippets/variant-picker.liquid` (inputs)
4. **ALTO** → `sections/main-product.liquid` (layout)
5. **ALTO** → `snippets/product-gallery.liquid` (imagens)
6. **MÉDIO** → `snippets/price-list.liquid` (preços)
7. **VERIFICAR** → `assets/theme.css` (conflitos)

---

## ⏱️ TEMPO ESTIMADO POR CORREÇÃO

| Correção | Tempo | Dificuldade |
|----------|-------|-------------|
| #1 Viewport | 30s | ⭐ Fácil |
| #2 Layout | 5-10min | ⭐⭐⭐ Média |
| #3 Imagens | 5min | ⭐⭐ Fácil/Média |
| #4 Botões | 3min | ⭐⭐ Fácil/Média |
| #5 Preços | 2min | ⭐ Fácil |
| #6 Inputs | 3min | ⭐⭐ Fácil/Média |
| Verificação CSS | 5min | ⭐⭐⭐ Variável |

**TOTAL: 25-30 minutos**

---

## 🚀 PRÓXIMO PASSO

Agora que você sabe EXATAMENTE onde fazer cada correção:

1. Abra o Claude Code
2. Cole o prompt completo (`prompt-claude-code-responsividade.md`)
3. Use este mapa para revisar as correções que ele fizer
4. Execute `validacao-final.sh` ao terminar

**Boa sorte! 🎉**

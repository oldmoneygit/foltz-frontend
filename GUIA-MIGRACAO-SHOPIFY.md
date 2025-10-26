# 🚀 GUIA DE MIGRAÇÃO PARA SHOPIFY THEME

**Projeto:** Foltz Fanwear
**De:** Next.js + Shopify Storefront API
**Para:** Shopify Theme Customizado (Liquid)

---

## 📋 ÍNDICE

1. [Visão Geral](#visão-geral)
2. [Estrutura do Tema](#estrutura-do-tema)
3. [Conversão de Componentes](#conversão-de-componentes)
4. [Migração de Estilos](#migração-de-estilos)
5. [JavaScript](#javascript)
6. [Checklist Completo](#checklist-completo)

---

## 🎯 VISÃO GERAL

### Por que migrar?

| Aspecto | Next.js (Atual) | Shopify Theme (Destino) |
|---------|----------------|------------------------|
| **Hospedagem** | Vercel/Própria | Shopify (included) |
| **Custo** | $20-50/mês | $0 (Shopify plan only) |
| **Performance** | Excelente | Muito Bom |
| **Manutenção** | Alta (2 sistemas) | Baixa (1 sistema) |
| **Checkout** | Redirect Shopify | Nativo integrado |
| **Editor** | Code only | Visual + Code |

### Estratégia de Migração

**Abordagem:** Conversão incremental + preservação de design

1. **Fase 1:** Setup básico do tema
2. **Fase 2:** Conversão de layout (Header/Footer)
3. **Fase 3:** Home page
4. **Fase 4:** Páginas de produto
5. **Fase 5:** Carrinho
6. **Fase 6:** Páginas institucionais
7. **Fase 7:** Testes e otimizações

---

## 📁 ESTRUTURA DO TEMA

### Arquitetura Shopify Theme

```
foltz-theme/
├── assets/
│   ├── application.css          # Tailwind compilado
│   ├── application.js           # JavaScript principal
│   ├── swiper.min.js           # Biblioteca Swiper
│   └── images/                  # Imagens do tema
│
├── config/
│   ├── settings_schema.json    # Configurações do tema
│   └── settings_data.json      # Dados das configurações
│
├── layout/
│   ├── theme.liquid            # Layout principal
│   ├── password.liquid         # Página de senha
│   └── gift_card.liquid        # Gift card
│
├── locales/
│   ├── es.json                 # Traduções espanhol
│   └── pt-BR.json              # Traduções português
│
├── sections/
│   ├── header.liquid           # Header editável
│   ├── footer.liquid           # Footer editável
│   ├── hero.liquid             # Hero section
│   ├── best-sellers.liquid     # Best sellers carousel
│   ├── how-it-works.liquid     # Seção 2x1
│   ├── league-cards.liquid     # Cards de ligas
│   ├── collection-carousel.liquid  # Carrossel de coleção
│   ├── product-info.liquid     # Info do produto
│   ├── cart-items.liquid       # Items do carrinho
│   └── cart-summary.liquid     # Resumo do carrinho
│
├── snippets/
│   ├── product-card.liquid     # Card de produto
│   ├── cart-item.liquid        # Item do carrinho
│   ├── size-selector.liquid    # Seletor de tamanhos
│   ├── quantity-selector.liquid # Seletor de quantidade
│   ├── add-to-cart-toast.liquid # Toast notification
│   ├── icon-*.liquid           # Ícones SVG
│   └── meta-tags.liquid        # Meta tags SEO
│
└── templates/
    ├── index.json              # Home page
    ├── product.json            # Página de produto
    ├── collection.json         # Página de coleção
    ├── cart.json               # Página do carrinho
    ├── page.contact.json       # Contato
    ├── page.faq.json           # FAQ
    └── customers/              # Páginas de conta
```

---

## 🔄 CONVERSÃO DE COMPONENTES

### Header.jsx → header.liquid

**React Component:**
```jsx
// Header.jsx
const Header = () => {
  const { getItemCount } = useCart()
  const cartItemCount = getItemCount()

  return (
    <header className="bg-black text-white">
      <Link href="/carrinho">
        <ShoppingCart />
        {cartItemCount > 0 && <span>{cartItemCount}</span>}
      </Link>
    </header>
  )
}
```

**Liquid Template:**
```liquid
{% comment %} sections/header.liquid {% endcomment %}

<header class="bg-black text-white">
  <a href="{{ routes.cart_url }}">
    {% render 'icon-cart' %}
    {% if cart.item_count > 0 %}
      <span>{{ cart.item_count }}</span>
    {% endif %}
  </a>
</header>

{% schema %}
{
  "name": "Header",
  "settings": [
    {
      "type": "image_picker",
      "id": "logo",
      "label": "Logo"
    }
  ]
}
{% endschema %}
```

### ProductCard.jsx → product-card.liquid

**React Component:**
```jsx
// ProductCard.jsx
const ProductCard = ({ product }) => {
  const formattedPrice = formatPrice(product.price)

  return (
    <Link href={`/product/${product.slug}`}>
      <Image src={product.main_image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>{formattedPrice}</p>
    </Link>
  )
}
```

**Liquid Snippet:**
```liquid
{% comment %} snippets/product-card.liquid {% endcomment %}

<a href="{{ product.url }}" class="product-card">
  <img
    src="{{ product.featured_image | image_url: width: 400 }}"
    alt="{{ product.title }}"
    loading="lazy"
  >
  <h3>{{ product.title }}</h3>
  <p>{{ product.price | money }}</p>
</a>
```

### CartContext → Shopify Ajax Cart API

**React Context:**
```jsx
// CartContext.jsx
const addToCart = (product, size, quantity) => {
  // localStorage logic
  setCartItems([...cartItems, newItem])
}
```

**Shopify Ajax Cart:**
```javascript
// assets/cart.js
function addToCart(variantId, quantity) {
  fetch('/cart/add.js', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: [{ id: variantId, quantity: quantity }]
    })
  })
  .then(response => response.json())
  .then(data => {
    updateCartUI()
    showToast()
  })
}
```

---

## 🎨 MIGRAÇÃO DE ESTILOS

### Tailwind CSS → Shopify Theme CSS

#### Opção 1: Build Tailwind (RECOMENDADO)

**1. Instalar Tailwind no projeto do tema:**
```bash
npm init -y
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init
```

**2. Configurar tailwind.config.js:**
```javascript
module.exports = {
  content: [
    './layout/*.liquid',
    './sections/*.liquid',
    './snippets/*.liquid',
    './templates/**/*.liquid',
  ],
  theme: {
    extend: {
      colors: {
        'brand-yellow': '#DAF10D',
      }
    }
  }
}
```

**3. Criar src/application.css:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom styles */
.product-card {
  @apply bg-white/5 border border-white/10 rounded-xl;
}
```

**4. Build command:**
```bash
npx tailwindcss -i ./src/application.css -o ./assets/application.css --watch
```

#### Opção 2: Converter para CSS Vanilla

**Tailwind:**
```jsx
<div className="bg-black text-white p-4 rounded-lg">
```

**CSS Vanilla:**
```css
.card {
  background-color: #000;
  color: #fff;
  padding: 1rem;
  border-radius: 0.5rem;
}
```

```html
<div class="card">
```

### Classes Mais Usadas

| Tailwind | CSS Equivalente |
|----------|----------------|
| `bg-black` | `background-color: #000` |
| `text-white` | `color: #fff` |
| `p-4` | `padding: 1rem` |
| `rounded-lg` | `border-radius: 0.5rem` |
| `flex items-center` | `display: flex; align-items: center` |
| `hover:bg-brand-yellow` | `.class:hover { background: #DAF10D }` |

---

## 💻 JAVASCRIPT

### Framer Motion → CSS Animations + Vanilla JS

**React (Framer Motion):**
```jsx
<motion.div
  initial={{ opacity: 0, y: 50 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
```

**Liquid + CSS:**
```liquid
<div class="fade-in-up">
```

```css
.fade-in-up {
  animation: fadeInUp 0.5s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### React State → Alpine.js (RECOMENDADO)

**React:**
```jsx
const [selectedSize, setSelectedSize] = useState(null)

<button onClick={() => setSelectedSize('M')}>M</button>
```

**Alpine.js:**
```html
<div x-data="{ selectedSize: null }">
  <button @click="selectedSize = 'M'">M</button>
</div>
```

### Swiper (Mantém)

```liquid
<!-- Include Swiper CSS & JS -->
{{ 'swiper.min.css' | asset_url | stylesheet_tag }}
{{ 'swiper.min.js' | asset_url | script_tag }}

<div class="swiper">
  <div class="swiper-wrapper">
    {% for product in collection.products %}
      <div class="swiper-slide">
        {% render 'product-card', product: product %}
      </div>
    {% endfor %}
  </div>
</div>

<script>
  new Swiper('.swiper', {
    slidesPerView: 4,
    spaceBetween: 20,
    navigation: true
  })
</script>
```

---

## ✅ CHECKLIST COMPLETO

### Fase 1: Setup Inicial

- [ ] Criar repositório Git para tema
- [ ] Instalar Shopify CLI (`npm install -g @shopify/cli @shopify/theme`)
- [ ] Executar `shopify theme init`
- [ ] Configurar Tailwind CSS
- [ ] Setup de desenvolvimento local (`shopify theme dev`)

### Fase 2: Layout Base

- [ ] Converter `layout.jsx` → `layout/theme.liquid`
- [ ] Converter `Header.jsx` → `sections/header.liquid`
- [ ] Converter `Footer.jsx` → `sections/footer.liquid`
- [ ] Implementar PromotionalBanner
- [ ] Adicionar meta tags SEO
- [ ] Testar navegação entre páginas

### Fase 3: Home Page

- [ ] Converter `Hero.jsx` → `sections/hero.liquid`
- [ ] Converter `BestSellers` → `sections/best-sellers.liquid`
- [ ] Converter `HowItWorks.jsx` → `sections/how-it-works.liquid`
- [ ] Converter `LeagueCards` → `sections/league-cards.liquid`
- [ ] Converter `CollectionCarousel` → `sections/collection-carousel.liquid`
- [ ] Configurar home page em `templates/index.json`
- [ ] Testar seções editáveis no admin

### Fase 4: Produto

- [ ] Converter `ProductInfo.jsx` → `sections/product-info.liquid`
- [ ] Converter `SizeSelector.jsx` → `snippets/size-selector.liquid`
- [ ] Converter `QuantitySelector.jsx` → `snippets/quantity-selector.liquid`
- [ ] Implementar variantes de tamanho
- [ ] Converter `AddToCartToast.jsx` → `snippets/add-to-cart-toast.liquid`
- [ ] Implementar Shopify Ajax Cart
- [ ] Testar fluxo de adicionar ao carrinho

### Fase 5: Coleções (Ligas)

- [ ] Converter `liga/[slug]/page.jsx` → `templates/collection.json`
- [ ] Implementar filtros de produtos
- [ ] Adicionar paginação
- [ ] Criar metafields de coleção (country, emoji)
- [ ] Testar listagem de produtos

### Fase 6: Carrinho

- [ ] Converter `cart/CartItem.jsx` → `snippets/cart-item.liquid`
- [ ] Converter `cart/CartSummary.jsx` → `snippets/cart-summary.liquid`
- [ ] Converter `carrinho/page.jsx` → `templates/cart.json`
- [ ] Implementar atualização de quantidade
- [ ] Implementar remoção de items
- [ ] Calcular desconto 2x1
- [ ] Testar fluxo completo do carrinho

### Fase 7: Páginas Institucionais

- [ ] Converter `/contato` → `templates/page.contact.json`
- [ ] Converter `/faq` → `templates/page.faq.json`
- [ ] Converter outras páginas institucionais
- [ ] Implementar formulário de contato
- [ ] Testar envio de formulários

### Fase 8: Otimizações

- [ ] Minificar CSS e JS
- [ ] Otimizar imagens
- [ ] Implementar lazy loading
- [ ] Adicionar preload de fontes
- [ ] Configurar CDN Shopify
- [ ] Testar performance (Lighthouse)

### Fase 9: Configurações

- [ ] Criar `config/settings_schema.json`
- [ ] Adicionar configurações de cores
- [ ] Adicionar configurações de texto
- [ ] Adicionar configurações de imagens
- [ ] Testar editor no Shopify Admin

### Fase 10: Testes

- [ ] Testar em mobile
- [ ] Testar em tablet
- [ ] Testar em desktop
- [ ] Testar checkout flow
- [ ] Testar todos os formulários
- [ ] Testar navegação
- [ ] Verificar SEO
- [ ] Verificar acessibilidade

### Fase 11: Deploy

- [ ] Push para Shopify (`shopify theme push`)
- [ ] Ativar tema em produção
- [ ] Configurar redirects
- [ ] Monitorar erros
- [ ] Backup do tema anterior

---

## 🛠️ FERRAMENTAS NECESSÁRIAS

### Desenvolvimento
- ✅ Node.js 18+
- ✅ Shopify CLI
- ✅ Git
- ✅ VS Code + Shopify Liquid extension

### Libraries
- ✅ Tailwind CSS
- ✅ Alpine.js (para interatividade)
- ✅ Swiper.js (carrosséis)
- ⚠️ Framer Motion (remover, usar CSS)

### Shopify Apps
- ❌ Nenhum necessário (tudo nativo)

---

## 📚 RECURSOS

### Documentação
- [Shopify Theme Development](https://shopify.dev/themes)
- [Liquid Reference](https://shopify.dev/api/liquid)
- [Ajax Cart API](https://shopify.dev/api/ajax/reference/cart)
- [Shopify CLI](https://shopify.dev/themes/tools/cli)

### Exemplos
- [Dawn Theme](https://github.com/Shopify/dawn) - Tema oficial Shopify
- [Liquid Code Examples](https://shopify.dev/themes/architecture/templates)

---

## 💡 DICAS E MELHORES PRÁTICAS

### Performance
1. **Usar CDN Shopify para imagens**
   ```liquid
   {{ product.featured_image | image_url: width: 800 }}
   ```

2. **Lazy load de imagens**
   ```liquid
   <img loading="lazy" src="...">
   ```

3. **Defer JavaScript**
   ```liquid
   {{ 'application.js' | asset_url | script_tag: defer: 'defer' }}
   ```

### SEO
1. **Meta tags dinâmicas**
   ```liquid
   <title>{{ page_title }}</title>
   <meta name="description" content="{{ page_description }}">
   ```

2. **Schema markup**
   ```liquid
   {% render 'product-schema', product: product %}
   ```

### Acessibilidade
1. **ARIA labels**
   ```liquid
   <button aria-label="Add to cart">...</button>
   ```

2. **Landmarks**
   ```liquid
   <nav role="navigation">...</nav>
   <main role="main">...</main>
   ```

---

## ⚠️ PROBLEMAS COMUNS E SOLUÇÕES

### Problema 1: Liquid não aceita JavaScript inline
**Solução:** Usar event listeners em arquivo JS externo
```javascript
// assets/application.js
document.querySelectorAll('[data-add-to-cart]').forEach(button => {
  button.addEventListener('click', addToCart)
})
```

### Problema 2: Variantes de tamanho
**Solução:** Criar opções no Shopify Admin
```liquid
{% for option in product.options_with_values %}
  {% if option.name == 'Size' %}
    {% for value in option.values %}
      <button data-variant="{{ value }}">{{ value }}</button>
    {% endfor %}
  {% endif %}
{% endfor %}
```

### Problema 3: Carrinho 2x1
**Solução:** Usar Shopify Scripts ou App de desconto
```liquid
{% assign cheapest = cart.items | sort: 'price' | first %}
{% if cart.item_count >= 2 %}
  <p>Desconto: -{{ cheapest.price | money }}</p>
{% endif %}
```

---

## 🎯 RESUMO

### Tempo Estimado Total
- **Setup:** 4 horas
- **Conversão:** 40-50 horas
- **Testes:** 20 horas
- **Deploy:** 4 horas
- **TOTAL:** 70-80 horas (~2 semanas)

### Complexidade
- **Layout:** ⭐⭐ Fácil
- **Home:** ⭐⭐⭐ Médio
- **Produto:** ⭐⭐⭐⭐ Médio-Difícil
- **Carrinho:** ⭐⭐⭐⭐⭐ Difícil

### Próximo Passo
**Começar pela Fase 1** - Setup inicial do tema e ambiente de desenvolvimento.

---

**Documento criado por Claude Code**
**Data:** 25/10/2024

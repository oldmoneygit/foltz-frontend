# 🚀 Guia de Migração Shopify → Next.js

## 🎯 Objetivo

Aplicar TODO o design, cores, layout e melhorias do tema Shopify no projeto Next.js.

**Data:** 28 de Outubro de 2025  
**Status:** 🔄 Em Progresso

---

## ✅ O Que Já Foi Feito

### 1. **Design Tokens Sincronizados**
- ✅ `src/app/globals.css` atualizado
- ✅ Cores do Shopify aplicadas
- ✅ Design tokens (spacing, transitions, z-index)
- ✅ Mobile-first optimizations
- ✅ Touch targets 48x48px
- ✅ GPU acceleration utilities

### 2. **Imagens Copiadas**
- ✅ `hero-mobile.jpeg` → `public/images/`

---

## 📋 O Que Precisa Ser Feito

### Prioridade ALTA:

#### 1. **Header Component** (`src/components/Header.jsx`)
**Mudanças Necessárias:**
- [ ] Logo centralizado no mobile
- [ ] Ícone menu no canto esquerdo
- [ ] Remover busca do header mobile
- [ ] Busca apenas no menu mobile
- [ ] Promotional banner: "COMPRA 1 LLEVA 3"
- [ ] Touch targets 48x48px
- [ ] Sticky header

**CSS/Classes a Aplicar:**
```jsx
// Mobile menu toggle
className="lg:hidden flex items-center justify-center min-w-[48px] min-h-[48px] -ml-2"

// Logo (mobile)
className="absolute left-1/2 -translate-x-1/2 lg:static lg:transform-none"

// Header actions
className="flex items-center gap-2 min-w-[48px] min-h-[48px]"
```

---

#### 2. **Hero Component** (`src/components/Hero.jsx`)
**Mudanças Necessárias:**
- [ ] Responsiva mobile (imagem completa)
- [ ] object-fit: contain no mobile
- [ ] Imagem desktop vs mobile
- [ ] Sem espaços vazios mobile

**CSS a Aplicar:**
```css
/* Mobile */
@media (max-width: 749px) {
  .hero-image {
    object-fit: contain;
    height: auto;
  }
}

/* Desktop */
@media (min-width: 750px) {
  .hero-image {
    object-fit: cover;
    height: 100vh;
  }
}
```

---

#### 3. **ProductCard Component** (`src/components/ProductCard.jsx`)
**Mudanças Necessárias:**
- [ ] Wishlist sem background
- [ ] Touch targets 48x48px
- [ ] Skeleton loading
- [ ] Srcset responsivo
- [ ] Lazy loading otimizado

---

#### 4. **Coleções Grid**
**Mudanças Necessárias:**
- [ ] 4 produtos por linha desktop
- [ ] 2 produtos mobile
- [ ] Layout lado a lado (imagem + grid)
- [ ] Banners com cantos arredondados

---

### Prioridade MÉDIA:

#### 5. **Textos Espanhol Argentino**
**Substituições Globais:**
```
"Suscríbete" → "Suscribite"
"recibe" → "recibí"
"Suscribirse" → "Suscribirme"
"Intentá" → "Probá"
"camisas" → "camisetas"
"pegadinhas" → "trampas"
```

#### 6. **Promoção Corrigida**
```
ANTES: "1 sale GRATIS"
DEPOIS: "2 salen GRATIS"

Explicação: Compra 1 → Leva 3 total = 2 grátis
```

---

## 🎨 Design Tokens Aplicados

### Cores:
```css
--color-brand-yellow: #DAF10D
--color-brand-black: #000000
--color-brand-white: #FFFFFF
--color-white-60: rgba(255, 255, 255, 0.6)
--color-yellow-20: rgba(218, 241, 13, 0.2)
```

### Uso em Tailwind:
```jsx
bg-[#DAF10D]           // Amarelo
text-[#DAF10D]         // Texto amarelo
bg-[rgba(255,255,255,0.1)]  // Branco 10%
border-[rgba(218,241,13,0.2)] // Borda amarela
```

---

## 📱 Layout Mobile-First

### Breakpoints:
```
Mobile:  < 768px
Tablet:  768px - 1023px
Desktop: ≥ 1024px
```

### Header Mobile:
```
[☰]━━━━━━[LOGO]━━━━━━[❤️][🛒]
```

### Grid Produtos:
```
Mobile:  2 colunas
Desktop: 4 colunas
```

---

## 🖼️ Imagens

### Estrutura:
```
public/images/
├── hero-mobile.jpeg (NOVO)
├── hero-desktop.jpg
├── logo-white.png
└── leagues/
    ├── premier-league.jpg
    ├── la-liga.jpg
    └── ...
```

---

## ⚡ Performance

### Otimizações a Aplicar:

1. **Image Component:**
```jsx
<Image
  src="/image.jpg"
  width={600}
  height={800}
  sizes="(min-width: 1400px) 25vw, (min-width: 1024px) 33vw, 50vw"
  loading="lazy"
  className="w-full h-auto"
/>
```

2. **Lazy Loading:**
```jsx
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./Heavy'), {
  loading: () => <Skeleton />
})
```

3. **Fonts:**
```jsx
// layout.jsx
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  weights: [400, 700, 900]
})
```

---

## 🎯 Checklist de Migração

### Componentes:
- [ ] Header.jsx
- [ ] Hero.jsx
- [ ] ProductCard.jsx
- [ ] BestSellers.jsx
- [ ] CollectionGrid (novo)
- [ ] Footer.jsx

### Páginas:
- [ ] page.jsx (homepage)
- [ ] liga/[slug]/page.jsx
- [ ] product/[slug]/page.jsx
- [ ] carrito/page.jsx

### Textos:
- [ ] Espanhol argentino
- [ ] Promoção corrigida
- [ ] Voseo aplicado

### Performance:
- [ ] Image optimization
- [ ] Lazy loading
- [ ] Code splitting
- [ ] Font optimization

---

## 🔧 Comandos Úteis

### Desenvolvimento:
```bash
npm run dev
```

### Build:
```bash
npm run build
```

### Deploy (Vercel):
```bash
vercel --prod
```

---

## 📝 Próximos Passos

1. ✅ Design tokens aplicados
2. 🔄 Atualizar Header
3. ⏳ Atualizar Hero
4. ⏳ Atualizar ProductCard
5. ⏳ Criar CollectionGrid
6. ⏳ Textos espanhol argentino
7. ⏳ Performance optimization
8. ⏳ Deploy

---

**Status:** Design tokens sincronizados! Próximo: Header component.


# 📚 Documentação Completa: Implementação Promoção Combo 3x - Foltz

> **Propósito:** Guia detalhado da implementação da promoção "Combo 3x BLACK FRIDAY" na loja Foltz, incluindo design, cores, componentes, animações e integrações. Use este documento como referência para replicar o estilo em outros projetos (ex: SNKHOUSE).

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Design System](#design-system)
3. [Componentes Criados](#componentes-criados)
4. [Contexto e Estado Global](#contexto-e-estado-global)
5. [Integrações](#integrações)
6. [Estrutura de Arquivos](#estrutura-de-arquivos)
7. [Guia de Replicação](#guia-de-replicação)

---

## 🎯 Visão Geral

### Conceito da Promoção
**Nome:** COMBO 3x BLACK FRIDAY
**Mecânica:** Compre 3 camisetas por ARS 32.900 (preço fixo)
**Benefícios:**
- Preço fixo independente dos produtos escolhidos
- Frete grátis incluído
- Pode misturar times/modelos
- Múltiplos combos: 6 itens = 2 combos, 9 itens = 3 combos

### Objetivos de Design
1. **Urgência:** Criar senso de oportunidade limitada (Black Friday)
2. **Clareza:** Explicar a mecânica de forma simples e visual
3. **Incentivo:** Mostrar economia e benefícios claramente
4. **Confiança:** Transmitir segurança e credibilidade

---

## 🎨 Design System

### Paleta de Cores

#### Cores Primárias da Promoção

```javascript
// Gradientes Principais
const COMBO_GRADIENT = {
  primary: 'from-orange-500 to-red-600',      // Badges, CTAs principais
  hero: 'from-orange-600 via-red-600 to-orange-600', // Banner hero
  success: 'from-green-900/30 to-emerald-900/30',    // Combo ativado
  warning: 'from-orange-900/30 to-red-900/30',       // Precisa mais produtos
}

// Cores Sólidas
const COMBO_COLORS = {
  orange: {
    light: '#fb923c',    // orange-400
    DEFAULT: '#f97316',  // orange-500
    dark: '#ea580c',     // orange-600
  },
  red: {
    DEFAULT: '#dc2626',  // red-600
    dark: '#b91c1c',     // red-700
  },
  yellow: {
    light: '#fde047',    // yellow-300
    DEFAULT: '#facc15',  // yellow-400
  },
  green: {
    light: '#10b981',    // green-500
    success: '#059669',  // green-600
  }
}
```

#### Como Aplicar as Cores

**Para CTAs e Badges:**
```jsx
className="bg-gradient-to-r from-orange-500 to-red-600 text-white"
```

**Para Fundos de Cards:**
```jsx
// Combo ATIVO (verde)
className="bg-gradient-to-br from-green-900/30 via-green-800/20 to-emerald-900/30 border-2 border-green-500/50"

// Combo INATIVO (laranja/vermelho)
className="bg-gradient-to-br from-orange-900/30 via-red-900/20 to-orange-900/30 border-2 border-orange-500/50"
```

**Para Textos de Destaque:**
```jsx
// Preço/Valor
className="text-yellow-400 font-black"

// Economia
className="text-green-400 font-bold"

// Alerta/Atenção
className="text-orange-400 font-semibold"
```

### Tipografia

```javascript
// Hierarquia de Títulos
const TYPOGRAPHY = {
  hero: 'text-3xl md:text-5xl lg:text-6xl font-black uppercase',
  h1: 'text-2xl md:text-4xl font-black uppercase',
  h2: 'text-xl md:text-3xl font-black uppercase',
  h3: 'text-lg md:text-2xl font-bold uppercase',
  price: 'text-2xl md:text-3xl font-black',
  body: 'text-sm md:text-base font-medium',
  small: 'text-xs md:text-sm font-medium',
}

// Sempre usar:
// - font-black para títulos principais
// - font-bold para subtítulos
// - uppercase para títulos promocionais
```

### Espaçamento e Layout

```javascript
// Padding padrão para cards/containers
const SPACING = {
  card: 'p-4 md:p-6',
  section: 'py-8 md:py-12 lg:py-16',
  gap: 'gap-4 md:gap-6',
}

// Bordas e cantos
const BORDERS = {
  radius: 'rounded-lg md:rounded-xl',
  width: 'border-2',
  glow: 'shadow-lg shadow-orange-500/20',
}
```

### Animações

#### 1. Pulse Animation (Badges)
```jsx
import { motion } from 'framer-motion'

<motion.div
  animate={{ scale: [1, 1.05, 1] }}
  transition={{ duration: 2, repeat: Infinity }}
>
  {/* Conteúdo */}
</motion.div>
```

#### 2. Fade In (Popups)
```jsx
<motion.div
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.9 }}
  transition={{ duration: 0.3 }}
>
  {/* Conteúdo */}
</motion.div>
```

#### 3. Slide In (Banners)
```jsx
<motion.div
  initial={{ y: -20, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  {/* Conteúdo */}
</motion.div>
```

### Ícones Utilizados

```javascript
// Biblioteca: lucide-react
import {
  Tag,              // Badge de preço
  ShoppingCart,     // Carrinho/adicionar
  Truck,            // Frete grátis
  CreditCard,       // Pagamento
  ShieldCheck,      // Segurança/confiança
  Gift,             // Promoção/presente
  Zap,              // Rapidez/urgência
  Check,            // Confirmação
  X,                // Fechar
  ChevronRight,     // Navegação
  Sparkles,         // Destaque
  Clock,            // Tempo limitado
} from 'lucide-react'

// Emojis para destaque emocional
const EMOJIS = {
  fire: '🔥',        // Urgência, promoção quente
  gift: '🎁',        // Presente, benefício
  money: '💰',       // Economia, desconto
  truck: '🚚',       // Frete grátis
  check: '✅',       // Confirmação, sucesso
  package: '📦',     // Produto, entrega
  cart: '🛒',        // Carrinho de compras
  star: '⭐',        // Destaque, qualidade
  rocket: '🚀',      // Rapidez, urgência
}
```

---

## 🧩 Componentes Criados

### 1. Combo3xHeroBanner

**Localização:** `src/components/combo3x/Combo3xHeroBanner.jsx`

**Propósito:** Banner principal no topo da homepage

**Design:**
- Gradiente laranja-vermelho vibrante
- Fire emoji animado
- Texto grande e impactante
- CTA destacado

**Código Completo:**
```jsx
'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function Combo3xHeroBanner() {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 text-white py-8 md:py-12 px-4 text-center shadow-2xl relative overflow-hidden"
    >
      {/* Efeito de brilho de fundo */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent"></div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Fire emojis animados */}
        <div className="flex justify-center gap-4 mb-4">
          <motion.span
            animate={{ scale: [1, 1.2, 1], rotate: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-4xl"
          >
            🔥
          </motion.span>
          <motion.span
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-5xl"
          >
            🔥
          </motion.span>
          <motion.span
            animate={{ scale: [1, 1.2, 1], rotate: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-4xl"
          >
            🔥
          </motion.span>
        </div>

        {/* Título principal */}
        <h2 className="text-xl md:text-3xl lg:text-4xl font-black text-white uppercase tracking-tight mb-2">
          BLACK FRIDAY FOLTZ
        </h2>

        {/* Subtítulo com preço */}
        <p className="text-base md:text-xl lg:text-2xl text-yellow-300 mt-1 font-black mb-6">
          COMPRE 3 CAMISETAS POR <span className="text-yellow-200">ARS 32.900</span>
        </p>

        {/* Benefícios */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-6 text-xs md:text-sm mb-6">
          <span className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full">
            🚚 <span className="font-bold">Envío GRATIS</span>
          </span>
          <span className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full">
            🎁 <span className="font-bold">Elegí los que quieras</span>
          </span>
          <span className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full">
            ⚡ <span className="font-bold">Entrega Rápida</span>
          </span>
        </div>

        {/* CTA Button */}
        <Link href="#best-sellers">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-yellow-400 hover:bg-yellow-300 text-black font-black px-8 py-4 rounded-xl text-base md:text-lg uppercase shadow-2xl transition-colors"
          >
            🔥 ARMAR MI COMBO AHORA
          </motion.button>
        </Link>
      </div>
    </motion.div>
  )
}
```

**Variáveis Customizáveis para SNKHOUSE:**
```javascript
// Alterar cores
from-orange-600 → from-blue-600  // Para azul
via-red-600 → via-purple-600     // Para roxo

// Alterar texto
"BLACK FRIDAY FOLTZ" → "BLACK FRIDAY SNKHOUSE"
"COMPRE 3 CAMISETAS" → "COMPRE 3 TÊNIS"
"ARS 32.900" → Seu preço

// Alterar emojis
🔥 → 👟 (sneakers)
🚚 → 📦
🎁 → ⭐
```

---

### 2. Combo3xPopup

**Localização:** `src/components/combo3x/Combo3xPopup.jsx`

**Propósito:** Popup de boas-vindas que aparece após 2.5s

**Design:**
- Centralizado com overlay escuro
- Lista de benefícios com ícones
- CTA destacado
- Botão de fechar

**Código Completo:**
```jsx
'use client'
import { useCombo3x } from '@/contexts/Combo3xContext'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingCart, Truck, Gift, Zap } from 'lucide-react'
import Link from 'next/link'

export default function Combo3xPopup() {
  const { showPopup, closePopup } = useCombo3x()

  return (
    <AnimatePresence>
      {showPopup && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePopup}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9998]"
          />

          {/* Popup Container - CENTERED */}
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 rounded-2xl shadow-2xl border-2 border-orange-500/30"
            >
              {/* Header com gradiente */}
              <div className="bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 p-6 relative">
                {/* Botão fechar */}
                <button
                  onClick={closePopup}
                  className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                  aria-label="Fechar"
                >
                  <X className="w-6 h-6" />
                </button>

                {/* Fire emojis */}
                <div className="flex justify-center gap-2 mb-3">
                  <span className="text-3xl">🔥</span>
                  <span className="text-4xl">🔥</span>
                  <span className="text-3xl">🔥</span>
                </div>

                {/* Título */}
                <h2 className="text-2xl md:text-3xl font-black text-white text-center uppercase mb-2">
                  BLACK FRIDAY FOLTZ
                </h2>
                <p className="text-yellow-300 text-center font-bold text-lg">
                  Combo 3x Camisetas
                </p>
              </div>

              {/* Conteúdo */}
              <div className="p-6">
                {/* Preço destaque */}
                <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500/50 rounded-xl p-4 mb-6 text-center">
                  <p className="text-white/60 text-sm mb-1">Combo de 3 camisetas por</p>
                  <p className="text-yellow-400 text-3xl md:text-4xl font-black">
                    ARS 32.900
                  </p>
                  <p className="text-white/60 text-xs mt-1">Envío GRATIS incluido</p>
                </div>

                {/* Como funciona */}
                <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                  <Gift className="w-5 h-5 text-orange-500" />
                  ¿Cómo funciona?
                </h3>

                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-3 text-white/80">
                    <ShoppingCart className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <span><strong className="text-white">Elegí 3 jerseys</strong> que te gusten (podés mezclar equipos)</span>
                  </li>
                  <li className="flex items-start gap-3 text-white/80">
                    <Zap className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <span><strong className="text-white">Precio fijo:</strong> ARS 32.900 sin importar cuáles elijas</span>
                  </li>
                  <li className="flex items-start gap-3 text-white/80">
                    <Truck className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span><strong className="text-white">Envío gratis</strong> a toda Argentina</span>
                  </li>
                </ul>

                {/* Benefícios adicionais */}
                <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-lg p-4 mb-6">
                  <p className="text-green-400 font-bold text-sm mb-2">✅ Beneficios incluidos:</p>
                  <ul className="text-white/70 text-sm space-y-1">
                    <li>• Cualquier combinación de equipos</li>
                    <li>• Múltiples combos: 6 camisetas = 2 combos</li>
                    <li>• Sin límite de compra</li>
                    <li>• Entrega rápida en 3-7 días</li>
                  </ul>
                </div>

                {/* CTA Button */}
                <Link href="#best-sellers" onClick={closePopup}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-black py-4 rounded-xl text-lg uppercase shadow-lg transition-all"
                  >
                    🔥 ARMAR MI COMBO
                  </motion.button>
                </Link>

                {/* Fechar depois */}
                <button
                  onClick={closePopup}
                  className="w-full mt-3 text-white/50 hover:text-white/80 text-sm transition-colors"
                >
                  Ver después
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
```

**Customização para SNKHOUSE:**
- Trocar "3 camisetas" → "3 tênis"
- Trocar ícones de jersey → sneakers
- Ajustar preço conforme necessário
- Alterar cores do gradiente

---

### 3. Combo3xBadge

**Localização:** `src/components/combo3x/Combo3xBadge.jsx`

**Propósito:** Badge pequeno nos cards de produtos

**Design:**
- Gradiente laranja-vermelho
- Animação de pulse
- Ícone de tag
- Texto curto e direto

**Código Completo:**
```jsx
'use client'
import { motion } from 'framer-motion'
import { Tag } from 'lucide-react'

export default function Combo3xBadge() {
  return (
    <motion.div
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="inline-flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-red-600 text-white px-3 py-1.5 rounded-lg shadow-lg"
    >
      <Tag className="w-3.5 h-3.5" />
      <span className="text-xs font-black uppercase tracking-wide">
        COMBO X3: ARS 32.900
      </span>
    </motion.div>
  )
}
```

**Variações possíveis:**
```jsx
// Badge mais largo (para cards maiores)
className="px-4 py-2 rounded-xl"
<span className="text-sm font-black">COMBO 3x1: ARS 32.900</span>

// Badge com emoji
<span>🔥 COMBO X3: ARS 32.900</span>

// Badge com cores diferentes
from-blue-500 to-purple-600  // Azul-roxo
from-green-500 to-emerald-600  // Verde
```

---

### 4. Combo3xCartOption

**Localização:** `src/components/combo3x/Combo3xCartOption.jsx`

**Propósito:** Mostrar status do combo no carrinho com incentivos

**Design:**
- Duas versões: Inativo (laranja) e Ativo (verde)
- Barra de progresso visual
- Lista de benefícios
- Economia destacada

**Código Completo:**
```jsx
'use client'
import { useCombo3x } from '@/contexts/Combo3xContext'
import { Gift, Truck, Zap, ShoppingCart } from 'lucide-react'
import { formatPrice } from '@/utils/formatPrice'

export default function Combo3xCartOption({ items }) {
  const { calculateCombo3xTotals, COMBO_PRICE, COMBO_SIZE } = useCombo3x()

  if (!items || items.length === 0) return null

  const comboData = calculateCombo3xTotals(items)
  const { hasCombo, productsNeeded, fullCombos, savings } = comboData

  // COMBO INATIVO - Precisa adicionar mais produtos
  if (!hasCombo) {
    return (
      <div className="bg-gradient-to-br from-orange-900/30 via-red-900/20 to-orange-900/30 border-2 border-orange-500/50 rounded-xl p-4 shadow-lg">
        <div className="flex items-start gap-3 mb-3">
          <Gift className="w-6 h-6 text-orange-500 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-orange-400 font-black text-lg uppercase">
              Combo 3x BLACK FRIDAY
            </h3>
            <p className="text-orange-300 text-sm font-bold">
              ¡Agregá {productsNeeded} {productsNeeded === 1 ? 'producto más' : 'productos más'} y activá esta promoción!
            </p>
          </div>
        </div>

        {/* Barra de progresso */}
        <div className="mb-4">
          <div className="bg-white/10 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-orange-500 to-red-600 h-full transition-all duration-500"
              style={{ width: `${(items.reduce((sum, item) => sum + item.quantity, 0) / COMBO_SIZE) * 100}%` }}
            />
          </div>
          <p className="text-white/60 text-xs mt-1 text-center">
            {items.reduce((sum, item) => sum + item.quantity, 0)} de {COMBO_SIZE} productos
          </p>
        </div>

        {/* Benefícios */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-white/70 text-sm">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span>Precio fijo: <strong className="text-yellow-400">{formatPrice(COMBO_PRICE)}</strong></span>
          </div>
          <div className="flex items-center gap-2 text-white/70 text-sm">
            <Truck className="w-4 h-4 text-green-500" />
            <span>Envío <strong className="text-green-400">GRATIS</strong> incluido</span>
          </div>
        </div>
      </div>
    )
  }

  // COMBO ATIVO - Mostra economia e detalhes
  return (
    <div className="bg-gradient-to-br from-green-900/30 via-green-800/20 to-emerald-900/30 border-2 border-green-500/50 rounded-xl p-4 shadow-lg">
      <div className="flex items-start gap-3 mb-3">
        <Gift className="w-6 h-6 text-green-500 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-green-400 font-black text-lg uppercase flex items-center gap-2">
            ✅ COMBO ACTIVADO
          </h3>
          <p className="text-green-300 text-sm font-bold">
            {fullCombos} {fullCombos === 1 ? 'combo' : 'combos'} de BLACK FRIDAY
          </p>
        </div>
      </div>

      {/* Economia */}
      <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-3 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-white/70 text-sm">💰 Ahorro total:</span>
          <span className="text-green-400 font-black text-xl">
            {formatPrice(savings)}
          </span>
        </div>
      </div>

      {/* Detalhes */}
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between text-white/70">
          <span>Productos en combo:</span>
          <span className="text-white font-bold">{fullCombos * COMBO_SIZE}</span>
        </div>
        <div className="flex items-center justify-between text-white/70">
          <span>Precio por combo:</span>
          <span className="text-green-400 font-bold">{formatPrice(COMBO_PRICE)}</span>
        </div>
      </div>

      {/* Benefícios */}
      <div className="mt-4 pt-4 border-t border-green-500/30 space-y-2">
        <div className="flex items-center gap-2 text-green-300 text-sm">
          <Truck className="w-4 h-4" />
          <span className="font-bold">🚚 Envío GRATIS incluido</span>
        </div>
        <div className="flex items-center gap-2 text-green-300 text-sm">
          <Zap className="w-4 h-4" />
          <span className="font-bold">⚡ Entrega rápida 3-7 días</span>
        </div>
      </div>
    </div>
  )
}
```

**Estados Visuais:**
1. **Inativo (precisa mais):** Laranja/vermelho, barra de progresso
2. **Ativo:** Verde, mostra economia e benefícios

---

### 5. Combo3xProductCard

**Localização:** `src/components/combo3x/Combo3xProductCard.jsx`

**Propósito:** Card explicativo na página de produto individual

**Design:**
- 3 passos visuais numerados
- FAQ expandível
- Preço destacado
- Ícones ilustrativos

**Código Completo:**
```jsx
'use client'
import { useState } from 'react'
import { ShoppingCart, Truck, CreditCard, Gift, ChevronRight } from 'lucide-react'
import { formatPrice } from '@/utils/formatPrice'

const COMBO_PRICE = 32900

export default function Combo3xProductCard() {
  const [expandedFaq, setExpandedFaq] = useState(null)

  const steps = [
    {
      number: '1',
      icon: ShoppingCart,
      title: 'Agregá 3 jerseys',
      description: 'Elegí cualquier combinación que te guste'
    },
    {
      number: '2',
      icon: Gift,
      title: 'Precio fijo',
      description: `Pagás solo ${formatPrice(COMBO_PRICE)} por los 3`
    },
    {
      number: '3',
      icon: Truck,
      title: 'Envío gratis',
      description: 'Recibís en 3-7 días sin costo adicional'
    }
  ]

  const faqs = [
    {
      q: '¿Puedo mezclar equipos diferentes?',
      a: 'Sí, podés elegir cualquier combinación de equipos y modelos.'
    },
    {
      q: '¿Puedo comprar más de un combo?',
      a: 'Sí, si agregás 6 productos obtenés 2 combos, 9 productos = 3 combos, etc.'
    },
    {
      q: '¿Hay límite de compra?',
      a: 'No hay límite. Podés comprar todos los combos que quieras.'
    }
  ]

  return (
    <div className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 border-2 border-orange-500/50 rounded-xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 p-4 text-center">
        <div className="flex justify-center gap-2 mb-2">
          <span className="text-2xl">🔥</span>
          <span className="text-3xl">🔥</span>
          <span className="text-2xl">🔥</span>
        </div>
        <h3 className="text-xl md:text-2xl font-black text-white uppercase">
          COMBO 3x BLACK FRIDAY
        </h3>
      </div>

      {/* Preço destaque */}
      <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-y-2 border-yellow-500/50 p-4 text-center">
        <p className="text-white/60 text-sm mb-1">3 Camisetas por</p>
        <p className="text-yellow-400 text-2xl md:text-3xl font-black">
          {formatPrice(COMBO_PRICE)}
        </p>
        <p className="text-white/60 text-xs mt-1">Envío GRATIS incluido</p>
      </div>

      {/* Steps */}
      <div className="p-6 space-y-4">
        <h4 className="text-white font-bold text-lg mb-4">¿Cómo funciona?</h4>
        {steps.map((step) => {
          const Icon = step.icon
          return (
            <div key={step.number} className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-black">
                {step.number}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Icon className="w-5 h-5 text-orange-500" />
                  <h5 className="text-white font-bold">{step.title}</h5>
                </div>
                <p className="text-white/60 text-sm">{step.description}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* FAQ */}
      <div className="border-t border-white/10 p-6">
        <h4 className="text-white font-bold text-lg mb-4">Preguntas frecuentes</h4>
        <div className="space-y-2">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-white/10 rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                className="w-full flex items-center justify-between p-3 text-left hover:bg-white/5 transition-colors"
              >
                <span className="text-white text-sm font-medium">{faq.q}</span>
                <ChevronRight
                  className={`w-4 h-4 text-white/60 transition-transform ${
                    expandedFaq === index ? 'rotate-90' : ''
                  }`}
                />
              </button>
              {expandedFaq === index && (
                <div className="px-3 pb-3 text-white/70 text-sm">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
```

---

### 6. HowItWorksCombo3x

**Localização:** `src/components/combo3x/HowItWorksCombo3x.jsx`

**Propósito:** Seção completa explicativa na homepage

**Design:**
- 4 passos com ícones grandes
- Grid responsivo
- Formas de pagamento
- FAQ completo
- Trust badges

**Estrutura:**
```jsx
export default function HowItWorksCombo3x() {
  return (
    <section className="py-12 md:py-20 px-4 bg-zinc-950">
      <div className="max-w-7xl mx-auto">
        {/* Título da seção */}
        <SectionTitle />

        {/* 4 passos em grid */}
        <StepsGrid />

        {/* Formas de pagamento */}
        <PaymentMethods />

        {/* FAQ */}
        <FAQ />

        {/* Trust badges */}
        <TrustBadges />
      </div>
    </section>
  )
}
```

---

## 🔧 Contexto e Estado Global

### Combo3xContext

**Localização:** `src/contexts/Combo3xContext.jsx`

**Propósito:** Gerenciar estado global da promoção

**Estrutura:**
```javascript
// Constantes
export const COMBO_PRICE = 32900  // ARS 32.900
export const COMBO_SIZE = 3       // 3 produtos por combo

// Estado gerenciado:
// - showPopup: boolean
// - calculateCombo3xTotals(items): função de cálculo

// Cálculo do combo
const calculateCombo3xTotals = (cartItems) => {
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  if (itemCount < COMBO_SIZE) {
    return {
      hasCombo: false,
      productsNeeded: COMBO_SIZE - itemCount,
      fullCombos: 0,
      savings: 0,
      subtotalNormal: /* preço normal */,
      subtotalCombo: /* preço normal */,
    }
  }

  const fullCombos = Math.floor(itemCount / COMBO_SIZE)
  const remainingItems = itemCount % COMBO_SIZE

  const comboTotal = fullCombos * COMBO_PRICE
  const extraTotal = /* calcular itens extras ao preço normal */

  return {
    hasCombo: true,
    fullCombos,
    remainingItems,
    subtotalCombo: comboTotal + extraTotal,
    subtotalNormal: /* preço sem desconto */,
    savings: /* economia total */,
  }
}
```

**Como usar em componentes:**
```jsx
import { useCombo3x } from '@/contexts/Combo3xContext'

function MyComponent() {
  const { calculateCombo3xTotals, COMBO_PRICE, COMBO_SIZE } = useCombo3x()

  const comboData = calculateCombo3xTotals(cartItems)
  // Use comboData.hasCombo, comboData.savings, etc.
}
```

---

## 🔗 Integrações

### 1. Integração com Carrinho

**Arquivo:** `src/components/cart/CartSummary.jsx`

**Mudanças necessárias:**
```jsx
import { useCombo3x } from '@/contexts/Combo3xContext'

// Calcular totais com combo
const { calculateCombo3xTotals } = useCombo3x()
const comboData = calculateCombo3xTotals(cartItems)

// Usar comboData.subtotalCombo ao invés do subtotal normal
const finalSubtotal = comboData.subtotalCombo
```

### 2. Integração Shopify Checkout

**Adicionar atributos ao line item:**
```javascript
// Somente no primeiro item (flag isFirstItem)
if (comboData.hasCombo && isFirstItem) {
  lineItem.attributes.push({
    key: '🔥 COMBO 3x BLACK FRIDAY',
    value: '✅ Activado'
  })
  lineItem.attributes.push({
    key: '📦 Combos',
    value: `${comboData.fullCombos} combos`
  })
  lineItem.attributes.push({
    key: '💰 Precio Combo',
    value: formatPrice(COMBO_PRICE)
  })
  lineItem.attributes.push({
    key: '💵 Ahorro Total',
    value: formatPrice(comboData.savings)
  })
}
```

### 3. Meta Pixel Tracking

**Evento personalizado:**
```javascript
if (typeof window !== 'undefined' && window.fbq) {
  window.fbq('trackCustom', 'Combo3xActivated', {
    combos: comboData.fullCombos,
    value: comboData.subtotalCombo,
    currency: 'ARS'
  })
}
```

---

## 📁 Estrutura de Arquivos

```
src/
├── components/
│   ├── combo3x/
│   │   ├── Combo3xHeroBanner.jsx        # Banner hero homepage
│   │   ├── Combo3xPopup.jsx             # Popup boas-vindas
│   │   ├── Combo3xBadge.jsx             # Badge nos cards
│   │   ├── Combo3xCartOption.jsx        # Status no carrinho
│   │   ├── Combo3xProductCard.jsx       # Card página produto
│   │   └── HowItWorksCombo3x.jsx        # Seção explicativa
│   ├── cart/
│   │   └── CartSummary.jsx              # Integração checkout
│   ├── ProductCard.jsx                  # Card de produto (usa Badge)
│   └── PromotionalBanner.jsx            # Top bar
├── contexts/
│   └── Combo3xContext.jsx               # Estado global
├── app/
│   ├── layout.jsx                       # Provider do contexto
│   ├── page.jsx                         # Homepage (Hero + HowItWorks)
│   └── product/[slug]/
│       └── page.jsx                     # Página produto (ProductCard)
└── utils/
    └── formatPrice.js                   # Helper de formatação
```

---

## 🚀 Guia de Replicação para SNKHOUSE

### Passo 1: Definir Constantes

```javascript
// contexts/Combo3xContext.jsx (ou PromoContext.jsx)
export const COMBO_PRICE = 150.00  // Seu preço
export const COMBO_SIZE = 3        // Quantos produtos no combo
```

### Passo 2: Adaptar Cores

```javascript
// Sneaker Store: Azul/Roxo
const SNKHOUSE_COLORS = {
  primary: 'from-blue-500 to-purple-600',
  hero: 'from-blue-600 via-purple-600 to-blue-600',
  success: 'from-blue-900/30 to-purple-900/30',
}

// Substituir em todos os componentes:
from-orange-500 to-red-600 → from-blue-500 to-purple-600
```

### Passo 3: Trocar Textos e Emojis

```javascript
// De Jerseys → Para Sneakers
"camisetas" → "tênis" ou "sneakers"
"jerseys" → "tênis"
🔥 → 👟
"equipos" → "marcas"
```

### Passo 4: Criar Componentes

Copiar todos os componentes de `combo3x/` e adaptar:
1. Combo3xHeroBanner → SnkhouseHeroBanner
2. Combo3xPopup → SnkhousePopup
3. Etc.

### Passo 5: Integrar no Layout

```jsx
// app/layout.jsx
import { Combo3xProvider } from '@/contexts/Combo3xContext'
import Combo3xPopup from '@/components/combo3x/Combo3xPopup'

export default function RootLayout({ children }) {
  return (
    <Combo3xProvider>
      <Combo3xPopup />
      {children}
    </Combo3xProvider>
  )
}
```

### Passo 6: Adicionar na Homepage

```jsx
// app/page.jsx
import Combo3xHeroBanner from '@/components/combo3x/Combo3xHeroBanner'
import HowItWorksCombo3x from '@/components/combo3x/HowItWorksCombo3x'

export default function HomePage() {
  return (
    <>
      <Combo3xHeroBanner />
      {/* outros componentes */}
      <HowItWorksCombo3x />
    </>
  )
}
```

---

## 📊 Checklist de Implementação

### Design
- [ ] Definir paleta de cores
- [ ] Escolher ícones (lucide-react)
- [ ] Definir emojis temáticos
- [ ] Criar variações de gradientes
- [ ] Definir tipografia (tamanhos, pesos)

### Componentes
- [ ] Hero Banner
- [ ] Popup de boas-vindas
- [ ] Badge nos produtos
- [ ] Card status no carrinho
- [ ] Card explicativo produto
- [ ] Seção "Como funciona"

### Lógica
- [ ] Context para estado global
- [ ] Função de cálculo do combo
- [ ] Integração com carrinho
- [ ] Tracking (Meta Pixel, GA)

### Integração
- [ ] Provider no layout
- [ ] Atributos Shopify checkout
- [ ] Popup com localStorage
- [ ] Responsividade mobile

---

## 💡 Dicas e Boas Práticas

### Performance
- Use `React.memo()` em componentes que recalculam frequentemente
- `useMemo()` para cálculos pesados
- Lazy load de componentes grandes

### Acessibilidade
- `aria-label` em botões de ícone
- Contraste de cores (WCAG AA)
- Foco visível em elementos interativos
- Alternativas de texto para ícones

### Mobile First
- Sempre teste mobile primeiro
- Use classes responsivas: `text-sm md:text-base lg:text-lg`
- Touch targets mínimo 44x44px
- Popups com `max-h-[90vh]` para evitar overflow

### Animações
- Use `framer-motion` para animações suaves
- `transition-all duration-300` para hover states
- Evite animações em elementos grandes (performance)

---

## 🎯 Resumo Rápido

**Para replicar na SNKHOUSE:**

1. **Copie** toda a pasta `src/components/combo3x/`
2. **Copie** `src/contexts/Combo3xContext.jsx`
3. **Altere** as cores (laranja/vermelho → suas cores)
4. **Altere** os textos ("camisetas" → "tênis")
5. **Altere** emojis (🔥 → 👟)
6. **Ajuste** o preço (COMBO_PRICE)
7. **Integre** no layout e páginas

**Tempo estimado:** 2-3 horas para replicação completa

---

## 📞 Suporte

Para dúvidas sobre esta implementação:
- Revisar este documento
- Verificar código fonte em `src/components/combo3x/`
- Consultar Tailwind CSS docs para classes
- Consultar Framer Motion docs para animações

---

**Última atualização:** 2025-11-04
**Versão:** 1.0
**Autor:** Claude (Anthropic)

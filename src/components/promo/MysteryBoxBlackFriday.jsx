'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Package, Zap, ShoppingCart, Minus, Plus, TrendingDown, Sparkles, Check } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { useBlackFriday } from '@/contexts/BlackFridayContext'
import AddToCartToast from '@/components/product/AddToCartToast'

const DEFAULT_SIZES = ['S', 'M', 'L', 'XL', 'XXL', '3XL']

// Dados dos Mystery Boxes na Shopify com variantes
const MYSTERY_BOX_SHOPIFY_DATA = {
  'mystery-box-premier-league': {
    shopifyId: '15715026403708',
    handle: 'mystery-box-premier-league',
    title: 'Mystery Box Premier League',
    variants: [
      { id: '55981717881212', title: 'S', available: false },
      { id: '55981717913980', title: 'M', available: false },
      { id: '55981717946748', title: 'L', available: false },
      { id: '55981717979516', title: 'XL', available: false },
      { id: '55981718012284', title: 'XXL', available: false },
      { id: '55981718045052', title: '3XL', available: false }
    ]
  },
  'mystery-box-la-liga': {
    shopifyId: '15715026436476',
    handle: 'mystery-box-la-liga',
    title: 'Mystery Box La Liga',
    variants: [
      { id: '55981718077820', title: 'S', available: false },
      { id: '55981718110588', title: 'M', available: false },
      { id: '55981718143356', title: 'L', available: false },
      { id: '55981718176124', title: 'XL', available: false },
      { id: '55981718208892', title: 'XXL', available: false },
      { id: '55981718241660', title: '3XL', available: false }
    ]
  },
  'mystery-box-serie-a': {
    shopifyId: '15715026567548',
    handle: 'mystery-box-serie-a',
    title: 'Mystery Box Serie A',
    variants: [
      { id: '55981718274428', title: 'S', available: false },
      { id: '55981718307196', title: 'M', available: false },
      { id: '55981718339964', title: 'L', available: false },
      { id: '55981718372732', title: 'XL', available: false },
      { id: '55981718405500', title: 'XXL', available: false },
      { id: '55981718438268', title: '3XL', available: false }
    ]
  },
  'mystery-box-bundesliga': {
    shopifyId: '15715026698620',
    handle: 'mystery-box-bundesliga',
    title: 'Mystery Box Bundesliga',
    variants: [
      { id: '55981718471036', title: 'S', available: false },
      { id: '55981718503804', title: 'M', available: false },
      { id: '55981718536572', title: 'L', available: false },
      { id: '55981718569340', title: 'XL', available: false },
      { id: '55981718602108', title: 'XXL', available: false },
      { id: '55981718634876', title: '3XL', available: false }
    ]
  },
  'mystery-box-ligue-1': {
    shopifyId: '15715026796924',
    handle: 'mystery-box-ligue-1',
    title: 'Mystery Box Ligue 1',
    variants: [
      { id: '55981718667644', title: 'S', available: false },
      { id: '55981718700412', title: 'M', available: false },
      { id: '55981718733180', title: 'L', available: false },
      { id: '55981718765948', title: 'XL', available: false },
      { id: '55981718798716', title: 'XXL', available: false },
      { id: '55981718831484', title: '3XL', available: false }
    ]
  },
  'mystery-box-argentina': {
    shopifyId: '15715026960764',
    handle: 'mystery-box-argentina',
    title: 'Mystery Box Argentina',
    variants: [
      { id: '55981718864252', title: 'S', available: false },
      { id: '55981718897020', title: 'M', available: false },
      { id: '55981718929788', title: 'L', available: false },
      { id: '55981718962556', title: 'XL', available: false },
      { id: '55981718995324', title: 'XXL', available: false },
      { id: '55981719028092', title: '3XL', available: false }
    ]
  },
  'mystery-box-world-cup': {
    shopifyId: '15715027059068',
    handle: 'mystery-box-world-cup',
    title: 'Mystery Box FIFA World Cup',
    variants: [
      { id: '55981719060860', title: 'S', available: false },
      { id: '55981719093628', title: 'M', available: false },
      { id: '55981719126396', title: 'L', available: false },
      { id: '55981719159164', title: 'XL', available: false },
      { id: '55981719191932', title: 'XXL', available: false },
      { id: '55981719224700', title: '3XL', available: false }
    ]
  }
}

const mysteryBoxes = [
  {
    id: 'premier-league',
    name: 'Premier League',
    image: '/images/mysterybox/premierleague.png',
    slug: 'mystery-box-premier-league',
  },
  {
    id: 'laliga',
    name: 'La Liga',
    image: '/images/mysterybox/laliga.png',
    slug: 'mystery-box-la-liga',
  },
  {
    id: 'serie-a',
    name: 'Serie A',
    image: '/images/mysterybox/seriea.png',
    slug: 'mystery-box-serie-a',
  },
  {
    id: 'bundesliga',
    name: 'Bundesliga',
    image: '/images/mysterybox/bundesliga.png',
    slug: 'mystery-box-bundesliga',
  },
  {
    id: 'ligue-1',
    name: 'Ligue 1',
    image: '/images/mysterybox/ligue1.png',
    slug: 'mystery-box-ligue-1',
  },
  {
    id: 'argentina',
    name: 'Argentina',
    image: '/images/mysterybox/argentina.png',
    slug: 'mystery-box-argentina',
  },
  {
    id: 'fifa',
    name: 'FIFA World Cup',
    image: '/images/mysterybox/fifa.png',
    slug: 'mystery-box-world-cup',
  },
]

export default function MysteryBoxBlackFriday() {
  const { addToCart } = useCart()
  const { MYSTERYBOX_PRICE_TIERS, MYSTERYBOX_NORMAL_PRICE } = useBlackFriday()

  // Estado para rastrear as quantidades de cada liga
  const [selections, setSelections] = useState(
    mysteryBoxes.reduce((acc, box) => ({ ...acc, [box.id]: 0 }), {})
  )

  // Estado para rastrear os tamanhos selecionados para cada box
  const [selectedSizes, setSelectedSizes] = useState([])

  // Estado para controlar se está na etapa de seleção de tamanho
  const [showSizeSelection, setShowSizeSelection] = useState(false)

  // Estado para controlar o toast
  const [toastOpen, setToastOpen] = useState(false)
  const [toastProduct, setToastProduct] = useState(null)

  // Calcular total de camisetas seleccionadas
  const totalSelected = Object.values(selections).reduce((sum, qty) => sum + qty, 0)
  const remainingSlots = 5 - totalSelected
  const canAddToCart = totalSelected >= 1 && totalSelected <= 5

  // Verificar se todos os boxes tem tamanho selecionado
  const allSizesSelected = selectedSizes.length === totalSelected && selectedSizes.every(item => item.size)

  // Calcular preço baseado na quantidade total
  const getCurrentPriceTier = () => {
    if (totalSelected === 0) return null
    return MYSTERYBOX_PRICE_TIERS.find(tier => tier.quantity === totalSelected) || MYSTERYBOX_PRICE_TIERS[0]
  }

  const currentTier = getCurrentPriceTier()
  const savings = currentTier ? (MYSTERYBOX_NORMAL_PRICE * totalSelected) - currentTier.price : 0

  // Função para incrementar quantidade de uma liga
  const handleIncrement = (leagueId) => {
    if (totalSelected < 5) {
      setSelections(prev => ({
        ...prev,
        [leagueId]: prev[leagueId] + 1
      }))
      setSelectedSizes(prev => [...prev, { league: leagueId, size: null }])
    }
  }

  // Função para decrementar quantidade de uma liga
  const handleDecrement = (leagueId) => {
    if (selections[leagueId] > 0) {
      setSelections(prev => ({
        ...prev,
        [leagueId]: prev[leagueId] - 1
      }))
      const indexToRemove = selectedSizes.map((item, idx) => item.league === leagueId ? idx : -1)
        .filter(idx => idx !== -1)
        .pop()
      if (indexToRemove !== undefined) {
        setSelectedSizes(prev => prev.filter((_, idx) => idx !== indexToRemove))
      }
    }
  }

  // Atualizar tamanho de um box específico
  const handleSizeChange = (boxIndex, size) => {
    setSelectedSizes(prev => prev.map((item, idx) =>
      idx === boxIndex ? { ...item, size } : item
    ))
  }

  // Mostrar seleção de tamanho antes de adicionar ao carrinho
  const handleProceedToSizeSelection = () => {
    if (canAddToCart) {
      setShowSizeSelection(true)
    }
  }

  // Função para agregar ao carrito (após selecionar tamanhos)
  const handleAddToCart = () => {
    if (canAddToCart && allSizesSelected) {
      // Pegar o primeiro box para mostrar no toast
      const firstItem = selectedSizes[0]
      const firstBox = mysteryBoxes.find(b => b.id === firstItem.league)

      // Adicionar cada Mystery Box ao carrinho
      selectedSizes.forEach(item => {
        const box = mysteryBoxes.find(b => b.id === item.league)
        if (box) {
          // Buscar dados da Shopify
          const shopifyData = MYSTERY_BOX_SHOPIFY_DATA[box.slug]

          if (!shopifyData) {
            console.error(`Dados da Shopify não encontrados para: ${box.slug}`)
            return
          }

          // Criar um produto com a estrutura completa para checkout
          const product = {
            id: box.id,
            name: shopifyData.title,
            slug: box.slug,
            price: MYSTERYBOX_NORMAL_PRICE,
            main_image: box.image,
            images: [box.image],
            gallery: [box.image],
            league: 'mystery-box',
            // Dados da Shopify para checkout
            shopifyId: shopifyData.shopifyId,
            handle: shopifyData.handle,
            variants: shopifyData.variants
          }
          addToCart(product, item.size, 1)
        }
      })

      // Mostrar toast com informações do primeiro produto adicionado
      if (firstBox) {
        setToastProduct({
          name: `Mystery Box ${firstBox.name}`,
          main_image: firstBox.image,
          price: MYSTERYBOX_NORMAL_PRICE
        })
        setToastOpen(true)
      }

      // Limpar seleções após adicionar
      setShowSizeSelection(false)
      setSelections(mysteryBoxes.reduce((acc, box) => ({ ...acc, [box.id]: 0 }), {}))
      setSelectedSizes([])
    }
  }

  return (
    <section className="py-6 md:py-8 bg-black relative overflow-hidden border-t border-white/5">
      {/* Background Effects - Minimal */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header - Mobile Optimized */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full mb-3 md:mb-4">
            <Package className="w-4 h-4 text-white" />
            <span className="text-white text-xs md:text-sm font-bold uppercase">Mystery Box</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-white mb-2 md:mb-4 px-4 uppercase">
            ¿TE ANIMÁS A LA{' '}
            <em className="not-italic text-white/70">SORPRESA</em>?
          </h2>

          <p className="text-sm md:text-base text-white/70 max-w-2xl mx-auto px-4">
            Elegí tus ligas favoritas. Cuantas más comprás, más barato sale cada una.
          </p>
        </motion.div>

        {/* Price & Counter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mb-8 md:mb-12"
        >
          <div className="text-center mb-6 md:mb-8">
            {/* Selection Counter */}
            <div className="inline-flex items-center gap-3 bg-white/10 border-2 border-white/20 rounded-xl px-6 py-4 shadow-lg backdrop-blur-sm mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shadow-lg">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="text-white font-black text-xl md:text-2xl leading-tight">
                  {totalSelected}/5 Mystery Boxes
                </p>
                {remainingSlots > 0 && totalSelected < 5 && (
                  <p className="text-white/60 text-xs font-medium">
                    Podés agregar {remainingSlots} más
                  </p>
                )}
                {totalSelected === 5 && (
                  <p className="text-white text-xs font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    ¡Máximo descuento!
                  </p>
                )}
              </div>
            </div>

            {/* Price Display */}
            {currentTier && (
              <motion.div
                key={totalSelected}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto"
              >
                {/* Total Price */}
                <div className="p-4 md:p-6 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm">
                  <p className="text-white/60 text-xs md:text-sm mb-2">Precio Total</p>
                  <div className="flex items-baseline justify-center gap-2 mb-1">
                    <span className="text-3xl md:text-4xl font-black text-white">
                      ${(currentTier.price / 1000).toFixed(1)}K
                    </span>
                    {currentTier.discount > 0 && (
                      <span className="px-2 py-1 bg-white text-black text-xs font-black rounded">
                        -{currentTier.discount}%
                      </span>
                    )}
                  </div>
                  <p className="text-white/20 text-xs line-through">
                    Normal: ${(MYSTERYBOX_NORMAL_PRICE * totalSelected).toLocaleString()}
                  </p>
                </div>

                {/* Price Per Box */}
                <div className="p-4 md:p-6 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm">
                  <p className="text-white/60 text-xs md:text-sm mb-2">Precio c/u</p>
                  <div className="flex items-baseline justify-center gap-2 mb-1">
                    <span className="text-3xl md:text-4xl font-black text-white/80">
                      ${(currentTier.pricePerBox / 1000).toFixed(1)}K
                    </span>
                  </div>
                  {savings > 0 && (
                    <p className="text-white/70 text-xs font-bold flex items-center justify-center gap-1">
                      <TrendingDown className="w-3 h-3" />
                      Ahorrás ${savings.toLocaleString()}
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Mystery Box Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 md:mb-12"
        >
          <h3 className="text-xl md:text-2xl font-black text-white text-center mb-4 md:mb-6">
            Elegí tus Ligas
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 md:gap-4 max-w-6xl mx-auto mb-8">
            {mysteryBoxes.map((box, index) => {
              const quantity = selections[box.id]
              const isMaxed = totalSelected >= 5 && quantity === 0

              return (
                <motion.div
                  key={box.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className={`group ${isMaxed ? 'opacity-50' : ''}`}
                >
                  <div
                    className={`relative overflow-hidden rounded-xl bg-gradient-to-br from-white/10 via-white/5 to-black border-2 transition-all shadow-lg ${
                      quantity > 0
                        ? 'border-[#DAF10D] shadow-[#DAF10D]/20'
                        : 'border-white/20'
                    }`}
                  >
                    {/* Image */}
                    <div className="aspect-square p-4 flex items-center justify-center">
                      <div className="relative w-full h-full">
                        <Image
                          src={box.image}
                          alt={box.name}
                          fill
                          className="object-contain drop-shadow-2xl"
                        />
                      </div>
                    </div>

                    {/* Quantity Badge */}
                    {quantity > 0 && (
                      <div className="absolute top-2 right-2 w-8 h-8 bg-[#DAF10D] rounded-full flex items-center justify-center font-black text-black shadow-lg">
                        {quantity}
                      </div>
                    )}

                    {/* Name */}
                    <div className="bg-gradient-to-t from-black via-black/80 to-transparent p-3">
                      <h4 className="text-white font-bold text-xs text-center truncate mb-2">
                        {box.name}
                      </h4>

                      {/* Controls */}
                      <div className="flex items-center justify-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDecrement(box.id)}
                          disabled={quantity === 0}
                          className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                            quantity > 0
                              ? 'bg-[#DAF10D] text-black'
                              : 'bg-white/10 text-white/40 cursor-not-allowed'
                          }`}
                        >
                          <Minus className="w-4 h-4" />
                        </motion.button>

                        <span className="text-white font-bold text-sm w-4 text-center">
                          {quantity}
                        </span>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleIncrement(box.id)}
                          disabled={isMaxed}
                          className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                            !isMaxed
                              ? 'bg-[#DAF10D] text-black'
                              : 'bg-white/10 text-white/40 cursor-not-allowed'
                          }`}
                        >
                          <Plus className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Price Display */}
          {canAddToCart && currentTier && (
            <div className="text-center mb-3">
              <p className="text-white/60 text-sm mb-1">Total</p>
              <p className="text-3xl md:text-4xl font-black text-white">
                ARS ${currentTier.price.toLocaleString('es-AR')}
              </p>
            </div>
          )}

          {/* Add to Cart Button */}
          <div className="text-center">
            <motion.button
              whileHover={canAddToCart ? { scale: 1.02 } : {}}
              whileTap={canAddToCart ? { scale: 0.98 } : {}}
              onClick={handleProceedToSizeSelection}
              disabled={!canAddToCart}
              className={`inline-flex px-4 md:px-6 py-3 md:py-3.5 rounded-lg font-black text-sm md:text-base shadow-lg transition-all items-center justify-center gap-2 uppercase tracking-wide ${
                canAddToCart
                  ? 'bg-[#DAF10D] text-black shadow-[#DAF10D]/20 hover:shadow-xl hover:shadow-[#DAF10D]/30 cursor-pointer'
                  : 'bg-white/10 text-white/40 cursor-not-allowed'
              }`}
            >
              <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
              {canAddToCart ? (
                'CONTINUAR'
              ) : (
                'SELECCIONÁ AL MENOS 1 MYSTERY BOX'
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Price Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto mb-8 md:mb-12"
        >
          <h3 className="text-xl md:text-2xl font-black text-white text-center mb-4 md:mb-6">
            Descuento Progressivo
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
            {MYSTERYBOX_PRICE_TIERS.map((tier) => (
              <div
                key={tier.quantity}
                className={`p-4 rounded-xl border-2 transition-all ${
                  totalSelected === tier.quantity
                    ? 'border-[#DAF10D] bg-white/10'
                    : 'border-white/10 bg-white/5'
                }`}
              >
                <div className="text-center">
                  <p className="text-2xl md:text-3xl font-black text-white mb-1">
                    {tier.quantity}x
                  </p>
                  <p className="text-white/80 text-sm md:text-base font-bold mb-1">
                    ${(tier.price / 1000).toFixed(1)}K
                  </p>
                  <p className="text-white/50 text-xs">
                    ${(tier.pricePerBox / 1000).toFixed(1)}K c/u
                  </p>
                  {tier.discount > 0 && (
                    <div className="mt-2 px-2 py-1 bg-white/20 rounded text-white text-xs font-bold">
                      -{tier.discount}%
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Info Box - Simplified */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <div className="bg-white/5 border-2 border-white/10 rounded-xl md:rounded-2xl p-6 md:p-8">
            <div className="flex items-start gap-3 md:gap-4">
              <Zap className="w-6 h-6 md:w-8 md:h-8 text-white shrink-0" />
              <div>
                <h3 className="text-lg md:text-xl font-black text-white mb-3">
                  ¿Cómo Funciona?
                </h3>
                <ul className="space-y-2 text-white/70 text-sm md:text-base">
                  <li className="flex items-start gap-2">
                    <span className="text-white">•</span>
                    <span>Elegí las ligas que querés (hasta 5 Mystery Boxes)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-white">•</span>
                    <span>Cuantas más comprás, más barato sale cada una</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-white">•</span>
                    <span>Cada Mystery Box = 1 camiseta sorpresa de la liga elegida</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-white">•</span>
                    <span>Calidad 1:1 garantizada en todas las camisetas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-white">•</span>
                    <span className="text-white font-bold">Máximo: 5 Mystery Boxes por pedido</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Size Selection Modal */}
      <AnimatePresence>
        {showSizeSelection && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md"
            onClick={() => setShowSizeSelection(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-white/10 to-black border-2 border-white/20 rounded-2xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="text-center mb-6">
                <h2 className="text-2xl md:text-3xl font-black text-white mb-2 uppercase">
                  Seleccioná los Tamaños
                </h2>
                <p className="text-white/60 text-sm">
                  Elegí el tamaño para cada Mystery Box
                </p>
              </div>

              {/* Size Selection for Each Box */}
              <div className="space-y-4 mb-6">
                {selectedSizes.map((boxItem, index) => {
                  const box = mysteryBoxes.find(b => b.id === boxItem.league)
                  return (
                    <div
                      key={index}
                      className="bg-white/5 border border-white/10 rounded-xl p-4"
                    >
                      {/* Box Info */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="relative w-12 h-12">
                          <Image
                            src={box?.image || ''}
                            alt={box?.name || ''}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <p className="text-white font-bold text-sm">
                            Mystery Box #{index + 1}
                          </p>
                          <p className="text-white/60 text-xs">{box?.name}</p>
                        </div>
                      </div>

                      {/* Size Selector */}
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                        {DEFAULT_SIZES.map((size) => (
                          <button
                            key={size}
                            onClick={() => handleSizeChange(index, size)}
                            className={`relative py-2 px-3 rounded-lg font-bold text-sm transition-all duration-200 ${
                              boxItem.size === size
                                ? 'bg-[#DAF10D] text-black shadow-lg shadow-[#DAF10D]/30 scale-105'
                                : 'bg-white/5 text-white hover:bg-white/10 hover:scale-105 border border-white/10'
                            }`}
                          >
                            {size}
                            {boxItem.size === size && (
                              <Check className="w-3 h-3 absolute top-1 right-1" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Price Summary */}
              {currentTier && (
                <div className="bg-white/10 border border-white/20 rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-white/80 text-sm">Total ({totalSelected} Mystery Boxes)</span>
                    <span className="text-2xl font-black text-white">
                      ARS ${currentTier.price.toLocaleString('es-AR')}
                    </span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSizeSelection(false)}
                  className="flex-1 py-3 rounded-lg font-bold text-sm bg-white/5 text-white hover:bg-white/10 transition-all border border-white/10"
                >
                  Volver
                </button>
                <button
                  onClick={handleAddToCart}
                  disabled={!allSizesSelected}
                  className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                    allSizesSelected
                      ? 'bg-[#DAF10D] text-black shadow-lg shadow-[#DAF10D]/20 hover:shadow-xl hover:shadow-[#DAF10D]/30'
                      : 'bg-white/10 text-white/40 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  {allSizesSelected ? 'Agregar al Carrito' : 'Seleccioná todos los tamaños'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast de Adición al Carrito */}
      <AddToCartToast
        isOpen={toastOpen}
        onClose={() => setToastOpen(false)}
        product={toastProduct}
        size={selectedSizes[0]?.size}
        quantity={totalSelected}
      />
    </section>
  )
}

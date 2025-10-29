'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import SizeSelector from './SizeSelector'
import QuantitySelector from './QuantitySelector'
import AddToCartToast from './AddToCartToast'
import SizeGuideModal from '@/components/SizeGuideModal'
import ReservationCountdown from './ReservationCountdown'
import { useCart } from '@/contexts/CartContext'
import { useFavorites } from '@/contexts/FavoritesContext'
import { ShoppingCart, Package, Shield, Truck, Check, Heart } from 'lucide-react'

const ProductInfo = ({ product }) => {
  const { addToCart } = useCart()
  const { toggleFavorite, isFavorite } = useFavorites()
  const [selectedSize, setSelectedSize] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)
  const [toastOpen, setToastOpen] = useState(false)
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false)
  const [showStickyButton, setShowStickyButton] = useState(false)
  const [showStickyModal, setShowStickyModal] = useState(false)
  const buttonRef = useRef(null)
  
  // Personalização (GRÁTIS com promo 3x1!)
  const [wantsCustomization, setWantsCustomization] = useState(false)
  const [customName, setCustomName] = useState('')
  const [customNumber, setCustomNumber] = useState('')

  const isWishlisted = isFavorite(product.id)

  const {
    name,
    slug,
    price,
    regularPrice,
    sizes = [],
    stock = 'available',
    tags = [],
  } = product

  // Calcula o preço regular como 50% a mais do preço promocional
  const calculatedRegularPrice = price * 1.5
  const displayRegularPrice = regularPrice || calculatedRegularPrice

  // Formata o preço como "AR$ XX.XXX,XX"
  const formatPrice = (value) => {
    const formatted = value.toFixed(2).replace('.', ',')
    const parts = formatted.split(',')
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    return `AR$ ${parts.join(',')}`
  }

  const formattedPrice = formatPrice(price)
  const formattedRegularPrice = formatPrice(displayRegularPrice)

  // Sempre mostra desconto, pois sempre há um preço regular calculado
  const hasDiscount = true
  const discountPercentage = Math.round(((displayRegularPrice - price) / displayRegularPrice) * 100)

  // IntersectionObserver para mostrar sticky button apenas quando botão normal sair da tela
  useEffect(() => {
    const currentButton = buttonRef.current
    if (!currentButton) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Sticky aparece quando botão normal NÃO está visível
        console.log('Button visibility:', entry.isIntersecting)
        setShowStickyButton(!entry.isIntersecting)
      },
      {
        threshold: 0,
        rootMargin: '0px'
      }
    )

    observer.observe(currentButton)

    return () => {
      observer.disconnect()
    }
  }, [])

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Por favor selecciona una talla')
      return
    }

    // Prepara dados de personalização se ativo
    const customization = wantsCustomization ? {
      name: customName.trim() || null,
      number: customNumber.trim() || null
    } : null

    // Add product to cart using CartContext (com personalização opcional)
    addToCart(product, selectedSize, quantity, customization)

    // Show success feedback - button turns green
    setAddedToCart(true)

    // Show toast notification
    setToastOpen(true)

    // Reset button after 2 seconds
    setTimeout(() => {
      setAddedToCart(false)
    }, 2000)
  }

  // Handler para sticky button - verifica tamanho e abre modal se necessário
  const handleStickyAddToCart = () => {
    if (!selectedSize) {
      // Abre modal para selecionar tamanho
      setShowStickyModal(true)
      return
    }
    // Se já tem tamanho, adiciona direto
    handleAddToCart()
  }

  // Selecionar tamanho do modal sticky e adicionar ao carrinho
  const handleSelectSizeFromModal = (size) => {
    setSelectedSize(size)
    setShowStickyModal(false)
    // Adiciona ao carrinho imediatamente após selecionar
    setTimeout(() => {
      addToCart(product, size, quantity)
      setAddedToCart(true)
      setToastOpen(true)
      setTimeout(() => setAddedToCart(false), 2000)
    }, 100)
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Product Title */}
      <div>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight uppercase">
          {name}
        </h1>
      </div>

      {/* Promotional Banner Image */}
      <div className="relative w-full max-w-md rounded-lg overflow-hidden">
        <Image
          src="/images/promo-banner.jpeg"
          alt="Promoción Compra 1 Lleva 3"
          width={600}
          height={150}
          className="w-full h-auto object-cover"
          priority
        />
      </div>

      {/* Price */}
      <div className="space-y-2 py-3 md:py-4">
        <div className="flex items-center gap-2 md:gap-3 flex-wrap">
          <p className="text-2xl md:text-3xl font-bold text-brand-yellow flex-shrink-0 font-sans">
            {formattedPrice}
          </p>
          {hasDiscount && (
            <>
              <p className="text-base md:text-lg text-white/40 line-through flex-shrink-0 font-sans">
                {formattedRegularPrice}
              </p>
              <span className="bg-red-600 text-white text-xs md:text-sm font-semibold px-2.5 py-1 rounded flex-shrink-0">
                -{discountPercentage}%
              </span>
            </>
          )}
        </div>
      </div>

      {/* Size Selector */}
      <SizeSelector
        sizes={sizes}
        selectedSize={selectedSize}
        onSizeChange={setSelectedSize}
        onOpenSizeGuide={() => setSizeGuideOpen(true)}
      />

      {/* Personalización (GRÁTIS!) */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="relative space-y-4 py-6 border-t border-zinc-800/50"
      >
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-yellow/[0.02] via-transparent to-transparent pointer-events-none rounded-lg" />
        
        {/* Toggle Personalización */}
        <div className="relative flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-zinc-900/50 to-zinc-950/50 border border-zinc-800/50 hover:border-brand-yellow/20 transition-all duration-300 group">
          <div className="flex items-center gap-4">
            {/* Custom Checkbox */}
            <div className="relative">
              <input
                type="checkbox"
                id="customization"
                checked={wantsCustomization}
                onChange={(e) => setWantsCustomization(e.target.checked)}
                className="sr-only peer"
              />
              <label
                htmlFor="customization"
                className="flex items-center justify-center w-6 h-6 rounded-md border-2 border-zinc-700 bg-zinc-900 cursor-pointer transition-all duration-300 peer-checked:border-brand-yellow peer-checked:bg-brand-yellow/10 hover:border-brand-yellow/50 group-hover:scale-105"
              >
                {wantsCustomization && (
                  <motion.svg
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="w-4 h-4 text-brand-yellow"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </motion.svg>
                )}
              </label>
            </div>
            
            <label htmlFor="customization" className="text-white font-semibold cursor-pointer group-hover:text-brand-yellow transition-colors duration-300">
              ¿Quieres personalizar tu camiseta?
            </label>
          </div>
          
          <motion.span 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-brand-yellow/20 to-brand-yellow/10 border border-brand-yellow/40 rounded-full text-brand-yellow text-xs font-black uppercase tracking-wider shadow-lg shadow-brand-yellow/10"
          >
            GRÁTIS
          </motion.span>
        </div>

        {/* Campos de Personalização (aparecem quando checkbox marcado) */}
        {wantsCustomization && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="space-y-4 pl-8 relative"
          >
            {/* Linha lateral amarela sutil */}
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-brand-yellow/50 via-brand-yellow/20 to-transparent rounded-full" />
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-sm text-gray-400 mb-4 italic"
            >
              Sin personalización, tu camiseta vendrá con la espalda lisa
            </motion.p>
            
            {/* Campo Nome */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
            >
              <label htmlFor="customName" className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow/60" />
                Nombre (opcional)
              </label>
              <div className="relative group">
                <input
                  type="text"
                  id="customName"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value.toUpperCase().slice(0, 15))}
                  placeholder="MESSI"
                  maxLength={15}
                  className="w-full px-4 py-3 bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-yellow/50 focus:border-brand-yellow/50 hover:border-brand-yellow/30 transition-all duration-300 uppercase font-semibold tracking-wide"
                />
                {/* Subtle glow on focus */}
                <div className="absolute inset-0 rounded-xl bg-brand-yellow/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
              <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1">
                <span className="text-brand-yellow/60">•</span> Máximo 15 caracteres
              </p>
            </motion.div>

            {/* Campo Número */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label htmlFor="customNumber" className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow/60" />
                Número (opcional)
              </label>
              <div className="relative group">
                <input
                  type="text"
                  id="customNumber"
                  value={customNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 2)
                    setCustomNumber(value)
                  }}
                  placeholder="10"
                  maxLength={2}
                  className="w-full px-4 py-3 bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-yellow/50 focus:border-brand-yellow/50 hover:border-brand-yellow/30 transition-all duration-300 font-bold text-xl"
                />
                <div className="absolute inset-0 rounded-xl bg-brand-yellow/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
              <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1">
                <span className="text-brand-yellow/60">•</span> Números 0-99
              </p>
            </motion.div>

            {/* Preview */}
            {(customName || customNumber) && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="relative mt-6 p-6 rounded-2xl overflow-hidden"
              >
                {/* Gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-yellow/10 via-brand-yellow/5 to-transparent" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(218,241,13,0.1),transparent_70%)]" />
                
                {/* Border with gradient */}
                <div className="absolute inset-0 rounded-2xl border border-brand-yellow/20" />
                
                <div className="relative">
                  <p className="text-xs text-gray-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-brand-yellow animate-pulse" />
                    Vista previa
                  </p>
                  <div className="text-center py-4 space-y-2">
                    {customName && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-white font-bold text-xl tracking-[0.2em] drop-shadow-lg"
                      >
                        {customName}
                      </motion.p>
                    )}
                    {customNumber && (
                      <motion.p 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-brand-yellow font-black text-4xl drop-shadow-[0_0_15px_rgba(218,241,13,0.3)]"
                      >
                        {customNumber}
                      </motion.p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Quantity Selector */}
      <QuantitySelector
        quantity={quantity}
        onQuantityChange={setQuantity}
        min={1}
        max={10}
      />

      {/* Action Buttons - Normal Position (sempre visível) */}
      <div ref={buttonRef} className="flex gap-3">
        {/* Add to Cart Button - Takes most space */}
        <button
          onClick={handleAddToCart}
          disabled={stock === 'soldout' || addedToCart}
          className={`
            flex-1 py-3 md:py-4 rounded-lg font-bold text-base md:text-lg uppercase tracking-wide
            flex items-center justify-center gap-2 md:gap-3
            transition-all duration-300
            ${
              stock === 'soldout'
                ? 'bg-white/10 text-white/40 cursor-not-allowed'
                : addedToCart
                ? 'bg-green-500 text-white'
                : 'bg-brand-yellow text-black hover:brightness-110 hover:shadow-xl hover:shadow-brand-yellow/30 active:scale-95 md:hover:scale-105 shadow-lg shadow-brand-yellow/20 transition-all duration-300'
            }
          `}
        >
          {addedToCart ? (
            <>
              <Check className="w-5 h-5 md:w-6 md:h-6" />
              ¡Agregado!
            </>
          ) : (
            <>
              <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
              {stock === 'soldout' ? 'Agotado' : 'Agregar al Carrito'}
            </>
          )}
        </button>

        {/* Wishlist Button */}
        <button
          onClick={() => toggleFavorite(product)}
          className={`
            flex-shrink-0 p-3 md:p-4 rounded-lg font-bold
            flex items-center justify-center gap-2
            transition-all duration-300 active:scale-95
            ${
              isWishlisted
                ? 'bg-brand-yellow text-black'
                : 'bg-white/10 text-white hover:bg-white/20'
            }
          `}
          aria-label={isWishlisted ? 'Remover de favoritos' : 'Agregar a favoritos'}
        >
          <Heart
            className={`w-5 h-5 md:w-6 md:h-6 ${isWishlisted ? 'fill-current' : ''}`}
          />
          <span className="hidden md:inline">
            {isWishlisted ? 'Guardado' : 'Favoritos'}
          </span>
        </button>
      </div>

      {/* Sticky Buttons - Aparecem APENAS quando botões normais saem da tela (Mobile) */}
      {showStickyButton && (
        <div className="fixed bottom-0 left-0 right-0 md:hidden bg-black/95 backdrop-blur-md p-4 border-t border-white/10 z-50 animate-in slide-in-from-bottom duration-200">
          <div className="flex gap-3 max-w-screen-xl mx-auto">
            {/* Add to Cart Button Sticky */}
            <button
              onClick={handleStickyAddToCart}
              disabled={stock === 'soldout' || addedToCart}
              className={`
                flex-1 py-4 rounded-lg font-bold text-base uppercase tracking-wide
                flex items-center justify-center gap-2
                transition-all duration-300 min-h-[52px]
                ${
                  stock === 'soldout'
                    ? 'bg-white/10 text-white/40 cursor-not-allowed'
                    : addedToCart
                    ? 'bg-green-500 text-white'
                    : 'bg-brand-yellow text-black hover:brightness-110 active:scale-95 shadow-lg'
                }
              `}
            >
              {addedToCart ? (
                <>
                  <Check className="w-5 h-5" />
                  ¡Agregado!
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" />
                  {selectedSize ? 'Agregar' : 'Seleccionar Talla'}
                </>
              )}
            </button>

            {/* Wishlist Button Sticky */}
            <button
              onClick={() => toggleFavorite(product)}
              className={`
                flex-shrink-0 p-4 rounded-lg font-bold min-h-[52px]
                flex items-center justify-center
                transition-all duration-300 active:scale-95
                ${
                  isWishlisted
                    ? 'bg-brand-yellow text-black'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }
              `}
              aria-label={isWishlisted ? 'Remover de favoritos' : 'Agregar a favoritos'}
            >
              <Heart
                className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`}
              />
            </button>
          </div>
        </div>
      )}

      {/* Modal de Seleção de Tamanho - Aparece do sticky button */}
      {showStickyModal && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-end md:items-center justify-center"
          onClick={() => setShowStickyModal(false)}
        >
          <div 
            className="bg-gradient-to-b from-zinc-900 to-black border-t-2 border-brand-yellow w-full md:max-w-md md:rounded-2xl md:border-2 p-6 animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="mb-6">
              <h3 className="text-white text-xl font-bold mb-2">Seleccionar Talla</h3>
              <p className="text-gray-400 text-sm">Elige tu talla para continuar</p>
            </div>

            {/* Size Grid */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => handleSelectSizeFromModal(size)}
                  className="py-4 px-4 bg-white/5 border-2 border-white/10 rounded-lg text-white font-bold text-lg hover:border-brand-yellow hover:bg-brand-yellow/10 transition-all active:scale-95"
                >
                  {size}
                </button>
              ))}
            </div>

            {/* Guia de Tallas Link */}
            <button
              onClick={() => {
                setShowStickyModal(false)
                setSizeGuideOpen(true)
              }}
              className="w-full text-center text-brand-yellow text-sm font-semibold hover:underline mb-4"
            >
              Ver Guía de Tallas
            </button>

            {/* Close Button */}
            <button
              onClick={() => setShowStickyModal(false)}
              className="w-full py-3 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Reservation Countdown */}
      <ReservationCountdown />

      {/* Product Features */}
      <div className="space-y-3 pt-4 border-t border-white/10">
        <div className="flex items-start gap-3">
          <Package className="w-5 h-5 text-brand-yellow flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-white font-semibold text-sm">Calidad Premium 1:1</p>
            <p className="text-white/60 text-xs">Máxima calidad garantizada</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Truck className="w-5 h-5 text-brand-yellow flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-white font-semibold text-sm">Envío Rápido</p>
            <p className="text-white/60 text-xs">Recibís en 3-5 días hábiles</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-brand-yellow flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-white font-semibold text-sm">Compra Segura</p>
            <p className="text-white/60 text-xs">Protección al comprador</p>
          </div>
        </div>
      </div>

      {/* Add to Cart Toast Notification */}
      <AddToCartToast
        isOpen={toastOpen}
        onClose={() => setToastOpen(false)}
        product={product}
        size={selectedSize}
        quantity={quantity}
      />

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
      />
    </div>
  )
}

export default ProductInfo

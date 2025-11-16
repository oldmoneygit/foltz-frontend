'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import SizeSelector from './SizeSelector'
import QuantitySelector from './QuantitySelector'
import AddToCartToast from './AddToCartToast'
import SizeGuideModal from '@/components/SizeGuideModal'
import ReservationCountdown from './ReservationCountdown'
import { useCart } from '@/contexts/CartContext'
import { useFavorites } from '@/contexts/FavoritesContext'
import { usePackFoltz } from '@/contexts/PackFoltzContext'
import { ShoppingCart, Package, Shield, Truck, Check, Heart, Shirt } from 'lucide-react'

const ProductInfo = ({ product }) => {
  const { addToCart } = useCart()
  const { toggleFavorite, isFavorite } = useFavorites()
  const { addToPack, isInPack, currentCount, packSize, isComplete, packPrice } = usePackFoltz()
  const [selectedSize, setSelectedSize] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)
  const [toastOpen, setToastOpen] = useState(false)
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false)
  const [showStickyButton, setShowStickyButton] = useState(false)
  const [showStickyModal, setShowStickyModal] = useState(false)
  const [packMessage, setPackMessage] = useState('')
  const [isAddingToPack, setIsAddingToPack] = useState(false)
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

  // Adicionar produto ao Pack Foltz
  const handleAddToPack = async () => {
    if (!selectedSize) {
      alert('Por favor selecciona una talla')
      return
    }

    setIsAddingToPack(true)
    try {
      const packProduct = {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        main_image: product.main_image || product.gallery?.[0] || product.images?.[0],
        images: product.gallery || product.images || [product.main_image],
        gallery: product.gallery || product.images || [product.main_image],
        size: selectedSize,
        league: product.league,
        shopifyId: product.shopifyId,
        variants: product.variants,
        handle: product.handle,
      }

      // Pass addToCart callback so product is added to BOTH pack AND cart
      const result = addToPack(packProduct, addToCart)
      setPackMessage(result.message)

      // Clear message after 3 seconds
      setTimeout(() => {
        setPackMessage('')
      }, 3000)
    } catch (error) {
      console.error('Error adding to pack:', error)
      setPackMessage('Error al agregar al pack')
    } finally {
      setIsAddingToPack(false)
    }
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Product Title */}
      <div>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight uppercase">
          {name}
        </h1>
      </div>

      {/* Price Section - Retrobox Style with Foltz Colors */}
      <div className="space-y-3">
        {/* Black November Badge */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-red-600 to-red-500 text-white text-xs font-black uppercase tracking-wide rounded-md">
            <span className="text-sm">🔥</span>
            BLACK NOVEMBER
          </span>
          {hasDiscount && (
            <span className="px-3 py-1.5 bg-zinc-900 border border-zinc-700 text-white text-xs font-bold rounded-md">
              -{discountPercentage}% OFF
            </span>
          )}
        </div>

        {/* Prices */}
        <div className="space-y-1">
          {hasDiscount && (
            <p className="text-lg text-white/50 line-through font-mono">
              ${displayRegularPrice.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </p>
          )}
          <p className="text-4xl md:text-5xl font-black text-white tracking-tight">
            ${price.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </p>
        </div>
      </div>

      {/* Size Selector */}
      <SizeSelector
        sizes={sizes}
        selectedSize={selectedSize}
        onSizeChange={setSelectedSize}
        onOpenSizeGuide={() => setSizeGuideOpen(true)}
      />

      {/* Personalización - Retrobox Style */}
      <div className="space-y-4 border-t border-zinc-800 pt-6">
        {/* Header with Icon */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-zinc-900 rounded-lg flex items-center justify-center">
            <Shirt className="w-5 h-5 text-brand-yellow" />
          </div>
          <div>
            <h3 className="text-white font-bold text-base">Personalización</h3>
            <p className="text-gray-400 text-xs">Agregá nombre y número a tu camiseta</p>
          </div>
          <span className="ml-auto bg-green-500/20 text-green-400 text-xs font-bold px-2.5 py-1 rounded-md uppercase">
            GRATIS
          </span>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setWantsCustomization(!wantsCustomization)}
          className={`w-full p-4 rounded-lg border-2 transition-all duration-300 flex items-center justify-between ${
            wantsCustomization
              ? 'bg-brand-yellow/10 border-brand-yellow text-brand-yellow'
              : 'bg-zinc-900 border-zinc-700 text-white hover:border-zinc-600'
          }`}
        >
          <span className="font-semibold">
            {wantsCustomization ? 'Personalización activada' : '¿Quieres personalizar tu camiseta?'}
          </span>
          <div className={`w-12 h-6 rounded-full transition-all duration-300 relative ${
            wantsCustomization ? 'bg-brand-yellow' : 'bg-zinc-700'
          }`}>
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${
              wantsCustomization ? 'right-1' : 'left-1'
            }`} />
          </div>
        </button>

        {/* Campos de Personalização */}
        {wantsCustomization && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 bg-zinc-900/50 p-4 rounded-lg border border-zinc-800"
          >
            <p className="text-sm text-gray-400">
              Sin personalización, tu camiseta vendrá con la espalda lisa
            </p>

            {/* Campo Nome */}
            <div>
              <label htmlFor="customName" className="block text-sm font-medium text-white mb-2">
                Nombre (opcional)
              </label>
              <input
                type="text"
                id="customName"
                value={customName}
                onChange={(e) => setCustomName(e.target.value.toUpperCase().slice(0, 15))}
                placeholder="MESSI"
                maxLength={15}
                className="w-full px-4 py-3 bg-black border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand-yellow transition-colors uppercase font-bold tracking-wider"
              />
              <p className="text-xs text-gray-500 mt-1">
                Máximo 15 caracteres
              </p>
            </div>

            {/* Campo Número */}
            <div>
              <label htmlFor="customNumber" className="block text-sm font-medium text-white mb-2">
                Número (opcional)
              </label>
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
                className="w-full px-4 py-3 bg-black border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand-yellow transition-colors font-bold text-xl"
              />
              <p className="text-xs text-gray-500 mt-1">
                Números 0-99
              </p>
            </div>

            {/* Preview */}
            {(customName || customNumber) && (
              <div className="mt-4 p-4 bg-black rounded-lg border border-zinc-700">
                <p className="text-xs text-gray-400 mb-3 uppercase tracking-wider">
                  Vista previa
                </p>
                <div className="text-center py-4 space-y-1">
                  {customName && (
                    <p className="text-white font-bold text-lg tracking-[0.2em]">
                      {customName}
                    </p>
                  )}
                  {customNumber && (
                    <p className="text-brand-yellow font-black text-3xl">
                      {customNumber}
                    </p>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Quantity Selector */}
      <QuantitySelector
        quantity={quantity}
        onQuantityChange={setQuantity}
        min={1}
        max={10}
      />

      {/* Pack Message Feedback */}
      {packMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`text-center py-3 px-4 rounded-lg text-sm font-semibold ${
            packMessage.includes('agregado')
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}
        >
          {packMessage}
        </motion.div>
      )}

      {/* Add to Pack Button - MAIN CTA - Most prominent */}
      {stock !== 'soldout' && !isComplete && (
        <motion.button
          onClick={handleAddToPack}
          disabled={!selectedSize || isAddingToPack || (selectedSize && isInPack(product.id, selectedSize))}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="w-full bg-brand-yellow text-black font-black uppercase py-4 md:py-5 rounded-xl hover:brightness-110 hover:shadow-2xl hover:shadow-brand-yellow/40 active:scale-95 md:hover:scale-[1.02] shadow-xl shadow-brand-yellow/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-base md:text-lg relative overflow-hidden"
        >
          {/* Animated background effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer" />

          {isAddingToPack ? (
            <>
              <div className="w-6 h-6 border-3 border-black border-t-transparent rounded-full animate-spin" />
              Agregando al Pack...
            </>
          ) : selectedSize && isInPack(product.id, selectedSize) ? (
            <>
              <Check className="w-6 h-6" />
              Ya está en el Pack
            </>
          ) : (
            <>
              <Package className="w-6 h-6" />
              <span>AGREGAR AL PACK</span>
              <span className="bg-black/20 px-2 py-0.5 rounded-md text-sm font-bold">
                {currentCount}/{packSize}
              </span>
            </>
          )}
        </motion.button>
      )}

      {/* Action Buttons - Normal Position (sempre visível) */}
      <div ref={buttonRef} className="flex gap-3">
        {/* Add to Cart Button - Secondary option */}
        <button
          onClick={handleAddToCart}
          disabled={stock === 'soldout' || addedToCart}
          className={`
            flex-1 py-3 md:py-4 rounded-lg font-bold text-sm md:text-base uppercase tracking-wide
            flex items-center justify-center gap-2
            transition-all duration-300
            ${
              stock === 'soldout'
                ? 'bg-white/10 text-white/40 cursor-not-allowed'
                : addedToCart
                ? 'bg-green-500 text-white'
                : 'bg-green-900/60 text-green-100 hover:bg-green-800/70 border border-green-700/50 active:scale-95'
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
              {stock === 'soldout' ? 'Agotado' : 'Agregar Solo'}
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
            {/* Add to Pack Button Sticky */}
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
                  <Package className="w-5 h-5" />
                  {selectedSize ? 'Agregar al Pack' : 'Seleccionar Talla'}
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

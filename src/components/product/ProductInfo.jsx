'use client'

import { useState } from 'react'
import SizeSelector from './SizeSelector'
import QuantitySelector from './QuantitySelector'
import AddToCartToast from './AddToCartToast'
import { useCart } from '@/contexts/CartContext'
import { ShoppingCart, Package, Shield, Truck, Check, Heart } from 'lucide-react'

const ProductInfo = ({ product }) => {
  const { addToCart } = useCart()
  const [selectedSize, setSelectedSize] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [toastOpen, setToastOpen] = useState(false)

  const {
    name,
    slug,
    price,
    regularPrice,
    sizes = [],
    stock = 'available',
    tags = [],
  } = product

  const formattedPrice = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(price)

  const formattedRegularPrice = regularPrice
    ? new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 0,
      }).format(regularPrice)
    : null

  const hasDiscount = regularPrice && regularPrice > price
  const discountPercentage = hasDiscount
    ? Math.round(((regularPrice - price) / regularPrice) * 100)
    : 0

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Por favor selecciona una talla')
      return
    }

    // Add product to cart using CartContext
    addToCart(product, selectedSize, quantity)

    // Show success feedback - button turns green
    setAddedToCart(true)

    // Show toast notification
    setToastOpen(true)

    // Reset button after 2 seconds
    setTimeout(() => {
      setAddedToCart(false)
    }, 2000)
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Product Title */}
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">
          {name}
        </h1>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-xs text-brand-yellow/80 bg-brand-yellow/10 px-2 py-1 rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Promotional Banner */}
      <div className="relative w-full max-w-sm md:max-w-md bg-gradient-to-r from-brand-yellow via-yellow-400 to-brand-yellow rounded-lg p-1 overflow-hidden">
        <div className="bg-black rounded-lg p-4 md:p-6 relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-yellow/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-brand-yellow/10 rounded-full blur-3xl" />

          {/* Content */}
          <div className="relative z-10 flex items-center justify-between gap-4">
            <div className="flex-1">
              <p className="text-brand-yellow text-xs md:text-sm font-bold uppercase tracking-wider mb-1">Promoción</p>
              <h3 className="text-white text-xl md:text-2xl font-black uppercase leading-tight">
                COMPRA 1<br />LLEVA 2
              </h3>
            </div>
            <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 bg-brand-yellow rounded-full flex items-center justify-center shadow-lg">
              <span className="text-black text-2xl md:text-3xl font-black">2x1</span>
            </div>
          </div>
        </div>
      </div>

      {/* Price */}
      <div className="space-y-2 border-t border-b border-white/10 py-3 md:py-4">
        <div className="flex items-baseline gap-2 md:gap-3">
          <p className="text-2xl md:text-4xl font-bold text-brand-yellow flex-shrink-0">
            {formattedPrice}
          </p>
          {hasDiscount && (
            <>
              <p className="text-base md:text-xl text-white/40 line-through flex-shrink-0">
                {formattedRegularPrice}
              </p>
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded flex-shrink-0">
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
      />

      {/* Quantity Selector */}
      <QuantitySelector
        quantity={quantity}
        onQuantityChange={setQuantity}
        min={1}
        max={10}
      />

      {/* Action Buttons - Add to Cart & Wishlist */}
      <div className="flex gap-3">
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
                : 'bg-brand-yellow text-black hover:bg-yellow-400 active:scale-95 md:hover:scale-105 shadow-lg shadow-brand-yellow/20'
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
          onClick={() => setIsWishlisted(!isWishlisted)}
          className={`
            flex-shrink-0 p-3 md:p-4 rounded-lg font-bold
            flex items-center justify-center gap-2
            transition-all duration-300
            ${
              isWishlisted
                ? 'bg-brand-yellow text-black'
                : 'bg-white/10 text-white hover:bg-white/20'
            }
          `}
        >
          <Heart
            className={`w-5 h-5 md:w-6 md:h-6 ${isWishlisted ? 'fill-current' : ''}`}
          />
          <span className="hidden md:inline">
            {isWishlisted ? 'Guardado' : 'Favoritos'}
          </span>
        </button>
      </div>

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
    </div>
  )
}

export default ProductInfo

'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, X, Package } from 'lucide-react'
import { usePackFoltz } from '@/contexts/PackFoltzContext'

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const { id, name, slug, image, price, size, quantity, league, customization } = item
  const { isInPack } = usePackFoltz()

  const itemTotal = price * quantity

  // Formata o preço como "AR$ XX.XXX,XX"
  const formatPrice = (value) => {
    const formatted = value.toFixed(2).replace('.', ',')
    const parts = formatted.split(',')
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    return `AR$ ${parts.join(',')}`
  }

  const formattedPrice = formatPrice(price)
  const formattedItemTotal = formatPrice(itemTotal)

  const handleDecrease = () => {
    if (quantity > 1) {
      onUpdateQuantity(id, size, quantity - 1)
    }
  }

  const handleIncrease = () => {
    if (quantity < 10) {
      onUpdateQuantity(id, size, quantity + 1)
    }
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 md:p-6 hover:border-brand-yellow/30 transition-all duration-300">
      <div className="flex gap-4 md:gap-6">
        {/* Product Image */}
        <Link
          href={`/ligas/${league?.id || league}/${slug}`}
          className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 bg-white/5 rounded-lg overflow-hidden group"
        >
          <div className="relative w-full h-full">
            <Image
              src={image || '/images/placeholder-product.jpg'}
              alt={name}
              fill
              className="object-contain group-hover:scale-110 transition-transform duration-300"
              sizes="128px"
            />
          </div>
        </Link>

        {/* Product Info */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            {/* Product Name */}
            <Link
              href={`/ligas/${league?.id || league}/${slug}`}
              className="block mb-2 hover:text-brand-yellow transition-colors"
            >
              <h3 className="text-base md:text-lg font-bold text-white line-clamp-2">
                {name}
              </h3>
            </Link>

            {/* Size */}
            <p className="text-white/60 text-sm mb-1">
              Talla: <span className="text-white font-semibold">{size}</span>
            </p>

            {/* Pack Foltz Badge */}
            {isInPack(id, size) && (
              <div className="mb-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-brand-yellow/20 border border-brand-yellow/40 rounded text-brand-yellow text-xs font-bold">
                  <Package className="w-3 h-3" />
                  PACK FOLTZ
                </span>
              </div>
            )}

            {/* Personalización (si existe) */}
            {customization && (customization.name || customization.number) && (
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center px-2 py-0.5 bg-brand-yellow/20 border border-brand-yellow/40 rounded text-brand-yellow text-xs font-bold">
                    PERSONALIZADO
                  </span>
                  <span className="text-white text-sm">
                    {customization.name && <span className="font-semibold">{customization.name}</span>}
                    {customization.name && customization.number && <span className="text-white/60"> • </span>}
                    {customization.number && <span className="font-bold text-brand-yellow">#{customization.number}</span>}
                  </span>
                </div>
                <p className="text-white/50 text-xs italic bg-white/5 border border-white/10 rounded px-2 py-1.5">
                  ℹ️ La personalización estará registrada en tu pedido, aunque no aparezca visualmente en el checkout.
                </p>
              </div>
            )}

            {!customization && (
              <p className="text-white/40 text-xs mb-3 italic">Espalda lisa</p>
            )}

            {/* Price */}
            <p className="text-brand-yellow text-xl md:text-2xl font-bold">
              {formattedPrice}
            </p>
          </div>

          {/* Quantity Controls & Remove - Mobile & Desktop */}
          <div className="flex items-center justify-between gap-4 mt-4">
            {/* Quantity Selector */}
            <div className="flex items-center gap-2 bg-black/50 border border-white/20 rounded-lg p-1">
              <button
                onClick={handleDecrease}
                className="w-8 h-8 flex items-center justify-center text-white hover:text-brand-yellow transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={quantity === 1}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-white font-bold text-base md:text-lg w-8 text-center">
                {quantity}
              </span>
              <button
                onClick={handleIncrease}
                className="w-8 h-8 flex items-center justify-center text-white hover:text-brand-yellow transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={quantity === 10}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Item Total */}
            <div className="hidden md:block text-right">
              <p className="text-white/60 text-xs mb-1">Total</p>
              <p className="text-white text-lg font-bold">
                {formattedItemTotal}
              </p>
            </div>

            {/* Remove Button */}
            <button
              onClick={() => onRemove(id, size)}
              className="w-9 h-9 flex items-center justify-center bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
              aria-label="Eliminar producto"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Item Total - Mobile Only */}
          <div className="md:hidden mt-3 pt-3 border-t border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-white/60 text-sm">Total del producto:</span>
              <span className="text-white text-lg font-bold">
                {formattedItemTotal}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartItem

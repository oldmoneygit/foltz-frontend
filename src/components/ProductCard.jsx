'use client'

import { memo, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, Clock } from 'lucide-react'
import { useFavorites } from '@/contexts/FavoritesContext'
import { useStoreMode } from '@/contexts/StoreModeContext'
import { motion } from 'framer-motion'
import QuickViewModal from '@/components/product/QuickViewModal'
import { getThumbnailUrl, getBlurPlaceholder } from '@/utils/imageOptimizer'
import { BlackNovemberRibbon } from '@/components/BlackNovemberBadge'

function ProductCard({ product, priority = false, index = 999, showBlackNovemberBadge = false }) {
  const { toggleFavorite, isFavorite } = useFavorites()
  const { isRetro } = useStoreMode()
  const isWishlisted = isFavorite(product.id)
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)

  // Otimiza URL da imagem Shopify para thumbnail (400px)
  const optimizedImageUrl = useMemo(() => {
    const originalUrl = product.main_image || product.image
    return getThumbnailUrl(originalUrl)
  }, [product.main_image, product.image])

  // Primeiros 8 produtos carregam com prioridade (above the fold)
  const shouldPrioritize = priority || index < 8

  // Check if product is retro (has modo:retro tag)
  const isRetroProduct = useMemo(() => {
    return product.tags?.some(tag =>
      tag.toLowerCase().includes('retro') || tag.toLowerCase().includes('vintage')
    ) || false
  }, [product.tags])

  // Formata o preço como "AR$ XX.XXX,XX" - Memoizado para performance
  const formatPrice = useMemo(() => (value) => {
    const formatted = value.toFixed(2).replace('.', ',')
    const parts = formatted.split(',')
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    return `AR$ ${parts.join(',')}`
  }, [])

  const formattedPrice = useMemo(() => formatPrice(product.price), [product.price, formatPrice])
  const formattedRegularPrice = useMemo(() => 
    product.regularPrice ? formatPrice(product.regularPrice) : null,
    [product.regularPrice, formatPrice]
  )

  const getStockBadge = () => {
    switch (product.stock) {
      case 'limited':
        return (
          <div className="absolute top-2 left-2 z-10 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
            Stock Limitado
          </div>
        )
      case 'soldout':
        return (
          <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
            Agotado
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="group h-full flex flex-col">
      <Link href={`/product/${product.slug}`} className="flex-1 flex flex-col">
        <div className="relative bg-gradient-to-br from-zinc-900 to-black rounded-2xl overflow-hidden border border-zinc-800 hover:border-white/30 transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full flex flex-col">
          {/* Black November Badge - Only show when showBlackNovemberBadge is true (homepage) */}
          {showBlackNovemberBadge && (
            <BlackNovemberRibbon variant={isRetro || isRetroProduct ? 'retro' : 'modern'} />
          )}

          {/* Stock Badge */}
          {getStockBadge()}

          {/* Retro Badge - Show when product is retro or in retro mode */}
          {(isRetroProduct || isRetro) && !product.stock && (
            <div className="absolute top-10 left-2 z-10 bg-[#D4AF37] text-[#0D0C0A] text-[10px] font-bold px-2 py-0.5 rounded-md uppercase flex items-center gap-1">
              <Clock size={10} />
              RETRO
            </div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault()
              toggleFavorite(product)
            }}
            className="absolute top-2 right-2 z-10 p-2.5 bg-black/60 backdrop-blur-md rounded-full
                     hover:bg-white/20 transition-all duration-200 active:scale-95"
            aria-label={isWishlisted ? 'Remover de favoritos' : 'Agregar a favoritos'}
          >
            <Heart
              size={20}
              className={`${
                isWishlisted ? 'fill-white text-white' : 'text-white'
              } transition-colors`}
            />
          </button>

        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-zinc-900">
          <Image
            src={optimizedImageUrl}
            alt={product.name}
            fill
            className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 45vw, (max-width: 768px) 30vw, (max-width: 1024px) 23vw, 18vw"
            quality={65}
            priority={shouldPrioritize}
            placeholder="blur"
            blurDataURL={getBlurPlaceholder()}
          />
        </div>

          {/* Content */}
          <div className="p-3 flex flex-col flex-grow space-y-2 items-center text-center">
            {/* Product Name */}
            <h3 className="text-sm font-bold text-white leading-tight line-clamp-2 group-hover:text-white/80 transition-colors min-h-[2.5rem] uppercase">
              {product.name}
            </h3>

            {/* Prices */}
            <div className="space-y-1 mt-auto flex flex-col items-center">
              {formattedRegularPrice && (
                <div className="flex items-center gap-2">
                  <p className="text-gray-400 text-xs line-through">
                    {formattedRegularPrice}
                  </p>
                  <span className="text-[10px] font-black bg-red-500 text-white px-1.5 py-0.5 rounded">
                    -50%
                  </span>
                </div>
              )}
              <p className="text-white font-bold text-base">
                {formattedPrice}
              </p>
            </div>
          </div>
        </div>
      </Link>

      {/* Ver Detalles Button - Outside Link - Discreet */}
      {product.stock !== 'soldout' && (
        <motion.button
          onClick={() => setIsQuickViewOpen(true)}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 font-semibold py-2 md:py-2.5 rounded-lg transition-all duration-300 text-[10px] md:text-xs text-center whitespace-nowrap mt-2"
        >
          Ver Detalles
        </motion.button>
      )}

      {/* QuickView Modal */}
      <QuickViewModal
        product={product}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </div>
  )
}

// Memo previne re-renders desnecessários (PERFORMANCE!)
export default memo(ProductCard)

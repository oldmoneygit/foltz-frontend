'use client'

import { memo, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { useFavorites } from '@/contexts/FavoritesContext'

function ProductCard({ product }) {
  const { toggleFavorite, isFavorite } = useFavorites()
  const isWishlisted = isFavorite(product.id)

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
    <Link href={`/product/${product.slug}`}>
      <div className="group relative bg-gradient-to-br from-zinc-900 to-black rounded-2xl overflow-hidden border border-zinc-800 hover:border-brand-yellow/50 transition-all duration-300 hover:-translate-y-2 cursor-pointer h-full flex flex-col">
        {/* Stock Badge */}
        {getStockBadge()}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault()
            toggleFavorite(product)
          }}
          className="absolute top-2 right-2 z-10 p-2.5 bg-black/60 backdrop-blur-md rounded-full
                   hover:bg-brand-yellow transition-all duration-200 active:scale-95"
          aria-label={isWishlisted ? 'Remover de favoritos' : 'Agregar a favoritos'}
        >
          <Heart
            size={20}
            className={`${
              isWishlisted ? 'fill-brand-yellow text-brand-yellow' : 'text-white'
            } transition-colors`}
          />
        </button>

        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-zinc-900">
          <Image
            src={product.main_image || product.image}
            alt={product.name}
            fill
            className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 45vw, (max-width: 768px) 30vw, (max-width: 1024px) 23vw, 18vw"
            quality={85}
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          />
        </div>

        {/* Content */}
        <div className="p-3 flex flex-col flex-grow space-y-2 items-center text-center">
          {/* Product Name */}
          <h3 className="text-sm font-bold text-white leading-tight line-clamp-2 group-hover:text-brand-yellow transition-colors min-h-[2.5rem] uppercase">
            {product.name}
          </h3>

          {/* Prices and Badge */}
          <div className="space-y-1.5 mt-auto flex flex-col items-center">
            {/* Prices */}
            {formattedRegularPrice && (
              <p className="text-gray-400 text-xs line-through">
                {formattedRegularPrice}
              </p>
            )}
            <p className="text-brand-yellow font-bold text-base">
              {formattedPrice}
            </p>

            {/* COMPRA 1 LLEVA 3 Badge - Compacto */}
            {product.stock !== 'soldout' && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-yellow rounded-full">
                <span className="text-black text-[10px] md:text-xs font-black uppercase tracking-tight md:tracking-wide whitespace-nowrap">COMPRA 1 LLEVA 3</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

// Memo previne re-renders desnecessários (PERFORMANCE!)
export default memo(ProductCard)

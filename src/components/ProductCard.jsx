'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart } from 'lucide-react'

export default function ProductCard({ product }) {
  const [isWishlisted, setIsWishlisted] = useState(false)

  const formattedPrice = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(product.price)

  const formattedRegularPrice = product.regularPrice
    ? new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 0,
      }).format(product.regularPrice)
    : null

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
            setIsWishlisted(!isWishlisted)
          }}
          className="absolute top-2 right-2 z-10 p-2 bg-black/60 backdrop-blur-md rounded-full
                   hover:bg-brand-yellow transition-all"
        >
          <Heart
            size={18}
            className={`${
              isWishlisted ? 'fill-brand-yellow text-brand-yellow' : 'text-white'
            } transition-colors`}
          />
        </button>

        {/* Image Container */}
        <div className="relative aspect-[3/4] bg-zinc-900 overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            quality={75}
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          />
        </div>

        {/* Content */}
        <div className="p-3 flex flex-col flex-grow space-y-2">
          {/* Product Name */}
          <h3 className="text-base font-bold text-white leading-tight line-clamp-2 group-hover:text-brand-yellow transition-colors min-h-[2.5rem]">
            {product.name}
          </h3>

          {/* Prices and Badge */}
          <div className="space-y-1.5 mt-auto">
            {/* Prices */}
            {formattedRegularPrice && (
              <p className="text-gray-400 text-base line-through">
                {formattedRegularPrice}
              </p>
            )}
            <p className="text-brand-yellow font-bold text-xl">
              {formattedPrice}
            </p>

            {/* COMPRA 1 LLEVA 2 Badge - Compacto */}
            {product.stock !== 'soldout' && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-yellow rounded-full">
                <span className="text-black text-[10px] md:text-xs font-black uppercase tracking-tight md:tracking-wide whitespace-nowrap">COMPRA 1 LLEVA 2</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

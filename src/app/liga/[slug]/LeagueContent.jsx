'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { useState } from 'react';
import Footer from '@/components/Footer';

const ProductCard = ({ product, index }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const formattedPrice = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(product.price || 82713.38);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group relative bg-black/40 backdrop-blur-sm rounded-lg overflow-hidden
                 transition-all duration-300 ease-out
                 hover:bg-black/50 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/50"
    >
      {/* Image Container */}
      <Link href={`/product/${product.id}`} className="block relative aspect-square bg-zinc-900/50">
        {/* Badge Promocional - Top Left */}
        {product.image_count && (
          <div className="absolute top-2 left-2 z-10 bg-brand-yellow text-black px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider shadow-xl">
            📸 {product.image_count} fotos
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsWishlisted(!isWishlisted);
          }}
          className="absolute top-2 right-2 z-10 p-1.5 bg-black/60 backdrop-blur-md rounded-full
                     hover:bg-brand-navy transition-all opacity-80 hover:opacity-100"
        >
          <Heart
            size={18}
            className={`${isWishlisted ? 'fill-brand-yellow text-brand-yellow' : 'text-white'} transition-colors`}
          />
        </button>

        {product.main_image ? (
          <Image
            src={product.main_image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
            loading={index < 8 ? 'eager' : 'lazy'}
            quality={75}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600">
            Sin imagen
          </div>
        )}
      </Link>

      {/* Content Area */}
      <div className="p-3 space-y-2 flex flex-col">
        {/* Product Name */}
        <Link href={`/product/${product.id}`}>
          <h3 className="font-bold text-white text-base leading-tight line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>
        </Link>

        {/* Prices and Badge */}
        <div className="space-y-1.5 mt-auto">
          {/* Prices */}
          <p className="text-gray-400 line-through text-base">AR$ 115.798</p>
          <p className="text-brand-yellow font-bold text-xl">{formattedPrice}</p>

          {/* Badge COMPRA 1 LLEVA 2 - Compacto */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-yellow rounded-full">
            <span className="text-black text-[10px] md:text-xs font-black uppercase tracking-tight md:tracking-wide whitespace-nowrap">COMPRA 1 LLEVA 2</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function LeagueContent({ league, products = [] }) {
  // Products are now passed from the Server Component

  if (!league) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-black text-white mb-4">Liga não encontrada</h1>
          <Link href="/ligas">
            <button className="bg-brand-yellow text-brand-navy hover:bg-brand-navy hover:text-brand-yellow
                             px-8 py-4 rounded-full font-black uppercase tracking-wide text-sm
                             transition-colors duration-300">
              Ver todas as ligas
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16 transition-colors duration-300 dark:bg-[#0A0A0A] bg-black">
      <div className="container mx-auto px-4 md:px-6 py-8">
        {/* Hero Section - SNKHOUSE Style */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Left Side - Banner with League Image Only */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-5 relative rounded-2xl overflow-hidden"
          >
            <div className="relative h-[500px] lg:h-[600px]">
              {/* League Image Background */}
              {league.image && (
                <Image
                  src={league.image}
                  alt={league.name}
                  fill
                  className="object-cover"
                  priority
                  quality={85}
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                />
              )}

              {/* Dark Overlay for better contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />
            </div>
          </motion.div>

          {/* Right Side - Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-7 flex flex-col justify-center space-y-6"
          >
            <div>
              <h2 className="text-brand-yellow text-xs md:text-sm font-black uppercase tracking-[0.3em] mb-2">
                COLECCIÓN
              </h2>
              <h3 className="text-4xl md:text-5xl font-black uppercase text-white mb-4">
                {league.name}
              </h3>
            </div>

            {/* Product Count */}
            <div>
              <span className="text-5xl md:text-6xl font-black text-brand-yellow">
                {league.productCount}
              </span>
              <span className="text-white text-xl ml-2">productos</span>
            </div>

            {/* Features List */}
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-white">
                <span className="text-brand-yellow text-xl">●</span>
                <span className="text-base md:text-lg">Calidad Premium 1:1</span>
              </li>
              <li className="flex items-center gap-3 text-white">
                <span className="text-brand-yellow text-xl">●</span>
                <span className="text-base md:text-lg">Envío rápido y seguro</span>
              </li>
              <li className="flex items-center gap-3 text-white">
                <span className="text-brand-yellow text-xl">●</span>
                <span className="text-base md:text-lg">Compra 1 Lleva 2</span>
              </li>
            </ul>

            {/* Country Badge */}
            <div className="flex items-center gap-3 pt-4 border-t border-white/10">
              <span className="text-4xl">{league.flag}</span>
              <div>
                <div className="text-gray-400 text-xs uppercase tracking-wider">País</div>
                <div className="text-white font-bold text-lg">{league.country}</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Products Section */}
        <div id="productos">
          {products.length > 0 ? (
            <>
              {/* Product Counter - SNKHOUSE Style */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-6"
              >
                <p className="text-gray-400 text-sm">
                  Mostrando <span className="text-brand-yellow font-bold">1 - {products.length}</span> de{' '}
                  <span className="text-brand-yellow font-bold">{products.length}</span> productos
                </p>
              </motion.div>

              {/* Products Grid - 4 columns like SNKHOUSE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-12">
                {products.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center text-gray-400 text-xl py-12">
              Pronto tendremos nuevos productos de esta liga!
            </div>
          )}
        </div>

      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

'use client'

import { useFavorites } from '@/contexts/FavoritesContext'
import ProductCard from '@/components/ProductCard'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Heart, ShoppingBag } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function FavoritesPage() {
  const { favorites, clearFavorites } = useFavorites()

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Heart className="w-8 h-8 text-brand-yellow fill-brand-yellow" />
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase">
                Mis Favoritos
              </h1>
            </div>
            <p className="text-white/60 text-lg">
              {favorites.length === 0
                ? 'Aún no tienes productos favoritos'
                : `${favorites.length} ${favorites.length === 1 ? 'producto guardado' : 'productos guardados'}`}
            </p>
          </motion.div>

          {/* Empty State */}
          {favorites.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md mx-auto text-center py-20"
            >
              <div className="w-24 h-24 mx-auto mb-6 bg-white/5 rounded-full flex items-center justify-center">
                <Heart className="w-12 h-12 text-white/40" />
              </div>
              <h2 className="text-2xl font-bold mb-3">
                No hay favoritos aún
              </h2>
              <p className="text-white/60 mb-8">
                Explora nuestro catálogo y guarda tus jerseys favoritos haciendo clic en el corazón
              </p>
              <Link
                href="/#bestsellers"
                className="inline-flex items-center gap-2 bg-brand-yellow text-black px-8 py-4 rounded-lg font-bold uppercase hover:bg-yellow-400 transition-all duration-300 active:scale-95"
              >
                <ShoppingBag className="w-5 h-5" />
                Ver Productos
              </Link>
            </motion.div>
          ) : (
            <>
              {/* Clear Button */}
              <div className="flex justify-end mb-6">
                <button
                  onClick={() => {
                    if (window.confirm('¿Estás seguro de que quieres eliminar todos los favoritos?')) {
                      clearFavorites()
                    }
                  }}
                  className="text-white/60 hover:text-red-500 text-sm font-semibold transition-colors"
                >
                  Limpiar todos
                </button>
              </div>

              {/* Products Grid */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
              >
                {favorites.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>

              {/* Call to Action */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-16 text-center"
              >
                <div className="max-w-2xl mx-auto bg-gradient-to-br from-zinc-900 to-black rounded-2xl border border-zinc-800 p-8">
                  <h3 className="text-2xl font-bold mb-4">
                    ¿Listo para comprar?
                  </h3>
                  <p className="text-white/60 mb-6">
                    ¡Aprovecha la promoción 3x1! Compra 1 y lleva 3 jerseys
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      href="/#bestsellers"
                      className="inline-flex items-center justify-center gap-2 bg-white/10 text-white px-6 py-3 rounded-lg font-bold hover:bg-white/20 transition-all duration-300"
                    >
                      Ver Más Productos
                    </Link>
                    <Link
                      href="/carrito"
                      className="inline-flex items-center justify-center gap-2 bg-brand-yellow text-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-400 transition-all duration-300"
                    >
                      <ShoppingBag className="w-5 h-5" />
                      Ir al Carrito
                    </Link>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

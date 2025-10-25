'use client'

import Link from 'next/link'
import { ChevronLeft, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function CarrinhoPage() {
  // Estado vazio por enquanto - será integrado com contexto depois
  const cartItems = []

  return (
    <>
      <Header />
      <main className="min-h-screen bg-black">
        {/* Back Button */}
        <div className="container mx-auto px-4 pt-6 md:pt-8 pb-4 md:pb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/60 hover:text-brand-yellow transition-colors text-sm md:text-base"
          >
            <ChevronLeft className="w-4 h-4" />
            Voltar à loja
          </Link>
        </div>

        {/* Cart Content */}
        <div className="container mx-auto px-4 pb-12">
          <div className="max-w-6xl mx-auto">
            {/* Page Title */}
            <div className="mb-8 md:mb-12">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-2">
                Carrinho de Compras
              </h1>
              <p className="text-white/60 text-sm md:text-base">
                {cartItems.length === 0
                  ? 'Seu carrinho está vazio'
                  : `${cartItems.length} ${cartItems.length === 1 ? 'produto' : 'produtos'} no seu carrinho`}
              </p>
            </div>

            {/* Empty Cart State */}
            <div className="text-center py-16 md:py-20">
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-12 h-12 text-white/30" />
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Seu carrinho está vazio
              </h2>
              <p className="text-white/60 mb-8 max-w-md mx-auto">
                Parece que você ainda não adicionou nenhum produto. Explore nossa coleção!
              </p>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 bg-brand-yellow text-black px-8 py-3 rounded-lg font-bold text-base md:text-lg uppercase tracking-wide hover:bg-yellow-400 transition-all duration-300 hover:scale-105 shadow-lg shadow-brand-yellow/20"
              >
                Explorar Produtos
              </Link>
            </div>

            {/* Promotional Banner - Compre 2, Leve 3 */}
            <div className="mt-8 md:mt-12 bg-gradient-to-r from-brand-yellow/10 to-brand-yellow/5 border-2 border-brand-yellow/30 rounded-xl p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-brand-yellow rounded-full flex items-center justify-center">
                    <span className="text-black text-2xl font-black">3x2</span>
                  </div>
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-1">
                    Promoção 3x2 Ativa! 🎉
                  </h3>
                  <p className="text-white/80 text-sm md:text-base">
                    Compre 2 produtos e leve 3! O produto de menor valor sai GRÁTIS.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

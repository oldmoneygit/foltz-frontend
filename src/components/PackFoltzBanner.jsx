'use client'

import { Package, Gift, Truck, Percent } from 'lucide-react'
import { usePackFoltz } from '@/contexts/PackFoltzContext'

export default function PackFoltzBanner() {
  const { currentCount, packSize, packPrice } = usePackFoltz()

  return (
    <section className="py-12 md:py-16 bg-gradient-to-r from-black via-zinc-900 to-black relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(218,241,13,0.1)_10px,rgba(218,241,13,0.1)_20px)]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-brand-yellow p-4 rounded-full shadow-lg shadow-brand-yellow/30">
              <Package className="w-8 h-8 md:w-10 md:h-10 text-black" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4 uppercase tracking-tight">
            Pack Foltz
          </h2>

          {/* Price Highlight */}
          <div className="mb-6">
            <div className="inline-block bg-brand-yellow/10 border-2 border-brand-yellow rounded-2xl px-8 py-4">
              <div className="flex items-center justify-center gap-2 md:gap-4">
                <span className="text-4xl md:text-6xl font-black text-brand-yellow">
                  4
                </span>
                <span className="text-brand-yellow text-xl md:text-2xl font-bold">
                  camisetas
                </span>
                <span className="text-4xl md:text-6xl font-black text-brand-yellow">
                  x
                </span>
                <span className="text-4xl md:text-6xl font-black text-brand-yellow">
                  ARS {packPrice.toLocaleString('es-AR')}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-8">
            Armá tu pack personalizado. Elegí 4 camisetas de cualquier equipo,
            temporada o estilo y llevate el mejor precio.
          </p>

          {/* Progress Indicator */}
          {currentCount > 0 && (
            <div className="max-w-xs mx-auto mb-8">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-white/60">Tu Pack</span>
                <span className="text-brand-yellow font-bold">
                  {currentCount}/{packSize} productos
                </span>
              </div>
              <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-yellow transition-all duration-500 ease-out"
                  style={{ width: `${(currentCount / packSize) * 100}%` }}
                />
              </div>
              {currentCount < packSize && (
                <p className="text-white/50 text-sm mt-2">
                  Agregá {packSize - currentCount} {packSize - currentCount === 1 ? 'producto más' : 'productos más'} para completar
                </p>
              )}
            </div>
          )}

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 bg-white/5 rounded-xl p-4 border border-white/10">
              <Gift className="w-6 h-6 text-brand-yellow" />
              <div className="text-left">
                <p className="text-white font-semibold text-sm">Mix & Match</p>
                <p className="text-white/60 text-xs">Mezclá equipos y temporadas</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 bg-white/5 rounded-xl p-4 border border-white/10">
              <Truck className="w-6 h-6 text-brand-yellow" />
              <div className="text-left">
                <p className="text-white font-semibold text-sm">Envío Gratis</p>
                <p className="text-white/60 text-xs">A toda Argentina</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 bg-white/5 rounded-xl p-4 border border-white/10">
              <Percent className="w-6 h-6 text-brand-yellow" />
              <div className="text-left">
                <p className="text-white font-semibold text-sm">Ahorrá Más</p>
                <p className="text-white/60 text-xs">Hasta 40% de descuento</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-10">
            <p className="text-brand-yellow/80 text-sm font-semibold uppercase tracking-wider">
              Empezá a armar tu pack ahora
            </p>
            <p className="text-white/40 text-xs mt-2">
              Hacé click en &quot;Agregar al Pack&quot; en cualquier producto
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

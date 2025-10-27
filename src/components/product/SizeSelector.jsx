'use client'

import { Ruler } from 'lucide-react'

const SizeSelector = ({ sizes = [], selectedSize, onSizeChange }) => {
  return (
    <div className="space-y-3">
      {/* Label */}
      <div className="flex items-center justify-between">
        <label className="text-white font-bold text-sm uppercase tracking-wide">
          Selecciona tu talla
        </label>
        {selectedSize && (
          <span className="text-brand-yellow text-sm font-bold">
            Talla {selectedSize}
          </span>
        )}
      </div>

      {/* Size Grid */}
      <div className="grid grid-cols-6 gap-2">
        {sizes.map((sizeItem) => {
          // Handle both old format (number) and new format (object with size property)
          const sizeValue = typeof sizeItem === 'object' ? sizeItem.size : sizeItem

          return (
            <button
              key={sizeValue}
              onClick={() => onSizeChange(sizeValue)}
              className={`
                relative py-3 px-2 rounded-lg font-bold text-sm
                transition-all duration-200
                ${
                  selectedSize == sizeValue
                    ? 'bg-brand-yellow text-black shadow-lg shadow-brand-yellow/20 scale-105'
                    : 'bg-white/5 text-white hover:bg-white/10 hover:scale-105'
                }
              `}
            >
              {sizeValue}
              {selectedSize == sizeValue && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-black" />
              )}
            </button>
          )
        })}
      </div>

      {/* Size Guide Link */}
      <a
        href="/guia-de-tallas"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-brand-yellow/80 hover:text-brand-yellow text-xs font-semibold transition-colors duration-200 mt-2 group"
      >
        <Ruler className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
        <span className="underline">Guía de tallas</span>
      </a>
    </div>
  )
}

export default SizeSelector

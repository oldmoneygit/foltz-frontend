'use client'

import { Minus, Plus } from 'lucide-react'

const QuantitySelector = ({ quantity, onQuantityChange, min = 1, max = 10 }) => {
  const handleDecrease = () => {
    if (quantity > min) {
      onQuantityChange(quantity - 1)
    }
  }

  const handleIncrease = () => {
    if (quantity < max) {
      onQuantityChange(quantity + 1)
    }
  }

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value)
    if (!isNaN(value) && value >= min && value <= max) {
      onQuantityChange(value)
    }
  }

  return (
    <div className="space-y-2">
      {/* Label */}
      <label className="text-white font-bold text-sm uppercase tracking-wide block">
        Cantidad
      </label>

      {/* Quantity Controls */}
      <div className="flex items-center gap-3">
        {/* Decrease Button */}
        <button
          onClick={handleDecrease}
          disabled={quantity <= min}
          className={`
            w-10 h-10 rounded-lg flex items-center justify-center
            transition-all duration-200
            ${
              quantity <= min
                ? 'bg-white/5 text-white/30 cursor-not-allowed'
                : 'bg-white/10 text-white hover:bg-brand-yellow hover:text-black hover:scale-110'
            }
          `}
        >
          <Minus className="w-4 h-4" />
        </button>

        {/* Quantity Display */}
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={quantity}
          onChange={handleInputChange}
          min={min}
          max={max}
          className="w-16 h-10 md:w-20 bg-white/5 text-white text-center font-bold rounded-lg border-2 border-white/10 focus:border-brand-yellow focus:outline-none text-base min-h-[44px]"
        />

        {/* Increase Button */}
        <button
          onClick={handleIncrease}
          disabled={quantity >= max}
          className={`
            w-10 h-10 rounded-lg flex items-center justify-center
            transition-all duration-200
            ${
              quantity >= max
                ? 'bg-white/5 text-white/30 cursor-not-allowed'
                : 'bg-white/10 text-white hover:bg-brand-yellow hover:text-black hover:scale-110'
            }
          `}
        >
          <Plus className="w-4 h-4" />
        </button>

        {/* Stock Info */}
        <span className="text-white/60 text-xs ml-2">
          Máximo {max} unidades
        </span>
      </div>
    </div>
  )
}

export default QuantitySelector

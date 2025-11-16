'use client'

import { useStoreMode } from '@/contexts/StoreModeContext'
import { Zap, Clock } from 'lucide-react'

export default function ModeToggle({ className = '' }) {
  const { mode, setMode, isLoaded } = useStoreMode()

  if (!isLoaded) {
    return (
      <div className={`h-12 w-64 bg-gray-800 rounded-full animate-pulse ${className}`} />
    )
  }

  return (
    <div className={`relative flex items-center bg-gray-900 rounded-full p-1 ${className}`}>
      {/* Slider Background */}
      <div
        className={`absolute h-10 w-1/2 rounded-full transition-transform duration-300 ease-in-out ${
          mode === 'atuais'
            ? 'translate-x-0 bg-[#A8C930]'
            : 'translate-x-full bg-[#D4AF37]'
        }`}
      />

      {/* Botão ATUAIS */}
      <button
        onClick={() => setMode('atuais')}
        className={`relative z-10 flex items-center justify-center gap-2 px-6 py-2 rounded-full transition-colors duration-300 font-semibold ${
          mode === 'atuais'
            ? 'text-black'
            : 'text-gray-400 hover:text-white'
        }`}
      >
        <Zap size={18} />
        <span>ATUAIS</span>
      </button>

      {/* Botão RETRO */}
      <button
        onClick={() => setMode('retro')}
        className={`relative z-10 flex items-center justify-center gap-2 px-6 py-2 rounded-full transition-colors duration-300 font-semibold ${
          mode === 'retro'
            ? 'text-black'
            : 'text-gray-400 hover:text-white'
        }`}
      >
        <Clock size={18} />
        <span>RETRO</span>
      </button>
    </div>
  )
}

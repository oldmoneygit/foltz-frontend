'use client'

import { X, Ruler, Info, CheckCircle } from 'lucide-react'
import { useEffect } from 'react'

export default function SizeGuideModal({ isOpen, onClose }) {
  const sizeTable = [
    { talle: 'S', pecho: '88-96', ancho: '49', largo: '68' },
    { talle: 'M', pecho: '96-104', ancho: '52', largo: '70' },
    { talle: 'L', pecho: '104-112', ancho: '55', largo: '72' },
    { talle: 'XL', pecho: '112-120', ancho: '58', largo: '74' },
    { talle: 'XXL', pecho: '120-128', ancho: '61', largo: '76' },
    { talle: '3XL', pecho: '128-136', ancho: '64', largo: '78' },
    { talle: '4XL', pecho: '136-144', ancho: '67', largo: '80' },
  ]

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      window.addEventListener('keydown', handleEsc)
    }

    return () => {
      window.removeEventListener('keydown', handleEsc)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors group"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
        </button>

        {/* Modal content */}
        <div className="p-6 md:p-8 lg:p-10">
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <div className="flex items-center gap-3 mb-3">
              <Ruler className="w-7 h-7 md:w-9 md:h-9 text-brand-yellow" />
              <h2 className="text-2xl md:text-4xl font-black text-white uppercase">
                Guía de Talles
              </h2>
            </div>
            <p className="text-white/60 text-sm md:text-base">
              Encontrá el talle perfecto para vos
            </p>
          </div>

          {/* Size Table */}
          <div className="mb-6 md:mb-8">
            <div className="bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-brand-yellow/20 border-b border-brand-yellow/30">
                      <th className="px-3 md:px-4 py-3 md:py-4 text-left text-brand-yellow font-black text-xs md:text-sm">
                        TALLE
                      </th>
                      <th className="px-3 md:px-4 py-3 md:py-4 text-left text-brand-yellow font-black text-xs md:text-sm">
                        PECHO (CM)
                      </th>
                      <th className="px-3 md:px-4 py-3 md:py-4 text-left text-brand-yellow font-black text-xs md:text-sm">
                        ANCHO (CM)
                      </th>
                      <th className="px-3 md:px-4 py-3 md:py-4 text-left text-brand-yellow font-black text-xs md:text-sm">
                        LARGO (CM)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sizeTable.map((size, index) => (
                      <tr
                        key={index}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="px-3 md:px-4 py-2 md:py-3 text-white font-bold text-xs md:text-sm">
                          {size.talle}
                        </td>
                        <td className="px-3 md:px-4 py-2 md:py-3 text-white/80 text-xs md:text-sm">
                          {size.pecho}
                        </td>
                        <td className="px-3 md:px-4 py-2 md:py-3 text-white/80 text-xs md:text-sm">
                          {size.ancho}
                        </td>
                        <td className="px-3 md:px-4 py-2 md:py-3 text-white/80 text-xs md:text-sm">
                          {size.largo}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Instructions and tips */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* How to measure */}
            <div className="bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/10">
              <h3 className="text-lg md:text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Ruler className="w-5 h-5 text-brand-yellow" />
                Cómo tomar tus medidas
              </h3>
              <ol className="space-y-3">
                {[
                  'PECHO: Medí el contorno del pecho en la parte más ancha',
                  'ANCHO: Medí de hombro a hombro en línea recta',
                  'LARGO: Medí desde el punto más alto del hombro hasta el borde inferior',
                  'Tomá las medidas con una cinta métrica sobre ropa interior',
                  'Usá la tabla de arriba para encontrar tu talle',
                ].map((step, index) => (
                  <li key={index} className="flex gap-2">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-yellow text-black font-bold text-xs flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="text-white/80 text-xs md:text-sm">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Important tips */}
            <div className="bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/10">
              <h3 className="text-lg md:text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-brand-yellow" />
                Consejos importantes
              </h3>
              <ul className="space-y-3">
                {[
                  'Las medidas están en centímetros y son estándar internacionales',
                  'Nuestras camisetas tienen corte regular fit',
                  'Si estás entre dos talles, elegí el mayor',
                  'Las camisetas pueden encoger 1-2cm después del primer lavado',
                  '¡En caso de duda, contactanos!',
                ].map((tip, index) => (
                  <li key={index} className="flex gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-yellow flex-shrink-0 mt-0.5" />
                    <span className="text-white/80 text-xs md:text-sm">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

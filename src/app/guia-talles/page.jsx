'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Ruler, Info, CheckCircle } from 'lucide-react'

export default function GuiaTamanhosPage() {
  const sizeTable = [
    { br: '35', us: '5', uk: '2.5', cm: '22' },
    { br: '36', us: '5.5', uk: '3', cm: '22.5' },
    { br: '37', us: '6', uk: '3.5', cm: '23' },
    { br: '38', us: '6.5-7', uk: '4-4.5', cm: '24' },
    { br: '39', us: '7.5', uk: '5', cm: '24.5' },
    { br: '40', us: '8', uk: '5.5', cm: '25' },
    { br: '41', us: '8.5-9', uk: '6-6.5', cm: '26' },
    { br: '42', us: '9.5-10', uk: '7-7.5', cm: '27' },
    { br: '43', us: '10.5', uk: '8', cm: '27.5' },
    { br: '44', us: '11', uk: '9', cm: '28' },
    { br: '45', us: '11.5-12', uk: '9.5-10', cm: '29' },
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen bg-black">
        <div className="container mx-auto px-4 pt-6 md:pt-8 pb-12">
          {/* Header */}
          <div className="mb-8 md:mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Ruler className="w-8 h-8 md:w-10 md:h-10 text-brand-yellow" />
              <h1 className="text-3xl md:text-5xl font-black text-white uppercase">
                Guía de Talles
              </h1>
            </div>
            <p className="text-white/60 text-base md:text-lg">
              Encontrá el talle perfecto para vos
            </p>
          </div>

          {/* Size Table */}
          <div className="mb-8">
            <div className="bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-brand-yellow/20 border-b border-brand-yellow/30">
                      <th className="px-4 py-4 text-left text-brand-yellow font-black text-sm md:text-base">
                        ARG/BR
                      </th>
                      <th className="px-4 py-4 text-left text-brand-yellow font-black text-sm md:text-base">
                        US
                      </th>
                      <th className="px-4 py-4 text-left text-brand-yellow font-black text-sm md:text-base">
                        UK
                      </th>
                      <th className="px-4 py-4 text-left text-brand-yellow font-black text-sm md:text-base">
                        CM
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sizeTable.map((size, index) => (
                      <tr
                        key={index}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="px-4 py-3 text-white font-bold text-sm md:text-base">
                          {size.br}
                        </td>
                        <td className="px-4 py-3 text-white/80 text-sm md:text-base">
                          {size.us}
                        </td>
                        <td className="px-4 py-3 text-white/80 text-sm md:text-base">
                          {size.uk}
                        </td>
                        <td className="px-4 py-3 text-white/80 text-sm md:text-base">
                          {size.cm}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Como medir seu pé */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm rounded-xl p-6 md:p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Ruler className="w-6 h-6 text-brand-yellow" />
                Cómo medir tu pie
              </h2>
              <ol className="space-y-4">
                {[
                  'Colocá una hoja de papel en el piso contra la pared',
                  'Parate sobre el papel con el talón contra la pared',
                  'Marcá el punto más distante de tu pie (dedos)',
                  'Medí la distancia del talón hasta la marca en centímetros',
                  'Usá la tabla de arriba para encontrar tu talle',
                ].map((step, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-yellow text-black font-bold text-sm flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="text-white/80">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm rounded-xl p-6 md:p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Info className="w-6 h-6 text-brand-yellow" />
                Consejos importantes
              </h2>
              <ul className="space-y-4">
                {[
                  'Medí tus pies por la tarde/noche cuando están más hinchados',
                  'Usá las medias que normalmente usás con zapatillas',
                  'Medí ambos pies y usá la medida mayor',
                  'Si estás entre dos talles, elegí el mayor',
                  '¡En caso de duda, contactanos!',
                ].map((tip, index) => (
                  <li key={index} className="flex gap-3">
                    <CheckCircle className="w-5 h-5 text-brand-yellow flex-shrink-0 mt-0.5" />
                    <span className="text-white/80 text-sm">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Ajuda adicional */}
          <div className="bg-gradient-to-r from-brand-yellow/10 to-yellow-500/10 border border-brand-yellow/30 rounded-xl p-6 md:p-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              ¿Dudas sobre talles?
            </h3>
            <p className="text-white/80 mb-6">
              ¡Nuestro equipo puede ayudarte a elegir el talle ideal! Contactanos por WhatsApp.
            </p>
            <a
              href="https://wa.me/5511999999999?text=Olá!%20Preciso%20de%20ajuda%20com%20os%20tamanhos"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-brand-yellow text-black font-bold px-6 py-3 rounded-lg hover:bg-yellow-500 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Hablar por WhatsApp
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

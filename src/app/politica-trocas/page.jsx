'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { RefreshCw, CheckCircle, XCircle, AlertTriangle, Clock, Package } from 'lucide-react'

export default function PoliticaTrocasPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-black">
        <div className="container mx-auto px-4 pt-6 md:pt-8 pb-12">
          {/* Header */}
          <div className="mb-8 md:mb-12">
            <div className="flex items-center gap-3 mb-4">
              <RefreshCw className="w-8 h-8 md:w-10 md:h-10 text-brand-yellow" />
              <h1 className="text-3xl md:text-5xl font-black text-white">
                Política de Cambios y Devoluciones
              </h1>
            </div>
            <p className="text-white/60 text-base md:text-lg">
              Tu satisfacción es nuestra prioridad. Conocé nuestras políticas de cambio y devolución.
            </p>
          </div>

          {/* Prazo */}
          <div className="mb-8 bg-gradient-to-r from-brand-yellow/10 to-yellow-500/10 border border-brand-yellow/30 rounded-xl p-6 md:p-8">
            <div className="flex items-start gap-4">
              <Clock className="w-8 h-8 text-brand-yellow flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  30 días para cambios y devoluciones
                </h2>
                <p className="text-white/80">
                  Tenés 30 días corridos desde la recepción del pedido para solicitar un cambio o devolución.
                </p>
              </div>
            </div>
          </div>

          {/* Condições para trocas/devoluções */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              Condiciones para cambios y devoluciones
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  icon: <CheckCircle className="w-6 h-6 text-green-500" />,
                  title: 'Producto sin uso',
                  desc: 'El artículo no debe haber sido usado ni presentar signos de desgaste',
                },
                {
                  icon: <CheckCircle className="w-6 h-6 text-green-500" />,
                  title: 'Etiquetas originales',
                  desc: 'Debe conservar todas las etiquetas y adhesivos originales',
                },
                {
                  icon: <CheckCircle className="w-6 h-6 text-green-500" />,
                  title: 'Embalaje original',
                  desc: 'La caja debe estar en perfecto estado, sin daños o escrituras',
                },
                {
                  icon: <CheckCircle className="w-6 h-6 text-green-500" />,
                  title: 'Accesorios completos',
                  desc: 'Debe incluir todos los accesorios y documentación original',
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm rounded-xl p-6 border border-white/10"
                >
                  <div className="flex items-start gap-3">
                    {item.icon}
                    <div>
                      <h3 className="text-white font-bold mb-1">{item.title}</h3>
                      <p className="text-white/60 text-sm">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Processo de troca */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              ¿Cómo solicitar un cambio?
            </h2>
            <div className="bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm rounded-xl p-6 md:p-8 border border-white/10">
              <ol className="space-y-6">
                {[
                  {
                    step: '1',
                    title: 'Contactanos',
                    desc: 'Escribinos por WhatsApp o email indicando tu número de pedido y el motivo del cambio',
                  },
                  {
                    step: '2',
                    title: 'Confirmación',
                    desc: 'Nuestro equipo verificará tu solicitud y enviará las instrucciones de devolución',
                  },
                  {
                    step: '3',
                    title: 'Envío del producto',
                    desc: 'Embalá el producto en la caja original y envialo a la dirección que te indicaremos',
                  },
                  {
                    step: '4',
                    title: 'Inspección',
                    desc: 'Al recibirlo, inspeccionamos el producto para verificar que cumple las condiciones',
                  },
                  {
                    step: '5',
                    title: 'Cambio o reembolso',
                    desc: 'Enviamos el nuevo producto o procesamos tu reembolso en 5-7 días hábiles',
                  },
                ].map((item, index) => (
                  <li key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-yellow text-black font-black text-lg flex items-center justify-center">
                      {item.step}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-bold mb-1">{item.title}</h3>
                      <p className="text-white/60 text-sm">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Custos de envio */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              Costos de envío
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-green-500/10 to-green-500/0 backdrop-blur-sm rounded-xl p-6 border border-green-500/30">
                <div className="flex items-start gap-3 mb-4">
                  <Package className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <h3 className="text-white font-bold">Cambio por error de talle</h3>
                </div>
                <p className="text-white/80 text-sm mb-2">
                  Si el cambio es por error de talle, <strong className="text-green-400">asumimos el costo</strong> del envío del nuevo producto.
                </p>
                <p className="text-white/60 text-xs">
                  El envío de devolución corre por cuenta del cliente.
                </p>
              </div>

              <div className="bg-gradient-to-br from-orange-500/10 to-orange-500/0 backdrop-blur-sm rounded-xl p-6 border border-orange-500/30">
                <div className="flex items-start gap-3 mb-4">
                  <Package className="w-6 h-6 text-orange-500 flex-shrink-0" />
                  <h3 className="text-white font-bold">Cambio por preferencia</h3>
                </div>
                <p className="text-white/80 text-sm mb-2">
                  Si el cambio es por preferencia personal (cambio de modelo), <strong className="text-orange-400">los costos son compartidos</strong>.
                </p>
                <p className="text-white/60 text-xs">
                  Tanto el envío de devolución como el del nuevo producto.
                </p>
              </div>
            </div>
          </div>

          {/* Exceções */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              Casos que NO aplican para cambio/devolución
            </h2>
            <div className="space-y-3">
              {[
                'Productos usados o con signos de desgaste',
                'Artículos sin etiquetas originales o con caja dañada',
                'Productos modificados o alterados de alguna forma',
                'Solicitudes fuera del plazo de 30 días',
                'Productos en promociones especiales (excepto defecto de fábrica)',
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-red-500/10 to-red-500/0 backdrop-blur-sm rounded-xl p-4 border border-red-500/30 flex items-start gap-3"
                >
                  <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-white/80 text-sm">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Defeitos de fábrica */}
          <div className="mb-8 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm rounded-xl p-6 md:p-8 border border-white/10">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-8 h-8 text-brand-yellow flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-bold text-white mb-3">
                  Productos con defectos de fábrica
                </h2>
                <p className="text-white/80 mb-4">
                  Si tu producto llega con algún defecto de fabricación, lo cambiamos inmediatamente sin ningún costo para vos. En estos casos:
                </p>
                <ul className="space-y-2 text-white/80 text-sm">
                  <li className="flex gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>El plazo se extiende a 60 días</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Todos los costos de envío corren por nuestra cuenta</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Prioridad en el envío del reemplazo</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contato */}
          <div className="bg-gradient-to-r from-brand-yellow/10 to-yellow-500/10 border border-brand-yellow/30 rounded-xl p-6 md:p-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              ¿Necesitás hacer un cambio o devolución?
            </h3>
            <p className="text-white/80 mb-6">
              Nuestro equipo está listo para ayudarte. Contactanos y te guiaremos en todo el proceso.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://wa.me/5511999999999?text=Olá!%20Preciso%20fazer%20uma%20troca"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-brand-yellow text-black font-bold px-6 py-3 rounded-lg hover:bg-yellow-500 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                WhatsApp
              </a>
              <a
                href="mailto:contato@foltz.com.br"
                className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-bold px-6 py-3 rounded-lg hover:bg-white/20 transition-colors"
              >
                Email
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

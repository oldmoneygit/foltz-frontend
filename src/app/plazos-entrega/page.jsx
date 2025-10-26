'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Truck, Clock, MapPin, Package, CheckCircle, Info } from 'lucide-react'

export default function PrazoEntregaPage() {
  const deliveryTimes = [
    {
      region: 'Buenos Aires y CABA',
      days: '3-5 días hábiles',
      icon: '🏙️',
      color: 'from-green-500/10 to-green-500/0',
      iconColor: 'text-green-400',
    },
    {
      region: 'Provincia de Buenos Aires',
      days: '5-7 días hábiles',
      icon: '🌆',
      color: 'from-blue-500/10 to-blue-500/0',
      iconColor: 'text-blue-400',
    },
    {
      region: 'Interior de Argentina',
      days: '7-12 días hábiles',
      icon: '🏞️',
      color: 'from-orange-500/10 to-orange-500/0',
      iconColor: 'text-orange-400',
    },
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen bg-black">
        <div className="container mx-auto px-4 pt-6 md:pt-8 pb-12">
          {/* Header */}
          <div className="mb-8 md:mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Truck className="w-8 h-8 md:w-10 md:h-10 text-brand-yellow" />
              <h1 className="text-3xl md:text-5xl font-black text-white uppercase">
                Plazos de Entrega
              </h1>
            </div>
            <p className="text-white/60 text-base md:text-lg">
              Conocé los plazos de entrega para tu región
            </p>
          </div>

          {/* Free Shipping Banner */}
          <div className="mb-8 bg-gradient-to-r from-brand-yellow/20 to-yellow-500/20 border border-brand-yellow/50 rounded-xl p-6 md:p-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-brand-yellow flex items-center justify-center flex-shrink-0">
                <Truck className="w-8 h-8 text-black" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-white mb-2">
                  Envío GRATIS para toda Argentina
                </h2>
                <p className="text-white/80">
                  En compras superiores a ARS 50.000. Por debajo de ese valor, calculamos el envío en el checkout.
                </p>
              </div>
            </div>
          </div>

          {/* Delivery Times by Region */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">
              Plazos de entrega por región
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {deliveryTimes.map((item, index) => (
                <div
                  key={index}
                  className={`bg-gradient-to-br ${item.color} backdrop-blur-sm rounded-xl p-6 border border-white/10`}
                >
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-white font-bold text-lg mb-2">{item.region}</h3>
                  <p className={`${item.iconColor} font-black text-2xl`}>{item.days}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Processo de envio */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">
              ¿Cómo funciona el envío?
            </h2>
            <div className="bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm rounded-xl p-6 md:p-8 border border-white/10">
              <div className="space-y-6">
                {[
                  {
                    step: '1',
                    title: 'Confirmación del pedido',
                    desc: 'Recibís un email de confirmación apenas finalices tu compra',
                    time: 'Inmediato',
                  },
                  {
                    step: '2',
                    title: 'Preparación del pedido',
                    desc: 'Separamos y embalamos tu producto con cuidado',
                    time: '24-48h',
                  },
                  {
                    step: '3',
                    title: 'Despacho',
                    desc: 'Tu pedido es enviado y recibís el código de seguimiento',
                    time: '2-3 días',
                  },
                  {
                    step: '4',
                    title: 'En tránsito',
                    desc: 'Seguí tu pedido en tiempo real con el código de seguimiento',
                    time: 'Según ubicación',
                  },
                  {
                    step: '5',
                    title: 'Entregado',
                    desc: '¡Tu producto llega a la dirección indicada!',
                    time: '🎉',
                  },
                ].map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-brand-yellow text-black font-black text-lg flex items-center justify-center flex-shrink-0">
                        {item.step}
                      </div>
                      {index < 4 && (
                        <div className="w-0.5 h-full bg-brand-yellow/30 mt-2"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-6">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className="text-white font-bold text-lg">{item.title}</h3>
                        <span className="text-brand-yellow text-sm font-bold whitespace-nowrap">
                          {item.time}
                        </span>
                      </div>
                      <p className="text-white/60 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Informação importante */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">
              Información importante sobre entrega
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  icon: <Clock className="w-6 h-6 text-brand-yellow" />,
                  title: 'Días hábiles',
                  desc: 'Los plazos son en días hábiles, no cuentan sábados, domingos y feriados',
                },
                {
                  icon: <Package className="w-6 h-6 text-brand-yellow" />,
                  title: 'Embalaje seguro',
                  desc: 'Todos los productos son embalados con protección adecuada',
                },
                {
                  icon: <MapPin className="w-6 h-6 text-brand-yellow" />,
                  title: 'Dirección correcta',
                  desc: 'Asegurate de proporcionar la dirección completa y correcta',
                },
                {
                  icon: <CheckCircle className="w-6 h-6 text-brand-yellow" />,
                  title: 'Seguimiento incluido',
                  desc: 'Todos los envíos incluyen código de seguimiento gratuito',
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm rounded-xl p-6 border border-white/10"
                >
                  <div className="flex items-start gap-3 mb-3">
                    {item.icon}
                    <h3 className="text-white font-bold">{item.title}</h3>
                  </div>
                  <p className="text-white/60 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Atrasos e problemas */}
          <div className="mb-8 bg-gradient-to-br from-orange-500/10 to-orange-500/0 backdrop-blur-sm rounded-xl p-6 md:p-8 border border-orange-500/30">
            <div className="flex items-start gap-4">
              <Info className="w-8 h-8 text-orange-500 flex-shrink-0" />
              <div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  ¿Y si hay retrasos?
                </h3>
                <p className="text-white/80 mb-4">
                  Aunque es raro, pueden ocurrir retrasos debido a:
                </p>
                <ul className="space-y-2 text-white/80 text-sm mb-4">
                  <li className="flex gap-2">
                    <span className="text-orange-500">•</span>
                    <span>Condiciones climáticas adversas</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-orange-500">•</span>
                    <span>Feriados prolongados</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-orange-500">•</span>
                    <span>Alta demanda estacional</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-orange-500">•</span>
                    <span>Problemas en la dirección de entrega</span>
                  </li>
                </ul>
                <p className="text-white/80">
                  Si tu pedido está retrasado, <strong className="text-brand-yellow">contactanos inmediatamente</strong> y resolveremos el problema.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-brand-yellow/10 to-yellow-500/10 border border-brand-yellow/30 rounded-xl p-6 md:p-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              ¿Dudas sobre envío?
            </h3>
            <p className="text-white/80 mb-6">
              ¡Nuestro equipo está disponible para ayudarte!
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://wa.me/5511999999999?text=Olá!%20Tenho%20uma%20dúvida%20sobre%20envio"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-brand-yellow text-black font-bold px-6 py-3 rounded-lg hover:bg-yellow-500 transition-colors"
              >
                <Package className="w-5 h-5" />
                Rastrear pedido
              </a>
              <a
                href="/contacto"
                className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-bold px-6 py-3 rounded-lg hover:bg-white/20 transition-colors"
              >
                Contactar soporte
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

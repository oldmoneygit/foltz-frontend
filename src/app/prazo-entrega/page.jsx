'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Truck, Clock, MapPin, Package, CheckCircle, Info } from 'lucide-react'

export default function PrazoEntregaPage() {
  const deliveryTimes = [
    {
      region: 'Buenos Aires e CABA',
      days: '3-5 dias úteis',
      icon: '🏙️',
      color: 'from-green-500/10 to-green-500/0',
      iconColor: 'text-green-400',
    },
    {
      region: 'Província de Buenos Aires',
      days: '5-7 dias úteis',
      icon: '🌆',
      color: 'from-blue-500/10 to-blue-500/0',
      iconColor: 'text-blue-400',
    },
    {
      region: 'Interior da Argentina',
      days: '7-12 dias úteis',
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
              <h1 className="text-3xl md:text-5xl font-black text-white">
                Prazos de Entrega
              </h1>
            </div>
            <p className="text-white/60 text-base md:text-lg">
              Conheça os prazos de entrega para sua região
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
                  Envio GRÁTIS para toda Argentina
                </h2>
                <p className="text-white/80">
                  Em compras acima de ARS 50.000. Abaixo desse valor, calculamos o frete no checkout.
                </p>
              </div>
            </div>
          </div>

          {/* Delivery Times by Region */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">
              Prazos de entrega por região
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
              Como funciona o envio?
            </h2>
            <div className="bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm rounded-xl p-6 md:p-8 border border-white/10">
              <div className="space-y-6">
                {[
                  {
                    step: '1',
                    title: 'Confirmação do pedido',
                    desc: 'Você recebe um email de confirmação assim que finalizar sua compra',
                    time: 'Imediato',
                  },
                  {
                    step: '2',
                    title: 'Preparação do pedido',
                    desc: 'Separamos e embalamos seu produto com cuidado',
                    time: '24-48h',
                  },
                  {
                    step: '3',
                    title: 'Despacho',
                    desc: 'Seu pedido é enviado e você recebe o código de rastreamento',
                    time: '2-3 dias',
                  },
                  {
                    step: '4',
                    title: 'Em trânsito',
                    desc: 'Acompanhe seu pedido em tempo real pelo código de rastreamento',
                    time: 'Conforme localização',
                  },
                  {
                    step: '5',
                    title: 'Entregue',
                    desc: 'Seu produto chega no endereço indicado!',
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
              Informações importantes sobre entrega
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  icon: <Clock className="w-6 h-6 text-brand-yellow" />,
                  title: 'Dias úteis',
                  desc: 'Os prazos são em dias úteis, não contam sábados, domingos e feriados',
                },
                {
                  icon: <Package className="w-6 h-6 text-brand-yellow" />,
                  title: 'Embalagem segura',
                  desc: 'Todos os produtos são embalados com proteção adequada',
                },
                {
                  icon: <MapPin className="w-6 h-6 text-brand-yellow" />,
                  title: 'Endereço correto',
                  desc: 'Certifique-se de fornecer o endereço completo e correto',
                },
                {
                  icon: <CheckCircle className="w-6 h-6 text-brand-yellow" />,
                  title: 'Rastreamento incluído',
                  desc: 'Todos os envios incluem código de rastreamento gratuito',
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
                  E se houver atrasos?
                </h3>
                <p className="text-white/80 mb-4">
                  Embora seja raro, podem ocorrer atrasos devido a:
                </p>
                <ul className="space-y-2 text-white/80 text-sm mb-4">
                  <li className="flex gap-2">
                    <span className="text-orange-500">•</span>
                    <span>Condições climáticas adversas</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-orange-500">•</span>
                    <span>Feriados prolongados</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-orange-500">•</span>
                    <span>Alta demanda sazonal</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-orange-500">•</span>
                    <span>Problemas no endereço de entrega</span>
                  </li>
                </ul>
                <p className="text-white/80">
                  Se seu pedido estiver atrasado, <strong className="text-brand-yellow">entre em contato imediatamente</strong> e resolveremos o problema.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-brand-yellow/10 to-yellow-500/10 border border-brand-yellow/30 rounded-xl p-6 md:p-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Dúvidas sobre envio?
            </h3>
            <p className="text-white/80 mb-6">
              Nossa equipe está disponível para ajudar você!
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
                href="/contato"
                className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-bold px-6 py-3 rounded-lg hover:bg-white/20 transition-colors"
              >
                Contatar suporte
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

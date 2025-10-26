'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Package, Search, MapPin, Truck, CheckCircle, Clock, AlertCircle } from 'lucide-react'

export default function RastreamentoPage() {
  const [trackingNumber, setTrackingNumber] = useState('')
  const [searching, setSearching] = useState(false)
  const [orderStatus, setOrderStatus] = useState(null)

  // Simulación de estados de pedido
  const mockOrderStatuses = {
    'FZ123456': {
      number: 'FZ123456',
      status: 'delivered',
      statusText: 'Entregado',
      date: '15/10/2024',
      estimatedDelivery: '12-15/10/2024',
      items: [
        { name: 'Real Madrid 24/25 Home', size: 'L', quantity: 1 }
      ],
      timeline: [
        { status: 'ordered', text: 'Pedido Confirmado', date: '10/10/2024 09:30', completed: true },
        { status: 'processing', text: 'Preparando Envío', date: '10/10/2024 14:20', completed: true },
        { status: 'shipped', text: 'En Camino', date: '11/10/2024 08:15', completed: true },
        { status: 'out_for_delivery', text: 'En Reparto', date: '15/10/2024 07:00', completed: true },
        { status: 'delivered', text: 'Entregado', date: '15/10/2024 11:45', completed: true },
      ]
    },
    'FZ789012': {
      number: 'FZ789012',
      status: 'shipped',
      statusText: 'En Camino',
      date: '23/10/2024',
      estimatedDelivery: '26-28/10/2024',
      items: [
        { name: 'Barcelona 24/25 Away', size: 'M', quantity: 1 },
        { name: 'PSG 24/25 Home', size: 'XL', quantity: 1 }
      ],
      timeline: [
        { status: 'ordered', text: 'Pedido Confirmado', date: '23/10/2024 10:15', completed: true },
        { status: 'processing', text: 'Preparando Envío', date: '23/10/2024 16:30', completed: true },
        { status: 'shipped', text: 'En Camino', date: '24/10/2024 09:00', completed: true },
        { status: 'out_for_delivery', text: 'En Reparto', date: 'Pendiente', completed: false },
        { status: 'delivered', text: 'Entregado', date: 'Pendiente', completed: false },
      ]
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setSearching(true)

    // Simulación de búsqueda
    setTimeout(() => {
      const order = mockOrderStatuses[trackingNumber.toUpperCase()]
      setOrderStatus(order || 'not_found')
      setSearching(false)
    }, 1000)
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ordered':
        return <CheckCircle className="w-6 h-6" />
      case 'processing':
        return <Package className="w-6 h-6" />
      case 'shipped':
        return <Truck className="w-6 h-6" />
      case 'out_for_delivery':
        return <MapPin className="w-6 h-6" />
      case 'delivered':
        return <CheckCircle className="w-6 h-6" />
      default:
        return <Clock className="w-6 h-6" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'text-green-500'
      case 'shipped':
      case 'out_for_delivery':
        return 'text-brand-yellow'
      default:
        return 'text-white/60'
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-black">
        {/* Hero Section */}
        <div className="container mx-auto px-4 pt-12 pb-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6">
              Seguimiento de <span className="text-brand-yellow">Pedido</span>
            </h1>
            <p className="text-xl text-white/80 leading-relaxed">
              Rastrea tu pedido en tiempo real
            </p>
          </div>
        </div>

        {/* Search Section */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-8 md:p-12">
              <form onSubmit={handleSearch} className="space-y-6">
                <div>
                  <label htmlFor="tracking" className="block text-white font-semibold mb-3 text-lg">
                    Número de Seguimiento
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="tracking"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="Ej: FZ123456"
                      required
                      className="w-full px-4 py-4 bg-black/50 border border-white/20 rounded-lg text-white placeholder-white/40 focus:border-brand-yellow focus:outline-none transition-colors text-lg"
                    />
                    <Package className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-white/40" />
                  </div>
                  <p className="text-white/40 text-sm mt-2">
                    Puedes encontrar tu número de seguimiento en el email de confirmación
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={searching}
                  className="w-full bg-brand-yellow hover:bg-yellow-400 text-black py-4 rounded-lg font-bold text-lg uppercase tracking-wide transition-all duration-300 hover:scale-105 shadow-lg shadow-brand-yellow/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {searching ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      Buscando...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      Rastrear Pedido
                    </>
                  )}
                </button>
              </form>

              {/* Demo tracking numbers */}
              <div className="mt-8 pt-8 border-t border-white/10">
                <p className="text-white/60 text-sm mb-3">Para probar, usa estos números de ejemplo:</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setTrackingNumber('FZ123456')}
                    className="px-3 py-1.5 bg-white/5 border border-white/10 rounded text-brand-yellow text-sm hover:bg-white/10 transition-colors"
                  >
                    FZ123456 (Entregado)
                  </button>
                  <button
                    onClick={() => setTrackingNumber('FZ789012')}
                    className="px-3 py-1.5 bg-white/5 border border-white/10 rounded text-brand-yellow text-sm hover:bg-white/10 transition-colors"
                  >
                    FZ789012 (En Camino)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {orderStatus && (
          <div className="container mx-auto px-4 pb-20">
            <div className="max-w-4xl mx-auto">
              {orderStatus === 'not_found' ? (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-8 text-center">
                  <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Pedido No Encontrado
                  </h3>
                  <p className="text-white/70 mb-4">
                    No pudimos encontrar un pedido con este número de seguimiento.
                  </p>
                  <p className="text-white/60 text-sm">
                    Verifica que el número sea correcto o contacta a nuestro equipo de soporte.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Order Summary */}
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                      <div>
                        <h2 className="text-3xl font-bold text-white mb-2">
                          Pedido #{orderStatus.number}
                        </h2>
                        <p className="text-white/60">
                          Fecha de pedido: {orderStatus.date}
                        </p>
                      </div>
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold ${
                        orderStatus.status === 'delivered'
                          ? 'bg-green-500/10 border border-green-500/30 text-green-500'
                          : 'bg-brand-yellow/10 border border-brand-yellow/30 text-brand-yellow'
                      }`}>
                        {getStatusIcon(orderStatus.status)}
                        {orderStatus.statusText}
                      </div>
                    </div>

                    {/* Items */}
                    <div className="bg-black/50 rounded-lg p-4 mb-6">
                      <h3 className="text-white font-semibold mb-3">Productos:</h3>
                      <div className="space-y-2">
                        {orderStatus.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="text-white/80">
                              {item.quantity}x {item.name} - Talla {item.size}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {orderStatus.status !== 'delivered' && (
                      <div className="bg-brand-yellow/10 border border-brand-yellow/30 rounded-lg p-4">
                        <p className="text-brand-yellow font-semibold">
                          📦 Entrega estimada: {orderStatus.estimatedDelivery}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Timeline */}
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 md:p-8">
                    <h3 className="text-2xl font-bold text-white mb-8">Estado del Envío</h3>

                    <div className="relative">
                      {/* Vertical line */}
                      <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-white/10" />

                      <div className="space-y-8">
                        {orderStatus.timeline.map((item, index) => (
                          <div key={index} className="relative flex gap-4">
                            {/* Icon */}
                            <div className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                              item.completed
                                ? 'bg-brand-yellow text-black'
                                : 'bg-white/10 text-white/40'
                            }`}>
                              {item.completed ? (
                                <CheckCircle className="w-4 h-4" />
                              ) : (
                                <div className="w-2 h-2 bg-white/40 rounded-full" />
                              )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 pb-2">
                              <h4 className={`font-bold mb-1 ${
                                item.completed ? 'text-white' : 'text-white/40'
                              }`}>
                                {item.text}
                              </h4>
                              <p className={`text-sm ${
                                item.completed ? 'text-white/60' : 'text-white/30'
                              }`}>
                                {item.date}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Help Section */}
                  <div className="bg-gradient-to-r from-brand-yellow/10 to-brand-yellow/5 border-2 border-brand-yellow/30 rounded-xl p-6 md:p-8">
                    <h3 className="text-xl font-bold text-white mb-3">
                      ¿Necesitas Ayuda?
                    </h3>
                    <p className="text-white/80 mb-4">
                      Si tienes alguna pregunta sobre tu pedido, no dudes en contactarnos.
                    </p>
                    <a
                      href="/contacto"
                      className="inline-flex items-center gap-2 bg-brand-yellow text-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-400 transition-colors"
                    >
                      Contactar Soporte
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Info Section */}
        {!orderStatus && (
          <div className="container mx-auto px-4 pb-20">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 text-center">
                  <Clock className="w-12 h-12 text-brand-yellow mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-white mb-2">
                    Tiempo de Envío
                  </h3>
                  <p className="text-white/70 text-sm">
                    3-5 días hábiles a toda Argentina
                  </p>
                </div>

                <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 text-center">
                  <Truck className="w-12 h-12 text-brand-yellow mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-white mb-2">
                    Envío Gratis
                  </h3>
                  <p className="text-white/70 text-sm">
                    En todos los pedidos sin mínimo
                  </p>
                </div>

                <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 text-center">
                  <Package className="w-12 h-12 text-brand-yellow mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-white mb-2">
                    Embalaje Seguro
                  </h3>
                  <p className="text-white/70 text-sm">
                    Protección total durante el transporte
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}

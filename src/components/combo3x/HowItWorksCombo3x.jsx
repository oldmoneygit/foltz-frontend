'use client'

import { motion } from 'framer-motion'
import { ShoppingCart, Tag, Truck, Clock, CheckCircle, Shield, Flame, CreditCard } from 'lucide-react'

const steps = [
  {
    number: '1',
    icon: ShoppingCart,
    title: 'Elegí 3 Camisetas',
    description: 'Agregá al carrito tus 3 jerseys favoritos de cualquier equipo',
    iconColor: 'bg-blue-500',
  },
  {
    number: '2',
    icon: Tag,
    title: 'Precio Fijo: ARS 32.900',
    description: 'El precio de las 3 camisetas juntas es fijo, sin importar cuáles elijas',
    iconColor: 'bg-orange-500',
  },
  {
    number: '3',
    icon: Truck,
    title: 'Envío GRATIS Incluido',
    description: 'El envío está incluido en el precio del combo, sin costos adicionales',
    iconColor: 'bg-green-500',
  },
  {
    number: '4',
    icon: CheckCircle,
    title: 'Recibí en 10 Días',
    description: 'Tu pedido llega en hasta 10 días útiles directo a tu casa',
    iconColor: 'bg-purple-500',
  },
]

const paymentMethods = [
  {
    icon: '💳',
    name: 'Tarjeta de Crédito/Débito',
  },
  {
    icon: '📱',
    name: 'Mercado Pago',
  },
  {
    icon: '💵',
    name: 'Efectivo',
  },
  {
    icon: '🏦',
    name: 'Transferencia',
  },
]

const HowItWorksCombo3x = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-black via-zinc-950 to-black relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-64 h-64 bg-orange-500 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-red-500 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          {/* Badge with Flame Icon */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-full text-sm font-black uppercase tracking-wider mb-4 shadow-lg">
            <Flame className="w-5 h-5" fill="currentColor" />
            Black Friday Exclusivo
          </div>

          {/* Title */}
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
            ¿Cómo Funciona el <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">COMBO 3x</span>?
          </h2>

          {/* Subtitle */}
          <p className="text-gray-300 text-base md:text-lg max-w-3xl mx-auto">
            Comprá ahora con la mejor oferta.{' '}
            <span className="text-orange-400 font-bold">3 camisetas por ARS 32.900</span> con envío gratis incluido.{' '}
            <span className="text-white font-bold">¡Aprovechá!</span>
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {/* Number Badge */}
              <div className="absolute -top-3 -left-3 w-10 h-10 bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-full flex items-center justify-center font-black text-lg z-10 shadow-lg">
                {step.number}
              </div>

              {/* Card */}
              <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border-2 border-zinc-800 rounded-xl p-6 h-full hover:border-orange-500/50 transition-all duration-300 shadow-xl">
                {/* Icon */}
                <div className={`w-14 h-14 ${step.iconColor} rounded-lg flex items-center justify-center mb-4 shadow-lg`}>
                  <step.icon size={28} className="text-white" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Payment Methods Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-zinc-900 to-black border-2 border-orange-500/30 rounded-2xl p-8 mb-8"
        >
          <div className="text-center mb-6">
            <h3 className="text-2xl md:text-3xl font-black text-white mb-2">
              <CreditCard className="w-8 h-8 inline-block mr-2 text-orange-400" />
              Métodos de Pago Aceptados
            </h3>
            <p className="text-gray-400">
              Pagá con el método que prefieras:
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {paymentMethods.map((method, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-xl p-4 text-center hover:border-orange-500/50 transition-all"
              >
                <div className="text-4xl mb-2">{method.icon}</div>
                <p className="text-white text-sm font-semibold">{method.name}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Important Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-900/30 to-blue-950/30 border-2 border-blue-700/50 rounded-2xl p-8"
        >
          <div className="flex items-start gap-4 mb-6">
            <Shield className="w-8 h-8 text-blue-400 flex-shrink-0" />
            <div>
              <h3 className="text-2xl font-black text-white mb-2">
                Preguntas Frecuentes
              </h3>
              <div className="space-y-3 text-gray-300">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">
                    <strong className="text-white">¿Puedo elegir equipos diferentes?</strong> Sí, podés mezclar cualquier equipo
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">
                    <strong className="text-white">¿Si quiero 4 camisetas?</strong> Pagás 1 combo (ARS 32.900) + la 4ta a precio normal
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">
                    <strong className="text-white">¿El envío es gratis?</strong> Sí, el envío está incluido en los ARS 32.900
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">
                    <strong className="text-white">¿Hay límite de combos?</strong> No, podés comprar cuantos combos quieras (cada 3 camisetas = 1 combo)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <motion.a
            href="#bestsellers"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="block w-full md:w-auto md:mx-auto md:max-w-md bg-gradient-to-r from-orange-500 to-red-600 text-white font-black uppercase text-lg py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all text-center"
          >
            Empezar a Comprar
          </motion.a>
        </motion.div>

        {/* Bottom Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mt-8"
        >
          <div className="flex items-center gap-2 bg-green-950/50 border border-green-700/50 px-4 py-2 rounded-full text-sm font-semibold text-green-400">
            <CheckCircle size={16} />
            Descuento Automático
          </div>
          <div className="flex items-center gap-2 bg-green-950/50 border border-green-700/50 px-4 py-2 rounded-full text-sm font-semibold text-green-400">
            <CheckCircle size={16} />
            Sin Código
          </div>
          <div className="flex items-center gap-2 bg-green-950/50 border border-green-700/50 px-4 py-2 rounded-full text-sm font-semibold text-green-400">
            <CheckCircle size={16} />
            100% Seguro
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default HowItWorksCombo3x

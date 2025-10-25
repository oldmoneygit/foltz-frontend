'use client'

import { motion } from 'framer-motion'
import { ShoppingCart, Gift, Shield, CheckCircle } from 'lucide-react'

const steps = [
  {
    number: '1',
    icon: ShoppingCart,
    title: 'Adiciona 2 Productos',
    description: 'Elige tus 2 jerseys favoritos y agrégalos al carrito',
    iconColor: 'bg-blue-500',
  },
  {
    number: '2',
    icon: Gift,
    title: '1 Sale GRATIS',
    description: 'El producto de menor valor sale completamente gratis',
    iconColor: 'bg-yellow-500',
  },
  {
    number: '3',
    icon: Shield,
    title: 'Sin Pegadinhas',
    description: 'No hay trucos, no hay condiciones ocultas. Es así de simple',
    iconColor: 'bg-pink-500',
  },
  {
    number: '4',
    icon: CheckCircle,
    title: 'Desconto Automático',
    description: 'El descuento se aplica automáticamente en el checkout',
    iconColor: 'bg-green-500',
  },
]

const HowItWorks = () => {
  return (
    <section className="py-16 md:py-24 bg-black">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          {/* Badge */}
          <div className="inline-block bg-brand-yellow text-black px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider mb-4">
            Promoción Activa
          </div>

          {/* Title */}
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
            ¿Cómo Funciona el <span className="text-brand-yellow">COMPRA 1 LLEVA 2</span>?
          </h2>

          {/* Subtitle */}
          <p className="text-gray-300 text-base md:text-lg max-w-3xl mx-auto">
            Es simple: comprá 2 productos y 1 sale completamente GRATIS.{' '}
            <span className="text-brand-yellow font-bold">¡Sin pegadinhas, sin trucos!</span>
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
              <div className="absolute -top-3 -left-3 w-10 h-10 bg-brand-yellow text-black rounded-full flex items-center justify-center font-black text-lg z-10">
                {step.number}
              </div>

              {/* Card */}
              <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-xl p-6 h-full hover:border-brand-yellow/50 transition-all duration-300">
                {/* Icon */}
                <div className={`w-14 h-14 ${step.iconColor} rounded-lg flex items-center justify-center mb-4`}>
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

        {/* Bottom Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-yellow-900/30 to-yellow-950/30 border-2 border-yellow-700/50 rounded-2xl p-8 text-center"
        >
          <h3 className="text-2xl md:text-3xl font-black text-white mb-4">
            Válido para <span className="text-brand-yellow">TODOS LOS PRODUCTOS</span>
          </h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            No importa qué jerseys elijas, la promoción se aplica automáticamente. <span className="text-white font-bold">¡Así de fácil!</span>
          </p>

          {/* Badges */}
          <div className="flex flex-wrap justify-center gap-3">
            <div className="flex items-center gap-2 bg-green-950/50 border border-green-700/50 px-4 py-2 rounded-full text-sm font-semibold text-green-400">
              <CheckCircle size={16} />
              Sin Códigos
            </div>
            <div className="flex items-center gap-2 bg-green-950/50 border border-green-700/50 px-4 py-2 rounded-full text-sm font-semibold text-green-400">
              <CheckCircle size={16} />
              Sin Pegadinhas
            </div>
            <div className="flex items-center gap-2 bg-green-950/50 border border-green-700/50 px-4 py-2 rounded-full text-sm font-semibold text-green-400">
              <CheckCircle size={16} />
              100% Automático
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default HowItWorks

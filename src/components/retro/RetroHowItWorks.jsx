'use client'

import { motion } from 'framer-motion'
import { ShoppingBag, Package, Truck, PartyPopper } from 'lucide-react'

const STEPS = [
  {
    icon: ShoppingBag,
    title: 'Elegí tu Pack',
    description: 'Seleccioná cuántas camisetas querés en tu pack (1-5)',
    color: 'text-brand-yellow',
    bgColor: 'bg-brand-yellow/10',
  },
  {
    icon: Package,
    title: 'Elegí tu Talle',
    description: 'Indicá tu talle para que todas las camisetas te queden perfectas',
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10',
  },
  {
    icon: Truck,
    title: 'Envío Gratis',
    description: 'Enviamos a todo el país sin costo adicional',
    color: 'text-green-400',
    bgColor: 'bg-green-400/10',
  },
  {
    icon: PartyPopper,
    title: '¡Disfrutá!',
    description: 'Recibí tus camisetas retro y lucí los clásicos del fútbol',
    color: 'text-purple-400',
    bgColor: 'bg-purple-400/10',
  },
]

export default function RetroHowItWorks() {
  return (
    <section className="py-12 md:py-16 bg-black">
      <div className="container mx-auto px-4">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl md:text-3xl font-black text-white mb-2">
            ¿Cómo Funciona el PACK BLACK?
          </h2>
          <p className="text-gray-400 text-sm">
            En 4 simples pasos tenés tus camisetas retro favoritas
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {STEPS.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <div className="bg-zinc-900/80 rounded-2xl p-6 border border-zinc-800 h-full">
                {/* Step Number */}
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-brand-yellow text-black rounded-full flex items-center justify-center font-black text-sm">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className={`${step.bgColor} w-16 h-16 rounded-xl flex items-center justify-center mb-4`}>
                  <step.icon className={step.color} size={32} />
                </div>

                {/* Content */}
                <h3 className="text-white font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm">{step.description}</p>
              </div>

              {/* Connector (hidden on mobile and last item) */}
              {index < STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 text-zinc-700">
                  →
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Truck, Shield, Info, CheckCircle, ArrowRight } from 'lucide-react'

export default function ProductInfoTabs() {
  const [activeTab, setActiveTab] = useState('envio')

  const tabs = [
    {
      id: 'envio',
      label: 'Envío y Entrega',
      icon: Truck,
    },
    {
      id: 'garantia',
      label: 'Garantía y Devoluciones',
      icon: Shield,
    },
    {
      id: 'cuidados',
      label: 'Cuidados',
      icon: Info,
    },
  ]

  const content = {
    envio: {
      title: 'Envío Gratis a Todo el País',
      icon: Truck,
      features: [
        {
          label: 'Entrega Rápida:',
          text: '3-5 días hábiles en todo Argentina',
        },
        {
          label: 'Envío Gratis:',
          text: 'En todas las compras sin mínimo',
        },
        {
          label: 'Seguimiento:',
          text: 'Código de rastreo en tiempo real',
        },
        {
          label: 'Embalaje:',
          text: 'Packaging premium con protección completa',
        },
      ],
      link: {
        text: 'Ver más sobre entregas',
        href: '/seguimiento',
      },
    },
    garantia: {
      title: 'Compra Protegida 100%',
      icon: Shield,
      features: [
        {
          label: 'Garantía de Calidad:',
          text: 'Máxima calidad premium 1:1 garantizada',
        },
        {
          label: '30 Días para Cambios:',
          text: 'Aceptamos cambios de talle sin costo',
        },
        {
          label: 'Producto Defectuoso:',
          text: 'Reemplazo inmediato en caso de defecto de fábrica',
        },
        {
          label: 'Pago Seguro:',
          text: 'Protección al comprador en cada transacción',
        },
      ],
      link: {
        text: 'Política completa de cambios',
        href: '/politica-cambios',
      },
    },
    cuidados: {
      title: 'Mantené tu Jersey como Nuevo',
      icon: Info,
      features: [
        {
          label: 'Lavado:',
          text: 'Lavar a mano o máquina en ciclo delicado con agua fría (máx. 30°C)',
        },
        {
          label: 'Secado:',
          text: 'No usar secadora. Secar a la sombra en posición horizontal',
        },
        {
          label: 'Planchado:',
          text: 'Planchar del revés a baja temperatura. No planchar sobre números o escudos',
        },
        {
          label: 'Químicos:',
          text: 'No usar blanqueador ni productos químicos agresivos',
        },
        {
          label: 'Almacenamiento:',
          text: 'Guardar en lugar fresco y seco, alejado de la luz solar directa',
        },
      ],
    },
  }

  const activeContent = content[activeTab]
  const ActiveIcon = activeContent.icon

  return (
    <section className="bg-black py-8 md:py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Título centralizado */}
        <h2 className="text-3xl md:text-5xl font-black text-white text-center mb-8 md:mb-12 uppercase tracking-wide">
          Información Importante
        </h2>

        {/* Tabs */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-6 md:mb-8 sm:overflow-x-auto sm:pb-2">
          {tabs.map((tab) => {
            const TabIcon = tab.icon
            const isActive = activeTab === tab.id

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center justify-start sm:justify-center gap-3 px-5 py-4 rounded-xl font-semibold text-sm md:text-base
                  transition-all duration-300 border backdrop-blur-lg flex-1 sm:min-w-fit sm:whitespace-nowrap
                  ${
                    isActive
                      ? 'bg-gradient-to-br from-brand-yellow/20 to-brand-yellow/10 border-brand-yellow/50 text-brand-yellow shadow-lg shadow-brand-yellow/20'
                      : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-brand-yellow/30'
                  }
                `}
              >
                <TabIcon className="w-5 h-5 flex-shrink-0" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Panel de conteúdo */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-xl"
          >
            {/* Título do painel */}
            <h3 className="flex items-center gap-3 text-xl md:text-2xl font-bold text-brand-yellow mb-6">
              <ActiveIcon className="w-6 h-6 md:w-7 md:h-7 flex-shrink-0" />
              {activeContent.title}
            </h3>

            {/* Features */}
            <div className="flex flex-col gap-4">
              {activeContent.features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-3 items-start p-3 bg-black/30 rounded-lg transition-all duration-300 hover:bg-black/50 hover:translate-x-1"
                >
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div className="text-white/90 text-sm md:text-base leading-relaxed">
                    <strong className="text-white font-semibold">{feature.label}</strong>{' '}
                    {feature.text}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Link (se existir) */}
            {activeContent.link && (
              <motion.a
                href={activeContent.link.href}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="inline-flex items-center gap-2 text-brand-yellow hover:text-yellow-300 font-semibold text-sm md:text-base mt-6 transition-all duration-200 group"
              >
                {activeContent.link.text}
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </motion.a>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

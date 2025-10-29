'use client'

import { motion } from 'framer-motion'
import { Shield, Droplet, Wind, Zap, Star, Award } from 'lucide-react'

export default function ProductDescription({ product }) {
  // Extrai a temporada do nome do produto (ex: "Bayern Munich 25-26 Home" → "2025/2026")
  const extractSeason = (productName) => {
    if (!productName) {
      return '2024/2025'
    }

    // Tenta múltiplos padrões de temporada
    // Padrão 1: "XX-XX" (ex: "25-26", "24-25", "07-08")
    let seasonMatch = productName.match(/(\d{2})-(\d{2})/)

    // Padrão 2: "XX/XX" (ex: "25/26", "24/25")
    if (!seasonMatch) {
      seasonMatch = productName.match(/(\d{2})\/(\d{2})/)
    }

    // Padrão 3: "XXXX-XXXX" ou "XXXX/XXXX" (ex: "2025-2026", "2024/2025")
    if (!seasonMatch) {
      const fullYearMatch = productName.match(/(\d{4})[-\/](\d{4})/)
      if (fullYearMatch) {
        const [, startYear, endYear] = fullYearMatch
        return `${startYear}/${endYear}`
      }
    }

    if (seasonMatch) {
      const [, startYear, endYear] = seasonMatch

      // Converte anos de 2 dígitos para 4 dígitos
      // Se o ano inicial é >= 90, assume 1900s, caso contrário 2000s
      const fullStartYear = parseInt(startYear) >= 90 ? `19${startYear}` : `20${startYear}`
      const fullEndYear = parseInt(endYear) >= 90 ? `19${endYear}` : `20${endYear}`

      return `${fullStartYear}/${fullEndYear}`
    }

    // Se não encontrar padrão, retorna temporada padrão
    return '2024/2025'
  }

  const season = extractSeason(product?.name)

  const technicalSpecs = [
    {
      icon: Shield,
      label: 'Material',
      value: 'Poliéster Premium 100%',
      description: 'Tela de alta calidad con doble tejido',
    },
    {
      icon: Droplet,
      label: 'Tecnología',
      value: 'Dri-FIT',
      description: 'Absorbe la transpiración y se seca rápidamente',
    },
    {
      icon: Wind,
      label: 'Ventilación',
      value: 'Mesh Estratégico',
      description: 'Paneles de malla en zonas de alto calor',
    },
    {
      icon: Zap,
      label: 'Ajuste',
      value: 'Stadium Fit',
      description: 'Corte anatómico para máxima movilidad',
    },
    {
      icon: Star,
      label: 'Calidad',
      value: 'Premium 1:1',
      description: 'Réplica idéntica a la versión oficial',
    },
    {
      icon: Award,
      label: 'Temporada',
      value: season,
      description: 'Diseño oficial de la última temporada',
    },
  ]

  const features = [
    'Escudo del equipo bordado en alta definición',
    'Logo del fabricante con detalles premium',
    'Cuello ergonómico con tecnología anti-rozaduras',
    'Costuras reforzadas para mayor durabilidad',
    'Tecnología anti-olor y antibacterial',
    'Colores que no se destiñen con el lavado',
  ]

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Título da seção */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-black text-white uppercase mb-2">
          Especificaciones Técnicas
        </h2>
        <p className="text-white/60 text-sm md:text-base">
          Conocé todos los detalles de tu jersey
        </p>
      </div>

      {/* Grid de especificações técnicas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {technicalSpecs.map((spec, index) => {
          const Icon = spec.icon
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-5 backdrop-blur-sm hover:bg-white/10 hover:border-brand-yellow/30 transition-all duration-300 group"
            >
              {/* Ícone */}
              <div className="mb-4">
                <div className="w-12 h-12 rounded-lg bg-brand-yellow/10 border border-brand-yellow/20 flex items-center justify-center group-hover:bg-brand-yellow/20 transition-all duration-300">
                  <Icon className="w-6 h-6 text-brand-yellow" />
                </div>
              </div>

              {/* Label */}
              <h3 className="text-white/60 text-xs uppercase tracking-wider mb-1">
                {spec.label}
              </h3>

              {/* Value */}
              <p className="text-white font-bold text-base md:text-lg mb-2">
                {spec.value}
              </p>

              {/* Description */}
              <p className="text-white/70 text-xs md:text-sm leading-relaxed">
                {spec.description}
              </p>
            </motion.div>
          )
        })}
      </div>

      {/* Características adicionais */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6 md:p-8 backdrop-blur-sm"
      >
        <h3 className="text-xl md:text-2xl font-bold text-brand-yellow mb-4 flex items-center gap-2">
          <Star className="w-6 h-6" />
          Características Premium
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="flex items-start gap-3 p-3 bg-black/20 rounded-lg hover:bg-black/40 transition-all duration-300"
            >
              <div className="w-2 h-2 rounded-full bg-brand-yellow mt-2 flex-shrink-0" />
              <p className="text-white/90 text-sm md:text-base leading-relaxed">
                {feature}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Selo de qualidade */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-brand-yellow/10 via-yellow-500/10 to-brand-yellow/10 border-2 border-brand-yellow/30 rounded-xl p-6 text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-3">
          <Award className="w-8 h-8 text-brand-yellow" />
          <h3 className="text-xl md:text-2xl font-black text-white uppercase">
            Garantía de Autenticidad
          </h3>
          <Award className="w-8 h-8 text-brand-yellow" />
        </div>
        <p className="text-white/80 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          Todos nuestros jerseys son réplicas premium 1:1 con los mismos materiales y tecnologías que las versiones oficiales.
          Garantizamos la máxima calidad en cada detalle.
        </p>
      </motion.div>
    </div>
  )
}

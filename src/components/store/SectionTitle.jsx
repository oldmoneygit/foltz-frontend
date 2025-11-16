'use client'

import { motion } from 'framer-motion'

/**
 * Componente de título padrão para seções da loja
 * Garante tipografia uniforme e responsiva em toda a aplicação
 * Clean monocromatic design - adapted from Retrobox
 */
const SectionTitle = ({
  title,
  highlight,
  subtitle,
  className = ''
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`text-center mb-8 md:mb-12 px-4 ${className}`}
    >
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-3 md:mb-4 leading-tight uppercase tracking-tight">
        {title}{highlight && <span className="text-white/70"> {highlight}</span>}
      </h2>
      {subtitle && (
        <p className="text-white/60 text-sm md:text-base max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}

export default SectionTitle

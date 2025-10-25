'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function LeagueCards({ leagues = [] }) {
  // Don't render if no leagues
  if (!leagues || leagues.length === 0) {
    return null
  }
  return (
    <section className="py-16 md:py-24 relative overflow-hidden transition-colors duration-300
                        dark:bg-[#0A0A0A]
                        bg-black">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] dark:from-brand-yellow/5 from-brand-yellow/10 via-transparent to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block mb-4"
          >
            <span className="text-brand-yellow text-xs md:text-sm font-black uppercase tracking-[0.3em]">
              🌍 NUESTRAS LIGAS
            </span>
          </motion.div>
          <h2 className="text-3xl md:text-5xl font-black uppercase mb-4">
            <span className="dark:text-white text-white">COLECCIONES </span>
            <span className="text-brand-yellow">OFICIALES</span>
          </h2>
          <p className="text-base md:text-lg max-w-2xl mx-auto
                        dark:text-gray-400 text-gray-300">
            Las mejores ligas de fútbol del mundo
          </p>
        </motion.div>

        {/* League Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {leagues.map((league, index) => (
            <motion.div
              key={league.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={`/liga/${league.slug}`}>
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative h-[300px] md:h-[350px] rounded-2xl overflow-hidden cursor-pointer"
                >
                  {/* Background Image or Gradient */}
                  {league.image ? (
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-all duration-700 group-hover:scale-110"
                      style={{ backgroundImage: `url('${league.image}')` }}
                    />
                  ) : (
                    <div className={`absolute inset-0 bg-gradient-to-br ${league.gradient} transition-all duration-700`} />
                  )}

                  {/* Dark Overlay for better text readability */}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-500" />

                  {/* Title Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <h3 className="text-3xl md:text-4xl font-black text-white text-center px-4 uppercase tracking-tight drop-shadow-2xl">
                      {league.name}
                    </h3>
                  </div>

                  {/* Gradient Glow on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${league.gradient} opacity-0 group-hover:opacity-30 transition-opacity duration-500 mix-blend-overlay`} />

                  {/* Border Glow */}
                  <div className={`absolute inset-0 rounded-2xl border-2 border-white/20 group-hover:border-brand-yellow/70 transition-all duration-500 shadow-2xl ${league.glow}`} />

                  {/* Shine Effect on Hover */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
                    }}
                    animate={{
                      x: ['-100%', '200%'],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatDelay: 2,
                    }}
                  />
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

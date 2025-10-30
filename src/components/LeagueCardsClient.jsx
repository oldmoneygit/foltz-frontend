'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

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

        {/* League Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {leagues.map((league, index) => (
            <motion.div
              key={league.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -50px 0px" }}
              transition={{ duration: 0.2, delay: index * 0.02 }}
            >
              <Link href={`/liga/${league.slug}`}>
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative h-[300px] md:h-[350px] rounded-2xl overflow-hidden cursor-pointer"
                >
                  {/* Background Image OR Gradient Fallback */}
                  {league.image ? (
                    <>
                      {/* Mobile & Desktop: Image fills card */}
                      <div className="absolute inset-0">
                        <Image
                          src={league.image}
                          alt={league.name}
                          fill
                          className="object-cover object-center transition-all duration-700 group-hover:scale-110"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          priority={index < 4}
                          quality={95}
                        />
                      </div>
                    </>
                  ) : (
                    /* Gradient Fallback (only if no image) */
                    <div className={`absolute inset-0 bg-gradient-to-br ${league.gradient}`} />
                  )}

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

'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { useCallback, useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function LeagueCards({ leagues = [] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'start',
      slidesToScroll: 1,
      containScroll: 'trimSnaps'
    },
    [Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: true })]
  )

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false)
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false)

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setPrevBtnEnabled(emblaApi.canScrollPrev())
    setNextBtnEnabled(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
  }, [emblaApi, onSelect])

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
        {/* Header with Navigation */}
        <div className="flex items-center justify-between mb-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-bold text-white"
          >
            Explora por Liga
          </motion.h2>

          {/* Navigation Buttons */}
          <div className="flex gap-2">
            <button
              onClick={scrollPrev}
              disabled={!prevBtnEnabled}
              className="p-2 rounded-full bg-white/10 hover:bg-brand-yellow/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 border border-white/20 hover:border-brand-yellow/50"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={scrollNext}
              disabled={!nextBtnEnabled}
              className="p-2 rounded-full bg-white/10 hover:bg-brand-yellow/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 border border-white/20 hover:border-brand-yellow/50"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4 md:gap-6">
            {leagues.map((league, index) => (
              <div
                key={league.id}
                className="flex-none w-[280px] sm:w-[300px] md:w-[320px] lg:w-[340px]"
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
                            sizes="340px"
                            priority={index < 4}
                            loading={index < 4 ? 'eager' : 'lazy'}
                            quality={75}
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

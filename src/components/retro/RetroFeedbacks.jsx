'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'

const FEEDBACKS = [
  {
    id: 1,
    name: 'Martín G.',
    location: 'Buenos Aires',
    rating: 5,
    text: 'Increíble la calidad de las camisetas retro. Compré la del Boca del 98 y es exactamente como la original. 100% recomendado.',
    product: 'Boca Juniors 1998',
  },
  {
    id: 2,
    name: 'Lucas P.',
    location: 'Córdoba',
    rating: 5,
    text: 'El pack de 4 camisetas es un golazo. Llegaron rápido y todas en excelente estado. Muy buen precio también.',
    product: 'Pack Black Friday',
  },
  {
    id: 3,
    name: 'Sebastián M.',
    location: 'Rosario',
    rating: 5,
    text: 'La Mystery Box fue una sorpresa total. Me llegaron camisetas que ni sabía que existían. Volveré a comprar seguro.',
    product: 'Mystery Box x3',
  },
  {
    id: 4,
    name: 'Diego R.',
    location: 'Mendoza',
    rating: 5,
    text: 'La camiseta de River del 2006 con Gallardo es una locura. Tela de primera y los detalles perfectos.',
    product: 'River Plate 2006',
  },
  {
    id: 5,
    name: 'Federico L.',
    location: 'La Plata',
    rating: 5,
    text: 'Excelente atención y envío super rápido. Las camisetas retro de Argentina son hermosas.',
    product: 'Argentina 1986',
  },
  {
    id: 6,
    name: 'Nicolás B.',
    location: 'Santa Fe',
    rating: 5,
    text: 'Tercera vez que compro y siempre igual de satisfecho. La calidad es increíble para el precio.',
    product: 'Real Madrid 2002',
  },
]

export default function RetroFeedbacks() {
  const [emblaRef] = useEmblaCarousel(
    {
      loop: true,
      align: 'start',
      slidesToScroll: 1,
    },
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
  )

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-zinc-950 to-black">
      <div className="container mx-auto px-4">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl md:text-3xl font-black text-white mb-2">
            ¿Qué dicen nuestros clientes?
          </h2>
          <div className="flex items-center justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="text-brand-yellow fill-brand-yellow" size={20} />
            ))}
            <span className="text-gray-400 ml-2 text-sm">+500 reseñas positivas</span>
          </div>
        </motion.div>

        {/* Carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4">
            {FEEDBACKS.map((feedback) => (
              <motion.div
                key={feedback.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex-none w-[85%] sm:w-[60%] md:w-[45%] lg:w-[32%]"
              >
                <div className="bg-zinc-900/80 rounded-2xl p-6 border border-zinc-800 h-full flex flex-col">
                  {/* Quote Icon */}
                  <Quote className="text-brand-yellow/30 mb-4" size={32} />

                  {/* Rating */}
                  <div className="flex gap-1 mb-3">
                    {[...Array(feedback.rating)].map((_, i) => (
                      <Star key={i} className="text-brand-yellow fill-brand-yellow" size={16} />
                    ))}
                  </div>

                  {/* Text */}
                  <p className="text-gray-300 text-sm mb-4 flex-grow">
                    "{feedback.text}"
                  </p>

                  {/* Product Badge */}
                  <div className="mb-4">
                    <span className="bg-brand-yellow/10 text-brand-yellow text-xs px-3 py-1 rounded-full font-medium">
                      {feedback.product}
                    </span>
                  </div>

                  {/* Author */}
                  <div className="border-t border-zinc-800 pt-4">
                    <p className="text-white font-bold text-sm">{feedback.name}</p>
                    <p className="text-gray-500 text-xs">{feedback.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

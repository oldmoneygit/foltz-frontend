'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import OptimizedImage from '@/components/OptimizedImage'
import { ChevronLeft, ChevronRight, X, Sparkles } from 'lucide-react'
import useEmblaCarousel from 'embla-carousel-react'

const ProductGallery = ({ images = [], productName }) => {
  const [isZoomed, setIsZoomed] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)

  // Embla Carousel for main gallery with loop
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    skipSnaps: false,
    dragFree: false
  })

  // Embla Carousel for thumbnails
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: 'keepSnaps',
    dragFree: true
  })

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi || !emblaThumbsApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
    emblaThumbsApi.scrollTo(emblaApi.selectedScrollSnap())
  }, [emblaApi, emblaThumbsApi])

  const onThumbClick = useCallback(
    (index) => {
      if (!emblaApi || !emblaThumbsApi) return
      emblaApi.scrollTo(index)
    },
    [emblaApi, emblaThumbsApi]
  )

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)

    return () => {
      emblaApi.off('select', onSelect)
      emblaApi.off('reInit', onSelect)
    }
  }, [emblaApi, onSelect])

  if (images.length === 0) {
    return (
      <div className="w-full aspect-square dark:bg-white/5 bg-black/5 rounded-lg flex items-center justify-center">
        <p className="dark:text-white/40 text-black/40 text-sm md:text-base">Sin imágenes disponibles</p>
      </div>
    )
  }

  const handleImageClick = () => {
    setIsZoomed(!isZoomed)
  }

  return (
    <div className="space-y-2 md:space-y-4">
      {/* Main Carousel */}
      <div className="relative">
        <div className="overflow-hidden rounded-2xl md:rounded-3xl" ref={emblaRef}>
          <div className="flex">
            {images.map((image, index) => (
              <div
                key={index}
                className="flex-[0_0_100%] min-w-0 relative aspect-square"
              >
                <div
                  className="absolute inset-0 cursor-zoom-in"
                  onClick={handleImageClick}
                >
                  <OptimizedImage
                    src={image}
                    alt={`${productName} - Imagen ${index + 1}`}
                    fill
                    className="object-contain p-2 md:p-4"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={index === 0}
                    quality={90}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows - Desktop only */}
        {images.length > 1 && (
          <>
            <button
              onClick={scrollPrev}
              className="hidden md:flex absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-12 md:h-12 dark:bg-black/70 dark:hover:bg-black/90 dark:text-white bg-white/70 hover:bg-white/90 text-black rounded-full items-center justify-center transition-all backdrop-blur-sm z-10"
              aria-label="Imagen anterior"
            >
              <ChevronLeft size={20} className="md:w-6 md:h-6" />
            </button>
            <button
              onClick={scrollNext}
              className="hidden md:flex absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-12 md:h-12 dark:bg-black/70 dark:hover:bg-black/90 dark:text-white bg-white/70 hover:bg-white/90 text-black rounded-full items-center justify-center transition-all backdrop-blur-sm z-10"
              aria-label="Imagen siguiente"
            >
              <ChevronRight size={20} className="md:w-6 md:h-6" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-2 md:bottom-4 right-2 md:right-4 dark:bg-black/70 dark:text-white bg-white/70 text-black backdrop-blur-sm px-2 py-1 md:px-3 md:py-1.5 rounded-md md:rounded-lg text-xs md:text-sm font-bold">
            {selectedIndex + 1} / {images.length}
          </div>
        )}

        {/* Swipe Indicator - Mobile only */}
        <div className="md:hidden absolute bottom-2 left-2 dark:bg-black/70 dark:text-white bg-white/70 text-black backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1.5">
          <Sparkles className="w-3 h-3" />
          Deslizá
        </div>
      </div>

      {/* Thumbnails Carousel */}
      {images.length > 1 && (
        <div className="overflow-hidden" ref={emblaThumbsRef}>
          <div className="flex gap-1.5 md:gap-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => onThumbClick(index)}
                className={`flex-[0_0_auto] w-14 h-14 md:w-16 md:h-16 relative rounded-md md:rounded-xl overflow-hidden dark:bg-white/5 bg-black/5 transition-all duration-200 ${
                  selectedIndex === index
                    ? 'dark:ring-2 dark:ring-white dark:shadow-white/30 ring-2 ring-black scale-105 shadow-lg shadow-black/30'
                    : 'ring-1 md:ring-2 ring-transparent dark:hover:ring-white/30 hover:ring-black/30 opacity-60 hover:opacity-100'
                }`}
              >
                <OptimizedImage
                  src={image}
                  alt={`${productName} - Miniatura ${index + 1}`}
                  fill
                  className="object-contain p-1"
                  sizes="64px"
                  quality={60}
                />
                {selectedIndex === index && (
                  <div className="absolute inset-0 dark:bg-gradient-to-t dark:from-white/20 dark:to-transparent bg-gradient-to-t from-black/20 to-transparent" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Zoom Modal */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 dark:bg-black/95 bg-white/95 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setIsZoomed(false)}
          >
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute top-4 right-4 p-2 md:p-3 dark:bg-white/10 dark:hover:bg-white/20 bg-black/10 hover:bg-black/20 rounded-full transition-colors"
              aria-label="Cerrar zoom"
            >
              <X className="w-5 h-5 md:w-6 md:h-6 dark:text-white text-black" />
            </button>
            <div className="relative w-full h-full max-w-6xl max-h-[90vh]">
              <OptimizedImage
                src={images[selectedIndex]}
                alt={`${productName} - Zoom`}
                fill
                className="object-contain"
                sizes="100vw"
                quality={100}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ProductGallery

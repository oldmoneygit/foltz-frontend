'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'

const ProductGallery = ({ images = [], productName }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const handlePrevious = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    )
  }

  const handleNext = () => {
    setCurrentImageIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    )
  }

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index)
  }

  if (images.length === 0) {
    return (
      <div className="w-full aspect-square bg-white/5 rounded-lg flex items-center justify-center">
        <p className="text-white/40">Sin imágenes disponibles</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-white/5 rounded-lg overflow-hidden group">
        <Image
          src={images[currentImageIndex]}
          alt={`${productName} - Imagen ${currentImageIndex + 1}`}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={currentImageIndex === 0}
          quality={90}
        />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Image Counter */}
        <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
          {currentImageIndex + 1} / {images.length}
        </div>

        {/* Zoom Hint */}
        <div className="absolute top-4 right-4 bg-black/60 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          <ZoomIn className="w-5 h-5" />
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
          <div className="flex md:grid md:grid-cols-5 gap-2 pb-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => handleThumbnailClick(index)}
                className={`
                  relative aspect-square rounded-lg overflow-hidden bg-white/5
                  transition-all duration-200 flex-shrink-0
                  w-20 h-20 md:w-auto md:h-auto
                  ${
                    currentImageIndex === index
                      ? 'ring-2 ring-brand-yellow scale-105'
                      : 'ring-2 ring-transparent hover:ring-white/30 opacity-60 hover:opacity-100'
                  }
                `}
              >
                <Image
                  src={image}
                  alt={`${productName} - Miniatura ${index + 1}`}
                  fill
                  className="object-contain"
                  sizes="80px"
                  quality={60}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductGallery

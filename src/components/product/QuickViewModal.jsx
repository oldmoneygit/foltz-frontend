'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { X, Minus, Plus, ShoppingCart, Heart, Package, Truck, Shield, Check } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { useFavorites } from '@/contexts/FavoritesContext'
import { usePackFoltz } from '@/contexts/PackFoltzContext'
import Link from 'next/link'
import { DEFAULT_SIZES } from '@/utils/constants'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const QuickViewModal = ({ product, isOpen, onClose }) => {
  const { addToCart } = useCart()
  const { isFavorite, toggleFavorite } = useFavorites()
  const { addToPack, isInPack, currentCount, packSize, isComplete } = usePackFoltz()
  const [selectedSize, setSelectedSize] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [productImages, setProductImages] = useState([])
  const [isLoadingImages, setIsLoadingImages] = useState(false)
  const [packMessage, setPackMessage] = useState('')
  const [isAddingToPack, setIsAddingToPack] = useState(false)
  const isSyncingRef = useRef(false)

  const {
    id,
    name,
    slug,
    price,
    regularPrice,
    image,
    main_image,
    gallery = [],
    description,
    stock = 'available',
    sizes = DEFAULT_SIZES,
  } = product

  const isWishlisted = isFavorite(id)
  const productImage = main_image || image

  // Initialize refs after destructuring
  const initialGalleryRef = useRef(gallery && gallery.length > 0 ? gallery : [productImage])
  const initialImageRef = useRef(productImage)

  // Update refs when product changes
  useEffect(() => {
    initialGalleryRef.current = gallery && gallery.length > 0 ? gallery : [productImage]
    initialImageRef.current = productImage
  }, [gallery, productImage])

  // Load product gallery images when modal opens
  useEffect(() => {
    if (!isOpen) {
      // Reset to initial image when modal closes
      setProductImages(initialGalleryRef.current)
      return
    }

    if (!slug) return

    // If gallery is already loaded, use it
    if (initialGalleryRef.current.length > 1 || (initialGalleryRef.current.length === 1 && initialGalleryRef.current[0] !== initialImageRef.current)) {
      setProductImages(initialGalleryRef.current)
      setIsLoadingImages(false)
      return
    }

    // Otherwise, just use the main image
    setProductImages([initialImageRef.current])
    setIsLoadingImages(false)
  }, [isOpen, slug])

  // Embla Carousel for main images
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    skipSnaps: false,
    dragFree: false
  })

  // Embla Carousel for thumbnails
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: 'keepSnaps',
    dragFree: true,
    axis: 'x'
  })

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi || !emblaThumbsApi) return

    const onSelect = () => {
      if (isSyncingRef.current) return
      const selected = emblaApi.selectedScrollSnap()
      setSelectedImageIndex(selected)

      // Sync thumbnails only if not already syncing
      if (!isSyncingRef.current && emblaThumbsApi.selectedScrollSnap() !== selected) {
        isSyncingRef.current = true
        emblaThumbsApi.scrollTo(selected)
        setTimeout(() => {
          isSyncingRef.current = false
        }, 150)
      }
    }

    const onThumbSelect = () => {
      if (isSyncingRef.current) return
      const selected = emblaThumbsApi.selectedScrollSnap()
      const mainSelected = emblaApi.selectedScrollSnap()
      if (mainSelected !== selected) {
        isSyncingRef.current = true
        setSelectedImageIndex(selected)
        emblaApi.scrollTo(selected)
        setTimeout(() => {
          isSyncingRef.current = false
        }, 150)
      }
    }

    emblaApi.on('select', onSelect)
    emblaThumbsApi.on('select', onThumbSelect)

    return () => {
      emblaApi.off('select', onSelect)
      emblaThumbsApi.off('select', onThumbSelect)
    }
  }, [emblaApi, emblaThumbsApi])

  const onThumbClick = useCallback(
    (index) => {
      if (!emblaApi || isSyncingRef.current) return
      isSyncingRef.current = true
      emblaApi.scrollTo(index)
      setTimeout(() => {
        isSyncingRef.current = false
      }, 200)
    },
    [emblaApi]
  )

  // Reset state when modal opens/closes and reinit Embla
  useEffect(() => {
    if (isOpen) {
      setSelectedSize(null)
      setQuantity(1)
      setSelectedImageIndex(0)
    }
  }, [isOpen])

  // Reinit Embla when images are loaded or modal opens
  useEffect(() => {
    if (isOpen && productImages.length > 0 && !isLoadingImages && emblaApi && emblaThumbsApi) {
      isSyncingRef.current = true
      setTimeout(() => {
        if (emblaApi) {
          emblaApi.reInit()
          emblaApi.scrollTo(0)
        }
        if (emblaThumbsApi) {
          emblaThumbsApi.reInit()
          emblaThumbsApi.scrollTo(0)
        }
        setSelectedImageIndex(0)
        setTimeout(() => {
          isSyncingRef.current = false
        }, 200)
      }, 100)
    }
  }, [isOpen, productImages.length, isLoadingImages, emblaApi, emblaThumbsApi])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  // Only render portal on client side
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  // Formata o preço como "AR$ XX.XXX,XX"
  const formatPrice = (value) => {
    const formatted = value.toFixed(2).replace('.', ',')
    const parts = formatted.split(',')
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    return `AR$ ${parts.join(',')}`
  }

  const formattedPrice = formatPrice(price)
  const formattedRegularPrice = regularPrice ? formatPrice(regularPrice) : null

  const handleAddToCart = async () => {
    if (!selectedSize) {
      alert('Por favor, selecciona una talla')
      return
    }

    setIsAddingToCart(true)
    try {
      const cartItem = {
        id,
        name,
        slug,
        price,
        image: productImage,
        size: selectedSize,
        quantity,
        variantKey: `${id}::${selectedSize.toLowerCase()}`,
      }

      addToCart(cartItem)

      // Close modal after adding to cart
      setTimeout(() => {
        onClose()
        setIsAddingToCart(false)
      }, 500)
    } catch (error) {
      console.error('Error adding to cart:', error)
      setIsAddingToCart(false)
    }
  }

  const handleAddToPack = async () => {
    if (!selectedSize) {
      alert('Por favor, selecciona una talla')
      return
    }

    setIsAddingToPack(true)
    try {
      const packProduct = {
        id,
        name,
        slug,
        price,
        main_image: productImage,
        images: productImages,
        gallery: productImages,
        size: selectedSize,
        league: product.league,
        shopifyId: product.shopifyId,
        variants: product.variants,
        handle: product.handle,
      }

      // Pass addToCart callback so product is added to BOTH pack AND cart
      const result = addToPack(packProduct, addToCart)
      setPackMessage(result.message)

      // Clear message after 3 seconds
      setTimeout(() => {
        setPackMessage('')
        if (result.success) {
          onClose()
        }
      }, 2000)
    } catch (error) {
      console.error('Error adding to pack:', error)
      setPackMessage('Error al agregar al pack')
    } finally {
      setIsAddingToPack(false)
    }
  }

  const increaseQuantity = () => {
    setQuantity((prev) => Math.min(prev + 1, 10))
  }

  const decreaseQuantity = () => {
    setQuantity((prev) => Math.max(prev - 1, 1))
  }

  if (!isOpen || !mounted) return null

  if (typeof window === 'undefined') return null

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-2 md:p-4 pointer-events-none">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-black border-2 border-white/10 rounded-xl md:rounded-2xl w-full max-w-6xl max-h-[95vh] md:max-h-[90vh] overflow-hidden flex flex-col pointer-events-auto"
            >
          {/* Header */}
          <div className="flex items-center justify-between p-4 md:p-6 border-b border-white/10">
            <h2 className="text-lg md:text-2xl font-black text-white uppercase line-clamp-1 flex-1 pr-4">
              {name}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors shrink-0"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </button>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 p-4 md:p-6">
              {/* Image Gallery */}
              <div className="space-y-3 md:space-y-4">
                {/* Main Image */}
                <div className="relative aspect-square bg-white/5 rounded-lg md:rounded-xl overflow-hidden">
                  {isLoadingImages ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    </div>
                  ) : (
                    <div className="overflow-hidden rounded-lg md:rounded-xl h-full" ref={emblaRef}>
                      <div className="flex h-full">
                        {productImages.length > 0 ? (
                          productImages.map((img, index) => (
                            <div key={index} className="relative flex-[0_0_100%] min-w-0 h-full">
                              {img ? (
                                <Image
                                  src={img}
                                  alt={`${name} - Imagen ${index + 1}`}
                                  fill
                                  className="object-cover"
                                  sizes="(max-width: 768px) 100vw, 50vw"
                                />
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center bg-white/5">
                                  <span className="text-white/40 text-sm">Sin imagen</span>
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="relative flex-[0_0_100%] min-w-0 h-full">
                            <Image
                              src={productImage}
                              alt={name}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, 50vw"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Image Navigation */}
                  {!isLoadingImages && productImages.length > 1 && (
                    <>
                      <button
                        onClick={scrollPrev}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 backdrop-blur-sm text-white p-2 rounded-full z-10 transition-all"
                        aria-label="Imagen anterior"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        onClick={scrollNext}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 backdrop-blur-sm text-white p-2 rounded-full z-10 transition-all"
                        aria-label="Siguiente imagen"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </>
                  )}

                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      toggleFavorite(product)
                    }}
                    className="absolute top-2 right-2 z-10 p-2.5 bg-black/60 backdrop-blur-md rounded-full
                             hover:bg-white/20 transition-all duration-200 active:scale-95"
                    aria-label={isWishlisted ? 'Remover de favoritos' : 'Agregar a favoritos'}
                  >
                    <Heart
                      size={20}
                      className={`${
                        isWishlisted ? 'fill-white text-white' : 'text-white'
                      } transition-colors`}
                    />
                  </button>
                </div>

                {/* Thumbnails with Swipe */}
                {!isLoadingImages && productImages.length > 1 && (
                  <div className="relative mt-3 md:mt-4">
                    <div className="overflow-hidden" ref={emblaThumbsRef}>
                      <div className="flex gap-2 touch-pan-x">
                        {productImages.map((img, index) => (
                          <div
                            key={index}
                            className="flex-[0_0_20%] min-w-0 md:flex-[0_0_16%]"
                          >
                            <button
                              onClick={() => onThumbClick(index)}
                              type="button"
                              className={`relative w-full aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                                selectedImageIndex === index
                                  ? 'border-white scale-105 shadow-lg shadow-white/20'
                                  : 'border-white/20 hover:border-white/40'
                              }`}
                            >
                              <div className="relative w-full h-full">
                                <Image
                                  src={img}
                                  alt={`${name} - Thumbnail ${index + 1}`}
                                  fill
                                  className="object-cover"
                                  sizes="(max-width: 768px) 20vw, 16vw"
                                />
                              </div>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-4 md:space-y-6">
                {/* Price */}
                <div className="space-y-1">
                  {formattedRegularPrice && (
                    <p className="text-gray-400 text-sm md:text-base line-through">
                      {formattedRegularPrice}
                    </p>
                  )}
                  <p className="text-white font-black text-2xl md:text-3xl">
                    {formattedPrice}
                  </p>
                </div>

                {/* Pack Foltz Promo Section */}
                <div className="bg-brand-yellow/10 border border-brand-yellow/30 rounded-lg p-3 md:p-4">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="p-1.5 md:p-2 bg-brand-yellow/20 rounded-lg shrink-0">
                      <Package className="w-3 h-3 md:w-4 md:h-4 text-brand-yellow" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-brand-yellow text-xs md:text-sm font-bold uppercase">
                        Pack Foltz - 4 Camisetas
                      </p>
                      <p className="text-white/60 text-[10px] md:text-xs">
                        Llevá 4 camisetas por solo ARS 59.900
                      </p>
                      {currentCount > 0 && (
                        <p className="text-brand-yellow/80 text-[10px] md:text-xs mt-1">
                          {currentCount}/{packSize} productos en tu pack
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Size Selector */}
                <div className="space-y-2 md:space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-white font-bold text-sm md:text-base uppercase">
                      Talla
                    </label>
                    <Link
                      href={`/product/${slug}`}
                      onClick={onClose}
                      className="text-white/60 hover:text-white text-xs md:text-sm underline"
                    >
                      Ver guía de tallas
                    </Link>
                  </div>
                  <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`py-2 md:py-3 rounded-lg font-bold text-sm md:text-base transition-all ${
                          selectedSize === size
                            ? 'bg-white text-black'
                            : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity Selector */}
                <div className="space-y-2 md:space-y-3">
                  <label className="text-white font-bold text-sm md:text-base uppercase block">
                    Cantidad
                  </label>
                  <div className="flex items-center gap-3 md:gap-4">
                    <button
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                      className="p-2 md:p-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus size={20} />
                    </button>
                    <span className="text-white font-bold text-lg md:text-xl min-w-[2rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={increaseQuantity}
                      disabled={quantity >= 10}
                      className="p-2 md:p-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 pt-2">
                  <div className="flex items-center gap-2 p-2 md:p-3 bg-white/5 rounded-lg">
                    <Package className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    <span className="text-white text-xs md:text-sm font-semibold">Envío Gratis</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 md:p-3 bg-white/5 rounded-lg">
                    <Shield className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    <span className="text-white text-xs md:text-sm font-semibold">Garantía</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 md:p-3 bg-white/5 rounded-lg col-span-2 md:col-span-1">
                    <Truck className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    <span className="text-white text-xs md:text-sm font-semibold">Rápido</span>
                  </div>
                </div>

                {/* Pack Message Feedback */}
                {packMessage && (
                  <div className={`text-center py-2 px-3 rounded-lg text-sm font-semibold ${
                    packMessage.includes('agregado')
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {packMessage}
                  </div>
                )}

                {/* Add to Pack Button */}
                {stock !== 'soldout' && !isComplete && (
                  <button
                    onClick={handleAddToPack}
                    disabled={!selectedSize || isAddingToPack || isInPack(id, selectedSize)}
                    className="w-full bg-brand-yellow/20 border-2 border-brand-yellow text-brand-yellow font-black uppercase py-3 md:py-4 rounded-lg hover:bg-brand-yellow hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm md:text-base"
                  >
                    {isAddingToPack ? (
                      <>
                        <div className="w-5 h-5 border-2 border-brand-yellow border-t-transparent rounded-full animate-spin" />
                        Agregando al Pack...
                      </>
                    ) : isInPack(id, selectedSize) ? (
                      <>
                        <Check size={20} />
                        Ya está en el Pack
                      </>
                    ) : (
                      <>
                        <Package size={20} />
                        Agregar al Pack ({currentCount}/{packSize})
                      </>
                    )}
                  </button>
                )}

                {/* Add to Cart Button */}
                {stock !== 'soldout' ? (
                  <button
                    onClick={handleAddToCart}
                    disabled={!selectedSize || isAddingToCart}
                    className="w-full bg-white text-black font-black uppercase py-3 md:py-4 rounded-lg hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm md:text-base"
                  >
                    {isAddingToCart ? (
                      <>
                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        Agregando...
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={20} />
                        Agregar al Carrito
                      </>
                    )}
                  </button>
                ) : (
                  <div className="w-full bg-white/10 text-white font-bold uppercase py-3 md:py-4 rounded-lg text-center text-sm md:text-base">
                    Agotado
                  </div>
                )}

                {/* View Full Details Link */}
                <Link
                  href={`/product/${slug}`}
                  onClick={onClose}
                  className="block text-center text-white/60 hover:text-white text-sm md:text-base underline transition-colors"
                >
                  Ver página completa del producto
                </Link>
              </div>
            </div>
          </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )

  return createPortal(modalContent, document.body)
}

export default QuickViewModal

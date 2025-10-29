'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ThumbsUp, CheckCircle, X, Camera, Upload } from 'lucide-react'
import Image from 'next/image'

const ProductReviews = () => {
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [helpfulClicked, setHelpfulClicked] = useState({})
  const [newReview, setNewReview] = useState({
    name: '',
    rating: 5,
    comment: '',
    size: '',
    height: '',
    photos: []
  })

  const reviews = [
    {
      name: 'Martín González',
      date: '15 de Enero, 2025',
      rating: 5,
      verified: true,
      comment: 'Excelente calidad! La tela es premium y el ajuste perfecto. Llegó en tiempo récord y el empaque era de primera. Totalmente recomendable.',
      helpful: 24,
      size: 'L',
      height: '1.78m',
      photos: [
        'https://images.unsplash.com/photo-1511556820780-d912e42b4980?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1542830970-967d1be11b4c?w=400&h=400&fit=crop'
      ]
    },
    {
      name: 'Sofía Fernández',
      date: '12 de Enero, 2025',
      rating: 5,
      verified: true,
      comment: 'Me encantó! Los colores son exactamente como en las fotos. La calidad es impresionante, se nota que es un producto premium. Ya compré otra para regalar.',
      helpful: 18,
      size: 'M',
      height: '1.65m',
      photos: [
        'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&h=400&fit=crop'
      ]
    },
    {
      name: 'Lucas Rodríguez',
      date: '10 de Enero, 2025',
      rating: 5,
      verified: true,
      comment: 'Increíble relación calidad-precio. La camiseta es idéntica a la original, súper cómoda para usar. El diseño es hermoso y la tela muy fresca.',
      helpful: 31,
      size: 'XL',
      height: '1.85m',
      photos: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400&h=400&fit=crop'
      ]
    },
    {
      name: 'Valentina Castro',
      date: '8 de Enero, 2025',
      rating: 5,
      verified: true,
      comment: 'Perfecta! Compré para mi novio y quedó encantado. La calidad supera las expectativas. El envío fue rápido y el producto llegó impecable.',
      helpful: 15,
      size: 'L',
      height: '1.80m',
      photos: []
    },
    {
      name: 'Diego Suárez',
      date: '5 de Enero, 2025',
      rating: 5,
      verified: true,
      comment: 'De lo mejor que compré! La camiseta tiene un acabado profesional. Los detalles están perfectos y el material es muy resistente. 100% recomendada.',
      helpful: 27,
      size: 'M',
      height: '1.72m',
      photos: [
        'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=400&h=400&fit=crop'
      ]
    }
  ]

  const StarRating = ({ rating, interactive = false, onRate = null }) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            size={interactive ? 24 : 16}
            className={`${
              index < rating
                ? 'fill-brand-yellow text-brand-yellow'
                : 'text-gray-600'
            } ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
            onClick={() => interactive && onRate && onRate(index + 1)}
          />
        ))}
      </div>
    )
  }

  const handleHelpful = (index) => {
    setHelpfulClicked(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  const handleSubmitReview = (e) => {
    e.preventDefault()
    // Aqui você pode adicionar lógica para enviar o review para um backend
    console.log('New Review:', newReview)
    setShowReviewModal(false)
    setNewReview({
      name: '',
      rating: 5,
      comment: '',
      size: '',
      height: '',
      photos: []
    })
  }

  // Calculate average rating and stats
  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
  const totalReviews = reviews.length
  const recommendationPercentage = Math.round((reviews.filter(r => r.rating >= 4).length / totalReviews) * 100)
  const reviewsWithPhotos = reviews.filter(r => r.photos && r.photos.length > 0).length

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-black via-zinc-950 to-black">
      <div className="container mx-auto max-w-6xl">
        {/* Header with Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-black text-white mb-6">
            Opiniones de Clientes
          </h2>

          {/* Rating Summary */}
          <div className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-2xl p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
              {/* Average Rating */}
              <div className="text-center md:border-r border-zinc-800">
                <div className="text-5xl font-black text-brand-yellow mb-2">
                  {averageRating.toFixed(1)}
                </div>
                <StarRating rating={Math.round(averageRating)} />
                <p className="text-gray-400 text-sm mt-2">
                  Basado en {totalReviews} opiniones
                </p>
              </div>

              {/* Recommendation */}
              <div className="text-center md:border-r border-zinc-800">
                <div className="text-5xl font-black text-brand-yellow mb-2">
                  {recommendationPercentage}%
                </div>
                <div className="flex items-center justify-center gap-2 text-white mb-1">
                  <ThumbsUp size={16} />
                  <span className="font-bold">Recomendado</span>
                </div>
                <p className="text-gray-400 text-sm">
                  Por nuestros clientes
                </p>
              </div>

              {/* Verified Purchases */}
              <div className="text-center md:border-r border-zinc-800">
                <div className="text-5xl font-black text-brand-yellow mb-2">
                  {reviews.filter(r => r.verified).length}
                </div>
                <div className="flex items-center justify-center gap-2 text-white mb-1">
                  <CheckCircle size={16} />
                  <span className="font-bold">Compras Verificadas</span>
                </div>
                <p className="text-gray-400 text-sm">
                  Opiniones auténticas
                </p>
              </div>

              {/* Reviews with Photos */}
              <div className="text-center">
                <div className="text-5xl font-black text-brand-yellow mb-2">
                  {reviewsWithPhotos}
                </div>
                <div className="flex items-center justify-center gap-2 text-white mb-1">
                  <Camera size={16} />
                  <span className="font-bold">Con Fotos</span>
                </div>
                <p className="text-gray-400 text-sm">
                  Reviews con imágenes
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -50px 0px" }}
              transition={{ duration: 0.2, delay: index * 0.02 }}
              className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-2xl p-6 hover:border-brand-yellow/30 transition-all"
            >
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-white font-bold text-lg">
                      {review.name}
                    </h3>
                    {review.verified && (
                      <div className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/10 border border-green-500/30 rounded-full">
                        <CheckCircle size={12} className="text-green-500" />
                        <span className="text-green-500 text-xs font-bold">Verificado</span>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm">{review.date}</p>
                </div>
                <StarRating rating={review.rating} />
              </div>

              {/* Comment */}
              <p className="text-gray-300 leading-relaxed mb-4">
                {review.comment}
              </p>

              {/* Photos */}
              {review.photos && review.photos.length > 0 && (
                <div className="mb-4">
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {review.photos.map((photo, photoIndex) => (
                      <div
                        key={photoIndex}
                        className="relative flex-shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden border-2 border-zinc-700 hover:border-brand-yellow transition-all cursor-pointer group"
                      >
                        <Image
                          src={photo}
                          alt={`Foto ${photoIndex + 1} de ${review.name}`}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Info */}
              <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Talla:</span>
                  <span className="text-white font-bold">{review.size}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Altura:</span>
                  <span className="text-white font-bold">{review.height}</span>
                </div>
              </div>

              {/* Helpful */}
              <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
                <button
                  onClick={() => handleHelpful(index)}
                  className={`flex items-center gap-2 transition-colors ${
                    helpfulClicked[index]
                      ? 'text-brand-yellow'
                      : 'text-gray-400 hover:text-brand-yellow'
                  }`}
                >
                  <ThumbsUp size={16} className={helpfulClicked[index] ? 'fill-brand-yellow' : ''} />
                  <span className="text-sm">
                    Útil ({review.helpful + (helpfulClicked[index] ? 1 : 0)})
                  </span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Write Review CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="mt-8 text-center"
        >
          <p className="text-gray-400 mb-4">
            ¿Ya compraste este producto?
          </p>
          <button
            onClick={() => setShowReviewModal(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-yellow text-black font-bold rounded-full hover:bg-white transition-all hover:scale-105"
          >
            <Star size={20} />
            Escribir una Opinión
          </button>
        </motion.div>
      </div>

      {/* Review Modal */}
      <AnimatePresence>
        {showReviewModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowReviewModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.3 }}
              className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-2xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-black text-white">Escribir Opinión</h3>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="p-2 hover:bg-zinc-800 rounded-full transition-colors"
                >
                  <X size={24} className="text-gray-400" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmitReview} className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-white font-bold mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    required
                    value={newReview.name}
                    onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                    className="w-full px-4 py-3 bg-black border border-zinc-700 rounded-xl text-white focus:border-brand-yellow focus:outline-none transition-colors"
                    placeholder="Tu nombre"
                  />
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-white font-bold mb-2">
                    Calificación *
                  </label>
                  <StarRating
                    rating={newReview.rating}
                    interactive
                    onRate={(rating) => setNewReview({ ...newReview, rating })}
                  />
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-white font-bold mb-2">
                    Tu Opinión *
                  </label>
                  <textarea
                    required
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 bg-black border border-zinc-700 rounded-xl text-white focus:border-brand-yellow focus:outline-none transition-colors resize-none"
                    placeholder="Comparte tu experiencia con este producto..."
                  />
                </div>

                {/* Size and Height */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-bold mb-2">
                      Talla
                    </label>
                    <select
                      value={newReview.size}
                      onChange={(e) => setNewReview({ ...newReview, size: e.target.value })}
                      className="w-full px-4 py-3 bg-black border border-zinc-700 rounded-xl text-white focus:border-brand-yellow focus:outline-none transition-colors"
                    >
                      <option value="">Seleccionar</option>
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                      <option value="XL">XL</option>
                      <option value="XXL">XXL</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-white font-bold mb-2">
                      Altura
                    </label>
                    <input
                      type="text"
                      value={newReview.height}
                      onChange={(e) => setNewReview({ ...newReview, height: e.target.value })}
                      className="w-full px-4 py-3 bg-black border border-zinc-700 rounded-xl text-white focus:border-brand-yellow focus:outline-none transition-colors"
                      placeholder="Ej: 1.75m"
                    />
                  </div>
                </div>

                {/* Photos */}
                <div>
                  <label className="block text-white font-bold mb-2">
                    Fotos (Opcional)
                  </label>
                  <div className="border-2 border-dashed border-zinc-700 rounded-xl p-6 text-center hover:border-brand-yellow transition-colors cursor-pointer">
                    <Upload size={32} className="mx-auto mb-2 text-gray-400" />
                    <p className="text-gray-400 text-sm">
                      Haz clic para subir fotos o arrastra aquí
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      PNG, JPG hasta 5MB
                    </p>
                  </div>
                </div>

                {/* Submit */}
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowReviewModal(false)}
                    className="flex-1 px-6 py-3 bg-zinc-800 text-white font-bold rounded-full hover:bg-zinc-700 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-brand-yellow text-black font-bold rounded-full hover:bg-white transition-all hover:scale-105"
                  >
                    Publicar Opinión
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default ProductReviews

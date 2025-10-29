'use client'

import { motion } from 'framer-motion'
import { Star, Quote, TrendingUp, Camera } from 'lucide-react'
import Image from 'next/image'

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Matías',
      location: 'Buenos Aires',
      rating: 5,
      comment: 'llegó mi city!! re linda la verdad, el celeste es identico. llegó rapido tmb 💙',
      product: 'Manchester City Home',
      photo: '/images/reviews/01.jpeg'
    },
    {
      name: 'Federico',
      location: 'Palermo',
      rating: 5,
      comment: 'Primera vez que compro aca y la verdad quedé re conforme. La camiseta del PSG está increible, parece posta original. Ya recomendé a mis amigos jaja',
      product: 'PSG Jordan Edition',
      photo: '/images/reviews/02.jpeg'
    },
    {
      name: 'Lucas',
      location: 'Córdoba',
      rating: 4,
      comment: 'Buena calidad, me gustó. El envio demoró un poco más de lo esperado pero valió la pena. La tela es comoda para usar',
      product: 'PSG Home 2024',
      photo: '/images/reviews/03.jpeg'
    },
    {
      name: 'Lucía',
      location: 'Rosario',
      rating: 5,
      comment: 'Se la compré a mi novio que es de tottenham y quedó re contento!! La calidad es muy buena, ya pedí más con la promo 3x1 👏',
      product: 'Tottenham Home 2024',
      photo: '/images/reviews/04.jpeg'
    },
    {
      name: 'Agustín',
      location: 'Mendoza',
      rating: 5,
      comment: 'LA PSG JORDAN ES HERMOSAAAA 😍 el tejido está buenisimo, fresco. Foltz tiene re buenos precios comparado con otros lugares',
      product: 'PSG Jordan Black',
      photo: '/images/reviews/05.jpeg'
    },
    {
      name: 'Sofía',
      location: 'La Plata',
      rating: 5,
      comment: 'Le compré esta retro a mi papá para su cumple y lloró de la emoción jajaja. El 10 de zidane atrás está perfectooo, es su favorita ahora 💙',
      product: 'Francia Zidane #10 Retro',
      photo: '/images/reviews/06.jpeg'
    },
    {
      name: 'Santiago',
      location: 'Tucumán',
      rating: 5,
      comment: 'El amarillo del dortmund está espectacular! Calidad 10/10, voy a volver a comprar seguro',
      product: 'Borussia Dortmund Home',
      photo: '/images/reviews/07.jpeg'
    },
    {
      name: 'Diego',
      location: 'Salta',
      rating: 5,
      comment: 'Me copé con la promo del 3x1 y pedí real madrid, barça y bayern. LLEGARON TODAS PERFECTAS chabon, la calidad es tremenda. Pague solo una y me llevé 3, un golazo. Ya se las mostré a todos en el laburo jajaja',
      product: 'Pack 3x1: Madrid, Barça, Bayern',
      photo: '/images/reviews/08.jpeg'
    },
    {
      name: 'Valentina',
      location: 'CABA',
      rating: 4,
      comment: 'Linda camiseta, el rosa es más vibrante de lo que pensaba. Calidad bien 👍',
      product: 'Barcelona Messi #10 Rosa',
      photo: '/images/reviews/09.jpeg'
    },
    {
      name: 'Maximiliano',
      location: 'Mar del Plata',
      rating: 5,
      comment: '2da vez que compro aca. Llegó rapido como siempre, con etiquetas y todo. El tejido dri fit es identico al original, te lo juro',
      product: 'PSG Away 2024',
      photo: '/images/reviews/10.jpeg'
    },
    {
      name: 'Emiliano',
      location: 'Neuquén',
      rating: 5,
      comment: 'tremendo pedido me hice: 2 del real y la de argentina. la promo del 3x1 es posta eh, no es verso. llegaron rapido y perfectas las 3',
      product: 'Pack: Madrid + Argentina',
      photo: '/images/reviews/11.jpeg'
    },
    {
      name: 'Carolina',
      location: 'Rosario',
      rating: 5,
      comment: 'Mi primera compra en Foltz y me encantó!! La del barça calza re bien, los colores son lindísimos 💙❤️ ya quiero comprar más',
      product: 'Barcelona Home 2024',
      photo: '/images/reviews/12.jpeg'
    },
    {
      name: 'Martina',
      location: 'Córdoba Capital',
      rating: 5,
      comment: '3era vez que compro acá! Me encanta como empaquejan todo, siempre llega con las etiquetas y bien protegido. Esta del barça es hermosa 💙❤️',
      product: 'Barcelona Premium Edition',
      photo: '/images/reviews/13.jpeg'
    }
  ]

  const StarRating = ({ rating }) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            size={16}
            className={`${
              index < rating
                ? 'fill-brand-yellow text-brand-yellow'
                : 'text-gray-600'
            }`}
          />
        ))}
      </div>
    )
  }

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-zinc-950 via-black to-zinc-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,215,0,0.03),transparent_70%)]" />

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-yellow/10 border border-brand-yellow/30 rounded-full mb-4">
            <TrendingUp size={16} className="text-brand-yellow" />
            <span className="text-brand-yellow text-xs font-bold uppercase tracking-wider">
              Testimonios
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Lo Que Dicen Nuestros Clientes
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Miles de fanáticos confían en nosotros para lucir los mejores jerseys
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-black text-brand-yellow mb-1">
                4.9/5
              </div>
              <div className="text-sm text-gray-400">Calificación Promedio</div>
              <div className="flex justify-center mt-1">
                <StarRating rating={5} />
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-black text-brand-yellow mb-1">
                5,000+
              </div>
              <div className="text-sm text-gray-400">Clientes Satisfechos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-black text-brand-yellow mb-1">
                99%
              </div>
              <div className="text-sm text-gray-400">Recomendación</div>
            </div>
          </div>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -50px 0px" }}
              transition={{ duration: 0.2, delay: index * 0.02 }}
              className="group relative bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-2xl overflow-hidden hover:border-brand-yellow/30 transition-all"
            >
              {/* Photo */}
              {testimonial.photo && (
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={testimonial.photo}
                    alt={`${testimonial.name} usando ${testimonial.product}`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Photo Badge */}
                  <div className="absolute top-3 right-3">
                    <div className="inline-flex items-center gap-1 px-2 py-1 bg-black/60 backdrop-blur-sm border border-brand-yellow/30 rounded-full">
                      <Camera size={12} className="text-brand-yellow" />
                      <span className="text-brand-yellow text-xs font-bold">Con Foto</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-6">
                {/* Quote Icon */}
                <div className="absolute top-52 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Quote size={48} className="text-brand-yellow" />
                </div>

                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-white font-bold text-lg mb-1">
                      {testimonial.name}
                    </h3>
                    <p className="text-gray-400 text-sm">{testimonial.location}</p>
                  </div>
                  <StarRating rating={testimonial.rating} />
                </div>

                {/* Comment */}
                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                  "{testimonial.comment}"
                </p>

                {/* Product */}
                <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
                  <p className="text-brand-yellow text-xs font-bold uppercase tracking-wider">
                    {testimonial.product}
                  </p>

                  {/* Verified Badge */}
                  <div className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/10 border border-green-500/30 rounded-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-green-500 text-xs font-bold">Verificado</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-400 mb-4">
            ¿Querés ser parte de nuestra comunidad?
          </p>
          <a
            href="#collections"
            className="inline-flex items-center gap-2 px-8 py-4 bg-brand-yellow text-black font-black text-lg rounded-full hover:bg-white transition-all hover:scale-105 uppercase tracking-wide"
          >
            Comprar Ahora
          </a>
        </motion.div>
      </div>
    </section>
  )
}

export default Testimonials

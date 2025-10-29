'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, HelpCircle } from 'lucide-react'

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    {
      question: '¿Los jerseys son originales?',
      answer: 'Trabajamos con réplicas 1:1 premium de la más alta calidad. Nuestros productos provienen de las mejores fábricas del mundo, las mismas que trabajan con grandes marcas del fútbol, garantizando calidad indistinguible de los originales.'
    },
    {
      question: '¿Cuánto tiempo demora el envío?',
      answer: 'El tiempo de envío varía según tu ubicación. Dentro de Buenos Aires y AMBA: 24-48 horas. Resto de Argentina: 3-5 días hábiles. Te enviaremos un código de seguimiento para que puedas rastrear tu pedido.'
    },
    {
      question: '¿Cómo funciona la promoción 3x1?',
      answer: 'Al agregar 3 o más productos a tu carrito, los 2 productos de menor valor son completamente GRATIS. El descuento se aplica automáticamente en el checkout.'
    },
    {
      question: '¿Puedo cambiar o devolver un producto?',
      answer: 'Sí, aceptamos cambios y devoluciones dentro de los 30 días posteriores a la compra. El producto debe estar sin usar, con todas las etiquetas originales. Los costos de envío por cambio o devolución corren por cuenta del cliente.'
    },
    {
      question: '¿Qué métodos de pago aceptan?',
      answer: 'Aceptamos tarjetas de crédito y débito: Visa, Mastercard, American Express, Naranja, y todas las principales tarjetas.'
    },
    {
      question: '¿Cómo elijo la talla correcta?',
      answer: 'Ofrecemos una guía de tallas detallada para cada producto. Te recomendamos revisar las medidas específicas y compararlas con una prenda que te quede bien. En caso de duda, nuestro equipo de soporte puede ayudarte a elegir la talla ideal.'
    },
    {
      question: '¿Tienen tienda física?',
      answer: 'Actualmente somos 100% online para ofrecerte los mejores precios. ¡Estamos construyendo nuestro showroom en Buenos Aires! Pronto podrás ver y probar nuestros jerseys en persona.'
    },
    {
      question: '¿Puedo personalizar mi jersey?',
      answer: 'Sí, ofrecemos servicio de personalización con nombre y número. Puedes seleccionar esta opción al agregar el producto al carrito. La personalización tiene un costo adicional y puede demorar 2-3 días hábiles adicionales.'
    }
  ]

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-black via-zinc-950 to-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,215,0,0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(0,71,171,0.05),transparent_50%)]" />

      <div className="container mx-auto max-w-4xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-yellow/10 border border-brand-yellow/30 rounded-full mb-4">
            <HelpCircle size={16} className="text-brand-yellow" />
            <span className="text-brand-yellow text-xs font-bold uppercase tracking-wider">
              Preguntas Frecuentes
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            ¿Tenés Dudas?
          </h2>
          <p className="text-gray-400 text-lg">
            Encuentra respuestas a las preguntas más comunes
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -50px 0px" }}
              transition={{ duration: 0.2, delay: index * 0.02 }}
              className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-zinc-800/50 transition-colors"
              >
                <span className="text-white font-bold text-base md:text-lg pr-4">
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown
                    size={24}
                    className={`flex-shrink-0 ${
                      openIndex === index ? 'text-brand-yellow' : 'text-gray-400'
                    }`}
                  />
                </motion.div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-6 pb-5 text-gray-300 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-400 mb-4">
            ¿No encontraste lo que buscabas?
          </p>
          <a
            href="/contacto"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-yellow text-black font-bold rounded-full hover:bg-white transition-all hover:scale-105"
          >
            Contactanos
          </a>
        </motion.div>
      </div>
    </section>
  )
}

export default FAQ

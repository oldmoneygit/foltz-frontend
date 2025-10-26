'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { HelpCircle, ChevronDown, Search } from 'lucide-react'

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const faqs = [
    {
      category: 'Productos',
      questions: [
        {
          q: '¿Los productos son originales?',
          a: '¡Sí! Todos nuestros productos son 100% originales y auténticos. Trabajamos únicamente con proveedores oficiales y garantizamos la autenticidad de cada artículo.',
        },
        {
          q: '¿Tienen garantía los productos?',
          a: 'Sí, todos los productos tienen garantía contra defectos de fabricación. Si tu producto llega con algún defecto, hacemos el cambio sin costo adicional.',
        },
        {
          q: '¿Todos los talles están disponibles?',
          a: 'Trabajamos con talles del 36 al 44. Si no encontrás tu talle, contactanos para verificar disponibilidad.',
        },
      ],
    },
    {
      category: 'Envíos y Entregas',
      questions: [
        {
          q: '¿Hacen envíos a toda Argentina?',
          a: 'Sí, realizamos envíos a todo el territorio argentino. El plazo de entrega varía: Buenos Aires (3-5 días), Interior (7-12 días).',
        },
        {
          q: '¿Cuánto demora el envío?',
          a: 'Los plazos de entrega son: Buenos Aires y CABA: 3-5 días hábiles, Provincia de Buenos Aires: 5-7 días hábiles, Interior: 7-12 días hábiles.',
        },
        {
          q: '¿Puedo rastrear mi pedido?',
          a: '¡Sí! Apenas tu pedido sea despachado, recibirás un código de seguimiento para seguir en tiempo real.',
        },
        {
          q: '¿El envío tiene costo?',
          a: 'Envíos GRATIS para compras superiores a ARS 50.000. Por debajo de ese valor, el flete se calcula en el checkout.',
        },
      ],
    },
    {
      category: 'Pagos',
      questions: [
        {
          q: '¿Qué formas de pago aceptan?',
          a: 'Aceptamos tarjetas de crédito y débito (Visa, Mastercard, American Express), Mercado Pago, transferencia bancaria y PIX.',
        },
        {
          q: '¿Puedo pagar en cuotas?',
          a: '¡Sí! Aceptamos pagos en hasta 12 cuotas sin interés a través de Mercado Pago y tarjetas de crédito.',
        },
        {
          q: '¿Es seguro comprar en Foltz?',
          a: '¡Totalmente seguro! Utilizamos encriptación SSL y procesadores de pago certificados. Tus datos están protegidos.',
        },
      ],
    },
    {
      category: 'Cambios y Devoluciones',
      questions: [
        {
          q: '¿Puedo cambiar o devolver mi pedido?',
          a: '¡Sí! Aceptamos cambios y devoluciones hasta 30 días después de la recepción. El producto debe estar sin uso, con etiquetas y en el embalaje original.',
        },
        {
          q: '¿Cómo hacer un cambio de talle?',
          a: 'Contactanos por WhatsApp o email con tu número de pedido. Coordinamos el retiro y envío del nuevo talle sin costo.',
        },
        {
          q: '¿Quién paga el flete de la devolución?',
          a: 'Si el cambio es por error de talle, asumimos el flete. Para cambio de modelo o devolución, el costo es compartido.',
        },
        {
          q: '¿Cuándo recibo mi reembolso?',
          a: 'Después de recibir y verificar el producto, el reembolso se procesa en 5-7 días hábiles en la misma forma de pago.',
        },
      ],
    },
    {
      category: 'Cuenta y Pedidos',
      questions: [
        {
          q: '¿Necesito crear una cuenta para comprar?',
          a: 'No es obligatorio, pero recomendamos crear una cuenta para rastrear pedidos fácilmente y recibir ofertas exclusivas.',
        },
        {
          q: '¿Cómo puedo modificar mi pedido?',
          a: 'Si tu pedido aún no fue despachado, contactanos inmediatamente por WhatsApp y haremos la modificación.',
        },
        {
          q: '¿Puedo cancelar mi pedido?',
          a: '¡Sí! Podés cancelar sin costo si aún no fue despachado. Después del despacho, aplican las políticas de devolución.',
        },
      ],
    },
    {
      category: 'Otros',
      questions: [
        {
          q: '¿Tienen tienda física?',
          a: 'Actualmente operamos 100% online para ofrecer los mejores precios. Hacemos entregas en toda Argentina.',
        },
        {
          q: '¿Hacen venta mayorista?',
          a: '¡Sí! Ofrecemos precios especiales para compras en gran cantidad. Contactanos por WhatsApp para más información.',
        },
        {
          q: '¿Cómo puedo contactarme?',
          a: 'Podés contactarnos por WhatsApp, email (contato@foltz.com.br) o redes sociales. Respondemos todos los días de 9h a 21h.',
        },
      ],
    },
  ]

  const toggleQuestion = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  // Filter FAQs based on search
  const filteredFaqs = faqs.map((category) => ({
    ...category,
    questions: category.questions.filter(
      (item) =>
        item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.a.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((category) => category.questions.length > 0)

  return (
    <>
      <Header />
      <main className="min-h-screen bg-black">
        <div className="container mx-auto px-4 pt-6 md:pt-8 pb-12">
          {/* Header */}
          <div className="mb-8 md:mb-12">
            <div className="flex items-center gap-3 mb-4">
              <HelpCircle className="w-8 h-8 md:w-10 md:h-10 text-brand-yellow" />
              <h1 className="text-3xl md:text-5xl font-black text-white uppercase">
                Preguntas Frecuentes
              </h1>
            </div>
            <p className="text-white/60 text-base md:text-lg">
              Encontrá respuestas a las dudas más comunes
            </p>
          </div>

          {/* Search */}
          <div className="mb-8">
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar pregunta..."
                className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white placeholder:text-white/40 focus:border-brand-yellow focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* FAQ Categories */}
          <div className="space-y-8">
            {filteredFaqs.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <h2 className="text-2xl font-bold text-brand-yellow mb-4">
                  {category.category}
                </h2>
                <div className="space-y-3">
                  {category.questions.map((item, questionIndex) => {
                    const globalIndex = `${categoryIndex}-${questionIndex}`
                    const isOpen = openIndex === globalIndex

                    return (
                      <div
                        key={questionIndex}
                        className="bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden"
                      >
                        <button
                          onClick={() => toggleQuestion(globalIndex)}
                          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                        >
                          <span className="text-white font-bold pr-4">
                            {item.q}
                          </span>
                          <ChevronDown
                            className={`w-5 h-5 text-brand-yellow flex-shrink-0 transition-transform duration-200 ${
                              isOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </button>

                        {isOpen && (
                          <div className="px-6 pb-4 text-white/80 leading-relaxed border-t border-white/10 pt-4">
                            {item.a}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* No results */}
          {filteredFaqs.length === 0 && (
            <div className="text-center py-20">
              <HelpCircle className="w-20 h-20 text-white/20 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">
                Ningún resultado encontrado
              </h3>
              <p className="text-white/60 mb-6">
                Intentá con otros términos de búsqueda
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="bg-brand-yellow text-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-500 transition-colors"
              >
                Ver todas las preguntas
              </button>
            </div>
          )}

          {/* Ajuda adicional */}
          <div className="mt-12 bg-gradient-to-r from-brand-yellow/10 to-yellow-500/10 border border-brand-yellow/30 rounded-xl p-6 md:p-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              ¿No encontraste lo que buscabas?
            </h3>
            <p className="text-white/80 mb-6">
              ¡Nuestro equipo está disponible para ayudarte!
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://wa.me/5511999999999?text=Olá!%20Tenho%20uma%20pergunta"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-brand-yellow text-black font-bold px-6 py-3 rounded-lg hover:bg-yellow-500 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                WhatsApp
              </a>
              <a
                href="mailto:contato@foltz.com.br"
                className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-bold px-6 py-3 rounded-lg hover:bg-white/20 transition-colors"
              >
                Email
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

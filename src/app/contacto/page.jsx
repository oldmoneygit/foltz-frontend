'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { MessageCircle, Mail, Clock, MapPin, Send } from 'lucide-react'

export default function ContatoPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)

    // Simulação de envio (conectar com backend/API depois)
    setTimeout(() => {
      setSending(false)
      setSent(true)
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      })

      // Reset success message after 5 seconds
      setTimeout(() => setSent(false), 5000)
    }, 1500)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-black">
        <div className="container mx-auto px-4 pt-6 md:pt-8 pb-12">
          {/* Header */}
          <div className="mb-8 md:mb-12">
            <div className="flex items-center gap-3 mb-4">
              <MessageCircle className="w-8 h-8 md:w-10 md:h-10 text-brand-yellow" />
              <h1 className="text-3xl md:text-5xl font-black text-white uppercase">
                Contactanos
              </h1>
            </div>
            <p className="text-white/60 text-base md:text-lg">
              ¡Estamos aquí para ayudarte! Contáctanos.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              {/* WhatsApp */}
              <a
                href="https://wa.me/5511999999999?text=Olá!%20Tenho%20uma%20dúvida"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-gradient-to-br from-green-500/20 to-green-500/0 backdrop-blur-sm rounded-xl p-6 border border-green-500/30 hover:border-green-500/50 transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-lg mb-1">WhatsApp</h3>
                    <p className="text-white/60 text-sm mb-2">La forma más rápida de contactarnos</p>
                    <p className="text-green-400 font-bold">+55 11 99999-9999</p>
                    <p className="text-white/40 text-xs mt-2">Respuesta inmediata • 9:00 - 21:00hs</p>
                  </div>
                </div>
              </a>

              {/* Email */}
              <a
                href="mailto:contato@foltz.com.br"
                className="block bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-brand-yellow/50 transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-yellow/20 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-brand-yellow" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-lg mb-1">Email</h3>
                    <p className="text-white/60 text-sm mb-2">Para consultas detalladas</p>
                    <p className="text-brand-yellow font-bold">contato@foltz.com.br</p>
                    <p className="text-white/40 text-xs mt-2">Respuesta en 24-48h</p>
                  </div>
                </div>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com/foltz.oficial"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-gradient-to-br from-pink-500/20 to-purple-500/20 backdrop-blur-sm rounded-xl p-6 border border-pink-500/30 hover:border-pink-500/50 transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-lg mb-1">Instagram</h3>
                    <p className="text-white/60 text-sm mb-2">Seguinos para ofertas exclusivas</p>
                    <p className="text-pink-400 font-bold">@foltz.oficial</p>
                    <p className="text-white/40 text-xs mt-2">Novedades diarias</p>
                  </div>
                </div>
              </a>

              {/* Horários */}
              <div className="bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-yellow/20 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-brand-yellow" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-lg mb-3">Horario de Atención</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-white/60">Lunes a Viernes</span>
                        <span className="text-white font-bold">9:00 - 21:00h</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Sábados</span>
                        <span className="text-white font-bold">10:00 - 18:00h</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Domingos</span>
                        <span className="text-white font-bold">10:00 - 14:00h</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ubicación */}
              <div className="bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-yellow/20 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-brand-yellow" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-lg mb-2">Localização</h3>
                    <p className="text-white/60 text-sm">
                      Loja Online<br />
                      Enviamos para toda Argentina
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <div className="bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm rounded-xl p-6 md:p-8 border border-white/10 sticky top-8">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Enviá un Mensaje
                </h2>

                {sent && (
                  <div className="mb-6 bg-green-500/10 border border-green-500/50 rounded-lg p-4 flex items-start gap-3">
                    <MessageCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <p className="text-green-400 text-sm">
                      ¡Mensaje enviado exitosamente! Nos pondremos en contacto pronto.
                    </p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-white text-sm font-bold mb-2">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Tu nombre"
                      required
                      className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:border-brand-yellow focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-bold mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="tuemail@ejemplo.com"
                      required
                      className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:border-brand-yellow focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-bold mb-2">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+54 9 11 1234-5678"
                      className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:border-brand-yellow focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-bold mb-2">
                      Asunto *
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-brand-yellow focus:outline-none transition-colors"
                    >
                      <option value="">Seleccioná el asunto</option>
                      <option value="consulta">Consulta sobre producto</option>
                      <option value="pedido">Estado del pedido</option>
                      <option value="cambio">Cambio o devolución</option>
                      <option value="tallas">Consulta sobre talles</option>
                      <option value="mayoreo">Mayorista</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white text-sm font-bold mb-2">
                      Mensaje *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Escribí tu mensaje aquí..."
                      rows="5"
                      required
                      className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:border-brand-yellow focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full bg-gradient-to-r from-brand-yellow to-yellow-500 text-black font-black py-4 rounded-lg hover:shadow-lg hover:shadow-brand-yellow/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {sending ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black"></div>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Enviar Mensaje
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

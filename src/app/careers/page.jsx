'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Briefcase, Users, TrendingUp, Heart, Send, FileText } from 'lucide-react'

export default function CareersPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    cv: null,
    message: '',
  })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const positions = [
    {
      title: 'Especialista en Atención al Cliente',
      type: 'Tiempo Completo',
      location: 'Buenos Aires, Argentina',
      description: 'Buscamos una persona apasionada por el servicio al cliente para unirse a nuestro equipo. Serás responsable de ayudar a nuestros clientes con sus consultas y pedidos.',
    },
    {
      title: 'Gestor de Redes Sociales',
      type: 'Tiempo Completo',
      location: 'Remoto',
      description: 'Estamos buscando un creador de contenido creativo para gestionar nuestras redes sociales y conectar con nuestra comunidad de aficionados al fútbol.',
    },
    {
      title: 'Coordinador de Logística',
      type: 'Tiempo Completo',
      location: 'Buenos Aires, Argentina',
      description: 'Únete a nuestro equipo de logística para garantizar que los pedidos lleguen a tiempo a nuestros clientes en toda Argentina.',
    },
  ]

  const benefits = [
    { icon: TrendingUp, title: 'Crecimiento Profesional', description: 'Oportunidades de desarrollo y capacitación continua' },
    { icon: Users, title: 'Ambiente Colaborativo', description: 'Equipo joven, dinámico y apasionado por el fútbol' },
    { icon: Heart, title: 'Beneficios Competitivos', description: 'Salario competitivo, descuentos en productos y más' },
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)

    // Simulación de envío (conectar con backend/API después)
    setTimeout(() => {
      setSending(false)
      setSent(true)
      setFormData({
        name: '',
        email: '',
        phone: '',
        position: '',
        cv: null,
        message: '',
      })

      setTimeout(() => setSent(false), 5000)
    }, 1500)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setFormData(prev => ({ ...prev, cv: file }))
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-black">
        {/* Hero Section */}
        <div className="container mx-auto px-4 pt-12 pb-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 uppercase">
              Trabaja con <span className="text-brand-yellow">Nosotros</span>
            </h1>
            <p className="text-xl text-white/80 leading-relaxed">
              Únete a un equipo apasionado por el fútbol y la excelencia
            </p>
          </div>
        </div>

        {/* Why Join Us Section */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black text-white text-center mb-12">
              ¿Por qué <span className="text-brand-yellow">Foltz Fanwear?</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-8 text-center hover:border-brand-yellow/30 transition-all duration-300"
                >
                  <div className="w-16 h-16 bg-brand-yellow/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-8 h-8 text-brand-yellow" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
                  <p className="text-white/70 text-sm">{benefit.description}</p>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-brand-yellow/10 to-brand-yellow/5 border-2 border-brand-yellow/30 rounded-xl p-8 md:p-12">
              <h3 className="text-2xl font-bold text-white mb-4">
                Nuestra Cultura
              </h3>
              <p className="text-white/80 leading-relaxed mb-4">
                En Foltz Fanwear, creemos que trabajar debe ser tan emocionante como ver un partido de fútbol.
                Nuestro equipo está compuesto por personas apasionadas que aman lo que hacen y comparten
                valores de excelencia, colaboración e innovación.
              </p>
              <p className="text-white/80 leading-relaxed">
                Valoramos la creatividad, la iniciativa y el espíritu de equipo. Si te apasiona el fútbol
                y quieres ser parte de una empresa en crecimiento, este es tu lugar.
              </p>
            </div>
          </div>
        </div>

        {/* Open Positions Section */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black text-white text-center mb-12">
              Posiciones <span className="text-brand-yellow">Abiertas</span>
            </h2>

            <div className="space-y-6">
              {positions.map((position, index) => (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 md:p-8 hover:border-brand-yellow/30 transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                        <Briefcase className="w-6 h-6 text-brand-yellow" />
                        {position.title}
                      </h3>
                      <div className="flex flex-wrap gap-3 text-sm">
                        <span className="text-brand-yellow font-semibold">{position.type}</span>
                        <span className="text-white/60">•</span>
                        <span className="text-white/60">{position.location}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-white/70 leading-relaxed mb-4">
                    {position.description}
                  </p>
                  <a
                    href="#aplicar"
                    className="inline-flex items-center gap-2 text-brand-yellow hover:text-yellow-400 font-semibold transition-colors"
                  >
                    Aplicar ahora →
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Application Form Section */}
        <div id="aplicar" className="container mx-auto px-4 py-12 pb-20">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-8 md:p-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                  Aplica <span className="text-brand-yellow">Ahora</span>
                </h2>
                <p className="text-white/80">
                  Completa el formulario y adjunta tu CV. Nos pondremos en contacto contigo pronto.
                </p>
              </div>

              {sent && (
                <div className="mb-6 bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
                  <p className="text-green-500 font-semibold">
                    ✓ ¡Aplicación enviada con éxito! Nos pondremos en contacto pronto.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-white font-semibold mb-2">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white placeholder-white/40 focus:border-brand-yellow focus:outline-none transition-colors"
                      placeholder="Juan Pérez"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-white font-semibold mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white placeholder-white/40 focus:border-brand-yellow focus:outline-none transition-colors"
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-white font-semibold mb-2">
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white placeholder-white/40 focus:border-brand-yellow focus:outline-none transition-colors"
                      placeholder="+54 9 11 1234-5678"
                    />
                  </div>

                  <div>
                    <label htmlFor="position" className="block text-white font-semibold mb-2">
                      Posición de Interés *
                    </label>
                    <select
                      id="position"
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white focus:border-brand-yellow focus:outline-none transition-colors"
                    >
                      <option value="">Selecciona una posición</option>
                      {positions.map((pos, i) => (
                        <option key={i} value={pos.title}>{pos.title}</option>
                      ))}
                      <option value="otro">Otra posición</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="cv" className="block text-white font-semibold mb-2">
                    CV / Currículum *
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      id="cv"
                      name="cv"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx"
                      required
                      className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-brand-yellow file:text-black file:font-semibold hover:file:bg-yellow-400 focus:border-brand-yellow focus:outline-none transition-colors"
                    />
                  </div>
                  <p className="text-white/40 text-xs mt-2">
                    Formatos aceptados: PDF, DOC, DOCX (máx. 5MB)
                  </p>
                </div>

                <div>
                  <label htmlFor="message" className="block text-white font-semibold mb-2">
                    Mensaje / Carta de Presentación
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white placeholder-white/40 focus:border-brand-yellow focus:outline-none transition-colors resize-none"
                    placeholder="Cuéntanos por qué quieres unirte a nuestro equipo..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full bg-brand-yellow hover:bg-yellow-400 text-black py-4 rounded-lg font-bold text-lg uppercase tracking-wide transition-all duration-300 hover:scale-105 shadow-lg shadow-brand-yellow/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Enviar Aplicación
                    </>
                  )}
                </button>

                <p className="text-white/40 text-xs text-center">
                  Al enviar este formulario, aceptas que tus datos sean procesados de acuerdo con nuestra
                  Política de Privacidad.
                </p>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

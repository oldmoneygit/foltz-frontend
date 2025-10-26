'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Heart, Users, Trophy, Globe } from 'lucide-react'

export default function SobreNosotrosPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-black">
        {/* Hero Section */}
        <div className="container mx-auto px-4 pt-12 pb-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6">
              Sobre <span className="text-brand-yellow">Foltz Fanwear</span>
            </h1>
            <p className="text-xl text-white/80 leading-relaxed">
              Tu destino #1 para jerseys de fútbol auténticos y de alta calidad
            </p>
          </div>
        </div>

        {/* Mission Section */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-8">
                <Heart className="w-12 h-12 text-brand-yellow mb-4" />
                <h2 className="text-3xl font-bold text-white mb-4">
                  Nuestra Misión
                </h2>
                <p className="text-white/80 leading-relaxed mb-4">
                  En Foltz Fanwear, nos dedicamos a traer la pasión del fútbol directamente a tu armario.
                  Creemos que cada jersey cuenta una historia y cada aficionado merece vestir los colores
                  de su equipo con orgullo.
                </p>
                <p className="text-white/80 leading-relaxed">
                  Nuestra misión es proporcionar jerseys auténticos de la más alta calidad,
                  desde las ligas más prestigiosas de Europa hasta los equipos locales de Sudamérica.
                </p>
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-r from-brand-yellow/10 to-brand-yellow/5 border-2 border-brand-yellow/30 rounded-xl p-6">
                  <Users className="w-10 h-10 text-brand-yellow mb-3" />
                  <h3 className="text-xl font-bold text-white mb-2">Comunidad Global</h3>
                  <p className="text-white/70 text-sm">
                    Más de 50,000 clientes satisfechos en toda Argentina y Latinoamérica
                  </p>
                </div>

                <div className="bg-gradient-to-r from-brand-yellow/10 to-brand-yellow/5 border-2 border-brand-yellow/30 rounded-xl p-6">
                  <Trophy className="w-10 h-10 text-brand-yellow mb-3" />
                  <h3 className="text-xl font-bold text-white mb-2">Calidad Premium</h3>
                  <p className="text-white/70 text-sm">
                    Jerseys 1:1 de la más alta calidad, indistinguibles de los originales
                  </p>
                </div>

                <div className="bg-gradient-to-r from-brand-yellow/10 to-brand-yellow/5 border-2 border-brand-yellow/30 rounded-xl p-6">
                  <Globe className="w-10 h-10 text-brand-yellow mb-3" />
                  <h3 className="text-xl font-bold text-white mb-2">Envío Nacional</h3>
                  <p className="text-white/70 text-sm">
                    Entrega rápida y segura a toda Argentina en 3-5 días hábiles
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black text-white text-center mb-12">
              Nuestros <span className="text-brand-yellow">Valores</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-8 text-center hover:border-brand-yellow/30 transition-all duration-300">
                <div className="w-16 h-16 bg-brand-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">⚽</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Pasión</h3>
                <p className="text-white/70 text-sm">
                  El fútbol es más que un deporte, es una forma de vida.
                  Compartimos tu pasión por el juego hermoso.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-8 text-center hover:border-brand-yellow/30 transition-all duration-300">
                <div className="w-16 h-16 bg-brand-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">✨</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Autenticidad</h3>
                <p className="text-white/70 text-sm">
                  Solo ofrecemos réplicas de la más alta calidad 1:1,
                  con atención meticulosa a cada detalle.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-8 text-center hover:border-brand-yellow/30 transition-all duration-300">
                <div className="w-16 h-16 bg-brand-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🤝</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Confianza</h3>
                <p className="text-white/70 text-sm">
                  Tu satisfacción es nuestra prioridad. Garantizamos la calidad
                  de cada jersey que enviamos.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="bg-gradient-to-r from-brand-yellow/10 to-brand-yellow/5 border-2 border-brand-yellow/30 rounded-xl p-8 md:p-12">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-4xl md:text-5xl font-black text-brand-yellow mb-2">
                    50K+
                  </div>
                  <div className="text-white/80 text-sm">
                    Clientes Satisfechos
                  </div>
                </div>
                <div>
                  <div className="text-4xl md:text-5xl font-black text-brand-yellow mb-2">
                    500+
                  </div>
                  <div className="text-white/80 text-sm">
                    Modelos Disponibles
                  </div>
                </div>
                <div>
                  <div className="text-4xl md:text-5xl font-black text-brand-yellow mb-2">
                    5 años
                  </div>
                  <div className="text-white/80 text-sm">
                    En el Mercado
                  </div>
                </div>
                <div>
                  <div className="text-4xl md:text-5xl font-black text-brand-yellow mb-2">
                    24/7
                  </div>
                  <div className="text-white/80 text-sm">
                    Atención al Cliente
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="container mx-auto px-4 py-12 pb-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-6">
              ¿Listo para encontrar tu jersey perfecto?
            </h2>
            <p className="text-white/80 mb-8 text-lg">
              Explora nuestra colección completa de jerseys de las mejores ligas del mundo
            </p>
            <a
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-brand-yellow text-black px-8 py-4 rounded-lg font-bold text-lg uppercase tracking-wide hover:bg-yellow-400 transition-all duration-300 hover:scale-105 shadow-lg shadow-brand-yellow/20"
            >
              Ver Colección
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

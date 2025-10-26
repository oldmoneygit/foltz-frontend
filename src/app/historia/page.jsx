'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Calendar, Rocket, Award, TrendingUp } from 'lucide-react'

export default function HistoriaPage() {
  const timeline = [
    {
      year: '2019',
      title: 'El Inicio',
      description: 'Foltz Fanwear nace de una pasión por el fútbol y la moda deportiva. Comenzamos con una pequeña selección de jerseys de La Liga y Premier League.',
      icon: Rocket,
    },
    {
      year: '2020',
      title: 'Expansión Regional',
      description: 'Expandimos nuestro catálogo para incluir ligas sudamericanas. Alcanzamos 10,000 clientes satisfechos en Argentina.',
      icon: TrendingUp,
    },
    {
      year: '2021',
      title: 'Calidad Premium',
      description: 'Introducimos nuestra línea de jerseys 1:1 premium, estableciendo nuevos estándares de calidad en el mercado argentino.',
      icon: Award,
    },
    {
      year: '2022',
      title: 'Reconocimiento',
      description: 'Nos convertimos en uno de los principales distribuidores de jerseys importados en Argentina con más de 30,000 clientes.',
      icon: Trophy,
    },
    {
      year: '2023',
      title: 'Innovación Continua',
      description: 'Lanzamos nuestra nueva plataforma online y sistema de pedidos mejorado. Alcanzamos 50,000+ clientes satisfechos.',
      icon: Calendar,
    },
    {
      year: '2024',
      title: 'El Futuro',
      description: 'Continuamos creciendo, ofreciendo la mejor selección de jerseys con envío rápido a toda Argentina y Latinoamérica.',
      icon: Rocket,
    },
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen bg-black">
        {/* Hero Section */}
        <div className="container mx-auto px-4 pt-12 pb-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6">
              Nuestra <span className="text-brand-yellow">Historia</span>
            </h1>
            <p className="text-xl text-white/80 leading-relaxed">
              Un viaje de pasión, calidad y dedicación al fútbol
            </p>
          </div>
        </div>

        {/* Story Section */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-8 md:p-12 mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">
                De Aficionados para Aficionados
              </h2>
              <div className="space-y-4 text-white/80 leading-relaxed">
                <p>
                  Todo comenzó con una simple idea: hacer que los jerseys de fútbol de la más alta calidad
                  sean accesibles para todos los aficionados en Argentina. En 2019, un grupo de entusiastas
                  del fútbol se unió con la visión de crear algo especial.
                </p>
                <p>
                  Nos dimos cuenta de que muchos fanáticos querían apoyar a sus equipos favoritos, pero
                  los jerseys oficiales eran difíciles de conseguir o prohibitivamente caros. Decidimos
                  cambiar eso, ofreciendo réplicas de calidad premium 1:1 a precios justos.
                </p>
                <p>
                  Lo que nos diferencia no es solo la calidad de nuestros productos, sino nuestra pasión
                  compartida por el deporte más hermoso del mundo. Cada jersey que vendemos lleva consigo
                  nuestro compromiso con la excelencia y la satisfacción del cliente.
                </p>
                <p className="text-brand-yellow font-semibold">
                  Hoy, orgullosamente servimos a más de 50,000 clientes en toda Argentina y Latinoamérica,
                  y seguimos creciendo cada día.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black text-white text-center mb-16">
              Nuestro <span className="text-brand-yellow">Recorrido</span>
            </h2>

            <div className="relative">
              {/* Timeline Line */}
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-brand-yellow/20" />

              {/* Timeline Items */}
              <div className="space-y-12">
                {timeline.map((item, index) => (
                  <div
                    key={item.year}
                    className={`relative flex items-center ${
                      index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                    } flex-col gap-8`}
                  >
                    {/* Content */}
                    <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 hover:border-brand-yellow/30 transition-all duration-300">
                        <div className={`flex items-center gap-3 mb-3 ${index % 2 === 0 ? 'md:justify-end' : 'md:justify-start'} justify-start`}>
                          <item.icon className="w-6 h-6 text-brand-yellow" />
                          <h3 className="text-2xl font-bold text-white">{item.year}</h3>
                        </div>
                        <h4 className="text-xl font-semibold text-brand-yellow mb-2">
                          {item.title}
                        </h4>
                        <p className="text-white/70 text-sm leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Center Dot */}
                    <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-brand-yellow rounded-full border-4 border-black" />

                    {/* Spacer */}
                    <div className="hidden md:block w-5/12" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black text-white text-center mb-12">
              Logros <span className="text-brand-yellow">Destacados</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-brand-yellow/10 to-brand-yellow/5 border-2 border-brand-yellow/30 rounded-xl p-6 text-center">
                <div className="text-5xl mb-4">🏆</div>
                <h3 className="text-xl font-bold text-white mb-2">Mejor Calidad</h3>
                <p className="text-white/70 text-sm">
                  Reconocidos por ofrecer las mejores réplicas 1:1 del mercado argentino
                </p>
              </div>

              <div className="bg-gradient-to-br from-brand-yellow/10 to-brand-yellow/5 border-2 border-brand-yellow/30 rounded-xl p-6 text-center">
                <div className="text-5xl mb-4">⭐</div>
                <h3 className="text-xl font-bold text-white mb-2">50K+ Clientes</h3>
                <p className="text-white/70 text-sm">
                  Más de 50,000 clientes satisfechos confían en nosotros
                </p>
              </div>

              <div className="bg-gradient-to-br from-brand-yellow/10 to-brand-yellow/5 border-2 border-brand-yellow/30 rounded-xl p-6 text-center">
                <div className="text-5xl mb-4">🚀</div>
                <h3 className="text-xl font-bold text-white mb-2">Envío Rápido</h3>
                <p className="text-white/70 text-sm">
                  Entrega garantizada en 3-5 días a toda Argentina
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="container mx-auto px-4 py-12 pb-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-8 md:p-12">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                Sé Parte de Nuestra Historia
              </h2>
              <p className="text-white/80 mb-8 text-lg">
                Únete a más de 50,000 aficionados que ya confían en Foltz Fanwear
              </p>
              <a
                href="/"
                className="inline-flex items-center justify-center gap-2 bg-brand-yellow text-black px-8 py-4 rounded-lg font-bold text-lg uppercase tracking-wide hover:bg-yellow-400 transition-all duration-300 hover:scale-105 shadow-lg shadow-brand-yellow/20"
              >
                Explorar Colección
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

function Trophy({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
    </svg>
  )
}

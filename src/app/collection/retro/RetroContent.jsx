'use client'

import dynamic from 'next/dynamic'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Suspense } from 'react'

// Dynamic imports for better performance
const RetroBestSellers = dynamic(() => import('@/components/retro/RetroBestSellers'), {
  loading: () => <SectionSkeleton />,
})
const RetroPromoBanner = dynamic(() => import('@/components/retro/RetroPromoBanner'), {
  loading: () => <BannerSkeleton />,
})
const RetroNuestrasColecciones = dynamic(() => import('@/components/retro/RetroNuestrasColecciones'), {
  loading: () => <SectionSkeleton />,
})
const RetroWeekTopSellers = dynamic(() => import('@/components/retro/RetroWeekTopSellers'), {
  loading: () => <SectionSkeleton />,
})
const RetroLiveSlots = dynamic(() => import('@/components/retro/RetroLiveSlots'), {
  loading: () => <SectionSkeleton />,
})
const RetroTeamSection = dynamic(() => import('@/components/retro/RetroTeamSection'), {
  loading: () => <SectionSkeleton />,
})
const RetroHowItWorks = dynamic(() => import('@/components/retro/RetroHowItWorks'), {
  loading: () => <SectionSkeleton />,
})
const RetroFeaturedProducts = dynamic(() => import('@/components/retro/RetroFeaturedProducts'), {
  loading: () => <SectionSkeleton />,
})
const RetroLeaguesGrid = dynamic(() => import('@/components/retro/RetroLeaguesGrid'), {
  loading: () => <SectionSkeleton />,
})
const RetroMysteryBox = dynamic(() => import('@/components/retro/RetroMysteryBox'), {
  loading: () => <SectionSkeleton />,
})
const RetroFeedbacks = dynamic(() => import('@/components/retro/RetroFeedbacks'), {
  loading: () => <SectionSkeleton />,
})

// Loading skeletons
function SectionSkeleton() {
  return (
    <div className="py-12 bg-black">
      <div className="container mx-auto px-4">
        <div className="animate-pulse">
          <div className="h-8 bg-zinc-800 rounded w-1/3 mx-auto mb-8" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-zinc-800 rounded-lg aspect-[3/4]" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function BannerSkeleton() {
  return (
    <div className="py-8 bg-black">
      <div className="container mx-auto px-4">
        <div className="animate-pulse">
          <div className="h-48 bg-zinc-800 rounded-2xl" />
        </div>
      </div>
    </div>
  )
}

export default function RetroContent({ products = [] }) {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-black">
        {/* Hero Banner - Compact */}
        <section className="relative py-10 bg-gradient-to-b from-zinc-950 via-black to-black">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-black text-white mb-2">
                COLECCIÓN <span className="text-brand-yellow">RETRO</span>
              </h1>
              <p className="text-gray-400 text-base md:text-lg mb-4">
                Camisetas clásicas de los 70s a 2000s - Ediciones Limitadas
              </p>
              <div className="inline-flex items-center gap-2 bg-brand-yellow/10 px-4 py-2 rounded-full">
                <span className="text-brand-yellow font-bold">
                  {products.length} productos disponibles
                </span>
              </div>
            </div>
          </div>
        </section>

        <Suspense fallback={<SectionSkeleton />}>
          {/* 1. Los Más Vendidos */}
          <RetroBestSellers products={products} />
        </Suspense>

        <Suspense fallback={<BannerSkeleton />}>
          {/* 2. Banner Promocional */}
          <RetroPromoBanner />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          {/* 3. Nuestras Colecciones (Team Badges Carousel) */}
          <RetroNuestrasColecciones />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          {/* 4. Los más vendidos de esta semana */}
          <RetroWeekTopSellers products={products} />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          {/* 5. Disponibilidad en Tiempo Real */}
          <RetroLiveSlots />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          {/* 6. Sección BOCA JUNIORS */}
          <RetroTeamSection team="boca-juniors" products={products} />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          {/* 7. Sección RIVER PLATE */}
          <RetroTeamSection team="river-plate" products={products} />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          {/* 8. Sección SELECCIÓN ARGENTINA */}
          <RetroTeamSection team="argentina" products={products} />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          {/* 9. ¿Cómo Funciona el PACK BLACK? */}
          <RetroHowItWorks />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          {/* 10. Productos Destacados */}
          <RetroFeaturedProducts products={products} />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          {/* 11. Explora por Liga */}
          <RetroLeaguesGrid />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          {/* 12. Mystery Box */}
          <RetroMysteryBox />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          {/* 12. Feedbacks */}
          <RetroFeedbacks />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}

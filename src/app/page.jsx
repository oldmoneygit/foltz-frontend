import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import BlackFridayHeroBanner from '@/components/blackfriday/BlackFridayHeroBanner'
import HowItWorksBlackFriday from '@/components/blackfriday/HowItWorksBlackFriday'
import BestSellers from '@/components/BestSellersServer'
import HowItWorks from '@/components/HowItWorks'
import Testimonials from '@/components/Testimonials'
import LeagueCards from '@/components/LeagueCardsServer'
import CollectionGrid from '@/components/CollectionGridServer'
import FeaturedProducts from '@/components/FeaturedProductsServer'
import FAQ from '@/components/FAQ'

export const metadata = {
  title: 'Foltz Fanwear - Camisetas de Fútbol Exclusivas',
  description: 'Las mejores camisetas de fútbol vintage y modernas. Colecciones exclusivas de todas las ligas del mundo.',
}

// Revalidar a cada 1 hora para pegar atualizações de preços
export const revalidate = 3600;

export default function Home() {
  return (
    <main className="min-h-screen transition-colors duration-300 dark:bg-[#0A0A0A] bg-black">
      {/* Header with Promotional Banner */}
      <Header />

      {/* Black Friday Banner */}
      <BlackFridayHeroBanner />

      {/* Hero Section */}
      <Hero />

      {/* Best Sellers Carousel */}
      <BestSellers />

      {/* How It Works - PAGO AL RECIBIR (Black Friday) */}
      <HowItWorksBlackFriday />

      {/* How It Works - COMPRA 1 LLEVA 3 */}
      <HowItWorks />

      {/* League Cards - Glassmorphic Design */}
      <LeagueCards />

      {/* Collection Grids - One per league/category with image */}
      <CollectionGrid
        collectionSlug="argentina-legends"
        collectionImage="argentina legends.jpg"
      />

      <CollectionGrid
        collectionSlug="premier-league"
        collectionImage="premier league.jpg"
      />

      <CollectionGrid
        collectionSlug="la-liga"
        collectionImage="la liga.jpg"
      />

      <CollectionGrid
        collectionSlug="serie-a"
        collectionImage="serie A.jpg"
      />

      <CollectionGrid
        collectionSlug="bundesliga"
        collectionImage="bundesliga.jpg"
      />

      <CollectionGrid
        collectionSlug="ligue-1"
        collectionImage="Ligue 1.jpg"
      />

      {/* Featured Products Grid */}
      <FeaturedProducts />

      {/* Testimonials - Customer Reviews */}
      <Testimonials />

      {/* FAQ Section */}
      <FAQ />

      {/* Footer */}
      <Footer />
    </main>
  )
}

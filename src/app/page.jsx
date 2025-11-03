import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import Combo3xHeroBanner from '@/components/combo3x/Combo3xHeroBanner'
import HowItWorksCombo3x from '@/components/combo3x/HowItWorksCombo3x'
import BestSellers from '@/components/BestSellersServer'
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

      {/* Combo 3x Banner */}
      <Combo3xHeroBanner />

      {/* Hero Section */}
      <Hero />

      {/* Best Sellers Carousel */}
      <BestSellers />

      {/* How It Works - COMBO 3x BLACK FRIDAY */}
      <HowItWorksCombo3x />

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

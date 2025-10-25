import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import BestSellers from '@/components/BestSellersServer'
import HowItWorks from '@/components/HowItWorks'
import LeagueCards from '@/components/LeagueCardsServer'
import CollectionCarousel from '@/components/CollectionCarouselServer'
import FeaturedProducts from '@/components/FeaturedProductsServer'

export const metadata = {
  title: 'Foltz Fanwear - Camisas de Futebol Exclusivas',
  description: 'As melhores camisas de futebol vintage e modernas. Coleções exclusivas de todas as ligas do mundo.',
}

export default function Home() {
  return (
    <main className="min-h-screen transition-colors duration-300 dark:bg-[#0A0A0A] bg-black">
      {/* Header with Promotional Banner */}
      <Header />

      {/* Hero Section */}
      <Hero />

      {/* Best Sellers Carousel */}
      <BestSellers />

      {/* How It Works - COMPRA 1 LLEVA 2 */}
      <HowItWorks />

      {/* League Cards - Glassmorphic Design */}
      <LeagueCards />

      {/* Collection Carousels - One per league/category */}
      <CollectionCarousel
        title="Premier League"
        emoji="🏴󠁧󠁢󠁥󠁮󠁧󠁿"
        subtitle="As camisas mais icônicas da liga inglesa"
        collectionSlug="premier-league"
      />

      <CollectionCarousel
        title="La Liga"
        emoji="🇪🇸"
        subtitle="Os clássicos do futebol espanhol"
        collectionSlug="la-liga"
      />

      <CollectionCarousel
        title="Serie A"
        emoji="🇮🇹"
        subtitle="Elegância italiana em cada camisa"
        collectionSlug="serie-a"
      />

      {/* Featured Products Grid */}
      <FeaturedProducts />

      {/* Footer */}
      <Footer />
    </main>
  )
}

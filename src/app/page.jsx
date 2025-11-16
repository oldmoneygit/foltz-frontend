import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import PackBlackPromo from '@/components/promo/PackBlackPromo'
import MysteryBoxBlackFriday from '@/components/promo/MysteryBoxBlackFriday'
import BestSellers from '@/components/BestSellersServer'
import NuestrasColecciones from '@/components/store/NuestrasColecciones'
import CustomerFeedbacks from '@/components/store/CustomerFeedbacks'
import LeagueCards from '@/components/LeagueCardsServer'
import CollectionGrid from '@/components/CollectionGridServer'
import FeaturedProducts from '@/components/FeaturedProductsServer'
import FAQ from '@/components/FAQ'

export const metadata = {
  title: 'Foltz Fanwear - Camisetas de Fútbol Exclusivas | Pack Black 4x59.900',
  description: 'Pack Black: 4 camisetas retro por ARS 59.900 con envío gratis. Mystery Box con descuento progresivo. Colecciones exclusivas de todas las ligas del mundo.',
}

// Revalidar a cada 1 hora para pegar atualizações de preços
export const revalidate = 3600;

export default function Home() {
  return (
    <main className="min-h-screen transition-colors duration-300 dark:bg-[#0A0A0A] bg-black">
      {/* Header with Promotional Banner */}
      <Header />

      {/* Hero Section */}
      <Hero />

      {/* Pack Black Promotion - 4x59.900 */}
      <PackBlackPromo />

      {/* Best Sellers Carousel */}
      <BestSellers />

      {/* Mystery Box Black Friday - Descuento Progresivo */}
      <MysteryBoxBlackFriday />

      {/* Nuestras Colecciones */}
      <NuestrasColecciones />

      {/* Featured Products Grid */}
      <FeaturedProducts />

      {/* League Cards - Carousel */}
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

      {/* Customer Feedbacks - Real Reviews */}
      <CustomerFeedbacks />

      {/* FAQ Section */}
      <FAQ />

      {/* Footer */}
      <Footer />
    </main>
  )
}

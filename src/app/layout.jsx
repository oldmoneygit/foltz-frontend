import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { CartProvider } from '@/contexts/CartContext'
import { FavoritesProvider } from '@/contexts/FavoritesContext'
import ScrollToTop from '@/components/ScrollToTop'
import CacheInitializer from '@/components/CacheInitializer'
import FoltzWidget from '@/components/FoltzWidget'
import MetaPixelLoader from '@/components/MetaPixelLoader'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sink',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'], // Apenas pesos usados
  preload: true,
})

export const metadata = {
  title: 'Foltz Fanwear - Jerseys Importados | Argentina',
  description: 'Los mejores jerseys de fútbol importados. Argentina, Brasil, Europa. Envío a toda Argentina. Réplicas 1:1 Premium.',
  keywords: 'jerseys, camisetas fútbol, argentina, brasil, europa, importados, foltz, fanwear',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5, // Permite zoom (acessibilidade)
  },
  openGraph: {
    title: 'Foltz Fanwear - Jerseys Importados',
    description: 'Los mejores jerseys de fútbol importados',
    images: ['/images/hero/foltz-hero.jpg'],
    locale: 'es_AR',
    type: 'website',
  },
  themeColor: '#DAF10D',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={inter.variable}>
      <head>
        <link rel="icon" href="/images/logo/favicon.ico" />
        
        {/* Preconnect to external domains - Performance Optimization */}
        <link rel="preconnect" href="https://cdn.shopify.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://wz7q3b-4h.myshopify.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://snkhouse-bot-foltz-widget.vercel.app" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://connect.facebook.net" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdn.shopify.com" />
        <link rel="dns-prefetch" href="https://wz7q3b-4h.myshopify.com" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
        
        {/* Preload critical images */}
        <link
          rel="preload"
          as="image"
          href="/images/hero/hero-v2.jpg"
          fetchPriority="high"
        />
        <link
          rel="preload"
          as="image"
          href="/images/logo/logo-white.png"
          fetchPriority="high"
        />
        <link
          rel="preload"
          as="image"
          href="/images/logo/logo-black.png"
          fetchPriority="high"
        />
      </head>
      <body className="min-h-screen">
        <ThemeProvider>
          <CartProvider>
            <FavoritesProvider>
              <CacheInitializer />
              <MetaPixelLoader />
              {children}
              <ScrollToTop />
              <FoltzWidget />
            </FavoritesProvider>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

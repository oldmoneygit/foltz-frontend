import { Inter, Bebas_Neue } from 'next/font/google'
import './globals.css'
import '@/styles/store-modes.css'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { CartProvider } from '@/contexts/CartContext'
import { FavoritesProvider } from '@/contexts/FavoritesContext'
import { BlackFridayProvider } from '@/contexts/BlackFridayContext'
import { PackFoltzProvider } from '@/contexts/PackFoltzContext'
import { StoreModeProvider } from '@/contexts/StoreModeContext'
import ScrollToTop from '@/components/ScrollToTop'
import CacheInitializer from '@/components/CacheInitializer'
import MetaPixelLoader from '@/components/MetaPixelLoader'
import PackFoltzWidget from '@/components/PackFoltzWidget'
import StructuredData from '@/components/StructuredData'

// Font optimization with fallbacks (performance)
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
  preload: true,
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
  adjustFontFallback: true,
})

// Secondary font for headings (optional, melhor UX)
const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
  weight: '400',
  preload: true,
  fallback: ['Impact', 'Arial Black', 'sans-serif'],
  adjustFontFallback: true,
})

// Metadata with metadataBase (fixes SEO warnings)
export const metadata = {
  metadataBase: new URL('https://foltz.com.ar'),
  title: {
    default: 'Foltz Fanwear - Jerseys Importados | Argentina',
    template: '%s | Foltz Fanwear',
  },
  description: 'Los mejores jerseys de fútbol importados. Argentina, Brasil, Europa. Envío a toda Argentina. Réplicas 1:1 Premium.',
  keywords: 'jerseys, camisetas fútbol, argentina, brasil, europa, importados, foltz, fanwear, pack foltz',
  authors: [{ name: 'Foltz Fanwear' }],
  creator: 'Foltz Fanwear',
  publisher: 'Foltz Fanwear',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: 'https://foltz.com.ar',
    title: 'Foltz Fanwear - Jerseys Importados',
    description: 'Los mejores jerseys de fútbol importados. Pack Foltz: 4 camisetas por ARS 59.900',
    siteName: 'Foltz Fanwear',
    images: [
      {
        url: '/images/hero/foltz-hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Foltz Fanwear - Jerseys Importados',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Foltz Fanwear - Jerseys Importados',
    description: 'Los mejores jerseys de fútbol importados. Pack Foltz: 4 camisetas por ARS 59.900',
    images: ['/images/hero/foltz-hero.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/images/logo/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

// Viewport export separado (Next.js 14 best practice)
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#DAF10D' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
}

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${inter.variable} ${bebasNeue.variable}`}>
      <head>
        {/* Theme Script - Apply dark mode by default before React hydrates - Minified */}
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(){try{var t=localStorage.getItem('foltz-theme')||'dark';'dark'===t?document.documentElement.classList.add('dark'):document.documentElement.classList.remove('dark')}catch(e){document.documentElement.classList.add('dark')}}();`,
          }}
        />

        {/* Performance Optimization: Preconnect to critical external domains */}
        <link rel="preconnect" href="https://cdn.shopify.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://wz7q3b-4h.myshopify.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdn.shopify.com" />
        <link rel="dns-prefetch" href="https://wz7q3b-4h.myshopify.com" />

        {/* Defer non-critical connections */}
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
        <link rel="dns-prefetch" href="https://snkhouse-bot-foltz-widget.vercel.app" />

        {/* Performance Optimization: DNS prefetch for critical resources */}

        {/* Mobile & PWA Optimization */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Foltz Fanwear" />
      </head>
      <body className="font-sans antialiased min-h-screen">
        {/* Structured Data - Organization (SEO) */}
        <StructuredData type="organization" />
        <StructuredData type="website" />

        {/* Meta Pixel Tracking */}
        <MetaPixelLoader />

        {/* Fix auto-scroll bug - always start at top */}
        <ScrollToTop />

        {/* Providers */}
        <ThemeProvider>
          <StoreModeProvider>
            <PackFoltzProvider>
              <CartProvider>
                <FavoritesProvider>
                  <BlackFridayProvider>
                    <CacheInitializer />
                    {children}
                    <PackFoltzWidget />
                  </BlackFridayProvider>
                </FavoritesProvider>
              </CartProvider>
            </PackFoltzProvider>
          </StoreModeProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

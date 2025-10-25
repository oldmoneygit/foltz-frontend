import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/contexts/ThemeContext'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sink',
  display: 'swap',
})

export const metadata = {
  title: 'Foltz Fanwear - Jerseys Importados | Argentina',
  description: 'Los mejores jerseys de fútbol importados. Argentina, Brasil, Europa. Envío a toda Argentina. 100% Auténticos.',
  keywords: 'jerseys, camisetas fútbol, argentina, brasil, europa, importados, foltz, fanwear',
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
        <link
          rel="preload"
          as="image"
          href="/images/hero/hero-jersey.jpg"
          fetchPriority="high"
        />
        <link
          rel="preload"
          as="image"
          href="/images/hero/hero-v2.jpg"
          fetchPriority="high"
        />
      </head>
      <body className="min-h-screen">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

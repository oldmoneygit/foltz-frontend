import { ThemeProvider } from '@/contexts/ThemeContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function LeagueLayout({ children }) {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col transition-colors duration-300 dark:bg-[#0A0A0A] bg-black">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  )
}

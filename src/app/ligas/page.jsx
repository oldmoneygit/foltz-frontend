'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { leagues, leagueStats } from '../../data/leagues';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function LigasPage() {
  return (
    <main className="min-h-screen bg-black">
      <Header />
      <div className="bg-gradient-to-b from-black via-brand-navy to-black pt-8 pb-16">
        <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl md:text-7xl font-black mb-6 text-white uppercase tracking-wider">
            Todas as <span className="text-brand-yellow">Ligas</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Explore nossa coleção completa de {leagueStats.totalProducts} jerseys das melhores ligas do mundo
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-8 flex-wrap">
            <div className="text-center">
              <div className="text-4xl font-black text-brand-yellow">{leagueStats.totalLeagues}</div>
              <div className="text-gray-400 uppercase text-sm tracking-wide">Ligas</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-brand-yellow">{leagueStats.totalProducts}</div>
              <div className="text-gray-400 uppercase text-sm tracking-wide">Produtos</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-brand-yellow">{leagueStats.totalImages}</div>
              <div className="text-gray-400 uppercase text-sm tracking-wide">Imagens</div>
            </div>
          </div>
        </motion.div>

        {/* Leagues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {leagues.map((league, index) => (
            <motion.div
              key={league.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={`/liga/${league.slug}`}>
                <div
                  className="group relative overflow-hidden rounded-2xl h-96 cursor-pointer
                           bg-gradient-to-br from-gray-900 to-black
                           border-2 border-transparent
                           hover:border-brand-yellow
                           transition-all duration-300"
                  style={{
                    boxShadow: `0 0 30px ${league.color}20`
                  }}
                >
                  {/* Background Color */}
                  <div
                    className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity"
                    style={{ backgroundColor: league.color }}
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />

                  {/* Content */}
                  <div className="relative h-full flex flex-col justify-end p-6">
                    {/* Flag Icon */}
                    <div className="absolute top-6 right-6 text-7xl opacity-40 group-hover:opacity-100
                                  transition-opacity group-hover:scale-110 duration-300">
                      {league.flag}
                    </div>

                    {/* Featured Badge */}
                    {league.featured && (
                      <div className="absolute top-6 left-6 bg-brand-yellow text-black px-3 py-1
                                    rounded-full text-xs font-black uppercase">
                        Destaque
                      </div>
                    )}

                    {/* League Name */}
                    <h2 className="text-3xl font-black mb-2 text-white uppercase tracking-wide
                                 group-hover:text-brand-yellow transition-colors">
                      {league.name}
                    </h2>

                    {/* Country */}
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
                      {league.country}
                    </p>

                    {/* Description */}
                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                      {league.description}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm mb-4">
                      <div>
                        <span className="text-brand-yellow font-bold text-xl">{league.productCount}</span>
                        <span className="text-gray-400 ml-1">produtos</span>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="inline-flex items-center gap-2 text-brand-yellow font-bold
                                  group-hover:gap-4 transition-all">
                      <span>Explorar Liga</span>
                      <span className="text-xl">→</span>
                    </div>

                    {/* Glow on Hover */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                      style={{
                        boxShadow: `inset 0 0 80px ${league.color}30`,
                      }}
                    />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-16"
        >
          <Link href="/">
            <button className="border-2 border-brand-yellow text-brand-yellow hover:bg-brand-yellow
                             hover:text-black font-black px-8 py-3 rounded-full uppercase tracking-wider
                             transition-all duration-300">
              ← Voltar para Home
            </button>
          </Link>
        </motion.div>
      </div>
      </div>
      <Footer />
    </main>
  );
}

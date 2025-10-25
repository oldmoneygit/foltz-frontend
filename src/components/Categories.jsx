'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { featuredLeagues, leagueStats } from '../data/leagues';

const Categories = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-zinc-950 via-black to-zinc-950 relative">
      {/* Subtle glow effects */}
      <div className="absolute inset-0 bg-gradient-to-tr from-brand-navy/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900/20 via-transparent to-transparent pointer-events-none" />
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl md:text-6xl font-black mb-4 text-white tracking-wider uppercase">
            Explora por <span className="text-brand-yellow">Liga</span>
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            {leagueStats.totalProducts}+ jerseys das melhores ligas do mundo
          </p>
        </motion.div>

        {/* Featured Leagues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {featuredLeagues.slice(0, 6).map((league, index) => (
            <motion.div
              key={league.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/liga/${league.slug}`}>
                <div
                  className="group relative overflow-hidden rounded-2xl h-80 cursor-pointer
                           bg-gradient-to-br from-zinc-900 via-zinc-950 to-black
                           border border-zinc-800
                           hover:border-brand-yellow
                           hover:-translate-y-1 hover:shadow-xl
                           transition-all duration-300 ease-out"
                  style={{
                    boxShadow: `0 0 30px ${league.color}20`
                  }}
                >
                  {/* Background Color Overlay */}
                  <div
                    className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity"
                    style={{ backgroundColor: league.color }}
                  />

                  {/* Image Placeholder */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                  {/* Content */}
                  <div className="relative h-full flex flex-col justify-end p-6">
                    {/* Flag */}
                    <div className="absolute top-6 right-6 text-6xl opacity-50 group-hover:opacity-100 transition-opacity">
                      {league.flag}
                    </div>

                    {/* League Name */}
                    <h3 className="text-3xl font-black mb-2 text-white uppercase tracking-wide
                                 transition-colors duration-200">
                      {league.name}
                    </h3>

                    {/* Country */}
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
                      {league.country}
                    </p>

                    {/* Description */}
                    <p className="text-gray-300 mb-4 line-clamp-2">
                      {league.description}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-brand-yellow font-bold">{league.productCount}</span>
                        <span className="text-gray-400">produtos</span>
                      </div>
                      <div className="w-px h-4 bg-gray-700" />
                      <div className="flex items-center gap-2">
                        <span className="text-brand-yellow font-bold">{league.imageCount}</span>
                        <span className="text-gray-400">imagens</span>
                      </div>
                    </div>

                    {/* View Button */}
                    <div className="mt-4 inline-flex items-center gap-2 text-brand-yellow font-bold
                                  group-hover:gap-3 transition-all duration-200">
                      <span>Explorar</span>
                      <span className="text-xl">→</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link href="/ligas">
            <button className="bg-brand-yellow hover:bg-yellow-400 text-black font-black px-12 py-4
                             rounded-full text-lg uppercase tracking-wider
                             transition-colors duration-300
                             shadow-lg">
              Ver Todas as Ligas ({leagueStats.totalLeagues})
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Categories;

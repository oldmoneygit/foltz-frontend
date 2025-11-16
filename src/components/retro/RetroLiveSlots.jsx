'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Clock, Users, Zap } from 'lucide-react'

export default function RetroLiveSlots() {
  const [slots, setSlots] = useState([
    { id: 1, taken: true, time: '10:23' },
    { id: 2, taken: true, time: '11:45' },
    { id: 3, taken: true, time: '12:30' },
    { id: 4, taken: true, time: '13:15' },
    { id: 5, taken: true, time: '14:08' },
    { id: 6, taken: true, time: '15:22' },
    { id: 7, taken: true, time: '16:47' },
    { id: 8, taken: false, time: null },
    { id: 9, taken: false, time: null },
    { id: 10, taken: false, time: null },
  ])

  const [viewersCount, setViewersCount] = useState(47)
  const [countdown, setCountdown] = useState({ hours: 2, minutes: 45, seconds: 30 })

  // Simulate live activity
  useEffect(() => {
    const interval = setInterval(() => {
      setViewersCount(prev => {
        const change = Math.floor(Math.random() * 5) - 2
        return Math.max(30, Math.min(80, prev + change))
      })
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const takenCount = slots.filter(s => s.taken).length
  const availableCount = slots.filter(s => !s.taken).length

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-black to-zinc-950">
      <div className="container mx-auto px-4">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-red-500/20 px-4 py-2 rounded-full mb-4">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-red-400 font-bold text-sm">EN VIVO</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white mb-2">
            Disponibilidad en Tiempo Real
          </h2>
          <p className="text-gray-400 text-sm">
            Quedan solo <span className="text-brand-yellow font-bold">{availableCount}</span> packs disponibles hoy
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-8">
          {/* Viewers */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-zinc-900/80 rounded-xl p-4 flex items-center justify-center gap-3 border border-zinc-800"
          >
            <Users className="text-brand-yellow" size={24} />
            <div>
              <p className="text-white font-bold text-lg">{viewersCount}</p>
              <p className="text-gray-400 text-xs">personas viendo ahora</p>
            </div>
          </motion.div>

          {/* Packs Sold Today */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-zinc-900/80 rounded-xl p-4 flex items-center justify-center gap-3 border border-zinc-800"
          >
            <Zap className="text-green-500" size={24} />
            <div>
              <p className="text-white font-bold text-lg">{takenCount}</p>
              <p className="text-gray-400 text-xs">packs vendidos hoy</p>
            </div>
          </motion.div>

          {/* Time Left */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-zinc-900/80 rounded-xl p-4 flex items-center justify-center gap-3 border border-zinc-800"
          >
            <Clock className="text-red-500" size={24} />
            <div>
              <p className="text-white font-bold text-lg font-mono">
                {String(countdown.hours).padStart(2, '0')}:
                {String(countdown.minutes).padStart(2, '0')}:
                {String(countdown.seconds).padStart(2, '0')}
              </p>
              <p className="text-gray-400 text-xs">para fin de oferta</p>
            </div>
          </motion.div>
        </div>

        {/* Slots Grid */}
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
            {slots.map((slot, index) => (
              <motion.div
                key={slot.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className={`aspect-square rounded-lg flex items-center justify-center font-bold text-sm transition-all ${
                  slot.taken
                    ? 'bg-red-500/20 border border-red-500/30 text-red-400'
                    : 'bg-green-500/20 border border-green-500/30 text-green-400 animate-pulse'
                }`}
              >
                {slot.taken ? '✓' : '●'}
              </motion.div>
            ))}
          </div>
          <div className="flex justify-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500/20 border border-red-500/30 rounded" />
              <span className="text-gray-400">Vendido</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500/20 border border-green-500/30 rounded animate-pulse" />
              <span className="text-gray-400">Disponible</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

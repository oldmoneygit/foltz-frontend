'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Clock, TrendingUp } from 'lucide-react'

export default function ReservationCountdown() {
  const TOTAL_TIME = 15 * 60 // 15 minutos em segundos
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Verifica se já existe um timer salvo no localStorage
    const savedTime = localStorage.getItem('reservationTimer')
    const savedTimestamp = localStorage.getItem('reservationTimestamp')

    if (savedTime && savedTimestamp) {
      const elapsed = Math.floor((Date.now() - parseInt(savedTimestamp)) / 1000)
      const remaining = parseInt(savedTime) - elapsed

      if (remaining > 0) {
        setTimeLeft(remaining)
      } else {
        // Timer expirou, resetar
        localStorage.removeItem('reservationTimer')
        localStorage.removeItem('reservationTimestamp')
        setTimeLeft(TOTAL_TIME)
        localStorage.setItem('reservationTimestamp', Date.now().toString())
        localStorage.setItem('reservationTimer', TOTAL_TIME.toString())
      }
    } else {
      // Primeira vez, salvar timestamp
      localStorage.setItem('reservationTimestamp', Date.now().toString())
      localStorage.setItem('reservationTimer', TOTAL_TIME.toString())
    }
  }, [TOTAL_TIME])

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsVisible(false)
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1
        localStorage.setItem('reservationTimer', newTime.toString())
        return newTime
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const progressPercentage = (timeLeft / TOTAL_TIME) * 100

  if (!isVisible) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.4 }}
      className="mt-4"
    >
      <div className="relative overflow-hidden rounded-lg bg-black border-t border-l border-r border-brand-yellow/40 shadow-md shadow-brand-yellow/10">
        {/* Glow effect de fundo */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-yellow/5 to-transparent pointer-events-none" />

        <div className="relative z-10 px-4 py-3">
          {/* Header com ícone e título */}
          <div className="flex items-center gap-2 mb-2">
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-6 h-6 rounded-full bg-brand-yellow/20 flex items-center justify-center"
            >
              <Clock className="w-4 h-4 text-brand-yellow" />
            </motion.div>
            <h3 className="text-brand-yellow text-xs font-black uppercase tracking-widest flex items-center gap-1">
              Reserva Activa
              <TrendingUp className="w-3 h-3" />
            </h3>
          </div>

          {/* Texto explicativo */}
          <p className="text-white/70 text-xs mb-3 leading-relaxed">
            <strong className="text-white font-bold">Debido a la alta demanda</strong> tu producto está reservado. Completá tu compra antes de que expire:
          </p>

          {/* Countdown - Minutos e Segundos */}
          <div className="flex items-center justify-center gap-2">
            {/* Minutos */}
            <div className="flex flex-col items-center">
              <motion.div
                key={minutes}
                initial={{ scale: 1.15, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="relative group"
              >
                {/* Glow effect */}
                <div className="absolute inset-0 bg-brand-yellow opacity-0 group-hover:opacity-20 blur-lg transition-all duration-300" />

                {/* Card do número */}
                <div className="relative bg-gradient-to-b from-zinc-900 to-black border border-brand-yellow/30 rounded-lg px-4 py-2 min-w-[60px] shadow-md shadow-brand-yellow/10 group-hover:border-brand-yellow/50 transition-all duration-300">
                  <div className="text-2xl md:text-3xl font-black text-brand-yellow font-mono text-center">
                    {String(minutes).padStart(2, '0')}
                  </div>
                </div>
              </motion.div>
              <span className="text-brand-yellow/60 text-[9px] font-bold uppercase tracking-wider mt-1">
                Minutos
              </span>
            </div>

            {/* Separador */}
            <motion.div
              animate={{
                opacity: [1, 0.3, 1],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-brand-yellow text-2xl md:text-3xl font-black pb-5"
            >
              :
            </motion.div>

            {/* Segundos */}
            <div className="flex flex-col items-center">
              <motion.div
                key={seconds}
                initial={{ scale: 1.15, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="relative group"
              >
                {/* Glow effect */}
                <div className="absolute inset-0 bg-brand-yellow opacity-0 group-hover:opacity-20 blur-lg transition-all duration-300" />

                {/* Card do número */}
                <div className="relative bg-gradient-to-b from-zinc-900 to-black border border-brand-yellow/30 rounded-lg px-4 py-2 min-w-[60px] shadow-md shadow-brand-yellow/10 group-hover:border-brand-yellow/50 transition-all duration-300">
                  <div className="text-2xl md:text-3xl font-black text-brand-yellow font-mono text-center">
                    {String(seconds).padStart(2, '0')}
                  </div>
                </div>
              </motion.div>
              <span className="text-brand-yellow/60 text-[9px] font-bold uppercase tracking-wider mt-1">
                Segundos
              </span>
            </div>
          </div>
        </div>

        {/* Barra de progresso na parte inferior */}
        <div className="relative h-1.5 bg-zinc-900/50 overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full bg-brand-yellow"
            initial={{ width: '100%' }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {/* Efeito de brilho na barra */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{
                x: ['-100%', '200%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

'use client'

import { useState, useEffect } from 'react'

/**
 * Hook para gerenciar estoque limitado de forma realista
 * Simula vendas graduais ao longo do tempo de forma natural
 * Adapted from Retrobox
 */
export function useRealisticStock(productId, initialStock = 100) {
  const [stock, setStock] = useState(initialStock)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  useEffect(() => {
    // Chave única para cada produto
    const storageKey = `stock_${productId}_v2`
    const timestampKey = `stock_timestamp_${productId}_v2`

    // Função para calcular estoque baseado no tempo decorrido
    const calculateRealisticStock = () => {
      const now = new Date()
      const storedStock = localStorage.getItem(storageKey)
      const storedTimestamp = localStorage.getItem(timestampKey)

      // Se já existe estoque armazenado, usar ele
      if (storedStock && storedTimestamp) {
        const lastStoredUpdate = new Date(parseInt(storedTimestamp))
        const minutesPassed = Math.floor((now - lastStoredUpdate) / (1000 * 60))

        let currentStock = parseInt(storedStock)

        // Simular vendas baseado no tempo decorrido
        // Mais vendas em horários de pico (18h-23h e 12h-14h)
        const hour = now.getHours()
        let salesRate = 0.5 // Taxa base: ~0.5 vendas por minuto

        // Horários de pico
        if ((hour >= 18 && hour <= 23) || (hour >= 12 && hour <= 14)) {
          salesRate = 1.2 // Mais vendas no horário nobre
        } else if (hour >= 0 && hour <= 6) {
          salesRate = 0.2 // Menos vendas de madrugada
        }

        // Calcular vendas desde última atualização
        const estimatedSales = Math.floor(minutesPassed * salesRate * (0.7 + Math.random() * 0.6))

        if (estimatedSales > 0) {
          currentStock = Math.max(15, currentStock - estimatedSales) // Nunca abaixo de 15
          localStorage.setItem(storageKey, currentStock.toString())
          localStorage.setItem(timestampKey, now.getTime().toString())
        }

        return currentStock
      }

      // Primeira vez - calcular estoque inicial baseado no dia/hora
      // Variar entre 35-65 unidades restantes para parecer realista
      const dayOfWeek = now.getDay()
      const hour = now.getHours()

      // Domingo e segunda tem mais estoque (nova semana)
      let stockMultiplier = 0.65
      if (dayOfWeek === 0 || dayOfWeek === 1) {
        stockMultiplier = 0.85
      } else if (dayOfWeek === 5 || dayOfWeek === 6) {
        stockMultiplier = 0.45 // Sexta e sábado com menos estoque
      }

      // Ajustar por horário
      if (hour >= 18 && hour <= 23) {
        stockMultiplier -= 0.1 // Menos estoque no horário nobre
      }

      const calculatedStock = Math.floor(initialStock * stockMultiplier) + Math.floor(Math.random() * 8) - 4

      // Garantir que está entre 25 e 70
      const finalStock = Math.min(70, Math.max(25, calculatedStock))

      localStorage.setItem(storageKey, finalStock.toString())
      localStorage.setItem(timestampKey, now.getTime().toString())

      return finalStock
    }

    // Calcular estoque inicial
    const calculatedStock = calculateRealisticStock()
    setStock(calculatedStock)
    setLastUpdate(new Date())

    // Atualizar estoque a cada 45-90 segundos para simular vendas em tempo real
    const updateInterval = setInterval(() => {
      const currentStock = parseInt(localStorage.getItem(storageKey) || calculatedStock)

      // Chance de 30% de ter uma venda a cada intervalo
      if (Math.random() > 0.7 && currentStock > 15) {
        const newStock = currentStock - 1
        localStorage.setItem(storageKey, newStock.toString())
        localStorage.setItem(timestampKey, new Date().getTime().toString())
        setStock(newStock)
        setLastUpdate(new Date())
      }
    }, 45000 + Math.random() * 45000) // Entre 45-90 segundos

    return () => clearInterval(updateInterval)
  }, [productId, initialStock])

  // Calcular porcentagem restante
  const percentageLeft = Math.round((stock / initialStock) * 100)

  // Determinar nível de urgência
  let urgencyLevel = 'low'
  let urgencyMessage = 'Estoque disponible'

  if (stock <= 20) {
    urgencyLevel = 'critical'
    urgencyMessage = 'Últimas unidades'
  } else if (stock <= 35) {
    urgencyLevel = 'high'
    urgencyMessage = 'Stock limitado'
  } else if (stock <= 50) {
    urgencyLevel = 'medium'
    urgencyMessage = 'Stock bajo'
  }

  return {
    stock,
    percentageLeft,
    urgencyLevel,
    urgencyMessage,
    lastUpdate,
    isLowStock: stock <= 35
  }
}

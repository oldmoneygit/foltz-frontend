'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const StoreModeContext = createContext(null)

export function useStoreMode() {
  const context = useContext(StoreModeContext)
  if (!context) {
    throw new Error('useStoreMode must be used within StoreModeProvider')
  }
  return context
}

export function StoreModeProvider({ children }) {
  const [mode, setMode] = useState('atuais')
  const [isLoaded, setIsLoaded] = useState(false)

  // Carregar do localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem('foltz-store-mode')
    if (savedMode === 'atuais' || savedMode === 'retro') {
      setMode(savedMode)
    }
    setIsLoaded(true)
  }, [])

  // Salvar no localStorage e aplicar classe no body
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('foltz-store-mode', mode)

      // Remover classes anteriores
      document.body.classList.remove('store-mode-atuais', 'store-mode-retro')
      // Adicionar nova classe
      document.body.classList.add(`store-mode-${mode}`)
    }
  }, [mode, isLoaded])

  const toggleMode = (newMode) => {
    if (newMode === 'atuais' || newMode === 'retro') {
      setMode(newMode)
    }
  }

  const value = {
    mode,
    setMode: toggleMode,
    isAtuais: mode === 'atuais',
    isRetro: mode === 'retro',
    isLoaded,
  }

  return (
    <StoreModeContext.Provider value={value}>
      {children}
    </StoreModeContext.Provider>
  )
}

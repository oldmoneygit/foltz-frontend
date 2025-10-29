'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const FavoritesContext = createContext()

export const useFavorites = () => {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem('foltz-favorites')
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites))
      }
    } catch (error) {
      console.error('Error loading favorites:', error)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('foltz-favorites', JSON.stringify(favorites))
      } catch (error) {
        console.error('Error saving favorites:', error)
      }
    }
  }, [favorites, isLoaded])

  const addToFavorites = (product) => {
    setFavorites((prevFavorites) => {
      // Check if already in favorites
      const exists = prevFavorites.some(item => item.id === product.id)
      if (exists) return prevFavorites

      return [
        ...prevFavorites,
        {
          id: product.id,
          name: product.name,
          slug: product.slug,
          image: product.main_image || product.gallery?.[0] || product.images?.[0],
          price: product.price,
          league: product.league,
          shopifyId: product.shopifyId,
          variants: product.variants,
          handle: product.handle,
        }
      ]
    })
  }

  const removeFromFavorites = (productId) => {
    setFavorites((prevFavorites) =>
      prevFavorites.filter(item => item.id !== productId)
    )
  }

  const toggleFavorite = (product) => {
    const isFavorite = favorites.some(item => item.id === product.id)
    if (isFavorite) {
      removeFromFavorites(product.id)
    } else {
      addToFavorites(product)
    }
  }

  const isFavorite = (productId) => {
    return favorites.some(item => item.id === productId)
  }

  const clearFavorites = () => {
    setFavorites([])
  }

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        toggleFavorite,
        isFavorite,
        clearFavorites,
        isLoaded,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

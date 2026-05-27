import { createContext, useContext, useState, useCallback } from 'react'
import { getFavorites, addFavorite, removeFavorite, clearFavorites } from '../utils/favorites'

const FavoritesContext = createContext(null)

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => getFavorites())

  const toggle = useCallback((iconId) => {
    setFavorites(prev => {
      if (prev.includes(iconId)) {
        removeFavorite(iconId)
        return prev.filter(id => id !== iconId)
      }
      addFavorite(iconId)
      return [...prev, iconId]
    })
  }, [])

  const clear = useCallback(() => {
    clearFavorites()
    setFavorites([])
  }, [])

  return (
    <FavoritesContext.Provider value={{ favorites, toggle, clear }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites must be used inside FavoritesProvider')
  return ctx
}

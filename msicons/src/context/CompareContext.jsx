import { createContext, useContext, useState, useCallback } from 'react'

export const MAX_COMPARE = 3

const CompareContext = createContext(null)

export function CompareProvider({ children }) {
  const [compareList, setCompareList] = useState([])

  const toggle = useCallback((iconId) => {
    setCompareList(prev => {
      if (prev.includes(iconId)) return prev.filter(id => id !== iconId)
      if (prev.length >= MAX_COMPARE) return prev
      return [...prev, iconId]
    })
  }, [])

  const clear = useCallback(() => setCompareList([]), [])

  return (
    <CompareContext.Provider value={{ compareList, toggle, clear }}>
      {children}
    </CompareContext.Provider>
  )
}

export function useCompare() {
  const ctx = useContext(CompareContext)
  if (!ctx) throw new Error('useCompare must be used inside CompareProvider')
  return ctx
}

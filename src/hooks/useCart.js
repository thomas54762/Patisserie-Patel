import { useState, useCallback } from 'react'

export function useCart() {
  const [items, setItems] = useState([])

  const addItem = useCallback((product, quantity) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.ID === product.ID)
      if (existing) {
        return prev.map((i) =>
          i.product.ID === product.ID
            ? { ...i, quantity: i.quantity + quantity }
            : i
        )
      }
      return [...prev, { product, quantity }]
    })
  }, [])

  const updateQuantity = useCallback((productId, quantity) => {
    setItems((prev) => {
      if (quantity <= 0) return prev.filter((i) => i.product.ID !== productId)
      return prev.map((i) =>
        i.product.ID === productId ? { ...i, quantity } : i
      )
    })
  }, [])

  const removeItem = useCallback((productId) => {
    setItems((prev) => prev.filter((i) => i.product.ID !== productId))
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)

  return { items, addItem, updateQuantity, removeItem, clearCart, totalItems }
}

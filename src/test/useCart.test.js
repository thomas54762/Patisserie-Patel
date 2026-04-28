import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCart } from '../hooks/useCart'

const mockProduct = { ID: '1', Naam: 'Taartje', Qty_per_doos: 6 }
const mockProduct2 = { ID: '2', Naam: 'Macaron', Qty_per_doos: 12 }

describe('useCart', () => {
  it('starts empty', () => {
    const { result } = renderHook(() => useCart())
    expect(result.current.items).toHaveLength(0)
    expect(result.current.totalItems).toBe(0)
  })

  it('adds a product', () => {
    const { result } = renderHook(() => useCart())
    act(() => result.current.addItem(mockProduct, 2))
    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].quantity).toBe(2)
    expect(result.current.totalItems).toBe(2)
  })

  it('accumulates quantity when adding same product twice', () => {
    const { result } = renderHook(() => useCart())
    act(() => result.current.addItem(mockProduct, 2))
    act(() => result.current.addItem(mockProduct, 3))
    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].quantity).toBe(5)
  })

  it('adds multiple different products', () => {
    const { result } = renderHook(() => useCart())
    act(() => result.current.addItem(mockProduct, 1))
    act(() => result.current.addItem(mockProduct2, 2))
    expect(result.current.items).toHaveLength(2)
    expect(result.current.totalItems).toBe(3)
  })

  it('removes a product when quantity set to 0', () => {
    const { result } = renderHook(() => useCart())
    act(() => result.current.addItem(mockProduct, 2))
    act(() => result.current.updateQuantity('1', 0))
    expect(result.current.items).toHaveLength(0)
  })

  it('updates quantity', () => {
    const { result } = renderHook(() => useCart())
    act(() => result.current.addItem(mockProduct, 2))
    act(() => result.current.updateQuantity('1', 5))
    expect(result.current.items[0].quantity).toBe(5)
  })

  it('removes a product by ID', () => {
    const { result } = renderHook(() => useCart())
    act(() => result.current.addItem(mockProduct, 1))
    act(() => result.current.addItem(mockProduct2, 1))
    act(() => result.current.removeItem('1'))
    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].product.ID).toBe('2')
  })

  it('clears the cart', () => {
    const { result } = renderHook(() => useCart())
    act(() => result.current.addItem(mockProduct, 3))
    act(() => result.current.clearCart())
    expect(result.current.items).toHaveLength(0)
    expect(result.current.totalItems).toBe(0)
  })
})

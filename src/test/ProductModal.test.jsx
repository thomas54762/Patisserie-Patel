import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ProductModal } from '../components/ProductModal'

const product = { ID: '1', Naam: 'Macaron', Qty_per_doos: 12, Omschrijving: 'Heerlijke macaron' }

describe('ProductModal', () => {
  it('renders product name and description', () => {
    render(<ProductModal product={product} onAdd={() => {}} onClose={() => {}} />)
    expect(screen.getByText('Macaron')).toBeInTheDocument()
    expect(screen.getByText('Heerlijke macaron')).toBeInTheDocument()
  })

  it('starts with quantity 1', () => {
    render(<ProductModal product={product} onAdd={() => {}} onClose={() => {}} />)
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('increments quantity', () => {
    render(<ProductModal product={product} onAdd={() => {}} onClose={() => {}} />)
    fireEvent.click(screen.getByLabelText('Meer'))
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('decrements quantity but not below 1', () => {
    render(<ProductModal product={product} onAdd={() => {}} onClose={() => {}} />)
    fireEvent.click(screen.getByLabelText('Minder'))
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('calls onAdd with product and quantity on Toevoegen click', () => {
    const onAdd = vi.fn()
    const onClose = vi.fn()
    render(<ProductModal product={product} onAdd={onAdd} onClose={onClose} />)
    fireEvent.click(screen.getByLabelText('Meer'))
    fireEvent.click(screen.getByText('Toevoegen'))
    expect(onAdd).toHaveBeenCalledWith(product, 2)
    expect(onClose).toHaveBeenCalled()
  })

  it('calls onClose when close button clicked', () => {
    const onClose = vi.fn()
    render(<ProductModal product={product} onAdd={() => {}} onClose={onClose} />)
    fireEvent.click(screen.getByLabelText('Sluiten'))
    expect(onClose).toHaveBeenCalled()
  })

  it('renders nothing when product is null', () => {
    const { container } = render(
      <ProductModal product={null} onAdd={() => {}} onClose={() => {}} />
    )
    expect(container.firstChild).toBeNull()
  })
})

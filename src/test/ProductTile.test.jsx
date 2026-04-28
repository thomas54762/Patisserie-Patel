import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ProductTile } from '../components/ProductTile'

const product = { ID: '1', Naam: 'Chocolade taart', Qty_per_doos: 6, Omschrijving: 'Heerlijk' }

describe('ProductTile', () => {
  it('renders product name', () => {
    render(<ProductTile product={product} cartQuantity={0} onClick={() => {}} />)
    expect(screen.getByText('Chocolade taart')).toBeInTheDocument()
  })

  it('renders qty_per_doos', () => {
    render(<ProductTile product={product} cartQuantity={0} onClick={() => {}} />)
    expect(screen.getByText(/6 per doos/)).toBeInTheDocument()
  })

  it('calls onClick with product when clicked', () => {
    const onClick = vi.fn()
    render(<ProductTile product={product} cartQuantity={0} onClick={onClick} />)
    fireEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledWith(product)
  })

  it('shows cart badge when cartQuantity > 0', () => {
    render(<ProductTile product={product} cartQuantity={3} onClick={() => {}} />)
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('does not show badge when cartQuantity is 0', () => {
    render(<ProductTile product={product} cartQuantity={0} onClick={() => {}} />)
    expect(screen.queryByText('0')).not.toBeInTheDocument()
  })
})

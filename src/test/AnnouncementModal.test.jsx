import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AnnouncementModal } from '../components/AnnouncementModal'

const announcement = {
  ID: '1',
  Naam: 'Zomertip',
  Aankondiging: 'Bestel voor volgende week vrijdag.',
  Start_datum_tijd: '01-Jan-2020 00:00:00',
  Eind_datum_tijd: '01-Jan-2099 00:00:00',
}

describe('AnnouncementModal', () => {
  it('renders title and message', () => {
    render(<AnnouncementModal announcement={announcement} onClose={() => {}} />)
    expect(screen.getByText('Zomertip')).toBeInTheDocument()
    expect(screen.getByText('Bestel voor volgende week vrijdag.')).toBeInTheDocument()
  })

  it('calls onClose when Begrepen clicked', () => {
    const onClose = vi.fn()
    render(<AnnouncementModal announcement={announcement} onClose={onClose} />)
    fireEvent.click(screen.getByText('Begrepen'))
    expect(onClose).toHaveBeenCalled()
  })

  it('calls onClose when close button clicked', () => {
    const onClose = vi.fn()
    render(<AnnouncementModal announcement={announcement} onClose={onClose} />)
    fireEvent.click(screen.getByLabelText('Sluiten'))
    expect(onClose).toHaveBeenCalled()
  })

  it('renders nothing when announcement is null', () => {
    render(<AnnouncementModal announcement={null} onClose={() => {}} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})

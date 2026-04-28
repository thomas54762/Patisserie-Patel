import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { getAvailableDeliveryDates, formatDate, formatDateISO } from '../utils/deliveryDates'

describe('getAvailableDeliveryDates', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns tomorrow as first date when ordering before cutoff', () => {
    vi.setSystemTime(new Date('2024-04-15T10:00:00'))
    const dates = getAvailableDeliveryDates(15, 7)
    expect(formatDateISO(dates[0])).toBe('2024-04-16')
  })

  it('returns day after tomorrow when ordering after cutoff', () => {
    vi.setSystemTime(new Date('2024-04-15T16:00:00'))
    const dates = getAvailableDeliveryDates(15, 7)
    expect(formatDateISO(dates[0])).toBe('2024-04-17')
  })

  it('returns correct number of days', () => {
    vi.setSystemTime(new Date('2024-04-15T10:00:00'))
    const dates = getAvailableDeliveryDates(15, 7)
    expect(dates).toHaveLength(7)
  })

  it('returns day after tomorrow when cutoff is 24h and ordering any time', () => {
    vi.setSystemTime(new Date('2024-04-15T08:00:00'))
    const dates = getAvailableDeliveryDates(24, 5)
    expect(formatDateISO(dates[0])).toBe('2024-04-17')
  })
})

describe('formatDateISO', () => {
  it('formats date as YYYY-MM-DD', () => {
    const d = new Date('2024-04-15')
    expect(formatDateISO(d)).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
})

describe('formatDate', () => {
  it('formats date in Dutch', () => {
    const d = new Date('2024-04-15T12:00:00')
    const result = formatDate(d)
    expect(result).toContain('15')
    expect(result).toContain('april')
  })
})

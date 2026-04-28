import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ZohoCreatorService } from '../services/zohoCreator'

const mockFetch = vi.fn()

beforeEach(() => { globalThis.fetch = mockFetch })
afterEach(() => { vi.resetAllMocks() })

function mockResponse(data, ok = true, status = 200) {
  mockFetch.mockResolvedValueOnce({
    ok,
    status,
    json: async () => data,
    text: async () => JSON.stringify(data),
  })
}

describe('ZohoCreatorService.getOrganisation', () => {
  it('returns the record when found', async () => {
    mockResponse({ data: { ID: '42', naam: 'Restaurant X', Cutoff_tijd_in_uren: '24' } })
    const result = await ZohoCreatorService.getOrganisation('42')
    expect(result.ID).toBe('42')
  })

  it('returns null when data is missing', async () => {
    mockResponse({ data: null })
    const result = await ZohoCreatorService.getOrganisation('99')
    expect(result).toBeNull()
  })

  it('throws on API error', async () => {
    mockResponse({ error: 'not found' }, false, 404)
    await expect(ZohoCreatorService.getOrganisation('x')).rejects.toThrow()
  })
})

describe('ZohoCreatorService.getProductGroups', () => {
  const organisation = {
    Product_Groep: [{ ID: 'group-1', display_value: 'Groep A' }],
  }

  it('fetches groups then products and returns product records', async () => {
    // First fetch: product groups
    mockResponse({
      data: [{ ID: 'group-1', Naam: 'Groep A', Producten: [{ ID: 'prod-1', display_value: 'Taartje' }] }],
    })
    // Second fetch: full product records
    mockResponse({
      data: [{ ID: 'prod-1', Naam: 'Taartje', Qty_per_doos: '6', Omschrijving: 'Lekker' }],
    })

    const result = await ZohoCreatorService.getProductGroups(organisation)
    expect(result).toHaveLength(1)
    expect(result[0].Naam).toBe('Taartje')
    expect(result[0].Qty_per_doos).toBe('6')
  })

  it('returns empty array when organisation has no product groups', async () => {
    const result = await ZohoCreatorService.getProductGroups({ Product_Groep: [] })
    expect(result).toEqual([])
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('returns empty array when product groups have no products', async () => {
    mockResponse({ data: [{ ID: 'group-1', Naam: 'Groep A', Producten: [] }] })
    const result = await ZohoCreatorService.getProductGroups(organisation)
    expect(result).toEqual([])
  })
})

describe('ZohoCreatorService.getAnnouncements', () => {
  it('returns announcements within the active date range', async () => {
    mockResponse({
      data: [
        { ID: '1', Naam: 'Actief', Start_datum_tijd: '01-Jan-2020 00:00:00', Eind_datum_tijd: '01-Jan-2099 00:00:00' },
        { ID: '2', Naam: 'Verlopen', Start_datum_tijd: '01-Jan-2020 00:00:00', Eind_datum_tijd: '01-Jan-2021 00:00:00' },
        { ID: '3', Naam: 'Toekomst', Start_datum_tijd: '01-Jan-2099 00:00:00', Eind_datum_tijd: '01-Jan-2100 00:00:00' },
      ],
    })
    const result = await ZohoCreatorService.getAnnouncements('42')
    expect(result).toHaveLength(1)
    expect(result[0].Naam).toBe('Actief')
  })
})

describe('ZohoCreatorService.createOrder', () => {
  it('posts order and returns response', async () => {
    mockResponse({ data: { ID: 'order-1' } })
    const result = await ZohoCreatorService.createOrder({
      organisatieId: '42',
      producten: [{ ID: '1', quantity: 2 }],
      orderDate: '2024-04-15T10:00:00Z',
      deliveryDate: '2024-04-16',
    })
    expect(result.data.ID).toBe('order-1')
    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ method: 'POST' })
    )
  })
})

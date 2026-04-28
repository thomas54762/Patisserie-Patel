import { parseZohoDate, formatZohoDate } from '../utils/zohoDate'

const BASE_URL = '/api/zoho'

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Zoho API ${res.status}: ${text}`)
  }

  return res.json()
}


export const ZohoCreatorService = {
  async getOrganisation(organisatieId) {
    // Direct record lookup by ID — more reliable than criteria on the ID field
    const data = await request(`/report/Organisaties_Report/${organisatieId}`)
    return data.data ?? null
  },

  async getProductGroups(organisation) {
    const groepen = organisation?.Product_Groep
    if (!groepen || groepen.length === 0) return []

    const groupIds = groepen.map((g) => (typeof g === 'object' ? g.ID : g)).filter(Boolean)
    if (groupIds.length === 0) return []

    // Step 1: fetch product groups to get their linked product IDs
    // ID is a NUMBER field in Zoho Creator — no quotes around the value
    const groupExpr = groupIds.map((id) => `ID==${id}`).join(' || ')
    const groupData = await request(
      `/report/Product_Groep_Report?criteria=${encodeURIComponent('(' + groupExpr + ')')}`
    )
    const groups = groupData.data ?? []

    // Step 2: collect all product IDs from the Producten field of each group
    const productIds = groups
      .flatMap((g) => g.Producten ?? [])
      .map((p) => (typeof p === 'object' ? p.ID : p))
      .filter(Boolean)

    if (productIds.length === 0) return []

    // Step 3: fetch full product records from Producten_Report
    const productExpr = productIds.map((id) => `ID==${id}`).join(' || ')
    const productData = await request(
      `/report/Producten_Report?criteria=${encodeURIComponent('(' + productExpr + ')')}`
    )
    return productData.data ?? []
  },

  async getAnnouncements(organisatieId) {
    const expr = encodeURIComponent(`(Organisaties in ${organisatieId})`)
    const data = await request(`/report/Aankondigingen_Report?criteria=${expr}`)
    const now = Date.now()
    return (data.data ?? []).filter((a) => {
      const start = parseZohoDate(a.Start_datum_tijd)
      const end = parseZohoDate(a.Eind_datum_tijd)
      return start && end && now >= start && now <= end
    })
  },

  async createOrder({ organisatieId, producten, orderDate }) {
    const productenIds = producten.map((p) => p.ID)

    const data = await request('/form/Bestellingen', {
      method: 'POST',
      body: JSON.stringify({
        data: {
          Order_date: formatZohoDate(new Date(orderDate)),
          Organisatie: organisatieId,
          Producten: productenIds,
          Status: 'Open',
        },
      }),
    })
    return data
  },
}

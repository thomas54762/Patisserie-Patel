import { useState, useEffect } from 'react'
import { ZohoCreatorService } from '../services/zohoCreator'

export function useProducts(organisation) {
  const [products, setProducts] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!organisation) return

    let cancelled = false

    ZohoCreatorService.getProductGroups(organisation)
      .then((data) => { if (!cancelled) setProducts(data) })
      .catch((err) => { if (!cancelled) setError(err) })

    return () => { cancelled = true }
  }, [organisation])

  const loading = !!organisation && products === null && !error

  return { products: products ?? [], loading, error }
}

import { useState, useEffect } from 'react'
import { ZohoCreatorService } from '../services/zohoCreator'

export function useOrganisation(organisatieId) {
  const [organisation, setOrganisation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!organisatieId) {
      setError(new Error('Geen organisatie gevonden'))
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    ZohoCreatorService.getOrganisation(organisatieId)
      .then((data) => {
        if (!cancelled) {
          if (!data) setError(new Error('Organisatie niet gevonden'))
          else setOrganisation(data)
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [organisatieId])

  return { organisation, loading, error }
}

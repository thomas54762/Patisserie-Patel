import { useState, useEffect } from 'react'
import { ZohoCreatorService } from '../services/zohoCreator'
import { parseZohoDate } from '../utils/zohoDate'

export function useAnnouncements(organisatieId) {
  const [announcements, setAnnouncements] = useState(null)

  useEffect(() => {
    if (!organisatieId) return

    let cancelled = false

    ZohoCreatorService.getAnnouncements(organisatieId)
      .then((data) => {
        if (!cancelled) {
          const sorted = [...data].sort(
            (a, b) => (parseZohoDate(a.Start_datum_tijd) ?? 0) - (parseZohoDate(b.Start_datum_tijd) ?? 0)
          )
          setAnnouncements(sorted)
        }
      })
      .catch(() => { if (!cancelled) setAnnouncements([]) })

    return () => { cancelled = true }
  }, [organisatieId])

  const loading = !!organisatieId && announcements === null
  const oldest = (announcements ?? [])[0] ?? null
  return { announcement: oldest, loading }
}

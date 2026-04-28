const DAYS_NL = ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag']
const MONTHS_NL = [
  'januari', 'februari', 'maart', 'april', 'mei', 'juni',
  'juli', 'augustus', 'september', 'oktober', 'november', 'december',
]

export function formatDate(date) {
  return `${DAYS_NL[date.getDay()]} ${date.getDate()} ${MONTHS_NL[date.getMonth()]}`
}

export function formatDateISO(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/**
 * Returns available delivery dates based on the cutoff time.
 * cutoffHours: the hour of day (0-23) after which orders for next-day delivery are closed.
 * When cutoffHours >= 24, a minimum lead time of 2 days is always required.
 */
export function getAvailableDeliveryDates(cutoffHours = 24, daysAhead = 14) {
  const now = new Date()

  let daysOffset
  if (cutoffHours >= 24) {
    daysOffset = 2
  } else {
    daysOffset = now.getHours() < cutoffHours ? 1 : 2
  }

  const dates = []
  for (let i = daysOffset; i < daysOffset + daysAhead; i++) {
    const date = new Date(now)
    date.setDate(now.getDate() + i)
    date.setHours(0, 0, 0, 0)
    dates.push(date)
  }
  return dates
}

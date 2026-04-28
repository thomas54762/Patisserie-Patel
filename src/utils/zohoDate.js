const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export function parseZohoDate(str) {
  if (!str) return null
  const [datePart, timePart] = str.split(' ')
  const [d, mon, y] = datePart.split('-')
  const idx = MONTHS.indexOf(mon)
  if (idx === -1) return null
  const [hh, mm, ss] = (timePart ?? '00:00:00').split(':')
  return new Date(Number(y), idx, Number(d), Number(hh), Number(mm), Number(ss)).getTime()
}

export function formatZohoDate(date) {
  const d = String(date.getDate()).padStart(2, '0')
  const m = MONTHS[date.getMonth()]
  const y = date.getFullYear()
  const hh = String(date.getHours()).padStart(2, '0')
  const mm = String(date.getMinutes()).padStart(2, '0')
  const ss = String(date.getSeconds()).padStart(2, '0')
  return `${d}-${m}-${y} ${hh}:${mm}:${ss}`
}

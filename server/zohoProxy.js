export function createZohoProxy({ tokenManager, apiBaseUrl, ownerName, appName }) {
  return async function zohoProxy(req, res) {
    try {
      const token = await tokenManager.getAccessToken()

      const zohoPath = req.path
      const query = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : ''
      const url = `${apiBaseUrl}/${ownerName}/${appName}${zohoPath}${query}`

      const zohoRes = await fetch(url, {
        method: req.method,
        headers: {
          Authorization: `Zoho-oauthtoken ${token}`,
          'Content-Type': 'application/json',
        },
        body: req.method !== 'GET' && req.method !== 'HEAD'
          ? JSON.stringify(req.body)
          : undefined,
      })

      const data = await zohoRes.json()
      res.status(zohoRes.status).json(data)
    } catch (err) {
      console.error('[zoho-proxy]', err.message)
      res.status(502).json({ error: 'Zoho API unavailable', detail: err.message })
    }
  }
}

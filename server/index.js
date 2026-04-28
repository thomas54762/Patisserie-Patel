import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { ZohoTokenManager } from './zohoTokenManager.js'
import { createZohoProxy } from './zohoProxy.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app = express()
app.use(express.json())

const tokenManager = new ZohoTokenManager({
  clientId: process.env.ZOHO_CLIENT_ID,
  clientSecret: process.env.ZOHO_CLIENT_SECRET,
  refreshToken: process.env.ZOHO_REFRESH_TOKEN,
  tokenUrl: process.env.ZOHO_TOKEN_URL || 'https://accounts.zoho.eu/oauth/v2/token',
})

app.use(
  '/api/zoho',
  createZohoProxy({
    tokenManager,
    apiBaseUrl: process.env.ZOHO_API_BASE_URL || 'https://creator.zoho.eu/api/v2',
    ownerName: process.env.ZOHO_OWNER_NAME,
    appName: process.env.ZOHO_APP_NAME,
  })
)

if (process.env.NODE_ENV === 'production') {
  const distPath = path.resolve(__dirname, '..', 'dist')
  app.use(express.static(distPath))
  app.get('/{*path}', (_req, res) => res.sendFile(path.join(distPath, 'index.html')))
}

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`)
})

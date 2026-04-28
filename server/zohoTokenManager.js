import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const TOKEN_FILE = join(dirname(fileURLToPath(import.meta.url)), '.zoho-token.json')

export class ZohoTokenManager {
  #clientId
  #clientSecret
  #refreshToken
  #tokenUrl
  #cachedToken = null
  #expiresAt = 0

  constructor({ clientId, clientSecret, refreshToken, tokenUrl }) {
    if (!clientId || !clientSecret || !refreshToken) {
      throw new Error('ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET and ZOHO_REFRESH_TOKEN are required')
    }
    this.#clientId = clientId
    this.#clientSecret = clientSecret
    this.#refreshToken = refreshToken
    this.#tokenUrl = tokenUrl
    this.#loadFromDisk()
  }

  async getAccessToken() {
    if (this.#cachedToken && Date.now() < this.#expiresAt) {
      return this.#cachedToken
    }
    return this.#refresh()
  }

  #loadFromDisk() {
    try {
      const { token, expiresAt } = JSON.parse(readFileSync(TOKEN_FILE, 'utf8'))
      if (token && expiresAt && Date.now() < expiresAt) {
        this.#cachedToken = token
        this.#expiresAt = expiresAt
      }
    } catch {
      // no token on disk yet — will fetch on first request
    }
  }

  #saveToDisk() {
    try {
      writeFileSync(TOKEN_FILE, JSON.stringify({ token: this.#cachedToken, expiresAt: this.#expiresAt }))
    } catch {
      // non-fatal — in-memory cache still works
    }
  }

  async #refresh() {
    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: this.#refreshToken,
      client_id: this.#clientId,
      client_secret: this.#clientSecret,
    })

    const res = await fetch(`${this.#tokenUrl}?${params}`, { method: 'POST' })
    const data = await res.json()

    if (!data.access_token) {
      throw new Error(`Zoho token refresh failed: ${data.error || JSON.stringify(data)}`)
    }

    this.#cachedToken = data.access_token
    // Expire 60 s early to avoid clock-skew issues
    this.#expiresAt = Date.now() + (data.expires_in - 60) * 1000
    this.#saveToDisk()
    return this.#cachedToken
  }
}

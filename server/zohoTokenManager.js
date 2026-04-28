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
  }

  async getAccessToken() {
    if (this.#cachedToken && Date.now() < this.#expiresAt) {
      return this.#cachedToken
    }
    return this.#refresh()
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
    // Expire 60 s before actual expiry to avoid clock skew issues
    this.#expiresAt = Date.now() + (data.expires_in - 60) * 1000
    return this.#cachedToken
  }
}

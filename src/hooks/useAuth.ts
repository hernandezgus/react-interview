import { useState } from 'react'
import { TOKEN_STORAGE_KEY } from '../api/client'

export function useAuth() {
  const [token, setToken] = useState<string | null>(() =>
    window.localStorage.getItem(TOKEN_STORAGE_KEY),
  )

  function updateToken(nextToken: string) {
    window.localStorage.setItem(TOKEN_STORAGE_KEY, nextToken)
    setToken(nextToken)
  }

  function clearToken() {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY)
    setToken(null)
  }

  return {
    clearToken,
    isAuthenticated: Boolean(token),
    token,
    updateToken,
  }
}

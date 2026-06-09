import { type ReactNode, useState } from 'react'
import { AuthContext } from './auth-context'

const AUTH_STORAGE_KEY = 'react-interview.jwt'

type AuthProviderProps = {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setTokenState] = useState<string | null>(() => {
    if (typeof window === 'undefined') {
      return null
    }

    return window.localStorage.getItem(AUTH_STORAGE_KEY)
  })

  function setToken(nextToken: string) {
    if (!nextToken) {
      clearToken()
      return
    }

    window.localStorage.setItem(AUTH_STORAGE_KEY, nextToken)
    setTokenState(nextToken)
  }

  function clearToken() {
    window.localStorage.removeItem(AUTH_STORAGE_KEY)
    setTokenState(null)
  }

  return (
    <AuthContext.Provider value={{ clearToken, setToken, token }}>
      {children}
    </AuthContext.Provider>
  )
}

import { createContext } from 'react'

export type AuthContextValue = {
  clearToken: () => void
  setToken: (token: string) => void
  token: string | null
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)

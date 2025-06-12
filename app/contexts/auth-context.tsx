import React, { createContext, useContext, useEffect, useState } from 'react'
import { getCurrentUser, login, logout } from '@/services/auth.service'
import type { User, LoginRequest } from '@/services/auth.service'

type AuthContextType = {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginRequest) => Promise<User>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    // Cek apakah user sudah login saat aplikasi dimuat
    const user = getCurrentUser()
    setUser(user)
    setIsLoading(false)
  }, [])

  const handleLogin = async (credentials: LoginRequest): Promise<User> => {
    const user = await login(credentials)
    setUser(user)
    return user
  }

  const handleLogout = () => {
    logout()
    setUser(null)
  }

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login: handleLogin,
    logout: handleLogout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

import React, { createContext, useContext, useState } from "react"
import type { ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "manager" | "employee"
  permissions: string[]
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  hasPermission: (permission: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>({
    id: "1",
    name: "John Doe",
    email: "john.doe@company.com",
    role: "admin",
    permissions: ["read", "write", "approve", "delete"],
  })

  const isAuthenticated = !!user

  const login = async (email: string, _password: string) => {
    // Mock login - in real app this would call an API
    setUser({
      id: "1",
      name: "John Doe",
      email,
      role: "admin",
      permissions: ["read", "write", "approve", "delete"],
    })
  }

  const logout = () => {
    setUser(null)
  }

  const hasPermission = (permission: string) => {
    return user?.permissions.includes(permission) || false
  }

  const value: AuthContextType = {
    user,
    isAuthenticated,
    login,
    logout,
    hasPermission,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

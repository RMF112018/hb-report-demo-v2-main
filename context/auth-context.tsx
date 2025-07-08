"use client"

import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@/types"

export type DemoRole = "executive" | "project-executive" | "project-manager" | "estimator" | "admin"
export type DemoUser = User

interface AuthContextType {
  user: DemoUser | null
  login: (email: string, password: string) => Promise<{ redirectTo: string }>
  logout: () => void
  isLoading: boolean
  isClient: boolean
}

const demoUsers: DemoUser[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@hedrickbrothers.com",
    role: "executive",
    company: "Hedrick Brothers",
    createdAt: new Date().toISOString(),
    isActive: true,
    avatar: "/avatars/john-smith.png",
    permissions: { preConAccess: true },
  },
  {
    id: "2",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@hedrickbrothers.com",
    role: "project-executive",
    company: "Hedrick Brothers",
    createdAt: new Date().toISOString(),
    isActive: true,
    avatar: "/avatars/sarah-johnson.png",
    permissions: { preConAccess: true },
  },
  {
    id: "3",
    firstName: "Mike",
    lastName: "Davis",
    email: "mike.davis@hedrickbrothers.com",
    role: "project-manager",
    company: "Hedrick Brothers",
    createdAt: new Date().toISOString(),
    isActive: true,
    avatar: "/avatars/mike-davis.png",
    permissions: { preConAccess: false },
  },
  {
    id: "4",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@hedrickbrothers.com",
    role: "estimator",
    company: "Hedrick Brothers",
    createdAt: new Date().toISOString(),
    isActive: true,
    avatar: "/avatars/john-doe.png",
    permissions: { preConAccess: true },
  },
  {
    id: "5",
    firstName: "Markey",
    lastName: "Mark",
    email: "markey.mark@hedrickbrothers.com",
    role: "admin",
    company: "Hedrick Brothers",
    createdAt: new Date().toISOString(),
    isActive: true,
    avatar: "/avatars/markey-mark.png",
    permissions: { preConAccess: true },
  },
]

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<DemoUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)

  // Handle client-side hydration
  useEffect(() => {
    setIsClient(true)

    // Only access localStorage after client-side hydration
    if (typeof window !== "undefined") {
      try {
        // Check if we want to disable auto-login (for testing)
        const disableAutoLogin = localStorage.getItem("hb-disable-auto-login") === "true"

        if (!disableAutoLogin) {
          const stored = localStorage.getItem("hb-demo-user")
          if (stored) {
            const parsedUser = JSON.parse(stored)
            setUser(parsedUser)
          }
        }
      } catch (error) {
        console.error("Error reading from localStorage:", error)
        // Clear potentially corrupted data
        localStorage.removeItem("hb-demo-user")
      }
    }

    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<{ redirectTo: string }> => {
    const match = demoUsers.find((u) => u.email === email)
    if (!match || password !== "demo123") {
      throw new Error("Invalid credentials")
    }

    // All users now redirect to the main application page
    // which will show role-appropriate dashboard content
    const redirectTo = "/main-app"

    // Only use localStorage if we're on the client
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("hb-demo-user", JSON.stringify(match))
      } catch (error) {
        console.error("Error saving to localStorage:", error)
      }
    }

    setUser(match)
    return { redirectTo }
  }

  const logout = () => {
    if (typeof window !== "undefined") {
      try {
        // Clear all user-specific localStorage data
        const keysToRemove = [
          "hb-demo-user", // User authentication data
          "selectedProject", // Selected project
          "hb-forecast-data", // Financial forecast data
          "hb-forecast-acknowledgments", // Forecast acknowledgments
          "hb-forecast-previous-methods", // Previous forecast methods
          "hb-tours-completed", // Completed tours
          "hb-tour-available", // Tour availability setting
          "staffing-needing-filter", // Staffing filter preference
        ]

        // Remove predefined keys
        keysToRemove.forEach((key) => {
          localStorage.removeItem(key)
        })

        // Clear all tour-related data, report configuration data, and responsibility matrix data
        const allKeys = Object.keys(localStorage)
        allKeys.forEach((key) => {
          if (
            key.startsWith("report-config-") ||
            key.startsWith("hb-tour-shown-") ||
            key.startsWith("hb-welcome-") ||
            key.startsWith("responsibility-matrix-")
          ) {
            localStorage.removeItem(key)
          }
        })

        console.log("Cleared all user-specific localStorage data on logout")
      } catch (error) {
        console.error("Error clearing localStorage on logout:", error)
      }
    }
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading, isClient }}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
  return ctx
}

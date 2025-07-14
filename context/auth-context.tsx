"use client"

import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@/types"

export type DemoRole = "executive" | "project-executive" | "project-manager" | "estimator" | "admin" | "presentation"
export type DemoUser = User

interface AuthContextType {
  user: DemoUser | null
  login: (email: string, password: string) => Promise<{ redirectTo: string }>
  logout: () => void
  isLoading: boolean
  isClient: boolean
  // New role switching functionality
  viewingAs: DemoRole | null
  switchRole: (role: DemoRole) => void
  returnToPresentation: () => void
  isPresentationMode: boolean
  // Market Intelligence feature flags
  hasMarketIntelPreload: boolean
  hasAutoInsightsMode: boolean
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
  {
    id: "6",
    firstName: "Demo",
    lastName: "Presenter",
    email: "demo.presenter@hedrickbrothers.com",
    role: "presentation",
    company: "Hedrick Brothers",
    createdAt: new Date().toISOString(),
    isActive: true,
    avatar: "/avatars/demo-presenter.png",
    permissions: { preConAccess: true },
  },
]

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<DemoUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)
  const [viewingAs, setViewingAs] = useState<DemoRole | null>(null)

  // Helper to get the effective user role for display and permissions
  const getEffectiveRole = (): DemoRole => {
    if (user?.role === "presentation" && viewingAs) {
      return viewingAs
    }
    return (user?.role as DemoRole) || "executive"
  }

  // Helper to get the effective user data for display
  const getEffectiveUser = (): DemoUser | null => {
    if (!user) return null

    if (user.role === "presentation" && viewingAs) {
      // Find the demo user data for the role being viewed
      const viewingUser = demoUsers.find((u) => u.role === viewingAs)
      if (viewingUser) {
        return {
          ...viewingUser,
          // Keep the presentation user's ID but use the viewed role's data
          id: user.id,
        }
      }
    }

    return user
  }

  // Handle client-side hydration
  useEffect(() => {
    setIsClient(true)

    // Only access localStorage after client-side hydration
    if (typeof window !== "undefined") {
      try {
        // Track if authentication data gets cleared
        let authDataCleared = false

        // ENHANCED AUTO-CLEAR SYSTEM FOR DEVELOPMENT
        if (process.env.NODE_ENV === "development") {
          // Check if auto-clear is disabled (for persistent development testing)
          const autoCleanDisabled = localStorage.getItem("hb-disable-auto-clean") === "true"

          // Multiple detection methods for fresh development sessions
          const hasActiveSession = sessionStorage.getItem("hb-dev-session-active")
          const lastServerStart = localStorage.getItem("hb-last-server-start")
          const currentTime = Date.now()
          const serverRestartThreshold = 5 * 60 * 1000 // 5 minutes

          // Check if this appears to be a fresh server session
          const isLikelyFreshSession =
            !hasActiveSession || (lastServerStart && currentTime - parseInt(lastServerStart) > serverRestartThreshold)

          console.log("🔍 Development session analysis:", {
            hasActiveSession: !!hasActiveSession,
            lastServerStart: lastServerStart ? new Date(parseInt(lastServerStart)).toLocaleTimeString() : "never",
            timeSinceLastStart: lastServerStart
              ? `${Math.round((currentTime - parseInt(lastServerStart)) / 1000)}s`
              : "n/a",
            isLikelyFreshSession,
            autoCleanDisabled,
            userInStorage: !!localStorage.getItem("hb-demo-user"),
          })

          if (isLikelyFreshSession && !autoCleanDisabled) {
            console.log("🔄 Fresh development session detected - clearing all authentication data")
            authDataCleared = true

            // Clear all HB Report related localStorage data
            const keysToRemove = [
              "hb-demo-user", // User authentication data
              "hb-viewing-as", // Presentation viewing role
              "selectedProject", // Selected project
              "hb-forecast-data", // Financial forecast data
              "hb-forecast-acknowledgments", // Forecast acknowledgments
              "hb-forecast-previous-methods", // Previous forecast methods
              "hb-tours-completed", // Completed tours
              "hb-tour-available", // Tour availability setting
              "staffing-needing-filter", // Staffing filter preference
              "hb-disable-auto-login", // Auto-login disable flag
              "hb-last-server-start", // Last server start time
              // Note: hb-disable-auto-clean is preserved to maintain developer preferences
            ]

            // Remove predefined keys
            keysToRemove.forEach((key) => {
              if (localStorage.getItem(key)) {
                localStorage.removeItem(key)
                console.log(`   ✓ Cleared ${key}`)
              }
            })

            // Clear all tour-related data, report configuration data, and responsibility matrix data
            const allKeys = Object.keys(localStorage)
            let additionalCleared = 0
            allKeys.forEach((key) => {
              if (
                key.startsWith("report-config-") ||
                key.startsWith("hb-tour-shown-") ||
                key.startsWith("hb-welcome-") ||
                key.startsWith("responsibility-matrix-") ||
                key.startsWith("productivity-data-") ||
                key.startsWith("startup-checklist-") ||
                key.startsWith("preco-checklist-") ||
                key.startsWith("financial-hub-storage") ||
                key.startsWith("pursuits")
              ) {
                localStorage.removeItem(key)
                additionalCleared++
              }
            })

            // Mark this session as active and record server start time
            sessionStorage.setItem("hb-dev-session-active", "true")
            localStorage.setItem("hb-last-server-start", currentTime.toString())

            console.log(`✅ Authentication data cleared - starting fresh development session`)
            console.log(`   📊 Cleared ${keysToRemove.length} auth keys + ${additionalCleared} additional keys`)
            console.log(`   💡 To disable auto-clear: localStorage.setItem('hb-disable-auto-clean', 'true')`)
            console.log(`   🔓 App will now show login screen`)

            // Ensure user state is null when auth data is cleared
            setUser(null)
            setViewingAs(null)
          } else if (autoCleanDisabled) {
            console.log("🔒 Auto-clean disabled - preserving localStorage across dev sessions")
            // Still mark session as active and update server start time
            sessionStorage.setItem("hb-dev-session-active", "true")
            localStorage.setItem("hb-last-server-start", currentTime.toString())
          } else {
            console.log("🔄 Continuing existing development session")
            // Update server start time for existing session
            localStorage.setItem("hb-last-server-start", currentTime.toString())
          }
        }

        // AUTHENTICATION RESTORATION (only if auth data was NOT cleared)
        if (!authDataCleared) {
          // Check if we want to disable auto-login (for testing or production)
          const disableAutoLogin = localStorage.getItem("hb-disable-auto-login") === "true"

          // Always disable auto-login in production builds
          const isProductionBuild = process.env.NODE_ENV === "production" || process.env.VERCEL === "1"

          if (isProductionBuild) {
            console.log("🚀 Production build detected - auto-login disabled, showing login screen")
          }

          if (!disableAutoLogin && !isProductionBuild) {
            const stored = localStorage.getItem("hb-demo-user")
            const storedViewingAs = localStorage.getItem("hb-viewing-as")

            if (stored) {
              try {
                const parsedUser = JSON.parse(stored)
                console.log("🔐 Restoring authenticated user:", parsedUser.email, `(${parsedUser.role})`)
                setUser(parsedUser)

                // Restore viewing role for presentation users
                if (parsedUser.role === "presentation" && storedViewingAs) {
                  setViewingAs(storedViewingAs as DemoRole)
                  console.log("👁️ Restored presentation viewing role:", storedViewingAs)
                }
              } catch (parseError) {
                console.error("❌ Failed to parse stored user data:", parseError)
                // Clear corrupted data
                localStorage.removeItem("hb-demo-user")
                localStorage.removeItem("hb-viewing-as")
                setUser(null)
                setViewingAs(null)
              }
            } else {
              console.log("🔓 No stored user data found - will show login screen")
            }
          } else {
            console.log("🚫 Auto-login disabled - will show login screen")
          }
        } else {
          console.log("🔓 Auth data was cleared - ensuring clean state for login screen")
        }
      } catch (error) {
        console.error("❌ Error during authentication initialization:", error)
        // Clear potentially corrupted data
        localStorage.removeItem("hb-demo-user")
        localStorage.removeItem("hb-viewing-as")
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

        // For presentation users, default to viewing as executive
        if (match.role === "presentation") {
          setViewingAs("executive")
          localStorage.setItem("hb-viewing-as", "executive")
        } else {
          // Clear any existing viewing role for non-presentation users
          setViewingAs(null)
          localStorage.removeItem("hb-viewing-as")
        }

        // Mark session as active in development mode
        if (process.env.NODE_ENV === "development") {
          sessionStorage.setItem("hb-dev-session-active", "true")
          localStorage.setItem("hb-last-server-start", Date.now().toString())
        }

        console.log("✅ User logged in successfully:", match.email, `(${match.role})`)
      } catch (error) {
        console.error("Error saving to localStorage:", error)
      }
    }

    setUser(match)
    return { redirectTo }
  }

  const switchRole = (role: DemoRole) => {
    if (user?.role !== "presentation") {
      console.warn("Role switching is only available for presentation users")
      return
    }

    setViewingAs(role)

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("hb-viewing-as", role)
      } catch (error) {
        console.error("Error saving viewing role to localStorage:", error)
      }
    }
  }

  const returnToPresentation = () => {
    if (user?.role !== "presentation") {
      console.warn("Return to presentation is only available for presentation users")
      return
    }

    setViewingAs(null)

    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("hb-viewing-as")
      } catch (error) {
        console.error("Error removing viewing role from localStorage:", error)
      }
    }
  }

  const logout = () => {
    if (typeof window !== "undefined") {
      try {
        // Clear all user-specific localStorage data
        const keysToRemove = [
          "hb-demo-user", // User authentication data
          "hb-viewing-as", // Presentation viewing role
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
            key.startsWith("responsibility-matrix-") ||
            key.startsWith("productivity-data-") ||
            key.startsWith("startup-checklist-") ||
            key.startsWith("preco-checklist-") ||
            key.startsWith("financial-hub-storage") ||
            key.startsWith("pursuits")
          ) {
            localStorage.removeItem(key)
          }
        })

        // Clear session tracking data
        sessionStorage.removeItem("hb-dev-session-active")

        console.log("🔓 User logged out - cleared all user-specific data")
      } catch (error) {
        console.error("❌ Error clearing localStorage on logout:", error)
      }
    }
    setUser(null)
    setViewingAs(null)
  }

  // Get the current effective user data (either the actual user or the viewed role user)
  const effectiveUser = getEffectiveUser()
  const isPresentationMode = user?.role === "presentation"

  // Market Intelligence feature flags for demo users
  const hasMarketIntelPreload = Boolean(
    effectiveUser?.role &&
      ["executive", "project-executive", "project-manager", "estimator"].includes(effectiveUser.role)
  )
  const hasAutoInsightsMode = Boolean(
    effectiveUser?.role &&
      ["executive", "project-executive", "project-manager", "estimator"].includes(effectiveUser.role)
  )

  return (
    <AuthContext.Provider
      value={{
        user: effectiveUser,
        login,
        logout,
        isLoading,
        isClient,
        viewingAs,
        switchRole,
        returnToPresentation,
        isPresentationMode,
        hasMarketIntelPreload,
        hasAutoInsightsMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
  return ctx
}

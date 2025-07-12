/**
 * Authentication Cache Utilities
 *
 * Utility functions for managing and clearing cached authentication data
 * and user preferences in the HB Report Demo application.
 */

export interface ClearCacheResult {
  success: boolean
  clearedCount: number
  additionalCleared: number
  error?: string
}

/**
 * Comprehensive function to clear all authentication cache data
 *
 * This function removes all stored user data, preferences, and session
 * information from localStorage, sessionStorage, and cookies.
 *
 * @returns Promise<ClearCacheResult> Result of the clearing operation
 */
export async function clearAllAuthCache(): Promise<ClearCacheResult> {
  try {
    console.log("🧹 Clearing all HB Report authentication cache...")

    // Clear all localStorage data
    const localStorageKeys = [
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
      "hb-disable-auto-clean", // Auto-clean disable flag
    ]

    // Remove predefined keys
    let clearedCount = 0
    localStorageKeys.forEach((key) => {
      if (typeof window !== "undefined" && localStorage.getItem(key)) {
        localStorage.removeItem(key)
        console.log("✓ Cleared:", key)
        clearedCount++
      }
    })

    // Clear all keys with specific prefixes
    let additionalCleared = 0
    if (typeof window !== "undefined") {
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
          additionalCleared++
        }
      })

      // Clear all sessionStorage data
      sessionStorage.clear()
      console.log("✓ Cleared all sessionStorage data")

      // Clear cookies (if any)
      document.cookie.split(";").forEach(function (c) {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/")
      })
      console.log("✓ Cleared all cookies")
    }

    console.log("✅ Cache clearing complete!")
    console.log(`📊 Cleared ${clearedCount} auth keys + ${additionalCleared} additional keys`)

    return {
      success: true,
      clearedCount,
      additionalCleared,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    console.error("❌ Error clearing authentication cache:", error)

    return {
      success: false,
      clearedCount: 0,
      additionalCleared: 0,
      error: errorMessage,
    }
  }
}

/**
 * Clear only authentication-specific data (preserves user preferences)
 *
 * This function removes only the core authentication data but preserves
 * user preferences like tour settings, dashboard layouts, etc.
 */
export async function clearAuthDataOnly(): Promise<ClearCacheResult> {
  try {
    console.log("🔐 Clearing authentication data only...")

    const authOnlyKeys = ["hb-demo-user", "hb-viewing-as", "hb-disable-auto-login"]

    let clearedCount = 0
    authOnlyKeys.forEach((key) => {
      if (typeof window !== "undefined" && localStorage.getItem(key)) {
        localStorage.removeItem(key)
        console.log("✓ Cleared:", key)
        clearedCount++
      }
    })

    // Clear session data
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("hb-dev-session-active")
    }

    console.log("✅ Authentication data cleared (preferences preserved)")

    return {
      success: true,
      clearedCount,
      additionalCleared: 0,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    console.error("❌ Error clearing authentication data:", error)

    return {
      success: false,
      clearedCount: 0,
      additionalCleared: 0,
      error: errorMessage,
    }
  }
}

/**
 * Disable auto-login to force login screen display
 *
 * This function sets a flag that prevents automatic login restoration
 * without clearing existing user data.
 */
export function disableAutoLogin(): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("hb-disable-auto-login", "true")
    console.log("🚫 Auto-login disabled - login screen will be shown on next visit")
  }
}

/**
 * Enable auto-login (restore default behavior)
 */
export function enableAutoLogin(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("hb-disable-auto-login")
    console.log("✅ Auto-login enabled - stored credentials will be restored")
  }
}

/**
 * Check if authentication data exists in storage
 */
export function hasStoredAuthData(): boolean {
  if (typeof window === "undefined") return false

  return !!(localStorage.getItem("hb-demo-user") || sessionStorage.getItem("hb-dev-session-active"))
}

/**
 * Get current authentication cache status
 */
export function getAuthCacheStatus() {
  if (typeof window === "undefined") {
    return {
      hasUser: false,
      hasSession: false,
      autoLoginDisabled: false,
      autoCleanDisabled: false,
      storageKeys: 0,
    }
  }

  const allKeys = Object.keys(localStorage)
  const hbKeys = allKeys.filter(
    (key) => key.startsWith("hb-") || key.startsWith("report-") || key.startsWith("responsibility-")
  )

  return {
    hasUser: !!localStorage.getItem("hb-demo-user"),
    hasSession: !!sessionStorage.getItem("hb-dev-session-active"),
    autoLoginDisabled: localStorage.getItem("hb-disable-auto-login") === "true",
    autoCleanDisabled: localStorage.getItem("hb-disable-auto-clean") === "true",
    storageKeys: hbKeys.length,
    keys: hbKeys,
  }
}

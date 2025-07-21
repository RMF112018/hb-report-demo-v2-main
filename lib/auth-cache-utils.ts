import { logger } from "./structured-logger"

/**
 * Clear all HB Report authentication cache data
 * @returns Promise that resolves when cache is cleared
 */
export const clearAllAuthCache = async (): Promise<{ success: boolean; clearedCount: number }> => {
  try {
    logger.info("🧹 Clearing all HB Report authentication cache...")

    // Clear all localStorage data
    const localStorageKeys = [
      "hb-demo-user",
      "hb-viewing-as",
      "selectedProject",
      "hb-forecast-data",
      "hb-forecast-acknowledgments",
      "hb-forecast-previous-methods",
      "hb-tours-completed",
      "hb-tour-available",
      "staffing-needing-filter",
      "hb-disable-auto-login",
      "hb-last-server-start",
      "hb-disable-auto-clean",
    ]

    // Remove predefined keys
    let clearedCount = 0
    localStorageKeys.forEach((key) => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key)
        logger.debug("✓ Cleared:", { key })
        clearedCount++
      }
    })

    // Clear all keys with specific prefixes
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

    // Clear all sessionStorage data
    sessionStorage.clear()
    logger.debug("✓ Cleared all sessionStorage data")

    // Clear cookies (if any)
    document.cookie.split(";").forEach(function (c) {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/")
    })
    logger.debug("✓ Cleared all cookies")

    logger.info("✅ Cache clearing complete!", {
      clearedCount,
      additionalCleared,
      totalCleared: clearedCount + additionalCleared,
    })

    return { success: true, clearedCount: clearedCount + additionalCleared }
  } catch (error) {
    logger.error("Failed to clear authentication cache", { error })
    return { success: false, clearedCount: 0 }
  }
}

/**
 * Clear only authentication data while preserving user preferences
 * @returns Promise that resolves when auth data is cleared
 */
export const clearAuthDataOnly = async (): Promise<{ success: boolean; clearedCount: number }> => {
  try {
    logger.info("🔐 Clearing authentication data only...")

    // Only clear authentication-related keys
    const authKeys = [
      "hb-demo-user",
      "hb-viewing-as",
      "selectedProject",
      "hb-tours-completed",
      "hb-tour-available",
      "hb-disable-auto-login",
      "hb-last-server-start",
    ]

    let clearedCount = 0
    authKeys.forEach((key) => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key)
        logger.debug("✓ Cleared:", { key })
        clearedCount++
      }
    })

    // Clear sessionStorage (contains session data)
    sessionStorage.clear()
    logger.debug("✓ Cleared all sessionStorage data")

    // Clear authentication cookies
    document.cookie.split(";").forEach(function (c) {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/")
    })
    logger.debug("✓ Cleared all cookies")

    logger.info("✅ Authentication data cleared (preferences preserved)", { clearedCount })

    return { success: true, clearedCount }
  } catch (error) {
    logger.error("Failed to clear authentication data", { error })
    return { success: false, clearedCount: 0 }
  }
}

/**
 * Disable auto-login temporarily
 */
export const disableAutoLogin = (): void => {
  try {
    localStorage.setItem("hb-disable-auto-login", "true")
    logger.info("🚫 Auto-login disabled - login screen will be shown on next visit")
  } catch (error) {
    logger.error("Failed to disable auto-login", { error })
  }
}

/**
 * Enable auto-login (remove disable flag)
 */
export const enableAutoLogin = (): void => {
  try {
    localStorage.removeItem("hb-disable-auto-login")
    logger.info("✅ Auto-login enabled - stored credentials will be restored")
  } catch (error) {
    logger.error("Failed to enable auto-login", { error })
  }
}

/**
 * Check if user has stored authentication data
 * @returns True if auth data exists
 */
export const hasStoredAuthData = (): boolean => {
  try {
    const userData = localStorage.getItem("hb-demo-user")
    const viewingAs = localStorage.getItem("hb-viewing-as")
    return !!(userData || viewingAs)
  } catch (error) {
    logger.error("Failed to check stored auth data", { error })
    return false
  }
}

/**
 * Get detailed cache status
 * @returns Object with cache status information
 */
export const getAuthCacheStatus = (): {
  hasUserData: boolean
  hasViewingAs: boolean
  hasSelectedProject: boolean
  hasTourData: boolean
  hasForecastData: boolean
  totalKeys: number
  sessionStorageKeys: number
} => {
  try {
    const hasUserData = !!localStorage.getItem("hb-demo-user")
    const hasViewingAs = !!localStorage.getItem("hb-viewing-as")
    const hasSelectedProject = !!localStorage.getItem("selectedProject")
    const hasTourData = !!localStorage.getItem("hb-tours-completed")
    const hasForecastData = !!localStorage.getItem("hb-forecast-data")
    const totalKeys = localStorage.length
    const sessionStorageKeys = Object.keys(sessionStorage).length

    return {
      hasUserData,
      hasViewingAs,
      hasSelectedProject,
      hasTourData,
      hasForecastData,
      totalKeys,
      sessionStorageKeys,
    }
  } catch (error) {
    logger.error("Failed to get cache status", { error })
    return {
      hasUserData: false,
      hasViewingAs: false,
      hasSelectedProject: false,
      hasTourData: false,
      hasForecastData: false,
      totalKeys: 0,
      sessionStorageKeys: 0,
    }
  }
}

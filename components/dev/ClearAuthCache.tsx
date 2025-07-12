"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Trash2, RefreshCw } from "lucide-react"
import { useAuth } from "@/context/auth-context"

/**
 * Development utility component for clearing authentication cache
 *
 * This component provides a UI button to clear all cached login credentials
 * and user preferences. It should only be used in development or when
 * troubleshooting authentication issues.
 */
export function ClearAuthCache() {
  const [isClearing, setIsClearing] = useState(false)
  const { toast } = useToast()
  const { logout } = useAuth()

  const clearAllAuthCache = () => {
    if (
      !confirm(
        "Are you sure you want to clear all authentication cache? This will log you out and remove all saved preferences."
      )
    ) {
      return
    }

    setIsClearing(true)

    try {
      console.log("🧹 Clearing all HB Report authentication cache...")

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
          console.log("✓ Cleared:", key)
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
      console.log("✓ Cleared all sessionStorage data")

      // Clear cookies (if any)
      document.cookie.split(";").forEach(function (c) {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/")
      })
      console.log("✓ Cleared all cookies")

      console.log("✅ Cache clearing complete!")
      console.log(`📊 Cleared ${clearedCount} auth keys + ${additionalCleared} additional keys`)

      toast({
        title: "Authentication Cache Cleared",
        description: `Cleared ${clearedCount + additionalCleared} cached items. Redirecting to login...`,
        duration: 3000,
      })

      // Use the logout function to ensure proper state cleanup
      logout()

      // Redirect to login after a short delay to show the toast
      setTimeout(() => {
        window.location.href = "/login"
      }, 1500)
    } catch (error) {
      console.error("❌ Error clearing authentication cache:", error)
      toast({
        title: "Clear Cache Failed",
        description: "An error occurred while clearing the cache. Check the console for details.",
        variant: "destructive",
      })
    } finally {
      setIsClearing(false)
    }
  }

  // Only show in development environment
  if (process.env.NODE_ENV !== "development") {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button variant="destructive" size="sm" onClick={clearAllAuthCache} disabled={isClearing} className="shadow-lg">
        {isClearing ? (
          <>
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            Clearing...
          </>
        ) : (
          <>
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Auth Cache
          </>
        )}
      </Button>
    </div>
  )
}

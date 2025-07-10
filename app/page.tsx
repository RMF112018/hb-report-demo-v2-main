"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import LoginPage from "./login/page"

export default function Home() {
  const router = useRouter()
  const { user, isLoading, isClient } = useAuth()

  // Only redirect authenticated users to main-app, but preserve navigation history
  useEffect(() => {
    // Wait for client-side hydration and auth loading to complete
    if (!isClient || isLoading) return

    // Only redirect if user is authenticated - use push to preserve history
    if (user) {
      router.push("/main-app")
    }
    // If no user, stay on this page which renders the login component
  }, [router, user, isLoading, isClient])

  // Show loading state during SSR/hydration or auth loading
  if (!isClient || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // If user is authenticated, show loading while navigating
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to dashboard...</p>
        </div>
      </div>
    )
  }

  // If no user, render the login page directly
  return <LoginPage />
}

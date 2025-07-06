"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"

export default function Home() {
  const router = useRouter()
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (isLoading) return // Wait for auth to load

    // Client-side redirect based on authentication status
    if (user) {
      // User is already authenticated, go to main app
      router.replace("/main-app")
    } else {
      // User is not authenticated, go to login
      router.replace("/login")
    }
  }, [router, user, isLoading])

  // Show loading state during redirect
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  )
}

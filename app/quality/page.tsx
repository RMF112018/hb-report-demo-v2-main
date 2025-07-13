/**
 * @fileoverview Quality Control Page
 * @module QualityPage
 * @version 1.0.0
 * @author HB Development Team
 * @since 2025-01-15
 *
 * Quality control dashboard with metrics, warranty tracking,
 * programs, and announcements management.
 */

"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { QualityDashboard } from "../../components/quality/QualityDashboard"

// Mock user data - in a real app this would come from authentication
const mockUser = {
  firstName: "Alex",
  lastName: "Chen",
  email: "alex.chen@company.com",
  role: "quality-manager",
  avatar: "/avatars/alex-chen.png",
  department: "Quality Control",
  permissions: ["quality:read", "quality:write", "warranty:manage", "quality:admin"],
}

export default function QualityPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return <QualityDashboard user={mockUser} />
}

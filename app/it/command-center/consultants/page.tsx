"use client"

import React from "react"
import { useAuth } from "@/context/auth-context"
import { ITModuleNavigation } from "@/components/layout/ITModuleNavigation"
import { AppHeader } from "@/components/layout/app-header"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Shield, Users, Home } from "lucide-react"

/**
 * Consultant Dashboard Module
 * --------------------------
 * External vendor and consultant management
 */

export default function ConsultantTrackerPage() {
  const { user } = useAuth()

  // Restrict access to admin users only
  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 mx-auto mb-4 text-red-500" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h1>
          <p className="text-gray-600 dark:text-gray-400">You don't have permission to access the IT Command Center.</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <AppHeader />
      <div className="space-y-3 p-6">
        {/* Breadcrumb Navigation */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="flex items-center gap-1">
                <Home className="h-3 w-3" />
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/it-command-center" className="text-muted-foreground hover:text-foreground">
                IT Command Center
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Consultant Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header Section - Made Sticky */}
        <div className="sticky top-20 z-40 bg-white dark:bg-gray-950 border-b border-border/40 -mx-6 px-6 pb-4 backdrop-blur-sm">
          <div className="flex flex-col gap-4 pt-3" data-tour="consultant-tracker-header">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 dark:bg-amber-950/30 rounded-lg">
                  <Users className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Consultant Dashboard</h1>
                  <p className="text-muted-foreground mt-1">
                    Track external consultants, manage vendor relationships, and monitor service contracts
                  </p>
                </div>
              </div>
            </div>

            {/* Module Navigation Row */}
            <div
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              data-tour="it-module-navigation"
            >
              <ITModuleNavigation />
            </div>
          </div>
        </div>

        {/* Module Content */}
        <div data-tour="consultant-tracker-content">
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-border p-6">
            <div className="text-center py-12">
              <div className="mb-4">
                <div className="mx-auto w-16 h-16 bg-amber-100 dark:bg-amber-950/30 rounded-full flex items-center justify-center">
                  <Users className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Consultant Dashboard</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Track external consultants, manage vendor relationships, and monitor service contracts for SOC, server
                management, compliance, and networking services.
              </p>
              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-amber-700 dark:text-amber-400 text-sm">
                  Consultant dashboard coming soon. This will provide comprehensive vendor management, contract
                  tracking, and service performance monitoring.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

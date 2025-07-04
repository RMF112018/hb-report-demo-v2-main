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
import { Shield, Brain, Home } from "lucide-react"

/**
 * AI/Analytics Pipeline Control Module
 * ------------------------------------
 * AI model management and analytics pipeline monitoring
 */

export default function AIPipelineControlPage() {
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
              <BreadcrumbPage>AI/Analytics Pipeline Control</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header Section - Made Sticky */}
        <div className="sticky top-20 z-40 bg-white dark:bg-gray-950 border-b border-border/40 -mx-6 px-6 pb-4 backdrop-blur-sm">
          <div className="flex flex-col gap-4 pt-3" data-tour="ai-pipeline-header">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-950/30 rounded-lg">
                  <Brain className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">AI/Analytics Pipeline Control</h1>
                  <p className="text-muted-foreground mt-1">
                    Monitor AI model performance, analytics workflows, and machine learning operations
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
        <div data-tour="ai-pipeline-content">
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-border p-6">
            <div className="text-center py-12">
              <div className="mb-4">
                <div className="mx-auto w-16 h-16 bg-emerald-100 dark:bg-emerald-950/30 rounded-full flex items-center justify-center">
                  <Brain className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">AI/Analytics Pipeline Control</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Monitor AI model performance, analytics workflows, and machine learning operations across all automated
                systems and data processing pipelines.
              </p>
              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-amber-700 dark:text-amber-400 text-sm">
                  AI pipeline dashboard coming soon. This will provide comprehensive AI model monitoring, pipeline
                  management, and performance analytics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

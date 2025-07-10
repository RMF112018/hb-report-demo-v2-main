/**
 * @fileoverview Budget Analysis Project Content Component
 * @module BudgetAnalysisProjectContent
 * @version 3.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Budget Analysis implementation for project control center following Core Project Tools pattern:
 * - Sub-tab navigation (Overview, Categories, Variance, Budget Detail)
 * - Role-based access control
 * - Responsive layout integration
 * - Focus mode support
 * - Modular component structure
 */

"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

// Import the original BudgetAnalysis component
import BudgetAnalysis from "@/components/financial-hub/BudgetAnalysis"

interface BudgetAnalysisProjectContentProps {
  projectId: string
  projectData: any
  userRole: string
  user: any
  className?: string
}

const BudgetAnalysisProjectContent: React.FC<BudgetAnalysisProjectContentProps> = ({
  projectId,
  projectData,
  userRole,
  user,
  className,
}) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Extract project name from project data
  const projectName = projectData?.name || `Project ${projectId}`

  // Custom BudgetAnalysis wrapper that passes the view mode
  const BudgetAnalysisWrapper = ({ viewMode }: { viewMode: string }) => {
    const [internalViewMode, setInternalViewMode] = useState(viewMode)

    useEffect(() => {
      setInternalViewMode(viewMode)
    }, [viewMode])

    return (
      <BudgetAnalysis
        userRole={userRole}
        projectData={projectData}
        initialViewMode={viewMode}
        hideViewToggle={true}
        className="w-full"
      />
    )
  }

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Budget Analysis content
  const budgetAnalysisContent = (
    <div className={cn("space-y-4 w-full max-w-full overflow-hidden", className)}>
      {/* Module Title with Focus Button */}
      <div className="pb-2 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-foreground">Budget Analysis</h3>
            <p className="text-sm text-muted-foreground">
              Comprehensive budget tracking and variance analysis for {projectName}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
              <RefreshCw className="h-3 w-3 mr-1" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
              <Download className="h-3 w-3 mr-1" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Budget Analysis Sub-Tab Navigation */}
      <div className="space-y-4 w-full max-w-full overflow-hidden">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="variance">Variance</TabsTrigger>
            <TabsTrigger value="budget-detail">Budget Detail</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="w-full max-w-full overflow-hidden">
            <div className="space-y-6 w-full max-w-full">
              <BudgetAnalysisWrapper viewMode="overview" />
            </div>
          </TabsContent>
          <TabsContent value="categories" className="w-full max-w-full overflow-hidden">
            <div className="space-y-6 w-full max-w-full">
              <BudgetAnalysisWrapper viewMode="categories" />
            </div>
          </TabsContent>
          <TabsContent value="variance" className="w-full max-w-full overflow-hidden">
            <div className="space-y-6 w-full max-w-full">
              <BudgetAnalysisWrapper viewMode="variance" />
            </div>
          </TabsContent>
          <TabsContent value="budget-detail" className="w-full max-w-full overflow-hidden">
            <div className="space-y-6 w-full max-w-full overflow-hidden">
              <BudgetAnalysisWrapper viewMode="budget" />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )

  // Return the main content
  return budgetAnalysisContent
}

export default BudgetAnalysisProjectContent

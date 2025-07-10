/**
 * @fileoverview Pre-Construction Estimating Integration
 * @version v3.0.0
 * @description Example integration of modular estimating components into pre-con workflows
 *
 * This file demonstrates how to inject estimating components into the pre-con page
 * following the v-3.0.mdc modular architecture standards.
 */

"use client"

import React, { Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calculator, DollarSign, FileText, TrendingUp, Building2, Users, BarChart3, Target } from "lucide-react"

// Import modular estimating components
import {
  EstimatingModuleWrapper,
  EstimatingModuleSkeleton,
  LazyEstimatingTracker,
  LazyCostSummaryModule,
  LazyBidManagement,
  AllowancesLog,
  AreaCalculationsModule,
  GCGRLog,
  ProjectEstimateOverview,
  CostAnalyticsDashboard,
  EstimatingIntelligence,
} from "../index"

// ==========================================
// PRE-CON ESTIMATING DASHBOARD
// ==========================================

export interface PreConEstimatingDashboardProps {
  projectId: string
  projectName: string
  userRole: string
  phase: "concept" | "design" | "development" | "bid"
  onNavigate?: (path: string) => void
}

export function PreConEstimatingDashboard({
  projectId,
  projectName,
  userRole,
  phase,
  onNavigate,
}: PreConEstimatingDashboardProps) {
  // Phase-specific component configuration
  const getPhaseComponents = () => {
    switch (phase) {
      case "concept":
        return ["overview", "area-calculations", "allowances", "intelligence"]
      case "design":
        return ["overview", "cost-summary", "area-calculations", "allowances", "gcgr"]
      case "development":
        return ["tracker", "cost-summary", "bids", "analytics"]
      case "bid":
        return ["tracker", "bids", "cost-summary", "analytics"]
      default:
        return ["overview", "tracker"]
    }
  }

  const activeComponents = getPhaseComponents()
  const phaseColors = {
    concept: "bg-blue-100 text-blue-800",
    design: "bg-green-100 text-green-800",
    development: "bg-orange-100 text-orange-800",
    bid: "bg-purple-100 text-purple-800",
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pre-Construction Estimating - {projectName}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge className={phaseColors[phase]}>{phase.charAt(0).toUpperCase() + phase.slice(1)} Phase</Badge>
            <span className="text-sm text-gray-600">Project ID: {projectId}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => onNavigate?.("/projects")}>
            Back to Projects
          </Button>
          <Button onClick={() => onNavigate?.(`/projects/${projectId}/estimating`)}>Full Estimating Center</Button>
        </div>
      </div>

      {/* Phase-specific content */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          {activeComponents.includes("overview") && <TabsTrigger value="overview">Overview</TabsTrigger>}
          {activeComponents.includes("tracker") && <TabsTrigger value="tracker">Tracker</TabsTrigger>}
          {activeComponents.includes("cost-summary") && <TabsTrigger value="costs">Costs</TabsTrigger>}
          {activeComponents.includes("bids") && <TabsTrigger value="bids">Bids</TabsTrigger>}
        </TabsList>

        {/* Overview Tab */}
        {activeComponents.includes("overview") && (
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <EstimatingModuleWrapper
                  title="Project Overview"
                  description="Comprehensive project estimating overview"
                  projectId={projectId}
                  userRole={userRole}
                  isEmbedded={true}
                  showCard={true}
                >
                  <Suspense fallback={<EstimatingModuleSkeleton />}>
                    <ProjectEstimateOverview viewMode="overview" userRole={userRole} />
                  </Suspense>
                </EstimatingModuleWrapper>
              </div>

              <div className="space-y-4">
                <EstimatingModuleWrapper
                  title="AI Intelligence"
                  projectId={projectId}
                  userRole={userRole}
                  isEmbedded={true}
                  showCard={true}
                  className="h-80"
                >
                  <EstimatingIntelligence userRole={userRole} />
                </EstimatingModuleWrapper>
              </div>
            </div>
          </TabsContent>
        )}

        {/* Tracker Tab */}
        {activeComponents.includes("tracker") && (
          <TabsContent value="tracker" className="space-y-6">
            <EstimatingModuleWrapper
              title="Estimating Tracker"
              projectId={projectId}
              userRole={userRole}
              isEmbedded={true}
              showCard={false}
            >
              <Suspense fallback={<EstimatingModuleSkeleton />}>
                <LazyEstimatingTracker onProjectSelect={(id) => onNavigate?.(`/projects/${id}`)} />
              </Suspense>
            </EstimatingModuleWrapper>
          </TabsContent>
        )}

        {/* Costs Tab */}
        {activeComponents.includes("cost-summary") && (
          <TabsContent value="costs" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <EstimatingModuleWrapper
                title="Cost Summary"
                projectId={projectId}
                userRole={userRole}
                isEmbedded={true}
                showCard={true}
              >
                <Suspense fallback={<EstimatingModuleSkeleton />}>
                  <LazyCostSummaryModule projectId={projectId} projectName={projectName} />
                </Suspense>
              </EstimatingModuleWrapper>

              <EstimatingModuleWrapper
                title="Cost Analytics"
                projectId={projectId}
                userRole={userRole}
                isEmbedded={true}
                showCard={true}
              >
                <CostAnalyticsDashboard userRole={userRole} />
              </EstimatingModuleWrapper>
            </div>
          </TabsContent>
        )}

        {/* Bids Tab */}
        {activeComponents.includes("bids") && (
          <TabsContent value="bids" className="space-y-6">
            <EstimatingModuleWrapper
              title="Bid Management"
              projectId={projectId}
              userRole={userRole}
              isEmbedded={true}
              showCard={false}
            >
              <Suspense fallback={<EstimatingModuleSkeleton />}>
                <LazyBidManagement userRole={userRole} />
              </Suspense>
            </EstimatingModuleWrapper>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}

// ==========================================
// PRE-CON ESTIMATING CARDS
// ==========================================

export function PreConEstimatingCards({ projectId, userRole }: { projectId: string; userRole: string }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Area Calculations Card */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-blue-600" />
            Area Calculations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EstimatingModuleWrapper
            projectId={projectId}
            userRole={userRole}
            isEmbedded={true}
            showCard={false}
            showHeader={false}
            className="h-48"
          >
            <AreaCalculationsModule projectId={projectId} projectName="Current Project" />
          </EstimatingModuleWrapper>
        </CardContent>
      </Card>

      {/* Allowances Card */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            Allowances
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EstimatingModuleWrapper
            projectId={projectId}
            userRole={userRole}
            isEmbedded={true}
            showCard={false}
            showHeader={false}
            className="h-48"
          >
            <AllowancesLog />
          </EstimatingModuleWrapper>
        </CardContent>
      </Card>

      {/* GC & GR Card */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-purple-600" />
            GC & GR
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EstimatingModuleWrapper
            projectId={projectId}
            userRole={userRole}
            isEmbedded={true}
            showCard={false}
            showHeader={false}
            className="h-48"
          >
            <GCGRLog />
          </EstimatingModuleWrapper>
        </CardContent>
      </Card>
    </div>
  )
}

// ==========================================
// PRE-CON ESTIMATING WIDGET
// ==========================================

export function PreConEstimatingWidget({
  projectId,
  userRole,
  compact = false,
}: {
  projectId: string
  userRole: string
  compact?: boolean
}) {
  return (
    <Card className={`${compact ? "p-4" : "p-6"}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          Estimating Summary
        </h3>
        <Button variant="outline" size="sm">
          View Full
        </Button>
      </div>

      <EstimatingModuleWrapper
        projectId={projectId}
        userRole={userRole}
        isEmbedded={true}
        showCard={false}
        showHeader={false}
        className={compact ? "h-32" : "h-48"}
      >
        <Suspense fallback={<div>Loading...</div>}>
          <ProjectEstimateOverview viewMode="overview" userRole={userRole} />
        </Suspense>
      </EstimatingModuleWrapper>
    </Card>
  )
}

// ==========================================
// INTEGRATION HELPERS
// ==========================================

/**
 * Hook to determine which estimating components to show based on project phase
 */
export function usePreConEstimatingComponents(phase: string) {
  const componentMap = {
    concept: [
      { key: "overview", component: ProjectEstimateOverview, title: "Project Overview" },
      { key: "area-calculations", component: AreaCalculationsModule, title: "Area Calculations" },
      { key: "allowances", component: AllowancesLog, title: "Allowances" },
      { key: "intelligence", component: EstimatingIntelligence, title: "AI Intelligence" },
    ],
    design: [
      { key: "overview", component: ProjectEstimateOverview, title: "Project Overview" },
      { key: "cost-summary", component: LazyCostSummaryModule, title: "Cost Summary" },
      { key: "area-calculations", component: AreaCalculationsModule, title: "Area Calculations" },
      { key: "allowances", component: AllowancesLog, title: "Allowances" },
      { key: "gcgr", component: GCGRLog, title: "GC & GR" },
    ],
    development: [
      { key: "tracker", component: LazyEstimatingTracker, title: "Estimating Tracker" },
      { key: "cost-summary", component: LazyCostSummaryModule, title: "Cost Summary" },
      { key: "bids", component: LazyBidManagement, title: "Bid Management" },
      { key: "analytics", component: CostAnalyticsDashboard, title: "Cost Analytics" },
    ],
    bid: [
      { key: "tracker", component: LazyEstimatingTracker, title: "Estimating Tracker" },
      { key: "bids", component: LazyBidManagement, title: "Bid Management" },
      { key: "cost-summary", component: LazyCostSummaryModule, title: "Cost Summary" },
      { key: "analytics", component: CostAnalyticsDashboard, title: "Cost Analytics" },
    ],
  }

  return componentMap[phase as keyof typeof componentMap] || []
}

// Export all integration components
export {
  PreConEstimatingDashboard as default,
  PreConEstimatingCards,
  PreConEstimatingWidget,
  usePreConEstimatingComponents,
}

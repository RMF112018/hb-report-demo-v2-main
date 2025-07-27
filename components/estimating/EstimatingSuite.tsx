/**
 * @fileoverview Estimating Suite Component
 * @module EstimatingSuite
 * @version 3.0.0
 * @author HB Development Team
 * @since 2025-01-29
 *
 * Extracted from PreConstructionContent component to manage estimating functionality
 *
 * Responsibilities:
 * - Manage activeEstimatingSubTab state
 * - Manage activeBidPackageTab state
 * - Manage selectedBidPackage state
 * - Render estimating dashboard and detail views
 * - Handle bid package selection and navigation
 */

"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calculator,
  Building2,
  TrendingUp,
  ClipboardList,
  FileText,
  BarChart3,
  Target,
  Eye,
  Plus,
  Download,
  Upload,
  MessageSquare,
  Users,
  Package,
  Hammer,
  Scale,
  Grid,
  Brain,
  RefreshCw,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
} from "lucide-react"

// Import existing estimating components
import { CostSummaryModule } from "@/components/estimating/CostSummaryModule"
import TakeoffManager from "@/components/estimating/TakeoffManager"
import AllowancesLog from "@/components/estimating/AllowancesLog"
import GCGRLog from "@/components/estimating/GCGRLog"
import { BidLeveling } from "@/components/estimating/BidLeveling"
import BidTabManagement from "@/components/estimating/BidTabManagement"
import ClarificationsAssumptions from "@/components/estimating/ClarificationsAssumptions"
import DocumentLog from "@/components/estimating/DocumentLog"
import TradePartnerLog from "@/components/estimating/TradePartnerLog"
import { ProjectEstimateOverview } from "@/components/estimating/ProjectEstimateOverview"
import { EstimatingIntelligence } from "@/components/estimating/EstimatingIntelligence"
import BiddingSubTab from "@/components/estimating/bid-management/components/BiddingSubTab"
import SimpleEstimatingProgressCard from "@/components/cards/SimpleEstimatingProgressCard"
import BetaProcurementStatsPanel from "@/components/cards/beta/BetaProcurementStatsPanel"
import BetaRFI from "@/components/cards/beta/BetaRFI"
import BetaContingencyAnalysis from "@/components/cards/beta/BetaContingencyAnalysis"
import {
  FinalSummaryContent,
  FinalCostSummaryCard,
  ApprovalWorkflowCard,
} from "@/components/estimating/FinalSummaryContent"

interface EstimatingSuiteProps {
  projectId: string
  projectData: any
  user: any
  userRole: string
}

/**
 * EstimatingSuite Component
 *
 * Centralized estimating functionality with internal state management
 * and comprehensive tab navigation system
 */
export default function EstimatingSuite({ projectId, projectData, user, userRole }: EstimatingSuiteProps) {
  // Internal state management
  const [activeEstimatingSubTab, setActiveEstimatingSubTab] = useState("overview")
  const [selectedBidPackage, setSelectedBidPackage] = useState<string | null>(null)

  // Note: Helper functions are now encapsulated within the BiddingSubTab component

  // Note: Bid package data and handlers are now managed within the BiddingSubTab component
  // for better encapsulation and modularity following v-3-0 standards

  // EstimatingTabsNav Component
  const EstimatingTabsNav = () => (
    <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6 xl:grid-cols-12 gap-1 h-auto p-1">
      <TabsTrigger value="overview" className="text-xs px-2 py-1">
        Overview
      </TabsTrigger>
      <TabsTrigger value="documents" className="text-xs px-2 py-1">
        Documents
      </TabsTrigger>
      <TabsTrigger value="cost-summary" className="text-xs px-2 py-1">
        Cost Summary
      </TabsTrigger>
      <TabsTrigger value="bidding" className="text-xs px-2 py-1">
        Bidding
      </TabsTrigger>
      <TabsTrigger value="area-calculation" className="text-xs px-2 py-1">
        Takeoff Manager
      </TabsTrigger>
      <TabsTrigger value="allowances" className="text-xs px-2 py-1">
        Allowances
      </TabsTrigger>
      <TabsTrigger value="clarifications" className="text-xs px-2 py-1">
        Clarifications
      </TabsTrigger>
      <TabsTrigger value="value-analysis" className="text-xs px-2 py-1">
        Value Analysis
      </TabsTrigger>
      <TabsTrigger value="trade-partners" className="text-xs px-2 py-1">
        Trade Partners
      </TabsTrigger>
    </TabsList>
  )

  // EstimatingDashboardOverview Component
  const EstimatingDashboardOverview = () => (
    <div className="space-y-4">
      {/* Estimating Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="dark:bg-gray-800/50 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Calculator className="h-4 w-4" />
              Cost Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
              <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                ${projectData?.contract_value ? (projectData.contract_value / 1000000).toFixed(1) : "0"}M
              </div>
              <p className="text-xs text-muted-foreground">Estimated Value</p>
            </div>
            <div className="space-y-1">
              <Button size="sm" className="w-full justify-start text-xs h-7">
                <FileText className="h-3 w-3 mr-1" />
                View Cost Breakdown
              </Button>
              <Button size="sm" variant="outline" className="w-full justify-start text-xs h-7">
                <BarChart3 className="h-3 w-3 mr-1" />
                Bid Leveling
              </Button>
              <Button size="sm" variant="outline" className="w-full justify-start text-xs h-7">
                <Target className="h-3 w-3 mr-1" />
                Accuracy Tracking
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800/50 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Building2 className="h-4 w-4" />
              Project Scope
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-center p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
              <div className="text-xl font-bold text-green-600 dark:text-green-400">
                {projectData?.project_type_name || "Commercial"}
              </div>
              <p className="text-xs text-muted-foreground">Project Type</p>
            </div>
            <div className="space-y-1">
              <Button size="sm" className="w-full justify-start text-xs h-7">
                <Eye className="h-3 w-3 mr-1" />
                View Scope Details
              </Button>
              <Button size="sm" variant="outline" className="w-full justify-start text-xs h-7">
                <Calculator className="h-3 w-3 mr-1" />
                Estimate Builder
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800/50 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4" />
              Estimating Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-center p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
              <div className="text-xl font-bold text-purple-600 dark:text-purple-400">85%</div>
              <p className="text-xs text-muted-foreground">Complete</p>
            </div>
            <div className="space-y-1">
              <Button size="sm" className="w-full justify-start text-xs h-7">
                <Plus className="h-3 w-3 mr-1" />
                New Estimate
              </Button>
              <Button size="sm" variant="outline" className="w-full justify-start text-xs h-7">
                <Download className="h-3 w-3 mr-1" />
                Export Templates
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Estimating Activities */}
      <Card className="dark:bg-gray-800/50 dark:border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <ClipboardList className="h-4 w-4" />
            Estimating Activities
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            {[
              { task: "Quantity Takeoff", status: "completed", progress: 100 },
              { task: "Material Pricing", status: "in-progress", progress: 75 },
              { task: "Labor Calculations", status: "in-progress", progress: 60 },
              { task: "Equipment Costs", status: "pending", progress: 30 },
              { task: "Final Review", status: "pending", progress: 0 },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-2 border rounded-lg dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      item.status === "completed"
                        ? "bg-green-500"
                        : item.status === "in-progress"
                        ? "bg-yellow-500"
                        : "bg-gray-300 dark:bg-gray-600"
                    }`}
                  />
                  <span className="text-xs font-medium">{item.task}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${
                        item.status === "completed"
                          ? "bg-green-500"
                          : item.status === "in-progress"
                          ? "bg-yellow-500"
                          : "bg-gray-300 dark:bg-gray-600"
                      }`}
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-8">{item.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  // Note: Previous BidPackageDetailView and BidPackageListView functions have been
  // replaced by the comprehensive BiddingSubTab component for better modularity

  return (
    <div className="space-y-4">
      {/* Estimating Sub-Tab Navigation */}
      <Tabs value={activeEstimatingSubTab} onValueChange={setActiveEstimatingSubTab} className="w-full">
        <EstimatingTabsNav />

        {/* Tab Content */}
        <TabsContent value="overview" className="mt-4">
          {/* Dynamic Grid Layout with Individual Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {/* Final Cost Summary Card */}
            <FinalCostSummaryCard
              calculations={{
                subtotal: 2500000,
                gcTotal: 180000,
                grTotal: 120000,
                baseTotal: 2800000,
                overhead: 224000,
                profit: 280000,
                contingency: 140000,
                total: 3444000,
                approvalProgress: 75,
              }}
            />

            {/* Approval Workflow Card */}
            <ApprovalWorkflowCard
              approvalSteps={[
                {
                  id: "1",
                  title: "Estimator Review",
                  description: "Initial cost estimate validation",
                  status: "complete",
                  approver: "John Smith",
                  required: true,
                },
                {
                  id: "2",
                  title: "Project Manager Review",
                  description: "Scope and timeline validation",
                  status: "complete",
                  approver: "Sarah Johnson",
                  required: true,
                },
                {
                  id: "3",
                  title: "Senior Management Review",
                  description: "Final approval and sign-off",
                  status: "pending",
                  approver: "Mike Davis",
                  required: true,
                },
                {
                  id: "4",
                  title: "Client Submission",
                  description: "Submit to client for review",
                  status: "pending",
                  approver: "Client Team",
                  required: true,
                },
              ]}
              approvalProgress={75}
              isSubmitting={false}
              onSubmit={() => {
                console.log("Submit for client review")
              }}
              onApprovalStep={(stepId, action) => {
                console.log(`Approval step ${stepId}: ${action}`)
              }}
            />

            {/* Estimating Progress Card - Made wider (spans 2 columns) */}
            <div className="xl:col-span-2">
              <SimpleEstimatingProgressCard userRole={userRole} isCompact={true} />
            </div>

            {/* Analytics Cards */}
            <BetaProcurementStatsPanel userRole={userRole} isCompact={true} />
            <BetaRFI userRole={userRole} isCompact={true} />
            <BetaContingencyAnalysis isCompact={true} />
          </div>
        </TabsContent>

        <TabsContent value="documents" className="mt-4">
          <DocumentLog />
        </TabsContent>

        <TabsContent value="cost-summary" className="mt-4">
          <CostSummaryModule projectId={projectId} projectName={projectData?.name || "Project"} />
        </TabsContent>

        <TabsContent value="bidding" className="mt-4">
          <BiddingSubTab
            projectId={projectId}
            projectData={projectData}
            userRole={userRole}
            user={user}
            onPackageSelect={setSelectedBidPackage}
          />
        </TabsContent>

        <TabsContent value="area-calculation" className="mt-4">
          <TakeoffManager projectId={projectId} projectName={projectData?.name || "Project"} />
        </TabsContent>

        <TabsContent value="allowances" className="mt-4">
          <AllowancesLog />
        </TabsContent>

        <TabsContent value="clarifications" className="mt-4">
          <ClarificationsAssumptions />
        </TabsContent>

        <TabsContent value="value-analysis" className="mt-4">
          <Card className="dark:bg-gray-800/50 dark:border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Value Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Value engineering and analysis tools will be displayed here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trade-partners" className="mt-4">
          <TradePartnerLog />
        </TabsContent>
      </Tabs>
    </div>
  )
}

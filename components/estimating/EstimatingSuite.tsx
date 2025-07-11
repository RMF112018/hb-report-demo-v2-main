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
import { AreaCalculationsModule } from "@/components/estimating/AreaCalculationsModule"
import AllowancesLog from "@/components/estimating/AllowancesLog"
import GCGRLog from "@/components/estimating/GCGRLog"
import { BidLeveling } from "@/components/estimating/BidLeveling"
import BidTabManagement from "@/components/estimating/BidTabManagement"
import ClarificationsAssumptions from "@/components/estimating/ClarificationsAssumptions"
import DocumentLog from "@/components/estimating/DocumentLog"
import TradePartnerLog from "@/components/estimating/TradePartnerLog"
import { ProjectEstimateOverview } from "@/components/estimating/ProjectEstimateOverview"
import { EstimatingIntelligence } from "@/components/estimating/EstimatingIntelligence"

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
  const [activeBidPackageTab, setActiveBidPackageTab] = useState("overview")

  // Helper function to get bid package name
  const getBidPackageName = (packageId: string) => {
    const packages: { [key: string]: string } = {
      "01-00": "Materials Testing",
      "02-21": "Surveying",
      "03-33": "Concrete",
      "04-21": "Masonry",
      "05-12": "Structural Steel",
      "06-10": "Carpentry",
      "07-11": "Waterproofing",
      "08-11": "Steel Doors",
    }
    return packages[packageId] || "Unknown Package"
  }

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
      <TabsTrigger value="gc-gr" className="text-xs px-2 py-1">
        GC GR
      </TabsTrigger>
      <TabsTrigger value="bidding" className="text-xs px-2 py-1">
        Bidding
      </TabsTrigger>
      <TabsTrigger value="area-calculation" className="text-xs px-2 py-1">
        Area Calc
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
    <div className="space-y-6">
      {/* Estimating Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Cost Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  ${projectData?.contract_value ? (projectData.contract_value / 1000000).toFixed(1) : "0"}M
                </div>
                <p className="text-sm text-muted-foreground">Estimated Value</p>
              </div>
              <div className="space-y-2">
                <Button size="sm" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  View Cost Breakdown
                </Button>
                <Button size="sm" variant="outline" className="w-full justify-start">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Bid Leveling
                </Button>
                <Button size="sm" variant="outline" className="w-full justify-start">
                  <Target className="h-4 w-4 mr-2" />
                  Accuracy Tracking
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Project Scope
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {projectData?.project_type_name || "Commercial"}
                </div>
                <p className="text-sm text-muted-foreground">Project Type</p>
              </div>
              <div className="space-y-2">
                <Button size="sm" className="w-full justify-start">
                  <Eye className="h-4 w-4 mr-2" />
                  View Scope Details
                </Button>
                <Button size="sm" variant="outline" className="w-full justify-start">
                  <Calculator className="h-4 w-4 mr-2" />
                  Estimate Builder
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Estimating Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">85%</div>
                <p className="text-sm text-muted-foreground">Complete</p>
              </div>
              <div className="space-y-2">
                <Button size="sm" className="w-full justify-start">
                  <Plus className="h-4 w-4 mr-2" />
                  New Estimate
                </Button>
                <Button size="sm" variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Export Templates
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Estimating Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            Estimating Activities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { task: "Quantity Takeoff", status: "completed", progress: 100 },
              { task: "Material Pricing", status: "in-progress", progress: 75 },
              { task: "Labor Calculations", status: "in-progress", progress: 60 },
              { task: "Equipment Costs", status: "pending", progress: 30 },
              { task: "Final Review", status: "pending", progress: 0 },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      item.status === "completed"
                        ? "bg-green-500"
                        : item.status === "in-progress"
                        ? "bg-yellow-500"
                        : "bg-gray-300"
                    }`}
                  />
                  <span className="font-medium">{item.task}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        item.status === "completed"
                          ? "bg-green-500"
                          : item.status === "in-progress"
                          ? "bg-yellow-500"
                          : "bg-gray-300"
                      }`}
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-12">{item.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  // Bid Package Detail View
  const BidPackageDetailView = () => (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <span className="cursor-pointer hover:text-blue-600" onClick={() => setSelectedBidPackage(null)}>
          Bid Packages
        </span>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">
          {selectedBidPackage}: {selectedBidPackage ? getBidPackageName(selectedBidPackage) : "Unknown Package"}
        </span>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          {selectedBidPackage}: {selectedBidPackage ? getBidPackageName(selectedBidPackage) : "Unknown Package"}
        </h1>
      </div>

      {/* Bid Package Tab Navigation */}
      <div className="border-b border-border">
        <div className="flex space-x-6 overflow-x-auto">
          {["overview", "bids", "files", "messages", "evaluation"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveBidPackageTab(tab)}
              className={`flex items-center space-x-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                activeBidPackageTab === tab
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"
              }`}
            >
              <span className="capitalize">{tab}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Bid Package Content */}
      <div className="mt-4">
        {activeBidPackageTab === "overview" && (
          <Card>
            <CardHeader>
              <CardTitle>Package Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Bid package overview and details will be displayed here.</p>
            </CardContent>
          </Card>
        )}
        {activeBidPackageTab === "bids" && (
          <Card>
            <CardHeader>
              <CardTitle>Bid Responses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Bid responses and comparison tools will be displayed here.</p>
            </CardContent>
          </Card>
        )}
        {/* Add other bid package tabs as needed */}
      </div>
    </div>
  )

  // Bid Package List View
  const BidPackageListView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries({
          "01-00": "Materials Testing",
          "02-21": "Surveying",
          "03-33": "Concrete",
          "04-21": "Masonry",
          "05-12": "Structural Steel",
          "06-10": "Carpentry",
          "07-11": "Waterproofing",
          "08-11": "Steel Doors",
        }).map(([id, name]) => (
          <Card
            key={id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelectedBidPackage(id)}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{id}</CardTitle>
              <p className="text-sm text-muted-foreground">{name}</p>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Badge variant="outline">5 Bids</Badge>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Estimating Sub-Tab Navigation */}
      <Tabs value={activeEstimatingSubTab} onValueChange={setActiveEstimatingSubTab} className="w-full">
        <EstimatingTabsNav />

        {/* Tab Content */}
        <TabsContent value="overview" className="mt-6">
          <EstimatingDashboardOverview />
        </TabsContent>

        <TabsContent value="documents" className="mt-6">
          <DocumentLog />
        </TabsContent>

        <TabsContent value="cost-summary" className="mt-6">
          <CostSummaryModule projectId={projectId} projectName={projectData?.name || "Project"} />
        </TabsContent>

        <TabsContent value="gc-gr" className="mt-6">
          <GCGRLog />
        </TabsContent>

        <TabsContent value="bidding" className="mt-6">
          {selectedBidPackage ? <BidPackageDetailView /> : <BidPackageListView />}
        </TabsContent>

        <TabsContent value="area-calculation" className="mt-6">
          <AreaCalculationsModule projectId={projectId} projectName={projectData?.name || "Project"} />
        </TabsContent>

        <TabsContent value="allowances" className="mt-6">
          <AllowancesLog />
        </TabsContent>

        <TabsContent value="clarifications" className="mt-6">
          <ClarificationsAssumptions />
        </TabsContent>

        <TabsContent value="value-analysis" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Value Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Value engineering and analysis tools will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trade-partners" className="mt-6">
          <TradePartnerLog />
        </TabsContent>
      </Tabs>
    </div>
  )
}

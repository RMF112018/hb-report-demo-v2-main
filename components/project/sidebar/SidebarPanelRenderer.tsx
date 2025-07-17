"use client"

import React from "react"
import ProjectOverviewPanel from "./ProjectOverviewPanel"
import InsightsPanel from "./InsightsPanel"
import QuickActionsPanel from "./QuickActionsPanel"
import KeyMetricsPanel from "./KeyMetricsPanel"
import { EstimateSummaryPanel } from "./EstimateSummaryPanel"

interface SidebarPanelRendererProps {
  activePanel?: string
  projectId: string
  projectData: any
  user: any
  userRole: string
  navigation: any
  projectMetrics: any
  getHBIInsightsTitle: () => string
  getHBIInsights: () => any[]
  activeTab?: string
}

// Contract Documents specific HBI Insights
const getContractDocumentsInsights = () => {
  return [
    {
      id: "contract-1",
      type: "warning",
      severity: "medium",
      title: "Contract Review Required",
      text: "3 contracts show potential for $125K savings through renegotiation",
      action: "Schedule review",
      timestamp: "1 hour ago",
    },
    {
      id: "contract-2",
      type: "success",
      severity: "low",
      title: "Insurance Verification Complete",
      text: "All safety documentation is up to date",
      action: "View certificates",
      timestamp: "3 hours ago",
    },
    {
      id: "contract-3",
      type: "alert",
      severity: "high",
      title: "License Expiration Alert",
      text: "New building code changes affect 5 active contracts",
      action: "Request renewal",
      timestamp: "1 day ago",
    },
    {
      id: "contract-4",
      type: "info",
      severity: "low",
      title: "Cost Optimization Opportunity",
      text: "5 contracts show potential for $125K savings through renegotiation",
      action: "View scorecard",
      timestamp: "2 days ago",
    },
    {
      id: "contract-5",
      type: "warning",
      severity: "medium",
      title: "Risk Alert",
      text: "New building code changes affect 5 active contracts",
      action: "Review risks",
      timestamp: "3 days ago",
    },
    {
      id: "contract-6",
      type: "success",
      severity: "low",
      title: "Compliance Achievement",
      text: "All safety documentation is up to date",
      action: "View compliance",
      timestamp: "1 week ago",
    },
  ]
}

// Contract Documents specific HBI Insights title
const getContractDocumentsInsightsTitle = () => {
  return "HBI Compliance Insights"
}

export default function SidebarPanelRenderer({
  activePanel = "all",
  projectId,
  projectData,
  user,
  userRole,
  navigation,
  projectMetrics,
  getHBIInsightsTitle,
  getHBIInsights,
  activeTab,
}: SidebarPanelRendererProps) {
  // Check if we're in Contract Documents tab and should hide insights panel
  const isContractDocumentsTab = activeTab === "compliance" || activeTab === "contract-documents"

  const currentInsightsTitle = isContractDocumentsTab ? getContractDocumentsInsightsTitle() : getHBIInsightsTitle()
  const currentInsights = isContractDocumentsTab ? getContractDocumentsInsights() : getHBIInsights()

  // Detect if CostSummaryModule is active
  // The CostSummaryModule is active when:
  // 1. We're in the estimating page (navigation.coreTab === "estimating" or we're in the estimate route)
  // 2. The activeTab is "cost-summary"
  // 3. We're in the estimating page route and the cost-summary tab is active
  const isCostSummaryActive =
    activeTab === "cost-summary" ||
    (navigation?.coreTab === "estimating" && activeTab === "cost-summary") ||
    (typeof window !== "undefined" &&
      window.location.pathname.includes("/estimate") &&
      window.location.hash.includes("cost-summary"))

  // Mock data for CostSummaryModule totals - replace with real data from context or props
  const costSummaryData = {
    totalEstimate: 12345678,
    costCategoriesTotal: 9876543,
    generalConditionsTotal: 750000, // Sum of all GC sections
    generalRequirementsTotal: 160000, // Sum of all GR sections
    costPerMonth: 1266223.38, // totalEstimate / 9.75
    projectDuration: 9.75,
  }

  // Render all panels by default (current behavior)
  if (activePanel === "all") {
    return (
      <div className="space-y-4">
        <ProjectOverviewPanel
          projectId={projectId}
          projectData={projectData}
          user={user}
          userRole={userRole}
          projectMetrics={projectMetrics}
        />

        {/* Show EstimateSummaryPanel when CostSummaryModule is active */}
        {isCostSummaryActive && (
          <EstimateSummaryPanel
            totalEstimate={costSummaryData.totalEstimate}
            costCategoriesTotal={costSummaryData.costCategoriesTotal}
            generalConditionsTotal={costSummaryData.generalConditionsTotal}
            generalRequirementsTotal={costSummaryData.generalRequirementsTotal}
            costPerMonth={costSummaryData.costPerMonth}
            projectDuration={costSummaryData.projectDuration}
          />
        )}

        {/* Hide Insights Panel when Contract Documents tab is active */}
        {!isContractDocumentsTab && (
          <InsightsPanel
            projectId={projectId}
            projectData={projectData}
            user={user}
            userRole={userRole}
            activeTab={activeTab}
            getHBIInsightsTitle={() => currentInsightsTitle}
            getHBIInsights={() => currentInsights}
          />
        )}

        <QuickActionsPanel
          projectId={projectId}
          projectData={projectData}
          user={user}
          userRole={userRole}
          navigation={navigation}
          activeTab={activeTab}
        />

        <KeyMetricsPanel
          projectId={projectId}
          projectData={projectData}
          user={user}
          userRole={userRole}
          navigation={navigation}
          projectMetrics={projectMetrics}
        />
      </div>
    )
  }

  // Render individual panels
  switch (activePanel) {
    case "overview":
      return (
        <ProjectOverviewPanel
          projectId={projectId}
          projectData={projectData}
          user={user}
          userRole={userRole}
          projectMetrics={projectMetrics}
        />
      )

    case "estimate-summary":
      if (!isCostSummaryActive) {
        return null
      }
      return (
        <EstimateSummaryPanel
          totalEstimate={costSummaryData.totalEstimate}
          costCategoriesTotal={costSummaryData.costCategoriesTotal}
          generalConditionsTotal={costSummaryData.generalConditionsTotal}
          generalRequirementsTotal={costSummaryData.generalRequirementsTotal}
          costPerMonth={costSummaryData.costPerMonth}
          projectDuration={costSummaryData.projectDuration}
        />
      )

    case "insights":
      // Don't render insights panel if Contract Documents tab is active
      if (isContractDocumentsTab) {
        return null
      }
      return (
        <InsightsPanel
          projectId={projectId}
          projectData={projectData}
          user={user}
          userRole={userRole}
          activeTab={activeTab}
          getHBIInsightsTitle={() => currentInsightsTitle}
          getHBIInsights={() => currentInsights}
        />
      )

    case "quick-actions":
      return (
        <QuickActionsPanel
          projectId={projectId}
          projectData={projectData}
          user={user}
          userRole={userRole}
          navigation={navigation}
          activeTab={activeTab}
        />
      )

    case "key-metrics":
      return (
        <KeyMetricsPanel
          projectId={projectId}
          projectData={projectData}
          user={user}
          userRole={userRole}
          navigation={navigation}
          projectMetrics={projectMetrics}
        />
      )

    default:
      return null
  }
}

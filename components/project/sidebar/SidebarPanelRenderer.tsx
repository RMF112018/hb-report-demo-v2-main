"use client"

import React from "react"
import ProjectOverviewPanel from "./ProjectOverviewPanel"
import InsightsPanel from "./InsightsPanel"
import QuickActionsPanel from "./QuickActionsPanel"
import KeyMetricsPanel from "./KeyMetricsPanel"

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

        <InsightsPanel
          projectId={projectId}
          projectData={projectData}
          user={user}
          userRole={userRole}
          activeTab={activeTab}
          getHBIInsightsTitle={getHBIInsightsTitle}
          getHBIInsights={getHBIInsights}
        />

        <QuickActionsPanel
          projectId={projectId}
          projectData={projectData}
          user={user}
          userRole={userRole}
          navigation={navigation}
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

    case "insights":
      return (
        <InsightsPanel
          projectId={projectId}
          projectData={projectData}
          user={user}
          userRole={userRole}
          activeTab={activeTab}
          getHBIInsightsTitle={getHBIInsightsTitle}
          getHBIInsights={getHBIInsights}
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

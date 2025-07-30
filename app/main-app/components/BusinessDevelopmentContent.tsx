/**
 * @fileoverview Business Development Content Component for Main Application
 * @module BusinessDevelopmentContent
 * @version 3.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Renders business development-specific content with standardized layout:
 * - Breadcrumb navigation
 * - Module title and description
 * - Tab navigation
 * - Two-column layout with detail panels and main content
 */

"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { BusinessDevelopment } from "../../../components/precon/BusinessDevelopment"
import {
  ChevronLeft,
  Target,
  TrendingUp,
  DollarSign,
  Trophy,
  Activity,
  Brain,
  Lightbulb,
  Zap,
  AlertTriangle,
  Plus,
  RefreshCw,
  Eye,
  History,
  BarChart3,
  Award,
  PieChart,
  Maximize2,
  Minimize2,
} from "lucide-react"

interface BusinessDevelopmentContentProps {
  userRole: string
  user: any
  onNavigateBack?: () => void
  activeTab?: string
  onTabChange?: (tabId: string) => void
  renderMode?: "leftContent" | "rightContent"
}

interface TabConfig {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  component: React.ComponentType<any>
  description: string
}

export function BusinessDevelopmentContent({
  userRole,
  user,
  onNavigateBack,
  activeTab = "overview",
  onTabChange,
  renderMode = "rightContent",
}: BusinessDevelopmentContentProps) {
  const router = useRouter()
  const [isFocusMode, setIsFocusMode] = useState(false)

  // Mock data for business development
  const pipelineData = useMemo(
    () => [
      {
        id: "opp-001",
        name: "Healthcare Center Expansion",
        value: 25000000,
        stage: "Proposal",
        probability: 75,
        daysLeft: 12,
        client: "Metro Health Systems",
        contact: "Dr. Sarah Johnson",
        lastActivity: "2024-12-03T14:30:00Z",
      },
      {
        id: "opp-002",
        name: "University Science Building",
        value: 18000000,
        stage: "Qualification",
        probability: 60,
        daysLeft: 8,
        client: "State University",
        contact: "Prof. Michael Chen",
        lastActivity: "2024-12-02T10:15:00Z",
      },
      {
        id: "opp-003",
        name: "Commercial Office Complex",
        value: 32000000,
        stage: "Negotiation",
        probability: 85,
        daysLeft: 5,
        client: "Urban Development Corp",
        contact: "Lisa Rodriguez",
        lastActivity: "2024-12-01T16:45:00Z",
      },
    ],
    []
  )

  const summaryStats = useMemo(
    () => ({
      totalPipelineValue: 150000000,
      probabilityWeightedValue: 85000000,
      winRate: 32.5,
      avgDealSize: 25000000,
      totalOpportunities: 12,
      activeProposals: 5,
      qualifiedLeads: 18,
      conversionRate: 28.5,
    }),
    []
  )

  // Tab configuration
  const tabs: TabConfig[] = [
    {
      id: "overview",
      label: "Overview",
      icon: Target,
      component: BusinessDevelopment,
      description: "Pipeline analysis and key metrics",
    },
    {
      id: "pipeline",
      label: "Pipeline",
      icon: TrendingUp,
      component: BusinessDevelopment,
      description: "Detailed opportunity tracking",
    },
    {
      id: "leads",
      label: "Lead Management",
      icon: Activity,
      component: BusinessDevelopment,
      description: "Lead generation and qualification",
    },
    {
      id: "intelligence",
      label: "Market Intelligence",
      icon: Brain,
      component: BusinessDevelopment,
      description: "Competitive analysis and insights",
    },
  ]

  const currentTab = tabs.find((tab) => tab.id === activeTab) || tabs[0]

  const handleTabChange = (tabId: string) => {
    onTabChange?.(tabId)
  }

  const handleNavigateBack = () => {
    if (onNavigateBack) {
      onNavigateBack()
    } else {
      router.back()
    }
  }

  // Handle focus mode toggle
  const handleFocusToggle = () => {
    setIsFocusMode(!isFocusMode)
  }

  // Render left content (sidebar)
  if (renderMode === "leftContent") {
    return (
      <BusinessDevelopment
        pipelineData={pipelineData}
        summaryStats={summaryStats}
        userRole={userRole}
        user={user}
        onTabChange={handleTabChange}
        renderMode="leftContent"
      />
    )
  }

  // Main content
  const mainContent = (
    <div className="space-y-6">
      {/* Breadcrumb and Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleNavigateBack} className="h-8 w-8 p-0">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="h-4 w-px bg-border" />
          <span className="text-sm text-muted-foreground">Business Development</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleFocusToggle} className="h-8 px-3 text-xs">
            {isFocusMode ? (
              <>
                <Minimize2 className="h-3 w-3 mr-1" />
                Exit Focus
              </>
            ) : (
              <>
                <Maximize2 className="h-3 w-3 mr-1" />
                Focus
              </>
            )}
          </Button>
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Opportunity
          </Button>
        </div>
      </div>

      {/* Module Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
            <Target className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Business Development</h1>
            <p className="text-muted-foreground">Pipeline analysis, lead generation, and market intelligence</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Tab Content */}
        <div className="mt-6">
          {currentTab && (
            <currentTab.component
              pipelineData={pipelineData}
              summaryStats={summaryStats}
              userRole={userRole}
              user={user}
              onTabChange={handleTabChange}
              renderMode="rightContent"
            />
          )}
        </div>
      </Tabs>
    </div>
  )

  // Return focus mode if active
  if (isFocusMode) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-gray-950 flex flex-col z-[200]">
        <div className="flex-1 overflow-auto">
          <div className="p-6 h-full">{mainContent}</div>
        </div>
      </div>
    )
  }

  // Return normal mode
  return mainContent
}

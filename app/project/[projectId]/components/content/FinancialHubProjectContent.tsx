/**
 * @fileoverview Financial Hub Project Content Component
 * @module FinancialHubProjectContent
 * @version 3.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Financial Hub implementation for project page following Core Project Tools pattern:
 * - Tab-based navigation (Overview, Budget Analysis, JCHR, AR Aging, Cash Flow, Forecasting, Change Management, Pay Authorization, Pay Applications, Retention)
 * - Role-based access control
 * - Responsive layout integration
 * - Focus mode support
 * - Responsive tabs that convert to dropdown on mobile
 */

"use client"

import React, { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import {
  BarChart3,
  Calculator,
  CreditCard,
  TrendingUp,
  Calendar,
  Receipt,
  FileText,
  DollarSign,
  GitBranch,
  Percent,
  Banknote,
  Maximize2,
  Minimize2,
  Download,
  Plus,
  RefreshCw,
  Settings,
  Filter,
} from "lucide-react"

// Import Financial Hub Components
import FinancialOverview from "@/components/financial-hub/FinancialOverview"
import BudgetAnalysis from "@/components/financial-hub/BudgetAnalysis"
import BudgetAnalysisProjectContent from "./BudgetAnalysisProjectContent"
import CashFlowAnalysis from "@/components/financial-hub/CashFlowAnalysis"
import { PayApplication } from "@/components/financial-hub/PayApplication"
import ARAgingCard from "@/components/financial-hub/ARAgingCard"
import PayAuthorizations from "@/components/financial-hub/PayAuthorizations"
import JCHRCard from "@/components/financial-hub/JCHRCard"
import ChangeManagement from "@/components/financial-hub/ChangeManagement"
import Forecasting from "@/components/financial-hub/Forecasting"
import RetentionManagement from "@/components/financial-hub/RetentionManagement"

interface FinancialHubProjectContentProps {
  projectId: string
  projectData: any
  userRole: string
  user: any
  activeTab?: string
  onTabChange?: (tabId: string) => void
}

interface FinancialNavigationState {
  financialTab: string | null
}

// Financial Hub tabs configuration
const financialTabsConfig = [
  { id: "overview", label: "Overview", description: "Financial dashboard and key metrics", icon: BarChart3 },
  {
    id: "budget-analysis",
    label: "Budget Analysis",
    description: "Detailed budget tracking and variance analysis",
    icon: Calculator,
  },
  { id: "jchr", label: "JCHR", description: "Job Cost History Report with detailed cost breakdown", icon: Receipt },
  { id: "ar-aging", label: "AR Aging", description: "Accounts receivable aging analysis", icon: CreditCard },
  { id: "cash-flow", label: "Cash Flow", description: "Cash flow management and forecasting", icon: TrendingUp },
  { id: "forecasting", label: "Forecasting", description: "AI-powered financial forecasting", icon: Calendar },
  {
    id: "change-management",
    label: "Change Management",
    description: "Change order tracking and analysis",
    icon: GitBranch,
  },
  {
    id: "pay-authorization",
    label: "Pay Authorization",
    description: "Payment authorization workflow",
    icon: FileText,
  },
  {
    id: "pay-application",
    label: "Pay Applications",
    description: "AIA G702/G703 payment applications",
    icon: Receipt,
  },
  { id: "retention", label: "Retention", description: "Retention tracking and management", icon: Banknote },
]

const FinancialHubProjectContent: React.FC<FinancialHubProjectContentProps> = ({
  projectId,
  projectData,
  userRole,
  user,
  activeTab = "financial-hub",
  onTabChange,
}) => {
  const [navigation, setNavigation] = useState<FinancialNavigationState>({
    financialTab: "overview", // Default to overview tab
  })
  const [mounted, setMounted] = useState(false)
  const [isFocusMode, setIsFocusMode] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false)
  const [isExportDrawerOpen, setIsExportDrawerOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Extract project name from project data
  const projectName = projectData?.name || `Project ${projectId}`

  // Get role-based financial data
  const getFinancialData = () => {
    const baseData = {
      totalContractValue: projectData?.contract_value || 57235491,
      netCashFlow: 8215006.64,
      profitMargin: 6.8,
      pendingApprovals: 3,
      healthScore: 88,
      totalActualCosts: (projectData?.contract_value || 57235491) * 0.68,
      budgetUtilization: 68,
      changeOrderTotal: 864509,
      retentionHeld: (projectData?.contract_value || 57235491) * 0.05,
    }

    return baseData
  }

  const financialData = getFinancialData()

  // All roles now see all tabs for consistent experience
  const getTabsForRole = () => {
    const allTabs = [...financialTabsConfig]

    // All roles now see all tabs (matching project-manager access)
    return allTabs
  }

  const availableTabs = getTabsForRole()

  // Handle financial tab changes
  const handleFinancialTabChange = (tabId: string) => {
    setNavigation((prev) => ({
      ...prev,
      financialTab: tabId,
    }))
    // Don't bubble up sub-tab changes to the main app - only handle internal navigation
    // The main app should maintain "financial-management" as the activeTab
  }

  // Render content based on selected tab
  const renderFinancialTabContent = () => {
    const projectScope = {
      scope: "single",
      projectCount: 1,
      description: `Project View: ${projectName}`,
      projects: [projectName],
      projectId,
    }

    switch (navigation.financialTab) {
      case "overview":
        return (
          <div className="space-y-6 w-full max-w-full">
            <FinancialOverview userRole={userRole} projectData={projectScope} />
          </div>
        )

      case "budget-analysis":
        return (
          <div className="space-y-6 w-full max-w-full" style={{ maxWidth: "100%", width: "100%" }}>
            <BudgetAnalysisProjectContent
              projectId={projectId}
              projectData={projectScope}
              userRole={userRole}
              user={user}
              className="w-full"
            />
          </div>
        )

      case "jchr":
        return (
          <div className="space-y-6 w-full max-w-full">
            <JCHRCard userRole={userRole} projectData={projectScope} />
          </div>
        )

      case "ar-aging":
        return (
          <div className="space-y-6 w-full max-w-full">
            <ARAgingCard userRole={userRole} projectData={projectScope} />
          </div>
        )

      case "cash-flow":
        return (
          <div className="space-y-6 w-full max-w-full">
            <CashFlowAnalysis userRole={userRole} projectData={projectScope} />
          </div>
        )

      case "forecasting":
        return (
          <div className="space-y-6 w-full max-w-full" style={{ maxWidth: "100%", width: "100%" }}>
            <Forecasting userRole={userRole} projectData={projectScope} />
          </div>
        )

      case "change-management":
        return (
          <div className="space-y-6 w-full max-w-full">
            <ChangeManagement userRole={userRole} projectData={projectScope} />
          </div>
        )

      case "pay-authorization":
        return (
          <div className="space-y-6 w-full max-w-full">
            <PayAuthorizations userRole={userRole} projectData={projectScope} />
          </div>
        )

      case "pay-application":
        return (
          <div className="space-y-6 w-full max-w-full">
            <PayApplication userRole={userRole} projectData={projectScope} />
          </div>
        )

      case "retention":
        return (
          <div className="space-y-6 w-full max-w-full">
            <RetentionManagement userRole={userRole} projectData={projectScope} />
          </div>
        )

      default:
        return (
          <div className="space-y-6 w-full max-w-full">
            <FinancialOverview userRole={userRole} projectData={projectScope} />
          </div>
        )
    }
  }

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Handle focus mode toggle
  const handleFocusToggle = () => {
    setIsFocusMode(!isFocusMode)
  }

  // Financial Hub content
  const financialHubContent = (
    <div className="h-full w-full">
      {/* Financial Tabs - Mobile dropdown, Desktop horizontal */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Financial Hub</h1>
            <p className="text-muted-foreground">Comprehensive financial management and analysis for {projectName}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleFocusToggle}
              className={`${
                isFocusMode
                  ? "bg-[#FA4616] text-white border-[#FA4616] hover:bg-[#FA4616]/90"
                  : "text-[#FA4616] border-[#FA4616] hover:bg-[#FA4616]/10"
              }`}
            >
              {isFocusMode ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              {isFocusMode ? "Exit Focus" : "Focus Mode"}
            </Button>
          </div>
        </div>

        {/* Financial Tabs Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {availableTabs.map((tab) => {
            const IconComponent = tab.icon
            const isActive = navigation.financialTab === tab.id
            return (
              <Button
                key={tab.id}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                onClick={() => handleFinancialTabChange(tab.id)}
                className={`
                  flex items-center gap-2 whitespace-nowrap transition-all duration-200
                  ${
                    isActive
                      ? "bg-[#FA4616] text-white hover:bg-[#FA4616]/90 border-[#FA4616]"
                      : "hover:bg-[#FA4616]/10 hover:text-[#FA4616] hover:border-[#FA4616]/30"
                  }
                `}
              >
                <IconComponent className="h-4 w-4" />
                {tab.label}
                {tab.id === "change-management" && (
                  <Badge variant="secondary" className="bg-[#0021A5] text-white text-xs ml-1 border-[#0021A5]">
                    New
                  </Badge>
                )}
              </Button>
            )
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="min-h-96 w-full max-w-full overflow-hidden" style={{ maxWidth: "100%", width: "100%" }}>
        {renderFinancialTabContent()}
      </div>
    </div>
  )

  // Return focus mode if active
  if (isFocusMode) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-gray-950 flex flex-col z-50">
        <div className="flex-1 overflow-auto">
          <div className="p-6 h-full w-full max-w-full">{financialHubContent}</div>
        </div>
      </div>
    )
  }

  // Return the main content
  return (
    <div className="flex-1 p-6 overflow-auto" style={{ maxWidth: "100%", width: "100%" }}>
      <div style={{ maxWidth: "100%", width: "100%" }}>{financialHubContent}</div>
    </div>
  )
}

export default FinancialHubProjectContent

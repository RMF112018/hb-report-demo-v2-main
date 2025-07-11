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
          <div className="space-y-6 w-full max-w-full">
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
          <div className="space-y-6 w-full max-w-full">
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
    <div className="space-y-6 w-full max-w-full overflow-x-auto overflow-y-hidden">
      {/* Module Title with Focus Button */}
      <div className="pb-2 mb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-foreground">Financial Hub</h2>
            <p className="text-sm text-muted-foreground">Comprehensive financial management and analysis suite</p>
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
          </div>
        </div>
      </div>

      {/* Horizontal Navigation Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-10 gap-3">
        {availableTabs.map((tab) => {
          const IconComponent = tab.icon
          const isActive = navigation.financialTab === tab.id

          return (
            <Card
              key={tab.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                isActive ? "border-blue-500 bg-blue-50 dark:bg-blue-950" : "hover:border-gray-300"
              }`}
              onClick={() => handleFinancialTabChange(tab.id)}
            >
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="relative">
                    <IconComponent className={`h-6 w-6 ${isActive ? "text-blue-600" : "text-gray-600"}`} />
                  </div>
                  <div>
                    <p
                      className={`text-xs font-medium ${
                        isActive ? "text-blue-600" : "text-gray-900 dark:text-gray-100"
                      }`}
                    >
                      {tab.label}
                    </p>
                    {!isMobile && (
                      <p className="text-xs text-muted-foreground mt-1 leading-tight line-clamp-2">{tab.description}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Content Area */}
      <div className="min-h-96 w-full max-w-full overflow-x-auto overflow-y-hidden">{renderFinancialTabContent()}</div>
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
  return financialHubContent
}

export default FinancialHubProjectContent

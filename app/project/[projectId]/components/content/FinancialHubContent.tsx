/**
 * @fileoverview Financial Hub Content Component
 * @module FinancialHubContent
 * @version 1.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Extracted and modular Financial Hub content component with comprehensive
 * financial management tools, KPI widgets, and sub-tool routing.
 */

"use client"

import React, { useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
  Building2,
  TrendingUp,
  BarChart3,
  DollarSign,
  CheckCircle,
  Calculator,
  AlertTriangle,
  TrendingDown,
  Calendar,
  Percent,
  CreditCard,
  AlertCircle,
  FileText,
  Receipt,
} from "lucide-react"

// Financial Hub Components
import FinancialOverview from "@/components/financial-hub/FinancialOverview"
import BudgetAnalysis from "@/components/financial-hub/BudgetAnalysis"
import CashFlowAnalysis from "@/components/financial-hub/CashFlowAnalysis"
import { PayApplication } from "@/components/financial-hub/PayApplication"
import ARAgingCard from "@/components/financial-hub/ARAgingCard"
import PayAuthorizations from "@/components/financial-hub/PayAuthorizations"
import JCHRCard from "@/components/financial-hub/JCHRCard"
import ChangeManagement from "@/components/financial-hub/ChangeManagement"
import Forecasting from "@/components/financial-hub/Forecasting"
import RetentionManagement from "@/components/financial-hub/RetentionManagement"

import type { UserRole } from "../../types/project"

/**
 * Props for the FinancialHubContent component
 */
export interface FinancialHubContentProps {
  /** Selected sub-tool within Financial Hub */
  selectedSubTool: string
  /** Project data */
  projectData: any
  /** Current user role */
  userRole: UserRole | string
  /** Additional project context */
  projectId?: string
}

/**
 * Financial data interface
 */
interface FinancialData {
  totalContractValue: number
  netCashFlow: number
  profitMargin: number
  pendingApprovals: number
  healthScore: number
}

/**
 * KPI widget interface
 */
interface FinancialKPI {
  icon: React.ComponentType<{ className?: string }>
  value: string
  label: string
  color: string
}

/**
 * FinancialHubContent component - Comprehensive financial management
 */
export function FinancialHubContent({ selectedSubTool, projectData, userRole, projectId }: FinancialHubContentProps) {
  // Get financial data from project
  const getFinancialData = (): FinancialData => ({
    totalContractValue: projectData?.contract_value || 57235491,
    netCashFlow: 8215006.64,
    profitMargin: 6.8,
    pendingApprovals: 3,
    healthScore: 88,
  })

  const financialData = getFinancialData()

  // Get dynamic KPIs based on selected sub-tool
  const getFinancialKPIs = (subTool: string): FinancialKPI[] => {
    const baseKPIs: FinancialKPI[] = [
      {
        icon: Building2,
        value: `$${financialData.totalContractValue.toLocaleString()}`,
        label: "Contract Value",
        color: "blue",
      },
      {
        icon: TrendingUp,
        value: `${financialData.profitMargin}%`,
        label: "Profit Margin",
        color: "purple",
      },
      {
        icon: BarChart3,
        value: `${financialData.healthScore}%`,
        label: "Financial Health",
        color: "red",
      },
    ]

    const subToolKPIs: Record<string, FinancialKPI[]> = {
      overview: [
        {
          icon: DollarSign,
          value: `$${financialData.netCashFlow.toLocaleString()}`,
          label: "Net Cash Flow",
          color: "green",
        },
        {
          icon: CheckCircle,
          value: financialData.pendingApprovals.toString(),
          label: "Pending Approvals",
          color: "amber",
        },
        {
          icon: Calculator,
          value: "87.3%",
          label: "Budget Used",
          color: "emerald",
        },
      ],
      "budget-analysis": [
        {
          icon: Calculator,
          value: `$${(financialData.totalContractValue * 0.87).toLocaleString()}`,
          label: "Actual Costs",
          color: "green",
        },
        {
          icon: AlertTriangle,
          value: "+2.8%",
          label: "Budget Variance",
          color: "amber",
        },
        {
          icon: TrendingDown,
          value: `$${(financialData.totalContractValue * 0.13).toLocaleString()}`,
          label: "Remaining Budget",
          color: "yellow",
        },
      ],
      "cash-flow": [
        {
          icon: TrendingUp,
          value: `$${(financialData.totalContractValue * 0.72).toLocaleString()}`,
          label: "Total Inflows",
          color: "green",
        },
        {
          icon: TrendingDown,
          value: `$${(financialData.totalContractValue * 0.68).toLocaleString()}`,
          label: "Total Outflows",
          color: "red",
        },
        {
          icon: Calendar,
          value: "45 Days",
          label: "Avg Collection",
          color: "amber",
        },
      ],
      jchr: [
        {
          icon: DollarSign,
          value: `$${(financialData.totalContractValue * 0.78).toLocaleString()}`,
          label: "Total Cost to Date",
          color: "green",
        },
        {
          icon: Calculator,
          value: `$${(financialData.totalContractValue * 0.12).toLocaleString()}`,
          label: "Current Period Spend",
          color: "amber",
        },
        {
          icon: Percent,
          value: "78.1%",
          label: "% Budget Spent",
          color: "indigo",
        },
      ],
      "ar-aging": [
        {
          icon: CreditCard,
          value: `$${(financialData.totalContractValue * 0.15).toLocaleString()}`,
          label: "Total AR",
          color: "blue",
        },
        {
          icon: TrendingUp,
          value: `$${(financialData.totalContractValue * 0.11).toLocaleString()}`,
          label: "Current",
          color: "green",
        },
        {
          icon: AlertCircle,
          value: `$${(financialData.totalContractValue * 0.015).toLocaleString()}`,
          label: "60+ Days",
          color: "red",
        },
      ],
      forecasting: [
        {
          icon: Calendar,
          value: `$${(financialData.totalContractValue * 0.95).toLocaleString()}`,
          label: "Total Forecast",
          color: "blue",
        },
        {
          icon: TrendingUp,
          value: "94.2%",
          label: "HBI Accuracy",
          color: "green",
        },
        {
          icon: AlertTriangle,
          value: `$${(financialData.totalContractValue * 0.05).toLocaleString()}`,
          label: "Forecast Variance",
          color: "amber",
        },
      ],
      "pay-authorization": [
        {
          icon: FileText,
          value: financialData.pendingApprovals.toString(),
          label: "Pending Authorizations",
          color: "amber",
        },
        {
          icon: CheckCircle,
          value: "98.2%",
          label: "Approval Rate",
          color: "green",
        },
        {
          icon: DollarSign,
          value: `$${(financialData.totalContractValue * 0.28).toLocaleString()}`,
          label: "Amount Authorized",
          color: "purple",
        },
      ],
      "pay-application": [
        {
          icon: Receipt,
          value: `$${(2280257.6).toLocaleString()}`,
          label: "Latest Pay App",
          color: "green",
        },
        {
          icon: FileText,
          value: "12",
          label: "Total Applications",
          color: "blue",
        },
        {
          icon: CheckCircle,
          value: "8",
          label: "Approved This Month",
          color: "green",
        },
      ],
      "change-management": [
        {
          icon: FileText,
          value: "15",
          label: "Active Change Orders",
          color: "amber",
        },
        {
          icon: DollarSign,
          value: `$${(financialData.totalContractValue * 0.08).toLocaleString()}`,
          label: "Total Change Value",
          color: "green",
        },
        {
          icon: TrendingUp,
          value: "92.3%",
          label: "Approval Rate",
          color: "green",
        },
      ],
      retention: [
        {
          icon: DollarSign,
          value: `$${(financialData.totalContractValue * 0.05).toLocaleString()}`,
          label: "Total Retention",
          color: "blue",
        },
        {
          icon: Percent,
          value: "5.0%",
          label: "Retention Rate",
          color: "purple",
        },
        {
          icon: Calendar,
          value: "30 Days",
          label: "Release Schedule",
          color: "green",
        },
      ],
    }

    return [...baseKPIs, ...(subToolKPIs[subTool] || [])]
  }

  // Render appropriate content component based on selected sub-tool
  const renderContent = () => {
    const projectScope = {
      scope: "single",
      projectCount: 1,
      description: `Project View: ${projectData?.name || "Project"}`,
      projects: [projectData?.name || "Project"],
      projectId: projectData?.project_id || projectId,
    }

    switch (selectedSubTool) {
      case "overview":
        return <FinancialOverview userRole={userRole} projectData={projectScope} />
      case "budget-analysis":
        return <BudgetAnalysis userRole={userRole} projectData={projectScope} />
      case "jchr":
        return <JCHRCard userRole={userRole} projectData={projectScope} />
      case "ar-aging":
        return <ARAgingCard userRole={userRole} projectData={projectScope} />
      case "cash-flow":
        return <CashFlowAnalysis userRole={userRole} projectData={projectScope} />
      case "forecasting":
        return <Forecasting userRole={userRole} projectData={projectScope} />
      case "change-management":
        return <ChangeManagement userRole={userRole} projectData={projectScope} />
      case "pay-authorization":
        return <PayAuthorizations userRole={userRole} projectData={projectScope} />
      case "pay-application":
        return <PayApplication userRole={userRole} projectData={projectScope} />
      case "retention":
        return <RetentionManagement userRole={userRole} projectData={projectScope} />
      default:
        return <FinancialOverview userRole={userRole} projectData={projectScope} />
    }
  }

  // Memoize KPIs for performance
  const kpis = useMemo(() => getFinancialKPIs(selectedSubTool), [selectedSubTool, financialData])

  return (
    <div className="space-y-6">
      {/* Financial KPI Widgets */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {kpis.map((kpi, index) => {
          const IconComponent = kpi.icon
          const colorClasses = {
            blue: "text-blue-600 dark:text-blue-400",
            green: "text-green-600 dark:text-green-400",
            purple: "text-purple-600 dark:text-purple-400",
            red: "text-red-600 dark:text-red-400",
            amber: "text-amber-600 dark:text-amber-400",
            emerald: "text-emerald-600 dark:text-emerald-400",
            yellow: "text-yellow-600 dark:text-yellow-400",
            indigo: "text-indigo-600 dark:text-indigo-400",
          }

          return (
            <Card key={`${kpi.label}-${index}`} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <IconComponent className={`h-5 w-5 ${colorClasses[kpi.color as keyof typeof colorClasses]} mr-2`} />
                  <span className={`text-2xl font-bold ${colorClasses[kpi.color as keyof typeof colorClasses]}`}>
                    {kpi.value}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">{kpi.label}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Financial Content */}
      <div className="min-h-96">{renderContent()}</div>
    </div>
  )
}

export default FinancialHubContent

/**
 * @fileoverview Financial Hub Content Component
 * @module FinancialHubContent
 * @version 3.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Comprehensive financial management tools and analytics
 * Extracted from page-legacy.tsx and adapted for modular architecture
 */

"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
  Eye,
  Download,
  RefreshCw,
  Settings,
  Filter,
  Plus,
  Search,
  ChevronRight,
  Info,
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
import CostTracking from "@/components/financial-hub/CostTracking"
import Forecasting from "@/components/financial-hub/Forecasting"
import RetentionManagement from "@/components/financial-hub/RetentionManagement"

interface FinancialHubContentProps {
  selectedSubTool: string
  projectData: any
  userRole: string
}

export const FinancialHubContent: React.FC<FinancialHubContentProps> = ({ selectedSubTool, projectData, userRole }) => {
  const getFinancialData = () => ({
    totalContractValue: projectData?.contract_value || 57235491,
    netCashFlow: 8215006.64,
    profitMargin: 6.8,
    pendingApprovals: 3,
    healthScore: 88,
  })

  const financialData = getFinancialData()

  // Get dynamic KPIs based on selected sub-tool
  const getFinancialKPIs = (subTool: string) => {
    const baseKPIs = [
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

    const subToolKPIs: Record<string, any[]> = {
      overview: [
        {
          icon: DollarSign,
          value: `$${financialData.netCashFlow.toLocaleString()}`,
          label: "Net Cash Flow",
          color: "green",
        },
        {
          icon: CheckCircle,
          value: financialData.pendingApprovals,
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
          value: financialData.pendingApprovals,
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
    }

    return [...baseKPIs, ...(subToolKPIs[subTool] || subToolKPIs.overview)]
  }

  const kpis = getFinancialKPIs(selectedSubTool)

  const renderContent = () => {
    if (!selectedSubTool || selectedSubTool === "overview") {
      return <FinancialOverview userRole={userRole} projectData={projectData} />
    }

    switch (selectedSubTool) {
      case "budget-analysis":
        return <BudgetAnalysis userRole={userRole} projectData={projectData} />
      case "cash-flow":
        return <CashFlowAnalysis userRole={userRole} projectData={projectData} />
      case "pay-application":
        return <PayApplication userRole={userRole} projectData={projectData} />
      case "ar-aging":
        return <ARAgingCard userRole={userRole} projectData={projectData} />
      case "pay-authorization":
        return <PayAuthorizations userRole={userRole} projectData={projectData} />
      case "jchr":
        return <JCHRCard userRole={userRole} projectData={projectData} />
      case "change-management":
        return <ChangeManagement userRole={userRole} projectData={projectData} />
      case "cost-tracking":
        return <CostTracking userRole={userRole} projectData={projectData} />
      case "forecasting":
        return <Forecasting userRole={userRole} projectData={projectData} />
      case "retention-management":
        return <RetentionManagement userRole={userRole} projectData={projectData} />
      default:
        return <FinancialOverview userRole={userRole} projectData={projectData} />
    }
  }

  // Define available tabs - all tabs shown to all roles for consistent experience
  const getTabsForRole = () => {
    const allTabs = [
      { id: "overview", label: "Overview", icon: BarChart3 },
      { id: "budget-analysis", label: "Budget Analysis", icon: Calculator },
      { id: "cash-flow", label: "Cash Flow", icon: TrendingUp },
      { id: "pay-application", label: "Pay Application", icon: Receipt },
      { id: "ar-aging", label: "AR Aging", icon: CreditCard },
      { id: "pay-authorization", label: "Pay Authorization", icon: FileText },
      { id: "jchr", label: "JCHR", icon: BarChart3 },
      { id: "change-management", label: "Change Management", icon: AlertTriangle },
      { id: "cost-tracking", label: "Cost Tracking", icon: DollarSign },
      { id: "forecasting", label: "Forecasting", icon: TrendingUp },
      { id: "retention-management", label: "Retention Management", icon: Percent },
    ]

    // All roles now see all tabs (matching project-manager access)
    return allTabs
  }

  const availableTabs = getTabsForRole()
  const activeTab = selectedSubTool || "overview"

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6 lg:grid-cols-11">
          {availableTabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2 text-sm">
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {availableTabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="mt-6">
            <div className="space-y-4">
              {/* Tab-specific KPIs */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {getFinancialKPIs(tab.id).map((kpi, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <kpi.icon className={`h-5 w-5 text-${kpi.color}-600`} />
                        <div>
                          <p className="text-sm font-medium">{kpi.value}</p>
                          <p className="text-xs text-muted-foreground">{kpi.label}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Tab Content */}
              {renderContent()}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

export default FinancialHubContent

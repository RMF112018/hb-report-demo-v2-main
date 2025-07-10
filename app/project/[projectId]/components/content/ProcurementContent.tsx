/**
 * @fileoverview Procurement Content Component
 * @module ProcurementContent
 * @version 3.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Procurement and vendor management tools
 * Extracted from page-legacy.tsx and adapted for modular architecture
 */

"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Package,
  TrendingUp,
  BarChart3,
  Calculator,
  CheckCircle,
  AlertTriangle,
  Clock,
  Building2,
  DollarSign,
  Users,
  FileText,
  Target,
} from "lucide-react"

// Procurement Components
import { ProcurementLogTable } from "@/components/procurement/ProcurementLogTable"
import { ProcurementSyncPanel } from "@/components/procurement/ProcurementSyncPanel"
import { ProcurementStatsPanel } from "@/components/procurement/ProcurementStatsPanel"
import { HbiProcurementInsights } from "@/components/procurement/HbiProcurementInsights"

interface ProcurementContentProps {
  selectedSubTool: string
  projectData: any
  userRole: string
}

export const ProcurementContent: React.FC<ProcurementContentProps> = ({ selectedSubTool, projectData, userRole }) => {
  const getDataScope = () => {
    const totalContractValue = projectData?.contract_value || 2630000
    const activeProcurements = 1
    const avgCycleTime = 28
    const complianceRate = 75
    const vendorCount = 2

    return {
      totalContractValue,
      activeProcurements,
      avgCycleTime,
      complianceRate,
      vendorCount,
    }
  }

  const rawData = getDataScope()

  // Transform data to match component interfaces
  const procurementStats = {
    totalValue: rawData.totalContractValue,
    activeProcurements: rawData.activeProcurements,
    completedProcurements: Math.floor(rawData.activeProcurements * 0.7),
    pendingApprovals: Math.floor(rawData.activeProcurements * 0.15),
    linkedToBidTabs: Math.floor(rawData.activeProcurements * 0.85),
    avgCycleTime: rawData.avgCycleTime,
    complianceRate: rawData.complianceRate,
    totalRecords: rawData.activeProcurements + Math.floor(rawData.activeProcurements * 0.7),
  }

  const procurementRecords = [
    {
      id: "1",
      procore_commitment_id: "PC-001",
      project_id: projectData?.id || "proj-001",
      commitment_title: "Structural Steel Package",
      commitment_number: "CM-001",
      vendor_name: "Steel Dynamics Inc",
      vendor_contact: {
        name: "John Smith",
        email: "john@steel.com",
        phone: "555-123-4567",
      },
      csi_code: "05 12 00",
      csi_description: "Structural Steel Framing",
      contract_type: "subcontract" as const,
      procurement_method: "competitive-bid" as const,
      contract_amount: 1250000,
      budget_amount: 1200000,
      variance: 50000,
      variance_percentage: 4.2,
      status: "active" as const,
      compliance_status: "compliant" as const,
      bonds_required: true,
      insurance_verified: true,
      start_date: "2024-03-01",
      completion_date: "2024-09-15",
      created_at: "2024-01-15T10:00:00Z",
      updated_at: "2024-01-20T14:30:00Z",
      created_by: "john.doe@hbcorp.com",
      bid_tab_link: {
        bid_tab_id: "bt-001",
        csi_match: true,
        description_match: 95,
      },
    },
    {
      id: "2",
      procore_commitment_id: "PC-002",
      project_id: projectData?.id || "proj-001",
      commitment_title: "Concrete Package",
      commitment_number: "CM-002",
      vendor_name: "Concrete Solutions LLC",
      vendor_contact: {
        name: "Sarah Johnson",
        email: "sarah@concrete.com",
        phone: "555-987-6543",
      },
      csi_code: "03 30 00",
      csi_description: "Cast-in-Place Concrete",
      contract_type: "subcontract" as const,
      procurement_method: "competitive-bid" as const,
      contract_amount: 850000,
      budget_amount: 800000,
      variance: 50000,
      variance_percentage: 6.25,
      status: "bidding" as const,
      compliance_status: "warning" as const,
      bonds_required: true,
      insurance_verified: false,
      start_date: "2024-04-01",
      completion_date: "2024-08-30",
      created_at: "2024-01-20T09:00:00Z",
      updated_at: "2024-01-25T16:45:00Z",
      created_by: "jane.smith@hbcorp.com",
      bid_tab_link: null,
    },
  ]

  const dataScopeForSync = () => {
    if (userRole === "executive") {
      return {
        scope: "Enterprise",
        projectCount: 25,
        description: "All active projects across all divisions",
        canSync: true,
      }
    } else if (userRole === "project-executive") {
      return {
        scope: "Portfolio",
        projectCount: 8,
        description: "Projects within your portfolio",
        canSync: true,
      }
    } else {
      return {
        scope: "Single Project",
        projectCount: 1,
        description: "Current project only",
        canSync: false,
      }
    }
  }

  // Use rawData for KPIs display
  const procurementData = rawData

  // Get dynamic KPIs based on selected sub-tool
  const getProcurementKPIs = (subTool: string) => {
    const baseKPIs = [
      {
        icon: DollarSign,
        value: `$${(procurementData.totalContractValue / 1000).toFixed(1)}K`,
        label: "Total Contract Value",
        color: "green",
      },
      {
        icon: Package,
        value: procurementData.activeProcurements,
        label: "Active Procurements",
        color: "blue",
      },
      {
        icon: Clock,
        value: `${procurementData.avgCycleTime} days`,
        label: "Avg Cycle Time",
        color: "purple",
      },
    ]

    const subToolKPIs: Record<string, any[]> = {
      overview: [
        {
          icon: CheckCircle,
          value: `${procurementData.complianceRate}%`,
          label: "Compliance Rate",
          color: "emerald",
        },
        {
          icon: Users,
          value: procurementData.vendorCount,
          label: "Vendor Count",
          color: "indigo",
        },
        {
          icon: TrendingUp,
          value: "+15%",
          label: "Cost Savings",
          color: "green",
        },
      ],
      "vendor-management": [
        {
          icon: Users,
          value: procurementData.vendorCount,
          label: "Active Vendors",
          color: "blue",
        },
        {
          icon: CheckCircle,
          value: `${procurementData.complianceRate}%`,
          label: "Vendor Compliance",
          color: "green",
        },
        {
          icon: Target,
          value: "98%",
          label: "Performance Score",
          color: "purple",
        },
      ],
      "cost-analysis": [
        {
          icon: Calculator,
          value: `$${(procurementData.totalContractValue * 0.85).toLocaleString()}`,
          label: "Actual Costs",
          color: "green",
        },
        {
          icon: AlertTriangle,
          value: "+5.2%",
          label: "Cost Variance",
          color: "amber",
        },
        {
          icon: TrendingUp,
          value: "15%",
          label: "Savings Target",
          color: "emerald",
        },
      ],
    }

    return [...baseKPIs, ...(subToolKPIs[subTool] || [])]
  }

  const renderContent = () => {
    if (!selectedSubTool || selectedSubTool === "overview") {
      return (
        <div className="space-y-6">
          <ProcurementStatsPanel stats={procurementStats} />
          <ProcurementLogTable
            records={procurementRecords}
            onRecordEdit={() => {}}
            onRecordView={() => {}}
            isLoading={false}
            userRole={userRole}
          />
        </div>
      )
    }

    switch (selectedSubTool) {
      case "vendor-management":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Vendor Management</CardTitle>
                <CardDescription>Manage vendor relationships and performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Vendor management tools will be displayed here.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )
      case "cost-analysis":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Cost Analysis</CardTitle>
                <CardDescription>Procurement cost analysis and optimization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Calculator className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Cost analysis tools will be displayed here.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )
      case "sync-panel":
        return (
          <ProcurementSyncPanel
            onSync={() => {}}
            isLoading={false}
            lastSyncTime={new Date()}
            dataScope={dataScopeForSync()}
          />
        )
      case "insights":
        return <HbiProcurementInsights procurementStats={procurementStats} className="" />
      default:
        return (
          <div className="space-y-6">
            <ProcurementStatsPanel stats={procurementStats} />
            <ProcurementLogTable
              records={procurementRecords}
              onRecordEdit={() => {}}
              onRecordView={() => {}}
              isLoading={false}
              userRole={userRole}
            />
          </div>
        )
    }
  }

  // Define available tabs - all tabs shown to all roles for consistent experience
  const getTabsForRole = () => {
    const allTabs = [
      { id: "overview", label: "Overview", icon: BarChart3 },
      { id: "vendor-management", label: "Vendors", icon: Users },
      { id: "cost-analysis", label: "Cost Analysis", icon: Calculator },
      { id: "sync-panel", label: "Sync Panel", icon: FileText },
      { id: "insights", label: "Insights", icon: TrendingUp },
    ]

    // All roles now see all tabs (matching project-manager access)
    return allTabs
  }

  const availableTabs = getTabsForRole()
  const activeTab = selectedSubTool || "overview"

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5">
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
                {getProcurementKPIs(tab.id).map((kpi, index) => (
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

export default ProcurementContent

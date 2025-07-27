"use client"

import React, { useState } from "react"
import Link from "next/link"
import { PageHeader } from "../main-app/components/PageHeader"
import {
  Shield,
  Monitor,
  Laptop,
  AlertTriangle,
  Mail,
  Package,
  Settings,
  Database,
  Brain,
  Users,
  ChevronRight,
} from "lucide-react"

// Import IT placeholder cards
import UserAccessSummaryCard from "@/components/cards/it/UserAccessSummaryCard"
import SystemLogsCard from "@/components/cards/it/SystemLogsCard"
import InfrastructureMonitorCard from "@/components/cards/it/InfrastructureMonitorCard"
import EndpointHealthCard from "@/components/cards/it/EndpointHealthCard"
import SiemLogOverviewCard from "@/components/cards/it/SiemLogOverviewCard"
import EmailSecurityHealthCard from "@/components/cards/it/EmailSecurityHealthCard"
import AssetTrackerCard from "@/components/cards/it/AssetTrackerCard"
import ChangeGovernancePanelCard from "@/components/cards/it/ChangeGovernancePanelCard"
import BackupRestoreStatusCard from "@/components/cards/it/BackupRestoreStatusCard"
import AiPipelineStatusCard from "@/components/cards/it/AiPipelineStatusCard"
import ConsultantDashboardCard from "@/components/cards/it/ConsultantDashboardCard"
import { EnhancedHBIInsights } from "@/components/cards/EnhancedHBIInsights"

// IT Modules configuration matching ProjectSidebar.tsx
const IT_MODULES = [
  {
    id: "ai-pipelines",
    label: "AI Pipelines",
    description: "AI model management and analytics pipeline monitoring",
    icon: Brain,
    path: "/it/command-center/ai-pipelines",
    status: "active",
  },
  {
    id: "assets",
    label: "Asset & License Tracker",
    description: "Hardware inventory and software license management",
    icon: Package,
    path: "/it/command-center/assets",
    status: "active",
  },
  {
    id: "backup",
    label: "Backup & Recovery",
    description: "Backup systems monitoring and disaster recovery",
    icon: Database,
    path: "/it/command-center/backup",
    status: "active",
  },
  {
    id: "consultants",
    label: "Consultants",
    description: "External vendor and consultant management",
    icon: Users,
    path: "/it/command-center/consultants",
    status: "active",
  },
  {
    id: "email",
    label: "Email Security",
    description: "Email security monitoring and threat detection",
    icon: Mail,
    path: "/it/command-center/email",
    status: "active",
  },
  {
    id: "endpoints",
    label: "Endpoint Management",
    description: "Device security and endpoint protection",
    icon: Monitor,
    path: "/it/command-center/endpoints",
    status: "active",
  },
  {
    id: "governance",
    label: "Governance",
    description: "Change management and IT governance processes",
    icon: Settings,
    path: "/it/command-center/governance",
    status: "active",
  },
  {
    id: "infrastructure",
    label: "Infrastructure",
    description: "Network and server infrastructure monitoring",
    icon: Shield,
    path: "/it/command-center/infrastructure",
    status: "active",
  },
  {
    id: "management",
    label: "HB Intel Management",
    description: "User and project management for HB Intel platform",
    icon: Settings,
    path: "/it/command-center/management",
    status: "active",
  },
  {
    id: "siem",
    label: "SIEM & Security",
    description: "Security event monitoring and incident response",
    icon: AlertTriangle,
    path: "/it/command-center/siem",
    status: "active",
  },
]

export default function ITCommandCenterPage() {
  const [activeTab, setActiveTab] = useState("overview")

  // IT Command Center summary AI insights
  const itSummaryInsights = [
    {
      id: "it-summary-1",
      type: "risk",
      severity: "high",
      title: "Critical Infrastructure Vulnerability",
      text: "15 endpoints remain unpatched with critical security vulnerabilities across multiple systems.",
      action: "Initiate emergency patching protocol and implement endpoint isolation procedures.",
      confidence: 96,
      relatedMetrics: ["Endpoint Health", "Security Posture", "Patch Management"],
    },
    {
      id: "it-summary-2",
      type: "alert",
      severity: "high",
      title: "SIEM Event Spike Detected",
      text: "Security event volume increased 340% in last 4 hours, indicating potential coordinated attack.",
      action: "Activate incident response team and initiate comprehensive threat hunting.",
      confidence: 94,
      relatedMetrics: ["SIEM Events", "Threat Detection", "Security Operations"],
    },
    {
      id: "it-summary-3",
      type: "opportunity",
      severity: "medium",
      title: "License Optimization Potential",
      text: "HBI Analysis identifies $127K annual savings through software license rightsizing and consolidation.",
      action: "Review underutilized licenses and negotiate enterprise agreements.",
      confidence: 88,
      relatedMetrics: ["Asset Management", "Cost Optimization", "License Usage"],
    },
    {
      id: "it-summary-4",
      type: "performance",
      severity: "medium",
      title: "Email Security Enhancement",
      text: "Advanced threat protection blocked 2,847 malicious emails, preventing potential breaches.",
      action: "Continue current email security policies and consider user awareness training.",
      confidence: 92,
      relatedMetrics: ["Email Security", "Threat Prevention", "User Protection"],
    },
    {
      id: "it-summary-5",
      type: "forecast",
      severity: "medium",
      title: "Infrastructure Capacity Planning",
      text: "Current growth trends suggest infrastructure capacity constraints within 6 months.",
      action: "Initiate infrastructure expansion planning and budget allocation process.",
      confidence: 85,
      relatedMetrics: ["Infrastructure Health", "Capacity Planning", "Growth Management"],
    },
    {
      id: "it-summary-6",
      type: "risk",
      severity: "medium",
      title: "Backup System Redundancy Gap",
      text: "3 critical systems lack off-site backup redundancy, violating disaster recovery policies.",
      action: "Implement cloud backup solutions and update disaster recovery procedures.",
      confidence: 89,
      relatedMetrics: ["Backup Coverage", "Disaster Recovery", "Business Continuity"],
    },
  ]

  // Create tabs from IT modules
  const tabs = [
    { id: "overview", label: "Overview" },
    ...IT_MODULES.map((module) => ({ id: module.id, label: module.label })),
  ]

  // Render content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="p-6">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-950/30 rounded-lg">
                  <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">IT Command Center</h1>
                  <p className="text-muted-foreground">Comprehensive IT operations and security management</p>
                </div>
              </div>
            </div>

            {/* IT Dashboard Cards Preview Section */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-foreground">Dashboard Cards Preview</h2>
                <div className="text-sm text-muted-foreground">Layout testing for IT dashboard cards</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <div className="h-[300px]">
                  <div className="bg-card border border-border rounded-lg">
                    <div className="p-3 border-b border-border">
                      <h3 className="text-lg font-semibold">HBI IT Summary Insights</h3>
                    </div>
                    <div className="p-0 h-[250px]">
                      <EnhancedHBIInsights config={itSummaryInsights} cardId="it-summary-insights" />
                    </div>
                  </div>
                </div>
                <div className="h-[300px]">
                  <UserAccessSummaryCard />
                </div>
                <div className="h-[300px]">
                  <SystemLogsCard />
                </div>
                <div className="h-[300px]">
                  <InfrastructureMonitorCard />
                </div>
                <div className="h-[300px]">
                  <EndpointHealthCard />
                </div>
                <div className="h-[300px]">
                  <SiemLogOverviewCard />
                </div>
                <div className="h-[300px]">
                  <EmailSecurityHealthCard />
                </div>
                <div className="h-[300px]">
                  <AssetTrackerCard />
                </div>
                <div className="h-[300px]">
                  <ChangeGovernancePanelCard />
                </div>
                <div className="h-[300px]">
                  <BackupRestoreStatusCard />
                </div>
                <div className="h-[300px]">
                  <AiPipelineStatusCard />
                </div>
                <div className="h-[300px]">
                  <ConsultantDashboardCard />
                </div>
              </div>
            </div>

            {/* Module Navigation Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-foreground">Module Navigation</h2>
                <div className="text-sm text-muted-foreground">Access individual IT modules</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {IT_MODULES.map((module) => {
                const IconComponent = module.icon
                return (
                  <Link
                    key={module.path}
                    href={module.path}
                    className="group bg-white dark:bg-gray-900 rounded-lg border border-border p-6 hover:shadow-lg transition-all duration-200 hover:border-primary/50"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-blue-100 dark:bg-blue-950/30 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-900/40 transition-colors">
                        <IconComponent className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {module.label}
                    </h3>
                    <p className="text-sm text-muted-foreground">{module.description}</p>
                  </Link>
                )
              })}
            </div>
          </div>
        )

      case "ai-pipelines":
        return (
          <div className="p-6">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 dark:bg-purple-950/30 rounded-lg">
                  <Brain className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">AI Pipelines</h1>
                  <p className="text-muted-foreground">AI model management and analytics pipeline monitoring</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="h-[300px]">
                <AiPipelineStatusCard />
              </div>
              <div className="h-[300px]">
                <div className="bg-card border border-border rounded-lg h-full p-6">
                  <h3 className="text-lg font-semibold mb-4">AI Pipeline Status</h3>
                  <p className="text-muted-foreground">AI model management and analytics pipeline monitoring</p>
                </div>
              </div>
            </div>
          </div>
        )

      case "assets":
        return (
          <div className="p-6">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 dark:bg-green-950/30 rounded-lg">
                  <Package className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Asset & License Tracker</h1>
                  <p className="text-muted-foreground">Hardware inventory and software license management</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="h-[300px]">
                <AssetTrackerCard />
              </div>
              <div className="h-[300px]">
                <div className="bg-card border border-border rounded-lg h-full p-6">
                  <h3 className="text-lg font-semibold mb-4">Asset Management</h3>
                  <p className="text-muted-foreground">Hardware inventory and software license management</p>
                </div>
              </div>
            </div>
          </div>
        )

      case "backup":
        return (
          <div className="p-6">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-950/30 rounded-lg">
                  <Database className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Backup & Recovery</h1>
                  <p className="text-muted-foreground">Backup systems monitoring and disaster recovery</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="h-[300px]">
                <BackupRestoreStatusCard />
              </div>
              <div className="h-[300px]">
                <div className="bg-card border border-border rounded-lg h-full p-6">
                  <h3 className="text-lg font-semibold mb-4">Backup Systems</h3>
                  <p className="text-muted-foreground">Backup systems monitoring and disaster recovery</p>
                </div>
              </div>
            </div>
          </div>
        )

      case "consultants":
        return (
          <div className="p-6">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-orange-100 dark:bg-orange-950/30 rounded-lg">
                  <Users className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Consultants</h1>
                  <p className="text-muted-foreground">External vendor and consultant management</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="h-[300px]">
                <ConsultantDashboardCard />
              </div>
              <div className="h-[300px]">
                <div className="bg-card border border-border rounded-lg h-full p-6">
                  <h3 className="text-lg font-semibold mb-4">Consultant Management</h3>
                  <p className="text-muted-foreground">External vendor and consultant management</p>
                </div>
              </div>
            </div>
          </div>
        )

      case "email":
        return (
          <div className="p-6">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 dark:bg-red-950/30 rounded-lg">
                  <Mail className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Email Security</h1>
                  <p className="text-muted-foreground">Email security monitoring and threat detection</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="h-[300px]">
                <EmailSecurityHealthCard />
              </div>
              <div className="h-[300px]">
                <div className="bg-card border border-border rounded-lg h-full p-6">
                  <h3 className="text-lg font-semibold mb-4">Email Security</h3>
                  <p className="text-muted-foreground">Email security monitoring and threat detection</p>
                </div>
              </div>
            </div>
          </div>
        )

      case "endpoints":
        return (
          <div className="p-6">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-950/30 rounded-lg">
                  <Monitor className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Endpoint Management</h1>
                  <p className="text-muted-foreground">Device security and endpoint protection</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="h-[300px]">
                <EndpointHealthCard />
              </div>
              <div className="h-[300px]">
                <div className="bg-card border border-border rounded-lg h-full p-6">
                  <h3 className="text-lg font-semibold mb-4">Endpoint Health</h3>
                  <p className="text-muted-foreground">Device security and endpoint protection</p>
                </div>
              </div>
            </div>
          </div>
        )

      case "governance":
        return (
          <div className="p-6">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-950/30 rounded-lg">
                  <Settings className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Governance</h1>
                  <p className="text-muted-foreground">Change management and IT governance processes</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="h-[300px]">
                <ChangeGovernancePanelCard />
              </div>
              <div className="h-[300px]">
                <div className="bg-card border border-border rounded-lg h-full p-6">
                  <h3 className="text-lg font-semibold mb-4">Change Governance</h3>
                  <p className="text-muted-foreground">Change management and IT governance processes</p>
                </div>
              </div>
            </div>
          </div>
        )

      case "infrastructure":
        return (
          <div className="p-6">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-teal-100 dark:bg-teal-950/30 rounded-lg">
                  <Shield className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Infrastructure</h1>
                  <p className="text-muted-foreground">Network and server infrastructure monitoring</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="h-[300px]">
                <InfrastructureMonitorCard />
              </div>
              <div className="h-[300px]">
                <div className="bg-card border border-border rounded-lg h-full p-6">
                  <h3 className="text-lg font-semibold mb-4">Infrastructure Monitor</h3>
                  <p className="text-muted-foreground">Network and server infrastructure monitoring</p>
                </div>
              </div>
            </div>
          </div>
        )

      case "management":
        return (
          <div className="p-6">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gray-100 dark:bg-gray-950/30 rounded-lg">
                  <Settings className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">HB Intel Management</h1>
                  <p className="text-muted-foreground">User and project management for HB Intel platform</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="h-[300px]">
                <UserAccessSummaryCard />
              </div>
              <div className="h-[300px]">
                <div className="bg-card border border-border rounded-lg h-full p-6">
                  <h3 className="text-lg font-semibold mb-4">User Management</h3>
                  <p className="text-muted-foreground">User and project management for HB Intel platform</p>
                </div>
              </div>
            </div>
          </div>
        )

      case "siem":
        return (
          <div className="p-6">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 dark:bg-red-950/30 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">SIEM & Security</h1>
                  <p className="text-muted-foreground">Security event monitoring and incident response</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="h-[300px]">
                <SiemLogOverviewCard />
              </div>
              <div className="h-[300px]">
                <div className="bg-card border border-border rounded-lg h-full p-6">
                  <h3 className="text-lg font-semibold mb-4">SIEM Overview</h3>
                  <p className="text-muted-foreground">Security event monitoring and incident response</p>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return (
          <div className="p-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-foreground">Module Not Found</h2>
              <p className="text-muted-foreground">The requested module is not available.</p>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        userName="Admin User"
        moduleTitle="IT Command Center"
        subHead="Comprehensive IT operations and security management"
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isSticky={true}
      />
      {renderTabContent()}
    </div>
  )
}

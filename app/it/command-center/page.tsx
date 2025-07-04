"use client"

import React from "react"
import Link from "next/link"
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

export default function ITCommandCenterPage() {
  const modules = [
    {
      name: "Infrastructure Monitor",
      path: "/it/command-center/infrastructure",
      icon: Monitor,
      description: "System health and performance monitoring",
    },
    {
      name: "Endpoint & Patch Management",
      path: "/it/command-center/endpoints",
      icon: Laptop,
      description: "Device management and patch deployment",
    },
    {
      name: "SIEM & Event Monitoring",
      path: "/it/command-center/siem",
      icon: AlertTriangle,
      description: "Security information and event management",
    },
    {
      name: "Email Security Health",
      path: "/it/command-center/email",
      icon: Mail,
      description: "Email security and threat monitoring",
    },
    {
      name: "Asset & License Lifecycle",
      path: "/it/command-center/assets",
      icon: Package,
      description: "IT asset and license management",
    },
    {
      name: "Consultant Dashboard",
      path: "/it/command-center/consultants",
      icon: Users,
      description: "Outsourced IT operations tracking and vendor management",
    },
    {
      name: "Change Management & Governance",
      path: "/it/command-center/governance",
      icon: Settings,
      description: "IT governance and change control",
    },
    {
      name: "Backup & DR Command Module",
      path: "/it/command-center/backup",
      icon: Database,
      description: "Backup and disaster recovery operations",
    },
    {
      name: "AI/Analytics Pipeline Control",
      path: "/it/command-center/ai-pipelines",
      icon: Brain,
      description: "AI and analytics pipeline management",
    },
  ]

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
        {modules.map((module) => {
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
                {module.name}
              </h3>
              <p className="text-sm text-muted-foreground">{module.description}</p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

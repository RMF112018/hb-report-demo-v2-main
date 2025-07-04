"use client"

import { useState } from "react"
import {
  Shield,
  FileText,
  Monitor,
  Laptop,
  AlertTriangle,
  Mail,
  Package,
  Settings,
  Database,
  Brain,
  Users,
  Activity,
  X,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface ITCardProps {
  config?: any
  span?: any
  isCompact?: boolean
  userRole?: string
  card?: any
}

// CardShell component for consistent styling
function CardShell({
  title,
  icon,
  children,
  className,
}: {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">{children}</CardContent>
    </Card>
  )
}

export function UserAccessSummaryCard({ config, span, isCompact, userRole, card }: ITCardProps) {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <CardShell title="User Access Summary" icon={<Users className="h-5 w-5" style={{ color: "#FA4616" }} />}>
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">Placeholder content for User Access Summary card</div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">Active Users</div>
            <div className="text-2xl font-bold">156</div>
          </div>
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">Pending Access</div>
            <div className="text-2xl font-bold">8</div>
          </div>
        </div>
        <Badge variant="outline" className="w-fit">
          Placeholder Data
        </Badge>
      </div>
    </CardShell>
  )
}

export function SystemLogsCard({ config, span, isCompact, userRole, card }: ITCardProps) {
  return (
    <CardShell title="System Logs" icon={<FileText className="h-5 w-5" style={{ color: "#FA4616" }} />}>
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">Placeholder content for System Logs card</div>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 bg-muted rounded">
            <span className="text-sm">Recent log entries</span>
            <Badge variant="secondary">24 hrs</Badge>
          </div>
          <div className="flex items-center justify-between p-2 bg-muted rounded">
            <span className="text-sm">Error logs</span>
            <Badge variant="destructive">3</Badge>
          </div>
        </div>
        <Badge variant="outline" className="w-fit">
          Placeholder Data
        </Badge>
      </div>
    </CardShell>
  )
}

export function InfrastructureMonitorCard({ config, span, isCompact, userRole, card }: ITCardProps) {
  return (
    <CardShell title="Infrastructure Monitor" icon={<Monitor className="h-5 w-5" style={{ color: "#FA4616" }} />}>
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">Placeholder content for Infrastructure Monitor card</div>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">99.9%</div>
            <div className="text-xs text-muted-foreground">Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold">24/25</div>
            <div className="text-xs text-muted-foreground">Servers</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">Good</div>
            <div className="text-xs text-muted-foreground">Status</div>
          </div>
        </div>
        <Badge variant="outline" className="w-fit">
          Placeholder Data
        </Badge>
      </div>
    </CardShell>
  )
}

export function EndpointHealthCard({ config, span, isCompact, userRole, card }: ITCardProps) {
  return (
    <CardShell title="Endpoint Health" icon={<Laptop className="h-5 w-5" style={{ color: "#FA4616" }} />}>
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">Placeholder content for Endpoint Health card</div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">Healthy</div>
            <div className="text-2xl font-bold text-green-600">142</div>
          </div>
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">At Risk</div>
            <div className="text-2xl font-bold text-yellow-600">8</div>
          </div>
        </div>
        <Badge variant="outline" className="w-fit">
          Placeholder Data
        </Badge>
      </div>
    </CardShell>
  )
}

export function SiemLogOverviewCard({ config, span, isCompact, userRole, card }: ITCardProps) {
  return (
    <CardShell title="SIEM & Event Monitor" icon={<AlertTriangle className="h-5 w-5" style={{ color: "#FA4616" }} />}>
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">Placeholder content for SIEM & Event Monitor card</div>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 bg-muted rounded">
            <span className="text-sm">Security events</span>
            <Badge variant="secondary">12</Badge>
          </div>
          <div className="flex items-center justify-between p-2 bg-muted rounded">
            <span className="text-sm">High priority</span>
            <Badge variant="destructive">2</Badge>
          </div>
        </div>
        <Badge variant="outline" className="w-fit">
          Placeholder Data
        </Badge>
      </div>
    </CardShell>
  )
}

export function EmailSecurityHealthCard({ config, span, isCompact, userRole, card }: ITCardProps) {
  return (
    <CardShell title="Email Security Health" icon={<Mail className="h-5 w-5" style={{ color: "#FA4616" }} />}>
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">Placeholder content for Email Security Health card</div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">Blocked</div>
            <div className="text-2xl font-bold text-red-600">23</div>
          </div>
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">Quarantined</div>
            <div className="text-2xl font-bold text-yellow-600">5</div>
          </div>
        </div>
        <Badge variant="outline" className="w-fit">
          Placeholder Data
        </Badge>
      </div>
    </CardShell>
  )
}

export function AssetTrackerCard({ config, span, isCompact, userRole, card }: ITCardProps) {
  return (
    <CardShell title="Asset & License Tracker" icon={<Package className="h-5 w-5" style={{ color: "#FA4616" }} />}>
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">Placeholder content for Asset & License Tracker card</div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">Total Assets</div>
            <div className="text-2xl font-bold">324</div>
          </div>
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">Expiring Soon</div>
            <div className="text-2xl font-bold text-yellow-600">12</div>
          </div>
        </div>
        <Badge variant="outline" className="w-fit">
          Placeholder Data
        </Badge>
      </div>
    </CardShell>
  )
}

export function ChangeGovernancePanelCard({ config, span, isCompact, userRole, card }: ITCardProps) {
  return (
    <CardShell
      title="Change Management & Governance"
      icon={<Settings className="h-5 w-5" style={{ color: "#FA4616" }} />}
    >
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">Placeholder content for Change Management & Governance card</div>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-lg font-bold">7</div>
            <div className="text-xs text-muted-foreground">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold">12</div>
            <div className="text-xs text-muted-foreground">Approved</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold">3</div>
            <div className="text-xs text-muted-foreground">In Progress</div>
          </div>
        </div>
        <Badge variant="outline" className="w-fit">
          Placeholder Data
        </Badge>
      </div>
    </CardShell>
  )
}

export function BackupRestoreStatusCard({ config, span, isCompact, userRole, card }: ITCardProps) {
  return (
    <CardShell title="Backup & DR Status" icon={<Database className="h-5 w-5" style={{ color: "#FA4616" }} />}>
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">Placeholder content for Backup & DR Status card</div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">Last Backup</div>
            <div className="text-sm font-bold text-green-600">2 hours ago</div>
          </div>
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">Success Rate</div>
            <div className="text-sm font-bold text-green-600">99.8%</div>
          </div>
        </div>
        <Badge variant="outline" className="w-fit">
          Placeholder Data
        </Badge>
      </div>
    </CardShell>
  )
}

export function AiPipelineStatusCard({ config, span, isCompact, userRole, card }: ITCardProps) {
  return (
    <CardShell title="AI Pipeline Status" icon={<Brain className="h-5 w-5" style={{ color: "#FA4616" }} />}>
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">Placeholder content for AI Pipeline Status card</div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">Active Jobs</div>
            <div className="text-2xl font-bold">4</div>
          </div>
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">Queue Length</div>
            <div className="text-2xl font-bold">12</div>
          </div>
        </div>
        <Badge variant="outline" className="w-fit">
          Placeholder Data
        </Badge>
      </div>
    </CardShell>
  )
}

export function ConsultantDashboardCard({ config, span, isCompact, userRole, card }: ITCardProps) {
  return (
    <CardShell title="Consultant Dashboard" icon={<Users className="h-5 w-5" style={{ color: "#FA4616" }} />}>
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">Placeholder content for Consultant Dashboard card</div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">Active Contracts</div>
            <div className="text-2xl font-bold">8</div>
          </div>
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">Pending Reviews</div>
            <div className="text-2xl font-bold text-yellow-600">3</div>
          </div>
        </div>
        <Badge variant="outline" className="w-fit">
          Placeholder Data
        </Badge>
      </div>
    </CardShell>
  )
}

export function HbIntelManagementCard({ config, span, isCompact, userRole, card }: ITCardProps) {
  return (
    <CardShell title="HB Intel Management" icon={<Settings className="h-5 w-5" style={{ color: "#FA4616" }} />}>
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">Centralized admin hub for HB Intel application controls</div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">Active Users</div>
            <div className="text-2xl font-bold">267</div>
          </div>
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">AI Models</div>
            <div className="text-2xl font-bold">3</div>
          </div>
        </div>
        <Badge variant="outline" className="w-fit">
          Placeholder Data
        </Badge>
      </div>
    </CardShell>
  )
}

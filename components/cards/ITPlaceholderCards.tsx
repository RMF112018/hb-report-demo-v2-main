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
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { CustomBarChart } from "@/components/charts/BarChart"
import { AreaChart } from "@/components/charts/AreaChart"
import { KPIWidget } from "@/components/charts/KPIWidget"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts"

interface ITCardProps {
  config?: any
  span?: any
  isCompact?: boolean
  userRole?: string
  card?: any
}

// Chart color constants
const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
]

// Simple Pie Chart Component without Card wrapper
const SimplePieChart = ({ data, title }: { data: any[]; title?: string }) => (
  <div className="h-full w-full">
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" outerRadius={40} dataKey="value">
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </div>
)

// Simple Line Chart Component without Card wrapper
const SimpleLineChart = ({ data, color = "hsl(var(--chart-2))" }: { data: any[]; color?: string }) => (
  <div className="h-full w-full">
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.3} vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: color }}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  </div>
)

export function UserAccessSummaryCard({ config, span, isCompact, userRole, card }: ITCardProps) {
  const [showDetails, setShowDetails] = useState(false)

  const userTypeData = [
    { name: "Employees", value: 126 },
    { name: "Contractors", value: 22 },
    { name: "Admins", value: 8 },
  ]

  return (
    <div className="h-full flex flex-col">
      <div className="text-sm text-muted-foreground mb-4">User authentication and access control status</div>
      <div className="flex-1 grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <KPIWidget
            label="Active Users"
            value={156}
            performance="good"
            compact={true}
            caption="+8 this week"
            trend="up"
          />
          <KPIWidget label="Pending Access" value={8} performance="warning" compact={true} caption="Need approval" />
        </div>
        <div className="h-24">
          <SimplePieChart data={userTypeData} />
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-border">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">MFA Enabled</span>
          <span className="text-sm font-medium text-green-600">94%</span>
        </div>
      </div>
    </div>
  )
}

export function SystemLogsCard({ config, span, isCompact, userRole, card }: ITCardProps) {
  const logTrendData = [
    { name: "00:00", value: 245 },
    { name: "04:00", value: 189 },
    { name: "08:00", value: 412 },
    { name: "12:00", value: 387 },
    { name: "16:00", value: 456 },
    { name: "20:00", value: 298 },
  ]

  return (
    <div className="h-full flex flex-col">
      <div className="text-sm text-muted-foreground mb-4">System activity and error monitoring dashboard</div>
      <div className="flex-1 space-y-3">
        <div className="h-20">
          <SimpleLineChart data={logTrendData} color="hsl(var(--chart-2))" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <KPIWidget label="Info" value="1.2K" performance="good" compact={true} />
          <KPIWidget label="Warnings" value={89} performance="warning" compact={true} />
          <KPIWidget label="Errors" value={3} performance="bad" compact={true} />
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-border">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Log Retention</span>
          <span className="text-sm font-medium">90 days</span>
        </div>
      </div>
    </div>
  )
}

export function InfrastructureMonitorCard({ config, span, isCompact, userRole, card }: ITCardProps) {
  const performanceData = [
    { name: "CPU", value: 23 },
    { name: "Memory", value: 45 },
    { name: "Storage", value: 68 },
    { name: "Network", value: 12 },
  ]

  return (
    <div className="h-full flex flex-col">
      <div className="text-sm text-muted-foreground mb-4">Real-time infrastructure monitoring and system health</div>
      <div className="flex-1 space-y-3">
        <div className="grid grid-cols-3 gap-2">
          <KPIWidget label="Uptime" value="99.9%" performance="good" compact={true} caption="30 days" />
          <KPIWidget label="Servers" value="24/25" performance="good" compact={true} caption="Online" />
          <KPIWidget label="Status" value="Good" performance="good" compact={true} />
        </div>
        <div className="h-16">
          <CustomBarChart
            data={performanceData}
            compact={true}
            showValues={false}
            color="hsl(var(--chart-1))"
            height={64}
          />
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-border">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Last Check</span>
          <span className="text-sm font-medium">2 minutes ago</span>
        </div>
      </div>
    </div>
  )
}

export function EndpointHealthCard({ config, span, isCompact, userRole, card }: ITCardProps) {
  const deviceStatusData = [
    { name: "Healthy", value: 142 },
    { name: "At Risk", value: 8 },
  ]

  return (
    <div className="h-full flex flex-col">
      <div className="text-sm text-muted-foreground mb-4">Device security and endpoint protection status</div>
      <div className="flex-1 grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <KPIWidget label="Healthy" value={142} performance="good" compact={true} caption="Protected" />
          <KPIWidget label="At Risk" value={8} performance="warning" compact={true} caption="Need attention" />
        </div>
        <div className="h-24">
          <SimplePieChart data={deviceStatusData} />
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-border">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Last Scan</span>
          <span className="text-sm font-medium text-green-600">5 min ago</span>
        </div>
      </div>
    </div>
  )
}

export function SiemLogOverviewCard({ config, span, isCompact, userRole, card }: ITCardProps) {
  const threatTrendData = [
    { name: "00:00", value: 23 },
    { name: "04:00", value: 18 },
    { name: "08:00", value: 31 },
    { name: "12:00", value: 25 },
    { name: "16:00", value: 19 },
    { name: "20:00", value: 15 },
  ]

  return (
    <div className="h-full flex flex-col">
      <div className="text-sm text-muted-foreground mb-4">Security information and event monitoring dashboard</div>
      <div className="flex-1 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <KPIWidget label="Critical" value={3} performance="bad" compact={true} caption="Immediate action" />
          <KPIWidget label="Warnings" value={12} performance="warning" compact={true} caption="Monitor closely" />
        </div>
        <div className="h-16">
          <AreaChart data={threatTrendData} compact={true} showGrid={false} color="hsl(var(--chart-5))" height={64} />
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-border">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Events Today</span>
          <span className="text-sm font-medium">847</span>
        </div>
      </div>
    </div>
  )
}

export function EmailSecurityHealthCard({ config, span, isCompact, userRole, card }: ITCardProps) {
  const emailTrendData = [
    { name: "Mon", value: 2341 },
    { name: "Tue", value: 2187 },
    { name: "Wed", value: 2456 },
    { name: "Thu", value: 2298 },
    { name: "Fri", value: 2134 },
    { name: "Sat", value: 1876 },
    { name: "Sun", value: 1654 },
  ]

  return (
    <div className="h-full flex flex-col">
      <div className="text-sm text-muted-foreground mb-4">Email security and threat protection monitoring</div>
      <div className="flex-1 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <KPIWidget label="Clean Rate" value="99.2%" performance="good" compact={true} caption="Delivered" />
          <KPIWidget label="Blocked" value={23} performance="good" compact={true} caption="Threats stopped" />
        </div>
        <div className="h-16">
          <AreaChart data={emailTrendData} compact={true} showGrid={false} color="hsl(var(--chart-3))" height={64} />
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-border">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Last Scan</span>
          <span className="text-sm font-medium text-green-600">Real-time</span>
        </div>
      </div>
    </div>
  )
}

export function AssetTrackerCard({ config, span, isCompact, userRole, card }: ITCardProps) {
  const assetCategoryData = [
    { name: "Hardware", value: 198 },
    { name: "Software", value: 144 },
  ]

  return (
    <div className="h-full flex flex-col">
      <div className="text-sm text-muted-foreground mb-4">Hardware and software asset management overview</div>
      <div className="flex-1 space-y-3">
        <div className="grid grid-cols-3 gap-2">
          <KPIWidget label="Assets" value={342} performance="good" compact={true} caption="Total managed" />
          <KPIWidget label="Compliant" value="98%" performance="good" compact={true} caption="License status" />
          <KPIWidget label="Expiring" value={14} performance="warning" compact={true} caption="30 days" />
        </div>
        <div className="h-12">
          <CustomBarChart
            data={assetCategoryData}
            compact={true}
            showValues={true}
            color="hsl(var(--chart-4))"
            height={48}
          />
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-border">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Last Update</span>
          <span className="text-sm font-medium">1 hour ago</span>
        </div>
      </div>
    </div>
  )
}

export function ChangeGovernancePanelCard({ config, span, isCompact, userRole, card }: ITCardProps) {
  const changeStatusData = [
    { name: "Pending", value: 8 },
    { name: "Approved", value: 23 },
    { name: "In Progress", value: 5 },
    { name: "Completed", value: 47 },
  ]

  return (
    <div className="h-full flex flex-col">
      <div className="text-sm text-muted-foreground mb-4">IT change management and governance tracking dashboard</div>
      <div className="flex-1 space-y-3">
        <div className="grid grid-cols-4 gap-3">
          <KPIWidget label="Pending" value={8} performance="warning" compact={true} caption="Changes" />
          <KPIWidget label="Approved" value={23} performance="good" compact={true} caption="This month" />
          <KPIWidget label="In Progress" value={5} performance="ok" compact={true} caption="Active" />
          <KPIWidget label="Success Rate" value="94%" performance="good" compact={true} caption="Overall" />
        </div>
        <div className="h-12">
          <CustomBarChart
            data={changeStatusData}
            compact={true}
            showValues={true}
            colors={["hsl(var(--chart-4))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-1))"]}
            height={48}
          />
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-border">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Next CAB Meeting</span>
          <span className="text-sm font-medium">Jan 15, 2024</span>
        </div>
      </div>
    </div>
  )
}

export function BackupRestoreStatusCard({ config, span, isCompact, userRole, card }: ITCardProps) {
  const backupTrendData = [
    { name: "Week 1", value: 100 },
    { name: "Week 2", value: 98 },
    { name: "Week 3", value: 100 },
    { name: "Week 4", value: 100 },
  ]

  return (
    <div className="h-full flex flex-col">
      <div className="text-sm text-muted-foreground mb-4">Backup operations and disaster recovery status</div>
      <div className="flex-1 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <KPIWidget label="Success Rate" value="100%" performance="good" compact={true} caption="Last backup" />
          <KPIWidget label="Data Backed Up" value="2.3TB" performance="good" compact={true} caption="Total size" />
        </div>
        <div className="h-16">
          <SimpleLineChart data={backupTrendData} color="hsl(var(--chart-2))" />
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-border">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Next Backup</span>
          <span className="text-sm font-medium text-green-600">Tonight 2:00 AM</span>
        </div>
      </div>
    </div>
  )
}

export function AiPipelineStatusCard({ config, span, isCompact, userRole, card }: ITCardProps) {
  const gpuUtilizationData = [
    { name: "00:00", value: 45 },
    { name: "06:00", value: 67 },
    { name: "12:00", value: 78 },
    { name: "18:00", value: 82 },
    { name: "24:00", value: 74 },
  ]

  return (
    <div className="h-full flex flex-col">
      <div className="text-sm text-muted-foreground mb-4">AI and machine learning pipeline monitoring</div>
      <div className="flex-1 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <KPIWidget label="Active Models" value={4} performance="good" compact={true} caption="ML models" />
          <KPIWidget label="Queued Jobs" value={12} performance="ok" compact={true} caption="Processing" />
        </div>
        <div className="h-16">
          <AreaChart
            data={gpuUtilizationData}
            compact={true}
            showGrid={false}
            color="hsl(var(--chart-5))"
            height={64}
          />
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-border">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">GPU Utilization</span>
          <span className="text-sm font-medium text-purple-600">78%</span>
        </div>
      </div>
    </div>
  )
}

export function ConsultantDashboardCard({ config, span, isCompact, userRole, card }: ITCardProps) {
  const consultantActivityData = [
    { name: "Active", value: 7 },
    { name: "Inactive", value: 2 },
  ]

  return (
    <div className="h-full flex flex-col">
      <div className="text-sm text-muted-foreground mb-4">External consultant access and activity monitoring</div>
      <div className="flex-1 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <KPIWidget label="Active" value={7} performance="good" compact={true} caption="Consultants" />
          <KPIWidget label="Projects" value={3} performance="good" compact={true} caption="Active" />
        </div>
        <div className="h-16">
          <SimplePieChart data={consultantActivityData} />
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-border">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Compliance</span>
          <span className="text-sm font-medium text-green-600">100%</span>
        </div>
      </div>
    </div>
  )
}

export function HbIntelManagementCard({ config, span, isCompact, userRole, card }: ITCardProps) {
  const userGrowthData = [
    { name: "Week 1", value: 234 },
    { name: "Week 2", value: 248 },
    { name: "Week 3", value: 256 },
    { name: "Week 4", value: 267 },
  ]

  return (
    <div className="h-full flex flex-col">
      <div className="text-sm text-muted-foreground mb-4">HB Intelligence systems and user management hub</div>
      <div className="flex-1 space-y-3">
        <div className="grid grid-cols-3 gap-3">
          <KPIWidget label="Users" value={156} performance="good" compact={true} caption="Active" />
          <KPIWidget label="AI Models" value={8} performance="good" compact={true} caption="Deployed" />
          <KPIWidget label="Uptime" value="99.8%" performance="good" compact={true} caption="30 days" />
        </div>
        <div className="h-16">
          <SimpleLineChart data={userGrowthData} color="hsl(var(--chart-1))" />
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-border">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">System Health</span>
          <span className="text-sm font-medium text-green-600">Excellent</span>
        </div>
      </div>
    </div>
  )
}

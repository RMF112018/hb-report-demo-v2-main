"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  FunnelChart,
  Funnel,
  LabelList,
} from "recharts"
import {
  Package,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle,
  Users,
  Building2,
  Calendar,
  FileText,
  ArrowUpRight,
  Zap,
  RefreshCw,
  Eye,
  Plus,
  BarChart3,
  Brain,
  Target,
  Award,
  Shield,
  Monitor,
  Database,
  ExternalLink,
  Play,
  Pause,
  Settings,
  Download,
  Share2,
  Maximize2,
  Filter,
  MoreHorizontal,
} from "lucide-react"

interface ProcurementMetrics {
  totalValue: number
  activeRecords: number
  pendingApprovals: number
  completionRate: number
  averageCycleTime: number
  vendorCount: number
  complianceRate: number
  costSavings: number
  savingsPercent: number
  procoreSyncStatus: "synced" | "pending" | "error"
  lastSyncDate: string
}

interface RecentActivity {
  id: string
  type: string
  title: string
  description: string
  timestamp: string
  status: string
  procoreId?: string
}

interface ProcurementOverviewWidgetProps {
  projectId?: string
  onViewAll?: () => void
  onSyncProcore?: () => void
  onNewRecord?: () => void
  compactMode?: boolean
}

export function ProcurementOverviewWidget({
  projectId,
  onViewAll,
  onSyncProcore,
  onNewRecord,
  compactMode = false,
}: ProcurementOverviewWidgetProps) {
  const [metrics, setMetrics] = useState<ProcurementMetrics | null>(null)
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(false) // Changed from true to false
  const [syncing, setSyncing] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    // Load data immediately without artificial delay
    const loadData = () => {
      // Mock procurement metrics
      const mockMetrics: ProcurementMetrics = {
        totalValue: 12450000,
        activeRecords: 24,
        pendingApprovals: 8,
        completionRate: 68,
        averageCycleTime: 14,
        vendorCount: 18,
        complianceRate: 95,
        costSavings: 745000,
        savingsPercent: 6.4,
        procoreSyncStatus: "synced",
        lastSyncDate: "2024-12-20T10:30:00Z",
      }

      const mockActivity: RecentActivity[] = [
        {
          id: "act-001",
          type: "approval",
          title: "Structural Steel PO Approved",
          description: "ABC Steel Works - $2.65M commitment approved",
          timestamp: "2024-12-20T09:30:00Z",
          status: "success",
          procoreId: "PCR-2024-001",
        },
        {
          id: "act-002",
          type: "sync",
          title: "Procore Sync Completed",
          description: "12 commitments synchronized successfully",
          timestamp: "2024-12-20T08:45:00Z",
          status: "success",
        },
        {
          id: "act-003",
          type: "execution",
          title: "MEP Contract Executed",
          description: "Advanced MEP Solutions - Contract signed",
          timestamp: "2024-12-20T08:15:00Z",
          status: "info",
          procoreId: "PCR-2024-002",
        },
        {
          id: "act-004",
          type: "change_order",
          title: "Change Order #3 Submitted",
          description: "Concrete package - Additional reinforcement",
          timestamp: "2024-12-19T16:22:00Z",
          status: "warning",
          procoreId: "PCR-2024-003",
        },
        {
          id: "act-005",
          type: "completion",
          title: "Finishes Package Updated",
          description: "Progress updated to 85% complete",
          timestamp: "2024-12-19T14:30:00Z",
          status: "info",
          procoreId: "PCR-2024-004",
        },
      ]

      setMetrics(mockMetrics)
      setRecentActivity(mockActivity)
    }

    // Load data immediately
    loadData()
  }, [projectId])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      return "Just now"
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`
    } else if (diffInHours < 48) {
      return "1 day ago"
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
      })
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "approval":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "execution":
        return <FileText className="h-4 w-4 text-blue-500" />
      case "sync":
        return <Zap className="h-4 w-4 text-purple-500" />
      case "completion":
        return <Activity className="h-4 w-4 text-indigo-500" />
      case "change_order":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      default:
        return <Package className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      case "error":
        return "bg-red-100 text-red-800"
      case "info":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getSyncStatusBadge = (syncStatus: string) => {
    const syncConfig: { [key: string]: { color: string; label: string; icon: React.ReactNode } } = {
      synced: {
        color: "bg-green-100 text-green-800 border-green-200",
        label: "Synced",
        icon: <CheckCircle className="h-3 w-3" />,
      },
      pending: {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        label: "Pending",
        icon: <Clock className="h-3 w-3" />,
      },
      error: {
        color: "bg-red-100 text-red-800 border-red-200",
        label: "Error",
        icon: <AlertTriangle className="h-3 w-3" />,
      },
    }
    const config = syncConfig[syncStatus] || syncConfig.pending
    return (
      <Badge variant="outline" className={config.color}>
        {config.icon}
        <span className="ml-1">{config.label}</span>
      </Badge>
    )
  }

  const handleSync = async () => {
    setSyncing(true)
    // Simulate Procore sync
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setSyncing(false)
    if (onSyncProcore) onSyncProcore()
  }

  // Mock data for Power BI charts
  const procurementData = {
    monthlyTrends: [
      { month: "Jan", value: 2.1, budget: 2.5, savings: 0.4 },
      { month: "Feb", value: 2.8, budget: 3.0, savings: 0.2 },
      { month: "Mar", value: 3.2, budget: 3.2, savings: 0.0 },
      { month: "Apr", value: 2.9, budget: 3.5, savings: 0.6 },
      { month: "May", value: 3.5, budget: 3.8, savings: 0.3 },
      { month: "Jun", value: 3.8, budget: 4.0, savings: 0.2 },
    ],
    categoryDistribution: [
      { name: "Structural", value: 35, amount: 4.3, color: "#FF6B35" },
      { name: "MEP", value: 28, amount: 3.4, color: "#4F46E5" },
      { name: "Finishes", value: 18, amount: 2.2, color: "#10B981" },
      { name: "Site Work", value: 12, amount: 1.5, color: "#F59E0B" },
      { name: "Specialty", value: 7, amount: 0.9, color: "#EF4444" },
    ],
    vendorPerformance: [
      { name: "ABC Steel", rating: 4.8, projects: 3, onTime: 95, satisfaction: 4.9 },
      { name: "Advanced MEP", rating: 4.6, projects: 2, onTime: 92, satisfaction: 4.7 },
      { name: "Elite Concrete", rating: 4.4, projects: 4, onTime: 88, satisfaction: 4.5 },
      { name: "Perfect Finishes", rating: 4.2, projects: 2, onTime: 90, satisfaction: 4.3 },
      { name: "Pro Construction", rating: 4.0, projects: 3, onTime: 85, satisfaction: 4.1 },
    ],
    statusBreakdown: [
      { status: "Executed", value: 15, color: "#10B981" },
      { status: "Pending", value: 8, color: "#F59E0B" },
      { status: "Draft", value: 3, color: "#6B7280" },
      { status: "Complete", value: 12, color: "#3B82F6" },
    ],
    savingsAnalysis: [
      { category: "Material Costs", savings: 320000, target: 250000, percentage: 128 },
      { category: "Labor Efficiency", savings: 180000, target: 150000, percentage: 120 },
      { category: "Bulk Purchasing", savings: 145000, target: 100000, percentage: 145 },
      { category: "Vendor Negotiation", savings: 100000, target: 80000, percentage: 125 },
    ],
  }

  // Only show loading if we don't have metrics data yet
  if (!metrics) {
    return (
      <div className="space-y-6">
        {/* KPI Cards Loading */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                  <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
                <div className="space-y-2">
                  <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="w-32 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="w-20 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Loading */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="w-48 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="flex gap-2">
                    <div className="w-20 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] bg-gray-200 dark:bg-gray-700 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">+6.4%</Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">Total Value</p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {formatCurrency(metrics.totalValue)}
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Active commitments</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-200 dark:border-green-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <Target className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <Badge className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                {metrics.savingsPercent}%
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-1">Cost Savings</p>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                {formatCurrency(metrics.costSavings)}
              </p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">Below budget target</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950 dark:to-violet-950 border-purple-200 dark:border-purple-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Package className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <Badge className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
                {metrics.completionRate}%
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-1">Completion Rate</p>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{metrics.activeRecords}</p>
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">Active records</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950 dark:to-amber-950 border-orange-200 dark:border-orange-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <Users className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <Badge className="bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300">
                {metrics.vendorCount}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-orange-600 dark:text-orange-400 mb-1">Vendor Count</p>
              <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">{metrics.averageCycleTime} days</p>
              <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">Avg cycle time</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Power BI Charts - Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends Chart */}
        <Card className="border-border bg-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-foreground">
                <BarChart3 className="h-5 w-5 text-[#FF6B35]" />
                Monthly Procurement Trends
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                >
                  <Database className="h-3 w-3 mr-1" />
                  Power BI
                </Badge>
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={procurementData.monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                    color: "hsl(var(--foreground))",
                  }}
                />
                <Legend />
                <Bar dataKey="value" fill="#FF6B35" radius={[4, 4, 0, 0]} />
                <Line type="monotone" dataKey="budget" stroke="#4F46E5" strokeWidth={2} />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card className="border-border bg-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-foreground">
                <PieChart className="h-5 w-5 text-[#FF6B35]" />
                Category Distribution
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                >
                  <Database className="h-3 w-3 mr-1" />
                  Power BI
                </Badge>
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={procurementData.categoryDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {procurementData.categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                    color: "hsl(var(--foreground))",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Power BI Charts - Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vendor Performance Radar */}
        <Card className="border-border bg-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-foreground">
                <RadarChart className="h-5 w-5 text-[#FF6B35]" />
                Vendor Performance Analysis
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                >
                  <Database className="h-3 w-3 mr-1" />
                  Power BI
                </Badge>
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={procurementData.vendorPerformance}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <PolarRadiusAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <Radar dataKey="rating" stroke="#FF6B35" fill="#FF6B35" fillOpacity={0.6} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                    color: "hsl(var(--foreground))",
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Savings Analysis */}
        <Card className="border-border bg-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-foreground">
                <TrendingUp className="h-5 w-5 text-[#FF6B35]" />
                Savings Analysis
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                >
                  <Database className="h-3 w-3 mr-1" />
                  Power BI
                </Badge>
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={procurementData.savingsAnalysis}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} stroke="hsl(var(--border))" />
                <XAxis dataKey="category" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                    color: "hsl(var(--foreground))",
                  }}
                />
                <Bar dataKey="savings" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Power BI Charts - Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Breakdown */}
        <Card className="border-border bg-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Activity className="h-5 w-5 text-[#FF6B35]" />
                Commitment Status
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                >
                  <Database className="h-3 w-3 mr-1" />
                  Power BI
                </Badge>
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={procurementData.statusBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ status, percent }) => `${status} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {procurementData.statusBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                    color: "hsl(var(--foreground))",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Timeline Chart */}
        <Card className="border-border bg-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Calendar className="h-5 w-5 text-[#FF6B35]" />
                Procurement Timeline
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                >
                  <Database className="h-3 w-3 mr-1" />
                  Power BI
                </Badge>
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={procurementData.monthlyTrends}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF6B35" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#FF6B35" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                    color: "hsl(var(--foreground))",
                  }}
                />
                <Area type="monotone" dataKey="value" stroke="#FF6B35" strokeWidth={2} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Brain className="h-5 w-5 text-[#FF6B35]" />
              AI-Powered Insights
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800"
              >
                <Brain className="h-3 w-3 mr-1" />
                AI Analysis
              </Badge>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="font-medium text-foreground">Cost Optimization</span>
              </div>
              <p className="text-sm text-muted-foreground">
                AI identifies 23% cost reduction opportunity through consolidated material orders across 3 projects.
              </p>
              <Badge className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                High Confidence
              </Badge>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                <span className="font-medium text-foreground">Risk Alert</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Vendor performance showing 15% schedule slippage - recommend performance improvement plan.
              </p>
              <Badge className="bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300">
                Medium Risk
              </Badge>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-500" />
                <span className="font-medium text-foreground">Market Opportunity</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Current concrete prices 8% below market forecast - accelerate procurement for upcoming phases.
              </p>
              <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">Opportunity</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Building2 className="h-5 w-5 text-[#FF6B35]" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <Button variant="outline" className="justify-start" onClick={onNewRecord}>
              <Plus className="h-4 w-4 mr-2" />
              New Commitment
            </Button>
            <Button variant="outline" className="justify-start" onClick={handleSync} disabled={syncing}>
              {syncing ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
              Sync Procore
            </Button>
            <Button variant="outline" className="justify-start" onClick={onViewAll}>
              <TrendingUp className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => window.open("https://app.procore.com/commitments", "_blank")}
            >
              <ArrowUpRight className="h-4 w-4 mr-2" />
              Open Procore
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

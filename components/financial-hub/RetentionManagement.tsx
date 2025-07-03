"use client"

import React, { useState } from "react"
import {
  Shield,
  DollarSign,
  Calendar,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertTriangle,
  Building2,
  FileText,
  Zap,
  ChevronDown,
  ChevronUp,
  Bot,
  Target,
  Info,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FullscreenToggle } from "@/components/ui/fullscreen-toggle"
import { CollapseWrapper } from "@/components/ui/collapse-wrapper"
import { useFinancialHubStore } from "@/hooks/use-financial-hub-store"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"

interface RetentionManagementProps {
  userRole: string
  projectData: any
}

// Mock retention data
const retentionData = [
  {
    contractor: "ABC Electrical",
    category: "Electrical",
    totalContract: 245000,
    retentionRate: 0.05,
    retentionHeld: 12250,
    retentionReleased: 0,
    status: "Active",
    releaseDate: "2024-12-15",
  },
  {
    contractor: "Premier HVAC",
    category: "HVAC",
    totalContract: 189000,
    retentionRate: 0.05,
    retentionHeld: 9450,
    retentionReleased: 0,
    status: "Active",
    releaseDate: "2024-11-30",
  },
  {
    contractor: "Structural Solutions",
    category: "Structural",
    totalContract: 456000,
    retentionRate: 0.05,
    retentionHeld: 22800,
    retentionReleased: 5700,
    status: "Partial Release",
    releaseDate: "2024-10-15",
  },
  {
    contractor: "Metro Plumbing",
    category: "Plumbing",
    totalContract: 123000,
    retentionRate: 0.05,
    retentionHeld: 6150,
    retentionReleased: 6150,
    status: "Released",
    releaseDate: "2024-08-20",
  },
]

const monthlyRetentionData = [
  { month: "Jan", held: 45000, released: 0, balance: 45000 },
  { month: "Feb", held: 58000, released: 0, balance: 103000 },
  { month: "Mar", held: 67000, released: 0, balance: 170000 },
  { month: "Apr", held: 72000, released: 15000, balance: 227000 },
  { month: "May", held: 78000, released: 22000, balance: 283000 },
  { month: "Jun", held: 84000, released: 31000, balance: 336000 },
]

const categoryBreakdown = [
  { name: "Electrical", held: 12250, released: 0, color: "#3b82f6" },
  { name: "HVAC", held: 9450, released: 0, color: "#10b981" },
  { name: "Structural", held: 17100, released: 5700, color: "#f59e0b" },
  { name: "Plumbing", held: 0, released: 6150, color: "#ef4444" },
]

type ViewMode = "overview" | "tracking" | "analysis"

export default function RetentionManagement({ userRole, projectData }: RetentionManagementProps) {
  const { isFullscreen, toggleFullscreen } = useFinancialHubStore()

  const [viewMode, setViewMode] = useState<ViewMode>("overview")
  const [isInsightsCollapsed, setIsInsightsCollapsed] = useState(false)

  const getRetentionSummary = () => {
    switch (userRole) {
      case "project-manager":
        return {
          totalHeld: 38800,
          totalReleased: 11850,
          totalBalance: 26950,
          averageRate: 0.05,
          contractorCount: 4,
        }
      case "project-executive":
        return {
          totalHeld: 194000,
          totalReleased: 59250,
          totalBalance: 134750,
          averageRate: 0.05,
          contractorCount: 18,
        }
      default:
        return {
          totalHeld: 336000,
          totalReleased: 103500,
          totalBalance: 232500,
          averageRate: 0.05,
          contractorCount: 32,
        }
    }
  }

  const summary = getRetentionSummary()

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const ViewToggle = () => (
    <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
      {[
        { key: "overview", label: "Overview", icon: Shield },
        { key: "tracking", label: "Tracking", icon: FileText },
        { key: "analysis", label: "Analysis", icon: TrendingUp },
      ].map((item) => (
        <Button
          key={item.key}
          variant={viewMode === item.key ? "default" : "ghost"}
          size="sm"
          onClick={() => setViewMode(item.key as ViewMode)}
          className="flex items-center gap-2"
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </Button>
      ))}
    </div>
  )

  const renderContent = () => {
    switch (viewMode) {
      case "overview":
        return (
          <div className="space-y-6">
            {/* Retention Balance Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Monthly Retention Balance
                </CardTitle>
                <CardDescription>Retention held, released, and balance over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={monthlyRetentionData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Area
                      type="monotone"
                      dataKey="held"
                      stackId="1"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.6}
                      name="Held"
                    />
                    <Area
                      type="monotone"
                      dataKey="released"
                      stackId="2"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.6}
                      name="Released"
                    />
                    <Line type="monotone" dataKey="balance" stroke="#f59e0b" strokeWidth={3} name="Balance" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Category Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-purple-600" />
                    Retention by Category
                  </CardTitle>
                  <CardDescription>Distribution by work category</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="held"
                      >
                        {categoryBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {categoryBreakdown.map((item, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span>{item.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{formatCurrency(item.held)}</div>
                          <div className="text-xs text-muted-foreground">Released: {formatCurrency(item.released)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Retention Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    Retention Performance
                  </CardTitle>
                  <CardDescription>Key retention metrics and compliance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Standard Rate</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="default">{(summary.averageRate * 100).toFixed(1)}%</Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm">Active Contractors</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{summary.contractorCount}</Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm">Release Compliance</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="default">100%</Badge>
                      </div>
                    </div>

                    <div className="pt-4">
                      <div className="text-sm text-muted-foreground mb-2">Retention Status</div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Total Held</span>
                          <span>{formatCurrency(summary.totalHeld)}</span>
                        </div>
                        <Progress value={70} className="h-2" />

                        <div className="flex justify-between text-sm">
                          <span>Total Released</span>
                          <span>{formatCurrency(summary.totalReleased)}</span>
                        </div>
                        <Progress value={30} className="h-2" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case "tracking":
        return (
          <div className="space-y-6">
            {/* Retention Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Retention Tracking
                </CardTitle>
                <CardDescription>Active retention management and release schedule</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Contractor</th>
                        <th className="text-left p-2">Category</th>
                        <th className="text-right p-2">Contract Value</th>
                        <th className="text-right p-2">Rate</th>
                        <th className="text-right p-2">Held</th>
                        <th className="text-right p-2">Released</th>
                        <th className="text-center p-2">Status</th>
                        <th className="text-center p-2">Release Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {retentionData.map((retention, index) => (
                        <tr key={index} className="border-b hover:bg-muted/50">
                          <td className="p-2 font-medium">{retention.contractor}</td>
                          <td className="p-2">{retention.category}</td>
                          <td className="text-right p-2 font-mono">{formatCurrency(retention.totalContract)}</td>
                          <td className="text-right p-2">{(retention.retentionRate * 100).toFixed(1)}%</td>
                          <td className="text-right p-2 font-mono">{formatCurrency(retention.retentionHeld)}</td>
                          <td className="text-right p-2 font-mono">{formatCurrency(retention.retentionReleased)}</td>
                          <td className="text-center p-2">
                            <Badge
                              variant={
                                retention.status === "Active"
                                  ? "default"
                                  : retention.status === "Partial Release"
                                  ? "secondary"
                                  : "outline"
                              }
                            >
                              {retention.status}
                            </Badge>
                          </td>
                          <td className="text-center p-2 text-muted-foreground">
                            {new Date(retention.releaseDate).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "analysis":
        return (
          <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Release Schedule */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-green-600" />
                    Release Schedule
                  </CardTitle>
                  <CardDescription>Upcoming retention releases</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={[
                        { month: "Oct", amount: 22800 },
                        { month: "Nov", amount: 9450 },
                        { month: "Dec", amount: 12250 },
                        { month: "Jan", amount: 0 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      <Bar dataKey="amount" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Risk Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    Risk Assessment
                  </CardTitle>
                  <CardDescription>Retention risk factors and compliance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Payment Default Risk</span>
                      <Badge variant="default">Low</Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm">Documentation Risk</span>
                      <Badge variant="secondary">Medium</Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm">Timeline Compliance</span>
                      <Badge variant="default">On Track</Badge>
                    </div>

                    <div className="pt-4 space-y-2">
                      <div className="text-sm text-muted-foreground">Risk Factors:</div>
                      <ul className="text-sm space-y-1 pl-4">
                        <li>• 1 contract with pending release documentation</li>
                        <li>• All contractors meeting performance criteria</li>
                        <li>• No warranty period violations</li>
                        <li>• Standard 5% retention rate applied</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Financial Impact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-purple-600" />
                  Financial Impact Analysis
                </CardTitle>
                <CardDescription>Retention impact on project cash flow</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{formatCurrency(summary.totalBalance)}</div>
                    <p className="text-sm text-muted-foreground">Current Balance</p>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{formatCurrency(summary.totalReleased)}</div>
                    <p className="text-sm text-muted-foreground">Total Released</p>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{(summary.averageRate * 100).toFixed(1)}%</div>
                    <p className="text-sm text-muted-foreground">Average Rate</p>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{formatCurrency(44500)}</div>
                    <p className="text-sm text-muted-foreground">Pending Release</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div
      className={`space-y-6 ${isFullscreen.retention ? "fixed inset-0 z-[9999] bg-background p-6 overflow-auto" : ""}`}
    >
      {/* Controls Bar */}
      <div className="flex items-center justify-between">
        <ViewToggle />
        <FullscreenToggle isFullscreen={isFullscreen.retention} onToggle={() => toggleFullscreen("retention")} />
      </div>

      {/* HBI Retention Intelligence */}
      <Card className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-gray-800 dark:text-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700">
                <Zap className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </div>
              HBI Retention Intelligence
              <Badge variant="secondary" className="ml-2 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                AI-Powered
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsInsightsCollapsed(!isInsightsCollapsed)}
              className="text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              {isInsightsCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </Button>
          </CardTitle>
          {!isInsightsCollapsed && (
            <CardDescription className="text-gray-600 dark:text-gray-400">
              AI-powered retention analysis and strategic recommendations for contractor management
            </CardDescription>
          )}
        </CardHeader>
        {!isInsightsCollapsed && (
          <CardContent className="space-y-4">
            {/* Key AI Insights */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Alert className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800 dark:text-orange-200">
                  <strong>Release Timing Alert:</strong> {formatCurrency(44500)} in retention pending release within 90
                  days. HBI recommends proactive documentation review and contractor performance verification.
                </AlertDescription>
              </Alert>

              <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800 dark:text-blue-200">
                  <strong>Cash Flow Optimization:</strong> Current retention balance of{" "}
                  {formatCurrency(summary.totalBalance)}
                  represents{" "}
                  {((summary.totalBalance / (summary.totalBalance + summary.totalReleased)) * 100).toFixed(1)}% of total
                  retention. Optimal release timing could improve cash flow by 12%.
                </AlertDescription>
              </Alert>

              <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  <strong>Compliance Excellence:</strong> 100% compliance with {(summary.averageRate * 100).toFixed(1)}%
                  retention rate across {summary.contractorCount} contractors. Strong performance records indicate low
                  risk for retention releases.
                </AlertDescription>
              </Alert>
            </div>

            {/* Retention Intelligence Summary */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <Bot className="h-4 w-4" />
                Retention Management Intelligence
              </h4>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="p-4 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-sm">Risk Assessment</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    HBI analysis shows low retention risk across all active contracts. Average contractor performance
                    rating of 94.2% with zero warranty claims in past 12 months.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-sm">Release Optimization</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Predictive analysis indicates optimal release timing for {summary.contractorCount} contractors could
                    accelerate cash flow by {formatCurrency(summary.totalBalance * 0.12)} over next quarter.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="h-2 w-2 rounded-full bg-gray-500 animate-pulse"></div>
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        Strategic Retention Management
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      AI monitoring contractor performance, warranty periods, and release schedules to optimize
                      retention management and minimize risk exposure.
                    </p>
                  </div>
                  <div className="text-2xl">🏗️</div>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Main Content Area */}
      {renderContent()}
    </div>
  )
}

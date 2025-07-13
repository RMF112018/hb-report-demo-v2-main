"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  Cell,
  PieChart,
  Pie,
} from "recharts"
import { FileText, Activity, TrendingUp, AlertTriangle, XCircle, CheckCircle, Clock, Filter } from "lucide-react"

// Mock Power BI data
const logTrends = [
  { time: "00:00", errors: 23, warnings: 67, info: 145, debug: 89 },
  { time: "04:00", errors: 18, warnings: 54, info: 134, debug: 76 },
  { time: "08:00", errors: 45, warnings: 89, info: 234, debug: 123 },
  { time: "12:00", errors: 67, warnings: 123, info: 267, debug: 145 },
  { time: "16:00", errors: 34, warnings: 78, info: 198, debug: 98 },
  { time: "20:00", errors: 28, warnings: 56, info: 167, debug: 87 },
]

const errorDistribution = [
  { name: "Authentication", value: 234, color: "#EF4444" },
  { name: "Database", value: 156, color: "#F59E0B" },
  { name: "Network", value: 89, color: "#8B5CF6" },
  { name: "File System", value: 67, color: "#3B82F6" },
  { name: "Memory", value: 45, color: "#10B981" },
]

const systemServices = [
  { service: "Web Server", status: "healthy", uptime: 99.8, logs: 2847 },
  { service: "Database", status: "warning", uptime: 98.2, logs: 1523 },
  { service: "Cache", status: "healthy", uptime: 99.9, logs: 567 },
  { service: "Queue", status: "error", uptime: 87.3, logs: 934 },
  { service: "Storage", status: "healthy", uptime: 99.6, logs: 345 },
]

const alertSeverity = [
  { hour: "00", critical: 2, high: 8, medium: 23, low: 45 },
  { hour: "06", critical: 1, high: 5, medium: 18, low: 34 },
  { hour: "12", critical: 4, high: 12, medium: 34, low: 67 },
  { hour: "18", critical: 3, high: 9, medium: 28, low: 52 },
]

const topErrors = [
  { error: "Connection timeout", count: 234, lastSeen: "2 min ago" },
  { error: "Permission denied", count: 156, lastSeen: "5 min ago" },
  { error: "Memory allocation failed", count: 89, lastSeen: "12 min ago" },
  { error: "Disk space low", count: 67, lastSeen: "18 min ago" },
]

function CardShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <FileText className="h-5 w-5" style={{ color: "#FA4616" }} />
          {title}
          <Badge variant="outline" className="ml-auto text-xs">
            <Activity className="h-3 w-3 mr-1" />
            Power BI
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">{children}</CardContent>
    </Card>
  )
}

export default function BetaSystemLogs() {
  const totalLogs = logTrends.reduce((acc, item) => acc + item.errors + item.warnings + item.info + item.debug, 0)
  const totalErrors = logTrends.reduce((acc, item) => acc + item.errors, 0)
  const errorRate = ((totalErrors / totalLogs) * 100).toFixed(1)

  return (
    <CardShell title="System Logs & Events">
      <div className="h-full space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/20 rounded-lg p-3 border border-red-200 dark:border-red-800">
            <div className="flex items-center gap-2 mb-1">
              <XCircle className="h-4 w-4 text-red-600" />
              <span className="text-xs font-medium">Errors</span>
            </div>
            <div className="text-xl font-bold text-red-700 dark:text-red-300">{totalErrors}</div>
            <div className="text-xs text-red-600 dark:text-red-400">Last 24h</div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 rounded-lg p-3 border border-orange-200 dark:border-orange-800">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <span className="text-xs font-medium">Error Rate</span>
            </div>
            <div className="text-xl font-bold text-orange-700 dark:text-orange-300">{errorRate}%</div>
            <div className="text-xs text-orange-600 dark:text-orange-400">Of total logs</div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-medium">Total Logs</span>
            </div>
            <div className="text-xl font-bold text-blue-700 dark:text-blue-300">{(totalLogs / 1000).toFixed(1)}K</div>
            <div className="text-xs text-blue-600 dark:text-blue-400">Entries</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-xs font-medium">Healthy Services</span>
            </div>
            <div className="text-xl font-bold text-green-700 dark:text-green-300">3/5</div>
            <div className="text-xs text-green-600 dark:text-green-400">Services up</div>
          </div>
        </div>

        {/* Log Trends Chart */}
        <div className="h-48">
          <div className="text-sm font-medium mb-2">Log Volume Trends (24h)</div>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={logTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="errors" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.8} />
              <Area type="monotone" dataKey="warnings" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.8} />
              <Area type="monotone" dataKey="info" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.8} />
              <Area type="monotone" dataKey="debug" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.8} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Error Distribution and Service Status */}
        <div className="grid grid-cols-2 gap-4">
          <div className="h-40">
            <div className="text-sm font-medium mb-2">Error Distribution</div>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={errorDistribution} cx="50%" cy="50%" innerRadius={20} outerRadius={60} dataKey="value">
                  {errorDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium">Service Status</div>
            {systemServices.map((service, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      service.status === "healthy"
                        ? "bg-green-500"
                        : service.status === "warning"
                        ? "bg-orange-500"
                        : "bg-red-500"
                    }`}
                  />
                  <span className="text-sm font-medium">{service.service}</span>
                </div>
                <div className="text-right text-xs">
                  <div className="font-medium">{service.uptime}%</div>
                  <div className="text-muted-foreground">{service.logs} logs</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Errors */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Top Errors</div>
          <div className="space-y-1">
            {topErrors.map((error, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <div className="text-sm font-medium">{error.error}</div>
                  <div className="text-xs text-muted-foreground">Last seen: {error.lastSeen}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="destructive" className="text-xs">
                    {error.count}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CardShell>
  )
}

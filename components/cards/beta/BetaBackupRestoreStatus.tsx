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
  BarChart,
  Bar,
} from "recharts"
import {
  HardDrive,
  Shield,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Upload,
  Server,
  Cloud,
} from "lucide-react"

// Mock backup data
const backupSchedule = [
  { day: "Mon", success: 45, failed: 2, size: 2.8 },
  { day: "Tue", success: 48, failed: 1, size: 3.1 },
  { day: "Wed", success: 44, failed: 3, size: 2.6 },
  { day: "Thu", success: 47, failed: 1, size: 3.0 },
  { day: "Fri", success: 46, failed: 2, size: 2.9 },
  { day: "Sat", success: 52, failed: 0, size: 3.4 },
  { day: "Sun", success: 51, failed: 1, size: 3.2 },
]

const backupSources = [
  { source: "Database Servers", size: 485.2, lastBackup: "2 hours ago", status: "success" },
  { source: "File Servers", size: 1247.8, lastBackup: "4 hours ago", status: "success" },
  { source: "Email Servers", size: 789.3, lastBackup: "1 hour ago", status: "success" },
  { source: "Application Data", size: 234.7, lastBackup: "6 hours ago", status: "warning" },
  { source: "User Home Dirs", size: 2156.4, lastBackup: "3 hours ago", status: "success" },
]

const storageLocations = [
  { location: "Primary Storage", used: 4.8, total: 12.0, percentage: 40 },
  { location: "Cloud Archive", used: 15.2, total: 50.0, percentage: 30.4 },
  { location: "Offsite Tape", used: 8.9, total: 25.0, percentage: 35.6 },
  { location: "DR Site", used: 3.2, total: 10.0, percentage: 32 },
]

const rtoRpoMetrics = [
  { system: "Critical Systems", rto: "15 min", rpo: "5 min", sla: "Met" },
  { system: "Business Apps", rto: "1 hour", rpo: "30 min", sla: "Met" },
  { system: "Email System", rto: "30 min", rpo: "15 min", sla: "Met" },
  { system: "File Shares", rto: "2 hours", rpo: "1 hour", sla: "At Risk" },
]

const recentActivities = [
  { activity: "Full System Backup", time: "2:00 AM", status: "success", duration: "3h 24m" },
  { activity: "Database Differential", time: "6:00 AM", status: "success", duration: "45m" },
  { activity: "DR Site Sync", time: "12:00 PM", status: "success", duration: "1h 12m" },
  { activity: "Archive to Cloud", time: "3:00 PM", status: "running", duration: "2h 05m" },
]

function CardShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <HardDrive className="h-5 w-5" style={{ color: "#FA4616" }} />
          {title}
          <Badge variant="outline" className="ml-auto text-xs">
            <Activity className="h-3 w-3 mr-1" />
            Real-time
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">{children}</CardContent>
    </Card>
  )
}

export default function BetaBackupRestoreStatus() {
  const totalBackups = backupSchedule.reduce((acc, day) => acc + day.success + day.failed, 0)
  const successfulBackups = backupSchedule.reduce((acc, day) => acc + day.success, 0)
  const successRate = (successfulBackups / totalBackups) * 100
  const totalSize = backupSources.reduce((acc, source) => acc + source.size, 0)

  return (
    <CardShell title="Backup & DR Status">
      <div className="h-full space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-xs font-medium">Success Rate</span>
            </div>
            <div className="text-xl font-bold text-green-700 dark:text-green-300">{successRate.toFixed(1)}%</div>
            <div className="text-xs text-green-600 dark:text-green-400">Last 7 days</div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-1">
              <HardDrive className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-medium">Data Backed Up</span>
            </div>
            <div className="text-xl font-bold text-blue-700 dark:text-blue-300">{(totalSize / 1000).toFixed(1)}TB</div>
            <div className="text-xs text-blue-600 dark:text-blue-400">Total size</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-purple-600" />
              <span className="text-xs font-medium">Next Backup</span>
            </div>
            <div className="text-xl font-bold text-purple-700 dark:text-purple-300">2:00 AM</div>
            <div className="text-xs text-purple-600 dark:text-purple-400">Tonight</div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 rounded-lg p-3 border border-orange-200 dark:border-orange-800">
            <div className="flex items-center gap-2 mb-1">
              <Server className="h-4 w-4 text-orange-600" />
              <span className="text-xs font-medium">DR Status</span>
            </div>
            <div className="text-xl font-bold text-orange-700 dark:text-orange-300">Ready</div>
            <div className="text-xs text-orange-600 dark:text-orange-400">Last sync: 5min ago</div>
          </div>
        </div>

        {/* Backup Success Trend */}
        <div className="h-32">
          <div className="text-sm font-medium mb-2">Backup Success Rate (7 days)</div>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={backupSchedule}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line dataKey="success" stroke="#10B981" strokeWidth={2} dot={{ fill: "#10B981", strokeWidth: 2 }} />
              <Line dataKey="failed" stroke="#EF4444" strokeWidth={2} dot={{ fill: "#EF4444", strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Backup Sources */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Backup Sources</div>
          <div className="space-y-2 max-h-28 overflow-y-auto">
            {backupSources.map((source, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      source.status === "success"
                        ? "bg-green-500"
                        : source.status === "warning"
                        ? "bg-orange-500"
                        : "bg-red-500"
                    }`}
                  />
                  <span className="text-sm font-medium">{source.source}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{source.size}GB</span>
                  <span className="text-xs text-muted-foreground">{source.lastBackup}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Storage Utilization */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Storage Utilization</div>
          <div className="space-y-2">
            {storageLocations.map((location, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <Cloud className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">{location.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {location.used}TB / {location.total}TB
                  </span>
                  <Progress value={location.percentage} className="w-16 h-2" />
                  <span className="text-xs text-muted-foreground">{location.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RTO/RPO Metrics */}
        <div className="space-y-2">
          <div className="text-sm font-medium">RTO/RPO Compliance</div>
          <div className="grid grid-cols-2 gap-2">
            {rtoRpoMetrics.map((metric, index) => (
              <div key={index} className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium">{metric.system}</span>
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      metric.sla === "Met"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                    }`}
                  >
                    {metric.sla}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  RTO: {metric.rto} | RPO: {metric.rpo}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CardShell>
  )
}

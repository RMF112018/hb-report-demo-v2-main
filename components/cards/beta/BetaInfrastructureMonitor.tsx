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
  Monitor,
  Server,
  Wifi,
  Database,
  Shield,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  HardDrive,
  Cpu,
} from "lucide-react"

// Mock Power BI data
const systemMetrics = [
  { time: "00:00", cpu: 45, memory: 67, disk: 23, network: 89 },
  { time: "04:00", cpu: 52, memory: 71, disk: 25, network: 92 },
  { time: "08:00", cpu: 78, memory: 85, disk: 34, network: 87 },
  { time: "12:00", cpu: 89, memory: 92, disk: 45, network: 94 },
  { time: "16:00", cpu: 95, memory: 88, disk: 56, network: 91 },
  { time: "20:00", cpu: 67, memory: 78, disk: 43, network: 88 },
]

const serverStatus = [
  { name: "Web Server 1", status: "healthy", uptime: 99.8, load: 23 },
  { name: "Web Server 2", status: "healthy", uptime: 99.9, load: 34 },
  { name: "Database Primary", status: "healthy", uptime: 99.7, load: 67 },
  { name: "Database Replica", status: "warning", uptime: 98.2, load: 89 },
  { name: "API Gateway", status: "healthy", uptime: 99.9, load: 45 },
  { name: "Cache Server", status: "healthy", uptime: 99.6, load: 12 },
]

const networkTraffic = [
  { hour: "00", inbound: 2.3, outbound: 1.8 },
  { hour: "06", inbound: 3.1, outbound: 2.4 },
  { hour: "12", inbound: 8.7, outbound: 6.2 },
  { hour: "18", inbound: 6.4, outbound: 4.9 },
]

const alertsData = [
  { type: "Critical", count: 2, color: "#EF4444" },
  { type: "Warning", count: 8, color: "#F59E0B" },
  { type: "Info", count: 15, color: "#3B82F6" },
]

function CardShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Monitor className="h-5 w-5" style={{ color: "#FA4616" }} />
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

export default function BetaInfrastructureMonitor() {
  const healthyServers = serverStatus.filter((s) => s.status === "healthy").length
  const totalServers = serverStatus.length
  const avgUptime = serverStatus.reduce((acc, s) => acc + s.uptime, 0) / totalServers

  return (
    <CardShell title="Infrastructure Monitor">
      <div className="h-full space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-xs font-medium">Uptime</span>
            </div>
            <div className="text-xl font-bold text-green-700 dark:text-green-300">{avgUptime.toFixed(1)}%</div>
            <div className="text-xs text-green-600 dark:text-green-400">30 days</div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-1">
              <Server className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-medium">Servers</span>
            </div>
            <div className="text-xl font-bold text-blue-700 dark:text-blue-300">
              {healthyServers}/{totalServers}
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400">Online</div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 rounded-lg p-3 border border-orange-200 dark:border-orange-800">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <span className="text-xs font-medium">Alerts</span>
            </div>
            <div className="text-xl font-bold text-orange-700 dark:text-orange-300">
              {alertsData.reduce((acc, alert) => acc + alert.count, 0)}
            </div>
            <div className="text-xs text-orange-600 dark:text-orange-400">Active</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-2 mb-1">
              <Wifi className="h-4 w-4 text-purple-600" />
              <span className="text-xs font-medium">Network</span>
            </div>
            <div className="text-xl font-bold text-purple-700 dark:text-purple-300">94%</div>
            <div className="text-xs text-purple-600 dark:text-purple-400">Performance</div>
          </div>
        </div>

        {/* System Performance Chart */}
        <div className="h-48">
          <div className="text-sm font-medium mb-2">System Performance (24h)</div>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={systemMetrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="cpu" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.3} />
              <Area type="monotone" dataKey="memory" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
              <Area type="monotone" dataKey="disk" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Server Status */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Server Health</div>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {serverStatus.map((server, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      server.status === "healthy"
                        ? "bg-green-500"
                        : server.status === "warning"
                        ? "bg-orange-500"
                        : "bg-red-500"
                    }`}
                  />
                  <span className="text-sm font-medium">{server.name}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground">{server.uptime}%</span>
                  <Progress value={server.load} className="w-12 h-2" />
                  <span className="text-muted-foreground">{server.load}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Network Traffic */}
        <div className="h-32">
          <div className="text-sm font-medium mb-2">Network Traffic (GB/h)</div>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={networkTraffic}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="inbound" fill="#3B82F6" />
              <Bar dataKey="outbound" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </CardShell>
  )
}

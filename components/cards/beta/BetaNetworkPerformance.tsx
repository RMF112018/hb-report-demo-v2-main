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
  Wifi,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Globe,
  Server,
  Database,
  Shield,
} from "lucide-react"

// Mock network performance data
const networkLatency = [
  { time: "00:00", latency: 12.3, throughput: 850, packets: 2847 },
  { time: "04:00", latency: 14.1, throughput: 720, packets: 3124 },
  { time: "08:00", latency: 18.7, throughput: 940, packets: 2956 },
  { time: "12:00", latency: 22.4, throughput: 1020, packets: 3401 },
  { time: "16:00", latency: 19.8, throughput: 1150, packets: 3789 },
  { time: "20:00", latency: 15.2, throughput: 980, packets: 4123 },
]

const connectionStats = [
  { type: "VPN Connections", active: 156, max: 200, usage: 78 },
  { type: "WiFi Clients", active: 234, max: 300, usage: 78 },
  { type: "Wired Connections", active: 89, max: 120, usage: 74 },
  { type: "Remote Access", active: 67, max: 100, usage: 67 },
]

const bandwidthUsage = [
  { hour: "00", upload: 234, download: 856, total: 1090 },
  { hour: "06", upload: 456, download: 1234, total: 1690 },
  { hour: "12", upload: 789, download: 2456, total: 3245 },
  { hour: "18", upload: 567, download: 1890, total: 2457 },
]

const networkAlerts = [
  { type: "High Latency", location: "Building A", severity: "warning", count: 3 },
  { type: "Connection Drop", location: "Building B", severity: "critical", count: 1 },
  { type: "Bandwidth Limit", location: "WiFi Zone 3", severity: "warning", count: 2 },
  { type: "Security Alert", location: "VPN Gateway", severity: "info", count: 5 },
]

interface BetaNetworkPerformanceProps {
  className?: string
  isCompact?: boolean
}

function CardShell({ title, children, isCompact }: { title: string; children: React.ReactNode; isCompact?: boolean }) {
  // Scale classes based on isCompact prop for 50% size reduction
  const compactScale = {
    iconSize: isCompact ? "h-3 w-3" : "h-5 w-5",
    iconSizeSmall: isCompact ? "h-2 w-2" : "h-3 w-3",
    textTitle: isCompact ? "text-sm" : "text-lg",
    textSmall: isCompact ? "text-[10px]" : "text-xs",
    textMedium: isCompact ? "text-xs" : "text-sm",
    padding: isCompact ? "p-1" : "p-2",
    paddingCard: isCompact ? "pb-1" : "pb-2",
    gap: isCompact ? "gap-1" : "gap-2",
    marginTop: isCompact ? "mt-0.5" : "mt-1",
    chartHeight: isCompact ? "h-32" : "h-48",
  }

  return (
    <Card className="h-full">
      <CardHeader className={compactScale.paddingCard}>
        <CardTitle className={`flex items-center ${compactScale.gap} ${compactScale.textTitle} font-semibold`}>
          <Wifi className={compactScale.iconSize} style={{ color: "#FA4616" }} />
          {title}
          <Badge variant="outline" className={`ml-auto ${compactScale.textSmall}`}>
            <Activity className={`${compactScale.iconSizeSmall} mr-0.5`} />
            Real-time
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className={isCompact ? "pt-0 p-2" : "pt-0"}>{children}</CardContent>
    </Card>
  )
}

export default function BetaNetworkPerformance({ isCompact }: BetaNetworkPerformanceProps) {
  const avgLatency = networkLatency.reduce((acc, item) => acc + item.latency, 0) / networkLatency.length
  const avgThroughput = networkLatency.reduce((acc, item) => acc + item.throughput, 0) / networkLatency.length
  const totalConnections = connectionStats.reduce((acc, item) => acc + item.active, 0)
  const totalBandwidth = bandwidthUsage[bandwidthUsage.length - 1].total

  return (
    <CardShell title="Network Performance" isCompact={isCompact}>
      <div className="h-full space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-medium">Latency</span>
            </div>
            <div className="text-xl font-bold text-blue-700 dark:text-blue-300">{avgLatency.toFixed(1)}ms</div>
            <div className="text-xs text-blue-600 dark:text-blue-400">Average</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-xs font-medium">Throughput</span>
            </div>
            <div className="text-xl font-bold text-green-700 dark:text-green-300">{avgThroughput.toFixed(0)}</div>
            <div className="text-xs text-green-600 dark:text-green-400">Mbps</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-2 mb-1">
              <Globe className="h-4 w-4 text-purple-600" />
              <span className="text-xs font-medium">Connections</span>
            </div>
            <div className="text-xl font-bold text-purple-700 dark:text-purple-300">{totalConnections}</div>
            <div className="text-xs text-purple-600 dark:text-purple-400">Active</div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 rounded-lg p-3 border border-orange-200 dark:border-orange-800">
            <div className="flex items-center gap-2 mb-1">
              <Database className="h-4 w-4 text-orange-600" />
              <span className="text-xs font-medium">Bandwidth</span>
            </div>
            <div className="text-xl font-bold text-orange-700 dark:text-orange-300">{totalBandwidth}</div>
            <div className="text-xs text-orange-600 dark:text-orange-400">Mbps</div>
          </div>
        </div>

        {/* Network Latency Chart */}
        <div className="h-32">
          <div className="text-sm font-medium mb-2">Network Latency (24h)</div>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={networkLatency}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line dataKey="latency" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Connection Types */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Connection Status</div>
          <div className="space-y-2">
            {connectionStats.map((connection, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-sm font-medium">{connection.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {connection.active}/{connection.max}
                  </span>
                  <Progress value={connection.usage} className="w-16 h-2" />
                  <span className="text-xs text-muted-foreground">{connection.usage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Network Alerts</div>
          <div className="space-y-1 max-h-24 overflow-y-auto">
            {networkAlerts.map((alert, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle
                    className={`h-3 w-3 ${
                      alert.severity === "critical"
                        ? "text-red-500"
                        : alert.severity === "warning"
                        ? "text-orange-500"
                        : "text-blue-500"
                    }`}
                  />
                  <span className="text-xs font-medium">{alert.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{alert.location}</span>
                  <Badge variant="outline" className="text-xs">
                    {alert.count}
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

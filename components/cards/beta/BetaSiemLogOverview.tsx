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
  Shield,
  Eye,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Lock,
  Search,
  Target,
} from "lucide-react"

// Mock SIEM data
const securityEvents = [
  { hour: "00:00", critical: 2, high: 8, medium: 15, low: 45, info: 128 },
  { hour: "04:00", critical: 1, high: 12, medium: 23, low: 67, info: 156 },
  { hour: "08:00", critical: 4, high: 18, medium: 45, low: 89, info: 234 },
  { hour: "12:00", critical: 3, high: 15, medium: 38, low: 76, info: 189 },
  { hour: "16:00", critical: 6, high: 22, medium: 52, low: 94, info: 267 },
  { hour: "20:00", critical: 2, high: 14, medium: 28, low: 58, info: 145 },
]

const threatSources = [
  { source: "External IPs", attacks: 156, blocked: 152, success: 4 },
  { source: "Malware", attacks: 89, blocked: 87, success: 2 },
  { source: "Phishing", attacks: 67, blocked: 65, success: 2 },
  { source: "Brute Force", attacks: 234, blocked: 230, success: 4 },
  { source: "DDoS", attacks: 12, blocked: 12, success: 0 },
]

const topRules = [
  { rule: "Failed Login Attempts", triggers: 1247, severity: "medium" },
  { rule: "Suspicious File Access", triggers: 89, severity: "high" },
  { rule: "Unauthorized Network Scan", triggers: 156, severity: "high" },
  { rule: "Privilege Escalation", triggers: 12, severity: "critical" },
  { rule: "Data Exfiltration", triggers: 3, severity: "critical" },
]

const complianceMetrics = [
  { framework: "ISO 27001", score: 94.2, events: 1247, status: "compliant" },
  { framework: "NIST", score: 91.8, events: 892, status: "compliant" },
  { framework: "PCI DSS", score: 89.5, events: 567, status: "review" },
  { framework: "GDPR", score: 96.3, events: 234, status: "compliant" },
]

const investigationQueue = [
  { id: "INC-2024-001", severity: "critical", type: "Data Breach", assigned: "John Smith", age: "2h" },
  { id: "INC-2024-002", severity: "high", type: "Unauthorized Access", assigned: "Sarah Jones", age: "4h" },
  { id: "INC-2024-003", severity: "medium", type: "Policy Violation", assigned: "Mike Wilson", age: "1d" },
  { id: "INC-2024-004", severity: "low", type: "Failed Authentication", assigned: "Lisa Chen", age: "2d" },
]

const responseMetrics = [
  { metric: "Mean Time to Detect", value: "4.2 min", target: "5 min", status: "good" },
  { metric: "Mean Time to Respond", value: "12.8 min", target: "15 min", status: "good" },
  { metric: "Mean Time to Contain", value: "32.5 min", target: "30 min", status: "warning" },
  { metric: "False Positive Rate", value: "8.7%", target: "10%", status: "good" },
]

interface BetaSiemLogOverviewProps {
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
          <Shield className={compactScale.iconSize} style={{ color: "#FA4616" }} />
          {title}
          <Badge variant="outline" className={`ml-auto ${compactScale.textSmall}`}>
            <Activity className={`${compactScale.iconSizeSmall} mr-0.5`} />
            Live
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className={isCompact ? "pt-0 p-2" : "pt-0"}>{children}</CardContent>
    </Card>
  )
}

export default function BetaSiemLogOverview({ isCompact }: BetaSiemLogOverviewProps) {
  const totalEvents = securityEvents.reduce(
    (acc, hour) => acc + hour.critical + hour.high + hour.medium + hour.low + hour.info,
    0
  )
  const criticalEvents = securityEvents.reduce((acc, hour) => acc + hour.critical, 0)
  const highEvents = securityEvents.reduce((acc, hour) => acc + hour.high, 0)
  const totalAttacks = threatSources.reduce((acc, source) => acc + source.attacks, 0)
  const blockedAttacks = threatSources.reduce((acc, source) => acc + source.blocked, 0)

  return (
    <CardShell title="SIEM & Security" isCompact={isCompact}>
      <div className="h-full space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/20 rounded-lg p-3 border border-red-200 dark:border-red-800">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="text-xs font-medium">Critical</span>
            </div>
            <div className="text-xl font-bold text-red-700 dark:text-red-300">{criticalEvents}</div>
            <div className="text-xs text-red-600 dark:text-red-400">Immediate action</div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 rounded-lg p-3 border border-orange-200 dark:border-orange-800">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-orange-600" />
              <span className="text-xs font-medium">Warnings</span>
            </div>
            <div className="text-xl font-bold text-orange-700 dark:text-orange-300">{highEvents}</div>
            <div className="text-xs text-orange-600 dark:text-orange-400">Monitor closely</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="h-4 w-4 text-green-600" />
              <span className="text-xs font-medium">Events Today</span>
            </div>
            <div className="text-xl font-bold text-green-700 dark:text-green-300">{totalEvents.toLocaleString()}</div>
            <div className="text-xs text-green-600 dark:text-green-400">Processed</div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-1">
              <Target className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-medium">Blocked</span>
            </div>
            <div className="text-xl font-bold text-blue-700 dark:text-blue-300">
              {((blockedAttacks / totalAttacks) * 100).toFixed(1)}%
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400">
              {blockedAttacks} of {totalAttacks}
            </div>
          </div>
        </div>

        {/* Security Events Timeline */}
        <div className="h-32">
          <div className="text-sm font-medium mb-2">Security Events (24h)</div>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={securityEvents}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Area dataKey="critical" stackId="1" stroke="#DC2626" fill="#DC2626" />
              <Area dataKey="high" stackId="1" stroke="#EA580C" fill="#EA580C" />
              <Area dataKey="medium" stackId="1" stroke="#D97706" fill="#D97706" />
              <Area dataKey="low" stackId="1" stroke="#65A30D" fill="#65A30D" />
              <Area dataKey="info" stackId="1" stroke="#2563EB" fill="#2563EB" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Top Security Rules */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Top Triggered Rules</div>
          <div className="space-y-2 max-h-28 overflow-y-auto">
            {topRules.map((rule, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      rule.severity === "critical"
                        ? "bg-red-500"
                        : rule.severity === "high"
                        ? "bg-orange-500"
                        : rule.severity === "medium"
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                  />
                  <span className="text-sm font-medium">{rule.rule}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {rule.triggers}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Response Metrics */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Response Metrics</div>
          <div className="space-y-2">
            {responseMetrics.map((metric, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      metric.status === "good"
                        ? "bg-green-500"
                        : metric.status === "warning"
                        ? "bg-orange-500"
                        : "bg-red-500"
                    }`}
                  />
                  <span className="text-sm font-medium">{metric.metric}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{metric.value}</span>
                  <span className="text-xs text-muted-foreground">/ {metric.target}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Investigation Queue */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Active Investigations</div>
          <div className="space-y-1 max-h-20 overflow-y-auto">
            {investigationQueue.slice(0, 3).map((incident, index) => (
              <div key={index} className="flex items-center justify-between p-1 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      incident.severity === "critical"
                        ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        : incident.severity === "high"
                        ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                        : incident.severity === "medium"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    }`}
                  >
                    {incident.id}
                  </Badge>
                  <span className="text-xs font-medium">{incident.type}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground">{incident.assigned}</span>
                  <span className="text-xs text-muted-foreground">{incident.age}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CardShell>
  )
}

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
} from "recharts"
import {
  Monitor,
  Smartphone,
  Laptop,
  Shield,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Lock,
  Wifi,
} from "lucide-react"

// Mock endpoint health data
const deviceCategories = [
  { name: "Laptops", value: 145, healthy: 138, color: "#3B82F6" },
  { name: "Desktops", value: 89, healthy: 85, color: "#10B981" },
  { name: "Mobile Devices", value: 234, healthy: 225, color: "#8B5CF6" },
  { name: "Tablets", value: 67, healthy: 63, color: "#F59E0B" },
  { name: "IoT Devices", value: 43, healthy: 41, color: "#EF4444" },
]

const securityStatus = [
  { category: "Antivirus", protected: 98.2, exposed: 1.8 },
  { category: "Firewall", protected: 96.7, exposed: 3.3 },
  { category: "Encryption", protected: 94.1, exposed: 5.9 },
  { category: "Updates", protected: 91.5, exposed: 8.5 },
]

const riskLevels = [
  { risk: "Critical", count: 3, devices: ["LAPTOP-001", "TABLET-012", "MOBILE-089"] },
  { risk: "High", count: 8, devices: ["DESKTOP-045", "LAPTOP-023", "MOBILE-156"] },
  { risk: "Medium", count: 15, devices: ["Various devices"] },
  { risk: "Low", count: 521, devices: ["Majority of fleet"] },
]

const complianceMetrics = [
  { metric: "OS Compliance", score: 92.3, target: 95.0 },
  { metric: "Security Patches", score: 88.7, target: 90.0 },
  { metric: "Policy Adherence", score: 94.8, target: 95.0 },
  { metric: "Certificate Status", score: 97.1, target: 98.0 },
]

const threatActivity = [
  { hour: "00", blocked: 12, quarantined: 3, allowed: 847 },
  { hour: "06", blocked: 8, quarantined: 1, allowed: 1234 },
  { hour: "12", blocked: 23, quarantined: 7, allowed: 2156 },
  { hour: "18", blocked: 15, quarantined: 4, allowed: 1789 },
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
            Real-time
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">{children}</CardContent>
    </Card>
  )
}

export default function BetaEndpointHealth() {
  const totalDevices = deviceCategories.reduce((acc, item) => acc + item.value, 0)
  const healthyDevices = deviceCategories.reduce((acc, item) => acc + item.healthy, 0)
  const healthPercentage = (healthyDevices / totalDevices) * 100
  const criticalIssues = riskLevels.find((r) => r.risk === "Critical")?.count || 0

  return (
    <CardShell title="Endpoint Health">
      <div className="h-full space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-1">
              <Monitor className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-medium">Total Devices</span>
            </div>
            <div className="text-xl font-bold text-blue-700 dark:text-blue-300">{totalDevices}</div>
            <div className="text-xs text-blue-600 dark:text-blue-400">Managed</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-xs font-medium">Healthy</span>
            </div>
            <div className="text-xl font-bold text-green-700 dark:text-green-300">{healthPercentage.toFixed(1)}%</div>
            <div className="text-xs text-green-600 dark:text-green-400">{healthyDevices} devices</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="h-4 w-4 text-purple-600" />
              <span className="text-xs font-medium">Protected</span>
            </div>
            <div className="text-xl font-bold text-purple-700 dark:text-purple-300">96.7%</div>
            <div className="text-xs text-purple-600 dark:text-purple-400">Security enabled</div>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/20 rounded-lg p-3 border border-red-200 dark:border-red-800">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="text-xs font-medium">Critical Issues</span>
            </div>
            <div className="text-xl font-bold text-red-700 dark:text-red-300">{criticalIssues}</div>
            <div className="text-xs text-red-600 dark:text-red-400">Require attention</div>
          </div>
        </div>

        {/* Device Distribution */}
        <div className="h-32">
          <div className="text-sm font-medium mb-2">Device Health by Category</div>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={deviceCategories}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="healthy" fill="#10B981" />
              <Bar dataKey="value" fill="#E5E7EB" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Security Compliance */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Security Compliance</div>
          <div className="space-y-2">
            {complianceMetrics.map((metric, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      metric.score >= metric.target ? "bg-green-500" : "bg-orange-500"
                    }`}
                  />
                  <span className="text-sm font-medium">{metric.metric}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={metric.score} className="w-16 h-2" />
                  <span className="text-xs text-muted-foreground">{metric.score.toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Summary */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Risk Assessment</div>
          <div className="grid grid-cols-2 gap-2">
            {riskLevels.slice(0, 4).map((risk, index) => (
              <div key={index} className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium">{risk.risk}</span>
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      risk.risk === "Critical"
                        ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        : risk.risk === "High"
                        ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                        : risk.risk === "Medium"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    }`}
                  >
                    {risk.count}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  {risk.count <= 3 ? risk.devices.join(", ") : `${risk.count} devices`}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CardShell>
  )
}

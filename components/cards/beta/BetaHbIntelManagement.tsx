"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  Settings,
  Users,
  Shield,
  Brain,
  Database,
  Plus,
  ExternalLink,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  TrendingUp,
  Activity,
  Server,
  Lock,
} from "lucide-react"

// Mock Power BI data
const userAnalytics = [
  { month: "Jan", active: 245, new: 12, deactivated: 3 },
  { month: "Feb", active: 267, new: 18, deactivated: 2 },
  { month: "Mar", active: 289, new: 22, deactivated: 1 },
  { month: "Apr", active: 312, new: 28, deactivated: 5 },
  { month: "May", active: 298, new: 15, deactivated: 8 },
  { month: "Jun", active: 324, new: 31, deactivated: 4 },
]

const securityMetrics = [
  { name: "MFA Enabled", value: 87, color: "#10B981" },
  { name: "Pending Setup", value: 13, color: "#F59E0B" },
]

const aiModelPerformance = [
  { model: "GPT-4", accuracy: 94.2, uptime: 99.8, requests: 12847 },
  { model: "Claude", accuracy: 91.8, uptime: 99.9, requests: 8932 },
  { model: "Otter AI", accuracy: 88.4, uptime: 99.5, requests: 5621 },
]

const systemHealth = [
  { component: "Database", status: 98.7, trend: "stable" },
  { component: "API Gateway", status: 99.2, trend: "up" },
  { component: "Cache Layer", status: 97.8, trend: "down" },
  { component: "File Storage", status: 99.9, trend: "up" },
]

interface BetaHbIntelManagementProps {
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
          <Database className={compactScale.iconSize} style={{ color: "#FA4616" }} />
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

export default function BetaHbIntelManagement({ isCompact }: BetaHbIntelManagementProps) {
  return (
    <CardShell title="HB Intel Management" isCompact={isCompact}>
      <div className="h-full">
        <Tabs defaultValue="analytics" className="w-full h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="ai">AI/ML</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Active Users</span>
                </div>
                <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">324</div>
                <div className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +8.7% from last month
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Security Score</span>
                </div>
                <div className="text-2xl font-bold text-green-700 dark:text-green-300">94.2%</div>
                <div className="text-xs text-green-600 dark:text-green-400">Enterprise grade</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium">AI Models</span>
                </div>
                <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">12</div>
                <div className="text-xs text-purple-600 dark:text-purple-400">Active pipelines</div>
              </div>
            </div>

            <div className="h-48">
              <div className="text-sm font-medium mb-2">User Growth Trend</div>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userAnalytics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="active" stroke="#3B82F6" strokeWidth={2} />
                  <Line type="monotone" dataKey="new" stroke="#10B981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <h4 className="font-medium">Security Analytics</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm font-medium">MFA Enforcement</div>
                      <div className="text-xs text-muted-foreground">87% adoption rate</div>
                    </div>
                    <Progress value={87} className="w-16" />
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm font-medium">Password Policy</div>
                      <div className="text-xs text-muted-foreground">100% compliance</div>
                    </div>
                    <Progress value={100} className="w-16" />
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm font-medium">Session Security</div>
                      <div className="text-xs text-muted-foreground">2h timeout active</div>
                    </div>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                </div>
              </div>
              <div className="h-32">
                <div className="text-sm font-medium mb-2">MFA Adoption</div>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={securityMetrics} cx="50%" cy="50%" innerRadius={20} outerRadius={50} dataKey="value">
                      {securityMetrics.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ai" className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-purple-600" />
                <h4 className="font-medium">AI/ML Performance Analytics</h4>
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={aiModelPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="model" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="accuracy" fill="#8B5CF6" />
                    <Bar dataKey="uptime" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {aiModelPerformance.map((model, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                    <div className="text-sm font-medium">{model.model}</div>
                    <div className="text-xs text-muted-foreground">{model.requests.toLocaleString()} requests</div>
                    <div className="text-xs text-green-600">{model.accuracy}% accuracy</div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="projects" className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-orange-600" />
                  <h4 className="font-medium">Project Analytics</h4>
                </div>
                <Button size="sm" className="bg-[#FA4616] hover:bg-[#FA4616]/90">
                  <Plus className="h-3 w-3 mr-1" />
                  New Project
                </Button>
              </div>
              <div className="grid grid-cols-4 gap-3">
                <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-blue-600">47</div>
                  <div className="text-xs text-blue-600">Active Projects</div>
                </div>
                <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-green-600">12</div>
                  <div className="text-xs text-green-600">Completed</div>
                </div>
                <div className="bg-orange-50 dark:bg-orange-950/20 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-orange-600">8</div>
                  <div className="text-xs text-orange-600">In Setup</div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-950/20 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-purple-600">3</div>
                  <div className="text-xs text-purple-600">Planning</div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="system" className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Server className="h-4 w-4 text-gray-600" />
                <h4 className="font-medium">System Health Analytics</h4>
              </div>
              <div className="space-y-3">
                {systemHealth.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div>
                      <div className="text-sm font-medium">{item.component}</div>
                      <div className="text-xs text-muted-foreground">{item.status}% uptime</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={item.status} className="w-16" />
                      {item.trend === "up" && <TrendingUp className="h-3 w-3 text-green-600" />}
                      {item.trend === "down" && <TrendingUp className="h-3 w-3 text-red-600 rotate-180" />}
                      {item.trend === "stable" && <Activity className="h-3 w-3 text-blue-600" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </CardShell>
  )
}

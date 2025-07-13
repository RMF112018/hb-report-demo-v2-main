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
import { Mail, Shield, Activity, TrendingUp, AlertTriangle, CheckCircle, Clock, Eye, Lock, Zap } from "lucide-react"

// Mock email security data
const emailMetrics = [
  { time: "Mon", clean: 3247, spam: 156, malware: 12, phishing: 8 },
  { time: "Tue", clean: 2834, spam: 234, malware: 18, phishing: 15 },
  { time: "Wed", clean: 3512, spam: 189, malware: 9, phishing: 6 },
  { time: "Thu", clean: 3145, spam: 267, malware: 22, phishing: 11 },
  { time: "Fri", clean: 3867, spam: 198, malware: 14, phishing: 9 },
  { time: "Sat", clean: 1245, spam: 67, malware: 3, phishing: 2 },
  { time: "Sun", clean: 987, spam: 45, malware: 1, phishing: 1 },
]

const threatTypes = [
  { type: "Spam", blocked: 1156, percentage: 89.2, color: "#F59E0B" },
  { type: "Phishing", blocked: 52, percentage: 96.3, color: "#EF4444" },
  { type: "Malware", blocked: 79, percentage: 98.7, color: "#8B5CF6" },
  { type: "Ransomware", blocked: 8, percentage: 100, color: "#DC2626" },
]

const protectionLayers = [
  { layer: "Gateway Filter", effectiveness: 94.2, processed: 15234 },
  { layer: "Content Analysis", effectiveness: 87.8, processed: 892 },
  { layer: "URL Protection", effectiveness: 95.6, processed: 234 },
  { layer: "Attachment Scan", effectiveness: 98.1, processed: 156 },
]

const userBehavior = [
  { metric: "Reported Phishing", count: 45, trend: "up" },
  { metric: "Clicked Suspicious", count: 12, trend: "down" },
  { metric: "Downloaded Blocked", count: 8, trend: "stable" },
  { metric: "Training Completed", count: 287, trend: "up" },
]

const complianceStatus = [
  { standard: "GDPR", status: "Compliant", score: 98.5 },
  { standard: "HIPAA", status: "Compliant", score: 96.2 },
  { standard: "SOX", status: "Review", score: 89.7 },
  { standard: "PCI DSS", status: "Compliant", score: 94.8 },
]

function CardShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Mail className="h-5 w-5" style={{ color: "#FA4616" }} />
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

export default function BetaEmailSecurityHealth() {
  const totalEmails = emailMetrics.reduce((acc, day) => acc + day.clean + day.spam + day.malware + day.phishing, 0)
  const cleanEmails = emailMetrics.reduce((acc, day) => acc + day.clean, 0)
  const blockedEmails = totalEmails - cleanEmails
  const cleanRate = (cleanEmails / totalEmails) * 100

  return (
    <CardShell title="Email Security Health">
      <div className="h-full space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-xs font-medium">Clean Rate</span>
            </div>
            <div className="text-xl font-bold text-green-700 dark:text-green-300">{cleanRate.toFixed(1)}%</div>
            <div className="text-xs text-green-600 dark:text-green-400">Delivered</div>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/20 rounded-lg p-3 border border-red-200 dark:border-red-800">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="h-4 w-4 text-red-600" />
              <span className="text-xs font-medium">Threats Stopped</span>
            </div>
            <div className="text-xl font-bold text-red-700 dark:text-red-300">{blockedEmails}</div>
            <div className="text-xs text-red-600 dark:text-red-400">This week</div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-1">
              <Eye className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-medium">Quarantined</span>
            </div>
            <div className="text-xl font-bold text-blue-700 dark:text-blue-300">
              {emailMetrics.reduce((acc, day) => acc + day.spam + day.malware + day.phishing, 0)}
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400">Under review</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="h-4 w-4 text-purple-600" />
              <span className="text-xs font-medium">Response Time</span>
            </div>
            <div className="text-xl font-bold text-purple-700 dark:text-purple-300">2.3s</div>
            <div className="text-xs text-purple-600 dark:text-purple-400">Average</div>
          </div>
        </div>

        {/* Email Volume Trend */}
        <div className="h-32">
          <div className="text-sm font-medium mb-2">Email Traffic (7 days)</div>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={emailMetrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Area dataKey="clean" stackId="1" stroke="#10B981" fill="#10B981" />
              <Area dataKey="spam" stackId="1" stroke="#F59E0B" fill="#F59E0B" />
              <Area dataKey="malware" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" />
              <Area dataKey="phishing" stackId="1" stroke="#EF4444" fill="#EF4444" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Threat Protection */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Threat Protection</div>
          <div className="space-y-2">
            {threatTypes.map((threat, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: threat.color }} />
                  <span className="text-sm font-medium">{threat.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{threat.blocked} blocked</span>
                  <Progress value={threat.percentage} className="w-16 h-2" />
                  <span className="text-xs text-muted-foreground">{threat.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Protection Layers */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Protection Layers</div>
          <div className="grid grid-cols-2 gap-2">
            {protectionLayers.map((layer, index) => (
              <div key={index} className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium">{layer.layer}</span>
                  <Badge variant="outline" className="text-xs">
                    {layer.effectiveness}%
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">{layer.processed} processed</div>
              </div>
            ))}
          </div>
        </div>

        {/* User Behavior */}
        <div className="space-y-2">
          <div className="text-sm font-medium">User Security Behavior</div>
          <div className="grid grid-cols-2 gap-2">
            {userBehavior.map((item, index) => (
              <div key={index} className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium">{item.metric}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold">{item.count}</span>
                    {item.trend === "up" && <TrendingUp className="h-3 w-3 text-green-500" />}
                    {item.trend === "down" && <TrendingUp className="h-3 w-3 text-red-500 rotate-180" />}
                    {item.trend === "stable" && <div className="h-3 w-3 bg-gray-400 rounded-full" />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CardShell>
  )
}

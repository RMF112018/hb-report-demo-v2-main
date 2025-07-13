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
  Users,
  UserCheck,
  UserX,
  UserPlus,
  Shield,
  Key,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Lock,
} from "lucide-react"

// Mock Power BI data
const userRoleDistribution = [
  { name: "Field Users", value: 156, color: "#3B82F6" },
  { name: "Project Managers", value: 34, color: "#10B981" },
  { name: "Executives", value: 18, color: "#8B5CF6" },
  { name: "Admins", value: 8, color: "#F59E0B" },
  { name: "Estimators", value: 12, color: "#EF4444" },
]

const accessTrends = [
  { month: "Jan", logins: 2847, newUsers: 8, deactivated: 2 },
  { month: "Feb", logins: 3124, newUsers: 12, deactivated: 1 },
  { month: "Mar", logins: 2956, newUsers: 15, deactivated: 3 },
  { month: "Apr", logins: 3401, newUsers: 18, deactivated: 2 },
  { month: "May", logins: 3789, newUsers: 22, deactivated: 4 },
  { month: "Jun", logins: 4123, newUsers: 25, deactivated: 1 },
]

const securityStatus = [
  { metric: "MFA Enabled", value: 87, total: 228 },
  { metric: "2FA Backup", value: 76, total: 228 },
  { metric: "Password Policy", value: 100, total: 228 },
  { metric: "Session Timeout", value: 92, total: 228 },
]

const recentActivity = [
  { user: "John Smith", action: "Login", time: "2 min ago", status: "success" },
  { user: "Sarah Johnson", action: "Password Reset", time: "15 min ago", status: "pending" },
  { user: "Mike Wilson", action: "Role Change", time: "1 hour ago", status: "success" },
  { user: "Lisa Chen", action: "Account Creation", time: "2 hours ago", status: "success" },
  { user: "Tom Davis", action: "Failed Login", time: "3 hours ago", status: "warning" },
]

function CardShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Users className="h-5 w-5" style={{ color: "#FA4616" }} />
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

export default function BetaUserAccessSummary() {
  const totalUsers = userRoleDistribution.reduce((acc, role) => acc + role.value, 0)
  const pendingUsers = 12
  const activeUsers = totalUsers - pendingUsers

  return (
    <CardShell title="User Access Summary">
      <div className="h-full space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-1">
              <UserCheck className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-medium">Active Users</span>
            </div>
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{activeUsers}</div>
            <div className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +8.7% this month
            </div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 rounded-lg p-3 border border-orange-200 dark:border-orange-800">
            <div className="flex items-center gap-2 mb-1">
              <UserPlus className="h-4 w-4 text-orange-600" />
              <span className="text-xs font-medium">Pending</span>
            </div>
            <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">{pendingUsers}</div>
            <div className="text-xs text-orange-600 dark:text-orange-400">Awaiting approval</div>
          </div>
        </div>

        {/* User Role Distribution */}
        <div className="grid grid-cols-2 gap-4">
          <div className="h-40">
            <div className="text-sm font-medium mb-2">Role Distribution</div>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={userRoleDistribution} cx="50%" cy="50%" innerRadius={25} outerRadius={60} dataKey="value">
                  {userRoleDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1">
            <div className="text-sm font-medium mb-2">Role Breakdown</div>
            {userRoleDistribution.map((role, index) => (
              <div key={index} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: role.color }} />
                  <span>{role.name}</span>
                </div>
                <span className="font-medium">{role.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Security Status */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Security Compliance</div>
          <div className="space-y-2">
            {securityStatus.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <Shield className="h-3 w-3 text-green-600" />
                  <span className="text-sm">{item.metric}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={item.value} className="w-16 h-2" />
                  <span className="text-xs text-muted-foreground">{item.value}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Access Trends */}
        <div className="h-32">
          <div className="text-sm font-medium mb-2">Login Activity (6 months)</div>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={accessTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="logins" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Recent Activity</div>
          <div className="space-y-1 max-h-24 overflow-y-auto">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded text-xs"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      activity.status === "success"
                        ? "bg-green-500"
                        : activity.status === "pending"
                        ? "bg-orange-500"
                        : "bg-red-500"
                    }`}
                  />
                  <span className="font-medium">{activity.user}</span>
                  <span className="text-muted-foreground">{activity.action}</span>
                </div>
                <span className="text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CardShell>
  )
}

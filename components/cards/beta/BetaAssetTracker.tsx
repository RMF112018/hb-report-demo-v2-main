"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { Package, Activity, TrendingUp, DollarSign, Calendar, AlertTriangle, Shield, Clock } from "lucide-react"

// Mock Power BI data
const assetCategories = [
  { name: "Software Licenses", value: 145, cost: 285000, color: "#3B82F6" },
  { name: "Hardware Assets", value: 89, cost: 156000, color: "#10B981" },
  { name: "Cloud Services", value: 67, cost: 234000, color: "#8B5CF6" },
  { name: "Security Tools", value: 43, cost: 89000, color: "#F59E0B" },
  { name: "Mobile Devices", value: 234, cost: 78000, color: "#EF4444" },
]

const licenseExpiry = [
  { month: "Jan", expiring: 12, cost: 45000 },
  { month: "Feb", expiring: 8, cost: 23000 },
  { month: "Mar", expiring: 15, cost: 67000 },
  { month: "Apr", expiring: 22, cost: 89000 },
  { month: "May", expiring: 6, cost: 12000 },
  { month: "Jun", expiring: 18, cost: 56000 },
]

const costBreakdown = [
  { category: "Microsoft 365", cost: 85000, licenses: 320, utilization: 87 },
  { category: "Adobe Creative", cost: 45000, licenses: 45, utilization: 92 },
  { category: "Autodesk", cost: 67000, licenses: 28, utilization: 78 },
  { category: "Security Software", cost: 34000, licenses: 150, utilization: 95 },
  { category: "Development Tools", cost: 23000, licenses: 67, utilization: 89 },
]

const complianceStatus = [
  { area: "License Compliance", score: 94, issues: 3 },
  { area: "Security Patches", score: 87, issues: 8 },
  { area: "Asset Tracking", score: 91, issues: 5 },
  { area: "Usage Monitoring", score: 89, issues: 6 },
]

interface BetaAssetTrackerProps {
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
          <Package className={compactScale.iconSize} style={{ color: "#FA4616" }} />
          {title}
          <Badge variant="outline" className={`ml-auto ${compactScale.textSmall}`}>
            <Activity className={`${compactScale.iconSizeSmall} mr-0.5`} />
            Power BI
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className={isCompact ? "pt-0 p-2" : "pt-0"}>{children}</CardContent>
    </Card>
  )
}

export default function BetaAssetTracker({ isCompact }: BetaAssetTrackerProps) {
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

  const totalAssets = assetCategories.reduce((acc, item) => acc + item.value, 0)
  const totalCost = assetCategories.reduce((acc, item) => acc + item.cost, 0)
  const expiringThisMonth = licenseExpiry[2].expiring // March

  return (
    <CardShell title="Asset & License Tracker" isCompact={isCompact}>
      <div className={`h-full ${isCompact ? "space-y-2" : "space-y-4"}`}>
        {/* Key Metrics */}
        <div className={`grid grid-cols-4 ${isCompact ? "gap-2" : "gap-3"}`}>
          <div
            className={`bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 rounded-lg ${compactScale.padding} border border-blue-200 dark:border-blue-800`}
          >
            <div className={`flex items-center ${compactScale.gap} ${isCompact ? "mb-0.5" : "mb-1"}`}>
              <Package className={`${compactScale.iconSizeSmall} text-blue-600`} />
              <span className={`${compactScale.textSmall} font-medium`}>Total Assets</span>
            </div>
            <div className={`${isCompact ? "text-lg" : "text-xl"} font-bold text-blue-700 dark:text-blue-300`}>
              {totalAssets}
            </div>
            <div className={`${compactScale.textSmall} text-blue-600 dark:text-blue-400`}>Tracked items</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="text-xs font-medium">Monthly Cost</span>
            </div>
            <div className="text-xl font-bold text-green-700 dark:text-green-300">
              ${(totalCost / 1000).toFixed(0)}K
            </div>
            <div className="text-xs text-green-600 dark:text-green-400">Per month</div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 rounded-lg p-3 border border-orange-200 dark:border-orange-800">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="h-4 w-4 text-orange-600" />
              <span className="text-xs font-medium">Expiring</span>
            </div>
            <div className="text-xl font-bold text-orange-700 dark:text-orange-300">{expiringThisMonth}</div>
            <div className="text-xs text-orange-600 dark:text-orange-400">This month</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="h-4 w-4 text-purple-600" />
              <span className="text-xs font-medium">Compliance</span>
            </div>
            <div className="text-xl font-bold text-purple-700 dark:text-purple-300">91%</div>
            <div className="text-xs text-purple-600 dark:text-purple-400">Average</div>
          </div>
        </div>

        {/* Asset Categories Pie Chart */}
        <div className="grid grid-cols-2 gap-4">
          <div className="h-48">
            <div className="text-sm font-medium mb-2">Asset Distribution</div>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={assetCategories} cx="50%" cy="50%" innerRadius={30} outerRadius={80} dataKey="value">
                  {assetCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1">
            <div className="text-sm font-medium mb-2">Category Breakdown</div>
            {assetCategories.map((category, index) => (
              <div key={index} className="flex items-center justify-between text-xs p-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: category.color }} />
                  <span>{category.name}</span>
                </div>
                <div className="text-right">
                  <div className="font-medium">{category.value}</div>
                  <div className="text-muted-foreground">${(category.cost / 1000).toFixed(0)}K</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* License Expiry Timeline */}
        <div className="h-32">
          <div className="text-sm font-medium mb-2">License Expiry Timeline</div>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={licenseExpiry}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="expiring" fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Cost Analysis */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Top Cost Centers</div>
          {costBreakdown.slice(0, 3).map((item, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <div className="text-sm font-medium">{item.category}</div>
                <div className="text-xs text-muted-foreground">
                  {item.licenses} licenses • {item.utilization}% utilized
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-green-600">${(item.cost / 1000).toFixed(0)}K</div>
                <div className="text-xs text-muted-foreground">per month</div>
              </div>
            </div>
          ))}
        </div>

        {/* Compliance Status */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Compliance Status</div>
          <div className="grid grid-cols-2 gap-2">
            {complianceStatus.map((item, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium">{item.area}</span>
                  <span className="text-xs text-muted-foreground">{item.score}%</span>
                </div>
                <Progress value={item.score} className="h-1" />
                {item.issues > 0 && (
                  <div className="text-xs text-orange-600 mt-1 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    {item.issues} issues
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </CardShell>
  )
}

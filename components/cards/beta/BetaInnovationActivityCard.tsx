"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Zap,
  Lightbulb,
  Brain,
  Sparkles,
  Rocket,
  Shield,
  Gavel,
  Database,
  RefreshCw,
  ExternalLink,
  Star,
  Award,
  Briefcase,
  Filter,
  User,
  Building,
  Timer,
  Bell,
  MapPin,
  Users,
  TrendingUp,
  DollarSign,
  Target,
  Activity,
  BarChart3,
  PieChart,
  Flag,
  AlertCircle,
  CalendarDays,
  Clock,
  Calendar,
  AlertTriangle,
  CheckCircle,
  FileText,
  Cpu,
  Globe,
  Smartphone,
  Monitor,
  Server,
  Cloud,
  Wifi,
  Settings,
  Code,
  Palette,
} from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ComposedChart,
  ScatterChart,
  Scatter,
  FunnelChart,
  Funnel,
} from "recharts"

interface BIMProject {
  id: string
  projectName: string
  clientName: string
  modelType: "Architectural" | "Structural" | "MEP" | "Coordination" | "4D" | "5D"
  status: "Active" | "On Hold" | "Completed"
  lastUpdate: string
  version: string
  fileSize: string
  coordinator: string
  meetingsHeld: number
  issuesResolved: number
}

interface TechAdoption {
  toolName: string
  category: "BIM" | "VDC" | "Digital Construction" | "Analytics"
  adoptionRate: number
  activeUsers: number
  totalUsers: number
  lastUpdated: string
  status: "Growing" | "Stable" | "Declining"
}

interface InnovationData {
  bimProjects: BIMProject[]
  techAdoption: TechAdoption[]
  summary: {
    activeBIMProjects: number
    totalCoordinationMeetings: number
    totalSheetCount: number
    averageAdoptionRate: number
  }
  weeklyTrends: {
    week: string
    meetings: number
    modelUpdates: number
    coordinationIssues: number
  }[]
}

interface BetaInnovationActivityCardProps {
  className?: string
  config?: any
  isCompact?: boolean
  userRole?: string
}

export default function BetaInnovationActivityCard({
  className,
  config,
  isCompact = false,
  userRole,
}: BetaInnovationActivityCardProps) {
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

  const [activeTab, setActiveTab] = useState("bim")
  const [autoRefresh, setAutoRefresh] = useState(false)

  // Mock data for innovation activity
  const innovationData = useMemo(
    (): InnovationData => ({
      bimProjects: [
        {
          id: "1",
          projectName: "Downtown Office Tower",
          clientName: "Tampa Bay Development",
          modelType: "Coordination",
          status: "Active",
          lastUpdate: "2025-01-24",
          version: "v2.4.1",
          fileSize: "2.8 GB",
          coordinator: "M. Alvarez",
          meetingsHeld: 12,
          issuesResolved: 45,
        },
        {
          id: "2",
          projectName: "Luxury Condominiums",
          clientName: "Waterfront Properties",
          modelType: "4D",
          status: "Active",
          lastUpdate: "2025-01-22",
          version: "v1.8.3",
          fileSize: "4.2 GB",
          coordinator: "D. Chen",
          meetingsHeld: 8,
          issuesResolved: 32,
        },
        {
          id: "3",
          projectName: "Medical Center Expansion",
          clientName: "Tampa General Hospital",
          modelType: "MEP",
          status: "Active",
          lastUpdate: "2025-01-20",
          version: "v3.1.0",
          fileSize: "1.9 GB",
          coordinator: "M. Alvarez",
          meetingsHeld: 15,
          issuesResolved: 58,
        },
        {
          id: "4",
          projectName: "Public Library Renovation",
          clientName: "City of Tampa",
          modelType: "Structural",
          status: "On Hold",
          lastUpdate: "2025-01-15",
          version: "v2.0.5",
          fileSize: "1.2 GB",
          coordinator: "D. Chen",
          meetingsHeld: 6,
          issuesResolved: 18,
        },
        {
          id: "5",
          projectName: "Elementary School",
          clientName: "Hillsborough County Schools",
          modelType: "5D",
          status: "Active",
          lastUpdate: "2025-01-18",
          version: "v1.5.2",
          fileSize: "3.1 GB",
          coordinator: "M. Alvarez",
          meetingsHeld: 10,
          issuesResolved: 28,
        },
      ],
      techAdoption: [
        {
          toolName: "Revit",
          category: "BIM",
          adoptionRate: 95,
          activeUsers: 24,
          totalUsers: 25,
          lastUpdated: "2025-01-24",
          status: "Growing",
        },
        {
          toolName: "Navisworks",
          category: "VDC",
          adoptionRate: 88,
          activeUsers: 18,
          totalUsers: 20,
          lastUpdated: "2025-01-22",
          status: "Stable",
        },
        {
          toolName: "BIM 360",
          category: "Digital Construction",
          adoptionRate: 92,
          activeUsers: 22,
          totalUsers: 24,
          lastUpdated: "2025-01-20",
          status: "Growing",
        },
        {
          toolName: "Power BI",
          category: "Analytics",
          adoptionRate: 78,
          activeUsers: 15,
          totalUsers: 19,
          lastUpdated: "2025-01-18",
          status: "Growing",
        },
        {
          toolName: "AutoCAD",
          category: "BIM",
          adoptionRate: 85,
          activeUsers: 20,
          totalUsers: 23,
          lastUpdated: "2025-01-15",
          status: "Stable",
        },
        {
          toolName: "Synchro",
          category: "VDC",
          adoptionRate: 65,
          activeUsers: 12,
          totalUsers: 18,
          lastUpdated: "2025-01-12",
          status: "Declining",
        },
      ],
      summary: {
        activeBIMProjects: 4,
        totalCoordinationMeetings: 51,
        totalSheetCount: 2847,
        averageAdoptionRate: 84,
      },
      weeklyTrends: [
        { week: "Week 1", meetings: 8, modelUpdates: 12, coordinationIssues: 15 },
        { week: "Week 2", meetings: 12, modelUpdates: 18, coordinationIssues: 22 },
        { week: "Week 3", meetings: 10, modelUpdates: 15, coordinationIssues: 18 },
        { week: "Week 4", meetings: 14, modelUpdates: 20, coordinationIssues: 25 },
        { week: "Week 5", meetings: 11, modelUpdates: 16, coordinationIssues: 19 },
        { week: "Week 6", meetings: 13, modelUpdates: 19, coordinationIssues: 23 },
      ],
    }),
    []
  )

  // Chart colors
  const chartColors = {
    primary: "#3B82F6",
    secondary: "#10B981",
    accent: "#8B5CF6",
    warning: "#F59E0B",
    danger: "#EF4444",
    success: "#22C55E",
    growing: "#10B981",
    stable: "#3B82F6",
    declining: "#EF4444",
  }

  // Helper functions
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getModelTypeIcon = (type: string) => {
    switch (type) {
      case "Architectural":
        return <Building className={`${compactScale.iconSizeSmall} text-blue-600`} />
      case "Structural":
        return <Shield className={`${compactScale.iconSizeSmall} text-red-600`} />
      case "MEP":
        return <Zap className={`${compactScale.iconSizeSmall} text-yellow-600`} />
      case "Coordination":
        return <Users className={`${compactScale.iconSizeSmall} text-green-600`} />
      case "4D":
        return <Clock className={`${compactScale.iconSizeSmall} text-purple-600`} />
      case "5D":
        return <DollarSign className={`${compactScale.iconSizeSmall} text-indigo-600`} />
      default:
        return <FileText className={`${compactScale.iconSizeSmall} text-slate-600`} />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "On Hold":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "Completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getAdoptionStatusColor = (status: string) => {
    switch (status) {
      case "Growing":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "Stable":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "Declining":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "BIM":
        return <Building className={`${compactScale.iconSizeSmall} text-blue-600`} />
      case "VDC":
        return <Monitor className={`${compactScale.iconSizeSmall} text-purple-600`} />
      case "Digital Construction":
        return <Cloud className={`${compactScale.iconSizeSmall} text-green-600`} />
      case "Analytics":
        return <BarChart3 className={`${compactScale.iconSizeSmall} text-orange-600`} />
      default:
        return <Settings className={`${compactScale.iconSizeSmall} text-slate-600`} />
    }
  }

  return (
    <Card
      className={`bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-950 dark:to-pink-900 border-pink-200 dark:border-pink-800 ${className}`}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className={`${compactScale.iconSize} text-pink-600`} />
            <CardTitle className={`${compactScale.textTitle} font-semibold text-slate-900 dark:text-slate-100`}>
              Innovation Activity
            </CardTitle>
          </div>
          <Badge variant="secondary" className="text-xs bg-pink-50 text-pink-700 dark:bg-pink-950 dark:text-pink-300">
            Innovation & Digital Services
          </Badge>
        </div>
        <CardDescription className="text-slate-600 dark:text-slate-400">
          BIM, VDC, and digital construction tools activity
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className={`${compactScale.textTitle} font-bold text-pink-600`}>
              {innovationData.summary.activeBIMProjects}
            </div>
            <div className={`${compactScale.textSmall} text-slate-600 dark:text-slate-400`}>Active BIM Projects</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className={`${compactScale.textTitle} font-bold text-green-600`}>
              {innovationData.summary.totalCoordinationMeetings}
            </div>
            <div className={`${compactScale.textSmall} text-slate-600 dark:text-slate-400`}>Coordination Meetings</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className={`${compactScale.textTitle} font-bold text-blue-600`}>
              {innovationData.summary.totalSheetCount.toLocaleString()}
            </div>
            <div className={`${compactScale.textSmall} text-slate-600 dark:text-slate-400`}>Total Sheets</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className={`${compactScale.textTitle} font-bold text-purple-600`}>
              {innovationData.summary.averageAdoptionRate}%
            </div>
            <div className={`${compactScale.textSmall} text-slate-600 dark:text-slate-400`}>Avg Adoption</div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="bim" className="text-xs">
              BIM Projects
            </TabsTrigger>
            <TabsTrigger value="tech" className="text-xs">
              Tech Adoption
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bim" className="space-y-4">
            {/* Trend Chart */}
            <div className={`${compactScale.chartHeight} w-full`}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={innovationData.weeklyTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="week" stroke="#64748B" fontSize={compactScale.textSmall} />
                  <YAxis stroke="#64748B" fontSize={compactScale.textSmall} />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #E2E8F0",
                      borderRadius: "8px",
                      fontSize: compactScale.textSmall,
                    }}
                    formatter={(value, name) => [
                      value,
                      name === "meetings" ? "Meetings" : name === "modelUpdates" ? "Model Updates" : "Issues",
                    ]}
                  />
                  <Bar dataKey="meetings" fill={chartColors.primary} radius={[0, 0, 4, 4]} />
                  <Line type="monotone" dataKey="modelUpdates" stroke={chartColors.success} strokeWidth={2} />
                  <Line type="monotone" dataKey="coordinationIssues" stroke={chartColors.warning} strokeWidth={2} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* BIM Projects List */}
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {innovationData.bimProjects.map((project) => (
                <div
                  key={project.id}
                  className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getModelTypeIcon(project.modelType)}
                      <span className={`${compactScale.textMedium} font-medium text-slate-900 dark:text-slate-100`}>
                        {project.modelType}
                      </span>
                    </div>
                    <Badge className={`text-xs ${getStatusColor(project.status)}`}>{project.status}</Badge>
                  </div>

                  <div className="mb-2">
                    <div className={`${compactScale.textMedium} font-medium text-slate-900 dark:text-slate-100`}>
                      {project.projectName}
                    </div>
                    <div className={`${compactScale.textSmall} text-slate-500 dark:text-slate-400`}>
                      {project.clientName}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <div>
                      <div className={`${compactScale.textSmall} text-slate-500 dark:text-slate-400`}>Version</div>
                      <div className={`${compactScale.textMedium} text-slate-900 dark:text-slate-100`}>
                        {project.version}
                      </div>
                    </div>
                    <div>
                      <div className={`${compactScale.textSmall} text-slate-500 dark:text-slate-400`}>Size</div>
                      <div className={`${compactScale.textMedium} text-slate-900 dark:text-slate-100`}>
                        {project.fileSize}
                      </div>
                    </div>
                    <div>
                      <div className={`${compactScale.textSmall} text-slate-500 dark:text-slate-400`}>Meetings</div>
                      <div className={`${compactScale.textMedium} text-slate-900 dark:text-slate-100`}>
                        {project.meetingsHeld}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className={`${compactScale.textSmall} text-slate-500 dark:text-slate-400`}>
                      Updated: {formatDate(project.lastUpdate)}
                    </div>
                    <div className={`${compactScale.textSmall} text-slate-500 dark:text-slate-400`}>
                      {project.coordinator}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tech" className="space-y-4">
            {/* Tech Adoption Chart */}
            <div className={`${compactScale.chartHeight} w-full`}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={innovationData.techAdoption}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis
                    dataKey="toolName"
                    stroke="#64748B"
                    fontSize={compactScale.textSmall}
                    angle={-45}
                    textAnchor="end"
                  />
                  <YAxis stroke="#64748B" fontSize={compactScale.textSmall} />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #E2E8F0",
                      borderRadius: "8px",
                      fontSize: compactScale.textSmall,
                    }}
                    formatter={(value, name) => [`${value}%`, "Adoption Rate"]}
                  />
                  <Bar dataKey="adoptionRate" fill={chartColors.accent} radius={[0, 0, 4, 4]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Tech Adoption List */}
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {innovationData.techAdoption.map((tool) => (
                <div
                  key={tool.toolName}
                  className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(tool.category)}
                      <span className={`${compactScale.textMedium} font-medium text-slate-900 dark:text-slate-100`}>
                        {tool.toolName}
                      </span>
                    </div>
                    <Badge className={`text-xs ${getAdoptionStatusColor(tool.status)}`}>{tool.status}</Badge>
                  </div>

                  <div className="mb-2">
                    <div className={`${compactScale.textSmall} text-slate-500 dark:text-slate-400`}>
                      {tool.category}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div>
                      <div className={`${compactScale.textSmall} text-slate-500 dark:text-slate-400`}>Adoption</div>
                      <div className={`${compactScale.textMedium} font-medium text-slate-900 dark:text-slate-100`}>
                        {tool.adoptionRate}%
                      </div>
                    </div>
                    <div>
                      <div className={`${compactScale.textSmall} text-slate-500 dark:text-slate-400`}>Users</div>
                      <div className={`${compactScale.textMedium} text-slate-900 dark:text-slate-100`}>
                        {tool.activeUsers}/{tool.totalUsers}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className={`${compactScale.textSmall} text-slate-500 dark:text-slate-400`}>
                      Updated: {formatDate(tool.lastUpdated)}
                    </div>
                    <div className="w-16 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
                        style={{ width: `${tool.adoptionRate}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Auto-refresh toggle */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} className="scale-75" />
            <Label className={`${compactScale.textSmall} text-slate-600 dark:text-slate-400`}>Auto-refresh</Label>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className={`${compactScale.textSmall} text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100`}
          >
            <RefreshCw className={`${compactScale.iconSizeSmall} mr-1`} />
            Refresh
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

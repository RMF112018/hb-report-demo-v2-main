"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Building,
  TrendingUp,
  DollarSign,
  Target,
  Users,
  Activity,
  BarChart3,
  PieChart,
  FileText,
  CheckCircle,
  AlertTriangle,
  Star,
  Award,
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
  User,
  Briefcase,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  Building2,
  UserCheck,
  Activity as ActivityIcon,
} from "lucide-react"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  Area,
  AreaChart,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ComposedChart,
  ScatterChart,
  Scatter,
  FunnelChart,
  Funnel,
} from "recharts"

interface PipelineOpportunity {
  id: string
  clientName: string
  projectName: string
  stage: "Prequal" | "Proposal" | "Interview" | "Negotiation" | "Closed"
  value: number
  probability: number
  expectedCloseDate: string
  bdRep: string
  lastActivity: string
  weightedValue: number
}

interface TopClient {
  name: string
  totalValue: number
  activePursuits: number
  winRate: number
  avatar: string
  lastActivity: string
}

interface BetaBDPipelineSummaryCardProps {
  className?: string
  isCompact?: boolean
}

export function BetaBDPipelineSummaryCard({ className, isCompact = false }: BetaBDPipelineSummaryCardProps) {
  const [activeTab, setActiveTab] = useState("pipeline")

  const pipelineData = useMemo(
    () => [
      {
        id: "1",
        clientName: "City of Tampa",
        projectName: "Downtown Infrastructure",
        stage: "Proposal",
        value: 45000000,
        probability: 75,
        expectedCloseDate: "2025-03-15",
        bdRep: "M. Alvarez",
        lastActivity: "2025-01-24",
        weightedValue: 33750000,
      },
      {
        id: "2",
        clientName: "Publix Real Estate",
        projectName: "Corporate Campus",
        stage: "Interview",
        value: 68000000,
        probability: 85,
        expectedCloseDate: "2025-04-20",
        bdRep: "D. Chen",
        lastActivity: "2025-01-21",
        weightedValue: 57800000,
      },
      {
        id: "3",
        clientName: "Tampa General Hospital",
        projectName: "Medical Tower",
        stage: "Prequal",
        value: 32000000,
        probability: 60,
        expectedCloseDate: "2025-05-10",
        bdRep: "M. Alvarez",
        lastActivity: "2025-01-18",
        weightedValue: 19200000,
      },
      {
        id: "4",
        clientName: "University of South Florida",
        projectName: "Research Complex",
        stage: "Negotiation",
        value: 55000000,
        probability: 90,
        expectedCloseDate: "2025-02-28",
        bdRep: "D. Chen",
        lastActivity: "2025-01-15",
        weightedValue: 49500000,
      },
      {
        id: "5",
        clientName: "Hillsborough County Schools",
        projectName: "Elementary School",
        stage: "Prequal",
        value: 18000000,
        probability: 45,
        expectedCloseDate: "2025-06-15",
        bdRep: "M. Alvarez",
        lastActivity: "2025-01-10",
        weightedValue: 8100000,
      },
      {
        id: "6",
        clientName: "Tampa International Airport",
        projectName: "Terminal Expansion",
        stage: "Proposal",
        value: 89000000,
        probability: 80,
        expectedCloseDate: "2025-03-30",
        bdRep: "D. Chen",
        lastActivity: "2025-01-08",
        weightedValue: 71200000,
      },
    ],
    []
  )

  const topClients = useMemo(
    () => [
      {
        name: "City of Tampa",
        totalValue: 125000000,
        activePursuits: 4,
        winRate: 78,
        avatar: "/avatars/tampa-city.png",
        lastActivity: "2025-01-24",
      },
      {
        name: "Publix Real Estate",
        totalValue: 89000000,
        activePursuits: 3,
        winRate: 85,
        avatar: "/avatars/publix.png",
        lastActivity: "2025-01-21",
      },
      {
        name: "Tampa General Hospital",
        totalValue: 67000000,
        activePursuits: 2,
        winRate: 72,
        avatar: "/avatars/tgh.png",
        lastActivity: "2025-01-18",
      },
    ],
    []
  )

  const stageDistribution = useMemo(() => {
    const stages = pipelineData.reduce((acc, opportunity) => {
      acc[opportunity.stage] = (acc[opportunity.stage] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(stages).map(([stage, count]) => ({
      stage,
      count,
      value: pipelineData.filter((p) => p.stage === stage).reduce((sum, p) => sum + p.value, 0),
    }))
  }, [pipelineData])

  const totalActivePursuits = pipelineData.length
  const totalWeightedValue = pipelineData.reduce((sum, p) => sum + p.weightedValue, 0)
  const totalPipelineValue = pipelineData.reduce((sum, p) => sum + p.value, 0)

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`
    return `$${value.toLocaleString()}`
  }

  const getStageColor = (stage: string) => {
    const colors = {
      Prequal: "#f59e0b",
      Proposal: "#3b82f6",
      Interview: "#10b981",
      Negotiation: "#8b5cf6",
      Closed: "#6b7280",
    }
    return colors[stage as keyof typeof colors] || "#6b7280"
  }

  const getProbabilityColor = (probability: number) => {
    if (probability >= 80) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    if (probability >= 60) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
  }

  return (
    <Card
      className={`bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 ${className}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-blue-900 dark:text-blue-100">
              BD Pipeline Summary
            </CardTitle>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              Business Development opportunity pipeline overview
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800"
            >
              <Database className="h-3 w-3 mr-1" />
              Updated via Unanet CRM
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{totalActivePursuits}</div>
            <div className="text-xs text-blue-700 dark:text-blue-300">Active Pursuits</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {formatCurrency(totalWeightedValue)}
            </div>
            <div className="text-xs text-blue-700 dark:text-blue-300">Weighted Value</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {formatCurrency(totalPipelineValue)}
            </div>
            <div className="text-xs text-blue-700 dark:text-blue-300">Total Pipeline</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {Math.round((totalWeightedValue / totalPipelineValue) * 100)}%
            </div>
            <div className="text-xs text-blue-700 dark:text-blue-300">Win Probability</div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-blue-100 dark:bg-blue-900">
            <TabsTrigger value="pipeline" className="text-blue-900 dark:text-blue-100">
              Pipeline
            </TabsTrigger>
            <TabsTrigger value="clients" className="text-blue-900 dark:text-blue-100">
              Client Breakdown
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pipeline" className="space-y-4">
            {/* Stage Distribution Chart */}
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stageDistribution} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis type="number" />
                  <YAxis dataKey="stage" type="category" width={80} />

                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pipeline Opportunities List */}
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {pipelineData.slice(0, 4).map((opportunity) => (
                <div
                  key={opportunity.id}
                  className="flex items-center justify-between p-2 bg-white dark:bg-blue-900/20 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: getStageColor(opportunity.stage) }}
                    ></div>
                    <div>
                      <div className="text-sm font-medium text-blue-800 dark:text-blue-200">
                        {opportunity.clientName}
                      </div>
                      <div className="text-xs text-blue-600 dark:text-blue-400">{opportunity.projectName}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <div className="text-sm font-medium text-blue-800 dark:text-blue-200">
                        {formatCurrency(opportunity.value)}
                      </div>
                      <div className="text-xs text-blue-600 dark:text-blue-400">{opportunity.stage}</div>
                    </div>
                    <Badge className={`text-xs ${getProbabilityColor(opportunity.probability)}`}>
                      {opportunity.probability}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="clients" className="space-y-4">
            {/* Top Clients */}
            <div className="space-y-3">
              {topClients.map((client, index) => (
                <div
                  key={client.name}
                  className="flex items-center justify-between p-3 bg-white dark:bg-blue-900/20 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={client.avatar} />
                      <AvatarFallback className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {client.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium text-blue-800 dark:text-blue-200">{client.name}</div>
                      <div className="text-xs text-blue-600 dark:text-blue-400">
                        {client.activePursuits} active pursuits
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-blue-800 dark:text-blue-200">
                      {formatCurrency(client.totalValue)}
                    </div>
                    <div className="text-xs text-blue-600 dark:text-blue-400">{client.winRate}% win rate</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Client Performance Summary */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-white dark:bg-blue-900/20 rounded-lg">
                <div className="text-lg font-bold text-blue-900 dark:text-blue-100">
                  {topClients.reduce((sum, c) => sum + c.activePursuits, 0)}
                </div>
                <div className="text-xs text-blue-700 dark:text-blue-300">Total Pursuits</div>
              </div>
              <div className="text-center p-3 bg-white dark:bg-blue-900/20 rounded-lg">
                <div className="text-lg font-bold text-blue-900 dark:text-blue-100">
                  {Math.round(topClients.reduce((sum, c) => sum + c.winRate, 0) / topClients.length)}%
                </div>
                <div className="text-xs text-blue-700 dark:text-blue-300">Avg Win Rate</div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  FileText,
  CheckCircle,
  AlertTriangle,
  Clock,
  Calendar,
  RefreshCw,
  ExternalLink,
  Star,
  Award,
  Briefcase,
  Database,
  Zap,
  Lightbulb,
  Filter,
  User,
  Building,
  Timer,
  Bell,
  Sparkles,
  MapPin,
  Users,
  TrendingUp,
  DollarSign,
  Target,
  Activity,
  BarChart3,
  PieChart,
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

interface PreconAgreement {
  id: string
  projectName: string
  clientName: string
  marketSector: "commercial" | "luxury" | "public"
  agreementType: "NDA" | "Teaming" | "JV" | "Subcontract"
  status: "Active" | "Pending TO Ops" | "Executed"
  agreementValue?: number
  expectedTurnoverDate: string
  bdRep: string
  lastActivity: string
}

interface AgreementsData {
  agreements: PreconAgreement[]
  summary: {
    totalAgreements: number
    totalValue: number
    activeCount: number
    pendingCount: number
    executedCount: number
  }
  marketBreakdown: {
    sector: string
    count: number
    value: number
    percentage: number
  }[]
}

interface BetaPreconAgreementsCardProps {
  className?: string
  config?: any
  isCompact?: boolean
  userRole?: string
}

export default function BetaPreconAgreementsCard({
  className,
  config,
  isCompact = false,
  userRole,
}: BetaPreconAgreementsCardProps) {
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

  const [activeTab, setActiveTab] = useState("overview")
  const [selectedMarket, setSelectedMarket] = useState<string>("all")
  const [autoRefresh, setAutoRefresh] = useState(false)

  // Mock data for pre-construction agreements
  const agreementsData = useMemo(
    (): AgreementsData => ({
      agreements: [
        {
          id: "1",
          projectName: "Downtown Office Tower",
          clientName: "Tampa Bay Development",
          marketSector: "commercial",
          agreementType: "JV",
          status: "Active",
          agreementValue: 25000000,
          expectedTurnoverDate: "2025-06-15",
          bdRep: "M. Alvarez",
          lastActivity: "2025-01-24",
        },
        {
          id: "2",
          projectName: "Luxury Condominiums",
          clientName: "Waterfront Properties",
          marketSector: "luxury",
          agreementType: "Teaming",
          status: "Pending TO Ops",
          agreementValue: 45000000,
          expectedTurnoverDate: "2025-08-20",
          bdRep: "D. Chen",
          lastActivity: "2025-01-22",
        },
        {
          id: "3",
          projectName: "Public Library Renovation",
          clientName: "City of Tampa",
          marketSector: "public",
          agreementType: "Subcontract",
          status: "Executed",
          agreementValue: 12000000,
          expectedTurnoverDate: "2025-04-10",
          bdRep: "M. Alvarez",
          lastActivity: "2025-01-20",
        },
        {
          id: "4",
          projectName: "Medical Center Expansion",
          clientName: "Tampa General Hospital",
          marketSector: "commercial",
          agreementType: "NDA",
          status: "Active",
          agreementValue: 35000000,
          expectedTurnoverDate: "2025-09-30",
          bdRep: "D. Chen",
          lastActivity: "2025-01-18",
        },
        {
          id: "5",
          projectName: "Luxury Hotel",
          clientName: "Hospitality Group",
          marketSector: "luxury",
          agreementType: "JV",
          status: "Pending TO Ops",
          agreementValue: 68000000,
          expectedTurnoverDate: "2025-11-15",
          bdRep: "M. Alvarez",
          lastActivity: "2025-01-15",
        },
        {
          id: "6",
          projectName: "Elementary School",
          clientName: "Hillsborough County Schools",
          marketSector: "public",
          agreementType: "Subcontract",
          status: "Executed",
          agreementValue: 8500000,
          expectedTurnoverDate: "2025-05-20",
          bdRep: "D. Chen",
          lastActivity: "2025-01-12",
        },
      ],
      summary: {
        totalAgreements: 6,
        totalValue: 185000000,
        activeCount: 2,
        pendingCount: 2,
        executedCount: 2,
      },
      marketBreakdown: [
        { sector: "Commercial", count: 2, value: 60000000, percentage: 33 },
        { sector: "Luxury", count: 2, value: 113000000, percentage: 61 },
        { sector: "Public", count: 2, value: 12000000, percentage: 6 },
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
    active: "#10B981",
    pending: "#F59E0B",
    executed: "#3B82F6",
  }

  // Helper functions
  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`
    return `$${amount.toLocaleString()}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "Pending TO Ops":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "Executed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getMarketColor = (sector: string) => {
    switch (sector) {
      case "commercial":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "luxury":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "public":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  // Filter agreements based on selected market
  const filteredAgreements = useMemo(() => {
    if (selectedMarket === "all") return agreementsData.agreements
    return agreementsData.agreements.filter((agreement) => agreement.marketSector === selectedMarket)
  }, [agreementsData.agreements, selectedMarket])

  return (
    <Card
      className={`bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800 ${className}`}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className={`${compactScale.iconSize} text-orange-600`} />
            <CardTitle className={`${compactScale.textTitle} font-semibold text-slate-900 dark:text-slate-100`}>
              Pre-Con Agreements
            </CardTitle>
          </div>
          <Badge
            variant="secondary"
            className="text-xs bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300"
          >
            Active Tracking
          </Badge>
        </div>
        <CardDescription className="text-slate-600 dark:text-slate-400">
          Secured pre-construction agreements across project types
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className={`${compactScale.textTitle} font-bold text-orange-600`}>
              {agreementsData.summary.totalAgreements}
            </div>
            <div className={`${compactScale.textSmall} text-slate-600 dark:text-slate-400`}>Total Agreements</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className={`${compactScale.textTitle} font-bold text-green-600`}>
              {formatCurrency(agreementsData.summary.totalValue)}
            </div>
            <div className={`${compactScale.textSmall} text-slate-600 dark:text-slate-400`}>Total Value</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className={`${compactScale.textTitle} font-bold text-blue-600`}>
              {agreementsData.summary.activeCount}
            </div>
            <div className={`${compactScale.textSmall} text-slate-600 dark:text-slate-400`}>Active</div>
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-2 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
            <div className={`${compactScale.textMedium} font-medium text-green-700 dark:text-green-300`}>
              {agreementsData.summary.activeCount}
            </div>
            <div className={`${compactScale.textSmall} text-green-600 dark:text-green-400`}>Active</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800">
            <div className={`${compactScale.textMedium} font-medium text-yellow-700 dark:text-yellow-300`}>
              {agreementsData.summary.pendingCount}
            </div>
            <div className={`${compactScale.textSmall} text-yellow-600 dark:text-yellow-400`}>Pending TO Ops</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
            <div className={`${compactScale.textMedium} font-medium text-blue-700 dark:text-blue-300`}>
              {agreementsData.summary.executedCount}
            </div>
            <div className={`${compactScale.textSmall} text-blue-600 dark:text-blue-400`}>Executed</div>
          </div>
        </div>

        {/* Market Filter */}
        <div className="flex items-center gap-2">
          <Filter className={`${compactScale.iconSizeSmall} text-slate-600`} />
          <Select value={selectedMarket} onValueChange={setSelectedMarket}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by market sector" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Markets</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
              <SelectItem value="luxury">Luxury</SelectItem>
              <SelectItem value="public">Public</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview" className="text-xs">
              Overview
            </TabsTrigger>
            <TabsTrigger value="projects" className="text-xs">
              Projects
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Market Breakdown Chart */}
            <div className={`${compactScale.chartHeight} w-full`}>
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={agreementsData.marketBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={20}
                    outerRadius={40}
                    paddingAngle={5}
                    dataKey="count"
                  >
                    {agreementsData.marketBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={["#3B82F6", "#8B5CF6", "#10B981"][index]} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #E2E8F0",
                      borderRadius: "8px",
                      fontSize: compactScale.textSmall,
                    }}
                    formatter={(value, name) => [value, "Count"]}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>

            {/* Market Breakdown List */}
            <div className="space-y-2">
              {agreementsData.marketBreakdown.map((market) => (
                <div
                  key={market.sector}
                  className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor:
                          market.sector === "Commercial"
                            ? "#3B82F6"
                            : market.sector === "Luxury"
                            ? "#8B5CF6"
                            : "#10B981",
                      }}
                    />
                    <span className={`${compactScale.textMedium} font-medium text-slate-900 dark:text-slate-100`}>
                      {market.sector}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className={`${compactScale.textMedium} font-medium text-slate-900 dark:text-slate-100`}>
                      {market.count} agreements
                    </div>
                    <div className={`${compactScale.textSmall} text-slate-500 dark:text-slate-400`}>
                      {formatCurrency(market.value)} ({market.percentage}%)
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="projects" className="space-y-4">
            {/* Projects Table */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {filteredAgreements.map((agreement) => (
                <div
                  key={agreement.id}
                  className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Building className={`${compactScale.iconSizeSmall} text-slate-600`} />
                      <span className={`${compactScale.textMedium} font-medium text-slate-900 dark:text-slate-100`}>
                        {agreement.projectName}
                      </span>
                    </div>
                    <Badge className={`text-xs ${getStatusColor(agreement.status)}`}>{agreement.status}</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div>
                      <div className={`${compactScale.textSmall} text-slate-500 dark:text-slate-400`}>Client</div>
                      <div className={`${compactScale.textMedium} text-slate-900 dark:text-slate-100`}>
                        {agreement.clientName}
                      </div>
                    </div>
                    <div>
                      <div className={`${compactScale.textSmall} text-slate-500 dark:text-slate-400`}>Type</div>
                      <div className={`${compactScale.textMedium} text-slate-900 dark:text-slate-100`}>
                        {agreement.agreementType}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div>
                      <div className={`${compactScale.textSmall} text-slate-500 dark:text-slate-400`}>Value</div>
                      <div className={`${compactScale.textMedium} text-slate-900 dark:text-slate-100`}>
                        {agreement.agreementValue ? formatCurrency(agreement.agreementValue) : "N/A"}
                      </div>
                    </div>
                    <div>
                      <div className={`${compactScale.textSmall} text-slate-500 dark:text-slate-400`}>Turnover</div>
                      <div className={`${compactScale.textMedium} text-slate-900 dark:text-slate-100`}>
                        {formatDate(agreement.expectedTurnoverDate)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge className={`text-xs ${getMarketColor(agreement.marketSector)}`}>
                      {agreement.marketSector.charAt(0).toUpperCase() + agreement.marketSector.slice(1)}
                    </Badge>
                    <div className={`${compactScale.textSmall} text-slate-500 dark:text-slate-400`}>
                      {agreement.bdRep}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800">
              <div className="flex items-center gap-2 mb-2">
                <FileText className={`${compactScale.iconSizeSmall} text-orange-600`} />
                <span className={`${compactScale.textMedium} font-medium text-slate-900 dark:text-slate-100`}>
                  Filter Summary
                </span>
              </div>
              <div className={`${compactScale.textSmall} text-slate-600 dark:text-slate-400`}>
                Showing {filteredAgreements.length} of {agreementsData.agreements.length} agreements
                {selectedMarket !== "all" && ` in ${selectedMarket} sector`}
              </div>
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

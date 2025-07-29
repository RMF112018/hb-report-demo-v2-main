"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Users,
  Calendar,
  Target,
  TrendingUp,
  Clock,
  Star,
  AlertTriangle,
  CheckCircle,
  X,
  Filter,
  ExternalLink,
  Phone,
  Mail,
  MapPin,
  Building2,
  UserCheck,
  Activity,
} from "lucide-react"

interface ClientEngagement {
  clientName: string
  lastTouchDate: string
  numberOfMeetings: number
  activePursuits: number
  BDRep: string
  status: "New Opportunity" | "Dormant" | "Strategic" | "Active"
  totalValue: number
  lastActivity: string
}

interface BetaBDClientEngagementCardProps {
  className?: string
}

export function BetaBDClientEngagementCard({ className }: BetaBDClientEngagementCardProps) {
  const [selectedRep, setSelectedRep] = useState<string>("all")

  // Mock Unanet CRM data
  const clientEngagementData = useMemo(
    () => [
      {
        clientName: "City of Tampa",
        lastTouchDate: "2025-01-24",
        numberOfMeetings: 3,
        activePursuits: 2,
        BDRep: "M. Alvarez",
        status: "Strategic" as const,
        totalValue: 45000000,
        lastActivity: "Contract negotiation",
      },
      {
        clientName: "Publix Real Estate",
        lastTouchDate: "2025-01-21",
        numberOfMeetings: 5,
        activePursuits: 3,
        BDRep: "D. Chen",
        status: "Active" as const,
        totalValue: 68000000,
        lastActivity: "Proposal submitted",
      },
      {
        clientName: "Tampa General Hospital",
        lastTouchDate: "2025-01-18",
        numberOfMeetings: 2,
        activePursuits: 1,
        BDRep: "M. Alvarez",
        status: "New Opportunity" as const,
        totalValue: 32000000,
        lastActivity: "Initial meeting",
      },
      {
        clientName: "University of South Florida",
        lastTouchDate: "2025-01-15",
        numberOfMeetings: 4,
        activePursuits: 2,
        BDRep: "D. Chen",
        status: "Strategic" as const,
        totalValue: 55000000,
        lastActivity: "Follow-up call",
      },
      {
        clientName: "Hillsborough County Schools",
        lastTouchDate: "2025-01-10",
        numberOfMeetings: 1,
        activePursuits: 0,
        BDRep: "M. Alvarez",
        status: "Dormant" as const,
        totalValue: 18000000,
        lastActivity: "Email outreach",
      },
      {
        clientName: "Tampa International Airport",
        lastTouchDate: "2025-01-08",
        numberOfMeetings: 6,
        activePursuits: 4,
        BDRep: "D. Chen",
        status: "Active" as const,
        totalValue: 89000000,
        lastActivity: "Site visit completed",
      },
    ],
    []
  )

  // Filter data by selected rep
  const filteredData = useMemo(() => {
    if (selectedRep === "all") return clientEngagementData
    return clientEngagementData.filter((client) => client.BDRep === selectedRep)
  }, [clientEngagementData, selectedRep])

  // Get unique BD reps for filter
  const bdReps = useMemo(() => {
    const reps = [...new Set(clientEngagementData.map((client) => client.BDRep))]
    return ["all", ...reps]
  }, [clientEngagementData])

  // Calculate engagement metrics
  const engagementMetrics = useMemo(() => {
    const totalClients = filteredData.length
    const activeClients = filteredData.filter(
      (client) => client.status === "Active" || client.status === "Strategic"
    ).length
    const totalValue = filteredData.reduce((sum, client) => sum + client.totalValue, 0)
    const avgMeetings = filteredData.reduce((sum, client) => sum + client.numberOfMeetings, 0) / totalClients

    return {
      totalClients,
      activeClients,
      totalValue,
      avgMeetings: Math.round(avgMeetings * 10) / 10,
    }
  }, [filteredData])

  // Format currency
  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`
    return `$${value.toLocaleString()}`
  }

  // Get status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "New Opportunity":
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            New Opportunity
          </Badge>
        )
      case "Active":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            Active
          </Badge>
        )
      case "Strategic":
        return (
          <Badge variant="default" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
            Strategic
          </Badge>
        )
      case "Dormant":
        return (
          <Badge variant="default" className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
            Dormant
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "New Opportunity":
        return <Star className="h-4 w-4 text-blue-600" />
      case "Active":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "Strategic":
        return <TrendingUp className="h-4 w-4 text-purple-600" />
      case "Dormant":
        return <Clock className="h-4 w-4 text-gray-600" />
      default:
        return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <Card
      className={`bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 border-slate-200 dark:border-slate-800 ${className}`}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Client Engagement
            </CardTitle>
          </div>
          <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            Updated via Unanet
          </Badge>
        </div>
        <CardDescription className="text-slate-600 dark:text-slate-400">
          Active client relationships and engagement tracking
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Engagement Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className="text-2xl font-bold text-blue-600">{engagementMetrics.activeClients}</div>
            <div className="text-xs text-slate-600 dark:text-slate-400">Active Clients</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className="text-2xl font-bold text-green-600">{formatCurrency(engagementMetrics.totalValue)}</div>
            <div className="text-xs text-slate-600 dark:text-slate-400">Total Pipeline</div>
          </div>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-500" />
          <Select value={selectedRep} onValueChange={setSelectedRep}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by BD Rep" />
            </SelectTrigger>
            <SelectContent>
              {bdReps.map((rep) => (
                <SelectItem key={rep} value={rep}>
                  {rep === "all" ? "All Reps" : rep}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Client Engagement Table */}
        <div className="space-y-3">
          {filteredData.map((client, index) => (
            <div
              key={client.clientName}
              className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {getStatusIcon(client.status)}
                    <h4 className="font-medium text-sm text-slate-900 dark:text-slate-100 truncate">
                      {client.clientName}
                    </h4>
                    {getStatusBadge(client.status)}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>Last: {new Date(client.lastTouchDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      <span>{client.activePursuits} pursuits</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{client.numberOfMeetings} meetings</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Building2 className="h-3 w-3" />
                      <span>{client.BDRep}</span>
                    </div>
                  </div>

                  <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">{client.lastActivity}</div>
                </div>

                <div className="text-right ml-2">
                  <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {formatCurrency(client.totalValue)}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Pipeline</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <span>Avg meetings per client: {engagementMetrics.avgMeetings}</span>
            <span>{filteredData.length} total clients</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
import {
  Target,
  Calendar,
  Clock,
  TrendingUp,
  Award,
  Building2,
  User,
  Filter,
  RefreshCw,
  CheckCircle,
  Circle,
  AlertTriangle,
  ArrowRight,
} from "lucide-react"

interface PursuitStage {
  name: string
  stage: string
  stageIndex: number
  steps: string[]
  estimatedAwardDate?: string
  daysRemaining?: number
  market: string
  bdRep: string
  value: number
  probability: number
  lastActivity?: string
}

interface BetaBDPursuitTimelineCardProps {
  pursuits?: PursuitStage[]
  className?: string
}

export function BetaBDPursuitTimelineCard({ pursuits = [], className = "" }: BetaBDPursuitTimelineCardProps) {
  const [selectedMarket, setSelectedMarket] = useState<string>("all")
  const [selectedRep, setSelectedRep] = useState<string>("all")
  const [refreshing, setRefreshing] = useState(false)

  // Mock data if none provided
  const defaultPursuits: PursuitStage[] = [
    {
      name: "Miami Health HQ",
      stage: "Proposal",
      stageIndex: 3,
      steps: ["Identified", "Qualified", "Proposal", "Interview", "Award"],
      estimatedAwardDate: "2025-08-15",
      daysRemaining: 45,
      market: "Healthcare",
      bdRep: "M. Alvarez",
      value: 45000000,
      probability: 75,
      lastActivity: "2025-07-20",
    },
    {
      name: "Tampa Bay Innovation Center",
      stage: "Interview",
      stageIndex: 4,
      steps: ["Identified", "Qualified", "Proposal", "Interview", "Award"],
      estimatedAwardDate: "2025-09-01",
      daysRemaining: 62,
      market: "Commercial",
      bdRep: "D. Chen",
      value: 28000000,
      probability: 85,
      lastActivity: "2025-07-22",
    },
    {
      name: "Orlando University Expansion",
      stage: "Qualified",
      stageIndex: 2,
      steps: ["Identified", "Qualified", "Proposal", "Interview", "Award"],
      estimatedAwardDate: "2025-10-15",
      daysRemaining: 107,
      market: "Education",
      bdRep: "M. Alvarez",
      value: 32000000,
      probability: 60,
      lastActivity: "2025-07-18",
    },
    {
      name: "Jacksonville Industrial Park",
      stage: "Identified",
      stageIndex: 1,
      steps: ["Identified", "Qualified", "Proposal", "Interview", "Award"],
      estimatedAwardDate: "2025-11-30",
      daysRemaining: 153,
      market: "Industrial",
      bdRep: "D. Chen",
      value: 18000000,
      probability: 40,
      lastActivity: "2025-07-15",
    },
    {
      name: "Fort Lauderdale Mixed-Use",
      stage: "Award",
      stageIndex: 5,
      steps: ["Identified", "Qualified", "Proposal", "Interview", "Award"],
      estimatedAwardDate: "2025-08-01",
      daysRemaining: 31,
      market: "Commercial",
      bdRep: "M. Alvarez",
      value: 55000000,
      probability: 95,
      lastActivity: "2025-07-25",
    },
  ]

  const pursuitData = pursuits.length > 0 ? pursuits : defaultPursuits

  // Get unique markets and reps for filters
  const markets = useMemo(() => {
    const uniqueMarkets = [...new Set(pursuitData.map((pursuit) => pursuit.market))]
    return ["all", ...uniqueMarkets]
  }, [pursuitData])

  const reps = useMemo(() => {
    const uniqueReps = [...new Set(pursuitData.map((pursuit) => pursuit.bdRep))]
    return ["all", ...uniqueReps]
  }, [pursuitData])

  // Filter pursuits
  const filteredPursuits = useMemo(() => {
    let filtered = pursuitData

    if (selectedMarket !== "all") {
      filtered = filtered.filter((pursuit) => pursuit.market === selectedMarket)
    }

    if (selectedRep !== "all") {
      filtered = filtered.filter((pursuit) => pursuit.bdRep === selectedRep)
    }

    return filtered.slice(0, 5) // Show top 5
  }, [pursuitData, selectedMarket, selectedRep])

  // Get stage color
  const getStageColor = (stageIndex: number, currentIndex: number) => {
    if (currentIndex < stageIndex) {
      return "bg-green-500" // Completed
    } else if (currentIndex === stageIndex) {
      return "bg-blue-500" // Current
    } else {
      return "bg-gray-300 dark:bg-gray-600" // Future
    }
  }

  // Get stage icon
  const getStageIcon = (stageIndex: number, currentIndex: number) => {
    if (currentIndex < stageIndex) {
      return <CheckCircle className="h-4 w-4 text-green-600" />
    } else if (currentIndex === stageIndex) {
      return <Target className="h-4 w-4 text-blue-600" />
    } else {
      return <Circle className="h-4 w-4 text-gray-400" />
    }
  }

  // Format currency
  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`
    return `$${value.toLocaleString()}`
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  // Get urgency color
  const getUrgencyColor = (daysRemaining: number) => {
    if (daysRemaining <= 30) return "text-red-600"
    if (daysRemaining <= 60) return "text-orange-600"
    return "text-green-600"
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    // Simulate refresh
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setRefreshing(false)
  }

  return (
    <Card
      className={`bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-indigo-950 dark:to-purple-900 border-indigo-200 dark:border-indigo-800 ${className}`}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-indigo-800 dark:text-indigo-200">
              <TrendingUp className="h-5 w-5" />
              Pursuit Timeline
            </CardTitle>
            <CardDescription className="text-indigo-600 dark:text-indigo-400">
              Top 5 active pursuits with stage progress
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing} className="h-8 px-2">
              <RefreshCw className={`h-3 w-3 ${refreshing ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400">
            <Filter className="h-3 w-3" />
            Filter:
          </div>
          <Select value={selectedMarket} onValueChange={setSelectedMarket}>
            <SelectTrigger className="h-8 w-32 text-xs">
              <SelectValue placeholder="Market" />
            </SelectTrigger>
            <SelectContent>
              {markets.map((market) => (
                <SelectItem key={market} value={market}>
                  {market === "all" ? "All Markets" : market}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedRep} onValueChange={setSelectedRep}>
            <SelectTrigger className="h-8 w-32 text-xs">
              <SelectValue placeholder="BD Rep" />
            </SelectTrigger>
            <SelectContent>
              {reps.map((rep) => (
                <SelectItem key={rep} value={rep}>
                  {rep === "all" ? "All Reps" : rep}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {filteredPursuits.length > 0 ? (
          filteredPursuits.map((pursuit, index) => (
            <div
              key={pursuit.name}
              className="space-y-3 p-3 rounded-lg border border-indigo-200 dark:border-indigo-700 bg-white/50 dark:bg-indigo-900/50"
            >
              {/* Pursuit Header */}
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate text-indigo-900 dark:text-indigo-100">
                    {pursuit.name}
                  </div>
                  <div className="text-xs text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mt-1">
                    <span className="flex items-center gap-1">
                      <Building2 className="h-3 w-3" />
                      {pursuit.market}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {pursuit.bdRep}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-indigo-900 dark:text-indigo-100">
                    {formatCurrency(pursuit.value)}
                  </div>
                  <div className="text-xs text-indigo-600 dark:text-indigo-400">{pursuit.probability}% probability</div>
                </div>
              </div>

              {/* Stage Progress */}
              <TooltipProvider>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-indigo-600 dark:text-indigo-400">Stage Progress</span>
                    <Badge variant="outline" className="text-xs">
                      {pursuit.stage}
                    </Badge>
                  </div>

                  <div className="relative">
                    <div className="flex items-center justify-between mb-2">
                      {pursuit.steps.map((step, stepIndex) => (
                        <Tooltip key={step}>
                          <TooltipTrigger asChild>
                            <div className="flex flex-col items-center gap-1">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${getStageColor(
                                  stepIndex + 1,
                                  pursuit.stageIndex
                                )}`}
                              >
                                {getStageIcon(stepIndex + 1, pursuit.stageIndex)}
                              </div>
                              <span className="text-xs text-indigo-600 dark:text-indigo-400 text-center max-w-16 truncate">
                                {step}
                              </span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{step}</p>
                            {stepIndex + 1 === pursuit.stageIndex && (
                              <p className="text-xs text-muted-foreground">Current stage</p>
                            )}
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </div>

                    {/* Progress bar */}
                    <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-300"
                        style={{ width: `${(pursuit.stageIndex / pursuit.steps.length) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </TooltipProvider>

              {/* Timeline Info */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-indigo-600 dark:text-indigo-400">
                    Est. Award: {formatDate(pursuit.estimatedAwardDate || "")}
                  </span>
                </div>
                <div className={`flex items-center gap-1 font-medium ${getUrgencyColor(pursuit.daysRemaining || 0)}`}>
                  <Clock className="h-3 w-3" />
                  <span>{pursuit.daysRemaining} days</span>
                </div>
              </div>

              {/* Last Activity */}
              {pursuit.lastActivity && (
                <div className="text-xs text-indigo-500 dark:text-indigo-400 flex items-center gap-1">
                  <span>Last activity: {formatDate(pursuit.lastActivity)}</span>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-indigo-500 dark:text-indigo-400">
            <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No pursuits found for selected filters</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

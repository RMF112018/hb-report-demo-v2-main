"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Target,
  TrendingUp,
  Brain,
  Eye,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Building2,
  Zap,
  Lightbulb,
  Award,
  BarChart3,
  RefreshCw,
} from "lucide-react"

interface WinLikelihoodPursuit {
  name: string
  winLikelihood: number
  confidence: "High" | "Moderate" | "Low"
  insight: string
  reasoning: string[]
  value: number
  stage: string
  lastContact: string
  bdRep: string
  market: string
}

interface BetaBDWinLikelihoodCardProps {
  pursuits?: WinLikelihoodPursuit[]
  className?: string
}

export function BetaBDWinLikelihoodCard({ pursuits = [], className = "" }: BetaBDWinLikelihoodCardProps) {
  const [expandedPursuit, setExpandedPursuit] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  // Mock data if none provided
  const defaultPursuits: WinLikelihoodPursuit[] = [
    {
      name: "Miami Health HQ",
      winLikelihood: 78,
      confidence: "High",
      insight: "Strong client relationship history",
      reasoning: [
        "Previous successful projects with this client",
        "High engagement from key decision makers",
        "Competitive pricing within market range",
        "Technical expertise matches project requirements",
      ],
      value: 45000000,
      stage: "Proposal",
      lastContact: "2025-07-20",
      bdRep: "M. Alvarez",
      market: "Healthcare",
    },
    {
      name: "Tampa Bay Innovation Center",
      winLikelihood: 65,
      confidence: "Moderate",
      insight: "Mixed signals on budget approval",
      reasoning: [
        "Budget approval pending final board review",
        "Strong technical proposal submitted",
        "Competition from 2 other qualified firms",
        "Timeline aligns with our capacity",
      ],
      value: 28000000,
      stage: "Interview",
      lastContact: "2025-07-22",
      bdRep: "D. Chen",
      market: "Commercial",
    },
    {
      name: "Orlando University Expansion",
      winLikelihood: 45,
      confidence: "Low",
      insight: "Low contact frequency with decision makers",
      reasoning: [
        "Limited direct access to key stakeholders",
        "Competition from established university contractors",
        "Budget constraints may impact scope",
        "Timeline may be accelerated",
      ],
      value: 32000000,
      stage: "Qualified",
      lastContact: "2025-07-18",
      bdRep: "M. Alvarez",
      market: "Education",
    },
    {
      name: "Jacksonville Industrial Park",
      winLikelihood: 32,
      confidence: "Low",
      insight: "Early stage with limited relationship depth",
      reasoning: [
        "New client relationship",
        "Multiple competitors in industrial sector",
        "Price sensitivity expected",
        "Need to establish credibility quickly",
      ],
      value: 18000000,
      stage: "Identified",
      lastContact: "2025-07-15",
      bdRep: "D. Chen",
      market: "Industrial",
    },
    {
      name: "Fort Lauderdale Mixed-Use",
      winLikelihood: 92,
      confidence: "High",
      insight: "Excellent stakeholder alignment",
      reasoning: [
        "Strong relationships with all key stakeholders",
        "Proven track record in mixed-use development",
        "Competitive advantage in local market",
        "Favorable timeline and budget parameters",
      ],
      value: 55000000,
      stage: "Award",
      lastContact: "2025-07-25",
      bdRep: "M. Alvarez",
      market: "Commercial",
    },
  ]

  const pursuitData = pursuits.length > 0 ? pursuits : defaultPursuits

  // Get confidence color and icon
  const getConfidenceStyle = (confidence: string) => {
    switch (confidence) {
      case "High":
        return {
          color: "text-green-600",
          bgColor: "bg-green-100 dark:bg-green-900",
          icon: <CheckCircle className="h-4 w-4 text-green-600" />,
        }
      case "Moderate":
        return {
          color: "text-orange-600",
          bgColor: "bg-orange-100 dark:bg-orange-900",
          icon: <Clock className="h-4 w-4 text-orange-600" />,
        }
      case "Low":
        return {
          color: "text-red-600",
          bgColor: "bg-red-100 dark:bg-red-900",
          icon: <AlertTriangle className="h-4 w-4 text-red-600" />,
        }
      default:
        return {
          color: "text-gray-600",
          bgColor: "bg-gray-100 dark:bg-gray-900",
          icon: <Target className="h-4 w-4 text-gray-600" />,
        }
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
    })
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    // Simulate refresh
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setRefreshing(false)
  }

  const toggleExpanded = (pursuitName: string) => {
    setExpandedPursuit(expandedPursuit === pursuitName ? null : pursuitName)
  }

  return (
    <Card
      className={`bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-950 dark:to-teal-900 border-emerald-200 dark:border-emerald-800 ${className}`}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200">
              <Brain className="h-5 w-5" />
              Win Likelihood Predictions
            </CardTitle>
            <CardDescription className="text-emerald-600 dark:text-emerald-400">
              AI-powered win probability analysis for high-value pursuits
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="text-xs bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300"
            >
              Powered by HBI
            </Badge>
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing} className="h-8 px-2">
              <RefreshCw className={`h-3 w-3 ${refreshing ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          {pursuitData.map((pursuit, index) => {
            const confidenceStyle = getConfidenceStyle(pursuit.confidence)
            const isExpanded = expandedPursuit === pursuit.name

            return (
              <div
                key={pursuit.name}
                className="space-y-3 p-3 rounded-lg border border-emerald-200 dark:border-emerald-700 bg-white/50 dark:bg-emerald-900/50"
              >
                {/* Pursuit Header */}
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate text-emerald-900 dark:text-emerald-100">
                      {pursuit.name}
                    </div>
                    <div className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-2 mt-1">
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
                    <div className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
                      {formatCurrency(pursuit.value)}
                    </div>
                    <div className="text-xs text-emerald-600 dark:text-emerald-400">{pursuit.stage}</div>
                  </div>
                </div>

                {/* Win Likelihood */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-emerald-600 dark:text-emerald-400">Win Likelihood</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-emerald-900 dark:text-emerald-100">
                        {pursuit.winLikelihood}%
                      </span>
                      <Badge
                        variant="outline"
                        className={`text-xs ${confidenceStyle.bgColor} ${confidenceStyle.color}`}
                      >
                        {confidenceStyle.icon}
                        {pursuit.confidence}
                      </Badge>
                    </div>
                  </div>

                  <Progress
                    value={pursuit.winLikelihood}
                    className="h-2"
                    style={{
                      background: "linear-gradient(to right, #ef4444, #f59e0b, #10b981)",
                    }}
                  />
                </div>

                {/* AI Insight */}
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-emerald-700 dark:text-emerald-300">
                      <span className="font-medium">HBI Insight:</span> {pursuit.insight}
                    </div>
                  </div>
                </div>

                {/* Expandable Reasoning */}
                <Collapsible open={isExpanded} onOpenChange={() => toggleExpanded(pursuit.name)}>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View HBI Reasoning
                      {isExpanded ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2">
                    <div className="space-y-2 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700">
                      <div className="text-xs font-medium text-emerald-800 dark:text-emerald-200 mb-2">
                        HBI Analysis Factors:
                      </div>
                      <div className="space-y-1">
                        {pursuit.reasoning.map((reason, reasonIndex) => (
                          <div key={reasonIndex} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                            <div className="text-xs text-emerald-700 dark:text-emerald-300">{reason}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                {/* Last Contact */}
                <div className="text-xs text-emerald-500 dark:text-emerald-400 flex items-center gap-1">
                  <span>Last contact: {formatDate(pursuit.lastContact)}</span>
                </div>
              </div>
            )
          })}
        </div>

        {pursuitData.length === 0 && (
          <div className="text-center py-8 text-emerald-500 dark:text-emerald-400">
            <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No pursuit data available for analysis</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

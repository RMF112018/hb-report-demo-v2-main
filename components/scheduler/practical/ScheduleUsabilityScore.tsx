/**
 * @fileoverview Schedule Usability Score - Practical Schedule Assessment
 * @module ScheduleUsabilityScore
 * @version 3.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Evaluates schedule practical usability with checklist-based scoring system
 * focusing on name clarity, WBS logic, location tagging, and Look Ahead alignment
 */

"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Target,
  ClipboardCheck,
  Settings,
  RefreshCw,
  BarChart3,
  TrendingUp,
  Eye,
  Download,
  ChevronRight,
  Info,
  Activity,
} from "lucide-react"

// Types
interface UsabilityCheckItem {
  id: string
  category: string
  name: string
  description: string
  status: "pass" | "fail" | "warning"
  score: number
  maxScore: number
  details: string[]
  recommendations?: string[]
}

interface UsabilityScore {
  overall: number
  maxOverall: number
  breakdown: {
    nameClarity: number
    wbsLogic: number
    locationTagging: number
    lookAheadAlignment: number
  }
}

// Mock Data
const usabilityChecks: UsabilityCheckItem[] = [
  {
    id: "name-clarity",
    category: "Naming Convention",
    name: "Name Clarity",
    description: "Activity names follow clear, consistent naming conventions",
    status: "pass",
    score: 22,
    maxScore: 25,
    details: [
      "95% of activities have descriptive names",
      "Consistent abbreviation standards",
      "Trade identification clear",
      "Missing: 3 activities need location prefix",
    ],
    recommendations: ["Add location prefix to activities A015, A022, A031", "Standardize MEP vs M/E/P abbreviations"],
  },
  {
    id: "wbs-logic",
    category: "Work Breakdown",
    name: "WBS Logic",
    description: "Work breakdown structure follows logical hierarchy",
    status: "pass",
    score: 18,
    maxScore: 25,
    details: [
      "4-level WBS hierarchy maintained",
      "Phase grouping logical",
      "Trade sequencing correct",
      "Missing: 2 summary tasks for coordination",
    ],
    recommendations: ["Add summary task for MEP coordination phase", "Create milestone for substantial completion"],
  },
  {
    id: "location-tagging",
    category: "Location Management",
    name: "Location Tagging",
    description: "Activities properly tagged with location identifiers",
    status: "fail",
    score: 15,
    maxScore: 25,
    details: [
      "60% of activities have location tags",
      "Building zones identified",
      "Floor level missing in 40% of activities",
      "Room/area codes inconsistent",
    ],
    recommendations: [
      "Implement floor-level tagging for all activities",
      "Standardize room coding system",
      "Add zone identifiers for exterior work",
    ],
  },
  {
    id: "lookahead-alignment",
    category: "Planning Integration",
    name: "Look Ahead Alignment",
    description: "Schedule aligns with Look Ahead planning periods",
    status: "warning",
    score: 23,
    maxScore: 25,
    details: [
      "6-week Look Ahead alignment good",
      "Weekly planning windows clear",
      "Resource leveling compatible",
      "Minor: 2 activities span multiple periods",
    ],
    recommendations: [
      "Split long-duration activities for better tracking",
      "Align milestone dates with Look Ahead cycles",
    ],
  },
]

const usabilityScore: UsabilityScore = {
  overall: 78,
  maxOverall: 100,
  breakdown: {
    nameClarity: 22,
    wbsLogic: 18,
    locationTagging: 15,
    lookAheadAlignment: 23,
  },
}

// Components
const UsabilityCheckCard: React.FC<{
  check: UsabilityCheckItem
  isExpanded: boolean
  onToggle: () => void
}> = ({ check, isExpanded, onToggle }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pass":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "fail":
        return <XCircle className="h-5 w-5 text-red-600" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pass":
        return "text-green-700 bg-green-50 border-green-200"
      case "fail":
        return "text-red-700 bg-red-50 border-red-200"
      case "warning":
        return "text-yellow-700 bg-yellow-50 border-yellow-200"
      default:
        return "text-gray-700 bg-gray-50 border-gray-200"
    }
  }

  const scorePercentage = (check.score / check.maxScore) * 100

  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getStatusIcon(check.status)}
            <div>
              <CardTitle className="text-sm font-medium">{check.name}</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">{check.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-lg font-bold">
                {check.score}/{check.maxScore}
              </div>
              <Badge variant="outline" className={cn("text-xs", getStatusColor(check.status))}>
                {check.status.toUpperCase()}
              </Badge>
            </div>
            <Button variant="ghost" size="sm" onClick={onToggle} className="h-8 w-8 p-0">
              <ChevronRight className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-90")} />
            </Button>
          </div>
        </div>

        {/* Score Progress Bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-muted-foreground">{check.category}</span>
            <span className="font-medium">{Math.round(scorePercentage)}%</span>
          </div>
          <Progress
            value={scorePercentage}
            className={cn(
              "h-2",
              check.status === "pass" && "[&>div]:bg-green-500",
              check.status === "fail" && "[&>div]:bg-red-500",
              check.status === "warning" && "[&>div]:bg-yellow-500"
            )}
          />
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0">
          <div className="space-y-4">
            {/* Details */}
            <div>
              <h4 className="text-xs font-medium text-muted-foreground mb-2">ASSESSMENT DETAILS</h4>
              <ul className="space-y-1">
                {check.details.map((detail, index) => (
                  <li key={index} className="text-sm flex items-start gap-2">
                    <span className="text-muted-foreground">•</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommendations */}
            {check.recommendations && check.recommendations.length > 0 && (
              <div>
                <h4 className="text-xs font-medium text-muted-foreground mb-2">RECOMMENDATIONS</h4>
                <ul className="space-y-1">
                  {check.recommendations.map((rec, index) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <span className="text-blue-500">→</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  )
}

const ScoreOverview: React.FC<{ score: UsabilityScore }> = ({ score }) => {
  const getScoreGrade = (score: number) => {
    if (score >= 90) return { grade: "A", color: "text-green-600", bg: "bg-green-50", border: "border-green-200" }
    if (score >= 80) return { grade: "B", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" }
    if (score >= 70) return { grade: "C", color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200" }
    if (score >= 60) return { grade: "D", color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200" }
    return { grade: "F", color: "text-red-600", bg: "bg-red-50", border: "border-red-200" }
  }

  const scoreGrade = getScoreGrade(score.overall)
  const percentage = (score.overall / score.maxOverall) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Schedule Usability Score
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Overall Score */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-4">
              <div className="text-4xl font-bold">{score.overall}</div>
              <div className="text-2xl text-muted-foreground">/{score.maxOverall}</div>
              <div
                className={cn(
                  "w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold border-2",
                  scoreGrade.color,
                  scoreGrade.bg,
                  scoreGrade.border
                )}
              >
                {scoreGrade.grade}
              </div>
            </div>

            <Progress value={percentage} className="h-3" />

            <p className="text-sm text-muted-foreground">
              Schedule meets {Math.round(percentage)}% of usability standards
            </p>
          </div>

          <Separator />

          {/* Breakdown */}
          <div>
            <h3 className="text-sm font-medium mb-4">Score Breakdown</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Name Clarity</span>
                <div className="flex items-center gap-2">
                  <Progress value={(score.breakdown.nameClarity / 25) * 100} className="w-24 h-2" />
                  <span className="text-sm font-medium w-12 text-right">{score.breakdown.nameClarity}/25</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">WBS Logic</span>
                <div className="flex items-center gap-2">
                  <Progress value={(score.breakdown.wbsLogic / 25) * 100} className="w-24 h-2" />
                  <span className="text-sm font-medium w-12 text-right">{score.breakdown.wbsLogic}/25</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Location Tagging</span>
                <div className="flex items-center gap-2">
                  <Progress value={(score.breakdown.locationTagging / 25) * 100} className="w-24 h-2" />
                  <span className="text-sm font-medium w-12 text-right">{score.breakdown.locationTagging}/25</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Look Ahead Alignment</span>
                <div className="flex items-center gap-2">
                  <Progress value={(score.breakdown.lookAheadAlignment / 25) * 100} className="w-24 h-2" />
                  <span className="text-sm font-medium w-12 text-right">{score.breakdown.lookAheadAlignment}/25</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const ScheduleUsabilityScore: React.FC = () => {
  const [expandedCheck, setExpandedCheck] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"overview" | "detailed">("overview")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")

  const toggleCheck = (checkId: string) => {
    setExpandedCheck(expandedCheck === checkId ? null : checkId)
  }

  const filteredChecks =
    categoryFilter === "all"
      ? usabilityChecks
      : usabilityChecks.filter((check) => check.category.toLowerCase().includes(categoryFilter.toLowerCase()))

  const getStatusCounts = () => {
    const counts = { pass: 0, fail: 0, warning: 0 }
    usabilityChecks.forEach((check) => {
      counts[check.status]++
    })
    return counts
  }

  const statusCounts = getStatusCounts()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Schedule Usability Assessment</h2>
          <p className="text-sm text-muted-foreground">Practical evaluation of schedule clarity and usability</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="naming">Naming Convention</SelectItem>
              <SelectItem value="breakdown">Work Breakdown</SelectItem>
              <SelectItem value="location">Location Management</SelectItem>
              <SelectItem value="planning">Planning Integration</SelectItem>
            </SelectContent>
          </Select>
          <Select value={viewMode} onValueChange={setViewMode as (value: string) => void}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overview">Overview</SelectItem>
              <SelectItem value="detailed">Detailed</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-600">{statusCounts.pass}</div>
                <p className="text-sm text-muted-foreground">Passed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold text-yellow-600">{statusCounts.warning}</div>
                <p className="text-sm text-muted-foreground">Warnings</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <div>
                <div className="text-2xl font-bold text-red-600">{statusCounts.fail}</div>
                <p className="text-sm text-muted-foreground">Failed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{usabilityChecks.length}</div>
                <p className="text-sm text-muted-foreground">Total Checks</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score Overview */}
        <div className="lg:col-span-1">
          <ScoreOverview score={usabilityScore} />
        </div>

        {/* Usability Checks */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Usability Checklist</h3>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Re-analyze
            </Button>
          </div>

          <div className="space-y-3">
            {filteredChecks.map((check) => (
              <UsabilityCheckCard
                key={check.id}
                check={check}
                isExpanded={expandedCheck === check.id}
                onToggle={() => toggleCheck(check.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ScheduleUsabilityScore

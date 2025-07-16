/**
 * @fileoverview Fast Track Optimization Matrix
 * @module FastTrackMatrix
 * @version 3.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Displays fast-tracking opportunities and dependency logic optimization for schedule compression
 */

"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import {
  ArrowRight,
  Clock,
  GitBranch,
  Zap,
  AlertTriangle,
  CheckCircle,
  Download,
  Settings,
  RefreshCw,
  MoreVertical,
  Target,
  Activity,
  TrendingUp,
  Users,
  Shield,
} from "lucide-react"

// Types
interface FastTrackOpportunity {
  activityId: string
  activityName: string
  duration: number
  totalFloat: number
  predecessorId: string
  predecessorName: string
  currentLogic: "FS" | "SS" | "FF" | "SF"
  currentLag: number
  suggestedLogic: "FS" | "SS" | "FF" | "SF"
  suggestedLag: number
  potentialSavings: number
  riskLevel: "low" | "medium" | "high"
  complexity: "simple" | "moderate" | "complex"
  resourceConflict: boolean
  implementationEffort: number // 1-5 scale
  confidence: number // percentage
}

interface FastTrackMatrixProps {
  className?: string
  showControls?: boolean
}

// Mock fast-track opportunities - 8 activities with >10d float
const mockFastTrackOpportunities: FastTrackOpportunity[] = [
  {
    activityId: "A023",
    activityName: "MEP Rough-In",
    duration: 12,
    totalFloat: 18,
    predecessorId: "A015",
    predecessorName: "Concrete Slab",
    currentLogic: "FS",
    currentLag: 0,
    suggestedLogic: "SS",
    suggestedLag: 5,
    potentialSavings: 7,
    riskLevel: "low",
    complexity: "simple",
    resourceConflict: false,
    implementationEffort: 2,
    confidence: 85,
  },
  {
    activityId: "A019",
    activityName: "Drywall Installation",
    duration: 16,
    totalFloat: 15,
    predecessorId: "A023",
    predecessorName: "MEP Rough-In",
    currentLogic: "FS",
    currentLag: 2,
    suggestedLogic: "SS",
    suggestedLag: 8,
    potentialSavings: 6,
    riskLevel: "medium",
    complexity: "moderate",
    resourceConflict: true,
    implementationEffort: 3,
    confidence: 72,
  },
  {
    activityId: "A028",
    activityName: "Flooring Installation",
    duration: 10,
    totalFloat: 20,
    predecessorId: "A019",
    predecessorName: "Drywall Installation",
    currentLogic: "FS",
    currentLag: 0,
    suggestedLogic: "SS",
    suggestedLag: 6,
    potentialSavings: 4,
    riskLevel: "low",
    complexity: "simple",
    resourceConflict: false,
    implementationEffort: 2,
    confidence: 88,
  },
  {
    activityId: "A031",
    activityName: "Paint & Finishes",
    duration: 14,
    totalFloat: 22,
    predecessorId: "A028",
    predecessorName: "Flooring Installation",
    currentLogic: "FS",
    currentLag: 1,
    suggestedLogic: "SS",
    suggestedLag: 7,
    potentialSavings: 8,
    riskLevel: "low",
    complexity: "simple",
    resourceConflict: false,
    implementationEffort: 1,
    confidence: 92,
  },
  {
    activityId: "A034",
    activityName: "Exterior Cladding",
    duration: 12,
    totalFloat: 25,
    predecessorId: "A012",
    predecessorName: "Steel Erection",
    currentLogic: "FS",
    currentLag: 3,
    suggestedLogic: "SS",
    suggestedLag: 6,
    potentialSavings: 9,
    riskLevel: "medium",
    complexity: "moderate",
    resourceConflict: false,
    implementationEffort: 3,
    confidence: 78,
  },
  {
    activityId: "A037",
    activityName: "Landscaping",
    duration: 8,
    totalFloat: 30,
    predecessorId: "A034",
    predecessorName: "Exterior Cladding",
    currentLogic: "FS",
    currentLag: 0,
    suggestedLogic: "SS",
    suggestedLag: 4,
    potentialSavings: 4,
    riskLevel: "low",
    complexity: "simple",
    resourceConflict: false,
    implementationEffort: 1,
    confidence: 95,
  },
  {
    activityId: "A025",
    activityName: "HVAC Installation",
    duration: 18,
    totalFloat: 14,
    predecessorId: "A023",
    predecessorName: "MEP Rough-In",
    currentLogic: "FS",
    currentLag: 0,
    suggestedLogic: "SS",
    suggestedLag: 10,
    potentialSavings: 8,
    riskLevel: "high",
    complexity: "complex",
    resourceConflict: true,
    implementationEffort: 4,
    confidence: 65,
  },
  {
    activityId: "A040",
    activityName: "Final Inspections",
    duration: 5,
    totalFloat: 35,
    predecessorId: "A037",
    predecessorName: "Landscaping",
    currentLogic: "FS",
    currentLag: 2,
    suggestedLogic: "SS",
    suggestedLag: 3,
    potentialSavings: 4,
    riskLevel: "low",
    complexity: "simple",
    resourceConflict: false,
    implementationEffort: 1,
    confidence: 90,
  },
]

// Components
const OpportunityMetrics: React.FC<{ opportunities: FastTrackOpportunity[] }> = ({ opportunities }) => {
  const totalSavings = opportunities.reduce((sum, opp) => sum + opp.potentialSavings, 0)
  const avgConfidence = (opportunities.reduce((sum, opp) => sum + opp.confidence, 0) / opportunities.length).toFixed(0)
  const lowRiskCount = opportunities.filter((opp) => opp.riskLevel === "low").length
  const resourceConflicts = opportunities.filter((opp) => opp.resourceConflict).length

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-blue-500" />
          <span className="text-sm font-medium">Total Savings</span>
        </div>
        <div className="text-2xl font-bold text-blue-600">{totalSavings} days</div>
        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
          Schedule Compression
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <span className="text-sm font-medium">Low Risk</span>
        </div>
        <div className="text-2xl font-bold text-green-600">{lowRiskCount}</div>
        <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
          Safe Opportunities
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-purple-500" />
          <span className="text-sm font-medium">Avg Confidence</span>
        </div>
        <div className="text-2xl font-bold text-purple-600">{avgConfidence}%</div>
        <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
          Implementation Success
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-orange-500" />
          <span className="text-sm font-medium">Resource Conflicts</span>
        </div>
        <div className="text-2xl font-bold text-orange-600">{resourceConflicts}</div>
        <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
          Require Coordination
        </Badge>
      </div>
    </div>
  )
}

const LogicDependencyDisplay: React.FC<{
  currentLogic: string
  currentLag: number
  suggestedLogic: string
  suggestedLag: number
  predecessorName: string
  activityName: string
}> = ({ currentLogic, currentLag, suggestedLogic, suggestedLag, predecessorName, activityName }) => {
  const formatLogic = (logic: string, lag: number) => {
    const lagText = lag > 0 ? `+${lag}d` : lag < 0 ? `${lag}d` : ""
    return `${logic}${lagText}`
  }

  return (
    <div className="space-y-3 p-3 bg-muted/30 rounded-lg">
      <div className="text-sm font-medium">Dependency Logic</div>

      {/* Before */}
      <div className="space-y-2">
        <div className="text-xs text-muted-foreground">CURRENT</div>
        <div className="flex items-center gap-2 text-sm">
          <span className="truncate">{predecessorName}</span>
          <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
            {formatLogic(currentLogic, currentLag)}
          </Badge>
          <ArrowRight className="h-3 w-3 text-muted-foreground" />
          <span className="truncate">{activityName}</span>
        </div>
      </div>

      {/* After */}
      <div className="space-y-2">
        <div className="text-xs text-muted-foreground">SUGGESTED</div>
        <div className="flex items-center gap-2 text-sm">
          <span className="truncate">{predecessorName}</span>
          <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
            {formatLogic(suggestedLogic, suggestedLag)}
          </Badge>
          <ArrowRight className="h-3 w-3 text-muted-foreground" />
          <span className="truncate">{activityName}</span>
        </div>
      </div>
    </div>
  )
}

const OpportunityCard: React.FC<{
  opportunity: FastTrackOpportunity
  onImplement?: () => void
}> = ({ opportunity, onImplement }) => {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      case "medium":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "simple":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "moderate":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "complex":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <Card className="hover:bg-accent/50 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-blue-500" />
            <div>
              <CardTitle className="text-sm font-medium">{opportunity.activityName}</CardTitle>
              <div className="text-xs text-muted-foreground">{opportunity.activityId}</div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Badge variant="outline" className={cn("text-xs", getRiskColor(opportunity.riskLevel))}>
              {opportunity.riskLevel.toUpperCase()}
            </Badge>
            <Badge variant="outline" className={cn("text-xs", getComplexityColor(opportunity.complexity))}>
              {opportunity.complexity.toUpperCase()}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">Float</div>
            <div className="font-bold text-blue-600">{opportunity.totalFloat}d</div>
          </div>
          <div>
            <div className="text-muted-foreground">Savings</div>
            <div className="font-bold text-green-600">{opportunity.potentialSavings}d</div>
          </div>
          <div>
            <div className="text-muted-foreground">Confidence</div>
            <div className="font-bold text-purple-600">{opportunity.confidence}%</div>
          </div>
        </div>

        {/* Dependency Logic */}
        <LogicDependencyDisplay
          currentLogic={opportunity.currentLogic}
          currentLag={opportunity.currentLag}
          suggestedLogic={opportunity.suggestedLogic}
          suggestedLag={opportunity.suggestedLag}
          predecessorName={opportunity.predecessorName}
          activityName={opportunity.activityName}
        />

        {/* Implementation Details */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Implementation Effort</span>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-2 h-2 rounded-full",
                    i < opportunity.implementationEffort ? "bg-orange-500" : "bg-gray-200"
                  )}
                />
              ))}
            </div>
          </div>

          {opportunity.resourceConflict && (
            <div className="flex items-center gap-2 text-xs text-orange-600">
              <AlertTriangle className="h-3 w-3" />
              <span>Resource coordination required</span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <Button
          onClick={onImplement}
          size="sm"
          className="w-full"
          variant={opportunity.riskLevel === "low" ? "default" : "outline"}
        >
          <Zap className="h-3 w-3 mr-1" />
          Implement Fast Track
        </Button>
      </CardContent>
    </Card>
  )
}

const FastTrackMatrix: React.FC<FastTrackMatrixProps> = ({ className, showControls = true }) => {
  const [useMockData, setUseMockData] = useState(true)
  const [filterRisk, setFilterRisk] = useState<"all" | "low" | "medium" | "high">("all")
  const [sortBy, setSortBy] = useState<"savings" | "confidence" | "float">("savings")

  const opportunities = useMockData ? mockFastTrackOpportunities : []

  // Filter and sort opportunities
  const filteredOpportunities = opportunities
    .filter((opp) => filterRisk === "all" || opp.riskLevel === filterRisk)
    .sort((a, b) => {
      switch (sortBy) {
        case "savings":
          return b.potentialSavings - a.potentialSavings
        case "confidence":
          return b.confidence - a.confidence
        case "float":
          return b.totalFloat - a.totalFloat
        default:
          return 0
      }
    })

  const handleImplement = (opportunityId: string) => {
    console.log(`Implementing fast track for ${opportunityId}`)
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-500" />
            <div>
              <CardTitle>Fast Track Optimization Matrix</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Schedule compression through dependency logic optimization
              </p>
            </div>
          </div>

          {showControls && (
            <div className="flex items-center gap-2">
              <Select
                value={filterRisk}
                onValueChange={(value: "all" | "low" | "medium" | "high") => setFilterRisk(value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risk</SelectItem>
                  <SelectItem value="low">Low Risk</SelectItem>
                  <SelectItem value="medium">Medium Risk</SelectItem>
                  <SelectItem value="high">High Risk</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(value: "savings" | "confidence" | "float") => setSortBy(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="savings">By Savings</SelectItem>
                  <SelectItem value="confidence">By Confidence</SelectItem>
                  <SelectItem value="float">By Float</SelectItem>
                </SelectContent>
              </Select>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Download className="h-4 w-4 mr-2" />
                    Export Matrix
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="h-4 w-4 mr-2" />
                    Configure Rules
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh Analysis
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          {/* Metrics Overview */}
          <OpportunityMetrics opportunities={filteredOpportunities} />

          {/* Opportunities Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Fast Track Opportunities</h4>
              <Badge variant="outline" className="text-xs">
                {filteredOpportunities.length} activities with {">"} 10 days float
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredOpportunities.map((opportunity) => (
                <OpportunityCard
                  key={opportunity.activityId}
                  opportunity={opportunity}
                  onImplement={() => handleImplement(opportunity.activityId)}
                />
              ))}
            </div>
          </div>

          {/* Summary Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">50 days</div>
              <div className="text-sm text-muted-foreground">Total Schedule Compression</div>
              <div className="text-xs text-muted-foreground mt-1">Maximum potential savings</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">5/8</div>
              <div className="text-sm text-muted-foreground">Low Risk Opportunities</div>
              <div className="text-xs text-muted-foreground mt-1">Safe to implement immediately</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">81%</div>
              <div className="text-sm text-muted-foreground">Average Confidence</div>
              <div className="text-xs text-muted-foreground mt-1">Implementation success rate</div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-4 pt-4 border-t">
            <div className="flex items-center gap-2">
              <Switch checked={useMockData} onCheckedChange={setUseMockData} />
              <span className="text-sm">Mock Data</span>
            </div>

            <div className="flex items-center gap-1 text-sm text-muted-foreground ml-auto">
              <GitBranch className="h-4 w-4" />
              <span>8 Fast Track Opportunities • FS → SS Logic Changes</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default FastTrackMatrix

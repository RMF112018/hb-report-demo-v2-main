"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  UserCheck,
  Target,
  Brain,
  Heart,
  Zap,
  Shield,
  Star,
  Eye,
  BarChart3,
  Lightbulb,
  MessageSquare,
  Settings,
  ArrowRight,
  Users2,
  UserPlus,
  UserMinus,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface BehavioralProfile {
  discProfile: {
    type: string
    primaryStyle: string
    secondaryStyle: string
    summary: string
    strengths: string[]
    growthAreas: string[]
    communicationTips: string[]
    stressResponse: string
    motivators: string[]
    deMotivators: string[]
  }
  integrus360: {
    leadershipType: string
    color: string
    profile: {
      type: string
      description: string
      leadershipStrengths: string[]
      developmentAreas: string[]
      communicationStyle: string
      conflictResolution: string
      teamMotivation: string
      stressManagement: string
    }
  }
  teamCompatibility: {
    overallScore: number
    compatibilityMatrix: Record<string, { score: number; notes: string }>
    teamDynamics: string[]
    recommendations: string[]
  }
}

interface StaffMember {
  id: string
  name: string
  position: string
  behavioralProfile?: BehavioralProfile
}

interface TeamCompatibilityEngineProps {
  candidate: StaffMember
  existingTeam: StaffMember[]
  projectId?: number
  onTeamAnalysis?: (analysis: TeamAnalysis) => void
}

interface TeamAnalysis {
  overallCompatibility: number
  teamDiversity: number
  leadershipBalance: number
  communicationBalance: number
  riskFactors: string[]
  recommendations: string[]
  optimalTeamSize: number
  missingRoles: string[]
}

interface CompatibilityScore {
  memberId: string
  memberName: string
  score: number
  level: "Excellent" | "Good" | "Fair" | "Poor"
  notes: string
  riskFactors: string[]
}

export const TeamCompatibilityEngine: React.FC<TeamCompatibilityEngineProps> = ({
  candidate,
  existingTeam,
  projectId,
  onTeamAnalysis,
}) => {
  const teamAnalysis = useMemo(() => {
    if (!candidate.behavioralProfile) {
      return {
        overallCompatibility: 0,
        teamDiversity: 0,
        leadershipBalance: 0,
        communicationBalance: 0,
        riskFactors: ["No behavioral assessment available for candidate"],
        recommendations: ["Schedule behavioral assessment for better team placement"],
        optimalTeamSize: existingTeam.length,
        missingRoles: [],
      }
    }

    // Calculate compatibility scores with existing team members
    const compatibilityScores: CompatibilityScore[] = existingTeam.map((member) => {
      const compatibility = candidate.behavioralProfile!.teamCompatibility.compatibilityMatrix[member.id]
      const score = compatibility?.score || 50 // Default score if no data

      return {
        memberId: member.id,
        memberName: member.name,
        score,
        level: score >= 85 ? "Excellent" : score >= 70 ? "Good" : score >= 50 ? "Fair" : "Poor",
        notes: compatibility?.notes || "No compatibility data available",
        riskFactors: score < 70 ? [`Potential conflict with ${member.name}`] : [],
      }
    })

    // Calculate overall team compatibility
    const overallCompatibility =
      compatibilityScores.length > 0
        ? compatibilityScores.reduce((sum, score) => sum + score.score, 0) / compatibilityScores.length
        : 0

    // Analyze team diversity
    const discTypes = [
      candidate.behavioralProfile.discProfile.type,
      ...existingTeam
        .map((m) => m.behavioralProfile?.discProfile.type)
        .filter((type): type is string => type !== undefined),
    ]
    const uniqueDiscTypes = new Set(discTypes)
    const teamDiversity = (uniqueDiscTypes.size / discTypes.length) * 100

    // Analyze leadership balance
    const leadershipTypes = [
      candidate.behavioralProfile.integrus360.leadershipType,
      ...existingTeam
        .map((m) => m.behavioralProfile?.integrus360.leadershipType)
        .filter((type): type is string => type !== undefined),
    ]
    const driverTypes = leadershipTypes.filter((type) => type === "Driver").length
    const supporterTypes = leadershipTypes.filter((type) => type === "Supporter").length
    const leadershipBalance = Math.abs(driverTypes - supporterTypes) <= 1 ? 90 : 60

    // Analyze communication balance
    const communicationStyles = [
      candidate.behavioralProfile.discProfile.primaryStyle,
      ...existingTeam
        .map((m) => m.behavioralProfile?.discProfile.primaryStyle)
        .filter((style): style is string => style !== undefined),
    ]
    const taskFocused = communicationStyles.filter((style) => ["Dominance", "Conscientiousness"].includes(style)).length
    const peopleFocused = communicationStyles.filter((style) => ["Influence", "Steadiness"].includes(style)).length
    const communicationBalance = Math.abs(taskFocused - peopleFocused) <= 1 ? 85 : 65

    // Identify risk factors
    const riskFactors: string[] = []
    if (overallCompatibility < 70) riskFactors.push("Low overall team compatibility")
    if (teamDiversity < 60) riskFactors.push("Limited behavioral diversity")
    if (leadershipBalance < 70) riskFactors.push("Leadership style imbalance")
    if (communicationBalance < 70) riskFactors.push("Communication style imbalance")

    compatibilityScores.forEach((score) => {
      if (score.score < 60) {
        riskFactors.push(`High conflict risk with ${score.memberName}`)
      }
    })

    // Generate recommendations
    const recommendations: string[] = []
    if (overallCompatibility >= 80) {
      recommendations.push("Excellent team fit - recommend assignment")
    } else if (overallCompatibility >= 70) {
      recommendations.push("Good team fit - consider with minor adjustments")
    } else if (overallCompatibility >= 50) {
      recommendations.push("Fair team fit - requires careful monitoring")
    } else {
      recommendations.push("Poor team fit - consider alternative assignment")
    }

    if (teamDiversity < 60) {
      recommendations.push("Consider adding team members with different behavioral styles")
    }

    if (leadershipBalance < 70) {
      recommendations.push("Balance leadership styles for better team dynamics")
    }

    if (communicationBalance < 70) {
      recommendations.push("Ensure mix of task-focused and people-focused team members")
    }

    // Determine optimal team size
    const currentSize = existingTeam.length + 1
    const optimalTeamSize = currentSize <= 3 ? currentSize : Math.min(currentSize, 6)

    // Identify missing roles based on behavioral gaps
    const missingRoles: string[] = []
    if (taskFocused === 0) missingRoles.push("Task-focused team member")
    if (peopleFocused === 0) missingRoles.push("People-focused team member")
    if (driverTypes === 0) missingRoles.push("Driver/action-oriented leader")
    if (supporterTypes === 0) missingRoles.push("Supporter/relationship-focused leader")

    const analysis: TeamAnalysis = {
      overallCompatibility,
      teamDiversity,
      leadershipBalance,
      communicationBalance,
      riskFactors,
      recommendations,
      optimalTeamSize,
      missingRoles,
    }

    if (onTeamAnalysis) {
      onTeamAnalysis(analysis)
    }

    return analysis
  }, [candidate, existingTeam, onTeamAnalysis])

  const getScoreColor = (score: number) => {
    if (score >= 85) return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
    if (score >= 70) return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
    if (score >= 50) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
    return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
  }

  const getRiskLevel = (riskFactors: string[]) => {
    if (riskFactors.length === 0)
      return { level: "Low", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" }
    if (riskFactors.length <= 2)
      return { level: "Medium", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" }
    return { level: "High", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" }
  }

  if (!candidate.behavioralProfile) {
    return (
      <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm font-medium">No Behavioral Assessment Available</span>
          </div>
          <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
            {candidate.name} does not have a behavioral assessment on file. Team compatibility analysis requires
            behavioral data.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          Team Compatibility Analysis
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Overview Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium">Team Compatibility</span>
            </div>
            <div className="text-2xl font-bold">{Math.round(teamAnalysis.overallCompatibility)}%</div>
            <Progress value={teamAnalysis.overallCompatibility} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium">Team Diversity</span>
            </div>
            <div className="text-2xl font-bold">{Math.round(teamAnalysis.teamDiversity)}%</div>
            <Progress value={teamAnalysis.teamDiversity} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium">Leadership Balance</span>
            </div>
            <div className="text-2xl font-bold">{Math.round(teamAnalysis.leadershipBalance)}%</div>
            <Progress value={teamAnalysis.leadershipBalance} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              <span className="text-sm font-medium">Communication Balance</span>
            </div>
            <div className="text-2xl font-bold">{Math.round(teamAnalysis.communicationBalance)}%</div>
            <Progress value={teamAnalysis.communicationBalance} className="h-2" />
          </div>
        </div>

        {/* Risk Assessment */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            <span className="font-medium">Risk Assessment</span>
            <Badge variant="outline" className={getRiskLevel(teamAnalysis.riskFactors).color}>
              {getRiskLevel(teamAnalysis.riskFactors).level} Risk
            </Badge>
          </div>

          {teamAnalysis.riskFactors.length > 0 ? (
            <div className="space-y-2">
              {teamAnalysis.riskFactors.map((risk, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <AlertTriangle className="h-3 w-3 text-orange-600 dark:text-orange-400" />
                  {risk}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
              <CheckCircle2 className="h-3 w-3" />
              No significant risk factors identified
            </div>
          )}
        </div>

        {/* Recommendations */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="font-medium">Recommendations</span>
          </div>

          <div className="space-y-2">
            {teamAnalysis.recommendations.map((rec, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <ArrowRight className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                {rec}
              </div>
            ))}
          </div>
        </div>

        {/* Team Composition Analysis */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Users2 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            <span className="font-medium">Team Composition</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-sm font-medium">Current Team Size</div>
              <div className="text-2xl font-bold">{existingTeam.length + 1}</div>
              <div className="text-xs text-muted-foreground">Optimal: {teamAnalysis.optimalTeamSize} members</div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Missing Roles</div>
              {teamAnalysis.missingRoles.length > 0 ? (
                <div className="space-y-1">
                  {teamAnalysis.missingRoles.map((role, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <UserPlus className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                      {role}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                  <CheckCircle2 className="h-3 w-3" />
                  Well-balanced team composition
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2">
          <Button size="sm" className="flex-1">
            <UserCheck className="h-4 w-4 mr-2" />
            Assign to Team
          </Button>
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            View Detailed Analysis
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

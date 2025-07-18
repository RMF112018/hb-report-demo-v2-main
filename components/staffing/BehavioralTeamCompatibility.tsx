"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
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
  ChevronDown,
  ChevronUp,
  Eye,
  BarChart3,
  Lightbulb,
  MessageSquare,
  Settings,
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

interface BehavioralTeamCompatibilityProps {
  staffMember: StaffMember
  existingTeamMembers: StaffMember[]
  projectId?: number
  onCompatibilitySelect?: (compatibilityScore: number) => void
  showDetailedAnalysis?: boolean
}

export const BehavioralTeamCompatibility: React.FC<BehavioralTeamCompatibilityProps> = ({
  staffMember,
  existingTeamMembers,
  projectId,
  onCompatibilitySelect,
  showDetailedAnalysis = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  if (!staffMember.behavioralProfile) {
    return (
      <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm font-medium">No Behavioral Assessment Available</span>
          </div>
          <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
            {staffMember.name} does not have a behavioral assessment on file. Consider scheduling an assessment for
            better team placement decisions.
          </p>
        </CardContent>
      </Card>
    )
  }

  const { behavioralProfile } = staffMember
  const { discProfile, integrus360, teamCompatibility } = behavioralProfile

  const getCompatibilityScore = (memberId: string) => {
    return teamCompatibility.compatibilityMatrix[memberId]?.score || 0
  }

  const getCompatibilityColor = (score: number) => {
    if (score >= 85) return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
    if (score >= 70) return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
    if (score >= 50) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
    return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
  }

  const getCompatibilityLevel = (score: number) => {
    if (score >= 85) return "Excellent"
    if (score >= 70) return "Good"
    if (score >= 50) return "Fair"
    return "Poor"
  }

  const getIntegrusColor = (color: string) => {
    const colors = {
      Red: "text-red-600 dark:text-red-400",
      Blue: "text-blue-600 dark:text-blue-400",
      Green: "text-green-600 dark:text-green-400",
      Yellow: "text-yellow-600 dark:text-yellow-400",
    }
    return colors[color as keyof typeof colors] || "text-gray-600 dark:text-gray-400"
  }

  const getDiscColor = (type: string) => {
    const colors = {
      DI: "text-blue-600 dark:text-blue-400",
      DC: "text-red-600 dark:text-red-400",
      CS: "text-green-600 dark:text-green-400",
      CD: "text-purple-600 dark:text-purple-400",
      IS: "text-yellow-600 dark:text-yellow-400",
      IC: "text-orange-600 dark:text-orange-400",
      SI: "text-teal-600 dark:text-teal-400",
      SC: "text-indigo-600 dark:text-indigo-400",
    }
    return colors[type as keyof typeof colors] || "text-gray-600 dark:text-gray-400"
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Brain className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Behavioral Team Compatibility
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={getCompatibilityColor(teamCompatibility.overallScore)}>
              {teamCompatibility.overallScore}% Match
            </Badge>
            <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="h-8 w-8 p-0">
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Overview Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium">Overall Compatibility</span>
            </div>
            <div className="text-2xl font-bold">{teamCompatibility.overallScore}%</div>
            <Progress value={teamCompatibility.overallScore} className="h-2" />
            <div className="text-xs text-muted-foreground">
              {getCompatibilityLevel(teamCompatibility.overallScore)} team fit
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium">Team Members</span>
            </div>
            <div className="text-2xl font-bold">{existingTeamMembers.length}</div>
            <div className="text-xs text-muted-foreground">
              {existingTeamMembers.filter((m) => getCompatibilityScore(m.id) >= 70).length} good matches
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              <span className="text-sm font-medium">Profile Type</span>
            </div>
            <div className="text-lg font-semibold">
              <span className={getDiscColor(discProfile.type)}>{discProfile.type}</span>
              {" • "}
              <span className={getIntegrusColor(integrus360.color)}>{integrus360.leadershipType}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              {discProfile.primaryStyle} • {discProfile.secondaryStyle}
            </div>
          </div>
        </div>

        {/* Detailed Analysis */}
        {showDetailedAnalysis && (
          <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
            <CollapsibleContent className="space-y-4">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="team">Team Analysis</TabsTrigger>
                  <TabsTrigger value="disc">DiSC Profile</TabsTrigger>
                  <TabsTrigger value="integrus">Integrus 360</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Lightbulb className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          Key Strengths
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {discProfile.strengths.slice(0, 3).map((strength, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              <CheckCircle2 className="h-3 w-3 text-green-600 dark:text-green-400" />
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Target className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                          Development Areas
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {discProfile.growthAreas.slice(0, 3).map((area, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              <AlertTriangle className="h-3 w-3 text-yellow-600 dark:text-yellow-400" />
                              {area}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        Team Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {teamCompatibility.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <Settings className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="team" className="space-y-4">
                  <div className="space-y-3">
                    <h4 className="font-medium">Team Compatibility Matrix</h4>
                    {existingTeamMembers.length > 0 ? (
                      <div className="space-y-2">
                        {existingTeamMembers.map((member) => {
                          const score = getCompatibilityScore(member.id)
                          const notes = teamCompatibility.compatibilityMatrix[member.id]?.notes || "No data available"

                          return (
                            <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex-1">
                                <div className="font-medium">{member.name}</div>
                                <div className="text-sm text-muted-foreground">{member.position}</div>
                                <div className="text-xs text-muted-foreground mt-1">{notes}</div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className={getCompatibilityColor(score)}>
                                  {score}%
                                </Badge>
                                <div className="text-xs text-muted-foreground">{getCompatibilityLevel(score)}</div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <div className="text-sm">No existing team members to compare against</div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="disc" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Profile Summary</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{discProfile.summary}</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Communication Style</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {discProfile.communicationTips.slice(0, 3).map((tip, index) => (
                            <li key={index} className="text-sm flex items-center gap-2">
                              <MessageSquare className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Motivators</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1">
                          {discProfile.motivators.map((motivator, index) => (
                            <li key={index} className="text-sm flex items-center gap-2">
                              <Zap className="h-3 w-3 text-yellow-600 dark:text-yellow-400" />
                              {motivator}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Stress Response</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{discProfile.stressResponse}</p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="integrus" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Leadership Profile</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{integrus360.profile.description}</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Leadership Style</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Type:</span>
                            <Badge variant="outline" className={getIntegrusColor(integrus360.color)}>
                              {integrus360.leadershipType}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Color:</span>
                            <Badge variant="outline" className={getIntegrusColor(integrus360.color)}>
                              {integrus360.color}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Leadership Strengths</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {integrus360.profile.leadershipStrengths.map((strength, index) => (
                            <li key={index} className="text-sm flex items-center gap-2">
                              <CheckCircle2 className="h-3 w-3 text-green-600 dark:text-green-400" />
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Development Areas</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {integrus360.profile.developmentAreas.map((area, index) => (
                            <li key={index} className="text-sm flex items-center gap-2">
                              <AlertTriangle className="h-3 w-3 text-yellow-600 dark:text-yellow-400" />
                              {area}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Action Buttons */}
        {onCompatibilitySelect && (
          <div className="flex items-center gap-2 pt-2">
            <Button size="sm" onClick={() => onCompatibilitySelect(teamCompatibility.overallScore)} className="flex-1">
              <UserCheck className="h-4 w-4 mr-2" />
              Use This Compatibility Score
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
              <Eye className="h-4 w-4 mr-2" />
              {isExpanded ? "Hide Details" : "Show Details"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

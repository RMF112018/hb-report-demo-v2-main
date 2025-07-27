"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, AlertTriangle, Star, Users, Target, TrendingUp } from "lucide-react"

interface DiscProfile {
  type: string
  primaryStyle: string
  secondaryStyle: string
  summary: string
  strengths: string[]
  growthAreas: string[]
}

interface IntegrusProfile {
  leadershipType: string
  color: string
  profile: {
    type: string
    description: string
    leadershipStrengths: string[]
    developmentAreas: string[]
  }
}

interface CandidateAssessment {
  candidateId: string
  firstName: string
  lastName: string
  jobId: string
  jobTitle: string
  discProfile: DiscProfile
  integrus360: IntegrusProfile
  culturalFitScore: number
  teamCompatibility: {
    overallScore: number
    compatibilityNotes: string
    recommendations: string[]
  }
}

interface JobCriteria {
  title: string
  targetDiscProfiles: string[]
  targetIntegrusTypes: string[]
  culturalFitCriteria: {
    leadershipOriented: boolean
    resultsDriven: boolean
    teamCollaboration: boolean
    detailOriented: boolean
    processFocused: boolean
  }
  priorityWeight: number
}

interface CulturalFitEvaluationProps {
  candidate: CandidateAssessment
  jobCriteria: JobCriteria
  onPrioritize?: (candidateId: string) => void
  isPrioritized?: boolean
}

const discColors = {
  D: "#DC2626",
  I: "#F59E0B",
  S: "#059669",
  C: "#2563EB",
}

const integrusColors = {
  Driver: "#DC2626",
  Creator: "#F59E0B",
  Supporter: "#2563EB",
  Refiner: "#059669",
}

export default function CulturalFitEvaluation({
  candidate,
  jobCriteria,
  onPrioritize,
  isPrioritized = false,
}: CulturalFitEvaluationProps) {
  const discMatch = jobCriteria.targetDiscProfiles.includes(candidate.discProfile.type)
  const integrusMatch = jobCriteria.targetIntegrusTypes.includes(candidate.integrus360.leadershipType)

  const getMatchScore = () => {
    let score = 0
    if (discMatch) score += 40
    if (integrusMatch) score += 30
    if (candidate.culturalFitScore >= 80) score += 20
    if (candidate.teamCompatibility.overallScore >= 80) score += 10
    return Math.min(score, 100)
  }

  const matchScore = getMatchScore()

  const getMatchLevel = (score: number) => {
    if (score >= 90)
      return {
        level: "Excellent",
        color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
        icon: CheckCircle,
      }
    if (score >= 70)
      return {
        level: "Good",
        color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
        icon: TrendingUp,
      }
    if (score >= 50)
      return {
        level: "Fair",
        color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
        icon: AlertTriangle,
      }
    return { level: "Poor", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400", icon: XCircle }
  }

  const matchLevel = getMatchLevel(matchScore)

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Cultural Fit Evaluation
            </CardTitle>
            <CardDescription>
              {candidate.firstName} {candidate.lastName} - {candidate.jobTitle}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={matchLevel.color}>
              <matchLevel.icon className="h-3 w-3 mr-1" />
              {matchLevel.level} Match
            </Badge>
            {onPrioritize && (
              <Button
                variant={isPrioritized ? "default" : "outline"}
                size="sm"
                onClick={() => onPrioritize(candidate.candidateId)}
                className={isPrioritized ? "bg-green-600 hover:bg-green-700" : ""}
              >
                <Star className="h-4 w-4 mr-1" />
                {isPrioritized ? "Prioritized" : "Prioritize"}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Match Score */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Overall Match Score</span>
            <span className="text-2xl font-bold text-primary">{matchScore}%</span>
          </div>
          <Progress value={matchScore} className="h-3" />
        </div>

        <Tabs defaultValue="disc" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="disc">DiSC Profile</TabsTrigger>
            <TabsTrigger value="integrus">Integrus 360</TabsTrigger>
            <TabsTrigger value="compatibility">Team Fit</TabsTrigger>
          </TabsList>

          <TabsContent value="disc" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: discColors[candidate.discProfile.type[0] as keyof typeof discColors] }}
                  />
                  <span className="font-medium">{candidate.discProfile.type}</span>
                  <span className="text-sm text-muted-foreground">
                    {candidate.discProfile.primaryStyle} / {candidate.discProfile.secondaryStyle}
                  </span>
                </div>
                <Badge variant={discMatch ? "default" : "secondary"}>{discMatch ? "Target Match" : "Not Target"}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{candidate.discProfile.summary}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm mb-2">Strengths</h4>
                  <ul className="text-sm space-y-1">
                    {candidate.discProfile.strengths.map((strength, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-600 dark:text-green-400" />
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-2">Growth Areas</h4>
                  <ul className="text-sm space-y-1">
                    {candidate.discProfile.growthAreas.map((area, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <AlertTriangle className="h-3 w-3 text-yellow-600 dark:text-yellow-400" />
                        {area}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="integrus" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{
                      backgroundColor:
                        integrusColors[candidate.integrus360.leadershipType as keyof typeof integrusColors],
                    }}
                  />
                  <span className="font-medium">{candidate.integrus360.leadershipType}</span>
                </div>
                <Badge variant={integrusMatch ? "default" : "secondary"}>
                  {integrusMatch ? "Target Match" : "Not Target"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{candidate.integrus360.profile.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm mb-2">Leadership Strengths</h4>
                  <ul className="text-sm space-y-1">
                    {candidate.integrus360.profile.leadershipStrengths.map((strength, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-600 dark:text-green-400" />
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-2">Development Areas</h4>
                  <ul className="text-sm space-y-1">
                    {candidate.integrus360.profile.developmentAreas.map((area, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <AlertTriangle className="h-3 w-3 text-yellow-600 dark:text-yellow-400" />
                        {area}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="compatibility" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Team Compatibility Score</span>
                <span className="text-xl font-bold text-primary">{candidate.teamCompatibility.overallScore}%</span>
              </div>
              <Progress value={candidate.teamCompatibility.overallScore} className="h-3" />
              <p className="text-sm text-muted-foreground">{candidate.teamCompatibility.compatibilityNotes}</p>
              <div>
                <h4 className="font-medium text-sm mb-2">Recommendations</h4>
                <ul className="text-sm space-y-1">
                  {candidate.teamCompatibility.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Target className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Job Criteria Alignment */}
        <div className="border-t pt-4">
          <h4 className="font-medium text-sm mb-3">Job Criteria Alignment</h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {Object.entries(jobCriteria.culturalFitCriteria).map(([criterion, required]) => (
              <div key={criterion} className="flex items-center gap-2">
                {required ? (
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                ) : (
                  <XCircle className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                )}
                <span className="text-xs capitalize">{criterion.replace(/([A-Z])/g, " $1").trim()}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

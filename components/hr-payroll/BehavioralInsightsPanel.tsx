"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Users,
  Target,
  TrendingUp,
  Lightbulb,
  MessageSquare,
  Star,
  CheckCircle,
  AlertTriangle,
  Clock,
  Award,
  BookOpen,
  UserCheck,
  Brain,
  Heart,
  Zap,
  Shield,
} from "lucide-react"

interface DiscProfile {
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

interface IntegrusProfile {
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

interface BehavioralInsightsPanelProps {
  employeeId: string
  employeeName: string
  discProfile: DiscProfile
  integrusProfile: IntegrusProfile
  reviewType: "annual" | "quarterly" | "probationary"
  previousReviewDate?: string
  onTrackChanges?: (changes: any) => void
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

export default function BehavioralInsightsPanel({
  employeeId,
  employeeName,
  discProfile,
  integrusProfile,
  reviewType,
  previousReviewDate,
  onTrackChanges,
}: BehavioralInsightsPanelProps) {
  const getReviewTone = () => {
    const isHighD = discProfile.type.includes("D")
    const isHighI = discProfile.type.includes("I")
    const isHighS = discProfile.type.includes("S")
    const isHighC = discProfile.type.includes("C")

    if (isHighD) {
      return {
        approach: "Direct and results-focused",
        tips: [
          "Be concise and action-oriented",
          "Focus on outcomes and achievements",
          "Provide clear next steps",
          "Allow them to take charge of their development",
        ],
      }
    } else if (isHighI) {
      return {
        approach: "Enthusiastic and relationship-focused",
        tips: [
          "Start with positive recognition",
          "Use encouraging and motivational language",
          "Focus on team collaboration",
          "Provide opportunities for social interaction",
        ],
      }
    } else if (isHighS) {
      return {
        approach: "Patient and supportive",
        tips: [
          "Create a comfortable, non-threatening environment",
          "Provide detailed explanations",
          "Focus on stability and consistency",
          "Give them time to process information",
        ],
      }
    } else if (isHighC) {
      return {
        approach: "Analytical and detail-oriented",
        tips: [
          "Provide specific, data-driven feedback",
          "Focus on quality and accuracy",
          "Allow time for questions and clarification",
          "Present information systematically",
        ],
      }
    }

    return {
      approach: "Balanced and adaptive",
      tips: [
        "Match their communication style",
        "Provide both big picture and details",
        "Be flexible in your approach",
        "Focus on their primary motivators",
      ],
    }
  }

  const getDevelopmentPaths = () => {
    const paths = []

    // Leadership development based on Integrus type
    switch (integrusProfile.leadershipType) {
      case "Driver":
        paths.push({
          title: "Strategic Leadership",
          description: "Develop long-term strategic thinking and planning skills",
          icon: Target,
          priority: "high",
        })
        paths.push({
          title: "Emotional Intelligence",
          description: "Enhance relationship-building and team motivation skills",
          icon: Heart,
          priority: "medium",
        })
        break
      case "Creator":
        paths.push({
          title: "Execution Excellence",
          description: "Develop systematic planning and follow-through skills",
          icon: CheckCircle,
          priority: "high",
        })
        paths.push({
          title: "Process Optimization",
          description: "Learn to balance creativity with operational efficiency",
          icon: TrendingUp,
          priority: "medium",
        })
        break
      case "Supporter":
        paths.push({
          title: "Strategic Decision Making",
          description: "Develop confidence in making difficult decisions",
          icon: Brain,
          priority: "high",
        })
        paths.push({
          title: "Direct Communication",
          description: "Enhance ability to provide direct feedback",
          icon: MessageSquare,
          priority: "medium",
        })
        break
      case "Refiner":
        paths.push({
          title: "Strategic Leadership",
          description: "Develop big-picture thinking and vision",
          icon: Target,
          priority: "high",
        })
        paths.push({
          title: "Initiative Taking",
          description: "Build confidence in taking action and making decisions",
          icon: Zap,
          priority: "medium",
        })
        break
    }

    // DiSC-based development
    if (discProfile.type.includes("D")) {
      paths.push({
        title: "Relationship Building",
        description: "Develop patience and team collaboration skills",
        icon: Users,
        priority: "medium",
      })
    }
    if (discProfile.type.includes("I")) {
      paths.push({
        title: "Detail Management",
        description: "Improve attention to detail and follow-through",
        icon: Shield,
        priority: "medium",
      })
    }
    if (discProfile.type.includes("S")) {
      paths.push({
        title: "Initiative Taking",
        description: "Build confidence in taking action and making decisions",
        icon: Zap,
        priority: "medium",
      })
    }
    if (discProfile.type.includes("C")) {
      paths.push({
        title: "Flexibility",
        description: "Develop adaptability to change and new situations",
        icon: TrendingUp,
        priority: "medium",
      })
    }

    return paths
  }

  const reviewTone = getReviewTone()
  const developmentPaths = getDevelopmentPaths()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Behavioral Insights
          </CardTitle>
          <CardDescription>
            Guide for {reviewType} review conversation with {employeeName}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="disc" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="disc">DiSC Profile</TabsTrigger>
              <TabsTrigger value="integrus">Integrus 360</TabsTrigger>
              <TabsTrigger value="guidance">Review Guidance</TabsTrigger>
            </TabsList>

            <TabsContent value="disc" className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: discColors[discProfile.type[0] as keyof typeof discColors] }}
                  />
                  <span className="font-medium">{discProfile.type}</span>
                  <span className="text-sm text-muted-foreground">
                    {discProfile.primaryStyle} / {discProfile.secondaryStyle}
                  </span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{discProfile.summary}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    Key Strengths
                  </h4>
                  <ul className="text-sm space-y-1">
                    {discProfile.strengths.map((strength, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    Growth Areas
                  </h4>
                  <ul className="text-sm space-y-1">
                    {discProfile.growthAreas.map((area, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <AlertTriangle className="h-3 w-3 text-yellow-600" />
                        {area}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  Communication Tips
                </h4>
                <ul className="text-sm space-y-1">
                  {discProfile.communicationTips.map((tip, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Lightbulb className="h-3 w-3 text-blue-600" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="integrus" className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{
                      backgroundColor: integrusColors[integrusProfile.leadershipType as keyof typeof integrusColors],
                    }}
                  />
                  <span className="font-medium">{integrusProfile.leadershipType}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{integrusProfile.profile.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm mb-2">Leadership Strengths</h4>
                  <ul className="text-sm space-y-1">
                    {integrusProfile.profile.leadershipStrengths.map((strength, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Award className="h-3 w-3 text-green-600" />
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-2">Development Areas</h4>
                  <ul className="text-sm space-y-1">
                    {integrusProfile.profile.developmentAreas.map((area, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <BookOpen className="h-3 w-3 text-blue-600" />
                        {area}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm mb-2">Communication Style</h4>
                  <p className="text-sm text-muted-foreground">{integrusProfile.profile.communicationStyle}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-2">Team Motivation</h4>
                  <p className="text-sm text-muted-foreground">{integrusProfile.profile.teamMotivation}</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="guidance" className="space-y-4">
              <div>
                <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  Recommended Approach
                </h4>
                <p className="text-sm text-muted-foreground mb-3">{reviewTone.approach}</p>
                <ul className="text-sm space-y-1">
                  {reviewTone.tips.map((tip, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium text-sm mb-3 flex items-center gap-1">
                  <Target className="h-3 w-3" />
                  Leadership Development Paths
                </h4>
                <div className="space-y-3">
                  {developmentPaths.map((path, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-start gap-2">
                        <path.icon className="h-4 w-4 mt-0.5 text-primary" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h5 className="font-medium text-sm">{path.title}</h5>
                            <Badge variant={path.priority === "high" ? "default" : "secondary"} className="text-xs">
                              {path.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{path.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Behavioral Tracking
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Motivation Level</span>
                    <Badge variant="outline" className="text-xs">
                      High
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Stress Response</span>
                    <Badge variant="outline" className="text-xs">
                      Adaptive
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Team Collaboration</span>
                    <Badge variant="outline" className="text-xs">
                      Strong
                    </Badge>
                  </div>
                </div>
                {previousReviewDate && (
                  <div className="mt-3 p-2 bg-muted rounded text-xs">
                    <div className="flex items-center gap-1 mb-1">
                      <Clock className="h-3 w-3" />
                      <span className="font-medium">Previous Review</span>
                    </div>
                    <p className="text-muted-foreground">
                      Last review: {new Date(previousReviewDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

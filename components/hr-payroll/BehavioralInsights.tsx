"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Users,
  UserCheck,
  TrendingUp,
  FileText,
  Download,
  Eye,
  Target,
  Heart,
  Brain,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Star,
  Award,
  Users2,
  BarChart3,
  PieChart,
  Activity,
  Calendar,
  Clock,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

interface DiSCProfile {
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

interface Integrus360Profile {
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
    pdfUrl: string
    lastUpdated: string
  }
}

interface TeamCompatibility {
  overallScore: number
  compatibilityMatrix: Record<string, { score: number; notes: string }>
  teamDynamics: string[]
  recommendations: string[]
}

interface BehavioralAssessment {
  employeeId: string
  employeeName: string
  department: string
  position: string
  discProfile: DiSCProfile
  integrus360: Integrus360Profile
  teamCompatibility: TeamCompatibility
}

interface BehavioralInsightsProps {
  assessment: BehavioralAssessment
  allAssessments?: BehavioralAssessment[]
}

const BehavioralInsights: React.FC<BehavioralInsightsProps> = ({ assessment, allAssessments = [] }) => {
  const [activeTab, setActiveTab] = useState("disc")
  const [showIntegrusModal, setShowIntegrusModal] = useState(false)
  const [showTeamModal, setShowTeamModal] = useState(false)

  const getDiSCColor = (style: string) => {
    switch (style) {
      case "Dominance":
        return "bg-red-500"
      case "Influence":
        return "bg-yellow-500"
      case "Steadiness":
        return "bg-green-500"
      case "Conscientiousness":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const getIntegrusColor = (type: string) => {
    switch (type) {
      case "Driver":
        return "bg-red-500"
      case "Creator":
        return "bg-yellow-500"
      case "Supporter":
        return "bg-blue-500"
      case "Refiner":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getCompatibilityColor = (score: number) => {
    if (score >= 90) return "text-green-600 dark:text-green-400"
    if (score >= 80) return "text-blue-600 dark:text-blue-400"
    if (score >= 70) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  const getCompatibilityBadge = (score: number) => {
    if (score >= 90) return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
    if (score >= 80) return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
    if (score >= 70) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
    return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Behavioral Insights</h2>
          <p className="text-muted-foreground mt-1">
            Personality profiles, leadership assessments, and team compatibility analysis
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Assessment
          </Button>
        </div>
      </div>

      {/* Assessment Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Assessment Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${getDiSCColor(assessment.discProfile.primaryStyle)}`} />
              <div>
                <p className="text-sm font-medium">DiSC Profile</p>
                <p className="text-xs text-muted-foreground">{assessment.discProfile.type}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${getIntegrusColor(assessment.integrus360.leadershipType)}`} />
              <div>
                <p className="text-sm font-medium">Integrus 360</p>
                <p className="text-xs text-muted-foreground">{assessment.integrus360.leadershipType}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-purple-500" />
              <div>
                <p className="text-sm font-medium">Team Compatibility</p>
                <p className="text-xs text-muted-foreground">{assessment.teamCompatibility.overallScore}%</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assessment Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="disc" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            DiSC Profile
          </TabsTrigger>
          <TabsTrigger value="integrus" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            Integrus 360
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center gap-2">
            <Users2 className="h-4 w-4" />
            Team Compatibility
          </TabsTrigger>
        </TabsList>

        {/* DiSC Profile Tab */}
        <TabsContent value="disc" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Profile Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  DiSC Profile: {assessment.discProfile.type}
                </CardTitle>
                <CardDescription>
                  {assessment.discProfile.primaryStyle} / {assessment.discProfile.secondaryStyle}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full ${getDiSCColor(assessment.discProfile.primaryStyle)}`} />
                  <span className="font-medium">{assessment.discProfile.primaryStyle}</span>
                  <span className="text-muted-foreground">(Primary)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full ${getDiSCColor(assessment.discProfile.secondaryStyle)}`} />
                  <span className="font-medium">{assessment.discProfile.secondaryStyle}</span>
                  <span className="text-muted-foreground">(Secondary)</span>
                </div>
                <Separator />
                <p className="text-sm text-muted-foreground">{assessment.discProfile.summary}</p>
              </CardContent>
            </Card>

            {/* Strengths & Growth Areas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Strengths & Development
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Key Strengths</h4>
                  <ul className="space-y-1">
                    {assessment.discProfile.strengths.map((strength, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-3 w-3 text-green-600 dark:text-green-400" />
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium mb-2">Growth Areas</h4>
                  <ul className="space-y-1">
                    {assessment.discProfile.growthAreas.map((area, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <AlertTriangle className="h-3 w-3 text-yellow-600 dark:text-yellow-400" />
                        {area}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Communication & Stress Response */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Communication Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {assessment.discProfile.communicationTips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Stress Response
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{assessment.discProfile.stressResponse}</p>
                <Separator className="my-3" />
                <div className="space-y-2">
                  <div>
                    <h4 className="font-medium text-sm mb-1">Motivators</h4>
                    <div className="flex flex-wrap gap-1">
                      {assessment.discProfile.motivators.map((motivator, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {motivator}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-1">De-motivators</h4>
                    <div className="flex flex-wrap gap-1">
                      {assessment.discProfile.deMotivators.map((demotivator, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {demotivator}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Integrus 360 Tab */}
        <TabsContent value="integrus" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Leadership Profile */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Leadership Profile
                </CardTitle>
                <CardDescription>
                  {assessment.integrus360.leadershipType} • {assessment.integrus360.color}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full ${getIntegrusColor(assessment.integrus360.leadershipType)}`} />
                  <span className="font-medium">{assessment.integrus360.leadershipType}</span>
                </div>
                <p className="text-sm text-muted-foreground">{assessment.integrus360.profile.description}</p>
                <Separator />
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Leadership Strengths</h4>
                  <ul className="space-y-1">
                    {assessment.integrus360.profile.leadershipStrengths.map((strength, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-3 w-3 text-green-600 dark:text-green-400" />
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Development Areas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Development Areas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {assessment.integrus360.profile.developmentAreas.map((area, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <AlertTriangle className="h-3 w-3 text-yellow-600 dark:text-yellow-400" />
                      {area}
                    </li>
                  ))}
                </ul>
                <Separator className="my-4" />
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-sm mb-1">Communication Style</h4>
                    <p className="text-sm text-muted-foreground">{assessment.integrus360.profile.communicationStyle}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-1">Conflict Resolution</h4>
                    <p className="text-sm text-muted-foreground">{assessment.integrus360.profile.conflictResolution}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-1">Team Motivation</h4>
                    <p className="text-sm text-muted-foreground">{assessment.integrus360.profile.teamMotivation}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Full Profile Button */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Full Integrus 360 Profile</h4>
                  <p className="text-sm text-muted-foreground">
                    Last updated: {assessment.integrus360.profile.lastUpdated}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" onClick={() => setShowIntegrusModal(true)}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Compatibility Tab */}
        <TabsContent value="team" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Overall Compatibility */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users2 className="h-5 w-5" />
                  Overall Team Compatibility
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Compatibility Score</span>
                  <span
                    className={`text-2xl font-bold ${getCompatibilityColor(assessment.teamCompatibility.overallScore)}`}
                  >
                    {assessment.teamCompatibility.overallScore}%
                  </span>
                </div>
                <Progress value={assessment.teamCompatibility.overallScore} className="h-2" />
                <Separator />
                <div>
                  <h4 className="font-medium text-sm mb-2">Team Dynamics</h4>
                  <ul className="space-y-1">
                    {assessment.teamCompatibility.teamDynamics.map((dynamic, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        {dynamic}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Individual Compatibility */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Individual Compatibility
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(assessment.teamCompatibility.compatibilityMatrix).map(([employeeId, data]) => {
                    const employee = allAssessments.find((a) => a.employeeId === employeeId)
                    return (
                      <div key={employeeId} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium text-sm">{employee?.employeeName || employeeId}</div>
                          <div className="text-xs text-muted-foreground">{employee?.position || ""}</div>
                        </div>
                        <div className="text-right">
                          <Badge className={getCompatibilityBadge(data.score)}>{data.score}%</Badge>
                          <p className="text-xs text-muted-foreground mt-1">{data.notes}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Team Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {assessment.teamCompatibility.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <ChevronRight className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    {recommendation}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Integrus 360 Detail Modal */}
      <Dialog open={showIntegrusModal} onOpenChange={setShowIntegrusModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Integrus 360 Leadership Profile - {assessment.employeeName}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Leadership Type</h4>
                <div className="flex items-center gap-2 mb-4">
                  <div className={`w-4 h-4 rounded-full ${getIntegrusColor(assessment.integrus360.leadershipType)}`} />
                  <span className="font-medium">{assessment.integrus360.leadershipType}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{assessment.integrus360.profile.description}</p>

                <h4 className="font-medium mb-2">Leadership Strengths</h4>
                <ul className="space-y-1 mb-4">
                  {assessment.integrus360.profile.leadershipStrengths.map((strength, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-3 w-3 text-green-600 dark:text-green-400" />
                      {strength}
                    </li>
                  ))}
                </ul>

                <h4 className="font-medium mb-2">Development Areas</h4>
                <ul className="space-y-1">
                  {assessment.integrus360.profile.developmentAreas.map((area, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <AlertTriangle className="h-3 w-3 text-yellow-600 dark:text-yellow-400" />
                      {area}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Communication Style</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  {assessment.integrus360.profile.communicationStyle}
                </p>

                <h4 className="font-medium mb-2">Conflict Resolution</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  {assessment.integrus360.profile.conflictResolution}
                </p>

                <h4 className="font-medium mb-2">Team Motivation</h4>
                <p className="text-sm text-muted-foreground mb-4">{assessment.integrus360.profile.teamMotivation}</p>

                <h4 className="font-medium mb-2">Stress Management</h4>
                <p className="text-sm text-muted-foreground mb-4">{assessment.integrus360.profile.stressManagement}</p>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Assessment Details</h4>
                  <p className="text-sm text-muted-foreground">
                    Last Updated: {assessment.integrus360.profile.lastUpdated}
                  </p>
                  <Button variant="outline" className="mt-2">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Full PDF Report
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default BehavioralInsights

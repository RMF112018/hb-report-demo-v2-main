"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  GraduationCap,
  Users,
  Clock,
  TrendingUp,
  Target,
  Award,
  Calendar,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Star,
  Activity,
  BarChart3,
  PieChart,
  Eye,
  BookOpen,
  Brain,
  Heart,
  Zap,
  Play,
} from "lucide-react"

interface TrainingData {
  enrollmentStats: {
    totalCourses: number
    activeEnrollments: number
    completedThisMonth: number
    completionRate: number
    averageCompletionTime: number
  }
  coursePerformance: {
    category: string
    totalEnrollments: number
    completed: number
    inProgress: number
    completionRate: number
    averageScore: number
  }[]
  skillGaps: {
    skill: string
    required: number
    proficient: number
    gap: number
    priority: "high" | "medium" | "low"
  }[]
  certificationStatus: {
    totalCertifications: number
    active: number
    expiringSoon: number
    expired: number
    renewalRate: number
  }
  trainingPrograms: {
    name: string
    type: string
    enrollments: number
    completionRate: number
    averageScore: number
    duration: string
    status: "active" | "completed" | "upcoming"
  }[]
}

const TrainingDevelopment: React.FC = () => {
  // Mock training data
  const trainingData: TrainingData = {
    enrollmentStats: {
      totalCourses: 45,
      activeEnrollments: 567,
      completedThisMonth: 89,
      completionRate: 78.5,
      averageCompletionTime: 12.3,
    },
    coursePerformance: [
      {
        category: "Safety Training",
        totalEnrollments: 234,
        completed: 198,
        inProgress: 23,
        completionRate: 84.6,
        averageScore: 87.2,
      },
      {
        category: "Technical Skills",
        totalEnrollments: 189,
        completed: 145,
        inProgress: 34,
        completionRate: 76.7,
        averageScore: 82.1,
      },
      {
        category: "Leadership Development",
        totalEnrollments: 156,
        completed: 123,
        inProgress: 28,
        completionRate: 78.8,
        averageScore: 85.4,
      },
      {
        category: "Compliance Training",
        totalEnrollments: 198,
        completed: 167,
        inProgress: 19,
        completionRate: 84.3,
        averageScore: 89.7,
      },
      {
        category: "Soft Skills",
        totalEnrollments: 134,
        completed: 98,
        inProgress: 31,
        completionRate: 73.1,
        averageScore: 79.8,
      },
    ],
    skillGaps: [
      { skill: "Project Management", required: 234, proficient: 156, gap: 78, priority: "high" },
      { skill: "Safety Protocols", required: 456, proficient: 423, gap: 33, priority: "medium" },
      { skill: "Technical Software", required: 189, proficient: 134, gap: 55, priority: "high" },
      { skill: "Communication", required: 345, proficient: 298, gap: 47, priority: "medium" },
      { skill: "Leadership", required: 123, proficient: 89, gap: 34, priority: "high" },
      { skill: "Problem Solving", required: 267, proficient: 234, gap: 33, priority: "low" },
    ],
    certificationStatus: {
      totalCertifications: 567,
      active: 489,
      expiringSoon: 45,
      expired: 33,
      renewalRate: 86.2,
    },
    trainingPrograms: [
      {
        name: "OSHA Safety Certification",
        type: "Safety",
        enrollments: 234,
        completionRate: 89.7,
        averageScore: 92.1,
        duration: "8 weeks",
        status: "active",
      },
      {
        name: "Project Management Professional",
        type: "Leadership",
        enrollments: 89,
        completionRate: 76.4,
        averageScore: 84.3,
        duration: "12 weeks",
        status: "active",
      },
      {
        name: "Technical Skills Bootcamp",
        type: "Technical",
        enrollments: 156,
        completionRate: 82.1,
        averageScore: 87.6,
        duration: "6 weeks",
        status: "completed",
      },
      {
        name: "Communication Excellence",
        type: "Soft Skills",
        enrollments: 123,
        completionRate: 78.9,
        averageScore: 81.2,
        duration: "4 weeks",
        status: "active",
      },
      {
        name: "Leadership Fundamentals",
        type: "Leadership",
        enrollments: 67,
        completionRate: 91.0,
        averageScore: 88.9,
        duration: "10 weeks",
        status: "upcoming",
      },
    ],
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 dark:text-red-400"
      case "medium":
        return "text-yellow-600 dark:text-yellow-400"
      case "low":
        return "text-green-600 dark:text-green-400"
      default:
        return "text-gray-600 dark:text-gray-400"
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
      case "upcoming":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    }
  }

  return (
    <>
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Active Enrollments</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {trainingData.enrollmentStats.activeEnrollments}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  {trainingData.enrollmentStats.totalCourses} courses available
                </p>
              </div>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30 border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700 dark:text-green-300">Completion Rate</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {trainingData.enrollmentStats.completionRate}%
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  {trainingData.enrollmentStats.completedThisMonth} completed this month
                </p>
              </div>
              <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30 border-purple-200 dark:border-purple-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Active Certifications</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {trainingData.certificationStatus.active}
                </p>
                <p className="text-xs text-purple-600 dark:text-purple-400">
                  {trainingData.certificationStatus.renewalRate}% renewal rate
                </p>
              </div>
              <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                <Award className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/30 border-orange-200 dark:border-orange-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Avg Completion Time</p>
                <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                  {trainingData.enrollmentStats.averageCompletionTime} days
                </p>
                <p className="text-xs text-orange-600 dark:text-orange-400">Per course</p>
              </div>
              <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Performance */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="h-5 w-5" />
            Course Performance by Category
          </CardTitle>
          <CardDescription>Training completion rates and scores</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {trainingData.coursePerformance.map((course, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-sm font-medium">{course.category}</span>
                  <span className="text-sm text-muted-foreground">({course.totalEnrollments})</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">{course.completionRate}%</p>
                    <p className="text-xs text-muted-foreground">Completion</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{course.averageScore}%</p>
                    <p className="text-xs text-muted-foreground">Avg Score</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{course.inProgress}</p>
                    <p className="text-xs text-muted-foreground">In Progress</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Skill Gaps & Training Programs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="h-5 w-5" />
              Skill Gaps Analysis
            </CardTitle>
            <CardDescription>Areas requiring development focus</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {trainingData.skillGaps.map((skill, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-sm font-medium">{skill.skill}</span>
                    <span className="text-sm text-muted-foreground">({skill.gap} gap)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={(skill.proficient / skill.required) * 100} className="w-16 h-2" />
                    <Badge className={`text-xs ${getPriorityBadge(skill.priority)}`}>{skill.priority}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5" />
              Active Training Programs
            </CardTitle>
            <CardDescription>Current training initiatives</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {trainingData.trainingPrograms.map((program, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">{program.name}</span>
                      <Badge className={`text-xs ${getStatusBadge(program.status)}`}>{program.status}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{program.type}</span>
                      <span>•</span>
                      <span>{program.enrollments} enrolled</span>
                      <span>•</span>
                      <span>{program.completionRate}% completion</span>
                      <span>•</span>
                      <span>{program.duration}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{program.averageScore}%</p>
                    <p className="text-xs text-muted-foreground">Avg Score</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default TrainingDevelopment

"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  UserPlus,
  Briefcase,
  Users,
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  MessageSquare,
  Phone,
  Mail,
  Download,
  Upload,
  Building,
} from "lucide-react"
import AskHBIChat from "../AskHBIChat"

interface JobPosting {
  id: string
  title: string
  department: string
  location: string
  type: "full-time" | "part-time" | "contract"
  salary: string
  applications: number
  status: "active" | "paused" | "closed"
  postedDate: string
  deadline: string
}

interface Candidate {
  id: string
  name: string
  position: string
  email: string
  phone: string
  status: "applied" | "reviewing" | "interviewing" | "offered" | "hired" | "rejected"
  appliedDate: string
  experience: string
  location: string
  avatar: string
}

const RecruitingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"jobs" | "candidates" | "pipeline">("jobs")

  const jobPostings: JobPosting[] = [
    {
      id: "1",
      title: "Senior Project Manager",
      department: "Project Management",
      location: "Seattle, WA",
      type: "full-time",
      salary: "$120,000 - $150,000",
      applications: 45,
      status: "active",
      postedDate: "2024-11-15",
      deadline: "2024-12-15",
    },
    {
      id: "2",
      title: "Safety Coordinator",
      department: "Safety",
      location: "Denver, CO",
      type: "full-time",
      salary: "$65,000 - $85,000",
      applications: 23,
      status: "active",
      postedDate: "2024-11-20",
      deadline: "2024-12-20",
    },
    {
      id: "3",
      title: "Estimator",
      department: "Estimating",
      location: "Portland, OR",
      type: "full-time",
      salary: "$80,000 - $100,000",
      applications: 18,
      status: "active",
      postedDate: "2024-11-25",
      deadline: "2024-12-25",
    },
    {
      id: "4",
      title: "Field Superintendent",
      department: "Field Operations",
      location: "Phoenix, AZ",
      type: "full-time",
      salary: "$90,000 - $110,000",
      applications: 32,
      status: "paused",
      postedDate: "2024-11-10",
      deadline: "2024-12-10",
    },
  ]

  const candidates: Candidate[] = [
    {
      id: "1",
      name: "Alex Rodriguez",
      position: "Senior Project Manager",
      email: "alex.rodriguez@email.com",
      phone: "(555) 123-4567",
      status: "interviewing",
      appliedDate: "2024-11-20",
      experience: "8 years",
      location: "Seattle, WA",
      avatar: "/avatars/alex-rodriguez.png",
    },
    {
      id: "2",
      name: "Maria Garcia",
      position: "Safety Coordinator",
      email: "maria.garcia@email.com",
      phone: "(555) 234-5678",
      status: "reviewing",
      appliedDate: "2024-11-22",
      experience: "5 years",
      location: "Denver, CO",
      avatar: "/avatars/maria-garcia.png",
    },
    {
      id: "3",
      name: "David Kim",
      position: "Estimator",
      email: "david.kim@email.com",
      phone: "(555) 345-6789",
      status: "offered",
      appliedDate: "2024-11-25",
      experience: "6 years",
      location: "Portland, OR",
      avatar: "/avatars/david-kim.png",
    },
    {
      id: "4",
      name: "Sarah Williams",
      position: "Field Superintendent",
      email: "sarah.williams@email.com",
      phone: "(555) 456-7890",
      status: "hired",
      appliedDate: "2024-11-15",
      experience: "10 years",
      location: "Phoenix, AZ",
      avatar: "/avatars/sarah-williams.png",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "paused":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      case "closed":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      case "applied":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
      case "reviewing":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      case "interviewing":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
      case "offered":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
      case "hired":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    }
  }

  const pipelineStats = {
    applied: 156,
    reviewing: 45,
    interviewing: 23,
    offered: 8,
    hired: 12,
    rejected: 34,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Recruiting</h1>
          <p className="text-muted-foreground mt-1">Manage job postings, candidates, and the hiring process</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import Candidates
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Reports
          </Button>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Post New Job
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-green-600">+3 this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-blue-600">+23 this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interviews Scheduled</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-purple-600">This week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hired This Month</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-green-600">+2 from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab("jobs")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === "jobs"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Job Postings
        </button>
        <button
          onClick={() => setActiveTab("candidates")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === "candidates"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Candidates
        </button>
        <button
          onClick={() => setActiveTab("pipeline")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === "pipeline"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Pipeline
        </button>
      </div>

      {/* Job Postings Tab */}
      {activeTab === "jobs" && (
        <Card>
          <CardHeader>
            <CardTitle>Active Job Postings</CardTitle>
            <CardDescription>Manage and track job openings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {jobPostings.map((job) => (
                <div
                  key={job.id}
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-medium text-foreground">{job.title}</h3>
                      <Badge className={getStatusColor(job.status)}>{job.status}</Badge>
                    </div>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <Building className="h-3 w-3 mr-1" />
                        {job.department}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {job.location}
                      </span>
                      <span className="flex items-center">
                        <DollarSign className="h-3 w-3 mr-1" />
                        {job.salary}
                      </span>
                      <span className="flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        {job.applications} applications
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Candidates Tab */}
      {activeTab === "candidates" && (
        <Card>
          <CardHeader>
            <CardTitle>Candidate Management</CardTitle>
            <CardDescription>Review and manage candidate applications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {candidates.map((candidate) => (
                <div
                  key={candidate.id}
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{candidate.name}</h3>
                      <p className="text-sm text-muted-foreground">{candidate.position}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xs text-muted-foreground flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {candidate.email}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {candidate.location}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {candidate.experience}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={getStatusColor(candidate.status)}>{candidate.status}</Badge>
                    <Button variant="outline" size="sm">
                      <Phone className="h-4 w-4 mr-2" />
                      Contact
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pipeline Tab */}
      {activeTab === "pipeline" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pipeline Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Hiring Pipeline</CardTitle>
              <CardDescription>Current hiring funnel overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                  <span className="font-medium">Applied</span>
                  <Badge variant="outline">{pipelineStats.applied}</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg">
                  <span className="font-medium">Under Review</span>
                  <Badge variant="outline">{pipelineStats.reviewing}</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                  <span className="font-medium">Interviewing</span>
                  <Badge variant="outline">{pipelineStats.interviewing}</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-orange-50 dark:bg-orange-950/30 rounded-lg">
                  <span className="font-medium">Offers Made</span>
                  <Badge variant="outline">{pipelineStats.offered}</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                  <span className="font-medium">Hired</span>
                  <Badge variant="outline">{pipelineStats.hired}</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-950/30 rounded-lg">
                  <span className="font-medium">Rejected</span>
                  <Badge variant="outline">{pipelineStats.rejected}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest hiring activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Sarah Williams hired</p>
                    <p className="text-xs text-muted-foreground">Field Superintendent - Phoenix</p>
                  </div>
                  <span className="text-xs text-muted-foreground">2 hours ago</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Interview scheduled</p>
                    <p className="text-xs text-muted-foreground">Alex Rodriguez - Senior PM</p>
                  </div>
                  <span className="text-xs text-muted-foreground">1 day ago</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                  <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Application rejected</p>
                    <p className="text-xs text-muted-foreground">John Smith - Estimator</p>
                  </div>
                  <span className="text-xs text-muted-foreground">2 days ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Ask HBI Chat */}
      <AskHBIChat />
    </div>
  )
}

export default RecruitingPage

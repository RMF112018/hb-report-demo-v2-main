"use client"

import React from "react"
import HrPayrollLayout from "@/components/layouts/HrPayrollLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Eye, MessageSquare, Calendar, MapPin, Users } from "lucide-react"

export default function RecruitmentPage() {
  const jobPostings = [
    {
      id: "JOB001",
      title: "Senior Project Manager",
      department: "Operations",
      location: "Seattle, WA",
      type: "Full-time",
      status: "Active",
      applications: 24,
      daysPosted: 12,
      priority: "High",
      progress: 75,
    },
    {
      id: "JOB002",
      title: "Estimator",
      department: "Pre-Construction",
      location: "Portland, OR",
      type: "Full-time",
      status: "Active",
      applications: 18,
      daysPosted: 8,
      priority: "Medium",
      progress: 60,
    },
    {
      id: "JOB003",
      title: "Field Engineer",
      department: "Field Operations",
      location: "San Francisco, CA",
      type: "Full-time",
      status: "Active",
      applications: 31,
      daysPosted: 15,
      priority: "High",
      progress: 90,
    },
    {
      id: "JOB004",
      title: "Safety Coordinator",
      department: "Safety",
      location: "Denver, CO",
      type: "Full-time",
      status: "Active",
      applications: 12,
      daysPosted: 5,
      priority: "Medium",
      progress: 40,
    },
  ]

  const candidates = [
    {
      id: "CAN001",
      name: "Alex Rodriguez",
      position: "Senior Project Manager",
      status: "Interview Scheduled",
      avatar: "/avatars/alex-rodriguez.png",
      experience: "8 years",
      location: "Seattle, WA",
      rating: 4.8,
    },
    {
      id: "CAN002",
      name: "Maria Garcia",
      position: "Estimator",
      status: "Application Review",
      avatar: "/avatars/maria-garcia.png",
      experience: "5 years",
      location: "Portland, OR",
      rating: 4.5,
    },
    {
      id: "CAN003",
      name: "James Wilson",
      position: "Field Engineer",
      status: "Reference Check",
      avatar: "/avatars/james-wilson.png",
      experience: "6 years",
      location: "San Francisco, CA",
      rating: 4.9,
    },
  ]

  return (
    <HrPayrollLayout>
      <div className="p-6">
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
                <Badge variant="outline">12</Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">+3 from last week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                <Badge variant="outline" className="bg-blue-100 text-blue-800">
                  85
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">85</div>
                <p className="text-xs text-muted-foreground">+12 this week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Interviews Scheduled</CardTitle>
                <Badge variant="secondary">8</Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">This week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Hire Rate</CardTitle>
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  78%
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">78%</div>
                <p className="text-xs text-muted-foreground">+5% from last month</p>
              </CardContent>
            </Card>
          </div>

          {/* Job Postings */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Active Job Postings</CardTitle>
                  <CardDescription>Manage current job openings and applications</CardDescription>
                </div>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Post New Job
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {jobPostings.map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold">{job.title}</h3>
                          <Badge variant={job.priority === "High" ? "destructive" : "secondary"}>{job.priority}</Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {job.location}
                          </span>
                          <span className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            {job.department}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {job.daysPosted} days ago
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm font-medium">{job.applications} applications</div>
                        <div className="text-xs text-muted-foreground">Progress</div>
                      </div>
                      <div className="w-24">
                        <Progress value={job.progress} className="h-2" />
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Candidates */}
          <Card>
            <CardHeader>
              <CardTitle>Top Candidates</CardTitle>
              <CardDescription>Leading candidates for current positions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {candidates.map((candidate) => (
                  <div key={candidate.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={candidate.avatar} alt={candidate.name} />
                        <AvatarFallback>
                          {candidate.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold">{candidate.name}</div>
                        <div className="text-sm text-muted-foreground">{candidate.position}</div>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                          <span>{candidate.experience} experience</span>
                          <span>{candidate.location}</span>
                          <span>Rating: {candidate.rating}/5</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{candidate.status}</Badge>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </HrPayrollLayout>
  )
}

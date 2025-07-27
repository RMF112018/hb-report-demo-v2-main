"use client"

import React, { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Shield, Target, Users, CheckCircle, Clock, AlertTriangle, ChevronDown, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

// Import data
import projectsData from "@/data/mock/projects.json"
import responsibilityData from "@/data/mock/responsibility.json"

interface ResponsibilityOverviewProps {
  className?: string
}

export function ResponsibilityOverview({ className }: ResponsibilityOverviewProps) {
  // Get user role from localStorage or use default
  const userRole =
    typeof window !== "undefined" ? localStorage.getItem("userRole") || "Project Manager" : "Project Manager"

  // Group responsibilities by type
  const groupedResponsibilities = useMemo(() => {
    const groups = {
      Approver: [] as any[],
      "Primarily Responsible": [] as any[],
      Supporting: [] as any[],
    }

    responsibilityData.forEach((item) => {
      // Skip null entries
      if (!item["Task Category"] || !item["Tasks/Role"]) return

      // Filter by user role - map categories to roles
      const category = item["Task Category"]
      const taskRole = item["Tasks/Role"]

      // Role mapping based on category
      const roleMapping: { [key: string]: string } = {
        PX: "Project Executive",
        SPM: "Senior Project Manager",
        "PM 2": "Project Manager",
        "PM 1": "Project Manager",
        PM1: "Project Manager",
        PA: "Project Administrator",
        QAQC: "Quality Control",
        "Proj Acct": "Project Accountant",
        "PM's": "Project Manager",
        All: "All",
        "PM's/Supers": "Project Manager",
        "PM/Super": "Project Manager",
      }

      // Check if task is relevant to current user role
      const taskRelevantRole = roleMapping[category] || category
      const isRelevant =
        userRole === "Project Executive" ||
        taskRelevantRole === userRole ||
        taskRelevantRole === "All" ||
        (userRole === "Project Manager" && taskRelevantRole === "Senior Project Manager")

      if (isRelevant) {
        // Enhanced item with additional properties for display
        const enhancedItem = {
          ...item,
          responsibility: taskRole,
          projectId: projectsData[0]?.project_id || "proj-001",
          status: Math.random() > 0.7 ? "completed" : Math.random() > 0.4 ? "in progress" : "pending",
          priority: Math.random() > 0.7 ? "high" : Math.random() > 0.4 ? "medium" : "low",
          dueDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        }

        // Add to appropriate group based on responsibility type
        if (
          taskRole.toLowerCase().includes("approve") ||
          taskRole.toLowerCase().includes("review") ||
          taskRole.toLowerCase().includes("sign")
        ) {
          groups["Approver"].push(enhancedItem)
        } else if (
          category === "PX" ||
          category === "SPM" ||
          taskRole.toLowerCase().includes("lead") ||
          taskRole.toLowerCase().includes("manage") ||
          taskRole.toLowerCase().includes("coordinate") ||
          taskRole.toLowerCase().includes("run")
        ) {
          groups["Primarily Responsible"].push(enhancedItem)
        } else {
          groups["Supporting"].push(enhancedItem)
        }
      }
    })

    return groups
  }, [userRole])

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "text-green-600"
      case "in progress":
        return "text-blue-600"
      case "pending":
        return "text-yellow-600"
      case "overdue":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />
      case "in progress":
        return <Clock className="w-4 h-4" />
      case "pending":
        return <Clock className="w-4 h-4" />
      case "overdue":
        return <AlertTriangle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Approver":
        return <Shield className="w-4 h-4" />
      case "Primarily Responsible":
        return <Target className="w-4 h-4" />
      case "Supporting":
        return <Users className="w-4 h-4" />
      default:
        return <Target className="w-4 h-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Approver":
        return "text-purple-600"
      case "Primarily Responsible":
        return "text-blue-600"
      case "Supporting":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  const totalResponsibilities = Object.values(groupedResponsibilities).reduce((sum, items) => sum + items.length, 0)

  return (
    <Card className={cn("w-full border-l-4 border-l-[#FA4616]", className)}>
      <CardHeader className="pb-3 bg-gradient-to-r from-[#FA4616]/5 to-transparent">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Target className="w-4 h-4" style={{ color: "#FA4616" }} />
          Responsibility Overview
          <Badge variant="secondary" className="ml-auto bg-[#0021A5]/10 text-[#0021A5] border-[#0021A5]/20">
            {totalResponsibilities}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <Accordion type="multiple" className="w-full space-y-2">
          {Object.entries(groupedResponsibilities).map(([category, items]) => (
            <AccordionItem key={category} value={category} className="border rounded-lg">
              <AccordionTrigger className="px-3 py-2 hover:no-underline">
                <div className="flex items-center gap-2 text-sm">
                  <span className={getCategoryColor(category)}>{getCategoryIcon(category)}</span>
                  <span className="font-medium">{category}</span>
                  <Badge variant="outline" className="ml-auto">
                    {items.length}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-3 pb-3">
                <div className="space-y-2">
                  {items.length > 0 ? (
                    items.map((item, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{item.responsibility}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {projectsData.find((p) => p.project_id === item.projectId)?.name || "Unknown Project"}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className={cn("text-xs", getStatusColor(item.status))}>
                              {getStatusIcon(item.status)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={cn("text-xs", getPriorityColor(item.priority))}>
                              {item.priority}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              Due: {new Date(item.dueDate).toLocaleDateString()}
                            </span>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => {
                              // Navigate to project or task details
                              window.location.href = `/project/${item.projectId}`
                            }}
                          >
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500 text-sm">
                      No {category.toLowerCase()} responsibilities
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  )
}

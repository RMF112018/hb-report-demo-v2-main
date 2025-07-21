import React from "react"
import { ResponsibilityMatrix } from "@/components/responsibility/ResponsibilityMatrix"

export default function ResponsibilityMatrixPage() {
  // Mock data for the page
  const mockTasks = [
    {
      id: "task-1",
      projectId: "proj-001",
      type: "team" as const,
      category: "site",
      task: "Site Preparation",
      page: "",
      article: "",
      responsible: "PM",
      assignments: {
        PM: "Primary" as const,
        QC: "Support" as const,
      },
      status: "active" as const,
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-15T10:00:00Z",
      annotations: [
        {
          id: "ann-1",
          user: "John Smith",
          timestamp: "2024-01-15T10:00:00Z",
          comment: "Need to coordinate with utility companies",
        },
      ],
    },
    {
      id: "task-2",
      projectId: "proj-001",
      type: "team" as const,
      category: "quality",
      task: "Foundation Inspection",
      page: "",
      article: "",
      responsible: "QC",
      assignments: {
        PM: "Approve" as const,
        QC: "Primary" as const,
      },
      status: "pending" as const,
      createdAt: "2024-01-16T10:00:00Z",
      updatedAt: "2024-01-16T10:00:00Z",
      annotations: [
        {
          id: "ann-2",
          user: "Sarah Johnson",
          timestamp: "2024-01-16T10:00:00Z",
          comment: "Schedule with city inspector",
        },
      ],
    },
  ]

  const mockRoles = [
    {
      key: "PM",
      name: "Project Manager",
      color: "#3B82F6",
      description: "Oversees project execution",
      enabled: true,
      category: "Management",
    },
    {
      key: "QC",
      name: "Quality Control",
      color: "#10B981",
      description: "Ensures quality standards",
      enabled: true,
      category: "Quality",
    },
  ]

  const mockCategories = [
    {
      key: "site",
      name: "Site Work",
      description: "Site preparation and foundation work",
      color: "#F59E0B",
      enabled: true,
    },
    {
      key: "quality",
      name: "Quality Control",
      description: "Quality assurance and testing",
      color: "#10B981",
      enabled: true,
    },
  ]

  const handleTaskDelete = (taskId: string) => {
    console.log("Task deleted:", taskId)
  }

  const handleTaskEdit = (task: any) => {
    console.log("Task edited:", task)
  }

  const handleTaskCreate = (task: any) => {
    console.log("Task created:", task)
  }

  return (
    <div className="container mx-auto p-6">
      <ResponsibilityMatrix
        tasks={mockTasks}
        roles={mockRoles}
        categories={mockCategories}
        onTaskDelete={handleTaskDelete}
        onTaskEdit={handleTaskEdit}
        onTaskCreate={handleTaskCreate}
      />
    </div>
  )
}

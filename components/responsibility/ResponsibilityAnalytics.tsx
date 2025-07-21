import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

import type { ResponsibilityTask } from "@/types/responsibility"

interface ResponsibilityAnalyticsProps {
  tasks: ResponsibilityTask[]
  roles: Array<{ key: string; name: string; color: string; description: string; enabled: boolean; category: string }>
  categories: Array<{ key: string; name: string; description: string; color: string; enabled: boolean }>
  onDrillDown: (filterType: string, filterValue: string) => void
}

export function ResponsibilityAnalytics({ tasks, roles, categories, onDrillDown }: ResponsibilityAnalyticsProps) {
  // Calculate analytics
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((task) => task.status === "completed").length
  const activeTasks = tasks.filter((task) => task.status === "active").length
  const pendingTasks = tasks.filter((task) => task.status === "pending").length

  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  // Type distribution (instead of priority)
  const typeData = [
    { name: "Team", value: tasks.filter((task) => task.type === "team").length },
    { name: "Prime Contract", value: tasks.filter((task) => task.type === "prime-contract").length },
    { name: "Subcontract", value: tasks.filter((task) => task.type === "subcontract").length },
  ]

  // Status distribution
  const statusData = [
    { name: "Completed", value: completedTasks },
    { name: "Active", value: activeTasks },
    { name: "Pending", value: pendingTasks },
  ]

  // Category distribution
  const categoryStats = categories.map((category) => ({
    name: category.name,
    value: tasks.filter((task) => task.category === category.key).length,
    color: category.color,
  }))

  // Role workload
  const roleWorkload = roles.map((role) => ({
    name: role.name,
    assigned: tasks.filter((task) => task.responsible === role.key).length,
    completed: tasks.filter((task) => task.responsible === role.key && task.status === "completed").length,
  }))

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate.toFixed(1)}%</div>
            <Progress value={completionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeTasks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTasks}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Type Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={typeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Role Workload</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {roleWorkload.map((role) => (
              <div key={role.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{role.name}</span>
                  <Badge variant="outline">{role.assigned} assigned</Badge>
                  <Badge variant="secondary">{role.completed} completed</Badge>
                </div>
                <Button variant="outline" size="sm" onClick={() => onDrillDown("role", role.name)}>
                  View Details
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {categoryStats.map((category) => (
              <div key={category.name} className="text-center">
                <div className="text-2xl font-bold" style={{ color: category.color }}>
                  {category.value}
                </div>
                <div className="text-sm text-gray-600">{category.name}</div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => onDrillDown("category", category.name)}
                >
                  View Tasks
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Edit, Trash2, Plus } from "lucide-react"

import type { ResponsibilityTask } from "@/types/responsibility"

interface ResponsibilityMatrixProps {
  tasks: ResponsibilityTask[]
  roles: Array<{ key: string; name: string; color: string; description: string; enabled: boolean; category: string }>
  categories: Array<{ key: string; name: string; description: string; color: string; enabled: boolean }>
  onTaskDelete: (taskId: string) => void
  onTaskEdit: (task: ResponsibilityTask) => void
  onTaskCreate: (task: ResponsibilityTask) => void
}

export function ResponsibilityMatrix({
  tasks,
  roles,
  categories,
  onTaskDelete,
  onTaskEdit,
  onTaskCreate,
}: ResponsibilityMatrixProps) {
  const [selectedTask, setSelectedTask] = useState<ResponsibilityTask | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRoleName = (roleKey: string) => {
    const role = roles.find((r) => r.key === roleKey)
    return role?.name || roleKey
  }

  const getCategoryName = (categoryKey: string) => {
    const category = categories.find((c) => c.key === categoryKey)
    return category?.name || categoryKey
  }

  const handleEditTask = (task: ResponsibilityTask) => {
    setSelectedTask(task)
    setIsEditDialogOpen(true)
  }

  const handleDeleteTask = (taskId: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      onTaskDelete(taskId)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Responsibility Matrix</h2>
        <Button
          onClick={() =>
            onTaskCreate({
              id: `task-${Date.now()}`,
              projectId: "",
              type: "team",
              category: "",
              task: "",
              page: "",
              article: "",
              responsible: "",
              assignments: {},
              status: "pending",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              annotations: [],
            })
          }
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tasks Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Responsible</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.task}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{getCategoryName(task.category)}</Badge>
                  </TableCell>
                  <TableCell>{getRoleName(task.responsible)}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditTask(task)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteTask(task.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          {selectedTask && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Task Name</label>
                <input
                  type="text"
                  value={selectedTask.task}
                  onChange={(e) => setSelectedTask({ ...selectedTask, task: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={selectedTask.category}
                  onChange={(e) => setSelectedTask({ ...selectedTask, category: e.target.value })}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.key} value={category.key}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Responsible</label>
                <select
                  value={selectedTask.responsible}
                  onChange={(e) => setSelectedTask({ ...selectedTask, responsible: e.target.value })}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Role</option>
                  {roles.map((role) => (
                    <option key={role.key} value={role.key}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={selectedTask.status}
                  onChange={(e) =>
                    setSelectedTask({
                      ...selectedTask,
                      status: e.target.value as "completed" | "pending" | "active",
                    })
                  }
                  className="w-full p-2 border rounded"
                >
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    onTaskEdit(selectedTask)
                    setIsEditDialogOpen(false)
                  }}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

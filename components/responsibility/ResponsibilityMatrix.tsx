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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

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
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Task Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{task.task}</div>
                      <div className="text-sm text-gray-500">{task.responsible}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{getCategoryName(task.category)}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{getRoleName(task.responsible)}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(task.type)}>{task.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                  </TableCell>
                  <TableCell>{task.updatedAt ? new Date(task.updatedAt).toLocaleDateString() : "N/A"}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditTask(task)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteTask(task.id)}>
                        <Trash2 className="w-4 h-4" />
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
                <label className="block text-sm font-medium mb-1">Task</label>
                <input
                  type="text"
                  value={selectedTask.task}
                  onChange={(e) => setSelectedTask({ ...selectedTask, task: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Responsible</label>
                <input
                  type="text"
                  value={selectedTask.responsible}
                  onChange={(e) => setSelectedTask({ ...selectedTask, responsible: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select
                    value={selectedTask.category}
                    onChange={(e) => setSelectedTask({ ...selectedTask, category: e.target.value })}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select category</option>
                    {categories
                      .filter((cat) => cat.enabled)
                      .map((category) => (
                        <option key={category.key} value={category.key}>
                          {category.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select
                    value={selectedTask.status}
                    onChange={(e) =>
                      setSelectedTask({
                        ...selectedTask,
                        status: e.target.value as "active" | "pending" | "completed",
                      })
                    }
                    className="w-full p-2 border rounded"
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Annotations</label>
                <textarea
                  value={selectedTask.annotations?.map((ann) => ann.comment).join("\n") || ""}
                  onChange={(e) => {
                    const comments = e.target.value.split("\n").filter((c) => c.trim())
                    const annotations = comments.map((comment, index) => ({
                      id: `temp-${index}`,
                      user: "Current User",
                      timestamp: new Date().toISOString(),
                      comment: comment.trim(),
                    }))
                    setSelectedTask({ ...selectedTask, annotations })
                  }}
                  className="w-full p-2 border rounded"
                  rows={2}
                  placeholder="Add annotations (one per line)"
                />
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

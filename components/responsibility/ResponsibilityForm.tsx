import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import type { ResponsibilityTask } from "@/types/responsibility"

interface ResponsibilityFormProps {
  task?: ResponsibilityTask
  onSave: (task: ResponsibilityTask) => void
  onCancel: () => void
  categories: Array<{ key: string; name: string; description: string; color: string; enabled: boolean }>
  roles: Array<{ key: string; name: string; color: string; description: string; enabled: boolean; category: string }>
}

export function ResponsibilityForm({ task, onSave, onCancel, categories, roles }: ResponsibilityFormProps) {
  const [formData, setFormData] = useState<Partial<ResponsibilityTask>>(
    task || {
      task: "",
      category: "",
      responsible: "",
      status: "pending",
      projectId: "",
      type: "team",
      page: "",
      article: "",
      assignments: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      annotations: [],
    }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.task && formData.category && formData.responsible) {
      onSave({
        id: task?.id || `task-${Date.now()}`,
        task: formData.task,
        category: formData.category,
        responsible: formData.responsible,
        status: formData.status || "pending",
        projectId: formData.projectId || "",
        type: formData.type || "team",
        page: formData.page || "",
        article: formData.article || "",
        assignments: formData.assignments || {},
        createdAt: formData.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        annotations: formData.annotations || [],
      } as ResponsibilityTask)
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>{task ? "Edit Task" : "Create New Task"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="task">Task</Label>
            <Input
              id="task"
              value={formData.task}
              onChange={(e) => setFormData({ ...formData, task: e.target.value })}
              placeholder="Enter task name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="responsible">Responsible</Label>
            <Input
              id="responsible"
              value={formData.responsible}
              onChange={(e) => setFormData({ ...formData, responsible: e.target.value })}
              placeholder="Enter responsible person"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category || ""}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories
                    .filter((cat) => cat.enabled)
                    .map((category) => (
                      <SelectItem key={category.key} value={category.key}>
                        {category.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="responsible">Responsible</Label>
              <Select
                value={formData.responsible || ""}
                onValueChange={(value) => setFormData({ ...formData, responsible: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roles
                    .filter((role) => role.enabled)
                    .map((role) => (
                      <SelectItem key={role.key} value={role.key}>
                        {role.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status || "pending"}
              onValueChange={(value: "active" | "pending" | "completed") => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="annotations">Annotations</Label>
            <Textarea
              id="annotations"
              value={formData.annotations?.map((ann) => ann.comment).join("\n") || ""}
              onChange={(e) => {
                const comments = e.target.value.split("\n").filter((c) => c.trim())
                const annotations = comments.map((comment, index) => ({
                  id: `temp-${index}`,
                  user: "Current User",
                  timestamp: new Date().toISOString(),
                  comment: comment.trim(),
                }))
                setFormData({ ...formData, annotations })
              }}
              placeholder="Add any additional notes or annotations (one per line)"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">{task ? "Update Task" : "Create Task"}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

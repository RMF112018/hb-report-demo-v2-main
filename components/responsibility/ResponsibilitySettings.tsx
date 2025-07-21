import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Edit, Trash2, MoreHorizontal, Users, FolderOpen, CheckSquare } from "lucide-react"

export interface Role {
  key: string
  name: string
  color: string
  description: string
  enabled: boolean
  category: string
}

export interface Category {
  key: string
  name: string
  description: string
  color: string
  enabled: boolean
}

export interface StandardTask {
  id: string
  name: string
  description: string
  category: string
  defaultRole: string
  enabled: boolean
}

interface ResponsibilitySettingsProps {
  roles: Role[]
  categories: Category[]
  standardTasks?: StandardTask[]
  onRoleUpdate: (role: Role) => void
  onRoleCreate: (role: Role) => void
  onRoleDelete: (roleKey: string) => void
  onCategoryCreate: (category: Category) => void
  onCategoryDelete: (category: Category) => void
  onStandardTaskUpdate?: (task: StandardTask) => void
}

export function ResponsibilitySettings({
  roles,
  categories,
  standardTasks = [],
  onRoleUpdate,
  onRoleCreate,
  onRoleDelete,
  onCategoryCreate,
  onCategoryDelete,
  onStandardTaskUpdate,
}: ResponsibilitySettingsProps) {
  const [activeTab, setActiveTab] = useState("roles")
  const [isCreateRoleOpen, setIsCreateRoleOpen] = useState(false)
  const [isCreateCategoryOpen, setIsCreateCategoryOpen] = useState(false)
  const [newRole, setNewRole] = useState<Partial<Role>>({
    key: "",
    name: "",
    color: "#3B82F6",
    description: "",
    enabled: true,
    category: "",
  })
  const [newCategory, setNewCategory] = useState<Partial<Category>>({
    key: "",
    name: "",
    color: "#10B981",
    description: "",
    enabled: true,
  })

  const handleCreateRole = () => {
    if (newRole.key && newRole.name) {
      onRoleCreate(newRole as Role)
      setNewRole({
        key: "",
        name: "",
        color: "#3B82F6",
        description: "",
        enabled: true,
        category: "",
      })
      setIsCreateRoleOpen(false)
    }
  }

  const handleCreateCategory = () => {
    if (newCategory.key && newCategory.name) {
      onCategoryCreate(newCategory as Category)
      setNewCategory({
        key: "",
        name: "",
        color: "#10B981",
        description: "",
        enabled: true,
      })
      setIsCreateCategoryOpen(false)
    }
  }

  const handleRoleToggle = (role: Role) => {
    onRoleUpdate({ ...role, enabled: !role.enabled })
  }

  const handleCategoryToggle = (_category: Category) => {
    // Implementation would depend on category update handler
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Responsibility Settings</h2>
          <p className="text-muted-foreground">Manage project roles, categories, and standard tasks</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="roles" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Roles
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <FolderOpen className="h-4 w-4" />
            Categories
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex items-center gap-2">
            <CheckSquare className="h-4 w-4" />
            Standard Tasks
          </TabsTrigger>
        </TabsList>

        <TabsContent value="roles" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Project Roles</CardTitle>
                  <CardDescription>Manage roles and their assignments for the responsibility matrix</CardDescription>
                </div>
                <Dialog open={isCreateRoleOpen} onOpenChange={setIsCreateRoleOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Role
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Role</DialogTitle>
                      <DialogDescription>Add a new role to the responsibility matrix</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="role-key">Role Key</Label>
                        <Input
                          id="role-key"
                          value={newRole.key}
                          onChange={(e) => setNewRole({ ...newRole, key: e.target.value })}
                          placeholder="e.g., pm, superintendent"
                        />
                      </div>
                      <div>
                        <Label htmlFor="role-name">Role Name</Label>
                        <Input
                          id="role-name"
                          value={newRole.name}
                          onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                          placeholder="e.g., Project Manager"
                        />
                      </div>
                      <div>
                        <Label htmlFor="role-description">Description</Label>
                        <Input
                          id="role-description"
                          value={newRole.description}
                          onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                          placeholder="Role description"
                        />
                      </div>
                      <div>
                        <Label htmlFor="role-color">Color</Label>
                        <Input
                          id="role-color"
                          type="color"
                          value={newRole.color}
                          onChange={(e) => setNewRole({ ...newRole, color: e.target.value })}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsCreateRoleOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateRole}>Create Role</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Color</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roles.map((role) => (
                    <TableRow key={role.key}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: role.color }} />
                          <span className="font-medium">{role.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{role.description}</TableCell>
                      <TableCell>
                        <div className="w-6 h-6 rounded border" style={{ backgroundColor: role.color }} />
                      </TableCell>
                      <TableCell>
                        <Switch checked={role.enabled} onCheckedChange={() => handleRoleToggle(role)} />
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => onRoleDelete(role.key)}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Task Categories</CardTitle>
                  <CardDescription>Organize tasks by functional categories</CardDescription>
                </div>
                <Dialog open={isCreateCategoryOpen} onOpenChange={setIsCreateCategoryOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Category
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Category</DialogTitle>
                      <DialogDescription>Add a new task category</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="category-key">Category Key</Label>
                        <Input
                          id="category-key"
                          value={newCategory.key}
                          onChange={(e) => setNewCategory({ ...newCategory, key: e.target.value })}
                          placeholder="e.g., safety, quality"
                        />
                      </div>
                      <div>
                        <Label htmlFor="category-name">Category Name</Label>
                        <Input
                          id="category-name"
                          value={newCategory.name}
                          onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                          placeholder="e.g., Safety"
                        />
                      </div>
                      <div>
                        <Label htmlFor="category-description">Description</Label>
                        <Input
                          id="category-description"
                          value={newCategory.description}
                          onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                          placeholder="Category description"
                        />
                      </div>
                      <div>
                        <Label htmlFor="category-color">Color</Label>
                        <Input
                          id="category-color"
                          type="color"
                          value={newCategory.color}
                          onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsCreateCategoryOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateCategory}>Create Category</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Color</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.key}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                          <span className="font-medium">{category.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{category.description}</TableCell>
                      <TableCell>
                        <div className="w-6 h-6 rounded border" style={{ backgroundColor: category.color }} />
                      </TableCell>
                      <TableCell>
                        <Switch checked={category.enabled} onCheckedChange={() => handleCategoryToggle(category)} />
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => onCategoryDelete(category)}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Standard Tasks</CardTitle>
                  <CardDescription>Pre-defined task templates for common responsibilities</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task Template
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Default Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {standardTasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{task.name}</div>
                          <div className="text-sm text-muted-foreground">{task.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{task.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{task.defaultRole}</Badge>
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={task.enabled}
                          onCheckedChange={() => onStandardTaskUpdate?.({ ...task, enabled: !task.enabled })}
                        />
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

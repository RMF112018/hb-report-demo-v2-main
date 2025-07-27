/**
 * @fileoverview Compact Constraints Table Component
 * @module ConstraintsTableCompact
 * @version 3.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Compact, professional, editable constraints table for Field Management integration
 */

"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ProtectedGrid, ProtectedColDef, GridRow, createGridWithTotalsAndSticky } from "@/components/ui/protected-grid"
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Edit2,
  MoreHorizontal,
  Plus,
  Search,
  Filter,
  Calendar,
  User,
  FileText,
  MapPin,
  Target,
  Trash2,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Mock data for constraints
const mockConstraints = [
  {
    id: "1",
    no: "C-001",
    description: "Electrical rough-in delayed due to structural modifications",
    category: "Electrical",
    priority: "High",
    status: "Open",
    assigned: "John Smith",
    dateIdentified: "2024-01-15",
    dueDate: "2024-01-25",
    daysElapsed: 10,
    impact: "Schedule delay of 3 days",
    resolution: "",
  },
  {
    id: "2",
    no: "C-002",
    description: "HVAC ductwork conflicts with sprinkler system",
    category: "HVAC",
    priority: "High",
    status: "In Progress",
    assigned: "Mike Johnson",
    dateIdentified: "2024-01-12",
    dueDate: "2024-01-22",
    daysElapsed: 13,
    impact: "Requires coordination meeting",
    resolution: "Design revision in progress",
  },
  {
    id: "3",
    no: "C-003",
    description: "Concrete strength test results below specification",
    category: "Structural",
    priority: "Critical",
    status: "Open",
    assigned: "Sarah Wilson",
    dateIdentified: "2024-01-18",
    dueDate: "2024-01-28",
    daysElapsed: 7,
    impact: "Potential structural rework",
    resolution: "",
  },
  {
    id: "4",
    no: "C-004",
    description: "Permit approval delayed for window installation",
    category: "Permits",
    priority: "Medium",
    status: "Open",
    assigned: "David Lee",
    dateIdentified: "2024-01-20",
    dueDate: "2024-02-05",
    daysElapsed: 5,
    impact: "Facade work on hold",
    resolution: "",
  },
  {
    id: "5",
    no: "C-005",
    description: "Material delivery delayed due to supplier issues",
    category: "Procurement",
    priority: "Medium",
    status: "Resolved",
    assigned: "Lisa Chen",
    dateIdentified: "2024-01-10",
    dueDate: "2024-01-20",
    daysElapsed: 15,
    impact: "Minor schedule adjustment",
    resolution: "Alternative supplier secured",
  },
]

interface ConstraintsTableCompactProps {
  projectId?: string
  userRole?: string
  onConstraintClick?: (constraint: any) => void
}

const ConstraintsTableCompact: React.FC<ConstraintsTableCompactProps> = ({
  projectId,
  userRole = "project-manager",
  onConstraintClick,
}) => {
  const [constraints, setConstraints] = useState(mockConstraints)
  const [activeTab, setActiveTab] = useState("open")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedPriority, setSelectedPriority] = useState("all")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingConstraint, setEditingConstraint] = useState<any>(null)
  const [formData, setFormData] = useState({
    description: "",
    category: "",
    priority: "Medium",
    assigned: "",
    dueDate: "",
    impact: "",
    resolution: "",
  })

  // Filter constraints based on tab and filters
  const filteredConstraints = useMemo(() => {
    let filtered = constraints

    // Filter by tab
    if (activeTab === "open") {
      filtered = filtered.filter((c) => c.status !== "Resolved")
    } else {
      filtered = filtered.filter((c) => c.status === "Resolved")
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (c) =>
          c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.no.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.assigned.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((c) => c.category === selectedCategory)
    }

    // Apply priority filter
    if (selectedPriority !== "all") {
      filtered = filtered.filter((c) => c.priority === selectedPriority)
    }

    return filtered
  }, [constraints, activeTab, searchTerm, selectedCategory, selectedPriority])

  // Transform constraints data for the grid
  const transformedConstraints = useMemo(() => {
    return filteredConstraints.map((constraint) => ({
      id: constraint.id,
      no: constraint.no,
      description: constraint.description,
      category: constraint.category,
      priority: constraint.priority,
      status: constraint.status,
      assigned: constraint.assigned,
      dateIdentified: constraint.dateIdentified,
      dueDate: constraint.dueDate,
      daysElapsed: constraint.daysElapsed,
      impact: constraint.impact,
      resolution: constraint.resolution,
      _originalData: constraint, // Keep reference to original data
    }))
  }, [filteredConstraints])

  const categories = useMemo(() => {
    return [...new Set(constraints.map((c) => c.category))].sort()
  }, [constraints])

  const priorities = ["Critical", "High", "Medium", "Low"]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "High":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "Low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "In Progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "Resolved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  // Define column definitions for open constraints
  const openColumnDefs: ProtectedColDef[] = useMemo(
    () => [
      {
        field: "no",
        headerName: "ID",
        width: 80,
        cellRenderer: (params: any) => <div className="font-medium">{params.value}</div>,
        pinned: "left",
      },
      {
        field: "description",
        headerName: "Description",
        width: 300,
        cellRenderer: (params: any) => {
          const constraint = params.data._originalData
          return (
            <div className="max-w-xs">
              <p className="text-sm font-medium truncate">{constraint.description}</p>
              {constraint.impact && <p className="text-xs text-muted-foreground truncate">{constraint.impact}</p>}
            </div>
          )
        },
      },
      {
        field: "category",
        headerName: "Category",
        width: 100,
        cellRenderer: (params: any) => (
          <Badge variant="outline" className="text-xs">
            {params.value}
          </Badge>
        ),
      },
      {
        field: "priority",
        headerName: "Priority",
        width: 90,
        cellRenderer: (params: any) => (
          <Badge className={cn("text-xs", getPriorityColor(params.value))}>{params.value}</Badge>
        ),
      },
      {
        field: "status",
        headerName: "Status",
        width: 100,
        cellRenderer: (params: any) => (
          <Badge className={cn("text-xs", getStatusColor(params.value))}>{params.value}</Badge>
        ),
      },
      {
        field: "assigned",
        headerName: "Assigned",
        width: 130,
        cellRenderer: (params: any) => <div className="text-sm">{params.value}</div>,
      },
      {
        field: "dueDate",
        headerName: "Due Date",
        width: 100,
        cellRenderer: (params: any) => <div className="text-sm">{params.value}</div>,
      },
      {
        field: "daysElapsed",
        headerName: "Days",
        width: 70,
        cellRenderer: (params: any) => <div className="text-sm font-medium">{params.value}d</div>,
      },
      {
        field: "actions",
        headerName: "",
        width: 60,
        cellRenderer: (params: any) => {
          const constraint = params.data._originalData
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleEditConstraint(constraint)}>
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDeleteConstraint(constraint.id)} className="text-red-600">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
        pinned: "right",
        sortable: false,
        filter: false,
      },
    ],
    []
  )

  // Define column definitions for resolved constraints
  const resolvedColumnDefs: ProtectedColDef[] = useMemo(
    () => [
      {
        field: "no",
        headerName: "ID",
        width: 80,
        cellRenderer: (params: any) => <div className="font-medium">{params.value}</div>,
        pinned: "left",
      },
      {
        field: "description",
        headerName: "Description",
        width: 250,
        cellRenderer: (params: any) => {
          const constraint = params.data._originalData
          return (
            <div className="max-w-xs">
              <p className="text-sm font-medium truncate">{constraint.description}</p>
            </div>
          )
        },
      },
      {
        field: "category",
        headerName: "Category",
        width: 100,
        cellRenderer: (params: any) => (
          <Badge variant="outline" className="text-xs">
            {params.value}
          </Badge>
        ),
      },
      {
        field: "priority",
        headerName: "Priority",
        width: 90,
        cellRenderer: (params: any) => (
          <Badge className={cn("text-xs", getPriorityColor(params.value))}>{params.value}</Badge>
        ),
      },
      {
        field: "assigned",
        headerName: "Assigned",
        width: 130,
        cellRenderer: (params: any) => <div className="text-sm">{params.value}</div>,
      },
      {
        field: "resolution",
        headerName: "Resolution",
        width: 250,
        cellRenderer: (params: any) => <p className="text-sm truncate max-w-xs">{params.value}</p>,
      },
      {
        field: "dueDate",
        headerName: "Resolved",
        width: 100,
        cellRenderer: (params: any) => <div className="text-sm">{params.value}</div>,
      },
    ],
    []
  )

  // Grid configuration
  const gridConfig = createGridWithTotalsAndSticky(1, false, {
    allowExport: true,
    allowRowSelection: false,
    allowMultiSelection: false,
    allowColumnReordering: false,
    allowColumnResizing: true,
    allowSorting: true,
    allowFiltering: false, // We handle filtering externally
    allowCellEditing: false,
    showToolbar: false, // We have custom toolbar
    showStatusBar: false,
    theme: "quartz",
  })

  // Handle row click
  const handleRowClick = (event: any) => {
    const constraint = event.data._originalData
    if (onConstraintClick) {
      onConstraintClick(constraint)
    }
  }

  const handleCreateConstraint = () => {
    const newConstraint = {
      id: Date.now().toString(),
      no: `C-${constraints.length + 1}`.padStart(5, "0"),
      ...formData,
      status: "Open",
      dateIdentified: new Date().toISOString().split("T")[0],
      daysElapsed: 0,
    }
    setConstraints([...constraints, newConstraint])
    setIsCreateModalOpen(false)
    setFormData({
      description: "",
      category: "",
      priority: "Medium",
      assigned: "",
      dueDate: "",
      impact: "",
      resolution: "",
    })
  }

  const handleEditConstraint = (constraint: any) => {
    setEditingConstraint(constraint)
    setFormData({
      description: constraint.description,
      category: constraint.category,
      priority: constraint.priority,
      assigned: constraint.assigned,
      dueDate: constraint.dueDate,
      impact: constraint.impact,
      resolution: constraint.resolution,
    })
  }

  const handleUpdateConstraint = () => {
    if (editingConstraint) {
      setConstraints(
        constraints.map((c) =>
          c.id === editingConstraint.id
            ? {
                ...c,
                ...formData,
                daysElapsed: Math.floor(
                  (new Date().getTime() - new Date(c.dateIdentified).getTime()) / (1000 * 60 * 60 * 24)
                ),
              }
            : c
        )
      )
      setEditingConstraint(null)
    }
  }

  const handleDeleteConstraint = (id: string) => {
    setConstraints(constraints.filter((c) => c.id !== id))
  }

  const stats = useMemo(() => {
    const total = constraints.length
    const open = constraints.filter((c) => c.status !== "Resolved").length
    const resolved = constraints.filter((c) => c.status === "Resolved").length
    const critical = constraints.filter((c) => c.priority === "Critical" && c.status !== "Resolved").length
    return { total, open, resolved, critical }
  }, [constraints])

  return (
    <div className="space-y-4">
      {/* Header with Stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <h3 className="text-lg font-semibold">Constraints Log</h3>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <span className="font-medium text-foreground">{stats.total}</span>
              <span>Total</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium text-amber-600">{stats.open}</span>
              <span>Open</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium text-green-600">{stats.resolved}</span>
              <span>Resolved</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium text-red-600">{stats.critical}</span>
              <span>Critical</span>
            </div>
          </div>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-[#FF6B35] hover:bg-[#E55A2B]">
              <Plus className="h-4 w-4 mr-2" />
              Add Constraint
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Constraint</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the constraint..."
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Priority</label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => setFormData({ ...formData, priority: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priorities.map((priority) => (
                        <SelectItem key={priority} value={priority}>
                          {priority}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Assigned To</label>
                  <Input
                    value={formData.assigned}
                    onChange={(e) => setFormData({ ...formData, assigned: e.target.value })}
                    placeholder="Assignee name"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Due Date</label>
                  <Input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Impact</label>
                <Textarea
                  value={formData.impact}
                  onChange={(e) => setFormData({ ...formData, impact: e.target.value })}
                  placeholder="Describe the impact..."
                  className="mt-1"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateConstraint}>Create Constraint</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search constraints..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedPriority} onValueChange={setSelectedPriority}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            {priorities.map((priority) => (
              <SelectItem key={priority} value={priority}>
                {priority}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="open" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Open ({stats.open})
          </TabsTrigger>
          <TabsTrigger value="resolved" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Resolved ({stats.resolved})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="open" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <div className="min-w-0 max-w-full overflow-hidden">
                <ProtectedGrid
                  columnDefs={openColumnDefs}
                  rowData={transformedConstraints}
                  config={gridConfig}
                  events={{
                    onRowSelected: handleRowClick,
                    onGridReady: (event) => {
                      // Grid ready event
                    },
                  }}
                  height="400px"
                  loading={false}
                  enableSearch={false} // We handle search externally
                  title=""
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resolved" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <div className="min-w-0 max-w-full overflow-hidden">
                <ProtectedGrid
                  columnDefs={resolvedColumnDefs}
                  rowData={transformedConstraints}
                  config={gridConfig}
                  events={{
                    onRowSelected: handleRowClick,
                    onGridReady: (event) => {
                      // Grid ready event
                    },
                  }}
                  height="400px"
                  loading={false}
                  enableSearch={false} // We handle search externally
                  title=""
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Modal */}
      {editingConstraint && (
        <Dialog open={!!editingConstraint} onOpenChange={() => setEditingConstraint(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Constraint</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the constraint..."
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Priority</label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => setFormData({ ...formData, priority: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priorities.map((priority) => (
                        <SelectItem key={priority} value={priority}>
                          {priority}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Assigned To</label>
                  <Input
                    value={formData.assigned}
                    onChange={(e) => setFormData({ ...formData, assigned: e.target.value })}
                    placeholder="Assignee name"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Due Date</label>
                  <Input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Impact</label>
                <Textarea
                  value={formData.impact}
                  onChange={(e) => setFormData({ ...formData, impact: e.target.value })}
                  placeholder="Describe the impact..."
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Resolution</label>
                <Textarea
                  value={formData.resolution}
                  onChange={(e) => setFormData({ ...formData, resolution: e.target.value })}
                  placeholder="Describe the resolution..."
                  className="mt-1"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingConstraint(null)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateConstraint}>Update Constraint</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default ConstraintsTableCompact

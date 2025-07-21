import React, { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Download,
  Plus,
  DollarSign,
  Building,
  User,
} from "lucide-react"

export interface SPCR {
  id: string
  projectId: string
  projectName: string
  type: string
  status: string
  requestedBy: string
  requestedDate: string
  position: string
  budget: number
  justification: string
  urgency: string
}

export interface Project {
  id: string
  name: string
  status: string
}

interface SPCRListProps {
  spcrs: SPCR[]
  projects: Project[]
  onEdit?: (spcr: SPCR) => void
  onApprove?: (spcr: SPCR) => void
  onReject?: (spcr: SPCR) => void
  onView?: (spcr: SPCR) => void
  onWithdraw?: (spcr: SPCR) => void
  onExport?: (spcrs: SPCR[]) => void
  userRole?: "admin" | "manager" | "employee"
}

export function SPCRList({
  spcrs,
  projects,
  onEdit,
  onApprove,
  onReject,
  onView,
  onWithdraw,
  onExport,
  userRole = "employee",
}: SPCRListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [projectFilter, setProjectFilter] = useState<string>("all")
  const [selectedSpcrs, setSelectedSpcrs] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<string>("requestedDate")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  // Filter and sort SPCRs
  const filteredSpcrs = useMemo(() => {
    let filtered = spcrs.filter((spcr) => {
      const matchesSearch =
        spcr.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        spcr.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        spcr.requestedBy.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" || spcr.status === statusFilter
      const matchesType = typeFilter === "all" || spcr.type === typeFilter
      const matchesProject = projectFilter === "all" || spcr.projectId === projectFilter

      return matchesSearch && matchesStatus && matchesType && matchesProject
    })

    // Sort SPCRs
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof SPCR]
      let bValue: any = b[sortBy as keyof SPCR]

      if (sortBy === "requestedDate") {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  }, [spcrs, searchTerm, statusFilter, typeFilter, projectFilter, sortBy, sortOrder])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedSpcrs(filteredSpcrs.map((spcr) => spcr.id))
    } else {
      setSelectedSpcrs([])
    }
  }

  const handleSelectSpcr = (spcrId: string, checked: boolean) => {
    if (checked) {
      setSelectedSpcrs([...selectedSpcrs, spcrId])
    } else {
      setSelectedSpcrs(selectedSpcrs.filter((id) => id !== spcrId))
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "submitted":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "draft":
        return <AlertTriangle className="h-4 w-4 text-gray-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      submitted: "bg-yellow-100 text-yellow-800",
      draft: "bg-gray-100 text-gray-800",
    }
    return variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800"
  }

  const getTypeBadge = (type: string) => {
    return type === "increase" ? "bg-blue-100 text-blue-800" : "bg-orange-100 text-orange-800"
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
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

  const canEdit = (spcr: SPCR) => {
    return userRole === "admin" || (userRole === "manager" && spcr.status === "draft")
  }

  const canApprove = (spcr: SPCR) => {
    return userRole === "admin" && spcr.status === "submitted"
  }

  const canReject = (spcr: SPCR) => {
    return userRole === "admin" && spcr.status === "submitted"
  }

  const canWithdraw = (spcr: SPCR) => {
    return spcr.status === "draft" || spcr.status === "submitted"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Staffing Plan Change Requests</h2>
          <p className="text-muted-foreground">Manage and track all staffing change requests</p>
        </div>
        <div className="flex gap-2">
          {selectedSpcrs.length > 0 && (
            <Button
              variant="outline"
              onClick={() => onExport?.(filteredSpcrs.filter((spcr) => selectedSpcrs.includes(spcr.id)))}
            >
              <Download className="h-4 w-4 mr-2" />
              Export Selected ({selectedSpcrs.length})
            </Button>
          )}
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New SPCR
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search SPCRs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="increase">Staff Increase</SelectItem>
                <SelectItem value="decrease">Staff Decrease</SelectItem>
              </SelectContent>
            </Select>

            <Select value={projectFilter} onValueChange={setProjectFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="requestedDate">Request Date</SelectItem>
                <SelectItem value="position">Position</SelectItem>
                <SelectItem value="projectName">Project</SelectItem>
                <SelectItem value="budget">Budget</SelectItem>
                <SelectItem value="urgency">Urgency</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {filteredSpcrs.length} of {spcrs.length} SPCRs
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort order:</span>
          <Button variant="ghost" size="sm" onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
            {sortOrder === "asc" ? "↑" : "↓"}
          </Button>
        </div>
      </div>

      {/* SPCR Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedSpcrs.length === filteredSpcrs.length && filteredSpcrs.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>SPCR</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Requested By</TableHead>
                <TableHead>Budget Impact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSpcrs.map((spcr) => (
                <TableRow key={spcr.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedSpcrs.includes(spcr.id)}
                      onCheckedChange={(checked) => handleSelectSpcr(spcr.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(spcr.status)}
                      <div>
                        <div className="font-medium">#{spcr.id}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(spcr.requestedDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{spcr.projectName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{spcr.position}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{spcr.requestedBy}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <Badge
                        className={
                          spcr.type === "increase" ? "bg-blue-100 text-blue-800" : "bg-orange-100 text-orange-800"
                        }
                      >
                        {spcr.type === "increase" ? "+" : "-"}${spcr.budget.toLocaleString()}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusBadge(spcr.status)}>
                        {spcr.status.charAt(0).toUpperCase() + spcr.status.slice(1)}
                      </Badge>
                      <Badge className={getTypeBadge(spcr.type)}>
                        {spcr.type === "increase" ? "Increase" : "Decrease"}
                      </Badge>
                      <Badge className={getUrgencyColor(spcr.urgency)}>
                        {spcr.urgency.charAt(0).toUpperCase() + spcr.urgency.slice(1)}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {onView && (
                          <DropdownMenuItem onClick={() => onView(spcr)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                        )}
                        {canEdit(spcr) && onEdit && (
                          <DropdownMenuItem onClick={() => onEdit(spcr)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                        )}
                        {canApprove(spcr) && onApprove && (
                          <DropdownMenuItem onClick={() => onApprove(spcr)}>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </DropdownMenuItem>
                        )}
                        {canReject(spcr) && onReject && (
                          <DropdownMenuItem onClick={() => onReject(spcr)}>
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </DropdownMenuItem>
                        )}
                        {canWithdraw(spcr) && onWithdraw && (
                          <DropdownMenuItem onClick={() => onWithdraw(spcr)}>
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Withdraw
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Empty State */}
      {filteredSpcrs.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No SPCRs Found</h3>
            <p className="text-muted-foreground text-center">
              No staffing plan change requests match your current filters.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

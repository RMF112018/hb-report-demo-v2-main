"use client"

import React, { useState, useMemo, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { 
  Calendar, 
  Filter, 
  Download, 
  ZoomIn, 
  ZoomOut,
  GripVertical,
  Search,
  SortAsc,
  SortDesc,
  FileText,
  User,
  Users,
  Building,
  Plus,
  MessageSquare,
  Save,
  Trash2
} from 'lucide-react'
import { useStaffingStore, type StaffMember, type Project } from '../store/useStaffingStore'
import { format, addDays, differenceInDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns'

interface InteractiveStaffingGanttProps {
  userRole: 'executive' | 'project-executive' | 'project-manager'
  isReadOnly?: boolean
}

// Base position types with distinct colors
const BASE_POSITION_COLORS: Record<string, string> = {
  'Project Executive': 'bg-violet-600',
  'Project Manager': 'bg-blue-600',
  'Superintendent': 'bg-green-600',
  'Project Administrator': 'bg-cyan-600',
  'Project Accountant': 'bg-amber-600',
  'Project Engineer': 'bg-indigo-600',
  'Field Engineer': 'bg-emerald-600',
  'Safety Manager': 'bg-red-600',
  'Quality Manager': 'bg-purple-600',
  'Foreman': 'bg-orange-600',
  'Estimator': 'bg-pink-600',
  'Scheduler': 'bg-slate-600',
}

interface GanttItem {
  id: string
  staffMember: StaffMember
  project: Project
  startDate: Date
  endDate: Date
  position: number
  annotation?: string
}

interface AnnotationModal {
  isOpen: boolean
  item: GanttItem | null
  annotation: string
}

interface AssignmentData {
  id: string
  project_id: number | ''
  startDate: string
  endDate: string
  position: string
  comments: string
}

interface AssignmentModal {
  isOpen: boolean
  staffMember: StaffMember | null
  assignments: AssignmentData[]
  isEdit: boolean
  selectedPosition: string
  step: 'position' | 'staff' | 'assignments'
}

export const InteractiveStaffingGantt: React.FC<InteractiveStaffingGanttProps> = ({
  userRole,
  isReadOnly = false
}) => {
  const {
    staffMembers,
    projects,
    ganttFilters,
    ganttViewMode,
    setGanttFilters,
    setGanttViewMode,
    updateStaffAssignment,
    selectedProject
  } = useStaffingStore()

  const [sortField, setSortField] = useState<'name' | 'position' | 'project'>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [draggedItem, setDraggedItem] = useState<GanttItem | null>(null)
  const [annotationModal, setAnnotationModal] = useState<AnnotationModal>({
    isOpen: false,
    item: null,
    annotation: ''
  })
  
  const [assignmentModal, setAssignmentModal] = useState<AssignmentModal>({
    isOpen: false,
    staffMember: null,
    assignments: [],
    isEdit: false,
    selectedPosition: '',
    step: 'position'
  })
  
  // Helper function to create new assignment
  const createNewAssignment = (position = '', project_id: number | '' = ''): AssignmentData => ({
    id: `assignment-${Date.now()}-${Math.random()}`,
    project_id,
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(addDays(new Date(), 30), 'yyyy-MM-dd'),
    position,
    comments: ''
  })

  // Calculate date range based on view mode
  const dateRange = useMemo(() => {
    const now = new Date()
    const start = startOfWeek(addDays(now, -30))
    const end = endOfWeek(addDays(now, 90))
    return { start, end }
  }, [])

  // Generate time periods for header
  const timePeriods = useMemo(() => {
    const { start, end } = dateRange
    const days = eachDayOfInterval({ start, end })
    
    switch (ganttViewMode) {
      case 'week':
        return days.filter((_, index) => index % 7 === 0)
      case 'month':
        return days.filter(day => day.getDate() === 1)
      case 'quarter':
        return days.filter(day => day.getDate() === 1 && day.getMonth() % 3 === 0)
      default:
        return days.filter(day => day.getDate() === 1)
    }
  }, [dateRange, ganttViewMode])

  // Convert staff data to Gantt items
  const ganttItems = useMemo((): GanttItem[] => {
    let items: GanttItem[] = []
    
    staffMembers.forEach((staff, staffIndex) => {
      staff.assignments.forEach((assignment, assignmentIndex) => {
        const project = projects.find(p => p.project_id === assignment.project_id)
        if (!project) return

        // Apply project filter for Project Executive and Project Manager
        if (userRole === 'project-executive') {
          const portfolioProjects = [2525840, 2525841, 2525842, 2525843, 2525844, 2525845]
          if (!portfolioProjects.includes(assignment.project_id)) return
        }
        
        if (userRole === 'project-manager' && assignment.project_id !== 2525840) return
        
        // Apply selected project filter
        if (selectedProject && assignment.project_id !== selectedProject) return

        items.push({
          id: `${staff.id}-${assignment.project_id}-${assignmentIndex}`,
          staffMember: staff,
          project,
          startDate: new Date(assignment.startDate),
          endDate: new Date(assignment.endDate),
          position: staffIndex * 100 + assignmentIndex
        })
      })
    })

    // Apply filters
    if (ganttFilters.search) {
      const searchLower = ganttFilters.search.toLowerCase()
      items = items.filter(item =>
        item.staffMember.name.toLowerCase().includes(searchLower) ||
        item.staffMember.position.toLowerCase().includes(searchLower) ||
        item.project.name.toLowerCase().includes(searchLower)
      )
    }

    if (ganttFilters.position !== 'all') {
      items = items.filter(item => item.staffMember.position === ganttFilters.position)
    }

    if (ganttFilters.project !== 'all') {
      items = items.filter(item => item.project.project_id.toString() === ganttFilters.project)
    }

    // Apply sorting
    items.sort((a, b) => {
      let aValue: string, bValue: string
      
      switch (sortField) {
        case 'name':
          aValue = a.staffMember.name
          bValue = b.staffMember.name
          break
        case 'position':
          aValue = a.staffMember.position
          bValue = b.staffMember.position
          break
        case 'project':
          aValue = a.project.name
          bValue = b.project.name
          break
        default:
          return 0
      }

      const comparison = aValue.localeCompare(bValue)
      return sortDirection === 'asc' ? comparison : -comparison
    })

    return items
  }, [staffMembers, projects, ganttFilters, sortField, sortDirection, userRole, selectedProject])

  // Get unique positions and projects for filters
  const uniquePositions = useMemo(() => {
    return [...new Set(staffMembers.map(staff => staff.position))].sort()
  }, [staffMembers])

  const uniqueProjects = useMemo(() => {
    const projectIds = new Set(
      staffMembers.flatMap(staff => staff.assignments.map(a => a.project_id))
    )
    return projects.filter(p => projectIds.has(p.project_id))
  }, [staffMembers, projects])

  // Calculate position and width for Gantt bars
  const calculatePosition = useCallback((date: Date) => {
    const { start, end } = dateRange
    const totalDays = differenceInDays(end, start)
    const daysSinceStart = differenceInDays(date, start)
    return Math.max(0, Math.min(100, (daysSinceStart / totalDays) * 100))
  }, [dateRange])

  const calculateWidth = useCallback((startDate: Date, endDate: Date) => {
    const { start, end } = dateRange
    const totalDays = differenceInDays(end, start)
    const itemDays = differenceInDays(endDate, startDate)
    return Math.max(1, (itemDays / totalDays) * 100)
  }, [dateRange])

  // Drag handlers
  const handleDragStart = (item: GanttItem) => {
    if (isReadOnly || userRole !== 'executive') return
    setDraggedItem(item)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, targetStaffId: string) => {
    e.preventDefault()
    if (!draggedItem || isReadOnly || userRole !== 'executive') return

    // Update assignment logic would go here
    // For demo purposes, we'll just show a success message
    console.log(`Moving assignment from ${draggedItem.staffMember.name} to staff ${targetStaffId}`)
    setDraggedItem(null)
  }

  // Sort handlers
  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  // Export handlers
  const handleExportPDF = () => {
    console.log('Exporting to PDF...') // Would implement actual PDF export
  }

  const handleExportExcel = () => {
    console.log('Exporting to Excel...') // Would implement actual Excel export
  }

  // Annotation handlers
  const handleAddAnnotation = (item: GanttItem) => {
    setAnnotationModal({
      isOpen: true,
      item,
      annotation: item.annotation || ''
    })
  }

  const handleSaveAnnotation = () => {
    if (annotationModal.item) {
      // Update annotation logic would go here
      console.log(`Saving annotation for ${annotationModal.item.staffMember.name}: ${annotationModal.annotation}`)
    }
    setAnnotationModal({ isOpen: false, item: null, annotation: '' })
  }

  // Assignment management handlers
  const handleCreateAssignment = () => {
    if (userRole !== 'executive') return
    
    setAssignmentModal({
      isOpen: true,
      staffMember: null,
      assignments: [],
      isEdit: false,
      selectedPosition: '',
      step: 'position'
    })
  }

  const handleEditStaffAssignment = (staffMember: StaffMember) => {
    if (userRole !== 'executive') return
    
    // Convert existing assignments to modal format
    const existingAssignments = staffMember.assignments.map((assignment, index) => ({
      id: `existing-${index}`,
      project_id: assignment.project_id,
      startDate: format(new Date(assignment.startDate), 'yyyy-MM-dd'),
      endDate: format(new Date(assignment.endDate), 'yyyy-MM-dd'),
      position: staffMember.position,
      comments: ''
    }))
    
    setAssignmentModal({
      isOpen: true,
      staffMember,
      assignments: existingAssignments.length > 0 ? existingAssignments : [createNewAssignment(staffMember.position)],
      isEdit: true,
      selectedPosition: staffMember.position,
      step: 'assignments'
    })
  }

  // Assignment manipulation within modal
  const addAssignment = () => {
    setAssignmentModal(prev => ({
      ...prev,
      assignments: [...prev.assignments, createNewAssignment(prev.staffMember?.position || '')]
    }))
  }

  const removeAssignment = (assignmentId: string) => {
    setAssignmentModal(prev => ({
      ...prev,
      assignments: prev.assignments.filter(a => a.id !== assignmentId)
    }))
  }

  const updateAssignment = (assignmentId: string, updates: Partial<AssignmentData>) => {
    setAssignmentModal(prev => ({
      ...prev,
      assignments: prev.assignments.map(a => 
        a.id === assignmentId ? { ...a, ...updates } : a
      )
    }))
  }

  // Position and staff selection handlers
  const handlePositionSelect = (position: string) => {
    setAssignmentModal(prev => ({
      ...prev,
      selectedPosition: position,
      step: 'staff'
    }))
  }

  const handleStaffMemberSelect = (staffMemberId: string) => {
    const staffMember = staffMembers.find(s => s.id === staffMemberId)
    if (staffMember) {
      setAssignmentModal(prev => ({
        ...prev,
        staffMember,
        assignments: [createNewAssignment(prev.selectedPosition)],
        step: 'assignments'
      }))
    }
  }

  const goBackToStaffSelection = () => {
    setAssignmentModal(prev => ({
      ...prev,
      staffMember: null,
      assignments: [],
      step: 'staff'
    }))
  }

  const goBackToPositionSelection = () => {
    setAssignmentModal(prev => ({
      ...prev,
      staffMember: null,
      assignments: [],
      selectedPosition: '',
      step: 'position'
    }))
  }

  // Get staff members filtered by position
  const getFilteredStaffMembers = (position: string) => {
    return staffMembers.filter(staff => staff.position === position)
  }

  const handleSaveAssignment = () => {
    // Validate all assignments
    const validAssignments = assignmentModal.assignments.filter(assignment => 
      assignment.project_id && assignment.startDate && assignment.endDate && assignment.position
    )

    if (validAssignments.length === 0) {
      return
    }

    // Convert assignments to store format
    const storeAssignments = validAssignments.map(assignment => ({
      project_id: Number(assignment.project_id),
      role: assignment.position.substring(0, 2).toUpperCase(),
      startDate: new Date(assignment.startDate).toISOString(),
      endDate: new Date(assignment.endDate).toISOString(),
      comments: assignment.comments
    }))

    if (assignmentModal.staffMember) {
      // Update existing staff member
      const updatedStaffMember = { 
        ...assignmentModal.staffMember,
        assignments: storeAssignments,
        // Update position to the most recent assignment's position
        position: validAssignments[validAssignments.length - 1].position
      }
      
      // Update store
      updateStaffAssignment(updatedStaffMember.id, updatedStaffMember)
    } else {
      // For new assignments without a specific staff member, we would need to implement staff creation
      // This would require additional UI to select/create staff members
      console.log('New staff member creation not implemented yet')
    }

    // Close modal
    setAssignmentModal({
      isOpen: false,
      staffMember: null,
      assignments: [],
      isEdit: false,
      selectedPosition: '',
      step: 'position'
    })
  }

  // Calculate financial metrics
  const calculateFinancialMetrics = (staffMember: StaffMember | null, projectId: number | '') => {
    if (!staffMember || !projectId) return null
    
    const project = projects.find(p => p.project_id === Number(projectId))
    if (!project) return null

    const laborRate = staffMember.laborRate
    const laborBurden = laborRate * 0.35 // 35% burden rate
    const totalLaborCost = laborRate + laborBurden
    const billableRate = staffMember.billableRate
    const margin = ((billableRate - totalLaborCost) / billableRate) * 100

    return {
      laborRate,
      laborBurden,
      totalLaborCost,
      billableRate,
      margin,
      project
    }
  }

  const SortIcon = ({ field }: { field: typeof sortField }) => {
    if (sortField !== field) return null
    return sortDirection === 'asc' ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
  }

  // Extract base position type from full position name
  const getBasePositionType = (position: string): string => {
    // Remove level indicators (I, II, III)
    let baseType = position.replace(/\s+(I{1,3}|IV|V)$/, '')
    
    // Handle special prefixes
    if (baseType.includes('Senior ')) {
      baseType = baseType.replace('Senior ', '')
    }
    if (baseType.includes('Assistant ')) {
      baseType = baseType.replace('Assistant ', '')
    }
    if (baseType.includes('General ')) {
      baseType = baseType.replace('General ', '')
    }
    
    return baseType
  }

  // Get position color for staff member based on base position type
  const getPositionColor = (position: string): string => {
    const baseType = getBasePositionType(position)
    
    // First try exact match with base type
    if (BASE_POSITION_COLORS[baseType]) {
      return BASE_POSITION_COLORS[baseType]
    }
    
    // Try direct match (for positions that don't need base type extraction)
    if (BASE_POSITION_COLORS[position]) {
      return BASE_POSITION_COLORS[position]
    }
    
    // Generate consistent fallback color for unmapped positions
    const fallbackColors = [
      'bg-teal-600', 'bg-rose-600', 'bg-lime-600', 'bg-sky-600', 
      'bg-fuchsia-600', 'bg-yellow-600', 'bg-gray-600', 'bg-stone-600'
    ]
    
    // Use position string hash to get consistent color
    const hash = position.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return fallbackColors[hash % fallbackColors.length]
  }

  return (
    <div className="w-full space-y-6">
      {/* Header with Title and Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Staff Management</h3>
          <Badge variant="outline" className="ml-2">
            {ganttItems.length} assignments
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={ganttViewMode} onValueChange={(value: any) => setGanttViewMode(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Weekly</SelectItem>
              <SelectItem value="month">Monthly</SelectItem>
              <SelectItem value="quarter">Quarterly</SelectItem>
            </SelectContent>
          </Select>
          
          {userRole === 'executive' && !isReadOnly && (
            <div className="flex items-center gap-1">
              <Button variant="default" size="sm" onClick={handleCreateAssignment}>
                <Plus className="h-4 w-4 mr-1" />
                Create Assignment
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportPDF}>
                <FileText className="h-4 w-4 mr-1" />
                PDF
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportExcel}>
                <Download className="h-4 w-4 mr-1" />
                Excel
              </Button>
            </div>
          )}
          {userRole === 'executive' && isReadOnly && (
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" onClick={handleExportPDF}>
                <FileText className="h-4 w-4 mr-1" />
                PDF
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportExcel}>
                <Download className="h-4 w-4 mr-1" />
                Excel
              </Button>
            </div>
          )}
        </div>
      </div>
        {/* Filters */}
        <div className="flex items-center gap-4 mb-6 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search staff or projects..."
              value={ganttFilters.search}
              onChange={(e) => setGanttFilters({ search: e.target.value })}
              className="w-64"
            />
          </div>
          
          <Select 
            value={ganttFilters.position} 
            onValueChange={(value) => setGanttFilters({ position: value })}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Positions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Positions</SelectItem>
              {uniquePositions.map(position => (
                <SelectItem key={position} value={position}>
                  {position}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select 
            value={ganttFilters.project} 
            onValueChange={(value) => setGanttFilters({ project: value })}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Projects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {uniqueProjects.map(project => (
                <SelectItem key={project.project_id} value={project.project_id.toString()}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setGanttFilters({ search: '', position: 'all', project: 'all' })}
          >
            Clear Filters
          </Button>
        </div>

        {ganttItems.length > 0 ? (
          <div className="space-y-4">
            {/* Timeline Header */}
            <div className="relative border-b border-gray-200 dark:border-gray-700 pb-4">
              <div className="flex">
                <div className="w-[600px] flex-shrink-0 flex gap-6 text-sm font-medium text-gray-900 dark:text-gray-100">
                  <button 
                    className="w-48 flex items-center gap-1 hover:bg-muted/50 p-2 rounded justify-start"
                    onClick={() => handleSort('name')}
                  >
                    <User className="h-4 w-4" />
                    Staff Member
                    <SortIcon field="name" />
                  </button>
                  <button 
                    className="w-44 flex items-center gap-1 hover:bg-muted/50 p-2 rounded justify-start"
                    onClick={() => handleSort('position')}
                  >
                    Position
                    <SortIcon field="position" />
                  </button>
                  <button 
                    className="w-56 flex items-center gap-1 hover:bg-muted/50 p-2 rounded justify-start"
                    onClick={() => handleSort('project')}
                  >
                    <Building className="h-4 w-4" />
                    Project
                    <SortIcon field="project" />
                  </button>
                </div>
                <div className="flex-1 relative">
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    {timePeriods.map((period, index) => (
                      <div key={index} style={{ left: `${calculatePosition(period)}%` }} className="absolute">
                        {format(period, ganttViewMode === 'week' ? "MMM dd" : ganttViewMode === 'month' ? "MMM yyyy" : "Qo yyyy")}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline Rows */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {ganttItems.map((item) => (
                <div key={item.id} className="flex items-center group">
                  {/* Staff Info */}
                  <div 
                    className="w-[600px] flex-shrink-0 flex gap-6 pr-4"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, item.staffMember.id)}
                  >
                    <div className="w-48 flex items-center gap-2">
                      {userRole === 'executive' && !isReadOnly && (
                        <div
                          className="cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
                          draggable
                          onDragStart={() => handleDragStart(item)}
                        >
                          <GripVertical className="h-4 w-4 text-gray-400" />
                        </div>
                      )}
                      {userRole === 'executive' && !isReadOnly ? (
                        <button
                          className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 truncate cursor-pointer"
                          onClick={() => handleEditStaffAssignment(item.staffMember)}
                        >
                          {item.staffMember.name}
                        </button>
                      ) : (
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          {item.staffMember.name}
                        </span>
                      )}
                    </div>
                    <div className="w-44 flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getPositionColor(item.staffMember.position)}`}></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {item.staffMember.position}
                      </span>
                    </div>
                    <div className="w-56 text-sm text-gray-600 dark:text-gray-400">
                      {item.project.name}
                    </div>
                  </div>

                  {/* Timeline Bar */}
                  <div className="flex-1 relative h-8">
                    <div className="absolute inset-y-0 w-full bg-gray-100 dark:bg-gray-800 rounded"></div>
                    
                    {/* Assignment Bar */}
                    <div
                      className={`absolute inset-y-1 rounded ${getPositionColor(item.staffMember.position)} hover:opacity-80 transition-opacity cursor-pointer group/bar`}
                      style={{
                        left: `${calculatePosition(item.startDate)}%`,
                        width: `${calculateWidth(item.startDate, item.endDate)}%`,
                      }}
                      onClick={() => userRole === 'executive' && !isReadOnly ? handleEditStaffAssignment(item.staffMember) : handleAddAnnotation(item)}
                    >
                      <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-medium opacity-0 group-hover/bar:opacity-100 transition-opacity">
                        {differenceInDays(item.endDate, item.startDate)}d
                      </div>
                      
                      {item.annotation && (
                        <MessageSquare className="absolute -top-1 -right-1 h-3 w-3 text-yellow-500" />
                      )}
                    </div>

                    {/* Today Line */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-red-500 dark:bg-red-400 z-10"
                      style={{ left: `${calculatePosition(new Date())}%` }}
                    ></div>
                  </div>

                  {/* Actions */}
                  <div className="w-16 flex-shrink-0 text-right">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      ${item.staffMember.laborRate}/hr
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Today</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-3 w-3 text-yellow-500" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">Has Annotation</span>
                </div>
                {/* Position Legend */}
                {(() => {
                  // Get unique base position types from current data
                  const baseTypes = [...new Set(uniquePositions.map(pos => getBasePositionType(pos)))]
                    .sort()
                    .slice(0, 8) // Show up to 8 base types
                  
                  return baseTypes.map((baseType) => (
                    <div key={baseType} className="flex items-center gap-1">
                      <div className={`w-3 h-3 ${getPositionColor(baseType)} rounded`}></div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">{baseType}</span>
                    </div>
                  ))
                })()}
                {userRole === 'executive' && !isReadOnly && (
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">Drag to Reassign</span>
                  </div>
                )}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Showing {format(dateRange.start, "MMM dd")} - {format(dateRange.end, "MMM dd, yyyy")}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <div className="text-sm">No staff assignments found</div>
            <div className="text-xs">Try adjusting your filters</div>
          </div>
        )}

      {/* Annotation Modal */}
      <Dialog open={annotationModal.isOpen} onOpenChange={(open) => setAnnotationModal(prev => ({ ...prev, isOpen: open }))}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Assignment Annotation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {annotationModal.item && (
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="text-sm font-medium">{annotationModal.item.staffMember.name}</div>
                <div className="text-xs text-muted-foreground">
                  {annotationModal.item.project.name} • {format(annotationModal.item.startDate, 'MMM dd')} - {format(annotationModal.item.endDate, 'MMM dd')}
                </div>
              </div>
            )}
            <div>
              <label className="text-sm font-medium mb-2 block">Annotation</label>
              <Textarea
                placeholder="Add notes about this assignment..."
                value={annotationModal.annotation}
                onChange={(e) => setAnnotationModal(prev => ({ ...prev, annotation: e.target.value }))}
                rows={4}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setAnnotationModal({ isOpen: false, item: null, annotation: '' })}>
                Cancel
              </Button>
              <Button onClick={handleSaveAnnotation}>
                <Save className="h-4 w-4 mr-1" />
                Save Annotation
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Assignment Modal */}
      <Dialog open={assignmentModal.isOpen} onOpenChange={(open) => setAssignmentModal(prev => ({ ...prev, isOpen: open }))}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {assignmentModal.isEdit ? 'Edit Staff Assignments' : 
               assignmentModal.step === 'position' ? 'Select Position' :
               assignmentModal.step === 'staff' ? 'Select Staff Member' :
               'Create Staff Assignments'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Step 1: Position Selection */}
            {assignmentModal.step === 'position' && !assignmentModal.isEdit && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Select Position Type</label>
                  <p className="text-sm text-muted-foreground mb-4">
                    Choose the position type you want to assign someone to.
                  </p>
                  <Select 
                    value={assignmentModal.selectedPosition} 
                    onValueChange={handlePositionSelect}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Search or select a position..." />
                    </SelectTrigger>
                    <SelectContent className="z-[99999]">
                      {uniquePositions.map(position => (
                        <SelectItem key={position} value={position}>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 ${getPositionColor(position)} rounded`}></div>
                            {position}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 2: Staff Member Selection */}
            {assignmentModal.step === 'staff' && !assignmentModal.isEdit && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Button variant="outline" size="sm" onClick={goBackToPositionSelection}>
                    ← Back to Position
                  </Button>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 ${getPositionColor(assignmentModal.selectedPosition)} rounded`}></div>
                    <span className="font-medium">{assignmentModal.selectedPosition}</span>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Select Staff Member</label>
                  <p className="text-sm text-muted-foreground mb-4">
                    Choose which {assignmentModal.selectedPosition.toLowerCase()} to assign.
                  </p>
                  
                  {(() => {
                    const filteredStaff = getFilteredStaffMembers(assignmentModal.selectedPosition)
                    
                    if (filteredStaff.length === 0) {
                      return (
                        <div className="text-center py-8 text-muted-foreground">
                          <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <div className="text-sm">No staff members found for this position</div>
                        </div>
                      )
                    }
                    
                    return (
                      <Select 
                        value={assignmentModal.staffMember?.id || ''} 
                        onValueChange={handleStaffMemberSelect}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Search or select a staff member..." />
                        </SelectTrigger>
                        <SelectContent className="z-[99999]">
                          {filteredStaff.map(staff => (
                            <SelectItem key={staff.id} value={staff.id}>
                              <div className="flex items-center justify-between w-full">
                                <span>{staff.name}</span>
                                <div className="text-xs text-muted-foreground ml-2">
                                  {staff.experience}y exp • ${staff.laborRate}/hr
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )
                  })()}
                </div>
              </div>
            )}

            {/* Step 3: Assignment Details (or Edit Mode) */}
            {(assignmentModal.step === 'assignments' || assignmentModal.isEdit) && (
              <>
                {!assignmentModal.isEdit && (
                  <div className="flex items-center gap-2 mb-4">
                    <Button variant="outline" size="sm" onClick={goBackToStaffSelection}>
                      ← Back to Staff
                    </Button>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 ${getPositionColor(assignmentModal.selectedPosition)} rounded`}></div>
                      <span className="font-medium">{assignmentModal.staffMember?.name}</span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">{assignmentModal.selectedPosition}</span>
                    </div>
                  </div>
                )}

                {/* Staff Member Selection (Edit Mode Only) */}
                {assignmentModal.isEdit && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">Staff Member</label>
                    <Select 
                      value={assignmentModal.staffMember?.id || ''} 
                      onValueChange={(value) => {
                        const staff = staffMembers.find(s => s.id === value)
                        if (staff) {
                          setAssignmentModal(prev => ({
                            ...prev,
                            staffMember: staff,
                            assignments: prev.assignments.map(a => ({ ...a, position: staff.position }))
                          }))
                        }
                      }}
                      disabled={assignmentModal.isEdit}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select staff member" />
                      </SelectTrigger>
                      <SelectContent className="z-[99999]">
                        {staffMembers.map(staff => (
                          <SelectItem key={staff.id} value={staff.id}>
                            {staff.name} - {staff.position}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Assignments List */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-medium">Assignments ({assignmentModal.assignments.length})</h4>
                    <Button onClick={addAssignment} size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Assignment
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {assignmentModal.assignments.map((assignment, index) => (
                      <div key={assignment.id} className="border rounded-lg p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <h5 className="font-medium">Assignment {index + 1}</h5>
                          {assignmentModal.assignments.length > 1 && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => removeAssignment(assignment.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Remove
                            </Button>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          {/* Position */}
                          <div>
                            <label className="text-sm font-medium mb-2 block">Position</label>
                                                    <Select 
                          value={assignment.position} 
                          onValueChange={(value) => updateAssignment(assignment.id, { position: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select position" />
                          </SelectTrigger>
                          <SelectContent className="z-[99999]">
                            {uniquePositions.map(position => (
                              <SelectItem key={position} value={position}>
                                {position}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                          </div>

                          {/* Project */}
                          <div>
                            <label className="text-sm font-medium mb-2 block">Project</label>
                                                    <Select 
                          value={assignment.project_id.toString()} 
                          onValueChange={(value) => updateAssignment(assignment.id, { project_id: Number(value) })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select project" />
                          </SelectTrigger>
                          <SelectContent className="z-[99999]">
                            {projects.map(project => (
                              <SelectItem key={project.project_id} value={project.project_id.toString()}>
                                {project.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                          </div>
                        </div>

                        {/* Date Range */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium mb-2 block">Start Date</label>
                            <Input
                              type="date"
                              value={assignment.startDate}
                              onChange={(e) => updateAssignment(assignment.id, { startDate: e.target.value })}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">End Date</label>
                            <Input
                              type="date"
                              value={assignment.endDate}
                              onChange={(e) => updateAssignment(assignment.id, { endDate: e.target.value })}
                            />
                          </div>
                        </div>

                        {/* Comments */}
                        <div>
                          <label className="text-sm font-medium mb-2 block">Comments</label>
                          <Textarea
                            placeholder="Add any notes about this assignment..."
                            value={assignment.comments}
                            onChange={(e) => updateAssignment(assignment.id, { comments: e.target.value })}
                            rows={2}
                          />
                        </div>

                        {/* Financial Information */}
                        {assignmentModal.staffMember && assignment.project_id && (
                          <div className="p-3 bg-muted/50 rounded-lg">
                            <h6 className="text-sm font-medium mb-2">Financial Information</h6>
                            {(() => {
                              const metrics = calculateFinancialMetrics(assignmentModal.staffMember, assignment.project_id)
                              if (!metrics) return null
                              
                                                          return (
                              <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                  <div className="text-muted-foreground">Labor Rate</div>
                                  <div className="font-medium">${metrics.laborRate.toFixed(2)}/hr</div>
                                </div>
                                <div>
                                  <div className="text-muted-foreground">Labor Burden (35%)</div>
                                  <div className="font-medium">${metrics.laborBurden.toFixed(2)}/hr</div>
                                </div>
                                <div>
                                  <div className="text-muted-foreground">Total Labor Cost</div>
                                  <div className="font-medium">${metrics.totalLaborCost.toFixed(2)}/hr</div>
                                </div>
                                <div>
                                  <div className="text-muted-foreground">Billable Rate</div>
                                  <div className="font-medium text-blue-600 dark:text-blue-400">${metrics.billableRate.toFixed(2)}/hr</div>
                                </div>
                                <div className="col-span-2">
                                  <div className="text-muted-foreground">Profit Margin</div>
                                  <div className={`font-medium ${metrics.margin > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {metrics.margin.toFixed(1)}% (${(metrics.billableRate - metrics.totalLaborCost).toFixed(2)}/hr)
                                  </div>
                                </div>
                              </div>
                            )
                            })()}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={() => setAssignmentModal({
                  isOpen: false,
                  staffMember: null,
                  assignments: [],
                  isEdit: false,
                  selectedPosition: '',
                  step: 'position'
                })}
              >
                Cancel
              </Button>
              
              {/* Show Save button only on assignment step */}
              {(assignmentModal.step === 'assignments' || assignmentModal.isEdit) && (
                <Button onClick={handleSaveAssignment}>
                  <Save className="h-4 w-4 mr-1" />
                  Save Assignments ({assignmentModal.assignments.filter(a => a.project_id && a.position).length})
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 
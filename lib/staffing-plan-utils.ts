import { format, eachMonthOfInterval, startOfMonth, endOfMonth, differenceInDays } from 'date-fns'
import type { 
  StaffingPlan, 
  StaffingPlanActivity, 
  StaffingAllocation, 
  StaffingPlanMonth,
  StaffRole 
} from '@/types/staff-planning'

/**
 * Generate months between two dates for staffing plan
 */
export const generatePlanningMonths = (startDate: Date, endDate: Date): StaffingPlanMonth[] => {
  const months = eachMonthOfInterval({
    start: startOfMonth(startDate),
    end: endOfMonth(endDate)
  })
  
  return months.map(month => ({
    year: month.getFullYear(),
    month: month.getMonth() + 1,
    label: format(month, 'MMM yyyy'),
    startDate: startOfMonth(month),
    endDate: endOfMonth(month)
  }))
}

/**
 * Generate a sample staffing plan for demonstration
 */
export const generateSampleStaffingPlan = (projectId: string, projectName: string): StaffingPlan => {
  const startDate = new Date()
  const endDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year from now
  
  const sampleActivities: StaffingPlanActivity[] = [
    {
      id: 'activity-1',
      name: 'Project Setup & Planning',
      startDate: startDate,
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      color: '#3B82F6',
      description: 'Initial project setup and detailed planning phase'
    },
    {
      id: 'activity-2',
      name: 'Design Development',
      startDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      color: '#10B981',
      description: 'Architectural and engineering design development'
    },
    {
      id: 'activity-3',
      name: 'Permit Applications',
      startDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
      color: '#F59E0B',
      description: 'Submit and track permit applications'
    },
    {
      id: 'activity-4',
      name: 'Procurement & Buyout',
      startDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
      color: '#EF4444',
      description: 'Material procurement and subcontractor buyout'
    }
  ]

  const months = generatePlanningMonths(startDate, endDate)
  
  const sampleAllocations: StaffingAllocation[] = [
    {
      roleId: 'project-manager',
      roleName: 'Project Manager',
      monthlyAllocations: months.reduce((acc, month, index) => {
        const monthKey = `${month.year}-${month.month.toString().padStart(2, '0')}`
        acc[monthKey] = index < 6 ? 1 : 0.5 // Full time first 6 months, part time after
        return acc
      }, {} as { [monthKey: string]: number })
    },
    {
      roleId: 'project-engineer',
      roleName: 'Project Engineer',
      monthlyAllocations: months.reduce((acc, month, index) => {
        const monthKey = `${month.year}-${month.month.toString().padStart(2, '0')}`
        acc[monthKey] = index >= 1 && index <= 8 ? 1 : 0 // Active months 2-9
        return acc
      }, {} as { [monthKey: string]: number })
    },
    {
      roleId: 'estimator',
      roleName: 'Estimator',
      monthlyAllocations: months.reduce((acc, month, index) => {
        const monthKey = `${month.year}-${month.month.toString().padStart(2, '0')}`
        acc[monthKey] = index <= 3 ? 1 : 0 // First 4 months
        return acc
      }, {} as { [monthKey: string]: number })
    }
  ]

  return {
    id: `plan-${Date.now()}`,
    projectId,
    projectName,
    name: 'Preconstruction Staffing Plan',
    description: 'Sample staffing plan for preconstruction activities',
    startDate,
    endDate,
    activities: sampleActivities,
    allocations: sampleAllocations,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'System',
    status: 'draft'
  }
}

/**
 * Validate staffing plan data
 */
export const validateStaffingPlan = (plan: Partial<StaffingPlan>): { valid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (!plan.name || plan.name.trim().length === 0) {
    errors.push('Plan name is required')
  }

  if (!plan.startDate || !plan.endDate) {
    errors.push('Start and end dates are required')
  }

  if (plan.startDate && plan.endDate && plan.startDate >= plan.endDate) {
    errors.push('End date must be after start date')
  }

  if (!plan.activities || plan.activities.length === 0) {
    errors.push('At least one activity is required')
  }

  if (plan.activities) {
    plan.activities.forEach((activity, index) => {
      if (!activity.name || activity.name.trim().length === 0) {
        errors.push(`Activity ${index + 1} name is required`)
      }
      if (activity.startDate >= activity.endDate) {
        errors.push(`Activity "${activity.name}" end date must be after start date`)
      }
    })
  }

  // Validate allocations have non-negative values
  if (plan.allocations) {
    plan.allocations.forEach(allocation => {
      Object.values(allocation.monthlyAllocations).forEach(value => {
        if (value < 0) {
          errors.push(`Allocation values must be non-negative for role "${allocation.roleName}"`)
        }
      })
    })
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Calculate staffing plan statistics
 */
export const calculatePlanStatistics = (plan: StaffingPlan) => {
  const totalActivities = plan.activities.length
  const totalDuration = differenceInDays(plan.endDate, plan.startDate)
  
  const totalFTE = plan.allocations.reduce((sum, allocation) => 
    sum + Object.values(allocation.monthlyAllocations).reduce((a, b) => a + b, 0), 0
  )
  
  const months = generatePlanningMonths(plan.startDate, plan.endDate)
  const avgMonthlyFTE = months.length > 0 ? totalFTE / months.length : 0
  
  const monthlyTotals = months.map(month => {
    const monthKey = `${month.year}-${month.month.toString().padStart(2, '0')}`
    return plan.allocations.reduce((sum, allocation) => 
      sum + (allocation.monthlyAllocations[monthKey] || 0), 0
    )
  })
  
  const peakMonthFTE = Math.max(...monthlyTotals, 0)
  
  return {
    totalActivities,
    totalDuration,
    totalFTE,
    avgMonthlyFTE,
    peakMonthFTE,
    months: months.length,
    roles: plan.allocations.length
  }
}

/**
 * Export staffing plan to JSON format
 */
export const exportToJSON = (plan: StaffingPlan): string => {
  const exportData = {
    ...plan,
    exportTimestamp: new Date().toISOString(),
    statistics: calculatePlanStatistics(plan)
  }
  
  return JSON.stringify(exportData, null, 2)
}

/**
 * Generate CSV format for allocation matrix
 */
export const exportAllocationMatrixToCSV = (plan: StaffingPlan): string => {
  const months = generatePlanningMonths(plan.startDate, plan.endDate)
  const headers = ['Role', ...months.map(m => m.label), 'Total']
  
  const rows = plan.allocations.map(allocation => {
    const monthValues = months.map(month => {
      const monthKey = `${month.year}-${month.month.toString().padStart(2, '0')}`
      return allocation.monthlyAllocations[monthKey] || 0
    })
    const total = monthValues.reduce((sum, val) => sum + val, 0)
    return [allocation.roleName, ...monthValues, total]
  })
  
  // Add totals row
  const monthlyTotals = months.map((month, index) => 
    plan.allocations.reduce((sum, allocation) => {
      const monthKey = `${month.year}-${month.month.toString().padStart(2, '0')}`
      return sum + (allocation.monthlyAllocations[monthKey] || 0)
    }, 0)
  )
  const grandTotal = monthlyTotals.reduce((sum, val) => sum + val, 0)
  rows.push(['TOTAL', ...monthlyTotals, grandTotal])
  
  return [headers, ...rows].map(row => row.join(',')).join('\n')
}

/**
 * Convert activities to simple timeline format
 */
export const exportActivitiesToCSV = (activities: StaffingPlanActivity[]): string => {
  const headers = ['Activity Name', 'Start Date', 'End Date', 'Duration (Days)', 'Description']
  
  const rows = activities.map(activity => [
    activity.name,
    format(activity.startDate, 'yyyy-MM-dd'),
    format(activity.endDate, 'yyyy-MM-dd'),
    differenceInDays(activity.endDate, activity.startDate),
    activity.description || ''
  ])
  
  return [headers, ...rows].map(row => 
    row.map(cell => typeof cell === 'string' && cell.includes(',') ? `"${cell}"` : cell).join(',')
  ).join('\n')
} 
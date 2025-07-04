import { 
  generatePlanningMonths, 
  generateSampleStaffingPlan, 
  validateStaffingPlan, 
  calculatePlanStatistics,
  exportToJSON,
  exportAllocationMatrixToCSV,
  exportActivitiesToCSV
} from '@/lib/staffing-plan-utils'
import type { StaffingPlan, StaffingPlanActivity } from '@/types/staff-planning'

describe('Staffing Plan Utilities', () => {
  describe('generatePlanningMonths', () => {
    it('should generate correct months between dates', () => {
      const startDate = new Date('2024-01-01')
      const endDate = new Date('2024-03-31')
      
      const months = generatePlanningMonths(startDate, endDate)
      
      expect(months).toHaveLength(3)
      expect(months[0].label).toBe('Jan 2024')
      expect(months[1].label).toBe('Feb 2024')
      expect(months[2].label).toBe('Mar 2024')
    })

    it('should handle single month range', () => {
      const startDate = new Date('2024-01-15')
      const endDate = new Date('2024-01-25')
      
      const months = generatePlanningMonths(startDate, endDate)
      
      expect(months).toHaveLength(1)
      expect(months[0].label).toBe('Jan 2024')
    })
  })

  describe('generateSampleStaffingPlan', () => {
    it('should create a valid sample plan', () => {
      const plan = generateSampleStaffingPlan('123', 'Test Project')
      
      expect(plan.projectId).toBe('123')
      expect(plan.projectName).toBe('Test Project')
      expect(plan.activities).toHaveLength(4)
      expect(plan.allocations).toHaveLength(3)
      expect(plan.status).toBe('draft')
    })

    it('should have valid activity dates', () => {
      const plan = generateSampleStaffingPlan('123', 'Test Project')
      
      plan.activities.forEach(activity => {
        expect(activity.startDate).toBeInstanceOf(Date)
        expect(activity.endDate).toBeInstanceOf(Date)
        expect(activity.startDate < activity.endDate).toBe(true)
      })
    })
  })

  describe('validateStaffingPlan', () => {
    it('should validate a complete valid plan', () => {
      const validPlan = generateSampleStaffingPlan('123', 'Test Project')
      
      const result = validateStaffingPlan(validPlan)
      
      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should reject plan without name', () => {
      const invalidPlan: Partial<StaffingPlan> = {
        name: '',
        startDate: new Date(),
        endDate: new Date(Date.now() + 86400000),
        activities: [{
          id: '1',
          name: 'Test Activity',
          startDate: new Date(),
          endDate: new Date(Date.now() + 86400000)
        }]
      }
      
      const result = validateStaffingPlan(invalidPlan)
      
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Plan name is required')
    })

    it('should reject plan with end date before start date', () => {
      const invalidPlan: Partial<StaffingPlan> = {
        name: 'Test Plan',
        startDate: new Date(Date.now() + 86400000),
        endDate: new Date(),
        activities: []
      }
      
      const result = validateStaffingPlan(invalidPlan)
      
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('End date must be after start date')
    })

    it('should reject plan without activities', () => {
      const invalidPlan: Partial<StaffingPlan> = {
        name: 'Test Plan',
        startDate: new Date(),
        endDate: new Date(Date.now() + 86400000),
        activities: []
      }
      
      const result = validateStaffingPlan(invalidPlan)
      
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('At least one activity is required')
    })

    it('should reject activities with invalid dates', () => {
      const invalidPlan: Partial<StaffingPlan> = {
        name: 'Test Plan',
        startDate: new Date(),
        endDate: new Date(Date.now() + 86400000),
        activities: [{
          id: '1',
          name: 'Invalid Activity',
          startDate: new Date(Date.now() + 86400000),
          endDate: new Date() // End before start
        }]
      }
      
      const result = validateStaffingPlan(invalidPlan)
      
      expect(result.valid).toBe(false)
      expect(result.errors.some(error => error.includes('end date must be after start date'))).toBe(true)
    })
  })

  describe('calculatePlanStatistics', () => {
    it('should calculate correct statistics', () => {
      const plan = generateSampleStaffingPlan('123', 'Test Project')
      
      const stats = calculatePlanStatistics(plan)
      
      expect(stats.totalActivities).toBe(4)
      expect(stats.roles).toBe(3)
      expect(stats.totalFTE).toBeGreaterThan(0)
      expect(stats.avgMonthlyFTE).toBeGreaterThan(0)
      expect(stats.peakMonthFTE).toBeGreaterThanOrEqual(stats.avgMonthlyFTE)
      expect(stats.months).toBeGreaterThan(0)
    })

    it('should handle empty allocations', () => {
      const plan = generateSampleStaffingPlan('123', 'Test Project')
      plan.allocations = []
      
      const stats = calculatePlanStatistics(plan)
      
      expect(stats.totalFTE).toBe(0)
      expect(stats.avgMonthlyFTE).toBe(0)
      expect(stats.peakMonthFTE).toBe(0)
    })
  })

  describe('exportToJSON', () => {
    it('should export valid JSON', () => {
      const plan = generateSampleStaffingPlan('123', 'Test Project')
      
      const json = exportToJSON(plan)
      const parsed = JSON.parse(json)
      
      expect(parsed.name).toBe(plan.name)
      expect(parsed.projectId).toBe(plan.projectId)
      expect(parsed.exportTimestamp).toBeDefined()
      expect(parsed.statistics).toBeDefined()
    })
  })

  describe('exportAllocationMatrixToCSV', () => {
    it('should export valid CSV format', () => {
      const plan = generateSampleStaffingPlan('123', 'Test Project')
      
      const csv = exportAllocationMatrixToCSV(plan)
      const lines = csv.split('\n')
      
      expect(lines[0]).toContain('Role')
      expect(lines[0]).toContain('Total')
      expect(lines.length).toBeGreaterThan(1)
      expect(lines[lines.length - 1]).toContain('TOTAL') // Last line should be totals
    })
  })

  describe('exportActivitiesToCSV', () => {
    it('should export activities to CSV format', () => {
      const activities: StaffingPlanActivity[] = [
        {
          id: '1',
          name: 'Test Activity',
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-01-31'),
          description: 'Test description'
        }
      ]
      
      const csv = exportActivitiesToCSV(activities)
      const lines = csv.split('\n')
      
      expect(lines[0]).toContain('Activity Name')
      expect(lines[0]).toContain('Start Date')
      expect(lines[0]).toContain('End Date')
      expect(lines[1]).toContain('Test Activity')
      expect(lines[1]).toContain('2024-01-01')
      expect(lines[1]).toContain('2024-01-31')
    })

    it('should handle activities with commas in names', () => {
      const activities: StaffingPlanActivity[] = [
        {
          id: '1',
          name: 'Activity, with comma',
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-01-31')
        }
      ]
      
      const csv = exportActivitiesToCSV(activities)
      
      expect(csv).toContain('"Activity, with comma"')
    })
  })
}) 
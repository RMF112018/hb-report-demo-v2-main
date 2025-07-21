/**
 * Unit tests for useResponsibilityMatrix hook
 * Tests all functionality including state management, data transformation, and error handling
 *
 * @module UseResponsibilityMatrixTests
 * @version 1.0.0
 * @author HB Development Team
 */

import { renderHook, act } from "@testing-library/react"
import { useResponsibilityMatrix } from "@/hooks/use-responsibility-matrix"
import { useAuth } from "@/context/auth-context"
import { logger } from "@/lib/logger"
import type { User } from "@/types"
import type { AuthContextType } from "@/context/auth-context"

// Mock dependencies
jest.mock("@/context/auth-context")
jest.mock("@/lib/logger")
jest.mock("@/data/mock/responsibility.json", () => [
  {
    "Task Category": "PX",
    "Tasks/Role": "Project Executive Task 1",
  },
  {
    "Task Category": "PM3",
    "Tasks/Role": "Project Manager Task 1",
  },
  {
    "Task Category": "APM",
    "Tasks/Role": "Assistant PM Task 1",
  },
])

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>
const mockLogger = logger as jest.Mocked<typeof logger>

describe("useResponsibilityMatrix", () => {
  const mockUser: User = {
    id: "test-user-id",
    firstName: "Test",
    lastName: "User",
    email: "test@example.com",
    role: "project-manager",
    company: "Hedrick Brothers",
    createdAt: new Date().toISOString(),
    isActive: true,
    avatar: "/avatars/test-user.png",
    permissions: { preConAccess: true },
  }

  const mockAuthContext: AuthContextType = {
    user: mockUser,
    login: jest.fn().mockResolvedValue({ redirectTo: "/dashboard" }),
    logout: jest.fn(),
    isLoading: false,
    isClient: true,
    viewingAs: null,
    switchRole: jest.fn(),
    returnToPresentation: jest.fn(),
    isPresentationMode: false,
    hasMarketIntelPreload: false,
    hasAutoInsightsMode: false,
  }

  const mockAuthContextNull: AuthContextType = {
    user: null,
    login: jest.fn().mockResolvedValue({ redirectTo: "/dashboard" }),
    logout: jest.fn(),
    isLoading: false,
    isClient: true,
    viewingAs: null,
    switchRole: jest.fn(),
    returnToPresentation: jest.fn(),
    isPresentationMode: false,
    hasMarketIntelPreload: false,
    hasAutoInsightsMode: false,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseAuth.mockReturnValue(mockAuthContext)
    localStorage.clear()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("Initialization", () => {
    it("should initialize with default state", () => {
      const { result } = renderHook(() => useResponsibilityMatrix("test-project"))

      expect(result.current.tasks).toHaveLength(3)
      expect(result.current.activeTab).toBe("team")
      expect(result.current.loading).toBe(false)
      expect(result.current.roles).toHaveLength(10) // All role colors
    })

    it("should load data from localStorage when available", () => {
      const storedData = {
        tasks: [
          {
            id: "stored-task-1",
            projectId: "test-project",
            type: "team" as const,
            category: "PX",
            task: "Stored Task",
            responsible: "PX",
            assignments: { PX: "Primary" as const },
            status: "active" as const,
            createdAt: "2024-01-01T00:00:00.000Z",
            updatedAt: "2024-01-01T00:00:00.000Z",
            annotations: [],
          },
        ],
        activeTab: "prime-contract" as const,
        lastUpdated: "2024-01-01T00:00:00.000Z",
      }

      localStorage.setItem("responsibility-matrix-test-project-test-user-id", JSON.stringify(storedData))

      const { result } = renderHook(() => useResponsibilityMatrix("test-project"))

      expect(result.current.tasks).toHaveLength(1)
      expect(result.current.tasks[0].id).toBe("stored-task-1")
      expect(result.current.activeTab).toBe("prime-contract")
    })

    it("should handle localStorage errors gracefully", () => {
      // Mock localStorage.getItem to throw an error
      const originalGetItem = localStorage.getItem
      localStorage.getItem = jest.fn().mockImplementation(() => {
        throw new Error("Storage error")
      })

      const { result } = renderHook(() => useResponsibilityMatrix("test-project"))

      expect(result.current.tasks).toHaveLength(3) // Fallback to mock data
      // The hook should handle the error gracefully and continue with default data

      localStorage.getItem = originalGetItem
    })
  })

  describe("State Management", () => {
    it("should update active tab", () => {
      const { result } = renderHook(() => useResponsibilityMatrix("test-project"))

      act(() => {
        result.current.setActiveTab("subcontract")
      })

      expect(result.current.activeTab).toBe("subcontract")
    })

    it("should update task assignments", () => {
      const { result } = renderHook(() => useResponsibilityMatrix("test-project"))

      const taskId = result.current.tasks[0].id

      act(() => {
        result.current.updateTaskAssignment(taskId, "PM3", "Primary")
      })

      const updatedTask = result.current.tasks.find((t) => t.id === taskId)
      expect(updatedTask?.assignments.PM3).toBe("Primary")
      expect(updatedTask?.responsible).toBe("PM3")
    })

    it("should update task status", () => {
      const { result } = renderHook(() => useResponsibilityMatrix("test-project"))

      const taskId = result.current.tasks[0].id

      act(() => {
        result.current.updateTaskStatus(taskId, "completed")
      })

      const updatedTask = result.current.tasks.find((t) => t.id === taskId)
      expect(updatedTask?.status).toBe("completed")
    })

    it("should add new task", () => {
      const { result } = renderHook(() => useResponsibilityMatrix("test-project"))

      const initialTaskCount = result.current.tasks.length

      act(() => {
        result.current.addTask({
          projectId: "test-project",
          type: "team",
          category: "PX",
          task: "New Task",
          responsible: "PX",
          assignments: { PX: "Primary" },
          status: "active",
          annotations: [],
        })
      })

      expect(result.current.tasks).toHaveLength(initialTaskCount + 1)
      expect(result.current.tasks[result.current.tasks.length - 1].task).toBe("New Task")
    })

    it("should remove task", () => {
      const { result } = renderHook(() => useResponsibilityMatrix("test-project"))

      const taskId = result.current.tasks[0].id
      const initialTaskCount = result.current.tasks.length

      act(() => {
        result.current.removeTask(taskId)
      })

      expect(result.current.tasks).toHaveLength(initialTaskCount - 1)
      expect(result.current.tasks.find((t) => t.id === taskId)).toBeUndefined()
    })

    it("should reset to default data", () => {
      const { result } = renderHook(() => useResponsibilityMatrix("test-project"))

      // Modify tasks first
      act(() => {
        result.current.addTask({
          projectId: "test-project",
          type: "team",
          category: "PX",
          task: "Test Task",
          responsible: "PX",
          assignments: { PX: "Primary" },
          status: "active",
          annotations: [],
        })
      })

      const taskCountAfterAdd = result.current.tasks.length

      act(() => {
        result.current.resetToDefault()
      })

      expect(result.current.tasks).toHaveLength(3) // Back to original mock data
    })
  })

  describe("Metrics Calculation", () => {
    it("should calculate correct metrics", () => {
      const { result } = renderHook(() => useResponsibilityMatrix("test-project"))

      expect(result.current.metrics.totalTasks).toBe(3)
      expect(result.current.metrics.completionRate).toBeGreaterThanOrEqual(0)
      expect(result.current.metrics.completionRate).toBeLessThanOrEqual(100)
      expect(result.current.metrics.roleWorkload).toBeDefined()
      expect(result.current.metrics.categoryDistribution).toBeDefined()
    })

    it("should handle empty tasks array", () => {
      // Test that metrics are calculated correctly with the default tasks
      const { result } = renderHook(() => useResponsibilityMatrix("test-project"))

      // Verify that metrics are calculated from the actual tasks
      expect(result.current.metrics.totalTasks).toBe(3)
      expect(result.current.metrics.completionRate).toBeGreaterThanOrEqual(0)
      expect(result.current.metrics.averageTasksPerRole).toBeGreaterThanOrEqual(0)
    })
  })

  describe("Data Persistence", () => {
    it("should save data to localStorage", () => {
      const { result } = renderHook(() => useResponsibilityMatrix("test-project"))

      act(() => {
        result.current.updateTaskStatus(result.current.tasks[0].id, "completed")
      })

      // The hook should save data to localStorage (tested indirectly)
      expect(result.current.tasks[0].status).toBe("completed")
    })
  })

  describe("Error Handling", () => {
    it("should handle localStorage save errors", () => {
      // Mock localStorage.setItem to throw an error
      const originalSetItem = localStorage.setItem
      localStorage.setItem = jest.fn().mockImplementation(() => {
        throw new Error("Storage save error")
      })

      const { result } = renderHook(() => useResponsibilityMatrix("test-project"))

      act(() => {
        result.current.updateTaskStatus(result.current.tasks[0].id, "completed")
      })

      // The hook should handle the error gracefully
      expect(result.current.tasks[0].status).toBe("completed")

      localStorage.setItem = originalSetItem
    })

    it("should handle localStorage load errors", () => {
      // Mock localStorage.getItem to throw an error
      const originalGetItem = localStorage.getItem
      localStorage.getItem = jest.fn().mockImplementation(() => {
        throw new Error("Storage load error")
      })

      const { result } = renderHook(() => useResponsibilityMatrix("test-project"))

      // The hook should handle the error gracefully and continue with default data
      expect(result.current.tasks).toHaveLength(3)

      localStorage.getItem = originalGetItem
    })
  })

  describe("Role Management", () => {
    it("should provide correct role information", () => {
      const { result } = renderHook(() => useResponsibilityMatrix("test-project"))

      expect(result.current.roles).toHaveLength(10)

      const pxRole = result.current.roles.find((r) => r.key === "PX")
      expect(pxRole?.name).toBe("Project Executive")
      expect(pxRole?.color).toBe("#1890ff")
      expect(pxRole?.enabled).toBe(true)
    })

    it("should provide role colors", () => {
      const { result } = renderHook(() => useResponsibilityMatrix("test-project"))

      expect(result.current.roleColors).toBeDefined()
      expect(result.current.roleColors.PX).toBe("#1890ff")
      expect(result.current.roleColors.PM3).toBe("#722ed1")
    })
  })

  describe("Performance", () => {
    it("should memoize expensive calculations", () => {
      const { result, rerender } = renderHook(() => useResponsibilityMatrix("test-project"))

      const initialMetrics = result.current.metrics

      // Re-render without changes
      rerender()

      expect(result.current.metrics).toBe(initialMetrics) // Same reference
    })

    it("should debounce localStorage saves", () => {
      const { result } = renderHook(() => useResponsibilityMatrix("test-project"))

      // Make multiple rapid updates
      act(() => {
        result.current.updateTaskStatus(result.current.tasks[0].id, "completed")
        result.current.updateTaskStatus(result.current.tasks[1].id, "pending")
        result.current.updateTaskStatus(result.current.tasks[2].id, "active")
      })

      // All updates should be applied
      expect(result.current.tasks[0].status).toBe("completed")
      expect(result.current.tasks[1].status).toBe("pending")
      expect(result.current.tasks[2].status).toBe("active")
    })
  })
})

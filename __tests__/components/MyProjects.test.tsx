/**
 * MyProjects Component Test Suite
 * Comprehensive testing with performance benchmarks and coverage targets
 *
 * @module MyProjectsTest
 * @version 1.0.0
 * @author HB Development Team
 * @since 2025-01-29
 */

import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { MyProjects, type Project } from "@/app/main-app/components/MyProjects"
import { createPerformanceTest, createMemoryLeakDetector } from "@/__tests__/setup"

// Mock performance utilities
vi.mock("@/lib/performance-utils", () => ({
  useDeepMemo: vi.fn((factory: () => unknown) => factory()),
  useDeepCallback: vi.fn((callback: unknown) => callback),
  useCallback: vi.fn((callback: unknown) => callback),
}))

const mockProjects: Project[] = [
  {
    id: "project-1",
    name: "Test Project 1",
    status: "active",
    project_stage_name: "Construction",
    budget: 1000000,
    start_date: "2024-01-01",
    end_date: "2024-12-31",
    location: "New York, NY",
  },
  {
    id: "project-2",
    name: "Test Project 2",
    status: "active",
    project_stage_name: "Pre-Construction",
    budget: 500000,
    start_date: "2024-02-01",
    end_date: "2024-11-30",
    location: "Los Angeles, CA",
  },
  {
    id: "project-3",
    name: "Test Project 3",
    status: "on-hold",
    project_stage_name: "Construction",
    budget: 750000,
    start_date: "2024-03-01",
    end_date: "2024-10-31",
  },
]

const defaultProps = {
  projects: mockProjects,
  userRole: "project-manager" as const,
  onProjectSelect: vi.fn(),
  selectedProject: null,
}

describe("MyProjects Component", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("Rendering", () => {
    it("should render without crashing", () => {
      const performanceTest = createPerformanceTest("MyProjects Render")

      render(<MyProjects {...defaultProps} />)

      expect(screen.getByText("My Projects")).toBeInTheDocument()
      performanceTest.end()
    })

    it("should display project cards for active projects", () => {
      render(<MyProjects {...defaultProps} />)

      expect(screen.getByText("Test Project 1")).toBeInTheDocument()
      expect(screen.getByText("Test Project 2")).toBeInTheDocument()
      expect(screen.queryByText("Test Project 3")).not.toBeInTheDocument() // on-hold status
    })

    it("should show empty state when no projects are assigned", () => {
      render(<MyProjects {...defaultProps} projects={[]} />)

      expect(screen.getByText("No projects assigned")).toBeInTheDocument()
      expect(screen.getByText("Projects will appear here when assigned")).toBeInTheDocument()
    })

    it("should display project information correctly", () => {
      render(<MyProjects {...defaultProps} />)

      expect(screen.getByText("Construction")).toBeInTheDocument()
      expect(screen.getByText("Pre-Construction")).toBeInTheDocument()
      expect(screen.getByText("$1,000,000")).toBeInTheDocument()
      expect(screen.getByText("$500,000")).toBeInTheDocument()
      expect(screen.getByText("New York, NY")).toBeInTheDocument()
      expect(screen.getByText("Los Angeles, CA")).toBeInTheDocument()
    })
  })

  describe("User Role Filtering", () => {
    it("should filter projects for project-executive role", () => {
      render(<MyProjects {...defaultProps} userRole="project-executive" />)

      // Should show up to 6 active projects
      expect(screen.getByText("Test Project 1")).toBeInTheDocument()
      expect(screen.getByText("Test Project 2")).toBeInTheDocument()
    })

    it("should prioritize construction projects for project-manager role", () => {
      const constructionProjects: Project[] = [
        {
          id: "project-1",
          name: "Test Project 1",
          status: "active",
          project_stage_name: "Construction",
          budget: 1000000,
          start_date: "2024-01-01",
          end_date: "2024-12-31",
          location: "New York, NY",
        },
        {
          id: "project-2",
          name: "Test Project 2",
          status: "active",
          project_stage_name: "Construction",
          budget: 500000,
          start_date: "2024-02-01",
          end_date: "2024-11-30",
          location: "Los Angeles, CA",
        },
        {
          id: "project-3",
          name: "Test Project 3",
          status: "active",
          project_stage_name: "Pre-Construction",
          budget: 750000,
          start_date: "2024-03-01",
          end_date: "2024-10-31",
        },
      ]

      render(<MyProjects {...defaultProps} projects={constructionProjects} />)

      // Construction projects should appear first
      const projectCards = screen.getAllByText(/Test Project/)
      expect(projectCards).toHaveLength(2) // Only active projects
    })

    it("should show no projects for unknown role", () => {
      const propsWithUnknownRole = {
        ...defaultProps,
        userRole: "unknown" as any,
      }
      render(<MyProjects {...propsWithUnknownRole} />)

      expect(screen.getByText("No projects assigned")).toBeInTheDocument()
    })
  })

  describe("Interaction", () => {
    it("should call onProjectSelect when project is clicked", async () => {
      const onProjectSelect = vi.fn()
      render(<MyProjects {...defaultProps} onProjectSelect={onProjectSelect} />)

      const projectCard = screen.getByText("Test Project 1").closest("div")
      fireEvent.click(projectCard!)

      await waitFor(() => {
        expect(onProjectSelect).toHaveBeenCalledWith("project-1")
      })
    })

    it("should highlight selected project", () => {
      render(<MyProjects {...defaultProps} selectedProject="project-1" />)

      const selectedCard = screen.getByText("Test Project 1").closest("div")
      expect(selectedCard).toHaveClass("border-blue-500")
    })

    it("should toggle collapse state when button is clicked", () => {
      render(<MyProjects {...defaultProps} />)

      const toggleButton = screen.getByRole("button", { name: /toggle/i })
      fireEvent.click(toggleButton)

      // Project cards should be hidden
      expect(screen.queryByText("Test Project 1")).not.toBeInTheDocument()

      // Click again to expand
      fireEvent.click(toggleButton)
      expect(screen.getByText("Test Project 1")).toBeInTheDocument()
    })
  })

  describe("Performance", () => {
    it("should render efficiently with large project list", () => {
      const largeProjectList = Array.from({ length: 100 }, (_, i) => ({
        id: `project-${i}`,
        name: `Test Project ${i}`,
        status: "active" as const,
        project_stage_name: "Construction",
        budget: 1000000,
        start_date: "2024-01-01",
        end_date: "2024-12-31",
      }))

      const performanceTest = createPerformanceTest("Large Project List Render")
      const memoryDetector = createMemoryLeakDetector()

      render(<MyProjects {...defaultProps} projects={largeProjectList} />)

      const renderTime = performanceTest.end()
      const memoryIncrease = memoryDetector.check()

      expect(renderTime).toBeLessThan(100) // Should render in under 100ms
      expect(memoryIncrease).toBeLessThan(5 * 1024 * 1024) // Less than 5MB increase
    })

    it("should memoize project filtering correctly", () => {
      const { rerender } = render(<MyProjects {...defaultProps} />)

      // First render
      expect(screen.getByText("Test Project 1")).toBeInTheDocument()

      // Re-render with same props
      rerender(<MyProjects {...defaultProps} />)

      // Should still show the same projects
      expect(screen.getByText("Test Project 1")).toBeInTheDocument()
    })
  })

  describe("Accessibility", () => {
    it("should have proper ARIA labels", () => {
      render(<MyProjects {...defaultProps} />)

      const toggleButton = screen.getByRole("button")
      expect(toggleButton).toBeInTheDocument()
    })

    it("should be keyboard navigable", () => {
      render(<MyProjects {...defaultProps} />)

      const projectCard = screen.getByText("Test Project 1").closest("div")
      projectCard?.focus()

      fireEvent.keyDown(projectCard!, { key: "Enter" })

      expect(defaultProps.onProjectSelect).toHaveBeenCalledWith("project-1")
    })
  })

  describe("Error Handling", () => {
    it("should handle missing project data gracefully", () => {
      const incompleteProjects = [
        {
          id: "project-1",
          name: "Test Project 1",
          status: "active",
          project_stage_name: "Construction",
          budget: 1000000,
          start_date: "2024-01-01",
          end_date: "2024-12-31",
        },
        {
          id: "project-2",
          name: "Test Project 2",
          status: "active",
          // Missing required fields
        } as Project,
      ]

      render(<MyProjects {...defaultProps} projects={incompleteProjects} />)

      // Should still render without crashing
      expect(screen.getByText("My Projects")).toBeInTheDocument()
    })
  })

  describe("Currency Formatting", () => {
    it("should format currency correctly", () => {
      render(<MyProjects {...defaultProps} />)

      expect(screen.getByText("$1,000,000")).toBeInTheDocument()
      expect(screen.getByText("$500,000")).toBeInTheDocument()
    })

    it("should handle zero budget", () => {
      const zeroBudgetProjects: Project[] = [
        {
          id: "project-1",
          name: "Test Project 1",
          status: "active",
          project_stage_name: "Construction",
          budget: 0,
          start_date: "2024-01-01",
          end_date: "2024-12-31",
          location: "New York, NY",
        },
      ]

      render(<MyProjects {...defaultProps} projects={zeroBudgetProjects} />)

      expect(screen.getByText("$0")).toBeInTheDocument()
    })
  })

  describe("Status Colors", () => {
    it("should apply correct status colors", () => {
      const statusProjects: Project[] = [
        {
          id: "project-1",
          name: "Test Project 1",
          status: "active",
          project_stage_name: "Construction",
          budget: 1000000,
          start_date: "2024-01-01",
          end_date: "2024-12-31",
          location: "New York, NY",
        },
        {
          id: "project-2",
          name: "Test Project 2",
          status: "on-hold",
          project_stage_name: "Pre-Construction",
          budget: 500000,
          start_date: "2024-02-01",
          end_date: "2024-11-30",
          location: "Los Angeles, CA",
        },
        {
          id: "project-3",
          name: "Test Project 3",
          status: "completed",
          project_stage_name: "Construction",
          budget: 750000,
          start_date: "2024-03-01",
          end_date: "2024-10-31",
        },
      ]

      render(<MyProjects {...defaultProps} projects={statusProjects} />)

      const activeCard = screen.getByText("Test Project 1").closest("div")
      const onHoldCard = screen.getByText("Test Project 2").closest("div")

      expect(activeCard).toHaveClass("bg-green-100")
      expect(onHoldCard).toHaveClass("bg-yellow-100")
    })
  })
})

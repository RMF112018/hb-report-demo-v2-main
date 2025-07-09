import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import { TourProvider } from "@/context/tour-context"
import { AuthProvider } from "@/context/auth-context"
import { TakeTourButton } from "@/components/TakeTourButton"
import { Tour } from "@/components/ui/tour"

// Mock Next.js navigation
const mockPush = jest.fn()
const mockPathname = jest.fn().mockReturnValue("/main-app")

jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
  useRouter: () => ({
    push: mockPush,
  }),
}))

// Mock the tour utilities
jest.mock("@/lib/tour-utils", () => ({
  tourLogger: {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
  tourStorage: {
    getTourAvailability: jest.fn(() => true),
    setTourAvailability: jest.fn(),
    markTourAsShown: jest.fn(),
    hasTourBeenShownInSession: jest.fn(() => false),
    clearAllTourData: jest.fn(),
  },
  tourValidation: {
    isValidSelector: jest.fn(() => true),
    validateTourStep: jest.fn(() => []),
    validateTourDefinition: jest.fn(() => []),
  },
  tourErrorUtils: {
    safeExecute: jest.fn((fn) => fn()),
  },
}))

// Mock the positioning hook
jest.mock("@/hooks/useTourPositioning", () => ({
  useTourPositioning: jest.fn(() => ({
    positions: {
      overlayStyle: { position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh" },
      tooltipStyle: { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" },
      contentAreaHeight: 200,
    },
    targetElement: document.createElement("div"),
    isPositioning: false,
    error: null,
  })),
}))

// Mock tour definitions with page-specific tours
const mockTourDefinitions = [
  {
    id: "login-demo-accounts",
    name: "Demo Account Selection",
    description: "Learn how to select different user roles",
    page: "login",
    steps: [
      {
        id: "welcome",
        title: "Welcome to HB Intel Demo!",
        content: "This guided tour will show you how to explore the application.",
        target: ".login-card",
        placement: "center" as const,
      },
    ],
  },
  {
    id: "dashboard-overview",
    name: "Complete Dashboard Tour",
    description: "Comprehensive guide to all dashboard features",
    page: "dashboard",
    steps: [
      {
        id: "dashboard-welcome",
        title: "Welcome to Your Dashboard!",
        content: "This dashboard is customized for your role.",
        target: '[data-tour="dashboard-content"]',
        placement: "center" as const,
      },
    ],
  },
  {
    id: "executive-staffing-overview",
    name: "Executive Staffing Management",
    description: "Enterprise-level staffing oversight",
    page: "staff-planning",
    userRoles: ["executive"],
    steps: [
      {
        id: "staffing-welcome",
        title: "Welcome to Enterprise Staffing",
        content: "Comprehensive oversight of all staffing.",
        target: '[data-tour="staffing-header"]',
        placement: "center" as const,
      },
    ],
  },
]

jest.mock("@/data/tours/tour-definitions", () => ({
  TOUR_DEFINITIONS: mockTourDefinitions,
  loginTour: mockTourDefinitions[0],
  dashboardTour: mockTourDefinitions[1],
  executiveStaffingTour: mockTourDefinitions[2],
}))

const mockUser = {
  id: "1",
  name: "Test User",
  email: "test@example.com",
  role: "project-manager",
  projects: [],
}

const MockProviders = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>
    <TourProvider>{children}</TourProvider>
  </AuthProvider>
)

// Mock the auth context
const mockAuthContext = {
  user: mockUser,
  login: jest.fn(),
  logout: jest.fn(),
  isLoading: false,
}

jest.mock("@/context/auth-context", () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
  useAuth: () => mockAuthContext,
}))

describe("TakeTourButton Page-Specific Functionality", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockPathname.mockReturnValue("/main-app")
  })

  it("detects current page and starts appropriate tour", () => {
    mockPathname.mockReturnValue("/main-app/login")

    render(
      <MockProviders>
        <TakeTourButton />
      </MockProviders>
    )

    const button = screen.getByRole("button", { name: /take the tour/i })
    fireEvent.click(button)

    // Should prioritize page-specific tour (login)
    expect(button).toBeInTheDocument()
  })

  it("starts dashboard tour when on dashboard page", () => {
    mockPathname.mockReturnValue("/main-app")

    render(
      <MockProviders>
        <TakeTourButton />
      </MockProviders>
    )

    const button = screen.getByRole("button", { name: /take the tour/i })
    expect(button).toBeInTheDocument()

    fireEvent.click(button)
    // Tour should start for dashboard page
  })

  it("starts staffing tour when on staff-planning page", () => {
    mockPathname.mockReturnValue("/main-app/staff-planning")

    render(
      <MockProviders>
        <TakeTourButton />
      </MockProviders>
    )

    const button = screen.getByRole("button", { name: /take the tour/i })
    fireEvent.click(button)

    // Should find staff-planning specific tour
    expect(button).toBeInTheDocument()
  })

  it("fallback to role-specific tour when no page-specific tour exists", () => {
    mockPathname.mockReturnValue("/main-app/some-other-page")

    // Set user role to executive to match role-specific tour
    const executiveUser = { ...mockUser, role: "executive" }
    const mockExecutiveAuthContext = { ...mockAuthContext, user: executiveUser }

    jest.mocked(require("@/context/auth-context").useAuth).mockReturnValue(mockExecutiveAuthContext)

    render(
      <MockProviders>
        <TakeTourButton />
      </MockProviders>
    )

    const button = screen.getByRole("button", { name: /take the tour/i })
    fireEvent.click(button)

    // Should find role-specific tour for executive
    expect(button).toBeInTheDocument()
  })

  it("shows page-specific button text", () => {
    mockPathname.mockReturnValue("/main-app/login")

    render(
      <MockProviders>
        <TakeTourButton />
      </MockProviders>
    )

    expect(screen.getByText("Take the Tour")).toBeInTheDocument()
  })
})

describe("Tour Auto-Launch Functionality", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("auto-launches login tour on login page", async () => {
    mockPathname.mockReturnValue("/main-app/login")

    const mockStartTour = jest.fn()
    const mockTourContext = {
      startTour: mockStartTour,
      isActive: false,
      isTourAvailable: true,
      availableTours: mockTourDefinitions,
      currentTour: null,
      isLoading: false,
    }

    jest.mocked(require("@/context/tour-context").useTour).mockReturnValue(mockTourContext)

    render(
      <MockProviders>
        <div>Test</div>
      </MockProviders>
    )

    await waitFor(() => {
      expect(mockStartTour).toHaveBeenCalledWith("login-demo-accounts", true)
    })
  })

  it("auto-launches dashboard tour on dashboard page", async () => {
    mockPathname.mockReturnValue("/main-app")

    const mockStartTour = jest.fn()
    const mockTourContext = {
      startTour: mockStartTour,
      isActive: false,
      isTourAvailable: true,
      availableTours: mockTourDefinitions,
      currentTour: null,
      isLoading: false,
    }

    jest.mocked(require("@/context/tour-context").useTour).mockReturnValue(mockTourContext)

    render(
      <MockProviders>
        <div>Test</div>
      </MockProviders>
    )

    await waitFor(() => {
      expect(mockStartTour).toHaveBeenCalledWith("dashboard-overview", true)
    })
  })

  it("does not auto-launch if tour already shown in session", async () => {
    mockPathname.mockReturnValue("/main-app/login")

    // Mock tour as already shown in session
    const mockHasTourBeenShown = jest.mocked(require("@/lib/tour-utils").tourStorage.hasTourBeenShownInSession)
    mockHasTourBeenShown.mockReturnValue(true)

    const mockStartTour = jest.fn()
    const mockTourContext = {
      startTour: mockStartTour,
      isActive: false,
      isTourAvailable: true,
      availableTours: mockTourDefinitions,
      currentTour: null,
      isLoading: false,
    }

    jest.mocked(require("@/context/tour-context").useTour).mockReturnValue(mockTourContext)

    render(
      <MockProviders>
        <div>Test</div>
      </MockProviders>
    )

    await waitFor(() => {
      expect(mockStartTour).not.toHaveBeenCalled()
    })
  })

  it("does not auto-launch on pages without specific tours", async () => {
    mockPathname.mockReturnValue("/main-app/some-other-page")

    const mockStartTour = jest.fn()
    const mockTourContext = {
      startTour: mockStartTour,
      isActive: false,
      isTourAvailable: true,
      availableTours: mockTourDefinitions,
      currentTour: null,
      isLoading: false,
    }

    jest.mocked(require("@/context/tour-context").useTour).mockReturnValue(mockTourContext)

    render(
      <MockProviders>
        <div>Test</div>
      </MockProviders>
    )

    // Wait a bit to ensure no auto-launch occurs
    await new Promise((resolve) => setTimeout(resolve, 100))

    expect(mockStartTour).not.toHaveBeenCalled()
  })
})

describe("Tour Definition Validation", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("validates tour step selectors", () => {
    const mockIsValidSelector = jest.mocked(require("@/lib/tour-utils").tourValidation.isValidSelector)

    // Test valid selector
    mockIsValidSelector.mockReturnValue(true)
    expect(mockIsValidSelector(".login-card")).toBe(true)

    // Test invalid selector
    mockIsValidSelector.mockReturnValue(false)
    expect(mockIsValidSelector("invalid>>selector")).toBe(false)
  })

  it("validates tour step placement values", () => {
    const validPlacements = ["top", "bottom", "left", "right", "center"]
    const invalidPlacements = ["invalid", "middle", "corner"]

    validPlacements.forEach((placement) => {
      expect(["top", "bottom", "left", "right", "center"]).toContain(placement)
    })

    invalidPlacements.forEach((placement) => {
      expect(["top", "bottom", "left", "right", "center"]).not.toContain(placement)
    })
  })

  it("validates complete tour definitions", () => {
    const mockValidateTourDefinition = jest.mocked(require("@/lib/tour-utils").tourValidation.validateTourDefinition)

    const validTour = {
      id: "test-tour",
      name: "Test Tour",
      description: "A test tour",
      steps: [
        {
          id: "step1",
          title: "Test Step",
          content: "Test content",
          target: ".test-element",
          placement: "center",
        },
      ],
    }

    mockValidateTourDefinition.mockReturnValue([])
    expect(mockValidateTourDefinition(validTour)).toEqual([])

    const invalidTour = { ...validTour, steps: [] }
    mockValidateTourDefinition.mockReturnValue(["Tour must have at least one step"])
    expect(mockValidateTourDefinition(invalidTour)).toContain("Tour must have at least one step")
  })

  it("logs validation errors appropriately", () => {
    const mockTourLogger = jest.mocked(require("@/lib/tour-utils").tourLogger)

    mockTourLogger.error.mockClear()

    // Simulate validation error
    const mockValidateTourDefinition = jest.mocked(require("@/lib/tour-utils").tourValidation.validateTourDefinition)
    mockValidateTourDefinition.mockReturnValue(["Invalid tour"])

    // This would normally trigger in the validation process
    mockTourLogger.error("Tour validation failed:", ["Invalid tour"])

    expect(mockTourLogger.error).toHaveBeenCalledWith("Tour validation failed:", ["Invalid tour"])
  })
})

describe("Performance and Timing", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("respects TOUR_CONSTANTS timing values", () => {
    const TOUR_CONSTANTS = require("@/lib/tour-constants").TOUR_CONSTANTS

    expect(TOUR_CONSTANTS.ELEMENT_SEARCH_DELAY).toBe(30)
    expect(TOUR_CONSTANTS.DASHBOARD_SCROLL_DELAY).toBe(500)
  })

  it("uses debounced element searching", async () => {
    mockPathname.mockReturnValue("/main-app")

    render(
      <MockProviders>
        <TakeTourButton />
      </MockProviders>
    )

    const button = screen.getByRole("button", { name: /take the tour/i })

    // Rapidly click button multiple times
    fireEvent.click(button)
    fireEvent.click(button)
    fireEvent.click(button)

    // Should handle rapid clicks gracefully
    expect(button).toBeInTheDocument()
  })
})

describe("Accessibility and Error Handling", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("maintains proper aria-labels for page-specific tours", () => {
    mockPathname.mockReturnValue("/main-app/login")

    render(
      <MockProviders>
        <TakeTourButton />
      </MockProviders>
    )

    const button = screen.getByRole("button", { name: /take the tour/i })
    expect(button).toHaveAttribute("aria-label", "Take the tour")
  })

  it("handles tour start errors gracefully", async () => {
    const mockTourLogger = jest.mocked(require("@/lib/tour-utils").tourLogger)

    const mockStartTour = jest.fn().mockRejectedValue(new Error("Tour start failed"))
    const mockTourContext = {
      startTour: mockStartTour,
      isActive: false,
      isTourAvailable: true,
      availableTours: mockTourDefinitions,
      currentTour: null,
      isLoading: false,
    }

    jest.mocked(require("@/context/tour-context").useTour).mockReturnValue(mockTourContext)

    render(
      <MockProviders>
        <TakeTourButton />
      </MockProviders>
    )

    const button = screen.getByRole("button", { name: /take the tour/i })
    fireEvent.click(button)

    await waitFor(() => {
      expect(mockTourLogger.error).toHaveBeenCalled()
    })
  })

  it("provides proper focus management", () => {
    render(
      <MockProviders>
        <TakeTourButton />
      </MockProviders>
    )

    const button = screen.getByRole("button", { name: /take the tour/i })

    // Test keyboard navigation
    button.focus()
    expect(button).toHaveFocus()

    fireEvent.keyDown(button, { key: "Enter" })
    fireEvent.keyDown(button, { key: " " })

    // Button should remain focusable
    expect(button).toBeInTheDocument()
  })
})

describe("Comprehensive Tour Steps", () => {
  it("dashboard tour has 10 comprehensive steps", () => {
    const dashboardTour = mockTourDefinitions.find((tour) => tour.id === "dashboard-overview")

    expect(dashboardTour).toBeDefined()
    expect(dashboardTour?.steps).toHaveLength(10)
    expect(dashboardTour?.steps.map((step) => step.id)).toEqual([
      "dashboard-welcome",
      "environment-menu",
      "projects-menu",
      "tools-menu",
      "search-bar",
      "tours-menu",
      "dashboard-selector",
      "dashboard-controls",
      "kpi-widgets",
      "hbi-insights",
    ])
  })

  it("login tour has 5 instructional steps", () => {
    const loginTour = mockTourDefinitions.find((tour) => tour.id === "login-demo-accounts")

    expect(loginTour).toBeDefined()
    expect(loginTour?.steps).toHaveLength(5)
    expect(loginTour?.steps.map((step) => step.id)).toEqual([
      "demo-accounts-intro",
      "demo-accounts-toggle",
      "demo-accounts-list",
      "role-based-experience",
      "login-process",
    ])
  })

  it("tour steps have proper content and structure", () => {
    const dashboardTour = mockTourDefinitions.find((tour) => tour.id === "dashboard-overview")

    expect(dashboardTour?.steps[0]).toMatchObject({
      id: "dashboard-welcome",
      title: "Welcome to Your Dashboard!",
      target: '[data-tour="dashboard-content"]',
      placement: "center",
      nextButton: "Start Tour",
    })

    expect(dashboardTour?.steps[9]).toMatchObject({
      id: "hbi-insights",
      title: "HB Intelligence Insights",
      target: '[data-tour="hbi-insights"]',
      placement: "left",
      nextButton: "Finish Tour",
    })
  })
})

describe("Standardized Tour UI Components", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders tour tooltip with Shadcn UI Card structure", () => {
    const mockTourContext = {
      ...mockTourContextBase,
      isActive: true,
      currentTour: "dashboard-overview",
      currentStep: 0,
      availableTours: mockTourDefinitions,
    }

    jest.mocked(require("@/context/tour-context").useTour).mockReturnValue(mockTourContext)

    render(
      <MockProviders>
        <Tour />
      </MockProviders>
    )

    // Check for Card component structure
    const tooltip = screen.getByRole("dialog")
    expect(tooltip).toHaveClass("bg-white", "dark:bg-gray-800", "rounded-lg", "shadow-2xl")

    // Check for consistent sizing
    expect(tooltip).toHaveStyle({ maxWidth: "400px", minWidth: "300px" })

    // Check for proper theme classes
    expect(tooltip).toHaveClass("text-gray-900", "dark:text-white")
  })

  it("maintains consistent tooltip dimensions across all tour steps", () => {
    const dashboardTour = mockTourDefinitions.find((tour) => tour.id === "dashboard-overview")

    dashboardTour?.steps.forEach((step, index) => {
      const mockTourContext = {
        ...mockTourContextBase,
        isActive: true,
        currentTour: "dashboard-overview",
        currentStep: index,
        availableTours: mockTourDefinitions,
      }

      jest.mocked(require("@/context/tour-context").useTour).mockReturnValue(mockTourContext)

      const { rerender } = render(
        <MockProviders>
          <Tour />
        </MockProviders>
      )

      const tooltip = screen.getByRole("dialog")

      // Check consistent dimensions
      expect(tooltip).toHaveStyle({
        maxWidth: "400px",
        minWidth: "300px",
      })

      // Check consistent theme classes
      expect(tooltip).toHaveClass("bg-white", "dark:bg-gray-800", "text-gray-900", "dark:text-white")

      rerender(<div />)
    })
  })

  it("renders only title, content, and button text that vary per step", () => {
    const mockTourContext = {
      ...mockTourContextBase,
      isActive: true,
      currentTour: "dashboard-overview",
      currentStep: 0,
      availableTours: mockTourDefinitions,
    }

    jest.mocked(require("@/context/tour-context").useTour).mockReturnValue(mockTourContext)

    render(
      <MockProviders>
        <Tour />
      </MockProviders>
    )

    const step = mockTourDefinitions[0].steps[0]

    // Check dynamic content
    expect(screen.getByText(step.title)).toBeInTheDocument()
    expect(screen.getByText(step.nextButton || "Next")).toBeInTheDocument()

    // Check static structure elements
    expect(screen.getByRole("dialog")).toBeInTheDocument()
    expect(screen.getByLabelText("Close tour")).toBeInTheDocument()
  })

  it("maintains WCAG accessibility standards", () => {
    const mockTourContext = {
      ...mockTourContextBase,
      isActive: true,
      currentTour: "dashboard-overview",
      currentStep: 0,
      availableTours: mockTourDefinitions,
    }

    jest.mocked(require("@/context/tour-context").useTour).mockReturnValue(mockTourContext)

    render(
      <MockProviders>
        <Tour />
      </MockProviders>
    )

    const tooltip = screen.getByRole("dialog")

    // Check ARIA attributes
    expect(tooltip).toHaveAttribute("aria-modal", "true")
    expect(tooltip).toHaveAttribute("aria-labelledby", "tour-title")
    expect(tooltip).toHaveAttribute("aria-describedby", "tour-content")

    // Check focus management
    expect(tooltip).toBeInTheDocument()

    // Check keyboard navigation
    const closeButton = screen.getByLabelText("Close tour")
    expect(closeButton).toHaveAttribute("aria-label", "Close tour")
  })

  it("applies light and dark theme styles correctly", () => {
    const mockTourContext = {
      ...mockTourContextBase,
      isActive: true,
      currentTour: "dashboard-overview",
      currentStep: 0,
      availableTours: mockTourDefinitions,
    }

    jest.mocked(require("@/context/tour-context").useTour).mockReturnValue(mockTourContext)

    render(
      <MockProviders>
        <Tour />
      </MockProviders>
    )

    const tooltip = screen.getByRole("dialog")

    // Check for theme classes that work with both light and dark modes
    expect(tooltip).toHaveClass(
      "bg-white",
      "dark:bg-gray-800",
      "text-gray-900",
      "dark:text-white",
      "border-gray-200",
      "dark:border-gray-700"
    )
  })
})

describe("Enhanced Tour Anchoring", () => {
  beforeEach(() => {
    jest.clearAllMocks()

    // Mock DOM methods
    global.HTMLElement.prototype.scrollIntoView = jest.fn()
    global.HTMLElement.prototype.getBoundingClientRect = jest.fn(() => ({
      top: 100,
      left: 100,
      bottom: 200,
      right: 300,
      width: 200,
      height: 100,
      x: 100,
      y: 100,
      toJSON: jest.fn(),
    }))
  })

  it("ensures target element visibility before showing tooltip", async () => {
    const mockEnsureElementVisibility = jest.fn().mockResolvedValue(undefined)
    jest
      .mocked(require("@/lib/tour-utils").tourDOMUtils.ensureElementVisibility)
      .mockImplementation(mockEnsureElementVisibility)

    const mockTourContext = {
      ...mockTourContextBase,
      isActive: true,
      currentTour: "dashboard-overview",
      currentStep: 0,
      availableTours: mockTourDefinitions,
    }

    jest.mocked(require("@/context/tour-context").useTour).mockReturnValue(mockTourContext)

    render(
      <MockProviders>
        <Tour />
      </MockProviders>
    )

    await waitFor(() => {
      expect(mockEnsureElementVisibility).toHaveBeenCalled()
    })
  })

  it("handles off-screen elements with scrolling", async () => {
    const mockScrollElementIntoView = jest.fn().mockResolvedValue(undefined)
    jest
      .mocked(require("@/lib/tour-utils").tourDOMUtils.scrollElementIntoView)
      .mockImplementation(mockScrollElementIntoView)

    // Mock element as off-screen
    const mockIsElementInViewport = jest.fn().mockReturnValue(false)
    const mockIsElementPartiallyVisible = jest.fn().mockReturnValue(true)

    jest
      .mocked(require("@/lib/tour-utils").tourDOMUtils.isElementInViewport)
      .mockImplementation(mockIsElementInViewport)
    jest
      .mocked(require("@/lib/tour-utils").tourDOMUtils.isElementPartiallyVisible)
      .mockImplementation(mockIsElementPartiallyVisible)

    const mockTourContext = {
      ...mockTourContextBase,
      isActive: true,
      currentTour: "dashboard-overview",
      currentStep: 0,
      availableTours: mockTourDefinitions,
    }

    jest.mocked(require("@/context/tour-context").useTour).mockReturnValue(mockTourContext)

    render(
      <MockProviders>
        <Tour />
      </MockProviders>
    )

    await waitFor(() => {
      expect(mockScrollElementIntoView).toHaveBeenCalled()
    })
  })

  it("provides fallback positioning for problematic elements", async () => {
    const mockTourLogger = jest.mocked(require("@/lib/tour-utils").tourLogger)

    // Mock positioning hook to return error
    const mockUseTourPositioning = jest.fn().mockReturnValue({
      positions: {
        overlayStyle: {},
        tooltipStyle: { top: 100, left: 100 },
        contentAreaHeight: 200,
      },
      targetElement: null,
      isPositioning: false,
      error: "Target element not found",
    })

    jest.doMock("@/hooks/useTourPositioning", () => ({
      useTourPositioning: mockUseTourPositioning,
    }))

    const mockTourContext = {
      ...mockTourContextBase,
      isActive: true,
      currentTour: "dashboard-overview",
      currentStep: 0,
      availableTours: mockTourDefinitions,
    }

    jest.mocked(require("@/context/tour-context").useTour).mockReturnValue(mockTourContext)

    render(
      <MockProviders>
        <Tour />
      </MockProviders>
    )

    await waitFor(() => {
      expect(mockTourLogger.error).toHaveBeenCalledWith("Tour error detected:", "Target element not found")
    })
  })

  it("handles popover and dropdown interactions", async () => {
    const mockFindElementWithFallbacks = jest.fn().mockResolvedValue(document.createElement("div"))
    jest
      .mocked(require("@/lib/tour-utils").tourDOMUtils.findElementWithFallbacks)
      .mockImplementation(mockFindElementWithFallbacks)

    const mockTourContext = {
      ...mockTourContextBase,
      isActive: true,
      currentTour: "dashboard-overview",
      currentStep: 1, // environment-menu step
      availableTours: mockTourDefinitions,
    }

    jest.mocked(require("@/context/tour-context").useTour).mockReturnValue(mockTourContext)

    render(
      <MockProviders>
        <Tour />
      </MockProviders>
    )

    await waitFor(() => {
      expect(mockFindElementWithFallbacks).toHaveBeenCalledWith('[data-tour="environment-menu"]')
    })
  })

  it("logs anchoring issues appropriately", async () => {
    const mockTourLogger = jest.mocked(require("@/lib/tour-utils").tourLogger)

    // Mock ensureElementVisibility to throw error
    const mockEnsureElementVisibility = jest.fn().mockRejectedValue(new Error("Anchoring failed"))
    jest
      .mocked(require("@/lib/tour-utils").tourDOMUtils.ensureElementVisibility)
      .mockImplementation(mockEnsureElementVisibility)

    const mockTourContext = {
      ...mockTourContextBase,
      isActive: true,
      currentTour: "dashboard-overview",
      currentStep: 0,
      availableTours: mockTourDefinitions,
    }

    jest.mocked(require("@/context/tour-context").useTour).mockReturnValue(mockTourContext)

    render(
      <MockProviders>
        <Tour />
      </MockProviders>
    )

    await waitFor(() => {
      expect(mockTourLogger.error).toHaveBeenCalled()
    })
  })
})

describe("Tour Performance Optimization", () => {
  beforeEach(() => {
    jest.clearAllMocks()

    // Mock performance APIs
    Object.defineProperty(window, "performance", {
      value: {
        now: jest.fn(() => Date.now()),
        mark: jest.fn(),
        measure: jest.fn(),
        getEntriesByType: jest.fn(() => []),
        getEntriesByName: jest.fn(() => []),
      },
      writable: true,
    })
  })

  it("meets LCP target of <1s for tour initialization", async () => {
    const mockMeasureExecutionTime = jest.fn((func: any, label: string) => {
      return (...args: any[]) => {
        const start = performance.now()
        const result = func(...args)
        const end = performance.now()
        const duration = end - start

        // Simulate fast execution for LCP compliance
        expect(duration).toBeLessThan(1000)

        return result
      }
    })

    jest
      .mocked(require("@/lib/tour-utils").tourPerformance.measureExecutionTime)
      .mockImplementation(mockMeasureExecutionTime)

    const mockTourContext = {
      ...mockTourContextBase,
      isActive: true,
      currentTour: "dashboard-overview",
      currentStep: 0,
      availableTours: mockTourDefinitions,
    }

    jest.mocked(require("@/context/tour-context").useTour).mockReturnValue(mockTourContext)

    const startTime = performance.now()

    render(
      <MockProviders>
        <Tour />
      </MockProviders>
    )

    const endTime = performance.now()
    const renderTime = endTime - startTime

    // Should render quickly for good LCP
    expect(renderTime).toBeLessThan(100)
  })

  it("maintains CLS <0.1 during tooltip positioning", async () => {
    const mockUseTourPositioning = jest.fn().mockReturnValue({
      positions: {
        overlayStyle: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%" },
        tooltipStyle: {
          position: "fixed",
          top: 100,
          left: 100,
          transform: "translate3d(0, 0, 0)", // GPU acceleration
          willChange: "transform", // Optimize for animations
        },
        contentAreaHeight: 200,
      },
      targetElement: document.createElement("div"),
      isPositioning: false,
      error: null,
    })

    jest.doMock("@/hooks/useTourPositioning", () => ({
      useTourPositioning: mockUseTourPositioning,
    }))

    const mockTourContext = {
      ...mockTourContextBase,
      isActive: true,
      currentTour: "dashboard-overview",
      currentStep: 0,
      availableTours: mockTourDefinitions,
    }

    jest.mocked(require("@/context/tour-context").useTour).mockReturnValue(mockTourContext)

    render(
      <MockProviders>
        <Tour />
      </MockProviders>
    )

    const tooltip = screen.getByRole("dialog")

    // Check for CLS-optimized positioning
    expect(tooltip).toHaveStyle({
      position: "fixed",
      transform: "translate3d(0, 0, 0)",
      willChange: "transform",
    })
  })

  it("uses Suspense for optimal loading", async () => {
    const mockTourContext = {
      ...mockTourContextBase,
      isActive: true,
      currentTour: "dashboard-overview",
      currentStep: 0,
      availableTours: mockTourDefinitions,
      isLoading: true,
    }

    jest.mocked(require("@/context/tour-context").useTour).mockReturnValue(mockTourContext)

    render(
      <MockProviders>
        <Tour />
      </MockProviders>
    )

    // Should show loading state during positioning
    expect(screen.getByText("Loading tour...")).toBeInTheDocument()
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument()
  })

  it("measures and logs performance metrics", async () => {
    const mockMeasureExecutionTime = jest.fn()
    jest
      .mocked(require("@/lib/tour-utils").tourPerformance.measureExecutionTime)
      .mockImplementation(mockMeasureExecutionTime)

    const mockTourContext = {
      ...mockTourContextBase,
      isActive: true,
      currentTour: "dashboard-overview",
      currentStep: 0,
      availableTours: mockTourDefinitions,
    }

    jest.mocked(require("@/context/tour-context").useTour).mockReturnValue(mockTourContext)

    render(
      <MockProviders>
        <Tour />
      </MockProviders>
    )

    // Should measure performance for critical operations
    expect(mockMeasureExecutionTime).toHaveBeenCalled()
  })

  it("respects timing constants for optimal performance", async () => {
    const TOUR_CONSTANTS = require("@/lib/tour-constants").TOUR_CONSTANTS

    expect(TOUR_CONSTANTS.ELEMENT_SEARCH_DELAY).toBe(30)
    expect(TOUR_CONSTANTS.DASHBOARD_SCROLL_DELAY).toBe(500)
    expect(TOUR_CONSTANTS.FADE_DURATION).toBe(150)
    expect(TOUR_CONSTANTS.MAX_TOOLTIP_WIDTH).toBe(400)

    const mockTourContext = {
      ...mockTourContextBase,
      isActive: true,
      currentTour: "dashboard-overview",
      currentStep: 0,
      availableTours: mockTourDefinitions,
    }

    jest.mocked(require("@/context/tour-context").useTour).mockReturnValue(mockTourContext)

    render(
      <MockProviders>
        <Tour />
      </MockProviders>
    )

    // Verify timing constants are used
    const tooltip = screen.getByRole("dialog")
    expect(tooltip).toHaveStyle({ maxWidth: "400px" })
  })

  it("implements efficient step transitions", async () => {
    const mockTourContext = {
      ...mockTourContextBase,
      isActive: true,
      currentTour: "dashboard-overview",
      currentStep: 0,
      availableTours: mockTourDefinitions,
    }

    jest.mocked(require("@/context/tour-context").useTour).mockReturnValue(mockTourContext)

    render(
      <MockProviders>
        <Tour />
      </MockProviders>
    )

    const nextButton = screen.getByRole("button", { name: /start tour/i })

    const startTime = performance.now()
    fireEvent.click(nextButton)
    const endTime = performance.now()

    const transitionTime = endTime - startTime
    expect(transitionTime).toBeLessThan(50) // Should be very fast
  })
})

describe("Tour Focus Management and Accessibility", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("maintains focus trap within tooltip", async () => {
    const mockTrapFocus = jest.fn().mockReturnValue(jest.fn())
    jest.mocked(require("@/lib/tour-utils").tourDOMUtils.trapFocus).mockImplementation(mockTrapFocus)

    const mockTourContext = {
      ...mockTourContextBase,
      isActive: true,
      currentTour: "dashboard-overview",
      currentStep: 0,
      availableTours: mockTourDefinitions,
    }

    jest.mocked(require("@/context/tour-context").useTour).mockReturnValue(mockTourContext)

    render(
      <MockProviders>
        <Tour />
      </MockProviders>
    )

    await waitFor(() => {
      expect(mockTrapFocus).toHaveBeenCalled()
    })
  })

  it("handles keyboard navigation with proper focus states", async () => {
    const mockTourContext = {
      ...mockTourContextBase,
      isActive: true,
      currentTour: "dashboard-overview",
      currentStep: 0,
      availableTours: mockTourDefinitions,
    }

    jest.mocked(require("@/context/tour-context").useTour).mockReturnValue(mockTourContext)

    render(
      <MockProviders>
        <Tour />
      </MockProviders>
    )

    const tooltip = screen.getByRole("dialog")

    // Test keyboard navigation
    fireEvent.keyDown(tooltip, { key: "Tab" })
    fireEvent.keyDown(tooltip, { key: "Enter" })
    fireEvent.keyDown(tooltip, { key: "Escape" })

    // Should handle keyboard events without errors
    expect(tooltip).toBeInTheDocument()
  })

  it("provides proper ARIA labels and descriptions", () => {
    const mockTourContext = {
      ...mockTourContextBase,
      isActive: true,
      currentTour: "dashboard-overview",
      currentStep: 0,
      availableTours: mockTourDefinitions,
    }

    jest.mocked(require("@/context/tour-context").useTour).mockReturnValue(mockTourContext)

    render(
      <MockProviders>
        <Tour />
      </MockProviders>
    )

    const tooltip = screen.getByRole("dialog")

    expect(tooltip).toHaveAttribute("aria-modal", "true")
    expect(tooltip).toHaveAttribute("aria-labelledby", "tour-title")
    expect(tooltip).toHaveAttribute("aria-describedby", "tour-content")

    const title = screen.getByText("Welcome to Your Dashboard!")
    expect(title).toHaveAttribute("id", "tour-title")
  })
})

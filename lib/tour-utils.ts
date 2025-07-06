import { TOUR_CONSTANTS } from "./tour-constants"

// Improved logging utility - Next.js friendly
const isDevelopment = typeof window !== "undefined" && !window.location.hostname.includes("vercel.app")

export const tourLogger = {
  debug: (message: string, ...args: any[]) => {
    if (isDevelopment) {
      console.log(`[Tour Debug] ${message}`, ...args)
    }
  },
  info: (message: string, ...args: any[]) => {
    if (isDevelopment) {
      console.info(`[Tour Info] ${message}`, ...args)
    }
  },
  warn: (message: string, ...args: any[]) => {
    console.warn(`[Tour Warning] ${message}`, ...args)
  },
  error: (message: string, ...args: any[]) => {
    console.error(`[Tour Error] ${message}`, ...args)
  },
}

// Storage utilities
export const tourStorage = {
  getTourAvailability: (): boolean => {
    try {
      const stored = localStorage.getItem(TOUR_CONSTANTS.TOUR_AVAILABILITY_KEY)
      return stored !== null ? JSON.parse(stored) : true
    } catch (err) {
      tourLogger.warn("Failed to read tour availability from localStorage", err)
      return true
    }
  },

  setTourAvailability: (available: boolean): void => {
    try {
      localStorage.setItem(TOUR_CONSTANTS.TOUR_AVAILABILITY_KEY, JSON.stringify(available))
      tourLogger.debug("Tour availability updated:", available)
    } catch (err) {
      tourLogger.warn("Failed to save tour availability to localStorage", err)
    }
  },

  markTourAsShown: (tourId: string): void => {
    try {
      const sessionKey = `${TOUR_CONSTANTS.TOUR_SESSION_PREFIX}${tourId}`
      sessionStorage.setItem(sessionKey, "true")
      tourLogger.debug("Tour marked as shown in session:", tourId)
    } catch (err) {
      tourLogger.warn("Failed to mark tour as shown", err)
    }
  },

  hasTourBeenShownInSession: (tourId: string): boolean => {
    try {
      const sessionKey = `${TOUR_CONSTANTS.TOUR_SESSION_PREFIX}${tourId}`
      return sessionStorage.getItem(sessionKey) === "true"
    } catch (err) {
      tourLogger.warn("Failed to check if tour was shown", err)
      return false
    }
  },

  clearAllTourData: (): void => {
    try {
      // Clear localStorage tour data
      localStorage.removeItem(TOUR_CONSTANTS.TOUR_AVAILABILITY_KEY)

      // Clear sessionStorage tour data
      const keysToRemove: string[] = []
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i)
        if (
          key &&
          (key.startsWith(TOUR_CONSTANTS.TOUR_SESSION_PREFIX) || key.startsWith(TOUR_CONSTANTS.TOUR_WELCOME_PREFIX))
        ) {
          keysToRemove.push(key)
        }
      }
      keysToRemove.forEach((key) => sessionStorage.removeItem(key))

      tourLogger.info("All tour data cleared")
    } catch (err) {
      tourLogger.error("Failed to clear tour data", err)
    }
  },
}

// DOM utilities
export const tourDOMUtils = {
  scrollElementIntoView: (element: HTMLElement, options?: ScrollIntoViewOptions): Promise<void> => {
    return new Promise((resolve) => {
      element.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "nearest",
        ...options,
      })

      // Wait for scroll to complete
      setTimeout(resolve, TOUR_CONSTANTS.SMOOTH_SCROLL_DELAY)
    })
  },

  isElementInViewport: (element: HTMLElement): boolean => {
    const rect = element.getBoundingClientRect()
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth

    return rect.top >= 0 && rect.left >= 0 && rect.bottom <= viewportHeight && rect.right <= viewportWidth
  },

  isElementPartiallyVisible: (element: HTMLElement): boolean => {
    const rect = element.getBoundingClientRect()
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth

    return rect.bottom > 0 && rect.right > 0 && rect.top < viewportHeight && rect.left < viewportWidth
  },

  /**
   * Enhanced element visibility function with comprehensive anchoring
   * Ensures target elements are fully visible before showing tooltips
   */
  ensureElementVisibility: async (element: HTMLElement): Promise<void> => {
    tourLogger.debug("Ensuring element visibility for:", element)

    try {
      // Performance measurement for visibility operations
      return await tourPerformance.measureExecutionTime(async () => {
        // First check if element is already visible
        if (tourDOMUtils.isElementInViewport(element)) {
          tourLogger.debug("Element already in viewport")
          return
        }

        // Handle special cases for dropdowns and popovers
        await tourDOMUtils.handleSpecialElements(element)

        // If partially visible, try scrolling it into full view
        if (tourDOMUtils.isElementPartiallyVisible(element)) {
          tourLogger.debug("Element partially visible, scrolling to center")
          await tourDOMUtils.scrollElementIntoView(element, {
            block: "center",
            inline: "center",
          })

          // Verify visibility after scroll
          if (tourDOMUtils.isElementInViewport(element)) {
            return
          }
        }

        // Element is not visible at all, need comprehensive approach
        tourLogger.debug("Element not visible, attempting comprehensive visibility strategy")

        // 1. Try expanding collapsed parent elements
        await tourDOMUtils.expandParentContainers(element)

        // 2. Try scrolling to the element's container first
        const container = element.closest("[data-tour-container], .dashboard-content, main, .container")
        if (container && container !== element) {
          await tourDOMUtils.scrollElementIntoView(container as HTMLElement, { block: "start" })
          await new Promise((resolve) => setTimeout(resolve, TOUR_CONSTANTS.DASHBOARD_SCROLL_DELAY))
        }

        // 3. Now scroll to the actual element
        await tourDOMUtils.scrollElementIntoView(element, {
          block: "center",
          inline: "center",
        })

        // 4. Final verification with retry mechanism
        let retries = 3
        while (retries > 0 && !tourDOMUtils.isElementPartiallyVisible(element)) {
          await new Promise((resolve) => setTimeout(resolve, 100))
          await tourDOMUtils.scrollElementIntoView(element, { block: "nearest" })
          retries--
        }

        if (!tourDOMUtils.isElementPartiallyVisible(element)) {
          tourLogger.warn("Unable to ensure full element visibility after retries")
        } else {
          tourLogger.debug("Element visibility successfully ensured")
        }
      }, "Element Visibility Ensure")
    } catch (err) {
      tourLogger.error("Error ensuring element visibility:", err)
      throw err
    }
  },

  /**
   * Handle special element types like dropdowns, popovers, and modals
   */
  handleSpecialElements: async (element: HTMLElement): Promise<void> => {
    // Check if element is inside a dropdown or popover
    const dropdown = element.closest("[data-radix-popper-content-wrapper], .dropdown-menu, .popover")
    if (dropdown) {
      tourLogger.debug("Element is inside dropdown/popover, ensuring parent visibility")

      // Find the trigger element
      const trigger = document.querySelector(`[aria-expanded="true"][data-tour], [aria-haspopup="true"][data-tour]`)
      if (trigger) {
        await tourDOMUtils.ensureElementVisibility(trigger as HTMLElement)
      }
    }

    // Check if element is inside a tab panel
    const tabPanel = element.closest('[role="tabpanel"]')
    if (tabPanel) {
      const tabId = tabPanel.getAttribute("aria-labelledby")
      if (tabId) {
        const tab = document.getElementById(tabId)
        if (tab && tab.getAttribute("aria-selected") !== "true") {
          tourLogger.debug("Element is in inactive tab, attempting to activate")
          tab.click()
          await new Promise((resolve) => setTimeout(resolve, 200))
        }
      }
    }

    // Check if element is inside a collapsed accordion
    const accordionContent = element.closest('[data-state="closed"], .accordion-content[data-state="closed"]')
    if (accordionContent) {
      const trigger = accordionContent.parentElement?.querySelector('[data-state="closed"]')
      if (trigger) {
        tourLogger.debug("Element is in collapsed accordion, attempting to expand")
        ;(trigger as HTMLElement).click()
        await new Promise((resolve) => setTimeout(resolve, 300))
      }
    }
  },

  /**
   * Expand parent containers that might be hiding the element
   */
  expandParentContainers: async (element: HTMLElement): Promise<void> => {
    const parents = []
    let parent = element.parentElement

    while (parent && parent !== document.body) {
      parents.push(parent)
      parent = parent.parentElement
    }

    for (const container of parents) {
      // Check for hidden containers
      if (container.style.display === "none" || container.hidden) {
        tourLogger.debug("Found hidden parent container, attempting to show")
        container.style.display = ""
        container.hidden = false
      }

      // Check for collapsed containers
      if (container.classList.contains("collapsed") || container.getAttribute("aria-expanded") === "false") {
        const expandButton = container.querySelector('[aria-expanded="false"], .expand-button, .collapse-toggle')
        if (expandButton) {
          ;(expandButton as HTMLElement).click()
          await new Promise((resolve) => setTimeout(resolve, 200))
        }
      }
    }
  },

  findElementWithFallbacks: async (selector: string): Promise<HTMLElement | null> => {
    tourLogger.debug("Searching for element with fallbacks:", selector)

    // Performance measurement for element search
    return await tourPerformance.measureExecutionTime(async () => {
      // Direct search first
      let element = document.querySelector(selector) as HTMLElement
      if (element) {
        tourLogger.debug("Element found directly")
        return element
      }

      // Wait a bit for dynamic content
      await new Promise((resolve) => setTimeout(resolve, TOUR_CONSTANTS.ELEMENT_SEARCH_DELAY))
      element = document.querySelector(selector) as HTMLElement
      if (element) {
        tourLogger.debug("Element found after delay")
        return element
      }

      // Check if we're looking for a data-tour attribute and use page-specific helpers
      if (selector.includes("data-tour=")) {
        const tourValue = selector.match(/data-tour="([^"]+)"/)?.[1]
        if (tourValue) {
          // Detect current page and use appropriate helper
          const currentPath = window.location.pathname

          if (currentPath.includes("/staff-planning")) {
            const staffingElement = await tourDOMUtils.findStaffingElement(tourValue)
            if (staffingElement) {
              tourLogger.debug("Element found with staffing helper:", tourValue)
              return staffingElement
            }
          } else if (currentPath.includes("/dashboard")) {
            const dashboardElement = await tourDOMUtils.findDashboardElement(tourValue)
            if (dashboardElement) {
              tourLogger.debug("Element found with dashboard helper:", tourValue)
              return dashboardElement
            }
          }
        }
      }

      // Try finding with attribute variations
      const fallbackSelectors = tourDOMUtils.generateFallbackSelectors(selector)

      for (const fallbackSelector of fallbackSelectors) {
        element = document.querySelector(fallbackSelector) as HTMLElement
        if (element) {
          tourLogger.debug("Element found with fallback selector:", fallbackSelector)
          return element
        }

        // Small delay between attempts
        await new Promise((resolve) => setTimeout(resolve, 10))
      }

      // Final fallback: try scrolling through the page to find the element
      const found = await tourDOMUtils.searchElementByScrolling(selector)
      if (found) {
        return found
      }

      tourLogger.warn("Element not found with any selector variations:", selector)
      return null
    }, "Element Search with Fallbacks")
  },

  /**
   * Search for element by scrolling through the page as a last resort
   */
  searchElementByScrolling: async (selector: string): Promise<HTMLElement | null> => {
    tourLogger.debug("Searching element by scrolling:", selector)

    const originalScrollY = window.scrollY
    const documentHeight = Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight
    )

    // Scroll through the page in sections
    const sections = 10
    const sectionHeight = documentHeight / sections

    for (let i = 0; i <= sections; i++) {
      const scrollPosition = i * sectionHeight

      // Scroll to position
      window.scrollTo({ top: scrollPosition, behavior: "smooth" })
      await new Promise((resolve) => setTimeout(resolve, 300))

      // Check if element is now available
      const element = document.querySelector(selector) as HTMLElement
      if (element) {
        tourLogger.debug("Element found at scroll position:", scrollPosition)
        // Ensure it's visible
        await tourDOMUtils.ensureElementVisibility(element)
        return element
      }
    }

    // Restore original scroll position
    window.scrollTo({ top: originalScrollY, behavior: "smooth" })
    await new Promise((resolve) => setTimeout(resolve, 300))

    return null
  },

  /**
   * Enhanced fallback selector generation with more comprehensive variations
   */
  generateFallbackSelectors: (originalSelector: string): string[] => {
    const fallbacks: string[] = []

    // If it's a data-tour selector, try various formats
    if (originalSelector.includes("data-tour=")) {
      const tourValue = originalSelector.match(/data-tour="([^"]+)"/)?.[1]
      if (tourValue) {
        fallbacks.push(
          `[data-tour="${tourValue}"]`,
          `[data-tour='${tourValue}']`,
          `*[data-tour="${tourValue}"]`,
          `[data-testid="${tourValue}"]`,
          `[data-cy="${tourValue}"]`,
          `[id="${tourValue}"]`,
          `[id*="${tourValue}"]`,
          `.${tourValue}`,
          `[class*="${tourValue}"]`,
          `[aria-label*="${tourValue}"]`,
          `[title*="${tourValue}"]`
        )
      }
    }

    // Generic fallbacks
    fallbacks.push(
      originalSelector.replace(/\[([^\]]+)\]/g, "*[$1]"), // Make attribute selectors more generic
      originalSelector.replace(/"/g, "'"), // Try single quotes
      originalSelector.toLowerCase(), // Try lowercase
      originalSelector.replace(/\s+/g, ""), // Remove spaces
      `${originalSelector}, ${originalSelector} *` // Include descendant elements
    )

    return [...new Set(fallbacks)] // Remove duplicates
  },

  /**
   * Dashboard-specific element finding with enhanced logic and comprehensive mappings
   */
  findDashboardElement: async (tourValue: string): Promise<HTMLElement | null> => {
    tourLogger.debug("Searching for dashboard element:", tourValue)

    // Common dashboard element patterns with comprehensive selectors
    const dashboardMappings: Record<string, string[]> = {
      "environment-menu": [
        '[data-tour="environment-menu"]',
        ".environment-menu",
        ".environment-selector",
        '[data-testid="environment-menu"]',
        "nav .environment-dropdown",
        ".header .environment-menu",
        'button[aria-label*="environment"]',
        'select[name*="environment"]',
      ],
      "projects-menu": [
        '[data-tour="projects-menu"]',
        ".projects-menu",
        ".project-selector",
        '[data-testid="projects-menu"]',
        "nav .projects-dropdown",
        ".header .projects-menu",
        'button[aria-label*="project"]',
        'select[name*="project"]',
      ],
      "tools-menu": [
        '[data-tour="tools-menu"]',
        ".tools-menu",
        ".tools-dropdown",
        '[data-testid="tools-menu"]',
        "nav .tools-menu",
        ".header .tools-menu",
        'button[aria-label*="tools"]',
      ],
      "search-bar": [
        '[data-tour="search-bar"]',
        ".search-bar",
        ".global-search",
        '[data-testid="search-bar"]',
        'input[type="search"]',
        'input[placeholder*="search"]',
        ".search-input",
        '[role="searchbox"]',
      ],
      "tour-controls": [
        '[data-tour="tour-controls"]',
        ".tour-controls",
        ".tours-menu",
        '[data-testid="tour-controls"]',
        'button[aria-label*="tour"]',
        ".guided-tours",
      ],
      "dashboard-selector": [
        '[data-tour="dashboard-selector"]',
        ".dashboard-selector",
        '[data-testid="dashboard-selector"]',
        'select[name*="dashboard"]',
        ".dashboard-dropdown",
        ".view-selector",
        // Popover-based selectors
        '[data-state="closed"] > button:has(svg)',
        "button:has(svg.lucide-layout-dashboard)",
        "button:has(svg.lucide-chevron-down)",
        'button[aria-expanded="false"]:has(svg)',
        ".dashboard-view-selector",
      ],
      "dashboard-controls": [
        '[data-tour="dashboard-controls"]',
        ".dashboard-controls",
        ".dashboard-actions",
        ".dashboard-toolbar",
        ".control-panel",
        ".dashboard-edit-controls",
        ".dashboard-settings",
        'button[aria-label*="edit"]',
        'button[aria-label*="layout"]',
        'button[aria-label*="fullscreen"]',
      ],
      "kpi-widgets": [
        '[data-tour="kpi-widgets"]',
        ".kpi-widgets",
        ".kpi-container",
        ".metrics-row",
        ".dashboard-kpi",
        ".kpi-row",
        ".performance-indicators",
        ".dashboard-metrics",
        ".widget-kpi",
      ],
      "hbi-insights": [
        '[data-tour="hbi-insights"]',
        ".hbi-insights",
        ".insights-panel",
        ".ai-insights",
        ".intelligence-panel",
        ".hb-intelligence",
        ".insights-widget",
        ".ai-recommendations",
      ],
      "dashboard-content": [
        '[data-tour="dashboard-content"]',
        ".dashboard-content",
        ".dashboard-grid",
        ".dashboard-layout",
        "main .dashboard",
        ".dashboard-main",
        ".dashboard-wrapper",
        ".main-dashboard",
      ],
    }

    const selectors = dashboardMappings[tourValue] || [`[data-tour="${tourValue}"]`]

    // For dashboard-selector, use enhanced strategy
    if (tourValue === "dashboard-selector") {
      return await tourDOMUtils.findDashboardSelectorElement(selectors)
    }

    // For other dashboard elements, try each selector with fallbacks
    for (const selector of selectors) {
      const element = await tourDOMUtils.findElementWithFallbacks(selector)
      if (element) {
        // Ensure dashboard elements are properly visible
        await tourDOMUtils.ensureElementVisibility(element)
        return element
      }
    }

    return null
  },

  /**
   * Staffing-specific element finding with comprehensive mappings
   */
  findStaffingElement: async (tourValue: string): Promise<HTMLElement | null> => {
    tourLogger.debug("Searching for staffing element:", tourValue)

    // Common staffing element patterns with comprehensive selectors
    const staffingMappings: Record<string, string[]> = {
      "staffing-header": [
        '[data-tour="staffing-header"]',
        ".staffing-header",
        ".page-header",
        'h1:contains("Staffing")',
        ".staff-planning-header",
        ".staffing-title",
        ".page-title",
      ],
      "breadcrumb-nav": [
        '[data-tour="breadcrumb-nav"]',
        ".breadcrumb",
        'nav[aria-label="breadcrumb"]',
        ".breadcrumb-nav",
        ".navigation-breadcrumb",
        ".page-breadcrumb",
      ],
      "role-badges": [
        '[data-tour="role-badges"]',
        ".role-badges",
        ".badge-container",
        ".role-indicators",
        ".user-role-badge",
        ".staff-role-badges",
      ],
      "action-controls": [
        '[data-tour="action-controls"]',
        ".action-controls",
        ".page-actions",
        ".toolbar-actions",
        ".control-buttons",
        ".staffing-actions",
        ".staff-controls",
      ],
      "utilization-widget": [
        '[data-tour="utilization-widget"]',
        ".utilization-widget",
        ".staff-utilization",
        ".utilization-card",
        ".utilization-metric",
        ".staff-utilization-card",
      ],
      "labor-cost-widget": [
        '[data-tour="labor-cost-widget"]',
        ".labor-cost-widget",
        ".cost-widget",
        ".monthly-cost",
        ".labor-cost-card",
        ".cost-metric",
      ],
      "project-scope-widget": [
        '[data-tour="project-scope-widget"]',
        ".project-scope-widget",
        ".scope-widget",
        ".portfolio-widget",
        ".project-scope-card",
        ".scope-metric",
      ],
      "spcr-widget": [
        '[data-tour="spcr-widget"]',
        ".spcr-widget",
        ".spcr-status",
        ".staffing-requests",
        ".spcr-card",
        ".change-requests",
      ],
      "role-content": [
        '[data-tour="role-content"]',
        ".role-content",
        ".staffing-content",
        ".main-content",
        ".staff-planning-content",
        ".staffing-dashboard",
      ],
      "help-section": [
        '[data-tour="help-section"]',
        ".help-section",
        ".guide-section",
        ".planning-guide",
        ".staffing-help",
        ".user-guide",
      ],
    }

    const selectors = staffingMappings[tourValue] || [`[data-tour="${tourValue}"]`]

    // Try each selector with fallbacks
    for (const selector of selectors) {
      const element = await tourDOMUtils.findElementWithFallbacks(selector)
      if (element) {
        // Ensure staffing elements are properly visible
        await tourDOMUtils.ensureElementVisibility(element)
        return element
      }
    }

    return null
  },

  /**
   * Enhanced dashboard selector finding with specific scrolling strategy
   */
  findDashboardSelectorElement: async (selectors: string[]): Promise<HTMLElement | null> => {
    tourLogger.debug("Enhanced dashboard selector search starting")

    // First, ensure we're at the top of the page
    tourLogger.debug("Scrolling to top for dashboard selector")
    window.scrollTo({ top: 0, behavior: "smooth" })
    await new Promise((resolve) => setTimeout(resolve, 500)) // Longer wait for complete scroll

    // Try direct selectors first
    for (const selector of selectors) {
      const element = document.querySelector(selector) as HTMLElement
      if (element) {
        tourLogger.debug("Dashboard selector found with direct search:", selector)
        await tourDOMUtils.ensureElementVisibility(element)
        return element
      }
    }

    // If not found, wait a bit more and try again (for slow-loading components)
    await new Promise((resolve) => setTimeout(resolve, 300))

    for (const selector of selectors) {
      const element = document.querySelector(selector) as HTMLElement
      if (element) {
        tourLogger.debug("Dashboard selector found after wait:", selector)
        await tourDOMUtils.ensureElementVisibility(element)
        return element
      }
    }

    // Try searching for Popover components specifically
    const popoverSelectors = [
      "[data-state] > button", // Popover trigger buttons
      "button[aria-expanded]", // Buttons that can expand
      "button:has(svg.lucide-layout-dashboard)", // Buttons with dashboard icon
      "button:has(.lucide-layout-dashboard)", // Alternative class format
      "[data-radix-popper-anchor]", // Radix popover anchors
      'button[data-state="closed"]', // Closed popover triggers
    ]

    for (const selector of popoverSelectors) {
      try {
        const elements = document.querySelectorAll(selector)
        for (const element of elements) {
          const htmlElement = element as HTMLElement
          // Check if this button looks like a dashboard selector
          const hasRelevantContent =
            htmlElement.textContent?.toLowerCase().includes("dashboard") ||
            htmlElement.querySelector("svg.lucide-layout-dashboard") ||
            htmlElement.querySelector(".lucide-layout-dashboard") ||
            htmlElement.closest('[data-tour="dashboard-selector"]') ||
            htmlElement.getAttribute("aria-label")?.toLowerCase().includes("dashboard") ||
            htmlElement.getAttribute("title")?.toLowerCase().includes("dashboard")

          if (hasRelevantContent) {
            tourLogger.debug("Dashboard selector found via popover search:", selector)
            await tourDOMUtils.ensureElementVisibility(htmlElement)
            return htmlElement
          }
        }
      } catch (err) {
        tourLogger.debug("Error in popover selector search:", err)
      }
    }

    // Final fallback: search for any button in the header area that might be the dashboard selector
    const headerButtons = document.querySelectorAll(".header button, .app-header button, nav button")
    for (const button of headerButtons) {
      const htmlButton = button as HTMLElement
      // Look for buttons with dashboard-related content or icons
      if (
        htmlButton.querySelector("svg") &&
        (htmlButton.textContent?.toLowerCase().includes("view") ||
          htmlButton.textContent?.toLowerCase().includes("dashboard") ||
          htmlButton.getAttribute("aria-label")?.toLowerCase().includes("view"))
      ) {
        tourLogger.debug("Dashboard selector found via header button fallback")
        await tourDOMUtils.ensureElementVisibility(htmlButton)
        return htmlButton
      }
    }

    tourLogger.debug("Dashboard selector not found after enhanced search")
    return null
  },

  /**
   * Find focusable elements within a container with enhanced filtering
   */
  findFocusableElements: (container: HTMLElement): HTMLElement[] => {
    return Array.from(container.querySelectorAll(TOUR_CONSTANTS.FOCUS_TRAP_SELECTOR)).filter(
      (el): el is HTMLElement => {
        const element = el as HTMLElement
        // Check if element has disabled property (form elements)
        const isDisabled = "disabled" in element ? (element as any).disabled : false
        return element.offsetWidth > 0 && element.offsetHeight > 0 && !isDisabled && element.tabIndex !== -1
      }
    )
  },

  /**
   * Enhanced focus trap with better accessibility
   */
  trapFocus: (container: HTMLElement): (() => void) => {
    const focusableElements = tourDOMUtils.findFocusableElements(container)

    if (focusableElements.length === 0) return () => {}

    const firstFocusable = focusableElements[0]
    const lastFocusable = focusableElements[focusableElements.length - 1]

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return

      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstFocusable) {
          event.preventDefault()
          lastFocusable.focus()
        }
      } else {
        // Tab
        if (document.activeElement === lastFocusable) {
          event.preventDefault()
          firstFocusable.focus()
        }
      }
    }

    // Focus the first element initially
    firstFocusable.focus()

    container.addEventListener("keydown", handleTabKey)

    // Return cleanup function
    return () => {
      container.removeEventListener("keydown", handleTabKey)
    }
  },
}

// Animation utilities
export const tourAnimations = {
  fadeIn: (element: HTMLElement, duration = TOUR_CONSTANTS.FADE_DURATION): Promise<void> => {
    return new Promise((resolve) => {
      element.style.opacity = "0"
      element.style.transition = `opacity ${duration}ms ease-in-out`

      // Force reflow
      element.offsetHeight

      element.style.opacity = "1"

      setTimeout(resolve, duration)
    })
  },

  fadeOut: (element: HTMLElement, duration = TOUR_CONSTANTS.FADE_DURATION): Promise<void> => {
    return new Promise((resolve) => {
      element.style.transition = `opacity ${duration}ms ease-in-out`
      element.style.opacity = "0"

      setTimeout(resolve, duration)
    })
  },

  slideIn: (element: HTMLElement, from: "top" | "bottom" | "left" | "right" = "top"): Promise<void> => {
    return new Promise((resolve) => {
      const transforms = {
        top: "translateY(-20px)",
        bottom: "translateY(20px)",
        left: "translateX(-20px)",
        right: "translateX(20px)",
      }

      element.style.transform = transforms[from]
      element.style.opacity = "0"
      element.style.transition = `all ${TOUR_CONSTANTS.SLIDE_DURATION}ms ease-out`

      // Force reflow
      element.offsetHeight

      element.style.transform = "translate(0, 0)"
      element.style.opacity = "1"

      setTimeout(resolve, TOUR_CONSTANTS.SLIDE_DURATION)
    })
  },
}

// Event utilities
export const tourEventUtils = {
  createKeyboardHandler: (handlers: { [key: string]: () => void }): ((event: KeyboardEvent) => void) => {
    return (event: KeyboardEvent) => {
      const handler = handlers[event.key]
      if (handler) {
        event.preventDefault()
        handler()
      }
    }
  },

  debounce: <T extends (...args: any[]) => any>(func: T, delay: number): ((...args: Parameters<T>) => void) => {
    let timeoutId: NodeJS.Timeout

    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => func(...args), delay)
    }
  },

  throttle: <T extends (...args: any[]) => any>(func: T, delay: number): ((...args: Parameters<T>) => void) => {
    let lastCall = 0

    return (...args: Parameters<T>) => {
      const now = Date.now()
      if (now - lastCall >= delay) {
        lastCall = now
        func(...args)
      }
    }
  },
}

// Validation utilities
export const tourValidation = {
  isValidSelector: (selector: string): boolean => {
    try {
      document.querySelector(selector)
      return true
    } catch (err) {
      return false
    }
  },

  validateTourStep: (step: any): string[] => {
    const errors: string[] = []

    if (!step.id) errors.push("Step ID is required")
    if (!step.title) errors.push("Step title is required")
    if (!step.content) errors.push("Step content is required")
    if (!step.target) errors.push("Step target selector is required")
    if (!step.placement) errors.push("Step placement is required")

    if (step.target && !tourValidation.isValidSelector(step.target)) {
      errors.push(`Invalid target selector: ${step.target}`)
    }

    const validPlacements = ["top", "bottom", "left", "right", "center"]
    if (step.placement && !validPlacements.includes(step.placement)) {
      errors.push(`Invalid placement: ${step.placement}. Must be one of: ${validPlacements.join(", ")}`)
    }

    return errors
  },

  validateTourDefinition: (tour: any): string[] => {
    const errors: string[] = []

    if (!tour.id) errors.push("Tour ID is required")
    if (!tour.name) errors.push("Tour name is required")
    if (!tour.description) errors.push("Tour description is required")
    if (!tour.steps || !Array.isArray(tour.steps)) {
      errors.push("Tour steps array is required")
    } else if (tour.steps.length === 0) {
      errors.push("Tour must have at least one step")
    } else {
      tour.steps.forEach((step: any, index: number) => {
        const stepErrors = tourValidation.validateTourStep(step)
        stepErrors.forEach((error) => {
          errors.push(`Step ${index + 1}: ${error}`)
        })
      })
    }

    return errors
  },
}

// Performance utilities
export const tourPerformance = {
  measureExecutionTime: <T extends (...args: any[]) => any>(func: T, label: string): T => {
    return ((...args: Parameters<T>) => {
      const start = performance.now()
      const result = func(...args)
      const end = performance.now()

      if (process.env.NODE_ENV === "development") {
        tourLogger.debug(`${label} execution time: ${(end - start).toFixed(2)}ms`)
      }

      return result
    }) as T
  },

  createPerformanceObserver: (callback: (entries: PerformanceEntry[]) => void): PerformanceObserver | null => {
    if (typeof PerformanceObserver === "undefined") return null

    try {
      const observer = new PerformanceObserver((list) => {
        callback(list.getEntries())
      })

      observer.observe({ entryTypes: ["measure", "navigation", "paint"] })
      return observer
    } catch (err) {
      tourLogger.warn("Failed to create PerformanceObserver", err)
      return null
    }
  },
}

// Error handling utilities
export const tourErrorUtils = {
  createErrorBoundary: (onError?: (error: Error) => void) => {
    return (error: Error, errorInfo: any) => {
      tourLogger.error("Tour error boundary caught error:", error, errorInfo)
      onError?.(error)
    }
  },

  safeExecute: async <T>(operation: () => Promise<T> | T, fallback: T, errorMessage?: string): Promise<T> => {
    try {
      return await operation()
    } catch (err) {
      tourLogger.error(errorMessage || "Safe execute failed:", err)
      return fallback
    }
  },

  retryOperation: async <T>(operation: () => Promise<T>, maxRetries: number = 3, delay: number = 1000): Promise<T> => {
    let lastError: Error

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation()
      } catch (err) {
        lastError = err as Error
        tourLogger.warn(`Operation failed (attempt ${attempt}/${maxRetries}):`, err)

        if (attempt < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, delay * attempt))
        }
      }
    }

    throw lastError!
  },
}

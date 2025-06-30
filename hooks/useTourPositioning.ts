import { useState, useEffect, useCallback, useRef } from 'react'
import { TOUR_CONSTANTS, TOUR_THEMES, TourPlacement } from '@/lib/tour-constants'
import { tourLogger, tourDOMUtils } from '@/lib/tour-utils'

interface PositionStyles {
  overlayStyle: React.CSSProperties
  tooltipStyle: React.CSSProperties
  contentAreaHeight: number
}

interface UseTourPositioningProps {
  target: string
  placement: TourPlacement
  isActive: boolean
}

interface ElementBounds {
  top: number
  left: number
  right: number
  bottom: number
  width: number
  height: number
}

export const useTourPositioning = ({ target, placement, isActive }: UseTourPositioningProps) => {
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null)
  const [positions, setPositions] = useState<PositionStyles>({
    overlayStyle: {},
    tooltipStyle: {},
    contentAreaHeight: TOUR_CONSTANTS.CONTENT_BASE_HEIGHT
  })
  const [isPositioning, setIsPositioning] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const observerRef = useRef<MutationObserver | null>(null)
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const retryCountRef = useRef(0)

  // Optimized element finder with better error handling
  const findTargetElement = useCallback(async () => {
    if (!isActive) return

    setIsPositioning(true)
    setError(null)
    
    const searchElement = async (attempt: number = 0): Promise<HTMLElement | null> => {
      tourLogger.debug(`Search attempt ${attempt + 1} for target:`, target)
      
      // Strategy 1: Direct search first (attempts 0-2)
      if (attempt <= 2) {
        const element = document.querySelector(target) as HTMLElement
        if (element) {
          tourLogger.debug(`Element found directly on attempt ${attempt + 1}`)
          return element
        }
      }
      
      // Strategy 2: Use enhanced DOM utilities with fallbacks (attempts 3-5)
      if (attempt >= 3 && attempt <= 5) {
        const element = await tourDOMUtils.findElementWithFallbacks(target)
        if (element) {
          tourLogger.debug(`Element found with fallbacks on attempt ${attempt + 1}`)
          return element
        }
      }
      
      // Strategy 3: Dashboard-specific search for known elements (attempts 6-8)
      if (attempt >= 6 && attempt <= 8) {
        const tourValue = target.match(/data-tour="([^"]+)"/)?.[1]
        if (tourValue) {
          const element = await tourDOMUtils.findDashboardElement(tourValue)
          if (element) {
            tourLogger.debug(`Dashboard element found on attempt ${attempt + 1}`)
            return element
          }
        }
      }
      
      // Strategy 4: Scroll to containers and search (attempts 9-12)
      if (attempt >= 9 && attempt <= 12) {
        await tryScrollToContainer()
        await new Promise(resolve => setTimeout(resolve, TOUR_CONSTANTS.SMOOTH_SCROLL_DELAY))
        
        const element = document.querySelector(target) as HTMLElement
        if (element) {
          tourLogger.debug(`Element found after container scroll on attempt ${attempt + 1}`)
          return element
        }
      }
      
      // Strategy 5: Expand collapsed sections and search (attempts 13-15)
      if (attempt >= 13 && attempt <= 15) {
        await tryExpandCollapsedSections()
        
        const element = document.querySelector(target) as HTMLElement
        if (element) {
          tourLogger.debug(`Element found after expanding sections on attempt ${attempt + 1}`)
          return element
        }
      }
      
      // Strategy 6: Full page scroll search (attempts 16-18)
      if (attempt >= 16 && attempt <= 18) {
        const element = await tourDOMUtils.searchElementByScrolling(target)
        if (element) {
          tourLogger.debug(`Element found via scroll search on attempt ${attempt + 1}`)
          return element
        }
      }

      // Continue retrying if we haven't exceeded max attempts
      if (attempt < TOUR_CONSTANTS.ELEMENT_SEARCH_MAX_RETRIES) {
        // Wait before retry with exponential backoff
        const delay = Math.min(TOUR_CONSTANTS.ELEMENT_SEARCH_DELAY * Math.pow(1.5, Math.floor(attempt / 3)), 1000)
        await new Promise(resolve => setTimeout(resolve, delay))
        return searchElement(attempt + 1)
      }
      
      // All strategies failed
      tourLogger.warn(`Element not found after ${TOUR_CONSTANTS.ELEMENT_SEARCH_MAX_RETRIES} attempts:`, target)
      return null
    }

    // Helper function to scroll to potential containers
    const tryScrollToContainer = async (): Promise<void> => {
      // For dashboard-selector, always scroll to the very top first
      if (target.includes('dashboard-selector')) {
        tourLogger.debug('Dashboard selector detected, scrolling to top')
        window.scrollTo({ top: 0, behavior: 'smooth' })
        await new Promise(resolve => setTimeout(resolve, TOUR_CONSTANTS.DASHBOARD_SCROLL_DELAY))
        return
      }
      
      // For other dashboard controls, also prioritize top scrolling
      if (target.includes('dashboard-controls') || target.includes('dashboard-content')) {
        tourLogger.debug('Dashboard control detected, scrolling to top')
        window.scrollTo({ top: 0, behavior: 'smooth' })
        await new Promise(resolve => setTimeout(resolve, TOUR_CONSTANTS.DASHBOARD_SCROLL_DELAY))
        return
      }

      // Staffing page-specific scrolling
      if (window.location.pathname.includes('/staff-planning')) {
        if (target.includes('staffing-header') || target.includes('breadcrumb-nav') || target.includes('role-badges')) {
          tourLogger.debug('Staffing header element detected, scrolling to top')
          window.scrollTo({ top: 0, behavior: 'smooth' })
          await new Promise(resolve => setTimeout(resolve, TOUR_CONSTANTS.DASHBOARD_SCROLL_DELAY))
          return
        }
        
        if (target.includes('widget')) {
          tourLogger.debug('Staffing widget detected, scrolling to widgets section')
          const widgetsContainer = document.querySelector('.grid')
          if (widgetsContainer) {
            await tourDOMUtils.scrollElementIntoView(widgetsContainer as HTMLElement, { block: 'center' })
            await new Promise(resolve => setTimeout(resolve, 300))
            return
          }
        }
        
        if (target.includes('role-content')) {
          tourLogger.debug('Role content detected, scrolling to main content')
          const contentContainer = document.querySelector('[data-tour="role-content"]')
          if (contentContainer) {
            await tourDOMUtils.scrollElementIntoView(contentContainer as HTMLElement, { block: 'start' })
            await new Promise(resolve => setTimeout(resolve, 300))
            return
          }
        }
      }
      
      const containers = [
        '[data-tour-container]',
        '[data-tour="dashboard-content"]',
        '[data-tour="dashboard-controls"]',
        '[data-tour="staffing-header"]',
        '.dashboard-grid',
        '.dashboard-container',
        '.staffing-container',
        'main[role="main"]',
        'main',
        '.container',
        '.layout-content',
        '#main-content'
      ]
      
      for (const containerSelector of containers) {
        const container = document.querySelector(containerSelector) as HTMLElement
        if (container) {
          tourLogger.debug('Scrolling to container:', containerSelector)
          await tourDOMUtils.scrollElementIntoView(container, { block: 'start' })
          await new Promise(resolve => setTimeout(resolve, 200))
          break
        }
      }
    }

    // Helper function to expand collapsed sections
    const tryExpandCollapsedSections = async (): Promise<void> => {
      const expandables = [
        '[aria-expanded="false"]',
        '.collapsed',
        '[data-state="closed"]',
        'details:not([open])',
        '.accordion-item:not(.expanded)',
        '.dropdown:not(.open)'
      ]
      
      for (const selector of expandables) {
        const elements = document.querySelectorAll(selector)
        for (const element of elements) {
          try {
            if (element instanceof HTMLElement) {
              // Check if this expansion might help find our target
              const targetValue = target.match(/data-tour="([^"]+)"/)?.[1]
              if (targetValue && element.textContent?.toLowerCase().includes(targetValue.toLowerCase())) {
                element.click()
                tourLogger.debug('Expanded relevant section:', selector)
                await new Promise(resolve => setTimeout(resolve, 300))
              }
            } else if (element instanceof HTMLDetailsElement) {
              element.open = true
              await new Promise(resolve => setTimeout(resolve, 100))
            }
          } catch (err) {
            // Ignore errors from clicking
            tourLogger.debug('Failed to expand element:', err)
          }
        }
      }
    }

    try {
      const element = await searchElement()
      
      if (element) {
        setTargetElement(element)
        retryCountRef.current = 0
        
        // Ensure element is in view before positioning
        await tourDOMUtils.ensureElementVisibility(element)
        
        // Additional wait to ensure element is stable and animations complete
        setTimeout(() => {
          calculatePositions(element)
          setIsPositioning(false)
        }, TOUR_CONSTANTS.SMOOTH_SCROLL_DELAY)
      } else {
        const errorMsg = `Tour target not found: ${target}. The element may not exist on this page or may not have the correct data-tour attribute.`
        tourLogger.error(errorMsg)
        setError(errorMsg)
        setIsPositioning(false)
      }
    } catch (err) {
      const errorMsg = `Error finding tour target: ${err}`
      tourLogger.error(errorMsg, err)
      setError(errorMsg)
      setIsPositioning(false)
    }
  }, [target, isActive])

  // Get viewport constraints
  const getViewportConstraints = useCallback(() => {
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const isMobile = viewportWidth <= TOUR_CONSTANTS.MOBILE_BREAKPOINT
    
    return {
      viewportWidth,
      viewportHeight,
      isMobile,
      margin: TOUR_CONSTANTS.VIEWPORT_MARGIN,
      tooltipWidth: Math.min(
        TOUR_CONSTANTS.MAX_TOOLTIP_WIDTH,
        viewportWidth - (TOUR_CONSTANTS.VIEWPORT_MARGIN * 2)
      ),
      maxTooltipHeight: Math.floor(viewportHeight * TOUR_CONSTANTS.MAX_TOOLTIP_HEIGHT_RATIO)
    }
  }, [])

  // Calculate tooltip dimensions
  const calculateTooltipDimensions = useCallback((content: string, constraints: ReturnType<typeof getViewportConstraints>) => {
    const contentLength = content?.length || 0
    const extraContentHeight = Math.min(contentLength / 6, 100)
    
    const calculatedHeight = 
      TOUR_CONSTANTS.HEADER_HEIGHT + 
      TOUR_CONSTANTS.CONTENT_BASE_HEIGHT + 
      extraContentHeight + 
      TOUR_CONSTANTS.BUTTON_HEIGHT

    const tooltipHeight = Math.max(
      TOUR_CONSTANTS.MIN_TOOLTIP_HEIGHT,
      Math.min(calculatedHeight, constraints.maxTooltipHeight)
    )

    const contentAreaHeight = Math.max(
      TOUR_CONSTANTS.CONTENT_BASE_HEIGHT,
      tooltipHeight - 200
    )

    return { tooltipHeight, contentAreaHeight }
  }, [])

  // Handle special cases (dropdowns, etc.)
  const handleSpecialCases = useCallback((element: HTMLElement, elementBounds: ElementBounds) => {
    let skipOverlay = false
    let expandedArea = elementBounds

    // Special handling for demo accounts dropdown
    const openDropdowns = document.querySelectorAll('[data-tour="demo-accounts-list"]:not([style*="display: none"])')
    
    if (openDropdowns.length > 0 && target === '[data-tour="demo-accounts-list"]') {
      const dropdown = openDropdowns[0] as HTMLElement
      const dropdownRect = dropdown.getBoundingClientRect()
      skipOverlay = true
      expandedArea = {
        top: dropdownRect.top,
        left: dropdownRect.left,
        right: dropdownRect.right,
        bottom: dropdownRect.bottom,
        width: dropdownRect.width,
        height: dropdownRect.height
      }
    }

    return { skipOverlay, expandedArea }
  }, [target])

  // Calculate overlay style
  const calculateOverlayStyle = useCallback((expandedArea: ElementBounds, skipOverlay: boolean) => {
    const isDarkMode = document.documentElement.classList.contains('dark')
    const theme = isDarkMode ? TOUR_THEMES.dark : TOUR_THEMES.light
    
    const overlayColor = skipOverlay 
      ? theme.dropdownOverlayColor
      : theme.overlayColor

    const overlayStyle: React.CSSProperties = {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: overlayColor,
      zIndex: skipOverlay ? TOUR_CONSTANTS.DROPDOWN_INTERACTION_Z_INDEX : TOUR_CONSTANTS.OVERLAY_Z_INDEX,
      pointerEvents: skipOverlay ? 'none' : 'auto',
      transition: `background-color ${TOUR_CONSTANTS.FADE_DURATION}ms ease-in-out`
    }

    if (!skipOverlay) {
      const padding = 8
      overlayStyle.clipPath = `polygon(
        0% 0%, 
        0% 100%, 
        ${expandedArea.left - padding}px 100%, 
        ${expandedArea.left - padding}px ${expandedArea.top - padding}px, 
        ${expandedArea.right + padding}px ${expandedArea.top - padding}px, 
        ${expandedArea.right + padding}px ${expandedArea.bottom + padding}px, 
        ${expandedArea.left - padding}px ${expandedArea.bottom + padding}px, 
        ${expandedArea.left - padding}px 100%, 
        100% 100%, 
        100% 0%
      )`
    }

    return overlayStyle
  }, [])

  // Smart tooltip positioning
  const calculateTooltipPosition = useCallback((
    elementBounds: ElementBounds,
    placement: TourPlacement,
    constraints: ReturnType<typeof getViewportConstraints>,
    tooltipHeight: number,
    skipOverlay: boolean
  ) => {
    const { viewportWidth, viewportHeight, isMobile, margin, tooltipWidth } = constraints

    let tooltipStyle: React.CSSProperties = {
      position: 'fixed',
      zIndex: skipOverlay ? TOUR_CONSTANTS.TOOLTIP_Z_INDEX : TOUR_CONSTANTS.TOOLTIP_Z_INDEX,
      width: `${tooltipWidth}px`,
      minWidth: `${Math.min(TOUR_CONSTANTS.MIN_TOOLTIP_WIDTH, viewportWidth - 2 * margin)}px`,
      height: `${tooltipHeight}px`,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      transition: `all ${TOUR_CONSTANTS.SLIDE_DURATION}ms ease-out`,
      opacity: 1,
      transform: 'scale(1)',
    }

    if (placement === 'center') {
      tooltipStyle.top = '50%'
      tooltipStyle.left = '50%'
      tooltipStyle.transform = 'translate(-50%, -50%) scale(1)'
      return tooltipStyle
    }

    // Smart positioning logic
    let finalPlacement = placement
    let top = 0
    let left = 0

    // Handle special dropdown positioning
    if (target === '[data-tour="demo-accounts-list"]' && !isMobile) {
      // Desktop: intelligent positioning to avoid covering dropdown
      left = elementBounds.left - tooltipWidth - margin
      top = elementBounds.top
      
      // If not enough space on left, try right
      if (left < margin) {
        left = elementBounds.right + margin
        
        // If still not enough space, position above/below
        if (left + tooltipWidth > viewportWidth - margin) {
          left = Math.max(margin, viewportWidth - tooltipWidth - margin)
          top = elementBounds.top - tooltipHeight - margin
          
          if (top < margin) {
            top = elementBounds.bottom + margin
            if (top + tooltipHeight > viewportHeight - margin) {
              top = Math.max(margin, viewportHeight - tooltipHeight - margin)
            }
          }
        }
      }
    } else {
      // Standard positioning logic
      switch (placement) {
        case 'top':
          top = elementBounds.top - tooltipHeight - margin
          left = elementBounds.left + elementBounds.width / 2 - tooltipWidth / 2
          if (top < margin) {
            finalPlacement = 'bottom'
            top = elementBounds.bottom + margin
          }
          break
        case 'bottom':
          top = elementBounds.bottom + margin
          left = elementBounds.left + elementBounds.width / 2 - tooltipWidth / 2
          if (top + tooltipHeight > viewportHeight - margin) {
            finalPlacement = 'top'
            top = elementBounds.top - tooltipHeight - margin
          }
          break
        case 'left':
          top = elementBounds.top + elementBounds.height / 2 - tooltipHeight / 2
          left = elementBounds.left - tooltipWidth - margin
          if (left < margin) {
            finalPlacement = 'right'
            left = elementBounds.right + margin
          }
          break
        case 'right':
          top = elementBounds.top + elementBounds.height / 2 - tooltipHeight / 2
          left = elementBounds.right + margin
          if (left + tooltipWidth > viewportWidth - margin) {
            finalPlacement = 'left'
            left = elementBounds.left - tooltipWidth - margin
          }
          break
      }

      // Ensure tooltip stays within viewport bounds
      left = Math.max(margin, Math.min(left, viewportWidth - tooltipWidth - margin))
      top = Math.max(margin, Math.min(top, viewportHeight - tooltipHeight - margin))
    }

    // Mobile optimizations
    if (isMobile) {
      if (elementBounds.top < viewportHeight / 2) {
        // Element in upper half - position tooltip at bottom
        top = viewportHeight - tooltipHeight - margin - 80
        left = margin
        tooltipStyle.width = `${viewportWidth - 2 * margin}px`
      } else {
        // Element in lower half - position tooltip at top
        top = margin + 60
        left = margin
        tooltipStyle.width = `${viewportWidth - 2 * margin}px`
      }
    }

    tooltipStyle.top = `${top}px`
    tooltipStyle.left = `${left}px`

    return tooltipStyle
  }, [target])

  // Main position calculation function
  const calculatePositions = useCallback((element: HTMLElement) => {
    try {
      const rect = element.getBoundingClientRect()
      const elementBounds: ElementBounds = {
        top: rect.top,
        left: rect.left,
        right: rect.right,
        bottom: rect.bottom,
        width: rect.width,
        height: rect.height
      }

      const constraints = getViewportConstraints()
      const { skipOverlay, expandedArea } = handleSpecialCases(element, elementBounds)
      
      // Calculate tooltip dimensions (using current step content if available)
      const stepContent = document.querySelector('[data-tour-content]')?.textContent || ''
      const { tooltipHeight, contentAreaHeight } = calculateTooltipDimensions(stepContent, constraints)

      const overlayStyle = calculateOverlayStyle(expandedArea, skipOverlay)
      const tooltipStyle = calculateTooltipPosition(
        expandedArea,
        placement,
        constraints,
        tooltipHeight,
        skipOverlay
      )

      setPositions({
        overlayStyle,
        tooltipStyle,
        contentAreaHeight
      })

    } catch (err) {
      console.error('Error calculating tour positions:', err)
      // Fallback to center positioning
      setPositions({
        overlayStyle: {
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: TOUR_CONSTANTS.OVERLAY_Z_INDEX
        },
        tooltipStyle: {
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: TOUR_CONSTANTS.TOOLTIP_Z_INDEX
        },
        contentAreaHeight: TOUR_CONSTANTS.CONTENT_BASE_HEIGHT
      })
    }
  }, [placement, getViewportConstraints, handleSpecialCases, calculateTooltipDimensions, calculateOverlayStyle, calculateTooltipPosition])

  // Debounced position recalculation
  const debouncedCalculatePositions = useCallback(() => {
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current)
    }
    
    resizeTimeoutRef.current = setTimeout(() => {
      if (targetElement) {
        calculatePositions(targetElement)
      }
    }, TOUR_CONSTANTS.POSITION_DEBOUNCE_DELAY)
  }, [targetElement, calculatePositions])

  // Set up observers and event listeners
  useEffect(() => {
    if (!isActive) return

    findTargetElement()

    const handleResize = () => {
      debouncedCalculatePositions()
    }

    const handleVisibilityChange = () => {
      if (!document.hidden && targetElement) {
        debouncedCalculatePositions()
      }
    }

    window.addEventListener('resize', handleResize)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current)
      }
    }
  }, [target, isActive, findTargetElement, debouncedCalculatePositions])

  // Set up MutationObserver for better performance
  useEffect(() => {
    if (!targetElement || !isActive) return

    // Optimize observer scope
    const observeTarget = targetElement.closest('[data-tour-container]') || 
                          targetElement.parentElement || 
                          document.body

    observerRef.current = new MutationObserver((mutations) => {
      const shouldUpdate = mutations.some(mutation => {
        // Only update for relevant changes
        return (
          mutation.type === 'attributes' &&
          (mutation.attributeName === 'class' || 
           mutation.attributeName === 'style' || 
           mutation.attributeName === 'data-state')
        ) || (
          mutation.type === 'childList' &&
          (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0)
        )
      })

      if (shouldUpdate && document.contains(targetElement)) {
        debouncedCalculatePositions()
      }
    })

    observerRef.current.observe(observeTarget, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style', 'data-state']
    })

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [targetElement, isActive, debouncedCalculatePositions])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current)
      }
    }
  }, [])

  return {
    positions,
    targetElement,
    isPositioning,
    error,
    recalculatePositions: () => {
      if (targetElement) {
        calculatePositions(targetElement)
      }
    }
  }
} 
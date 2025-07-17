/**
 * @fileoverview Main Project Layout component
 * @module ProjectLayout
 * @version 1.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Main layout component that provides the overall structure for the project
 * control center, including header, sidebar, content area, and footer.
 *
 * @example
 * ```tsx
 * <ProjectLayout userRole="project-manager" projectData={projectData}>
 *   <YourPageContent />
 * </ProjectLayout>
 * ```
 */

"use client"

import React, { useEffect } from "react"
import { cn } from "@/lib/utils"
import { useLayout } from "../../hooks/useLayout"
import { ProjectLayoutProps } from "../../types/layout"
import { LAYOUT_CSS_VARIABLES, Z_INDEX_SCALE } from "../../constants/layout"
import ProjectHeader from "./ProjectHeader"
import ProjectSidebar from "./ProjectSidebar"
import ProjectContent from "./ProjectContent"
import ProjectFooter from "./ProjectFooter"

/**
 * Main project layout component
 *
 * @param {ProjectLayoutProps} props - Layout component props
 * @returns {React.ReactElement} Layout component
 */
export function ProjectLayout({
  children,
  navigation,
  userRole,
  projectData,
  layoutConfig,
  className,
  style,
}: ProjectLayoutProps) {
  const { state, actions, responsive, utils } = useLayout()
  const { config, animation } = state

  // Apply layout CSS variables
  useEffect(() => {
    const root = document.documentElement

    root.style.setProperty(LAYOUT_CSS_VARIABLES.HEADER_HEIGHT, `${config.header.height}px`)
    root.style.setProperty(LAYOUT_CSS_VARIABLES.SIDEBAR_WIDTH, `${config.sidebar.width}px`)
    root.style.setProperty(LAYOUT_CSS_VARIABLES.CONTENT_PADDING, `${config.content.padding}px`)
    root.style.setProperty(LAYOUT_CSS_VARIABLES.FOOTER_HEIGHT, `${config.footer.height}px`)
    root.style.setProperty(LAYOUT_CSS_VARIABLES.ANIMATION_DURATION, `${animation.duration}ms`)
  }, [config, animation])

  // Handle layout overflow
  useEffect(() => {
    if (utils.wouldOverflow(config)) {
      // Adjust sidebar width if layout would overflow
      const optimalWidth = utils.getOptimalSidebarWidth()
      actions.resizeSidebar(optimalWidth)
    }
  }, [config, utils, actions, state.responsive.width])

  // Layout class names
  const layoutClasses = cn(
    "hb-project-layout",
    "min-h-screen",
    "flex",
    "flex-col",
    "transition-all",
    "duration-300",
    "ease-in-out",
    "overflow-hidden", // CRITICAL: Prevent overflow
    animation.isAnimating && "overflow-hidden",
    animation.isAnimating && animation.animationType === "view-mode-change" && "animate-pulse",
    className
  )

  // Content area classes
  const contentAreaClasses = cn(
    "flex",
    "flex-1",
    "relative",
    "overflow-hidden",
    "min-w-0", // CRITICAL: Allow flex items to shrink
    "max-w-full", // CRITICAL: Prevent overflow
    !animation.isAnimating && "transition-all duration-300 ease-in-out"
  )

  // Main content classes
  const mainContentClasses = cn(
    "flex-1",
    "flex",
    "flex-col",
    "w-full",
    "max-w-full",
    "overflow-hidden",
    "min-w-0", // CRITICAL: Allow flex items to shrink
    "transition-all",
    "duration-300",
    "ease-in-out",
    (!config.sidebar.visible || config.sidebar.state === "overlay") && "ml-0",
    config.sidebar.visible && config.sidebar.state !== "overlay" && `ml-[${config.sidebar.width}px]`
  )

  // Overlay classes for mobile sidebar
  const overlayClasses = cn(
    "fixed",
    "inset-0",
    "bg-black/50",
    "backdrop-blur-sm",
    "transition-opacity",
    "duration-300",
    "z-20",
    (!config.sidebar.visible || config.sidebar.state !== "overlay") && "opacity-0 pointer-events-none",
    config.sidebar.visible && config.sidebar.state === "overlay" && "opacity-100"
  )

  // Handle overlay click to close mobile sidebar
  const handleOverlayClick = () => {
    if (config.sidebar.state === "overlay") {
      actions.toggleSidebar()
    }
  }

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Toggle sidebar with Alt + S
      if (event.altKey && event.key === "s") {
        event.preventDefault()
        actions.toggleSidebar()
      }

      // Escape key to close overlay sidebar
      if (event.key === "Escape" && config.sidebar.state === "overlay" && config.sidebar.visible) {
        actions.toggleSidebar()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [actions, config.sidebar.state, config.sidebar.visible])

  return (
    <div
      className={layoutClasses}
      style={
        {
          ...style,
          "--header-height": `${config.header.height}px`,
          "--sidebar-width": `${config.sidebar.width}px`,
          "--content-padding": `${config.content.padding}px`,
          "--footer-height": `${config.footer.height}px`,
          width: "100%", // CRITICAL: Constrain width
          maxWidth: "100%", // CRITICAL: Prevent overflow
        } as React.CSSProperties
      }
    >
      {/* Content area with sidebar */}
      <div className={contentAreaClasses}>
        {/* Main content area */}
        <div className={mainContentClasses}>
          {/* Project content */}
          <div className="flex-1 overflow-hidden min-w-0 max-w-full">{children}</div>
        </div>

        {/* Overlay for mobile sidebar */}
        <div className={overlayClasses} onClick={handleOverlayClick} />
      </div>
    </div>
  )
}

export default ProjectLayout

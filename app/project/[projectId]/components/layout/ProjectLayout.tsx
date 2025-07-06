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
    !animation.isAnimating && "transition-all duration-300 ease-in-out"
  )

  // Main content classes
  const mainContentClasses = cn(
    "flex-1",
    "flex",
    "flex-col",
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
        } as React.CSSProperties
      }
    >
      {/* Header removed - using main app header instead */}
      {/* <ProjectHeader
        config={config.header}
        navigation={navigation}
        user={
          userRole
            ? {
                name: "Current User",
                role: userRole,
                avatar: undefined,
              }
            : undefined
        }
        project={
          projectData
            ? {
                name: projectData.name || "Project Name",
                id: String(projectData.id || "unknown"),
                stage: projectData.stage || "in-progress",
              }
            : undefined
        }
        onAction={(actionId) => {
          console.log("Header action:", actionId)
        }}
        onSearch={(query) => {
          console.log("Search query:", query)
        }}
        className="z-30"
      /> */}

      {/* Content area with sidebar */}
      <div className={contentAreaClasses}>
        {/* Sidebar removed - using main app sidebar instead */}
        {/* <ProjectSidebar
          config={config.sidebar}
          navigation={navigation}
          userRole={userRole}
          onStateChange={(newState) => {
            actions.setSidebarState(newState)
          }}
          onQuickAction={(actionId) => {
            console.log("Quick action:", actionId)
          }}
          className={cn(
            "z-20",
            config.sidebar.state === "overlay" && "fixed",
            config.sidebar.state !== "overlay" && "relative"
          )}
        /> */}

        {/* Mobile overlay */}
        {/* <div className={overlayClasses} onClick={handleOverlayClick} aria-hidden="true" /> */}

        {/* Main content */}
        <div className="flex-1 flex flex-col">
          <ProjectContent
            config={config.content}
            navigation={navigation}
            userRole={userRole}
            projectData={projectData}
            loading={animation.isAnimating}
            className="flex-1"
          >
            {children}
          </ProjectContent>

          {/* Footer */}
          {config.footer.visible && <ProjectFooter config={config.footer} className="z-10" />}
        </div>
      </div>

      {/* Skip links for accessibility */}
      <div className="sr-only">
        <a
          href="#main-content"
          className="fixed top-4 left-4 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md focus:not-sr-only focus:absolute"
        >
          Skip to main content
        </a>
        <a
          href="#sidebar-navigation"
          className="fixed top-4 left-4 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md focus:not-sr-only focus:absolute"
        >
          Skip to navigation
        </a>
      </div>

      {/* Layout debug info (development only) */}
      {process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-4 right-4 z-50 bg-black/80 text-white text-xs p-2 rounded-md font-mono">
          <div>Breakpoint: {state.responsive.breakpoint}</div>
          <div>View Mode: {config.viewMode}</div>
          <div>Sidebar: {config.sidebar.state}</div>
          <div>
            Screen: {state.responsive.width}x{state.responsive.height}
          </div>
          {animation.isAnimating && <div>Animation: {animation.animationType}</div>}
        </div>
      )}
    </div>
  )
}

export default ProjectLayout

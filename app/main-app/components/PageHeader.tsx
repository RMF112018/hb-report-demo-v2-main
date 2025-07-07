/**
 * @fileoverview Consistent Page Header Component
 * @module PageHeader
 * @version 3.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Provides consistent page header across all modules with:
 * - Left: Breadcrumb, Module Title, Sub-head
 * - Right: HB Logo, Dynamic badges and buttons
 * - Full width: Tab navigation
 */

"use client"

import React from "react"
import { Button } from "../../../components/ui/button"
import { Badge } from "../../../components/ui/badge"
import { ChevronRight } from "lucide-react"
import Image from "next/image"

export interface PageHeaderTab {
  id: string
  label: string
  disabled?: boolean
}

export interface PageHeaderButton {
  id: string
  label: string
  variant?: "default" | "outline" | "secondary" | "destructive" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  icon?: React.ComponentType<{ className?: string }>
  onClick?: () => void
  disabled?: boolean
}

export interface PageHeaderBadge {
  id: string
  label: string
  variant?: "default" | "secondary" | "destructive" | "outline"
  count?: number
}

export interface PageHeaderProps {
  // User information
  userName: string

  // Module information
  moduleTitle: string
  subHead?: string

  // Navigation tabs
  tabs?: PageHeaderTab[]
  activeTab?: string
  onTabChange?: (tabId: string) => void

  // Dynamic content
  badges?: PageHeaderBadge[]
  buttons?: PageHeaderButton[]

  // Additional props
  className?: string
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  userName,
  moduleTitle,
  subHead,
  tabs = [],
  activeTab,
  onTabChange,
  badges = [],
  buttons = [],
  className = "",
}) => {
  // Capitalize first letter of each word
  const capitalizeTitle = (title: string) => {
    return title.replace(/\b\w/g, (l) => l.toUpperCase())
  }

  // Format user name properly
  const formatUserName = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")
  }

  return (
    <div className={`bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 ${className}`}>
      {/* Header Content */}
      <div className="px-6 py-4">
        <div className="flex items-start justify-between">
          {/* Left Section */}
          <div className="flex flex-col space-y-1">
            {/* Row 1: Breadcrumb */}
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">{formatUserName(userName)}</span>
              <ChevronRight className="h-4 w-4 mx-1.5" />
              <span>{capitalizeTitle(moduleTitle)}</span>
            </div>

            {/* Row 2: Module Title */}
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{capitalizeTitle(moduleTitle)}</h1>

            {/* Row 3: Sub-head */}
            {subHead && <p className="text-sm text-gray-600 dark:text-gray-400">{subHead}</p>}
          </div>

          {/* Right Section */}
          <div className="flex flex-col items-end space-y-2">
            {/* Row 1: HB Logo */}
            <div className="flex items-center">
              <Image
                src="/images/HB_Logo_Large.png"
                alt="Hedrick Brothers Construction"
                width={180}
                height={60}
                className="object-contain"
                priority
              />
            </div>

            {/* Row 2: Dynamic badges and buttons */}
            <div className="flex items-center gap-2">
              {/* Badges */}
              {badges.map((badge) => (
                <Badge key={badge.id} variant={badge.variant || "default"} className="text-xs px-2 py-1">
                  {badge.label}
                  {badge.count !== undefined && <span className="ml-1 font-semibold">({badge.count})</span>}
                </Badge>
              ))}

              {/* Buttons */}
              {buttons.map((button) => {
                const Icon = button.icon
                return (
                  <Button
                    key={button.id}
                    variant={button.variant || "outline"}
                    size={button.size || "sm"}
                    onClick={button.onClick}
                    disabled={button.disabled}
                    className="text-xs h-7 px-2"
                  >
                    {Icon && <Icon className="h-3 w-3 mr-1" />}
                    {button.label}
                  </Button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation - Full Width - Executive Dashboard Style */}
      {tabs.length > 0 && (
        <div className="px-6 pb-0">
          <div className="flex items-center gap-1 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange?.(tab.id)}
                disabled={tab.disabled}
                className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "text-primary border-primary bg-primary/5"
                    : "text-muted-foreground border-transparent hover:text-foreground hover:border-muted-foreground/50"
                } ${tab.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

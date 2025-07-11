"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ProjectLinkButtonProps {
  projectId: string
  onNavigate: (id: string) => void
  tooltip?: string
  variant?: "default" | "outline" | "ghost" | "link" | "destructive" | "secondary"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  children?: React.ReactNode
}

const ProjectLinkButton: React.FC<ProjectLinkButtonProps> = ({
  projectId,
  onNavigate,
  tooltip = "Open project",
  variant = "outline",
  size = "sm",
  className = "",
  children,
}) => {
  const handleClick = () => {
    onNavigate(projectId)
  }

  const buttonContent = (
    <Button variant={variant} size={size} onClick={handleClick} className={className} title={tooltip}>
      {children || <ChevronRight className="h-4 w-4" />}
    </Button>
  )

  // If tooltip is provided, wrap in tooltip component
  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{buttonContent}</TooltipTrigger>
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return buttonContent
}

export default ProjectLinkButton

"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Play,
  Pause,
  RefreshCw,
  Download,
  Share2,
  Filter,
  Maximize2,
  Minimize2,
  Settings,
  BarChart3,
  TrendingUp,
  Users,
  Calendar,
  Clock,
  Zap,
  Shield,
  Database,
  AlertCircle,
  CheckCircle,
  Activity,
} from "lucide-react"

interface PowerBIControlBarProps {
  userRole?: string
  onFocusToggle?: () => void
  isFocusMode?: boolean
  className?: string
}

interface ProjectFilter {
  id: string
  name: string
  status: "active" | "completed" | "on-hold"
  value: number
}

interface ITSystemFilter {
  id: string
  name: string
  status: "operational" | "warning" | "critical"
  uptime: number
}

export default function PowerBIControlBar({
  userRole = "executive",
  onFocusToggle,
  isFocusMode = false,
  className = "",
}: PowerBIControlBarProps) {
  const [isLiveDataEnabled, setIsLiveDataEnabled] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedProject, setSelectedProject] = useState<string>("all")
  const [selectedITSystem, setSelectedITSystem] = useState<string>("all")
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())
  const [dataQuality, setDataQuality] = useState<"excellent" | "good" | "fair">("excellent")
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "reconnecting" | "offline">("connected")

  // Role-based project data
  const getProjectsForRole = (): ProjectFilter[] => {
    switch (userRole) {
      case "executive":
        return [
          { id: "all", name: "All Projects (20)", status: "active", value: 850000000 },
          { id: "medical-center", name: "Medical Center East", status: "active", value: 125000000 },
          { id: "tech-campus", name: "Tech Campus Phase 2", status: "active", value: 98000000 },
          { id: "marina-bay", name: "Marina Bay Plaza", status: "active", value: 87000000 },
          { id: "tropical-world", name: "Tropical World Nursery", status: "active", value: 57000000 },
        ]
      case "project-executive":
        return [
          { id: "all", name: "Portfolio (6)", status: "active", value: 285000000 },
          { id: "medical-center", name: "Medical Center East", status: "active", value: 125000000 },
          { id: "tech-campus", name: "Tech Campus Phase 2", status: "active", value: 98000000 },
          { id: "marina-bay", name: "Marina Bay Plaza", status: "active", value: 87000000 },
          { id: "tropical-world", name: "Tropical World Nursery", status: "active", value: 57000000 },
        ]
      case "project-manager":
        return [{ id: "tropical-world", name: "Tropical World Nursery", status: "active", value: 57000000 }]
      default:
        return [{ id: "all", name: "All Projects", status: "active", value: 850000000 }]
    }
  }

  const projects = getProjectsForRole()

  // Role-based IT system data for admin users
  const getITSystemsForAdmin = (): ITSystemFilter[] => {
    return [
      { id: "all", name: "All Systems", status: "operational", uptime: 99.8 },
      { id: "infrastructure", name: "Infrastructure", status: "operational", uptime: 99.9 },
      { id: "security", name: "Security & Compliance", status: "operational", uptime: 99.7 },
      { id: "backup", name: "Backup & Recovery", status: "operational", uptime: 99.5 },
      { id: "email", name: "Email Security", status: "warning", uptime: 98.2 },
      { id: "network", name: "Network & Connectivity", status: "operational", uptime: 99.9 },
      { id: "assets", name: "Asset Management", status: "operational", uptime: 99.6 },
      { id: "siem", name: "SIEM & Monitoring", status: "operational", uptime: 99.8 },
      { id: "access", name: "User Access Management", status: "operational", uptime: 99.4 },
      { id: "ai", name: "AI/ML Pipeline", status: "operational", uptime: 97.3 },
    ]
  }

  const itSystems = getITSystemsForAdmin()

  // Auto-refresh when live data is enabled
  useEffect(() => {
    if (isLiveDataEnabled) {
      const interval = setInterval(() => {
        setLastRefresh(new Date())
        // Simulate data quality fluctuations
        const qualities: Array<"excellent" | "good" | "fair"> = ["excellent", "good", "fair"]
        setDataQuality(qualities[Math.floor(Math.random() * qualities.length)])
      }, 15000) // 15 seconds

      return () => clearInterval(interval)
    }
  }, [isLiveDataEnabled])

  // Handle manual refresh
  const handleRefresh = async () => {
    setIsRefreshing(true)
    setConnectionStatus("reconnecting")

    // Simulate refresh delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsRefreshing(false)
    setConnectionStatus("connected")
    setLastRefresh(new Date())
    setDataQuality("excellent")
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Format time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  // Get connection status color
  const getConnectionColor = () => {
    switch (connectionStatus) {
      case "connected":
        return "text-green-600"
      case "reconnecting":
        return "text-yellow-600"
      case "offline":
        return "text-red-600"
    }
  }

  // Get connection status icon
  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case "connected":
        return <CheckCircle className="h-4 w-4" />
      case "reconnecting":
        return <Activity className="h-4 w-4 animate-spin" />
      case "offline":
        return <AlertCircle className="h-4 w-4" />
    }
  }

  return (
    <TooltipProvider>
      <Card
        className={`border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 ${className}`}
      >
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left Section - Power BI Branding & Status */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-orange-600" />
                <span className="font-semibold text-foreground">Power BI</span>
              </div>
              <Badge variant="secondary" className="bg-orange-50 text-orange-700 border-orange-200">
                Embedded
              </Badge>
            </div>

            {/* Connection Status */}
            <div className="flex items-center gap-1">
              <div className={`flex items-center gap-1 ${getConnectionColor()}`}>
                {getConnectionIcon()}
                <span className="text-xs font-medium">
                  {connectionStatus === "connected"
                    ? "Connected"
                    : connectionStatus === "reconnecting"
                    ? "Reconnecting..."
                    : "Offline"}
                </span>
              </div>
              {connectionStatus === "connected" && (
                <span className="text-xs text-muted-foreground">• Premium Capacity (P1)</span>
              )}
            </div>
          </div>

          {/* Center Section - Controls */}
          <div className="flex items-center gap-3">
            {/* Conditional Filter - Project Filter for non-admin, IT System Filter for admin */}
            {userRole === "admin" ? (
              /* IT System Filter for Admin */
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <Select value={selectedITSystem} onValueChange={setSelectedITSystem}>
                  <SelectTrigger className="w-48 h-8">
                    <SelectValue placeholder="Select system..." />
                  </SelectTrigger>
                  <SelectContent>
                    {itSystems.map((system) => (
                      <SelectItem key={system.id} value={system.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{system.name}</span>
                          <Badge
                            variant={
                              system.status === "operational"
                                ? "default"
                                : system.status === "warning"
                                ? "secondary"
                                : "destructive"
                            }
                            className="ml-2 text-xs"
                          >
                            {system.status === "operational"
                              ? "Operational"
                              : system.status === "warning"
                              ? "Warning"
                              : "Critical"}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              /* Project Filter for other roles */
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-muted-foreground" />
                <Select value={selectedProject} onValueChange={setSelectedProject}>
                  <SelectTrigger className="w-48 h-8">
                    <SelectValue placeholder="Select project..." />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{project.name}</span>
                          <Badge
                            variant={project.status === "active" ? "default" : "secondary"}
                            className="ml-2 text-xs"
                          >
                            {project.status === "active"
                              ? "Active"
                              : project.status === "completed"
                              ? "Complete"
                              : "On Hold"}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Live Data Toggle */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                {isLiveDataEnabled ? (
                  <Play className="h-5 w-5 text-green-600" />
                ) : (
                  <Pause className="h-5 w-5 text-muted-foreground" />
                )}
                <span className="text-sm font-medium">Live Data</span>
              </div>
              <Switch
                checked={isLiveDataEnabled}
                onCheckedChange={setIsLiveDataEnabled}
                className="data-[state=checked]:bg-green-600"
              />
            </div>

            {/* Refresh Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="h-8 px-3"
                >
                  <RefreshCw className={`h-5 w-5 ${isRefreshing ? "animate-spin" : ""}`} />
                  <span className="ml-2">Refresh</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Last updated: {formatTime(lastRefresh)}</TooltipContent>
            </Tooltip>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-2">
            {/* Data Quality Indicator */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Database className="h-5 w-5 text-muted-foreground" />
                <Badge
                  variant={
                    dataQuality === "excellent" ? "default" : dataQuality === "good" ? "secondary" : "destructive"
                  }
                  className="text-xs"
                >
                  {dataQuality === "excellent" ? "Excellent" : dataQuality === "good" ? "Good" : "Fair"}
                </Badge>
              </div>
              {isLiveDataEnabled && (
                <div className="flex items-center gap-1">
                  <Zap className="h-4 w-4 text-green-600" />
                  <span className="text-xs text-muted-foreground">Streaming</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                    <Download className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Export Report</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Share Dashboard</TooltipContent>
              </Tooltip>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                    <Settings className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Shield className="h-5 w-5 mr-2" />
                    Row-Level Security
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Users className="h-5 w-5 mr-2" />
                    User Access
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Calendar className="h-5 w-5 mr-2" />
                    Schedule Refresh
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Performance Tuning
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Focus Mode Toggle */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={isFocusMode ? "default" : "ghost"}
                    size="sm"
                    onClick={onFocusToggle}
                    className="h-9 w-9 p-0"
                  >
                    {isFocusMode ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{isFocusMode ? "Exit Focus Mode" : "Enter Focus Mode"}</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>

        {/* Bottom Status Bar */}
        <div className="px-4 py-2 bg-muted/50 border-t border-border">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>
                {userRole === "admin" ? "IT Administrator Dashboard" : "Financial Review Dashboard"} •{" "}
                {userRole === "executive"
                  ? "Executive"
                  : userRole === "project-executive"
                  ? "Project Executive"
                  : userRole === "project-manager"
                  ? "Project Manager"
                  : userRole === "admin"
                  ? "System Administrator"
                  : "User"}{" "}
                View
              </span>
              {userRole === "admin" && selectedITSystem !== "all" && (
                <span>
                  • {itSystems.find((s) => s.id === selectedITSystem)?.name} •{" "}
                  {itSystems.find((s) => s.id === selectedITSystem)?.uptime}% uptime
                </span>
              )}
              {userRole !== "admin" && selectedProject !== "all" && (
                <span>
                  • {projects.find((p) => p.id === selectedProject)?.name} •{" "}
                  {formatCurrency(projects.find((p) => p.id === selectedProject)?.value || 0)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-4">
              <span>Updated: {formatTime(lastRefresh)}</span>
              <span>•</span>
              <span>Region: US-East</span>
              <span>•</span>
              <span>Workspace: HB Construction</span>
            </div>
          </div>
        </div>
      </Card>
    </TooltipProvider>
  )
}

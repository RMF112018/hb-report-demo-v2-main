"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Smartphone,
  Wifi,
  WifiOff,
  Camera,
  Mic,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  Download,
  Upload,
  RefreshCw,
  Battery,
  Signal,
  QrCode,
  FileText,
  MessageCircle,
} from "lucide-react"

interface MobileOptimizedExperienceProps {
  project: any
  currentStage: string
  userRole: string
}

interface OfflineAction {
  id: string
  type: "inspection" | "report" | "photo" | "note" | "measurement"
  title: string
  timestamp: Date
  data: any
  synced: boolean
  location?: { lat: number; lng: number }
}

interface MobileWidget {
  id: string
  name: string
  icon: React.ComponentType<any>
  priority: "high" | "medium" | "low"
  category: string
  offline: boolean
}

export const MobileOptimizedExperience = ({ project, currentStage, userRole }: MobileOptimizedExperienceProps) => {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [offlineActions, setOfflineActions] = useState<OfflineAction[]>([])
  const [syncProgress, setSyncProgress] = useState(0)
  const [isSyncing, setIsSyncing] = useState(false)
  const [batteryLevel, setBatteryLevel] = useState(100)
  const [locationEnabled, setLocationEnabled] = useState(false)

  // Simulate mobile device conditions
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Simulate battery level
    const batteryInterval = setInterval(() => {
      setBatteryLevel((prev) => Math.max(20, prev - Math.random() * 2))
    }, 30000)

    // Mock location permission
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => setLocationEnabled(true),
        () => setLocationEnabled(false)
      )
    }

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
      clearInterval(batteryInterval)
    }
  }, [])

  const mobileWidgets: MobileWidget[] = [
    {
      id: "quick-inspection",
      name: "Quick Inspection",
      icon: CheckCircle,
      priority: "high",
      category: "Quality",
      offline: true,
    },
    {
      id: "photo-capture",
      name: "Photo Capture",
      icon: Camera,
      priority: "high",
      category: "Documentation",
      offline: true,
    },
    { id: "voice-note", name: "Voice Note", icon: Mic, priority: "medium", category: "Communication", offline: true },
    { id: "qr-scanner", name: "QR Scanner", icon: QrCode, priority: "high", category: "Tracking", offline: true },
    { id: "location-tag", name: "Location Tag", icon: MapPin, priority: "medium", category: "Tracking", offline: true },
    {
      id: "measurements",
      name: "Measurements",
      icon: FileText,
      priority: "high",
      category: "Documentation",
      offline: true,
    },
    {
      id: "team-chat",
      name: "Team Chat",
      icon: MessageCircle,
      priority: "medium",
      category: "Communication",
      offline: false,
    },
    { id: "sync-data", name: "Sync Data", icon: RefreshCw, priority: "high", category: "System", offline: false },
  ]

  const fieldTasks = [
    {
      id: "1",
      title: "Concrete pour inspection",
      location: "Zone A",
      priority: "high",
      estimated: "15 min",
      status: "pending",
    },
    {
      id: "2",
      title: "Electrical rough-in check",
      location: "Zone B",
      priority: "medium",
      estimated: "20 min",
      status: "pending",
    },
    {
      id: "3",
      title: "HVAC unit installation",
      location: "Zone C",
      priority: "low",
      estimated: "30 min",
      status: "completed",
    },
    {
      id: "4",
      title: "Plumbing pressure test",
      location: "Zone D",
      priority: "high",
      estimated: "25 min",
      status: "in-progress",
    },
  ]

  const handleOfflineAction = (action: Partial<OfflineAction>) => {
    const newAction: OfflineAction = {
      id: Date.now().toString(),
      timestamp: new Date(),
      synced: false,
      ...action,
    } as OfflineAction

    setOfflineActions((prev) => [...prev, newAction])

    // Auto-sync when online
    if (isOnline) {
      syncOfflineActions()
    }
  }

  const syncOfflineActions = async () => {
    if (!isOnline || isSyncing) return

    setIsSyncing(true)
    setSyncProgress(0)

    const unsyncedActions = offlineActions.filter((action) => !action.synced)

    for (let i = 0; i < unsyncedActions.length; i++) {
      // Simulate sync delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      const action = unsyncedActions[i]
      setOfflineActions((prev) => prev.map((a) => (a.id === action.id ? { ...a, synced: true } : a)))

      setSyncProgress(((i + 1) / unsyncedActions.length) * 100)
    }

    setIsSyncing(false)
    setSyncProgress(0)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-blue-600" />
            Mobile Field Interface
          </CardTitle>
          <div className="flex items-center gap-2">
            {isOnline ? <Wifi className="h-4 w-4 text-green-600" /> : <WifiOff className="h-4 w-4 text-red-600" />}
            <Battery className="h-4 w-4" />
            <span className="text-xs">{Math.round(batteryLevel)}%</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Connection Status */}
        <div className="mb-4">
          <Alert className={isOnline ? "border-green-200" : "border-red-200"}>
            <div className="flex items-center gap-2">
              {isOnline ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-red-600" />
              )}
              <AlertDescription>
                {isOnline ? "Connected - Real-time sync enabled" : "Offline - Changes will sync when connected"}
              </AlertDescription>
            </div>
          </Alert>
        </div>

        {/* Offline Actions Sync */}
        {offlineActions.filter((a) => !a.synced).length > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">
                {offlineActions.filter((a) => !a.synced).length} actions to sync
              </span>
              <Button size="sm" onClick={syncOfflineActions} disabled={!isOnline || isSyncing}>
                {isSyncing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              </Button>
            </div>
            {isSyncing && <Progress value={syncProgress} className="h-2" />}
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="tasks">Field Tasks</TabsTrigger>
            <TabsTrigger value="tools">Tools</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">67%</div>
                  <div className="text-xs text-muted-foreground">Progress</div>
                </div>
              </Card>
              <Card className="p-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">94%</div>
                  <div className="text-xs text-muted-foreground">Quality</div>
                </div>
              </Card>
              <Card className="p-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">4</div>
                  <div className="text-xs text-muted-foreground">Open Issues</div>
                </div>
              </Card>
              <Card className="p-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">12</div>
                  <div className="text-xs text-muted-foreground">Team Size</div>
                </div>
              </Card>
            </div>

            {/* Today's Priority */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Today's Priority</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Concrete inspection - Zone A</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Electrical rough-in - Zone B</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <span className="text-sm">Safety meeting - 2:00 PM</span>
                </div>
              </CardContent>
            </Card>

            {/* Weather Alert */}
            <Alert className="border-yellow-200">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription>Rain forecasted for tomorrow. Consider indoor work priorities.</AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-4">
            <div className="space-y-3">
              {fieldTasks.map((task) => (
                <Card key={task.id} className="p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{task.title}</h4>
                      <p className="text-xs text-muted-foreground mb-2">{task.location}</p>
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(task.priority)} variant="secondary">
                          {task.priority}
                        </Badge>
                        <Badge className={getStatusColor(task.status)} variant="secondary">
                          {task.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">{task.estimated}</div>
                      <Button size="sm" variant="outline" className="mt-2">
                        Start
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tools" className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {mobileWidgets.map((widget) => (
                <Card
                  key={widget.id}
                  className={`p-3 cursor-pointer hover:bg-muted/50 ${!widget.offline && !isOnline ? "opacity-50" : ""}`}
                  onClick={() => {
                    if (!widget.offline && !isOnline) return

                    // Simulate tool action
                    handleOfflineAction({
                      type: "inspection",
                      title: `Used ${widget.name}`,
                      data: { tool: widget.name, result: "success" },
                    })
                  }}
                >
                  <div className="text-center">
                    <div className="mb-2 flex justify-center">
                      <widget.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="text-sm font-medium">{widget.name}</div>
                    <div className="text-xs text-muted-foreground">{widget.category}</div>
                    {widget.offline && (
                      <Badge variant="secondary" className="mt-1">
                        <WifiOff className="h-3 w-3 mr-1" />
                        Offline
                      </Badge>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            {/* Voice Commands */}
            <Card className="p-3">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Mic className="h-4 w-4" />
                  Voice Commands
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="text-xs text-muted-foreground">• "Start inspection"</div>
                <div className="text-xs text-muted-foreground">• "Take photo"</div>
                <div className="text-xs text-muted-foreground">• "Log issue"</div>
                <div className="text-xs text-muted-foreground">• "Get directions"</div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

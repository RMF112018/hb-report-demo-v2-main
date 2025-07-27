/**
 * @fileoverview Emergency Locator Component
 * @module EmergencyLocator
 * @version 2.0.0
 * @author HB Development Team
 * @since 2025-01-15
 *
 * Enhanced component for emergency contacts, procedures, location information,
 * and project-specific emergency facilities tracking with geocoding support.
 * Provides quick access to emergency resources and evacuation plans.
 */

"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Input } from "../ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import {
  Phone,
  MapPin,
  AlertTriangle,
  Shield,
  Users,
  Building,
  Truck,
  Heart,
  Eye,
  Download,
  RefreshCw,
  Plus,
  Edit,
  Navigation,
  Clock,
  FileText,
  Map,
  Zap,
  Flame,
  Waves,
  Wind,
  Snowflake,
  Activity,
  Hospital,
  Siren,
  CheckCircle,
  XCircle,
  AlertCircle,
  Timer,
  MapPin as LocationIcon,
  Car,
  UserCheck,
  Calendar,
} from "lucide-react"

interface EmergencyContact {
  id: string
  name: string
  role: string
  department: string
  primaryPhone: string
  secondaryPhone?: string
  email: string
  location: string
  availability: "24/7" | "Business Hours" | "On-Call"
  specialization: string[]
  isActive: boolean
}

interface EmergencyProcedure {
  id: string
  title: string
  type: "Fire" | "Medical" | "Evacuation" | "Chemical" | "Weather" | "Security" | "Natural Disaster"
  priority: "Critical" | "High" | "Medium"
  description: string
  steps: string[]
  contacts: string[]
  equipmentNeeded: string[]
  lastUpdated: string
  version: string
}

interface EmergencyLocation {
  id: string
  name: string
  type: "Assembly Point" | "First Aid Station" | "Equipment Storage" | "Emergency Exit" | "Shelter"
  building: string
  floor: string
  coordinates: string
  capacity?: number
  equipment: string[]
  notes: string
  isActive: boolean
}

interface EmergencyFacility {
  id: string
  name: string
  type: "Hospital" | "Urgent Care" | "Fire Station" | "Police Station" | "Trauma Center"
  address: string
  coordinates: {
    lat: number
    lng: number
  }
  phone: string
  distance: number // in miles
  estimatedTime: number // in minutes
  status: "Open" | "Closed" | "High Capacity" | "Limited Capacity"
  waitTime: number // in minutes
  specialties: string[]
  level: "Level 1" | "Level 2" | "Level 3" | "Level 4" | "Basic" | "Advanced"
  lastUpdated: string
  overrideData?: {
    confirmedBy: string
    confirmedAt: string
    notes?: string
  }
}

interface ProjectAddress {
  street: string
  city: string
  state: string
  zip: string
  coordinates: {
    lat: number
    lng: number
  }
}

interface EmergencyLocatorProps {
  projectId?: string
  projectData?: any
  userRole?: string
  user?: any
}

export const EmergencyLocator: React.FC<EmergencyLocatorProps> = ({
  projectId,
  projectData,
  userRole = "user",
  user,
}) => {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState(projectId ? "facilities" : "contacts")
  const [lastRefreshed, setLastRefreshed] = useState<string>()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [overrideDialogOpen, setOverrideDialogOpen] = useState(false)
  const [selectedFacility, setSelectedFacility] = useState<EmergencyFacility | null>(null)

  useEffect(() => {
    setMounted(true)
    // Set initial last refreshed time
    setLastRefreshed(new Date().toISOString())
  }, [])

  // Mock project address data for geocoding
  const getProjectAddress = (projectId: string | undefined): ProjectAddress | null => {
    if (!projectId) return null

    const mockAddresses: Record<string, ProjectAddress> = {
      prj_001: {
        street: "1234 Main Street",
        city: "New York",
        state: "NY",
        zip: "10001",
        coordinates: { lat: 40.7505, lng: -73.9934 },
      },
      prj_002: {
        street: "5678 Oak Avenue",
        city: "Los Angeles",
        state: "CA",
        zip: "90210",
        coordinates: { lat: 34.0522, lng: -118.2437 },
      },
      prj_003: {
        street: "9012 Industrial Blvd",
        city: "Chicago",
        state: "IL",
        zip: "60601",
        coordinates: { lat: 41.8781, lng: -87.6298 },
      },
      prj_004: {
        street: "3456 Shopping Center Dr",
        city: "Houston",
        state: "TX",
        zip: "77001",
        coordinates: { lat: 29.7604, lng: -95.3698 },
      },
      prj_005: {
        street: "7890 Medical Campus Way",
        city: "Phoenix",
        state: "AZ",
        zip: "85001",
        coordinates: { lat: 33.4484, lng: -112.074 },
      },
    }

    return mockAddresses[projectId] || null
  }

  // Mock emergency facilities data based on project location
  const getEmergencyFacilities = (projectId: string | undefined): EmergencyFacility[] => {
    if (!projectId) return []

    const baseTime = new Date().toISOString()

    const facilitiesData: Record<string, EmergencyFacility[]> = {
      prj_001: [
        {
          id: "ef_001",
          name: "NewYork-Presbyterian Hospital",
          type: "Hospital",
          address: "525 East 68th Street, New York, NY 10065",
          coordinates: { lat: 40.7614, lng: -73.9776 },
          phone: "(212) 746-5454",
          distance: 1.2,
          estimatedTime: 8,
          status: "Open",
          waitTime: 25,
          specialties: ["Emergency Medicine", "Trauma Center", "Cardiology", "Neurology"],
          level: "Level 1",
          lastUpdated: baseTime,
        },
        {
          id: "ef_002",
          name: "CityMD Urgent Care",
          type: "Urgent Care",
          address: "1460 2nd Avenue, New York, NY 10075",
          coordinates: { lat: 40.7736, lng: -73.9566 },
          phone: "(212) 249-8100",
          distance: 0.8,
          estimatedTime: 5,
          status: "Open",
          waitTime: 15,
          specialties: ["Urgent Care", "Minor Injuries", "X-Ray", "Lab Services"],
          level: "Basic",
          lastUpdated: baseTime,
        },
        {
          id: "ef_003",
          name: "FDNY Engine 8/Ladder 2",
          type: "Fire Station",
          address: "165 E 51st St, New York, NY 10022",
          coordinates: { lat: 40.7589, lng: -73.9709 },
          phone: "(212) 570-4820",
          distance: 0.3,
          estimatedTime: 2,
          status: "Open",
          waitTime: 0,
          specialties: ["Fire Suppression", "EMS", "Rescue Operations", "Hazmat"],
          level: "Advanced",
          lastUpdated: baseTime,
        },
        {
          id: "ef_004",
          name: "Mount Sinai Hospital",
          type: "Hospital",
          address: "1 Gustave L. Levy Pl, New York, NY 10029",
          coordinates: { lat: 40.7904, lng: -73.9509 },
          phone: "(212) 241-6500",
          distance: 2.8,
          estimatedTime: 18,
          status: "High Capacity",
          waitTime: 45,
          specialties: ["Emergency Medicine", "Trauma Center", "Pediatrics", "Surgery"],
          level: "Level 1",
          lastUpdated: baseTime,
          overrideData: {
            confirmedBy: "Sarah Johnson",
            confirmedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            notes: "Confirmed high capacity due to flu season surge",
          },
        },
      ],
      prj_002: [
        {
          id: "ef_005",
          name: "Cedars-Sinai Medical Center",
          type: "Hospital",
          address: "8700 Beverly Blvd, Los Angeles, CA 90048",
          coordinates: { lat: 34.0759, lng: -118.3843 },
          phone: "(310) 423-3277",
          distance: 2.1,
          estimatedTime: 12,
          status: "Open",
          waitTime: 30,
          specialties: ["Emergency Medicine", "Trauma Center", "Cardiology", "Oncology"],
          level: "Level 1",
          lastUpdated: baseTime,
        },
        {
          id: "ef_006",
          name: "UCLA Medical Center",
          type: "Hospital",
          address: "757 Westwood Plaza, Los Angeles, CA 90095",
          coordinates: { lat: 34.0689, lng: -118.4473 },
          phone: "(310) 825-9111",
          distance: 1.8,
          estimatedTime: 10,
          status: "Limited Capacity",
          waitTime: 50,
          specialties: ["Emergency Medicine", "Trauma Center", "Neurosurgery", "Pediatrics"],
          level: "Level 1",
          lastUpdated: baseTime,
        },
        {
          id: "ef_007",
          name: "LAFD Station 18",
          type: "Fire Station",
          address: "4029 Crenshaw Blvd, Los Angeles, CA 90008",
          coordinates: { lat: 34.0147, lng: -118.335 },
          phone: "(213) 485-6185",
          distance: 0.9,
          estimatedTime: 4,
          status: "Open",
          waitTime: 0,
          specialties: ["Fire Suppression", "EMS", "Rescue Operations", "Urban Search"],
          level: "Advanced",
          lastUpdated: baseTime,
        },
      ],
      // Add more projects as needed
      prj_003: [
        {
          id: "ef_008",
          name: "Northwestern Memorial Hospital",
          type: "Hospital",
          address: "251 E Huron St, Chicago, IL 60611",
          coordinates: { lat: 41.8953, lng: -87.6211 },
          phone: "(312) 926-2000",
          distance: 1.5,
          estimatedTime: 9,
          status: "Open",
          waitTime: 35,
          specialties: ["Emergency Medicine", "Trauma Center", "Cardiology", "Neurology"],
          level: "Level 1",
          lastUpdated: baseTime,
        },
      ],
    }

    return facilitiesData[projectId] || []
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setLastRefreshed(new Date().toISOString())
    setIsRefreshing(false)
  }

  const handleOverride = (facility: EmergencyFacility) => {
    setSelectedFacility(facility)
    setOverrideDialogOpen(true)
  }

  const handleConfirmOverride = (notes: string) => {
    if (selectedFacility) {
      // In a real implementation, this would update the facility data
      console.log("Override confirmed for", selectedFacility.name, "with notes:", notes)
    }
    setOverrideDialogOpen(false)
    setSelectedFacility(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-green-100 text-green-800 border-green-200"
      case "Closed":
        return "bg-red-100 text-red-800 border-red-200"
      case "High Capacity":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "Limited Capacity":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Open":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "Closed":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "High Capacity":
        return <AlertCircle className="h-4 w-4 text-orange-600" />
      case "Limited Capacity":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const getFacilityIcon = (type: string) => {
    switch (type) {
      case "Hospital":
        return <Hospital className="h-5 w-5 text-red-600" />
      case "Urgent Care":
        return <Heart className="h-5 w-5 text-blue-600" />
      case "Fire Station":
        return <Flame className="h-5 w-5 text-orange-600" />
      case "Police Station":
        return <Shield className="h-5 w-5 text-blue-800" />
      case "Trauma Center":
        return <Siren className="h-5 w-5 text-red-800" />
      default:
        return <Building className="h-5 w-5" />
    }
  }

  const getWaitTimeColor = (waitTime: number) => {
    if (waitTime <= 15) return "text-green-600"
    if (waitTime <= 30) return "text-yellow-600"
    return "text-red-600"
  }

  const canUserOverride = () => {
    return (
      userRole === "admin" ||
      userRole === "project-manager" ||
      (user && user.specialization && user.specialization.includes("Safety"))
    )
  }

  const formatLastUpdated = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${Math.floor(diffInHours)} hours ago`
    return `${Math.floor(diffInHours / 24)} days ago`
  }

  const shouldShowRefreshWarning = () => {
    if (!lastRefreshed) return false
    const date = new Date(lastRefreshed)
    const now = new Date()
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60)
    return diffInHours >= 24
  }

  const renderEmergencyFacilitiesTab = () => {
    const projectAddress = getProjectAddress(projectId)
    const facilities = getEmergencyFacilities(projectId)

    if (!projectAddress || facilities.length === 0) {
      return (
        <div className="space-y-6">
          <Card>
            <CardContent className="p-8 text-center">
              <Hospital className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Emergency Facilities Data</h3>
              <p className="text-muted-foreground">
                Emergency facilities data is not available for this project location.
              </p>
            </CardContent>
          </Card>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        {/* Project Location & Status */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <LocationIcon className="h-5 w-5" />
                  Project Location & Emergency Facilities
                </CardTitle>
                <CardDescription>
                  Nearest emergency facilities for {projectData?.name || "this project"}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {shouldShowRefreshWarning() && (
                  <Badge variant="destructive" className="text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    Stale Data
                  </Badge>
                )}
                <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                  {isRefreshing ? "Refreshing..." : "Refresh"}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="text-sm font-medium">Project Address:</span>
                <p className="text-sm text-muted-foreground">
                  {projectAddress.street}
                  <br />
                  {projectAddress.city}, {projectAddress.state} {projectAddress.zip}
                </p>
              </div>
              <div className="space-y-2">
                <span className="text-sm font-medium">Last Updated:</span>
                <p className="text-sm text-muted-foreground">
                  {formatLastUpdated(lastRefreshed || new Date().toISOString())}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Facilities Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Facilities</p>
                  <p className="text-2xl font-bold text-blue-600">{facilities.length}</p>
                </div>
                <Building className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Hospitals</p>
                  <p className="text-2xl font-bold text-red-600">
                    {facilities.filter((f) => f.type === "Hospital").length}
                  </p>
                </div>
                <Hospital className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Avg Wait Time</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {Math.round(facilities.reduce((sum, f) => sum + f.waitTime, 0) / facilities.length)}m
                  </p>
                </div>
                <Timer className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Nearest Facility</p>
                  <p className="text-2xl font-bold text-green-600">
                    {Math.min(...facilities.map((f) => f.distance))}mi
                  </p>
                </div>
                <Car className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Facilities List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hospital className="h-5 w-5" />
              Emergency Facilities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {facilities.map((facility) => (
                <div key={facility.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        {getFacilityIcon(facility.type)}
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">{facility.name}</h4>
                          <p className="text-sm text-muted-foreground">{facility.type}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={getStatusColor(facility.status)}>
                            {getStatusIcon(facility.status)}
                            <span className="ml-1">{facility.status}</span>
                          </Badge>
                          {facility.level && (
                            <Badge variant="secondary" className="text-xs">
                              {facility.level}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-4">
                        <div>
                          <span className="text-muted-foreground">Distance:</span>
                          <p className="font-medium">{facility.distance} miles</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Est. Time:</span>
                          <p className="font-medium">{facility.estimatedTime} min</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Wait Time:</span>
                          <p className={`font-medium ${getWaitTimeColor(facility.waitTime)}`}>
                            {facility.waitTime} min
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Phone:</span>
                          <p className="font-medium">{facility.phone}</p>
                        </div>
                      </div>

                      <div className="text-sm mb-3">
                        <span className="text-muted-foreground">Address:</span>
                        <p className="font-medium">{facility.address}</p>
                      </div>

                      <div className="mb-3">
                        <span className="text-sm text-muted-foreground">Specialties:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {facility.specialties.map((specialty, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {facility.overrideData && (
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <UserCheck className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-800">
                              Confirmed by {facility.overrideData.confirmedBy}
                            </span>
                          </div>
                          <p className="text-xs text-blue-700 mb-1">
                            {formatLastUpdated(facility.overrideData.confirmedAt)}
                          </p>
                          {facility.overrideData.notes && (
                            <p className="text-sm text-blue-700">{facility.overrideData.notes}</p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-2 ml-4">
                      <Button variant="outline" size="sm">
                        <Navigation className="h-4 w-4 mr-1" />
                        Directions
                      </Button>
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4 mr-1" />
                        Call
                      </Button>
                      {canUserOverride() && (
                        <Button variant="outline" size="sm" onClick={() => handleOverride(facility)}>
                          <Edit className="h-4 w-4 mr-1" />
                          Override
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Override Dialog */}
        <Dialog open={overrideDialogOpen} onOpenChange={setOverrideDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Override Facility Information</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  Override information for: <strong>{selectedFacility?.name}</strong>
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Confirmation Notes</label>
                <Input
                  placeholder="Enter notes about the facility status..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleConfirmOverride(e.currentTarget.value)
                    }
                  }}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setOverrideDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => handleConfirmOverride("")}>Confirm Override</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  // Mock emergency contacts data
  const emergencyContacts: EmergencyContact[] = [
    {
      id: "EC-001",
      name: "Dr. Sarah Johnson",
      role: "Medical Emergency Coordinator",
      department: "Safety",
      primaryPhone: "(555) 911-0001",
      secondaryPhone: "(555) 911-0002",
      email: "sarah.johnson@company.com",
      location: "Main Office - Building A",
      availability: "24/7",
      specialization: ["First Aid", "CPR", "AED", "Medical Emergency"],
      isActive: true,
    },
    {
      id: "EC-002",
      name: "Mike Wilson",
      role: "Fire Safety Warden",
      department: "Safety",
      primaryPhone: "(555) 911-0003",
      email: "mike.wilson@company.com",
      location: "Site Office - Building B",
      availability: "Business Hours",
      specialization: ["Fire Safety", "Evacuation", "Emergency Response"],
      isActive: true,
    },
    {
      id: "EC-003",
      name: "Lisa Davis",
      role: "Security Coordinator",
      department: "Security",
      primaryPhone: "(555) 911-0004",
      secondaryPhone: "(555) 911-0005",
      email: "lisa.davis@company.com",
      location: "Security Office - Main Gate",
      availability: "24/7",
      specialization: ["Security", "Access Control", "Incident Response"],
      isActive: true,
    },
    {
      id: "EC-004",
      name: "Robert Brown",
      role: "Environmental Safety Officer",
      department: "Environmental",
      primaryPhone: "(555) 911-0006",
      email: "robert.brown@company.com",
      location: "Environmental Office - Building C",
      availability: "On-Call",
      specialization: ["Chemical Spills", "Hazmat", "Environmental Emergency"],
      isActive: true,
    },
    {
      id: "EC-005",
      name: "Jennifer Lee",
      role: "Emergency Response Team Leader",
      department: "Operations",
      primaryPhone: "(555) 911-0007",
      email: "jennifer.lee@company.com",
      location: "Operations Center",
      availability: "24/7",
      specialization: ["Emergency Management", "Coordination", "Communications"],
      isActive: true,
    },
  ]

  // Mock emergency procedures data
  const emergencyProcedures: EmergencyProcedure[] = [
    {
      id: "EP-001",
      title: "Fire Emergency Response",
      type: "Fire",
      priority: "Critical",
      description:
        "Complete fire emergency response procedure including detection, alarm, evacuation, and fire suppression",
      steps: [
        "Immediately activate fire alarm system",
        "Call 911 and report fire location",
        "Notify Fire Safety Warden",
        "Evacuate all personnel to designated assembly points",
        "Account for all personnel using buddy system",
        "Do not re-enter building until cleared by fire department",
      ],
      contacts: ["EC-002", "EC-005"],
      equipmentNeeded: ["Fire extinguishers", "Emergency lighting", "Evacuation chairs"],
      lastUpdated: "2024-01-10",
      version: "2.1",
    },
    {
      id: "EP-002",
      title: "Medical Emergency Response",
      type: "Medical",
      priority: "Critical",
      description: "Medical emergency response for injuries, illness, and life-threatening situations",
      steps: [
        "Assess the situation and ensure scene safety",
        "Call 911 immediately for serious injuries",
        "Provide first aid within your training level",
        "Notify Medical Emergency Coordinator",
        "Clear pathway for emergency responders",
        "Complete incident report documentation",
      ],
      contacts: ["EC-001", "EC-005"],
      equipmentNeeded: ["First aid kit", "AED", "Emergency oxygen", "Stretcher"],
      lastUpdated: "2024-01-08",
      version: "1.9",
    },
    {
      id: "EP-003",
      title: "Chemical Spill Response",
      type: "Chemical",
      priority: "High",
      description: "Response procedures for chemical spills and hazardous material incidents",
      steps: [
        "Evacuate immediate area and restrict access",
        "Identify the chemical using SDS if safely possible",
        "Contact Environmental Safety Officer",
        "Use appropriate spill containment materials",
        "Monitor air quality if ventilation is compromised",
        "Document incident and cleanup procedures",
      ],
      contacts: ["EC-004", "EC-005"],
      equipmentNeeded: ["Spill kit", "PPE", "Air monitoring equipment", "Absorbent materials"],
      lastUpdated: "2024-01-05",
      version: "1.6",
    },
    {
      id: "EP-004",
      title: "Severe Weather Response",
      type: "Weather",
      priority: "High",
      description: "Response procedures for severe weather including high winds, lightning, and tornadoes",
      steps: [
        "Monitor weather alerts and warnings",
        "Secure all loose materials and equipment",
        "Move personnel to designated shelter areas",
        "Avoid windows and exterior walls",
        "Wait for all-clear signal before resuming work",
        "Inspect work areas for damage before re-entry",
      ],
      contacts: ["EC-005", "EC-003"],
      equipmentNeeded: ["Weather radio", "Emergency supplies", "Flashlights", "Backup communications"],
      lastUpdated: "2023-12-20",
      version: "1.4",
    },
  ]

  // Mock emergency locations data
  const emergencyLocations: EmergencyLocation[] = [
    {
      id: "EL-001",
      name: "North Assembly Point",
      type: "Assembly Point",
      building: "Exterior",
      floor: "Ground Level",
      coordinates: "40.7589° N, 73.9851° W",
      capacity: 150,
      equipment: ["Emergency lighting", "PA system", "First aid station"],
      notes: "Primary assembly point for Buildings A, B, and C",
      isActive: true,
    },
    {
      id: "EL-002",
      name: "Main First Aid Station",
      type: "First Aid Station",
      building: "Building A",
      floor: "1st Floor",
      coordinates: "Room 101",
      equipment: ["AED", "First aid supplies", "Emergency oxygen", "Stretcher", "Emergency phone"],
      notes: "Staffed during business hours, accessible 24/7",
      isActive: true,
    },
    {
      id: "EL-003",
      name: "Emergency Equipment Storage",
      type: "Equipment Storage",
      building: "Building B",
      floor: "Basement",
      coordinates: "Room B-05",
      equipment: ["Fire extinguishers", "Spill kits", "Emergency tools", "Backup generators", "Safety equipment"],
      notes: "Secure storage for emergency response equipment",
      isActive: true,
    },
    {
      id: "EL-004",
      name: "South Emergency Exit",
      type: "Emergency Exit",
      building: "Building C",
      floor: "All Floors",
      coordinates: "South Wing",
      equipment: ["Emergency lighting", "Exit signs", "Push bars"],
      notes: "Secondary exit route, keeps clear at all times",
      isActive: true,
    },
    {
      id: "EL-005",
      name: "Weather Shelter Area",
      type: "Shelter",
      building: "Building A",
      floor: "1st Floor",
      coordinates: "Conference Room Complex",
      capacity: 75,
      equipment: ["Weather radio", "Emergency supplies", "Battery backup", "Communications equipment"],
      notes: "Interior shelter for severe weather events",
      isActive: true,
    },
  ]

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "24/7":
        return "bg-green-100 text-green-800 border-green-200"
      case "Business Hours":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "On-Call":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "High":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Fire":
        return <Flame className="h-4 w-4 text-red-600" />
      case "Medical":
        return <Heart className="h-4 w-4 text-red-600" />
      case "Chemical":
        return <Zap className="h-4 w-4 text-yellow-600" />
      case "Weather":
        return <Wind className="h-4 w-4 text-blue-600" />
      case "Security":
        return <Shield className="h-4 w-4 text-purple-600" />
      case "Natural Disaster":
        return <AlertTriangle className="h-4 w-4 text-orange-600" />
      case "Evacuation":
        return <Navigation className="h-4 w-4 text-green-600" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const getLocationIcon = (type: string) => {
    switch (type) {
      case "Assembly Point":
        return <Users className="h-4 w-4 text-blue-600" />
      case "First Aid Station":
        return <Heart className="h-4 w-4 text-red-600" />
      case "Equipment Storage":
        return <Building className="h-4 w-4 text-gray-600" />
      case "Emergency Exit":
        return <Navigation className="h-4 w-4 text-green-600" />
      case "Shelter":
        return <Shield className="h-4 w-4 text-purple-600" />
      default:
        return <MapPin className="h-4 w-4" />
    }
  }

  const renderContactsTab = () => (
    <div className="space-y-6">
      {/* Quick Dial Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 text-center">
            <Phone className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <h3 className="font-bold text-lg text-red-800">911</h3>
            <p className="text-sm text-red-700">Fire, Police, Medical</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4 text-center">
            <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-bold text-lg text-blue-800">Security</h3>
            <p className="text-sm text-blue-700">(555) 911-0004</p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4 text-center">
            <Heart className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-bold text-lg text-green-800">Medical</h3>
            <p className="text-sm text-green-700">(555) 911-0001</p>
          </CardContent>
        </Card>
      </div>

      {/* Emergency Contacts List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Emergency Contacts Directory
            </CardTitle>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Contact
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {emergencyContacts.map((contact) => (
              <div key={contact.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-lg">{contact.name}</h4>
                      <Badge variant="outline" className={getAvailabilityColor(contact.availability)}>
                        {contact.availability}
                      </Badge>
                      {contact.isActive && (
                        <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                          Active
                        </Badge>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground mb-3">
                      {contact.role} • {contact.department}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Primary Phone:</span>
                        <p className="font-medium">{contact.primaryPhone}</p>
                        {contact.secondaryPhone && (
                          <>
                            <span className="text-muted-foreground">Secondary:</span>
                            <p className="font-medium">{contact.secondaryPhone}</p>
                          </>
                        )}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Email:</span>
                        <p className="font-medium">{contact.email}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Location:</span>
                        <p className="font-medium">{contact.location}</p>
                      </div>
                    </div>

                    <div className="mt-3">
                      <span className="text-sm text-muted-foreground">Specializations:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {contact.specialization.map((spec, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="outline" size="sm">
                      <Phone className="h-4 w-4 mr-1" />
                      Call
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderProceduresTab = () => (
    <div className="space-y-6">
      {/* Procedure Categories */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Procedures</p>
                <p className="text-2xl font-bold text-blue-600">{emergencyProcedures.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Critical Priority</p>
                <p className="text-2xl font-bold text-red-600">
                  {emergencyProcedures.filter((proc) => proc.priority === "Critical").length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Fire Procedures</p>
                <p className="text-2xl font-bold text-orange-600">
                  {emergencyProcedures.filter((proc) => proc.type === "Fire").length}
                </p>
              </div>
              <Flame className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Medical Procedures</p>
                <p className="text-2xl font-bold text-green-600">
                  {emergencyProcedures.filter((proc) => proc.type === "Medical").length}
                </p>
              </div>
              <Heart className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Procedures List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Emergency Procedures
            </CardTitle>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Procedure
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {emergencyProcedures.map((procedure) => (
              <div key={procedure.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      {getTypeIcon(procedure.type)}
                      <h4 className="font-semibold text-lg">{procedure.title}</h4>
                      <Badge variant="outline" className={getPriorityColor(procedure.priority)}>
                        {procedure.priority}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        v{procedure.version}
                      </Badge>
                    </div>

                    <p className="text-muted-foreground mb-4">{procedure.description}</p>

                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium">Key Steps:</span>
                        <ol className="list-decimal list-inside mt-1 space-y-1">
                          {procedure.steps.slice(0, 3).map((step, index) => (
                            <li key={index} className="text-sm text-muted-foreground">
                              {step}
                            </li>
                          ))}
                          {procedure.steps.length > 3 && (
                            <li className="text-sm text-blue-600">+ {procedure.steps.length - 3} more steps</li>
                          )}
                        </ol>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Last Updated:</span>
                          <p className="font-medium">{procedure.lastUpdated}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Equipment Needed:</span>
                          <p className="font-medium">{procedure.equipmentNeeded.slice(0, 2).join(", ")}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Primary Contacts:</span>
                          <p className="font-medium">{procedure.contacts.length} assigned</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Export
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderLocationsTab = () => (
    <div className="space-y-6">
      {/* Location Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Locations</p>
                <p className="text-2xl font-bold text-blue-600">{emergencyLocations.length}</p>
              </div>
              <MapPin className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Assembly Points</p>
                <p className="text-2xl font-bold text-green-600">
                  {emergencyLocations.filter((loc) => loc.type === "Assembly Point").length}
                </p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">First Aid Stations</p>
                <p className="text-2xl font-bold text-red-600">
                  {emergencyLocations.filter((loc) => loc.type === "First Aid Station").length}
                </p>
              </div>
              <Heart className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Capacity</p>
                <p className="text-2xl font-bold text-purple-600">
                  {emergencyLocations.reduce((sum, loc) => sum + (loc.capacity || 0), 0)}
                </p>
              </div>
              <Building className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Emergency Locations List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Emergency Locations
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Map className="h-4 w-4 mr-2" />
                View Map
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Location
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {emergencyLocations.map((location) => (
              <div key={location.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      {getLocationIcon(location.type)}
                      <h4 className="font-semibold text-lg">{location.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {location.type}
                      </Badge>
                      {location.isActive && (
                        <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                          Active
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                      <div>
                        <span className="text-muted-foreground">Building:</span>
                        <p className="font-medium">{location.building}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Floor/Location:</span>
                        <p className="font-medium">{location.floor}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Coordinates:</span>
                        <p className="font-medium">{location.coordinates}</p>
                      </div>
                    </div>

                    {location.capacity && (
                      <div className="mb-3">
                        <span className="text-sm text-muted-foreground">Capacity:</span>
                        <span className="font-medium ml-1">{location.capacity} people</span>
                      </div>
                    )}

                    <div className="mb-3">
                      <span className="text-sm text-muted-foreground">Available Equipment:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {location.equipment.map((item, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="text-sm">
                      <span className="text-muted-foreground">Notes:</span>
                      <p className="text-muted-foreground mt-1">{location.notes}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="outline" size="sm">
                      <Navigation className="h-4 w-4 mr-1" />
                      Directions
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Tab configuration - conditionally include facilities tab for project context
  const tabConfig = projectId
    ? [
        { id: "facilities", label: "Emergency Facilities", description: "Nearest emergency facilities" },
        { id: "contacts", label: "Emergency Contacts", description: "Internal emergency contacts" },
        { id: "procedures", label: "Procedures", description: "Emergency procedures" },
        { id: "locations", label: "Locations", description: "Emergency locations" },
      ]
    : [
        { id: "contacts", label: "Emergency Contacts", description: "Internal emergency contacts" },
        { id: "procedures", label: "Procedures", description: "Emergency procedures" },
        { id: "locations", label: "Locations", description: "Emergency locations" },
      ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            {projectId
              ? `Emergency Information - ${projectData?.name || "Project"}`
              : "Emergency Information & Resources"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {projectId
              ? "Project-specific emergency facilities and general emergency resources"
              : "Quick access to emergency contacts, procedures, and location information"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Emergency Guide
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className={`grid w-full grid-cols-${tabConfig.length}`}>
          {tabConfig.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {projectId && (
          <TabsContent value="facilities" className="space-y-4">
            {renderEmergencyFacilitiesTab()}
          </TabsContent>
        )}

        <TabsContent value="contacts" className="space-y-4">
          {renderContactsTab()}
        </TabsContent>
        <TabsContent value="procedures" className="space-y-4">
          {renderProceduresTab()}
        </TabsContent>
        <TabsContent value="locations" className="space-y-4">
          {renderLocationsTab()}
        </TabsContent>
      </Tabs>
    </div>
  )
}

/**
 * @fileoverview Bidders List Component - BuildingConnected Integration
 * @version 3.1.0
 * @description Advanced bidder management with Autodesk/BuildingConnected integration and Compass scoring
 */

"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card"
import { Badge } from "../../../ui/badge"
import { Button } from "../../../ui/button"
import { Input } from "../../../ui/input"
import { Label } from "../../../ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "../../../ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../../ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../ui/select"
import { ScrollArea } from "../../../ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../ui/tabs"
import { Progress } from "../../../ui/progress"
import { useToast } from "../../../ui/use-toast"
import {
  Search,
  Filter,
  Plus,
  UserPlus,
  Star,
  MapPin,
  Building,
  Shield,
  Award,
  TrendingUp,
  TrendingDown,
  Phone,
  Mail,
  Globe,
  Calendar,
  DollarSign,
  Users,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  MoreHorizontal,
  Eye,
  MessageSquare,
  Send,
  X,
  Download,
  ExternalLink,
} from "lucide-react"

interface BiddersListProps {
  projectId: string
  packageId: string
  className?: string
}

// Enhanced bidder interface combining BuildingConnected and Compass data
interface Bidder {
  id: string
  companyName: string
  tradeName?: string
  contactName: string
  email: string
  phone: string
  website?: string
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  // BuildingConnected/Autodesk data
  autodesk: {
    companyId: string
    verified: boolean
    profileCompleteness: number
    memberSince: string
    subscriptionLevel: "basic" | "professional" | "enterprise"
    responseRate: number
    avgResponseTime: number // hours
    projectCount: number
    industries: string[]
    serviceAreas: string[]
    certifications: string[]
    tradeTypes: string[]
  }
  // Compass scoring data
  compass: {
    overallScore: number
    performanceRating: number
    reliabilityScore: number
    qualityScore: number
    safetyScore: number
    financialStability: number
    riskLevel: "low" | "medium" | "high"
    recommendationLevel: "preferred" | "approved" | "conditional" | "not-recommended"
    lastUpdated: string
    projectHistory: number
    onTimeCompletion: number
    budgetAdherence: number
  }
  // Business information
  business: {
    yearsInBusiness: number
    employeeCount: number
    licenseNumber?: string
    bondingCapacity?: string
    insuranceExpiry?: string
    specialties: string[]
    certifications: string[]
    avgProjectSize: number
    capacity: "available" | "limited" | "unavailable"
  }
  // Bid package specific
  bidStatus: "not-invited" | "invited" | "viewed" | "bidding" | "submitted" | "declined" | "no-bid"
  invitedDate?: string
  lastActivity?: string
  submittedBid?: {
    amount: number
    submittedDate: string
    notes?: string
  }
  prequalified: boolean
  notes?: string
}

// Mock bidders data combining BuildingConnected and Compass integration
const mockBidders: Bidder[] = [
  {
    id: "bidder-001",
    companyName: "Apex Construction LLC",
    tradeName: "Apex Concrete Works",
    contactName: "Michael Rodriguez",
    email: "m.rodriguez@apexconstruction.com",
    phone: "(555) 123-4567",
    website: "https://apexconstruction.com",
    address: {
      street: "1234 Industrial Blvd",
      city: "Phoenix",
      state: "AZ",
      zipCode: "85001",
      country: "USA",
    },
    autodesk: {
      companyId: "ad-apex-001",
      verified: true,
      profileCompleteness: 95,
      memberSince: "2019-03-15",
      subscriptionLevel: "professional",
      responseRate: 89,
      avgResponseTime: 4.2,
      projectCount: 127,
      industries: ["Commercial", "Industrial", "Infrastructure"],
      serviceAreas: ["Phoenix Metro", "Tucson", "Flagstaff"],
      certifications: ["OSHA 30", "ACI Certified", "LEED AP"],
      tradeTypes: ["Concrete", "Structural", "Foundations"],
    },
    compass: {
      overallScore: 4.7,
      performanceRating: 4.8,
      reliabilityScore: 4.6,
      qualityScore: 4.9,
      safetyScore: 4.5,
      financialStability: 4.7,
      riskLevel: "low",
      recommendationLevel: "preferred",
      lastUpdated: "2025-01-15",
      projectHistory: 23,
      onTimeCompletion: 94,
      budgetAdherence: 96,
    },
    business: {
      yearsInBusiness: 15,
      employeeCount: 85,
      licenseNumber: "AZ-ROC-123456",
      bondingCapacity: "$5M",
      insuranceExpiry: "2025-06-30",
      specialties: ["Post-Tensioned Concrete", "Tilt-Up Construction", "Mass Concrete"],
      certifications: ["ACI", "NRMCA", "ISO 9001"],
      avgProjectSize: 2500000,
      capacity: "available",
    },
    bidStatus: "invited",
    invitedDate: "2025-01-20",
    lastActivity: "2025-01-25",
    prequalified: true,
    notes: "Preferred contractor for concrete work. Excellent track record.",
  },
  {
    id: "bidder-002",
    companyName: "SteelWorks Fabrication Inc",
    contactName: "Lisa Chen",
    email: "l.chen@steelworksfab.com",
    phone: "(555) 987-6543",
    website: "https://steelworksfab.com",
    address: {
      street: "5678 Manufacturing Way",
      city: "Denver",
      state: "CO",
      zipCode: "80202",
      country: "USA",
    },
    autodesk: {
      companyId: "ad-steel-002",
      verified: true,
      profileCompleteness: 88,
      memberSince: "2020-07-22",
      subscriptionLevel: "enterprise",
      responseRate: 92,
      avgResponseTime: 2.8,
      projectCount: 89,
      industries: ["Commercial", "Industrial", "Healthcare"],
      serviceAreas: ["Denver Metro", "Colorado Springs", "Fort Collins"],
      certifications: ["AWS D1.1", "AISC Certified", "OSHA 30"],
      tradeTypes: ["Structural Steel", "Miscellaneous Metals", "Welding"],
    },
    compass: {
      overallScore: 4.5,
      performanceRating: 4.4,
      reliabilityScore: 4.7,
      qualityScore: 4.6,
      safetyScore: 4.3,
      financialStability: 4.5,
      riskLevel: "low",
      recommendationLevel: "preferred",
      lastUpdated: "2025-01-18",
      projectHistory: 18,
      onTimeCompletion: 91,
      budgetAdherence: 93,
    },
    business: {
      yearsInBusiness: 12,
      employeeCount: 45,
      licenseNumber: "CO-CSL-789012",
      bondingCapacity: "$3M",
      insuranceExpiry: "2025-08-15",
      specialties: ["Heavy Steel", "Ornamental Steel", "Precast Connections"],
      certifications: ["AWS", "AISC", "NSSGA"],
      avgProjectSize: 1800000,
      capacity: "available",
    },
    bidStatus: "viewed",
    invitedDate: "2025-01-18",
    lastActivity: "2025-01-24",
    prequalified: true,
  },
  {
    id: "bidder-003",
    companyName: "Regional Electric Solutions",
    contactName: "David Kim",
    email: "d.kim@regionalelectric.com",
    phone: "(555) 456-7890",
    address: {
      street: "9876 Commerce Dr",
      city: "Austin",
      state: "TX",
      zipCode: "78701",
      country: "USA",
    },
    autodesk: {
      companyId: "ad-electric-003",
      verified: false,
      profileCompleteness: 72,
      memberSince: "2021-11-08",
      subscriptionLevel: "basic",
      responseRate: 76,
      avgResponseTime: 8.5,
      projectCount: 34,
      industries: ["Commercial", "Residential"],
      serviceAreas: ["Austin Metro", "San Antonio"],
      certifications: ["NECA", "OSHA 10"],
      tradeTypes: ["Electrical", "Low Voltage", "Fire Alarm"],
    },
    compass: {
      overallScore: 3.8,
      performanceRating: 3.9,
      reliabilityScore: 3.7,
      qualityScore: 4.0,
      safetyScore: 3.6,
      financialStability: 3.8,
      riskLevel: "medium",
      recommendationLevel: "conditional",
      lastUpdated: "2025-01-10",
      projectHistory: 8,
      onTimeCompletion: 87,
      budgetAdherence: 89,
    },
    business: {
      yearsInBusiness: 8,
      employeeCount: 22,
      licenseNumber: "TX-ELE-345678",
      bondingCapacity: "$1M",
      insuranceExpiry: "2025-04-30",
      specialties: ["Commercial Wiring", "Data Centers", "Solar Integration"],
      certifications: ["NECA", "IBEW"],
      avgProjectSize: 750000,
      capacity: "limited",
    },
    bidStatus: "not-invited",
    prequalified: false,
    notes: "New contractor - requires additional vetting",
  },
  {
    id: "bidder-004",
    companyName: "Premier Plumbing & HVAC",
    contactName: "Sarah Johnson",
    email: "s.johnson@premierplumbing.com",
    phone: "(555) 234-5678",
    website: "https://premierplumbing.com",
    address: {
      street: "4567 Industrial Park",
      city: "Seattle",
      state: "WA",
      zipCode: "98101",
      country: "USA",
    },
    autodesk: {
      companyId: "ad-plumbing-004",
      verified: true,
      profileCompleteness: 91,
      memberSince: "2018-05-12",
      subscriptionLevel: "professional",
      responseRate: 85,
      avgResponseTime: 5.1,
      projectCount: 156,
      industries: ["Commercial", "Healthcare", "Educational"],
      serviceAreas: ["Seattle Metro", "Tacoma", "Everett"],
      certifications: ["OSHA 30", "EPA 608", "NATE Certified"],
      tradeTypes: ["Plumbing", "HVAC", "Mechanical"],
    },
    compass: {
      overallScore: 4.2,
      performanceRating: 4.1,
      reliabilityScore: 4.4,
      qualityScore: 4.3,
      safetyScore: 4.0,
      financialStability: 4.2,
      riskLevel: "low",
      recommendationLevel: "approved",
      lastUpdated: "2025-01-12",
      projectHistory: 31,
      onTimeCompletion: 88,
      budgetAdherence: 91,
    },
    business: {
      yearsInBusiness: 18,
      employeeCount: 67,
      licenseNumber: "WA-PLUMB-456789",
      bondingCapacity: "$4M",
      insuranceExpiry: "2025-09-30",
      specialties: ["Medical Gas", "Radiant Heating", "Boiler Systems"],
      certifications: ["EPA", "NATE", "PHCC"],
      avgProjectSize: 1200000,
      capacity: "available",
    },
    bidStatus: "bidding",
    invitedDate: "2025-01-15",
    lastActivity: "2025-01-26",
    prequalified: true,
    notes: "Strong mechanical contractor with healthcare experience",
  },
  {
    id: "bidder-005",
    companyName: "Mountain View Masonry",
    contactName: "Robert Martinez",
    email: "r.martinez@mvmasonry.com",
    phone: "(555) 345-6789",
    address: {
      street: "7890 Stone Ave",
      city: "Salt Lake City",
      state: "UT",
      zipCode: "84101",
      country: "USA",
    },
    autodesk: {
      companyId: "ad-masonry-005",
      verified: false,
      profileCompleteness: 68,
      memberSince: "2022-01-30",
      subscriptionLevel: "basic",
      responseRate: 71,
      avgResponseTime: 12.3,
      projectCount: 28,
      industries: ["Commercial", "Residential", "Institutional"],
      serviceAreas: ["Salt Lake City", "Ogden", "Provo"],
      certifications: ["OSHA 10", "MCAA Member"],
      tradeTypes: ["Masonry", "Stone Work", "Brick"],
    },
    compass: {
      overallScore: 3.2,
      performanceRating: 3.3,
      reliabilityScore: 3.1,
      qualityScore: 3.5,
      safetyScore: 2.9,
      financialStability: 3.0,
      riskLevel: "high",
      recommendationLevel: "not-recommended",
      lastUpdated: "2025-01-08",
      projectHistory: 5,
      onTimeCompletion: 76,
      budgetAdherence: 82,
    },
    business: {
      yearsInBusiness: 6,
      employeeCount: 15,
      licenseNumber: "UT-MASON-567890",
      bondingCapacity: "$500K",
      insuranceExpiry: "2025-03-15",
      specialties: ["Natural Stone", "Brick Restoration", "Architectural Masonry"],
      certifications: ["MCAA"],
      avgProjectSize: 450000,
      capacity: "limited",
    },
    bidStatus: "declined",
    invitedDate: "2025-01-10",
    lastActivity: "2025-01-12",
    prequalified: false,
    notes: "Declined due to capacity constraints",
  },
  {
    id: "bidder-006",
    companyName: "Precision Roofing Solutions",
    contactName: "Amanda Taylor",
    email: "a.taylor@precisionroofing.com",
    phone: "(555) 456-7890",
    website: "https://precisionroofing.com",
    address: {
      street: "2345 Commerce Blvd",
      city: "Miami",
      state: "FL",
      zipCode: "33101",
      country: "USA",
    },
    autodesk: {
      companyId: "ad-roofing-006",
      verified: true,
      profileCompleteness: 87,
      memberSince: "2019-09-18",
      subscriptionLevel: "professional",
      responseRate: 88,
      avgResponseTime: 3.7,
      projectCount: 94,
      industries: ["Commercial", "Industrial", "Hospitality"],
      serviceAreas: ["Miami-Dade", "Broward", "Palm Beach"],
      certifications: ["OSHA 30", "GAF Master Elite", "NRCA Member"],
      tradeTypes: ["Roofing", "Waterproofing", "Sheet Metal"],
    },
    compass: {
      overallScore: 4.4,
      performanceRating: 4.5,
      reliabilityScore: 4.3,
      qualityScore: 4.6,
      safetyScore: 4.2,
      financialStability: 4.4,
      riskLevel: "low",
      recommendationLevel: "approved",
      lastUpdated: "2025-01-14",
      projectHistory: 19,
      onTimeCompletion: 92,
      budgetAdherence: 94,
    },
    business: {
      yearsInBusiness: 13,
      employeeCount: 38,
      licenseNumber: "FL-ROOF-678901",
      bondingCapacity: "$2.5M",
      insuranceExpiry: "2025-07-31",
      specialties: ["TPO Systems", "Modified Bitumen", "Metal Roofing"],
      certifications: ["GAF", "NRCA", "RCI"],
      avgProjectSize: 980000,
      capacity: "available",
    },
    bidStatus: "submitted",
    invitedDate: "2025-01-12",
    lastActivity: "2025-01-23",
    submittedBid: {
      amount: 875000,
      submittedDate: "2025-01-23",
      notes: "Includes 15-year warranty",
    },
    prequalified: true,
    notes: "Submitted competitive bid with extended warranty",
  },
  {
    id: "bidder-007",
    companyName: "Elite Drywall & Framing",
    contactName: "Carlos Hernandez",
    email: "c.hernandez@elitedrywall.com",
    phone: "(555) 567-8901",
    address: {
      street: "8901 Construction Way",
      city: "Las Vegas",
      state: "NV",
      zipCode: "89101",
      country: "USA",
    },
    autodesk: {
      companyId: "ad-drywall-007",
      verified: true,
      profileCompleteness: 83,
      memberSince: "2020-03-25",
      subscriptionLevel: "basic",
      responseRate: 79,
      avgResponseTime: 6.8,
      projectCount: 67,
      industries: ["Commercial", "Hospitality", "Gaming"],
      serviceAreas: ["Las Vegas", "Henderson", "North Las Vegas"],
      certifications: ["OSHA 30", "AWCI Member"],
      tradeTypes: ["Drywall", "Framing", "Insulation"],
    },
    compass: {
      overallScore: 3.9,
      performanceRating: 4.0,
      reliabilityScore: 3.8,
      qualityScore: 4.1,
      safetyScore: 3.7,
      financialStability: 3.9,
      riskLevel: "medium",
      recommendationLevel: "conditional",
      lastUpdated: "2025-01-16",
      projectHistory: 12,
      onTimeCompletion: 85,
      budgetAdherence: 87,
    },
    business: {
      yearsInBusiness: 9,
      employeeCount: 29,
      licenseNumber: "NV-DRY-789012",
      bondingCapacity: "$1.5M",
      insuranceExpiry: "2025-05-31",
      specialties: ["Acoustic Ceilings", "Fire-rated Assemblies", "Specialty Finishes"],
      certifications: ["AWCI", "USG"],
      avgProjectSize: 650000,
      capacity: "available",
    },
    bidStatus: "no-bid",
    invitedDate: "2025-01-14",
    lastActivity: "2025-01-19",
    prequalified: true,
    notes: "Submitted no-bid due to scheduling conflicts",
  },
  {
    id: "bidder-008",
    companyName: "Pacific Northwest Glazing",
    contactName: "Jennifer Wong",
    email: "j.wong@pnwglazing.com",
    phone: "(555) 678-9012",
    website: "https://pnwglazing.com",
    address: {
      street: "3456 Glass Street",
      city: "Portland",
      state: "OR",
      zipCode: "97201",
      country: "USA",
    },
    autodesk: {
      companyId: "ad-glazing-008",
      verified: true,
      profileCompleteness: 94,
      memberSince: "2017-11-14",
      subscriptionLevel: "enterprise",
      responseRate: 93,
      avgResponseTime: 2.1,
      projectCount: 145,
      industries: ["Commercial", "Healthcare", "Educational", "Government"],
      serviceAreas: ["Portland Metro", "Eugene", "Salem"],
      certifications: ["OSHA 30", "GANA Certified", "IGMA Member"],
      tradeTypes: ["Glazing", "Curtain Wall", "Storefront"],
    },
    compass: {
      overallScore: 4.8,
      performanceRating: 4.9,
      reliabilityScore: 4.8,
      qualityScore: 4.9,
      safetyScore: 4.7,
      financialStability: 4.8,
      riskLevel: "low",
      recommendationLevel: "preferred",
      lastUpdated: "2025-01-20",
      projectHistory: 28,
      onTimeCompletion: 96,
      budgetAdherence: 98,
    },
    business: {
      yearsInBusiness: 22,
      employeeCount: 95,
      licenseNumber: "OR-GLAZ-890123",
      bondingCapacity: "$8M",
      insuranceExpiry: "2025-12-31",
      specialties: ["Structural Glazing", "Historic Restoration", "Custom Facades"],
      certifications: ["GANA", "IGMA", "AAMA"],
      avgProjectSize: 3200000,
      capacity: "available",
    },
    bidStatus: "invited",
    invitedDate: "2025-01-22",
    lastActivity: "2025-01-25",
    prequalified: true,
    notes: "Top-tier glazing contractor with excellent reputation",
  },
]

// Mock BuildingConnected database bidders (not yet added to project)
const mockBuildingConnectedBidders: Bidder[] = [
  {
    id: "bc-001",
    companyName: "ECS Florida, LLC",
    contactName: "John Martinez",
    email: "j.martinez@ecsflorida.com",
    phone: "(941) 555-0123",
    website: "https://ecsflorida.com",
    address: {
      street: "2456 Commerce Way",
      city: "Jacksonville",
      state: "FL",
      zipCode: "32256",
      country: "USA",
    },
    autodesk: {
      companyId: "bc-ecs-001",
      verified: true,
      profileCompleteness: 89,
      memberSince: "2016-08-12",
      subscriptionLevel: "professional",
      responseRate: 82,
      avgResponseTime: 6.2,
      projectCount: 342,
      industries: ["Commercial", "Industrial", "Government"],
      serviceAreas: ["Jacksonville", "Tampa", "Orlando", "Miami"],
      certifications: ["OSHA 30", "ASTM Certified", "ACI Member"],
      tradeTypes: ["Materials Testing", "Geotechnical", "Environmental"],
    },
    compass: {
      overallScore: 4.1,
      performanceRating: 4.0,
      reliabilityScore: 4.2,
      qualityScore: 4.3,
      safetyScore: 3.9,
      financialStability: 4.1,
      riskLevel: "low",
      recommendationLevel: "approved",
      lastUpdated: "2025-01-18",
      projectHistory: 45,
      onTimeCompletion: 89,
      budgetAdherence: 92,
    },
    business: {
      yearsInBusiness: 25,
      employeeCount: 156,
      licenseNumber: "FL-MAT-234567",
      bondingCapacity: "$3M",
      insuranceExpiry: "2025-10-15",
      specialties: ["Concrete Testing", "Soil Analysis", "Structural Testing"],
      certifications: ["ASTM", "ACI", "AASHTO"],
      avgProjectSize: 450000,
      capacity: "available",
    },
    bidStatus: "not-invited",
    prequalified: true,
    notes: "Established materials testing firm with strong Florida presence",
  },
  {
    id: "bc-002",
    companyName: "Pacifica Engineering Services LLC",
    contactName: "David Kim",
    email: "d.kim@pacifica-eng.com",
    phone: "(850) 555-0456",
    website: "https://pacifica-eng.com",
    address: {
      street: "1789 Engineering Drive",
      city: "Fort Myers",
      state: "FL",
      zipCode: "33901",
      country: "USA",
    },
    autodesk: {
      companyId: "bc-pacifica-002",
      verified: true,
      profileCompleteness: 92,
      memberSince: "2018-03-22",
      subscriptionLevel: "enterprise",
      responseRate: 91,
      avgResponseTime: 3.8,
      projectCount: 187,
      industries: ["Commercial", "Infrastructure", "Marine"],
      serviceAreas: ["Fort Myers", "Naples", "Cape Coral"],
      certifications: ["OSHA 30", "PE Licensed", "ASCE Member"],
      tradeTypes: ["Structural Engineering", "Materials Testing", "Inspection"],
    },
    compass: {
      overallScore: 4.6,
      performanceRating: 4.7,
      reliabilityScore: 4.5,
      qualityScore: 4.8,
      safetyScore: 4.4,
      financialStability: 4.6,
      riskLevel: "low",
      recommendationLevel: "preferred",
      lastUpdated: "2025-01-19",
      projectHistory: 32,
      onTimeCompletion: 95,
      budgetAdherence: 97,
    },
    business: {
      yearsInBusiness: 19,
      employeeCount: 78,
      licenseNumber: "FL-ENG-345678",
      bondingCapacity: "$5M",
      insuranceExpiry: "2025-09-30",
      specialties: ["Marine Structures", "Concrete Testing", "Quality Control"],
      certifications: ["PE", "ASCE", "ASTM"],
      avgProjectSize: 875000,
      capacity: "available",
    },
    bidStatus: "not-invited",
    prequalified: true,
    notes: "Specialized in marine and coastal projects",
  },
  {
    id: "bc-003",
    companyName: "H2R Corp",
    contactName: "Ricardo Ruiz",
    email: "r.ruiz@h2rcorp.com",
    phone: "(239) 555-0789",
    address: {
      street: "456 Innovation Blvd",
      city: "North Fort Myers",
      state: "FL",
      zipCode: "33917",
      country: "USA",
    },
    autodesk: {
      companyId: "bc-h2r-003",
      verified: false,
      profileCompleteness: 73,
      memberSince: "2020-06-15",
      subscriptionLevel: "basic",
      responseRate: 68,
      avgResponseTime: 9.1,
      projectCount: 94,
      industries: ["Commercial", "Residential", "Industrial"],
      serviceAreas: ["North Fort Myers", "Cape Coral", "Fort Myers"],
      certifications: ["OSHA 10", "NRMCA Member"],
      tradeTypes: ["Materials Testing", "Quality Assurance", "Lab Services"],
    },
    compass: {
      overallScore: 3.4,
      performanceRating: 3.5,
      reliabilityScore: 3.3,
      qualityScore: 3.6,
      safetyScore: 3.2,
      financialStability: 3.4,
      riskLevel: "medium",
      recommendationLevel: "conditional",
      lastUpdated: "2025-01-11",
      projectHistory: 8,
      onTimeCompletion: 78,
      budgetAdherence: 82,
    },
    business: {
      yearsInBusiness: 12,
      employeeCount: 23,
      licenseNumber: "FL-TEST-456789",
      bondingCapacity: "$1M",
      insuranceExpiry: "2025-06-30",
      specialties: ["Aggregate Testing", "Concrete Analysis", "Field Testing"],
      certifications: ["NRMCA", "CCRL"],
      avgProjectSize: 285000,
      capacity: "limited",
    },
    bidStatus: "not-invited",
    prequalified: false,
    notes: "Smaller local firm with growing capabilities",
  },
  {
    id: "bc-004",
    companyName: "YPC Consulting Group, PL",
    contactName: "Wendy Gallagher",
    email: "w.gallagher@ypc-consulting.com",
    phone: "(239) 555-0321",
    website: "https://ypc-consulting.com",
    address: {
      street: "789 Professional Center",
      city: "Fort Myers",
      state: "FL",
      zipCode: "33901",
      country: "USA",
    },
    autodesk: {
      companyId: "bc-ypc-004",
      verified: true,
      profileCompleteness: 86,
      memberSince: "2019-01-08",
      subscriptionLevel: "professional",
      responseRate: 85,
      avgResponseTime: 4.9,
      projectCount: 125,
      industries: ["Commercial", "Healthcare", "Educational"],
      serviceAreas: ["Fort Myers", "Bonita Springs", "Estero"],
      certifications: ["OSHA 30", "LEED AP", "NCEES Member"],
      tradeTypes: ["Engineering", "Materials Testing", "Project Management"],
    },
    compass: {
      overallScore: 4.0,
      performanceRating: 4.1,
      reliabilityScore: 3.9,
      qualityScore: 4.2,
      safetyScore: 3.8,
      financialStability: 4.0,
      riskLevel: "low",
      recommendationLevel: "approved",
      lastUpdated: "2025-01-17",
      projectHistory: 18,
      onTimeCompletion: 86,
      budgetAdherence: 89,
    },
    business: {
      yearsInBusiness: 14,
      employeeCount: 42,
      licenseNumber: "FL-CONS-567890",
      bondingCapacity: "$2M",
      insuranceExpiry: "2025-08-31",
      specialties: ["Project Consulting", "Quality Control", "Testing Services"],
      certifications: ["LEED", "NCEES", "PMP"],
      avgProjectSize: 520000,
      capacity: "available",
    },
    bidStatus: "not-invited",
    prequalified: true,
    notes: "Full-service consulting group with testing capabilities",
  },
  {
    id: "bc-005",
    companyName: "Intertek-ATI-PSI",
    contactName: "Marcus Mancini",
    email: "m.mancini@intertek.com",
    phone: "(407) 555-0654",
    website: "https://intertek.com",
    address: {
      street: "321 Testing Lane",
      city: "Orlando",
      state: "FL",
      zipCode: "32801",
      country: "USA",
    },
    autodesk: {
      companyId: "bc-intertek-005",
      verified: true,
      profileCompleteness: 97,
      memberSince: "2015-11-03",
      subscriptionLevel: "enterprise",
      responseRate: 94,
      avgResponseTime: 2.1,
      projectCount: 612,
      industries: ["Commercial", "Industrial", "Government", "Infrastructure"],
      serviceAreas: ["Orlando", "Tampa", "Jacksonville", "Miami"],
      certifications: ["OSHA 30", "ISO 17025", "AASHTO Certified"],
      tradeTypes: ["Materials Testing", "Inspection", "Quality Assurance"],
    },
    compass: {
      overallScore: 4.7,
      performanceRating: 4.8,
      reliabilityScore: 4.6,
      qualityScore: 4.9,
      safetyScore: 4.5,
      financialStability: 4.8,
      riskLevel: "low",
      recommendationLevel: "preferred",
      lastUpdated: "2025-01-21",
      projectHistory: 67,
      onTimeCompletion: 97,
      budgetAdherence: 98,
    },
    business: {
      yearsInBusiness: 35,
      employeeCount: 284,
      licenseNumber: "FL-LAB-678901",
      bondingCapacity: "$10M",
      insuranceExpiry: "2025-12-31",
      specialties: ["Laboratory Testing", "Field Inspection", "Quality Systems"],
      certifications: ["ISO 17025", "AASHTO", "ASTM"],
      avgProjectSize: 1200000,
      capacity: "available",
    },
    bidStatus: "not-invited",
    prequalified: true,
    notes: "Global testing leader with extensive Florida operations",
  },
]

const BiddersList: React.FC<BiddersListProps> = ({ projectId, packageId, className = "" }) => {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterRisk, setFilterRisk] = useState<string>("all")
  const [filterRecommendation, setFilterRecommendation] = useState<string>("all")
  const [filterLocation, setFilterLocation] = useState<string>("all")
  const [filterDivision, setFilterDivision] = useState<string>("all")
  const [filterCertification, setFilterCertification] = useState<string>("all")
  const [showAddBidderDialog, setShowAddBidderDialog] = useState(false)
  const [showBidderDetailsDialog, setShowBidderDetailsDialog] = useState(false)
  const [showFilterDialog, setShowFilterDialog] = useState(false)
  const [selectedBidder, setSelectedBidder] = useState<Bidder | null>(null)
  const [sortBy, setSortBy] = useState<string>("compass-score")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  // Add Bidder Modal State
  const [addBidderSearchQuery, setAddBidderSearchQuery] = useState("")
  const [addBidderSelectedTab, setAddBidderSelectedTab] = useState<"search" | "import" | "email">("search")
  const [addBidderTravelLocation, setAddBidderTravelLocation] = useState("1687 Inlet Drive, North Fort Myers, FL")
  const [addBidderWorkPerformed, setAddBidderWorkPerformed] = useState("Materials Testing")
  const [addBidderTags, setAddBidderTags] = useState("")
  const [addBidderUnion, setAddBidderUnion] = useState(false)
  const [addBidderNonUnion, setAddBidderNonUnion] = useState(false)
  const [addBidderPrevailingWages, setAddBidderPrevailingWages] = useState(false)
  const [addBidderDomesticOnly, setAddBidderDomesticOnly] = useState(true)
  const [addBidderEnterpriseType, setAddBidderEnterpriseType] = useState("")
  const [addBidderCertificationType, setAddBidderCertificationType] = useState("")
  const [addBidderCertifyingAgency, setAddBidderCertifyingAgency] = useState("")

  // Filter BuildingConnected bidders for Add Bidder modal
  const filteredBuildingConnectedBidders = useMemo(() => {
    let filtered = mockBuildingConnectedBidders.filter((bidder) => {
      const matchesSearch =
        !addBidderSearchQuery ||
        bidder.companyName.toLowerCase().includes(addBidderSearchQuery.toLowerCase()) ||
        bidder.contactName.toLowerCase().includes(addBidderSearchQuery.toLowerCase()) ||
        bidder.autodesk.tradeTypes.some((trade) => trade.toLowerCase().includes(addBidderSearchQuery.toLowerCase())) ||
        bidder.business.specialties.some((spec) => spec.toLowerCase().includes(addBidderSearchQuery.toLowerCase()))

      const matchesWorkPerformed =
        !addBidderWorkPerformed ||
        bidder.autodesk.tradeTypes.some((trade) => trade.toLowerCase().includes(addBidderWorkPerformed.toLowerCase()))

      const matchesDomestic = !addBidderDomesticOnly || bidder.address.country === "USA"

      const matchesCertificationType =
        !addBidderCertificationType ||
        bidder.autodesk.certifications.some((cert) =>
          cert.toLowerCase().includes(addBidderCertificationType.toLowerCase())
        ) ||
        bidder.business.certifications.some((cert) =>
          cert.toLowerCase().includes(addBidderCertificationType.toLowerCase())
        )

      return matchesSearch && matchesWorkPerformed && matchesDomestic && matchesCertificationType
    })

    // Sort by best match (combining Compass score and response rate)
    filtered.sort((a, b) => {
      const aScore = a.compass.overallScore * 0.7 + (a.autodesk.responseRate / 100) * 0.3
      const bScore = b.compass.overallScore * 0.7 + (b.autodesk.responseRate / 100) * 0.3
      return bScore - aScore
    })

    return filtered
  }, [addBidderSearchQuery, addBidderWorkPerformed, addBidderDomesticOnly, addBidderCertificationType])

  // Get unique values for filter options
  const uniqueDivisions = useMemo(() => {
    const divisions = new Set<string>()
    mockBidders.forEach((bidder) => {
      bidder.autodesk.industries.forEach((industry) => divisions.add(industry))
    })
    return Array.from(divisions).sort()
  }, [])

  const uniqueCertifications = useMemo(() => {
    const certifications = new Set<string>()
    mockBidders.forEach((bidder) => {
      bidder.autodesk.certifications.forEach((cert) => certifications.add(cert))
      bidder.business.certifications.forEach((cert) => certifications.add(cert))
    })
    return Array.from(certifications).sort()
  }, [])

  const uniqueLocations = useMemo(() => {
    const locations = new Set<string>()
    mockBidders.forEach((bidder) => {
      locations.add(bidder.address.state)
    })
    return Array.from(locations).sort()
  }, [])

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      filterStatus !== "all" ||
      filterRisk !== "all" ||
      filterRecommendation !== "all" ||
      filterLocation !== "all" ||
      filterDivision !== "all" ||
      filterCertification !== "all"
    )
  }, [filterStatus, filterRisk, filterRecommendation, filterLocation, filterDivision, filterCertification])

  // Clear all filters
  const clearAllFilters = () => {
    setFilterStatus("all")
    setFilterRisk("all")
    setFilterRecommendation("all")
    setFilterLocation("all")
    setFilterDivision("all")
    setFilterCertification("all")
  }

  // Filter and search bidders
  const filteredBidders = useMemo(() => {
    let filtered = mockBidders.filter((bidder) => {
      const matchesSearch =
        !searchQuery ||
        bidder.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bidder.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bidder.autodesk.tradeTypes.some((trade) => trade.toLowerCase().includes(searchQuery.toLowerCase())) ||
        bidder.business.specialties.some((spec) => spec.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesStatus = filterStatus === "all" || bidder.bidStatus === filterStatus
      const matchesRisk = filterRisk === "all" || bidder.compass.riskLevel === filterRisk
      const matchesRecommendation =
        filterRecommendation === "all" || bidder.compass.recommendationLevel === filterRecommendation
      const matchesLocation = filterLocation === "all" || bidder.address.state === filterLocation
      const matchesDivision = filterDivision === "all" || bidder.autodesk.industries.includes(filterDivision)
      const matchesCertification =
        filterCertification === "all" ||
        bidder.autodesk.certifications.includes(filterCertification) ||
        bidder.business.certifications.includes(filterCertification)

      return (
        matchesSearch &&
        matchesStatus &&
        matchesRisk &&
        matchesRecommendation &&
        matchesLocation &&
        matchesDivision &&
        matchesCertification
      )
    })

    // Sort bidders
    filtered.sort((a, b) => {
      let aValue, bValue

      switch (sortBy) {
        case "compass-score":
          aValue = a.compass.overallScore
          bValue = b.compass.overallScore
          break
        case "company-name":
          aValue = a.companyName
          bValue = b.companyName
          break
        case "response-rate":
          aValue = a.autodesk.responseRate
          bValue = b.autodesk.responseRate
          break
        case "years-business":
          aValue = a.business.yearsInBusiness
          bValue = b.business.yearsInBusiness
          break
        case "project-count":
          aValue = a.autodesk.projectCount
          bValue = b.autodesk.projectCount
          break
        default:
          aValue = a.compass.overallScore
          bValue = b.compass.overallScore
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "desc" ? bValue.localeCompare(aValue) : aValue.localeCompare(bValue)
      } else {
        return sortOrder === "desc" ? (bValue as number) - (aValue as number) : (aValue as number) - (bValue as number)
      }
    })

    return filtered
  }, [
    searchQuery,
    filterStatus,
    filterRisk,
    filterRecommendation,
    filterLocation,
    filterDivision,
    filterCertification,
    sortBy,
    sortOrder,
  ])

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "invited":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200"
      case "viewed":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200"
      case "bidding":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200"
      case "submitted":
        return "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900 dark:text-purple-200"
      case "declined":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200"
      case "no-bid":
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-200"
    }
  }

  // Get risk level color
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "text-green-600"
      case "medium":
        return "text-yellow-600"
      case "high":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  // Get recommendation badge color
  const getRecommendationColor = (level: string) => {
    switch (level) {
      case "preferred":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200"
      case "approved":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200"
      case "conditional":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200"
      case "not-recommended":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-200"
    }
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

  // Handle actions
  const handleInviteBidder = (bidder: Bidder) => {
    toast({
      title: "Bidder Invited",
      description: `${bidder.companyName} has been invited to bid on this package.`,
    })
  }

  const handleRemoveBidder = (bidder: Bidder) => {
    toast({
      title: "Bidder Removed",
      description: `${bidder.companyName} has been removed from this bid package.`,
      variant: "destructive",
    })
  }

  const handleSendMessage = (bidder: Bidder) => {
    toast({
      title: "Message Sent",
      description: `Message sent to ${bidder.companyName}.`,
    })
  }

  const handleViewDetails = (bidder: Bidder) => {
    setSelectedBidder(bidder)
    setShowBidderDetailsDialog(true)
  }

  const handleInviteBidderFromDatabase = (bidder: Bidder) => {
    toast({
      title: "Bidder Invited",
      description: `${bidder.companyName} has been invited to bid on this package from BuildingConnected database.`,
    })
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header and Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Bidders List
                <Badge variant="secondary">{filteredBidders.length} total</Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Search and manage bidders from BuildingConnected database with Compass scoring
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Dialog open={showAddBidderDialog} onOpenChange={setShowAddBidderDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Bidder
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-6xl h-[90vh] flex flex-col overflow-hidden">
                  <DialogHeader className="border-b pb-4">
                    <DialogTitle className="text-lg font-semibold">
                      Invite Bidders: Materials Testing - Safe Harbor Marina - Port Phoenix
                    </DialogTitle>
                    <div className="flex items-center gap-4 mt-2">
                      <Button
                        variant={addBidderSelectedTab === "search" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setAddBidderSelectedTab("search")}
                      >
                        Search
                      </Button>
                      <Button
                        variant={addBidderSelectedTab === "import" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setAddBidderSelectedTab("import")}
                      >
                        Import
                      </Button>
                      <Button
                        variant={addBidderSelectedTab === "email" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setAddBidderSelectedTab("email")}
                      >
                        Email
                      </Button>
                    </div>
                  </DialogHeader>

                  <div className="flex flex-1 gap-6 mt-4 overflow-hidden">
                    {/* Left Sidebar - Filters */}
                    <div className="w-80 shrink-0 flex flex-col">
                      <Card className="flex-1 flex flex-col">
                        <CardHeader className="shrink-0">
                          <CardTitle className="text-base">Filter</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-y-auto">
                          <div className="space-y-4">
                            {/* Willing to travel to */}
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">Willing to travel to:</Label>
                              <Input
                                value={addBidderTravelLocation}
                                onChange={(e) => setAddBidderTravelLocation(e.target.value)}
                                className="text-sm"
                              />
                              <Button variant="link" size="sm" className="p-0 h-auto text-blue-600">
                                Search by office location instead »
                              </Button>
                            </div>

                            {/* Work Performed */}
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">Work Performed</Label>
                              <Select value={addBidderWorkPerformed} onValueChange={setAddBidderWorkPerformed}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Materials Testing">Materials Testing</SelectItem>
                                  <SelectItem value="Structural Engineering">Structural Engineering</SelectItem>
                                  <SelectItem value="Geotechnical">Geotechnical</SelectItem>
                                  <SelectItem value="Environmental">Environmental</SelectItem>
                                  <SelectItem value="Quality Assurance">Quality Assurance</SelectItem>
                                  <SelectItem value="Inspection">Inspection</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Tags */}
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">Tags</Label>
                              <Input
                                value={addBidderTags}
                                onChange={(e) => setAddBidderTags(e.target.value)}
                                placeholder="Add tags..."
                                className="text-sm"
                              />
                            </div>

                            {/* Labor Requirements */}
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">Labor Requirements</Label>
                              <div className="space-y-1">
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    id="union"
                                    checked={addBidderUnion}
                                    onChange={(e) => setAddBidderUnion(e.target.checked)}
                                    className="rounded"
                                  />
                                  <Label htmlFor="union" className="text-sm">
                                    Union
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    id="non-union"
                                    checked={addBidderNonUnion}
                                    onChange={(e) => setAddBidderNonUnion(e.target.checked)}
                                    className="rounded"
                                  />
                                  <Label htmlFor="non-union" className="text-sm">
                                    Non-Union
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    id="prevailing-wages"
                                    checked={addBidderPrevailingWages}
                                    onChange={(e) => setAddBidderPrevailingWages(e.target.checked)}
                                    className="rounded"
                                  />
                                  <Label htmlFor="prevailing-wages" className="text-sm">
                                    Prevailing Wages
                                  </Label>
                                </div>
                              </div>
                            </div>

                            {/* Country */}
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">Country</Label>
                              <div className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  id="domestic-only"
                                  checked={addBidderDomesticOnly}
                                  onChange={(e) => setAddBidderDomesticOnly(e.target.checked)}
                                  className="rounded"
                                />
                                <Label htmlFor="domestic-only" className="text-sm">
                                  Domestic bidders only
                                </Label>
                              </div>
                            </div>

                            {/* Enterprise Type */}
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">Enterprise Type</Label>
                              <Input
                                value={addBidderEnterpriseType}
                                onChange={(e) => setAddBidderEnterpriseType(e.target.value)}
                                placeholder="Enter enterprise type..."
                                className="text-sm"
                              />
                            </div>

                            {/* Certification Type */}
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">Certification Type</Label>
                              <Input
                                value={addBidderCertificationType}
                                onChange={(e) => setAddBidderCertificationType(e.target.value)}
                                placeholder="Enter certification..."
                                className="text-sm"
                              />
                            </div>

                            {/* Certifying Agency */}
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">Certifying Agency</Label>
                              <Input
                                value={addBidderCertifyingAgency}
                                onChange={(e) => setAddBidderCertifyingAgency(e.target.value)}
                                placeholder="Enter agency..."
                                className="text-sm"
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Right Content - Search Results */}
                    <div className="flex-1 flex flex-col overflow-hidden">
                      {/* Search Bar */}
                      <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="Search for companies"
                          value={addBidderSearchQuery}
                          onChange={(e) => setAddBidderSearchQuery(e.target.value)}
                          className="pl-9"
                        />
                      </div>

                      {/* Results Count */}
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-sm">
                          <strong>{filteredBuildingConnectedBidders.length} companies</strong> best match your filters.
                        </span>
                        <Button variant="link" size="sm" className="p-0 h-auto text-blue-600">
                          ⓘ
                        </Button>
                        <div className="ml-auto flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            ✓ Not
                          </Button>
                        </div>
                      </div>

                      {/* Company Results */}
                      <ScrollArea className="flex-1">
                        <div className="space-y-4">
                          {filteredBuildingConnectedBidders.map((bidder) => (
                            <Card key={bidder.id} className="p-4">
                              <div className="flex items-start gap-4">
                                {/* Company Avatar */}
                                <Avatar className="h-12 w-12 shrink-0">
                                  <AvatarImage
                                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${bidder.companyName}`}
                                  />
                                  <AvatarFallback className="bg-blue-100 text-blue-600">
                                    {bidder.companyName
                                      .split(" ")
                                      .map((word) => word[0])
                                      .join("")
                                      .slice(0, 2)}
                                  </AvatarFallback>
                                </Avatar>

                                <div className="flex-1">
                                  {/* Company Header */}
                                  <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-semibold text-blue-600">{bidder.companyName}</h3>
                                        {bidder.autodesk.verified && <CheckCircle className="h-4 w-4 text-blue-500" />}
                                        <Button variant="outline" size="sm" className="h-6 px-2 text-xs">
                                          Prefer
                                        </Button>
                                      </div>
                                      <p className="text-sm text-muted-foreground mb-2">
                                        {bidder.companyName}, {bidder.address.city}, {bidder.address.state}
                                      </p>

                                      {/* Prominent Compass Compliance Data */}
                                      <div className="flex items-center gap-3 mb-2">
                                        {/* Compass Score */}
                                        <div className="flex items-center gap-1">
                                          <Star className="h-4 w-4 text-yellow-500" />
                                          <span className="font-semibold text-lg">{bidder.compass.overallScore}</span>
                                          <span className="text-xs text-muted-foreground">Compass</span>
                                        </div>

                                        {/* Risk Level Badge */}
                                        <Badge
                                          variant="outline"
                                          className={`text-xs ${getRiskColor(bidder.compass.riskLevel)} border-current`}
                                        >
                                          {bidder.compass.riskLevel.toUpperCase()} RISK
                                        </Badge>

                                        {/* Recommendation Badge */}
                                        <Badge
                                          variant="outline"
                                          className={getRecommendationColor(bidder.compass.recommendationLevel)}
                                        >
                                          {bidder.compass.recommendationLevel.toUpperCase().replace("-", " ")}
                                        </Badge>

                                        {/* Response Rate */}
                                        <div className="text-xs text-muted-foreground">
                                          {bidder.autodesk.responseRate}% Response Rate
                                        </div>
                                      </div>
                                    </div>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="bg-green-50 text-green-700 border-green-200 shrink-0"
                                    >
                                      Invited
                                    </Button>
                                  </div>

                                  {/* Enhanced Compass Performance Metrics */}
                                  <div className="grid grid-cols-3 gap-4 mb-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <div className="text-center">
                                      <div className="text-lg font-bold text-green-600">
                                        {bidder.compass.onTimeCompletion}%
                                      </div>
                                      <div className="text-xs text-muted-foreground">On-Time Completion</div>
                                    </div>
                                    <div className="text-center">
                                      <div className="text-lg font-bold text-blue-600">
                                        {bidder.compass.budgetAdherence}%
                                      </div>
                                      <div className="text-xs text-muted-foreground">Budget Adherence</div>
                                    </div>
                                    <div className="text-center">
                                      <div className="text-lg font-bold text-purple-600">
                                        {bidder.compass.safetyScore}
                                      </div>
                                      <div className="text-xs text-muted-foreground">Safety Score</div>
                                    </div>
                                  </div>

                                  {/* Financial & Experience Indicators */}
                                  <div className="flex items-center gap-4 mb-3 text-sm">
                                    <div className="flex items-center gap-1">
                                      <DollarSign className="h-4 w-4 text-green-600" />
                                      <span className="font-medium">
                                        Financial Score: {bidder.compass.financialStability}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Building className="h-4 w-4 text-blue-600" />
                                      <span className="font-medium">{bidder.compass.projectHistory} Projects</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Calendar className="h-4 w-4 text-purple-600" />
                                      <span className="font-medium">{bidder.business.yearsInBusiness} Years</span>
                                    </div>
                                  </div>

                                  {/* Bidding Statistics */}
                                  <div className="text-sm text-muted-foreground mb-3">
                                    Invited {bidder.autodesk.projectCount} times | Submitted{" "}
                                    {Math.floor(bidder.autodesk.projectCount * 0.6)} | Bidding{" "}
                                    {Math.floor(bidder.autodesk.projectCount * 0.2)} | Not Bidding{" "}
                                    {Math.floor(bidder.autodesk.projectCount * 0.2)}
                                  </div>

                                  {/* Best Match Badge & Certifications */}
                                  <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                      {bidder.compass.overallScore >= 4.5 && (
                                        <Badge className="bg-blue-600 text-white hover:bg-blue-700">✓ Best match</Badge>
                                      )}
                                      {bidder.compass.recommendationLevel === "preferred" && (
                                        <Badge className="bg-green-600 text-white hover:bg-green-700">
                                          ⭐ Preferred
                                        </Badge>
                                      )}
                                      {bidder.autodesk.verified && (
                                        <Badge variant="outline" className="text-blue-600 border-blue-600">
                                          Verified
                                        </Badge>
                                      )}
                                    </div>

                                    {/* Key Certifications */}
                                    <div className="flex items-center gap-1">
                                      {bidder.autodesk.certifications.slice(0, 2).map((cert, index) => (
                                        <Badge key={index} variant="secondary" className="text-xs">
                                          {cert}
                                        </Badge>
                                      ))}
                                      {bidder.autodesk.certifications.length > 2 && (
                                        <span className="text-xs text-muted-foreground">
                                          +{bidder.autodesk.certifications.length - 2}
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  {/* Contact Information */}
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <Avatar className="h-6 w-6">
                                          <AvatarFallback className="text-xs bg-gray-200">
                                            {bidder.contactName
                                              .split(" ")
                                              .map((n) => n[0])
                                              .join("")}
                                          </AvatarFallback>
                                        </Avatar>
                                        <div>
                                          <p className="text-sm font-medium">{bidder.contactName}</p>
                                          <p className="text-xs text-muted-foreground">
                                            Primary Contact • {bidder.business.specialties[0] || "Project Manager"}
                                          </p>
                                        </div>
                                      </div>
                                      <Button
                                        size="sm"
                                        className="bg-blue-600 hover:bg-blue-700"
                                        onClick={() => handleInviteBidderFromDatabase(bidder)}
                                      >
                                        Invite
                                      </Button>
                                    </div>

                                    {/* Additional contacts if available */}
                                    {bidder.autodesk.projectCount > 100 && (
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                          <Avatar className="h-6 w-6">
                                            <AvatarFallback className="text-xs bg-gray-200">JD</AvatarFallback>
                                          </Avatar>
                                          <div>
                                            <p className="text-sm font-medium">Jane Doe</p>
                                            <p className="text-xs text-muted-foreground">
                                              Business Development Manager
                                            </p>
                                          </div>
                                        </div>
                                        <Button
                                          size="sm"
                                          className="bg-blue-600 hover:bg-blue-700"
                                          onClick={() => handleInviteBidderFromDatabase(bidder)}
                                        >
                                          Invite
                                        </Button>
                                      </div>
                                    )}

                                    <Button variant="link" size="sm" className="p-0 h-auto text-blue-600">
                                      View all contacts ▼
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Consolidated Search and Filter Bar */}
          <div className="flex items-center gap-3 mt-4">
            {/* Search Bar */}
            <div className="relative flex-1 min-w-[300px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search bidders by name, trade, or specialty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Filter Button */}
            <Dialog open={showFilterDialog} onOpenChange={setShowFilterDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className="relative">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                  {hasActiveFilters && (
                    <Badge variant="destructive" className="ml-2 px-1 py-0 text-xs min-w-[20px] h-5">
                      {
                        [
                          filterStatus,
                          filterRisk,
                          filterRecommendation,
                          filterLocation,
                          filterDivision,
                          filterCertification,
                        ].filter((f) => f !== "all").length
                      }
                    </Badge>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center justify-between">
                    <span>Filter Bidders</span>
                    {hasActiveFilters && (
                      <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                        <X className="h-4 w-4 mr-2" />
                        Clear All
                      </Button>
                    )}
                  </DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Bid Status</Label>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="not-invited">Not Invited</SelectItem>
                        <SelectItem value="invited">Invited</SelectItem>
                        <SelectItem value="viewed">Viewed</SelectItem>
                        <SelectItem value="bidding">Bidding</SelectItem>
                        <SelectItem value="submitted">Submitted</SelectItem>
                        <SelectItem value="declined">Declined</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Risk Level</Label>
                    <Select value={filterRisk} onValueChange={setFilterRisk}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Risk Levels" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Risk Levels</SelectItem>
                        <SelectItem value="low">Low Risk</SelectItem>
                        <SelectItem value="medium">Medium Risk</SelectItem>
                        <SelectItem value="high">High Risk</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Recommendation</Label>
                    <Select value={filterRecommendation} onValueChange={setFilterRecommendation}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Ratings" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Ratings</SelectItem>
                        <SelectItem value="preferred">Preferred</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="conditional">Conditional</SelectItem>
                        <SelectItem value="not-recommended">Not Recommended</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Select value={filterLocation} onValueChange={setFilterLocation}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Locations" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        {uniqueLocations.map((location) => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Division</Label>
                    <Select value={filterDivision} onValueChange={setFilterDivision}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Divisions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Divisions</SelectItem>
                        {uniqueDivisions.map((division) => (
                          <SelectItem key={division} value={division}>
                            {division}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Certifications</Label>
                    <Select value={filterCertification} onValueChange={setFilterCertification}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Certifications" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Certifications</SelectItem>
                        {uniqueCertifications.map((certification) => (
                          <SelectItem key={certification} value={certification}>
                            {certification}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Sort Dropdown */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="compass-score">Compass Score</SelectItem>
                <SelectItem value="company-name">Company Name</SelectItem>
                <SelectItem value="response-rate">Response Rate</SelectItem>
                <SelectItem value="years-business">Years in Business</SelectItem>
                <SelectItem value="project-count">Project Count</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {/* Bidders List */}
      <div className="grid gap-4">
        {filteredBidders.map((bidder) => (
          <Card key={bidder.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                {/* Company Avatar */}
                <Avatar className="h-12 w-12">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${bidder.companyName}`} />
                  <AvatarFallback>
                    {bidder.companyName
                      .split(" ")
                      .map((word) => word[0])
                      .join("")
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>

                {/* Main Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        {bidder.companyName}
                        {bidder.autodesk.verified && <CheckCircle className="inline h-4 w-4 ml-2 text-blue-500" />}
                      </h3>
                      {bidder.tradeName && <p className="text-sm text-muted-foreground">DBA: {bidder.tradeName}</p>}
                      <p className="text-sm text-muted-foreground">
                        Contact: {bidder.contactName} • {bidder.email}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getStatusBadgeColor(bidder.bidStatus)}>
                        {bidder.bidStatus.replace("-", " ")}
                      </Badge>
                      <Badge variant="outline" className={getRecommendationColor(bidder.compass.recommendationLevel)}>
                        {bidder.compass.recommendationLevel.replace("-", " ")}
                      </Badge>
                    </div>
                  </div>

                  {/* Key Metrics Row */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-lg font-bold text-foreground">{bidder.compass.overallScore}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Compass Score</p>
                    </div>

                    <div className="text-center">
                      <div className="text-lg font-bold text-foreground mb-1">{bidder.autodesk.responseRate}%</div>
                      <p className="text-xs text-muted-foreground">Response Rate</p>
                    </div>

                    <div className="text-center">
                      <div className="text-lg font-bold text-foreground mb-1">{bidder.autodesk.projectCount}</div>
                      <p className="text-xs text-muted-foreground">Projects</p>
                    </div>

                    <div className="text-center">
                      <div className="text-lg font-bold text-foreground mb-1">{bidder.business.yearsInBusiness}</div>
                      <p className="text-xs text-muted-foreground">Years</p>
                    </div>

                    <div className="text-center">
                      <div className={`text-lg font-bold mb-1 ${getRiskColor(bidder.compass.riskLevel)}`}>
                        {bidder.compass.riskLevel.toUpperCase()}
                      </div>
                      <p className="text-xs text-muted-foreground">Risk</p>
                    </div>
                  </div>

                  {/* Trade Types and Location */}
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {bidder.address.city}, {bidder.address.state}
                    </span>
                    <span className="text-muted-foreground">•</span>
                    {bidder.autodesk.tradeTypes.slice(0, 3).map((trade, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {trade}
                      </Badge>
                    ))}
                    {bidder.autodesk.tradeTypes.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{bidder.autodesk.tradeTypes.length - 3} more
                      </Badge>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    {bidder.bidStatus === "not-invited" ? (
                      <Button size="sm" onClick={() => handleInviteBidder(bidder)}>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Invite to Bid
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => handleRemoveBidder(bidder)}>
                        <X className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    )}

                    <Button size="sm" variant="outline" onClick={() => handleSendMessage(bidder)}>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Message
                    </Button>

                    <Button size="sm" variant="outline" onClick={() => handleViewDetails(bidder)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>

                    {bidder.website && (
                      <Button size="sm" variant="outline" asChild>
                        <a href={bidder.website} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Website
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredBidders.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No bidders found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or add bidders from the BuildingConnected database.
            </p>
            <Button onClick={() => setShowAddBidderDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Bidders
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Bidder Details Dialog */}
      {selectedBidder && (
        <Dialog open={showBidderDetailsDialog} onOpenChange={setShowBidderDetailsDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedBidder.companyName}
                {selectedBidder.autodesk.verified && <CheckCircle className="h-5 w-5 text-blue-500" />}
              </DialogTitle>
            </DialogHeader>

            <BidderDetailsContent bidder={selectedBidder} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

// Bidder Details Component (similar to TradePartnerScorecard)
const BidderDetailsContent: React.FC<{ bidder: Bidder }> = ({ bidder }) => {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="performance">Performance</TabsTrigger>
        <TabsTrigger value="business">Business Info</TabsTrigger>
        <TabsTrigger value="autodesk">BuildingConnected</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Compass Scores */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Compass Scoring
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Overall Score", value: bidder.compass.overallScore, max: 5 },
                { label: "Performance", value: bidder.compass.performanceRating, max: 5 },
                { label: "Reliability", value: bidder.compass.reliabilityScore, max: 5 },
                { label: "Quality", value: bidder.compass.qualityScore, max: 5 },
                { label: "Safety", value: bidder.compass.safetyScore, max: 5 },
                { label: "Financial", value: bidder.compass.financialStability, max: 5 },
              ].map((metric) => (
                <div key={metric.label} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{metric.label}</span>
                    <span className="font-medium">
                      {metric.value}/{metric.max}
                    </span>
                  </div>
                  <Progress value={(metric.value / metric.max) * 100} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{bidder.contactName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{bidder.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{bidder.phone}</span>
              </div>
              {bidder.website && (
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={bidder.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {bidder.website}
                  </a>
                </div>
              )}
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>
                  {bidder.address.street}, {bidder.address.city}, {bidder.address.state} {bidder.address.zipCode}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="performance" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">On-Time Completion</span>
                <span className="font-medium">{bidder.compass.onTimeCompletion}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Budget Adherence</span>
                <span className="font-medium">{bidder.compass.budgetAdherence}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Project History</span>
                <span className="font-medium">{bidder.compass.projectHistory} projects</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Risk Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div
                  className={`text-2xl font-bold mb-2 ${
                    bidder.compass.riskLevel === "low"
                      ? "text-green-600"
                      : bidder.compass.riskLevel === "medium"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {bidder.compass.riskLevel.toUpperCase()}
                </div>
                <p className="text-sm text-muted-foreground">Risk Level</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recommendation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <Badge className={getRecommendationColor(bidder.compass.recommendationLevel)}>
                  {bidder.compass.recommendationLevel.replace("-", " ").toUpperCase()}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="business" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Business Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Years in Business</span>
                <span className="font-medium">{bidder.business.yearsInBusiness}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Employee Count</span>
                <span className="font-medium">{bidder.business.employeeCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Average Project Size</span>
                <span className="font-medium">{formatCurrency(bidder.business.avgProjectSize)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Current Capacity</span>
                <Badge
                  variant={
                    bidder.business.capacity === "available"
                      ? "default"
                      : bidder.business.capacity === "limited"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {bidder.business.capacity}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Licenses & Insurance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {bidder.business.licenseNumber && (
                <div className="flex justify-between">
                  <span className="text-sm">License Number</span>
                  <span className="font-medium">{bidder.business.licenseNumber}</span>
                </div>
              )}
              {bidder.business.bondingCapacity && (
                <div className="flex justify-between">
                  <span className="text-sm">Bonding Capacity</span>
                  <span className="font-medium">{bidder.business.bondingCapacity}</span>
                </div>
              )}
              {bidder.business.insuranceExpiry && (
                <div className="flex justify-between">
                  <span className="text-sm">Insurance Expiry</span>
                  <span className="font-medium">{bidder.business.insuranceExpiry}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Specialties & Certifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Specialties</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {bidder.business.specialties.map((specialty, index) => (
                  <Badge key={index} variant="secondary">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">Certifications</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {bidder.business.certifications.map((cert, index) => (
                  <Badge key={index} variant="outline">
                    {cert}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="autodesk" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                BuildingConnected Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Profile Completeness</span>
                <span className="font-medium">{bidder.autodesk.profileCompleteness}%</span>
              </div>
              <Progress value={bidder.autodesk.profileCompleteness} className="h-2" />
              <div className="flex justify-between">
                <span className="text-sm">Member Since</span>
                <span className="font-medium">{new Date(bidder.autodesk.memberSince).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Subscription Level</span>
                <Badge variant="outline">{bidder.autodesk.subscriptionLevel}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Verified Status</span>
                <div className="flex items-center gap-1">
                  {bidder.autodesk.verified ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-green-600">Verified</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      <span className="text-yellow-600">Unverified</span>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Platform Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Response Rate</span>
                <span className="font-medium">{bidder.autodesk.responseRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Avg Response Time</span>
                <span className="font-medium">{bidder.autodesk.avgResponseTime}h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Platform Projects</span>
                <span className="font-medium">{bidder.autodesk.projectCount}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Service Areas & Trade Types</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Service Areas</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {bidder.autodesk.serviceAreas.map((area, index) => (
                  <Badge key={index} variant="secondary">
                    {area}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">Trade Types</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {bidder.autodesk.tradeTypes.map((trade, index) => (
                  <Badge key={index} variant="outline">
                    {trade}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">Industries</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {bidder.autodesk.industries.map((industry, index) => (
                  <Badge key={index} variant="secondary">
                    {industry}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )

  function getRecommendationColor(level: string) {
    switch (level) {
      case "preferred":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200"
      case "approved":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200"
      case "conditional":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200"
      case "not-recommended":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-200"
    }
  }

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }
}

export default BiddersList

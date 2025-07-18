"use client"

import React, { useState, useCallback, useMemo } from "react"
import HrPayrollLayout from "@/components/layouts/HrPayrollLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProtectedGrid, ProtectedColDef, GridRow, createGridWithTotalsAndSticky } from "@/components/ui/protected-grid"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import CulturalFitEvaluation from "@/components/hr-payroll/CulturalFitEvaluation"
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  Eye,
  MoreHorizontal,
  Users,
  Building2,
  MapPin,
  Calendar,
  Mail,
  Phone,
  FileText,
  Link,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  Clock,
  UserPlus,
  Settings,
  Filter,
  RefreshCw,
  Share2,
  Globe,
  Linkedin,
  Briefcase,
  Send,
  MessageSquare,
  Star,
  Award,
  TrendingUp,
  DollarSign,
  EyeOff,
  Copy,
  ExternalLinkIcon,
} from "lucide-react"
import { format } from "date-fns"

// Job posting interface
interface JobPosting {
  id: string
  title: string
  description: string
  location: string
  department: string
  salaryMin: number
  salaryMax: number
  status: "Open" | "Closed" | "Draft"
  applications: number
  postedDate: string
  jobUrl: string
  distributedTo: string[]
  targetDiscProfiles?: string[]
  targetIntegrusTypes?: string[]
  culturalFitCriteria?: {
    leadershipOriented: boolean
    resultsDriven: boolean
    teamCollaboration: boolean
    detailOriented: boolean
    processFocused: boolean
  }
  priorityWeight?: number
}

// Applicant interface
interface Applicant {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  jobId: string
  jobTitle: string
  status: "Applied" | "Interview" | "Offer" | "Hired" | "Rejected"
  appliedDate: string
  resume: string
  notes: string
  reviewer: string
  avatar?: string
  discProfile?: {
    type: string
    primaryStyle: string
    secondaryStyle: string
    summary: string
    strengths: string[]
    growthAreas: string[]
  }
  integrus360?: {
    leadershipType: string
    color: string
    profile: {
      type: string
      description: string
      leadershipStrengths: string[]
      developmentAreas: string[]
    }
  }
  culturalFitScore?: number
  teamCompatibility?: {
    overallScore: number
    compatibilityNotes: string
    recommendations: string[]
  }
}

// Form data interfaces
interface JobFormData {
  title: string
  description: string
  location: string
  department: string
  salaryMin: number
  salaryMax: number
  requirements: string
  benefits: string
  targetDiscProfiles: string[]
  targetIntegrusTypes: string[]
  culturalFitCriteria: {
    leadershipOriented: boolean
    resultsDriven: boolean
    teamCollaboration: boolean
    detailOriented: boolean
    processFocused: boolean
  }
  priorityWeight: number
}

interface ApplicantFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  jobId: string
  resume: string
  coverLetter: string
  notes: string
}

export default function RecruitingPage() {
  const [activeTab, setActiveTab] = useState("open-positions")
  const [showCulturalFit, setShowCulturalFit] = useState(false)
  const [prioritizeCulturalFit, setPrioritizeCulturalFit] = useState(false)
  const [selectedCandidate, setSelectedCandidate] = useState<Applicant | null>(null)

  // Load candidate assessments data
  const candidateAssessments = useMemo(() => {
    // In a real app, this would be loaded from an API
    return {
      APP001: {
        discProfile: {
          type: "DC",
          primaryStyle: "Dominance",
          secondaryStyle: "Conscientiousness",
          summary: "Alex is a results-driven professional who combines assertiveness with attention to detail.",
          strengths: ["Direct communication", "Goal orientation", "High standards", "Analytical thinking"],
          growthAreas: ["Building rapport", "Patience with process", "Relationship building"],
        },
        integrus360: {
          leadershipType: "Driver",
          color: "Red",
          profile: {
            type: "Driver",
            description: "Natural leader who thrives on challenges and drives results.",
            leadershipStrengths: ["Goal-oriented", "Decisive", "Strong project management"],
            developmentAreas: ["Team relationships", "Coaching skills", "Emotional intelligence"],
          },
        },
        culturalFitScore: 85,
        teamCompatibility: {
          overallScore: 82,
          compatibilityNotes: "Strong alignment with project management team dynamics",
          recommendations: [
            "Excellent fit for leadership roles",
            "May need support with relationship-focused team members",
          ],
        },
      },
      APP002: {
        discProfile: {
          type: "CS",
          primaryStyle: "Conscientiousness",
          secondaryStyle: "Steadiness",
          summary: "Maria is a methodical and reliable professional who values accuracy and consistency.",
          strengths: ["Attention to detail", "Reliable performance", "Analytical thinking", "Quality focus"],
          growthAreas: ["Taking initiative", "Flexibility with changes", "Building confidence"],
        },
        integrus360: {
          leadershipType: "Refiner",
          color: "Green",
          profile: {
            type: "Refiner",
            description: "Detail-oriented professional who excels at improving processes and ensuring quality.",
            leadershipStrengths: ["Process improvement", "Quality control", "Analytical problem-solving"],
            developmentAreas: ["Taking initiative", "Building confidence", "Strategic thinking"],
          },
        },
        culturalFitScore: 92,
        teamCompatibility: {
          overallScore: 88,
          compatibilityNotes: "Excellent fit for estimating team, strong analytical skills",
          recommendations: ["Perfect fit for detail-oriented roles", "Strong alignment with quality-focused teams"],
        },
      },
      APP003: {
        discProfile: {
          type: "DI",
          primaryStyle: "Dominance",
          secondaryStyle: "Influence",
          summary: "James is a dynamic and energetic professional who combines assertiveness with people skills.",
          strengths: [
            "Dynamic leadership",
            "Building team enthusiasm",
            "Quick decision-making",
            "Inspiring performance",
          ],
          growthAreas: ["Patience with details", "Administrative follow-through", "Balancing enthusiasm with planning"],
        },
        integrus360: {
          leadershipType: "Creator",
          color: "Yellow",
          profile: {
            type: "Creator",
            description:
              "Innovative and energetic professional who excels at inspiring teams and driving creative solutions.",
            leadershipStrengths: ["Inspiring teams", "Creative problem-solving", "Dynamic leadership"],
            developmentAreas: ["Administrative details", "Systematic approaches", "Planning and organization"],
          },
        },
        culturalFitScore: 78,
        teamCompatibility: {
          overallScore: 85,
          compatibilityNotes: "Good fit for field operations, may need support with detail-oriented tasks",
          recommendations: ["Excellent for dynamic environments", "May need pairing with detail-oriented team members"],
        },
      },
    } as Record<
      string,
      {
        discProfile: {
          type: string
          primaryStyle: string
          secondaryStyle: string
          summary: string
          strengths: string[]
          growthAreas: string[]
        }
        integrus360: {
          leadershipType: string
          color: string
          profile: {
            type: string
            description: string
            leadershipStrengths: string[]
            developmentAreas: string[]
          }
        }
        culturalFitScore: number
        teamCompatibility: {
          overallScore: number
          compatibilityNotes: string
          recommendations: string[]
        }
      }
    >
  }, [])

  // Job postings state
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([
    {
      id: "JOB001",
      title: "Senior Project Manager",
      description: "Lead construction projects from inception to completion...",
      location: "Seattle, WA",
      department: "Operations",
      salaryMin: 95000,
      salaryMax: 120000,
      status: "Open",
      applications: 24,
      postedDate: "2024-01-15",
      jobUrl: "https://hb.com/careers/senior-project-manager",
      distributedTo: ["Company Website", "LinkedIn"],
    },
    {
      id: "JOB002",
      title: "Estimator",
      description: "Prepare detailed cost estimates for construction projects...",
      location: "Portland, OR",
      department: "Pre-Construction",
      salaryMin: 75000,
      salaryMax: 95000,
      status: "Open",
      applications: 18,
      postedDate: "2024-01-20",
      jobUrl: "https://hb.com/careers/estimator",
      distributedTo: ["Company Website", "LinkedIn", "External Recruiters"],
    },
    {
      id: "JOB003",
      title: "Field Engineer",
      description: "Support field operations and quality control...",
      location: "San Francisco, CA",
      department: "Field Operations",
      salaryMin: 65000,
      salaryMax: 85000,
      status: "Open",
      applications: 31,
      postedDate: "2024-01-25",
      jobUrl: "https://hb.com/careers/field-engineer",
      distributedTo: ["Company Website"],
    },
  ])

  // Applicants state
  const [applicants, setApplicants] = useState<Applicant[]>([
    {
      id: "APP001",
      firstName: "Alex",
      lastName: "Rodriguez",
      email: "alex.rodriguez@email.com",
      phone: "(206) 555-0123",
      jobId: "JOB001",
      jobTitle: "Senior Project Manager",
      status: "Interview",
      appliedDate: "2024-01-20",
      resume: "alex-rodriguez-resume.pdf",
      notes: "Strong construction background, 8 years experience",
      reviewer: "Sarah Johnson",
      avatar: "/avatars/alex-rodriguez.png",
    },
    {
      id: "APP002",
      firstName: "Maria",
      lastName: "Garcia",
      email: "maria.garcia@email.com",
      phone: "(503) 555-0456",
      jobId: "JOB002",
      jobTitle: "Estimator",
      status: "Applied",
      appliedDate: "2024-01-22",
      resume: "maria-garcia-resume.pdf",
      notes: "Recent graduate, strong academic background",
      reviewer: "Michael Chen",
      avatar: "/avatars/maria-garcia.png",
    },
    {
      id: "APP003",
      firstName: "James",
      lastName: "Wilson",
      email: "james.wilson@email.com",
      phone: "(415) 555-0789",
      jobId: "JOB003",
      jobTitle: "Field Engineer",
      status: "Offer",
      appliedDate: "2024-01-18",
      resume: "james-wilson-resume.pdf",
      notes: "Excellent technical skills, ready to start immediately",
      reviewer: "Emily Rodriguez",
      avatar: "/avatars/james-wilson.png",
    },
  ])

  // Modal states
  const [showJobModal, setShowJobModal] = useState(false)
  const [showApplicantModal, setShowApplicantModal] = useState(false)
  const [editingJob, setEditingJob] = useState<JobPosting | null>(null)
  const [editingApplicant, setEditingApplicant] = useState<Applicant | null>(null)
  const [showDistributionModal, setShowDistributionModal] = useState(false)
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null)

  // Form states
  const [jobFormData, setJobFormData] = useState<JobFormData>({
    title: "",
    description: "",
    location: "",
    department: "",
    salaryMin: 0,
    salaryMax: 0,
    requirements: "",
    benefits: "",
    targetDiscProfiles: [],
    targetIntegrusTypes: [],
    culturalFitCriteria: {
      leadershipOriented: false,
      resultsDriven: false,
      teamCollaboration: false,
      detailOriented: false,
      processFocused: false,
    },
    priorityWeight: 0.5,
  })

  const [applicantFormData, setApplicantFormData] = useState<ApplicantFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    jobId: "",
    resume: "",
    coverLetter: "",
    notes: "",
  })

  // Distribution partners
  const distributionPartners = [
    "Company Website",
    "LinkedIn",
    "Indeed",
    "Glassdoor",
    "External Recruiters",
    "Industry Associations",
    "University Career Centers",
  ]

  // Departments
  const departments = [
    "Operations",
    "Pre-Construction",
    "Field Operations",
    "Safety",
    "Finance",
    "Human Resources",
    "IT",
    "Marketing",
    "Legal",
  ]

  // Locations
  const locations = [
    "Seattle, WA",
    "Portland, OR",
    "San Francisco, CA",
    "Denver, CO",
    "Los Angeles, CA",
    "Phoenix, AZ",
    "Las Vegas, NV",
    "Salt Lake City, UT",
  ]

  // Reviewers
  const reviewers = [
    "Sarah Johnson",
    "Michael Chen",
    "Emily Rodriguez",
    "David Thompson",
    "Lisa Wang",
    "Alex Singh",
    "Jordan Lee",
  ]

  // Generate job URL
  const generateJobUrl = useCallback((title: string) => {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
    return `https://hb.com/careers/${slug}`
  }, [])

  // Handle job form submission
  const handleJobSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()

      if (editingJob) {
        // Update existing job
        setJobPostings((prev) =>
          prev.map((job) =>
            job.id === editingJob.id ? { ...job, ...jobFormData, jobUrl: generateJobUrl(jobFormData.title) } : job
          )
        )
      } else {
        // Create new job
        const newJob: JobPosting = {
          id: `JOB${String(jobPostings.length + 1).padStart(3, "0")}`,
          ...jobFormData,
          status: "Open",
          applications: 0,
          postedDate: format(new Date(), "yyyy-MM-dd"),
          jobUrl: generateJobUrl(jobFormData.title),
          distributedTo: [],
        }
        setJobPostings((prev) => [...prev, newJob])
      }

      setShowJobModal(false)
      setEditingJob(null)
      setJobFormData({
        title: "",
        description: "",
        location: "",
        department: "",
        salaryMin: 0,
        salaryMax: 0,
        requirements: "",
        benefits: "",
        targetDiscProfiles: [],
        targetIntegrusTypes: [],
        culturalFitCriteria: {
          leadershipOriented: false,
          resultsDriven: false,
          teamCollaboration: false,
          detailOriented: false,
          processFocused: false,
        },
        priorityWeight: 0.5,
      })
    },
    [editingJob, jobFormData, jobPostings, generateJobUrl]
  )

  // Handle applicant form submission
  const handleApplicantSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()

      if (editingApplicant) {
        // Update existing applicant
        setApplicants((prev) =>
          prev.map((app) => (app.id === editingApplicant.id ? { ...app, ...applicantFormData } : app))
        )
      } else {
        // Create new applicant
        const job = jobPostings.find((j) => j.id === applicantFormData.jobId)
        const newApplicant: Applicant = {
          id: `APP${String(applicants.length + 1).padStart(3, "0")}`,
          ...applicantFormData,
          jobTitle: job?.title || "",
          status: "Applied",
          appliedDate: format(new Date(), "yyyy-MM-dd"),
          notes: applicantFormData.notes,
          reviewer: "",
          avatar: `/avatars/${applicantFormData.firstName.toLowerCase()}-${applicantFormData.lastName.toLowerCase()}.png`,
        }
        setApplicants((prev) => [...prev, newApplicant])

        // Update application count
        setJobPostings((prev) =>
          prev.map((job) => (job.id === applicantFormData.jobId ? { ...job, applications: job.applications + 1 } : job))
        )
      }

      setShowApplicantModal(false)
      setEditingApplicant(null)
      setApplicantFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        jobId: "",
        resume: "",
        coverLetter: "",
        notes: "",
      })
    },
    [editingApplicant, applicantFormData, applicants, jobPostings]
  )

  // Handle job distribution
  const handleDistributeJob = useCallback((job: JobPosting, platforms: string[]) => {
    setJobPostings((prev) =>
      prev.map((j) => (j.id === job.id ? { ...j, distributedTo: [...new Set([...j.distributedTo, ...platforms])] } : j))
    )
    setShowDistributionModal(false)
    setSelectedJob(null)
  }, [])

  // Job posting grid columns
  const jobColumns: ProtectedColDef[] = useMemo(
    () => [
      {
        field: "title",
        headerName: "Job Title",
        width: 200,
        pinned: "left",
        cellRenderer: ({ value }: { value: string }) => (
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-primary" />
            <span className="font-medium">{value}</span>
          </div>
        ),
      },
      {
        field: "department",
        headerName: "Department",
        width: 150,
        cellRenderer: ({ value }: { value: string }) => (
          <div className="flex items-center gap-2">
            <Building2 className="h-3 w-3 text-muted-foreground" />
            <span>{value}</span>
          </div>
        ),
      },
      {
        field: "location",
        headerName: "Location",
        width: 140,
        cellRenderer: ({ value }: { value: string }) => (
          <div className="flex items-center gap-2">
            <MapPin className="h-3 w-3 text-muted-foreground" />
            <span>{value}</span>
          </div>
        ),
      },
      {
        field: "salary",
        headerName: "Salary Range",
        width: 150,
        cellRenderer: ({ data }: { data: JobPosting }) => (
          <div className="flex items-center gap-2">
            <DollarSign className="h-3 w-3 text-green-600" />
            <span>
              ${data.salaryMin.toLocaleString()} - ${data.salaryMax.toLocaleString()}
            </span>
          </div>
        ),
      },
      {
        field: "status",
        headerName: "Status",
        width: 120,
        cellRenderer: ({ value }: { value: string }) => {
          const statusConfig = {
            Open: {
              variant: "outline",
              className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
            },
            Closed: { variant: "outline", className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" },
            Draft: {
              variant: "outline",
              className: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
            },
          }
          const config = statusConfig[value as keyof typeof statusConfig]
          return (
            <Badge variant={config.variant as any} className={config.className}>
              {value}
            </Badge>
          )
        },
      },
      {
        field: "applications",
        headerName: "Applications",
        width: 120,
        cellRenderer: ({ value }: { value: number }) => (
          <div className="flex items-center gap-2">
            <Users className="h-3 w-3 text-muted-foreground" />
            <span className="font-medium">{value}</span>
          </div>
        ),
      },
      {
        field: "postedDate",
        headerName: "Posted Date",
        width: 120,
        cellRenderer: ({ value }: { value: string }) => (
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span>{format(new Date(value), "MMM dd")}</span>
          </div>
        ),
      },
      {
        field: "actions",
        headerName: "Actions",
        width: 200,
        cellRenderer: ({ data }: { data: JobPosting }) => (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setEditingJob(data)
                setJobFormData({
                  title: data.title,
                  description: data.description,
                  location: data.location,
                  department: data.department,
                  salaryMin: data.salaryMin,
                  salaryMax: data.salaryMax,
                  requirements: "",
                  benefits: "",
                  targetDiscProfiles: data.targetDiscProfiles || [],
                  targetIntegrusTypes: data.targetIntegrusTypes || [],
                  culturalFitCriteria: data.culturalFitCriteria || {
                    leadershipOriented: false,
                    resultsDriven: false,
                    teamCollaboration: false,
                    detailOriented: false,
                    processFocused: false,
                  },
                  priorityWeight: data.priorityWeight || 0.5,
                })
                setShowJobModal(true)
              }}
              title="Edit Job"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedJob(data)
                setShowDistributionModal(true)
              }}
              title="Distribute Job"
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => window.open(data.jobUrl, "_blank")} title="View Job Post">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        ),
        protection: { level: "none" },
      },
    ],
    []
  )

  // Applicant grid columns
  const applicantColumns: ProtectedColDef[] = useMemo(
    () => [
      {
        field: "name",
        headerName: "Applicant",
        width: 200,
        pinned: "left",
        cellRenderer: ({ data }: { data: Applicant }) => (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={data.avatar} alt={`${data.firstName} ${data.lastName}`} />
              <AvatarFallback>
                {data.firstName.charAt(0)}
                {data.lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{`${data.firstName} ${data.lastName}`}</div>
              <div className="text-xs text-muted-foreground">{data.email}</div>
            </div>
          </div>
        ),
      },
      {
        field: "jobTitle",
        headerName: "Position",
        width: 180,
        cellRenderer: ({ value }: { value: string }) => (
          <div className="flex items-center gap-2">
            <Briefcase className="h-3 w-3 text-muted-foreground" />
            <span>{value}</span>
          </div>
        ),
      },
      {
        field: "status",
        headerName: "Status",
        width: 120,
        cellRenderer: ({ value }: { value: string }) => {
          const statusConfig = {
            Applied: {
              variant: "outline",
              className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
            },
            Interview: {
              variant: "outline",
              className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
            },
            Offer: {
              variant: "outline",
              className: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
            },
            Hired: {
              variant: "outline",
              className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
            },
            Rejected: { variant: "outline", className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" },
          }
          const config = statusConfig[value as keyof typeof statusConfig]
          return (
            <Badge variant={config.variant as any} className={config.className}>
              {value}
            </Badge>
          )
        },
      },
      {
        field: "appliedDate",
        headerName: "Applied",
        width: 120,
        cellRenderer: ({ value }: { value: string }) => (
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span>{format(new Date(value), "MMM dd")}</span>
          </div>
        ),
      },
      {
        field: "reviewer",
        headerName: "Reviewer",
        width: 150,
        cellRenderer: ({ value }: { value: string }) => (
          <div className="flex items-center gap-2">
            <UserPlus className="h-3 w-3 text-muted-foreground" />
            <span>{value || "Unassigned"}</span>
          </div>
        ),
      },
      {
        field: "culturalFit",
        headerName: "Cultural Fit",
        width: 120,
        cellRenderer: ({ data }: { data: Applicant }) => {
          const assessment = candidateAssessments[data.id]
          if (!assessment) {
            return <span className="text-muted-foreground text-sm">No data</span>
          }
          const score = assessment.culturalFitScore
          const getScoreColor = (score: number) => {
            if (score >= 85) return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
            if (score >= 70) return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
            if (score >= 50) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
            return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
          }
          return (
            <Badge variant="outline" className={getScoreColor(score)}>
              {score}%
            </Badge>
          )
        },
      },
      {
        field: "actions",
        headerName: "Actions",
        width: 200,
        cellRenderer: ({ data }: { data: Applicant }) => (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setEditingApplicant(data)
                setApplicantFormData({
                  firstName: data.firstName,
                  lastName: data.lastName,
                  email: data.email,
                  phone: data.phone,
                  jobId: data.jobId,
                  resume: data.resume,
                  coverLetter: "",
                  notes: data.notes,
                })
                setShowApplicantModal(true)
              }}
              title="Edit Applicant"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(`/resumes/${data.resume}`, "_blank")}
              title="View Resume"
            >
              <FileText className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" title="Send Message">
              <MessageSquare className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedCandidate(data)
                setShowCulturalFit(true)
              }}
              title="View Cultural Fit"
            >
              <Users className="h-4 w-4" />
            </Button>
          </div>
        ),
        protection: { level: "none" },
      },
    ],
    []
  )

  // Transform data for grids
  const jobGridData: GridRow[] = useMemo(() => jobPostings, [jobPostings])
  const applicantGridData: GridRow[] = useMemo(
    () =>
      applicants.map((app) => ({
        ...app,
        name: `${app.firstName} ${app.lastName}`,
      })),
    [applicants]
  )

  // Grid configurations
  const jobGridConfig = createGridWithTotalsAndSticky(1, false, {
    allowExport: true,
    allowRowSelection: true,
    allowMultiSelection: false,
    protectionEnabled: true,
    userRole: "hr-payroll",
    theme: "quartz",
  })

  const applicantGridConfig = createGridWithTotalsAndSticky(1, false, {
    allowExport: true,
    allowRowSelection: true,
    allowMultiSelection: false,
    protectionEnabled: true,
    userRole: "hr-payroll",
    theme: "quartz",
  })

  return (
    <HrPayrollLayout>
      <div className="p-6">
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Open Positions</CardTitle>
                <Badge variant="outline">{jobPostings.filter((j) => j.status === "Open").length}</Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{jobPostings.filter((j) => j.status === "Open").length}</div>
                <p className="text-xs text-muted-foreground">Active job postings</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                  {applicants.length}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{applicants.length}</div>
                <p className="text-xs text-muted-foreground">+12 this week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Interviews Scheduled</CardTitle>
                <Badge variant="secondary">{applicants.filter((a) => a.status === "Interview").length}</Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{applicants.filter((a) => a.status === "Interview").length}</div>
                <p className="text-xs text-muted-foreground">This week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Hire Rate</CardTitle>
                <Badge
                  variant="outline"
                  className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                >
                  78%
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">78%</div>
                <p className="text-xs text-muted-foreground">+5% from last month</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="open-positions">Open Positions</TabsTrigger>
              <TabsTrigger value="applicants">Applicants</TabsTrigger>
            </TabsList>

            {/* Open Positions Tab */}
            <TabsContent value="open-positions" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Job Postings</CardTitle>
                      <CardDescription>Manage open positions and job postings</CardDescription>
                    </div>
                    <Button onClick={() => setShowJobModal(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Job Post
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <ProtectedGrid
                    columnDefs={jobColumns}
                    rowData={jobGridData}
                    config={jobGridConfig}
                    height="500px"
                    title="Job Postings"
                    enableSearch={true}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Applicants Tab */}
            <TabsContent value="applicants" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Applicants</CardTitle>
                      <CardDescription>Manage job applications and candidate pipeline</CardDescription>
                    </div>
                    <Button onClick={() => setShowApplicantModal(true)}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add Applicant
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <ProtectedGrid
                    columnDefs={applicantColumns}
                    rowData={applicantGridData}
                    config={applicantGridConfig}
                    height="500px"
                    title="Applicants"
                    enableSearch={true}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Job Form Modal */}
        <Dialog open={showJobModal} onOpenChange={setShowJobModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {editingJob ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                {editingJob ? "Edit Job Posting" : "Create New Job Posting"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleJobSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Job Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Job Title *</Label>
                    <Input
                      id="title"
                      value={jobFormData.title}
                      onChange={(e) => setJobFormData({ ...jobFormData, title: e.target.value })}
                      placeholder="e.g., Senior Project Manager"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department *</Label>
                    <Select
                      value={jobFormData.department}
                      onValueChange={(value) => setJobFormData({ ...jobFormData, department: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Select
                      value={jobFormData.location}
                      onValueChange={(value) => setJobFormData({ ...jobFormData, location: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((loc) => (
                          <SelectItem key={loc} value={loc}>
                            {loc}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salaryMin">Salary Range *</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        id="salaryMin"
                        type="number"
                        value={jobFormData.salaryMin}
                        onChange={(e) => setJobFormData({ ...jobFormData, salaryMin: parseFloat(e.target.value) || 0 })}
                        placeholder="Min salary"
                        required
                      />
                      <Input
                        id="salaryMax"
                        type="number"
                        value={jobFormData.salaryMax}
                        onChange={(e) => setJobFormData({ ...jobFormData, salaryMax: parseFloat(e.target.value) || 0 })}
                        placeholder="Max salary"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Job Description */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Job Description</h3>
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={jobFormData.description}
                    onChange={(e) => setJobFormData({ ...jobFormData, description: e.target.value })}
                    placeholder="Describe the role, responsibilities, and requirements..."
                    rows={4}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="requirements">Requirements</Label>
                    <Textarea
                      id="requirements"
                      value={jobFormData.requirements}
                      onChange={(e) => setJobFormData({ ...jobFormData, requirements: e.target.value })}
                      placeholder="Required skills, experience, and qualifications..."
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="benefits">Benefits</Label>
                    <Textarea
                      id="benefits"
                      value={jobFormData.benefits}
                      onChange={(e) => setJobFormData({ ...jobFormData, benefits: e.target.value })}
                      placeholder="Benefits, perks, and company culture..."
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Cultural Fit Criteria */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Cultural Fit Criteria</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Target DiSC Profiles</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {["D", "I", "S", "C"].map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox
                            id={`disc-${type}`}
                            checked={jobFormData.targetDiscProfiles.includes(type)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setJobFormData({
                                  ...jobFormData,
                                  targetDiscProfiles: [...jobFormData.targetDiscProfiles, type],
                                })
                              } else {
                                setJobFormData({
                                  ...jobFormData,
                                  targetDiscProfiles: jobFormData.targetDiscProfiles.filter((t) => t !== type),
                                })
                              }
                            }}
                          />
                          <Label htmlFor={`disc-${type}`} className="text-sm">
                            {type} -{" "}
                            {type === "D"
                              ? "Dominance"
                              : type === "I"
                              ? "Influence"
                              : type === "S"
                              ? "Steadiness"
                              : "Conscientiousness"}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Target Integrus 360 Types</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {["Driver", "Creator", "Supporter", "Refiner"].map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox
                            id={`integrus-${type}`}
                            checked={jobFormData.targetIntegrusTypes.includes(type)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setJobFormData({
                                  ...jobFormData,
                                  targetIntegrusTypes: [...jobFormData.targetIntegrusTypes, type],
                                })
                              } else {
                                setJobFormData({
                                  ...jobFormData,
                                  targetIntegrusTypes: jobFormData.targetIntegrusTypes.filter((t) => t !== type),
                                })
                              }
                            }}
                          />
                          <Label htmlFor={`integrus-${type}`} className="text-sm">
                            {type}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Cultural Fit Criteria</Label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {Object.entries(jobFormData.culturalFitCriteria).map(([criterion, value]) => (
                      <div key={criterion} className="flex items-center space-x-2">
                        <Checkbox
                          id={`criteria-${criterion}`}
                          checked={value}
                          onCheckedChange={(checked) =>
                            setJobFormData({
                              ...jobFormData,
                              culturalFitCriteria: {
                                ...jobFormData.culturalFitCriteria,
                                [criterion]: checked,
                              },
                            })
                          }
                        />
                        <Label htmlFor={`criteria-${criterion}`} className="text-sm capitalize">
                          {criterion.replace(/([A-Z])/g, " $1").trim()}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priorityWeight">Cultural Fit Priority Weight</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="priorityWeight"
                      type="number"
                      min="0"
                      max="1"
                      step="0.1"
                      value={jobFormData.priorityWeight}
                      onChange={(e) =>
                        setJobFormData({ ...jobFormData, priorityWeight: parseFloat(e.target.value) || 0.5 })
                      }
                      className="w-24"
                    />
                    <span className="text-sm text-muted-foreground">(0.0 - 1.0)</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowJobModal(false)}>
                  Cancel
                </Button>
                <Button type="submit">{editingJob ? "Update Job Post" : "Create Job Post"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Applicant Form Modal */}
        <Dialog open={showApplicantModal} onOpenChange={setShowApplicantModal}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {editingApplicant ? <Edit className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
                {editingApplicant ? "Edit Applicant" : "Add New Applicant"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleApplicantSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={applicantFormData.firstName}
                    onChange={(e) => setApplicantFormData({ ...applicantFormData, firstName: e.target.value })}
                    placeholder="First name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={applicantFormData.lastName}
                    onChange={(e) => setApplicantFormData({ ...applicantFormData, lastName: e.target.value })}
                    placeholder="Last name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={applicantFormData.email}
                    onChange={(e) => setApplicantFormData({ ...applicantFormData, email: e.target.value })}
                    placeholder="applicant@email.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={applicantFormData.phone}
                    onChange={(e) => setApplicantFormData({ ...applicantFormData, phone: e.target.value })}
                    placeholder="(555) 555-0123"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobId">Applied Position *</Label>
                  <Select
                    value={applicantFormData.jobId}
                    onValueChange={(value) => setApplicantFormData({ ...applicantFormData, jobId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select job position" />
                    </SelectTrigger>
                    <SelectContent>
                      {jobPostings
                        .filter((j) => j.status === "Open")
                        .map((job) => (
                          <SelectItem key={job.id} value={job.id}>
                            {job.title} - {job.location}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="resume">Resume File</Label>
                  <Input
                    id="resume"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        setApplicantFormData({ ...applicantFormData, resume: file.name })
                      }
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="coverLetter">Cover Letter</Label>
                <Textarea
                  id="coverLetter"
                  value={applicantFormData.coverLetter}
                  onChange={(e) => setApplicantFormData({ ...applicantFormData, coverLetter: e.target.value })}
                  placeholder="Cover letter or additional notes..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={applicantFormData.notes}
                  onChange={(e) => setApplicantFormData({ ...applicantFormData, notes: e.target.value })}
                  placeholder="Internal notes about the applicant..."
                  rows={2}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowApplicantModal(false)}>
                  Cancel
                </Button>
                <Button type="submit">{editingApplicant ? "Update Applicant" : "Add Applicant"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Distribution Modal */}
        <Dialog open={showDistributionModal} onOpenChange={setShowDistributionModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                Distribute Job Posting
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {selectedJob && (
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">{selectedJob.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      {selectedJob.location} • {selectedJob.department}
                    </p>
                    <p className="text-sm">
                      ${selectedJob.salaryMin.toLocaleString()} - ${selectedJob.salaryMax.toLocaleString()}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Select Distribution Channels</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {distributionPartners.map((partner) => (
                        <div key={partner} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={partner}
                            className="rounded"
                            defaultChecked={selectedJob.distributedTo.includes(partner)}
                          />
                          <label htmlFor={partner} className="text-sm">
                            {partner}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Alert>
                    <Globe className="h-4 w-4" />
                    <AlertDescription>
                      Job postings will be automatically distributed to selected channels. External recruiters will
                      receive notifications via email.
                    </AlertDescription>
                  </Alert>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowDistributionModal(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => handleDistributeJob(selectedJob, ["Company Website", "LinkedIn"])}>
                      <Send className="h-4 w-4 mr-2" />
                      Distribute Job
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Cultural Fit Evaluation Modal */}
        <Dialog open={showCulturalFit} onOpenChange={setShowCulturalFit}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Cultural Fit Evaluation
              </DialogTitle>
            </DialogHeader>

            {selectedCandidate && candidateAssessments[selectedCandidate.id] && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {selectedCandidate.firstName} {selectedCandidate.lastName}
                    </h3>
                    <p className="text-sm text-muted-foreground">{selectedCandidate.jobTitle}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={prioritizeCulturalFit}
                        onCheckedChange={setPrioritizeCulturalFit}
                        id="prioritize-cultural-fit"
                      />
                      <Label htmlFor="prioritize-cultural-fit">Auto-prioritize cultural fit</Label>
                    </div>
                  </div>
                </div>

                <CulturalFitEvaluation
                  candidate={{
                    candidateId: selectedCandidate.id,
                    firstName: selectedCandidate.firstName,
                    lastName: selectedCandidate.lastName,
                    jobId: selectedCandidate.jobId,
                    jobTitle: selectedCandidate.jobTitle,
                    ...candidateAssessments[selectedCandidate.id],
                  }}
                  jobCriteria={{
                    title: selectedCandidate.jobTitle,
                    targetDiscProfiles: ["DC", "CS", "DI"],
                    targetIntegrusTypes: ["Driver", "Refiner", "Creator"],
                    culturalFitCriteria: {
                      leadershipOriented: true,
                      resultsDriven: true,
                      teamCollaboration: true,
                      detailOriented: false,
                      processFocused: false,
                    },
                    priorityWeight: 0.8,
                  }}
                  onPrioritize={(candidateId) => {
                    // Handle prioritization logic
                    console.log("Prioritizing candidate:", candidateId)
                  }}
                  isPrioritized={false}
                />
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </HrPayrollLayout>
  )
}
